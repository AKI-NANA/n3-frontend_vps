// app/api/ebay/get-item-by-url/route.ts
/**
 * eBay URL から商品詳細を取得するAPI
 * 
 * 🔥 機能:
 * - eBay商品URLからItemIDを抽出
 * - Marketplace IDを自動判定（URLドメインから）
 * - Browse API で詳細取得
 * - Item Specifics をパース
 * 
 * @created 2025-01-17
 */
import { NextRequest, NextResponse } from 'next/server';

const EBAY_BROWSE_API = 'https://api.ebay.com/buy/browse/v1/item';
const EBAY_TOKEN_API = 'https://api.ebay.com/identity/v1/oauth2/token';

// ============================================================
// Marketplace ID 判定
// ============================================================

interface MarketplaceInfo {
  marketplaceId: string;
  country: string;
  currency: string;
}

function detectMarketplaceFromUrl(url: string): MarketplaceInfo {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('ebay.co.uk')) {
    return { marketplaceId: 'EBAY_GB', country: 'GB', currency: 'GBP' };
  }
  if (urlLower.includes('ebay.de')) {
    return { marketplaceId: 'EBAY_DE', country: 'DE', currency: 'EUR' };
  }
  if (urlLower.includes('ebay.fr')) {
    return { marketplaceId: 'EBAY_FR', country: 'FR', currency: 'EUR' };
  }
  if (urlLower.includes('ebay.it')) {
    return { marketplaceId: 'EBAY_IT', country: 'IT', currency: 'EUR' };
  }
  if (urlLower.includes('ebay.es')) {
    return { marketplaceId: 'EBAY_ES', country: 'ES', currency: 'EUR' };
  }
  if (urlLower.includes('ebay.com.au')) {
    return { marketplaceId: 'EBAY_AU', country: 'AU', currency: 'AUD' };
  }
  if (urlLower.includes('ebay.ca')) {
    return { marketplaceId: 'EBAY_CA', country: 'CA', currency: 'CAD' };
  }
  if (urlLower.includes('ebay.co.jp')) {
    return { marketplaceId: 'EBAY_JP', country: 'JP', currency: 'JPY' };
  }
  
  // デフォルト: US
  return { marketplaceId: 'EBAY_US', country: 'US', currency: 'USD' };
}

// ============================================================
// Item ID 抽出
// ============================================================

function extractItemIdFromUrl(url: string): string | null {
  // パターン1: /itm/123456789
  const match1 = url.match(/\/itm\/(\d+)/);
  if (match1) return match1[1];
  
  // パターン2: /itm/title/123456789
  const match2 = url.match(/\/itm\/[^/]+\/(\d+)/);
  if (match2) return match2[1];
  
  // パターン3: ?item=123456789
  const match3 = url.match(/[?&]item=(\d+)/);
  if (match3) return match3[1];
  
  // パターン4: itemId=123456789
  const match4 = url.match(/itemId=(\d+)/);
  if (match4) return match4[1];
  
  // パターン5: 数字のみ（直接ItemID入力）
  const match5 = url.match(/^(\d{10,14})$/);
  if (match5) return match5[1];
  
  return null;
}

// ============================================================
// トークン取得
// ============================================================

// トークンキャッシュ
let tokenCache: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  // キャッシュチェック
  if (tokenCache && tokenCache.expiresAt > Date.now() + 5 * 60 * 1000) {
    return tokenCache.accessToken;
  }
  
  const clientId = process.env.EBAY_CLIENT_ID || '';
  const clientSecret = process.env.EBAY_CLIENT_SECRET || '';
  
  if (!clientId || !clientSecret) {
    throw new Error('eBayクレデンシャルが設定されていません');
  }
  
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch(EBAY_TOKEN_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'https://api.ebay.com/oauth/api_scope'
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ トークン取得エラー:', errorText);
    throw new Error(`トークン取得失敗: ${response.status}`);
  }
  
  const data = await response.json();
  
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000
  };
  
  return data.access_token;
}

// ============================================================
// Item Specifics パース
// ============================================================

function parseItemSpecifics(localizedAspects: any[]): Record<string, string> {
  const specifics: Record<string, string> = {};
  
  if (!localizedAspects || !Array.isArray(localizedAspects)) {
    return specifics;
  }
  
  for (const aspect of localizedAspects) {
    if (aspect.name && aspect.value) {
      const value = Array.isArray(aspect.value) 
        ? aspect.value.join(', ') 
        : String(aspect.value);
      specifics[aspect.name] = value;
    }
  }
  
  return specifics;
}

