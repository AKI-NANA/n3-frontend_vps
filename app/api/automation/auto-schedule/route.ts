/**
 * 自動スケジュール生成API
 * POST: スケジュールバッチ生成
 * GET: スケジュールプレビュー
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  DefaultScheduleSettings,
  ProductForApproval,
  ScheduledItem,
} from '@/types/automation'
import {
  generateSchedule,
  previewSchedule,
  previewWeekSchedule,
  DEFAULT_SCHEDULE_SETTINGS,
} from '@/services/automation/AutoScheduleEngine'

/**
 * スケジュールプレビュー
 * GET /api/automation/auto-schedule?date=2025-11-30&preview=week
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateStr = searchParams.get('date')
    const preview = searchParams.get('preview') || 'day'
    const limit = parseInt(searchParams.get('limit') || '100')

    const targetDate = dateStr ? new Date(dateStr) : new Date()

    const supabase = await createClient()

    // 設定を取得
    const { data: settingsData } = await supabase
      .from('default_schedule_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const settings: DefaultScheduleSettings = settingsData || {
      ...DEFAULT_SCHEDULE_SETTINGS,
      id: 'default',
      user_id: 'default',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // スケジュール対象商品を取得（承認済み、未スケジュール）
    const { data: products, error, count } = await supabase
      .from('products_master')
      .select(`
        id,
        sku,
        title,
        title_en,
        ddp_price_usd,
        category_name,
        primary_image_url,
        images,
        seo_health_score,
        listing_score,
        profit_margin_percent,
        status,
        approval_status,
        recommended_platform,
        updated_at
      `, { count: 'exact' })
      .eq('status', '出品スケジュール待ち')
      .eq('approval_status', 'approved')
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`商品取得エラー: ${error.message}`)
    }

    const productsForSchedule = (products || []).map(p => ({
      ...p,
      ai_confidence_score: null as number | null,
    })) as ProductForApproval[]

    // 週間プレビュー
    if (preview === 'week') {
      const weekPreview = previewWeekSchedule(
        count || 0,
        settings,
        targetDate
      )

      return NextResponse.json({
        success: true,
        settings_enabled: settings.enabled,
        settings,
        total_candidates: count || 0,
        preview_type: 'week',
        week_preview: weekPreview,
      })
    }

    // 日次プレビュー
    const dayPreview = previewSchedule(
      productsForSchedule,
      settings,
      targetDate
    )

    // 詳細なスケジュール生成（ドライラン）
    const scheduleResult = generateSchedule(
      productsForSchedule,
      settings,
      targetDate
    )

    return NextResponse.json({
      success: true,
      settings_enabled: settings.enabled,
      settings,
      total_candidates: count || 0,
      preview_type: 'day',
      day_preview: dayPreview,
      scheduled_items: scheduleResult.scheduled_items,
      skipped: scheduleResult.skipped,
    })
  } catch (error) {
    console.error('❌ プレビュー取得エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'プレビューの取得に失敗しました',
      },
      { status: 500 }
    )
  }
}

/**
 * 自動スケジュール生成実行
 * POST /api/automation/auto-schedule
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      dry_run = false,
      product_ids,
      platform,
      date,
    } = body as {
      dry_run?: boolean
      product_ids?: string[]
      platform?: string
      date?: string
    }

    const targetDate = date ? new Date(date) : new Date()
    const startedAt = new Date()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || null

    // 設定を取得
    const { data: settingsData } = await supabase
      .from('default_schedule_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const settings: DefaultScheduleSettings = settingsData || {
      ...DEFAULT_SCHEDULE_SETTINGS,
      id: 'default',
      user_id: 'default',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (!settings.enabled && !dry_run) {
      return NextResponse.json({
        success: false,
        error: '自動スケジュールが無効になっています',
      }, { status: 400 })
    }

    // 商品を取得
    let query = supabase
      .from('products_master')
      .select(`
        id,
        sku,
        title,
        title_en,
        ddp_price_usd,
        category_name,
        primary_image_url,
        images,
        seo_health_score,
        listing_score,
        profit_margin_percent,
        status,
        approval_status,
        recommended_platform,
        updated_at
      `)
      .eq('status', '出品スケジュール待ち')
      .eq('approval_status', 'approved')

    if (product_ids && product_ids.length > 0) {
      query = query.in('id', product_ids)
    }

    if (platform) {
      query = query.eq('recommended_platform', platform)
    }

    const { data: products, error } = await query
      .order('updated_at', { ascending: false })
      .limit(500)

    if (error) {
      throw new Error(`商品取得エラー: ${error.message}`)
    }

    const productsForSchedule = (products || []).map(p => ({
      ...p,
      ai_confidence_score: null as number | null,
    })) as ProductForApproval[]

    // スケジュール生成
    const result = generateSchedule(productsForSchedule, settings, targetDate)

    // ドライランの場合は結果のみ返す
    if (dry_run) {
      return NextResponse.json({
        success: true,
        dry_run: true,
        results: {
          total: productsForSchedule.length,
          scheduled: result.scheduled_items.length,
          skipped: result.skipped.length,
          errors: result.errors.length,
        },
        scheduled_items: result.scheduled_items,
        skipped: result.skipped,
      })
    }

    // 実際のスケジュール登録
    const scheduledIds: string[] = []
    let errorCount = 0

    for (const item of result.scheduled_items) {
      try {
        // listing_schedulesテーブルに登録（存在する場合）
        const { error: insertError } = await supabase
          .from('listing_schedules')
          .insert({
            product_id: item.product_id,
            scheduled_time: item.scheduled_time,
            platform: item.platform,
            status: 'pending',
            created_at: new Date().toISOString(),
          })

        if (insertError) {
          // テーブルが存在しない場合は商品のステータスのみ更新
          if (insertError.code === '42P01') {
            console.warn('⚠️ listing_schedulesテーブルが存在しません')
          } else {
            throw insertError
          }
        }

        // 商品ステータスを更新
        await supabase
          .from('products_master')
          .update({
            status: '出品中',
            scheduled_listing_time: item.scheduled_time,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.product_id)

        scheduledIds.push(item.product_id)
      } catch (err) {
        console.error(`❌ 商品 ${item.product_id} のスケジュール登録エラー:`, err)
        errorCount++
        result.errors.push({
          product_id: item.product_id,
          error: err instanceof Error ? err.message : '不明なエラー',
        })
      }
    }

    const completedAt = new Date()
    const durationMs = completedAt.getTime() - startedAt.getTime()

    // ログを記録
    const { data: logData } = await supabase
      .from('auto_schedule_logs')
      .insert({
        user_id: userId,
        execution_type: 'batch',
        total_products: productsForSchedule.length,
        scheduled_count: scheduledIds.length,
        skipped_count: result.skipped.length,
        error_count: errorCount,
        details: {
          scheduled_products: scheduledIds,
          skipped_reasons: Object.fromEntries(
            result.skipped.map(s => [s.product_id, s.reason])
          ),
          errors: Object.fromEntries(
            result.errors.map(e => [e.product_id, e.error])
          ),
        },
        settings_snapshot: settings,
        started_at: startedAt.toISOString(),
        completed_at: completedAt.toISOString(),
        duration_ms: durationMs,
      })
      .select()
      .single()

    console.log(`✅ 自動スケジュール完了: ${scheduledIds.length}件 (${durationMs}ms)`)

    return NextResponse.json({
      success: true,
      dry_run: false,
      results: {
        total: productsForSchedule.length,
        scheduled: scheduledIds.length,
        skipped: result.skipped.length,
        errors: errorCount,
      },
      scheduled_items: result.scheduled_items.filter(i => scheduledIds.includes(i.product_id)),
      skipped: result.skipped,
      errors: result.errors,
      log_id: logData?.id,
      duration_ms: durationMs,
    })
  } catch (error) {
    console.error('❌ 自動スケジュール実行エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '自動スケジュールの実行に失敗しました',
      },
      { status: 500 }
    )
  }
}
