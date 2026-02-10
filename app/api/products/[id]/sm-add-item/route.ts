// app/api/products/[id]/sm-add-item/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * SM手動追加アイテムをDBに保存
 * ebay_api_data.listing_reference.referenceItemsに追加
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { item } = body

    console.log('📝 [SM Add Item] 開始:', id)
    console.log('  追加アイテム:', item?.title?.substring(0, 50))

    if (!item || !item.itemId) {
      return NextResponse.json(
        { success: false, error: 'アイテム情報が必要です' },
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
      console.error('❌ [SM Add Item] 取得エラー:', fetchError)
      return NextResponse.json(
        { success: false, error: '商品取得に失敗しました' },
        { status: 500 }
      )
    }

    const existingData = product?.ebay_api_data || {}
    const existingListingRef = existingData.listing_reference || {}
    const existingItems = existingListingRef.referenceItems || []

    // 重複チェック
    if (existingItems.some((i: any) => i.itemId === item.itemId)) {
      return NextResponse.json({
        success: true,
        message: 'アイテムは既に登録されています',
        duplicate: true
      })
    }

    // 新しいアイテムを追加
    const updatedItems = [...existingItems, {
      ...item,
      addedAt: new Date().toISOString(),
      isManual: true
    }]

    // ✅ 価格統計を再計算
    const allPrices = updatedItems
      .map((i: any) => parseFloat(i.price) || 0)
      .filter((price: number) => price > 0)
    
    const smLowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0
    const smAveragePrice = allPrices.length > 0 
      ? allPrices.reduce((a: number, b: number) => a + b, 0) / allPrices.length 
      : 0
    const smHighestPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0
    const smCompetitorCount = updatedItems.length

    console.log('📊 [価格統計更新]', {
      lowest: smLowestPrice,
      average: smAveragePrice,
      highest: smHighestPrice,
      count: smCompetitorCount
    })

    // 更新
    const { error: updateError } = await supabase
      .from('products_master')
      .update({
        ebay_api_data: {
          ...existingData,
          listing_reference: {
            ...existingListingRef,
            referenceItems: updatedItems
          }
        },
        // ✅ 価格統計カラムも更新
        sm_lowest_price: smLowestPrice,
        sm_average_price: smAveragePrice,
        sm_highest_price: smHighestPrice,
        sm_competitor_count: smCompetitorCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) {
      console.error('❌ [SM Add Item] 更新エラー:', updateError)
      return NextResponse.json(
        { success: false, error: '保存に失敗しました' },
        { status: 500 }
      )
    }

    console.log('✅ [SM Add Item] 完了:', item.itemId)

    return NextResponse.json({
      success: true,
      message: 'アイテムを追加しました',
      totalItems: updatedItems.length
    })

  } catch (error: any) {
    console.error('❌ [SM Add Item] 例外:', error)
    return NextResponse.json(
      { success: false, error: error.message || '保存に失敗しました' },
      { status: 500 }
    )
  }
}
