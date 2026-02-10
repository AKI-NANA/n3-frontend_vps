/**
 * Login With Amazon (LWA) 認証フロー実装
 *
 * Amazon SP-APIの認証に必要なLWA (Login With Amazon) OAuth 2.0フローを実装
 * Refresh TokenからAccess Tokenを取得し、自動リフレッシュを行う
 */

import axios from 'axios'

/**
 * LWA認証エンドポイント
 */
const LWA_TOKEN_ENDPOINT = 'https://api.amazon.com/auth/o2/token'

/**
 * LWA認証に必要な環境変数
 */
interface LWACredentials {
  client_id: string
  client_secret: string
  refresh_token?: string
}

/**
 * Access Token レスポンス
 */
export interface AccessTokenResponse {
  access_token: string
  token_type: string // "bearer"
  expires_in: number // 有効期限（秒）
  refresh_token?: string // 新しいRefresh Token（オプション）
}

/**
 * トークン情報（内部管理用）
 */
export interface TokenInfo {
  access_token: string
  expires_at: Date // 有効期限の絶対時刻
  refresh_token: string
}

/**
 * 環境変数からLWA認証情報を取得
 */
function getLWACredentials(): LWACredentials {
  const client_id = process.env.AMAZON_SP_CLIENT_ID
  const client_secret = process.env.AMAZON_SP_CLIENT_SECRET
  const refresh_token = process.env.AMAZON_SP_REFRESH_TOKEN

  if (!client_id || !client_secret) {
    throw new Error(
      'AMAZON_SP_CLIENT_ID and AMAZON_SP_CLIENT_SECRET environment variables are required'
    )
  }

  return {
    client_id,
    client_secret,
    refresh_token,
  }
}

/**
 * Refresh TokenからAccess Tokenを取得
 *
 * @param refreshToken - Refresh Token
 * @returns Access Token情報
 */
export async function getAccessToken(refreshToken: string): Promise<TokenInfo> {
  const credentials = getLWACredentials()

  try {
    const response = await axios.post<AccessTokenResponse>(
      LWA_TOKEN_ENDPOINT,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: credentials.client_id,
        client_secret: credentials.client_secret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const { access_token, expires_in, refresh_token: new_refresh_token } = response.data

    // 有効期限を計算（現在時刻 + expires_in秒 - 60秒のバッファ）
    const expiresAt = new Date(Date.now() + (expires_in - 60) * 1000)

    return {
      access_token,
      expires_at: expiresAt,
      refresh_token: new_refresh_token || refreshToken,
    }
  } catch (error: any) {
    console.error('Failed to get access token from LWA:', error.response?.data || error.message)
    throw new Error(`LWA authentication failed: ${error.response?.data?.error_description || error.message}`)
  }
}

/**
 * Authorization Codeから初回のRefresh Tokenを取得
 *
 * これはOAuth認証フローの最初のステップで、ユーザーがAmazonにログインした後に
 * リダイレクトされたURLから取得したAuthorization Codeを使用します
 *
 * @param authorizationCode - Amazon OAuthで取得したAuthorization Code
 * @param redirectUri - OAuth設定時に登録したRedirect URI
 * @returns Refresh TokenとAccess Token
 */
export async function exchangeAuthorizationCode(
  authorizationCode: string,
  redirectUri: string
): Promise<TokenInfo> {
  const credentials = getLWACredentials()

  try {
    const response = await axios.post<AccessTokenResponse>(
      LWA_TOKEN_ENDPOINT,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: authorizationCode,
        client_id: credentials.client_id,
        client_secret: credentials.client_secret,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const { access_token, expires_in, refresh_token } = response.data

    if (!refresh_token) {
      throw new Error('Refresh token not returned from LWA')
    }

    const expiresAt = new Date(Date.now() + (expires_in - 60) * 1000)

    return {
      access_token,
      expires_at: expiresAt,
      refresh_token,
    }
  } catch (error: any) {
    console.error('Failed to exchange authorization code:', error.response?.data || error.message)
    throw new Error(
      `Authorization code exchange failed: ${error.response?.data?.error_description || error.message}`
    )
  }
}

/**
 * Access Tokenが有効期限切れかチェック
 *
 * @param expiresAt - 有効期限の絶対時刻
 * @returns 期限切れの場合true
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() >= expiresAt
}

/**
 * OAuth認証URLを生成
 *
 * ユーザーをAmazonのログインページにリダイレクトするためのURLを生成
 *
 * @param redirectUri - OAuth設定時に登録したRedirect URI
 * @param state - CSRF対策用のランダムな状態値（推奨）
 * @returns Amazon OAuthログインURL
 */
export function generateAuthorizationUrl(redirectUri: string, state?: string): string {
  const credentials = getLWACredentials()

  const params = new URLSearchParams({
    client_id: credentials.client_id,
    scope: 'profile', // SP-APIの場合、通常はprofileスコープを使用
    response_type: 'code',
    redirect_uri: redirectUri,
  })

  if (state) {
    params.append('state', state)
  }

  return `https://www.amazon.com/ap/oa?${params.toString()}`
}

/**
 * トークンマネージャークラス
 *
 * Access Tokenの自動リフレッシュを管理
 */
export class TokenManager {
  private tokenInfo: TokenInfo | null = null
  private refreshPromise: Promise<TokenInfo> | null = null

  constructor(private refreshToken: string) {}

  /**
   * 有効なAccess Tokenを取得（必要に応じて自動リフレッシュ）
   */
  async getValidAccessToken(): Promise<string> {
    // トークン情報がない、または期限切れの場合
    if (!this.tokenInfo || isTokenExpired(this.tokenInfo.expires_at)) {
      // 既にリフレッシュ中の場合は、その結果を待つ
      if (this.refreshPromise) {
        this.tokenInfo = await this.refreshPromise
      } else {
        // 新規にリフレッシュ
        this.refreshPromise = this.refreshAccessToken()
        this.tokenInfo = await this.refreshPromise
        this.refreshPromise = null
      }
    }

    return this.tokenInfo.access_token
  }

  /**
   * Access Tokenをリフレッシュ
   */
  private async refreshAccessToken(): Promise<TokenInfo> {
    console.log('Refreshing Amazon SP-API access token...')

    const tokenInfo = await getAccessToken(this.refreshToken)

    // Refresh Tokenが更新された場合は保存
    if (tokenInfo.refresh_token !== this.refreshToken) {
      this.refreshToken = tokenInfo.refresh_token
      console.log('Refresh token updated')
    }

    return tokenInfo
  }

  /**
   * 現在のRefresh Tokenを取得
   */
  getRefreshToken(): string {
    return this.refreshToken
  }

  /**
   * Refresh Tokenを更新
   */
  setRefreshToken(refreshToken: string): void {
    this.refreshToken = refreshToken
    this.tokenInfo = null // トークン情報をクリア
  }
}
