// components/n3/n3-listing-button.tsx
/**
 * N3ListingButton - 出品予約ボタン（n8n連携付き）
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';

interface N3ListingButtonProps {
  selectedCount?: number;
  onSubmit?: () => void;
  className?: string;
}

export function N3ListingButton({ 
  selectedCount = 0, 
  onSubmit,
  className = '' 
}: N3ListingButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEnabled = selectedCount > 0;

  const handleClick = async () => {
    if (!isEnabled || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // n8nプロキシ経由で送信
      const response = await fetch('/api/n8n-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: 'PRODUCT-001',
          title: 'テスト商品',
          price: 542,
          stock: selectedCount,
          count: selectedCount
        })
      });
      
      const result = await response.json();
      console.log('✅ 出品送信完了:', result);
      
      // 成功通知
      if (typeof window !== 'undefined') {
        alert(`✅ ${selectedCount}件の商品を出品予約しました！\nChatWorkを確認してください。`);
      }
      
      // 親コンポーネントのコールバック
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error('❌ 出品エラー:', error);
      alert('出品エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isEnabled || isSubmitting}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        fontSize: '12px',
        fontWeight: 600,
        background: isEnabled 
          ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
          : '#444',
        color: isEnabled ? 'white' : '#888',
        border: 'none',
        borderRadius: '6px',
        cursor: isEnabled ? 'pointer' : 'not-allowed',
        opacity: isEnabled ? 1 : 0.5,
        transition: 'all 0.2s',
        boxShadow: isEnabled ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
      }}
    >
      <Upload size={14} />
      <span>
        {isSubmitting 
          ? '送信中...' 
          : `出品予約${selectedCount > 0 ? ` (${selectedCount})` : ''}`
        }
      </span>
    </button>
  );
}

// グローバルに使用できる関数
export function initializeListingButton() {
  if (typeof window === 'undefined') return;
  
  // 既存のボタンを置き換え
  const replaceButton = () => {
    const buttons = document.querySelectorAll('button');
    const oldButton = Array.from(buttons).find(btn => 
      btn.textContent?.includes('出品予約')
    );
    
    if (oldButton && !oldButton.hasAttribute('data-n3-listing')) {
      // カウント取得
      const getCount = () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        return checkboxes.length;
      };
      
      // 新しいボタンを作成
      const newButton = document.createElement('button');
      newButton.setAttribute('data-n3-listing', 'true');
      newButton.style.cssText = `
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        font-size: 12px;
        font-weight: 600;
        border: none;
        border-radius: 6px;
        transition: all 0.2s;
      `;
      
      const updateButton = () => {
        const count = getCount();
        const isEnabled = count > 0;
        
        newButton.disabled = !isEnabled;
        newButton.style.background = isEnabled 
          ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
          : '#444';
        newButton.style.color = isEnabled ? 'white' : '#888';
        newButton.style.cursor = isEnabled ? 'pointer' : 'not-allowed';
        newButton.style.opacity = isEnabled ? '1' : '0.5';
        newButton.style.boxShadow = isEnabled ? '0 2px 4px rgba(0,0,0,0.2)' : 'none';
        
        newButton.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <span>出品予約${count > 0 ? ` (${count})` : ''}</span>
        `;
      };
      
      // クリックイベント
      newButton.onclick = async () => {
        const count = getCount();
        if (count === 0) return;
        
        newButton.disabled = true;
        newButton.querySelector('span')!.textContent = '送信中...';
        
        try {
          const response = await fetch('/api/n8n-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sku: 'PRODUCT-001',
              title: 'テスト商品',
              price: 542,
              stock: count
            })
          });
          
          const result = await response.json();
          console.log('✅ 出品送信:', result);
          alert(`✅ ${count}件の商品を出品予約しました！`);
        } catch (error) {
          console.error('❌ エラー:', error);
          alert('出品エラーが発生しました');
        } finally {
          updateButton();
        }
      };
      
      // チェックボックスの変更を監視
      document.addEventListener('change', (e) => {
        if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
          updateButton();
        }
      });
      
      // 初期化
      updateButton();
      
      // 古いボタンを置き換え
      oldButton.parentNode?.replaceChild(newButton, oldButton);
      
      console.log('✅ 出品予約ボタンを有効化しました');
    }
  };
  
  // 定期的にチェック
  replaceButton();
  setTimeout(replaceButton, 1000);
  setTimeout(replaceButton, 2000);
  setTimeout(replaceButton, 3000);
}

// 自動初期化
if (typeof window !== 'undefined') {
  window.addEventListener('load', initializeListingButton);
  // 動的コンテンツ用に遅延実行も追加
  setTimeout(initializeListingButton, 2000);
}

export default N3ListingButton;
