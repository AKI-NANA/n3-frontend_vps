'use client';

import React, { memo, useCallback, useRef } from 'react';
import { Calendar, X } from 'lucide-react';

// ============================================================
// N3DateInput - Presentational Component
// ============================================================
// ゴールドスタンダード準拠:
// - Hooks呼び出し禁止 (useCallback/useRefは例外: React組み込み)
// - 外部マージン禁止（内部paddingのみ）
// - React.memoでラップ
// - on[EventName]形式のイベントハンドラ
// ============================================================

export type N3DateInputSize = 'xs' | 'sm' | 'md' | 'lg';

export interface N3DateInputProps {
  /** 入力値 (YYYY-MM-DD形式) */
  value: string;
  /** 値変更時のコールバック */
  onValueChange: (value: string) => void;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** サイズ */
  size?: N3DateInputSize;
  /** 無効状態 */
  disabled?: boolean;
  /** エラー状態 */
  error?: boolean;
  /** エラーメッセージ */
  errorMessage?: string;
  /** クリアボタンを表示 */
  clearable?: boolean;
  /** クリア時のコールバック */
  onClear?: () => void;
  /** 最小日付 (YYYY-MM-DD形式) */
  min?: string;
  /** 最大日付 (YYYY-MM-DD形式) */
  max?: string;
  /** ラベル */
  label?: string;
  /** 必須マーク */
  required?: boolean;
  /** カスタムクラス名 */
  className?: string;
  /** aria-label */
  'aria-label'?: string;
}

const sizeClasses: Record<N3DateInputSize, string> = {
  xs: 'n3-date-input-xs',
  sm: 'n3-date-input-sm',
  md: '',
  lg: 'n3-date-input-lg',
};

const iconSizes: Record<N3DateInputSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
};

export const N3DateInput = memo(function N3DateInput({
  value,
  onValueChange,
  placeholder,
  size = 'md',
  disabled = false,
  error = false,
  errorMessage,
  clearable = false,
  onClear,
  min,
  max,
  label,
  required = false,
  className = '',
  'aria-label': ariaLabel,
}: N3DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange(e.target.value);
    },
    [onValueChange]
  );

  const handleClear = useCallback(() => {
    onValueChange('');
    onClear?.();
    inputRef.current?.focus();
  }, [onValueChange, onClear]);

  const iconSize = iconSizes[size];
  const showClear = clearable && value && !disabled;

  return (
    <div className={`n3-date-input-container ${className}`}>
      {label && (
        <label className="n3-date-input-label">
          {label}
          {required && <span className="n3-date-input-required">*</span>}
        </label>
      )}
      <div className={`n3-date-input-wrapper ${error ? 'n3-date-input-error' : ''}`}>
        {/* カレンダーアイコン */}
        <div className="n3-date-input-icon">
          <Calendar size={iconSize} />
        </div>

        {/* 入力フィールド */}
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          required={required}
          aria-label={ariaLabel || label || placeholder}
          aria-invalid={error}
          className={`n3-date-input ${sizeClasses[size]}`}
        />

        {/* クリアボタン */}
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            className="n3-date-input-clear"
            aria-label="クリア"
          >
            <X size={iconSize - 2} />
          </button>
        )}
      </div>

      {/* エラーメッセージ */}
      {error && errorMessage && (
        <span className="n3-date-input-error-message">{errorMessage}</span>
      )}
    </div>
  );
});

N3DateInput.displayName = 'N3DateInput';

export default N3DateInput;
