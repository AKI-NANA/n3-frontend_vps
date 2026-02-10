// app/tools/editing-n3/components/header/n3-inventory-filter-bar.tsx
/**
 * N3 マスター（在庫）用フィルターバー（v1.0）
 * 
 * マスタータブ専用のフィルターバー
 * - L1〜L4: DBから動的取得したテキスト分類
 * - 在庫数: 範囲選択
 * - 状態: コンディション
 * - 場所: 保管場所
 * - タイプ変更: セット品/バリエーション/単品
 * - アーカイブ: データ整理用
 */

'use client';

import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { Archive, Package, Layers, Box, RefreshCw } from 'lucide-react';
import { N3FilterDropdown } from '@/components/n3/n3-filter-dropdown';
import type { FilterOption } from '@/components/n3/n3-filter-dropdown';

// ============================================================
// 型定義
// ============================================================

export interface InventoryFilterState {
  l1: string;
  l2: string;
  l3: string;
  l4_marketplace: string;
  stock_range: string;
  condition: string;
  storage_location: string;
}

export interface FilterOptions {
  l1: FilterOption[];
  l2: FilterOption[];
  l3: FilterOption[];
  l4_marketplace: FilterOption[];
  storage_location: FilterOption[];
  condition: FilterOption[];
  stock_range: FilterOption[];
  unset_counts: {
    l1: number;
    l2: number;
    l3: number;
    l4_marketplace: number;
    storage_location: number;
    condition: number;
  };
  total: number;
}

export interface N3InventoryFilterBarProps {
  filters: InventoryFilterState;
  onFilterChange: (key: keyof InventoryFilterState, value: string) => void;
  onResetFilters: () => void;
  // アーカイブ
  isArchiveActive?: boolean;
  onArchiveToggle?: () => void;
  archiveCount?: number;
  // タイプ変更
  selectedIds?: Set<string>;
  onChangeToSet?: (ids: string[]) => Promise<void>;
  onChangeToVariation?: (ids: string[]) => Promise<void>;
  onChangeToSingle?: (ids: string[]) => Promise<void>;
  // 表示件数
  filteredCount?: number;
  totalCount?: number;
}

// ============================================================
// 初期フィルター状態
// ============================================================

export const DEFAULT_INVENTORY_FILTERS: InventoryFilterState = {
  l1: 'all',
  l2: 'all',
  l3: 'all',
  l4_marketplace: 'all',
  stock_range: 'all',
  condition: 'all',
  storage_location: 'all',
};

// ============================================================
// メインコンポーネント
// ============================================================

