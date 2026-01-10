/**
 * N3ViewToggle - 表示切替コンポーネント
 * 
 * /tools/editing から抽出
 * リスト/カード表示の切り替え
 */

'use client';

import React, { memo } from 'react';
import { List, LayoutGrid, Table, Columns } from 'lucide-react';

export type ViewMode = 'list' | 'card' | 'table' | 'compact';

export interface ViewOption {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
}

export interface N3ViewToggleProps {
  /** 現在のビューモード */
  value: ViewMode;
  /** 変更ハンドラ */
  onChange: (mode: ViewMode) => void;
  /** 表示オプション */
  options?: ViewOption[];
  /** ラベル表示 */
  showLabels?: boolean;
  /** サイズ */
  size?: 'sm' | 'md';
  /** 追加クラス */
  className?: string;
}

const DEFAULT_OPTIONS: ViewOption[] = [
  { id: 'list', label: 'リスト', icon: <List size={14} /> },
  { id: 'card', label: 'カード', icon: <LayoutGrid size={14} /> },
];

export const N3ViewToggle = memo(function N3ViewToggle({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  showLabels = true,
  size = 'sm',
  className = '',
}: N3ViewToggleProps) {
  const padding = size === 'sm' ? '0.25rem 0.5rem' : '0.375rem 0.75rem';
  const fontSize = size === 'sm' ? '11px' : '12px';
  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <div
      className={`n3-view-toggle ${className}`}
      style={{
        display: 'inline-flex',
        borderRadius: '6px',
        border: '1px solid var(--panel-border)',
        overflow: 'hidden',
      }}
    >
      {options.map((option, index) => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding,
              fontSize,
              fontWeight: 500,
              border: 'none',
              borderRight: index < options.length - 1 ? '1px solid var(--panel-border)' : 'none',
              background: isActive ? 'var(--accent-bg)' : 'var(--bg-solid)',
              color: isActive ? 'var(--accent-text)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--highlight)';
                e.currentTarget.style.color = 'var(--text)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--bg-solid)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }
            }}
          >
            {React.cloneElement(option.icon as React.ReactElement, { size: iconSize })}
            {showLabels && <span className="hidden sm:inline">{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
});

// 拡張オプションセット
export const VIEW_OPTIONS = {
  listCard: [
    { id: 'list' as ViewMode, label: 'リスト', icon: <List size={14} /> },
    { id: 'card' as ViewMode, label: 'カード', icon: <LayoutGrid size={14} /> },
  ],
  tableCard: [
    { id: 'table' as ViewMode, label: 'テーブル', icon: <Table size={14} /> },
    { id: 'card' as ViewMode, label: 'カード', icon: <LayoutGrid size={14} /> },
  ],
  all: [
    { id: 'list' as ViewMode, label: 'リスト', icon: <List size={14} /> },
    { id: 'table' as ViewMode, label: 'テーブル', icon: <Table size={14} /> },
    { id: 'card' as ViewMode, label: 'カード', icon: <LayoutGrid size={14} /> },
    { id: 'compact' as ViewMode, label: 'コンパクト', icon: <Columns size={14} /> },
  ],
};
