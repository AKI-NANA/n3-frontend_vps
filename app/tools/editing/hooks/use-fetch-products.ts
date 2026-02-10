// app/tools/editing/hooks/use-fetch-products.ts
/**
 * データフェッチHook V2 - React Query による商品データ取得
 * 
 * 設計原則:
 * - サーバーデータは React Query のみで管理（Source of Truth）
 * - Optimistic Updates対応
 * - 楽観的ロック対応
 * - 監査ログ連携
 */

import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../services/product-api';
import { 
  useProductUIStore,
  useProductDomainStore,
  productDomainActions,
  getModifiedProductsData,
} from '@/store/product';
import { logProductBulkUpdate, logProductDelete } from '@/lib/audit';
import type { 
  Product, 
  ProductMap,
  FetchProductsParams,
} from '../types/product';

// ============================================================
// Query Keys
// ============================================================

/**
 * React Query キー設計 v2 - 指示書準拠
 * 
 * 構造:
 * ['products', 'list', { workflow_status, search, sort, filters }]
 * 
 * ⚠️ 重要: workflowPhase（L4）は含めない
 * - L3変更 → 正しく再取得
 * - L4変更 → キャッシュ使い回し（クライアントフィルタ）
 * 
 * @see docs/WORKSPACE_REFACTORING_DESIGN_V1.md
 */
export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  
  /**
   * リストクエリキー
   * ⭐ L3フィルター（listFilter）はAPI再取得トリガー
   * ⭐ L4フィルター（workflowPhase）は含めない（クライアント側フィルタ）
   */
  list: (params: FetchProductsParams) => [
    'products', 
    'list', 
    {
      // L3: API再取得対象
      listFilter: params.listFilter,
      // ページネーション
      page: params.page,
      pageSize: params.pageSize,
      // ソート
      sort: params.sort,
      // その他フィルター
      filters: params.filters,
    }
  ] as const,
  
  detail: (id: string) => ['products', 'detail', id] as const,
};

// ============================================================
// 正規化
// ============================================================

interface NormalizedData {
  productMap: ProductMap;
  productIds: string[];
  total: number;
}

function normalizeProducts(products: Product[], total: number): NormalizedData {
  const productMap: ProductMap = {};
  const productIds: string[] = [];
  
  for (const product of products) {
    const id = String(product.id);
    productMap[id] = product;
    productIds.push(id);
  }
  
  return { productMap, productIds, total };
}

// ============================================================
// 型定義
// ============================================================

export interface UseFetchProductsOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export interface UseFetchProductsReturn {
  productMap: ProductMap;
  productIds: string[];
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
  invalidate: () => void;
}

// ============================================================
// メインHook
// ============================================================

export function useFetchProducts(options: UseFetchProductsOptions = {}): UseFetchProductsReturn {
  const queryClient = useQueryClient();
  
  const currentPage = useProductUIStore((state) => state.currentPage);
  const pageSize = useProductUIStore((state) => state.pageSize);
  const filters = useProductUIStore((state) => state.filters);
  const sort = useProductUIStore((state) => state.sort);
  const listFilter = useProductUIStore((state) => state.listFilter);
  
  // 🔧 デバッグ: listFilterの変化を追跡
  console.log('[useFetchProducts] Current listFilter from store:', listFilter);

  const queryParams: FetchProductsParams = useMemo(() => ({
    page: currentPage,
    pageSize,
    filters,
    sort,
    listFilter,
  }), [currentPage, pageSize, filters, sort, listFilter]);

  const query = useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(queryParams),
    queryFn: async (): Promise<NormalizedData> => {
      console.log('[useFetchProducts] Fetching with listFilter:', listFilter);
      console.log('[useFetchProducts] Full queryParams:', queryParams);
      
      // L3フィルターに応じてAPIパラメータを調整
      const apiFilters: Record<string, any> = { ...filters };
      
      switch (listFilter) {
        case 'approval_pending':
          // 承認フローに入る条件を満たした商品
          // TODO: 実際のビジネスロジックに合わせて調整
          apiFilters.ready_for_approval = true;
          break;
        case 'data_editing':
          apiFilters.status = 'editing';
          break;
        case 'active_listings':
          apiFilters.is_listed = true;
          break;
        case 'in_stock_master':
          apiFilters.has_inventory = true;
          break;
        case 'back_order_only':
          apiFilters.is_backorder = true;
          break;
        case 'delisted_only':
          apiFilters.is_delisted = true;
          break;
      }
      
      const response = await productApi.fetchProducts({
        page: currentPage,
        pageSize,
        filters: Object.keys(apiFilters).length > 0 ? apiFilters : undefined,
        listFilter,
      });
      
      return normalizeProducts(response.products, response.total);
    },
    staleTime: options.staleTime ?? 0,  // 🔧 デバッグ: キャッシュ無効化
    gcTime: options.gcTime ?? 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,  // 🔧 デバッグ: マウント時に常に再フェッチ
    enabled: options.enabled ?? true,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
  }, [queryClient]);

  const emptyData: NormalizedData = { productMap: {}, productIds: [], total: 0 };
  const data = query.data ?? emptyData;

  return {
    productMap: data.productMap,
    productIds: data.productIds,
    total: data.total,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    invalidate,
  };
}

