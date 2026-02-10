/**
 * トークン移行API
 * P0: 認証情報暗号化システム
 *
 * 機能:
 * - 環境変数からDBへのトークン移行
 * - セキュリティ: 管理者のみアクセス可能
 */

import { NextRequest, NextResponse } from 'next/server'
import { migrateTokensFromEnv } from '@/lib/secure-token-manager'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/admin/migrate-tokens
 * 環境変数からDBにトークンを移行
 *
 * ⚠️ セキュリティ警告:
 * - この API は本番環境では無効化することを推奨します
 * - 初回セットアップ時のみ実行してください
 * - 実行後は環境変数からトークンを削除してください
 */
export async function POST(request: NextRequest) {
  try {
    // 🔐 セキュリティチェック: 管理者パスワード確認
    const { password } = await request.json()

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin-secret-123'

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: '管理者パスワードが正しくありません' },
        { status: 403 }
      )
    }

    console.log('🔐 管理者認証成功')
    console.log('🔄 トークン移行を開始します...')

    // トークン移行実行
    await migrateTokensFromEnv()

    console.log('✅ トークン移行が完了しました')

    return NextResponse.json({
      success: true,
      message: 'トークン移行が完了しました。\n\n' +
        '⚠️ 次のステップ:\n' +
        '1. .env.local から以下の環境変数を削除してください:\n' +
        '   - EBAY_CLIENT_ID_MJT, EBAY_CLIENT_SECRET_MJT, EBAY_REFRESH_TOKEN_MJT\n' +
        '   - EBAY_CLIENT_ID_GREEN, EBAY_CLIENT_SECRET_GREEN, EBAY_REFRESH_TOKEN_GREEN\n' +
        '2. このAPIエンドポイント（/api/admin/migrate-tokens）を無効化してください\n' +
        '3. アプリケーションを再起動してください'
    })

  } catch (error: any) {
    console.error('❌ トークン移行エラー:', error)
    return NextResponse.json(
      {
        error: 'トークン移行に失敗しました',
        details: error.message
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/migrate-tokens
 * 移行ステータスの確認
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // api_tokensテーブルのトークン数を取得
    const { data, error } = await supabase
      .from('api_tokens')
      .select('id, marketplace, account_name, token_type, is_active', { count: 'exact' })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'トークンステータス',
      totalTokens: data?.length || 0,
      tokens: data || []
    })

  } catch (error: any) {
    console.error('❌ ステータス取得エラー:', error)
    return NextResponse.json(
      {
        error: 'ステータス取得に失敗しました',
        details: error.message
      },
      { status: 500 }
    )
  }
}
