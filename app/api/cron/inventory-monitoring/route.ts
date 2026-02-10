/**
 * ====================================================================
 * N3 Cron API - 在庫監視自動実行
 * ====================================================================
 * VPSのcronから呼び出される認証付きエンドポイント
 * 
 * 使用例 (crontab -e):
 * 0 9 * * * curl -X GET "http://localhost:3000/api/cron/inventory-monitoring" -H "Authorization: Bearer YOUR_CRON_SECRET"
 * ====================================================================
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBatchScraper, type ScrapingTask } from '@/lib/scraping-engine'
import { sendMonitoringCompletedNotification, sendMonitoringErrorNotification } from '@/lib/inventory-monitoring/email-notification'

// 認証シークレット（環境変数から取得）
const CRON_SECRET = process.env.CRON_SECRET || process.env.NEXTAUTH_SECRET

/**
 * 認証チェック
 */
function verifyCronAuth(request: NextRequest): boolean {
  // 開発環境では認証をスキップ可能
  if (process.env.NODE_ENV === 'development' && !CRON_SECRET) {
    console.log('⚠️ 開発環境: 認証スキップ')
    return true
  }

  if (!CRON_SECRET) {
    console.error('❌ CRON_SECRET が設定されていません')
    return false
  }

  const authHeader = request.headers.get('Authorization')
  if (!authHeader) {
    return false
  }

  const token = authHeader.replace('Bearer ', '')
  return token === CRON_SECRET
}

/**
 * GET /api/cron/inventory-monitoring
 * 在庫監視を実行
 */
