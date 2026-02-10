// app/tools/media-hub/contents/page.tsx
// N3 Empire OS - コンテンツ管理（Phase2実装予定）
'use client';

import Link from 'next/link';
import { ArrowLeft, Film, Clock } from 'lucide-react';

export default function ContentsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--text)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <Link href="/tools/media-hub/empire" style={{ position: 'absolute', top: 20, left: 20, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>
        <ArrowLeft size={14} />Empire OS
      </Link>
      
      <div style={{ width: 80, height: 80, borderRadius: 20, background: '#8B5CF620', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <Film size={40} style={{ color: '#8B5CF6' }} />
      </div>
      
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px 0', color: '#8B5CF6' }}>🎬 コンテンツ管理</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <Clock size={16} style={{ color: '#F59E0B' }} />
        <span style={{ fontSize: 14, color: '#F59E0B', fontWeight: 600 }}>Phase 2 で実装予定</span>
      </div>
      
      <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 400, lineHeight: 1.8 }}>
        このページでは以下の機能を提供します：
      </p>
      
      <ul style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 2, marginTop: 16 }}>
        <li>📝 AI脚本自動生成（Gemini + Claude監査）</li>
        <li>🎬 コンテンツ一覧・管理</li>
        <li>🔄 レンダリングキュー管理</li>
        <li>📤 投稿スケジュール設定</li>
      </ul>
      
      <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
        <Link href="/tools/media-hub/channels" style={{ padding: '12px 24px', background: '#EC4899', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
          チャンネル管理へ
        </Link>
        <Link href="/tools/media-hub/empire" style={{ padding: '12px 24px', background: 'var(--panel)', border: '1px solid var(--panel-border)', color: 'var(--text)', borderRadius: 8, textDecoration: 'none' }}>
          ダッシュボードへ戻る
        </Link>
      </div>
    </div>
  );
}
