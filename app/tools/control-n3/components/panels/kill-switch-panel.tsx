// app/tools/control-n3/components/panels/kill-switch-panel.tsx
/**
 * 🔴 Phase G: Kill Switch Panel
 * 
 * 全自動停止・Scheduler停止・手動介入UI
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Power, Pause, Play, AlertOctagon, Shield, Clock, RefreshCw,
  Loader2, CheckCircle, XCircle, AlertTriangle, Zap, Calendar
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface KillSwitchStatus {
  active: boolean;
  reason?: string;
  activatedAt?: string;
  activatedBy?: string;
  autoResumeAt?: string;
  pausedTools: string[];
}

interface SystemFlags {
  automation_enabled: boolean;
  scheduler_enabled: boolean;
  pipeline_enabled: boolean;
  kill_switch: boolean;
}

// ============================================================
// Kill Switch Panel
// ============================================================

export function KillSwitchPanel() {
  const [status, setStatus] = useState<KillSwitchStatus | null>(null);
  const [flags, setFlags] = useState<SystemFlags | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivating, setIsActivating] = useState(false);
  const [reason, setReason] = useState('');
  const [autoResumeMinutes, setAutoResumeMinutes] = useState<number>(0);
  
  const fetchStatus = useCallback(async () => {
    try {
      const [killRes, healthRes] = await Promise.all([
        fetch('/api/dispatch/kill-switch'),
        fetch('/api/dispatch/health'),
      ]);
      
      const killData = await killRes.json();
      const healthData = await healthRes.json();
      
      if (killData.success) {
        setStatus({
          active: killData.active,
          reason: killData.reason,
          activatedAt: killData.activatedAt,
          activatedBy: killData.activatedBy,
          autoResumeAt: killData.autoResumeAt,
          pausedTools: killData.pausedTools || [],
        });
      }
      
      if (healthData.success) {
        setFlags({
          automation_enabled: healthData.automationEnabled !== false,
          scheduler_enabled: healthData.schedulerEnabled !== false,
          pipeline_enabled: healthData.pipelineEnabled !== false,
          kill_switch: healthData.killSwitch?.active || false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus]);
  
  const activateKillSwitch = async () => {
    if (!reason.trim()) {
      alert('理由を入力してください');
      return;
    }
    
    setIsActivating(true);
    try {
      const res = await fetch('/api/dispatch/kill-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'activate',
          reason: reason.trim(),
          autoResumeMinutes: autoResumeMinutes > 0 ? autoResumeMinutes : undefined,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        await fetchStatus();
        setReason('');
        setAutoResumeMinutes(0);
      } else {
        alert(`エラー: ${data.error}`);
      }
    } catch (error: any) {
      alert(`エラー: ${error.message}`);
    } finally {
      setIsActivating(false);
    }
  };
  
  const deactivateKillSwitch = async () => {
    if (!confirm('Kill Switch を解除しますか？')) return;
    
    setIsActivating(true);
    try {
      const res = await fetch('/api/dispatch/kill-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deactivate' }),
      });
      
      const data = await res.json();
      if (data.success) {
        await fetchStatus();
      } else {
        alert(`エラー: ${data.error}`);
      }
    } catch (error: any) {
      alert(`エラー: ${error.message}`);
    } finally {
      setIsActivating(false);
    }
  };
  
  const toggleFlag = async (flag: string, currentValue: boolean) => {
    try {
      const res = await fetch('/api/dispatch/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [flag]: !currentValue }),
      });
      
      if (res.ok) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Failed to toggle flag:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }
  
  const isActive = status?.active || false;
  
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-bold text-white">Kill Switch</h2>
        </div>
        <button onClick={fetchStatus} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      {/* メインステータス */}
      <div className={`rounded-xl p-6 border ${isActive ? 'bg-red-900/20 border-red-800' : 'bg-green-900/20 border-green-800'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isActive ? 'bg-red-600' : 'bg-green-600'}`}>
              {isActive ? <AlertOctagon className="w-8 h-8 text-white" /> : <CheckCircle className="w-8 h-8 text-white" />}
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{isActive ? 'ACTIVE' : 'NORMAL'}</div>
              <div className="text-sm text-gray-400">{isActive ? 'システムは停止中です' : 'システムは正常に動作しています'}</div>
            </div>
          </div>
          
          {isActive ? (
            <button onClick={deactivateKillSwitch} disabled={isActivating} className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-medium text-white disabled:opacity-50">
              {isActivating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              解除
            </button>
          ) : null}
        </div>
        
        {isActive && status?.reason && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <div className="text-sm text-gray-400">理由</div>
            <div className="text-white">{status.reason}</div>
            {status.activatedAt && (
              <div className="text-xs text-gray-500 mt-1">
                <Clock className="w-3 h-3 inline mr-1" />
                {new Date(status.activatedAt).toLocaleString()} by {status.activatedBy || 'system'}
              </div>
            )}
            {status.autoResumeAt && (
              <div className="text-xs text-blue-400 mt-1">
                <Calendar className="w-3 h-3 inline mr-1" />
                自動解除予定: {new Date(status.autoResumeAt).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Kill Switch 有効化フォーム */}
      {!isActive && (
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Kill Switch を有効化</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">理由 *</label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="緊急停止の理由を入力..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">自動解除（分）</label>
              <input
                type="number"
                value={autoResumeMinutes}
                onChange={e => setAutoResumeMinutes(parseInt(e.target.value) || 0)}
                placeholder="0 = 手動解除のみ"
                min={0}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500"
              />
              <div className="text-xs text-gray-500 mt-1">0 を入力すると手動解除のみになります</div>
            </div>
            <button
              onClick={activateKillSwitch}
              disabled={isActivating || !reason.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-medium text-white disabled:opacity-50"
            >
              {isActivating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Power className="w-5 h-5" />}
              Kill Switch を有効化
            </button>
          </div>
        </div>
      )}
      
      {/* 個別制御 */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">個別制御</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-sm font-medium text-white">Scheduler</div>
                <div className="text-xs text-gray-500">自動スケジュール実行</div>
              </div>
            </div>
            <button
              onClick={() => toggleFlag('scheduler_enabled', flags?.scheduler_enabled || false)}
              className={`w-12 h-6 rounded-full relative transition-colors ${flags?.scheduler_enabled ? 'bg-green-600' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${flags?.scheduler_enabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-sm font-medium text-white">Pipeline</div>
                <div className="text-xs text-gray-500">自動パイプライン処理</div>
              </div>
            </div>
            <button
              onClick={() => toggleFlag('pipeline_enabled', flags?.pipeline_enabled || false)}
              className={`w-12 h-6 rounded-full relative transition-colors ${flags?.pipeline_enabled ? 'bg-green-600' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${flags?.pipeline_enabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Power className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-sm font-medium text-white">Automation</div>
                <div className="text-xs text-gray-500">全自動化</div>
              </div>
            </div>
            <button
              onClick={() => toggleFlag('automation_enabled', flags?.automation_enabled || false)}
              className={`w-12 h-6 rounded-full relative transition-colors ${flags?.automation_enabled ? 'bg-green-600' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${flags?.automation_enabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* 停止中のツール */}
      {status?.pausedTools && status.pausedTools.length > 0 && (
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">停止中のツール ({status.pausedTools.length})</h3>
          <div className="flex flex-wrap gap-2">
            {status.pausedTools.map(tool => (
              <span key={tool} className="px-3 py-1 bg-red-900/30 text-red-400 rounded-full text-sm">
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default KillSwitchPanel;
