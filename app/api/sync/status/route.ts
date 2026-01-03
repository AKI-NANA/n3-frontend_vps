/**
 * 同期ステータス取得API
 * GET /api/sync/status
 * 
 * 各アカウントの同期状態を取得
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    // 同期ステータス取得
    const { data: syncStatus, error: statusError } = await supabase
      .from('sync_status')
      .select('*')
      .eq('marketplace', 'ebay')
      .order('account')

    if (statusError) {
      // テーブルがない場合は空を返す
      return NextResponse.json({
        status: [],
        history: [],
        schedules: []
      })
    }

    // 最新の同期履歴（各アカウント5件ずつ）
    const { data: syncHistory } = await supabase
      .from('sync_history')
      .select('*')
      .eq('marketplace', 'ebay')
      .order('started_at', { ascending: false })
      .limit(20)

    // 予約スケジュール
    const { data: schedules } = await supabase
      .from('sync_schedules')
      .select('*')
      .eq('marketplace', 'ebay')
      .order('account')

    // eBay出品数をリアルタイムで取得
    const ebayCountsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ebay/count`)
    const ebayCounts = ebayCountsRes.ok ? await ebayCountsRes.json() : null

    return NextResponse.json({
      status: syncStatus || [],
      history: syncHistory || [],
      schedules: schedules || [],
      ebay_counts: ebayCounts
    })

  } catch (error: any) {
    console.error('ステータス取得エラー:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
