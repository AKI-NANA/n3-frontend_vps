/**
 * スケジューラーサービス
 *
 * P1: High Priority - 定期的なバッチジョブの管理
 *
 * このサービスは：
 * - Cronスケジュールに基づくジョブ実行
 * - ジョブの有効化/無効化
 * - 実行履歴の記録
 */

import { batchJobExecutor, BatchJob, BatchExecutionSummary } from './batch-job-executor'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

/**
 * スケジュールされたジョブの定義
 */
export interface ScheduledJob {
  id: string
  name: string
  description: string
  cron_schedule: string           // Cron形式のスケジュール
  is_enabled: boolean
  last_run_at?: string
  next_run_at?: string
  last_status?: 'success' | 'failed' | 'timeout'
  last_error?: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

/**
 * ジョブ実行履歴
 */
export interface JobExecutionHistory {
  id: string
  scheduled_job_id: string
  started_at: string
  completed_at: string
  duration_ms: number
  status: 'success' | 'failed' | 'timeout'
  summary: BatchExecutionSummary
  error?: string
}

/**
 * SchedulerService クラス
 */
export class SchedulerService {
  private intervals: Map<string, NodeJS.Timeout> = new Map()

  /**
   * スケジュールされたジョブを登録
   */
  async registerScheduledJob(
    name: string,
    description: string,
    cronSchedule: string,
    jobFactory: () => BatchJob[],
    metadata?: Record<string, any>
  ): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('scheduled_jobs')
        .insert({
          name,
          description,
          cron_schedule: cronSchedule,
          is_enabled: true,
          metadata
        })
        .select()
        .single()

      if (error) {
        console.error('スケジュールジョブ登録エラー:', error)
        throw error
      }

      console.log(`✅ スケジュールジョブを登録: ${name}`)
      return data.id
    } catch (error) {
      console.error('スケジュールジョブ登録エラー:', error)
      throw error
    }
  }

  /**
   * ジョブを手動実行
   */
  async executeJob(scheduledJobId: string, jobFactory: () => BatchJob[]): Promise<BatchExecutionSummary> {
    const startedAt = new Date()

    try {
      console.log(`🚀 ジョブを手動実行: ${scheduledJobId}`)

      // ジョブを実行
      const jobs = jobFactory()
      const summary = await batchJobExecutor.executeParallel(jobs, {
        maxConcurrent: 10,
        stopOnFirstError: false,
        priorityOrder: true
      })

      const completedAt = new Date()
      const durationMs = completedAt.getTime() - startedAt.getTime()

      // 実行履歴を記録
      await this.recordExecutionHistory(
        scheduledJobId,
        startedAt.toISOString(),
        completedAt.toISOString(),
        durationMs,
        summary.failed === 0 && summary.timeout === 0 ? 'success' : 'failed',
        summary
      )

      // スケジュールジョブの最終実行日時を更新
      await this.updateLastRunTime(scheduledJobId, completedAt.toISOString(), summary.failed === 0 ? 'success' : 'failed')

      return summary
    } catch (error) {
      const completedAt = new Date()
      const durationMs = completedAt.getTime() - startedAt.getTime()

      // エラーを記録
      await this.recordExecutionHistory(
        scheduledJobId,
        startedAt.toISOString(),
        completedAt.toISOString(),
        durationMs,
        'failed',
        {
          total_jobs: 0,
          successful: 0,
          failed: 0,
          timeout: 0,
          cancelled: 0,
          total_duration_ms: durationMs,
          results: []
        },
        error instanceof Error ? error.message : '不明なエラー'
      )

      throw error
    }
  }

  /**
   * 実行履歴を記録
   */
  private async recordExecutionHistory(
    scheduledJobId: string,
    startedAt: string,
    completedAt: string,
    durationMs: number,
    status: 'success' | 'failed' | 'timeout',
    summary: BatchExecutionSummary,
    error?: string
  ): Promise<void> {
    try {
      await supabase.from('job_execution_history').insert({
        scheduled_job_id: scheduledJobId,
        started_at: startedAt,
        completed_at: completedAt,
        duration_ms: durationMs,
        status,
        summary,
        error
      })
    } catch (error) {
      console.error('実行履歴記録エラー:', error)
    }
  }

  /**
   * 最終実行日時を更新
   */
  private async updateLastRunTime(
    scheduledJobId: string,
    lastRunAt: string,
    lastStatus: 'success' | 'failed' | 'timeout'
  ): Promise<void> {
    try {
      await supabase
        .from('scheduled_jobs')
        .update({
          last_run_at: lastRunAt,
          last_status: lastStatus
        })
        .eq('id', scheduledJobId)
    } catch (error) {
      console.error('最終実行日時更新エラー:', error)
    }
  }

  /**
   * すべてのアクティブなスケジュールジョブを取得
   */
  async getActiveScheduledJobs(): Promise<ScheduledJob[]> {
    try {
      const { data, error } = await supabase
        .from('scheduled_jobs')
        .select('*')
        .eq('is_enabled', true)
        .order('name', { ascending: true })

      if (error) {
        console.error('スケジュールジョブ取得エラー:', error)
        return []
      }

      return (data || []) as ScheduledJob[]
    } catch (error) {
      console.error('スケジュールジョブ取得エラー:', error)
      return []
    }
  }

  /**
   * ジョブを有効化/無効化
   */
  async toggleJobEnabled(scheduledJobId: string, enabled: boolean): Promise<void> {
    try {
      await supabase
        .from('scheduled_jobs')
        .update({ is_enabled: enabled })
        .eq('id', scheduledJobId)

      console.log(`${enabled ? '✅' : '⏸️'} ジョブを${enabled ? '有効化' : '無効化'}: ${scheduledJobId}`)
    } catch (error) {
      console.error('ジョブ有効化/無効化エラー:', error)
      throw error
    }
  }

  /**
   * ジョブの実行履歴を取得
   */
  async getExecutionHistory(
    scheduledJobId: string,
    limit: number = 50
  ): Promise<JobExecutionHistory[]> {
    try {
      const { data, error } = await supabase
        .from('job_execution_history')
        .select('*')
        .eq('scheduled_job_id', scheduledJobId)
        .order('started_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('実行履歴取得エラー:', error)
        return []
      }

      return (data || []) as JobExecutionHistory[]
    } catch (error) {
      console.error('実行履歴取得エラー:', error)
      return []
    }
  }

  /**
   * すべてのスケジュールジョブの実行状況を取得
   */
  async getAllJobStatus(): Promise<ScheduledJob[]> {
    try {
      const { data, error } = await supabase
        .from('scheduled_jobs')
        .select('*')
        .order('last_run_at', { ascending: false, nullsFirst: false })

      if (error) {
        console.error('ジョブ状況取得エラー:', error)
        return []
      }

      return (data || []) as ScheduledJob[]
    } catch (error) {
      console.error('ジョブ状況取得エラー:', error)
      return []
    }
  }

  /**
   * ジョブを削除
   */
  async deleteScheduledJob(scheduledJobId: string): Promise<void> {
    try {
      await supabase
        .from('scheduled_jobs')
        .delete()
        .eq('id', scheduledJobId)

      console.log(`🗑️ ジョブを削除: ${scheduledJobId}`)
    } catch (error) {
      console.error('ジョブ削除エラー:', error)
      throw error
    }
  }
}

/**
 * シングルトンインスタンス
 */
export const schedulerService = new SchedulerService()
