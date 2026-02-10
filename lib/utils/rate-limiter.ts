/**
 * レート制限ユーティリティ
 * スクレイピング時のレート制限対策として、ランダムな遅延を挿入
 */

/**
 * ランダムな遅延を実行（レート制限対策）
 * @param minMs 最小遅延時間（ミリ秒）
 * @param maxMs 最大遅延時間（ミリ秒）
 * @returns Promise<void>
 */
export async function randomDelay(minMs: number, maxMs: number): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
  console.log(`⏰ レート制限対策: ${delay}ms 待機中...`)
  await new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * 固定遅延を実行
 * @param ms 遅延時間（ミリ秒）
 * @returns Promise<void>
 */
export async function fixedDelay(ms: number): Promise<void> {
  console.log(`⏰ 固定遅延: ${ms}ms 待機中...`)
  await new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * リトライ処理を実行（指数バックオフ付き）
 * @param fn 実行する関数
 * @param maxRetries 最大リトライ回数
 * @param retryDelayMs 初期リトライ遅延（ミリ秒）
 * @returns Promise<T>
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  retryDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt < maxRetries) {
        const delay = retryDelayMs * Math.pow(2, attempt)
        console.log(`🔄 リトライ ${attempt + 1}/${maxRetries}: ${delay}ms 後に再試行...`)
        await fixedDelay(delay)
      }
    }
  }

  throw lastError || new Error('リトライ失敗')
}

/**
 * スクレイピング用のデフォルトレート制限設定
 */
export const SCRAPING_RATE_LIMITS = {
  // ランダム遅延の範囲（3~7秒）
  MIN_DELAY_MS: 3000,
  MAX_DELAY_MS: 7000,

  // リトライ設定
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 2000,

  // 並列実行制限（p-limitで使用）
  MAX_CONCURRENT: 5
} as const
