// lib/guards/job-guard.ts
/**
 * 🔒 Job Guard - 二重実行防止レイヤー
 * 
 * Phase 3A: System Guard Layer
 * 
 * 機能:
 * - 同一 toolId + params の多重実行防止
 * - 二重POST防止
 * - Hash fingerprint による一意性保証
 * - 既存running jobへのattach
 */

import crypto from 'crypto';

// ============================================================
// 型定義
// ============================================================

interface PendingJob {
  jobId: string;
  fingerprint: string;
  toolId: string;
  action: string;
  createdAt: number;
  expiresAt: number;
}

interface JobGuardResult {
  allowed: boolean;
  reason?: string;
  existingJobId?: string;
}

interface JobGuardConfig {
  dedupeWindowMs: number;     // 重複チェック期間（デフォルト: 5秒）
  maxPendingPerTool: number;  // ツールあたり最大pending数
}

// ============================================================
// デフォルト設定
// ============================================================

const DEFAULT_CONFIG: JobGuardConfig = {
  dedupeWindowMs: 5 * 1000,    // 5秒間の重複防止
  maxPendingPerTool: 10,       // ツールあたり最大10個のpending
};

// ============================================================
// In-Memory Pending Job Store
// ============================================================

class PendingJobStore {
  private jobs: Map<string, PendingJob> = new Map();
  private fingerprintIndex: Map<string, string> = new Map(); // fingerprint -> jobId
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    // 10秒ごとにクリーンアップ
    this.cleanupInterval = setInterval(() => this.cleanup(), 10 * 1000);
  }
  
  add(job: PendingJob): void {
    this.jobs.set(job.jobId, job);
    this.fingerprintIndex.set(job.fingerprint, job.jobId);
  }
  
  remove(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (job) {
      this.fingerprintIndex.delete(job.fingerprint);
      this.jobs.delete(jobId);
    }
  }
  
  getByFingerprint(fingerprint: string): PendingJob | null {
    const jobId = this.fingerprintIndex.get(fingerprint);
    if (!jobId) return null;
    
    const job = this.jobs.get(jobId);
    if (!job) return null;
    
    // 期限切れチェック
    if (Date.now() > job.expiresAt) {
      this.remove(jobId);
      return null;
    }
    
    return job;
  }
  
  countByToolId(toolId: string): number {
    let count = 0;
    const now = Date.now();
    
    for (const job of this.jobs.values()) {
      if (job.toolId === toolId && now <= job.expiresAt) {
        count++;
      }
    }
    
    return count;
  }
  
  private cleanup(): void {
    const now = Date.now();
    
    for (const [jobId, job] of this.jobs.entries()) {
      if (now > job.expiresAt) {
        this.remove(jobId);
      }
    }
  }
  
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.jobs.clear();
    this.fingerprintIndex.clear();
  }
}

// シングルトン
let storeInstance: PendingJobStore | null = null;

function getStore(): PendingJobStore {
  if (!storeInstance) {
    storeInstance = new PendingJobStore();
  }
  return storeInstance;
}

// ============================================================
// Job Guard クラス
// ============================================================

export class JobGuard {
  private store: PendingJobStore;
  private config: JobGuardConfig;
  
  constructor(config: Partial<JobGuardConfig> = {}) {
    this.store = getStore();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  /**
   * Fingerprint生成
   */
  generateFingerprint(toolId: string, action: string, params: Record<string, any>): string {
    // params をソートしてJSON化（順序に依存しないハッシュ）
    const sortedParams = this.sortObject(params);
    const payload = JSON.stringify({ toolId, action, params: sortedParams });
    
    return crypto
      .createHash('sha256')
      .update(payload)
      .digest('hex')
      .substring(0, 16); // 16文字に短縮
  }
  
  /**
   * オブジェクトを再帰的にソート
   */
  private sortObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObject(item));
    }
    
    const sortedKeys = Object.keys(obj).sort();
    const result: Record<string, any> = {};
    
    for (const key of sortedKeys) {
      result[key] = this.sortObject(obj[key]);
    }
    
    return result;
  }
  
  /**
   * ジョブ実行可否チェック
   */
  check(toolId: string, action: string, params: Record<string, any>): JobGuardResult {
    const fingerprint = this.generateFingerprint(toolId, action, params);
    
    // 重複チェック
    const existingJob = this.store.getByFingerprint(fingerprint);
    if (existingJob) {
      return {
        allowed: false,
        reason: `Duplicate job detected (pending job: ${existingJob.jobId})`,
        existingJobId: existingJob.jobId,
      };
    }
    
    // ツールあたりのpending数チェック
    const pendingCount = this.store.countByToolId(toolId);
    if (pendingCount >= this.config.maxPendingPerTool) {
      return {
        allowed: false,
        reason: `Too many pending jobs for tool "${toolId}" (${pendingCount}/${this.config.maxPendingPerTool})`,
      };
    }
    
    return { allowed: true };
  }
  
  /**
   * ジョブを登録（実行開始時）
   */
  register(jobId: string, toolId: string, action: string, params: Record<string, any>): void {
    const fingerprint = this.generateFingerprint(toolId, action, params);
    
    this.store.add({
      jobId,
      fingerprint,
      toolId,
      action,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.config.dedupeWindowMs,
    });
  }
  
  /**
   * ジョブを解除（完了/失敗時）
   */
  release(jobId: string): void {
    this.store.remove(jobId);
  }
  
  /**
   * Fingerprint取得（デバッグ用）
   */
  getFingerprint(toolId: string, action: string, params: Record<string, any>): string {
    return this.generateFingerprint(toolId, action, params);
  }
}

// ============================================================
// シングルトン エクスポート
// ============================================================

export const jobGuard = new JobGuard();

// ============================================================
// Dispatch API用 統合チェック関数
// ============================================================

export interface DispatchJobGuardContext {
  toolId: string;
  action: string;
  params: Record<string, any>;
}

export interface DispatchJobGuardResult {
  allowed: boolean;
  reason?: string;
  existingJobId?: string;
  fingerprint: string;
}

/**
 * Dispatch API用 ジョブガードチェック
 */
export function checkDispatchJobGuard(context: DispatchJobGuardContext): DispatchJobGuardResult {
  const fingerprint = jobGuard.getFingerprint(context.toolId, context.action, context.params);
  const result = jobGuard.check(context.toolId, context.action, context.params);
  
  return {
    ...result,
    fingerprint,
  };
}

/**
 * ジョブ登録
 */
export function registerDispatchJob(
  jobId: string,
  toolId: string,
  action: string,
  params: Record<string, any>
): void {
  jobGuard.register(jobId, toolId, action, params);
}

/**
 * ジョブ解除
 */
export function releaseDispatchJob(jobId: string): void {
  jobGuard.release(jobId);
}
