/**
 * useResearchData: リサーチデータ取得・管理フック
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  ResearchItem,
  ResearchFilters,
  ResearchSort,
  ResearchStats,
} from '../types/research';
import {
  fetchResearchItems,
  fetchResearchStats,
  updateResearchItem,
  deleteResearchItem,
  bulkUpdateStatus,
} from '../lib/research-api';

interface UseResearchDataOptions {
  initialFilters?: ResearchFilters;
  initialSort?: ResearchSort;
  pageSize?: number;
}

export function useResearchData(options: UseResearchDataOptions = {}) {
  const {
    initialFilters = {},
    initialSort = { field: 'created_at', direction: 'desc' },
    pageSize = 50,
  } = options;

  const [items, setItems] = useState<ResearchItem[]>([]);
  const [stats, setStats] = useState<ResearchStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ResearchFilters>(initialFilters);
  const [sort, setSort] = useState<ResearchSort>(initialSort);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // データ取得
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [itemsResult, statsResult] = await Promise.all([
        fetchResearchItems(filters, sort, page, pageSize),
        fetchResearchStats(),
      ]);

      setItems(itemsResult.data);
      setTotal(itemsResult.total);
      setStats(statsResult);
    } catch (err: any) {
      setError(err.message || 'データ取得エラー');
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page, pageSize]);

  // 初回ロード
  useEffect(() => {
    loadData();
  }, [loadData]);

  // アイテム更新
  const updateItem = useCallback(async (id: string, updates: Partial<ResearchItem>) => {
    try {
      const updated = await updateResearchItem(id, updates);
      if (updated) {
        setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
      }
      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  // アイテム削除
  const removeItem = useCallback(async (id: string) => {
    try {
      const success = await deleteResearchItem(id);
      if (success) {
        setItems(prev => prev.filter(item => item.id !== id));
        setSelectedIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
      return success;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, []);

  // 一括ステータス更新
  const bulkUpdate = useCallback(async (status: ResearchItem['status']) => {
    if (selectedIds.size === 0) return 0;

    try {
      const count = await bulkUpdateStatus(Array.from(selectedIds), status);
      if (count > 0) {
        setItems(prev => prev.map(item =>
          selectedIds.has(item.id) ? { ...item, status } : item
        ));
        setSelectedIds(new Set());
      }
      return count;
    } catch (err: any) {
      setError(err.message);
      return 0;
    }
  }, [selectedIds]);

  // 選択操作
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(item => item.id)));
  }, [items]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // フィルター更新
  const updateFilters = useCallback((newFilters: Partial<ResearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // フィルター変更時はページリセット
  }, []);

  // ソート更新
  const updateSort = useCallback((field: keyof ResearchItem) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return {
    // データ
    items,
    stats,
    total,
    loading,
    error,

    // ページネーション
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    setPage,

    // フィルター・ソート
    filters,
    sort,
    updateFilters,
    updateSort,

    // 選択
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,

    // 操作
    loadData,
    updateItem,
    removeItem,
    bulkUpdate,
  };
}
