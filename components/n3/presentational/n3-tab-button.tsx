'use client';

import React, { memo, useCallback } from 'react';
import type { LucideIcon } from 'lucide-react';

// ============================================================
// N3TabButton - Presentational Component
// ============================================================
// タブボタン（アイコン・バッジ対応）
// - variant: default / pill / underline
// - size: sm / md / lg
// - アイコン、バッジ、カウント対応
// ============================================================

export interface N3TabButtonProps {
  /** タブID */
  id: string;
  /** ラベル */
  label: string;
  /** アイコン */
  icon?: LucideIcon;
  /** バッジテキスト */
  badge?: string;
  /** カウント数値 */
  count?: number;
  /** アクティブ状態 */
  active?: boolean;
  /** 無効状態 */
  disabled?: boolean;
  /** バリアント */
  variant?: 'default' | 'pill' | 'underline';
  /** サイズ */
  size?: 'sm' | 'md' | 'lg';
  /** クリックハンドラ */
  onClick?: (id: string) => void;
  /** 追加クラス名 */
  className?: string;
}

export const N3TabButton = memo(function N3TabButton({
  id,
  label,
  icon: Icon,
  badge,
  count,
  active = false,
  disabled = false,
  variant = 'default',
  size = 'md',
  onClick,
  className = '',
}: N3TabButtonProps) {
  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick(id);
    }
  }, [id, disabled, onClick]);

  const baseClass = 'n3-tab-button';
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--${size}`,
    active ? `${baseClass}--active` : '',
    disabled ? `${baseClass}--disabled` : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={handleClick}
      disabled={disabled}
      role="tab"
      aria-selected={active}
      aria-disabled={disabled}
    >
      {Icon && <Icon className="n3-tab-button__icon" />}
      <span className="n3-tab-button__label">{label}</span>
      {badge && <span className="n3-tab-button__badge">{badge}</span>}
      {count !== undefined && <span className="n3-tab-button__count">{count}</span>}
    </button>
  );
});

N3TabButton.displayName = 'N3TabButton';

export default N3TabButton;
