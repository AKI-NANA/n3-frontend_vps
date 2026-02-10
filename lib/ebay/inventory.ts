// lib/ebay/inventory.ts
/**
 * eBay Inventory API - 在庫・出品管理
 * 
 * v2.2: データマッピング完全修正版
 * - HTML説明文の正確な取得
 * - 配送ポリシーの優先順位修正
 * - カード特有Item Specificsの強化
 * - 広告自動適用機能追加
 */

import { getAccessToken } from './oauth'
import { createClient } from '@supabase/supabase-js'

const EBAY_API_BASE = 'https://api.ebay.com'

// Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * 商品データの型定義（products_masterテーブルの全カラムに対応）
 */
export interface ListingProduct {
  id: number
  sku: string
  title: string
  english_title?: string | null
  title_en?: string | null
  description?: string
  description_en?: string
  description_html?: string        // 🔥 追加
  html_description?: string        // 🔥 追加
  listing_description?: string     // 🔥 追加
  
  // 価格関連
  ddp_price_usd?: number
  ddu_price_usd?: number
  price_usd?: number
  
  // カテゴリ
  ebay_category_id?: string
  category_id?: string
  
  // コンディション
  condition?: string
  condition_name?: string
  english_condition?: string
  
  // 在庫
  current_stock?: number
  stock_quantity?: number
  inventory_quantity?: number
  
  // 画像
  primary_image_url?: string
  gallery_images?: string[] | string
  image_urls?: string[]
  
  // HTML説明
  html_content?: string
  product_html_generated?: string  // 🔥 追加: モーダルで生成したフルHTML
  
  // 🔥 product_details (JSONカラム - カード情報等)
  product_details?: {
    card_name?: string
    set_name?: string
    set?: string
    rarity?: string
    language?: string
    finish?: string
    card_number?: string
    card_type?: string
    attribute?: string
    [key: string]: any
  }
  
  // listing_data (JSONカラム - 計算済みデータ)
  listing_data?: {
    // 基本情報
    condition?: string
    condition_en?: string
    condition_id?: number
    condition_descriptors?: Array<{ name: string; values: string[] }>  // 🔥 追加: 2024年必須
    html_description?: string
    html_description_en?: string
    description?: string           // 🔥 追加
    description_html?: string      // 🔥 追加
    
    // 価格
    ddp_price_usd?: number
    ddu_price_usd?: number
    
    // 配送
    shipping_service?: string
    shipping_cost_usd?: number
    shipping_policy_id?: string | number
    fulfillment_policy_id?: string | number  // 🔥 追加
    payment_policy_id?: string | number      // 🔥 追加
    return_policy_id?: string | number       // 🔥 追加
    carrier_code?: string
    carrier_name?: string
    
    // サイズ・重量
    weight_g?: number
    width_cm?: number
    height_cm?: number
    length_cm?: number
    
    // 画像
    image_urls?: string[]
    
    // Item Specifics（商品詳細）
    item_specifics?: Record<string, string>
    
    // カテゴリ
    ebay_category_id?: string
    ebay_category_name?: string
    
    // 🔥 カード特有情報
    card_name?: string
    set_name?: string
    rarity?: string
    language?: string
    finish?: string
  }
  
  // ebay_api_data (JSONカラム)
  ebay_api_data?: {
    category_id?: string
    title?: string
    item_specifics?: Record<string, string>
  }
  
  // scraped_data (JSONカラム)
  scraped_data?: {
    image_urls?: string[]
    item_specifics?: Record<string, string>
    card_name?: string
    set_name?: string
    rarity?: string
  }
}

export interface ListingResult {
  success: boolean
  listingId?: string
  offerId?: string
  error?: string
  details?: any
}

/**
 * ポリシー情報の型定義
 */
interface PolicyInfo {
  fulfillmentPolicyId: string
  paymentPolicyId: string
  returnPolicyId: string
}

// ============================================
// データ取得ヘルパー関数
// ============================================

/**
 * 商品から画像URLリストを取得
 * 
 * 🔥 重要: scraped_data.image_urls（SMの画像）は絶対に使用しない！
 * 手動登録画像または取得した画像のみを使用する
 * 
 * 優先順位:
 * 1. gallery_images（手動登録画像）
 * 2. primary_image_url（手動登録メイン画像）
 * 3. listing_data.image_urls（計算時に設定された画像）
 * 4. image_urls（直接設定された画像）
 * 
 * ❌ scraped_data.image_urls は使用しない（SMの画像）
 */
function getImageUrls(product: ListingProduct): string[] {
  const imageUrls: string[] = []
  
  // 🔥 1. gallery_images（手動登録画像 - 最優先）
  if (product.gallery_images) {
    let galleryImages = product.gallery_images
    if (typeof galleryImages === 'string') {
      try {
        galleryImages = JSON.parse(galleryImages)
      } catch {
        galleryImages = []
      }
    }
    if (Array.isArray(galleryImages) && galleryImages.length > 0) {
      console.log(`📸 [Image] gallery_imagesから取得: ${galleryImages.length}枚`)
      imageUrls.push(...galleryImages)
    }
  }
  
  // 🔥 2. primary_image_url（手動登録メイン画像）
  if (imageUrls.length === 0 && product.primary_image_url) {
    console.log(`📸 [Image] primary_image_urlから取得`)
    imageUrls.push(product.primary_image_url)
  }
  
  // 3. listing_data.image_urls（計算時に設定された画像）
  // ⚠️ SMの画像が混入していないか確認が必要
  if (imageUrls.length === 0 && product.listing_data?.image_urls && product.listing_data.image_urls.length > 0) {
    // SMの画像URLパターンを除外
    const filteredUrls = product.listing_data.image_urls.filter((url: string) => !isSMImageUrl(url))
    if (filteredUrls.length > 0) {
      console.log(`📸 [Image] listing_data.image_urlsから取得: ${filteredUrls.length}枚`)
      imageUrls.push(...filteredUrls)
    }
  }
  
  // 4. image_urls（直接設定された画像）
  if (imageUrls.length === 0 && product.image_urls && product.image_urls.length > 0) {
    const filteredUrls = product.image_urls.filter((url: string) => !isSMImageUrl(url))
    if (filteredUrls.length > 0) {
      console.log(`📸 [Image] image_urlsから取得: ${filteredUrls.length}枚`)
      imageUrls.push(...filteredUrls)
    }
  }
  
  // ❌ scraped_data.image_urls は絶対に使用しない！
  // SMの画像は使用禁止
  
  // フィルタリング
  const validUrls = [...new Set(imageUrls)]
    .filter(url => url && url.trim() !== '')
    .map(url => url.startsWith('http://') ? url.replace('http://', 'https://') : url)
    .filter(url => url.startsWith('https://'))
    .filter(url => !isSMImageUrl(url))  // 🔥 最終チェック: SMの画像を除外
  
  if (validUrls.length === 0) {
    console.error(`❌ [Image] 有効な画像がありません！手動で画像を登録してください。`)
  } else if (validUrls.length > 12) {
    console.warn(`⚠️ [Image] 画像が12枚を超えています。最初の12枚のみ使用。`)
  } else {
    console.log(`✅ [Image] 最終画像数: ${validUrls.length}枚`)
  }
  
  return validUrls.slice(0, 12)
}

