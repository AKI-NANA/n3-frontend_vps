// app/tools/control-n3/components/panels/system-analysis-panel.tsx
/**
 * 📊 Phase F-3: System Analysis Panel
 * 
 * 商用準備率・危険項目・本番Go/NoGo を表示
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity, AlertTriangle, CheckCircle, XCircle, RefreshCw,
  Loader2, TrendingUp, Shield, Zap, Database, Server, Clock,
  AlertOctagon, Gauge
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface AnalysisReport {
  timestamp: string;
  
  uiCoverage: {
    total: number;
    connected: number;
    rate: number;
  };
  
  automationHealth: {
    masterEnabled: boolean;
    killSwitchActive: boolean;
    enabledTools: number;
    totalTools: number;
    quarantinedTools: number;
    successRate24h: number;
    concurrencyUtilization: number;
  };
  
  apiHealth: {
    dispatchSuccessRate: number;
    errorCount24h: number;
    rateLimitHits: number;
    circuitBreakerOpen: boolean;
  };
  
  pipelineHealth: {
    researchQueue: number;
    editingQueue: number;
    listingQueue: number;
    throughput24h: number;
  };
  
  commercialScore: number;
  verdict: 'READY_FOR_PRODUCTION' | 'BLOCKED' | 'WARNING';
  blockers: string[];
  warnings: string[];
}

// ============================================================
// スコアゲージコンポーネント
// ============================================================

function ScoreGauge({ score, size = 120 }: { score: number; size?: number }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  
  const getColor = (s: number) => {
    if (s >= 90) return '#10B981'; // green
    if (s >= 70) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景円 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#374151"
          strokeWidth={strokeWidth}
        />
        {/* スコア円 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color: getColor(score) }}>
          {score}
        </span>
        <span className="text-xs text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

// ============================================================
// メトリックカード
// ============================================================

function MetricCard({
  icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
}) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
      <div className="flex items-center gap-2 mb-1">
        <div style={{ color }}>{icon}</div>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className="text-lg font-semibold text-white">{value}</div>
      {subValue && <div className="text-xs text-gray-500">{subValue}</div>}
    </div>
  );
}

// ============================================================
// System Analysis Panel
// ============================================================

export function SystemAnalysisPanel() {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const fetchAnalysis = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/system/analysis');
      const data = await res.json();
      
      if (data.success) {
        setReport(data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch analysis:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, 60000); // 1分ごと
    return () => clearInterval(interval);
  }, [fetchAnalysis]);
  
  // Verdict バッジ
  const VerdictBadge = () => {
    if (!report) return null;
    
    const configs = {
      READY_FOR_PRODUCTION: {
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'READY FOR PRODUCTION',
        color: '#10B981',
        bgColor: 'rgba(16, 185, 129, 0.1)',
      },
      BLOCKED: {
        icon: <XCircle className="w-5 h-5" />,
        label: 'BLOCKED',
        color: '#EF4444',
        bgColor: 'rgba(239, 68, 68, 0.1)',
      },
      WARNING: {
        icon: <AlertTriangle className="w-5 h-5" />,
        label: 'WARNING',
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.1)',
      },
    };
    
    const config = configs[report.verdict];
    
    return (
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
        style={{ color: config.color, backgroundColor: config.bgColor }}
      >
        {config.icon}
        <span>{config.label}</span>
      </div>
    );
  };
  
  if (isLoading && !report) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }
  
  if (!report) {
    return (
      <div className="text-center text-gray-500 py-8">
        分析データを取得できませんでした
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-white">System Analysis</h2>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              <Clock className="w-3 h-3 inline mr-1" />
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchAnalysis}
            disabled={isLoading}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* メインスコアセクション */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-8">
          <ScoreGauge score={report.commercialScore} size={140} />
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Commercial Score</h3>
            <VerdictBadge />
            
            <p className="text-sm text-gray-400 mt-3">
              {report.verdict === 'READY_FOR_PRODUCTION' 
                ? '本番運用の準備が完了しています。' 
                : report.verdict === 'BLOCKED'
                  ? '本番運用にはブロッカーの解消が必要です。'
                  : '本番運用は可能ですが、警告項目を確認してください。'
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* ブロッカー・警告 */}
      {report.blockers.length > 0 && (
        <div className="bg-red-900/20 rounded-xl p-4 border border-red-800">
          <div className="flex items-center gap-2 mb-3">
            <AlertOctagon className="w-5 h-5 text-red-500" />
            <span className="font-semibold text-red-400">Blockers ({report.blockers.length})</span>
          </div>
          <ul className="space-y-2">
            {report.blockers.map((blocker, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-red-300">
                <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{blocker}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {report.warnings.length > 0 && (
        <div className="bg-yellow-900/20 rounded-xl p-4 border border-yellow-800">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-yellow-400">Warnings ({report.warnings.length})</span>
          </div>
          <ul className="space-y-2">
            {report.warnings.map((warning, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-yellow-300">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* メトリクスグリッド */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<Zap className="w-4 h-4" />}
          label="Dispatch Success"
          value={`${report.apiHealth.dispatchSuccessRate}%`}
          subValue={`${report.apiHealth.errorCount24h} errors/24h`}
          color="#3B82F6"
        />
        <MetricCard
          icon={<Server className="w-4 h-4" />}
          label="Automation"
          value={`${report.automationHealth.successRate24h}%`}
          subValue={`${report.automationHealth.enabledTools}/${report.automationHealth.totalTools} enabled`}
          color="#10B981"
        />
        <MetricCard
          icon={<Shield className="w-4 h-4" />}
          label="Kill Switch"
          value={report.automationHealth.killSwitchActive ? 'ACTIVE' : 'OFF'}
          color={report.automationHealth.killSwitchActive ? '#EF4444' : '#10B981'}
        />
        <MetricCard
          icon={<Gauge className="w-4 h-4" />}
          label="Concurrency"
          value={`${report.automationHealth.concurrencyUtilization}%`}
          subValue="utilization"
          color="#8B5CF6"
        />
      </div>
      
      {/* 詳細メトリクス */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* UI カバレッジ */}
        <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">UI Coverage</h4>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">{report.uiCoverage.rate}%</span>
            <span className="text-sm text-gray-500 mb-1">
              ({report.uiCoverage.connected}/{report.uiCoverage.total})
            </span>
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${report.uiCoverage.rate}%` }}
            />
          </div>
        </div>
        
        {/* パイプライン */}
        <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">Pipeline</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Listing Queue</span>
              <span className="text-white">{report.pipelineHealth.listingQueue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Throughput/24h</span>
              <span className="text-white">{report.pipelineHealth.throughput24h}</span>
            </div>
          </div>
        </div>
        
        {/* API Health */}
        <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">API Health</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Rate Limit Hits</span>
              <span className="text-white">{report.apiHealth.rateLimitHits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Circuit Breaker</span>
              <span className={report.apiHealth.circuitBreakerOpen ? 'text-red-400' : 'text-green-400'}>
                {report.apiHealth.circuitBreakerOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemAnalysisPanel;
