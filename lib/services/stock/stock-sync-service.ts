/**
 * 在庫連動サービス
 * 有在庫・無在庫両方の在庫変動を管理し、全モールに連動させる
 */

import { createClient } from '@/lib/supabase/client'

// ==============================================
// 型定義
// ==============================================

export interface StockMaster {
  id: string
  sku: string | null
  title: string
  product_type: 'stock' | 'dropship' | 'set' | 'variation_parent' | 'variation_child' | 'unclassified'
  physical_quantity: number
  is_stock_master: boolean
  ebay_site: string | null
  ebay_account: string | null
}

export interface MarketplaceListing {
  id: string
  stock_master_id: string
  marketplace: string
  account_key: string | null
  listing_id: string | null
  sku: string | null
  status: string
  quantity: number
  price: number | null
}

export interface StockMovement {
  id: string
  stock_master_id: string
  movement_type: 'sale' | 'return' | 'adjustment' | 'import' | 'set_sale'
  quantity_before: number
  quantity_after: number
  quantity_change: number
  source_marketplace: string | null
  source_order_id: string | null
}

// ==============================================
// 在庫減算
// ==============================================

/**
 * 有在庫商品の在庫を減算し、全モールに連動
 */
export async function decrementStock(
  stockMasterId: string,
  quantity: number,
  sourceMarketplace: string,
  sourceOrderId: string,
  options: {
    syncToMarketplaces?: boolean
    orderItemId?: string
  } = {}
): Promise<{
  success: boolean
  newQuantity?: number
  error?: string
  syncResults?: any[]
}> {
  try {
    const response = await fetch('/api/stock/decrement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stock_master_id: stockMasterId,
        quantity,
        source_marketplace: sourceMarketplace,
        source_order_id: sourceOrderId,
        order_item_id: options.orderItemId,
        sync_to_marketplaces: options.syncToMarketplaces ?? true
      })
    })

    const data = await response.json()

    if (!data.success) {
      return { success: false, error: data.error }
    }

    return {
      success: true,
      newQuantity: data.data.new_quantity,
      syncResults: data.data.sync_results
    }
  } catch (error: any) {
    console.error('在庫減算エラー:', error)
    return { success: false, error: error.message }
  }
}

// ==============================================
// 在庫増加（返品・調整）
// ==============================================

/**
 * 在庫を増加（返品や調整用）
 */
export async function incrementStock(
  stockMasterId: string,
  quantity: number,
  reason: 'return' | 'adjustment' | 'import',
  notes?: string
): Promise<{
  success: boolean
  newQuantity?: number
  error?: string
}> {
  try {
    const supabase = createClient()

    // 現在の在庫を取得
    const { data: product, error: fetchError } = await supabase
      .from('products_master')
      .select('id, physical_quantity, current_stock, title')
      .eq('id', stockMasterId)
      .single()

    if (fetchError || !product) {
      return { success: false, error: '商品が見つかりません' }
    }

    const currentQuantity = product.physical_quantity || product.current_stock || 0
    const newQuantity = currentQuantity + quantity

    // 在庫更新
    const { error: updateError } = await supabase
      .from('products_master')
      .update({
        physical_quantity: newQuantity,
        current_stock: newQuantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', stockMasterId)

    if (updateError) {
      return { success: false, error: '在庫更新に失敗しました' }
    }

    // 変動履歴を記録
    try {
      await supabase
        .from('stock_movements')
        .insert({
          stock_master_id: stockMasterId,
          movement_type: reason,
          quantity_before: currentQuantity,
          quantity_after: newQuantity,
          quantity_change: quantity,
          source_reason: notes
        })
    } catch (e) {
      // テーブルがない場合は無視
    }

    console.log(`✅ 在庫増加: ${product.title}, ${currentQuantity} → ${newQuantity}`)

    return { success: true, newQuantity }
  } catch (error: any) {
    console.error('在庫増加エラー:', error)
    return { success: false, error: error.message }
  }
}

// ==============================================
// 無在庫連動
// ==============================================

/**
 * 無在庫商品の変動を全モールに連動
 */
export async function syncDropshipChange(
  changeId: string,
  options: {
    dryRun?: boolean
    account?: string
  } = {}
): Promise<{
  success: boolean
  results?: any[]
  error?: string
}> {
  try {
    const response = await fetch('/api/stock/dropship-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        change_id: changeId,
        dry_run: options.dryRun ?? false,
        account: options.account ?? 'mjt'
      })
    })

    const data = await response.json()

    if (!data.success) {
      return { success: false, error: data.error }
    }

    return {
      success: true,
      results: data.results
    }
  } catch (error: any) {
    console.error('無在庫連動エラー:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 複数の無在庫変動を一括連動
 */
export async function batchSyncDropshipChanges(
  changeIds: string[],
  options: {
    dryRun?: boolean
    account?: string
  } = {}
): Promise<{
  success: boolean
  summary?: {
    total: number
    success: number
    error: number
  }
  results?: any[]
  error?: string
}> {
  try {
    const response = await fetch('/api/stock/dropship-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        change_ids: changeIds,
        dry_run: options.dryRun ?? false,
        account: options.account ?? 'mjt'
      })
    })

    const data = await response.json()

    return {
      success: data.success,
      summary: data.summary,
      results: data.results,
      error: data.error
    }
  } catch (error: any) {
    console.error('無在庫一括連動エラー:', error)
    return { success: false, error: error.message }
  }
}

// ==============================================
// セット商品の在庫計算
// ==============================================

/**
 * セット商品の作成可能数を計算
 */
