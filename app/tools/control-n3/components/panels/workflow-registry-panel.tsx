// app/tools/control-n3/components/panels/workflow-registry-panel.tsx
/**
 * N8n Workflow Registry Panel
 * 
 * n8n-workflows/PRODUCTION内のJSONを一覧表示し、
 * Webhook経由で実行できるパネル
 * 
 * 設計原則:
 * - 新規ページを作らず、control-n3のタブとして統合
 * - 芹井メソッド: UIは操作盤、実働はn8n Webhook
 */

'use client';

import React, { useState, useCallback, memo, useMemo } from 'react';
import {
  Play, Pause, RefreshCw, Filter, Search, ChevronRight,
  CheckCircle, XCircle, Clock, AlertTriangle, ExternalLink,
  Zap, Database, Package, Truck, DollarSign, Globe, Shield,
  Terminal, FileText, Settings, Bot, Eye, Copy, Check,
} from 'lucide-react';
import {
  N8N_WORKFLOW_REGISTRY,
  getWorkflowsByCategory,
  getCategoryLabel,
  getCategoryColor,
  type WorkflowCategory,
  type N8nWorkflow,
} from '@/lib/n8n/workflow-registry';

// ============================================================
// 定数
// ============================================================

const CATEGORY_ICONS: Record<WorkflowCategory, React.ElementType> = {
  listing: Package,
  inventory: Database,
  research: Eye,
  orders: FileText,
  shipping: Truck,
  sync: RefreshCw,
  ai: Bot,
  pricing: DollarSign,
  translation: Globe,
  approval: CheckCircle,
  notification: Zap,
  defense: Shield,
  command: Terminal,
  media: Play,
  finance: DollarSign,
  other: Settings,
};

const STATUS_COLORS: Record<string, string> = {
  active: '#10B981',
  testing: '#F59E0B',
  deprecated: '#6B7280',
  error: '#EF4444',
};

// ============================================================
// サブコンポーネント
// ============================================================

const CategoryFilter = memo(function CategoryFilter({
  selectedCategory,
  onSelect,
}: {
  selectedCategory: WorkflowCategory | 'all';
  onSelect: (category: WorkflowCategory | 'all') => void;
}) {
  const counts = useMemo(() => {
    const result: Record<string, number> = { all: N8N_WORKFLOW_REGISTRY.length };
    N8N_WORKFLOW_REGISTRY.forEach(w => {
      result[w.category] = (result[w.category] || 0) + 1;
    });
    return result;
  }, []);

  return (
    <div style={{
      display: 'flex',
      gap: 4,
      padding: '8px 12px',
      overflowX: 'auto',
      borderBottom: '1px solid var(--panel-border)',
    }}>
      <button
        onClick={() => onSelect('all')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 6,
          border: 'none',
          background: selectedCategory === 'all' ? 'var(--accent)' : 'var(--panel-alt)',
          color: selectedCategory === 'all' ? 'white' : 'var(--text-muted)',
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        <Filter size={14} />
        全て ({counts.all})
      </button>
      {(Object.keys(CATEGORY_ICONS) as WorkflowCategory[]).map(cat => {
        const Icon = CATEGORY_ICONS[cat];
        const count = counts[cat] || 0;
        if (count === 0) return null;
        
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 6,
              border: 'none',
              background: selectedCategory === cat ? getCategoryColor(cat) : 'var(--panel-alt)',
              color: selectedCategory === cat ? 'white' : 'var(--text-muted)',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon size={14} />
            {getCategoryLabel(cat)} ({count})
          </button>
        );
      })}
    </div>
  );
});

