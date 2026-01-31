// lib/guards/concurrency-guard.ts
/**
 * 🔒 Phase D-Core: Concurrency Guard
 * 
 * 同時実行制限機能
 * 
 * 目的:
 * - n8nワーカーの過負荷防止
 * - API Rate Limit 回避
 * - システムリソースの保護
 */

import { createClient } from '@/lib/supabase';

// ============================================================
// 型定義
// ============================================================

export interface JobLock {
  job_type: string;
  active_count: number;
  max_limit: number;
  updated_at: string;
}

export interface ConcurrencyCheckResult {
  allowed: boolean;
  currentCount: number;
  maxLimit: number;
  reason?: string;
}

// ============================================================
// 同時実行制限値
// ============================================================

export const CONCURRENCY_LIMITS: Record<string, number> = {
  // 出品系（eBay API Rate Limit対策）
  'listing': 3,
  'listing-ebay': 3,
  'listing-amazon': 2,
  'listing-qoo10': 5,
  
  // 在庫系
  'inventory': 5,
  'inventory-sync': 5,
  'inventory-update': 10,
  
  // リサーチ系（スクレイピング負荷対策）
  'research': 10,
  'research-market': 5,
  'competitor-scan': 3,
  
  // メディア系（重い処理）
  'media': 2,
  'media-video': 1,
  'media-audio': 2,
  
  // デフォルト
  'default': 10,
};

/**
 * ジョブタイプから制限値を取得
 */
export function getConcurrencyLimit(jobType: string): number {
  // 完全一致
  if (CONCURRENCY_LIMITS[jobType] !== undefined) {
    return CONCURRENCY_LIMITS[jobType];
  }
  
  // プレフィックスマッチ
  for (const [key, limit] of Object.entries(CONCURRENCY_LIMITS)) {
    if (jobType.startsWith(key)) {
      return limit;
    }
  }
  
  return CONCURRENCY_LIMITS['default'];
}

// ============================================================
// 同時実行エラー
// ============================================================

export class ConcurrencyLimitError extends Error {
  code = 'CONCURRENCY_LIMIT';
  jobType: string;
  currentCount: number;
  maxLimit: number;
  
  constructor(jobType: string, currentCount: number, maxLimit: number) {
    super(`Concurrency limit reached for ${jobType}: ${currentCount}/${maxLimit}`);
    this.name = 'ConcurrencyLimitError';
    this.jobType = jobType;
    this.currentCount = currentCount;
    this.maxLimit = maxLimit;
  }
  
  toResponse() {
    return {
      success: false,
      error: this.message,
      code: this.code,
      concurrency: {
        jobType: this.jobType,
        currentCount: this.currentCount,
        maxLimit: this.maxLimit,
      },
    };
  }
}

// ============================================================
// ロック管理
// ============================================================

/**
 * ジョブロックを取得（なければ作成）
 */
