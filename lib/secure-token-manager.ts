/**
 * 暗号化トークン管理サービス
 * P0: 認証情報暗号化システム
 *
 * 機能:
 * - Supabase pgsodiumを使用した暗号化トークンの管理
 * - マーケットプレイス別・アカウント別のトークン取得
 * - トークンの自動キャッシング
 * - 環境変数からの移行サポート
 */

import { createClient } from '@/lib/supabase/server'

export type Marketplace = 'ebay' | 'mercari' | 'yahoo' | 'rakuten' | 'amazon'
export type TokenType = 'client_id' | 'client_secret' | 'refresh_token' | 'access_token'

export interface TokenCredentials {
  clientId?: string
  clientSecret?: string
  refreshToken?: string
  accessToken?: string
}

/**
 * 暗号化されたトークンをDBから取得
 */
export async function getDecryptedToken(
  marketplace: Marketplace,
  accountName: string,
  tokenType: TokenType
): Promise<string | null> {
  try {
    const supabase = await createClient()

    // get_decrypted_token SQL関数を呼び出し
    const { data, error } = await supabase.rpc('get_decrypted_token', {
      p_marketplace: marketplace,
      p_account_name: accountName,
      p_token_type: tokenType
    })

    if (error) {
      console.error(`[SecureToken] トークン取得エラー:`, error)
      return null
    }

    return data as string
  } catch (error) {
    console.error(`[SecureToken] 予期しないエラー:`, error)
    return null
  }
}

/**
 * トークンを暗号化してDBに保存
 */
export async function insertEncryptedToken(
  marketplace: Marketplace,
  accountName: string,
  tokenType: TokenType,
  tokenPlaintext: string,
  description?: string,
  expiresAt?: Date
): Promise<string | null> {
  try {
    const supabase = await createClient()

    // insert_encrypted_token SQL関数を呼び出し
    const { data, error } = await supabase.rpc('insert_encrypted_token', {
      p_marketplace: marketplace,
      p_account_name: accountName,
      p_token_type: tokenType,
      p_token_plaintext: tokenPlaintext,
      p_description: description || null,
      p_expires_at: expiresAt?.toISOString() || null,
      p_created_by: 'system'
    })

    if (error) {
      console.error(`[SecureToken] トークン保存エラー:`, error)
      return null
    }

    return data as string // UUID
  } catch (error) {
    console.error(`[SecureToken] 予期しないエラー:`, error)
    return null
  }
}

/**
 * トークンを更新
 */
export async function updateEncryptedToken(
  marketplace: Marketplace,
  accountName: string,
  tokenType: TokenType,
  tokenPlaintext: string
): Promise<boolean> {
  try {
    const supabase = await createClient()

    // update_encrypted_token SQL関数を呼び出し
    const { data, error } = await supabase.rpc('update_encrypted_token', {
      p_marketplace: marketplace,
      p_account_name: accountName,
      p_token_type: tokenType,
      p_token_plaintext: tokenPlaintext
    })

    if (error) {
      console.error(`[SecureToken] トークン更新エラー:`, error)
      return false
    }

    return data as boolean
  } catch (error) {
    console.error(`[SecureToken] 予期しないエラー:`, error)
    return false
  }
}

/**
 * マーケットプレイスのすべての認証情報を取得
 *
 * @example
 * const creds = await getMarketplaceCredentials('ebay', 'mjt')
 * // { clientId: '...', clientSecret: '...', refreshToken: '...' }
 */
export async function getMarketplaceCredentials(
  marketplace: Marketplace,
  accountName: string
): Promise<TokenCredentials> {
  const [clientId, clientSecret, refreshToken, accessToken] = await Promise.all([
    getDecryptedToken(marketplace, accountName, 'client_id'),
    getDecryptedToken(marketplace, accountName, 'client_secret'),
    getDecryptedToken(marketplace, accountName, 'refresh_token'),
    getDecryptedToken(marketplace, accountName, 'access_token')
  ])

  return {
    clientId: clientId || undefined,
    clientSecret: clientSecret || undefined,
    refreshToken: refreshToken || undefined,
    accessToken: accessToken || undefined
  }
}

