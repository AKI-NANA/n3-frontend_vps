/**
 * 自動化設定API
 * GET: 設定取得
 * PUT: 設定更新
 * POST: 初期設定作成
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  AutoApprovalSettings,
  DefaultScheduleSettings,
  UpdateAutoApprovalSettingsRequest,
  UpdateDefaultScheduleSettingsRequest,
} from '@/types/automation'
import { DEFAULT_AUTO_APPROVAL_SETTINGS } from '@/services/automation/AutoApprovalEngine'
import { DEFAULT_SCHEDULE_SETTINGS } from '@/services/automation/AutoScheduleEngine'

/**
 * 設定取得
 * GET /api/automation/settings?type=approval|schedule|both
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'both'

    const supabase = await createClient()

    // ユーザー認証（オプション - 現在はRLS無効化状態）
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || null

    const response: {
      success: boolean
      approval_settings?: AutoApprovalSettings | null
      schedule_settings?: DefaultScheduleSettings | null
    } = { success: true }

    if (type === 'approval' || type === 'both') {
      const { data: approvalData, error: approvalError } = await supabase
        .from('auto_approval_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (approvalError && approvalError.code !== 'PGRST116') {
        console.error('❌ 承認設定取得エラー:', approvalError)
      }

      response.approval_settings = approvalData || null
    }

    if (type === 'schedule' || type === 'both') {
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('default_schedule_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (scheduleError && scheduleError.code !== 'PGRST116') {
        console.error('❌ スケジュール設定取得エラー:', scheduleError)
      }

      response.schedule_settings = scheduleData || null
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ 設定取得エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '設定の取得に失敗しました',
      },
      { status: 500 }
    )
  }
}

/**
 * 設定更新
 * PUT /api/automation/settings
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, settings } = body as {
      type: 'approval' | 'schedule'
      settings: UpdateAutoApprovalSettingsRequest | UpdateDefaultScheduleSettingsRequest
    }

    if (!type || !settings) {
      return NextResponse.json(
        { success: false, error: 'typeとsettingsが必要です' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || null

    if (type === 'approval') {
      // 既存の設定を取得
      const { data: existing } = await supabase
        .from('auto_approval_settings')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (existing) {
        // 更新
        const { data, error } = await supabase
          .from('auto_approval_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error

        console.log('✅ 自動承認設定を更新しました')
        return NextResponse.json({ success: true, data })
      } else {
        // 新規作成
        const { data, error } = await supabase
          .from('auto_approval_settings')
          .insert({
            ...DEFAULT_AUTO_APPROVAL_SETTINGS,
            ...settings,
            user_id: userId,
          })
          .select()
          .single()

        if (error) throw error

        console.log('✅ 自動承認設定を作成しました')
        return NextResponse.json({ success: true, data })
      }
    } else if (type === 'schedule') {
      // 既存の設定を取得
      const { data: existing } = await supabase
        .from('default_schedule_settings')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (existing) {
        // 更新
        const { data, error } = await supabase
          .from('default_schedule_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error

        console.log('✅ スケジュール設定を更新しました')
        return NextResponse.json({ success: true, data })
      } else {
        // 新規作成
        const { data, error } = await supabase
          .from('default_schedule_settings')
          .insert({
            ...DEFAULT_SCHEDULE_SETTINGS,
            ...settings,
            user_id: userId,
          })
          .select()
          .single()

        if (error) throw error

        console.log('✅ スケジュール設定を作成しました')
        return NextResponse.json({ success: true, data })
      }
    }

    return NextResponse.json(
      { success: false, error: '不正なtypeです' },
      { status: 400 }
    )
  } catch (error) {
    console.error('❌ 設定更新エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '設定の更新に失敗しました',
      },
      { status: 500 }
    )
  }
}

/**
 * 初期設定作成
 * POST /api/automation/settings
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body as { type: 'approval' | 'schedule' | 'both' }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || null

    const results: {
      approval?: AutoApprovalSettings
      schedule?: DefaultScheduleSettings
    } = {}

    if (type === 'approval' || type === 'both') {
      // 既存チェック
      const { data: existing } = await supabase
        .from('auto_approval_settings')
        .select('id')
        .limit(1)
        .maybeSingle()

      if (!existing) {
        const { data, error } = await supabase
          .from('auto_approval_settings')
          .insert({
            ...DEFAULT_AUTO_APPROVAL_SETTINGS,
            user_id: userId,
          })
          .select()
          .single()

        if (error) throw error
        results.approval = data
        console.log('✅ 自動承認デフォルト設定を作成しました')
      }
    }

    if (type === 'schedule' || type === 'both') {
      // 既存チェック
      const { data: existing } = await supabase
        .from('default_schedule_settings')
        .select('id')
        .limit(1)
        .maybeSingle()

      if (!existing) {
        const { data, error } = await supabase
          .from('default_schedule_settings')
          .insert({
            ...DEFAULT_SCHEDULE_SETTINGS,
            user_id: userId,
          })
          .select()
          .single()

        if (error) throw error
        results.schedule = data
        console.log('✅ スケジュールデフォルト設定を作成しました')
      }
    }

    return NextResponse.json({
      success: true,
      created: results,
    })
  } catch (error) {
    console.error('❌ 設定作成エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '設定の作成に失敗しました',
      },
      { status: 500 }
    )
  }
}
