// app/tools/media-audio-gen/page.tsx
'use client';

import { BaseToolLayout, ToolConfig, ToolField } from '@/components/n3/empire';

const CONFIG: ToolConfig = {
  name: '【メディア】M2_音声生成',
  nameEn: 'M2_音声生成',
  category: 'media',
  webhookPath: 'media-audio-gen',
  description: '【メディア】M2_音声生成の実行画面',
  version: 'V5',
  security: 'C',
};

const FIELDS: ToolField[] = [
    { id: 'channelId', label: 'チャンネルID', labelEn: 'Channel ID', type: 'text' as const, placeholder: 'ch_xxxxx' },
    { id: 'contentType', label: 'コンテンツタイプ', labelEn: 'Content Type', type: 'select' as const, options: [
      { value: 'video', label: '動画' },
      { value: 'short', label: 'ショート' },
    ]},
    { id: 'language', label: '言語', labelEn: 'Language', type: 'select' as const, options: [
      { value: 'ja', label: '日本語' },
      { value: 'en', label: '英語' },
    ]},
  ];

export default function MediaAudioGenPage() {
  return (
    <BaseToolLayout
      config={CONFIG}
      fields={FIELDS}
      customActions={[
        { id: 'test', label: 'テスト実行', onClick: () => alert('テスト実行'), variant: 'secondary' },
      ]}
    />
  );
}
