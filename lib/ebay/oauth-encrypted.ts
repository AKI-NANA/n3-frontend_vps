// lib/ebay/oauth-encrypted.ts
/**
 * eBay OAuth 2.0 Token管理 (暗号化版)
 *
 * 🔐 P0セキュリティ実装: 暗号化ストレージから認証情報を取得
 *
 * User Token方式（18ヶ月有効）
 *
 * 使用方法:
 * - 既存の lib/ebay/oauth.ts を段階的にこのファイルに置き換え
 * - 環境変数からの移行が完了したら、oauth.ts をこのファイルで上書き
 */

import { getEbayCredentials } from '@/lib/security/encryption-service'

interface EbayAccount {
  userToken: string
  clientId: string
  clientSecret: string
  devId: string
  certId: string
  authToken: string
  refreshToken: string
  paypalEmail: string
}

// キャッシュ: 認証情報の取得はコストが高いので、メモリにキャッシュ
const credentialCache = new Map<string, { data: EbayAccount; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5分

/**
 * 暗号化ストレージから認証情報を取得（キャッシュ付き）
 */
async function getEncryptedCredentials(account: 'green' | 'mjt' | 'default'): Promise<EbayAccount> {
  const cacheKey = `ebay_${account}`
  const cached = credentialCache.get(cacheKey)

  // キャッシュが有効な場合は返す
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  // 暗号化ストレージから取得
  try {
    const credentials = await getEbayCredentials(account)

    const accountData: EbayAccount = {
      userToken: credentials.userToken || '',
      clientId: credentials.clientId || '',
      clientSecret: credentials.clientSecret || '',
      devId: credentials.devId || '',
      certId: credentials.certId || '',
      authToken: credentials.authToken || '',
      refreshToken: credentials.refreshToken || '',
      paypalEmail: credentials.paypalEmail || ''
    }

    // キャッシュに保存
    credentialCache.set(cacheKey, {
      data: accountData,
      timestamp: Date.now()
    })

    return accountData
  } catch (error) {
    console.error(`❌ eBay ${account} 認証情報の取得に失敗:`, error)

    // フォールバック: 環境変数から取得（移行期間用）
    console.warn('⚠️  フォールバック: 環境変数から認証情報を取得します')
    return getFallbackCredentials(account)
  }
}

/**
 * フォールバック: 環境変数から認証情報を取得（移行期間用）
 */
function getFallbackCredentials(account: 'green' | 'mjt' | 'default'): EbayAccount {
  const suffix = account === 'default' ? '' : `_${account.toUpperCase()}`

  return {
    userToken: process.env[`EBAY_USER_TOKEN${suffix}`] || process.env.EBAY_AUTH_TOKEN || '',
    clientId: process.env[`EBAY_CLIENT_ID${suffix}`] || '',
    clientSecret: process.env[`EBAY_CLIENT_SECRET${suffix}`] || '',
    devId: process.env.EBAY_DEV_ID || '',
    certId: process.env[`EBAY_CERT_ID${suffix}`] || '',
    authToken: process.env[`EBAY_AUTH_TOKEN${suffix}`] || process.env.EBAY_AUTH_TOKEN || '',
    refreshToken: process.env[`EBAY_REFRESH_TOKEN${suffix}`] || '',
    paypalEmail: process.env[`EBAY_PAYPAL_EMAIL${suffix}`] || ''
  }
}

/**
 * アクセストークン取得（User Token使用）
 *
 * @param account - アカウント識別子
 * @returns eBay User Token
 */
export async function getAccessToken(account: 'account1' | 'account2' = 'account1'): Promise<string> {
  // アカウント識別子を内部形式に変換
  const accountKey = account === 'account1' ? 'default' : 'green'

  const credentials = await getEncryptedCredentials(accountKey)

  if (!credentials.userToken) {
    throw new Error(`❌ eBay ${account} のUser Tokenが設定されていません`)
  }

  // User Tokenはそのまま返す（18ヶ月有効）
  return credentials.userToken
}

/**
 * eBay認証情報を取得（全フィールド）
 *
 * @param account - アカウント識別子
 * @returns eBay認証情報
 */
export async function getEbayAccountCredentials(
  account: 'green' | 'mjt' | 'default' = 'default'
): Promise<EbayAccount> {
  return getEncryptedCredentials(account)
}

/**
 * トークンキャッシュをクリア
 */
export function clearTokenCache() {
  credentialCache.clear()
  console.log('🔄 eBay認証情報キャッシュをクリアしました')
}

/**
 * 認証情報の有効性をチェック
 *
 * @param account - アカウント識別子
 * @returns 有効な場合true
 */
export async function validateCredentials(
  account: 'green' | 'mjt' | 'default' = 'default'
): Promise<boolean> {
  try {
    const credentials = await getEncryptedCredentials(account)

    // 必須フィールドの確認
    const requiredFields = ['userToken', 'clientId', 'clientSecret']
    const isValid = requiredFields.every(field =>
      credentials[field as keyof EbayAccount] &&
      credentials[field as keyof EbayAccount].length > 0
    )

    return isValid
  } catch (error) {
    console.error(`❌ eBay ${account} 認証情報の検証に失敗:`, error)
    return false
  }
}

// レガシー互換性のため、デフォルトエクスポート
export default {
  getAccessToken,
  getEbayAccountCredentials,
  clearTokenCache,
  validateCredentials
}