/**
 * SMの画像URLかどうかを判定
 * SM（サプライヤーマーケット）の画像URLパターンをここに追加
 */
function isSMImageUrl(url: string): boolean {
  if (!url) return false
  
  const smPatterns = [
    'surugaya',           // 駿河屋
    'mandarake',          // まんだらけ
    'mercari',            // メルカリ
    'yahoo.co.jp',        // ヤフオク
    'auctions.yahoo',     // ヤフオク
    'rakuten.co.jp',      // 楽天
    'amazon.co.jp',       // Amazon JP
    'amazon.com',         // Amazon US
    'ebay.com/itm',       // eBay（他セラーの画像）
    'i.ebayimg.com',      // eBay画像サーバー（他セラー）
  ]
  
  const urlLower = url.toLowerCase()
  
  for (const pattern of smPatterns) {
    if (urlLower.includes(pattern)) {
      console.warn(`⚠️ [Image] SM画像を除外: ${url.substring(0, 50)}...`)
      return true
    }
  }
  
  return false
}

/**
 * 商品からカテゴリIDを取得
 */
function getCategoryId(product: ListingProduct): string {
  return product.listing_data?.ebay_category_id
    || product.ebay_api_data?.category_id 
    || product.ebay_category_id 
    || product.category_id 
    || '183454'
}

/**
 * 商品から価格を取得
 */
function getPrice(product: ListingProduct): number {
  const price = product.listing_data?.ddp_price_usd 
    || product.listing_data?.ddu_price_usd 
    || product.ddp_price_usd 
    || product.ddu_price_usd 
    || product.price_usd 
    || 0
  
  if (price <= 0) {
    throw new Error('価格が設定されていません。出品できません。')
  }
  
  return price
}

/**
 * 🔥 商品からフルHTML説明文を取得（Offer API用 - 制限なし）
 * 
 * 優先順位:
 * 1. product_html_generated (モーダルで生成したフルHTML) ← 最優先
 * 2. listing_data.html_description
 * 3. listing_data.html_description_en
 * 4. listing_data.description_html
 * 5. listing_data.description
 * 6. product.html_description
 * 7. product.description_html
 * 8. product.html_content
 * 9. フォールバック
 */
function getDescription(product: ListingProduct): string {
  // 🔥 最優先: product_html_generated（モーダルで生成したフルHTML）
  if (product.product_html_generated && product.product_html_generated.trim() !== '') {
    console.log(`📝 [Description] product_html_generatedを使用（${product.product_html_generated.length}文字）`)
    console.log(`   先頭100文字: ${product.product_html_generated.substring(0, 100)}...`)
    return product.product_html_generated
  }
  
  // その他のソースからフォールバック
  const description = 
    product.listing_data?.html_description ||
    product.listing_data?.html_description_en ||
    product.listing_data?.description_html ||
    product.listing_data?.description ||
    product.html_description ||
    product.description_html ||
    product.html_content ||
    product.description ||
    null
  
  if (description && description.trim() !== '') {
    console.log(`📝 [Description] HTML説明文を取得（${description.length}文字）`)
    console.log(`   先頭100文字: ${description.substring(0, 100)}...`)
    return description
  }
  
  // 最終フォールバック
  console.warn(`⚠️ [Description] HTML説明文なし、タイトルからフォールバック`)
  return `<p>${product.english_title || product.title_en || product.title}</p>`
}

/**
 * 🔥 Inventory Item用のシンプルな説明文を取得（4000文字制限）
 * eBay Inventory APIのproduct.descriptionは4000文字制限があるため、
 * シンプルなテキスト説明を返す
 */
function getShortDescription(product: ListingProduct): string {
  const title = product.english_title || product.title_en || product.title || 'Product'
  const condition = product.listing_data?.condition_en || product.listing_data?.condition || 'Used'
  
  // シンプルな説明文（4000文字以内）
  let description = `${title}\n\nCondition: ${condition}\n\nAuthentic product from Japan.\nShips worldwide with full tracking.\nSecure packaging for safe delivery.\n\nPlease see the listing description for complete details, shipping information, and return policy.`
  
  // Item Specificsから主要情報を追加
  const specs = product.listing_data?.item_specifics || {}
  const importantSpecs = ['Brand', 'Card Name', 'Set', 'Rarity', 'Language', 'Game']
  const specLines: string[] = []
  
  for (const key of importantSpecs) {
    if (specs[key]) {
      specLines.push(`${key}: ${specs[key]}`)
    }
  }
  
  if (specLines.length > 0) {
    description += '\n\nProduct Details:\n' + specLines.join('\n')
  }
  
  // 4000文字以内に収める
  if (description.length > 3900) {
    description = description.substring(0, 3900) + '...'
  }
  
  console.log(`📝 [ShortDesc] Inventory用説明文: ${description.length}文字`)
  return description
}

/**
 * 商品からコンディション文字列を取得
 */
function getCondition(product: ListingProduct): string {
  const condition = product.listing_data?.condition_en
    || product.listing_data?.condition
    || product.condition
    || product.condition_name 
    || product.english_condition
    || 'Used'
  
  return condition && condition.trim() !== '' ? condition : 'Used'
}

/**
 * 商品から在庫数を取得
 */
function getQuantity(product: ListingProduct): number {
  const qty = product.current_stock 
    || product.stock_quantity 
    || product.inventory_quantity 
    || 1
  
  if (qty <= 0) {
    throw new Error('在庫数が0以下です。出品できません。')
  }
  
  return qty
}

