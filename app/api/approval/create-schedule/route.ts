import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface ScheduleRequest {
  productIds: number[]
  strategy: {
    marketplaces?: Array<{
      marketplace: string
      accountId: string
    }>
    mode: 'immediate' | 'scheduled'
  }
}

interface ScheduleSettings {
  enabled: boolean
  items_per_day: number           // 後方互換性
  items_per_day_min: number       // 🔥 1日の出品数（最小）
  items_per_day_max: number       // 🔥 1日の出品数（最大）
  sessions_per_day_min: number
  sessions_per_day_max: number
  item_interval_min: number
  item_interval_max: number
  preferred_hours: number[]
  weekday_multiplier: number
  weekend_multiplier: number
}

// デフォルト設定
const DEFAULT_SCHEDULE_SETTINGS: ScheduleSettings = {
  enabled: true,
  items_per_day: 30,
  items_per_day_min: 25,
  items_per_day_max: 35,
  sessions_per_day_min: 2,
  sessions_per_day_max: 4,
  item_interval_min: 30,
  item_interval_max: 120,
  preferred_hours: [10, 11, 14, 15, 19, 20],
  weekday_multiplier: 1.0,
  weekend_multiplier: 0.8,
}

/**
 * 承認と出品スケジュール作成API
 * POST /api/approval/create-schedule
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[API] create-schedule POST called')
    const supabase = await createClient()
    const body: ScheduleRequest = await request.json()
    console.log('[API] Request body:', JSON.stringify(body, null, 2))
    
    const { productIds, strategy } = body
    
    if (!productIds || productIds.length === 0) {
      return NextResponse.json(
        { error: '商品が選択されていません' },
        { status: 400 }
      )
    }

    // スケジュール設定を取得
    const settings = await getScheduleSettings(supabase)
    console.log('[API] Schedule settings:', settings)

    // 重複スケジュールチェック
    const { data: existingSchedules } = await supabase
      .from('listing_schedule')
      .select('product_id, marketplace, account_id')
      .in('product_id', productIds)
      .in('status', ['PENDING', 'SCHEDULED', 'RUNNING'])
    
    const existingKeys = new Set(
      (existingSchedules || []).map(s => `${s.product_id}:${s.marketplace}:${s.account_id}`)
    )
    
    // マーケットプレイス設定を取得
    let marketplaces = strategy.marketplaces
    if (!marketplaces || marketplaces.length === 0) {
      const { data: defaultSettings } = await supabase
        .from('default_listing_settings')
        .select('*')
        .eq('is_active', true)
        .is('category_name', null)
        .single()
      
      marketplaces = defaultSettings 
        ? [{ marketplace: defaultSettings.marketplace, accountId: defaultSettings.account_id }]
        : [{ marketplace: 'ebay', accountId: 'green' }]
    }
    
    // 重複チェック
    const newProductIds: number[] = []
    const skippedCombinations: string[] = []
    
    for (const productId of productIds) {
      let hasNewCombination = false
      for (const { marketplace, accountId } of marketplaces) {
        const key = `${productId}:${marketplace}:${accountId}`
        if (!existingKeys.has(key)) {
          hasNewCombination = true
        } else {
          skippedCombinations.push(key)
        }
      }
      if (hasNewCombination) {
        newProductIds.push(productId)
      }
    }
    
    if (newProductIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: '選択された商品はすべて既にスケジュール済みです',
        skippedCount: productIds.length,
      })
    }

    // 商品データを取得（スコア順ソート）
    const { data: productsData } = await supabase
      .from('products_master')
      .select('id, sku, ebay_category_id, listing_score, ai_confidence_score')
      .in('id', newProductIds)
    
    // スコア順にソート（高スコア優先）
    const sortedProducts = (productsData || []).sort((a, b) => {
      const scoreA = a.listing_score || a.ai_confidence_score || 0
      const scoreB = b.listing_score || b.ai_confidence_score || 0
      return scoreB - scoreA
    })
    
    // カテゴリー分散（スコア優先を維持しながら同じカテゴリーが連続しないように）
    const distributedProducts = distributeByCategoryWithScorePriority(sortedProducts)
    const sortedProductIds = distributedProducts.map(p => p.id)

    // 承認ステータスを更新
    const { error: updateError } = await supabase
      .from('products_master')
      .update({ 
        approval_status: 'approved',
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .in('id', newProductIds)

    if (updateError) {
      return NextResponse.json(
        { error: `承認ステータスの更新に失敗しました: ${updateError.message}` },
        { status: 500 }
      )
    }

    // スケジュールを生成
    const scheduleRecords = generateScheduleRecords(
      sortedProductIds,
      marketplaces,
      existingKeys,
      settings,
      strategy.mode
    )
    
    console.log('[API] Generated schedules:', scheduleRecords.length)
    console.log('[API] Schedule preview:', scheduleRecords.slice(0, 5).map(s => ({
      product_id: s.product_id,
      scheduled_at: s.scheduled_at,
      marketplace: s.marketplace
    })))
    
    if (scheduleRecords.length === 0) {
      return NextResponse.json({
        success: true,
        message: '新規スケジュールはありません',
        data: { approvedCount: newProductIds.length, scheduleCount: 0 }
      })
    }
    
    // スケジュールを保存
    const { data: insertedSchedules, error: insertError } = await supabase
      .from('listing_schedule')
      .insert(scheduleRecords)
      .select()

    if (insertError) {
      return NextResponse.json(
        { error: `スケジュールの作成に失敗しました: ${insertError.message}` },
        { status: 500 }
      )
    }

    // products_masterのschedule_statusを更新
    await supabase
      .from('products_master')
      .update({
        schedule_status: 'scheduled',
        workflow_status: 'scheduled',
        scheduled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .in('id', newProductIds)

    const skippedMessage = skippedCombinations.length > 0 
      ? ` (${skippedCombinations.length}件は既にスケジュール済みのためスキップ)`
      : ''

    return NextResponse.json({
      success: true,
      message: `${newProductIds.length}件の商品を承認し、${scheduleRecords.length}件の出品スケジュールを作成しました${skippedMessage}`,
      data: {
        approvedCount: newProductIds.length,
        scheduleCount: insertedSchedules?.length || 0,
        skippedCount: skippedCombinations.length,
        schedules: insertedSchedules
      }
    })

  } catch (error) {
    console.error('Error in create-schedule API:', error)
    return NextResponse.json(
      { error: '予期しないエラーが発生しました', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * スケジュール設定を取得
 */
