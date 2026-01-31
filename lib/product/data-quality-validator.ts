/**
 * データ品質バリデーター
 * 
 * 出品前のデータ品質チェック:
 * 1. 重量異常検知（カテゴリーに対して軽すぎる/重すぎる）
 * 2. 必須Item Specifics確認
 * 3. カテゴリー別の必須項目チェック
 */

import { createClient } from '@/lib/supabase/client';

// ============================================================
// 型定義
// ============================================================

export interface DataQualityResult {
  isValid: boolean;
  score: number; // 0-100
  issues: DataQualityIssue[];
  warnings: DataQualityWarning[];
  recommendations: DataQualityRecommendation[];
}

export interface DataQualityIssue {
  field: string;
  severity: 'critical' | 'error' | 'warning';
  message: string;
  currentValue?: any;
  expectedValue?: string;
  autoFixable: boolean;
}

export interface DataQualityWarning {
  field: string;
  message: string;
  suggestion?: string;
}

export interface DataQualityRecommendation {
  action: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  autoExecutable: boolean;
}

export interface ProductForValidation {
  id: string | number;
  title?: string;
  english_title?: string;
  category_id?: string;
  category_name?: string;
  ebay_category_id?: string;
  weight_g?: number;
  listing_data?: {
    weight_g?: number;
    width_cm?: number;
    height_cm?: number;
    length_cm?: number;
    item_specifics?: Record<string, string>;
    condition?: string;
    condition_id?: number;
  };
  condition?: string;
  price_jpy?: number;
  ddp_price_usd?: number;
  html_content?: string;
  primary_image_url?: string;
  gallery_images?: string[];
}

// ============================================================
// カテゴリー別必須Item Specifics
// ============================================================

/**
 * eBayカテゴリー別の必須Item Specifics
 * カテゴリーIDに基づいて必須項目を定義
 */
const REQUIRED_ITEM_SPECIFICS: Record<string, string[]> = {
  // Trading Cards
  '183454': ['Card Name', 'Set', 'Game', 'Rarity', 'Language'],
  // Mugs
  '46283': ['Brand', 'Material', 'Color', 'Capacity'],
  // Clothing
  '15724': ['Brand', 'Size', 'Color', 'Material', 'Type'],
  // Figurines
  '60353': ['Brand', 'Character', 'Type', 'Material', 'Theme'],
  // Default
  'default': ['Brand'],
};

/**
 * カテゴリーキーワードに基づく必須項目
 */
const CATEGORY_KEYWORD_REQUIREMENTS: Record<string, string[]> = {
  'trading card': ['Card Name', 'Set', 'Game', 'Rarity'],
  'mug': ['Brand', 'Material', 'Capacity'],
  'figurine': ['Brand', 'Character', 'Theme'],
  't-shirt': ['Brand', 'Size', 'Color'],
  'clothing': ['Brand', 'Size', 'Color', 'Material'],
};

// ============================================================
// 重量の妥当性チェック
// ============================================================

const WEIGHT_EXPECTATIONS: Record<string, { min: number; max: number; typical: number }> = {
  'trading card': { min: 1, max: 50, typical: 5 },
  'mug': { min: 200, max: 800, typical: 350 },
  'figurine': { min: 50, max: 2000, typical: 200 },
  't-shirt': { min: 150, max: 400, typical: 250 },
  'plush': { min: 100, max: 1000, typical: 300 },
  'poster': { min: 20, max: 200, typical: 50 },
  'book': { min: 100, max: 2000, typical: 400 },
  'default': { min: 10, max: 30000, typical: 500 },
};

// ============================================================
// メイン検証関数
// ============================================================

/**
 * 商品データの品質を検証
 */
export function validateProductData(product: ProductForValidation): DataQualityResult {
  const issues: DataQualityIssue[] = [];
  const warnings: DataQualityWarning[] = [];
  const recommendations: DataQualityRecommendation[] = [];
  
  // 1. 基本情報チェック
  validateBasicInfo(product, issues, warnings);
  
  // 2. 重量チェック
  validateWeight(product, issues, warnings, recommendations);
  
  // 3. Item Specificsチェック
  validateItemSpecifics(product, issues, warnings, recommendations);
  
  // 4. 価格チェック
  validatePricing(product, issues, warnings);
  
  // 5. メディアチェック
  validateMedia(product, issues, warnings);
  
  // 6. HTML説明文チェック
  validateHtmlContent(product, issues, warnings);
  
  // スコア計算
  const score = calculateQualityScore(issues, warnings);
  const isValid = issues.filter(i => i.severity === 'critical').length === 0;
  
  return {
    isValid,
    score,
    issues,
    warnings,
    recommendations,
  };
}

// ============================================================
// 個別検証関数
// ============================================================

