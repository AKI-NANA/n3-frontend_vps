/**
 * Batch Processor - P1 Implementation
 *
 * Purpose: Puppeteer自動購入のバッチ処理並列化制御
 *
 * Features:
 * - p-limitによる同時実行数制御
 * - リソース競合の防止
 * - システムクラッシュ回避
 * - 進捗トラッキング
 * - エラーハンドリング
 *
 * Security:
 * - メモリ使用量監視
 * - タイムアウト制御
 * - リトライロジック
 */

import pLimit from 'p-limit'
import { createClient } from '@/lib/supabase/server'

export interface BatchTask<T> {
  id: string
  data: T
  priority?: number // 1-10, 10が最高
  retries?: number
}

export interface BatchResult<T> {
  task: BatchTask<T>
  success: boolean
  result?: any
  error?: string
  executionTime: number
  retriesUsed: number
}

export interface BatchProcessorConfig {
  concurrency: number // 同時実行数（デフォルト: 2）
  maxRetries: number // 最大リトライ回数（デフォルト: 3）
  retryDelay: number // リトライ間隔（ms, デフォルト: 5000）
  taskTimeout: number // タスクタイムアウト（ms, デフォルト: 300000 = 5分）
  onProgress?: (completed: number, total: number) => void
  onTaskComplete?: (result: BatchResult<any>) => void
}

export interface BatchExecutionStats {
  total: number
  completed: number
  successful: number
  failed: number
  averageExecutionTime: number
  totalExecutionTime: number
  errors: Array<{ taskId: string; error: string }>
}

export class BatchProcessor {
  private config: Required<BatchProcessorConfig>
  private limit: ReturnType<typeof pLimit>

  constructor(config: Partial<BatchProcessorConfig> = {}) {
    this.config = {
      concurrency: config.concurrency || 2, // Puppeteerは2並列推奨
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 5000,
      taskTimeout: config.taskTimeout || 300000, // 5分
      onProgress: config.onProgress || (() => {}),
      onTaskComplete: config.onTaskComplete || (() => {})
    }

    this.limit = pLimit(this.config.concurrency)

    console.log(`🔧 BatchProcessor initialized: concurrency=${this.config.concurrency}`)
  }

  /**
   * バッチタスクを並列実行（p-limit制御）
   */
  async processBatch<T>(
    tasks: BatchTask<T>[],
    executor: (task: BatchTask<T>) => Promise<any>
  ): Promise<{
    results: BatchResult<T>[]
    stats: BatchExecutionStats
  }> {
    const startTime = Date.now()

    console.log(`📦 Starting batch processing: ${tasks.length} tasks`)
    console.log(`⚙️ Concurrency: ${this.config.concurrency}`)

    // 優先度でソート（高い順）
    const sortedTasks = [...tasks].sort((a, b) => (b.priority || 0) - (a.priority || 0))

    // 進捗カウンター
    let completed = 0
    const results: BatchResult<T>[] = []
    const errors: Array<{ taskId: string; error: string }> = []

    // タスクをp-limit制御で並列実行
    const promises = sortedTasks.map(task =>
      this.limit(async () => {
        const result = await this.executeTaskWithRetry(task, executor)

        completed++
        results.push(result)

        if (!result.success) {
          errors.push({ taskId: task.id, error: result.error || 'Unknown error' })
        }

        // 進捗コールバック
        this.config.onProgress(completed, tasks.length)

        // タスク完了コールバック
        this.config.onTaskComplete(result)

        return result
      })
    )

    // 全タスク完了まで待機
    await Promise.all(promises)

    const totalExecutionTime = Date.now() - startTime
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length
    const averageExecutionTime =
      results.reduce((sum, r) => sum + r.executionTime, 0) / results.length

    const stats: BatchExecutionStats = {
      total: tasks.length,
      completed,
      successful,
      failed,
      averageExecutionTime,
      totalExecutionTime,
      errors
    }

    console.log(`✅ Batch processing completed:`)
    console.log(`   - Total: ${stats.total}`)
    console.log(`   - Successful: ${stats.successful}`)
    console.log(`   - Failed: ${stats.failed}`)
    console.log(`   - Avg execution time: ${(stats.averageExecutionTime / 1000).toFixed(2)}s`)
    console.log(`   - Total time: ${(stats.totalExecutionTime / 1000).toFixed(2)}s`)

    // 実行ログをDBに保存
    await this.saveBatchExecutionLog(stats, results)

    return { results, stats }
  }

