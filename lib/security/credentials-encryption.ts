/**
 * B.1: P0 認証情報暗号化
 * pgsodiumを使用した認証情報の安全な暗号化・復号化
 */

import { createClient } from "@/lib/supabase";

// ============================================================================
// 型定義
// ============================================================================

export interface EncryptedCredentials {
  id: string;
  marketplace: string;
  credentials_encrypted: string; // 暗号化された認証情報
  created_at: Date;
  updated_at: Date;
}

export interface DecryptedCredentials {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
  [key: string]: unknown;
}

// ============================================================================
// 認証情報暗号化サービス
// ============================================================================

export class CredentialsEncryptionService {
  private supabase = createClient();

  /**
   * 認証情報を暗号化して保存
   *
   * @param marketplace - マーケットプレイスID
   * @param credentials - 暗号化する認証情報
   * @returns 保存されたレコードID
   */
  async encryptAndStore(
    marketplace: string,
    credentials: DecryptedCredentials
  ): Promise<string> {
    try {
      console.log(`🔒 [CredentialsEncryption] Encrypting credentials for ${marketplace}...`);

      // Supabase pgsodium拡張を使用して暗号化
      // pgsodium.crypto_aead_det_encrypt() 関数を使用

      const { data, error } = await this.supabase.rpc("encrypt_credentials", {
        p_marketplace: marketplace,
        p_credentials: JSON.stringify(credentials),
      });

      if (error) {
        throw new Error(`Failed to encrypt credentials: ${error.message}`);
      }

      console.log(`   ✅ Credentials encrypted and stored for ${marketplace}`);

      return data.id;
    } catch (error) {
      console.error("❌ [CredentialsEncryption] Encryption failed:", error);
      throw error;
    }
  }

  /**
   * 暗号化された認証情報を復号化
   *
   * @param marketplace - マーケットプレイスID
   * @returns 復号化された認証情報
   */
  async decryptAndRetrieve(
    marketplace: string
  ): Promise<DecryptedCredentials | null> {
    try {
      console.log(`🔓 [CredentialsEncryption] Decrypting credentials for ${marketplace}...`);

      // Supabase pgsodium拡張を使用して復号化
      // pgsodium.crypto_aead_det_decrypt() 関数を使用

      const { data, error } = await this.supabase.rpc("decrypt_credentials", {
        p_marketplace: marketplace,
      });

      if (error) {
        throw new Error(`Failed to decrypt credentials: ${error.message}`);
      }

      if (!data) {
        console.log(`   ⚠️ No credentials found for ${marketplace}`);
        return null;
      }

      const credentials = JSON.parse(data.credentials);

      console.log(`   ✅ Credentials decrypted for ${marketplace}`);

      return credentials;
    } catch (error) {
      console.error("❌ [CredentialsEncryption] Decryption failed:", error);
      throw error;
    }
  }

  /**
   * 認証情報を更新
   *
   * @param marketplace - マーケットプレイスID
   * @param credentials - 新しい認証情報
   */
  async updateCredentials(
    marketplace: string,
    credentials: DecryptedCredentials
  ): Promise<void> {
    try {
      console.log(`🔄 [CredentialsEncryption] Updating credentials for ${marketplace}...`);

      const { error } = await this.supabase.rpc("update_credentials", {
        p_marketplace: marketplace,
        p_credentials: JSON.stringify(credentials),
      });

      if (error) {
        throw new Error(`Failed to update credentials: ${error.message}`);
      }

      console.log(`   ✅ Credentials updated for ${marketplace}`);
    } catch (error) {
      console.error("❌ [CredentialsEncryption] Update failed:", error);
      throw error;
    }
  }

  /**
   * 認証情報を削除
   *
   * @param marketplace - マーケットプレイスID
   */
  async deleteCredentials(marketplace: string): Promise<void> {
    try {
      console.log(`🗑️ [CredentialsEncryption] Deleting credentials for ${marketplace}...`);

      const { error } = await this.supabase.rpc("delete_credentials", {
        p_marketplace: marketplace,
      });

      if (error) {
        throw new Error(`Failed to delete credentials: ${error.message}`);
      }

      console.log(`   ✅ Credentials deleted for ${marketplace}`);
    } catch (error) {
      console.error("❌ [CredentialsEncryption] Deletion failed:", error);
      throw error;
    }
  }
}

// ============================================================================
// Supabase Functions (SQL)
// ============================================================================

