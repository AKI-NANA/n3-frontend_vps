/**
 * Batch Process Tab - dispatch 統合版
 * 
 * Phase Final Fix: dispatch経由でn8n実行
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Upload, Package, Copy, Trash2, Play, Loader2, CheckCircle, 
  XCircle, Clock, RefreshCw, AlertTriangle 
} from 'lucide-react';
import { N3Button } from '@/components/n3';
import { dispatchService } from '@/lib/services/dispatch-service';
import { useDispatch } from '@/lib/hooks/use-dispatch';
import type { JobStatus } from '@/lib/services/dispatch-service';

export function BatchProcessTab() {
  const [batchInput, setBatchInput] = useState('');
  const [recentJobs, setRecentJobs] = useState<JobStatus[]>([]);
  
  // dispatch hook
  const { execute, isExecuting, lastResult, jobStatus } = useDispatch({
    onSuccess: (result) => {
      console.log('[BatchProcess] dispatch success:', result);
      // 完了後にジョブリストを更新
      refreshRecentJobs();
    },
    onError: (error) => {
      console.error('[BatchProcess] dispatch error:', error);
    },
    watchProgress: true,
  });
  
  // ASIN抽出
  const parsedAsins = batchInput.match(/[A-Z0-9]{10}/g) || [];
  const parsedCount = parsedAsins.length;

  // 最近のジョブを取得
  const refreshRecentJobs = useCallback(async () => {
    const { jobs } = await dispatchService.getJobs({
      toolId: 'amazon_research_bulk',
      limit: 10,
      sortOrder: 'desc',
    });
    setRecentJobs(jobs);
  }, []);

  // 初回読み込み
  useEffect(() => {
    refreshRecentJobs();
  }, [refreshRecentJobs]);

  // バッチ実行（dispatch経由）
  const handleProcess = useCallback(async () => {
    if (parsedAsins.length === 0) {
      alert('有効なASINがありません');
      return;
    }

    // dispatch 経由で実行
    await execute('amazon_research_bulk', {
      asins: parsedAsins,
      source: 'batch_input',
    });
  }, [parsedAsins, execute]);

  // リトライ
  const handleRetry = useCallback(async (jobId: string) => {
    await dispatchService.retryJob(jobId);
    refreshRecentJobs();
  }, [refreshRecentJobs]);

  // ステータスに応じた色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'var(--success)';
      case 'running': return 'var(--accent)';
      case 'pending': return 'var(--warning)';
      case 'failed':
      case 'timeout': return 'var(--error)';
      default: return 'var(--text-muted)';
    }
  };

  // ステータスアイコン
  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'completed': return <CheckCircle size={14} style={{ color: 'var(--success)' }} />;
      case 'running': return <Loader2 size={14} className="animate-spin" style={{ color: 'var(--accent)' }} />;
      case 'pending': return <Clock size={14} style={{ color: 'var(--warning)' }} />;
      case 'failed':
      case 'timeout': return <XCircle size={14} style={{ color: 'var(--error)' }} />;
      default: return <Clock size={14} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 入力エリア */}
      <div style={{ 
        background: 'var(--panel)', 
        borderRadius: 8, 
        overflow: 'hidden',
        border: '1px solid var(--panel-border)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '12px 16px', 
          borderBottom: '1px solid var(--panel-border)',
          background: 'var(--highlight)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Upload size={16} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>ASIN バッチ入力</span>
            <span style={{ 
              fontSize: 12, 
              padding: '2px 8px', 
              background: 'var(--accent)', 
              color: 'white', 
              borderRadius: 4 
            }}>
              {parsedCount} 件
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              onClick={async () => { 
                const text = await navigator.clipboard.readText(); 
                setBatchInput(prev => prev + '\n' + text); 
              }}
              style={{ 
                padding: '4px 10px', 
                fontSize: 12, 
                background: 'var(--bg)', 
                border: '1px solid var(--panel-border)', 
                borderRadius: 4, 
                color: 'var(--text)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Copy size={12} /> 貼付
            </button>
            <button 
              onClick={() => setBatchInput('')}
              style={{ 
                padding: '4px 10px', 
                fontSize: 12, 
                background: 'var(--bg)', 
                border: '1px solid var(--panel-border)', 
                borderRadius: 4, 
                color: 'var(--text)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Trash2 size={12} /> クリア
            </button>
          </div>
        </div>
        
        <textarea 
          value={batchInput} 
          onChange={(e) => setBatchInput(e.target.value)} 
          placeholder="ASIN、商品ID、URLを入力（1行に1つ）&#10;例: B08N5WRWNW&#10;    B07XYZ1234&#10;    https://amazon.co.jp/dp/B09ABC..." 
          style={{ 
            width: '100%', 
            height: 200, 
            padding: 16, 
            fontSize: 13, 
            fontFamily: 'monospace',
            background: 'var(--bg)', 
            border: 'none', 
            color: 'var(--text)', 
            resize: 'vertical',
            outline: 'none' 
          }} 
        />
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '12px 16px', 
          borderTop: '1px solid var(--panel-border)',
          background: 'var(--panel-alt)'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            dispatch API 経由で n8n ワークフローを実行します
          </div>
          <button
            onClick={handleProcess}
            disabled={isExecuting || parsedCount === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 20px',
              borderRadius: 6,
              border: 'none',
              background: isExecuting ? 'var(--panel-alt)' : 'var(--accent)',
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              cursor: isExecuting || parsedCount === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            {isExecuting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                処理中...
              </>
            ) : (
              <>
                <Play size={14} />
                リサーチ実行 ({parsedCount}件)
              </>
            )}
          </button>
        </div>
      </div>

      {/* 現在のジョブ状態 */}
      {jobStatus && (
        <div style={{
          padding: 16,
          background: `${getStatusColor(jobStatus.status)}15`,
          borderRadius: 8,
          border: `1px solid ${getStatusColor(jobStatus.status)}40`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <StatusIcon status={jobStatus.status} />
            <span style={{ fontWeight: 600 }}>Job: {jobStatus.jobId.slice(0, 8)}...</span>
            <span style={{ 
              fontSize: 12, 
              padding: '2px 8px', 
              borderRadius: 4,
              background: `${getStatusColor(jobStatus.status)}20`,
              color: getStatusColor(jobStatus.status),
            }}>
              {jobStatus.status}
            </span>
          </div>
          {jobStatus.progress > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ 
                height: 4, 
                borderRadius: 2, 
                background: 'rgba(255,255,255,0.2)',
                overflow: 'hidden',
              }}>
                <div style={{ 
                  width: `${jobStatus.progress}%`, 
                  height: '100%', 
                  background: getStatusColor(jobStatus.status),
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                {jobStatus.progress}% 完了
              </div>
            </div>
          )}
          {jobStatus.error && (
            <div style={{ 
              marginTop: 8, 
              padding: 8, 
              background: 'rgba(0,0,0,0.2)', 
              borderRadius: 4,
              fontSize: 12,
              color: 'var(--error)',
            }}>
              {jobStatus.error}
            </div>
          )}
        </div>
      )}

      {/* 最後の結果 */}
      {lastResult && !jobStatus && (
        <div style={{
          padding: 16,
          background: lastResult.success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          borderRadius: 8,
          border: `1px solid ${lastResult.success ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {lastResult.success ? (
              <CheckCircle size={16} style={{ color: 'var(--success)' }} />
            ) : (
              <XCircle size={16} style={{ color: 'var(--error)' }} />
            )}
            <span style={{ fontWeight: 600 }}>
              {lastResult.success ? '実行成功' : '実行失敗'}
            </span>
          </div>
          {lastResult.jobId && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Job ID: {lastResult.jobId}
            </div>
          )}
          {lastResult.error && (
            <div style={{ fontSize: 12, color: 'var(--error)', marginTop: 4 }}>
              {lastResult.error}
            </div>
          )}
          {lastResult.executionTime && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              実行時間: {lastResult.executionTime}ms
            </div>
          )}
        </div>
      )}

      {/* 最近のジョブ */}
      <div style={{ 
        background: 'var(--panel)', 
        borderRadius: 8, 
        border: '1px solid var(--panel-border)',
        overflow: 'hidden',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '12px 16px', 
          borderBottom: '1px solid var(--panel-border)',
          background: 'var(--panel-alt)'
        }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>最近の実行履歴</div>
          <button
            onClick={refreshRecentJobs}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              borderRadius: 4,
              border: 'none',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={12} />
            更新
          </button>
        </div>
        
        {recentJobs.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
            実行履歴がありません
          </div>
        ) : (
          <div>
            {recentJobs.map((job) => (
              <div
                key={job.jobId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  borderBottom: '1px solid var(--panel-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <StatusIcon status={job.status} />
                  <div>
                    <div style={{ fontSize: 12, fontFamily: 'monospace' }}>
                      {job.jobId.slice(0, 12)}...
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {new Date(job.createdAt).toLocaleString('ja-JP')}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ 
                    fontSize: 11, 
                    padding: '2px 8px', 
                    borderRadius: 4,
                    background: `${getStatusColor(job.status)}15`,
                    color: getStatusColor(job.status),
                  }}>
                    {job.status}
                  </span>
                  {['failed', 'timeout'].includes(job.status) && (
                    <button
                      onClick={() => handleRetry(job.jobId)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        border: 'none',
                        background: 'rgba(59,130,246,0.2)',
                        color: '#3B82F6',
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                    >
                      再試行
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
