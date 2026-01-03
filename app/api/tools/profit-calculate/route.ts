// app/api/tools/profit-calculate/route.ts
// 🔥 V6.4: DDU価格計算修正
// - DDU = 商品価格（関税なし）+ 送料
// - DDP = 商品価格（関税込み）+ 送料
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// 為替レート（後で動的取得に変更可能）
const EXCHANGE_RATE = 150
const DDP_SERVICE_FEE = 15

// ==========================================
// 🚨 一時的な設定（戻すときは変更）
// ==========================================
const EXCLUDE_JAPAN_POST_FOR_USA = true  // 日本郵便をUSA向けで除外
const EXCLUDED_CARRIERS = ['日本郵便']  // 除外するキャリア名
const MIN_WEIGHT_WITHOUT_JAPAN_POST = 0.5  // 日本郵便除外時の最小重量(kg) - 戻すときは0に

export async function POST(request: NextRequest) {
  try {
    const { productIds, forceZeroCost } = await request.json()

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: '商品IDが指定されていません' },
        { status: 400 }
      )
    }

    console.log(`💰 利益計算開始 V6.4: ${productIds.length}件`)
    if (EXCLUDE_JAPAN_POST_FOR_USA) {
      console.log(`⚠️ 日本郵便除外モード: ON (USA向け)`)
    }

    // 商品データを取得
    const { data: products, error: fetchError } = await supabase
      .from('products_master')
      .select('*')
      .in('id', productIds)

    if (fetchError) throw fetchError

    const updated: string[] = []
    const errors: any[] = []
    const zeroCostWarnings: any[] = []

    for (const product of products || []) {
      try {
        const listingData = product.listing_data || {}
        const scrapedData = product.scraped_data || {}
        
        // 重量取得
        const weightG = 
          listingData.weight_g ||
          product.weight_g ||
          scrapedData.weight_g ||
          2  // デフォルト2g
        const weightKg = weightG / 1000
        
        // 価格取得
        let costJPY = 
          product.price_jpy ||
          product.purchase_price_jpy ||
          scrapedData.price ||
          listingData.cost_jpy ||
          0
        
        // 0円確認
        const isZeroCostConfirmed = 
          listingData.is_zero_cost_confirmed === true ||
          product.is_zero_cost_confirmed === true ||
          forceZeroCost === true
        const isZeroCost = costJPY <= 0
        
        // HTSコード
        const htsCode = product.hts_code || listingData.hts_code || '9504.40.00.00'
        
        // 原産国
        const originCountry = product.origin_country || listingData.origin_country || 'JP'
        
        console.log(`📦 [${product.sku}] 重量: ${weightG}g, 仕入: ¥${costJPY}, HTS: ${htsCode}, 原産国: ${originCountry}`)
        
        // 0円チェック
        if (isZeroCost && !isZeroCostConfirmed) {
          zeroCostWarnings.push({
            id: product.id,
            sku: product.sku,
            title: product.title,
            message: '仕入れ価格が0円です'
          })
          continue
        }
        
        // ==========================================
        // 🔥 Step 1: ebay_shipping_masterから配送ポリシー取得
        // 日本郵便を一時的に除外（USA向け）
        // ==========================================
        
        // 🚨 一時的: 日本郵便除外時は最小重量0.5kgを適用
        let effectiveWeightKg = weightKg
        if (EXCLUDE_JAPAN_POST_FOR_USA && weightKg < MIN_WEIGHT_WITHOUT_JAPAN_POST) {
          effectiveWeightKg = MIN_WEIGHT_WITHOUT_JAPAN_POST
          console.log(`  📦 軽量商品: ${weightKg}kg → ${effectiveWeightKg}kg に調整（クーリエ最小重量）`)
        }
        
        let shippingQuery = supabase
          .from('ebay_shipping_master')
          .select('*')
          .eq('country_code', 'US')
          .lte('weight_from_kg', effectiveWeightKg)
          .gte('weight_to_kg', effectiveWeightKg)
          .order('shipping_cost_with_margin_usd', { ascending: true })
        
        const { data: allShippingOptions, error: shippingError } = await shippingQuery
        
        if (shippingError) {
          console.error('配送ポリシー取得エラー:', shippingError)
          errors.push({ id: product.id, error: '配送ポリシー取得エラー' })
          continue
        }
        
        if (!allShippingOptions || allShippingOptions.length === 0) {
          console.warn(`⚠️ 配送ポリシーなし: ${effectiveWeightKg}kg`)
          errors.push({ id: product.id, error: `重量${effectiveWeightKg}kgの配送ポリシーがありません` })
          continue
        }
        
        // 🚨 一時的: 日本郵便を除外してフィルタリング
        let shippingOptions = allShippingOptions
        if (EXCLUDE_JAPAN_POST_FOR_USA) {
          shippingOptions = allShippingOptions.filter(
            opt => !EXCLUDED_CARRIERS.includes(opt.carrier_name)
          )
          console.log(`  📦 日本郵便除外後: ${allShippingOptions.length}件 → ${shippingOptions.length}件`)
        }
        
        if (shippingOptions.length === 0) {
          console.warn(`⚠️ 日本郵便以外の配送オプションなし（${effectiveWeightKg}kg）`)
          errors.push({ id: product.id, error: `重量${effectiveWeightKg}kgで日本郵便以外の配送オプションがありません` })
          continue
        }
        
        // 最安の配送オプションを選択（日本郵便除外後）
        const selectedShipping = shippingOptions[0]
        const shippingCostUSD = parseFloat(selectedShipping.shipping_cost_with_margin_usd) || 0
        const baseShippingUSD = parseFloat(selectedShipping.base_rate_usd) || shippingCostUSD
        
        console.log(`🚚 配送ポリシー選択: ${selectedShipping.carrier_name} - ${selectedShipping.service_name} - $${shippingCostUSD}`)
        
        // ==========================================
        // 🔥 Step 2: 関税率取得（ddp_tariff_matrix優先、なければhts_codes_details）
        // ==========================================
        const hsCodeNormalized = htsCode.replace(/\./g, '')
        const hsCodeShort = hsCodeNormalized.substring(0, 8)  // 8桁
        let baseTariffRate = 0
        let section301Rate = 0
        let additionalTariff2025 = 0
        let tariffSource = 'none'
        
        // 商品価格（仮計算）
        const estimatedPrice = (costJPY / EXCHANGE_RATE) * 2.5
        
        // Step 2a: ddp_tariff_matrixから取得を試みる
        const { data: ddpTariffData } = await supabase
          .from('ddp_tariff_matrix')
          .select('*')
          .eq('origin_country_code', originCountry)
          .or(`hts_code.eq.${htsCode},hts_code.eq.${hsCodeNormalized},hts_code.eq.${hsCodeShort}`)
          .lte('price_band_min', estimatedPrice)
          .gte('price_band_max', estimatedPrice)
          .limit(1)
          .maybeSingle()
        
        if (ddpTariffData) {
          baseTariffRate = parseFloat(ddpTariffData.base_duty_rate) / 100 || 0
          section301Rate = parseFloat(ddpTariffData.section301_rate) / 100 || 0
          additionalTariff2025 = parseFloat(ddpTariffData.additional_tariff_2025) / 100 || 0
          tariffSource = 'ddp_tariff_matrix'
          console.log(`📋 関税率(ddp_tariff_matrix): base=${baseTariffRate*100}%, s301=${section301Rate*100}%, add2025=${additionalTariff2025*100}%`)
        } else {
          // Step 2b: hts_codes_detailsからフォールバック
          const { data: htsData } = await supabase
            .from('hts_codes_details')
            .select('hts_number, general_rate')
            .or(`hts_number.eq.${htsCode},hts_number.eq.${hsCodeNormalized}`)
            .limit(1)
            .maybeSingle()
          
          if (htsData && htsData.general_rate) {
            const rateStr = htsData.general_rate
            if (rateStr !== 'Free') {
              const match = rateStr.match(/([\d.]+)%?/)
              if (match) {
                baseTariffRate = parseFloat(match[1]) / 100
              }
            }
            tariffSource = 'hts_codes_details'
          }
          
          // ==========================================
          // 🔥 Step 2c: country_additional_tariffsから原産国別追加関税を取得
          // ==========================================
          const { data: countryTariff } = await supabase
            .from('country_additional_tariffs')
            .select('*')
            .eq('country_code', originCountry)
            .eq('is_active', true)
            .maybeSingle()
          
          if (countryTariff) {
            // Trump相互関税 (2025年)
            additionalTariff2025 = parseFloat(countryTariff.additional_rate) || 0
            console.log(`📋 原産国別追加関税(${originCountry}): ${(additionalTariff2025*100).toFixed(1)}% - ${countryTariff.tariff_type}`)
            tariffSource = 'hts_codes_details + country_additional_tariffs'
          } else {
            // 追加関税データがない場合は0
            additionalTariff2025 = 0
            console.log(`📋 原産国別追加関税(${originCountry}): データなし`)
          }
          
          // Section 301追加関税（中国のみ・別途上乗せ）
          if (originCountry === 'CN') {
            section301Rate = 0.25  // 25%
            console.log(`📋 中国Section 301追加: +25%`)
          }
          
          console.log(`📋 関税率合計: base=${baseTariffRate*100}%, s301=${section301Rate*100}%, add2025=${(additionalTariff2025*100).toFixed(1)}%`)
        }
        
        const totalTariffRate = baseTariffRate + section301Rate + additionalTariff2025
        console.log(`📋 合計関税率: ${(totalTariffRate * 100).toFixed(2)}% (source: ${tariffSource})`)
        
        // ==========================================
        // 🔥 Step 3: 価格計算
        // ==========================================
        const costUSD = (isZeroCost ? 1 : costJPY) / EXCHANGE_RATE
        const targetMargin = 0.15  // 15%目標利益率
        
        // FVF率
        const fvfRate = 0.1515
        const payoneerRate = 0.02
        const exchangeLossRate = 0.03
        const internationalFeeRate = 0.015
        const variableRate = fvfRate + payoneerRate + exchangeLossRate + internationalFeeRate
        
        // 反復計算で商品価格を求める
        let productPrice = costUSD * 2  // 初期値
        
        for (let i = 0; i < 10; i++) {
          // DDP費用
          const tariff = productPrice * totalTariffRate
          const salesTax = productPrice * 0.08
          const mpf = productPrice * 0.003464
          const ddpCost = tariff + salesTax + mpf + DDP_SERVICE_FEE
          
          // 固定コスト
          const fixedCost = costUSD + baseShippingUSD + ddpCost + 0.35  // 出品手数料
          
          // 目標利益率から総売上を逆算
          const requiredRevenue = fixedCost / (1 - targetMargin - variableRate)
          const newProductPrice = requiredRevenue - shippingCostUSD
          
          if (Math.abs(newProductPrice - productPrice) < 0.01) break
          productPrice = newProductPrice
        }
        
        // 丸め
        productPrice = Math.ceil(productPrice)
        const totalRevenue = productPrice + shippingCostUSD
        
        // DDP費用計算
        const tariffAmount = productPrice * totalTariffRate
        const salesTaxAmount = productPrice * 0.08
        const mpfAmount = productPrice * 0.003464
        const ddpTotal = tariffAmount + salesTaxAmount + mpfAmount + DDP_SERVICE_FEE
        
        // ==========================================
        // 🔥 DDU vs DDP 価格計算
        // ==========================================
        // 現在の商品価格は関税込み（DDP前提）で計算されている
        // DDU用の商品価格 = 関税分を引いた価格
        
        // DDP価格 = 商品価格（関税込み）+ 送料
        const ddpPriceUsd = productPrice + shippingCostUSD
        
        // DDU用商品価格 = DDP商品価格から関税・税金・手数料を引く
        // 関税 = 商品価格 × 関税率
        // Sales Tax = 商品価格 × 8%
        // MPF = 商品価格 × 0.3464%
        // DDPサービス料 = $15
        const ddpCostsPerDollar = totalTariffRate + 0.08 + 0.003464  // 商品価格あたりのDDPコスト率
        
        // DDU商品価格 = DDP商品価格 / (1 + DDPコスト率) - DDPサービス料の影響を考慮
        // 簡略化: DDU商品価格 ≈ DDP商品価格 - 関税等
        const dduProductPrice = Math.round(productPrice / (1 + ddpCostsPerDollar) - (DDP_SERVICE_FEE / (1 + ddpCostsPerDollar)))
        
        // DDU価格 = DDU商品価格 + 送料（関税なし、買い手が関税負担）
        const dduPriceUsd = dduProductPrice + shippingCostUSD
        
        // 買い手が支払う関税額（DDUの場合）
        // DDU商品価格に対する関税を計算
        const buyerTariffAmount = dduProductPrice * totalTariffRate
        const buyerSalesTax = dduProductPrice * 0.08
        const buyerMpf = dduProductPrice * 0.003464
        const buyerDutyAmount = buyerTariffAmount + buyerSalesTax + buyerMpf
        
        console.log(`💲 価格計算:`)
        console.log(`   DDP商品価格: ${productPrice} (関税込み)`)
        console.log(`   DDU商品価格: ${dduProductPrice} (関税なし)`)
        console.log(`   送料: ${shippingCostUSD}`)
        console.log(`   DDP価格: ${ddpPriceUsd.toFixed(2)} (売り手が関税負担)`)
        console.log(`   DDU価格: ${dduPriceUsd.toFixed(2)} + 買い手関税${buyerDutyAmount.toFixed(2)}`)
        
        // eBay手数料
        const fvfFee = totalRevenue * fvfRate
        const payoneerFee = totalRevenue * payoneerRate
        const exchangeLossFee = totalRevenue * exchangeLossRate
        const internationalFee = totalRevenue * internationalFeeRate
        const insertionFee = 0.35
        const ebayFeesTotal = fvfFee + payoneerFee + exchangeLossFee + internationalFee + insertionFee
        
        // 利益計算
        const totalCosts = costUSD + baseShippingUSD + ddpTotal + ebayFeesTotal
        let profit = totalRevenue - totalCosts
        let profitMargin = (profit / totalRevenue) * 100
        
        // 0円仕入れの場合、利益を再計算
        if (isZeroCost) {
          profit = totalRevenue - (baseShippingUSD + ddpTotal + ebayFeesTotal)
          profitMargin = (profit / totalRevenue) * 100
        }
        
        console.log(`✅ 計算完了: 商品$${productPrice}, 送料$${shippingCostUSD}, 利益$${profit.toFixed(2)} (${profitMargin.toFixed(1)}%)`)
        
        // ==========================================
        // 🔥 Step 4: データベース更新
        // ==========================================
        const updateData = {
          listing_data: {
            ...listingData,
            weight_g: weightG,
            cost_jpy: costJPY,
            is_zero_cost: isZeroCost,
            is_zero_cost_confirmed: isZeroCost ? true : listingData.is_zero_cost_confirmed,
            
            // 配送ポリシー情報
            usa_shipping_policy_name: selectedShipping.service_name,
            shipping_service: selectedShipping.service_name,
            carrier_name: selectedShipping.carrier_name,
            carrier_service: selectedShipping.service_code,
            carrier_code: selectedShipping.service_code,
            service_type: selectedShipping.service_type,
            
            // 価格情報
            product_price_usd: productPrice,           // DDP商品価格（関税込み）
            ddu_product_price_usd: dduProductPrice,    // DDU商品価格（関税なし）
            ddp_price_usd: ddpPriceUsd,                // DDP最終価格
            ddu_price_usd: dduPriceUsd,                // DDU最終価格
            buyer_duty_amount_usd: buyerDutyAmount,    // 🔥 DDUの場合の買い手関税額
            
            // 送料情報
            base_shipping_usd: baseShippingUSD,
            shipping_cost_usd: shippingCostUSD,
            
            // 関税情報
            tariff_rate: totalTariffRate,
            base_tariff_rate: baseTariffRate,
            section_301_rate: section301Rate,
            additional_tariff_2025: additionalTariff2025,
            tariff_source: tariffSource,
            tariff_amount_usd: tariffAmount,
            sales_tax_usd: salesTaxAmount,
            mpf_usd: mpfAmount,
            ddp_service_fee_usd: DDP_SERVICE_FEE,
            ddp_total_usd: ddpTotal,
            
            // 利益情報
            profit_margin: profitMargin,
            profit_amount_usd: profit,
            
            // メタ
            profit_calculated_at: new Date().toISOString(),
            calculation_version: 'V6.4',
            effective_weight_kg: effectiveWeightKg,
            original_weight_kg: weightKg,
            japan_post_excluded: EXCLUDE_JAPAN_POST_FOR_USA
          },
          
          // トップレベルにも保存
          shipping_policy: selectedShipping.service_name,
          shipping_cost_usd: shippingCostUSD,
          ddu_price_usd: dduPriceUsd,
          ddp_price_usd: ddpPriceUsd,
          profit_margin: profitMargin,
          profit_amount_usd: profit,
          default_profit_margin: profitMargin,
          default_profit_amount_usd: profit,
          updated_at: new Date().toISOString()
        }
        
        const { error: updateError } = await supabase
          .from('products_master')
          .update(updateData)
          .eq('id', product.id)
        
        if (updateError) throw updateError
        
        updated.push(product.id)
        
      } catch (err: any) {
        console.error(`❌ エラー: ${product.title}`, err)
        errors.push({ id: product.id, error: err.message })
      }
    }

    console.log(`📊 完了: ${updated.length}件成功, ${errors.length}件失敗, ${zeroCostWarnings.length}件0円警告`)

    return NextResponse.json({
      success: true,
      updated: updated.length,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      zeroCostWarnings: zeroCostWarnings.length > 0 ? zeroCostWarnings : undefined,
      requiresZeroCostConfirmation: zeroCostWarnings.length > 0,
      config: {
        japanPostExcluded: EXCLUDE_JAPAN_POST_FOR_USA,
        version: 'V6.4'
      }
    })

  } catch (error: any) {
    console.error('❌ 利益計算エラー:', error)
    return NextResponse.json(
      { error: error.message || '利益計算に失敗しました' },
      { status: 500 }
    )
  }
}
