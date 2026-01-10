'use client';

import React, { memo, useCallback, useId, InputHTMLAttributes } from 'react';
import { Minus, Plus } from 'lucide-react';

// ============================================================
// N3NumberInput - Presentational Component
// ============================================================
// 数値入力（ステッパー付き）
// - min / max / step 対応
// - +/- ボタン対応
// - 単位表示対応
// ============================================================

export interface N3NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'type'> {
  /** 値 */
  value?: number;
  /** 変更ハンドラ */
  onChange?: (value: number) => void;
  /** ラベル */
  label?: string;
  /** 最小値 */
  min?: number;
  /** 最大値 */
  max?: number;
  /** ステップ */
  step?: number;
  /** 単位 */
  unit?: string;
  /** サイズ */
  size?: 'sm' | 'md' | 'lg';
  /** ステッパーボタンを表示 */
  showStepper?: boolean;
  /** エラー状態 */
  error?: boolean;
  /** エラーメッセージ */
  errorMessage?: string;
  /** 無効状態 */
  disabled?: boolean;
  /** 必須 */
  required?: boolean;
  /** 追加クラス名 */
  className?: string;
}

export const N3NumberInput = memo(function N3NumberInput({
  value,
  onChange,
  label,
  min,
  max,
  step = 1,
  unit,
  size = 'md',
  showStepper = false,
  error = false,
  errorMessage,
  disabled = false,
  required = false,
  className = '',
  id: providedId,
  placeholder,
  ...rest
}: N3NumberInputProps) {
  const generatedId = useId();
  const id = providedId || generatedId;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange?.(newValue);
    } else if (e.target.value === '') {
      onChange?.(0);
    }
  }, [onChange]);

  const handleIncrement = useCallback(() => {
    if (disabled) return;
    const currentValue = value ?? 0;
    const newValue = currentValue + step;
    if (max === undefined || newValue <= max) {
      onChange?.(newValue);
    }
  }, [value, step, max, disabled, onChange]);

  const handleDecrement = useCallback(() => {
    if (disabled) return;
    const currentValue = value ?? 0;
    const newValue = currentValue - step;
    if (min === undefined || newValue >= min) {
      onChange?.(newValue);
    }
  }, [value, step, min, disabled, onChange]);

  const baseClass = 'n3-number-input';
  const wrapperClasses = [
    `${baseClass}-wrapper`,
    className,
  ].filter(Boolean).join(' ');

  const inputClasses = [
    baseClass,
    `${baseClass}--${size}`,
    error ? `${baseClass}--error` : '',
    disabled ? `${baseClass}--disabled` : '',
    showStepper ? `${baseClass}--with-stepper` : '',
    unit ? `${baseClass}--with-unit` : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={id} className="n3-number-input__label">
          {label}
          {required && <span className="n3-number-input__required">*</span>}
        </label>
      )}
      <div className="n3-number-input__container">
        {showStepper && (
          <button
            type="button"
            className="n3-number-input__stepper n3-number-input__stepper--minus"
            onClick={handleDecrement}
            disabled={disabled || (min !== undefined && (value ?? 0) <= min)}
            aria-label="減少"
          >
            <Minus size={14} />
          </button>
        )}
        <input
          id={id}
          type="number"
          className={inputClasses}
          value={value ?? ''}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          aria-invalid={error}
          aria-describedby={errorMessage ? `${id}-error` : undefined}
          {...rest}
        />
        {unit && <span className="n3-number-input__unit">{unit}</span>}
        {showStepper && (
          <button
            type="button"
            className="n3-number-input__stepper n3-number-input__stepper--plus"
            onClick={handleIncrement}
            disabled={disabled || (max !== undefined && (value ?? 0) >= max)}
            aria-label="増加"
          >
            <Plus size={14} />
          </button>
        )}
      </div>
      {errorMessage && (
        <span id={`${id}-error`} className="n3-number-input__error-message">
          {errorMessage}
        </span>
      )}
    </div>
  );
});

N3NumberInput.displayName = 'N3NumberInput';

export default N3NumberInput;
