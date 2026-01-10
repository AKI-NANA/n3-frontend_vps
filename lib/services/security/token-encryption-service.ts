// lib/services/security/token-encryption-service.ts
// P0: 認証情報暗号化サービスレイヤー

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export interface EncryptedToken {
  token_encrypted: string // Base64エンコードされたバイナリ
  token_nonce: string // Base64エンコードされたバイナリ
  encryption_key_id: string
}

export interface TokenRecord {
  id: number
  marketplace_id: string
  token_type: string
  token_value?: string // 復号化された値（ビュー経由）
  expires_at?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * 暗号化されたトークンをデータベースに保存
 */
export async function saveEncryptedToken(
  marketplaceId: string,
  tokenType: string,
  plainToken: string,
  expiresAt?: string
): Promise<TokenRecord> {
  const supabase = createRouteHandlerClient({ cookies })

  // 1. トークンを暗号化（DB関数を使用）
  const { data: encryptedData, error: encryptError } = await supabase
    .rpc('encrypt_token', { plain_token: plainToken })
    .single()

  if (encryptError || !encryptedData) {
    throw new Error(`Failed to encrypt token: ${encryptError?.message}`)
  }

  // 2. 暗号化されたトークンをデータベースに保存
  const { data, error } = await supabase
    .from('api_tokens')
    .upsert({
      marketplace_id: marketplaceId,
      token_type: tokenType,
      token_encrypted: encryptedData.encrypted_token,
      token_nonce: encryptedData.nonce,
      encryption_key_id: encryptedData.key_id,
      expires_at: expiresAt,
      is_active: true,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'marketplace_id,token_type'
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save encrypted token: ${error.message}`)
  }

  return data
}

/**
 * 復号化されたトークンを取得（安全なビュー経由）
 */
export async function getDecryptedToken(
  marketplaceId: string,
  tokenType: string
): Promise<string | null> {
  const supabase = createRouteHandlerClient({ cookies })

  const { data, error } = await supabase
    .from('v_api_tokens_decrypted')
    .select('token_value')
    .eq('marketplace_id', marketplaceId)
    .eq('token_type', tokenType)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    console.warn(`Token not found or decryption failed: ${marketplaceId}/${tokenType}`)
    return null
  }

  return data.token_value
}

/**
 * すべてのトークンを取得（復号化済み）
 */
export async function getAllDecryptedTokens(): Promise<TokenRecord[]> {
  const supabase = createRouteHandlerClient({ cookies })

  const { data, error } = await supabase
    .from('v_api_tokens_decrypted')
    .select('*')
    .eq('is_active', true)

  if (error) {
    throw new Error(`Failed to get tokens: ${error.message}`)
  }

  return data || []
}

/**
 * トークンを無効化（削除ではなく is_active = false に設定）
 */
export async function deactivateToken(
  marketplaceId: string,
  tokenType: string
): Promise<void> {
  const supabase = createRouteHandlerClient({ cookies })

  const { error } = await supabase
    .from('api_tokens')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('marketplace_id', marketplaceId)
    .eq('token_type', tokenType)

  if (error) {
    throw new Error(`Failed to deactivate token: ${error.message}`)
  }
}

/**
 * 既存の平文トークンを暗号化トークンに移行
 * （一度だけ実行するメンテナンス関数）
 */
export async function migratePlainTokensToEncrypted(): Promise<number> {
  const supabase = createRouteHandlerClient({ cookies })

  const { data, error } = await supabase
    .rpc('migrate_plain_tokens_to_encrypted')

  if (error) {
    throw new Error(`Failed to migrate tokens: ${error.message}`)
  }

  return data as number
}

/**
 * トークンの有効期限をチェック
 */
export async function checkTokenExpiry(
  marketplaceId: string,
  tokenType: string
): Promise<{
  isExpired: boolean
  expiresAt?: string
  daysUntilExpiry?: number
}> {
  const supabase = createRouteHandlerClient({ cookies })

  const { data, error } = await supabase
    .from('api_tokens')
    .select('expires_at')
    .eq('marketplace_id', marketplaceId)
    .eq('token_type', tokenType)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return { isExpired: true }
  }

  if (!data.expires_at) {
    return { isExpired: false } // 有効期限なし
  }

  const expiresAt = new Date(data.expires_at)
  const now = new Date()
  const isExpired = expiresAt <= now
  const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return {
    isExpired,
    expiresAt: data.expires_at,
    daysUntilExpiry
  }
}
