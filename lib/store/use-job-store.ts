// lib/store/use-job-store.ts
/**
 * N3非同期ジョブ管理ストア
 * - 出品、スマート処理、在庫同期などのバックグラウンドジョブを管理
 * - 進捗表示、成功/失敗カウント、エラーログ
 * - ノンブロッキング設計（UIをフリーズさせない）
 */
import { create } from 'zustand';

// ジョブタイプ
export type JobType = 
  | 'listing'           // eBay出品
  | 'smart_process'     // スマート処理（AI補正含む）
  | 'inventory_sync'    // 在庫同期
  | 'weight_correction' // AI重量補正
  | 'bulk_archive'      // 一括アーカイブ
  | 'bulk_delete'       // 一括削除
  | 'image_optimize'    // 画像最適化
  | 'policy_mapping';   // 配送ポリシーマッピング

// ジョブステータス
export type JobStatus = 
  | 'pending'     // 待機中
  | 'running'     // 実行中
  | 'completed'   // 完了
  | 'failed'      // 失敗
  | 'cancelled';  // キャンセル

// 個別アイテムの処理結果
export interface JobItemResult {
  id: number | string;
  status: 'success' | 'failed' | 'skipped';
  message?: string;
  data?: any;
}

// ジョブ定義
export interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  title: string;
  description?: string;
  
  // 進捗
  totalItems: number;
  processedItems: number;
  successCount: number;
  failedCount: number;
  skippedCount: number;
  
  // タイミング
  startedAt: Date;
  completedAt?: Date;
  estimatedTimeRemaining?: number; // 秒
  
  // 詳細結果
  results: JobItemResult[];
  errors: string[];
  
  // キャンセルフラグ
  isCancelled: boolean;
  
  // コールバック
  onComplete?: (job: Job) => void;
  onError?: (job: Job, error: string) => void;
}

// ジョブタイプの表示情報
export const JOB_TYPE_INFO: Record<JobType, { label: string; icon: string; color: string }> = {
  listing: { label: 'eBay出品', icon: '📦', color: '#10b981' },
  smart_process: { label: 'スマート処理', icon: '✨', color: '#8b5cf6' },
  inventory_sync: { label: '在庫同期', icon: '🔄', color: '#3b82f6' },
  weight_correction: { label: 'AI重量補正', icon: '⚖️', color: '#f59e0b' },
  bulk_archive: { label: '一括アーカイブ', icon: '📥', color: '#6b7280' },
  bulk_delete: { label: '一括削除', icon: '🗑️', color: '#ef4444' },
  image_optimize: { label: '画像最適化', icon: '🖼️', color: '#06b6d4' },
  policy_mapping: { label: 'ポリシーマッピング', icon: '📋', color: '#ec4899' },
};

// ストア状態
interface JobStoreState {
  // アクティブなジョブ一覧
  jobs: Map<string, Job>;
  
  // UIの表示状態
  isIndicatorVisible: boolean;
  isDetailPanelOpen: boolean;
  selectedJobId: string | null;
  
  // アクション
  createJob: (params: CreateJobParams) => string;
  updateJobProgress: (jobId: string, progress: JobProgressUpdate) => void;
  addJobResult: (jobId: string, result: JobItemResult) => void;
  completeJob: (jobId: string, status?: 'completed' | 'failed') => void;
  cancelJob: (jobId: string) => void;
  removeJob: (jobId: string) => void;
  clearCompletedJobs: () => void;
  
  // UI操作
  setIndicatorVisible: (visible: boolean) => void;
  toggleDetailPanel: () => void;
  selectJob: (jobId: string | null) => void;
  
  // ゲッター
  getJob: (jobId: string) => Job | undefined;
  getActiveJobs: () => Job[];
  getCompletedJobs: () => Job[];
  hasRunningJobs: () => boolean;
  getTotalProgress: () => { processed: number; total: number; percent: number };
}

// ジョブ作成パラメータ
export interface CreateJobParams {
  type: JobType;
  title: string;
  description?: string;
  totalItems: number;
  onComplete?: (job: Job) => void;
  onError?: (job: Job, error: string) => void;
}

// 進捗更新パラメータ
export interface JobProgressUpdate {
  processedItems?: number;
  successCount?: number;
  failedCount?: number;
  skippedCount?: number;
  estimatedTimeRemaining?: number;
  message?: string;
}

