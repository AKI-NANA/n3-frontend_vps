// components/n3/n3-stats-bar.tsx
'use client';

import React, { memo } from 'react';
import { N3StatsCard, N3StatsCardProps } from './n3-stats-card';

export interface N3StatsBarProps {
  /** 統計カードの配列 */
  stats: Array<Omit<N3StatsCardProps, 'size'>>;
  /** カードサイズ */
  size?: 'compact' | 'sm' | 'md' | 'lg';
  /** ギャップ */
  gap?: number;
  /** ローディング状態 */
  loading?: boolean;
}

export const N3StatsBar = memo(function N3StatsBar({
  stats,
  size = 'md',
  gap = 8,
  loading = false,
}: N3StatsBarProps) {
  // コンパクトモード: 横並びインライン
  if (size === 'compact') {
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: `${gap}px`,
        }}
      >
        {stats.map((stat, index) => (
          <N3StatsCard
            key={stat.label || index}
            {...stat}
            size="compact"
            loading={loading}
          />
        ))}
      </div>
    );
  }

  // 通常モード: グリッド
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${size === 'sm' ? '120px' : '160px'}, 1fr))`,
        gap: `${gap}px`,
        width: '100%',
      }}
    >
      {stats.map((stat, index) => (
        <N3StatsCard
          key={stat.label || index}
          {...stat}
          size={size}
          loading={loading}
        />
      ))}
    </div>
  );
});

export default N3StatsBar;
