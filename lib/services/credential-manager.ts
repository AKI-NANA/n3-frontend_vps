/**
 * P0: 認証情報管理サービス
 *
 * pgsodiumを使用した安全な認証情報の暗号化・復号化
 * 全APIキー、トークン、機密情報を一元管理
 */

import { createClient } from '@/lib/supabase/server'

export interface CredentialData {
  platform: string           // 'ebay', 'mercari', 'shopee', etc.
  account?: string           // 'mjt', 'green', etc.
  credential_type: string    // 'refresh_token', 'api_key', 'client_secret', etc.
  value: string              // 実際の認証情報（暗号化前）
  expires_at?: Date          // 有効期限
  metadata?: Record<string, any>  // 追加メタデータ
}

export interface StoredCredential {
  id: string
  platform: string
  account: string | null
  credential_type: string
  encrypted_value: string
  expires_at: string | null
  last_refreshed_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * 認証情報マネージャー
 */
export class CredentialManager {
  /**
   * 認証情報を暗号化して保存
   */
  static async saveCredential(data: CredentialData): Promise<void> {
    const supabase = await createClient()

    // pgsodiumを使用して暗号化
    const { data: encryptedData, error: encryptError } = await supabase.rpc(
      'encrypt_credential',
      { secret_value: data.value }
    )

    if (encryptError) {
      console.error('❌ 認証情報の暗号化エラー:', encryptError)
      throw new Error(`認証情報の暗号化に失敗: ${encryptError.message}`)
    }

    // データベースに保存（UPSERT）
    const { error: insertError } = await supabase
      .from('encrypted_credentials')
      .upsert({
        platform: data.platform,
        account: data.account || null,
        credential_type: data.credential_type,
        encrypted_value: encryptedData,
        expires_at: data.expires_at?.toISOString() || null,
        last_refreshed_at: new Date().toISOString(),
        is_active: true
      }, {
        onConflict: 'platform,account,credential_type'
      })

    if (insertError) {
      console.error('❌ 認証情報の保存エラー:', insertError)
      throw new Error(`認証情報の保存に失敗: ${insertError.message}`)
    }

    console.log(`✅ 認証情報を保存: ${data.platform}${data.account ? `/${data.account}` : ''} - ${data.credential_type}`)
  }

  /**
   * 認証情報を取得して復号化
   */
  static async getCredential(
    platform: string,
    account?: string,
    credential_type: string = 'refresh_token'
  ): Promise<string | null> {
    const supabase = await createClient()

    // データベースから取得
    let query = supabase
      .from('encrypted_credentials')
      .select('*')
      .eq('platform', platform)
      .eq('credential_type', credential_type)
      .eq('is_active', true)

    if (account) {
      query = query.eq('account', account)
    } else {
      query = query.is('account', null)
    }

    const { data, error } = await query.maybeSingle()

    if (error) {
      console.error('❌ 認証情報の取得エラー:', error)
      throw new Error(`認証情報の取得に失敗: ${error.message}`)
    }

    if (!data) {
      console.warn(`⚠️ 認証情報が見つかりません: ${platform}${account ? `/${account}` : ''} - ${credential_type}`)
      return null
    }

    // 有効期限チェック
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      console.warn(`⚠️ 認証情報が期限切れ: ${platform}${account ? `/${account}` : ''} - ${credential_type}`)
      return null
    }

    // pgsodiumを使用して復号化
    const { data: decryptedValue, error: decryptError } = await supabase.rpc(
      'decrypt_credential',
      { encrypted_value: data.encrypted_value }
    )

    if (decryptError) {
      console.error('❌ 認証情報の復号化エラー:', decryptError)
      throw new Error(`認証情報の復号化に失敗: ${decryptError.message}`)
    }

    console.log(`✅ 認証情報を取得: ${platform}${account ? `/${account}` : ''} - ${credential_type}`)
    return decryptedValue
  }

  /**
   * 複数の認証情報を一括取得
   *
   * @example
   * const { client_id, client_secret, refresh_token } = await CredentialManager.getCredentials('ebay', 'mjt', [
   *   'client_id',
   *   'client_secret',
   *   'refresh_token'
   * ])
   */
  static async getCredentials(
    platform: string,
    account?: string,
    types: string[] = ['client_id', 'client_secret', 'refresh_token']
  ): Promise<Record<string, string | null>> {
    const credentials: Record<string, string | null> = {}

    await Promise.all(
      types.map(async (type) => {
        credentials[type] = await this.getCredential(platform, account, type)
      })
    )

    return credentials
  }

  /**
   * 認証情報が存在するかチェック
   */
  static async hasCredentials(
    platform: string,
    account?: string,
    types: string[] = ['client_id', 'client_secret', 'refresh_token']
  ): Promise<boolean> {
    const supabase = await createClient()

    let query = supabase
      .from('encrypted_credentials')
      .select('id', { count: 'exact', head: true })
      .eq('platform', platform)
      .eq('is_active', true)
      .in('credential_type', types)

    if (account) {
      query = query.eq('account', account)
    } else {
      query = query.is('account', null)
    }

    const { count, error } = await query

    if (error) {
      console.error('❌ 認証情報チェックエラー:', error)
      return false
    }

    // 必要な認証情報がすべて存在するかチェック
    return (count || 0) >= types.length
  }

  /**
   * 認証情報を削除（論理削除）
   */
  static async deleteCredential(
    platform: string,
    account?: string,
    credential_type?: string
  ): Promise<void> {
    const supabase = await createClient()

    let query = supabase
      .from('encrypted_credentials')
      .update({ is_active: false })
      .eq('platform', platform)

    if (account) {
      query = query.eq('account', account)
    }

    if (credential_type) {
      query = query.eq('credential_type', credential_type)
    }

    const { error } = await query

    if (error) {
      console.error('❌ 認証情報の削除エラー:', error)
      throw new Error(`認証情報の削除に失敗: ${error.message}`)
    }

    console.log(`✅ 認証情報を削除: ${platform}${account ? `/${account}` : ''}${credential_type ? ` - ${credential_type}` : ''}`)
  }

  /**
   * 有効期限切れの認証情報を一覧取得
   */
  static async getExpiredCredentials(): Promise<StoredCredential[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('encrypted_credentials')
      .select('*')
      .eq('is_active', true)
      .not('expires_at', 'is', null)
      .lt('expires_at', new Date().toISOString())

    if (error) {
      console.error('❌ 期限切れ認証情報の取得エラー:', error)
      throw new Error(`期限切れ認証情報の取得に失敗: ${error.message}`)
    }

    return data || []
  }

  /**
   * 認証情報の統計情報を取得
   */
  static async getStats(): Promise<{
    total: number
    active: number
    expired: number
    by_platform: Record<string, number>
  }> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('encrypted_credentials')
      .select('*')

    if (error) {
      console.error('❌ 統計情報の取得エラー:', error)
      throw new Error(`統計情報の取得に失敗: ${error.message}`)
    }

    const now = new Date()
    const active = data.filter(c => c.is_active).length
    const expired = data.filter(c =>
      c.is_active && c.expires_at && new Date(c.expires_at) < now
    ).length

    const by_platform: Record<string, number> = {}
    data.forEach(c => {
      if (c.is_active) {
        by_platform[c.platform] = (by_platform[c.platform] || 0) + 1
      }
    })

    return {
      total: data.length,
      active,
      expired,
      by_platform
    }
  }
}
