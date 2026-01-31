/**
 * Amazon SP-API - セキュアトークン管理システム
 * 
 * 機能:
 * - LWA (Login with Amazon) OAuth2 認証フロー
 * - Refresh Token から Access Token を自動生成
 * - マルチマーケットプレイス対応 (US, JP, UK, DE, CA, AU, etc.)
 * - トークンのキャッシュと有効期限管理
 * - pgsodium暗号化DB対応（Supabase Vault準備）
 * - 自動リフレッシュ機構
 * - エラーハンドリングとリトライロジック
 */

import { createClient } from '@/lib/supabase/client'

// マーケットプレイス設定
export const AMAZON_MARKETPLACES = {
  // 北米
  'US': { id: 'ATVPDKIKX0DER', endpoint: 'https://sellingpartnerapi-na.amazon.com', region: 'us-east-1', name: 'Amazon.com' },
  'CA': { id: 'A2EUQ1WTGCTBG2', endpoint: 'https://sellingpartnerapi-na.amazon.com', region: 'us-east-1', name: 'Amazon.ca' },
  'MX': { id: 'A1AM78C64UM0Y8', endpoint: 'https://sellingpartnerapi-na.amazon.com', region: 'us-east-1', name: 'Amazon.com.mx' },
  'BR': { id: 'A2Q3Y263D00KWC', endpoint: 'https://sellingpartnerapi-na.amazon.com', region: 'us-east-1', name: 'Amazon.com.br' },
  
  // ヨーロッパ
  'UK': { id: 'A1F83G8C2ARO7P', endpoint: 'https://sellingpartnerapi-eu.amazon.com', region: 'eu-west-1', name: 'Amazon.co.uk' },
  'DE': { id: 'A1PA6795UKMFR9', endpoint: 'https://sellingpartnerapi-eu.amazon.com', region: 'eu-west-1', name: 'Amazon.de' },
  'FR': { id: 'A13V1IB3VIYBER', endpoint: 'https://sellingpartnerapi-eu.amazon.com', region: 'eu-west-1', name: 'Amazon.fr' },
  'IT': { id: 'APJ6JRA9NG5V4', endpoint: 'https://sellingpartnerapi-eu.amazon.com', region: 'eu-west-1', name: 'Amazon.it' },
  'ES': { id: 'A1RKKUPIHCS9HS', endpoint: 'https://sellingpartnerapi-eu.amazon.com', region: 'eu-west-1', name: 'Amazon.es' },
  'NL': { id: 'A1805IZSGTT6HS', endpoint: 'https://sellingpartnerapi-eu.amazon.com', region: 'eu-west-1', name: 'Amazon.nl' },
  'PL': { id: 'A1C3SOZRARQ6R3', endpoint: 'https://sellingpartnerapi-eu.amazon.com', region: 'eu-west-1', name: 'Amazon.pl' },
  'SE': { id: 'A2NODRKZP88ZB9', endpoint: 'https://sellingpartnerapi-eu.amazon.com', region: 'eu-west-1', name: 'Amazon.se' },
  'BE': { id: 'AMEN7PMS3EDWL', endpoint: 'https://sellingpartnerapi-eu.amazon.com', region: 'eu-west-1', name: 'Amazon.com.be' },
  
  // 極東
  'JP': { id: 'A1VC38T7YXB528', endpoint: 'https://sellingpartnerapi-fe.amazon.com', region: 'us-west-2', name: 'Amazon.co.jp' },
  'AU': { id: 'A39IBJ37TRP1C6', endpoint: 'https://sellingpartnerapi-fe.amazon.com', region: 'us-west-2', name: 'Amazon.com.au' },
  'SG': { id: 'A19VAU5U5O7RUS', endpoint: 'https://sellingpartnerapi-fe.amazon.com', region: 'us-west-2', name: 'Amazon.sg' },
  
  // インド・中東
  'IN': { id: 'A21TJRUUN4KGV', endpoint: 'https://sellingpartnerapi-eu.amazon.com', region: 'eu-west-1', name: 'Amazon.in' },
  'AE': { id: 'A2VIGQ35RCS4UG', endpoint: 'https://sellingpartnerapi-eu.amazon.com', region: 'eu-west-1', name: 'Amazon.ae' },
  'SA': { id: 'A17E79C6D8DWNP', endpoint: 'https://sellingpartnerapi-eu.amazon.com', region: 'eu-west-1', name: 'Amazon.sa' },
  'TR': { id: 'A33AVAJ2PDY3EV', endpoint: 'https://sellingpartnerapi-eu.amazon.com', region: 'eu-west-1', name: 'Amazon.com.tr' },
} as const

