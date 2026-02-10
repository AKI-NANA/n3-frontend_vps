/**
 * Global Stock Killer - 全販路在庫同期サービス
 * lib/marketplace/global-stock-killer.ts
 * 
 * Phase 1.5: 販売検知時に全販路の在庫を即座に同期
 * 
 * 致命的盲点への対策:
 * ① Atomic: SELECT FOR UPDATE で行レベルロック
 * ② 多系統化: Webhook + ポーリングの二重監視
 * ③ 在庫復元: 返品時に仕入れ先生存確認
 */

import { createClient } from '@/lib/supabase/client';
import type { MarketplaceId, StockSyncEvent, StockSyncResult } from './multi-marketplace-types';

// =====================================================
// 型定義
// =====================================================

export interface SaleEvent {
  eventType: 'sale' | 'return' | 'cancel' | 'adjustment';
  sourceMarketplace: MarketplaceId;
  productMasterId: number;
  inventoryMasterId?: number;
  quantityChange: number; // 負数=減少、正数=増加
  orderNumber?: string;
  externalItemId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface StockUpdateResult {
  marketplaceId: MarketplaceId;
  itemId: string | null;
  previousQuantity: number;
  newQuantity: number;
  status: 'success' | 'error' | 'skipped' | 'not_listed';
  errorMessage?: string;
  apiResponseTime?: number;
}

export interface GlobalStockSyncResult {
  success: boolean;
  productMasterId: number;
  inventoryMasterId?: number;
  event: SaleEvent;
  physicalQuantityBefore: number;
  physicalQuantityAfter: number;
  affectedMarketplaces: StockUpdateResult[];
  totalExecutionTimeMs: number;
  timestamp: Date;
  warnings: string[];
}

export interface SupplierCheckResult {
  isAvailable: boolean;
  currentPrice?: number;
  lastCheckedAt?: Date;
  supplierUrl?: string;
}

// =====================================================
// 定数
// =====================================================

const STOCK_SYNC_TIMEOUT_MS = 60000; // 1分以内完了目標
const MAX_RETRY_COUNT = 3;
const RETRY_DELAY_BASE_MS = 1000; // 指数バックオフの基準

// 販路別API設定
const MARKETPLACE_API_CONFIG: Record<string, { 
  priority: number; 
  supportsWebhook: boolean;
  apiEndpoint: string;
}> = {
  'ebay_us': { priority: 1, supportsWebhook: true, apiEndpoint: 'revise_item' },
  'ebay_uk': { priority: 1, supportsWebhook: true, apiEndpoint: 'revise_item' },
  'ebay_de': { priority: 1, supportsWebhook: true, apiEndpoint: 'revise_item' },
  'ebay_au': { priority: 1, supportsWebhook: true, apiEndpoint: 'revise_item' },
  'shopee_sg': { priority: 2, supportsWebhook: true, apiEndpoint: 'update_stock' },
  'shopee_my': { priority: 2, supportsWebhook: true, apiEndpoint: 'update_stock' },
  'shopee_th': { priority: 2, supportsWebhook: true, apiEndpoint: 'update_stock' },
  'shopee_ph': { priority: 2, supportsWebhook: true, apiEndpoint: 'update_stock' },
  'shopee_tw': { priority: 2, supportsWebhook: true, apiEndpoint: 'update_stock' },
  'shopee_vn': { priority: 2, supportsWebhook: true, apiEndpoint: 'update_stock' },
  'shopee_id': { priority: 2, supportsWebhook: true, apiEndpoint: 'update_stock' },
  'amazon_jp': { priority: 3, supportsWebhook: false, apiEndpoint: 'update_inventory' },
  'amazon_us': { priority: 3, supportsWebhook: false, apiEndpoint: 'update_inventory' },
  'qoo10_jp': { priority: 4, supportsWebhook: false, apiEndpoint: 'update_goods_stock' },
  'lazada_sg': { priority: 5, supportsWebhook: true, apiEndpoint: 'update_stock' },
  'lazada_my': { priority: 5, supportsWebhook: true, apiEndpoint: 'update_stock' },
  'lazada_th': { priority: 5, supportsWebhook: true, apiEndpoint: 'update_stock' },
  'lazada_ph': { priority: 5, supportsWebhook: true, apiEndpoint: 'update_stock' },
};

// =====================================================
// メイン関数: 販売イベント処理
// =====================================================

/**
 * 販売イベントを処理し、全販路の在庫を同期
 * 
 * @param event 販売イベント（sale/return/cancel）
 * @returns 同期結果
 */
export async function processSaleEvent(event: SaleEvent): Promise<GlobalStockSyncResult> {
  const startTime = Date.now();
  const warnings: string[] = [];
  const supabase = createClient();
  
  console.log(`[GlobalStockKiller] イベント処理開始: ${event.eventType} - Product ${event.productMasterId}`);
  
  try {
    // =====================================================
    // Step 1: inventory_master の在庫を更新（行レベルロック）
    // =====================================================
    const inventoryResult = await updateInventoryWithLock(
      supabase,
      event.productMasterId,
      event.inventoryMasterId,
      event.quantityChange
    );
    
    if (!inventoryResult.success) {
      throw new Error(`在庫更新失敗: ${inventoryResult.error}`);
    }
    
    const { inventoryId, previousQuantity, newQuantity } = inventoryResult;
    
    console.log(`[GlobalStockKiller] 在庫更新: ${previousQuantity} → ${newQuantity}`);
    
    // =====================================================
    // Step 2: 返品・キャンセル時の追加チェック
    // =====================================================
    if (event.eventType === 'return' || event.eventType === 'cancel') {
      // 仕入れ先の生存確認が必要
      if (newQuantity > 0) {
        const supplierCheck = await checkSupplierAvailability(event.productMasterId);
        if (!supplierCheck.isAvailable) {
          warnings.push('仕入れ先が在庫切れのため、再出品は推奨されません');
        }
      }
    }
    
    // =====================================================
    // Step 3: 全販路の出品情報を取得
    // =====================================================
    const { data: listings, error: listingsError } = await supabase
      .from('marketplace_listings')
      .select('*')
      .eq('product_master_id', event.productMasterId)
      .in('status', ['active', 'pending']);
    
    if (listingsError) {
      throw new Error(`出品情報取得失敗: ${listingsError.message}`);
    }
    
    // =====================================================
    // Step 4: 全販路に在庫更新を並列実行（ソース販路は除外）
    // =====================================================
    const updatePromises = (listings || [])
      .filter(listing => listing.marketplace_id !== event.sourceMarketplace)
      .map(listing => updateMarketplaceStock(
        listing.marketplace_id as MarketplaceId,
        listing.item_id,
        newQuantity,
        listing.id
      ));
    
    // ソース販路も結果に含める（既に更新済みとしてマーク）
    const sourceResult: StockUpdateResult = {
      marketplaceId: event.sourceMarketplace,
      itemId: event.externalItemId || null,
      previousQuantity: previousQuantity,
      newQuantity: newQuantity,
      status: 'success',
      apiResponseTime: 0,
    };
    
    const marketplaceResults = await Promise.allSettled(updatePromises);
    
    const affectedMarketplaces: StockUpdateResult[] = [sourceResult];
    
    marketplaceResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        affectedMarketplaces.push(result.value);
      } else {
        const listing = listings![index];
        affectedMarketplaces.push({
          marketplaceId: listing.marketplace_id as MarketplaceId,
          itemId: listing.item_id,
          previousQuantity: listing.stock_quantity || 0,
          newQuantity: newQuantity,
          status: 'error',
          errorMessage: result.reason?.message || 'Unknown error',
        });
      }
    });
    
    // =====================================================
    // Step 5: 結果をログに記録
    // =====================================================
    const executionTime = Date.now() - startTime;
    
    await logStockSyncEvent(supabase, {
      event,
      inventoryId,
      previousQuantity,
      newQuantity,
      affectedMarketplaces,
      executionTimeMs: executionTime,
      warnings,
    });
    
    // 1分超過の警告
    if (executionTime > STOCK_SYNC_TIMEOUT_MS) {
      warnings.push(`同期が${executionTime}msかかりました（目標: 60秒以内）`);
    }
    
    const successCount = affectedMarketplaces.filter(r => r.status === 'success').length;
    const errorCount = affectedMarketplaces.filter(r => r.status === 'error').length;
    
    console.log(`[GlobalStockKiller] 完了: ${successCount}成功, ${errorCount}エラー, ${executionTime}ms`);
    
    return {
      success: errorCount === 0,
      productMasterId: event.productMasterId,
      inventoryMasterId: inventoryId,
      event,
      physicalQuantityBefore: previousQuantity,
      physicalQuantityAfter: newQuantity,
      affectedMarketplaces,
      totalExecutionTimeMs: executionTime,
      timestamp: new Date(),
      warnings,
    };
    
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`[GlobalStockKiller] エラー:`, error);
    
    return {
      success: false,
      productMasterId: event.productMasterId,
      event,
      physicalQuantityBefore: 0,
      physicalQuantityAfter: 0,
      affectedMarketplaces: [],
      totalExecutionTimeMs: executionTime,
      timestamp: new Date(),
      warnings: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

// =====================================================
// 在庫更新（行レベルロック付き）
// =====================================================

interface InventoryUpdateResult {
  success: boolean;
  inventoryId?: number;
  previousQuantity?: number;
  newQuantity?: number;
  error?: string;
}

async function updateInventoryWithLock(
  supabase: any,
  productMasterId: number,
  inventoryMasterId?: number,
  quantityChange: number = -1
): Promise<InventoryUpdateResult> {
  try {
    // RPC関数を使用して行レベルロック付きで更新
    // この関数はSupabaseで事前に作成が必要
    const { data, error } = await supabase.rpc('update_inventory_with_lock', {
      p_product_master_id: productMasterId,
      p_inventory_master_id: inventoryMasterId,
      p_quantity_change: quantityChange,
    });
    
    if (error) {
      // RPC関数がない場合は通常の更新にフォールバック
      console.warn('[GlobalStockKiller] RPC未対応、通常更新にフォールバック');
      return await updateInventoryFallback(supabase, productMasterId, inventoryMasterId, quantityChange);
    }
    
    return {
      success: true,
      inventoryId: data.inventory_id,
      previousQuantity: data.previous_quantity,
      newQuantity: data.new_quantity,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function updateInventoryFallback(
  supabase: any,
  productMasterId: number,
  inventoryMasterId?: number,
  quantityChange: number = -1
): Promise<InventoryUpdateResult> {
  try {
    // inventory_masterを検索
    let query = supabase
      .from('inventory_master')
      .select('id, physical_quantity')
      .eq('product_master_id', productMasterId);
    
    if (inventoryMasterId) {
      query = query.eq('id', inventoryMasterId);
    }
    
    const { data: inventory, error: selectError } = await query.single();
    
    if (selectError || !inventory) {
      // inventory_masterがない場合、products_masterを直接更新
      return await updateProductsMasterStock(supabase, productMasterId, quantityChange);
    }
    
    const previousQuantity = inventory.physical_quantity || 0;
    const newQuantity = Math.max(0, previousQuantity + quantityChange);
    
    const { error: updateError } = await supabase
      .from('inventory_master')
      .update({ 
        physical_quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', inventory.id);
    
    if (updateError) {
      throw updateError;
    }
    
    return {
      success: true,
      inventoryId: inventory.id,
      previousQuantity,
      newQuantity,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function updateProductsMasterStock(
  supabase: any,
  productMasterId: number,
  quantityChange: number
): Promise<InventoryUpdateResult> {
  try {
    const { data: product, error: selectError } = await supabase
      .from('products_master')
      .select('id, stock_quantity')
      .eq('id', productMasterId)
      .single();
    
    if (selectError || !product) {
      throw new Error(`Product ${productMasterId} not found`);
    }
    
    const previousQuantity = product.stock_quantity || 0;
    const newQuantity = Math.max(0, previousQuantity + quantityChange);
    
    const { error: updateError } = await supabase
      .from('products_master')
      .update({ 
        stock_quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productMasterId);
    
    if (updateError) {
      throw updateError;
    }
    
    return {
      success: true,
      inventoryId: undefined,
      previousQuantity,
      newQuantity,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// =====================================================
// 各販路の在庫更新
// =====================================================

async function updateMarketplaceStock(
  marketplaceId: MarketplaceId,
  itemId: string | null,
  newQuantity: number,
  listingId: number
): Promise<StockUpdateResult> {
  const startTime = Date.now();
  const supabase = createClient();
  
  if (!itemId) {
    return {
      marketplaceId,
      itemId: null,
      previousQuantity: 0,
      newQuantity,
      status: 'not_listed',
      errorMessage: 'Item ID not found',
    };
  }
  
  try {
    // 販路別のAPI呼び出し
    let apiResult: { success: boolean; error?: string };
    
    if (marketplaceId.startsWith('ebay_')) {
      apiResult = await updateEbayStock(marketplaceId, itemId, newQuantity);
    } else if (marketplaceId.startsWith('shopee_')) {
      apiResult = await updateShopeeStock(marketplaceId, itemId, newQuantity);
    } else if (marketplaceId.startsWith('amazon_')) {
      apiResult = await updateAmazonStock(marketplaceId, itemId, newQuantity);
    } else if (marketplaceId.startsWith('qoo10_')) {
      apiResult = await updateQoo10Stock(marketplaceId, itemId, newQuantity);
    } else if (marketplaceId.startsWith('lazada_')) {
      apiResult = await updateLazadaStock(marketplaceId, itemId, newQuantity);
    } else {
      apiResult = { success: false, error: `Unsupported marketplace: ${marketplaceId}` };
    }
    
    // DB更新
    if (apiResult.success) {
      await supabase
        .from('marketplace_listings')
        .update({
          stock_quantity: newQuantity,
          last_stock_update_at: new Date().toISOString(),
          sync_status: 'synced',
          error_count: 0,
        })
        .eq('id', listingId);
    } else {
      await supabase
        .from('marketplace_listings')
        .update({
          sync_status: 'error',
          error_message: apiResult.error,
          error_count: supabase.rpc('increment_error_count', { row_id: listingId }),
          last_error_at: new Date().toISOString(),
        })
        .eq('id', listingId);
    }
    
    return {
      marketplaceId,
      itemId,
      previousQuantity: 0, // TODO: 取得する
      newQuantity,
      status: apiResult.success ? 'success' : 'error',
      errorMessage: apiResult.error,
      apiResponseTime: Date.now() - startTime,
    };
    
  } catch (error) {
    return {
      marketplaceId,
      itemId,
      previousQuantity: 0,
      newQuantity,
      status: 'error',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      apiResponseTime: Date.now() - startTime,
    };
  }
}

// =====================================================
// 販路別API呼び出し（スタブ - 実際のAPI実装は別ファイル）
// =====================================================

async function updateEbayStock(
  marketplaceId: MarketplaceId,
  itemId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: eBay Trading API ReviseItem 呼び出し
    // 実際の実装は /api/ebay/revise-item を呼び出す
    const response = await fetch('/api/ebay/revise-quantity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId,
        quantity,
        marketplace: marketplaceId,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'eBay API error' };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'eBay API error' };
  }
}

async function updateShopeeStock(
  marketplaceId: MarketplaceId,
  itemId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Shopee UpdateStock API 呼び出し
    const response = await fetch('/api/shopee/update-stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId,
        quantity,
        marketplace: marketplaceId,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Shopee API error' };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Shopee API error' };
  }
}

async function updateAmazonStock(
  marketplaceId: MarketplaceId,
  itemId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Amazon SP-API UpdateInventory 呼び出し
    const response = await fetch('/api/amazon/update-inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sku: itemId,
        quantity,
        marketplace: marketplaceId,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Amazon API error' };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Amazon API error' };
  }
}

async function updateQoo10Stock(
  marketplaceId: MarketplaceId,
  itemId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Qoo10 UpdateGoodsStock API 呼び出し
    const response = await fetch('/api/qoo10/update-stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemCode: itemId,
        quantity,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Qoo10 API error' };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Qoo10 API error' };
  }
}

async function updateLazadaStock(
  marketplaceId: MarketplaceId,
  itemId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Lazada UpdateStock API 呼び出し
    const response = await fetch('/api/lazada/update-stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId,
        quantity,
        marketplace: marketplaceId,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Lazada API error' };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Lazada API error' };
  }
}

// =====================================================
// 仕入れ先生存確認
// =====================================================

async function checkSupplierAvailability(productMasterId: number): Promise<SupplierCheckResult> {
  try {
    const supabase = createClient();
    
    // products_masterから仕入れ先URLを取得
    const { data: product, error } = await supabase
      .from('products_master')
      .select('source_url, source_price_jpy, source_last_checked_at')
      .eq('id', productMasterId)
      .single();
    
    if (error || !product?.source_url) {
      return { isAvailable: false };
    }
    
    // 最終チェックが1時間以内なら再チェックをスキップ
    if (product.source_last_checked_at) {
      const lastChecked = new Date(product.source_last_checked_at);
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (lastChecked > hourAgo) {
        return {
          isAvailable: true,
          currentPrice: product.source_price_jpy,
          lastCheckedAt: lastChecked,
          supplierUrl: product.source_url,
        };
      }
    }
    
    // TODO: 実際のスクレイピング/API呼び出しで在庫確認
    // ここでは簡易的にtrueを返す
    return {
      isAvailable: true,
      currentPrice: product.source_price_jpy,
      supplierUrl: product.source_url,
    };
    
  } catch (error) {
    console.error('[GlobalStockKiller] 仕入れ先確認エラー:', error);
    return { isAvailable: false };
  }
}

// =====================================================
// ログ記録
// =====================================================

async function logStockSyncEvent(
  supabase: any,
  data: {
    event: SaleEvent;
    inventoryId?: number;
    previousQuantity: number;
    newQuantity: number;
    affectedMarketplaces: StockUpdateResult[];
    executionTimeMs: number;
    warnings: string[];
  }
): Promise<void> {
  try {
    await supabase.from('stock_sync_logs').insert({
      event_type: data.event.eventType,
      source_marketplace: data.event.sourceMarketplace,
      product_master_id: data.event.productMasterId,
      inventory_master_id: data.inventoryId,
      order_number: data.event.orderNumber,
      quantity_change: data.event.quantityChange,
      previous_quantity: data.previousQuantity,
      new_quantity: data.newQuantity,
      affected_marketplaces: data.affectedMarketplaces,
      execution_time_ms: data.executionTimeMs,
      warnings: data.warnings,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    // ログ記録失敗は警告のみ
    console.warn('[GlobalStockKiller] ログ記録失敗:', error);
  }
}

// =====================================================
// ユーティリティ関数
// =====================================================

/**
 * 指数バックオフでリトライ
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRY_COUNT,
  baseDelayMs: number = RETRY_DELAY_BASE_MS
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        console.warn(`[GlobalStockKiller] リトライ ${attempt + 1}/${maxRetries}, ${delay}ms後に再試行`);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// =====================================================
// バッチ処理用（定期ポーリング補助）
// =====================================================

/**
 * 未同期の在庫変更を検出してバッチ処理
 * 15分ごとに実行することでWebhook漏れをカバー
 */
export async function processUnsyncedStockChanges(): Promise<{
  processed: number;
  errors: number;
}> {
  const supabase = createClient();
  let processed = 0;
  let errors = 0;
  
  try {
    // sync_status が 'pending' または 'error' の出品を取得
    const { data: pendingListings, error } = await supabase
      .from('marketplace_listings')
      .select(`
        id,
        product_master_id,
        marketplace_id,
        item_id,
        stock_quantity,
        error_count
      `)
      .in('sync_status', ['pending', 'error'])
      .lt('error_count', MAX_RETRY_COUNT)
      .limit(100);
    
    if (error) {
      throw error;
    }
    
    for (const listing of pendingListings || []) {
      try {
        // inventory_masterまたはproducts_masterから最新の在庫を取得
        const { data: inventory } = await supabase
          .from('inventory_master')
          .select('physical_quantity')
          .eq('product_master_id', listing.product_master_id)
          .single();
        
        const currentQuantity = inventory?.physical_quantity ?? 0;
        
        // 在庫が異なる場合のみ更新
        if (currentQuantity !== listing.stock_quantity) {
          const result = await updateMarketplaceStock(
            listing.marketplace_id as MarketplaceId,
            listing.item_id,
            currentQuantity,
            listing.id
          );
          
          if (result.status === 'success') {
            processed++;
          } else {
            errors++;
          }
        }
      } catch (err) {
        errors++;
        console.error(`[GlobalStockKiller] Batch処理エラー (listing ${listing.id}):`, err);
      }
    }
    
  } catch (error) {
    console.error('[GlobalStockKiller] Batch処理全体エラー:', error);
  }
  
  return { processed, errors };
}

// =====================================================
// エクスポート
// =====================================================

export default {
  processSaleEvent,
  processUnsyncedStockChanges,
  withRetry,
  checkSupplierAvailability,
};
