// app/tools/media-hub/docs/page.tsx
// N3 Empire OS - ドキュメント
'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, ExternalLink, Book } from 'lucide-react';

// コンポーネント
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid var(--panel-border)' }}>{title}</h2>
      <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text)' }}>{children}</div>
    </div>
  );
}

function Alert({ type, title, children }: { type: 'warning' | 'error' | 'info'; title: string; children: React.ReactNode }) {
  const colors = {
    warning: { bg: '#F59E0B20', border: '#F59E0B', icon: '⚠️' },
    error: { bg: '#EF444420', border: '#EF4444', icon: '🔴' },
    info: { bg: '#3B82F620', border: '#3B82F6', icon: 'ℹ️' },
  };
  const c = colors[type];
  return (
    <div style={{ padding: 16, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, marginBottom: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{c.icon} {title}</div>
      <div style={{ fontSize: 13 }}>{children}</div>
    </div>
  );
}

function Step({ num, label, color }: { num: number; label: string; color: string }) {
  return (
    <span style={{ padding: '8px 16px', background: color, color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
      ① {label}
    </span>
  );
}

function Arrow() {
  return <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>→</span>;
}

function PageRow({ path, status, desc }: { path: string; status: 'done' | 'soon'; desc: string }) {
  return (
    <tr>
      <td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>
        <Link href={path} style={{ color: '#3B82F6', textDecoration: 'none' }}>{path}</Link>
      </td>
      <td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>
        {status === 'done' ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10B981' }}><CheckCircle size={14} /> 実装済</span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E0B' }}><Clock size={14} /> Coming Soon</span>
        )}
      </td>
      <td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>{desc}</td>
    </tr>
  );
}

export default function DocsPage() {
  return (
    <div style={{ minHeight: '100vh', overflowY: 'auto', background: 'var(--background)', color: 'var(--text)' }}>
      {/* ヘッダー */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--panel-border)', position: 'sticky', top: 0, background: 'var(--background)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/tools/media-hub/empire" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>
            <ArrowLeft size={14} />Empire OS
          </Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Book size={20} style={{ color: '#F97316' }} />
              N3 Empire OS ドキュメント
            </h1>
          </div>
        </div>
      </div>
      
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        {/* 概要 */}
        <Section title="📋 概要">
          <p>N3 Empire OSは、YouTubeチャンネルの自動運用を目的としたメディア自動化システムです。</p>
          <h4>主な機能</h4>
          <ul>
            <li><strong>チャンネル管理</strong>: ブランドDNA / 声 / 演出 / セキュリティ設定</li>
            <li><strong>AI脚本生成</strong>: Gemini 1.5 Pro + Claude 3.5 Sonnet監査</li>
            <li><strong>Remotion動画生成</strong>: Spring物理演算 / 桜井スタイル注釈 / デジタル指紋</li>
            <li><strong>音声生成</strong>: ElevenLabs / OpenAI / Google TTS（収益ランク別コストルーティング）</li>
            <li><strong>マルチ展開</strong>: YouTube / ブログ / 電子書籍 / SNS</li>
          </ul>
        </Section>
        
        {/* クイックスタート */}
        <Section title="🚀 クイックスタート">
          <Alert type="warning" title="DBスキーマ適用（必須・最初に実行）">
            <p>Supabase SQL Editorで以下のファイル内容を実行してください：</p>
            <code style={{ display: 'block', padding: 12, background: '#1e293b', borderRadius: 6, marginTop: 8, fontSize: 11 }}>
              02_DEV_LAB/supabase/migrations/20260128_empire_os_media_complete.sql
            </code>
            <p style={{ marginTop: 8 }}>確認方法: <code style={{ background: '#1e293b', padding: '2px 6px', borderRadius: 4 }}>SELECT * FROM media_channels LIMIT 1;</code></p>
          </Alert>
          
          <h4>操作フロー</h4>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', padding: 16, background: 'var(--panel)', borderRadius: 8 }}>
            <span style={{ padding: '8px 16px', background: '#EC4899', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>① チャンネル作成</span>
            <Arrow />
            <span style={{ padding: '8px 16px', background: '#8B5CF6', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>② コンテンツ登録</span>
            <Arrow />
            <span style={{ padding: '8px 16px', background: '#3B82F6', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>③ 脚本生成</span>
            <Arrow />
            <span style={{ padding: '8px 16px', background: '#10B981', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>④ 動画レンダリング</span>
            <Arrow />
            <span style={{ padding: '8px 16px', background: '#F59E0B', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>⑤ YouTube投稿</span>
          </div>
        </Section>
        
        {/* ページ構成 */}
        <Section title="📂 ページ構成">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--panel)' }}>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid var(--panel-border)' }}>パス</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid var(--panel-border)' }}>状態</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid var(--panel-border)' }}>説明</th>
              </tr>
            </thead>
            <tbody>
              <PageRow path="/tools/media-hub" status="done" desc="Media Hub メインページ" />
              <PageRow path="/tools/media-hub/empire" status="done" desc="Empire OS ダッシュボード" />
              <PageRow path="/tools/media-hub/channels" status="done" desc="チャンネル管理" />
              <PageRow path="/tools/media-hub/video-generator" status="done" desc="Remotion動画生成" />
              <PageRow path="/tools/media-hub/contents" status="soon" desc="コンテンツ管理（Phase2）" />
              <PageRow path="/tools/media-hub/assets" status="soon" desc="アセットライブラリ（Phase2）" />
              <PageRow path="/tools/media-hub/voice" status="soon" desc="音声生成（Phase2）" />
              <PageRow path="/tools/media-hub/blog" status="soon" desc="ブログ自動生成（Phase3）" />
              <PageRow path="/tools/media-hub/ebook" status="soon" desc="電子書籍生成（Phase3）" />
              <PageRow path="/tools/media-hub/lms" status="soon" desc="LMS学習管理（Phase3）" />
            </tbody>
          </table>
        </Section>
        
        {/* チャンネル設定 */}
        <Section title="📺 チャンネル設定">
          <h4>ブランドDNA</h4>
          <ul>
            <li>プライマリ/セカンダリ/アクセントカラー</li>
            <li>フォントファミリー</li>
            <li>ウォーターマーク位置・透明度</li>
          </ul>
          
          <h4>声設定</h4>
          <ul>
            <li>プロバイダー: ElevenLabs / OpenAI / Google TTS</li>
            <li>安定性 (0.0-1.0)</li>
            <li>類似度 (0.0-1.0)</li>
          </ul>
          
          <h4>収益ランク別コストルーティング</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
            <thead>
              <tr style={{ background: 'var(--panel)' }}>
                <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid var(--panel-border)' }}>ランク</th>
                <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid var(--panel-border)' }}>月間収益</th>
                <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid var(--panel-border)' }}>音声プロバイダー</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}><span style={{ padding: '2px 8px', background: '#FFD700', color: '#000', borderRadius: 4, fontWeight: 700 }}>S</span></td><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>$5,000+</td><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>ElevenLabs（高品質）</td></tr>
              <tr><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}><span style={{ padding: '2px 8px', background: '#C0C0C0', color: '#000', borderRadius: 4, fontWeight: 700 }}>A</span></td><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>$1,000+</td><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>ElevenLabs（標準）</td></tr>
              <tr><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}><span style={{ padding: '2px 8px', background: '#CD7F32', color: '#fff', borderRadius: 4, fontWeight: 700 }}>B</span></td><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>$100+</td><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>OpenAI TTS</td></tr>
              <tr><td style={{ padding: 8 }}><span style={{ padding: '2px 8px', background: '#6B7280', color: '#fff', borderRadius: 4, fontWeight: 700 }}>C</span></td><td style={{ padding: 8 }}>それ以下</td><td style={{ padding: 8 }}>Google TTS（低コスト）</td></tr>
            </tbody>
          </table>
        </Section>
        
        {/* Remotion */}
        <Section title="🎥 Remotionコンポーネント">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--panel)' }}>
                <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid var(--panel-border)' }}>ファイル</th>
                <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid var(--panel-border)' }}>説明</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}><code>SakuraiAnnotation.tsx</code></td><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>桜井スタイル注釈（矢印/丸/ハイライト等）</td></tr>
              <tr><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}><code>RichBackground.tsx</code></td><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>リッチ背景（Ken Burns/パーティクル）</td></tr>
              <tr><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}><code>DynamicTelop.tsx</code></td><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>動的テロップ（Spring物理演算）</td></tr>
              <tr><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}><code>AnimatedCharacter.tsx</code></td><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>アニメキャラ（瞬き/呼吸/口パク）</td></tr>
              <tr><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}><code>AudioLayer.tsx</code></td><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>オーディオ（BGM/ナレーション/SE）</td></tr>
              <tr><td style={{ padding: 8 }}><code>DigitalFingerprint.tsx</code></td><td style={{ padding: 8 }}>デジタル指紋（BAN回避）</td></tr>
            </tbody>
          </table>
        </Section>
        
        {/* n8n連携 */}
        <Section title="🔧 n8n連携">
          <h4>Webhook一覧</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--panel)' }}>
                <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid var(--panel-border)' }}>エンドポイント</th>
                <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid var(--panel-border)' }}>説明</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}><code>/webhook/script-generate</code></td><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>AI脚本生成</td></tr>
              <tr><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}><code>/webhook/voice-generate</code></td><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>音声生成（コストルーティング）</td></tr>
              <tr><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}><code>/webhook/video-generate-v6</code></td><td style={{ padding: 8, borderBottom: '1px solid var(--panel-border)' }}>Remotion動画レンダリング</td></tr>
              <tr><td style={{ padding: 8 }}><code>/webhook/youtube-publish</code></td><td style={{ padding: 8 }}>YouTube投稿</td></tr>
            </tbody>
          </table>
          
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <a href="http://160.16.120.186:5678" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#FF6D5A', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              <ExternalLink size={16} />n8nダッシュボードを開く
            </a>
          </div>
        </Section>
        
        {/* DBテーブル */}
        <Section title="🗂️ DBテーブル一覧">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {[
              { name: 'media_channels', desc: 'チャンネル管理' },
              { name: 'content_master', desc: 'コンテンツマスター' },
              { name: 'mj_assets', desc: 'Midjourneyアセット' },
              { name: 'youtube_oauth_tokens', desc: 'YouTube認証' },
              { name: 'voice_presets', desc: '音声プリセット' },
              { name: 'visual_annotations', desc: '視覚注釈' },
              { name: 'content_scripts', desc: '脚本データ' },
              { name: 'render_queue', desc: 'レンダリングキュー' },
              { name: 'media_assets', desc: 'メディアアセット' },
              { name: 'lms_atomic_data', desc: 'LMS原子データ' },
              { name: 'lms_user_progress', desc: '学習進捗' },
              { name: 'blog_posts', desc: 'ブログ投稿' },
              { name: 'ebook_chapters', desc: '電子書籍チャプター' },
              { name: 'cost_routing_config', desc: 'コストルーティング設定' },
            ].map(t => (
              <div key={t.name} style={{ padding: 8, background: 'var(--panel)', borderRadius: 6, fontSize: 12 }}>
                <code style={{ color: '#EC4899' }}>{t.name}</code>
                <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>
        
        {/* トラブルシューティング */}
        <Section title="🔴 トラブルシューティング">
          <Alert type="error" title='DBエラー: column "status" does not exist'>
            <p><strong>原因</strong>: DBスキーマが適用されていない</p>
            <p><strong>対処法</strong>:</p>
            <ol>
              <li>Supabase SQL Editorを開く</li>
              <li><code>02_DEV_LAB/supabase/migrations/20260128_empire_os_media_complete.sql</code> の内容を実行</li>
              <li><code>SELECT * FROM media_channels LIMIT 1;</code> で確認</li>
            </ol>
          </Alert>
          
          <Alert type="info" title="n8n接続エラー">
            <p><strong>確認項目</strong>:</p>
            <ol>
              <li>VPS (160.16.120.186) が起動しているか</li>
              <li>n8n (ポート5678) が稼働しているか</li>
              <li>ファイアウォールで5678番ポートが開いているか</li>
            </ol>
            <code style={{ display: 'block', padding: 8, background: '#1e293b', borderRadius: 4, marginTop: 8, fontSize: 11 }}>
              pm2 status<br />
              pm2 logs n8n
            </code>
          </Alert>
        </Section>
        
        {/* 次のステップ */}
        <Section title="📝 次のステップ">
          <ol style={{ lineHeight: 2.5 }}>
            <li><strong>DBスキーマ適用</strong> → Supabase SQL Editorで実行</li>
            <li><strong>API動作確認</strong> → <code>/api/media/channels</code> をテスト</li>
            <li><strong>チャンネル作成</strong> → <Link href="/tools/media-hub/channels" style={{ color: '#EC4899' }}>/tools/media-hub/channels</Link> で最初のチャンネルを作成</li>
            <li><strong>n8nワークフローインポート</strong> → VPSでワークフローを有効化</li>
            <li><strong>動画生成テスト</strong> → 手動で1本の動画を完成させる</li>
          </ol>
        </Section>
        
        {/* クイックリンク */}
        <Section title="🔗 クイックリンク">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link href="/tools/media-hub/empire" style={{ padding: '12px 20px', background: '#EC4899', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              👑 Empire OS
            </Link>
            <Link href="/tools/media-hub/channels" style={{ padding: '12px 20px', background: '#8B5CF6', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              📺 チャンネル管理
            </Link>
            <Link href="/tools/media-hub/video-generator" style={{ padding: '12px 20px', background: '#3B82F6', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              🎥 動画生成
            </Link>
            <a href="http://160.16.120.186:5678" target="_blank" rel="noopener noreferrer" style={{ padding: '12px 20px', background: '#FF6D5A', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              ⚙️ n8n
            </a>
          </div>
        </Section>
        
        <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 12 }}>
          最終更新: 2026-01-28
        </div>
      </div>
    </div>
  );
}
