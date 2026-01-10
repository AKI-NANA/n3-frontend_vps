// store/product/uiStore.ts
/**
 * Product UI Store - クライアントUI状態
 * 
 * 責務:
 * - ページネーション (currentPage, pageSize)
 * - フィルター状態
 * - ソート状態
 * - UI表示設定
 * 
 * 特徴:
 * - サーバーデータに依存しない純粋なUI状態
 * - URLパラメータとの同期が可能
 * - コンポーネント間で共有が必要なUI状態のみ
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  ProductFilterParams, 
  ProductSortParams,
  ListingStatus,
  ProductType,
} from '@/app/tools/editing/types/product';

// ============================================================
// State 型定義
// ============================================================

interface ProductUIState {
  // ページネーション
  currentPage: number;
  pageSize: number;
  
  // フィルター
  filters: ProductFilterParams;
  
  // ソート
  sort: ProductSortParams;
  
  // 表示設定
  viewMode: 'list' | 'card';
  wrapText: boolean;
  showTooltips: boolean;
  useVirtualScroll: boolean;
  
  // 言語
  language: 'ja' | 'en';
  
  // リストフィルター（L3）
  listFilter: ListFilterType;
}

interface ProductUIActions {
  // ページネーション
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetPagination: () => void;
  
  // フィルター
  setFilters: (filters: ProductFilterParams) => void;
  updateFilter: <K extends keyof ProductFilterParams>(key: K, value: ProductFilterParams[K]) => void;
  clearFilters: () => void;
  
  // ソート
  setSort: (sort: ProductSortParams) => void;
  toggleSortOrder: () => void;
  
  // 表示設定
  setViewMode: (mode: 'list' | 'card') => void;
  setWrapText: (wrap: boolean) => void;
  setShowTooltips: (show: boolean) => void;
  setUseVirtualScroll: (use: boolean) => void;
  
  // 言語
  setLanguage: (lang: 'ja' | 'en') => void;
  
  // リストフィルター
  setListFilter: (filter: ListFilterType) => void;
  
  // リセット
  reset: () => void;
}

type ProductUIStore = ProductUIState & ProductUIActions;

// ============================================================
// 追加の型
// ============================================================

export type ListFilterType = 
  | 'all'
  | 'draft'  // 追加: 下書き（未出品商品）
  | 'data_editing'
  | 'approval_pending'
  | 'approved'  // 追加: 承認済み
  | 'scheduled' // 追加: 出品予約
  | 'active_listings'
  | 'in_stock'
  | 'variation'
  | 'set_products'
  | 'in_stock_master'
  | 'back_order_only'
  | 'out_of_stock'
  | 'delisted_only';

// ============================================================
// 初期状態
// ============================================================

const initialFilters: ProductFilterParams = {};

const initialSort: ProductSortParams = {
  field: 'sku',
  order: 'asc',
};

const initialState: ProductUIState = {
  currentPage: 1,
  pageSize: 25,  // 🚀 50→ 25に削減（初期表示高速化）
  filters: initialFilters,
  sort: initialSort,
  viewMode: 'list',
  wrapText: false,
  showTooltips: true,
  useVirtualScroll: true,
  language: 'ja',
  listFilter: 'all',
};

// ============================================================
// Store
// ============================================================

export const useProductUIStore = create<ProductUIStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

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
            state.currentPage = 1; // ページサイズ変更時は1ページ目に戻す
          });
        },

        resetPagination: () => {
          set((state) => {
            state.currentPage = 1;
            state.pageSize = 50;
          });
        },

        // ========================================
        // フィルター
        // ========================================

        setFilters: (filters) => {
          set((state) => {
            state.filters = filters;
            state.currentPage = 1; // フィルター変更時は1ページ目に戻す
          });
        },

        updateFilter: (key, value) => {
          set((state) => {
            if (value === undefined || value === null || value === '') {
              delete state.filters[key];
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

        setSort: (sort) => {
          set((state) => {
            state.sort = sort;
          });
        },

        toggleSortOrder: () => {
          set((state) => {
            state.sort.order = state.sort.order === 'asc' ? 'desc' : 'asc';
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

        setWrapText: (wrap) => {
          set((state) => {
            state.wrapText = wrap;
          });
        },

        setShowTooltips: (show) => {
          set((state) => {
            state.showTooltips = show;
          });
        },

        setUseVirtualScroll: (use) => {
          set((state) => {
            state.useVirtualScroll = use;
          });
        },

        // ========================================
        // 言語
        // ========================================

        setLanguage: (lang) => {
          set((state) => {
            state.language = lang;
          });
        },

        // ========================================
        // リストフィルター
        // ========================================

        setListFilter: (filter) => {
          console.log('[ProductUIStore] setListFilter called with:', filter);
          set((state) => {
            state.listFilter = filter;
            state.currentPage = 1;
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
        name: 'product-ui-store',
        // 永続化するフィールドを選択
        partialize: (state) => ({
          pageSize: state.pageSize,
          viewMode: state.viewMode,
          wrapText: state.wrapText,
          showTooltips: state.showTooltips,
          useVirtualScroll: state.useVirtualScroll,
          language: state.language,
          sort: state.sort,
        }),
      }
    ),
    { name: 'ProductUIStore' }
  )
);

// ============================================================
// セレクター
// ============================================================

/** ページネーション情報 */
export const usePaginationSelector = () => {
  const currentPage = useProductUIStore((state) => state.currentPage);
  const pageSize = useProductUIStore((state) => state.pageSize);
  return { currentPage, pageSize };
};

/** フィルター情報 */
export const useFiltersSelector = () => {
  return useProductUIStore((state) => state.filters);
};

/** ソート情報 */
export const useSortSelector = () => {
  return useProductUIStore((state) => state.sort);
};

/** 表示設定 */
export const useViewSettingsSelector = () => {
  const viewMode = useProductUIStore((state) => state.viewMode);
  const wrapText = useProductUIStore((state) => state.wrapText);
  const showTooltips = useProductUIStore((state) => state.showTooltips);
  const useVirtualScroll = useProductUIStore((state) => state.useVirtualScroll);
  return { viewMode, wrapText, showTooltips, useVirtualScroll };
};

// ============================================================
// アクション取得（コンポーネント外から使用）
// ============================================================

export const productUIActions = {
  setPage: (page: number) => useProductUIStore.getState().setPage(page),
  setPageSize: (size: number) => useProductUIStore.getState().setPageSize(size),
  setFilters: (filters: ProductFilterParams) => useProductUIStore.getState().setFilters(filters),
  clearFilters: () => useProductUIStore.getState().clearFilters(),
  setSort: (sort: ProductSortParams) => useProductUIStore.getState().setSort(sort),
  setViewMode: (mode: 'list' | 'card') => useProductUIStore.getState().setViewMode(mode),
  setListFilter: (filter: ListFilterType) => useProductUIStore.getState().setListFilter(filter),
  reset: () => useProductUIStore.getState().reset(),
};
