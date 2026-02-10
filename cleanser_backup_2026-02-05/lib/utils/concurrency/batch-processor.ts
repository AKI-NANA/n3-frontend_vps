// lib/utils/concurrency/batch-processor.ts
// P1: バッチ処理の並列化ユーティリティ

export interface BatchProcessOptions<T> {
  items: T[]
  batchSize?: number // デフォルト: 10
  concurrency?: number // デフォルト: 5
  onProgress?: (processed: number, total: number) => void
  onError?: (error: Error, item: T) => void
  continueOnError?: boolean // エラーが発生しても続行するか（デフォルト: true）
}

export interface BatchProcessResult<T, R> {
  successful: R[]
  failed: Array<{ item: T; error: Error }>
  total: number
  successCount: number
  failureCount: number
}

/**
 * アイテムのバッチを並列処理する
 * SEO更新、メッセージポーリングなどの大規模処理に対応
 *
 * @param processor 各アイテムを処理する関数
 * @param options バッチ処理オプション
 * @returns 処理結果
 */
export async function processBatch<T, R = void>(
  processor: (item: T) => Promise<R>,
  options: BatchProcessOptions<T>
): Promise<BatchProcessResult<T, R>> {
  const {
    items,
    batchSize = 10,
    concurrency = 5,
    onProgress,
    onError,
    continueOnError = true
  } = options

  const successful: R[] = []
  const failed: Array<{ item: T; error: Error }> = []
  let processed = 0

  // アイテムをバッチに分割
  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }

  // 各バッチを並列処理
  for (const batch of batches) {
    // バッチ内のアイテムを並列度を制限しながら処理
    const promises = batch.map(item =>
      processor(item)
        .then(result => {
          successful.push(result)
          processed++
          if (onProgress) {
            onProgress(processed, items.length)
          }
          return { success: true, result, item }
        })
        .catch(error => {
          const errorObj = error instanceof Error ? error : new Error(String(error))
          failed.push({ item, error: errorObj })
          processed++

          if (onError) {
            onError(errorObj, item)
          }

          if (onProgress) {
            onProgress(processed, items.length)
          }

          if (!continueOnError) {
            throw error
          }

          return { success: false, error: errorObj, item }
        })
    )

    // 並列度を制限しながら実行
    await limitConcurrency(promises, concurrency)
  }

  const result: BatchProcessResult<T, R> = {
    successful,
    failed,
    total: items.length,
    successCount: successful.length,
    failureCount: failed.length
  }

  return result
}

/**
 * Promise配列を並列度を制限しながら実行
 */
async function limitConcurrency<T>(
  promises: Promise<T>[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = []
  const executing: Promise<void>[] = []

  for (const promise of promises) {
    const p = promise.then(result => {
      results.push(result)
    })

    executing.push(p)

    if (executing.length >= concurrency) {
      await Promise.race(executing).then(() => {
        executing.splice(executing.findIndex(p => p === Promise.resolve()), 1)
      })
    }
  }

  await Promise.all(executing)
  return results
}

/**
 * リトライ付きバッチ処理
 */
export async function processBatchWithRetry<T, R = void>(
  processor: (item: T) => Promise<R>,
  options: BatchProcessOptions<T> & {
    maxRetries?: number
    retryDelay?: number
  }
): Promise<BatchProcessResult<T, R>> {
  const { maxRetries = 3, retryDelay = 1000, ...batchOptions } = options

  const processorWithRetry = async (item: T): Promise<R> => {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await processor(item)
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
        }
      }
    }

    throw lastError
  }

  return processBatch(processorWithRetry, batchOptions)
}

/**
 * タイムアウト付きバッチ処理
 */
export async function processBatchWithTimeout<T, R = void>(
  processor: (item: T) => Promise<R>,
  options: BatchProcessOptions<T> & {
    timeoutMs?: number
  }
): Promise<BatchProcessResult<T, R>> {
  const { timeoutMs = 30000, ...batchOptions } = options

  const processorWithTimeout = async (item: T): Promise<R> => {
    return Promise.race([
      processor(item),
      new Promise<R>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      )
    ])
  }

  return processBatch(processorWithTimeout, batchOptions)
}

/**
 * 使用例:
 *
 * // SEO更新のバッチ処理
 * const seoUpdateResult = await processBatch(
 *   async (listingId) => {
 *     await updateSEO(listingId)
 *   },
 *   {
 *     items: listingIds,
 *     batchSize: 20,
 *     concurrency: 5,
 *     onProgress: (processed, total) => {
 *       console.log(`Progress: ${processed}/${total}`)
 *     }
 *   }
 * )
 *
 * // メッセージポーリングのバッチ処理（リトライ付き）
 * const messageResult = await processBatchWithRetry(
 *   async (marketplace) => {
 *     return await pollMessages(marketplace)
 *   },
 *   {
 *     items: marketplaces,
 *     batchSize: 5,
 *     concurrency: 3,
 *     maxRetries: 3,
 *     retryDelay: 2000
 *   }
 * )
 */
