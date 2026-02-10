// app/tools/editing-n3/page.tsx
/**
 * Editing N3 Page - N3デザインシステム版エントリーポイント
 * 
 * ⚠️ P0タスク: 無限ループ停止ガード実装
 * 
 * 設計原則:
 * - Hooks層（ビジネスロジック）: tools/editing からそのまま参照
 * - Services層（API通信）: tools/editing からそのまま参照
 * - Types層（型定義）: tools/editing からそのまま参照
 * - UI層（コンポーネント）: N3コンポーネントで再構築
 * 
 * 無限ループ対策（P0）:
 * - mountCountRef: マウント回数を物理的にカウント
 * - 閾値超過時は即座にレンダリングを停止
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { EditingN3PageLayout } from './components/layouts/editing-n3-page-layout';

// ============================================================
// 無限ループ検知設定
// ============================================================
const LOOP_DETECTION = {
  // マウント回数の閾値（10秒以内）
  MOUNT_THRESHOLD: 10,
  // マウントカウントリセット間隔（ms）
  MOUNT_RESET_INTERVAL: 10000,
} as const;

// レンダーカウント（デバッグ用）
let renderCount = 0;

export default function EditingN3Page() {
  // デバッグ: レンダー回数をカウント（開発環境のみ）
  renderCount++;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[EditingN3Page] RENDER #${renderCount} at ${new Date().toISOString().substring(11, 23)}`);
  }
  
  // 無限ループ検知用
  const mountCountRef = useRef(0);
  const [blocked, setBlocked] = useState(false);
  
  useEffect(() => {
    mountCountRef.current++;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[EditingN3Page] MOUNT #${mountCountRef.current}`);
    }
    
    // 10秒以内に10回以上マウントされたら無限ループと判断
    if (mountCountRef.current > LOOP_DETECTION.MOUNT_THRESHOLD) {
      console.error('[EditingN3Page] 🚨 無限ループ検知! レンダリング停止');
      setBlocked(true);
      return;
    }
    
    // 10秒後にカウントリセット
    const timer = setTimeout(() => {
      mountCountRef.current = 0;
    }, LOOP_DETECTION.MOUNT_RESET_INTERVAL);
    
    return () => {
      clearTimeout(timer);
      if (process.env.NODE_ENV === 'development') {
        console.log(`[EditingN3Page] UNMOUNT`);
      }
    };
  }, []);
  
  if (blocked) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        background: '#0a0a0a',
        color: 'white',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{ color: '#ff4444', marginBottom: '1rem', fontSize: '1.5rem' }}>
          ⚠️ 無限ループ検知
        </h1>
        <p style={{ marginBottom: '1rem', color: '#ccc' }}>
          マウント回数: {mountCountRef.current}回 / 10秒
        </p>
        <p style={{ marginBottom: '2rem', color: '#888', fontSize: '0.875rem' }}>
          ブラウザのDevTools → Consoleでログを確認してください。
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            🔄 リロード
          </button>
          <button 
            onClick={() => {
              try {
                localStorage.removeItem('product-ui-store');
                localStorage.removeItem('product-domain-store');
              } catch (e) {
                console.warn('localStorage clear failed:', e);
              }
              window.location.reload();
            }}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#444',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            🧹 キャッシュクリア&リロード
          </button>
        </div>
      </div>
    );
  }
  
  return <EditingN3PageLayout />;
}
