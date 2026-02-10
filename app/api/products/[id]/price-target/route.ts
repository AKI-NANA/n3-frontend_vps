// app/api/products/[id]/price-target/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { itemId, title, price, condition, seller } = await request.json()
    
    console.log('💰 価格ターゲット保存開始:', {
      productId: params.id,
      itemId,
      price,
      condition,
    })
    
    const supabase = await createClient()
    
    const targetData = {
      itemId,
      title,
      price,
      condition,
      seller,
      selectedAt: new Date().toISOString(),
    }
    
    const { data, error } = await supabase
      .from('products_master')
      .update({ 
        price_target: targetData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
    
    if (error) {
      console.error('❌ 価格ターゲット保存エラー:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    console.log('✅ 価格ターゲット保存成功:', targetData)
    
    return NextResponse.json({
      success: true,
      data: targetData,
    })
    
  } catch (error: any) {
    console.error('❌ 価格ターゲット保存処理エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('products_master')
      .select('price_target')
      .eq('id', params.id)
      .single()
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: data?.price_target || null,
    })
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('products_master')
      .update({ 
        price_target: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
    })
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
