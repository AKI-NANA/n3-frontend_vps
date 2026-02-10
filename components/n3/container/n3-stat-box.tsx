/**
 * N3StatBox - 統計ボックスコンポーネント
 * 
 * /tools/editing の ProductModal で使用
 * ラベル + 値の小さな統計表示ボックス
 */

'use client';

import React, { memo } from 'react';

export interface N3StatBoxProps {
  /** ラベル */
  label: string;
  /** 値 */
  value: string | number;
  /** 値の色（CSS変数または直接色指定） */
  color?: string;
  /** モノスペースフォント */
  mono?: boolean;
  /** サイズ */
  size?: 'sm' | 'md' | 'lg';
  /** クリックハンドラ */
  onClick?: () => void;
}

export const N3StatBox = memo(function N3StatBox({
  label,
  value,
  color,
  mono = false,
  size = 'md',
  onClick,
}: N3StatBoxProps) {
  const sizeStyles = {
    sm: { padding: '0.375rem', labelSize: '7px', valueSize: '10px' },
    md: { padding: '0.5rem', labelSize: '8px', valueSize: '12px' },
    lg: { padding: '0.625rem', labelSize: '9px', valueSize: '14px' },
  };

  const s = sizeStyles[size];

  return (
    <div
      onClick={onClick}
      style={{
        padding: s.padding,
        borderRadius: '4px',
        background: 'var(--highlight)',
        textAlign: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: onClick ? 'all 0.15s ease' : undefined,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.background = 'var(--panel-border)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.background = 'var(--highlight)';
        }
      }}
    >
      <div
        style={{
          fontSize: s.labelSize,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          color: 'var(--text-subtle)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: s.valueSize,
          fontWeight: 700,
          fontFamily: mono ? 'monospace' : 'inherit',
          color: color || 'var(--text)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
    </div>
  );
});

/**
 * N3StatGrid - 統計ボックスのグリッド配置
 */
export interface N3StatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: string;
}

export const N3StatGrid = memo(function N3StatGrid({
  children,
  columns = 4,
  gap = '0.5rem',
}: N3StatGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
    >
      {children}
    </div>
  );
});
