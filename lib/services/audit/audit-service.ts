// lib/services/audit/audit-service.ts
/**
 * N3出品監査サービス - 3層フィルターアーキテクチャ
 * 
 * 【設計原則】
 * - 第1層：ルールエンジン（無料/即時）- 正規表現による矛盾検知
 * - 第2層：差分抽出（コスト最適化）- AI送信データの最小化
 * - 第3層：JSONパッチ（確実性）- ユーザー選択による反映
 * 
 * 【目的】
 * - HTSコード、原産国、素材の精度向上
 * - AIコストの最小化（80%以上をルールエンジンで処理）
 * - データの信頼性（エビデンス）の確保
 * 
 * 【Phase 1強化】
 * - トレカ特化ルール追加
 * - ブランド→原産国自動紐付け
 * - カテゴリベースのHTS自動推定
 */

import type { Product, ProductId } from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

/** 監査結果の重大度 */
export type AuditSeverity = 'error' | 'warning' | 'info' | 'ok';

/** 監査ルールID */
export type AuditRuleId = 
  | 'origin_mismatch'           // 原産国矛盾
  | 'hts_missing'               // HTSコード未設定
  | 'hts_high_duty'             // 高関税（5%超）
  | 'hts_auto_suggested'        // HTS自動推定可能
  | 'material_high_risk'        // 高リスク素材
  | 'material_auto_detected'    // 素材自動検出
  | 'weight_missing'            // 重量未設定
  | 'profit_low'                // 低利益率
  | 'profit_negative'           // 赤字
  | 'condition_mismatch'        // コンディション矛盾
  | 'battery_risk'              // リチウム電池リスク
  | 'vero_brand'                // VEROブランド
  | 'title_origin_conflict'     // タイトルと原産国の不整合
  | 'brand_origin_suggested'    // ブランドから原産国推定
  | 'category_hts_suggested'    // カテゴリからHTS推定
  | 'trading_card_detected';    // トレカ検出

/** 単一の監査結果 */
export interface AuditResult {
  ruleId: AuditRuleId;
  severity: AuditSeverity;
  field: string;
  currentValue: string | number | null;
  expectedValue?: string | number | null;
  message: string;
  messageJa: string;
  suggestion?: string;
  autoFixable: boolean;
}

/** 商品の監査レポート */
export interface ProductAuditReport {
  productId: ProductId;
  timestamp: string;
  overallSeverity: AuditSeverity;
  score: number;  // 0-100 (100が完璧)
  results: AuditResult[];
  needsAiReview: boolean;
  aiReviewFields: string[];
  autoFixSuggestions: AutoFixSuggestion[];
}

/** 自動修正提案 */
export interface AutoFixSuggestion {
  field: string;
  currentValue: string | number | null;
  suggestedValue: string | number;
  confidence: number;
  reason: string;
  ruleId: AuditRuleId;
}

/** データ出所（Provenance） */
export interface DataProvenance {
  source: 'manual' | 'ai_fixed' | 'rule_auto' | 'scraped' | 'api';
  model?: string;
  updatedAt: string;
  updatedBy?: string;
  confidence?: number;
}

/** 商品のProvenance情報 */
export interface ProductProvenance {
  hts_code?: DataProvenance;
  origin_country?: DataProvenance;
  material?: DataProvenance;
  weight?: DataProvenance;
  condition?: DataProvenance;
  [key: string]: DataProvenance | undefined;
}

/** AI差分パッチ */
export interface AiPatch {
  field: string;
  currentValue: string | number | null;
  suggestedValue: string | number | null;
  confidence: number;
  reason: string;
  selected: boolean;
}

/** AI監査リクエスト（最小データ） */
export interface AiAuditRequest {
  productId: ProductId;
  title: string;
  category?: string;
  currentHts?: string;
  currentOrigin?: string;
  currentMaterial?: string;
  auditIssues: AuditRuleId[];
}

/** AI監査レスポンス */
export interface AiAuditResponse {
  productId: ProductId;
  patches: AiPatch[];
  auditNote: string;
}

// ============================================================
// 定数：原産国キーワード
// ============================================================

/** 原産国を示すキーワード（優先度順） */
const ORIGIN_KEYWORDS: Record<string, string[]> = {
  'JP': ['japan', 'japanese', '日本', '日本製', 'made in japan', 'nippon', 'nihon', 'jdm'],
  'CN': ['china', 'chinese', '中国', '中国製', 'made in china', 'prc'],
  'KR': ['korea', 'korean', '韓国', '韓国製', 'made in korea', 'rok', 'hangul'],
  'TW': ['taiwan', 'taiwanese', '台湾', '台湾製', 'made in taiwan', 'roc'],
  'US': ['usa', 'american', 'united states', 'アメリカ', 'made in usa', 'made in u.s.a'],
  'DE': ['germany', 'german', 'deutschland', 'ドイツ', 'made in germany'],
  'GB': ['uk', 'british', 'england', 'イギリス', 'made in uk', 'made in britain'],
  'FR': ['france', 'french', 'フランス', 'made in france'],
  'IT': ['italy', 'italian', 'イタリア', 'made in italy'],
  'CH': ['switzerland', 'swiss', 'スイス', 'made in switzerland'],
};

