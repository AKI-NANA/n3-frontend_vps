// lib/gateway-client.ts
/**
 * 帝国OS統合ゲートウェイクライアント
 * 
 * ツールからゲートウェイを呼び出すためのヘルパー
 * 
 * @example
 * import { gateway } from '@/lib/gateway-client';
 * 
 * // 今すぐ出品
 * const result = await gateway.listingNow({
 *   ids: [1, 2, 3],
 *   marketplace: 'ebay',
 *   account: 'green',
 * });
 * 
 * // 在庫同期
 * const result = await gateway.inventorySync({
 *   account: 'mjt',
 *   mode: 'incremental',
 * });
 */

// ============================================================
// 型定義
// ============================================================

type ActionType = 
  | 'LISTING_NOW'
  | 'LISTING_SCHEDULE'
  | 'LISTING_RESERVE'
  | 'LISTING_CANCEL'
  | 'LISTING_END'
  | 'INVENTORY_SYNC'
  | 'INVENTORY_UPDATE'
  | 'STOCK_DECREMENT'
  | 'PRICE_UPDATE'
  | 'PRICE_BULK_UPDATE'
  | 'NOTIFY_CHATWORK'
  | 'NOTIFY_SLACK'
  | 'NOTIFY_EMAIL'
  | 'AI_ANALYSIS'
  | 'AI_TRANSLATION'
  | 'AI_ENRICHMENT'
  | 'ORDER_PROCESS'
  | 'SHIPPING_CALCULATE'
  | 'REPORT_GENERATE';

type Marketplace = 'ebay' | 'amazon' | 'qoo10' | 'shopee' | 'mercari';

interface GatewayRequest {
  action_type: ActionType;
  channel_config: {
    marketplace: Marketplace;
    account?: string;
    region?: string;
  };
  payload: Record<string, any>;
  metadata?: {
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    notify?: boolean;
    source?: string;
  };
}

interface GatewayResponse<T = any> {
  success: boolean;
  action_type: ActionType;
  data?: T;
  error?: string;
  metadata: {
    request_id: string;
    timestamp: string;
    processing_time_ms: number;
    n8n_used: boolean;
  };
}

// ============================================================
// コア関数
// ============================================================

async function callGateway<T = any>(request: GatewayRequest): Promise<GatewayResponse<T>> {
  try {
    const response = await fetch('/api/gateway', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      action_type: request.action_type,
      error: error instanceof Error ? error.message : 'Gateway connection failed',
      metadata: {
        request_id: 'error',
        timestamp: new Date().toISOString(),
        processing_time_ms: 0,
        n8n_used: false,
      },
    };
  }
}

// ============================================================
// 出品関連
// ============================================================

interface ListingParams {
  ids: number[];
  marketplace: Marketplace;
  account: string;
  products?: any[];
  scheduledAt?: string;
}

async function listingNow(params: ListingParams): Promise<GatewayResponse> {
  return callGateway({
    action_type: 'LISTING_NOW',
    channel_config: {
      marketplace: params.marketplace,
      account: params.account,
    },
    payload: {
      ids: params.ids,
      action: 'list_now',
      products: params.products || [],
    },
    metadata: {
      priority: 'high',
      notify: true,
      source: 'N3-Frontend',
    },
  });
}

async function listingSchedule(params: ListingParams & { scheduledAt: string }): Promise<GatewayResponse> {
  return callGateway({
    action_type: 'LISTING_SCHEDULE',
    channel_config: {
      marketplace: params.marketplace,
      account: params.account,
    },
    payload: {
      ids: params.ids,
      action: 'schedule',
      scheduledAt: params.scheduledAt,
      products: params.products || [],
    },
    metadata: {
      priority: 'normal',
      notify: true,
      source: 'N3-Frontend',
    },
  });
}

async function listingReserve(params: ListingParams): Promise<GatewayResponse> {
  return callGateway({
    action_type: 'LISTING_RESERVE',
    channel_config: {
      marketplace: params.marketplace,
      account: params.account,
    },
    payload: {
      ids: params.ids,
      action: 'reserve',
      products: params.products || [],
    },
    metadata: {
      priority: 'normal',
      source: 'N3-Frontend',
    },
  });
}

async function listingEnd(params: { ids: number[]; marketplace: Marketplace; account: string; reason?: string }): Promise<GatewayResponse> {
  return callGateway({
    action_type: 'LISTING_END',
    channel_config: {
      marketplace: params.marketplace,
      account: params.account,
    },
    payload: {
      ids: params.ids,
      reason: params.reason || 'manual',
    },
    metadata: {
      priority: 'high',
      notify: true,
      source: 'N3-Frontend',
    },
  });
}

// ============================================================
// 在庫関連
// ============================================================

interface InventorySyncParams {
  marketplace: Marketplace;
  account: string;
  mode?: 'full' | 'incremental';
}

