// app/api/research-table/product-search/route.ts
/**
 * 単品商品リサーチAPI
 * 
 * 機能:
 * - ASIN/eBay Item ID/URLから商品詳細を取得
 * - Keepa API/eBay APIで詳細データ取得
 * - 競合分析・価格履歴取得
 * - スコアリングしてresearch_repositoryへ保存
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================================
// 型定義
// ============================================================

interface ProductSearchRequest {
  query: string;  // ASIN, eBay Item ID, または URL
  saveToRepository?: boolean;
  estimatedSellingPrice?: number;
}

interface ProductDetail {
  id: string;
  source: 'amazon' | 'ebay';
  title: string;
  price: number;
  currency: string;
  imageUrl?: string;
  images?: string[];
  category?: string;
  brand?: string;
  condition?: string;
  description?: string;
  bsr?: number;
  reviewCount?: number;
  rating?: number;
  seller?: {
    name: string;
    feedbackScore?: number;
    feedbackPercentage?: number;
  };
  priceHistory?: {
    current: number;
    avg30?: number;
    avg90?: number;
    min30?: number;
    max30?: number;
  };
  specifications?: Record<string, string>;
}

// ============================================================
// 定数
// ============================================================

const USD_TO_JPY = 150;

// ============================================================
// URL/IDパーサー
// ============================================================

function parseQuery(query: string): { type: 'asin' | 'ebay_item' | 'unknown'; value: string } {
  const trimmed = query.trim();
  
  // ASIN形式（10桁英数字、B0で始まる）
  if (/^B0[A-Z0-9]{8}$/i.test(trimmed)) {
    return { type: 'asin', value: trimmed.toUpperCase() };
  }
  
  // Amazon URL
  const amazonMatch = trimmed.match(/amazon\.[a-z.]+\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  if (amazonMatch) {
    return { type: 'asin', value: amazonMatch[1].toUpperCase() };
  }
  
  // eBay Item ID（数字のみ、12-15桁）
  if (/^\d{12,15}$/.test(trimmed)) {
    return { type: 'ebay_item', value: trimmed };
  }
  
  // eBay URL
  const ebayMatch = trimmed.match(/ebay\.com\/itm\/(\d{12,15})/);
  if (ebayMatch) {
    return { type: 'ebay_item', value: ebayMatch[1] };
  }
  
  // eBay URL (別形式)
  const ebayMatch2 = trimmed.match(/ebay\.com\/itm\/[^\/]+\/(\d{12,15})/);
  if (ebayMatch2) {
    return { type: 'ebay_item', value: ebayMatch2[1] };
  }
  
  return { type: 'unknown', value: trimmed };
}

// ============================================================
// Keepa API 商品取得
// ============================================================

async function fetchAmazonProduct(asin: string): Promise<ProductDetail | null> {
  const apiKey = process.env.KEEPA_API_KEY;
  
  if (!apiKey) {
    // モックデータ
    return {
      id: asin,
      source: 'amazon',
      title: `Japanese Product - ${asin}`,
      price: 3000 + Math.random() * 7000,
      currency: 'JPY',
      imageUrl: `https://via.placeholder.com/400?text=${asin}`,
      category: 'Collectibles',
      brand: 'Traditional',
      condition: 'New',
      bsr: Math.floor(Math.random() * 50000) + 1000,
      reviewCount: Math.floor(Math.random() * 100),
      rating: 3.5 + Math.random() * 1.5,
      priceHistory: {
        current: 3000 + Math.random() * 7000,
        avg30: 3500 + Math.random() * 6000,
        avg90: 3800 + Math.random() * 5500,
      },
    };
  }

  try {
    const url = new URL('https://api.keepa.com/product');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('domain', '5'); // Amazon Japan
    url.searchParams.set('asin', asin);
    url.searchParams.set('stats', '180');
    url.searchParams.set('history', '1');
    url.searchParams.set('rating', '1');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.error || !data.products || data.products.length === 0) {
      return null;
    }

    const product = data.products[0];
    
    // 価格取得
    let price = 0;
    if (product.csv && product.csv[0]) {
      const priceArray = product.csv[0];
      const latestPrice = priceArray[priceArray.length - 1];
      if (latestPrice > 0) price = latestPrice / 100;
    }

    // 画像URL
    let imageUrl: string | undefined;
    const images: string[] = [];
    if (product.imagesCSV) {
      const imageIds = product.imagesCSV.split(',');
      imageIds.forEach((id: string) => {
        if (id) {
          const url = `https://images-na.ssl-images-amazon.com/images/I/${id}`;
          images.push(url);
          if (!imageUrl) imageUrl = url;
        }
      });
    }

    // BSR取得
    let bsr: number | undefined;
    if (product.salesRanks) {
      const entries = Object.entries(product.salesRanks);
      if (entries.length > 0) {
        const [, rankArray] = entries[0] as [string, number[]];
        if (rankArray && rankArray.length >= 2) {
          bsr = rankArray[rankArray.length - 1];
        }
      }
    }

    // 価格履歴
    const priceHistory: ProductDetail['priceHistory'] = { current: price };
    if (product.stats?.avg30?.[0]) priceHistory.avg30 = product.stats.avg30[0] / 100;
    if (product.stats?.avg90?.[0]) priceHistory.avg90 = product.stats.avg90[0] / 100;

    return {
      id: asin,
      source: 'amazon',
      title: product.title || `Product ${asin}`,
      price,
      currency: 'JPY',
      imageUrl,
      images,
      category: product.categoryTree?.[0]?.name,
      brand: product.brand,
      condition: 'New',
      bsr,
      reviewCount: product.totalReviewCount,
      rating: product.reviewsRating ? product.reviewsRating / 10 : undefined,
      priceHistory,
    };

  } catch (error) {
    console.error('Keepa API error:', error);
    return null;
  }
}

// ============================================================
// eBay API 商品取得
// ============================================================

async function fetchEbayProduct(itemId: string): Promise<ProductDetail | null> {
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    // モックデータ
    return {
      id: itemId,
      source: 'ebay',
      title: `eBay Item - ${itemId}`,
      price: 50 + Math.random() * 200,
      currency: 'USD',
      imageUrl: `https://via.placeholder.com/400?text=${itemId}`,
      category: 'Collectibles',
      condition: 'Used',
      seller: {
        name: 'mock_seller',
        feedbackScore: Math.floor(500 + Math.random() * 5000),
        feedbackPercentage: 95 + Math.random() * 5,
      },
    };
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

    // Get Item API
    const itemResponse = await fetch(
      `https://api.ebay.com/buy/browse/v1/item/v1|${itemId}|0`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        },
      }
    );

    if (!itemResponse.ok) {
      return null;
    }

    const item = await itemResponse.json();

    return {
      id: itemId,
      source: 'ebay',
      title: item.title,
      price: parseFloat(item.price?.value || '0'),
      currency: item.price?.currency || 'USD',
      imageUrl: item.image?.imageUrl,
      images: item.additionalImages?.map((img: any) => img.imageUrl),
      category: item.categoryPath,
      condition: item.condition,
      description: item.shortDescription,
      seller: item.seller ? {
        name: item.seller.username,
        feedbackScore: item.seller.feedbackScore,
        feedbackPercentage: parseFloat(item.seller.feedbackPercentage || '0'),
      } : undefined,
    };

  } catch (error) {
    console.error('eBay API error:', error);
    return null;
  }
}

// ============================================================
// スコアリング
// ============================================================

function calculateScores(product: ProductDetail, estimatedSellingPrice?: number) {
  let priceUsd: number;
  let supplierPriceJpy: number;
  
  if (product.source === 'ebay') {
    priceUsd = product.currency === 'USD' ? product.price : product.price / USD_TO_JPY;
    supplierPriceJpy = priceUsd * 0.35 * USD_TO_JPY;
  } else {
    supplierPriceJpy = product.currency === 'JPY' ? product.price : product.price * USD_TO_JPY;
    priceUsd = estimatedSellingPrice || (supplierPriceJpy / USD_TO_JPY) * 2;
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
  let sales_score = 50;
  if (product.bsr) {
    if (product.bsr <= 1000) sales_score = 100;
    else if (product.bsr <= 5000) sales_score = 90;
    else if (product.bsr <= 10000) sales_score = 80;
    else if (product.bsr <= 50000) sales_score = 70;
    else if (product.bsr <= 100000) sales_score = 60;
  }
  if (product.seller?.feedbackPercentage) {
    if (product.seller.feedbackPercentage >= 99) sales_score = Math.max(sales_score, 85);
    else if (product.seller.feedbackPercentage >= 98) sales_score = Math.max(sales_score, 75);
  }

  // リスクスコア
  let risk_score = 20;
  if (priceUsd > 300) risk_score += 15;
  if (profitMargin < 15) risk_score += 15;
  if (product.rating && product.rating < 3.5) risk_score += 10;
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
    const body: ProductSearchRequest = await request.json();
    const { query, saveToRepository = false, estimatedSellingPrice } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'ASIN、eBay Item ID、またはURLを入力してください' },
        { status: 400 }
      );
    }

    // クエリをパース
    const parsed = parseQuery(query);
    
    if (parsed.type === 'unknown') {
      return NextResponse.json(
        { success: false, error: '認識できない形式です。ASIN（例: B0D77BX7P7）またはeBay Item ID（例: 123456789012）を入力してください' },
        { status: 400 }
      );
    }

    // 商品詳細を取得
    let product: ProductDetail | null = null;
    
    if (parsed.type === 'asin') {
      product = await fetchAmazonProduct(parsed.value);
    } else if (parsed.type === 'ebay_item') {
      product = await fetchEbayProduct(parsed.value);
    }

    if (!product) {
      return NextResponse.json({
        success: false,
        error: '商品が見つかりませんでした',
        query: parsed,
      });
    }

    // スコアリング
    const scores = calculateScores(product, estimatedSellingPrice);

    const result = {
      ...product,
      ...scores,
      apiMode: parsed.type === 'asin' 
        ? (process.env.KEEPA_API_KEY ? 'keepa' : 'mock')
        : (process.env.EBAY_CLIENT_ID ? 'ebay' : 'mock'),
    };

    // research_repositoryに保存（オプション）
    if (saveToRepository) {
      const supabase = await createClient();
      
      // 重複チェック
      const { data: existing } = await supabase
        .from('research_repository')
        .select('id')
        .or(
          product.source === 'amazon' 
            ? `asin.eq.${product.id}` 
            : `ebay_item_id.eq.${product.id}`
        )
        .single();

      if (existing) {
        return NextResponse.json({
          success: true,
          product: result,
          saved: false,
          message: 'この商品は既に登録済みです',
          existingId: existing.id,
        });
      }

      // 新規登録
      const { data: inserted, error: insertError } = await supabase
        .from('research_repository')
        .insert({
          source: `single_${product.source}`,
          source_url: product.source === 'amazon' 
            ? `https://amazon.co.jp/dp/${product.id}`
            : `https://www.ebay.com/itm/${product.id}`,
          asin: product.source === 'amazon' ? product.id : null,
          ebay_item_id: product.source === 'ebay' ? product.id : null,
          
          title: product.title,
          english_title: product.title,
          image_url: product.imageUrl,
          category_name: product.category,
          brand: product.brand,
          condition_name: product.condition,
          
          sold_price_usd: scores.sold_price_usd,
          supplier_price_jpy: scores.supplier_price_jpy,
          estimated_profit_usd: scores.estimated_profit_usd,
          profit_margin: scores.profit_margin,
          
          total_score: scores.total_score,
          profit_score: scores.profit_score,
          sales_score: scores.sales_score,
          risk_score: scores.risk_score,
          risk_level: scores.risk_level,
          
          bsr_rank: product.bsr,
          review_count: product.reviewCount,
          rating: product.rating,
          
          seller_id: product.seller?.name,
          seller_feedback_score: product.seller?.feedbackScore,
          seller_feedback_percentage: product.seller?.feedbackPercentage,
          
          status: 'new',
          karitori_status: 'none',
          
          raw_data: JSON.stringify({
            product,
            priceHistory: product.priceHistory,
            images: product.images,
            specifications: product.specifications,
            fetchedAt: new Date().toISOString(),
          }),
          
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        return NextResponse.json({
          success: true,
          product: result,
          saved: false,
          error: `保存エラー: ${insertError.message}`,
        });
      }

      return NextResponse.json({
        success: true,
        product: result,
        saved: true,
        insertedId: inserted?.id,
      });
    }

    return NextResponse.json({
      success: true,
      product: result,
      saved: false,
    });

  } catch (error: any) {
    console.error('Product search error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const hasKeepaApi = !!process.env.KEEPA_API_KEY;
  const hasEbayApi = !!(process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET);
  
  return NextResponse.json({
    status: 'ok',
    api: 'product-search',
    keepaConfigured: hasKeepaApi,
    ebayConfigured: hasEbayApi,
    supportedFormats: [
      'ASIN (例: B0D77BX7P7)',
      'Amazon URL',
      'eBay Item ID (例: 123456789012)',
      'eBay URL',
    ],
  });
}
