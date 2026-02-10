// app/tools/listing-n3/hooks/use-listing-integrated.ts
/**
 * Listing N3 統合フック
 *
 * ゴールドスタンダード準拠:
 * - Domain State: React Query (サーバーデータ)
 * - UI State: Zustand (ページネーション、フィルター、選択)
 * - 統合フックでマージして単一インターフェースを提供
 *
 * このフックを呼ぶだけで、データ取得・フィルタリング・ソート・選択全てが利用可能
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import {
  useListingUIStore,
  useListingActiveTab,
  useListingCurrentPage,
  useListingPageSize,
  useListingFilters,
  useListingSortField,
  useListingSortOrder,
  useListingSelectedIds,
  useListingViewMode,
  useListingShowStats,
} from '@/store/n3';
import type { ListingItem, ListingStats, ListingStatus, Marketplace } from '../types/listing';

// ============================================================
// API関数
// ============================================================

interface FetchListingsParams {
  page: number;
  pageSize: number;
  filters: Record<string, unknown>;
  sortField: string;
  sortOrder: 'asc' | 'desc';
}

interface FetchListingsResponse {
  items: ListingItem[];
  total: number;
  stats: ListingStats;
}

async function fetchListings(params: FetchListingsParams): Promise<FetchListingsResponse> {
  // 実API呼び出し: /api/products
  const offset = (params.page - 1) * params.pageSize;
  const queryParams = new URLSearchParams({
    limit: String(params.pageSize),
    offset: String(offset),
  });

  // SKU検索の場合
  if (params.filters.search) {
    queryParams.set('sku', String(params.filters.search));
  }

  const response = await fetch(`/api/products?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'API returned error');
  }

  // APIレスポンスをListingItem形式に変換
  const items: ListingItem[] = (data.products || []).map((product: any) => ({
    id: String(product.id),
    productId: String(product.id),
    sku: product.sku || '',
    title: product.title || product.title_en || product.english_title || '',
    description: product.listing_data?.description || '',
    images: product.images || product.image_urls || (product.primary_image_url ? [product.primary_image_url] : []),
    price: product.price_jpy || 0,
    currency: 'JPY' as const,
    quantity: product.listing_data?.quantity || 1,
    marketplace: detectMarketplace(product),
    status: mapProductStatus(product),
    seoScore: product.listing_score || 0,
    category: product.category_name || '',
    condition: mapCondition(product.condition),
    updatedAt: product.updated_at || product.created_at || new Date().toISOString(),
  }));

  // クライアントサイドでフィルター適用（API側でサポートされていないフィルター）
  let filtered = [...items];
  if (params.filters.marketplace?.length) {
    filtered = filtered.filter(l => (params.filters.marketplace as Marketplace[]).includes(l.marketplace));
  }
  if (params.filters.status?.length) {
    filtered = filtered.filter(l => (params.filters.status as ListingStatus[]).includes(l.status));
  }

  // クライアントサイドでソート
  filtered.sort((a, b) => {
    const aVal = a[params.sortField as keyof ListingItem];
    const bVal = b[params.sortField as keyof ListingItem];
    if (aVal === undefined || bVal === undefined) return 0;
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return params.sortOrder === 'asc' ? cmp : -cmp;
  });

  const total = data.pagination?.total || filtered.length;

  // 統計情報を計算
  const stats = calculateStats(items, total);

  return {
    items: filtered,
    total,
    stats,
  };
}

// マーケットプレイス検出
function detectMarketplace(product: any): Marketplace {
  if (product.listing_data?.marketplace) {
    return product.listing_data.marketplace as Marketplace;
  }
  return 'ebay';
}

// ステータスマッピング
function mapProductStatus(product: any): ListingStatus {
  const status = product.listing_data?.status || product.status;
  if (!status) return 'draft';

  const statusMap: Record<string, ListingStatus> = {
    'active': 'active',
    'listed': 'active',
    'sold': 'sold',
    'ended': 'ended',
    'draft': 'draft',
    'pending': 'pending',
    'scheduled': 'scheduled',
  };
  return statusMap[status.toLowerCase()] || 'draft';
}

// コンディションマッピング
function mapCondition(condition: string | undefined): 'new' | 'like_new' | 'good' | 'fair' {
  if (!condition) return 'good';
  const conditionMap: Record<string, 'new' | 'like_new' | 'good' | 'fair'> = {
    'new': 'new',
    'brand_new': 'new',
    'like_new': 'like_new',
    'excellent': 'like_new',
    'good': 'good',
    'fair': 'fair',
    'acceptable': 'fair',
  };
  return conditionMap[condition.toLowerCase()] || 'good';
}

// 統計情報計算
function calculateStats(items: ListingItem[], total: number): ListingStats {
  const byMarketplace: Record<Marketplace, number> = { ebay: 0, amazon: 0, mercari: 0, yahoo: 0, rakuten: 0 };
  let totalSeoScore = 0;
  let seoCount = 0;
  let activeCount = 0;
  let scheduledCount = 0;
  let draftCount = 0;
  let endedCount = 0;
  let soldRevenue = 0;

  items.forEach(l => {
    byMarketplace[l.marketplace]++;
    if (l.seoScore) {
      totalSeoScore += l.seoScore;
      seoCount++;
    }
    switch (l.status) {
      case 'active': activeCount++; break;
      case 'scheduled': scheduledCount++; break;
      case 'draft': draftCount++; break;
      case 'ended': endedCount++; break;
      case 'sold':
        endedCount++;
        soldRevenue += l.price;
        break;
    }
  });

  return {
    total,
    active: activeCount,
    scheduled: scheduledCount,
    draft: draftCount,
    ended: endedCount,
    avgSeoScore: seoCount > 0 ? Math.round(totalSeoScore / seoCount) : 0,
    totalRevenue: soldRevenue,
    byMarketplace,
  };
}

async function fetchListingsLegacy(params: FetchListingsParams): Promise<FetchListingsResponse> {
  // モックデータを返す（フォールバック用）
  await new Promise(resolve => setTimeout(resolve, 300));

  const marketplaces: Marketplace[] = ['ebay', 'amazon', 'mercari', 'yahoo', 'rakuten'];
  const statuses: ListingStatus[] = ['draft', 'pending', 'scheduled', 'active', 'sold', 'ended'];
  const conditions = ['new', 'like_new', 'good', 'fair'] as const;

  const allItems: ListingItem[] = Array.from({ length: 200 }, (_, i) => ({
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
  }));

  // フィルタリング
  let filtered = [...allItems];
  if (params.filters.marketplace?.length) {
    filtered = filtered.filter(l => (params.filters.marketplace as Marketplace[]).includes(l.marketplace));
  }
  if (params.filters.status?.length) {
    filtered = filtered.filter(l => (params.filters.status as ListingStatus[]).includes(l.status));
  }
  if (params.filters.search) {
    const search = (params.filters.search as string).toLowerCase();
    filtered = filtered.filter(l =>
      l.title.toLowerCase().includes(search) ||
      l.sku.toLowerCase().includes(search)
    );
  }

  // ソート
  filtered.sort((a, b) => {
    const aVal = a[params.sortField as keyof ListingItem];
    const bVal = b[params.sortField as keyof ListingItem];
    if (aVal === undefined || bVal === undefined) return 0;
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return params.sortOrder === 'asc' ? cmp : -cmp;
  });

  // ページネーション
  const start = (params.page - 1) * params.pageSize;
  const items = filtered.slice(start, start + params.pageSize);

  // 統計
  const byMarketplace: Record<Marketplace, number> = { ebay: 0, amazon: 0, mercari: 0, yahoo: 0, rakuten: 0 };
  let totalSeoScore = 0;
  let seoCount = 0;
  allItems.forEach(l => {
    byMarketplace[l.marketplace]++;
    if (l.seoScore) {
      totalSeoScore += l.seoScore;
      seoCount++;
    }
  });

  return {
    items,
    total: filtered.length,
    stats: {
      total: allItems.length,
      active: allItems.filter(l => l.status === 'active').length,
      scheduled: allItems.filter(l => l.status === 'scheduled').length,
      draft: allItems.filter(l => l.status === 'draft').length,
      ended: allItems.filter(l => l.status === 'ended' || l.status === 'sold').length,
      avgSeoScore: seoCount > 0 ? Math.round(totalSeoScore / seoCount) : 0,
      totalRevenue: allItems.filter(l => l.status === 'sold').reduce((sum, l) => sum + l.price, 0),
      byMarketplace,
    },
  };
}

interface UpdateListingParams {
  id: string;
  updates: Partial<ListingItem>;
}

async function updateListing(params: UpdateListingParams): Promise<ListingItem> {
  // 実API呼び出し: /api/products/[id]
  const response = await fetch(`/api/products/${params.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params.updates),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update listing');
  }

  const data = await response.json();
  return { id: params.id, ...params.updates, ...data } as ListingItem;
}

interface BulkUpdateParams {
  ids: string[];
  status: ListingStatus;
}

async function bulkUpdateStatus(params: BulkUpdateParams): Promise<void> {
  // 実API呼び出し: /api/products/update-status
  const response = await fetch('/api/products/update-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ids: params.ids,
      status: params.status,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to bulk update');
  }
}

// ============================================================
// 統合フック
// ============================================================

export function useListingIntegrated() {
  const queryClient = useQueryClient();

  // ===== UI State (Zustand) - 値ごとに取得（ゴールドスタンダード） =====
  const activeTab = useListingActiveTab();
  const currentPage = useListingCurrentPage();
  const pageSize = useListingPageSize();
  const filters = useListingFilters();
  const sortField = useListingSortField();
  const sortOrder = useListingSortOrder();
  const selectedIds = useListingSelectedIds();
  const viewMode = useListingViewMode();
  const showStats = useListingShowStats();

  // ===== UI Actions (Zustand) =====
  const {
    setActiveTab,
    setPage,
    setPageSize,
    setFilters,
    updateFilter,
    clearFilters,
    setSort,
    selectItem,
    selectItems,
    deselectItem,
    selectAll,
    clearSelection,
    setViewMode,
    toggleStats,
  } = useListingUIStore();

  // ===== Domain State (React Query) =====
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['listings', currentPage, pageSize, filters, sortField, sortOrder],
    queryFn: () => fetchListings({
      page: currentPage,
      pageSize,
      filters,
      sortField,
      sortOrder,
    }),
    staleTime: 30 * 1000, // 30秒
  });

  // ===== Mutations =====
  const updateMutation = useMutation({
    mutationFn: updateListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: bulkUpdateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      clearSelection();
    },
  });

  // ===== マージされたデータ =====
  const listings = useMemo(() => data?.items ?? [], [data]);
  const stats = useMemo(() => data?.stats ?? null, [data]);
  const totalItems = data?.total ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // ===== 選択関連の派生状態 =====
  const selectedListings = useMemo(
    () => listings.filter(l => selectedIds.includes(l.id)),
    [listings, selectedIds]
  );

  const isAllSelected = useMemo(
    () => listings.length > 0 && listings.every(l => selectedIds.includes(l.id)),
    [listings, selectedIds]
  );

  // ===== コールバック（useCallbackでメモ化） =====
  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAll(listings.map(l => l.id));
    }
  }, [isAllSelected, listings, selectAll, clearSelection]);

  const handleUpdateListing = useCallback(
    (id: string, updates: Partial<ListingItem>) => {
      updateMutation.mutate({ id, updates });
    },
    [updateMutation]
  );

  const handleBulkUpdateStatus = useCallback(
    (status: ListingStatus) => {
      if (selectedIds.length === 0) return;
      bulkUpdateMutation.mutate({ ids: selectedIds, status });
    },
    [selectedIds, bulkUpdateMutation]
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // ===== 返却値 =====
  return {
    // データ
    listings,
    stats,
    totalItems,
    totalPages,

    // 選択
    selectedIds,
    selectedListings,
    isAllSelected,

    // UI状態
    activeTab,
    currentPage,
    pageSize,
    filters,
    sortField,
    sortOrder,
    viewMode,
    showStats,

    // ローディング・エラー
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    isUpdating: updateMutation.isPending,
    isBulkUpdating: bulkUpdateMutation.isPending,

    // アクション
    setActiveTab,
    setPage,
    setPageSize,
    setFilters,
    updateFilter,
    clearFilters,
    setSort,
    selectItem,
    selectItems,
    deselectItem,
    handleSelectAll,
    clearSelection,
    setViewMode,
    toggleStats,

    // データ操作
    updateListing: handleUpdateListing,
    bulkUpdateStatus: handleBulkUpdateStatus,
    refresh: handleRefresh,
  };
}

export default useListingIntegrated;
