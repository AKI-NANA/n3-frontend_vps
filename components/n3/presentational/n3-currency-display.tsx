/**
 * N3CurrencyDisplay - Presentational Component
 * 
 * 為替レート表示
 */

'use client';

import { memo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type CurrencyTrend = 'up' | 'down' | 'neutral';

export interface N3CurrencyDisplayProps {
  symbol?: string;
  value: number;
  currency?: string;
  trend?: CurrencyTrend;
  decimals?: number;
  showIcon?: boolean;
  className?: string;
}

export const N3CurrencyDisplay = memo(function N3CurrencyDisplay({
  symbol = '$',
  value,
  currency = '¥',
  trend = 'neutral',
  decimals = 2,
  showIcon = true,
  className = '',
}: N3CurrencyDisplayProps) {
  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  }[trend];

  return (
    <div className={`n3-currency-display ${className}`}>
      {showIcon && (
        <DollarSign className={`n3-currency-display__icon n3-currency-display__icon--${trend}`} />
      )}
      <span className="n3-currency-display__value">
        {currency}{value.toFixed(decimals)}
      </span>
      {trend !== 'neutral' && (
        <TrendIcon className={`n3-currency-display__trend n3-currency-display__icon--${trend}`} />
      )}
    </div>
  );
});

N3CurrencyDisplay.displayName = 'N3CurrencyDisplay';
