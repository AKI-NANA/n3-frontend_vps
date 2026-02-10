/**
 * Shopee OAuth Client（自動リフレッシュ対応 + P0暗号化対応）
 */

import { EncryptionManager, getShopeeOAuthCredentials } from '@/lib/security/encryption'

interface OAuthTokens {
  access_token: string
  refresh_token: string
  expires_at: number
}

export class ShopeeOAuthClient {
  private static instance: ShopeeOAuthClient

  private constructor() {}

  static getInstance(): ShopeeOAuthClient {
    if (!this.instance) {
      this.instance = new ShopeeOAuthClient()
    }
    return this.instance
  }

  /**
   * アクセストークン取得（自動リフレッシュ + 暗号化ストレージ対応）
   */
  async getAccessToken(): Promise<string> {
    // 暗号化ストレージからトークン取得
    const { accessToken, refreshToken } = await EncryptionManager.retrieveOAuthTokens(
      'shopee_oauth',
      { marketplace: 'shopee' }
    )

    if (!accessToken || !refreshToken) {
      throw new Error('Shopee OAuth tokens not found in encrypted storage. Please run initial OAuth flow.')
    }

    // リフレッシュトークンで更新
    await this.refreshAccessToken(refreshToken)

    // 更新後のアクセストークンを再取得
    const { accessToken: newAccessToken } = await EncryptionManager.retrieveOAuthTokens(
      'shopee_oauth',
      { marketplace: 'shopee' }
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
    const { partnerId, partnerKey } = await getShopeeOAuthCredentials()

    if (!partnerId || !partnerKey) {
      throw new Error('Shopee OAuth credentials not configured')
    }

    const timestamp = Math.floor(Date.now() / 1000)
    const path = '/api/v2/auth/access_token/get'

    const response = await fetch(`https://partner.shopeemobile.com${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        partner_id: parseInt(partnerId),
        refresh_token: refreshToken,
        timestamp,
      }),
    })

    if (!response.ok) {
      throw new Error(`Shopee token refresh failed: ${response.statusText}`)
    }

    const data = await response.json()

    // 暗号化ストレージへ保存
    await EncryptionManager.storeOAuthTokens(
      'shopee_oauth',
      data.access_token,
      data.refresh_token || refreshToken,
      data.expire_in,
      { marketplace: 'shopee' }
    )

    console.log('✅ Shopee OAuth token refreshed and encrypted')
  }

  /**
   * 初回OAuth認証フロー完了後のトークン保存
   */
  async storeInitialTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn: number
  ): Promise<void> {
    await EncryptionManager.storeOAuthTokens(
      'shopee_oauth',
      accessToken,
      refreshToken,
      expiresIn,
      { marketplace: 'shopee' }
    )
    console.log('✅ Shopee initial OAuth tokens encrypted and stored')
  }
}
