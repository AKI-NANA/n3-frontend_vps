/**
 * MarketplaceContext - マーケットプレイス状態管理
 * 
 * N3システム全体でのマーケットプレイス切り替えを管理
 * UI表示/非表示、計算ロジック切り替えの根幹
 * 
 * @version 1.0.0
 * @since 2026-01-30
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';

// ============================================================
// 型定義
// ============================================================

/**
 * マーケットプレイスID
 */
export type MarketplaceId = 
  | 'ebay-us' | 'ebay-uk' | 'ebay-de' | 'ebay-au'
  | 'amazon-us' | 'amazon-uk' | 'amazon-de' | 'amazon-jp'
  | 'shopee-sg' | 'shopee-my' | 'shopee-th'
  | 'yahoo-auction' | 'mercari-jp' | 'rakuten' | 'qoo10-jp';

/**
 * マーケットプレイス設定
 */
export interface MarketplaceConfig {
  id: MarketplaceId;
  name: string;
  nameEn: string;
  currency: 'JPY' | 'USD' | 'EUR' | 'GBP' | 'AUD' | 'SGD' | 'MYR' | 'THB';
  language: 'ja' | 'en' | 'de';
  region: 'JP' | 'US' | 'UK' | 'DE' | 'AU' | 'SG' | 'MY' | 'TH';
  color: string;
  
  // 手数料関連
  feeRate: number;              // 基本手数料率
  feeRateSecondary?: number;    // 副次手数料（例: ヤフオクの通常会員10%）
  
  // 機能フラグ
  maxImages: number;
  maxTitleLength: number;
  hasInventorySync: boolean;      // 在庫同期API対応
  hasApiListing: boolean;         // API出品対応
  hasCsvListing: boolean;         // CSV出品対応
  supportsBackOrder: boolean;     // 無在庫対応
  
  // 国際取引関連
  isInternational: boolean;       // 海外モール
  requiresCustoms: boolean;       // 関税計算必要
  requiresExchangeRate: boolean;  // 為替計算必要
}

/**
 * コンテキスト値
 */
export interface MarketplaceContextValue {
  // 現在のマーケットプレイス
  currentMarketplace: MarketplaceId;
  setMarketplace: (id: MarketplaceId) => void;
  
  // 設定
  config: MarketplaceConfig;
  
  // 便利フラグ
  isEbay: boolean;
  isAmazon: boolean;
  isYahoo: boolean;
  isMercari: boolean;
  isRakuten: boolean;
  isShopee: boolean;
  
  // カテゴリフラグ
  isDomestic: boolean;        // 国内モール（JP）
  isInternational: boolean;   // 海外モール
  supportsBackOrder: boolean; // 無在庫対応
  
  // UI制御用
  showCurrencyConversion: boolean;  // 為替表示
  showCustomsCalculation: boolean;  // 関税計算表示
  showInternationalShipping: boolean; // 国際送料表示
  showBackOrderOptions: boolean;    // 無在庫オプション表示
  
  // ユーティリティ
  getCurrencySymbol: () => string;
  formatPrice: (price: number) => string;
  getMarketplaceColor: () => string;
}

// ============================================================
// マーケットプレイス設定マスター
// ============================================================

