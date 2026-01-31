// app/tools/control-n3/components/views/workflow-monitor-view.tsx
/**
 * ワークフロー監視ビュー
 * - editing-n3のN3BasicEditViewをベースに
 * - ワークフローのステータス一覧表示
 */
'use client';

import React, { memo, useState } from 'react';
import {
  Activity, Package, DollarSign, Database, Truck, Zap, Settings,
  ShoppingCart, TrendingUp, TrendingDown, Minus,
  CheckCircle, AlertTriangle, XCircle, Clock,
  ChevronDown, ChevronRight, Eye
} from 'lucide-react';
import { N3FilterTab, N3Divider } from '@/components/n3';
import type { WorkflowStatus, AuditIssue } from '../../hooks/use-control-data';

// ============================================================================
// 型定義
// ============================================================================
interface WorkflowMonitorViewProps {
  workflows: WorkflowStatus[];
  issues: AuditIssue[];
  loading: boolean;
  error: string | null;
  filterStatus: string;
  filterCategory: string;
  searchQuery: string;
  onFilterStatusChange: (status: string) => void;
  onFilterCategoryChange: (category: string) => void;
  onSearchQueryChange: (query: string) => void;
  onViewIssueDetails: (issue: AuditIssue) => void;
}

// ============================================================================
// カテゴリアイコン
// ============================================================================
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'listing': return <Package size={14} />;
    case 'pricing': return <DollarSign size={14} />;
    case 'inventory': return <Database size={14} />;
    case 'shipping': return <Truck size={14} />;
    case 'api': return <Zap size={14} />;
    case 'order': return <ShoppingCart size={14} />;
    case 'system': return <Settings size={14} />;
    default: return <Activity size={14} />;
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'listing': return '出品';
    case 'pricing': return '価格';
    case 'inventory': return '在庫';
    case 'shipping': return '配送';
    case 'api': return 'API';
    case 'order': return '受注';
    case 'system': return 'システム';
    default: return category;
  }
};

