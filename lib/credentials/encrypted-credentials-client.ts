/**
 * lib/credentials/encrypted-credentials-client.ts
 *
 * 暗号化された認証情報を安全に取得するクライアント
 * P0: Critical Security Implementation
 *
 * 機能:
 * - Supabaseから暗号化された認証情報を復号化して取得
 * - キャッシュ機能（メモリキャッシュ、TTL付き）
 * - フォールバック（環境変数）
 */

import { createClient } from "@supabase/supabase-js";

// Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * 認証情報の型定義
 */
export interface DecryptedCredentials {
  service_name: string;
  app_id: string | null;
  client_id: string | null;
  client_secret: string | null;
  dev_id: string | null;
  access_token: string | null;
  refresh_token: string | null;
  token_expires_at: Date | null;
}

/**
 * キャッシュエントリの型定義
 */
interface CacheEntry {
  credentials: DecryptedCredentials;
  cachedAt: number;
  ttl: number; // Time to live in milliseconds
}

/**
 * メモリキャッシュ（プロセス内）
 */
const credentialsCache = new Map<string, CacheEntry>();

/**
 * デフォルトキャッシュTTL（5分）
 */
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

/**
 * 暗号化された認証情報を取得
 *
 * @param serviceName サービス名（例: 'ebay_finding', 'ebay_trading'）
 * @param useCache キャッシュを使用するか（デフォルト: true）
 * @returns 復号化された認証情報
 */
export async function getEncryptedCredentials(
  serviceName: string,
  useCache: boolean = true
): Promise<DecryptedCredentials | null> {
  try {
    // キャッシュチェック
    if (useCache) {
      const cached = getCachedCredentials(serviceName);
      if (cached) {
        console.log(`🚀 Cache hit: ${serviceName}`);
        return cached;
      }
    }

    console.log(`🔓 Fetching encrypted credentials: ${serviceName}`);

    // Supabaseから復号化して取得
    const { data, error } = await supabase.rpc("get_decrypted_credentials", {
      p_service_name: serviceName,
    });

    if (error) {
      console.error(`❌ Failed to fetch credentials for ${serviceName}:`, error);
      return getFallbackCredentials(serviceName);
    }

    if (!data || data.length === 0) {
      console.warn(`⚠️ Credentials not found for ${serviceName}, using fallback`);
      return getFallbackCredentials(serviceName);
    }

    const credentials = data[0] as DecryptedCredentials;

    // キャッシュに保存
    if (useCache) {
      setCachedCredentials(serviceName, credentials, DEFAULT_CACHE_TTL);
    }

    console.log(`✅ Credentials fetched successfully: ${serviceName}`);

    return credentials;
  } catch (error) {
    console.error(`❌ Error fetching credentials for ${serviceName}:`, error);
    return getFallbackCredentials(serviceName);
  }
}

/**
 * キャッシュから認証情報を取得
 */
function getCachedCredentials(serviceName: string): DecryptedCredentials | null {
  const cached = credentialsCache.get(serviceName);

  if (!cached) {
    return null;
  }

  // TTLチェック
  const now = Date.now();
  if (now - cached.cachedAt > cached.ttl) {
    // 期限切れ
    credentialsCache.delete(serviceName);
    return null;
  }

  return cached.credentials;
}

/**
 * 認証情報をキャッシュに保存
 */
function setCachedCredentials(
  serviceName: string,
  credentials: DecryptedCredentials,
  ttl: number
): void {
  credentialsCache.set(serviceName, {
    credentials,
    cachedAt: Date.now(),
    ttl,
  });
}

/**
 * キャッシュをクリア
 */
export function clearCredentialsCache(serviceName?: string): void {
  if (serviceName) {
    credentialsCache.delete(serviceName);
    console.log(`🗑️ Cache cleared: ${serviceName}`);
  } else {
    credentialsCache.clear();
    console.log(`🗑️ All cache cleared`);
  }
}

/**
 * フォールバック: 環境変数から取得
 *
 * @param serviceName サービス名
 * @returns 環境変数から取得した認証情報
 */
function getFallbackCredentials(
  serviceName: string
): DecryptedCredentials | null {
  console.log(`⚠️ Using fallback credentials from environment variables: ${serviceName}`);

  switch (serviceName) {
    case "ebay_finding":
    case "ebay_trading":
    case "ebay_browse":
      return {
        service_name: serviceName,
        app_id: process.env.EBAY_APP_ID || process.env.EBAY_CLIENT_ID_MJT || null,
        client_id: process.env.EBAY_CLIENT_ID || null,
        client_secret: process.env.EBAY_CLIENT_SECRET || null,
        dev_id: process.env.EBAY_DEV_ID || null,
        access_token: null,
        refresh_token: null,
        token_expires_at: null,
      };

    default:
      console.error(`❌ Unknown service: ${serviceName}`);
      return null;
  }
}

/**
 * eBay Finding API用の認証情報を取得
 */
export async function getEbayFindingCredentials(): Promise<{
  appId: string;
  clientId: string | null;
  clientSecret: string | null;
  devId: string | null;
}> {
  const credentials = await getEncryptedCredentials("ebay_finding");

  if (!credentials || !credentials.app_id) {
    throw new Error("eBay Finding API credentials not found");
  }

  return {
    appId: credentials.app_id,
    clientId: credentials.client_id,
    clientSecret: credentials.client_secret,
    devId: credentials.dev_id,
  };
}

/**
 * eBay Trading API用の認証情報を取得
 */
export async function getEbayTradingCredentials(): Promise<{
  appId: string;
  clientId: string;
  clientSecret: string;
  devId: string;
}> {
  const credentials = await getEncryptedCredentials("ebay_trading");

  if (
    !credentials ||
    !credentials.app_id ||
    !credentials.client_id ||
    !credentials.client_secret ||
    !credentials.dev_id
  ) {
    throw new Error("eBay Trading API credentials not found");
  }

  return {
    appId: credentials.app_id,
    clientId: credentials.client_id,
    clientSecret: credentials.client_secret,
    devId: credentials.dev_id,
  };
}

/**
 * eBay Browse API用の認証情報を取得
 */
export async function getEbayBrowseCredentials(): Promise<{
  clientId: string;
  clientSecret: string;
}> {
  const credentials = await getEncryptedCredentials("ebay_browse");

  if (!credentials || !credentials.client_id || !credentials.client_secret) {
    throw new Error("eBay Browse API credentials not found");
  }

  return {
    clientId: credentials.client_id,
    clientSecret: credentials.client_secret,
  };
}
