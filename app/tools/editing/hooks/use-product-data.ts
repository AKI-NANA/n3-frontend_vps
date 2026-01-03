// app/tools/editing/hooks/use-product-data.ts
/**
 * 商品データ管理フック - 最適化版 V3
 * 
 * 設計原則（Gemini推奨アーキテクチャ）:
 * - サーバーデータ → React Query（Source of Truth）
 * - クライアントドメイン状態 → Zustand (domainStore)
 * - UI状態 → Zustand (uiStore)
 * - このフックは統合インターフェースとして機能
 * 
 * データフロー:
 * 1. React Query がサーバーからデータ取得 + 正規化
 * 2. ローカル変更は domainStore で追跡
 * 3. このフックで両者をマージして返す
 */

import { useCallback, useMemo } from 'react';
import {
  useFetchProducts,
  useSaveProducts,
  useDeleteProducts,
  useUploadCSV,
  useSaveProduct,
  usePrefetchProductDetail,
  usePrefetchNextPage,
} from './use-fetch-products';
import {
  useProductDomainStore,
  useProductUIStore,
  productDomainActions,
  productUIActions,
  getModifiedProductsData,
  getSelectedIdsArray,
} from '@/store/product';
import type { Product, ProductUpdate } from '../types/product';

// ============================================================
// 型定義
// ============================================================

export interface UseProductDataOptions {
  enabled?: boolean;
}

export interface UseProductDataReturn {
  // Data（マージ済み）
  products: Product[];
  productIds: string[];
  total: number;
  
  // State
  loading: boolean;
  error: string | null;
  modifiedIds: Set<string>;
  selectedIds: Set<string>;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  
  // Actions
  loadProducts: () => Promise<void>;
  updateLocalProduct: (productId: string, updates: ProductUpdate) => void;
  saveProduct: (productId: string) => Promise<void>;
  saveAllModified: () => Promise<unknown>;
  deleteProducts: (ids: string[]) => Promise<unknown>;
  uploadCSV: (data: unknown[], options?: Record<string, unknown>) => Promise<unknown>;
  
  // Selection
  selectProduct: (id: string) => void;
  deselectProduct: (id: string) => void;
  toggleSelectProduct: (id: string) => void;
  selectAllProducts: () => void;
  deselectAllProducts: () => void;
  setSelectedIds: (ids: Set<string>) => void;
  
  // Mutation States
  isSaving: boolean;
  isDeleting: boolean;
  isUploading: boolean;
}

// ============================================================
// メインフック
// ============================================================

