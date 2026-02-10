/**
 * N3 Multi-Marketplace Listing Service
 * 
 * Phase 9: n8nワークフローと連携した多販路出品サービス
 * 
 * 対応テーブル構造:
 * - listing_queue.id: INTEGER
 * - listing_queue.product_id: UUID (products_masterへの参照)
 * - listing_queue.products_master_id: INTEGER (products_master.idへの参照)
 */

import { createClient } from '@/lib/supabase/client';

// ============================================================
// 型定義
// ============================================================

export type MarketplaceId = 
  | 'ebay_us' | 'ebay_uk' | 'ebay_de' | 'ebay_au'
  | 'ebay' // 既存互換用
  | 'qoo10_jp' | 'qoo10'
  | 'shopee_sg' | 'shopee_my' | 'shopee_th' | 'shopee_ph' | 'shopee_tw' | 'shopee_vn' | 'shopee_id'
  | 'shopify'
  | 'amazon_jp' | 'amazon_us';

export interface ListingRequest {
  productId: string;  // UUID (products_master.id)
  productsMasterId?: number; // products_master_id (integer)
  marketplaces: MarketplaceId[];
  account?: string;
  options?: {
    scheduleAt?: string;
    priority?: 'low' | 'normal' | 'high';
    skipPriceCheck?: boolean;
  };
}

export interface ListingResult {
  success: boolean;
  marketplace: MarketplaceId;
  listingId?: string;
  error?: string;
  timestamp: string;
}

export interface BulkListingRequest {
  productIds: string[];  // UUID[]
  marketplaces: MarketplaceId[];
  account?: string;
  options?: {
    scheduleAt?: string;
    batchSize?: number;
    delayBetweenBatches?: number;
  };
}

export interface StockSyncRequest {
  productId: string;  // UUID
  eventType: 'sale' | 'return' | 'cancel' | 'adjustment';
  quantityChange: number;
  orderNumber?: string;
  sourceMarketplace: MarketplaceId;
}

export interface PriceSyncRequest {
  productId: string;  // UUID
  newPrice: number;
  currency: string;
  reason: 'exchange_rate' | 'competitor' | 'manual' | 'ai_optimization';
  marketplaces?: MarketplaceId[];
}

export interface ListingQueueItem {
  id: number;  // INTEGER
  productId: string | null;  // UUID
  productsMasterId: number | null;  // INTEGER
  scheduleId: number | null;
  marketplace: string;
  account: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'scheduled' | 'cancelled';
  priority: number;
  scheduledAt?: string;
  listedAt?: string;
  executedAt?: string;
  processedAt?: string;
  listingId?: string;
  externalListingId?: string;
  listingData?: any;
  requestData?: any;
  resultData?: any;
  apiResponse?: any;
  error?: string;
  retryCount: number;
  sku?: string;
  createdAt: string;
  updatedAt?: string;
}

// ============================================================
// n8n Webhook URLs
// ============================================================

const N8N_WEBHOOK_BASE = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://160.16.120.186:5678/webhook';

const N8N_WEBHOOKS = {
  // 在庫同期
  stockSync: `${N8N_WEBHOOK_BASE}/stock-sync`,
  stockRestore: `${N8N_WEBHOOK_BASE}/stock-restore`,
  
  // 出品管理
  listingHub: `${N8N_WEBHOOK_BASE}/listing-hub`,
  listingExecute: `${N8N_WEBHOOK_BASE}/listing-execute`,
  listingReserve: `${N8N_WEBHOOK_BASE}/listing-reserve`,
  
  // AI機能
  aiSmResearch: `${N8N_WEBHOOK_BASE}/ai-sm-research`,
  supplierSwitch: `${N8N_WEBHOOK_BASE}/supplier-switch`,
  
  // 価格管理
  priceSync: `${N8N_WEBHOOK_BASE}/price-sync`,
};

// ============================================================
// Multi-Marketplace Listing Service
// ============================================================

export class MultiMarketplaceListingService {
  private supabase = createClient();

  // --------------------------------------------------------
  // 出品リクエスト
  // --------------------------------------------------------

