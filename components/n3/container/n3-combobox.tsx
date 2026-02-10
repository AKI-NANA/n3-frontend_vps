// components/n3/container/n3-combobox.tsx
/**
 * N3Combobox - 検索付きセレクトコンポーネント (Container)
 * オートコンプリート、複数選択、グループ化対応
 */

'use client';

import React, { memo, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, X, Check, Search, Loader2 } from 'lucide-react';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  group?: string;
  disabled?: boolean;
  data?: any;
}

export interface N3ComboboxProps {
  options: ComboboxOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  maxHeight?: number;
  groupBy?: boolean;
  emptyMessage?: string;
  onSearch?: (query: string) => void;
  renderOption?: (option: ComboboxOption) => React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const N3Combobox = memo(function N3Combobox({
  options,
  value,
  onChange,
  placeholder = '選択してください',
  searchPlaceholder = '検索...',
  multiple = false,
  searchable = true,
  clearable = false,
  loading = false,
  disabled = false,
  error,
  maxHeight = 300,
  groupBy = false,
  emptyMessage = '選択肢がありません',
  onSearch,
  renderOption,
  size = 'md',
  className = '',
  style,
}: N3ComboboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // 選択値の正規化
  const selectedValues = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  // 選択されたオプション
  const selectedOptions = useMemo(
    () => options.filter(opt => selectedValues.includes(opt.value)),
    [options, selectedValues]
  );

  // フィルター済みオプション
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      opt =>
        opt.label.toLowerCase().includes(query) ||
        opt.description?.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  // グループ化オプション
  const groupedOptions = useMemo(() => {
    if (!groupBy) return { '': filteredOptions };

    const groups: Record<string, ComboboxOption[]> = {};
    filteredOptions.forEach(opt => {
      const group = opt.group || '';
      if (!groups[group]) groups[group] = [];
      groups[group].push(opt);
    });
    return groups;
  }, [filteredOptions, groupBy]);

  // サイズ設定
  const sizeStyles = {
    sm: { height: '32px', fontSize: '12px', padding: '0 10px' },
    md: { height: '38px', fontSize: '13px', padding: '0 12px' },
    lg: { height: '44px', fontSize: '14px', padding: '0 14px' },
  };

  // 外部クリック検知
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // キーボード操作
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex(prev =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            const option = filteredOptions[highlightedIndex];
            if (option && !option.disabled) {
              handleSelect(option);
            }
          } else {
            setIsOpen(true);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchQuery('');
          break;
      }
    },
    [disabled, isOpen, highlightedIndex, filteredOptions]
  );

  // 選択処理
  const handleSelect = useCallback(
    (option: ComboboxOption) => {
      if (option.disabled) return;

      if (multiple) {
        const newValues = selectedValues.includes(option.value)
          ? selectedValues.filter(v => v !== option.value)
          : [...selectedValues, option.value];
        onChange?.(newValues);
      } else {
        onChange?.(option.value);
        setIsOpen(false);
        setSearchQuery('');
      }
    },
    [multiple, selectedValues, onChange]
  );

