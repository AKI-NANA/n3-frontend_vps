// lib/services/n8n/index.ts
// N3 n8n統合サービス - 出品・在庫管理・スケジュール・メディアをn8n経由で実行

const N8N_BASE_URL = process.env.N8N_BASE_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://160.16.120.186:5678';
const N8N_WEBHOOK_BASE = `${N8N_BASE_URL}/webhook`;

// ========================================
// 型定義
// ========================================
export interface N8nResponse {
  success: boolean;
  jobId?: string;
  data?: any;
  error?: string;
  message?: string;
}

export interface ListingRequest {
  productId: number | string;
  action: 'list_now' | 'schedule' | 'reserve' | 'revise' | 'end';
  target: 'ebay' | 'amazon' | 'qoo10' | 'shopee';
  account?: string;
  marketplace?: string;
  scheduledAt?: string;
  options?: {
    title?: string;
    description?: string;
    price?: number;
    quantity?: number;
    categoryId?: string;
    sku?: string;
    imageUrls?: string[];
    [key: string]: any;
  };
}

export interface InventorySyncRequest {
  action: 'sync_all' | 'sync_single' | 'check_stock' | 'update_price';
  productIds?: (number | string)[];
  platforms?: ('ebay' | 'amazon' | 'qoo10')[];
  options?: {
    forceSync?: boolean;
    skipZeroStock?: boolean;
    priceAdjustment?: number;
  };
}

export interface ScheduleRequest {
  action: 'create' | 'update' | 'delete' | 'execute';
  scheduleId?: string;
  productIds?: (number | string)[];
  scheduledAt?: string;
  target?: string;
  account?: string;
  recurring?: boolean;
  cronExpression?: string;
}

// ========================================
// ヘルパー関数
// ========================================
function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function callN8nWebhook(endpoint: string, data: any): Promise<N8nResponse> {
  const url = `${N8N_WEBHOOK_BASE}/${endpoint}`;
  const jobId = generateJobId();
  
  console.log(`[N8n] Calling webhook: ${url}`, { jobId, data });
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Job-Id': jobId,
      },
      body: JSON.stringify({
        job_id: jobId,
        timestamp: new Date().toISOString(),
        ...data,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[N8n] Webhook error: ${response.status}`, errorText);
      return {
        success: false,
        jobId,
        error: `n8n error: ${response.status} - ${errorText}`,
      };
    }
    
    const result = await response.json();
    console.log(`[N8n] Webhook success:`, result);
    
    return {
      success: true,
      jobId: result.job_id || jobId,
      data: result,
      message: result.message || 'Request submitted successfully',
    };
  } catch (error) {
    console.error(`[N8n] Webhook failed:`, error);
    return {
      success: false,
      jobId,
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

// ========================================
// 出品サービス
// ========================================
export const N8nListingService = {
  /**
   * 即時出品
   */
  async publishNow(request: ListingRequest): Promise<N8nResponse> {
    return callN8nWebhook('listing-reserve', {
      action: 'list_now',
      ids: [request.productId],
      target: request.target,
      account: request.account || 'default',
      marketplace: request.marketplace || 'EBAY_US',
      options: request.options,
    });
  },
  
  /**
   * スケジュール出品
   */
  async schedule(request: ListingRequest): Promise<N8nResponse> {
    return callN8nWebhook('listing-reserve', {
      action: 'schedule',
      ids: [request.productId],
      target: request.target,
      account: request.account,
      scheduledAt: request.scheduledAt,
      options: request.options,
    });
  },
  
  /**
   * バッチ出品（複数商品）
   */
  async publishBatch(productIds: (number | string)[], target: string, account?: string): Promise<N8nResponse> {
    return callN8nWebhook('batch-listing', {
      action: 'list_now',
      ids: productIds,
      target,
      account: account || 'default',
    });
  },
  
  /**
   * 出品終了
   */
  async endListing(productId: number | string, target: string): Promise<N8nResponse> {
    return callN8nWebhook('listing-reserve', {
      action: 'end',
      ids: [productId],
      target,
    });
  },
  
  /**
   * 出品内容更新
   */
  async reviseListing(request: ListingRequest): Promise<N8nResponse> {
    return callN8nWebhook('listing-reserve', {
      action: 'revise',
      ids: [request.productId],
      target: request.target,
      options: request.options,
    });
  },
};

// ========================================
// 在庫管理サービス
// ========================================
export const N8nInventoryService = {
  /**
   * 全在庫同期
   */
  async syncAll(platforms?: string[]): Promise<N8nResponse> {
    return callN8nWebhook('inventory-sync', {
      action: 'sync_all',
      platforms: platforms || ['ebay', 'amazon', 'qoo10'],
    });
  },
  
  /**
   * 単一商品の在庫同期
   */
  async syncProduct(productId: number | string): Promise<N8nResponse> {
    return callN8nWebhook('inventory-sync', {
      action: 'sync_single',
      productIds: [productId],
    });
  },
  
  /**
   * 在庫チェック（仕入先監視）
   */
  async checkStock(productIds?: (number | string)[]): Promise<N8nResponse> {
    return callN8nWebhook('inventory-monitoring', {
      action: 'check_stock',
      productIds,
    });
  },
  
  /**
   * 価格更新
   */
  async updatePrices(productIds: (number | string)[], priceAdjustment?: number): Promise<N8nResponse> {
    return callN8nWebhook('inventory-sync', {
      action: 'update_price',
      productIds,
      options: { priceAdjustment },
    });
  },
  
  /**
   * 在庫切れアラート確認
   */
  async checkOutOfStock(): Promise<N8nResponse> {
    return callN8nWebhook('inventory-monitoring', {
      action: 'check_out_of_stock',
    });
  },
};

// ========================================
// スケジュールサービス
// ========================================
export const N8nScheduleService = {
  /**
   * スケジュール作成
   */
  async create(request: ScheduleRequest): Promise<N8nResponse> {
    return callN8nWebhook('schedule-cron', {
      action: 'create',
      ...request,
    });
  },
  
  /**
   * スケジュール更新
   */
  async update(scheduleId: string, updates: Partial<ScheduleRequest>): Promise<N8nResponse> {
    return callN8nWebhook('schedule-cron', {
      action: 'update',
      scheduleId,
      ...updates,
    });
  },
  
  /**
   * スケジュール削除
   */
  async delete(scheduleId: string): Promise<N8nResponse> {
    return callN8nWebhook('schedule-cron', {
      action: 'delete',
      scheduleId,
    });
  },
  
  /**
   * 手動実行
   */
  async executeNow(scheduleId: string): Promise<N8nResponse> {
    return callN8nWebhook('schedule-cron', {
      action: 'execute',
      scheduleId,
    });
  },
};

// ========================================
// 通知サービス
// ========================================
export const N8nNotificationService = {
  /**
   * ChatWork通知
   */
  async sendChatWork(message: string, roomId?: string): Promise<N8nResponse> {
    return callN8nWebhook('chatwork-notification', {
      message,
      roomId: roomId || process.env.CHATWORK_ROOM_ID,
    });
  },
  
  /**
   * メール通知
   */
  async sendEmail(to: string, subject: string, body: string): Promise<N8nResponse> {
    return callN8nWebhook('email-notification', {
      to,
      subject,
      body,
    });
  },
};

// ========================================
// ユーティリティ
// ========================================
export const N8nUtils = {
  /**
   * n8n接続テスト
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${N8N_BASE_URL}/healthz`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  },
  
  /**
   * Webhook URLを取得
   */
  getWebhookUrl(endpoint: string): string {
    return `${N8N_WEBHOOK_BASE}/${endpoint}`;
  },
};

