/**
 * N3ContentArea - Layout (View) Component
 *
 * コンテンツエリア（ツールバー、データリスト、編集フォームの配置）
 *
 * 設計ルール:
 * - ツールバー、主要なデータリストや編集フォームの配置
 *
 * @example
 * <N3ContentArea>
 *   <DataTable />
 * </N3ContentArea>
 */

'use client';

import { memo, type ReactNode } from 'react';

// ============================================================
// Types
// ============================================================

export interface N3ContentAreaProps {
  /** メインコンテンツ */
  children: ReactNode;
  /** パディングなし */
  noPadding?: boolean;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Component
// ============================================================

export const N3ContentArea = memo(function N3ContentArea({
  children,
  noPadding = false,
  className = '',
}: N3ContentAreaProps) {
  const classes = [
    'n3-content-area',
    noPadding && 'n3-content-area--no-padding',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
});

N3ContentArea.displayName = 'N3ContentArea';
