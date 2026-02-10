// app/tools/editing-n3/components/submit-button.tsx
/**
 * 出品予約ボタンコンポーネント
 * n8n連携機能付き
 */

'use client';

import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface SubmitButtonProps {
  selectedCount: number;
  selectedItems: any[];
  onSubmit?: (items: any[]) => Promise<void>;
}

export function SubmitButton({ selectedCount, selectedItems, onSubmit }: SubmitButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEnabled = selectedCount > 0;
  
  const handleClick = async () => {
    if (!isEnabled || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // n8nプロキシ経由で送信
      for (const item of selectedItems) {
        const response = await fetch('/api/n8n-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sku: item.sku || item.product_id,
            title: item.title || item.product_name,
            price: item.price || item.selling_price,
            stock: item.stock || 1,
            description: item.description,
            main_image_url: item.image_url
          })
        });
        
        const result = await response.json();
        console.log('✅ 出品送信:', result);
      }
      
      alert(`${selectedCount}件の商品を出品予約しました！`);
      
      if (onSubmit) {
        await onSubmit(selectedItems);
      }
    } catch (error) {
      console.error('出品エラー:', error);
      alert('出品エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={!isEnabled || isSubmitting}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        fontSize: '12px',
        fontWeight: 600,
        background: isEnabled 
          ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
          : 'var(--panel-border)',
        color: isEnabled ? 'white' : 'var(--text-muted)',
        border: 'none',
        borderRadius: '6px',
        cursor: isEnabled ? 'pointer' : 'not-allowed',
        opacity: isSubmitting ? 0.7 : 1,
        transition: 'all 0.2s',
        boxShadow: isEnabled ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      <Upload size={14} />
      <span>
        {isSubmitting ? '送信中...' : `出品予約 ${selectedCount > 0 ? `(${selectedCount})` : ''}`}
      </span>
    </button>
  );
}

export default SubmitButton;