// ========================================
// 設定管理サービス（設定変更時にn8nへ通知）
// ========================================
export const N8nSettingsService = {
  /**
   * 自動化設定を更新（settings-n3から呼ばれる）
   */
  async updateAutomationSettings(settings: {
    inventory_sync_interval?: number;
    inventory_monitoring_interval?: number;
    scheduled_listing_times?: string[];
    notify_chatwork?: boolean;
    notify_email?: boolean;
  }): Promise<N8nResponse> {
    return callN8nWebhook('settings-update', {
      action: 'update_automation',
      settings,
    });
  },

  /**
   * スケジュール設定を更新
   */
  async updateScheduleSettings(settings: {
    times: string[];
    timezone?: string;
    max_per_batch?: number;
    enabled?: boolean;
  }): Promise<N8nResponse> {
    return callN8nWebhook('settings-update', {
      action: 'update_schedule',
      settings,
    });
  },

  /**
   * 在庫監視設定を更新
   */
  async updateInventoryMonitoringSettings(settings: {
    interval_minutes: number;
    check_price_change?: boolean;
    price_change_threshold?: number;
    enabled?: boolean;
  }): Promise<N8nResponse> {
    return callN8nWebhook('settings-update', {
      action: 'update_inventory_monitoring',
      settings,
    });
  },

  /**
   * 全設定を一括更新
   */
  async syncAllSettings(allSettings: Record<string, any>): Promise<N8nResponse> {
    return callN8nWebhook('settings-update', {
      action: 'sync_all',
      settings: allSettings,
    });
  },
};

// ========================================
// メディアサービス（27次元準拠）再エクスポート
// ========================================
export {
  N8nMediaService,
  N8nVideoService,
  N8nAudioService,
  N8nAvatarService,
  N8nAnnotationService,
  N8nLiveService,
  N8nAssetService,
  N8nLMSService,
  N8nChannelService,
  N8nContentPipelineService,
  N8nMediaUtils,
} from './media-service';

export type {
  MediaResponse,
  VideoGenerateRequest,
  VoiceGenerateRequest,
  LivePortraitRequest,
  VisualAnnotationRequest,
  LiveStreamRequest,
  AssetRequest,
  LMSRequest,
  ChannelRequest,
} from './media-service';

// デフォルトエクスポート
export default {
  listing: N8nListingService,
  inventory: N8nInventoryService,
  schedule: N8nScheduleService,
  notification: N8nNotificationService,
  settings: N8nSettingsService,
  utils: N8nUtils,
};
