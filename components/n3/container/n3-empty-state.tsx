'use client';

import React, { memo, ReactNode } from 'react';

// ============================================
// N3EmptyState - 空状態表示
// ============================================
export interface N3EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const N3EmptyState = memo(function N3EmptyState({
  icon,
  title = 'データがありません',
  description,
  action,
  size = 'md',
  className = '',
}: N3EmptyStateProps) {
  const defaultIcon = (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );

  return (
    <div className={`n3-empty-state ${size} ${className}`}>
      <div className="n3-empty-state-icon">{icon || defaultIcon}</div>
      {title && <h3 className="n3-empty-state-title">{title}</h3>}
      {description && <p className="n3-empty-state-description">{description}</p>}
      {action && <div className="n3-empty-state-action">{action}</div>}
    </div>
  );
});

// ============================================
// プリセット空状態
// ============================================

export const N3EmptySearch = memo(function N3EmptySearch({
  query,
  onClear,
}: {
  query?: string;
  onClear?: () => void;
}) {
  return (
    <N3EmptyState
      icon={
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M8 8l6 6M14 8l-6 6" />
        </svg>
      }
      title="検索結果がありません"
      description={query ? `「${query}」に一致する結果が見つかりませんでした。` : '条件を変更して再度お試しください。'}
      action={
        onClear && (
          <button className="n3-btn n3-btn-secondary" onClick={onClear}>
            検索条件をクリア
          </button>
        )
      }
    />
  );
});

export const N3EmptyError = memo(function N3EmptyError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <N3EmptyState
      icon={
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      }
      title="エラーが発生しました"
      description={message || 'データの読み込みに失敗しました。'}
      action={
        onRetry && (
          <button className="n3-btn n3-btn-primary" onClick={onRetry}>
            再試行
          </button>
        )
      }
    />
  );
});

export default N3EmptyState;
