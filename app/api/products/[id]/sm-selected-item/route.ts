// app/api/products/[id]/sm-selected-item/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * SM選択商品保存API
 * SellerMirror分析で選択された競合商品をproducts_masterに保存
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const productId = params.id
    const body = await request.json()

    console.log('💾 SM選択商品保存開始')
    console.log('  Product ID:', productId)
    console.log('  Selected Item:', body)

    const { itemId, title, price, image, seller, condition } = body

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'itemIdが必要です' },
        { status: 400 }
      )
    }

    // products_masterを更新（sm_selected_itemカラムに保存）
    const { data, error } = await supabase
      .from('products_master')
      .update({
        sm_selected_item: {
          itemId,
          title,
          price,
          image,
          seller,
          condition,
          selectedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select()
      .single()

    if (error) {
      console.error('❌ DB更新エラー:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log('✅ SM選択商品を保存しました')

    return NextResponse.json({
      success: true,
      data,
      message: 'SM選択商品を保存しました'
    })

  } catch (error: any) {
    console.error('❌ SM選択商品保存エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'SM選択商品の保存に失敗しました' },
      { status: 500 }
    )
  }
}

/**
 * SM選択商品取得API
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const productId = params.id

    const { data, error } = await supabase
      .from('products_master')
      .select('sm_selected_item')
      .eq('id', productId)
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data?.sm_selected_item || null
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * SM選択商品削除API
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const productId = params.id

    const { error } = await supabase
      .from('products_master')
      .update({
        sm_selected_item: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'SM選択商品を削除しました'
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
