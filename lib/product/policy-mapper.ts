/**
 * eBaymag用 配送ポリシーマッパー
 * 
 * 重量 + カテゴリー に基づいて、eBaymagでエラーにならないポリシーIDを自動選択
 * 
 * eBaymag特有の問題:
 * 1. マグカップなど割れ物カテゴリーは特別な配送ポリシーが必要
 * 2. 重量が極端に軽い場合（2gなど）はAI再推定が必要
 * 3. 500g以上は重量物用ポリシーが必要
 */

import { createClient } from '@/lib/supabase/client';

// ============================================================
// 型定義
// ============================================================

export interface PolicyMappingResult {
  success: boolean;
  policyId: string | null;
  policyName: string | null;
  paymentPolicyId: string | null;
  returnPolicyId: string | null;
  shippingCostUsd: number | null;
  warnings: string[];
  recommendation: PolicyRecommendation | null;
}

export interface PolicyRecommendation {
  action: 'use_policy' | 'request_ai_weight' | 'use_fragile_policy' | 'use_heavy_policy' | 'manual_review';
  reason: string;
  suggestedWeight?: number;
  alternativePolicyId?: string;
}

export interface CategoryRule {
  categoryKeywords: string[];
  minWeight: number;
  maxWeight: number;
  requireFragilePolicy: boolean;
  policyOverride?: string;
}

// ============================================================
// カテゴリー別ルール定義
// ============================================================

/**
 * カテゴリー別の配送ポリシールール
 * eBaymagで問題が発生しやすいカテゴリーを定義
 */
const CATEGORY_RULES: CategoryRule[] = [
  // 割れ物カテゴリー
  {
    categoryKeywords: ['mug', 'mugs', 'マグカップ', 'cup', 'ceramic', 'porcelain', 'glass', 'glassware'],
    minWeight: 200,
    maxWeight: 2000,
    requireFragilePolicy: true,
  },
  // 陶器・陶磁器
  {
    categoryKeywords: ['pottery', '陶器', '陶磁器', 'figurine', 'フィギュア'],
    minWeight: 100,
    maxWeight: 3000,
    requireFragilePolicy: true,
  },
  // トレーディングカード（軽量）
  {
    categoryKeywords: ['trading card', 'tcg', 'card game', 'mtg', 'pokemon', 'yugioh', 'カード'],
    minWeight: 1,
    maxWeight: 100,
    requireFragilePolicy: false,
  },
  // アパレル
  {
    categoryKeywords: ['clothing', 'apparel', 'shirt', 'tshirt', '衣類', 'アパレル'],
    minWeight: 100,
    maxWeight: 1000,
    requireFragilePolicy: false,
  },
  // 重量物
  {
    categoryKeywords: ['equipment', 'machine', '機器', 'heavy', '重量'],
    minWeight: 500,
    maxWeight: 30000,
    requireFragilePolicy: false,
  },
];

// ============================================================
// 重量異常検知の閾値
// ============================================================

/**
 * カテゴリーに基づく重量の妥当性チェック
 */
const WEIGHT_ANOMALY_THRESHOLDS: Record<string, { min: number; max: number; typical: number }> = {
  mug: { min: 200, max: 800, typical: 350 },
  trading_card: { min: 1, max: 50, typical: 5 },
  figurine: { min: 50, max: 2000, typical: 200 },
  clothing: { min: 100, max: 1000, typical: 300 },
  default: { min: 10, max: 30000, typical: 500 },
};

// ============================================================
// メイン関数
// ============================================================

/**
 * 商品データに基づいて最適な配送ポリシーを選択
 * 
 * @param params 商品情報
 * @returns ポリシーマッピング結果
 */
