// app/api/products/batch-update/route.ts
// V2: 価格戦略・DDP価格計算・市場調査データ対応
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
)

interface ProductUpdate {
  sku: string
  // 基本データ
  english_title?: string
  hts_code?: string
  hts_confidence?: string
  hts_reason?: string
  origin_country?: string
  material?: string
  length_cm?: number
  width_cm?: number
  height_cm?: number
  weight_g?: number
  // 関税データ
  hts_duty_rate?: number
  origin_country_duty_rate?: number
  material_duty_rate?: number
  // 市場調査データ
  f_price_premium?: number
  f_community_score?: number
  c_supply_japan?: number
  c_supply_trend?: string
  s_flag_discontinued?: string
  // 価格戦略データ（V2追加）
  recommended_price_usd?: number
  pricing_strategy?: string
  pricing_reason?: string
}

interface BatchUpdateResult {
  sku: string
  success: boolean
  error?: string
  product_id?: number
  ddp_price_usd?: number
  profit_margin?: number
}

/**
 * 関税率を取得
 */
async function getDutyRate(htsCode: string, originCountry: string): Promise<{
  totalDutyRate: number
  baseDuty: number
  section301Rate: number
  dataSource: string
}> {
  // customs_dutiesテーブルから関税率を取得
  const { data: dutyData, error: dutyError } = await supabase
    .from('customs_duties')
    .select('*')
    .eq('hts_code', htsCode)
    .eq('origin_country', originCountry)
    .single()

  if (!dutyError && dutyData) {
    return {
      totalDutyRate: dutyData.total_duty_rate || 0,
      baseDuty: dutyData.base_duty || 0,
      section301Rate: dutyData.section301_rate || 0,
      dataSource: 'customs_duties'
    }
  }

  // フォールバック: hs_codes_by_countryから取得
  const { data: htsData, error: htsError } = await supabase
    .from('hs_codes_by_country')
    .select('*')
    .eq('hts_code', htsCode)
    .eq('country_code', originCountry)
    .single()

  if (!htsError && htsData) {
    const baseDuty = htsData.base_duty || 0
    const section301Rate = htsData.section301_rate || 0
    return {
      totalDutyRate: baseDuty + section301Rate,
      baseDuty,
      section301Rate,
      dataSource: 'hs_codes_by_country'
    }
  }

  // デフォルト値
  if (originCountry === 'CN') {
    return { totalDutyRate: 0.30, baseDuty: 0.05, section301Rate: 0.25, dataSource: 'default' }
  } else if (originCountry === 'JP') {
    return { totalDutyRate: 0.00, baseDuty: 0.00, section301Rate: 0, dataSource: 'default' }
  }
  return { totalDutyRate: 0.05, baseDuty: 0.05, section301Rate: 0, dataSource: 'default' }
}

/**
 * 送料計算（簡易版）
 */
function calculateShippingCost(weightG: number, lengthCm: number, widthCm: number, heightCm: number): number {
  const weightKg = weightG / 1000
  const volumetricWeight = (lengthCm * widthCm * heightCm) / 5000
  const chargeableWeight = Math.max(weightKg, volumetricWeight)
  
  if (chargeableWeight <= 0.1) return 8
  if (chargeableWeight <= 0.5) return 12
  if (chargeableWeight <= 1) return 18
  if (chargeableWeight <= 2) return 25
  if (chargeableWeight <= 5) return 40
  if (chargeableWeight <= 10) return 60
  return 80
}

/**
 * 商品データ一括更新API V2
 * 
 * SKUをキーとして、複数商品を一括で更新します。
 * - 価格戦略データ対応
 * - DDP価格自動計算
 * - 利益率計算
 */
