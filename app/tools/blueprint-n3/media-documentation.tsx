// app/tools/blueprint-n3/media-documentation.tsx
// メディアセクション専用ドキュメント
'use client';

import React from 'react';
import { Film, Mic, Radio, Shield, Sparkles, BookOpen, Tv, Play, FileText, BarChart3 } from 'lucide-react';

export const MEDIA_WORKFLOWS = [
  // === 動画生成系 (10件) ===
  { id: 'media-remotion-v6', name: 'Remotion動画生成', nameJp: '🎬 Remotion動画生成-YouTube投稿', description: 'Spring物理演算+AI音声同期でYouTube投稿動画を自動生成', status: 'active', webhookPath: '/webhook/video-generate-v6', aiComponents: ['elevenlabs', 'gemini'], jsonFile: '【メディア】02_52-メディア-Remotion動画生成-YouTube投稿_V6.json', techDetails: 'Remotion Lambda + ElevenLabs + デジタル指紋ユニーク化' },
  { id: 'media-remotion-lambda', name: 'Lambda大規模レンダリング', nameJp: '☁️ Remotion-Lambda-大規模レンダリング', description: 'AWS Lambdaで1000本同時レンダリング', status: 'active', webhookPath: '/webhook/remotion-lambda-render', aiComponents: ['none'], jsonFile: '【メディア】16_52c-メディア-Remotion-Lambda-大規模レンダリング_V5.json' },
  { id: 'media-digital-fingerprint', name: 'デジタル指紋エミュレーター', nameJp: '🛡️ デジタル指紋エミュレーション-BAN回避', description: 'FFmpegで動画ハッシュをランダム化、YouTubeの重複検知回避', status: 'active', webhookPath: '/webhook/digital-fingerprint', aiComponents: ['none'], jsonFile: '【メディア】01_102-メディア-デジタル指紋エミュレーター_V6.json', techDetails: 'FFmpeg +パーティクルノイズ+カラーグレーディングシフト' },
  { id: 'media-5style-video', name: '5スタイル動画生成', nameJp: '🎭 5スタイル動画生成-UniversalTemplate', description: 'キャラあり/なし、Shorts/ロングをPropsで切替', status: 'active', webhookPath: '/webhook/5style-video', aiComponents: ['claude', 'elevenlabs'], jsonFile: '【メディア】13_200-人格-5スタイル動画生成-UniversalTemplate_V5.json' },
  { id: 'media-infinity-loop', name: 'インフィニティループショート', nameJp: '🔄 インフィニティループショート-シームレス生成', description: '終わりなく続くループ動画を自動生成', status: 'active', webhookPath: '/webhook/infinity-loop', aiComponents: ['none'], jsonFile: '【メディア】26_94-メディア-インフィニティループショート-シームレス生成_V5.json' },
  { id: 'media-puppeteer-capture', name: 'Puppeteer自動録画', nameJp: '📹 Puppeteer自動録画-VPS画面キャプチャ', description: 'VPS上のブラウザ操作を動画として録画', status: 'active', webhookPath: '/webhook/puppeteer-capture', aiComponents: ['none'], jsonFile: '【メディア】06_100-メディア-Puppeteer自動録画-VPS画面キャプチャ_V5.json' },
  { id: 'media-ltx2-background', name: 'LTX-2 AI背景生成', nameJp: '🌄 LTX-2-AI動的背景生成', description: 'AIで動画背景を自動生成', status: 'partial', webhookPath: '/webhook/ltx2-background', aiComponents: ['midjourney'], jsonFile: '【メディア】10_104-メディア-LTX-2-AI動的背景生成_V5.json' },
  
  // === 音声生成系 (3件) ===
  { id: 'media-elevenlabs-v6', name: 'ElevenLabs音声生成', nameJp: '🎙️ ElevenLabs音声生成-EMOTION-AI', description: 'Gemini感情分析 → stability/style動的調整、バイオモジュレーション対応', status: 'active', webhookPath: '/webhook/voice-generate', aiComponents: ['elevenlabs', 'gemini'], jsonFile: '【メディア】03_52a-メディア-ElevenLabs音声生成_V6.json', techDetails: '感情AI + [breath]自動挿入 + ピッチ±1%ゆらぎ' },
  { id: 'media-liveportrait', name: 'LivePortrait表情転写', nameJp: '🎭 LivePortrait連携-表情転写', description: '静止画に口パク・瞬き・呼吸を付与して30fpsリップシンク', status: 'active', webhookPath: '/webhook/liveportrait-transfer', aiComponents: ['none'], jsonFile: '【メディア】09_103-メディア-LivePortrait連携-表情転写_V5.json', techDetails: 'driving_video + source_image → 30fps lip-sync' },
  
  // === 視覚注釈系 (3件) ===
  { id: 'media-visual-annotation', name: '視覚的注釈自動生成', nameJp: '✏️ 視覚的注釈自動生成-桜井スタイル', description: 'Gemini 1.5 Proで矢印・ハイライト・ズームの座標を自動生成', status: 'active', webhookPath: '/webhook/visual-annotation', aiComponents: ['gemini'], jsonFile: '【メディア】29_98-メディア-視覚的注釈自動生成-桜井スタイル_V5.json', techDetails: 'Remotion props形式でアニメーション座標出力' },
  { id: 'media-visual-dna', name: 'ビジュアルDNA衝突回避', nameJp: '🧬 ビジュアルDNA衝突回避-多様性監査', description: '同一チャンネル内の動画が似すぎないよう監査', status: 'active', webhookPath: '/webhook/visual-dna', aiComponents: ['gemini'], jsonFile: '【メディア】27_95-メディア-ビジュアルDNA衝突回避-多様性監査_V5.json' },
  { id: 'media-演出学習', name: '演出学習ループ', nameJp: '🔄 演出学習ループ-自己進化エンジン', description: '視聴維持率データから演出パターンを学習', status: 'partial', webhookPath: '/webhook/演出-learn', aiComponents: ['gemini'], jsonFile: '【メディア】17_70-メディア-演出学習ループ-自己進化エンジン_V5.json' },
  
  // === ライブ配信系 (2件) ===
  { id: 'media-24h-live', name: '24時間ライブ配信', nameJp: '📡 24時間ライブエンコーダー-FFmpeg', description: 'FFmpegで収益優先プレイリストを24時間ループ配信', status: 'active', webhookPath: '/webhook/live-stream', aiComponents: ['none'], jsonFile: '【メディア】21_82-メディア-24時間ライブエンコーダー-FFmpeg_V5.json', techDetails: 'RTMP + 収益priority/random/sequential モード' },
  { id: 'media-youtube-oauth', name: 'YouTube OAuth認証', nameJp: '🔐 YouTube-OAuth認証', description: 'YouTube API OAuth2認証フロー管理', status: 'active', webhookPath: '/webhook/youtube-oauth', aiComponents: ['none'], jsonFile: '【メディア】15_52b-メディア-YouTube-OAuth認証_V5.json' },
  
  // === コミュニティ・防衛系 (4件) ===
  { id: 'media-comment-auto', name: 'コメント自動返信', nameJp: '💬 コメント自動返信-AI知識DB', description: 'YouTubeコメントにAIが自動返信（知識DB参照）', status: 'active', webhookPath: '/webhook/comment-auto', aiComponents: ['claude'], jsonFile: '【メディア】22_85-メディア-コメント自動返信-AI知識DB_V5.json' },
  { id: 'media-community-11lang', name: 'コミュニティ統治エージェント', nameJp: '🌐 コミュニティ統治エージェント-11言語対応', description: '11言語でコミュニティモデレーション', status: 'active', webhookPath: '/webhook/community-agent', aiComponents: ['claude', 'gemini'], jsonFile: '【メディア】23_90-メディア-コミュニティ統治エージェント-11言語対応_V5.json' },
  { id: 'media-legal-defense', name: 'リーガルディフェンス', nameJp: '⚖️ リーガルディフェンス-著作権異議自動生成', description: '著作権侵害クレームに対する異議申立書を自動生成', status: 'active', webhookPath: '/webhook/legal-defense', aiComponents: ['claude'], jsonFile: '【メディア】24_92-メディア-リーガルディフェンス-著作権異議自動生成_V5.json' },
  { id: 'media-dynamic-conversion', name: 'ダイナミックコンバージョン', nameJp: '💰 ダイナミックコンバージョン-クロスセールス', description: '動画内商品リンクを在庫連動で動的切替', status: 'partial', webhookPath: '/webhook/dynamic-conversion', aiComponents: ['none'], jsonFile: '【メディア】25_93-メディア-ダイナミックコンバージョン-クロスセールス_V5.json' },
  
  // === ナレッジ・LMS系 (5件) ===
  { id: 'media-knowledge-block', name: 'ナレッジブロック生成', nameJp: '📚 ナレッジブロック生成-NotebookLM級', description: 'PDF資料から100%ファクトチェック済み知識ブロックを生成', status: 'active', webhookPath: '/webhook/knowledge-block', aiComponents: ['gemini', 'claude'], jsonFile: '【メディア】04_81-メディア-ナレッジブロック生成_V6.json', techDetails: 'Vertex AI Search + 3段階AI監査' },
  { id: 'media-lms-parametric', name: 'パラメトリック問題生成', nameJp: '🎓 LMS-パラメトリック問題生成-無限類題エンジン', description: '数字/人物を書き換えた類題を無限生成', status: 'active', webhookPath: '/webhook/lms-parametric', aiComponents: ['claude', 'gpt4'], jsonFile: '【メディア】11_110-LMS-パラメトリック問題生成-無限類題エンジン_V5.json' },
  { id: 'media-lms-format', name: '問題形式コンバート', nameJp: '🔄 LMS-問題形式コンバート-多形式自動変換', description: '4択→穴埋め→記述式などフォーマット変換', status: 'active', webhookPath: '/webhook/lms-format', aiComponents: ['claude'], jsonFile: '【メディア】12_111-LMS-問題形式コンバート-多形式自動変換_V5.json' },
  { id: 'media-lms-weak-detect', name: '弱点検出', nameJp: '📊 LMS-弱点検出-再解説自動トリガー', description: 'ユーザーの弱点を検出して関連動画をレコメンド', status: 'active', webhookPath: '/webhook/lms-weak-points', aiComponents: ['gemini'], jsonFile: '【メディア】18_71-LMS-弱点検出-再解説自動トリガー_V5.json' },
  { id: 'media-knowledge-evolution', name: '知識進化サイクル', nameJp: '🧠 LMS-知識進化サイクル-自己修復', description: '法改正や新情報で知識DBを自動更新', status: 'partial', webhookPath: '/webhook/knowledge-evolution', aiComponents: ['gemini', 'claude'], jsonFile: '【メディア】30_99-LMS-知識進化サイクル-自己修復_V5.json' },
  
  // === インフラ・ブリッジ系 (3件) ===
  { id: 'media-bridge', name: 'メディアブリッジ', nameJp: '🌉 メディアブリッジ-media-bridge', description: 'メディア系ワークフロー間の連携ハブ', status: 'active', webhookPath: '/webhook/media-bridge', aiComponents: ['none'], jsonFile: '【メディア】14_50-メディアブリッジ-media-bridge_V5.json' },
  { id: 'media-asset-router', name: 'ユニバーサルアセットルーター', nameJp: '📁 ユニバーサルアセットルーター', description: 'MJ画像・音声クリップを最適ルーティング', status: 'active', webhookPath: '/webhook/asset-router', aiComponents: ['none'], jsonFile: '【メディア】19_80-メディア-ユニバーサルアセットルーター_V5.json' },
  { id: 'media-api-dispatcher', name: 'APIリソースディスパッチャー', nameJp: '⚡ APIリソースディスパッチャー-動的配分', description: 'チャンネルランクに応じてElevenLabs/OpenAI TTSを動的切替', status: 'active', webhookPath: '/webhook/api-dispatcher', aiComponents: ['none'], jsonFile: '【メディア】05_97-メディア-APIリソースディスパッチャー_V6.json', techDetails: 'Sランク=ElevenLabs, Bランク=OpenAI TTS' },
];

