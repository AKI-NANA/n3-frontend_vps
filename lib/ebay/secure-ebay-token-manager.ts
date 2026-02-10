/**
 * P0: セキュアなeBayトークンマネージャー
 *
 * ebay_tokensテーブルと統合し、認証フローで保存されたトークンを使用
 * 環境変数へのフォールバック機能付き
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export interface EbayCredentials {
  clientId: string
  clientSecret: string
  refreshToken: string
}

/**
 * セキュアなeBayトークン管理
 * 🆕 P1: 任意のアカウント名に対応（DB登録アカウント）
 * 🆕 P2: ebay_tokensテーブルを使用（encrypted_credentialsは廃止）
 */
export class SecureEbayTokenManager {
  private account: string
  private accessToken: string | null = null
  private tokenExpiresAt: number = 0

  constructor(account: string = 'mjt') {
    this.account = account
    console.log(`🔧 セキュアeBayトークンマネージャーを初期化 (${account.toUpperCase()})`)
  }

  /**
   * 認証情報を取得（ebay_tokens DB → 環境変数の順）
   */
  private async getCredentials(): Promise<EbayCredentials> {
    const accountUpper = this.account.toUpperCase()

    try {
      // 1. ebay_tokensテーブルから取得を試行
      console.log(`🔍 ebay_tokensテーブルから認証情報を取得中... (${this.account})`)

      // Supabaseクライアントを直接作成（Route Handler内での使用に対応）
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        console.warn('⚠️ Supabase環境変数が未設定。環境変数フォールバックを使用')
        throw new Error('Supabase環境変数が未設定')
      }

      const supabase = createSupabaseClient(supabaseUrl, supabaseKey)
      const { data: tokenData, error } = await supabase
        .from('ebay_tokens')
        .select('refresh_token, access_token, expires_at')
        .eq('account', this.account)
        .maybeSingle()

      if (error) {
        console.warn(`⚠️ ebay_tokens取得エラー: ${error.message}`)
      } else if (tokenData?.refresh_token) {
        // 🔍 デバッグ: refresh_tokenの先頭をログ出力
        console.log(`🔑 ${this.account}のrefresh_token先頭: ${tokenData.refresh_token.substring(0, 30)}...`)
        
        // DBからrefresh_tokenを取得、client_idとclient_secretは環境変数から
        const clientId =
          process.env[`EBAY_CLIENT_ID_${accountUpper}`] ||
          process.env.EBAY_CLIENT_ID ||
          ''
        const clientSecret =
          process.env[`EBAY_CLIENT_SECRET_${accountUpper}`] ||
          process.env.EBAY_CLIENT_SECRET ||
          ''

        if (clientId && clientSecret) {
          console.log(`✅ ebay_tokensからrefresh_tokenを取得 (${this.account})`)
          return {
            clientId,
            clientSecret,
            refreshToken: tokenData.refresh_token
          }
        }
      }

      console.log(`⚠️ DBに認証情報が見つかりません。環境変数にフォールバック (${this.account})`)
    } catch (error: any) {
      console.warn(`⚠️ DB取得エラー: ${error.message}. 環境変数にフォールバック`)
    }