export const MARKETPLACE_CONFIGS: Record<MarketplaceId, MarketplaceConfig> = {
  // eBay
  'ebay-us': {
    id: 'ebay-us',
    name: 'eBay US',
    nameEn: 'eBay US',
    currency: 'USD',
    language: 'en',
    region: 'US',
    color: '#0064d2',
    feeRate: 0.1325,  // 13.25%
    maxImages: 24,
    maxTitleLength: 80,
    hasInventorySync: true,
    hasApiListing: true,
    hasCsvListing: true,
    supportsBackOrder: true,
    isInternational: true,
    requiresCustoms: true,
    requiresExchangeRate: true,
  },
  'ebay-uk': {
    id: 'ebay-uk',
    name: 'eBay UK',
    nameEn: 'eBay UK',
    currency: 'GBP',
    language: 'en',
    region: 'UK',
    color: '#0064d2',
    feeRate: 0.1325,
    maxImages: 24,
    maxTitleLength: 80,
    hasInventorySync: true,
    hasApiListing: true,
    hasCsvListing: true,
    supportsBackOrder: true,
    isInternational: true,
    requiresCustoms: true,
    requiresExchangeRate: true,
  },
  'ebay-de': {
    id: 'ebay-de',
    name: 'eBay DE',
    nameEn: 'eBay Germany',
    currency: 'EUR',
    language: 'de',
    region: 'DE',
    color: '#0064d2',
    feeRate: 0.1325,
    maxImages: 24,
    maxTitleLength: 80,
    hasInventorySync: true,
    hasApiListing: true,
    hasCsvListing: true,
    supportsBackOrder: true,
    isInternational: true,
    requiresCustoms: true,
    requiresExchangeRate: true,
  },
  'ebay-au': {
    id: 'ebay-au',
    name: 'eBay AU',
    nameEn: 'eBay Australia',
    currency: 'AUD',
    language: 'en',
    region: 'AU',
    color: '#0064d2',
    feeRate: 0.1325,
    maxImages: 24,
    maxTitleLength: 80,
    hasInventorySync: true,
    hasApiListing: true,
    hasCsvListing: true,
    supportsBackOrder: true,
    isInternational: true,
    requiresCustoms: true,
    requiresExchangeRate: true,
  },
  
  // Amazon
  'amazon-us': {
    id: 'amazon-us',
    name: 'Amazon US',
    nameEn: 'Amazon US',
    currency: 'USD',
    language: 'en',
    region: 'US',
    color: '#ff9900',
    feeRate: 0.15,  // 15%（カテゴリにより変動）
    maxImages: 9,
    maxTitleLength: 200,
    hasInventorySync: true,
    hasApiListing: true,
    hasCsvListing: true,
    supportsBackOrder: true,
    isInternational: true,
    requiresCustoms: true,
    requiresExchangeRate: true,
  },
  'amazon-uk': {
    id: 'amazon-uk',
    name: 'Amazon UK',
    nameEn: 'Amazon UK',
    currency: 'GBP',
    language: 'en',
    region: 'UK',
    color: '#ff9900',
    feeRate: 0.15,
    maxImages: 9,
    maxTitleLength: 200,
    hasInventorySync: true,
    hasApiListing: true,
    hasCsvListing: true,
    supportsBackOrder: true,
    isInternational: true,
    requiresCustoms: true,
    requiresExchangeRate: true,
  },
  'amazon-de': {
    id: 'amazon-de',
    name: 'Amazon DE',
    nameEn: 'Amazon Germany',
    currency: 'EUR',
    language: 'de',
    region: 'DE',
    color: '#ff9900',
    feeRate: 0.15,
    maxImages: 9,
    maxTitleLength: 200,
    hasInventorySync: true,
    hasApiListing: true,
    hasCsvListing: true,
    supportsBackOrder: true,
    isInternational: true,
    requiresCustoms: true,
    requiresExchangeRate: true,
  },
  'amazon-jp': {
    id: 'amazon-jp',
    name: 'Amazon日本',
    nameEn: 'Amazon Japan',
    currency: 'JPY',
    language: 'ja',
    region: 'JP',
    color: '#ff9900',
    feeRate: 0.15,
    maxImages: 9,
    maxTitleLength: 200,
    hasInventorySync: true,
    hasApiListing: true,
    hasCsvListing: true,
    supportsBackOrder: false,  // FBA前提
    isInternational: false,
    requiresCustoms: false,
    requiresExchangeRate: false,
  },
  
  // Shopee
  'shopee-sg': {
    id: 'shopee-sg',
    name: 'Shopee SG',
    nameEn: 'Shopee Singapore',
    currency: 'SGD',
    language: 'en',
    region: 'SG',
    color: '#ee4d2d',
    feeRate: 0.05,  // 5%
    maxImages: 9,
    maxTitleLength: 120,
    hasInventorySync: false,
    hasApiListing: true,
    hasCsvListing: true,
    supportsBackOrder: false,
    isInternational: true,
    requiresCustoms: true,
    requiresExchangeRate: true,
  },
  'shopee-my': {
    id: 'shopee-my',
    name: 'Shopee MY',
    nameEn: 'Shopee Malaysia',
    currency: 'MYR',
    language: 'en',
    region: 'MY',
    color: '#ee4d2d',
    feeRate: 0.05,
    maxImages: 9,
    maxTitleLength: 120,
    hasInventorySync: false,
    hasApiListing: true,
    hasCsvListing: true,
    supportsBackOrder: false,
    isInternational: true,
    requiresCustoms: true,
    requiresExchangeRate: true,
  },
  'shopee-th': {
    id: 'shopee-th',
    name: 'Shopee TH',
    nameEn: 'Shopee Thailand',
    currency: 'THB',
    language: 'en',
    region: 'TH',
    color: '#ee4d2d',
    feeRate: 0.05,
    maxImages: 9,
    maxTitleLength: 120,
    hasInventorySync: false,
    hasApiListing: true,
    hasCsvListing: true,
    supportsBackOrder: false,
    isInternational: true,
    requiresCustoms: true,
    requiresExchangeRate: true,
  },
  
  // === 国内モール ===
  
  // ヤフオク
  'yahoo-auction': {
    id: 'yahoo-auction',
    name: 'ヤフオク',
    nameEn: 'Yahoo Auction',
    currency: 'JPY',
    language: 'ja',
    region: 'JP',
    color: '#ff0033',
    feeRate: 0.088,         // LYPプレミアム: 8.8%
    feeRateSecondary: 0.10, // 通常会員: 10%
    maxImages: 10,
    maxTitleLength: 65,     // 全角65文字
    hasInventorySync: false, // API在庫同期なし
    hasApiListing: false,    // API出品なし
    hasCsvListing: true,     // CSV出品のみ
    supportsBackOrder: false, // ★ 無在庫禁止
    isInternational: false,
    requiresCustoms: false,
    requiresExchangeRate: false,
  },
  
  // メルカリ
  'mercari-jp': {
    id: 'mercari-jp',
    name: 'メルカリ',
    nameEn: 'Mercari Japan',
    currency: 'JPY',
    language: 'ja',
    region: 'JP',
    color: '#ff0211',
    feeRate: 0.10,  // 10%
    maxImages: 10,
    maxTitleLength: 40,
    hasInventorySync: false,
    hasApiListing: false,
    hasCsvListing: false,  // 手動出品のみ
    supportsBackOrder: false,
    isInternational: false,
    requiresCustoms: false,
    requiresExchangeRate: false,
  },
  
  // 楽天市場
  'rakuten': {
    id: 'rakuten',
    name: '楽天市場',
    nameEn: 'Rakuten Ichiba',
    currency: 'JPY',
    language: 'ja',
    region: 'JP',
    color: '#bf0000',
    feeRate: 0.10,  // 10%（プランにより変動）
    maxImages: 20,
    maxTitleLength: 127,
    hasInventorySync: true,
    hasApiListing: true,
    hasCsvListing: true,
    supportsBackOrder: false,
    isInternational: false,
    requiresCustoms: false,
    requiresExchangeRate: false,
  },
  
  // Qoo10国内
  'qoo10-jp': {
    id: 'qoo10-jp',
    name: 'Qoo10国内',
    nameEn: 'Qoo10 Japan',
    currency: 'JPY',
    language: 'ja',
    region: 'JP',
    color: '#ff0066',
    feeRate: 0.12,  // 12%（+ 決済3.5%）
    maxImages: 10,
    maxTitleLength: 100,
    hasInventorySync: false,
    hasApiListing: false,
    hasCsvListing: true,
    supportsBackOrder: false,
    isInternational: false,
    requiresCustoms: false,
    requiresExchangeRate: false,
  },
};

