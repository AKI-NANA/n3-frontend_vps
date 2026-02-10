/**
 * N3InventoryAlert - 在庫アラートコンポーネント
 * 
 * 棚卸し画面のInventoryAlertsを汎用化
 * 警告/損切りフェーズのアラート表示
 * 
 * @example
 * <N3InventoryAlert
 *   type="warning"
 *   title="警戒在庫"
 *   count={15}
 *   description="4-6ヶ月経過した商品"
 *   onAction={handleViewWarningItems}
 *   actionLabel="詳細を見る"
 * />
 */

'use client';

import React, { memo, type ReactNode } from 'react';
import { 
  AlertTriangle, 
  AlertCircle,
  Info,
  ArrowRight,
  type LucideIcon
} from 'lucide-react';

// ============================================================
// Types
// ============================================================

export type AlertType = 'warning' | 'danger' | 'info';

export interface N3InventoryAlertProps {
  /** アラートタイプ */
  type: AlertType;
  /** タイトル */
  title: string;
  /** 件数 */
  count?: number;
  /** 説明文 */
  description?: string;
  /** アイコン（デフォルト: タイプに応じた自動選択） */
  icon?: LucideIcon;
  /** アクションハンドラ */
  onAction?: () => void;
  /** アクションボタンラベル */
  actionLabel?: string;
  /** サイズ指定 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Main Component
// ============================================================

export const N3InventoryAlert = memo(function N3InventoryAlert({
  type,
  title,
  count,
  description,
  icon,
  onAction,
  actionLabel = '詳細',
  size,
  className = '',
}: N3InventoryAlertProps) {
  const sizeClass = size ? `n3-size-${size}` : '';
  const classes = [
    'n3-inventory-alert',
    `n3-inventory-alert--${type}`,
    sizeClass,
    className
  ].filter(Boolean).join(' ');

  // デフォルトアイコン
  const defaultIcons: Record<AlertType, LucideIcon> = {
    warning: AlertTriangle,
    danger: AlertCircle,
    info: Info,
  };
  const Icon = icon || defaultIcons[type];

  return (
    <div className={classes}>
      <Icon className="n3-inventory-alert__icon" />
      
      <div className="n3-inventory-alert__content">
        <div className="n3-inventory-alert__title">
          {title}
          {count !== undefined && (
            <span className="n3-inventory-alert__count" style={{ marginLeft: 'var(--n3-gap)' }}>
              {count}件
            </span>
          )}
        </div>
        {description && (
          <p style={{ fontSize: 'calc(var(--n3-font) * 0.9)', opacity: 0.9, marginTop: 2 }}>
            {description}
          </p>
        )}
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="n3-inventory-alert__action n3-btn n3-btn-ghost n3-btn-sm"
          style={{ color: 'inherit' }}
        >
          {actionLabel}
          <ArrowRight style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)', marginLeft: 4 }} />
        </button>
      )}
    </div>
  );
});

N3InventoryAlert.displayName = 'N3InventoryAlert';

// ============================================================
// Alert Group
// ============================================================

export interface AlertItem {
  type: AlertType;
  title: string;
  count?: number;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export interface N3InventoryAlertGroupProps {
  alerts: AlertItem[];
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const N3InventoryAlertGroup = memo(function N3InventoryAlertGroup({
  alerts,
  size,
  className = '',
}: N3InventoryAlertGroupProps) {
  if (alerts.length === 0) return null;

  return (
    <div 
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--n3-gap)' }}
    >
      {alerts.map((alert, idx) => (
        <N3InventoryAlert
          key={idx}
          type={alert.type}
          title={alert.title}
          count={alert.count}
          description={alert.description}
          onAction={alert.onAction}
          actionLabel={alert.actionLabel}
          size={size}
        />
      ))}
    </div>
  );
});

N3InventoryAlertGroup.displayName = 'N3InventoryAlertGroup';