export async function POST(request: NextRequest) {
  try {
    const { updates }: { updates: ProductUpdate[] } = await request.json()

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { success: false, error: '更新データが必要です' },
        { status: 400 }
      )
    }

    console.log(`📦 一括更新開始 V2: ${updates.length}件`)

    const results: BatchUpdateResult[] = []
    let succeeded = 0
    let failed = 0

    // 各商品を個別に処理
    for (const update of updates) {
      try {
        // 1. バリデーション
        const validationError = validateUpdate(update)
        if (validationError) {
          results.push({
            sku: update.sku,
            success: false,
            error: validationError
          })
          failed++
          continue
        }

        // 2. SKUで商品を検索
        console.log(`🔍 SKU検索: ${update.sku}`)
        const { data: existingProduct, error: findError } = await supabase
          .from('products_master')
          .select('id, sku, listing_data, cost_price, price_jpy')
          .eq('sku', update.sku)
          .single()

        if (findError || !existingProduct) {
          console.error(`❌ SKU「${update.sku}」が見つかりません`)
          results.push({
            sku: update.sku,
            success: false,
            error: `SKU「${update.sku}」が見つかりません`
          })
          failed++
          continue
        }

        const product = existingProduct
        const existingListingData = product?.listing_data || {}

        // 3. 更新データを構築
        const updateData: any = {
          updated_at: new Date().toISOString()
        }

        // 基本データフィールド
        if (update.english_title !== undefined) {
          updateData.english_title = update.english_title
          updateData.title_en = update.english_title
        }
        if (update.hts_code !== undefined) {
          updateData.hts_code = update.hts_code
        }
        if (update.origin_country !== undefined) {
          updateData.origin_country = update.origin_country
        }
        if (update.material !== undefined) {
          updateData.material = update.material
        }

        // 4. 価格計算（HTSコードがある場合）
        let ddpPriceUsd: number | null = null
        let profitMargin: number | null = null
        let profitAmountUsd: number | null = null
        let shippingCostUsd: number | null = null

        const htsCode = update.hts_code || (product as any).hts_code
        const originCountry = update.origin_country || (product as any).origin_country || 'JP'
        const costJPY = product.cost_price || product.price_jpy || 0
        const exchangeRate = 150

        if (htsCode && costJPY > 0) {
          // 関税率取得
          const dutyInfo = await getDutyRate(htsCode, originCountry)
          console.log(`  📊 関税率: ${(dutyInfo.totalDutyRate * 100).toFixed(2)}% (${dutyInfo.dataSource})`)

          const costUSD = costJPY / exchangeRate
          const weightG = update.weight_g || existingListingData.weight_g || 100
          const lengthCm = update.length_cm || existingListingData.length_cm || 10
          const widthCm = update.width_cm || existingListingData.width_cm || 10
          const heightCm = update.height_cm || existingListingData.height_cm || 5

          shippingCostUsd = calculateShippingCost(weightG, lengthCm, widthCm, heightCm)
          const dutyAmountUSD = costUSD * dutyInfo.totalDutyRate
          const ebayFeeRate = 0.1299
          const paypalFeeRate = 0.0349
          const targetMargin = 0.25

          const totalCostUSD = costUSD + shippingCostUsd + dutyAmountUSD
          const feeDenominator = 1 - ebayFeeRate - paypalFeeRate - targetMargin
          const calculatedDdpPrice = Math.ceil((totalCostUSD / feeDenominator) * 100) / 100

          // 推奨価格がある場合はそちらを優先
          ddpPriceUsd = update.recommended_price_usd || calculatedDdpPrice

          const ebayFee = ddpPriceUsd * ebayFeeRate
          const paypalFee = ddpPriceUsd * paypalFeeRate
          profitAmountUsd = ddpPriceUsd - totalCostUSD - ebayFee - paypalFee
          profitMargin = ddpPriceUsd > 0 ? profitAmountUsd / ddpPriceUsd : 0

          // 更新データに追加
          updateData.ddp_price_usd = ddpPriceUsd
          updateData.profit_amount_usd = profitAmountUsd
          updateData.profit_margin = profitMargin
          updateData.shipping_cost_usd = shippingCostUsd
          updateData.hts_duty_rate = dutyInfo.totalDutyRate

          console.log(`  💰 DDP価格: $${ddpPriceUsd.toFixed(2)}, 利益率: ${(profitMargin * 100).toFixed(1)}%`)
        }

        // 5. listing_dataを構築
        const newListingData: any = {
          ...existingListingData,
          // サイズ・重量
          ...(update.length_cm !== undefined && { length_cm: update.length_cm }),
          ...(update.width_cm !== undefined && { width_cm: update.width_cm }),
          ...(update.height_cm !== undefined && { height_cm: update.height_cm }),
          ...(update.weight_g !== undefined && { weight_g: update.weight_g }),
          // HTS情報
          ...(update.hts_code !== undefined && { hts_code: update.hts_code }),
          ...(update.hts_confidence !== undefined && { hts_confidence: update.hts_confidence }),
          ...(update.hts_reason !== undefined && { hts_reason: update.hts_reason }),
          // 価格戦略（V2追加）
          ...(update.recommended_price_usd !== undefined && { recommended_price_usd: update.recommended_price_usd }),
          ...(update.pricing_strategy !== undefined && { pricing_strategy: update.pricing_strategy }),
          ...(update.pricing_reason !== undefined && { pricing_reason: update.pricing_reason }),
          // 市場調査データ
          ...(update.f_price_premium !== undefined && { f_price_premium: update.f_price_premium }),
          ...(update.f_community_score !== undefined && { f_community_score: update.f_community_score }),
          ...(update.c_supply_japan !== undefined && { c_supply_japan: update.c_supply_japan }),
          ...(update.c_supply_trend !== undefined && { c_supply_trend: update.c_supply_trend }),
          ...(update.s_flag_discontinued !== undefined && { s_flag_discontinued: update.s_flag_discontinued }),
          // メタデータ
          ai_enriched_at: new Date().toISOString(),
          hts_source: 'ai_estimated'
        }

        updateData.listing_data = newListingData

        // 6. DB更新実行
        const { error: updateError } = await supabase
          .from('products_master')
          .update(updateData)
          .eq('id', existingProduct.id)

        if (updateError) {
          throw updateError
        }

        results.push({
          sku: update.sku,
          success: true,
          product_id: existingProduct.id,
          ddp_price_usd: ddpPriceUsd || undefined,
          profit_margin: profitMargin || undefined
        })
        succeeded++

        console.log(`  ✅ ${update.sku} 更新成功`)

      } catch (error: any) {
        results.push({
          sku: update.sku,
          success: false,
          error: error.message || '更新に失敗しました'
        })
        failed++
        console.error(`  ❌ ${update.sku} 更新失敗:`, error.message)
      }
    }

    console.log(`📊 一括更新完了: 成功 ${succeeded}件、失敗 ${failed}件`)

    return NextResponse.json({
      success: true,
      total: updates.length,
      succeeded,
      failed,
      results
    })

  } catch (error: any) {
    console.error('❌ 一括更新エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * データバリデーション
 */
function validateUpdate(update: ProductUpdate): string | null {
  // SKU必須
  if (!update.sku || update.sku.trim() === '') {
    return 'SKUは必須です'
  }

  // HTSコードは10桁（入力されている場合のみ）
  if (update.hts_code && !/^\d{4}\.\d{2}\.\d{2}\.\d{2}$/.test(update.hts_code)) {
    return `HTSコードの形式が不正です: ${update.hts_code}（正しい形式: 9504.40.00.00）`
  }

  // HTS信頼度は指定値のみ
  if (update.hts_confidence && !['very high', 'high', 'medium', 'low', 'uncertain'].includes(update.hts_confidence)) {
    return `HTS信頼度の値が不正です: ${update.hts_confidence}（許可値: very high, high, medium, low, uncertain）`
  }

  // 原産国は2文字（入力されている場合のみ）
  if (update.origin_country && !/^[A-Z]{2}$/.test(update.origin_country)) {
    return `原産国コードの形式が不正です: ${update.origin_country}（正しい形式: JP, CN, US等の2文字）`
  }

  // 価格戦略は指定値のみ
  if (update.pricing_strategy && !['premium', 'competitive', 'undercut', 'clearance'].includes(update.pricing_strategy)) {
    return `価格戦略の値が不正です: ${update.pricing_strategy}（許可値: premium, competitive, undercut, clearance）`
  }

  // 数値フィールドは正の値
  const numericFields = [
    { key: 'length_cm', label: '長さ' },
    { key: 'width_cm', label: '幅' },
    { key: 'height_cm', label: '高さ' },
    { key: 'weight_g', label: '重さ' },
    { key: 'recommended_price_usd', label: '推奨価格' }
  ]

  for (const field of numericFields) {
    const value = (update as any)[field.key]
    if (value !== undefined && value !== null) {
      if (typeof value !== 'number' || value < 0) {
        return `${field.label}は0以上の数値である必要があります: ${value}`
      }
    }
  }

  return null
}
