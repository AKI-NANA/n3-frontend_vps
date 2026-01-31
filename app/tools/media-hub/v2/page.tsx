// app/tools/media-hub/v2/page.tsx
/**
 * Media Hub V2 - 高校生でも分かる全自動メディア生成システム
 */

'use client';

import React, { useState, memo } from 'react';
import {
  FileSpreadsheet, FileText, Film, Play, CheckCircle, Clock, Loader2,
  HelpCircle, ChevronRight, ChevronDown, Folder, Brain, ExternalLink, RefreshCw,
  Youtube, FileEdit, BookOpen, Twitter, Instagram, Globe,
  DollarSign, Target, Volume2, Zap,
} from 'lucide-react';
import Link from 'next/link';

// ============================================================
// 解説付きツールチップ
// ============================================================
const HelpTooltip = memo(function HelpTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'help' }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <HelpCircle size={14} style={{ color: 'var(--text-muted)', marginLeft: 4 }} />
      {show && (
        <div style={{ position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8, padding: '8px 12px', background: '#1f2937', color: 'white', borderRadius: 6, fontSize: 11, width: 220, zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>{text}</div>
      )}
    </span>
  );
});

// ============================================================
// 全体フロー説明
// ============================================================
const FlowOverview = memo(function FlowOverview() {
  const steps = [
    { icon: FileSpreadsheet, label: '1. ネタを入れる', desc: 'スプシにアイデア/URLを書く', color: '#3b82f6' },
    { icon: Brain, label: '2. AIが解析', desc: '3つのAIが自動でチェック', color: '#8b5cf6' },
    { icon: FileText, label: '3. 脚本完成', desc: 'ブログ/SNS/動画用に変換', color: '#ec4899' },
    { icon: Film, label: '4. 動画生成', desc: 'BGM/テロップ付きで作成', color: '#f59e0b' },
    { icon: Globe, label: '5. 自動投稿', desc: 'YouTube/ブログ/SNSへ投稿', color: '#10b981' },
  ];

  return (
    <div style={{ padding: 20, background: 'linear-gradient(135deg, #6366f110, #8b5cf610)', borderRadius: 12, marginBottom: 24 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Target size={20} style={{ color: '#6366f1' }} />
        🎯 このツールで何ができる？
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {steps.map((step, i) => (
          <div key={step.label} style={{ padding: 16, background: 'var(--panel)', borderRadius: 8, border: `1px solid ${step.color}30`, textAlign: 'center', position: 'relative' }}>
            {i < 4 && <ChevronRight size={20} style={{ position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />}
            <step.icon size={28} style={{ color: step.color, marginBottom: 8 }} />
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{step.label}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{step.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: 12, background: '#f59e0b10', borderRadius: 8, border: '1px solid #f59e0b30', fontSize: 12 }}>
        <strong style={{ color: '#f59e0b' }}>💡 ポイント:</strong> あなたが用意するのは「アイデア」と「参考URL」だけ。あとはAIが自動で脚本→動画→投稿まで完了。
      </div>
    </div>
  );
});

// ============================================================
// Step 1: 入力セクション
// ============================================================
const InputSection = memo(function InputSection() {
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <FileSpreadsheet size={18} style={{ color: '#3b82f6' }} />
        Step 1: ネタを入れる（スプレッドシート連携）
        <HelpTooltip text="Googleスプシにアイデアやリンクを書くと、自動で読み取って動画を作ります" />
      </h3>
      <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>GoogleスプレッドシートのURL</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="url" value={spreadsheetUrl} onChange={(e) => setSpreadsheetUrl(e.target.value)} placeholder="https://docs.google.com/spreadsheets/d/xxxxx" style={{ flex: 1, padding: '10px 12px', background: 'var(--panel-alt)', border: '1px solid var(--panel-border)', borderRadius: 6, fontSize: 13, color: 'var(--text)' }} />
            <button onClick={() => { setSyncStatus('syncing'); setTimeout(() => setSyncStatus('synced'), 2000); }} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <RefreshCw size={14} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />同期
            </button>
          </div>
        </div>
        <div style={{ padding: 12, background: '#3b82f608', borderRadius: 6, border: '1px solid #3b82f620', fontSize: 11 }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#3b82f6' }}>📋 スプシに必要な列:</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            <div><code style={{ background: 'var(--panel-alt)', padding: '2px 4px', borderRadius: 3 }}>タイトル</code> - 動画のタイトル案</div>
            <div><code style={{ background: 'var(--panel-alt)', padding: '2px 4px', borderRadius: 3 }}>参考URL</code> - 参考にする記事やPDF</div>
            <div><code style={{ background: 'var(--panel-alt)', padding: '2px 4px', borderRadius: 3 }}>チャンネル</code> - どのYouTubeチャンネル用か</div>
            <div><code style={{ background: 'var(--panel-alt)', padding: '2px 4px', borderRadius: 3 }}>優先度</code> - 高/中/低</div>
          </div>
        </div>
        {syncStatus === 'synced' && (
          <div style={{ marginTop: 12, padding: 12, background: '#10b98110', borderRadius: 6, border: '1px solid #10b98130' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={16} style={{ color: '#10b981' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#10b981' }}>同期完了</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>| チャンネル: 5件 | アイデア: 23件 | 資料: 12件</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// ============================================================
// Step 2: AI処理の可視化
// ============================================================
const AIProcessSection = memo(function AIProcessSection() {
  const [showDetails, setShowDetails] = useState(false);
  const aiSteps = [
    { id: 'gemini', name: 'Gemini 1.5 Pro', desc: 'URLや資料から「事実」を抽出', status: 'completed', duration: '約30秒', cost: '$0.02' },
    { id: 'claude', name: 'Claude 3.5', desc: '法令チェック＆脚本作成', status: 'processing', duration: '約1分', cost: '$0.05' },
    { id: 'gpt', name: 'GPT-4o', desc: '演出タグ追加（SE/ズーム指示）', status: 'pending', duration: '約30秒', cost: '$0.03' },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Brain size={18} style={{ color: '#8b5cf6' }} />
        Step 2: AIが自動で解析・脚本作成
        <HelpTooltip text="3つのAIがリレー方式で処理。各AIが得意分野を担当して高品質な脚本完成" />
      </h3>
      <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
        <button onClick={() => setShowDetails(!showDetails)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#8b5cf6', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
          {showDetails ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          🤖 なぜ3つのAIを使うの？（クリックで詳細）
        </button>
        {showDetails && (
          <div style={{ marginBottom: 12, padding: 12, background: '#8b5cf608', borderRadius: 6, fontSize: 11 }}>
            <p style={{ marginBottom: 8 }}><strong>理由:</strong> 1つのAIだけだと「嘘」が混じることがある。3つで相互チェック→<strong>100%正確</strong>。</p>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              <li><strong>Gemini:</strong> PDF/URLから「事実」だけを抜き出す（引用元も記録）</li>
              <li><strong>Claude:</strong> 法律違反チェック＆分かりやすい脚本に書き換え</li>
              <li><strong>GPT-4o:</strong> 演出（効果音やズーム）を追加して飽きさせない</li>
            </ul>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          {aiSteps.map((step) => (
            <div key={step.id} style={{ flex: 1, padding: 12, borderRadius: 6, background: step.status === 'completed' ? '#10b98108' : step.status === 'processing' ? '#f59e0b08' : 'var(--panel-alt)', border: `1px solid ${step.status === 'completed' ? '#10b98130' : step.status === 'processing' ? '#f59e0b30' : 'var(--panel-border)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                {step.status === 'completed' && <CheckCircle size={14} style={{ color: '#10b981' }} />}
                {step.status === 'processing' && <Loader2 size={14} className="animate-spin" style={{ color: '#f59e0b' }} />}
                {step.status === 'pending' && <Clock size={14} style={{ color: 'var(--text-muted)' }} />}
                <span style={{ fontSize: 11, fontWeight: 600 }}>{step.name}</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>{step.desc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text-muted)' }}>
                <span>⏱️ {step.duration}</span><span>💰 {step.cost}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: 8, background: '#f59e0b08', borderRadius: 6, fontSize: 11, display: 'flex', alignItems: 'center', gap: 8 }}>
          <DollarSign size={14} style={{ color: '#f59e0b' }} />
          <span><strong>コスト:</strong> 1本約$0.10（約15円）。夜間(0-6時)処理で半額！</span>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// Step 3: アセット設定
// ============================================================
const AssetSection = memo(function AssetSection() {
  const [activeTab, setActiveTab] = useState<'bgm' | 'se' | 'character' | 'template'>('bgm');

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Folder size={18} style={{ color: '#ec4899' }} />
        Step 3: 素材の設定（BGM/効果音/キャラ）
        <HelpTooltip text="動画に使うBGMや効果音、キャラをここで管理。事前アップロードで自動使用" />
      </h3>
      <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {[{ id: 'bgm', label: '🎵 BGM', count: 12 }, { id: 'se', label: '🔊 効果音', count: 24 }, { id: 'character', label: '👤 キャラ', count: 3 }, { id: 'template', label: '📐 テンプレ', count: 5 }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', background: activeTab === tab.id ? '#ec489920' : 'transparent', color: activeTab === tab.id ? '#ec4899' : 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>{tab.label} ({tab.count})</button>
          ))}
        </div>

        {activeTab === 'bgm' && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>💡 BGMは「ジャンル」に合わせて自動選択。手動指定も可能。保存先: <code>/media/bgm/</code></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[{ name: '教育系-落ち着き-01', duration: '3:45' }, { name: '教育系-集中-02', duration: '4:12' }, { name: 'エンタメ-ポップ-01', duration: '2:58' }].map(bgm => (
                <div key={bgm.name} style={{ padding: 10, background: 'var(--panel-alt)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Play size={14} style={{ color: '#ec4899', cursor: 'pointer' }} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 500 }}>{bgm.name}</div><div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{bgm.duration}</div></div>
                </div>
              ))}
            </div>
            <button style={{ marginTop: 12, padding: '8px 16px', background: '#ec489920', color: '#ec4899', border: '1px dashed #ec489950', borderRadius: 6, cursor: 'pointer', width: '100%', fontSize: 11, fontWeight: 600 }}>＋ BGMをアップロード</button>
          </div>
        )}

        {activeTab === 'se' && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>💡 脚本に <code>[SE:決定音]</code> と書くと自動挿入。保存先: <code>/media/se/</code></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {['決定音', '注目', '場面転換', '正解', '不正解', '拍手', 'ベル', 'タイプ音'].map(se => (
                <div key={se} style={{ padding: 8, background: 'var(--panel-alt)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <Volume2 size={12} style={{ color: '#f59e0b' }} /><span style={{ fontSize: 11 }}>{se}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'character' && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>💡 キャラは脚本の「感情」に合わせて自動で表情が変わる。MJで事前生成（喜怒哀楽×5角度=20枚/キャラ）。保存先: <code>/media/characters/</code></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {['先生キャラ', '若者キャラ', 'ゆるキャラ'].map(char => (
                <div key={char} style={{ padding: 12, background: 'var(--panel-alt)', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#8b5cf620', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👤</div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{char}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>5表情 × 4角度 = 20枚</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'template' && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>💡 テンプレートでテロップ位置や背景スタイルが変わる。Remotionコンポーネントとして定義。</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[{ name: '教育系', desc: '落ち着いた配色、読みやすいテロップ', active: true }, { name: 'ニュース系', desc: 'ニュース番組風のレイアウト', active: false }, { name: 'エンタメ系', desc: 'ポップな色使い、派手なアニメ', active: false }].map(tpl => (
                <div key={tpl.name} style={{ padding: 12, background: 'var(--panel-alt)', borderRadius: 8, border: tpl.active ? '2px solid #6366f1' : '1px solid transparent' }}>
                  <div style={{ height: 50, background: 'linear-gradient(135deg, #6366f120, #8b5cf620)', borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{tpl.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{tpl.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// ============================================================
// Step 4: 生成キュー
// ============================================================
const GenerationQueue = memo(function GenerationQueue() {
  const items = [
    { id: 'CT-001', title: '宅建2025年法改正まとめ', channel: '宅建マスター', status: 'generating', progress: 75, step: '動画レンダリング中...' },
    { id: 'CT-002', title: 'FP3級よく出る計算問題', channel: 'FP講座ch', status: 'scripting', progress: 40, step: 'Claude: 脚本作成中...' },
    { id: 'CT-003', title: '簿記3級仕訳の覚え方', channel: '簿記マスター', status: 'draft', progress: 0, step: '待機中' },
  ];
  const statusColors: Record<string, { color: string; label: string }> = {
    draft: { color: '#6b7280', label: '下書き' }, scripting: { color: '#8b5cf6', label: '脚本作成' },
    generating: { color: '#f59e0b', label: '動画生成' }, review: { color: '#ec4899', label: 'レビュー待ち' },
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Zap size={18} style={{ color: '#f59e0b' }} />
        Step 4: 生成キュー（処理状況）
        <HelpTooltip text="スプシから読み込んだコンテンツの処理状況。完成動画は /media/outputs/ に保存" />
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => {
          const st = statusColors[item.status] || { color: '#6b7280', label: item.status };
          return (
            <div key={item.id} style={{ padding: 16, background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <code style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.id}</code>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.channel}</div></div>
                <span style={{ padding: '4px 10px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: st.color + '20', color: st.color }}>{st.label}</span>
              </div>
              <div style={{ marginBottom: 8 }}><div style={{ height: 4, background: 'var(--panel-border)', borderRadius: 2, overflow: 'hidden' }}><div style={{ width: `${item.progress}%`, height: '100%', background: st.color, transition: 'width 0.3s' }} /></div></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.status === 'generating' && <Loader2 size={12} className="animate-spin" style={{ marginRight: 4, display: 'inline' }} />}{item.step}</div>
                <button style={{ padding: '4px 12px', background: 'var(--panel-alt)', border: '1px solid var(--panel-border)', borderRadius: 4, fontSize: 10, cursor: 'pointer', color: 'var(--text)' }}>詳細</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ============================================================
// Step 5: 配信設定
// ============================================================
const PublishSection = memo(function PublishSection() {
  const platforms = [
    { icon: Youtube, label: 'YouTube', connected: true, color: '#FF0000' },
    { icon: Globe, label: 'ブログ', connected: true, color: '#21759B' },
    { icon: FileEdit, label: 'note', connected: false, color: '#41C9B4' },
    { icon: Twitter, label: 'X', connected: true, color: '#1DA1F2' },
    { icon: Instagram, label: 'Instagram', connected: false, color: '#E4405F' },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Globe size={18} style={{ color: '#10b981' }} />
        Step 5: 配信先の設定
        <HelpTooltip text="動画完成後、自動でこれらのプラットフォームに投稿" />
      </h3>
      <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {platforms.map(p => (
            <div key={p.label} style={{ padding: 12, borderRadius: 8, textAlign: 'center', background: p.connected ? '#10b98108' : 'var(--panel-alt)', border: `1px solid ${p.connected ? '#10b98130' : 'var(--panel-border)'}`, cursor: 'pointer' }}>
              <p.icon size={24} style={{ color: p.connected ? p.color : 'var(--text-muted)', marginBottom: 8 }} />
              <div style={{ fontSize: 11, fontWeight: 600 }}>{p.label}</div>
              <div style={{ fontSize: 9, marginTop: 4, color: p.connected ? '#10b981' : 'var(--text-muted)' }}>{p.connected ? '✅ 連携済み' : '❌ 未連携'}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: 12, background: '#10b98108', borderRadius: 6, fontSize: 11 }}>
          <strong style={{ color: '#10b981' }}>💡 自動投稿タイミング:</strong> YouTube: 18:00 | ブログ: 同時 | X: 動画公開後5分
        </div>
      </div>
    </div>
  );
});

// ============================================================
// メイン
// ============================================================
export default function MediaHubV2Page() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--text)', padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>🎬 Media Hub <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>V2 Beta</span></h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>アイデアを入れるだけ → AIが自動で動画を作って投稿まで完了</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/tools/media-hub" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 6, color: 'var(--text)', textDecoration: 'none', fontSize: 12 }}>旧UI</Link>
          <Link href="/tools/media-hub/docs" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 6, color: 'var(--text)', textDecoration: 'none', fontSize: 12 }}><BookOpen size={14} />ドキュメント</Link>
          <a href="http://160.16.120.186:5678" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#FF6D5A', borderRadius: 6, color: 'white', textDecoration: 'none', fontSize: 12 }}><ExternalLink size={14} />n8n</a>
        </div>
      </div>

      <FlowOverview />
      <InputSection />
      <AIProcessSection />
      <AssetSection />
      <GenerationQueue />
      <PublishSection />

      <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>🚧 このUIはまだ開発中です。機能リクエストや不具合報告は<a href="#" style={{ color: '#3b82f6', marginLeft: 4 }}>こちら</a>から</p>
      </div>
    </div>
  );
}
