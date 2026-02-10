import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/inventory/deactivate
 * 在庫アイテムを非アクティブ化（論理削除）
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, reason } = body

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: '商品IDは必須です'
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 商品を非アクティブ化
    const { data, error } = await supabase
      .from('inventory_master')
      .update({
        is_inactive: true,
        inactive_at: new Date().toISOString(),
        inactive_reason: reason || '手動で非アクティブ化'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: '商品を非アクティブ化しました',
      product: data
    })
  } catch (error: any) {
    console.error('❌ 非アクティブ化エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '非アクティブ化に失敗しました'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/inventory/deactivate
 * 在庫アイテムを再アクティブ化
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: '商品IDは必須です'
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 商品を再アクティブ化
    const { data, error } = await supabase
      .from('inventory_master')
      .update({
        is_inactive: false,
        inactive_at: null,
        inactive_reason: null
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: '商品を再アクティブ化しました',
      product: data
    })
  } catch (error: any) {
    console.error('❌ 再アクティブ化エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '再アクティブ化に失敗しました'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/inventory/deactivate
 * 非アクティブな商品一覧を取得
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: inactiveProducts, error } = await supabase
      .from('inventory_master')
      .select('*')
      .eq('is_inactive', true)
      .order('inactive_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      products: inactiveProducts || [],
      count: inactiveProducts?.length || 0
    })
  } catch (error: any) {
    console.error('❌ 非アクティブ商品取得エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '非アクティブ商品の取得に失敗しました'
      },
      { status: 500 }
    )
  }
}
