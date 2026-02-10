// app/tools/editing-n3/services/ai-enrich-service.ts
/**
 * AI強化サービス - Gemini神経接続
 * 
 * 🔥 2026-01-14: 完全接続版
 * - 実装済みの /api/ai/field-completion と /api/ai/weight-estimation を使用
 * - SMデータをコンテキストとして渡すパイプラインを実装
 * - HTS DBからの候補をAIに渡すハイブリッド判定
 */

import { processApi } from '@/app/tools/editing/services/process-api';

// ============================================================
// 型定義
// ============================================================

export interface AIEnrichResult {
  productId: string;
  success: boolean;
  error?: string;
  updates?: {
    hts_code?: string;
    origin_country?: string;
    material?: string;
    weight_g?: number;
  };
  aiDetails?: {
    fieldCompletion?: any;
    weightEstimation?: any;
    reasoning?: string;
  };
}

export interface BatchAIEnrichResult {
  success: boolean;
  total: number;
  updated: number;
  failed: number;
  results: AIEnrichResult[];
  errors?: string[];
}

// ============================================================
// メイン関数
// ============================================================

/**
 * 単一商品のAI強化
 * - 欠落フィールド（HTS、原産国、素材、重量）をAIで補完
 * - SMデータがあればコンテキストとして活用
 */
export async function enrichProductWithAI(
  productId: string,
  options?: {
    forceRefresh?: boolean;
    smData?: {
      referenceItemSpecifics?: any[];
      lowestPrice?: number;
      averagePrice?: number;
    };
  }
): Promise<AIEnrichResult> {
  console.log(`[AIEnrichService] 🤖 AI強化開始: ${productId}`);
  
  try {
    const result = await processApi.enrichWithAI(productId, options);
    
    if (result.success) {
      console.log(`[AIEnrichService] ✅ AI強化完了: ${productId}`, result.updates);
      return {
        productId,
        success: true,
        updates: result.updates,
        aiDetails: result.results,
      };
    } else {
      console.error(`[AIEnrichService] ❌ AI強化失敗: ${productId}`, result.error);
      return {
        productId,
        success: false,
        error: result.error || 'AI強化に失敗しました',
      };
    }
  } catch (error: any) {
    console.error(`[AIEnrichService] ❌ AI強化エラー: ${productId}`, error.message);
    return {
      productId,
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * 複数商品の一括AI強化
 */
export async function batchEnrichProductsWithAI(
  productIds: (string | number)[],
  options?: {
    onProgress?: (completed: number, total: number, productId: string, result: AIEnrichResult) => void;
  }
): Promise<BatchAIEnrichResult> {
  console.log(`[AIEnrichService] 🤖 一括AI強化開始: ${productIds.length}件`);
  
  const results: AIEnrichResult[] = [];
  const errors: string[] = [];
  
  for (let i = 0; i < productIds.length; i++) {
    const productId = String(productIds[i]);
    
    try {
      const result = await enrichProductWithAI(productId);
      results.push(result);
      
      if (!result.success && result.error) {
        errors.push(`${productId}: ${result.error}`);
      }
      
      // 進捗コールバック
      options?.onProgress?.(i + 1, productIds.length, productId, result);
      
      // レート制限対策（500ms待機）
      if (i < productIds.length - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (error: any) {
      const errorResult: AIEnrichResult = {
        productId,
        success: false,
        error: error.message || 'Unknown error',
      };
      results.push(errorResult);
      errors.push(`${productId}: ${error.message}`);
      options?.onProgress?.(i + 1, productIds.length, productId, errorResult);
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  const failedCount = results.filter(r => !r.success).length;
  
  console.log(`[AIEnrichService] 🏁 一括AI強化完了: ${successCount}/${productIds.length}件成功`);
  
  return {
    success: successCount > 0,
    total: productIds.length,
    updated: successCount,
    failed: failedCount,
    results,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * 重量のみ一括推定
 */
export async function batchEstimateWeights(
  products: Array<{
    id: string | number;
    title: string;
    description?: string;
    categoryName?: string;
    currentWeight?: number;
  }>,
  saveToDb: boolean = true
): Promise<{
  success: boolean;
  results: Array<{
    productId: string;
    status: 'success' | 'failed';
    estimation?: { weight: number; confidence: string; reasoning: string };
    error?: string;
  }>;
}> {
  console.log(`[AIEnrichService] ⚖️ 重量一括推定: ${products.length}件`);
  
  try {
    const result = await processApi.batchEstimateWeight(
      products.map(p => ({
        id: String(p.id),
        title: p.title,
        description: p.description,
        categoryName: p.categoryName,
        currentWeight: p.currentWeight,
      })),
      saveToDb
    );
    
    return result;
  } catch (error: any) {
    console.error('[AIEnrichService] 重量一括推定エラー:', error.message);
    return {
      success: false,
      results: products.map(p => ({
        productId: String(p.id),
        status: 'failed' as const,
        error: error.message,
      })),
    };
  }
}

/**
 * HTS推定（DBハイブリッド版）
 */
export async function estimateHTSHybrid(data: {
  productId?: string;
  title?: string;
  categoryName?: string;
  material?: string;
  description?: string;
  existingHTS?: string;
}): Promise<{
  success: boolean;
  htsCode?: string;
  htsConfidence?: number;
  htsReasoning?: string;
  originCountry?: string;
  originConfidence?: number;
  dbCandidates?: string[];
  error?: string;
}> {
  console.log(`[AIEnrichService] 📋 HTS推定: ${data.title?.substring(0, 30)}...`);
  
  try {
    return await processApi.estimateHTS(data);
  } catch (error: any) {
    console.error('[AIEnrichService] HTS推定エラー:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================================
// ヘルパー関数
// ============================================================

/**
 * 商品データから欠落フィールドを検出
 */
export function detectMissingFields(product: any): string[] {
  const missing: string[] = [];
  
  if (!product.hts_code) missing.push('hts_code');
  if (!product.origin_country) missing.push('origin_country');
  if (!product.material) missing.push('material');
  
  const weightG = product.listing_data?.weight_g || product.weight_g;
  if (!weightG || weightG <= 5) {
    // 重量が未設定または異常に小さい（5g以下）
    missing.push('weight_g');
  }
  
  return missing;
}

/**
 * AI強化が必要な商品をフィルタリング
 */
export function filterProductsNeedingEnrichment(products: any[]): any[] {
  return products.filter(p => {
    const missing = detectMissingFields(p);
    return missing.length > 0;
  });
}

// ============================================================
// エクスポート
// ============================================================

export default {
  enrichProductWithAI,
  batchEnrichProductsWithAI,
  batchEstimateWeights,
  estimateHTSHybrid,
  detectMissingFields,
  filterProductsNeedingEnrichment,
};
