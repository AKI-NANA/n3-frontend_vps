// hooks/use-sm-sequential-selection.ts
/**
 * SM分析連続選択フック
 * 
 * 機能:
 * - SM分析済み商品の選択待ちキュー管理
 * - 1つ完了したら自動的に次の商品へ遷移
 * - 進捗状況の追跡
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Product } from '@/app/tools/editing/types/product';

export interface SMQueueItem {
  product: Product;
  status: 'pending' | 'processing' | 'completed' | 'skipped';
  selectedCompetitorId?: string;
  completedAt?: Date;
}

export interface SMSequentialSelectionState {
  queue: SMQueueItem[];
  currentProduct: Product | null;
  currentIndex: number;
  progress: {
    total: number;
    completed: number;
    skipped: number;
    remaining: number;
    percentage: number;
  };
  isActive: boolean;
}

export interface UseSMSequentialSelectionOptions {
  autoAdvance?: boolean;
  onComplete?: (results: SMQueueItem[]) => void;
  onItemComplete?: (item: SMQueueItem) => void;
}

export function useSMSequentialSelection(
  products: Product[],
  options: UseSMSequentialSelectionOptions = {}
) {
  const { autoAdvance = true, onComplete, onItemComplete } = options;
  
  const [queue, setQueue] = useState<SMQueueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isActive, setIsActive] = useState(false);

  // SM分析済みで競合未選択の商品を抽出
  const pendingProducts = useMemo(() => {
    return products.filter(p => {
      const hasSMData = (p as any).ebay_api_data?.browse_result?.items?.length > 0 ||
                        (p as any).ebay_api_data?.listing_reference?.referenceItems?.length > 0;
      const hasSelectedCompetitor = (p as any).listing_data?.selected_competitor_id ||
                                    (p as any).ebay_api_data?.selected_competitor?.itemId;
      return hasSMData && !hasSelectedCompetitor;
    });
  }, [products]);

  // 進捗計算
  const progress = useMemo(() => {
    const total = queue.length;
    const completed = queue.filter(q => q.status === 'completed').length;
    const skipped = queue.filter(q => q.status === 'skipped').length;
    const remaining = total - completed - skipped;
    const percentage = total > 0 ? Math.round(((completed + skipped) / total) * 100) : 0;
    return { total, completed, skipped, remaining, percentage };
  }, [queue]);

  // 現在の商品
  const currentProduct = useMemo(() => {
    if (currentIndex >= 0 && currentIndex < queue.length) {
      return queue[currentIndex].product;
    }
    return null;
  }, [queue, currentIndex]);

  // 連続選択モードを開始
  const startSequentialMode = useCallback((selectedProducts?: Product[]) => {
    const targetProducts = selectedProducts || pendingProducts;
    
    if (targetProducts.length === 0) {
      console.log('[SM Sequential] 対象商品がありません');
      return false;
    }

    const newQueue: SMQueueItem[] = targetProducts.map(p => ({
      product: p,
      status: 'pending' as const,
    }));

    setQueue(newQueue);
    setCurrentIndex(0);
    setIsActive(true);
    newQueue[0].status = 'processing';
    setQueue([...newQueue]);

    console.log(`[SM Sequential] 連続選択開始: ${targetProducts.length}件`);
    return true;
  }, [pendingProducts]);

  // 連続選択モードを終了
  const stopSequentialMode = useCallback(() => {
    setIsActive(false);
    setCurrentIndex(-1);
    if (onComplete && queue.length > 0) {
      onComplete(queue);
    }
    console.log('[SM Sequential] 連続選択終了');
  }, [queue, onComplete]);

  // 次の商品へ進む
  const advanceToNext = useCallback(() => {
    setQueue(prev => {
      const nextIndex = currentIndex + 1;
      
      if (nextIndex >= prev.length) {
        console.log('[SM Sequential] 全商品の選択が完了しました');
        setIsActive(false);
        setCurrentIndex(-1);
        if (onComplete) onComplete(prev);
        return prev;
      }

      const newQueue = [...prev];
      newQueue[nextIndex].status = 'processing';
      setCurrentIndex(nextIndex);
      console.log(`[SM Sequential] 次の商品へ: ${nextIndex + 1}/${prev.length}`);
      return newQueue;
    });
  }, [currentIndex, onComplete]);

  // 現在の商品を完了して次へ
  const completeAndNext = useCallback((selectedCompetitorId?: string) => {
    if (currentIndex < 0 || currentIndex >= queue.length) return;

    setQueue(prev => {
      const newQueue = [...prev];
      newQueue[currentIndex] = {
        ...newQueue[currentIndex],
        status: 'completed',
        selectedCompetitorId,
        completedAt: new Date(),
      };
      return newQueue;
    });

    if (onItemComplete) {
      onItemComplete({
        ...queue[currentIndex],
        status: 'completed',
        selectedCompetitorId,
        completedAt: new Date(),
      });
    }

    if (autoAdvance) {
      setTimeout(advanceToNext, 300);
    }
  }, [currentIndex, queue, autoAdvance, advanceToNext, onItemComplete]);

  // 現在の商品をスキップして次へ
  const skipAndNext = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= queue.length) return;

    setQueue(prev => {
      const newQueue = [...prev];
      newQueue[currentIndex] = {
        ...newQueue[currentIndex],
        status: 'skipped',
        completedAt: new Date(),
      };
      return newQueue;
    });

    if (autoAdvance) {
      setTimeout(advanceToNext, 300);
    }
  }, [currentIndex, queue, autoAdvance, advanceToNext]);

  // 特定のインデックスにジャンプ
  const jumpTo = useCallback((index: number) => {
    if (index < 0 || index >= queue.length) return;

    setQueue(prev => {
      const newQueue = [...prev];
      if (currentIndex >= 0 && newQueue[currentIndex].status === 'processing') {
        newQueue[currentIndex].status = 'pending';
      }
      newQueue[index].status = 'processing';
      return newQueue;
    });

    setCurrentIndex(index);
  }, [queue, currentIndex]);

  // キューをリセット
  const resetQueue = useCallback(() => {
    setQueue([]);
    setCurrentIndex(-1);
    setIsActive(false);
  }, []);

  return {
    queue,
    currentProduct,
    currentIndex,
    progress,
    isActive,
    pendingProducts,
    startSequentialMode,
    stopSequentialMode,
    completeAndNext,
    skipAndNext,
    jumpTo,
    resetQueue,
    advanceToNext,
  };
}

export default useSMSequentialSelection;
