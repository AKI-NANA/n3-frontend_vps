/**
 * P0: セキュア認証情報管理サービス
 *
 * pgsodiumで暗号化された多モール認証情報の管理
 * - 8モール対応: eBay, Shopee, Coupang, BUYMA, Qoo10, Amazon, Shopify, Mercari
 * - トークンの暗号化保存・復号化取得
 * - 自動リフレッシュ機構
 * - エラーハンドリング
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// サポート対象のマーケットプレイス
export type Marketplace =
  | 'ebay'
  | 'shopee'
  | 'coupang'
  | 'buyma'
  | 'qoo10'
  | 'amazon'
  | 'shopify'
  | 'mercari';

export interface MarketplaceCredential {
  id: string;
  marketplace: Marketplace;
  account_name: string;
  environment: 'production' | 'sandbox';
  client_id: string;
  client_secret: string;
  access_token?: string | null;
  refresh_token?: string | null;
  additional_data?: Record<string, any>;
  token_expires_at?: string | null;
  token_scope?: string[];
  is_active: boolean;
  last_refreshed_at?: string | null;
  last_error?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CredentialInput {
  marketplace: Marketplace;
  account_name: string;
  environment?: 'production' | 'sandbox';
  client_id: string;
  client_secret: string;
  access_token?: string;
  refresh_token?: string;
  additional_data?: Record<string, any>;
  token_expires_at?: Date;
  token_scope?: string[];
}

export interface TokenUpdateInput {
  marketplace: Marketplace;
  account_name: string;
  environment?: 'production' | 'sandbox';
  access_token: string;
  token_expires_at: Date;
  refresh_token?: string;
}

/**
 * セキュア認証情報管理サービス
 */
