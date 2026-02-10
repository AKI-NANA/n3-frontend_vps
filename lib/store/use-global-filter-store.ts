// lib/store/use-global-filter-store.ts
/**
 * グローバルフィルターストア（拡張版）
 * 
 * フィルター項目:
 * 【基本】保管場所, L1-L3属性, 在庫数, タイプ, アカウント
 * 【価格・原価】仕入れ値, 販売価格, 利益率, Pricing種類
 * 【分類・属性】カテゴリー, 原産国, 素材, 仕入先
 * 【関税・HTS】HTSコード, HTS関税率
 * 【スコア・配送】Listing Score, 配送方法
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================
// 型定義
// ============================================================

export interface GlobalFilterState {
  // 基本
  storageLocation: string | null;
  attrL1: string | null;
  attrL2: string | null;
  attrL3: string | null;
  stockMin: number | null;
  stockMax: number | null;
  productType: string[];
  account: string[];
  searchQuery: string;
  
  // 価格・原価
  costMin: number | null;
  costMax: number | null;
  priceUsdMin: number | null;
  priceUsdMax: number | null;
  profitMarginMin: number | null;
  profitMarginMax: number | null;
  pricingType: string[];
  
  // 分類・属性
  category: string | null;
  originCountry: string | null;
  material: string | null;
  source: string | null;
  
  // 関税・HTS
  htsCode: string | null;
  htsDutyRateMin: number | null;
  htsDutyRateMax: number | null;
  
  // スコア・配送
  listingScoreMin: number | null;
  listingScoreMax: number | null;
  shippingMethod: string | null;
}

interface GlobalFilterStore extends GlobalFilterState {
  // アクション
  setFilters: (filters: Partial<GlobalFilterState>) => void;
  resetFilters: () => void;
  
  // 個別更新
  setStorageLocation: (value: string | null) => void;
  setAttrL1: (value: string | null) => void;
  setAttrL2: (value: string | null) => void;
  setAttrL3: (value: string | null) => void;
  setStockMin: (value: number | null) => void;
  setStockMax: (value: number | null) => void;
  toggleProductType: (value: string) => void;
  toggleAccount: (value: string) => void;
  setSearchQuery: (query: string) => void;
  
  // アクティブフィルター数
  getActiveFilterCount: () => number;
  
  // API用パラメータに変換
  toApiParams: () => Record<string, any>;
}

// ============================================================
// デフォルト値
// ============================================================

const DEFAULT_STATE: GlobalFilterState = {
  storageLocation: null,
  attrL1: null,
  attrL2: null,
  attrL3: null,
  stockMin: null,
  stockMax: null,
  productType: [],
  account: [],
  searchQuery: '',
  costMin: null,
  costMax: null,
  priceUsdMin: null,
  priceUsdMax: null,
  profitMarginMin: null,
  profitMarginMax: null,
  pricingType: [],
  category: null,
  originCountry: null,
  material: null,
  source: null,
  htsCode: null,
  htsDutyRateMin: null,
  htsDutyRateMax: null,
  listingScoreMin: null,
  listingScoreMax: null,
  shippingMethod: null,
};

// ============================================================
// ヘルパー
// ============================================================

function toggleArrayValue(arr: string[], value: string): string[] {
  return arr.includes(value)
    ? arr.filter(v => v !== value)
    : [...arr, value];
}

// ============================================================
// ストア
// ============================================================

export const useGlobalFilterStore = create<GlobalFilterStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      setFilters: (filters) => set((state) => ({ ...state, ...filters })),
      resetFilters: () => set(DEFAULT_STATE),

      setStorageLocation: (value) => set({ storageLocation: value }),
      
      setAttrL1: (value) => set({ 
        attrL1: value, 
        attrL2: null,
        attrL3: null 
      }),
      
      setAttrL2: (value) => set({ 
        attrL2: value, 
        attrL3: null
      }),
      
      setAttrL3: (value) => set({ attrL3: value }),
      
      setStockMin: (value) => set({ stockMin: value }),
      setStockMax: (value) => set({ stockMax: value }),
      
      toggleProductType: (value) => set((state) => ({
        productType: toggleArrayValue(state.productType, value)
      })),
      
      toggleAccount: (value) => set((state) => ({
        account: toggleArrayValue(state.account, value)
      })),
      
      setSearchQuery: (query) => set({ searchQuery: query }),

      getActiveFilterCount: () => {
        const state = get();
        let count = 0;
        if (state.storageLocation) count++;
        if (state.attrL1) count++;
        if (state.attrL2) count++;
        if (state.attrL3) count++;
        if (state.stockMin !== null || state.stockMax !== null) count++;
        if (state.productType.length) count++;
        if (state.account.length) count++;
        if (state.searchQuery) count++;
        if (state.costMin !== null || state.costMax !== null) count++;
        if (state.priceUsdMin !== null || state.priceUsdMax !== null) count++;
        if (state.profitMarginMin !== null || state.profitMarginMax !== null) count++;
        if (state.pricingType.length) count++;
        if (state.category) count++;
        if (state.originCountry) count++;
        if (state.material) count++;
        if (state.source) count++;
        if (state.htsCode) count++;
        if (state.htsDutyRateMin !== null || state.htsDutyRateMax !== null) count++;
        if (state.listingScoreMin !== null || state.listingScoreMax !== null) count++;
        if (state.shippingMethod) count++;
        return count;
      },

      toApiParams: () => {
        const state = get();
        const params: Record<string, any> = {};

        // 基本
        if (state.storageLocation) params.storage_location = state.storageLocation;
        if (state.attrL1) params.attr_l1 = state.attrL1;
        if (state.attrL2) params.attr_l2 = state.attrL2;
        if (state.attrL3) params.attr_l3 = state.attrL3;
        if (state.stockMin !== null) params.stock_min = state.stockMin;
        if (state.stockMax !== null) params.stock_max = state.stockMax;
        if (state.productType.length > 0) params.product_type = state.productType;
        if (state.account.length > 0) params.account = state.account;
        if (state.searchQuery) params.search = state.searchQuery;
        
        // 価格・原価
        if (state.costMin !== null) params.cost_min = state.costMin;
        if (state.costMax !== null) params.cost_max = state.costMax;
        if (state.priceUsdMin !== null) params.price_usd_min = state.priceUsdMin;
        if (state.priceUsdMax !== null) params.price_usd_max = state.priceUsdMax;
        if (state.profitMarginMin !== null) params.profit_margin_min = state.profitMarginMin;
        if (state.profitMarginMax !== null) params.profit_margin_max = state.profitMarginMax;
        if (state.pricingType.length > 0) params.pricing_type = state.pricingType;
        
        // 分類・属性
        if (state.category) params.category = state.category;
        if (state.originCountry) params.origin_country = state.originCountry;
        if (state.material) params.material = state.material;
        if (state.source) params.source = state.source;
        
        // 関税・HTS
        if (state.htsCode) params.hts_code = state.htsCode;
        if (state.htsDutyRateMin !== null) params.hts_duty_rate_min = state.htsDutyRateMin;
        if (state.htsDutyRateMax !== null) params.hts_duty_rate_max = state.htsDutyRateMax;
        
        // スコア・配送
        if (state.listingScoreMin !== null) params.listing_score_min = state.listingScoreMin;
        if (state.listingScoreMax !== null) params.listing_score_max = state.listingScoreMax;
        if (state.shippingMethod) params.shipping_method = state.shippingMethod;

        return params;
      },
    }),
    {
      name: 'n3-global-filter-v3',
      // 全てのフィルター項目を永続化（タブをまたいでも記憶）
      partialize: (state) => ({
        storageLocation: state.storageLocation,
        attrL1: state.attrL1,
        attrL2: state.attrL2,
        attrL3: state.attrL3,
        stockMin: state.stockMin,
        stockMax: state.stockMax,
        productType: state.productType,
        account: state.account,
        searchQuery: state.searchQuery,
        costMin: state.costMin,
        costMax: state.costMax,
        priceUsdMin: state.priceUsdMin,
        priceUsdMax: state.priceUsdMax,
        profitMarginMin: state.profitMarginMin,
        profitMarginMax: state.profitMarginMax,
        pricingType: state.pricingType,
        category: state.category,
        originCountry: state.originCountry,
        material: state.material,
        source: state.source,
        htsCode: state.htsCode,
        htsDutyRateMin: state.htsDutyRateMin,
        htsDutyRateMax: state.htsDutyRateMax,
        listingScoreMin: state.listingScoreMin,
        listingScoreMax: state.listingScoreMax,
        shippingMethod: state.shippingMethod,
      }),
    }
  )
);

// ============================================================
// セレクター
// ============================================================

export const useActiveFilterCount = () => 
  useGlobalFilterStore((state) => state.getActiveFilterCount());

// ============================================================
// アクション
// ============================================================

export const globalFilterActions = {
  setFilters: (filters: Partial<GlobalFilterState>) => 
    useGlobalFilterStore.getState().setFilters(filters),
  resetFilters: () => 
    useGlobalFilterStore.getState().resetFilters(),
  toApiParams: () => 
    useGlobalFilterStore.getState().toApiParams(),
};
