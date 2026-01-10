/**
 * N3Checkbox - Presentational Component
 *
 * チェックボックスコンポーネント（indeterminate状態サポート）
 *
 * 設計ルール:
 * - Hooks呼び出し禁止
 * - 外部マージン禁止
 * - React.memoでラップ
 * - checked/onCheckedChangeでReact Hook Formと連携可能
 *
 * @example
 * <N3Checkbox
 *   checked={isChecked}
 *   onCheckedChange={(checked) => setIsChecked(checked)}
 *   label="Accept terms"
 * />
 */

'use client';

import { memo, forwardRef, useEffect, useRef, type InputHTMLAttributes } from 'react';
import { Check, Minus } from 'lucide-react';

// ============================================================
// Types
// ============================================================

export type N3CheckboxSize = 'sm' | 'md' | 'lg';

export interface N3CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  /** サイズ */
  size?: N3CheckboxSize;
  /** ラベル */
  label?: string;
  /** indeterminate状態（リスト選択用） */
  indeterminate?: boolean;
  /** エラー状態 */
  error?: boolean;
  /** チェック状態変更ハンドラ（抽象化された形式） */
  onCheckedChange?: (checked: boolean) => void;
  /** 標準onChange */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// ============================================================
// Component
// ============================================================

export const N3Checkbox = memo(forwardRef<HTMLInputElement, N3CheckboxProps>(
  function N3Checkbox(
    {
      size = 'md',
      label,
      indeterminate = false,
      error = false,
      checked,
      onCheckedChange,
      onChange,
      className = '',
      disabled,
      ...props
    },
    forwardedRef
  ) {
    const internalRef = useRef<HTMLInputElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLInputElement>) || internalRef;

    // indeterminate状態の設定
    useEffect(() => {
      if (ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
      if (onChange) {
        onChange(e);
      }
    };

    const wrapperClasses = [
      'n3-checkbox-wrapper',
      size && `n3-checkbox-wrapper-${size}`,
      disabled && 'n3-checkbox-wrapper-disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const checkboxClasses = [
      'n3-checkbox',
      size && `n3-checkbox-${size}`,
      error && 'n3-checkbox-error',
      checked && 'n3-checkbox-checked',
      indeterminate && 'n3-checkbox-indeterminate',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label className={wrapperClasses}>
        <div className={checkboxClasses}>
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            className="n3-checkbox-input"
            {...props}
          />
          <div className="n3-checkbox-indicator">
            {indeterminate ? (
              <Minus size={size === 'sm' ? 10 : size === 'lg' ? 14 : 12} />
            ) : checked ? (
              <Check size={size === 'sm' ? 10 : size === 'lg' ? 14 : 12} />
            ) : null}
          </div>
        </div>
        {label && <span className="n3-checkbox-label">{label}</span>}
      </label>
    );
  }
));

N3Checkbox.displayName = 'N3Checkbox';
