// app/tools/media-hub/page.tsx
/**
 * Media Hub - Empire OS メディア生成統合ページ
 * 
 * n8nワークフロー統合（27次元HMAC署名対応）
 */

'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Film, Mic, FileText, Upload, Play, 
  BarChart3, Clock, CheckCircle, AlertCircle,
  RefreshCw, Settings, Zap, Youtube, Radio,
  Tv, Image, Sparkles, StopCircle, Loader2,
  AlertTriangle, Shield, Activity, Volume2,
  BookOpen, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { N3WorkspaceLayout, type L2Tab } from '@/components/layouts';

// ============================================================
// n8nサービスインポート（サーバーサイドでのみ実行）
// ============================================================

const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://160.16.120.186:5678';

// クライアントサイドで使えるシンプルなAPI呼び出し
async function callMediaWebhook(endpoint: string, data: any) {
  const jobId = `MEDIA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = Date.now().toString();
  
  try {
    const response = await fetch(`/api/media/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint, data, jobId, timestamp }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: String(error), jobId };
  }
}

// ============================================================
// タブ定義
// ============================================================

const MEDIA_TABS: L2Tab[] = [
  { id: 'dashboard', label: 'ダッシュボード', labelEn: 'Dashboard', icon: BarChart3, color: '#3B82F6' },
  { id: 'video', label: '動画生成', labelEn: 'Video', icon: Film, color: '#EC4899' },
  { id: 'audio', label: '音声生成', labelEn: 'Audio', icon: Mic, color: '#8B5CF6' },
  { id: 'channels', label: 'チャンネル', labelEn: 'Channels', icon: Tv, color: '#10B981' },
  { id: 'live', label: 'ライブ配信', labelEn: 'Live', icon: Radio, color: '#EF4444' },
  { id: 'upload', label: '投稿キュー', labelEn: 'Upload', icon: Upload, color: '#F59E0B' },
];

// ============================================================
// 共通コンポーネント
// ============================================================

const StatCard = memo(function StatCard({
  label, value, subValue, icon: Icon, color = 'var(--text)', loading = false,
}: {
  label: string; value: string | number; subValue?: string;
  icon: React.ElementType; color?: string; loading?: boolean;
}) {
  return (
    <div style={{ padding: '16px 20px', background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Icon size={16} style={{ color }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
      </div>
      {loading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <>
          <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
          {subValue && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{subValue}</div>}
        </>
      )}
    </div>
  );
});

const StatusBadge = memo(function StatusBadge({ status, text }: { status: 'success' | 'warning' | 'error' | 'info' | 'pending'; text: string; }) {
  const colors = {
    success: { bg: '#10B98120', text: '#10B981' },
    warning: { bg: '#F59E0B20', text: '#F59E0B' },
    error: { bg: '#EF444420', text: '#EF4444' },
    info: { bg: '#3B82F620', text: '#3B82F6' },
    pending: { bg: '#6B728020', text: '#6B7280' },
  };
  const style = colors[status];
  return (
    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: style.bg, color: style.text, fontWeight: 500 }}>
      {text}
    </span>
  );
});

