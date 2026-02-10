// lib/hooks/useSupabaseRealtime.ts
/**
 * N3 Supabase Realtime Hook
 * 
 * 受注ハブ、在庫監視などの更新をリアルタイム検知
 * 汎用的なRealtime購読Hook
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient, RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type PostgresChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseSupabaseRealtimeOptions<T> {
  table: string;
  schema?: string;
  event?: PostgresChangeEvent;
  filter?: string;
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: { old: T; new: T }) => void;
  onDelete?: (payload: T) => void;
  onChange?: (payload: RealtimePostgresChangesPayload<T>) => void;
}

export function useSupabaseRealtime<T = any>(options: UseSupabaseRealtimeOptions<T>) {
  const [latestChange, setLatestChange] = useState<RealtimePostgresChangesPayload<T> | null>(null);
  const [changeCount, setChangeCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const channelName = `realtime-${options.table}-${Date.now()}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: options.event || '*',
          schema: options.schema || 'public',
          table: options.table,
          filter: options.filter,
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          setLatestChange(payload);
          setChangeCount(prev => prev + 1);
          options.onChange?.(payload);

          // イベント別コールバック
          if (payload.eventType === 'INSERT' && options.onInsert) {
            options.onInsert(payload.new as T);
          } else if (payload.eventType === 'UPDATE' && options.onUpdate) {
            options.onUpdate({ old: payload.old as T, new: payload.new as T });
          } else if (payload.eventType === 'DELETE' && options.onDelete) {
            options.onDelete(payload.old as T);
          }
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
  }, [options.table, options.schema, options.event, options.filter]);

  return {
    latestChange,
    changeCount,
    isConnected,
    resetCount: () => setChangeCount(0),
  };
}

// ==========================================
// 特定テーブル用のプリセットHooks
// ==========================================

// 受注ハブ監視
export function useOrdersRealtime(options?: {
  onNewOrder?: (order: any) => void;
  onStatusChange?: (order: any) => void;
}) {
  return useSupabaseRealtime({
    table: 'orders_unified',
    event: '*',
    onInsert: options?.onNewOrder,
    onUpdate: ({ new: newOrder }) => options?.onStatusChange?.(newOrder),
  });
}

// 在庫変更監視
export function useInventoryRealtime(options?: {
  onQuantityChange?: (item: any) => void;
  filter?: string;
}) {
  return useSupabaseRealtime({
    table: 'inventory_master',
    event: 'UPDATE',
    filter: options?.filter,
    onUpdate: ({ new: item }) => options?.onQuantityChange?.(item),
  });
}

// タスク監視
export function useAdminTasksRealtime(options?: {
  onNewTask?: (task: any) => void;
  onTaskComplete?: (task: any) => void;
}) {
  return useSupabaseRealtime({
    table: 'admin_tasks',
    event: '*',
    onInsert: options?.onNewTask,
    onUpdate: ({ new: task }) => {
      if (task.status === 'completed') {
        options?.onTaskComplete?.(task);
      }
    },
  });
}

// リサーチ結果監視
export function useResearchResultsRealtime(options?: {
  onNewResult?: (result: any) => void;
}) {
  return useSupabaseRealtime({
    table: 'research_results',
    event: 'INSERT',
    onInsert: options?.onNewResult,
  });
}

// 出品ステータス監視
export function useProductsRealtime(options?: {
  onStatusChange?: (product: any) => void;
  onAuditComplete?: (product: any) => void;
}) {
  return useSupabaseRealtime({
    table: 'products_master',
    event: 'UPDATE',
    onUpdate: ({ old: oldProduct, new: newProduct }) => {
      if (oldProduct.status !== newProduct.status) {
        options?.onStatusChange?.(newProduct);
      }
      if (!oldProduct.audit_status && newProduct.audit_status) {
        options?.onAuditComplete?.(newProduct);
      }
    },
  });
}
