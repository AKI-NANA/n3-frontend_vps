/**
 * eBay 出品データ検証 API
 * 
 * 実際の出品前にデータの完全性をチェック
 * - 必須フィールドの存在確認
 * - ポリシーの有効性確認
 * - Locationの存在確認
 * - 最終的なJSONサンプル出力
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  data: {
    sku?: string
    title?: string
    price?: number
    condition?: string
    categoryId?: string
    imageCount?: number
    itemSpecificsCount?: number
    policies?: any
    location?: any
    packageInfo?: any
  }
  jsonSample?: {
    inventoryItem: any
    offer: any
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, account = 'mjt' } = body

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      data: {}
    }

    // 1. 商品データ取得
    const { data: product, error: fetchError } = await supabase
      .from('products_master')
      .select('*')
      .eq('id', productId)
      .single()

    if (fetchError || !product) {
      return NextResponse.json({
        isValid: false,
        errors: ['商品が見つかりません'],
        warnings: [],
        data: {}
      })
    }

    const listingData = product.listing_data as any || {}
    const ebayData = product.ebay_api_data as any || {}
    const scrapedData = product.scraped_data as any || {}

    // ========================================
    // 2. 必須フィールドチェック
    // ========================================

    // SKU
    if (!product.sku) {
      result.errors.push('SKUが設定されていません')
      result.isValid = false
    } else {
      result.data.sku = product.sku
    }

    // タイトル
    const title = product.english_title || product.title_en || ebayData?.title || product.title
    if (!title || title.trim() === '') {
      result.errors.push('タイトルが設定されていません')
      result.isValid = false
    } else {
      result.data.title = title.substring(0, 80)
      if (title.length > 80) {
        result.warnings.push(`タイトルが80文字を超えています（${title.length}文字）→ 切り詰められます`)
      }
    }

    // 価格
    const price = listingData.ddp_price_usd || listingData.ddu_price_usd || product.ddp_price_usd || product.price_usd
    if (!price || price <= 0) {
      result.errors.push('価格が設定されていません')
      result.isValid = false
    } else {
      result.data.price = price
      if (price < 0.99) {
        result.warnings.push('価格が$0.99未満です（eBay最低価格）')
      }
    }

    // コンディション
    const condition = listingData.condition_en || listingData.condition || product.condition || 'Used'
    result.data.condition = condition

    // カテゴリID
    const categoryId = listingData.ebay_category_id || ebayData?.category_id || product.ebay_category_id
    if (!categoryId) {
      result.warnings.push('カテゴリIDが設定されていません（デフォルト: 183454）')
      result.data.categoryId = '183454'
    } else {
      result.data.categoryId = categoryId
    }

    // 画像
    const imageUrls = getImageUrls(product, listingData, scrapedData)
    if (imageUrls.length === 0) {
      result.errors.push('画像がありません')
      result.isValid = false
    } else {
      result.data.imageCount = imageUrls.length
      if (imageUrls.length > 12) {
        result.warnings.push(`画像が12枚を超えています（${imageUrls.length}枚）→ 最初の12枚のみ使用`)
      }
      // HTTPチェック
      const httpImages = imageUrls.filter(url => url.startsWith('http://'))
      if (httpImages.length > 0) {
        result.warnings.push(`${httpImages.length}枚の画像がHTTPです → HTTPSに自動変換されます`)
      }
    }

    // Item Specifics
    const itemSpecifics = listingData.item_specifics || ebayData?.item_specifics || scrapedData?.item_specifics || {}
    result.data.itemSpecificsCount = Object.keys(itemSpecifics).length
    
    if (!itemSpecifics['Brand'] && !itemSpecifics['brand']) {
      result.warnings.push('Brandが設定されていません → "Unbranded"が自動適用されます')
    }
    if (!itemSpecifics['MPN'] && !itemSpecifics['mpn']) {
      result.warnings.push('MPNが設定されていません → "Does Not Apply"が自動適用されます')
    }

    // パッケージ情報
    result.data.packageInfo = {
      weight_g: listingData.weight_g || 100,
      height_cm: listingData.height_cm || 1,
      width_cm: listingData.width_cm || 10,
      length_cm: listingData.length_cm || 15
    }

    // ========================================
    // 3. ポリシーチェック
    // ========================================
    const shippingPolicyId = listingData.shipping_policy_id

    if (!shippingPolicyId) {
      result.errors.push('配送ポリシーID (shipping_policy_id) が設定されていません')
      result.isValid = false
    } else {
      const { data: policy, error: policyError } = await supabase
        .from('ebay_shipping_policies')
        .select('policy_id, policy_name, payment_policy_id, return_policy_id')
        .eq('policy_id', shippingPolicyId.toString())
        .single()

      if (policyError || !policy) {
        result.errors.push(`配送ポリシーID ${shippingPolicyId} がDBに存在しません`)
        result.isValid = false
      } else {
        result.data.policies = {
          fulfillmentPolicyId: policy.policy_id,
          paymentPolicyId: policy.payment_policy_id,
          returnPolicyId: policy.return_policy_id,
          policyName: policy.policy_name
        }

        if (!policy.payment_policy_id) {
          result.errors.push('支払いポリシーID (payment_policy_id) がDBに設定されていません')
          result.isValid = false
        }
        if (!policy.return_policy_id) {
          result.errors.push('返品ポリシーID (return_policy_id) がDBに設定されていません')
          result.isValid = false
        }
      }
    }

    // ========================================
    // 4. Locationチェック
    // ========================================
    const accountName = account === 'green' || account === 'GREEN' ? 'green' : 'mjt'
    
    const { data: location, error: locationError } = await supabase
      .from('ebay_locations')
      .select('merchant_location_key, location_name')
      .eq('account_id', accountName)
      .eq('is_active', true)
      .limit(1)
      .single()

    if (locationError || !location) {
      result.warnings.push(`ebay_locationsにアカウント "${accountName}" の登録がありません`)
      result.warnings.push('→ 環境変数 EBAY_LOCATION_KEY または "default" が使用されます')
      result.data.location = { 
        merchantLocationKey: process.env.EBAY_LOCATION_KEY || 'default',
        source: 'fallback'
      }
    } else {
      result.data.location = {
        merchantLocationKey: location.merchant_location_key,
        locationName: location.location_name,
        source: 'database'
      }
    }

    // ========================================
    // 5. JSONサンプル生成
    // ========================================
    if (result.isValid || result.errors.length < 3) {
      const aspects = buildAspects(itemSpecifics)
      
      result.jsonSample = {
        inventoryItem: {
          availability: {
            shipToLocationAvailability: {
              quantity: product.stock_quantity || 1
            }
          },
          condition: mapCondition(condition),
          conditionDescription: condition,
          product: {
            title: result.data.title,
            description: listingData.html_description || `<p>${result.data.title}</p>`,
            imageUrls: imageUrls.slice(0, 12).map(url => url.replace('http://', 'https://')),
            aspects: aspects
          },
          packageWeightAndSize: {
            dimensions: {
              height: result.data.packageInfo?.height_cm,
              length: result.data.packageInfo?.length_cm,
              width: result.data.packageInfo?.width_cm,
              unit: 'CENTIMETER'
            },
            weight: {
              value: result.data.packageInfo?.weight_g,
              unit: 'GRAM'
            }
          }
        },
        offer: {
          sku: result.data.sku,
          marketplaceId: 'EBAY_US',
          format: 'FIXED_PRICE',
          availableQuantity: product.stock_quantity || 1,
          categoryId: result.data.categoryId,
          listingPolicies: result.data.policies ? {
            fulfillmentPolicyId: result.data.policies.fulfillmentPolicyId,
            paymentPolicyId: result.data.policies.paymentPolicyId,
            returnPolicyId: result.data.policies.returnPolicyId
          } : null,
          pricingSummary: {
            price: {
              currency: 'USD',
              value: result.data.price?.toFixed(2)
            }
          },
          merchantLocationKey: result.data.location?.merchantLocationKey
        }
      }
    }

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('❌ Validation error:', error)
    return NextResponse.json({
      isValid: false,
      errors: [error.message],
      warnings: [],
      data: {}
    }, { status: 500 })
  }
}

// ヘルパー関数
function getImageUrls(product: any, listingData: any, scrapedData: any): string[] {
  const urls = listingData?.image_urls 
    || scrapedData?.image_urls 
    || product.image_urls 
    || (product.primary_image_url ? [product.primary_image_url] : [])
  
  return Array.isArray(urls) ? urls.filter(u => u && u.trim() !== '') : []
}

function buildAspects(itemSpecifics: Record<string, any>): Record<string, string[]> {
  const aspects: Record<string, string[]> = {}
  
  for (const [key, value] of Object.entries(itemSpecifics)) {
    if (value && value.toString().trim() !== '') {
      aspects[key] = [value.toString()]
    }
  }
  
  // デフォルト値追加
  if (!aspects['Brand']) aspects['Brand'] = ['Unbranded']
  if (!aspects['MPN']) aspects['MPN'] = ['Does Not Apply']
  if (!aspects['Country/Region of Manufacture']) aspects['Country/Region of Manufacture'] = ['Japan']
  
  return aspects
}

function mapCondition(condition: string): string {
  const conditionMap: Record<string, string> = {
    'new': 'NEW',
    'used': 'USED_EXCELLENT',
    'like new': 'LIKE_NEW',
    'very good': 'USED_VERY_GOOD',
    'good': 'USED_GOOD',
    'acceptable': 'USED_ACCEPTABLE'
  }
  return conditionMap[condition.toLowerCase()] || 'USED_EXCELLENT'
}
