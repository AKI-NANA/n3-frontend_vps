// lib/shared/security.ts
/**
 * N3 Empire OS - 27次元セキュリティ商用規格
 * Envelope Encryption (二重鍵暗号化) + fetchSecret
 * 
 * 【帝国の鍵束】階層構造:
 *   第1階層（環境変数）: SUPABASE_SERVICE_ROLE_KEY のみ許可（金庫の物理キー）
 *   第2階層（DB）: その他全ての機密情報は system_secrets テーブルに格納
 * 
 * アルゴリズム: AES-256-GCM
 */

import crypto from "crypto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

const secretCache = new Map<string, { value: string; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

let supabaseAdmin: SupabaseClient | null = null;

function getBootstrapSupabase(): SupabaseClient {
  if (supabaseAdmin) return supabaseAdmin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("[Security] Bootstrap credentials not configured.");
  }

  supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return supabaseAdmin;
}

function getMasterKey(): Buffer {
  const masterKeyHex = process.env.MASTER_KEY;
  
  if (!masterKeyHex) {
    throw new Error("[Security] MASTER_KEY is not set in environment variables.");
  }
  
  if (masterKeyHex === "dev-key-change-in-production") {
    return crypto.scryptSync("dev-key-change-in-production", "n3-salt", KEY_LENGTH);
  }
  
  if (masterKeyHex.length !== 64) {
    return crypto.scryptSync(masterKeyHex, "n3-empire-salt", KEY_LENGTH);
  }
  
  return Buffer.from(masterKeyHex, "hex");
}

export function encryptSecret(plaintext: string): string {
  if (!plaintext) throw new Error("[Security] Cannot encrypt empty data");
  
  const masterKey = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv, { authTagLength: AUTH_TAG_LENGTH });
  
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const combined = Buffer.concat([iv, authTag, encrypted]);
  
  return combined.toString("base64");
}

export function decryptSecret(encryptedPayload: string): string {
  if (!encryptedPayload) throw new Error("[Security] Cannot decrypt empty payload");
  
  const masterKey = getMasterKey();
  const combined = Buffer.from(encryptedPayload, "base64");
  
  const minSize = IV_LENGTH + AUTH_TAG_LENGTH + 1;
  if (combined.length < minSize) throw new Error("[Security] Invalid encrypted payload");
  
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const cipherText = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);
  
  const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);
  return decrypted.toString("utf8");
}

export async function fetchSecret(keyName: string): Promise<string> {
  if (!keyName) throw new Error("[Security] Key name is required");

  const cached = secretCache.get(keyName);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const supabase = getBootstrapSupabase();
  
  const { data, error } = await supabase
    .from("system_secrets")
    .select("encrypted_value, expires_at")
    .eq("key_name", keyName)
    .single();

  if (error) throw new Error(`[Security] Failed to fetch secret "${keyName}": ${error.message}`);
  if (!data) throw new Error(`[Security] Secret "${keyName}" not found`);
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    throw new Error(`[Security] Secret "${keyName}" has expired`);
  }

  let decrypted: string;
  
  if (typeof data.encrypted_value === 'string') {
    decrypted = decryptSecret(data.encrypted_value);
  } else if (data.encrypted_value && typeof data.encrypted_value === 'object') {
    const ev = data.encrypted_value as { ciphertext?: string; iv?: string; tag?: string; value?: string };
    
    if (ev.ciphertext && ev.iv && ev.tag) {
      const combined = Buffer.concat([
        Buffer.from(ev.iv, 'base64'),
        Buffer.from(ev.tag, 'base64'),
        Buffer.from(ev.ciphertext, 'base64'),
      ]);
      decrypted = decryptSecret(combined.toString('base64'));
    } else if (ev.value) {
      decrypted = decryptSecret(ev.value);
    } else {
      throw new Error(`[Security] Unknown encrypted_value format for "${keyName}"`);
    }
  } else {
    throw new Error(`[Security] Invalid encrypted_value for "${keyName}"`);
  }

  secretCache.set(keyName, { value: decrypted, expiresAt: Date.now() + CACHE_TTL_MS });
  return decrypted;
}

export async function safeFetchSecret(keyName: string): Promise<string | null> {
  try {
    return await fetchSecret(keyName);
  } catch {
    return null;
  }
}

export function clearSecretCache(): void {
  secretCache.clear();
}

export function invalidateSecretCache(keyName: string): void {
  secretCache.delete(keyName);
}

export function encryptForStorage(plaintext: string): { ciphertext: string; iv: string; tag: string } {
  if (!plaintext) throw new Error("[Security] Cannot encrypt empty data");
  
  const masterKey = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv, { authTagLength: AUTH_TAG_LENGTH });
  
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    tag: authTag.toString('base64'),
  };
}

export function generateSecureKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString("hex");
}

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  tag: string;
}
