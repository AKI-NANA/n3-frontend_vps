'use client';

import React, { memo, useCallback } from 'react';
import type { LucideIcon } from 'lucide-react';

// ============================================================
// N3MethodOption - Presentational Component
// ============================================================
// 選択可能なメソッド/オプションカード
// 配送方法選択、支払い方法選択などで使用
// ============================================================

export interface N3MethodOptionProps {
  /** 選択状態 */
  selected: boolean;
  /** 選択時のコールバック */
  onSelect: () => void;
  /** メソッド名 */
  name: string;
  /** 説明 */
  description?: string;
  /** 右上のラベル（価格など） */
  label?: string;
  /** サブラベル（所要時間など） */
  subLabel?: string;
  /** アイコン */
  icon?: LucideIcon;
  /** 無効状態 */
  disabled?: boolean;
  /** カスタムクラス名 */
  className?: string;
}

export const N3MethodOption = memo(function N3MethodOption({
  selected,
  onSelect,
  name,
  description,
  label,
  subLabel,
  icon: Icon,
  disabled = false,
  className = '',
}: N3MethodOptionProps) {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onSelect();
    }
  }, [disabled, onSelect]);

  return (
    <div
      className={`n3-method-option ${selected ? 'n3-method-option--selected' : ''} ${disabled ? 'n3-method-option--disabled' : ''} ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-selected={selected}
    >
      {Icon && (
        <div className="n3-method-option__icon">
          <Icon size={20} />
        </div>
      )}
      <div className="n3-method-option__info">
        <div className="n3-method-option__name">{name}</div>
        {description && <div className="n3-method-option__description">{description}</div>}
      </div>
      {(label || subLabel) && (
        <div className="n3-method-option__details">
          {label && <div className="n3-method-option__label">{label}</div>}
          {subLabel && <div className="n3-method-option__sub-label">{subLabel}</div>}
        </div>
      )}
    </div>
  );
});

N3MethodOption.displayName = 'N3MethodOption';

export default N3MethodOption;
