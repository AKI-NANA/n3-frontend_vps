// components/n3/n3-spreadsheet-sync.tsx
/**
 * N3 Spreadsheet Sync Panel
 * 
 * スプレッドシート同期の設定・管理UI
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  RefreshCw, Link, Unlink, CheckCircle, AlertCircle, 
  ExternalLink, Copy, Settings, Database, FileSpreadsheet
} from 'lucide-react';
import { N3Button } from './presentational/n3-button';
import { N3Input } from './presentational/n3-input';
import { N3Badge } from './presentational/n3-badge';

// ============================================================
// 型定義
// ============================================================

interface SyncStatus {
  isConnected: boolean;
  lastSyncAt: Date | null;
  pendingChanges: number;
  errors: string[];
}

interface SpreadsheetConfig {
  spreadsheetId: string;
  sheetName: string;
  tableName: 'products_master' | 'inventory_master';
}

export interface N3SpreadsheetSyncProps {
  /** 初期設定 */
  initialConfig?: Partial<SpreadsheetConfig>;
  /** 同期開始時のコールバック */
  onSyncStart?: () => void;
  /** 同期完了時のコールバック */
  onSyncComplete?: (success: boolean) => void;
  /** コンパクトモード */
  compact?: boolean;
}

// ============================================================
// メインコンポーネント
// ============================================================

