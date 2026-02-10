'use client';

import React, { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

// ============================================================
// N3TimelineEvent - Presentational Component
// ============================================================
// タイムラインイベント（追跡情報表示など）
// 出荷管理の追跡パネルで使用
// ============================================================

export type N3TimelineEventStatus = 'completed' | 'current' | 'pending' | 'error';

export interface N3TimelineEventProps {
  /** ステータステキスト */
  status: string;
  /** 日時 */
  date?: string;
  /** 場所/詳細 */
  location?: string;
  /** イベントの状態 */
  eventStatus?: N3TimelineEventStatus;
  /** アイコン */
  icon?: LucideIcon;
  /** 最後のアイテムか */
  isLast?: boolean;
  /** カスタムクラス名 */
  className?: string;
}

export const N3TimelineEvent = memo(function N3TimelineEvent({
  status,
  date,
  location,
  eventStatus = 'pending',
  icon: Icon,
  isLast = false,
  className = '',
}: N3TimelineEventProps) {
  return (
    <div
      className={`n3-timeline-event n3-timeline-event--${eventStatus} ${isLast ? 'n3-timeline-event--last' : ''} ${className}`}
    >
      <div className="n3-timeline-event__indicator">
        <div className="n3-timeline-event__dot">
          {Icon && <Icon size={12} />}
        </div>
        {!isLast && <div className="n3-timeline-event__line" />}
      </div>
      <div className="n3-timeline-event__content">
        <div className="n3-timeline-event__status">{status}</div>
        {date && <div className="n3-timeline-event__date">{date}</div>}
        {location && <div className="n3-timeline-event__location">{location}</div>}
      </div>
    </div>
  );
});

N3TimelineEvent.displayName = 'N3TimelineEvent';

export default N3TimelineEvent;
