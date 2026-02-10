/**
 * 仕入れ先検索API
 * /app/api/supplier/search/route.ts
 * 
 * 各ECサイトからの仕入れ先検索
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// =====================================================
// 型定義
// =====================================================

interface SupplierSearchResult {
  source: string;
  url: string;
  title: string;
  price: number;
  currency: string;
  inStock: boolean;
  stockQuantity?: number;
  shippingFee?: number;
  seller?: string;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  confidence: number;
}

// =====================================================
// POST: 仕入れ先検索
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      source,
      keyword,
      jan,
      asin,
      maxResults = 10,
    } = body;
    
    if (!source) {
      return NextResponse.json({
        success: false,
        error: 'source が必要です',
      }, { status: 400 });
    }
    
    if (!keyword && !jan && !asin) {
      return NextResponse.json({
        success: false,
        error: 'keyword, jan, または asin が必要です',
      }, { status: 400 });
    }
    
    let results: SupplierSearchResult[] = [];
    
    switch (source) {
      case 'amazon_jp':
        results = await searchAmazonJp({ keyword, jan, asin, maxResults });
        break;
      case 'rakuten':
        results = await searchRakuten({ keyword, jan, maxResults });
        break;
      case 'yahoo_auction':
        results = await searchYahooAuction({ keyword, maxResults });
        break;
      case 'mercari':
        results = await searchMercari({ keyword, maxResults });
        break;
      case 'yahoo_shopping':
        results = await searchYahooShopping({ keyword, jan, maxResults });
        break;
      default:
        return NextResponse.json({
          success: false,
          error: `未対応のソース: ${source}`,
        }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      source,
      results,
      count: results.length,
    });
    
  } catch (error: any) {
    console.error('[Supplier Search] エラー:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// =====================================================
// Amazon JP検索
// =====================================================

async function searchAmazonJp(params: {
  keyword?: string;
  jan?: string;
  asin?: string;
  maxResults: number;
}): Promise<SupplierSearchResult[]> {
  console.log('[Amazon JP] 検索パラメータ:', params);
  
  // PA-APIまたはスクレイピングで実装
  // 実際の実装ではPA-APIを使用
  // const paApiKey = process.env.AMAZON_PA_API_KEY;
  // const paApiSecret = process.env.AMAZON_PA_API_SECRET;
  
  // モック結果
  if (params.asin) {
    return [{
      source: 'amazon_jp',
      url: `https://www.amazon.co.jp/dp/${params.asin}`,
      title: `Amazon商品 ${params.asin}`,
      price: 3980,
      currency: 'JPY',
      inStock: true,
      stockQuantity: 10,
      shippingFee: 0,
      seller: 'Amazon.co.jp',
      rating: 4.2,
      reviewCount: 150,
      confidence: 1.0,
    }];
  }
  
  return [];
}

// =====================================================
// 楽天検索
// =====================================================

async function searchRakuten(params: {
  keyword?: string;
  jan?: string;
  maxResults: number;
}): Promise<SupplierSearchResult[]> {
  const appId = process.env.RAKUTEN_APP_ID;
  
  if (!appId) {
    console.warn('[Rakuten] RAKUTEN_APP_ID が設定されていません');
    return [];
  }
  
  try {
    const searchParams = new URLSearchParams({
      applicationId: appId,
      format: 'json',
      hits: String(params.maxResults),
    });
    
    if (params.keyword) {
      searchParams.append('keyword', params.keyword);
    }
    if (params.jan) {
      searchParams.append('jan', params.jan);
    }
    
    const response = await fetch(
      `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?${searchParams}`
    );
    
    if (!response.ok) {
      throw new Error(`Rakuten API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return (data.Items || []).map((item: any) => ({
      source: 'rakuten',
      url: item.Item.itemUrl,
      title: item.Item.itemName,
      price: item.Item.itemPrice,
      currency: 'JPY',
      inStock: item.Item.availability === 1,
      shippingFee: item.Item.postageFlag === 1 ? 0 : undefined,
      seller: item.Item.shopName,
      rating: item.Item.reviewAverage,
      reviewCount: item.Item.reviewCount,
      images: [item.Item.mediumImageUrls?.[0]?.imageUrl].filter(Boolean),
      confidence: 0.8,
    }));
    
  } catch (error) {
    console.error('[Rakuten] 検索エラー:', error);
    return [];
  }
}

// =====================================================
// ヤフオク検索
// =====================================================

async function searchYahooAuction(params: {
  keyword?: string;
  maxResults: number;
}): Promise<SupplierSearchResult[]> {
  console.log('[Yahoo Auction] 検索パラメータ:', params);
  // Yahoo! オークションAPIまたはスクレイピング
  return [];
}

// =====================================================
// メルカリ検索
// =====================================================

async function searchMercari(params: {
  keyword?: string;
  maxResults: number;
}): Promise<SupplierSearchResult[]> {
  console.log('[Mercari] 検索パラメータ:', params);
  // メルカリはAPIがないためスクレイピングが必要
  return [];
}

// =====================================================
// Yahoo!ショッピング検索
// =====================================================

async function searchYahooShopping(params: {
  keyword?: string;
  jan?: string;
  maxResults: number;
}): Promise<SupplierSearchResult[]> {
  const appId = process.env.YAHOO_APP_ID;
  
  if (!appId) {
    console.warn('[Yahoo Shopping] YAHOO_APP_ID が設定されていません');
    return [];
  }
  
  try {
    const searchParams = new URLSearchParams({
      appid: appId,
      results: String(params.maxResults),
      output: 'json',
    });
    
    if (params.keyword) {
      searchParams.append('query', params.keyword);
    }
    if (params.jan) {
      searchParams.append('jan', params.jan);
    }
    
    const response = await fetch(
      `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?${searchParams}`
    );
    
    if (!response.ok) {
      throw new Error(`Yahoo Shopping API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return (data.hits || []).map((item: any) => ({
      source: 'yahoo_shopping',
      url: item.url,
      title: item.name,
      price: item.price,
      currency: 'JPY',
      inStock: item.inStock,
      shippingFee: item.shipping?.code === 1 ? 0 : undefined,
      seller: item.seller?.name,
      rating: item.review?.rate,
      reviewCount: item.review?.count,
      images: [item.image?.medium].filter(Boolean),
      confidence: 0.8,
    }));
    
  } catch (error) {
    console.error('[Yahoo Shopping] 検索エラー:', error);
    return [];
  }
}