// ============================================================
// useSaveProducts - Optimistic Updates
// ============================================================

export function useSaveProducts() {
  const queryClient = useQueryClient();
  const currentPage = useProductUIStore((state) => state.currentPage);
  const pageSize = useProductUIStore((state) => state.pageSize);
  
  return useMutation({
    mutationFn: async () => {
      const modifiedData = getModifiedProductsData();
      if (modifiedData.length === 0) {
        return { success: true, updated: 0 };
      }
      
      console.log(`[useSaveProducts] Saving ${modifiedData.length} products`);
      
      const products = modifiedData.map(({ id, updates }) => ({
        id,
        ...updates,
      })) as Product[];
      
      logProductBulkUpdate(modifiedData.map(d => d.id));
      
      return productApi.bulkUpdate(products);
    },
    
    // Optimistic Update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      
      const params: FetchProductsParams = { page: currentPage, pageSize };
      const previousData = queryClient.getQueryData<NormalizedData>(
        PRODUCT_QUERY_KEYS.list(params)
      );
      
      if (previousData) {
        const modifiedData = getModifiedProductsData();
        const newProductMap = { ...previousData.productMap };
        
        for (const { id, updates } of modifiedData) {
          if (newProductMap[id]) {
            newProductMap[id] = { ...newProductMap[id], ...updates };
          }
        }
        
        queryClient.setQueryData<NormalizedData>(
          PRODUCT_QUERY_KEYS.list(params),
          { ...previousData, productMap: newProductMap }
        );
      }
      
      return { previousData, params };
    },
    
    onSuccess: (result) => {
      console.log(`✅ 一括保存完了: ${result.updated}件`);
      productDomainActions.discardAllChanges();
    },
    
    onError: (error, _, context) => {
      console.error('❌ 一括保存エラー:', error);
      
      // ロールバック
      if (context?.previousData && context?.params) {
        queryClient.setQueryData(
          PRODUCT_QUERY_KEYS.list(context.params),
          context.previousData
        );
      }
      
      // 競合エラーの場合
      if (error && typeof error === 'object' && 'code' in error && error.code === 409) {
        useProductDomainStore.getState().setSaveError(
          '他のユーザーがこのデータを更新しました。画面をリロードして再試行してください。'
        );
      } else {
        useProductDomainStore.getState().setSaveError(
          error instanceof Error ? error.message : '保存に失敗しました'
        );
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
    },
  });
}

// ============================================================
// useDeleteProducts - Optimistic Updates
// ============================================================

