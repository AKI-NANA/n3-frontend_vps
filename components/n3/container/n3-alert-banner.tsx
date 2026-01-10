/**
 * N3AlertBanner - 汎用アラートバナーコンポーネント
 * 
 * ページ上部やセクション内に表示するアラートバナー
 * 
 * @example
 * <N3AlertBanner
 *   type="warning"
 *   title="警告"
 *   description="期限が近づいています"
 *   count={5}
 *   action={{ label: '詳細', onClick: handleClick }}
 * />
 */

'use client';

import React, { memo, type ReactNode } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  ArrowRight,
  X,
  type LucideIcon 
} from 'lucide-react';

// ============================================================
// N3AlertBanner
// ============================================================

export type AlertBannerType = 'info' | 'success' | 'warning' | 'error';

export interface N3AlertBannerProps {
  /** アラートタイプ */
  type: AlertBannerType;
  /** タイトル */
  title: string;
  /** 説明文 */
  description?: string;
  /** 件数表示 */
  count?: number;
  /** カスタムアイコン */
  icon?: LucideIcon;
  /** アクションボタン */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** 閉じるボタンを表示 */
  dismissible?: boolean;
  /** 閉じるハンドラ */
  onDismiss?: () => void;
  /** 追加のクラス名 */
  className?: string;
}

const defaultIcons: Record<AlertBannerType, LucideIcon> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

export const N3AlertBanner = memo(function N3AlertBanner({
  type,
  title,
  description,
  count,
  icon,
  action,
  dismissible = false,
  onDismiss,
  className = '',
}: N3AlertBannerProps) {
  const Icon = icon || defaultIcons[type];
  const classes = [
    'n3-alert-banner',
    `n3-alert-banner--${type}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="alert">
      <Icon className="n3-alert-banner__icon" />
      
      <div className="n3-alert-banner__content">
        <div className="n3-alert-banner__title">
          {title}
          {count !== undefined && (
            <span className="n3-alert-banner__count">{count}件</span>
          )}
        </div>
        {description && (
          <p className="n3-alert-banner__description">{description}</p>
        )}
      </div>

      <div className="n3-alert-banner__actions">
        {action && (
          <button
            onClick={action.onClick}
            className="n3-alert-banner__action n3-btn n3-btn-ghost n3-btn-sm"
          >
            {action.label}
            <ArrowRight className="n3-alert-banner__action-icon" />
          </button>
        )}
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="n3-alert-banner__dismiss n3-btn n3-btn-ghost n3-btn-sm"
            aria-label="閉じる"
          >
            <X className="n3-alert-banner__dismiss-icon" />
          </button>
        )}
      </div>
    </div>
  );
});

N3AlertBanner.displayName = 'N3AlertBanner';

// ============================================================
// N3AlertBannerGroup - アラートグループ
// ============================================================

export interface AlertBannerItem {
  id?: string | number;
  type: AlertBannerType;
  title: string;
  description?: string;
  count?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface N3AlertBannerGroupProps {
  alerts: AlertBannerItem[];
  dismissible?: boolean;
  onDismiss?: (index: number) => void;
  className?: string;
}

export const N3AlertBannerGroup = memo(function N3AlertBannerGroup({
  alerts,
  dismissible = false,
  onDismiss,
  className = '',
}: N3AlertBannerGroupProps) {
  if (alerts.length === 0) return null;

  return (
    <div className={`n3-alert-banner-group ${className}`}>
      {alerts.map((alert, index) => (
        <N3AlertBanner
          key={alert.id ?? index}
          type={alert.type}
          title={alert.title}
          description={alert.description}
          count={alert.count}
          action={alert.action}
          dismissible={dismissible}
          onDismiss={onDismiss ? () => onDismiss(index) : undefined}
        />
      ))}
    </div>
  );
});

N3AlertBannerGroup.displayName = 'N3AlertBannerGroup';
