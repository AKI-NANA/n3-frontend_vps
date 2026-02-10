// lib/batch-utils.ts
// P1: バッチ処理の並列化 - 並列数制御ユーティリティ

/**
 * p-limit のようなシンプルな並列数制御
 * タイムアウトとボトルネックを防ぐために、同時実行数を制限する
 */

export interface BatchOptions {
  concurrency?: number; // 同時実行数 (デフォルト: 5)
  timeout?: number; // タスクあたりのタイムアウト (ミリ秒, デフォルト: 30000)
  onProgress?: (completed: number, total: number) => void; // 進捗コールバック
  onError?: (error: Error, index: number) => void; // エラーコールバック
}

export interface BatchResult<T> {
  success: boolean;
  results: T[];
  errors: Array<{ index: number; error: Error }>;
  duration: number;
  successCount: number;
  errorCount: number;
}

/**
 * 並列数を制限しながらタスクを実行
 */
export async function processBatch<T, R>(
  items: T[],
  taskFn: (item: T, index: number) => Promise<R>,
  options: BatchOptions = {}
): Promise<BatchResult<R>> {
  const {
    concurrency = 5,
    timeout = 30000,
    onProgress,
    onError,
  } = options;

  const startTime = Date.now();
  const results: R[] = [];
  const errors: Array<{ index: number; error: Error }> = [];
  let completed = 0;

  // タスクを並列数制限付きで実行
  const queue: Promise<void>[] = [];
  let currentIndex = 0;

  const executeTask = async (item: T, index: number) => {
    try {
      const result = await Promise.race([
        taskFn(item, index),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Task ${index} timed out after ${timeout}ms`)), timeout)
        ),
      ]);
      results[index] = result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      errors.push({ index, error: err });
      if (onError) {
        onError(err, index);
      }
    } finally {
      completed++;
      if (onProgress) {
        onProgress(completed, items.length);
      }
    }
  };

  // 並列実行
  while (currentIndex < items.length) {
    // 並列数を制限
    while (queue.length < concurrency && currentIndex < items.length) {
      const index = currentIndex;
      const item = items[index];
      const task = executeTask(item, index);
      queue.push(task);
      currentIndex++;
    }

    // 1つでも完了するまで待機
    await Promise.race(queue);

    // 完了したタスクをキューから削除
    for (let i = queue.length - 1; i >= 0; i--) {
      const task = queue[i];
      if (await Promise.race([task.then(() => true), Promise.resolve(false)])) {
        queue.splice(i, 1);
      }
    }
  }

  // 残りのタスクが全て完了するまで待機
  await Promise.all(queue);

  const duration = Date.now() - startTime;

  return {
    success: errors.length === 0,
    results,
    errors,
    duration,
    successCount: items.length - errors.length,
    errorCount: errors.length,
  };
}

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
 * リトライ機能付きタスク実行
 */
export async function retryTask<T>(
  taskFn: () => Promise<T>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const { maxRetries = 3, retryDelay = 1000, onRetry } = options;

  let lastError: Error = new Error('Unknown error');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await taskFn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (onRetry) {
        onRetry(attempt, lastError);
      }

      if (attempt < maxRetries) {
        // 指数バックオフ: 1秒 -> 2秒 -> 4秒
        const delay = retryDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * レート制限付きタスク実行 (秒あたりのリクエスト数を制限)
 */
export class RateLimiter {
  private queue: Array<() => void> = [];
  private requestsInWindow: number = 0;
  private windowStart: number = Date.now();

  constructor(
    private maxRequestsPerSecond: number = 10,
    private windowMs: number = 1000
  ) {}

  async execute<T>(taskFn: () => Promise<T>): Promise<T> {
    await this.waitForSlot();
    return taskFn();
  }

  private async waitForSlot(): Promise<void> {
    return new Promise((resolve) => {
      const tryAcquire = () => {
        const now = Date.now();
        const elapsed = now - this.windowStart;

        // ウィンドウをリセット
        if (elapsed >= this.windowMs) {
          this.requestsInWindow = 0;
          this.windowStart = now;
        }

        // スロットが空いている場合
        if (this.requestsInWindow < this.maxRequestsPerSecond) {
          this.requestsInWindow++;
          resolve();
        } else {
          // スロットが空くまで待機
          const waitTime = this.windowMs - elapsed;
          setTimeout(tryAcquire, waitTime);
        }
      };

      tryAcquire();
    });
  }
}

/**
 * バッチ処理の進捗をログ出力
 */
export function createProgressLogger(taskName: string) {
  let lastLogTime = Date.now();
  const logInterval = 5000; // 5秒ごとにログ出力

  return (completed: number, total: number) => {
    const now = Date.now();
    if (now - lastLogTime >= logInterval || completed === total) {
      const percentage = ((completed / total) * 100).toFixed(1);
      lastLogTime = now;
    }
  };
}

/**
 * 使用例:
 *
 * // 基本的な並列処理
 * const items = [1, 2, 3, 4, 5];
 * const result = await processBatch(items, async (item) => {
 *   // 何らかの非同期処理
 *   return item * 2;
 * }, { concurrency: 3 });
 *
 * // 進捗表示付き
 * const result = await processBatch(items, async (item) => {
 *   return processItem(item);
 * }, {
 *   concurrency: 5,
 *   onProgress: createProgressLogger('MyTask'),
 *   onError: (error, index) => console.error(`Item ${index} failed:`, error),
 * });
 *
 * // レート制限付き
 * const rateLimiter = new RateLimiter(10); // 秒間10リクエスト
 * for (const item of items) {
 *   await rateLimiter.execute(() => apiCall(item));
 * }
 */
