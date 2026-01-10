// hooks/use-n8n.ts
/**
 * n8n統合用のReact Hook
 * UIコンポーネントからn8nワークフローを簡単に呼び出せる
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { n8nWorkflows } from '@/lib/n8n/workflows';

export function useN8n() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 汎用実行関数
  const execute = useCallback(async (
    workflow: keyof typeof n8nWorkflows,
    method: string,
    ...args: any[]
  ) => {
    setLoading(true);
    setError(null);

    try {
      const workflowModule = n8nWorkflows[workflow];
      const fn = (workflowModule as any)[method];
      
      if (!fn) {
        throw new Error(`Method ${method} not found in ${workflow} workflow`);
      }

      const result = await fn(...args);
      
      if (!result.success) {
        throw new Error(result.error || 'Operation failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 出品関連
  const listing = {
    execute: useCallback(async (productId: string, platform: string) => {
      const result = await execute('listing', 'executeListing', {
        productId,
        platform,
      });
      toast.success(`${platform}への出品を開始しました`);
      return result;
    }, [execute]),

    batch: useCallback(async (productIds: string[], platform: string) => {
      const result = await execute('listing', 'executeBatchListing', productIds, platform);
      toast.success(`${productIds.length}件の一括出品を開始しました`);
      return result;
    }, [execute]),

    schedule: useCallback(async (schedule: any) => {
      const result = await execute('listing', 'createSchedule', schedule);
      toast.success('出品スケジュールを作成しました');
      return result;
    }, [execute]),

    retry: useCallback(async (platform?: string) => {
      const result = await execute('listing', 'retryFailedListings', platform);
      toast.success('エラー商品の再出品を開始しました');
      return result;
    }, [execute]),
  };

  // 在庫管理
  const inventory = {
    sync: useCallback(async (options?: any) => {
      const result = await execute('inventory', 'syncInventory', options);
      toast.success('在庫同期を開始しました');
      return result;
    }, [execute]),

    update: useCallback(async (updates: any[]) => {
      const result = await execute('inventory', 'updateStock', updates);
      toast.success('在庫数を更新しました');
      return result;
    }, [execute]),

    getFBA: useCallback(async () => {
      const result = await execute('inventory', 'syncFBAInventory');
      toast.success('FBA在庫を取得しました');
      return result;
    }, [execute]),

    predict: useCallback(async (skus?: string[]) => {
      const result = await execute('inventory', 'predictStockout', skus);
      return result;
    }, [execute]),
  };

  // リサーチ
  const research = {
    amazon: useCallback(async (params: any) => {
      const result = await execute('research', 'researchAmazon', params);
      toast.success('Amazon商品分析を開始しました');
      return result;
    }, [execute]),

    keepa: useCallback(async (asins: string[]) => {
      const result = await execute('research', 'getKeepaData', asins);
      toast.success('Keepa価格履歴を取得しました');
      return result;
    }, [execute]),

    ebay: useCallback(async (keyword: string, options?: any) => {
      const result = await execute('research', 'researchEbay', keyword, options);
      toast.success('eBay相場調査を開始しました');
      return result;
    }, [execute]),

    yahoo: useCallback(async (url: string) => {
      const result = await execute('research', 'scrapeYahooAuction', url);
      toast.success('ヤフオク商品データを取得しました');
      return result;
    }, [execute]),

    profit: useCallback(async (data: any) => {
      const result = await execute('research', 'calculateProfit', data);
      return result;
    }, [execute]),

    ai: useCallback(async (productData: any) => {
      const result = await execute('research', 'aiAnalysis', productData);
      toast.success('AI分析を開始しました');
      return result;
    }, [execute]),
  };

  // 自動化設定
  const automation = {
    setupListing: useCallback(async (config: any) => {
      const result = await execute('automation', 'setupAutoListing', config);
      toast.success('自動出品を設定しました');
      return result;
    }, [execute]),

    setupPricing: useCallback(async (config: any) => {
      const result = await execute('automation', 'setupPriceAutomation', config);
      toast.success('価格自動調整を設定しました');
      return result;
    }, [execute]),

    setupRestock: useCallback(async (config: any) => {
      const result = await execute('automation', 'setupRestockAutomation', config);
      toast.success('在庫自動補充を設定しました');
      return result;
    }, [execute]),

    setupNotifications: useCallback(async (config: any) => {
      const result = await execute('automation', 'setupNotifications', config);
      toast.success('通知設定を更新しました');
      return result;
    }, [execute]),
  };

  return {
    loading,
    error,
    listing,
    inventory,
    research,
    automation,
    execute, // 汎用実行関数
  };
}
