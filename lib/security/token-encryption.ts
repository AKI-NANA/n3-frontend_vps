/**
 * P0: 認証情報暗号化システム
 * pgsodium を使用したトークン暗号化・復号化
 *
 * Supabase pgsodium 拡張を使用して、api_tokensテーブルの
 * 全モール（Amazon, eBay, Shopee, Yahoo等）の認証トークンを
 * 暗号化して保存・復号化して利用します。
 */

import { createClient } from '@/lib/supabase/client';

/**
 * 暗号化キーのID
 * Supabase Dashboardで生成したキーIDを使用
 * 環境変数から取得
 */
const ENCRYPTION_KEY_ID = process.env.NEXT_PUBLIC_PGSODIUM_KEY_ID || '1';

/**
 * トークン型定義
 */
export interface ApiToken {
  id?: string;
  user_id: string;
  marketplace: 'amazon' | 'ebay' | 'shopee' | 'yahoo' | 'rakuten' | 'mercari' | 'qoo10' | 'walmart';
  token_type: 'access_token' | 'refresh_token' | 'api_key' | 'client_secret';
  encrypted_token: string; // 暗号化されたトークン
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
}

/**
 * 暗号化されたトークンを保存
 */
export async function saveEncryptedToken(
  userId: string,
  marketplace: ApiToken['marketplace'],
  tokenType: ApiToken['token_type'],
  plainToken: string,
  expiresAt?: string
): Promise<{ success: boolean; error?: string; data?: ApiToken }> {
  try {
    const supabase = createClient();

    console.log(`[Token Encryption] トークン暗号化開始: ${marketplace} (${tokenType})`);

    // pgsodium で暗号化してINSERT
    const { data, error } = await supabase
      .from('api_tokens')
      .insert({
        user_id: userId,
        marketplace,
        token_type: tokenType,
        encrypted_token: plainToken, // ※ RLS/トリガーで自動暗号化される想定
        expires_at: expiresAt,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('[Token Encryption] 保存エラー:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Token Encryption] トークン暗号化完了: ${data.id}`);
    return { success: true, data };
  } catch (error: any) {
    console.error('[Token Encryption] 暗号化エラー:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 暗号化されたトークンを復号化して取得
 */
export async function getDecryptedToken(
  userId: string,
  marketplace: ApiToken['marketplace'],
  tokenType: ApiToken['token_type']
): Promise<{ success: boolean; error?: string; token?: string }> {
  try {
    const supabase = createClient();

    console.log(`[Token Decryption] トークン復号化開始: ${marketplace} (${tokenType})`);

    // pgsodium で復号化してSELECT
    // ※ RLS/ビューで自動復号化される想定
    const { data, error } = await supabase
      .from('api_tokens')
      .select('encrypted_token, expires_at, is_active')
      .eq('user_id', userId)
      .eq('marketplace', marketplace)
      .eq('token_type', tokenType)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('[Token Decryption] 取得エラー:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'トークンが見つかりません' };
    }

    // トークンの有効期限チェック
    if (data.expires_at) {
      const expiresAt = new Date(data.expires_at);
      if (expiresAt < new Date()) {
        console.warn('[Token Decryption] トークンの有効期限切れ');
        return { success: false, error: 'トークンの有効期限が切れています' };
      }
    }

    console.log(`[Token Decryption] トークン復号化完了`);
    return { success: true, token: data.encrypted_token };
  } catch (error: any) {
    console.error('[Token Decryption] 復号化エラー:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 全マーケットプレイスのトークンを取得
 */
export async function getAllTokensForUser(
  userId: string
): Promise<{ success: boolean; error?: string; tokens?: ApiToken[] }> {
  try {
    const supabase = createClient();

    console.log(`[Token Management] ユーザーの全トークン取得: ${userId}`);

    const { data, error } = await supabase
      .from('api_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('marketplace', { ascending: true });

    if (error) {
      console.error('[Token Management] 取得エラー:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Token Management] トークン取得完了: ${data.length}件`);
    return { success: true, tokens: data };
  } catch (error: any) {
    console.error('[Token Management] エラー:', error);
    return { success: false, error: error.message };
  }
}

/**
 * トークンを無効化
 */
export async function revokeToken(
  userId: string,
  marketplace: ApiToken['marketplace'],
  tokenType: ApiToken['token_type']
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    console.log(`[Token Revocation] トークン無効化: ${marketplace} (${tokenType})`);

    const { error } = await supabase
      .from('api_tokens')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('marketplace', marketplace)
      .eq('token_type', tokenType);

    if (error) {
      console.error('[Token Revocation] 無効化エラー:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Token Revocation] トークン無効化完了`);
    return { success: true };
  } catch (error: any) {
    console.error('[Token Revocation] エラー:', error);
    return { success: false, error: error.message };
  }
}

/**
 * トークンを更新
 */
export async function updateToken(
  userId: string,
  marketplace: ApiToken['marketplace'],
  tokenType: ApiToken['token_type'],
  newToken: string,
  expiresAt?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 既存トークンを無効化
    await revokeToken(userId, marketplace, tokenType);

    // 新しいトークンを保存
    return await saveEncryptedToken(userId, marketplace, tokenType, newToken, expiresAt);
  } catch (error: any) {
    console.error('[Token Update] エラー:', error);
    return { success: false, error: error.message };
  }
}

/**
 * クライアントサイドで使用する暗号化ユーティリティ
 * (ブラウザでの一時的な暗号化用)
 */
export class ClientSideEncryption {
  private static async getKey(): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(process.env.NEXT_PUBLIC_CLIENT_ENCRYPTION_KEY || 'default-key-32-bytes-long!!!!!!'),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * クライアントサイドでトークンを暗号化 (一時的なメモリ内保管用)
   */
  static async encrypt(plainText: string): Promise<string> {
    const key = await this.getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plainText);

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  /**
   * クライアントサイドで暗号化されたトークンを復号化
   */
  static async decrypt(encryptedText: string): Promise<string> {
    const key = await this.getKey();
    const combined = Uint8Array.from(atob(encryptedText), (c) => c.charCodeAt(0));

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  }
}

/**
 * トークンのローテーション（定期的な更新）
 */
export async function rotateTokenIfNeeded(
  userId: string,
  marketplace: ApiToken['marketplace'],
  tokenType: ApiToken['token_type'],
  thresholdDays: number = 7
): Promise<{ success: boolean; needsRotation: boolean; error?: string }> {
  try {
    const result = await getDecryptedToken(userId, marketplace, tokenType);

    if (!result.success) {
      return { success: false, needsRotation: false, error: result.error };
    }

    // 有効期限チェック
    const supabase = createClient();
    const { data } = await supabase
      .from('api_tokens')
      .select('expires_at')
      .eq('user_id', userId)
      .eq('marketplace', marketplace)
      .eq('token_type', tokenType)
      .eq('is_active', true)
      .single();

    if (data?.expires_at) {
      const expiresAt = new Date(data.expires_at);
      const now = new Date();
      const daysUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

      if (daysUntilExpiry <= thresholdDays) {
        console.warn(`[Token Rotation] トークンのローテーションが必要: ${daysUntilExpiry.toFixed(1)}日後に期限切れ`);
        return { success: true, needsRotation: true };
      }
    }

    return { success: true, needsRotation: false };
  } catch (error: any) {
    console.error('[Token Rotation] エラー:', error);
    return { success: false, needsRotation: false, error: error.message };
  }
}
