// app/tools/editing/hooks/use-selection-state.ts
import { useState, useCallback, useMemo } from 'react';
import type { Product, MarketplaceSelection } from '../types/product';

export const useSelectionState = (products: Product[]) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modifiedIds, setModifiedIds] = useState<Set<string>>(new Set());
  const [marketplaces, setMarketplaces] = useState<MarketplaceSelection>({
    all: false,
    ebay: false,
    shopee: false,
    shopify: false,
  });

  const onSelectChange = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const markAsModified = useCallback((id: string) => {
    setModifiedIds((prev) => new Set(prev).add(id));
  }, []);

  const clearModified = useCallback(() => {
    setModifiedIds(new Set());
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(products.map((p) => String(p.id))));
  }, [products]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const clearAll = useCallback(() => {
    setSelectedIds(new Set());
    setModifiedIds(new Set());
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const getSelectedProducts = useCallback(() => {
    return products.filter((p) => selectedIds.has(String(p.id)));
  }, [products, selectedIds]);

  const selectedCount = useMemo(() => selectedIds.size, [selectedIds]);
  const modifiedCount = useMemo(() => modifiedIds.size, [modifiedIds]);
  const selectedMirrorCount = useMemo(() => {
    return products.filter((p) => selectedIds.has(String(p.id)) && (p as any).mirror_enabled).length;
  }, [products, selectedIds]);

  return {
    selectedIds,
    modifiedIds,
    marketplaces,
    onSelectChange,
    markAsModified,
    clearModified,
    selectAll,
    clearSelection,
    clearAll,
    toggleSelection,
    getSelectedProducts,
    selectedCount,
    modifiedCount,
    selectedMirrorCount,
  };
};
