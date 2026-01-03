// app/api/products/save-competitor-data/route.ts
/**
 * 競合商品データを対象商品に保存するAPI
 * 
 * SM詳細取得で取得したデータを直接DBに保存
 * - Item Specifics（ブランド、モデル、材質等）
 * - 重量・寸法
 * - 原産国
 * - カテゴリ情報
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface CompetitorData {
  itemId: string
  title: string
  itemSpecifics: Record<string, string>
  weight?: number // grams
  dimensions?: {
    length: number
    width: number
    height: number
  }
  categoryId?: string
  categoryName?: string
  brand?: string
  model?: string
  countryOfManufacture?: string
  price?: number
  currency?: string
}

interface SaveRequest {
  productId: number
  competitorData: CompetitorData
  /** 上書きするか、未設定のフィールドのみ埋めるか */
  overwrite?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const { productId, competitorData, overwrite = false }: SaveRequest = await request.json()

    console.log('📦 競合データ保存開始')
    console.log('  productId:', productId)
    console.log('  competitor itemId:', competitorData.itemId)
    console.log('  overwrite:', overwrite)

    // 現在の商品データを取得
    const { data: product, error: fetchError } = await supabase
      .from('products_master')
      .select('*')
      .eq('id', productId)
      .single()

    if (fetchError || !product) {
      return NextResponse.json({
        success: false,
        error: '商品が見つかりません',
        productId
      }, { status: 404 })
    }

    // 更新データを構築
    const updates: Record<string, any> = {}
    const existingListingData = product.listing_data || {}

    // Item Specificsから主要データを抽出
    const specs = competitorData.itemSpecifics || {}
    
    // ブランド
    const brand = specs['Brand'] || specs['ブランド'] || competitorData.brand
    if (brand && (overwrite || !product.brand)) {
      updates.brand = brand
    }

    // 原産国
    const origin = specs['Country/Region of Manufacture'] || 
                   specs['Country of Manufacture'] || 
                   specs['製造国'] ||
                   competitorData.countryOfManufacture
    if (origin) {
      // 国名を国コードに変換
      const countryCode = getCountryCode(origin)
      if (overwrite || !product.origin_country) {
        updates.origin_country = countryCode
        updates.origin_country_name = origin
      }
    }

    // 重量
    if (competitorData.weight && (overwrite || !existingListingData.weight_g)) {
      existingListingData.weight_g = competitorData.weight
    }

    // 寸法
    if (competitorData.dimensions) {
      if (overwrite || !existingListingData.length_cm) {
        existingListingData.length_cm = competitorData.dimensions.length
      }
      if (overwrite || !existingListingData.width_cm) {
        existingListingData.width_cm = competitorData.dimensions.width
      }
      if (overwrite || !existingListingData.height_cm) {
        existingListingData.height_cm = competitorData.dimensions.height
      }
    }

    // カテゴリ情報
    if (competitorData.categoryId && (overwrite || !product.ebay_category_id)) {
      updates.ebay_category_id = competitorData.categoryId
    }
    if (competitorData.categoryName && (overwrite || !product.category_name)) {
      updates.category_name = competitorData.categoryName
    }

    // 競合参照価格
    if (competitorData.price) {
      existingListingData.competitor_price = competitorData.price
      existingListingData.competitor_currency = competitorData.currency || 'USD'
      existingListingData.competitor_item_id = competitorData.itemId
    }

    // 全Item Specificsを保存（参照用）
    existingListingData.competitor_item_specifics = specs
    existingListingData.competitor_data_fetched_at = new Date().toISOString()

    // sm_selected_itemに選択した競合情報を保存
    updates.sm_selected_item = {
      itemId: competitorData.itemId,
      title: competitorData.title,
      price: competitorData.price,
      currency: competitorData.currency,
      brand,
      origin,
      weight: competitorData.weight,
      dimensions: competitorData.dimensions,
      itemSpecifics: specs,
      selectedAt: new Date().toISOString()
    }

    // listing_data更新
    updates.listing_data = existingListingData
    updates.updated_at = new Date().toISOString()

    // DB更新
    const { error: updateError } = await supabase
      .from('products_master')
      .update(updates)
      .eq('id', productId)

    if (updateError) {
      console.error('❌ DB更新エラー:', updateError)
      return NextResponse.json({
        success: false,
        error: 'DB更新に失敗しました',
        details: updateError.message
      }, { status: 500 })
    }

    console.log('✅ 競合データ保存完了')
    console.log('  保存項目:', Object.keys(updates))

    return NextResponse.json({
      success: true,
      productId,
      savedFields: Object.keys(updates),
      competitorItemId: competitorData.itemId,
      extracted: {
        brand,
        origin,
        weight: competitorData.weight,
        dimensions: competitorData.dimensions,
        categoryId: competitorData.categoryId
      }
    })

  } catch (error: any) {
    console.error('❌ 競合データ保存エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

/**
 * 国名を国コードに変換
 */
function getCountryCode(countryName: string): string {
  const countryMap: Record<string, string> = {
    // 英語
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
    'Spain': 'ES',
    'Canada': 'CA',
    'Australia': 'AU',
    'Hong Kong': 'HK',
    'Singapore': 'SG',
    'Thailand': 'TH',
    'Vietnam': 'VN',
    'Indonesia': 'ID',
    'Malaysia': 'MY',
    'Philippines': 'PH',
    'India': 'IN',
    'Mexico': 'MX',
    'Brazil': 'BR',
    // 日本語
    '日本': 'JP',
    '中国': 'CN',
    '台湾': 'TW',
    '韓国': 'KR',
    'アメリカ': 'US',
    'イギリス': 'GB',
    'ドイツ': 'DE',
    'フランス': 'FR',
  }

  // 完全一致
  if (countryMap[countryName]) {
    return countryMap[countryName]
  }

  // 部分一致
  const upperName = countryName.toUpperCase()
  for (const [name, code] of Object.entries(countryMap)) {
    if (upperName.includes(name.toUpperCase())) {
      return code
    }
  }

  // 見つからない場合は元の値を返す（2文字なら国コードとみなす）
  if (countryName.length === 2) {
    return countryName.toUpperCase()
  }

  return countryName.slice(0, 2).toUpperCase()
}
