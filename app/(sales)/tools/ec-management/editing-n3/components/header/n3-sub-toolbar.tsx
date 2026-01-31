// app/tools/editing-n3/components/header/n3-sub-toolbar.tsx
/**
 * N3SubToolbar - サブツールバーコンポーネント
 * 
 * v7.0: 
 * - 絞込・検索をこの行に統合
 * - 監査ボタンを小さく統一（高さ24px）
 * - 全ボタン高さ統一
 */

'use client';

import React, { memo, useState, useCallback } from 'react';
import { Zap, Filter, Search, X, RotateCcw, Archive, ArchiveRestore } from 'lucide-react';
import { N3FeatureTooltip, N3TooltipToggle, N3ViewModeToggle, N3Divider } from '@/components/n3';
import { useTooltipSettingsStore, selectIsTooltipEnabled } from '@/store/tooltipSettingsStore';
import { SUBTOOLBAR_TOOLTIPS } from '@/lib/tooltip-contents';
import { BulkAuditButton } from '../bulk-audit-button';
import { SmartProcessButton } from '../smart-process-button';
import { FlowPhaseSummary } from '../flow-phase-badge';
import { SpreadsheetSyncMenu } from '../sync';
import { SmartPipelineButton } from '../pipeline/smart-pipeline-button';
import type { SortField } from '../../hooks/use-inventory-data';
import type { Product } from '@/app/tools/editing/types/product';
import type { ProductPhase } from '@/lib/product/phase-status';

// ============================================================
// 型定義
// ============================================================

export interface N3SubToolbarProps {
  tipsEnabled?: boolean;
  onTipsToggle?: () => void;
  fastMode: boolean;
  onFastModeToggle: () => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  displayCount: number;
  totalCount: number;
  viewMode: 'list' | 'card';
  onViewModeChange: (mode: 'list' | 'card') => void;
  isInventoryTab: boolean;
  sortOption?: { field: SortField; order: 'asc' | 'desc' };
  onSortOptionChange?: (option: { field: SortField; order: 'asc' | 'desc' }) => void;
  
  // 監査機能
  selectedProducts?: Product[];
  onOpenAuditPanel?: (product: Product) => void;
  onAuditComplete?: () => void;
  
  // スマート処理
  allProducts?: Product[];
  onRefresh?: () => Promise<void>;
  onPhaseFilter?: (phase: ProductPhase) => void;
  
  // 絞込・検索
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearchSubmit?: () => void;
  
  // アーカイブ機能
  onArchive?: (productIds: string[]) => Promise<void>;
  onUnarchive?: (productIds: string[]) => Promise<void>;
  activeFilter?: string;
}

// ============================================================
// 統一ボタンスタイル
// ============================================================
const BUTTON_HEIGHT = 24;
const BUTTON_STYLE_BASE: React.CSSProperties = {
  height: BUTTON_HEIGHT,
  fontSize: '11px',
  borderRadius: 4,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
};

// ============================================================
// メインコンポーネント
// ============================================================