/**
 * 商品からタイトルを取得
 */
function getTitle(product: ListingProduct): string {
  let title = product.english_title 
    || product.title_en 
    || product.ebay_api_data?.title 
    || product.title
    || ''
  
  if (!title || title.trim() === '') {
    throw new Error('タイトルが設定されていません。出品できません。')
  }
  
  title = title
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F]/g, '')
    .replace(/[\u007F-\u009F]/g, '')
    .trim()
  
  if (title.length > 80) {
    console.warn(`⚠️ [Title] 80文字超過。切り詰めます。`)
    title = title.substring(0, 77) + '...'
  }
  
  return title
}

/**
 * 🔥 商品からItem Specificsを取得（カード特有項目を強化）
 */
function getItemSpecifics(product: ListingProduct): Record<string, string[]> {
  const aspects: Record<string, string[]> = {}
  
  // 基本のitem_specificsを取得
  const itemSpecifics = product.listing_data?.item_specifics
    || product.ebay_api_data?.item_specifics
    || product.scraped_data?.item_specifics
    || {}
  
  for (const [key, value] of Object.entries(itemSpecifics)) {
    if (value && value.toString().trim() !== '') {
      if (typeof value === 'string' && value.includes(',')) {
        const values = value.split(',').map(v => v.trim()).filter(v => v !== '')
        if (values.length > 0) {
          aspects[key] = values
        }
      } else {
        const trimmedValue = value.toString().trim()
        if (trimmedValue !== '') {
          aspects[key] = [trimmedValue]
        }
      }
    }
  }
  
  // 🔥 カード特有情報をproduct_detailsやlisting_dataから補完
  const cardInfo = {
    cardName: product.product_details?.card_name 
      || product.listing_data?.card_name 
      || product.scraped_data?.card_name,
    setName: product.product_details?.set_name 
      || product.product_details?.set
      || product.listing_data?.set_name 
      || product.scraped_data?.set_name,
    rarity: product.product_details?.rarity 
      || product.listing_data?.rarity 
      || product.scraped_data?.rarity,
    language: product.product_details?.language 
      || product.listing_data?.language,
    finish: product.product_details?.finish 
      || product.listing_data?.finish,
    cardNumber: product.product_details?.card_number,
    cardType: product.product_details?.card_type,
    attribute: product.product_details?.attribute
  }
  
  // Card Name
  if (!aspects['Card Name'] && cardInfo.cardName) {
    aspects['Card Name'] = [cardInfo.cardName]
    console.log(`📋 [Aspects] Card Name補完: ${cardInfo.cardName}`)
  }
  
  // Set
  if (!aspects['Set'] && cardInfo.setName) {
    aspects['Set'] = [cardInfo.setName]
    console.log(`📋 [Aspects] Set補完: ${cardInfo.setName}`)
  }
  
  // Rarity
  if (!aspects['Rarity'] && cardInfo.rarity) {
    aspects['Rarity'] = [cardInfo.rarity]
    console.log(`📋 [Aspects] Rarity補完: ${cardInfo.rarity}`)
  }
  
  // Language
  if (!aspects['Language'] && cardInfo.language) {
    aspects['Language'] = [cardInfo.language]
  }
  
  // Card Number
  if (!aspects['Card Number'] && cardInfo.cardNumber) {
    aspects['Card Number'] = [cardInfo.cardNumber]
  }
  
  // Finish (Foil等)
  if (!aspects['Finish'] && cardInfo.finish) {
    aspects['Finish'] = [cardInfo.finish]
  }
  
  // Attribute
  if (!aspects['Attribute'] && cardInfo.attribute) {
    aspects['Attribute'] = [cardInfo.attribute]
  }
  
  // ========================================
  // 必須項目のデフォルト値
  // ========================================
  
  if (!aspects['Brand'] || aspects['Brand'][0] === '' || aspects['Brand'][0] === 'N/A') {
    aspects['Brand'] = ['Unbranded']
  }
  
  if (!aspects['MPN'] || aspects['MPN'][0] === '' || aspects['MPN'][0] === 'N/A') {
    aspects['MPN'] = ['Does Not Apply']
  }
  
  if (!aspects['Country/Region of Manufacture']) {
    aspects['Country/Region of Manufacture'] = ['Japan']
  }
  
  // ========================================
  // トレーディングカードカテゴリ固有
  // ========================================
  const categoryId = getCategoryId(product)
  const tradingCardCategories = ['183454', '183456', '261328', '183453', '2536', '2613', '261323']
  
  if (tradingCardCategories.includes(categoryId)) {
    // Game
    if (!aspects['Game']) {
      const title = (product.english_title || product.title || '').toLowerCase()
      if (title.includes('mtg') || title.includes('magic') || title.includes('final fantasy')) {
        aspects['Game'] = ['Magic: The Gathering']
      } else if (title.includes('pokemon')) {
        aspects['Game'] = ['Pokémon TCG']
      } else if (title.includes('yugioh') || title.includes('yu-gi-oh')) {
        aspects['Game'] = ['Yu-Gi-Oh! TCG']
      } else if (title.includes('one piece')) {
        aspects['Game'] = ['One Piece Card Game']
      } else {
        aspects['Game'] = ['Other Trading Card Games']
      }
      console.log(`📋 [Aspects] Game自動設定: ${aspects['Game'][0]}`)
    }
    
    // Graded
    if (!aspects['Graded'] && !aspects['Professional Grader']) {
      aspects['Graded'] = ['No']
    }
    
    // Language（デフォルト）
    if (!aspects['Language']) {
      const title = (product.english_title || product.title || '').toLowerCase()
      if (title.includes('japanese') || title.includes('日本語')) {
        aspects['Language'] = ['Japanese']
      } else if (title.includes('english')) {
        aspects['Language'] = ['English']
      } else {
        aspects['Language'] = ['Japanese']
      }
    }
    
    // Card Condition
    if (!aspects['Card Condition']) {
      aspects['Card Condition'] = ['Ungraded']
    }
  }
  
  console.log(`📋 [Item Specifics] 最終: ${Object.keys(aspects).length}項目`)
  console.log(`   詳細: ${Object.keys(aspects).join(', ')}`)
  
  return aspects
}

/**
 * 商品からサイズ・重量情報を取得
 */
