'use client';

import React, { memo, ReactNode } from 'react';

// ============================================
// N3HeaderTab - Presentational Component
// ホバー切り替え式のタブボタン
// 
// CSSクラスベース - スタイルテーマに対応
// ============================================

export type HeaderTabSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface N3HeaderTabProps {
  id: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  pinned?: boolean;
  size?: HeaderTabSize;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  className?: string;
}

export const N3HeaderTab = memo(function N3HeaderTab({
  id,
  label,
  icon,
  active = false,
  pinned = false,  // ★ 追加
  size,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className = '',
}: N3HeaderTabProps) {
  const sizeClass = size ? `n3-size-${size}` : '';
  // ★ pinnedクラスを追加
  const pinnedClass = pinned ? 'pinned' : '';

  return (
    <button
      data-tab-id={id}
      className={`n3-header-tab ${active ? 'active' : ''} ${pinnedClass} ${sizeClass} ${className}`.trim()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
});

// ============================================
// N3L2Tab - Presentational Component
// ページ専用タブ（下線スタイル）
// ============================================

export interface N3L2TabProps {
  id: string;
  label: string;
  labelEn?: string;
  icon?: ReactNode;
  badge?: number | string;
  active?: boolean;
  showEnglish?: boolean;
  size?: HeaderTabSize;
  onClick?: () => void;
  className?: string;
}

export const N3L2Tab = memo(function N3L2Tab({
  id,
  label,
  labelEn,
  icon,
  badge,
  active = false,
  showEnglish = false,
  size,
  onClick,
  className = '',
}: N3L2TabProps) {
  const sizeClass = size ? `n3-size-${size}` : '';

  return (
    <button
      data-tab-id={id}
      className={`n3-l2-tab ${active ? 'active' : ''} ${sizeClass} ${className}`}
      onClick={onClick}
    >
      {icon}
      <span>{showEnglish && labelEn ? labelEn : label}</span>
      {badge !== undefined && (
        <span className="n3-l2-tab__badge">{badge}</span>
      )}
    </button>
  );
});

export default N3HeaderTab;
