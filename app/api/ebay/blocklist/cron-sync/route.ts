/**
 * GET /api/ebay/blocklist/cron-sync
 * 定期実行用の自動同期エンドポイント
 *
 * 使用方法:
 * 1. Vercel Cron: vercel.json に設定
 * 2. GitHub Actions: .github/workflows/sync-blocklist.yml
 * 3. その他のcronサービス: このエンドポイントを定期的にGETリクエスト
 *
 * セキュリティ:
 * CRON_SECRET 環境変数を設定し、リクエストヘッダーで検証します
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { syncBlocklistToEbay } from '@/lib/ebay-account-api'
import {
  EbayTokenService,
  BlockedBuyerService,
  SyncHistoryService
} from '@/lib/services/ebay-blocklist-service'
import { syncBlocklistBatch } from '@/lib/concurrency/batch-processor'

export async function GET(request: NextRequest) {
  // セキュリティ: CRON_SECRETで認証
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('Starting scheduled blocklist sync...')

    // 1. アクティブなトークンを持つ全ユーザーを取得
    const { data: tokens, error } = await supabase
      .from('ebay_user_tokens')
      .select('*')
      .eq('is_active', true)

    if (error) {
      throw new Error(`Failed to get active tokens: ${error.message}`)
    }

    if (!tokens || tokens.length === 0) {
      return NextResponse.json({
        message: 'No active tokens found',
        synced: 0,
      })
    }

    // 2. 承認済みの共有ブロックリストを取得
    const sharedBlocklist = await BlockedBuyerService.getApprovedBuyerUsernames()

    if (sharedBlocklist.length === 0) {
      return NextResponse.json({
        message: 'No approved buyers to sync',
        synced: 0,
      })
    }

    console.log(`Found ${tokens.length} active users and ${sharedBlocklist.length} approved buyers`)

    // 3. 各ユーザーのブロックリストを並列同期（P1対応）

    // アクティブで有効なトークンのみをフィルター
    const validTokens = tokens.filter(token => {
      if (EbayTokenService.isTokenExpired(token)) {
        console.log(`Skipping expired token for user ${token.user_id}`)
        return false
      }
      return true
    })

    if (validTokens.length === 0) {
      return NextResponse.json({
        message: 'No valid tokens found for sync',
        synced: 0,
      })
    }

    // バッチ同期実行
    const batchResult = await syncBlocklistBatch(
      validTokens.map(token => ({
        userId: token.user_id,
        accessToken: token.access_token,
        ebayUserId: token.ebay_user_id
      })),
      sharedBlocklist,
      {
        concurrency: 3, // eBay APIのレート制限を考慮
        onProgress: (completed, total) => {
          console.log(`Sync progress: ${completed}/${total}`)
        }
      }
    )

    // 同期履歴を記録
    for (const result of batchResult.results) {
      await SyncHistoryService.recordSync(
        result.userId,
        validTokens.find(t => t.user_id === result.userId)?.ebay_user_id || '',
        'scheduled',
        {
          success: result.success,
          buyersAdded: result.buyersAdded,
          buyersRemoved: 0,
          totalBuyers: result.totalBuyers,
          errors: result.error ? [result.error] : undefined,
          duration: 0
        }
      )

      // 成功した場合は最終同期日時を更新
      if (result.success) {
        const token = validTokens.find(t => t.user_id === result.userId)
        if (token) {
          await EbayTokenService.updateLastSync(token.id)
        }
      }
    }

    const successCount = batchResult.successCount

    return NextResponse.json({
      message: `Sync completed for ${successCount}/${batchResult.results.length} users`,
      synced: successCount,
      total: batchResult.results.length,
      results: batchResult.results,
    })
  } catch (error) {
    console.error('Scheduled sync error:', error)
    return NextResponse.json(
      {
        error: 'Failed to run scheduled sync',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