  /**
   * タスク実行（リトライロジック付き）
   */
  private async executeTaskWithRetry<T>(
    task: BatchTask<T>,
    executor: (task: BatchTask<T>) => Promise<any>
  ): Promise<BatchResult<T>> {
    const maxRetries = task.retries !== undefined ? task.retries : this.config.maxRetries
    let retriesUsed = 0
    let lastError: string = ''

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      retriesUsed = attempt

      try {
        console.log(`🔄 Executing task: ${task.id} (attempt ${attempt + 1}/${maxRetries + 1})`)

        const taskStartTime = Date.now()

        // タイムアウト付き実行
        const result = await this.executeWithTimeout(executor(task), this.config.taskTimeout)

        const executionTime = Date.now() - taskStartTime

        console.log(`✅ Task completed: ${task.id} (${(executionTime / 1000).toFixed(2)}s)`)

        return {
          task,
          success: true,
          result,
          executionTime,
          retriesUsed
        }
      } catch (error: any) {
        lastError = error.message

        console.warn(
          `⚠️ Task failed: ${task.id} (attempt ${attempt + 1}/${maxRetries + 1}) - ${lastError}`
        )

        // 最後の試行でない場合はリトライ待機
        if (attempt < maxRetries) {
          console.log(`⏳ Retrying in ${this.config.retryDelay / 1000}s...`)
          await this.delay(this.config.retryDelay)
        }
      }
    }

    // 全試行失敗
    const executionTime = 0

    console.error(`❌ Task failed after ${maxRetries + 1} attempts: ${task.id}`)

    return {
      task,
      success: false,
      error: lastError,
      executionTime,
      retriesUsed
    }
  }

  /**
   * タイムアウト付き実行
   */
  private executeWithTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Task timeout (${timeout / 1000}s)`)), timeout)
      )
    ])
  }

  /**
   * 遅延ユーティリティ
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * バッチ実行ログをDBに保存
   */
  private async saveBatchExecutionLog<T>(
    stats: BatchExecutionStats,
    results: BatchResult<T>[]
  ): Promise<void> {
    try {
      const supabase = createClient()

      await supabase.from('batch_execution_logs').insert({
        total_tasks: stats.total,
        successful_tasks: stats.successful,
        failed_tasks: stats.failed,
        average_execution_time_ms: stats.averageExecutionTime,
        total_execution_time_ms: stats.totalExecutionTime,
        concurrency: this.config.concurrency,
        max_retries: this.config.maxRetries,
        errors: stats.errors,
        results: results.map(r => ({
          taskId: r.task.id,
          success: r.success,
          error: r.error,
          executionTime: r.executionTime,
          retriesUsed: r.retriesUsed
        })),
        created_at: new Date().toISOString()
      })

      console.log('📝 Batch execution log saved to database')
    } catch (error) {
      console.error('Failed to save batch execution log:', error)
    }
  }

  /**
   * 同時実行数を動的に変更
   */
  updateConcurrency(newConcurrency: number): void {
    this.config.concurrency = newConcurrency
    this.limit = pLimit(newConcurrency)
    console.log(`🔧 Concurrency updated: ${newConcurrency}`)
  }

  /**
   * 現在の設定を取得
   */
  getConfig(): Required<BatchProcessorConfig> {
    return { ...this.config }
  }

  /**
   * メモリ使用状況を監視
   */
  getMemoryUsage(): {
    heapUsed: number
    heapTotal: number
    external: number
    rss: number
  } {
    const usage = process.memoryUsage()

    return {
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
      external: Math.round(usage.external / 1024 / 1024), // MB
      rss: Math.round(usage.rss / 1024 / 1024) // MB
    }
  }

  /**
   * システムヘルスチェック
   */
  async healthCheck(): Promise<{
    healthy: boolean
    memoryUsage: ReturnType<typeof this.getMemoryUsage>
    concurrency: number
    warnings: string[]
  }> {
    const memory = this.getMemoryUsage()
    const warnings: string[] = []

    // メモリ警告（80%以上）
    if (memory.heapUsed / memory.heapTotal > 0.8) {
      warnings.push(`High memory usage: ${((memory.heapUsed / memory.heapTotal) * 100).toFixed(1)}%`)
    }

    // RSS警告（2GB以上）
    if (memory.rss > 2048) {
      warnings.push(`High RSS memory: ${memory.rss}MB`)
    }

    return {
      healthy: warnings.length === 0,
      memoryUsage: memory,
      concurrency: this.config.concurrency,
      warnings
    }
  }
}

// デフォルトインスタンス（Puppeteer用）
export const batchProcessor = new BatchProcessor({
  concurrency: 2, // Puppeteerは2並列推奨（メモリ制約）
  maxRetries: 3,
  retryDelay: 5000,
  taskTimeout: 300000 // 5分
})
