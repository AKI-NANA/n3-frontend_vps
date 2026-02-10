// app/api/sellermirror/batch-details/route.ts
/**
 * SellerMirror 競合商品詳細一括取得API
 * 
 * 選択した競合商品のItem Specifics等を取得し、
 * products_masterに保存する
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const EBAY_BROWSE_API = 'https://api.ebay.com/buy/browse/v1/item'
const EBAY_TOKEN_API = 'https://api.ebay.com/identity/v1/oauth2/token'

// Supabase クライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
 * Browse API getItem エンドポイントで詳細取得
 */
async function getItemDetails(accessToken: string, itemId: string) {
  const encodedItemId = encodeURIComponent(itemId)
  const apiUrl = `${EBAY_BROWSE_API}/${encodedItemId}`

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
    console.error('❌ Browse API Error:', response.status, errorText)
    return null
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemIds, productId } = body

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'itemIds は必須です（配列）' },
        { status: 400 }
      )
    }

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId は必須です' },
        { status: 400 }
      )
    }

    console.log('🔍 SellerMirror詳細一括取得:', { productId, itemIds })

    // 1. アクセストークン取得
    const accessToken = await getAccessToken()

    // 2. 各アイテムの詳細を取得
    const results: any[] = []
    let successCount = 0
    let failedCount = 0
    let allItemSpecifics: Record<string, string> = {}
    let primaryItemDetails: any = null

    for (const itemId of itemIds) {
      try {
        const item = await getItemDetails(accessToken, itemId)
        
        if (item) {
          const itemSpecifics = parseItemSpecifics(item.localizedAspects)
          const weight = extractWeight(item)
          const dimensions = extractDimensions(item)
          
          const itemDetails = {
            itemId: item.itemId || itemId,
            title: item.title,
            itemSpecifics,
            weight,
            dimensions,
            condition: item.condition,
            conditionId: item.conditionId,
            categoryId: item.categoryId,
            brand: itemSpecifics['Brand'] || itemSpecifics['ブランド'],
            model: itemSpecifics['Model'] || itemSpecifics['MPN'],
            color: itemSpecifics['Color'] || itemSpecifics['カラー'],
            material: itemSpecifics['Material'] || itemSpecifics['素材'],
            countryOfManufacture: itemSpecifics['Country/Region of Manufacture'] || itemSpecifics['Country of Manufacture'],
            image: item.image?.imageUrl,
            price: item.price,
            seller: item.seller
          }
          
          results.push({ itemId, success: true, details: itemDetails })
          successCount++
          
          // Item Specifics をマージ（最初の成功した商品を優先）
          if (!primaryItemDetails) {
            primaryItemDetails = itemDetails
            allItemSpecifics = { ...itemSpecifics }
          } else {
            // 既存にない項目だけ追加
            for (const [key, value] of Object.entries(itemSpecifics)) {
              if (!allItemSpecifics[key]) {
                allItemSpecifics[key] = value
              }
            }
          }
          
          console.log(`  ✅ ${itemId}: ${Object.keys(itemSpecifics).length}件のItem Specifics`)
        } else {
          results.push({ itemId, success: false, error: '取得失敗' })
          failedCount++
          console.log(`  ❌ ${itemId}: 取得失敗`)
        }
      } catch (err: any) {
        results.push({ itemId, success: false, error: err.message })
        failedCount++
        console.log(`  ❌ ${itemId}: ${err.message}`)
      }
    }

    // 3. products_master に保存
    if (primaryItemDetails && Object.keys(allItemSpecifics).length > 0) {
      // 既存のebay_api_dataを取得
      const { data: existingProduct } = await supabase
        .from('products_master')
        .select('ebay_api_data')
        .eq('id', productId)
        .single()

      const existingEbayData = existingProduct?.ebay_api_data || {}

      // ebay_api_data に競合商品詳細を追加
      const updatedEbayData = {
        ...existingEbayData,
        competitor_details: {
          itemId: primaryItemDetails.itemId,
          title: primaryItemDetails.title,
          condition: primaryItemDetails.condition,
          conditionId: primaryItemDetails.conditionId,
          brand: primaryItemDetails.brand,
          model: primaryItemDetails.model,
          color: primaryItemDetails.color,
          material: primaryItemDetails.material,
          countryOfManufacture: primaryItemDetails.countryOfManufacture,
          weight: primaryItemDetails.weight,
          dimensions: primaryItemDetails.dimensions,
          image: primaryItemDetails.image,
          price: primaryItemDetails.price,
          seller: primaryItemDetails.seller,
          itemSpecifics: allItemSpecifics,
          fetchedAt: new Date().toISOString()
        }
      }

      // DB更新
      const { error: updateError } = await supabase
        .from('products_master')
        .update({
          item_specifics: allItemSpecifics,
          ebay_api_data: updatedEbayData,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)

      if (updateError) {
        console.error('❌ DB更新エラー:', updateError)
        return NextResponse.json(
          { success: false, error: `DB更新失敗: ${updateError.message}` },
          { status: 500 }
        )
      }

      console.log(`✅ 商品ID ${productId} に ${Object.keys(allItemSpecifics).length}件のItem Specificsを保存`)
    }

    return NextResponse.json({
      success: true,
      productId,
      results,
      summary: {
        success: successCount,
        failed: failedCount
      },
      itemSpecificsCount: Object.keys(allItemSpecifics).length,
      savedToProduct: !!primaryItemDetails
    })

  } catch (error: any) {
    console.error('❌ batch-details エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