export function useDeleteProducts() {
  const queryClient = useQueryClient();
  const currentPage = useProductUIStore((state) => state.currentPage);
  const pageSize = useProductUIStore((state) => state.pageSize);
  
  return useMutation({
    mutationFn: async (productIds: string[]) => {
      if (productIds.length === 0) {
        return { success: true, deleted: 0 };
      }
      
      console.log(`[useDeleteProducts] Deleting ${productIds.length} products`);
      logProductDelete(productIds);
      
      return productApi.bulkDelete(productIds);
    },
    
    // Optimistic Update
    onMutate: async (productIds) => {
      await queryClient.cancelQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      
      const params: FetchProductsParams = { page: currentPage, pageSize };
      const previousData = queryClient.getQueryData<NormalizedData>(
        PRODUCT_QUERY_KEYS.list(params)
      );
      
      if (previousData) {
        const idsToDelete = new Set(productIds);
        const newProductMap = { ...previousData.productMap };
        const newProductIds = previousData.productIds.filter(id => !idsToDelete.has(id));
        
        for (const id of productIds) {
          delete newProductMap[id];
        }
        
        queryClient.setQueryData<NormalizedData>(
          PRODUCT_QUERY_KEYS.list(params),
          { 
            productMap: newProductMap, 
            productIds: newProductIds,
            total: previousData.total - productIds.length,
          }
        );
      }
      
      return { previousData, params };
    },
    
    onSuccess: (result, deletedIds) => {
      console.log(`✅ 削除完了: ${result.deleted}件`);
      productDomainActions.deselectAll();
      deletedIds.forEach(id => productDomainActions.discardChange(id));
    },
    
    onError: (error, _, context) => {
      console.error('❌ 削除エラー:', error);
      
      if (context?.previousData && context?.params) {
        queryClient.setQueryData(
          PRODUCT_QUERY_KEYS.list(context.params),
          context.previousData
        );
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
    },
  });
}

// ============================================================
// useUploadCSV
// ============================================================

export function useUploadCSV() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ data, options }: { data: unknown[]; options?: Record<string, unknown> }) => {
      console.log(`[useUploadCSV] Uploading ${data.length} items`);
      return productApi.uploadCSV(data, options);
    },
    onSuccess: (result) => {
      console.log(`✅ CSVアップロード完了: ${result.imported}件`);
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error('❌ CSVアップロードエラー:', error);
    },
  });
}

// ============================================================
// useSaveProduct - 個別保存
// ============================================================

export function useSaveProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, product }: { productId: string; product: Product }) => {
      console.log(`[useSaveProduct] Saving product ${productId}`);
      return productApi.updateProduct(productId, product);
    },
    onSuccess: (_, { productId }) => {
      console.log(`✅ 保存完了: 商品ID ${productId}`);
      productDomainActions.markAsSaved([productId]);
    },
    onError: (error, { productId }) => {
      console.error(`❌ 保存エラー: 商品ID ${productId}`, error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
    },
  });
}

// ============================================================
// Prefetch Hooks
// ============================================================

export function usePrefetchProductDetail() {
  const queryClient = useQueryClient();
  
  return useCallback((productId: string) => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_QUERY_KEYS.detail(productId),
      queryFn: () => productApi.getProductDetail(productId),
      staleTime: 60 * 1000,
    });
  }, [queryClient]);
}

export function usePrefetchNextPage() {
  const queryClient = useQueryClient();
  const currentPage = useProductUIStore((state) => state.currentPage);
  const pageSize = useProductUIStore((state) => state.pageSize);
  
  return useCallback((total: number) => {
    const hasNextPage = currentPage * pageSize < total;
    if (hasNextPage) {
      const nextPage = currentPage + 1;
      const params: FetchProductsParams = { page: nextPage, pageSize };
      
      queryClient.prefetchQuery({
        queryKey: PRODUCT_QUERY_KEYS.list(params),
        queryFn: () => productApi.fetchProducts({ page: nextPage, pageSize }),
        staleTime: 30 * 1000,
      });
      console.log(`[Prefetch] 次ページ ${nextPage} をプリフェッチ`);
    }
  }, [queryClient, currentPage, pageSize]);
}

export function usePrefetchPrevPage() {
  const queryClient = useQueryClient();
  const currentPage = useProductUIStore((state) => state.currentPage);
  const pageSize = useProductUIStore((state) => state.pageSize);
  
  return useCallback(() => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      const params: FetchProductsParams = { page: prevPage, pageSize };
      
      queryClient.prefetchQuery({
        queryKey: PRODUCT_QUERY_KEYS.list(params),
        queryFn: () => productApi.fetchProducts({ page: prevPage, pageSize }),
        staleTime: 30 * 1000,
      });
      console.log(`[Prefetch] 前ページ ${prevPage} をプリフェッチ`);
    }
  }, [queryClient, currentPage, pageSize]);
}
