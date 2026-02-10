// app/api/ebay/get-item-details/route.ts
/**
 * eBay 商品詳細取得API
 * 
 * 🔥 v2.1: アカウント別トークン対応（green, mjt等）
 * 
 * Browse API の getItem エンドポイントを使用して
 * 選択した競合商品の詳細情報（Item Specifics等）を取得
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { GetItemDetailsResponse } from '@/types/hybrid-ai-pipeline'

const EBAY_BROWSE_API = 'https://api.ebay.com/buy/browse/v1/item'
const EBAY_TOKEN_API = 'https://api.ebay.com/identity/v1/oauth2/token'

// Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// アカウント別クレデンシャル
interface AccountCredentials {
  clientId: string
  clientSecret: string
}

function getAccountCredentials(account: string): AccountCredentials {
  const accountUpper = account.toUpperCase()
  
  // 🔥 アカウント別の環境変数を取得
  const clientId = process.env[`EBAY_CLIENT_ID_${accountUpper}`] || process.env.EBAY_CLIENT_ID || ''
  const clientSecret = process.env[`EBAY_CLIENT_SECRET_${accountUpper}`] || process.env.EBAY_CLIENT_SECRET || ''
  
  console.log(`  🔑 アカウント: ${account} → CLIENT_ID: ${clientId?.substring(0, 15)}...`)
  
  return { clientId, clientSecret }
}

// アカウント別トークンキャッシュ
const tokenCache = new Map<string, { accessToken: string; expiresAt: number }>()

/**
 * 🔥 アカウント別アクセストークン取得
 */
async function getAccessToken(account: string = 'green'): Promise<string> {
  const cacheKey = account.toLowerCase()
  
  // キャッシュチェック
  const cached = tokenCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now() + 5 * 60 * 1000) {
    console.log(`  ✅ キャッシュトークン使用: ${account}`)
    return cached.accessToken
  }
  
  // 🔥 まずDBからトークンを取得
  const { data: tokenData, error: tokenError } = await supabase
    .from('ebay_tokens')
    .select('access_token, expires_at')
    .eq('account', cacheKey)
    .single()
  
  if (!tokenError && tokenData) {
    const expiresAt = new Date(tokenData.expires_at).getTime()
    
    // DBのトークンが有効な場合
    if (expiresAt > Date.now() + 5 * 60 * 1000) {
      console.log(`  ✅ DBトークン使用: ${account}`)
      tokenCache.set(cacheKey, {
        accessToken: tokenData.access_token,
        expiresAt
      })
      return tokenData.access_token
    }
  }
  
  // 🔥 DBにトークンがないか期限切れの場合、新規取得
  console.log(`  🔑 新規トークン取得: ${account}`)
  
  const { clientId, clientSecret } = getAccountCredentials(account)
  
  if (!clientId || !clientSecret) {
    throw new Error(`${account}アカウントのeBayクレデンシャルが設定されていません`)
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
    console.error(`  ❌ トークン取得エラー (${account}):`, errorText)
    throw new Error(`トークン取得失敗 (${account}): ${response.status}`)
  }

  const data = await response.json()
  
  // キャッシュに保存
  tokenCache.set(cacheKey, {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000
  })

  console.log(`  ✅ 新規トークン取得成功: ${account}`)
  return data.access_token
}

/**
 * eBay Item ID を正規化
 */
