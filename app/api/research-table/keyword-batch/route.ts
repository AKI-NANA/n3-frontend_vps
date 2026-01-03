// app/api/research-table/keyword-batch/route.ts
/**
 * キーワードバッチリサーチAPI
 * 
 * 機能:
 * - キーワードリストからeBay/Amazon商品を一括検索
 * - 複数キーワードを並列処理
 * - スコアリングしてresearch_repositoryへ保存
 * 
 * 必要な環境変数:
 * - EBAY_CLIENT_ID
 * - EBAY_CLIENT_SECRET
 * - KEEPA_API_KEY（オプション）
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================================
// 型定義
// ============================================================

interface KeywordBatchRequest {
  keywords: string[];
  jobName?: string;
  minProfitMargin?: number;
  searchPlatform?: 'ebay' | 'amazon' | 'both';
  itemsPerKeyword?: number;
  minPrice?: number;
  maxPrice?: number;
}

interface SearchItem {
  itemId: string;
  title: string;
  price: number;
  currency: string;
  imageUrl?: string;
  source: 'ebay' | 'amazon';
  sourceUrl: string;
  seller?: { username: string; feedbackPercentage?: number };
  category?: string;
  condition?: string;
  location?: string;
  keyword: string;
}

interface KeywordStats {
  keyword: string;
  itemCount: number;
  avgPrice: number;
  avgScore: number;
  platform: string;
}

// ============================================================
// 定数
// ============================================================

const USD_TO_JPY = 150;
const DEFAULT_ITEMS_PER_KEYWORD = 20;

// ============================================================
// eBay API 検索
// ============================================================

async function searchEbayByKeyword(
  keyword: string, 
  limit: number,
  minPrice?: number,
  maxPrice?: number
): Promise<SearchItem[]> {
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    return generateMockItems(keyword, limit, 'ebay');
  }

  try {
    // OAuth Token取得
    const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get eBay token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Browse API検索
    const searchUrl = new URL('https://api.ebay.com/buy/browse/v1/item_summary/search');
    searchUrl.searchParams.set('q', keyword);
    searchUrl.searchParams.set('limit', String(limit));
    
    // 価格フィルター
    let filters = ['buyingOptions:{FIXED_PRICE}'];
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter = `price:[${minPrice || ''}..${maxPrice || ''}],priceCurrency:USD`;
      filters.push(priceFilter);
    }
    // 日本からの出品をフィルター（オプション）
    filters.push('itemLocationCountry:JP');
    
    searchUrl.searchParams.set('filter', filters.join(','));

    const searchResponse = await fetch(searchUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      },
    });

    if (!searchResponse.ok) {
      throw new Error('eBay search failed');
    }

    const searchData = await searchResponse.json();
    const items = searchData.itemSummaries || [];

    return items.map((item: any) => ({
      itemId: item.itemId,
      title: item.title,
      price: parseFloat(item.price?.value || '0'),
      currency: item.price?.currency || 'USD',
      imageUrl: item.image?.imageUrl || item.thumbnailImages?.[0]?.imageUrl,
      source: 'ebay' as const,
      sourceUrl: item.itemWebUrl || `https://www.ebay.com/itm/${item.itemId}`,
      seller: item.seller ? {
        username: item.seller.username,
        feedbackPercentage: parseFloat(item.seller.feedbackPercentage || '98'),
      } : undefined,
      category: item.categories?.[0]?.categoryName,
      condition: item.condition,
      location: item.itemLocation?.country,
      keyword,
    }));

  } catch (error) {
    console.error(`eBay search error for "${keyword}":`, error);
    return generateMockItems(keyword, limit, 'ebay');
  }
}

// ============================================================
// Amazon API 検索 (Keepa)
// ============================================================

async function searchAmazonByKeyword(
  keyword: string,
  limit: number
): Promise<SearchItem[]> {
  const apiKey = process.env.KEEPA_API_KEY;
  
  if (!apiKey) {
    return generateMockItems(keyword, limit, 'amazon');
  }

  try {
    // Keepa Product Search API
    const url = new URL('https://api.keepa.com/search');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('domain', '5'); // Amazon Japan
    url.searchParams.set('type', 'product');
    url.searchParams.set('term', keyword);
    url.searchParams.set('page', '0');

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error('Keepa search failed');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const asins = (data.asinList || []).slice(0, limit);
    
    if (asins.length === 0) {
      return [];
    }

    // 商品詳細を取得
    const detailUrl = new URL('https://api.keepa.com/product');
    detailUrl.searchParams.set('key', apiKey);
    detailUrl.searchParams.set('domain', '5');
    detailUrl.searchParams.set('asin', asins.join(','));

    const detailResponse = await fetch(detailUrl.toString());
    const detailData = await detailResponse.json();

    if (!detailData.products) {
      return [];
    }

    return detailData.products.map((product: any) => {
      // Keepa価格を変換
      let price = 0;
      if (product.csv && product.csv[0]) {
        const priceArray = product.csv[0];
        const latestPrice = priceArray[priceArray.length - 1];
        if (latestPrice > 0) {
          price = latestPrice / 100;
        }
      }

      let imageUrl: string | undefined;
      if (product.imagesCSV) {
        const imageIds = product.imagesCSV.split(',');
        if (imageIds[0]) {
          imageUrl = `https://images-na.ssl-images-amazon.com/images/I/${imageIds[0]}`;
        }
      }

      return {
        itemId: product.asin,
        title: product.title || `Product ${product.asin}`,
        price,
        currency: 'JPY',
        imageUrl,
        source: 'amazon' as const,
        sourceUrl: `https://amazon.co.jp/dp/${product.asin}`,
        category: product.categoryTree?.[0]?.name,
        condition: 'New',
        location: 'JP',
        keyword,
      };
    });

  } catch (error) {
    console.error(`Amazon search error for "${keyword}":`, error);
    return generateMockItems(keyword, limit, 'amazon');
  }
}

// ============================================================
// モックデータ生成
// ============================================================

function generateMockItems(keyword: string, count: number, source: 'ebay' | 'amazon'): SearchItem[] {
  const items: SearchItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const price = source === 'ebay' 
      ? 30 + Math.random() * 200 
      : 2000 + Math.random() * 8000;
    
    items.push({
      itemId: `mock_${source}_${keyword.replace(/\s+/g, '_')}_${Date.now()}_${i}`,
      title: `${keyword} - Vintage Japanese Item #${i + 1}`,
      price,
      currency: source === 'ebay' ? 'USD' : 'JPY',
      imageUrl: `https://via.placeholder.com/200?text=${encodeURIComponent(keyword)}`,
      source,
      sourceUrl: source === 'ebay' 
        ? `https://www.ebay.com/itm/mock_${i}`
        : `https://amazon.co.jp/dp/MOCK${i}`,
      seller: source === 'ebay' ? {
        username: `seller_${i}`,
        feedbackPercentage: 95 + Math.random() * 5,
      } : undefined,
      category: 'Collectibles',
      condition: Math.random() > 0.3 ? 'Used' : 'New',
      location: 'JP',
      keyword,
    });
  }
  
  return items;
}

// ============================================================
// スコアリング
// ============================================================

function calculateScores(item: SearchItem) {
  let priceUsd: number;
  let supplierPriceJpy: number;
  
  if (item.source === 'ebay') {
    priceUsd = item.price;
    supplierPriceJpy = priceUsd * 0.35 * USD_TO_JPY; // 推定仕入れ価格
  } else {
    supplierPriceJpy = item.price;
    priceUsd = (supplierPriceJpy / USD_TO_JPY) * 2; // 推定販売価格
  }
  
  const costUsd = supplierPriceJpy / USD_TO_JPY;
  const shippingCostUsd = 15;
  const ebayFee = priceUsd * 0.13;
  const profitUsd = priceUsd - costUsd - shippingCostUsd - ebayFee;
  const profitMargin = priceUsd > 0 ? (profitUsd / priceUsd) * 100 : 0;

  // 利益スコア
  let profit_score = 0;
  if (profitMargin >= 50) profit_score = 100;
  else if (profitMargin >= 40) profit_score = 90;
  else if (profitMargin >= 30) profit_score = 80;
  else if (profitMargin >= 25) profit_score = 70;
  else if (profitMargin >= 20) profit_score = 60;
  else if (profitMargin >= 15) profit_score = 50;
  else profit_score = 30;

  // 販売スコア
  let sales_score = 60;
  if (item.seller?.feedbackPercentage) {
    if (item.seller.feedbackPercentage >= 99) sales_score = 90;
    else if (item.seller.feedbackPercentage >= 98) sales_score = 80;
    else if (item.seller.feedbackPercentage >= 95) sales_score = 70;
  }

  // リスクスコア
  let risk_score = 20;
  if (priceUsd > 300) risk_score += 15;
  if (profitMargin < 15) risk_score += 15;
  risk_score = Math.min(100, risk_score);

  // リスクレベル
  let risk_level: 'low' | 'medium' | 'high' = 'low';
  if (risk_score >= 60) risk_level = 'high';
  else if (risk_score >= 40) risk_level = 'medium';

  // 総合スコア
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
    sold_price_usd: Math.round(priceUsd * 100) / 100,
    supplier_price_jpy: Math.round(supplierPriceJpy),
  };
}

// ============================================================
// メインハンドラー
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: KeywordBatchRequest = await request.json();
    const {
      keywords,
      jobName = 'Keyword Batch Research',
      minProfitMargin = 15,
      searchPlatform = 'ebay',
      itemsPerKeyword = DEFAULT_ITEMS_PER_KEYWORD,
      minPrice,
      maxPrice,
    } = body;

    // バリデーション
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { success: false, error: 'キーワードリストが必要です' },
        { status: 400 }
      );
    }

    if (keywords.length > 20) {
      return NextResponse.json(
        { success: false, error: '一度に処理できるキーワードは20件までです' },
        { status: 400 }
      );
    }

    // 重複除去 & 正規化
    const uniqueKeywords = [...new Set(keywords.map(k => k.trim().toLowerCase()))].filter(k => k.length > 0);
    
    const supabase = await createClient();
    const hasEbayApi = !!(process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET);
    const hasKeepaApi = !!process.env.KEEPA_API_KEY;

    // 全キーワードを検索
    const allItems: SearchItem[] = [];
    const keywordStats: KeywordStats[] = [];

    for (const keyword of uniqueKeywords) {
      let items: SearchItem[] = [];
      
      if (searchPlatform === 'ebay' || searchPlatform === 'both') {
        const ebayItems = await searchEbayByKeyword(keyword, itemsPerKeyword, minPrice, maxPrice);
        items.push(...ebayItems);
      }
      
      if (searchPlatform === 'amazon' || searchPlatform === 'both') {
        const amazonItems = await searchAmazonByKeyword(keyword, itemsPerKeyword);
        items.push(...amazonItems);
      }

      allItems.push(...items);

      // キーワード統計
      if (items.length > 0) {
        const avgPrice = items.reduce((sum, item) => {
          const priceUsd = item.currency === 'USD' ? item.price : item.price / USD_TO_JPY;
          return sum + priceUsd;
        }, 0) / items.length;

        keywordStats.push({
          keyword,
          itemCount: items.length,
          avgPrice: Math.round(avgPrice * 100) / 100,
          avgScore: 0, // 後で計算
          platform: searchPlatform,
        });
      }

      // レート制限対策
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    if (allItems.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: '検索結果がありませんでした',
        keywordStats,
        apiMode: {
          ebay: hasEbayApi ? 'api' : 'mock',
          amazon: hasKeepaApi ? 'keepa' : 'mock',
        },
      });
    }

    // 既存アイテムチェック
    const itemIds = allItems.map(item => item.itemId);
    const { data: existingEbay } = await supabase
      .from('research_repository')
      .select('ebay_item_id')
      .in('ebay_item_id', itemIds.filter(id => !id.startsWith('MOCK')));
    
    const { data: existingAsin } = await supabase
      .from('research_repository')
      .select('asin')
      .in('asin', itemIds.filter(id => id.startsWith('B0') || id.length === 10));

    const existingIds = new Set([
      ...(existingEbay || []).map(e => e.ebay_item_id),
      ...(existingAsin || []).map(e => e.asin),
    ]);

    const newItems = allItems.filter(item => !existingIds.has(item.itemId));

    if (newItems.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        skipped: allItems.length,
        message: 'すべてのアイテムは既に登録済みです',
        keywordStats,
        apiMode: {
          ebay: hasEbayApi ? 'api' : 'mock',
          amazon: hasKeepaApi ? 'keepa' : 'mock',
        },
      });
    }

    // リサーチアイテム作成
    const researchItems = newItems.map(item => {
      const scores = calculateScores(item);

      return {
        source: `keyword_${item.source}`,
        source_url: item.sourceUrl,
        ebay_item_id: item.source === 'ebay' ? item.itemId : null,
        asin: item.source === 'amazon' ? item.itemId : null,
        
        title: item.title,
        english_title: item.title,
        image_url: item.imageUrl,
        category_name: item.category,
        condition_name: item.condition,
        
        sold_price_usd: scores.sold_price_usd,
        supplier_price_jpy: scores.supplier_price_jpy,
        estimated_profit_usd: scores.estimated_profit_usd,
        profit_margin: scores.profit_margin,
        
        total_score: scores.total_score,
        profit_score: scores.profit_score,
        sales_score: scores.sales_score,
        risk_score: scores.risk_score,
        risk_level: scores.risk_level,
        
        seller_id: item.seller?.username,
        seller_feedback_percentage: item.seller?.feedbackPercentage,
        
        status: 'new',
        karitori_status: 'none',
        origin_country: item.location || 'JP',
        
        raw_data: JSON.stringify({
          job_name: jobName,
          keyword: item.keyword,
          platform: item.source,
          seller: item.seller,
          fetchedAt: new Date().toISOString(),
        }),
        
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    // フィルタリング
    const filteredItems = researchItems.filter(
      item => item.profit_margin >= minProfitMargin
    );

    if (filteredItems.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        processed: researchItems.length,
        filtered: researchItems.length,
        message: `利益率${minProfitMargin}%以上の商品がありませんでした`,
        keywordStats,
        apiMode: {
          ebay: hasEbayApi ? 'api' : 'mock',
          amazon: hasKeepaApi ? 'keepa' : 'mock',
        },
      });
    }

    // スコア順ソート
    filteredItems.sort((a, b) => b.total_score - a.total_score);

    // DB挿入
    const { data: inserted, error: insertError } = await supabase
      .from('research_repository')
      .insert(filteredItems)
      .select('id, title, total_score');

    if (insertError) {
      throw new Error(`DB挿入エラー: ${insertError.message}`);
    }

    // キーワード統計を更新
    for (const stat of keywordStats) {
      const kwItems = filteredItems.filter(item => {
        const rawData = JSON.parse(item.raw_data || '{}');
        return rawData.keyword === stat.keyword;
      });
      if (kwItems.length > 0) {
        stat.avgScore = Math.round(
          kwItems.reduce((sum, item) => sum + item.total_score, 0) / kwItems.length
        );
      }
    }

    return NextResponse.json({
      success: true,
      count: inserted?.length || 0,
      skipped: existingIds.size,
      filtered: researchItems.length - filteredItems.length,
      keywordStats,
      stats: {
        avgScore: Math.round(filteredItems.reduce((s, i) => s + i.total_score, 0) / filteredItems.length),
        avgProfitMargin: Math.round(filteredItems.reduce((s, i) => s + i.profit_margin, 0) / filteredItems.length * 10) / 10,
        highScoreCount: filteredItems.filter(i => i.total_score >= 70).length,
      },
      apiMode: {
        ebay: hasEbayApi ? 'api' : 'mock',
        amazon: hasKeepaApi ? 'keepa' : 'mock',
      },
    });

  } catch (error: any) {
    console.error('Keyword batch error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const hasEbayApi = !!(process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET);
  const hasKeepaApi = !!process.env.KEEPA_API_KEY;
  
  return NextResponse.json({
    status: 'ok',
    api: 'keyword-batch',
    ebayConfigured: hasEbayApi,
    keepaConfigured: hasKeepaApi,
    limits: {
      maxKeywordsPerRequest: 20,
      defaultItemsPerKeyword: DEFAULT_ITEMS_PER_KEYWORD,
      defaultMinProfitMargin: 15,
    },
    platforms: ['ebay', 'amazon', 'both'],
  });
}