export async function mapShippingPolicy(params: {
  weightG: number;
  categoryId?: string;
  categoryName?: string;
  productTitle?: string;
  accountId: string; // 'mjt' | 'green'
  priceUsd?: number;
}): Promise<PolicyMappingResult> {
  const { weightG, categoryId, categoryName, productTitle, accountId, priceUsd } = params;
  const warnings: string[] = [];
  
  // カテゴリー情報を解析
  const categoryInfo = analyzeCategoryInfo(categoryName, productTitle);
  
  // Step 1: 重量異常チェック
  const weightAnomaly = checkWeightAnomaly(weightG, categoryInfo);
  if (weightAnomaly) {
    if (weightAnomaly.severity === 'critical') {
      return {
        success: false,
        policyId: null,
        policyName: null,
        paymentPolicyId: null,
        returnPolicyId: null,
        shippingCostUsd: null,
        warnings: [weightAnomaly.message],
        recommendation: {
          action: 'request_ai_weight',
          reason: weightAnomaly.message,
          suggestedWeight: weightAnomaly.suggestedWeight,
        },
      };
    }
    warnings.push(weightAnomaly.message);
  }
  
  // Step 2: カテゴリールール適用
  const rule = findMatchingRule(categoryInfo);
  
  // Step 3: 割れ物チェック
  if (rule?.requireFragilePolicy) {
    const fragileResult = await getFragilePolicy(accountId, weightG);
    if (fragileResult) {
      return {
        success: true,
        ...fragileResult,
        warnings: [...warnings, `割れ物カテゴリー検出: 割れ物対応ポリシーを使用`],
        recommendation: {
          action: 'use_fragile_policy',
          reason: `カテゴリー「${categoryInfo.matchedKeyword}」は割れ物扱いが必要`,
        },
      };
    }
  }
  
  // Step 4: 重量に基づくポリシー選択
  const supabase = createClient();
  
  // 重量帯の決定
  let weightCategory: 'light' | 'standard' | 'heavy';
  if (weightG < 200) {
    weightCategory = 'light';
  } else if (weightG < 500) {
    weightCategory = 'standard';
  } else {
    weightCategory = 'heavy';
    warnings.push(`重量${weightG}gは500g以上のため重量物ポリシーを適用`);
  }
  
  // DBから該当するポリシーを取得
  const { data: policies, error } = await supabase
    .from('ebay_shipping_policies')
    .select('*')
    .eq('account_id', accountId)
    .eq('is_active', true)
    .gte('weight_range_max', weightG)
    .order('weight_range_max', { ascending: true })
    .limit(1);
  
  if (error || !policies || policies.length === 0) {
    // フォールバック: 最大重量のポリシーを取得
    const { data: fallbackPolicy } = await supabase
      .from('ebay_shipping_policies')
      .select('*')
      .eq('account_id', accountId)
      .eq('is_active', true)
      .order('weight_range_max', { ascending: false })
      .limit(1);
    
    if (fallbackPolicy && fallbackPolicy.length > 0) {
      const policy = fallbackPolicy[0];
      return {
        success: true,
        policyId: policy.policy_id,
        policyName: policy.policy_name,
        paymentPolicyId: policy.payment_policy_id,
        returnPolicyId: policy.return_policy_id,
        shippingCostUsd: null,
        warnings: [...warnings, `適切なポリシーが見つからないため、最大重量ポリシーを使用`],
        recommendation: {
          action: 'use_heavy_policy',
          reason: `重量${weightG}gに対応するポリシーがないため、フォールバック`,
        },
      };
    }
    
    return {
      success: false,
      policyId: null,
      policyName: null,
      paymentPolicyId: null,
      returnPolicyId: null,
      shippingCostUsd: null,
      warnings: [...warnings, `配送ポリシーが見つかりません`],
      recommendation: {
        action: 'manual_review',
        reason: `アカウント「${accountId}」に有効なポリシーが設定されていません`,
      },
    };
  }
  
  const selectedPolicy = policies[0];
  
  // 送料の推定（Rate Table IDがある場合）
  let estimatedShippingCost: number | null = null;
  if (selectedPolicy.rate_table_id && priceUsd) {
    estimatedShippingCost = await estimateShippingCost(
      selectedPolicy.rate_table_id,
      weightG,
      priceUsd
    );
  }
  
  return {
    success: true,
    policyId: selectedPolicy.policy_id,
    policyName: selectedPolicy.policy_name,
    paymentPolicyId: selectedPolicy.payment_policy_id,
    returnPolicyId: selectedPolicy.return_policy_id,
    shippingCostUsd: estimatedShippingCost,
    warnings,
    recommendation: {
      action: 'use_policy',
      reason: `重量${weightG}g → ポリシー「${selectedPolicy.policy_name}」を選択`,
    },
  };
}

// ============================================================
// ヘルパー関数
// ============================================================

/**
 * カテゴリー情報を解析
 */
function analyzeCategoryInfo(
  categoryName?: string,
  productTitle?: string
): { matchedKeyword: string | null; isFragile: boolean; weightHint: string | null } {
  const searchText = `${categoryName || ''} ${productTitle || ''}`.toLowerCase();
  
  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.categoryKeywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return {
          matchedKeyword: keyword,
          isFragile: rule.requireFragilePolicy,
          weightHint: keyword.includes('mug') ? 'mug' : 
                      keyword.includes('card') ? 'trading_card' : 
                      keyword.includes('figurine') ? 'figurine' : null,
        };
      }
    }
  }
  
  return { matchedKeyword: null, isFragile: false, weightHint: null };
}

/**
 * 重量異常をチェック
 */