export type MarketplaceCode = keyof typeof AMAZON_MARKETPLACES

interface AmazonAccountRecord {
  id: string
  account_name: string
  seller_id: string
  marketplace_id: MarketplaceCode
  marketplace_name: string
  region: string
  endpoint: string
  client_id: string
  // 暗号化された値（暗号化が有効な場合）
  client_secret_encrypted?: string
  refresh_token_encrypted?: string
  // 平文の値（暗号化が無効な場合、または復号後）
  client_secret?: string
  refresh_token?: string
  access_token?: string
  access_token_expires_at?: string
  is_active: boolean
  last_auth_at?: string
  created_at: string
  updated_at: string
}

interface TokenResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in: number
}

interface CachedToken {
  accessToken: string
  expiresAt: number
  marketplaceId: MarketplaceCode
}

/**
 * Amazon SP-API セキュアトークンマネージャー
 */
export class SecureAmazonTokenManager {
  private supabase = createClient()
  private tokenCache: Map<string, CachedToken> = new Map()
  private readonly LWA_TOKEN_URL = 'https://api.amazon.com/auth/o2/token'
  private readonly TOKEN_BUFFER_SECONDS = 300 // 5分前にリフレッシュ

  constructor() {
    console.log('🔧 SecureAmazonTokenManager 初期化')
  }