export async function GET(request: NextRequest) {
  // 認証チェック
  if (!verifyCronAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const startTime = Date.now()
  let logId: string | null = null

  try {
    const supabase = await createClient()
    console.log('🚀 [Cron] 在庫監視開始')

    // ========================================
    // 1. 設定を取得
    // ========================================
    const { data: scheduleSettings } = await supabase
      .from('monitoring_schedule_settings')
      .select('*')
      .eq('enabled', true)
      .single()

    if (!scheduleSettings) {
      console.log('⚠️ 在庫監視が無効または設定がありません')
      return NextResponse.json({
        success: true,
        message: '在庫監視が無効です',
        executed: false,
      })
    }

    const maxItems = scheduleSettings.max_items_per_batch || 50
    const delayMin = (scheduleSettings.delay_min_seconds || 1) * 1000
    const delayMax = (scheduleSettings.delay_max_seconds || 3) * 1000

    // ========================================
    // 2. 監視対象商品を取得
    // ========================================
    const { data: targets, error: fetchError } = await supabase
      .from('products_master')
      .select('id, sku, title, store_url, acquired_price_jpy, current_stock')
      .eq('inventory_monitoring_enabled', true)
      .not('store_url', 'is', null)
      .or(`next_inventory_check.is.null,next_inventory_check.lte.${new Date().toISOString()}`)
      .order('next_inventory_check', { ascending: true, nullsFirst: true })
      .limit(maxItems)

    if (fetchError) {
      throw new Error(`対象商品取得エラー: ${fetchError.message}`)
    }

    if (!targets || targets.length === 0) {
      console.log('✅ 監視対象商品がありません')
      return NextResponse.json({
        success: true,
        message: '監視対象商品がありません',
        executed: true,
        processed: 0,
      })
    }

    console.log(`📊 監視対象: ${targets.length}件`)

    // ========================================
    // 3. 実行ログを作成
    // ========================================
    const { data: log, error: logError } = await supabase
      .from('inventory_monitoring_logs')
      .insert({
        execution_type: 'scheduled',
        status: 'running',
        target_count: targets.length,
        started_at: new Date().toISOString(),
        settings: {
          max_items: maxItems,
          delay_min: delayMin,
          delay_max: delayMax,
        },
      })
      .select()
      .single()

    if (logError || !log) {
      throw new Error(`ログ作成エラー: ${logError?.message}`)
    }

    logId = log.id

    // ========================================
    // 4. バッチスクレイピング実行
    // ========================================
    const scraper = getBatchScraper({
      concurrency: 3,
      delayMin,
      delayMax,
    })

    const tasks: ScrapingTask[] = targets.map(t => ({
      id: t.id,
      url: t.store_url,
      marketplace: 'yahoo_auctions',
    }))

    const { results, stats } = await scraper.execute(tasks)

    // ========================================
    // 5. 変動検知 & DB更新
    // ========================================
    let changesDetected = 0
    let priceChanges = 0
    let stockChanges = 0
    let pageErrors = 0
    const errors: Array<{ id: string; error: string }> = []

    for (const result of results) {
      const product = targets.find(t => t.id === result.productId)
      if (!product) continue

      try {
        const changes: Array<{
          type: 'price' | 'stock' | 'page_deleted' | 'page_changed'
          old_value: any
          new_value: any
        }> = []

        // ページ消失チェック
        if (!result.isAvailable || result.status === 'ended' || result.status === 'deleted') {
          changes.push({
            type: 'page_deleted',
            old_value: product.current_stock || 1,
            new_value: 0,
          })
          pageErrors++
        } else {
          // 価格変動チェック
          if (result.price && product.acquired_price_jpy && result.price !== product.acquired_price_jpy) {
            changes.push({
              type: 'price',
              old_value: product.acquired_price_jpy,
              new_value: result.price,
            })
            priceChanges++
          }

          // 在庫変動チェック
          const oldStock = product.current_stock || 0
          const newStock = result.stock ?? 1
          if (oldStock !== newStock) {
            changes.push({
              type: 'stock',
              old_value: oldStock,
              new_value: newStock,
            })
            stockChanges++
          }
        }

        // 変動があれば記録
        if (changes.length > 0) {
          changesDetected += changes.length

          for (const change of changes) {
            await supabase.from('unified_changes').insert({
              product_id: product.id,
              change_category: change.type === 'price' ? 'price' : 
                              change.type === 'stock' ? 'inventory' : 'page_error',
              inventory_change: change.type !== 'price' ? {
                old_stock: change.old_value,
                new_stock: change.new_value,
                page_exists: result.isAvailable,
              } : null,
              price_change: change.type === 'price' ? {
                old_price_jpy: change.old_value,
                new_price_jpy: change.new_value,
              } : null,
              status: 'pending',
              auto_applied: false,
            })
          }
        }

        // 次回チェック時刻を更新
        const frequency = scheduleSettings.frequency || 'daily'
        let nextCheck = new Date()
        
        switch (frequency) {
          case 'hourly':
            nextCheck.setHours(nextCheck.getHours() + 1)
            break
          case 'daily':
            nextCheck.setDate(nextCheck.getDate() + 1)
            break
          case 'weekly':
            nextCheck.setDate(nextCheck.getDate() + 7)
            break
          default:
            nextCheck.setDate(nextCheck.getDate() + 1)
        }

        // 商品データ更新
        await supabase
          .from('products_master')
          .update({
            last_inventory_check: new Date().toISOString(),
            next_inventory_check: nextCheck.toISOString(),
            current_stock: result.stock ?? product.current_stock,
            acquired_price_jpy: result.price ?? product.acquired_price_jpy,
          })
          .eq('id', product.id)

      } catch (error: any) {
        errors.push({
          id: String(product.id),
          error: error.message,
        })
      }
    }

    // ========================================
    // 6. ログを完了に更新
    // ========================================
    const durationSeconds = Math.round((Date.now() - startTime) / 1000)

    await supabase
      .from('inventory_monitoring_logs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        processed_count: stats.total,
        success_count: stats.success,
        error_count: stats.failed,
        changes_detected: changesDetected,
        price_changes: priceChanges,
        stock_changes: stockChanges,
        page_errors: pageErrors,
        duration_seconds: durationSeconds,
      })
      .eq('id', logId)

    // ========================================
    // 7. メール通知
    // ========================================
    if (scheduleSettings.email_notification) {
      const shouldNotify = !scheduleSettings.notify_on_changes_only || changesDetected > 0

      if (shouldNotify) {
        await sendMonitoringCompletedNotification({
          logId,
          targetCount: targets.length,
          processedCount: stats.total,
          successCount: stats.success,
          errorCount: stats.failed,
          changesDetected,
          priceChanges,
          stockChanges,
          pageErrors,
          durationSeconds,
        }, scheduleSettings.notification_emails)
      }
    }

    console.log('✅ [Cron] 在庫監視完了')
    console.log(`   処理: ${stats.total}件`)
    console.log(`   変動検知: ${changesDetected}件`)
    console.log(`   所要時間: ${durationSeconds}秒`)

    return NextResponse.json({
      success: true,
      executed: true,
      logId,
      processed: stats.total,
      success_count: stats.success,
      error_count: stats.failed,
      changes_detected: changesDetected,
      price_changes: priceChanges,
      stock_changes: stockChanges,
      page_errors: pageErrors,
      duration_seconds: durationSeconds,
    })

  } catch (error: any) {
    console.error('❌ [Cron] 在庫監視エラー:', error)

    // エラーログを更新
    if (logId) {
      const supabase = await createClient()
      await supabase
        .from('inventory_monitoring_logs')
        .update({
          status: 'error',
          completed_at: new Date().toISOString(),
          error_message: error.message,
        })
        .eq('id', logId)
    }

    // エラー通知
    await sendMonitoringErrorNotification({
      logId: logId || undefined,
      error: error.message,
    })

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        logId,
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/cron/inventory-monitoring
 * 手動実行用（同じ処理）
 */
export async function POST(request: NextRequest) {
  return GET(request)
}
