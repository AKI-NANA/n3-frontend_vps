// app/tools/bookkeeping-n3/page.tsx
/**
 * N3 記帳オートメーション - メインページ
 * 
 * editing-n3と同じN3デザインシステムを使用
 * - N3CollapsibleHeader
 * - L2タブ（取引マッパー / ルール管理 / MF連携 / 履歴）
 * - L3フィルター
 */

'use client';

import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { 
  BookOpen, 
  FileText, 
  Link2, 
  History,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { N3FilterTab, N3Pagination, N3Footer, N3CollapsibleHeader, N3Divider } from '@/components/n3';
import { BookkeepingN3PageLayout } from './components/bookkeeping-n3-page-layout';

// ============================================================
// 無限ループ検知設定
// ============================================================

const LOOP_DETECTION = {
  MOUNT_THRESHOLD: 10,
  MOUNT_RESET_INTERVAL: 10000,
} as const;

let renderCount = 0;

// ============================================================
// メインコンポーネント
// ============================================================

export default function BookkeepingN3Page() {
  renderCount++;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[BookkeepingN3Page] RENDER #${renderCount}`);
  }
  
  const mountCountRef = useRef(0);
  const [blocked, setBlocked] = useState(false);
  
  useEffect(() => {
    mountCountRef.current++;
    
    if (mountCountRef.current > LOOP_DETECTION.MOUNT_THRESHOLD) {
      console.error('[BookkeepingN3Page] 🚨 無限ループ検知!');
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
  
  return <BookkeepingN3PageLayout />;
}
