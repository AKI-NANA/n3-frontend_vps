// app/tools/operations-n3/components/SystemHealthDashboard.tsx
// ========================================
// 📊 N3 Empire OS V8.2.1-Autonomous
// MON-001/MON-002: システムヘルスダッシュボード
// ========================================

'use client';

import React, { useState, useEffect, useCallback } from 'react';

// ========================================
// 型定義
// ========================================

interface ToolMetric {
  toolId: string;
  toolName: string;
  toolCategory: string;
  executionCount: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  avgExecutionTimeMs: number;
  totalApiCostUsd: number;
  totalTokensUsed: number;
  lastExecutionAt: string | null;
}

interface OverviewMetric {
  totalExecutions: number;
  totalSuccess: number;
  totalFailure: number;
  overallSuccessRate: number;
  totalApiCost: number;
  totalTokens: number;
  activeTools: number;
  criticalErrors: number;
}

interface AlertItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  toolId: string;
  timestamp: string;
}

// ========================================
// スタイル
// ========================================

const styles = {
  container: {
    padding: '24px',
    height: '100%',
    overflow: 'auto',
    background: '#0f172a',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  } as React.CSSProperties,
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
  periodSelector: {
    display: 'flex',
    gap: '8px',
  } as React.CSSProperties,
  periodButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    border: 'none',
    background: '#334155',
    color: '#9ca3af',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  periodButtonActive: {
    background: '#3b82f6',
    color: '#fff',
  } as React.CSSProperties,
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  } as React.CSSProperties,
  overviewCard: {
    background: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #334155',
  } as React.CSSProperties,
  overviewLabel: {
    fontSize: '12px',
    color: '#9ca3af',
    marginBottom: '8px',
    textTransform: 'uppercase',
  } as React.CSSProperties,
  overviewValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
  } as React.CSSProperties,
  overviewChange: {
    fontSize: '12px',
    marginTop: '4px',
  } as React.CSSProperties,
  changePositive: {
    color: '#22c55e',
  } as React.CSSProperties,
  changeNegative: {
    color: '#ef4444',
  } as React.CSSProperties,
  section: {
    background: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #334155',
    marginBottom: '20px',
  } as React.CSSProperties,
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  } as React.CSSProperties,
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    borderBottom: '1px solid #334155',
  } as React.CSSProperties,
  td: {
    padding: '12px 16px',
    fontSize: '13px',
    color: '#e2e8f0',
    borderBottom: '1px solid #1e293b',
  } as React.CSSProperties,
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#334155',
    borderRadius: '4px',
    overflow: 'hidden',
  } as React.CSSProperties,
  progressFill: {
    height: '100%',
    borderRadius: '4px',
  } as React.CSSProperties,
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
  } as React.CSSProperties,
  badgeSuccess: {
    background: 'rgba(34, 197, 94, 0.1)',
    color: '#22c55e',
  } as React.CSSProperties,
  badgeWarning: {
    background: 'rgba(234, 179, 8, 0.1)',
    color: '#eab308',
  } as React.CSSProperties,
  badgeError: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
  } as React.CSSProperties,
  alertList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '300px',
    overflow: 'auto',
  } as React.CSSProperties,
  alertItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    background: '#0f172a',
    borderRadius: '8px',
    borderLeft: '3px solid',
  } as React.CSSProperties,
  alertError: {
    borderLeftColor: '#ef4444',
  } as React.CSSProperties,
  alertWarning: {
    borderLeftColor: '#eab308',
  } as React.CSSProperties,
  alertInfo: {
    borderLeftColor: '#3b82f6',
  } as React.CSSProperties,
  alertContent: {
    flex: 1,
  } as React.CSSProperties,
  alertTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '4px',
  } as React.CSSProperties,
  alertMessage: {
    fontSize: '12px',
    color: '#9ca3af',
  } as React.CSSProperties,
  alertTime: {
    fontSize: '11px',
    color: '#64748b',
  } as React.CSSProperties,
  chartContainer: {
    height: '200px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '4px',
    padding: '20px 0',
  } as React.CSSProperties,
  chartBar: {
    flex: 1,
    background: '#3b82f6',
    borderRadius: '4px 4px 0 0',
    minWidth: '20px',
    transition: 'height 0.3s',
  } as React.CSSProperties,
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#9ca3af',
  } as React.CSSProperties,
};

// ========================================
// モックデータ
// ========================================

