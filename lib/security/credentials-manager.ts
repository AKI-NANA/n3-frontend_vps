// =====================================================
// P0: 認証情報管理ライブラリ（TypeScript）
// =====================================================
// 目的: pgsodiumで暗号化された認証情報の安全な管理
// セキュリティレベル: Critical (P0)

import { supabase } from '@/lib/supabase/client';

export type ServiceName =
  | 'amazon_sp_api'
  | 'rakuten_api'
  | 'ebay_api'
  | 'yahoo_api'
  | 'mercari_api'
  | 'mf_cloud'
  | 'vps_ssh'
  | 'other';

export type CredentialType =
  | 'access_token'
  | 'refresh_token'
  | 'api_key'
  | 'api_secret'
  | 'client_id'
  | 'client_secret'
  | 'ssh_private_key'
  | 'password'
  | 'other';

export interface EncryptedCredential {
  id: string;
  user_id: string;
  service_name: ServiceName;
  credential_type: CredentialType;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// 暗号化・保存
// =====================================================

/**
 * 認証情報を暗号化して保存
 * @param userId ユーザーID
 * @param serviceName サービス名
 * @param credentialType 認証情報の種類
 * @param plainValue 暗号化する値（平文）
 * @param expiresAt 有効期限（オプション）
 * @returns 保存された認証情報のID
 */
export async function encryptAndStoreCredential(
  userId: string,
  serviceName: ServiceName,
  credentialType: CredentialType,
  plainValue: string,
  expiresAt?: Date
): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('encrypt_credential', {
      p_user_id: userId,
      p_service_name: serviceName,
      p_credential_type: credentialType,
      p_plain_value: plainValue,
      p_expires_at: expiresAt?.toISOString() || null,
    });

    if (error) {
      console.error('[P0] 認証情報の暗号化エラー:', error);
      throw error;
    }

    console.log(`[P0] ${serviceName}/${credentialType} を暗号化して保存しました`);
    return data;
  } catch (error) {
    console.error('[P0] 認証情報の暗号化・保存に失敗:', error);
    return null;
  }
}

// =====================================================
// 復号化・取得
// =====================================================

/**
 * 暗号化された認証情報を復号化して取得
 * @param userId ユーザーID
 * @param serviceName サービス名
 * @param credentialType 認証情報の種類
 * @returns 復号化された値（平文）
 */
export async function decryptCredential(
  userId: string,
  serviceName: ServiceName,
  credentialType: CredentialType
): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('decrypt_credential', {
      p_user_id: userId,
      p_service_name: serviceName,
      p_credential_type: credentialType,
    });

    if (error) {
      console.error('[P0] 認証情報の復号化エラー:', error);
      throw error;
    }

    if (!data) {
      console.warn(`[P0] ${serviceName}/${credentialType} が見つかりません`);
      return null;
    }

    console.log(`[P0] ${serviceName}/${credentialType} を復号化しました`);
    return data;
  } catch (error) {
    console.error('[P0] 認証情報の復号化に失敗:', error);
    return null;
  }
}

// =====================================================
// 一覧取得
// =====================================================

/**
 * ユーザーの暗号化された認証情報一覧を取得（値は含まない）
 * @param userId ユーザーID
 * @returns 認証情報のメタデータ一覧
 */
export async function listEncryptedCredentials(
  userId: string
): Promise<EncryptedCredential[]> {
  try {
    const { data, error } = await supabase
      .from('encrypted_credentials')
      .select('id, user_id, service_name, credential_type, expires_at, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[P0] 認証情報一覧の取得エラー:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('[P0] 認証情報一覧の取得に失敗:', error);
    return [];
  }
}

// =====================================================
// 削除
// =====================================================

/**
 * 暗号化された認証情報を削除
 * @param userId ユーザーID
 * @param serviceName サービス名
 * @param credentialType 認証情報の種類
 * @returns 削除成功/失敗
 */
export async function deleteCredential(
  userId: string,
  serviceName: ServiceName,
  credentialType: CredentialType
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('encrypted_credentials')
      .delete()
      .eq('user_id', userId)
      .eq('service_name', serviceName)
      .eq('credential_type', credentialType);

    if (error) {
      console.error('[P0] 認証情報の削除エラー:', error);
      throw error;
    }

    console.log(`[P0] ${serviceName}/${credentialType} を削除しました`);
    return true;
  } catch (error) {
    console.error('[P0] 認証情報の削除に失敗:', error);
    return false;
  }
}

// =====================================================
// 有効期限チェック
// =====================================================

/**
 * 認証情報が有効期限内かチェック
 * @param userId ユーザーID
 * @param serviceName サービス名
 * @param credentialType 認証情報の種類
 * @returns 有効期限内ならtrue
 */
export async function isCredentialValid(
  userId: string,
  serviceName: ServiceName,
  credentialType: CredentialType
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('encrypted_credentials')
      .select('expires_at')
      .eq('user_id', userId)
      .eq('service_name', serviceName)
      .eq('credential_type', credentialType)
      .single();

    if (error || !data) {
      return false;
    }

    if (!data.expires_at) {
      return true; // 有効期限なし = 永続的に有効
    }

    return new Date(data.expires_at) > new Date();
  } catch (error) {
    console.error('[P0] 有効期限チェック失敗:', error);
    return false;
  }
}

// =====================================================
// クリーンアップ
// =====================================================

/**
 * 有効期限切れの認証情報を削除
 * @returns 削除された件数
 */
export async function cleanupExpiredCredentials(): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('cleanup_expired_credentials');

    if (error) {
      console.error('[P0] 有効期限切れ認証情報のクリーンアップエラー:', error);
      throw error;
    }

    console.log(`[P0] 有効期限切れの認証情報を ${data} 件削除しました`);
    return data || 0;
  } catch (error) {
    console.error('[P0] クリーンアップ失敗:', error);
    return 0;
  }
}

// =====================================================
// 使用例
// =====================================================

/*
// Amazon SP-APIトークンの暗号化・保存
await encryptAndStoreCredential(
  userId,
  'amazon_sp_api',
  'access_token',
  'Atza|IwEBIJK5...',
  new Date(Date.now() + 3600000) // 1時間後に期限切れ
);

// 楽天APIキーの暗号化・保存
await encryptAndStoreCredential(
  userId,
  'rakuten_api',
  'api_key',
  '1234567890abcdef',
  undefined // 有効期限なし
);

// Amazon SP-APIトークンの復号化・取得
const amazonToken = await decryptCredential(userId, 'amazon_sp_api', 'access_token');

// 認証情報一覧の取得
const credentials = await listEncryptedCredentials(userId);

// 有効期限チェック
const isValid = await isCredentialValid(userId, 'amazon_sp_api', 'access_token');

// 削除
await deleteCredential(userId, 'amazon_sp_api', 'access_token');

// 定期的なクリーンアップ（Cron推奨）
await cleanupExpiredCredentials();
*/
