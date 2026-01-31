// store/product/uiStore.ts
/**
 * Product UI Store - クライアントUI状態
 * 
 * 責務:
 * - ページネーション (currentPage, pageSize)
 * - L3フィルター状態 (listFilter)
 * - L4工程フィルター状態 (workflowPhase) ⭐ v2 新規追加
 * - ソート状態
 * - UI表示設定
 * 
 * 特徴:
 * - サーバーデータに依存しない純粋なUI状態
 * - URLパラメータとの同期が可能
 * - コンポーネント間で共有が必要なUI状態のみ
 * - L3/L4フィルターはlocalStorage永続化
 * 
 * 🔥 v2 改修: WORKSPACE_REFACTORING_DESIGN_V1.md に基づく
 * - workflowPhase (L4) を useState から Zustand に移行
 * - L3変更時にL4をリセット
 * - L4も永続化対象に追加
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  ProductFilterParams, 
  ProductSortParams,
} from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

/**
 * L3タブフィルター
 * 母集団の絞り込み（APIパラメータ `list_filter`）
 */
export type ListFilterType = 
  | 'all'
  | 'scraped'
  | 'draft'
  | 'data_editing'
  | 'approval_pending'
  | 'approved'
  | 'scheduled'
  | 'active_listings'
  | 'in_stock'
  | 'variation'
  | 'set_products'
  | 'in_stock_master'
  | 'back_order_only'
  | 'out_of_stock'
  | 'delisted_only'
  | 'archived';  // ⭐ v2 追加

/**
 * L4工程フィルター（ProductPhase）
 * 工程別サブフィルタ（APIパラメータ `workflow_phase`）
 * 
 * ⭐ v2: useState から Zustand に移行し永続化
 */
export type ProductPhase = 
  | 'TRANSLATE'        // 翻訳待ち
  | 'SEARCH'           // SM検索待ち
  | 'SELECT_SM'        // SM選択待ち
  | 'FETCH_DETAILS'    // 詳細取得待ち
  | 'ENRICH'           // AI補完待ち
  | 'APPROVAL_PENDING' // 承認待ち
  | 'LISTED'           // 出品済み
  | 'OTHER'            // その他
  | 'ARCHIVED'         // アーカイブ
  | null;              // フィルターなし

// ============================================================
// State 型定義
// ============================================================

interface ProductUIState {
  // ページネーション
  currentPage: number;
  pageSize: number;
  
  // L3フィルター（タブ）
  listFilter: ListFilterType;
  
  // L4フィルター（工程）⭐ v2 新規追加
  workflowPhase: ProductPhase;
  
  // その他フィルター
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
}

interface ProductUIActions {
  // ページネーション
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetPagination: () => void;
  
  // L3フィルター
  setListFilter: (filter: ListFilterType) => void;
  
  // L4フィルター ⭐ v2 新規追加
  setWorkflowPhase: (phase: ProductPhase) => void;
  
  // 複合操作 ⭐ v2 新規追加
  setFilterWithReset: (l3: ListFilterType, l4?: ProductPhase) => void;
  
  // その他フィルター
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
  
  // リセット
  reset: () => void;
}

type ProductUIStore = ProductUIState & ProductUIActions;

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
  pageSize: 25,
  listFilter: 'data_editing',  // ⭐ v2: デフォルトを 'data_editing' に変更
  workflowPhase: null,         // ⭐ v2 新規追加
  filters: initialFilters,
  sort: initialSort,
  viewMode: 'list',
  wrapText: false,
  showTooltips: true,
  useVirtualScroll: true,
  language: 'ja',
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
            state.currentPage = 1;
          });
        },

        resetPagination: () => {
          set((state) => {
            state.currentPage = 1;
            state.pageSize = 25;
          });
        },

        // ========================================
        // L3フィルター（タブ）
        // ========================================

        /**
         * L3タブ変更
         * ⭐ v2: L3変更時にL4をリセット + ページ1へ
         */
        setListFilter: (filter) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[ProductUIStore] setListFilter:', filter);
          }
          set((state) => {
            state.listFilter = filter;
            state.workflowPhase = null;  // ⭐ L3変更でL4リセット
            state.currentPage = 1;
          });
        },

        // ========================================
        // L4フィルター（工程）⭐ v2 新規追加
        // ========================================

        /**
         * L4工程フィルター変更
         * ページ1へリセット
         */
        setWorkflowPhase: (phase) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[ProductUIStore] setWorkflowPhase:', phase);
          }
          set((state) => {
            state.workflowPhase = phase;
            state.currentPage = 1;
          });
        },

        // ========================================
        // 複合操作 ⭐ v2 新規追加
        // ========================================

        /**
         * L3とL4を同時に設定
         * @param l3 - L3フィルター
         * @param l4 - L4フィルター（省略時はnull）
         */
        setFilterWithReset: (l3, l4 = null) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[ProductUIStore] setFilterWithReset:', { l3, l4 });
          }
          set((state) => {
            state.listFilter = l3;
            state.workflowPhase = l4;
            state.currentPage = 1;
          });
        },

        // ========================================
        // その他フィルター
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
        // リセット
        // ========================================

        reset: () => {
          set(initialState);
        },
      })),
      {
        name: 'product-ui-store',
        // ⭐ v2: workflowPhase を永続化対象に追加
        partialize: (state) => ({
          pageSize: state.pageSize,
          listFilter: state.listFilter,    // L3 永続化
          workflowPhase: state.workflowPhase,  // ⭐ L4 永続化（新規）
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

/** L3タブフィルター */
export const useListFilterSelector = () => {
  return useProductUIStore((state) => state.listFilter);
};

/** L4工程フィルター ⭐ v2 新規追加 */
export const useWorkflowPhaseSelector = () => {
  return useProductUIStore((state) => state.workflowPhase);
};

/** L3 + L4 フィルター ⭐ v2 新規追加 */
export const useFilterStateSelector = () => {
  const listFilter = useProductUIStore((state) => state.listFilter);
  const workflowPhase = useProductUIStore((state) => state.workflowPhase);
  return { listFilter, workflowPhase };
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
  // ページネーション
  setPage: (page: number) => useProductUIStore.getState().setPage(page),
  setPageSize: (size: number) => useProductUIStore.getState().setPageSize(size),
  
  // L3フィルター
  setListFilter: (filter: ListFilterType) => useProductUIStore.getState().setListFilter(filter),
  
  // L4フィルター ⭐ v2 新規追加
  setWorkflowPhase: (phase: ProductPhase) => useProductUIStore.getState().setWorkflowPhase(phase),
  
  // 複合操作 ⭐ v2 新規追加
  setFilterWithReset: (l3: ListFilterType, l4?: ProductPhase) => 
    useProductUIStore.getState().setFilterWithReset(l3, l4),
  
  // その他フィルター
  setFilters: (filters: ProductFilterParams) => useProductUIStore.getState().setFilters(filters),
  clearFilters: () => useProductUIStore.getState().clearFilters(),
  
  // ソート
  setSort: (sort: ProductSortParams) => useProductUIStore.getState().setSort(sort),
  
  // 表示
  setViewMode: (mode: 'list' | 'card') => useProductUIStore.getState().setViewMode(mode),
  
  // リセット
  reset: () => useProductUIStore.getState().reset(),
};
