// lib/ebay/oauth-client.ts
/**
 * ⚠️ DEPRECATED - このファイルは非推奨です
 * 
 * 【帝国法典】
 * すべてのeBay認証は ebay-auth-manager.ts を使用すること
 * 
 * 移行方法:
 *   import { getEbayToken } from "@/lib/services/ebay-auth-manager";
 *   const token = await getEbayToken("green");
 */

import { getEbayToken, clearEbayTokenCache } from "@/lib/services/ebay-auth-manager";

/**
 * @deprecated Use getEbayToken from ebay-auth-manager instead
 */
export class EbayOAuthClient {
  private static instance: EbayOAuthClient;
  private account: "green" | "mjt" | "mystical" = "green";

  private constructor() {}

  static getInstance(): EbayOAuthClient {
    if (!this.instance) {
      this.instance = new EbayOAuthClient();
    }
    return this.instance;
  }

  setAccount(account: "green" | "mjt" | "mystical"): void {
    this.account = account;
  }

  async getAccessToken(): Promise<string> {
    return getEbayToken(this.account);
  }

  async refreshAccessToken(): Promise<string> {
    clearEbayTokenCache(this.account);
    return getEbayToken(this.account);
  }
}

/**
 * @deprecated Use getEbayToken from ebay-auth-manager instead
 */
export function getEbayOAuthClient(): EbayOAuthClient {
  return EbayOAuthClient.getInstance();
}
