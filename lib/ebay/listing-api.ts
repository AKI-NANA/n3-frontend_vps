// lib/ebay/listing-api.ts
import { getValidToken } from './token-manager';

const EBAY_TRADING_API_URL = process.env.EBAY_ENVIRONMENT === 'SANDBOX'
  ? 'https://api.sandbox.ebay.com/ws/api.dll'
  : 'https://api.ebay.com/ws/api.dll';

interface ListingParams {
  product: any;
  token: string;
  marketplace: string;
  account: string;
}

export async function createEbayListing({ product, token, marketplace, account }: ListingParams) {
  // XMLヘッダー構築
  const headers = {
    'X-EBAY-API-SITEID': getSiteId(marketplace),
    'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
    'X-EBAY-API-CALL-NAME': 'AddItem',
    'X-EBAY-API-IAF-TOKEN': token,
    'Content-Type': 'text/xml'
  };

  // 商品データからXMLボディを構築
  const xmlBody = `
    <?xml version="1.0" encoding="utf-8"?>
    <AddItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials>
        <eBayAuthToken>${token}</eBayAuthToken>
      </RequesterCredentials>
      <ErrorLanguage>en_US</ErrorLanguage>
      <WarningLevel>High</WarningLevel>
      <Item>
        <Title>${escapeXml(product.title || product.product_name)}</Title>
        <Description><![CDATA[${product.html_content || product.description || 'No description'}]]></Description>
        <PrimaryCategory>
          <CategoryID>${product.category_id || product.ebay_category_id || '950'}</CategoryID>
        </PrimaryCategory>
        <StartPrice currencyID="USD">${product.price_usd || product.selling_price || '0.99'}</StartPrice>
        <ConditionID>${getConditionId(product.condition_name)}</ConditionID>
        <Country>JP</Country>
        <Currency>USD</Currency>
        <DispatchTimeMax>3</DispatchTimeMax>
        <ListingDuration>GTC</ListingDuration>
        <ListingType>FixedPriceItem</ListingType>
        <PictureDetails>
          ${(product.images || []).map((url: string) => `<PictureURL>${url}</PictureURL>`).join('')}
        </PictureDetails>
        <Location>Japan</Location>
        <Quantity>${product.quantity || product.physical_quantity || 1}</Quantity>
        <ReturnPolicy>
          <ReturnsAcceptedOption>ReturnsAccepted</ReturnsAcceptedOption>
          <RefundOption>MoneyBack</RefundOption>
          <ReturnsWithinOption>Days_30</ReturnsWithinOption>
          <ShippingCostPaidByOption>Buyer</ShippingCostPaidByOption>
        </ReturnPolicy>
        <ShippingDetails>
          <ShippingServiceOptions>
            <ShippingServicePriority>1</ShippingServicePriority>
            <ShippingService>StandardShippingFromOutsideUS</ShippingService>
            <ShippingServiceCost currencyID="USD">0.0</ShippingServiceCost>
          </ShippingServiceOptions>
        </ShippingDetails>
      </Item>
    </AddItemRequest>
  `;

  try {
    const response = await fetch(EBAY_TRADING_API_URL, {
      method: 'POST',
      headers: headers,
      body: xmlBody
    });

    const text = await response.text();
    
    // 簡易的なXML解析
    if (text.includes('<Ack>Success</Ack>') || text.includes('<Ack>Warning</Ack>')) {
      const itemIdMatch = text.match(/<ItemID>(\d+)<\/ItemID>/);
      const itemId = itemIdMatch ? itemIdMatch[1] : null;
      return { success: true, itemId, raw: text };
    } else {
      const errorMatch = text.match(/<LongMessage>(.*?)<\/LongMessage>/);
      const errorMessage = errorMatch ? errorMatch[1] : 'Unknown eBay API Error';
      console.error('eBay Listing Error:', errorMessage);
      return { success: false, error: errorMessage, raw: text };
    }

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

function getSiteId(marketplace: string): string {
  if (marketplace && marketplace.includes('UK')) return '3';
  return '0'; // Default US
}

function getConditionId(condition: string): string {
  const c = condition?.toLowerCase() || '';
  if (c.includes('new')) return '1000';
  if (c.includes('used')) return '3000';
  return '3000'; // Default Used
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
    return c;
  });
}