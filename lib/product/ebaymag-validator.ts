/**
 * eBaymag同期専用バリデーター
 * 
 * eBaymagがeBay USからの同期時に必要とする項目を検証:
 * - 重量（Weight）: 必須、有効な値であること
 * - 寸法（Dimensions）: 必須、有効な値であること
 * - SKU: 必須、有効な形式であること
 * - 価格: 必須、適切な範囲であること
 * - Item Specifics: カテゴリー別必須項目
 */

import { validateProductData, DataQualityResult, DataQualityIssue } from './data-quality-validator';

// ============================================================
// 型定義
// ============================================================

export interface EbaymagValidationResult {
  isValid: boolean;
  canSync: boolean;
  blockingIssues: EbaymagIssue[];
  warnings: EbaymagIssue[];
  autoFixSuggestions: AutoFixSuggestion[];
  syncReadinessScore: number; // 0-100
}

export interface EbaymagIssue {
  field: string;
  code: EbaymagErrorCode;
  message: string;
  currentValue?: any;
  requiredValue?: string;
  fixAction?: string;
}

export interface AutoFixSuggestion {
  field: string;
  action: 'ai_estimate' | 'default_value' | 'copy_from_source' | 'calculate';
  suggestedValue?: any;
  confidence: 'high' | 'medium' | 'low';
}

export type EbaymagErrorCode = 
  | 'MISSING_WEIGHT'
  | 'INVALID_WEIGHT'
  | 'WEIGHT_ANOMALY'
  | 'MISSING_DIMENSIONS'
  | 'INVALID_DIMENSIONS'
  | 'MISSING_SKU'
  | 'INVALID_SKU_FORMAT'
  | 'DUPLICATE_SKU'
  | 'MISSING_PRICE'
  | 'INVALID_PRICE'
  | 'MISSING_ITEM_SPECIFICS'
  | 'MISSING_CONDITION'
  | 'MISSING_CATEGORY'
  | 'MISSING_TITLE'
  | 'MISSING_IMAGES';

// ============================================================
// eBaymag必須項目定義
// ============================================================

const EBAYMAG_REQUIRED_FIELDS = {
  // 配送関連（最重要）
  shipping: {
    weight_g: { required: true, minValue: 1, maxValue: 30000 },
    width_cm: { required: true, minValue: 0.1, maxValue: 200 },
    height_cm: { required: true, minValue: 0.1, maxValue: 200 },
    length_cm: { required: true, minValue: 0.1, maxValue: 200 },
  },
  // 商品識別
  identification: {
    sku: { required: true, pattern: /^[A-Za-z0-9\-_]+$/, maxLength: 50 },
    title: { required: true, minLength: 10, maxLength: 80 },
  },
  // 価格
  pricing: {
    price_usd: { required: true, minValue: 0.99, maxValue: 100000 },
  },
  // コンディション
  condition: {
    condition: { required: true },
    condition_id: { required: false }, // conditionがあれば不要
  },
};

// カテゴリー別必須Item Specifics（eBaymag同期で重要）
const EBAYMAG_CATEGORY_ITEM_SPECIFICS: Record<string, string[]> = {
  // Trading Cards (183454)
  '183454': ['Card Name', 'Game', 'Set', 'Rarity', 'Language', 'Condition'],
  // Mugs (46283)
  '46283': ['Brand', 'Material', 'Color', 'Capacity', 'Type'],
  // Action Figures (261068)
  '261068': ['Brand', 'Character', 'Material', 'Theme', 'Size'],
  // T-Shirts (15687)
  '15687': ['Brand', 'Size', 'Color', 'Material', 'Sleeve Length'],
  // Default
  'default': ['Brand'],
};

// ============================================================
// メイン検証関数
// ============================================================

export interface ProductForEbaymagValidation {
  id: number | string;
  sku?: string;
  title?: string;
  english_title?: string;
  ebay_category_id?: string;
  category_id?: string;
  condition?: string;
  price_jpy?: number;
  ddp_price_usd?: number;
  ddu_price_usd?: number;
  primary_image_url?: string;
  listing_data?: {
    weight_g?: number;
    width_cm?: number;
    height_cm?: number;
    length_cm?: number;
    condition?: string;
    condition_id?: number;
    item_specifics?: Record<string, string>;
    shipping_policy_id?: string;
  };
}

/**
 * eBaymag同期のためのバリデーション
 */
