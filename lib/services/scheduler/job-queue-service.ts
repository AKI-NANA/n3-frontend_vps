// lib/services/scheduler/job-queue-service.ts
/**
 * ジョブキューサービス - 非同期バックグラウンド処理
 * 
 * 【目的】
 * SM（仕入れ先）選択後の処理を完全自動化:
 * 1. データ取得（SM先からスクレイピング）
 * 2. AI補完（欠落フィールド補完）
 * 3. 監査・自動修正
 * 4. 価格計算
 * 5. 出品予約
 * 
 * 【アーキテクチャ】
 * - メモリベースのキュー（シンプル・軽量）
 * - Supabaseへのジョブ永続化（リカバリー対応）
 * - バックグラウンドワーカー（setInterval）
 * - 進捗通知（ChatWork / Webhook）
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================
// 型定義
// ============================================================

/** ジョブタイプ */
export type JobType = 
  | 'sm_data_fetch'        // SM先からデータ取得
  | 'ai_completion'        // AI補完
  | 'audit_autofix'        // 監査・自動修正
  | 'price_calculation'    // 価格計算
  | 'listing_schedule'     // 出品予約
  | 'ebay_submit'          // eBay送信
  | 'full_pipeline';       // フルパイプライン（上記すべて）

/** ジョブステータス */
export type JobStatus = 
  | 'pending'      // 待機中
  | 'running'      // 実行中
  | 'completed'    // 完了
  | 'failed'       // 失敗
  | 'cancelled';   // キャンセル

/** ジョブ優先度 */
export type JobPriority = 'high' | 'normal' | 'low';

/** ジョブ定義 */
export interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  priority: JobPriority;
  data: JobData;
  result?: any;
  error?: string;
  progress: number;          // 0-100
  progressMessage?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  retryCount: number;
  maxRetries: number;
}

/** ジョブデータ（タイプ別） */
export interface JobData {
  productIds: string[];
  smSource?: string;         // SM先URL/ID
  options?: {
    skipAiCompletion?: boolean;
    skipAudit?: boolean;
    autoApplyFixes?: boolean;
    scheduleListingAt?: string;
    notifyOnComplete?: boolean;
    webhookUrl?: string;
  };
}

/** パイプラインステップ */
interface PipelineStep {
  name: string;
  weight: number;  // 進捗計算用の重み
  handler: (job: Job, stepProgress: (p: number) => void) => Promise<any>;
}

// ============================================================
// キュー管理
// ============================================================

class JobQueue {
  private queue: Job[] = [];
  private running: Map<string, Job> = new Map();
  private completed: Map<string, Job> = new Map();
  private isProcessing = false;
  private maxConcurrent = 3;
  private supabase?: ReturnType<typeof createClient>;
  
  constructor() {
    // Supabaseクライアント初期化（サーバーサイドのみ）
    if (typeof window === 'undefined') {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (url && key) {
        this.supabase = createClient(url, key);
      }
    }
  }
  
  /**
   * ジョブを追加
   */
  async enqueue(
    type: JobType,
    data: JobData,
    options?: { priority?: JobPriority; maxRetries?: number }
  ): Promise<Job> {
    const job: Job = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      status: 'pending',
      priority: options?.priority || 'normal',
      data,
      progress: 0,
      createdAt: new Date().toISOString(),
      retryCount: 0,
      maxRetries: options?.maxRetries ?? 3,
    };
    
    // 優先度でソート挿入
    const insertIndex = this.queue.findIndex(j => 
      this.getPriorityWeight(j.priority) < this.getPriorityWeight(job.priority)
    );
    
    if (insertIndex === -1) {
      this.queue.push(job);
    } else {
      this.queue.splice(insertIndex, 0, job);
    }
    
    // DBに永続化
    await this.persistJob(job);
    
    // 処理開始
    this.startProcessing();
    
