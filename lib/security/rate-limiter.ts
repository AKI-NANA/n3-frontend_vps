// lib/security/rate-limiter.ts
// ========================================
// 🛡️ N3 Empire OS V8.2.1-Autonomous
// SEC-001: APIレート制限（トークンバケット実装）
// 商用レベル・152ツール同時実行対応
// ========================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ========================================
// 型定義
// ========================================

export interface RateLimitConfig {
  apiProvider: string;
  apiEndpoint?: string;
  requestsPerSecond: number;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  burstLimit: number;
  burstWindowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
  currentTokens: number;
  maxTokens: number;
  queuePosition?: number;
  queuedRequestId?: string;
}

export interface QueuedRequest {
  id: string;
  apiProvider: string;
  apiEndpoint?: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
  priority: number;
  callbackUrl?: string;
}

// ========================================
// デフォルトレート制限設定
// ========================================

export const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  'ebay:trading': {
    apiProvider: 'ebay',
    apiEndpoint: 'trading',
    requestsPerSecond: 1.5,
    requestsPerMinute: 90,
    requestsPerHour: 5000,
    requestsPerDay: 50000,
    burstLimit: 10,
    burstWindowSeconds: 60
  },
  'ebay:browse': {
    apiProvider: 'ebay',
    apiEndpoint: 'browse',
    requestsPerSecond: 5,
    requestsPerMinute: 300,
    requestsPerHour: 15000,
    requestsPerDay: 150000,
    burstLimit: 20,
    burstWindowSeconds: 60
  },
  'amazon:sp-api': {
    apiProvider: 'amazon',
    apiEndpoint: 'sp-api',
    requestsPerSecond: 0.5,
    requestsPerMinute: 30,
    requestsPerHour: 1800,
    requestsPerDay: 18000,
    burstLimit: 5,
    burstWindowSeconds: 60
  },
  'openai:chat': {
    apiProvider: 'openai',
    apiEndpoint: 'chat',
    requestsPerSecond: 3,
    requestsPerMinute: 180,
    requestsPerHour: 10000,
    requestsPerDay: 100000,
    burstLimit: 15,
    burstWindowSeconds: 60
  },
  'anthropic:messages': {
    apiProvider: 'anthropic',
    apiEndpoint: 'messages',
    requestsPerSecond: 2,
    requestsPerMinute: 120,
    requestsPerHour: 6000,
    requestsPerDay: 60000,
    burstLimit: 10,
    burstWindowSeconds: 60
  }
};

// ========================================
// トークンバケットクラス
// ========================================

export class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per millisecond
  
  constructor(maxTokens: number, refillRatePerSecond: number) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
    this.refillRate = refillRatePerSecond / 1000;
  }
  
  /**
   * トークンを消費してリクエストを許可するか判定
   */
  tryConsume(tokens: number = 1): { allowed: boolean; retryAfterMs: number } {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return { allowed: true, retryAfterMs: 0 };
    }
    
    const tokensNeeded = tokens - this.tokens;
    const retryAfterMs = Math.ceil(tokensNeeded / this.refillRate);
    
    return { allowed: false, retryAfterMs };
  }
  
  /**
   * トークンを補充
   */
  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = elapsed * this.refillRate;
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
  
  /**
   * 現在のトークン数を取得
   */
  getTokens(): number {
    this.refill();
    return this.tokens;
  }
  
  /**
   * 状態をシリアライズ
   */
  serialize(): { tokens: number; lastRefill: number } {
    return { tokens: this.tokens, lastRefill: this.lastRefill };
  }
  
  /**
   * 状態を復元
   */
  restore(state: { tokens: number; lastRefill: number }): void {
    this.tokens = state.tokens;
    this.lastRefill = state.lastRefill;
  }
}

// ========================================
// 分散型レートリミッター（DB永続化対応）
// ========================================

