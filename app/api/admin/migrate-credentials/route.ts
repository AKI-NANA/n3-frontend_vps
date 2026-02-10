/**
 * P0: 認証情報移行API
 *
 * 環境変数からencrypted_credentialsテーブルへの移行
 * 既存のeBay/メルカリトークンを暗号化DBに保存
 */

import { NextRequest, NextResponse } from 'next/server'
import { CredentialManager } from '@/lib/services/credential-manager'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json().catch(() => ({}))

    // セキュリティ: パスワード確認
    const ADMIN_PASSWORD = process.env.ADMIN_MIGRATION_PASSWORD
    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    console.log('🔄 認証情報の移行を開始...')

    const results: any[] = []

    // ========================================
    // eBay MJT アカウント
    // ========================================
    try {
      const mjtClientId = process.env.EBAY_CLIENT_ID_MJT
      const mjtClientSecret = process.env.EBAY_CLIENT_SECRET_MJT
      const mjtRefreshToken = process.env.EBAY_REFRESH_TOKEN_MJT

      if (mjtClientId && mjtClientSecret && mjtRefreshToken) {
        console.log('📦 eBay MJT アカウントを移行中...')

        await CredentialManager.saveCredential({
          platform: 'ebay',
          account: 'mjt',
          credential_type: 'client_id',
          value: mjtClientId
        })

        await CredentialManager.saveCredential({
          platform: 'ebay',
          account: 'mjt',
          credential_type: 'client_secret',
          value: mjtClientSecret
        })

        await CredentialManager.saveCredential({
          platform: 'ebay',
          account: 'mjt',
          credential_type: 'refresh_token',
          value: mjtRefreshToken,
          expires_at: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000) // 18ヶ月後
        })

        results.push({
          platform: 'ebay',
          account: 'mjt',
          status: 'success',
          credentials: ['client_id', 'client_secret', 'refresh_token']
        })

        console.log('✅ eBay MJT 移行完了')
      } else {
        results.push({
          platform: 'ebay',
          account: 'mjt',
          status: 'skipped',
          reason: '環境変数が未設定'
        })
      }
    } catch (error: any) {
      results.push({
        platform: 'ebay',
        account: 'mjt',
        status: 'error',
        error: error.message
      })
    }

    // ========================================
    // eBay GREEN アカウント
    // ========================================
    try {
      const greenClientId = process.env.EBAY_CLIENT_ID_GREEN
      const greenClientSecret = process.env.EBAY_CLIENT_SECRET_GREEN
      const greenRefreshToken = process.env.EBAY_REFRESH_TOKEN_GREEN

      if (greenClientId && greenClientSecret && greenRefreshToken) {
        console.log('📦 eBay GREEN アカウントを移行中...')

        await CredentialManager.saveCredential({
          platform: 'ebay',
          account: 'green',
          credential_type: 'client_id',
          value: greenClientId
        })

        await CredentialManager.saveCredential({
          platform: 'ebay',
          account: 'green',
          credential_type: 'client_secret',
          value: greenClientSecret
        })

        await CredentialManager.saveCredential({
          platform: 'ebay',
          account: 'green',
          credential_type: 'refresh_token',
          value: greenRefreshToken,
          expires_at: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000) // 18ヶ月後
        })

        results.push({
          platform: 'ebay',
          account: 'green',
          status: 'success',
          credentials: ['client_id', 'client_secret', 'refresh_token']
        })

        console.log('✅ eBay GREEN 移行完了')
      } else {
        results.push({
          platform: 'ebay',
          account: 'green',
          status: 'skipped',
          reason: '環境変数が未設定'
        })
      }
    } catch (error: any) {
      results.push({
        platform: 'ebay',
        account: 'green',
        status: 'error',
        error: error.message
      })
    }

    // ========================================
    // メルカリ
    // ========================================
    try {
      const mercariApiKey = process.env.MERCARI_API_KEY

      if (mercariApiKey) {
        console.log('📦 メルカリ APIキーを移行中...')

        await CredentialManager.saveCredential({
          platform: 'mercari',
          credential_type: 'api_key',
          value: mercariApiKey
        })

        results.push({
          platform: 'mercari',
          status: 'success',
          credentials: ['api_key']
        })

        console.log('✅ メルカリ 移行完了')
      } else {
        results.push({
          platform: 'mercari',
          status: 'skipped',
          reason: '環境変数が未設定'
        })
      }
    } catch (error: any) {
      results.push({
        platform: 'mercari',
        status: 'error',
        error: error.message
      })
    }

    // 統計情報を取得
    const stats = await CredentialManager.getStats()

    console.log('✅ 認証情報の移行が完了しました')

    return NextResponse.json({
      success: true,
      message: '認証情報の移行が完了しました',
      results,
      stats
    })
  } catch (error: any) {
    console.error('❌ 移行エラー:', error)
    return NextResponse.json(
      { error: `移行失敗: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * 認証情報の統計を取得
 */
export async function GET(req: NextRequest) {
  try {
    const stats = await CredentialManager.getStats()
    const expired = await CredentialManager.getExpiredCredentials()

    return NextResponse.json({
      success: true,
      stats,
      expired_count: expired.length,
      expired_credentials: expired.map((c) => ({
        platform: c.platform,
        account: c.account,
        credential_type: c.credential_type,
        expires_at: c.expires_at
      }))
    })
  } catch (error: any) {
    console.error('❌ 統計取得エラー:', error)
    return NextResponse.json(
      { error: `統計取得失敗: ${error.message}` },
      { status: 500 }
    )
  }
}
