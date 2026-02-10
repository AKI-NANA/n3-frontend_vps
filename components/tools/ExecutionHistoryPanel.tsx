// components/tools/ExecutionHistoryPanel.tsx
/**
 * ExecutionHistoryPanel - 実行履歴パネル
 * 
 * Phase Final Fix: 各タブに表示する最近の実行履歴
 */

'use client';

import React, { memo, useState, useEffect, useCallback } from 'react';
import {
  Clock, CheckCircle, XCircle, Loader2, RefreshCw, RotateCcw,
  ChevronDown, ChevronRight,
} from 'lucide-react';
import { dispatchService } from '@/lib/services/dispatch-service';
import type { JobStatus } from '@/lib/services/dispatch-service';

// ============================================================
// 型定義
// ============================================================

interface ExecutionHistoryPanelProps {
  /** フィルターするツールIDのプレフィックス */
  toolIdPrefix?: string;
  /** 表示件数 */
  limit?: number;
  /** 自動更新間隔（ms）、0で無効 */
  autoRefreshInterval?: number;
  /** コンパクトモード */
  compact?: boolean;
  /** タイトル */
  title?: string;
  /** カスタムクラス */
  className?: string;
}

// ============================================================
// ユーティリティ
// ============================================================

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  running: '#3B82F6',
  completed: '#10B981',
  failed: '#EF4444',
  timeout: '#8B5CF6',
  cancelled: '#6B7280',
};

const StatusIcon = memo(function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return <CheckCircle size={14} style={{ color: STATUS_COLORS.completed }} />;
    case 'running':
      return <Loader2 size={14} className="animate-spin" style={{ color: STATUS_COLORS.running }} />;
    case 'pending':
      return <Clock size={14} style={{ color: STATUS_COLORS.pending }} />;
    case 'failed':
    case 'timeout':
      return <XCircle size={14} style={{ color: STATUS_COLORS.failed }} />;
    default:
      return <Clock size={14} style={{ color: '#6B7280' }} />;
  }
});

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return '今';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}時間前`;
  return date.toLocaleDateString('ja-JP');
};

// ============================================================
// メインコンポーネント
// ============================================================

export const ExecutionHistoryPanel = memo(function ExecutionHistoryPanel({
  toolIdPrefix,
  limit = 10,
  autoRefreshInterval = 10000,
  compact = false,
  title = 'Recent Executions',
  className = '',
}: ExecutionHistoryPanelProps) {
  const [jobs, setJobs] = useState<JobStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const result = await dispatchService.getJobs({
        toolId: toolIdPrefix,
        limit,
        sortOrder: 'desc',
      });
      setJobs(result.jobs);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [toolIdPrefix, limit]);

  // 初回読み込み
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // 自動更新
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    
    const interval = setInterval(fetchJobs, autoRefreshInterval);
    return () => clearInterval(interval);
  }, [autoRefreshInterval, fetchJobs]);

  // リトライ
  const handleRetry = useCallback(async (jobId: string) => {
    await dispatchService.retryJob(jobId);
    fetchJobs();
  }, [fetchJobs]);

  // 統計
  const stats = {
    total: jobs.length,
    running: jobs.filter((j) => j.status === 'running').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
    failed: jobs.filter((j) => ['failed', 'timeout'].includes(j.status)).length,
  };

  if (compact) {
    return (
      <div className={className} style={{ padding: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12 }}>
          <span style={{ color: 'var(--text-muted)' }}>Jobs:</span>
          {stats.running > 0 && (
            <span style={{ color: STATUS_COLORS.running }}>
              <Loader2 size={12} className="animate-spin" style={{ display: 'inline', marginRight: 4 }} />
              {stats.running}
            </span>
          )}
          <span style={{ color: STATUS_COLORS.completed }}>✓ {stats.completed}</span>
          {stats.failed > 0 && (
            <span style={{ color: STATUS_COLORS.failed }}>✗ {stats.failed}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        background: 'var(--panel)',
        borderRadius: 8,
        border: '1px solid var(--panel-border)',
        overflow: 'hidden',
      }}
    >
      {/* ヘッダー */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'var(--panel-alt)',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          <span style={{ fontSize: 13, fontWeight: 600 }}>{title}</span>
          <span
            style={{
              fontSize: 11,
              padding: '2px 6px',
              borderRadius: 4,
              background: 'var(--accent)',
              color: 'white',
            }}
          >
            {stats.total}
          </span>
          {stats.running > 0 && (
            <span
              style={{
                fontSize: 11,
                padding: '2px 6px',
                borderRadius: 4,
                background: `${STATUS_COLORS.running}20`,
                color: STATUS_COLORS.running,
              }}
            >
              {stats.running} running
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            fetchJobs();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            borderRadius: 4,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: 11,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* コンテンツ */}
      {!isCollapsed && (
        <div style={{ maxHeight: 300, overflow: 'auto' }}>
          {isLoading && jobs.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
              <Loader2 size={20} className="animate-spin" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: 12 }}>読み込み中...</div>
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              実行履歴がありません
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.jobId}
                style={{
                  borderBottom: '1px solid var(--panel-border)',
                }}
              >
                <div
                  onClick={() => setExpandedJobId(expandedJobId === job.jobId ? null : job.jobId)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <StatusIcon status={job.status} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>
                        {job.toolId.replace(/_/g, ' ')}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        {formatTime(job.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontSize: 10,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: `${STATUS_COLORS[job.status] || '#6B7280'}15`,
                        color: STATUS_COLORS[job.status] || '#6B7280',
                      }}
                    >
                      {job.status}
                    </span>
                    {['failed', 'timeout'].includes(job.status) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetry(job.jobId);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '3px 6px',
                          borderRadius: 4,
                          border: 'none',
                          background: 'rgba(59,130,246,0.2)',
                          color: '#3B82F6',
                          cursor: 'pointer',
                        }}
                      >
                        <RotateCcw size={10} />
                      </button>
                    )}
                  </div>
                </div>

                {/* 展開詳細 */}
                {expandedJobId === job.jobId && (
                  <div
                    style={{
                      padding: '8px 14px 12px',
                      background: 'var(--bg)',
                      fontSize: 11,
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 4, color: 'var(--text-muted)' }}>
                      <span>Job ID:</span>
                      <span style={{ fontFamily: 'monospace' }}>{job.jobId}</span>
                      <span>Action:</span>
                      <span>{job.action}</span>
                      <span>Created:</span>
                      <span>{new Date(job.createdAt).toLocaleString('ja-JP')}</span>
                      {job.startedAt && (
                        <>
                          <span>Started:</span>
                          <span>{new Date(job.startedAt).toLocaleString('ja-JP')}</span>
                        </>
                      )}
                      {job.finishedAt && (
                        <>
                          <span>Finished:</span>
                          <span>{new Date(job.finishedAt).toLocaleString('ja-JP')}</span>
                        </>
                      )}
                      <span>Retry:</span>
                      <span>{job.retryCount}</span>
                    </div>
                    {job.error && (
                      <div
                        style={{
                          marginTop: 8,
                          padding: 8,
                          background: 'rgba(239,68,68,0.1)',
                          borderRadius: 4,
                          color: 'var(--error)',
                        }}
                      >
                        {job.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
});

export default ExecutionHistoryPanel;
