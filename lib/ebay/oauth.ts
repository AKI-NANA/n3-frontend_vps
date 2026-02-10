// lib/ebay/oauth.ts
/**
 * ⚠️ DEPRECATED - このファイルは非推奨です
 * 
 * 【帝国法典】
 * すべてのeBay認証は ebay-auth-manager.ts を使用すること
 * 
 * 移行方法:
 *   import { getEbayToken } from "@/lib/services/ebay-auth-manager";
 *   const token = await getEbayToken("green"); // or "mjt", "mystical"
 */

import { getEbayToken, clearEbayTokenCache } from "@/lib/services/ebay-auth-manager";

/**
 * @deprecated Use getEbayToken from ebay-auth-manager instead
 */
export async function getAccessToken(account: string): Promise<string> {
  const normalizedAccount = normalizeAccountName(account);
  return getEbayToken(normalizedAccount);
}

/**
 * @deprecated Use clearEbayTokenCache from ebay-auth-manager instead
 */
export function clearTokenCache(account?: string): void {
  if (account) {
    const normalizedAccount = normalizeAccountName(account);
    clearEbayTokenCache(normalizedAccount);
  } else {
    clearEbayTokenCache();
  }
}

/**
 * アカウント名の正規化
 */
function normalizeAccountName(account: string): "green" | "mjt" | "mystical" {
  const ACCOUNT_MAP: Record<string, "green" | "mjt" | "mystical"> = {
    'account1': 'mjt',
    'account2': 'green',
    'mjt': 'mjt',
    'MJT': 'mjt',
    'green': 'green',
    'GREEN': 'green',
    'mystical': 'mystical',
    'MYSTICAL': 'mystical',
  };
  return ACCOUNT_MAP[account] || 'green';
}

/**
 * @deprecated Token status check - use ebay-auth-manager instead
 */
export async function checkTokenStatus(account: string): Promise<{
  account: string;
  hasToken: boolean;
  isValid: boolean;
}> {
  try {
    await getAccessToken(account);
    return { account, hasToken: true, isValid: true };
  } catch {
    return { account, hasToken: false, isValid: false };
  }
}
