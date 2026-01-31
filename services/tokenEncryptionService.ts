// services/tokenEncryptionService.ts
// P0: 認証情報暗号化サービス

import { supabase } from '@/lib/supabase'

/**
 * APIトークンを暗号化してデータベースに保存
 */
export async function saveEncryptedToken(data: {
  marketplace: string
  userId?: string
  accessToken: string
  refreshToken?: string
  tokenType?: string
  expiresAt?: string
  scope?: string
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data: result, error } = await supabase
      .from('api_tokens')
      .insert({
        marketplace: data.marketplace,
        user_id: data.userId,
        access_token: data.accessToken, // トリガーで自動的に暗号化される
        refresh_token: data.refreshToken,
        token_type: data.tokenType || 'Bearer',
        expires_at: data.expiresAt,
        scope: data.scope,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error

    return {
      success: true,
      data: result,
    }
  } catch (error: any) {
    console.error('Error saving encrypted token:', error)
    return {
      success: false,
      error: error.message || 'Failed to save encrypted token',
    }
  }
}

/**
 * 暗号化されたトークンを取得して復号化
 */
export async function getDecryptedToken(
  marketplace: string,
  userId?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    let query = supabase
      .from('api_tokens_decrypted')
      .select('*')
      .eq('marketplace', marketplace)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query.single()

    if (error) throw error

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    console.error('Error getting decrypted token:', error)
    return {
      success: false,
      error: error.message || 'Failed to get decrypted token',
    }
  }
}

/**
 * トークンを更新（既存のトークンを無効化して新しいトークンを保存）
 */
export async function updateEncryptedToken(data: {
  marketplace: string
  userId?: string
  accessToken: string
  refreshToken?: string
  tokenType?: string
  expiresAt?: string
  scope?: string
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // 既存のトークンを無効化
    let deactivateQuery = supabase
      .from('api_tokens')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('marketplace', data.marketplace)

    if (data.userId) {
      deactivateQuery = deactivateQuery.eq('user_id', data.userId)
    }

    await deactivateQuery

    // 新しいトークンを保存
    return await saveEncryptedToken(data)
  } catch (error: any) {
    console.error('Error updating encrypted token:', error)
    return {
      success: false,
      error: error.message || 'Failed to update encrypted token',
    }
  }
}

/**
 * トークンを削除（無効化）
 */
export async function deactivateToken(
  marketplace: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    let query = supabase
      .from('api_tokens')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('marketplace', marketplace)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { error } = await query

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Error deactivating token:', error)
    return {
      success: false,
      error: error.message || 'Failed to deactivate token',
    }
  }
}

/**
 * 全マーケットプレイスのトークンを取得
 */
export async function getAllDecryptedTokens(
  userId?: string
): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    let query = supabase
      .from('api_tokens_decrypted')
      .select('*')
      .eq('is_active', true)
      .order('marketplace', { ascending: true })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) throw error

    return {
      success: true,
      data: data || [],
    }
  } catch (error: any) {
    console.error('Error getting all decrypted tokens:', error)
    return {
      success: false,
      error: error.message || 'Failed to get all decrypted tokens',
    }
  }
}

/**
 * トークンの有効期限をチェック
 */
export function isTokenExpired(expiresAt: string): boolean {
  if (!expiresAt) return false
  return new Date(expiresAt) <= new Date()
}

/**
 * 既存の平文トークンを暗号化（マイグレーション用）
 */
export async function migrateTokensToEncrypted(): Promise<{
  success: boolean
  migratedCount?: number
  error?: string
}> {
  try {
    const { data, error } = await supabase.rpc('migrate_tokens_to_encrypted')

    if (error) throw error

    return {
      success: true,
      migratedCount: data || 0,
    }
  } catch (error: any) {
    console.error('Error migrating tokens:', error)
    return {
      success: false,
      error: error.message || 'Failed to migrate tokens',
    }
  }
}

/**
 * 暗号化状況を確認
 */
export async function getEncryptionStatus(): Promise<{
  success: boolean
  data?: {
    marketplace: string
    totalTokens: number
    encryptedTokens: number
    plainTokens: number
  }[]
  error?: string
}> {
  try {
    const { data, error } = await supabase.from('api_tokens').select('marketplace, is_encrypted')

    if (error) throw error

    // グループ化して集計
    const stats: Record<
      string,
      { totalTokens: number; encryptedTokens: number; plainTokens: number }
    > = {}

    data?.forEach((token) => {
      if (!stats[token.marketplace]) {
        stats[token.marketplace] = {
          totalTokens: 0,
          encryptedTokens: 0,
          plainTokens: 0,
        }
      }

      stats[token.marketplace].totalTokens++
      if (token.is_encrypted) {
        stats[token.marketplace].encryptedTokens++
      } else {
        stats[token.marketplace].plainTokens++
      }
    })

    const result = Object.entries(stats).map(([marketplace, counts]) => ({
      marketplace,
      ...counts,
    }))

    return {
      success: true,
      data: result,
    }
  } catch (error: any) {
    console.error('Error getting encryption status:', error)
    return {
      success: false,
      error: error.message || 'Failed to get encryption status',
    }
  }
}
