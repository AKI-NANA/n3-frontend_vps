// store/productStore.ts
/**
 * Product Store - Zustand による正規化された商品状態管理
 * 
 * 設計原則:
 * 1. 正規化: products配列 → productMap（ID→Product）
 * 2. セレクター: 必要なデータのみ取得して再レンダリング最小化
 * 3. 分離: UI固有の状態は含めない（各ツールのローカルフックで管理）
 * 
 * React Query との連携:
 * - データフェッチは React Query が管理
 * - Store は正規化されたデータと UI 状態を保持
 * - onSuccess コールバックで Store を更新
 * 
 * 重要: Zustand 5.x 対応（Immerなしで手動イミュータブル更新）
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

// ============================================================
// 型定義（editing/types/product.ts と同期）
// ============================================================

export interface Product {
  id: string | number;
  sku?: string | null;
  title?: string;
  title_en?: string | null;
  english_title?: string | null;
  price_jpy?: number | null;
  price_usd?: number | null;
  current_price?: number | null;
  status?: string | null;
  images?: any[] | string[] | null;
  primary_image_url?: string | null;
  isModified?: boolean;
  
  // 追加フィールド（頻繁に使用されるもの）
  category?: string | null;
  category_id?: string | null;
  condition?: string | null;
  hts_code?: string | null;
  origin_country?: string | null;
  profit_margin?: number | null;
  profit_amount_usd?: number | null;
  shipping_cost_usd?: number | null;
  sm_sales_count?: number | null;
  sm_competitor_count?: number | null;
  workflow_status?: string | null;
  filter_passed?: boolean | null;
  
  // その他のフィールドは dynamic
  [key: string]: any;
}

interface ProductState {
  // 正規化されたデータ（共有データ）
  productMap: Record<string, Product>;
  productIds: string[];
  
  // メタデータ
  total: number;
  currentPage: number;
  pageSize: number;
  
  // ローディング・エラー状態
  loading: boolean;
  error: string | null;
  
  // 変更追跡（配列で管理 - Setは参照問題があるため）
  modifiedIds: string[];
  
  // アクション
  setProducts: (products: Product[], total?: number) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  updateProducts: (updates: Array<{ id: string; data: Partial<Product> }>) => void;
  removeProducts: (productIds: string[]) => void;
  clearModified: () => void;
  markAsSaved: (productIds: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (page: number, pageSize: number) => void;
  reset: () => void;
}

// ============================================================
// Store
// ============================================================

export const useProductStore = create<ProductState>()(
  subscribeWithSelector((set, get) => ({
    // 初期状態
    productMap: {},
    productIds: [],
    total: 0,
    currentPage: 1,
    pageSize: 50,
    loading: false,
    error: null,
    modifiedIds: [],

    /**
     * 商品データをセット（正規化して保存）
     */
    setProducts: (products: Product[], total?: number) => {
      const productMap: Record<string, Product> = {};
      const productIds: string[] = [];
      
      for (const product of products) {
        const id = String(product.id);
        productMap[id] = { ...product, isModified: false };
        productIds.push(id);
      }
      
      set({
        productMap,
        productIds,
        total: total ?? products.length,
        loading: false,
        error: null,
      });
      
      console.log(`📦 Store: ${products.length}件の商品をセット`);
    },

    /**
     * 個別商品を更新
     */
    updateProduct: (productId: string, updates: Partial<Product>) => {
      const state = get();
      const existing = state.productMap[productId];
      if (!existing) {
        console.warn(`⚠️ Store: 商品 ${productId} が見つかりません`);
        return;
      }
      
      // 新しいオブジェクトを作成
      const updatedProduct = { ...existing, ...updates, isModified: true };
      
      // modifiedIdsに追加（重複チェック）
      const newModifiedIds = state.modifiedIds.includes(productId)
        ? state.modifiedIds
        : [...state.modifiedIds, productId];
      
      set({
        productMap: {
          ...state.productMap,
          [productId]: updatedProduct,
        },
        modifiedIds: newModifiedIds,
      });
      
      console.log(`📝 Store: 商品 ${productId} を更新`);
    },

    /**
     * 複数商品を一括更新
     */
    updateProducts: (updates: Array<{ id: string; data: Partial<Product> }>) => {
      const state = get();
      const newProductMap = { ...state.productMap };
      const newModifiedIds = [...state.modifiedIds];
      
      for (const { id, data } of updates) {
        const existing = newProductMap[id];
        if (existing) {
          newProductMap[id] = { ...existing, ...data, isModified: true };
          if (!newModifiedIds.includes(id)) {
            newModifiedIds.push(id);
          }
        }
      }
      
      set({
        productMap: newProductMap,
        modifiedIds: newModifiedIds,
      });
      
      console.log(`📝 Store: ${updates.length}件の商品を一括更新`);
    },

    /**
     * 商品を削除
     */
    removeProducts: (productIds: string[]) => {
      const state = get();
      const newProductMap = { ...state.productMap };
      
      for (const id of productIds) {
        delete newProductMap[id];
      }
      
      set({
        productMap: newProductMap,
        productIds: state.productIds.filter(id => !productIds.includes(id)),
        total: Math.max(0, state.total - productIds.length),
        modifiedIds: state.modifiedIds.filter(id => !productIds.includes(id)),
      });
      
      console.log(`🗑️ Store: ${productIds.length}件の商品を削除`);
    },

    /**
     * 変更フラグをクリア（全件）
     */
    clearModified: () => {
      const state = get();
      const newProductMap = { ...state.productMap };
      
      for (const id of state.modifiedIds) {
        if (newProductMap[id]) {
          newProductMap[id] = { ...newProductMap[id], isModified: false };
        }
      }
      
      set({
        productMap: newProductMap,
        modifiedIds: [],
      });
      
      console.log('✅ Store: 変更フラグをクリア');
    },

    /**
     * 指定した商品の変更フラグをクリア
     */
    markAsSaved: (productIds: string[]) => {
      const state = get();
      const newProductMap = { ...state.productMap };
      
      for (const id of productIds) {
        if (newProductMap[id]) {
          newProductMap[id] = { ...newProductMap[id], isModified: false };
        }
      }
      
      set({
        productMap: newProductMap,
        modifiedIds: state.modifiedIds.filter(id => !productIds.includes(id)),
      });
      
      console.log(`✅ Store: ${productIds.length}件の変更フラグをクリア`);
    },

    /**
     * ローディング状態を設定
     */
    setLoading: (loading: boolean) => {
      set({ loading });
    },

    /**
     * エラー状態を設定
     */
    setError: (error: string | null) => {
      set({ error, loading: false });
    },

    /**
     * ページネーション設定
     */
    setPagination: (page: number, pageSize: number) => {
      set({ currentPage: page, pageSize });
    },

    /**
     * ストアをリセット
     */
    reset: () => {
      set({
        productMap: {},
        productIds: [],
        total: 0,
        currentPage: 1,
        pageSize: 50,
        loading: false,
        error: null,
        modifiedIds: [],
      });
      console.log('🔄 Store: リセット');
    },
  }))
);

