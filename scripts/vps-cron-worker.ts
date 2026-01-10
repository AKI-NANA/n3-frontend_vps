/**
 * VPS Cronワーカー
 * 
 * DBから各cronの設定を取得し、指定された間隔でAPIを呼び出す
 * 
 * 使用方法:
 *   npx tsx scripts/vps-cron-worker.ts
 *   または PM2: pm2 start scripts/vps-cron-worker.ts --name n3-cron
 */

import dotenv from 'dotenv'
import path from 'path'

// .env.local を読み込み
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000'
const CRON_SECRET = process.env.CRON_SECRET || ''

interface CronJob {
  type: 'listing' | 'inventory_monitoring' | 'inventory_sync'
  endpoint: string
  method: 'GET' | 'POST'
  body?: any
}

interface CronSetting {
  cron_type: string
  enabled: boolean
  interval_minutes: number
}

// 各cronジョブの定義
const CRON_JOBS: Record<string, CronJob> = {
  listing: {
    type: 'listing',
    endpoint: '/api/listing/execute-scheduled',
    method: 'POST',
    body: { dry_run: false, limit: 10 },
  },
  inventory_monitoring: {
    type: 'inventory_monitoring',
    endpoint: '/api/inventory-monitoring/execute',
    method: 'GET',
  },
  inventory_sync: {
    type: 'inventory_sync',
    endpoint: '/api/inventory-sync/worker',
    method: 'GET',
  },
}

// 最後の実行時刻を記録
const lastRunTimes: Record<string, number> = {
  listing: 0,
  inventory_monitoring: 0,
  inventory_sync: 0,
}

// 設定キャッシュ
let settingsCache: CronSetting[] | null = null
let settingsCacheTime = 0
const SETTINGS_CACHE_TTL = 60 * 1000 // 1分

/**
 * cron設定を取得
 */
async function fetchCronSettings(): Promise<CronSetting[]> {
  const now = Date.now()
  
  // キャッシュが有効な場合
  if (settingsCache && now - settingsCacheTime < SETTINGS_CACHE_TTL) {
    return settingsCache
  }
  
  try {
    const response = await fetch(`${APP_URL}/api/automation/cron-settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(CRON_SECRET && { 'Authorization': `Bearer ${CRON_SECRET}` }),
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.success && data.settings) {
      settingsCache = data.settings
      settingsCacheTime = now
      return data.settings
    }
    
    // デフォルト設定
    return getDefaultSettings()
  } catch (error) {
    console.error('❌ 設定取得エラー:', error)
    // エラー時はデフォルト設定を使用
    return getDefaultSettings()
  }
}

/**
 * デフォルト設定
 */
function getDefaultSettings(): CronSetting[] {
  return [
    { cron_type: 'listing', enabled: true, interval_minutes: 10 },
    { cron_type: 'inventory_monitoring', enabled: true, interval_minutes: 60 },
    { cron_type: 'inventory_sync', enabled: true, interval_minutes: 15 },
  ]
}

/**
 * cronジョブを実行
 */
async function executeCronJob(job: CronJob): Promise<void> {
  const url = `${APP_URL}${job.endpoint}`
  
  console.log(`🔄 [${job.type}] 実行開始: ${url}`)
  const startTime = Date.now()
  
  try {
    const options: RequestInit = {
      method: job.method,
      headers: {
        'Content-Type': 'application/json',
        ...(CRON_SECRET && { 'Authorization': `Bearer ${CRON_SECRET}` }),
      },
    }
    
    if (job.method === 'POST' && job.body) {
      options.body = JSON.stringify(job.body)
    }
    
    const response = await fetch(url, options)
    const data = await response.json()
    const duration = Date.now() - startTime
    
    if (response.ok && data.success !== false) {
      console.log(`✅ [${job.type}] 完了 (${duration}ms)`)
      
      // 結果サマリー
      if (data.processed !== undefined) {
        console.log(`   処理: ${data.processed}件, 成功: ${data.success_count || 0}件, エラー: ${data.error_count || 0}件`)
      }
    } else {
      console.error(`❌ [${job.type}] エラー:`, data.error || 'Unknown error')
    }
  } catch (error) {
    console.error(`❌ [${job.type}] 実行エラー:`, error)
  }
}

/**
 * 実行が必要かチェック
 */
function shouldRun(setting: CronSetting): boolean {
  if (!setting.enabled) {
    return false
  }
  
  const lastRun = lastRunTimes[setting.cron_type] || 0
  const intervalMs = setting.interval_minutes * 60 * 1000
  const now = Date.now()
  
  return now - lastRun >= intervalMs
}

/**
 * メインループ
 */
async function mainLoop(): Promise<void> {
  console.log('📊 Cron設定を確認中...')
  
  const settings = await fetchCronSettings()
  
  for (const setting of settings) {
    const job = CRON_JOBS[setting.cron_type]
    
    if (!job) {
      continue
    }
    
    if (shouldRun(setting)) {
      await executeCronJob(job)
      lastRunTimes[setting.cron_type] = Date.now()
    }
  }
}

/**
 * ワーカー開始
 */
async function startWorker(): Promise<void> {
  console.log('═'.repeat(60))
  console.log('🚀 N3 Cronワーカー開始')
  console.log(`   APP_URL: ${APP_URL}`)
  console.log(`   CRON_SECRET: ${CRON_SECRET ? '設定済み' : '未設定'}`)
  console.log('═'.repeat(60))
  
  // 初回は設定を取得して表示
  const settings = await fetchCronSettings()
  console.log('\n📋 Cron設定:')
  for (const s of settings) {
    console.log(`   ${s.cron_type}: ${s.enabled ? '有効' : '無効'}, 間隔=${s.interval_minutes}分`)
  }
  console.log('')
  
  // 30秒ごとにチェック（実際の実行は各設定の間隔に従う）
  const CHECK_INTERVAL = 30 * 1000
  
  // 初回実行
  await mainLoop()
  
  // 定期実行
  setInterval(async () => {
    try {
      await mainLoop()
    } catch (error) {
      console.error('❌ メインループエラー:', error)
    }
  }, CHECK_INTERVAL)
  
  console.log(`⏰ ${CHECK_INTERVAL / 1000}秒ごとにチェック中... (Ctrl+C で停止)`)
}

// エントリーポイント
startWorker().catch(console.error)

// グレースフルシャットダウン
process.on('SIGINT', () => {
  console.log('\n👋 Cronワーカーを停止します...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n👋 Cronワーカーを停止します...')
  process.exit(0)
})
