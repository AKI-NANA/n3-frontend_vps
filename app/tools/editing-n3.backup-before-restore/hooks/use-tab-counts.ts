// app/tools/editing-n3/hooks/use-tab-counts.ts
/**
 * L3タブカウント取得フック
 * 
 * products_master と inventory_master の両方からカウントを取得
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export interface TabCounts {
  // products_master 系
  all: number;
  data_editing: number;
  approval_pending: number;
  approved: number;
  scheduled: number;
  active_listings: number;
  in_stock: number;
  variation: number;
  set_products: number;
  in_stock_master: number;
  back_order_only: number;
  delisted_only: number;
}

export interface InventoryCounts {
  total: number;
  in_stock: number;
  out_of_stock: number;
  variation_parent: number;
  variation_member: number;
  variation_total: number;
  set_products: number;
  manual_entry: number;
  mjt_account: number;
  green_account: number;
  standalone: number;
}

interface UseTabCountsOptions {
  site?: string;
  ebayAccount?: string;
  autoFetch?: boolean;
}

export function useTabCounts(options: UseTabCountsOptions = {}) {
  const { site, ebayAccount, autoFetch = true } = options;
  
  const [productCounts, setProductCounts] = useState<TabCounts | null>(null);
  const [inventoryCounts, setInventoryCounts] = useState<InventoryCounts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // products_master のカウント取得
  const fetchProductCounts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (site) params.set('site', site);
      if (ebayAccount) params.set('ebay_account', ebayAccount);
      
      const response = await fetch(`/api/products/counts?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setProductCounts(data.counts);
      } else {
        console.error('Product counts error:', data.error);
      }
    } catch (err) {
      console.error('Failed to fetch product counts:', err);
    }
  }, [site, ebayAccount]);
  
  // inventory_master のカウント取得
  const fetchInventoryCounts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (site) params.set('site', site);
      if (ebayAccount) params.set('ebay_account', ebayAccount);
      
      const response = await fetch(`/api/inventory/counts?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setInventoryCounts(data.counts);
      } else {
        console.error('Inventory counts error:', data.error);
      }
    } catch (err) {
      console.error('Failed to fetch inventory counts:', err);
    }
  }, [site, ebayAccount]);
  
  // 両方のカウントを取得
  const fetchAllCounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchProductCounts(),
        fetchInventoryCounts(),
      ]);
    } catch (err: any) {
      setError(err.message || 'カウント取得エラー');
    } finally {
      setLoading(false);
    }
  }, [fetchProductCounts, fetchInventoryCounts]);
  
  // 自動取得（初回のみ）
  // ❗ P0: 無限ループ対策 - 初回のみ実行を厳密に制御
  const hasFetchedRef = useRef(false);
  const fetchAllCountsRef = useRef(fetchAllCounts);
  
  // 関数参照を更新（再レンダリングはトリガーしない）
  useEffect(() => {
    fetchAllCountsRef.current = fetchAllCounts;
  });
  
  useEffect(() => {
    if (autoFetch && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      // ref経由で安定した関数を呼び出し
      fetchAllCountsRef.current();
    }
  }, [autoFetch]);  // fetchAllCounts を依存配列から除外（初回のみ実行）
  
  // タブIDに対応するカウントを取得
  const getTabCount = useCallback((tabId: string): number => {
    // products_master 系のタブ（メインUIのタブ）
    if (!productCounts) return 0;
    
    // 直接マッピング
    switch (tabId) {
      case 'all':
        return productCounts.all || 0;
      case 'data_editing':
        return productCounts.data_editing || 0;
      case 'approval_pending':
        return productCounts.approval_pending || 0;
      case 'approved':
        return productCounts.approved || 0;
      case 'scheduled':
        return productCounts.scheduled || 0;
      case 'active_listings':
        return productCounts.active_listings || 0;
      case 'in_stock':
        return productCounts.in_stock || 0;
      case 'back_order_only':
        return productCounts.back_order_only || 0;
      case 'variation':
        return productCounts.variation || 0;
      case 'set_products':
        return productCounts.set_products || 0;
      case 'in_stock_master':
        return productCounts.in_stock_master || 0;
      case 'out_of_stock':
        return (productCounts as any).out_of_stock || 0;
      case 'delisted_only':
        return productCounts.delisted_only || 0;
      default:
        return 0;
    }
  }, [productCounts]);
  
  return {
    productCounts,
    inventoryCounts,
    loading,
    error,
    fetchAllCounts,
    fetchProductCounts,
    fetchInventoryCounts,
    getTabCount,
  };
}
