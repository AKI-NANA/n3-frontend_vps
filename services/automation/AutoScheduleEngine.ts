/**
 * 自動スケジュール生成エンジン
 * 承認済み商品に対して出品スケジュールを自動生成
 */

import {
  DefaultScheduleSettings,
  ProductForApproval,
  ScheduledItem,
  PlatformScheduleSettings,
} from '@/types/automation'

// デフォルト設定
export const DEFAULT_SCHEDULE_SETTINGS: Omit<DefaultScheduleSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  enabled: false,
  items_per_day: 30,
  sessions_per_day_min: 2,
  sessions_per_day_max: 4,
  item_interval_min: 30,
  item_interval_max: 120,
  session_interval_min: 3600,
  session_interval_max: 14400,
  preferred_hours: [10, 11, 14, 15, 19, 20],
  weekday_multiplier: 1.0,
  weekend_multiplier: 0.8,
  trigger_condition: 'daily_batch',
  batch_time: '09:00',
  platform_settings: {},
}

interface ScheduleSession {
  startHour: number
  items: ScheduledItem[]
}

interface ScheduleGenerationResult {
  scheduled_items: ScheduledItem[]
  skipped: { product_id: string; reason: string }[]
  errors: { product_id: string; error: string }[]
}

/**
 * スケジュールを生成する
 */
export function generateSchedule(
  products: ProductForApproval[],
  settings: DefaultScheduleSettings,
  targetDate: Date = new Date()
): ScheduleGenerationResult {
  const result: ScheduleGenerationResult = {
    scheduled_items: [],
    skipped: [],
    errors: [],
  }

  if (!settings.enabled) {
    products.forEach(p => {
      result.skipped.push({ product_id: p.id, reason: '自動スケジュールが無効です' })
    })
    return result
  }

  // 曜日による調整
  const dayOfWeek = targetDate.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  const multiplier = isWeekend ? settings.weekend_multiplier : settings.weekday_multiplier

  // 1日あたりの出品数を計算
  const adjustedItemsPerDay = Math.floor(settings.items_per_day * multiplier)

  // プラットフォーム別にグループ化
  const productsByPlatform = groupByPlatform(products)

  // 各プラットフォームのスケジュールを生成
  for (const [platform, platformProducts] of Object.entries(productsByPlatform)) {
    const platformSettings = settings.platform_settings[platform]
    const maxForPlatform = platformSettings?.max_per_day ?? adjustedItemsPerDay
    const preferredHours = platformSettings?.preferred_hours ?? settings.preferred_hours

    // 出品数を制限
    const productsToSchedule = platformProducts.slice(0, maxForPlatform)
    const skippedProducts = platformProducts.slice(maxForPlatform)

    // スキップされた商品を記録
    skippedProducts.forEach(p => {
      result.skipped.push({ product_id: p.id, reason: `1日の出品上限（${maxForPlatform}件）に達しました` })
    })

    // セッションを生成
    const sessions = generateSessions(
      productsToSchedule,
      preferredHours,
      settings,
      targetDate,
      platform
    )

    // セッションからスケジュールアイテムを抽出
    sessions.forEach(session => {
      result.scheduled_items.push(...session.items)
    })
  }

  return result
}

/**
 * プラットフォーム別にグループ化
 */
function groupByPlatform(products: ProductForApproval[]): Record<string, ProductForApproval[]> {
  const grouped: Record<string, ProductForApproval[]> = {}

  for (const product of products) {
    const platform = product.recommended_platform || 'ebay'
    if (!grouped[platform]) {
      grouped[platform] = []
    }
    grouped[platform].push(product)
  }

  return grouped
}

/**
 * セッションを生成
 */
function generateSessions(
  products: ProductForApproval[],
  preferredHours: number[],
  settings: DefaultScheduleSettings,
  targetDate: Date,
  platform: string
): ScheduleSession[] {
  const sessions: ScheduleSession[] = []

  if (products.length === 0 || preferredHours.length === 0) {
    return sessions
  }

  // セッション数を決定（ランダム化）
  const sessionCount = randomBetween(
    settings.sessions_per_day_min,
    Math.min(settings.sessions_per_day_max, preferredHours.length)
  )

  // 優先時間帯からセッション開始時間を選択
  const selectedHours = selectRandomHours(preferredHours, sessionCount)

  // 商品をセッションに分配
  const itemsPerSession = Math.ceil(products.length / sessionCount)
  let productIndex = 0

  for (const hour of selectedHours) {
    const session: ScheduleSession = {
      startHour: hour,
      items: [],
    }

    // このセッションの商品を割り当て
    const sessionProducts = products.slice(productIndex, productIndex + itemsPerSession)
    productIndex += itemsPerSession

    // 各商品のスケジュール時間を計算
    let currentTime = new Date(targetDate)
    currentTime.setHours(hour, randomBetween(0, 30), 0, 0)

    for (const product of sessionProducts) {
      session.items.push({
        product_id: product.id,
        scheduled_time: currentTime.toISOString(),
        platform,
      })

      // 次の商品の時間を計算（ランダムな間隔）
      const interval = randomBetween(settings.item_interval_min, settings.item_interval_max)
      currentTime = new Date(currentTime.getTime() + interval * 1000)
    }

    sessions.push(session)
  }

  return sessions
}

/**
 * 優先時間帯からランダムに選択
 */
function selectRandomHours(hours: number[], count: number): number[] {
  const shuffled = [...hours].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).sort((a, b) => a - b)
}

