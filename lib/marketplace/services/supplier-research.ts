/**
 * 仕入れ先リサーチサービス
 * /lib/marketplace/services/supplier-research.ts
 * 
 * 全販路共通の仕入れ先データ取得・管理
 */

import type { 
  Product, 
  SupplierSource, 
  ScrapedSupplierData 
} from '@/types/product';

// =====================================================
// 型定義
// =====================================================

export interface SupplierSearchParams {
  keyword?: string;
  jan?: string;
  asin?: string;
  imageUrl?: string;
  sources?: SupplierSource[];
  maxResults?: number;
}

export interface SupplierSearchResult {
  source: SupplierSource;
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
  confidence: number;  // マッチング信頼度 0-1
}

export interface SupplierComparisonResult {
  cheapest: SupplierSearchResult | null;
  fastest: SupplierSearchResult | null;
  bestValue: SupplierSearchResult | null;
  all: SupplierSearchResult[];
}

// =====================================================
// 仕入れ先プラットフォーム設定
// =====================================================

export const SUPPLIER_CONFIGS: Record<SupplierSource, {
  name: string;
  displayName: string;
  color: string;
  searchEnabled: boolean;
  apiType: 'scraping' | 'api' | 'manual';
  baseUrl: string;
}> = {
  yahoo_auction: {
    name: 'yahoo_auction',
    displayName: 'ヤフオク',
    color: '#ff0033',
    searchEnabled: true,
    apiType: 'scraping',
    baseUrl: 'https://auctions.yahoo.co.jp',
  },
  amazon_jp: {
    name: 'amazon_jp',
    displayName: 'Amazon JP',
    color: '#ff9900',
    searchEnabled: true,
    apiType: 'api',  // PA-API or スクレイピング
    baseUrl: 'https://www.amazon.co.jp',
  },
  rakuten: {
    name: 'rakuten',
    displayName: '楽天市場',
    color: '#bf0000',
    searchEnabled: true,
    apiType: 'api',  // 楽天商品検索API
    baseUrl: 'https://www.rakuten.co.jp',
  },
  mercari: {
    name: 'mercari',
    displayName: 'メルカリ',
    color: '#ff4f50',
    searchEnabled: true,
    apiType: 'scraping',
    baseUrl: 'https://jp.mercari.com',
  },
  yahoo_shopping: {
    name: 'yahoo_shopping',
    displayName: 'Yahoo!ショッピング',
    color: '#ff0033',
    searchEnabled: true,
    apiType: 'api',
    baseUrl: 'https://shopping.yahoo.co.jp',
  },
  au_pay_market: {
    name: 'au_pay_market',
    displayName: 'au PAYマーケット',
    color: '#ff5722',
    searchEnabled: false,
    apiType: 'manual',
    baseUrl: 'https://wowma.jp',
  },
  other: {
    name: 'other',
    displayName: 'その他',
    color: '#666666',
    searchEnabled: false,
    apiType: 'manual',
    baseUrl: '',
  },
};

// =====================================================
// 仕入れ先検索（メイン関数）
// =====================================================

export async function searchSuppliers(
  params: SupplierSearchParams
): Promise<SupplierComparisonResult> {
  const sources = params.sources || ['amazon_jp', 'rakuten', 'yahoo_auction', 'mercari'];
  const results: SupplierSearchResult[] = [];
  
  // 各ソースで並列検索
  const searchPromises = sources
    .filter(source => SUPPLIER_CONFIGS[source]?.searchEnabled)
    .map(source => searchSingleSource(source, params).catch(err => {
      console.error(`[SupplierResearch] ${source} 検索エラー:`, err);
      return [];
    }));
  
  const allResults = await Promise.all(searchPromises);
  allResults.forEach(r => results.push(...r));
  
  // ソート・比較
  const sorted = results.sort((a, b) => a.price - b.price);
  
  return {
    cheapest: sorted[0] || null,
    fastest: findFastest(results),
    bestValue: findBestValue(results),
    all: sorted.slice(0, params.maxResults || 20),
  };
}

// =====================================================
// 単一ソース検索
// =====================================================

async function searchSingleSource(
  source: SupplierSource,
  params: SupplierSearchParams
): Promise<SupplierSearchResult[]> {
  const config = SUPPLIER_CONFIGS[source];
  if (!config) return [];
  
  // API経由で検索（サーバーサイドで実行）
  try {
    const response = await fetch('/api/supplier/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source,
        ...params,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`[searchSingleSource] ${source} エラー:`, error);
    return [];
  }
}

// =====================================================
// 最速配送を探す
// =====================================================

