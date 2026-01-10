/**
 * 認証情報暗号化サービス (P0実装)
 *
 * Supabase pgsodiumを使用してAPI鍵、認証情報、支払いアカウント情報を暗号化
 *
 * @see https://supabase.com/docs/guides/database/extensions/pgsodium
 */

import { createClient } from '@/lib/supabase/server'

/**
 * 暗号化された認証情報の型定義
 */
export interface EncryptedCredential {
  id: string
  key_name: string
  encrypted_value: string  // pgsodium encrypted column
  key_type: 'api_key' | 'token' | 'secret' | 'password' | 'credential'
  service_name: string  // 'ebay', 'amazon', 'paypal', 'supabase', etc.
  account_name?: string  // 複数アカウント対応
  description?: string
  expires_at?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * 認証情報の平文型
 */
export interface PlainCredential {
  key_name: string
  value: string
  key_type: 'api_key' | 'token' | 'secret' | 'password' | 'credential'
  service_name: string
  account_name?: string
  description?: string
  expires_at?: Date | null
}

/**
 * 認証情報暗号化サービス
 */
export class EncryptionService {
  private static instance: EncryptionService

  private constructor() {}

  /**
   * シングルトンインスタンス取得
   */
  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService()
    }
    return EncryptionService.instance
  }

  /**
   * 認証情報を暗号化して保存
   *
   * @param credential - 平文の認証情報
   * @returns 暗号化された認証情報ID
   */
  async encryptAndStore(credential: PlainCredential): Promise<string> {
    const supabase = await createClient()

    // pgsodiumのpgsodium.crypto_aead_det_encrypt関数を使用して暗号化
    const { data, error } = await supabase.rpc('encrypt_credential', {
      p_key_name: credential.key_name,
      p_value: credential.value,
      p_key_type: credential.key_type,
      p_service_name: credential.service_name,
      p_account_name: credential.account_name || null,
      p_description: credential.description || null,
      p_expires_at: credential.expires_at?.toISOString() || null
    })

    if (error) {
      console.error('❌ 認証情報の暗号化に失敗:', error)
      throw new Error(`Failed to encrypt credential: ${error.message}`)
    }

    return data
  }

  /**
   * 暗号化された認証情報を復号化して取得
   *
   * @param keyName - 認証情報のキー名
   * @param serviceName - サービス名
   * @param accountName - アカウント名（オプション）
   * @returns 復号化された値
   */
  async decrypt(
    keyName: string,
    serviceName: string,
    accountName?: string
  ): Promise<string> {
    const supabase = await createClient()

    const { data, error } = await supabase.rpc('decrypt_credential', {
      p_key_name: keyName,
      p_service_name: serviceName,
      p_account_name: accountName || null
    })

    if (error) {
      console.error('❌ 認証情報の復号化に失敗:', error)
      throw new Error(`Failed to decrypt credential: ${error.message}`)
    }

    if (!data) {
      throw new Error(`Credential not found: ${serviceName}.${keyName}${accountName ? `.${accountName}` : ''}`)
    }

    return data
  }

  /**
   * 複数の認証情報を一括で取得（サービス名でフィルタ）
   *
   * @param serviceName - サービス名
   * @returns 復号化された認証情報のマップ
   */
  async getServiceCredentials(serviceName: string): Promise<Record<string, string>> {
    const supabase = await createClient()

    const { data, error } = await supabase.rpc('get_service_credentials', {
      p_service_name: serviceName
    })

    if (error) {
      console.error('❌ サービス認証情報の取得に失敗:', error)
      throw new Error(`Failed to get service credentials: ${error.message}`)
    }

    return data || {}
  }

  /**
   * 認証情報の更新
   *
   * @param keyName - 認証情報のキー名
   * @param serviceName - サービス名
   * @param newValue - 新しい値
   * @param accountName - アカウント名（オプション）
   */
  async updateCredential(
    keyName: string,
    serviceName: string,
    newValue: string,
    accountName?: string
  ): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.rpc('update_credential', {
      p_key_name: keyName,
      p_service_name: serviceName,
      p_new_value: newValue,
      p_account_name: accountName || null
    })

    if (error) {
      console.error('❌ 認証情報の更新に失敗:', error)
      throw new Error(`Failed to update credential: ${error.message}`)
    }
  }

  /**
   * 認証情報の削除
   *
   * @param keyName - 認証情報のキー名
   * @param serviceName - サービス名
   * @param accountName - アカウント名（オプション）
   */
  async deleteCredential(
    keyName: string,
    serviceName: string,
    accountName?: string
  ): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from('encrypted_credentials')
      .update({ is_active: false })
      .eq('key_name', keyName)
      .eq('service_name', serviceName)
      .eq('account_name', accountName || null)

    if (error) {
      console.error('❌ 認証情報の削除に失敗:', error)
      throw new Error(`Failed to delete credential: ${error.message}`)
    }
  }

  /**
   * 有効期限切れの認証情報をチェック
   *
   * @returns 有効期限切れの認証情報リスト
   */
  async checkExpiredCredentials(): Promise<EncryptedCredential[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('encrypted_credentials')
      .select('*')
      .lt('expires_at', new Date().toISOString())
      .eq('is_active', true)

    if (error) {
      console.error('❌ 有効期限チェックに失敗:', error)
      throw new Error(`Failed to check expired credentials: ${error.message}`)
    }

    return data || []
  }

  /**
   * 認証情報の一覧を取得（値は復号化しない）
   *
   * @param serviceName - サービス名でフィルタ（オプション）
   * @returns 認証情報のメタデータリスト
   */
  async listCredentials(serviceName?: string): Promise<Omit<EncryptedCredential, 'encrypted_value'>[]> {
    const supabase = await createClient()

    let query = supabase
      .from('encrypted_credentials')
      .select('id, key_name, key_type, service_name, account_name, description, expires_at, is_active, created_at, updated_at')
      .eq('is_active', true)

    if (serviceName) {
      query = query.eq('service_name', serviceName)
    }

    const { data, error } = await query.order('service_name', { ascending: true })

    if (error) {
      console.error('❌ 認証情報一覧の取得に失敗:', error)
      throw new Error(`Failed to list credentials: ${error.message}`)
    }

    return data || []
  }
}

