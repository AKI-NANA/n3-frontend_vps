// app/api/research-table/amazon-batch/route.ts
/**
 * Amazon ASIN一括リサーチAPI
 * 
 * 機能:
 * - ASINリストからAmazon商品データを一括取得
 * - 優先順位: Keepa API → Amazon PA-API → モックデータ
 * - スコアリング（利益率・BSR・リスク）
 * - research_repositoryへ保存
 * 
 * 必要な環境変数:
 * - KEEPA_API_KEY: Keepa APIキー（価格履歴・販売数あり）
 * - または以下のAmazon PA-API認証情報
 *   - AMAZON_ACCESS_KEY
 *   - AMAZON_SECRET_KEY
 *   - AMAZON_PARTNER_TAG
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// ============================================================
// 型定義
// ============================================================

interface AmazonProduct {
  asin: string;
  title: string;
  price: number;          // 現在価格（円）
  currency: string;
  imageUrl?: string;
  category?: string;
  categoryId?: number;
  bsr?: number;           // Best Sellers Rank
  brand?: string;
  manufacturer?: string;
  availability?: string;
  salesRankReference?: number;
  monthlySold?: number;
  priceHistory?: {
    avg30?: number;
    avg90?: number;
    min30?: number;
    max30?: number;
  };
  reviewCount?: number;
  rating?: number;
  fbaFees?: number;
  dimensions?: {
    weight?: number;
    height?: number;
    width?: number;
    length?: number;
  };
  features?: string[];
  description?: string;
}

interface BatchRequestBody {
  asins: string[];
  jobName?: string;
  minProfitMargin?: number;
  targetMarketplace?: 'us' | 'jp' | 'de' | 'uk' | 'fr' | 'it' | 'es' | 'ca';
  estimatedSellingPrice?: number;
  useMockData?: boolean;
  forceApi?: 'keepa' | 'paapi' | 'auto'; // どのAPIを使用するか
}

interface ScoreResult {
  total_score: number;
  profit_score: number;
  sales_score: number;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
}

// ============================================================
// 定数
// ============================================================

const USD_JPY_RATE = 150;
const DEFAULT_SHIPPING_COST_USD = 15;
const DEFAULT_EBAY_FEE_PERCENT = 13;

// Amazon PA-API設定
const PAAPI_HOSTS: Record<string, string> = {
  'us': 'webservices.amazon.com',
  'jp': 'webservices.amazon.co.jp',
  'uk': 'webservices.amazon.co.uk',
  'de': 'webservices.amazon.de',
  'fr': 'webservices.amazon.fr',
  'it': 'webservices.amazon.it',
  'es': 'webservices.amazon.es',
  'ca': 'webservices.amazon.ca',
};

const PAAPI_REGIONS: Record<string, string> = {
  'us': 'us-east-1',
  'jp': 'us-west-2',
  'uk': 'eu-west-1',
  'de': 'eu-west-1',
  'fr': 'eu-west-1',
  'it': 'eu-west-1',
  'es': 'eu-west-1',
  'ca': 'us-east-1',
};

// Keepa Domain IDs
const KEEPA_DOMAINS: Record<string, number> = {
  'us': 1, 'uk': 2, 'de': 3, 'fr': 4, 'jp': 5, 'ca': 6, 'it': 8, 'es': 9,
};

const KEEPA_CSV_INDEX = {
  AMAZON: 0, NEW: 1, USED: 2, SALES_RANK: 3, LIST_PRICE: 4, NEW_FBM: 7, NEW_FBA: 10,
};

// ============================================================
// Amazon PA-API クライアント
// ============================================================

class AmazonPAAPIClient {
  private accessKey: string;
  private secretKey: string;
  private partnerTag: string;
  private host: string;
  private region: string;
  
  constructor(
    accessKey: string, 
    secretKey: string, 
    partnerTag: string,
    marketplace: string = 'jp'
  ) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.partnerTag = partnerTag;
    this.host = PAAPI_HOSTS[marketplace] || PAAPI_HOSTS['jp'];
    this.region = PAAPI_REGIONS[marketplace] || PAAPI_REGIONS['jp'];
  }
  
  /**
   * AWS Signature Version 4 署名を生成
   */
  private sign(key: Buffer, msg: string): Buffer {
    return crypto.createHmac('sha256', key).update(msg, 'utf8').digest();
  }
  
  private getSignatureKey(dateStamp: string): Buffer {
    const kDate = this.sign(Buffer.from('AWS4' + this.secretKey, 'utf8'), dateStamp);
    const kRegion = this.sign(kDate, this.region);
    const kService = this.sign(kRegion, 'ProductAdvertisingAPI');
    return this.sign(kService, 'aws4_request');
  }
  
  /**
   * PA-APIリクエストを送信
   */
  async getItems(asins: string[]): Promise<AmazonProduct[]> {
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);
    
    const payload = {
      ItemIds: asins,
      Resources: [
        'ItemInfo.Title',
        'ItemInfo.ByLineInfo',
        'ItemInfo.Classifications',
        'ItemInfo.Features',
        'ItemInfo.ManufactureInfo',
        'ItemInfo.ProductInfo',
        'ItemInfo.TechnicalInfo',
        'Offers.Listings.Price',
        'Offers.Listings.Availability.Type',
        'Offers.Listings.Condition',
        'Offers.Listings.MerchantInfo',
        'Images.Primary.Large',
        'Images.Variants.Large',
        'BrowseNodeInfo.BrowseNodes',
        'BrowseNodeInfo.BrowseNodes.SalesRank',
      ],
      PartnerTag: this.partnerTag,
      PartnerType: 'Associates',
      Marketplace: `www.amazon.co.jp`,
    };
    
    const payloadString = JSON.stringify(payload);
    const canonicalUri = '/paapi5/getitems';
    const canonicalQueryString = '';
    const canonicalHeaders = [
      `content-encoding:amz-1.0`,
      `content-type:application/json; charset=utf-8`,
      `host:${this.host}`,
      `x-amz-date:${amzDate}`,
      `x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems`,
    ].join('\n') + '\n';
    
    const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target';
    const payloadHash = crypto.createHash('sha256').update(payloadString).digest('hex');
    const canonicalRequest = [
      'POST', canonicalUri, canonicalQueryString, canonicalHeaders, signedHeaders, payloadHash
    ].join('\n');
    
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${this.region}/ProductAdvertisingAPI/aws4_request`;
    const stringToSign = [
      algorithm, amzDate, credentialScope,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');
    
    const signingKey = this.getSignatureKey(dateStamp);
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');
    const authorizationHeader = `${algorithm} Credential=${this.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    
    const response = await fetch(`https://${this.host}${canonicalUri}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Encoding': 'amz-1.0',
        'X-Amz-Date': amzDate,
        'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems',
        'Authorization': authorizationHeader,
        'Host': this.host,
      },
      body: payloadString,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PA-API Error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return this.parseResponse(data);
  }
  
  /**
   * PA-APIレスポンスをパース
   */
  private parseResponse(data: any): AmazonProduct[] {
    const products: AmazonProduct[] = [];
    
    if (!data.ItemsResult?.Items) {
      return products;
    }
    
    for (const item of data.ItemsResult.Items) {
      const product: AmazonProduct = {
        asin: item.ASIN,
        title: item.ItemInfo?.Title?.DisplayValue || `Product ${item.ASIN}`,
        price: 0,
        currency: 'JPY',
      };
      
      // 価格
      if (item.Offers?.Listings?.[0]?.Price?.Amount) {
        product.price = item.Offers.Listings[0].Price.Amount;
        product.currency = item.Offers.Listings[0].Price.Currency || 'JPY';
      }
      
      // 画像
      if (item.Images?.Primary?.Large?.URL) {
        product.imageUrl = item.Images.Primary.Large.URL;
      }
      
      // ブランド
      if (item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue) {
        product.brand = item.ItemInfo.ByLineInfo.Brand.DisplayValue;
      }
      if (item.ItemInfo?.ByLineInfo?.Manufacturer?.DisplayValue) {
        product.manufacturer = item.ItemInfo.ByLineInfo.Manufacturer.DisplayValue;
      }
      
      // カテゴリ & BSR
      if (item.BrowseNodeInfo?.BrowseNodes) {
        const mainNode = item.BrowseNodeInfo.BrowseNodes[0];
        if (mainNode) {
          product.category = mainNode.DisplayName;
          product.categoryId = parseInt(mainNode.Id);
          if (mainNode.SalesRank) {
            product.bsr = mainNode.SalesRank;
          }
        }
      }
      
      // 特徴・説明
      if (item.ItemInfo?.Features?.DisplayValues) {
        product.features = item.ItemInfo.Features.DisplayValues;
      }
      
      // サイズ・重量
      if (item.ItemInfo?.ProductInfo) {
        const info = item.ItemInfo.ProductInfo;
        product.dimensions = {
          weight: info.ItemDimensions?.Weight?.DisplayValue,
          height: info.ItemDimensions?.Height?.DisplayValue,
          width: info.ItemDimensions?.Width?.DisplayValue,
          length: info.ItemDimensions?.Length?.DisplayValue,
        };
      }
      
      // 在庫状況
      if (item.Offers?.Listings?.[0]?.Availability?.Type) {
        product.availability = item.Offers.Listings[0].Availability.Type;
      }
      
      products.push(product);
    }
    
    return products;
  }
}

// ============================================================
// Keepa API クライアント（既存）
// ============================================================

class KeepaClient {
  private apiKey: string;
  private baseUrl = 'https://api.keepa.com';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async getProducts(asins: string[], domain: number = 5): Promise<any> {
    const url = new URL(`${this.baseUrl}/product`);
    url.searchParams.set('key', this.apiKey);
    url.searchParams.set('domain', domain.toString());
    url.searchParams.set('asin', asins.join(','));
    url.searchParams.set('stats', '180');
    url.searchParams.set('history', '1');
    url.searchParams.set('rating', '1');
    url.searchParams.set('buybox', '1');
    url.searchParams.set('offers', '0');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Keepa API error: ${response.status}`);
    }
    
    return await response.json();
  }
  
  static parsePrice(keepaPrice: number | undefined): number | undefined {
    if (keepaPrice === undefined || keepaPrice < 0) return undefined;
    return keepaPrice / 100;
  }
  
  static getCurrentPrice(csv: number[][] | undefined, type: number): number | undefined {
    if (!csv || !csv[type] || csv[type].length < 2) return undefined;
    const latestPrice = csv[type][csv[type].length - 1];
    return this.parsePrice(latestPrice);
  }
}

