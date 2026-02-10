/**
 * N3StatusDot - Presentational Component
 *
 * 設計ルール:
 * - size propなし → data-sizeに従う（グローバル設定）
 * - size propあり → 個別に上書き
 *
 * @example
 * <N3StatusDot status="online" />
 * <N3StatusDot status="busy" pulsing />
 */

'use client';

import { memo } from 'react';

// ============================================================
// Types
// ============================================================

export type N3StatusDotStatus = 'online' | 'offline' | 'away' | 'busy';
export type N3StatusDotSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface N3StatusDotProps {
  /** ステータス */
  status?: N3StatusDotStatus;
  /** サイズ（指定なしでグローバル設定に従う） */
  size?: N3StatusDotSize;
  /** パルスアニメーション */
  pulsing?: boolean;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Component
// ============================================================

export const N3StatusDot = memo(function N3StatusDot({
  status = 'online',
  size,
  pulsing = false,
  className = '',
}: N3StatusDotProps) {
  const classes = [
    'n3-status-dot',
    `n3-status-dot-${status}`,
    size && `n3-size-${size}`,
    pulsing && 'n3-status-dot-pulse',
    className,
  ].filter(Boolean).join(' ');

  return <span className={classes} />;
});

N3StatusDot.displayName = 'N3StatusDot';
