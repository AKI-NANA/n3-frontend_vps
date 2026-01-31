/**
 * 多販路マーケットプレイス設定
 * lib/marketplace/marketplace-configs.ts
 * 
 * Phase 1 拡張版:
 * - Lazada追加
 * - TCGplayer / Cardmarket追加
 * - 国際販売手数料追加
 * - VAT/GST対応
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
      platformFeePercent: 13.25,   // FVF (2024年改定)
      paymentFeePercent: 2.9,      // 決済手数料
      paymentFeeFixed: 0.30,       // $0.30固定
      internationalFeePercent: 1.65, // 国際販売追加
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
    region: 'GB',
    fees: {
      platformFeePercent: 12.8,
      paymentFeePercent: 2.9,
      paymentFeeFixed: 0.30,
    },
    maxImages: 24,
    requiredFields: ['title', 'description', 'price', 'category', 'condition', 'images'],
    apiType: 'trading',
    enabled: true,
    taxInfo: {
      vatRequired: true,
      vatRate: 20.0,
      gstRequired: false,
    },
  },
  
  ebay_de: {
    id: 'ebay_de',
    name: 'ebay_de',
    displayName: 'eBay Germany',
    currency: 'EUR',
    language: 'de',
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
    taxInfo: {
      vatRequired: true,
      vatRate: 19.0,
      gstRequired: false,
    },
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
    taxInfo: {
      vatRequired: false,
      gstRequired: true,
      gstRate: 10.0,
    },
  },
  
  ebay_fr: {
    id: 'ebay_fr',
    name: 'ebay_fr',
    displayName: 'eBay France',
    currency: 'EUR',
    language: 'fr',
    region: 'FR',
    fees: {
      platformFeePercent: 11.0,
      paymentFeePercent: 2.9,
      paymentFeeFixed: 0.35,
    },
    maxImages: 24,
    requiredFields: ['title', 'description', 'price', 'category', 'condition', 'images'],
    apiType: 'trading',
    enabled: true,
    taxInfo: {
      vatRequired: true,
      vatRate: 20.0,
      gstRequired: false,
    },
  },
  
  ebay_it: {
    id: 'ebay_it',
    name: 'ebay_it',
    displayName: 'eBay Italy',
    currency: 'EUR',
    language: 'it',
    region: 'IT',
    fees: {
      platformFeePercent: 11.0,
      paymentFeePercent: 2.9,
      paymentFeeFixed: 0.35,
    },
    maxImages: 24,
    requiredFields: ['title', 'description', 'price', 'category', 'condition', 'images'],
    apiType: 'trading',
    enabled: true,
    taxInfo: {
      vatRequired: true,
      vatRate: 22.0,
      gstRequired: false,
    },
  },
  
  ebay_es: {
    id: 'ebay_es',
    name: 'ebay_es',
    displayName: 'eBay Spain',
    currency: 'EUR',
    language: 'es',
    region: 'ES',
    fees: {
      platformFeePercent: 11.0,
      paymentFeePercent: 2.9,
      paymentFeeFixed: 0.35,
    },
    maxImages: 24,
    requiredFields: ['title', 'description', 'price', 'category', 'condition', 'images'],
    apiType: 'trading',
    enabled: true,
    taxInfo: {
      vatRequired: true,
      vatRate: 21.0,
      gstRequired: false,
    },
  },
  
  ebay_ca: {
    id: 'ebay_ca',
    name: 'ebay_ca',
    displayName: 'eBay Canada',
    currency: 'CAD',
    language: 'en',
    region: 'CA',
    fees: {
      platformFeePercent: 12.9,
      paymentFeePercent: 2.9,
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
      platformFeePercent: 7.0,    // ノーマル手数料（Qスペシャル10%）
      paymentFeePercent: 3.0,     // 決済手数料
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
        'trading_cards': 8.0,
      },
    },
    maxImages: 9,
    imageRequirements: {
      minWidth: 1000,
      minHeight: 1000,
      maxFileSizeMB: 10,
    },
    requiredFields: ['title', 'description', 'price', 'jan_code', 'brand', 'images'],
    apiType: 'sp-api',
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
        'trading_cards': 12.0,
      },
    },
    maxImages: 9,
    requiredFields: ['title', 'description', 'price', 'upc', 'brand', 'images'],
    apiType: 'sp-api',
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
    apiType: 'sp-api',
    enabled: true,
    taxInfo: {
      vatRequired: false,
      gstRequired: true,
      gstRate: 10.0,
    },
  },
  
  amazon_uk: {
    id: 'amazon_uk',
    name: 'amazon_uk',
    displayName: 'Amazon UK',
    currency: 'GBP',
    language: 'en',
    region: 'GB',
    fees: {
      platformFeePercent: 15.3,
      paymentFeePercent: 0,
    },
    maxImages: 9,
    requiredFields: ['title', 'description', 'price', 'ean', 'brand', 'images'],
    apiType: 'sp-api',
    enabled: true,
    taxInfo: {
      vatRequired: true,
      vatRate: 20.0,
      gstRequired: false,
    },
  },
  
  amazon_de: {
    id: 'amazon_de',
    name: 'amazon_de',
    displayName: 'Amazon Germany',
    currency: 'EUR',
    language: 'de',
    region: 'DE',
    fees: {
      platformFeePercent: 15.0,
      paymentFeePercent: 0,
    },
    maxImages: 9,
    requiredFields: ['title', 'description', 'price', 'ean', 'brand', 'images'],
    apiType: 'sp-api',
    enabled: true,
    taxInfo: {
      vatRequired: true,
      vatRate: 19.0,
      gstRequired: false,
    },
  },
  
  // =====================================================
  // Shopee（7ヵ国）
  // =====================================================
  shopee_sg: {
    id: 'shopee_sg',
    name: 'shopee_sg',
    displayName: 'Shopee Singapore',
    currency: 'SGD',
    language: 'en',
    region: 'SG',
    fees: {
      platformFeePercent: 6.0,  // クロスボーダー
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
      platformFeePercent: 6.0,
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
      platformFeePercent: 6.0,
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
      platformFeePercent: 6.0,
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
      platformFeePercent: 6.0,
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
      platformFeePercent: 6.0,
      paymentFeePercent: 2.0,
    },
    maxImages: 9,
    requiredFields: ['title', 'description', 'price', 'category', 'images', 'weight'],
    apiType: 'rest',
    enabled: true,
  },
  
  shopee_id: {
    id: 'shopee_id',
    name: 'shopee_id',
    displayName: 'Shopee Indonesia',
    currency: 'IDR',
    language: 'en',
    region: 'ID',
    fees: {
      platformFeePercent: 6.0,
      paymentFeePercent: 2.0,
    },
    maxImages: 9,
    requiredFields: ['title', 'description', 'price', 'category', 'images', 'weight'],
    apiType: 'rest',
    enabled: true,
  },
  
  // =====================================================
  // Lazada（4ヵ国）
  // =====================================================
  lazada_sg: {
    id: 'lazada_sg',
    name: 'lazada_sg',
    displayName: 'Lazada Singapore',
    currency: 'SGD',
    language: 'en',
    region: 'SG',
    fees: {
      platformFeePercent: 6.0,
      paymentFeePercent: 2.0,
    },
    maxImages: 8,
    requiredFields: ['title', 'description', 'price', 'category', 'images', 'weight'],
    apiType: 'rest',
    enabled: false, // Phase 3で有効化
  },
  
  lazada_my: {
    id: 'lazada_my',
    name: 'lazada_my',
    displayName: 'Lazada Malaysia',
    currency: 'MYR',
    language: 'en',
    region: 'MY',
    fees: {
      platformFeePercent: 6.0,
      paymentFeePercent: 2.0,
    },
    maxImages: 8,
    requiredFields: ['title', 'description', 'price', 'category', 'images', 'weight'],
    apiType: 'rest',
    enabled: false,
  },
  
  lazada_th: {
    id: 'lazada_th',
    name: 'lazada_th',
    displayName: 'Lazada Thailand',
    currency: 'THB',
    language: 'th',
    region: 'TH',
    fees: {
      platformFeePercent: 6.0,
      paymentFeePercent: 2.0,
    },
    maxImages: 8,
    requiredFields: ['title', 'description', 'price', 'category', 'images', 'weight'],
    apiType: 'rest',
    enabled: false,
  },
  
  lazada_ph: {
    id: 'lazada_ph',
    name: 'lazada_ph',
    displayName: 'Lazada Philippines',
    currency: 'PHP',
    language: 'en',
    region: 'PH',
    fees: {
      platformFeePercent: 6.0,
      paymentFeePercent: 2.0,
    },
    maxImages: 8,
    requiredFields: ['title', 'description', 'price', 'category', 'images', 'weight'],
    apiType: 'rest',
    enabled: false,
  },
  
  // =====================================================
  // 国内販路
  // =====================================================
  yahoo_auction_jp: {
    id: 'yahoo_auction_jp',
    name: 'yahoo_auction_jp',
    displayName: 'ヤフオク!',
    currency: 'JPY',
    language: 'ja',
    region: 'JP',
    fees: {
      platformFeePercent: 10.0,   // 非プレミアム会員
      paymentFeePercent: 0,
    },
    maxImages: 10,
    requiredFields: ['title', 'description', 'starting_price', 'category', 'images'],
    apiType: 'csv_upload', // オークタウン経由
    enabled: true,
  },
  
  yahoo_shopping_jp: {
    id: 'yahoo_shopping_jp',
    name: 'yahoo_shopping_jp',
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
  
  rakuten_jp: {
    id: 'rakuten_jp',
    name: 'rakuten_jp',
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
  
  // =====================================================
  // その他
  // =====================================================
  shopify: {
    id: 'shopify',
    name: 'shopify',
    displayName: 'Shopify',
    currency: 'USD',
    language: 'en',
    region: 'US', // グローバルだがUSベース
    fees: {
      platformFeePercent: 0,      // Shopify Paymentの場合
      paymentFeePercent: 2.9,
      paymentFeeFixed: 0.30,
    },
    maxImages: 250,
    requiredFields: ['title', 'description', 'price', 'images'],
    apiType: 'graphql',
    enabled: false, // Phase 2で有効化
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
    enabled: false, // Phase 3で有効化
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
  
  // =====================================================
  // トレカ専門
  // =====================================================
  tcgplayer: {
    id: 'tcgplayer',
    name: 'tcgplayer',
    displayName: 'TCGplayer',
    currency: 'USD',
    language: 'en',
    region: 'US',
    fees: {
      platformFeePercent: 10.25,  // Level 4 Seller
      paymentFeePercent: 2.5,
      paymentFeeFixed: 0.30,
    },
    maxImages: 5,
    requiredFields: ['title', 'condition', 'price', 'quantity'],
    apiType: 'rest',
    enabled: false, // Phase 4で有効化
  },
  
  cardmarket: {
    id: 'cardmarket',
    name: 'cardmarket',
    displayName: 'Cardmarket',
    currency: 'EUR',
    language: 'en',
    region: 'DE', // ドイツ拠点
    fees: {
      platformFeePercent: 5.0,   // プロセラー
      paymentFeePercent: 3.0,
    },
    maxImages: 4,
    requiredFields: ['product_id', 'condition', 'price', 'quantity'],
    apiType: 'rest',
    enabled: false, // Phase 4で有効化
    taxInfo: {
      vatRequired: true,
      vatRate: 19.0,
      gstRequired: false,
    },
  },
};

// =====================================================
// デフォルト為替レート（フォールバック用）
// 1現地通貨 = X円
// =====================================================
export const DEFAULT_EXCHANGE_RATES: Record<Currency, number> = {
  'JPY': 1,
  'USD': 150,
  'GBP': 190,
  'EUR': 165,
  'AUD': 100,
  'CAD': 110,
  'SGD': 112,
  'MYR': 34,
  'THB': 4.3,
  'PHP': 2.7,
  'TWD': 4.8,
  'VND': 0.0062,
  'KRW': 0.11,
  'IDR': 0.0095,
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
 * Phase 1/2で有効な販路のみ
 */