function getPackageInfo(product: ListingProduct) {
  return {
    dimensions: {
      height: product.listing_data?.height_cm || 1,
      length: product.listing_data?.length_cm || 15,
      width: product.listing_data?.width_cm || 10,
      unit: 'CENTIMETER' as const
    },
    weight: {
      value: product.listing_data?.weight_g || 100,
      unit: 'GRAM' as const
    }
  }
}

// ============================================
// Location取得関数
// ============================================

async function getMerchantLocationKey(account: string): Promise<string> {
  const accountName = account === 'green' || account === 'GREEN' ? 'green' 
    : account === 'account2' ? 'green'
    : 'mjt'
  
  console.log(`📍 [Location] 検索中: account=${accountName}`)
  
  try {
    const { data: location, error } = await supabase
      .from('ebay_locations')
      .select('merchant_location_key, location_name')
      .eq('account_id', accountName)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (!error && location?.merchant_location_key) {
      console.log(`✅ [Location] DBから取得: ${location.merchant_location_key}`)
      return location.merchant_location_key
    }
  } catch (e: any) {
    console.warn(`⚠️ [Location] DBクエリ失敗: ${e.message}`)
  }
  
  const envKey = process.env.EBAY_LOCATION_KEY
  if (envKey) {
    return envKey
  }
  
  console.warn(`⚠️ [Location] デフォルト値 'default' を使用`)
  return 'default'
}

// ============================================
// 🔥 ポリシー取得関数（価格帯に基づく自動選択）
// ============================================

async function getPolicies(
  product: ListingProduct, 
  account: string,
  marketplaceId: string = 'EBAY_US'
): Promise<PolicyInfo> {
  const accountName = account === 'green' || account === 'GREEN' || account === 'account2' ? 'green' : 'mjt'
  const price = getPrice(product)
  
  console.log(`🔍 ポリシー検索:`)
  console.log(`   アカウント: ${accountName}`)
  console.log(`   マーケットプレイス: ${marketplaceId}`)
  console.log(`   価格: ${price.toFixed(2)}`)
  
  // 🔥 listing_dataに12桁のeBayポリシーIDが直接指定されている場合
  const directPolicyId = product.listing_data?.shipping_policy_id?.toString() 
    || product.listing_data?.fulfillment_policy_id?.toString()
  
  if (directPolicyId && directPolicyId.length >= 12) {
    // 12桁以上なら実際のeBayポリシーID
    console.log(`   listing_data.shipping_policy_id: ${directPolicyId} (eBay形式)`)
    
    const { data: matchedPolicy, error: matchError } = await supabase
      .from('ebay_shipping_policies')
      .select('policy_id, payment_policy_id, return_policy_id, policy_name')
      .eq('policy_id', directPolicyId)
      .single()
    
    if (!matchError && matchedPolicy) {
      console.log(`✅ ポリシーマッチ: ${matchedPolicy.policy_name}`)
      return {
        fulfillmentPolicyId: matchedPolicy.policy_id,
        paymentPolicyId: matchedPolicy.payment_policy_id,
        returnPolicyId: matchedPolicy.return_policy_id
      }
    }
  } else if (directPolicyId) {
    console.log(`   listing_data.shipping_policy_id: ${directPolicyId} (内部ID形式 - 価格帯から自動選択)`)
  }
  
  // 🔥 価格帯に基づいてポリシーを自動選択
  console.log(`🔍 価格帯に基づくポリシー自動選択...`)
  
  // price_usdに基づいてweight_rangeをマッチ
  // DBの weight_range_min/max は価格帯を表している（例: RT01_P0050 = 0-50ドル）
  // 🔥 marketplace_id でフィルタリング（ハイブリッドAI監査パイプライン対応）
  let query = supabase
    .from('ebay_shipping_policies')
    .select('policy_id, policy_name, payment_policy_id, return_policy_id, weight_range_min, weight_range_max, marketplace_id')
    .eq('account_id', accountName)
    .eq('is_active', true)
    .not('weight_range_min', 'is', null)
    .not('weight_range_max', 'is', null)
  
  // marketplace_id カラムが存在する場合のみフィルタ（マイグレーション前の互換性）
  // 注: マイグレーション後は全レコードに marketplace_id が設定される
  query = query.or(`marketplace_id.eq.${marketplaceId},marketplace_id.is.null`)
  
  const { data: policies, error: policiesError } = await query
    .order('weight_range_max', { ascending: true })
  
  if (!policiesError && policies && policies.length > 0) {
    // 価格に合うポリシーを探す
    for (const policy of policies) {
      const min = policy.weight_range_min ?? 0
      const max = policy.weight_range_max ?? 999999
      
      if (price >= min && price < max) {
        console.log(`✅ 価格帯マッチ: ${policy.policy_name} (${min}-${max}ドル)`)
        console.log(`   配送ポリシーID: ${policy.policy_id}`)
        
        return {
          fulfillmentPolicyId: policy.policy_id,
          paymentPolicyId: policy.payment_policy_id,
          returnPolicyId: policy.return_policy_id
        }
      }
    }
    
    // マッチしない場合は最も高い価格帯のポリシーを使用
    const highestPolicy = policies[policies.length - 1]
    console.log(`⚠️ 価格帯外。最高価格帯ポリシーを使用: ${highestPolicy.policy_name}`)
    
    return {
      fulfillmentPolicyId: highestPolicy.policy_id,
      paymentPolicyId: highestPolicy.payment_policy_id,
      returnPolicyId: highestPolicy.return_policy_id
    }
  }
  
  // 🔥 フォールバック: デフォルトポリシー（weight_rangeがnullのもの）
  console.log(`🔍 フォールバック: デフォルトポリシー検索...`)
  
  // 🔥 marketplace_id でフィルタリング（ハイブリッドAI監査パイプライン対応）
  const { data: defaultPolicy, error: defaultError } = await supabase
    .from('ebay_shipping_policies')
    .select('policy_id, policy_name, payment_policy_id, return_policy_id, marketplace_id')
    .eq('account_id', accountName)
    .eq('is_active', true)
    .or(`marketplace_id.eq.${marketplaceId},marketplace_id.is.null`)
    .order('created_at', { ascending: true })
    .limit(1)
    .single()
  
  if (!defaultError && defaultPolicy) {
    console.log(`✅ デフォルトポリシー: ${defaultPolicy.policy_name}`)
    
    return {
      fulfillmentPolicyId: defaultPolicy.policy_id,
      paymentPolicyId: defaultPolicy.payment_policy_id,
      returnPolicyId: defaultPolicy.return_policy_id
    }
  }
  
  console.error('❌ ポリシー取得失敗')
  throw new Error('ポリシー情報が取得できません。ebay_shipping_policiesテーブルを確認してください。')
}

