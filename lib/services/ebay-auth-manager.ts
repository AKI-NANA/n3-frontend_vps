// lib/services/ebay-auth-manager.ts
/**
 * N3 Empire OS - eBay認証統一管理（唯一神）
 * 
 * 【帝国法典】
 * - eBayトークン処理はこのファイルのみ許可
 * - 他ファイルでのトークン直接取得・更新は禁止
 * - すべてのeBay API呼び出しはここからトークンを取得すること
 * 
 * 禁止パターン:
 *   ❌ new OAuthClient()
 *   ❌ fetch token directly
 *   ❌ process.env.EBAY_*
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { fetchSecret } from "@/lib/shared/security";
import { imperialErrorLog, imperialSleep } from "@/lib/shared/imperial-logger";

// ============================================================
// 型定義
// ============================================================

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

interface EbayCredentials {
  clientId: string;
  clientSecret: string;
  devId: string;
}

type EbayAccount = "green" | "mjt" | "mystical";

// ============================================================
// シングルトンキャッシュ
// ============================================================

const tokenCache = new Map<EbayAccount, TokenCache>();
const TOKEN_BUFFER_MS = 5 * 60 * 1000; // 5分の余裕

// ============================================================
// Supabaseクライアント
// ============================================================

let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (supabaseAdmin) return supabaseAdmin;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error("[EbayAuthManager] Supabase credentials not configured");
  }
  
  supabaseAdmin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  
  return supabaseAdmin;
}

// ============================================================
// メイン関数: getEbayToken（唯一の公開関数）
// ============================================================

/**
 * eBayアクセストークンを取得（自動リフレッシュ対応）
 * 
 * @param account アカウント名 (green, mjt, mystical)
 * @returns アクセストークン
 */
export async function getEbayToken(account: EbayAccount = "green"): Promise<string> {
  // 1. キャッシュチェック
  const cached = tokenCache.get(account);
  if (cached && cached.expiresAt > Date.now() + TOKEN_BUFFER_MS) {
    return cached.accessToken;
  }
  
  // 2. DBからトークン情報を取得
  const supabase = getSupabaseAdmin();
  
  const { data: tokenData, error: fetchError } = await supabase
    .from("ebay_tokens")
    .select("access_token, refresh_token, expires_at")
    .eq("account", account)
    .eq("is_active", true)
    .single();
  
  if (fetchError || !tokenData) {
    throw new Error(`[EbayAuthManager] Token not found for account: ${account}`);
  }
  
  // 3. 有効期限チェック
  const expiresAt = new Date(tokenData.expires_at).getTime();
  const now = Date.now();
  
  if (expiresAt > now + TOKEN_BUFFER_MS) {
    // まだ有効 → キャッシュして返す
    tokenCache.set(account, {
      accessToken: tokenData.access_token,
      expiresAt,
    });
    return tokenData.access_token;
  }
  
  // 4. リフレッシュが必要
  const newToken = await refreshEbayToken(account, tokenData.refresh_token);
  return newToken;
}

// ============================================================
// 内部関数: トークンリフレッシュ
// ============================================================

async function refreshEbayToken(
  account: EbayAccount,
  refreshToken: string
): Promise<string> {
  // 認証情報をfetchSecretから取得
  const credentials = await getEbayCredentials(account);
  
  const basicAuth = Buffer.from(
    `${credentials.clientId}:${credentials.clientSecret}`
  ).toString("base64");
  
  try {
    const response = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        scope: "https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment",
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      await imperialErrorLog(
        "eBay Token Refresh Failed",
        `Account: ${account}, Status: ${response.status}, Error: ${errorText}`
      );
      throw new Error(`[EbayAuthManager] Token refresh failed: ${response.status}`);
    }
    
    const data = await response.json();
    const newExpiresAt = Date.now() + (data.expires_in * 1000);
    
    // DBを更新
    const supabase = getSupabaseAdmin();
    await supabase
      .from("ebay_tokens")
      .update({
        access_token: data.access_token,
        expires_at: new Date(newExpiresAt).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("account", account);
    
    // キャッシュを更新
    tokenCache.set(account, {
      accessToken: data.access_token,
      expiresAt: newExpiresAt,
    });
    
    return data.access_token;
    
  } catch (error) {
    await imperialErrorLog(
      "eBay Token Refresh Error",
      error instanceof Error ? error.message : String(error),
      { account }
    );
    throw error;
  }
}

// ============================================================
// 内部関数: 認証情報取得
// ============================================================

async function getEbayCredentials(account: EbayAccount): Promise<EbayCredentials> {
  // system_secrets から取得（fetchSecret経由）
  const clientId = await fetchSecret(`EBAY_CLIENT_ID_${account.toUpperCase()}`);
  const clientSecret = await fetchSecret(`EBAY_CLIENT_SECRET_${account.toUpperCase()}`);
  const devId = await fetchSecret("EBAY_DEV_ID");
  
  if (!clientId || !clientSecret || !devId) {
    throw new Error(`[EbayAuthManager] Missing credentials for account: ${account}`);
  }
  
  return { clientId, clientSecret, devId };
}

// ============================================================
// ユーティリティ
// ============================================================

/**
 * キャッシュをクリア（トラブルシューティング用）
 */
export function clearEbayTokenCache(account?: EbayAccount): void {
  if (account) {
    tokenCache.delete(account);
  } else {
    tokenCache.clear();
  }
}

/**
 * トークン有効性チェック
 */
export async function isTokenValid(account: EbayAccount = "green"): Promise<boolean> {
  try {
    await getEbayToken(account);
    return true;
  } catch {
    return false;
  }
}

/**
 * 全アカウントのトークン状態を取得
 */
export async function getTokenStatus(): Promise<{
  account: EbayAccount;
  valid: boolean;
  expiresIn?: number;
}[]> {
  const accounts: EbayAccount[] = ["green", "mjt", "mystical"];
  const results = [];
  
  for (const account of accounts) {
    const cached = tokenCache.get(account);
    if (cached) {
      results.push({
        account,
        valid: cached.expiresAt > Date.now(),
        expiresIn: Math.max(0, cached.expiresAt - Date.now()),
      });
    } else {
      results.push({
        account,
        valid: await isTokenValid(account),
      });
    }
    
    // レートリミット保護
    await imperialSleep(500);
  }
  
  return results;
}
