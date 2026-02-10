/**
 * Amazon Selling Partner API (SP-API) クライアント
 *
 * SP-APIへの接続を抽象化し、認証、署名、リクエスト送信を統一的に処理
 * AWS Signature Version 4による署名をサポート
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import crypto from 'crypto'
import { TokenManager } from './lwa-auth'

/**
 * SP-APIのエンドポイント（リージョン別）
 */
export const SP_API_ENDPOINTS = {
  // 北米
  NA: 'https://sellingpartnerapi-na.amazon.com',
  // ヨーロッパ
  EU: 'https://sellingpartnerapi-eu.amazon.com',
  // 極東（日本を含む）
  FE: 'https://sellingpartnerapi-fe.amazon.com',
} as const

export type SPAPIRegion = keyof typeof SP_API_ENDPOINTS

/**
 * マーケットプレイスIDとリージョンのマッピング
 */
export const MARKETPLACE_REGIONS: Record<string, SPAPIRegion> = {
  // 北米
  ATVPDKIKX0DER: 'NA', // US
  A2EUQ1WTGCTBG2: 'NA', // CA
  A1AM78C64UM0Y8: 'NA', // MX

  // ヨーロッパ
  A1F83G8C2ARO7P: 'EU', // UK
  A1PA6795UKMFR9: 'EU', // DE
  A13V1IB3VIYZZH: 'EU', // FR
  APJ6JRA9NG5V4: 'EU', // IT
  A1RKKUPIHCS9HS: 'EU', // ES

  // 極東
  A1VC38T7YXB528: 'FE', // JP
  A39IBJ37TRP1C6: 'FE', // AU
  A19VAU5U5O7RUS: 'FE', // SG
}

/**
 * SP-API認証情報
 */
export interface SPAPICredentials {
  client_id: string
  client_secret: string
  refresh_token: string
  aws_access_key_id: string
  aws_secret_access_key: string
  seller_id: string
  region?: SPAPIRegion
}

/**
 * 環境変数からSP-API認証情報を取得
 */
function getSPAPICredentials(): SPAPICredentials {
  const client_id = process.env.AMAZON_SP_CLIENT_ID
  const client_secret = process.env.AMAZON_SP_CLIENT_SECRET
  const refresh_token = process.env.AMAZON_SP_REFRESH_TOKEN
  const aws_access_key_id = process.env.AMAZON_SP_AWS_ACCESS_KEY
  const aws_secret_access_key = process.env.AMAZON_SP_AWS_SECRET_KEY
  const seller_id = process.env.AMAZON_SP_SELLER_ID
  const region = (process.env.AMAZON_SP_REGION as SPAPIRegion) || 'NA'

  if (
    !client_id ||
    !client_secret ||
    !refresh_token ||
    !aws_access_key_id ||
    !aws_secret_access_key ||
    !seller_id
  ) {
    throw new Error(
      'Missing required Amazon SP-API credentials in environment variables'
    )
  }

  return {
    client_id,
    client_secret,
    refresh_token,
    aws_access_key_id,
    aws_secret_access_key,
    seller_id,
    region,
  }
}

/**
 * AWS Signature Version 4による署名を生成
 */
function generateAWSSignature(
  method: string,
  url: string,
  headers: Record<string, string>,
  payload: string,
  awsAccessKey: string,
  awsSecretKey: string,
  region: string
): string {
  const service = 'execute-api'
  const urlObj = new URL(url)
  const host = urlObj.hostname
  const canonicalUri = urlObj.pathname
  const canonicalQueryString = urlObj.search.slice(1)

  // 日時情報
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)

  // 正規化されたヘッダー
  const canonicalHeaders = `host:${host}\nx-amz-date:${amzDate}\n`
  const signedHeaders = 'host;x-amz-date'

  // ペイロードのハッシュ
  const payloadHash = crypto.createHash('sha256').update(payload).digest('hex')

  // 正規リクエスト
  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n')

  // 署名文字列
  const algorithm = 'AWS4-HMAC-SHA256'
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
  ].join('\n')

  // 署名キーを生成
  const kDate = crypto
    .createHmac('sha256', `AWS4${awsSecretKey}`)
    .update(dateStamp)
    .digest()
  const kRegion = crypto.createHmac('sha256', kDate).update(region).digest()
  const kService = crypto.createHmac('sha256', kRegion).update(service).digest()
  const kSigning = crypto
    .createHmac('sha256', kService)
    .update('aws4_request')
    .digest()

  // 署名を計算
  const signature = crypto
    .createHmac('sha256', kSigning)
    .update(stringToSign)
    .digest('hex')

  // Authorization ヘッダー
  const authorizationHeader =
    `${algorithm} Credential=${awsAccessKey}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`

  return authorizationHeader
}

/**
 * Amazon SP-APIクライアント
 */
export class SPAPIClient {
  private credentials: SPAPICredentials
  private tokenManager: TokenManager
  private axiosInstance: AxiosInstance
  private region: SPAPIRegion

