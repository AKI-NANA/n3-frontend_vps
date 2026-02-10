// store/product/domainStore.ts
/**
 * Product Domain Store - クライアントドメイン状態
 * 
 * 責務:
 * - 未保存の変更追跡 (modifiedProducts)
 * - 選択状態 (selectedIds)
 * - 新規作成中のデータ (draftProduct)
 * 
 * 特徴:
 * - Immer による安全な状態更新
 * - DevTools 連携
 * - サーバーデータは保持しない（React Query の責務）
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Product, ProductIdString, LocalChange, ModifiedMap } from './types';

// ============================================================
// State 型定義
// ============================================================

interface ProductDomainState {
  // 変更追跡（キー: productId, 値: 変更内容）
  modifiedProducts: ModifiedMap;
  
  // 選択状態
  selectedIds: Set<string>;
  
  // 新規作成中のデータ
  draftProduct: Partial<Product> | null;
  
  // エラー状態（ドメイン固有）
  saveError: string | null;
}

interface ProductDomainActions {
  // 変更追跡
  trackChange: (productId: ProductIdString, original: Partial<Product>, updates: Partial<Product>) => void;
  updateChange: (productId: ProductIdString, updates: Partial<Product>) => void;
  discardChange: (productId: ProductIdString) => void;
  discardAllChanges: () => void;
  markAsSaved: (productIds: ProductIdString[]) => void;
  
  // 選択
  select: (productId: ProductIdString) => void;
  deselect: (productId: ProductIdString) => void;
  toggleSelect: (productId: ProductIdString) => void;
  selectAll: (productIds: ProductIdString[]) => void;
  deselectAll: () => void;
  setSelectedIds: (ids: Set<string>) => void;
  
  // ドラフト
  setDraft: (product: Partial<Product> | null) => void;
  updateDraft: (updates: Partial<Product>) => void;
  clearDraft: () => void;
  
  // エラー
  setSaveError: (error: string | null) => void;
  
  // リセット
  reset: () => void;
}

type ProductDomainStore = ProductDomainState & ProductDomainActions;

// ============================================================
// 初期状態
// ============================================================

const initialState: ProductDomainState = {
  modifiedProducts: {},
  selectedIds: new Set(),
  draftProduct: null,
  saveError: null,
};

// ============================================================
// Store
// ============================================================

export const useProductDomainStore = create<ProductDomainStore>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,

        // ========================================
        // 変更追跡
        // ========================================

        trackChange: (productId, original, updates) => {
          set((state) => {
            const existing = state.modifiedProducts[productId];
            if (existing) {
              // 既存の変更に追加
              state.modifiedProducts[productId] = {
                original: existing.original,
                current: { ...existing.current, ...updates },
                changedAt: new Date().toISOString(),
              };
            } else {
              // 新規変更
              state.modifiedProducts[productId] = {
                original,
                current: updates,
                changedAt: new Date().toISOString(),
              };
            }
          });
        },

        updateChange: (productId, updates) => {
          set((state) => {
            const existing = state.modifiedProducts[productId];
            if (existing) {
              state.modifiedProducts[productId].current = {
                ...existing.current,
                ...updates,
              };
              state.modifiedProducts[productId].changedAt = new Date().toISOString();
            }
          });
        },

        discardChange: (productId) => {
          set((state) => {
            delete state.modifiedProducts[productId];
          });
        },

        discardAllChanges: () => {
          set((state) => {
            state.modifiedProducts = {};
          });
        },

        markAsSaved: (productIds) => {
          set((state) => {
            for (const id of productIds) {
              delete state.modifiedProducts[id];
            }
          });
        },

        // ========================================
        // 選択
        // ========================================

        select: (productId) => {
          set((state) => {
            state.selectedIds = new Set(state.selectedIds).add(productId);
          });
        },

        deselect: (productId) => {
          set((state) => {
            const newSet = new Set(state.selectedIds);
            newSet.delete(productId);
            state.selectedIds = newSet;
          });
        },

        toggleSelect: (productId) => {
          set((state) => {
            const newSet = new Set(state.selectedIds);
            if (newSet.has(productId)) {
              newSet.delete(productId);
            } else {
              newSet.add(productId);
            }
            state.selectedIds = newSet;
          });
        },

        selectAll: (productIds) => {
          set((state) => {
            state.selectedIds = new Set(productIds);
          });
        },

        deselectAll: () => {
          set((state) => {
            state.selectedIds = new Set();
          });
        },

        setSelectedIds: (ids) => {
          set((state) => {
            state.selectedIds = ids;
          });
        },

        // ========================================
        // ドラフト
        // ========================================

        setDraft: (product) => {
          set((state) => {
            state.draftProduct = product;
          });
        },

        updateDraft: (updates) => {
          set((state) => {
            if (state.draftProduct) {
              state.draftProduct = { ...state.draftProduct, ...updates };
            }
          });
        },

        clearDraft: () => {
          set((state) => {
            state.draftProduct = null;
          });
        },

        // ========================================
        // エラー
        // ========================================

        setSaveError: (error) => {
          set((state) => {
            state.saveError = error;
          });
        },

        // ========================================
        // リセット
        // ========================================

        reset: () => {
          set(initialState);
        },
      }))
    ),
    { name: 'ProductDomainStore' }
  )
);

// ============================================================
// セレクター
// ============================================================

/** 変更済み商品ID一覧 */
export const useModifiedIdsSelector = (): ProductIdString[] => {
  return useProductDomainStore((state) => Object.keys(state.modifiedProducts));
};

