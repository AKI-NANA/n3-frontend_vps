// app/tools/editing/hooks/use-selection.ts
/**
 * 選択状態管理フック
 * 
 * 責務:
 * - 商品の選択/解除
 * - 全選択/全解除
 * - 選択商品の取得
 */

import { useState, useCallback, useMemo } from 'react';
import type { Product } from '../types/product';

interface UseSelectionReturn {
  selectedIds: Set<string>;
  setSelectedIds: (ids: Set<string>) => void;
  
  // 選択操作
  selectProduct: (id: string) => void;
  deselectProduct: (id: string) => void;
  toggleProduct: (id: string) => void;
  selectAll: (products: Product[]) => void;
  deselectAll: () => void;
  
  // ヘルパー
  isSelected: (id: string) => boolean;
  selectedCount: number;
  getSelectedProducts: (products: Product[]) => Product[];
}

export function useSelection(): UseSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectProduct = useCallback((id: string) => {
    setSelectedIds(prev => new Set(prev).add(id));
  }, []);

  const deselectProduct = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const toggleProduct = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback((products: Product[]) => {
    setSelectedIds(new Set(products.map(p => String(p.id))));
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback((id: string) => {
    return selectedIds.has(id);
  }, [selectedIds]);

  const selectedCount = selectedIds.size;

  const getSelectedProducts = useCallback((products: Product[]) => {
    return products.filter(p => selectedIds.has(String(p.id)));
  }, [selectedIds]);

  return {
    selectedIds,
    setSelectedIds,
    selectProduct,
    deselectProduct,
    toggleProduct,
    selectAll,
    deselectAll,
    isSelected,
    selectedCount,
    getSelectedProducts,
  };
}
