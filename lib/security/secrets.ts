/**
 * P0: 認証情報暗号化システム - クライアントライブラリ
 * Supabase Vault から暗号化されたシークレットを安全に取得
 */

import { createClient } from '@/lib/supabase/server'

/**
 * シークレット名の列挙型
 */
export const SecretKeys = {
  // eBay API
  EBAY_API_KEY: 'ebay_api_key',
  EBAY_API_SECRET: 'ebay_api_secret',
  EBAY_CERT_ID: 'ebay_cert_id',
  EBAY_REDIRECT_URI: 'ebay_redirect_uri',

  // Google Gemini
  GEMINI_API_KEY: 'gemini_api_key',

  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: 'supabase_service_role_key',

  // その他のサービス
  SMTP_PASSWORD: 'smtp_password',
  SLACK_WEBHOOK_URL: 'slack_webhook_url',
  STRIPE_API_KEY: 'stripe_api_key',

  // デプロイメント
  VERCEL_TOKEN: 'vercel_token',
  GITHUB_TOKEN: 'github_token',
} as const

export type SecretKey = typeof SecretKeys[keyof typeof SecretKeys]

/**
 * Vaultからシークレットを取得（復号化）
 *
 * @param secretName - 取得するシークレット名
 * @returns 復号化されたシークレット値
 * @throws シークレットが見つからない場合やアクセス権限がない場合
 */
export async function getSecret(secretName: SecretKey): Promise<string> {
  try {
    const supabase = await createClient()

    // Vault関数を呼び出してシークレットを取得
    const { data, error } = await supabase.rpc('get_secret', {
      secret_name: secretName
    })

    if (error) {
      console.error(`Failed to get secret "${secretName}":`, error)
      throw new Error(`Secret retrieval failed: ${error.message}`)
    }

    if (!data) {
      throw new Error(`Secret "${secretName}" not found`)
    }

    return data as string
  } catch (error) {
    console.error(`Error accessing secret "${secretName}":`, error)

    // フォールバック: 環境変数から取得（開発環境のみ）
    if (process.env.NODE_ENV === 'development') {
      const envKey = secretName.toUpperCase()
      const envValue = process.env[envKey]

      if (envValue) {
        console.warn(`⚠️ Using fallback environment variable for "${secretName}"`)
        return envValue
      }
    }

    throw error
  }
}

/**
 * シークレットをVaultに保存（暗号化）
 *
 * @param secretName - シークレット名
 * @param secretValue - シークレット値
 * @param description - シークレットの説明（オプション）
 * @returns 保存されたシークレットのID
 */
export async function setSecret(
  secretName: SecretKey,
  secretValue: string,
  description?: string
): Promise<string> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.rpc('set_secret', {
      secret_name: secretName,
      secret_value: secretValue,
      secret_description: description || null
    })

    if (error) {
      console.error(`Failed to set secret "${secretName}":`, error)
      throw new Error(`Secret storage failed: ${error.message}`)
    }

    return data as string
  } catch (error) {
    console.error(`Error storing secret "${secretName}":`, error)
    throw error
  }
}

/**
 * シークレットを削除
 *
 * @param secretName - 削除するシークレット名
 * @returns 削除成功の真偽値
 */
export async function deleteSecret(secretName: SecretKey): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.rpc('delete_secret', {
      secret_name: secretName
    })

    if (error) {
      console.error(`Failed to delete secret "${secretName}":`, error)
      throw new Error(`Secret deletion failed: ${error.message}`)
    }

    return data as boolean
  } catch (error) {
    console.error(`Error deleting secret "${secretName}":`, error)
    throw error
  }
}

/**
 * 全シークレットの一覧を取得（値は除外）
 *
 * @returns シークレットのメタデータ一覧
 */
export async function listSecrets(): Promise<Array<{
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.rpc('list_secrets')

    if (error) {
      console.error('Failed to list secrets:', error)
      throw new Error(`Secret listing failed: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Error listing secrets:', error)
    throw error
  }
}

/**
 * 複数のシークレットを一度に取得
 *
 * @param secretNames - 取得するシークレット名の配列
 * @returns シークレット名と値のマップ
 */
export async function getSecrets(
  secretNames: SecretKey[]
): Promise<Record<string, string>> {
  const results: Record<string, string> = {}

  await Promise.all(
    secretNames.map(async (name) => {
      try {
        results[name] = await getSecret(name)
      } catch (error) {
        console.error(`Failed to get secret "${name}":`, error)
        // エラーの場合は空文字列を設定
        results[name] = ''
      }
    })
  )

  return results
}

/**
 * 環境変数をVaultに移行するヘルパー関数
 * 開発環境でのみ使用（本番環境では実行しない）
 */
export async function migrateEnvToVault() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('This function should only be used in development')
  }

  const migrations = [
    {
      name: SecretKeys.EBAY_API_KEY,
      envKey: 'EBAY_CLIENT_ID',
      description: 'eBay API Client ID'
    },
    {
      name: SecretKeys.EBAY_API_SECRET,
      envKey: 'EBAY_CLIENT_SECRET',
      description: 'eBay API Client Secret'
    },
    {
      name: SecretKeys.GEMINI_API_KEY,
      envKey: 'GEMINI_API_KEY',
      description: 'Google Gemini Pro API Key'
    }
  ]

  const results = []

  for (const migration of migrations) {
    const envValue = process.env[migration.envKey]

    if (envValue) {
      try {
        await setSecret(migration.name, envValue, migration.description)
        results.push({ name: migration.name, status: 'success' })
        console.log(`✅ Migrated ${migration.name}`)
      } catch (error) {
        results.push({ name: migration.name, status: 'failed', error })
        console.error(`❌ Failed to migrate ${migration.name}:`, error)
      }
    } else {
      results.push({ name: migration.name, status: 'skipped', reason: 'env not found' })
      console.warn(`⚠️ Skipped ${migration.name}: environment variable not found`)
    }
  }

  return results
}

/**
 * シークレットの取得を安全にキャッシュする（メモリ内）
 * 注意: サーバーサイドでのみ使用
 */
const secretCache = new Map<string, { value: string; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5分

export async function getCachedSecret(secretName: SecretKey): Promise<string> {
  const now = Date.now()
  const cached = secretCache.get(secretName)

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.value
  }

  const value = await getSecret(secretName)
  secretCache.set(secretName, { value, timestamp: now })

  return value
}

/**
 * キャッシュをクリア
 */
export function clearSecretCache() {
  secretCache.clear()
}
