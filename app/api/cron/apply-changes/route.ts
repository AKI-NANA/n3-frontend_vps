/**
 * ====================================================================
 * N3 Cron API - 変動をeBayに自動反映
 * ====================================================================
 * unified_changes テーブルから pending 状態の変動を取得し、
 * eBay API を通じて在庫・価格を更新します。
 * 
 * 使用例 (crontab -e):
 * 15 * * * * curl -X GET "http://localhost:3000/api/cron/apply-changes" -H "Authorization: Bearer YOUR_CRON_SECRET"
 * ====================================================================
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendChangeSummaryNotification, sendMonitoringErrorNotification } from '@/lib/inventory-monitoring/email-notification'

// 認証シークレット
const CRON_SECRET = process.env.CRON_SECRET || process.env.NEXTAUTH_SECRET

/**
 * 認証チェック
 */
function verifyCronAuth(request: NextRequest): boolean {
  if (process.env.NODE_ENV === 'development' && !CRON_SECRET) {
    return true
  }

  if (!CRON_SECRET) {
    return false
  }

  const authHeader = request.headers.get('Authorization')
  if (!authHeader) {
    return false
  }

  return authHeader.replace('Bearer ', '') === CRON_SECRET
}

/**
 * GET /api/cron/apply-changes
 * 保留中の変動をeBayに適用
 */
export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()
    console.log('🚀 [Cron] 変動適用開始')

    // ========================================
    // 1. 保留中の変動を取得（一度に20件）
    // ========================================
    const { data: pendingChanges, error: fetchError } = await supabase
      .from('unified_changes')
      .select(`
        *,
        products_master (
          id,
          sku,
          title,
          ebay_item_id,
          ebay_offer_id,
          listing_status
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(20)

    if (fetchError) {
      throw new Error(`変動データ取得エラー: ${fetchError.message}`)
    }

    if (!pendingChanges || pendingChanges.length === 0) {
      console.log('✅ 保留中の変動はありません')
      return NextResponse.json({
        success: true,
        message: '保留中の変動はありません',
        processed: 0,
      })
    }

    console.log(`📊 処理対象: ${pendingChanges.length}件`)

    // ========================================
    // 2. 各変動を処理
    // ========================================
    const results: Array<{
      id: string
      sku: string
      status: 'success' | 'error' | 'skipped'
      message?: string
    }> = []

    const appliedChanges: Array<{
      sku: string
      title?: string
      type: string
      oldValue: any
      newValue: any
    }> = []

    for (const change of pendingChanges) {
      const product = change.products_master

      try {
        // eBayに出品されていない場合はスキップ
        if (!product?.ebay_item_id) {
          await supabase
            .from('unified_changes')
            .update({
              status: 'skipped',
              error_message: 'eBay Item ID なし',
              applied_at: new Date().toISOString(),
            })
            .eq('id', change.id)

          results.push({
            id: change.id,
            sku: product?.sku || 'unknown',
            status: 'skipped',
            message: 'eBay Item ID がありません',
          })
          continue
        }

        let apiSuccess = false
        let apiMessage = ''

        // ========================================
        // 変動タイプに応じてeBay APIを呼び出し
        // ========================================
        if (change.change_category === 'page_error' || 
            (change.inventory_change?.new_stock === 0)) {
          // 在庫切れ → 出品終了 or 数量0
          console.log(`  📦 在庫切れ処理: ${product.sku}`)

          // ReviseInventoryStatus または EndItem を呼び出す
          // TODO: 実際のeBay API呼び出し
          // const ebayResult = await ebayClient.updateQuantity(product.ebay_item_id, 0)
          
          // 仮の成功処理
          apiSuccess = true
          apiMessage = '在庫を0に更新しました（シミュレーション）'

        } else if (change.change_category === 'price') {
          // 価格変動
          const newPrice = change.price_change?.new_price_jpy
          console.log(`  💰 価格更新: ${product.sku} → ¥${newPrice}`)

          // ReviseItem で価格更新
          // TODO: 実際のeBay API呼び出し
          // const ebayResult = await ebayClient.updatePrice(product.ebay_item_id, newPriceUsd)

          apiSuccess = true
          apiMessage = `価格を更新しました（シミュレーション）`

        } else if (change.change_category === 'inventory') {
          // 在庫数変動
          const newStock = change.inventory_change?.new_stock
          console.log(`  📦 在庫更新: ${product.sku} → ${newStock}`)

          apiSuccess = true
          apiMessage = `在庫を${newStock}に更新しました（シミュレーション）`
        }

        // ========================================
        // 結果を記録
        // ========================================
        if (apiSuccess) {
          await supabase
            .from('unified_changes')
            .update({
              status: 'applied',
              applied_at: new Date().toISOString(),
              auto_applied: true,
            })
            .eq('id', change.id)

          results.push({
            id: change.id,
            sku: product.sku,
            status: 'success',
            message: apiMessage,
          })

          // 通知用に記録
          appliedChanges.push({
            sku: product.sku,
            title: product.title,
            type: change.change_category,
            oldValue: change.price_change?.old_price_jpy || change.inventory_change?.old_stock,
            newValue: change.price_change?.new_price_jpy || change.inventory_change?.new_stock,
          })

        } else {
          throw new Error(apiMessage || 'eBay API更新失敗')
        }

      } catch (error: any) {
        console.error(`  ❌ エラー: ${product?.sku}`, error.message)

        await supabase
          .from('unified_changes')
          .update({
            status: 'error',
            error_message: error.message,
            applied_at: new Date().toISOString(),
          })
          .eq('id', change.id)

        results.push({
          id: change.id,
          sku: product?.sku || 'unknown',
          status: 'error',
          message: error.message,
        })
      }

      // レート制限対策
      await new Promise(r => setTimeout(r, 500))
    }

    // ========================================
    // 3. メール通知（適用された変動がある場合）
    // ========================================
    if (appliedChanges.length > 0) {
      await sendChangeSummaryNotification(
        appliedChanges.map(c => ({
          sku: c.sku,
          title: c.title,
          type: c.type as any,
          oldValue: c.oldValue,
          newValue: c.newValue,
        }))
      )
    }

    // ========================================
    // 4. 結果を返す
    // ========================================
    const successCount = results.filter(r => r.status === 'success').length
    const errorCount = results.filter(r => r.status === 'error').length
    const skippedCount = results.filter(r => r.status === 'skipped').length

    console.log('✅ [Cron] 変動適用完了')
    console.log(`   成功: ${successCount}件`)
    console.log(`   エラー: ${errorCount}件`)
    console.log(`   スキップ: ${skippedCount}件`)

    return NextResponse.json({
      success: true,
      processed: results.length,
      success_count: successCount,
      error_count: errorCount,
      skipped_count: skippedCount,
      results,
    })

  } catch (error: any) {
    console.error('❌ [Cron] 変動適用エラー:', error)

    await sendMonitoringErrorNotification({
      error: `変動適用エラー: ${error.message}`,
    })

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/cron/apply-changes
 */
export async function POST(request: NextRequest) {
  return GET(request)
}
