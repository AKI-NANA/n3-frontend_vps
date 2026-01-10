'use client';

// ModalHeader - V8.4 - 最適化版
// デザインシステムV4準拠、コンパクトヘッダー
// MODAL_BAR_01_HEADER - 情報表示バー

import { memo } from 'react';
import type { Product } from '@/types/product';

export interface ModalHeaderProps {
  product: Product | null;
  onClose: () => void;
  language?: 'ja' | 'en';
  onLanguageChange?: (lang: 'ja' | 'en') => void;
}

export const ModalHeader = memo(function ModalHeader({ product, onClose, language = 'ja', onLanguageChange }: ModalHeaderProps) {
  const displayTitle = language === 'en' 
    ? ((product as any)?.english_title || (product as any)?.title_en || product?.title || 'Loading...')
    : (product?.title || 'データ読み込み中...');
  
  const sku = product?.sku || '-';

  return (
    <header style={{
      background: '#f1f5f9',
      borderBottom: '1px solid #e2e8f0',
      padding: '0.75rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      {/* 左側: ステータス + SKU + タイトル */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
        <span style={{
          padding: '0.125rem 0.5rem',
          fontSize: '10px',
          fontWeight: 600,
          borderRadius: '9999px',
          background: '#10b98120',
          color: '#10b981',
        }}>
          Active
        </span>
        <span style={{ 
          fontFamily: 'monospace', 
          fontSize: '11px', 
          color: '#64748b' 
        }}>
          {sku}
        </span>
        <span style={{ 
          fontWeight: 600, 
          fontSize: '13px', 
          color: '#1e293b',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '400px',
        }}>
          {displayTitle}
        </span>
      </div>
      
      {/* 右側: 言語切り替え + 閉じる */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* 言語切り替え */}
        {onLanguageChange && (
          <div style={{ 
            display: 'flex', 
            padding: '2px', 
            borderRadius: '6px', 
            background: '#ffffff',
            border: '1px solid #e2e8f0',
          }}>
            <button
              onClick={() => onLanguageChange('ja')}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '10px',
                fontWeight: 600,
                borderRadius: '4px',
                border: 'none',
                background: language === 'ja' ? '#1e293b' : 'transparent',
                color: language === 'ja' ? '#ffffff' : '#64748b',
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
                background: language === 'en' ? '#1e293b' : 'transparent',
                color: language === 'en' ? '#ffffff' : '#64748b',
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
            color: '#64748b',
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.color = '#1e293b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </header>
  );
});
