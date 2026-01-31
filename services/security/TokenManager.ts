/**
 * P0: 認証情報暗号化 - トークン管理サービス
 * pgsodium で暗号化されたAPIトークンの安全な管理
 */

import { createClient } from '@supabase/supabase-js';

// ==========================================
// 型定義
// ==========================================

interface ApiToken {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresAt?: Date;
  scopes?: string[];
  isActive: boolean;
}

interface StoreTokenParams {
  marketplace: string;
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresAt?: Date;
  scopes?: string[];
}

// ==========================================
// Supabase クライアント（サービスロール）
// ==========================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '' // サービスロールキーを使用
);

// ==========================================
// TokenManager クラス
// ==========================================

export class TokenManager {
  /**
   * トークンを暗号化して保存
   */
  async storeToken(params: StoreTokenParams): Promise<string> {
    const {
      marketplace,
      accessToken,
      refreshToken,
      tokenType = 'Bearer',
      expiresAt,
      scopes,
    } = params;

    try {
      console.log(`🔐 トークン保存中: ${marketplace}`);

      // pgsodium の encrypt_and_store_token 関数を呼び出し
      const { data, error } = await supabase.rpc('encrypt_and_store_token', {
        p_marketplace: marketplace,
        p_access_token: accessToken,
        p_refresh_token: refreshToken || null,
        p_token_type: tokenType,
        p_expires_at: expiresAt?.toISOString() || null,
        p_scopes: scopes || null,
      });

      if (error) {
        console.error('❌ トークン保存エラー:', error);
        throw new Error(`トークン保存に失敗: ${error.message}`);
      }

      console.log(`✅ トークン保存完了: ${marketplace} (ID: ${data})`);

      return data;
    } catch (error: any) {
      console.error('❌ トークン保存エラー:', error);
      throw error;
    }
  }

