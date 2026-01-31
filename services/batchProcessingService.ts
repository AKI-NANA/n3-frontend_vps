// services/batchProcessingService.ts
// P1: バッチ処理の並列化サービス

import pLimit from 'p-limit'

/**
 * バッチ処理の設定
 */
export interface BatchConfig {
  concurrency?: number // 同時実行数（デフォルト: 5）
  timeout?: number // タイムアウト時間（ミリ秒、デフォルト: 30000）
  retryCount?: number // リトライ回数（デフォルト: 3）
  retryDelay?: number // リトライ間隔（ミリ秒、デフォルト: 1000）
  onProgress?: (completed: number, total: number) => void // 進捗コールバック
  onError?: (error: Error, item: any) => void // エラーコールバック
}

/**
 * バッチ処理の結果
 */
export interface BatchResult<T> {
  success: boolean
  results: T[]
  errors: Array<{ item: any; error: Error }>
  successCount: number
  errorCount: number
  totalCount: number
  duration: number // 処理時間（ミリ秒）
}

/**
 * バッチ処理を並列化して実行
 */
export async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  config: BatchConfig = {}
): Promise<BatchResult<R>> {
  const {
    concurrency = 5,
    timeout = 30000,
    retryCount = 3,
    retryDelay = 1000,
    onProgress,
    onError,
  } = config

  const limit = pLimit(concurrency)
  const results: R[] = []
  const errors: Array<{ item: T; error: Error }> = []
  let completed = 0
  const startTime = Date.now()

  // タイムアウト付きの処理実行
  const executeWithTimeout = async (item: T): Promise<R | null> => {
    return Promise.race([
      processor(item),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeout)
      ),
    ])
  }

  // リトライ付きの処理実行
  const executeWithRetry = async (item: T): Promise<R | null> => {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        return await executeWithTimeout(item)
      } catch (error: any) {
        lastError = error

        if (attempt < retryCount) {
          // リトライ前に待機
          await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)))
        }
      }
    }

    // 全てのリトライが失敗した場合
    if (lastError) {
      errors.push({ item, error: lastError })
      if (onError) {
        onError(lastError, item)
      }
    }

    return null
  }

  // 並列処理を実行
  const promises = items.map((item) =>
    limit(async () => {
      const result = await executeWithRetry(item)
      completed++

      if (onProgress) {
        onProgress(completed, items.length)
      }

      return result
    })
  )

  const allResults = await Promise.all(promises)

  // null以外の結果を収集
  results.push(...allResults.filter((r): r is R => r !== null))

  const duration = Date.now() - startTime

  return {
    success: errors.length === 0,
    results,
    errors,
    successCount: results.length,
    errorCount: errors.length,
    totalCount: items.length,
    duration,
  }
}

/**
 * チャンク単位でバッチ処理を実行
 */
export async function processBatchInChunks<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  chunkSize: number = 100,
  config: BatchConfig = {}
): Promise<BatchResult<R>> {
  const allResults: R[] = []
  const allErrors: Array<{ item: T; error: Error }> = []
  let totalCompleted = 0
  const startTime = Date.now()

  // チャンクに分割
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize))
  }

  // チャンクごとに処理
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]

    const chunkResult = await processBatch(chunk, processor, {
      ...config,
      onProgress: (completed, total) => {
        const overallCompleted = totalCompleted + completed
        if (config.onProgress) {
          config.onProgress(overallCompleted, items.length)
        }
      },
    })

    allResults.push(...chunkResult.results)
    allErrors.push(...chunkResult.errors)
    totalCompleted += chunk.length
  }

  const duration = Date.now() - startTime

  return {
    success: allErrors.length === 0,
    results: allResults,
    errors: allErrors,
    successCount: allResults.length,
    errorCount: allErrors.length,
    totalCount: items.length,
    duration,
  }
}

/**
 * SEO更新のバッチ処理
 */
