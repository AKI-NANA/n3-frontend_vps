/**
 * N3PageHeader - Layout (View) Component
 *
 * ページヘッダー（タイトル + グローバルアクション）
 *
 * 設計ルール:
 * - ページのタイトル、グローバルアクション（保存、新規作成）の配置
 *
 * @example
 * <N3PageHeader
 *   title="Product Editing"
 *   subtitle="Manage your products"
 *   actions={
 *     <>
 *       <N3Button variant="ghost">Cancel</N3Button>
 *       <N3Button variant="primary">Save</N3Button>
 *     </>
 *   }
 * />
 */

'use client';

import { memo, type ReactNode } from 'react';

// ============================================================
// Types
// ============================================================

export interface N3PageHeaderProps {
  /** ページタイトル */
  title: string;
  /** サブタイトル */
  subtitle?: string;
  /** 左側に表示する要素（戻るボタン等） */
  leftElement?: ReactNode;
  /** 右側のアクションボタン */
  actions?: ReactNode;
  /** ブレッドクラム */
  breadcrumb?: ReactNode;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Component
// ============================================================

export const N3PageHeader = memo(function N3PageHeader({
  title,
  subtitle,
  leftElement,
  actions,
  breadcrumb,
  className = '',
}: N3PageHeaderProps) {
  const classes = ['n3-page-header', className].filter(Boolean).join(' ');

  return (
    <header className={classes}>
      {/* Breadcrumb */}
      {breadcrumb && <div className="n3-page-header__breadcrumb">{breadcrumb}</div>}

      {/* Main Row */}
      <div className="n3-page-header__main">
        {/* Left Side */}
        <div className="n3-page-header__left">
          {leftElement && (
            <div className="n3-page-header__left-element">{leftElement}</div>
          )}
          <div className="n3-page-header__title-group">
            <h1 className="n3-page-header__title">{title}</h1>
            {subtitle && (
              <p className="n3-page-header__subtitle">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right Side - Actions */}
        {actions && (
          <div className="n3-page-header__actions">{actions}</div>
        )}
      </div>
    </header>
  );
});

N3PageHeader.displayName = 'N3PageHeader';
