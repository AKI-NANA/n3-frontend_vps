// app/tools/media-hub/assets/page.tsx
// N3 Empire OS - アセットライブラリ（Phase2実装予定）
'use client';

import Link from 'next/link';
import { ArrowLeft, Image, Clock } from 'lucide-react';

export default function AssetsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--text)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <Link href="/tools/media-hub/empire" style={{ position: 'absolute', top: 20, left: 20, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>
        <ArrowLeft size={14} />Empire OS
      </Link>
      
      <div style={{ width: 80, height: 80, borderRadius: 20, background: '#10B98120', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <Image size={40} style={{ color: '#10B981' }} />
      </div>
      
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px 0', color: '#10B981' }}>🎨 アセットライブラリ</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <Clock size={16} style={{ color: '#F59E0B' }} />
        <span style={{ fontSize: 14, color: '#F59E0B', fontWeight: 600 }}>Phase 2 で実装予定</span>
      </div>
      
      <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 400, lineHeight: 1.8 }}>
        このページでは以下の機能を提供します：
      </p>
      
      <ul style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 2, marginTop: 16 }}>
        <li>🖼️ Midjourneyキャラクター管理（喜怒哀楽×角度）</li>
        <li>🎵 BGM / SE ライブラリ</li>
        <li>🏞️ 背景画像・動画管理</li>
        <li>📋 一括生成リクエスト</li>
      </ul>
      
      <div style={{ marginTop: 32 }}>
        <Link href="/tools/media-hub/empire" style={{ padding: '12px 24px', background: 'var(--panel)', border: '1px solid var(--panel-border)', color: 'var(--text)', borderRadius: 8, textDecoration: 'none' }}>
          ダッシュボードへ戻る
        </Link>
      </div>
    </div>
  );
}
