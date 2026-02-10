/**
 * ==============================================================================
 * Token Encryption Service
 * ==============================================================================
 * P0: 認証情報暗号化サービス
 *
 * Supabase + pgsodiumを使用してAPIトークンを安全に保存・取得する。
 * 全モール（eBay, Shopee, Amazon, Coupang, メルカリ, BUYMA）に対応。
 * ==============================================================================
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ==============================================================================
// 型定義
// ==============================================================================

export type MallType = 'ebay' | 'shopee' | 'amazon' | 'coupang' | 'mercari' | 'buyma' | 'yahoo' | 'rakuten';

export type TokenType = 'access_token' | 'refresh_token' | 'api_key' | 'oauth_token' | 'client_id' | 'client_secret';

export interface ApiToken {
  id: string;
  mall: MallType;
  account_name: string;
  token_type: TokenType;
  expires_at: string | null;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface DecryptedToken {
  token: string;
  expires_at: string | null;
  is_expired: boolean;
}

export interface ExpiredTokenInfo {
  mall: MallType;
  account_name: string;
  token_type: TokenType;
  expires_at: string;
  days_until_expiry: number;
}

// ==============================================================================
// TokenEncryptionService クラス
// ==============================================================================

export class TokenEncryptionService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase環境変数が設定されていません');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * トークンを暗号化して保存
   *
   * @param mall - モール名
   * @param accountName - アカウント識別子
   * @param tokenType - トークンタイプ
   * @param token - トークン本体（平文）
   * @param expiresAt - 有効期限（オプション）
   * @param createdBy - 作成者（オプション）
   * @returns トークンID
   */
  async saveToken(
    mall: MallType,
    accountName: string,
    tokenType: TokenType,
    token: string,
    expiresAt?: Date | null,
    createdBy?: string
  ): Promise<string> {
    const { data, error } = await this.supabase.rpc('insert_encrypted_token', {
      p_mall: mall,
      p_account_name: accountName,
      p_token_type: tokenType,
      p_token: token,
      p_expires_at: expiresAt?.toISOString() || null,
      p_created_by: createdBy || null,
    });

    if (error) {
      throw new Error(`トークン保存エラー: ${error.message}`);
    }

    return data as string;
  }

  /**
   * トークンを復号化して取得
   *
   * @param mall - モール名
   * @param accountName - アカウント識別子
   * @param tokenType - トークンタイプ
   * @returns 復号化されたトークン情報
   */
  async getToken(
    mall: MallType,
    accountName: string,
    tokenType: TokenType
  ): Promise<DecryptedToken> {
    const { data, error } = await this.supabase.rpc('get_decrypted_token', {
      p_mall: mall,
      p_account_name: accountName,
      p_token_type: tokenType,
    });

    if (error) {
      throw new Error(`トークン取得エラー: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error(`トークンが見つかりません: ${mall} / ${accountName} / ${tokenType}`);
    }

    return data[0] as DecryptedToken;
  }

  /**
   * 期限切れトークンをチェック
   *
   * @returns 期限切れ間近（7日以内）のトークンリスト
   */
  async checkExpiredTokens(): Promise<ExpiredTokenInfo[]> {
    const { data, error } = await this.supabase.rpc('check_expired_tokens');

    if (error) {
      throw new Error(`期限切れトークンチェックエラー: ${error.message}`);
    }

    return (data || []) as ExpiredTokenInfo[];
  }

  /**
   * トークンを無効化
   *
   * @param mall - モール名
   * @param accountName - アカウント識別子
   * @param tokenType - トークンタイプ
   */
  async deactivateToken(
    mall: MallType,
    accountName: string,
    tokenType: TokenType
  ): Promise<void> {
    const { error } = await this.supabase
      .from('api_tokens')
      .update({ is_active: false })
      .eq('mall', mall)
      .eq('account_name', accountName)
      .eq('token_type', tokenType)
      .eq('is_active', true);

    if (error) {
      throw new Error(`トークン無効化エラー: ${error.message}`);
    }
  }

  /**
   * 全トークンを取得（メタデータのみ、トークン本体は含まない）
   *
   * @param mall - モール名（オプション）
   * @param activeOnly - アクティブなトークンのみ取得
   * @returns トークンメタデータのリスト
   */
  async listTokens(mall?: MallType, activeOnly: boolean = true): Promise<ApiToken[]> {
    let query = this.supabase
      .from('api_tokens')
      .select('id, mall, account_name, token_type, expires_at, is_active, last_used_at, created_at, updated_at, created_by')
      .order('created_at', { ascending: false });

    if (mall) {
      query = query.eq('mall', mall);
    }

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`トークンリスト取得エラー: ${error.message}`);
    }

    return (data || []) as ApiToken[];
  }

  /**
   * トークンが存在するかチェック
   *
   * @param mall - モール名
   * @param accountName - アカウント識別子
   * @param tokenType - トークンタイプ
   * @returns 存在する場合true
   */
  async tokenExists(
    mall: MallType,
    accountName: string,
    tokenType: TokenType
  ): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('api_tokens')
      .select('id')
      .eq('mall', mall)
      .eq('account_name', accountName)
      .eq('token_type', tokenType)
      .eq('is_active', true)
      .limit(1);

    if (error) {
      return false;
    }

    return data && data.length > 0;
  }

  /**
   * トークンを更新（既存トークンを無効化して新規作成）
   *
   * @param mall - モール名
   * @param accountName - アカウント識別子
   * @param tokenType - トークンタイプ
   * @param newToken - 新しいトークン
   * @param expiresAt - 有効期限
   * @returns 新しいトークンID
   */
  async updateToken(
    mall: MallType,
    accountName: string,
    tokenType: TokenType,
    newToken: string,
    expiresAt?: Date | null
  ): Promise<string> {
    return this.saveToken(mall, accountName, tokenType, newToken, expiresAt);
  }
}

// ==============================================================================
// ヘルパー関数
// ==============================================================================

/**
 * シングルトンインスタンス
 */
let tokenServiceInstance: TokenEncryptionService | null = null;

/**
 * TokenEncryptionServiceのシングルトンインスタンスを取得
 */
export function getTokenService(): TokenEncryptionService {
  if (!tokenServiceInstance) {
    tokenServiceInstance = new TokenEncryptionService();
  }
  return tokenServiceInstance;
}

/**
 * eBayトークンを保存
 */
export async function saveEbayToken(
  accountName: string,
  accessToken: string,
  expiresAt: Date
): Promise<string> {
  const service = getTokenService();
  return service.saveToken('ebay', accountName, 'access_token', accessToken, expiresAt);
}

/**
 * eBayトークンを取得
 */
export async function getEbayToken(accountName: string): Promise<string> {
  const service = getTokenService();
  const tokenData = await service.getToken('ebay', accountName, 'access_token');

  if (tokenData.is_expired) {
    throw new Error(`eBayトークンの有効期限が切れています: ${accountName}`);
  }

  return tokenData.token;
}

/**
 * 全モールの期限切れトークンをチェックしてアラートを返す
 */
export async function getTokenExpiryAlerts(): Promise<{
  critical: ExpiredTokenInfo[];
  warning: ExpiredTokenInfo[];
}> {
  const service = getTokenService();
  const expiredTokens = await service.checkExpiredTokens();

  const critical = expiredTokens.filter(t => t.days_until_expiry <= 1);
  const warning = expiredTokens.filter(t => t.days_until_expiry > 1 && t.days_until_expiry <= 7);

  return { critical, warning };
}

// ==============================================================================
// エクスポート
// ==============================================================================

export default TokenEncryptionService;
