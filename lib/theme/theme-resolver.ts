// =============================================================================
// テーマ判定ロジック - 旧暦・イベント連動UI切替システム
// =============================================================================

import {
  ThemeId,
  ThemePriority,
  EVENT_CALENDAR,
  NATIONAL_HOLIDAYS_2025,
  GLOBAL_SHOPPING_DAYS,
  TIME_SCHEDULE,
  getThemeStyle,
} from './theme-config'

// -----------------------------------------------------------------------------
// 判定結果の型
// -----------------------------------------------------------------------------

export interface ThemeResolutionResult {
  themeId: ThemeId
  priority: ThemePriority
  reason: string
  details: {
    isEvent: boolean
    isHoliday: boolean
    isWeekend: boolean
    timeOfDay: ThemeId | null
    season: ThemeId
  }
}

// -----------------------------------------------------------------------------
// 日付ヘルパー関数
// -----------------------------------------------------------------------------

/**
 * 指定された日付が特定の期間内にあるかチェック
 */
function isDateInRange(
  date: Date,
  startMonth: number,
  startDay: number,
  endMonth: number,
  endDay: number
): boolean {
  const month = date.getMonth() + 1
  const day = date.getDate()

  // 年をまたぐケース (例: 12/20 - 1/5)
  if (startMonth > endMonth) {
    return (month > startMonth || (month === startMonth && day >= startDay)) ||
           (month < endMonth || (month === endMonth && day <= endDay))
  }

  // 同じ月内
  if (startMonth === endMonth) {
    return month === startMonth && day >= startDay && day <= endDay
  }

  // 通常ケース
  if (month > startMonth && month < endMonth) return true
  if (month === startMonth && day >= startDay) return true
  if (month === endMonth && day <= endDay) return true

  return false
}

/**
 * 土曜日または日曜日かチェック
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // 0 = 日曜, 6 = 土曜
}

/**
 * 祝日かチェック
 */
export function isNationalHoliday(date: Date): { isHoliday: boolean; name?: string; themeId?: ThemeId } {
  const month = date.getMonth() + 1
  const day = date.getDate()

  // 国民の祝日をチェック
  const holiday = NATIONAL_HOLIDAYS_2025.find(h => h.month === month && h.day === day)
  if (holiday) {
    return { isHoliday: true, name: holiday.name, themeId: holiday.themeId }
  }

  // 世界の商戦日をチェック
  const shoppingDay = GLOBAL_SHOPPING_DAYS.find(h => h.month === month && h.day === day)
  if (shoppingDay) {
    return { isHoliday: true, name: shoppingDay.name, themeId: shoppingDay.themeId }
  }

  return { isHoliday: false }
}

/**
 * 現在の時間帯を判定
 */
export function getTimeOfDay(date: Date): ThemeId {
  const hour = date.getHours()

  for (const slot of TIME_SCHEDULE) {
    // 深夜（21時〜4時）のように日をまたぐケース
    if (slot.startHour > slot.endHour) {
      if (hour >= slot.startHour || hour < slot.endHour) {
        return slot.id
      }
    } else {
      if (hour >= slot.startHour && hour < slot.endHour) {
        return slot.id
      }
    }
  }

  return 'daytime' // デフォルト
}

/**
 * 現在の季節を判定
 */
