// app/tools/control-n3/hooks/use-control-data.ts
/**
 * Control N3 データ取得フック
 * - ワークフロー監視データ
 * - 監査ログ
 * - 統計情報
 */
import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================================
// 型定義
// ============================================================================
export interface WorkflowStatus {
  workflow_id: string;
  workflow_name: string;
  category: string;
  status: 'healthy' | 'warning' | 'error' | 'inactive';
  success_rate: number;
  total_executions: number;
  last_execution: string | null;
  last_status: 'PASS' | 'WARN' | 'FAIL' | 'ERROR' | null;
  active_issues: number;
  trend: 'up' | 'down' | 'stable';
}

export interface AuditIssue {
  audit_id: string;
  workflow_id: string;
  workflow_name: string;
  status: 'WARN' | 'FAIL' | 'ERROR';
  reason: string;
  failed_rules: string[];
  input_data: Record<string, any>;
  output_data: Record<string, any>;
  llm_analysis?: {
    issues_found: string[];
    recommendations: string[];
    reasoning: string;
  };
  created_at: string;
}

export interface DashboardStats {
  total_workflows: number;
  healthy_count: number;
  warning_count: number;
  error_count: number;
  total_audits_today: number;
  pass_rate_today: number;
  llm_cache_hit_rate: number;
}

export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: { id: string; name: string }[];
}

// ============================================================================
// カテゴリ定義
// ============================================================================
export const WORKFLOW_CATEGORIES = {
  listing: { label: '出品', icon: 'Package', color: '#10b981' },
  pricing: { label: '価格', icon: 'DollarSign', color: '#f59e0b' },
  inventory: { label: '在庫', icon: 'Database', color: '#3b82f6' },
  shipping: { label: '配送', icon: 'Truck', color: '#8b5cf6' },
  api: { label: 'API', icon: 'Zap', color: '#ec4899' },
  order: { label: '受注', icon: 'ShoppingCart', color: '#06b6d4' },
  system: { label: 'システム', icon: 'Settings', color: '#6b7280' },
} as const;

export type WorkflowCategory = keyof typeof WORKFLOW_CATEGORIES;

// ============================================================================
// メインフック
// ============================================================================
export function useControlData() {
  // 状態
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowStatus[]>([]);
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [n8nWorkflows, setN8nWorkflows] = useState<N8nWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // 自動更新
  const [autoRefresh, setAutoRefresh] = useState(true);
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ダッシュボードデータ取得
  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/audit/dashboard');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setStats(data.stats);
      setWorkflows(data.workflows || []);
      setIssues(data.recent_issues || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'データ取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // n8nワークフロー一覧取得
  const fetchN8nWorkflows = useCallback(async () => {
    try {
      const response = await fetch('/api/n8n/workflows');
      
      if (!response.ok) {
        console.warn('n8n workflows fetch failed:', response.status);
        return;
      }
      
      const data = await response.json();
      setN8nWorkflows(data.workflows || []);
    } catch (err) {
      console.warn('n8n workflows fetch error:', err);
    }
  }, []);

  // 初回読み込み
  useEffect(() => {
    fetchDashboardData();
    fetchN8nWorkflows();
  }, [fetchDashboardData, fetchN8nWorkflows]);

  // 自動更新
  useEffect(() => {
    if (autoRefresh) {
      autoRefreshIntervalRef.current = setInterval(() => {
        fetchDashboardData();
      }, 30000); // 30秒ごと
    }

    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, [autoRefresh, fetchDashboardData]);

  // ワークフローON/OFF切り替え
  const toggleWorkflow = useCallback(async (workflowId: string, active: boolean) => {
    try {
      const response = await fetch('/api/n8n/workflows/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, active }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle workflow');
      }
      
      // n8nワークフロー一覧を再取得
      await fetchN8nWorkflows();
      
      return { success: true };
    } catch (err) {
      console.error('Toggle workflow error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'エラー' };
    }
  }, [fetchN8nWorkflows]);

  // 手動更新
  const refresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchDashboardData(), fetchN8nWorkflows()]);
  }, [fetchDashboardData, fetchN8nWorkflows]);

  // フィルタリング
  const getFilteredWorkflows = useCallback((
    statusFilter: string = 'all',
    categoryFilter: string = 'all',
    searchQuery: string = ''
  ) => {
    return workflows.filter(wf => {
      if (statusFilter !== 'all' && wf.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && wf.category !== categoryFilter) return false;
      if (searchQuery && !wf.workflow_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [workflows]);

  // カテゴリ一覧
  const categories = [...new Set(workflows.map(wf => wf.category))];

  // 特定ワークフローの問題取得
  const getIssuesForWorkflow = useCallback((workflowId: string) => {
    return issues.filter(i => i.workflow_id === workflowId);
  }, [issues]);

  return {
    // データ
    stats,
    workflows,
    issues,
    n8nWorkflows,
    categories,
    
    // 状態
    loading,
    error,
    lastUpdated,
    autoRefresh,
    
    // アクション
    setAutoRefresh,
    refresh,
    toggleWorkflow,
    getFilteredWorkflows,
    getIssuesForWorkflow,
  };
}

// ============================================================================
// 統計計算ヘルパー
// ============================================================================
export function calculateHealthScore(stats: DashboardStats | null): number {
  if (!stats) return 0;
  
  const healthyWeight = 1;
  const warningWeight = 0.5;
  const errorWeight = 0;
  
  const total = stats.total_workflows;
  if (total === 0) return 100;
  
  const score = (
    (stats.healthy_count * healthyWeight) +
    (stats.warning_count * warningWeight) +
    (stats.error_count * errorWeight)
  ) / total * 100;
  
  return Math.round(score);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'healthy': return '#10b981';
    case 'warning': return '#f59e0b';
    case 'error': return '#ef4444';
    case 'inactive': return '#6b7280';
    default: return '#6b7280';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'healthy': return '正常';
    case 'warning': return '警告';
    case 'error': return 'エラー';
    case 'inactive': return '非稼働';
    default: return '不明';
  }
}