function validateBasicInfo(
  product: ProductForValidation,
  issues: DataQualityIssue[],
  warnings: DataQualityWarning[]
): void {
  // タイトルチェック
  if (!product.title && !product.english_title) {
    issues.push({
      field: 'title',
      severity: 'critical',
      message: 'タイトルが設定されていません',
      autoFixable: false,
    });
  } else if (!product.english_title) {
    issues.push({
      field: 'english_title',
      severity: 'error',
      message: '英語タイトルが設定されていません',
      autoFixable: true,
    });
  } else if (product.english_title.length < 20) {
    warnings.push({
      field: 'english_title',
      message: '英語タイトルが短すぎます（20文字未満）',
      suggestion: 'SEO効果を高めるため、より詳細なタイトルを推奨',
    });
  }
  
  // カテゴリーチェック
  if (!product.ebay_category_id && !product.category_id) {
    issues.push({
      field: 'category',
      severity: 'critical',
      message: 'eBayカテゴリーIDが設定されていません',
      autoFixable: true,
    });
  }
  
  // コンディションチェック
  const condition = product.listing_data?.condition || product.condition;
  if (!condition && !product.listing_data?.condition_id) {
    issues.push({
      field: 'condition',
      severity: 'error',
      message: 'コンディションが設定されていません',
      autoFixable: false,
    });
  }
}

function validateWeight(
  product: ProductForValidation,
  issues: DataQualityIssue[],
  warnings: DataQualityWarning[],
  recommendations: DataQualityRecommendation[]
): void {
  const weight = product.listing_data?.weight_g || product.weight_g;
  
  if (!weight || weight === 0) {
    issues.push({
      field: 'weight',
      severity: 'critical',
      message: '重量が設定されていません',
      currentValue: weight,
      autoFixable: true,
    });
    recommendations.push({
      action: 'ai_weight_estimation',
      reason: '重量未設定。AIによる推定を推奨',
      impact: 'high',
      autoExecutable: true,
    });
    return;
  }
  
  // カテゴリーに基づく重量妥当性チェック
  const categoryKeyword = detectCategoryKeyword(product);
  const expectations = categoryKeyword 
    ? WEIGHT_EXPECTATIONS[categoryKeyword] 
    : WEIGHT_EXPECTATIONS.default;
  
  if (weight < expectations.min) {
    const severity = weight < 10 && categoryKeyword ? 'error' : 'warning';
    issues.push({
      field: 'weight',
      severity: severity as 'error' | 'warning',
      message: `重量${weight}gは${categoryKeyword || 'このカテゴリー'}として異常に軽いです（最小期待値: ${expectations.min}g）`,
      currentValue: weight,
      expectedValue: `${expectations.min}g - ${expectations.max}g`,
      autoFixable: true,
    });
    
    if (weight < 10 && categoryKeyword === 'mug') {
      recommendations.push({
        action: 'ai_weight_reestimation',
        reason: `マグカップで${weight}gは明らかに異常。AIによる再推定を強く推奨`,
        impact: 'high',
        autoExecutable: true,
      });
    }
  }
  
  if (weight > expectations.max) {
    warnings.push({
      field: 'weight',
      message: `重量${weight}gは${categoryKeyword || 'このカテゴリー'}として重すぎる可能性があります（最大期待値: ${expectations.max}g）`,
      suggestion: '重量を確認してください',
    });
  }
  
  // 寸法チェック
  const { width_cm, height_cm, length_cm } = product.listing_data || {};
  if (!width_cm || !height_cm || !length_cm) {
    warnings.push({
      field: 'dimensions',
      message: '寸法（縦・横・高さ）が一部未設定です',
      suggestion: '正確な送料計算のため、すべての寸法を設定してください',
    });
  }
}

