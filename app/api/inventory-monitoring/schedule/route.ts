// app/api/inventory-monitoring/schedule/route.ts
// スケジュール設定の取得・更新

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // まず monitoring_schedule_settings を試す
    let { data, error } = await supabase
      .from('monitoring_schedule_settings')
      .select('*')
      .limit(1)
      .single()

    // テーブルが存在しない場合は monitoring_schedules を試す
    if (error && (error.code === '42P01' || error.message?.includes('does not exist'))) {
      const result = await supabase
        .from('monitoring_schedules')
        .select('*')
        .limit(1)
        .single()
      
      data = result.data
      error = result.error
    }

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = No rows found (許容)
      console.error('スケジュール取得エラー:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      schedule: data || null,
    })
  } catch (error: any) {
    console.error('❌ スケジュール取得エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'スケジュール取得に失敗しました',
        details: error,
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    console.log('📝 監視設定更新リクエスト:', body)

    const {
      enabled,
      frequency,
      time_window_start,
      time_window_end,
      max_items_per_batch,
      delay_min_seconds,
      delay_max_seconds,
      random_time_offset_minutes,
      email_notification,
      notification_emails,
      notify_on_changes_only,
    } = body

    // テーブル名を確認（monitoring_schedule_settings を優先）
    let tableName = 'monitoring_schedule_settings'
    
    // テーブル存在確認
    const { error: checkError } = await supabase
      .from(tableName)
      .select('id')
      .limit(1)
    
    if (checkError && (checkError.code === '42P01' || checkError.message?.includes('does not exist'))) {
      tableName = 'monitoring_schedules'
    }

    console.log('📊 使用テーブル:', tableName)

    // 既存のスケジュールを取得
    const { data: existingSchedule } = await supabase
      .from(tableName)
      .select('id')
      .limit(1)
      .single()

    const updateData = {
      enabled: enabled ?? false,
      frequency: frequency || 'daily',
      time_window_start: time_window_start || '09:00',
      time_window_end: time_window_end || '21:00',
      max_items_per_batch: max_items_per_batch || 100,
      delay_min_seconds: delay_min_seconds || 1,
      delay_max_seconds: delay_max_seconds || 3,
      random_time_offset_minutes: random_time_offset_minutes || 15,
      email_notification: email_notification ?? false,
      notification_emails: notification_emails || [],
      notify_on_changes_only: notify_on_changes_only ?? true,
      updated_at: new Date().toISOString(),
    }

    let result

    if (existingSchedule) {
      // 更新
      console.log('🔄 既存レコード更新:', existingSchedule.id)
      result = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', existingSchedule.id)
        .select()
        .single()
    } else {
      // 新規作成
      console.log('➕ 新規レコード作成')
      result = await supabase
        .from(tableName)
        .insert({
          ...updateData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()
    }

    if (result.error) {
      console.error('❌ DB操作エラー:', result.error)
      throw result.error
    }

    console.log('✅ 監視設定更新成功:', result.data)

    return NextResponse.json({
      success: true,
      schedule: result.data,
      message: 'スケジュール設定を更新しました',
    })
  } catch (error: any) {
    console.error('❌ スケジュール更新エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'スケジュール更新に失敗しました',
        details: {
          code: error.code,
          hint: error.hint,
          details: error.details,
        },
      },
      { status: 500 }
    )
  }
}
