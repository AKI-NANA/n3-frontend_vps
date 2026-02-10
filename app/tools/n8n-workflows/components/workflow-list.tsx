// app/tools/n8n-workflows/components/workflow-list.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, CheckCircle, AlertCircle, XCircle, FileJson, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WORKFLOW_REGISTRY, getWorkflowStats } from '@/lib/n8n/workflow-registry';
import { N3Flex, N3Grid } from '@/components/n3/container/n3-section';

const CATEGORY_LABELS: Record<string, string> = {
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

interface WorkflowListProps {
  category?: string;
  status?: string;
}

export function WorkflowList({ category = 'all', status = 'all' }: WorkflowListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const stats = useMemo(() => getWorkflowStats(), []);

  const filteredWorkflows = useMemo(() => {
    let filtered = WORKFLOW_REGISTRY;

    if (category !== 'all') {
      filtered = filtered.filter(w => w.category === category);
    }

    if (status !== 'all') {
      filtered = filtered.filter(w => w.status === status);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        w =>
          w.nameJa.toLowerCase().includes(query) ||
          w.nameEn.toLowerCase().includes(query) ||
          w.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [category, status, searchQuery]);

  return (
    <N3Flex direction="column" gap="md" style={{ padding: '24px', height: '100%', overflow: 'auto' }}>
      {/* 統計カード */}
      <N3Grid columns={4} gap="md">
        <Card style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">総数</div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}>
          <CardContent className="p-4">
            <div className="text-sm text-green-600 mb-1 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              アクティブ
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}>
          <CardContent className="p-4">
            <div className="text-sm text-yellow-600 mb-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              テスト中
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.testing || 0}</div>
          </CardContent>
        </Card>
        <Card style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              非推奨
            </div>
            <div className="text-3xl font-bold text-gray-600">{stats.deprecated || 0}</div>
          </CardContent>
        </Card>
      </N3Grid>

      {/* 検索バー */}
      <N3Flex gap="sm" align="center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ワークフロー名、説明で検索..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--panel-border)',
              color: 'var(--text)',
            }}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open('http://160.16.120.186:5678', '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          n8nダッシュボード
        </Button>
      </N3Flex>

      {/* 結果表示 */}
      <div className="text-sm text-muted-foreground">
        {filteredWorkflows.length}件のワークフローを表示中
      </div>

      {/* ワークフロー一覧 */}
      <N3Flex direction="column" gap="sm">
        {filteredWorkflows.map(workflow => (
          <Card
            key={workflow.id}
            className="transition-all hover:shadow-md"
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--panel-border)',
            }}
          >
            <CardContent className="p-5">
              <N3Flex direction="column" gap="sm">
                {/* ヘッダー */}
                <N3Flex justify="space-between" align="start" gap="md">
                  <N3Flex direction="column" gap="xs" style={{ flex: 1 }}>
                    <N3Flex gap="sm" align="center" wrap>
                      <h3 className="text-lg font-bold">{workflow.nameJa}</h3>
                      <Badge
                        style={{
                          background:
                            workflow.status === 'active'
                              ? '#dcfce7'
                              : workflow.status === 'testing'
                              ? '#fef3c7'
                              : '#f3f4f6',
                          color:
                            workflow.status === 'active'
                              ? '#15803d'
                              : workflow.status === 'testing'
                              ? '#a16207'
                              : '#4b5563',
                        }}
                      >
                        {workflow.status === 'active' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            稼働中
                          </>
                        ) : workflow.status === 'testing' ? (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            テスト中
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            非推奨
                          </>
                        )}
                      </Badge>
                      <Badge variant="secondary">{CATEGORY_LABELS[workflow.category]}</Badge>
                      <Badge variant="outline">v{workflow.version}</Badge>
                    </N3Flex>
                    <div className="text-sm text-muted-foreground">{workflow.nameEn}</div>
                  </N3Flex>
                </N3Flex>

                {/* 説明 */}
                <p className="text-sm">{workflow.description}</p>

                {/* フッター */}
                <N3Flex
                  justify="space-between"
                  align="center"
                  gap="md"
                  wrap
                  style={{ paddingTop: '12px', borderTop: '1px solid var(--panel-border)' }}
                >
                  <code
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      background: 'var(--highlight)',
                      color: '#f97316',
                      fontFamily: 'monospace',
                    }}
                  >
                    {workflow.webhookPath}
                  </code>
                  <N3Flex gap="xs">
                    <Button variant="outline" size="sm">
                      <FileJson className="h-3 w-3 mr-1" />
                      詳細
                    </Button>
                    {workflow.status === 'active' && (
                      <Button size="sm" style={{ background: '#f97316', color: 'white' }}>
                        <Play className="h-3 w-3 mr-1" />
                        実行
                      </Button>
                    )}
                  </N3Flex>
                </N3Flex>
              </N3Flex>
            </CardContent>
          </Card>
        ))}
      </N3Flex>
    </N3Flex>
  );
}
