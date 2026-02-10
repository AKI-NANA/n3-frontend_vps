// contexts/EditingContext.tsx
/**
 * Editing Context - フックの集約と遅延初期化
 * 
 * 設計原則:
 * 1. 全フックをContextに集約
 * 2. アクティブなタブに応じて必要なフックのみ実行
 * 3. 重い処理は遅延初期化
 */

'use client';

import React, { createContext, useContext, useMemo, useCallback, useState, useEffect, ReactNode } from 'react';

// 型定義
export type ActiveSection = 'basic' | 'inventory' | 'logistics' | 'compliance' | 'media' | 'history';

interface EditingContextValue {
  // アクティブセクション
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  
  // フック状態（遅延初期化）
  isProductDataReady: boolean;
  isInventoryReady: boolean;
  isBatchReady: boolean;
  
  // 初期化トリガー
  initProductData: () => void;
  initInventory: () => void;
  initBatch: () => void;
}

const EditingContext = createContext<EditingContextValue | null>(null);

interface EditingProviderProps {
  children: ReactNode;
}

export function EditingProvider({ children }: EditingProviderProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>('basic');
  const [isProductDataReady, setProductDataReady] = useState(false);
  const [isInventoryReady, setInventoryReady] = useState(false);
  const [isBatchReady, setBatchReady] = useState(false);

  // 遅延初期化関数
  const initProductData = useCallback(() => {
    if (!isProductDataReady) {
      setProductDataReady(true);
    }
  }, [isProductDataReady]);

  const initInventory = useCallback(() => {
    if (!isInventoryReady) {
      setInventoryReady(true);
    }
  }, [isInventoryReady]);

  const initBatch = useCallback(() => {
    if (!isBatchReady) {
      setBatchReady(true);
    }
  }, [isBatchReady]);

  // セクション変更時に必要なフックを初期化
  useEffect(() => {
    switch (activeSection) {
      case 'basic':
        initProductData();
        break;
      case 'inventory':
        initInventory();
        break;
      case 'logistics':
      case 'compliance':
      case 'media':
        initProductData();
        initBatch();
        break;
    }
  }, [activeSection, initProductData, initInventory, initBatch]);

  const value = useMemo(() => ({
    activeSection,
    setActiveSection,
    isProductDataReady,
    isInventoryReady,
    isBatchReady,
    initProductData,
    initInventory,
    initBatch,
  }), [
    activeSection,
    isProductDataReady,
    isInventoryReady,
    isBatchReady,
    initProductData,
    initInventory,
    initBatch,
  ]);

  return (
    <EditingContext.Provider value={value}>
      {children}
    </EditingContext.Provider>
  );
}

export function useEditingContext() {
  const context = useContext(EditingContext);
  if (!context) {
    throw new Error('useEditingContext must be used within EditingProvider');
  }
  return context;
}

// ============================================================
// 条件付きフック呼び出しヘルパー
// ============================================================

/**
 * フックを条件付きで「実行」するためのラッパー
 * Rules of Hooksを守りつつ、重い処理を遅延させる
 */
export function useLazyHook<T>(
  hook: () => T,
  shouldInit: boolean,
  defaultValue: T
): T {
  // フック自体は常に呼び出す（Rules of Hooks準拠）
  const result = hook();
  
  // 初期化前はデフォルト値を返す
  if (!shouldInit) {
    return defaultValue;
  }
  
  return result;
}

/**
 * API呼び出しを遅延させるフック
 */
export function useDeferredFetch<T>(
  fetchFn: () => Promise<T>,
  shouldFetch: boolean,
  deps: React.DependencyList = []
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!shouldFetch) return;

    let cancelled = false;
    setLoading(true);

    fetchFn()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetch, ...deps]);

  return { data, loading, error };
}

export default EditingContext;
