// lib/hooks/useAuditStatus.ts
/**
 * N3 監査ステータス監視 Hook
 * 
 * products_master.audit_status をリアルタイム監視
 * Supabase Realtime使用
 */

import { useState, useEffect, useCallback } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface AuditStatus {
  status: 'pending' | 'passed' | 'warning' | 'failed';
  severity: 'info' | 'warning' | 'error';
  issues: string[];
  checked_at: string;
  ai_analysis?: {
    trademark_risk: boolean;
    prohibited_words: string[];
    confidence: number;
  };
}

interface UseAuditStatusOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useAuditStatus(productId: string | null, options: UseAuditStatusOptions = {}) {
  const [auditStatus, setAuditStatus] = useState<AuditStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 初期データ取得
  const fetchAuditStatus = useCallback(async () => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('products_master')
        .select('audit_status')
        .eq('id', productId)
        .single();

      if (fetchError) throw fetchError;
      setAuditStatus(data?.audit_status || null);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  // Realtime購読
  useEffect(() => {
    if (!productId) return;

    fetchAuditStatus();

    // Realtime channel設定
    const channel: RealtimeChannel = supabase
      .channel(`audit-status-${productId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products_master',
          filter: `id=eq.${productId}`,
        },
        (payload) => {
          if (payload.new && 'audit_status' in payload.new) {
            setAuditStatus(payload.new.audit_status as AuditStatus);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId, fetchAuditStatus]);

  // 自動リフレッシュ（オプション）
  useEffect(() => {
    if (!options.autoRefresh || !productId) return;

    const interval = setInterval(fetchAuditStatus, options.refreshInterval || 30000);
    return () => clearInterval(interval);
  }, [options.autoRefresh, options.refreshInterval, productId, fetchAuditStatus]);

  // 監査再実行トリガー
  const triggerAudit = useCallback(async () => {
    if (!productId) return;

    try {
      const response = await fetch('/api/n8n-auth/generate-internal-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'system' }),
      });

      const { token, timestamp } = await response.json();

      const webhookUrl = `${process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL}/audit-check`;
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N3-Internal-Token': token,
          'X-N3-Token-Timestamp': timestamp,
        },
        body: JSON.stringify({ product_ids: [productId] }),
      });

      // 更新を待つ
      setTimeout(fetchAuditStatus, 2000);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [productId, fetchAuditStatus]);

  return {
    auditStatus,
    isLoading,
    error,
    refresh: fetchAuditStatus,
    triggerAudit,
    // ステータスヘルパー
    isPassed: auditStatus?.status === 'passed',
    hasWarning: auditStatus?.status === 'warning',
    hasFailed: auditStatus?.status === 'failed',
    isPending: !auditStatus || auditStatus.status === 'pending',
  };
}

// 複数商品の監査ステータス一括取得
export function useAuditStatusBatch(productIds: string[]) {
  const [statuses, setStatuses] = useState<Record<string, AuditStatus | null>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    if (productIds.length === 0) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products_master')
        .select('id, audit_status')
        .in('id', productIds);

      if (error) throw error;

      const statusMap: Record<string, AuditStatus | null> = {};
      data?.forEach(item => {
        statusMap[item.id] = item.audit_status;
      });
      setStatuses(statusMap);
    } catch (err) {
      console.error('監査ステータス一括取得エラー:', err);
    } finally {
      setIsLoading(false);
    }
  }, [productIds]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { statuses, isLoading, refresh: fetchAll };
}
