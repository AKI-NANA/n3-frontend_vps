import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * スケジュール更新API
 * PATCH /api/approval/update-schedule
 * 
 * 出品予定時間を変更する
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { scheduleId, scheduledAt, priority } = body
    
    if (!scheduleId) {
      return NextResponse.json(
        { error: 'scheduleIdが必要です' },
        { status: 400 }
      )
    }
    
    // 更新データを構築
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }
    
    if (scheduledAt) {
      updateData.scheduled_at = new Date(scheduledAt).toISOString()
    }
    
    if (priority !== undefined) {
      updateData.priority = priority
    }
    
    // スケジュールを更新
    const { data: updated, error: updateError } = await supabase
      .from('listing_schedule')
      .update(updateData)
      .eq('id', scheduleId)
      .select()
      .single()
    
    if (updateError) {
      return NextResponse.json(
        { error: `スケジュール更新エラー: ${updateError.message}` },
        { status: 500 }
      )
    }
    
    // products_masterのscheduled_atも更新
    if (scheduledAt && updated) {
      await supabase
        .from('products_master')
        .update({
          scheduled_at: updateData.scheduled_at,
          updated_at: new Date().toISOString()
        })
        .eq('id', updated.product_id)
    }
    
    return NextResponse.json({
      success: true,
      message: 'スケジュールを更新しました',
      data: updated
    })
    
  } catch (error) {
    console.error('Error in update-schedule:', error)
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    )
  }
}

/**
 * 複数スケジュール一括更新
 * POST /api/approval/update-schedule
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { updates } = body
    
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'updates配列が必要です' },
        { status: 400 }
      )
    }
    
    const results = []
    const errors = []
    
    for (const update of updates) {
      const { scheduleId, scheduledAt, priority } = update
      
      if (!scheduleId) {
        errors.push({ scheduleId: null, error: 'scheduleIdが必要です' })
        continue
      }
      
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString()
      }
      
      if (scheduledAt) {
        updateData.scheduled_at = new Date(scheduledAt).toISOString()
      }
      
      if (priority !== undefined) {
        updateData.priority = priority
      }
      
      const { data: updated, error: updateError } = await supabase
        .from('listing_schedule')
        .update(updateData)
        .eq('id', scheduleId)
        .select()
        .single()
      
      if (updateError) {
        errors.push({ scheduleId, error: updateError.message })
      } else {
        results.push(updated)
        
        // products_masterのscheduled_atも更新
        if (scheduledAt && updated) {
          await supabase
            .from('products_master')
            .update({
              scheduled_at: updateData.scheduled_at,
              updated_at: new Date().toISOString()
            })
            .eq('id', updated.product_id)
        }
      }
    }
    
    return NextResponse.json({
      success: errors.length === 0,
      message: `${results.length}件更新、${errors.length}件エラー`,
      data: {
        updated: results,
        errors: errors
      }
    })
    
  } catch (error) {
    console.error('Error in update-schedule:', error)
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    )
  }
}