async function inventorySync(params: InventorySyncParams): Promise<GatewayResponse> {
  return callGateway({
    action_type: 'INVENTORY_SYNC',
    channel_config: {
      marketplace: params.marketplace,
      account: params.account,
    },
    payload: {
      mode: params.mode || 'incremental',
    },
    metadata: {
      priority: 'normal',
      source: 'N3-Frontend',
    },
  });
}

async function stockDecrement(params: { sku: string; quantity: number; marketplace: Marketplace }): Promise<GatewayResponse> {
  return callGateway({
    action_type: 'STOCK_DECREMENT',
    channel_config: {
      marketplace: params.marketplace,
    },
    payload: {
      sku: params.sku,
      quantity: params.quantity,
    },
    metadata: {
      priority: 'urgent',
      notify: true,
      source: 'N3-Frontend',
    },
  });
}

// ============================================================
// 価格関連
// ============================================================

interface PriceUpdateParams {
  sku: string;
  price: number;
  marketplace: Marketplace;
  account: string;
}

async function priceUpdate(params: PriceUpdateParams): Promise<GatewayResponse> {
  return callGateway({
    action_type: 'PRICE_UPDATE',
    channel_config: {
      marketplace: params.marketplace,
      account: params.account,
    },
    payload: {
      sku: params.sku,
      price: params.price,
    },
    metadata: {
      priority: 'normal',
      source: 'N3-Frontend',
    },
  });
}

async function priceBulkUpdate(params: { items: { sku: string; price: number }[]; marketplace: Marketplace; account: string }): Promise<GatewayResponse> {
  return callGateway({
    action_type: 'PRICE_BULK_UPDATE',
    channel_config: {
      marketplace: params.marketplace,
      account: params.account,
    },
    payload: {
      items: params.items,
    },
    metadata: {
      priority: 'normal',
      source: 'N3-Frontend',
    },
  });
}

// ============================================================
// 通知関連
// ============================================================

interface NotifyParams {
  message: string;
  channel?: string;
  room_id?: string;
}

async function notifyChatwork(params: NotifyParams): Promise<GatewayResponse> {
  return callGateway({
    action_type: 'NOTIFY_CHATWORK',
    channel_config: {
      marketplace: 'ebay', // ダミー（通知には不要だが必須フィールド）
    },
    payload: {
      message: params.message,
      room_id: params.room_id,
    },
    metadata: {
      priority: 'normal',
      source: 'N3-Frontend',
    },
  });
}

async function notifySlack(params: NotifyParams): Promise<GatewayResponse> {
  return callGateway({
    action_type: 'NOTIFY_SLACK',
    channel_config: {
      marketplace: 'ebay',
    },
    payload: {
      message: params.message,
      channel: params.channel,
    },
    metadata: {
      priority: 'normal',
      source: 'N3-Frontend',
    },
  });
}

// ============================================================
// AI関連
// ============================================================

async function aiAnalysis(params: { productIds: number[]; analysisType: string }): Promise<GatewayResponse> {
  return callGateway({
    action_type: 'AI_ANALYSIS',
    channel_config: {
      marketplace: 'ebay',
    },
    payload: {
      productIds: params.productIds,
      analysisType: params.analysisType,
    },
    metadata: {
      priority: 'low',
      source: 'N3-Frontend',
    },
  });
}

async function aiTranslation(params: { text: string; sourceLang: string; targetLang: string }): Promise<GatewayResponse> {
  return callGateway({
    action_type: 'AI_TRANSLATION',
    channel_config: {
      marketplace: 'ebay',
    },
    payload: {
      text: params.text,
      sourceLang: params.sourceLang,
      targetLang: params.targetLang,
    },
    metadata: {
      priority: 'normal',
      source: 'N3-Frontend',
    },
  });
}

// ============================================================
// ヘルスチェック
// ============================================================

async function healthCheck(): Promise<{
  gateway_status: string;
  n8n_status: string;
  actions_count: number;
}> {
  try {
    const response = await fetch('/api/gateway');
    const data = await response.json();
    return {
      gateway_status: data.gateway_status || 'unknown',
      n8n_status: data.n8n_status || 'unknown',
      actions_count: data.actions_count || 0,
    };
  } catch {
    return {
      gateway_status: 'unreachable',
      n8n_status: 'unknown',
      actions_count: 0,
    };
  }
}

async function listActions(): Promise<any[]> {
  try {
    const response = await fetch('/api/gateway?action=list');
    const data = await response.json();
    return data.actions || [];
  } catch {
    return [];
  }
}

// ============================================================
// エクスポート
// ============================================================

export const gateway = {
  // コア
  call: callGateway,
  healthCheck,
  listActions,
  
  // 出品
  listingNow,
  listingSchedule,
  listingReserve,
  listingEnd,
  
  // 在庫
  inventorySync,
  stockDecrement,
  
  // 価格
  priceUpdate,
  priceBulkUpdate,
  
  // 通知
  notifyChatwork,
  notifySlack,
  
  // AI
  aiAnalysis,
  aiTranslation,
};

export type { GatewayRequest, GatewayResponse, ActionType, Marketplace };
