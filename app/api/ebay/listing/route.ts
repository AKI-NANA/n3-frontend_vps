/**
 * eBay 出品 API エンドポイント (Smart Listing対応版)
 * products_masterテーブルからeBayへの出品を処理
 * 
 * v2.1 機能:
 * - 重複Offer自動検出・回避
 * - 既存Offerの更新・再公開
 * - 詳細なエラーメッセージ
 * - 出品ログ記録
 * - 🔥 HTMLテンプレートからの動的生成
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { listProductToEbay, getExistingOffer, smartListProduct } from '@/lib/ebay/inventory'

// Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ============================================
// 🔥 コンディションマッピング取得
// ============================================

interface ConditionMapping {
  condition_enum: string;
  condition_id: number;
  condition_descriptors: any[] | null;
}

/**
 * ebay_condition_mappingテーブルからコンディション情報を取得
 * 
 * @param categoryId - eBayカテゴリID
 * @param conditionName - コンディション名（Near Mint, Excellent, Used等）
 * @returns マッピング情報 or null
 */
async function getConditionMapping(
  categoryId: string,
  conditionName: string
): Promise<ConditionMapping | null> {
  try {
    console.log(`\n🔍 [ConditionMapping] 検索: category=${categoryId}, condition=${conditionName}`)
    
    // 1. カテゴリ固有のマッピングを検索
    const { data: specificMapping, error: specificError } = await supabase
      .from('ebay_condition_mapping')
      .select('condition_enum, condition_id, condition_descriptors')
      .contains('category_ids', [categoryId])
      .or(`condition_name.eq.${conditionName},is_default.eq.true`)
      .order('is_default', { ascending: true })  // 明示的な一致を優先
      .limit(1)
      .maybeSingle()
    
    if (!specificError && specificMapping) {
      console.log(`✅ [ConditionMapping] カテゴリ固有マッピング発見`)
      return specificMapping
    }
    
    // 2. 一般カテゴリ（'*'）のマッピングを検索
    const { data: generalMapping, error: generalError } = await supabase
      .from('ebay_condition_mapping')
      .select('condition_enum, condition_id, condition_descriptors')
      .contains('category_ids', ['*'])
      .or(`condition_name.ilike.%${conditionName}%,is_default.eq.true`)
      .order('is_default', { ascending: true })
      .limit(1)
      .maybeSingle()
    
    if (!generalError && generalMapping) {
      console.log(`✅ [ConditionMapping] 一般マッピング発見`)
      return generalMapping
    }
    
    console.log(`⚠️ [ConditionMapping] マッピングが見つかりません`)
    return null
    
  } catch (e: any) {
    console.error(`❌ [ConditionMapping] エラー: ${e.message}`)
    return null
  }
}

// エラーメッセージのユーザーフレンドリー化
function formatErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  
  if (error && typeof error === 'object') {
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors.map((e: any) => e.message || e.longMessage || JSON.stringify(e)).join('; ');
    }
    if (error.message) return error.message;
    if (error.error) return typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
    if (error.details) return typeof error.details === 'string' ? error.details : JSON.stringify(error.details);
    if (error.originalMessage) return error.originalMessage;
    
    try {
      return JSON.stringify(error, null, 2);
    } catch {
      return String(error);
    }
  }
  
  return String(error);
}

// 出品ログを記録
async function logListingAction(data: {
  sku: string;
  productId: number;
  account: string;
  action: 'create' | 'update' | 'publish' | 'retry' | 'error';
  status: 'success' | 'warning' | 'error';
  message: string;
  ebayResponse?: any;
}) {
  try {
    await supabase.from('ebay_listing_logs').insert({
      sku: data.sku,
      product_id: data.productId,
      account: data.account,
      action: data.action,
      status: data.status,
      message: data.message,
      ebay_response: data.ebayResponse || null,
      created_at: new Date().toISOString()
    });
  } catch (e) {
    console.warn('[Listing Log] ログ記録スキップ（テーブル未作成）');
  }
}

// ============================================
// 🔥 HTMLテンプレート生成機能
// ============================================

/**
 * 🔥 商品のeBay用HTMLを取得または生成
 * 
 * 優先順位:
 * 1. products_master.generated_html（キャッシュ）
 * 2. html_templatesから生成 → generated_htmlに保存
 * 3. listing_data.html_description（フォールバック）
 */