export function useProductData(options: UseProductDataOptions = {}): UseProductDataReturn {
  // ============================================================
  // 1. React Query からサーバーデータ取得（正規化済み）
  // ============================================================
  
  const {
    productMap,
    productIds: serverProductIds,
    total,
    isLoading: fetchLoading,
    isFetching,
    error: fetchError,
    refetch,
  } = useFetchProducts({ enabled: options.enabled });

  // ============================================================
  // 2. Zustand Store からクライアント状態取得
  // ============================================================
  
  // Domain Store（個別セレクター）
  const modifiedProducts = useProductDomainStore((state) => state.modifiedProducts);
  const selectedIds = useProductDomainStore((state) => state.selectedIds);
  const saveError = useProductDomainStore((state) => state.saveError);
  
  // UI Store（個別セレクター）
  const currentPage = useProductUIStore((state) => state.currentPage);
  const pageSize = useProductUIStore((state) => state.pageSize);

  // ============================================================
  // 3. Mutations
  // ============================================================
  
  const saveMutation = useSaveProducts();
  const deleteMutation = useDeleteProducts();
  const uploadMutation = useUploadCSV();
  const saveProductMutation = useSaveProduct();

  // ============================================================
  // 4. データ統合（サーバーデータ + ローカル変更をマージ）
  // ============================================================
  
  const products = useMemo(() => {
    return serverProductIds.map(id => {
      const serverProduct = productMap[id];
      const localChange = modifiedProducts[id];
      
      if (localChange) {
        // ローカル変更をマージ
        return {
          ...serverProduct,
          ...localChange.current,
          isModified: true,
        };
      }
      
      return serverProduct;
    }).filter((p): p is Product => p !== undefined);
  }, [serverProductIds, productMap, modifiedProducts]);

  // 変更済みID
  const modifiedIdsSet = useMemo(
    () => new Set(Object.keys(modifiedProducts)),
    [modifiedProducts]
  );

  // 統合ローディング状態
  const loading = fetchLoading || isFetching ||
    saveMutation.isPending || deleteMutation.isPending || uploadMutation.isPending;

  // 統合エラー状態
  const error = fetchError?.message || saveError || null;

  // ============================================================
  // 5. Actions
  // ============================================================

  /**
   * 商品一覧を再読み込み
   */
  const loadProducts = useCallback(async () => {
    console.log('[useProductData] loadProducts triggered');
    await refetch();
  }, [refetch]);

  /**
   * ローカル商品データを更新
   */
  const updateLocalProduct = useCallback((productId: string, updates: ProductUpdate) => {
    const serverProduct = productMap[productId];
    if (!serverProduct) {
      console.warn(`[useProductData] Product ${productId} not found`);
      return;
    }
    
    // 元データと変更を追跡
    productDomainActions.trackChange(productId, serverProduct, updates);
  }, [productMap]);

  /**
   * 個別商品を保存
   */
  const saveProduct = useCallback(async (productId: string) => {
    const serverProduct = productMap[productId];
    const localChange = modifiedProducts[productId];
    
    if (!serverProduct) {
      console.warn(`[useProductData] Product ${productId} not found`);
      return;
    }
    
    const productToSave: Product = localChange
      ? { ...serverProduct, ...localChange.current }
      : serverProduct;
    
    await saveProductMutation.mutateAsync({ productId, product: productToSave });
  }, [productMap, modifiedProducts, saveProductMutation]);

  /**
   * 変更された全商品を一括保存
   */
  const saveAllModified = useCallback(async () => {
    return saveMutation.mutateAsync();
  }, [saveMutation]);

  /**
   * 商品を削除
   */
  const deleteProductsAction = useCallback(async (ids: string[]) => {
    return deleteMutation.mutateAsync(ids);
  }, [deleteMutation]);

  /**
   * CSVアップロード
   */
  const uploadCSVAction = useCallback(async (data: unknown[], opts?: Record<string, unknown>) => {
    return uploadMutation.mutateAsync({ data, options: opts });
  }, [uploadMutation]);

  // ============================================================
  // 6. Selection Actions
  // ============================================================

  const selectProduct = useCallback((id: string) => {
    productDomainActions.select(id);
  }, []);

  const deselectProduct = useCallback((id: string) => {
    productDomainActions.deselect(id);
  }, []);

  const toggleSelectProduct = useCallback((id: string) => {
    productDomainActions.toggleSelect(id);
  }, []);

  const selectAllProducts = useCallback(() => {
    productDomainActions.selectAll(serverProductIds);
  }, [serverProductIds]);

  const deselectAllProducts = useCallback(() => {
    productDomainActions.deselectAll();
  }, []);

  const setSelectedIds = useCallback((ids: Set<string>) => {
    productDomainActions.setSelectedIds(ids);
  }, []);

  // ============================================================
  // 7. Return
  // ============================================================
  
  return {
    // Data（マージ済み）
    products,
    productIds: serverProductIds,
    total,
    
    // State
    loading,
    error,
    modifiedIds: modifiedIdsSet,
    selectedIds,
    
    // Pagination
    currentPage,
    pageSize,
    setCurrentPage: productUIActions.setPage,
    setPageSize: productUIActions.setPageSize,
    
    // Actions
    loadProducts,
    updateLocalProduct,
    saveProduct,
    saveAllModified,
    deleteProducts: deleteProductsAction,
    uploadCSV: uploadCSVAction,
    
    // Selection
    selectProduct,
    deselectProduct,
    toggleSelectProduct,
    selectAllProducts,
    deselectAllProducts,
    setSelectedIds,
    
    // Mutation States
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUploading: uploadMutation.isPending,
  };
}

// ============================================================
// Re-exports
// ============================================================

export { usePrefetchProductDetail as usePrefetchProduct } from './use-fetch-products';
export { usePrefetchNextPage } from './use-fetch-products';

// デフォルトエクスポート
export default useProductData;