// ============================================================
// Keepaデータ変換
// ============================================================

function convertKeepaToProduct(keepaProduct: any, domain: number): AmazonProduct {
  const category = keepaProduct.categoryTree?.[0]?.name || 'Unknown';
  const categoryId = keepaProduct.categoryTree?.[0]?.catId;
  
  let bsr: number | undefined;
  if (keepaProduct.salesRanks) {
    const entries = Object.entries(keepaProduct.salesRanks);
    if (entries.length > 0) {
      const [, rankArray] = entries[0] as [string, number[]];
      if (rankArray?.length >= 2) bsr = rankArray[rankArray.length - 1];
    }
  }
  
  let price: number | undefined;
  if (keepaProduct.csv) {
    price = KeepaClient.getCurrentPrice(keepaProduct.csv, KEEPA_CSV_INDEX.AMAZON);
    if (!price) price = KeepaClient.getCurrentPrice(keepaProduct.csv, KEEPA_CSV_INDEX.NEW_FBA);
    if (!price) price = KeepaClient.getCurrentPrice(keepaProduct.csv, KEEPA_CSV_INDEX.NEW);
  }
  
  const priceHistory: AmazonProduct['priceHistory'] = {};
  if (keepaProduct.stats?.avg30) {
    priceHistory.avg30 = KeepaClient.parsePrice(keepaProduct.stats.avg30[KEEPA_CSV_INDEX.AMAZON]);
  }
  if (keepaProduct.stats?.avg90) {
    priceHistory.avg90 = KeepaClient.parsePrice(keepaProduct.stats.avg90[KEEPA_CSV_INDEX.AMAZON]);
  }
  
  let imageUrl: string | undefined;
  if (keepaProduct.imagesCSV) {
    const imageIds = keepaProduct.imagesCSV.split(',');
    if (imageIds[0]) {
      imageUrl = `https://images-na.ssl-images-amazon.com/images/I/${imageIds[0]}`;
    }
  }
  
  return {
    asin: keepaProduct.asin,
    title: keepaProduct.title || `Product ${keepaProduct.asin}`,
    price: price || 0,
    currency: domain === 5 ? 'JPY' : 'USD',
    imageUrl,
    category,
    categoryId,
    bsr,
    brand: keepaProduct.brand,
    manufacturer: keepaProduct.manufacturer,
    availability: price ? 'In Stock' : 'Unknown',
    monthlySold: keepaProduct.monthlySold,
    priceHistory,
    reviewCount: keepaProduct.totalReviewCount,
    rating: keepaProduct.reviewsRating ? keepaProduct.reviewsRating / 10 : undefined,
    fbaFees: keepaProduct.fbaFees?.pickAndPackFee ? keepaProduct.fbaFees.pickAndPackFee / 100 : undefined,
    dimensions: {
      weight: keepaProduct.itemWeight,
      height: keepaProduct.itemHeight,
      width: keepaProduct.itemWidth,
      length: keepaProduct.itemLength,
    },
  };
}

