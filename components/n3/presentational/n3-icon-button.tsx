'use client';

import React, { memo, useCallback, ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

// ============================================================
// N3IconButton - Presentational Component
// ============================================================
// アイコンのみボタン
// - variant: default / primary / secondary / ghost / danger
// - size: xs / sm / md / lg
// - ツールチップ対応
// ============================================================

export interface N3IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** アイコン */
  icon: LucideIcon;
  /** ラベル（アクセシビリティ用） */
  label: string;
  /** バリアント */
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger';
  /** サイズ */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** ローディング状態 */
  loading?: boolean;
  /** クリックハンドラ */
  onClick?: () => void;
  /** 追加クラス名 */
  className?: string;
}

export const N3IconButton = memo(function N3IconButton({
  icon: Icon,
  label,
  variant = 'default',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...rest
}: N3IconButtonProps) {
  const handleClick = useCallback(() => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  }, [disabled, loading, onClick]);

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
  };

  const baseClass = 'n3-icon-button';
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--${size}`,
    loading ? `${baseClass}--loading` : '',
    disabled ? `${baseClass}--disabled` : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={label}
      title={label}
      {...rest}
    >
      {loading ? (
        <span className="n3-icon-button__spinner" />
      ) : (
        <Icon size={iconSizes[size]} />
      )}
    </button>
  );
});

N3IconButton.displayName = 'N3IconButton';

export default N3IconButton;
