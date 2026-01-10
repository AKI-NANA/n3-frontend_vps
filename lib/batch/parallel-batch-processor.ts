/**
 * P1: バッチ処理の並列化
 *
 * p-limitを使用した大規模バッチ処理の並列実行
 * - SEO更新、メッセージポーリング、商品同期などの大規模処理に対応
 * - タイムアウト防止
 * - エラーハンドリングと再試行
 * - 進捗追跡
 */

import pLimit from 'p-limit';

export interface BatchProcessOptions {
  concurrency?: number; // 同時実行数（デフォルト: 5）
  retryAttempts?: number; // 再試行回数（デフォルト: 3）
  retryDelay?: number; // 再試行間隔（ミリ秒、デフォルト: 1000）
  timeout?: number; // 個別タスクのタイムアウト（ミリ秒、デフォルト: 30000）
  onProgress?: (completed: number, total: number, successCount: number, errorCount: number) => void;
  onError?: (error: Error, item: any, attempt: number) => void;
  continueOnError?: boolean; // エラーが発生しても続行（デフォルト: true）
}

export interface BatchResult<T, R> {
  total: number;
  success: number;
  failed: number;
  results: Array<{
    item: T;
    success: boolean;
    result?: R;
    error?: Error;
    attempts: number;
  }>;
  duration: number; // 処理時間（ミリ秒）
}

/**
 * 並列バッチプロセッサー
 */
export class ParallelBatchProcessor {
  private options: Required<BatchProcessOptions>;

  constructor(options: BatchProcessOptions = {}) {
    this.options = {
      concurrency: options.concurrency || 5,
      retryAttempts: options.retryAttempts || 3,
      retryDelay: options.retryDelay || 1000,
      timeout: options.timeout || 30000,
      onProgress: options.onProgress || (() => {}),
      onError: options.onError || (() => {}),
      continueOnError: options.continueOnError !== false,
    };
  }

  /**
   * バッチ処理を並列実行
   */
  async process<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>
  ): Promise<BatchResult<T, R>> {
    const startTime = Date.now();
    const limit = pLimit(this.options.concurrency);
    const results: BatchResult<T, R>['results'] = [];

    let completed = 0;
    let successCount = 0;
    let errorCount = 0;

    console.log(`🚀 バッチ処理開始: ${items.length}件 (並列数: ${this.options.concurrency})`);

    // 各アイテムを並列処理
    const promises = items.map((item) =>
      limit(async () => {
        const result = await this.processWithRetry(item, processor);
        results.push(result);

        completed++;
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }

        // 進捗コールバック
        this.options.onProgress(completed, items.length, successCount, errorCount);

        if (!result.success && !this.options.continueOnError) {
          throw result.error;
        }

        return result;
      })
    );

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('❌ バッチ処理がエラーにより中断されました:', error);
    }

    const duration = Date.now() - startTime;

    console.log(
      `✅ バッチ処理完了: 成功 ${successCount}/${items.length}, 失敗 ${errorCount}, 処理時間 ${(duration / 1000).toFixed(2)}秒`
    );

    return {
      total: items.length,
      success: successCount,
      failed: errorCount,
      results,
      duration,
    };
  }

  /**
   * 再試行ロジック付きで単一アイテムを処理
   */
  private async processWithRetry<T, R>(
    item: T,
    processor: (item: T) => Promise<R>
  ): Promise<{
    item: T;
    success: boolean;
    result?: R;
    error?: Error;
    attempts: number;
  }> {
    let attempts = 0;
    let lastError: Error | undefined;

    while (attempts < this.options.retryAttempts) {
      attempts++;

      try {
        const result = await this.executeWithTimeout(processor(item), this.options.timeout);
        return {
          item,
          success: true,
          result,
          attempts,
        };
      } catch (error: any) {
        lastError = error;
        this.options.onError(error, item, attempts);

        if (attempts < this.options.retryAttempts) {
          console.warn(
            `⚠️ リトライ (${attempts}/${this.options.retryAttempts}): ${error.message}`
          );
          await this.delay(this.options.retryDelay * attempts); // Exponential backoff
        }
      }
    }

    return {
      item,
      success: false,
      error: lastError,
      attempts,
    };
  }

  /**
   * タイムアウト付きでPromiseを実行
   */
  private executeWithTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout)
      ),
    ]);
  }

  /**
   * 遅延ユーティリティ
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 処理をチャンク分割して実行（メモリ効率向上）
   */
  async processInChunks<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    chunkSize: number = 100
  ): Promise<BatchResult<T, R>> {
    const startTime = Date.now();
    const allResults: BatchResult<T, R>['results'] = [];

    let totalSuccess = 0;
    let totalFailed = 0;

    console.log(
      `🚀 チャンク分割バッチ処理開始: ${items.length}件 (チャンクサイズ: ${chunkSize})`
    );

    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      console.log(
        `📦 チャンク ${Math.floor(i / chunkSize) + 1}/${Math.ceil(items.length / chunkSize)} 処理中...`
      );

      const chunkResult = await this.process(chunk, processor);
      allResults.push(...chunkResult.results);
      totalSuccess += chunkResult.success;
      totalFailed += chunkResult.failed;
    }

    const duration = Date.now() - startTime;

    console.log(
      `✅ 全チャンク処理完了: 成功 ${totalSuccess}/${items.length}, 失敗 ${totalFailed}, 処理時間 ${(duration / 1000).toFixed(2)}秒`
    );

    return {
      total: items.length,
      success: totalSuccess,
      failed: totalFailed,
      results: allResults,
      duration,
    };
  }
}

