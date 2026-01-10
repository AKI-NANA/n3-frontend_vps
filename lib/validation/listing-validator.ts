// lib/validation/listing-validator.ts
/**
 * 出品前バリデーションシステム
 * 
 * 機能:
 * 1. 必須項目チェック（出品不可）
 * 2. 推奨項目チェック（警告表示）
 * 3. 利益率チェック（赤字防止）
 * 4. VEROブランドチェック
 * 5. 完成度スコア計算
 * 
 * @version 2.0.0
 * @date 2025-12-21
 */

import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationError {
  field: string;
  label: string;
  message: string;
  severity: ValidationSeverity;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;           // エラーがない = true
  canList: boolean;           // 出品可能 = true（エラーなし）
  errors: ValidationError[];  // エラー一覧（出品不可）
  warnings: ValidationError[]; // 警告一覧（出品可能だが注意）
  infos: ValidationError[];   // 情報（参考）
  completionRate: number;     // 完成度 0-100
  missingFields: string[];    // 未入力フィールド名
  summary: string;            // サマリーテキスト
}

export interface ValidationConfig {
  checkProfit: boolean;       // 利益チェック有効
  minProfitMargin: number;    // 最低利益率（%）
  checkVero: boolean;         // VEROチェック有効
  checkHts: boolean;          // HTSチェック有効
  strictMode: boolean;        // 厳格モード（推奨も必須扱い）
}

// ============================================================
// 定数
// ============================================================

/** 必須フィールド定義 */
const REQUIRED_FIELDS: Array<{
  field: string;
  label: string;
  check: (product: any) => boolean;
}> = [
  {
    field: 'english_title',
    label: '英語タイトル',
    check: (p) => !!(p.english_title || p.title_en) && (p.english_title || p.title_en).length >= 10
  },
  {
    field: 'price_usd',
    label: '価格(USD)',
    check: (p) => {
      const price = p.price_usd || p.listing_data?.price_usd || p.selling_price;
      return price && price > 0;
    }
  },
  {
    field: 'primary_image_url',
    label: 'メイン画像',
    check: (p) => !!(p.primary_image_url || p.images?.[0] || p.gallery_images?.[0])
  },
  {
    field: 'category_id',
    label: 'eBayカテゴリ',
    check: (p) => !!(p.category_id || p.ebay_category_id)
  },
  {
    field: 'condition_id',
    label: 'コンディション',
    check: (p) => !!(p.condition_id || p.ebay_condition_id || p.condition_name)
  }
];

/** 推奨フィールド定義 */
const RECOMMENDED_FIELDS: Array<{
  field: string;
  label: string;
  check: (product: any) => boolean;
  weight: number; // 完成度計算用重み（1-3）
}> = [
  {
    field: 'hts_code',
    label: 'HTSコード',
    check: (p) => !!(p.hts_code && p.hts_code.length >= 6),
    weight: 3
  },
  {
    field: 'origin_country',
    label: '原産国',
    check: (p) => !!(p.origin_country && p.origin_country.length === 2),
    weight: 2
  },
  {
    field: 'weight_g',
    label: '重量',
    check: (p) => {
      const weight = p.weight_g || p.listing_data?.weight_g;
      return weight && weight > 0;
    },
    weight: 2
  },
  {
    field: 'shipping_cost_usd',
    label: '送料',
    check: (p) => {
      const shipping = p.shipping_cost_usd || p.listing_data?.shipping_cost_usd;
      return shipping !== undefined && shipping >= 0;
    },
    weight: 2
  },
  {
    field: 'material',
    label: '素材',
    check: (p) => !!(p.material && p.material.length >= 2),
    weight: 1
  },
  {
    field: 'dimensions',
    label: 'サイズ',
    check: (p) => {
      const ld = p.listing_data || {};
      return (ld.width_cm > 0 || ld.length_cm > 0 || ld.height_cm > 0);
    },
    weight: 1
  },
  {
    field: 'description',
    label: '商品説明',
    check: (p) => {
      const desc = p.english_description || p.description_en || p.html_content;
      return desc && desc.length >= 50;
    },
    weight: 2
  },
  {
    field: 'gallery_images',
    label: '追加画像',
    check: (p) => {
      const images = p.gallery_images || p.images || [];
      return images.length >= 3;
    },
    weight: 1
  }
];