async function getOrGenerateHtml(
  product: any,
  listingData: any,
  marketplace: string = 'ebay_us'
): Promise<string> {
  const productId = product.id
  const sku = product.sku
  
  console.log(`\n🔍 [HTML] 商品HTML取得/生成開始: ID=${productId}, SKU=${sku}`)
  
  // ========================================
  // 1. 🔥 products_master.generated_html から取得（最優先）
  // ========================================
  if (product.generated_html && product.generated_html.trim() !== '') {
    console.log(`✅ [HTML] generated_htmlカラムから取得: ${product.generated_html.length}文字`)
    return product.generated_html
  }
  
  console.log(`ℹ️ [HTML] generated_htmlなし → テンプレートから生成`)
  
  // ========================================
  // 2. html_templates からテンプレートを取得して生成
  // ========================================
  try {
    // eBay USテンプレートを取得（ID=1）
    const { data: template, error: templateError } = await supabase
      .from('html_templates')
      .select('id, name, html_content')
      .eq('mall_type', 'ebay')
      .eq('country_code', 'US')
      .limit(1)
      .single()
    
    if (!templateError && template?.html_content) {
      console.log(`✅ [HTML] テンプレート取得: ${template.name} (${template.html_content.length}文字)`)
      
      // テンプレートに商品データをマージ
      const generatedHtml = mergeTemplateWithProduct(template.html_content, product, listingData)
      console.log(`✅ [HTML] マージ完了: ${generatedHtml.length}文字`)
      
      // 🔥 生成したHTMLをproducts_master.generated_htmlに保存
      await saveGeneratedHtmlToProduct(productId, generatedHtml)
      
      return generatedHtml
    }
    
    console.warn(`⚠️ [HTML] テンプレートが見つかりません`)
  } catch (e: any) {
    console.warn(`⚠️ [HTML] テンプレート取得エラー: ${e.message}`)
  }
  
  // ========================================
  // 3. listing_data.html_description を使用（フォールバック）
  // ========================================
  const fallbackHtml = listingData?.html_description
  if (fallbackHtml && fallbackHtml.trim() !== '') {
    console.log(`⚠️ [HTML] フォールバック: listing_data.html_description (${fallbackHtml.length}文字)`)
    return fallbackHtml
  }
  
  // ========================================
  // 4. 最終フォールバック
  // ========================================
  console.warn(`⚠️ [HTML] 最終フォールバック: シンプルHTML`)
  const title = product.english_title || product.title_en || product.title || 'Product'
  return `<div style="font-family: Arial, sans-serif; padding: 20px;">
    <h1>${escapeHtml(title)}</h1>
    <p>Authentic product from Japan. Ships worldwide with tracking.</p>
  </div>`
}

/**
 * テンプレートに商品データをマージ
 */