export function validateForEbaymagSync(
  product: ProductForEbaymagValidation
): EbaymagValidationResult {
  const blockingIssues: EbaymagIssue[] = [];
  const warnings: EbaymagIssue[] = [];
  const autoFixSuggestions: AutoFixSuggestion[] = [];
  
  // 1. 配送情報の検証（最重要）
  validateShippingInfo(product, blockingIssues, warnings, autoFixSuggestions);
  
  // 2. SKUの検証
  validateSku(product, blockingIssues, warnings);
  
  // 3. 価格の検証
  validatePrice(product, blockingIssues, warnings);
  
  // 4. コンディションの検証
  validateCondition(product, blockingIssues, warnings);
  
  // 5. カテゴリーの検証
  validateCategory(product, blockingIssues, warnings);
  
  // 6. タイトルの検証
  validateTitle(product, blockingIssues, warnings);
  
  // 7. 画像の検証
  validateImages(product, blockingIssues, warnings);
  
  // 8. Item Specificsの検証
  validateItemSpecificsForEbaymag(product, blockingIssues, warnings, autoFixSuggestions);
  
  // 同期可能性判定
  const canSync = blockingIssues.length === 0;
  const isValid = canSync && warnings.filter(w => 
    ['WEIGHT_ANOMALY', 'MISSING_ITEM_SPECIFICS'].includes(w.code)
  ).length === 0;
  
  // スコア計算
  const syncReadinessScore = calculateSyncReadinessScore(blockingIssues, warnings);
  
  return {
    isValid,
    canSync,
    blockingIssues,
    warnings,
    autoFixSuggestions,
    syncReadinessScore,
  };
}

// ============================================================
// 個別検証関数
// ============================================================

function validateShippingInfo(
  product: ProductForEbaymagValidation,
  blockingIssues: EbaymagIssue[],
  warnings: EbaymagIssue[],
  autoFixSuggestions: AutoFixSuggestion[]
): void {
  const listingData = product.listing_data || {};
  
  // 重量チェック
  const weight = listingData.weight_g;
  if (!weight || weight === 0) {
    blockingIssues.push({
      field: 'weight_g',
      code: 'MISSING_WEIGHT',
      message: '重量が設定されていません。eBaymag同期には必須です。',
      currentValue: weight,
      requiredValue: '1g以上',
      fixAction: 'AIによる重量推定を実行',
    });
    autoFixSuggestions.push({
      field: 'weight_g',
      action: 'ai_estimate',
      confidence: 'medium',
    });
  } else if (weight < 1) {
    blockingIssues.push({
      field: 'weight_g',
      code: 'INVALID_WEIGHT',
      message: `重量が無効です（${weight}g）。1g以上を設定してください。`,
      currentValue: weight,
      requiredValue: '1g以上',
    });
  } else if (weight < 10) {
    // 重量異常の警告（カテゴリーによってはブロッキング）
    const categoryId = product.ebay_category_id || product.category_id;
    const title = (product.title || product.english_title || '').toLowerCase();
    
    // マグカップで10g未満は明らかに異常
    if (categoryId === '46283' || /mug|マグ/i.test(title)) {
      blockingIssues.push({
        field: 'weight_g',
        code: 'WEIGHT_ANOMALY',
        message: `マグカップで${weight}gは明らかに異常です。正しい重量を設定してください。`,
        currentValue: weight,
        requiredValue: '300-600g',
      });
      autoFixSuggestions.push({
        field: 'weight_g',
        action: 'ai_estimate',
        suggestedValue: 350,
        confidence: 'high',
      });
    } else {
      warnings.push({
        field: 'weight_g',
        code: 'WEIGHT_ANOMALY',
        message: `重量${weight}gは非常に軽いです。確認してください。`,
        currentValue: weight,
      });
    }
  }
  
  // 寸法チェック
  const { width_cm, height_cm, length_cm } = listingData;
  const missingDimensions: string[] = [];
  
  if (!width_cm || width_cm <= 0) missingDimensions.push('幅');
  if (!height_cm || height_cm <= 0) missingDimensions.push('高さ');
  if (!length_cm || length_cm <= 0) missingDimensions.push('奥行');
  
  if (missingDimensions.length === 3) {
    blockingIssues.push({
      field: 'dimensions',
      code: 'MISSING_DIMENSIONS',
      message: '寸法が設定されていません。eBaymag同期には必須です。',
      currentValue: { width_cm, height_cm, length_cm },
      requiredValue: 'すべての寸法（縦・横・高さ）',
    });
    autoFixSuggestions.push({
      field: 'dimensions',
      action: 'ai_estimate',
      confidence: 'low',
    });
  } else if (missingDimensions.length > 0) {
    warnings.push({
      field: 'dimensions',
      code: 'MISSING_DIMENSIONS',
      message: `一部の寸法が未設定です: ${missingDimensions.join(', ')}`,
      currentValue: { width_cm, height_cm, length_cm },
    });
  }
}

