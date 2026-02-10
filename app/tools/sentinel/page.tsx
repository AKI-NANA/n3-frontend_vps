// app/tools/sentinel/page.tsx
'use client';

import { BaseToolLayout, ToolConfig, ToolField } from '@/components/n3/empire';

const CONFIG: ToolConfig = {
  name: '【司令塔】09_Sentinel監視',
  nameEn: '09_Sentinel監視',
  category: 'system',
  webhookPath: 'sentinel',
  description: '【司令塔】09_Sentinel監視の実行画面',
  version: 'V5',
  security: 'C',
};

const FIELDS: ToolField[] = [
    { id: 'target', label: '対象システム', labelEn: 'Target System', type: 'select' as const, options: [
      { value: 'all', label: '全システム' },
      { value: 'n8n', label: 'n8n' },
    ]},
    { id: 'action', label: 'アクション', labelEn: 'Action', type: 'select' as const, options: [
      { value: 'health_check', label: 'ヘルスチェック' },
      { value: 'restart', label: '再起動' },
    ]},
  ];

export default function SentinelPage() {
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