// ============================================================
// 定数：ブランド→原産国マッピング（Phase 1強化）
// ============================================================

/** 有名ブランド→原産国（本社所在地）マッピング */
const BRAND_ORIGIN_MAP: Record<string, { country: string; confidence: number }> = {
  // 日本ブランド
  'canon': { country: 'JP', confidence: 0.9 },
  'sony': { country: 'JP', confidence: 0.9 },
  'nikon': { country: 'JP', confidence: 0.9 },
  'fujifilm': { country: 'JP', confidence: 0.9 },
  'panasonic': { country: 'JP', confidence: 0.9 },
  'olympus': { country: 'JP', confidence: 0.9 },
  'pentax': { country: 'JP', confidence: 0.9 },
  'ricoh': { country: 'JP', confidence: 0.9 },
  'tamron': { country: 'JP', confidence: 0.85 },
  'sigma': { country: 'JP', confidence: 0.85 },
  'tokina': { country: 'JP', confidence: 0.85 },
  'toyota': { country: 'JP', confidence: 0.95 },
  'honda': { country: 'JP', confidence: 0.95 },
  'yamaha': { country: 'JP', confidence: 0.9 },
  'seiko': { country: 'JP', confidence: 0.95 },
  'casio': { country: 'JP', confidence: 0.9 },
  'citizen': { country: 'JP', confidence: 0.9 },
  'orient': { country: 'JP', confidence: 0.9 },
  'bandai': { country: 'JP', confidence: 0.9 },
  'takara': { country: 'JP', confidence: 0.9 },
  'takaratomy': { country: 'JP', confidence: 0.9 },
  'nintendo': { country: 'JP', confidence: 0.95 },
  'konami': { country: 'JP', confidence: 0.9 },
  'pokemon': { country: 'JP', confidence: 0.95 },
  'sanrio': { country: 'JP', confidence: 0.95 },
  'uniqlo': { country: 'JP', confidence: 0.85 },
  
  // 韓国ブランド
  'samsung': { country: 'KR', confidence: 0.9 },
  'lg': { country: 'KR', confidence: 0.9 },
  'hyundai': { country: 'KR', confidence: 0.9 },
  'kia': { country: 'KR', confidence: 0.9 },
  
  // ドイツブランド
  'leica': { country: 'DE', confidence: 0.95 },
  'zeiss': { country: 'DE', confidence: 0.95 },
  'mercedes': { country: 'DE', confidence: 0.95 },
  'bmw': { country: 'DE', confidence: 0.95 },
  'porsche': { country: 'DE', confidence: 0.95 },
  'audi': { country: 'DE', confidence: 0.95 },
  'volkswagen': { country: 'DE', confidence: 0.95 },
  'braun': { country: 'DE', confidence: 0.9 },
  
  // スイスブランド（時計）
  'rolex': { country: 'CH', confidence: 0.98 },
  'omega': { country: 'CH', confidence: 0.98 },
  'tag heuer': { country: 'CH', confidence: 0.95 },
  'tissot': { country: 'CH', confidence: 0.95 },
  'swatch': { country: 'CH', confidence: 0.95 },
  'patek philippe': { country: 'CH', confidence: 0.98 },
  'audemars piguet': { country: 'CH', confidence: 0.98 },
  
  // アメリカブランド
  'apple': { country: 'US', confidence: 0.9 },
  'microsoft': { country: 'US', confidence: 0.9 },
  'google': { country: 'US', confidence: 0.9 },
  'gopro': { country: 'US', confidence: 0.9 },
  'ford': { country: 'US', confidence: 0.95 },
  'chevrolet': { country: 'US', confidence: 0.95 },
  'harley davidson': { country: 'US', confidence: 0.95 },
  
  // 中国ブランド
  'dji': { country: 'CN', confidence: 0.95 },
  'huawei': { country: 'CN', confidence: 0.95 },
  'xiaomi': { country: 'CN', confidence: 0.95 },
  'oppo': { country: 'CN', confidence: 0.95 },
  'vivo': { country: 'CN', confidence: 0.95 },
  'lenovo': { country: 'CN', confidence: 0.9 },
};