// ============================================================
// メインハンドラー
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, productId } = body;
    
    if (!url) {
      return NextResponse.json({ success: false, error: 'URLが指定されていません' }, { status: 400 });
    }
    
    console.log(`🔗 [get-item-by-url] 処理開始: ${url}`);
    
    // 1. Item ID を抽出
    const itemId = extractItemIdFromUrl(url);
    if (!itemId) {
      console.error('❌ [get-item-by-url] ItemID抽出失敗:', url);
      return NextResponse.json({ 
        success: false, 
        error: 'URLからItemIDを抽出できませんでした。正しいeBay商品URLを入力してください。',
        hint: '例: https://www.ebay.com/itm/123456789'
      }, { status: 400 });
    }
    
    console.log(`  📦 ItemID: ${itemId}`);
    
    // 2. Marketplace ID を判定
    const marketplace = detectMarketplaceFromUrl(url);
    console.log(`  🌍 Marketplace: ${marketplace.marketplaceId} (${marketplace.country})`);
    
    // 3. アクセストークン取得
    const accessToken = await getAccessToken();
    
    // 4. Browse API でアイテム詳細を取得
    // v1|ItemID|0 形式のレガシーIDを構築
    const legacyItemId = `v1|${itemId}|0`;
    const apiUrl = `${EBAY_BROWSE_API}/${encodeURIComponent(legacyItemId)}`;
    
    console.log(`  🔍 API呼び出し: ${apiUrl}`);
    console.log(`  🔑 Marketplace-ID: ${marketplace.marketplaceId}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-EBAY-C-MARKETPLACE-ID': marketplace.marketplaceId,
        'X-EBAY-C-ENDUSERCTX': `contextualLocation=country=${marketplace.country}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [get-item-by-url] API エラー (${response.status}):`, errorText);
      
      // エラー詳細を解析
      let errorMessage = `eBay APIエラー: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.errors?.[0]?.message) {
          errorMessage = errorJson.errors[0].message;
        }
      } catch {}
      
      return NextResponse.json({ 
        success: false, 
        error: errorMessage,
        details: {
          statusCode: response.status,
          itemId,
          marketplace: marketplace.marketplaceId
        }
      }, { status: response.status });
    }
    
    const itemData = await response.json();
    
    // 5. データを整形
    const itemSpecifics = parseItemSpecifics(itemData.localizedAspects);
    
    const result = {
      itemId: itemData.itemId || legacyItemId,
      legacyItemId: itemId,
      title: itemData.title || '',
      price: {
        value: itemData.price?.value || '0',
        currency: itemData.price?.currency || marketplace.currency
      },
      condition: itemData.condition || 'Unknown',
      conditionId: itemData.conditionId,
      image: itemData.image?.imageUrl || itemData.additionalImages?.[0]?.imageUrl,
      additionalImages: itemData.additionalImages?.map((img: any) => img.imageUrl) || [],
      seller: {
        username: itemData.seller?.username || 'Unknown',
        feedbackScore: itemData.seller?.feedbackScore || 0,
        feedbackPercentage: itemData.seller?.feedbackPercentage || '0%'
      },
      itemLocation: {
        country: itemData.itemLocation?.country || marketplace.country,
        city: itemData.itemLocation?.city
      },
      itemWebUrl: itemData.itemWebUrl || url,
      categoryId: itemData.categoryId,
      categoryPath: itemData.categoryPath,
      itemSpecifics,
      itemSpecificsCount: Object.keys(itemSpecifics).length,
      quantityAvailable: itemData.estimatedAvailabilities?.[0]?.availabilityThreshold || 0,
      marketplace: marketplace.marketplaceId,
      // 重要フィールドを抽出
      brand: itemSpecifics['Brand'] || itemSpecifics['ブランド'],
      model: itemSpecifics['Model'] || itemSpecifics['MPN'] || itemSpecifics['モデル'],
      countryOfManufacture: itemSpecifics['Country/Region of Manufacture'] || itemSpecifics['製造国'],
      material: itemSpecifics['Material'] || itemSpecifics['素材'],
    };
    
    console.log(`✅ [get-item-by-url] 取得成功: "${result.title?.substring(0, 50)}..." (Specs: ${result.itemSpecificsCount}件)`);
    
    return NextResponse.json({
      success: true,
      item: result,
      message: `商品情報を取得しました（Item Specifics: ${result.itemSpecificsCount}件）`
    });
    
  } catch (error: any) {
    console.error('❌ [get-item-by-url] エラー:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || '商品情報の取得に失敗しました'
    }, { status: 500 });
  }
}
