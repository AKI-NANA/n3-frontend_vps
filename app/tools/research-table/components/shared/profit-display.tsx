/**
 * ProfitDisplay: 利益率・利益額表示コンポーネント
 */

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProfitDisplayProps {
  margin?: number | null; // パーセント値 (例: 25.5)
  amount?: number | null;
  currency?: 'JPY' | 'USD';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function ProfitDisplay({
  margin,
  amount,
  currency = 'JPY',
  size = 'md',
  showIcon = true,
}: ProfitDisplayProps) {
  const getMarginColor = (m: number | null | undefined) => {
    if (m === null || m === undefined) return 'text-gray-400';
    if (m >= 20) return 'text-emerald-600';
    if (m >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIcon = (m: number | null | undefined) => {
    if (m === null || m === undefined) return <Minus className="w-3 h-3" />;
    if (m >= 10) return <TrendingUp className="w-3 h-3" />;
    if (m < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const sizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  const formatCurrency = (val: number, cur: 'JPY' | 'USD') => {
    if (cur === 'JPY') {
      return `¥${val.toLocaleString()}`;
    }
    return `$${val.toFixed(2)}`;
  };

  return (
    <div className="flex flex-col gap-0.5">
      {/* 利益率 */}
      <div className={cn('flex items-center gap-1', sizeClasses[size], getMarginColor(margin))}>
        {showIcon && getIcon(margin)}
        <span className="font-bold">
          {margin !== null && margin !== undefined ? `${margin.toFixed(1)}%` : '-'}
        </span>
      </div>

      {/* 利益額 */}
      {amount !== null && amount !== undefined && (
        <div className={cn('text-muted-foreground', sizeClasses[size])}>
          {formatCurrency(amount, currency)}
        </div>
      )}
    </div>
  );
}

// コンパクト版
interface ProfitBadgeProps {
  margin?: number | null;
}

export function ProfitBadge({ margin }: ProfitBadgeProps) {
  if (margin === null || margin === undefined) {
    return <span className="text-gray-400 text-[10px]">-</span>;
  }

  const getBgColor = (m: number) => {
    if (m >= 20) return 'bg-emerald-100 text-emerald-800';
    if (m >= 10) return 'bg-yellow-100 text-yellow-800';
    if (m >= 0) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold',
        getBgColor(margin)
      )}
    >
      {margin.toFixed(1)}%
    </span>
  );
}

// 価格表示
interface PriceDisplayProps {
  price?: number | null;
  currency?: 'JPY' | 'USD';
  label?: string;
  size?: 'sm' | 'md';
}

export function PriceDisplay({ price, currency = 'JPY', label, size = 'md' }: PriceDisplayProps) {
  if (price === null || price === undefined) {
    return <span className="text-gray-400 text-[10px]">-</span>;
  }

  const formatted = currency === 'JPY'
    ? `¥${price.toLocaleString()}`
    : `$${price.toFixed(2)}`;

  return (
    <div className="flex flex-col">
      {label && <span className="text-[9px] text-muted-foreground">{label}</span>}
      <span className={cn('font-mono', size === 'sm' ? 'text-[10px]' : 'text-xs')}>
        {formatted}
      </span>
    </div>
  );
}