/**
 * 以下のSQL関数をSupabaseのSQL Editorで実行してください:
 *
 * -- 1. 暗号化されたテーブルを作成
 * CREATE TABLE IF NOT EXISTS encrypted_credentials (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID REFERENCES auth.users(id) NOT NULL,
 *   marketplace TEXT NOT NULL,
 *   credentials_encrypted BYTEA NOT NULL,
 *   nonce BYTEA NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW(),
 *   UNIQUE(user_id, marketplace)
 * );
 *
 * -- 2. RLSポリシーを有効化
 * ALTER TABLE encrypted_credentials ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Users can manage their own credentials"
 *   ON encrypted_credentials
 *   FOR ALL
 *   USING (auth.uid() = user_id)
 *   WITH CHECK (auth.uid() = user_id);
 *
 * -- 3. 暗号化関数
 * CREATE OR REPLACE FUNCTION encrypt_credentials(
 *   p_marketplace TEXT,
 *   p_credentials TEXT
 * )
 * RETURNS UUID
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * DECLARE
 *   v_user_id UUID;
 *   v_id UUID;
 *   v_nonce BYTEA;
 *   v_encrypted BYTEA;
 * BEGIN
 *   v_user_id := auth.uid();
 *
 *   IF v_user_id IS NULL THEN
 *     RAISE EXCEPTION 'Not authenticated';
 *   END IF;
 *
 *   -- Nonceを生成
 *   v_nonce := pgsodium.crypto_aead_det_noncegen();
 *
 *   -- 暗号化
 *   v_encrypted := pgsodium.crypto_aead_det_encrypt(
 *     p_credentials::bytea,
 *     NULL,
 *     current_setting('app.encryption_key')::bytea,
 *     v_nonce
 *   );
 *
 *   -- 既存レコードを削除
 *   DELETE FROM encrypted_credentials
 *   WHERE user_id = v_user_id AND marketplace = p_marketplace;
 *
 *   -- 新しいレコードを挿入
 *   INSERT INTO encrypted_credentials (user_id, marketplace, credentials_encrypted, nonce)
 *   VALUES (v_user_id, p_marketplace, v_encrypted, v_nonce)
 *   RETURNING id INTO v_id;
 *
 *   RETURN v_id;
 * END;
 * $$;
 *
 * -- 4. 復号化関数
 * CREATE OR REPLACE FUNCTION decrypt_credentials(
 *   p_marketplace TEXT
 * )
 * RETURNS TABLE(credentials TEXT)
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * DECLARE
 *   v_user_id UUID;
 *   v_record RECORD;
 *   v_decrypted BYTEA;
 * BEGIN
 *   v_user_id := auth.uid();
 *
 *   IF v_user_id IS NULL THEN
 *     RAISE EXCEPTION 'Not authenticated';
 *   END IF;
 *
 *   SELECT * INTO v_record
 *   FROM encrypted_credentials
 *   WHERE user_id = v_user_id AND marketplace = p_marketplace;
 *
 *   IF NOT FOUND THEN
 *     RETURN;
 *   END IF;
 *
 *   -- 復号化
 *   v_decrypted := pgsodium.crypto_aead_det_decrypt(
 *     v_record.credentials_encrypted,
 *     NULL,
 *     current_setting('app.encryption_key')::bytea,
 *     v_record.nonce
 *   );
 *
 *   RETURN QUERY SELECT convert_from(v_decrypted, 'UTF8');
 * END;
 * $$;
 *
 * -- 5. 更新関数
 * CREATE OR REPLACE FUNCTION update_credentials(
 *   p_marketplace TEXT,
 *   p_credentials TEXT
 * )
 * RETURNS VOID
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * BEGIN
 *   PERFORM encrypt_credentials(p_marketplace, p_credentials);
 * END;
 * $$;
 *
 * -- 6. 削除関数
 * CREATE OR REPLACE FUNCTION delete_credentials(
 *   p_marketplace TEXT
 * )
 * RETURNS VOID
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * DECLARE
 *   v_user_id UUID;
 * BEGIN
 *   v_user_id := auth.uid();
 *
 *   IF v_user_id IS NULL THEN
 *     RAISE EXCEPTION 'Not authenticated';
 *   END IF;
 *
 *   DELETE FROM encrypted_credentials
 *   WHERE user_id = v_user_id AND marketplace = p_marketplace;
 * END;
 * $$;
 */

// ============================================================================
// エクスポート: シングルトンインスタンス
// ============================================================================

let credentialsEncryptionServiceInstance: CredentialsEncryptionService | null = null;

/**
 * CredentialsEncryptionServiceのシングルトンインスタンスを取得
 */
export function getCredentialsEncryptionService(): CredentialsEncryptionService {
  if (!credentialsEncryptionServiceInstance) {
    credentialsEncryptionServiceInstance = new CredentialsEncryptionService();
  }
  return credentialsEncryptionServiceInstance;
}
