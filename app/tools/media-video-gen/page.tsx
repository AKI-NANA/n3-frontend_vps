// app/tools/media-video-gen/page.tsx
/**
 * 🎬 【メディア】M1_Remotion動画生成
 * 
 * Remotionによるプログラマティック動画生成ツール
 * Empire OS のメディアセクション中核ツール
 */

'use client';

import { BaseToolLayout, ToolConfig, ToolField } from '@/components/n3/empire';
import { Video, Sparkles, Wand2 } from 'lucide-react';

const CONFIG: ToolConfig = {
  name: '【メディア】M1_Remotion動画生成',
  nameEn: 'Remotion Video Generation',
  category: 'media',
  webhookPath: 'media-video-gen',
  description: 'Remotionによるプログラマティック動画生成 - 物理演算(Spring)、AI挿絵、テロップ同期',
  jsonFile: '【メディア】M1_Remotion動画生成-プログラマティック_V6.json',
  version: 'V6',
  security: 'B',
  dbTables: ['media_content', 'channels', 'scripts'],
};

const FIELDS: ToolField[] = [
  { 
    id: 'channelId', 
    label: 'チャンネルID', 
    labelEn: 'Channel ID', 
    type: 'text', 
    placeholder: 'ch_xxxxx',
    required: true,
    hint: '動画を生成するチャンネルのID'
  },
  { 
    id: 'scriptId', 
    label: '脚本ID', 
    labelEn: 'Script ID', 
    type: 'text', 
    placeholder: 'script_xxxxx',
    required: true,
    hint: '事前に生成された脚本のID'
  },
  { 
    id: 'contentType', 
    label: 'コンテンツタイプ', 
    labelEn: 'Content Type', 
    type: 'select', 
    required: true,
    options: [
      { value: 'long_video', label: 'ロング動画 (16:9)' },
      { value: 'short_video', label: 'ショート動画 (9:16)' },
      { value: 'thumbnail_only', label: 'サムネイルのみ' },
    ]
  },
  { 
    id: 'language', 
    label: '言語', 
    labelEn: 'Language', 
    type: 'select', 
    defaultValue: 'ja',
    options: [
      { value: 'ja', label: '日本語' },
      { value: 'en', label: '英語' },
      { value: 'zh', label: '中国語' },
      { value: 'ko', label: '韓国語' },
      { value: 'es', label: 'スペイン語' },
      { value: 'de', label: 'ドイツ語' },
      { value: 'fr', label: 'フランス語' },
    ]
  },
  { 
    id: 'voiceId', 
    label: '音声ID (ElevenLabs)', 
    labelEn: 'Voice ID', 
    type: 'text', 
    placeholder: 'voice_xxxxx',
    hint: 'ElevenLabsの音声ID（空欄でチャンネルデフォルト使用）'
  },
  { 
    id: 'templateId', 
    label: 'テンプレートID', 
    labelEn: 'Template ID', 
    type: 'select', 
    defaultValue: 'education_basic',
    options: [
      { value: 'education_basic', label: '教育系（基本）' },
      { value: 'education_advanced', label: '教育系（高度）' },
      { value: 'news', label: 'ニュース系' },
      { value: 'entertainment', label: 'エンタメ系' },
      { value: 'gadget_review', label: 'ガジェットレビュー' },
    ]
  },
  { 
    id: 'hasAvatar', 
    label: 'AIアバター使用', 
    labelEn: 'Use AI Avatar', 
    type: 'checkbox',
    defaultValue: true,
    hint: 'MJキャラクターを使用した動的アバター表示'
  },
  { 
    id: 'addParticles', 
    label: 'パーティクル演出', 
    labelEn: 'Add Particles', 
    type: 'checkbox',
    defaultValue: true,
    hint: '背景パーティクル（AI判定回避用）'
  },
  { 
    id: 'resolution', 
    label: '解像度', 
    labelEn: 'Resolution', 
    type: 'select', 
    defaultValue: '4k',
    options: [
      { value: '4k', label: '4K (3840x2160)' },
      { value: '1080p', label: '1080p (1920x1080)' },
      { value: '720p', label: '720p (1280x720)' },
    ]
  },
];

export default function MediaVideoGenPage() {
  return (
    <BaseToolLayout
      config={CONFIG}
      fields={FIELDS}
      customActions={[
        {
          id: 'preview',
          label: 'プレビュー生成',
          icon: Video,
          onClick: () => alert('プレビュー生成（最初の30秒のみ）'),
          variant: 'secondary',
        },
        {
          id: 'ai_enhance',
          label: 'AI演出強化',
          icon: Sparkles,
          onClick: () => alert('AI演出パラメータを自動最適化'),
          variant: 'secondary',
        },
        {
          id: 'batch_generate',
          label: 'バッチ生成',
          icon: Wand2,
          onClick: () => alert('複数動画を一括生成'),
          variant: 'primary',
        },
      ]}
    />
  );
}
