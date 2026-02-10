// app/tools/control-n3/components/panels/workflow-manager-panel.tsx
/**
 * 🔧 Workflow Manager Panel
 * 
 * Phase A-3: n8n ワークフロー管理UI
 * - ワークフロー一覧表示
 * - 有効/無効切り替え
 * - 実行履歴表示
 * - カテゴリ別フィルタ
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, CheckCircle, XCircle, Loader2, RefreshCw, Play, Pause, 
  Server, AlertTriangle, Clock, Filter, ChevronDown, ChevronRight,
  Zap, Package, Search, TrendingUp, DollarSign, Shield, Users, MoreHorizontal
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface Workflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: Array<{ id: string; name: string }>;
}

interface Execution {
  id: string;
  finished: boolean;
  mode: string;
  startedAt: string;
  stoppedAt?: string;
  workflowId: string;
  workflowName?: string;
  status: 'success' | 'error' | 'waiting' | 'running';
}

interface ExecutionStats {
  total: number;
  success: number;
  error: number;
  running: number;
  successRate: number;
}

const CATEGORY_ICONS: Record<string, any> = {
  listing: Package,
  inventory: Activity,
  research: Search,
  media: Play,
  finance: DollarSign,
  system: Server,
  defense: Shield,
  empire: Users,
  other: MoreHorizontal,
};

const CATEGORY_COLORS: Record<string, string> = {
  listing: '#3B82F6',
  inventory: '#10B981',
  research: '#8B5CF6',
  media: '#F59E0B',
  finance: '#EF4444',
  system: '#6366F1',
  defense: '#EC4899',
  empire: '#14B8A6',
  other: '#6B7280',
};

// ============================================================
// Workflow Manager Panel
// ============================================================

export function WorkflowManagerPanel() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [categorized, setCategorized] = useState<Record<string, Workflow[]>>({});
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [stats, setStats] = useState<ExecutionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'n8n' | 'mock'>('n8n');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['listing', 'inventory', 'research']));
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // データ取得
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [wfRes, execRes] = await Promise.all([
        fetch('/api/n8n/workflows'),
        fetch('/api/n8n/executions?limit=50'),
      ]);
      
      if (wfRes.ok) {
        const data = await wfRes.json();
        setWorkflows(data.workflows || []);
        setCategorized(data.categorized || {});
        setSource(data.source || 'n8n');
      }
      
      if (execRes.ok) {
        const data = await execRes.json();
        setExecutions(data.executions || []);
        setStats(data.stats || null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // ワークフロー有効化/無効化
  const toggleWorkflow = async (workflowId: string, currentActive: boolean) => {
    setActionLoading(workflowId);
    try {
      const res = await fetch('/api/n8n/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId,
          action: currentActive ? 'deactivate' : 'activate',
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        await fetchData();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // カテゴリ展開/折りたたみ
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // フィルタリング
  const filteredWorkflows = workflows.filter(wf => {
    if (filter === 'active' && !wf.active) return false;
    if (filter === 'inactive' && wf.active) return false;
    return true;
  });

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString('ja-JP', { 
      month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  const formatDuration = (start: string, end?: string) => {
    if (!end) return 'Running...';
    const ms = new Date(end).getTime() - new Date(start).getTime();
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 16px' }} />
        <p style={{ opacity: 0.6 }}>Loading workflows...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Workflow Manager</h2>
          <p style={{ fontSize: 12, opacity: 0.6, margin: '4px 0 0' }}>
            {workflows.length} workflows • Source: {source}
            {source === 'mock' && ' (n8n API unavailable)'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            style={{
              padding: '8px 12px', borderRadius: 8, fontSize: 13,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'white', cursor: 'pointer',
            }}
          >
            <option value="all">All</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
          <button
            onClick={fetchData}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: 'rgba(59,130,246,0.2)', color: '#3B82F6',
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* 統計サマリー */}
      {stats && (
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12,
          padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.total}</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>Total Executions</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#10B981' }}>{stats.success}</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>Success</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#EF4444' }}>{stats.error}</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>Failed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#3B82F6' }}>{stats.running}</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>Running</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#F59E0B' }}>{stats.successRate}%</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>Success Rate</div>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div style={{ padding: 16, background: 'rgba(239,68,68,0.1)', borderRadius: 8, color: '#EF4444' }}>
          <AlertTriangle size={16} style={{ marginRight: 8 }} />
          {error}
        </div>
      )}

      {/* メインコンテンツ: 2カラム */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* 左: ワークフロー一覧 */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', borderRadius: 12, 
          border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600 }}>
            Workflows ({filteredWorkflows.length})
          </div>
          <div style={{ maxHeight: 500, overflow: 'auto' }}>
            {Object.entries(categorized).map(([category, wfs]) => {
              const filtered = wfs.filter(wf => {
                if (filter === 'active' && !wf.active) return false;
                if (filter === 'inactive' && wf.active) return false;
                return true;
              });
              if (filtered.length === 0) return null;
              
              const Icon = CATEGORY_ICONS[category] || MoreHorizontal;
              const color = CATEGORY_COLORS[category] || '#6B7280';
              const isExpanded = expandedCategories.has(category);
              
              return (
                <div key={category}>
                  <button
                    onClick={() => toggleCategory(category)}
                    style={{
                      width: '100%', padding: '10px 16px', display: 'flex',
                      alignItems: 'center', justifyContent: 'space-between',
                      background: 'rgba(255,255,255,0.03)', border: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      cursor: 'pointer', color: 'white',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon size={14} style={{ color }} />
                      <span style={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>
                        {category}
                      </span>
                      <span style={{ fontSize: 11, opacity: 0.5 }}>({filtered.length})</span>
                    </div>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  
                  {isExpanded && filtered.map(wf => (
                    <div
                      key={wf.id}
                      style={{
                        padding: '10px 16px 10px 40px', display: 'flex',
                        alignItems: 'center', justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
                          overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {wf.name}
                        </div>
                        <div style={{ fontSize: 10, opacity: 0.5 }}>
                          Updated: {formatTime(wf.updatedAt)}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleWorkflow(wf.id, wf.active)}
                        disabled={actionLoading === wf.id || source === 'mock'}
                        style={{
                          padding: '4px 10px', borderRadius: 6, border: 'none',
                          background: wf.active ? 'rgba(16,185,129,0.2)' : 'rgba(107,114,128,0.2)',
                          color: wf.active ? '#10B981' : '#6B7280',
                          cursor: actionLoading === wf.id || source === 'mock' ? 'not-allowed' : 'pointer',
                          fontSize: 11, fontWeight: 500, display: 'flex',
                          alignItems: 'center', gap: 4, opacity: source === 'mock' ? 0.5 : 1,
                        }}
                      >
                        {actionLoading === wf.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : wf.active ? (
                          <><CheckCircle size={12} /> Active</>
                        ) : (
                          <><XCircle size={12} /> Inactive</>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* 右: 実行履歴 */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', borderRadius: 12, 
          border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600 }}>
            Recent Executions ({executions.length})
          </div>
          <div style={{ maxHeight: 500, overflow: 'auto' }}>
            {executions.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>
                No executions found
              </div>
            ) : (
              executions.map(exec => (
                <div
                  key={exec.id}
                  style={{
                    padding: '10px 16px', display: 'flex',
                    alignItems: 'center', gap: 12,
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                  }}
                >
                  {exec.status === 'success' && <CheckCircle size={16} color="#10B981" />}
                  {exec.status === 'error' && <XCircle size={16} color="#EF4444" />}
                  {exec.status === 'running' && <Loader2 size={16} color="#3B82F6" className="animate-spin" />}
                  {exec.status === 'waiting' && <Clock size={16} color="#F59E0B" />}
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
                      overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {exec.workflowName || `Workflow #${exec.workflowId}`}
                    </div>
                    <div style={{ fontSize: 10, opacity: 0.5, display: 'flex', gap: 8 }}>
                      <span>{formatTime(exec.startedAt)}</span>
                      <span>•</span>
                      <span>{formatDuration(exec.startedAt, exec.stoppedAt)}</span>
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 500,
                    background: exec.status === 'success' ? 'rgba(16,185,129,0.2)' : 
                               exec.status === 'error' ? 'rgba(239,68,68,0.2)' :
                               exec.status === 'running' ? 'rgba(59,130,246,0.2)' : 'rgba(245,158,11,0.2)',
                    color: exec.status === 'success' ? '#10B981' : 
                           exec.status === 'error' ? '#EF4444' :
                           exec.status === 'running' ? '#3B82F6' : '#F59E0B',
                  }}>
                    {exec.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkflowManagerPanel;
