/**
 * 出品ツール用: アカウント別の配送ポリシーIDを取得
 * 商品の重量・価格に基づいて適切なポリシーを自動選択
 */

import { createClient } from '@/lib/supabase/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const account = searchParams.get('account') as 'mjt' | 'green'
    const weightG = parseFloat(searchParams.get('weight_g') || '0')
    const priceUsd = parseFloat(searchParams.get('price_usd') || '0')

    if (!account) {
      return NextResponse.json({ error: 'account parameter is required' }, { status: 400 })
    }

    if (!weightG || !priceUsd) {
      return NextResponse.json({ error: 'weight_g and price_usd are required' }, { status: 400 })
    }

    const supabase = createClient()

    // 1. 重量帯を特定（60段階）
    const weightBand = getWeightBand(weightG)

    // 2. 価格帯を特定（20段階）
    const priceBand = getPriceBand(priceUsd)

    console.log(`🔍 Policy Search: account=${account}, weight=${weightG}g (band=${weightBand}), price=$${priceUsd} (band=${priceBand})`)

    // 3. Supabaseから該当するポリシーを検索
    const { data: policies, error } = await supabase
      .from('ebay_shipping_policies_final')
      .select('*')
      .eq('ebay_account', account)
      .eq('ebay_policy_status', 'created')
      .eq('weight_band_no', weightBand)
      .lte('product_price_usd', priceUsd)
      .order('product_price_usd', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!policies || policies.length === 0) {
      // フォールバック: 同じ重量帯で最も安い価格帯を使用
      const { data: fallbackPolicies } = await supabase
        .from('ebay_shipping_policies_final')
        .select('*')
        .eq('ebay_account', account)
        .eq('ebay_policy_status', 'created')
        .eq('weight_band_no', weightBand)
        .order('product_price_usd', { ascending: true })
        .limit(1)

      if (!fallbackPolicies || fallbackPolicies.length === 0) {
        return NextResponse.json({
          error: 'No matching policy found',
          details: {
            account,
            weightG,
            priceUsd,
            weightBand,
            priceBand
          }
        }, { status: 404 })
      }

      const fallbackPolicy = fallbackPolicies[0]
      console.log(`⚠️  Using fallback policy: ${fallbackPolicy.policy_name}`)

      return NextResponse.json({
        success: true,
        policyId: fallbackPolicy.ebay_policy_id,
        policyName: fallbackPolicy.policy_name,
        rateTableName: fallbackPolicy.rate_table_name,
        usaShippingUsd: fallbackPolicy.usa_total_shipping_usd,
        weightBandNo: fallbackPolicy.weight_band_no,
        fallback: true
      })
    }

    const policy = policies[0]
    console.log(`✅ Found policy: ${policy.policy_name} (ID: ${policy.ebay_policy_id})`)

    return NextResponse.json({
      success: true,
      policyId: policy.ebay_policy_id,
      policyName: policy.policy_name,
      rateTableName: policy.rate_table_name,
      usaShippingUsd: policy.usa_total_shipping_usd,
      weightBandNo: policy.weight_band_no,
      fallback: false
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * 重量帯を計算（60段階）
 */
function getWeightBand(weightG: number): number {
  if (weightG <= 100) return 1
  if (weightG <= 200) return 2
  if (weightG <= 300) return 3
  if (weightG <= 400) return 4
  if (weightG <= 500) return 5
  if (weightG <= 600) return 6
  if (weightG <= 700) return 7
  if (weightG <= 800) return 8
  if (weightG <= 900) return 9
  if (weightG <= 1000) return 10
  if (weightG <= 1250) return 11
  if (weightG <= 1500) return 12
  if (weightG <= 1750) return 13
  if (weightG <= 2000) return 14
  if (weightG <= 2250) return 15
  if (weightG <= 2500) return 16
  if (weightG <= 2750) return 17
  if (weightG <= 3000) return 18
  if (weightG <= 3500) return 19
  if (weightG <= 4000) return 20
  if (weightG <= 4500) return 21
  if (weightG <= 5000) return 22
  if (weightG <= 5500) return 23
  if (weightG <= 6000) return 24
  if (weightG <= 6500) return 25
  if (weightG <= 7000) return 26
  if (weightG <= 7500) return 27
  if (weightG <= 8000) return 28
  if (weightG <= 8500) return 29
  if (weightG <= 9000) return 30
  if (weightG <= 9500) return 31
  if (weightG <= 10000) return 32
  if (weightG <= 11000) return 33
  if (weightG <= 12000) return 34
  if (weightG <= 13000) return 35
  if (weightG <= 14000) return 36
  if (weightG <= 15000) return 37
  if (weightG <= 16000) return 38
  if (weightG <= 17000) return 39
  if (weightG <= 18000) return 40
  if (weightG <= 19000) return 41
  if (weightG <= 20000) return 42
  if (weightG <= 21000) return 43
  if (weightG <= 22000) return 44
  if (weightG <= 23000) return 45
  if (weightG <= 24000) return 46
  if (weightG <= 25000) return 47
  if (weightG <= 26000) return 48
  if (weightG <= 27000) return 49
  if (weightG <= 28000) return 50
  if (weightG <= 29000) return 51
  if (weightG <= 30000) return 52
  // 30kg以上は別途定義
  return 60
}

/**
 * 価格帯を計算（20段階）
 */
function getPriceBand(priceUsd: number): number {
  if (priceUsd <= 5) return 1
  if (priceUsd <= 10) return 2
  if (priceUsd <= 15) return 3
  if (priceUsd <= 20) return 4
  if (priceUsd <= 25) return 5
  if (priceUsd <= 30) return 6
  if (priceUsd <= 40) return 7
  if (priceUsd <= 50) return 8
  if (priceUsd <= 60) return 9
  if (priceUsd <= 70) return 10
  if (priceUsd <= 80) return 11
  if (priceUsd <= 90) return 12
  if (priceUsd <= 100) return 13
  if (priceUsd <= 120) return 14
  if (priceUsd <= 150) return 15
  if (priceUsd <= 180) return 16
  if (priceUsd <= 200) return 17
  if (priceUsd <= 250) return 18
  if (priceUsd <= 300) return 19
  // 300以上
  return 20
}
