// hooks/useRealtimeSync.ts
/**
 * Supabase Realtime + スプレッドシート同期 React Hook
 * 
 * 機能:
 * 1. DBの変更をリアルタイムで受信してUIを更新
 * 2. スプレッドシート同期ステータスの管理
 * 3. 手動同期トリガー
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';

// ============================================================
// 型定義
// ============================================================

export interface RealtimeConfig {
  tableName: string;
  schema?: string;
  filter?: string;
  onInsert?: (record: any) => void;
  onUpdate?: (record: any, oldRecord: any) => void;
  onDelete?: (oldRecord: any) => void;
  onChange?: (type: 'INSERT' | 'UPDATE' | 'DELETE', record: any, oldRecord?: any) => void;
}

export interface SyncStatus {
  isConnected: boolean;
  isRealtimeActive: boolean;
  lastUpdateAt: Date | null;
  pendingChanges: number;
  error: string | null;
}

export interface UseRealtimeSyncReturn {
  status: SyncStatus;
  startSync: () => Promise<void>;
  stopSync: () => void;
  triggerFullSync: (spreadsheetId: string, sheetName?: string) => Promise<boolean>;
  isLoading: boolean;
}

// ============================================================
// Supabase クライアント
// ============================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// Hook: useRealtimeSync
// ============================================================

export function useRealtimeSync(config: RealtimeConfig): UseRealtimeSyncReturn {
  const [status, setStatus] = useState<SyncStatus>({
    isConnected: false,
    isRealtimeActive: false,
    lastUpdateAt: null,
    pendingChanges: 0,
    error: null
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  const configRef = useRef(config);
  configRef.current = config;
  
  // Realtime購読開始
  const startSync = useCallback(async () => {
    if (channelRef.current) {
      console.log('[useRealtimeSync] Already subscribed');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const channel = supabase
        .channel(`realtime-${config.tableName}-${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: config.schema || 'public',
            table: config.tableName,
            filter: config.filter
          },
          (payload) => {
            console.log('[useRealtimeSync] Change received:', payload.eventType);
            
            const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
            const newRecord = payload.new;
            const oldRecord = payload.old;
            
            // コールバック呼び出し
            switch (eventType) {
              case 'INSERT':
                configRef.current.onInsert?.(newRecord);
                break;
              case 'UPDATE':
                configRef.current.onUpdate?.(newRecord, oldRecord);
                break;
              case 'DELETE':
                configRef.current.onDelete?.(oldRecord);
                break;
            }
            
            configRef.current.onChange?.(eventType, newRecord, oldRecord);
            
            setStatus(prev => ({
              ...prev,
              lastUpdateAt: new Date()
            }));
          }
        )
        .subscribe((status) => {
          console.log('[useRealtimeSync] Subscription status:', status);
          
          setStatus(prev => ({
            ...prev,
            isConnected: status === 'SUBSCRIBED',
            isRealtimeActive: status === 'SUBSCRIBED',
            error: status === 'CHANNEL_ERROR' ? 'Connection error' : null
          }));
        });
      
      channelRef.current = channel;
    } catch (error: any) {
      console.error('[useRealtimeSync] Error:', error);
      setStatus(prev => ({
        ...prev,
        error: error.message
      }));
    } finally {
      setIsLoading(false);
    }
  }, [config.tableName, config.schema, config.filter]);
  
  // Realtime購読停止
  const stopSync = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      
      setStatus(prev => ({
        ...prev,
        isConnected: false,
        isRealtimeActive: false
      }));
      
      console.log('[useRealtimeSync] Unsubscribed');
    }
  }, []);
  
  // フルシンク実行（DB → スプレッドシート）
  const triggerFullSync = useCallback(async (
    spreadsheetId: string, 
    sheetName?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/sync/spreadsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'full_sync',
          tableName: config.tableName,
          spreadsheetId,
          sheetName
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStatus(prev => ({
          ...prev,
          lastUpdateAt: new Date()
        }));
      }
      
      return result.success;
    } catch (error: any) {
      console.error('[useRealtimeSync] Full sync error:', error);
      setStatus(prev => ({
        ...prev,
        error: error.message
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [config.tableName]);
  
  // クリーンアップ
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);
  
  return {
    status,
    startSync,
    stopSync,
    triggerFullSync,
    isLoading
  };
}

// ============================================================
// Hook: useRealtimeTable
// データを自動更新するシンプルなフック
// ============================================================

export interface UseRealtimeTableOptions<T> {
  tableName: string;
  initialData?: T[];
  filter?: string;
  orderBy?: { column: string; ascending?: boolean };
}

export interface UseRealtimeTableReturn<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  lastUpdateAt: Date | null;
  refetch: () => Promise<void>;
}

export function useRealtimeTable<T = any>(
  options: UseRealtimeTableOptions<T>
): UseRealtimeTableReturn<T> {
  const { tableName, initialData = [], filter, orderBy } = options;
  
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdateAt, setLastUpdateAt] = useState<Date | null>(null);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  
  // データ取得
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase.from(tableName).select('*');
      
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }
      
      const { data: fetchedData, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      setData((fetchedData || []) as T[]);
      setLastUpdateAt(new Date());
    } catch (err: any) {
      console.error('[useRealtimeTable] Fetch error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [tableName, orderBy]);
  
  // Realtime購読
  useEffect(() => {
    fetchData();
    
    const channel = supabase
      .channel(`table-${tableName}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          filter
        },
        (payload) => {
          const eventType = payload.eventType;
          const newRecord = payload.new as T;
          const oldRecord = payload.old as T;
          
          setData(prevData => {
            switch (eventType) {
              case 'INSERT':
                return [...prevData, newRecord];
                
              case 'UPDATE':
                return prevData.map(item => 
                  (item as any).id === (newRecord as any).id ? newRecord : item
                );
                
              case 'DELETE':
                return prevData.filter(item => 
                  (item as any).id !== (oldRecord as any).id
                );
                
              default:
                return prevData;
            }
          });
          
          setLastUpdateAt(new Date());
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });
    
    channelRef.current = channel;
    
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [tableName, filter, fetchData]);
  
  return {
    data,
    isLoading,
    error,
    isConnected,
    lastUpdateAt,
    refetch: fetchData
  };
}

// ============================================================
// エクスポート
// ============================================================

export default useRealtimeSync;
