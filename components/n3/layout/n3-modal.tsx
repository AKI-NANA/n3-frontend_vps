'use client';

import React, { memo, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// ============================================================
// N3Modal - Layout Component
// ============================================================
// ゴールドスタンダード準拠:
// - Layout/Viewコンポーネント: ページ構成を定義
// - モーダルの開閉、オーバーレイ、ESCキー操作、サイズ制御
// - 既存の専用モーダル (FullFeaturedModal等) の土台として機能
// ============================================================

export type N3ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface N3ModalProps {
  /** モーダル表示状態 */
  isOpen: boolean;
  /** 閉じるコールバック */
  onClose: () => void;
  /** 子要素 */
  children: React.ReactNode;
  /** モーダルタイトル (アクセシビリティ用) */
  title?: string;
  /** サイズ */
  size?: N3ModalSize;
  /** オーバーレイクリックで閉じる */
  closeOnOverlayClick?: boolean;
  /** ESCキーで閉じる */
  closeOnEscape?: boolean;
  /** 閉じるボタンを表示 */
  showCloseButton?: boolean;
  /** カスタムクラス名 */
  className?: string;
  /** オーバーレイのカスタムクラス名 */
  overlayClassName?: string;
  /** z-index */
  zIndex?: number;
  /** アニメーション無効 */
  disableAnimation?: boolean;
}

// サイズ別のスタイル
const sizeStyles: Record<N3ModalSize, { width: string; maxWidth: string; height?: string; maxHeight: string }> = {
  xs: { width: '90vw', maxWidth: '360px', maxHeight: '80vh' },
  sm: { width: '90vw', maxWidth: '480px', maxHeight: '80vh' },
  md: { width: '90vw', maxWidth: '640px', maxHeight: '85vh' },
  lg: { width: '95vw', maxWidth: '960px', maxHeight: '90vh' },
  xl: { width: '95vw', maxWidth: '1280px', height: '90vh', maxHeight: '900px' },
  full: { width: '95vw', maxWidth: '1600px', height: '92vh', maxHeight: '95vh' },
};

export const N3Modal = memo(function N3Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  overlayClassName = '',
  zIndex = 9998,
  disableAnimation = false,
}: N3ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // ESCキーでの閉じる処理
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // フォーカストラップとbody scroll lock
  useEffect(() => {
    if (isOpen) {
      // 現在のフォーカス要素を保存
      previousActiveElement.current = document.activeElement as HTMLElement;

      // bodyスクロールを無効化
      document.body.style.overflow = 'hidden';

      // モーダルにフォーカス
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    } else {
      // bodyスクロールを復元
      document.body.style.overflow = '';

      // 元のフォーカス要素に戻す
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // オーバーレイクリック
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnOverlayClick, onClose]
  );

  // レンダリングしない
  if (!isOpen) return null;

  const sizeStyle = sizeStyles[size];

  const modalContent = (
    <div
      className={`n3-modal-overlay ${disableAnimation ? '' : 'n3-modal-overlay--animated'} ${overlayClassName}`}
      onClick={handleOverlayClick}
      style={{ zIndex }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`n3-modal ${disableAnimation ? '' : 'n3-modal--animated'} ${className}`}
        style={{
          width: sizeStyle.width,
          maxWidth: sizeStyle.maxWidth,
          height: sizeStyle.height,
          maxHeight: sizeStyle.maxHeight,
          zIndex: zIndex + 1,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        {/* スクリーンリーダー用非表示タイトル */}
        {title && (
          <h2 className="sr-only">{title}</h2>
        )}

        {/* 閉じるボタン */}
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="n3-modal-close"
            aria-label="閉じる"
          >
            <X size={20} />
          </button>
        )}

        {/* コンテンツ */}
        {children}
      </div>
    </div>
  );

  // ポータルでレンダリング
  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
});

// ============================================================
// N3Modal サブコンポーネント
// ============================================================

export interface N3ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const N3ModalHeader = memo(function N3ModalHeader({
  children,
  className = '',
}: N3ModalHeaderProps) {
  return (
    <div className={`n3-modal-header ${className}`}>
      {children}
    </div>
  );
});

export interface N3ModalBodyProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const N3ModalBody = memo(function N3ModalBody({
  children,
  className = '',
  noPadding = false,
}: N3ModalBodyProps) {
  return (
    <div className={`n3-modal-body ${noPadding ? 'n3-modal-body--no-padding' : ''} ${className}`}>
      {children}
    </div>
  );
});

export interface N3ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const N3ModalFooter = memo(function N3ModalFooter({
  children,
  className = '',
}: N3ModalFooterProps) {
  return (
    <div className={`n3-modal-footer ${className}`}>
      {children}
    </div>
  );
});

// displayName設定
N3Modal.displayName = 'N3Modal';
N3ModalHeader.displayName = 'N3ModalHeader';
N3ModalBody.displayName = 'N3ModalBody';
N3ModalFooter.displayName = 'N3ModalFooter';

export default N3Modal;
