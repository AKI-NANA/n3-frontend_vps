// app/tools/listing-lp-auto/page.tsx
'use client';

import { BaseToolLayout, ToolConfig, ToolField } from '@/components/n3/empire';

const CONFIG: ToolConfig = {
  name: '【出品】03_LP自動生成',
  nameEn: '03_LP自動生成',
  category: 'listing',
  webhookPath: 'listing-lp-auto',
  description: '【出品】03_LP自動生成の実行画面',
  version: 'V5',
  security: 'C',
};

const FIELDS: ToolField[] = [
    { id: 'productIds', label: '商品ID', labelEn: 'Product IDs', type: 'text' as const, placeholder: '123, 456' },
    { id: 'marketplace', label: 'マーケットプレイス', labelEn: 'Marketplace', type: 'select' as const, options: [
      { value: 'ebay_us', label: 'eBay US' },
      { value: 'amazon_us', label: 'Amazon US' },
    ]},
    { id: 'account', label: 'アカウント', labelEn: 'Account', type: 'select' as const, options: [
      { value: 'mjt', label: 'MJT' },
      { value: 'green', label: 'GREEN' },
    ]},
  ];

export default function ListingLpAutoPage() {
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
