// app/tools/control-n3/components/panels/startup-panel.tsx
/**
 * 🚀 Phase G: Startup Panel
 * 
 * 起動・停止・モード変更の統合UI
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Play, Square, Power, RefreshCw, Loader2, CheckCircle, XCircle,
  AlertTriangle, Clock, Shield, Zap, Server, Database, Gauge,
  ChevronDown, ChevronRight, Settings, AlertOctagon, Rocket
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

type OperationMode = 'dev' | 'staging' | 'prod';
type StartupPhase = 'idle' | 'preflight' | 'confirm' | 'warmup' | 'running' | 'stopping' | 'stopped' | 'error';
type CheckStatus = 'pending' | 'checking' | 'passed' | 'failed' | 'warning';

interface CheckResult {
  id: string;
  name: string;
  category: string;
  status: CheckStatus;
  message: string;
  critical: boolean;
}

interface StartupStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
}

interface StartupState {
  phase: StartupPhase;
  mode: OperationMode;
  steps: StartupStep[];
  error?: string;
}

interface ModeStatus {
  currentMode: OperationMode;
  canTransitionTo: OperationMode[];
}

const MODE_LABELS: Record<OperationMode, { label: string; color: string; description: string }> = {
  dev: { label: 'Development', color: '#6B7280', description: '開発・デバッグ用。自動化は手動のみ。' },
  staging: { label: 'Staging', color: '#F59E0B', description: 'テスト・検証用。制限付き自動化。' },
  prod: { label: 'Production', color: '#10B981', description: '本番運用。全自動化有効。' },
};

// ============================================================
// Startup Panel
// ============================================================

export function StartupPanel() {
  const [mode, setMode] = useState<ModeStatus | null>(null);
  const [state, setState] = useState<StartupState | null>(null);
  const [preflightResults, setPreflightResults] = useState<CheckResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetMode, setTargetMode] = useState<OperationMode>('dev');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['secrets', 'api', 'database', 'n8n', 'dispatch']));
  
  const fetchStatus = useCallback(async () => {
    try {
      const [startupRes, modeRes] = await Promise.all([
        fetch('/api/system/startup'),
        fetch('/api/system/mode'),
      ]);
      const startupData = await startupRes.json();
      const modeData = await modeRes.json();
      if (startupData.success) setState(startupData.state);
      if (modeData.success) setMode(modeData);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const runPreflight = useCallback(async () => {
    try {
      const res = await fetch('/api/system/preflight');
      const data = await res.json();
      if (data.success) setPreflightResults(data.checks || []);
    } catch (error) {
      console.error('Failed to run preflight:', error);
    }
  }, []);
  
  useEffect(() => {
    fetchStatus();
    runPreflight();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus, runPreflight]);
  
  const handleStart = async () => {
    setIsStarting(true);
    try {
      const res = await fetch('/api/system/startup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: targetMode }),
      });
      const data = await res.json();
      if (data.success) {
        setState(data.state);
        setShowConfirm(false);
      } else {
        alert(`起動失敗: ${data.error}`);
      }
    } catch (error: any) {
      alert(`エラー: ${error.message}`);
    } finally {
      setIsStarting(false);
    }
  };
  
  const handleStop = async (emergency: boolean = false) => {
    if (!confirm(emergency ? '緊急停止しますか？' : 'システムを停止しますか？')) return;
    setIsStopping(true);
    try {
      const res = await fetch(`/api/system/startup?emergency=${emergency}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setState(data.state);
      else alert(`停止失敗: ${data.error}`);
    } catch (error: any) {
      alert(`エラー: ${error.message}`);
    } finally {
      setIsStopping(false);
    }
  };
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };
  
  const groupedChecks = preflightResults.reduce((acc, check) => {
    if (!acc[check.category]) acc[check.category] = [];
    acc[check.category].push(check);
    return acc;
  }, {} as Record<string, CheckResult[]>);
  
  const StatusIcon = ({ status }: { status: CheckStatus }) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'checking': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };
  
  const CategoryIcon = ({ category }: { category: string }) => {
    switch (category) {
      case 'secrets': return <Shield className="w-4 h-4" />;
      case 'api': return <Zap className="w-4 h-4" />;
      case 'database': return <Database className="w-4 h-4" />;
      case 'n8n': return <Server className="w-4 h-4" />;
      case 'dispatch': return <Gauge className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }
  
  const currentPhase = state?.phase || 'idle';
  const isRunning = currentPhase === 'running';
  const canStart = currentPhase === 'idle' || currentPhase === 'stopped' || currentPhase === 'error';
  
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Rocket className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-white">System Startup</h2>
        </div>
        <button onClick={() => { fetchStatus(); runPreflight(); }} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      {/* 現在の状態 */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Current Status</div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: isRunning ? '#10B981' : currentPhase === 'error' ? '#EF4444' : '#6B7280' }} />
              <span className="text-xl font-bold text-white capitalize">{currentPhase}</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Mode</div>
            <div className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${MODE_LABELS[mode?.currentMode || 'dev'].color}20`, color: MODE_LABELS[mode?.currentMode || 'dev'].color }}>
              {MODE_LABELS[mode?.currentMode || 'dev'].label}
            </div>
          </div>
        </div>
        {state?.error && (
          <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-800">
            <div className="flex items-center gap-2 text-red-400">
              <AlertOctagon className="w-4 h-4" />
              <span className="font-medium">Error:</span>
              <span>{state.error}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* 起動ステップ */}
      {state?.steps && state.steps.length > 0 && state.steps.some(s => s.status !== 'pending') && (
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Startup Progress</h3>
          <div className="space-y-2">
            {state.steps.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.status === 'completed' ? 'bg-green-500' : step.status === 'running' ? 'bg-blue-500' : step.status === 'failed' ? 'bg-red-500' : 'bg-gray-600'}`}>
                  {step.status === 'running' ? <Loader2 className="w-3 h-3 animate-spin text-white" /> : step.status === 'completed' ? <CheckCircle className="w-3 h-3 text-white" /> : step.status === 'failed' ? <XCircle className="w-3 h-3 text-white" /> : <span className="text-xs text-white">{idx + 1}</span>}
                </div>
                <span className={`text-sm ${step.status === 'completed' ? 'text-green-400' : step.status === 'running' ? 'text-blue-400' : step.status === 'failed' ? 'text-red-400' : 'text-gray-500'}`}>{step.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Pre-flight Check */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Pre-flight Check</h3>
        <div className="space-y-2">
          {Object.entries(groupedChecks).map(([category, checks]) => (
            <div key={category} className="border border-gray-700 rounded-lg overflow-hidden">
              <button onClick={() => toggleCategory(category)} className="w-full flex items-center justify-between p-3 hover:bg-gray-700/30">
                <div className="flex items-center gap-2">
                  <CategoryIcon category={category} />
                  <span className="text-sm font-medium text-white capitalize">{category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{checks.filter(c => c.status === 'passed').length}/{checks.length}</span>
                  {expandedCategories.has(category) ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                </div>
              </button>
              {expandedCategories.has(category) && (
                <div className="border-t border-gray-700 p-2 space-y-1">
                  {checks.map(check => (
                    <div key={check.id} className="flex items-center justify-between px-2 py-1">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={check.status} />
                        <span className="text-sm text-gray-300">{check.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{check.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* 操作ボタン */}
      <div className="flex gap-4">
        {canStart && (
          <>
            <select value={targetMode} onChange={e => setTargetMode(e.target.value as OperationMode)} className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
              <option value="dev">Development</option>
              <option value="staging">Staging</option>
              <option value="prod">Production</option>
            </select>
            <button onClick={handleStart} disabled={isStarting} className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium text-white disabled:opacity-50">
              {isStarting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Start System
            </button>
          </>
        )}
        {isRunning && (
          <>
            <button onClick={() => handleStop(false)} disabled={isStopping} className="flex items-center gap-2 px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium text-white disabled:opacity-50">
              {isStopping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
              Stop
            </button>
            <button onClick={() => handleStop(true)} disabled={isStopping} className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-medium text-white disabled:opacity-50">
              <Power className="w-4 h-4" />
              Emergency Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default StartupPanel;
