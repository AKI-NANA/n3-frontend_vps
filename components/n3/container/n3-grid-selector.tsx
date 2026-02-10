/**
 * N3GridSelector - 汎用グリッド選択コンポーネント
 * 
 * チェックボックス付きグリッド選択。承認/在庫管理に限定しない汎用実装
 * 
 * @example
 * <N3GridSelector
 *   items={products}
 *   selectedIds={selectedIds}
 *   onToggleSelect={handleToggle}
 *   renderItem={(item) => <ProductThumbnail item={item} />}
 *   getItemId={(item) => item.id}
 *   columns={5}
 * />
 */

'use client';

import React, { memo, type ReactNode, useCallback } from 'react';
import { Package, RefreshCw } from 'lucide-react';

// ============================================================
// Types
// ============================================================

export interface GridItem {
  id: string | number;
  [key: string]: any;
}

// ============================================================
// N3GridSelector
// ============================================================

export interface N3GridSelectorProps<T extends GridItem> {
  /** アイテム一覧 */
  items: T[];
  /** 選択中のID */
  selectedIds: Set<string | number>;
  /** 選択トグル */
  onToggleSelect: (id: string | number) => void;
  /** アイテムのレンダリング関数 */
  renderItem: (item: T, isSelected: boolean) => ReactNode;
  /** ID取得関数 */
  getItemId?: (item: T) => string | number;
  /** 全選択/解除 */
  onSelectAll?: () => void;
  /** ローディング状態 */
  loading?: boolean;
  /** 空状態メッセージ */
  emptyMessage?: string;
  /** 空状態ヒント */
  emptyHint?: string;
  /** 列数 */
  columns?: 2 | 3 | 4 | 5 | 6 | 'auto';
  /** 最小カード幅（auto時） */
  minCardWidth?: number;
  /** ギャップ */
  gap?: 'sm' | 'md' | 'lg';
  /** ツールバー */
  toolbar?: ReactNode;
  /** 追加のクラス名 */
  className?: string;
}

export const N3GridSelector = memo(function N3GridSelector<T extends GridItem>({
  items,
  selectedIds,
  onToggleSelect,
  renderItem,
  getItemId = (item) => item.id,
  onSelectAll,
  loading = false,
  emptyMessage = 'No items found',
  emptyHint,
  columns = 'auto',
  minCardWidth = 180,
  gap = 'md',
  toolbar,
  className = '',
}: N3GridSelectorProps<T>) {
  const gapSizes = { sm: 8, md: 12, lg: 16 };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gap: gapSizes[gap],
    gridTemplateColumns: columns === 'auto'
      ? `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`
      : `repeat(${columns}, 1fr)`,
  };

  // ローディング
  if (loading) {
    return (
      <div className={`n3-grid-selector ${className}`}>
        <div className="n3-grid-selector__loading">
          <RefreshCw className="n3-grid-selector__loading-icon" />
          <p className="n3-grid-selector__loading-text">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 空状態
  if (items.length === 0) {
    return (
      <div className={`n3-grid-selector ${className}`}>
        {toolbar && <div className="n3-grid-selector__toolbar">{toolbar}</div>}
        <div className="n3-grid-selector__empty">
          <Package className="n3-grid-selector__empty-icon" />
          <p className="n3-grid-selector__empty-title">{emptyMessage}</p>
          {emptyHint && (
            <p className="n3-grid-selector__empty-hint">{emptyHint}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`n3-grid-selector ${className}`}>
      {toolbar && <div className="n3-grid-selector__toolbar">{toolbar}</div>}
      
      <div className="n3-grid-selector__count">
        選択: <strong>{selectedIds.size}</strong> / {items.length} 件
        {onSelectAll && (
          <button
            onClick={onSelectAll}
            className="n3-btn n3-btn-ghost n3-btn-sm"
            style={{ marginLeft: 'var(--n3-gap)' }}
          >
            {selectedIds.size === items.length ? '全解除' : '全選択'}
          </button>
        )}
      </div>

      <div className="n3-grid-selector__grid" style={gridStyle}>
        {items.map((item) => {
          const id = getItemId(item);
          const isSelected = selectedIds.has(id);
          
          return (
            <div
              key={id}
              className={`n3-grid-selector__item ${isSelected ? 'n3-grid-selector__item--selected' : ''}`}
              onClick={() => onToggleSelect(id)}
            >
              {renderItem(item, isSelected)}
            </div>
          );
        })}
      </div>
    </div>
  );
}) as <T extends GridItem>(props: N3GridSelectorProps<T>) => React.ReactElement;

(N3GridSelector as any).displayName = 'N3GridSelector';

// ============================================================
// N3GridSelectorToolbar - ツールバー
// ============================================================

export interface N3GridSelectorToolbarProps {
  children: ReactNode;
  className?: string;
}

export const N3GridSelectorToolbar = memo(function N3GridSelectorToolbar({
  children,
  className = '',
}: N3GridSelectorToolbarProps) {
  return (
    <div className={`n3-grid-selector-toolbar ${className}`}>
      {children}
    </div>
  );
});

N3GridSelectorToolbar.displayName = 'N3GridSelectorToolbar';
