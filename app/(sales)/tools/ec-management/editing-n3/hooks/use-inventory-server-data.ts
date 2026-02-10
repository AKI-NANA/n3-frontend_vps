// app/tools/editing-n3/hooks/use-inventory-server-data.ts
/**
 * 棚卸しデータフック - サーバーサイドフィルタリング版
 * 
 * Phase 4: パフォーマンス最適化
 * - サーバーサイドでフィルタリング・ソート・ページネーション
 * - 大量データでも高速レスポンス
 * - クライアント側のメモリ使用量を削減
 * 
 * 使い分け:
 * - use-inventory-data.ts: 全件ロード（統計・グループ化に使用）
 * - use-inventory-server-data.ts: ページ単位ロード（リスト表示に使用）
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { InventoryProduct, InventoryFilter, SortOption } from './use-inventory-data';

interface ServerInventoryState {
  products: InventoryProduct[];
  loading: boolean;
  error: string | null;
  stats: {
    totalInPage: number;
    totalFiltered: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const DEFAULT_STATE: ServerInventoryState = {
  products: [],
  loading: false,
  error: null,
  stats: {
    totalInPage: 0,
    totalFiltered: 0,
    page: 1,
    limit: 50,
    totalPages: 0,
  },
};

export function useInventoryServerData() {
  const [state, setState] = useState<ServerInventoryState>(DEFAULT_STATE);
  const [filter, setFilter] = useState<InventoryFilter>({});
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'created_at', order: 'desc' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  
  // リクエストのキャンセル用
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // データ取得
  const fetchData = useCallback(async () => {
    // 前のリクエストをキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // クエリパラメータ構築
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      params.set('sortField', sortOption.field);
      params.set('sortOrder', sortOption.order);
      
      // フィルターパラメータ
      if (filter.attrL1) params.set('attrL1', filter.attrL1);
      if (filter.attrL2) params.set('attrL2', filter.attrL2);
      if (filter.attrL3) params.set('attrL3', filter.attrL3);
      if (filter.search) params.set('search', filter.search);
      if (filter.inventoryType) params.set('inventoryType', filter.inventoryType);
      if (filter.ebayAccount) params.set('ebayAccount', filter.ebayAccount);
      if (filter.noImages) params.set('noImages', 'true');
      if (filter.masterOnly) params.set('masterOnly', 'true');
      if (filter.variationStatus) params.set('variationStatus', filter.variationStatus);
      if (filter.productType) params.set('productType', filter.productType);
      
      const response = await fetch(`/api/inventory/list?${params.toString()}`, {
        signal: abortControllerRef.current.signal,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error');
      }
      
      // データ変換（N3表示用フィールドを追加）
      const products: InventoryProduct[] = (result.data || []).map((item: any) => ({
        ...item,
        // N3表示用エイリアス
        title: item.product_name,
        image_url: item.images?.[0] || null,
        cost_jpy: item.cost_price || 0,
        current_stock: item.physical_quantity || 0,
        stock_status: item.physical_quantity > 5 ? 'in_stock' 
          : item.physical_quantity > 0 ? 'low_stock' 
          : 'out_of_stock',
        ebay_account: item.source_data?.ebay_account || null,
      }));
      
      setState({
        products,
        loading: false,
        error: null,
        stats: result.stats,
      });
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // キャンセルされた場合は何もしない
        return;
      }
      
      console.error('[useInventoryServerData] Fetch error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'データ取得に失敗しました',
      }));
    }
  }, [page, limit, filter, sortOption]);
  
  // フィルター・ページ変更時に自動取得
  useEffect(() => {
    fetchData();
    
    return () => {
      // クリーンアップ時にリクエストをキャンセル
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);
  
  // フィルター変更時にページをリセット
  const handleSetFilter = useCallback((newFilter: InventoryFilter | ((prev: InventoryFilter) => InventoryFilter)) => {
    setFilter(newFilter);
    setPage(1);
  }, []);
  
  // 表示件数変更時にページをリセット
  const handleSetLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);
  
  // 一括属性更新
  const bulkUpdateAttributes = useCallback(async (
    ids: string[],
    attributes: { attr_l1?: string; attr_l2?: string; attr_l3?: string }
  ) => {
    try {
      const response = await fetch('/api/inventory/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk_update_attributes',
          ids,
          updates: attributes,
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // データを再取得
      await fetchData();
      
      return { success: true, updated: result.updated };
    } catch (error: any) {
      console.error('[useInventoryServerData] Bulk update error:', error);
      return { success: false, error: error.message };
    }
  }, [fetchData]);
  
  // 一括在庫タイプ更新
  const bulkUpdateInventoryType = useCallback(async (
    ids: string[],
    inventoryType: 'stock' | 'backorder'
  ) => {
    try {
      const response = await fetch('/api/inventory/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk_update_inventory_type',
          ids,
          updates: { inventory_type: inventoryType },
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // データを再取得
      await fetchData();
      
      return { success: true, updated: result.updated };
    } catch (error: any) {
      console.error('[useInventoryServerData] Bulk update error:', error);
      return { success: false, error: error.message };
    }
  }, [fetchData]);
  
  return {
    // データ
    products: state.products,
    
    // 状態
    loading: state.loading,
    error: state.error,
    
    // 統計・ページネーション
    stats: state.stats,
    page,
    limit,
    totalPages: state.stats.totalPages,
    totalItems: state.stats.totalFiltered,
    
    // ページネーション操作
    setPage,
    setLimit: handleSetLimit,
    
    // フィルター
    filter,
    setFilter: handleSetFilter,
    
    // ソート
    sortOption,
    setSortOption,
    
    // アクション
    refresh: fetchData,
    bulkUpdateAttributes,
    bulkUpdateInventoryType,
  };
}
