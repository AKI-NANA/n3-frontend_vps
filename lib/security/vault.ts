/**
 * Supabase Vault (pgsodium) を使用した認証情報の暗号化・復号化
 * P0: セキュリティ最優先事項
 */

import { supabase } from '@/lib/supabase'

/**
 * 認証情報を暗号化してVaultに保存
 */
export async function encryptCredential(
  name: string,
  value: string
): Promise<{ success: boolean; secret_id?: string; error?: string }> {
  try {
    // Supabase Vault にシークレットを挿入
    const { data, error } = await supabase.rpc('vault.create_secret', {
      secret: value,
      name: name,
    })

    if (error) {
      console.error('[Vault] 暗号化エラー:', error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      secret_id: data,
    }
  } catch (error: any) {
    console.error('[Vault] 暗号化例外:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Vaultから認証情報を復号化して取得
 */
export async function decryptCredential(
  secret_id: string
): Promise<{ success: boolean; value?: string; error?: string }> {
  try {
    // Supabase Vault からシークレットを取得
    const { data, error } = await supabase.rpc('vault.decrypted_secrets', {
      secret_id: secret_id,
    })

    if (error) {
      console.error('[Vault] 復号化エラー:', error)
      return { success: false, error: error.message }
    }

    if (!data || data.length === 0) {
      return { success: false, error: 'シークレットが見つかりません' }
    }

    return {
      success: true,
      value: data[0].decrypted_secret,
    }
  } catch (error: any) {
    console.error('[Vault] 復号化例外:', error)
    return { success: false, error: error.message }
  }
}

/**
 * marketplace_credentials テーブルに暗号化された認証情報を保存
 */
export async function saveMarketplaceCredentials(
  marketplace: string,
  credentials: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    // 各フィールドを暗号化
    const encryptedFields: Record<string, string> = {}

    for (const [key, value] of Object.entries(credentials)) {
      if (typeof value === 'string' && value) {
        const result = await encryptCredential(`${marketplace}_${key}`, value)
        if (result.success && result.secret_id) {
          encryptedFields[`${key}_encrypted`] = result.secret_id
        } else {
          return { success: false, error: `${key}の暗号化に失敗しました` }
        }
      }
    }

    // DBに保存（secret_idのみ保存）
    const { error } = await supabase
      .from('marketplace_credentials')
      .upsert({
        marketplace,
        ...encryptedFields,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('[Vault] 認証情報保存エラー:', error)
      return { success: false, error: error.message }
    }

    console.log(`[Vault] ${marketplace} の認証情報を暗号化して保存しました`)
    return { success: true }
  } catch (error: any) {
    console.error('[Vault] 認証情報保存例外:', error)
    return { success: false, error: error.message }
  }
}

/**
 * marketplace_credentials テーブルから復号化された認証情報を取得
 */
export async function getMarketplaceCredentials(
  marketplace: string
): Promise<{ success: boolean; credentials?: Record<string, any>; error?: string }> {
  try {
    // DBから暗号化されたsecret_idを取得
    const { data, error } = await supabase
      .from('marketplace_credentials')
      .select('*')
      .eq('marketplace', marketplace)
      .single()

    if (error) {
      console.error('[Vault] 認証情報取得エラー:', error)
      return { success: false, error: error.message }
    }

    if (!data) {
      return { success: false, error: '認証情報が見つかりません' }
    }

    // 各フィールドを復号化
    const credentials: Record<string, any> = {}

    for (const [key, value] of Object.entries(data)) {
      if (key.endsWith('_encrypted') && typeof value === 'string') {
        const fieldName = key.replace('_encrypted', '')
        const result = await decryptCredential(value)

        if (result.success && result.value) {
          credentials[fieldName] = result.value
        } else {
          console.error(`[Vault] ${fieldName}の復号化に失敗しました`)
        }
      } else if (!key.endsWith('_encrypted')) {
        // 暗号化されていないフィールドはそのまま
        credentials[key] = value
      }
    }

    return {
      success: true,
      credentials,
    }
  } catch (error: any) {
    console.error('[Vault] 認証情報取得例外:', error)
    return { success: false, error: error.message }
  }
}

/**
 * マイグレーション: 既存の平文認証情報を暗号化
 */
export async function migrateToEncryptedCredentials(): Promise<{
  success: boolean
  migrated: number
  failed: number
  errors: string[]
}> {
  console.log('[Vault] 認証情報の暗号化マイグレーション開始')

  try {
    // 既存の認証情報を取得
    const { data: credentials, error } = await supabase.from('marketplace_credentials').select('*')

    if (error) {
      return { success: false, migrated: 0, failed: 0, errors: [error.message] }
    }

    if (!credentials || credentials.length === 0) {
      console.log('[Vault] マイグレーション対象の認証情報なし')
      return { success: true, migrated: 0, failed: 0, errors: [] }
    }

    let migrated = 0
    let failed = 0
    const errors: string[] = []

    for (const cred of credentials) {
      // 平文フィールドを検出して暗号化
      const fieldsToEncrypt = ['access_token', 'refresh_token', 'client_secret', 'partner_key', 'api_key']
      const encryptedFields: Record<string, string> = {}

      for (const field of fieldsToEncrypt) {
        if (cred[field] && typeof cred[field] === 'string' && !cred[`${field}_encrypted`]) {
          const result = await encryptCredential(`${cred.marketplace}_${field}`, cred[field])

          if (result.success && result.secret_id) {
            encryptedFields[`${field}_encrypted`] = result.secret_id
            // 平文フィールドをnullに設定
            encryptedFields[field] = null as any
          } else {
            errors.push(`${cred.marketplace}の${field}暗号化失敗`)
            failed++
            continue
          }
        }
      }

      if (Object.keys(encryptedFields).length > 0) {
        const { error: updateError } = await supabase
          .from('marketplace_credentials')
          .update(encryptedFields)
          .eq('id', cred.id)

        if (updateError) {
          errors.push(`${cred.marketplace}の更新失敗: ${updateError.message}`)
          failed++
        } else {
          migrated++
          console.log(`[Vault] ${cred.marketplace}の認証情報を暗号化しました`)
        }
      }
    }

    console.log(`[Vault] マイグレーション完了: ${migrated}件成功, ${failed}件失敗`)

    return {
      success: failed === 0,
      migrated,
      failed,
      errors,
    }
  } catch (error: any) {
    console.error('[Vault] マイグレーションエラー:', error)
    return {
      success: false,
      migrated: 0,
      failed: 0,
      errors: [error.message],
    }
  }
}
