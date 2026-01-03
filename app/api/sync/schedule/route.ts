/**
 * 同期スケジュール管理API
 * GET /api/sync/schedule - スケジュール一覧取得
 * POST /api/sync/schedule - スケジュール作成/更新
 * DELETE /api/sync/schedule - スケジュール削除
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// スケジュール一覧取得
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: schedules, error } = await supabase
      .from('sync_schedules')
      .select('*')
      .order('account')

    if (error) {
      // テーブルがない場合
      return NextResponse.json({ schedules: [] })
    }

    return NextResponse.json({ schedules: schedules || [] })

  } catch (error: any) {
    console.error('スケジュール取得エラー:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// スケジュール作成/更新
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      account,
      marketplace = 'ebay',
      schedule_type = 'full',
      time_of_day,
      days_of_week,
      is_enabled = true
    } = body

    if (!account || !time_of_day) {
      return NextResponse.json(
        { error: 'account と time_of_day は必須です' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 次回実行日時を計算
    const nextRunAt = calculateNextRunAt(time_of_day, days_of_week)

    const { data, error } = await supabase
      .from('sync_schedules')
      .upsert({
        account,
        marketplace,
        schedule_type,
        time_of_day,
        days_of_week: days_of_week || [0, 1, 2, 3, 4, 5, 6], // デフォルト: 毎日
        is_enabled,
        next_run_at: nextRunAt,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'account,marketplace,schedule_type'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      schedule: data
    })

  } catch (error: any) {
    console.error('スケジュール作成エラー:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// スケジュール削除
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id パラメータが必要です' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('sync_schedules')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('スケジュール削除エラー:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * 次回実行日時を計算
 */
function calculateNextRunAt(timeOfDay: string, daysOfWeek?: number[]): string {
  const now = new Date()
  const [hours, minutes] = timeOfDay.split(':').map(Number)

  // 今日の実行時刻
  const todayRun = new Date(now)
  todayRun.setHours(hours, minutes, 0, 0)

  // 曜日指定がある場合
  if (daysOfWeek && daysOfWeek.length > 0) {
    const currentDay = now.getDay()
    
    // 今日が対象曜日で、まだ実行時刻前なら今日
    if (daysOfWeek.includes(currentDay) && todayRun > now) {
      return todayRun.toISOString()
    }

    // 次の対象曜日を探す
    for (let i = 1; i <= 7; i++) {
      const nextDay = (currentDay + i) % 7
      if (daysOfWeek.includes(nextDay)) {
        const nextRun = new Date(now)
        nextRun.setDate(now.getDate() + i)
        nextRun.setHours(hours, minutes, 0, 0)
        return nextRun.toISOString()
      }
    }
  }

  // 毎日の場合：まだ実行時刻前なら今日、過ぎていたら明日
  if (todayRun > now) {
    return todayRun.toISOString()
  }

  const tomorrowRun = new Date(todayRun)
  tomorrowRun.setDate(tomorrowRun.getDate() + 1)
  return tomorrowRun.toISOString()
}
