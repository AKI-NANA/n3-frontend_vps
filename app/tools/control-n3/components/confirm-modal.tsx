// app/tools/control-n3/components/confirm-modal.tsx
/**
 * 🔒 Phase H-5: Confirm Modal Component
 * 
 * 二重確認モーダル
 * - 危険操作は「Type: XXX to confirm」形式で確認
 * - 入力一致で初めて実行可能
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
  metadata?: Record<string, any>;
}

const COLORS = {
  danger: { bg: '#EF4444', text: '#FEE2E2', border: 'rgba(239,68,68,0.5)' },
  warning: { bg: '#F59E0B', text: '#FEF3C7', border: 'rgba(245,158,11,0.5)' },
  info: { bg: '#3B82F6', text: '#DBEAFE', border: 'rgba(59,130,246,0.5)' },
};

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  variant = 'danger',
  metadata,
}: ConfirmModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [isMatched, setIsMatched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const color = COLORS[variant];
  
  // 入力チェック
  useEffect(() => {
    setIsMatched(inputValue.toUpperCase() === confirmText.toUpperCase());
  }, [inputValue, confirmText]);
  
  // モーダル開いたら入力フォーカス
  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);
  
  // ESCキーでキャンセル
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter' && isMatched) onConfirm();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isMatched, onConfirm, onCancel]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onCancel}
    >
      <div 
        style={{
          width: 480,
          background: '#1E293B',
          borderRadius: 16,
          border: `2px solid ${color.border}`,
          overflow: 'hidden',
          boxShadow: `0 0 40px ${color.bg}30`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: `${color.bg}20`,
          borderBottom: `1px solid ${color.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: color.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {variant === 'danger' ? <ShieldAlert size={22} color="white" /> : <AlertTriangle size={22} color="white" />}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'white' }}>{title}</h3>
          </div>
          <button 
            onClick={onCancel}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Body */}
        <div style={{ padding: 24 }}>
          <p style={{ 
            fontSize: 15, 
            color: 'rgba(255,255,255,0.8)', 
            lineHeight: 1.6,
            marginBottom: 24,
          }}>
            {message}
          </p>
          
          {/* Metadata表示 */}
          {metadata && Object.keys(metadata).length > 0 && (
            <div style={{
              padding: 12,
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 8,
              marginBottom: 24,
            }}>
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: 13,
                  padding: '4px 0',
                }}>
                  <span style={{ opacity: 0.6 }}>{key}:</span>
                  <span style={{ fontWeight: 500 }}>{String(value)}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* 確認入力 */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ 
              display: 'block', 
              fontSize: 13, 
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 8,
            }}>
              Type <span style={{ 
                fontWeight: 700, 
                color: color.bg,
                padding: '2px 8px',
                background: `${color.bg}20`,
                borderRadius: 4,
              }}>{confirmText}</span> to confirm
            </label>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmText}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 8,
                border: `2px solid ${isMatched ? '#10B981' : 'rgba(255,255,255,0.2)'}`,
                background: 'rgba(0,0,0,0.3)',
                color: 'white',
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: 2,
                textAlign: 'center',
                textTransform: 'uppercase',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
            {isMatched && (
              <div style={{
                marginTop: 8,
                fontSize: 12,
                color: '#10B981',
                textAlign: 'center',
              }}>
                ✓ Confirmation matched. Press Enter or click Confirm.
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!isMatched}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: 8,
                border: 'none',
                background: isMatched ? color.bg : 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                cursor: isMatched ? 'pointer' : 'not-allowed',
                opacity: isMatched ? 1 : 0.5,
                transition: 'all 0.2s',
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
