/**
 * 有在庫判定キュー管理API
 * DELETE /api/inventory/classification-queue - キューをクリア
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const marketplace = searchParams.get('marketplace')
    
    let query = supabase
      .from('stock_classification_queue')
      .select('*')
      .is('is_stock', null)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (marketplace && marketplace !== 'all') {
      query = query.eq('marketplace', marketplace)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('キュー取得エラー:', error)
      return NextResponse.json(
        { error: `キュー取得失敗: ${error.message}` },
        { status: 500 }
      )
    }
    
    const { count } = await supabase
      .from('stock_classification_queue')
      .select('*', { count: 'exact', head: true })
      .is('is_stock', null)
    
    return NextResponse.json({
      success: true,
      data: data || [],
      total_pending: count || 0
    })
    
  } catch (error: any) {
    console.error('API エラー:', error)
    return NextResponse.json(
      { error: `内部エラー: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * キュークリア（DELETE）
 */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { searchParams } = new URL(req.url)
    const clearAll = searchParams.get('all') === 'true'
    const clearPending = searchParams.get('pending') === 'true'
    
    let deletedCount = 0
    
    if (clearAll) {
      // 全件削除
      const { error, count } = await supabase
        .from('stock_classification_queue')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // 全件削除のトリック
        .select('*', { count: 'exact' })
      
      if (error) throw error
      deletedCount = count || 0
      
    } else if (clearPending) {
      // 未判定のみ削除
      const { error, count } = await supabase
        .from('stock_classification_queue')
        .delete()
        .is('is_stock', null)
        .select('*', { count: 'exact' })
      
      if (error) throw error
      deletedCount = count || 0
    }
    
    console.log(`✅ 分類キュー削除: ${deletedCount}件`)
    
    return NextResponse.json({
      success: true,
      deleted: deletedCount,
      message: clearAll ? '全件削除しました' : '未判定データを削除しました'
    })
    
  } catch (error: any) {
    console.error('削除エラー:', error)
    return NextResponse.json(
      { error: `削除失敗: ${error.message}` },
      { status: 500 }
    )
  }
}
