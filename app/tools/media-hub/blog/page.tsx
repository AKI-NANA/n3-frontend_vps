// app/tools/media-hub/blog/page.tsx
// N3 Empire OS - ブログ自動生成（Phase3実装予定）
'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Clock } from 'lucide-react';

export default function BlogPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--text)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <Link href="/tools/media-hub/empire" style={{ position: 'absolute', top: 20, left: 20, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>
        <ArrowLeft size={14} />Empire OS
      </Link>
      
      <div style={{ width: 80, height: 80, borderRadius: 20, background: '#06B6D420', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <FileText size={40} style={{ color: '#06B6D4' }} />
      </div>
      
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px 0', color: '#06B6D4' }}>📝 ブログ自動生成</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <Clock size={16} style={{ color: '#F59E0B' }} />
        <span style={{ fontSize: 14, color: '#F59E0B', fontWeight: 600 }}>Phase 3 で実装予定</span>
      </div>
      
      <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 400, lineHeight: 1.8 }}>
        このページでは以下の機能を提供します：
      </p>
      
      <ul style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 2, marginTop: 16 }}>
        <li>📄 動画脚本→SEO記事変換</li>
        <li>🖼️ アイキャッチ自動生成</li>
        <li>📰 WordPress / note / Medium 連携</li>
        <li>🔍 SEOキーワード最適化</li>
      </ul>
      
      <div style={{ marginTop: 32 }}>
        <Link href="/tools/media-hub/empire" style={{ padding: '12px 24px', background: 'var(--panel)', border: '1px solid var(--panel-border)', color: 'var(--text)', borderRadius: 8, textDecoration: 'none' }}>
          ダッシュボードへ戻る
        </Link>
      </div>
    </div>
  );
}