// ============================================================
// 定数：カテゴリ→HTS自動推定（Phase 1強化）
// ============================================================

/** トレカ関連カテゴリID */
const TRADING_CARD_CATEGORY_IDS = [
  '183454',  // CCG Individual Cards
  '183456',  // CCG Sealed Products
  '212',     // Trading Cards
  '2536',    // Non-Sport Trading Cards
  '213',     // Sports Trading Cards
];

/** カテゴリ→HTS・素材の自動推定 */
const CATEGORY_HTS_MAP: Record<string, { hts: string; material: string; confidence: number; description: string }> = {
  // トレカ
  '183454': { hts: '9504.40.00', material: 'Cardstock/Paper', confidence: 0.95, description: 'Trading Cards (CCG)' },
  '183456': { hts: '9504.40.00', material: 'Cardstock/Paper', confidence: 0.95, description: 'CCG Sealed Products' },
  '212': { hts: '9504.40.00', material: 'Cardstock/Paper', confidence: 0.9, description: 'Trading Cards' },
  
  // カメラ
  '31388': { hts: '9006.53.00', material: 'Electronics', confidence: 0.85, description: 'Digital Cameras' },
  '625': { hts: '9006.59.00', material: 'Electronics', confidence: 0.8, description: 'Camera Equipment' },
  
  // 時計
  '31387': { hts: '9102.11.00', material: 'Metal/Leather', confidence: 0.8, description: 'Wristwatches' },
  
  // おもちゃ・フィギュア
  '220': { hts: '9503.00.00', material: 'Plastic', confidence: 0.85, description: 'Action Figures' },
  '2624': { hts: '9503.00.00', material: 'Plastic', confidence: 0.85, description: 'Toys & Hobbies' },
  
  // ゲーム
  '139973': { hts: '9504.50.00', material: 'Electronics', confidence: 0.85, description: 'Video Games' },
};

// ============================================================
// 定数：素材キーワード
// ============================================================

/** 高関税素材キーワード */
const HIGH_DUTY_MATERIALS: Record<string, { keywords: string[]; dutyRisk: number }> = {
  'leather': { 
    keywords: ['leather', 'レザー', '革', '本革', 'genuine leather', 'full grain', 'calfskin', 'cowhide'],
    dutyRisk: 0.15
  },
  'silk': { 
    keywords: ['silk', 'シルク', '絹', '100% silk', 'pure silk'],
    dutyRisk: 0.12
  },
  'wool': { 
    keywords: ['wool', 'ウール', '羊毛', 'merino', 'cashmere', 'カシミヤ', 'angora'],
    dutyRisk: 0.10
  },
  'cotton': { 
    keywords: ['cotton', 'コットン', '綿', '100% cotton'],
    dutyRisk: 0.05
  },
  'linen': {
    keywords: ['linen', 'リネン', '麻'],
    dutyRisk: 0.06
  },
};

/** 低リスク素材（自動設定用） */
const LOW_RISK_MATERIALS: Record<string, string[]> = {
  'Cardstock/Paper': ['card', 'cards', 'カード', 'trading card', 'tcg', 'ccg', 'pokemon card', 'yugioh', 'magic the gathering'],
  'Plastic': ['plastic', 'プラスチック', 'pvc', 'abs', 'figure', 'figurine', 'toy'],
  'Electronics': ['electronic', 'digital', 'camera', 'watch', 'phone', 'tablet'],
  'Metal': ['metal', 'steel', 'aluminum', 'brass', 'copper', 'silver', 'gold'],
};

// ============================================================
// 定数：リチウム電池リスク
// ============================================================

/** リチウム電池を含む可能性が高いカテゴリ・キーワード */
const BATTERY_RISK_CATEGORIES = [
  'cameras', 'digital cameras', 'カメラ', 'デジカメ',
  'smartphones', 'mobile phones', 'スマートフォン', 'スマホ',
  'laptops', 'notebooks', 'ノートパソコン', 'ノートPC',
  'tablets', 'タブレット', 'ipad',
  'watches', 'smartwatches', '時計', 'スマートウォッチ', 'apple watch',
  'drones', 'ドローン', 'quadcopter',
  'power banks', 'モバイルバッテリー', 'portable charger',
  'electric', '電動', 'wireless', 'bluetooth',
  'gopro', 'action camera',
];

// ============================================================
// 定数：閾値
// ============================================================

const HIGH_DUTY_THRESHOLD = 0.05;  // 5%
const LOW_PROFIT_THRESHOLD = 0.15;  // 15%
const NEGATIVE_PROFIT_THRESHOLD = 0;  // 0%

// ============================================================
// 第1層：ルールエンジン（無料/即時）
// ============================================================

/**
 * タイトルから原産国を推定
 */
