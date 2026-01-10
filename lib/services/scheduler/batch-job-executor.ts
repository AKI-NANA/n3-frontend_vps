/**
 * バッチジョブ並列実行エンジン
 *
 * P1: High Priority - タイムアウトリスク回避
 *
 * このサービスは：
 * - 複数のバッチジョブを並列実行
 * - 各ジョブのタイムアウト設定
 * - エラーハンドリングとリトライ機能
 * - 実行ログの記録
 */

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

/**
 * ジョブステータス
 */
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'timeout' | 'cancelled'

/**
 * ジョブ優先度
 */
export type JobPriority = 'critical' | 'high' | 'medium' | 'low'

/**
 * ジョブ定義
 */
export interface BatchJob<T = any> {
  id: string
  name: string
  description: string
  priority: JobPriority
  timeout_ms: number              // タイムアウト時間（ミリ秒）
  max_retries: number             // 最大リトライ回数
  retry_delay_ms: number          // リトライ間隔（ミリ秒）
  execute: () => Promise<T>       // 実行関数
  onSuccess?: (result: T) => Promise<void>
  onError?: (error: Error) => Promise<void>
  metadata?: Record<string, any>
}

/**
 * ジョブ実行結果
 */
export interface JobResult<T = any> {
  job_id: string
  job_name: string
  status: JobStatus
  result?: T
  error?: string
  started_at: string
  completed_at?: string
  duration_ms?: number
  retry_count: number
  metadata?: Record<string, any>
}

/**
 * バッチ実行結果のサマリー
 */
export interface BatchExecutionSummary {
  total_jobs: number
  successful: number
  failed: number
  timeout: number
  cancelled: number
  total_duration_ms: number
  results: JobResult[]
}

/**
 * BatchJobExecutor クラス
 */
export class BatchJobExecutor {
  private runningJobs: Map<string, AbortController> = new Map()

  /**
   * 単一ジョブを実行（タイムアウト付き）
   */
  private async executeJobWithTimeout<T>(
    job: BatchJob<T>,
    retryCount: number = 0
  ): Promise<JobResult<T>> {
    const startedAt = new Date().toISOString()
    const abortController = new AbortController()
    this.runningJobs.set(job.id, abortController)

    try {
      // タイムアウト設定
      const timeoutId = setTimeout(() => {
        abortController.abort()
      }, job.timeout_ms)

      // ジョブ実行
      const result = await Promise.race([
        job.execute(),
        new Promise<never>((_, reject) => {
          abortController.signal.addEventListener('abort', () => {
            reject(new Error('Job timeout'))
          })
        })
      ])

      clearTimeout(timeoutId)
      this.runningJobs.delete(job.id)

      const completedAt = new Date().toISOString()
      const durationMs = new Date(completedAt).getTime() - new Date(startedAt).getTime()

      // 成功時のコールバック
      if (job.onSuccess) {
        await job.onSuccess(result)
      }

      const jobResult: JobResult<T> = {
        job_id: job.id,
        job_name: job.name,
        status: 'completed',
        result,
        started_at: startedAt,
        completed_at: completedAt,
        duration_ms: durationMs,
        retry_count: retryCount,
        metadata: job.metadata
      }

      // ログを記録
      await this.logJobExecution(jobResult)

      return jobResult
    } catch (error) {
      this.runningJobs.delete(job.id)

      const isTimeout = error instanceof Error && error.message === 'Job timeout'
      const status: JobStatus = isTimeout ? 'timeout' : 'failed'

      // リトライ判定
      if (!isTimeout && retryCount < job.max_retries) {
        console.log(`🔄 リトライ中: ${job.name} (${retryCount + 1}/${job.max_retries})`)
        await new Promise(resolve => setTimeout(resolve, job.retry_delay_ms))
        return this.executeJobWithTimeout(job, retryCount + 1)
      }

      const completedAt = new Date().toISOString()
      const durationMs = new Date(completedAt).getTime() - new Date(startedAt).getTime()

      // エラー時のコールバック
      if (job.onError && error instanceof Error) {
        await job.onError(error)
      }

      const jobResult: JobResult<T> = {
        job_id: job.id,
        job_name: job.name,
        status,
        error: error instanceof Error ? error.message : '不明なエラー',
        started_at: startedAt,
        completed_at: completedAt,
        duration_ms: durationMs,
        retry_count: retryCount,
        metadata: job.metadata
      }

      // ログを記録
      await this.logJobExecution(jobResult)

      return jobResult
    }
  }