// メディアセクション概要コンポーネント
export function MediaOverview() {
  const stats = {
    total: MEDIA_WORKFLOWS.length,
    active: MEDIA_WORKFLOWS.filter(w => w.status === 'active').length,
    partial: MEDIA_WORKFLOWS.filter(w => w.status === 'partial').length,
    aiPowered: MEDIA_WORKFLOWS.filter(w => w.aiComponents.some(a => a !== 'none')).length,
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ padding: 16, background: 'linear-gradient(135deg, #f9731620, #ec489920)', border: '1px solid #f9731640', borderRadius: 12, marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#f97316' }}>🎬 N3 Empire OS - メディアセクション</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          35個のn8nワークフローで構成される全自動メディア帝国。Remotion動画生成、ElevenLabs音声、LivePortrait口パク、24時間ライブ配信、LMS学習システムを統合。
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: '総ワークフロー', value: stats.total, color: '#f97316' },
            { label: '稼働中', value: stats.active, color: '#10b981' },
            { label: '部分実装', value: stats.partial, color: '#f59e0b' },
            { label: 'AI搭載', value: stats.aiPowered, color: '#8b5cf6' },
          ].map(s => (
            <div key={s.label} style={{ padding: 12, background: 'var(--panel)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 機能カテゴリ */}
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>機能カテゴリ</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { icon: Film, label: '動画生成', desc: 'Remotion + Lambda + 指紋回避', count: 7, color: '#ec4899' },
          { icon: Mic, label: '音声・表情', desc: 'ElevenLabs + LivePortrait', count: 3, color: '#8b5cf6' },
          { icon: Sparkles, label: '視覚演出', desc: '桜井スタイル注釈 + DNA監査', count: 3, color: '#06b6d4' },
          { icon: Radio, label: 'ライブ配信', desc: '24h FFmpeg + OAuth', count: 2, color: '#ef4444' },
          { icon: Shield, label: 'コミュニティ', desc: '11言語対応 + 著作権防衛', count: 4, color: '#10b981' },
          { icon: BookOpen, label: 'LMS・知識', desc: 'パラメトリック問題 + 弱点分析', count: 5, color: '#f59e0b' },
        ].map(cat => (
          <div key={cat.label} style={{ padding: 12, background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <cat.icon size={18} style={{ color: cat.color }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{cat.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, padding: '2px 6px', background: cat.color + '20', color: cat.color, borderRadius: 4 }}>{cat.count}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cat.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 使い方マニュアル
export function MediaManual() {
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📖 Media Hub 使用マニュアル</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 動画生成 */}
        <section style={{ padding: 16, background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ec4899', marginBottom: 8 }}>🎬 動画生成の使い方</h3>
          <ol style={{ fontSize: 12, color: 'var(--text)', paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 6 }}>Media Hub → 「動画生成」タブを開く</li>
            <li style={{ marginBottom: 6 }}>チャンネルID（例: <code>ch_education_01</code>）を入力</li>
            <li style={{ marginBottom: 6 }}>動画タイプ（ロング/ショート）とジャンルを選択</li>
            <li style={{ marginBottom: 6 }}>「V6バイオノイズ」をONでデジタル指紋回避が有効</li>
            <li style={{ marginBottom: 6 }}>「動画生成を実行」をクリック → n8nワークフローが起動</li>
          </ol>
          <div style={{ marginTop: 8, padding: 8, background: '#ec489910', borderRadius: 6, fontSize: 11 }}>
            <strong>Webhook:</strong> <code>/webhook/video-generate-v6</code><br/>
            <strong>処理時間:</strong> 約5-10分（Lambdaレンダリング含む）
          </div>
        </section>

        {/* 音声生成 */}
        <section style={{ padding: 16, background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#8b5cf6', marginBottom: 8 }}>🎙️ 音声生成の使い方</h3>
          <ol style={{ fontSize: 12, color: 'var(--text)', paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 6 }}>Media Hub → 「音声生成」タブを開く</li>
            <li style={{ marginBottom: 6 }}>ナレーションテキストを入力（日本語OK）</li>
            <li style={{ marginBottom: 6 }}>ジャンルプリセットで声のトーンを選択</li>
            <li style={{ marginBottom: 6 }}>「Gemini感情AI」ONで文脈に応じた抑揚が自動付与</li>
            <li style={{ marginBottom: 6 }}>「バイオノイズ」ONで息継ぎ[breath]が自動挿入</li>
          </ol>
          <div style={{ marginTop: 8, padding: 8, background: '#8b5cf610', borderRadius: 6, fontSize: 11 }}>
            <strong>Webhook:</strong> <code>/webhook/voice-generate</code><br/>
            <strong>AI:</strong> Gemini 1.5 Flash（感情分析）+ ElevenLabs（音声合成）
          </div>
        </section>

        {/* ライブ配信 */}
        <section style={{ padding: 16, background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ef4444', marginBottom: 8 }}>📡 24時間ライブ配信の使い方</h3>
          <ol style={{ fontSize: 12, color: 'var(--text)', paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 6 }}>事前にYouTube OAuth認証を完了しておく</li>
            <li style={{ marginBottom: 6 }}>Media Hub → 「ライブ配信」タブを開く</li>
            <li style={{ marginBottom: 6 }}>チャンネルIDとプレイリストモードを選択</li>
            <li style={{ marginBottom: 6 }}>「収益優先」= 利益率の高い商品動画を優先ループ</li>
            <li style={{ marginBottom: 6 }}>「配信開始」でVPS上のFFmpegが起動</li>
          </ol>
          <div style={{ marginTop: 8, padding: 8, background: '#ef444410', borderRadius: 6, fontSize: 11 }}>
            <strong>Webhook:</strong> <code>/webhook/live-stream</code><br/>
            <strong>要件:</strong> VPS上のFFmpeg + YouTube Stream Key設定
          </div>
        </section>
      </div>
    </div>
  );
}

// 残り作業リスト
export function MediaTodoList() {
  const todos = [
    { done: true, task: 'DBスキーマ作成', detail: 'N3_MEDIA_ADDITIONAL_SCHEMA.sql をSupabaseに適用' },
    { done: true, task: 'n8nサービス作成', detail: 'lib/services/n8n/media-service.ts' },
    { done: true, task: 'Media Hub UI統合', detail: 'app/tools/media-hub/page.tsx' },
    { done: true, task: 'APIプロキシ作成', detail: 'app/api/media/webhook/route.ts' },
    { done: false, task: 'n8nワークフローActive確認', detail: 'VPS側でv6/v5ワークフローがActiveか確認' },
    { done: false, task: 'HMAC Secret設定', detail: '.env.localにN8N_HMAC_SECRETを追加' },
    { done: false, task: 'YouTube OAuth設定', detail: 'Google Cloud ConsoleでOAuth認証情報を設定' },
    { done: false, task: 'ElevenLabs APIキー設定', detail: 'n8n側のCredentialsにElevenLabs APIキーを設定' },
    { done: false, task: 'チャンネル管理UI完成', detail: 'media_channelsテーブルからの読み書きUI' },
    { done: false, task: '投稿キューUI完成', detail: 'content_master(scheduled)からの一覧表示' },
    { done: false, task: 'JSONワークフロー→VPSインポート', detail: '35個のJSONをn8nにインポート' },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📋 残り作業リスト</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {todos.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.done ? '#10b98120' : '#f59e0b20', color: t.done ? '#10b981' : '#f59e0b', fontSize: 12, fontWeight: 700 }}>
              {t.done ? '✓' : i + 1 - todos.filter((x, j) => j < i && x.done).length}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--text-muted)' : 'var(--text)' }}>{t.task}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default { MEDIA_WORKFLOWS, MediaOverview, MediaManual, MediaTodoList };
