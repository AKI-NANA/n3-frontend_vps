/**
 * セキュアトークン管理サービス
 * pgsodium暗号化と統合
 */

import { supabase } from '@/lib/supabase/client'

/**
 * 暗号化されたAPIキーを保存
 */
export async function storeEncryptedApiKey(
  serviceName: string,
  apiKey: string,
  apiSecret?: string,
  config?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('store_encrypted_api_key', {
      p_service_name: serviceName,
      p_api_key: apiKey,
      p_api_secret: apiSecret || null,
      p_config: config || null
    })

    if (error) {
      console.error('Failed to store encrypted API key:', error)
      return { success: false, error: error.message }
    }

    console.log(`API key for ${serviceName} encrypted and stored successfully`)
    return { success: true }
  } catch (error) {
    console.error('Error storing encrypted API key:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

/**
 * 暗号化されたAPIキーを取得（復号化）
 */
export async function getDecryptedApiKey(
  serviceName: string
): Promise<{
  apiKey?: string
  apiSecret?: string
  config?: Record<string, any>
  error?: string
}> {
  try {
    const { data, error } = await supabase.rpc('get_decrypted_api_key', {
      p_service_name: serviceName
    })

    if (error) {
      console.error('Failed to get decrypted API key:', error)
      return { error: error.message }
    }

    if (!data || data.length === 0) {
      return { error: `API key for ${serviceName} not found` }
    }

    const keyData = data[0]
    return {
      apiKey: keyData.api_key,
      apiSecret: keyData.api_secret,
      config: keyData.config
    }
  } catch (error) {
    console.error('Error getting decrypted API key:', error)
    return {
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

/**
 * eBayトークンを暗号化して保存
 * pgsodiumトリガーが自動的に暗号化
 */
export async function saveEncryptedEbayToken(
  userId: string,
  ebayUserId: string,
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
  scope?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

    // access_token と refresh_token を渡すと、トリガーが自動的に暗号化
    const { data, error } = await supabase
      .from('ebay_user_tokens')
      .upsert({
        user_id: userId,
        ebay_user_id: ebayUserId,
        access_token: accessToken, // トリガーで暗号化される
        refresh_token: refreshToken, // トリガーで暗号化される
        token_expires_at: expiresAt,
        scope,
        is_active: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,ebay_user_id'
      })
      .select()

    if (error) {
      console.error('Failed to save encrypted eBay token:', error)
      return { success: false, error: error.message }
    }

    console.log('eBay token encrypted and saved successfully')
    return { success: true }
  } catch (error) {
    console.error('Error saving encrypted eBay token:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

/**
 * 復号化されたeBayトークンを取得
 * ebay_user_tokens_decrypted ビューを使用
 */
export async function getDecryptedEbayToken(
  userId: string
): Promise<{
  accessToken?: string
  refreshToken?: string
  expiresAt?: string
  ebayUserId?: string
  error?: string
}> {
  try {
    const { data, error } = await supabase
      .from('ebay_user_tokens_decrypted')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Failed to get decrypted eBay token:', error)
      return { error: error.message }
    }

    if (!data) {
      return { error: 'eBay token not found' }
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.token_expires_at,
      ebayUserId: data.ebay_user_id
    }
  } catch (error) {
    console.error('Error getting decrypted eBay token:', error)
    return {
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

/**
 * 暗号化アクセスログを記録
 */
export async function logEncryptionAccess(
  operation: 'encrypt' | 'decrypt' | 'access',
  serviceName?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('encryption_access_logs').insert({
      user_id: user?.id,
      operation,
      service_name: serviceName,
      ip_address: ipAddress,
      user_agent: userAgent
    })
  } catch (error) {
    // ログ記録失敗は静かに処理
    console.error('Failed to log encryption access:', error)
  }
}

/**
 * 初期セットアップ: 環境変数からAPIキーを暗号化して保存
 */
export async function initializeEncryptedApiKeys(): Promise<void> {
  console.log('Initializing encrypted API keys...')

  // eBay APIキー
  if (process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET) {
    await storeEncryptedApiKey(
      'ebay',
      process.env.EBAY_CLIENT_ID,
      process.env.EBAY_CLIENT_SECRET,
      {
        dev_id: process.env.EBAY_DEV_ID,
        refresh_token: process.env.EBAY_REFRESH_TOKEN
      }
    )
  }

  // Gemini APIキー
  if (process.env.GEMINI_API_KEY) {
    await storeEncryptedApiKey('gemini', process.env.GEMINI_API_KEY)
  }

  // Amazon APIキー
  if (process.env.AMAZON_ACCESS_KEY && process.env.AMAZON_SECRET_KEY) {
    await storeEncryptedApiKey(
      'amazon',
      process.env.AMAZON_ACCESS_KEY,
      process.env.AMAZON_SECRET_KEY
    )
  }

  console.log('Encrypted API keys initialized')
}

/**
 * 環境変数の代わりに暗号化されたAPIキーを使用
 */
export async function getEbayCredentials(): Promise<{
  clientId?: string
  clientSecret?: string
  devId?: string
  refreshToken?: string
  error?: string
}> {
  const result = await getDecryptedApiKey('ebay')

  if (result.error) {
    return { error: result.error }
  }

  return {
    clientId: result.apiKey,
    clientSecret: result.apiSecret,
    devId: result.config?.dev_id,
    refreshToken: result.config?.refresh_token
  }
}

/**
 * Gemini APIキーを取得
 */
export async function getGeminiApiKey(): Promise<string | null> {
  const result = await getDecryptedApiKey('gemini')
  return result.apiKey || null
}

/**
 * Amazon認証情報を取得
 */
export async function getAmazonCredentials(): Promise<{
  accessKey?: string
  secretKey?: string
  error?: string
}> {
  const result = await getDecryptedApiKey('amazon')

  if (result.error) {
    return { error: result.error }
  }

  return {
    accessKey: result.apiKey,
    secretKey: result.apiSecret
  }
}
