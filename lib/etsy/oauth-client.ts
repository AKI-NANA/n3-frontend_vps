/**
 * Etsy OAuth Client（自動リフレッシュ対応 + P0暗号化対応）
 */

import { EncryptionManager, getEtsyApiKey } from '@/lib/security/encryption'

interface OAuthTokens {
  access_token: string
  refresh_token: string
  expires_at: number
}

export class EtsyOAuthClient {
  private static instance: EtsyOAuthClient

  private constructor() {}

  static getInstance(): EtsyOAuthClient {
    if (!this.instance) {
      this.instance = new EtsyOAuthClient()
    }
    return this.instance
  }

  /**
   * アクセストークン取得（自動リフレッシュ + 暗号化ストレージ対応）
   */
  async getAccessToken(): Promise<string> {
    // 暗号化ストレージからトークン取得
    const { accessToken, refreshToken } = await EncryptionManager.retrieveOAuthTokens(
      'etsy_oauth',
      { marketplace: 'etsy' }
    )

    if (!accessToken || !refreshToken) {
      throw new Error('Etsy OAuth tokens not found in encrypted storage. Please run initial OAuth flow.')
    }

    // リフレッシュトークンで更新
    await this.refreshAccessToken(refreshToken)

    // 更新後のアクセストークンを再取得
    const { accessToken: newAccessToken } = await EncryptionManager.retrieveOAuthTokens(
      'etsy_oauth',
      { marketplace: 'etsy' }
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
    const apiKey = await getEtsyApiKey()

    if (!apiKey) {
      throw new Error('Etsy API key not configured')
    }

    const response = await fetch('https://api.etsy.com/v3/public/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: apiKey,
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      throw new Error(`Etsy token refresh failed: ${response.statusText}`)
    }

    const data = await response.json()

    // 暗号化ストレージへ保存
    await EncryptionManager.storeOAuthTokens(
      'etsy_oauth',
      data.access_token,
      data.refresh_token || refreshToken,
      data.expires_in,
      { marketplace: 'etsy' }
    )

    console.log('✅ Etsy OAuth token refreshed and encrypted')
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
      'etsy_oauth',
      accessToken,
      refreshToken,
      expiresIn,
      { marketplace: 'etsy' }
    )
    console.log('✅ Etsy initial OAuth tokens encrypted and stored')
  }
}