// ============================================================
// スコアリング
// ============================================================

function calculateScores(
  profitMargin: number,
  bsr: number | undefined,
  priceUsd: number,
  monthlySold?: number,
  reviewCount?: number,
  rating?: number
): ScoreResult {
  let profit_score = 0;
  if (profitMargin >= 50) profit_score = 100;
  else if (profitMargin >= 40) profit_score = 90;
  else if (profitMargin >= 30) profit_score = 80;
  else if (profitMargin >= 25) profit_score = 70;
  else if (profitMargin >= 20) profit_score = 60;
  else if (profitMargin >= 15) profit_score = 50;
  else if (profitMargin >= 10) profit_score = 40;
  else profit_score = 20;
  
  let sales_score = 50;
  if (bsr !== undefined) {
    if (bsr <= 1000) sales_score = 100;
    else if (bsr <= 5000) sales_score = 90;
    else if (bsr <= 10000) sales_score = 80;
    else if (bsr <= 50000) sales_score = 70;
    else if (bsr <= 100000) sales_score = 60;
    else if (bsr <= 500000) sales_score = 50;
    else sales_score = 30;
  }
  
  if (monthlySold !== undefined) {
    if (monthlySold >= 100) sales_score = Math.min(100, sales_score + 10);
    else if (monthlySold >= 50) sales_score = Math.min(100, sales_score + 5);
    else if (monthlySold < 5) sales_score = Math.max(0, sales_score - 10);
  }
  
  let risk_score = 20;
  if (priceUsd > 500) risk_score += 20;
  else if (priceUsd > 300) risk_score += 10;
  if (profitMargin < 10) risk_score += 20;
  else if (profitMargin < 15) risk_score += 10;
  if (bsr && bsr > 500000) risk_score += 15;
  else if (bsr && bsr > 200000) risk_score += 10;
  if (rating !== undefined && rating < 3.5) risk_score += 10;
  if (reviewCount !== undefined && reviewCount < 10) risk_score += 5;
  risk_score = Math.min(100, risk_score);
  
  let risk_level: 'low' | 'medium' | 'high' = 'low';
  if (risk_score >= 60) risk_level = 'high';
  else if (risk_score >= 40) risk_level = 'medium';
  
  const total_score = Math.round(
    profit_score * 0.5 + sales_score * 0.3 + (100 - risk_score) * 0.2
  );
  
  return { total_score, profit_score, sales_score, risk_score, risk_level };
}

