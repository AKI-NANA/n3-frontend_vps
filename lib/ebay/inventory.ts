// lib/ebay/inventory.ts
/**
 * eBay Inventory API - 在庫・出品管理
 */

import { getAccessToken } from './oauth'

const EBAY_API_BASE = 'https://api.ebay.com'

export interface ListingProduct {
  id: number
  sku: string
  title: string
  english_title: string | null
  title_en?: string | null
  price_usd?: number
  listing_data?: {
    condition?: string
    html_description?: string
    ddp_price_usd?: number
    ddu_price_usd?: number
    shipping_service?: string
    shipping_cost_usd?: number
    weight_g?: number
    width_cm?: number
    height_cm?: number
    length_cm?: number
  }
  ebay_api_data?: {
    category_id?: string
    title?: string
  }
  scraped_data?: {
    image_urls?: string[]
  }
  // 代替画像ソース
  primary_image_url?: string
  gallery_images?: string[]
  image_url?: string
  current_stock?: number
  ebay_category_id?: string
  category_id?: string
  html_content?: string
  ddp_price_usd?: number
  ddu_price_usd?: number
  condition_name?: string
}

export interface ListingResult {
  success: boolean
  listingId?: string
  offerId?: string
  error?: string
}

/**
 * 商品から画像URLリストを取得（複数ソースをフォールバック）
 */
function getImageUrls(product: ListingProduct): string[] {
  // 優先順位: scraped_data.image_urls > gallery_images > primary_image_url > image_url
  const imageUrls: string[] = []
  
  // scraped_data.image_urls
  if (product.scraped_data?.image_urls && product.scraped_data.image_urls.length > 0) {
    imageUrls.push(...product.scraped_data.image_urls)
  }
  
  // gallery_images
  if (imageUrls.length === 0 && product.gallery_images && product.gallery_images.length > 0) {
    imageUrls.push(...product.gallery_images)
  }
  
  // primary_image_url
  if (imageUrls.length === 0 && product.primary_image_url) {
    imageUrls.push(product.primary_image_url)
  }
  
  // image_url
  if (imageUrls.length === 0 && product.image_url) {
    imageUrls.push(product.image_url)
  }
  
  // デフォルト画像がない場合は空配列（eBayはエラーになる）
  return imageUrls.filter(url => url && url.trim() !== '')
}

/**
 * 商品からカテゴリIDを取得
 */
function getCategoryId(product: ListingProduct): string {
  return product.ebay_api_data?.category_id 
    || product.ebay_category_id 
    || product.category_id 
    || '183050' // デフォルト: Collectible Card Games
}

/**
 * 商品から価格を取得
 */
function getPrice(product: ListingProduct): number {
  return product.listing_data?.ddp_price_usd 
    || product.listing_data?.ddu_price_usd 
    || product.ddp_price_usd 
    || product.ddu_price_usd 
    || product.price_usd 
    || 9.99
}

/**
 * 商品から説明文を取得
 */
function getDescription(product: ListingProduct): string {
  return product.listing_data?.html_description 
    || product.html_content 
    || `<p>${product.english_title || product.title_en || product.title}</p>`
}

/**
 * 商品からコンディションを取得
 */
function getCondition(product: ListingProduct): string {
  return product.listing_data?.condition 
    || product.condition_name 
    || 'Used'
}

/**
 * eBayに商品を出品
 */
export async function listProductToEbay(
  product: ListingProduct,
  account: 'account1' | 'account2'
): Promise<ListingResult> {
  try {
    // 画像URLチェック
    const imageUrls = getImageUrls(product)
    if (imageUrls.length === 0) {
      return {
        success: false,
        error: '画像がありません。出品には少なくとも1枚の画像が必要です。'
      }
    }
    
    const accessToken = await getAccessToken(account)
    
    // Step 1: Inventory Itemを作成/更新
    const inventoryResult = await createOrUpdateInventoryItem(product, imageUrls, accessToken)
    if (!inventoryResult.success) {
      return inventoryResult
    }
    
    // Step 2: Offerを作成
    const offerResult = await createOffer(product, accessToken)
    if (!offerResult.success) {
      return offerResult
    }
    
    // Step 3: Offerを公開（出品）
    const publishResult = await publishOffer(offerResult.offerId!, accessToken)
    
    return publishResult
    
  } catch (error: any) {
    console.error('eBay出品エラー:', error)
    return {
      success: false,
      error: error.message || '出品に失敗しました'
    }
  }
}

/**
 * Step 1: Inventory Item作成/更新
 */
