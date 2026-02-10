/**
 * N3ViewModeToggle - List/Card表示切替
 * 
 * テーブル表示とカード表示を切り替えるトグルボタン
 */

'use client';

import React from 'react';
import { List, LayoutGrid } from 'lucide-react';

export interface N3ViewModeToggleProps {
  /** 現在の表示モード */
  value: 'list' | 'card';
  /** モード変更時 */
  onChange: (mode: 'list' | 'card') => void;
  /** サイズ */
  size?: 'sm' | 'md';
  /** ラベル表示 */
  showLabels?: boolean;
}

export function N3ViewModeToggle({
  value,
  onChange,
  size = 'sm',
  showLabels = true,
}: N3ViewModeToggleProps) {
  const iconSize = size === 'sm' ? 14 : 16;
  const padding = size === 'sm' ? '4px 8px' : '6px 12px';
  const fontSize = size === 'sm' ? 12 : 13;

  return (
    <div 
      className="n3-view-mode-toggle"
      style={{
        display: 'inline-flex',
        borderRadius: 6,
        border: '1px solid var(--panel-border)',
        background: 'var(--panel)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => onChange('list')}
        className={`n3-view-mode-btn ${value === 'list' ? 'active' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding,
          background: value === 'list' ? 'var(--accent)' : 'transparent',
          color: value === 'list' ? 'white' : 'var(--text-muted)',
          border: 'none',
          cursor: 'pointer',
          fontSize,
          fontWeight: 500,
          transition: 'all 0.15s ease',
        }}
      >
        <List size={iconSize} />
        {showLabels && <span>List</span>}
      </button>
      <button
        onClick={() => onChange('card')}
        className={`n3-view-mode-btn ${value === 'card' ? 'active' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding,
          background: value === 'card' ? 'var(--accent)' : 'transparent',
          color: value === 'card' ? 'white' : 'var(--text-muted)',
          border: 'none',
          borderLeft: '1px solid var(--panel-border)',
          cursor: 'pointer',
          fontSize,
          fontWeight: 500,
          transition: 'all 0.15s ease',
        }}
      >
        <LayoutGrid size={iconSize} />
        {showLabels && <span>Card</span>}
      </button>
    </div>
  );
}

export default N3ViewModeToggle;
