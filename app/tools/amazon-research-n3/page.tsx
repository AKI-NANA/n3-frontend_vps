// app/tools/amazon-research-n3/page.tsx
/**
 * Amazon Research N3 - メインページ
 * 
 * v3.0 - workspace統一アーキテクチャ
 * 
 * 設計:
 * - editing-n3と同じN3CollapsibleHeader構造
 * - L2タブ（リサーチ / 自動化 / 設定）
 * - L3フィルター
 * - 詳細パネル/モーダル対応
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { AmazonResearchN3PageLayout } from './components/amazon-research-n3-page-layout';

// ============================================================
// 無限ループ検知設定
// ============================================================

const LOOP_DETECTION = {
  MOUNT_THRESHOLD: 10,
  MOUNT_RESET_INTERVAL: 10000,
} as const;

let renderCount = 0;

export default function AmazonResearchN3Page() {
  renderCount++;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AmazonResearchN3Page] RENDER #${renderCount}`);
  }
  
  const mountCountRef = useRef(0);
  const [blocked, setBlocked] = useState(false);
  
  useEffect(() => {
    mountCountRef.current++;
    
    if (mountCountRef.current > LOOP_DETECTION.MOUNT_THRESHOLD) {
      console.error('[AmazonResearchN3Page] 🚨 無限ループ検知!');
      setBlocked(true);
      return;
    }
    
    const timer = setTimeout(() => {
      mountCountRef.current = 0;
    }, LOOP_DETECTION.MOUNT_RESET_INTERVAL);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (blocked) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        background: 'var(--bg)',
        color: 'var(--text)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '1.5rem' }}>
          ⚠️ 無限ループ検知
        </h1>
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
          ブラウザのDevTools → Consoleでログを確認してください。
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          リロード
        </button>
      </div>
    );
  }
  
  return <AmazonResearchN3PageLayout />;
}
