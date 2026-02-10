// components/n3/n3-hierarchical-filter.tsx
/**
 * N3 Hierarchical Filter Component
 * 
 * 3階層の属性フィルター（大分類 > 中分類 > 小分類）
 * タブを跨いでもフィルター状態を維持するグローバルフィルター
 * 
 * 機能:
 * 1. スプレッドシートから同期された3階層の属性を選択
 * 2. タブ移動後も選択状態を保持（Zustand永続化）
 * 3. 下位階層の自動リセット
 * 4. N3デザインシステム準拠
 * 
 * @version 1.0.0
 * @date 2025-12-22
 */

'use client';

import React, { useMemo, useCallback, useEffect } from 'react';
import { Filter, X, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================
// Zustand Store - グローバル・パーシステント・フィルター
// ============================================================

interface HierarchicalFilterState {
  filters: {
    l1: string | null;  // 大分類
    l2: string | null;  // 中分類
    l3: string | null;  // 小分類
  };
  optionsPool: {
    l1: string[];
    l2: string[];
    l3: string[];
  };
  // 親子関係マップ（l1の値 → l2の選択肢、l2の値 → l3の選択肢）
  hierarchyMap: {
    l1ToL2: Record<string, string[]>;
    l2ToL3: Record<string, string[]>;
  };
  isLoading: boolean;
  lastSynced: string | null;
  
  // アクション
  setFilter: (level: 'l1' | 'l2' | 'l3', value: string | null) => void;
  clearFilters: () => void;
  setOptions: (options: Partial<HierarchicalFilterState['optionsPool']>) => void;
  setHierarchyMap: (map: HierarchicalFilterState['hierarchyMap']) => void;
  setLoading: (loading: boolean) => void;
  setLastSynced: (date: string) => void;
}

export const useHierarchicalFilterStore = create<HierarchicalFilterState>()(
  persist(
    immer((set) => ({
      filters: {
        l1: null,
        l2: null,
        l3: null,
      },
      optionsPool: {
        l1: [],
        l2: [],
        l3: [],
      },
      hierarchyMap: {
        l1ToL2: {},
        l2ToL3: {},
      },
      isLoading: false,
      lastSynced: null,

      setFilter: (level, value) => {
        set((state) => {
          const val = value === '' ? null : value;
          state.filters[level] = val;
          
          // 下位階層をリセット
          if (level === 'l1') {
            state.filters.l2 = null;
            state.filters.l3 = null;
          } else if (level === 'l2') {
            state.filters.l3 = null;
          }
        });
      },

      clearFilters: () => {
        set((state) => {
          state.filters = { l1: null, l2: null, l3: null };
        });
      },

      setOptions: (options) => {
        set((state) => {
          state.optionsPool = { ...state.optionsPool, ...options };
        });
      },

      setHierarchyMap: (map) => {
        set((state) => {
          state.hierarchyMap = map;
        });
      },

      setLoading: (loading) => {
        set((state) => {
          state.isLoading = loading;
        });
      },

      setLastSynced: (date) => {
        set((state) => {
          state.lastSynced = date;
        });
      },
    })),
    {
      name: 'n3-hierarchical-filter',
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);

// ============================================================
// フック: フィルター状態とアクションを取得
// ============================================================

export function useHierarchicalFilter() {
  const store = useHierarchicalFilterStore();
  
  // 現在のl1に基づくl2の選択肢
  const availableL2Options = useMemo(() => {
    if (!store.filters.l1) return store.optionsPool.l2;
    return store.hierarchyMap.l1ToL2[store.filters.l1] || store.optionsPool.l2;
  }, [store.filters.l1, store.hierarchyMap.l1ToL2, store.optionsPool.l2]);
  
  // 現在のl2に基づくl3の選択肢
  const availableL3Options = useMemo(() => {
    if (!store.filters.l2) return store.optionsPool.l3;
    return store.hierarchyMap.l2ToL3[store.filters.l2] || store.optionsPool.l3;
  }, [store.filters.l2, store.hierarchyMap.l2ToL3, store.optionsPool.l3]);
  
  // フィルターがアクティブかどうか
  const hasActiveFilter = useMemo(() => {
    return !!(store.filters.l1 || store.filters.l2 || store.filters.l3);
  }, [store.filters]);
  
  // APIクエリパラメータを生成
  const toQueryParams = useCallback(() => {
    const params: Record<string, string> = {};
    if (store.filters.l1) params.attr_l1 = store.filters.l1;
    if (store.filters.l2) params.attr_l2 = store.filters.l2;
    if (store.filters.l3) params.attr_l3 = store.filters.l3;
    return params;
  }, [store.filters]);
  
  return {
    filters: store.filters,
    setFilter: store.setFilter,
    clearFilters: store.clearFilters,
    availableL1Options: store.optionsPool.l1,
    availableL2Options,
    availableL3Options,
    hasActiveFilter,
    isLoading: store.isLoading,
    lastSynced: store.lastSynced,
    toQueryParams,
  };
}

// ============================================================
// 属性オプション取得フック
// ============================================================

export function useFetchAttributeOptions() {
  const store = useHierarchicalFilterStore();
  
  const fetchOptions = useCallback(async () => {
    store.setLoading(true);
    
    try {
      // inventory_master から属性オプションを取得
      const { l1, l2 } = store.filters;
      const params = new URLSearchParams();
      if (l1) params.set('l1', l1);
      if (l2) params.set('l2', l2);
      
      const response = await fetch(`/api/inventory/attribute-options?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch attributes');
      
      const data = await response.json();
      
      if (data.success) {
        store.setOptions({
          l1: data.l1Options || [],
          l2: data.l2Options || [],
          l3: data.l3Options || [],
        });
        
        store.setLastSynced(new Date().toISOString());
      }
    } catch (error) {
      console.error('[HierarchicalFilter] Failed to fetch options:', error);
    } finally {
      store.setLoading(false);
    }
  }, [store]);
  
  return { fetchOptions };
}

// ============================================================
// UIコンポーネント
// ============================================================

interface N3HierarchicalFilterProps {
  /** コンパクトモード */
  compact?: boolean;
  /** カスタムクラス */
  className?: string;
  /** フィルター変更時のコールバック */
  onFilterChange?: (filters: { l1: string | null; l2: string | null; l3: string | null }) => void;
}

export const N3HierarchicalFilter = React.memo(function N3HierarchicalFilter({
  compact = false,
  className = '',
  onFilterChange,
}: N3HierarchicalFilterProps) {
  const {
    filters,
    setFilter,
    clearFilters,
    availableL1Options,
    availableL2Options,
    availableL3Options,
    hasActiveFilter,
    isLoading,
  } = useHierarchicalFilter();
  
  const { fetchOptions } = useFetchAttributeOptions();
  
  // 初回マウント時に属性オプションを取得
  useEffect(() => {
    if (availableL1Options.length === 0) {
      fetchOptions();
    }
  }, []);
  
  // フィルター変更時にコールバック
  useEffect(() => {
    onFilterChange?.(filters);
  }, [filters, onFilterChange]);
  
  const handleFilterChange = useCallback((level: 'l1' | 'l2' | 'l3', value: string) => {
    setFilter(level, value || null);
  }, [setFilter]);

  return (
    <div className={`n3-hierarchical-filter ${compact ? 'n3-hierarchical-filter--compact' : ''} ${className}`}>
      {/* フィルターアイコン */}
      <div className="n3-hierarchical-filter__label">
        <Filter size={14} />
        {!compact && <span>属性フィルター</span>}
      </div>

      {/* 階層 1: 大分類 */}
      <div className="n3-hierarchical-filter__select-group">
        <select
          value={filters.l1 || ''}
          onChange={(e) => handleFilterChange('l1', e.target.value)}
          className="n3-hierarchical-filter__select"
          disabled={isLoading}
        >
          <option value="">大分類</option>
          {availableL1Options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronRight size={12} className="n3-hierarchical-filter__chevron" />
      </div>

      {/* 階層 2: 中分類 */}
      <div className="n3-hierarchical-filter__select-group">
        <select
          value={filters.l2 || ''}
          onChange={(e) => handleFilterChange('l2', e.target.value)}
          className={`n3-hierarchical-filter__select ${!filters.l1 ? 'n3-hierarchical-filter__select--disabled' : ''}`}
          disabled={!filters.l1 || isLoading}
        >
          <option value="">中分類</option>
          {availableL2Options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronRight size={12} className="n3-hierarchical-filter__chevron" />
      </div>

      {/* 階層 3: 小分類 */}
      <div className="n3-hierarchical-filter__select-group">
        <select
          value={filters.l3 || ''}
          onChange={(e) => handleFilterChange('l3', e.target.value)}
          className={`n3-hierarchical-filter__select ${!filters.l2 ? 'n3-hierarchical-filter__select--disabled' : ''}`}
          disabled={!filters.l2 || isLoading}
        >
          <option value="">小分類</option>
          {availableL3Options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* リセットボタン */}
      {hasActiveFilter && (
        <button
          onClick={clearFilters}
          className="n3-hierarchical-filter__reset"
          title="フィルターをリセット"
        >
          <X size={14} />
          {!compact && <span>リセット</span>}
        </button>
      )}

      {/* 同期ボタン */}
      <button
        onClick={fetchOptions}
        className="n3-hierarchical-filter__sync"
        disabled={isLoading}
        title="属性を再同期"
      >
        <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
      </button>

      {/* ローディング表示 */}
      {isLoading && (
        <div className="n3-hierarchical-filter__loading">
          <Loader2 size={14} className="animate-spin" />
          <span>同期中...</span>
        </div>
      )}

      {/* アクティブコンテキスト表示 */}
      {hasActiveFilter && !compact && (
        <div className="n3-hierarchical-filter__context">
          <span className="n3-hierarchical-filter__context-label">適用中:</span>
          <span>{filters.l1 || '*'}</span>
          <ChevronRight size={10} />
          <span>{filters.l2 || '*'}</span>
          <ChevronRight size={10} />
          <span>{filters.l3 || '*'}</span>
        </div>
      )}
    </div>
  );
});

// ============================================================
// CSS（グローバルCSSに追加推奨）
// ============================================================

export const N3HierarchicalFilterStyles = `
/* N3 Hierarchical Filter - 階層属性フィルター */
.n3-hierarchical-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--panel);
  border-bottom: 1px solid var(--panel-border);
  position: sticky;
  top: 136px;
  z-index: 20;
}

.n3-hierarchical-filter--compact {
  padding: 6px 8px;
  gap: 6px;
}

.n3-hierarchical-filter__label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.n3-hierarchical-filter__select-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.n3-hierarchical-filter__select {
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text);
  background: var(--highlight);
  border: 1px solid var(--panel-border);
  border-radius: 4px;
  min-width: 100px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.n3-hierarchical-filter__select:hover:not(:disabled) {
  border-color: var(--color-primary);
}

.n3-hierarchical-filter__select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.n3-hierarchical-filter__select--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--panel-border);
}

.n3-hierarchical-filter__chevron {
  color: var(--text-muted);
  opacity: 0.5;
}

.n3-hierarchical-filter__reset {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-error);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.n3-hierarchical-filter__reset:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.n3-hierarchical-filter__sync {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--panel-border);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.n3-hierarchical-filter__sync:hover:not(:disabled) {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.n3-hierarchical-filter__sync:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.n3-hierarchical-filter__loading {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-primary);
  font-size: 10px;
  font-weight: 600;
}

.n3-hierarchical-filter__context {
  display: none;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding: 4px 10px;
  font-size: 10px;
  font-family: monospace;
  color: var(--color-primary);
  background: var(--color-primary-light);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 999px;
}

@media (min-width: 1280px) {
  .n3-hierarchical-filter__context {
    display: flex;
  }
}

.n3-hierarchical-filter__context-label {
  font-weight: 700;
  opacity: 0.7;
}
`;

export default N3HierarchicalFilter;
