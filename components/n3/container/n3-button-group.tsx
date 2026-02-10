/**
 * N3ButtonGroup - Container Component
 *
 * ボタングループ
 *
 * 設計ルール:
 * - 状態とロジックを子に注入
 * - 子要素間のgap/marginを定義（Container責務）
 *
 * @example
 * <N3ButtonGroup>
 *   <N3Button variant="ghost">Left</N3Button>
 *   <N3Button variant="ghost">Center</N3Button>
 *   <N3Button variant="ghost">Right</N3Button>
 * </N3ButtonGroup>
 */

'use client';

import { memo, type ReactNode } from 'react';

// ============================================================
// Types
// ============================================================

export interface N3ButtonGroupProps {
  /** 子要素（N3Buttonコンポーネント） */
  children: ReactNode;
  /** 垂直方向に配置 */
  vertical?: boolean;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Component
// ============================================================

export const N3ButtonGroup = memo(function N3ButtonGroup({
  children,
  vertical = false,
  className = '',
}: N3ButtonGroupProps) {
  const classes = [
    'n3-btn-group',
    vertical && 'n3-btn-group-vertical',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
});

N3ButtonGroup.displayName = 'N3ButtonGroup';
