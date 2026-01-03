/**
 * 自動承認実行API
 * POST: 自動承認バッチ実行
 * GET: 承認対象商品のプレビュー
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  AutoApprovalSettings,
  ProductForApproval,
  AutoApprovalLog,
  EvaluationResult,
} from '@/types/automation'
import {
  evaluateForAutoApproval,
  batchEvaluate,
  getEvaluationSummary,
  DEFAULT_AUTO_APPROVAL_SETTINGS,
} from '@/services/automation/AutoApprovalEngine'

/**
 * 承認対象商品のプレビュー
 * GET /api/automation/auto-approve?limit=100
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '100')
    const dryRun = searchParams.get('dry_run') === 'true'

    const supabase = await createClient()

    // 設定を取得
    const { data: settingsData } = await supabase
      .from('auto_approval_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const settings: AutoApprovalSettings = settingsData || {
      ...DEFAULT_AUTO_APPROVAL_SETTINGS,
      id: 'default',
      user_id: 'default',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // 承認対象商品を取得（status = '外注処理完了' または '編集完了'）
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
      .in('status', ['外注処理完了', '編集完了'])
      .is('approval_status', null)
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`商品取得エラー: ${error.message}`)
    }

    const productsForApproval = (products || []).map(p => ({
      ...p,
      ai_confidence_score: null as number | null, // products_masterにない場合はnull
    })) as ProductForApproval[]

    // ドライラン: 評価結果のプレビュー
    if (dryRun) {
      const results = batchEvaluate(productsForApproval, settings)
      const summary = getEvaluationSummary(results)

      const preview = productsForApproval.map(p => ({
        id: p.id,
        sku: p.sku,
        title: p.title_en || p.title,
        evaluation: results.get(p.id),
      }))

      return NextResponse.json({
        success: true,
        settings_enabled: settings.enabled,
        settings,
        summary,
        preview,
        total_candidates: count || 0,
      })
    }

    return NextResponse.json({
      success: true,
      settings_enabled: settings.enabled,
      settings,
      products: productsForApproval,
      total: count || 0,
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
 * 自動承認バッチ実行
 * POST /api/automation/auto-approve
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      dry_run = false,
      product_ids,
      limit = 100,
    } = body as {
      dry_run?: boolean
      product_ids?: string[]
      limit?: number
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || null

    // 設定を取得
    const { data: settingsData } = await supabase
      .from('auto_approval_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const settings: AutoApprovalSettings = settingsData || {
      ...DEFAULT_AUTO_APPROVAL_SETTINGS,
      id: 'default',
      user_id: 'default',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (!settings.enabled && !dry_run) {
      return NextResponse.json({
        success: false,
        error: '自動承認が無効になっています',
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
      .in('status', ['外注処理完了', '編集完了'])
      .is('approval_status', null)

    if (product_ids && product_ids.length > 0) {
      query = query.in('id', product_ids)
    }

    const { data: products, error } = await query
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`商品取得エラー: ${error.message}`)
    }

    const productsForApproval = (products || []).map(p => ({
      ...p,
      ai_confidence_score: null as number | null,
    })) as ProductForApproval[]

    // 評価実行
    const results = batchEvaluate(productsForApproval, settings)
    const summary = getEvaluationSummary(results)

    // ドライランの場合は結果のみ返す
    if (dry_run) {
      const logs: Partial<AutoApprovalLog>[] = []
      productsForApproval.forEach(p => {
        const evaluation = results.get(p.id)
        if (evaluation) {
          logs.push({
            product_id: p.id,
            action: evaluation.decision,
            evaluation_data: evaluation,
          })
        }
      })

      return NextResponse.json({
        success: true,
        dry_run: true,
        results: {
          total: summary.total,
          approved: summary.approved,
          rejected: summary.rejected,
          manual_required: summary.manual_required,
          errors: 0,
        },
        logs,
      })
    }

    // 実際の承認処理
    const approvedIds: string[] = []
    const rejectedIds: string[] = []
    const logs: AutoApprovalLog[] = []
    let errorCount = 0

    for (const product of productsForApproval) {
      const evaluation = results.get(product.id)
      if (!evaluation) continue

      try {
        let newStatus: string
        let approvalStatus: string

        switch (evaluation.decision) {
          case 'auto_approved':
            newStatus = '出品スケジュール待ち'
            approvalStatus = 'approved'
            approvedIds.push(product.id)
            break
          case 'auto_rejected':
            newStatus = '戦略キャンセル'
            approvalStatus = 'rejected'
            rejectedIds.push(product.id)
            break
          default:
            // manual_required は何もしない
            continue
        }

        // 商品ステータスを更新
        await supabase
          .from('products_master')
          .update({
            status: newStatus,
            approval_status: approvalStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', product.id)

        // ログを記録
        const logEntry = {
          product_id: product.id,
          user_id: userId,
          action: evaluation.decision,
          evaluation_data: evaluation,
          settings_snapshot: settings,
        }

        const { data: logData } = await supabase
          .from('auto_approval_logs')
          .insert(logEntry)
          .select()
          .single()

        if (logData) {
          logs.push(logData as AutoApprovalLog)
        }
      } catch (err) {
        console.error(`❌ 商品 ${product.id} の処理エラー:`, err)
        errorCount++
      }
    }

    console.log(`✅ 自動承認完了: 承認=${approvedIds.length}, 却下=${rejectedIds.length}, エラー=${errorCount}`)

    return NextResponse.json({
      success: true,
      dry_run: false,
      results: {
        total: productsForApproval.length,
        approved: approvedIds.length,
        rejected: rejectedIds.length,
        manual_required: summary.manual_required,
        errors: errorCount,
      },
      logs,
    })
  } catch (error) {
    console.error('❌ 自動承認実行エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '自動承認の実行に失敗しました',
      },
      { status: 500 }
    )
  }
}
