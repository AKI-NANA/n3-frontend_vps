/**
 * P0: 暗号化された認証情報管理システム
 *
 * pgsodiumを使用してマーケットプレイスの認証情報を安全に管理
 *
 * 機能:
 * - 認証情報の暗号化保存/取得
 * - トークンの自動リフレッシュ
 * - 監査ログの記録
 * - セキュアなアクセス制御
 */

import { createClient } from '@/lib/supabase/server';

export type MarketplaceId =
  | 'EBAY_US' | 'EBAY_UK' | 'EBAY_JP'
  | 'AMAZON_JP' | 'AMAZON_US'
  | 'SHOPEE_SG' | 'SHOPEE_TH' | 'SHOPEE_MY'
  | 'MERCARI_JP'
  | 'RAKUMA_JP'
  | 'YAHOO_JP'
  | 'COUPANG_KR'
  | 'QOO10_JP';

export interface MarketplaceCredential {
  id: string;
  marketplace_id: MarketplaceId;
  marketplace_name: string;
  client_id?: string | null;
  client_secret?: string | null;
  access_token?: string | null;
  refresh_token?: string | null;
  api_key?: string | null;
  seller_id?: string | null;
  metadata?: Record<string, any> | null;
  token_expires_at?: string | null;
  refresh_token_expires_at?: string | null;
  is_active: boolean;
  is_token_valid: boolean;
  last_token_refresh_at?: string | null;
  last_token_validation_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpsertCredentialParams {
  marketplace_id: MarketplaceId;
  marketplace_name: string;
  client_id?: string;
  client_secret?: string;
  access_token?: string;
  refresh_token?: string;
  api_key?: string;
  seller_id?: string;
  metadata?: Record<string, any>;
  token_expires_at?: Date;
  refresh_token_expires_at?: Date;
}

/**
 * 暗号化された認証情報を取得
 *
 * @param marketplaceId マーケットプレイスID
 * @returns 復号化された認証情報
 */
export async function getMarketplaceCredential(
  marketplaceId: MarketplaceId
): Promise<MarketplaceCredential | null> {
  const supabase = await createClient();

  try {
    // marketplace_credentials_decrypted ビューから取得
    // このビューは自動的に復号化を行います
    const { data, error } = await supabase
      .from('marketplace_credentials_decrypted')
      .select('*')
      .eq('marketplace_id', marketplaceId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error(`認証情報取得エラー (${marketplaceId}):`, error);
      return null;
    }

    // 監査ログを記録
    await logCredentialAccess(marketplaceId, 'ACCESS');

    // metadataをJSON parseする
    let parsedMetadata = null;
    if (data.metadata) {
      try {
        parsedMetadata = typeof data.metadata === 'string'
          ? JSON.parse(data.metadata)
          : data.metadata;
      } catch (e) {
        console.warn(`Metadata parse warning for ${marketplaceId}:`, e);
      }
    }

    return {
      ...data,
      metadata: parsedMetadata
    };

  } catch (error: any) {
    console.error('認証情報取得の予期しないエラー:', error);
    return null;
  }
}

/**
 * 全ての有効な認証情報を取得
 *
 * @returns 全ての復号化された認証情報の配列
 */
export async function getAllMarketplaceCredentials(): Promise<MarketplaceCredential[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('marketplace_credentials_decrypted')
      .select('*')
      .eq('is_active', true)
      .order('marketplace_name');

    if (error) {
      console.error('全認証情報取得エラー:', error);
      return [];
    }

    return (data || []).map(item => ({
      ...item,
      metadata: item.metadata ?
        (typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata)
        : null
    }));

  } catch (error: any) {
    console.error('全認証情報取得の予期しないエラー:', error);
    return [];
  }
}

/**
 * 認証情報を暗号化して保存/更新
 *
 * @param params 認証情報パラメータ
 * @returns 保存された認証情報のID
 */
