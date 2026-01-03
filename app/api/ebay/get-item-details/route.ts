// app/api/ebay/get-item-details/route.ts
/**
 * eBay 商品詳細取得API
 * 
 * Browse API の getItem エンドポイントを使用して
 * 選択した競合商品の詳細情報（Item Specifics等）を取得
 */
import { NextRequest, NextResponse } from 'next/server'

const EBAY_BROWSE_API = 'https://api.ebay.com/buy/browse/v1/item'
const EBAY_TOKEN_API = 'https://api.ebay.com/identity/v1/oauth2/token'

// アクセストークンのキャッシュ
let cachedToken: {
  accessToken: string
  expiresAt: number
} | null = null

/**
 * OAuth 2.0 トークン取得（Client Credentials Flow）
 */
async function getAccessToken(): Promise<string> {
  // キャッシュが有効な場合は再利用
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cachedToken.accessToken
  }

  const clientId = process.env.EBAY_CLIENT_ID
  const clientSecret = process.env.EBAY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('EBAY_CLIENT_ID または EBAY_CLIENT_SECRET が設定されていません')
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(EBAY_TOKEN_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'https://api.ebay.com/oauth/api_scope'
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`トークン取得失敗: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000
  }

  return data.access_token
}

/**
 * eBay Item ID を正規化
 * v1|123456789|0 形式の場合、123456789 部分を抽出
 */
function normalizeItemId(itemId: string): string {
  if (itemId.startsWith('v1|')) {
    const parts = itemId.split('|')
    return parts[1] || itemId
  }
  return itemId
}

/**
 * Browse API getItem エンドポイントで詳細取得
 */
async function getItemDetails(accessToken: string, itemId: string) {
  // URLエンコード（itemIdにパイプが含まれる可能性）
  const encodedItemId = encodeURIComponent(itemId)
  const apiUrl = `${EBAY_BROWSE_API}/${encodedItemId}`

  console.log('📡 Browse API getItem:', apiUrl)

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ Browse API getItem Error:', errorText)
    throw new Error(`Browse API Error: ${response.status}`)
  }

  return await response.json()
}

/**
 * Item Specifics を整形
 */
function parseItemSpecifics(localizedAspects: any[]): Record<string, string> {
  const specifics: Record<string, string> = {}
  
  if (!localizedAspects || !Array.isArray(localizedAspects)) {
    return specifics
  }

  for (const aspect of localizedAspects) {
    if (aspect.name && aspect.value) {
      // 値が配列の場合はカンマ区切りに
      const value = Array.isArray(aspect.value) 
        ? aspect.value.join(', ') 
        : String(aspect.value)
      specifics[aspect.name] = value
    }
  }

  return specifics
}

/**
 * 重量を抽出（グラムに変換）
 */
function extractWeight(item: any): number | undefined {
  // itemSpecifics から Weight を探す
  const weightSpec = item.localizedAspects?.find(
    (a: any) => a.name?.toLowerCase().includes('weight')
  )
  
  if (weightSpec?.value) {
    const value = Array.isArray(weightSpec.value) ? weightSpec.value[0] : weightSpec.value
    const match = String(value).match(/[\d.]+/)
    if (match) {
      let weight = parseFloat(match[0])
      // ポンドの場合はグラムに変換
      if (String(value).toLowerCase().includes('lb') || String(value).toLowerCase().includes('pound')) {
        weight = weight * 453.592
      }
      // オンスの場合はグラムに変換
      if (String(value).toLowerCase().includes('oz') || String(value).toLowerCase().includes('ounce')) {
        weight = weight * 28.3495
      }
      return Math.round(weight)
    }
  }

  // shippingOptions から推定
  if (item.shippingOptions?.[0]?.shippingCost?.value) {
    // 送料から重量を推定（簡易）
    const shippingCost = parseFloat(item.shippingOptions[0].shippingCost.value)
    if (shippingCost < 5) return 100
    if (shippingCost < 10) return 300
    if (shippingCost < 15) return 500
    if (shippingCost < 20) return 1000
    return 2000
  }

  return undefined
}

/**
 * 寸法を抽出（cmに変換）
 */
function extractDimensions(item: any): { length: number; width: number; height: number } | undefined {
  const dimensionNames = ['dimensions', 'size', 'item length', 'item width', 'item height']
  
  let length: number | undefined
  let width: number | undefined
  let height: number | undefined

  for (const aspect of item.localizedAspects || []) {
    const name = aspect.name?.toLowerCase() || ''
    const value = Array.isArray(aspect.value) ? aspect.value[0] : aspect.value
    
    if (!value) continue

    const match = String(value).match(/[\d.]+/)
    if (!match) continue

    let num = parseFloat(match[0])
    
    // インチの場合はcmに変換
    if (String(value).toLowerCase().includes('in') || String(value).toLowerCase().includes('inch')) {
      num = num * 2.54
    }

    if (name.includes('length')) {
      length = Math.round(num * 10) / 10
    } else if (name.includes('width')) {
      width = Math.round(num * 10) / 10
    } else if (name.includes('height') || name.includes('depth')) {
      height = Math.round(num * 10) / 10
    }
  }

  if (length && width && height) {
    return { length, width, height }
  }

  return undefined
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId } = body

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'itemId は必須です' },
        { status: 400 }
      )
    }

    console.log('🔍 商品詳細取得:', itemId)

    // 1. アクセストークン取得
    const accessToken = await getAccessToken()

    // 2. 詳細取得
    const item = await getItemDetails(accessToken, itemId)

    // 3. データ整形
    const itemSpecifics = parseItemSpecifics(item.localizedAspects)
    const weight = extractWeight(item)
    const dimensions = extractDimensions(item)

    // 4. カテゴリ情報
    const categoryId = item.categoryId || item.categoryPath?.split('|').pop()
    const categoryName = item.categoryPath?.split('|').pop() || ''

    // 5. 結果を構築
    const itemDetails = {
      itemId: item.itemId || itemId,
      title: item.title,
      itemSpecifics,
      weight,
      dimensions,
      shippingOptions: item.shippingOptions || [],
      categoryId,
      categoryName,
      // 追加情報
      condition: item.condition,
      conditionId: item.conditionId,
      brand: itemSpecifics['Brand'] || itemSpecifics['ブランド'],
      model: itemSpecifics['Model'] || itemSpecifics['MPN'],
      color: itemSpecifics['Color'] || itemSpecifics['カラー'],
      material: itemSpecifics['Material'] || itemSpecifics['素材'],
      countryOfManufacture: itemSpecifics['Country/Region of Manufacture'] || itemSpecifics['Country of Manufacture'],
      // 生データ
      rawLocalizedAspects: item.localizedAspects,
      image: item.image?.imageUrl,
      price: item.price,
      seller: item.seller
    }

    console.log('✅ 詳細取得成功:', {
      itemId: itemDetails.itemId,
      title: itemDetails.title?.slice(0, 50),
      specsCount: Object.keys(itemSpecifics).length,
      weight,
      dimensions
    })

    return NextResponse.json({
      success: true,
      itemDetails
    })

  } catch (error: any) {
    console.error('❌ 詳細取得エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
