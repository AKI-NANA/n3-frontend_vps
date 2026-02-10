// lib/services/legacy/ebay/ebay-api.ts
/**
 * ⚠️ DEPRECATED - このファイルは非推奨です
 * 
 * 【帝国法典】
 * すべてのeBay API呼び出しは以下を使用すること:
 *   - 認証: lib/services/ebay-auth-manager.ts
 *   - Trading API: lib/ebay/trading-api.ts
 * 
 * このファイルは後方互換性のために残されています
 */

import { getEbayToken } from "@/lib/services/ebay-auth-manager";
import { fetchSecret } from "@/lib/shared/security";
import { imperialErrorLog } from "@/lib/shared/imperial-logger";

// ============================================================
// 型定義
// ============================================================

interface EbayCredentials {
  appId: string;
  devId: string;
}

interface EbayApiOptions {
  callName: string;
  siteId?: string;
  body: string;
  account?: "green" | "mjt" | "mystical";
}

// ============================================================
// メイン関数
// ============================================================

/**
 * @deprecated Use EbayTradingApiService from lib/ebay/trading-api.ts instead
 */
export async function getEbayCredentials(): Promise<EbayCredentials> {
  const appId = await fetchSecret('EBAY_CLIENT_ID_GREEN');
  const devId = await fetchSecret('EBAY_DEV_ID');

  if (!appId || !devId) {
    throw new Error('eBay API credentials not configured in system_secrets');
  }

  return { appId, devId };
}

/**
 * @deprecated Use EbayTradingApiService from lib/ebay/trading-api.ts instead
 */
export async function callEbayTradingAPI(options: EbayApiOptions): Promise<string> {
  const account = options.account || "green";
  const { callName, siteId = '0', body } = options;

  try {
    const credentials = await getEbayCredentials();
    const accessToken = await getEbayToken(account);

    const url = 'https://api.ebay.com/ws/api.dll';

    const headers = {
      'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
      'X-EBAY-API-DEV-NAME': credentials.devId,
      'X-EBAY-API-APP-NAME': credentials.appId,
      'X-EBAY-API-CALL-NAME': callName,
      'X-EBAY-API-SITEID': siteId,
      'Content-Type': 'text/xml; charset=utf-8',
      'X-EBAY-API-IAF-TOKEN': accessToken,
    };

    const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
<${callName}Request xmlns="urn:ebay:apis:eBLBaseComponents">
  ${body}
</${callName}Request>`;

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: xmlRequest,
    });

    if (!response.ok) {
      throw new Error(`eBay API HTTP Error: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    await imperialErrorLog('Legacy eBay API Error', `CallName: ${callName}, Error: ${errorMessage}`);
    throw error;
  }
}

// ============================================================
// ユーティリティ
// ============================================================

export function extractXmlValue(xml: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}>([^<]*)</${tagName}>`);
  const match = xml.match(regex);
  return match ? match[1] : null;
}

export function isEbayApiSuccess(xml: string): boolean {
  return xml.includes('<Ack>Success</Ack>');
}

export function extractEbayErrors(xml: string): string[] {
  const errors: string[] = [];
  const errorRegex = /<ShortMessage>([^<]*)<\/ShortMessage>/g;
  let match;

  while ((match = errorRegex.exec(xml)) !== null) {
    errors.push(match[1]);
  }

  return errors;
}
