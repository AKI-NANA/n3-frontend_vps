'use client';

import React, { memo, useCallback, ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================
// N3Alert - Presentational Component
// ============================================================
// アラート/メッセージ表示
// - variant: info / success / warning / error
// - 閉じるボタン対応
// - カスタムアイコン対応
// ============================================================

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface N3AlertProps {
  /** バリアント */
  variant?: AlertVariant;
  /** タイトル */
  title?: string;
  /** メッセージ */
  message?: string;
  /** 子要素 */
  children?: ReactNode;
  /** カスタムアイコン */
  icon?: LucideIcon;
  /** アイコンを非表示 */
  hideIcon?: boolean;
  /** 閉じるボタンを表示 */
  closable?: boolean;
  /** 閉じるハンドラ */
  onClose?: () => void;
  /** 追加クラス名 */
  className?: string;
}

const variantIcons: Record<AlertVariant, LucideIcon> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

export const N3Alert = memo(function N3Alert({
  variant = 'info',
  title,
  message,
  children,
  icon,
  hideIcon = false,
  closable = false,
  onClose,
  className = '',
}: N3AlertProps) {
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const Icon = icon || variantIcons[variant];

  const baseClass = 'n3-alert';
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="alert">
      {!hideIcon && (
        <div className="n3-alert__icon">
          <Icon />
        </div>
      )}
      <div className="n3-alert__content">
        {title && <div className="n3-alert__title">{title}</div>}
        {message && <div className="n3-alert__message">{message}</div>}
        {children}
      </div>
      {closable && (
        <button
          type="button"
          className="n3-alert__close"
          onClick={handleClose}
          aria-label="閉じる"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
});

N3Alert.displayName = 'N3Alert';

export default N3Alert;
