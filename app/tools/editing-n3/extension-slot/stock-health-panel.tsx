// app/tools/editing-n3/extension-slot/stock-health-panel.tsx
/**
 * 🩺 Stock Health Panel
 * 
 * 在庫健全性チェックパネル
 * - 在庫異常スキャン
 * - 売切れ危険商品の検出
 * - 過剰在庫の検出
 * - 長期滞留在庫の検出
 * 
 * 接続: UI → Dispatch API → n8n
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Activity, Search, Loader2, AlertTriangle, TrendingDown, TrendingUp, Package, RefreshCw, CheckCircle } from 'lucide-react';

// ============================================================
// 型定義（独立state）
// ============================================================

interface HealthIssue {
  id: string;
  productId: string;
  sku: string;
  title: string;
  issueType: 'low_stock' | 'out_of_stock' | 'overstock' | 'stale' | 'price_mismatch';
  severity: 'critical' | 'warning' | 'info';
  currentStock: number;
  suggestedAction: string;
  detectedAt: string;
}

interface HealthStats {
  totalProducts: number;
  healthyCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  overstockCount: number;
  staleCount: number;
  lastScanAt: string | null;
}

// ============================================================
// Stock Health Panel Component
// ============================================================

export function StockHealthPanel() {
  // 独立state
  const [isScanning, setIsScanning] = useState(false);
  const [issues, setIssues] = useState<HealthIssue[]>([]);
  const [stats, setStats] = useState<HealthStats | null>(null);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [error, setError] = useState<string | null>(null);

  // 初期スキャン結果取得
  const fetchHealthData = useCallback(async () => {
    try {
      const response = await fetch('/api/dispatch/health-status?tool=inventory');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setIssues(data.issues || []);
      } else {
        // モックデータ
        setStats({
          totalProducts: 1250,
          healthyCount: 1100,
          lowStockCount: 85,
          outOfStockCount: 25,
          overstockCount: 30,
          staleCount: 10,
          lastScanAt: new Date(Date.now() - 3600000).toISOString(),
        });
        setIssues([
          { id: '1', productId: '123', sku: 'JP-001', title: '日本製茶碗セット', issueType: 'low_stock', severity: 'warning', currentStock: 2, suggestedAction: '在庫補充推奨', detectedAt: new Date().toISOString() },
          { id: '2', productId: '456', sku: 'JP-002', title: 'ヴィンテージ着物', issueType: 'out_of_stock', severity: 'critical', currentStock: 0, suggestedAction: '即時在庫補充', detectedAt: new Date().toISOString() },
          { id: '3', productId: '789', sku: 'JP-003', title: '陶器花瓶', issueType: 'overstock', severity: 'info', currentStock: 150, suggestedAction: 'セール価格検討', detectedAt: new Date().toISOString() },
        ]);
      }
    } catch (err) {
      console.error('Fetch health data error:', err);
    }
  }, []);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);
  
  // スキャン実行
  const executeScan = useCallback(async () => {
    setIsScanning(true);
    setError(null);
    
    try {
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'inventory-monitoring',
          action: 'scan',
          params: {
            thresholds: {
              lowStock: 5,
              overstock: 100,
              staleDays: 90,
            },
          },
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Scan failed');
      }
      
      // ポーリングしてスキャン完了を待つ
      if (data.jobId) {
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/dispatch/${data.jobId}`);
            const status = await statusRes.json();
            
            if (status.status === 'completed') {
              clearInterval(pollInterval);
              setStats(status.result?.stats);
              setIssues(status.result?.issues || []);
              setIsScanning(false);
            } else if (status.status === 'failed') {
              clearInterval(pollInterval);
              setError(status.error || 'Scan failed');
              setIsScanning(false);
            }
          } catch (err) {
            clearInterval(pollInterval);
            setError('Polling error');
            setIsScanning(false);
          }
        }, 2000);
        
        setTimeout(() => {
          clearInterval(pollInterval);
          if (isScanning) {
            setError('Timeout');
            setIsScanning(false);
          }
        }, 300000);
      } else {
        setStats(data.result?.stats);
        setIssues(data.result?.issues || []);
        setIsScanning(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsScanning(false);
    }
  }, [isScanning]);
  
  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true;
    return issue.severity === filter;
  });
  
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: 'rgb(239, 68, 68)', icon: <AlertTriangle size={14} /> };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: 'rgb(245, 158, 11)', icon: <TrendingDown size={14} /> };
      case 'info':
        return { bg: 'rgba(59, 130, 246, 0.15)', color: 'rgb(59, 130, 246)', icon: <TrendingUp size={14} /> };
      default:
        return { bg: 'var(--panel)', color: 'var(--text-muted)', icon: <Package size={14} /> };
    }
  };
  
  const formatTime = (iso: string | null) => {
    if (!iso) return '-';
    const date = new Date(iso);
    return date.toLocaleString('ja-JP', { 
      month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };
  
  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
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
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Stock Health</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
              在庫健全性チェック
            </p>
          </div>
        </div>
        
        <button
          onClick={executeScan}
          disabled={isScanning}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', fontSize: 12, fontWeight: 600,
            background: isScanning ? 'var(--panel)' : 'var(--accent)',
            color: isScanning ? 'var(--text-muted)' : 'white',
            border: 'none', borderRadius: 6, cursor: isScanning ? 'not-allowed' : 'pointer',
          }}
        >
          {isScanning ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              スキャン中...
            </>
          ) : (
            <>
              <Search size={14} />
              スキャン実行
            </>
          )}
        </button>
      </div>
      
      {/* 統計サマリー */}
      {stats && (
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
        }}>
          <div style={{ padding: 12, background: 'rgba(34, 197, 94, 0.1)', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(34, 197, 94)' }}>{stats.healthyCount}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>正常</div>
          </div>
          <div style={{ padding: 12, background: 'rgba(245, 158, 11, 0.1)', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(245, 158, 11)' }}>{stats.lowStockCount}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>在庫少</div>
          </div>
          <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(239, 68, 68)' }}>{stats.outOfStockCount}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>在庫切れ</div>
          </div>
          <div style={{ padding: 12, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(59, 130, 246)' }}>{stats.overstockCount}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>過剰在庫</div>
          </div>
        </div>
      )}
      
      {/* 最終スキャン日時 */}
      {stats?.lastScanAt && (
        <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'right' }}>
          最終スキャン: {formatTime(stats.lastScanAt)}
        </div>
      )}
      
      {/* フィルター */}
      <div style={{ display: 'flex', gap: 6 }}>
        {(['all', 'critical', 'warning', 'info'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 12px', fontSize: 11, fontWeight: 500,
              background: filter === f ? 'var(--accent)' : 'var(--panel)',
              color: filter === f ? 'white' : 'var(--text-muted)',
              border: '1px solid var(--panel-border)', borderRadius: 6, cursor: 'pointer',
            }}
          >
            {f === 'all' ? '全て' : f === 'critical' ? '緊急' : f === 'warning' ? '警告' : '情報'}
            {f !== 'all' && <span style={{ marginLeft: 4 }}>({issues.filter(i => i.severity === f).length})</span>}
          </button>
        ))}
      </div>
      
      {/* エラー表示 */}
      {error && (
        <div style={{
          padding: 12, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 8,
          border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertTriangle size={16} style={{ color: 'rgb(239, 68, 68)' }} />
          <span style={{ fontSize: 12, color: 'rgb(239, 68, 68)' }}>{error}</span>
        </div>
      )}
      
      {/* 問題リスト */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {filteredIssues.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <CheckCircle size={48} style={{ marginBottom: 12, opacity: 0.3, color: 'var(--success)' }} />
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--success)' }}>
              問題は検出されませんでした
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredIssues.map(issue => {
              const style = getSeverityStyle(issue.severity);
              return (
                <div
                  key={issue.id}
                  style={{
                    padding: 12, background: 'var(--panel)', borderRadius: 8,
                    border: `1px solid ${style.color}40`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ 
                        padding: 6, background: style.bg, borderRadius: 6, color: style.color,
                      }}>
                        {style.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>
                          {issue.title}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                          SKU: {issue.sku} | 在庫: {issue.currentStock}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      padding: '3px 8px', fontSize: 9, fontWeight: 600,
                      background: style.bg, color: style.color, borderRadius: 4,
                    }}>
                      {issue.severity.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ 
                    marginTop: 8, padding: 8, background: 'var(--highlight)', borderRadius: 4,
                    fontSize: 11, color: 'var(--text-muted)',
                  }}>
                    💡 {issue.suggestedAction}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
