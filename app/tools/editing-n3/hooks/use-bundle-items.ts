// app/tools/editing-n3/hooks/use-bundle-items.ts
/**
 * セット品構成管理フック
 * 
 * 機能:
 * - セット品の構成取得
 * - 構成の追加・削除
 * - セット在庫計算
 * - シングル検索
 */

'use client';

import { useState, useCallback } from 'react';

export interface BundleComponent {
  id: string;
  quantity: number;
  created_at: string;
  inventory: {
    id: string;
    sku: string;
    product_name: string;
    physical_quantity: number;
    reserved_quantity: number;
    cost_price: number;
    images?: string[];
  } | null;
}

export interface SetStockInfo {
  availableSetCount: number;
  bottleneck: {
    inventoryId: string;
    sku: string;
    productName: string;
    availableQty: number;
    requiredQty: number;
    possibleSets: number;
  } | null;
  hasComponents: boolean;
  componentCount?: number;
}

export interface InventorySearchResult {
  id: string;
  sku: string;
  product_name: string;
  physical_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  image_url: string | null;
  product_type: string;
  cost_price: number;
}

export function useBundleItems() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [components, setComponents] = useState<BundleComponent[]>([]);
  const [setStock, setSetStock] = useState<SetStockInfo | null>(null);
  const [searchResults, setSearchResults] = useState<InventorySearchResult[]>([]);

  // セット品の構成を取得
  const fetchComponents = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/bundle?productId=${productId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch bundle components');
      }
      
      setComponents(data.components || []);
      setSetStock(data.setStock || null);
      
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch components';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // 構成を追加
  const addComponent = useCallback(async (
    parentProductId: string,
    childInventoryId: string,
    quantity: number = 1
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bundle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentProductId,
          childInventoryId,
          quantity,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to add component');
      }
      
      // 再取得して最新状態に更新
      await fetchComponents(parentProductId);
      
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add component';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchComponents]);

  // 構成を削除
  const removeComponent = useCallback(async (
    bundleItemId: string,
    parentProductId: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/bundle?id=${bundleItemId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to remove component');
      }
      
      // 再取得して最新状態に更新
      await fetchComponents(parentProductId);
      
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to remove component';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchComponents]);

  // 構成の数量を更新
  const updateComponentQuantity = useCallback(async (
    parentProductId: string,
    childInventoryId: string,
    quantity: number
  ) => {
    return addComponent(parentProductId, childInventoryId, quantity);
  }, [addComponent]);

  // 一括追加
  const bulkAddComponents = useCallback(async (
    items: { parentProductId: string; childInventoryId: string; quantity?: number }[]
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bundle/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to bulk add components');
      }
      
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to bulk add components';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // シングル在庫を検索
  const searchInventory = useCallback(async (
    query: string,
    excludeIds: string[] = [],
    excludeSets: boolean = true
  ) => {
    if (!query || query.length < 1) {
      setSearchResults([]);
      return [];
    }
    
    try {
      const params = new URLSearchParams({
        q: query,
        excludeSets: String(excludeSets),
        limit: '20',
      });
      
      if (excludeIds.length > 0) {
        params.set('excludeIds', excludeIds.join(','));
      }
      
      const response = await fetch(`/api/inventory/search?${params}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Search failed');
      }
      
      setSearchResults(data.results || []);
      return data.results || [];
    } catch (err: any) {
      console.error('Search error:', err);
      setSearchResults([]);
      return [];
    }
  }, []);

  // 検索結果をクリア
  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
  }, []);

  // セット販売時の在庫減算
  const decrementSetInventory = useCallback(async (
    productId: string,
    quantity: number = 1,
    orderId?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/inventory/decrement-set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity,
          orderId,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to decrement inventory');
      }
      
      // セット在庫を更新
      if (data.newSetStock) {
        setSetStock(data.newSetStock);
      }
      
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to decrement inventory';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // 状態
    loading,
    error,
    components,
    setStock,
    searchResults,
    
    // アクション
    fetchComponents,
    addComponent,
    removeComponent,
    updateComponentQuantity,
    bulkAddComponents,
    searchInventory,
    clearSearchResults,
    decrementSetInventory,
  };
}
