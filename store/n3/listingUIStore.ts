// store/n3/listingUIStore.ts
/**
 * Listing N3 UI Store - 出品管理用UI状態
 *
 * 責務:
 * - ページネーション
 * - フィルター状態
 * - ソート状態
 * - 選択状態
 * - タブ状態
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

// ローカル型定義（循環参照を避けるため）
type Marketplace = 'ebay' | 'amazon' | 'mercari' | 'yahoo' | 'rakuten';
type ListingStatus = 'draft' | 'pending' | 'scheduled' | 'active' | 'sold' | 'ended' | 'error';

export type ListingTabId = 'seo' | 'pricing' | 'bulk' | 'editor' | 'variations';

interface ListingFilterParams {
  marketplace?: Marketplace[];
  status?: ListingStatus[];
  search?: string;
  priceRange?: { min: number; max: number };
  seoScoreMin?: number;
  category?: string;
  dateRange?: { start: string; end: string };
}

interface ListingUIState {
  // タブ
  activeTab: ListingTabId;

  // ページネーション
  currentPage: number;
  pageSize: number;

  // フィルター
  filters: ListingFilterParams;

  // ソート
  sortField: string;
  sortOrder: 'asc' | 'desc';

  // 選択状態
  selectedIds: string[];

  // 表示設定
  viewMode: 'list' | 'card' | 'compact';
  showStats: boolean;
}

interface ListingUIActions {
  // タブ
  setActiveTab: (tab: ListingTabId) => void;

  // ページネーション
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // フィルター
  setFilters: (filters: ListingFilterParams) => void;
  updateFilter: <K extends keyof ListingFilterParams>(key: K, value: ListingFilterParams[K]) => void;
  clearFilters: () => void;

  // ソート
  setSort: (field: string, order?: 'asc' | 'desc') => void;

  // 選択
  selectItem: (id: string) => void;
  selectItems: (ids: string[]) => void;
  deselectItem: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // 表示設定
  setViewMode: (mode: 'list' | 'card' | 'compact') => void;
  toggleStats: () => void;

  // リセット
  reset: () => void;
}

type ListingUIStore = ListingUIState & ListingUIActions;

// ============================================================
// 初期状態
// ============================================================

const initialState: ListingUIState = {
  activeTab: 'seo',
  currentPage: 1,
  pageSize: 50,
  filters: {},
  sortField: 'updatedAt',
  sortOrder: 'desc',
  selectedIds: [],
  viewMode: 'list',
  showStats: true,
};

// ============================================================
// Store
// ============================================================

export const useListingUIStore = create<ListingUIStore>()(
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
            if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
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
            const index = state.selectedIds.indexOf(id);
            if (index === -1) {
              state.selectedIds.push(id);
            } else {
              state.selectedIds.splice(index, 1);
            }
          });
        },

        selectItems: (ids) => {
          set((state) => {
            ids.forEach(id => {
              if (!state.selectedIds.includes(id)) {
                state.selectedIds.push(id);
              }
            });
          });
        },

        deselectItem: (id) => {
          set((state) => {
            const index = state.selectedIds.indexOf(id);
            if (index !== -1) {
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

        // ========================================
        // リセット
        // ========================================

        reset: () => {
          set(initialState);
        },
      })),
      {
        name: 'listing-n3-ui-store',
        partialize: (state) => ({
          pageSize: state.pageSize,
          viewMode: state.viewMode,
          showStats: state.showStats,
          sortField: state.sortField,
          sortOrder: state.sortOrder,
        }),
      }
    ),
    { name: 'ListingUIStore' }
  )
);

// ============================================================
// セレクター（値ごとに分離 - ゴールドスタンダード準拠）
// ============================================================

export const useListingActiveTab = () => useListingUIStore(state => state.activeTab);
export const useListingCurrentPage = () => useListingUIStore(state => state.currentPage);
export const useListingPageSize = () => useListingUIStore(state => state.pageSize);
export const useListingFilters = () => useListingUIStore(state => state.filters);
export const useListingSortField = () => useListingUIStore(state => state.sortField);
export const useListingSortOrder = () => useListingUIStore(state => state.sortOrder);
export const useListingSelectedIds = () => useListingUIStore(state => state.selectedIds);
export const useListingViewMode = () => useListingUIStore(state => state.viewMode);
export const useListingShowStats = () => useListingUIStore(state => state.showStats);

// ============================================================
// アクション取得
// ============================================================

export const listingUIActions = {
  setActiveTab: (tab: ListingTabId) => useListingUIStore.getState().setActiveTab(tab),
  setPage: (page: number) => useListingUIStore.getState().setPage(page),
  setFilters: (filters: ListingFilterParams) => useListingUIStore.getState().setFilters(filters),
  clearFilters: () => useListingUIStore.getState().clearFilters(),
  selectItem: (id: string) => useListingUIStore.getState().selectItem(id),
  selectAll: (ids: string[]) => useListingUIStore.getState().selectAll(ids),
  clearSelection: () => useListingUIStore.getState().clearSelection(),
  reset: () => useListingUIStore.getState().reset(),
};
