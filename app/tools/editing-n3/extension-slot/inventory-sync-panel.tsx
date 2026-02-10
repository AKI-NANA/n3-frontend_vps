// app/tools/editing-n3/extension-slot/inventory-sync-panel.tsx
/**
 * 🔄 Inventory Sync Panel
 * 
 * 他モール在庫同期パネル
 * - eBay/Amazon/メルカリ等との在庫同期
 * - 差分同期 / 完全同期
 * - 同期ログ表示
 * 
 * 接続: UI → Dispatch API → n8n
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { RefreshCw, Play, Loader2, CheckCircle, AlertCircle, ShoppingBag, Database, Clock, Zap } from 'lucide-react';

// ============================================================
// 型定義（独立state）
// ============================================================

type Platform = 'ebay' | 'amazon' | 'mercari' | 'qoo10' | 'all';
type SyncMode = 'incremental' | 'full';

interface SyncJob {
  jobId: string;
  platform: Platform;
  mode: SyncMode;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  syncedCount: number;
  totalCount: number;
  startedAt: string;
}

interface SyncLog {
  id: string;
  platform: string;
  mode: string;
  status: string;
  syncedCount: number;
  duration: number;
  completedAt: string;
}

// ============================================================
// Inventory Sync Panel Component
// ============================================================

export function InventorySyncPanel() {
  // 独立state（既存store/contextに依存しない）
  const [platform, setPlatform] = useState<Platform>('ebay');
  const [mode, setMode] = useState<SyncMode>('incremental');
  const [account, setAccount] = useState<string>('mjt');
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentJob, setCurrentJob] = useState<SyncJob | null>(null);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [result, setResult] = useState<{ synced: number; updated: number; errors: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const platforms: { id: Platform; label: string; color: string }[] = [
    { id: 'ebay', label: 'eBay', color: '#0064D2' },
    { id: 'amazon', label: 'Amazon', color: '#FF9900' },
    { id: 'mercari', label: 'Mercari', color: '#FF0211' },
    { id: 'qoo10', label: 'Qoo10', color: '#E91E63' },
    { id: 'all', label: '全プラットフォーム', color: '#6366F1' },
  ];
  
  const accounts = [
    { id: 'mjt', label: 'MJT (メイン)' },
    { id: 'green', label: 'GREEN' },
    { id: 'mystical', label: 'Mystical Japan' },
  ];

  // 同期ログ取得
  const fetchSyncLogs = useCallback(async () => {
    try {
      const response = await fetch('/api/dispatch/logs?tool_prefix=inventory-sync&limit=10');
      const data = await response.json();
      if (data.success && data.logs) {
        setSyncLogs(data.logs);
      } else {
        // モックデータ
        setSyncLogs([
          { id: '1', platform: 'ebay', mode: 'incremental', status: 'completed', syncedCount: 150, duration: 45, completedAt: new Date(Date.now() - 3600000).toISOString() },
          { id: '2', platform: 'amazon', mode: 'full', status: 'completed', syncedCount: 89, duration: 120, completedAt: new Date(Date.now() - 7200000).toISOString() },
        ]);
      }
    } catch (err) {
      console.error('Fetch sync logs error:', err);
    }
  }, []);

  useEffect(() => {
    fetchSyncLogs();
  }, [fetchSyncLogs]);
  
  // 同期実行
  const executeSync = useCallback(async () => {
    setIsSyncing(true);
    setError(null);
    setResult(null);
    
    try {
      // Dispatch API経由で実行
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'stock-killer',
          action: 'execute',
          params: {
            platform,
            mode,
            account,
          },
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Sync failed');
      }
      
      if (data.jobId) {
        setCurrentJob({
          jobId: data.jobId,
          platform,
          mode,
          status: 'pending',
          progress: 0,
          syncedCount: 0,
          totalCount: 0,
          startedAt: new Date().toISOString(),
        });
        
        // ポーリング
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/dispatch/${data.jobId}`);
            const status = await statusRes.json();
            
            setCurrentJob(prev => ({
              ...prev!,
              status: status.status,
              progress: status.progress || 0,
              syncedCount: status.result?.synced || 0,
              totalCount: status.result?.total || 0,
            }));
            
            if (status.status === 'completed' || status.status === 'failed') {
              clearInterval(pollInterval);
              if (status.status === 'completed') {
                setResult({
                  synced: status.result?.synced || 0,
                  updated: status.result?.updated || 0,
                  errors: status.result?.errors || 0,
                });
              } else {
                setError(status.error || 'Sync failed');
              }
              setCurrentJob(null);
              setIsSyncing(false);
              fetchSyncLogs();
            }
          } catch (err) {
            clearInterval(pollInterval);
            setError('Polling error');
            setIsSyncing(false);
          }
        }, 2000);
        
        setTimeout(() => {
          clearInterval(pollInterval);
          if (isSyncing) {
            setError('Timeout');
            setIsSyncing(false);
          }
        }, 600000);
      } else {
        setResult({
          synced: data.result?.synced || 0,
          updated: data.result?.updated || 0,
          errors: data.result?.errors || 0,
        });
        setIsSyncing(false);
        fetchSyncLogs();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsSyncing(false);
    }
  }, [platform, mode, account, isSyncing, fetchSyncLogs]);
  
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}秒`;
    return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
  };
  
  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString('ja-JP', { 
      month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };
  
  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ 
          width: 36, height: 36, borderRadius: 8, 
          background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <RefreshCw size={18} style={{ color: 'white' }} />
        </div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Inventory Sync</h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
            他モール在庫同期（Dispatch API経由）
          </p>
        </div>
      </div>
      
      {/* 設定フォーム */}
      <div style={{ 
        padding: 16, background: 'var(--highlight)', borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}>
        {/* プラットフォーム選択 */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
            プラットフォーム
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {platforms.map(p => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                style={{
                  padding: '6px 12px', fontSize: 11, fontWeight: 500,
                  background: platform === p.id ? p.color : 'var(--panel)',
                  color: platform === p.id ? 'white' : 'var(--text-muted)',
                  border: '1px solid var(--panel-border)', borderRadius: 6,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* 同期モード */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
            同期モード
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setMode('incremental')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px 12px', fontSize: 12, fontWeight: 500,
                background: mode === 'incremental' ? 'rgba(34, 197, 94, 0.15)' : 'var(--panel)',
                color: mode === 'incremental' ? 'rgb(34, 197, 94)' : 'var(--text-muted)',
                border: mode === 'incremental' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--panel-border)',
                borderRadius: 6, cursor: 'pointer',
              }}
            >
              <Zap size={14} />
              差分同期（高速）
            </button>
            <button
              onClick={() => setMode('full')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px 12px', fontSize: 12, fontWeight: 500,
                background: mode === 'full' ? 'rgba(59, 130, 246, 0.15)' : 'var(--panel)',
                color: mode === 'full' ? 'rgb(59, 130, 246)' : 'var(--text-muted)',
                border: mode === 'full' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--panel-border)',
                borderRadius: 6, cursor: 'pointer',
              }}
            >
              <Database size={14} />
              完全同期
            </button>
          </div>
        </div>
        
        {/* アカウント選択 */}
        {platform !== 'all' && (
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              アカウント
            </label>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              style={{
                width: '100%', height: 36, padding: '0 12px', fontSize: 12,
                background: 'var(--bg)', border: '1px solid var(--panel-border)',
                borderRadius: 6, color: 'var(--text)', outline: 'none',
              }}
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* 実行ボタン */}
        <button
          onClick={executeSync}
          disabled={isSyncing}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px 16px', fontSize: 13, fontWeight: 600,
            background: isSyncing ? 'var(--panel)' : 'var(--accent)',
            color: isSyncing ? 'var(--text-muted)' : 'white',
            border: 'none', borderRadius: 6, cursor: isSyncing ? 'not-allowed' : 'pointer',
          }}
        >
          {isSyncing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              同期中... {currentJob?.progress || 0}%
            </>
          ) : (
            <>
              <Play size={16} />
              同期開始
            </>
          )}
        </button>
      </div>
      
      {/* 進行状況 */}
      {currentJob && (
        <div style={{
          padding: 12, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 8,
          border: '1px solid rgba(59, 130, 246, 0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgb(59, 130, 246)' }}>
              {currentJob.platform.toUpperCase()} 同期中
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {currentJob.syncedCount}/{currentJob.totalCount}
            </span>
          </div>
          <div style={{ height: 6, background: 'var(--panel-border)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ 
              width: `${currentJob.progress}%`, height: '100%', 
              background: 'rgb(59, 130, 246)', transition: 'width 0.3s',
            }} />
          </div>
        </div>
      )}
      
      {/* エラー表示 */}
      {error && (
        <div style={{
          padding: 12, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 8,
          border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertCircle size={16} style={{ color: 'rgb(239, 68, 68)' }} />
          <span style={{ fontSize: 12, color: 'rgb(239, 68, 68)' }}>{error}</span>
        </div>
      )}
      
      {/* 結果表示 */}
      {result && (
        <div style={{
          padding: 12, background: 'rgba(34, 197, 94, 0.1)', borderRadius: 8,
          border: '1px solid rgba(34, 197, 94, 0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <CheckCircle size={16} style={{ color: 'rgb(34, 197, 94)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgb(34, 197, 94)' }}>
              同期完了
            </span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{result.synced}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>同期</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--success)' }}>{result.updated}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>更新</div>
            </div>
            {result.errors > 0 && (
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--error)' }}>{result.errors}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>エラー</div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 同期履歴 */}
      <div style={{ flex: 1, minHeight: 150 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={12} />
          同期履歴
        </div>
        {syncLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: 12 }}>
            履歴がありません
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {syncLogs.map(log => (
              <div
                key={log.id}
                style={{
                  padding: 10, background: 'var(--panel)', borderRadius: 6,
                  border: '1px solid var(--panel-border)', display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {log.status === 'completed' ? (
                    <CheckCircle size={14} style={{ color: 'var(--success)' }} />
                  ) : (
                    <AlertCircle size={14} style={{ color: 'var(--error)' }} />
                  )}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>
                      {log.platform.toUpperCase()} ({log.mode === 'full' ? '完全' : '差分'})
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {formatTime(log.completedAt)}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{log.syncedCount}件</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{formatDuration(log.duration)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
