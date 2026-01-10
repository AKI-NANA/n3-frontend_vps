'use client';

import React, { memo, useCallback, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

// ============================================================
// N3SearchInput - Presentational Component
// ============================================================
// ゴールドスタンダード準拠:
// - Hooks呼び出し禁止 (useCallback/useRefは例外: React組み込み)
// - 外部マージン禁止（内部paddingのみ）
// - React.memoでラップ
// - on[EventName]形式のイベントハンドラ
// ============================================================

export type N3SearchInputSize = 'xs' | 'sm' | 'md' | 'lg';

export interface N3SearchInputProps {
  /** 入力値 */
  value: string;
  /** 値変更時のコールバック */
  onValueChange: (value: string) => void;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** サイズ */
  size?: N3SearchInputSize;
  /** 無効状態 */
  disabled?: boolean;
  /** ローディング状態 */
  loading?: boolean;
  /** クリアボタンを表示 */
  clearable?: boolean;
  /** クリア時のコールバック */
  onClear?: () => void;
  /** Enterキー押下時のコールバック */
  onSubmit?: (value: string) => void;
  /** フォーカス時のコールバック */
  onFocus?: () => void;
  /** ブラー時のコールバック */
  onBlur?: () => void;
  /** 自動フォーカス */
  autoFocus?: boolean;
  /** カスタムクラス名 */
  className?: string;
  /** キーボードショートカット表示 (例: "⌘K") */
  shortcut?: string;
  /** aria-label */
  'aria-label'?: string;
}

const sizeClasses: Record<N3SearchInputSize, string> = {
  xs: 'n3-input-xs',
  sm: 'n3-input-sm',
  md: '',
  lg: 'n3-input-lg',
};

const iconSizes: Record<N3SearchInputSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
};

export const N3SearchInput = memo(function N3SearchInput({
  value,
  onValueChange,
  placeholder = '検索...',
  size = 'md',
  disabled = false,
  loading = false,
  clearable = true,
  onClear,
  onSubmit,
  onFocus,
  onBlur,
  autoFocus = false,
  className = '',
  shortcut,
  'aria-label': ariaLabel,
}: N3SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // 自動フォーカス
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSubmit) {
        e.preventDefault();
        onSubmit(value);
      }
      if (e.key === 'Escape' && value) {
        e.preventDefault();
        handleClear();
      }
    },
    [onSubmit, value, handleClear]
  );

  const iconSize = iconSizes[size];
  const showClear = clearable && value && !loading && !disabled;

  return (
    <div className={`n3-search-input-wrapper ${className}`}>
      {/* 検索アイコン */}
      <div className="n3-search-input-icon">
        {loading ? (
          <Loader2 size={iconSize} className="animate-spin" />
        ) : (
          <Search size={iconSize} />
        )}
      </div>

      {/* 入力フィールド */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={ariaLabel || placeholder}
        className={`n3-search-input ${sizeClasses[size]}`}
      />

      {/* 右側のアクション */}
      <div className="n3-search-input-actions">
        {/* ショートカット表示 */}
        {shortcut && !value && !loading && (
          <kbd className="n3-search-input-shortcut">{shortcut}</kbd>
        )}

        {/* クリアボタン */}
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            className="n3-search-input-clear"
            aria-label="クリア"
          >
            <X size={iconSize - 2} />
          </button>
        )}
      </div>
    </div>
  );
});

N3SearchInput.displayName = 'N3SearchInput';

export default N3SearchInput;
