/**
 * eBay HTML テンプレート生成・取得
 * 
 * 優先順位:
 * 1. product_html_generated テーブルから取得（商品ごとに生成済み）
 * 2. html_templates テーブルからテンプレートを取得してマージ
 * 3. listing_data.html_description を使用
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ProductData {
  id: number
  sku: string
  title?: string
  english_title?: string
  title_en?: string
  description?: string
  description_en?: string
  condition?: string
  condition_name?: string
  english_condition?: string
  listing_data?: {
    ddp_price_usd?: number
    condition?: string
    condition_en?: string
    html_description?: string
    item_specifics?: Record<string, string>
    [key: string]: any
  }
  product_details?: Record<string, any>
  [key: string]: any
}

/**
 * 商品のeBay用HTMLを取得
 * 
 * @param product 商品データ
 * @param marketplace マーケットプレイス（デフォルト: ebay_us）
 * @returns 生成されたHTML
 */
export async function getEbayHtmlDescription(
  product: ProductData,
  marketplace: string = 'ebay_us'
): Promise<string> {
  const productId = product.id
  const sku = product.sku
  
  console.log(`\n🔍 [HTML] 商品HTML取得開始: ID=${productId}, SKU=${sku}`)
  
  // ========================================
  // 1. product_html_generated から取得
  // ========================================
  try {
    const { data: generatedHtml, error: generatedError } = await supabase
      .from('product_html_generated')
      .select('generated_html, template_name, updated_at')
      .eq('products_master_id', productId)
      .eq('marketplace', marketplace)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    
    if (!generatedError && generatedHtml?.generated_html) {
      console.log(`✅ [HTML] product_html_generatedから取得: ${generatedHtml.generated_html.length}文字`)
      console.log(`   テンプレート: ${generatedHtml.template_name}`)
      console.log(`   更新日時: ${generatedHtml.updated_at}`)
      return generatedHtml.generated_html
    }
    
    console.log(`ℹ️ [HTML] product_html_generatedにデータなし`)
  } catch (e: any) {
    console.warn(`⚠️ [HTML] product_html_generated取得エラー: ${e.message}`)
  }
  
  // ========================================
  // 2. html_templates からテンプレートを取得してマージ
  // ========================================
  try {
    // マーケットプレイスに対応するテンプレートを取得
    const mallType = 'ebay'
    const countryCode = marketplace === 'ebay_us' ? 'US' : 
                        marketplace === 'ebay_de' ? 'DE' :
                        marketplace === 'ebay_es' ? 'ES' :
                        marketplace === 'ebay_it' ? 'IT' : 'US'
    
    const { data: template, error: templateError } = await supabase
      .from('html_templates')
      .select('id, name, html_content')
      .eq('mall_type', mallType)
      .eq('country_code', countryCode)
      .limit(1)
      .single()
    
    if (!templateError && template?.html_content) {
      console.log(`✅ [HTML] html_templatesからテンプレート取得: ${template.name}`)
      console.log(`   テンプレート長: ${template.html_content.length}文字`)
      
      // テンプレートに商品データをマージ
      const mergedHtml = mergeTemplateWithProduct(template.html_content, product)
      console.log(`✅ [HTML] マージ完了: ${mergedHtml.length}文字`)
      
      return mergedHtml
    }
    
    console.log(`ℹ️ [HTML] html_templatesにテンプレートなし`)
  } catch (e: any) {
    console.warn(`⚠️ [HTML] html_templates取得エラー: ${e.message}`)
  }
  
  // ========================================
  // 3. listing_data.html_description を使用
  // ========================================
  const fallbackHtml = product.listing_data?.html_description
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
function mergeTemplateWithProduct(template: string, product: ProductData): string {
  let html = template
  
  // 基本情報
  const title = product.english_title || product.title_en || product.title || ''
  const description = product.description_en || product.description || ''
  const sku = product.sku || ''
  const price = product.listing_data?.ddp_price_usd || 0
  const condition = product.listing_data?.condition_en || 
                    product.listing_data?.condition || 
                    product.condition_name ||
                    product.english_condition ||
                    'Used'
  
  // 商品詳細
  const productDetails = product.product_details || {}
  const listingData = product.listing_data || {}
  
  // プレースホルダー置換マップ
  const replacements: Record<string, string> = {
    // 基本情報
    '{{TITLE}}': escapeHtml(title),
    '{{SKU}}': escapeHtml(sku),
    '{{PRICE}}': price.toFixed(2),
    '{{CONDITION}}': escapeHtml(condition),
    '{{DESCRIPTION}}': escapeHtml(description),
    
    // 商品詳細（product_details）
    '{{BRAND}}': escapeHtml(productDetails.brand || listingData.item_specifics?.Brand || 'N/A'),
    '{{MODEL}}': escapeHtml(productDetails.model || 'N/A'),
    '{{COLOR}}': escapeHtml(productDetails.color || 'N/A'),
    '{{SIZE}}': escapeHtml(productDetails.size || 'N/A'),
    '{{MATERIAL}}': escapeHtml(productDetails.material || 'N/A'),
    
    // カード関連
    '{{CARD_NAME}}': escapeHtml(productDetails.card_name || listingData.card_name || ''),
    '{{SET_NAME}}': escapeHtml(productDetails.set_name || productDetails.set || listingData.set_name || ''),
    '{{RARITY}}': escapeHtml(productDetails.rarity || listingData.rarity || ''),
    '{{LANGUAGE}}': escapeHtml(productDetails.language || listingData.language || 'Japanese'),
    '{{CARD_NUMBER}}': escapeHtml(productDetails.card_number || ''),
    '{{FINISH}}': escapeHtml(productDetails.finish || listingData.finish || ''),
    
    // 配送・サイズ
    '{{WEIGHT}}': (listingData.weight_g || 100).toString(),
    '{{WIDTH}}': (listingData.width_cm || 10).toString(),
    '{{HEIGHT}}': (listingData.height_cm || 1).toString(),
    '{{LENGTH}}': (listingData.length_cm || 15).toString(),
  }
  
  // 置換実行
  for (const [placeholder, value] of Object.entries(replacements)) {
    html = html.replace(new RegExp(placeholder, 'g'), value)
  }
  
  // 未置換のプレースホルダーを空文字に
  html = html.replace(/\{\{[A-Z_]+\}\}/g, '')
  
  return html
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
export async function saveGeneratedHtml(
  productId: number,
  sku: string,
  marketplace: string,
  templateId: number,
  templateName: string,
  generatedHtml: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('product_html_generated')
      .upsert({
        products_master_id: productId,
        sku: sku,
        marketplace: marketplace,
        template_id: templateId,
        template_name: templateName,
        generated_html: generatedHtml,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'products_master_id,marketplace'
      })
    
    if (error) {
      console.error('❌ [HTML] 保存エラー:', error)
      return false
    }
    
    console.log(`✅ [HTML] 保存完了: products_master_id=${productId}, marketplace=${marketplace}`)
    return true
  } catch (e: any) {
    console.error('❌ [HTML] 保存例外:', e.message)
    return false
  }
}