function validateItemSpecifics(
  product: ProductForValidation,
  issues: DataQualityIssue[],
  warnings: DataQualityWarning[],
  recommendations: DataQualityRecommendation[]
): void {
  const itemSpecifics = product.listing_data?.item_specifics || {};
  const categoryId = product.ebay_category_id || product.category_id || 'default';
  
  // カテゴリーIDに基づく必須項目
  let requiredFields = REQUIRED_ITEM_SPECIFICS[categoryId] || REQUIRED_ITEM_SPECIFICS.default;
  
  // カテゴリーキーワードに基づく追加必須項目
  const categoryKeyword = detectCategoryKeyword(product);
  if (categoryKeyword && CATEGORY_KEYWORD_REQUIREMENTS[categoryKeyword]) {
    requiredFields = [...new Set([...requiredFields, ...CATEGORY_KEYWORD_REQUIREMENTS[categoryKeyword]])];
  }
  
  // 必須項目チェック
  const missingFields: string[] = [];
  for (const field of requiredFields) {
    const value = itemSpecifics[field];
    if (!value || value.trim() === '') {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    issues.push({
      field: 'item_specifics',
      severity: 'error',
      message: `必須Item Specificsが未設定: ${missingFields.join(', ')}`,
      currentValue: Object.keys(itemSpecifics),
      expectedValue: requiredFields.join(', '),
      autoFixable: true,
    });
    
    recommendations.push({
      action: 'auto_fill_item_specifics',
      reason: `${missingFields.length}件の必須Item Specificsが未設定`,
      impact: 'medium',
      autoExecutable: true,
    });
  }
  
  // Brand特別チェック
  if (!itemSpecifics['Brand']) {
    warnings.push({
      field: 'item_specifics.Brand',
      message: 'Brandが未設定です',
      suggestion: 'ブランド不明の場合は「Unbranded」を設定してください',
    });
  }
}

function validatePricing(
  product: ProductForValidation,
  issues: DataQualityIssue[],
  warnings: DataQualityWarning[]
): void {
  if (!product.price_jpy && !product.ddp_price_usd) {
    issues.push({
      field: 'price',
      severity: 'critical',
      message: '価格が設定されていません',
      autoFixable: false,
    });
  }
  
  if (product.ddp_price_usd && product.ddp_price_usd < 5) {
    warnings.push({
      field: 'price',
      message: `USD価格が非常に低い（$${product.ddp_price_usd}）`,
      suggestion: '利益率を確認してください',
    });
  }
}

function validateMedia(
  product: ProductForValidation,
  issues: DataQualityIssue[],
  warnings: DataQualityWarning[]
): void {
  if (!product.primary_image_url) {
    issues.push({
      field: 'primary_image',
      severity: 'critical',
      message: 'メイン画像が設定されていません',
      autoFixable: false,
    });
  }
  
  const galleryImages = product.gallery_images || [];
  if (galleryImages.length < 3) {
    warnings.push({
      field: 'gallery_images',
      message: `ギャラリー画像が少ない（${galleryImages.length}枚）`,
      suggestion: 'SEO効果を高めるため、3枚以上の画像を推奨',
    });
  }
  
  if (galleryImages.length > 12) {
    warnings.push({
      field: 'gallery_images',
      message: `ギャラリー画像が多すぎます（${galleryImages.length}枚）`,
      suggestion: 'eBay推奨は12枚以内',
    });
  }
}

function validateHtmlContent(
  product: ProductForValidation,
  issues: DataQualityIssue[],
  warnings: DataQualityWarning[]
): void {
  if (!product.html_content) {
    issues.push({
      field: 'html_content',
      severity: 'error',
      message: 'HTML説明文が設定されていません',
      autoFixable: true,
    });
  } else if (product.html_content.length < 500) {
    warnings.push({
      field: 'html_content',
      message: 'HTML説明文が短すぎます',
      suggestion: 'より詳細な説明を追加して購買意欲を高めましょう',
    });
  }
}

// ============================================================
// ヘルパー関数
// ============================================================

function detectCategoryKeyword(product: ProductForValidation): string | null {
  const searchText = `${product.category_name || ''} ${product.title || ''} ${product.english_title || ''}`.toLowerCase();
  
  const keywords = Object.keys(WEIGHT_EXPECTATIONS);
  for (const keyword of keywords) {
    if (keyword !== 'default' && searchText.includes(keyword)) {
      return keyword;
    }
  }
  
  return null;
}

function calculateQualityScore(
  issues: DataQualityIssue[],
  warnings: DataQualityWarning[]
): number {
  let score = 100;
  
  // 問題点の重み付け
  for (const issue of issues) {
    switch (issue.severity) {
      case 'critical':
        score -= 25;
        break;
      case 'error':
        score -= 15;
        break;
      case 'warning':
        score -= 5;
        break;
    }
  }
  
  // 警告の重み付け
  score -= warnings.length * 2;
  
  return Math.max(0, score);
}

// ============================================================
// 一括検証
// ============================================================

/**
 * 複数商品のデータ品質を一括検証
 */
export function bulkValidateProducts(
  products: ProductForValidation[]
): Map<string, DataQualityResult> {
  const results = new Map<string, DataQualityResult>();
  
  for (const product of products) {
    results.set(String(product.id), validateProductData(product));
  }
  
  return results;
}

/**
 * 出品可能な商品をフィルタリング
 */
export function filterListableProducts(
  products: ProductForValidation[]
): {
  listable: ProductForValidation[];
  blocked: Array<{ product: ProductForValidation; reason: string }>;
} {
  const listable: ProductForValidation[] = [];
  const blocked: Array<{ product: ProductForValidation; reason: string }> = [];
  
  for (const product of products) {
    const result = validateProductData(product);
    
    if (result.isValid) {
      listable.push(product);
    } else {
      const criticalIssues = result.issues.filter(i => i.severity === 'critical');
      blocked.push({
        product,
        reason: criticalIssues.map(i => i.message).join('; '),
      });
    }
  }
  
  return { listable, blocked };
}

/**
 * 品質スコアでソート
 */
export function sortByQualityScore(
  products: ProductForValidation[],
  order: 'asc' | 'desc' = 'desc'
): Array<ProductForValidation & { qualityScore: number }> {
  const productsWithScore = products.map(product => ({
    ...product,
    qualityScore: validateProductData(product).score,
  }));
  
  return productsWithScore.sort((a, b) => 
    order === 'desc' 
      ? b.qualityScore - a.qualityScore 
      : a.qualityScore - b.qualityScore
  );
}
