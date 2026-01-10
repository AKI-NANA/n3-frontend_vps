/**
 * 暗号化ヘルパー
 * ✅ P0: 認証情報暗号化システム
 *
 * 機能:
 * - Supabase pgsodiumを使用した暗号化・復号化
 * - APIキーの安全な保存・取得
 * - 認証情報の暗号化管理
 */

import { createClient } from '@/lib/supabase/server';

/**
 * APIキーを暗号化して保存
 */
export async function saveEncryptedAPIKey(
  keyName: string,
  keyValue: string,
  keyType: 'gemini' | 'amazon' | 'ebay' | 'shopee' | 'mercari' | 'rakuten' | 'other',
  accountId?: string
): Promise<{ success: boolean; keyId?: string; error?: string }> {
  try {
    const supabase = await createClient();

    // Supabase RPC: save_encrypted_api_key
    const { data, error } = await supabase.rpc('save_encrypted_api_key', {
      p_key_name: keyName,
      p_key_value: keyValue,
      p_key_type: keyType,
      p_account_id: accountId || null,
    });

    if (error) {
      throw new Error(`Failed to save API key: ${error.message}`);
    }

    console.log(`[Encryption] APIキー保存成功: ${keyName}`);

    return {
      success: true,
      keyId: data,
    };
  } catch (error: any) {
    console.error('[Encryption] APIキー保存エラー:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 暗号化されたAPIキーを取得・復号化
 */
export async function getDecryptedAPIKey(keyName: string): Promise<string | null> {
  try {
    const supabase = await createClient();

    // Supabase RPC: get_decrypted_api_key
    const { data, error } = await supabase.rpc('get_decrypted_api_key', {
      p_key_name: keyName,
    });

    if (error) {
      throw new Error(`Failed to get API key: ${error.message}`);
    }

    return data as string;
  } catch (error: any) {
    console.error(`[Encryption] APIキー取得エラー (${keyName}):`, error);
    return null;
  }
}

/**
 * 認証情報を暗号化して保存
 */
export async function saveEncryptedCredentials(params: {
  marketplace: string;
  accountId: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  accessToken?: string;
  tokenExpiresAt?: number;
  scope?: string;
}): Promise<{ success: boolean; credentialId?: string; error?: string }> {
  try {
    const supabase = await createClient();

    // まずデフォルト暗号化キーIDを取得
    const { data: keyData, error: keyError } = await supabase
      .from('encryption_keys')
      .select('id')
      .eq('key_name', 'default_encryption_key')
      .single();

    if (keyError || !keyData) {
      throw new Error('Encryption key not found');
    }

    // クレデンシャルを暗号化して保存
    // 注: 実際の暗号化はPostgreSQL側のencrypt_credential()関数が行う
    const { data, error } = await supabase.rpc('encrypt_credential', {
      plaintext: params.clientSecret,
    });

    if (error) {
      throw new Error(`Failed to encrypt credentials: ${error.message}`);
    }

    // marketplace_credentialsに保存
    const { data: credentialData, error: insertError } = await supabase
      .from('marketplace_credentials')
      .upsert({
        marketplace: params.marketplace,
        account_id: params.accountId,
        client_id: params.clientId,
        client_secret_encrypted: data, // 暗号化されたデータ
        refresh_token_encrypted: await encryptValue(params.refreshToken),
        access_token_encrypted: params.accessToken
          ? await encryptValue(params.accessToken)
          : null,
        token_expires_at: params.tokenExpiresAt,
        scope: params.scope,
        encryption_key_id: keyData.id,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'marketplace,account_id',
      })
      .select('id')
      .single();

    if (insertError) {
      throw new Error(`Failed to save credentials: ${insertError.message}`);
    }

    console.log(`[Encryption] 認証情報保存成功: ${params.marketplace}/${params.accountId}`);

    return {
      success: true,
      credentialId: credentialData?.id,
    };
  } catch (error: any) {
    console.error('[Encryption] 認証情報保存エラー:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 暗号化された認証情報を取得・復号化
 */
export async function getDecryptedCredentials(
  marketplace: string,
  accountId: string
): Promise<{
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  accessToken?: string;
  tokenExpiresAt?: number;
  scope?: string;
} | null> {
  try {
    const supabase = await createClient();

    // 復号化ビューから取得
    const { data, error } = await supabase
      .from('marketplace_credentials_decrypted')
      .select('*')
      .eq('marketplace', marketplace)
      .eq('account_id', accountId)
      .single();

    if (error || !data) {
      console.warn(`[Encryption] 認証情報が見つかりません: ${marketplace}/${accountId}`);
      return null;
    }

    return {
      clientId: data.client_id,
      clientSecret: data.client_secret,
      refreshToken: data.refresh_token,
      accessToken: data.access_token,
      tokenExpiresAt: data.token_expires_at,
      scope: data.scope,
    };
  } catch (error: any) {
    console.error('[Encryption] 認証情報取得エラー:', error);
    return null;
  }
}

/**
 * 値を暗号化（内部ヘルパー）
 */
async function encryptValue(plaintext: string): Promise<any> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('encrypt_credential', {
    plaintext,
  });

  if (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }

  return data;
}

/**
 * 環境変数からAPIキーを暗号化して移行
 */
export async function migrateAPIKeysFromEnv(): Promise<{
  success: boolean;
  migrated: string[];
  errors: string[];
}> {
  const migrated: string[] = [];
  const errors: string[] = [];

  const keysToMigrate = [
    { name: 'gemini_api_key', envVar: process.env.GEMINI_API_KEY, type: 'gemini' as const },
    { name: 'amazon_access_key', envVar: process.env.AMAZON_ACCESS_KEY, type: 'amazon' as const },
    { name: 'amazon_secret_key', envVar: process.env.AMAZON_SECRET_KEY, type: 'amazon' as const },
    { name: 'ebay_auth_token', envVar: process.env.EBAY_AUTH_TOKEN, type: 'ebay' as const },
    { name: 'shopee_partner_key', envVar: process.env.SHOPEE_PARTNER_KEY, type: 'shopee' as const },
  ];

  for (const key of keysToMigrate) {
    if (key.envVar) {
      const result = await saveEncryptedAPIKey(key.name, key.envVar, key.type);
      if (result.success) {
        migrated.push(key.name);
      } else {
        errors.push(`${key.name}: ${result.error}`);
      }
    }
  }

  console.log(`[Encryption Migration] 完了: ${migrated.length}件成功, ${errors.length}件エラー`);

  return {
    success: errors.length === 0,
    migrated,
    errors,
  };
}

/**
 * Gemini APIキーを安全に取得
 */
export async function getGeminiAPIKey(): Promise<string> {
  // まず暗号化されたキーを試す
  const encryptedKey = await getDecryptedAPIKey('gemini_api_key');
  if (encryptedKey) {
    return encryptedKey;
  }

  // フォールバック: 環境変数
  if (process.env.GEMINI_API_KEY) {
    console.warn('[Security] Gemini APIキーが暗号化されていません。migrateAPIKeysFromEnv()を実行してください。');
    return process.env.GEMINI_API_KEY;
  }

  throw new Error('Gemini API key not found');
}

/**
 * Amazon APIキーを安全に取得
 */
export async function getAmazonAPIKeys(): Promise<{
  accessKey: string;
  secretKey: string;
}> {
  const accessKey = await getDecryptedAPIKey('amazon_access_key');
  const secretKey = await getDecryptedAPIKey('amazon_secret_key');

  if (accessKey && secretKey) {
    return { accessKey, secretKey };
  }

  // フォールバック: 環境変数
  if (process.env.AMAZON_ACCESS_KEY && process.env.AMAZON_SECRET_KEY) {
    console.warn('[Security] Amazon APIキーが暗号化されていません。');
    return {
      accessKey: process.env.AMAZON_ACCESS_KEY,
      secretKey: process.env.AMAZON_SECRET_KEY,
    };
  }

  throw new Error('Amazon API keys not found');
}
