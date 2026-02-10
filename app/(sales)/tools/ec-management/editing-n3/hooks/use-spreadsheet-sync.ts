// app/tools/editing-n3/hooks/use-spreadsheet-sync.ts
/**
 * スプレッドシート同期統合フック
 * 
 * editing-n3でスプレッドシート同期を使用するためのフック
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRealtimeTable } from '@/hooks/useRealtimeSync';
import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

export interface SpreadsheetSyncConfig {
  spreadsheetId: string;
  sheetName?: string;
  tableName?: 'products_master' | 'inventory_master';
  autoSync?: boolean;
}

export interface SpreadsheetSyncState {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncAt: Date | null;
  error: string | null;
  spreadsheetUrl: string | null;
}

export interface UseSpreadsheetSyncReturn {
  /** 同期状態 */
  state: SpreadsheetSyncState;
  /** 同期開始 */
  startSync: (config: SpreadsheetSyncConfig) => Promise<boolean>;
  /** フルシンク実行 */
  fullSync: () => Promise<boolean>;
  /** 同期停止 */
  stopSync: () => Promise<void>;
  /** スプレッドシートを開く */
  openSpreadsheet: () => void;
  /** 設定更新 */
  updateConfig: (config: Partial<SpreadsheetSyncConfig>) => void;
  /** 現在の設定 */
  config: SpreadsheetSyncConfig | null;
}

// ============================================================
// フック実装
// ============================================================

export function useSpreadsheetSync(): UseSpreadsheetSyncReturn {
  const [config, setConfig] = useState<SpreadsheetSyncConfig | null>(null);
  const [state, setState] = useState<SpreadsheetSyncState>({
    isConnected: false,
    isSyncing: false,
    lastSyncAt: null,
    error: null,
    spreadsheetUrl: null,
  });
  
  const configRef = useRef(config);
  configRef.current = config;
  
  // 同期開始
  const startSync = useCallback(async (newConfig: SpreadsheetSyncConfig): Promise<boolean> => {
    setState(prev => ({ ...prev, isSyncing: true, error: null }));
    
    try {
      const response = await fetch('/api/sync/spreadsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          spreadsheetId: newConfig.spreadsheetId,
          sheetName: newConfig.sheetName || 'Products',
          tableName: newConfig.tableName || 'products_master',
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setConfig(newConfig);
        setState(prev => ({
          ...prev,
          isConnected: true,
          isSyncing: false,
          lastSyncAt: new Date(),
          spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${newConfig.spreadsheetId}`,
        }));
        
        // LocalStorageに保存
        localStorage.setItem('n3_spreadsheet_config', JSON.stringify(newConfig));
        
        return true;
      } else {
        throw new Error(result.error || '同期開始に失敗しました');
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: error.message,
      }));
      return false;
    }
  }, []);
  
  // フルシンク
  const fullSync = useCallback(async (): Promise<boolean> => {
    if (!configRef.current) {
      setState(prev => ({ ...prev, error: '設定がありません' }));
      return false;
    }
    
    setState(prev => ({ ...prev, isSyncing: true, error: null }));
    
    try {
      const response = await fetch('/api/sync/spreadsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'full_sync',
          spreadsheetId: configRef.current.spreadsheetId,
          sheetName: configRef.current.sheetName || 'Products',
          tableName: configRef.current.tableName || 'products_master',
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          isSyncing: false,
          lastSyncAt: new Date(),
        }));
        return true;
      } else {
        throw new Error(result.error || 'フルシンクに失敗しました');
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: error.message,
      }));
      return false;
    }
  }, []);
  
  // 同期停止
  const stopSync = useCallback(async (): Promise<void> => {
    try {
      await fetch('/api/sync/spreadsheet', { method: 'DELETE' });
      
      setState(prev => ({
        ...prev,
        isConnected: false,
      }));
      
      localStorage.removeItem('n3_spreadsheet_config');
    } catch (error) {
      console.error('Stop sync error:', error);
    }
  }, []);
  
  // スプレッドシートを開く
  const openSpreadsheet = useCallback(() => {
    if (state.spreadsheetUrl) {
      window.open(state.spreadsheetUrl, '_blank');
    }
  }, [state.spreadsheetUrl]);
  
  // 設定更新
  const updateConfig = useCallback((updates: Partial<SpreadsheetSyncConfig>) => {
    setConfig(prev => {
      if (!prev) return null;
      const newConfig = { ...prev, ...updates };
      localStorage.setItem('n3_spreadsheet_config', JSON.stringify(newConfig));
      return newConfig;
    });
  }, []);
  
  // 初期化時にLocalStorageから設定を読み込み
  useEffect(() => {
    const saved = localStorage.getItem('n3_spreadsheet_config');
    if (saved) {
      try {
        const savedConfig = JSON.parse(saved) as SpreadsheetSyncConfig;
        setConfig(savedConfig);
        setState(prev => ({
          ...prev,
          spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${savedConfig.spreadsheetId}`,
        }));
        
        // 自動接続
        if (savedConfig.autoSync) {
          startSync(savedConfig);
        }
      } catch (e) {
        console.error('Failed to load saved config:', e);
      }
    }
  }, [startSync]);
  
  return {
    state,
    startSync,
    fullSync,
    stopSync,
    openSpreadsheet,
    updateConfig,
    config,
  };
}

export default useSpreadsheetSync;
