/**
 * 商品一括削除API
 * POST /api/products/bulk-delete
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: '削除するIDが必要です' },
        { status: 400 }
      )
    }

    console.log(`🗑️ 一括削除開始: ${ids.length}件`)

    const supabase = await createClient()
    
    // 削除前に確認（オプション）
    const { data: existingProducts, error: checkError } = await supabase
      .from('products_master')
      .select('id, sku, title')
      .in('id', ids)

    if (checkError) {
      console.error('❌ 商品確認エラー:', checkError)
      return NextResponse.json(
        { success: false, error: checkError.message },
        { status: 500 }
      )
    }

    const existingIds = existingProducts?.map(p => p.id) || []
    const notFoundIds = ids.filter(id => !existingIds.includes(id))

    if (notFoundIds.length > 0) {
      console.warn(`⚠️ 存在しないID: ${notFoundIds.join(', ')}`)
    }

    // 削除実行
    const { error: deleteError, count } = await supabase
      .from('products_master')
      .delete()
      .in('id', existingIds)

    if (deleteError) {
      console.error('❌ 削除エラー:', deleteError)
      return NextResponse.json(
        { success: false, error: deleteError.message },
        { status: 500 }
      )
    }

    console.log(`✅ 一括削除完了: ${existingIds.length}件`)

    return NextResponse.json({
      success: true,
      deleted: existingIds.length,
      notFound: notFoundIds.length > 0 ? notFoundIds : undefined,
    })

  } catch (error: any) {
    console.error('❌ 一括削除エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message || '一括削除に失敗しました' },
      { status: 500 }
    )
  }
}
