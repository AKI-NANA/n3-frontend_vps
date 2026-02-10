// app/tools/editing/hooks/use-product-interaction.ts
/**
 * 商品インタラクション管理フック - 高速化版
 * 
 * 高速化ポイント:
 * 1. Prefetching（ホバー時に先読み）- React Query のキャッシュを活用
 * 2. Optimistic UI（クリック時に即時表示）
 * 3. Debounce でホバー時の過剰なリクエストを防止
 * 4. 商品詳細取得
 */

import { useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { productApi } from '../services/product-api';
import type { Product } from '../types/product';

// Query Keys（useProductDataV2 と共通）
const QUERY_KEYS = {
  productDetail: (id: string) => ['product', id] as const,
};

// Debounce 設定
const HOVER_DEBOUNCE_MS = 150;

interface UseProductInteractionReturn {
  handleProductHover: (product: Product) => void;
  handleProductClick: (product: Product, onOpen: (product: Product) => void) => Promise<void>;
  clearPrefetchCache: () => void;
  prefetchProduct: (productId: string) => void;
}

export function useProductInteraction(): UseProductInteractionReturn {
  const queryClient = useQueryClient();
  
  // Prefetching 中のIDを追跡（重複リクエスト防止）
  const prefetchingIds = useRef<Set<string>>(new Set());
  
  // Debounce 用タイマー
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastHoveredId = useRef<string | null>(null);

  /**
   * 商品詳細をプリフェッチ（直接呼び出し用）
   */
  const prefetchProduct = useCallback((productId: string) => {
    // 既に prefetching 中またはキャッシュにあればスキップ
    if (prefetchingIds.current.has(productId)) {
      return;
    }
    
    // React Query のキャッシュをチェック
    const cachedData = queryClient.getQueryData(QUERY_KEYS.productDetail(productId));
    if (cachedData) {
      return;
    }
    
    prefetchingIds.current.add(productId);
    
    // React Query の prefetchQuery を使用
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.productDetail(productId),
      queryFn: () => productApi.getProductDetail(productId),
      staleTime: 60 * 1000, // 1分間キャッシュ
    }).finally(() => {
      prefetchingIds.current.delete(productId);
    });
  }, [queryClient]);

  /**
   * ホバー時に商品詳細を先読み（Debounce付き）
   * マウスが素早く移動した場合は無視
   */
  const handleProductHover = useCallback((product: Product) => {
    const productId = String(product.id);
    
    // 同じ商品への連続ホバーは無視
    if (lastHoveredId.current === productId) {
      return;
    }
    
    // 前のタイマーをクリア
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    
    lastHoveredId.current = productId;
    
    // Debounce: 一定時間ホバーが続いた場合のみプリフェッチ
    hoverTimerRef.current = setTimeout(() => {
      prefetchProduct(productId);
    }, HOVER_DEBOUNCE_MS);
  }, [prefetchProduct]);

  /**
   * クリック時に商品詳細を取得（Optimistic UI）
   */
  const handleProductClick = useCallback(async (
    product: Product, 
    onOpen: (product: Product) => void
  ) => {
    const productId = String(product.id);
    
    // まず現在のデータで即時表示（Optimistic UI）
    onOpen(product);
    
    try {
      // React Query のキャッシュを確認
      let cachedData = queryClient.getQueryData<{ success: boolean; data: Product | null }>(
        QUERY_KEYS.productDetail(productId)
      );
      
      let result: { success: boolean; data: Product | null };
      
      if (cachedData && cachedData.success && cachedData.data) {
        // キャッシュがあれば使用
        result = cachedData;
      } else {
        // キャッシュがなければ新規取得（React Query 経由）
        result = await queryClient.fetchQuery({
          queryKey: QUERY_KEYS.productDetail(productId),
          queryFn: () => productApi.getProductDetail(productId),
          staleTime: 60 * 1000,
        });
      }
      
      // 詳細データで更新
      if (result && result.success && result.data) {
        onOpen(result.data);
      }
    } catch (error) {
      console.error('商品データ取得エラー:', error);
      // エラー時は最初に表示したデータを維持
    }
  }, [queryClient]);

  /**
   * Prefetch キャッシュをクリア
   */
  const clearPrefetchCache = useCallback(() => {
    prefetchingIds.current.clear();
    lastHoveredId.current = null;
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    // React Query のキャッシュは invalidateQueries で管理
    queryClient.invalidateQueries({ queryKey: ['product'] });
  }, [queryClient]);

  return {
    handleProductHover,
    handleProductClick,
    clearPrefetchCache,
    prefetchProduct,
  };
}

/**
 * 複数商品を一括プリフェッチ（初期表示時など）
 */
export function useBulkPrefetch() {
  const queryClient = useQueryClient();
  
  return useCallback((productIds: string[], maxConcurrent = 5) => {
    // 最大同時リクエスト数を制限
    const idsToFetch = productIds.slice(0, maxConcurrent);
    
    idsToFetch.forEach(productId => {
      const cachedData = queryClient.getQueryData(QUERY_KEYS.productDetail(productId));
      if (!cachedData) {
        queryClient.prefetchQuery({
          queryKey: QUERY_KEYS.productDetail(productId),
          queryFn: () => productApi.getProductDetail(productId),
          staleTime: 60 * 1000,
        });
      }
    });
  }, [queryClient]);
}
