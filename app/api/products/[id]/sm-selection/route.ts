// app/api/products/[id]/sm-selection/route.ts
/**
 * SM選択API - ハイブリッドAI監査パイプライン
 * 
 * 機能:
 * - 「完全一致」選択時: Get Item API → Item Specifics全コピー
 * - 「参考」選択時: ヒントとして保持
 * - VeROチェック + ルールエンジン監査を自動実行
 * - 安全装置対応（バッチロック、通貨変換、監査前出品ブロック）
 * 
 * @created 2025-01-16
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { 
  SmSelectionRequest, 
  SmSelectionResponse, 
  AiAuditStatus,
  SafetyStatus 
} from '@/types/hybrid-ai-pipeline'

// Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// =====================================================
// 為替レート取得
// =====================================================

async function getExchangeRate(from: string, to: string): Promise<number> {
  if (from === to) return 1
  
  // キャッシュをチェック（1時間以内）
  const { data: cached } = await supabase
    .from('exchange_rates')
    .select('rate, updated_at')
    .eq('from_currency', from)
    .eq('to_currency', to)
    .gte('updated_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
    .single()
  
  if (cached) {
    console.log(`💱 為替キャッシュヒット: ${from}→${to} = ${cached.rate}`)
    return cached.rate
  }
  
  // APIから取得
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from}`
    )
    const data = await response.json()
    const rate = data.rates?.[to] || 1
    
    // キャッシュに保存（UPSERT）
    await supabase.from('exchange_rates').upsert({
      from_currency: from,
      to_currency: to,
      rate,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'from_currency,to_currency' })
    
    console.log(`💱 為替API取得: ${from}→${to} = ${rate}`)
    return rate
  } catch (error) {
    console.error('為替レート取得エラー:', error)
    return 1 // フォールバック
  }
}

// 価格をUSDに変換
async function convertToUsd(price: number, currency: string): Promise<number> {
  if (currency === 'USD') return price
  const rate = await getExchangeRate(currency, 'USD')
  return Math.round(price * rate * 100) / 100
}

// =====================================================
// VeROチェック（既存サービス呼び出し）
// =====================================================

interface VeroCheckResult {
  riskLevel: 'block' | 'high' | 'medium' | 'low' | 'safe'
  detectedBrand?: string
  reasons?: string[]
  patentRisk?: boolean
}

function checkVeroPatentRisk(product: any): VeroCheckResult {
  // 簡易版VeROチェック（本番では vero-patent-service.ts をimportして使用）
  const title = (product.title || product.english_title || '').toLowerCase()
  
  // 高リスクブランド（一部のみ）
  const highRiskBrands = [
    'louis vuitton', 'gucci', 'chanel', 'hermes', 'rolex',
    'nike', 'adidas', 'supreme', 'bape', 'off-white',
    'pokemon', 'nintendo', 'disney', 'marvel', 'sanrio',
  ]
  
  // ブロックブランド
  const blockBrands = [
    'louis vuitton', 'chanel', 'hermes',
  ]
  
  for (const brand of blockBrands) {
    if (title.includes(brand)) {
      return {
        riskLevel: 'block',
        detectedBrand: brand,
        reasons: [`${brand} is a protected brand`],
      }
    }
  }
  
  for (const brand of highRiskBrands) {
    if (title.includes(brand)) {
      return {
        riskLevel: 'high',
        detectedBrand: brand,
        reasons: [`${brand} may require authentication`],
      }
    }
  }
  
  // パテントトロールチェック（Dominaria等）
  if (title.includes('card sleeve') || title.includes('deck box')) {
    return {
      riskLevel: 'medium',
      patentRisk: true,
      reasons: ['Card accessories may have patent risks'],
    }
  }
  
  return { riskLevel: 'safe' }
}

// =====================================================
// ルールエンジン監査（簡易版）
// =====================================================

interface AuditResult {
  score: number
  overallSeverity: 'error' | 'warning' | 'ok'
  issues: { field: string; severity: string; message: string }[]
  autoFixSuggestions: { field: string; suggestedValue: any; confidence: number; reason: string }[]
}

function auditProduct(product: any, itemSpecifics: Record<string, string>): AuditResult {
  const issues: any[] = []
  const autoFixSuggestions: any[] = []
  let score = 100
  
  const title = product.title || product.english_title || ''
  
  // 1. トレカ判定
  const tradingCardKeywords = ['pokemon', 'card', 'tcg', 'mtg', 'yugioh', 'magic the gathering', 'baseball card']
  const isTradingCard = tradingCardKeywords.some(kw => title.toLowerCase().includes(kw))
  
  if (isTradingCard && !product.hts_code) {
    autoFixSuggestions.push({
      field: 'hts_code',
      suggestedValue: '9504.40.00',
      confidence: 0.95,
      reason: 'トレーディングカードとして検出',
    })
  }
  
  // 2. 原産国推定
  const countryPatterns: Record<string, string[]> = {
    'Japan': ['japan', 'japanese', 'jp', 'jpn', '日本'],
    'China': ['china', 'chinese', 'cn', 'chn', '中国'],
    'USA': ['usa', 'us', 'united states', 'american', 'アメリカ'],
    'Korea': ['korea', 'korean', 'kr', 'kor', '韓国'],
  }
  
  if (!product.origin_country) {
    for (const [country, patterns] of Object.entries(countryPatterns)) {
      if (patterns.some(p => title.toLowerCase().includes(p))) {
        autoFixSuggestions.push({
          field: 'origin_country',
          suggestedValue: country,
          confidence: 0.85,
          reason: `タイトルから"${country}"を検出`,
        })
        break
      }
    }
  }
  
  // 3. Item Specificsから原産国を取得
  const originFromSpecs = itemSpecifics['Country/Region of Manufacture'] 
    || itemSpecifics['Country of Origin']
    || itemSpecifics['Made In']
  
  if (originFromSpecs && !product.origin_country) {
    autoFixSuggestions.push({
      field: 'origin_country',
      suggestedValue: originFromSpecs,
      confidence: 0.95,
      reason: 'Item Specificsから取得',
    })
  }
  
  // 4. 高関税素材チェック
  const highTariffMaterials = ['leather', 'silk', 'cashmere', 'wool']
  const materialFromSpecs = itemSpecifics['Material'] || ''
  
  if (highTariffMaterials.some(m => materialFromSpecs.toLowerCase().includes(m))) {
    issues.push({
      field: 'material',
      severity: 'warning',
      message: `高関税素材の可能性: ${materialFromSpecs}`,
    })
    score -= 10
  }
  
  // 5. 必須項目チェック
  if (!product.ebay_category_id && !itemSpecifics['Category']) {
    issues.push({
      field: 'ebay_category_id',
      severity: 'warning',
      message: 'eBayカテゴリIDが未設定',
    })
    score -= 5
  }
  
  // 全体の重大度を決定
  let overallSeverity: 'error' | 'warning' | 'ok' = 'ok'
  if (issues.some(i => i.severity === 'error')) {
    overallSeverity = 'error'
  } else if (issues.length > 0) {
    overallSeverity = 'warning'
  }
  
  return {
    score: Math.max(0, score),
    overallSeverity,
    issues,
    autoFixSuggestions,
  }
}

// =====================================================
// メインAPI
// =====================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const body: SmSelectionRequest = await request.json()
    const { competitor, selectionType } = body

    console.log('🎯 [SM Selection] 開始:', productId, 'type:', selectionType)

    // 1. 現在の商品データを取得
    const { data: product, error: fetchError } = await supabase
      .from('products_master')
      .select('*')
      .eq('id', productId)
      .single()

    if (fetchError || !product) {
      console.error('❌ 商品取得エラー:', fetchError)
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // 処理中の場合はブロック
    if (product.ai_audit_status === 'processing_batch') {
      return NextResponse.json(
        { success: false, error: 'AI監査処理中のため変更できません' },
        { status: 409 }
      )
    }

    const updates: any = {
      sm_selected_item: competitor,
      sm_selected_item_id: competitor.itemId,
      updated_at: new Date().toISOString(),
      // 🔥 安全装置3: 完全コピー直後は必ず 'warning' をセット
      ai_audit_status: selectionType === 'exact' ? 'warning' : 'pending',
      ai_audit_needs_review: selectionType === 'exact',
    }

    let copiedItemSpecifics: Record<string, string> = {}

    // 2. 「完全一致」の場合：Get Item APIで詳細を取得
    if (selectionType === 'exact' && competitor.itemId) {
      console.log(`📡 Get Item API呼び出し: ${competitor.itemId}`)
      
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const itemResponse = await fetch(
        `${baseUrl}/api/ebay/get-item-details?itemId=${encodeURIComponent(competitor.itemId)}`
      )

      if (itemResponse.ok) {
        const itemData = await itemResponse.json()
        
        // Item Specificsをコピー
        if (itemData.itemSpecifics) {
          const existingSpecifics = product.listing_data?.item_specifics || {}
          copiedItemSpecifics = itemData.itemSpecifics
          updates.sm_item_specifics_copied = itemData.itemSpecifics
          updates.listing_data = {
            ...product.listing_data,
            item_specifics: {
              ...existingSpecifics,
              ...itemData.itemSpecifics,
            },
          }
          console.log(`✅ Item Specifics コピー: ${Object.keys(itemData.itemSpecifics).length}項目`)
        }

        // 原産国をコピー（未設定の場合のみ）
        if (itemData.originCountry && !product.origin_country) {
          updates.origin_country = itemData.originCountry
          console.log(`✅ 原産国コピー: ${itemData.originCountry}`)
        }

        // カテゴリIDをコピー（未設定の場合のみ）
        if (itemData.categoryId && !product.ebay_category_id) {
          updates.ebay_category_id = itemData.categoryId
        }

        // conditionDescriptors をコピー（トレカ用）
        if (itemData.conditionDescriptors) {
          updates.listing_data = {
            ...updates.listing_data,
            condition_descriptors: itemData.conditionDescriptors,
          }
        }

        // 🔥 安全装置2: 価格をUSD基準で保存
        if (itemData.price) {
          const basePriceUsd = await convertToUsd(
            itemData.price.value, 
            itemData.price.currency
          )
          updates.base_price_usd = basePriceUsd
          updates.copied_price_currency = itemData.price.currency
          updates.copied_price_marketplace = 'EBAY_US' // TODO: 動的に設定
          console.log(`💱 価格変換: ${itemData.price.value} ${itemData.price.currency} → $${basePriceUsd} USD`)
        }
      } else {
        console.warn('⚠️ Get Item API失敗、競合データのみ使用')
        // 競合データからItem Specificsを使用
        if (competitor.itemSpecifics) {
          copiedItemSpecifics = competitor.itemSpecifics as Record<string, string>
          updates.sm_item_specifics_copied = competitor.itemSpecifics
        }
      }
    } else if (competitor.itemSpecifics) {
      // 参考選択でもItem Specificsは保持
      copiedItemSpecifics = competitor.itemSpecifics as Record<string, string>
    }

    // 3. VeRO/パテントチェック
    const veroCheck = checkVeroPatentRisk({ ...product, ...updates })
    if (veroCheck.riskLevel === 'block' || veroCheck.riskLevel === 'high') {
      updates.is_vero_brand = true
      updates.vero_detected_brand = veroCheck.detectedBrand
      // 🔥 安全装置3: VeRO検出時は manual_check（出品ブロック）または warning
      if (veroCheck.riskLevel === 'block') {
        updates.ai_audit_status = 'manual_check'
      } else if (updates.ai_audit_status !== 'manual_check') {
        updates.ai_audit_status = 'warning'
      }
      updates.ai_audit_report = {
        vero: veroCheck,
        timestamp: new Date().toISOString(),
      }
      console.log(`⚠️ VeRO検出: ${veroCheck.riskLevel} - ${veroCheck.detectedBrand}`)
    }

    // 4. ルールエンジン監査
    const auditReport = auditProduct({ ...product, ...updates }, copiedItemSpecifics)
    
    // 自動修正提案を適用
    let autoFixApplied = 0
    for (const suggestion of auditReport.autoFixSuggestions) {
      if (suggestion.confidence >= 0.85) {
        switch (suggestion.field) {
          case 'hts_code':
            if (!product.hts_code) {
              updates.hts_code = suggestion.suggestedValue
              autoFixApplied++
            }
            break
          case 'origin_country':
            if (!product.origin_country && !updates.origin_country) {
              updates.origin_country = suggestion.suggestedValue
              autoFixApplied++
            }
            break
          case 'material':
            if (!product.material) {
              updates.material = suggestion.suggestedValue
              autoFixApplied++
            }
            break
        }
      }
    }
    
    console.log(`🔧 自動修正適用: ${autoFixApplied}件`)

    // 5. 監査ステータス設定（安全装置3の最終判定）
    if (updates.ai_audit_status !== 'manual_check') {
      if (auditReport.overallSeverity === 'error') {
        updates.ai_audit_status = 'manual_check'
      } else if (auditReport.overallSeverity === 'warning' || selectionType === 'exact') {
        updates.ai_audit_status = 'warning' // 完コピは必ず warning
      } else if (auditReport.overallSeverity === 'ok' && !updates.ai_audit_needs_review) {
        updates.ai_audit_status = 'clear'
      }
    }

    updates.ai_confidence_score = auditReport.score

    // 監査レポートをマージ
    updates.ai_audit_report = {
      ...(updates.ai_audit_report || {}),
      ruleEngine: {
        score: auditReport.score,
        overallSeverity: auditReport.overallSeverity,
        issues: auditReport.issues,
        autoFixSuggestions: auditReport.autoFixSuggestions,
      },
      timestamp: new Date().toISOString(),
    }

    // 6. DBに保存
    const { error: updateError } = await supabase
      .from('products_master')
      .update(updates)
      .eq('id', productId)

    if (updateError) {
      console.error('❌ 更新エラー:', updateError)
      throw updateError
    }

    // 7. 安全装置ステータスを構築
    const safetyStatus: SafetyStatus = {
      editLocked: updates.ai_audit_status === 'processing_batch',
      canPublish: updates.ai_audit_status === 'clear',
      needsWarning: updates.ai_audit_status === 'warning',
      isBlocked: updates.ai_audit_status === 'manual_check',
    }

    console.log('✅ [SM Selection] 完了:', {
      productId,
      selectionType,
      auditStatus: updates.ai_audit_status,
      itemSpecificsCopied: Object.keys(copiedItemSpecifics).length,
    })

    const response: SmSelectionResponse = {
      success: true,
      productId: parseInt(productId),
      selectionType,
      itemSpecificsCopied: Object.keys(copiedItemSpecifics).length,
      auditStatus: updates.ai_audit_status as AiAuditStatus,
      auditScore: auditReport.score,
      veroRisk: veroCheck.riskLevel,
      autoFixApplied,
      basePriceUsd: updates.base_price_usd,
      safetyStatus,
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('❌ SM選択エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message } as SmSelectionResponse,
      { status: 500 }
    )
  }
}

/**
 * GET: 現在のSM選択状態を取得
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    const { data: product, error } = await supabase
      .from('products_master')
      .select(`
        id,
        sm_selected_item,
        sm_selected_item_id,
        sm_item_specifics_copied,
        ai_audit_status,
        ai_audit_report,
        ai_confidence_score,
        ai_audit_needs_review,
        base_price_usd,
        copied_price_currency,
        copied_price_marketplace
      `)
      .eq('id', productId)
      .single()

    if (error || !product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    const safetyStatus: SafetyStatus = {
      editLocked: product.ai_audit_status === 'processing_batch',
      canPublish: product.ai_audit_status === 'clear',
      needsWarning: product.ai_audit_status === 'warning',
      isBlocked: product.ai_audit_status === 'manual_check' || product.ai_audit_status === 'processing_batch',
    }

    return NextResponse.json({
      success: true,
      productId: product.id,
      smSelectedItem: product.sm_selected_item,
      smSelectedItemId: product.sm_selected_item_id,
      smItemSpecificsCopied: product.sm_item_specifics_copied,
      auditStatus: product.ai_audit_status,
      auditReport: product.ai_audit_report,
      confidenceScore: product.ai_confidence_score,
      needsReview: product.ai_audit_needs_review,
      basePriceUsd: product.base_price_usd,
      copiedPriceCurrency: product.copied_price_currency,
      copiedPriceMarketplace: product.copied_price_marketplace,
      safetyStatus,
    })

  } catch (error: any) {
    console.error('❌ SM選択状態取得エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
