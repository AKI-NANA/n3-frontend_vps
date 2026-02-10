'use client';

// ModalFooter - V8.4 - 最適化版
// デザインシステムV4準拠、コンパクトフッター
// MODAL_BAR_04_ACTIONS - 操作実行バー

import { memo } from 'react';

export interface ModalFooterProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onSave?: () => void;
  onClose?: () => void;
}

export const ModalFooter = memo(function ModalFooter({ currentTab, onTabChange, onSave, onClose }: ModalFooterProps) {
  const tabs = ['overview', 'data', 'images', 'tools', 'mirror', 'competitors', 'pricing', 'listing', 'shipping', 'tax', 'html', 'final'];
  const currentIndex = tabs.indexOf(currentTab);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === tabs.length - 1;

  const handlePrev = () => {
    if (currentIndex > 0) onTabChange(tabs[currentIndex - 1]);
  };

  const handleNext = () => {
    if (currentIndex < tabs.length - 1) onTabChange(tabs[currentIndex + 1]);
  };

  return (
    <footer style={{
      background: '#f1f5f9',
      borderTop: '1px solid #e2e8f0',
      padding: '0.5rem 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0,
    }}>
      {/* 左側: 更新日時 */}
      <div style={{ fontSize: '10px', color: '#94a3b8' }}>
        <i className="fas fa-clock" style={{ marginRight: '0.25rem' }}></i>
        Last updated: {new Date().toLocaleDateString('ja-JP')}
      </div>
      
      {/* 右側: ナビゲーション + 保存 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {!isFirst && (
          <button
            onClick={handlePrev}
            style={{
              padding: '0.375rem 0.75rem',
              fontSize: '11px',
              fontWeight: 500,
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <i className="fas fa-chevron-left"></i> Prev
          </button>
        )}
        
        {!isLast && (
          <button
            onClick={handleNext}
            style={{
              padding: '0.375rem 0.75rem',
              fontSize: '11px',
              fontWeight: 500,
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            Next <i className="fas fa-chevron-right"></i>
          </button>
        )}
        
        <button
          onClick={onClose}
          style={{
            padding: '0.375rem 0.75rem',
            fontSize: '11px',
            fontWeight: 500,
            borderRadius: '4px',
            border: 'none',
            background: 'transparent',
            color: '#64748b',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        
        {onSave && (
          <button
            onClick={() => {
              console.log('💾 [ModalFooter] Save button clicked');
              onSave();
              // 保存後、少し待ってから閉じる
              setTimeout(() => {
                onClose?.();
              }, 500);
            }}
            style={{
              padding: '0.375rem 0.75rem',
              fontSize: '11px',
              fontWeight: 500,
              borderRadius: '4px',
              border: 'none',
              background: '#1e293b',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <i className="fas fa-save"></i> Save
          </button>
        )}
      </div>
    </footer>
  );
});
