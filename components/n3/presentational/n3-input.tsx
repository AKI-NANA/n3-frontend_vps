/**
 * N3Input - Presentational Component
 *
 * 設計ルール:
 * - size propなし → data-sizeに従う（グローバル設定）
 * - size propあり → 個別に上書き
 *
 * @example
 * <N3Input placeholder="Enter text..." />
 * <N3Input size="lg" placeholder="Large input" />
 */

'use client';

import { memo, forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

// ============================================================
// Types
// ============================================================

export type N3InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface N3InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  /** サイズ（指定なしでグローバル設定に従う） */
  size?: N3InputSize;
  /** エラー状態 */
  error?: boolean;
  /** エラーメッセージ */
  errorMessage?: string;
  /** ヘルプテキスト */
  helpText?: string;
  /** 左アイコン */
  leftIcon?: ReactNode;
  /** 右アイコン */
  rightIcon?: ReactNode;
  /** 値変更ハンドラ */
  onValueChange?: (value: string) => void;
  /** 標準onChange */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// ============================================================
// Component
// ============================================================

export const N3Input = memo(forwardRef<HTMLInputElement, N3InputProps>(
  function N3Input(
    {
      size,
      error = false,
      errorMessage,
      helpText,
      leftIcon,
      rightIcon,
      onValueChange,
      onChange,
      className = '',
      ...props
    },
    ref
  ) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onValueChange) onValueChange(e.target.value);
      if (onChange) onChange(e);
    };

    // アイコンがある場合はラッパーで包む
    if (leftIcon || rightIcon) {
      const wrapperClasses = [
        'n3-input-wrapper',
        rightIcon && !leftIcon && 'icon-right',
        size && `n3-size-${size}`,
      ].filter(Boolean).join(' ');

      const inputClasses = [
        'n3-input',
        error && 'n3-input-error',
        className,
      ].filter(Boolean).join(' ');

      return (
        <div className={wrapperClasses}>
          {leftIcon && <span className="n3-input-icon">{leftIcon}</span>}
          <input
            ref={ref}
            className={inputClasses}
            onChange={handleChange}
            {...props}
          />
          {rightIcon && <span className="n3-input-icon">{rightIcon}</span>}
          {errorMessage && <span className="n3-form-error">{errorMessage}</span>}
          {helpText && !errorMessage && <span className="n3-form-hint">{helpText}</span>}
        </div>
      );
    }

    // シンプルなinput
    const inputClasses = [
      'n3-input',
      size && `n3-size-${size}`,
      error && 'n3-input-error',
      className,
    ].filter(Boolean).join(' ');

    return (
      <>
        <input
          ref={ref}
          className={inputClasses}
          onChange={handleChange}
          {...props}
        />
        {errorMessage && <span className="n3-form-error">{errorMessage}</span>}
        {helpText && !errorMessage && <span className="n3-form-hint">{helpText}</span>}
      </>
    );
  }
));

N3Input.displayName = 'N3Input';