  /**
   * トークンを復号化して取得
   */
  async getToken(marketplace: string): Promise<ApiToken | null> {
    try {
      console.log(`🔓 トークン取得中: ${marketplace}`);

      // pgsodium の decrypt_token 関数を呼び出し
      const { data, error } = await supabase.rpc('decrypt_token', {
        p_marketplace: marketplace,
      });

      if (error) {
        if (error.message.includes('トークンが見つかりません')) {
          console.warn(`⚠️ トークンが見つかりません: ${marketplace}`);
          return null;
        }

        console.error('❌ トークン取得エラー:', error);
        throw new Error(`トークン取得に失敗: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.warn(`⚠️ トークンが見つかりません: ${marketplace}`);
        return null;
      }

      const token = data[0];

      console.log(`✅ トークン取得完了: ${marketplace}`);

      return {
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        tokenType: token.token_type,
        expiresAt: token.expires_at ? new Date(token.expires_at) : undefined,
        scopes: token.scopes,
        isActive: token.is_active,
      };
    } catch (error: any) {
      console.error('❌ トークン取得エラー:', error);
      throw error;
    }
  }

  /**
   * トークンの有効期限をチェック
   */
  async isTokenValid(marketplace: string): Promise<boolean> {
    try {
      const token = await this.getToken(marketplace);

      if (!token) {
        return false;
      }

      if (!token.isActive) {
        return false;
      }

      if (token.expiresAt && token.expiresAt < new Date()) {
        console.warn(`⚠️ トークン期限切れ: ${marketplace}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ トークン検証エラー:', error);
      return false;
    }
  }

  /**
   * トークンを無効化
   */
  async deactivateToken(marketplace: string): Promise<void> {
    try {
      console.log(`🔒 トークン無効化中: ${marketplace}`);

      const { error } = await supabase
        .from('api_tokens')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('marketplace', marketplace);

      if (error) {
        throw new Error(`トークン無効化に失敗: ${error.message}`);
      }

      console.log(`✅ トークン無効化完了: ${marketplace}`);
    } catch (error: any) {
      console.error('❌ トークン無効化エラー:', error);
      throw error;
    }
  }

  /**
   * 期限切れトークンを一括無効化
   */
  async deactivateExpiredTokens(): Promise<number> {
    try {
      console.log('🧹 期限切れトークンチェック中...');

      const { data, error } = await supabase.rpc('check_and_deactivate_expired_tokens');

      if (error) {
        throw new Error(`期限切れチェックに失敗: ${error.message}`);
      }

      const deactivatedCount = data || 0;

      if (deactivatedCount > 0) {
        console.log(`✅ 期限切れトークンを無効化: ${deactivatedCount} 件`);
      } else {
        console.log('✅ 期限切れトークンなし');
      }

      return deactivatedCount;
    } catch (error: any) {
      console.error('❌ 期限切れチェックエラー:', error);
      throw error;
    }
  }

  /**
   * トークンを自動リフレッシュ（OAuth用）
   */
  async refreshTokenIfNeeded(marketplace: string): Promise<ApiToken | null> {
    try {
      const token = await this.getToken(marketplace);

      if (!token) {
        console.warn(`⚠️ トークンが見つかりません: ${marketplace}`);
        return null;
      }

      // 有効期限まで1時間未満の場合、リフレッシュ
      const expiresIn = token.expiresAt
        ? token.expiresAt.getTime() - Date.now()
        : Infinity;

      if (expiresIn < 60 * 60 * 1000) {
        console.log(`🔄 トークンリフレッシュ中: ${marketplace}`);

        // マーケットプレイス別のリフレッシュロジック
        const newToken = await this.performTokenRefresh(marketplace, token);

        if (newToken) {
          // 新しいトークンを保存
          await this.storeToken({
            marketplace,
            accessToken: newToken.accessToken,
            refreshToken: newToken.refreshToken,
            tokenType: newToken.tokenType,
            expiresAt: newToken.expiresAt,
            scopes: newToken.scopes,
          });

          console.log(`✅ トークンリフレッシュ完了: ${marketplace}`);

          return newToken;
        }
      }

      return token;
    } catch (error: any) {
      console.error('❌ トークンリフレッシュエラー:', error);
      throw error;
    }
  }

  /**
   * マーケットプレイス別のトークンリフレッシュ実装
   */
  private async performTokenRefresh(
    marketplace: string,
    currentToken: ApiToken
  ): Promise<ApiToken | null> {
    // マーケットプレイスごとのリフレッシュロジック
    switch (marketplace.toLowerCase()) {
      case 'ebay':
        return this.refreshEbayToken(currentToken);

      case 'amazon':
        return this.refreshAmazonToken(currentToken);

      case 'shopee':
        return this.refreshShopeeToken(currentToken);

      case 'etsy':
        return this.refreshEtsyToken(currentToken);

      default:
        console.warn(`⚠️ リフレッシュ未対応: ${marketplace}`);
        return null;
    }
  }

  /**
   * eBay トークンリフレッシュ
   */
  private async refreshEbayToken(currentToken: ApiToken): Promise<ApiToken | null> {
    try {
      const clientId = process.env.EBAY_CLIENT_ID || '';
      const clientSecret = process.env.EBAY_CLIENT_SECRET || '';

      if (!currentToken.refreshToken) {
        throw new Error('リフレッシュトークンが見つかりません');
      }

      const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: currentToken.refreshToken,
          scope: currentToken.scopes?.join(' ') || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`eBay トークンリフレッシュ失敗: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || currentToken.refreshToken,
        tokenType: 'Bearer',
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
        scopes: currentToken.scopes,
        isActive: true,
      };
    } catch (error) {
      console.error('❌ eBay トークンリフレッシュエラー:', error);
      return null;
    }
  }

  /**
   * Amazon トークンリフレッシュ
   */
  private async refreshAmazonToken(currentToken: ApiToken): Promise<ApiToken | null> {
    try {
      const clientId = process.env.AMAZON_CLIENT_ID || '';
      const clientSecret = process.env.AMAZON_CLIENT_SECRET || '';

      if (!currentToken.refreshToken) {
        throw new Error('リフレッシュトークンが見つかりません');
      }

      const response = await fetch('https://api.amazon.com/auth/o2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: currentToken.refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Amazon トークンリフレッシュ失敗: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || currentToken.refreshToken,
        tokenType: 'Bearer',
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
        scopes: currentToken.scopes,
        isActive: true,
      };
    } catch (error) {
      console.error('❌ Amazon トークンリフレッシュエラー:', error);
      return null;
    }
  }

  /**
   * Shopee トークンリフレッシュ
   */
  private async refreshShopeeToken(currentToken: ApiToken): Promise<ApiToken | null> {
    try {
      const partnerId = process.env.SHOPEE_PARTNER_ID || '';
      const partnerKey = process.env.SHOPEE_PARTNER_KEY || '';

      if (!currentToken.refreshToken) {
        throw new Error('リフレッシュトークンが見つかりません');
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const path = '/api/v2/auth/access_token/get';

      // Shopee シグネチャ生成（簡易版）
      const crypto = require('crypto');
      const baseString = `${partnerId}${path}${timestamp}`;
      const hmac = crypto.createHmac('sha256', partnerKey);
      hmac.update(baseString);
      const signature = hmac.digest('hex');

      const response = await fetch(
        `https://partner.shopeemobile.com${path}?partner_id=${partnerId}&timestamp=${timestamp}&sign=${signature}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh_token: currentToken.refreshToken,
            partner_id: parseInt(partnerId),
            shop_id: 0, // 実際のshop_idを設定
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Shopee トークンリフレッシュ失敗: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || currentToken.refreshToken,
        tokenType: 'Bearer',
        expiresAt: new Date(Date.now() + data.expire_in * 1000),
        scopes: currentToken.scopes,
        isActive: true,
      };
    } catch (error) {
      console.error('❌ Shopee トークンリフレッシュエラー:', error);
      return null;
    }
  }

  /**
   * Etsy トークンリフレッシュ
   */
  private async refreshEtsyToken(currentToken: ApiToken): Promise<ApiToken | null> {
    try {
      const clientId = process.env.ETSY_CLIENT_ID || '';

      if (!currentToken.refreshToken) {
        throw new Error('リフレッシュトークンが見つかりません');
      }

      const response = await fetch('https://api.etsy.com/v3/public/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: clientId,
          refresh_token: currentToken.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Etsy トークンリフレッシュ失敗: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || currentToken.refreshToken,
        tokenType: 'Bearer',
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
        scopes: currentToken.scopes,
        isActive: true,
      };
    } catch (error) {
      console.error('❌ Etsy トークンリフレッシュエラー:', error);
      return null;
    }
  }

  /**
   * 全トークンの一覧を取得（管理用）
   */
  async listAllTokens(): Promise<{ marketplace: string; isActive: boolean; expiresAt?: Date }[]> {
    try {
      const { data, error } = await supabase
        .from('api_tokens')
        .select('marketplace, is_active, expires_at')
        .order('marketplace');

      if (error) {
        throw new Error(`トークン一覧取得に失敗: ${error.message}`);
      }

      return (data || []).map(token => ({
        marketplace: token.marketplace,
        isActive: token.is_active,
        expiresAt: token.expires_at ? new Date(token.expires_at) : undefined,
      }));
    } catch (error: any) {
      console.error('❌ トークン一覧取得エラー:', error);
      throw error;
    }
  }
}

// ==========================================
// エクスポート
// ==========================================

export default TokenManager;

// シングルトンインスタンス
let tokenManagerInstance: TokenManager | null = null;

export function getTokenManager(): TokenManager {
  if (!tokenManagerInstance) {
    tokenManagerInstance = new TokenManager();
  }
  return tokenManagerInstance;
}
