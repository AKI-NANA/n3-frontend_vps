// components/n3/n3-filter-dropdown.tsx
/**
 * N3 フィルター用ドロップダウン
 * 
 * マスター用フィルターバーで使用する共通コンポーネント
 * - 件数表示対応
 * - 検索機能（オプション）
 * - 「未設定」オプション対応
 * - Portal使用で親要素のoverflow影響を受けない
 */

'use client';

import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X, Search } from 'lucide-react';

export interface FilterOption {
  value: string;
  label?: string;
  count?: number;
  icon?: string;
}

export interface N3FilterDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  showSearch?: boolean;
  showUnset?: boolean;
  unsetCount?: number;
  disabled?: boolean;
  width?: number | string;
}

export const N3FilterDropdown = memo(function N3FilterDropdown({
  label,
  value,
  onChange,
  options,
  placeholder = '全て',
  showSearch = false,
  showUnset = true,
  unsetCount = 0,
  disabled = false,
  width = 'auto',
}: N3FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // デバッグログ
  useEffect(() => {
    console.log(`[N3FilterDropdown:${label}] options:`, options?.length, options);
  }, [label, options]);

  // ドロップダウンの位置を計算
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
  }, [isOpen]);

  // 外側クリックで閉じる
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideContainer = containerRef.current?.contains(target);
      const isInsideDropdown = dropdownRef.current?.contains(target);
      
      if (!isInsideContainer && !isInsideDropdown) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // 開いた時に検索フィールドにフォーカス
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 10);
    }
  }, [isOpen, showSearch]);

  // 選択肢をフィルタリング
  const filteredOptions = searchQuery
    ? options.filter(opt => 
        (opt.label || opt.value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // 現在選択中のラベル
  const selectedLabel = value === 'all' || value === ''
    ? placeholder
    : options.find(opt => opt.value === value)?.label || value;

  const handleSelect = useCallback((optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
    setSearchQuery('');
  }, [onChange]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('all');
  }, [onChange]);

  const isSelected = value !== 'all' && value !== '';

  // ドロップダウンメニューの内容
  const dropdownContent = (
    <div
      ref={dropdownRef}
      className="n3-filter-dropdown-menu"
      style={{
        position: 'fixed',
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        minWidth: 160,
        maxHeight: 280,
        overflowY: 'auto',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: 6,
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        zIndex: 99999,
      }}
    >
      {/* 検索フィールド */}
      {showSearch && (
        <div style={{ padding: '8px 8px 4px 8px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6,
            padding: '4px 8px',
            background: '#f3f4f6',
            borderRadius: 4,
          }}>
            <Search size={12} style={{ color: '#6b7280', flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="検索..."
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '11px',
                color: '#111827',
              }}
            />
          </div>
        </div>
      )}

      {/* 全て（リセット） */}
      <div
        onClick={() => handleSelect('all')}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          fontSize: '11px',
          color: value === 'all' || value === '' ? '#3b82f6' : '#374151',
          background: value === 'all' || value === '' ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
          cursor: 'pointer',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <span style={{ fontWeight: 500 }}>全て</span>
      </div>

      {/* 未設定オプション */}
      {showUnset && unsetCount > 0 && (
        <div
          onClick={() => handleSelect('__unset__')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 12px',
            fontSize: '11px',
            color: '#ef4444',
            background: value === '__unset__' ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
            cursor: 'pointer',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <span>❓ 未設定</span>
          <span style={{ 
            fontSize: '10px',
            padding: '1px 6px',
            background: 'rgba(239, 68, 68, 0.15)',
            borderRadius: 3,
          }}>
            {unsetCount}
          </span>
        </div>
      )}

      {/* オプション一覧 */}
      {filteredOptions.length === 0 ? (
        <div style={{ padding: '12px', fontSize: '11px', color: '#6b7280', textAlign: 'center' }}>
          該当なし
        </div>
      ) : (
        filteredOptions.map((opt) => (
          <div
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 12px',
              fontSize: '11px',
              color: value === opt.value ? '#3b82f6' : '#374151',
              background: value === opt.value ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
              cursor: 'pointer',
              transition: 'background 0.1s ease',
            }}
            onMouseEnter={(e) => {
              if (value !== opt.value) {
                e.currentTarget.style.background = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (value !== opt.value) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              fontWeight: value === opt.value ? 600 : 400,
            }}>
              {opt.icon && <span>{opt.icon}</span>}
              {opt.label || opt.value}
            </span>
            {opt.count !== undefined && (
              <span style={{ 
                fontSize: '10px',
                padding: '1px 6px',
                background: value === opt.value ? 'rgba(59, 130, 246, 0.15)' : '#f3f4f6',
                borderRadius: 3,
                color: value === opt.value ? '#3b82f6' : '#6b7280',
              }}>
                {opt.count}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative',
        width,
        minWidth: 80,
      }}
    >
      {/* トリガーボタン */}
      <button
        ref={buttonRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          height: 24,
          padding: '0 8px',
          fontSize: '11px',
          fontWeight: 500,
          background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'white',
          color: isSelected ? '#3b82f6' : '#6b7280',
          border: isSelected ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid #d1d5db',
          borderRadius: 4,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: '10px', color: '#9ca3af' }}>{label}:</span>
        <span style={{ 
          maxWidth: 80, 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          fontWeight: isSelected ? 600 : 500,
        }}>
          {selectedLabel}
        </span>
        {isSelected ? (
          <X 
            size={12} 
            onClick={handleClear}
            style={{ 
              cursor: 'pointer',
              opacity: 0.7,
              flexShrink: 0,
            }}
          />
        ) : (
          <ChevronDown 
            size={12} 
            style={{ 
              opacity: 0.5,
              flexShrink: 0,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s ease',
            }}
          />
        )}
      </button>

      {/* ドロップダウンメニュー - Portalでbody直下に描画 */}
      {isOpen && typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
});

export default N3FilterDropdown;
