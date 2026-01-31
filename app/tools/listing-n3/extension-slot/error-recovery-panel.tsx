// app/tools/listing-n3/extension-slot/error-recovery-panel.tsx
/**
 * 🔧 Error Recovery Panel
 * 
 * エラー復旧パネル
 * - 失敗ジョブ一覧
 * - 再実行機能
 * - エラー詳細表示
 * 
 * 接続: UI → Dispatch API → n8n
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, RefreshCw, Play, Trash2, Loader2, CheckCircle, XCircle, Eye } from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface FailedJob {
  id: string;
  job_id: string;
  tool_id: string;
  params: Record<string, any>;
  error: string;
  error_details?: string;
  created_at: string;
  retry_count: number;
}

// ============================================================
// Error Recovery Panel Component
// ============================================================

export function ErrorRecoveryPanel() {
  const [failedJobs, setFailedJobs] = useState<FailedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<FailedJob | null>(null);
  
  // 失敗ジョブ取得
  const fetchFailedJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dispatch/failed?tool_prefix=listing&limit=30');
      const data = await response.json();
      
      if (data.success && data.jobs) {
        setFailedJobs(data.jobs);
      } else {
        // モックデータ
        setFailedJobs([
          {
            id: 'f1',
            job_id: 'job-fail-001',
            tool_id: 'listing-auto',
            params: { productIds: ['999'], platform: 'ebay', account: 'mjt' },
            error: 'eBay API Error: Item not found',
            error_details: 'The specified product ID does not exist in the database.',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            retry_count: 0,
          },
          {
            id: 'f2',
            job_id: 'job-fail-002',
            tool_id: 'listing-batch',
            params: { productIds: ['123', '456', '789'], platform: 'amazon' },
            error: 'Rate limit exceeded',
            error_details: 'Amazon SP-API rate limit reached. Please wait and retry.',
            created_at: new Date(Date.now() - 7200000).toISOString(),
            retry_count: 2,
          },
        ]);
      }
    } catch (err) {
      console.error('Fetch failed jobs error:', err);
    }
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    fetchFailedJobs();
  }, [fetchFailedJobs]);
  
  // 再実行
  const retryJob = useCallback(async (job: FailedJob) => {
    setRetryingId(job.id);
    
    try {
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'listing-error-recovery',
          action: 'retry',
          params: {
            originalJobId: job.job_id,
            originalToolId: job.tool_id,
            originalParams: job.params,
          },
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 成功したら一覧から削除
        setFailedJobs(prev => prev.filter(j => j.id !== job.id));
      } else {
        alert(`再実行失敗: ${data.error}`);
      }
    } catch (err) {
      alert('再実行中にエラーが発生しました');
    }
    
    setRetryingId(null);
  }, []);
  
  // ジョブ削除
  const dismissJob = useCallback(async (jobId: string) => {
    setFailedJobs(prev => prev.filter(j => j.id !== jobId));
  }, []);
  
  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString('ja-JP', { 
      month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };
  
  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ 
            width: 36, height: 36, borderRadius: 8, 
            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={18} style={{ color: 'white' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Error Recovery</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
              失敗ジョブ復旧
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ 
            padding: '4px 8px', fontSize: 11, fontWeight: 600,
            background: failedJobs.length > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
            color: failedJobs.length > 0 ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)',
            borderRadius: 4,
          }}>
            {failedJobs.length}件の失敗
          </span>
          <button
            onClick={fetchFailedJobs}
            disabled={isLoading}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '6px 10px', fontSize: 11, fontWeight: 500,
              background: 'var(--panel)', color: 'var(--text-muted)',
              border: '1px solid var(--panel-border)', borderRadius: 6, cursor: 'pointer',
            }}
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      
      {/* 失敗ジョブリスト */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
          </div>
        ) : failedJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <CheckCircle size={48} style={{ marginBottom: 12, opacity: 0.3, color: 'var(--success)' }} />
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--success)' }}>
              失敗ジョブはありません
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {failedJobs.map((job) => (
              <div
                key={job.id}
                style={{
                  padding: 12, background: 'var(--panel)', borderRadius: 8,
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <XCircle size={14} style={{ color: 'rgb(239, 68, 68)' }} />
                      <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                        {job.tool_id}
                      </span>
                      {job.retry_count > 0 && (
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                          (リトライ: {job.retry_count}回)
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                      {formatTime(job.created_at)}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 28, height: 28, background: 'var(--highlight)',
                        border: '1px solid var(--panel-border)', borderRadius: 4, cursor: 'pointer',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      onClick={() => retryJob(job)}
                      disabled={retryingId === job.id}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 28, height: 28, background: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 4, cursor: 'pointer',
                        color: 'rgb(59, 130, 246)',
                      }}
                    >
                      {retryingId === job.id ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                    </button>
                    <button
                      onClick={() => dismissJob(job.id)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 28, height: 28, background: 'var(--highlight)',
                        border: '1px solid var(--panel-border)', borderRadius: 4, cursor: 'pointer',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                
                {/* エラーメッセージ */}
                <div style={{ 
                  fontSize: 11, padding: 8, borderRadius: 4,
                  background: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)',
                }}>
                  {job.error}
                </div>
                
                {/* 詳細（展開時） */}
                {selectedJob?.id === job.id && (
                  <div style={{ marginTop: 8, padding: 8, background: 'var(--highlight)', borderRadius: 4 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
                      パラメータ:
                    </div>
                    <pre style={{ 
                      fontSize: 10, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                      color: 'var(--text)',
                    }}>
                      {JSON.stringify(job.params, null, 2)}
                    </pre>
                    {job.error_details && (
                      <>
                        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginTop: 8, marginBottom: 4 }}>
                          詳細:
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text)' }}>
                          {job.error_details}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 一括操作 */}
      {failedJobs.length > 0 && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => failedJobs.forEach(job => retryJob(job))}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px 16px', fontSize: 12, fontWeight: 600,
              background: 'var(--accent)', color: 'white',
              border: 'none', borderRadius: 6, cursor: 'pointer',
            }}
          >
            <Play size={14} />
            全て再実行
          </button>
          <button
            onClick={() => setFailedJobs([])}
            style={{
              padding: '10px 16px', fontSize: 12, fontWeight: 600,
              background: 'var(--panel)', color: 'var(--text-muted)',
              border: '1px solid var(--panel-border)', borderRadius: 6, cursor: 'pointer',
            }}
          >
            全て削除
          </button>
        </div>
      )}
    </div>
  );
}
