// app/tools/defense-copyright/page.tsx
'use client';

import { BaseToolLayout, ToolConfig, ToolField } from '@/components/n3/empire';

const CONFIG: ToolConfig = {
  name: '【防衛】01_著作権警告自動防衛',
  nameEn: '01_著作権警告自動防衛',
  category: 'defense',
  webhookPath: 'defense-copyright',
  description: '【防衛】01_著作権警告自動防衛の実行画面',
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

export default function DefenseCopyrightPage() {
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
