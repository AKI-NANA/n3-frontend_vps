/**
 * N3InfoCard - 情報カードコンポーネント
 * 
 * /tools/editing の ProductModal で使用
 * ラベル + 値のペアを縦に並べる小さなカード
 */

'use client';

import React, { memo } from 'react';

export interface InfoItem {
  label: string;
  value: string | number;
  mono?: boolean;
}

export interface N3InfoCardProps {
  /** タイトル */
  title?: string;
  /** 情報アイテムリスト */
  items: InfoItem[];
}

export const N3InfoCard = memo(function N3InfoCard({
  title = 'Info',
  items,
}: N3InfoCardProps) {
  return (
    <div
      style={{
        padding: '0.75rem',
        borderRadius: '6px',
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
      }}
    >
      {title && (
        <div
          style={{
            fontSize: '9px',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: 'var(--text-subtle)',
            marginBottom: '0.5rem',
          }}
        >
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {items.map((item, index) => (
          <N3InfoRow
            key={index}
            label={item.label}
            value={item.value}
            mono={item.mono}
          />
        ))}
      </div>
    </div>
  );
});

/**
 * N3InfoRow - 情報行
 */
export interface N3InfoRowProps {
  label: string;
  value: string | number;
  mono?: boolean;
}

export const N3InfoRow = memo(function N3InfoRow({
  label,
  value,
  mono = false,
}: N3InfoRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '10px',
      }}
    >
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span
        style={{
          fontFamily: mono ? 'monospace' : 'inherit',
          color: 'var(--text)',
        }}
      >
        {value}
      </span>
    </div>
  );
});
