// components/n3/n3-card-grid.tsx
'use client';

import React, { memo } from 'react';
import { N3ProductCard, type N3ProductCardProps } from './n3-product-card';

export interface N3CardGridProps {
  /** カードアイテム */
  items: Array<Omit<N3ProductCardProps, 'compact'>>;
  /** 列数（デフォルト: auto） */
  columns?: number | 'auto';
  /** ギャップ */
  gap?: number;
  /** コンパクトモード */
  compact?: boolean;
  /** 最小カード幅 */
  minCardWidth?: number;
  /** 空時のメッセージ */
  emptyMessage?: string;
}

export const N3CardGrid = memo(function N3CardGrid({
  items,
  columns = 'auto',
  gap = 8,
  compact = false,
  minCardWidth = 160,
  emptyMessage = '商品がありません',
}: N3CardGridProps) {
  if (items.length === 0) {
    return (
      <div
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '13px',
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  const gridStyle: React.CSSProperties =
    columns === 'auto'
      ? {
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`,
          gap: `${gap}px`,
          contentVisibility: 'auto', // 🚀 描画最適化
          containIntrinsicSize: '0 400px',
        }
      : {
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
          contentVisibility: 'auto', // 🚀 描画最適化
          containIntrinsicSize: '0 400px',
        };

  return (
    <div style={gridStyle}>
      {items.map((item) => (
        <N3ProductCard key={item.id} {...item} compact={compact} />
      ))}
    </div>
  );
});

export default N3CardGrid;