// ============================================================================
// ステータスランプ
// ============================================================================
const StatusLamp = memo(function StatusLamp({ 
  status, 
  size = 'md' 
}: { 
  status: string; 
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeMap = { sm: 8, md: 12, lg: 16 };
  const s = sizeMap[size];
  
  const colorMap: Record<string, string> = {
    healthy: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    inactive: '#6b7280',
  };
  
  const color = colorMap[status] || colorMap.inactive;
  const shouldPulse = status === 'warning' || status === 'error';
  
  return (
    <div
      style={{
        width: s,
        height: s,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 8px ${color}50`,
        animation: shouldPulse ? 'pulse 2s infinite' : undefined,
      }}
    />
  );
});

// ============================================================================
// ワークフローカード
// ============================================================================
const WorkflowCard = memo(function WorkflowCard({
  workflow,
  issues,
  isExpanded,
  onToggle,
  onViewDetails,
}: {
  workflow: WorkflowStatus;
  issues: AuditIssue[];
  isExpanded: boolean;
  onToggle: () => void;
  onViewDetails: (issue: AuditIssue) => void;
}) {
  const workflowIssues = issues.filter(i => i.workflow_id === workflow.workflow_id);
  
  const statusColorMap: Record<string, string> = {
    healthy: 'rgba(16, 185, 129, 0.1)',
    warning: 'rgba(245, 158, 11, 0.1)',
    error: 'rgba(239, 68, 68, 0.1)',
    inactive: 'rgba(107, 114, 128, 0.1)',
  };
  
  const borderColorMap: Record<string, string> = {
    healthy: 'rgba(16, 185, 129, 0.3)',
    warning: 'rgba(245, 158, 11, 0.3)',
    error: 'rgba(239, 68, 68, 0.3)',
    inactive: 'rgba(107, 114, 128, 0.3)',
  };

  return (
    <div
      style={{
        background: statusColorMap[workflow.status] || statusColorMap.inactive,
        border: `1px solid ${borderColorMap[workflow.status] || borderColorMap.inactive}`,
        borderRadius: 8,
        padding: 16,
        transition: 'all 0.2s ease',
      }}
    >
      {/* メイン行 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StatusLamp status={workflow.status} size="lg" />
          
          <div>
            <div style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              color: 'var(--text)',
              marginBottom: 2,
            }}>
              {workflow.workflow_name}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              fontSize: 12,
              color: 'var(--text-muted)',
            }}>
              {getCategoryIcon(workflow.category)}
              <span>{getCategoryLabel(workflow.category)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* 成功率 */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              fontSize: 18, 
              fontWeight: 700,
              color: workflow.status === 'healthy' ? '#10b981' :
                     workflow.status === 'warning' ? '#f59e0b' :
                     workflow.status === 'error' ? '#ef4444' : 'var(--text-muted)',
            }}>
              {workflow.success_rate.toFixed(1)}%
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4,
              fontSize: 11,
              color: 'var(--text-muted)',
            }}>
              {workflow.trend === 'up' && <TrendingUp size={12} style={{ color: '#10b981' }} />}
              {workflow.trend === 'down' && <TrendingDown size={12} style={{ color: '#ef4444' }} />}
              {workflow.trend === 'stable' && <Minus size={12} />}
              成功率
            </div>
          </div>

          {/* 問題数バッジ */}
          {workflow.active_issues > 0 && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 600,
            }}>
              {workflow.active_issues}件
            </div>
          )}

          {/* 展開ボタン */}
          <button
            onClick={onToggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              background: 'var(--panel-alt)',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {/* 展開コンテンツ */}
      {isExpanded && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>総実行回数</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                {workflow.total_executions.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>最終実行</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                {workflow.last_execution 
                  ? new Date(workflow.last_execution).toLocaleString('ja-JP', { 
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })
                  : '-'
                }
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>最終ステータス</div>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 600,
                color: workflow.last_status === 'PASS' ? '#10b981' :
                       workflow.last_status === 'WARN' ? '#f59e0b' :
                       workflow.last_status === 'FAIL' ? '#ef4444' : 'var(--text-muted)',
              }}>
                {workflow.last_status || '-'}
              </div>
            </div>
          </div>

          {/* 問題一覧（あれば） */}
          {workflowIssues.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
                最近の問題
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {workflowIssues.slice(0, 3).map(issue => (
                  <button
                    key={issue.audit_id}
                    onClick={() => onViewDetails(issue)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: issue.status === 'FAIL' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      border: `1px solid ${issue.status === 'FAIL' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                      borderRadius: 6,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {issue.status === 'FAIL' ? (
                        <XCircle size={14} style={{ color: '#ef4444' }} />
                      ) : (
                        <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
                      )}
                      <span style={{ fontSize: 12, color: 'var(--text)' }}>
                        {issue.reason.slice(0, 50)}{issue.reason.length > 50 ? '...' : ''}
                      </span>
                    </div>
                    <Eye size={14} style={{ color: 'var(--text-muted)' }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// ============================================================================
// メインコンポーネント
// ============================================================================
export const WorkflowMonitorView = memo(function WorkflowMonitorView({
  workflows,
  issues,
  loading,
  error,
  filterStatus,
  filterCategory,
  searchQuery,
  onFilterStatusChange,
  onFilterCategoryChange,
  onSearchQueryChange,
  onViewIssueDetails,
}: WorkflowMonitorViewProps) {
  const [expandedWorkflowId, setExpandedWorkflowId] = useState<string | null>(null);

  // フィルタリング
  const filteredWorkflows = workflows.filter(wf => {
    if (filterStatus !== 'all' && wf.status !== filterStatus) return false;
    if (filterCategory !== 'all' && wf.category !== filterCategory) return false;
    if (searchQuery && !wf.workflow_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // カテゴリ一覧
  const categories = [...new Set(workflows.map(wf => wf.category))];

  // ローディング
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: 300,
        color: 'var(--text-muted)',
      }}>
        <Activity size={24} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: 8 }}>読み込み中...</span>
      </div>
    );
  }

  // エラー
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        height: 300,
        gap: 8,
      }}>
        <XCircle size={32} style={{ color: '#ef4444' }} />
        <span style={{ color: '#ef4444' }}>{error}</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* フィルターバー */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12,
        padding: '12px 16px',
        background: 'var(--panel)',
        borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}>
        {/* ステータスフィルター */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <N3FilterTab 
            id="all" 
            label="全て" 
            count={workflows.length}
            active={filterStatus === 'all'} 
            onClick={() => onFilterStatusChange('all')} 
          />
          <N3FilterTab 
            id="healthy" 
            label="🟢 正常" 
            count={workflows.filter(w => w.status === 'healthy').length}
            active={filterStatus === 'healthy'} 
            onClick={() => onFilterStatusChange('healthy')} 
          />
          <N3FilterTab 
            id="warning" 
            label="🟡 警告" 
            count={workflows.filter(w => w.status === 'warning').length}
            active={filterStatus === 'warning'} 
            onClick={() => onFilterStatusChange('warning')} 
          />
          <N3FilterTab 
            id="error" 
            label="🔴 エラー" 
            count={workflows.filter(w => w.status === 'error').length}
            active={filterStatus === 'error'} 
            onClick={() => onFilterStatusChange('error')} 
          />
        </div>

        <N3Divider orientation="vertical" style={{ height: 20 }} />

        {/* カテゴリフィルター */}
        <select
          value={filterCategory}
          onChange={(e) => onFilterCategoryChange(e.target.value)}
          style={{
            padding: '6px 12px',
            background: 'var(--panel-alt)',
            border: '1px solid var(--panel-border)',
            borderRadius: 6,
            fontSize: 12,
            color: 'var(--text)',
            cursor: 'pointer',
          }}
        >
          <option value="all">全カテゴリ</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
          ))}
        </select>

        {/* 検索 */}
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="ワークフロー名で検索..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            style={{
              width: '100%',
              maxWidth: 300,
              padding: '6px 12px',
              background: 'var(--panel-alt)',
              border: '1px solid var(--panel-border)',
              borderRadius: 6,
              fontSize: 12,
              color: 'var(--text)',
            }}
          />
        </div>
      </div>

      {/* ワークフロー一覧 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filteredWorkflows.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 40, 
            color: 'var(--text-muted)',
          }}>
            該当するワークフローがありません
          </div>
        ) : (
          filteredWorkflows.map(workflow => (
            <WorkflowCard
              key={workflow.workflow_id}
              workflow={workflow}
              issues={issues}
              isExpanded={expandedWorkflowId === workflow.workflow_id}
              onToggle={() => setExpandedWorkflowId(
                expandedWorkflowId === workflow.workflow_id ? null : workflow.workflow_id
              )}
              onViewDetails={onViewIssueDetails}
            />
          ))
        )}
      </div>
    </div>
  );
});
