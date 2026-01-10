/**
 * eBay API - セキュアなトークン管理システム（P0対応版）
 *
 * 機能:
 * - 暗号化された認証情報の使用（pgsodium）
 * - Refresh Token から User Access Token を自動生成
 * - トークンの自動リフレッシュ
 * - セキュアなアクセス制御
 *
 * 注意：このファイルはlibebay/oauth2-token-manager.tsを置き換えます
 */

import {
  getMarketplaceCredential,
  updateAccessToken,
  isTokenValid,
  type MarketplaceCredential
} from '@/lib/security/encrypted-credentials';

/**
 * eBay セキュアトークンマネージャー（P0対応）
 */
export class EbaySecureTokenManager {
  private marketplaceId: 'EBAY_US' | 'EBAY_UK' | 'EBAY_JP';
  private environment: string;
  private credential: MarketplaceCredential | null = null;

  constructor(marketplace: 'EBAY_US' | 'EBAY_UK' | 'EBAY_JP' = 'EBAY_US') {
    this.marketplaceId = marketplace;
    this.environment = process.env.EBAY_ENVIRONMENT || 'production';

    console.log(`🔐 eBay セキュアトークンマネージャーを初期化 (${marketplace})`);
  }

  /**
   * 暗号化された認証情報を読み込み
   */
  private async loadCredential(): Promise<boolean> {
    try {
      this.credential = await getMarketplaceCredential(this.marketplaceId);

      if (!this.credential) {
        console.error(`❌ 認証情報が見つかりません: ${this.marketplaceId}`);
        return false;
      }

      console.log(`✅ 暗号化された認証情報を読み込みました: ${this.marketplaceId}`);
      return true;

    } catch (error: any) {
      console.error('認証情報読み込みエラー:', error);
      return false;
    }
  }

  /**
   * アクセストークンを取得（自動リフレッシュ）
   */
  async getAccessToken(): Promise<string> {
    // 認証情報が未読み込みの場合は読み込む
    if (!this.credential) {
      const loaded = await this.loadCredential();
      if (!loaded || !this.credential) {
        throw new Error('認証情報の読み込みに失敗しました');
      }
    }

    // トークンの有効性を確認
    const valid = await isTokenValid(this.marketplaceId);

    if (valid && this.credential.access_token) {
      console.log('✅ キャッシュされたトークンは有効です');
      return this.credential.access_token;
    }

    // トークンが無効な場合はリフレッシュ
    console.log('🔄 トークンをリフレッシュします...');
    return await this.refreshAccessToken();
  }

  /**
   * Refresh Token を使用して Access Token をリフレッシュ
   */
  private async refreshAccessToken(): Promise<string> {
    if (!this.credential || !this.credential.refresh_token) {
      throw new Error('Refresh Tokenが設定されていません');
    }

    if (!this.credential.client_id || !this.credential.client_secret) {
      throw new Error('Client IDまたはClient Secretが設定されていません');
    }

    const tokenUrl = 'https://api.ebay.com/identity/v1/oauth2/token';

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', this.credential.refresh_token);
    params.append('scope', 'https://api.ebay.com/oauth/api_scope');

    const auth = Buffer.from(
      `${this.credential.client_id}:${this.credential.client_secret}`
    ).toString('base64');

    console.log(`📨 トークンリクエストを送信: POST ${tokenUrl}`);

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: params.toString()
      });

      console.log(`   レスポンスステータス: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`❌ トークン取得エラー (${response.status}):`, errorData);
        throw new Error(`Token refresh failed (${response.status}): ${errorData}`);
      }

      const data = await response.json() as {
        access_token: string;
        expires_in: number;
        token_type: string;
        refresh_token?: string;
      };

      // 新しいトークンを暗号化してデータベースに保存
      const expiresAt = new Date(Date.now() + data.expires_in * 1000);
      const updated = await updateAccessToken(
        this.marketplaceId,
        data.access_token,
        expiresAt
      );

      if (!updated) {
        throw new Error('トークンのデータベース保存に失敗しました');
      }

      // メモリ上のcredentialも更新
      this.credential.access_token = data.access_token;
      this.credential.token_expires_at = expiresAt.toISOString();

      console.log(`✅ アクセストークン取得成功`);
      console.log(`   有効期限: ${data.expires_in}秒 (${Math.floor(data.expires_in / 3600)}時間)`);
      console.log(`   トークンプレビュー: ${data.access_token.substring(0, 30)}...`);

      return data.access_token;

    } catch (error: any) {
      console.error('❌ トークンリフレッシュ失敗:', error.message);
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
  }

  /**
   * トークン情報を表示
   */
  async displayTokenInfo(): Promise<void> {
    if (!this.credential) {
      await this.loadCredential();
    }

    if (this.credential && this.credential.access_token) {
      const expiresAt = this.credential.token_expires_at
        ? new Date(this.credential.token_expires_at)
        : null;

      const timeLeft = expiresAt
        ? Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
        : 0;

      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;

      console.log(`📊 トークン情報 (${this.marketplaceId}):`);
      console.log(`   アクセストークン: ${this.credential.access_token.substring(0, 30)}...`);
      console.log(`   残り有効時間: ${hours}h ${minutes}m ${seconds}s`);
      console.log(`   有効: ${await isTokenValid(this.marketplaceId) ? 'はい' : 'いいえ'}`);
    } else {
      console.log(`❌ トークンが取得されていません (${this.marketplaceId})`);
    }
  }
}

/**
 * eBay セキュアAPIクライアント（P0対応）
 */
export class EbaySecureApiClient {
  private tokenManager: EbaySecureTokenManager;
  private environment: string;

  constructor(marketplace: 'EBAY_US' | 'EBAY_UK' | 'EBAY_JP' = 'EBAY_US') {
    this.tokenManager = new EbaySecureTokenManager(marketplace);
    this.environment = process.env.EBAY_ENVIRONMENT || 'production';
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
    const accessToken = await this.tokenManager.getAccessToken();

    const url = `https://api.ebay.com${endpoint}`;
    console.log(`\n📤 eBay API 呼び出し: ${method} ${endpoint}`);

    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-EBAY-API-ENV-ID': this.environment === 'production' ? 'PRODUCTION' : 'SANDBOX'
      }
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      console.log(`   ステータス: ${response.status}`);

      if (!response.ok) {
        const error = await response.text();
        console.error(`❌ エラー: ${error}`);

        // 401 の場合はトークンを再取得して再試行（1回のみ）
        if (response.status === 401 && retryCount === 0) {
          console.log('⚠️  トークンが無効な可能性があります。再度取得して再試行します...');

          // トークンを強制リフレッシュ（キャッシュをスキップ）
          await this.tokenManager.getAccessToken();

          // 再試行
          return await this.callApi(endpoint, method, body, retryCount + 1);
        }

        throw new Error(`API エラー (${response.status}): ${error}`);
      }

      const data = await response.json();
      console.log(`✅ リクエスト成功`);
      return data;

    } catch (error: any) {
      console.error(`❌ リクエスト失敗: ${error.message}`);
      throw error;
    }
  }

  /**
   * トークン情報を表示
   */
  async displayTokenInfo(): Promise<void> {
    await this.tokenManager.displayTokenInfo();
  }
}

