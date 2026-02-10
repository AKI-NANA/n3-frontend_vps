// lib/services/listing/listing-service.ts
// 両方のバックエンド（内部API & n8n）に対応する統一インターフェース

export interface ListingRequest {
  productId: string;
  platform: 'ebay' | 'amazon' | 'qoo10' | 'shopee' | 'mercari' | 'yahoo';
  action: 'list' | 'update' | 'end' | 'relist' | 'revise';
  options?: {
    price?: number;
    quantity?: number;
    title?: string;
    description?: string;
    images?: string[];
    categoryId?: string;
    shippingPolicy?: string;
    returnPolicy?: string;
    paymentPolicy?: string;
    immediate?: boolean;  // 即時出品
    scheduled?: string;   // 予約出品時刻
    [key: string]: any;
  };
}

export interface ListingResponse {
  success: boolean;
  jobId?: string;
  itemId?: string;
  url?: string;
  platform?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  details?: any;
  timestamp?: string;
}

export interface JobStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// 抽象基底クラス
export abstract class ListingBackend {
  protected name: string;
  
  constructor(name: string) {
    this.name = name;
    console.log(`[ListingBackend] Initialized: ${name}`);
  }
  
  // 必須実装メソッド
  abstract execute(request: ListingRequest): Promise<ListingResponse>;
  abstract getStatus(jobId: string): Promise<JobStatus | null>;
  abstract cancelJob(jobId: string): Promise<boolean>;
  
  // バッチ処理（オプション）
  async executeBatch(requests: ListingRequest[]): Promise<ListingResponse[]> {
    // デフォルトは順次処理
    const results: ListingResponse[] = [];
    for (const request of requests) {
      const result = await this.execute(request);
      results.push(result);
    }
    return results;
  }
  
  // ヘルスチェック
  async healthCheck(): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error(`[${this.name}] Health check failed:`, error);
      return false;
    }
  }
  
  // 共通ユーティリティ
  protected generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  protected log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${this.name}] [${level.toUpperCase()}] ${message}`;
    
    if (level === 'error') {
      console.error(logMessage, data);
    } else if (level === 'warn') {
      console.warn(logMessage, data);
    } else {
      console.log(logMessage, data);
    }
  }
}

// ファクトリー関数
export async function getListingBackend(): Promise<ListingBackend> {
  const useN8n = process.env.USE_N8N === 'true';
  const backendType = process.env.LISTING_BACKEND || 'internal';
  
  console.log('[ListingBackend] Configuration:', {
    useN8n,
    backendType,
    env: process.env.NODE_ENV
  });
  
  if (useN8n || backendType === 'n8n') {
    // 動的インポートでn8nバックエンドを読み込み
    const { N8nBackend } = await import('./n8n-backend');
    return new N8nBackend();
  } else {
    // 動的インポートで内部バックエンドを読み込み
    const { InternalBackend } = await import('./internal-backend');
    return new InternalBackend();
  }
}

// 型エクスポート
export type { ListingBackend };