/**
 * デフォルトインスタンス（並列数: 5）
 */
export const defaultBatchProcessor = new ParallelBatchProcessor({
  concurrency: 5,
  retryAttempts: 3,
  continueOnError: true,
});

/**
 * 高速バッチプロセッサー（並列数: 10）
 */
export const fastBatchProcessor = new ParallelBatchProcessor({
  concurrency: 10,
  retryAttempts: 2,
  timeout: 15000,
  continueOnError: true,
});

/**
 * 低速バッチプロセッサー（並列数: 2、タイムアウト長め）
 */
export const slowBatchProcessor = new ParallelBatchProcessor({
  concurrency: 2,
  retryAttempts: 5,
  timeout: 60000,
  continueOnError: true,
});

/**
 * 使用例: SEO更新バッチ
 */
/*
import { defaultBatchProcessor } from './parallel-batch-processor';

async function updateSEOForProducts(productIds: number[]) {
  const result = await defaultBatchProcessor.process(
    productIds,
    async (productId) => {
      // SEO更新処理
      const response = await fetch(`/api/seo/update/${productId}`, { method: 'POST' });
      return response.json();
    }
  );

  console.log(`SEO更新完了: ${result.success}/${result.total}`);
  return result;
}
*/

/**
 * 使用例: メッセージポーリング
 */
/*
import { fastBatchProcessor } from './parallel-batch-processor';

async function pollMessagesFromMarketplaces(marketplaceIds: string[]) {
  const result = await fastBatchProcessor.processInChunks(
    marketplaceIds,
    async (marketplaceId) => {
      // メッセージポーリング処理
      const messages = await fetchMessagesFromMarketplace(marketplaceId);
      return messages;
    },
    50 // 50件ずつチャンク処理
  );

  console.log(`メッセージポーリング完了: ${result.success}/${result.total}`);
  return result;
}
*/

/**
 * 進捗追跡付きバッチ処理のヘルパー
 */
export async function processBatchWithProgress<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  options?: BatchProcessOptions
): Promise<BatchResult<T, R>> {
  const batchProcessor = new ParallelBatchProcessor({
    ...options,
    onProgress: (completed, total, success, error) => {
      const percentage = ((completed / total) * 100).toFixed(1);
      console.log(
        `📊 進捗: ${completed}/${total} (${percentage}%) | 成功: ${success} | 失敗: ${error}`
      );
      options?.onProgress?.(completed, total, success, error);
    },
    onError: (error, item, attempt) => {
      console.error(`❌ エラー (試行 ${attempt}):`, error.message, '| アイテム:', item);
      options?.onError?.(error, item, attempt);
    },
  });

  return batchProcessor.process(items, processor);
}