  /**
   * 複数ジョブを並列実行
   *
   * @param jobs ジョブリスト
   * @param options 実行オプション
   * @returns 実行結果のサマリー
   */
  async executeParallel<T = any>(
    jobs: BatchJob<T>[],
    options: {
      maxConcurrent?: number        // 最大並列数（デフォルト: 無制限）
      stopOnFirstError?: boolean    // 最初のエラーで停止（デフォルト: false）
      priorityOrder?: boolean        // 優先度順に実行（デフォルト: true）
    } = {}
  ): Promise<BatchExecutionSummary> {
    const {
      maxConcurrent,
      stopOnFirstError = false,
      priorityOrder = true
    } = options

    const batchStartTime = Date.now()

    // 優先度順にソート
    const sortedJobs = priorityOrder
      ? this.sortJobsByPriority(jobs)
      : jobs

    console.log(`🚀 バッチジョブ実行開始: ${sortedJobs.length}件`)

    let results: JobResult<T>[] = []

    if (maxConcurrent) {
      // 並列数制限あり
      results = await this.executeWithConcurrencyLimit(sortedJobs, maxConcurrent, stopOnFirstError)
    } else {
      // 並列数制限なし
      const promises = sortedJobs.map(job => this.executeJobWithTimeout(job))

      if (stopOnFirstError) {
        // 最初のエラーで停止
        results = await Promise.all(promises)
      } else {
        // すべて実行（エラーがあっても続行）
        const settled = await Promise.allSettled(promises)
        results = settled.map(result =>
          result.status === 'fulfilled' ? result.value : this.createFailedResult(result.reason)
        )
      }
    }

    const batchEndTime = Date.now()
    const totalDurationMs = batchEndTime - batchStartTime

    // サマリーを作成
    const summary: BatchExecutionSummary = {
      total_jobs: results.length,
      successful: results.filter(r => r.status === 'completed').length,
      failed: results.filter(r => r.status === 'failed').length,
      timeout: results.filter(r => r.status === 'timeout').length,
      cancelled: results.filter(r => r.status === 'cancelled').length,
      total_duration_ms: totalDurationMs,
      results
    }

    console.log(`✅ バッチジョブ実行完了: ${summary.successful}/${summary.total_jobs}件成功`)
    if (summary.failed > 0) {
      console.log(`❌ 失敗: ${summary.failed}件`)
    }
    if (summary.timeout > 0) {
      console.log(`⏱️ タイムアウト: ${summary.timeout}件`)
    }

    return summary
  }

  /**
   * 並列数制限付き実行
   */
  private async executeWithConcurrencyLimit<T>(
    jobs: BatchJob<T>[],
    maxConcurrent: number,
    stopOnFirstError: boolean
  ): Promise<JobResult<T>[]> {
    const results: JobResult<T>[] = []
    const queue = [...jobs]
    const running: Promise<JobResult<T>>[] = []

    while (queue.length > 0 || running.length > 0) {
      // 並列数まで起動
      while (running.length < maxConcurrent && queue.length > 0) {
        const job = queue.shift()!
        const promise = this.executeJobWithTimeout(job)
        running.push(promise)
      }

      // 1つ完了するまで待機
      const result = await Promise.race(running)
      results.push(result)

      // 完了したジョブを削除
      const index = running.findIndex(p => p === Promise.resolve(result))
      running.splice(index, 1)

      // エラーで停止
      if (stopOnFirstError && (result.status === 'failed' || result.status === 'timeout')) {
        // 残りのジョブをキャンセル
        queue.length = 0
        break
      }
    }

    return results
  }

  /**
   * ジョブを優先度順にソート
   */
  private sortJobsByPriority<T>(jobs: BatchJob<T>[]): BatchJob<T>[] {
    const priorityOrder: Record<JobPriority, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3
    }

    return [...jobs].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }

  /**
   * 失敗結果を作成
   */
  private createFailedResult(error: any): JobResult {
    return {
      job_id: 'unknown',
      job_name: 'unknown',
      status: 'failed',
      error: error instanceof Error ? error.message : '不明なエラー',
      started_at: new Date().toISOString(),
      retry_count: 0
    }
  }

  /**
   * ジョブ実行ログを記録
   */
  private async logJobExecution(result: JobResult): Promise<void> {
    try {
      await supabase.from('job_execution_log').insert({
        job_id: result.job_id,
        job_name: result.job_name,
        status: result.status,
        result: result.result,
        error: result.error,
        started_at: result.started_at,
        completed_at: result.completed_at,
        duration_ms: result.duration_ms,
        retry_count: result.retry_count,
        metadata: result.metadata
      })
    } catch (error) {
      console.error('ジョブログ記録エラー:', error)
    }
  }

  /**
   * 実行中のジョブをキャンセル
   */
  cancelJob(job_id: string): boolean {
    const controller = this.runningJobs.get(job_id)
    if (controller) {
      controller.abort()
      this.runningJobs.delete(job_id)
      console.log(`❌ ジョブをキャンセル: ${job_id}`)
      return true
    }
    return false
  }

  /**
   * すべての実行中ジョブをキャンセル
   */
  cancelAllJobs(): void {
    for (const [job_id, controller] of this.runningJobs.entries()) {
      controller.abort()
      console.log(`❌ ジョブをキャンセル: ${job_id}`)
    }
    this.runningJobs.clear()
  }

  /**
   * 実行中のジョブ数を取得
   */
  getRunningJobCount(): number {
    return this.runningJobs.size
  }
}

/**
 * シングルトンインスタンス
 */
export const batchJobExecutor = new BatchJobExecutor()
