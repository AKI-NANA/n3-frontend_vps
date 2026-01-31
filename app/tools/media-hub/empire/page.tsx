// app/tools/media-hub/empire/page.tsx
// N3 Empire OS - 統合ダッシュボード
// Phase 2-3: Render Test Button + n8n Connection Test
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Tv, Film, Mic, FileText, Youtube, Newspaper,
  Book, BarChart3, RefreshCw, Play, Settings, Sparkles,
  Shield, Zap, TrendingUp, Users, DollarSign, Clock, AlertCircle,
  CheckCircle, Loader2, Send, Database
} from 'lucide-react';

// 実装済みモジュール
const IMPLEMENTED_MODULES = ['channels', 'video-generator'];

export default function EmpireDashboardPage() {
  const [stats, setStats] = useState({
    totalChannels: 0,
    activeChannels: 0,
    totalContents: 0,
    pendingRender: 0,
    publishedToday: 0,
    totalViews: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  
  // Phase2-3: Render Test State
  const [renderLoading, setRenderLoading] = useState(false);
  const [renderResult, setRenderResult] = useState<any>(null);
  const [renderQueue, setRenderQueue] = useState<any[]>([]);
  
  useEffect(() => { 
    loadStats(); 
    loadRenderQueue();
  }, []);
  
  const loadStats = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const channelsRes = await fetch('/api/media/channels');
      const channelsData = await channelsRes.json();
      
      if (channelsData.error) {
        setDbError(channelsData.error);
        return;
      }
      
      const channels = channelsData.channels || [];
      
      setStats({
        totalChannels: channels.length,
        activeChannels: channels.filter((c: any) => c.status === 'active').length,
        totalContents: 0,
        pendingRender: 0,
        publishedToday: 0,
        totalViews: channels.reduce((sum: number, c: any) => sum + (c.subscriber_count || 0), 0),
        totalRevenue: channels.reduce((sum: number, c: any) => sum + (c.monthly_revenue_usd || 0), 0),
      });
    } catch (error) {
      console.error('統計読み込みエラー:', error);
      setDbError('APIエラー: ' + String(error));
    } finally {
      setLoading(false);
    }
  };
  
  // Phase2-3: Load Render Queue
  const loadRenderQueue = async () => {
    try {
      const res = await fetch('/api/render/start?limit=5');
      const data = await res.json();
      if (data.success) {
        setRenderQueue(data.queue || []);
      }
    } catch (error) {
      console.error('Render Queue Error:', error);
    }
  };
  
  // Phase2-3: Test Render
  const handleTestRender = async () => {
    setRenderLoading(true);
    setRenderResult(null);
    
    try {
      const res = await fetch('/api/render/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_id: 'demo_channel',
          content_id: 'test_content_' + Date.now(),
          options: {
            composition: 'ShortVideo',
            quality: 'preview'
          }
        })
      });
      
      const data = await res.json();
      setRenderResult(data);
      
      // キュー再読み込み
      loadRenderQueue();
      
    } catch (error: any) {
      setRenderResult({ success: false, error: error.message });
    } finally {
      setRenderLoading(false);
    }
  };
  
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };
  
  const modules = [
    { id: 'channels', title: '📺 チャンネル管理', description: 'ブランドDNA / 声 / 演出 / セキュリティ設定', href: '/tools/media-hub/channels', color: '#EC4899', stats: `${stats.activeChannels} 稼働中`, features: ['収益ランク別コスト最適化', 'デジタル指紋設定', 'プロキシ/BAN回避'], help: 'チャンネルの基本設定を行います' },
    { id: 'contents', title: '🎬 コンテンツ管理', description: '脚本生成 / レンダリング / 投稿キュー', href: '/tools/media-hub/contents', color: '#8B5CF6', stats: 'Phase2実装予定', features: ['AI脚本自動生成', '3段階ファクトチェック', 'バッチレンダリング'], help: 'コンテンツの作成・管理を行います' },
    { id: 'video-generator', title: '🎥 Remotion動画生成', description: 'リッチアニメーション / 桜井スタイル注釈', href: '/tools/media-hub/video-generator', color: '#3B82F6', stats: 'Spring物理演算', features: ['Ken Burns効果', 'パーティクル', 'ElevenLabs同期テロップ'], help: 'Remotionで動画をレンダリングします' },
    { id: 'assets', title: '🎨 アセットライブラリ', description: 'MJキャラクター / BGM / SE / 背景', href: '/tools/media-hub/assets', color: '#10B981', stats: 'Phase2実装予定', features: ['Midjourney一括生成', '感情タグ管理', '著作権チェック'], help: '画像・音声素材を管理します' },
    { id: 'voice', title: '🎙️ 音声生成', description: 'ElevenLabs / OpenAI / Google TTS', href: '/tools/media-hub/voice', color: '#F59E0B', stats: 'Phase2実装予定', features: ['バイオモジュレーション', '感情パラメータ', '息継ぎ自動挿入'], help: 'AI音声を生成します' },
    { id: 'blog', title: '📝 ブログ自動生成', description: '動画→SEO記事変換 / WordPress連携', href: '/tools/media-hub/blog', color: '#06B6D4', stats: 'Phase3実装予定', features: ['話し言葉→書き言葉', 'アイキャッチ生成', 'note/Medium対応'], help: '動画からブログ記事を生成します' },
    { id: 'ebook', title: '📚 電子書籍生成', description: 'Vivliostyle / Amazon KDP連携', href: '/tools/media-hub/ebook', color: '#84CC16', stats: 'Phase3実装予定', features: ['CSS組版', '目次自動生成', '印刷用高画質'], help: 'コンテンツを電子書籍化します' },
    { id: 'lms', title: '🎓 LMS学習管理', description: '過去問データ / 弱点検出 / パラメトリック問題', href: '/tools/media-hub/lms', color: '#A855F7', stats: 'Phase3実装予定', features: ['正答率追跡', 'AI個人指導', '法改正追跡'], help: '学習コンテンツを管理します' },
  ];
  
  return (
    <>
      <style>{`
        html, body { overflow: auto !important; height: auto !important; }
        .empire-container { min-height: 100vh; overflow-y: scroll !important; }
      `}</style>
      <div className="empire-container" style={{ background: 'var(--background)', color: 'var(--text)', paddingBottom: 100 }}>
      {/* ヘッダー */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--panel-border)', background: 'linear-gradient(135deg, #EC489920 0%, #8B5CF620 50%, #3B82F620 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/tools/media-hub" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}><ArrowLeft size={14} />Media Hub</Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #EC4899, #8B5CF6, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>👑 N3 Empire OS</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>全自動マルチメディア帝国 - 1ソース→YouTube/ブログ/書籍/SNS同時展開</p>
          </div>
          <button onClick={loadStats} disabled={loading} style={{ padding: '8px 16px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} />更新</button>
        </div>
      </div>
      
      {/* DBエラー警告 */}
      {dbError && (
        <div style={{ margin: '24px 24px 0', padding: 16, background: '#EF444420', border: '1px solid #EF4444', borderRadius: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <AlertCircle size={18} style={{ color: '#EF4444' }} />
            <span style={{ fontWeight: 700, color: '#EF4444' }}>DBスキーマ未適用</span>
          </div>
          <p style={{ fontSize: 12, color: '#EF4444', margin: '0 0 8px 0' }}>{dbError}</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
            <strong>対処法:</strong> Supabase SQL Editorでスキーマを実行してください
          </p>
        </div>
      )}
      
      {/* ★★★ Phase 2-3: Render Test Panel ★★★ */}
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ padding: 20, background: 'linear-gradient(135deg, #10B98120, #3B82F620)', border: '2px solid #10B981', borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#10B981', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={20} />
                🧪 Phase 2-3: Render Pipeline Test
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                UI → API → DB保存 → n8n Webhook の接続テスト
              </p>
            </div>
            <button
              onClick={handleTestRender}
              disabled={renderLoading}
              style={{
                padding: '12px 24px',
                background: renderLoading ? '#6B7280' : '#10B981',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: renderLoading ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              {renderLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {renderLoading ? 'Sending...' : 'Test Render'}
            </button>
          </div>
          
          {/* Render Result */}
          {renderResult && (
            <div style={{
              padding: 12,
              background: renderResult.success ? '#10B98120' : '#EF444420',
              border: `1px solid ${renderResult.success ? '#10B981' : '#EF4444'}`,
              borderRadius: 8,
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {renderResult.success ? (
                  <CheckCircle size={16} style={{ color: '#10B981' }} />
                ) : (
                  <AlertCircle size={16} style={{ color: '#EF4444' }} />
                )}
                <span style={{ fontWeight: 600, color: renderResult.success ? '#10B981' : '#EF4444' }}>
                  {renderResult.success ? '✅ Success' : '❌ Error'}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {renderResult.render_id && <div><strong>Render ID:</strong> {renderResult.render_id}</div>}
                {renderResult.message && <div><strong>Message:</strong> {renderResult.message}</div>}
                {renderResult.n8n_sent !== undefined && (
                  <div>
                    <strong>n8n送信:</strong> {renderResult.n8n_sent ? '✅ 成功' : `❌ 失敗 (${renderResult.n8n_error})`}
                  </div>
                )}
                {renderResult.execution_time_ms && <div><strong>実行時間:</strong> {renderResult.execution_time_ms}ms</div>}
                {renderResult.error && <div style={{ color: '#EF4444' }}><strong>Error:</strong> {renderResult.error}</div>}
              </div>
            </div>
          )}
          
          {/* Render Queue */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Database size={14} style={{ color: '#3B82F6' }} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>Render Queue (最新5件)</span>
              <button onClick={loadRenderQueue} style={{ padding: '2px 8px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}>
                <RefreshCw size={10} />
              </button>
            </div>
            {renderQueue.length === 0 ? (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: 8, background: 'var(--panel)', borderRadius: 6 }}>
                キューは空です。「Test Render」を押してテストしてください。
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {renderQueue.map((item, i) => (
                  <div key={i} style={{ 
                    display: 'flex', alignItems: 'center', gap: 12, 
                    padding: 8, background: 'var(--panel)', borderRadius: 6, fontSize: 11 
                  }}>
                    <span style={{ 
                      padding: '2px 6px', borderRadius: 4, fontWeight: 600,
                      background: item.status === 'queued' ? '#F59E0B20' : item.status === 'complete' ? '#10B98120' : '#EF444420',
                      color: item.status === 'queued' ? '#F59E0B' : item.status === 'complete' ? '#10B981' : '#EF4444'
                    }}>
                      {item.status}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{item.render_id}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>
                      {new Date(item.created_at).toLocaleTimeString('ja-JP')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 統計カード */}
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: '総チャンネル', value: stats.totalChannels, icon: Tv, color: '#EC4899' },
            { label: '稼働中', value: stats.activeChannels, icon: Zap, color: '#10B981' },
            { label: '総登録者', value: formatNumber(stats.totalViews), icon: Users, color: '#3B82F6' },
            { label: '月間収益', value: `$${formatNumber(stats.totalRevenue)}`, icon: DollarSign, color: '#F59E0B' },
          ].map((stat, i) => (
            <div key={i} style={{ padding: 20, background: 'var(--panel)', borderRadius: 12, border: '1px solid var(--panel-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}><stat.icon size={18} style={{ color: stat.color }} /><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.label}</span></div>
              <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{loading ? '...' : stat.value}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 操作フロー説明 */}
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ padding: 16, background: '#3B82F620', border: '1px solid #3B82F640', borderRadius: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px 0', color: '#3B82F6' }}>📋 基本操作フロー</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 12px', background: '#EC4899', color: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>① チャンネル作成</span>
            <span style={{ color: 'var(--text-muted)' }}>→</span>
            <span style={{ padding: '6px 12px', background: '#8B5CF6', color: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>② コンテンツ登録</span>
            <span style={{ color: 'var(--text-muted)' }}>→</span>
            <span style={{ padding: '6px 12px', background: '#3B82F6', color: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>③ 脚本生成</span>
            <span style={{ color: 'var(--text-muted)' }}>→</span>
            <span style={{ padding: '6px 12px', background: '#10B981', color: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>④ 動画レンダリング</span>
            <span style={{ color: 'var(--text-muted)' }}>→</span>
            <span style={{ padding: '6px 12px', background: '#F59E0B', color: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>⑤ YouTube投稿</span>
          </div>
        </div>
      </div>
      
      {/* モジュール一覧 */}
      <div style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Sparkles size={18} style={{ color: '#EC4899' }} />Empire OS モジュール</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {modules.map(mod => {
            const isImplemented = IMPLEMENTED_MODULES.includes(mod.id);
            
            return (
              <Link key={mod.id} href={mod.href} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  padding: 20, 
                  background: 'var(--panel)', 
                  borderRadius: 12, 
                  border: `2px solid ${isImplemented ? mod.color + '40' : 'var(--panel-border)'}`, 
                  transition: 'all 0.2s', 
                  cursor: 'pointer',
                  opacity: isImplemented ? 1 : 0.7,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${mod.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{mod.title.split(' ')[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{mod.title.split(' ').slice(1).join(' ')}</span>
                        {isImplemented ? (
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: `${mod.color}20`, color: mod.color, fontWeight: 600 }}>{mod.stats}</span>
                        ) : (
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#6B728020', color: '#6B7280', fontWeight: 600 }}>Coming Soon</span>
                        )}
                      </div>
                      <p style={{ fontSize: 11, color: '#3B82F6', margin: '0 0 4px 0', fontStyle: 'italic' }}>💡 {mod.help}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 12px 0' }}>{mod.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{mod.features.map((feat, i) => (<span key={i} style={{ fontSize: 10, padding: '3px 8px', background: 'var(--background)', borderRadius: 4, color: 'var(--text-muted)' }}>{feat}</span>))}</div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* アーキテクチャ図 */}
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ padding: 20, background: 'var(--panel)', borderRadius: 12, border: '1px solid var(--panel-border)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={16} style={{ color: '#10B981' }} />Empire OSアーキテクチャ</h3>
          <pre style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0, overflow: 'auto', lineHeight: 1.5 }}>{`┌─────────────────────────────────────────────────────────────────┐
│                        N3 Empire OS                              │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐              │
│  │📺 チャンネル │──▶│🎬 コンテンツ│──▶│🎥 Remotion │              │
│  │ ブランドDNA │   │ AI脚本/監査 │   │ 動画生成   │              │
│  └────────────┘   └────────────┘   └────────────┘              │
│         │                │                │                     │
│         ▼                ▼                ▼                     │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              Supabase (PostgreSQL)                   │       │
│  │ media_channels│content_master│mj_assets│voice_presets│       │
│  └─────────────────────────────────────────────────────┘       │
│         │                │                │                     │
│         ▼                ▼                ▼                     │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐              │
│  │🎙️ElevenLabs│   │🤖 Gemini   │   │📤 YouTube  │              │
│  │OpenAI/GTTs │   │  Claude    │   │  自動投稿  │              │
│  └────────────┘   └────────────┘   └────────────┘              │
│         └────────────────┼────────────────┘                     │
│                         ▼                                       │
│  ┌─────────────────────────────────────────────────────┐       │
│  │                   n8n (VPS)                          │       │
│  │  脚本生成│音声生成│動画生成│投稿│通知               │       │
│  └─────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘`}</pre>
        </div>
      </div>
      
      {/* クイックアクション */}
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/tools/media-hub/channels" style={{ flex: 1, padding: 16, background: '#EC4899', color: '#fff', borderRadius: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600 }}><Tv size={18} />チャンネル作成</Link>
          <Link href="/tools/media-hub/video-generator" style={{ flex: 1, padding: 16, background: '#8B5CF6', color: '#fff', borderRadius: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600 }}><Film size={18} />動画生成</Link>
          <a href="http://160.16.120.186:5678" target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: 16, background: '#FF6D5A', color: '#fff', borderRadius: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600 }}><Settings size={18} />n8nダッシュボード</a>
        </div>
      </div>
      
      </div>
    </>
  );
}
