// store/n3/operationsUIStore.ts
/**
 * Operations N3 UI Store - オペレーション管理用UI状態
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

type Marketplace = 'ebay' | 'amazon' | 'mercari' | 'yahoo' | 'rakuten' | 'shopee' | 'qoo10' | 'all';
type OperationsTab = 'orders' | 'shipping' | 'inquiries';
type Priority = 'critical' | 'high' | 'medium' | 'low';

interface OperationsFilterParams {
  marketplace?: Marketplace;
  status?: string;
  priority?: Priority;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface OperationsUIState {
  // タブ
  activeTab: OperationsTab;

  // ページネーション
  currentPage: number;
  pageSize: number;

  // フィルター
  filters: OperationsFilterParams;

  // ソート
  sortField: string;
  sortOrder: 'asc' | 'desc';

  // 選択状態
  selectedOrderId: string | null;
  selectedShippingId: string | null;
  selectedInquiryId: string | null;
  selectedIds: string[];

  // 表示設定
  viewMode: 'list' | 'card' | 'compact';
  showStats: boolean;
  showLinkedPanel: boolean;
}

interface OperationsUIActions {
  // タブ
  setActiveTab: (tab: OperationsTab) => void;

  // ページネーション
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // フィルター
  setFilters: (filters: OperationsFilterParams) => void;
  updateFilter: <K extends keyof OperationsFilterParams>(key: K, value: OperationsFilterParams[K]) => void;
  clearFilters: () => void;

  // ソート
  setSort: (field: string, order?: 'asc' | 'desc') => void;

  // 選択
  selectOrder: (id: string | null) => void;
  selectShipping: (id: string | null) => void;
  selectInquiry: (id: string | null) => void;
  selectItem: (id: string) => void;
  selectItems: (ids: string[]) => void;
  clearSelection: () => void;

  // 表示設定
  setViewMode: (mode: 'list' | 'card' | 'compact') => void;
  toggleStats: () => void;
  toggleLinkedPanel: () => void;

  // リセット
  reset: () => void;
}

type OperationsUIStore = OperationsUIState & OperationsUIActions;

// ============================================================
// 初期状態
// ============================================================

const initialState: OperationsUIState = {
  activeTab: 'orders',
  currentPage: 1,
  pageSize: 50,
  filters: { marketplace: 'all' },
  sortField: 'orderDate',
  sortOrder: 'desc',
  selectedOrderId: null,
  selectedShippingId: null,
  selectedInquiryId: null,
  selectedIds: [],
  viewMode: 'list',
  showStats: true,
  showLinkedPanel: true,
};

// ============================================================
// Store
// ============================================================

export const useOperationsUIStore = create<OperationsUIStore>()(
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
            state.selectedOrderId = null;
            state.selectedShippingId = null;
            state.selectedInquiryId = null;
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
            state.filters = { marketplace: 'all' };
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

        selectOrder: (id) => {
          set((state) => {
            state.selectedOrderId = id;
            state.selectedShippingId = null;
            state.selectedInquiryId = null;
          });
        },

        selectShipping: (id) => {
          set((state) => {
            state.selectedShippingId = id;
            state.selectedOrderId = null;
            state.selectedInquiryId = null;
          });
        },

        selectInquiry: (id) => {
          set((state) => {
            state.selectedInquiryId = id;
            state.selectedOrderId = null;
            state.selectedShippingId = null;
          });
        },

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
            state.selectedIds = [...ids];
          });
        },

        clearSelection: () => {
          set((state) => {
            state.selectedIds = [];
            state.selectedOrderId = null;
            state.selectedShippingId = null;
            state.selectedInquiryId = null;
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

        toggleLinkedPanel: () => {
          set((state) => {
            state.showLinkedPanel = !state.showLinkedPanel;
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
        name: 'operations-n3-ui-store',
        partialize: (state) => ({
          pageSize: state.pageSize,
          viewMode: state.viewMode,
          showStats: state.showStats,
          showLinkedPanel: state.showLinkedPanel,
          sortField: state.sortField,
          sortOrder: state.sortOrder,
        }),
      }
    ),
    { name: 'OperationsUIStore' }
  )
);

// ============================================================
// セレクター（値ごとに分離 - ゴールドスタンダード準拠）
// ============================================================

export const useOperationsActiveTab = () => useOperationsUIStore(state => state.activeTab);
export const useOperationsCurrentPage = () => useOperationsUIStore(state => state.currentPage);
export const useOperationsPageSize = () => useOperationsUIStore(state => state.pageSize);
export const useOperationsFilters = () => useOperationsUIStore(state => state.filters);
export const useOperationsSortField = () => useOperationsUIStore(state => state.sortField);
export const useOperationsSortOrder = () => useOperationsUIStore(state => state.sortOrder);
export const useOperationsSelectedOrderId = () => useOperationsUIStore(state => state.selectedOrderId);
export const useOperationsSelectedShippingId = () => useOperationsUIStore(state => state.selectedShippingId);
export const useOperationsSelectedInquiryId = () => useOperationsUIStore(state => state.selectedInquiryId);
export const useOperationsSelectedIds = () => useOperationsUIStore(state => state.selectedIds);
export const useOperationsViewMode = () => useOperationsUIStore(state => state.viewMode);
export const useOperationsShowStats = () => useOperationsUIStore(state => state.showStats);
export const useOperationsShowLinkedPanel = () => useOperationsUIStore(state => state.showLinkedPanel);

// ============================================================
// アクション取得
// ============================================================

export const operationsUIActions = {
  setActiveTab: (tab: OperationsTab) => useOperationsUIStore.getState().setActiveTab(tab),
  setPage: (page: number) => useOperationsUIStore.getState().setPage(page),
  setFilters: (filters: OperationsFilterParams) => useOperationsUIStore.getState().setFilters(filters),
  clearFilters: () => useOperationsUIStore.getState().clearFilters(),
  selectOrder: (id: string | null) => useOperationsUIStore.getState().selectOrder(id),
  selectShipping: (id: string | null) => useOperationsUIStore.getState().selectShipping(id),
  selectInquiry: (id: string | null) => useOperationsUIStore.getState().selectInquiry(id),
  clearSelection: () => useOperationsUIStore.getState().clearSelection(),
  reset: () => useOperationsUIStore.getState().reset(),
};
