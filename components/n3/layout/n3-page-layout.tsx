/**
 * N3PageLayout - Layout (View) Component
 *
 * ページ全体の標準レイアウト
 *
 * 設計ルール:
 * - ページ全体の構成を定義
 * - 4領域: Root Layout, Page Header, Content Area, Modal/Overlay
 * - 遅延読み込み（lazy）でモーダル管理
 *
 * @example
 * <N3PageLayout
 *   header={<N3PageHeader title="Editing" />}
 *   toolbar={<N3Toolbar>...</N3Toolbar>}
 * >
 *   <MainContent />
 * </N3PageLayout>
 */

'use client';

import { memo, type ReactNode } from 'react';

// ============================================================
// Types
// ============================================================

export interface N3PageLayoutProps {
  /** ページヘッダー */
  header?: ReactNode;
  /** ツールバー */
  toolbar?: ReactNode;
  /** フィルターバー */
  filterBar?: ReactNode;
  /** サイドバー（左） */
  leftSidebar?: ReactNode;
  /** サイドバー（右） */
  rightSidebar?: ReactNode;
  /** フッター */
  footer?: ReactNode;
  /** メインコンテンツ */
  children: ReactNode;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Component
// ============================================================

export const N3PageLayout = memo(function N3PageLayout({
  header,
  toolbar,
  filterBar,
  leftSidebar,
  rightSidebar,
  footer,
  children,
  className = '',
}: N3PageLayoutProps) {
  const classes = ['n3-page-layout', className].filter(Boolean).join(' ');

  return (
    <div className={classes} style={{ background: 'var(--bg)' }}>
      {/* A. Page Header */}
      {header && <div className="n3-page-layout__header">{header}</div>}

      {/* B. Toolbar */}
      {toolbar && <div className="n3-page-layout__toolbar">{toolbar}</div>}

      {/* C. Filter Bar */}
      {filterBar && <div className="n3-page-layout__filter-bar">{filterBar}</div>}

      {/* D. Main Content Area */}
      <div className="n3-page-layout__body">
        {/* Left Sidebar */}
        {leftSidebar && (
          <aside className="n3-page-layout__sidebar n3-page-layout__sidebar--left">
            {leftSidebar}
          </aside>
        )}

        {/* Main Content */}
        <main className="n3-page-layout__content">{children}</main>

        {/* Right Sidebar */}
        {rightSidebar && (
          <aside className="n3-page-layout__sidebar n3-page-layout__sidebar--right">
            {rightSidebar}
          </aside>
        )}
      </div>

      {/* E. Footer */}
      {footer && <div className="n3-page-layout__footer">{footer}</div>}
    </div>
  );
});

N3PageLayout.displayName = 'N3PageLayout';
