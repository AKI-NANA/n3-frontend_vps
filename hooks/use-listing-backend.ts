// hooks/use-listing-backend.ts
// 既存のUIを壊さず、必要に応じてバックエンドを切り替えるHook

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseListingBackendOptions {
  useN8n?: boolean;
  fallbackToInternal?: boolean;
}

export function useListingBackend(options: UseListingBackendOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 環境変数またはオプションでバックエンドを決定
  const shouldUseN8n = options.useN8n ?? process.env.NEXT_PUBLIC_USE_N8N === 'true';
  const fallback = options.fallbackToInternal ?? true;
  
  // 既存のAPI呼び出し（変更なし）
  const executeWithInternalAPI = useCallback(async (
    endpoint: string,
    data: any
  ) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }, []);
  
  // n8n Webhook呼び出し（新規追加）
  const executeWithN8n = useCallback(async (
    action: string,
    data: any
  ) => {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    
    if (!webhookUrl) {
      throw new Error('n8n Webhook URL not configured');
    }
    
    const response = await fetch(`${webhookUrl}/${action}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_N8N_API_KEY || ''
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`n8n Error: ${response.status}`);
    }
    
    return response.json();
  }, []);
  
  // 統一実行関数
  const execute = useCallback(async (
    action: string,
    data: any,
    options: {
      endpoint?: string;
      forceInternal?: boolean;
      forceN8n?: boolean;
    } = {}
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      // 強制フラグがある場合はそれに従う
      if (options.forceInternal) {
        result = await executeWithInternalAPI(
          options.endpoint || `/api/listing/${action}`,
          data
        );
      } else if (options.forceN8n || shouldUseN8n) {
        try {
          result = await executeWithN8n(action, data);
        } catch (n8nError) {
          // n8nが失敗した場合、フォールバックが有効なら内部APIを使用
          if (fallback) {
            console.warn('n8n failed, falling back to internal API', n8nError);
            result = await executeWithInternalAPI(
              options.endpoint || `/api/listing/${action}`,
              data
            );
          } else {
            throw n8nError;
          }
        }
      } else {
        // デフォルトは既存の内部API
        result = await executeWithInternalAPI(
          options.endpoint || `/api/listing/${action}`,
          data
        );
      }
      
      if (result.success === false) {
        throw new Error(result.error || 'Operation failed');
      }
      
      return result;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [shouldUseN8n, fallback, executeWithInternalAPI, executeWithN8n]);
  
  // 既存のAPIをそのまま呼ぶ関数（互換性維持）
  const executeListing = useCallback(async (scheduleId: string) => {
    return execute('execute', { scheduleId }, { 
      endpoint: '/api/listing/execute',
      forceInternal: true  // 既存の出品は常に内部API使用
    });
  }, [execute]);
  
  // スケジュール実行（既存）
  const executeScheduled = useCallback(async (data: any) => {
    return execute('execute-scheduled', data, {
      endpoint: '/api/listing/execute-scheduled',
      forceInternal: true
    });
  }, [execute]);
  
  // 在庫同期（n8n可能）
  const syncInventory = useCallback(async () => {
    // Cronジョブの場合はn8nを優先
    const useN8nForCron = process.env.NEXT_PUBLIC_USE_N8N_FOR_CRON === 'true';
    
    return execute('inventory-sync', {}, {
      endpoint: '/api/inventory/sync',
      forceN8n: useN8nForCron
    });
  }, [execute]);
  
  // バッチ処理（n8n可能）
  const executeBatch = useCallback(async (productIds: string[]) => {
    // 大量処理の場合はn8nを検討
    const useN8nForBatch = productIds.length > 50 && shouldUseN8n;
    
    return execute('batch', { productIds }, {
      endpoint: '/api/batch/listing',
      forceN8n: useN8nForBatch
    });
  }, [execute, shouldUseN8n]);
  
  return {
    // 状態
    isLoading,
    error,
    
    // 既存互換メソッド（変更なし）
    executeListing,
    executeScheduled,
    
    // 拡張メソッド（n8n対応）
    syncInventory,
    executeBatch,
    
    // 汎用実行
    execute,
    
    // デバッグ情報
    backend: shouldUseN8n ? 'n8n' : 'internal',
    fallbackEnabled: fallback
  };
}
