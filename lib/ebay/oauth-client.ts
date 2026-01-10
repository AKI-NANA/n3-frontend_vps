/**
 * eBay OAuth Client（自動リフレッシュ対応 + P0暗号化対応）
 */

import { EncryptionManager, getEbayOAuthCredentials } from '@/lib/security/encryption'

interface OAuthTokens {
  access_token: string
  refresh_token: string
  expires_at: number // Unix timestamp
}

export class EbayOAuthClient {
  private static instance: EbayOAuthClient

  private constructor() {}

  static getInstance(): EbayOAuthClient {
    if (!this.instance) {
      this.instance = new EbayOAuthClient()
    }
    return this.instance
  }

  /**
   * アクセストークン取得（自動リフレッシュ + 暗号化ストレージ対応）
   */
  async getAccessToken(): Promise<string> {
    // 暗号化ストレージからトークン取得
    const { accessToken, refreshToken } = await EncryptionManager.retrieveOAuthTokens(
      'ebay_oauth',
      { marketplace: 'ebay' }
    )

    if (!accessToken || !refreshToken) {
      throw new Error('eBay OAuth tokens not found in encrypted storage. Please run initial OAuth flow.')
    }

    // TODO: トークン有効期限チェック（encrypted_credentials.expires_atを使用）
    // 簡易実装: とりあえず毎回リフレッシュ（本来はexpires_atチェック）

    // リフレッシュトークンで更新
    await this.refreshAccessToken(refreshToken)

    // 更新後のアクセストークンを再取得
    const { accessToken: newAccessToken } = await EncryptionManager.retrieveOAuthTokens(
      'ebay_oauth',
      { marketplace: 'ebay' }
    )

    if (!newAccessToken) {
      throw new Error('Failed to retrieve refreshed access token')
    }

    return newAccessToken
  }

  /**
   * トークンリフレッシュ（暗号化ストレージへ保存）
   */
  private async refreshAccessToken(refreshToken: string): Promise<void> {
    const { clientId, clientSecret } = await getEbayOAuthCredentials()

    if (!clientId || !clientSecret) {
      throw new Error('eBay OAuth credentials not configured')
    }

    const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      throw new Error(`eBay token refresh failed: ${response.statusText}`)
    }

    const data = await response.json()

    // 暗号化ストレージへ保存
    await EncryptionManager.storeOAuthTokens(
      'ebay_oauth',
      data.access_token,
      data.refresh_token || refreshToken,
      data.expires_in,
      { marketplace: 'ebay' }
    )

    console.log('✅ eBay OAuth token refreshed and encrypted')
  }

  /**
   * 初回OAuth認証フロー完了後のトークン保存
   * 手動OAuth後に一度だけ実行
   */
  async storeInitialTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn: number
  ): Promise<void> {
    await EncryptionManager.storeOAuthTokens(
      'ebay_oauth',
      accessToken,
      refreshToken,
      expiresIn,
      { marketplace: 'ebay' }
    )
    console.log('✅ eBay initial OAuth tokens encrypted and stored')
  }
}
