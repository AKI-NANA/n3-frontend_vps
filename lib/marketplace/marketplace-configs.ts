/**
 * 多販路マーケットプレイス設定
 * lib/marketplace/marketplace-configs.ts
 */

import type { MarketplaceId, MarketplaceConfig, Currency } from './multi-marketplace-types';

// =====================================================
// マーケットプレイス設定マスター
// =====================================================
export const MARKETPLACE_CONFIGS: Record<MarketplaceId, MarketplaceConfig> = {
  // =====================================================
  // eBay
  // =====================================================
  ebay_us: {
    id: 'ebay_us',
    name: 'ebay_us',
    displayName: 'eBay US',
    currency: 'USD',
    language: 'en',
    region: 'US',
    fees: {
      platformFeePercent: 12.9,    // FVF (Final Value Fee)
      paymentFeePercent: 2.9,      // 決済手数料
      paymentFeeFixed: 0.30,       // $0.30固定
    },
    maxImages: 24,
    imageRequirements: {
      minWidth: 500,
      minHeight: 500,
      maxFileSizeMB: 12,
    },
    requiredFields: ['title', 'description', 'price', 'category', 'condition', 'images'],
    apiType: 'trading',
    enabled: true,
  },
  
  ebay_uk: {
    id: 'ebay_uk',
    name: 'ebay_uk',
    displayName: 'eBay UK',
    currency: 'GBP',
    language: 'en',
    region: 'UK',
    fees: {
      platformFeePercent: 12.8,
      paymentFeePercent: 2.9,
      paymentFeeFixed: 0.30,
    },
    maxImages: 24,
    requiredFields: ['title', 'description', 'price', 'category', 'condition', 'images'],
    apiType: 'trading',
    enabled: true,
  },
  
  ebay_de: {
    id: 'ebay_de',
    name: 'ebay_de',
    displayName: 'eBay Germany',
    currency: 'EUR',
    language: 'en',
    region: 'DE',
    fees: {
      platformFeePercent: 11.0,
      paymentFeePercent: 2.9,
      paymentFeeFixed: 0.35,
    },
    maxImages: 24,
    requiredFields: ['title', 'description', 'price', 'category', 'condition', 'images'],
    apiType: 'trading',
    enabled: true,
  },
  
  ebay_au: {
    id: 'ebay_au',
    name: 'ebay_au',
    displayName: 'eBay Australia',
    currency: 'AUD',
    language: 'en',
    region: 'AU',
    fees: {
      platformFeePercent: 13.0,
      paymentFeePercent: 2.2,
      paymentFeeFixed: 0.30,
    },
    maxImages: 24,
    requiredFields: ['title', 'description', 'price', 'category', 'condition', 'images'],
    apiType: 'trading',
    enabled: true,
  },
  
  // =====================================================
  // Qoo10
  // =====================================================
  qoo10_jp: {
    id: 'qoo10_jp',
    name: 'qoo10_jp',
    displayName: 'Qoo10 Japan',
    currency: 'JPY',
    language: 'ja',
    region: 'JP',
    fees: {
      platformFeePercent: 12.0,   // 基本手数料
      paymentFeePercent: 3.5,     // 決済手数料
    },
    maxImages: 10,
    imageRequirements: {
      minWidth: 500,
      minHeight: 500,
      maxFileSizeMB: 5,
    },
    requiredFields: ['title', 'description', 'price', 'category', 'images', 'shipping_method'],
    apiType: 'rest',
    enabled: true,
  },
  
  qoo10_sg: {
    id: 'qoo10_sg',
    name: 'qoo10_sg',
    displayName: 'Qoo10 Singapore',
    currency: 'SGD',
    language: 'en',
    region: 'SG',
    fees: {
      platformFeePercent: 10.0,
      paymentFeePercent: 2.0,
    },
    maxImages: 15,
    requiredFields: ['title', 'description', 'price', 'category', 'images'],
    apiType: 'rest',
    enabled: true,
  },
  
  // =====================================================
  // Amazon
  // =====================================================
  amazon_jp: {
    id: 'amazon_jp',
    name: 'amazon_jp',
    displayName: 'Amazon Japan',
    currency: 'JPY',
    language: 'ja',
    region: 'JP',
    fees: {
      platformFeePercent: 10.0,   // カテゴリ平均
      paymentFeePercent: 0,       // Amazonが処理
      categoryFees: {
        'electronics': 8.0,
        'apparel': 10.0,
        'home': 15.0,
        'toys': 10.0,
      },
    },
    maxImages: 9,
    imageRequirements: {
      minWidth: 1000,
      minHeight: 1000,
      maxFileSizeMB: 10,
    },
    requiredFields: ['title', 'description', 'price', 'jan_code', 'brand', 'images'],
    apiType: 'rest',
    enabled: true,
  },
  
  amazon_us: {
    id: 'amazon_us',
    name: 'amazon_us',
    displayName: 'Amazon US',
    currency: 'USD',
    language: 'en',
    region: 'US',
    fees: {
      platformFeePercent: 15.0,
      paymentFeePercent: 0,
      categoryFees: {
        'electronics': 8.0,
        'apparel': 17.0,
        'home': 15.0,
      },
    },
    maxImages: 9,
    requiredFields: ['title', 'description', 'price', 'upc', 'brand', 'images'],
    apiType: 'rest',
    enabled: true,
  },
  
  amazon_au: {
    id: 'amazon_au',
    name: 'amazon_au',
    displayName: 'Amazon Australia',
    currency: 'AUD',
    language: 'en',
    region: 'AU',
    fees: {
      platformFeePercent: 15.0,
      paymentFeePercent: 0,
    },
    maxImages: 9,
    requiredFields: ['title', 'description', 'price', 'brand', 'images'],
    apiType: 'rest',
    enabled: true,
  },
  
  // =====================================================
  // Shopee
  // =====================================================
  shopee_sg: {
    id: 'shopee_sg',
    name: 'shopee_sg',
    displayName: 'Shopee Singapore',
    currency: 'SGD',
    language: 'en',
    region: 'SG',
    fees: {
      platformFeePercent: 5.0,
      paymentFeePercent: 2.0,
    },
    maxImages: 9,
    imageRequirements: {
      minWidth: 800,
      minHeight: 800,
      maxFileSizeMB: 5,
    },
    requiredFields: ['title', 'description', 'price', 'category', 'images', 'weight'],
    apiType: 'rest',
    enabled: true,
  },
  
  shopee_my: {
    id: 'shopee_my',
    name: 'shopee_my',
    displayName: 'Shopee Malaysia',
    currency: 'MYR',
    language: 'en',
    region: 'MY',
    fees: {
      platformFeePercent: 5.0,
      paymentFeePercent: 2.0,
    },
    maxImages: 9,
    requiredFields: ['title', 'description', 'price', 'category', 'images', 'weight'],
    apiType: 'rest',
    enabled: true,
  },
  
  shopee_th: {
    id: 'shopee_th',
    name: 'shopee_th',
    displayName: 'Shopee Thailand',
    currency: 'THB',
    language: 'th',
    region: 'TH',
    fees: {
      platformFeePercent: 5.0,
      paymentFeePercent: 2.0,
    },
    maxImages: 9,
    requiredFields: ['title', 'description', 'price', 'category', 'images', 'weight'],
    apiType: 'rest',
    enabled: true,
  },
  
  shopee_ph: {
    id: 'shopee_ph',
    name: 'shopee_ph',
    displayName: 'Shopee Philippines',
    currency: 'PHP',
    language: 'en',
    region: 'PH',
    fees: {
      platformFeePercent: 5.0,
      paymentFeePercent: 2.0,
    },
    maxImages: 9,
    requiredFields: ['title', 'description', 'price', 'category', 'images', 'weight'],
    apiType: 'rest',
    enabled: true,
  },
  
  shopee_tw: {
    id: 'shopee_tw',
    name: 'shopee_tw',
    displayName: 'Shopee Taiwan',
    currency: 'TWD',
    language: 'zh',
    region: 'TW',
    fees: {
      platformFeePercent: 5.0,
      paymentFeePercent: 2.0,
    },
    maxImages: 9,
    requiredFields: ['title', 'description', 'price', 'category', 'images', 'weight'],
    apiType: 'rest',
    enabled: true,
  },
  
  shopee_vn: {
    id: 'shopee_vn',
    name: 'shopee_vn',
    displayName: 'Shopee Vietnam',
    currency: 'VND',
    language: 'vi',
    region: 'VN',
    fees: {
      platformFeePercent: 5.0,
      paymentFeePercent: 2.0,
    },
    maxImages: 9,
    requiredFields: ['title', 'description', 'price', 'category', 'images', 'weight'],
    apiType: 'rest',
    enabled: true,
  },
  
  // =====================================================
  // その他
  // =====================================================
  shopify: {
    id: 'shopify',
    name: 'shopify',
    displayName: 'Shopify',
    currency: 'USD',
    language: 'en',
    region: 'global',
    fees: {
      platformFeePercent: 2.9,    // Basic plan
      paymentFeePercent: 0.30,
    },
    maxImages: 25,
    requiredFields: ['title', 'description', 'price', 'images'],
    apiType: 'graphql',
    enabled: false,
  },
  
  coupang: {
    id: 'coupang',
    name: 'coupang',
    displayName: 'Coupang',
    currency: 'KRW',
    language: 'ko',
    region: 'KR',
    fees: {
      platformFeePercent: 11.0,
      paymentFeePercent: 0,
      categoryFees: {
        'fashion': 15.0,
        'beauty': 12.0,
        'electronics': 8.0,
      },
    },
    maxImages: 20,
    requiredFields: ['title_ko', 'description_ko', 'price', 'category', 'brand', 'images'],
    apiType: 'rest',
    enabled: false,
  },
  
  mercari_jp: {
    id: 'mercari_jp',
    name: 'mercari_jp',
    displayName: 'メルカリ',
    currency: 'JPY',
    language: 'ja',
    region: 'JP',
    fees: {
      platformFeePercent: 10.0,
      paymentFeePercent: 0,
    },
    maxImages: 10,
    requiredFields: ['title', 'description', 'price', 'category', 'condition', 'images'],
    apiType: 'csv_upload',
    enabled: false,
  },
  
  mercari_us: {
    id: 'mercari_us',
    name: 'mercari_us',
    displayName: 'Mercari US',
    currency: 'USD',
    language: 'en',
    region: 'US',
    fees: {
      platformFeePercent: 10.0,
      paymentFeePercent: 2.9,
      paymentFeeFixed: 0.50,
    },
    maxImages: 12,
    requiredFields: ['title', 'description', 'price', 'category', 'condition', 'images'],
    apiType: 'csv_upload',
    enabled: false,
  },
  
  yahoo_auction: {
    id: 'yahoo_auction',
    name: 'yahoo_auction',
    displayName: 'ヤフオク',
    currency: 'JPY',
    language: 'ja',
    region: 'JP',
    fees: {
      platformFeePercent: 8.8,    // Yahoo!プレミアム会員
      paymentFeePercent: 0,
    },
    maxImages: 10,
    requiredFields: ['title', 'description', 'starting_price', 'category', 'images'],
    apiType: 'rest',
    enabled: false,
  },
  
  yahoo_shopping: {
    id: 'yahoo_shopping',
    name: 'yahoo_shopping',
    displayName: 'Yahoo!ショッピング',
    currency: 'JPY',
    language: 'ja',
    region: 'JP',
    fees: {
      platformFeePercent: 6.0,
      paymentFeePercent: 3.0,
    },
    maxImages: 20,
    requiredFields: ['title', 'description', 'price', 'category', 'jan_code', 'images'],
    apiType: 'rest',
    enabled: false,
  },
  
  rakuten: {
    id: 'rakuten',
    name: 'rakuten',
    displayName: '楽天市場',
    currency: 'JPY',
    language: 'ja',
    region: 'JP',
    fees: {
      platformFeePercent: 8.0,    // がんばれプラン
      paymentFeePercent: 3.0,
    },
    maxImages: 20,
    requiredFields: ['title', 'description', 'price', 'category', 'jan_code', 'images'],
    apiType: 'rest',
    enabled: false,
  },
};