export function N3SpreadsheetSync({
  initialConfig,
  onSyncStart,
  onSyncComplete,
  compact = false
}: N3SpreadsheetSyncProps) {
  // 状態
  const [spreadsheetId, setSpreadsheetId] = useState(initialConfig?.spreadsheetId || '');
  const [sheetName, setSheetName] = useState(initialConfig?.sheetName || 'Products');
  const [tableName, setTableName] = useState<'products_master' | 'inventory_master'>(
    initialConfig?.tableName || 'products_master'
  );
  const [status, setStatus] = useState<SyncStatus>({
    isConnected: false,
    lastSyncAt: null,
    pendingChanges: 0,
    errors: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(!initialConfig?.spreadsheetId);
  
  // ステータス取得
  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/sync/spreadsheet');
      const data = await response.json();
      if (data.success) {
        setStatus(data.status);
      }
    } catch (error) {
      console.error('Status fetch error:', error);
    }
  }, []);
  
  // 同期開始
  const startSync = async () => {
    if (!spreadsheetId) {
      alert('スプレッドシートIDを入力してください');
      return;
    }
    
    setIsLoading(true);
    onSyncStart?.();
    
    try {
      const response = await fetch('/api/sync/spreadsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          spreadsheetId,
          sheetName,
          tableName
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus(prev => ({ ...prev, isConnected: true }));
        onSyncComplete?.(true);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Sync start error:', error);
      setStatus(prev => ({ 
        ...prev, 
        errors: [...prev.errors, error.message] 
      }));
      onSyncComplete?.(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // フルシンク
  const fullSync = async () => {
    if (!spreadsheetId) return;
    
    setIsLoading(true);
    onSyncStart?.();
    
    try {
      const response = await fetch('/api/sync/spreadsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'full_sync',
          spreadsheetId,
          sheetName,
          tableName
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus(prev => ({ ...prev, lastSyncAt: new Date() }));
        onSyncComplete?.(true);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Full sync error:', error);
      onSyncComplete?.(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 同期停止
  const stopSync = async () => {
    setIsLoading(true);
    
    try {
      await fetch('/api/sync/spreadsheet', { method: 'DELETE' });
      setStatus(prev => ({ ...prev, isConnected: false }));
    } catch (error) {
      console.error('Stop sync error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // スプレッドシートを開く
  const openSpreadsheet = () => {
    if (spreadsheetId) {
      window.open(`https://docs.google.com/spreadsheets/d/${spreadsheetId}`, '_blank');
    }
  };
  
  // GASコードをコピー
  const copyGasCode = async () => {
    try {
      const response = await fetch('/scripts/gas/n3-spreadsheet-sync.gs');
      const code = await response.text();
      await navigator.clipboard.writeText(code);
      alert('GASコードをクリップボードにコピーしました');
    } catch (error) {
      alert('コピーに失敗しました。ファイルを直接開いてください。');
    }
  };
  
  // 定期的なステータス更新
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // 30秒ごと
    return () => clearInterval(interval);
  }, [fetchStatus]);
  
  // ============================================================
  // コンパクトモード
  // ============================================================
  
  if (compact) {
    return (
      <div 
        className="flex items-center gap-3 px-4 py-2 rounded-lg"
        style={{ 
          background: status.isConnected ? 'var(--success-bg)' : 'var(--panel)',
          border: '1px solid var(--panel-border)'
        }}
      >
        <FileSpreadsheet 
          size={18} 
          style={{ color: status.isConnected ? 'var(--success)' : 'var(--text-muted)' }}
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              スプレッドシート同期
            </span>
            {status.isConnected ? (
              <N3Badge variant="success" size="sm">接続中</N3Badge>
            ) : (
              <N3Badge variant="muted" size="sm">未接続</N3Badge>
            )}
          </div>
          {status.lastSyncAt && (
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              最終同期: {status.lastSyncAt.toLocaleString('ja-JP')}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {status.isConnected ? (
            <>
              <button
                onClick={fullSync}
                disabled={isLoading}
                className="p-1.5 rounded hover:bg-black/10"
                title="フルシンク"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={openSpreadsheet}
                className="p-1.5 rounded hover:bg-black/10"
                title="スプレッドシートを開く"
              >
                <ExternalLink size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 rounded hover:bg-black/10"
              title="設定"
            >
              <Settings size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // ============================================================
  // フルモード
  // ============================================================
  
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ 
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)'
      }}
    >
      {/* ヘッダー */}
      <div 
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--panel-border)' }}
      >
        <div className="flex items-center gap-3">
          <FileSpreadsheet size={20} style={{ color: 'var(--accent)' }} />
          <span className="font-medium" style={{ color: 'var(--text)' }}>
            Google Sheets 同期
          </span>
          {status.isConnected ? (
            <N3Badge variant="success" size="sm">
              <CheckCircle size={12} className="mr-1" />
              接続中
            </N3Badge>
          ) : (
            <N3Badge variant="muted" size="sm">未接続</N3Badge>
          )}
        </div>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded hover:bg-black/5"
          style={{ color: 'var(--text-muted)' }}
        >
          <Settings size={18} />
        </button>
      </div>
      
      {/* 設定パネル */}
      {showSettings && (
        <div className="p-4 space-y-4" style={{ background: 'var(--highlight)' }}>
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
              スプレッドシートID
            </label>
            <input
              type="text"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              className="w-full px-3 py-2 rounded text-sm"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text)'
              }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              URLの /d/ と /edit の間の文字列
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                シート名
              </label>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="Products"
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  background: 'var(--panel)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text)'
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                テーブル
              </label>
              <select
                value={tableName}
                onChange={(e) => setTableName(e.target.value as any)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  background: 'var(--panel)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text)'
                }}
              >
                <option value="products_master">products_master（商品）</option>
                <option value="inventory_master">inventory_master（在庫）</option>
              </select>
            </div>
          </div>
          
          {/* GAS設定案内 */}
          <div 
            className="p-3 rounded-lg"
            style={{ 
              background: 'var(--panel)',
              border: '1px solid var(--warning)'
            }}
          >
            <div className="flex items-start gap-2">
              <AlertCircle size={16} style={{ color: 'var(--warning)', marginTop: 2 }} />
              <div className="text-sm">
                <p className="font-medium mb-1" style={{ color: 'var(--text)' }}>
                  Google Apps Script の設定が必要です
                </p>
                <p style={{ color: 'var(--text-muted)' }}>
                  スプレッドシートからの変更をN3に反映するには、GASスクリプトの設定が必要です。
                </p>
                <button
                  onClick={copyGasCode}
                  className="flex items-center gap-1 mt-2 text-xs hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  <Copy size={12} />
                  GASコードをコピー
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* アクションボタン */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {status.isConnected ? (
            <>
              <N3Button
                variant="primary"
                size="sm"
                onClick={fullSync}
                disabled={isLoading}
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                フルシンク
              </N3Button>
              <N3Button
                variant="ghost"
                size="sm"
                onClick={stopSync}
                disabled={isLoading}
              >
                <Unlink size={14} />
                切断
              </N3Button>
            </>
          ) : (
            <N3Button
              variant="primary"
              size="sm"
              onClick={startSync}
              disabled={isLoading || !spreadsheetId}
            >
              <Link size={14} />
              同期開始
            </N3Button>
          )}
        </div>
        
        {spreadsheetId && (
          <button
            onClick={openSpreadsheet}
            className="flex items-center gap-1 text-sm hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            <ExternalLink size={14} />
            スプレッドシートを開く
          </button>
        )}
      </div>
      
      {/* ステータス */}
      {status.lastSyncAt && (
        <div 
          className="px-4 py-2 text-xs"
          style={{ 
            background: 'var(--highlight)',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--panel-border)'
          }}
        >
          最終同期: {status.lastSyncAt.toLocaleString('ja-JP')}
          {status.pendingChanges > 0 && (
            <span className="ml-2">
              （保留中: {status.pendingChanges}件）
            </span>
          )}
        </div>
      )}
      
      {/* エラー表示 */}
      {status.errors.length > 0 && (
        <div 
          className="px-4 py-2 text-xs"
          style={{ 
            background: 'var(--error-bg)',
            color: 'var(--error)',
            borderTop: '1px solid var(--error)'
          }}
        >
          {status.errors[status.errors.length - 1]}
        </div>
      )}
    </div>
  );
}

export default N3SpreadsheetSync;
