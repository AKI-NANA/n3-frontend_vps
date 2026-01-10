/**
 * 認証情報管理サービス
 *
 * P0: Critical Security - API認証情報の安全な管理
 *
 * このサービスは：
 * - APIトークン、パスワード、秘密鍵などの認証情報を暗号化して保存
 * - 必要なときだけ復号化してメモリに展開
 * - 認証情報のローテーション機能
 */

import { createClient } from '@/lib/supabase/client'
import { getEncryptionService } from './encryption-service'

const supabase = createClient()

/**
 * 認証情報のタイプ
 */
export type CredentialType =
  | 'ebay_api_token'
  | 'amazon_api_token'
  | 'mercari_api_token'
  | 'rakuten_api_token'
  | 'yahoo_api_token'
  | 'stripe_api_key'
  | 'paypal_api_key'
  | 'shipping_api_key'
  | 'ai_api_key'
  | 'webhook_secret'
  | 'oauth_client_secret'
  | 'database_password'
  | 'other'

/**
 * 認証情報レコード
 */
export interface Credential {
  id: string
  name: string
  type: CredentialType
  encrypted_value: string       // 暗号化された認証情報（JSON文字列）
  account_id?: string            // 関連するアカウントID
  marketplace?: string           // マーケットプレイス名
  environment: 'production' | 'sandbox' | 'development'
  is_active: boolean
  expires_at?: string
  last_rotated_at?: string
  created_at: string
  updated_at: string
  created_by?: string
  metadata?: Record<string, any>
}

/**
 * 平文の認証情報（メモリ上のみ）
 */
export interface DecryptedCredential extends Omit<Credential, 'encrypted_value'> {
  value: string                  // 復号化された平文の認証情報
}

/**
 * CredentialManager クラス
 */
export class CredentialManager {
  private encryptionService = getEncryptionService()

  /**
   * 認証情報を保存（暗号化）
   *
   * @param name 認証情報の名前
   * @param type 認証情報のタイプ
   * @param value 平文の認証情報
   * @param options 追加オプション
   * @returns 保存された認証情報のID
   */
  async saveCredential(
    name: string,
    type: CredentialType,
    value: string,
    options: {
      account_id?: string
      marketplace?: string
      environment?: 'production' | 'sandbox' | 'development'
      expires_at?: string
      metadata?: Record<string, any>
      created_by?: string
    } = {}
  ): Promise<string> {
    try {
      // 暗号化
      const encryptedValue = this.encryptionService.encryptToString(value)

      // データベースに保存
      const { data, error } = await supabase
        .from('credentials')
        .insert({
          name,
          type,
          encrypted_value: encryptedValue,
          account_id: options.account_id,
          marketplace: options.marketplace,
          environment: options.environment || 'production',
          is_active: true,
          expires_at: options.expires_at,
          last_rotated_at: new Date().toISOString(),
          created_by: options.created_by,
          metadata: options.metadata
        })
        .select()
        .single()

      if (error) {
        console.error('❌ 認証情報保存エラー:', error)
        throw new Error(`認証情報の保存に失敗しました: ${error.message}`)
      }

      console.log(`✅ 認証情報を保存: ${name} (ID: ${data.id})`)
      return data.id
    } catch (error) {
      console.error('❌ 認証情報保存エラー:', error)
      throw error
    }
  }

  /**
   * 認証情報を取得（復号化）
   *
   * @param credential_id 認証情報ID
   * @returns 復号化された認証情報
   */
  async getCredential(credential_id: string): Promise<DecryptedCredential | null> {
    try {
      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('id', credential_id)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        console.warn(`⚠️ 認証情報が見つかりません: ${credential_id}`)
        return null
      }

      // 有効期限チェック
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        console.warn(`⚠️ 認証情報の有効期限が切れています: ${credential_id}`)
        return null
      }

      // 復号化
      const decryptedValue = this.encryptionService.decryptFromString(data.encrypted_value)

