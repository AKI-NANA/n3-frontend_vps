// lib/shared/security.ts
/**
 * N3 Empire OS - 27次元セキュリティ商用規格
 * Envelope Encryption (二重鍵暗号化) + fetchSecret
 * 
 * 【帝国の鍵束】階層構造:
 *   第1階層（環境変数）: SUPABASE_SERVICE_ROLE_KEY のみ許可（金庫の物理キー）
 *   第2階層（DB）: その他全ての機密情報は system_secrets テーブルに格納
 * 
 * 【DBスキーマ】
 *   system_secrets.key_name: シークレット名
 *   system_secrets.encrypted_value: JSONB形式の暗号化データ
 *   system_secrets.encrypted_data_key: JSONB形式のデータキー
 * 
 * アルゴリズム: AES-256-GCM
 */

import crypto from "crypto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ============================================================
// 定数
// ============================================================

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits
const KEY_LENGTH = 32; // 256 bits

// シークレットキャッシュ（メモリ内、プロセス終了で消去）
const secretCache = new Map<string, { value: string; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5分

// ============================================================
// Supabase クライアント（ブートストラップ用）
// ============================================================

let supabaseAdmin: SupabaseClient | null = null;

/**
 * ブートストラップ用Supabaseクライアント取得
 * 注意: これが唯一の環境変数直接参照許可箇所
 */
function getBootstrapSupabase(): SupabaseClient {
  if (supabaseAdmin) return supabaseAdmin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // 第1階層: 唯一許可された環境変数直接参照
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "[Security] Bootstrap credentials not configured. " +
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
    );
  }

  supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdmin;
}

// ============================================================
// マスターキー取得（サーバーサイドのみ）
// ============================================================

function getMasterKey(): Buffer {
  const masterKeyHex = process.env.MASTER_KEY;
  
  if (!masterKeyHex) {
    throw new Error(
      "[Security] MASTER_KEY is not set in environment variables. " +
      "Please set a 64-character hex string (256 bits)."
    );
  }
  
  // 開発用のデフォルトキーを検出
  if (masterKeyHex === "dev-key-change-in-production") {
    console.warn(
      "[Security] WARNING: Using default development key. " +
      "Set a secure MASTER_KEY in production!"
    );
    return crypto.scryptSync("dev-key-change-in-production", "n3-salt", KEY_LENGTH);
  }
  
  // 64文字のHEX文字列を期待
  if (masterKeyHex.length !== 64) {
    return crypto.scryptSync(masterKeyHex, "n3-empire-salt", KEY_LENGTH);
  }
  
  return Buffer.from(masterKeyHex, "hex");
}

// ============================================================
// 暗号化関数
// ============================================================

/**
 * データを暗号化する
 * 
 * @param plaintext 平文データ
 * @returns Base64エンコードされた暗号文（IV + AuthTag + CipherText）
 */
export function encryptSecret(plaintext: string): string {
  if (!plaintext) {
    throw new Error("[Security] Cannot encrypt empty data");
  }
  
  const masterKey = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  
  const authTag = cipher.getAuthTag();
  const combined = Buffer.concat([iv, authTag, encrypted]);
  
  return combined.toString("base64");
}

/**
 * 暗号文を復号する
 * 
 * @param encryptedPayload Base64エンコードされた暗号文
 * @returns 復号された平文
 */
export function decryptSecret(encryptedPayload: string): string {
  if (!encryptedPayload) {
    throw new Error("[Security] Cannot decrypt empty payload");
  }
  
  const masterKey = getMasterKey();
  const combined = Buffer.from(encryptedPayload, "base64");
  
  const minSize = IV_LENGTH + AUTH_TAG_LENGTH + 1;
  if (combined.length < minSize) {
    throw new Error("[Security] Invalid encrypted payload: too short");
  }
  
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const cipherText = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);
  
  try {
    const decrypted = Buffer.concat([
      decipher.update(cipherText),
      decipher.final(),
    ]);
    
    return decrypted.toString("utf8");
  } catch {
    throw new Error(
      "[Security] Decryption failed: invalid key or tampered data"
    );
  }
}

// ============================================================
// fetchSecret - 二重封印の核心
// 【DBスキーマ対応】key_name, encrypted_value (JSONB)
// ============================================================