function mergeTemplateWithProduct(template: string, product: any, listingData: any): string {
  let html = template
  
  // 基本情報
  const title = product.english_title || product.title_en || product.title || ''
  const description = product.description_en || product.description || ''
  const sku = product.sku || ''
  const price = listingData?.ddp_price_usd || 0
  const condition = listingData?.condition_en || 
                    listingData?.condition || 
                    product.condition_name ||
                    product.english_condition ||
                    'Used'
  
  // Item Specifics
  const itemSpecifics = listingData?.item_specifics || {}
  
  // Specificationsを生成（Item Specificsをテーブル形式で）
  let specificationsHtml = ''
  if (Object.keys(itemSpecifics).length > 0) {
    specificationsHtml = '<table style="width:100%; border-collapse: collapse;">'
    for (const [key, value] of Object.entries(itemSpecifics)) {
      if (value && value.toString().trim() !== '') {
        specificationsHtml += `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${escapeHtml(key)}</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(value.toString())}</td></tr>`
      }
    }
    specificationsHtml += '</table>'
  }
  
  // Featuresを生成
  let featuresHtml = ''
  const features = [
    'Authentic product from Japan',
    'Ships worldwide with tracking',
    'Secure packaging',
    'Fast processing within 1-2 business days'
  ]
  featuresHtml = '<ul>' + features.map(f => `<li>${f}</li>`).join('') + '</ul>'
  
  // Shipping Infoを生成
  const shippingInfo = `
    <p><strong>Shipping Method:</strong> International Priority Mail</p>
    <p><strong>Processing Time:</strong> 1-2 business days</p>
    <p><strong>Estimated Delivery:</strong> 7-14 business days (varies by destination)</p>
    <p><strong>Tracking:</strong> Full tracking provided</p>
  `
  
  // プレースホルダー置換マップ
  const replacements: Record<string, string> = {
    '{{TITLE}}': escapeHtml(title),
    '{{SKU}}': escapeHtml(sku),
    '{{PRICE}}': price.toFixed(2),
    '{{CONDITION}}': escapeHtml(condition),
    '{{DESCRIPTION}}': escapeHtml(description) || 'Please see product specifications below.',
    '{{BRAND}}': escapeHtml(itemSpecifics['Brand'] || 'N/A'),
    '{{SPECIFICATIONS}}': specificationsHtml,
    '{{FEATURES}}': featuresHtml,
    '{{SHIPPING_INFO}}': shippingInfo,
    '{{SERIAL_NUMBER}}': escapeHtml(product.serial_number || 'N/A'),
    '{{NOTES}}': escapeHtml(listingData?.notes || product.notes || ''),
  }
  
  // 置換実行
  for (const [placeholder, value] of Object.entries(replacements)) {
    html = html.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value)
  }
  
  // 未置換のプレースホルダーを空文字に
  html = html.replace(/\{\{[A-Z_]+\}\}/g, '')
  
  return html
}

/**
 * 🔥 生成したHTMLをproducts_master.generated_htmlに保存
 */