const WorkflowCard = memo(function WorkflowCard({
  workflow,
  onExecute,
  isExecuting,
}: {
  workflow: N8nWorkflow;
  onExecute: (workflow: N8nWorkflow) => void;
  isExecuting: boolean;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyWebhook = () => {
    const fullUrl = `http://160.16.120.186:5678${workflow.webhookPath}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CategoryIcon = CATEGORY_ICONS[workflow.category];

  return (
    <div
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 16,
          cursor: 'pointer',
        }}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: `${getCategoryColor(workflow.category)}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <CategoryIcon size={20} style={{ color: getCategoryColor(workflow.category) }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{workflow.nameJa}</span>
            <span
              style={{
                padding: '2px 6px',
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 600,
                background: `${STATUS_COLORS[workflow.status]}20`,
                color: STATUS_COLORS[workflow.status],
              }}
            >
              {workflow.status}
            </span>
            <span
              style={{
                padding: '2px 6px',
                borderRadius: 4,
                fontSize: 10,
                background: 'var(--panel-alt)',
                color: 'var(--text-muted)',
              }}
            >
              {workflow.version}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            {workflow.description}
          </div>
        </div>

        <ChevronRight
          size={16}
          style={{
            color: 'var(--text-muted)',
            transform: showDetails ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.2s',
          }}
        />
      </div>

      {/* 詳細（展開時） */}
      {showDetails && (
        <div
          style={{
            padding: '0 16px 16px',
            borderTop: '1px solid var(--panel-border)',
          }}
        >
          <div style={{ paddingTop: 12 }}>
            {/* Webhook情報 */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                Webhook Path
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  background: 'var(--bg)',
                  borderRadius: 6,
                  fontFamily: 'monospace',
                  fontSize: 12,
                }}
              >
                <code style={{ flex: 1, color: 'var(--accent)' }}>{workflow.webhookPath}</code>
                <button
                  onClick={handleCopyWebhook}
                  style={{
                    padding: 4,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                  title="URLをコピー"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* UI配置情報 */}
            {workflow.uiLocation && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                  UI配置場所
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                  }}
                >
                  <span
                    style={{
                      padding: '4px 8px',
                      background: 'var(--accent)',
                      color: 'white',
                      borderRadius: 4,
                    }}
                  >
                    {workflow.uiLocation.tab}
                  </span>
                  {workflow.uiLocation.l2Tab && (
                    <>
                      <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
                      <span
                        style={{
                          padding: '4px 8px',
                          background: 'var(--panel-alt)',
                          borderRadius: 4,
                        }}
                      >
                        {workflow.uiLocation.l2Tab}
                      </span>
                    </>
                  )}
                  {workflow.uiLocation.l3Filter && (
                    <>
                      <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
                      <span
                        style={{
                          padding: '4px 8px',
                          background: 'var(--panel-alt)',
                          borderRadius: 4,
                        }}
                      >
                        {workflow.uiLocation.l3Filter}
                      </span>
                    </>
                  )}
                </div>
                <div style={{ marginTop: 8 }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      background: getCategoryColor(workflow.category),
                      color: 'white',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {workflow.uiLocation.buttonLabel}
                  </span>
                </div>
              </div>
            )}

            {/* 必要な入力 */}
            {workflow.requiredInputs && workflow.requiredInputs.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                  必要な入力パラメータ
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {workflow.requiredInputs.map(input => (
                    <span
                      key={input}
                      style={{
                        padding: '2px 8px',
                        background: 'var(--panel-alt)',
                        borderRadius: 4,
                        fontSize: 11,
                        fontFamily: 'monospace',
                      }}
                    >
                      {input}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* JSONファイル */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                JSONファイル
              </div>
              <code
                style={{
                  display: 'block',
                  padding: '8px 12px',
                  background: 'var(--bg)',
                  borderRadius: 6,
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  wordBreak: 'break-all',
                }}
              >
                {workflow.jsonFile}
              </code>
            </div>

            {/* アクションボタン */}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button
                onClick={() => onExecute(workflow)}
                disabled={isExecuting || workflow.status !== 'active'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: workflow.status === 'active' ? getCategoryColor(workflow.category) : 'var(--panel-alt)',
                  color: workflow.status === 'active' ? 'white' : 'var(--text-muted)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: workflow.status === 'active' ? 'pointer' : 'not-allowed',
                  opacity: isExecuting ? 0.7 : 1,
                }}
              >
                {isExecuting ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Play size={14} />
                )}
                テスト実行
              </button>
              <a
                href={`http://160.16.120.186:5678`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid var(--panel-border)',
                  background: 'var(--panel-alt)',
                  color: 'var(--text)',
                  fontSize: 13,
                  textDecoration: 'none',
                }}
              >
                <ExternalLink size={14} />
                n8nで開く
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export function WorkflowRegistryPanel() {
  const [selectedCategory, setSelectedCategory] = useState<WorkflowCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // フィルタリング
  const filteredWorkflows = useMemo(() => {
    let workflows = selectedCategory === 'all'
      ? N8N_WORKFLOW_REGISTRY
      : getWorkflowsByCategory(selectedCategory);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      workflows = workflows.filter(
        w =>
          w.name.toLowerCase().includes(query) ||
          w.nameJa.includes(query) ||
          w.description.toLowerCase().includes(query)
      );
    }

    return workflows;
  }, [selectedCategory, searchQuery]);

  // ワークフロー実行
  const handleExecute = useCallback(async (workflow: N8nWorkflow) => {
    setExecutingId(workflow.id);
    try {
      const response = await fetch('/api/n8n-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: workflow.webhookPath.replace('/webhook/', ''),
          data: {
            action: 'test',
            source: 'control-n3-registry',
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setToast({ message: `✅ ${workflow.nameJa} を実行しました`, type: 'success' });
      } else {
        setToast({ message: `❌ エラー: ${data.message || 'Unknown error'}`, type: 'error' });
      }
    } catch (error: any) {
      setToast({ message: `❌ エラー: ${error.message}`, type: 'error' });
    } finally {
      setExecutingId(null);
      setTimeout(() => setToast(null), 3000);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 16,
          borderBottom: '1px solid var(--panel-border)',
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
          n8n Workflow Registry
        </h3>
        <span
          style={{
            padding: '4px 8px',
            background: 'var(--accent)',
            color: 'white',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {filteredWorkflows.length} ワークフロー
        </span>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            background: 'var(--panel-alt)',
            borderRadius: 6,
          }}
        >
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="検索..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: 'var(--text)',
              fontSize: 13,
              width: 150,
            }}
          />
        </div>
      </div>

      {/* カテゴリフィルター */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* ワークフロー一覧 */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 16,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredWorkflows.length === 0 ? (
            <div
              style={{
                padding: 48,
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <Terminal size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
              <div>ワークフローが見つかりません</div>
            </div>
          ) : (
            filteredWorkflows.map(workflow => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onExecute={handleExecute}
                isExecuting={executingId === workflow.id}
              />
            ))
          )}
        </div>
      </div>

      {/* トースト */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            padding: '12px 20px',
            borderRadius: 8,
            background: toast.type === 'success' ? '#10B981' : '#EF4444',
            color: 'white',
            fontSize: 14,
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default WorkflowRegistryPanel;
