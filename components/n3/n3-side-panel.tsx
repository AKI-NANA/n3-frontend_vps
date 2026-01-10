// components/n3/n3-side-panel.tsx
'use client';

import React, { memo, useEffect } from 'react';
import { X } from 'lucide-react';

export interface N3SidePanelProps {
  /** 表示状態 */
  isOpen: boolean;
  /** 閉じるハンドラ */
  onClose: () => void;
  /** タイトル */
  title: string;
  /** サブタイトル */
  subtitle?: string;
  /** 幅 */
  width?: number | string;
  /** 位置 */
  position?: 'left' | 'right';
  /** 子要素 */
  children: React.ReactNode;
  /** フッターアクション */
  footer?: React.ReactNode;
  /** オーバーレイクリックで閉じる */
  closeOnOverlayClick?: boolean;
}

export const N3SidePanel = memo(function N3SidePanel({
  isOpen,
  onClose,
  title,
  subtitle,
  width = 400,
  position = 'right',
  children,
  footer,
  closeOnOverlayClick = true,
}: N3SidePanelProps) {
  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // スクロールロック
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const panelWidth = typeof width === 'number' ? `${width}px` : width;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
      }}
    >
      {/* オーバーレイ */}
      <div
        onClick={closeOnOverlayClick ? onClose : undefined}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(2px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* パネル */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          [position]: 0,
          width: panelWidth,
          maxWidth: '100vw',
          background: 'var(--panel)',
          borderLeft: position === 'right' ? '1px solid var(--panel-border)' : 'none',
          borderRight: position === 'left' ? '1px solid var(--panel-border)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          animation: position === 'right' 
            ? 'slideInFromRight 0.25s ease' 
            : 'slideInFromLeft 0.25s ease',
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--panel-border)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--text)',
                margin: 0,
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  margin: '4px 0 0 0',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            className="hover:bg-[var(--highlight)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* コンテンツ */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px 20px',
          }}
        >
          {children}
        </div>

        {/* フッター */}
        {footer && (
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--panel-border)',
              background: 'var(--bg)',
            }}
          >
            {footer}
          </div>
        )}
      </div>

      {/* アニメーション用CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInFromRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
});

export default N3SidePanel;