const ResultPanel = memo(function ResultPanel({ result }: { result: any }) {
  if (!result) return null;
  return (
    <div style={{
      marginTop: 16, padding: 12, borderRadius: 8,
      background: result.success ? '#10B98110' : '#EF444410',
      border: `1px solid ${result.success ? '#10B98130' : '#EF444430'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        {result.success ? <CheckCircle size={16} style={{ color: '#10B981' }} /> : <AlertCircle size={16} style={{ color: '#EF4444' }} />}
        <span style={{ fontSize: 13, fontWeight: 600, color: result.success ? '#10B981' : '#EF4444' }}>
          {result.success ? '実行成功' : 'エラー'}
        </span>
        {result.jobId && <code style={{ fontSize: 10, color: 'var(--text-muted)' }}>{result.jobId}</code>}
      </div>
      {result.message && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{result.message}</div>}
      {result.error && <div style={{ fontSize: 12, color: '#EF4444' }}>{result.error}</div>}
      {result.executionTime && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>実行時間: {result.executionTime}ms</div>}
    </div>
  );
});

// ============================================================
// ダッシュボードタブ
// ============================================================

const DashboardContent = memo(function DashboardContent() {
  const [n8nStatus, setN8nStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${N8N_BASE_URL}/healthz`, { method: 'GET', signal: AbortSignal.timeout(5000) });
        setN8nStatus(res.ok ? 'connected' : 'disconnected');
      } catch {
        setN8nStatus('disconnected');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 16 }}>
      {/* n8n接続状態 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: 12, marginBottom: 16,
        background: n8nStatus === 'connected' ? '#10B98110' : '#EF444410',
        border: `1px solid ${n8nStatus === 'connected' ? '#10B98130' : '#EF444430'}`, borderRadius: 8,
      }}>
        <Activity size={18} style={{ color: n8nStatus === 'connected' ? '#10B981' : '#EF4444' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: n8nStatus === 'connected' ? '#10B981' : '#EF4444' }}>
            n8n {n8nStatus === 'checking' ? '確認中...' : n8nStatus === 'connected' ? '接続済み' : '未接続'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{N8N_BASE_URL}</div>
        </div>
        <Link href="/tools/media-hub/docs" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#f9731620', color: '#f97316', borderRadius: 6, fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
          <BookOpen size={14} />ドキュメント
        </Link>
        <a href="http://160.16.120.186:5678" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#FF6D5A', color: 'white', borderRadius: 6, fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
          <ExternalLink size={14} />n8n
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Shield size={14} style={{ color: '#10B981' }} />
          <span style={{ fontSize: 11, color: '#10B981' }}>27次元準拠</span>
        </div>
      </div>

      {/* ★★★ Empire OS ダッシュボードへのリンク（最優先表示） */}
      <Link href="/tools/media-hub/empire" style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
        <div style={{ 
          padding: 20, 
          background: 'linear-gradient(135deg, #EC489930 0%, #8B5CF630 50%, #3B82F630 100%)', 
          borderRadius: 16, 
          border: '3px solid #EC4899', 
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ 
                width: 64, height: 64, borderRadius: 16, 
                background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32,
              }}>
                👑
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, background: 'linear-gradient(90deg, #EC4899, #8B5CF6, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  N3 Empire OS ダッシュボード
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                  全自動マルチメディア帝国 - チャンネル管理 / AI脚本 / Remotion動画 / マルチ展開
                </p>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 10, padding: '3px 8px', background: '#EC489920', color: '#EC4899', borderRadius: 4 }}>📺 チャンネル</span>
                  <span style={{ fontSize: 10, padding: '3px 8px', background: '#8B5CF620', color: '#8B5CF6', borderRadius: 4 }}>🎬 コンテンツ</span>
                  <span style={{ fontSize: 10, padding: '3px 8px', background: '#3B82F620', color: '#3B82F6', borderRadius: 4 }}>🎥 Remotion</span>
                  <span style={{ fontSize: 10, padding: '3px 8px', background: '#10B98120', color: '#10B981', borderRadius: 4 }}>📤 投稿</span>
                </div>
              </div>
            </div>
            <div style={{ 
              padding: '16px 32px', 
              background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', 
              color: 'white', 
              borderRadius: 12, 
              fontWeight: 700,
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <Sparkles size={20} />
              Empire OSを開く
            </div>
          </div>
        </div>
      </Link>

      {/* ★ Remotion動画生成ツールへのリンク */}
      <div style={{ 
        padding: 16, 
        background: 'linear-gradient(135deg, #EC489920 0%, #8B5CF620 100%)', 
        borderRadius: 12, 
        border: '2px solid #EC4899', 
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 48, height: 48, borderRadius: 12, 
              background: '#EC4899', 
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              <Film size={24} style={{ color: 'white' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#EC4899' }}>
                🎬 Remotion動画生成
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                Spring物理演算 / Ken Burns / パーティクル / 桜井スタイル注釈 / デジタル指紋
              </p>
            </div>
          </div>
          <Link 
            href="/tools/media-hub/video-generator" 
            style={{ 
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', 
              background: '#EC4899', 
              color: 'white', 
              borderRadius: 8, 
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            <Zap size={18} />
            動画を作成
          </Link>
        </div>
      </div>

      {/* 統計カード */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="動画生成" value="--" subValue="content_master" icon={Film} color="#EC4899" />
        <StatCard label="音声生成" value="--" subValue="media_assets" icon={Mic} color="#8B5CF6" />
        <StatCard label="チャンネル" value="--" subValue="media_channels" icon={Tv} color="#10B981" />
        <StatCard label="投稿待ち" value="--" subValue="scheduled" icon={Upload} color="#F59E0B" />
      </div>

      {/* 機能一覧 */}
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>利用可能なn8nワークフロー</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { name: 'Remotion動画生成', desc: 'Spring物理演算 + AI音声同期', icon: Film, color: '#EC4899', wf: 'video-generate-v6', link: '/tools/media-hub/video-generator' },
          { name: 'ElevenLabs音声', desc: 'バイオノイズ + Gemini感情AI', icon: Volume2, color: '#8B5CF6', wf: 'voice-generate' },
          { name: 'LivePortrait', desc: '表情転写 + リップシンク30fps', icon: Sparkles, color: '#06B6D4', wf: 'liveportrait-transfer' },
          { name: '桜井スタイル注釈', desc: 'Gemini 1.5 Pro座標生成', icon: Image, color: '#F97316', wf: 'visual-annotation' },
          { name: '24時間ライブ', desc: 'FFmpeg + 収益優先プレイリスト', icon: Radio, color: '#EF4444', wf: 'live-stream' },
          { name: 'デジタル指紋', desc: 'BAN回避ユニーク化', icon: Shield, color: '#14B8A6', wf: 'digital-fingerprint' },
        ].map((f: any) => (
          <div key={f.name} style={{ padding: 12, background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <f.icon size={16} style={{ color: f.color }} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>{f.name}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{f.desc}</div>
            <code style={{ fontSize: 10, color: '#6B7280' }}>/{f.wf}</code>
            {f.link && (
              <Link href={f.link} style={{ 
                position: 'absolute', top: 8, right: 8, 
                padding: '4px 8px', background: f.color, color: 'white', 
                borderRadius: 4, fontSize: 10, textDecoration: 'none', fontWeight: 600 
              }}>
                開く →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

// ============================================================
// 動画生成タブ
// ============================================================

const VideoGeneratorContent = memo(function VideoGeneratorContent() {
  const [channelId, setChannelId] = useState('');
  const [contentId, setContentId] = useState('');
  const [videoType, setVideoType] = useState('youtube_long');
  const [genre, setGenre] = useState('education');
  const [autoPublish, setAutoPublish] = useState(false);
  const [useV6BioNoise, setUseV6BioNoise] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = useCallback(async () => {
    if (!channelId) { alert('チャンネルIDを入力してください'); return; }
    setLoading(true);
    setResult(null);
    const response = await callMediaWebhook('video-generate-v6', {
      channel_id: channelId, content_id: contentId || undefined,
      video_type: videoType, genre, auto_publish: autoPublish,
      use_v6_bio_noise: useV6BioNoise, generate_voice: true,
    });
    setResult(response);
    setLoading(false);
  }, [channelId, contentId, videoType, genre, autoPublish, useV6BioNoise]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ padding: 12, background: '#EC489910', border: '1px solid #EC489930', borderRadius: 8, marginBottom: 16 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#EC4899', marginBottom: 4 }}>🎬 Remotion動画生成（V6）</h4>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          HMAC署名付きWebhook → n8n → Remotion Lambda。Spring物理演算、デジタル指紋ユニーク化対応。
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>チャンネルID *</label>
          <input type="text" value={channelId} onChange={(e) => setChannelId(e.target.value)} placeholder="ch_xxxxx"
            style={{ width: '100%', padding: '8px 10px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 6, color: 'var(--text)', fontSize: 12 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>コンテンツID（オプション）</label>
          <input type="text" value={contentId} onChange={(e) => setContentId(e.target.value)} placeholder="CNT-xxxxx"
            style={{ width: '100%', padding: '8px 10px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 6, color: 'var(--text)', fontSize: 12 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>動画タイプ</label>
          <select value={videoType} onChange={(e) => setVideoType(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 6, color: 'var(--text)', fontSize: 12 }}>
            <option value="youtube_long">YouTube ロング (16:9)</option>
            <option value="youtube_short">YouTube ショート (9:16)</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>ジャンル（声設定）</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 6, color: 'var(--text)', fontSize: 12 }}>
            <option value="education">教育系 (stability:0.65)</option>
            <option value="electronics">電子機器 (stability:0.7)</option>
            <option value="apparel">アパレル (stability:0.4)</option>
            <option value="luxury">高級品 (stability:0.8)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={useV6BioNoise} onChange={(e) => setUseV6BioNoise(e.target.checked)} />
          V6バイオノイズ（指紋ユニーク化）
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={autoPublish} onChange={(e) => setAutoPublish(e.target.checked)} />
          自動投稿（YouTube）
        </label>
      </div>

      <button onClick={handleGenerate} disabled={loading || !channelId}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px 20px',
          background: loading ? '#6B7280' : '#EC4899', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
        {loading ? '生成中...' : '動画生成を実行'}
      </button>
      <ResultPanel result={result} />
    </div>
  );
});

// ============================================================
// 音声生成タブ
// ============================================================

const AudioGeneratorContent = memo(function AudioGeneratorContent() {
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [genre, setGenre] = useState('education');
  const [useEmotionAI, setUseEmotionAI] = useState(true);
  const [addBreath, setAddBreath] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = useCallback(async () => {
    if (!text) { alert('テキストを入力してください'); return; }
    setLoading(true);
    setResult(null);
    const response = await callMediaWebhook('voice-generate', {
      text, voice_id: voiceId || undefined, genre, language: 'ja',
      use_emotion_ai: useEmotionAI, add_breath: addBreath,
    });
    setResult(response);
    setLoading(false);
  }, [text, voiceId, genre, useEmotionAI, addBreath]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ padding: 12, background: '#8B5CF610', border: '1px solid #8B5CF630', borderRadius: 8, marginBottom: 16 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#8B5CF6', marginBottom: 4 }}>🎙️ ElevenLabs音声生成（EMOTION-AI V6）</h4>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          Gemini 1.5 Flash感情分析 → stability/style自動調整。バイオモジュレーション（息継ぎ[breath]、ピッチ±1%ゆらぎ）対応。
        </p>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>ナレーションテキスト *</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="読み上げるテキストを入力..."
          rows={5} style={{ width: '100%', padding: '10px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 6, color: 'var(--text)', fontSize: 12, resize: 'vertical' }} />
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>推定時間: 約{Math.ceil(text.length / 5)}秒（5文字/秒）</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Voice ID（オプション）</label>
          <input type="text" value={voiceId} onChange={(e) => setVoiceId(e.target.value)} placeholder="ElevenLabs Voice ID"
            style={{ width: '100%', padding: '8px 10px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 6, color: 'var(--text)', fontSize: 12 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>ジャンルプリセット</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 6, color: 'var(--text)', fontSize: 12 }}>
            <option value="education">教育系 (0.65/0.75/0.2)</option>
            <option value="electronics">電子機器 (0.7/0.8/0.1)</option>
            <option value="apparel">アパレル (0.4/0.7/0.4)</option>
            <option value="luxury">高級品 (0.8/0.85/0.0)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={useEmotionAI} onChange={(e) => setUseEmotionAI(e.target.checked)} />
          Gemini感情AI（自動パラメータ調整）
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={addBreath} onChange={(e) => setAddBreath(e.target.checked)} />
          バイオノイズ（息継ぎ・ピッチゆらぎ）
        </label>
      </div>

      <button onClick={handleGenerate} disabled={loading || !text}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px 20px',
          background: loading ? '#6B7280' : '#8B5CF6', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Mic size={16} />}
        {loading ? '生成中...' : '音声生成を実行'}
      </button>
      <ResultPanel result={result} />
    </div>
  );
});

// ============================================================
// チャンネル管理タブ
// ============================================================

const ChannelsContent = memo(function ChannelsContent() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ padding: 12, background: '#10B98110', border: '1px solid #10B98130', borderRadius: 8, marginBottom: 16 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#10B981', marginBottom: 4 }}>📺 チャンネル管理</h4>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          media_channelsテーブル連携。ブランドDNA（配色/フォント/声設定）、BAN回避設定（プロキシIP/ブラウザ指紋）を管理。
        </p>
      </div>

      <div style={{ padding: 32, background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Tv size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
        <p style={{ fontSize: 13 }}>DBテーブル確認後に実装予定</p>
        <p style={{ fontSize: 11, marginTop: 4 }}>media_channels + youtube_oauth_tokens</p>
      </div>
    </div>
  );
});

// ============================================================
// ライブ配信タブ
// ============================================================

const LiveStreamContent = memo(function LiveStreamContent() {
  const [channelId, setChannelId] = useState('');
  const [playlistMode, setPlaylistMode] = useState('revenue_priority');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleStart = useCallback(async () => {
    if (!channelId) { alert('チャンネルIDを入力してください'); return; }
    setLoading(true);
    setResult(null);
    const response = await callMediaWebhook('live-stream', {
      action: 'start', channel_id: channelId, playlist_mode: playlistMode, include_stock_only: true,
    });
    setResult(response);
    setLoading(false);
  }, [channelId, playlistMode]);

  const handleStatus = useCallback(async () => {
    setLoading(true);
    const response = await callMediaWebhook('live-stream', { action: 'status' });
    setResult(response);
    setLoading(false);
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ padding: 12, background: '#EF444410', border: '1px solid #EF444430', borderRadius: 8, marginBottom: 16 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#EF4444', marginBottom: 4 }}>📡 24時間ライブ配信</h4>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          FFmpeg + YouTube Live。収益優先プレイリスト、在庫あり商品のみ自動ループ再生。
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>チャンネルID *</label>
          <input type="text" value={channelId} onChange={(e) => setChannelId(e.target.value)} placeholder="ch_xxxxx"
            style={{ width: '100%', padding: '8px 10px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 6, color: 'var(--text)', fontSize: 12 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>プレイリストモード</label>
          <select value={playlistMode} onChange={(e) => setPlaylistMode(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 6, color: 'var(--text)', fontSize: 12 }}>
            <option value="revenue_priority">収益優先（利益率順）</option>
            <option value="random">ランダム</option>
            <option value="sequential">順番通り</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={handleStart} disabled={loading || !channelId}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px',
            background: loading ? '#6B7280' : '#EF4444', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Radio size={16} />}
          配信開始
        </button>
        <button onClick={handleStatus} disabled={loading}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px',
            background: 'var(--panel)', color: 'var(--text)', border: '1px solid var(--panel-border)', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Activity size={16} />
          ステータス確認
        </button>
      </div>
      <ResultPanel result={result} />
    </div>
  );
});

// ============================================================
// 投稿キュータブ
// ============================================================

const UploadQueueContent = memo(function UploadQueueContent() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ padding: 12, background: '#F59E0B10', border: '1px solid #F59E0B30', borderRadius: 8, marginBottom: 16 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#F59E0B', marginBottom: 4 }}>📤 YouTube投稿キュー</h4>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          content_master (publish_status='scheduled') 連携。シャドウバン対策のランダム投稿時間設定。
        </p>
      </div>

      <div style={{ background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 110px 80px', padding: '10px 12px', background: 'var(--panel-alt)', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
          <div>タイトル</div><div>チャンネル</div><div>予定日時</div><div>ステータス</div>
        </div>
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
          <Upload size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
          <p style={{ fontSize: 12 }}>DBから投稿キューを取得予定</p>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// メインページ
// ============================================================

export default function MediaHubPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardContent />;
      case 'video': return <VideoGeneratorContent />;
      case 'audio': return <AudioGeneratorContent />;
      case 'channels': return <ChannelsContent />;
      case 'live': return <LiveStreamContent />;
      case 'upload': return <UploadQueueContent />;
      default: return <DashboardContent />;
    }
  };

  return (
    <N3WorkspaceLayout
      title="Media Hub"
      subtitle="Empire OS メディア生成統合（n8n連携）"
      tabs={MEDIA_TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderTabContent()}
    </N3WorkspaceLayout>
  );
}