// ユニークID生成
function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Zustand ストア
export const useJobStore = create<JobStoreState>((set, get) => ({
  jobs: new Map(),
  isIndicatorVisible: true,
  isDetailPanelOpen: false,
  selectedJobId: null,

  // ジョブ作成
  createJob: (params) => {
    const jobId = generateJobId();
    const job: Job = {
      id: jobId,
      type: params.type,
      status: 'pending',
      title: params.title,
      description: params.description,
      totalItems: params.totalItems,
      processedItems: 0,
      successCount: 0,
      failedCount: 0,
      skippedCount: 0,
      startedAt: new Date(),
      results: [],
      errors: [],
      isCancelled: false,
      onComplete: params.onComplete,
      onError: params.onError,
    };

    set((state) => {
      const newJobs = new Map(state.jobs);
      newJobs.set(jobId, job);
      return { 
        jobs: newJobs,
        isIndicatorVisible: true, // ジョブ開始時にインジケーター表示
      };
    });

    // 自動でrunningに移行
    setTimeout(() => {
      set((state) => {
        const newJobs = new Map(state.jobs);
        const existingJob = newJobs.get(jobId);
        if (existingJob && existingJob.status === 'pending') {
          newJobs.set(jobId, { ...existingJob, status: 'running' });
        }
        return { jobs: newJobs };
      });
    }, 100);

    return jobId;
  },

  // 進捗更新
  updateJobProgress: (jobId, progress) => {
    set((state) => {
      const newJobs = new Map(state.jobs);
      const job = newJobs.get(jobId);
      
      if (!job || job.isCancelled) return state;

      const updatedJob: Job = {
        ...job,
        processedItems: progress.processedItems ?? job.processedItems,
        successCount: progress.successCount ?? job.successCount,
        failedCount: progress.failedCount ?? job.failedCount,
        skippedCount: progress.skippedCount ?? job.skippedCount,
        estimatedTimeRemaining: progress.estimatedTimeRemaining,
      };

      newJobs.set(jobId, updatedJob);
      return { jobs: newJobs };
    });
  },

  // 個別結果追加
  addJobResult: (jobId, result) => {
    set((state) => {
      const newJobs = new Map(state.jobs);
      const job = newJobs.get(jobId);
      
      if (!job) return state;

      const updatedJob: Job = {
        ...job,
        processedItems: job.processedItems + 1,
        successCount: result.status === 'success' ? job.successCount + 1 : job.successCount,
        failedCount: result.status === 'failed' ? job.failedCount + 1 : job.failedCount,
        skippedCount: result.status === 'skipped' ? job.skippedCount + 1 : job.skippedCount,
        results: [...job.results, result],
        errors: result.status === 'failed' && result.message 
          ? [...job.errors, `ID ${result.id}: ${result.message}`]
          : job.errors,
      };

      newJobs.set(jobId, updatedJob);
      return { jobs: newJobs };
    });
  },

  // ジョブ完了
  completeJob: (jobId, status = 'completed') => {
    set((state) => {
      const newJobs = new Map(state.jobs);
      const job = newJobs.get(jobId);
      
      if (!job) return state;

      const finalStatus: JobStatus = job.isCancelled 
        ? 'cancelled' 
        : (status === 'failed' || job.failedCount === job.totalItems) 
          ? 'failed' 
          : 'completed';

      const updatedJob: Job = {
        ...job,
        status: finalStatus,
        completedAt: new Date(),
      };

      // コールバック実行
      if (finalStatus === 'completed' && job.onComplete) {
        job.onComplete(updatedJob);
      } else if (finalStatus === 'failed' && job.onError) {
        job.onError(updatedJob, job.errors.join(', '));
      }

      newJobs.set(jobId, updatedJob);
      return { jobs: newJobs };
    });
  },

  // ジョブキャンセル
  cancelJob: (jobId) => {
    set((state) => {
      const newJobs = new Map(state.jobs);
      const job = newJobs.get(jobId);
      
      if (!job || job.status !== 'running') return state;

      newJobs.set(jobId, { 
        ...job, 
        isCancelled: true,
        status: 'cancelled',
        completedAt: new Date(),
      });

      return { jobs: newJobs };
    });
  },

  // ジョブ削除
  removeJob: (jobId) => {
    set((state) => {
      const newJobs = new Map(state.jobs);
      newJobs.delete(jobId);
      return { 
        jobs: newJobs,
        selectedJobId: state.selectedJobId === jobId ? null : state.selectedJobId,
      };
    });
  },

  // 完了済みジョブをクリア
  clearCompletedJobs: () => {
    set((state) => {
      const newJobs = new Map(state.jobs);
      for (const [id, job] of newJobs) {
        if (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') {
          newJobs.delete(id);
        }
      }
      return { jobs: newJobs, selectedJobId: null };
    });
  },

  // UI操作
  setIndicatorVisible: (visible) => set({ isIndicatorVisible: visible }),
  toggleDetailPanel: () => set((state) => ({ isDetailPanelOpen: !state.isDetailPanelOpen })),
  selectJob: (jobId) => set({ selectedJobId: jobId }),

  // ゲッター
  getJob: (jobId) => get().jobs.get(jobId),
  
  getActiveJobs: () => {
    const jobs = Array.from(get().jobs.values());
    return jobs.filter(j => j.status === 'pending' || j.status === 'running');
  },
  
  getCompletedJobs: () => {
    const jobs = Array.from(get().jobs.values());
    return jobs.filter(j => j.status === 'completed' || j.status === 'failed' || j.status === 'cancelled');
  },
  
  hasRunningJobs: () => {
    const jobs = Array.from(get().jobs.values());
    return jobs.some(j => j.status === 'running');
  },
  
  getTotalProgress: () => {
    const activeJobs = get().getActiveJobs();
    if (activeJobs.length === 0) {
      return { processed: 0, total: 0, percent: 0 };
    }
    
    const processed = activeJobs.reduce((sum, j) => sum + j.processedItems, 0);
    const total = activeJobs.reduce((sum, j) => sum + j.totalItems, 0);
    const percent = total > 0 ? Math.round((processed / total) * 100) : 0;
    
    return { processed, total, percent };
  },
}));

