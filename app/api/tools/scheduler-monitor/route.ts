/**
 * UI-4: 統合ジョブ監視API
 *
 * GET: ジョブログと統計情報を取得
 * POST: ジョブを手動実行
 */

import { NextRequest, NextResponse } from 'next/server'
import { JobLogger, JobType } from '@/lib/services/job-logger'

/**
 * ジョブログと統計情報を取得
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const job_type = searchParams.get('job_type') as JobType | null
    const limit = parseInt(searchParams.get('limit') || '50')

    // 統計情報を取得
    const stats = await JobLogger.getJobStats()

    // 実行中のジョブを取得
    const runningJobs = await JobLogger.getRunningJobs()

    // ジョブログを取得
    const logs = job_type
      ? await JobLogger.getLatestLogsByType(job_type, limit)
      : await JobLogger.getLatestLogs(limit)

    return NextResponse.json({
      success: true,
      stats,
      running_jobs: runningJobs,
      logs
    })
  } catch (error: any) {
    console.error('❌ ジョブ監視API エラー:', error)
    return NextResponse.json(
      { error: `ジョブログの取得に失敗: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * ジョブを手動実行
 */
export async function POST(req: NextRequest) {
  try {
    const { job_type, account, force } = await req.json()

    if (!job_type) {
      return NextResponse.json({ error: 'job_typeが必要です' }, { status: 400 })
    }

    console.log(`🚀 手動実行: ${job_type}${account ? ` (${account})` : ''}`)

    // ジョブタイプに応じて適切なAPIを呼び出し
    let result: any

    switch (job_type) {
      case 'ebay_sync':
        result = await executeEbaySync(account || 'mjt', force)
        break

      case 'mercari_sync':
        result = await executeMercariSync(force)
        break

      default:
        return NextResponse.json(
          { error: `未対応のジョブタイプ: ${job_type}` },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      job_type,
      account,
      result
    })
  } catch (error: any) {
    console.error('❌ 手動実行エラー:', error)
    return NextResponse.json(
      { error: `ジョブの手動実行に失敗: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * eBay同期を実行
 */
async function executeEbaySync(account: string, force: boolean = false) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/sync/ebay-to-queue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account, limit: 100, force })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'eBay同期に失敗しました')
  }

  return await response.json()
}

/**
 * メルカリ同期を実行
 */
async function executeMercariSync(force: boolean = false) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/sync/mercari-to-inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ force })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'メルカリ同期に失敗しました')
  }

  return await response.json()
}