export function detectOriginFromTitle(title: string): { country: string | null; confidence: number; method: string } {
  const titleLower = title.toLowerCase();
  
  // 1. "Made in X" パターン（最高信頼度）
  for (const [countryCode, keywords] of Object.entries(ORIGIN_KEYWORDS)) {
    for (const keyword of keywords) {
      if (titleLower.includes(`made in ${keyword.toLowerCase()}`)) {
        return { country: countryCode, confidence: 0.95, method: 'title_explicit' };
      }
    }
  }
  
  // 2. 単純なキーワードマッチ
  for (const [countryCode, keywords] of Object.entries(ORIGIN_KEYWORDS)) {
    for (const keyword of keywords) {
      if (titleLower.includes(keyword.toLowerCase())) {
        return { country: countryCode, confidence: 0.7, method: 'title_keyword' };
      }
    }
  }
  
  return { country: null, confidence: 0, method: 'none' };
}

/**
 * ブランドから原産国を推定（Phase 1強化）
 */
export function detectOriginFromBrand(title: string): { country: string | null; confidence: number; brand: string | null } {
  const titleLower = title.toLowerCase();
  
  for (const [brand, info] of Object.entries(BRAND_ORIGIN_MAP)) {
    // ブランド名の前後に単語境界があるか確認（部分一致を避ける）
    const brandPattern = new RegExp(`\\b${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (brandPattern.test(titleLower)) {
      return { country: info.country, confidence: info.confidence, brand };
    }
  }
  
  return { country: null, confidence: 0, brand: null };
}

/**
 * タイトル/説明文から素材を検出
 */
export function detectMaterialFromText(text: string): { material: string | null; dutyRisk: number; isHighRisk: boolean } {
  const textLower = text.toLowerCase();
  
  // 1. 高リスク素材チェック
  for (const [material, { keywords, dutyRisk }] of Object.entries(HIGH_DUTY_MATERIALS)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        return { material, dutyRisk, isHighRisk: dutyRisk > HIGH_DUTY_THRESHOLD };
      }
    }
  }
  
  // 2. 低リスク素材チェック（自動設定用）
  for (const [material, keywords] of Object.entries(LOW_RISK_MATERIALS)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        return { material, dutyRisk: 0, isHighRisk: false };
      }
    }
  }
  
  return { material: null, dutyRisk: 0, isHighRisk: false };
}

/**
 * カテゴリからHTS・素材を推定（Phase 1強化）
 */
export function detectFromCategory(categoryId: string | null): { hts: string | null; material: string | null; confidence: number; description: string | null } {
  if (!categoryId) {
    return { hts: null, material: null, confidence: 0, description: null };
  }
  
  const mapping = CATEGORY_HTS_MAP[categoryId];
  if (mapping) {
    return {
      hts: mapping.hts,
      material: mapping.material,
      confidence: mapping.confidence,
      description: mapping.description,
    };
  }
  
  return { hts: null, material: null, confidence: 0, description: null };
}

/**
 * トレカかどうかを判定（Phase 1強化）
 */
export function isTradingCard(title: string, categoryId: string | null): boolean {
  // カテゴリIDでの判定
  if (categoryId && TRADING_CARD_CATEGORY_IDS.includes(categoryId)) {
    return true;
  }
  
  // タイトルキーワードでの判定
  const titleLower = title.toLowerCase();
  const tradingCardKeywords = [
    'pokemon card', 'ポケモンカード', 'ポケカ',
    'yugioh', '遊戯王', 'yu-gi-oh',
    'magic the gathering', 'mtg',
    'one piece card', 'ワンピースカード',
    'trading card', 'tcg', 'ccg',
    'weiss schwarz', 'ヴァイスシュヴァルツ',
    'cardfight vanguard', 'ヴァンガード',
  ];
  
  return tradingCardKeywords.some(keyword => titleLower.includes(keyword));
}

/**
 * リチウム電池リスクを検出
 */
export function detectBatteryRisk(title: string, category?: string): boolean {
  const textToCheck = `${title} ${category || ''}`.toLowerCase();
  
  // バッテリー関連キーワード
  const batteryKeywords = ['battery', 'lithium', 'li-ion', 'lipo', 'rechargeable', '充電', 'バッテリー', 'リチウム'];
  for (const keyword of batteryKeywords) {
    if (textToCheck.includes(keyword)) {
      return true;
    }
  }
  
  // カテゴリ/キーワードベースの判定
  for (const riskCategory of BATTERY_RISK_CATEGORIES) {
    if (textToCheck.includes(riskCategory.toLowerCase())) {
      return true;
    }
  }
  
  return false;
}

/**
 * 単一商品の監査を実行（第1層：ルールエンジン）
 */
export function auditProduct(product: Product): ProductAuditReport {
  const results: AuditResult[] = [];
  const aiReviewFields: string[] = [];
  const autoFixSuggestions: AutoFixSuggestion[] = [];
  const timestamp = new Date().toISOString();
  
  const title = product.title || '';
  const categoryId = product.category_id || product.ebay_category_id || null;
  
  // ----------------------------------------
  // 0. トレカ検出（Phase 1強化）
  // ----------------------------------------
  const isTcg = isTradingCard(title, categoryId);
  if (isTcg) {
    results.push({
      ruleId: 'trading_card_detected',
      severity: 'info',
      field: 'category',
      currentValue: categoryId,
      message: 'Trading card detected - auto-suggestion available',
      messageJa: 'トレカを検出しました - 自動設定が利用可能です',
      autoFixable: true,
    });
    
    // HTSとMaterialの自動提案
    if (!product.hts_code) {
      autoFixSuggestions.push({
        field: 'hts_code',
        currentValue: null,
        suggestedValue: '9504.40.00',
        confidence: 0.95,
        reason: 'Trading cards are classified under HTS 9504.40',
        ruleId: 'trading_card_detected',
      });
    }
    if (!product.material) {
      autoFixSuggestions.push({
        field: 'material',
        currentValue: null,
        suggestedValue: 'Cardstock/Paper',
        confidence: 0.95,
        reason: 'Trading cards are made of cardstock/paper',
        ruleId: 'trading_card_detected',
      });
    }
  }
  
  // ----------------------------------------
  // 1. 原産国チェック
  // ----------------------------------------
  const titleOrigin = detectOriginFromTitle(title);
  const brandOrigin = detectOriginFromBrand(title);
  const currentOrigin = product.origin_country?.toUpperCase();
  
  // ブランドから原産国推定（Phase 1強化）
  if (brandOrigin.country && !currentOrigin) {
    results.push({
      ruleId: 'brand_origin_suggested',
      severity: 'info',
      field: 'origin_country',
      currentValue: null,
      expectedValue: brandOrigin.country,
      message: `Brand "${brandOrigin.brand}" suggests origin "${brandOrigin.country}"`,
      messageJa: `ブランド「${brandOrigin.brand}」から原産国「${brandOrigin.country}」を推定`,
      suggestion: `Set origin_country to "${brandOrigin.country}"`,
      autoFixable: brandOrigin.confidence >= 0.85,
    });
    
    if (brandOrigin.confidence >= 0.85) {
      autoFixSuggestions.push({
        field: 'origin_country',
        currentValue: null,
        suggestedValue: brandOrigin.country,
        confidence: brandOrigin.confidence,
        reason: `Brand "${brandOrigin.brand}" is headquartered in ${brandOrigin.country}`,
        ruleId: 'brand_origin_suggested',
      });
    }
  }
  
  // タイトルと設定の矛盾チェック
  if (titleOrigin.country && currentOrigin && titleOrigin.country !== currentOrigin) {
    results.push({
      ruleId: 'origin_mismatch',
      severity: 'warning',
      field: 'origin_country',
      currentValue: currentOrigin,
      expectedValue: titleOrigin.country,
      message: `Title suggests origin "${titleOrigin.country}" but data shows "${currentOrigin}"`,
      messageJa: `タイトルは「${titleOrigin.country}」を示唆していますが、設定は「${currentOrigin}」です`,
      suggestion: `Change origin_country to "${titleOrigin.country}"`,
      autoFixable: titleOrigin.confidence >= 0.9,
    });
  }
  
  if (!currentOrigin && titleOrigin.country) {
    results.push({
      ruleId: 'title_origin_conflict',
      severity: 'info',
      field: 'origin_country',
      currentValue: null,
      expectedValue: titleOrigin.country,
      message: `Origin country not set but title suggests "${titleOrigin.country}"`,
      messageJa: `原産国が未設定ですが、タイトルは「${titleOrigin.country}」を示唆しています`,
      suggestion: `Set origin_country to "${titleOrigin.country}"`,
      autoFixable: titleOrigin.confidence >= 0.9,
    });
    
    if (titleOrigin.confidence >= 0.9) {
      autoFixSuggestions.push({
        field: 'origin_country',
        currentValue: null,
        suggestedValue: titleOrigin.country,
        confidence: titleOrigin.confidence,
        reason: `Title contains "${titleOrigin.method}" pattern`,
        ruleId: 'title_origin_conflict',
      });
    }
  }
  
  // ----------------------------------------
  // 2. HTSコードチェック
  // ----------------------------------------
  const categoryHts = detectFromCategory(categoryId);
  
  if (!product.hts_code) {
    if (categoryHts.hts) {
      // カテゴリから推定可能
      results.push({
        ruleId: 'category_hts_suggested',
        severity: 'info',
        field: 'hts_code',
        currentValue: null,
        expectedValue: categoryHts.hts,
        message: `HTS "${categoryHts.hts}" suggested based on category (${categoryHts.description})`,
        messageJa: `カテゴリ（${categoryHts.description}）からHTS「${categoryHts.hts}」を推定`,
        suggestion: `Set hts_code to "${categoryHts.hts}"`,
        autoFixable: categoryHts.confidence >= 0.85,
      });
      
      if (categoryHts.confidence >= 0.85) {
        autoFixSuggestions.push({
          field: 'hts_code',
          currentValue: null,
          suggestedValue: categoryHts.hts,
          confidence: categoryHts.confidence,
          reason: `Category "${categoryHts.description}" maps to HTS ${categoryHts.hts}`,
          ruleId: 'category_hts_suggested',
        });
      }
    } else {
      // 推定不可 → AI必要
      results.push({
        ruleId: 'hts_missing',
        severity: 'error',
        field: 'hts_code',
        currentValue: null,
        message: 'HTS code is not set and cannot be auto-determined',
        messageJa: 'HTSコードが未設定で、自動推定もできません',
        autoFixable: false,
      });
      aiReviewFields.push('hts_code');
    }
  }
  
  // 高関税チェック
  const dutyRate = product.hts_duty_rate || product.duty_rate || 0;
  if (dutyRate > HIGH_DUTY_THRESHOLD) {
    results.push({
      ruleId: 'hts_high_duty',
      severity: 'warning',
      field: 'hts_duty_rate',
      currentValue: dutyRate,
      message: `High duty rate: ${(dutyRate * 100).toFixed(1)}% (threshold: ${HIGH_DUTY_THRESHOLD * 100}%)`,
      messageJa: `高関税: ${(dutyRate * 100).toFixed(1)}%（閾値: ${HIGH_DUTY_THRESHOLD * 100}%）`,
      autoFixable: false,
    });
  }
  
  // ----------------------------------------
  // 3. 素材チェック
  // ----------------------------------------
  const materialDetected = detectMaterialFromText(title);
  
  if (materialDetected.material && !product.material) {
    const severity = materialDetected.isHighRisk ? 'warning' : 'info';
    results.push({
      ruleId: materialDetected.isHighRisk ? 'material_high_risk' : 'material_auto_detected',
      severity,
      field: 'material',
      currentValue: null,
      expectedValue: materialDetected.material,
      message: `Material "${materialDetected.material}" detected in title${materialDetected.isHighRisk ? ' (high duty risk)' : ''}`,
      messageJa: `素材「${materialDetected.material}」をタイトルから検出${materialDetected.isHighRisk ? '（高関税リスク）' : ''}`,
      suggestion: `Set material to "${materialDetected.material}"`,
      autoFixable: !materialDetected.isHighRisk,
    });
    
    if (!materialDetected.isHighRisk) {
      autoFixSuggestions.push({
        field: 'material',
        currentValue: null,
        suggestedValue: materialDetected.material,
        confidence: 0.8,
        reason: `Title contains material keyword`,
        ruleId: 'material_auto_detected',
      });
    }
  } else if (!product.material && categoryHts.material) {
    // カテゴリから素材を推定
    autoFixSuggestions.push({
      field: 'material',
      currentValue: null,
      suggestedValue: categoryHts.material,
      confidence: categoryHts.confidence,
      reason: `Category suggests material "${categoryHts.material}"`,
      ruleId: 'category_hts_suggested',
    });
  }
  
  if (materialDetected.isHighRisk) {
    results.push({
      ruleId: 'material_high_risk',
      severity: 'warning',
      field: 'material',
      currentValue: materialDetected.material,
      message: `Material "${materialDetected.material}" has high duty risk: ${(materialDetected.dutyRisk * 100).toFixed(0)}%`,
      messageJa: `素材「${materialDetected.material}」は高関税リスクがあります: ${(materialDetected.dutyRisk * 100).toFixed(0)}%`,
      autoFixable: false,
    });
  }
  
  // ----------------------------------------
  // 4. 重量チェック
  // ----------------------------------------
  const weight = product.listing_data?.weight_g;
  if (!weight || weight <= 0) {
    results.push({
      ruleId: 'weight_missing',
      severity: 'warning',
      field: 'weight_g',
      currentValue: weight || null,
      message: 'Weight is not set (required for shipping calculation)',
      messageJa: '重量が未設定です（送料計算に必要）',
      autoFixable: false,
    });
    aiReviewFields.push('weight_g');
  }
  
  // ----------------------------------------
  // 5. 利益率チェック
  // ----------------------------------------
  const profitMargin = product.profit_margin || product.listing_data?.ddu_profit_margin || 0;
  
  if (profitMargin < NEGATIVE_PROFIT_THRESHOLD) {
    results.push({
      ruleId: 'profit_negative',
      severity: 'error',
      field: 'profit_margin',
      currentValue: profitMargin,
      message: `Negative profit: ${(profitMargin * 100).toFixed(1)}%`,
      messageJa: `赤字: ${(profitMargin * 100).toFixed(1)}%`,
      autoFixable: false,
    });
  } else if (profitMargin > 0 && profitMargin < LOW_PROFIT_THRESHOLD) {
    results.push({
      ruleId: 'profit_low',
      severity: 'warning',
      field: 'profit_margin',
      currentValue: profitMargin,
      message: `Low profit margin: ${(profitMargin * 100).toFixed(1)}% (threshold: ${LOW_PROFIT_THRESHOLD * 100}%)`,
      messageJa: `低利益率: ${(profitMargin * 100).toFixed(1)}%（閾値: ${LOW_PROFIT_THRESHOLD * 100}%）`,
      autoFixable: false,
    });
  }
  
  // ----------------------------------------
  // 6. リチウム電池リスク
  // ----------------------------------------
  const hasBatteryRisk = detectBatteryRisk(title, product.category_name || product.category);
  if (hasBatteryRisk) {
    results.push({
      ruleId: 'battery_risk',
      severity: 'info',
      field: 'battery',
      currentValue: null,
      message: 'Product may contain lithium battery (shipping restrictions may apply)',
      messageJa: 'リチウム電池を含む可能性があります（配送制限の可能性）',
      autoFixable: false,
    });
  }
  
  // ----------------------------------------
  // 7. VEROブランドチェック
  // ----------------------------------------
  if (product.is_vero_brand) {
    results.push({
      ruleId: 'vero_brand',
      severity: 'warning',
      field: 'vero_brand',
      currentValue: product.vero_brand_name || 'Unknown',
      message: `VERO brand detected: ${product.vero_brand_name || 'Unknown'}`,
      messageJa: `VEROブランド検出: ${product.vero_brand_name || '不明'}`,
      autoFixable: false,
    });
  }
  
  // ----------------------------------------
  // 総合スコア計算
  // ----------------------------------------
  const errorCount = results.filter(r => r.severity === 'error').length;
  const warningCount = results.filter(r => r.severity === 'warning').length;
  const infoCount = results.filter(r => r.severity === 'info').length;
  
  // スコア: 100から減点方式
  const score = Math.max(0, 100 - (errorCount * 30) - (warningCount * 10) - (infoCount * 2));
  
  // 総合重大度
  let overallSeverity: AuditSeverity = 'ok';
  if (errorCount > 0) {
    overallSeverity = 'error';
  } else if (warningCount > 0) {
    overallSeverity = 'warning';
  } else if (infoCount > 0) {
    overallSeverity = 'info';
  }
  
  return {
    productId: product.id,
    timestamp,
    overallSeverity,
    score,
    results,
    needsAiReview: aiReviewFields.length > 0 || errorCount > 0,
    aiReviewFields,
    autoFixSuggestions,
  };
}

/**
 * 複数商品の一括監査
 */
export function auditProducts(products: Product[]): ProductAuditReport[] {
  return products.map(auditProduct);
}

// ============================================================
// 第2層：差分抽出（AI送信データの最小化）
// ============================================================

/**
 * AI監査が必要な商品のみを抽出し、最小限のデータを構成
 */
export function extractForAiReview(
  products: Product[],
  auditReports: ProductAuditReport[]
): AiAuditRequest[] {
  const requests: AiAuditRequest[] = [];
  
  for (const report of auditReports) {
    if (!report.needsAiReview) continue;
    
    const product = products.find(p => p.id === report.productId);
    if (!product) continue;
    
    // 最小限のデータのみ抽出
    requests.push({
      productId: product.id,
      title: product.title || '',
      category: product.category_name || product.category || undefined,
      currentHts: product.hts_code || undefined,
      currentOrigin: product.origin_country || undefined,
      currentMaterial: product.material || undefined,
      auditIssues: report.results.map(r => r.ruleId),
    });
  }
  
  return requests;
}

/**
 * AI送信用のプロンプトデータを生成
 */
export function generateAiPromptData(requests: AiAuditRequest[]): string {
  const items = requests.map(req => ({
    id: req.productId,
    title: req.title,
    category: req.category,
    current: {
      hts: req.currentHts,
      origin: req.currentOrigin,
      material: req.currentMaterial,
    },
    issues: req.auditIssues,
  }));
  
  return JSON.stringify(items, null, 2);
}

// ============================================================
// 第3層：JSONパッチ（ユーザー選択による反映）
// ============================================================

/**
 * AI応答からパッチを解析
 */
export function parseAiResponse(responseJson: string): AiAuditResponse[] {
  try {
    const parsed = JSON.parse(responseJson);
    
    if (!Array.isArray(parsed)) {
      throw new Error('Response must be an array');
    }
    
    return parsed.map(item => ({
      productId: item.id || item.productId,
      patches: (item.patches || []).map((p: any) => ({
        field: p.field,
        currentValue: p.currentValue ?? null,
        suggestedValue: p.suggestedValue ?? p.suggested ?? null,
        confidence: p.confidence ?? 0.5,
        reason: p.reason || '',
        selected: false,
      })),
      auditNote: item.auditNote || item.note || '',
    }));
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return [];
  }
}

/**
 * 選択されたパッチを商品データに適用
 */
export function applySelectedPatches(
  product: Product,
  patches: AiPatch[]
): Partial<Product> {
  const updates: Partial<Product> = {};
  
  for (const patch of patches) {
    if (!patch.selected || patch.suggestedValue === null) continue;
    
    switch (patch.field) {
      case 'hts_code':
        updates.hts_code = String(patch.suggestedValue);
        break;
      case 'origin_country':
        updates.origin_country = String(patch.suggestedValue);
        break;
      case 'material':
        updates.material = String(patch.suggestedValue);
        break;
      case 'weight_g':
        if (product.listing_data) {
          updates.listing_data = {
            ...product.listing_data,
            weight_g: Number(patch.suggestedValue),
          };
        }
        break;
    }
  }
  
  return updates;
}

/**
 * 自動修正提案を適用
 */
export function applyAutoFixSuggestions(
  product: Product,
  suggestions: AutoFixSuggestion[],
  minConfidence: number = 0.85
): Partial<Product> {
  const updates: Partial<Product> = {};
  
  for (const suggestion of suggestions) {
    if (suggestion.confidence < minConfidence) continue;
    
    switch (suggestion.field) {
      case 'hts_code':
        if (!product.hts_code) {
          updates.hts_code = String(suggestion.suggestedValue);
        }
        break;
      case 'origin_country':
        if (!product.origin_country) {
          updates.origin_country = String(suggestion.suggestedValue);
        }
        break;
      case 'material':
        if (!product.material) {
          updates.material = String(suggestion.suggestedValue);
        }
        break;
    }
  }
  
  return updates;
}

// ============================================================
// ユーティリティ
// ============================================================

/**
 * 監査結果の重大度に基づく色を取得
 */
export function getAuditSeverityColor(severity: AuditSeverity): string {
  switch (severity) {
    case 'error': return '#ef4444';
    case 'warning': return '#f59e0b';
    case 'info': return '#3b82f6';
    case 'ok': return '#10b981';
    default: return '#6b7280';
  }
}

/**
 * 監査スコアに基づく色を取得
 */
export function getAuditScoreColor(score: number): string {
  if (score >= 90) return '#10b981';
  if (score >= 70) return '#f59e0b';
  if (score >= 50) return '#f97316';
  return '#ef4444';
}

/**
 * 監査結果のサマリーを生成
 */
export function generateAuditSummary(reports: ProductAuditReport[]): {
  total: number;
  errorCount: number;
  warningCount: number;
  okCount: number;
  averageScore: number;
  needsAiReview: number;
  autoFixableCount: number;
} {
  const total = reports.length;
  const errorCount = reports.filter(r => r.overallSeverity === 'error').length;
  const warningCount = reports.filter(r => r.overallSeverity === 'warning').length;
  const okCount = reports.filter(r => r.overallSeverity === 'ok').length;
  const averageScore = total > 0 
    ? Math.round(reports.reduce((sum, r) => sum + r.score, 0) / total)
    : 0;
  const needsAiReview = reports.filter(r => r.needsAiReview).length;
  const autoFixableCount = reports.filter(r => r.autoFixSuggestions.length > 0).length;
  
  return {
    total,
    errorCount,
    warningCount,
    okCount,
    averageScore,
    needsAiReview,
    autoFixableCount,
  };
}

export default {
  auditProduct,
  auditProducts,
  extractForAiReview,
  generateAiPromptData,
  parseAiResponse,
  applySelectedPatches,
  applyAutoFixSuggestions,
  detectOriginFromTitle,
  detectOriginFromBrand,
  detectMaterialFromText,
  detectFromCategory,
  detectBatteryRisk,
  isTradingCard,
  getAuditSeverityColor,
  getAuditScoreColor,
  generateAuditSummary,
};
