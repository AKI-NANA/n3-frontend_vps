// app/tools/amazon-research-n3/hooks/use-research-data.ts
/**
 * useResearchData - Supabase連携データフック
 * 
 * Phase Final Fix: Supabase → UI スコア同期
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAmazonResearchStore } from '../store/use-amazon-research-store';
import type { AmazonResearchItem } from '../types';

// ============================================================
// 型定義
// ============================================================

interface UseResearchDataOptions {
  autoFetch?: boolean;
  refreshInterval?: number;
}

interface UseResearchDataReturn {
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  saveItem: (item: Partial<AmazonResearchItem>) => Promise<boolean>;
  deleteItems: (ids: string[]) => Promise<boolean>;
  refreshStats: () => Promise<void>;
}

// ============================================================
// Hook
// ============================================================

export function useResearchData(options: UseResearchDataOptions = {}): UseResearchDataReturn {
  const { autoFetch = true, refreshInterval = 0 } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { setItems, recalculateStats, setIsLoading: setStoreLoading } = useAmazonResearchStore();
  
  // Supabaseクライアント
  const supabase = createClientComponentClient();

  // アイテム取得
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setStoreLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('amazon_research_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // データ変換
      const items: AmazonResearchItem[] = (data || []).map((row) => ({
        id: row.id,
        asin: row.asin,
        title: row.title,
        brand: row.brand,
        category: row.category,
        amazon_price_jpy: row.amazon_price_jpy,
        amazon_price_usd: row.amazon_price_usd,
        seller_price_jpy: row.seller_price_jpy,
        estimated_profit_margin: row.estimated_profit_margin,
        monthly_sales_estimate: row.monthly_sales_estimate,
        bsr_current: row.bsr_current,
        review_count: row.review_count,
        review_rating: row.review_rating,
        competitor_count: row.competitor_count,
        main_image_url: row.main_image_url,
        
        // スコア
        n3_basic_score: row.n3_basic_score,
        n3_keepa_score: row.n3_keepa_score,
        n3_ai_score: row.n3_ai_score,
        
        // フラグ
        is_variation_candidate: row.is_variation_candidate,
        is_set_candidate: row.is_set_candidate,
        is_new_product: row.is_new_product,
        is_auto_tracked: row.is_auto_tracked,
        risk_level: row.risk_level,
        risk_flags: row.risk_flags || [],
        
        // ステータス
        status: row.status || 'pending',
        
        // タイムスタンプ
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));

      setItems(items);
      recalculateStats();
    } catch (err: any) {
      console.error('[useResearchData] fetchItems error:', err);
      setError(err.message || 'データ取得に失敗しました');
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  }, [supabase, setItems, recalculateStats, setStoreLoading]);

  // アイテム保存
  const saveItem = useCallback(async (item: Partial<AmazonResearchItem>): Promise<boolean> => {
    try {
      const { error: saveError } = await supabase
        .from('amazon_research_items')
        .upsert({
          ...item,
          updated_at: new Date().toISOString(),
        });

      if (saveError) {
        throw new Error(saveError.message);
      }

      // ローカルストアを更新
      await fetchItems();
      return true;
    } catch (err: any) {
      console.error('[useResearchData] saveItem error:', err);
      setError(err.message);
      return false;
    }
  }, [supabase, fetchItems]);

  // アイテム削除
  const deleteItems = useCallback(async (ids: string[]): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('amazon_research_items')
        .delete()
        .in('id', ids);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // ローカルストアを更新
      await fetchItems();
      return true;
    } catch (err: any) {
      console.error('[useResearchData] deleteItems error:', err);
      setError(err.message);
      return false;
    }
  }, [supabase, fetchItems]);

  // 統計更新
  const refreshStats = useCallback(async () => {
    recalculateStats();
  }, [recalculateStats]);

  // 自動フェッチ
  useEffect(() => {
    if (autoFetch) {
      fetchItems();
    }
  }, [autoFetch, fetchItems]);

  // 定期更新
  useEffect(() => {
    if (refreshInterval <= 0) return;
    
    const interval = setInterval(fetchItems, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchItems]);

  // リアルタイム購読（オプション）
  useEffect(() => {
    const subscription = supabase
      .channel('amazon_research_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'amazon_research_items',
        },
        (payload) => {
          console.log('[useResearchData] Realtime update:', payload);
          // 変更があったらデータを再取得
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchItems]);

  return {
    isLoading,
    error,
    fetchItems,
    saveItem,
    deleteItems,
    refreshStats,
  };
}

export default useResearchData;