export async function batchUpdateSEO(
  productIds: string[],
  updateFn: (productId: string) => Promise<void>
): Promise<BatchResult<void>> {
  return processBatch(
    productIds,
    async (productId) => {
      await updateFn(productId)
    },
    {
      concurrency: 10, // 同時10件まで
      timeout: 60000, // 60秒タイムアウト
      retryCount: 3,
      onProgress: (completed, total) => {
        console.log(`SEO更新進捗: ${completed}/${total}`)
      },
      onError: (error, productId) => {
        console.error(`SEO更新エラー (Product ID: ${productId}):`, error)
      },
    }
  )
}

/**
 * メッセージポーリングのバッチ処理
 */
export async function batchPollMessages(
  marketplaces: string[],
  pollFn: (marketplace: string) => Promise<any>
): Promise<BatchResult<any>> {
  return processBatch(
    marketplaces,
    async (marketplace) => {
      return await pollFn(marketplace)
    },
    {
      concurrency: 8, // 同時8マーケットプレイスまで
      timeout: 120000, // 120秒タイムアウト
      retryCount: 2,
      onProgress: (completed, total) => {
        console.log(`メッセージポーリング進捗: ${completed}/${total}`)
      },
      onError: (error, marketplace) => {
        console.error(`メッセージポーリングエラー (${marketplace}):`, error)
      },
    }
  )
}

/**
 * 価格更新のバッチ処理
 */
export async function batchUpdatePrices(
  products: Array<{ id: string; marketplace: string }>,
  updateFn: (product: { id: string; marketplace: string }) => Promise<void>
): Promise<BatchResult<void>> {
  return processBatchInChunks(
    products,
    async (product) => {
      await updateFn(product)
    },
    50, // 50件ずつ処理
    {
      concurrency: 5,
      timeout: 30000,
      retryCount: 3,
      onProgress: (completed, total) => {
        console.log(`価格更新進捗: ${completed}/${total}`)
      },
      onError: (error, product) => {
        console.error(`価格更新エラー (Product: ${product.id}):`, error)
      },
    }
  )
}

/**
 * 在庫同期のバッチ処理
 */
export async function batchSyncInventory(
  skus: string[],
  syncFn: (sku: string) => Promise<void>
): Promise<BatchResult<void>> {
  return processBatch(
    skus,
    async (sku) => {
      await syncFn(sku)
    },
    {
      concurrency: 15, // 同時15件まで
      timeout: 45000, // 45秒タイムアウト
      retryCount: 2,
      onProgress: (completed, total) => {
        console.log(`在庫同期進捗: ${completed}/${total}`)
      },
      onError: (error, sku) => {
        console.error(`在庫同期エラー (SKU: ${sku}):`, error)
      },
    }
  )
}

/**
 * 画像処理のバッチ処理
 */
export async function batchProcessImages(
  imageUrls: string[],
  processFn: (imageUrl: string) => Promise<string>
): Promise<BatchResult<string>> {
  return processBatchInChunks(
    imageUrls,
    async (imageUrl) => {
      return await processFn(imageUrl)
    },
    20, // 20件ずつ処理
    {
      concurrency: 3, // 画像処理は重いので同時3件まで
      timeout: 90000, // 90秒タイムアウト
      retryCount: 2,
      onProgress: (completed, total) => {
        console.log(`画像処理進捗: ${completed}/${total}`)
      },
      onError: (error, imageUrl) => {
        console.error(`画像処理エラー (${imageUrl}):`, error)
      },
    }
  )
}

/**
 * 汎用バッチ処理（カスタム設定）
 */
export async function customBatchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  options: {
    name?: string
    chunkSize?: number
    config?: BatchConfig
  } = {}
): Promise<BatchResult<R>> {
  const { name = 'バッチ処理', chunkSize, config = {} } = options

  console.log(`${name}開始: ${items.length}件`)

  const result = chunkSize
    ? await processBatchInChunks(items, processor, chunkSize, config)
    : await processBatch(items, processor, config)

  console.log(`${name}完了:`, {
    成功: result.successCount,
    失敗: result.errorCount,
    処理時間: `${(result.duration / 1000).toFixed(2)}秒`,
  })

  return result
}