function validateSku(
  product: ProductForEbaymagValidation,
  blockingIssues: EbaymagIssue[],
  warnings: EbaymagIssue[]
): void {
  const sku = product.sku;
  
  if (!sku || sku.trim() === '') {
    blockingIssues.push({
      field: 'sku',
      code: 'MISSING_SKU',
      message: 'SKUが設定されていません。eBaymag同期には必須です。',
      requiredValue: '英数字とハイフン・アンダースコア',
    });
    return;
  }
  
  // SKU形式チェック
  const skuPattern = /^[A-Za-z0-9\-_]+$/;
  if (!skuPattern.test(sku)) {
    warnings.push({
      field: 'sku',
      code: 'INVALID_SKU_FORMAT',
      message: `SKU「${sku}」に無効な文字が含まれています。英数字とハイフン・アンダースコアのみ推奨。`,
      currentValue: sku,
    });
  }
  
  if (sku.length > 50) {
    warnings.push({
      field: 'sku',
      code: 'INVALID_SKU_FORMAT',
      message: `SKUが長すぎます（${sku.length}文字）。50文字以内を推奨。`,
      currentValue: sku,
    });
  }
}

function validatePrice(
  product: ProductForEbaymagValidation,
  blockingIssues: EbaymagIssue[],
  warnings: EbaymagIssue[]
): void {
  const priceUsd = product.ddp_price_usd || product.ddu_price_usd;
  
  if (!priceUsd || priceUsd <= 0) {
    blockingIssues.push({
      field: 'price',
      code: 'MISSING_PRICE',
      message: 'USD価格が設定されていません。',
      requiredValue: '$0.99以上',
    });
    return;
  }
  
  if (priceUsd < 0.99) {
    warnings.push({
      field: 'price',
      code: 'INVALID_PRICE',
      message: `価格$${priceUsd}は低すぎます。$0.99以上を推奨。`,
      currentValue: priceUsd,
    });
  }
  
  if (priceUsd > 10000) {
    warnings.push({
      field: 'price',
      code: 'INVALID_PRICE',
      message: `価格$${priceUsd}は高額です。確認してください。`,
      currentValue: priceUsd,
    });
  }
}

function validateCondition(
  product: ProductForEbaymagValidation,
  blockingIssues: EbaymagIssue[],
  warnings: EbaymagIssue[]
): void {
  const condition = product.listing_data?.condition || product.condition;
  const conditionId = product.listing_data?.condition_id;
  
  if (!condition && !conditionId) {
    blockingIssues.push({
      field: 'condition',
      code: 'MISSING_CONDITION',
      message: 'コンディションが設定されていません。',
      requiredValue: 'New / Used / Refurbished など',
    });
  }
}

function validateCategory(
  product: ProductForEbaymagValidation,
  blockingIssues: EbaymagIssue[],
  warnings: EbaymagIssue[]
): void {
  const categoryId = product.ebay_category_id || product.category_id;
  
  if (!categoryId) {
    blockingIssues.push({
      field: 'category',
      code: 'MISSING_CATEGORY',
      message: 'eBayカテゴリーIDが設定されていません。',
    });
  }
}

function validateTitle(
  product: ProductForEbaymagValidation,
  blockingIssues: EbaymagIssue[],
  warnings: EbaymagIssue[]
): void {
  const title = product.english_title || product.title;
  
  if (!title || title.trim() === '') {
    blockingIssues.push({
      field: 'title',
      code: 'MISSING_TITLE',
      message: 'タイトルが設定されていません。',
    });
    return;
  }
  
  if (title.length < 10) {
    warnings.push({
      field: 'title',
      code: 'MISSING_TITLE',
      message: `タイトルが短すぎます（${title.length}文字）。10文字以上を推奨。`,
      currentValue: title,
    });
  }
  
  if (title.length > 80) {
    warnings.push({
      field: 'title',
      code: 'MISSING_TITLE',
      message: `タイトルが長すぎます（${title.length}文字）。80文字以内を推奨。`,
      currentValue: title,
    });
  }
}