async function createOrUpdateInventoryItem(
  product: ListingProduct,
  imageUrls: string[],
  accessToken: string
): Promise<ListingResult> {
  const sku = product.sku
  
  if (!sku) {
    return {
      success: false,
      error: 'SKUが設定されていません'
    }
  }
  
  const inventoryItem = {
    availability: {
      shipToLocationAvailability: {
        quantity: product.current_stock || 1
      }
    },
    condition: mapCondition(getCondition(product)),
    product: {
      title: product.english_title || product.title_en || product.ebay_api_data?.title || product.title,
      description: getDescription(product),
      imageUrls: imageUrls.slice(0, 12), // eBayは最大12枚
      aspects: {
        Brand: ['Unbranded'],
        Type: ['Trading Card']
      }
    },
    packageWeightAndSize: {
      dimensions: {
        height: product.listing_data?.height_cm || 1,
        length: product.listing_data?.length_cm || 10,
        width: product.listing_data?.width_cm || 7,
        unit: 'CENTIMETER'
      },
      weight: {
        value: product.listing_data?.weight_g || 100,
        unit: 'GRAM'
      }
    }
  }
  
  console.log(`📦 Inventory Item作成: SKU=${sku}, 画像=${imageUrls.length}枚`)
  
  const response = await fetch(
    `${EBAY_API_BASE}/sell/inventory/v1/inventory_item/${sku}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Language': 'en-US'
      },
      body: JSON.stringify(inventoryItem)
    }
  )
  
  if (!response.ok) {
    const error = await response.json()
    console.error('Inventory Item作成エラー:', error)
    return {
      success: false,
      error: `Inventory Item作成失敗: ${error.errors?.[0]?.message || response.statusText}`
    }
  }
  
  // 204 No Contentは成功
  return { success: true }
}

/**
 * Step 2: Offer作成
 */
async function createOffer(
  product: ListingProduct,
  accessToken: string
): Promise<ListingResult> {
  const categoryId = getCategoryId(product)
  const price = getPrice(product)
  
  const offer = {
    sku: product.sku,
    marketplaceId: 'EBAY_US',
    format: 'FIXED_PRICE',
    availableQuantity: product.current_stock || 1,
    categoryId: categoryId,
    listingDescription: getDescription(product),
    listingPolicies: {
      fulfillmentPolicyId: '6462624000', // デフォルトの配送ポリシー
      paymentPolicyId: '6462627000',     // デフォルトの支払いポリシー
      returnPolicyId: '6462630000'       // デフォルトの返品ポリシー
    },
    pricingSummary: {
      price: {
        currency: 'USD',
        value: price.toString()
      }
    },
    merchantLocationKey: 'default' // デフォルトの発送元
  }
  
  console.log(`📋 Offer作成: カテゴリ=${categoryId}, 価格=$${price}`)
  
  const response = await fetch(
    `${EBAY_API_BASE}/sell/inventory/v1/offer`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Language': 'en-US'
      },
      body: JSON.stringify(offer)
    }
  )
  
  if (!response.ok) {
    const error = await response.json()
    console.error('Offer作成エラー:', error)
    return {
      success: false,
      error: `Offer作成失敗: ${error.errors?.[0]?.message || response.statusText}`
    }
  }
  
  const result = await response.json()
  
  return {
    success: true,
    offerId: result.offerId
  }
}

/**
 * Step 3: Offer公開（出品）
 */
async function publishOffer(
  offerId: string,
  accessToken: string
): Promise<ListingResult> {
  console.log(`🚀 Offer公開: ${offerId}`)
  
  const response = await fetch(
    `${EBAY_API_BASE}/sell/inventory/v1/offer/${offerId}/publish`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )
  
  if (!response.ok) {
    const error = await response.json()
    console.error('Offer公開エラー:', error)
    return {
      success: false,
      error: `出品公開失敗: ${error.errors?.[0]?.message || response.statusText}`
    }
  }
  
  const result = await response.json()
  console.log(`✅ 出品完了: listingId=${result.listingId}`)
  
  return {
    success: true,
    listingId: result.listingId,
    offerId: offerId
  }
}

/**
 * Conditionマッピング
 */
function mapCondition(condition: string): string {
  const conditionMap: Record<string, string> = {
    'New': 'NEW',
    'Used': 'USED_EXCELLENT',
    '新品': 'NEW',
    '中古': 'USED_EXCELLENT',
    'Like New': 'LIKE_NEW',
    'Very Good': 'USED_VERY_GOOD',
    'Good': 'USED_GOOD',
    'Acceptable': 'USED_ACCEPTABLE'
  }
  
  return conditionMap[condition] || 'USED_EXCELLENT'
}

/**
 * 在庫数更新
 */
export async function updateInventoryQuantity(
  sku: string,
  quantity: number,
  account: 'account1' | 'account2'
): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = await getAccessToken(account)
    
    const response = await fetch(
      `${EBAY_API_BASE}/sell/inventory/v1/inventory_item/${sku}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          availability: {
            shipToLocationAvailability: {
              quantity: quantity
            }
          }
        })
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.errors?.[0]?.message || '在庫更新失敗'
      }
    }
    
    return { success: true }
    
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 価格更新
 */
export async function updateOfferPrice(
  offerId: string,
  price: number,
  account: 'account1' | 'account2'
): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = await getAccessToken(account)
    
    const response = await fetch(
      `${EBAY_API_BASE}/sell/inventory/v1/offer/${offerId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pricingSummary: {
            price: {
              currency: 'USD',
              value: price.toString()
            }
          }
        })
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.errors?.[0]?.message || '価格更新失敗'
      }
    }
    
    return { success: true }
    
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}