/**
 * 環境変数からトークンをDBに移行
 *
 * ⚠️ この関数は初回セットアップ時のみ実行してください
 * ⚠️ 実行後は環境変数からトークンを削除することを推奨します
 */
export async function migrateTokensFromEnv(): Promise<void> {
  console.log('🔄 環境変数からトークンを移行中...')

  const migrations = [
    // eBay MJT
    {
      marketplace: 'ebay' as Marketplace,
      accountName: 'mjt',
      tokens: [
        { type: 'client_id' as TokenType, value: process.env.EBAY_CLIENT_ID_MJT, desc: 'eBay MJT Client ID' },
        { type: 'client_secret' as TokenType, value: process.env.EBAY_CLIENT_SECRET_MJT, desc: 'eBay MJT Client Secret' },
        { type: 'refresh_token' as TokenType, value: process.env.EBAY_REFRESH_TOKEN_MJT, desc: 'eBay MJT Refresh Token' }
      ]
    },
    // eBay Green
    {
      marketplace: 'ebay' as Marketplace,
      accountName: 'green',
      tokens: [
        { type: 'client_id' as TokenType, value: process.env.EBAY_CLIENT_ID_GREEN, desc: 'eBay Green Client ID' },
        { type: 'client_secret' as TokenType, value: process.env.EBAY_CLIENT_SECRET_GREEN, desc: 'eBay Green Client Secret' },
        { type: 'refresh_token' as TokenType, value: process.env.EBAY_REFRESH_TOKEN_GREEN, desc: 'eBay Green Refresh Token' }
      ]
    },
    // その他のマーケットプレイス（必要に応じて追加）
  ]

  for (const { marketplace, accountName, tokens } of migrations) {
    for (const { type, value, desc } of tokens) {
      if (value) {
        const result = await insertEncryptedToken(
          marketplace,
          accountName,
          type,
          value,
          desc
        )
        if (result) {
          console.log(`✅ ${marketplace}/${accountName}/${type} を移行しました`)
        } else {
          console.error(`❌ ${marketplace}/${accountName}/${type} の移行に失敗しました`)
        }
      }
    }
  }

  console.log('✅ トークン移行が完了しました')
  console.log('⚠️  .env.localから以下の環境変数を削除することを推奨します:')
  console.log('   - EBAY_CLIENT_ID_MJT, EBAY_CLIENT_SECRET_MJT, EBAY_REFRESH_TOKEN_MJT')
  console.log('   - EBAY_CLIENT_ID_GREEN, EBAY_CLIENT_SECRET_GREEN, EBAY_REFRESH_TOKEN_GREEN')
}

/**
 * 環境変数フォールバック付きでトークンを取得
 *
 * DBにトークンがない場合は、環境変数から取得（移行期間用）
 */
export async function getTokenWithFallback(
  marketplace: Marketplace,
  accountName: string,
  tokenType: TokenType,
  envVarName: string
): Promise<string | null> {
  // まずDBから取得を試みる
  const dbToken = await getDecryptedToken(marketplace, accountName, tokenType)

  if (dbToken) {
    return dbToken
  }

  // DBにない場合は環境変数から取得（フォールバック）
  const envToken = process.env[envVarName]

  if (envToken) {
    console.warn(
      `⚠️  [SecureToken] トークンがDBに見つかりません。環境変数 ${envVarName} から取得しました。\n` +
      `   DBに移行することを推奨します: await migrateTokensFromEnv()`
    )
    return envToken
  }

  console.error(`❌ [SecureToken] トークンが見つかりません: ${marketplace}/${accountName}/${tokenType}`)
  return null
}
