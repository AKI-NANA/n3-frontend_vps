// app/tools/arbitrage-scan/page.tsx
'use client';

import { BaseToolLayout, ToolConfig, ToolField } from '@/components/n3/empire';

const CONFIG: ToolConfig = {
  name: '【リサーチ】04_クロスリージョンArb',
  nameEn: '04_クロスリージョンArb',
  category: 'research',
  webhookPath: 'arbitrage-scan',
  description: '【リサーチ】04_クロスリージョンArbの実行画面',
  version: 'V5',
  security: 'C',
};

const FIELDS: ToolField[] = [
    { id: 'keywords', label: 'キーワード', labelEn: 'Keywords', type: 'text' as const, placeholder: '検索キーワード' },
    { id: 'priceMin', label: '最低価格', labelEn: 'Min Price', type: 'number' as const, placeholder: '0' },
    { id: 'priceMax', label: '最高価格', labelEn: 'Max Price', type: 'number' as const, placeholder: '100000' },
  ];

export default function ArbitrageScanPage() {
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