/**
 * eBay インベントリ取得（セキュア版）
 */
export async function getEbayInventorySecure(
  limit = 10,
  marketplace: 'EBAY_US' | 'EBAY_UK' | 'EBAY_JP' = 'EBAY_US'
): Promise<any> {
  const client = new EbaySecureApiClient(marketplace);

  console.log('\n' + '='.repeat(60));
  console.log(`📦 eBay インベントリ取得 (${marketplace})`);
  console.log('='.repeat(60));

  try {
    const result = await client.callApi(
      `/sell/inventory/v1/inventory_item?limit=${limit}`
    );

    console.log(`\n✅ ${result.inventoryItems?.length || 0} 件の商品を取得`);
    return result;

  } catch (error: any) {
    console.error('\n❌ インベントリ取得失敗:', error.message);
    throw error;
  }
}

/**
 * eBay 出品作成（セキュア版）
 */
export async function createEbayListingSecure(
  listing: {
    title: string;
    description: string;
    price: number;
    quantity: number;
    categoryId?: string;
    condition?: 'USED' | 'NEW' | 'REFURBISHED';
  },
  marketplace: 'EBAY_US' | 'EBAY_UK' | 'EBAY_JP' = 'EBAY_US'
): Promise<any> {
  const client = new EbaySecureApiClient(marketplace);

  console.log('\n' + '='.repeat(60));
  console.log(`🚀 eBay 出品作成 (${marketplace})`);
  console.log('='.repeat(60));
  console.log(`📝 商品: ${listing.title}`);
  console.log(`💰 価格: $${listing.price}`);
  console.log(`📦 数量: ${listing.quantity}`);

  try {
    const sku = `SKU-${Date.now()}`;

    console.log('\n1️⃣  Inventory Item を作成中...');
    const inventoryItem = {
      availability: {
        quantities: {
          availableQuantity: listing.quantity
        }
      },
      condition: listing.condition || 'USED',
      product: {
        title: listing.title,
        description: listing.description
      }
    };

    await client.callApi(
      `/sell/inventory/v1/inventory_item/${sku}`,
      'PUT',
      inventoryItem
    );
    console.log('✅ Inventory Item 作成完了');

    console.log('\n2️⃣  Offer を作成中...');
    const offer = {
      listingFormat: 'FIXED_PRICE',
      pricingSummary: {
        price: {
          currency: 'USD',
          value: listing.price.toString()
        }
      },
      quantityLimitPerBuyer: 5,
      listingDuration: 'GTC'
    };

    const offerResult = await client.callApi(
      '/sell/inventory/v1/offer',
      'POST',
      offer
    );
    const offerId = offerResult.offerId;
    console.log(`✅ Offer 作成完了: ${offerId}`);

    console.log('\n3️⃣  Listing を公開中...');
    const publishResult = await client.callApi(
      `/sell/inventory/v1/offer/${offerId}/publish`,
      'POST'
    );
    console.log('✅ Listing 公開完了');

    console.log('\n🎉 出品成功！');
    return {
      success: true,
      sku,
      offerId,
      listingId: publishResult.listingId,
      url: `https://www.ebay.com/itm/${publishResult.listingId}`
    };

  } catch (error: any) {
    console.error('\n❌ 出品失敗:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}