// ============================================
// eBay Condition Enumマッピング
// ============================================

function mapConditionEnum(condition: string): string {
  const conditionUpper = condition.trim().toUpperCase()
  const conditionLower = condition.trim().toLowerCase()
  
  const validEnums = [
    'NEW', 'NEW_WITH_TAGS', 'NEW_WITHOUT_TAGS', 'NEW_WITH_DEFECTS',
    'LIKE_NEW', 'USED_EXCELLENT', 'USED_VERY_GOOD', 'USED_GOOD', 'USED_ACCEPTABLE',
    'FOR_PARTS_OR_NOT_WORKING', 'CERTIFIED_REFURBISHED', 'EXCELLENT_REFURBISHED',
    'VERY_GOOD_REFURBISHED', 'GOOD_REFURBISHED', 'SELLER_REFURBISHED'
  ]
  
  if (validEnums.includes(conditionUpper)) {
    return conditionUpper
  }
  
  const conditionMap: Record<string, string> = {
    'new': 'NEW',
    'brand new': 'NEW',
    '新品': 'NEW',
    'used': 'USED_EXCELLENT',
    '中古': 'USED_EXCELLENT',
    'like new': 'LIKE_NEW',
    'excellent': 'USED_EXCELLENT',
    'very good': 'USED_VERY_GOOD',
    'good': 'USED_GOOD',
    'acceptable': 'USED_ACCEPTABLE',
    'ungraded': 'USED_EXCELLENT',
    'near mint': 'USED_EXCELLENT',
    'nm': 'USED_EXCELLENT',
    'lp': 'USED_VERY_GOOD',
    'mp': 'USED_GOOD',
    'hp': 'USED_ACCEPTABLE'
  }
  
  const mapped = conditionMap[conditionLower]
  
  if (mapped) {
    console.log(`📋 [Condition] マッピング: "${condition}" → ${mapped}`)
    return mapped
  }
  
  console.warn(`⚠️ [Condition] 不明な値 → USED_EXCELLENTにフォールバック`)
  return 'USED_EXCELLENT'
}

// ============================================
// eBay API呼び出し関数
// ============================================

/**
 * eBayに商品を出品（メイン関数）
 */
