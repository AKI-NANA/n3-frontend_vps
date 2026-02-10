// app/tools/editing/hooks/use-product-data.ts
/**
 * 商品データ管理フック（安定版）
 * 
 * 注意: Zustand Store連携は別途慎重に導入予定
 * 現在は従来のuseState方式で安定動作を優先
 */

import { useState, useEffect, useCallback } from 'react';
import { productApi } from '../services/product-api';
import type { Product } from '../types/product';

export const useProductData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [modifiedIds, setModifiedIds] = useState<Set<string>>(new Set());

  /**
   * 商品一覧を読み込む
   */
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.fetchProducts({
        page: currentPage,
        pageSize,
      });

      console.log('📦 商品データ読み込み完了:', {
        件数: response.products?.length || 0,
        総数: response.total || 0,
        ページ: currentPage,
      });

      setProducts(response.products || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('❌ 商品データ読み込みエラー:', error);
      setError(error instanceof Error ? error.message : '商品データの読み込みに失敗しました');
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  /**
   * ローカル商品データを更新（未保存状態）
   */
  const updateLocalProduct = useCallback(
    (productId: string, updates: Partial<Product>) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (String(p.id) === productId) {
            return { ...p, ...updates, isModified: true };
          }
          return p;
        })
      );

      setModifiedIds((prev) => new Set(prev).add(productId));

      console.log(`📝 ローカル更新: 商品ID ${productId}`, updates);
    },
    []
  );

  /**
   * 個別商品をデータベースに保存
   */
  const saveProduct = useCallback(
    async (productId: string) => {
      const product = products.find((p) => String(p.id) === productId);
      if (!product) return;

      try {
        await productApi.updateProduct(productId, product);
        
        setProducts((prev) =>
          prev.map((p) => {
            if (String(p.id) === productId) {
              return { ...p, isModified: false };
            }
            return p;
          })
        );

        setModifiedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });

        console.log(`✅ 保存完了: 商品ID ${productId}`);
      } catch (error) {
        console.error(`❌ 保存エラー: 商品ID ${productId}`, error);
        throw error;
      }
    },
    [products]
  );

  /**
   * 変更された全商品を一括保存
   */
  const saveAllModified = useCallback(async () => {
    const modifiedProducts = products.filter((p) => p.isModified);

    if (modifiedProducts.length === 0) {
      return;
    }

    console.log(`💾 一括保存開始: ${modifiedProducts.length}件`);

    try {
      await productApi.bulkUpdate(modifiedProducts);

      setProducts((prev) =>
        prev.map((p) => ({ ...p, isModified: false }))
      );
      setModifiedIds(new Set());

      console.log(`✅ 一括保存完了: ${modifiedProducts.length}件`);
    } catch (error) {
      console.error('❌ 一括保存エラー:', error);
      throw error;
    }
  }, [products]);

  /**
   * 商品を削除
   */
  const deleteProducts = useCallback(async (productIds: string[]) => {
    if (productIds.length === 0) return;

    console.log(`🗑️ 削除開始: ${productIds.length}件`);

    try {
      await productApi.bulkDelete(productIds);

      setProducts((prev) =>
        prev.filter((p) => !productIds.includes(String(p.id)))
      );

      console.log(`✅ 削除完了: ${productIds.length}件`);
      
      await loadProducts();
    } catch (error) {
      console.error('❌ 削除エラー:', error);
      throw error;
    }
  }, [loadProducts]);

  /**
   * CSVアップロード
   */
  const uploadCSV = useCallback(
    async (data: any[], options: any = {}) => {
      console.log(`📤 CSVアップロード: ${data.length}件`);

      try {
        const result = await productApi.uploadCSV(data, options);
        
        console.log(`✅ CSVアップロード完了:`, result);
        
        await loadProducts();
        
        return result;
      } catch (error) {
        console.error('❌ CSVアップロードエラー:', error);
        throw error;
      }
    },
    [loadProducts]
  );

  // 初回読み込み
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    modifiedIds,

    setCurrentPage,
    setPageSize,

    loadProducts,
    updateLocalProduct,
    saveProduct,
    saveAllModified,
    deleteProducts,
    uploadCSV,
  };
};
