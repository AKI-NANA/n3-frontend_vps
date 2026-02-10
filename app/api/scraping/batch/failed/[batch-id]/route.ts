// app/api/scraping/batch/failed/[batchId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface FailedUrlsResponse {
  success: boolean
  batchId?: string
  failedUrls?: Array<{
    url: string
    platform: string
    error: string
    retryCount: number
    insertedAt: string
  }>
  count?: number
  message?: string
}

/**
 * 失敗URL一覧取得API
 * GET /api/scraping/batch/failed/[batchId]
 *
 * クエリパラメータ:
 * - format: 'json' | 'csv' (デフォルト: 'json')
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { batchId: string } }
): Promise<NextResponse> {
  try {
    const { batchId } = params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'

    // ===== 失敗タスクを取得 =====
    const { data: failedTasks, error } = await supabase
      .from('scraping_queue')
      .select('target_url, platform, error_message, retry_count, inserted_at')
      .eq('batch_id', batchId)
      .in('status', ['failed', 'permanently_failed'])
      .order('inserted_at', { ascending: true })

    if (error) {
      throw error
    }

    if (!failedTasks || failedTasks.length === 0) {
      if (format === 'csv') {
        return new NextResponse('', {
          status: 200,
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="failed_urls_${batchId}.csv"`
          }
        })
      }

      return NextResponse.json({
        success: true,
        batchId,
        failedUrls: [],
        count: 0,
        message: '失敗したURLはありません'
      })
    }

    const failedUrls = failedTasks.map(task => ({
      url: task.target_url,
      platform: task.platform,
      error: task.error_message || '不明なエラー',
      retryCount: task.retry_count,
      insertedAt: task.inserted_at
    }))

    // ===== CSV形式で出力 =====
    if (format === 'csv') {
      const csvHeader = 'URL,Platform,Error,Retry Count,Inserted At\n'
      const csvRows = failedUrls.map(item =>
        `"${item.url}","${item.platform}","${item.error}",${item.retryCount},"${item.insertedAt}"`
      ).join('\n')
      const csvContent = csvHeader + csvRows

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="failed_urls_${batchId}_${Date.now()}.csv"`
        }
      })
    }

    // ===== JSON形式で出力 =====
    return NextResponse.json({
      success: true,
      batchId,
      failedUrls,
      count: failedUrls.length
    })

  } catch (error: any) {
    console.error('❌ 失敗URL取得エラー:', error)
    return NextResponse.json({
      success: false,
      message: error.message || '失敗URLの取得に失敗しました'
    }, { status: 500 })
  }
}
