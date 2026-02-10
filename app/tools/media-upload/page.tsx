// app/tools/media-upload/page.tsx
'use client';

import { BaseToolLayout, ToolConfig, ToolField } from '@/components/n3/empire';

const CONFIG: ToolConfig = {
  name: '【メディア】08_YouTube自動アップロード',
  nameEn: '08_YouTube自動アップロード',
  category: 'media',
  webhookPath: 'media-upload',
  description: '【メディア】08_YouTube自動アップロードの実行画面',
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

export default function MediaUploadPage() {
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
