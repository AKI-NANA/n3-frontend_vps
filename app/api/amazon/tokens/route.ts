/**
 * Amazon SP-API トークン管理エンドポイント
 * 
 * GET /api/amazon/tokens - 全アカウント一覧
 * POST /api/amazon/tokens - 新規アカウント登録
 * DELETE /api/amazon/tokens - アカウント削除
 */

import { NextRequest, NextResponse } from 'next/server'
import { amazonTokenManager, AMAZON_MARKETPLACES, type MarketplaceCode } from '@/lib/amazon/sp-api/secure-amazon-token-manager'

/**
 * GET: アカウント一覧取得
 */
export async function GET(request: NextRequest) {
  try {
    const accounts = await amazonTokenManager.getAccounts()
    
    // 機密情報を除去してレスポンス
    const safeAccounts = accounts.map(account => ({
      id: account.id,
      account_name: account.account_name,
      seller_id: account.seller_id,
      marketplace_id: account.marketplace_id,
      marketplace_name: account.marketplace_name,
      region: account.region,
      is_active: account.is_active,
      last_auth_at: account.last_auth_at,
      created_at: account.created_at,
      updated_at: account.updated_at,
      // トークン状態
      token_status: account.access_token_expires_at 
        ? (new Date(account.access_token_expires_at) > new Date() ? 'valid' : 'expired')
        : 'unknown',
      token_expires_at: account.access_token_expires_at
    }))

    return NextResponse.json({
      success: true,
      tokens: safeAccounts,
      count: safeAccounts.length
    })
  } catch (error: any) {
    console.error('❌ アカウント一覧取得エラー:', error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST: 新規アカウント登録（手動登録用）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      accountName,
      sellerId,
      marketplaceId,
      clientId,
      clientSecret,
      refreshToken
    } = body

    // バリデーション
    if (!accountName || !sellerId || !marketplaceId || !refreshToken) {
      return NextResponse.json(
        { success: false, error: '必須フィールドが不足しています' },
        { status: 400 }
      )
    }

    // マーケットプレイス確認
    if (!AMAZON_MARKETPLACES[marketplaceId as MarketplaceCode]) {
      return NextResponse.json(
        { success: false, error: `無効なマーケットプレイス: ${marketplaceId}` },
        { status: 400 }
      )
    }

    // 認証情報（指定がなければ環境変数から取得）
    const finalClientId = clientId || process.env.AMAZON_CLIENT_ID || process.env.NEXT_PUBLIC_LWA_CLIENT_ID || ''
    const finalClientSecret = clientSecret || process.env.AMAZON_CLIENT_SECRET || process.env.LWA_CLIENT_SECRET || ''

    if (!finalClientId || !finalClientSecret) {
      return NextResponse.json(
        { success: false, error: 'Client ID と Client Secret が必要です' },
        { status: 400 }
      )
    }

    const result = await amazonTokenManager.registerAccount({
      accountName,
      sellerId,
      marketplaceId: marketplaceId as MarketplaceCode,
      clientId: finalClientId,
      clientSecret: finalClientSecret,
      refreshToken
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      accountId: result.accountId,
      message: 'アカウントを登録しました'
    })
  } catch (error: any) {
    console.error('❌ アカウント登録エラー:', error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE: アカウント削除
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')

    if (!accountId) {
      return NextResponse.json(
        { success: false, error: 'アカウントIDが必要です' },
        { status: 400 }
      )
    }

    const result = await amazonTokenManager.deleteAccount(accountId)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'アカウントを削除しました'
    })
  } catch (error: any) {
    console.error('❌ アカウント削除エラー:', error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * PATCH: アカウントステータス更新
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountId, isActive } = body

    if (!accountId || isActive === undefined) {
      return NextResponse.json(
        { success: false, error: 'accountId と isActive が必要です' },
        { status: 400 }
      )
    }

    const result = await amazonTokenManager.toggleAccountStatus(accountId, isActive)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `アカウントを${isActive ? '有効' : '無効'}にしました`
    })
  } catch (error: any) {
    console.error('❌ アカウントステータス更新エラー:', error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
