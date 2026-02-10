// lib/guards/rate-limiter.ts
/**
 * 🛡️ Rate Limiter - Dispatch保護レイヤー
 * 
 * Phase 3A: System Guard Layer
 * 
 * 機能:
 * - IP別レート制限
 * - User別レート制限
 * - ToolId別レート制限
 * - Burst防止
 * 
 * ストレージ: In-Memory Cache（Redis移行可能な設計）
 */

// ============================================================
// 型定義
// ============================================================

interface RateLimitConfig {
  maxRequests: number;      // 最大リクエスト数
  windowMs: number;         // ウィンドウ期間（ミリ秒）
  burstLimit?: number;      // バースト制限（瞬間最大）
}

interface RateLimitEntry {
  count: number;
  windowStart: number;
  burstCount: number;
  burstWindowStart: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

// ============================================================
// デフォルト設定
// ============================================================

export const DEFAULT_RATE_LIMITS = {
  // IP別制限
  ip: {
    maxRequests: 100,       // 100リクエスト
    windowMs: 60 * 1000,    // 1分間
    burstLimit: 10,         // 瞬間10リクエスト
  },
  
  // User別制限
  user: {
    maxRequests: 200,       // 200リクエスト
    windowMs: 60 * 1000,    // 1分間
    burstLimit: 20,         // 瞬間20リクエスト
  },
  
  // ToolId別制限
  toolId: {
    maxRequests: 50,        // 50リクエスト
    windowMs: 60 * 1000,    // 1分間
    burstLimit: 5,          // 瞬間5リクエスト
  },
  
  // グローバル制限（全体）
  global: {
    maxRequests: 1000,      // 1000リクエスト
    windowMs: 60 * 1000,    // 1分間
    burstLimit: 100,        // 瞬間100リクエスト
  },
};

// ============================================================
// In-Memory Store（Redis互換インターフェース）
// ============================================================

class InMemoryStore {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    // 5分ごとに期限切れエントリをクリーンアップ
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }
  
  get(key: string): RateLimitEntry | null {
    return this.store.get(key) || null;
  }
  
  set(key: string, entry: RateLimitEntry): void {
    this.store.set(key, entry);
  }
  
  delete(key: string): void {
    this.store.delete(key);
  }
  
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      // 10分以上古いエントリを削除
      if (now - entry.windowStart > 10 * 60 * 1000) {
        this.store.delete(key);
      }
    }
  }
  
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// シングルトンインスタンス
let storeInstance: InMemoryStore | null = null;

function getStore(): InMemoryStore {
  if (!storeInstance) {
    storeInstance = new InMemoryStore();
  }
  return storeInstance;
}

// ============================================================
// Rate Limiter クラス
// ============================================================

export class RateLimiter {
  private store: InMemoryStore;
  private config: RateLimitConfig;
  private prefix: string;
  
  constructor(prefix: string, config: RateLimitConfig) {
    this.store = getStore();
    this.config = config;
    this.prefix = prefix;
  }
  
