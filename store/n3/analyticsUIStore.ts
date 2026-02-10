// store/n3/analyticsUIStore.ts
/**
 * Analytics N3 UI Store - 分析用UI状態
 *
 * ゴールドスタンダード準拠:
 * - サーバーデータは React Query で管理
 * - 各セレクターは値ごとに分離
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';

// ============================================================
// State 型定義
// ============================================================

export type AnalyticsTabId = 'sales' | 'profit' | 'ai' | 'trends' | 'forecast';
export type DateRangePreset = 'today' | '7days' | '30days' | '90days' | 'custom';
export type ChartType = 'line' | 'bar' | 'area' | 'pie';

interface AnalyticsUIState {
  // タブ
  activeTab: AnalyticsTabId;

  // 日付範囲
  dateRangePreset: DateRangePreset;
  customDateRange: { start: string; end: string } | null;

  // フィルター
  marketplace: string[];
  category: string[];
  productType: string[];

  // 比較モード
  comparisonEnabled: boolean;
  comparisonPeriod: 'prev_period' | 'prev_year';

  // チャート設定
  chartType: ChartType;
  showLegend: boolean;
  showDataLabels: boolean;

  // 表示設定
  granularity: 'hour' | 'day' | 'week' | 'month';
  currency: 'JPY' | 'USD';
}

interface AnalyticsUIActions {
  setActiveTab: (tab: AnalyticsTabId) => void;
  setDateRangePreset: (preset: DateRangePreset) => void;
  setCustomDateRange: (range: { start: string; end: string }) => void;
  setMarketplace: (marketplaces: string[]) => void;
  setCategory: (categories: string[]) => void;
  setProductType: (types: string[]) => void;
  toggleComparison: () => void;
  setComparisonPeriod: (period: 'prev_period' | 'prev_year') => void;
  setChartType: (type: ChartType) => void;
  setGranularity: (granularity: 'hour' | 'day' | 'week' | 'month') => void;
  setCurrency: (currency: 'JPY' | 'USD') => void;
  clearFilters: () => void;
  reset: () => void;
}

type AnalyticsUIStore = AnalyticsUIState & AnalyticsUIActions;

// ============================================================
// 初期状態
// ============================================================

const initialState: AnalyticsUIState = {
  activeTab: 'sales',
  dateRangePreset: '30days',
  customDateRange: null,
  marketplace: [],
  category: [],
  productType: [],
  comparisonEnabled: false,
  comparisonPeriod: 'prev_period',
  chartType: 'line',
  showLegend: true,
  showDataLabels: false,
  granularity: 'day',
  currency: 'JPY',
};

// ============================================================
// Store
// ============================================================

export const useAnalyticsUIStore = create<AnalyticsUIStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setActiveTab: (tab) => {
          set((state) => {
            state.activeTab = tab;
          });
        },

        setDateRangePreset: (preset) => {
          set((state) => {
            state.dateRangePreset = preset;
            if (preset !== 'custom') {
              state.customDateRange = null;
            }
          });
        },

        setCustomDateRange: (range) => {
          set((state) => {
            state.dateRangePreset = 'custom';
            state.customDateRange = range;
          });
        },

        setMarketplace: (marketplaces) => {
          set((state) => {
            state.marketplace = marketplaces;
          });
        },

        setCategory: (categories) => {
          set((state) => {
            state.category = categories;
          });
        },

        setProductType: (types) => {
          set((state) => {
            state.productType = types;
          });
        },

        toggleComparison: () => {
          set((state) => {
            state.comparisonEnabled = !state.comparisonEnabled;
          });
        },

        setComparisonPeriod: (period) => {
          set((state) => {
            state.comparisonPeriod = period;
          });
        },

        setChartType: (type) => {
          set((state) => {
            state.chartType = type;
          });
        },

        setGranularity: (granularity) => {
          set((state) => {
            state.granularity = granularity;
          });
        },

        setCurrency: (currency) => {
          set((state) => {
            state.currency = currency;
          });
        },

        clearFilters: () => {
          set((state) => {
            state.marketplace = [];
            state.category = [];
            state.productType = [];
          });
        },

        reset: () => {
          set(initialState);
        },
      })),
      {
        name: 'analytics-n3-ui-store',
        partialize: (state) => ({
          granularity: state.granularity,
          currency: state.currency,
          chartType: state.chartType,
          showLegend: state.showLegend,
          showDataLabels: state.showDataLabels,
        }),
      }
    ),
    { name: 'AnalyticsUIStore' }
  )
);

// ============================================================
// セレクター
// ============================================================

export const useAnalyticsActiveTab = () => useAnalyticsUIStore(state => state.activeTab);
export const useAnalyticsDateRange = () => useAnalyticsUIStore(
  useShallow(state => ({
    preset: state.dateRangePreset,
    custom: state.customDateRange,
  }))
);
export const useAnalyticsMarketplace = () => useAnalyticsUIStore(state => state.marketplace);
export const useAnalyticsChartType = () => useAnalyticsUIStore(state => state.chartType);
export const useAnalyticsGranularity = () => useAnalyticsUIStore(state => state.granularity);
export const useAnalyticsCurrency = () => useAnalyticsUIStore(state => state.currency);
export const useAnalyticsComparison = () => useAnalyticsUIStore(
  useShallow(state => ({
    enabled: state.comparisonEnabled,
    period: state.comparisonPeriod,
  }))
);