function checkWeightAnomaly(
  weightG: number,
  categoryInfo: { matchedKeyword: string | null; isFragile: boolean; weightHint: string | null }
): { severity: 'warning' | 'critical'; message: string; suggestedWeight?: number } | null {
  const thresholds = categoryInfo.weightHint 
    ? WEIGHT_ANOMALY_THRESHOLDS[categoryInfo.weightHint] 
    : WEIGHT_ANOMALY_THRESHOLDS.default;
  
  // 極端に軽い場合
  if (weightG < thresholds.min) {
    if (categoryInfo.isFragile && weightG < 10) {
      // マグカップで2gなどは明らかにおかしい
      return {
        severity: 'critical',
        message: `重量${weightG}gは${categoryInfo.matchedKeyword || 'この商品'}として異常に軽すぎます。AIによる重量再推定を推奨します。`,
        suggestedWeight: thresholds.typical,
      };
    }
    return {
      severity: 'warning',
      message: `重量${weightG}gは${categoryInfo.matchedKeyword || 'このカテゴリー'}の最小値${thresholds.min}g未満です。`,
    };
  }
  
  // 極端に重い場合
  if (weightG > thresholds.max) {
    return {
      severity: 'warning',
      message: `重量${weightG}gは${categoryInfo.matchedKeyword || 'このカテゴリー'}の最大値${thresholds.max}gを超えています。`,
    };
  }
  
  return null;
}

/**
 * マッチするカテゴリールールを検索
 */
function findMatchingRule(
  categoryInfo: { matchedKeyword: string | null; isFragile: boolean; weightHint: string | null }
): CategoryRule | null {
  if (!categoryInfo.matchedKeyword) return null;
  
  for (const rule of CATEGORY_RULES) {
    if (rule.categoryKeywords.some(k => k.toLowerCase() === categoryInfo.matchedKeyword?.toLowerCase())) {
      return rule;
    }
  }
  
  return null;
}

/**
 * 割れ物用ポリシーを取得
 */
async function getFragilePolicy(
  accountId: string,
  weightG: number
): Promise<{
  policyId: string;
  policyName: string;
  paymentPolicyId: string;
  returnPolicyId: string;
  shippingCostUsd: number | null;
} | null> {
  const supabase = createClient();
  
  // 割れ物対応ポリシーを検索（ポリシー名に FRAGILE や 割れ物 が含まれるもの）
  const { data: fragilePolicy } = await supabase
    .from('ebay_shipping_policies')
    .select('*')
    .eq('account_id', accountId)
    .eq('is_active', true)
    .or('policy_name.ilike.%FRAGILE%,policy_name.ilike.%割れ物%,policy_description.ilike.%fragile%')
    .gte('weight_range_max', weightG)
    .order('weight_range_max', { ascending: true })
    .limit(1);
  
  if (fragilePolicy && fragilePolicy.length > 0) {
    const policy = fragilePolicy[0];
    return {
      policyId: policy.policy_id,
      policyName: policy.policy_name,
      paymentPolicyId: policy.payment_policy_id,
      returnPolicyId: policy.return_policy_id,
      shippingCostUsd: null,
    };
  }
  
  return null;
}

/**
 * 送料を推定
 */
async function estimateShippingCost(
  rateTableId: string,
  weightG: number,
  priceUsd: number
): Promise<number | null> {
  const supabase = createClient();
  
  // Rate Tableから送料を取得（簡易版）
  const { data: rate } = await supabase
    .from('usa_ddp_rates')
    .select('*')
    .gte('weight', weightG / 1000)
    .order('weight', { ascending: true })
    .limit(1);
  
  if (rate && rate.length > 0) {
    // 価格帯に応じて送料を選択
    if (priceUsd <= 50) return rate[0].price_50;
    if (priceUsd <= 100) return rate[0].price_100;
    if (priceUsd <= 200) return rate[0].price_200;
    return rate[0].price_500;
  }
  
  return null;
}

// ============================================================
// 一括処理用関数
// ============================================================

/**
 * 複数商品のポリシーマッピングを一括実行
 */
export async function bulkMapShippingPolicies(
  products: Array<{
    id: string | number;
    weightG: number;
    categoryId?: string;
    categoryName?: string;
    productTitle?: string;
    priceUsd?: number;
  }>,
  accountId: string
): Promise<Map<string, PolicyMappingResult>> {
  const results = new Map<string, PolicyMappingResult>();
  
  for (const product of products) {
    const result = await mapShippingPolicy({
      weightG: product.weightG,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      productTitle: product.productTitle,
      accountId,
      priceUsd: product.priceUsd,
    });
    
    results.set(String(product.id), result);
  }
  
  return results;
}

/**
 * 重量異常商品を一括検出
 */
export function detectWeightAnomalies(
  products: Array<{
    id: string | number;
    weightG: number;
    categoryName?: string;
    productTitle?: string;
  }>
): Array<{
  productId: string;
  weightG: number;
  issue: string;
  suggestedWeight?: number;
}> {
  const anomalies: Array<{
    productId: string;
    weightG: number;
    issue: string;
    suggestedWeight?: number;
  }> = [];
  
  for (const product of products) {
    const categoryInfo = analyzeCategoryInfo(product.categoryName, product.productTitle);
    const anomaly = checkWeightAnomaly(product.weightG, categoryInfo);
    
    if (anomaly) {
      anomalies.push({
        productId: String(product.id),
        weightG: product.weightG,
        issue: anomaly.message,
        suggestedWeight: anomaly.suggestedWeight,
      });
    }
  }
  
  return anomalies;
}