function findFastest(results: SupplierSearchResult[]): SupplierSearchResult | null {
  // Amazon Prime対応商品を優先
  const primeResults = results.filter(r => 
    r.source === 'amazon_jp' && r.inStock
  );
  
  if (primeResults.length > 0) {
    return primeResults.sort((a, b) => a.price - b.price)[0];
  }
  
  // 在庫ありの商品から最安
  const inStock = results.filter(r => r.inStock);
  return inStock.sort((a, b) => a.price - b.price)[0] || null;
}

// =====================================================
// ベストバリューを探す（価格 + 信頼度）
// =====================================================

function findBestValue(results: SupplierSearchResult[]): SupplierSearchResult | null {
  if (results.length === 0) return null;
  
  // スコア計算（価格の逆数 × 信頼度 × 在庫補正）
  const scored = results.map(r => ({
    result: r,
    score: (1 / (r.price + 1)) * r.confidence * (r.inStock ? 1.2 : 0.5),
  }));
  
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.result || null;
}

// =====================================================
// 商品データから仕入れ先データを抽出
// =====================================================

export function extractSupplierData(product: Product): ScrapedSupplierData | null {
  const p = product as any;
  
  // 既存のscraped_dataがあればそれを返す
  if (p.scraped_data) {
    return p.scraped_data;
  }
  
  // reference_urlsから生成
  if (p.reference_urls?.length > 0) {
    const ref = p.reference_urls[0];
    return {
      source: detectSourceFromUrl(ref.url),
      source_url: ref.url,
      scraped_at: new Date().toISOString(),
      price: ref.price,
      currency: 'JPY',
    };
  }
  
  // external_urlから生成
  if (p.external_url) {
    return {
      source: detectSourceFromUrl(p.external_url),
      source_url: p.external_url,
      scraped_at: new Date().toISOString(),
      price: p.price_jpy || p.price || 0,
      currency: 'JPY',
    };
  }
  
  return null;
}

// =====================================================
// URLからソースを検出
// =====================================================

export function detectSourceFromUrl(url: string): SupplierSource {
  if (!url) return 'other';
  
  const patterns: [RegExp, SupplierSource][] = [
    [/auctions\.yahoo\.co\.jp|page\.auctions\.yahoo\.co\.jp/, 'yahoo_auction'],
    [/amazon\.co\.jp|amzn\.asia/, 'amazon_jp'],
    [/rakuten\.co\.jp|item\.rakuten\.co\.jp/, 'rakuten'],
    [/mercari\.com|jp\.mercari\.com/, 'mercari'],
    [/shopping\.yahoo\.co\.jp|store\.shopping\.yahoo\.co\.jp/, 'yahoo_shopping'],
    [/wowma\.jp|au\.wowma\.jp/, 'au_pay_market'],
  ];
  
  for (const [pattern, source] of patterns) {
    if (pattern.test(url)) {
      return source;
    }
  }
  
  return 'other';
}

// =====================================================
// 仕入れ先URLの正規化
// =====================================================

export function normalizeSupplierUrl(url: string, source: SupplierSource): string {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    
    switch (source) {
      case 'amazon_jp':
        // ASINを抽出してクリーンなURLに
        const asinMatch = url.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/);
        if (asinMatch) {
          return `https://www.amazon.co.jp/dp/${asinMatch[1]}`;
        }
        break;
        
      case 'yahoo_auction':
        // オークションIDを抽出
        const auctionMatch = url.match(/\/([a-z]\d+)/);
        if (auctionMatch) {
          return `https://page.auctions.yahoo.co.jp/jp/auction/${auctionMatch[1]}`;
        }
        break;
    }
    
    return url;
  } catch {
    return url;
  }
}

// =====================================================
// 仕入れ先データの保存
// =====================================================

export async function saveSupplierData(
  productId: string,
  supplierData: ScrapedSupplierData
): Promise<boolean> {
  try {
    const response = await fetch('/api/products/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: productId,
        updates: {
          scraped_data: supplierData,
          purchase_price_jpy: supplierData.price,
        },
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('[saveSupplierData] エラー:', error);
    return false;
  }
}

// =====================================================
// 仕入れ価格の比較サマリー
// =====================================================

export function createPriceSummary(results: SupplierSearchResult[]): {
  min: number;
  max: number;
  average: number;
  median: number;
  count: number;
} {
  if (results.length === 0) {
    return { min: 0, max: 0, average: 0, median: 0, count: 0 };
  }
  
  const prices = results.map(r => r.price).sort((a, b) => a - b);
  const sum = prices.reduce((a, b) => a + b, 0);
  
  return {
    min: prices[0],
    max: prices[prices.length - 1],
    average: Math.round(sum / prices.length),
    median: prices[Math.floor(prices.length / 2)],
    count: prices.length,
  };
}