/** デフォルト設定 */
const DEFAULT_CONFIG: ValidationConfig = {
  checkProfit: true,
  minProfitMargin: 0,  // 0%以上（赤字禁止）
  checkVero: true,
  checkHts: true,
  strictMode: false
};

// ============================================================
// ユーティリティ関数
// ============================================================

/**
 * ネストされたオブジェクトの値を取得
 */
function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * 利益率を取得
 */
function getProfitMargin(product: any): number | undefined {
  return product.profit_margin 
    || product.listing_data?.ddu_profit_margin
    || product.listing_data?.ddp_profit_margin
    || product.listing_data?.profit_margin;
}

/**
 * 利益額を取得
 */
function getProfitAmount(product: any): number | undefined {
  return product.profit_amount_usd
    || product.listing_data?.ddu_profit_usd
    || product.listing_data?.ddp_profit_usd
    || product.listing_data?.profit_amount_usd;
}

// ============================================================
// メイン関数
// ============================================================

/**
 * 商品を出品前にバリデーション
 * 
 * @param product - 検証対象の商品データ
 * @param config - バリデーション設定（オプション）
 * @returns ValidationResult
 */
export function validateForListing(
  product: any,
  config: Partial<ValidationConfig> = {}
): ValidationResult {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const infos: ValidationError[] = [];
  const missingFields: string[] = [];
  
  // ============================================================
  // 1. 必須項目チェック
  // ============================================================
  
  for (const { field, label, check } of REQUIRED_FIELDS) {
    if (!check(product)) {
      errors.push({
        field,
        label,
        message: `${label}が設定されていません`,
        severity: 'error'
      });
      missingFields.push(field);
    }
  }
  
  // ============================================================
  // 2. 推奨項目チェック
  // ============================================================
  
  for (const { field, label, check } of RECOMMENDED_FIELDS) {
    if (!check(product)) {
      if (cfg.strictMode) {
        errors.push({
          field,
          label,
          message: `${label}が未設定です`,
          severity: 'error'
        });
      } else {
        warnings.push({
          field,
          label,
          message: `${label}が未設定です（推奨）`,
          severity: 'warning'
        });
      }
      missingFields.push(field);
    }
  }
  
  // ============================================================
  // 3. 利益率チェック
  // ============================================================
  
  if (cfg.checkProfit) {
    const profitMargin = getProfitMargin(product);
    const profitAmount = getProfitAmount(product);
    
    if (profitMargin !== undefined) {
      if (profitMargin < 0) {
        errors.push({
          field: 'profit_margin',
          label: '利益率',
          message: `🚨 赤字出品になります（利益率: ${profitMargin.toFixed(1)}%、損失: $${Math.abs(profitAmount || 0).toFixed(2)}）`,
          severity: 'error',
          value: profitMargin
        });
      } else if (profitMargin < cfg.minProfitMargin) {
        warnings.push({
          field: 'profit_margin',
          label: '利益率',
          message: `利益率が低いです（${profitMargin.toFixed(1)}%）`,
          severity: 'warning',
          value: profitMargin
        });
      } else if (profitMargin < 10) {
        infos.push({
          field: 'profit_margin',
          label: '利益率',
          message: `利益率: ${profitMargin.toFixed(1)}%（$${(profitAmount || 0).toFixed(2)}）`,
          severity: 'info',
          value: profitMargin
        });
      }
    } else {
      warnings.push({
        field: 'profit_margin',
        label: '利益率',
        message: '利益率が計算されていません',
        severity: 'warning'
      });
    }
  }
  
  // ============================================================
  // 4. VEROチェック
  // ============================================================
  
  if (cfg.checkVero && product.is_vero_brand) {
    errors.push({
      field: 'is_vero_brand',
      label: 'VEROブランド',
      message: '⛔ VEROブランドのため出品できません',
      severity: 'error',
      value: true
    });
  }
  
  // ============================================================
  // 5. HTSコード形式チェック
  // ============================================================
  
  if (cfg.checkHts && product.hts_code) {
    const htsCode = product.hts_code.replace(/\D/g, '');
    if (htsCode.length < 6) {
      warnings.push({
        field: 'hts_code',
        label: 'HTSコード',
        message: 'HTSコードが不完全です（6桁以上必要）',
        severity: 'warning',
        value: product.hts_code
      });
    }
  }
  
  // ============================================================
  // 6. 完成度計算
  // ============================================================
  
  const requiredWeight = REQUIRED_FIELDS.length * 3; // 必須は重み3
  const recommendedWeight = RECOMMENDED_FIELDS.reduce((sum, f) => sum + f.weight, 0);
  const totalWeight = requiredWeight + recommendedWeight;
  
  let earnedWeight = 0;
  
  // 必須項目
  for (const { check } of REQUIRED_FIELDS) {
    if (check(product)) earnedWeight += 3;
  }
  
  // 推奨項目
  for (const { check, weight } of RECOMMENDED_FIELDS) {
    if (check(product)) earnedWeight += weight;
  }
  
  const completionRate = Math.round((earnedWeight / totalWeight) * 100);
  
  // ============================================================
  // 7. サマリー生成
  // ============================================================
  
  let summary = '';
  if (errors.length === 0 && warnings.length === 0) {
    summary = '✅ 出品準備完了';
  } else if (errors.length === 0) {
    summary = `⚠️ ${warnings.length}件の警告があります`;
  } else {
    summary = `❌ ${errors.length}件のエラーがあります`;
  }
  
  return {
    isValid: errors.length === 0,
    canList: errors.length === 0,
    errors,
    warnings,
    infos,
    completionRate,
    missingFields,
    summary
  };
}

