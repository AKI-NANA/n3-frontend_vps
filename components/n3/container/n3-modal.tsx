'use client';

import React, { memo, ReactNode, useEffect, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// ============================================
// N3Modal - モーダルダイアログ
// ============================================
export interface N3ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  centered?: boolean;
  className?: string;
}

export const N3Modal = memo(function N3Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
  centered = true,
  className = '',
}: N3ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  // ポータルターゲットを設定（テーマが適用された要素を優先）
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // data-theme 属性を持つ要素を探す
      const themeRoot = document.querySelector('[data-theme]') as HTMLElement || document.body;
      setPortalTarget(themeRoot);
    }
  }, []);

  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, closeOnEsc, onClose]);

  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnOverlay && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnOverlay, onClose]
  );

  if (!open) return null;

  const sizeClass = {
    sm: 'n3-modal-sm',
    md: 'n3-modal-md',
    lg: 'n3-modal-lg',
    xl: 'n3-modal-xl',
    full: 'n3-modal-full',
  }[size];

  const modal = (
    <div
      className={`n3-modal-overlay ${centered ? 'centered' : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={`n3-modal ${sizeClass} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="n3-modal-header">
            <div className="n3-modal-header-content">
              {title && <h2 className="n3-modal-title">{title}</h2>}
              {description && <p className="n3-modal-description">{description}</p>}
            </div>
            {showCloseButton && (
              <button className="n3-modal-close" onClick={onClose} aria-label="閉じる">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="n3-modal-body">{children}</div>

        {footer && <div className="n3-modal-footer">{footer}</div>}
      </div>
    </div>
  );

  if (typeof document !== 'undefined' && portalTarget) {
    return createPortal(modal, portalTarget);
  }

  return modal;
});

// ============================================
// N3ConfirmModal - 確認ダイアログ
// ============================================
export interface N3ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger' | 'warning';
  loading?: boolean;
}

export const N3ConfirmModal = memo(function N3ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = '確認',
  message,
  confirmLabel = 'OK',
  cancelLabel = 'キャンセル',
  variant = 'default',
  loading = false,
}: N3ConfirmModalProps) {
  const confirmButtonClass = {
    default: 'n3-btn-primary',
    danger: 'n3-btn-danger',
    warning: 'n3-btn-warning',
  }[variant];

  return (
    <N3Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="n3-modal-footer-buttons">
          <button className="n3-btn n3-btn-secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </button>
          <button className={`n3-btn ${confirmButtonClass}`} onClick={onConfirm} disabled={loading}>
            {loading ? '処理中...' : confirmLabel}
          </button>
        </div>
      }
    >
      <p className="n3-confirm-message">{message}</p>
    </N3Modal>
  );
});

export default N3Modal;