async function saveGeneratedHtmlToProduct(
  productId: number,
  generatedHtml: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products_master')
      .update({
        generated_html: generatedHtml,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
    
    if (error) {
      console.error('❌ [HTML] generated_html保存エラー:', error)
      return false
    }
    
    console.log(`✅ [HTML] generated_html保存完了: ID=${productId}`)
    return true
  } catch (e: any) {
    console.error('❌ [HTML] 保存例外:', e.message)
    return false
  }
}

/**
 * HTMLエスケープ
 */
function escapeHtml(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * 生成したHTMLをDBに保存
 */
async function saveGeneratedHtml(
  productId: number,
  sku: string,
  marketplace: string,
  templateId: number,
  templateName: string,
  generatedHtml: string
): Promise<boolean> {
  try {
    // まず既存レコードを確認
    const { data: existing } = await supabase
      .from('product_html_generated')
      .select('id')
      .eq('products_master_id', productId)
      .maybeSingle()
    
    if (existing) {
      // 更新
      const { error } = await supabase
        .from('product_html_generated')
        .update({
          sku: sku,
          marketplace: marketplace,
          template_id: templateId,
          template_name: templateName,
          generated_html: generatedHtml,
          updated_at: new Date().toISOString()
        })
        .eq('products_master_id', productId)
      
      if (error) {
        console.error('❌ [HTML] 更新エラー:', error)
        return false
      }
      console.log(`✅ [HTML] 更新完了: products_master_id=${productId}`)
    } else {
      // 新規作成
      // 注意: product_idはuuid型でNOT NULLなので、uuidを生成する
      const { error } = await supabase
        .from('product_html_generated')
        .insert({
          product_id: crypto.randomUUID(),  // uuidを生成
          products_master_id: productId,
          sku: sku,
          marketplace: marketplace,
          template_id: templateId,
          template_name: templateName,
          generated_html: generatedHtml,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (error) {
        console.error('❌ [HTML] 挿入エラー:', error)
        return false
      }
      console.log(`✅ [HTML] 新規保存完了: products_master_id=${productId}`)
    }
    
    return true
  } catch (e: any) {
    console.error('❌ [HTML] 保存例外:', e.message)
    return false
  }
}

// ============================================
// メインAPI
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, account = 'mjt', useSmartListing = true } = body

    console.log(`\n========================================`)
    console.log(`📤 eBay出品API呼び出し (Smart Listing: ${useSmartListing})`)
    console.log(`  productId: ${productId}`)
    console.log(`  account: ${account}`)
    console.log(`========================================`)

    if (!productId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'productIdは必須です',
          errorType: 'VALIDATION_ERROR'
        },
        { status: 400 }
      )
    }

    // products_masterから商品データを取得（全カラム）
    const { data: product, error: fetchError } = await supabase
      .from('products_master')
      .select('*')
      .eq('id', productId)
      .single()

    if (fetchError || !product) {
      console.error('❌ 商品取得エラー:', fetchError)
      return NextResponse.json(
        { 
          success: false,
          error: '商品が見つかりません',
          errorType: 'NOT_FOUND',
          details: fetchError?.message
        },
        { status: 404 }
      )
    }

    console.log(`✅ 商品取得成功: SKU=${product.sku}`)

    // listing_dataの存在チェック
    if (!product.listing_data) {
      console.error('❌ listing_dataがありません')
      return NextResponse.json(
        { 
          success: false,
          error: 'listing_dataがありません。先に計算処理を実行してください。',
          errorType: 'MISSING_DATA'
        },
        { status: 400 }
      )
    }

    const listingData = product.listing_data as any

    // ========================================
    // 🔥 カテゴリ別コンディション動的取得（2024年仕様対応）
    // ========================================
    const ebayData = product.ebay_api_data as any || {}
    const categoryId = product.ebay_category_id || 
                       ebayData?.category_id || 
                       listingData.ebay_category_id
    
    // トレカカテゴリ判定
    const tradingCardCategories = ['183454', '183050', '261328']
    const isTradingCard = tradingCardCategories.includes(categoryId)
    
    console.log(`\n📋 [Condition] カテゴリ: ${categoryId}, トレカ: ${isTradingCard}`)
    
    // コンディションマッピングテーブルから取得
    const conditionMapping = await getConditionMapping(
      categoryId,
      listingData.condition_en || listingData.condition || product.condition_name || 'Near Mint'
    )
    
    if (conditionMapping) {
      // マッピングが見つかった場合
      listingData.condition = conditionMapping.condition_enum
      listingData.condition_id = conditionMapping.condition_id
      listingData.condition_descriptors = conditionMapping.condition_descriptors
      
      console.log(`✅ [Condition] マッピング適用:`)
      console.log(`  - condition: ${listingData.condition}`)
      console.log(`  - condition_id: ${listingData.condition_id}`)
      console.log(`  - descriptors: ${JSON.stringify(listingData.condition_descriptors)}`)
    } else {
      // フォールバック（マッピングがない場合）
      console.log(`⚠️ [Condition] マッピングなし → フォールバック`)
      
      if (isTradingCard) {
        // トレカカテゴリはデフォルトで Near Mint (4000 + 40001/400014)
        listingData.condition = 'USED_EXCELLENT'
        listingData.condition_id = 4000
        listingData.condition_descriptors = [
          { name: '40001', values: ['400014'] }  // Near Mint/Mint
        ]
        console.log(`🎴 [Condition] トレカデフォルト適用: conditionId=4000, descriptor=Near Mint`)
      } else {
        // 一般カテゴリは従来通り
        const conditionIdMap: Record<number, string> = {
          1000: 'NEW',
          1500: 'NEW_OTHER',
          3000: 'USED_EXCELLENT',
          4000: 'USED_VERY_GOOD',
          5000: 'USED_GOOD',
          6000: 'USED_ACCEPTABLE',
        }
        
        if (listingData.condition_id && conditionIdMap[listingData.condition_id]) {
          listingData.condition = conditionIdMap[listingData.condition_id]
        } else {
          listingData.condition = 'USED_EXCELLENT'
          listingData.condition_id = 3000
        }
        listingData.condition_descriptors = null
        console.log(`📦 [Condition] 一般カテゴリ: ${listingData.condition} (ID: ${listingData.condition_id})`)
      }
    }

    // ========================================
    // 🔥 HTMLテンプレートから生成
    // ========================================
    const generatedHtml = await getOrGenerateHtml(product, listingData, 'ebay_us')
    
    // listing_dataにHTMLを設定（inventory.tsで使用）
    listingData.html_description = generatedHtml
    console.log(`✅ HTML設定完了: ${generatedHtml.length}文字`)

    // 必須フィールドの検証
    const requiredFields = [
      { field: 'condition', label: 'コンディション' },
      { field: 'ddp_price_usd', label: 'DDP価格' },
      { field: 'shipping_policy_id', label: '配送ポリシーID' },
      { field: 'weight_g', label: '重量' },
    ]

    const missingFields = requiredFields.filter(({ field }) => {
      const value = listingData[field]
      return value === undefined || value === null || value === ''
    })

    if (missingFields.length > 0) {
      console.error('❌ 必須フィールド不足:', missingFields.map(f => f.label))
      return NextResponse.json(
        { 
          success: false,
          error: `必須フィールドが不足しています: ${missingFields.map(f => f.label).join(', ')}`,
          errorType: 'MISSING_FIELDS',
          missingFields: missingFields.map(f => f.field),
          missingFieldsLabels: missingFields.map(f => f.label)
        },
        { status: 400 }
      )
    }

    // カテゴリIDの確認（既に上で取得済み）
    if (!categoryId) {
      console.error('❌ eBayカテゴリIDがありません')
      return NextResponse.json(
        { 
          success: false,
          error: 'eBayカテゴリIDが設定されていません',
          errorType: 'MISSING_CATEGORY'
        },
        { status: 400 }
      )
    }

    // 画像URL
    const imageUrls = getImageUrls(product, listingData)
    
    if (imageUrls.length === 0) {
      console.error('❌ 画像がありません')
      return NextResponse.json(
        { 
          success: false,
          error: '出品には少なくとも1枚の画像が必要です',
          errorType: 'NO_IMAGES'
        },
        { status: 400 }
      )
    }

    console.log(`✅ 検証完了:`)
    console.log(`  - カテゴリID: ${categoryId}`)
    console.log(`  - 価格: $${listingData.ddp_price_usd}`)
    console.log(`  - コンディション: ${listingData.condition}`)
    console.log(`  - 配送ポリシー: ${listingData.shipping_policy_id}`)
    console.log(`  - 画像: ${imageUrls.length}枚`)
    console.log(`  - Item Specifics: ${Object.keys(listingData.item_specifics || {}).length}項目`)
    console.log(`  - HTML説明文: ${generatedHtml.length}文字 ✨`)

    // eBay出品用データ構造に変換
    const listingProduct = {
      id: product.id,
      sku: product.sku,
      title: product.title,
      english_title: product.english_title || product.title_en,
      
      // 価格
      ddp_price_usd: listingData.ddp_price_usd,
      ddu_price_usd: listingData.ddu_price_usd,
      
      // カテゴリ
      ebay_category_id: categoryId,
      
      // コンディション
      condition: listingData.condition,
      condition_name: product.condition_name,
      english_condition: product.english_condition,
      
      // 在庫
      current_stock: product.stock_quantity || product.inventory_quantity || 1,
      
      // 画像
      primary_image_url: product.primary_image_url,
      gallery_images: product.gallery_images,
      
      // 🔥 生成したHTMLを設定
      product_html_generated: generatedHtml,
      
      // listing_data全体を渡す
      listing_data: {
        ...listingData,
        image_urls: imageUrls,
        html_description: generatedHtml  // 🔥 生成したHTMLを確実に設定
      },
      
      // ebay_api_data
      ebay_api_data: {
        category_id: categoryId,
        title: ebayData?.title || product.english_title || product.title_en,
        item_specifics: listingData.item_specifics
      },
      
      // scraped_data
      scraped_data: product.scraped_data as any,
      
      // product_details
      product_details: product.product_details as any
    }

    // ========================================
    // Smart Listing実行
    // ========================================
    let result;
    
    if (useSmartListing) {
      console.log(`\n🧠 Smart Listing開始...`)
      result = await smartListProduct(listingProduct, account)
    } else {
      console.log(`\n🚀 eBay出品処理開始（通常モード）...`)
      result = await listProductToEbay(listingProduct, account)
    }

    // ========================================
    // 結果処理
    // ========================================
    
    if (!result.success) {
      const errorMessage = formatErrorMessage(result.error || result.details)
      const errorType = result.details?.errorType || 'LISTING_ERROR'
      
      console.error('❌ eBay出品失敗:', errorMessage)
      
      await logListingAction({
        sku: product.sku,
        productId: product.id,
        account,
        action: 'error',
        status: 'error',
        message: errorMessage,
        ebayResponse: result.details
      });
      
      return NextResponse.json(
        { 
          success: false,
          error: errorMessage,
          errorType: errorType,
          details: result.details,
          productId: product.id,
          sku: product.sku,
          productTitle: product.english_title || product.title_en || product.title
        },
        { status: 500 }
      )
    }

    console.log(`\n✅ eBay出品成功!`)
    console.log(`  ListingID: ${result.listingId}`)
    console.log(`  OfferID: ${result.offerId}`)
    
    await logListingAction({
      sku: product.sku,
      productId: product.id,
      account,
      action: result.details?.action === 'UPDATED' ? 'update' : 'create',
      status: 'success',
      message: `出品成功。ListingID: ${result.listingId}`
    });

    // products_masterを更新
    const updateData: any = {
      ebay_item_id: result.listingId,
      ebay_listing_url: `https://www.ebay.com/itm/${result.listingId}`,
      listed_at: new Date().toISOString(),
      listing_status: 'active',
      workflow_status: 'listed',
      updated_at: new Date().toISOString()
    }

    const updatedEbayData = {
      ...ebayData,
      listing_id: result.listingId,
      offer_id: result.offerId,
      listed_at: new Date().toISOString(),
      account: account
    }
    updateData.ebay_api_data = updatedEbayData

    const { error: updateError } = await supabase
      .from('products_master')
      .update(updateData)
      .eq('id', productId)

    if (updateError) {
      console.error('⚠️ products_master更新エラー（出品は成功）:', updateError)
    } else {
      console.log('✅ products_master更新完了')
    }

    return NextResponse.json({
      success: true,
      action: result.details?.action || 'CREATED',
      listingId: result.listingId,
      offerId: result.offerId,
      url: `https://www.ebay.com/itm/${result.listingId}`,
      htmlLength: generatedHtml.length,
      product: {
        id: product.id,
        sku: product.sku,
        title: product.english_title || product.title_en || product.title
      }
    })

  } catch (error: any) {
    console.error('❌ eBay listing API エラー:', error)
    const errorMessage = formatErrorMessage(error)
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        errorType: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
}