  // クリア処理
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(multiple ? [] : '');
    },
    [multiple, onChange]
  );

  // タグ削除
  const handleRemoveTag = useCallback(
    (e: React.MouseEvent, val: string) => {
      e.stopPropagation();
      const newValues = selectedValues.filter(v => v !== val);
      onChange?.(newValues);
    },
    [selectedValues, onChange]
  );

  // 検索
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      setHighlightedIndex(-1);
      onSearch?.(query);
    },
    [onSearch]
  );

  // トグル
  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev);
      if (!isOpen) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  }, [disabled, isOpen]);

  // 表示値
  const displayValue = useMemo(() => {
    if (selectedOptions.length === 0) return null;
    if (!multiple) return selectedOptions[0]?.label;
    return `${selectedOptions.length}件選択中`;
  }, [selectedOptions, multiple]);

  return (
    <div
      ref={containerRef}
      className={`n3-combobox ${className}`}
      style={{ position: 'relative', ...style }}
      onKeyDown={handleKeyDown}
    >
      {/* トリガー */}
      <div
        onClick={handleToggle}
        style={{
          ...sizeStyles[size],
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: `1px solid ${error ? 'var(--color-error)' : isOpen ? 'var(--color-primary)' : 'var(--panel-border)'}`,
          borderRadius: 'var(--style-radius-md, 8px)',
          background: disabled ? 'var(--highlight)' : 'var(--panel)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'border-color 0.15s ease',
        }}
      >
        {/* 選択値またはタグ */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
          {multiple && selectedOptions.length > 0 ? (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap', overflow: 'hidden' }}>
              {selectedOptions.slice(0, 2).map(opt => (
                <span
                  key={opt.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 6px',
                    background: 'var(--highlight)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: 'var(--text)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {opt.label}
                  <X
                    size={12}
                    style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
                    onClick={e => handleRemoveTag(e, opt.value)}
                  />
                </span>
              ))}
              {selectedOptions.length > 2 && (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  +{selectedOptions.length - 2}
                </span>
              )}
            </div>
          ) : (
            <span
              style={{
                color: displayValue ? 'var(--text)' : 'var(--text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayValue || placeholder}
            </span>
          )}
        </div>

        {/* アイコン */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {loading && <Loader2 size={14} className="animate-spin" style={{ color: 'var(--text-muted)' }} />}
          {clearable && selectedValues.length > 0 && !disabled && (
            <X
              size={14}
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={handleClear}
            />
          )}
          <ChevronDown
            size={16}
            style={{
              color: 'var(--text-muted)',
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s ease',
            }}
          />
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div style={{ marginTop: '4px', fontSize: '11px', color: 'var(--color-error)' }}>
          {error}
        </div>
      )}

      {/* ドロップダウン */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            background: 'var(--panel)',
            border: '1px solid var(--panel-border)',
            borderRadius: 'var(--style-radius-md, 8px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {/* 検索フィールド */}
          {searchable && (
            <div
              style={{
                padding: '8px',
                borderBottom: '1px solid var(--panel-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  background: 'var(--highlight)',
                  borderRadius: 'var(--style-radius-md, 8px)',
                }}
              >
                <Search size={14} style={{ color: 'var(--text-muted)' }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    fontSize: '13px',
                    color: 'var(--text)',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* オプションリスト */}
          <div
            style={{
              maxHeight,
              overflowY: 'auto',
              padding: '4px',
            }}
          >
            {Object.entries(groupedOptions).map(([group, groupOptions]) => (
              <div key={group}>
                {/* グループヘッダー */}
                {group && (
                  <div
                    style={{
                      padding: '6px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {group}
                  </div>
                )}

                {/* オプション */}
                {groupOptions.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value);
                  const flatIndex = filteredOptions.indexOf(option);
                  const isHighlighted = flatIndex === highlightedIndex;

                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => setHighlightedIndex(flatIndex)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 10px',
                        borderRadius: 'var(--style-radius-sm, 6px)',
                        cursor: option.disabled ? 'not-allowed' : 'pointer',
                        background: isHighlighted ? 'var(--highlight)' : 'transparent',
                        opacity: option.disabled ? 0.5 : 1,
                        transition: 'background 0.1s ease',
                      }}
                    >
                      {/* アイコン */}
                      {option.icon && (
                        <div style={{ color: 'var(--text-muted)' }}>{option.icon}</div>
                      )}

                      {/* ラベル */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {renderOption ? (
                          renderOption(option)
                        ) : (
                          <>
                            <div
                              style={{
                                fontSize: '13px',
                                color: 'var(--text)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {option.label}
                            </div>
                            {option.description && (
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: 'var(--text-muted)',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {option.description}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* 選択マーク */}
                      {isSelected && (
                        <Check size={14} style={{ color: 'var(--color-primary)' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* 空状態 */}
            {filteredOptions.length === 0 && (
              <div
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                }}
              >
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default N3Combobox;
