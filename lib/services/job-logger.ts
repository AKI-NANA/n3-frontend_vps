/**
 * UI-4: ジョブ実行ロガー
 *
 * 全同期ジョブの実行状態を job_execution_logs テーブルに記録
 */

import { createClient } from '@/lib/supabase/server'

export type JobType =
  | 'ebay_sync'
  | 'mercari_sync'
  | 'auto_price_reduction'
  | 'inventory_optimization'
  | 'custom'

export type JobStatus = 'running' | 'success' | 'failed' | 'cancelled'

export interface JobExecutionLog {
  id?: string
  job_type: JobType
  job_name: string
  account?: string
  status: JobStatus
  started_at: string
  completed_at?: string
  duration_ms?: number
  total_items?: number
  processed_items?: number
  success_items?: number
  failed_items?: number
  skipped_items?: number
  error_message?: string
  error_stack?: string
  details?: Record<string, any>
  triggered_by?: 'system' | 'manual' | 'cron'
}

/**
 * ジョブ実行ロガー
 */
export class JobLogger {
  /**
   * ジョブ実行を開始
   */
  static async startJob(params: {
    job_type: JobType
    job_name: string
    account?: string
    triggered_by?: 'system' | 'manual' | 'cron'
  }): Promise<string> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('job_execution_logs')
      .insert({
        job_type: params.job_type,
        job_name: params.job_name,
        account: params.account,
        status: 'running',
        started_at: new Date().toISOString(),
        triggered_by: params.triggered_by || 'system'
      })
      .select('id')
      .single()

    if (error) {
      console.error('❌ ジョブログ開始エラー:', error)
      throw new Error(`ジョブログの開始に失敗: ${error.message}`)
    }

    console.log(`📝 ジョブログ開始: ${params.job_name} (ID: ${data.id})`)
    return data.id
  }

  /**
   * ジョブを成功として完了
   */
  static async completeJob(
    jobId: string,
    stats: {
      total_items?: number
      processed_items?: number
      success_items?: number
      failed_items?: number
      skipped_items?: number
      details?: Record<string, any>
    }
  ): Promise<void> {
    const supabase = await createClient()

    const started = await this.getJobStartTime(jobId)
    const duration_ms = started ? Date.now() - new Date(started).getTime() : undefined

    const { error } = await supabase
      .from('job_execution_logs')
      .update({
        status: 'success',
        completed_at: new Date().toISOString(),
        duration_ms,
        ...stats
      })
      .eq('id', jobId)

    if (error) {
      console.error('❌ ジョブログ完了エラー:', error)
      throw new Error(`ジョブログの完了に失敗: ${error.message}`)
    }

    console.log(`✅ ジョブログ完了: ${jobId} (${duration_ms}ms)`)
  }

  /**
   * ジョブを失敗として完了
   */
  static async failJob(
    jobId: string,
    error: Error,
    stats?: {
      total_items?: number
      processed_items?: number
      success_items?: number
      failed_items?: number
      details?: Record<string, any>
    }
  ): Promise<void> {
    const supabase = await createClient()

    const started = await this.getJobStartTime(jobId)
    const duration_ms = started ? Date.now() - new Date(started).getTime() : undefined

    const { error: updateError } = await supabase
      .from('job_execution_logs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        duration_ms,
        error_message: error.message,
        error_stack: error.stack,
        ...stats
      })
      .eq('id', jobId)

    if (updateError) {
      console.error('❌ ジョブログ失敗記録エラー:', updateError)
      throw new Error(`ジョブログの失敗記録に失敗: ${updateError.message}`)
    }

    console.log(`❌ ジョブログ失敗: ${jobId} - ${error.message}`)
  }

  /**
   * ジョブの進捗を更新
   */
  static async updateProgress(
    jobId: string,
    stats: {
      processed_items?: number
      success_items?: number
      failed_items?: number
      skipped_items?: number
    }
  ): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from('job_execution_logs')
      .update(stats)
      .eq('id', jobId)

    if (error) {
      console.error('⚠️ ジョブログ進捗更新エラー:', error)
      // 進捗更新の失敗は致命的ではないので、エラーをスローしない
    }
  }

  /**
   * ジョブの開始時刻を取得
   */
  private static async getJobStartTime(jobId: string): Promise<string | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('job_execution_logs')
      .select('started_at')
      .eq('id', jobId)
      .single()

    if (error || !data) {
      return null
    }

    return data.started_at
  }

  /**
   * 最新のジョブログを取得
   */
  static async getLatestLogs(limit = 50): Promise<JobExecutionLog[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('job_execution_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('❌ ジョブログ取得エラー:', error)
      throw new Error(`ジョブログの取得に失敗: ${error.message}`)
    }

    return data || []
  }

  /**
   * 特定のジョブタイプの最新ログを取得
   */
  static async getLatestLogsByType(
    job_type: JobType,
    limit = 20
  ): Promise<JobExecutionLog[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('job_execution_logs')
      .select('*')
      .eq('job_type', job_type)
      .order('started_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('❌ ジョブログ取得エラー:', error)
      throw new Error(`ジョブログの取得に失敗: ${error.message}`)
    }

    return data || []
  }

  /**
   * 実行中のジョブを取得
   */
  static async getRunningJobs(): Promise<JobExecutionLog[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('job_execution_logs')
      .select('*')
      .eq('status', 'running')
      .order('started_at', { ascending: false })

    if (error) {
      console.error('❌ 実行中ジョブ取得エラー:', error)
      throw new Error(`実行中ジョブの取得に失敗: ${error.message}`)
    }

    return data || []
  }

  /**
   * ジョブ統計を取得
   */
  static async getJobStats(): Promise<{
    total_jobs: number
    running_jobs: number
    success_jobs: number
    failed_jobs: number
    by_type: Record<string, number>
  }> {
    const supabase = await createClient()

    const { data, error } = await supabase.from('job_execution_logs').select('*')

    if (error) {
      console.error('❌ ジョブ統計取得エラー:', error)
      throw new Error(`ジョブ統計の取得に失敗: ${error.message}`)
    }

    const logs = data || []
    const running_jobs = logs.filter((l) => l.status === 'running').length
    const success_jobs = logs.filter((l) => l.status === 'success').length
    const failed_jobs = logs.filter((l) => l.status === 'failed').length

    const by_type: Record<string, number> = {}
    logs.forEach((log) => {
      by_type[log.job_type] = (by_type[log.job_type] || 0) + 1
    })

    return {
      total_jobs: logs.length,
      running_jobs,
      success_jobs,
      failed_jobs,
      by_type
    }
  }
}
