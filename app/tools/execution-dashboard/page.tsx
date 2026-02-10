// app/tools/execution-dashboard/page.tsx
/**
 * N3 Empire OS V8 - 実行監視ダッシュボード
 * 
 * 機能:
 * 1. リアルタイム実行状況
 * 2. 成功/失敗/実行中カウント
 * 3. 実行ログ表示
 * 4. エラー再実行
 * 5. キュー管理
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity, CheckCircle, XCircle, AlertCircle, Clock, Loader2,
  RefreshCw, Play, Pause, RotateCcw, Trash2, Filter, Search,
  BarChart3, TrendingUp, Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { N3CollapsibleHeader, N3Footer } from '@/components/n3';
import { createClient } from '@/lib/supabase/client';

interface ExecutionLog {
  id: string;
  workflow_id: string | null;
  execution_id: string | null;
  n8n_execution_id: string | null;
  status: string;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  input_data: any;
  output_data: any;
  error_message: string | null;
  error_stack: string | null;
  steps_executed: number | null;
  api_calls_made: number | null;
  tokens_used: number | null;
  cost_usd: number | null;
  trigger_type: string | null;
  triggered_by: string | null;
}

interface QueueItem {
  id: string;
  job_type: string;
  workflow_id: string | null;
  webhook_path: string | null;
  priority: number;
  queue_position: number | null;
  input_data: any;
  status: string;
  started_at: string | null;
  retry_count: number;
  max_retries: number;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  started: { color: '#3b82f6', icon: Play, label: '開始' },
  running: { color: '#3b82f6', icon: Loader2, label: '実行中' },
  success: { color: '#22c55e', icon: CheckCircle, label: '成功' },
  error: { color: '#ef4444', icon: XCircle, label: 'エラー' },
  timeout: { color: '#f59e0b', icon: Clock, label: 'タイムアウト' },
  queued: { color: '#6b7280', icon: Clock, label: 'キュー待ち' },
  cancelled: { color: '#6b7280', icon: Pause, label: 'キャンセル' },
  failed: { color: '#ef4444', icon: XCircle, label: '失敗' }
};

export default function ExecutionDashboardPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'logs' | 'queue'>('logs');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const supabase = createClient();

  // データ取得
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 実行ログ取得
      const { data: logsData } = await supabase
        .from('workflow_execution_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(100);
      
      setLogs(logsData || []);
      
      // キュー取得
      const { data: queueData } = await supabase
        .from('execution_queue')
        .select('*')
        .order('priority')
        .order('created_at')
        .limit(50);
      
      setQueue(queueData || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
    
    // リアルタイム更新
    const logsChannel = supabase
      .channel('execution_logs_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workflow_execution_logs' }, fetchData)
      .subscribe();
    
    const queueChannel = supabase
      .channel('execution_queue_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'execution_queue' }, fetchData)
      .subscribe();
    
    // 5秒ごとに更新
    const interval = setInterval(fetchData, 5000);
    
    return () => {
      logsChannel.unsubscribe();
      queueChannel.unsubscribe();
      clearInterval(interval);
    };
  }, [fetchData, supabase]);

  // 再実行
  const retryExecution = useCallback(async (log: ExecutionLog) => {
    if (!log.workflow_id) return;
    
    try {
      await fetch('/api/n8n-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: log.workflow_id,
          data: {
            ...log.input_data,
            retry_from: log.id,
            timestamp: new Date().toISOString()
          }
        })
      });
      
      fetchData();
    } catch (err) {
      console.error('Retry failed:', err);
    }
  }, [fetchData]);

  // キューアイテム削除
  const cancelQueueItem = useCallback(async (item: QueueItem) => {
    try {
      await supabase
        .from('execution_queue')
        .update({ status: 'cancelled' })
        .eq('id', item.id);
      
      fetchData();
    } catch (err) {
      console.error('Cancel failed:', err);
    }
  }, [supabase, fetchData]);

  // フィルター適用
  const filteredLogs = logs.filter(log => {
    if (statusFilter && log.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return log.workflow_id?.toLowerCase().includes(q) || 
             log.execution_id?.toLowerCase().includes(q);
    }
    return true;
  });

  // 統計
  const stats = {
    total: logs.length,
    running: logs.filter(l => l.status === 'running' || l.status === 'started').length,
    success: logs.filter(l => l.status === 'success').length,
    error: logs.filter(l => l.status === 'error' || l.status === 'failed').length,
    queued: queue.filter(q => q.status === 'queued').length,
    avgDuration: logs.filter(l => l.duration_ms).length > 0
      ? Math.round(logs.filter(l => l.duration_ms).reduce((sum, l) => sum + (l.duration_ms || 0), 0) / logs.filter(l => l.duration_ms).length / 1000)
      : 0,
    totalCost: logs.reduce((sum, l) => sum + (l.cost_usd || 0), 0)
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <div id="main-scroll-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto' }}>
        
        <N3CollapsibleHeader scrollContainerId="main-scroll-container" threshold={10}>
          <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: 'var(--panel)', borderBottom: '1px solid var(--panel-border)' }}>
            <div className="flex items-center gap-3">
              <Activity size={24} style={{ color: 'var(--accent)' }} />
              <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>📊 実行監視ダッシュボード</h1>
              <span className="px-2 py-0.5 rounded text-xs" style={{ background: '#3b82f6', color: 'white' }}>P0</span>
              
              {stats.running > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs" style={{ background: '#3b82f6', color: 'white' }}>
                  <Loader2 size={12} className="animate-spin" />
                  実行中: {stats.running}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={fetchData} className="flex items-center gap-1 px-3 py-1.5 rounded text-sm" style={{ background: 'var(--highlight)', border: '1px solid var(--panel-border)' }}>
                <RefreshCw size={14} />
                更新
              </button>
            </div>
          </div>
          
          {/* 統計バー */}
          <div style={{ height: 48, display: 'flex', alignItems: 'center', gap: 20, padding: '0 16px', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>リアルタイム更新中</span>
            </div>
            <span className="text-sm" style={{ color: '#3b82f6' }}>実行中: <strong>{stats.running}</strong></span>
            <span className="text-sm" style={{ color: '#22c55e' }}>成功: <strong>{stats.success}</strong></span>
            <span className="text-sm" style={{ color: '#ef4444' }}>エラー: <strong>{stats.error}</strong></span>
            <span className="text-sm" style={{ color: '#6b7280' }}>キュー: <strong>{stats.queued}</strong></span>
            <span className="ml-auto text-sm" style={{ color: 'var(--text-muted)' }}>平均実行時間: <strong>{stats.avgDuration}s</strong></span>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>コスト: <strong>${stats.totalCost.toFixed(4)}</strong></span>
          </div>
          
          {/* タブ */}
          <div style={{ height: 40, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', background: 'var(--panel)', borderBottom: '1px solid var(--panel-border)' }}>
            <button 
              onClick={() => setTab('logs')} 
              className={`px-3 py-1 rounded text-sm ${tab === 'logs' ? 'font-medium' : ''}`}
              style={{ background: tab === 'logs' ? 'var(--accent)' : 'transparent', color: tab === 'logs' ? 'white' : 'var(--text-muted)' }}
            >
              実行ログ ({logs.length})
            </button>
            <button 
              onClick={() => setTab('queue')} 
              className={`px-3 py-1 rounded text-sm ${tab === 'queue' ? 'font-medium' : ''}`}
              style={{ background: tab === 'queue' ? 'var(--accent)' : 'transparent', color: tab === 'queue' ? 'white' : 'var(--text-muted)' }}
            >
              キュー ({queue.length})
            </button>
            
            <div className="ml-auto flex items-center gap-2">
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Workflow IDで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm outline-none w-48"
                style={{ color: 'var(--text)' }}
              />
            </div>
          </div>
        </N3CollapsibleHeader>

        {/* メインコンテンツ */}
        <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent)' }} /></div>
          ) : tab === 'logs' ? (
            /* 実行ログ */
            <div className="space-y-2">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
                  <Activity size={48} className="mx-auto mb-4 opacity-30" />
                  <p>実行ログがありません</p>
                </div>
              ) : (
                filteredLogs.map(log => {
                  const config = STATUS_CONFIG[log.status] || STATUS_CONFIG.error;
                  const StatusIcon = config.icon;
                  
                  return (
                    <div key={log.id} className="flex items-center gap-3 p-3 rounded" style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}>
                      <StatusIcon 
                        size={18} 
                        style={{ color: config.color }}
                        className={log.status === 'running' ? 'animate-spin' : ''}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{log.workflow_id || '-'}</span>
                          <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: `${config.color}20`, color: config.color }}>
                            {config.label}
                          </span>
                          {log.trigger_type && (
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              ({log.trigger_type})
                            </span>
                          )}
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {new Date(log.started_at).toLocaleString('ja-JP')}
                          {log.duration_ms && ` • ${(log.duration_ms / 1000).toFixed(1)}s`}
                          {log.tokens_used && ` • ${log.tokens_used} tokens`}
                          {log.cost_usd && ` • $${log.cost_usd.toFixed(4)}`}
                        </p>
                        {log.error_message && (
                          <p className="text-xs mt-1 truncate" style={{ color: '#ef4444' }}>
                            {log.error_message}
                          </p>
                        )}
                      </div>
                      
                      {(log.status === 'error' || log.status === 'failed') && (
                        <button
                          onClick={() => retryExecution(log)}
                          className="p-2 rounded hover:bg-gray-100"
                          title="再実行"
                        >
                          <RotateCcw size={14} style={{ color: 'var(--accent)' }} />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* キュー */
            <div className="space-y-2">
              {queue.length === 0 ? (
                <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
                  <Clock size={48} className="mx-auto mb-4 opacity-30" />
                  <p>キューは空です</p>
                </div>
              ) : (
                queue.map(item => {
                  const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.queued;
                  const StatusIcon = config.icon;
                  
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded" style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}>
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--highlight)', color: 'var(--text-muted)' }}>
                        {item.priority}
                      </span>
                      
                      <StatusIcon 
                        size={18} 
                        style={{ color: config.color }}
                        className={item.status === 'running' ? 'animate-spin' : ''}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{item.workflow_id || item.webhook_path || '-'}</span>
                          <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: `${config.color}20`, color: config.color }}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          作成: {new Date(item.created_at).toLocaleString('ja-JP')}
                          {item.retry_count > 0 && ` • リトライ: ${item.retry_count}/${item.max_retries}`}
                        </p>
                      </div>
                      
                      {item.status === 'queued' && (
                        <button
                          onClick={() => cancelQueueItem(item)}
                          className="p-2 rounded hover:bg-red-50"
                          title="キャンセル"
                        >
                          <Trash2 size={14} style={{ color: '#ef4444' }} />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <N3Footer copyright="© 2025 N3 Empire" version="v8.0.0" status={{ label: 'Monitor', connected: true }} />
      </div>
    </div>
  );
}
