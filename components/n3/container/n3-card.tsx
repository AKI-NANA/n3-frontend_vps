'use client';

import React, { memo, ReactNode } from 'react';

// ============================================
// N3Card - カードコンポーネント
// ============================================
export interface N3CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
  footer?: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

export const N3Card = memo(function N3Card({
  children,
  title,
  subtitle,
  headerActions,
  footer,
  padding = 'md',
  bordered = true,
  shadow = 'sm',
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
}: N3CardProps) {
  const cardClass = [
    'n3-card',
    `padding-${padding}`,
    bordered && 'bordered',
    shadow !== 'none' && `shadow-${shadow}`,
    hoverable && 'hoverable',
    clickable && 'clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cardClass}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {(title || subtitle || headerActions) && (
        <div className="n3-card-header">
          <div className="n3-card-header-content">
            {title && <h3 className="n3-card-title">{title}</h3>}
            {subtitle && <p className="n3-card-subtitle">{subtitle}</p>}
          </div>
          {headerActions && (
            <div className="n3-card-header-actions">{headerActions}</div>
          )}
        </div>
      )}

      <div className="n3-card-body">{children}</div>

      {footer && <div className="n3-card-footer">{footer}</div>}
    </div>
  );
});

// ============================================
// N3StatCard - 統計カード
// ============================================
export interface N3StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  showTrend?: boolean;
  className?: string;
}

export const N3StatCard = memo(function N3StatCard({
  label,
  value,
  change,
  changeLabel,
  icon,
  color = 'default',
  showTrend = true,
  className = '',
}: N3StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className={`n3-stat-card ${color} ${className}`}>
      <div className="n3-stat-card-header">
        <span className="n3-stat-card-label">{label}</span>
        {icon && <span className="n3-stat-card-icon">{icon}</span>}
      </div>
      
      <div className="n3-stat-card-value">{value}</div>
      
      {change !== undefined && showTrend && (
        <div className={`n3-stat-card-change ${isPositive ? 'positive' : 'negative'}`}>
          <span className="n3-stat-card-change-icon">
            {isPositive ? '↑' : '↓'}
          </span>
          <span className="n3-stat-card-change-value">
            {Math.abs(change)}%
          </span>
          {changeLabel && (
            <span className="n3-stat-card-change-label">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
});

export default N3Card;
