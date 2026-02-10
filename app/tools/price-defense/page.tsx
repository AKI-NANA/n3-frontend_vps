// app/tools/price-defense/page.tsx
/**
 * 🛡️ 【在庫】15_インテリジェント在庫価格防衛
 * 
 * AI価格防衛システム - 赤字100%防止を目指すガードレール
 * 帝国台帳でAI進化ポテンシャル最高ランク
 */

'use client';

import { BaseToolLayout, ToolConfig, ToolField } from '@/components/n3/empire';
import { Shield, AlertTriangle, TrendingDown, Zap } from 'lucide-react';

const CONFIG: ToolConfig = {
  name: '【在庫】15_インテリジェント在庫価格防衛',
  nameEn: 'Intelligent Price Defense',
  category: 'inventory',
  webhookPath: 'price-defense',
  description: 'AI価格防衛システム - 為替急変、競合価格下落、在庫切れリスクを自動検知・対処',
  jsonFile: '【在庫】15_専用-防衛-インテリジェント在庫価格防衛_V5.json',
  version: 'V5',
  security: 'B',
  dbTables: ['price_history', 'products_master', 'alerts'],
};

const FIELDS: ToolField[] = [
  { 
    id: 'defenseMode', 
    label: '防衛モード', 
    labelEn: 'Defense Mode', 
    type: 'select', 
    required: true,
    defaultValue: 'monitor',
    options: [
      { value: 'monitor', label: '👁️ 監視モード（通知のみ）' },
      { value: 'semi_auto', label: '⚡ 半自動（承認後に実行）' },
      { value: 'full_auto', label: '🤖 全自動（即座に実行）' },
    ],
    hint: '価格調整の自動化レベル'
  },
  { 
    id: 'targetPlatforms', 
    label: '対象プラットフォーム', 
    labelEn: 'Target Platforms', 
    type: 'select', 
    defaultValue: 'all',
    options: [
      { value: 'all', label: '全プラットフォーム' },
      { value: 'ebay', label: 'eBay' },
      { value: 'amazon', label: 'Amazon' },
      { value: 'mercari', label: 'メルカリ' },
      { value: 'qoo10', label: 'Qoo10' },
    ]
  },
  { 
    id: 'account', 
    label: 'アカウント', 
    labelEn: 'Account', 
    type: 'select', 
    defaultValue: 'all',
    options: [
      { value: 'all', label: '全アカウント' },
      { value: 'mjt', label: 'MJT' },
      { value: 'green', label: 'GREEN' },
    ]
  },
  { 
    id: 'priceDropThreshold', 
    label: '価格下落閾値 (%)', 
    labelEn: 'Price Drop Threshold', 
    type: 'number', 
    defaultValue: 10,
    placeholder: '10',
    hint: '競合がこの%以上値下げしたらアラート'
  },
  { 
    id: 'minProfitMargin', 
    label: '最低利益率 (%)', 
    labelEn: 'Min Profit Margin', 
    type: 'number', 
    defaultValue: 15,
    placeholder: '15',
    hint: 'これを下回る価格設定は禁止'
  },
  { 
    id: 'fxAlertThreshold', 
    label: '為替変動閾値 (%)', 
    labelEn: 'FX Alert Threshold', 
    type: 'number', 
    defaultValue: 3,
    placeholder: '3',
    hint: '為替がこの%以上変動したらアラート'
  },
  { 
    id: 'stockOutAction', 
    label: '在庫切れ時アクション', 
    labelEn: 'Stock Out Action', 
    type: 'select', 
    defaultValue: 'suspend',
    options: [
      { value: 'suspend', label: '出品停止' },
      { value: 'raise_price', label: '価格200%に変更' },
      { value: 'notify_only', label: '通知のみ' },
    ]
  },
  { 
    id: 'enableAIPrediction', 
    label: 'AI価格予測', 
    labelEn: 'AI Price Prediction', 
    type: 'checkbox',
    defaultValue: true,
    hint: 'AIによる価格変動予測を有効化'
  },
  { 
    id: 'enableSelfHealing', 
    label: '自己修復モード', 
    labelEn: 'Self Healing Mode', 
    type: 'checkbox',
    defaultValue: false,
    hint: 'LangGraphによるエラー自動修復'
  },
  { 
    id: 'notifyChannels', 
    label: '通知先', 
    labelEn: 'Notification Channels', 
    type: 'select', 
    defaultValue: 'chatwork',
    options: [
      { value: 'chatwork', label: 'ChatWork' },
      { value: 'slack', label: 'Slack' },
      { value: 'email', label: 'Email' },
      { value: 'all', label: '全チャンネル' },
    ]
  },
];

export default function PriceDefensePage() {
  return (
    <BaseToolLayout
      config={CONFIG}
      fields={FIELDS}
      customActions={[
        {
          id: 'scan_now',
          label: '即時スキャン',
          icon: Shield,
          onClick: () => alert('全商品の価格リスクをスキャン'),
          variant: 'secondary',
        },
        {
          id: 'view_alerts',
          label: 'アラート一覧',
          icon: AlertTriangle,
          onClick: () => alert('未対応アラートを表示'),
          variant: 'secondary',
        },
        {
          id: 'emergency_stop',
          label: '緊急停止',
          icon: TrendingDown,
          onClick: () => {
            if (confirm('全ての自動価格調整を停止しますか？')) {
              alert('緊急停止を実行しました');
            }
          },
          variant: 'danger',
        },
      ]}
    />
  );
}
