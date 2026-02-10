/**
 * ==============================================================================
 * 在庫監視バッチジョブ V2 (P1: 並列化対応)
 * ==============================================================================
 * p-limitを使用して並列処理を制御し、タイムアウトリスクを軽減
 * ==============================================================================
 */

import { supabase } from '@/lib/supabase'
import pLimit from 'p-limit'
import type {
  MonitoringLog,
  MonitoringTarget,
  ScrapedData,
  BatchExecutionOptions,
} from './types'
import { detectChanges, generateChangeSummary } from './change-detection'
import { recalculatePricing } from './price-recalculation'
import {
  sendMonitoringCompletedNotification,
  sendMonitoringErrorNotification,
} from './email-notification'

// P1: 並列処理制御設定
const DEFAULT_CONCURRENT_LIMIT = 5  // 同時実行数

/**
 * スクレイピングを実行（1件ずつ）
 */
async function scrapeProduct(url: string): Promise<ScrapedData> {
  try {
    const response = await fetch('/api/scraping/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        urls: [url],
        platforms: ['yahoo'],
      }),
    })

    if (!response.ok) {
      return {
        success: false,
        status: 'not_found',
        error: `HTTP ${response.status}`,
      }
    }

    const data = await response.json()

    if (data.success && data.results && data.results.length > 0) {
      const result = data.results[0]

      let stock = 0
      if (result.stock) {
        if (typeof result.stock === 'number') {
          stock = result.stock
        } else if (typeof result.stock === 'string') {
          if (result.stock === '在庫なし') stock = 0
          else if (result.stock === '在庫あり') stock = 1
          else {
            const match = result.stock.match(/(\d+)/)
            stock = match ? parseInt(match[1]) : 1
          }
        }
      }

      let status: 'active' | 'ended' | 'deleted' | 'not_found' = 'active'
      if (result.status === 'error' || result.status === 'not_found') {
        status = 'not_found'
      } else if (result.status === 'ended') {
        status = 'ended'
      }

      return {
        success: true,
        price_jpy: result.price || 0,
        stock,
        status,
        title: result.title,
        condition: result.condition,
        raw_data: result,
      }
    }

    return {
      success: false,
      status: 'not_found',
      error: 'データ取得失敗',
    }
  } catch (error: any) {
    console.error('スクレイピングエラー:', error)
    return {
      success: false,
      status: 'not_found',
      error: error.message,
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 監視対象商品を取得
 */
async function getMonitoringTargets(
  maxItems: number,
  productIds?: string[]
): Promise<MonitoringTarget[]> {
  let query = supabase
    .from('products')
    .select('*')
    .eq('monitoring_enabled', true)
    .in('monitoring_status', ['active', 'pending'])
    .not('source_url', 'is', null)
    .order('last_monitored_at', { ascending: true, nullsFirst: true })
    .limit(maxItems)

  if (productIds && productIds.length > 0) {
    query = query.in('id', productIds)
  }

  const { data, error } = await query

  if (error) {
    console.error('監視対象取得エラー:', error)
    return []
  }

  return (data || []) as MonitoringTarget[]
}

/**
 * バッチ実行（エントリーポイント）
 */
export async function executeMonitoringBatchV2(
  options: BatchExecutionOptions
): Promise<string> {
  const {
    type = 'manual',
    max_items = 50,
    delay_min = 30,
    delay_max = 120,
    product_ids,
  } = options

  const { data: log, error: logError } = await supabase
    .from('inventory_monitoring_logs')
    .insert({
      execution_type: type,
      status: 'pending',
      scheduled_at: type === 'scheduled' ? new Date().toISOString() : null,
      settings: {
        max_items,
        delay_min,
        delay_max,
        concurrent_limit: DEFAULT_CONCURRENT_LIMIT,  // V2: 並列数を記録
      },
    })
    .select()
    .single()

  if (logError || !log) {
    console.error('ログ作成エラー:', logError)
    throw new Error('実行ログの作成に失敗しました')
  }

  const logId = log.id

  // バックグラウンドで実行
  executeBatchInBackgroundV2(logId, options)

  return logId
}

/**
 * バックグラウンドでバッチを実行（V2: 並列化対応）
 */
async function executeBatchInBackgroundV2(
  logId: string,
  options: BatchExecutionOptions
) {
  const {
    max_items = 50,
    delay_min = 30,
    delay_max = 120,
    product_ids,
  } = options

  try {
    await supabase
      .from('inventory_monitoring_logs')
      .update({
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .eq('id', logId)

    const products = await getMonitoringTargets(max_items, product_ids)

    if (products.length === 0) {
      await supabase
        .from('inventory_monitoring_logs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          target_count: 0,
          processed_count: 0,
        })
        .eq('id', logId)
      return
    }

    await supabase
      .from('inventory_monitoring_logs')
      .update({
        target_count: products.length,
        product_ids: products.map((p) => p.id),
      })
      .eq('id', logId)

    // 統計カウンター（アトミックにするため、オブジェクトで管理）
    const stats = {
      processed: 0,
      success: 0,
      error: 0,
      changesDetected: 0,
      priceChanges: 0,
      stockChanges: 0,
      pageErrors: 0,
    }

    // P1: 並列処理制御
    const limit = pLimit(DEFAULT_CONCURRENT_LIMIT)

    // 各商品を並列処理
    const tasks = products.map((product, index) =>
      limit(async () => {
        try {
          console.log(`[${index + 1}/${products.length}] 監視中: ${product.title}`)

          // スクレイピング実行
          const scrapedData = await scrapeProduct(product.source_url)

          // 変動検知
          const changeResult = detectChanges(product, scrapedData)

          if (changeResult.hasChanges) {
            stats.changesDetected++

            for (const change of changeResult.changes) {
              if (change.type === 'price') stats.priceChanges++
              if (change.type === 'stock') stats.stockChanges++
              if (change.type === 'page_deleted' || change.type === 'page_changed')
                stats.pageErrors++
            }

            // 各変動を記録
            for (const change of changeResult.changes) {
              let recalculatedData = null

              if (change.type === 'price' && scrapedData.price_jpy) {
                try {
                  recalculatedData = await recalculatePricing(
                    product as any,
                    scrapedData.price_jpy
                  )
                } catch (error) {
                  console.error('価格再計算エラー:', error)
                }
              }

              await supabase.from('inventory_changes').insert({
                product_id: product.id,
                log_id: logId,
                change_type: change.type,
                old_value: String(change.old_value || ''),
                new_value: String(change.new_value || ''),
                old_price_jpy: change.type === 'price' ? change.old_value : null,
                new_price_jpy: change.type === 'price' ? change.new_value : null,
                old_stock: change.type === 'stock' ? change.old_value : null,
                new_stock: change.type === 'stock' ? change.new_value : null,
                recalculated_data: recalculatedData,
                recalculated_profit_margin: recalculatedData?.profit_margin,
                recalculated_ebay_price_usd: recalculatedData?.buy_it_now_price_usd,
                recalculated_shipping_cost: recalculatedData?.shipping_cost_usd,
                status: 'pending',
              })
            }

            console.log(
              `  ✅ 変動検知: ${generateChangeSummary(changeResult.changes)}`
            )
          }

          // 商品データを更新
          const updateData: any = {
            last_monitored_at: new Date().toISOString(),
            monitoring_error_count: 0,
          }

          if (scrapedData.success) {
            if (scrapedData.price_jpy !== undefined) {
              updateData.previous_price_jpy = scrapedData.price_jpy
              updateData.acquired_price_jpy = scrapedData.price_jpy
            }
            if (scrapedData.stock !== undefined) {
              updateData.previous_stock = scrapedData.stock
              updateData.current_stock = scrapedData.stock
            }
          } else {
            updateData.monitoring_error_count = (product.monitoring_error_count || 0) + 1
            updateData.last_monitoring_error = scrapedData.error || 'Unknown error'

            if (updateData.monitoring_error_count >= 5) {
              updateData.monitoring_status = 'error'
              updateData.monitoring_enabled = false
            }
          }

          await supabase.from('products').update(updateData).eq('id', product.id)

          stats.success++

          // ランダム待機（並列処理のため、各タスクが独立して待機）
          const delayMs = randomInt(delay_min * 1000, delay_max * 1000)
          console.log(`  ⏳ 待機: ${Math.round(delayMs / 1000)}秒`)
          await sleep(delayMs)

        } catch (error: any) {
          stats.error++
          console.error(`  ❌ エラー: ${product.title}`, error)

          await supabase.from('monitoring_errors').insert({
            log_id: logId,
            product_id: product.id,
            error_type: 'processing_error',
            error_message: error.message || 'Unknown error',
            source_url: product.source_url,
          })
        } finally {
          stats.processed++

          // 進捗更新（定期的に）
          if (stats.processed % 5 === 0 || stats.processed === products.length) {
            await supabase
              .from('inventory_monitoring_logs')
              .update({
                processed_count: stats.processed,
                success_count: stats.success,
                error_count: stats.error,
                changes_detected: stats.changesDetected,
                price_changes: stats.priceChanges,
                stock_changes: stats.stockChanges,
                page_errors: stats.pageErrors,
              })
              .eq('id', logId)
          }
        }
      })
    )

    // P1: 全タスクの完了を待機
    await Promise.all(tasks)

    // 完了処理
    const startedAt = (
      await supabase
        .from('inventory_monitoring_logs')
        .select('started_at')
        .eq('id', logId)
        .single()
    ).data?.started_at

    const durationSeconds = startedAt
      ? Math.round((Date.now() - new Date(startedAt).getTime()) / 1000)
      : 0

    await supabase
      .from('inventory_monitoring_logs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        duration_seconds: durationSeconds,
      })
      .eq('id', logId)

    console.log('✅ バッチ処理完了（V2: 並列化）')
    console.log(`   処理件数: ${stats.processed}`)
    console.log(`   成功: ${stats.success}`)
    console.log(`   エラー: ${stats.error}`)
    console.log(`   変動検知: ${stats.changesDetected}`)
    console.log(`   所要時間: ${durationSeconds}秒`)
    console.log(`   並列数: ${DEFAULT_CONCURRENT_LIMIT}`)

    // メール通知
    try {
      const { data: schedule } = await supabase
        .from('monitoring_schedules')
        .select('*')
        .eq('enabled', true)
        .single()

      if (schedule?.notify_on_completion) {
        await sendMonitoringCompletedNotification({
          logId,
          targetCount: products.length,
          processedCount: stats.processed,
          successCount: stats.success,
          errorCount: stats.error,
          changesDetected: stats.changesDetected,
          durationSeconds,
        })
      }
    } catch (error) {
      console.error('メール通知エラー:', error)
    }

  } catch (error: any) {
    console.error('バッチ実行エラー:', error)

    await supabase
      .from('inventory_monitoring_logs')
      .update({
        status: 'error',
        completed_at: new Date().toISOString(),
        error_message: error.message,
      })
      .eq('id', logId)

    try {
      await sendMonitoringErrorNotification({
        logId,
        error: error.message,
      })
    } catch (notifyError) {
      console.error('エラー通知送信失敗:', notifyError)
    }
  }
}

// デフォルトエクスポート
export default executeMonitoringBatchV2
