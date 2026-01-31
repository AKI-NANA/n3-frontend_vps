/**
 * API呼び出し追跡システム
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// API呼び出しの制限
const API_LIMITS: Record<string, { daily: number; hourly: number }> = {
  ebay_finding_completed: { daily: 5000, hourly: 500 },
  ebay_browse: { daily: 5000, hourly: 500 },
  default: { daily: 1000, hourly: 100 }
}

// メモリ内カウンター（バックアップ）
const memoryCounters: Record<string, { count: number; hourlyCount: number; lastReset: Date; lastHourlyReset: Date }> = {}

/**
 * API呼び出しカウントを増加
 */
export async function incrementApiCallCount(apiName: string): Promise<void> {
  const now = new Date()
  
  // メモリカウンターを初期化/更新
  if (!memoryCounters[apiName]) {
    memoryCounters[apiName] = {
      count: 0,
      hourlyCount: 0,
      lastReset: now,
      lastHourlyReset: now
    }
  }

  const counter = memoryCounters[apiName]

  // 日次リセット
  if (now.toDateString() !== counter.lastReset.toDateString()) {
    counter.count = 0
    counter.lastReset = now
  }

  // 時間リセット
  if (now.getHours() !== counter.lastHourlyReset.getHours()) {
    counter.hourlyCount = 0
    counter.lastHourlyReset = now
  }

  counter.count++
  counter.hourlyCount++

  // DBにも保存（非同期で）
  try {
    await supabase
      .from('api_call_counts')
      .upsert({
        api_name: apiName,
        call_date: now.toISOString().split('T')[0],
        call_count: counter.count,
        hourly_count: counter.hourlyCount,
        updated_at: now.toISOString()
      }, { onConflict: 'api_name,call_date' })
  } catch (error) {
    console.warn('API呼び出しカウント保存警告:', error)
  }
}

/**
 * API呼び出し状況を取得
 */
export async function getApiCallStatus(apiName: string): Promise<{
  callCount: number
  hourlyCount: number
  dailyLimit: number
  hourlyLimit: number
  remaining: number
  hourlyRemaining: number
}> {
  const limits = API_LIMITS[apiName] || API_LIMITS.default
  const counter = memoryCounters[apiName] || { count: 0, hourlyCount: 0 }

  return {
    callCount: counter.count,
    hourlyCount: counter.hourlyCount,
    dailyLimit: limits.daily,
    hourlyLimit: limits.hourly,
    remaining: Math.max(0, limits.daily - counter.count),
    hourlyRemaining: Math.max(0, limits.hourly - counter.hourlyCount)
  }
}

/**
 * API呼び出しが安全に可能かチェック
 */
export async function canMakeApiCallSafely(apiName: string): Promise<{
  canCall: boolean
  reason?: string
  waitTime?: number
}> {
  const status = await getApiCallStatus(apiName)

  if (status.remaining <= 0) {
    return {
      canCall: false,
      reason: `日次制限に達しました (${status.callCount}/${status.dailyLimit})`,
      waitTime: getTimeUntilMidnight()
    }
  }

  if (status.hourlyRemaining <= 0) {
    return {
      canCall: false,
      reason: `時間制限に達しました (${status.hourlyCount}/${status.hourlyLimit})`,
      waitTime: getTimeUntilNextHour()
    }
  }

  return { canCall: true }
}

/**
 * API呼び出し前の待機
 */
export async function waitBeforeApiCall(): Promise<void> {
  // レート制限対策：最低1秒待機
  await new Promise(resolve => setTimeout(resolve, 1000))
}

// ヘルパー関数
function getTimeUntilMidnight(): number {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return midnight.getTime() - now.getTime()
}

function getTimeUntilNextHour(): number {
  const now = new Date()
  const nextHour = new Date(now)
  nextHour.setHours(now.getHours() + 1, 0, 0, 0)
  return nextHour.getTime() - now.getTime()
}