export const PRIORITY_MARKETPLACES: MarketplaceId[] = [
  'ebay_us',
  'ebay_uk',
  'ebay_de',
  'ebay_au',
  'qoo10_jp',
  'shopee_sg',
  'amazon_jp',
  'amazon_us',
];

/**
 * 国内販路のみ
 */
export const DOMESTIC_MARKETPLACES: MarketplaceId[] = [
  'qoo10_jp',
  'yahoo_auction_jp',
  'mercari_jp',
  'amazon_jp',
];

/**
 * 東南アジア販路
 */
export const SEA_MARKETPLACES: MarketplaceId[] = [
  'shopee_sg',
  'shopee_my',
  'shopee_th',
  'shopee_ph',
  'shopee_tw',
  'shopee_vn',
  'shopee_id',
  'lazada_sg',
  'lazada_my',
  'lazada_th',
  'lazada_ph',
  'qoo10_sg',
];

/**
 * 欧州販路（VAT必要）
 */
export const EU_MARKETPLACES: MarketplaceId[] = [
  'ebay_uk',
  'ebay_de',
  'ebay_fr',
  'ebay_it',
  'ebay_es',
  'amazon_uk',
  'amazon_de',
  'cardmarket',
];

/**
 * トレカ専門販路
 */
export const TRADING_CARD_MARKETPLACES: MarketplaceId[] = [
  'tcgplayer',
  'cardmarket',
];

