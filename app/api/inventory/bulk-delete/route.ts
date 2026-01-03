// app/api/inventory/bulk-delete/route.ts
/**
 * inventory_masterの一括削除API
 * POST /api/inventory/bulk-delete
 * 
 * 対象:
 * - selected: 選択したIDの削除 (★追加)
 * - mjt: MJTアカウントのeBayデータのみ
 * - green: GREENアカウントのeBayデータのみ
 * - ebay: eBay全データ（MJT+GREEN）
 * - all: 全データ（手動登録含む）
 * - out_of_stock: 在庫切れ商品
 * - sold: 販売済み商品
 * 
 * オプション:
 * - syncProductsMaster: products_masterからも連動削除
 * - clearClassificationQueue: 分類キューもクリア
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface BulkDeleteRequest {
  target: 'mjt' | 'green' | 'ebay' | 'all' | 'out_of_stock' | 'sold' | 'selected'
  syncProductsMaster?: boolean  // products_masterも削除
  clearClassificationQueue?: boolean  // 分類キューもクリア
  ids?: string[]  // 選択削除用 (target='selected' の場合必須)
}

export async function POST(req: NextRequest) {
  try {
    const body: BulkDeleteRequest = await req.json()
    const { 
      target, 
      syncProductsMaster = false,
      clearClassificationQueue = false,
      ids 
    } = body

    if (!target || !['mjt', 'green', 'ebay', 'all', 'out_of_stock', 'sold', 'selected'].includes(target)) {
      return NextResponse.json(
        { error: '無効なtargetパラメータです' },
        { status: 400 }
      )
    }

    // selectedの場合、ids必須チェック
    if (target === 'selected' && (!ids || !Array.isArray(ids) || ids.length === 0)) {
      return NextResponse.json(
        { error: '削除対象のIDが指定されていません' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    let inventoryDeleted = 0
    let productsDeleted = 0
    let queueDeleted = 0

    // ========== 1. inventory_master削除 ==========
    let inventoryQuery
    let inventoryCountQuery

    switch (target) {
      case 'selected': // ★追加: 選択削除
        inventoryCountQuery = supabase
          .from('inventory_master')
          .select('*', { count: 'exact', head: true })
          .in('id', ids!)
        inventoryQuery = supabase
          .from('inventory_master')
          .delete()
          .in('id', ids!)
        break

      case 'mjt':
        inventoryCountQuery = supabase
          .from('inventory_master')
          .select('*', { count: 'exact', head: true })
          .like('unique_id', 'ebay-mjt-%')
        inventoryQuery = supabase
          .from('inventory_master')
          .delete()
          .like('unique_id', 'ebay-mjt-%')
        break

      case 'green':
        inventoryCountQuery = supabase
          .from('inventory_master')
          .select('*', { count: 'exact', head: true })
          .like('unique_id', 'ebay-green-%')
        inventoryQuery = supabase
          .from('inventory_master')
          .delete()
          .like('unique_id', 'ebay-green-%')
        break

      case 'ebay':
        inventoryCountQuery = supabase
          .from('inventory_master')
          .select('*', { count: 'exact', head: true })
          .like('unique_id', 'ebay-%')
        inventoryQuery = supabase
          .from('inventory_master')
          .delete()
          .like('unique_id', 'ebay-%')
        break

      case 'out_of_stock':
        // 売切れ商品（physical_quantity = 0）を削除
        inventoryCountQuery = supabase
          .from('inventory_master')
          .select('*', { count: 'exact', head: true })
          .eq('physical_quantity', 0)
        inventoryQuery = supabase
          .from('inventory_master')
          .delete()
          .eq('physical_quantity', 0)
        break

      case 'sold':
        // 売約済み商品（listing_quantity = 0 かつ出品終了）を削除
        inventoryCountQuery = supabase
          .from('inventory_master')
          .select('*', { count: 'exact', head: true })
          .eq('listing_quantity', 0)
          .eq('physical_quantity', 0)
        inventoryQuery = supabase
          .from('inventory_master')
          .delete()
          .eq('listing_quantity', 0)
          .eq('physical_quantity', 0)
        break

      case 'all':
        inventoryCountQuery = supabase
          .from('inventory_master')
          .select('*', { count: 'exact', head: true })
        inventoryQuery = supabase
          .from('inventory_master')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000') // 全件削除用ハック
        break
    }

    // 削除件数カウント
    if (inventoryCountQuery) {
      const { count: invCount } = await inventoryCountQuery
      inventoryDeleted = invCount || 0
      console.log(`🗑️ [bulk-delete] target=${target}, inventory_master削除対象: ${inventoryDeleted}件`)
    }

    // inventory_master削除実行
    if (inventoryQuery) {
      const { error: invError } = await inventoryQuery
      if (invError) {
        console.error('❌ inventory_master削除エラー:', invError)
        return NextResponse.json(
          { error: `削除エラー: ${invError.message}` },
          { status: 500 }
        )
      }
    }

    // ========== 2. products_master連動削除（オプション） ==========
    if (syncProductsMaster) {
      let productsQuery
      let productsCountQuery

      switch (target) {
        case 'selected': // ★追加
          // inventory_masterのIDと同じIDを持つproducts_masterを削除するロジックが必要だが
          // ID体系が異なる場合は、unique_id等で紐づける必要がある
          // ここでは単純に同じIDとして処理（必要に応じて修正）
          // または、source_idで紐づいているケースを想定
          // ※複雑になるため、今回は安全を見てスキップまたはID一致のみ実施
          break;

        case 'mjt':
          productsCountQuery = supabase
            .from('products_master')
            .select('*', { count: 'exact', head: true })
            .eq('ebay_account', 'mjt')
          productsQuery = supabase
            .from('products_master')
            .delete()
            .eq('ebay_account', 'mjt')
          break

        case 'green':
          productsCountQuery = supabase
            .from('products_master')
            .select('*', { count: 'exact', head: true })
            .eq('ebay_account', 'green')
          productsQuery = supabase
            .from('products_master')
            .delete()
            .eq('ebay_account', 'green')
          break

        case 'ebay':
          productsCountQuery = supabase
            .from('products_master')
            .select('*', { count: 'exact', head: true })
            .eq('source', 'ebay')
          productsQuery = supabase
            .from('products_master')
            .delete()
            .eq('source', 'ebay')
          break

        case 'all':
          // products_masterの全削除は危険なのでスキップ
          console.warn('⚠️ products_masterの全削除はスキップされました（安全のため）')
          break
      }

      if (productsCountQuery && productsQuery) {
        const { count: prodCount } = await productsCountQuery
        productsDeleted = prodCount || 0
        console.log(`🗑️ [bulk-delete] products_master削除対象: ${productsDeleted}件`)
        const { error: prodError } = await productsQuery
        if (prodError) {
          console.error('❌ products_master削除エラー:', prodError)
        }
      }
    }

    // ========== 3. 分類キュークリア（オプション） ==========
    if (clearClassificationQueue) {
      let queueQuery
      let queueCountQuery

      switch (target) {
        case 'mjt':
          queueCountQuery = supabase
            .from('stock_classification_queue')
            .select('*', { count: 'exact', head: true })
            .eq('account', 'mjt')
          queueQuery = supabase
            .from('stock_classification_queue')
            .delete()
            .eq('account', 'mjt')
          break

        case 'green':
          queueCountQuery = supabase
            .from('stock_classification_queue')
            .select('*', { count: 'exact', head: true })
            .eq('account', 'green')
          queueQuery = supabase
            .from('stock_classification_queue')
            .delete()
            .eq('account', 'green')
          break

        case 'ebay':
        case 'all':
          queueCountQuery = supabase
            .from('stock_classification_queue')
            .select('*', { count: 'exact', head: true })
          queueQuery = supabase
            .from('stock_classification_queue')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000')
          break
      }

      if (queueCountQuery && queueQuery) {
        const { count: qCount } = await queueCountQuery
        queueDeleted = qCount || 0
        console.log(`🗑️ [bulk-delete] classification_queue削除対象: ${queueDeleted}件`)
        const { error: qError } = await queueQuery
        if (qError) {
          console.error('❌ classification_queue削除エラー:', qError)
        }
      }
    }

    console.log(`✅ [bulk-delete] 完了`)
    console.log(`   inventory_master: ${inventoryDeleted}件`)
    console.log(`   products_master: ${productsDeleted}件`)
    console.log(`   classification_queue: ${queueDeleted}件`)

    return NextResponse.json({
      success: true,
      target,
      deleted: {
        inventory_master: inventoryDeleted,
        products_master: productsDeleted,
        classification_queue: queueDeleted,
        total: inventoryDeleted + productsDeleted + queueDeleted
      },
      message: `合計${inventoryDeleted + productsDeleted + queueDeleted}件のデータを削除しました`
    })

  } catch (error: any) {
    console.error('❌ bulk-deleteエラー:', error)
    return NextResponse.json(
      { error: error.message || '不明なエラー' },
      { status: 500 }
    )
  }
}