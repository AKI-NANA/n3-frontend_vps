/**
 * N3Select - Presentational Component
 *
 * 設計ルール:
 * - size propなし → data-sizeに従う（グローバル設定）
 * - size propあり → 個別に上書き
 *
 * @example
 * <N3Select options={options} placeholder="Select..." />
 */

'use client';

import { memo, forwardRef, type SelectHTMLAttributes } from 'react';

// ============================================================
// Types
// ============================================================

export type N3SelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface N3SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface N3SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange'> {
  /** オプション一覧（オプション） */
  options?: N3SelectOption[];
  /** サイズ（指定なしでグローバル設定に従う） */
  size?: N3SelectSize;
  /** ラベル */
  label?: string;
  /** エラー状態 */
  error?: boolean;
  /** エラーメッセージ */
  errorMessage?: string;
  /** プレースホルダー */
  placeholder?: string;
  /** 値変更ハンドラ */
  onValueChange?: (value: string) => void;
  /** 標準onChange */
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** 子要素（optionタグを直接渡す場合） */
  children?: React.ReactNode;
}

// ============================================================
// Component
// ============================================================

export const N3Select = memo(forwardRef<HTMLSelectElement, N3SelectProps>(
  function N3Select(
    {
      options,
      size,
      label,
      error = false,
      errorMessage,
      placeholder,
      onValueChange,
      onChange,
      children,
      className = '',
      ...props
    },
    ref
  ) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onValueChange) onValueChange(e.target.value);
      if (onChange) onChange(e);
    };

    const selectClasses = [
      'n3-select',
      size && `n3-size-${size}`,
      error && 'n3-select-error',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className="n3-form-group">
        {label && <label className="n3-form-label">{label}</label>}
        <select
          ref={ref}
          className={selectClasses}
          onChange={handleChange}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {/* childrenがある場合はそれを使用、なければoptionsを使用 */}
          {children || (options && options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          )))}
        </select>
        {errorMessage && <span className="n3-form-error">{errorMessage}</span>}
      </div>
    );
  }
));

N3Select.displayName = 'N3Select';
