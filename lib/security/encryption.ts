/**
 * P0: 認証情報暗号化サービス
 *
 * 全APIキー・トークン・機密情報を暗号化してSupabaseに保存
 * pgsodiumによるAES-256-GCM暗号化を使用
 *
 * セキュリティレベル: P0 (Critical)
 */

import { createClient } from '@/lib/supabase/server'

export type CredentialType = 'api_key' | 'access_token' | 'refresh_token' | 'client_secret' | 'client_id'
export type ServiceName =
  | 'gemini_api'
  | 'amazon_pa_api'
  | 'rakuten_api'
  | 'yahoo_api'
  | 'keepa_api'
  | 'ebay_oauth'
  | 'shopee_oauth'
  | 'etsy_oauth'
  | 'amazon_mws'
  | 'mercari_api'
  | 'cron_secret'

export interface EncryptedCredential {
  id: string
  service_name: ServiceName
  credential_type: CredentialType
  user_id?: string
  marketplace?: string
  expires_at?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CredentialOptions {
  userId?: string
  marketplace?: string
  expiresAt?: Date
  metadata?: Record<string, any>
}

/**
 * 暗号化マネージャー
 * Supabase pgsodiumを使用して機密情報を安全に保存・取得
 */
export class EncryptionManager {
  /**
   * 機密情報を暗号化して保存
   */
  static async encryptAndStore(
    serviceName: ServiceName,
    credentialType: CredentialType,
    plainValue: string,
    options: CredentialOptions = {}
  ): Promise<string> {
    const supabase = await createClient()

    const { data, error } = await supabase.rpc('encrypt_credential', {
      p_service_name: serviceName,
      p_credential_type: credentialType,
      p_plain_value: plainValue,
      p_user_id: options.userId || null,
      p_marketplace: options.marketplace || null,
      p_expires_at: options.expiresAt?.toISOString() || null,
      p_metadata: options.metadata || {}
    })

    if (error) {
      console.error(`[EncryptionManager] Failed to encrypt ${serviceName}:${credentialType}`, error)
      throw new Error(`Encryption failed: ${error.message}`)
    }

    return data as string
  }

  /**
   * 暗号化された機密情報を復号化して取得
   */
  static async decryptAndRetrieve(
    serviceName: ServiceName,
    credentialType: CredentialType,
    options: Pick<CredentialOptions, 'userId' | 'marketplace'> = {}
  ): Promise<string | null> {
    const supabase = await createClient()

    const { data, error } = await supabase.rpc('decrypt_credential', {
      p_service_name: serviceName,
      p_credential_type: credentialType,
      p_user_id: options.userId || null,
      p_marketplace: options.marketplace || null
    })

    if (error) {
      console.error(`[EncryptionManager] Failed to decrypt ${serviceName}:${credentialType}`, error)
      return null
    }

    return data as string | null
  }

  /**
   * 環境変数から暗号化ストレージへの移行ヘルパー
   * 初回セットアップ時に実行
   */
  static async migrateFromEnv(): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0

    const envMappings: Array<{
      envKey: string
      serviceName: ServiceName
      credentialType: CredentialType
      marketplace?: string
    }> = [
      // AI APIs
      { envKey: 'GEMINI_API_KEY', serviceName: 'gemini_api', credentialType: 'api_key' },

      // Arbitrage APIs
      { envKey: 'AMAZON_PA_API_KEY', serviceName: 'amazon_pa_api', credentialType: 'api_key' },
      { envKey: 'RAKUTEN_APP_ID', serviceName: 'rakuten_api', credentialType: 'api_key' },
      { envKey: 'YAHOO_APP_ID', serviceName: 'yahoo_api', credentialType: 'api_key' },
      { envKey: 'KEEPA_API_KEY', serviceName: 'keepa_api', credentialType: 'api_key' },

      // OAuth - eBay
      { envKey: 'EBAY_CLIENT_ID', serviceName: 'ebay_oauth', credentialType: 'client_id' },
      { envKey: 'EBAY_CLIENT_SECRET', serviceName: 'ebay_oauth', credentialType: 'client_secret' },

      // OAuth - Shopee
      { envKey: 'SHOPEE_PARTNER_ID', serviceName: 'shopee_oauth', credentialType: 'client_id' },
      { envKey: 'SHOPEE_PARTNER_KEY', serviceName: 'shopee_oauth', credentialType: 'client_secret' },

      // OAuth - Etsy
      { envKey: 'ETSY_API_KEY', serviceName: 'etsy_oauth', credentialType: 'api_key' },

      // Cron
      { envKey: 'CRON_SECRET', serviceName: 'cron_secret', credentialType: 'api_key' },
    ]

    for (const mapping of envMappings) {
      const value = process.env[mapping.envKey]
      if (!value) {
        console.warn(`[EncryptionManager] ENV ${mapping.envKey} not found, skipping`)
        continue
      }

      try {
        await this.encryptAndStore(
          mapping.serviceName,
          mapping.credentialType,
          value,
          { marketplace: mapping.marketplace }
        )
        console.log(`[EncryptionManager] ✅ Migrated ${mapping.envKey}`)
        success++
      } catch (error) {
        console.error(`[EncryptionManager] ❌ Failed to migrate ${mapping.envKey}`, error)
        failed++
      }
    }

