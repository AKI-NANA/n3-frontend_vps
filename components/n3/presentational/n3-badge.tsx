/**
 * N3Badge - Presentational Component
 *
 * 設計ルール:
 * - size propなし → data-sizeに従う（グローバル設定）
 * - size propあり → 個別に上書き
 *
 * @example
 * <N3Badge variant="success">Active</N3Badge>
 * <N3Badge variant="solid-primary" size="lg">大きいバッジ</N3Badge>
 */

'use client';

import { memo, type ReactNode } from 'react';

// ============================================================
// Types
// ============================================================

export type N3BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'danger'
  | 'info'
  | 'purple'
  | 'gray'
  | 'solid-primary'
  | 'solid-success'
  | 'solid-warning'
  | 'solid-error'
  | 'solid-info'
  | 'solid-purple'
  | 'solid-gray'
  | 'outline-primary'
  | 'outline-success'
  | 'outline-warning'
  | 'outline-error'
  | 'outline-info'
  | 'outline-purple';

export type N3BadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface N3BadgeProps {
  /** バリアント */
  variant?: N3BadgeVariant;
  /** サイズ（指定なしでグローバル設定に従う） */
  size?: N3BadgeSize;
  /** ドット表示 */
  dot?: boolean;
  /** 子要素 */
  children: ReactNode;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Component
// ============================================================

export const N3Badge = memo(function N3Badge({
  variant = 'default',
  size,
  dot = false,
  children,
  className = '',
}: N3BadgeProps) {
  const classes = [
    'n3-badge',
    variant !== 'default' && `n3-badge-${variant}`,
    size && `n3-size-${size}`,
    dot && 'n3-badge-dot',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
});

N3Badge.displayName = 'N3Badge';