export const N3InventoryFilterBar = memo(function N3InventoryFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  isArchiveActive = false,
  onArchiveToggle,
  archiveCount = 0,
  selectedIds,
  onChangeToSet,
  onChangeToVariation,
  onChangeToSingle,
  filteredCount = 0,
  totalCount = 0,
}: N3InventoryFilterBarProps) {
  const [options, setOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // フィルターオプションを取得
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        console.log('[N3InventoryFilterBar] Fetching filter options...');
        const res = await fetch('/api/inventory/filter-options');
        const data = await res.json();
        console.log('[N3InventoryFilterBar] API Response:', data);
        if (data.success) {
          setOptions(data.data);
          console.log('[N3InventoryFilterBar] Options set:', data.data);
        } else {
          console.error('[N3InventoryFilterBar] API returned error:', data.error);
        }
      } catch (error) {
        console.error('[N3InventoryFilterBar] Failed to fetch options:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  // フィルターが適用されているか
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => value !== 'all');
  }, [filters]);

  // 選択件数
  const selectedCount = selectedIds?.size || 0;

  // タイプ変更ハンドラー
  const handleChangeToSet = useCallback(async () => {
    if (!selectedIds || selectedIds.size < 2 || !onChangeToSet) return;
    setIsProcessing(true);
    try {
      await onChangeToSet(Array.from(selectedIds));
    } finally {
      setIsProcessing(false);
    }
  }, [selectedIds, onChangeToSet]);

  const handleChangeToVariation = useCallback(async () => {
    if (!selectedIds || selectedIds.size < 2 || !onChangeToVariation) return;
    setIsProcessing(true);
    try {
      await onChangeToVariation(Array.from(selectedIds));
    } finally {
      setIsProcessing(false);
    }
  }, [selectedIds, onChangeToVariation]);

  const handleChangeToSingle = useCallback(async () => {
    if (!selectedIds || selectedIds.size === 0 || !onChangeToSingle) return;
    setIsProcessing(true);
    try {
      await onChangeToSingle(Array.from(selectedIds));
    } finally {
      setIsProcessing(false);
    }
  }, [selectedIds, onChangeToSingle]);

  // オプションをドロップダウン形式に変換
  const l1Options = useMemo(() => 
    options?.l1.map(o => ({ value: o.value, label: o.value, count: o.count })) || [],
  [options]);

  const l2Options = useMemo(() => 
    options?.l2.map(o => ({ value: o.value, label: o.value, count: o.count })) || [],
  [options]);

  const l3Options = useMemo(() => 
    options?.l3.map(o => ({ value: o.value, label: o.value, count: o.count })) || [],
  [options]);

  const l4Options = useMemo(() => 
    options?.l4_marketplace.map(o => ({ value: o.value, label: o.value, count: o.count })) || [],
  [options]);

  const stockOptions = useMemo(() => 
    options?.stock_range || [],
  [options]);

  const conditionOptions = useMemo(() => 
    options?.condition.map(o => ({ value: o.value, label: o.value, count: o.count })) || [],
  [options]);

  const locationOptions = useMemo(() => 
    options?.storage_location.map(o => ({ value: o.value, label: o.value, count: o.count })) || [],
  [options]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 12px',
          background: 'var(--highlight)',
          borderBottom: '1px solid var(--panel-border)',
          height: 32,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          フィルターを読み込み中...
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        background: 'var(--highlight)',
        borderBottom: '1px solid var(--panel-border)',
        height: 32,
        flexShrink: 0,
        // 🔥 overflowをvisibleにしてドロップダウンが表示されるように
        overflow: 'visible',
        position: 'relative',
        zIndex: 50,
      }}
    >
      {/* L1〜L4 ドロップダウン */}
      <N3FilterDropdown
        label="L1"
        value={filters.l1}
        onChange={(v) => onFilterChange('l1', v)}
        options={l1Options}
        showSearch={l1Options.length > 10}
        showUnset={true}
        unsetCount={options?.unset_counts.l1 || 0}
      />

      <N3FilterDropdown
        label="L2"
        value={filters.l2}
        onChange={(v) => onFilterChange('l2', v)}
        options={l2Options}
        showSearch={l2Options.length > 10}
        showUnset={true}
        unsetCount={options?.unset_counts.l2 || 0}
      />

      <N3FilterDropdown
        label="L3"
        value={filters.l3}
        onChange={(v) => onFilterChange('l3', v)}
        options={l3Options}
        showSearch={l3Options.length > 10}
        showUnset={true}
        unsetCount={options?.unset_counts.l3 || 0}
      />

      <N3FilterDropdown
        label="L4販路"
        value={filters.l4_marketplace}
        onChange={(v) => onFilterChange('l4_marketplace', v)}
        options={l4Options}
        showSearch={l4Options.length > 10}
        showUnset={true}
        unsetCount={options?.unset_counts.l4_marketplace || 0}
      />

      {/* セパレーター */}
      <div style={{ width: 1, height: 16, background: 'var(--panel-border)', margin: '0 4px', flexShrink: 0 }} />

      {/* 在庫数・状態・場所 */}
      <N3FilterDropdown
        label="在庫数"
        value={filters.stock_range}
        onChange={(v) => onFilterChange('stock_range', v)}
        options={stockOptions}
        showUnset={false}
      />

      <N3FilterDropdown
        label="状態"
        value={filters.condition}
        onChange={(v) => onFilterChange('condition', v)}
        options={conditionOptions}
        showUnset={true}
        unsetCount={options?.unset_counts.condition || 0}
      />

      <N3FilterDropdown
        label="場所"
        value={filters.storage_location}
        onChange={(v) => onFilterChange('storage_location', v)}
        options={locationOptions}
        showSearch={locationOptions.length > 10}
        showUnset={true}
        unsetCount={options?.unset_counts.storage_location || 0}
      />

      {/* セパレーター */}
      <div style={{ width: 1, height: 16, background: 'var(--panel-border)', margin: '0 4px', flexShrink: 0 }} />

      {/* タイプ変更ボタン（選択時のみ表示） */}
      {selectedCount >= 2 && onChangeToSet && onChangeToVariation && (
        <>
          <button
            onClick={handleChangeToSet}
            disabled={isProcessing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              height: 24,
              padding: '0 8px',
              fontSize: '10px',
              fontWeight: 500,
              background: 'rgba(168, 85, 247, 0.1)',
              color: '#a855f7',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: 4,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.6 : 1,
              whiteSpace: 'nowrap',
            }}
            title={`選択中の${selectedCount}件をセット品に`}
          >
            <Package size={11} />
            →セット品
            <span style={{ padding: '0 3px', background: 'rgba(168, 85, 247, 0.2)', borderRadius: 2, fontSize: '9px' }}>
              {selectedCount}
            </span>
          </button>

          <button
            onClick={handleChangeToVariation}
            disabled={isProcessing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              height: 24,
              padding: '0 8px',
              fontSize: '10px',
              fontWeight: 500,
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 4,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.6 : 1,
              whiteSpace: 'nowrap',
            }}
            title={`選択中の${selectedCount}件をバリエーションに`}
          >
            <Layers size={11} />
            →バリエーション
            <span style={{ padding: '0 3px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: 2, fontSize: '9px' }}>
              {selectedCount}
            </span>
          </button>
        </>
      )}

      {selectedCount >= 1 && onChangeToSingle && (
        <button
          onClick={handleChangeToSingle}
          disabled={isProcessing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            height: 24,
            padding: '0 8px',
            fontSize: '10px',
            fontWeight: 500,
            background: 'rgba(107, 114, 128, 0.1)',
            color: '#6b7280',
            border: '1px solid rgba(107, 114, 128, 0.3)',
            borderRadius: 4,
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            opacity: isProcessing ? 0.6 : 1,
            whiteSpace: 'nowrap',
          }}
          title={`選択中の${selectedCount}件を単品に戻す`}
        >
          <Box size={11} />
          →単品
          <span style={{ padding: '0 3px', background: 'rgba(107, 114, 128, 0.2)', borderRadius: 2, fontSize: '9px' }}>
            {selectedCount}
          </span>
        </button>
      )}

      {/* フィルターリセット（フィルター適用中のみ） */}
      {hasActiveFilters && (
        <>
          <div style={{ width: 1, height: 16, background: 'var(--panel-border)', margin: '0 4px', flexShrink: 0 }} />
          <button
            onClick={onResetFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              height: 24,
              padding: '0 8px',
              fontSize: '10px',
              fontWeight: 500,
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 4,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
            title="フィルターをリセット"
          >
            <RefreshCw size={11} />
            リセット
          </button>
        </>
      )}

      {/* スペーサー */}
      <div style={{ flex: 1 }} />

      {/* 件数表示 */}
      <span style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
        {filteredCount !== totalCount ? `${filteredCount} / ${totalCount}件` : `${totalCount}件`}
      </span>

      {/* アーカイブボタン */}
      {onArchiveToggle && (
        <button
          onClick={onArchiveToggle}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            height: 24,
            padding: '0 8px',
            fontSize: '11px',
            fontWeight: 500,
            background: isArchiveActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
            color: 'var(--text-muted)',
            border: isArchiveActive ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
            borderRadius: 4,
            cursor: 'pointer',
            opacity: archiveCount === 0 && !isArchiveActive ? 0.5 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#8b5cf6',
            color: 'white',
            fontSize: '9px',
            fontWeight: 700,
          }}>
            📦
          </span>
          <span>アーカイブ</span>
          <span style={{ 
            fontSize: '10px', 
            fontWeight: 600, 
            color: isArchiveActive ? '#8b5cf6' : 'var(--text-muted)' 
          }}>
            {archiveCount}
          </span>
        </button>
      )}
    </div>
  );
});

export default N3InventoryFilterBar;
