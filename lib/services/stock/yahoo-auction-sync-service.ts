// lib/services/stock/yahoo-auction-sync-service.ts
/**
 * ヤフオク在庫同期サービス
 * 
 * 【機能】
 * - 1日2回、ヤフオクURLのステータスを確認
 * - 終了していればeBayの在庫を0に更新
 * - n8nロジックをNext.js APIワーカーに移植
 * 
 * 【同期ループ】
 * 1. products_masterからyahoo_auction_urlを持つ商品を取得
 * 2. 各URLにアクセスしてステータスを確認
 * 3. 終了/落札済みの場合、eBay在庫を0に更新
 * 4. ログを記録、ChatWork通知
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================
// 型定義
// ============================================================

export interface YahooAuctionProduct {
  id: string | number;
  sku: string;
  yahoo_auction_url: string;
  ebay_item_id?: string;
  ebay_sku?: string;
  current_stock: number;
  title?: string;
}

export interface YahooAuctionStatus {
  url: string;
  isEnded: boolean;
  isSold: boolean;
  status: 'active' | 'ended' | 'sold' | 'error';
  currentPrice?: number;
  endTime?: string;
  error?: string;
}

export interface SyncResult {
  productId: string | number;
  sku: string;
  yahooStatus: YahooAuctionStatus;
  ebayUpdated: boolean;
  ebayError?: string;
}

export interface BatchSyncResult {
  success: boolean;
  totalChecked: number;
  endedCount: number;
  updatedCount: number;
  errorCount: number;
  results: SyncResult[];
  executionTimeMs: number;
}

// ============================================================
// ヤフオクステータスチェック
// ============================================================

/**
 * ヤフオクURLからオークションIDを抽出
 */
function extractAuctionId(url: string): string | null {
  // https://page.auctions.yahoo.co.jp/jp/auction/xxxxx
  // https://auctions.yahoo.co.jp/jp/auction/xxxxx
  const match = url.match(/auction\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

/**
 * ヤフオクのステータスを確認
 * - スクレイピングでページ内容を解析
 * - または Yahoo! Auction API（要設定）
 */
export async function checkYahooAuctionStatus(url: string): Promise<YahooAuctionStatus> {
  const auctionId = extractAuctionId(url);
  
  if (!auctionId) {
    return {
      url,
      isEnded: false,
      isSold: false,
      status: 'error',
      error: 'Invalid auction URL',
    };
  }
  
  try {
    // ヤフオクページを取得
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'ja,en;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
    });
    
    if (!response.ok) {
      // 404 = オークション終了の可能性
      if (response.status === 404) {
        return {
          url,
          isEnded: true,
          isSold: false,
          status: 'ended',
        };
      }
      
      return {
        url,
        isEnded: false,
        isSold: false,
        status: 'error',
        error: `HTTP ${response.status}`,
      };
    }
    
    const html = await response.text();
    
    // ステータス判定（HTML解析）
    const isEnded = 
      html.includes('このオークションは終了しています') ||
      html.includes('オークションは終了しました') ||
      html.includes('auction has ended') ||
      html.includes('落札されました') ||
      html.includes('Auction ended');
    
    const isSold = 
      html.includes('落札されました') ||
      html.includes('落札者') ||
      html.includes('won this auction');
    
    // 現在価格を抽出（オプション）
    let currentPrice: number | undefined;
    const priceMatch = html.match(/data-price="(\d+)"/);
    if (priceMatch) {
      currentPrice = parseInt(priceMatch[1], 10);
    }
    
    // 終了時刻を抽出（オプション）
    let endTime: string | undefined;
    const endTimeMatch = html.match(/data-endtime="([^"]+)"/);
    if (endTimeMatch) {
      endTime = endTimeMatch[1];
    }
    
    return {
      url,
      isEnded,
      isSold,
      status: isEnded ? (isSold ? 'sold' : 'ended') : 'active',
      currentPrice,
      endTime,
    };
    
  } catch (error) {
    console.error(`[YahooSync] Error checking ${url}:`, error);
    
    // タイムアウトの場合は一時的なエラーとして扱う
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        url,
        isEnded: false,
        isSold: false,
        status: 'error',
        error: 'Timeout',
      };
    }
    
    return {
      url,
      isEnded: false,
      isSold: false,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================
// eBay在庫更新
// ============================================================

/**
 * eBay在庫を0に更新
 */
async function updateEbayInventoryToZero(
  productId: string | number,
  sku: string,
  ebayItemId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Internal API経由でeBay在庫を更新
    const response = await fetch('/api/ebay/inventory/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        sku,
        ebayItemId,
        quantity: 0,
        reason: 'yahoo_auction_ended',
      }),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true };
    
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
}

/**
 * Supabaseで商品の在庫を0に更新
 */