function normalizeItemId(itemId: string): string {
  if (itemId.startsWith('v1|')) {
    const parts = itemId.split('|')
    return parts[1] || itemId
  }
  return itemId
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
  const weightSpec = item.localizedAspects?.find(
    (a: any) => a.name?.toLowerCase().includes('weight')
  )
  
  if (weightSpec?.value) {
    const value = Array.isArray(weightSpec.value) ? weightSpec.value[0] : weightSpec.value
    const match = String(value).match(/[\d.]+/)
    if (match) {
      let weight = parseFloat(match[0])
      if (String(value).toLowerCase().includes('lb') || String(value).toLowerCase().includes('pound')) {
        weight = weight * 453.592
      }
      if (String(value).toLowerCase().includes('oz') || String(value).toLowerCase().includes('ounce')) {
        weight = weight * 28.3495
      }
      return Math.round(weight)
    }
  }

  if (item.shippingOptions?.[0]?.shippingCost?.value) {
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

/**
 * 原産国を抽出
 */
function extractOriginCountry(itemSpecifics: Record<string, string>): string | null {
  const originFields = [
    'Country/Region of Manufacture',
    'Country of Manufacture',
    'Country of Origin',
    'Made In',
    'Origin',
    'Country',
    '製造国',
    '原産国',
  ]
  
  for (const field of originFields) {
    if (itemSpecifics[field]) {
      return itemSpecifics[field]
    }
  }
  
  return null
}

/**
 * conditionDescriptors を抽出
 */
function extractConditionDescriptors(item: any): any[] | undefined {
  if (item.conditionDescriptors && Array.isArray(item.conditionDescriptors)) {
    return item.conditionDescriptors.map((desc: any) => ({
      name: desc.name,
      values: Array.isArray(desc.values) ? desc.values : [desc.values],
    }))
  }
  return undefined
}

/**
 * 共通のレスポンス構築ロジック
 */
function buildItemDetailsResponse(item: any, itemId: string): any {
  const itemSpecifics = parseItemSpecifics(item.localizedAspects)
  const weight = extractWeight(item)
  const dimensions = extractDimensions(item)
  const categoryId = item.categoryId || item.categoryPath?.split('|').pop()
  const categoryPath = item.categoryPath
  const originCountry = extractOriginCountry(itemSpecifics)
  const conditionDescriptors = extractConditionDescriptors(item)
  
  const priceInfo = {
    value: parseFloat(item.price?.value || '0'),
    currency: item.price?.currency || 'USD',
  }

  return {
    success: true,
    itemId: item.itemId || itemId,
    title: item.title,
    categoryId,
    categoryPath,
    condition: item.condition,
    conditionDescription: item.conditionDescription,
    conditionDescriptors,
    itemSpecifics,
    originCountry,
    price: priceInfo,
    seller: item.seller ? {
      username: item.seller.username,
      feedbackScore: item.seller.feedbackScore,
      feedbackPercentage: item.seller.feedbackPercentage,
    } : undefined,
    image: item.image,
    itemLocation: item.itemLocation ? {
      country: item.itemLocation.country,
      city: item.itemLocation.city,
      postalCode: item.itemLocation.postalCode,
    } : undefined,
    weight,
    dimensions,
    shippingOptions: item.shippingOptions || [],
    brand: itemSpecifics['Brand'] || itemSpecifics['ブランド'],
    model: itemSpecifics['Model'] || itemSpecifics['MPN'],
    color: itemSpecifics['Color'] || itemSpecifics['カラー'],
    material: itemSpecifics['Material'] || itemSpecifics['素材'],
    rawLocalizedAspects: item.localizedAspects,
  }
}

/**
 * GETメソッド: クエリパラメータでitemIdを受け取る
 * 🔥 account パラメータ追加
 */
export async function GET(request: NextRequest) {
  try {
    const itemId = request.nextUrl.searchParams.get('itemId')
    const marketplaceId = request.nextUrl.searchParams.get('marketplaceId') || 'EBAY_US'
    const account = request.nextUrl.searchParams.get('account') || 'green'  // 🔥 デフォルトgreen

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'itemId クエリパラメータは必須です' },
        { status: 400 }
      )
    }

    console.log('🔍 [GET] 商品詳細取得:', itemId, 'account:', account, 'marketplace:', marketplaceId)

    // 1. 🔥 アカウント別アクセストークン取得
    const accessToken = await getAccessToken(account)

    // 2. 詳細取得
    const encodedItemId = encodeURIComponent(itemId)
    const apiUrl = `${EBAY_BROWSE_API}/${encodedItemId}`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-EBAY-C-MARKETPLACE-ID': marketplaceId,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Browse API getItem Error:', errorText)
      return NextResponse.json(
        { success: false, error: `Browse API Error: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    const item = await response.json()
    const result = buildItemDetailsResponse(item, itemId)

    console.log('✅ [GET] 詳細取得成功:', {
      itemId: result.itemId,
      title: result.title?.slice(0, 50),
      specsCount: Object.keys(result.itemSpecifics || {}).length,
      originCountry: result.originCountry,
      price: result.price,
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('❌ [GET] 詳細取得エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * POSTメソッド: リクエストボディでitemIdを受け取る
 * 🔥 account パラメータ追加
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId, marketplaceId = 'EBAY_US', account = 'green' } = body  // 🔥 デフォルトgreen

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'itemId は必須です' },
        { status: 400 }
      )
    }

    console.log('🔍 [POST] 商品詳細取得:', itemId, 'account:', account)

    // 1. 🔥 アカウント別アクセストークン取得
    const accessToken = await getAccessToken(account)

    // 2. 詳細取得
    const encodedItemId = encodeURIComponent(itemId)
    const apiUrl = `${EBAY_BROWSE_API}/${encodedItemId}`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-EBAY-C-MARKETPLACE-ID': marketplaceId,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Browse API getItem Error:', errorText)
      return NextResponse.json(
        { success: false, error: `Browse API Error: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    const item = await response.json()

    // データ整形
    const itemSpecifics = parseItemSpecifics(item.localizedAspects)
    const weight = extractWeight(item)
    const dimensions = extractDimensions(item)
    const categoryId = item.categoryId || item.categoryPath?.split('|').pop()
    const originCountry = extractOriginCountry(itemSpecifics)
    const conditionDescriptors = extractConditionDescriptors(item)

    const itemDetails = {
      itemId: item.itemId || itemId,
      title: item.title,
      itemSpecifics,
      weight,
      dimensions,
      shippingOptions: item.shippingOptions || [],
      categoryId,
      categoryName: item.categoryPath?.split('|').pop() || '',
      categoryPath: item.categoryPath,
      condition: item.condition,
      conditionId: item.conditionId,
      conditionDescription: item.conditionDescription,
      conditionDescriptors,
      brand: itemSpecifics['Brand'] || itemSpecifics['ブランド'],
      model: itemSpecifics['Model'] || itemSpecifics['MPN'],
      color: itemSpecifics['Color'] || itemSpecifics['カラー'],
      material: itemSpecifics['Material'] || itemSpecifics['素材'],
      countryOfManufacture: originCountry,
      originCountry,
      price: {
        value: parseFloat(item.price?.value || '0'),
        currency: item.price?.currency || 'USD',
      },
      rawLocalizedAspects: item.localizedAspects,
      image: item.image?.imageUrl,
      seller: item.seller,
      itemLocation: item.itemLocation,
    }

    console.log('✅ [POST] 詳細取得成功:', {
      itemId: itemDetails.itemId,
      title: itemDetails.title?.slice(0, 50),
      specsCount: Object.keys(itemSpecifics).length,
      weight,
      originCountry,
    })

    return NextResponse.json({
      success: true,
      itemDetails
    })

  } catch (error: any) {
    console.error('❌ [POST] 詳細取得エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