/**
 * マーケットプレイスIDを正規化（UI用IDをDB用IDに変換）
 */
export function normalizeMarketplaceId(uiId: string): MarketplaceId | null {
  // 既にDB形式の場合はそのまま返す
  if (uiId in MARKETPLACE_CONFIGS) {
    return uiId as MarketplaceId;
  }
  
  // ハイフン形式をアンダースコア形式に変換
  const normalized = uiId.replace(/-/g, '_');
  if (normalized in MARKETPLACE_CONFIGS) {
    return normalized as MarketplaceId;
  }
  
  return null;
}

/**
 * DB用IDをUI用IDに変換
 */
export function toUiMarketplaceId(dbId: MarketplaceId): string {
  return dbId.replace(/_/g, '-');
}

/**
 * 通貨記号を取得
 */
export function getCurrencySymbol(currency: Currency): string {
  const symbols: Record<Currency, string> = {
    'USD': '$',
    'JPY': '¥',
    'GBP': '£',
    'EUR': '€',
    'AUD': 'A$',
    'CAD': 'C$',
    'SGD': 'S$',
    'MYR': 'RM',
    'THB': '฿',
    'PHP': '₱',
    'TWD': 'NT$',
    'VND': '₫',
    'KRW': '₩',
    'IDR': 'Rp',
  };
  return symbols[currency] || currency;
}

/**
 * 国コードから販路一覧を取得
 */
export function getMarketplacesByCountry(countryCode: string): MarketplaceConfig[] {
  return Object.values(MARKETPLACE_CONFIGS).filter(
    config => config.region === countryCode
  );
}
