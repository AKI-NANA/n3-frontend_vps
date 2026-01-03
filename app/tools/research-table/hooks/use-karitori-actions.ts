/**
 * useKaritoriActions: 刈り取り操作フック
 */

import { useState, useCallback } from 'react';
import type { ResearchItem, KaritoriCategory } from '../types/research';
import {
  fetchKaritoriAlerts,
  fetchKaritoriCategories,
  addKaritoriCategory,
  deleteKaritoriCategory,
  simulatePurchase,
  updateResearchItem,
} from '../lib/research-api';

export function useKaritoriActions() {
  const [alerts, setAlerts] = useState<ResearchItem[]>([]);
  const [categories, setCategories] = useState<KaritoriCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  // アラート取得
  const loadAlerts = useCallback(async (
    minProfitRate: number = 20,
    maxBsr: number = 5000
  ) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchKaritoriAlerts(minProfitRate, maxBsr);
      setAlerts(data);
    } catch (err: any) {
      setError(err.message || 'アラート取得エラー');
    } finally {
      setLoading(false);
    }
  }, []);

  // カテゴリ取得
  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchKaritoriCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'カテゴリ取得エラー');
    }
  }, []);

  // カテゴリ追加
  const addCategory = useCallback(async (data: {
    category_name: string;
    search_keyword: string;
    manufacturer?: string;
  }) => {
    setProcessing('add-category');
    try {
      const newCategory = await addKaritoriCategory({
        category_name: data.category_name,
        search_keyword: data.search_keyword,
        manufacturer: data.manufacturer,
        is_active: true,
      });
      if (newCategory) {
        setCategories(prev => [newCategory, ...prev]);
      }
      return newCategory;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setProcessing(null);
    }
  }, []);

  // カテゴリ削除
  const removeCategory = useCallback(async (id: string) => {
    setProcessing(`delete-${id}`);
    try {
      const success = await deleteKaritoriCategory(id);
      if (success) {
        setCategories(prev => prev.filter(c => c.id !== id));
      }
      return success;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setProcessing(null);
    }
  }, []);

  // 自動購入判定
  const handlePurchaseDecision = useCallback(async (
    item: ResearchItem,
    forceSkip: boolean = false
  ) => {
    setProcessing(`purchase-${item.id}`);
    try {
      const result = await simulatePurchase(
        item,
        forceSkip ? 'manual-skipped' : undefined
      );

      // ローカル状態を更新
      setAlerts(prev => prev.map(a =>
        a.id === item.id
          ? {
              ...a,
              purchase_status: result.status,
              karitori_reason: result.reason,
              karitori_status: result.status === 'auto-bought' ? 'purchased' : 'skipped',
            }
          : a
      ));

      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setProcessing(null);
    }
  }, []);

  // 監視開始
  const startWatching = useCallback(async (item: ResearchItem, targetPrice?: number) => {
    setProcessing(`watch-${item.id}`);
    try {
      const updated = await updateResearchItem(item.id, {
        karitori_status: 'watching',
        target_price_jpy: targetPrice,
      });

      if (updated) {
        setAlerts(prev => prev.map(a =>
          a.id === item.id ? { ...a, karitori_status: 'watching', target_price_jpy: targetPrice } : a
        ));
      }

      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setProcessing(null);
    }
  }, []);

  // アラート設定
  const setAlert = useCallback(async (item: ResearchItem) => {
    setProcessing(`alert-${item.id}`);
    try {
      const updated = await updateResearchItem(item.id, {
        karitori_status: 'alert',
      });

      if (updated) {
        setAlerts(prev => {
          const exists = prev.some(a => a.id === item.id);
          if (exists) {
            return prev.map(a => a.id === item.id ? { ...a, karitori_status: 'alert' } : a);
          } else {
            return [{ ...item, karitori_status: 'alert' }, ...prev];
          }
        });
      }

      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setProcessing(null);
    }
  }, []);

  // 自動購入基準チェック
  const checkAutoBuyCriteria = useCallback((item: ResearchItem) => {
    const MIN_PROFIT_RATE = 20;
    const MAX_BSR = 5000;

    const profitOk = (item.profit_margin || 0) > MIN_PROFIT_RATE;
    const bsrOk = !item.bsr_rank || item.bsr_rank <= MAX_BSR;

    return {
      shouldBuy: profitOk && bsrOk,
      profitOk,
      bsrOk,
      profitMargin: item.profit_margin || 0,
      bsrRank: item.bsr_rank,
    };
  }, []);

  return {
    // データ
    alerts,
    categories,
    loading,
    error,
    processing,

    // 操作
    loadAlerts,
    loadCategories,
    addCategory,
    removeCategory,
    handlePurchaseDecision,
    startWatching,
    setAlert,
    checkAutoBuyCriteria,
  };
}