const MOCK_OVERVIEW: OverviewMetric = {
  totalExecutions: 12847,
  totalSuccess: 12103,
  totalFailure: 744,
  overallSuccessRate: 94.2,
  totalApiCost: 127.45,
  totalTokens: 2847521,
  activeTools: 87,
  criticalErrors: 3,
};

const MOCK_TOOLS: ToolMetric[] = [
  {
    toolId: 'selsimilar-ebay',
    toolName: 'Selsimilar（eBay）',
    toolCategory: 'research',
    executionCount: 1523,
    successCount: 1456,
    failureCount: 67,
    successRate: 95.6,
    avgExecutionTimeMs: 2340,
    totalApiCostUsd: 18.45,
    totalTokensUsed: 421500,
    lastExecutionAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    toolId: 'listing-execute',
    toolName: '出品実行',
    toolCategory: 'listing',
    executionCount: 3421,
    successCount: 3312,
    failureCount: 109,
    successRate: 96.8,
    avgExecutionTimeMs: 5120,
    totalApiCostUsd: 42.30,
    totalTokensUsed: 892000,
    lastExecutionAt: new Date(Date.now() - 120000).toISOString(),
  },
  {
    toolId: 'price-optimization',
    toolName: '価格最適化',
    toolCategory: 'pricing',
    executionCount: 2156,
    successCount: 2089,
    failureCount: 67,
    successRate: 96.9,
    avgExecutionTimeMs: 1890,
    totalApiCostUsd: 28.15,
    totalTokensUsed: 645000,
    lastExecutionAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    toolId: 'inventory-sync',
    toolName: '在庫同期',
    toolCategory: 'inventory',
    executionCount: 5678,
    successCount: 5234,
    failureCount: 444,
    successRate: 92.2,
    avgExecutionTimeMs: 3450,
    totalApiCostUsd: 38.55,
    totalTokensUsed: 889021,
    lastExecutionAt: new Date(Date.now() - 60000).toISOString(),
  },
];