  /**
   * レート制限チェック
   */
  check(identifier: string): RateLimitResult {
    const key = `${this.prefix}:${identifier}`;
    const now = Date.now();
    
    let entry = this.store.get(key);
    
    // 新規エントリ
    if (!entry) {
      entry = {
        count: 0,
        windowStart: now,
        burstCount: 0,
        burstWindowStart: now,
      };
    }
    
    // ウィンドウリセット判定
    if (now - entry.windowStart >= this.config.windowMs) {
      entry = {
        count: 0,
        windowStart: now,
        burstCount: 0,
        burstWindowStart: now,
      };
    }
    
    // バーストウィンドウリセット（1秒）
    if (now - entry.burstWindowStart >= 1000) {
      entry.burstCount = 0;
      entry.burstWindowStart = now;
    }
    
    // バースト制限チェック
    if (this.config.burstLimit && entry.burstCount >= this.config.burstLimit) {
      const retryAfter = Math.ceil((entry.burstWindowStart + 1000 - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.burstWindowStart + 1000,
        retryAfter: Math.max(1, retryAfter),
      };
    }
    
    // ウィンドウ制限チェック
    if (entry.count >= this.config.maxRequests) {
      const retryAfter = Math.ceil((entry.windowStart + this.config.windowMs - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.windowStart + this.config.windowMs,
        retryAfter: Math.max(1, retryAfter),
      };
    }
    
    // 許可 - カウント増加
    entry.count++;
    entry.burstCount++;
    this.store.set(key, entry);
    
    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetAt: entry.windowStart + this.config.windowMs,
    };
  }
  
  /**
   * カウントをリセット
   */
  reset(identifier: string): void {
    const key = `${this.prefix}:${identifier}`;
    this.store.delete(key);
  }
}

// ============================================================
// Dispatch用 Rate Limiter インスタンス
// ============================================================

export const ipRateLimiter = new RateLimiter('dispatch:ip', DEFAULT_RATE_LIMITS.ip);
export const userRateLimiter = new RateLimiter('dispatch:user', DEFAULT_RATE_LIMITS.user);
export const toolIdRateLimiter = new RateLimiter('dispatch:tool', DEFAULT_RATE_LIMITS.toolId);
export const globalRateLimiter = new RateLimiter('dispatch:global', DEFAULT_RATE_LIMITS.global);

// ============================================================
// 統合チェック関数
// ============================================================

export interface DispatchRateLimitContext {
  ip: string;
  userId?: string;
  toolId: string;
}

export interface DispatchRateLimitResult {
  allowed: boolean;
  reason?: string;
  retryAfter?: number;
  limits: {
    ip: RateLimitResult;
    user?: RateLimitResult;
    toolId: RateLimitResult;
    global: RateLimitResult;
  };
}

/**
 * Dispatch API用 統合レート制限チェック
 */
export function checkDispatchRateLimit(context: DispatchRateLimitContext): DispatchRateLimitResult {
  // グローバル制限
  const globalResult = globalRateLimiter.check('all');
  if (!globalResult.allowed) {
    return {
      allowed: false,
      reason: 'Global rate limit exceeded',
      retryAfter: globalResult.retryAfter,
      limits: {
        ip: { allowed: true, remaining: 0, resetAt: 0 },
        toolId: { allowed: true, remaining: 0, resetAt: 0 },
        global: globalResult,
      },
    };
  }
  
  // IP制限
  const ipResult = ipRateLimiter.check(context.ip);
  if (!ipResult.allowed) {
    return {
      allowed: false,
      reason: 'IP rate limit exceeded',
      retryAfter: ipResult.retryAfter,
      limits: {
        ip: ipResult,
        toolId: { allowed: true, remaining: 0, resetAt: 0 },
        global: globalResult,
      },
    };
  }
  
  // User制限（ログイン時のみ）
  let userResult: RateLimitResult | undefined;
  if (context.userId) {
    userResult = userRateLimiter.check(context.userId);
    if (!userResult.allowed) {
      return {
        allowed: false,
        reason: 'User rate limit exceeded',
        retryAfter: userResult.retryAfter,
        limits: {
          ip: ipResult,
          user: userResult,
          toolId: { allowed: true, remaining: 0, resetAt: 0 },
          global: globalResult,
        },
      };
    }
  }
  
  // ToolId制限
  const toolIdResult = toolIdRateLimiter.check(context.toolId);
  if (!toolIdResult.allowed) {
    return {
      allowed: false,
      reason: `ToolId "${context.toolId}" rate limit exceeded`,
      retryAfter: toolIdResult.retryAfter,
      limits: {
        ip: ipResult,
        user: userResult,
        toolId: toolIdResult,
        global: globalResult,
      },
    };
  }
  
  // 全て通過
  return {
    allowed: true,
    limits: {
      ip: ipResult,
      user: userResult,
      toolId: toolIdResult,
      global: globalResult,
    },
  };
}