  constructor(credentials?: SPAPICredentials) {
    this.credentials = credentials || getSPAPICredentials()
    this.tokenManager = new TokenManager(this.credentials.refresh_token)
    this.region = this.credentials.region || 'NA'

    // Axiosインスタンスを作成
    this.axiosInstance = axios.create({
      baseURL: SP_API_ENDPOINTS[this.region],
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * SP-APIリクエストを実行
   */
  async request<T = any>(
    method: string,
    path: string,
    params?: Record<string, any>,
    data?: any
  ): Promise<T> {
    // Access Tokenを取得
    const accessToken = await this.tokenManager.getValidAccessToken()

    // リクエストURL
    const url = `${SP_API_ENDPOINTS[this.region]}${path}`

    // ヘッダー
    const headers: Record<string, string> = {
      'x-amz-access-token': accessToken,
      'Content-Type': 'application/json',
    }

    // ペイロード
    const payload = data ? JSON.stringify(data) : ''

    // AWS署名を生成（必要に応じて）
    // 注: 一部のSP-APIエンドポイントではAWS署名が不要な場合もあります
    // 必要に応じてコメントを外してください
    /*
    const authHeader = generateAWSSignature(
      method.toUpperCase(),
      url,
      headers,
      payload,
      this.credentials.aws_access_key_id,
      this.credentials.aws_secret_access_key,
      this.getAWSRegion()
    )
    headers['Authorization'] = authHeader
    */

    // リクエスト設定
    const config: AxiosRequestConfig = {
      method: method.toLowerCase(),
      url,
      headers,
      params,
      data,
    }

    try {
      const response = await this.axiosInstance.request<T>(config)
      return response.data
    } catch (error: any) {
      console.error('SP-API request failed:', error.response?.data || error.message)
      throw new Error(
        `SP-API request failed: ${error.response?.data?.errors?.[0]?.message || error.message}`
      )
    }
  }

  /**
   * AWSリージョンを取得（SP-APIリージョンから変換）
   */
  private getAWSRegion(): string {
    const awsRegionMap: Record<SPAPIRegion, string> = {
      NA: 'us-east-1',
      EU: 'eu-west-1',
      FE: 'us-west-2',
    }
    return awsRegionMap[this.region]
  }

  /**
   * Refresh Tokenを更新
   */
  setRefreshToken(refreshToken: string): void {
    this.credentials.refresh_token = refreshToken
    this.tokenManager.setRefreshToken(refreshToken)
  }

  /**
   * 現在のRefresh Tokenを取得
   */
  getRefreshToken(): string {
    return this.tokenManager.getRefreshToken()
  }

  // ========================================
  // Catalog Items API
  // ========================================

  /**
   * カタログアイテムを検索
   */
  async searchCatalogItems(params: {
    keywords?: string
    marketplaceIds: string[]
    identifiers?: string[]
    identifiersType?: 'ASIN' | 'EAN' | 'GTIN' | 'ISBN' | 'JAN' | 'MINSAN' | 'SKU' | 'UPC'
  }): Promise<any> {
    return this.request('GET', '/catalog/2022-04-01/items', params)
  }

  /**
   * カタログアイテムを取得
   */
  async getCatalogItem(asin: string, marketplaceIds: string[]): Promise<any> {
    return this.request('GET', `/catalog/2022-04-01/items/${asin}`, {
      marketplaceIds,
    })
  }

  // ========================================
  // Listings API
  // ========================================

  /**
   * 出品を作成または更新
   */
  async putListingsItem(
    sellerId: string,
    sku: string,
    marketplaceIds: string[],
    productType: string,
    requirements: 'LISTING' | 'LISTING_PRODUCT_ONLY' | 'LISTING_OFFER_ONLY',
    attributes: any
  ): Promise<any> {
    return this.request('PUT', `/listings/2021-08-01/items/${sellerId}/${sku}`, {
      marketplaceIds,
    }, {
      productType,
      requirements,
      attributes,
    })
  }

  /**
   * 出品を削除
   */
  async deleteListingsItem(
    sellerId: string,
    sku: string,
    marketplaceIds: string[]
  ): Promise<any> {
    return this.request('DELETE', `/listings/2021-08-01/items/${sellerId}/${sku}`, {
      marketplaceIds,
    })
  }

  /**
   * 出品情報を取得
   */
  async getListingsItem(
    sellerId: string,
    sku: string,
    marketplaceIds: string[]
  ): Promise<any> {
    return this.request('GET', `/listings/2021-08-01/items/${sellerId}/${sku}`, {
      marketplaceIds,
    })
  }

  // ========================================
  // Reports API
  // ========================================

  /**
   * レポートを作成
   */
  async createReport(reportType: string, marketplaceIds: string[], options?: any): Promise<any> {
    return this.request('POST', '/reports/2021-06-30/reports', undefined, {
      reportType,
      marketplaceIds,
      ...options,
    })
  }

  /**
   * レポートを取得
   */
  async getReport(reportId: string): Promise<any> {
    return this.request('GET', `/reports/2021-06-30/reports/${reportId}`)
  }

  /**
   * レポートドキュメントを取得
   */
  async getReportDocument(reportDocumentId: string): Promise<any> {
    return this.request('GET', `/reports/2021-06-30/documents/${reportDocumentId}`)
  }

  // ========================================
  // Feeds API
  // ========================================

  /**
   * フィードを作成
   */
  async createFeed(
    feedType: string,
    marketplaceIds: string[],
    inputFeedDocumentId: string
  ): Promise<any> {
    return this.request('POST', '/feeds/2021-06-30/feeds', undefined, {
      feedType,
      marketplaceIds,
      inputFeedDocumentId,
    })
  }

  /**
   * フィードを取得
   */
  async getFeed(feedId: string): Promise<any> {
    return this.request('GET', `/feeds/2021-06-30/feeds/${feedId}`)
  }
}
