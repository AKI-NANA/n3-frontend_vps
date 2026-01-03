// app/api/products/[id]/exclude-settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * 除外設定保存API
 * 競合商品の除外ワードと個別除外IDをlisting_dataに保存
 * + 除外後の価格統計を再計算してsm_lowest_price等に保存
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const productId = params.id
    const body = await request.json()

    const { excludeWords, excludedItemIds } = body

    console.log('💾 除外設定保存開始')
    console.log('  Product ID:', productId)
    console.log('  除外ワード:', excludeWords)
    console.log('  除外アイテム:', excludedItemIds?.length || 0, '件')

    // 現在の商品データを取得（listing_data + ebay_api_data）
    const { data: product, error: fetchError } = await supabase
      .from('products_master')
      .select('listing_data, ebay_api_data')
      .eq('id', productId)
      .single()

    if (fetchError) {
      console.error('❌ 商品取得エラー:', fetchError)
      return NextResponse.json(
        { success: false, error: fetchError.message },
        { status: 500 }
      )
    }

    const currentListingData = product?.listing_data || {}
    const ebayApiData = product?.ebay_api_data || {}
    const referenceItems = ebayApiData?.listing_reference?.referenceItems || []

    // ✅ 除外後の競合リストを計算
    const excludeWordsList = (excludeWords || '')
      .split(',')
      .map((w: string) => w.trim().toLowerCase())
      .filter((w: string) => w.length > 0)

    const excludedIdSet = new Set(excludedItemIds || [])

    const filteredItems = referenceItems.filter((item: any) => {
      // 個別除外チェック
      if (excludedIdSet.has(item.itemId)) return false
      
      // ワード除外チェック
      const title = (item.title || '').toLowerCase()
      for (const word of excludeWordsList) {
        if (title.includes(word)) return false
      }
      return true
    })

    // ✅ 除外後の価格統計を計算
    const prices = filteredItems
      .map((item: any) => parseFloat(item.price) || 0)
      .filter((price: number) => price > 0)

    const smLowestPrice = prices.length > 0 ? Math.min(...prices) : 0
    const smAveragePrice = prices.length > 0 
      ? prices.reduce((a: number, b: number) => a + b, 0) / prices.length 
      : 0
    const smHighestPrice = prices.length > 0 ? Math.max(...prices) : 0
    const smCompetitorCount = filteredItems.length

    console.log('  📊 除外後の価格統計:')
    console.log(`    - 対象: ${filteredItems.length}件 (除外: ${referenceItems.length - filteredItems.length}件)`)
    console.log(`    - 最安値: $${smLowestPrice.toFixed(2)}`)
    console.log(`    - 平均値: $${smAveragePrice.toFixed(2)}`)
    console.log(`    - 最高値: $${smHighestPrice.toFixed(2)}`)

    // listing_dataに除外設定を追加
    const updatedListingData = {
      ...currentListingData,
      exclude_words: excludeWords || '',
      excluded_item_ids: excludedItemIds || [],
    }

    // DBを更新（除外設定 + 価格統計）
    const { error: updateError } = await supabase
      .from('products_master')
      .update({
        listing_data: updatedListingData,
        // ✅ 価格統計も更新
        sm_lowest_price: smLowestPrice,
        sm_average_price: smAveragePrice,
        sm_highest_price: smHighestPrice,
        sm_competitor_count: smCompetitorCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)

    if (updateError) {
      console.error('❌ DB更新エラー:', updateError)
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      )
    }

    console.log('✅ 除外設定と価格統計を保存しました')

    return NextResponse.json({
      success: true,
      message: '除外設定を保存しました',
      stats: {
        total: referenceItems.length,
        filtered: filteredItems.length,
        excluded: referenceItems.length - filteredItems.length,
        lowest: smLowestPrice,
        average: smAveragePrice,
        highest: smHighestPrice,
      }
    })

  } catch (error: any) {
    console.error('❌ 除外設定保存エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message || '除外設定の保存に失敗しました' },
      { status: 500 }
    )
  }
}

/**
 * 除外設定取得API
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const productId = params.id

    const { data: product, error } = await supabase
      .from('products_master')
      .select('listing_data')
      .eq('id', productId)
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    const listingData = product?.listing_data || {}

    return NextResponse.json({
      success: true,
      data: {
        excludeWords: listingData.exclude_words || '',
        excludedItemIds: listingData.excluded_item_ids || [],
      }
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
