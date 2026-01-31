'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, AlertTriangle, CheckCircle, XCircle, 
  RefreshCw, Clock, TrendingUp, TrendingDown,
  Filter, Search, ChevronDown, ChevronRight,
  Zap, Database, Package, DollarSign, Truck,
  BarChart3, Eye, Settings, Bell, BellOff
} from 'lucide-react';

// ============================================================================
// 型定義
// ============================================================================
interface WorkflowStatus {
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

interface AuditIssue {
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

interface DashboardStats {
  total_workflows: number;
  healthy_count: number;
  warning_count: number;
  error_count: number;
  total_audits_today: number;
  pass_rate_today: number;
  llm_cache_hit_rate: number;
}

// ============================================================================
// カテゴリアイコンマッピング
// ============================================================================
const categoryIcons: Record<string, React.ReactNode> = {
  listing: <Package className="w-4 h-4" />,
  pricing: <DollarSign className="w-4 h-4" />,
  inventory: <Database className="w-4 h-4" />,
  shipping: <Truck className="w-4 h-4" />,
  api: <Zap className="w-4 h-4" />,
  default: <Activity className="w-4 h-4" />
};

// ============================================================================
// ステータスランプコンポーネント
// ============================================================================
const StatusLamp: React.FC<{ status: string; size?: 'sm' | 'md' | 'lg' }> = ({ 
  status, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colorClasses = {
    healthy: 'bg-green-500 shadow-green-500/50',
    warning: 'bg-yellow-500 shadow-yellow-500/50',
    error: 'bg-red-500 shadow-red-500/50',
    inactive: 'bg-gray-400 shadow-gray-400/50'
  };

  const pulseClasses = {
    healthy: '',
    warning: 'animate-pulse',
    error: 'animate-pulse',
    inactive: ''
  };

  return (
    <div className={`
      ${sizeClasses[size]} 
      ${colorClasses[status as keyof typeof colorClasses] || colorClasses.inactive}
      ${pulseClasses[status as keyof typeof pulseClasses] || ''}
      rounded-full shadow-lg
    `} />
  );
};

// ============================================================================
// ワークフローカードコンポーネント
// ============================================================================
const WorkflowCard: React.FC<{
  workflow: WorkflowStatus;
  isExpanded: boolean;
  onToggle: () => void;
  onViewDetails: () => void;
}> = ({ workflow, isExpanded, onToggle, onViewDetails }) => {
  const statusColors = {
    healthy: 'border-green-500/30 bg-green-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    error: 'border-red-500/30 bg-red-500/5',
    inactive: 'border-gray-500/30 bg-gray-500/5'
  };

  const statusTextColors = {
    healthy: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    inactive: 'text-gray-400'
  };

  return (
    <div className={`
      border rounded-lg p-4 transition-all duration-200
      ${statusColors[workflow.status]}
      hover:shadow-lg
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusLamp status={workflow.status} size="lg" />
          <div>
            <h3 className="font-medium text-white">{workflow.workflow_name}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {categoryIcons[workflow.category] || categoryIcons.default}
              <span>{workflow.category}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* 成功率 */}
          <div className="text-right">
            <div className={`text-lg font-bold ${statusTextColors[workflow.status]}`}>
              {workflow.success_rate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              {workflow.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-400" />}
              {workflow.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-400" />}
              成功率
            </div>
          </div>

          {/* アクティブな問題数 */}
          {workflow.active_issues > 0 && (
            <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm font-medium">
              {workflow.active_issues} 件の問題
            </div>
          )}

          {/* 展開ボタン */}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* 展開時の詳細 */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-500">総実行回数</div>
              <div className="text-white font-medium">{workflow.total_executions.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500">最終実行</div>
              <div className="text-white font-medium">
                {workflow.last_execution 
                  ? new Date(workflow.last_execution).toLocaleString('ja-JP')
                  : '-'
                }
              </div>
            </div>
            <div>
              <div className="text-gray-500">最終ステータス</div>
              <div className={`font-medium ${
                workflow.last_status === 'PASS' ? 'text-green-400' :
                workflow.last_status === 'WARN' ? 'text-yellow-400' :
                workflow.last_status === 'FAIL' ? 'text-red-400' :
                'text-gray-400'
              }`}>
                {workflow.last_status || '-'}
              </div>
            </div>
          </div>
          
          <button
            onClick={onViewDetails}
            className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded text-sm text-white transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            問題レポートを表示
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 問題詳細パネルコンポーネント
// ============================================================================
const IssueDetailPanel: React.FC<{
  issue: AuditIssue;
  onClose: () => void;
}> = ({ issue, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        {/* ヘッダー */}
        <div className={`p-4 border-b border-white/10 flex items-center justify-between ${
          issue.status === 'FAIL' ? 'bg-red-500/10' :
          issue.status === 'WARN' ? 'bg-yellow-500/10' :
          'bg-orange-500/10'
        }`}>
          <div className="flex items-center gap-3">
            {issue.status === 'FAIL' ? (
              <XCircle className="w-6 h-6 text-red-400" />
            ) : issue.status === 'WARN' ? (
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            )}
            <div>
              <h2 className="text-lg font-bold text-white">{issue.workflow_name}</h2>
              <div className="text-sm text-gray-400">
                {new Date(issue.created_at).toLocaleString('ja-JP')}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded transition-colors text-gray-400"
          >
            ✕
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-6">
          {/* 問題の概要 */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">問題の概要</h3>
            <div className={`p-4 rounded-lg ${
              issue.status === 'FAIL' ? 'bg-red-500/10 border border-red-500/30' :
              'bg-yellow-500/10 border border-yellow-500/30'
            }`}>
              <p className="text-white">{issue.reason}</p>
            </div>
          </div>

          {/* 失敗したルール */}
          {issue.failed_rules.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">違反ルール</h3>
              <ul className="space-y-2">
                {issue.failed_rules.map((rule, index) => (
                  <li key={index} className="flex items-center gap-2 text-red-400">
                    <XCircle className="w-4 h-4" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI分析結果 */}
          {issue.llm_analysis && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                AI分析結果
              </h3>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-4">
                {/* 検出された問題 */}
                {issue.llm_analysis.issues_found.length > 0 && (
                  <div>
                    <div className="text-sm text-purple-300 mb-2">検出された問題:</div>
                    <ul className="space-y-1">
                      {issue.llm_analysis.issues_found.map((item, index) => (
                        <li key={index} className="text-white text-sm flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 推奨アクション */}
                {issue.llm_analysis.recommendations.length > 0 && (
                  <div>
                    <div className="text-sm text-green-300 mb-2">推奨アクション:</div>
                    <ul className="space-y-1">
                      {issue.llm_analysis.recommendations.map((item, index) => (
                        <li key={index} className="text-white text-sm flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 分析理由 */}
                {issue.llm_analysis.reasoning && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">分析詳細:</div>
                    <p className="text-gray-300 text-sm">{issue.llm_analysis.reasoning}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 入力/出力データ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">入力データ</h3>
              <pre className="bg-gray-800 rounded-lg p-3 text-xs text-gray-300 overflow-auto max-h-48">
                {JSON.stringify(issue.input_data, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">出力データ</h3>
              <pre className="bg-gray-800 rounded-lg p-3 text-xs text-gray-300 overflow-auto max-h-48">
                {JSON.stringify(issue.output_data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// メインコンポーネント
// ============================================================================
export default function MonitoringDashboard() {
  // 状態管理
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowStatus[]>([]);
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<AuditIssue | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // データ取得
  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch('/api/audit/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      
      const data = await response.json();
      setStats(data.stats);
      setWorkflows(data.workflows);
      setIssues(data.recent_issues);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初回読み込み & 自動更新
  useEffect(() => {
    fetchDashboardData();

    if (autoRefresh) {
      const interval = setInterval(fetchDashboardData, 30000); // 30秒ごと
      return () => clearInterval(interval);
    }
  }, [fetchDashboardData, autoRefresh]);

  // フィルタリング
  const filteredWorkflows = workflows.filter(wf => {
    if (filterStatus !== 'all' && wf.status !== filterStatus) return false;
    if (filterCategory !== 'all' && wf.category !== filterCategory) return false;
    if (searchQuery && !wf.workflow_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // カテゴリ一覧
  const categories = [...new Set(workflows.map(wf => wf.category))];

  // ワークフロー詳細表示
  const handleViewDetails = (workflowId: string) => {
    const workflowIssues = issues.filter(i => i.workflow_id === workflowId);
    if (workflowIssues.length > 0) {
      setSelectedIssue(workflowIssues[0]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ヘッダー */}
      <header className="bg-gray-900 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold">ワークフロー監視ダッシュボード</h1>
              <p className="text-sm text-gray-400">N3 二層検証監査システム</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* 最終更新時刻 */}
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {lastUpdated && `最終更新: ${lastUpdated.toLocaleTimeString('ja-JP')}`}
            </div>

            {/* 自動更新トグル */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded transition-colors ${
                autoRefresh ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
              }`}
              title={autoRefresh ? '自動更新ON' : '自動更新OFF'}
            >
              {autoRefresh ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </button>

            {/* 手動更新 */}
            <button
              onClick={fetchDashboardData}
              className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* 統計カード */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm">総ワークフロー</div>
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mt-2">{stats.total_workflows}</div>
            </div>

            <div className="bg-gray-900 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm">正常稼働</div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-green-400 mt-2">{stats.healthy_count}</div>
            </div>

            <div className="bg-gray-900 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm">警告あり</div>
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-400 mt-2">{stats.warning_count}</div>
            </div>

            <div className="bg-gray-900 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm">エラー発生</div>
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-red-400 mt-2">{stats.error_count}</div>
            </div>
          </div>
        )}

        {/* 追加統計 */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900 border border-white/10 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">本日の監査件数</div>
              <div className="text-2xl font-bold text-white">{stats.total_audits_today.toLocaleString()}</div>
            </div>
            <div className="bg-gray-900 border border-white/10 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">本日の成功率</div>
              <div className={`text-2xl font-bold ${
                stats.pass_rate_today >= 90 ? 'text-green-400' :
                stats.pass_rate_today >= 70 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {stats.pass_rate_today.toFixed(1)}%
              </div>
            </div>
            <div className="bg-gray-900 border border-white/10 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">LLMキャッシュヒット率</div>
              <div className="text-2xl font-bold text-purple-400">
                {stats.llm_cache_hit_rate.toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {/* フィルター */}
        <div className="bg-gray-900 border border-white/10 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Filter className="w-4 h-4" />
              <span className="text-sm">フィルター:</span>
            </div>

            {/* 検索 */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="ワークフロー名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-white/10 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* ステータスフィルター */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">全てのステータス</option>
              <option value="healthy">🟢 正常</option>
              <option value="warning">🟡 警告</option>
              <option value="error">🔴 エラー</option>
              <option value="inactive">⚪ 非稼働</option>
            </select>

            {/* カテゴリフィルター */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">全てのカテゴリ</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ワークフロー一覧 */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-white mb-4">
            ワークフロー一覧 ({filteredWorkflows.length})
          </h2>
          
          {filteredWorkflows.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              該当するワークフローがありません
            </div>
          ) : (
            filteredWorkflows.map(workflow => (
              <WorkflowCard
                key={workflow.workflow_id}
                workflow={workflow}
                isExpanded={expandedWorkflow === workflow.workflow_id}
                onToggle={() => setExpandedWorkflow(
                  expandedWorkflow === workflow.workflow_id ? null : workflow.workflow_id
                )}
                onViewDetails={() => handleViewDetails(workflow.workflow_id)}
              />
            ))
          )}
        </div>

        {/* 最近の問題 */}
        {issues.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              最近の問題 ({issues.length})
            </h2>
            
            <div className="space-y-2">
              {issues.slice(0, 10).map(issue => (
                <div
                  key={issue.audit_id}
                  onClick={() => setSelectedIssue(issue)}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all
                    ${issue.status === 'FAIL' 
                      ? 'bg-red-500/5 border-red-500/30 hover:bg-red-500/10' 
                      : 'bg-yellow-500/5 border-yellow-500/30 hover:bg-yellow-500/10'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {issue.status === 'FAIL' ? (
                        <XCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      )}
                      <div>
                        <div className="font-medium text-white">{issue.workflow_name}</div>
                        <div className="text-sm text-gray-400">{issue.reason}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(issue.created_at).toLocaleString('ja-JP')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 問題詳細モーダル */}
      {selectedIssue && (
        <IssueDetailPanel
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
}
