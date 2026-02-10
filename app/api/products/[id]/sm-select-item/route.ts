// app/api/products/[id]/sm-select-item/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * SM選択アイテムをDBに保存
 * ebay_api_data.sm_selected_itemに保存
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { itemId, title, price, image, seller, condition, itemSpecifics } = body

    console.log('🎯 [SM Select Item] 開始:', id)
    console.log('  選択アイテム:', itemId)

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'アイテムIDが必要です' },
        { status: 400 }
      )
    }

    // 現在のデータを取得
    const { data: product, error: fetchError } = await supabase
      .from('products_master')
      .select('ebay_api_data')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('❌ [SM Select Item] 取得エラー:', fetchError)
      return NextResponse.json(
        { success: false, error: '商品取得に失敗しました' },
        { status: 500 }
      )
    }

    const existingData = product?.ebay_api_data || {}

    // 選択アイテムを保存
    const selectedItem = {
      itemId,
      title,
      price,
      image,
      seller,
      condition,
      itemSpecifics,
      selectedAt: new Date().toISOString()
    }

    // 更新
    const { error: updateError } = await supabase
      .from('products_master')
      .update({
        ebay_api_data: {
          ...existingData,
          sm_selected_item: selectedItem
        },
        sm_reference_item_id: itemId,  // 既存カラムにも保存
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) {
      console.error('❌ [SM Select Item] 更新エラー:', updateError)
      return NextResponse.json(
        { success: false, error: '保存に失敗しました' },
        { status: 500 }
      )
    }

    console.log('✅ [SM Select Item] 完了:', itemId)

    return NextResponse.json({
      success: true,
      message: 'SM選択を保存しました',
      selectedItem
    })

  } catch (error: any) {
    console.error('❌ [SM Select Item] 例外:', error)
    return NextResponse.json(
      { success: false, error: error.message || '保存に失敗しました' },
      { status: 500 }
    )
  }
}
