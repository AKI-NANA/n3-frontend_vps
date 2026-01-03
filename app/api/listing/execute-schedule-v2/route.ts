/**
 * スケジュール出品実行API v2
 * 
 * listing_schedule テーブルを使用
 * 
 * GET: 実行待ちスケジュールの確認
 * POST: スケジュール出品を実行
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listProductToEbay } from '@/lib/ebay/inventory'

/**
 * GET /api/listing/execute-schedule-v2
 * 実行待ちスケジュールの確認
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status') || 'PENDING'
    
    const supabase = await createClient()
    const now = new Date().toISOString()
    
    // スケジュールテーブルを取得
    const { data: schedules, error, count } = await supabase
      .from('listing_schedule')
      .select(`
        *,
        products_master:product_id (
          id, sku, title, english_title,
          ddp_price_usd, ebay_category_id, primary_image_url
        )
      `, { count: 'exact' })
      .eq('status', status)
      .lte('scheduled_at', now)
      .order('scheduled_at', { ascending: true })
      .limit(limit)
    
    if (error) {
      throw error
    }
    
    // 今後のスケジュール
    const { data: upcoming, count: upcomingCount } = await supabase
      .from('listing_schedule')
      .select('*', { count: 'exact' })
      .in('status', ['PENDING', 'SCHEDULED'])
      .gt('scheduled_at', now)
      .order('scheduled_at', { ascending: true })
      .limit(20)
    
    return NextResponse.json({
      success: true,
      ready_to_execute: schedules || [],
      ready_count: count || 0,
      upcoming: upcoming || [],
      upcoming_count: upcomingCount || 0,
      current_time: now,
    })
  } catch (error: any) {
    console.error('❌ スケジュール確認エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/listing/execute-schedule-v2
 * スケジュール出品を実行
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json().catch(() => ({}))
    const { 
      dry_run = false, 
      limit = 10,
      delay_seconds = 30,
      status_filter = 'PENDING'
    } = body
    
    const supabase = await createClient()
    const now = new Date().toISOString()
    
    console.log(`🚀 スケジュール出品実行開始 (dry_run=${dry_run}, limit=${limit})`)
    
    // 実行対象のスケジュールを取得
    const { data: schedules, error: fetchError } = await supabase
      .from('listing_schedule')
      .select(`
        *,
        products_master:product_id (
          id, sku, title, english_title,
          ddp_price_usd, ebay_category_id, primary_image_url, images,
          listing_data, ebay_api_data
        )
      `)
      .eq('status', status_filter)
      .lte('scheduled_at', now)
      .order('priority', { ascending: false })
      .order('scheduled_at', { ascending: true })
      .limit(limit)
    
    if (fetchError) {
      throw fetchError
    }
    
    if (!schedules || schedules.length === 0) {
      return NextResponse.json({
        success: true,
        message: '実行対象のスケジュールがありません',
        processed: 0,
        results: [],
      })
    }
    
    console.log(`📦 対象スケジュール: ${schedules.length}件`)
    
    const results: Array<{
      schedule_id: string
      product_id: number
      sku: string
      status: 'success' | 'error' | 'skipped'
      message: string
      listing_id?: string
    }> = []
    
    let successCount = 0
    let errorCount = 0
    
    for (const schedule of schedules) {
      const product = schedule.products_master
      
      if (!product) {
        results.push({
          schedule_id: schedule.id,
          product_id: schedule.product_id,
          sku: 'N/A',
          status: 'error',
          message: '商品データが見つかりません',
        })
        errorCount++
        continue
      }
      
      try {
        // ステータスを「実行中」に更新
        if (!dry_run) {
          await supabase
            .from('listing_schedule')
            .update({ status: 'IN_PROGRESS' })
            .eq('id', schedule.id)
        }
        
        console.log(`📤 出品処理: ${product.sku} - ${product.title}`)
        
        // Dry runの場合はスキップ
        if (dry_run) {
          results.push({
            schedule_id: schedule.id,
            product_id: product.id,
            sku: product.sku,
            status: 'skipped',
            message: 'ドライラン - 実際の出品はスキップ',
          })
          continue
        }
        
        // バリデーション
        const validation = validateProduct(product)
        if (!validation.valid) {
          await updateScheduleError(supabase, schedule.id, validation.error!)
          results.push({
            schedule_id: schedule.id,
            product_id: product.id,
            sku: product.sku,
            status: 'error',
            message: validation.error!,
          })
          errorCount++
          continue
        }
        
        // eBay出品実行
        const marketplace = schedule.marketplace || 'ebay'
        const account = schedule.account_id || 'MJT'
        
        let listingResult: { success: boolean; listingId?: string; error?: string }
        
        if (marketplace === 'ebay') {
          const ebayAccount = account.toLowerCase().includes('green') ? 'account2' : 'account1'
          listingResult = await listProductToEbay(product, ebayAccount)
        } else {
          listingResult = {
            success: false,
            error: `未対応のマーケットプレイス: ${marketplace}`,
          }
        }
        
        if (listingResult.success) {
          // 成功: スケジュール更新
          await supabase
            .from('listing_schedule')
            .update({
              status: 'COMPLETED',
              listing_id: listingResult.listingId,
              executed_at: new Date().toISOString(),
            })
            .eq('id', schedule.id)
          
          // 商品マスター更新
          await supabase
            .from('products_master')
            .update({
              listing_status: 'active',
              ebay_item_id: listingResult.listingId,
              listed_at: new Date().toISOString(),
              workflow_status: 'listed',
            })
            .eq('id', product.id)
          
          // 履歴記録
          await supabase.from('listing_history').insert({
            product_id: product.id,
            schedule_id: schedule.id,
            marketplace,
            account,
            listed_at: new Date().toISOString(),
            listing_id: listingResult.listingId,
            status: 'success',
          })
          
          results.push({
            schedule_id: schedule.id,
            product_id: product.id,
            sku: product.sku,
            status: 'success',
            message: '出品完了',
            listing_id: listingResult.listingId,
          })
          successCount++
        } else {
          await updateScheduleError(supabase, schedule.id, listingResult.error || '出品エラー')
          
          // 履歴記録
          await supabase.from('listing_history').insert({
            product_id: product.id,
            schedule_id: schedule.id,
            marketplace,
            account,
            listed_at: new Date().toISOString(),
            status: 'failed',
            error_message: listingResult.error,
          })
          
          results.push({
            schedule_id: schedule.id,
            product_id: product.id,
            sku: product.sku,
            status: 'error',
            message: listingResult.error || '出品に失敗しました',
          })
          errorCount++
        }
        
        // API制限対策の待機
        if (delay_seconds > 0 && schedules.indexOf(schedule) < schedules.length - 1) {
          await sleep(delay_seconds * 1000)
        }
        
      } catch (error: any) {
        console.error(`❌ 処理エラー [${product?.sku}]:`, error)
        
        if (!dry_run) {
          await updateScheduleError(supabase, schedule.id, error.message)
        }
        
        results.push({
          schedule_id: schedule.id,
          product_id: product?.id || schedule.product_id,
          sku: product?.sku || 'N/A',
          status: 'error',
          message: error.message || '予期しないエラー',
        })
        errorCount++
      }
    }
    
    const duration = Date.now() - startTime
    
    console.log(`✅ 完了: 成功=${successCount}, エラー=${errorCount}, 所要時間=${duration}ms`)
    
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
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * 商品バリデーション
 */
function validateProduct(product: any): { valid: boolean; error?: string } {
  if (!product.english_title) {
    return { valid: false, error: '英語タイトルが未設定です' }
  }
  if (!product.ddp_price_usd || product.ddp_price_usd <= 0) {
    return { valid: false, error: '価格が未設定です' }
  }
  if (!product.ebay_category_id) {
    return { valid: false, error: 'eBayカテゴリが未設定です' }
  }
  return { valid: true }
}

/**
 * スケジュールをエラー状態に更新
 */
async function updateScheduleError(supabase: any, scheduleId: string, error: string) {
  await supabase
    .from('listing_schedule')
    .update({
      status: 'ERROR',
      error_message: error,
      executed_at: new Date().toISOString(),
    })
    .eq('id', scheduleId)
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