export async function upsertMarketplaceCredential(
  params: UpsertCredentialParams
): Promise<string | null> {
  const supabase = await createClient();

  try {
    // PostgreSQL関数を呼び出して暗号化して保存
    const { data, error } = await supabase.rpc('upsert_marketplace_credential', {
      p_marketplace_id: params.marketplace_id,
      p_marketplace_name: params.marketplace_name,
      p_client_id: params.client_id || null,
      p_client_secret: params.client_secret || null,
      p_access_token: params.access_token || null,
      p_refresh_token: params.refresh_token || null,
      p_api_key: params.api_key || null,
      p_seller_id: params.seller_id || null,
      p_metadata: params.metadata || null,
      p_token_expires_at: params.token_expires_at?.toISOString() || null,
      p_refresh_token_expires_at: params.refresh_token_expires_at?.toISOString() || null
    });

    if (error) {
      console.error(`認証情報保存エラー (${params.marketplace_id}):`, error);
      return null;
    }

    // 監査ログを記録
    await logCredentialAccess(params.marketplace_id, 'UPDATE');

    return data as string;

  } catch (error: any) {
    console.error('認証情報保存の予期しないエラー:', error);
    return null;
  }
}

/**
 * アクセストークンを更新
 *
 * @param marketplaceId マーケットプレイスID
 * @param accessToken 新しいアクセストークン
 * @param expiresAt 有効期限
 */
export async function updateAccessToken(
  marketplaceId: MarketplaceId,
  accessToken: string,
  expiresAt: Date
): Promise<boolean> {
  const supabase = await createClient();

  try {
    // 現在の認証情報を取得
    const current = await getMarketplaceCredential(marketplaceId);
    if (!current) {
      console.error(`認証情報が見つかりません: ${marketplaceId}`);
      return false;
    }

    // トークンのみを更新
    const result = await upsertMarketplaceCredential({
      marketplace_id: marketplaceId,
      marketplace_name: current.marketplace_name,
      client_id: current.client_id || undefined,
      client_secret: current.client_secret || undefined,
      access_token: accessToken,
      refresh_token: current.refresh_token || undefined,
      api_key: current.api_key || undefined,
      seller_id: current.seller_id || undefined,
      metadata: current.metadata || undefined,
      token_expires_at: expiresAt,
      refresh_token_expires_at: current.refresh_token_expires_at
        ? new Date(current.refresh_token_expires_at)
        : undefined
    });

    if (result) {
      // トークン更新時刻を記録
      await supabase
        .from('marketplace_credentials')
        .update({
          last_token_refresh_at: new Date().toISOString(),
          is_token_valid: true
        })
        .eq('marketplace_id', marketplaceId);

      await logCredentialAccess(marketplaceId, 'REFRESH');
    }

    return result !== null;

  } catch (error: any) {
    console.error('アクセストークン更新エラー:', error);
    return false;
  }
}

/**
 * トークンの有効性を確認
 *
 * @param marketplaceId マーケットプレイスID
 * @returns トークンが有効かどうか
 */
export async function isTokenValid(marketplaceId: MarketplaceId): Promise<boolean> {
  const credential = await getMarketplaceCredential(marketplaceId);

  if (!credential || !credential.access_token) {
    return false;
  }

  // 有効期限を確認（5分前にfalseを返す）
  if (credential.token_expires_at) {
    const expiresAt = new Date(credential.token_expires_at);
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    if (expiresAt < fiveMinutesFromNow) {
      return false;
    }
  }

  return credential.is_token_valid;
}

/**
 * 認証情報を無効化
 *
 * @param marketplaceId マーケットプレイスID
 */
export async function deactivateCredential(marketplaceId: MarketplaceId): Promise<boolean> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('marketplace_credentials')
      .update({ is_active: false })
      .eq('marketplace_id', marketplaceId);

    if (error) {
      console.error(`認証情報無効化エラー (${marketplaceId}):`, error);
      return false;
    }

    await logCredentialAccess(marketplaceId, 'DELETE');
    return true;

  } catch (error: any) {
    console.error('認証情報無効化の予期しないエラー:', error);
    return false;
  }
}

/**
 * 監査ログを記録
 *
 * @param marketplaceId マーケットプレイスID
 * @param action アクション
 * @param details 詳細情報
 */
