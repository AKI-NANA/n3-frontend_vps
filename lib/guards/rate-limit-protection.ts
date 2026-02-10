// lib/guards/rate-limit-protection.ts
/**
 * 🛡️ Phase E-5: API Rate Limit Protection
 * 
 * - Exponential Backoff
 * - Per-tool Cooldown
 * - Global Circuit Breaker
 */

import { createClient } from '@/lib/supabase';

// ============================================================
// 型定義
// ============================================================

export interface RateLimitState {
  toolId: string;
  consecutiveFailures: number;
  lastFailureAt: Date | null;
  backoffUntil: Date | null;
  circuitOpen: boolean;
}

export interface CircuitBreakerState {
  isOpen: boolean;
  openedAt: Date | null;
  reason: string | null;
  failureCount: number;
  resetAt: Date | null;
}

// ============================================================
// In-Memory State（プロセス内キャッシュ）
// ============================================================

const toolRateLimitState: Map<string, RateLimitState> = new Map();
let globalCircuitBreaker: CircuitBreakerState = {
  isOpen: false,
  openedAt: null,
  reason: null,
  failureCount: 0,
  resetAt: null,
};

// ============================================================
// 設定
// ============================================================

const CONFIG = {
  // Exponential Backoff
  INITIAL_BACKOFF_MS: 1000, // 1秒
  MAX_BACKOFF_MS: 300000, // 5分
  BACKOFF_MULTIPLIER: 2,
  
  // Per-tool Cooldown
  COOLDOWN_AFTER_SUCCESS_MS: 500, // 成功後 0.5秒
  
  // Circuit Breaker
  FAILURE_THRESHOLD: 10, // 10回失敗でサーキットオープン
  CIRCUIT_RESET_MS: 60000, // 1分後にリセット
  
  // Rate Limit検知パターン
  RATE_LIMIT_PATTERNS: [
    'rate limit',
    '429',
    'too many requests',
    'throttle',
    'quota exceeded',
  ],
};

// ============================================================
// Rate Limit 検知
// ============================================================

export function isRateLimitError(error: string | Error): boolean {
  const errorStr = typeof error === 'string' ? error : error.message;
  const lowerError = errorStr.toLowerCase();
  
  return CONFIG.RATE_LIMIT_PATTERNS.some(pattern => 
    lowerError.includes(pattern)
  );
}

// ============================================================
// Exponential Backoff
// ============================================================

export function calculateBackoff(failures: number): number {
  const backoff = CONFIG.INITIAL_BACKOFF_MS * Math.pow(CONFIG.BACKOFF_MULTIPLIER, failures);
  return Math.min(backoff, CONFIG.MAX_BACKOFF_MS);
}

export function getToolState(toolId: string): RateLimitState {
  if (!toolRateLimitState.has(toolId)) {
    toolRateLimitState.set(toolId, {
      toolId,
      consecutiveFailures: 0,
      lastFailureAt: null,
      backoffUntil: null,
      circuitOpen: false,
    });
  }
  return toolRateLimitState.get(toolId)!;
}

// ============================================================
// 実行可能チェック
// ============================================================

export function canExecuteTool(toolId: string): {
  allowed: boolean;
  reason?: string;
  waitMs?: number;
} {
  // グローバルサーキットブレーカーチェック
  if (globalCircuitBreaker.isOpen) {
    if (globalCircuitBreaker.resetAt && new Date() >= globalCircuitBreaker.resetAt) {
      // リセット時間を過ぎたら半開状態へ
      globalCircuitBreaker.isOpen = false;
      globalCircuitBreaker.failureCount = Math.floor(globalCircuitBreaker.failureCount / 2);
    } else {
      const waitMs = globalCircuitBreaker.resetAt 
        ? globalCircuitBreaker.resetAt.getTime() - Date.now()
        : CONFIG.CIRCUIT_RESET_MS;
      
      return {
        allowed: false,
        reason: `Global circuit breaker is open: ${globalCircuitBreaker.reason}`,
        waitMs,
      };
    }
  }
  
  // ツール別バックオフチェック
  const state = getToolState(toolId);
  
  if (state.backoffUntil && new Date() < state.backoffUntil) {
    const waitMs = state.backoffUntil.getTime() - Date.now();
    return {
      allowed: false,
      reason: `Tool is in backoff period (${state.consecutiveFailures} consecutive failures)`,
      waitMs,
    };
  }
  
  // ツール別サーキットブレーカー
  if (state.circuitOpen) {
    return {
      allowed: false,
      reason: `Tool circuit breaker is open`,
      waitMs: CONFIG.CIRCUIT_RESET_MS,
    };
  }
  
  return { allowed: true };
}