// ============================================================
// セレクター（再レンダリング最適化）
// ============================================================

/**
 * 特定商品を取得（その商品変更時のみ再レンダリング）
 */
export const useProductSelector = (productId: string): Product | undefined => {
  return useProductStore((state) => state.productMap[productId]);
};

/**
 * 商品IDリストのみ取得（商品データ変更で再レンダリングしない）
 */
export const useProductIdsSelector = (): string[] => {
  return useProductStore((state) => state.productIds);
};

/**
 * 商品数のみ取得
 */
export const useProductCountSelector = (): number => {
  return useProductStore((state) => state.productIds.length);
};

/**
 * ローディング状態のみ取得
 */
export const useLoadingSelector = (): boolean => {
  return useProductStore((state) => state.loading);
};

/**
 * エラー状態のみ取得
 */
export const useErrorSelector = (): string | null => {
  return useProductStore((state) => state.error);
};

/**
 * 変更済みID配列を取得
 */
export const useModifiedIdsSelector = (): string[] => {
  return useProductStore((state) => state.modifiedIds);
};

/**
 * ページネーション情報を取得（shallow比較で最適化）
 */
export const usePaginationSelector = () => {
  return useProductStore(
    (state) => ({
      total: state.total,
      currentPage: state.currentPage,
      pageSize: state.pageSize,
    }),
    shallow
  );
};

/**
 * 変更済み商品数のみ取得
 */
export const useModifiedCountSelector = (): number => {
  return useProductStore((state) => state.modifiedIds.length);
};

/**
 * 特定商品が変更済みかチェック
 */
export const useIsModifiedSelector = (productId: string): boolean => {
  return useProductStore((state) => state.modifiedIds.includes(productId));
};

// ============================================================
// ユーティリティ関数（コンポーネント外から使用）
// ============================================================

/**
 * 商品配列を取得（getStateで直接取得）
 */
export const getProductArray = (): Product[] => {
  const state = useProductStore.getState();
  return state.productIds
    .map(id => state.productMap[id])
    .filter((p): p is Product => p !== undefined);
};

/**
 * 変更済み商品を配列で取得
 */
export const getModifiedProducts = (): Product[] => {
  const state = useProductStore.getState();
  const products: Product[] = [];
  for (const id of state.modifiedIds) {
    const product = state.productMap[id];
    if (product) products.push(product);
  }
  return products;
};

/**
 * 特定の商品を取得
 */
export const getProduct = (productId: string): Product | undefined => {
  return useProductStore.getState().productMap[productId];
};

// ============================================================
// アクション取得（コンポーネント外から使用）
// ============================================================

export const productStoreActions = {
  setProducts: (products: Product[], total?: number) => 
    useProductStore.getState().setProducts(products, total),
  updateProduct: (id: string, updates: Partial<Product>) => 
    useProductStore.getState().updateProduct(id, updates),
  updateProducts: (updates: Array<{ id: string; data: Partial<Product> }>) =>
    useProductStore.getState().updateProducts(updates),
  removeProducts: (ids: string[]) => 
    useProductStore.getState().removeProducts(ids),
  clearModified: () => 
    useProductStore.getState().clearModified(),
  markAsSaved: (ids: string[]) =>
    useProductStore.getState().markAsSaved(ids),
  setLoading: (loading: boolean) => 
    useProductStore.getState().setLoading(loading),
  setError: (error: string | null) => 
    useProductStore.getState().setError(error),
  setPagination: (page: number, pageSize: number) => 
    useProductStore.getState().setPagination(page, pageSize),
  reset: () => 
    useProductStore.getState().reset(),
};

// ============================================================
// Subscribe（デバッグ用）
// ============================================================

if (process.env.NODE_ENV === 'development') {
  useProductStore.subscribe(
    (state) => state.modifiedIds.length,
    (count, prevCount) => {
      if (count !== prevCount) {
        console.log(`📊 Store: 変更済み商品数 ${prevCount} → ${count}`);
      }
    }
  );
}
