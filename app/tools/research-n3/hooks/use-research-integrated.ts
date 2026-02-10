// app/tools/research-n3/hooks/use-research-integrated.ts
/**
 * Research N3 統合フック
 *
 * ゴールドスタンダード準拠:
 * - ドメインステート: React Query (TanStack Query)
 * - UIステート: Zustand (researchUIStore)
 * - 単一インターフェース: コンポーネントからはこのフックのみ使用
 * 
 * 修正: 2025-12-15 - APIエンドポイントを /api/research-table/ に統一
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useResearchUIStore,
  useResearchActiveTab,
  useResearchCurrentPage,
  useResearchPageSize,
  useResearchFilters,
  useResearchSortField,
  useResearchSortOrder,
  useResearchSelectedIds,
  useResearchSelectedItemId,
  useResearchShowStats,
  useResearchViewMode,
} from '@/store/n3/researchUIStore';

import type {
  ResearchItem,
  ResearchStats,
  ResearchFilters,
  ResearchSort,
  WorkflowStatus,
  KaritoriStatus,
  ResearchTab,
} from '@/app/tools/research-table/types/research';

// ============================================================
// API 関数
// ============================================================

interface FetchResearchParams {
  page: number;
  pageSize: number;
  filters: ResearchFilters;
  sort: ResearchSort;
}

interface FetchResearchResponse {
  items: ResearchItem[];
  total: number;
  stats: ResearchStats;
}

async function fetchResearchItems(params: FetchResearchParams): Promise<FetchResearchResponse> {
  // /api/research-table/list に合わせたパラメータ形式
  const queryParams = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  // フィルターをクエリパラメータに追加
  if (params.filters.source) {
    queryParams.set('source', params.filters.source);
  }
  if (params.filters.status) {
    queryParams.set('status', params.filters.status);
  }
  if (params.filters.karitori_status) {
    queryParams.set('karitoriStatus', params.filters.karitori_status);
  }
  if (params.filters.risk_level) {
    queryParams.set('riskLevel', params.filters.risk_level);
  }
  if (params.filters.search) {
    queryParams.set('keyword', params.filters.search);
  }
  if (params.filters.min_score !== undefined) {
    queryParams.set('minScore', String(params.filters.min_score));
  }

  // 修正: /api/research-table/list を使用
  const response = await fetch(`/api/research-table/list?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch research items');
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch research items');
  }

  const items: ResearchItem[] = result.items || [];

  // APIからの統計データをマッピング
  const apiStats = result.stats || {};
  const stats: ResearchStats = {
    total: result.total || items.length,
    new: apiStats.newCount || items.filter(i => i.status === 'new').length,
    analyzing: apiStats.analyzingCount || items.filter(i => i.status === 'analyzing').length,
    approved: apiStats.approvedCount || items.filter(i => i.status === 'approved').length,
    rejected: apiStats.rejectedCount || items.filter(i => i.status === 'rejected').length,
    promoted: items.filter(i => i.status === 'promoted').length,
    watching: items.filter(i => i.karitori_status === 'watching').length,
    alert: items.filter(i => i.karitori_status === 'alert').length,
    avg_profit_margin: items.length > 0
      ? items.reduce((sum, i) => sum + (i.profit_margin || 0), 0) / items.length
      : 0,
    avg_total_score: items.length > 0
      ? items.reduce((sum, i) => sum + (i.total_score || 0), 0) / items.length
      : 0,
  };

  return {
    items,
    total: result.total || items.length,
    stats,
  };
}

async function fetchResearchStats(): Promise<ResearchStats> {
  // 統計は list API から取得するので、シンプルなリクエスト
  const response = await fetch('/api/research-table/list?page=1&pageSize=1');
  if (!response.ok) {
    // デフォルト統計を返す
    return {
      total: 0,
      new: 0,
      analyzing: 0,
      approved: 0,
      rejected: 0,
      promoted: 0,
      watching: 0,
      alert: 0,
      avg_profit_margin: 0,
      avg_total_score: 0,
    };
  }

  const result = await response.json();
  const apiStats = result.stats || {};
  
  return {
    total: result.total || 0,
    new: apiStats.newCount || 0,
    analyzing: apiStats.analyzingCount || 0,
    approved: apiStats.approvedCount || 0,
    rejected: apiStats.rejectedCount || 0,
    promoted: 0,
    watching: 0,
    alert: 0,
    avg_profit_margin: 0,
    avg_total_score: 0,
  };
}

// ============================================================
// 統合フック
// ============================================================

export function useResearchIntegrated() {
  const queryClient = useQueryClient();

  // UI State (Zustand)
  const activeTab = useResearchActiveTab();
  const currentPage = useResearchCurrentPage();
  const pageSize = useResearchPageSize();
  const filters = useResearchFilters();
  const sortField = useResearchSortField();
  const sortOrder = useResearchSortOrder();
  const selectedIds = useResearchSelectedIds();
  const selectedItemId = useResearchSelectedItemId();
  const showStats = useResearchShowStats();
  const viewMode = useResearchViewMode();

  // UI Actions
  const store = useResearchUIStore.getState();

  // Query params
  const queryParams: FetchResearchParams = useMemo(() => ({
    page: currentPage,
    pageSize,
    filters: {
      source: filters.source,
      status: filters.status,
      karitori_status: filters.karitoriStatus,
      risk_level: filters.riskLevel,
      min_profit_margin: filters.minProfitMargin,
      min_score: filters.minScore,
      search: filters.search,
    },
    sort: {
      field: sortField as keyof ResearchItem,
      direction: sortOrder,
    },
  }), [currentPage, pageSize, filters, sortField, sortOrder]);

  // ============================================================
  // React Query - Research Items
  // ============================================================

  const itemsQuery = useQuery({
    queryKey: ['research', 'items', queryParams],
    queryFn: () => fetchResearchItems(queryParams),
    staleTime: 30 * 1000, // 30秒
    refetchOnWindowFocus: true,
  });

  // ============================================================
  // React Query - Stats
  // ============================================================

  const statsQuery = useQuery({
    queryKey: ['research', 'stats'],
    queryFn: fetchResearchStats,
    staleTime: 60 * 1000, // 1分
  });

  // ============================================================
  // Mutations
  // ============================================================

  // 修正: /api/research-table/analyze を使用
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ResearchItem> }) => {
      const response = await fetch(`/api/research-table/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!response.ok) throw new Error('Failed to update item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research'] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      // 削除は reject として扱う
      const response = await fetch(`/api/research-table/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      });
      if (!response.ok) throw new Error('Failed to delete item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research'] });
    },
  });

  // 修正: /api/research-table/approve, reject を使用
  const bulkUpdateStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: WorkflowStatus }) => {
      const endpoint = status === 'approved' || status === 'promoted'
        ? '/api/research-table/approve'
        : '/api/research-table/reject';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) throw new Error('Failed to bulk update');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research'] });
      store.clearSelection();
    },
  });

  // 修正: /api/research-table/approve を使用
  const approveItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/research-table/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      });
      if (!response.ok) throw new Error('Failed to approve item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research'] });
    },
  });

  // 修正: /api/research-table/reject を使用
  const rejectItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/research-table/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      });
      if (!response.ok) throw new Error('Failed to reject item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research'] });
    },
  });

  // 修正: promote は approve と同じ
  const promoteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/research-table/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      });
      if (!response.ok) throw new Error('Failed to promote item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research'] });
    },
  });

  // 修正: karitori-register を使用
  const updateKaritoriStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: KaritoriStatus }) => {
      const response = await fetch(`/api/research-table/karitori-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, karitori_status: status }),
      });
      if (!response.ok) throw new Error('Failed to update karitori status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research'] });
    },
  });

  // ============================================================
  // 選択されたアイテム
  // ============================================================

  const selectedItem = useMemo(() => {
    if (!selectedItemId || !itemsQuery.data) return null;
    return itemsQuery.data.items.find(i => i.id === selectedItemId) || null;
  }, [selectedItemId, itemsQuery.data]);

  // ============================================================
  // タブ別フィルタリング
  // ============================================================

  const filteredItems = useMemo(() => {
    const items = itemsQuery.data?.items || [];

    switch (activeTab) {
      case 'research':
        return items.filter(i => i.status === 'new' || i.status === 'analyzing');
      case 'karitori':
        return items.filter(i => i.karitori_status !== 'none');
      case 'supplier':
        return items.filter(i => i.supplier_url || i.supplier_name);
      case 'approval':
        return items.filter(i => i.status === 'approved' || i.status === 'rejected' || i.status === 'promoted');
      default:
        return items;
    }
  }, [activeTab, itemsQuery.data]);

  // ============================================================
  // リフレッシュ
  // ============================================================

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['research'] });
  }, [queryClient]);

  // ============================================================
  // 返り値
  // ============================================================

  return {
    // データ
    items: filteredItems,
    allItems: itemsQuery.data?.items || [],
    stats: statsQuery.data || itemsQuery.data?.stats || null,

    // ローディング・エラー
    isLoading: itemsQuery.isLoading,
    error: itemsQuery.error?.message || null,

    // ページネーション
    currentPage,
    pageSize,
    total: itemsQuery.data?.total || 0,
    totalPages: Math.ceil((itemsQuery.data?.total || 0) / pageSize),

    // UI状態
    activeTab,
    filters,
    sortField,
    sortOrder,
    viewMode,
    showStats,

    // 選択
    selectedIds,
    selectedItemId,
    selectedItem,

    // UIアクション
    setActiveTab: store.setActiveTab,
    setPage: store.setPage,
    setPageSize: store.setPageSize,
    setFilters: store.setFilters,
    updateFilter: store.updateFilter,
    clearFilters: store.clearFilters,
    setSort: store.setSort,
    selectItem: store.selectItem,
    toggleSelect: store.toggleSelect,
    selectAll: store.selectAll,
    clearSelection: store.clearSelection,
    setViewMode: store.setViewMode,
    toggleStats: store.toggleStats,

    // データ操作
    updateItem: (id: string, updates: Partial<ResearchItem>) => updateItemMutation.mutateAsync({ id, updates }),
    deleteItem: (id: string) => deleteItemMutation.mutateAsync(id),
    bulkUpdateStatus: (ids: string[], status: WorkflowStatus) => bulkUpdateStatusMutation.mutateAsync({ ids, status }),
    approveItem: (id: string) => approveItemMutation.mutateAsync(id),
    rejectItem: (id: string) => rejectItemMutation.mutateAsync(id),
    promoteItem: (id: string) => promoteItemMutation.mutateAsync(id),
    updateKaritoriStatus: (id: string, status: KaritoriStatus) => updateKaritoriStatusMutation.mutateAsync({ id, status }),

    // 一括操作（選択済みアイテム）
    bulkApprove: () => bulkUpdateStatusMutation.mutateAsync({ ids: Array.from(selectedIds), status: 'approved' }),
    bulkReject: () => bulkUpdateStatusMutation.mutateAsync({ ids: Array.from(selectedIds), status: 'rejected' }),

    // リフレッシュ
    refresh,

    // ミューテーション状態
    isUpdating: updateItemMutation.isPending || bulkUpdateStatusMutation.isPending,
  };
}

export default useResearchIntegrated;