// =====================================================
// デフォルト為替レート（フォールバック用）
// =====================================================
export const DEFAULT_EXCHANGE_RATES: Record<Currency, number> = {
  'JPY': 1,
  'USD': 150,
  'GBP': 190,
  'EUR': 165,
  'AUD': 100,
  'SGD': 112,
  'MYR': 34,
  'THB': 4.3,
  'PHP': 2.7,
  'TWD': 4.8,
  'VND': 0.0062,
  'KRW': 0.11,
};

// =====================================================
// ユーティリティ関数
// =====================================================

/**
 * マーケットプレイス設定を取得
 */
export function getMarketplaceConfig(id: MarketplaceId): MarketplaceConfig {
  return MARKETPLACE_CONFIGS[id];
}

/**
 * 有効なマーケットプレイス一覧を取得
 */
export function getEnabledMarketplaces(): MarketplaceConfig[] {
  return Object.values(MARKETPLACE_CONFIGS).filter(config => config.enabled);
}

/**
 * 全マーケットプレイスIDを取得
 */
export function getAllMarketplaceIds(): MarketplaceId[] {
  return Object.keys(MARKETPLACE_CONFIGS) as MarketplaceId[];
}

/**
 * 優先マーケットプレイス（計算対象）
 */
export const PRIORITY_MARKETPLACES: MarketplaceId[] = [
  'ebay_us',
  'qoo10_jp',
  'shopee_sg',
  'amazon_jp',
];

