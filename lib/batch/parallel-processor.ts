// lib/batch/parallel-processor.ts
/**
 * P1: バッチ処理の並列化ライブラリ
 *
 * p-limitを使用して大規模なバックグラウンドタスクの並列実行を制御
 * タイムアウトとボトルネックを防ぎます
 *
 * 使用例:
 * - SEO更新
 * - メッセージポーリング
 * - 画像処理
 * - データ同期
 */

/**
 * シンプルなp-limit実装（依存関係を減らすため）
 */
class PLimitQueue {
  private concurrency: number;
  private running: number = 0;
  private queue: Array<() => Promise<void>> = [];

  constructor(concurrency: number) {
    this.concurrency = concurrency;
  }

  async run<T>(fn: () => Promise<T>): Promise<T> {
    while (this.running >= this.concurrency) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    this.running++;
    try {
      return await fn();
    } finally {
      this.running--;
      this.processQueue();
    }
  }

  private processQueue() {
    if (this.queue.length > 0 && this.running < this.concurrency) {
      const task = this.queue.shift();
      if (task) task();
    }
  }
}

export interface ParallelProcessOptions {
  concurrency?: number; // 並列実行数（デフォルト: 5）
  timeout?: number; // タイムアウト（ミリ秒、デフォルト: 30000）
  retries?: number; // リトライ回数（デフォルト: 3）
  onProgress?: (completed: number, total: number) => void;
  onError?: (error: Error, item: any) => void;
}

export interface ParallelProcessResult<T> {
  success: boolean;
  completed: number;
  failed: number;
  results: T[];
  errors: Array<{ item: any; error: Error }>;
}

/**
 * アイテムを並列処理
 */
export async function processInParallel<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  options: ParallelProcessOptions = {}
): Promise<ParallelProcessResult<R>> {
  const {
    concurrency = 5,
    timeout = 30000,
    retries = 3,
    onProgress,
    onError,
  } = options;

  const limit = new PLimitQueue(concurrency);
  const results: R[] = [];
  const errors: Array<{ item: T; error: Error }> = [];
  let completed = 0;

  console.log(`🚀 並列処理開始: ${items.length}件、並列数: ${concurrency}`);

  const tasks = items.map((item, index) =>
    limit.run(async () => {
      let lastError: Error | null = null;

      // リトライロジック
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const result = await Promise.race([
            processor(item),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Timeout')), timeout)
            ),
          ]);

          results.push(result);
          completed++;

          if (onProgress) {
            onProgress(completed, items.length);
          }

          return;
        } catch (error: any) {
          lastError = error;

          if (attempt < retries) {
            console.warn(
              `⚠️  リトライ ${attempt + 1}/${retries}: ${error.message}`
            );
            // エクスポネンシャルバックオフ
            await new Promise((resolve) =>
              setTimeout(resolve, Math.pow(2, attempt) * 1000)
            );
          }
        }
      }

      // 最終的に失敗
      if (lastError) {
        errors.push({ item, error: lastError });
        if (onError) {
          onError(lastError, item);
        }
        console.error(`❌ 処理失敗 (${index + 1}/${items.length}):`, lastError.message);
      }
    })
  );

  await Promise.all(tasks);

  console.log(
    `✅ 並列処理完了: 成功 ${completed}件、失敗 ${errors.length}件`
  );

  return {
    success: errors.length === 0,
    completed,
    failed: errors.length,
    results,
    errors,
  };
}

/**
 * バッチを分割して処理
 */
export async function processByBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>,
  options: ParallelProcessOptions = {}
): Promise<ParallelProcessResult<R>> {
  const { onProgress } = options;

  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  console.log(
    `📦 バッチ処理開始: ${items.length}件を${batches.length}バッチに分割`
  );

  let completed = 0;
  const allResults: R[] = [];
  const errors: Array<{ item: T; error: Error }> = [];

  for (const [index, batch] of batches.entries()) {
    try {
      const batchResults = await processor(batch);
      allResults.push(...batchResults);
      completed += batch.length;

      if (onProgress) {
        onProgress(completed, items.length);
      }

      console.log(
        `✅ バッチ ${index + 1}/${batches.length} 完了 (${completed}/${items.length})`
      );
    } catch (error: any) {
      console.error(
        `❌ バッチ ${index + 1}/${batches.length} 失敗:`,
        error.message
      );
      batch.forEach((item) => errors.push({ item, error }));
    }
  }

  return {
    success: errors.length === 0,
    completed,
    failed: errors.length,
    results: allResults,
    errors,
  };
}

/**
 * 並列処理のステータスを監視
 */
export class ParallelProcessMonitor {
  private total: number = 0;
  private completed: number = 0;
  private failed: number = 0;
  private startTime: number = 0;

  start(total: number) {
    this.total = total;
    this.completed = 0;
    this.failed = 0;
    this.startTime = Date.now();
    console.log(`📊 処理開始: ${total}件`);
  }

  increment(success: boolean = true) {
    if (success) {
      this.completed++;
    } else {
      this.failed++;
    }
  }

  getStatus() {
    const elapsed = Date.now() - this.startTime;
    const remaining = this.total - this.completed - this.failed;
    const progress = ((this.completed + this.failed) / this.total) * 100;

    return {
      total: this.total,
      completed: this.completed,
      failed: this.failed,
      remaining,
      progress: progress.toFixed(2),
      elapsed: Math.floor(elapsed / 1000),
    };
  }

  log() {
    const status = this.getStatus();
    console.log(
      `📊 進捗: ${status.completed}/${status.total} (${status.progress}%) - 失敗: ${status.failed}件 - 経過時間: ${status.elapsed}秒`
    );
  }

  finish() {
    const status = this.getStatus();
    console.log(
      `✅ 処理完了: 成功 ${status.completed}件、失敗 ${status.failed}件、時間: ${status.elapsed}秒`
    );
  }
}
