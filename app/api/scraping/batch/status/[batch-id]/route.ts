// app/api/scraping/batch/status/[batchId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface BatchStatusResponse {
  success: boolean
  batch?: {
    id: string
    batchName: string
    totalUrls: number
    processedCount: number
    successCount: number
    failedCount: number
    status: string
    progress: number
    createdAt: string
    startedAt: string | null
    completedAt: string | null
    estimatedTimeRemaining: string | null
  }
  queue?: {
    pending: number
    processing: number
    completed: number
    failed: number
    permanentlyFailed: number
  }
  platformBreakdown?: Record<string, {
    total: number
    completed: number
    failed: number
  }>
  message?: string
}

/**
 * バッチ進捗状況取得API
 * GET /api/scraping/batch/status/[batchId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { batchId: string } }
): Promise<NextResponse<BatchStatusResponse>> {
  try {
    const { batchId } = params

    // ===== ステップ1: バッチ情報取得 =====
    const { data: batch, error: batchError } = await supabase
      .from('scraping_batches')
      .select('*')
      .eq('id', batchId)
      .single()

    if (batchError || !batch) {
      return NextResponse.json({
        success: false,
        message: 'バッチが見つかりません'
      }, { status: 404 })
    }

    // ===== ステップ2: キュー統計取得 =====
    const { data: queueTasks, error: queueError } = await supabase
      .from('scraping_queue')
      .select('status, platform')
      .eq('batch_id', batchId)

    if (queueError) {
      console.error('❌ キュー統計取得エラー:', queueError)
      throw queueError
    }

    const queueStats = {
      pending: queueTasks?.filter(t => t.status === 'pending').length || 0,
      processing: queueTasks?.filter(t => t.status === 'processing').length || 0,
      completed: queueTasks?.filter(t => t.status === 'completed').length || 0,
      failed: queueTasks?.filter(t => t.status === 'failed').length || 0,
      permanentlyFailed: queueTasks?.filter(t => t.status === 'permanently_failed').length || 0
    }

    // ===== ステップ3: プラットフォーム別集計 =====
    const platformBreakdown: Record<string, any> = {}

    queueTasks?.forEach(task => {
      if (!platformBreakdown[task.platform]) {
        platformBreakdown[task.platform] = {
          total: 0,
          completed: 0,
          failed: 0
        }
      }

      platformBreakdown[task.platform].total++

      if (task.status === 'completed') {
        platformBreakdown[task.platform].completed++
      } else if (task.status === 'failed' || task.status === 'permanently_failed') {
        platformBreakdown[task.platform].failed++
      }
    })

    // ===== ステップ4: 進捗計算 =====
    const progress = batch.total_urls > 0
      ? Math.round((batch.processed_count / batch.total_urls) * 100)
      : 0

    // ===== ステップ5: 残り時間推定 =====
    let estimatedTimeRemaining: string | null = null

    if (batch.status === 'processing' && batch.started_at) {
      const startTime = new Date(batch.started_at).getTime()
      const now = Date.now()
      const elapsedMs = now - startTime

      if (batch.processed_count > 0) {
        const avgTimePerTask = elapsedMs / batch.processed_count
        const remainingTasks = batch.total_urls - batch.processed_count
        const remainingMs = avgTimePerTask * remainingTasks

        const minutes = Math.ceil(remainingMs / 60000)
        if (minutes < 60) {
          estimatedTimeRemaining = `約${minutes}分`
        } else {
          const hours = Math.floor(minutes / 60)
          const mins = minutes % 60
          estimatedTimeRemaining = `約${hours}時間${mins}分`
        }
      }
    }

    // ===== レスポンス =====
    return NextResponse.json({
      success: true,
      batch: {
        id: batch.id,
        batchName: batch.batch_name || '名称なし',
        totalUrls: batch.total_urls,
        processedCount: batch.processed_count,
        successCount: batch.success_count,
        failedCount: batch.failed_count,
        status: batch.status,
        progress,
        createdAt: batch.created_at,
        startedAt: batch.started_at,
        completedAt: batch.completed_at,
        estimatedTimeRemaining
      },
      queue: queueStats,
      platformBreakdown
    })

  } catch (error: any) {
    console.error('❌ バッチ状態取得エラー:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'バッチ状態の取得に失敗しました'
    }, { status: 500 })
  }
}