/**
 * 範囲内のランダムな整数を生成
 */
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 特定の日付のスケジュールをプレビュー
 */
export function previewSchedule(
  products: ProductForApproval[],
  settings: DefaultScheduleSettings,
  targetDate: Date = new Date()
): {
  date: string
  day_of_week: string
  multiplier: number
  adjusted_items_per_day: number
  sessions: Array<{
    hour: number
    item_count: number
    start_time: string
    end_time: string
  }>
  total_items: number
} {
  const dayOfWeek = targetDate.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  const multiplier = isWeekend ? settings.weekend_multiplier : settings.weekday_multiplier
  const adjustedItemsPerDay = Math.floor(settings.items_per_day * multiplier)

  const dayNames = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']

  // スケジュールを生成
  const result = generateSchedule(products, settings, targetDate)

  // セッションごとにグループ化
  const sessionMap = new Map<number, ScheduledItem[]>()
  for (const item of result.scheduled_items) {
    const hour = new Date(item.scheduled_time).getHours()
    if (!sessionMap.has(hour)) {
      sessionMap.set(hour, [])
    }
    sessionMap.get(hour)!.push(item)
  }

  const sessions = Array.from(sessionMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([hour, items]) => {
      const times = items.map(i => new Date(i.scheduled_time).getTime())
      return {
        hour,
        item_count: items.length,
        start_time: new Date(Math.min(...times)).toISOString(),
        end_time: new Date(Math.max(...times)).toISOString(),
      }
    })

  return {
    date: targetDate.toISOString().split('T')[0],
    day_of_week: dayNames[dayOfWeek],
    multiplier,
    adjusted_items_per_day: adjustedItemsPerDay,
    sessions,
    total_items: result.scheduled_items.length,
  }
}

/**
 * 1週間分のスケジュールプレビューを生成
 */
export function previewWeekSchedule(
  productCount: number,
  settings: DefaultScheduleSettings,
  startDate: Date = new Date()
): Array<{
  date: string
  day_of_week: string
  items_count: number
  session_count: number
}> {
  const preview: Array<{
    date: string
    day_of_week: string
    items_count: number
    session_count: number
  }> = []

  const dayNames = ['日', '月', '火', '水', '木', '金', '土']

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const multiplier = isWeekend ? settings.weekend_multiplier : settings.weekday_multiplier
    const itemsCount = Math.floor(settings.items_per_day * multiplier)
    const sessionCount = randomBetween(settings.sessions_per_day_min, settings.sessions_per_day_max)

    preview.push({
      date: date.toISOString().split('T')[0],
      day_of_week: dayNames[dayOfWeek],
      items_count: Math.min(itemsCount, productCount),
      session_count: sessionCount,
    })

    productCount -= itemsCount
    if (productCount <= 0) break
  }

  return preview
}

/**
 * 設定のバリデーション
 */
export function validateScheduleSettings(
  settings: Partial<DefaultScheduleSettings>
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (settings.items_per_day !== undefined) {
    if (settings.items_per_day < 1 || settings.items_per_day > 500) {
      errors.push('1日の出品数は1-500の範囲で指定してください')
    }
  }

  if (settings.sessions_per_day_min !== undefined && settings.sessions_per_day_max !== undefined) {
    if (settings.sessions_per_day_min > settings.sessions_per_day_max) {
      errors.push('セッション数の最小値は最大値以下にしてください')
    }
    if (settings.sessions_per_day_max > 24) {
      errors.push('セッション数の最大値は24以下にしてください')
    }
  }

  if (settings.item_interval_min !== undefined && settings.item_interval_max !== undefined) {
    if (settings.item_interval_min > settings.item_interval_max) {
      errors.push('商品間隔の最小値は最大値以下にしてください')
    }
    if (settings.item_interval_min < 1) {
      errors.push('商品間隔は1秒以上で指定してください')
    }
  }

  if (settings.preferred_hours !== undefined) {
    for (const hour of settings.preferred_hours) {
      if (hour < 0 || hour > 23) {
        errors.push('優先時間帯は0-23の範囲で指定してください')
        break
      }
    }
    if (settings.preferred_hours.length === 0) {
      errors.push('優先時間帯を少なくとも1つ指定してください')
    }
  }

  if (settings.weekday_multiplier !== undefined) {
    if (settings.weekday_multiplier < 0 || settings.weekday_multiplier > 10) {
      errors.push('平日倍率は0-10の範囲で指定してください')
    }
  }

  if (settings.weekend_multiplier !== undefined) {
    if (settings.weekend_multiplier < 0 || settings.weekend_multiplier > 10) {
      errors.push('休日倍率は0-10の範囲で指定してください')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * 次のバッチ実行時間を計算
 */
export function getNextBatchTime(settings: DefaultScheduleSettings): Date {
  const now = new Date()
  const [hours, minutes] = settings.batch_time.split(':').map(Number)

  const nextBatch = new Date(now)
  nextBatch.setHours(hours, minutes, 0, 0)

  // 今日のバッチ時間を過ぎていたら明日に
  if (nextBatch <= now) {
    nextBatch.setDate(nextBatch.getDate() + 1)
  }

  return nextBatch
}

/**
 * スケジュール済み商品IDのセットを生成（重複チェック用）
 */
export function getScheduledProductIds(scheduledItems: ScheduledItem[]): Set<string> {
  return new Set(scheduledItems.map(item => item.product_id))
}