// ============================================================
// 成功記録
// ============================================================

export function recordSuccess(toolId: string): void {
  const state = getToolState(toolId);
  
  // 成功したらリセット
  state.consecutiveFailures = 0;
  state.lastFailureAt = null;
  state.backoffUntil = null;
  state.circuitOpen = false;
  
  // グローバルカウンターも減少
  if (globalCircuitBreaker.failureCount > 0) {
    globalCircuitBreaker.failureCount--;
  }
}

// ============================================================
// 失敗記録
// ============================================================

export function recordFailure(toolId: string, error: string | Error): {
  backoffMs: number;
  circuitOpened: boolean;
} {
  const state = getToolState(toolId);
  const isRateLimit = isRateLimitError(error);
  
  state.consecutiveFailures++;
  state.lastFailureAt = new Date();
  
  // Rate Limit エラーの場合は即座にバックオフ
  const multiplier = isRateLimit ? 2 : 1;
  const backoffMs = calculateBackoff(state.consecutiveFailures) * multiplier;
  state.backoffUntil = new Date(Date.now() + backoffMs);
  
  // グローバルカウンター増加
  globalCircuitBreaker.failureCount++;
  
  let circuitOpened = false;
  
  // サーキットブレーカー判定
  if (state.consecutiveFailures >= 5) {
    state.circuitOpen = true;
    circuitOpened = true;
  }
  
  // グローバルサーキットブレーカー
  if (globalCircuitBreaker.failureCount >= CONFIG.FAILURE_THRESHOLD) {
    globalCircuitBreaker.isOpen = true;
    globalCircuitBreaker.openedAt = new Date();
    globalCircuitBreaker.reason = `${globalCircuitBreaker.failureCount} failures across tools`;
    globalCircuitBreaker.resetAt = new Date(Date.now() + CONFIG.CIRCUIT_RESET_MS);
    circuitOpened = true;
  }
  
  return { backoffMs, circuitOpened };
}

// ============================================================
// 状態取得
// ============================================================

export function getRateLimitStatus(): {
  global: CircuitBreakerState;
  tools: Record<string, RateLimitState>;
} {
  const tools: Record<string, RateLimitState> = {};
  
  for (const [toolId, state] of toolRateLimitState.entries()) {
    tools[toolId] = { ...state };
  }
  
  return {
    global: { ...globalCircuitBreaker },
    tools,
  };
}

// ============================================================
// リセット（Admin用）
// ============================================================

export function resetRateLimitState(toolId?: string): void {
  if (toolId) {
    toolRateLimitState.delete(toolId);
  } else {
    toolRateLimitState.clear();
    globalCircuitBreaker = {
      isOpen: false,
      openedAt: null,
      reason: null,
      failureCount: 0,
      resetAt: null,
    };
  }
}

// ============================================================
// DB永続化（オプション）
// ============================================================

export async function persistRateLimitState(): Promise<void> {
  try {
    const supabase = createClient();
    const state = getRateLimitStatus();
    
    await supabase
      .from('n3_system_flags')
      .update({
        rate_limit_state: state,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 'global');
  } catch (error) {
    console.error('[RateLimitProtection] Failed to persist state:', error);
  }
}

export async function loadRateLimitState(): Promise<void> {
  try {
    const supabase = createClient();
    
    const { data } = await supabase
      .from('n3_system_flags')
      .select('rate_limit_state')
      .eq('id', 'global')
      .single();
    
    if (data?.rate_limit_state) {
      const state = data.rate_limit_state;
      
      if (state.global) {
        globalCircuitBreaker = {
          ...state.global,
          openedAt: state.global.openedAt ? new Date(state.global.openedAt) : null,
          resetAt: state.global.resetAt ? new Date(state.global.resetAt) : null,
        };
      }
      
      if (state.tools) {
        for (const [toolId, toolState] of Object.entries(state.tools)) {
          const ts = toolState as any;
          toolRateLimitState.set(toolId, {
            ...ts,
            lastFailureAt: ts.lastFailureAt ? new Date(ts.lastFailureAt) : null,
            backoffUntil: ts.backoffUntil ? new Date(ts.backoffUntil) : null,
          });
        }
      }
    }
  } catch (error) {
    console.error('[RateLimitProtection] Failed to load state:', error);
  }
}