    // 2. 環境変数からフォールバック
    const clientId =
      process.env[`EBAY_CLIENT_ID_${accountUpper}`] ||
      process.env.EBAY_CLIENT_ID ||
      ''
    const clientSecret =
      process.env[`EBAY_CLIENT_SECRET_${accountUpper}`] ||
      process.env.EBAY_CLIENT_SECRET ||
      ''
    const refreshToken =
      process.env[`EBAY_REFRESH_TOKEN_${accountUpper}`] ||
      process.env.EBAY_REFRESH_TOKEN ||
      ''

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error(
        `eBay認証情報が見つかりません (${accountUpper})。\n` +
          'データベースまたは環境変数に設定してください。\n' +
          `必要な環境変数:\n` +
          `  - EBAY_CLIENT_ID_${accountUpper}\n` +
          `  - EBAY_CLIENT_SECRET_${accountUpper}\n` +
          `  - EBAY_REFRESH_TOKEN_${accountUpper}\n\n` +
          `または /ebay-auth で再認証を実行してください。`
      )
    }

    console.log(`✅ 環境変数から認証情報を取得 (${this.account})`)
    return { clientId, clientSecret, refreshToken }
  }

  /**
   * トークンが有効か確認
   */
  private isTokenValid(): boolean {
    if (!this.accessToken) return false
    // 有効期限から5分前にリフレッシュ
    const isValid = this.tokenExpiresAt > Date.now() + 5 * 60 * 1000
    if (isValid) {
      const timeLeft = Math.floor((this.tokenExpiresAt - Date.now()) / 1000)
      console.log(
        `✅ キャッシュトークンは有効です (残り: ${Math.floor(timeLeft / 60)}分)`
      )
    }
    return isValid
  }

  /**
   * Access Token を取得（毎回リフレッシュして確実にフレッシュなトークンを使用）
   * 
   * 🔧 設計方針変更: DBキャッシュに依存せず、毎回refresh_tokenから新しいaccess_tokenを取得
   * これにより期限切れトークンを誤って使用するリスクを排除
   */
  async getAccessToken(): Promise<string> {
    // メモリキャッシュが有効（5分以上残っている）ならそれを使用
    if (this.isTokenValid() && this.accessToken) {
      console.log(`✅ メモリキャッシュのトークンを使用 (${this.account})`)
      return this.accessToken
    }

    // 🆕 毎回リフレッシュしてフレッシュなトークンを取得
    console.log(`🔄 フレッシュなアクセストークンを取得中... (${this.account})`)
    return await this.refreshAccessToken()
  }

  /**
   * DBからaccess_tokenを取得（有効な場合のみ）
   */
  private async getAccessTokenFromDB(): Promise<string | null> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return null
    }

    const supabase = createSupabaseClient(supabaseUrl, supabaseKey)
    const { data: tokenData, error } = await supabase
      .from('ebay_tokens')
      .select('access_token, expires_at')
      .eq('account', this.account)
      .maybeSingle()

    if (error || !tokenData?.access_token || !tokenData?.expires_at) {
      console.log(`⚠️ DBにaccess_tokenがありません (${this.account})`)
      return null
    }

    // 有効期限をチェック（5分の余裕を持たせる）
    const expiresAt = new Date(tokenData.expires_at).getTime()
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000

    // 🔍 デバッグログ追加
    console.log(`🔍 [${this.account}] トークン有効期限チェック:`)
    console.log(`   DB expires_at (raw): ${tokenData.expires_at}`)
    console.log(`   DB expires_at (ms): ${expiresAt}`)
    console.log(`   現在時刻 (ms): ${now}`)
    console.log(`   差分 (分): ${Math.floor((expiresAt - now) / 60000)}`)
    console.log(`   有効判定: ${expiresAt > now + fiveMinutes ? '有効' : '期限切れ'}`)

    if (expiresAt > now + fiveMinutes) {
      this.accessToken = tokenData.access_token
      this.tokenExpiresAt = expiresAt
      const remainingMinutes = Math.floor((expiresAt - now) / 60000)
      console.log(`💾 DBのaccess_tokenは有効です（残り: ${remainingMinutes}分）`)
      return tokenData.access_token
    }

    console.log('⚠️ DBのaccess_tokenは期限切れまたは期限間近 → リフレッシュが必要')
    return null
  }

  /**
   * Refresh Token を使用して Access Token をリフレッシュ
   */
  private async refreshAccessToken(): Promise<string> {
    const { clientId, clientSecret, refreshToken } =
      await this.getCredentials()

    const tokenUrl = 'https://api.ebay.com/identity/v1/oauth2/token'

    const params = new URLSearchParams()
    params.append('grant_type', 'refresh_token')
    params.append('refresh_token', refreshToken)
    // 🔧 Sell Inventory API等にアクセスするために必要な全スコープを指定
    params.append('scope', [
      'https://api.ebay.com/oauth/api_scope',
      'https://api.ebay.com/oauth/api_scope/sell.account',
      'https://api.ebay.com/oauth/api_scope/sell.fulfillment',
      'https://api.ebay.com/oauth/api_scope/sell.inventory',
      'https://api.ebay.com/oauth/api_scope/sell.marketing',
      'https://api.ebay.com/oauth/api_scope/sell.analytics.readonly'
    ].join(' '))

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    console.log(`📨 トークンリクエストを送信: POST ${tokenUrl}`)

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json'
        },
        body: params.toString()
      })

      console.log(`   レスポンスステータス: ${response.status}`)

      if (!response.ok) {
        const errorData = await response.text()
        console.error(`❌ トークン取得エラー (${response.status}):`)
        console.error(errorData)
        throw new Error(
          `Token refresh failed (${response.status}): ${errorData}`
        )
      }

      const data = (await response.json()) as {
        access_token: string
        expires_in: number
        token_type: string
        refresh_token?: string
      }

      this.accessToken = data.access_token
      this.tokenExpiresAt = Date.now() + data.expires_in * 1000

      console.log(`✅ アクセストークン取得成功`)
      console.log(
        `   有効期限: ${data.expires_in}秒 (${Math.floor(data.expires_in / 3600)}時間)`
      )
      console.log(
        `   トークンプレビュー: ${data.access_token.substring(0, 30)}...`
      )

      // 🆕 DBにも新しいaccess_tokenを保存
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        if (supabaseUrl && supabaseKey) {
          const supabase = createSupabaseClient(supabaseUrl, supabaseKey)
          const expiresAt = new Date(this.tokenExpiresAt).toISOString()
          
          const { error: updateError } = await supabase
            .from('ebay_tokens')
            .update({
              access_token: data.access_token,
              expires_at: expiresAt,
              updated_at: new Date().toISOString()
            })
            .eq('account', this.account)
          
          if (updateError) {
            console.warn(`⚠️ DB更新エラー: ${updateError.message}`)
          } else {
            console.log(`💾 DBにaccess_tokenを保存しました (expires: ${expiresAt})`)
          }
        }
      } catch (dbError: any) {
        console.warn(`⚠️ DB保存スキップ: ${dbError.message}`)
      }

      return this.accessToken
    } catch (error: any) {
      console.error('❌ トークンリフレッシュ失敗:', error.message)
      throw new Error(`Failed to refresh token: ${error.message}`)
    }
  }

  /**
   * トークン情報を表示
   */
  displayTokenInfo(): void {
    if (this.accessToken) {
      const timeLeft = Math.max(
        0,
        Math.floor((this.tokenExpiresAt - Date.now()) / 1000)
      )
      const hours = Math.floor(timeLeft / 3600)
      const minutes = Math.floor((timeLeft % 3600) / 60)
      const seconds = timeLeft % 60
      console.log(`📊 トークン情報:`)
      console.log(
        `   アクセストークン: ${this.accessToken.substring(0, 30)}...`
      )
      console.log(`   残り有効時間: ${hours}h ${minutes}m ${seconds}s`)
    } else {
      console.log('❌ トークンが取得されていません')
    }
  }
}

