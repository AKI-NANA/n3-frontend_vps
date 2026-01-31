'use client';

// ModalHeader - V8.5 - タイトル展開対応版
// デザインシステムV4準拠、コンパクトヘッダー
// MODAL_BAR_01_HEADER - 情報表示バー
// 🔥 タイトルクリックで全文表示/コピー機能追加

import { memo, useState, useCallback } from 'react';
import type { Product } from '@/types/product';

export interface ModalHeaderProps {
  product: Product | null;
  onClose: () => void;
  language?: 'ja' | 'en';
  onLanguageChange?: (lang: 'ja' | 'en') => void;
}

export const ModalHeader = memo(function ModalHeader({ product, onClose, language = 'ja', onLanguageChange }: ModalHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const displayTitle = language === 'en' 
    ? ((product as any)?.english_title || (product as any)?.title_en || product?.title || 'Loading...')
    : (product?.title || 'データ読み込み中...');
  
  const sku = product?.sku || '-';

  // タイトルをコピー
  const handleCopyTitle = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(displayTitle);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('コピー失敗:', error);
    }
  }, [displayTitle]);

  // タイトル展開トグル
  const handleToggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <header style={{
      background: '#f1f5f9',
      borderBottom: '1px solid #e2e8f0',
      padding: '0.75rem 1rem',
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* 左側: ステータス + SKU + タイトル（省略版） */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1 }}>
          <span style={{
            padding: '0.125rem 0.5rem',
            fontSize: '10px',
            fontWeight: 600,
            borderRadius: '9999px',
            background: '#10b98120',
            color: '#10b981',
            flexShrink: 0,
          }}>
            Active
          </span>
          <span style={{ 
            fontFamily: 'monospace', 
            fontSize: '11px', 
            color: '#64748b',
            flexShrink: 0,
          }}>
            {sku}
          </span>
          
          {/* タイトル（クリックで展開） */}
          {!isExpanded && (
            <span 
              onClick={handleToggleExpand}
              title="クリックで全文表示"
              style={{ 
                fontWeight: 600, 
                fontSize: '13px', 
                color: '#1e293b',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                flex: 1,
                minWidth: 0,
              }}
            >
              {displayTitle}
            </span>
          )}
        </div>
        
        {/* 右側: 言語切り替え + 展開ボタン + 閉じる */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* 展開/折りたたみボタン */}
          <button
            onClick={handleToggleExpand}
            title={isExpanded ? '折りたたむ' : '全文表示'}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '10px',
              background: isExpanded ? '#3b82f6' : '#f1f5f9',
              color: isExpanded ? '#ffffff' : '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <i className={`fas fa-${isExpanded ? 'compress-alt' : 'expand-alt'}`} style={{ fontSize: '10px' }}></i>
            {isExpanded ? '閉じる' : '全文'}
          </button>
          
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
      </div>
      
      {/* 🔥 展開時: フルタイトル表示 + コピーボタン */}
      {isExpanded && (
        <div style={{
          marginTop: '0.5rem',
          padding: '0.75rem',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
        }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: 600, 
            color: '#64748b', 
            marginBottom: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>📝 完全なタイトル ({language === 'ja' ? '日本語' : 'English'})</span>
            <button
              onClick={handleCopyTitle}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '10px',
                fontWeight: 600,
                background: copied ? '#10b981' : '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <i className={`fas fa-${copied ? 'check' : 'copy'}`}></i>
              {copied ? 'コピー済み' : 'コピー'}
            </button>
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#1e293b',
            lineHeight: '1.5',
            wordBreak: 'break-word',
            userSelect: 'text',
          }}>
            {displayTitle}
          </div>
          
          {/* 両言語表示 */}
          {language === 'ja' && ((product as any)?.english_title || (product as any)?.title_en) && (
            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #e2e8f0' }}>
              <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '0.25rem' }}>
                🌍 English Title
              </div>
              <div style={{
                fontSize: '12px',
                color: '#475569',
                lineHeight: '1.4',
                wordBreak: 'break-word',
                userSelect: 'text',
              }}>
                {(product as any)?.english_title || (product as any)?.title_en}
              </div>
            </div>
          )}
          
          {language === 'en' && product?.title && (
            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #e2e8f0' }}>
              <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '0.25rem' }}>
                🇯🇵 日本語タイトル
              </div>
              <div style={{
                fontSize: '12px',
                color: '#475569',
                lineHeight: '1.4',
                wordBreak: 'break-word',
                userSelect: 'text',
              }}>
                {product.title}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
});
