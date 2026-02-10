/**
 * N3ModalHeader - モーダルヘッダーコンポーネント
 * 
 * /tools/editing の ProductModal で使用
 * ステータスバッジ + SKU + タイトル + 言語切替 + 閉じるボタン
 */

'use client';

import React, { memo } from 'react';
import { X } from 'lucide-react';
import { N3Badge } from '../presentational/n3-badge';

export interface N3ModalHeaderProps {
  /** ステータス（Active/Draft/Ended等） */
  status?: 'active' | 'draft' | 'ended' | 'pending';
  /** SKU */
  sku?: string;
  /** タイトル */
  title: string;
  /** 言語設定 */
  language?: 'ja' | 'en';
  /** 言語変更ハンドラ */
  onLanguageChange?: (lang: 'ja' | 'en') => void;
  /** 閉じるハンドラ */
  onClose: () => void;
  /** カスタム右側コンテンツ */
  rightContent?: React.ReactNode;
}

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'error' | 'muted'> = {
  active: 'success',
  draft: 'warning',
  ended: 'error',
  pending: 'muted',
};

export const N3ModalHeader = memo(function N3ModalHeader({
  status = 'active',
  sku,
  title,
  language = 'ja',
  onLanguageChange,
  onClose,
  rightContent,
}: N3ModalHeaderProps) {
  return (
    <header
      style={{
        background: 'var(--panel)',
        borderBottom: '1px solid var(--panel-border)',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      {/* 左側: ステータス + SKU + タイトル */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
        <N3Badge variant={STATUS_VARIANTS[status] || 'muted'} size="sm">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </N3Badge>
        
        {sku && (
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              color: 'var(--text-muted)',
            }}
          >
            {sku}
          </span>
        )}
        
        <span
          style={{
            fontWeight: 600,
            fontSize: '13px',
            color: 'var(--text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '400px',
          }}
        >
          {title}
        </span>
      </div>

      {/* 右側: カスタムコンテンツ / 言語切り替え / 閉じる */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {rightContent}

        {/* 言語切り替え */}
        {onLanguageChange && (
          <div
            style={{
              display: 'flex',
              padding: '2px',
              borderRadius: '6px',
              background: 'var(--highlight)',
              border: '1px solid var(--panel-border)',
            }}
          >
            <button
              onClick={() => onLanguageChange('ja')}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '10px',
                fontWeight: 600,
                borderRadius: '4px',
                border: 'none',
                background: language === 'ja' ? 'var(--accent-bg)' : 'transparent',
                color: language === 'ja' ? 'var(--accent-text)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              日本語
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '10px',
                fontWeight: 600,
                borderRadius: '4px',
                border: 'none',
                background: language === 'en' ? 'var(--accent-bg)' : 'transparent',
                color: language === 'en' ? 'var(--accent-text)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              EN
            </button>
          </div>
        )}

        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          aria-label="閉じる"
          style={{
            padding: '0.375rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--highlight)';
            e.currentTarget.style.color = 'var(--text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <X size={16} />
        </button>
      </div>
    </header>
  );
});
