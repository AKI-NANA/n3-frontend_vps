// /app/api/products/create-variation/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface VariationRequest {
  selectedItemIds: string[] // UUID[]
  parentSkuName: string
  attributes: Record<string, string>
  composition: Array<{
    id: string
    name: string
    sku: string
    quantity: number
  }>
}

interface DDPCalculation {
  productId: string
  ddpCostUsd: number
  shippingSurcharge: number
}

/**
 * P4-A: Zonos精密DDP計算API呼び出し
 * Zonos APIを使用して正確なDDPコストを計算
 * エラー時は簡易計算にフォールバック
 */
async function calculatePreciseDDP(
  weightG: number,
  priceUsd: number,
  htsCode?: string,
  originCountry?: string,
  destinationCountry?: string,
  shippingCostUsd?: number
): Promise<number> {
  const estimatedShippingCost = weightG < 1000 ? 15 : weightG < 3000 ? 25 : 45

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/external/zonos/calculate-ddp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        htsCode: htsCode || '9999.99.9999',
        originCountry: originCountry || 'CN',
        destinationCountry: destinationCountry || 'US',
        value: priceUsd,
        shippingCost: shippingCostUsd || estimatedShippingCost,
        weight: weightG / 1000, // グラムをキログラムに変換
        quantity: 1
      })
    })

    const data = await response.json()

    if (data.success && data.data) {
      console.log(`✅ Zonos精密DDP計算成功: $${data.data.totalDDP.toFixed(2)}`)
      return data.data.totalDDP
    } else {
      throw new Error(data.error || 'Zonos API失敗')
    }
  } catch (error: any) {
    console.warn('⚠️ Zonos API失敗、簡易計算使用:', error.message)

    // フォールバック: 簡易DDP計算
    const shippingCost = shippingCostUsd || estimatedShippingCost
    const tariffRate = 0.065 // 6.5% (代表値)
    const cifPrice = priceUsd + shippingCost
    const tariff = cifPrice * tariffRate
    const mpf = Math.max(cifPrice * 0.003464, 0.3)
    const hmf = cifPrice * 0.00125
    const ddpFee = 5 // eBay DDP fee

    return priceUsd + shippingCost + tariff + mpf + hmf + ddpFee
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body: VariationRequest = await request.json()

    const { selectedItemIds, parentSkuName, attributes, composition } = body

    // 1. 構成品/子SKUのデータを取得
    const { data: childProducts, error: fetchError } = await supabase
      .from('inventory_master')
      .select('*')
      .in('id', selectedItemIds)

    if (fetchError) {
      console.error('商品取得エラー:', fetchError)
      return NextResponse.json(
        { error: `商品データの取得に失敗しました: ${fetchError.message}` },
        { status: 500 }
      )
    }

    if (!childProducts || childProducts.length < 2) {
      return NextResponse.json(
        { error: 'バリエーションには2つ以上のアイテムが必要です。' },
        { status: 400 }
      )
    }

    // 2. 各商品のDDPコストを精密計算（P4-A: Zonos API使用）
    const calculations: DDPCalculation[] = await Promise.all(
      childProducts.map(async (product) => {
        const weightG = product.weight_g || 500 // デフォルト500g
        const priceUsd = product.selling_price || product.cost_price || 0
        const ddpCostUsd = await calculatePreciseDDP(
          weightG,
          priceUsd,
          product.hts_code,
          product.origin_country,
          product.destination_country,
          product.shipping_cost_usd
        )

        return {
          productId: product.id,
          ddpCostUsd,
          shippingSurcharge: 0 // 後で計算
        }
      })
    )

    // 3. 最小DDPコストを特定（Item Priceの基準）
    const minDdpCost = Math.min(...calculations.map(c => c.ddpCostUsd))

    // 4. 各子SKUの送料サーチャージを計算
    calculations.forEach(calc => {
      calc.shippingSurcharge = calc.ddpCostUsd - minDdpCost
    })

    // 5. リスクチェック
    const hasRisk = calculations.some(c => c.shippingSurcharge > 50)
    if (hasRisk) {
      console.warn('⚠️ 送料サーチャージが$50を超える商品があります')
    }

    // 6. トランザクション: 親SKUを作成し、子SKUを更新
    const { data: parentProduct, error: parentError } = await supabase
      .from('inventory_master')
      .insert({
        unique_id: `VAR-${Date.now()}`,
        product_name: parentSkuName,
        sku: parentSkuName,
        product_type: 'stock',
        physical_quantity: 0,
        listing_quantity: 0,
        cost_price: minDdpCost,
        selling_price: minDdpCost,
        is_variation_parent: true,
        is_manual_entry: true,
        notes: `バリエーション親SKU - 構成品: ${childProducts.map(p => p.sku).join(', ')}`
      })
      .select()
      .single()

    if (parentError) {
      console.error('親SKU作成エラー:', parentError)
      return NextResponse.json(
        { error: `親SKUの作成に失敗しました: ${parentError.message}` },
        { status: 500 }
      )
    }

    // 7. 子SKUを更新（parent_sku を設定）
    const childUpdatePromises = childProducts.map((child, index) => {
      const calc = calculations.find(c => c.productId === child.id)!

      return supabase
        .from('inventory_master')
        .update({
          parent_sku: parentProduct.sku,
          is_variation_child: true,
          is_individual_listing_blocked: true, // P4-D: バリエーション子SKUは個別出品禁止
          variation_attributes: {
            shipping_surcharge_usd: calc.shippingSurcharge,
            ddp_cost_usd: calc.ddpCostUsd,
            ...attributes
          }
        })
        .eq('id', child.id)
    })

    const updateResults = await Promise.all(childUpdatePromises)

    // エラーチェック
    const updateErrors = updateResults.filter(r => r.error)
    if (updateErrors.length > 0) {
      console.error('子SKU更新エラー:', updateErrors)
      // ロールバック（親SKUを削除）
      await supabase
        .from('inventory_master')
        .delete()
        .eq('id', parentProduct.id)

      return NextResponse.json(
        { error: '子SKUの更新に失敗しました。処理をロールバックしました。' },
        { status: 500 }
      )
    }

    console.log(`✅ バリエーション作成成功: ${parentSkuName} (${childProducts.length}個の子SKU)`)

    // 8. 成功応答
    return NextResponse.json({
      success: true,
      message: 'バリエーションの親SKUが作成され、価格ロジックが適用されました。',
      parentSku: parentProduct.sku,
      parentId: parentProduct.id,
      minPrice: minDdpCost,
      childCount: childProducts.length,
      calculations: calculations
    })

  } catch (error: any) {
    console.error('バリエーション作成APIエラー:', error)
    return NextResponse.json(
      { error: `バリエーション作成中にエラーが発生しました: ${error.message}` },
      { status: 500 }
    )
  }
}