async function getOrCreateJobLock(jobType: string): Promise<JobLock> {
  const supabase = createClient();
  const maxLimit = getConcurrencyLimit(jobType);
  
  // 既存のロックを取得
  const { data } = await supabase
    .from('n3_job_locks')
    .select('*')
    .eq('job_type', jobType)
    .single();
  
  if (data) {
    return data as JobLock;
  }
  
  // 存在しない場合は作成
  const { data: newLock, error } = await supabase
    .from('n3_job_locks')
    .upsert({
      job_type: jobType,
      active_count: 0,
      max_limit: maxLimit,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error || !newLock) {
    // 作成失敗時はデフォルト値を返す
    return {
      job_type: jobType,
      active_count: 0,
      max_limit: maxLimit,
      updated_at: new Date().toISOString(),
    };
  }
  
  return newLock as JobLock;
}

/**
 * 同時実行数をインクリメント
 */
export async function acquireJobLock(
  jobType: string
): Promise<ConcurrencyCheckResult> {
  try {
    const supabase = createClient();
    const lock = await getOrCreateJobLock(jobType);
    const maxLimit = getConcurrencyLimit(jobType);
    
    // 制限チェック
    if (lock.active_count >= maxLimit) {
      return {
        allowed: false,
        currentCount: lock.active_count,
        maxLimit,
        reason: `Concurrency limit reached: ${lock.active_count}/${maxLimit}`,
      };
    }
    
    // カウントをインクリメント（アトミック操作）
    const { data, error } = await supabase
      .rpc('increment_job_lock', {
        p_job_type: jobType,
        p_max_limit: maxLimit,
      });
    
    if (error) {
      console.error('[ConcurrencyGuard] Error acquiring lock:', error);
      
      // RPC関数がない場合は直接更新
      const { error: updateError } = await supabase
        .from('n3_job_locks')
        .update({
          active_count: lock.active_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('job_type', jobType)
        .lt('active_count', maxLimit);
      
      if (updateError) {
        return {
          allowed: false,
          currentCount: lock.active_count,
          maxLimit,
          reason: 'Failed to acquire lock',
        };
      }
      
      return {
        allowed: true,
        currentCount: lock.active_count + 1,
        maxLimit,
      };
    }
    
    if (data === false) {
      return {
        allowed: false,
        currentCount: lock.active_count,
        maxLimit,
        reason: `Concurrency limit reached`,
      };
    }
    
    return {
      allowed: true,
      currentCount: lock.active_count + 1,
      maxLimit,
    };
  } catch (error) {
    console.error('[ConcurrencyGuard] Error acquiring lock:', error);
    // エラー時はセーフモード（実行許可）
    return {
      allowed: true,
      currentCount: 0,
      maxLimit: getConcurrencyLimit(jobType),
    };
  }
}

/**
 * 同時実行数をデクリメント
 */
export async function releaseJobLock(jobType: string): Promise<void> {
  try {
    const supabase = createClient();
    
    // カウントをデクリメント（アトミック操作）
    const { error } = await supabase
      .rpc('decrement_job_lock', {
        p_job_type: jobType,
      });
    
    if (error) {
      console.error('[ConcurrencyGuard] Error releasing lock, using fallback:', error);
      
      // RPC関数がない場合は直接更新
      const { data } = await supabase
        .from('n3_job_locks')
        .select('active_count')
        .eq('job_type', jobType)
        .single();
      
      if (data && data.active_count > 0) {
        await supabase
          .from('n3_job_locks')
          .update({
            active_count: data.active_count - 1,
            updated_at: new Date().toISOString(),
          })
          .eq('job_type', jobType);
      }
    }
  } catch (error) {
    console.error('[ConcurrencyGuard] Error releasing lock:', error);
  }
}

/**
 * 現在の同時実行状況を取得
 */
export async function getJobLockStatus(): Promise<JobLock[]> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('n3_job_locks')
      .select('*')
      .order('job_type');
    
    if (error || !data) {
      return [];
    }
    
    return data as JobLock[];
  } catch (error) {
    console.error('[ConcurrencyGuard] Error getting status:', error);
    return [];
  }
}

/**
 * ロックをリセット（デバッグ・緊急用）
 */
export async function resetJobLocks(jobType?: string): Promise<void> {
  try {
    const supabase = createClient();
    
    if (jobType) {
      await supabase
        .from('n3_job_locks')
        .update({
          active_count: 0,
          updated_at: new Date().toISOString(),
        })
        .eq('job_type', jobType);
    } else {
      await supabase
        .from('n3_job_locks')
        .update({
          active_count: 0,
          updated_at: new Date().toISOString(),
        });
    }
    
    console.log(`[ConcurrencyGuard] Locks reset: ${jobType || 'all'}`);
  } catch (error) {
    console.error('[ConcurrencyGuard] Error resetting locks:', error);
  }
}

// ============================================================
// ガード関数
// ============================================================

/**
 * 同時実行制限チェック（Dispatch前に呼び出す）
 * 制限に達している場合は ConcurrencyLimitError をスロー
 */
export async function checkConcurrencyLimit(jobType: string): Promise<void> {
  const result = await acquireJobLock(jobType);
  
  if (!result.allowed) {
    throw new ConcurrencyLimitError(
      jobType,
      result.currentCount,
      result.maxLimit
    );
  }
}

/**
 * 同時実行制限チェック（例外を投げない版）
 */
export async function canExecute(jobType: string): Promise<boolean> {
  const lock = await getOrCreateJobLock(jobType);
  const maxLimit = getConcurrencyLimit(jobType);
  
  return lock.active_count < maxLimit;
}

// ============================================================
// 実行ラッパー
// ============================================================

/**
 * 同時実行制限付きで関数を実行
 */
export async function withConcurrencyGuard<T>(
  jobType: string,
  fn: () => Promise<T>
): Promise<T> {
  await checkConcurrencyLimit(jobType);
  
  try {
    return await fn();
  } finally {
    await releaseJobLock(jobType);
  }
}