export function getSeason(date: Date): ThemeId {
  const month = date.getMonth() + 1

  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

/**
 * イベント期間をチェック
 */
export function getActiveEvent(date: Date): { eventId: ThemeId; eventName: string; priority: number } | null {
  for (const event of EVENT_CALENDAR) {
    if (isDateInRange(date, event.startMonth, event.startDay, event.endMonth, event.endDay)) {
      return { eventId: event.id, eventName: event.name, priority: event.priority }
    }
  }
  return null
}

// -----------------------------------------------------------------------------
// メイン判定ロジック
// -----------------------------------------------------------------------------

/**
 * 優先順位に基づいてテーマを決定
 *
 * 優先順位:
 * 1. 特定イベント期間（ブラックフライデー、正月など）
 * 2. 祝日
 * 3. 土日
 * 4. 時間帯テーマ
 * 5. 季節テーマ
 */
export function resolveTheme(date: Date = new Date()): ThemeResolutionResult {
  const season = getSeason(date)
  const timeOfDay = getTimeOfDay(date)
  const weekend = isWeekend(date)
  const holidayInfo = isNationalHoliday(date)
  const activeEvent = getActiveEvent(date)

  // 詳細情報
  const details = {
    isEvent: !!activeEvent,
    isHoliday: holidayInfo.isHoliday,
    isWeekend: weekend,
    timeOfDay,
    season,
  }

  // 1. 最優先: イベント期間
  if (activeEvent) {
    return {
      themeId: activeEvent.eventId,
      priority: 'event',
      reason: `${activeEvent.eventName}期間中`,
      details,
    }
  }

  // 2. 高優先: 祝日（独自テーマがあれば適用）
  if (holidayInfo.isHoliday && holidayInfo.themeId) {
    return {
      themeId: holidayInfo.themeId,
      priority: 'holiday',
      reason: `祝日: ${holidayInfo.name}`,
      details,
    }
  }

  // 3. 中優先: 祝日（汎用）
  if (holidayInfo.isHoliday) {
    return {
      themeId: 'holiday',
      priority: 'holiday',
      reason: `祝日: ${holidayInfo.name}`,
      details,
    }
  }

  // 4. 週末
  if (weekend) {
    // 夜間は時間帯テーマを優先
    if (timeOfDay === 'night') {
      return {
        themeId: 'night',
        priority: 'time_of_day',
        reason: '深夜の時間帯',
        details,
      }
    }
    return {
      themeId: 'weekend',
      priority: 'weekend',
      reason: '週末',
      details,
    }
  }

  // 5. 時間帯（早朝・夕方・深夜は時間帯テーマを適用）
  if (timeOfDay !== 'daytime') {
    return {
      themeId: timeOfDay,
      priority: 'time_of_day',
      reason: `${getThemeStyle(timeOfDay).nameJa}の時間帯`,
      details,
    }
  }

  // 6. デフォルト: 季節テーマ
  return {
    themeId: season,
    priority: 'season',
    reason: `${getThemeStyle(season).nameJa}の季節`,
    details,
  }
}

/**
 * 特定の日付・時刻でテーマをシミュレート（デバッグ用）
 */
export function simulateTheme(
  year: number,
  month: number,
  day: number,
  hour: number = 12
): ThemeResolutionResult {
  const date = new Date(year, month - 1, day, hour, 0, 0)
  return resolveTheme(date)
}

/**
 * 今日の全時間帯のテーマをプレビュー
 */
export function previewTodayThemes(): Array<{ hour: number; theme: ThemeResolutionResult }> {
  const today = new Date()
  const results: Array<{ hour: number; theme: ThemeResolutionResult }> = []

  for (let hour = 0; hour < 24; hour++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, 0, 0)
    results.push({
      hour,
      theme: resolveTheme(date),
    })
  }

  return results
}

/**
 * 年間のイベントカレンダーを取得
 */
export function getYearlyEventCalendar(year: number = new Date().getFullYear()): Array<{
  date: Date
  themeId: ThemeId
  reason: string
}> {
  const events: Array<{ date: Date; themeId: ThemeId; reason: string }> = []

  // 全日をスキャン
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day, 12, 0, 0)
      const result = resolveTheme(date)

      // イベントまたは祝日のみを記録
      if (result.priority === 'event' || result.priority === 'holiday') {
        events.push({
          date,
          themeId: result.themeId,
          reason: result.reason,
        })
      }
    }
  }

  return events
}

// -----------------------------------------------------------------------------
// エクスポート
// -----------------------------------------------------------------------------

export {
  isDateInRange,
}