export async function listProductToEbay(
  product: ListingProduct,
  account: string
): Promise<ListingResult> {
  try {
    console.log(`\n========================================`)
    console.log(`🚀 eBay出品開始: SKU=${product.sku}`)
    console.log(`========================================`)
    
    const imageUrls = getImageUrls(product)
    if (imageUrls.length === 0) {
      return {
        success: false,
        error: '画像がありません。出品には少なくとも1枚の画像が必要です。'
      }
    }
    console.log(`📸 画像: ${imageUrls.length}枚`)
    
    const accountKey = account === 'green' || account === 'GREEN' ? 'account2' : 'account1'
    const accessToken = await getAccessToken(accountKey as 'account1' | 'account2')
    console.log(`🔑 アクセストークン取得完了`)
    
    const policies = await getPolicies(product, account)
    console.log(`📋 ポリシー取得完了`)
    
    // Step 1: Inventory Item
    const inventoryResult = await createOrUpdateInventoryItem(product, imageUrls, accessToken)
    if (!inventoryResult.success) {
      return inventoryResult
    }
    
    // Step 2: Offer
    const offerResult = await createOffer(product, policies, accessToken, account)
    if (!offerResult.success) {
      return offerResult
    }
    
    // Step 3: Publish
    const publishResult = await publishOffer(offerResult.offerId!, accessToken)
    
    if (publishResult.success) {
      console.log(`\n✅✅✅ 出品完了！ ✅✅✅`)
      console.log(`ListingID: ${publishResult.listingId}`)
      console.log(`URL: https://www.ebay.com/itm/${publishResult.listingId}`)
      
      // 🔥 Step 4: 広告を自動適用（2%）
      if (publishResult.listingId) {
        await applyPromotedListing(publishResult.listingId, account, 2.0)
      }
    }
    
    return publishResult
    
  } catch (error: any) {
    console.error('❌ eBay出品エラー:', JSON.stringify(error, null, 2))
    return {
      success: false,
      error: error.message || '出品に失敗しました',
      details: error
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
  
  const title = getTitle(product)
  const condition = getCondition(product)
  const aspects = getItemSpecifics(product)
  // 🔥 Inventory Itemは4000文字制限があるのでシンプルな説明を使用
  const description = getShortDescription(product)
  const packageInfo = getPackageInfo(product)
  const categoryId = getCategoryId(product)
  
  // 🔥 トレーディングカードカテゴリの判定
  const tradingCardCategories = ['183454', '183456', '261328', '183453', '183050', '2536', '2613', '261323']
  const isTradingCard = tradingCardCategories.includes(categoryId)
  
  // 🔥 Condition Descriptors 取得（2024年必須）
  const conditionDescriptors = product.listing_data?.condition_descriptors || null
  const conditionId = product.listing_data?.condition_id || (isTradingCard ? 4000 : 3000)
  
  // 🔥 トレーディングカードカテゴリではCondition Descriptorsを必ず含める
  let inventoryItem: any = {
    availability: {
      shipToLocationAvailability: {
        quantity: getQuantity(product)
      }
    },
    product: {
      title: title,
      description: description,
      imageUrls: imageUrls.slice(0, 12),
      aspects: aspects
    },
    packageWeightAndSize: packageInfo
  }
  
  // 🔥 トレーディングカード以外のカテゴリではConditionを設定
  if (!isTradingCard) {
    const conditionEnum = mapConditionEnum(condition)
    inventoryItem.condition = conditionEnum
    inventoryItem.conditionDescription = condition
    console.log(`📋 [Condition] 通常カテゴリ: ${condition} → ${conditionEnum}`)
  } else {
    // 🔥 トレーディングカードカテゴリ: Condition Descriptors必須
    console.log(`🎴 [Condition] トレーディングカードカテゴリ検出`)
    console.log(`   conditionId: ${conditionId}`)
    console.log(`   conditionDescriptors: ${JSON.stringify(conditionDescriptors)}`)
    
    // conditionId と conditionDescriptors を設定
    // eBay Inventory APIではトレカの場合 condition フィールドではなく
    // conditionDescriptors でカード状態を指定する
    
    // Card Condition が設定されていることを確認
    if (!aspects['Card Condition']) {
      aspects['Card Condition'] = ['Ungraded']
      console.log(`📋 [Aspects] Card Condition追加: Ungraded`)
    }
    
    // Graded/Ungraded の判定
    if (!aspects['Graded']) {
      aspects['Graded'] = ['No']
    }
  }
  
  console.log(`\n📦 Step 1: Inventory Item作成`)
  console.log(`  SKU: ${sku}`)
  console.log(`  タイトル: ${title}`)
  console.log(`  カテゴリ: ${categoryId} (${isTradingCard ? 'トレーディングカード' : '通常'})`)
  console.log(`  Item Specifics: ${Object.keys(aspects).length}項目`)
  console.log(`  画像: ${imageUrls.length}枚`)
  console.log(`  説明文: ${description.length}文字`)
  
  const response = await fetch(
    `${EBAY_API_BASE}/sell/inventory/v1/inventory_item/${encodeURIComponent(sku)}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Language': 'en-US',
        'Accept-Language': 'en-US'
      },
      body: JSON.stringify(inventoryItem)
    }
  )
  
  if (response.status === 204 || response.ok) {
    console.log(`  ✅ Inventory Item作成成功`)
    return { success: true }
  }
  
  const error = await response.json()
  console.error('  ❌ Inventory Item作成エラー:', JSON.stringify(error, null, 2))
  return {
    success: false,
    error: `Inventory Item作成失敗: ${error.errors?.[0]?.message || response.statusText}`,
    details: error
  }
}

/**
 * Step 2: Offer作成
 */
async function createOffer(
  product: ListingProduct,
  policies: PolicyInfo,
  accessToken: string,
  account: string = 'mjt'
): Promise<ListingResult> {
  const categoryId = getCategoryId(product)
  const price = getPrice(product)
  const merchantLocationKey = await getMerchantLocationKey(account)
  const description = getDescription(product)
  
  // 🔥 トレーディングカードカテゴリの判定
  const tradingCardCategories = ['183454', '183456', '261328', '183453', '183050', '2536', '2613', '261323']
  const isTradingCard = tradingCardCategories.includes(categoryId)
  
  // 🔥 Condition Descriptors 取得（2024年必須）
  const conditionDescriptors = product.listing_data?.condition_descriptors || null
  const conditionId = product.listing_data?.condition_id || (isTradingCard ? 4000 : 3000)
  
  // 🔥 基本のOfferデータ
  const offer: any = {
    sku: product.sku,
    marketplaceId: 'EBAY_US',
    format: 'FIXED_PRICE',
    availableQuantity: getQuantity(product),
    categoryId: categoryId,
    listingDescription: description,
    listingPolicies: {
      fulfillmentPolicyId: policies.fulfillmentPolicyId,
      paymentPolicyId: policies.paymentPolicyId,
      returnPolicyId: policies.returnPolicyId
    },
    pricingSummary: {
      price: {
        currency: 'USD',
        value: price.toFixed(2)
      }
    },
    merchantLocationKey: merchantLocationKey
  }
  
  // 🔥 トレーディングカードカテゴリの場合: conditionId と conditionDescriptors を追加
  if (isTradingCard) {
    // 🔥 2024年必須: conditionId=4000 (Ungraded) + conditionDescriptors
    offer.conditionId = conditionId
    
    if (conditionDescriptors && Array.isArray(conditionDescriptors) && conditionDescriptors.length > 0) {
      offer.conditionDescriptors = conditionDescriptors
      console.log(`🎴 [Offer] conditionDescriptors設定: ${JSON.stringify(conditionDescriptors)}`)
    } else {
      // デフォルト: Near Mint/Mint (400014)
      offer.conditionDescriptors = [
        { name: '40001', values: ['400014'] }  // Near Mint/Mint
      ]
      console.log(`🎴 [Offer] デフォルトconditionDescriptors適用: Near Mint/Mint`)
    }
    
    console.log(`🎴 [Offer] トレーディングカードカテゴリ検出:`)
    console.log(`   conditionId: ${offer.conditionId}`)
    console.log(`   conditionDescriptors: ${JSON.stringify(offer.conditionDescriptors)}`)
  }
  
  console.log(`\n📋 Step 2: Offer作成`)
  console.log(`  カテゴリID: ${categoryId}`)
  console.log(`  価格: $${price.toFixed(2)}`)
  console.log(`  配送ポリシー: ${policies.fulfillmentPolicyId}`)
  console.log(`  支払いポリシー: ${policies.paymentPolicyId}`)
  console.log(`  返品ポリシー: ${policies.returnPolicyId}`)
  console.log(`  説明文: ${description.length}文字`)
  
  const response = await fetch(
    `${EBAY_API_BASE}/sell/inventory/v1/offer`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Language': 'en-US',
        'Accept-Language': 'en-US'
      },
      body: JSON.stringify(offer)
    }
  )
  
  if (!response.ok) {
    const error = await response.json()
    console.error('  ❌ Offer作成エラー:', JSON.stringify(error, null, 2))
    
    const errorId = error.errors?.[0]?.errorId
    const errorMessage = error.errors?.[0]?.message || response.statusText
    let userFriendlyError = `Offer作成失敗: ${errorMessage}`
    let errorType = 'UNKNOWN'
    
    if (errorId === 25002 || (errorMessage.includes('SKU') && errorMessage.includes('already'))) {
      errorType = 'DUPLICATE_OFFER'
      userFriendlyError = `このSKUは既に出品中です。`
    }
    
    if (errorId === 25016 || errorId === 25006) {
      errorType = 'SELLING_LIMIT'
      userFriendlyError = `出品枚数/金額の上限に達しました。`
    }
    
    if (errorMessage.toLowerCase().includes('location')) {
      errorType = 'LOCATION_NOT_FOUND'
      userFriendlyError = `発送元住所（Location）が未登録です。`
    }
    
    if (errorMessage.toLowerCase().includes('policy')) {
      errorType = 'POLICY_ERROR'
      userFriendlyError = `ビジネスポリシーに問題があります。`
    }
    
    return {
      success: false,
      error: userFriendlyError,
      details: { ...error, errorType, originalMessage: errorMessage }
    }
  }
  
  const result = await response.json()
  console.log(`  ✅ Offer作成成功: offerId=${result.offerId}`)
  
  return {
    success: true,
    offerId: result.offerId
  }
}

/**
 * Step 2.5: Offer更新（Update-before-Publish用）
 */
async function updateOffer(
  offerId: string,
  product: ListingProduct,
  policies: PolicyInfo,
  accessToken: string,
  account: string
): Promise<{ success: boolean; error?: string }> {
  console.log(`\n🔄 Offer更新: offerId=${offerId}`)
  
  const categoryId = getCategoryId(product)
  const price = getPrice(product)
  const merchantLocationKey = await getMerchantLocationKey(account)
  const description = getDescription(product)
  
  const offerData = {
    availableQuantity: getQuantity(product),
    categoryId: categoryId,
    listingDescription: description,
    listingPolicies: {
      fulfillmentPolicyId: policies.fulfillmentPolicyId,
      paymentPolicyId: policies.paymentPolicyId,
      returnPolicyId: policies.returnPolicyId
    },
    pricingSummary: {
      price: {
        currency: 'USD',
        value: price.toFixed(2)
      }
    },
    merchantLocationKey: merchantLocationKey
  }
  
  console.log(`  📋 更新データ:`)
  console.log(`    カテゴリID: ${categoryId}`)
  console.log(`    価格: $${price.toFixed(2)}`)
  console.log(`    配送ポリシー: ${policies.fulfillmentPolicyId}`)
  console.log(`    支払いポリシー: ${policies.paymentPolicyId}`)
  console.log(`    返品ポリシー: ${policies.returnPolicyId}`)
  console.log(`    説明文: ${description.length}文字`)
  
  const response = await fetch(
    `${EBAY_API_BASE}/sell/inventory/v1/offer/${offerId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Language': 'en-US',
        'Accept-Language': 'en-US'
      },
      body: JSON.stringify(offerData)
    }
  )
  
  if (response.status === 204 || response.ok) {
    console.log(`  ✅ Offer更新成功`)
    return { success: true }
  }
  
  const error = await response.json()
  console.error('  ❌ Offer更新エラー:', JSON.stringify(error, null, 2))
  return {
    success: false,
    error: error.errors?.[0]?.message || 'Offer更新失敗'
  }
}

/**
 * Step 3: Offer公開（出品）
 */
async function publishOffer(
  offerId: string,
  accessToken: string
): Promise<ListingResult> {
  console.log(`\n🚀 Step 3: Offer公開`)
  console.log(`  OfferID: ${offerId}`)
  
  const response = await fetch(
    `${EBAY_API_BASE}/sell/inventory/v1/offer/${offerId}/publish`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Language': 'en-US',
        'Accept-Language': 'en-US'
      }
    }
  )
  
  if (!response.ok) {
    const error = await response.json()
    console.error('  ❌ Offer公開エラー:', JSON.stringify(error, null, 2))
    
    const errorMessage = error.errors?.[0]?.message || response.statusText
    let userFriendlyError = `出品公開失敗: ${errorMessage}`
    let errorType = 'UNKNOWN'
    
    if (errorMessage.toLowerCase().includes('limit') || errorMessage.toLowerCase().includes('quota')) {
      errorType = 'SELLING_LIMIT'
      userFriendlyError = `出品枚数/金額の上限に達しました。`
    }
    
    if (errorMessage.toLowerCase().includes('aspect') || errorMessage.toLowerCase().includes('specifics')) {
      errorType = 'MISSING_ASPECTS'
      userFriendlyError = `必須のItem Specificsが不足しています。詳細: ${errorMessage}`
    }
    
    if (errorMessage.toLowerCase().includes('return') || errorMessage.toLowerCase().includes('policy')) {
      errorType = 'POLICY_ERROR'
      userFriendlyError = `ポリシー設定に問題があります。`
    }
    
    return {
      success: false,
      error: userFriendlyError,
      details: { ...error, errorType, originalMessage: errorMessage }
    }
  }
  
  const result = await response.json()
  console.log(`  ✅ 出品公開成功: listingId=${result.listingId}`)
  
  return {
    success: true,
    listingId: result.listingId,
    offerId: offerId
  }
}

