/**
 * 自動化ログAPI
 * GET: ログ取得（承認ログ、スケジュールログ）
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * ログ取得
 * GET /api/automation/logs?type=approval|schedule|both&limit=50&offset=0
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'both'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const productId = searchParams.get('product_id')
    const action = searchParams.get('action')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    const supabase = await createClient()

    const response: {
      success: boolean
      approval_logs?: {
        data: any[]
        total: number
      }
      schedule_logs?: {
        data: any[]
        total: number
      }
      stats?: {
        today: {
          approved: number
          rejected: number
          scheduled: number
        }
        week: {
          approved: number
          rejected: number
          scheduled: number
        }
      }
    } = { success: true }

    // 承認ログ
    if (type === 'approval' || type === 'both') {
      let query = supabase
        .from('auto_approval_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (productId) {
        query = query.eq('product_id', productId)
      }

      if (action) {
        query = query.eq('action', action)
      }

      if (startDate) {
        query = query.gte('created_at', startDate)
      }

      if (endDate) {
        query = query.lte('created_at', endDate)
      }

      const { data, error, count } = await query.range(offset, offset + limit - 1)

      if (error && error.code !== '42P01') {
        console.error('❌ 承認ログ取得エラー:', error)
      }

      response.approval_logs = {
        data: data || [],
        total: count || 0,
      }
    }

    // スケジュールログ
    if (type === 'schedule' || type === 'both') {
      let query = supabase
        .from('auto_schedule_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (startDate) {
        query = query.gte('created_at', startDate)
      }

      if (endDate) {
        query = query.lte('created_at', endDate)
      }

      const { data, error, count } = await query.range(offset, offset + limit - 1)

      if (error && error.code !== '42P01') {
        console.error('❌ スケジュールログ取得エラー:', error)
      }

      response.schedule_logs = {
        data: data || [],
        total: count || 0,
      }
    }

    // 統計情報
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString()

    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekAgoStr = weekAgo.toISOString()

    // 今日の承認統計
    const { count: todayApproved } = await supabase
      .from('auto_approval_logs')
      .select('id', { count: 'exact', head: true })
      .eq('action', 'auto_approved')
      .gte('created_at', todayStr)

    const { count: todayRejected } = await supabase
      .from('auto_approval_logs')
      .select('id', { count: 'exact', head: true })
      .eq('action', 'auto_rejected')
      .gte('created_at', todayStr)

    const { data: todayScheduleData } = await supabase
      .from('auto_schedule_logs')
      .select('scheduled_count')
      .gte('created_at', todayStr)

    const todayScheduled = todayScheduleData?.reduce((sum, log) => sum + (log.scheduled_count || 0), 0) || 0

    // 週間の承認統計
    const { count: weekApproved } = await supabase
      .from('auto_approval_logs')
      .select('id', { count: 'exact', head: true })
      .eq('action', 'auto_approved')
      .gte('created_at', weekAgoStr)

    const { count: weekRejected } = await supabase
      .from('auto_approval_logs')
      .select('id', { count: 'exact', head: true })
      .eq('action', 'auto_rejected')
      .gte('created_at', weekAgoStr)

    const { data: weekScheduleData } = await supabase
      .from('auto_schedule_logs')
      .select('scheduled_count')
      .gte('created_at', weekAgoStr)

    const weekScheduled = weekScheduleData?.reduce((sum, log) => sum + (log.scheduled_count || 0), 0) || 0

    response.stats = {
      today: {
        approved: todayApproved || 0,
        rejected: todayRejected || 0,
        scheduled: todayScheduled,
      },
      week: {
        approved: weekApproved || 0,
        rejected: weekRejected || 0,
        scheduled: weekScheduled,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ ログ取得エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'ログの取得に失敗しました',
      },
      { status: 500 }
    )
  }
}

/**
 * ログの削除（管理者用）
 * DELETE /api/automation/logs?type=approval|schedule&before=2025-01-01
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const before = searchParams.get('before')

    if (!type || !before) {
      return NextResponse.json(
        { success: false, error: 'typeとbeforeパラメータが必要です' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    let deletedCount = 0

    if (type === 'approval') {
      const { count } = await supabase
        .from('auto_approval_logs')
        .delete()
        .lt('created_at', before)
        .select('id', { count: 'exact', head: true })

      deletedCount = count || 0
    } else if (type === 'schedule') {
      const { count } = await supabase
        .from('auto_schedule_logs')
        .delete()
        .lt('created_at', before)
        .select('id', { count: 'exact', head: true })

      deletedCount = count || 0
    }

    console.log(`✅ ${type}ログを${deletedCount}件削除しました`)

    return NextResponse.json({
      success: true,
      deleted_count: deletedCount,
    })
  } catch (error) {
    console.error('❌ ログ削除エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'ログの削除に失敗しました',
      },
      { status: 500 }
    )
  }
}
