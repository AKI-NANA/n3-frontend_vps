/**
 * N3StatusBar - ステータスバーコンポーネント
 * 
 * /tools/editing から抽出
 * Total, Unsaved, Ready, Incomplete, Selected などの状態表示
 */

'use client';

import React, { memo, ReactNode } from 'react';

export interface StatusItem {
  id: string;
  label: string;
  value: number;
  color?: string;
  tip?: string;
}

export interface N3StatusBarProps {
  /** 総数 */
  total: number;
  /** ステータス項目 */
  items?: StatusItem[];
  /** 選択数 */
  selected?: number;
  /** 右側のカスタムコンテンツ */
  rightContent?: ReactNode;
  /** 追加クラス */
  className?: string;
}

export const N3StatusBar = memo(function N3StatusBar({
  total,
  items = [],
  selected = 0,
  rightContent,
  className = '',
}: N3StatusBarProps) {
  return (
    <div
      className={`n3-status-bar ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.5rem 0.75rem',
        fontSize: '11px',
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
        borderRadius: 'var(--radius-md, 6px)',
      }}
    >
      {/* Total */}
      <span style={{ color: 'var(--text-muted)' }}>
        Total{' '}
        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{total}</span>
      </span>

      {/* ステータス項目 */}
      {items.map((item) => (
        <N3StatusItem
          key={item.id}
          label={item.label}
          value={item.value}
          color={item.color}
          tip={item.tip}
        />
      ))}

      {/* 右側 */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {rightContent}

        {/* Selected */}
        {selected !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Selected</span>
            <span
              style={{
                fontFamily: 'monospace',
                fontWeight: 600,
                padding: '0.125rem 0.5rem',
                borderRadius: '4px',
                background: selected > 0 ? 'rgba(99, 102, 241, 0.12)' : 'var(--highlight)',
                color: selected > 0 ? 'var(--accent)' : 'var(--text)',
              }}
            >
              {selected}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

/**
 * N3StatusItem - ステータス項目
 */
interface N3StatusItemProps {
  label: string;
  value: number;
  color?: string;
  tip?: string;
}

const N3StatusItem = memo(function N3StatusItem({
  label,
  value,
  color = 'var(--text)',
  tip,
}: N3StatusItemProps) {
  if (value === 0) return null;

  return (
    <span
      className="n3-status-item"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        color,
        position: 'relative',
        cursor: tip ? 'help' : 'default',
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: color,
        }}
      />
      <span>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>

      {/* ツールチップ */}
      {tip && (
        <span
          className="n3-status-tip"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            marginBottom: '4px',
            padding: '0.25rem 0.5rem',
            fontSize: '10px',
            background: 'var(--text)',
            color: 'var(--bg-solid)',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            opacity: 0,
            visibility: 'hidden',
            transition: 'opacity 0.15s ease, visibility 0.15s ease',
            zIndex: 50,
          }}
        >
          {tip}
        </span>
      )}

      <style jsx>{`
        .n3-status-item:hover .n3-status-tip {
          opacity: 1;
          visibility: visible;
        }
      `}</style>
    </span>
  );
});

// 便利なプリセット
export const STATUS_PRESETS = {
  unsaved: { id: 'unsaved', label: 'Unsaved', color: 'var(--warning)', tip: '未保存の変更があります' },
  ready: { id: 'ready', label: 'Ready', color: 'var(--success)', tip: '出品準備完了' },
  incomplete: { id: 'incomplete', label: 'Incomplete', color: 'var(--error)', tip: '必須項目が未入力' },
  filtered: { id: 'filtered', label: 'Filter通過', color: '#9333ea', tip: '出品フィルター通過済み' },
};
