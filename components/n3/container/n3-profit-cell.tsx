'use client';

import React, { memo } from 'react';

// ============================================
// N3ProfitCell - 利益額セル
// ============================================
export interface N3ProfitCellProps {
  value: number;
  currency?: string;
  showZero?: boolean;
  decimals?: number;
  tooltip?: string;
  className?: string;
}

export const N3ProfitCell = memo(function N3ProfitCell({
  value,
  currency = '¥',
  showZero = true,
  decimals = 0,
  tooltip,
  className = '',
}: N3ProfitCellProps) {
  if (!showZero && value === 0) {
    return <div className={`n3-table-cell n3-col-profit ${className}`}>-</div>;
  }

  const isPositive = value > 0;
  const isNegative = value < 0;

  const formattedValue = Math.abs(value).toLocaleString('ja-JP', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  let valueClass = 'n3-value-profit';
  if (isPositive) valueClass += ' positive';
  if (isNegative) valueClass += ' negative';

  return (
    <div
      className={`n3-table-cell n3-col-profit right ${className}`}
      title={tooltip}
    >
      <span className={valueClass}>
        {isNegative && '-'}
        {currency}
        {formattedValue}
      </span>
    </div>
  );
});

// ============================================
// N3MarginCell - 利益率セル
// ============================================
export interface N3MarginCellProps {
  value: number;
  showZero?: boolean;
  decimals?: number;
  warningThreshold?: number;
  dangerThreshold?: number;
  tooltip?: string;
  className?: string;
}

export const N3MarginCell = memo(function N3MarginCell({
  value,
  showZero = true,
  decimals = 1,
  warningThreshold = 10,
  dangerThreshold = 5,
  tooltip,
  className = '',
}: N3MarginCellProps) {
  if (!showZero && value === 0) {
    return <div className={`n3-table-cell n3-col-rate ${className}`}>-</div>;
  }

  const isPositive = value > 0;
  const isNegative = value < 0;
  const isWarning = value <= warningThreshold && value > dangerThreshold;
  const isDanger = value <= dangerThreshold;

  const formattedValue = Math.abs(value).toFixed(decimals);

  let valueClass = 'n3-value-margin';
  if (isNegative || isDanger) valueClass += ' negative';
  else if (isWarning) valueClass += ' warning';
  else if (isPositive) valueClass += ' positive';

  return (
    <div
      className={`n3-table-cell n3-col-rate right ${className}`}
      title={tooltip}
    >
      <span className={valueClass}>
        {isNegative && '-'}
        {formattedValue}%
      </span>
    </div>
  );
});

// ============================================
// N3PriceCell - 価格セル
// ============================================
export interface N3PriceCellProps {
  value: number;
  currency?: string;
  decimals?: number;
  strikethrough?: boolean;
  originalValue?: number;
  tooltip?: string;
  className?: string;
}

export const N3PriceCell = memo(function N3PriceCell({
  value,
  currency = '¥',
  decimals = 0,
  strikethrough = false,
  originalValue,
  tooltip,
  className = '',
}: N3PriceCellProps) {
  const formattedValue = value.toLocaleString('ja-JP', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const hasDiscount = originalValue !== undefined && originalValue > value;

  return (
    <div
      className={`n3-table-cell n3-col-price right ${className}`}
      title={tooltip}
    >
      {hasDiscount && (
        <span className="n3-price-original">
          {currency}
          {originalValue.toLocaleString('ja-JP')}
        </span>
      )}
      <span className={`n3-value-price ${strikethrough ? 'strikethrough' : ''}`}>
        {currency}
        {formattedValue}
      </span>
    </div>
  );
});

// ============================================
// N3StockCell - 在庫セル
// ============================================
export interface N3StockCellProps {
  value: number;
  lowStockThreshold?: number;
  tooltip?: string;
  className?: string;
}

export const N3StockCell = memo(function N3StockCell({
  value,
  lowStockThreshold = 3,
  tooltip,
  className = '',
}: N3StockCellProps) {
  const isOutOfStock = value === 0;
  const isLowStock = value > 0 && value <= lowStockThreshold;

  let valueClass = 'n3-value-stock';
  if (isOutOfStock) valueClass += ' out-of-stock';
  else if (isLowStock) valueClass += ' low-stock';

  return (
    <div
      className={`n3-table-cell n3-col-stock right ${className}`}
      title={tooltip}
    >
      <span className={valueClass}>{value}</span>
    </div>
  );
});

export default N3ProfitCell;
