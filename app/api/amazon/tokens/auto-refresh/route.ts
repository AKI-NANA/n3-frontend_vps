/**
 * Amazon SP-API トークン自動リフレッシュエンドポイント
 * 
 * POST /api/amazon/tokens/auto-refresh
 * 
 * CRONジョブやVercel Functionsから定期的に呼び出され、
 * 有効期限が近いトークンを自動的にリフレッシュします
 */

import { NextRequest, NextResponse } from 'next/server'
import { amazonTokenManager, type MarketplaceCode } from '@/lib/amazon/sp-api/secure-amazon-token-manager'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Amazon トークン自動リフレッシュ開始...')
    
    // 全アカウントを取得
    const accounts = await amazonTokenManager.getAccounts()
    
    const results: Array<{
      accountId: string
      accountName: string
      marketplace: string
      success: boolean
      message: string
    }> = []

    // 各アカウントのトークンをリフレッシュ
    for (const account of accounts) {
      if (!account.is_active) {
        results.push({
          accountId: account.id,
          accountName: account.account_name,
          marketplace: account.marketplace_id,
          success: false,
          message: 'アカウントが無効です'
        })
        continue
      }

      try {
        // トークン取得（キャッシュが無効な場合は自動リフレッシュ）
        await amazonTokenManager.getAccessToken(account.marketplace_id as MarketplaceCode)
        
        results.push({
          accountId: account.id,
          accountName: account.account_name,
          marketplace: account.marketplace_id,
          success: true,
          message: 'トークンリフレッシュ成功'
        })
      } catch (error: any) {
        results.push({
          accountId: account.id,
          accountName: account.account_name,
          marketplace: account.marketplace_id,
          success: false,
          message: error.message
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    console.log(`✅ トークンリフレッシュ完了: ${successCount}成功, ${failCount}失敗`)

    return NextResponse.json({
      success: true,
      message: `${successCount}件のトークンをリフレッシュしました`,
      stats: {
        total: accounts.length,
        success: successCount,
        failed: failCount
      },
      results
    })
  } catch (error: any) {
    console.error('❌ トークン自動リフレッシュエラー:', error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET: ヘルスチェック用
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Amazon token auto-refresh endpoint is ready',
    timestamp: new Date().toISOString()
  })
}
