// ============================================
// P1: バッチ処理並列化マネージャー
// p-limitを使用したリソース制御
// ============================================

import pLimit from 'p-limit';

interface BatchProcessorConfig {
  concurrency: number; // 並列実行数
  retryAttempts: number; // リトライ回数
  retryDelay: number; // リトライ間隔（ms）
  timeout: number; // タイムアウト（ms）
}

interface BatchTask<T> {
  id: string;
  execute: () => Promise<T>;
  priority?: number; // 優先度（高い方が先）
  metadata?: Record<string, any>;
}

interface BatchResult<T> {
  id: string;
  success: boolean;
  data?: T;
  error?: string;
  duration: number;
  retryCount: number;
}

/**
 * バッチ処理並列化マネージャー
 *
 * 目的:
 * - システム全体のバッチ処理の並列数を制御
 * - リソース競合によるクラッシュを防止
 * - スケーラビリティの確保
 */
export class BatchProcessor<T = any> {
  private config: BatchProcessorConfig;
  private limit: ReturnType<typeof pLimit>;
  private executionLog: Array<{
    taskId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
  }> = [];

  constructor(config: Partial<BatchProcessorConfig> = {}) {
    this.config = {
      concurrency: config.concurrency || 5, // デフォルト: 5並列
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
      timeout: config.timeout || 30000, // 30秒
    };

    this.limit = pLimit(this.config.concurrency);
  }

  /**
   * バッチタスクを実行
   *
   * @param tasks タスク配列
   * @returns 実行結果
   */
  async executeBatch(tasks: BatchTask<T>[]): Promise<BatchResult<T>[]> {
    // 優先度順にソート
    const sortedTasks = tasks.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // 実行ログ初期化
    sortedTasks.forEach((task) => {
      this.executionLog.push({
        taskId: task.id,
        status: 'pending',
      });
    });

    // 並列実行（p-limitで制御）
    const promises = sortedTasks.map((task) =>
      this.limit(() => this.executeTaskWithRetry(task))
    );

    const results = await Promise.all(promises);
    return results;
  }

  /**
   * リトライ付きタスク実行
   */
  private async executeTaskWithRetry(task: BatchTask<T>): Promise<BatchResult<T>> {
    const startTime = Date.now();
    let lastError: string = '';
    let retryCount = 0;

    // ログ更新
    const logEntry = this.executionLog.find((log) => log.taskId === task.id);
    if (logEntry) {
      logEntry.status = 'running';
      logEntry.startedAt = new Date();
    }

    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        // タイムアウト付き実行
        const result = await Promise.race([
          task.execute(),
          this.timeoutPromise(this.config.timeout),
        ]);

        const duration = Date.now() - startTime;

        // ログ更新
        if (logEntry) {
          logEntry.status = 'completed';
          logEntry.completedAt = new Date();
        }

        return {
          id: task.id,
          success: true,
          data: result as T,
          duration,
          retryCount: attempt,
        };
      } catch (error: any) {
        lastError = error.message || 'Unknown error';
        retryCount = attempt;

        // 最後の試行でない場合はリトライ
        if (attempt < this.config.retryAttempts) {
          console.warn(
            `[BatchProcessor] Task ${task.id} failed (attempt ${attempt + 1}), retrying...`
          );
          await this.delay(this.config.retryDelay * (attempt + 1)); // エクスポネンシャルバックオフ
        }
      }
    }

    const duration = Date.now() - startTime;

    // ログ更新
    if (logEntry) {
      logEntry.status = 'failed';
      logEntry.error = lastError;
      logEntry.completedAt = new Date();
    }

    return {
      id: task.id,
      success: false,
      error: lastError,
      duration,
      retryCount,
    };
  }

  /**
   * タイムアウトPromise
   */
  private timeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Task timeout')), timeout);
    });
  }

  /**
   * 遅延関数
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 実行ログの取得
   */
  getExecutionLog() {
    return this.executionLog;
  }

  /**
   * 実行統計の取得
   */
  getStatistics() {
    const total = this.executionLog.length;
    const completed = this.executionLog.filter((log) => log.status === 'completed').length;
    const failed = this.executionLog.filter((log) => log.status === 'failed').length;
    const running = this.executionLog.filter((log) => log.status === 'running').length;

    return {
      total,
      completed,
      failed,
      running,
      successRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }

  /**
   * 並列数の動的調整
   */
  setConcurrency(concurrency: number) {
    this.config.concurrency = concurrency;
    this.limit = pLimit(concurrency);
    console.log(`[BatchProcessor] Concurrency updated to ${concurrency}`);
  }
}

