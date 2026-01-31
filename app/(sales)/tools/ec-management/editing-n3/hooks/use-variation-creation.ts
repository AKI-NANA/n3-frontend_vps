// app/tools/editing-n3/hooks/use-variation-creation.ts
/**
 * バリエーション作成フック
 * 
 * 既存API（変更禁止）:
 * - /api/products/create-variation
 * 
 * APIパラメータ形式:
 * - selectedItemIds: string[] - 全子SKUのID配列
 * - parentSkuName: string - 親SKU名
 * - attributes: Record<string, string> - バリエーション属性
 * - composition: Array<{id, name, sku, quantity}> - 構成情報
 */

'use client';

import { useState, useCallback } from 'react';
import type { InventoryProduct } from './use-inventory-data';

interface CreateVariationParams {
  parentId?: string;         // 互換性のため残す（未使用）
  memberIds: string[];       // 全子SKUのID
  variationTitle: string;    // 親SKU名
  attributes?: Record<string, string>;  // バリエーション属性
}

interface GroupedCandidates {
  category: string;
  products: InventoryProduct[];
}

export function useVariationCreation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // バリエーション作成
  const createVariation = useCallback(async (params: CreateVariationParams) => {
    setLoading(true);
    setError(null);
    
    try {
      // API形式に変換
      const apiParams = {
        selectedItemIds: params.memberIds,  // 全子SKUのID
        parentSkuName: params.variationTitle,
        attributes: params.attributes || {},
        composition: params.memberIds.map((id, index) => ({
          id,
          name: `Item ${index + 1}`,
          sku: `SKU-${id}`,
          quantity: 1,
        })),
      };
      
      const response = await fetch('/api/products/create-variation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiParams),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'バリエーション作成に失敗しました');
      }
      
      const result = await response.json();
      return { success: true, ...result };
    } catch (err: any) {
      const errorMessage = err.message || 'バリエーション作成に失敗しました';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // グルーピング候補を検出
  const findGroupingCandidates = useCallback((products: InventoryProduct[]): InventoryProduct[] => {
    return products.filter(p => 
      // カテゴリがある
      p.category &&
      // 在庫がある
      (p.stock_status === 'in_stock' || (p.current_stock && p.current_stock > 0)) &&
      // 既にバリエーションに属していない
      p.product_type !== 'variation_parent' &&
      p.product_type !== 'variation_member' &&
      !p.variation_parent_id &&
      // セット商品ではない
      p.product_type !== 'set'
    );
  }, []);

  // カテゴリでグルーピング
  const groupByCategory = useCallback((products: InventoryProduct[]): GroupedCandidates[] => {
    const candidates = findGroupingCandidates(products);
    const groups: Record<string, InventoryProduct[]> = {};
    
    candidates.forEach(product => {
      const category = product.category || 'その他';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(product);
    });
    
    // 2件以上のグループのみ返す
    return Object.entries(groups)
      .filter(([_, products]) => products.length >= 2)
      .map(([category, products]) => ({
        category,
        products,
      }))
      .sort((a, b) => b.products.length - a.products.length);
  }, [findGroupingCandidates]);

  return {
    loading,
    error,
    createVariation,
    findGroupingCandidates,
    groupByCategory,
  };
}
