/**
 * 商品承認API
 * POST /api/products/approve
 * 
 * 選択された商品を承認状態に更新
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productIds, action = 'approve' } = body

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '承認する商品IDが必要です' },
        { status: 400 }
      )
    }

    console.log(`✅ 商品${action}: ${productIds.length}件`)

    const supabase = await createClient()
    const now = new Date().toISOString()

    // 承認/却下データを設定
    // products_master テーブルには以下のカラムがある:
    // - workflow_status: varchar
    // - approval_status: varchar  
    // - approved_at, approved_by, rejected_at, rejected_by, rejection_reason
    const updateData = action === 'approve'
      ? {
          workflow_status: 'approved',
          approval_status: 'approved',
          approved_at: now,
          updated_at: now,
        }
      : {
          workflow_status: 'rejected',
          approval_status: 'rejected',
          rejected_at: now,
          updated_at: now,
        }

    // 一括更新
    const { data, error } = await supabase
      .from('products_master')
      .update(updateData)
      .in('id', productIds)
      .select('id, sku, workflow_status, approval_status')

    if (error) {
      console.error('❌ 承認更新エラー:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ ${action}完了: ${data?.length || 0}件`)

    return NextResponse.json({
      success: true,
      action,
      updated: data?.length || 0,
      products: data,
    })

  } catch (error: any) {
    console.error('❌ 承認APIエラー:', error)
    return NextResponse.json(
      { success: false, error: error.message || '承認に失敗しました' },
      { status: 500 }
    )
  }
}