const MOCK_ALERTS: AlertItem[] = [
  {
    id: '1',
    type: 'error',
    title: 'eBay API接続エラー',
    message: 'Rate limit exceeded. 5分後にリトライします。',
    toolId: 'selsimilar-ebay',
    timestamp: new Date(Date.now() - 180000).toISOString(),
  },
  {
    id: '2',
    type: 'warning',
    title: 'API予算警告',
    message: '本日のAPI消費が予算の80%に達しました。',
    toolId: 'global',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    type: 'info',
    title: '在庫同期完了',
    message: '1,234件の在庫データを同期しました。',
    toolId: 'inventory-sync',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
];

// ========================================
// コンポーネント
// ========================================

export function SystemHealthDashboard() {
  const [overview, setOverview] = useState<OverviewMetric>(MOCK_OVERVIEW);
  const [tools, setTools] = useState<ToolMetric[]>(MOCK_TOOLS);
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // TODO: 実際のAPI呼び出し
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // モックデータを使用
      setOverview(MOCK_OVERVIEW);
      setTools(MOCK_TOOLS);
      setAlerts(MOCK_ALERTS);
    } catch (error) {
      console.error('Failed to fetch health data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [period]);
  
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30秒ごとに更新
    return () => clearInterval(interval);
  }, [fetchData]);
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };
  
  const formatTime = (ms: number) => {
    if (ms >= 1000) return (ms / 1000).toFixed(1) + 's';
    return ms + 'ms';
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return '今';
    if (diffMins < 60) return `${diffMins}分前`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}時間前`;
    return date.toLocaleDateString('ja-JP');
  };
  
  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return '#22c55e';
    if (rate >= 90) return '#eab308';
    return '#ef4444';
  };
  
  return (
    <div style={styles.container}>
      {/* ヘッダー */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          📊 システムヘルス
        </h2>
        <div style={styles.periodSelector}>
          {(['today', 'week', 'month'] as const).map(p => (
            <button
              key={p}
              style={{
                ...styles.periodButton,
                ...(period === p ? styles.periodButtonActive : {})
              }}
              onClick={() => setPeriod(p)}
            >
              {p === 'today' ? '今日' : p === 'week' ? '週間' : '月間'}
            </button>
          ))}
        </div>
      </div>
      
      {/* 概要カード */}
      <div style={styles.overviewGrid}>
        <div style={styles.overviewCard}>
          <div style={styles.overviewLabel as React.CSSProperties}>総実行数</div>
          <div style={styles.overviewValue}>{formatNumber(overview.totalExecutions)}</div>
          <div style={{ ...styles.overviewChange as React.CSSProperties, ...styles.changePositive }}>
            ↑ 12.5%
          </div>
        </div>
        
        <div style={styles.overviewCard}>
          <div style={styles.overviewLabel as React.CSSProperties}>成功率</div>
          <div style={{
            ...styles.overviewValue,
            color: getSuccessRateColor(overview.overallSuccessRate)
          }}>
            {overview.overallSuccessRate.toFixed(1)}%
          </div>
          <div style={{ ...styles.overviewChange as React.CSSProperties, ...styles.changePositive }}>
            ↑ 0.8%
          </div>
        </div>
        
        <div style={styles.overviewCard}>
          <div style={styles.overviewLabel as React.CSSProperties}>APIコスト</div>
          <div style={styles.overviewValue}>${overview.totalApiCost.toFixed(2)}</div>
          <div style={{ ...styles.overviewChange as React.CSSProperties, ...styles.changeNegative }}>
            ↑ 8.2%
          </div>
        </div>
        
        <div style={styles.overviewCard}>
          <div style={styles.overviewLabel as React.CSSProperties}>トークン使用量</div>
          <div style={styles.overviewValue}>{formatNumber(overview.totalTokens)}</div>
        </div>
        
        <div style={styles.overviewCard}>
          <div style={styles.overviewLabel as React.CSSProperties}>アクティブツール</div>
          <div style={styles.overviewValue}>{overview.activeTools}</div>
        </div>
        
        <div style={styles.overviewCard}>
          <div style={styles.overviewLabel as React.CSSProperties}>重大エラー</div>
          <div style={{
            ...styles.overviewValue,
            color: overview.criticalErrors > 0 ? '#ef4444' : '#22c55e'
          }}>
            {overview.criticalErrors}
          </div>
        </div>
      </div>
      
      {/* ツール別メトリクス */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>🔧 ツール別パフォーマンス</h3>
        </div>
        
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th as React.CSSProperties}>ツール</th>
              <th style={styles.th as React.CSSProperties}>実行数</th>
              <th style={styles.th as React.CSSProperties}>成功率</th>
              <th style={styles.th as React.CSSProperties}>平均時間</th>
              <th style={styles.th as React.CSSProperties}>コスト</th>
              <th style={styles.th as React.CSSProperties}>最終実行</th>
            </tr>
          </thead>
          <tbody>
            {tools.map(tool => (
              <tr key={tool.toolId}>
                <td style={styles.td as React.CSSProperties}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{tool.toolName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{tool.toolCategory}</div>
                  </div>
                </td>
                <td style={styles.td as React.CSSProperties}>{formatNumber(tool.executionCount)}</td>
                <td style={styles.td as React.CSSProperties}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ ...styles.progressBar, width: '80px' }}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${tool.successRate}%`,
                          background: getSuccessRateColor(tool.successRate)
                        }}
                      />
                    </div>
                    <span style={{ color: getSuccessRateColor(tool.successRate) }}>
                      {tool.successRate.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td style={styles.td as React.CSSProperties}>{formatTime(tool.avgExecutionTimeMs)}</td>
                <td style={styles.td as React.CSSProperties}>${tool.totalApiCostUsd.toFixed(2)}</td>
                <td style={styles.td as React.CSSProperties}>
                  {tool.lastExecutionAt ? formatTimestamp(tool.lastExecutionAt) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* アラート一覧 */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>🚨 最近のアラート</h3>
          <span style={{
            ...styles.badge,
            ...(alerts.filter(a => a.type === 'error').length > 0 ? styles.badgeError : styles.badgeSuccess)
          }}>
            {alerts.filter(a => a.type === 'error').length} エラー
          </span>
        </div>
        
        {alerts.length === 0 ? (
          <div style={styles.emptyState as React.CSSProperties}>
            <p>🎉 アラートはありません</p>
          </div>
        ) : (
          <div style={styles.alertList as React.CSSProperties}>
            {alerts.map(alert => (
              <div
                key={alert.id}
                style={{
                  ...styles.alertItem,
                  ...(alert.type === 'error'
                    ? styles.alertError
                    : alert.type === 'warning'
                    ? styles.alertWarning
                    : styles.alertInfo)
                }}
              >
                <div style={styles.alertContent}>
                  <div style={styles.alertTitle}>{alert.title}</div>
                  <div style={styles.alertMessage as React.CSSProperties}>{alert.message}</div>
                </div>
                <div style={styles.alertTime as React.CSSProperties}>
                  {formatTimestamp(alert.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemHealthDashboard;
