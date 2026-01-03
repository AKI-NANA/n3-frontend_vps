/**
 * 棚卸し統計取得API
 * GET /api/inventory/stats
 *
 * 以下の統計を効率的に取得:
 * - 総件数、在庫あり、在庫なし
 * - マーケットプレイス別件数
 * - 在庫総額（原価/販売価格）
 * - アカウント別統計
 * - バリエーション統計
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // 並列で統計取得（パフォーマンス最適化）
    const [
      totalResult,
      inStockResult,
      outOfStockResult,
      allData,
      variationParentResult,
      variationMemberResult
    ] = await Promise.all([
      // 総件数
      supabase.from('inventory_master').select('*', { count: 'exact', head: true }),

      // 在庫あり
      supabase.from('inventory_master').select('*', { count: 'exact', head: true }).gt('physical_quantity', 0),

      // 在庫なし
      supabase.from('inventory_master').select('*', { count: 'exact', head: true }).eq('physical_quantity', 0),

      // 価格・マーケットプレイス情報取得（最小限のカラム）
      supabase.from('inventory_master').select('sku, source_data, cost_price, selling_price, physical_quantity, listing_quantity, product_type, category, is_variation_parent, is_variation_member, is_variation_child, current_price_phase'),

      // バリエーション親
      supabase.from('inventory_master').select('*', { count: 'exact', head: true }).eq('is_variation_parent', true),

      // バリエーションメンバー
      supabase.from('inventory_master').select('*', { count: 'exact', head: true }).or('is_variation_member.eq.true,is_variation_child.eq.true')
    ])

    if (allData.error) {
      console.error('Stats data error:', allData.error)
      return NextResponse.json(
        { success: false, error: allData.error.message },
        { status: 500 }
      )
    }

    const products = allData.data || []

    // マーケットプレイス別集計
    const byMarketplace: Record<string, number> = {}
    // カテゴリリスト
    const categoriesSet = new Set<string>()
    // アカウント別統計
    const accountStats: Record<string, any> = {
      MJT: { total: 0, in_stock: 0, out_of_stock: 0, total_value: 0, total_selling_value: 0, listing_count: 0 },
      GREEN: { total: 0, in_stock: 0, out_of_stock: 0, total_value: 0, total_selling_value: 0, listing_count: 0 },
      manual: { total: 0, in_stock: 0, out_of_stock: 0, total_value: 0, total_selling_value: 0, listing_count: 0 }
    }

    let totalCostValue = 0
    let totalSellingValue = 0
    let stockCount = 0
    let dropshipCount = 0
    let setCount = 0

    // グルーピング候補カウント
    let groupingCandidates = 0

    products.forEach((item: any) => {
      const mp = item.source_data?.marketplace || 'manual'
      byMarketplace[mp] = (byMarketplace[mp] || 0) + 1

      // カテゴリ収集
      if (item.category) {
        categoriesSet.add(item.category)
      }

      // 在庫総額計算
      const costValue = (item.cost_price || 0) * (item.physical_quantity || 0)
      const sellingValue = (item.selling_price || 0) * (item.listing_quantity || 0)
      totalCostValue += costValue
      totalSellingValue += sellingValue

      // 商品タイプ集計
      const sku = item.sku?.toLowerCase() || ''
      if (item.product_type === 'stock' || sku.includes('stock')) {
        stockCount++
      } else if (item.product_type === 'dropship') {
        dropshipCount++
      } else if (item.product_type === 'set') {
        setCount++
      }

      // アカウント別統計
      const account = item.source_data?.ebay_account?.toUpperCase() || 'manual'
      const accountKey = ['MJT', 'GREEN'].includes(account) ? account : 'manual'

      if (accountStats[accountKey]) {
        accountStats[accountKey].total++
        if (item.physical_quantity > 0) {
          accountStats[accountKey].in_stock++
        } else {
          accountStats[accountKey].out_of_stock++
        }
        accountStats[accountKey].total_value += costValue
        accountStats[accountKey].total_selling_value += sellingValue
        if (item.listing_quantity > 0) {
          accountStats[accountKey].listing_count++
        }
      }

      // グルーピング候補判定
      if (
        item.category &&
        item.physical_quantity > 0 &&
        !item.is_variation_parent &&
        !item.is_variation_member &&
        !item.is_variation_child &&
        item.product_type !== 'set'
      ) {
        groupingCandidates++
      }
    })

    // バリエーション統計
    const variationStats = {
      parent_count: variationParentResult.count || 0,
      member_count: variationMemberResult.count || 0,
      standalone_count: (totalResult.count || 0) - (variationParentResult.count || 0) - (variationMemberResult.count || 0),
      grouping_candidates: groupingCandidates
    }

    // 在庫最適化統計（簡易版）
    const warningInventory = products.filter((p: any) => p.current_price_phase === 'WARNING').length
    const liquidationInventory = products.filter((p: any) => p.current_price_phase === 'LIQUIDATION').length

    // 仕入れ代金総額（円）を計算
    const EXCHANGE_RATE_USD_JPY = 150
    const stockProductsWithCost = products.filter((p: any) =>
      p.physical_quantity > 0 && p.cost_price > 0
    )
    const totalCostJpy = stockProductsWithCost.reduce((sum: number, p: any) => {
      const costPrice = p.cost_price || 0
      // 1000以下はUSDと判定してJPYに変換
      const costInJpy = costPrice < 1000 ? costPrice * EXCHANGE_RATE_USD_JPY : costPrice
      return sum + (costInJpy * (p.physical_quantity || 0))
    }, 0)

    console.log(`[inventory/stats] 統計取得完了: 総数${totalResult.count}件`)

    return NextResponse.json({
      success: true,
      stats: {
        total: totalResult.count || 0,
        in_stock: inStockResult.count || 0,
        out_of_stock: outOfStockResult.count || 0,
        stock_count: stockCount,
        dropship_count: dropshipCount,
        set_count: setCount,
        total_value: Math.round(totalCostValue),
        total_selling_value: Math.round(totalSellingValue),
        by_marketplace: byMarketplace,
        account_stats: accountStats,
        variation_stats: variationStats,
        warning_inventory: warningInventory,
        liquidation_inventory: liquidationInventory,
        total_cost_jpy: Math.round(totalCostJpy),
        stock_with_cost_count: stockProductsWithCost.length,
        categories: Array.from(categoriesSet).sort()
      }
    })

  } catch (error: any) {
    console.error('Inventory stats API error:', error)
    return NextResponse.json(
      { success: false, error: error.message || '不明なエラー' },
      { status: 500 }
    )
  }
}
