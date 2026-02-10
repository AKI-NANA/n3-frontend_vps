/**
 * SKU更新API
 * 
 * 商品のSKUを更新する
 * - eBay出品時の「重複エラー」回避に使用
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, newSku } = body

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productIdは必須です' },
        { status: 400 }
      )
    }

    if (!newSku) {
      return NextResponse.json(
        { success: false, error: 'newSkuは必須です' },
        { status: 400 }
      )
    }

    // SKUバリデーション
    if (!/^[A-Za-z0-9_-]+$/.test(newSku)) {
      return NextResponse.json(
        { success: false, error: 'SKUは英数字、ハイフン(-)、アンダースコア(_)のみ使用可能です' },
        { status: 400 }
      )
    }

    if (newSku.length > 50) {
      return NextResponse.json(
        { success: false, error: 'SKUは50文字以内にしてください' },
        { status: 400 }
      )
    }

    console.log(`\n========================================`)
    console.log(`🔄 SKU更新`)
    console.log(`  productId: ${productId}`)
    console.log(`  newSku: ${newSku}`)
    console.log(`========================================`)

    // 重複チェック
    const { data: existing, error: checkError } = await supabase
      .from('products_master')
      .select('id, sku')
      .eq('sku', newSku)
      .neq('id', productId)
      .limit(1)

    if (checkError) {
      console.error('❌ 重複チェックエラー:', checkError)
      return NextResponse.json(
        { success: false, error: '重複チェックに失敗しました' },
        { status: 500 }
      )
    }

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { success: false, error: `SKU「${newSku}」は既に使用されています（商品ID: ${existing[0].id}）` },
        { status: 400 }
      )
    }

    // 現在の商品を取得
    const { data: product, error: fetchError } = await supabase
      .from('products_master')
      .select('id, sku')
      .eq('id', productId)
      .single()

    if (fetchError || !product) {
      console.error('❌ 商品取得エラー:', fetchError)
      return NextResponse.json(
        { success: false, error: '商品が見つかりません' },
        { status: 404 }
      )
    }

    const oldSku = product.sku

    // SKU更新
    const { error: updateError } = await supabase
      .from('products_master')
      .update({
        sku: newSku,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)

    if (updateError) {
      console.error('❌ SKU更新エラー:', updateError)
      return NextResponse.json(
        { success: false, error: 'SKUの更新に失敗しました' },
        { status: 500 }
      )
    }

    console.log(`✅ SKU更新成功: ${oldSku} → ${newSku}`)

    return NextResponse.json({
      success: true,
      message: `SKUを「${oldSku}」から「${newSku}」に更新しました`,
      productId: productId,
      oldSku: oldSku,
      newSku: newSku
    })

  } catch (error: any) {
    console.error('❌ SKU更新エラー:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'SKU更新に失敗しました'
      },
      { status: 500 }
    )
  }
}