// ============================================================
// 利益計算
// ============================================================

function calculateProfit(supplierPriceJpy: number, sellingPriceUsd: number) {
  const costUsd = supplierPriceJpy / USD_JPY_RATE;
  const ebayFee = sellingPriceUsd * (DEFAULT_EBAY_FEE_PERCENT / 100);
  const totalCost = costUsd + DEFAULT_SHIPPING_COST_USD + ebayFee;
  const profitUsd = sellingPriceUsd - totalCost;
  const profitMargin = sellingPriceUsd > 0 ? (profitUsd / sellingPriceUsd) * 100 : 0;
  return { profitUsd, profitMargin, costUsd };
}

// ============================================================
// モックデータ生成
// ============================================================

function generateMockProducts(asins: string[]): AmazonProduct[] {
  return asins.map((asin) => ({
    asin,
    title: `Japanese Vintage Item - ${asin.slice(-4)}`,
    price: 2000 + Math.random() * 8000,
    currency: 'JPY',
    imageUrl: `https://via.placeholder.com/200?text=${asin}`,
    category: 'Collectibles',
    bsr: Math.floor(Math.random() * 100000) + 1000,
    brand: 'Traditional',
    availability: 'In Stock',
    monthlySold: Math.floor(Math.random() * 50) + 5,
    reviewCount: Math.floor(Math.random() * 100),
    rating: 3.5 + Math.random() * 1.5,
  }));
}

