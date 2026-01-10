/**
 * タブ設定ファクトリー
 * components/product-modal/config/tab-config.ts
 * 
 * マーケットプレイスに応じてタブセットを動的に生成
 */

// =====================================================
// 型定義
// =====================================================

export type MarketplaceType = 'global' | 'domestic';

export interface TabConfig {
  id: string;
  label: string;
  labelJa: string;
  icon: string;
  component: string;  // 遅延ロードのためコンポーネント名を文字列で
  props?: Record<string, any>;
  visible?: boolean;
  disabled?: boolean;
}

export interface MarketplaceConfig {
  id: string;
  name: string;
  type: MarketplaceType;
  language: 'ja' | 'en';
  currency: string;
  maxImages: number;
  color: string;
}

// =====================================================
// マーケットプレイス設定
// =====================================================

export const MARKETPLACE_CONFIGS: Record<string, MarketplaceConfig> = {
  // 海外販路（Global）
  'ebay-us': {
    id: 'ebay-us',
    name: 'eBay US',
    type: 'global',
    language: 'en',
    currency: 'USD',
    maxImages: 24,
    color: '#0064d2',
  },
  'ebay-uk': {
    id: 'ebay-uk',
    name: 'eBay UK',
    type: 'global',
    language: 'en',
    currency: 'GBP',
    maxImages: 24,
    color: '#0064d2',
  },
  'ebay-de': {
    id: 'ebay-de',
    name: 'eBay DE',
    type: 'global',
    language: 'en',
    currency: 'EUR',
    maxImages: 24,
    color: '#0064d2',
  },
  'ebay-au': {
    id: 'ebay-au',
    name: 'eBay AU',
    type: 'global',
    language: 'en',
    currency: 'AUD',
    maxImages: 24,
    color: '#0064d2',
  },
  'shopee-sg': {
    id: 'shopee-sg',
    name: 'Shopee SG',
    type: 'global',
    language: 'en',
    currency: 'SGD',
    maxImages: 9,
    color: '#ee4d2d',
  },
  
  // 国内販路（Domestic）
  'qoo10-jp': {
    id: 'qoo10-jp',
    name: 'Qoo10国内',
    type: 'domestic',
    language: 'ja',
    currency: 'JPY',
    maxImages: 10,
    color: '#ff0066',
  },
  'amazon-jp': {
    id: 'amazon-jp',
    name: 'Amazon JP',
    type: 'domestic',
    language: 'ja',
    currency: 'JPY',
    maxImages: 9,
    color: '#ff9900',
  },
  'yahoo-auction': {
    id: 'yahoo-auction',
    name: 'ヤフオク',
    type: 'domestic',
    language: 'ja',
    currency: 'JPY',
    maxImages: 10,
    color: '#ff0033',
  },
  'mercari': {
    id: 'mercari',
    name: 'メルカリ',
    type: 'domestic',
    language: 'ja',
    currency: 'JPY',
    maxImages: 10,
    color: '#ff2d55',
  },
};

// =====================================================
// タブ設定（海外販路用）
// =====================================================

export const GLOBAL_TABS: TabConfig[] = [
  {
    id: 'overview',
    label: 'Overview',
    labelJa: '概要',
    icon: 'fa-home',
    component: 'TabOverview',
  },
  {
    id: 'data',
    label: 'Data',
    labelJa: 'データ',
    icon: 'fa-database',
    component: 'TabData',  // 海外用データタブ
  },
  {
    id: 'images',
    label: 'Images',
    labelJa: '画像',
    icon: 'fa-images',
    component: 'TabImages',  // 海外用画像タブ
  },
  {
    id: 'tools',
    label: 'Tools',
    labelJa: 'ツール',
    icon: 'fa-tools',
    component: 'TabTools',  // 海外用ツール（翻訳等）
  },
  {
    id: 'mirror',
    label: 'SM Analysis',
    labelJa: 'SM分析',
    icon: 'fa-search-dollar',
    component: 'TabMirror',  // SM分析タブ
  },
  {
    id: 'competitors',
    label: 'Competitors',
    labelJa: '競合',
    icon: 'fa-chart-line',
    component: 'TabCompetitors',  // 海外競合分析
  },
  {
    id: 'pricing',
    label: 'Pricing',
    labelJa: '価格',
    icon: 'fa-dollar-sign',
    component: 'TabPricingStrategy',  // 海外価格戦略
  },
  {
    id: 'shipping',
    label: 'Shipping',
    labelJa: '配送',
    icon: 'fa-truck',
    component: 'TabShipping',  // 海外送料（EMS等）
  },
  {
    id: 'html',
    label: 'HTML',
    labelJa: 'HTML',
    icon: 'fa-code',
    component: 'TabHTML',  // 海外用HTML
  },
  {
    id: 'tax',
    label: 'Tax',
    labelJa: '税関',
    icon: 'fa-file-invoice',
    component: 'TabTaxCompliance',
  },
  {
    id: 'final',
    label: 'Confirm',
    labelJa: '確認',
    icon: 'fa-check-circle',
    component: 'TabFinal',  // 海外出品確認
  },
  {
    id: 'multi-listing',
    label: 'Multi',
    labelJa: '多販路',
    icon: 'fa-layer-group',
    component: 'TabMultiListing',
  },
];

