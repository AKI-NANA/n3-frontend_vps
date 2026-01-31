// app/tools/research-agent/page.tsx
/**
 * 🔍 【リサーチ】01_自律型リサーチAgent
 * 
 * LangGraph/AI Agentによる自律型商品リサーチツール
 * 工数95%削減を目指すAI進化ポテンシャル最高ランク
 */

'use client';

import { BaseToolLayout, ToolConfig, ToolField } from '@/components/n3/empire';
import { Search, Brain, Target, Zap } from 'lucide-react';

const CONFIG: ToolConfig = {
  name: '【リサーチ】01_自律型リサーチAgent',
  nameEn: 'Autonomous Research Agent',
  category: 'research',
  webhookPath: 'research-agent',
  description: 'LangGraph/AI Agentによる自律型商品リサーチ - キーワード発見、価格分析、競合調査を全自動実行',
  jsonFile: '【リサーチ】01_14-リサーチ-自律型リサーチエージェント_V5.json',
  version: 'V5',
  security: 'C',
  dbTables: ['research_results', 'products_master', 'market_data'],
};

const FIELDS: ToolField[] = [
  { 
    id: 'researchMode', 
    label: 'リサーチモード', 
    labelEn: 'Research Mode', 
    type: 'select', 
    required: true,
    defaultValue: 'keyword_discovery',
    options: [
      { value: 'keyword_discovery', label: '🔍 キーワード発見' },
      { value: 'competitor_analysis', label: '📊 競合分析' },
      { value: 'price_tracking', label: '💰 価格追跡' },
      { value: 'trend_detection', label: '📈 トレンド検知' },
      { value: 'full_scan', label: '🚀 フルスキャン（全機能）' },
    ],
    hint: 'リサーチの種類を選択'
  },
  { 
    id: 'category', 
    label: 'カテゴリ', 
    labelEn: 'Category', 
    type: 'select', 
    options: [
      { value: 'all', label: '全カテゴリ' },
      { value: 'trading_cards', label: 'トレーディングカード' },
      { value: 'electronics', label: '電子機器' },
      { value: 'collectibles', label: 'コレクティブル' },
      { value: 'books', label: '書籍' },
      { value: 'toys', label: 'おもちゃ' },
    ]
  },
  { 
    id: 'keywords', 
    label: 'シードキーワード', 
    labelEn: 'Seed Keywords', 
    type: 'textarea', 
    placeholder: 'Pokemon, MTG, Yu-Gi-Oh\n（改行区切りで複数指定可）',
    hint: 'リサーチの起点となるキーワード'
  },
  { 
    id: 'priceMin', 
    label: '最低価格 ($)', 
    labelEn: 'Min Price', 
    type: 'number', 
    placeholder: '0',
    defaultValue: 10
  },
  { 
    id: 'priceMax', 
    label: '最高価格 ($)', 
    labelEn: 'Max Price', 
    type: 'number', 
    placeholder: '10000',
    defaultValue: 5000
  },
  { 
    id: 'targetRegions', 
    label: '対象地域', 
    labelEn: 'Target Regions', 
    type: 'select', 
    defaultValue: 'us',
    options: [
      { value: 'us', label: '🇺🇸 US' },
      { value: 'uk', label: '🇬🇧 UK' },
      { value: 'de', label: '🇩🇪 DE' },
      { value: 'jp', label: '🇯🇵 JP' },
      { value: 'cn', label: '🇨🇳 CN' },
      { value: 'global', label: '🌍 グローバル（全地域）' },
    ]
  },
  { 
    id: 'aiModel', 
    label: 'AIモデル', 
    labelEn: 'AI Model', 
    type: 'select', 
    defaultValue: 'gemini',
    options: [
      { value: 'gemini', label: 'Gemini 1.5 Pro（推奨）' },
      { value: 'claude', label: 'Claude 3.5 Sonnet' },
      { value: 'gpt4', label: 'GPT-4o' },
      { value: 'deepseek', label: 'DeepSeek（低コスト）' },
      { value: 'ollama', label: 'Ollama（ローカル）' },
    ],
    hint: 'リサーチに使用するAIモデル'
  },
  { 
    id: 'maxResults', 
    label: '最大結果数', 
    labelEn: 'Max Results', 
    type: 'number', 
    defaultValue: 100,
    placeholder: '100',
    hint: '取得する最大商品数'
  },
  { 
    id: 'autoRegister', 
    label: '自動登録', 
    labelEn: 'Auto Register', 
    type: 'checkbox',
    defaultValue: false,
    hint: '発見した商品をproducts_masterに自動登録'
  },
  { 
    id: 'enableKnowledgeLoop', 
    label: 'Knowledge Loop有効', 
    labelEn: 'Enable Knowledge Loop', 
    type: 'checkbox',
    defaultValue: true,
    hint: '過去のリサーチ結果を学習に活用'
  },
];

export default function ResearchAgentPage() {
  return (
    <BaseToolLayout
      config={CONFIG}
      fields={FIELDS}
      customActions={[
        {
          id: 'quick_scan',
          label: 'クイックスキャン（5分）',
          icon: Search,
          onClick: () => alert('5分間の高速リサーチを実行'),
          variant: 'secondary',
        },
        {
          id: 'deep_analysis',
          label: 'ディープ分析（30分）',
          icon: Brain,
          onClick: () => alert('詳細な市場分析を実行'),
          variant: 'secondary',
        },
        {
          id: 'auto_hunt',
          label: '自動ハント開始',
          icon: Target,
          onClick: () => alert('24時間自動リサーチを開始'),
          variant: 'primary',
        },
      ]}
    />
  );
}