// ============================================================
// Amazon商品データ取得（マルチAPI対応）
// ============================================================

async function fetchAmazonProducts(
  asins: string[],
  marketplace: string = 'jp',
  forceApi: 'keepa' | 'paapi' | 'auto' = 'auto'
): Promise<{ 
  products: AmazonProduct[]; 
  apiUsed: 'keepa' | 'paapi' | 'mock';
  tokensUsed?: number;
  tokensLeft?: number;
}> {
  
  const keepaKey = process.env.KEEPA_API_KEY;
  const paapiAccessKey = process.env.AMAZON_ACCESS_KEY;
  const paapiSecretKey = process.env.AMAZON_SECRET_KEY;
  const paapiPartnerTag = process.env.AMAZON_PARTNER_TAG;
  
  const hasKeepa = !!keepaKey;
  const hasPAAPI = !!(paapiAccessKey && paapiSecretKey && paapiPartnerTag);
  
  console.log(`[Amazon Batch] API availability - Keepa: ${hasKeepa}, PA-API: ${hasPAAPI}`);
  
  // API選択ロジック
  let useKeepa = false;
  let usePAAPI = false;
  
  if (forceApi === 'keepa' && hasKeepa) {
    useKeepa = true;
  } else if (forceApi === 'paapi' && hasPAAPI) {
    usePAAPI = true;
  } else if (forceApi === 'auto') {
    // 自動選択: Keepa優先（価格履歴があるため）
    if (hasKeepa) useKeepa = true;
    else if (hasPAAPI) usePAAPI = true;
  }
  
  // Keepa API使用
  if (useKeepa) {
    try {
      const keepa = new KeepaClient(keepaKey!);
      const domain = KEEPA_DOMAINS[marketplace] || KEEPA_DOMAINS['jp'];
      
      const chunks: string[][] = [];
      for (let i = 0; i < asins.length; i += 100) {
        chunks.push(asins.slice(i, i + 100));
      }
      
      const allProducts: AmazonProduct[] = [];
      let totalTokensUsed = 0;
      let tokensLeft = 0;
      
      for (const chunk of chunks) {
        const response = await keepa.getProducts(chunk, domain);
        
        if (response.products) {
          for (const kp of response.products) {
            allProducts.push(convertKeepaToProduct(kp, domain));
          }
        }
        
        totalTokensUsed += response.tokensConsumed || 0;
        tokensLeft = response.tokensLeft || 0;
        
        if (chunks.length > 1) {
          await new Promise(r => setTimeout(r, 500));
        }
      }
      
      console.log(`[Amazon Batch] Keepa: ${allProducts.length} products, ${totalTokensUsed} tokens used`);
      
      return { 
        products: allProducts, 
        apiUsed: 'keepa',
        tokensUsed: totalTokensUsed,
        tokensLeft,
      };
      
    } catch (error: any) {
      console.error('[Amazon Batch] Keepa error:', error.message);
      // Keepa失敗時、PA-APIにフォールバック
      if (hasPAAPI) {
        console.log('[Amazon Batch] Falling back to PA-API');
        usePAAPI = true;
      }
    }
  }
  
  // PA-API使用
  if (usePAAPI) {
    try {
      const paapi = new AmazonPAAPIClient(
        paapiAccessKey!,
        paapiSecretKey!,
        paapiPartnerTag!,
        marketplace
      );
      
      // PA-APIは一度に10件まで
      const chunks: string[][] = [];
      for (let i = 0; i < asins.length; i += 10) {
        chunks.push(asins.slice(i, i + 10));
      }
      
      const allProducts: AmazonProduct[] = [];
      
      for (const chunk of chunks) {
        const products = await paapi.getItems(chunk);
        allProducts.push(...products);
        
        // レート制限対策
        if (chunks.length > 1) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }
      
      console.log(`[Amazon Batch] PA-API: ${allProducts.length} products`);
      
      return { products: allProducts, apiUsed: 'paapi' };
      
    } catch (error: any) {
      console.error('[Amazon Batch] PA-API error:', error.message);
    }
  }
  
  // モックデータにフォールバック
  console.log('[Amazon Batch] Using mock data (no API configured)');
  return { 
    products: generateMockProducts(asins), 
    apiUsed: 'mock' 
  };
}