// ============================================================
// 通貨シンボル
// ============================================================

const CURRENCY_SYMBOLS: Record<string, string> = {
  JPY: '¥',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  SGD: 'S$',
  MYR: 'RM',
  THB: '฿',
};

// ============================================================
// Context
// ============================================================

const MarketplaceContext = createContext<MarketplaceContextValue | undefined>(undefined);

// ============================================================
// Provider
// ============================================================

interface MarketplaceProviderProps {
  children: ReactNode;
  defaultMarketplace?: MarketplaceId;
}

export function MarketplaceProvider({ 
  children, 
  defaultMarketplace = 'ebay-us' 
}: MarketplaceProviderProps) {
  const [currentMarketplace, setCurrentMarketplace] = useState<MarketplaceId>(defaultMarketplace);
  
  // LocalStorageから復元
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('n3_marketplace');
      if (saved && saved in MARKETPLACE_CONFIGS) {
        setCurrentMarketplace(saved as MarketplaceId);
      }
    }
  }, []);
  
  // 変更時にLocalStorageに保存
  const setMarketplace = useCallback((id: MarketplaceId) => {
    setCurrentMarketplace(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('n3_marketplace', id);
    }
  }, []);
  
  // 現在の設定
  const config = MARKETPLACE_CONFIGS[currentMarketplace];
  
  // 便利フラグ
  const isEbay = currentMarketplace.startsWith('ebay');
  const isAmazon = currentMarketplace.startsWith('amazon');
  const isYahoo = currentMarketplace === 'yahoo-auction';
  const isMercari = currentMarketplace === 'mercari-jp';
  const isRakuten = currentMarketplace === 'rakuten';
  const isShopee = currentMarketplace.startsWith('shopee');
  
  const isDomestic = config.region === 'JP';
  const isInternational = config.isInternational;
  const supportsBackOrder = config.supportsBackOrder;
  
  // UI制御フラグ
  const showCurrencyConversion = config.requiresExchangeRate;
  const showCustomsCalculation = config.requiresCustoms;
  const showInternationalShipping = config.isInternational;
  const showBackOrderOptions = config.supportsBackOrder;
  
  // ユーティリティ関数
  const getCurrencySymbol = useCallback(() => {
    return CURRENCY_SYMBOLS[config.currency] || config.currency;
  }, [config.currency]);
  
  const formatPrice = useCallback((price: number) => {
    const symbol = CURRENCY_SYMBOLS[config.currency] || config.currency;
    if (config.currency === 'JPY') {
      return `${symbol}${Math.round(price).toLocaleString()}`;
    }
    return `${symbol}${price.toFixed(2)}`;
  }, [config.currency]);
  
  const getMarketplaceColor = useCallback(() => {
    return config.color;
  }, [config.color]);
  
  // Context値
  const value = useMemo<MarketplaceContextValue>(() => ({
    currentMarketplace,
    setMarketplace,
    config,
    isEbay,
    isAmazon,
    isYahoo,
    isMercari,
    isRakuten,
    isShopee,
    isDomestic,
    isInternational,
    supportsBackOrder,
    showCurrencyConversion,
    showCustomsCalculation,
    showInternationalShipping,
    showBackOrderOptions,
    getCurrencySymbol,
    formatPrice,
    getMarketplaceColor,
  }), [
    currentMarketplace,
    setMarketplace,
    config,
    isEbay,
    isAmazon,
    isYahoo,
    isMercari,
    isRakuten,
    isShopee,
    isDomestic,
    isInternational,
    supportsBackOrder,
    showCurrencyConversion,
    showCustomsCalculation,
    showInternationalShipping,
    showBackOrderOptions,
    getCurrencySymbol,
    formatPrice,
    getMarketplaceColor,
  ]);
  
  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

