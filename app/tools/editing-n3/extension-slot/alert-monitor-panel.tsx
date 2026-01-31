// app/tools/editing-n3/extension-slot/alert-monitor-panel.tsx
/**
 * 🚨 Alert Monitor Panel
 * 
 * 在庫アラート監視パネル
 * - リアルタイムアラート監視
 * - 閾値設定
 * - 自動アクション設定
 * 
 * 接続: UI → Dispatch API → n8n
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Bell, Play, Pause, Settings, Loader2, CheckCircle, AlertTriangle, AlertCircle, XCircle, Clock, Volume2, VolumeX } from 'lucide-react';

// ============================================================
// 型定義（独立state）
// ============================================================

interface Alert {
  id: string;
  type: 'stock_low' | 'stock_out' | 'price_change' | 'sync_error' | 'order_surge';
  severity: 'critical' | 'warning' | 'info';
  productId?: string;
  sku?: string;
  title: string;
  message: string;
  createdAt: string;
  acknowledged: boolean;
}

interface AlertThreshold {
  stockLow: number;
  stockCritical: number;
  priceChangePercent: number;
  syncErrorRetry: number;
}

// ============================================================
// Alert Monitor Panel Component
// ============================================================

export function AlertMonitorPanel() {
  // 独立state
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isWatching, setIsWatching] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [thresholds, setThresholds] = useState<AlertThreshold>({
    stockLow: 5,
    stockCritical: 1,
    priceChangePercent: 10,
    syncErrorRetry: 3,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // アラート取得
  const fetchAlerts = useCallback(async () => {
    try {
      const response = await fetch('/api/dispatch/alerts?tool=inventory&limit=20');
      const data = await response.json();
      
      if (data.success && data.alerts) {
        setAlerts(data.alerts);
      } else {
        // モックデータ
        setAlerts([
          { id: '1', type: 'stock_out', severity: 'critical', productId: '123', sku: 'JP-001', title: '在庫切れ', message: '日本製茶碗セットの在庫が0になりました', createdAt: new Date(Date.now() - 300000).toISOString(), acknowledged: false },
          { id: '2', type: 'stock_low', severity: 'warning', productId: '456', sku: 'JP-002', title: '在庫少', message: 'ヴィンテージ着物の在庫が残り3個です', createdAt: new Date(Date.now() - 600000).toISOString(), acknowledged: false },
          { id: '3', type: 'sync_error', severity: 'warning', title: '同期エラー', message: 'eBay MJTアカウントの同期に失敗しました', createdAt: new Date(Date.now() - 900000).toISOString(), acknowledged: true },
          { id: '4', type: 'price_change', severity: 'info', productId: '789', sku: 'JP-003', title: '価格変動', message: '競合商品の価格が15%下落しました', createdAt: new Date(Date.now() - 1200000).toISOString(), acknowledged: true },
        ]);
      }
    } catch (err) {
      console.error('Fetch alerts error:', err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // 監視開始/停止
  const toggleWatching = useCallback(async () => {
    try {
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'inventory-alert',
          action: isWatching ? 'stop' : 'watch',
          params: {
            thresholds,
          },
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsWatching(!isWatching);
      } else {
        setError(data.error || 'Failed to toggle watching');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [isWatching, thresholds]);
  
  // アラート承認
  const acknowledgeAlert = useCallback(async (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, acknowledged: true } : a
    ));
    
    try {
      await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'inventory-alert',
          action: 'acknowledge',
          params: { alertId },
        }),
      });
    } catch (err) {
      console.error('Acknowledge error:', err);
    }
  }, []);
  
  // 全承認
  const acknowledgeAll = useCallback(() => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
  }, []);
  
  // 全クリア
  const clearAll = useCallback(() => {
    setAlerts([]);
  }, []);
  
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: 'rgb(239, 68, 68)', icon: <XCircle size={14} /> };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: 'rgb(245, 158, 11)', icon: <AlertTriangle size={14} /> };
      case 'info':
        return { bg: 'rgba(59, 130, 246, 0.15)', color: 'rgb(59, 130, 246)', icon: <AlertCircle size={14} /> };
      default:
        return { bg: 'var(--panel)', color: 'var(--text-muted)', icon: <Bell size={14} /> };
    }
  };
  
  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    
    if (diff < 60) return '今';
    if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`;
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };
  
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;
  
  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ 
            width: 36, height: 36, borderRadius: 8, 
            background: criticalCount > 0 
              ? 'linear-gradient(135deg, #EF4444, #DC2626)' 
              : 'linear-gradient(135deg, #F59E0B, #D97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <Bell size={18} style={{ color: 'white' }} />
            {unacknowledgedCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                width: 18, height: 18, borderRadius: '50%',
                background: 'rgb(239, 68, 68)', color: 'white',
                fontSize: 10, fontWeight: 700, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                {unacknowledgedCount}
              </span>
            )}
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Alert Monitor</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
              在庫アラート監視
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, background: 'var(--panel)',
              border: '1px solid var(--panel-border)', borderRadius: 6, cursor: 'pointer',
              color: soundEnabled ? 'var(--accent)' : 'var(--text-muted)',
            }}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, background: showSettings ? 'var(--accent)' : 'var(--panel)',
              border: '1px solid var(--panel-border)', borderRadius: 6, cursor: 'pointer',
              color: showSettings ? 'white' : 'var(--text-muted)',
            }}
          >
            <Settings size={14} />
          </button>
          <button
            onClick={toggleWatching}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', fontSize: 12, fontWeight: 600,
              background: isWatching ? 'rgba(34, 197, 94, 0.15)' : 'var(--accent)',
              color: isWatching ? 'rgb(34, 197, 94)' : 'white',
              border: isWatching ? '1px solid rgba(34, 197, 94, 0.3)' : 'none',
              borderRadius: 6, cursor: 'pointer',
            }}
          >
            {isWatching ? <Pause size={14} /> : <Play size={14} />}
            {isWatching ? '監視中' : '監視開始'}
          </button>
        </div>
      </div>
      
      {/* 設定パネル */}
      {showSettings && (
        <div style={{
          padding: 12, background: 'var(--highlight)', borderRadius: 8,
          border: '1px solid var(--panel-border)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
            アラート閾値設定
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text-muted)' }}>在庫少（警告）</label>
              <input
                type="number"
                value={thresholds.stockLow}
                onChange={(e) => setThresholds({ ...thresholds, stockLow: parseInt(e.target.value) || 5 })}
                style={{
                  width: '100%', height: 32, padding: '0 8px', fontSize: 12,
                  background: 'var(--bg)', border: '1px solid var(--panel-border)',
                  borderRadius: 4, color: 'var(--text)', outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text-muted)' }}>在庫危険（緊急）</label>
              <input
                type="number"
                value={thresholds.stockCritical}
                onChange={(e) => setThresholds({ ...thresholds, stockCritical: parseInt(e.target.value) || 1 })}
                style={{
                  width: '100%', height: 32, padding: '0 8px', fontSize: 12,
                  background: 'var(--bg)', border: '1px solid var(--panel-border)',
                  borderRadius: 4, color: 'var(--text)', outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text-muted)' }}>価格変動（%）</label>
              <input
                type="number"
                value={thresholds.priceChangePercent}
                onChange={(e) => setThresholds({ ...thresholds, priceChangePercent: parseInt(e.target.value) || 10 })}
                style={{
                  width: '100%', height: 32, padding: '0 8px', fontSize: 12,
                  background: 'var(--bg)', border: '1px solid var(--panel-border)',
                  borderRadius: 4, color: 'var(--text)', outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text-muted)' }}>同期リトライ回数</label>
              <input
                type="number"
                value={thresholds.syncErrorRetry}
                onChange={(e) => setThresholds({ ...thresholds, syncErrorRetry: parseInt(e.target.value) || 3 })}
                style={{
                  width: '100%', height: 32, padding: '0 8px', fontSize: 12,
                  background: 'var(--bg)', border: '1px solid var(--panel-border)',
                  borderRadius: 4, color: 'var(--text)', outline: 'none',
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* アクションバー */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {alerts.length}件のアラート（{unacknowledgedCount}件未確認）
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={acknowledgeAll}
            disabled={unacknowledgedCount === 0}
            style={{
              padding: '4px 10px', fontSize: 10, fontWeight: 500,
              background: 'var(--panel)', color: unacknowledgedCount > 0 ? 'var(--accent)' : 'var(--text-muted)',
              border: '1px solid var(--panel-border)', borderRadius: 4,
              cursor: unacknowledgedCount > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            全て確認済み
          </button>
          <button
            onClick={clearAll}
            disabled={alerts.length === 0}
            style={{
              padding: '4px 10px', fontSize: 10, fontWeight: 500,
              background: 'var(--panel)', color: alerts.length > 0 ? 'var(--error)' : 'var(--text-muted)',
              border: '1px solid var(--panel-border)', borderRadius: 4,
              cursor: alerts.length > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            全てクリア
          </button>
        </div>
      </div>
      
      {/* エラー表示 */}
      {error && (
        <div style={{
          padding: 10, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 6,
          border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertCircle size={14} style={{ color: 'rgb(239, 68, 68)' }} />
          <span style={{ fontSize: 11, color: 'rgb(239, 68, 68)' }}>{error}</span>
        </div>
      )}
      
      {/* アラートリスト */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
          </div>
        ) : alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <CheckCircle size={48} style={{ marginBottom: 12, opacity: 0.3, color: 'var(--success)' }} />
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--success)' }}>
              アラートはありません
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.map(alert => {
              const style = getSeverityStyle(alert.severity);
              return (
                <div
                  key={alert.id}
                  style={{
                    padding: 12, background: 'var(--panel)', borderRadius: 8,
                    border: `1px solid ${alert.acknowledged ? 'var(--panel-border)' : style.color + '40'}`,
                    opacity: alert.acknowledged ? 0.6 : 1,
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{alert.title}</span>
                          {alert.sku && (
                            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              [{alert.sku}]
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {alert.message}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={10} />
                        {formatTime(alert.createdAt)}
                      </span>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          style={{
                            padding: '4px 8px', fontSize: 10, fontWeight: 500,
                            background: style.bg, color: style.color,
                            border: 'none', borderRadius: 4, cursor: 'pointer',
                          }}
                        >
                          確認
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* 監視ステータス */}
      <div style={{
        padding: 8, background: isWatching ? 'rgba(34, 197, 94, 0.1)' : 'var(--highlight)',
        borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: isWatching ? 'rgb(34, 197, 94)' : 'var(--text-muted)',
          animation: isWatching ? 'pulse 2s infinite' : 'none',
        }} />
        <span style={{ fontSize: 11, color: isWatching ? 'rgb(34, 197, 94)' : 'var(--text-muted)' }}>
          {isWatching ? 'リアルタイム監視中 (Dispatch経由)' : '監視停止中'}
        </span>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
