// app/tools/editing-n3/components/panels/n3-workflow-status-panel.tsx
/**
 * N3 ワークフローステータスパネル
 * 
 * n8nワークフローの実行状況とステータスを表示
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Clock,
  Activity,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import {
  WORKFLOW_REGISTRY,
  getWorkflowStats,
  getWorkflowsByCategory,
  WorkflowCategory,
  WorkflowStatus,
} from '@/lib/n8n/workflow-registry';

const CATEGORY_LABELS: Record<WorkflowCategory, string> = {
  listing: '出品',
  inventory: '在庫',
  research: 'リサーチ',
  orders: '注文',
  shipping: '配送',
  sync: '同期',
  ai: 'AI',
  pricing: '価格',
  translation: '翻訳',
  approval: '承認',
  notification: '通知',
  defense: '防衛',
  command: 'コマンド',
  media: 'メディア',
  finance: '財務',
  other: 'その他',
};

const CATEGORY_ICONS: Record<WorkflowCategory, string> = {
  listing: '📦',
  inventory: '📊',
  research: '🔍',
  orders: '📋',
  shipping: '🚚',
  sync: '🔄',
  ai: '🤖',
  pricing: '💰',
  translation: '🌐',
  approval: '✅',
  notification: '🔔',
  defense: '🛡️',
  command: '⚡',
  media: '🎬',
  finance: '💹',
  other: '📁',
};

const STATUS_CONFIG: Record<WorkflowStatus, { label: string; color: string; icon: React.ComponentType<any> }> = {
  active: {
    label: 'アクティブ',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  testing: {
    label: 'テスト中',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
  },
  deprecated: {
    label: '非推奨',
    color: 'bg-gray-100 text-gray-800',
    icon: XCircle,
  },
  error: {
    label: 'エラー',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
};

interface N8nHealth {
  n8nStatus: 'healthy' | 'unhealthy' | 'unreachable';
  timestamp: string;
}

export function N3WorkflowStatusPanel() {
  const [n8nHealth, setN8nHealth] = useState<N8nHealth | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  const stats = getWorkflowStats();

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // n8nヘルスチェック
  const checkN8nHealth = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/n8n-proxy', {
        method: 'GET',
      });
      const data = await response.json();
      setN8nHealth(data);
    } catch (error) {
      console.error('n8n health check failed:', error);
      setN8nHealth({
        n8nStatus: 'unreachable',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkN8nHealth();
    
    // 1分ごとに自動更新
    const interval = setInterval(checkN8nHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* ヘルスステータス */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                n8nステータス
              </CardTitle>
              <CardDescription>
                ワークフロー自動化エンジンの状態
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkN8nHealth}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* ステータスバッジ */}
            <div className="flex items-center gap-2">
              {n8nHealth?.n8nStatus === 'healthy' && (
                <>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    正常稼働中
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    VPS: 160.16.120.186:5678
                  </span>
                </>
              )}
              {n8nHealth?.n8nStatus === 'unhealthy' && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  異常検知
                </Badge>
              )}
              {n8nHealth?.n8nStatus === 'unreachable' && (
                <Badge className="bg-red-100 text-red-800">
                  <XCircle className="h-3 w-3 mr-1" />
                  接続不可
                </Badge>
              )}
            </div>

            {/* 最終確認時刻 */}
            {n8nHealth && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                最終確認: {new Date(n8nHealth.timestamp).toLocaleString('ja-JP')}
              </div>
            )}

            {/* n8nダッシュボードリンク */}
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => window.open('http://160.16.120.186:5678', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              n8nダッシュボードを開く
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ワークフロー統計 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            ワークフロー統計
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">総ワークフロー数</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-muted-foreground">アクティブ</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-yellow-600">{stats.testing}</div>
              <div className="text-sm text-muted-foreground">テスト中</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-600">{stats.deprecated}</div>
              <div className="text-sm text-muted-foreground">非推奨</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* カテゴリ別ワークフロー一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>ワークフロー一覧</CardTitle>
          <CardDescription>
            カテゴリ別に登録されているワークフローを表示
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(CATEGORY_LABELS).map(([category, label]) => {
              const workflows = getWorkflowsByCategory(category as WorkflowCategory);
              if (workflows.length === 0) return null;

              const isExpanded = expandedCategories.has(category);

              return (
                <div key={category} className="border rounded-lg">
                  {/* カテゴリヘッダー（クリック可能） */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full p-3 flex items-center justify-between hover:bg-accent/50 transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span className="text-xl">{CATEGORY_ICONS[category as WorkflowCategory]}</span>
                      <span className="font-medium">{label}</span>
                      <Badge variant="secondary" className="ml-2">
                        {workflows.length}
                      </Badge>
                    </div>
                  </button>

                  {/* ワークフロー一覧（展開時のみ表示） */}
                  {isExpanded && (
                    <div className="p-3 pt-0 space-y-3">
                      <Separator />
                      <div className="space-y-2">
                        {workflows.map(workflow => {
                          const StatusIcon = STATUS_CONFIG[workflow.status].icon;
                          
                          return (
                            <div
                              key={workflow.id}
                              className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-sm">{workflow.nameJa}</h4>
                                    <Badge className={STATUS_CONFIG[workflow.status].color}>
                                      <StatusIcon className="h-3 w-3 mr-1" />
                                      {STATUS_CONFIG[workflow.status].label}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {workflow.description}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <code className="px-1.5 py-0.5 rounded bg-muted">
                                      {workflow.webhookPath}
                                    </code>
                                    <span>v{workflow.version}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default N3WorkflowStatusPanel;
