// components/n3/container/n3-virtual-list.tsx
/**
 * N3VirtualList - 仮想スクロール対応リスト
 *
 * ゴールドスタンダード:
 * - 100件超のリストで義務化
 * - react-windowによる高速レンダリング
 * - React.memoでメモ化
 */

'use client';

import React, { memo, useCallback, useMemo, useRef, CSSProperties } from 'react';
import { FixedSizeList, VariableSizeList, ListChildComponentProps } from 'react-window';
import { N3Loading } from '../presentational/n3-loading';

// ============================================================
// 型定義
// ============================================================

export interface N3VirtualListProps<T> {
  /** データ配列 */
  items: T[];
  /** 行の高さ（固定） */
  itemHeight: number;
  /** リストの高さ */
  height: number;
  /** リストの幅（デフォルト: 100%） */
  width?: number | string;
  /** アイテムのキー取得関数 */
  getItemKey?: (index: number, data: T[]) => string | number;
  /** アイテムレンダラー */
  renderItem: (item: T, index: number, style: CSSProperties) => React.ReactNode;
  /** ローディング状態 */
  loading?: boolean;
  /** 空状態メッセージ */
  emptyMessage?: string;
  /** オーバースキャン（バッファ行数） */
  overscanCount?: number;
  /** スクロール位置変更ハンドラ */
  onScroll?: (scrollOffset: number) => void;
  /** 追加クラス名 */
  className?: string;
}

// ============================================================
// 内部Row コンポーネント
// ============================================================

interface RowProps<T> {
  data: {
    items: T[];
    renderItem: (item: T, index: number, style: CSSProperties) => React.ReactNode;
  };
  index: number;
  style: CSSProperties;
}

const Row = memo(function Row<T>({ data, index, style }: RowProps<T>) {
  const { items, renderItem } = data;
  const item = items[index];
  return <>{renderItem(item, index, style)}</>;
}) as <T>(props: RowProps<T>) => React.ReactElement;

// ============================================================
// N3VirtualList コンポーネント
// ============================================================

export const N3VirtualList = memo(function N3VirtualList<T>({
  items,
  itemHeight,
  height,
  width = '100%',
  getItemKey,
  renderItem,
  loading = false,
  emptyMessage = 'データがありません',
  overscanCount = 5,
  onScroll,
  className = '',
}: N3VirtualListProps<T>) {
  const listRef = useRef<FixedSizeList>(null);

  // アイテムデータをメモ化
  const itemData = useMemo(
    () => ({ items, renderItem }),
    [items, renderItem]
  );

  // スクロールハンドラ
  const handleScroll = useCallback(
    ({ scrollOffset }: { scrollOffset: number }) => {
      onScroll?.(scrollOffset);
    },
    [onScroll]
  );

  // キー取得関数
  const itemKey = useCallback(
    (index: number, data: { items: T[] }) => {
      if (getItemKey) {
        return getItemKey(index, data.items);
      }
      return index;
    },
    [getItemKey]
  );

  // ローディング状態
  if (loading) {
    return (
      <div
        className={className}
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--panel)',
        }}
      >
        <N3Loading size="md" text="読み込み中..." />
      </div>
    );
  }

  // 空状態
  if (items.length === 0) {
    return (
      <div
        className={className}
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--panel)',
          color: 'var(--text-muted)',
          fontSize: '14px',
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <FixedSizeList
      ref={listRef}
      height={height}
      width={width}
      itemCount={items.length}
      itemSize={itemHeight}
      itemData={itemData}
      itemKey={itemKey}
      overscanCount={overscanCount}
      onScroll={handleScroll}
      className={className}
      style={{
        background: 'var(--panel)',
      }}
    >
      {Row as React.ComponentType<ListChildComponentProps>}
    </FixedSizeList>
  );
}) as <T>(props: N3VirtualListProps<T>) => React.ReactElement;

// ============================================================
// N3VirtualCardGrid - カードグリッド用仮想スクロール
// ============================================================

export interface N3VirtualCardGridProps<T> {
  /** データ配列 */
  items: T[];
  /** カードの高さ */
  cardHeight: number;
  /** 列数 */
  columns: number;
  /** リストの高さ */
  height: number;
  /** ギャップ */
  gap?: number;
  /** アイテムのキー取得関数 */
  getItemKey?: (item: T) => string | number;
  /** カードレンダラー */
  renderCard: (item: T, index: number) => React.ReactNode;
  /** ローディング状態 */
  loading?: boolean;
  /** 空状態メッセージ */
  emptyMessage?: string;
  /** 追加クラス名 */
  className?: string;
}

export const N3VirtualCardGrid = memo(function N3VirtualCardGrid<T>({
  items,
  cardHeight,
  columns,
  height,
  gap = 16,
  getItemKey,
  renderCard,
  loading = false,
  emptyMessage = 'データがありません',
  className = '',
}: N3VirtualCardGridProps<T>) {
  // 行数を計算
  const rowCount = Math.ceil(items.length / columns);
  const rowHeight = cardHeight + gap;

  // 行レンダラー
  const renderRow = useCallback(
    (_: unknown, rowIndex: number, style: CSSProperties) => {
      const startIndex = rowIndex * columns;
      const rowItems = items.slice(startIndex, startIndex + columns);

      return (
        <div
          style={{
            ...style,
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${gap}px`,
            padding: `0 ${gap}px`,
          }}
        >
          {rowItems.map((item, colIndex) => {
            const index = startIndex + colIndex;
            const key = getItemKey ? getItemKey(item) : index;
            return (
              <div key={key} style={{ height: cardHeight }}>
                {renderCard(item, index)}
              </div>
            );
          })}
        </div>
      );
    },
    [items, columns, gap, cardHeight, renderCard, getItemKey]
  );

  // ローディング状態
  if (loading) {
    return (
      <div
        className={className}
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--panel)',
        }}
      >
        <N3Loading size="md" text="読み込み中..." />
      </div>
    );
  }

  // 空状態
  if (items.length === 0) {
    return (
      <div
        className={className}
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--panel)',
          color: 'var(--text-muted)',
          fontSize: '14px',
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  // 仮想行データ
  const rowItems = Array.from({ length: rowCount }, (_, i) => i);

  return (
    <N3VirtualList
      items={rowItems}
      itemHeight={rowHeight}
      height={height}
      renderItem={renderRow}
      className={className}
    />
  );
}) as <T>(props: N3VirtualCardGridProps<T>) => React.ReactElement;

export default N3VirtualList;