export const N3SubToolbar = memo(function N3SubToolbar({
  fastMode, onFastModeToggle,
  pageSize, onPageSizeChange, displayCount, totalCount,
  viewMode, onViewModeChange, isInventoryTab, sortOption, onSortOptionChange,
  selectedProducts, onOpenAuditPanel, onAuditComplete,
  allProducts, onRefresh, onPhaseFilter,
  searchQuery = '',
  onSearchChange,
  onSearchSubmit,
  onArchive,
  onUnarchive,
  activeFilter,
}: N3SubToolbarProps) {
  const isTooltipEnabled = useTooltipSettingsStore(selectIsTooltipEnabled);
  const showSmartProcess = !isInventoryTab && selectedProducts && selectedProducts.length > 0;
  
  // ローカル検索入力状態
  const [localSearchInput, setLocalSearchInput] = useState(searchQuery);
  
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchInput(e.target.value);
    onSearchChange?.(e.target.value);
  }, [onSearchChange]);
  
  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearchSubmit?.();
    }
  }, [onSearchSubmit]);
  
  const handleClearSearch = useCallback(() => {
    setLocalSearchInput('');
    onSearchChange?.('');
    onSearchSubmit?.();
  }, [onSearchChange, onSearchSubmit]);
  
  return (
    <div style={{ 
      height: 36, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      background: 'var(--panel)', 
      borderBottom: '1px solid var(--panel-border)', 
      padding: '0 12px', 
      flexShrink: 0,
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* 監査ボタン（小さく統一） */}
        {selectedProducts && onOpenAuditPanel && !isInventoryTab && (
          <>
            <BulkAuditButton
              selectedProducts={selectedProducts}
              onOpenAuditPanel={onOpenAuditPanel}
              onRefresh={onAuditComplete}
              compact
            />
            <N3Divider orientation="vertical" style={{ height: 16, margin: '0 2px' }} />
          </>
        )}
        
        {/* Tips切り替え */}
        <N3TooltipToggle compact />
        
        {/* 高速モード */}
        <button
          onClick={onFastModeToggle}
          style={{
            ...BUTTON_STYLE_BASE,
            padding: '0 8px',
            background: fastMode ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
            border: '1px solid',
            borderColor: fastMode ? 'rgba(245, 158, 11, 0.3)' : 'var(--panel-border)',
            color: fastMode ? 'rgb(245, 158, 11)' : 'var(--text-muted)',
          }}
        >
          <Zap size={11} /><span>Fast</span>
        </button>
        
        {/* ページサイズ */}
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          style={{ 
            height: BUTTON_HEIGHT, 
            padding: '0 6px', 
            fontSize: '11px', 
            border: '1px solid var(--panel-border)', 
            borderRadius: 4, 
            background: 'var(--panel)', 
            color: 'var(--text)' 
          }}
        >
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={500}>500</option>
        </select>
        
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{displayCount}/{totalCount}件</span>
        
        <N3Divider orientation="vertical" style={{ height: 16, margin: '0 2px' }} />
        
        {/* 🔍 絞込ボタン + 検索バー */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--highlight)',
            borderRadius: 4,
            padding: '0 2px 0 8px',
            border: '1px solid var(--panel-border)',
            height: BUTTON_HEIGHT,
            gap: 4,
          }}
        >
          <Filter size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>絞込</span>
          <div style={{ width: 1, height: 12, background: 'var(--panel-border)', margin: '0 4px' }} />
          <Search size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            value={localSearchInput}
            onChange={handleSearchInputChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="SKU, タイトル..."
            style={{
              width: 120,
              padding: '2px 4px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '11px',
              color: 'var(--text)',
            }}
          />
          {localSearchInput && (
            <X
              size={11}
              style={{ color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0, marginRight: 4 }}
              onClick={handleClearSearch}
            />
          )}
        </div>
        
        {/* 棚卸し用ソート */}
        {isInventoryTab && sortOption && onSortOptionChange && (
          <>
            <N3Divider orientation="vertical" style={{ height: 16, margin: '0 4px' }} />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>並び:</span>
            <select
              value={sortOption.field}
              onChange={(e) => onSortOptionChange({ ...sortOption, field: e.target.value as SortField })}
              style={{ 
                height: BUTTON_HEIGHT, 
                padding: '0 6px', 
                fontSize: '10px', 
                border: '1px solid var(--panel-border)', 
                borderRadius: 4, 
                background: 'var(--panel)', 
                color: 'var(--text)' 
              }}
            >
              <option value="created_at">登録日</option>
              <option value="updated_at">更新日</option>
              <option value="product_name">商品名</option>
              <option value="sku">SKU</option>
              <option value="cost_price">原価</option>
            </select>
            <button
              onClick={() => onSortOptionChange({ ...sortOption, order: sortOption.order === 'desc' ? 'asc' : 'desc' })}
              style={{ 
                ...BUTTON_STYLE_BASE,
                width: BUTTON_HEIGHT, 
                padding: 0,
                justifyContent: 'center',
                border: '1px solid var(--panel-border)', 
                background: 'var(--panel)', 
                color: 'var(--text)',
              }}
            >
              {sortOption.order === 'desc' ? '↓' : '↑'}
            </button>
          </>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* スプレッドシート同期メニュー（在庫タブのみ表示） */}
        {isInventoryTab && (
          <>
            <SpreadsheetSyncMenu onRefresh={onRefresh} compact />
            <N3Divider orientation="vertical" style={{ height: 16, margin: '0 2px' }} />
          </>
        )}
        
        {/* 🔥 スマートパイプラインボタン (選択時のみ表示) */}
        {selectedProducts && selectedProducts.length > 0 && !isInventoryTab && (
          <>
            <SmartPipelineButton
              selectedProducts={selectedProducts}
              onRefresh={onRefresh}
              onComplete={onAuditComplete}
            />
            <N3Divider orientation="vertical" style={{ height: 16, margin: '0 2px' }} />
          </>
        )}
        
        {/* アーカイブボタン (選択時のみ表示) */}
        {selectedProducts && selectedProducts.length > 0 && !isInventoryTab && (
          <>
            {activeFilter === 'archived' ? (
              <button
                onClick={() => onUnarchive?.(selectedProducts.map(p => String(p.id)))}
                style={{
                  ...BUTTON_STYLE_BASE,
                  padding: '0 10px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#3b82f6',
                }}
                title="アーカイブ解除"
              >
                <ArchiveRestore size={12} />
                <span>解除 ({selectedProducts.length})</span>
              </button>
            ) : (
              <button
                onClick={() => onArchive?.(selectedProducts.map(p => String(p.id)))}
                style={{
                  ...BUTTON_STYLE_BASE,
                  padding: '0 10px',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  color: '#6b7280',
                }}
                title="アーカイブ"
              >
                <Archive size={12} />
                <span>📦 ({selectedProducts.length})</span>
              </button>
            )}
            <N3Divider orientation="vertical" style={{ height: 16, margin: '0 2px' }} />
          </>
        )}
        
        {/* ビューモード切替 */}
        <N3ViewModeToggle value={viewMode} onChange={onViewModeChange} size="sm" showLabels={true} />
      </div>
    </div>
  );
});

export default N3SubToolbar;
