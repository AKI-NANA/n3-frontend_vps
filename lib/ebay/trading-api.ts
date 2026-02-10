// lib/ebay/trading-api.ts
/**
 * N3 Empire OS - eBay Trading API Service
 * 
 * 【帝国法典準拠】
 * - 認証: ebay-auth-manager.ts 経由のみ
 * - 秘密: fetchSecret() 経由のみ
 * - 通信: Server Action内での使用のみ許可
 * - ログ: console.log禁止、エラーはimperialErrorLog
 */

import { getEbayToken } from "@/lib/services/ebay-auth-manager";
import { fetchSecret } from "@/lib/shared/security";
import { imperialErrorLog } from "@/lib/shared/imperial-logger";

// ============================================================
// 型定義
// ============================================================

interface EbayListingData {
  sku: string;
  title: string;
  description: string;
  categoryId: string;
  price: number;
  quantity: number;
  condition: 'NEW' | 'USED_EXCELLENT' | 'USED_GOOD' | 'USED_ACCEPTABLE' | 'FOR_PARTS_OR_NOT_WORKING';
  imageUrls: string[];
  shippingService: string;
  shippingCost: number;
  handlingTime: number;
  location: {
    country: string;
    postalCode: string;
    city: string;
  };
  paypalEmail?: string;
  returnPolicy?: {
    returnsAccepted: boolean;
    refundOption: string;
    returnsWithinDays: number;
    shippingCostPaidBy: string;
  };
}

interface AddItemResult {
  success: boolean;
  itemId?: string;
  error?: string;
  fees?: {
    insertionFee: number;
    finalValueFee: number;
  };
}

interface VerifyResult {
  success: boolean;
  fees?: {
    insertionFee: number;
    finalValueFee: number;
  };
  errors?: string[];
  warnings?: string[];
}

type EbayAccount = "green" | "mjt" | "mystical";

// ============================================================
// 定数
// ============================================================

const CONDITION_MAP: Record<string, string> = {
  'NEW': '1000',
  'USED_EXCELLENT': '2000',
  'USED_GOOD': '2000',
  'USED_ACCEPTABLE': '2000',
  'FOR_PARTS_OR_NOT_WORKING': '7000',
};

const EBAY_API_URL = 'https://api.ebay.com/ws/api.dll';
const EBAY_SANDBOX_URL = 'https://api.sandbox.ebay.com/ws/api.dll';

// ============================================================
// メインクラス
// ============================================================

export class EbayTradingApiService {
  private account: EbayAccount;
  private isProduction: boolean;

  constructor(account: EbayAccount = 'green', isProduction = true) {
    this.account = account;
    this.isProduction = isProduction;
  }

  /**
   * AddItem APIで商品を出品
   */
  async addItem(listing: EbayListingData): Promise<AddItemResult> {
    try {
      // ebay-auth-manager から統一的にトークン取得
      const token = await getEbayToken(this.account);
      const credentials = await this.getCredentials();
      
      const xmlRequest = await this.buildAddItemXml(listing, token);
      const apiUrl = this.isProduction ? EBAY_API_URL : EBAY_SANDBOX_URL;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: this.buildHeaders(token, credentials, 'AddItem'),
        body: xmlRequest,
      });

      const xmlResponse = await response.text();
      return this.parseAddItemResponse(xmlResponse);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await imperialErrorLog('eBay AddItem Error', errorMessage, { account: this.account });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * VerifyAddItem APIで出品テスト
   */
  async verifyAddItem(listing: EbayListingData): Promise<VerifyResult> {
    try {
      const token = await getEbayToken(this.account);
      const credentials = await this.getCredentials();
      
      const xmlRequest = (await this.buildAddItemXml(listing, token))
        .replace('<AddItemRequest', '<VerifyAddItemRequest')
        .replace('</AddItemRequest>', '</VerifyAddItemRequest>');
      
      const apiUrl = this.isProduction ? EBAY_API_URL : EBAY_SANDBOX_URL;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: this.buildHeaders(token, credentials, 'VerifyAddItem'),
        body: xmlRequest,
      });

