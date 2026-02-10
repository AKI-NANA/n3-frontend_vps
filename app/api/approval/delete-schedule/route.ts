import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * スケジュール削除API
 * DELETE /api/approval/delete-schedule
 * 
 * スケジュールを削除し、商品のステータスを承認済みに戻す
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const scheduleId = searchParams.get('scheduleId')
    const productId = searchParams.get('productId')
    const marketplace = searchParams.get('marketplace')
    const accountId = searchParams.get('accountId')
    
    if (!scheduleId && !productId) {
      return NextResponse.json(
        { error: 'scheduleIdまたはproductIdが必要です' },
        { status: 400 }
      )
    }
    
    // スケジュールを取得
    let query = supabase
      .from('listing_schedule')
      .select('*')
      .in('status', ['PENDING', 'SCHEDULED'])
    
    if (scheduleId) {
      query = query.eq('id', scheduleId)
    } else {
      query = query.eq('product_id', productId)
      if (marketplace) query = query.eq('marketplace', marketplace)
      if (accountId) query = query.eq('account_id', accountId)
    }
    
    const { data: schedules, error: fetchError } = await query
    
    if (fetchError) {
      return NextResponse.json(
        { error: `スケジュール取得エラー: ${fetchError.message}` },
        { status: 500 }
      )
    }
    
    if (!schedules || schedules.length === 0) {
      return NextResponse.json(
        { error: '削除対象のスケジュールが見つかりません' },
        { status: 404 }
      )
    }
    
    // スケジュールを削除
    const scheduleIds = schedules.map(s => s.id)
    const { error: deleteError } = await supabase
      .from('listing_schedule')
      .delete()
      .in('id', scheduleIds)
    
    if (deleteError) {
      return NextResponse.json(
        { error: `スケジュール削除エラー: ${deleteError.message}` },
        { status: 500 }
      )
    }
    
    // 商品のworkflow_statusを承認済みに戻す
    const productIds = [...new Set(schedules.map(s => s.product_id))]
    
    // 各商品について、他にスケジュールが残っているか確認
    for (const pid of productIds) {
      const { data: remainingSchedules } = await supabase
        .from('listing_schedule')
        .select('id')
        .eq('product_id', pid)
        .in('status', ['PENDING', 'SCHEDULED', 'RUNNING'])
        .limit(1)
      
      // 他にスケジュールがなければステータスを戻す
      if (!remainingSchedules || remainingSchedules.length === 0) {
        await supabase
          .from('products_master')
          .update({
            workflow_status: 'approved',
            schedule_status: null,
            scheduled_at: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', pid)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `${scheduleIds.length}件のスケジュールを削除しました`,
      data: {
        deletedCount: scheduleIds.length,
        affectedProducts: productIds.length
      }
    })
    
  } catch (error) {
    console.error('Error in delete-schedule:', error)
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    )
  }
}

/**
 * 複数スケジュール一括削除
 * POST /api/approval/delete-schedule
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { scheduleIds, productIds, deleteAll } = body
    
    if (!scheduleIds && !productIds && !deleteAll) {
      return NextResponse.json(
        { error: 'scheduleIds, productIds, またはdeleteAllが必要です' },
        { status: 400 }
      )
    }
    
    let query = supabase
      .from('listing_schedule')
      .select('*')
      .in('status', ['PENDING', 'SCHEDULED'])
    
    if (scheduleIds && scheduleIds.length > 0) {
      query = query.in('id', scheduleIds)
    } else if (productIds && productIds.length > 0) {
      query = query.in('product_id', productIds)
    }
    // deleteAll の場合はフィルターなし（PENDING/SCHEDULED全て）
    
    const { data: schedules, error: fetchError } = await query
    
    if (fetchError) {
      return NextResponse.json(
        { error: `スケジュール取得エラー: ${fetchError.message}` },
        { status: 500 }
      )
    }
    
    if (!schedules || schedules.length === 0) {
      return NextResponse.json({
        success: true,
        message: '削除対象のスケジュールがありません',
        data: { deletedCount: 0, affectedProducts: 0 }
      })
    }
    
    // スケジュールを削除
    const ids = schedules.map(s => s.id)
    const { error: deleteError } = await supabase
      .from('listing_schedule')
      .delete()
      .in('id', ids)
    
    if (deleteError) {
      return NextResponse.json(
        { error: `スケジュール削除エラー: ${deleteError.message}` },
        { status: 500 }
      )
    }
    
    // 商品のworkflow_statusを承認済みに戻す
    const affectedProductIds = [...new Set(schedules.map(s => s.product_id))]
    
    for (const pid of affectedProductIds) {
      const { data: remainingSchedules } = await supabase
        .from('listing_schedule')
        .select('id')
        .eq('product_id', pid)
        .in('status', ['PENDING', 'SCHEDULED', 'RUNNING'])
        .limit(1)
      
      if (!remainingSchedules || remainingSchedules.length === 0) {
        await supabase
          .from('products_master')
          .update({
            workflow_status: 'approved',
            schedule_status: null,
            scheduled_at: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', pid)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `${ids.length}件のスケジュールを削除しました`,
      data: {
        deletedCount: ids.length,
        affectedProducts: affectedProductIds.length
      }
    })
    
  } catch (error) {
    console.error('Error in delete-schedule:', error)
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    )
  }
}