export class DistributedRateLimiter {
  private supabase: SupabaseClient;
  private localBuckets: Map<string, TokenBucket> = new Map();
  private syncInterval: NodeJS.Timeout | null = null;
  
  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabase = createClient(
      supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  
  /**
   * レート制限をチェック
   */
  async checkRateLimit(
    apiProvider: string,
    apiEndpoint?: string
  ): Promise<RateLimitResult> {
    const key = `${apiProvider}:${apiEndpoint || 'default'}`;
    
    // ローカルバケットをチェック
    let bucket = this.localBuckets.get(key);
    
    if (!bucket) {
      // DBから設定を取得
      const config = await this.getConfig(apiProvider, apiEndpoint);
      bucket = new TokenBucket(config.burstLimit, config.requestsPerSecond);
      
      // DB状態を復元
      await this.restoreBucketState(key, bucket);
      this.localBuckets.set(key, bucket);
    }
    
    const result = bucket.tryConsume(1);
    
    // 非同期でDB同期
    this.syncBucketState(key, bucket).catch(console.error);
    
    return {
      allowed: result.allowed,
      retryAfterMs: result.retryAfterMs,
      currentTokens: bucket.getTokens(),
      maxTokens: (await this.getConfig(apiProvider, apiEndpoint)).burstLimit
    };
  }
  
  /**
   * リクエストをキューに追加
   */
  async enqueueRequest(
    tenantId: string,
    request: QueuedRequest
  ): Promise<{ queueId: string; estimatedWaitMs: number }> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // キューサイズを取得
    const { count } = await this.supabase
      .from('security.api_request_queue')
      .select('*', { count: 'exact', head: true })
      .eq('api_provider', request.apiProvider)
      .eq('status', 'queued');
    
    const queueSize = count || 0;
    
    // リクエストをキューに追加
    await this.supabase.from('security.api_request_queue').insert({
      tenant_id: tenantId,
      request_id: requestId,
      api_provider: request.apiProvider,
      api_endpoint: request.apiEndpoint,
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body,
      priority: request.priority,
      callback_url: request.callbackUrl,
      status: 'queued',
      scheduled_for: new Date(Date.now() + queueSize * 1000).toISOString()
    });
    
    // 推定待ち時間を計算
    const config = await this.getConfig(request.apiProvider, request.apiEndpoint);
    const estimatedWaitMs = Math.ceil((queueSize + 1) / config.requestsPerSecond * 1000);
    
    return { queueId: requestId, estimatedWaitMs };
  }
  
  /**
   * キューからリクエストを処理
   */
  async processQueue(apiProvider: string, apiEndpoint?: string): Promise<void> {
    const rateLimit = await this.checkRateLimit(apiProvider, apiEndpoint);
    
    if (!rateLimit.allowed) {
      return; // レート制限中
    }
    
    // 次のリクエストを取得
    const { data: requests } = await this.supabase
      .from('security.api_request_queue')
      .select('*')
      .eq('api_provider', apiProvider)
      .eq('status', 'queued')
      .order('priority', { ascending: false })
      .order('queued_at', { ascending: true })
      .limit(1);
    
    if (!requests || requests.length === 0) {
      return; // キューが空
    }
    
    const request = requests[0];
    
    // ステータスを更新
    await this.supabase
      .from('security.api_request_queue')
      .update({ status: 'processing', started_at: new Date().toISOString() })
      .eq('id', request.id);
    
    try {
      // リクエストを実行
      const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body ? JSON.stringify(request.body) : undefined
      });
      
      const responseBody = await response.json().catch(() => null);
      
      // 完了を記録
      await this.supabase
        .from('security.api_request_queue')
        .update({
          status: response.ok ? 'completed' : 'failed',
          completed_at: new Date().toISOString(),
          response_status: response.status,
          response_body: responseBody
        })
        .eq('id', request.id);
      