/**
 * セキュアeBay API クライアント
 * 🆕 P1: 任意のアカウント名に対応（DB登録アカウント）
 */
export class SecureEbayApiClient {
  public tokenManager: SecureEbayTokenManager
  private environment: string

  constructor(account: string = 'mjt') {
    this.tokenManager = new SecureEbayTokenManager(account)
    this.environment = process.env.EBAY_ENVIRONMENT || 'production'
  }

  /**
   * eBay API を呼び出し（トークンを自動リフレッシュ）
   */
  async callApi(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    retryCount = 0
  ): Promise<any> {
    const accessToken = await this.tokenManager.getAccessToken()

    const url = `https://api.ebay.com${endpoint}`
    console.log(`\n📤 eBay API 呼び出し: ${method} ${endpoint}`)

    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': 'en-US',
        'Content-Language': 'en-US',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
      }
    }

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url, options)
      console.log(`   ステータス: ${response.status}`)

      if (!response.ok) {
        const error = await response.text()
        console.error(`❌ エラー: ${error}`)

        // 401 の場合はトークンを再取得して再試行（1回のみ）
        if (response.status === 401 && retryCount === 0) {
          console.log(
            '⚠️  トークンが無効な可能性があります。再試行します...'
          )
          // トークンをクリアして再取得
          this.tokenManager['accessToken'] = null
          return await this.callApi(endpoint, method, body, retryCount + 1)
        }

        throw new Error(`API エラー (${response.status}): ${error}`)
      }

      const data = await response.json()
      console.log(`✅ リクエスト成功`)
      return data
    } catch (error: any) {
      console.error(`❌ リクエスト失敗: ${error.message}`)
      throw error
    }
  }

  /**
   * トークン情報を表示
   */
  displayTokenInfo(): void {
    this.tokenManager.displayTokenInfo()
  }
}
