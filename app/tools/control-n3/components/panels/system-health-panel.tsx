// app/tools/control-n3/components/panels/system-health-panel.tsx
/**
 * 🏥 System Health Panel
 * 
 * Phase C-5 & C-6: 
 * - 外部API設定検証
 * - システムスモークテスト
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity, CheckCircle, XCircle, AlertTriangle, RefreshCw, Loader2,
  Play, Clock, Zap, Database, Server, Cloud, Shield, Key
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface ApiHealthStatus {
  name: string;
  status: 'ok' | 'error' | 'warning' | 'unconfigured';
  latency?: number;
  message?: string;
  lastChecked: string;
}

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  duration: number;
  message?: string;
}

interface SmokeTestResult {
  success: boolean;
  timestamp: string;
  duration: number;
  tests: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
}

// ============================================================
// System Health Panel
// ============================================================

export function SystemHealthPanel() {
  const [apiHealth, setApiHealth] = useState<ApiHealthStatus[]>([]);
  const [apiSummary, setApiSummary] = useState({ total: 0, ok: 0, error: 0, warning: 0, unconfigured: 0 });
  const [smokeTest, setSmokeTest] = useState<SmokeTestResult | null>(null);
  const [isLoadingApis, setIsLoadingApis] = useState(true);
  const [isRunningTest, setIsRunningTest] = useState(false);

  // API Health Check
  const fetchApiHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health/apis');
      const data = await res.json();
      if (data.success) {
        setApiHealth(data.apis || []);
        setApiSummary(data.summary || { total: 0, ok: 0, error: 0, warning: 0, unconfigured: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch API health:', error);
    } finally {
      setIsLoadingApis(false);
    }
  }, []);

  // Smoke Test
  const runSmokeTest = async () => {
    setIsRunningTest(true);
    try {
      const res = await fetch('/api/health/smoke-test');
      const data = await res.json();
      setSmokeTest(data);
    } catch (error) {
      console.error('Smoke test failed:', error);
    } finally {
      setIsRunningTest(false);
    }
  };

  useEffect(() => {
    fetchApiHealth();
  }, [fetchApiHealth]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'unconfigured':
      case 'skip':
        return <Key className="w-4 h-4 text-gray-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
      case 'pass':
        return 'bg-green-500/10 border-green-500/30';
      case 'error':
      case 'fail':
        return 'bg-red-500/10 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* API Health Section */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
        <div className="p-4 border-b border-[var(--panel-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cloud className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-bold">External API Health</h3>
              <p className="text-xs text-[var(--text-muted)]">外部APIの接続状態と設定確認</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded">{apiSummary.ok} OK</span>
              <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded">{apiSummary.error} Error</span>
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded">{apiSummary.warning} Warning</span>
              <span className="px-2 py-1 bg-gray-500/20 text-gray-500 rounded">{apiSummary.unconfigured} Not Set</span>
            </div>
            <button
              onClick={fetchApiHealth}
              disabled={isLoadingApis}
              className="px-3 py-1.5 bg-blue-500/20 text-blue-500 rounded text-sm flex items-center gap-2 hover:bg-blue-500/30"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingApis ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {isLoadingApis ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
            <p className="mt-2 text-sm text-[var(--text-muted)]">APIステータスを確認中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
            {apiHealth.map((api) => (
              <div
                key={api.name}
                className={`p-3 rounded-lg border ${getStatusColor(api.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{api.name}</span>
                  {getStatusIcon(api.status)}
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {api.message || api.status}
                </div>
                {api.latency && (
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    {api.latency}ms
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Smoke Test Section */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
        <div className="p-4 border-b border-[var(--panel-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-500" />
            <div>
              <h3 className="font-bold">System Smoke Test</h3>
              <p className="text-xs text-[var(--text-muted)]">UI → Dispatch → n8n → DB 全経路テスト</p>
            </div>
          </div>
          <button
            onClick={runSmokeTest}
            disabled={isRunningTest}
            className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg flex items-center gap-2 hover:bg-yellow-400 disabled:opacity-50"
          >
            {isRunningTest ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Full System Test
              </>
            )}
          </button>
        </div>

        {smokeTest && (
          <div className="p-4">
            {/* Summary */}
            <div className={`p-4 rounded-lg mb-4 ${smokeTest.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {smokeTest.success ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                  <div>
                    <div className={`font-bold ${smokeTest.success ? 'text-green-500' : 'text-red-500'}`}>
                      {smokeTest.success ? 'All Tests Passed' : 'Some Tests Failed'}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {new Date(smokeTest.timestamp).toLocaleString('ja-JP')} • {smokeTest.duration}ms
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded">{smokeTest.summary.passed} Passed</span>
                  <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded">{smokeTest.summary.failed} Failed</span>
                  <span className="px-2 py-1 bg-gray-500/20 text-gray-500 rounded">{smokeTest.summary.skipped} Skipped</span>
                </div>
              </div>
            </div>

            {/* Test Results */}
            <div className="space-y-2">
              {smokeTest.tests.map((test, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(test.status)}`}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <div className="font-medium text-sm">{test.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">{test.message}</div>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {test.duration}ms
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!smokeTest && !isRunningTest && (
          <div className="p-8 text-center text-[var(--text-muted)]">
            <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>「Run Full System Test」をクリックしてシステム全体のテストを実行</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemHealthPanel;
