// lib/security/credential-manager.ts
// P0: 認証情報管理システム（暗号化/復号化）

import { createClient } from '@/lib/supabase/server';

/**
 * 認証情報タイプ
 */
export enum CredentialType {
  MARKETPLACE_API = 'MARKETPLACE_API',
  PAYMENT_GATEWAY = 'PAYMENT_GATEWAY',
  RPA_SUPPLIER = 'RPA_SUPPLIER',
  SHIPPING_CARRIER = 'SHIPPING_CARRIER',
  FINANCIAL_API = 'FINANCIAL_API',
  OTHER = 'OTHER',
}

/**
 * サービス名
 */
export enum ServiceName {
  EBAY = 'ebay',
  AMAZON = 'amazon',
  SHOPEE = 'shopee',
  QOO10 = 'qoo10',
  YAHOO_AUCTION = 'yahoo_auction',
  RAKUTEN = 'rakuten',
  MERCARI = 'mercari',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  FEDEX = 'fedex',
  DHL = 'dhl',
  JAPAN_POST = 'japan_post',
}

/**
 * 環境
 */
export enum Environment {
  PRODUCTION = 'production',
  SANDBOX = 'sandbox',
  DEVELOPMENT = 'development',
}

/**
 * 認証情報データ
 */
export interface CredentialData {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  username?: string;
  password?: string;
  additionalData?: string; // JSON文字列
  tokenExpiresAt?: Date;
}

/**
 * 復号化された認証情報
 */
export interface DecryptedCredential {
  credentialId: string;
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  username?: string;
  password?: string;
  additionalData?: string;
  tokenExpiresAt?: Date;
  isActive: boolean;
}

/**
 * 認証情報管理クラス
 * pgsodiumを使用した暗号化/復号化を行う
 */
export class CredentialManager {
  /**
   * 認証情報を暗号化して保存
   */
  static async saveCredential(
    credentialType: CredentialType,
    serviceName: ServiceName | string,
    environment: Environment,
    data: CredentialData
  ): Promise<string> {
    try {
      const supabase = await createClient();

      const { data: result, error } = await supabase.rpc('save_encrypted_credential', {
        p_credential_type: credentialType,
        p_service_name: serviceName,
        p_environment: environment,
        p_api_key: data.apiKey || null,
        p_api_secret: data.apiSecret || null,
        p_access_token: data.accessToken || null,
        p_refresh_token: data.refreshToken || null,
        p_username: data.username || null,
        p_password: data.password || null,
        p_additional_data: data.additionalData || null,
        p_token_expires_at: data.tokenExpiresAt?.toISOString() || null,
      });

      if (error) {
        throw new Error(`Failed to save credential: ${error.message}`);
      }

      return result as string;
    } catch (error: any) {
      console.error('CredentialManager.saveCredential error:', error);
      throw error;
    }
  }

  /**
   * 認証情報を復号化して取得
   */
  static async getCredential(
    serviceName: ServiceName | string,
    environment: Environment = Environment.PRODUCTION,
    credentialType: CredentialType = CredentialType.MARKETPLACE_API
  ): Promise<DecryptedCredential | null> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase.rpc('get_decrypted_credential', {
        p_service_name: serviceName,
        p_environment: environment,
        p_credential_type: credentialType,
      });

      if (error) {
        throw new Error(`Failed to get credential: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return null;
      }

      const credential = data[0];

      return {
        credentialId: credential.credential_id,
        apiKey: credential.api_key,
        apiSecret: credential.api_secret,
        accessToken: credential.access_token,
        refreshToken: credential.refresh_token,
        username: credential.username,
        password: credential.password,
        additionalData: credential.additional_data,
        tokenExpiresAt: credential.token_expires_at
          ? new Date(credential.token_expires_at)
          : undefined,
        isActive: credential.is_active,
      };
    } catch (error: any) {
      console.error('CredentialManager.getCredential error:', error);
      throw error;
    }
  }

  /**
   * RPA仕入先認証情報を取得
   * （古物台帳システム用）
   */
  static async getRPASupplierCredential(
    supplier: 'yahoo_auction' | 'amazon' | 'rakuten' | 'mercari'
  ): Promise<{ username: string; password: string } | null> {
    try {
      const credential = await this.getCredential(
        supplier,
        Environment.PRODUCTION,
        CredentialType.RPA_SUPPLIER
      );

      if (!credential || !credential.username || !credential.password) {
        console.warn(
          `RPA credentials not found for supplier: ${supplier}`
        );
        return null;
      }

      return {
        username: credential.username,
        password: credential.password,
      };
    } catch (error: any) {
      console.error('getRPASupplierCredential error:', error);
      return null;
    }
  }

  /**
   * モールAPI認証情報を取得
   */
  static async getMarketplaceCredential(
    marketplace: 'ebay' | 'amazon' | 'shopee' | 'qoo10'
  ): Promise<DecryptedCredential | null> {
    return this.getCredential(
      marketplace,
      Environment.PRODUCTION,
      CredentialType.MARKETPLACE_API
    );
  }

  /**
   * 決済ゲートウェイ認証情報を取得
   */
  static async getPaymentCredential(
    gateway: 'paypal' | 'stripe'
  ): Promise<DecryptedCredential | null> {
    return this.getCredential(
      gateway,
      Environment.PRODUCTION,
      CredentialType.PAYMENT_GATEWAY
    );
  }

  /**
   * 配送業者API認証情報を取得
   */
  static async getShippingCredential(
    carrier: 'fedex' | 'dhl' | 'japan_post'
  ): Promise<DecryptedCredential | null> {
    return this.getCredential(
      carrier,
      Environment.PRODUCTION,
      CredentialType.SHIPPING_CARRIER
    );
  }

  /**
   * トークンの有効期限チェック
   */
  static isTokenExpired(credential: DecryptedCredential): boolean {
    if (!credential.tokenExpiresAt) {
      return false; // 有効期限が設定されていない場合は期限切れとみなさない
    }

    return new Date() >= credential.tokenExpiresAt;
  }

  /**
   * 認証情報の無効化
   */
  static async deactivateCredential(credentialId: string): Promise<void> {
    try {
      const supabase = await createClient();

      const { error } = await supabase
        .from('encrypted_credentials')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('credential_id', credentialId);

      if (error) {
        throw new Error(`Failed to deactivate credential: ${error.message}`);
      }
    } catch (error: any) {
      console.error('CredentialManager.deactivateCredential error:', error);
      throw error;
    }
  }

  /**
   * 使用ログを記録
   */
  static async logUsage(
    credentialId: string,
    usageContext: string,
    success: boolean,
    errorMessage?: string
  ): Promise<void> {
    try {
      const supabase = await createClient();

      await supabase.from('credential_usage_log').insert({
        credential_id: credentialId,
        usage_context: usageContext,
        success,
        error_message: errorMessage || null,
      });
    } catch (error: any) {
      console.error('CredentialManager.logUsage error:', error);
      // ログ記録の失敗は無視（メイン処理に影響させない）
    }
  }
}

/**
 * 簡易アクセス関数
 */

// eBay API認証情報取得
export async function getEbayCredentials() {
  return CredentialManager.getMarketplaceCredential('ebay');
}

// Amazon API認証情報取得
export async function getAmazonCredentials() {
  return CredentialManager.getMarketplaceCredential('amazon');
}

// Yahoo!オークション RPA認証情報取得
export async function getYahooAuctionRPACredentials() {
  return CredentialManager.getRPASupplierCredential('yahoo_auction');
}

// PayPal API認証情報取得
export async function getPayPalCredentials() {
  return CredentialManager.getPaymentCredential('paypal');
}
