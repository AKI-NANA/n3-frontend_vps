// app/tools/editing/services/product-api.ts
// エラーログで複数回参照されていたサービスファイルのテンプレートです。

import type { Product, ProductUpdate } from '../types/product';

/**
 * 商品データに関連するAPI操作をカプセル化するサービス。
 * クライアント側からNext.jsのAPIルート（/api/products/*）を叩くための関数群を定義します。
 */
export const productApi = {
  /**
   * 商品リストを取得する
   */
  fetchProducts: async (params: { page: number; pageSize: number; filters?: Record<string, any>; listFilter?: string }): Promise<{ products: Product[]; total: number }> => {
    const { page, pageSize, filters = {}, listFilter } = params;
    
    // APIパラメータを構築
    const queryParams = new URLSearchParams();
    queryParams.set('page', String(page));
    queryParams.set('limit', String(pageSize));
    queryParams.set('offset', String((page - 1) * pageSize));
    
    if (listFilter) {
      queryParams.set('list_filter', listFilter);
    }
    
    if (filters && Object.keys(filters).length > 0) {
      // フィルターをJSON文字列化
      queryParams.set('filters', JSON.stringify(filters));
    }
    
    const url = `/api/products?${queryParams.toString()}`;
    
    try {
      console.log('[productApi] Fetching:', url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`APIリクエスト失敗: ${response.statusText}`);
      }

      const result = await response.json();
      
      // APIレスポンスの構造を確認
      console.log('[productApi] Response:', { 
        success: result.success, 
        productsCount: result.products?.length,
        total: result.pagination?.total 
      });
      
      if (!result.success) {
        throw new Error(result.error || 'APIエラー');
      }
      
      return {
        products: result.products || [],
        total: result.pagination?.total || 0,
      };
    } catch (error) {
      console.error('[productApi] Fetch Products Error:', error);
      // エラー発生時は空配列を返す
      return {
        products: [], 
        total: 0 
      };
    }
  },

  /**
   * 商品情報を更新する
   */
  updateProduct: async (id: string, updateData: ProductUpdate): Promise<Product> => {
    // 実際にはAPIルート `/api/products/[id]` へPUTリクエストを送信します
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
          throw new Error(`更新APIリクエスト失敗: ${response.statusText}`);
      }

      return response.json();

    } catch (error) {
        console.error(`Update Product Error (${id}):`, error);
        throw error;
    }
  },

  /**
   * 商品詳細情報を取得する
   */
  getProductDetail: async (id: string): Promise<Product> => {
    try {
      if (!id || id === 'undefined' || id === 'null') {
        throw new Error('無効な商品IDです');
      }
      
      console.log('[productApi] Fetching product detail:', id);
      const response = await fetch(`/api/products/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`商品ID ${id} が見つかりません`);
        }
        throw new Error(`商品詳細取得失敗: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '商品詳細取得エラー');
      }
      
      // APIは { success: true, data: {...} } を返す
      return result.data;
    } catch (error) {
      console.error(`[productApi] Get Product Detail Error (${id}):`, error);
      throw error;
    }
  },

  /**
   * 複数商品を一括更新する
   */
  bulkUpdate: async (products: ProductUpdate[]): Promise<{ success: boolean; updated: number; errors?: string[] }> => {
    try {
      console.log('[productApi] Bulk updating products:', products.length);
      console.log('[productApi] First product sample:', products[0]);
      
      const response = await fetch('/api/products/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products }),
      });

      const result = await response.json();
      console.log('[productApi] Bulk update response:', result);

      if (!response.ok) {
        throw new Error(result.error || `APIエラー: ${response.status}`);
      }
      
      // 部分的な成功も許容（updated > 0 でOK）
      if (result.updated === 0 && result.errorCount > 0) {
        const errorDetail = result.errors?.join(', ') || '不明なエラー';
        throw new Error(`一括更新失敗: ${errorDetail}`);
      }
      
      // エラーがあっても成功があれば警告だけ
      if (result.errorCount > 0) {
        console.warn('[productApi] Partial errors:', result.errors);
      }
      
      return result;
    } catch (error) {
      console.error('[productApi] Bulk Update Error:', error);
      throw error;
    }
  },

  /**
   * 商品を削除する
   */
  deleteProduct: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`削除APIリクエスト失敗: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`[productApi] Delete Product Error (${id}):`, error);
      throw error;
    }
  },

  /**
   * 複数商品を一括削除する
   */
  bulkDelete: async (ids: string[]): Promise<{ success: boolean; deleted: number }> => {
    try {
      const response = await fetch('/api/products/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error(`一括削除APIリクエスト失敗: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('[productApi] Bulk Delete Error:', error);
      throw error;
    }
  },
};
