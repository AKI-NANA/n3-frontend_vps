// app/api/research-table/reverse-search/route.ts
/**
 * 逆引きリサーチAPI
 * 
 * 機能:
 * - eBay売れ筋商品から日本の仕入先を逆引き検索
 * - Amazon Japan / 楽天 / Yahoo!ショッピングで仕入先候補を探索
 * - 価格差・利益率を自動計算
 * - スコアリングしてresearch_repositoryへ保存
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================================
// 型定義
// ============================================================

interface ReverseSearchRequest {
  ebayItemId?: string;
  ebayKeyword?: string;
  title?: string;
  soldPrice?: number;
  jobName?: string;
  searchPlatforms?: ('amazon_jp' | 'rakuten' | 'yahoo')[];
  minMatchScore?: number;
}

interface SupplierMatch {
  platform: 'amazon_jp' | 'rakuten' | 'yahoo';
  itemId: string;
  title: string;
  price: number;
  url: string;
  imageUrl?: string;
  seller?: string;
  availability?: string;
  matchScore: number;
}

// ============================================================
// 定数
// ============================================================

const USD_TO_JPY = 150;

// ============================================================
// タイトル一致度計算
// ============================================================

function calculateTitleMatchScore(title1: string, title2: string): number {
  const normalize = (str: string) => str
    .toLowerCase()
    .replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1);
  
  const words1 = new Set(normalize(title1));
  const words2 = new Set(normalize(title2));
  
  if (words1.size === 0 || words2.size === 0) return 0;
  
  let matchCount = 0;
  words1.forEach(word => {
    if (words2.has(word)) matchCount++;
  });
  
  const matchScore = (matchCount / Math.max(words1.size, words2.size)) * 100;
  return Math.round(matchScore);
}

// ============================================================
// モックデータ生成
// ============================================================

function generateMockSuppliers(
  keyword: string, 
  platform: 'amazon_jp' | 'rakuten' | 'yahoo',
  count: number
): SupplierMatch[] {
  const items: SupplierMatch[] = [];
  const basePrice = 2000 + Math.random() * 5000;
  
  for (let i = 0; i < count; i++) {
    const price = basePrice + (Math.random() - 0.5) * 2000;
    items.push({
      platform,
      itemId: `mock_${platform}_${Date.now()}_${i}`,
      title: `${keyword} - Japanese Item #${i + 1}`,
      price: Math.round(price),
      url: platform === 'amazon_jp' 
        ? `https://amazon.co.jp/dp/MOCK${i}`
        : platform === 'rakuten'
        ? `https://item.rakuten.co.jp/shop/mock${i}`
        : `https://store.shopping.yahoo.co.jp/shop/mock${i}`,
      imageUrl: `https://via.placeholder.com/200?text=${platform}`,
      seller: `${platform}_seller`,
      availability: 'In Stock',
      matchScore: 50 + Math.floor(Math.random() * 40),
    });
  }
  
  return items;
}

// ============================================================
// Amazon Japan 検索
// ============================================================

async function searchAmazonJp(keyword: string): Promise<SupplierMatch[]> {
  const apiKey = process.env.KEEPA_API_KEY;
  
  if (!apiKey) {
    return generateMockSuppliers(keyword, 'amazon_jp', 3);
  }

  try {
    const searchUrl = new URL('https://api.keepa.com/search');
    searchUrl.searchParams.set('key', apiKey);
    searchUrl.searchParams.set('domain', '5');
    searchUrl.searchParams.set('type', 'product');
    searchUrl.searchParams.set('term', keyword);

    const searchResponse = await fetch(searchUrl.toString());
    const searchData = await searchResponse.json();

    if (searchData.error || !searchData.asinList) {
      return [];
    }

    const asins = searchData.asinList.slice(0, 5);
    if (asins.length === 0) return [];

    const detailUrl = new URL('https://api.keepa.com/product');
    detailUrl.searchParams.set('key', apiKey);
    detailUrl.searchParams.set('domain', '5');
    detailUrl.searchParams.set('asin', asins.join(','));

    const detailResponse = await fetch(detailUrl.toString());
    const detailData = await detailResponse.json();

    if (!detailData.products) return [];

    return detailData.products.map((product: any) => {
      let price = 0;
      if (product.csv && product.csv[0]) {
        const priceArray = product.csv[0];
        const latestPrice = priceArray[priceArray.length - 1];
        if (latestPrice > 0) price = latestPrice / 100;
      }

      let imageUrl: string | undefined;
      if (product.imagesCSV) {
        const imageIds = product.imagesCSV.split(',');
        if (imageIds[0]) {
          imageUrl = `https://images-na.ssl-images-amazon.com/images/I/${imageIds[0]}`;
        }
      }

      return {
        platform: 'amazon_jp' as const,
        itemId: product.asin,
        title: product.title || `Product ${product.asin}`,
        price,
        url: `https://amazon.co.jp/dp/${product.asin}`,
        imageUrl,
        seller: 'Amazon Japan',
        availability: price > 0 ? 'In Stock' : 'Unknown',
        matchScore: calculateTitleMatchScore(keyword, product.title || ''),
      };
    }).filter((item: SupplierMatch) => item.price > 0);

  } catch (error) {
    console.error('Amazon JP search error:', error);
    return generateMockSuppliers(keyword, 'amazon_jp', 3);
  }
}

// ============================================================
// 楽天検索
// ============================================================

async function searchRakuten(keyword: string): Promise<SupplierMatch[]> {
  const apiKey = process.env.RAKUTEN_API_KEY;
  
  if (!apiKey) {
    return generateMockSuppliers(keyword, 'rakuten', 3);
  }

  try {
    const url = new URL('https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706');
    url.searchParams.set('applicationId', apiKey);
    url.searchParams.set('keyword', keyword);
    url.searchParams.set('hits', '5');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!data.Items) return [];

    return data.Items.map((item: any) => ({
      platform: 'rakuten' as const,
      itemId: item.Item.itemCode,
      title: item.Item.itemName,
      price: item.Item.itemPrice,
      url: item.Item.itemUrl,
      imageUrl: item.Item.mediumImageUrls?.[0]?.imageUrl,
      seller: item.Item.shopName,
      availability: item.Item.availability ? 'In Stock' : 'Unknown',
      matchScore: calculateTitleMatchScore(keyword, item.Item.itemName),
    }));

  } catch (error) {
    console.error('Rakuten search error:', error);
    return generateMockSuppliers(keyword, 'rakuten', 3);
  }
}

// ============================================================
// Yahoo!ショッピング検索
// ============================================================

async function searchYahoo(keyword: string): Promise<SupplierMatch[]> {
  const appId = process.env.YAHOO_APP_ID;
  
  if (!appId) {
    return generateMockSuppliers(keyword, 'yahoo', 3);
  }

  try {
    const url = new URL('https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch');
    url.searchParams.set('appid', appId);
    url.searchParams.set('query', keyword);
    url.searchParams.set('results', '5');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!data.hits) return [];

    return data.hits.map((item: any) => ({
      platform: 'yahoo' as const,
      itemId: item.code,
      title: item.name,
      price: item.price,
      url: item.url,
      imageUrl: item.image?.medium,
      seller: item.seller?.name,
      availability: item.availability ? 'In Stock' : 'Unknown',
      matchScore: calculateTitleMatchScore(keyword, item.name),
    }));

  } catch (error) {
    console.error('Yahoo search error:', error);
    return generateMockSuppliers(keyword, 'yahoo', 3);
  }
}

// ============================================================
// スコアリング
// ============================================================

function calculateScores(supplierPrice: number, soldPriceUsd: number, matchScore: number) {
  const costUsd = supplierPrice / USD_TO_JPY;
  const shippingCostUsd = 15;
  const ebayFee = soldPriceUsd * 0.13;
  const profitUsd = soldPriceUsd - costUsd - shippingCostUsd - ebayFee;
  const profitMargin = soldPriceUsd > 0 ? (profitUsd / soldPriceUsd) * 100 : 0;

  let profit_score = 0;
  if (profitMargin >= 50) profit_score = 100;
  else if (profitMargin >= 40) profit_score = 90;
  else if (profitMargin >= 30) profit_score = 80;
  else if (profitMargin >= 25) profit_score = 70;
  else if (profitMargin >= 20) profit_score = 60;
  else if (profitMargin >= 15) profit_score = 50;
  else profit_score = 30;

  let sales_score = matchScore;

  let risk_score = 20;
  if (soldPriceUsd > 300) risk_score += 15;
  if (profitMargin < 15) risk_score += 15;
  if (matchScore < 50) risk_score += 15;
  risk_score = Math.min(100, risk_score);

  let risk_level: 'low' | 'medium' | 'high' = 'low';
  if (risk_score >= 60) risk_level = 'high';
  else if (risk_score >= 40) risk_level = 'medium';

  const total_score = Math.round(
    profit_score * 0.5 +
    sales_score * 0.3 +
    (100 - risk_score) * 0.2
  );

  return {
    total_score,
    profit_score,
    sales_score,
    risk_score,
    risk_level,
    profit_margin: Math.round(profitMargin * 10) / 10,
    estimated_profit_usd: Math.round(profitUsd * 100) / 100,
  };
}

// ============================================================
// メインハンドラー
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: ReverseSearchRequest = await request.json();
    const {
      title,
      soldPrice = 100,
      jobName = 'Reverse Research',
      searchPlatforms = ['amazon_jp'],
      minMatchScore = 30,
    } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: '商品タイトルが必要です' },
        { status: 400 }
      );
    }

    const keyword = title.trim();
    const supabase = await createClient();

    // 各プラットフォームで検索
    const allSuppliers: SupplierMatch[] = [];
    const apiStatus: Record<string, string> = {};

    for (const platform of searchPlatforms) {
      let suppliers: SupplierMatch[] = [];
      
      switch (platform) {
        case 'amazon_jp':
          suppliers = await searchAmazonJp(keyword);
          apiStatus.amazon_jp = process.env.KEEPA_API_KEY ? 'keepa' : 'mock';
          break;
        case 'rakuten':
          suppliers = await searchRakuten(keyword);
          apiStatus.rakuten = process.env.RAKUTEN_API_KEY ? 'api' : 'mock';
          break;
        case 'yahoo':
          suppliers = await searchYahoo(keyword);
          apiStatus.yahoo = process.env.YAHOO_APP_ID ? 'api' : 'mock';
          break;
      }
      
      allSuppliers.push(...suppliers);
    }

    // 一致度でフィルター
    const filteredSuppliers = allSuppliers.filter(s => s.matchScore >= minMatchScore);

    if (filteredSuppliers.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: '一致する仕入先が見つかりませんでした',
        searchedPlatforms: searchPlatforms,
        apiStatus,
      });
    }

    // スコアリングして最適な仕入先を選択
    const scoredSuppliers = filteredSuppliers.map(supplier => {
      const scores = calculateScores(supplier.price, soldPrice, supplier.matchScore);
      return { ...supplier, ...scores };
    });

    // スコア順ソート
    scoredSuppliers.sort((a, b) => b.total_score - a.total_score);

    const bestMatch = scoredSuppliers[0];

    // research_repositoryに保存
    const researchItems = scoredSuppliers.slice(0, 5).map((supplier, index) => ({
      source: `reverse_${supplier.platform}`,
      source_url: supplier.url,
      asin: supplier.platform === 'amazon_jp' ? supplier.itemId : null,
      
      title: supplier.title,
      english_title: title,
      image_url: supplier.imageUrl,
      
      sold_price_usd: soldPrice,
      supplier_price_jpy: supplier.price,
      estimated_profit_usd: supplier.estimated_profit_usd,
      profit_margin: supplier.profit_margin,
      
      total_score: supplier.total_score,
      profit_score: supplier.profit_score,
      sales_score: supplier.sales_score,
      risk_score: supplier.risk_score,
      risk_level: supplier.risk_level,
      
      supplier_source: supplier.platform,
      supplier_url: supplier.url,
      supplier_name: supplier.seller,
      
      status: 'new',
      karitori_status: 'none',
      
      raw_data: JSON.stringify({
        job_name: jobName,
        original_title: title,
        match_score: supplier.matchScore,
        platform: supplier.platform,
        fetchedAt: new Date().toISOString(),
      }),
      
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // 重複チェック
    const supplierUrls = researchItems.map(item => item.supplier_url);
    const { data: existing } = await supabase
      .from('research_repository')
      .select('supplier_url')
      .in('supplier_url', supplierUrls);

    const existingUrls = new Set((existing || []).map(e => e.supplier_url));
    const newItems = researchItems.filter(item => !existingUrls.has(item.supplier_url));

    if (newItems.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        skipped: researchItems.length,
        message: 'すべての仕入先は既に登録済みです',
        bestMatch,
        apiStatus,
      });
    }

    // DB挿入
    const { data: inserted, error: insertError } = await supabase
      .from('research_repository')
      .insert(newItems)
      .select('id, title, total_score');

    if (insertError) {
      throw new Error(`DB挿入エラー: ${insertError.message}`);
    }

    return NextResponse.json({
      success: true,
      count: inserted?.length || 0,
      skipped: existingUrls.size,
      bestMatch,
      suppliers: scoredSuppliers.slice(0, 10),
      apiStatus,
    });

  } catch (error: any) {
    console.error('Reverse search error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    api: 'reverse-search',
    keepaConfigured: !!process.env.KEEPA_API_KEY,
    rakutenConfigured: !!process.env.RAKUTEN_API_KEY,
    yahooConfigured: !!process.env.YAHOO_APP_ID,
    supportedPlatforms: ['amazon_jp', 'rakuten', 'yahoo'],
  });
}