async function getScheduleSettings(supabase: any): Promise<ScheduleSettings> {
  const { data, error } = await supabase
    .from('default_schedule_settings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  
  if (error || !data) {
    console.log('[API] Using default schedule settings')
    return DEFAULT_SCHEDULE_SETTINGS
  }
  
  // 🔥 後方互換性: items_per_day_min/maxがなければitems_per_dayから計算
  const itemsPerDay = data.items_per_day ?? 30
  const itemsPerDayMin = data.items_per_day_min ?? Math.floor(itemsPerDay * 0.8)
  const itemsPerDayMax = data.items_per_day_max ?? Math.ceil(itemsPerDay * 1.2)
  
  return {
    enabled: data.enabled ?? true,
    items_per_day: itemsPerDay,
    items_per_day_min: itemsPerDayMin,
    items_per_day_max: itemsPerDayMax,
    sessions_per_day_min: data.sessions_per_day_min ?? 2,
    sessions_per_day_max: data.sessions_per_day_max ?? 4,
    item_interval_min: data.item_interval_min ?? 30,
    item_interval_max: data.item_interval_max ?? 120,
    preferred_hours: data.preferred_hours ?? [10, 11, 14, 15, 19, 20],
    weekday_multiplier: data.weekday_multiplier ?? 1.0,
    weekend_multiplier: data.weekend_multiplier ?? 0.8,
  }
}

/**
 * カテゴリー分散（スコア優先を維持）
 * 高スコア商品を優先しながら、同じカテゴリーが連続しないように並べ替え
 */
function distributeByCategoryWithScorePriority(products: any[]): any[] {
  if (products.length <= 1) return products
  
  const result: any[] = []
  const remaining = [...products]
  let lastCategory: string | null = null
  
  while (remaining.length > 0) {
    let foundIndex = -1
    
    // 前回と異なるカテゴリーの商品を探す（スコア順を維持）
    for (let i = 0; i < remaining.length; i++) {
      const category = remaining[i].ebay_category_id || 'unknown'
      if (category !== lastCategory || remaining.length === 1) {
        foundIndex = i
        break
      }
    }
    
    // 見つからなければ最初の商品を使用（同じカテゴリーしかない場合）
    if (foundIndex === -1) foundIndex = 0
    
    const product = remaining.splice(foundIndex, 1)[0]
    result.push(product)
    lastCategory = product.ebay_category_id || 'unknown'
  }
  
  return result
}

// ============================================================
// 🔥 完全版スケジュール生成ロジック
// ============================================================

interface DaySchedule {
  date: Date
  dayOfWeek: number
  isWeekend: boolean
  multiplier: number
  maxItems: number
  sessions: SessionSchedule[]
}

interface SessionSchedule {
  hour: number
  startTime: Date
  items: ScheduleItem[]
}

interface ScheduleItem {
  productId: number
  scheduledAt: Date
  marketplace: string
  accountId: string
}

/**
 * 複数日にわたるスケジュールを生成
 */
function generateMultiDaySchedule(
  totalItems: number,
  settings: ScheduleSettings
): DaySchedule[] {
  const days: DaySchedule[] = []
  const now = new Date()
  let remainingItems = totalItems
  let dayOffset = 0
  
  while (remainingItems > 0 && dayOffset < 60) { // 最大60日先まで
    const targetDate = new Date(now)
    targetDate.setDate(now.getDate() + dayOffset)
    targetDate.setHours(0, 0, 0, 0)
    
    const dayOfWeek = targetDate.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const multiplier = isWeekend ? settings.weekend_multiplier : settings.weekday_multiplier
    
    // 🔥 範囲指定からランダムに出品数を決定（曜日倍率も適用）
    const minItems = settings.items_per_day_min ?? Math.floor(settings.items_per_day * 0.8)
    const maxItemsBase = settings.items_per_day_max ?? Math.ceil(settings.items_per_day * 1.2)
    
    // 範囲内でランダムに決定し、曜日倍率を適用
    const baseItems = randomBetween(minItems, maxItemsBase)
    const maxItems = Math.max(1, Math.floor(baseItems * multiplier))
    
    // この日に出品する数
    const itemsForDay = Math.min(remainingItems, maxItems)
    
    if (itemsForDay > 0) {
      // 今日の場合、使える時間帯をフィルタ
      const availableHours = getAvailableHours(settings.preferred_hours, targetDate, now, dayOffset === 0)
      
      if (availableHours.length > 0) {
        const daySchedule = generateDaySchedule(
          targetDate,
          dayOfWeek,
          isWeekend,
          multiplier,
          itemsForDay,
          availableHours,
          settings
        )
        
        if (daySchedule.sessions.length > 0) {
          days.push(daySchedule)
          remainingItems -= itemsForDay
        }
      }
    }
    
    dayOffset++
  }
  
  return days
}

/**
 * 利用可能な時間帯を取得
 */
function getAvailableHours(
  preferredHours: number[],
  targetDate: Date,
  now: Date,
  isToday: boolean
): number[] {
  if (!isToday) {
    return [...preferredHours]
  }
  
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  
  // 今日の場合、現在時刻より後の時間帯のみ（30分以上余裕を持つ）
  return preferredHours.filter(h => {
    if (h > currentHour) return true
    if (h === currentHour && currentMinute < 30) return true
    return false
  })
}

/**
 * 1日分のスケジュールを生成
 */
function generateDaySchedule(
  date: Date,
  dayOfWeek: number,
  isWeekend: boolean,
  multiplier: number,
  itemCount: number,
  availableHours: number[],
  settings: ScheduleSettings
): DaySchedule {
  // セッション数をランダムに決定（設定範囲内、利用可能な時間帯数以下）
  const maxSessions = Math.min(settings.sessions_per_day_max, availableHours.length)
  const minSessions = Math.min(settings.sessions_per_day_min, maxSessions)
  const sessionCount = randomBetween(minSessions, maxSessions)
  
  // セッションに使う時間帯をランダムに選択
  const selectedHours = selectRandomHours(availableHours, sessionCount)
  
  // 商品をセッションに分配（均等 + ランダム揺らぎ）
  const itemsPerSession = distributeItemsToSessions(itemCount, sessionCount)
  
  const sessions: SessionSchedule[] = []
  let itemIndex = 0
  
  for (let i = 0; i < sessionCount; i++) {
    const hour = selectedHours[i]
    const sessionItemCount = itemsPerSession[i]
    
    if (sessionItemCount === 0) continue
    
    // セッション開始時間（時間帯の0-30分の間でランダム）
    const sessionStartTime = new Date(date)
    sessionStartTime.setHours(hour, randomBetween(0, 30), randomBetween(0, 59), 0)
    
    const session: SessionSchedule = {
      hour,
      startTime: sessionStartTime,
      items: []
    }
    
    // セッション内の各商品の時間を設定
    let currentTime = new Date(sessionStartTime)
    
    for (let j = 0; j < sessionItemCount; j++) {
      session.items.push({
        productId: 0, // 後で設定
        scheduledAt: new Date(currentTime),
        marketplace: '',
        accountId: ''
      })
      
      // 次の商品の時間（間隔をランダムに設定）
      const interval = randomBetween(settings.item_interval_min, settings.item_interval_max)
      currentTime = new Date(currentTime.getTime() + interval * 1000)
    }
    
    sessions.push(session)
  }
  
  return {
    date,
    dayOfWeek,
    isWeekend,
    multiplier,
    maxItems: itemCount,
    sessions
  }
}

/**
 * 商品をセッションに分配（均等 + ランダム揺らぎ）
 */
function distributeItemsToSessions(totalItems: number, sessionCount: number): number[] {
  if (sessionCount <= 0) return []
  if (sessionCount === 1) return [totalItems]
  
  const distribution: number[] = []
  let remaining = totalItems
  
  for (let i = 0; i < sessionCount; i++) {
    const remainingSessions = sessionCount - i
    const baseCount = Math.floor(remaining / remainingSessions)
    
    // ±30%のランダム揺らぎ（最後のセッションは残り全部）
    if (i === sessionCount - 1) {
      distribution.push(remaining)
    } else {
      const minCount = Math.max(1, Math.floor(baseCount * 0.7))
      const maxCount = Math.ceil(baseCount * 1.3)
      const count = Math.min(remaining - (remainingSessions - 1), randomBetween(minCount, maxCount))
      distribution.push(count)
      remaining -= count
    }
  }
  
  return distribution
}

/**
 * スケジュールレコードを生成
 */
function generateScheduleRecords(
  productIds: number[],
  marketplaces: Array<{ marketplace: string; accountId: string }>,
  existingKeys: Set<string>,
  settings: ScheduleSettings,
  mode: 'immediate' | 'scheduled'
): Array<any> {
  const records: Array<any> = []
  const now = new Date()
  
  // 必要なスケジュール数を計算
  const validCombinations: Array<{ productId: number; marketplace: string; accountId: string }> = []
  
  for (const productId of productIds) {
    for (const { marketplace, accountId } of marketplaces) {
      const key = `${productId}:${marketplace}:${accountId}`
      if (!existingKeys.has(key)) {
        validCombinations.push({ productId, marketplace, accountId })
      }
    }
  }
  
  const totalCount = validCombinations.length
  if (totalCount === 0) return []
  
  // 即時出品の場合
  if (mode === 'immediate') {
    let insertIndex = 0
    for (const combo of validCombinations) {
      // 2分間隔 + ランダム秒数
      const delayMs = insertIndex * 2 * 60 * 1000 + randomBetween(0, 30) * 1000
      const scheduledAt = new Date(now.getTime() + delayMs)
      
      records.push({
        product_id: combo.productId,
        marketplace: combo.marketplace,
        account_id: combo.accountId,
        scheduled_at: scheduledAt.toISOString(),
        status: 'SCHEDULED',
        listing_strategy: 'immediate',
        priority: 1000 - insertIndex
      })
      insertIndex++
    }
    return records
  }
  
  // スケジュール出品の場合 - 複数日にわたるスケジュールを生成
  const daySchedules = generateMultiDaySchedule(totalCount, settings)
  
  // スケジュールスロットをフラット化
  const allSlots: Date[] = []
  for (const day of daySchedules) {
    for (const session of day.sessions) {
      for (const item of session.items) {
        allSlots.push(item.scheduledAt)
      }
    }
  }
  
  // 時間順にソート
  allSlots.sort((a, b) => a.getTime() - b.getTime())
  
  // 商品とスロットを組み合わせ
  for (let i = 0; i < validCombinations.length; i++) {
    const combo = validCombinations[i]
    const scheduledAt = allSlots[i] || allSlots[allSlots.length - 1] || new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    records.push({
      product_id: combo.productId,
      marketplace: combo.marketplace,
      account_id: combo.accountId,
      scheduled_at: scheduledAt.toISOString(),
      status: 'SCHEDULED',
      listing_strategy: 'auto_scheduled',
      priority: 100 - i
    })
  }
  
  return records
}

/**
 * 優先時間帯からランダムに選択
 */
function selectRandomHours(hours: number[], count: number): number[] {
  const shuffled = [...hours].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).sort((a, b) => a - b)
}

/**
 * 範囲内のランダムな整数
 */
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * スケジュールの取得
 * GET /api/approval/create-schedule
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const productId = searchParams.get('productId')
    const marketplace = searchParams.get('marketplace')
    const status = searchParams.get('status')
    
    let query = supabase
      .from('listing_schedule')
      .select(`
        *,
        products_master!listing_schedule_product_id_fkey (
          id, sku, title, title_en, current_price, listing_price
        )
      `)
      .order('scheduled_at', { ascending: true })
    
    if (productId) query = query.eq('product_id', productId)
    if (marketplace) query = query.eq('marketplace', marketplace)
    if (status) query = query.eq('status', status)
    
    const { data, error } = await query
    
    if (error) {
      return NextResponse.json({ error: 'スケジュールの取得に失敗しました' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, data: data || [] })
  } catch (error) {
    return NextResponse.json({ error: '予期しないエラーが発生しました' }, { status: 500 })
  }
}
