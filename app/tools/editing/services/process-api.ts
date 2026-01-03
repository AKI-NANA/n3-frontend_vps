// app/tools/editing/services/process-api.ts
import { apiPost } from './api-client';

/**
 * 処理・バッチAPI
 */
export const processApi = {
  /**
   * カテゴリ分析バッチ
   */
  batchCategory: async (productIds: string[]) => {
    return apiPost('/api/tools/category-analyze', { productIds });
  },

  /**
   * 送料計算バッチ
   */
  batchShipping: async (productIds: string[]) => {
    return apiPost('/api/tools/shipping-calculate', { productIds });
  },

  /**
   * 利益計算バッチ
   */
  batchProfit: async (productIds: string[]) => {
    return apiPost('/api/tools/profit-calculate', { productIds });
  },

  /**
   * HTML生成
   */
  generateHTML: async (productIds: string[]) => {
    return apiPost('/api/tools/html-generate', { productIds });
  },

  /**
   * SellerMirror分析バッチ
   */
  batchSellerMirror: async (productIds: string[]) => {
    // 複数商品を順次処理
    const results: Array<{ productId: string; success: boolean; error?: string }> = [];
    const errors: string[] = [];
    
    console.log(`🔍 SellerMirror分析開始: ${productIds.length}件`);
    
    for (const productId of productIds) {
      try {
        // 商品情報を取得
        console.log(`  📦 商品取得中: ${productId}`);
        const productResponse = await fetch(`/api/products/${productId}`);
        
        if (!productResponse.ok) {
          const errorMsg = `商品取得失敗 (${productResponse.status}): ${productId}`;
          console.error(`  ❌ ${errorMsg}`);
          errors.push(errorMsg);
          results.push({ productId, success: false, error: errorMsg });
          continue;
        }
        
        const productResult = await productResponse.json();
        
        // APIレスポンスから.dataを取得
        if (!productResult.success || !productResult.data) {
          const errorMsg = `商品データなし: ${productId}`;
          console.error(`  ❌ ${errorMsg}`);
          errors.push(errorMsg);
          results.push({ productId, success: false, error: errorMsg });
          continue;
        }
        
        const product = productResult.data;
        
        // 英語タイトルがない場合はスキップ
        const ebayTitle = product.english_title || product.title_en || product.title;
        if (!ebayTitle) {
          const errorMsg = `タイトルなし: ${productId}`;
          console.warn(`  ⚠️ ${errorMsg}`);
          errors.push(errorMsg);
          results.push({ productId, success: false, error: errorMsg });
          continue;
        }
        
        // SellerMirror分析を実行
        console.log(`  🔍 SM分析実行: ${productId} (${ebayTitle.substring(0, 30)}...)`);
        const result = await apiPost('/api/sellermirror/analyze', {
          productId: product.id,
          ebayTitle: ebayTitle,
          ebayCategoryId: product.category_id || product.ebay_api_data?.category_id
        });
        
        if (result.success) {
          console.log(`  ✅ SM分析成功: ${productId}`);
          results.push({ productId, success: true });
        } else {
          console.error(`  ❌ SM分析失敗: ${productId}`, result.error);
          results.push({ productId, success: false, error: result.error });
        }
      } catch (error: any) {
        const errorMsg = error.message || 'Unknown error';
        console.error(`  ❌ SellerMirror分析例外: ${productId}`, errorMsg);
        errors.push(`${productId}: ${errorMsg}`);
        results.push({ productId, success: false, error: errorMsg });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    console.log(`✅ SellerMirror分析完了: ${successCount}/${productIds.length}件成功`);
    
    return {
      success: successCount > 0,
      updated: successCount,
      total: productIds.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `${successCount}/${productIds.length}件分析完了${errors.length > 0 ? ` (${errors.length}件エラー)` : ''}`
    };
  },

  /**
   * スコア計算バッチ
   */
  calculateScores: async (productIds: string[]) => {
    return apiPost('/api/score/calculate', { productIds });
  },

  /**
   * HTS推定
   */
  estimateHTS: async (data: {
    title?: string;
    categoryName?: string;
    material?: string;
    description?: string;
  }) => {
    return apiPost('/api/hts/estimate', data);
  },

  /**
   * 翻訳
   */
  translate: async (data: {
    title?: string;
    description?: string;
    condition?: string;
  }) => {
    return apiPost('/api/tools/translate-product', data);
  },

  /**
   * AI情報強化
   */
  enrichWithAI: async (productId: string) => {
    return apiPost('/api/tools/editing/ai/enrich', { productId });
  },

  /**
   * 市場調査
   */
  marketResearch: async (productIds: string[]) => {
    return apiPost('/api/research', { productIds });
  },

  /**
   * フィルター実行
   */
  runFilter: async (productIds: string[]) => {
    return apiPost('/api/filter-check', { productIds });
  },

  /**
   * 最終処理
   */
  finalProcess: async (productIds: string[]) => {
    return apiPost('/api/tools/editing/compliance/final-process', { productIds });
  },
};