// ========================================
// ヘルパー関数：ジョブ実行ラッパー
// ========================================

/**
 * 非同期ジョブを実行するラッパー関数
 * @param params ジョブ設定
 * @param processor 各アイテムを処理する関数
 */
export async function executeJob<T>(
  params: CreateJobParams,
  items: T[],
  processor: (item: T, index: number) => Promise<JobItemResult>
): Promise<Job> {
  const store = useJobStore.getState();
  const jobId = store.createJob({
    ...params,
    totalItems: items.length,
  });

  const startTime = Date.now();

  for (let i = 0; i < items.length; i++) {
    // キャンセルチェック
    const currentJob = store.getJob(jobId);
    if (currentJob?.isCancelled) {
      break;
    }

    try {
      const result = await processor(items[i], i);
      store.addJobResult(jobId, result);
    } catch (error) {
      store.addJobResult(jobId, {
        id: (items[i] as any)?.id ?? i,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // 残り時間推定
    const elapsed = Date.now() - startTime;
    const avgTimePerItem = elapsed / (i + 1);
    const remainingItems = items.length - (i + 1);
    const estimatedRemaining = Math.round((avgTimePerItem * remainingItems) / 1000);
    
    store.updateJobProgress(jobId, {
      estimatedTimeRemaining: estimatedRemaining,
    });
  }

  // 完了処理
  store.completeJob(jobId);
  
  return store.getJob(jobId)!;
}

/**
 * 並列実行版ジョブラッパー（同時実行数制限付き）
 */
export async function executeJobParallel<T>(
  params: CreateJobParams,
  items: T[],
  processor: (item: T, index: number) => Promise<JobItemResult>,
  concurrency: number = 3
): Promise<Job> {
  const store = useJobStore.getState();
  const jobId = store.createJob({
    ...params,
    totalItems: items.length,
  });

  const startTime = Date.now();
  let processedCount = 0;

  // チャンク処理
  const processChunk = async (chunk: T[], startIndex: number) => {
    return Promise.all(
      chunk.map(async (item, i) => {
        const currentJob = store.getJob(jobId);
        if (currentJob?.isCancelled) {
          return { id: (item as any)?.id ?? startIndex + i, status: 'skipped' as const, message: 'Cancelled' };
        }

        try {
          const result = await processor(item, startIndex + i);
          return result;
        } catch (error) {
          return {
            id: (item as any)?.id ?? startIndex + i,
            status: 'failed' as const,
            message: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );
  };

  // チャンクに分割して実行
  for (let i = 0; i < items.length; i += concurrency) {
    const currentJob = store.getJob(jobId);
    if (currentJob?.isCancelled) break;

    const chunk = items.slice(i, i + concurrency);
    const results = await processChunk(chunk, i);

    for (const result of results) {
      store.addJobResult(jobId, result);
      processedCount++;
    }

    // 残り時間推定
    const elapsed = Date.now() - startTime;
    const avgTimePerItem = elapsed / processedCount;
    const remainingItems = items.length - processedCount;
    const estimatedRemaining = Math.round((avgTimePerItem * remainingItems) / 1000);
    
    store.updateJobProgress(jobId, {
      estimatedTimeRemaining: estimatedRemaining,
    });
  }

  store.completeJob(jobId);
  return store.getJob(jobId)!;
}