async function logCredentialAccess(
  marketplaceId: MarketplaceId,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ACCESS' | 'REFRESH',
  details?: Record<string, any>
): Promise<void> {
  const supabase = await createClient();

  try {
    // 認証情報のIDを取得
    const { data: cred } = await supabase
      .from('marketplace_credentials')
      .select('id')
      .eq('marketplace_id', marketplaceId)
      .single();

    if (!cred) return;

    await supabase
      .from('marketplace_credentials_audit_log')
      .insert({
        credential_id: cred.id,
        marketplace_id: marketplaceId,
        action,
        details: details || {},
        performed_at: new Date().toISOString()
      });

  } catch (error: any) {
    // 監査ログ記録のエラーは無視（メイン処理を妨げない）
    console.warn('監査ログ記録エラー:', error.message);
  }
}

/**
 * 環境変数から認証情報をマイグレーション（初回セットアップ用）
 *
 * 注意：本番環境では一度だけ実行してください
 */
export async function migrateCredentialsFromEnv(): Promise<void> {
  console.log('🔄 環境変数から認証情報をマイグレーション中...');

  const migrations: Array<{ id: MarketplaceId; name: string; envPrefix: string }> = [
    { id: 'EBAY_US', name: 'eBay United States', envPrefix: 'EBAY' },
    { id: 'AMAZON_JP', name: 'Amazon Japan', envPrefix: 'AMAZON_JP' },
    { id: 'SHOPEE_SG', name: 'Shopee Singapore', envPrefix: 'SHOPEE' },
    { id: 'MERCARI_JP', name: 'メルカリ Japan', envPrefix: 'MERCARI' },
  ];

  for (const migration of migrations) {
    const clientId = process.env[`${migration.envPrefix}_CLIENT_ID`];
    const clientSecret = process.env[`${migration.envPrefix}_CLIENT_SECRET`];
    const refreshToken = process.env[`${migration.envPrefix}_REFRESH_TOKEN`];
    const apiKey = process.env[`${migration.envPrefix}_API_KEY`];

    if (clientId || refreshToken || apiKey) {
      console.log(`  マイグレーション中: ${migration.name}...`);

      await upsertMarketplaceCredential({
        marketplace_id: migration.id,
        marketplace_name: migration.name,
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        api_key: apiKey,
      });

      console.log(`  ✅ ${migration.name} 完了`);
    } else {
      console.log(`  ⏭️  ${migration.name} - 環境変数なし、スキップ`);
    }
  }

  console.log('✅ マイグレーション完了');
}

/**
 * Gemini APIキーを取得
 * 環境変数から取得（将来的にはDBから暗号化して取得）
 *
 * @returns Gemini APIキー
 */
export async function getGeminiApiKey(): Promise<string> {
  // 環境変数から取得
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key not found. Set GEMINI_API_KEY or GOOGLE_AI_API_KEY environment variable.');
  }
  
  return apiKey;
}

/**
 * 認証情報のヘルスチェック
 *
 * @returns ヘルスチェック結果
 */
export async function checkCredentialsHealth(): Promise<{
  total: number;
  active: number;
  validTokens: number;
  expiringSoon: number;
  issues: string[];
}> {
  const credentials = await getAllMarketplaceCredentials();

  let validTokens = 0;
  let expiringSoon = 0;
  const issues: string[] = [];
  const now = new Date();
  const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  for (const cred of credentials) {
    const isValid = await isTokenValid(cred.marketplace_id);

    if (isValid) {
      validTokens++;
    } else {
      issues.push(`${cred.marketplace_name}: トークンが無効または期限切れ`);
    }

    if (cred.token_expires_at) {
      const expiresAt = new Date(cred.token_expires_at);
      if (expiresAt < oneDayFromNow && expiresAt > now) {
        expiringSoon++;
        issues.push(`${cred.marketplace_name}: トークンが24時間以内に期限切れ`);
      }
    }

    if (!cred.refresh_token && !cred.api_key) {
      issues.push(`${cred.marketplace_name}: リフレッシュトークンまたはAPIキーがありません`);
    }
  }

  return {
    total: credentials.length,
    active: credentials.filter(c => c.is_active).length,
    validTokens,
    expiringSoon,
    issues
  };
}