      // コールバックを実行
      if (request.callback_url) {
        await fetch(request.callback_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(request.callback_headers || {}) },
          body: JSON.stringify({
            request_id: request.request_id,
            status: response.ok ? 'completed' : 'failed',
            response_status: response.status,
            response_body: responseBody
          })
        }).catch(console.error);
      }
      
    } catch (error) {
      // エラーを記録
      await this.supabase
        .from('security.api_request_queue')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: error instanceof Error ? error.message : 'Unknown error',
          retry_count: request.retry_count + 1
        })
        .eq('id', request.id);
      
      // リトライが残っている場合は再キュー
      if (request.retry_count < request.max_retries) {
        await this.supabase
          .from('security.api_request_queue')
          .update({
            status: 'queued',
            scheduled_for: new Date(Date.now() + Math.pow(2, request.retry_count) * 1000).toISOString()
          })
          .eq('id', request.id);
      }
    }
  }
  
  /**
   * 設定を取得
   */
  private async getConfig(apiProvider: string, apiEndpoint?: string): Promise<RateLimitConfig> {
    const key = `${apiProvider}:${apiEndpoint || 'default'}`;
    
    // キャッシュから取得
    const cached = DEFAULT_RATE_LIMITS[key];
    if (cached) return cached;
    
    // DBから取得
    const { data } = await this.supabase
      .from('security.api_rate_limits')
      .select('*')
      .eq('api_provider', apiProvider)
      .eq('api_endpoint', apiEndpoint || null)
      .single();
    
    if (data) {
      return {
        apiProvider: data.api_provider,
        apiEndpoint: data.api_endpoint,
        requestsPerSecond: data.requests_per_second,
        requestsPerMinute: data.requests_per_minute,
        requestsPerHour: data.requests_per_hour,
        requestsPerDay: data.requests_per_day,
        burstLimit: data.burst_limit,
        burstWindowSeconds: data.burst_window_seconds
      };
    }
    
    // デフォルト設定を返す
    return {
      apiProvider,
      apiEndpoint,
      requestsPerSecond: 1,
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      requestsPerDay: 10000,
      burstLimit: 10,
      burstWindowSeconds: 60
    };
  }
  
  /**
   * バケット状態をDBに同期
   */
  private async syncBucketState(key: string, bucket: TokenBucket): Promise<void> {
    const [apiProvider, apiEndpoint] = key.split(':');
    const state = bucket.serialize();
    
    await this.supabase
      .from('security.api_rate_limits')
      .update({
        current_bucket_tokens: state.tokens,
        last_refill_at: new Date(state.lastRefill).toISOString(),
        last_request_at: new Date().toISOString()
      })
      .eq('api_provider', apiProvider)
      .eq('api_endpoint', apiEndpoint === 'default' ? null : apiEndpoint);
  }
  
  /**
   * DBからバケット状態を復元
   */
  private async restoreBucketState(key: string, bucket: TokenBucket): Promise<void> {
    const [apiProvider, apiEndpoint] = key.split(':');
    
    const { data } = await this.supabase
      .from('security.api_rate_limits')
      .select('current_bucket_tokens, last_refill_at')
      .eq('api_provider', apiProvider)
      .eq('api_endpoint', apiEndpoint === 'default' ? null : apiEndpoint)
      .single();
    
    if (data && data.current_bucket_tokens !== null) {
      bucket.restore({
        tokens: data.current_bucket_tokens,
        lastRefill: new Date(data.last_refill_at).getTime()
      });
    }
  }
  
  /**
   * 日次/時間リセット
   */
  async resetCounters(period: 'hourly' | 'daily'): Promise<void> {
    const column = period === 'hourly' ? 'total_requests_hour' : 'total_requests_today';
    
    await this.supabase
      .from('security.api_rate_limits')
      .update({ [column]: 0 });
  }
  
  /**
   * リソースをクリーンアップ
   */
  cleanup(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.localBuckets.clear();
  }
}

// ========================================
// Next.js Middleware用レートリミッター
// ========================================

export class NextjsRateLimiter {
  private static instance: DistributedRateLimiter;
  
  static getInstance(): DistributedRateLimiter {
    if (!this.instance) {
      this.instance = new DistributedRateLimiter();
    }
    return this.instance;
  }
  
  /**
   * APIルートでのレート制限チェック
   */
  static async check(
    request: Request,
    apiProvider: string,
    apiEndpoint?: string
  ): Promise<{ allowed: boolean; headers: Record<string, string> }> {
    const limiter = this.getInstance();
    const result = await limiter.checkRateLimit(apiProvider, apiEndpoint);
    
    const headers: Record<string, string> = {
      'X-RateLimit-Remaining': Math.floor(result.currentTokens).toString(),
      'X-RateLimit-Limit': result.maxTokens.toString(),
    };
    
    if (!result.allowed) {
      headers['Retry-After'] = Math.ceil(result.retryAfterMs / 1000).toString();
      headers['X-RateLimit-Reset'] = new Date(Date.now() + result.retryAfterMs).toISOString();
    }
    
    return { allowed: result.allowed, headers };
  }
}

// ========================================
// レートリミッターファクトリー
// ========================================

let globalRateLimiter: DistributedRateLimiter | null = null;

export function getRateLimiter(): DistributedRateLimiter {
  if (!globalRateLimiter) {
    globalRateLimiter = new DistributedRateLimiter();
  }
  return globalRateLimiter;
}

export function createRateLimiter(supabaseUrl?: string, supabaseKey?: string): DistributedRateLimiter {
  return new DistributedRateLimiter(supabaseUrl, supabaseKey);
}

// ========================================
// エクスポート
// ========================================

export default {
  TokenBucket,
  DistributedRateLimiter,
  NextjsRateLimiter,
  getRateLimiter,
  createRateLimiter,
  DEFAULT_RATE_LIMITS
};