    console.log(`[JobQueue] Enqueued job ${job.id} (${type})`);
    return job;
  }
  
  /**
   * ジョブをキャンセル
   */
  async cancel(jobId: string): Promise<boolean> {
    // キューから削除
    const queueIndex = this.queue.findIndex(j => j.id === jobId);
    if (queueIndex !== -1) {
      const job = this.queue.splice(queueIndex, 1)[0];
      job.status = 'cancelled';
      await this.persistJob(job);
      return true;
    }
    
    // 実行中のジョブはキャンセル不可（将来的にはAbortController対応）
    if (this.running.has(jobId)) {
      console.warn(`[JobQueue] Cannot cancel running job ${jobId}`);
      return false;
    }
    
    return false;
  }
  
  /**
   * ジョブ状態を取得
   */
  getJob(jobId: string): Job | undefined {
    // キューから検索
    const queued = this.queue.find(j => j.id === jobId);
    if (queued) return queued;
    
    // 実行中から検索
    if (this.running.has(jobId)) return this.running.get(jobId);
    
    // 完了済みから検索
    if (this.completed.has(jobId)) return this.completed.get(jobId);
    
    return undefined;
  }
  
  /**
   * すべてのジョブを取得
   */
  getAllJobs(): { pending: Job[]; running: Job[]; completed: Job[] } {
    return {
      pending: [...this.queue],
      running: Array.from(this.running.values()),
      completed: Array.from(this.completed.values()),
    };
  }
  
  /**
   * 処理を開始
   */
  private startProcessing() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    const processLoop = async () => {
      while (this.queue.length > 0 && this.running.size < this.maxConcurrent) {
        const job = this.queue.shift()!;
        this.running.set(job.id, job);
        
        // 非同期で処理開始（awaitしない）
        this.processJob(job).catch(console.error);
      }
      
      if (this.queue.length > 0 || this.running.size > 0) {
        setTimeout(processLoop, 1000);
      } else {
        this.isProcessing = false;
      }
    };
    
    processLoop();
  }
  
  /**
   * ジョブを処理
   */
  private async processJob(job: Job): Promise<void> {
    console.log(`[JobQueue] Processing job ${job.id} (${job.type})`);
    
    job.status = 'running';
    job.startedAt = new Date().toISOString();
    await this.persistJob(job);
    
    try {
      const result = await this.executeJob(job);
      
      job.status = 'completed';
      job.result = result;
      job.progress = 100;
      job.completedAt = new Date().toISOString();
      
      console.log(`[JobQueue] Job ${job.id} completed successfully`);
      
    } catch (error) {
      console.error(`[JobQueue] Job ${job.id} failed:`, error);
      
      job.retryCount++;
      
      if (job.retryCount < job.maxRetries) {
        // リトライ
        job.status = 'pending';
        job.error = `Retry ${job.retryCount}/${job.maxRetries}: ${error}`;
        this.queue.unshift(job);
      } else {
        // 最終失敗
        job.status = 'failed';
        job.error = error instanceof Error ? error.message : String(error);
      }
    }
    
    // 実行中から削除
    this.running.delete(job.id);
    
    // 完了済みに追加
    this.completed.set(job.id, job);
    
    // 永続化
    await this.persistJob(job);
    
    // 通知
    if (job.data.options?.notifyOnComplete) {
      await this.notifyCompletion(job);
    }
  }
  
  /**
   * ジョブを実行
   */
  private async executeJob(job: Job): Promise<any> {
    switch (job.type) {
      case 'full_pipeline':
        return this.executeFullPipeline(job);
      case 'sm_data_fetch':
        return this.executeSmDataFetch(job);
      case 'ai_completion':
        return this.executeAiCompletion(job);
      case 'audit_autofix':
        return this.executeAuditAutofix(job);
      case 'price_calculation':
        return this.executePriceCalculation(job);
      case 'listing_schedule':
        return this.executeListingSchedule(job);
      case 'ebay_submit':
        return this.executeEbaySubmit(job);
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  }
  
  // ============================================================
  // パイプライン実行
  // ============================================================
  
  /**
   * フルパイプライン実行（SM選択後の全自動処理）
   */
  private async executeFullPipeline(job: Job): Promise<any> {
    const steps: PipelineStep[] = [
      { name: 'SM Data Fetch', weight: 30, handler: (j, p) => this.executeSmDataFetch(j, p) },
      { name: 'AI Completion', weight: 25, handler: (j, p) => this.executeAiCompletion(j, p) },
      { name: 'Audit & AutoFix', weight: 20, handler: (j, p) => this.executeAuditAutofix(j, p) },
      { name: 'Price Calculation', weight: 15, handler: (j, p) => this.executePriceCalculation(j, p) },
      { name: 'Listing Schedule', weight: 10, handler: (j, p) => this.executeListingSchedule(j, p) },
    ];
    
    const results: Record<string, any> = {};
    let progressBase = 0;
    
    for (const step of steps) {
      job.progressMessage = `Step: ${step.name}`;
      await this.persistJob(job);
      
      const stepProgress = (p: number) => {
        job.progress = progressBase + (step.weight * p / 100);
        this.persistJob(job);  // 非同期で永続化
      };
      
      results[step.name] = await step.handler(job, stepProgress);
      progressBase += step.weight;
    }
    
    return results;
  }
  
  /**
   * SMデータ取得
   */
  private async executeSmDataFetch(job: Job, onProgress?: (p: number) => void): Promise<any> {
    onProgress?.(10);
    
    // TODO: SM先からのデータスクレイピング実装
    // 現在はモック
    await new Promise(r => setTimeout(r, 1000));
    
    onProgress?.(100);
    
    return {
      success: true,
      productsUpdated: job.data.productIds.length,
    };
  }
  
  /**
   * AI補完
   */
  private async executeAiCompletion(job: Job, onProgress?: (p: number) => void): Promise<any> {
    if (job.data.options?.skipAiCompletion) {
      return { skipped: true };
    }
    
    onProgress?.(10);
    
    // TODO: field-completion-service を呼び出し
    await new Promise(r => setTimeout(r, 1000));
    
    onProgress?.(100);
    
    return {
      success: true,
      fieldsCompleted: job.data.productIds.length * 2,
    };
  }
  
  /**
   * 監査・自動修正
   */
  private async executeAuditAutofix(job: Job, onProgress?: (p: number) => void): Promise<any> {
    if (job.data.options?.skipAudit) {
      return { skipped: true };
    }
    
    onProgress?.(10);
    
    // TODO: audit-service を呼び出し
    await new Promise(r => setTimeout(r, 1000));
    
    onProgress?.(100);
    
    return {
      success: true,
      productsAudited: job.data.productIds.length,
      autoFixesApplied: job.data.options?.autoApplyFixes ? job.data.productIds.length : 0,
    };
  }
  
  /**
   * 価格計算
   */
  private async executePriceCalculation(job: Job, onProgress?: (p: number) => void): Promise<any> {
    onProgress?.(10);
    
    // TODO: price-calculation-service を呼び出し
    await new Promise(r => setTimeout(r, 500));
    
    onProgress?.(100);
    
    return {
      success: true,
      pricesCalculated: job.data.productIds.length,
    };
  }
  
  /**
   * 出品予約
   */
  private async executeListingSchedule(job: Job, onProgress?: (p: number) => void): Promise<any> {
    onProgress?.(10);
    
    const scheduleAt = job.data.options?.scheduleListingAt || new Date().toISOString();
    
    // TODO: listing-service を呼び出し
    await new Promise(r => setTimeout(r, 500));
    
    onProgress?.(100);
    
    return {
      success: true,
      scheduledAt: scheduleAt,
      productsScheduled: job.data.productIds.length,
    };
  }
  
  /**
   * eBay送信
   */
  private async executeEbaySubmit(job: Job, onProgress?: (p: number) => void): Promise<any> {
    onProgress?.(10);
    
    // TODO: eBay Trading API を呼び出し
    await new Promise(r => setTimeout(r, 2000));
    
    onProgress?.(100);
    
    return {
      success: true,
      itemsListed: job.data.productIds.length,
    };
  }
  
  // ============================================================
  // ユーティリティ
  // ============================================================
  
  private getPriorityWeight(priority: JobPriority): number {
    switch (priority) {
      case 'high': return 3;
      case 'normal': return 2;
      case 'low': return 1;
      default: return 2;
    }
  }
  
  private async persistJob(job: Job): Promise<void> {
    if (!this.supabase) return;
    
    try {
      await this.supabase.from('job_queue').upsert({
        id: job.id,
        type: job.type,
        status: job.status,
        priority: job.priority,
        data: job.data,
        result: job.result,
        error: job.error,
        progress: job.progress,
        progress_message: job.progressMessage,
        created_at: job.createdAt,
        started_at: job.startedAt,
        completed_at: job.completedAt,
        retry_count: job.retryCount,
        max_retries: job.maxRetries,
      });
    } catch (error) {
      console.error('[JobQueue] Failed to persist job:', error);
    }
  }
  
  private async notifyCompletion(job: Job): Promise<void> {
    const message = job.status === 'completed'
      ? `✅ ジョブ完了: ${job.type} (${job.data.productIds.length}件)`
      : `❌ ジョブ失敗: ${job.type} - ${job.error}`;
    
    // ChatWork通知
    if (process.env.CHATWORK_API_TOKEN && process.env.CHATWORK_ROOM_ID) {
      try {
        await fetch(`https://api.chatwork.com/v2/rooms/${process.env.CHATWORK_ROOM_ID}/messages`, {
          method: 'POST',
          headers: {
            'X-ChatWorkToken': process.env.CHATWORK_API_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `body=${encodeURIComponent(message)}`,
        });
      } catch (error) {
        console.error('[JobQueue] ChatWork notification failed:', error);
      }
    }
    
    // Webhook通知
    if (job.data.options?.webhookUrl) {
      try {
        await fetch(job.data.options.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job }),
        });
      } catch (error) {
        console.error('[JobQueue] Webhook notification failed:', error);
      }
    }
  }
}

// ============================================================
// シングルトンインスタンス
// ============================================================

export const jobQueue = new JobQueue();

// ============================================================
// 便利関数
// ============================================================

/**
 * SM選択後のフルパイプラインを開始
 */
export async function startFullPipeline(
  productIds: string[],
  smSource: string,
  options?: JobData['options']
): Promise<Job> {
  return jobQueue.enqueue('full_pipeline', {
    productIds,
    smSource,
    options: {
      autoApplyFixes: true,
      notifyOnComplete: true,
      ...options,
    },
  }, { priority: 'high' });
}

/**
 * ジョブの進捗を監視
 */
export function watchJobProgress(
  jobId: string,
  onProgress: (job: Job) => void,
  intervalMs: number = 1000
): () => void {
  const interval = setInterval(() => {
    const job = jobQueue.getJob(jobId);
    if (job) {
      onProgress(job);
      if (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') {
        clearInterval(interval);
      }
    }
  }, intervalMs);
  
  return () => clearInterval(interval);
}

// ============================================================
// エクスポート
// ============================================================

export default jobQueue;