      const xmlResponse = await response.text();
      return this.parseVerifyResponse(xmlResponse);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await imperialErrorLog('eBay VerifyAddItem Error', errorMessage, { account: this.account });
      return { success: false, errors: [errorMessage] };
    }
  }

  // ============================================================
  // Private Methods
  // ============================================================

  /**
   * 認証情報をfetchSecretから取得
   */
  private async getCredentials(): Promise<{ clientId: string; devId: string; certId: string }> {
    const clientId = await fetchSecret(`EBAY_CLIENT_ID_${this.account.toUpperCase()}`);
    const clientSecret = await fetchSecret(`EBAY_CLIENT_SECRET_${this.account.toUpperCase()}`);
    const devId = await fetchSecret('EBAY_DEV_ID');
    
    return {
      clientId,
      devId,
      certId: clientSecret, // Cert ID = Client Secret
    };
  }

  /**
   * APIリクエストヘッダー生成
   */
  private buildHeaders(
    token: string,
    credentials: { clientId: string; devId: string; certId: string },
    callName: string
  ): Record<string, string> {
    return {
      'Authorization': `Bearer ${token}`,
      'X-EBAY-API-SITEID': '0',
      'X-EBAY-API-COMPATIBILITY-LEVEL': '1193',
      'X-EBAY-API-CALL-NAME': callName,
      'X-EBAY-API-APP-NAME': credentials.clientId,
      'X-EBAY-API-DEV-NAME': credentials.devId,
      'X-EBAY-API-CERT-NAME': credentials.certId,
      'Content-Type': 'text/xml; charset=utf-8',
    };
  }

  /**
   * AddItem XML リクエスト生成
   */
  private async buildAddItemXml(listing: EbayListingData, token: string): Promise<string> {
    const pictureUrls = listing.imageUrls
      .filter(url => url && url.trim() !== '')
      .slice(0, 12)
      .map(url => `      <PictureURL>${this.escapeXml(url)}</PictureURL>`)
      .join('\n');

    const returnPolicy = listing.returnPolicy || {
      returnsAccepted: true,
      refundOption: 'MoneyBack',
      returnsWithinDays: 30,
      shippingCostPaidBy: 'Buyer',
    };

    return `<?xml version="1.0" encoding="utf-8"?>
<AddItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>${token}</eBayAuthToken>
  </RequesterCredentials>
  <ErrorLanguage>en_US</ErrorLanguage>
  <WarningLevel>High</WarningLevel>
  <Item>
    <Title>${this.escapeXml(listing.title.substring(0, 80))}</Title>
    <Description><![CDATA[${listing.description}]]></Description>
    <PrimaryCategory>
      <CategoryID>${listing.categoryId}</CategoryID>
    </PrimaryCategory>
    <StartPrice>${listing.price.toFixed(2)}</StartPrice>
    <ConditionID>${CONDITION_MAP[listing.condition] || '2000'}</ConditionID>
    <Country>${listing.location.country}</Country>
    <Currency>USD</Currency>
    <DispatchTimeMax>${listing.handlingTime}</DispatchTimeMax>
    <ListingDuration>GTC</ListingDuration>
    <ListingType>FixedPriceItem</ListingType>
    <Location>${this.escapeXml(listing.location.city)}</Location>
    <PostalCode>${listing.location.postalCode}</PostalCode>
    <PaymentMethods>PaymentSeeDescription</PaymentMethods>
    <IntegratedMerchantCreditCardEnabled>true</IntegratedMerchantCreditCardEnabled>
    <PictureDetails>
${pictureUrls}
    </PictureDetails>
    <Quantity>${listing.quantity}</Quantity>
    <ReturnPolicy>
      <ReturnsAcceptedOption>${returnPolicy.returnsAccepted ? 'ReturnsAccepted' : 'ReturnsNotAccepted'}</ReturnsAcceptedOption>
      ${returnPolicy.returnsAccepted ? `
      <RefundOption>${returnPolicy.refundOption}</RefundOption>
      <ReturnsWithinOption>Days_${returnPolicy.returnsWithinDays}</ReturnsWithinOption>
      <ShippingCostPaidByOption>${returnPolicy.shippingCostPaidBy}</ShippingCostPaidByOption>
      ` : ''}
    </ReturnPolicy>
    <ShippingDetails>
      <ShippingType>Flat</ShippingType>
      <ShippingServiceOptions>
        <ShippingServicePriority>1</ShippingServicePriority>
        <ShippingService>Other</ShippingService>
        <ShippingServiceCost>0.00</ShippingServiceCost>
        <ShippingServiceAdditionalCost>0.00</ShippingServiceAdditionalCost>
        <FreeShipping>true</FreeShipping>
      </ShippingServiceOptions>
      <InternationalShippingServiceOption>
        <ShippingServicePriority>1</ShippingServicePriority>
        <ShippingService>OtherInternational</ShippingService>
        <ShippingServiceCost>${listing.shippingCost.toFixed(2)}</ShippingServiceCost>
        <ShippingServiceAdditionalCost>5.00</ShippingServiceAdditionalCost>
        <ShipToLocation>US</ShipToLocation>
        <ShipToLocation>WorldWide</ShipToLocation>
      </InternationalShippingServiceOption>
      <GlobalShipping>true</GlobalShipping>
    </ShippingDetails>
    <Site>US</Site>
    <SKU>${this.escapeXml(listing.sku)}</SKU>
  </Item>
</AddItemRequest>`;
  }

  /**
   * AddItem レスポンス解析
   */
  private parseAddItemResponse(xmlResponse: string): AddItemResult {
    const ackMatch = xmlResponse.match(/<Ack>(.*?)<\/Ack>/);
    const ack = ackMatch ? ackMatch[1] : 'Unknown';

    if (ack === 'Success' || ack === 'Warning') {
      const itemIdMatch = xmlResponse.match(/<ItemID>(\d+)<\/ItemID>/);
      const insertionFeeMatch = xmlResponse.match(/<InsertionFee currencyID="USD">([\d.]+)<\/InsertionFee>/);

      return {
        success: true,
        itemId: itemIdMatch ? itemIdMatch[1] : undefined,
        fees: {
          insertionFee: insertionFeeMatch ? parseFloat(insertionFeeMatch[1]) : 0,
          finalValueFee: 0,
        },
      };
    }

    const errorCodeMatch = xmlResponse.match(/<ErrorCode>(\d+)<\/ErrorCode>/);
    const longMessageMatch = xmlResponse.match(/<LongMessage>(.*?)<\/LongMessage>/);
    const errorCode = errorCodeMatch ? errorCodeMatch[1] : 'Unknown';
    const errorMessage = longMessageMatch ? longMessageMatch[1] : 'Unknown error';

    return {
      success: false,
      error: `${errorCode}: ${errorMessage}`,
    };
  }

  /**
   * VerifyAddItem レスポンス解析
   */
  private parseVerifyResponse(xmlResponse: string): VerifyResult {
    const ackMatch = xmlResponse.match(/<Ack>(.*?)<\/Ack>/);
    const ack = ackMatch ? ackMatch[1] : 'Unknown';

    const insertionFeeMatch = xmlResponse.match(/<InsertionFee currencyID="USD">([\d.]+)<\/InsertionFee>/);
    const insertionFee = insertionFeeMatch ? parseFloat(insertionFeeMatch[1]) : 0;

    const errors: string[] = [];
    const warnings: string[] = [];

    const errorMatches = xmlResponse.matchAll(
      /<Errors>[\s\S]*?<SeverityCode>(.*?)<\/SeverityCode>[\s\S]*?<LongMessage>(.*?)<\/LongMessage>[\s\S]*?<\/Errors>/g
    );
    
    for (const match of errorMatches) {
      const severity = match[1];
      const message = match[2];
      if (severity === 'Error') {
        errors.push(message);
      } else if (severity === 'Warning') {
        warnings.push(message);
      }
    }

    if (ack === 'Success' || ack === 'Warning') {
      return {
        success: true,
        fees: { insertionFee, finalValueFee: 0 },
        warnings,
      };
    }

    return {
      success: false,
      errors,
      warnings,
    };
  }

  /**
   * XML エスケープ
   */
  private escapeXml(str: string): string {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

// ============================================================
// ファクトリ関数（便利メソッド）
// ============================================================

export function createEbayTradingService(
  account: EbayAccount = 'green',
  isProduction = true
): EbayTradingApiService {
  return new EbayTradingApiService(account, isProduction);
}
