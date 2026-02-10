// app/tools/defense-ban/page.tsx
'use client';

import { BaseToolLayout, ToolConfig, ToolField } from '@/components/n3/empire';

const CONFIG: ToolConfig = {
  name: '【防衛】02_BAN検知',
  nameEn: '02_BAN検知',
  category: 'defense',
  webhookPath: 'defense-ban',
  description: '【防衛】02_BAN検知の実行画面',
  version: 'V5',
  security: 'C',
};

const FIELDS: ToolField[] = [
    { id: 'alertType', label: 'アラートタイプ', labelEn: 'Alert Type', type: 'select' as const, options: [
      { value: 'copyright', label: '著作権' },
      { value: 'ban', label: 'BAN検知' },
    ]},
    { id: 'autoAction', label: '自動アクション', labelEn: 'Auto Action', type: 'checkbox' as const },
  ];

export default function DefenseBanPage() {
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