  /**
   * 単一商品を複数販路に出品
   */
  async requestListing(request: ListingRequest): Promise<{
    success: boolean;
    queueIds: number[];
    errors?: string[];
  }> {
    const { productId, marketplaces, account, options } = request;
    const queueIds: number[] = [];
    const errors: string[] = [];

    try {
      // 商品情報を取得
      const { data: product, error: productError } = await this.supabase
        .from('products_master')
        .select('id, sku, title_en, listing_price, stock_quantity, workflow_status')
        .eq('id', productId)
        .single();

      if (productError || !product) {
        return { success: false, queueIds: [], errors: ['商品が見つかりません'] };
      }

      // ワークフローステータス確認
      if (product.workflow_status !== 'approved' && !options?.skipPriceCheck) {
        return { success: false, queueIds: [], errors: ['商品が承認されていません'] };
      }

      // 各販路への出品をキューに追加
      for (const marketplace of marketplaces) {
        try {
          const { data: queueItem, error: queueError } = await this.supabase
            .from('listing_queue')
            .insert({
              product_id: productId,  // UUID
              marketplace: marketplace,
              account: account || 'default',
              status: options?.scheduleAt ? 'scheduled' : 'pending',
              priority: options?.priority === 'high' ? 200 : options?.priority === 'low' ? 50 : 100,
              scheduled_at: options?.scheduleAt || null,
              sku: product.sku,
              listing_data: {
                sku: product.sku,
                title: product.title_en,
                price: product.listing_price,
                quantity: product.stock_quantity,
              },
              request_data: {
                sku: product.sku,
                title: product.title_en,
                price: product.listing_price,
                quantity: product.stock_quantity,
              },
            })
            .select('id')
            .single();

          if (queueError) {
            errors.push(`${marketplace}: キュー追加失敗 - ${queueError.message}`);
          } else if (queueItem) {
            queueIds.push(queueItem.id);
          }
        } catch (e: any) {
          errors.push(`${marketplace}: ${e.message}`);
        }
      }

      // n8nに出品ハブへ通知（即時出品の場合）
      if (queueIds.length > 0 && !options?.scheduleAt) {
        await this.triggerN8nListingHub(productId, marketplaces, account);
      }

      return {
        success: queueIds.length > 0,
        queueIds,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (e: any) {
      return { success: false, queueIds: [], errors: [e.message] };
    }
  }

  /**
   * 複数商品を一括出品
   */
  async requestBulkListing(request: BulkListingRequest): Promise<{
    success: boolean;
    totalQueued: number;
    errors: string[];
  }> {
    const { productIds, marketplaces, account, options } = request;
    const errors: string[] = [];
    let totalQueued = 0;

    const batchSize = options?.batchSize || 10;
    
    for (let i = 0; i < productIds.length; i += batchSize) {
      const batch = productIds.slice(i, i + batchSize);
      
      for (const productId of batch) {
        const result = await this.requestListing({
          productId,
          marketplaces,
          account,
          options: {
            scheduleAt: options?.scheduleAt,
            priority: 'normal',
          },
        });

        totalQueued += result.queueIds.length;
        if (result.errors) {
          errors.push(...result.errors.map(e => `Product ${productId}: ${e}`));
        }
      }

      // バッチ間の遅延
      if (options?.delayBetweenBatches && i + batchSize < productIds.length) {
        await new Promise(resolve => setTimeout(resolve, options.delayBetweenBatches));
      }
    }

    return {
      success: totalQueued > 0,
      totalQueued,
      errors,
    };
  }

  // --------------------------------------------------------
  // 在庫同期
  // --------------------------------------------------------

  /**
   * 在庫変更を全販路に同期
   */
  async syncStock(request: StockSyncRequest): Promise<{
    success: boolean;
    syncedMarketplaces: MarketplaceId[];
    errors?: string[];
  }> {
    try {
      const response = await fetch(N8N_WEBHOOKS.stockSync, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: request.eventType,
          product_id: request.productId,
          quantity_change: request.quantityChange,
          order_number: request.orderNumber,
          source_marketplace: request.sourceMarketplace,
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n応答エラー: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        syncedMarketplaces: result.synced_marketplaces || [],
        errors: result.errors,
      };
    } catch (e: any) {
      return {
        success: false,
        syncedMarketplaces: [],
        errors: [e.message],
      };
    }
  }

  /**
   * 在庫復元（返品・キャンセル）
   */
  async restoreStock(request: Omit<StockSyncRequest, 'eventType'>): Promise<{
    success: boolean;
    newQuantity?: number;
    error?: string;
  }> {
    try {
      const response = await fetch(N8N_WEBHOOKS.stockRestore, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: request.productId,
          quantity_change: Math.abs(request.quantityChange),
          order_number: request.orderNumber,
          source_marketplace: request.sourceMarketplace,
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n応答エラー: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        newQuantity: result.new_quantity,
      };
    } catch (e: any) {
      return {
        success: false,
        error: e.message,
      };
    }
  }

  // --------------------------------------------------------
  // 価格同期
  // --------------------------------------------------------

  /**
   * 価格変更を販路に同期
   */
  async syncPrice(request: PriceSyncRequest): Promise<{
    success: boolean;
    updatedMarketplaces: MarketplaceId[];
    errors?: string[];
  }> {
    try {
      const response = await fetch(N8N_WEBHOOKS.priceSync, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: request.productId,
          new_price: request.newPrice,
          currency: request.currency,
          reason: request.reason,
          target_marketplaces: request.marketplaces,
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n応答エラー: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        updatedMarketplaces: result.updated_marketplaces || [],
        errors: result.errors,
      };
    } catch (e: any) {
      return {
        success: false,
        updatedMarketplaces: [],
        errors: [e.message],
      };
    }
  }

  // --------------------------------------------------------
  // AI機能
  // --------------------------------------------------------

  /**
   * AI競合リサーチを実行
   */
  async requestAiSmResearch(productId: string): Promise<{
    success: boolean;
    smItemId?: string;
    confidence?: number;
    error?: string;
  }> {
    try {
      const response = await fetch(N8N_WEBHOOKS.aiSmResearch, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!response.ok) {
        throw new Error(`n8n応答エラー: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: result.status === 'selected',
        smItemId: result.sm_item_id,
        confidence: result.confidence_score,
        error: result.fail_reason,
      };
    } catch (e: any) {
      return {
        success: false,
        error: e.message,
      };
    }
  }

  /**
   * 代替仕入先探索を実行
   */
  async requestSupplierSwitch(productId: string): Promise<{
    success: boolean;
    searching: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch(N8N_WEBHOOKS.supplierSwitch, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!response.ok) {
        throw new Error(`n8n応答エラー: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        searching: result.recommendation === '探索すべき',
        error: result.reasoning,
      };
    } catch (e: any) {
      return {
        success: false,
        searching: false,
        error: e.message,
      };
    }
  }

  // --------------------------------------------------------
  // 出品キュー管理
  // --------------------------------------------------------

  /**
   * 出品キューを取得
   */
  async getListingQueue(filters?: {
    status?: ListingQueueItem['status'];
    marketplace?: MarketplaceId | string;
    limit?: number;
  }): Promise<ListingQueueItem[]> {
    let query = this.supabase
      .from('listing_queue')
      .select('*')
      .order('priority', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: true });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.marketplace) {
      query = query.eq('marketplace', filters.marketplace);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Queue fetch error:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      productId: item.product_id,
      productsMasterId: item.products_master_id,
      scheduleId: item.schedule_id,
      marketplace: item.marketplace,
      account: item.account,
      status: item.status || 'pending',
      priority: item.priority || 100,
      scheduledAt: item.scheduled_at,
      listedAt: item.listed_at,
      executedAt: item.executed_at,
      processedAt: item.processed_at,
      listingId: item.listing_id,
      externalListingId: item.external_listing_id,
      listingData: item.listing_data,
      requestData: item.request_data,
      resultData: item.result_data,
      apiResponse: item.api_response,
      error: item.error_message,
      retryCount: item.retry_count || 0,
      sku: item.sku,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  }

  /**
   * キューアイテムをキャンセル
   */
  async cancelQueueItem(queueId: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('listing_queue')
      .update({ 
        status: 'cancelled', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', queueId)
      .in('status', ['pending', 'scheduled']);

    return !error;
  }

  /**
   * キューアイテムをリトライ
   */
  async retryQueueItem(queueId: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('listing_queue')
      .update({ 
        status: 'pending', 
        error_message: null,
        updated_at: new Date().toISOString() 
      })
      .eq('id', queueId)
      .eq('status', 'failed');

    return !error;
  }

  // --------------------------------------------------------
  // 統計情報
  // --------------------------------------------------------

  /**
   * 出品統計を取得
   */
  async getListingStats(): Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    scheduled: number;
    byMarketplace: Record<string, number>;
  }> {
    const { data, error } = await this.supabase
      .from('listing_queue')
      .select('status, marketplace')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error || !data) {
      return {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        scheduled: 0,
        byMarketplace: {},
      };
    }

    const stats = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      scheduled: 0,
      byMarketplace: {} as Record<string, number>,
    };

    for (const item of data) {
      // ステータス別カウント
      if (item.status && item.status in stats) {
        (stats as any)[item.status]++;
      }
      
      // 販路別カウント
      if (item.marketplace) {
        stats.byMarketplace[item.marketplace] = 
          (stats.byMarketplace[item.marketplace] || 0) + 1;
      }
    }

    return stats;
  }

  // --------------------------------------------------------
  // 内部ヘルパー
  // --------------------------------------------------------

  private async triggerN8nListingHub(
    productId: string,
    marketplaces: MarketplaceId[],
    account?: string
  ): Promise<void> {
    try {
      await fetch(N8N_WEBHOOKS.listingHub, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          marketplaces: marketplaces,
          account: account || 'default',
        }),
      });
    } catch (e) {
      console.error('n8n listing hub trigger failed:', e);
    }
  }
}

// シングルトンインスタンス
export const multiMarketplaceListingService = new MultiMarketplaceListingService();
