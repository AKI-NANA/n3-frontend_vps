// lib/use-pricing-worker.ts
// Web Workerフック - Phase 10

'use client'

import { useEffect, useRef, useCallback } from 'react';

interface ProfitResult {
  productId: string | number;
  profit: number;
  profitMargin: number;
  netProfit: number;
  netProfitMargin: number;
  ebayFee: number;
  ebayPriceJpy?: number;
}

interface ShippingResult {
  productId: string | number;
  shippingCost: number;
  method: string;
}

interface PricingResult {
  productId: string | number;
  optimalEbayPrice: number;
  ebayPriceJpy: number;
  netProfit: number;
  actualMargin: number;
  ebayFee: number;
}

interface BatchProgress {
  progress: number;
  processed: number;
  total: number;
}

/**
 * 価格計算Web Workerを管理するフック
 * 
 * 特徴:
 * - UIスレッドをブロックしない
 * - 大量の計算を並行処理
 * - 進捗報告
 * - エラーハンドリング
 */
export function usePricingWorker() {
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<Map<string, (data: any) => void>>(new Map());

  // Worker初期化
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Worker) {
      console.warn('⚠️ Web Workers not supported');
      return;
    }

    let worker: Worker | null = null;

    try {
      worker = new Worker('/workers/pricing-worker.js');
      workerRef.current = worker;

      // メッセージ受信
      worker.onmessage = (event) => {
        const { type, ...data } = event.data;

        // タイプごとにコールバックを実行
        const callback = callbacksRef.current.get(type);
        if (callback) {
          callback(data);
        }

        // デバッグログ
        if (type === 'WORKER_READY') {
          console.log('✅ Pricing Worker ready');
        }
      };

      // エラーハンドリング
      worker.onerror = (error) => {
        console.warn('⚠️ Pricing Worker error:', error.message || 'Unknown error');
        // エラーを無視して続行
      };
    } catch (error) {
      console.warn('⚠️ Failed to create Pricing Worker:', error instanceof Error ? error.message : 'Unknown error');
      // Workerの作成に失敗してもアプリは続行
    }

    return () => {
      if (worker) {
        worker.terminate();
        console.log('🛑 Pricing Worker terminated');
      }
    };
  }, []);

  /**
   * コールバックを登録
   */
  const registerCallback = useCallback((type: string, callback: (data: any) => void) => {
    callbacksRef.current.set(type, callback);
  }, []);

  /**
   * コールバックを削除
   */
  const unregisterCallback = useCallback((type: string) => {
    callbacksRef.current.delete(type);
  }, []);

  /**
   * 単一商品の利益を計算
   */
  const calculateProfit = useCallback(
    (
      productId: string | number,
      priceJpy: number,
      ebayPrice: number,
      shippingCost: number,
      onComplete: (result: ProfitResult) => void
    ) => {
      if (!workerRef.current) {
        console.warn('⚠️ Worker not initialized');
        return;
      }

      // コールバック登録
      registerCallback('PROFIT_CALCULATED', (data) => {
        if (data.productId === productId) {
          onComplete(data.result);
          unregisterCallback('PROFIT_CALCULATED');
        }
      });

      // Workerに送信
      workerRef.current.postMessage({
        type: 'CALCULATE_PROFIT',
        data: { productId, priceJpy, ebayPrice, shippingCost },
      });
    },
    [registerCallback, unregisterCallback]
  );

  /**
   * 一括利益計算
   */
  const calculateBatchProfit = useCallback(
    (
      products: Array<{
        id: string | number;
        priceJpy: number;
        ebayPrice: number;
        shippingCost: number;
      }>,
      onProgress: (progress: BatchProgress) => void,
      onComplete: (results: ProfitResult[]) => void
    ) => {
      if (!workerRef.current) {
        console.warn('⚠️ Worker not initialized');
        return;
      }

      // 進捗コールバック
      registerCallback('BATCH_PROGRESS', (data) => {
        onProgress({
          progress: data.progress,
          processed: data.processed,
          total: data.total,
        });
      });

      // 完了コールバック
      registerCallback('BATCH_PROFIT_CALCULATED', (data) => {
        onComplete(data.results);
        unregisterCallback('BATCH_PROGRESS');
        unregisterCallback('BATCH_PROFIT_CALCULATED');
      });

      // Workerに送信
      workerRef.current.postMessage({
        type: 'CALCULATE_BATCH_PROFIT',
        data: { products },
      });

      console.log('🔄 Batch profit calculation started:', products.length, '件');
    },
    [registerCallback, unregisterCallback]
  );

  /**
   * 送料計算
   */
  const calculateShipping = useCallback(
    (
      productId: string | number,
      weight: number,
      dimensions: { width: number; height: number; depth: number },
      destination: string,
      onComplete: (result: ShippingResult) => void
    ) => {
      if (!workerRef.current) {
        console.warn('⚠️ Worker not initialized');
        return;
      }

      // コールバック登録
      registerCallback('SHIPPING_CALCULATED', (data) => {
        if (data.productId === productId) {
          onComplete(data.result);
          unregisterCallback('SHIPPING_CALCULATED');
        }
      });

      // Workerに送信
      workerRef.current.postMessage({
        type: 'CALCULATE_SHIPPING',
        data: { productId, weight, dimensions, destination },
      });
    },
    [registerCallback, unregisterCallback]
  );

  /**
   * 価格最適化
   */
  const optimizePricing = useCallback(
    (
      productId: string | number,
      priceJpy: number,
      targetMargin: number,
      shippingCost: number,
      onComplete: (result: PricingResult) => void
    ) => {
      if (!workerRef.current) {
        console.warn('⚠️ Worker not initialized');
        return;
      }

      // コールバック登録
      registerCallback('PRICING_OPTIMIZED', (data) => {
        if (data.productId === productId) {
          onComplete(data.result);
          unregisterCallback('PRICING_OPTIMIZED');
        }
      });

      // Workerに送信
      workerRef.current.postMessage({
        type: 'OPTIMIZE_PRICING',
        data: { productId, priceJpy, targetMargin, shippingCost },
      });
    },
    [registerCallback, unregisterCallback]
  );

  return {
    calculateProfit,
    calculateBatchProfit,
    calculateShipping,
    optimizePricing,
  };
}