// ============================================
// 事前定義されたバッチプロセッサー
// ============================================

/**
 * 刈り取り・せどり用プロセッサー
 * 外部API（Amazon, 楽天）へのアクセスを制御
 */
export const arbitrageBatchProcessor = new BatchProcessor({
  concurrency: 3, // Amazon/楽天APIのレート制限を考慮
  retryAttempts: 3,
  retryDelay: 2000, // 2秒
  timeout: 30000, // 30秒
});

/**
 * SEOスコア更新用プロセッサー
 * eBay Analytics APIへのアクセスを制御
 */
export const seoScoreBatchProcessor = new BatchProcessor({
  concurrency: 5, // eBay APIのレート制限を考慮
  retryAttempts: 2,
  retryDelay: 1000,
  timeout: 20000, // 20秒
});

/**
 * メッセージ取得用プロセッサー
 * 複数マーケットプレイスからのメッセージ取得を制御
 */
export const messageFetchBatchProcessor = new BatchProcessor({
  concurrency: 4, // 複数モール並列取得
  retryAttempts: 3,
  retryDelay: 1500,
  timeout: 15000, // 15秒
});

/**
 * オークション処理用プロセッサー
 * オークション終了検知と切り替え処理を制御
 */
export const auctionBatchProcessor = new BatchProcessor({
  concurrency: 10, // 内部処理のため高並列
  retryAttempts: 2,
  retryDelay: 500,
  timeout: 10000, // 10秒
});

/**
 * AI生成用プロセッサー
 * Gemini APIへのアクセスを制御
 */
export const aiGenerationBatchProcessor = new BatchProcessor({
  concurrency: 2, // Gemini APIのレート制限を厳しく
  retryAttempts: 3,
  retryDelay: 3000, // 3秒
  timeout: 60000, // 60秒（AI生成は時間がかかる）
});

// ============================================
// バッチ処理ヘルパー関数
// ============================================

/**
 * 配列を指定サイズのチャンクに分割
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * バッチ処理の進捗を監視
 */
export class BatchProgressMonitor {
  private total: number;
  private completed: number = 0;
  private failed: number = 0;
  private onProgress?: (progress: number, completed: number, total: number) => void;

  constructor(total: number, onProgress?: (progress: number, completed: number, total: number) => void) {
    this.total = total;
    this.onProgress = onProgress;
  }

  update(success: boolean) {
    if (success) {
      this.completed++;
    } else {
      this.failed++;
    }

    const progress = ((this.completed + this.failed) / this.total) * 100;
    if (this.onProgress) {
      this.onProgress(progress, this.completed + this.failed, this.total);
    }
  }

  getStatus() {
    return {
      total: this.total,
      completed: this.completed,
      failed: this.failed,
      remaining: this.total - this.completed - this.failed,
      progress: ((this.completed + this.failed) / this.total) * 100,
    };
  }
}

/**
 * バッチ処理の実行例
 */
export async function executeBatchExample() {
  const tasks: BatchTask<string>[] = [
    {
      id: 'task-1',
      execute: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return 'Task 1 completed';
      },
      priority: 1,
    },
    {
      id: 'task-2',
      execute: async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return 'Task 2 completed';
      },
      priority: 2,
    },
    {
      id: 'task-3',
      execute: async () => {
        throw new Error('Task 3 failed');
      },
      priority: 1,
    },
  ];

  const processor = new BatchProcessor<string>({
    concurrency: 2,
    retryAttempts: 2,
  });

  const results = await processor.executeBatch(tasks);

  console.log('Batch execution results:', results);
  console.log('Statistics:', processor.getStatistics());

  return results;
}
