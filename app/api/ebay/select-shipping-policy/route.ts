// app/api/ebay/select-shipping-policy/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { weight, itemPriceUSD, quantity = 1 } = await request.json()

    if (!weight || !itemPriceUSD) {
      return NextResponse.json({
        success: false,
        error: '重量と商品価格が必要です'
      }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    )

    // 重量帯を判定 (1-60)
    const weightBandNumber = getWeightBand(weight)
    
    // 価格帯を判定 ($50-$3500の20段階)
    const priceBand = getPriceBand(itemPriceUSD)
    
    // ポリシー名を構築: RT{重量帯番号:02d}_P{価格:04d}
    const policyName = `RT${String(weightBandNumber).padStart(2, '0')}_P${String(priceBand).padStart(4, '0')}`

    // ポリシーを検索
    const { data: policies, error } = await supabase
      .from('ebay_shipping_policies_v2')
      .select('*')
      .eq('policy_name', policyName)
      .eq('active', true)
      .limit(1)

    if (error || !policies || policies.length === 0) {
      return NextResponse.json({
        success: false,
        error: `適切な配送ポリシーが見つかりません: ${policyName}`,
        debug: { weight, itemPriceUSD, weightBandNumber, priceBand, policyName }
      }, { status: 404 })
    }

    const selectedPolicy = policies[0]

    // ゾーン別料金を取得
    const { data: zoneRates } = await supabase
      .from('ebay_policy_zone_rates_v2')
      .select('*')
      .eq('policy_id', selectedPolicy.id)

    const usaRate = zoneRates?.find(r => r.zone_code === 'US')
    const otherRate = zoneRates?.find(r => r.zone_type === 'OTHER')

    const calculateShipping = (rate: any) => {
      if (!rate) return { total: 0, handling: 0, breakdown: '' }
      
      const first = rate.first_item_shipping_usd || rate.display_shipping_usd || 0
      const additional = rate.additional_item_shipping_usd || rate.actual_cost_usd || 0
      const handling = rate.handling_fee_usd || 0

      return {
        total: first + (additional * (quantity - 1)),
        handling,
        breakdown: quantity === 1
          ? `1個: $${first.toFixed(2)}`
          : `1個目$${first.toFixed(2)} + 追加${quantity - 1}個×$${additional.toFixed(2)}`
      }
    }

    return NextResponse.json({
      success: true,
      policy: {
        id: selectedPolicy.id,
        name: selectedPolicy.policy_name,
        rate_table: selectedPolicy.rate_table_name,
        pricing_basis: selectedPolicy.pricing_basis || 'USA_DDP',
        weight_band: weightBandNumber,
        price_band: priceBand
      },
      shipping: {
        usa: calculateShipping(usaRate),
        other: calculateShipping(otherRate)
      }
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 })
  }
}

// 重量帯を判定 (1-60の範囲)
function getWeightBand(weight: number): number {
  // 0.5kg刻みで60段階
  // 0.0-0.5kg = 1, 0.5-1.0kg = 2, ..., 29.5-30.0kg = 60
  if (weight <= 0.5) return 1
  if (weight > 30) return 60
  
  return Math.min(60, Math.ceil(weight / 0.5))
}

// 価格帯を判定 (20段階: $50, $100, $150, ..., $3500)
function getPriceBand(price: number): number {
  const bands = [
    50, 100, 150, 200, 250, 300, 350, 400, 450, 500,
    600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000, 3500
  ]
  
  // 最も近い価格帯を返す
  for (const band of bands) {
    if (price <= band) return band
  }
  
  return 3500 // 上限
}
