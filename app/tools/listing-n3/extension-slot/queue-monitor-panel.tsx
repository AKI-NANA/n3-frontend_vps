// app/tools/listing-n3/extension-slot/queue-monitor-panel.tsx
/**
 * 📊 Queue Monitor Panel
 * 
 * 出品キュー監視パネル
 * - ジョブ実行状況
 * - リアルタイム更新
 * - 履歴表示
 * 
 * データソース: Supabase workflow_executions
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Activity, RefreshCw, CheckCircle, XCircle, Clock, Loader2, Play, Pause, AlertTriangle } from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface WorkflowExecution {
  id: string;
  job_id: string;
  tool_id: string;
  action: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'timeout';
  params: Record<string, any>;
  result: Record<string, any> | null;
  duration_ms: number | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Queue Monitor Panel Component
// ============================================================

export function QueueMonitorPanel() {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // データ取得
  const fetchExecutions = useCallback(async () => {
    try {
      const response = await fetch('/api/dispatch/executions?tool_prefix=listing&limit=50');
      const data = await response.json();
      
      if (data.success && data.executions) {
        setExecutions(data.executions);
      } else {
        // モックデータ（開発用）
        setExecutions([
          {
            id: '1',
            job_id: 'job-001',
            tool_id: 'listing-auto',
            action: 'execute',
            status: 'completed',
            params: { productIds: ['123', '456'], platform: 'ebay' },
            result: { completed: 2, failed: 0 },
            duration_ms: 5200,
            created_at: new Date(Date.now() - 300000).toISOString(),
            updated_at: new Date(Date.now() - 295000).toISOString(),
          },
          {
            id: '2',
            job_id: 'job-002',
            tool_id: 'listing-batch',
            action: 'execute',
            status: 'running',
            params: { productIds: ['789', '012', '345'], platform: 'ebay' },
            result: null,
            duration_ms: null,
            created_at: new Date(Date.now() - 60000).toISOString(),
            updated_at: new Date(Date.now() - 30000).toISOString(),
          },
          {
            id: '3',
            job_id: 'job-003',
            tool_id: 'listing-auto',
            action: 'execute',
            status: 'failed',
            params: { productIds: ['999'], platform: 'amazon' },
            result: { error: 'API rate limit exceeded' },
            duration_ms: 1500,
            created_at: new Date(Date.now() - 600000).toISOString(),
            updated_at: new Date(Date.now() - 598500).toISOString(),
          },
        ]);
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Fetch executions error:', err);
    }
    setIsLoading(false);
  }, []);
  
  // 初期ロード
  useEffect(() => {
    fetchExecutions();
  }, [fetchExecutions]);
  
  // 自動更新
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(fetchExecutions, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchExecutions]);
  
  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
      pending: { bg: 'rgba(245, 158, 11, 0.15)', color: 'rgb(245, 158, 11)', icon: <Clock size={12} /> },
      running: { bg: 'rgba(59, 130, 246, 0.15)', color: 'rgb(59, 130, 246)', icon: <Loader2 size={12} className="animate-spin" /> },
      completed: { bg: 'rgba(34, 197, 94, 0.15)', color: 'rgb(34, 197, 94)', icon: <CheckCircle size={12} /> },
      failed: { bg: 'rgba(239, 68, 68, 0.15)', color: 'rgb(239, 68, 68)', icon: <XCircle size={12} /> },
      timeout: { bg: 'rgba(239, 68, 68, 0.15)', color: 'rgb(239, 68, 68)', icon: <AlertTriangle size={12} /> },
    };
    const style = styles[status] || styles.pending;
    
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 8px', fontSize: 10, fontWeight: 600,
        background: style.bg, color: style.color, borderRadius: 4,
      }}>
        {style.icon}
        {status.toUpperCase()}
      </span>
    );
  };
  
  const formatDuration = (ms: number | null) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };
  
  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ 
            width: 36, height: 36, borderRadius: 8, 
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity size={18} style={{ color: 'white' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Queue Monitor</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
              出品ジョブ監視
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '6px 10px', fontSize: 11, fontWeight: 500,
              background: autoRefresh ? 'rgba(34, 197, 94, 0.15)' : 'var(--panel)',
              color: autoRefresh ? 'rgb(34, 197, 94)' : 'var(--text-muted)',
              border: '1px solid var(--panel-border)', borderRadius: 6, cursor: 'pointer',
            }}
          >
            {autoRefresh ? <Play size={12} /> : <Pause size={12} />}
            {autoRefresh ? '自動更新中' : '停止中'}
          </button>
          <button
            onClick={fetchExecutions}
            disabled={isLoading}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '6px 10px', fontSize: 11, fontWeight: 500,
              background: 'var(--panel)', color: 'var(--text-muted)',
              border: '1px solid var(--panel-border)', borderRadius: 6, cursor: 'pointer',
            }}
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
            更新
          </button>
        </div>
      </div>
      
      {/* 最終更新 */}
      {lastUpdated && (
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          最終更新: {lastUpdated.toLocaleTimeString('ja-JP')}
        </div>
      )}
      
      {/* 実行リスト */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
          </div>
        ) : executions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <Activity size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
            <div style={{ fontSize: 13, fontWeight: 500 }}>実行履歴がありません</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {executions.map((exec) => (
              <div
                key={exec.id}
                style={{
                  padding: 12, background: 'var(--panel)', borderRadius: 8,
                  border: '1px solid var(--panel-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                        {exec.tool_id}
                      </span>
                      {getStatusBadge(exec.status)}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                      Job: {exec.job_id}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, fontWeight: 500 }}>{formatDuration(exec.duration_ms)}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{formatTime(exec.created_at)}</div>
                  </div>
                </div>
                
                {/* パラメータ */}
                {exec.params && Object.keys(exec.params).length > 0 && (
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                    Params: {JSON.stringify(exec.params).slice(0, 100)}...
                  </div>
                )}
                
                {/* 結果/エラー */}
                {exec.result && (
                  <div style={{ 
                    fontSize: 10, marginTop: 4, padding: 6, borderRadius: 4,
                    background: exec.status === 'failed' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    color: exec.status === 'failed' ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)',
                  }}>
                    {exec.status === 'failed' 
                      ? `Error: ${exec.result.error || 'Unknown'}` 
                      : `Completed: ${exec.result.completed || 0}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
