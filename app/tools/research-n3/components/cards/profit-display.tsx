'use client';

import React, { memo } from 'react';

// ============================================================
// ProfitDisplay - Presentational Component
// ============================================================
// 利益率・利益額の表示
// - Hooks呼び出し禁止
// - 外部マージン禁止
// - React.memoでラップ
// ============================================================

export interface ProfitDisplayProps {
  margin?: number;
  amount?: number;
  currency?: 'USD' | 'JPY';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical' | 'compact';
  showSign?: boolean;
}

const SIZE_STYLES = {
  xs: { marginSize: 11, amountSize: 10 },
  sm: { marginSize: 13, amountSize: 11 },
  md: { marginSize: 15, amountSize: 12 },
  lg: { marginSize: 18, amountSize: 14 },
};

const getMarginColor = (margin: number): string => {
  if (margin >= 30) return 'var(--color-success)';
  if (margin >= 15) return 'var(--color-warning)';
  if (margin >= 0) return 'var(--text-muted)';
  return 'var(--color-error)';
};

export const ProfitDisplay = memo(function ProfitDisplay({
  margin,
  amount,
  currency = 'USD',
  size = 'sm',
  layout = 'horizontal',
  showSign = true,
}: ProfitDisplayProps) {
  const sizeStyle = SIZE_STYLES[size];
  const color = getMarginColor(margin || 0);
  const currencySymbol = currency === 'USD' ? '$' : '¥';
  const formattedAmount = amount !== undefined
    ? (currency === 'JPY'
        ? Math.round(amount).toLocaleString()
        : amount.toFixed(2))
    : null;

  if (layout === 'compact') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          color,
          fontFamily: 'monospace',
          fontSize: sizeStyle.marginSize,
          fontWeight: 600,
        }}
      >
        {showSign && margin !== undefined && margin >= 0 && '+'}
        {margin !== undefined ? `${margin.toFixed(1)}%` : '-'}
      </span>
    );
  }

  if (layout === 'vertical') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <span
          style={{
            color,
            fontFamily: 'monospace',
            fontSize: sizeStyle.marginSize,
            fontWeight: 600,
          }}
        >
          {showSign && margin !== undefined && margin >= 0 && '+'}
          {margin !== undefined ? `${margin.toFixed(1)}%` : '-'}
        </span>
        {formattedAmount !== null && (
          <span
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'monospace',
              fontSize: sizeStyle.amountSize,
            }}
          >
            {showSign && amount !== undefined && amount >= 0 && '+'}
            {currencySymbol}{formattedAmount}
          </span>
        )}
      </div>
    );
  }

  // horizontal
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
      <span
        style={{
          color,
          fontFamily: 'monospace',
          fontSize: sizeStyle.marginSize,
          fontWeight: 600,
        }}
      >
        {showSign && margin !== undefined && margin >= 0 && '+'}
        {margin !== undefined ? `${margin.toFixed(1)}%` : '-'}
      </span>
      {formattedAmount !== null && (
        <span
          style={{
            color: 'var(--text-muted)',
            fontFamily: 'monospace',
            fontSize: sizeStyle.amountSize,
          }}
        >
          ({showSign && amount !== undefined && amount >= 0 && '+'}
          {currencySymbol}{formattedAmount})
        </span>
      )}
    </span>
  );
});

// ============================================================
// ScoreDisplay - Presentational Component
// ============================================================

export interface ScoreDisplayProps {
  score?: number;
  maxScore?: number;
  label?: string;
  size?: 'xs' | 'sm' | 'md';
  showBar?: boolean;
  variant?: 'default' | 'profit' | 'sales' | 'risk';
}

const VARIANT_COLORS = {
  default: 'var(--color-primary)',
  profit: 'var(--color-success)',
  sales: 'var(--color-info)',
  risk: 'var(--color-warning)',
};

export const ScoreDisplay = memo(function ScoreDisplay({
  score,
  maxScore = 100,
  label,
  size = 'sm',
  showBar = false,
  variant = 'default',
}: ScoreDisplayProps) {
  const sizeStyle = SIZE_STYLES[size];
  const color = VARIANT_COLORS[variant];
  const percentage = score !== undefined ? (score / maxScore) * 100 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        {label && (
          <span style={{ fontSize: sizeStyle.amountSize, color: 'var(--text-muted)' }}>
            {label}:
          </span>
        )}
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: sizeStyle.marginSize,
            fontWeight: 600,
            color: score !== undefined ? color : 'var(--text-muted)',
          }}
        >
          {score !== undefined ? score.toFixed(0) : '-'}
        </span>
        {score !== undefined && (
          <span style={{ fontSize: sizeStyle.amountSize, color: 'var(--text-muted)' }}>
            /{maxScore}
          </span>
        )}
      </div>
      {showBar && (
        <div
          style={{
            width: '100%',
            height: 4,
            background: 'var(--highlight)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.min(percentage, 100)}%`,
              height: '100%',
              background: color,
              borderRadius: 2,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      )}
    </div>
  );
});

// ============================================================
// ScoreGrid - Presentational Component
// ============================================================

export interface ScoreGridProps {
  totalScore?: number;
  profitScore?: number;
  salesScore?: number;
  riskScore?: number;
  size?: 'xs' | 'sm' | 'md';
  layout?: 'grid' | 'row';
}

export const ScoreGrid = memo(function ScoreGrid({
  totalScore,
  profitScore,
  salesScore,
  riskScore,
  size = 'sm',
  layout = 'grid',
}: ScoreGridProps) {
  const scores = [
    { label: '総合', score: totalScore, variant: 'default' as const },
    { label: '利益', score: profitScore, variant: 'profit' as const },
    { label: '販売', score: salesScore, variant: 'sales' as const },
    { label: 'リスク', score: riskScore, variant: 'risk' as const },
  ];

  return (
    <div
      style={{
        display: layout === 'grid' ? 'grid' : 'flex',
        gridTemplateColumns: layout === 'grid' ? 'repeat(2, 1fr)' : undefined,
        gap: layout === 'grid' ? 8 : 12,
      }}
    >
      {scores.map(({ label, score, variant }) => (
        <ScoreDisplay
          key={label}
          label={label}
          score={score}
          size={size}
          variant={variant}
        />
      ))}
    </div>
  );
});

ProfitDisplay.displayName = 'ProfitDisplay';
ScoreDisplay.displayName = 'ScoreDisplay';
ScoreGrid.displayName = 'ScoreGrid';

export default ProfitDisplay;