/**
 * 画像URLを取得
 * 
 * 🔥 重要: scraped_data.image_urls（SMの画像）は絶対に使用しない！
 * 手動登録画像または取得した画像のみを使用する
 * 
 * 優先順位:
 * 1. gallery_images（手動登録画像）
 * 2. primary_image_url（手動登録メイン画像）
 * 3. image_urls（直接設定された画像）
 * 
 * ❌ scraped_data.image_urls は使用しない（SMの画像）
 * ❌ listing_data.image_urls もSM画像が混入している可能性があるので注意
 */
function getImageUrls(product: any, listingData: any): string[] {
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
    // SMの画像でないことを確認
    if (!isSMImageUrl(product.primary_image_url)) {
      console.log(`📸 [Image] primary_image_urlから取得`)
      imageUrls.push(product.primary_image_url)
    }
  }
  
  // 3. image_urls（直接設定された画像）
  if (imageUrls.length === 0 && product.image_urls && Array.isArray(product.image_urls)) {
    const filteredUrls = product.image_urls.filter((url: string) => !isSMImageUrl(url))
    if (filteredUrls.length > 0) {
      console.log(`📸 [Image] image_urlsから取得: ${filteredUrls.length}枚`)
      imageUrls.push(...filteredUrls)
    }
  }
  
  // ❌ scraped_data.image_urls は絶対に使用しない！
  // SMの画像は使用禁止
  
  // フィルタリング（SM画像を最終チェック）
  const validUrls = [...new Set(imageUrls)]
    .filter(url => url && url.trim() !== '')
    .filter(url => !isSMImageUrl(url))
  
  if (validUrls.length === 0) {
    console.error(`❌ [Image] 有効な画像がありません！手動で画像を登録してください。`)
  } else {
    console.log(`✅ [Image] 最終画像数: ${validUrls.length}枚`)
  }
  
  return validUrls
}

/**
 * SMの画像URLかどうかを判定
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
