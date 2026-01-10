/**
 * N3ProfitSummary - 利益サマリーコンポーネント
 * 
 * /tools/editing の ProductModal で使用
 * Margin と Profit を表示するコンパクトなカード
 */

'use client';

import React, { memo } from 'react';

export interface N3ProfitSummaryProps {
  /** 利益率（%） */
  margin?: number;
  /** 利益額 */
  profit?: number;
  /** 通貨記号 */
  currency?: string;
  /** タイトル */
  title?: string;
}

export const N3ProfitSummary = memo(function N3ProfitSummary({
  margin = 0,
  profit = 0,
  currency = '$',
  title = 'Profit Summary',
}: N3ProfitSummaryProps) {
  // 利益率に応じた色
  const getColor = (value: number) => {
    if (value >= 15) return 'var(--success)';
    if (value >= 0) return 'var(--warning)';
    return 'var(--error)';
  };

  const color = getColor(margin);

  return (
    <div
      style={{
        padding: '0.75rem',
        borderRadius: '6px',
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
      }}
    >
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
        }}
      >
        {/* Margin */}
        <div
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            background: 'var(--highlight)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '8px',
              textTransform: 'uppercase',
              color: 'var(--text-subtle)',
            }}
          >
            Margin
          </div>
          <div
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              fontFamily: 'monospace',
              color,
            }}
          >
            {margin > 0 ? `${margin.toFixed(1)}%` : '-'}
          </div>
        </div>

        {/* Profit */}
        <div
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            background: 'var(--highlight)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '8px',
              textTransform: 'uppercase',
              color: 'var(--text-subtle)',
            }}
          >
            Profit
          </div>
          <div
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              fontFamily: 'monospace',
              color,
            }}
          >
            {profit > 0 ? `${currency}${profit.toFixed(0)}` : '-'}
          </div>
        </div>
      </div>
    </div>
  );
});
