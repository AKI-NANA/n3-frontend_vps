// app/tools/editing-n3/hooks/use-product-validation.ts
/**
 * 商品バリデーション統合フック
 * 
 * 既存のediting-n3に新しいバリデーションシステムを統合
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

import { useMemo, useCallback, useState } from 'react';
import { 
  validateForListing, 
  validateProducts, 
  canListProduct,
  getCompletionRate,
  type ValidationResult,
  type ValidationConfig 
} from '@/lib/validation/listing-validator';
import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

export interface ProductValidationState {
  /** バリデーション結果 */
  validationResult: ValidationResult | null;
  /** 完成度 */
  completionRate: number;
  /** 出品可能か */
  canList: boolean;
  /** エラー数 */
  errorCount: number;
  /** 警告数 */
  warningCount: number;
  /** 不足フィールド */
  missingFields: string[];
}

export interface UseProductValidationReturn {
  /** 単一商品のバリデーション */
  validateProduct: (product: Product) => ValidationResult;
  /** 複数商品のバリデーション */
  validateBulk: (products: Product[]) => Map<string, ValidationResult>;
  /** 商品が出品可能か確認 */
  canListProduct: (product: Product) => boolean;
  /** 完成度を取得 */
  getCompletionRate: (product: Product) => number;
  /** バリデーション結果をキャッシュから取得 */
  getValidationState: (productId: string | number) => ProductValidationState | null;
  /** 全商品を再検証 */
  revalidateAll: (products: Product[]) => void;
  /** 検証結果キャッシュ */
  validationCache: Map<string, ProductValidationState>;
  /** バリデーションサマリー */
  summary: {
    total: number;
    valid: number;
    invalid: number;
    canList: number;
    averageCompletion: number;
  };
}

// ============================================================
// フック実装
// ============================================================

export function useProductValidation(
  config?: Partial<ValidationConfig>
): UseProductValidationReturn {
  const [validationCache, setValidationCache] = useState<Map<string, ProductValidationState>>(
    new Map()
  );
  
  // 単一商品のバリデーション
  const validateProduct = useCallback((product: Product): ValidationResult => {
    const result = validateForListing(product, config);
    
    // キャッシュに保存
    const state: ProductValidationState = {
      validationResult: result,
      completionRate: result.completionRate,
      canList: result.canList,
      errorCount: result.errors.length,
      warningCount: result.warnings.length,
      missingFields: result.missingFields,
    };
    
    setValidationCache(prev => {
      const newCache = new Map(prev);
      newCache.set(String(product.id), state);
      return newCache;
    });
    
    return result;
  }, [config]);
  
  // 複数商品のバリデーション
  const validateBulk = useCallback((products: Product[]): Map<string, ValidationResult> => {
    const results = validateProducts(products, config);
    
    // キャッシュを更新
    const newCache = new Map<string, ProductValidationState>();
    
    results.forEach((result, id) => {
      newCache.set(id, {
        validationResult: result,
        completionRate: result.completionRate,
        canList: result.canList,
        errorCount: result.errors.length,
        warningCount: result.warnings.length,
        missingFields: result.missingFields,
      });
    });
    
    setValidationCache(newCache);
    
    return results;
  }, [config]);
  
  // キャッシュから取得
  const getValidationState = useCallback((productId: string | number): ProductValidationState | null => {
    return validationCache.get(String(productId)) || null;
  }, [validationCache]);
  
  // 全商品を再検証
  const revalidateAll = useCallback((products: Product[]) => {
    validateBulk(products);
  }, [validateBulk]);
  
  // サマリー計算
  const summary = useMemo(() => {
    const states = Array.from(validationCache.values());
    const total = states.length;
    
    if (total === 0) {
      return { total: 0, valid: 0, invalid: 0, canList: 0, averageCompletion: 0 };
    }
    
    const valid = states.filter(s => s.validationResult?.isValid).length;
    const canListCount = states.filter(s => s.canList).length;
    const totalCompletion = states.reduce((sum, s) => sum + s.completionRate, 0);
    
    return {
      total,
      valid,
      invalid: total - valid,
      canList: canListCount,
      averageCompletion: Math.round(totalCompletion / total),
    };
  }, [validationCache]);
  
  return {
    validateProduct,
    validateBulk,
    canListProduct: (product: Product) => canListProduct(product),
    getCompletionRate: (product: Product) => getCompletionRate(product),
    getValidationState,
    revalidateAll,
    validationCache,
    summary,
  };
}

export default useProductValidation;
