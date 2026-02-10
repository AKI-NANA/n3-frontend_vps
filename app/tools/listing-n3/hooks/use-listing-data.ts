// app/tools/listing-n3/hooks/use-listing-data.ts
/**
 * Listing N3 データフック
 * 出品データの取得・管理
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  ListingItem,
  ListingFilter,
  ListingStats,
  Marketplace,
  ListingStatus,
} from '../types/listing';

// モックデータ生成
const generateMockListings = (): ListingItem[] => {
  const marketplaces: Marketplace[] = ['ebay', 'amazon', 'mercari', 'yahoo', 'rakuten'];
  const statuses: ListingStatus[] = ['draft', 'pending', 'scheduled', 'active', 'sold', 'ended'];
  const conditions = ['new', 'like_new', 'good', 'fair'] as const;

  return Array.from({ length: 50 }, (_, i) => ({
    id: `listing-${i + 1}`,
    productId: `product-${Math.floor(i / 3) + 1}`,
    sku: `SKU-${String(i + 1).padStart(6, '0')}`,
    title: `商品名 ${i + 1} - ブランド品 高品質`,
    description: `商品説明 ${i + 1} の詳細テキストがここに入ります。`,
    images: [`/images/product-${(i % 10) + 1}.jpg`],
    price: Math.floor(Math.random() * 50000) + 1000,
    currency: 'JPY',
    quantity: Math.floor(Math.random() * 10) + 1,
    marketplace: marketplaces[i % marketplaces.length],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    seoScore: Math.floor(Math.random() * 40) + 60,
    category: `カテゴリ${(i % 5) + 1}`,
    condition: conditions[i % conditions.length],
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledAt: statuses[i % statuses.length] === 'scheduled'
      ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      : undefined,
  }));
};

export function useListingData() {
  const [listings, setListings] = useState<ListingItem[]>(() => generateMockListings());
  const [filter, setFilter] = useState<ListingFilter>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // フィルター適用
  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (filter.marketplace?.length) {
      result = result.filter(l => filter.marketplace!.includes(l.marketplace));
    }

    if (filter.status?.length) {
      result = result.filter(l => filter.status!.includes(l.status));
    }

    if (filter.search) {
      const search = filter.search.toLowerCase();
      result = result.filter(
        l =>
          l.title.toLowerCase().includes(search) ||
          l.sku.toLowerCase().includes(search)
      );
    }

    if (filter.priceRange) {
      result = result.filter(
        l =>
          l.price >= filter.priceRange!.min &&
          l.price <= filter.priceRange!.max
      );
    }

    if (filter.seoScoreMin) {
      result = result.filter(l => (l.seoScore ?? 0) >= filter.seoScoreMin!);
    }

    return result;
  }, [listings, filter]);

  // 統計計算
  const stats: ListingStats = useMemo(() => {
    const byMarketplace: Record<Marketplace, number> = {
      ebay: 0,
      amazon: 0,
      mercari: 0,
      yahoo: 0,
      rakuten: 0,
    };

    let totalSeoScore = 0;
    let seoCount = 0;

    listings.forEach(l => {
      byMarketplace[l.marketplace]++;
      if (l.seoScore) {
        totalSeoScore += l.seoScore;
        seoCount++;
      }
    });

    return {
      total: listings.length,
      active: listings.filter(l => l.status === 'active').length,
      scheduled: listings.filter(l => l.status === 'scheduled').length,
      draft: listings.filter(l => l.status === 'draft').length,
      ended: listings.filter(l => l.status === 'ended' || l.status === 'sold').length,
      avgSeoScore: seoCount > 0 ? Math.round(totalSeoScore / seoCount) : 0,
      totalRevenue: listings
        .filter(l => l.status === 'sold')
        .reduce((sum, l) => sum + l.price, 0),
      byMarketplace,
    };
  }, [listings]);

  // アクション
  const updateListing = useCallback((id: string, updates: Partial<ListingItem>) => {
    setListings(prev =>
      prev.map(l => (l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l))
    );
  }, []);

  const deleteListing = useCallback((id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
    setSelectedIds(prev => prev.filter(sid => sid !== id));
  }, []);

  const bulkUpdateStatus = useCallback((ids: string[], status: ListingStatus) => {
    setListings(prev =>
      prev.map(l =>
        ids.includes(l.id) ? { ...l, status, updatedAt: new Date().toISOString() } : l
      )
    );
  }, []);

  const selectItem = useCallback((id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(prev =>
      prev.length === filteredListings.length
        ? []
        : filteredListings.map(l => l.id)
    );
  }, [filteredListings]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  // リフレッシュ
  const refresh = useCallback(async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setListings(generateMockListings());
    setLoading(false);
  }, []);

  return {
    listings: filteredListings,
    allListings: listings,
    stats,
    filter,
    setFilter,
    selectedIds,
    selectItem,
    selectAll,
    clearSelection,
    updateListing,
    deleteListing,
    bulkUpdateStatus,
    loading,
    refresh,
  };
}

export default useListingData;