// ============================================================
// メインハンドラー
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: BatchRequestBody = await request.json();
    const { 
      asins, 
      jobName = 'Batch Research', 
      minProfitMargin = 15,
      targetMarketplace = 'jp',
      estimatedSellingPrice,
      useMockData = false,
      forceApi = 'auto',
    } = body;

    if (!asins || !Array.isArray(asins) || asins.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ASINリストが必要です' },
        { status: 400 }
      );
    }

    if (asins.length > 100) {
      return NextResponse.json(
        { success: false, error: '一度に処理できるのは100件までです' },
        { status: 400 }
      );
    }

    const uniqueAsins = [...new Set(asins.map(a => a.trim().toUpperCase()))];
    const supabase = await createClient();

    // 既存ASIN確認
    const { data: existingItems } = await supabase
      .from('research_repository')
      .select('asin')
      .in('asin', uniqueAsins);

    const existingAsins = new Set((existingItems || []).map(e => e.asin));
    const newAsins = uniqueAsins.filter(a => !existingAsins.has(a));

    if (newAsins.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'すべてのASINは既にリサーチ済みです',
        total: 0,
        skipped: uniqueAsins.length,
        apiMode: 'skipped',
      });
    }

    // Amazon商品データ取得
    const { products, apiUsed, tokensUsed, tokensLeft } = useMockData
      ? { products: generateMockProducts(newAsins), apiUsed: 'mock' as const }
      : await fetchAmazonProducts(newAsins, targetMarketplace, forceApi);

    const validProducts = products.filter(p => p.price > 0);
    const invalidCount = products.length - validProducts.length;

    // リサーチアイテム作成
    const researchItems = validProducts.map((product) => {
      const priceJpy = product.currency === 'JPY' ? product.price : product.price * USD_JPY_RATE;
      const sellingPriceUsd = estimatedSellingPrice || (priceJpy / USD_JPY_RATE) * 2;
      const { profitUsd, profitMargin } = calculateProfit(priceJpy, sellingPriceUsd);
      const scores = calculateScores(
        profitMargin, product.bsr, sellingPriceUsd,
        product.monthlySold, product.reviewCount, product.rating
      );
      
      return {
        source: 'amazon',
        source_url: `https://amazon.co.jp/dp/${product.asin}`,
        asin: product.asin,
        title: product.title,
        english_title: product.title,
        image_url: product.imageUrl,
        category_name: product.category,
        brand: product.brand || product.manufacturer,
        condition_name: 'New',
        supplier_price_jpy: Math.round(priceJpy),
        sold_price_usd: Math.round(sellingPriceUsd * 100) / 100,
        estimated_profit_usd: Math.round(profitUsd * 100) / 100,
        profit_margin: Math.round(profitMargin * 10) / 10,
        supplier_source: `amazon_${targetMarketplace}`,
        supplier_url: `https://amazon.co.jp/dp/${product.asin}`,
        supplier_name: 'Amazon Japan',
        total_score: scores.total_score,
        profit_score: scores.profit_score,
        sales_score: scores.sales_score,
        risk_score: scores.risk_score,
        risk_level: scores.risk_level,
        bsr_rank: product.bsr,
        monthly_sold: product.monthlySold,
        review_count: product.reviewCount,
        rating: product.rating,
        status: 'new',
        karitori_status: 'none',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        raw_data: JSON.stringify({
          job_name: jobName,
          marketplace: targetMarketplace,
          api_used: apiUsed,
          amazon_data: product,
          price_history: product.priceHistory,
          dimensions: product.dimensions,
          features: product.features,
        }),
      };
    });

    // 利益率フィルター
    const filteredItems = researchItems.filter(i => i.profit_margin >= minProfitMargin);

    if (filteredItems.length === 0) {
      return NextResponse.json({
        success: true,
        message: `利益率${minProfitMargin}%以上の商品がありませんでした`,
        total: 0,
        analyzed: researchItems.length,
        filtered: researchItems.length,
        invalidProducts: invalidCount,
        apiMode: apiUsed,
        tokensUsed,
        tokensLeft,
      });
    }

    filteredItems.sort((a, b) => b.total_score - a.total_score);

    const { data: inserted, error: insertError } = await supabase
      .from('research_repository')
      .insert(filteredItems)
      .select('id, asin, total_score, profit_margin');

    if (insertError) {
      throw new Error(`DB挿入エラー: ${insertError.message}`);
    }

    return NextResponse.json({
      success: true,
      total: inserted?.length || 0,
      skipped: existingAsins.size,
      filtered: researchItems.length - filteredItems.length,
      invalidProducts: invalidCount,
      items: inserted?.slice(0, 10),
      stats: {
        avgScore: Math.round(filteredItems.reduce((s, i) => s + i.total_score, 0) / filteredItems.length),
        avgProfitMargin: Math.round(filteredItems.reduce((s, i) => s + i.profit_margin, 0) / filteredItems.length * 10) / 10,
        highScoreCount: filteredItems.filter(i => i.total_score >= 70).length,
      },
      apiMode: apiUsed,
      tokensUsed,
      tokensLeft,
    });

  } catch (error: any) {
    console.error('Amazon batch error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// GETハンドラー（APIステータス確認用）
// ============================================================

export async function GET() {
  const hasKeepa = !!process.env.KEEPA_API_KEY;
  const hasPAAPI = !!(
    process.env.AMAZON_ACCESS_KEY && 
    process.env.AMAZON_SECRET_KEY && 
    process.env.AMAZON_PARTNER_TAG
  );
  
  return NextResponse.json({
    status: 'ok',
    api: 'amazon-batch',
    keepaConfigured: hasKeepa,
    paapiConfigured: hasPAAPI,
    activeApi: hasKeepa ? 'keepa' : hasPAAPI ? 'paapi' : 'mock',
    supportedMarketplaces: Object.keys(KEEPA_DOMAINS),
    limits: {
      maxAsinsPerRequest: 100,
      keepaChunkSize: 100,
      paapiChunkSize: 10,
      defaultMinProfitMargin: 15,
    },
    features: {
      priceHistory: hasKeepa,      // Keepaのみ
      monthlySales: hasKeepa,      // Keepaのみ
      bsr: hasKeepa || hasPAAPI,   // 両方対応
      category: hasKeepa || hasPAAPI,
      reviews: hasKeepa || hasPAAPI,
    },
  });
}