export class SecureCredentialsService {
  private supabase: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    if (supabaseClient) {
      this.supabase = supabaseClient;
    } else {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  /**
   * 認証情報を暗号化して保存
   */
  async saveCredential(input: CredentialInput): Promise<string> {
    try {
      const { data, error } = await this.supabase.rpc('encrypt_marketplace_credential', {
        p_marketplace: input.marketplace,
        p_account_name: input.account_name,
        p_environment: input.environment || 'production',
        p_client_id: input.client_id,
        p_client_secret: input.client_secret,
        p_access_token: input.access_token || null,
        p_refresh_token: input.refresh_token || null,
        p_additional_data: input.additional_data || null,
        p_token_expires_at: input.token_expires_at?.toISOString() || null,
        p_token_scope: input.token_scope || null,
      });

      if (error) {
        console.error('❌ 認証情報の保存に失敗:', error);
        throw new Error(`Failed to save credential: ${error.message}`);
      }

      console.log(`✅ 認証情報を暗号化して保存: ${input.marketplace} / ${input.account_name}`);
      return data as string; // credential ID
    } catch (error: any) {
      console.error('❌ saveCredential エラー:', error);
      throw error;
    }
  }

  /**
   * 認証情報を取得（復号化済み）
   */
  async getCredential(
    marketplace: Marketplace,
    accountName: string,
    environment: 'production' | 'sandbox' = 'production'
  ): Promise<MarketplaceCredential | null> {
    try {
      const { data, error } = await this.supabase
        .from('decrypted_marketplace_credentials')
        .select('*')
        .eq('marketplace', marketplace)
        .eq('account_name', accountName)
        .eq('environment', environment)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // レコードが見つからない
          console.warn(`⚠️ 認証情報が見つかりません: ${marketplace} / ${accountName}`);
          return null;
        }
        throw error;
      }

      return data as MarketplaceCredential;
    } catch (error: any) {
      console.error('❌ getCredential エラー:', error);
      throw error;
    }
  }

  /**
   * 全ての有効な認証情報を取得
   */
  async getAllActiveCredentials(): Promise<MarketplaceCredential[]> {
    try {
      const { data, error } = await this.supabase
        .from('decrypted_marketplace_credentials')
        .select('*')
        .eq('is_active', true)
        .order('marketplace', { ascending: true })
        .order('account_name', { ascending: true });

      if (error) throw error;

      return (data || []) as MarketplaceCredential[];
    } catch (error: any) {
      console.error('❌ getAllActiveCredentials エラー:', error);
      throw error;
    }
  }

  /**
   * マーケットプレイス別の認証情報を取得
   */
  async getCredentialsByMarketplace(marketplace: Marketplace): Promise<MarketplaceCredential[]> {
    try {
      const { data, error } = await this.supabase
        .from('decrypted_marketplace_credentials')
        .select('*')
        .eq('marketplace', marketplace)
        .eq('is_active', true);

      if (error) throw error;

      return (data || []) as MarketplaceCredential[];
    } catch (error: any) {
      console.error('❌ getCredentialsByMarketplace エラー:', error);
      throw error;
    }
  }

  /**
   * アクセストークンを更新（リフレッシュ後）
   */
  async updateAccessToken(input: TokenUpdateInput): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.rpc('update_marketplace_access_token', {
        p_marketplace: input.marketplace,
        p_account_name: input.account_name,
        p_environment: input.environment || 'production',
        p_access_token: input.access_token,
        p_token_expires_at: input.token_expires_at.toISOString(),
        p_refresh_token: input.refresh_token || null,
      });

      if (error) {
        console.error('❌ トークンの更新に失敗:', error);
        throw new Error(`Failed to update token: ${error.message}`);
      }

      console.log(`✅ トークンを更新: ${input.marketplace} / ${input.account_name}`);
      return data as boolean;
    } catch (error: any) {
      console.error('❌ updateAccessToken エラー:', error);
      throw error;
    }
  }

  /**
   * 期限切れ間近のトークンを取得（5分以内に期限切れ）
   */
  async getExpiringTokens(minutesThreshold: number = 5): Promise<MarketplaceCredential[]> {
    try {
      const thresholdTime = new Date();
      thresholdTime.setMinutes(thresholdTime.getMinutes() + minutesThreshold);

      const { data, error } = await this.supabase
        .from('decrypted_marketplace_credentials')
        .select('*')
        .eq('is_active', true)
        .not('token_expires_at', 'is', null)
        .lte('token_expires_at', thresholdTime.toISOString());

      if (error) throw error;

      return (data || []) as MarketplaceCredential[];
    } catch (error: any) {
      console.error('❌ getExpiringTokens エラー:', error);
      throw error;
    }
  }

  /**
   * 認証情報を無効化
   */
  async deactivateCredential(
    marketplace: Marketplace,
    accountName: string,
    environment: 'production' | 'sandbox' = 'production'
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('marketplace_credentials')
        .update({ is_active: false })
        .eq('marketplace', marketplace)
        .eq('account_name', accountName)
        .eq('environment', environment);

      if (error) throw error;

      console.log(`✅ 認証情報を無効化: ${marketplace} / ${accountName}`);
      return true;
    } catch (error: any) {
      console.error('❌ deactivateCredential エラー:', error);
      throw error;
    }
  }

  /**
   * エラーを記録
   */
  async recordError(
    marketplace: Marketplace,
    accountName: string,
    errorMessage: string,
    environment: 'production' | 'sandbox' = 'production'
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('marketplace_credentials')
        .update({ last_error: errorMessage })
        .eq('marketplace', marketplace)
        .eq('account_name', accountName)
        .eq('environment', environment);

      if (error) throw error;

      console.log(`⚠️ エラーを記録: ${marketplace} / ${accountName} - ${errorMessage}`);
    } catch (error: any) {
      console.error('❌ recordError エラー:', error);
    }
  }

  /**
   * トークンが有効かチェック
   */
  isTokenValid(credential: MarketplaceCredential, minutesBuffer: number = 5): boolean {
    if (!credential.access_token || !credential.token_expires_at) {
      return false;
    }

    const expiresAt = new Date(credential.token_expires_at);
    const now = new Date();
    const bufferTime = new Date(now.getTime() + minutesBuffer * 60 * 1000);

    return expiresAt > bufferTime;
  }

  /**
   * 統計情報を取得
   */
  async getCredentialStats(): Promise<{
    total: number;
    active: number;
    expiringSoon: number;
    byMarketplace: Record<Marketplace, number>;
  }> {
    try {
      const allCredentials = await this.getAllActiveCredentials();
      const expiringTokens = await this.getExpiringTokens(30); // 30分以内

      const byMarketplace = allCredentials.reduce((acc, cred) => {
        acc[cred.marketplace] = (acc[cred.marketplace] || 0) + 1;
        return acc;
      }, {} as Record<Marketplace, number>);

      return {
        total: allCredentials.length,
        active: allCredentials.filter((c) => this.isTokenValid(c)).length,
        expiringSoon: expiringTokens.length,
        byMarketplace,
      };
    } catch (error: any) {
      console.error('❌ getCredentialStats エラー:', error);
      throw error;
    }
  }
}

/**
 * デフォルトインスタンスをエクスポート
 */
export const secureCredentialsService = new SecureCredentialsService();

/**
 * 使用例
 */
/*
// 1. 認証情報を保存
await secureCredentialsService.saveCredential({
  marketplace: 'ebay',
  account_name: 'main_account',
  environment: 'production',
  client_id: 'YOUR_CLIENT_ID',
  client_secret: 'YOUR_CLIENT_SECRET',
  refresh_token: 'YOUR_REFRESH_TOKEN',
  token_scope: ['https://api.ebay.com/oauth/api_scope'],
});

// 2. 認証情報を取得
const credential = await secureCredentialsService.getCredential('ebay', 'main_account');
if (credential && credential.access_token) {
  console.log('Access Token:', credential.access_token);
}

// 3. トークンを更新
await secureCredentialsService.updateAccessToken({
  marketplace: 'ebay',
  account_name: 'main_account',
  access_token: 'NEW_ACCESS_TOKEN',
  token_expires_at: new Date(Date.now() + 7200 * 1000), // 2時間後
});

// 4. 統計情報を取得
const stats = await secureCredentialsService.getCredentialStats();
console.log('Credentials Stats:', stats);
*/
