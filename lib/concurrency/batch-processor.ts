/**
 * P1: バッチ処理の並列化
 * p-limitを使用したスケーラブルな並列処理
 */

// p-limitの型定義（インストール後に動作）
type LimitFunction = {
  (fn: () => Promise<any>): Promise<any>
  activeCount: number
  pendingCount: number
  clearQueue: () => void
}

/**
 * 並列処理の制限を作成
 * 動的インポートでp-limitを読み込む
 */
export async function createLimit(concurrency: number = 5): Promise<LimitFunction> {
  try {
    // 動的インポート（p-limitがインストールされている場合）
    const pLimit = await import('p-limit')
    return pLimit.default(concurrency)
  } catch (error) {
    console.warn('p-limit not installed, using fallback implementation')
    // フォールバック: 簡易的な実装
    return createSimpleLimit(concurrency)
  }
}

/**
 * 簡易的な並列制限実装（フォールバック）
 */
function createSimpleLimit(concurrency: number): LimitFunction {
  let activeCount = 0
  let pendingCount = 0
  const queue: Array<() => void> = []

  async function limit(fn: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      const execute = async () => {
        activeCount++
        pendingCount--
        try {
          const result = await fn()
          resolve(result)
        } catch (error) {
          reject(error)
        } finally {
          activeCount--
          if (queue.length > 0) {
            const next = queue.shift()
            if (next) next()
          }
        }
      }

      if (activeCount < concurrency) {
        execute()
      } else {
        pendingCount++
        queue.push(execute)
      }
    })
  }

  limit.activeCount = 0
  limit.pendingCount = 0
  limit.clearQueue = () => {
    queue.length = 0
    pendingCount = 0
  }

  return limit as LimitFunction
}

/**
 * バッチ処理を並列実行
 */
export async function processBatch<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  options: {
    concurrency?: number
    onProgress?: (completed: number, total: number) => void
    onError?: (error: Error, item: T, index: number) => void
    continueOnError?: boolean
  } = {}
): Promise<{
  results: R[]
  errors: Array<{ item: T; index: number; error: Error }>
  successCount: number
  errorCount: number
}> {
  const {
    concurrency = 5,
    onProgress,
    onError,
    continueOnError = true
  } = options

  const limit = await createLimit(concurrency)
  const results: R[] = []
  const errors: Array<{ item: T; index: number; error: Error }> = []
  let completed = 0

  const tasks = items.map((item, index) =>
    limit(async () => {
      try {
        const result = await processor(item, index)
        results[index] = result
        completed++
        onProgress?.(completed, items.length)
        return result
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        errors.push({ item, index, error: err })
        onError?.(err, item, index)
        completed++
        onProgress?.(completed, items.length)

        if (!continueOnError) {
          throw error
        }
        return null
      }
    })
  )

  await Promise.all(tasks)

  return {
    results: results.filter(r => r !== null && r !== undefined),
    errors,
    successCount: results.filter(r => r !== null && r !== undefined).length,
    errorCount: errors.length
  }
}

/**
 * eBay ブロックリスト同期の並列化版
 */
export async function syncBlocklistBatch(
  users: Array<{ userId: string; accessToken: string; ebayUserId: string }>,
  sharedBlocklist: string[],
  options: {
    concurrency?: number
    onProgress?: (completed: number, total: number) => void
  } = {}
): Promise<{
  successCount: number
  failCount: number
  results: Array<{
    userId: string
    success: boolean
    buyersAdded: number
    totalBuyers: number
    error?: string
  }>
}> {
  const { syncBlocklistToEbay } = await import('@/lib/ebay-account-api')

  const { results, errors } = await processBatch(
    users,
    async (user, index) => {
      console.log(`Syncing blocklist for user ${index + 1}/${users.length}: ${user.userId}`)

      const syncResult = await syncBlocklistToEbay(user.accessToken, sharedBlocklist)

      return {
        userId: user.userId,
        success: syncResult.success,
        buyersAdded: syncResult.buyersAdded,
        totalBuyers: syncResult.totalBuyers,
        error: syncResult.errors?.join(', ')
      }
    },
    {
      concurrency: options.concurrency || 3, // eBay APIのレート制限を考慮
      onProgress: options.onProgress,
      continueOnError: true
    }
  )

  return {
    successCount: results.filter(r => r.success).length,
    failCount: errors.length,
    results
  }
}

/**
 * 大量データの分割処理
 */
export async function processInChunks<T, R>(
  items: T[],
  processor: (chunk: T[]) => Promise<R[]>,
  chunkSize: number = 100
): Promise<R[]> {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize))
  }

  const results: R[] = []
  for (const chunk of chunks) {
    const chunkResults = await processor(chunk)
    results.push(...chunkResults)
  }

  return results
}

/**
 * リトライ付き処理
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    retryDelay?: number
    backoffMultiplier?: number
    onRetry?: (attempt: number, error: Error) => void
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoffMultiplier = 2,
    onRetry
  } = options

  let lastError: Error
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < maxRetries) {
        const delay = retryDelay * Math.pow(backoffMultiplier, attempt)
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`)
        onRetry?.(attempt + 1, lastError)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

/**
 * タイムアウト付き処理
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    )
  ])
}

/**
 * 並列処理の統計情報
 */
export interface BatchStats {
  totalItems: number
  processedItems: number
  successItems: number
  failedItems: number
  averageTime: number
  totalTime: number
  startTime: number
  endTime?: number
}

/**
 * 統計情報付きバッチ処理
 */
export async function processBatchWithStats<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  options: {
    concurrency?: number
    onProgress?: (stats: BatchStats) => void
  } = {}
): Promise<{
  results: R[]
  errors: Array<{ item: T; index: number; error: Error }>
  stats: BatchStats
}> {
  const startTime = Date.now()
  const stats: BatchStats = {
    totalItems: items.length,
    processedItems: 0,
    successItems: 0,
    failedItems: 0,
    averageTime: 0,
    totalTime: 0,
    startTime
  }

  const { results, errors } = await processBatch(
    items,
    processor,
    {
      concurrency: options.concurrency,
      onProgress: (completed, total) => {
        stats.processedItems = completed
        stats.successItems = completed - errors.length
        stats.failedItems = errors.length
        stats.totalTime = Date.now() - startTime
        stats.averageTime = stats.totalTime / completed

        options.onProgress?.(stats)
      },
      continueOnError: true
    }
  )

  stats.endTime = Date.now()
  stats.totalTime = stats.endTime - startTime

  return { results, errors, stats }
}