    return { success, failed }
  }

  /**
   * 有効期限切れトークンのクリーンアップ
   * Cronジョブから日次実行推奨
   */
  static async cleanupExpiredCredentials(): Promise<number> {
    const supabase = await createClient()

    const { data, error } = await supabase.rpc('cleanup_expired_credentials')

    if (error) {
      console.error('[EncryptionManager] Failed to cleanup expired credentials', error)
      return 0
    }

    return data as number
  }

  /**
   * OAuth トークンペア保存ヘルパー
   */
  static async storeOAuthTokens(
    serviceName: ServiceName,
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    options: CredentialOptions = {}
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + expiresIn * 1000)

    await Promise.all([
      this.encryptAndStore(serviceName, 'access_token', accessToken, {
        ...options,
        expiresAt,
        metadata: { ...options.metadata, token_type: 'access' }
      }),
      this.encryptAndStore(serviceName, 'refresh_token', refreshToken, {
        ...options,
        metadata: { ...options.metadata, token_type: 'refresh' }
      })
    ])
  }

  /**
   * OAuth トークンペア取得ヘルパー
   */
  static async retrieveOAuthTokens(
    serviceName: ServiceName,
    options: Pick<CredentialOptions, 'userId' | 'marketplace'> = {}
  ): Promise<{ accessToken: string | null; refreshToken: string | null }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.decryptAndRetrieve(serviceName, 'access_token', options),
      this.decryptAndRetrieve(serviceName, 'refresh_token', options)
    ])

    return { accessToken, refreshToken }
  }

  /**
   * フォールバック: 暗号化ストレージが利用できない場合は環境変数を使用
   * 本番環境では必ず暗号化ストレージを使用すること
   */
  static async getCredentialWithFallback(
    serviceName: ServiceName,
    credentialType: CredentialType,
    envKey: string,
    options: Pick<CredentialOptions, 'userId' | 'marketplace'> = {}
  ): Promise<string | null> {
    // 1. Try encrypted storage first
    const encrypted = await this.decryptAndRetrieve(serviceName, credentialType, options)
    if (encrypted) {
      return encrypted
    }

    // 2. Fallback to environment variable (for development/migration period)
    const envValue = process.env[envKey]
    if (envValue) {
      console.warn(
        `[EncryptionManager] ⚠️ Using ENV fallback for ${serviceName}:${credentialType}. ` +
        `Please migrate to encrypted storage using migrateFromEnv()`
      )
      return envValue
    }

    return null
  }
}

/**
 * 便利なラッパー関数
 */

export async function getGeminiApiKey(): Promise<string | null> {
  return EncryptionManager.getCredentialWithFallback(
    'gemini_api',
    'api_key',
    'GEMINI_API_KEY'
  )
}

export async function getAmazonPAApiKey(): Promise<string | null> {
  return EncryptionManager.getCredentialWithFallback(
    'amazon_pa_api',
    'api_key',
    'AMAZON_PA_API_KEY'
  )
}

export async function getRakutenAppId(): Promise<string | null> {
  return EncryptionManager.getCredentialWithFallback(
    'rakuten_api',
    'api_key',
    'RAKUTEN_APP_ID'
  )
}

export async function getYahooAppId(): Promise<string | null> {
  return EncryptionManager.getCredentialWithFallback(
    'yahoo_api',
    'api_key',
    'YAHOO_APP_ID'
  )
}

export async function getKeepaApiKey(): Promise<string | null> {
  return EncryptionManager.getCredentialWithFallback(
    'keepa_api',
    'api_key',
    'KEEPA_API_KEY'
  )
}

export async function getEbayOAuthCredentials(): Promise<{
  clientId: string | null
  clientSecret: string | null
}> {
  const [clientId, clientSecret] = await Promise.all([
    EncryptionManager.getCredentialWithFallback('ebay_oauth', 'client_id', 'EBAY_CLIENT_ID'),
    EncryptionManager.getCredentialWithFallback('ebay_oauth', 'client_secret', 'EBAY_CLIENT_SECRET')
  ])

  return { clientId, clientSecret }
}

export async function getShopeeOAuthCredentials(): Promise<{
  partnerId: string | null
  partnerKey: string | null
}> {
  const [partnerId, partnerKey] = await Promise.all([
    EncryptionManager.getCredentialWithFallback('shopee_oauth', 'client_id', 'SHOPEE_PARTNER_ID'),
    EncryptionManager.getCredentialWithFallback('shopee_oauth', 'client_secret', 'SHOPEE_PARTNER_KEY')
  ])

  return { partnerId, partnerKey }
}

export async function getEtsyApiKey(): Promise<string | null> {
  return EncryptionManager.getCredentialWithFallback(
    'etsy_oauth',
    'api_key',
    'ETSY_API_KEY'
  )
}

export async function getCronSecret(): Promise<string | null> {
  return EncryptionManager.getCredentialWithFallback(
    'cron_secret',
    'api_key',
    'CRON_SECRET'
  )
}
