import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  batchPriceReduction,
  determinePricePhase,
  calculateRecommendedPrice,
  getAlertProducts
} from '@/lib/services/inventory/automatic-price-reduction-service'
import { InventoryProduct } from '@/types/inventory'

/**
 * 在庫最適化: 日次自動値下げ実行
 *
 * 全在庫をスキャンして、フェーズ変更が必要な商品の価格を自動更新します。
 * - 通常販売（0-90日）: 変更なし
 * - 警戒販売（91-180日）: 利益率5%まで引き下げ
 * - 損切り実行（181日〜）: 原価の90%まで引き下げ
 *
 * @route POST /api/inventory/auto-price-reduction
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // ドライランモードの確認（テスト用）
    const { dryRun } = await request.json().catch(() => ({ dryRun: false }))

    // 全在庫商品を取得
    const { data: products, error } = await supabase
      .from('inventory_master')
      .select('*')
      .not('date_acquired', 'is', null) // 仕入れ日が設定されているもののみ

    if (error) {
      console.error('❌ 在庫データ取得エラー:', error)
      return NextResponse.json(
        { success: false, error: '在庫データの取得に失敗しました' },
        { status: 500 }
      )
    }

    if (!products || products.length === 0) {
      return NextResponse.json({
        success: true,
        message: '処理対象の在庫がありません',
        processed: 0,
        updated: 0,
        skipped: 0
      })
    }

    // 在庫商品データを型変換
    const inventoryProducts: InventoryProduct[] = products.map((item) => ({
      id: item.id,
      unique_id: item.unique_id,
      product_name: item.product_name,
      sku: item.sku,
      product_type: item.product_type,
      physical_quantity: item.physical_quantity || 0,
      listing_quantity: item.listing_quantity || 0,
      cost_price: item.cost_price || 0,
      selling_price: item.selling_price || 0,
      condition_name: item.condition_name,
      category: item.category,
      subcategory: item.subcategory,
      images: item.images || [],
      source_data: item.source_data,
      supplier_info: item.supplier_info,
      is_manual_entry: item.is_manual_entry,
      priority_score: item.priority_score || 0,
      notes: item.notes,
      created_at: item.created_at,
      updated_at: item.updated_at,
      marketplace: item.marketplace,
      account: item.account,
      date_acquired: item.date_acquired,
      target_sale_deadline: item.target_sale_deadline,
      inventory_type: item.inventory_type,
      cogs: item.cogs,
      estimated_final_profit_margin: item.estimated_final_profit_margin,
      current_price_phase: item.current_price_phase,
      last_price_reduction_date: item.last_price_reduction_date,
      price_reduction_history: item.price_reduction_history
    }))

    // 一括値下げ実行
    const result = await batchPriceReduction(inventoryProducts, dryRun)

    // ドライランでない場合、実際にデータベースを更新
    if (!dryRun && result.updated > 0) {
      for (const reduction of result.reductions) {
        const { productId, result: reductionResult } = reduction

        // 値下げ履歴を更新
        const product = inventoryProducts.find((p) => p.id === productId)
        const updatedHistory = [
          ...(product?.price_reduction_history || []),
          reductionResult.reduction!
        ]

        // データベースを更新
        const { error: updateError } = await supabase
          .from('inventory_master')
          .update({
            selling_price: reductionResult.newPrice,
            current_price_phase: reductionResult.newPhase,
            last_price_reduction_date: new Date().toISOString().split('T')[0],
            price_reduction_history: updatedHistory,
            updated_at: new Date().toISOString()
          })
          .eq('id', productId)

        if (updateError) {
          console.error(`❌ 商品ID ${productId} の更新エラー:`, updateError)
        }
      }

      console.log(`✅ ${result.updated}件の価格を自動更新しました`)
    }

    // アラート対象商品を取得
    const alerts = getAlertProducts(inventoryProducts)
    const alertCount = alerts.warning.length + alerts.danger.length

    return NextResponse.json({
      success: true,
      processed: result.processed,
      updated: result.updated,
      skipped: result.skipped,
      alertCount,
      warningCount: alerts.warning.length,
      dangerCount: alerts.danger.length,
      dryRun,
      reductions: dryRun ? result.reductions : undefined
    })
  } catch (error: any) {
    console.error('❌ 自動値下げ実行エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * 自動値下げの実行状況を取得
 *
 * @route GET /api/inventory/auto-price-reduction
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 最近の値下げ履歴を取得
    const { data: recentReductions, error } = await supabase
      .from('inventory_master')
      .select('id, product_name, selling_price, current_price_phase, last_price_reduction_date, price_reduction_history')
      .not('last_price_reduction_date', 'is', null)
      .order('last_price_reduction_date', { ascending: false })
      .limit(20)

    if (error) {
      console.error('❌ 値下げ履歴取得エラー:', error)
      return NextResponse.json(
        { success: false, error: '値下げ履歴の取得に失敗しました' },
        { status: 500 }
      )
    }

    // アラート対象商品数を取得
    const { data: allProducts } = await supabase
      .from('inventory_master')
      .select('*')
      .not('date_acquired', 'is', null)

    let warningCount = 0
    let dangerCount = 0

    if (allProducts) {
      const inventoryProducts: InventoryProduct[] = allProducts.map((item) => ({
        id: item.id,
        unique_id: item.unique_id,
        product_name: item.product_name,
        sku: item.sku,
        product_type: item.product_type,
        physical_quantity: item.physical_quantity || 0,
        listing_quantity: item.listing_quantity || 0,
        cost_price: item.cost_price || 0,
        selling_price: item.selling_price || 0,
        condition_name: item.condition_name,
        category: item.category,
        images: item.images || [],
        is_manual_entry: item.is_manual_entry,
        priority_score: item.priority_score || 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
        date_acquired: item.date_acquired,
        current_price_phase: item.current_price_phase
      }))

      const alerts = getAlertProducts(inventoryProducts)
      warningCount = alerts.warning.length
      dangerCount = alerts.danger.length
    }

    return NextResponse.json({
      success: true,
      recentReductions: recentReductions || [],
      warningCount,
      dangerCount
    })
  } catch (error: any) {
    console.error('❌ 実行状況取得エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