function validateImages(
  product: ProductForEbaymagValidation,
  blockingIssues: EbaymagIssue[],
  warnings: EbaymagIssue[]
): void {
  if (!product.primary_image_url) {
    blockingIssues.push({
      field: 'images',
      code: 'MISSING_IMAGES',
      message: 'メイン画像が設定されていません。',
    });
  }
}

function validateItemSpecificsForEbaymag(
  product: ProductForEbaymagValidation,
  blockingIssues: EbaymagIssue[],
  warnings: EbaymagIssue[],
  autoFixSuggestions: AutoFixSuggestion[]
): void {
  const itemSpecifics = product.listing_data?.item_specifics || {};
  const categoryId = product.ebay_category_id || product.category_id || 'default';
  
  const requiredFields = EBAYMAG_CATEGORY_ITEM_SPECIFICS[categoryId] 
    || EBAYMAG_CATEGORY_ITEM_SPECIFICS.default;
  
  const missingFields: string[] = [];
  for (const field of requiredFields) {
    const value = itemSpecifics[field];
    if (!value || value.trim() === '') {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    warnings.push({
      field: 'item_specifics',
      code: 'MISSING_ITEM_SPECIFICS',
      message: `推奨Item Specificsが未設定: ${missingFields.join(', ')}`,
      currentValue: Object.keys(itemSpecifics),
      requiredValue: requiredFields.join(', '),
    });
    
    autoFixSuggestions.push({
      field: 'item_specifics',
      action: 'ai_estimate',
      suggestedValue: missingFields,
      confidence: 'medium',
    });
  }
  
  // Brandは特に重要
  if (!itemSpecifics['Brand']) {
    warnings.push({
      field: 'item_specifics.Brand',
      code: 'MISSING_ITEM_SPECIFICS',
      message: 'Brandが未設定です。「Unbranded」を設定することを推奨。',
    });
    autoFixSuggestions.push({
      field: 'item_specifics.Brand',
      action: 'default_value',
      suggestedValue: 'Unbranded',
      confidence: 'high',
    });
  }
}

// ============================================================
// スコア計算
// ============================================================

function calculateSyncReadinessScore(
  blockingIssues: EbaymagIssue[],
  warnings: EbaymagIssue[]
): number {
  let score = 100;
  
  // ブロッキングイシュー（重大）
  score -= blockingIssues.length * 20;
  
  // 警告（軽微）
  score -= warnings.length * 5;
  
  return Math.max(0, Math.min(100, score));
}

// ============================================================
// 一括検証
// ============================================================

/**
 * 複数商品のeBaymag同期バリデーション
 */
export function bulkValidateForEbaymag(
  products: ProductForEbaymagValidation[]
): Map<string | number, EbaymagValidationResult> {
  const results = new Map<string | number, EbaymagValidationResult>();
  
  for (const product of products) {
    results.set(product.id, validateForEbaymagSync(product));
  }
  
  return results;
}

/**
 * eBaymag同期可能な商品をフィルタリング
 */
export function filterSyncableProducts(
  products: ProductForEbaymagValidation[]
): {
  syncable: ProductForEbaymagValidation[];
  blocked: Array<{ product: ProductForEbaymagValidation; reasons: string[] }>;
  warnings: Array<{ product: ProductForEbaymagValidation; warnings: string[] }>;
} {
  const syncable: ProductForEbaymagValidation[] = [];
  const blocked: Array<{ product: ProductForEbaymagValidation; reasons: string[] }> = [];
  const warningsList: Array<{ product: ProductForEbaymagValidation; warnings: string[] }> = [];
  
  for (const product of products) {
    const result = validateForEbaymagSync(product);
    
    if (result.canSync) {
      syncable.push(product);
      
      if (result.warnings.length > 0) {
        warningsList.push({
          product,
          warnings: result.warnings.map(w => w.message),
        });
      }
    } else {
      blocked.push({
        product,
        reasons: result.blockingIssues.map(i => i.message),
      });
    }
  }
  
  return { syncable, blocked, warnings: warningsList };
}

/**
 * 出品JSON送信前の最終バリデーション
 * n8nに投げる直前に呼び出す
 */
export function validateBeforeN8nSubmission(
  product: ProductForEbaymagValidation
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const result = validateForEbaymagSync(product);
  
  return {
    isValid: result.canSync,
    errors: result.blockingIssues.map(i => `[${i.code}] ${i.message}`),
    warnings: result.warnings.map(w => `[${w.code}] ${w.message}`),
  };
}