// =====================================================
// タブ設定（国内販路用）
// =====================================================

export const DOMESTIC_TABS: TabConfig[] = [
  {
    id: 'overview',
    label: '概要',
    labelJa: '概要',
    icon: 'fa-home',
    component: 'TabOverview',
  },
  {
    id: 'data',
    label: 'データ',
    labelJa: 'データ',
    icon: 'fa-database',
    component: 'TabDataDomestic',  // 国内用データタブ（新規）
  },
  {
    id: 'images',
    label: '画像',
    labelJa: '画像',
    icon: 'fa-images',
    component: 'TabImagesDomestic',  // 国内用画像タブ（新規）
  },
  {
    id: 'pricing',
    label: '価格',
    labelJa: '価格',
    icon: 'fa-yen-sign',
    component: 'TabPricingDomestic',  // 国内価格計算（新規）
  },
  {
    id: 'shipping',
    label: '配送',
    labelJa: '配送',
    icon: 'fa-truck',
    component: 'TabShippingDomestic',  // 国内送料（新規）
  },
  {
    id: 'html',
    label: 'HTML',
    labelJa: 'HTML',
    icon: 'fa-code',
    component: 'TabHTMLDomestic',  // 国内用HTML（新規）
  },
  {
    id: 'final',
    label: '確認',
    labelJa: '確認',
    icon: 'fa-check-circle',
    component: 'TabFinalDomestic',  // 国内出品確認（新規）
  },
  {
    id: 'multi-listing',
    label: '多販路',
    labelJa: '多販路',
    icon: 'fa-layer-group',
    component: 'TabMultiListing',
  },
];

// =====================================================
// Qoo10専用タブ（追加タブ）
// =====================================================

export const QOO10_SPECIFIC_TAB: TabConfig = {
  id: 'qoo10',
  label: 'Qoo10',
  labelJa: 'Qoo10',
  icon: 'fa-shopping-bag',
  component: 'TabQoo10',
};

// =====================================================
// ヘルパー関数
// =====================================================

/**
 * マーケットプレイスIDからタイプを取得
 */
export function getMarketplaceType(marketplaceId: string): MarketplaceType {
  return MARKETPLACE_CONFIGS[marketplaceId]?.type || 'global';
}

/**
 * マーケットプレイスに応じたタブ設定を取得
 */
export function getTabsForMarketplace(marketplaceId: string): TabConfig[] {
  const type = getMarketplaceType(marketplaceId);
  const baseTabs = type === 'domestic' ? [...DOMESTIC_TABS] : [...GLOBAL_TABS];
  
  // Qoo10の場合は専用タブを追加
  if (marketplaceId === 'qoo10-jp') {
    // 価格タブの後にQoo10タブを挿入
    const pricingIndex = baseTabs.findIndex(t => t.id === 'pricing');
    if (pricingIndex !== -1) {
      baseTabs.splice(pricingIndex + 1, 0, QOO10_SPECIFIC_TAB);
    }
  }
  
  return baseTabs;
}

/**
 * マーケットプレイス設定を取得
 */
export function getMarketplaceConfig(marketplaceId: string): MarketplaceConfig {
  return MARKETPLACE_CONFIGS[marketplaceId] || MARKETPLACE_CONFIGS['ebay-us'];
}

/**
 * 国内販路かどうか
 */
export function isDomesticMarketplace(marketplaceId: string): boolean {
  return getMarketplaceType(marketplaceId) === 'domestic';
}

/**
 * 言語を取得
 */
export function getMarketplaceLanguage(marketplaceId: string): 'ja' | 'en' {
  return MARKETPLACE_CONFIGS[marketplaceId]?.language || 'en';
}

/**
 * 通貨を取得
 */
export function getMarketplaceCurrency(marketplaceId: string): string {
  return MARKETPLACE_CONFIGS[marketplaceId]?.currency || 'USD';
}

/**
 * 最大画像数を取得
 */
export function getMaxImages(marketplaceId: string): number {
  return MARKETPLACE_CONFIGS[marketplaceId]?.maxImages || 12;
}
