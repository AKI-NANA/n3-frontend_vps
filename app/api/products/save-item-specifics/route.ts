// app/api/products/save-item-specifics/route.ts
/**
 * Item Specifics を products_master に保存
 * 
 * 保存先:
 * - english_title / title_en: 英語タイトル
 * - listing_data.item_specifics: Item Specifics（JSONB）
 * - brand: ブランド（個別カラム）
 * - origin_country / origin_country_name: 原産国
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface SaveRequest {
  productId: number
  english_title: string
  item_specifics: Record<string, string>
  missing_required: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: SaveRequest = await request.json()
    const { productId, english_title, item_specifics, missing_required } = body

    console.log('📝 Item Specifics 保存開始')
    console.log('  productId:', productId)
    console.log('  english_title:', english_title?.slice(0, 50))
    console.log('  item_specifics count:', Object.keys(item_specifics).length)
    console.log('  missing_required:', missing_required)

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId は必須です' },
        { status: 400 }
      )
    }

    // 現在の商品データを取得
    const { data: product, error: fetchError } = await supabase
      .from('products_master')
      .select('listing_data')
      .eq('id', productId)
      .single()

    if (fetchError) {
      console.error('❌ 商品取得エラー:', fetchError)
      return NextResponse.json(
        { success: false, error: '商品が見つかりません' },
        { status: 404 }
      )
    }

    // 更新データを構築
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    // 英語タイトル（両方のカラムに保存）
    if (english_title) {
      updates.english_title = english_title
      updates.title_en = english_title
    }

    // Item Specificsから主要フィールドを抽出
    const brand = item_specifics['Brand'] || item_specifics['ブランド']
    if (brand) {
      updates.brand = brand
    }

    const originCountry = item_specifics['Country/Region of Manufacture'] || 
                          item_specifics['Country of Manufacture']
    if (originCountry) {
      updates.origin_country_name = originCountry
      updates.origin_country = getCountryCode(originCountry)
    }

    const mpn = item_specifics['MPN'] || item_specifics['Model']
    // MPNは別カラムがあれば保存

    // listing_data を更新
    const existingListingData = product?.listing_data || {}
    const updatedListingData = {
      ...existingListingData,
      item_specifics: item_specifics,
      item_specifics_updated_at: new Date().toISOString(),
      missing_required_fields: missing_required,
      is_complete: missing_required.length === 0
    }
    updates.listing_data = updatedListingData

    // DB更新
    const { error: updateError } = await supabase
      .from('products_master')
      .update(updates)
      .eq('id', productId)

    if (updateError) {
      console.error('❌ DB更新エラー:', updateError)
      return NextResponse.json(
        { success: false, error: 'DB更新に失敗しました', details: updateError.message },
        { status: 500 }
      )
    }

    console.log('✅ Item Specifics 保存完了')

    return NextResponse.json({
      success: true,
      productId,
      saved: {
        english_title: !!english_title,
        brand: !!brand,
        origin_country: !!originCountry,
        item_specifics_count: Object.keys(item_specifics).length
      },
      missing_required,
      is_complete: missing_required.length === 0
    })

  } catch (error: any) {
    console.error('❌ Item Specifics 保存エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * 国名を国コードに変換
 */
function getCountryCode(countryName: string): string {
  const countryMap: Record<string, string> = {
    'Japan': 'JP',
    'China': 'CN',
    'Taiwan': 'TW',
    'Korea': 'KR',
    'South Korea': 'KR',
    'United States': 'US',
    'USA': 'US',
    'United Kingdom': 'GB',
    'UK': 'GB',
    'Germany': 'DE',
    'France': 'FR',
    'Italy': 'IT',
    'Hong Kong': 'HK',
    '日本': 'JP',
    '中国': 'CN',
    '台湾': 'TW',
    '韓国': 'KR',
  }

  if (countryMap[countryName]) {
    return countryMap[countryName]
  }

  const upperName = countryName.toUpperCase()
  for (const [name, code] of Object.entries(countryMap)) {
    if (upperName.includes(name.toUpperCase())) {
      return code
    }
  }

  return countryName.length === 2 ? countryName.toUpperCase() : countryName.slice(0, 2).toUpperCase()
}
