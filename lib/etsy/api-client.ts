/**
 * Etsy API クライアント
 * Etsy Open API v3対応
 * P0: 暗号化された認証情報管理統合
 */

import {
  EtsyAuthConfig,
  EtsyTokens,
  EtsyShop,
  EtsyListing,
  CreateListingRequest,
  EtsyListingImage,
  EtsyShippingProfile,
  EtsyTaxonomy,
  EtsyApiResponse,
  EtsyApiError,
} from './types';
import {
  retrieveDecryptedCredential,
  storeEncryptedCredential,
  refreshOAuthToken,
} from '../services/credential-manager';

const ETSY_API_BASE_URL = 'https://openapi.etsy.com/v3';
const ETSY_OAUTH_URL = 'https://www.etsy.com/oauth';

/**
 * Etsy APIクライアント
 */
export class EtsyApiClient {
  private accessToken: string;
  private shopId?: number;
  private useEncryption: boolean;

  constructor(accessToken: string, shopId?: number, useEncryption = false) {
    this.accessToken = accessToken;
    this.shopId = shopId;
    this.useEncryption = useEncryption;
  }

  /**
   * 暗号化された認証情報を使用してクライアントを作成（推奨）
   */
  static async fromEncryptedCredentials(
    userId?: string,
    shopId?: number
  ): Promise<EtsyApiClient> {
    try {
      const accessToken = await retrieveDecryptedCredential('ETSY', 'access_token', userId);
      return new EtsyApiClient(accessToken, shopId, true);
    } catch (error) {
      console.error('Failed to retrieve Etsy credentials:', error);
      throw new Error('Etsy credentials not found or expired. Please re-authenticate.');
    }
  }