      return {
        ...data,
        value: decryptedValue
      }
    } catch (error) {
      console.error('❌ 認証情報取得エラー:', error)
      throw error
    }
  }

  /**
   * 認証情報を名前とタイプで取得
   */
  async getCredentialByName(
    name: string,
    type: CredentialType,
    environment: 'production' | 'sandbox' | 'development' = 'production'
  ): Promise<DecryptedCredential | null> {
    try {
      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('name', name)
        .eq('type', type)
        .eq('environment', environment)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) {
        console.warn(`⚠️ 認証情報が見つかりません: ${name} (${type})`)
        return null
      }

      // 有効期限チェック
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        console.warn(`⚠️ 認証情報の有効期限が切れています: ${name}`)
        return null
      }

      // 復号化
      const decryptedValue = this.encryptionService.decryptFromString(data.encrypted_value)

      return {
        ...data,
        value: decryptedValue
      }
    } catch (error) {
      console.error('❌ 認証情報取得エラー:', error)
      return null
    }
  }

  /**
   * 認証情報を更新（ローテーション）
   *
   * @param credential_id 認証情報ID
   * @param newValue 新しい平文の認証情報
   */
  async rotateCredential(credential_id: string, newValue: string): Promise<void> {
    try {
      // 暗号化
      const encryptedValue = this.encryptionService.encryptToString(newValue)

      // 更新
      const { error } = await supabase
        .from('credentials')
        .update({
          encrypted_value: encryptedValue,
          last_rotated_at: new Date().toISOString()
        })
        .eq('id', credential_id)

      if (error) {
        console.error('❌ 認証情報更新エラー:', error)
        throw new Error(`認証情報の更新に失敗しました: ${error.message}`)
      }

      console.log(`✅ 認証情報をローテーション: ${credential_id}`)
    } catch (error) {
      console.error('❌ 認証情報更新エラー:', error)
      throw error
    }
  }

  /**
   * 認証情報を無効化
   */
  async deactivateCredential(credential_id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('credentials')
        .update({
          is_active: false
        })
        .eq('id', credential_id)

      if (error) {
        console.error('❌ 認証情報無効化エラー:', error)
        throw new Error(`認証情報の無効化に失敗しました: ${error.message}`)
      }

      console.log(`✅ 認証情報を無効化: ${credential_id}`)
    } catch (error) {
      console.error('❌ 認証情報無効化エラー:', error)
      throw error
    }
  }

  /**
   * 認証情報を削除
   */
  async deleteCredential(credential_id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('credentials')
        .delete()
        .eq('id', credential_id)

      if (error) {
        console.error('❌ 認証情報削除エラー:', error)
        throw new Error(`認証情報の削除に失敗しました: ${error.message}`)
      }

      console.log(`✅ 認証情報を削除: ${credential_id}`)
    } catch (error) {
      console.error('❌ 認証情報削除エラー:', error)
      throw error
    }
  }

  /**
   * すべての認証情報を取得（復号化なし）
   */
  async listCredentials(filters?: {
    type?: CredentialType
    marketplace?: string
    environment?: string
    is_active?: boolean
  }): Promise<Credential[]> {
    try {
      let query = supabase.from('credentials').select('*')

      if (filters?.type) {
        query = query.eq('type', filters.type)
      }
      if (filters?.marketplace) {
        query = query.eq('marketplace', filters.marketplace)
      }
      if (filters?.environment) {
        query = query.eq('environment', filters.environment)
      }
      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('❌ 認証情報リスト取得エラー:', error)
        return []
      }

      return (data || []) as Credential[]
    } catch (error) {
      console.error('❌ 認証情報リスト取得エラー:', error)
      return []
    }
  }

  /**
   * 有効期限が近い認証情報を取得（アラート用）
   */
  async getExpiringCredentials(daysBeforeExpiry: number = 30): Promise<Credential[]> {
    try {
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + daysBeforeExpiry)

      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('is_active', true)
        .not('expires_at', 'is', null)
        .lte('expires_at', expiryDate.toISOString())
        .order('expires_at', { ascending: true })

      if (error) {
        console.error('❌ 有効期限間近の認証情報取得エラー:', error)
        return []
      }

      return (data || []) as Credential[]
    } catch (error) {
      console.error('❌ 有効期限間近の認証情報取得エラー:', error)
      return []
    }
  }
}

/**
 * シングルトンインスタンス
 */
export const credentialManager = new CredentialManager()
