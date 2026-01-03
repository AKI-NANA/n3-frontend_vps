// app/tools/editing/hooks/useProductDataV2.ts
/**
 * 商品データ管理フック V2 - React Query + Zustand 連携版
 * 
 * アーキテクチャ:
 * - React Query: サーバー状態管理（API、キャッシュ、自動再取得）
 * - Zustand Store: クライアント状態管理（正規化データ、UI状態）
 * 
 * 無限ループ回避:
 * - データフェッチは React Query が管理
 * - Store へのセットは useEffect で data 変更時のみ
 * - productIds の参照安定化
 */

import React, { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../services/product-api';
import {
  useProductStore,
  productStoreActions,
  getProductArray,
  getModifiedProducts,
} from '@/store/productStore';
import type { Product } from '../types/product';

// Query Keys
const QUERY_KEYS = {
  products: (page: number, pageSize: number) => ['products', page, pageSize] as const,
  productDetail: (id: string) => ['product', id] as const,
};

interface UseProductDataV2Options {
  initialPage?: number;
  initialPageSize?: number;
}

export const useProductDataV2 = (options: UseProductDataV2Options = {}) => {
  const queryClient = useQueryClient();
  
  // ローカル state でページネーション管理（Store 経由だと無限ループの原因になる）
  const [currentPage, setCurrentPageState] = useState(options.initialPage ?? 1);
  const [pageSize, setPageSizeState] = useState(options.initialPageSize ?? 50);
  
  // Store から直接取得（セレクターを使わない - 参照安定化のため）
  const store = useProductStore();
  const productIds = store.productIds;
  const modifiedIds = store.modifiedIds;
  const total = store.total;
  const storeLoading = store.loading;
  const storeError = store.error;

  // 前回のデータを追跡（重複セット防止）
  const lastDataRef = useRef<string | null>(null);

  // ===========================================
  // React Query: Data Fetching
  // ===========================================

  const {
    data,
    isLoading: queryLoading,
    error: queryError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: QUERY_KEYS.products(currentPage, pageSize),
    queryFn: async () => {
      console.log('[ProductDataV2] Fetching', { page: currentPage, size: pageSize });
      const response = await productApi.fetchProducts({
        page: currentPage,
        pageSize,
      });
      return response;
    },
    staleTime: 30 * 1000, // 30秒間キャッシュ
    gcTime: 5 * 60 * 1000, // 5分間メモリ保持
    refetchOnWindowFocus: false,
  });

  // データが変更されたときのみ Store を更新
  useEffect(() => {
    if (data?.products) {
      // 同じデータの重複セット防止
      const dataKey = `${currentPage}-${pageSize}-${data.products.length}`;
      if (lastDataRef.current !== dataKey) {
        lastDataRef.current = dataKey;
        productStoreActions.setProducts(data.products, data.total);
      }
    }
  }, [data, currentPage, pageSize]);

  // ===========================================
  // Mutations
  // ===========================================

  // 一括保存
  const saveAllMutation = useMutation({
    mutationFn: async () => {
      const modifiedProducts = getModifiedProducts();
      if (modifiedProducts.length === 0) {
        return { success: true, updated: 0 };
      }
      
      console.log(`[ProductDataV2] Saving ${modifiedProducts.length} products`);
      return productApi.bulkUpdate(modifiedProducts);
    },
    onSuccess: (result) => {
      console.log(`✅ 一括保存完了: ${result.updated}件`);
      productStoreActions.clearModified();
      // キャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('❌ 一括保存エラー:', error);
      productStoreActions.setError(error instanceof Error ? error.message : '保存に失敗しました');
    },
  });

  // 一括削除
  const deleteMutation = useMutation({
    mutationFn: async (productIds: string[]) => {
      if (productIds.length === 0) {
        return { success: true, deleted: 0 };
      }
      
      console.log(`[ProductDataV2] Deleting ${productIds.length} products`);
      return productApi.bulkDelete(productIds);
    },
    onSuccess: (result, deletedIds) => {
      console.log(`✅ 削除完了: ${result.deleted}件`);
      productStoreActions.removeProducts(deletedIds);
      // キャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('❌ 削除エラー:', error);
      productStoreActions.setError(error instanceof Error ? error.message : '削除に失敗しました');
    },
  });

  // CSVアップロード
  const uploadCSVMutation = useMutation({
    mutationFn: async ({ data, options }: { data: any[]; options?: any }) => {
      console.log(`[ProductDataV2] Uploading CSV: ${data.length} items`);
      return productApi.uploadCSV(data, options);
    },
    onSuccess: (result) => {
      console.log(`✅ CSVアップロード完了: ${result.imported}件`);
      // キャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('❌ CSVアップロードエラー:', error);
      productStoreActions.setError(error instanceof Error ? error.message : 'アップロードに失敗しました');
    },
  });

  // ===========================================
  // Actions (Callbacks)
  // ===========================================

  /**
   * ページネーション設定
   */
  const setCurrentPage = useCallback((page: number) => {
    setCurrentPageState(page);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setCurrentPageState(1); // ページサイズ変更時は1ページ目に戻す
    setPageSizeState(size);
  }, []);

  /**
   * 商品一覧を再読み込み
   */
  const loadProducts = useCallback(async () => {
    console.log('[ProductDataV2] Manual refetch triggered', Date.now());
    lastDataRef.current = null; // 強制更新のためリセット
    return refetch();
  }, [refetch]);

  /**
   * ローカル商品データを更新（Store経由）
   */
  const updateLocalProduct = useCallback((productId: string, updates: Partial<Product>) => {
    productStoreActions.updateProduct(productId, updates);
    console.log(`📝 ローカル更新: 商品ID ${productId}`, updates);
  }, []);

  /**
   * 個別商品をデータベースに保存
   */
  const saveProduct = useCallback(async (productId: string) => {
    const products = getProductArray();
    const product = products.find((p) => String(p.id) === productId);
    if (!product) return;

    try {
      await productApi.updateProduct(productId, product);
      
      // Store の変更フラグをクリア
      productStoreActions.markAsSaved([productId]);

      console.log(`✅ 保存完了: 商品ID ${productId}`);
    } catch (error) {
      console.error(`❌ 保存エラー: 商品ID ${productId}`, error);
      throw error;
    }
  }, []);

  /**
   * 変更された全商品を一括保存
   */
  const saveAllModified = useCallback(async () => {
    return saveAllMutation.mutateAsync();
  }, [saveAllMutation]);

  /**
   * 商品を削除
   */
  const deleteProducts = useCallback(async (ids: string[]) => {
    return deleteMutation.mutateAsync(ids);
  }, [deleteMutation]);

  /**
   * CSVアップロード
   */
  const uploadCSV = useCallback(async (csvData: any[], options: any = {}) => {
    return uploadCSVMutation.mutateAsync({ data: csvData, options });
  }, [uploadCSVMutation]);

  // ===========================================
  // Derived State
  // ===========================================

  // Products array (computed from Store)
  // productIds の参照が変わった時のみ再計算
  const products = useMemo(() => {
    return getProductArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIds.length, productIds[0], productIds[productIds.length - 1]]);

  // Combined loading state
  const loading = queryLoading || isFetching || storeLoading || 
    saveAllMutation.isPending || deleteMutation.isPending || uploadCSVMutation.isPending;

  // Combined error
  const error = queryError?.message || storeError || null;

  // ModifiedIds as Set (for backward compatibility)
  const modifiedIdsSet = useMemo(() => new Set(modifiedIds), [modifiedIds]);

  // ===========================================
  // Return
  // ===========================================

  return {
    // Data
    products,
    productIds,
    total,
    
    // State
    loading,
    error,
    modifiedIds: modifiedIdsSet,
    
    // Pagination
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    
    // Actions
    loadProducts,
    updateLocalProduct,
    saveProduct,
    saveAllModified,
    deleteProducts,
    uploadCSV,
    
    // Mutation states (for UI feedback)
    isSaving: saveAllMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUploading: uploadCSVMutation.isPending,
  };
};

// ===========================================
// Prefetch Helper
// ===========================================

/**
 * 商品詳細をプリフェッチ（ホバー時に使用）
 */
export const usePrefetchProduct = () => {
  const queryClient = useQueryClient();
  
  return useCallback((productId: string) => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.productDetail(productId),
      queryFn: () => productApi.getProductDetail(productId),
      staleTime: 60 * 1000, // 1分間キャッシュ
    });
  }, [queryClient]);
};

/**
 * 次ページをプリフェッチ
 */
export const usePrefetchNextPage = () => {
  const queryClient = useQueryClient();
  const store = useProductStore();
  const { currentPage, pageSize, total } = {
    currentPage: store.currentPage,
    pageSize: store.pageSize,
    total: store.total,
  };
  
  return useCallback(() => {
    const hasNextPage = currentPage * pageSize < total;
    if (hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.products(currentPage + 1, pageSize),
        queryFn: () => productApi.fetchProducts({ page: currentPage + 1, pageSize }),
        staleTime: 30 * 1000,
      });
    }
  }, [queryClient, currentPage, pageSize, total]);
};
