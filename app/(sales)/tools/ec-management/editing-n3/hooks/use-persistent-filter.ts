// app/tools/editing-n3/hooks/use-persistent-filter.ts
/**
 * usePersistentFilter - グローバル永続フィルターフック
 * 
 * 機能:
 * 1. タブを跨いだフィルター状態の管理
 * 2. API リクエストへの自動パラメータ付与
 * 3. 連動プルダウンの生成
 * 
 * 設計原則:
 * - タブ切り替えでもフィルター状態を維持
 * - Zustand Store と連携
 * - useRef で関数参照を安定化
 */

'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  usePersistentFilterStore,
  useAttributeFilter,
  useAttributeOptions,
  useVerifiedFilter,
  useFilterActive,
  persistentFilterActions,
} from '@/store/persistentFilter';

// ============================================================
// カスタムフック
// ============================================================

export function usePersistentFilter() {
  // Store からの状態取得
  const attribute = useAttributeFilter();
  const options = useAttributeOptions();
  const verified = useVerifiedFilter();
  const isActive = useFilterActive();
  
  // 関数参照を安定化（無限ループ対策）
  const fetchOptionsRef = useRef(persistentFilterActions.fetchAttributeOptions);
  useEffect(() => {
    fetchOptionsRef.current = persistentFilterActions.fetchAttributeOptions;
  });

  // 初回マウント時に属性オプションを取得
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (!hasInitializedRef.current && !options.lastFetched) {
      hasInitializedRef.current = true;
      fetchOptionsRef.current();
    }
  }, [options.lastFetched]);

  // 属性変更ハンドラー
  const handleL1Change = useCallback((value: string | null) => {
    persistentFilterActions.setAttributeL1(value);
  }, []);

  const handleL2Change = useCallback((value: string | null) => {
    persistentFilterActions.setAttributeL2(value);
  }, []);

  const handleL3Change = useCallback((value: string | null) => {
    persistentFilterActions.setAttributeL3(value);
  }, []);

  const handleClearAttribute = useCallback(() => {
    persistentFilterActions.clearAttribute();
  }, []);

  // 確定フィルターハンドラー
  const handleToggleVerifiedOnly = useCallback(() => {
    persistentFilterActions.toggleVerifiedOnly();
  }, []);

  // フィルター有効/無効ハンドラー
  const handleToggleActive = useCallback(() => {
    persistentFilterActions.toggleActive();
  }, []);

  // リセットハンドラー
  const handleReset = useCallback(() => {
    persistentFilterActions.reset();
  }, []);

  // APIクエリパラメータを生成
  const getQueryParams = useCallback(() => {
    return persistentFilterActions.getQueryParams();
  }, []);

  // URLSearchParams形式で取得
  const getURLSearchParams = useCallback(() => {
    const params = persistentFilterActions.getQueryParams();
    return new URLSearchParams(params);
  }, []);

  // フィルターがアクティブかどうか（何か選択されているか）
  const hasActiveFilter = !!(attribute.l1 || attribute.l2 || attribute.l3 || verified.showVerifiedOnly);

  return {
    // 状態
    attribute,
    options,
    verified,
    isActive,
    hasActiveFilter,
    
    // L1 オプション（常に全て表示）
    l1Options: options.l1Options,
    
    // L2 オプション（L1に依存）
    l2Options: attribute.l1 ? options.l2Options : [],
    
    // L3 オプション（L2に依存）
    l3Options: attribute.l2 ? options.l3Options : [],
    
    // ローディング状態
    loading: options.loading,
    error: options.error,
    
    // ハンドラー
    setL1: handleL1Change,
    setL2: handleL2Change,
    setL3: handleL3Change,
    clearAttribute: handleClearAttribute,
    toggleVerifiedOnly: handleToggleVerifiedOnly,
    toggleActive: handleToggleActive,
    reset: handleReset,
    
    // クエリパラメータ
    getQueryParams,
    getURLSearchParams,
    
    // オプション再取得
    refreshOptions: persistentFilterActions.fetchAttributeOptions,
  };
}

// ============================================================
// 確定済み商品の判定ユーティリティ
// ============================================================

/**
 * 商品が確定済み（is_verified + 必須フィールド入力済み）かどうか判定
 */
export function isProductVerified(product: {
  is_verified?: boolean;
  cost_price?: number;
  physical_quantity?: number;
  product_name?: string;
  title?: string;
}): boolean {
  // is_verified フラグが明示的に true
  if (product.is_verified !== true) return false;
  
  // 原価が入力されている
  const hasCost = typeof product.cost_price === 'number' && product.cost_price > 0;
  
  // 数量が入力されている
  const hasQuantity = typeof product.physical_quantity === 'number' && product.physical_quantity > 0;
  
  // タイトルが入力されている
  const hasTitle = !!(product.product_name || product.title);
  
  return hasCost && hasQuantity && hasTitle;
}

/**
 * 確定済み商品のスタイルを取得
 * @returns Tailwind クラス名 or インラインスタイル
 */
export function getVerifiedStyle(isVerified: boolean) {
  if (!isVerified) return {};
  
  return {
    border: '2px solid #10b981',
    boxShadow: '0 0 0 1px rgba(16, 185, 129, 0.2)',
  };
}

/**
 * 確定済み商品のクラス名を取得
 */
export function getVerifiedClassName(isVerified: boolean): string {
  return isVerified ? 'ring-2 ring-emerald-500 ring-offset-1' : '';
}