/**
 * 複数商品を一括バリデーション
 */
export function validateProducts(
  products: any[],
  config: Partial<ValidationConfig> = {}
): Map<string, ValidationResult> {
  const results = new Map<string, ValidationResult>();
  
  for (const product of products) {
    const id = String(product.id);
    results.set(id, validateForListing(product, config));
  }
  
  return results;
}

/**
 * バリデーション結果のサマリーを取得
 */
export function getValidationSummary(
  results: Map<string, ValidationResult>
): {
  total: number;
  valid: number;
  invalid: number;
  averageCompletion: number;
  commonErrors: Array<{ field: string; count: number }>;
} {
  const total = results.size;
  let valid = 0;
  let invalid = 0;
  let totalCompletion = 0;
  const errorCounts = new Map<string, number>();
  
  results.forEach((result) => {
    if (result.isValid) {
      valid++;
    } else {
      invalid++;
    }
    totalCompletion += result.completionRate;
    
    for (const error of result.errors) {
      errorCounts.set(error.field, (errorCounts.get(error.field) || 0) + 1);
    }
  });
  
  const commonErrors = Array.from(errorCounts.entries())
    .map(([field, count]) => ({ field, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return {
    total,
    valid,
    invalid,
    averageCompletion: total > 0 ? Math.round(totalCompletion / total) : 0,
    commonErrors
  };
}

/**
 * 出品可能かどうかのシンプルチェック
 */
export function canListProduct(product: any): boolean {
  const result = validateForListing(product);
  return result.canList;
}

/**
 * 完成度を取得
 */
export function getCompletionRate(product: any): number {
  const result = validateForListing(product);
  return result.completionRate;
}

// ============================================================
// エクスポート
// ============================================================

export default {
  validateForListing,
  validateProducts,
  getValidationSummary,
  canListProduct,
  getCompletionRate,
  REQUIRED_FIELDS,
  RECOMMENDED_FIELDS
};
