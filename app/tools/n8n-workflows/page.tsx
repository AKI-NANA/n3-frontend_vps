// app/tools/n8n-workflows/page.tsx
'use client';

import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { WorkflowList } from './components/workflow-list';
import { N3Flex } from '@/components/n3/container/n3-section';
import { N3FilterTab } from '@/components/n3';
import { getWorkflowStats } from '@/lib/n8n/workflow-registry';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'すべて',
  listing: '📦 出品',
  inventory: '📊 在庫',
  research: '🔍 リサーチ',
  orders: '📋 注文',
  shipping: '🚚 配送',
  sync: '🔄 同期',
  ai: '🤖 AI',
  pricing: '💰 価格',
  translation: '🌐 翻訳',
  approval: '✅ 承認',
  notification: '🔔 通知',
  defense: '🛡️ 防衛',
  command: '⚡ コマンド',
  media: '🎬 メディア',
  finance: '💹 財務',
  other: '📁 その他',
};

export default function N8nWorkflowsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');

  const stats = getWorkflowStats();

  // カテゴリタブ
  const categoryTabs = [
    { id: 'all', label: 'すべて', count: stats.total },
    ...Object.entries(stats.byCategory).map(([cat, count]) => ({
      id: cat,
      label: CATEGORY_LABELS[cat] || cat,
      count,
    })),
  ];

  // ステータスフィルター
  const statusFilters = [
    { id: 'all', label: 'すべて' },
    { id: 'active', label: 'アクティブ', color: 'green' as const },
    { id: 'testing', label: 'テスト中', color: 'yellow' as const },
    { id: 'deprecated', label: '非推奨', color: 'gray' as const },
  ];

  return (
    <N3Flex
      direction="column"
      gap="none"
      style={{
        height: 'calc(100vh - 60px)',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* ヘッダー */}
      <N3Flex
        direction="column"
        gap="none"
        style={{
          background: 'var(--panel)',
          borderBottom: '1px solid var(--panel-border)',
          padding: '16px 24px',
        }}
      >
        <N3Flex align="center" gap="sm" style={{ marginBottom: '12px' }}>
          <Zap size={24} style={{ color: '#f97316' }} />
          <div>
            <h1 className="text-xl font-bold">n8nワークフロー管理</h1>
            <p className="text-sm text-muted-foreground">
              登録: {stats.total}件 / アクティブ: {stats.active}件
            </p>
          </div>
        </N3Flex>

        {/* カテゴリタブ */}
        <N3Flex gap="xs" wrap style={{ marginBottom: '12px' }}>
          {categoryTabs.map(tab => (
            <N3FilterTab
              key={tab.id}
              active={activeCategory === tab.id}
              onClick={() => setActiveCategory(tab.id)}
              count={tab.count}
            >
              {tab.label}
            </N3FilterTab>
          ))}
        </N3Flex>

        {/* ステータスフィルター */}
        <N3Flex gap="xs" wrap>
          {statusFilters.map(filter => (
            <N3FilterTab
              key={filter.id}
              active={activeStatus === filter.id}
              onClick={() => setActiveStatus(filter.id)}
              color={filter.color}
            >
              {filter.label}
            </N3FilterTab>
          ))}
        </N3Flex>
      </N3Flex>

      {/* コンテンツエリア */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <WorkflowList category={activeCategory} status={activeStatus} />
      </div>
    </N3Flex>
  );
}