/** 変更済み商品数 */
export const useModifiedCountSelector = (): number => {
  return useProductDomainStore((state) => Object.keys(state.modifiedProducts).length);
};

/** 特定商品が変更済みか */
export const useIsModifiedSelector = (productId: ProductIdString): boolean => {
  return useProductDomainStore((state) => productId in state.modifiedProducts);
};

/** 特定商品の変更内容 */
export const useProductChangeSelector = (productId: ProductIdString): LocalChange | undefined => {
  return useProductDomainStore((state) => state.modifiedProducts[productId]);
};

/** 選択済み商品ID一覧 */
export const useSelectedIdsSelector = (): Set<string> => {
  return useProductDomainStore((state) => state.selectedIds);
};

/** 選択済み商品数 */
export const useSelectedCountSelector = (): number => {
  return useProductDomainStore((state) => state.selectedIds.size);
};

/** 特定商品が選択済みか */
export const useIsSelectedSelector = (productId: ProductIdString): boolean => {
  return useProductDomainStore((state) => state.selectedIds.has(productId));
};

// ============================================================
// アクション取得（コンポーネント外から使用）
// ============================================================

export const productDomainActions = {
  trackChange: (productId: ProductIdString, original: Partial<Product>, updates: Partial<Product>) =>
    useProductDomainStore.getState().trackChange(productId, original, updates),
  updateChange: (productId: ProductIdString, updates: Partial<Product>) =>
    useProductDomainStore.getState().updateChange(productId, updates),
  discardChange: (productId: ProductIdString) =>
    useProductDomainStore.getState().discardChange(productId),
  discardAllChanges: () =>
    useProductDomainStore.getState().discardAllChanges(),
  markAsSaved: (productIds: ProductIdString[]) =>
    useProductDomainStore.getState().markAsSaved(productIds),
  select: (productId: ProductIdString) =>
    useProductDomainStore.getState().select(productId),
  deselect: (productId: ProductIdString) =>
    useProductDomainStore.getState().deselect(productId),
  toggleSelect: (productId: ProductIdString) =>
    useProductDomainStore.getState().toggleSelect(productId),
  selectAll: (productIds: ProductIdString[]) =>
    useProductDomainStore.getState().selectAll(productIds),
  deselectAll: () =>
    useProductDomainStore.getState().deselectAll(),
  setSelectedIds: (ids: Set<string>) =>
    useProductDomainStore.getState().setSelectedIds(ids),
  reset: () =>
    useProductDomainStore.getState().reset(),
};

// ============================================================
// ユーティリティ
// ============================================================

/** 変更済み商品データを取得（保存用） */
export const getModifiedProductsData = (): Array<{ id: ProductIdString; updates: Partial<Product> }> => {
  const state = useProductDomainStore.getState();
  return Object.entries(state.modifiedProducts).map(([id, change]) => ({
    id,
    updates: change.current,
  }));
};

/** 選択済み商品IDを配列で取得 */
export const getSelectedIdsArray = (): ProductIdString[] => {
  return Array.from(useProductDomainStore.getState().selectedIds);
};
