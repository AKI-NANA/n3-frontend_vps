'use client';

import React, { memo, useState } from 'react';
import { Search } from 'lucide-react';

// ============================================
// N3HeaderSearchInput - Presentational Component
// ヘッダー用検索入力
// 
// CSSクラスベース - スタイルテーマに対応
// ============================================

export type HeaderSearchSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface N3HeaderSearchProps {
  value?: string;
  placeholder?: string;
  shortcut?: string;
  width?: number | string;
  size?: HeaderSearchSize;
  onValueChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}

export const N3HeaderSearchInput = memo(function N3HeaderSearchInput({
  value = '',
  placeholder = '検索...',
  shortcut = '⌘K',
  width = 200,
  size,
  onValueChange,
  onSearch,
  onFocus,
  onBlur,
  className = '',
}: N3HeaderSearchProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [focused, setFocused] = useState(false);
  const currentValue = onValueChange ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(currentValue);
    }
  };

  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const sizeClass = size ? `n3-size-${size}` : '';

  return (
    <div 
      className={`n3-header-search-input ${focused ? 'focused' : ''} ${sizeClass} ${className}`}
      style={{ width: widthStyle }}
    >
      <Search />
      <input
        type="text"
        value={currentValue}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        className="n3-header-search-input__field"
      />
      {shortcut && !focused && (
        <kbd className="n3-header-search-input__shortcut">{shortcut}</kbd>
      )}
    </div>
  );
});

export default N3HeaderSearchInput;