/**
 * マーケットプレイスIDを正規化（UI用IDをDB用IDに変換）
 */
export function normalizeMarketplaceId(uiId: string): MarketplaceId | null {
  const mapping: Record<string, MarketplaceId> = {
    'ebay-us': 'ebay_us',
    'ebay-uk': 'ebay_uk',
    'ebay-de': 'ebay_de',
    'ebay-au': 'ebay_au',
    'qoo10-jp': 'qoo10_jp',
    'qoo10-sg': 'qoo10_sg',
    'amazon-jp': 'amazon_jp',
    'amazon-us': 'amazon_us',
    'amazon-au': 'amazon_au',
    'shopee-sg': 'shopee_sg',
    'shopee-my': 'shopee_my',
    'shopee-th': 'shopee_th',
    'shopee-ph': 'shopee_ph',
    'shopee-tw': 'shopee_tw',
    'shopee-vn': 'shopee_vn',
  };
  
  // 既にDB形式の場合はそのまま返す
  if (uiId in MARKETPLACE_CONFIGS) {
    return uiId as MarketplaceId;
  }
  
  return mapping[uiId] || null;
}

/**
 * DB用IDをUI用IDに変換
 */
export function toUiMarketplaceId(dbId: MarketplaceId): string {
  return dbId.replace('_', '-');
}
