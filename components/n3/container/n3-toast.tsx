'use client';

import React, { memo, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

// ============================================
// Toast Types
// ============================================
export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  closable?: boolean;
}

// ============================================
// N3ToastItem - 個別トースト
// ============================================
interface N3ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const N3ToastItem = memo(function N3ToastItem({ toast, onClose }: N3ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  }, [toast.id, onClose]);

  const icons = {
    info: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
    success: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    warning: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
      </svg>
    ),
  };

  return (
    <div className={`n3-toast ${toast.type} ${isExiting ? 'exiting' : ''}`}>
      <div className="n3-toast-icon">{icons[toast.type]}</div>
      <div className="n3-toast-content">
        {toast.title && <div className="n3-toast-title">{toast.title}</div>}
        <div className="n3-toast-message">{toast.message}</div>
      </div>
      {toast.closable !== false && (
        <button className="n3-toast-close" onClick={handleClose}>×</button>
      )}
    </div>
  );
});

// ============================================
// N3ToastContainer - トーストコンテナ
// ============================================
interface N3ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const N3ToastContainer = memo(function N3ToastContainer({
  toasts,
  onClose,
  position = 'top-right',
}: N3ToastContainerProps) {
  if (!toasts || toasts.length === 0) return null;

  const container = (
    <div className={`n3-toast-container ${position}`}>
      {toasts.map((toast) => (
        <N3ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(container, document.body);
  }

  return container;
});

// ============================================
// useToast - トースト管理フック
// ============================================
let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastId}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    info: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) =>
      addToast({ type: 'info', message, duration: 5000, ...options }),
    success: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) =>
      addToast({ type: 'success', message, duration: 5000, ...options }),
    warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) =>
      addToast({ type: 'warning', message, duration: 7000, ...options }),
    error: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) =>
      addToast({ type: 'error', message, duration: 10000, ...options }),
  };

  return { toasts, addToast, removeToast, toast };
}

export default N3ToastContainer;