/**
 * system_secrets テーブルから機密情報を取得し復号する
 * 
 * DBスキーマ:
 *   - key_name: シークレット名
 *   - encrypted_value: JSONB { ciphertext: string, iv: string, tag: string }
 * 
 * @param keyName シークレット名（例: "EBAY_API_TOKEN", "ANTHROPIC_API_KEY"）
 * @returns 復号された平文値
 */
export async function fetchSecret(keyName: string): Promise<string> {
  if (!keyName) {
    throw new Error("[Security] Key name is required");
  }

  // キャッシュチェック
  const cached = secretCache.get(keyName);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const supabase = getBootstrapSupabase();
  
  const { data, error } = await supabase
    .from("system_secrets")
    .select("encrypted_value, expires_at")
    .eq("key_name", keyName)
    .single();

  if (error) {
    throw new Error(`[Security] Failed to fetch secret "${keyName}": ${error.message}`);
  }

  if (!data) {
    throw new Error(`[Security] Secret "${keyName}" not found in system_secrets`);
  }

  // 有効期限チェック
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    throw new Error(`[Security] Secret "${keyName}" has expired`);
  }

  // encrypted_value の形式に応じて復号
  let decrypted: string;
  
  if (typeof data.encrypted_value === 'string') {
    // 単純なBase64文字列の場合
    decrypted = decryptSecret(data.encrypted_value);
  } else if (data.encrypted_value && typeof data.encrypted_value === 'object') {
    // JSONB形式 { ciphertext, iv, tag } の場合
    const ev = data.encrypted_value as { ciphertext?: string; iv?: string; tag?: string; value?: string };
    
    if (ev.ciphertext && ev.iv && ev.tag) {
      // 構造化された暗号データ
      const combined = Buffer.concat([
        Buffer.from(ev.iv, 'base64'),
        Buffer.from(ev.tag, 'base64'),
        Buffer.from(ev.ciphertext, 'base64'),
      ]);
      decrypted = decryptSecret(combined.toString('base64'));
    } else if (ev.value) {
      // { value: "base64string" } 形式
      decrypted = decryptSecret(ev.value);
    } else {
      throw new Error(`[Security] Unknown encrypted_value format for "${keyName}"`);
    }
  } else {
    throw new Error(`[Security] Invalid encrypted_value for "${keyName}"`);
  }

  // キャッシュに保存
  secretCache.set(keyName, {
    value: decrypted,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  return decrypted;
}

/**
 * 安全な fetchSecret（エラー時は null）
 */
export async function safeFetchSecret(keyName: string): Promise<string | null> {
  try {
    return await fetchSecret(keyName);
  } catch (error) {
    console.error(`[Security] safeFetchSecret failed for "${keyName}":`, error);
    return null;
  }
}

/**
 * キャッシュをクリア
 */
export function clearSecretCache(): void {
  secretCache.clear();
}

/**
 * 特定のシークレットのキャッシュを無効化
 */
export function invalidateSecretCache(keyName: string): void {
  secretCache.delete(keyName);
}

// ============================================================
// シークレット保存用（Governance UI から呼び出し）
// ============================================================

/**
 * 暗号化してJSONB形式で返す（DB保存用）
 */
export function encryptForStorage(plaintext: string): { ciphertext: string; iv: string; tag: string } {
  if (!plaintext) {
    throw new Error("[Security] Cannot encrypt empty data");
  }
  
  const masterKey = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  
  const authTag = cipher.getAuthTag();
  
  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    tag: authTag.toString('base64'),
  };
}

// ============================================================
// ユーティリティ関数
// ============================================================

export function safeEncrypt(plaintext: string): string | null {
  try {
    return encryptSecret(plaintext);
  } catch (error) {
    console.error("[Security] Encryption failed:", error);
    return null;
  }
}

export function safeDecrypt(encryptedPayload: string): string | null {
  try {
    return decryptSecret(encryptedPayload);
  } catch (error) {
    console.error("[Security] Decryption failed:", error);
    return null;
  }
}

export function generateSecureKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString("hex");
}

export function hashString(data: string, salt?: string): string {
  const actualSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(data, actualSalt, 64).toString("hex");
  return `${actualSalt}:${hash}`;
}

export function verifyHash(data: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  
  const testHash = crypto.scryptSync(data, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(testHash));
}

// ============================================================
// 型定義
// ============================================================

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  tag: string;
}

export interface SecretEntry {
  id: string;
  key_name: string;
  service: string;
  encrypted_value: EncryptedData;
  encrypted_data_key?: EncryptedData;
  description?: string;
  expires_at?: string;
  created_at: string;
}
