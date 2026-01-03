/**
 * スケジュール出品実行API
 * 
 * GET: スケジュール済み商品の確認（dry_run）
 * POST: スケジュール出品を実行
 * 
 * VPS cronから定期的に呼び出される
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// eBay出品関数（既存のものをインポート）
// import { listProductToEbay } from '@/lib/ebay/inventory'

/**
 * GET /api/listing/execute-scheduled
 * スケジュール済み商品の確認
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const supabase = await createClient()
    
    const now = new Date().toISOString()
    
    // スケジュール済みで、実行時刻が過ぎている商品を取得
    const { data: scheduledProducts, error, count } = await supabase
      .from('products_master')
      .select('id, sku, title, english_title, scheduled_at, scheduled_marketplace, scheduled_account, schedule_status', { count: 'exact' })
      .eq('schedule_status', 'scheduled')
      .lte('scheduled_at', now)
      .order('scheduled_at', { ascending: true })
      .limit(limit)
    
    if (error) {
      // カラムが存在しない場合
      if (error.message?.includes('column') || error.code === '42703') {
        return NextResponse.json({
          success: true,
          message: 'スケジュールカラムが未設定です。マイグレーションを実行してください。',
          pending: [],
          total: 0,
          migration_required: true,
        })
      }
      throw error
    }
    
    // 今後のスケジュール（参考情報）
    const { data: upcomingProducts, count: upcomingCount } = await supabase
      .from('products_master')
      .select('id, sku, title, scheduled_at, scheduled_marketplace, scheduled_account', { count: 'exact' })
      .eq('schedule_status', 'scheduled')
      .gt('scheduled_at', now)
      .order('scheduled_at', { ascending: true })
      .limit(20)
    
    return NextResponse.json({
      success: true,
      pending: scheduledProducts || [],
      pending_count: count || 0,
      upcoming: upcomingProducts || [],
      upcoming_count: upcomingCount || 0,
      current_time: now,
    })
  } catch (error: any) {
    console.error('❌ スケジュール確認エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'スケジュール確認に失敗しました',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/listing/execute-scheduled
 * スケジュール出品を実行
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json().catch(() => ({}))
    const { 
      dry_run = false, 
      limit = 10,
      delay_seconds = 30 // 商品間の待機時間
    } = body
    
    const supabase = await createClient()
    const now = new Date().toISOString()
    
    console.log(`🚀 スケジュール出品実行開始 (dry_run=${dry_run}, limit=${limit})`)
    
    // スケジュール済みで、実行時刻が過ぎている商品を取得
    const { data: scheduledProducts, error: fetchError } = await supabase
      .from('products_master')
      .select(`
        id, sku, title, english_title,
        scheduled_at, scheduled_marketplace, scheduled_account, schedule_status,
        ddp_price_usd, ebay_category_id, primary_image_url, images,
        listing_data, ebay_api_data, scraped_data
      `)
      .eq('schedule_status', 'scheduled')
      .lte('scheduled_at', now)
      .order('scheduled_at', { ascending: true })
      .limit(limit)
    
    if (fetchError) {
      // カラムが存在しない場合
      if (fetchError.message?.includes('column') || fetchError.code === '42703') {
        return NextResponse.json({
          success: false,
          error: 'スケジュールカラムが未設定です。マイグレーションを実行してください。',
          migration_required: true,
        })
      }
      throw fetchError
    }
    
    if (!scheduledProducts || scheduledProducts.length === 0) {
      return NextResponse.json({
        success: true,
        message: '実行対象のスケジュールがありません',
        processed: 0,
        results: [],
      })
    }
    
    console.log(`📦 対象商品: ${scheduledProducts.length}件`)
    
    const results: Array<{
      id: string
      sku: string
      status: 'success' | 'error' | 'skipped'
      message: string
      listing_id?: string
    }> = []
    
    let successCount = 0
    let errorCount = 0
    
    for (const product of scheduledProducts) {
      try {
        // ステータスを「実行中」に更新
        if (!dry_run) {
          await supabase
            .from('products_master')
            .update({ schedule_status: 'running' })
            .eq('id', product.id)
        }
        
        console.log(`📤 出品処理: ${product.sku} - ${product.title}`)
        
        // Dry runの場合はスキップ
        if (dry_run) {
          results.push({
            id: product.id,
            sku: product.sku,
            status: 'skipped',
            message: 'ドライラン - 実際の出品はスキップ',
          })
          continue
        }
        
        // マーケットプレイス別の出品処理
        const marketplace = product.scheduled_marketplace || 'ebay'
        const account = product.scheduled_account || 'MJT'
        
        let listingResult: { success: boolean; listingId?: string; error?: string }
        
        if (marketplace === 'ebay') {
          // eBay出品
          // 注意: 実際の出品処理は lib/ebay/inventory.ts の listProductToEbay を使用
          // ここではモック実装
          listingResult = await mockListToEbay(product, account)
        } else {
          listingResult = {
            success: false,
            error: `未対応のマーケットプレイス: ${marketplace}`,
          }
        }
        
        if (listingResult.success) {
          // 成功: ステータス更新
          await supabase
            .from('products_master')
            .update({
              schedule_status: 'completed',
              listing_status: 'active',
              ebay_item_id: listingResult.listingId,
              listed_at: new Date().toISOString(),
            })
            .eq('id', product.id)
          
          results.push({
            id: product.id,
            sku: product.sku,
            status: 'success',
            message: '出品完了',
            listing_id: listingResult.listingId,
          })
          successCount++
        } else {
          // エラー: ステータス更新
          await supabase
            .from('products_master')
            .update({
              schedule_status: 'error',
            })
            .eq('id', product.id)
          
          results.push({
            id: product.id,
            sku: product.sku,
            status: 'error',
            message: listingResult.error || '出品に失敗しました',
          })
          errorCount++
        }
        
        // 商品間の待機（API制限対策）
        if (delay_seconds > 0 && scheduledProducts.indexOf(product) < scheduledProducts.length - 1) {
          await sleep(delay_seconds * 1000)
        }
        
      } catch (error: any) {
        console.error(`❌ 商品処理エラー [${product.sku}]:`, error)
        
        // エラーステータスに更新
        if (!dry_run) {
          await supabase
            .from('products_master')
            .update({ schedule_status: 'error' })
            .eq('id', product.id)
        }
        
        results.push({
          id: product.id,
          sku: product.sku,
          status: 'error',
          message: error.message || '予期しないエラー',
        })
        errorCount++
      }
    }
    
    const duration = Date.now() - startTime
    
    console.log(`✅ スケジュール出品完了: 成功=${successCount}, エラー=${errorCount}, 所要時間=${duration}ms`)
    
    // 実行ログを記録
    if (!dry_run) {
      try {
        await fetch(`${getBaseUrl(request)}/api/automation/cron-settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cron_type: 'listing',
            status: errorCount === 0 ? 'completed' : 'error',
            processed_count: results.length,
            success_count: successCount,
            error_count: errorCount,
            duration_ms: duration,
            result: { results },
          }),
        })
      } catch (logError) {
        console.error('実行ログ記録エラー:', logError)
      }
    }
    
    return NextResponse.json({
      success: true,
      dry_run,
      processed: results.length,
      success_count: successCount,
      error_count: errorCount,
      duration_ms: duration,
      results,
    })
    
  } catch (error: any) {
    console.error('❌ スケジュール出品エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'スケジュール出品に失敗しました',
      },
      { status: 500 }
    )
  }
}

/**
 * モック出品処理（テスト用）
 * 本番では lib/ebay/inventory.ts の listProductToEbay を使用
 */
async function mockListToEbay(
  product: any,
  account: string
): Promise<{ success: boolean; listingId?: string; error?: string }> {
  // 必須フィールドチェック
  if (!product.english_title) {
    return { success: false, error: '英語タイトルが未設定です' }
  }
  
  if (!product.ddp_price_usd || product.ddp_price_usd <= 0) {
    return { success: false, error: '価格が未設定です' }
  }
  
  if (!product.ebay_category_id) {
    return { success: false, error: 'eBayカテゴリが未設定です' }
  }
  
  // 本番環境では実際のeBay APIを呼び出す
  // const result = await listProductToEbay(product, account === 'MJT' ? 'account1' : 'account2')
  
  // モック: 90%の確率で成功
  const isSuccess = Math.random() > 0.1
  
  if (isSuccess) {
    return {
      success: true,
      listingId: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
  } else {
    return {
      success: false,
      error: 'モック: ランダムエラー（テスト用）',
    }
  }
}

/**
 * ベースURLを取得
 */
function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

/**
 * 待機
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