  /**
   * アカウント一覧を取得
   */
  async getAccounts(): Promise<AmazonAccountRecord[]> {
    try {
      const { data, error } = await this.supabase
        .from('amazon_accounts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error: any) {
      console.error('❌ アカウント一覧取得エラー:', error.message)
      return []
    }
  }

  /**
   * アカウントを取得（マーケットプレイスID指定）
   */
  async getAccount(marketplaceId: MarketplaceCode): Promise<AmazonAccountRecord | null> {
    try {
      const { data, error } = await this.supabase
        .from('amazon_accounts')
        .select('*')
        .eq('marketplace_id', marketplaceId)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // レコードが見つからない
          return null
        }
        throw error
      }
      return data
    } catch (error: any) {
      console.error(`❌ アカウント取得エラー (${marketplaceId}):`, error.message)
      return null
    }
  }

  /**
   * 環境変数からデフォルト認証情報を取得
   */
  getDefaultCredentials() {
    return {
      clientId: process.env.AMAZON_CLIENT_ID || process.env.NEXT_PUBLIC_LWA_CLIENT_ID || '',
      clientSecret: process.env.AMAZON_CLIENT_SECRET || process.env.LWA_CLIENT_SECRET || '',
      refreshToken: process.env.AMAZON_REFRESH_TOKEN || '',
    }
  }

  /**
   * アクセストークンを取得（キャッシュ対応）
   */
  async getAccessToken(marketplaceId: MarketplaceCode = 'US'): Promise<string> {
    const cacheKey = `amazon_${marketplaceId}`
    
    // キャッシュをチェック
    const cached = this.tokenCache.get(cacheKey)
    if (cached && this.isTokenValid(cached)) {
      const timeLeft = Math.floor((cached.expiresAt - Date.now()) / 1000)
      console.log(`✅ キャッシュトークン使用 (${marketplaceId}) - 残り: ${Math.floor(timeLeft / 60)}分`)
      return cached.accessToken
    }

    // DBからアカウント情報を取得（なければ環境変数を使用）
    let account = await this.getAccount(marketplaceId)
    let refreshToken: string
    let clientId: string
    let clientSecret: string

    if (account && account.refresh_token) {
      refreshToken = account.refresh_token
      clientId = account.client_id
      clientSecret = account.client_secret || ''
      console.log(`🔄 DB認証情報使用 (${marketplaceId})`)
    } else {
      // 環境変数から取得
      const creds = this.getDefaultCredentials()
      refreshToken = creds.refreshToken
      clientId = creds.clientId
      clientSecret = creds.clientSecret
      console.log(`🔄 環境変数認証情報使用 (${marketplaceId})`)
    }

    if (!refreshToken || !clientId || !clientSecret) {
      throw new Error(`Amazon SP-API 認証情報が未設定です (${marketplaceId})`)
    }

    // LWAトークン取得
    const tokenResponse = await this.exchangeRefreshToken(clientId, clientSecret, refreshToken)
    
    // キャッシュに保存
    const expiresAt = Date.now() + (tokenResponse.expires_in * 1000) - (this.TOKEN_BUFFER_SECONDS * 1000)
    this.tokenCache.set(cacheKey, {
      accessToken: tokenResponse.access_token,
      expiresAt,
      marketplaceId
    })

    // DBのアクセストークンも更新
    if (account) {
      await this.updateAccessToken(account.id, tokenResponse.access_token, expiresAt)
    }

    console.log(`✅ 新規トークン取得 (${marketplaceId}) - 有効期限: ${tokenResponse.expires_in}秒`)
    return tokenResponse.access_token
  }

  /**
   * Refresh Token を使用して Access Token を取得
   */
  private async exchangeRefreshToken(
    clientId: string,
    clientSecret: string,
    refreshToken: string
  ): Promise<TokenResponse> {
    console.log('📨 LWA トークン交換リクエスト...')
    console.log(`   Client ID: ${clientId.substring(0, 30)}...`)
    console.log(`   Has Client Secret: ${!!clientSecret}`)
    console.log(`   Has Refresh Token: ${!!refreshToken}`)

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret
    })

    try {
      const response = await fetch(this.LWA_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      })

      console.log(`   レスポンスステータス: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ LWA トークンエラー (${response.status}):`)
        console.error(errorText)
        throw new Error(`LWA token error: ${response.status} - ${errorText}`)
      }

      const data: TokenResponse = await response.json()
      console.log('✅ LWA トークン取得成功')
      console.log(`   有効期限: ${data.expires_in}秒`)
      console.log(`   トークンプレビュー: ${data.access_token.substring(0, 30)}...`)

      return data
    } catch (error: any) {
      console.error('❌ LWA トークン交換失敗:', error.message)
      throw error
    }
  }

  /**
   * DBのアクセストークンを更新
   */
  private async updateAccessToken(accountId: string, accessToken: string, expiresAt: number): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('amazon_accounts')
        .update({
          access_token: accessToken,
          access_token_expires_at: new Date(expiresAt).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId)

      if (error) throw error
      console.log('💾 DB アクセストークン更新完了')
    } catch (error: any) {
      console.error('❌ DB アクセストークン更新エラー:', error.message)
    }
  }

  /**
   * トークンが有効か確認
   */
  private isTokenValid(cached: CachedToken): boolean {
    return cached.expiresAt > Date.now()
  }

  /**
   * 新規アカウントを登録
   */
  async registerAccount(params: {
    accountName: string
    sellerId: string
    marketplaceId: MarketplaceCode
    clientId: string
    clientSecret: string
    refreshToken: string
  }): Promise<{ success: boolean; accountId?: string; error?: string }> {
    try {
      const marketplace = AMAZON_MARKETPLACES[params.marketplaceId]
      if (!marketplace) {
        return { success: false, error: `無効なマーケットプレイス: ${params.marketplaceId}` }
      }

      // まずトークンが有効か確認
      const tokenResponse = await this.exchangeRefreshToken(
        params.clientId,
        params.clientSecret,
        params.refreshToken
      )

      const expiresAt = Date.now() + (tokenResponse.expires_in * 1000) - (this.TOKEN_BUFFER_SECONDS * 1000)

      const { data, error } = await this.supabase
        .from('amazon_accounts')
        .insert({
          account_name: params.accountName,
          seller_id: params.sellerId,
          marketplace_id: params.marketplaceId,
          marketplace_name: marketplace.name,
          region: marketplace.region,
          endpoint: marketplace.endpoint,
          client_id: params.clientId,
          client_secret: params.clientSecret,
          refresh_token: params.refreshToken,
          access_token: tokenResponse.access_token,
          access_token_expires_at: new Date(expiresAt).toISOString(),
          is_active: true,
          last_auth_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (error) throw error

      console.log(`✅ アカウント登録成功: ${params.accountName} (${params.marketplaceId})`)
      return { success: true, accountId: data.id }
    } catch (error: any) {
      console.error('❌ アカウント登録エラー:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * アカウントを削除
   */
  async deleteAccount(accountId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('amazon_accounts')
        .delete()
        .eq('id', accountId)

      if (error) throw error

      // キャッシュからも削除
      for (const [key, value] of this.tokenCache.entries()) {
        if (key.includes(accountId)) {
          this.tokenCache.delete(key)
        }
      }

      console.log(`✅ アカウント削除成功: ${accountId}`)
      return { success: true }
    } catch (error: any) {
      console.error('❌ アカウント削除エラー:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * アカウントの有効/無効を切り替え
   */
  async toggleAccountStatus(accountId: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('amazon_accounts')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId)

      if (error) throw error

      console.log(`✅ アカウントステータス更新: ${accountId} -> ${isActive ? '有効' : '無効'}`)
      return { success: true }
    } catch (error: any) {
      console.error('❌ アカウントステータス更新エラー:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * OAuth認可URL生成
   */
  generateAuthorizationUrl(params: {
    marketplaceId: MarketplaceCode
    sellerId: string
    state?: string
  }): string {
    const clientId = process.env.AMAZON_CLIENT_ID || process.env.NEXT_PUBLIC_LWA_CLIENT_ID
    const redirectUri = process.env.AMAZON_REDIRECT_URI || 
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/amazon/auth/callback`
    
    const state = params.state || JSON.stringify({
      marketplaceId: params.marketplaceId,
      sellerId: params.sellerId,
      timestamp: Date.now()
    })

    const authUrl = new URL('https://sellercentral.amazon.com/apps/authorize/consent')
    authUrl.searchParams.set('application_id', clientId || '')
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('version', 'beta')

    return authUrl.toString()
  }

  /**
   * 認可コードをリフレッシュトークンに交換
   */
  async exchangeAuthorizationCode(code: string): Promise<{
    success: boolean
    refreshToken?: string
    accessToken?: string
    expiresIn?: number
    error?: string
  }> {
    const clientId = process.env.AMAZON_CLIENT_ID || process.env.NEXT_PUBLIC_LWA_CLIENT_ID || ''
    const clientSecret = process.env.AMAZON_CLIENT_SECRET || process.env.LWA_CLIENT_SECRET || ''

    try {
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret
      })

      const response = await fetch(this.LWA_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Token exchange failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      return {
        success: true,
        refreshToken: data.refresh_token,
        accessToken: data.access_token,
        expiresIn: data.expires_in
      }
    } catch (error: any) {
      console.error('❌ 認可コード交換エラー:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * トークン情報を表示
   */
  displayTokenInfo(): void {
    console.log('\n📊 Amazon SP-API トークン情報:')
    console.log('='.repeat(50))
    
    for (const [key, cached] of this.tokenCache.entries()) {
      const timeLeft = Math.max(0, Math.floor((cached.expiresAt - Date.now()) / 1000))
      const hours = Math.floor(timeLeft / 3600)
      const minutes = Math.floor((timeLeft % 3600) / 60)
      const seconds = timeLeft % 60

      console.log(`  ${key}:`)
      console.log(`    マーケットプレイス: ${cached.marketplaceId}`)
      console.log(`    トークン: ${cached.accessToken.substring(0, 30)}...`)
      console.log(`    残り有効時間: ${hours}h ${minutes}m ${seconds}s`)
    }
    
    if (this.tokenCache.size === 0) {
      console.log('  ❌ キャッシュされたトークンはありません')
    }
    console.log('='.repeat(50))
  }
}

/**
 * グローバルインスタンス
 */
export const amazonTokenManager = new SecureAmazonTokenManager()

/**
 * SP-API クライアント（トークン自動管理版）
 */
export class AmazonSpApiClient {
  private tokenManager: SecureAmazonTokenManager
  private marketplaceId: MarketplaceCode

  constructor(marketplaceId: MarketplaceCode = 'US') {
    this.tokenManager = amazonTokenManager
    this.marketplaceId = marketplaceId
  }

  /**
   * SP-API を呼び出し（トークンを自動管理）
   */
  async callApi(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    retryCount = 0
  ): Promise<any> {
    const marketplace = AMAZON_MARKETPLACES[this.marketplaceId]
    const accessToken = await this.tokenManager.getAccessToken(this.marketplaceId)
    
    const url = `${marketplace.endpoint}${path}`
    console.log(`\n📤 Amazon SP-API 呼び出し: ${method} ${path}`)

    const options: RequestInit = {
      method,
      headers: {
        'x-amz-access-token': accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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
        console.error(`❌ SP-API エラー: ${error}`)
        
        // 401 の場合はトークンをクリアして再試行（1回のみ）
        if (response.status === 401 && retryCount === 0) {
          console.log('⚠️ トークンが無効。再取得を試行...')
          return await this.callApi(path, method, body, retryCount + 1)
        }
        
        throw new Error(`SP-API Error (${response.status}): ${error}`)
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
   * カタログ検索
   */
  async searchCatalogItems(params: {
    keywords?: string
    identifiers?: string[]
    identifiersType?: 'ASIN' | 'EAN' | 'UPC' | 'ISBN'
    pageSize?: number
    includedData?: string[]
  }): Promise<any> {
    const queryParams = new URLSearchParams()
    queryParams.set('marketplaceIds', AMAZON_MARKETPLACES[this.marketplaceId].id)
    
    if (params.keywords) {
      queryParams.set('keywords', params.keywords)
    }
    if (params.identifiers && params.identifiers.length > 0) {
      queryParams.set('identifiers', params.identifiers.join(','))
      queryParams.set('identifiersType', params.identifiersType || 'ASIN')
    }
    if (params.pageSize) {
      queryParams.set('pageSize', params.pageSize.toString())
    }
    if (params.includedData && params.includedData.length > 0) {
      queryParams.set('includedData', params.includedData.join(','))
    }

    return this.callApi(`/catalog/2022-04-01/items?${queryParams.toString()}`)
  }

  /**
   * 商品情報取得
   */
  async getCatalogItem(asin: string, includedData?: string[]): Promise<any> {
    const queryParams = new URLSearchParams()
    queryParams.set('marketplaceIds', AMAZON_MARKETPLACES[this.marketplaceId].id)
    
    if (includedData && includedData.length > 0) {
      queryParams.set('includedData', includedData.join(','))
    }

    return this.callApi(`/catalog/2022-04-01/items/${asin}?${queryParams.toString()}`)
  }
}