async function updateProductStock(
  supabase: ReturnType<typeof createClient>,
  productId: string | number,
  yahooStatus: YahooAuctionStatus
): Promise<void> {
  await supabase
    .from('products_master')
    .update({
      current_stock: 0,
      physical_quantity: 0,
      yahoo_auction_status: yahooStatus.status,
      yahoo_auction_ended_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId);
}

// ============================================================
// メイン同期関数
// ============================================================

/**
 * 全ヤフオク商品の在庫同期を実行
 */
export async function syncYahooAuctionInventory(
  options: {
    dryRun?: boolean;
    limit?: number;
    notifyChat?: boolean;
  } = {}
): Promise<BatchSyncResult> {
  const startTime = Date.now();
  const { dryRun = false, limit = 100, notifyChat = true } = options;
  
  console.log('[YahooSync] Starting inventory sync...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return {
      success: false,
      totalChecked: 0,
      endedCount: 0,
      updatedCount: 0,
      errorCount: 1,
      results: [],
      executionTimeMs: Date.now() - startTime,
    };
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // 1. ヤフオクURLを持つ商品を取得
  const { data: products, error: fetchError } = await supabase
    .from('products_master')
    .select('id, sku, yahoo_auction_url, ebay_item_id, current_stock, title')
    .not('yahoo_auction_url', 'is', null)
    .neq('yahoo_auction_url', '')
    .gt('current_stock', 0)  // 在庫がある商品のみ
    .limit(limit);
  
  if (fetchError || !products) {
    console.error('[YahooSync] Failed to fetch products:', fetchError);
    return {
      success: false,
      totalChecked: 0,
      endedCount: 0,
      updatedCount: 0,
      errorCount: 1,
      results: [],
      executionTimeMs: Date.now() - startTime,
    };
  }
  
  console.log(`[YahooSync] Found ${products.length} products to check`);
  
  const results: SyncResult[] = [];
  let endedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;
  
  // 2. 各商品のステータスをチェック
  for (const product of products as YahooAuctionProduct[]) {
    try {
      // ヤフオクステータスを確認
      const yahooStatus = await checkYahooAuctionStatus(product.yahoo_auction_url);
      
      let ebayUpdated = false;
      let ebayError: string | undefined;
      
      if (yahooStatus.isEnded || yahooStatus.isSold) {
        endedCount++;
        
        if (!dryRun) {
          // Supabaseの在庫を更新
          await updateProductStock(supabase, product.id, yahooStatus);
          
          // eBay在庫を更新
          if (product.ebay_item_id) {
            const ebayResult = await updateEbayInventoryToZero(
              product.id,
              product.sku,
              product.ebay_item_id
            );
            ebayUpdated = ebayResult.success;
            ebayError = ebayResult.error;
            
            if (ebayResult.success) {
              updatedCount++;
            } else {
              errorCount++;
            }
          } else {
            // eBay item IDがない場合はSupabase更新のみ
            updatedCount++;
          }
        }
        
        console.log(`[YahooSync] ${yahooStatus.status.toUpperCase()}: ${product.sku} - ${product.title?.substring(0, 50)}`);
      }
      
      results.push({
        productId: product.id,
        sku: product.sku,
        yahooStatus,
        ebayUpdated,
        ebayError,
      });
      
      // レートリミット対策（1秒待機）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      errorCount++;
      results.push({
        productId: product.id,
        sku: product.sku,
        yahooStatus: {
          url: product.yahoo_auction_url,
          isEnded: false,
          isSold: false,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        ebayUpdated: false,
        ebayError: 'Skipped due to status check error',
      });
    }
  }
  
  // 3. 同期ログを記録
  try {
    await supabase.from('sync_logs').insert({
      sync_type: 'yahoo_auction_inventory',
      total_checked: products.length,
      ended_count: endedCount,
      updated_count: updatedCount,
      error_count: errorCount,
      dry_run: dryRun,
      execution_time_ms: Date.now() - startTime,
      created_at: new Date().toISOString(),
    });
  } catch (logError) {
    console.error('[YahooSync] Failed to log sync:', logError);
  }
  
  // 4. ChatWork通知
  if (notifyChat && endedCount > 0) {
    await notifyYahooSyncResult({
      totalChecked: products.length,
      endedCount,
      updatedCount,
      errorCount,
      dryRun,
    });
  }
  
  console.log(`[YahooSync] Completed: ${endedCount} ended, ${updatedCount} updated, ${errorCount} errors`);
  
  return {
    success: errorCount === 0,
    totalChecked: products.length,
    endedCount,
    updatedCount,
    errorCount,
    results,
    executionTimeMs: Date.now() - startTime,
  };
}

/**
 * ChatWork通知
 */
async function notifyYahooSyncResult(summary: {
  totalChecked: number;
  endedCount: number;
  updatedCount: number;
  errorCount: number;
  dryRun: boolean;
}): Promise<void> {
  const chatworkToken = process.env.CHATWORK_API_TOKEN;
  const chatworkRoomId = process.env.CHATWORK_ROOM_ID;
  
  if (!chatworkToken || !chatworkRoomId) return;
  
  const message = `[info][title]ヤフオク在庫同期完了${summary.dryRun ? '(DryRun)' : ''}[/title]
チェック数: ${summary.totalChecked}
終了オークション: ${summary.endedCount}
eBay更新成功: ${summary.updatedCount}
エラー: ${summary.errorCount}[/info]`;
  
  try {
    await fetch(`https://api.chatwork.com/v2/rooms/${chatworkRoomId}/messages`, {
      method: 'POST',
      headers: {
        'X-ChatWorkToken': chatworkToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `body=${encodeURIComponent(message)}`,
    });
  } catch (error) {
    console.error('[YahooSync] ChatWork notification failed:', error);
  }
}

// ============================================================
// スケジュール実行用（Cron/定期実行）
// ============================================================

/**
 * 定期実行用のエントリーポイント
 * - 1日2回（朝9時、夜21時）の実行を想定
 */
export async function scheduledYahooSync(): Promise<void> {
  console.log('[YahooSync] Scheduled sync started at', new Date().toISOString());
  
  const result = await syncYahooAuctionInventory({
    dryRun: false,
    limit: 200,  // 1回あたり最大200件
    notifyChat: true,
  });
  
  console.log('[YahooSync] Scheduled sync completed:', {
    totalChecked: result.totalChecked,
    endedCount: result.endedCount,
    updatedCount: result.updatedCount,
    errorCount: result.errorCount,
    executionTimeMs: result.executionTimeMs,
  });
}

// ============================================================
// エクスポート
// ============================================================

export default {
  syncYahooAuctionInventory,
  checkYahooAuctionStatus,
  scheduledYahooSync,
};
