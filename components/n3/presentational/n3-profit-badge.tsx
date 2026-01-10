/**
 * N3ProfitBadge - 利益率・利益額表示コンポーネント
 *
 * 利益率をカラーコード付きバッジで表示
 * 
 * 設計原則:
 * - 純粋なPresentationalコンポーネント
 * - 利益計算ロジックは持たない
 * - 状態なし
 *
 * @example
 * <N3ProfitBadge margin={25.5} />
 * <N3ProfitDisplay margin={15} amount={5000} currency="JPY" />
 */

import { memo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ============================================================
// Types
// ============================================================

export type N3ProfitSize = 'sm' | 'md' | 'lg';
export type N3Currency = 'JPY' | 'USD';

export interface N3ProfitBadgeProps {
  /** 利益率（パーセント） */
  margin?: number | null;
  /** 追加のクラス名 */
  className?: string;
}

export interface N3ProfitDisplayProps {
  /** 利益率（パーセント） */
  margin?: number | null;
  /** 利益額 */
  amount?: number | null;
  /** 通貨 */
  currency?: N3Currency;
  /** サイズ */
  size?: N3ProfitSize;
  /** アイコン表示 */
  showIcon?: boolean;
  /** 追加のクラス名 */
  className?: string;
}

export interface N3PriceDisplayProps {
  /** 価格 */
  price?: number | null;
  /** 通貨 */
  currency?: N3Currency;
  /** ラベル */
  label?: string;
  /** サイズ */
  size?: N3ProfitSize;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Helpers
// ============================================================

function getMarginStyle(margin: number): { bg: string; color: string } {
  if (margin >= 20) return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' };
  if (margin >= 10) return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' };
  if (margin >= 0) return { bg: 'rgba(251, 146, 60, 0.1)', color: '#fb923c' };
  return { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' };
}

function formatCurrency(value: number, currency: N3Currency): string {
  if (currency === 'JPY') {
    return `¥${value.toLocaleString()}`;
  }
  return `$${value.toFixed(2)}`;
}

const SIZE_MAP: Record<N3ProfitSize, { font: number; labelFont: number }> = {
  sm: { font: 10, labelFont: 9 },
  md: { font: 12, labelFont: 10 },
  lg: { font: 14, labelFont: 11 },
};

// ============================================================
// N3ProfitBadge - コンパクトバッジ
// ============================================================

export const N3ProfitBadge = memo(function N3ProfitBadge({
  margin,
  className = '',
}: N3ProfitBadgeProps) {
  // Null check
  if (margin === null || margin === undefined) {
    return (
      <span 
        className={className}
        style={{ color: 'var(--text-muted)', fontSize: 10 }}
      >
        -
      </span>
    );
  }

  const { bg, color } = getMarginStyle(margin);

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 600,
    backgroundColor: bg,
    color,
  };

  return (
    <span className={className} style={style}>
      {margin >= 0 ? '+' : ''}{margin.toFixed(1)}%
    </span>
  );
});

N3ProfitBadge.displayName = 'N3ProfitBadge';

// ============================================================
// N3ProfitDisplay - 詳細表示
// ============================================================

export const N3ProfitDisplay = memo(function N3ProfitDisplay({
  margin,
  amount,
  currency = 'JPY',
  size = 'md',
  showIcon = true,
  className = '',
}: N3ProfitDisplayProps) {
  const sizeConfig = SIZE_MAP[size];
  
  const getIcon = () => {
    if (margin === null || margin === undefined) {
      return <Minus size={12} />;
    }
    if (margin >= 10) return <TrendingUp size={12} />;
    if (margin < 0) return <TrendingDown size={12} />;
    return <Minus size={12} />;
  };

  const getMarginColor = () => {
    if (margin === null || margin === undefined) return 'var(--text-muted)';
    if (margin >= 20) return 'var(--success)';
    if (margin >= 10) return 'var(--warning)';
    return 'var(--error)';
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };

  const marginRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: sizeConfig.font,
    color: getMarginColor(),
  };

  const amountStyle: React.CSSProperties = {
    fontSize: sizeConfig.labelFont,
    color: 'var(--text-muted)',
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={marginRowStyle}>
        {showIcon && getIcon()}
        <span style={{ fontWeight: 700 }}>
          {margin !== null && margin !== undefined ? `${margin.toFixed(1)}%` : '-'}
        </span>
      </div>
      {amount !== null && amount !== undefined && (
        <div style={amountStyle}>
          {formatCurrency(amount, currency)}
        </div>
      )}
    </div>
  );
});

N3ProfitDisplay.displayName = 'N3ProfitDisplay';

// ============================================================
// N3PriceDisplay - 価格表示
// ============================================================

export const N3PriceDisplay = memo(function N3PriceDisplay({
  price,
  currency = 'JPY',
  label,
  size = 'md',
  className = '',
}: N3PriceDisplayProps) {
  const sizeConfig = SIZE_MAP[size];

  // Null check
  if (price === null || price === undefined) {
    return (
      <span 
        className={className}
        style={{ color: 'var(--text-muted)', fontSize: sizeConfig.font }}
      >
        -
      </span>
    );
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: sizeConfig.labelFont,
    color: 'var(--text-muted)',
  };

  const priceStyle: React.CSSProperties = {
    fontFamily: 'monospace',
    fontSize: sizeConfig.font,
  };

  return (
    <div className={className} style={containerStyle}>
      {label && <span style={labelStyle}>{label}</span>}
      <span style={priceStyle}>{formatCurrency(price, currency)}</span>
    </div>
  );
});

N3PriceDisplay.displayName = 'N3PriceDisplay';
