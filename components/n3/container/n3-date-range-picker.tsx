'use client';

import React, { memo, useCallback } from 'react';
import { N3DateInput, N3DateInputSize } from '../presentational/n3-date-input';

// ============================================================
// N3DateRangePicker - Container Component
// ============================================================
// ゴールドスタンダード準拠:
// - ContainerはHooksを呼び出せる
// - 子要素間のgap/marginを定義
// - Presentational (N3DateInput) を内部で使用
// ============================================================

export interface N3DateRangePickerProps {
  /** 開始日 (YYYY-MM-DD形式) */
  from: string;
  /** 終了日 (YYYY-MM-DD形式) */
  to: string;
  /** 開始日変更時のコールバック */
  onFromChange: (value: string) => void;
  /** 終了日変更時のコールバック */
  onToChange: (value: string) => void;
  /** 開始日のプレースホルダー */
  fromPlaceholder?: string;
  /** 終了日のプレースホルダー */
  toPlaceholder?: string;
  /** 開始日のラベル */
  fromLabel?: string;
  /** 終了日のラベル */
  toLabel?: string;
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
  /** 最小日付 (YYYY-MM-DD形式) */
  min?: string;
  /** 最大日付 (YYYY-MM-DD形式) */
  max?: string;
  /** 縦並びレイアウト */
  vertical?: boolean;
  /** カスタムクラス名 */
  className?: string;
  /** 区切り文字 */
  separator?: string;
}

export const N3DateRangePicker = memo(function N3DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
  fromPlaceholder,
  toPlaceholder,
  fromLabel = '開始日',
  toLabel = '終了日',
  size = 'md',
  disabled = false,
  error = false,
  errorMessage,
  clearable = false,
  min,
  max,
  vertical = false,
  className = '',
  separator = '〜',
}: N3DateRangePickerProps) {
  // 開始日のmax制限: 終了日より後は選択不可
  const fromMaxDate = to || max;

  // 終了日のmin制限: 開始日より前は選択不可
  const toMinDate = from || min;

  const handleFromClear = useCallback(() => {
    onFromChange('');
  }, [onFromChange]);

  const handleToClear = useCallback(() => {
    onToChange('');
  }, [onToChange]);

  return (
    <div className={`n3-date-range-picker ${vertical ? 'n3-date-range-picker--vertical' : ''} ${className}`}>
      <div className="n3-date-range-picker__field">
        <N3DateInput
          value={from}
          onValueChange={onFromChange}
          placeholder={fromPlaceholder}
          label={fromLabel}
          size={size}
          disabled={disabled}
          error={error}
          clearable={clearable}
          onClear={handleFromClear}
          min={min}
          max={fromMaxDate}
        />
      </div>

      {!vertical && (
        <span className="n3-date-range-picker__separator">{separator}</span>
      )}

      <div className="n3-date-range-picker__field">
        <N3DateInput
          value={to}
          onValueChange={onToChange}
          placeholder={toPlaceholder}
          label={toLabel}
          size={size}
          disabled={disabled}
          error={error}
          clearable={clearable}
          onClear={handleToClear}
          min={toMinDate}
          max={max}
        />
      </div>

      {/* エラーメッセージ */}
      {error && errorMessage && (
        <span className="n3-date-range-picker__error">{errorMessage}</span>
      )}
    </div>
  );
});

N3DateRangePicker.displayName = 'N3DateRangePicker';

export default N3DateRangePicker;
