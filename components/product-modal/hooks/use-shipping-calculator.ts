'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function useShippingCalculator() {
  const [calculating, setCalculating] = useState(false);

  const calculateShipping = async (productId: string): Promise<boolean> => {
    if (!productId) {
      toast.error('商品IDが不正です');
      return false;
    }

    setCalculating(true);
    try {
      const response = await fetch('/api/tools/shipping-calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: [productId]
        })
      });

      if (!response.ok) {
        throw new Error(`配送料計算API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.updated && data.updated.includes(productId)) {
        toast.success('配送料を計算しました');
        return true;
      }

      if (data.errors && data.errors.length > 0) {
        const errorMsg = data.errors[0]?.error || '計算に失敗しました';
        toast.error(`配送料計算エラー: ${errorMsg}`);
        return false;
      }

      throw new Error('計算に失敗しました');
    } catch (error: any) {
      console.error('Shipping calculation error:', error);
      toast.error(`配送料計算エラー: ${error.message}`);
      return false;
    } finally {
      setCalculating(false);
    }
  };

  const calculateShippingBatch = async (productIds: string[]): Promise<{
    success: string[];
    failed: string[];
  }> => {
    if (!productIds || productIds.length === 0) {
      toast.error('商品IDが指定されていません');
      return { success: [], failed: [] };
    }

    setCalculating(true);
    try {
      const response = await fetch('/api/tools/shipping-calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds
        })
      });

      if (!response.ok) {
        throw new Error(`配送料計算API Error: ${response.status}`);
      }

      const data = await response.json();

      const success = data.updated || [];
      const failed = (data.errors || []).map((e: any) => e.productId);

      if (success.length > 0) {
        toast.success(`${success.length}件の配送料を計算しました`);
      }

      if (failed.length > 0) {
        toast.warning(`${failed.length}件の計算に失敗しました`);
      }

      return { success, failed };
    } catch (error: any) {
      console.error('Shipping calculation batch error:', error);
      toast.error(`配送料計算エラー: ${error.message}`);
      return { success: [], failed: productIds };
    } finally {
      setCalculating(false);
    }
  };

  return {
    calculateShipping,
    calculateShippingBatch,
    calculating
  };
}
