/**
 * N3Toolbar - Container Component
 *
 * ツールバー（ToolPanelの共通版）
 *
 * 設計ルール:
 * - 状態とロジックを子に注入
 * - 子要素間のgap/marginを定義（Container責務）
 * - Hooksを呼び出せる
 *
 * @example
 * <N3Toolbar>
 *   <N3Toolbar.Group>
 *     <N3Button>Action 1</N3Button>
 *     <N3Button>Action 2</N3Button>
 *   </n3-toolbar.Group>
 *   <N3Toolbar.Divider />
 *   <N3Toolbar.Group>
 *     <N3Button>Action 3</N3Button>
 *   </n3-toolbar.Group>
 * </N3Toolbar>
 */

'use client';

import { memo, type ReactNode } from 'react';

// ============================================================
// Types
// ============================================================

export interface N3ToolbarProps {
  /** 子要素 */
  children: ReactNode;
  /** 追加のクラス名 */
  className?: string;
}

export interface N3ToolbarGroupProps {
  /** 子要素 */
  children: ReactNode;
  /** ラベル */
  label?: string;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Sub Components
// ============================================================

const ToolbarGroup = memo(function ToolbarGroup({
  children,
  label,
  className = '',
}: N3ToolbarGroupProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {label && (
        <span className="text-[10px] font-semibold text-[var(--text-muted)] mr-1">
          {label}
        </span>
      )}
      {children}
    </div>
  );
});

const ToolbarDivider = memo(function ToolbarDivider() {
  return <div className="n3-toolbar-divider" />;
});

const ToolbarSpacer = memo(function ToolbarSpacer() {
  return <div className="flex-1" />;
});

// ============================================================
// Main Component
// ============================================================

export const N3Toolbar = memo(function N3Toolbar({
  children,
  className = '',
}: N3ToolbarProps) {
  const classes = ['n3-toolbar', className].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
}) as ReturnType<typeof memo<typeof N3ToolbarBase>> & {
  Group: typeof ToolbarGroup;
  Divider: typeof ToolbarDivider;
  Spacer: typeof ToolbarSpacer;
};

// Attach sub-components
const N3ToolbarBase = N3Toolbar;
N3Toolbar.Group = ToolbarGroup;
N3Toolbar.Divider = ToolbarDivider;
N3Toolbar.Spacer = ToolbarSpacer;

N3Toolbar.displayName = 'N3Toolbar';