  /**
   * OAuth認証URLを生成
   */
  static getAuthorizationUrl(config: EtsyAuthConfig, state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(' '),
      state,
      code_challenge: 'placeholder', // PKCE required
      code_challenge_method: 'S256',
    });

    return `${ETSY_OAUTH_URL}/connect?${params.toString()}`;
  }

  /**
   * 認証コードからアクセストークンを取得
   * P0: 取得したトークンを自動的に暗号化して保存
   */
  static async exchangeCodeForToken(
    config: EtsyAuthConfig,
    code: string,
    codeVerifier: string,
    saveToEncrypted = true,
    userId?: string
  ): Promise<EtsyTokens> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      code,
      code_verifier: codeVerifier,
    });

    const response = await fetch(`${ETSY_API_BASE_URL}/public/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error: EtsyApiError = await response.json();
      throw new Error(`Failed to exchange code: ${error.error_msg || error.error}`);
    }

    const data = await response.json();
    const tokens: EtsyTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
    };

    // 暗号化してDBに保存
    if (saveToEncrypted) {
      const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);

      await storeEncryptedCredential({
        marketplaceId: 'ETSY',
        credentialType: 'access_token',
        plainValue: tokens.accessToken,
        expiresAt,
        userId,
      });

      await storeEncryptedCredential({
        marketplaceId: 'ETSY',
        credentialType: 'refresh_token',
        plainValue: tokens.refreshToken,
        userId,
      });

      console.log('✅ Etsy tokens stored in encrypted database');
    }

    return tokens;
  }

  /**
   * リフレッシュトークンから新しいアクセストークンを取得
   */
  static async refreshAccessToken(
    config: EtsyAuthConfig,
    refreshToken: string
  ): Promise<EtsyTokens> {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: config.clientId,
      refresh_token: refreshToken,
    });

    const response = await fetch(`${ETSY_API_BASE_URL}/public/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error: EtsyApiError = await response.json();
      throw new Error(`Failed to refresh token: ${error.error_msg || error.error}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
    };
  }

  /**
   * APIリクエスト実行
   * P0: トークン期限切れ時の自動リフレッシュ対応
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    body?: unknown,
    retryCount = 0
  ): Promise<T> {
    const url = `${ETSY_API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'x-api-key': process.env.NEXT_PUBLIC_ETSY_CLIENT_ID || '',
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    // 401 Unauthorized - トークンが期限切れの可能性
    if (response.status === 401 && this.useEncryption && retryCount === 0) {
      console.warn('Etsy token expired, attempting refresh...');
      try {
        await refreshOAuthToken('ETSY');
        // 新しいトークンを取得して再試行
        const newAccessToken = await retrieveDecryptedCredential('ETSY', 'access_token');
        this.accessToken = newAccessToken;
        return this.request<T>(endpoint, method, body, retryCount + 1);
      } catch (refreshError) {
        console.error('Failed to refresh Etsy token:', refreshError);
        throw new Error('Etsy token refresh failed. Please re-authenticate.');
      }
    }

    if (!response.ok) {
      const error: EtsyApiError = await response.json().catch(() => ({
        error: 'Unknown error',
      }));
      throw new Error(
        `Etsy API Error (${response.status}): ${error.error_msg || error.error}`
      );
    }

    return response.json();
  }

  /**
   * ショップ情報を取得
   */
  async getShop(shopId?: number): Promise<EtsyShop> {
    const id = shopId || this.shopId;
    if (!id) {
      throw new Error('Shop ID is required');
    }

    return this.request<EtsyShop>(`/application/shops/${id}`);
  }

  /**
   * ショップのリスティング一覧を取得
   */
  async getShopListings(
    shopId?: number,
    params?: {
      state?: 'active' | 'inactive' | 'draft' | 'sold_out' | 'expired';
      limit?: number;
      offset?: number;
    }
  ): Promise<EtsyApiResponse<EtsyListing>> {
    const id = shopId || this.shopId;
    if (!id) {
      throw new Error('Shop ID is required');
    }

    const queryParams = new URLSearchParams();
    if (params?.state) queryParams.set('state', params.state);
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.offset) queryParams.set('offset', params.offset.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

    return this.request<EtsyApiResponse<EtsyListing>>(
      `/application/shops/${id}/listings${query}`
    );
  }

  /**
   * リスティング詳細を取得
   */
  async getListing(listingId: number): Promise<EtsyListing> {
    return this.request<EtsyListing>(`/application/listings/${listingId}`);
  }

  /**
   * リスティングを作成
   */
  async createListing(
    shopId: number,
    data: CreateListingRequest
  ): Promise<EtsyListing> {
    return this.request<EtsyListing>(
      `/application/shops/${shopId}/listings`,
      'POST',
      data
    );
  }

  /**
   * リスティングを更新
   */
  async updateListing(
    shopId: number,
    listingId: number,
    data: Partial<CreateListingRequest>
  ): Promise<EtsyListing> {
    return this.request<EtsyListing>(
      `/application/shops/${shopId}/listings/${listingId}`,
      'PATCH',
      data
    );
  }

  /**
   * リスティングを削除
   */
  async deleteListing(listingId: number): Promise<void> {
    return this.request<void>(`/application/listings/${listingId}`, 'DELETE');
  }

  /**
   * リスティング画像をアップロード
   */
  async uploadListingImage(
    shopId: number,
    listingId: number,
    imageFile: File,
    rank?: number
  ): Promise<EtsyListingImage> {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (rank !== undefined) {
      formData.append('rank', rank.toString());
    }

    const url = `${ETSY_API_BASE_URL}/application/shops/${shopId}/listings/${listingId}/images`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_ETSY_CLIENT_ID || '',
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * リスティングの在庫を取得
   */
  async getListingInventory(listingId: number) {
    return this.request(`/application/listings/${listingId}/inventory`);
  }

  /**
   * リスティングの在庫を更新
   */
  async updateListingInventory(
    listingId: number,
    products: unknown[]
  ): Promise<unknown> {
    return this.request(
      `/application/listings/${listingId}/inventory`,
      'PUT',
      { products }
    );
  }

  /**
   * 配送プロファイル一覧を取得
   */
  async getShippingProfiles(
    shopId?: number
  ): Promise<EtsyApiResponse<EtsyShippingProfile>> {
    const id = shopId || this.shopId;
    if (!id) {
      throw new Error('Shop ID is required');
    }

    return this.request<EtsyApiResponse<EtsyShippingProfile>>(
      `/application/shops/${id}/shipping-profiles`
    );
  }

  /**
   * タクソノミー（カテゴリ）を取得
   */
  async getTaxonomy(): Promise<EtsyApiResponse<EtsyTaxonomy>> {
    return this.request<EtsyApiResponse<EtsyTaxonomy>>(
      '/application/seller-taxonomy/nodes'
    );
  }

  /**
   * タクソノミープロパティを取得
   */
  async getTaxonomyProperties(taxonomyId: number) {
    return this.request(
      `/application/seller-taxonomy/nodes/${taxonomyId}/properties`
    );
  }
}

export default EtsyApiClient;
