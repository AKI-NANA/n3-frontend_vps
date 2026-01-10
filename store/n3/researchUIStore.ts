// store/n3/researchUIStore.ts
/**
 * Research N3 UI Store - リサーチ管理用UI状態
 *
 * 責務:
 * - タブ状態
 * - フィルター状態
 * - 選択状態
 * - 表示設定
 *
 * ゴールドスタンダード準拠:
 * - サーバーデータは React Query で管理（このStoreには持たない）
 * - 各セレクターは値ごとに分離
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================
// State 型定義
// ============================================================

type ResearchSource = 'ebay_sold' | 'ebay_seller' | 'amazon' | 'yahoo_auction' | 'rakuten' | 'manual' | 'batch';
type WorkflowStatus = 'new' | 'analyzing' | 'approved' | 'rejected' | 'promoted';
type KaritoriStatus = 'none' | 'watching' | 'alert' | 'purchased' | 'skipped';
type RiskLevel = 'low' | 'medium' | 'high';
type ResearchTab = 'research' | 'karitori' | 'supplier' | 'approval';

interface ResearchFilterParams {
  source?: ResearchSource;
  status?: WorkflowStatus;
  karitoriStatus?: KaritoriStatus;
  riskLevel?: RiskLevel;
  minProfitMargin?: number;
  maxProfitMargin?: number;
  minScore?: number;
  search?: string;
}

interface ResearchUIState {
  // タブ
  activeTab: ResearchTab;

  // ページネーション
  currentPage: number;
  pageSize: number;

  // フィルター
  filters: ResearchFilterParams;

  // ソート
  sortField: string;
  sortOrder: 'asc' | 'desc';

  // 選択状態
  selectedIds: string[];
  selectedItemId: string | null;

  // 表示設定
  viewMode: 'table' | 'card' | 'compact';
  showStats: boolean;
  showProfitCalculator: boolean;
}

interface ResearchUIActions {
  // タブ
  setActiveTab: (tab: ResearchTab) => void;

  // ページネーション
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // フィルター
  setFilters: (filters: ResearchFilterParams) => void;
  updateFilter: <K extends keyof ResearchFilterParams>(key: K, value: ResearchFilterParams[K]) => void;
  clearFilters: () => void;

  // ソート
  setSort: (field: string, order?: 'asc' | 'desc') => void;

  // 選択
  selectItem: (id: string | null) => void;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // 表示設定
  setViewMode: (mode: 'table' | 'card' | 'compact') => void;
  toggleStats: () => void;
  toggleProfitCalculator: () => void;

  // リセット
  reset: () => void;
}

type ResearchUIStore = ResearchUIState & ResearchUIActions;

// ============================================================
// 初期状態
// ============================================================

const initialState: ResearchUIState = {
  activeTab: 'research',
  currentPage: 1,
  pageSize: 50,
  filters: {},
  sortField: 'created_at',
  sortOrder: 'desc',
  selectedIds: [],
  selectedItemId: null,
  viewMode: 'table',
  showStats: true,
  showProfitCalculator: false,
};

// ============================================================
// Store
// ============================================================

export const useResearchUIStore = create<ResearchUIStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        // ========================================
        // タブ
        // ========================================

        setActiveTab: (tab) => {
          set((state) => {
            state.activeTab = tab;
            state.currentPage = 1;
            state.selectedIds = [];
            state.selectedItemId = null;
          });
        },

        // ========================================
        // ページネーション
        // ========================================

        setPage: (page) => {
          set((state) => {
            state.currentPage = Math.max(1, page);
          });
        },

        setPageSize: (size) => {
          set((state) => {
            state.pageSize = size;
            state.currentPage = 1;
          });
        },

        // ========================================
        // フィルター
        // ========================================

        setFilters: (filters) => {
          set((state) => {
            state.filters = filters;
            state.currentPage = 1;
          });
        },

        updateFilter: (key, value) => {
          set((state) => {
            if (value === undefined || value === null || value === '') {
              delete (state.filters as Record<string, unknown>)[key];
            } else {
              (state.filters as Record<string, unknown>)[key] = value;
            }
            state.currentPage = 1;
          });
        },

        clearFilters: () => {
          set((state) => {
            state.filters = {};
            state.currentPage = 1;
          });
        },

        // ========================================
        // ソート
        // ========================================

        setSort: (field, order) => {
          set((state) => {
            if (state.sortField === field && !order) {
              state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
              state.sortField = field;
              state.sortOrder = order || 'desc';
            }
          });
        },

        // ========================================
        // 選択
        // ========================================

        selectItem: (id) => {
          set((state) => {
            state.selectedItemId = id;
          });
        },

        toggleSelect: (id) => {
          set((state) => {
            const index = state.selectedIds.indexOf(id);
            if (index === -1) {
              state.selectedIds.push(id);
            } else {
              state.selectedIds.splice(index, 1);
            }
          });
        },

        selectAll: (ids) => {
          set((state) => {
            state.selectedIds = [...ids];
          });
        },

        clearSelection: () => {
          set((state) => {
            state.selectedIds = [];
            state.selectedItemId = null;
          });
        },

        // ========================================
        // 表示設定
        // ========================================

        setViewMode: (mode) => {
          set((state) => {
            state.viewMode = mode;
          });
        },

        toggleStats: () => {
          set((state) => {
            state.showStats = !state.showStats;
          });
        },

        toggleProfitCalculator: () => {
          set((state) => {
            state.showProfitCalculator = !state.showProfitCalculator;
          });
        },

        // ========================================
        // リセット
        // ========================================

        reset: () => {
          set(initialState);
        },
      })),
      {
        name: 'research-n3-ui-store',
        partialize: (state) => ({
          pageSize: state.pageSize,
          viewMode: state.viewMode,
          showStats: state.showStats,
          sortField: state.sortField,
          sortOrder: state.sortOrder,
        }),
      }
    ),
    { name: 'ResearchUIStore' }
  )
);

// ============================================================
// セレクター（値ごとに分離 - ゴールドスタンダード準拠）
// ============================================================

export const useResearchActiveTab = () => useResearchUIStore(state => state.activeTab);
export const useResearchCurrentPage = () => useResearchUIStore(state => state.currentPage);
export const useResearchPageSize = () => useResearchUIStore(state => state.pageSize);
export const useResearchFilters = () => useResearchUIStore(state => state.filters);
export const useResearchSortField = () => useResearchUIStore(state => state.sortField);
export const useResearchSortOrder = () => useResearchUIStore(state => state.sortOrder);
export const useResearchSelectedIds = () => useResearchUIStore(state => state.selectedIds);
export const useResearchSelectedItemId = () => useResearchUIStore(state => state.selectedItemId);
export const useResearchViewMode = () => useResearchUIStore(state => state.viewMode);
export const useResearchShowStats = () => useResearchUIStore(state => state.showStats);
export const useResearchShowProfitCalculator = () => useResearchUIStore(state => state.showProfitCalculator);

// ============================================================
// アクション取得
// ============================================================

export const researchUIActions = {
  setActiveTab: (tab: ResearchTab) => useResearchUIStore.getState().setActiveTab(tab),
  setPage: (page: number) => useResearchUIStore.getState().setPage(page),
  setFilters: (filters: ResearchFilterParams) => useResearchUIStore.getState().setFilters(filters),
  clearFilters: () => useResearchUIStore.getState().clearFilters(),
  selectItem: (id: string | null) => useResearchUIStore.getState().selectItem(id),
  toggleSelect: (id: string) => useResearchUIStore.getState().toggleSelect(id),
  selectAll: (ids: string[]) => useResearchUIStore.getState().selectAll(ids),
  clearSelection: () => useResearchUIStore.getState().clearSelection(),
  reset: () => useResearchUIStore.getState().reset(),
};
