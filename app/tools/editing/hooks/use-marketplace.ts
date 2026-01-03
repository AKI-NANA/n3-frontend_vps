// app/tools/editing/hooks/use-marketplace.ts
/**
 * マーケットプレイス選択管理フック
 * 
 * 責務:
 * - マーケットプレイスの選択状態
 */

import { useState, useCallback } from 'react';
import type { MarketplaceSelection } from '../types/product';

interface UseMarketplaceReturn {
  marketplaces: MarketplaceSelection;
  setMarketplaces: (marketplaces: MarketplaceSelection) => void;
  toggleMarketplace: (key: keyof MarketplaceSelection) => void;
  toggleAll: () => void;
}

const DEFAULT_MARKETPLACES: MarketplaceSelection = {
  all: true,
  ebay: true,
  shopee: true,
  shopify: true,
};

export function useMarketplace(): UseMarketplaceReturn {
  const [marketplaces, setMarketplaces] = useState<MarketplaceSelection>(DEFAULT_MARKETPLACES);

  const toggleMarketplace = useCallback((key: keyof MarketplaceSelection) => {
    setMarketplaces(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const toggleAll = useCallback(() => {
    setMarketplaces(prev => {
      const newAll = !prev.all;
      return {
        all: newAll,
        ebay: newAll,
        shopee: newAll,
        shopify: newAll,
      };
    });
  }, []);

  return {
    marketplaces,
    setMarketplaces,
    toggleMarketplace,
    toggleAll,
  };
}