// ============================================
// 🔥 広告自動適用機能
// ============================================

/**
 * Promoted Listings Standard を適用（2%広告）
 */
async function applyPromotedListing(
  listingId: string,
  account: string,
  adRate: number = 2.0
): Promise<{ success: boolean; error?: string }> {
  console.log(`\n📢 Step 4: 広告設定 (Promoted Listings Standard)`)
  console.log(`  ListingID: ${listingId}`)
  console.log(`  広告レート: ${adRate}%`)
  
  try {
    const accountKey = account === 'green' || account === 'GREEN' ? 'account2' : 'account1'
    const accessToken = await getAccessToken(accountKey as 'account1' | 'account2')
    
    // Marketing APIで広告キャンペーンにアイテムを追加
    // まず既存のStandardキャンペーンを取得
    const campaignsResponse = await fetch(
      `${EBAY_API_BASE}/sell/marketing/v1/ad_campaign?campaign_status=RUNNING&campaign_type=COST_PER_SALE`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'en-US'
        }
      }
    )
    
    if (!campaignsResponse.ok) {
      const error = await campaignsResponse.json()
      console.warn(`⚠️ キャンペーン取得エラー:`, JSON.stringify(error, null, 2))
      return { success: false, error: 'キャンペーン取得失敗' }
    }
    
    const campaignsData = await campaignsResponse.json()
    const campaigns = campaignsData.campaigns || []
    
    if (campaigns.length === 0) {
      console.warn(`⚠️ 実行中の広告キャンペーンがありません。手動で作成してください。`)
      return { success: false, error: '実行中のキャンペーンがありません' }
    }
    
    // 最初のキャンペーンを使用
    const campaign = campaigns[0]
    const campaignId = campaign.campaignId
    
    console.log(`  キャンペーンID: ${campaignId} (${campaign.campaignName})`)
    
    // アイテムをキャンペーンに追加
    const adResponse = await fetch(
      `${EBAY_API_BASE}/sell/marketing/v1/ad_campaign/${campaignId}/ad`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'en-US'
        },
        body: JSON.stringify({
          listingId: listingId,
          bidPercentage: adRate.toString()
        })
      }
    )
    
    if (adResponse.status === 201 || adResponse.ok) {
      console.log(`  ✅ 広告設定成功: ${adRate}%`)
      return { success: true }
    }
    
    const adError = await adResponse.json()
    console.warn(`⚠️ 広告設定エラー:`, JSON.stringify(adError, null, 2))
    return { success: false, error: adError.errors?.[0]?.message || '広告設定失敗' }
    
  } catch (error: any) {
    console.warn(`⚠️ 広告設定例外:`, error.message)
    return { success: false, error: error.message }
  }
}

