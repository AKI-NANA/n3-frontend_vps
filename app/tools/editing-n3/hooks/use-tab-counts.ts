// app/tools/editing-n3/hooks/use-tab-counts.ts
/**
 * L3タブカウント取得フック v3 - 新設計版（引き継ぎ書準拠）
 * 
 * 新タブ構造（排他的）:
 * - マスター: 全件
 * - データ編集: physical_quantity > 0 AND listing_status != 'active' AND 非アーカイブ
 * - 出品中: listing_status = 'active'
 * - 在庫0: physical_quantity = 0 AND 非アーカイブ
 * - アーカイブ: is_archived = true OR listing_status = 'archived'
 * 
 * 工程フィルター（データ編集タブ内）:
 * - 翻訳: scraped or NULL
 * - 検索: translated
 * - 選択: sm_searching
 * - 詳細: sm_selected
 * - 補完: details_fetched
 * - 承認: audited
 * - 出品済: approved
 * - その他: 上記以外
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// ============================================================
// 型定義
// ============================================================

export interface TabCounts {
  // 🔵 新タブ構造
  master: number;
  data_editing: number;
  active_listings: number;
  out_of_stock: number;
  archived: number;
  research_pending: number;  // 🔬 Research待ち
  
  // 🔵 工程フィルター
  workflow_translation: number;
  workflow_search: number;
  workflow_selection: number;
  workflow_details: number;
  workflow_enrichment: number;
  workflow_approval: number;
  workflow_listed: number;
  workflow_others: number;
  
  // 🔵 旧互換用
  all: number;
  in_stock: number;
  back_order_only: number;
  variation: number;
  set_products: number;
  in_stock_master: number;
  delisted_only: number;
  draft: number;
  scraped: number;
  approval_pending: number;
  approved: number;
  scheduled: number;
}

export interface WorkflowCounts {
  translation: number;
  search: number;
  selection: number;
  details: number;
  enrichment: number;
  approval: number;
  listed: number;
  others: number;
}

export interface IntegrityCheck {
  check: string;
  expected: number;
  actual: number;
  pass: boolean;
}

export interface CountsMeta {
  products_master_total: number;
  db_total_count: number;
  parent_records_total: number;
  tab_counts: {
    master: number;
    data_editing: number;
    active_listings: number;
    out_of_stock: number;
    archived: number;
  };
  workflow_counts: WorkflowCounts;
  integrity_checks: IntegrityCheck[];
  has_integrity_errors: boolean;
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

// ============================================================
// メインフック
// ============================================================

export function useTabCounts(options: UseTabCountsOptions = {}) {
  const { site, ebayAccount, autoFetch = true } = options;
  
  const [productCounts, setProductCounts] = useState<TabCounts | null>(null);
  const [countsMeta, setCountsMeta] = useState<CountsMeta | null>(null);
  const [inventoryCounts, setInventoryCounts] = useState<InventoryCounts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasIntegrityErrors, setHasIntegrityErrors] = useState(false);
  
  // products_master のカウント取得
  // 🔥 v4: エラーハンドリング強化 + フォールバック値
  const fetchProductCounts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (site) params.set('site', site);
      if (ebayAccount) params.set('ebay_account', ebayAccount);
      
      const response = await fetch(`/api/products/counts?${params.toString()}`);
      
      // 🔥 HTTPエラーチェック
      if (!response.ok) {
        const errorText = await response.text();
        // HTMLが返ってきた場合（404/500でNext.jsがHTMLページを返す）
        if (errorText.startsWith('<!DOCTYPE') || errorText.startsWith('<html')) {
          console.error('[useTabCounts] ❌ APIがHTMLを返却 - ルーティングエラーの可能性');
          throw new Error(`API returned HTML instead of JSON (HTTP ${response.status})`);
        }
        throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
      }
      
      // 🔥 JSONパースエラーチェック
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('[useTabCounts] ❌ JSONパースエラー:', parseError);
        throw new Error('Invalid JSON response from API');
      }
      
      if (data.success) {
        setProductCounts(data.counts);
        setCountsMeta(data.meta);
        
        // 整合性エラーチェック
        if (data.meta?.has_integrity_errors) {
          setHasIntegrityErrors(true);
          console.error('🚨 [useTabCounts] 整合性エラー検出:');
          data.meta.integrity_checks
            .filter((c: IntegrityCheck) => !c.pass)
            .forEach((c: IntegrityCheck) => {
              console.error(`  ❌ ${c.check}: 期待=${c.expected}, 実際=${c.actual}`);
            });
        } else {
          setHasIntegrityErrors(false);
          console.log('✅ [useTabCounts] 整合性チェック: すべてパス');
        }
        
        // デバッグ情報
        if (process.env.NODE_ENV === 'development') {
          console.log('[useTabCounts] v4 カウント:', {
            master: data.counts.master,
            data_editing: data.counts.data_editing,
            active_listings: data.counts.active_listings,
            out_of_stock: data.counts.out_of_stock,
            archived: data.counts.archived,
          });
        }
      } else {
        console.error('[useTabCounts] ❌ APIエラー:', data.error);
        setError(data.error);
      }
    } catch (err: any) {
      console.error('[useTabCounts] ❌ fetch失敗:', err.message);
      setError(err.message);
      // 🔥 フォールバック: エラー時は0を返す（UIが崩れないように）
      // 注: productCountsはnullのままにしてgetTabCountで0を返す
    }
  }, [site, ebayAccount]);
  
  // inventory_master のカウント取得
  // 🔥 v4: エラーハンドリング強化
  const fetchInventoryCounts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (site) params.set('site', site);
      if (ebayAccount) params.set('ebay_account', ebayAccount);
      
      const response = await fetch(`/api/inventory/counts?${params.toString()}`);
      
      // 🔥 HTTPエラーチェック
      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.startsWith('<!DOCTYPE') || errorText.startsWith('<html')) {
          console.error('[useTabCounts] ❌ inventory APIがHTMLを返却');
          return; // inventoryはオプショナルなので静かに失敗
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      // 🔥 JSONパースエラーチェック
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('[useTabCounts] ❌ inventory JSONパースエラー');
        return;
      }
      
      if (data.success) {
        setInventoryCounts(data.counts);
      } else {
        console.error('[useTabCounts] ❌ inventory APIエラー:', data.error);
      }
    } catch (err: any) {
      console.error('[useTabCounts] ❌ inventory fetch失敗:', err.message);
      // inventoryはオプショナルなのでエラーはsetしない
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
  const hasFetchedRef = useRef(false);
  const fetchAllCountsRef = useRef(fetchAllCounts);
  
  useEffect(() => {
    fetchAllCountsRef.current = fetchAllCounts;
  });
  
  useEffect(() => {
    if (autoFetch && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchAllCountsRef.current();
    }
  }, [autoFetch]);
  
  // タブIDに対応するカウントを取得
  const getTabCount = useCallback((tabId: string): number => {
    if (!productCounts) return 0;
    
    // 直接マッピング
    const count = (productCounts as any)[tabId];
    return count ?? 0;
  }, [productCounts]);
  
  // 工程フィルターのカウントを取得
  const getWorkflowCount = useCallback((workflowId: string): number => {
    if (!productCounts) return 0;
    
    const key = `workflow_${workflowId}`;
    const count = (productCounts as any)[key];
    return count ?? 0;
  }, [productCounts]);
  
  // 工程フィルターの合計を取得
  const getWorkflowTotal = useCallback((): number => {
    if (!productCounts) return 0;
    
    return (
      productCounts.workflow_translation +
      productCounts.workflow_search +
      productCounts.workflow_selection +
      productCounts.workflow_details +
      productCounts.workflow_enrichment +
      productCounts.workflow_approval +
      productCounts.workflow_listed +
      productCounts.workflow_others
    );
  }, [productCounts]);
  
  return {
    productCounts,
    countsMeta,
    inventoryCounts,
    loading,
    error,
    hasIntegrityErrors,
    fetchAllCounts,
    fetchProductCounts,
    fetchInventoryCounts,
    getTabCount,
    getWorkflowCount,
    getWorkflowTotal,
  };
}
