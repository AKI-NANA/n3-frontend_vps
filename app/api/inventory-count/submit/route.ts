/**
 * 棚卸しデータ保存API
 * POST: 棚卸し結果をログに記録し、マスターを更新
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSessionFromRequest } from '@/lib/inventory-count/auth'

interface SubmitRequest {
  inventory_master_id: string
  counted_quantity: number
  location?: string
  images?: string[]
  notes?: string
}

/**
 * POST /api/inventory-count/submit
 * 棚卸し結果を保存
 */
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'external_counter') {
      return NextResponse.json(
        { success: false, error: '認証が必要です' },
        { status: 401 }
      )
    }
    
    const supabase = await createClient()
    const body: SubmitRequest = await request.json()
    
    // バリデーション
    if (!body.inventory_master_id) {
      return NextResponse.json(
        { success: false, error: '商品IDが必要です' },
        { status: 400 }
      )
    }
    
    if (typeof body.counted_quantity !== 'number' || body.counted_quantity < 0) {
      return NextResponse.json(
        { success: false, error: '在庫数は0以上の数値を入力してください' },
        { status: 400 }
      )
    }
    
    // 現在の在庫情報を取得
    const { data: currentItem, error: fetchError } = await supabase
      .from('inventory_master')
      .select('id, physical_quantity, product_name, sku')
      .eq('id', body.inventory_master_id)
      .single()
    
    if (fetchError || !currentItem) {
      return NextResponse.json(
        { success: false, error: '商品が見つかりません' },
        { status: 404 }
      )
    }
    
    const now = new Date().toISOString()
    const countedBy = session.name
    
    // デバイス情報を取得
    const userAgent = request.headers.get('user-agent') || ''
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // 1. ログテーブルに記録
    const { error: logError } = await supabase
      .from('inventory_count_log')
      .insert({
        inventory_master_id: body.inventory_master_id,
        counted_quantity: body.counted_quantity,
        previous_quantity: currentItem.physical_quantity,
        location: body.location || null,
        images: body.images || [],
        notes: body.notes || null,
        counted_by: countedBy,
        counted_at: now,
        device_info: { userAgent },
        ip_address: ip
      })
    
    if (logError) {
      console.error('[InventoryCount] Log insert error:', logError)
      return NextResponse.json(
        { success: false, error: 'ログの記録に失敗しました' },
        { status: 500 }
      )
    }
    
    // 2. マスターテーブルを更新
    const { error: updateError } = await supabase
      .from('inventory_master')
      .update({
        physical_quantity: body.counted_quantity,
        storage_location: body.location || null,
        last_counted_at: now,
        counted_by: countedBy,
        inventory_images: body.images || []
      })
      .eq('id', body.inventory_master_id)
    
    if (updateError) {
      console.error('[InventoryCount] Master update error:', updateError)
      return NextResponse.json(
        { success: false, error: 'マスターの更新に失敗しました' },
        { status: 500 }
      )
    }
    
    // 差分情報
    const quantityDiff = body.counted_quantity - (currentItem.physical_quantity || 0)
    
    console.log(`[InventoryCount] 棚卸し完了: ${currentItem.sku} (${currentItem.product_name})`)
    console.log(`  担当者: ${countedBy}`)
    console.log(`  数量: ${currentItem.physical_quantity} → ${body.counted_quantity} (${quantityDiff >= 0 ? '+' : ''}${quantityDiff})`)
    console.log(`  場所: ${body.location || '未設定'}`)
    
    return NextResponse.json({
      success: true,
      message: '棚卸しを記録しました',
      data: {
        sku: currentItem.sku,
        product_name: currentItem.product_name,
        previous_quantity: currentItem.physical_quantity,
        new_quantity: body.counted_quantity,
        difference: quantityDiff,
        location: body.location,
        counted_by: countedBy,
        counted_at: now
      }
    })
    
  } catch (error: any) {
    console.error('[InventoryCount] Submit error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'サーバーエラー' },
      { status: 500 }
    )
  }
}