// ============================================
// ユーティリティ関数
// ============================================

/**
 * 在庫数更新
 */
export async function updateInventoryQuantity(
  sku: string,
  quantity: number,
  account: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const accountKey = account === 'green' || account === 'GREEN' ? 'account2' : 'account1'
    const accessToken = await getAccessToken(accountKey as 'account1' | 'account2')
    
    const response = await fetch(
      `${EBAY_API_BASE}/sell/inventory/v1/inventory_item/${encodeURIComponent(sku)}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Content-Language': 'en-US',
          'Accept-Language': 'en-US'
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
    
    if (response.status === 204 || response.ok) {
      return { success: true }
    }
    
    const error = await response.json()
    return {
      success: false,
      error: error.errors?.[0]?.message || '在庫更新失敗'
    }
    
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * SKUの既存Offerを取得
 */
export async function getExistingOffer(
  sku: string,
  account: string
): Promise<{ exists: boolean; offerId?: string; listingId?: string; status?: string }> {
  try {
    const accountKey = account === 'green' || account === 'GREEN' ? 'account2' : 'account1'
    const accessToken = await getAccessToken(accountKey as 'account1' | 'account2')
    
    const response = await fetch(
      `${EBAY_API_BASE}/sell/inventory/v1/offer?sku=${encodeURIComponent(sku)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Content-Language': 'en-US',
          'Accept-Language': 'en-US'
        }
      }
    )
    
    if (!response.ok) {
      return { exists: false }
    }
    
    const data = await response.json()
    
    if (data.offers && data.offers.length > 0) {
      const offer = data.offers[0]
      console.log(`🔍 [Offer確認] SKU=${sku}: offerId=${offer.offerId}, status=${offer.status}`)
      return {
        exists: true,
        offerId: offer.offerId,
        listingId: offer.listing?.listingId,
        status: offer.status
      }
    }
    
    return { exists: false }
    
  } catch (error: any) {
    console.warn(`⚠️ [Offer確認] エラー: ${error.message}`)
    return { exists: false }
  }
}

/**
 * スマート出品（Update-before-Publish対応版）
 */
export async function smartListProduct(
  product: ListingProduct,
  account: string
): Promise<ListingResult> {
  console.log(`\n🧠 スマート出品開始: SKU=${product.sku}`)
  
  const existing = await getExistingOffer(product.sku, account)
  
  if (existing.exists && existing.offerId) {
    console.log(`ℹ️ 既存出品を検出: offerId=${existing.offerId}, status=${existing.status}`)
    
    const accountKey = account === 'green' || account === 'GREEN' ? 'account2' : 'account1'
    const accessToken = await getAccessToken(accountKey as 'account1' | 'account2')
    const policies = await getPolicies(product, account)
    
    if (existing.status === 'PUBLISHED') {
      console.log(`✅ 既に出品中。更新を実行します。`)
      
      // Inventory Item更新
      const imageUrls = getImageUrls(product)
      if (imageUrls.length > 0) {
        await createOrUpdateInventoryItem(product, imageUrls, accessToken)
      }
      
      // Offer更新
      await updateOffer(existing.offerId, product, policies, accessToken, account)
      
      // 🔥 広告も適用（既存出品にも適用）
      if (existing.listingId) {
        await applyPromotedListing(existing.listingId, account, 2.0)
      }
      
      return {
        success: true,
        listingId: existing.listingId,
        offerId: existing.offerId,
        details: { action: 'UPDATED', message: '既存出品を更新しました' }
      }
    }
    
    if (existing.status === 'UNPUBLISHED') {
      console.log(`\n🔄 未公開のOfferを検出。Update-before-Publish を実行します。`)
      
      // Step 1: Inventory Item更新
      const imageUrls = getImageUrls(product)
      if (imageUrls.length > 0) {
        const inventoryResult = await createOrUpdateInventoryItem(product, imageUrls, accessToken)
        if (!inventoryResult.success) {
          console.warn(`⚠️ Inventory Item更新失敗（続行）: ${inventoryResult.error}`)
        }
      }
      
      // Step 2: Offer更新
      const updateResult = await updateOffer(existing.offerId, product, policies, accessToken, account)
      if (!updateResult.success) {
        console.error(`❌ Offer更新失敗: ${updateResult.error}`)
      }
      
      // Step 3: Publish
      console.log(`\n🚀 Offer公開を試みます...`)
      const publishResult = await publishOffer(existing.offerId, accessToken)
      
      // Step 4: 広告適用
      if (publishResult.success && publishResult.listingId) {
        await applyPromotedListing(publishResult.listingId, account, 2.0)
      }
      
      return publishResult
    }
  }
  
  console.log(`ℹ️ 既存出品なし。新規出品を実行します。`)
  return listProductToEbay(product, account)
}

/**
 * 価格のみ更新
 */
async function updateOfferPriceOnly(
  offerId: string,
  price: number,
  account: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const accountKey = account === 'green' || account === 'GREEN' ? 'account2' : 'account1'
    const accessToken = await getAccessToken(accountKey as 'account1' | 'account2')
    
    const response = await fetch(
      `${EBAY_API_BASE}/sell/inventory/v1/offer/${offerId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Content-Language': 'en-US',
          'Accept-Language': 'en-US'
        },
        body: JSON.stringify({
          pricingSummary: {
            price: {
              currency: 'USD',
              value: price.toFixed(2)
            }
          }
        })
      }
    )
    
    if (response.ok || response.status === 204) {
      return { success: true }
    }
    
    const error = await response.json()
    return {
      success: false,
      error: error.errors?.[0]?.message || '価格更新失敗'
    }
    
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 価格更新（エクスポート用）
 */
export async function updateOfferPrice(
  offerId: string,
  price: number,
  account: string
): Promise<{ success: boolean; error?: string }> {
  return updateOfferPriceOnly(offerId, price, account)
}
