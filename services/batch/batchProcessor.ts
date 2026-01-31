// services/batch/batchProcessor.ts
// P1: バッチ処理の並列化 - 汎用バッチ処理サービス

import { processBatch, createProgressLogger, retryTask, type BatchOptions } from '@/lib/batchUtils';

export interface BatchTaskConfig<T, R> {
  name: string;
  items: T[];
  taskFn: (item: T, index: number) => Promise<R>;
  concurrency?: number;
  timeout?: number;
  enableRetry?: boolean;
  maxRetries?: number;
  enableProgress?: boolean;
}

/**
 * 汎用バッチ処理実行
 * SEO更新、メッセージポーリング、在庫同期など、大規模な並列処理に使用
 */
export async function executeBatchTask<T, R>(config: BatchTaskConfig<T, R>) {
  const {
    name,
    items,
    taskFn,
    concurrency = 5,
    timeout = 30000,
    enableRetry = false,
    maxRetries = 3,
    enableProgress = true,
  } = config;

  console.log(`[BatchProcessor] Starting batch task: ${name}`);
  console.log(`[BatchProcessor] Items: ${items.length}, Concurrency: ${concurrency}, Timeout: ${timeout}ms`);

  const startTime = Date.now();

  // リトライ機能付きタスク関数
  const wrappedTaskFn = enableRetry
    ? async (item: T, index: number) => {
        return retryTask(() => taskFn(item, index), {
          maxRetries,
          retryDelay: 1000,
          onRetry: (attempt, error) => {
            console.warn(`[${name}] Retry attempt ${attempt} for item ${index}:`, error.message);
          },
        });
      }
    : taskFn;

  // バッチ処理オプション
  const options: BatchOptions = {
    concurrency,
    timeout,
    onProgress: enableProgress ? createProgressLogger(name) : undefined,
    onError: (error, index) => {
      console.error(`[${name}] Item ${index} failed:`, error.message);
    },
  };

  // バッチ処理実行
  const result = await processBatch(items, wrappedTaskFn, options);

  const duration = Date.now() - startTime;
  console.log(`[BatchProcessor] ${name} completed in ${(duration / 1000).toFixed(2)}s`);
  console.log(`[BatchProcessor] Success: ${result.successCount}/${items.length}, Errors: ${result.errorCount}`);

  return result;
}

/**
 * SEO更新バッチ処理 (例)
 */
export async function batchUpdateSEO(productIds: string[]) {
  return executeBatchTask({
    name: 'SEO Update',
    items: productIds,
    taskFn: async (productId) => {
      // SEO更新ロジック (例)
      // const product = await fetchProduct(productId);
      // const seoData = await generateSEO(product);
      // await updateProductSEO(productId, seoData);

      // モック実装
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { productId, updated: true };
    },
    concurrency: 10,
    timeout: 30000,
    enableRetry: true,
    maxRetries: 3,
  });
}

/**
 * メッセージポーリングバッチ処理 (例)
 */
export async function batchPollMessages(marketplaces: string[]) {
  return executeBatchTask({
    name: 'Message Polling',
    items: marketplaces,
    taskFn: async (marketplace) => {
      // メッセージポーリングロジック (例)
      // const token = await getMarketplaceToken(marketplace);
      // const messages = await fetchMessages(marketplace, token);
      // await saveMessages(messages);

      // モック実装
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { marketplace, messageCount: Math.floor(Math.random() * 10) };
    },
    concurrency: 5,
    timeout: 60000,
    enableRetry: true,
    maxRetries: 2,
  });
}

/**
 * 在庫同期バッチ処理 (例)
 */
export async function batchSyncInventory(skus: string[]) {
  return executeBatchTask({
    name: 'Inventory Sync',
    items: skus,
    taskFn: async (sku) => {
      // 在庫同期ロジック (例)
      // const inventory = await fetchInventoryFromWarehouse(sku);
      // await updateInventoryInDB(sku, inventory);

      // モック実装
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { sku, quantity: Math.floor(Math.random() * 100) };
    },
    concurrency: 20,
    timeout: 15000,
    enableRetry: true,
  });
}

/**
 * 画像処理バッチ (例)
 */
export async function batchProcessImages(imageUrls: string[]) {
  return executeBatchTask({
    name: 'Image Processing',
    items: imageUrls,
    taskFn: async (imageUrl) => {
      // 画像処理ロジック (例)
      // const image = await downloadImage(imageUrl);
      // const optimized = await optimizeImage(image);
      // const uploaded = await uploadToStorage(optimized);

      // モック実装
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { imageUrl, processed: true };
    },
    concurrency: 3, // 画像処理は重い処理なので並列数を少なめに
    timeout: 120000, // 2分
    enableRetry: false, // 画像処理は冪等性がない場合があるので、リトライは慎重に
  });
}

/**
 * API呼び出しバッチ (例: eBay API一括呼び出し)
 */
export async function batchAPICall<T, R>(
  items: T[],
  apiFn: (item: T) => Promise<R>,
  options: {
    concurrency?: number;
    rateLimit?: number; // 秒間リクエスト数
  } = {}
) {
  const { concurrency = 5, rateLimit } = options;

  return executeBatchTask({
    name: 'API Batch Call',
    items,
    taskFn: async (item) => {
      // レート制限がある場合は、待機時間を計算
      if (rateLimit) {
        const delayMs = 1000 / rateLimit;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }

      return apiFn(item);
    },
    concurrency,
    timeout: 60000,
    enableRetry: true,
    maxRetries: 3,
  });
}