export async function calculateSetAvailability(setProductId: string): Promise<{
  availableSets: number
  components: {
    id: string
    name: string
    quantity_required: number
    available_stock: number
    possible_sets: number
  }[]
}> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('set_components')
    .select(`
      quantity_required,
      component:products_master!component_product_id (
        id,
        product_name,
        physical_quantity
      )
    `)
    .eq('set_product_id', setProductId)

  if (error || !data) {
    console.error('セット構成取得エラー:', error)
    return { availableSets: 0, components: [] }
  }

  const components = data.map((item: any) => {
    const component = item.component
    const possibleSets = Math.floor(component.physical_quantity / item.quantity_required)
    
    return {
      id: component.id,
      name: component.product_name,
      quantity_required: item.quantity_required,
      available_stock: component.physical_quantity,
      possible_sets: possibleSets
    }
  })

  const availableSets = Math.min(...components.map(c => c.possible_sets))

  return { availableSets, components }
}

/**
 * セット商品販売時の在庫処理
 */
export async function processSetSale(
  setProductId: string,
  quantity: number,
  sourceMarketplace: string,
  sourceOrderId: string
): Promise<{
  success: boolean
  updatedComponents?: any[]
  error?: string
}> {
  const supabase = createClient()

  try {
    // セット構成を取得
    const { data: components, error: fetchError } = await supabase
      .from('set_components')
      .select(`
        quantity_required,
        component_product_id
      `)
      .eq('set_product_id', setProductId)

    if (fetchError || !components) {
      return { success: false, error: 'セット構成が見つかりません' }
    }

    const updatedComponents = []

    // 各構成品の在庫を減算
    for (const component of components) {
      const decrementQty = component.quantity_required * quantity

      const result = await decrementStock(
        component.component_product_id,
        decrementQty,
        sourceMarketplace,
        sourceOrderId,
        { syncToMarketplaces: true }
      )

      updatedComponents.push({
        component_id: component.component_product_id,
        decremented: decrementQty,
        success: result.success,
        new_quantity: result.newQuantity
      })

      if (!result.success) {
        console.error(`構成品 ${component.component_product_id} の在庫減算に失敗:`, result.error)
      }
    }

    return { success: true, updatedComponents }
  } catch (error: any) {
    console.error('セット販売処理エラー:', error)
    return { success: false, error: error.message }
  }
}

// ==============================================
// マスター在庫状況取得
// ==============================================

/**
 * マスター商品の在庫状況を取得
 */
export async function getStockStatus(stockMasterId: string): Promise<{
  product: StockMaster | null
  listings: MarketplaceListing[]
  recentMovements: StockMovement[]
  error?: string
}> {
  try {
    const response = await fetch(`/api/stock/decrement?id=${stockMasterId}`)
    const data = await response.json()

    if (!data.success) {
      return { 
        product: null, 
        listings: [], 
        recentMovements: [],
        error: data.error 
      }
    }

    return {
      product: data.data.product,
      listings: data.data.listings || [],
      recentMovements: data.data.recent_movements || []
    }
  } catch (error: any) {
    console.error('在庫状況取得エラー:', error)
    return { 
      product: null, 
      listings: [], 
      recentMovements: [],
      error: error.message 
    }
  }
}

// ==============================================
// 全モール在庫同期
// ==============================================

/**
 * 全マーケットプレイスのAPI呼び出しを実行
 * (pending_api_call状態のものを処理)
 */
export async function executePendingMarketplaceSyncs(): Promise<{
  processed: number
  success: number
  failed: number
  errors: any[]
}> {
  const supabase = createClient()

  // pending_api_callのリストを取得
  const { data: pendingListings, error } = await supabase
    .from('marketplace_listings')
    .select(`
      id,
      marketplace,
      account_key,
      listing_id,
      sku,
      quantity,
      price,
      sync_status,
      stock_master:products_master!stock_master_id (
        id,
        sku,
        ebay_offer_id
      )
    `)
    .eq('sync_status', 'pending_api_call')
    .limit(50)

  if (error) {
    console.error('pending listings取得エラー:', error)
    return { processed: 0, success: 0, failed: 0, errors: [error] }
  }

  if (!pendingListings || pendingListings.length === 0) {
    return { processed: 0, success: 0, failed: 0, errors: [] }
  }

  let success = 0
  let failed = 0
  const errors: any[] = []

  for (const listing of pendingListings) {
    try {
      // マーケットプレイス別の処理
      if (listing.marketplace.startsWith('ebay')) {
        // eBay在庫更新
        const { updateInventoryQuantity } = await import('@/lib/ebay/inventory')
        const sku = listing.sku || listing.stock_master?.sku
        const account = listing.account_key || 'mjt'

        if (sku) {
          const result = await updateInventoryQuantity(sku, listing.quantity, account as any)
          
          if (result.success) {
            await supabase
              .from('marketplace_listings')
              .update({
                sync_status: 'synced',
                last_sync_at: new Date().toISOString()
              })
              .eq('id', listing.id)
            success++
          } else {
            await supabase
              .from('marketplace_listings')
              .update({
                sync_status: 'error',
                sync_error: result.error
              })
              .eq('id', listing.id)
            failed++
            errors.push({ listing_id: listing.id, error: result.error })
          }
        }
      }
      // 他モールは未実装
    } catch (e: any) {
      failed++
      errors.push({ listing_id: listing.id, error: e.message })
    }
  }

  console.log(`📤 マーケットプレイス同期完了: 成功${success}, 失敗${failed}`)

  return {
    processed: pendingListings.length,
    success,
    failed,
    errors
  }
}