/**
 * ヘルパー関数: eBay認証情報を取得
 */
export async function getEbayCredentials(account: 'green' | 'mjt' | 'default' = 'default') {
  const service = EncryptionService.getInstance()

  const accountSuffix = account === 'default' ? '' : `_${account.toUpperCase()}`

  return {
    clientId: await service.decrypt('CLIENT_ID', 'ebay', account),
    clientSecret: await service.decrypt('CLIENT_SECRET', 'ebay', account),
    devId: await service.decrypt('DEV_ID', 'ebay', 'default'),
    certId: await service.decrypt('CERT_ID', 'ebay', account),
    authToken: await service.decrypt('AUTH_TOKEN', 'ebay', account),
    userToken: await service.decrypt('USER_TOKEN', 'ebay', account),
    refreshToken: await service.decrypt('REFRESH_TOKEN', 'ebay', account),
    paypalEmail: await service.decrypt('PAYPAL_EMAIL', 'ebay', account)
  }
}

/**
 * ヘルパー関数: Amazon認証情報を取得
 */
export async function getAmazonCredentials() {
  const service = EncryptionService.getInstance()

  return {
    accessKey: await service.decrypt('ACCESS_KEY', 'amazon'),
    secretKey: await service.decrypt('SECRET_KEY', 'amazon'),
    partnerTag: await service.decrypt('PARTNER_TAG', 'amazon')
  }
}

/**
 * ヘルパー関数: Supabase認証情報を取得
 */
export async function getSupabaseCredentials() {
  const service = EncryptionService.getInstance()

  return {
    url: await service.decrypt('URL', 'supabase'),
    anonKey: await service.decrypt('ANON_KEY', 'supabase'),
    serviceRoleKey: await service.decrypt('SERVICE_ROLE_KEY', 'supabase')
  }
}

// デフォルトエクスポート
export default EncryptionService.getInstance()
