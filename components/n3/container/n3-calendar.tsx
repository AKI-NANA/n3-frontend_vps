// components/n3/container/n3-calendar.tsx
/**
 * N3Calendar - カレンダーコンポーネント (Container)
 * 日付選択、イベント表示、範囲選択対応
 */

'use client';

import React, { memo, useState, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { N3Button } from '../presentational/n3-button';

export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  color?: string;
  data?: any;
}

export interface N3CalendarProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  rangeMode?: boolean;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  onRangeChange?: (start: Date | null, end: Date | null) => void;
  showWeekNumbers?: boolean;
  locale?: string;
  firstDayOfWeek?: 0 | 1; // 0: Sunday, 1: Monday
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
  style?: React.CSSProperties;
}

const WEEKDAYS_JP = ['日', '月', '火', '水', '木', '金', '土'];
const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_JP = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 日付ユーティリティ
const isSameDay = (d1: Date, d2: Date): boolean =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const isInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false;
  const d = date.getTime();
  const s = start.getTime();
  const e = end.getTime();
  return d >= Math.min(s, e) && d <= Math.max(s, e);
};

const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number): number =>
  new Date(year, month, 1).getDay();

export const N3Calendar = memo(function N3Calendar({
  value,
  onChange,
  events = [],
  onEventClick,
  minDate,
  maxDate,
  disabledDates = [],
  rangeMode = false,
  rangeStart,
  rangeEnd,
  onRangeChange,
  showWeekNumbers = false,
  locale = 'ja',
  firstDayOfWeek = 0,
  variant = 'default',
  className = '',
  style,
}: N3CalendarProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(() => value || today);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selectingRange, setSelectingRange] = useState(false);

  const weekdays = locale === 'ja' ? WEEKDAYS_JP : WEEKDAYS_EN;
  const months = locale === 'ja' ? MONTHS_JP : MONTHS_EN;

  // 週の開始日を考慮した曜日配列
  const orderedWeekdays = useMemo(() => {
    if (firstDayOfWeek === 1) {
      return [...weekdays.slice(1), weekdays[0]];
    }
    return weekdays;
  }, [weekdays, firstDayOfWeek]);

  // カレンダー日付生成
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    let firstDay = getFirstDayOfMonth(year, month);

    // 週の開始日調整
    if (firstDayOfWeek === 1) {
      firstDay = firstDay === 0 ? 6 : firstDay - 1;
    }

    const days: (Date | null)[] = [];

    // 前月の日
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 今月の日
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [viewDate, firstDayOfWeek]);

  // イベントマップ
  const eventMap = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach(event => {
      const key = `${event.date.getFullYear()}-${event.date.getMonth()}-${event.date.getDate()}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(event);
    });
    return map;
  }, [events]);

  // 日付が無効かチェック
  const isDisabled = useCallback(
    (date: Date): boolean => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return disabledDates.some(d => isSameDay(d, date));
    },
    [minDate, maxDate, disabledDates]
  );

  // 月移動
  const handlePrevMonth = useCallback(() => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleToday = useCallback(() => {
    setViewDate(today);
    if (!rangeMode && onChange) {
      onChange(today);
    }
  }, [today, rangeMode, onChange]);

  // 日付クリック
  const handleDateClick = useCallback(
    (date: Date) => {
      if (isDisabled(date)) return;

      if (rangeMode) {
        if (!selectingRange || !rangeStart) {
          setSelectingRange(true);
          onRangeChange?.(date, null);
        } else {
          setSelectingRange(false);
          onRangeChange?.(rangeStart, date);
        }
      } else {
        onChange?.(date);
      }
    },
    [isDisabled, rangeMode, selectingRange, rangeStart, onChange, onRangeChange]
  );

  // イベントクリック
  const handleEventClick = useCallback(
    (e: React.MouseEvent, event: CalendarEvent) => {
      e.stopPropagation();
      onEventClick?.(event);
    },
    [onEventClick]
  );

  // 日付セルのスタイル
  const getDayStyle = useCallback(
    (date: Date | null) => {
      if (!date) {
        return {
          visibility: 'hidden' as const,
        };
      }

      const isToday = isSameDay(date, today);
      const isSelected = value && isSameDay(date, value);
      const disabled = isDisabled(date);
      const inRange =
        rangeMode && isInRange(date, rangeStart, selectingRange && hoverDate ? hoverDate : rangeEnd);
      const isRangeEdge =
        rangeMode &&
        ((rangeStart && isSameDay(date, rangeStart)) ||
          (rangeEnd && isSameDay(date, rangeEnd)));

      const baseStyle: React.CSSProperties = {
        width: variant === 'compact' ? '28px' : '36px',
        height: variant === 'compact' ? '28px' : '36px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--style-radius-md, 8px)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: variant === 'compact' ? '11px' : '13px',
        fontWeight: isToday || isSelected ? 600 : 400,
        transition: 'all 0.15s ease',
        position: 'relative',
      };

      if (disabled) {
        return {
          ...baseStyle,
          color: 'var(--text-muted)',
          opacity: 0.4,
        };
      }

      if (isSelected || isRangeEdge) {
        return {
          ...baseStyle,
          background: 'var(--color-primary)',
          color: 'white',
        };
      }

      if (inRange) {
        return {
          ...baseStyle,
          background: 'rgba(99, 102, 241, 0.2)',
          color: 'var(--text)',
        };
      }

      if (isToday) {
        return {
          ...baseStyle,
          border: '1px solid var(--color-primary)',
          color: 'var(--color-primary)',
        };
      }

      return {
        ...baseStyle,
        color: 'var(--text)',
        background: 'transparent',
      };
    },
    [today, value, isDisabled, rangeMode, rangeStart, rangeEnd, selectingRange, hoverDate, variant]
  );

  // 週番号計算
  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  // インラインバリアント
  if (variant === 'inline') {
    return (
      <div className={className} style={{ display: 'flex', alignItems: 'center', gap: '8px', ...style }}>
        <N3Button variant="ghost" size="sm" onClick={handlePrevMonth}>
          <ChevronLeft size={14} />
        </N3Button>
        <span style={{ fontSize: '13px', fontWeight: 500, minWidth: '100px', textAlign: 'center' }}>
          {viewDate.getFullYear()}年 {months[viewDate.getMonth()]}
        </span>
        <N3Button variant="ghost" size="sm" onClick={handleNextMonth}>
          <ChevronRight size={14} />
        </N3Button>
      </div>
    );
  }

  return (
    <div
      className={`n3-calendar ${className}`}
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
        borderRadius: 'var(--style-radius-lg, 12px)',
        padding: variant === 'compact' ? '12px' : '16px',
        width: 'fit-content',
        ...style,
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <N3Button variant="ghost" size="sm" onClick={handlePrevMonth}>
          <ChevronLeft size={16} />
        </N3Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
            {viewDate.getFullYear()}年 {months[viewDate.getMonth()]}
          </span>
          <N3Button variant="ghost" size="xs" onClick={handleToday}>
            今日
          </N3Button>
        </div>

        <N3Button variant="ghost" size="sm" onClick={handleNextMonth}>
          <ChevronRight size={16} />
        </N3Button>
      </div>

      {/* 曜日ヘッダー */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: showWeekNumbers ? 'auto repeat(7, 1fr)' : 'repeat(7, 1fr)',
          gap: '2px',
          marginBottom: '8px',
        }}
      >
        {showWeekNumbers && (
          <div
            style={{
              width: '28px',
              fontSize: '10px',
              color: 'var(--text-muted)',
              textAlign: 'center',
            }}
          >
            週
          </div>
        )}
        {orderedWeekdays.map((day, i) => (
          <div
            key={day}
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color:
                (firstDayOfWeek === 0 && i === 0) || (firstDayOfWeek === 1 && i === 6)
                  ? 'var(--color-error)'
                  : i === (firstDayOfWeek === 0 ? 6 : 5)
                  ? 'var(--color-primary)'
                  : 'var(--text-muted)',
              textAlign: 'center',
              padding: '4px 0',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: showWeekNumbers ? 'auto repeat(7, 1fr)' : 'repeat(7, 1fr)',
          gap: '2px',
        }}
      >
        {calendarDays.map((date, index) => {
          const isFirstOfWeek = index % 7 === 0;
          const dayEvents = date
            ? eventMap.get(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`) || []
            : [];

          return (
            <React.Fragment key={index}>
              {showWeekNumbers && isFirstOfWeek && (
                <div
                  style={{
                    width: '28px',
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {date ? getWeekNumber(date) : ''}
                </div>
              )}
              <div
                style={getDayStyle(date)}
                onClick={() => date && handleDateClick(date)}
                onMouseEnter={() => rangeMode && selectingRange && date && setHoverDate(date)}
                onMouseLeave={() => rangeMode && setHoverDate(null)}
              >
                {date && (
                  <>
                    <span>{date.getDate()}</span>
                    {/* イベントドット */}
                    {dayEvents.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          gap: '2px',
                          position: 'absolute',
                          bottom: '2px',
                        }}
                      >
                        {dayEvents.slice(0, 3).map((event, i) => (
                          <div
                            key={event.id}
                            onClick={e => handleEventClick(e, event)}
                            style={{
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              background: event.color || 'var(--color-primary)',
                            }}
                            title={event.title}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* 範囲選択中の表示 */}
      {rangeMode && selectingRange && rangeStart && (
        <div
          style={{
            marginTop: '12px',
            padding: '8px',
            background: 'var(--highlight)',
            borderRadius: 'var(--style-radius-md, 8px)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          終了日を選択してください
        </div>
      )}
    </div>
  );
});

export default N3Calendar;