export function useMarketplaceContext(): MarketplaceContextValue {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplaceContext must be used within a MarketplaceProvider');
  }
  return context;
}

// ============================================================
// 便利Hooks（個別フラグ用）
// ============================================================

/**
 * ヤフオクモードかどうか
 */
export function useIsYahooMode(): boolean {
  const { isYahoo } = useMarketplaceContext();
  return isYahoo;
}

/**
 * 国内モールかどうか
 */
export function useIsDomesticMode(): boolean {
  const { isDomestic } = useMarketplaceContext();
  return isDomestic;
}

/**
 * 無在庫対応かどうか
 */
export function useSupportsBackOrder(): boolean {
  const { supportsBackOrder } = useMarketplaceContext();
  return supportsBackOrder;
}

/**
 * 現在の通貨
 */
export function useCurrentCurrency(): string {
  const { config } = useMarketplaceContext();
  return config.currency;
}

// ============================================================
// ヘルパー関数
// ============================================================

/**
 * マーケットプレイスIDから設定を取得
 */
export function getMarketplaceConfig(id: MarketplaceId): MarketplaceConfig {
  return MARKETPLACE_CONFIGS[id];
}

/**
 * 国内マーケットプレイス一覧
 */
export function getDomesticMarketplaces(): MarketplaceConfig[] {
  return Object.values(MARKETPLACE_CONFIGS).filter(m => m.region === 'JP');
}

/**
 * 海外マーケットプレイス一覧
 */
export function getInternationalMarketplaces(): MarketplaceConfig[] {
  return Object.values(MARKETPLACE_CONFIGS).filter(m => m.isInternational);
}

/**
 * CSV出品対応マーケットプレイス一覧
 */
export function getCsvListingMarketplaces(): MarketplaceConfig[] {
  return Object.values(MARKETPLACE_CONFIGS).filter(m => m.hasCsvListing);
}
