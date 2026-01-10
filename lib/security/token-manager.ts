/**
 * P0: 暗号化トークン管理ユーティリティ
 *
 * pgsodiumを使用して、全モールのAPIトークンと財務情報を
 * 安全に保存・取得します。
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service Role Keyを使用したクライアント（暗号化機能にアクセス可能）
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

export type Marketplace =
  | 'ebay'
  | 'amazon'
  | 'yahoo'
  | 'rakuten'
  | 'mercari'
  | 'shopify'
  | 'base'
  | 'stores';

export type TokenType =
  | 'access_token'
  | 'refresh_token'
  | 'api_key'
  | 'secret_key'
  | 'app_id'
  | 'dev_id'
  | 'cert_id';

export type Environment = 'production' | 'sandbox' | 'development';

export type FinancialService =
  | 'stripe'
  | 'paypal'
  | 'bank_account'
  | 'tax_service'
  | 'accounting_service';

/**
 * APIトークンを暗号化して保存
 */
export async function storeEncryptedToken(params: {
  marketplace: Marketplace;
  tokenType: TokenType;
  tokenValue: string;
  environment?: Environment;
  expiresAt?: Date;
}): Promise<{ success: boolean; tokenId?: string; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin.rpc('encrypt_and_store_token', {
      p_marketplace: params.marketplace,
      p_token_type: params.tokenType,
      p_token_value: params.tokenValue,
      p_environment: params.environment || 'production',
      p_expires_at: params.expiresAt?.toISOString() || null
    });

    if (error) {
      console.error('Failed to encrypt and store token:', error);
      return { success: false, error: error.message };
    }

    return { success: true, tokenId: data };
  } catch (error: any) {
    console.error('Error in storeEncryptedToken:', error);
    return { success: false, error: error.message };
  }
}

/**
 * APIトークンを復号化して取得
 */
export async function getDecryptedToken(params: {
  marketplace: Marketplace;
  tokenType: TokenType;
  environment?: Environment;
}): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin.rpc('decrypt_token', {
      p_marketplace: params.marketplace,
      p_token_type: params.tokenType,
      p_environment: params.environment || 'production'
    });

    if (error) {
      console.error('Failed to decrypt token:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'Token not found' };
    }

    return { success: true, token: data };
  } catch (error: any) {
    console.error('Error in getDecryptedToken:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 財務トークンを暗号化して保存
 */
export async function storeFinancialToken(params: {
  serviceName: FinancialService;
  tokenType: string;
  credential: string;
  environment?: Environment;
  expiresAt?: Date;
}): Promise<{ success: boolean; tokenId?: string; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin.rpc(
      'encrypt_and_store_financial_token',
      {
        p_service_name: params.serviceName,
        p_token_type: params.tokenType,
        p_credential: params.credential,
        p_environment: params.environment || 'production',
        p_expires_at: params.expiresAt?.toISOString() || null
      }
    );

    if (error) {
      console.error('Failed to encrypt and store financial token:', error);
      return { success: false, error: error.message };
    }

    return { success: true, tokenId: data };
  } catch (error: any) {
    console.error('Error in storeFinancialToken:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 財務トークンを復号化して取得
 */
export async function getFinancialToken(params: {
  serviceName: FinancialService;
  tokenType: string;
  environment?: Environment;
}): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin.rpc('decrypt_financial_token', {
      p_service_name: params.serviceName,
      p_token_type: params.tokenType,
      p_environment: params.environment || 'production'
    });

    if (error) {
      console.error('Failed to decrypt financial token:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'Financial token not found' };
    }

    return { success: true, token: data };
  } catch (error: any) {
    console.error('Error in getFinancialToken:', error);
    return { success: false, error: error.message };
  }
}

/**
 * トークンを無効化
 */
export async function deactivateToken(params: {
  marketplace: Marketplace;
  tokenType: TokenType;
  environment?: Environment;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('api_tokens')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('marketplace', params.marketplace)
      .eq('token_type', params.tokenType)
      .eq('environment', params.environment || 'production');

    if (error) {
      console.error('Failed to deactivate token:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in deactivateToken:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 有効なトークン一覧を取得（復号化はしない、メタデータのみ）
 */
export async function listActiveTokens(marketplace?: Marketplace): Promise<{
  success: boolean;
  tokens?: Array<{
    id: string;
    marketplace: Marketplace;
    tokenType: TokenType;
    environment: Environment;
    expiresAt: string | null;
    lastUsedAt: string | null;
  }>;
  error?: string;
}> {
  try {
    let query = supabaseAdmin
      .from('api_tokens')
      .select('id, marketplace, token_type, environment, expires_at, last_used_at')
      .eq('is_active', true);

    if (marketplace) {
      query = query.eq('marketplace', marketplace);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to list active tokens:', error);
      return { success: false, error: error.message };
    }

    const tokens = data?.map((row) => ({
      id: row.id,
      marketplace: row.marketplace as Marketplace,
      tokenType: row.token_type as TokenType,
      environment: row.environment as Environment,
      expiresAt: row.expires_at,
      lastUsedAt: row.last_used_at
    }));

    return { success: true, tokens };
  } catch (error: any) {
    console.error('Error in listActiveTokens:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 期限切れトークンをチェック
 */
export async function checkExpiredTokens(): Promise<{
  success: boolean;
  expiredTokens?: Array<{
    marketplace: Marketplace;
    tokenType: TokenType;
    expiresAt: string;
  }>;
  error?: string;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from('api_tokens')
      .select('marketplace, token_type, expires_at')
      .eq('is_active', true)
      .not('expires_at', 'is', null)
      .lt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Failed to check expired tokens:', error);
      return { success: false, error: error.message };
    }

    const expiredTokens = data?.map((row) => ({
      marketplace: row.marketplace as Marketplace,
      tokenType: row.token_type as TokenType,
      expiresAt: row.expires_at!
    }));

    return { success: true, expiredTokens };
  } catch (error: any) {
    console.error('Error in checkExpiredTokens:', error);
    return { success: false, error: error.message };
  }
}

// モール別のトークン取得ヘルパー関数

export async function getEbayTokens() {
  const accessToken = await getDecryptedToken({
    marketplace: 'ebay',
    tokenType: 'access_token'
  });

  const refreshToken = await getDecryptedToken({
    marketplace: 'ebay',
    tokenType: 'refresh_token'
  });

  return {
    accessToken: accessToken.token,
    refreshToken: refreshToken.token
  };
}

export async function getAmazonTokens() {
  const accessToken = await getDecryptedToken({
    marketplace: 'amazon',
    tokenType: 'access_token'
  });

  const refreshToken = await getDecryptedToken({
    marketplace: 'amazon',
    tokenType: 'refresh_token'
  });

  return {
    accessToken: accessToken.token,
    refreshToken: refreshToken.token
  };
}

export async function getYahooTokens() {
  const accessToken = await getDecryptedToken({
    marketplace: 'yahoo',
    tokenType: 'access_token'
  });

  const refreshToken = await getDecryptedToken({
    marketplace: 'yahoo',
    tokenType: 'refresh_token'
  });

  return {
    accessToken: accessToken.token,
    refreshToken: refreshToken.token
  };
}
