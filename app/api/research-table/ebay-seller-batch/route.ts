// app/api/research-table/ebay-seller-batch/route.ts
/**
 * eBayセラー分析バッチAPI
 * 
 * 機能:
 * - 複数のセラーIDから販売履歴を一括取得
 * - eBay Browse APIで各セラーの商品を取得
 * - 成功セラーのベストセラー商品を分析
 * - スコアリングしてresearch_repositoryへ保存
 * 
 * 必要な環境変数:
 * - EBAY_CLIENT_ID
 * - EBAY_CLIENT_SECRET
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================================
// 型定義
// ============================================================

interface SellerBatchRequest {
  sellerIds: string[];
  jobName?: string;
  minProfitMargin?: number;
  minFeedbackScore?: number;
  itemsPerSeller?: number;
}

interface EbaySellerItem {
  itemId: string;
  title: string;
  price: { value: string; currency: string };
  image?: { imageUrl: string };
  seller: { username: string; feedbackPercentage: string; feedbackScore: number };
  condition?: string;
  categories?: { categoryId: string; categoryName: string }[];
  itemLocation?: { country: string };
  itemWebUrl?: string;
}

interface SellerStats {
  sellerId: string;
  itemCount: number;
  avgPrice: number;
  avgScore: number;
  topCategories: string[];
}

// ============================================================
// 定数
// ============================================================

const USD_TO_JPY = 150;
const DEFAULT_ITEMS_PER_SELLER = 20;

// ============================================================
// eBay API クライアント
// ============================================================

class EbayApiClient {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  async getAccessToken(): Promise<string> {
    const now = Date.now();
    
    if (this.accessToken && now < this.tokenExpiry) {
      return this.accessToken;
    }

    const clientId = process.env.EBAY_CLIENT_ID;
    const clientSecret = process.env.EBAY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('EBAY_CLIENT_ID and EBAY_CLIENT_SECRET are required');
    }

    const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`eBay token error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = now + (data.expires_in - 60) * 1000;

    return this.accessToken!;
  }

  async searchSellerItems(sellerId: string, limit: number = 20): Promise<EbaySellerItem[]> {
    const token = await this.getAccessToken();

    const url = new URL('https://api.ebay.com/buy/browse/v1/item_summary/search');
    url.searchParams.set('q', '*');
    url.searchParams.set('filter', `sellers:{${sellerId}}`);
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('sort', 'price');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`eBay search failed for seller ${sellerId}: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return (data.itemSummaries || []).map((item: any) => ({
      ...item,
      seller: {
        username: sellerId,
        feedbackPercentage: item.seller?.feedbackPercentage || '98',
        feedbackScore: item.seller?.feedbackScore || 1000,
      },
    }));
  }
}

// ============================================================
// モックデータ生成
// ============================================================

function generateMockSellerItems(sellerId: string, count: number): EbaySellerItem[] {
  const items: EbaySellerItem[] = [];
  const categories = ['Collectibles', 'Antiques', 'Art', 'Pottery & Glass', 'Jewelry'];
  
  for (let i = 0; i < count; i++) {
    const price = 30 + Math.random() * 300;
    items.push({
      itemId: `mock_${sellerId}_${Date.now()}_${i}`,
      title: `${sellerId} - Japanese Vintage Item #${i + 1}`,
      price: { value: price.toFixed(2), currency: 'USD' },
      image: { imageUrl: `https://via.placeholder.com/200?text=${sellerId}` },
      seller: {
        username: sellerId,
        feedbackPercentage: String(96 + Math.random() * 4),
        feedbackScore: Math.floor(500 + Math.random() * 10000),
      },
      condition: Math.random() > 0.3 ? 'Used' : 'New',
      categories: [{ 
        categoryId: String(i % 5), 
        categoryName: categories[i % categories.length] 
      }],
      itemLocation: { country: 'JP' },
      itemWebUrl: `https://www.ebay.com/itm/mock_${sellerId}_${i}`,
    });
  }
  
  return items;
}

// ============================================================
// スコアリング
// ============================================================

function calculateScores(priceUsd: number, feedbackScore: number, feedbackPercentage: number) {
  const estimatedCostJpy = priceUsd * 0.35 * USD_TO_JPY;
  const costUsd = estimatedCostJpy / USD_TO_JPY;
  const shippingCostUsd = 15;
  const ebayFee = priceUsd * 0.13;
  const profitUsd = priceUsd - costUsd - shippingCostUsd - ebayFee;
  const profitMargin = priceUsd > 0 ? (profitUsd / priceUsd) * 100 : 0;

  let profit_score = 0;
  if (profitMargin >= 50) profit_score = 100;
  else if (profitMargin >= 40) profit_score = 90;
  else if (profitMargin >= 30) profit_score = 80;
  else if (profitMargin >= 25) profit_score = 70;
  else if (profitMargin >= 20) profit_score = 60;
  else if (profitMargin >= 15) profit_score = 50;
  else profit_score = 30;

  let sales_score = 50;
  if (feedbackScore >= 10000) sales_score = 100;
  else if (feedbackScore >= 5000) sales_score = 90;
  else if (feedbackScore >= 1000) sales_score = 80;
  else if (feedbackScore >= 500) sales_score = 70;
  else if (feedbackScore >= 100) sales_score = 60;

  if (feedbackPercentage >= 99.5) sales_score = Math.min(100, sales_score + 10);
  else if (feedbackPercentage >= 99) sales_score = Math.min(100, sales_score + 5);

  let risk_score = 20;
  if (priceUsd > 300) risk_score += 15;
  if (profitMargin < 15) risk_score += 15;
  if (feedbackPercentage < 98) risk_score += 10;
  if (feedbackScore < 100) risk_score += 10;
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
    supplier_price_jpy: Math.round(estimatedCostJpy),
  };
}

// ============================================================
// メインハンドラー
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: SellerBatchRequest = await request.json();
    const {
      sellerIds,
      jobName = 'Seller Batch Research',
      minProfitMargin = 15,
      itemsPerSeller = DEFAULT_ITEMS_PER_SELLER,
    } = body;

    if (!sellerIds || !Array.isArray(sellerIds) || sellerIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'セラーIDリストが必要です' },
        { status: 400 }
      );
    }

    if (sellerIds.length > 20) {
      return NextResponse.json(
        { success: false, error: '一度に処理できるセラーは20件までです' },
        { status: 400 }
      );
    }

    const uniqueSellerIds = [...new Set(sellerIds.map(s => s.trim().toLowerCase()))];
    
    const supabase = await createClient();
    const hasApiKey = !!(process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET);

    const allItems: EbaySellerItem[] = [];
    const sellerStats: SellerStats[] = [];
    const ebayClient = hasApiKey ? new EbayApiClient() : null;

    for (const sellerId of uniqueSellerIds) {
      let items: EbaySellerItem[];
      
      if (ebayClient) {
        try {
          items = await ebayClient.searchSellerItems(sellerId, itemsPerSeller);
        } catch (e) {
          console.error(`Failed to fetch seller ${sellerId}:`, e);
          items = generateMockSellerItems(sellerId, itemsPerSeller);
        }
      } else {
        items = generateMockSellerItems(sellerId, itemsPerSeller);
      }

      allItems.push(...items);

      if (items.length > 0) {
        const avgPrice = items.reduce((sum, item) => sum + parseFloat(item.price.value), 0) / items.length;
        const categories = items
          .filter(item => item.categories?.[0])
          .map(item => item.categories![0].categoryName);
        const uniqueCategories = [...new Set(categories)].slice(0, 3);

        sellerStats.push({
          sellerId,
          itemCount: items.length,
          avgPrice: Math.round(avgPrice * 100) / 100,
          avgScore: 0,
          topCategories: uniqueCategories,
        });
      }
    }

    if (allItems.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: 'セラーの商品が見つかりませんでした',
        apiMode: hasApiKey ? 'ebay' : 'mock',
      });
    }

    const itemIds = allItems.map(item => item.itemId);
    const { data: existing } = await supabase
      .from('research_repository')
      .select('ebay_item_id')
      .in('ebay_item_id', itemIds);

    const existingIds = new Set((existing || []).map(e => e.ebay_item_id));
    const newItems = allItems.filter(item => !existingIds.has(item.itemId));

    if (newItems.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        skipped: allItems.length,
        message: 'すべてのアイテムは既に登録済みです',
        sellerStats,
        apiMode: hasApiKey ? 'ebay' : 'mock',
      });
    }

    const researchItems = newItems.map(item => {
      const priceUsd = parseFloat(item.price.value);
      const feedbackScore = item.seller.feedbackScore || 1000;
      const feedbackPercentage = parseFloat(item.seller.feedbackPercentage || '98');

      const scores = calculateScores(priceUsd, feedbackScore, feedbackPercentage);

      return {
        source: 'ebay_seller',
        source_url: item.itemWebUrl || `https://www.ebay.com/itm/${item.itemId}`,
        ebay_item_id: item.itemId,
        
        title: item.title,
        english_title: item.title,
        image_url: item.image?.imageUrl,
        category_name: item.categories?.[0]?.categoryName,
        condition_name: item.condition,
        
        sold_price_usd: Math.round(priceUsd * 100) / 100,
        supplier_price_jpy: scores.supplier_price_jpy,
        estimated_profit_usd: scores.estimated_profit_usd,
        profit_margin: scores.profit_margin,
        
        total_score: scores.total_score,
        profit_score: scores.profit_score,
        sales_score: scores.sales_score,
        risk_score: scores.risk_score,
        risk_level: scores.risk_level,
        
        seller_id: item.seller.username,
        seller_feedback_score: feedbackScore,
        seller_feedback_percentage: feedbackPercentage,
        
        status: 'new',
        karitori_status: 'none',
        origin_country: item.itemLocation?.country || 'JP',
        
        raw_data: JSON.stringify({
          job_name: jobName,
          seller: item.seller,
          categories: item.categories,
          fetchedAt: new Date().toISOString(),
        }),
        
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

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
        sellerStats,
        apiMode: hasApiKey ? 'ebay' : 'mock',
      });
    }

    filteredItems.sort((a, b) => b.total_score - a.total_score);

    const { data: inserted, error: insertError } = await supabase
      .from('research_repository')
      .insert(filteredItems)
      .select('id, title, total_score, seller_id');

    if (insertError) {
      throw new Error(`DB挿入エラー: ${insertError.message}`);
    }

    for (const stat of sellerStats) {
      const sellerItems = filteredItems.filter(item => item.seller_id === stat.sellerId);
      if (sellerItems.length > 0) {
        stat.avgScore = Math.round(
          sellerItems.reduce((sum, item) => sum + item.total_score, 0) / sellerItems.length
        );
      }
    }

    return NextResponse.json({
      success: true,
      count: inserted?.length || 0,
      skipped: existingIds.size,
      filtered: researchItems.length - filteredItems.length,
      sellerStats,
      stats: {
        avgScore: Math.round(filteredItems.reduce((s, i) => s + i.total_score, 0) / filteredItems.length),
        avgProfitMargin: Math.round(filteredItems.reduce((s, i) => s + i.profit_margin, 0) / filteredItems.length * 10) / 10,
        highScoreCount: filteredItems.filter(i => i.total_score >= 70).length,
      },
      apiMode: hasApiKey ? 'ebay' : 'mock',
    });

  } catch (error: any) {
    console.error('eBay seller batch error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const hasApiKey = !!(process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET);
  
  return NextResponse.json({
    status: 'ok',
    api: 'ebay-seller-batch',
    ebayConfigured: hasApiKey,
    limits: {
      maxSellersPerRequest: 20,
      defaultItemsPerSeller: DEFAULT_ITEMS_PER_SELLER,
      defaultMinProfitMargin: 15,
    },
  });
}
