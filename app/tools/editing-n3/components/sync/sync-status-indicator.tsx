// app/tools/editing-n3/components/sync/sync-status-indicator.tsx
/**
 * 同期状態インジケーター
 * 
 * Phase E: UI 表示状態強化（事故可視化）
 * マスタータブに配置して、最終同期時刻とエラー状態を表示
 * 
 * @version 1.0.0
 * @date 2026-01-28
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw, CheckCircle, AlertTriangle, Clock, 
  CloudDownload, CloudUpload, Lock, ExternalLink
} from 'lucide-react';

interface SyncStatus {
  pull: {
    last_executed_at: string | null;
    last_status: 'success' | 'error' | 'skipped' | null;
    last_error: string | null;
    updated_rows: number | null;
  };
  push: {
    last_executed_at: string | null;
    last_status: 'success' | 'error' | 'skipped' | null;
    last_error: string | null;
    synced_count: number | null;
  };
  is_locked: boolean;
  spreadsheet_url: string;
  enabled: boolean;
}

interface SyncStatusIndicatorProps {
  compact?: boolean;
  showDetails?: boolean;
  onRefresh?: () => void;
}

export function SyncStatusIndicator({
  compact = false,
  showDetails = true,
  onRefresh,
}: SyncStatusIndicatorProps) {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sync/status');
      const data = await res.json();
      
      if (data.success) {
        setStatus(data.status);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    
    // 30秒ごとに自動更新
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '未実行';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    
    if (diffMin < 1) return '1分以内';
    if (diffMin < 60) return `${diffMin}分前`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}時間前`;
    return date.toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (lastStatus: string | null) => {
    switch (lastStatus) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'skipped': return 'text-yellow-600';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (lastStatus: string | null) => {
    switch (lastStatus) {
      case 'success': return <CheckCircle size={14} className="text-green-600" />;
      case 'error': return <AlertTriangle size={14} className="text-red-600" />;
      case 'skipped': return <Clock size={14} className="text-yellow-600" />;
      default: return <Clock size={14} className="text-gray-400" />;
    }
  };

  if (loading && !status) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-xs">
        <RefreshCw size={12} className="animate-spin" />
        <span>同期状態を確認中...</span>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="flex items-center gap-2 text-red-500 text-xs">
        <AlertTriangle size={12} />
        <span>ステータス取得エラー</span>
      </div>
    );
  }

  if (!status) return null;

  // コンパクト表示
  if (compact) {
    const hasError = status.pull.last_status === 'error' || status.push.last_status === 'error';
    const isRecent = status.pull.last_executed_at && 
      (Date.now() - new Date(status.pull.last_executed_at).getTime()) < 60 * 60 * 1000; // 1時間以内

    return (
      <div className="flex items-center gap-2">
        {status.is_locked ? (
          <Lock size={12} className="text-yellow-500" title="同期中" />
        ) : hasError ? (
          <AlertTriangle size={12} className="text-red-500" title="エラーあり" />
        ) : isRecent ? (
          <CheckCircle size={12} className="text-green-500" title="正常" />
        ) : (
          <Clock size={12} className="text-gray-400" title="1時間以上前" />
        )}
        <span className="text-xs text-gray-500">
          {formatTime(status.pull.last_executed_at)}
        </span>
      </div>
    );
  }

  // 詳細表示
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-3">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <RefreshCw size={14} />
          Spreadsheet 同期状態
        </h4>
        <div className="flex items-center gap-2">
          {status.is_locked && (
            <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">
              <Lock size={10} />
              同期中
            </span>
          )}
          {!status.enabled && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              無効
            </span>
          )}
          <button
            onClick={() => { fetchStatus(); onRefresh?.(); }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title="更新"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Pull 状態 */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <CloudDownload size={14} className="text-blue-500" />
          <span className="text-gray-600 dark:text-gray-300">Pull (Sheet→DB)</span>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(status.pull.last_status)}
          <span className={getStatusColor(status.pull.last_status)}>
            {formatTime(status.pull.last_executed_at)}
          </span>
          {status.pull.updated_rows !== null && status.pull.updated_rows > 0 && (
            <span className="text-green-600 text-[10px]">
              +{status.pull.updated_rows}
            </span>
          )}
        </div>
      </div>

      {/* Push 状態 */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <CloudUpload size={14} className="text-purple-500" />
          <span className="text-gray-600 dark:text-gray-300">Push (DB→Sheet)</span>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(status.push.last_status)}
          <span className={getStatusColor(status.push.last_status)}>
            {formatTime(status.push.last_executed_at)}
          </span>
          {status.push.synced_count !== null && status.push.synced_count > 0 && (
            <span className="text-purple-600 text-[10px]">
              {status.push.synced_count}件
            </span>
          )}
        </div>
      </div>

      {/* エラー表示 */}
      {status.pull.last_error && (
        <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          Pull Error: {status.pull.last_error}
        </div>
      )}
      {status.push.last_error && (
        <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          Push Error: {status.push.last_error}
        </div>
      )}

      {/* シートリンク */}
      {showDetails && (
        <a
          href={status.spreadsheet_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          <ExternalLink size={10} />
          棚卸マスターを開く
        </a>
      )}
    </div>
  );
}

export default SyncStatusIndicator;
