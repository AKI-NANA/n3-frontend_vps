// app/tools/editing-n3/components/header/n3-sub-toolbar.tsx
/**
 * N3SubToolbar - サブツールバーコンポーネント
 * 
 * 責務:
 * - Tips/Fastボタン
 * - ページサイズ選択
 * - ソート設定（棚卸しタブ用）
 * - ビューモード切替
 * - 🔥 一括監査ボタン
 */

'use client';

import React, { memo } from 'react';
import { Zap, Lightbulb } from 'lucide-react';
import { N3Tooltip, N3ViewModeToggle, N3Divider } from '@/components/n3';
import { BulkAuditButton } from '../bulk-audit-button';
import type { SortField } from '../../hooks/use-inventory-data';
import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

export interface N3SubToolbarProps {
  /** Tips有効 */
  tipsEnabled: boolean;
  /** Tips切替 */
  onTipsToggle: () => void;
  /** 高速モード */
  fastMode: boolean;
  /** 高速モード切替 */
  onFastModeToggle: () => void;
  /** ページサイズ */
  pageSize: number;
  /** ページサイズ変更 */
  onPageSizeChange: (size: number) => void;
  /** 表示件数 */
  displayCount: number;
  /** 総件数 */
  totalCount: number;
  /** ビューモード */
  viewMode: 'list' | 'card';
  /** ビューモード変更 */
  onViewModeChange: (mode: 'list' | 'card') => void;
  /** 棚卸しタブか */
  isInventoryTab: boolean;
  /** ソートオプション（棚卸し用） */
  sortOption?: { field: SortField; order: 'asc' | 'desc' };
  /** ソートオプション変更（棚卸し用） */
  onSortOptionChange?: (option: { field: SortField; order: 'asc' | 'desc' }) => void;
  
  // 🔥 監査機能用 props
  /** 選択された商品リスト */
  selectedProducts?: Product[];
  /** 監査パネルを開く */
  onOpenAuditPanel?: (product: Product) => void;
  /** 監査完了時のコールバック */
  onAuditComplete?: () => void;
}

// ============================================================
// メインコンポーネント
// ============================================================

export const N3SubToolbar = memo(function N3SubToolbar({
  tipsEnabled, onTipsToggle, fastMode, onFastModeToggle,
  pageSize, onPageSizeChange, displayCount, totalCount,
  viewMode, onViewModeChange, isInventoryTab, sortOption, onSortOptionChange,
  selectedProducts, onOpenAuditPanel, onAuditComplete,
}: N3SubToolbarProps) {
  return (
    <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--panel)', borderBottom: '1px solid var(--panel-border)', padding: '0 12px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* 🔥 一括監査ボタン */}
        {selectedProducts && onOpenAuditPanel && !isInventoryTab && (
          <>
            <BulkAuditButton
              selectedProducts={selectedProducts}
              onOpenAuditPanel={onOpenAuditPanel}
              onRefresh={onAuditComplete}
            />
            <N3Divider orientation="vertical" style={{ height: 20, margin: '0 4px' }} />
          </>
        )}
        
        <N3Tooltip content="Tips切り替え" position="bottom">
          <button
            onClick={onTipsToggle}
            style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', fontSize: '11px',
              background: tipsEnabled ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              border: '1px solid', borderColor: tipsEnabled ? 'rgba(59, 130, 246, 0.3)' : 'var(--panel-border)',
              borderRadius: '4px', color: tipsEnabled ? 'rgb(59, 130, 246)' : 'var(--text-muted)', cursor: 'pointer',
            }}
          >
            <Lightbulb size={12} /><span>Tips</span>
          </button>
        </N3Tooltip>
        
        <button
          onClick={onFastModeToggle}
          style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', fontSize: '11px',
            background: fastMode ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
            border: '1px solid', borderColor: fastMode ? 'rgba(245, 158, 11, 0.3)' : 'var(--panel-border)',
            borderRadius: '4px', color: fastMode ? 'rgb(245, 158, 11)' : 'var(--text-muted)', cursor: 'pointer',
          }}
        >
          <Zap size={12} /><span>Fast</span>
        </button>
        
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          style={{ height: 28, padding: '0 8px', fontSize: '11px', border: '1px solid var(--panel-border)', borderRadius: '4px', background: 'var(--panel)', color: 'var(--text)' }}
        >
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={500}>500</option>
        </select>
        
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{displayCount}/{totalCount}件</span>
        
        {isInventoryTab && sortOption && onSortOptionChange && (
          <>
            <N3Divider orientation="vertical" style={{ height: 20, margin: '0 8px' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>並び順:</span>
            <select
              value={sortOption.field}
              onChange={(e) => onSortOptionChange({ ...sortOption, field: e.target.value as SortField })}
              style={{ height: 28, padding: '0 8px', fontSize: '11px', border: '1px solid var(--panel-border)', borderRadius: '4px', background: 'var(--panel)', color: 'var(--text)' }}
            >
              <option value="created_at">登録日</option>
              <option value="updated_at">更新日</option>
              <option value="product_name">商品名</option>
              <option value="sku">SKU</option>
              <option value="cost_price">原価</option>
            </select>
            <button
              onClick={() => onSortOptionChange({ ...sortOption, order: sortOption.order === 'desc' ? 'asc' : 'desc' })}
              style={{ height: 28, width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--panel-border)', borderRadius: '4px', background: 'var(--panel)', color: 'var(--text)', cursor: 'pointer' }}
            >
              {sortOption.order === 'desc' ? '↓' : '↑'}
            </button>
          </>
        )}
      </div>
      
      <N3ViewModeToggle value={viewMode} onChange={onViewModeChange} size="sm" showLabels={true} />
    </div>
  );
});

export default N3SubToolbar;
