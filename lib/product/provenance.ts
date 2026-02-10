// lib/product/provenance.ts
/**
 * データ由来（プロバンス）の定義と判定ロジック
 * 
 * 💡 目的:
 * - データがどこから来たのかを可視化
 * - 信頼度に応じた色分け
 * - AI生成データへの警告
 */

// ============================================================
// 型定義
// ============================================================

export type ProvenanceSource = 'manual' | 'scraped' | 'internal' | 'ai';

export interface ProvenanceInfo {
  source: ProvenanceSource;
  label: string;
  labelEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  confidence: 'high' | 'medium' | 'low';
  description: string;
}

export interface FieldProvenance {
  field: string;
  value: any;
  provenance: ProvenanceInfo;
  needsReview: boolean;
  model?: string;  // AI使用時のモデル名
  updatedAt?: string;
}

// ============================================================
// プロバンス定義
// ============================================================

export const PROVENANCE_CONFIG: Record<ProvenanceSource, ProvenanceInfo> = {
  manual: {
    source: 'manual',
    label: '手動入力',
    labelEn: 'Manual',
    color: '#f97316',      // オレンジ
    bgColor: 'rgba(249, 115, 22, 0.1)',
    borderColor: 'rgba(249, 115, 22, 0.5)',
    icon: '✋',
    confidence: 'high',
    description: '人間が手動入力した確定値。最優先で信頼。',
  },
  scraped: {
    source: 'scraped',
    label: 'スクレイピング',
    labelEn: 'SM/Scraped',
    color: '#3b82f6',      // 青
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
    icon: '🔍',
    confidence: 'high',
    description: 'ヤフオク/メルカリ等の実売データから取得。信頼度高。',
  },
  internal: {
    source: 'internal',
    label: '内部計算',
    labelEn: 'Internal',
    color: '#22c55e',      // 緑
    bgColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.5)',
    icon: '⚙️',
    confidence: 'high',
    description: 'ツール内の計算やマスタデータから自動算出。信頼度高。',
  },
  ai: {
    source: 'ai',
    label: 'AI推論',
    labelEn: 'AI/Gemini',
    color: '#a855f7',      // 紫
    bgColor: 'rgba(168, 85, 247, 0.1)',
    borderColor: 'rgba(168, 85, 247, 0.5)',
    icon: '🤖',
    confidence: 'low',
    description: 'AIがタイトル等から推論した値。要確認。',
  },
};

// ============================================================
// プロバンス判定関数
// ============================================================

/**
 * 商品データからフィールドごとのプロバンスを判定
 */
export function analyzeProductProvenance(product: any): FieldProvenance[] {
  const results: FieldProvenance[] = [];
  const provenance = product.provenance || {};
  const listingData = product.listing_data || {};
  
  // HTS コード
  const htsProvenance = provenance.hts_code;
  results.push({
    field: 'hts_code',
    value: product.hts_code,
    provenance: getProvenanceInfo(htsProvenance?.source),
    needsReview: htsProvenance?.source === 'ai',
    model: htsProvenance?.model,
    updatedAt: htsProvenance?.updated_at,
  });
  
  // 原産国
  const cooProvenance = provenance.origin_country;
  results.push({
    field: 'origin_country',
    value: product.origin_country,
    provenance: getProvenanceInfo(cooProvenance?.source || 'internal'),
    needsReview: cooProvenance?.source === 'ai',
    model: cooProvenance?.model,
  });
  
  // 重量
  const weightProvenance = provenance.weight_g || listingData.weight_provenance;
  results.push({
    field: 'weight_g',
    value: listingData.weight_g || product.weight_g,
    provenance: getProvenanceInfo(weightProvenance?.source || detectWeightSource(product)),
    needsReview: weightProvenance?.source === 'ai',
    model: weightProvenance?.model,
  });
  
  // 素材
  const materialProvenance = provenance.material;
  results.push({
    field: 'material',
    value: product.material,
    provenance: getProvenanceInfo(materialProvenance?.source || 'ai'),
    needsReview: true, // 素材は常に確認推奨
    model: materialProvenance?.model,
  });
  
  // カテゴリー
  const categoryProvenance = provenance.ebay_category_id;
  results.push({
    field: 'ebay_category_id',
    value: product.ebay_category_id || listingData.ebay_category_id,
    provenance: getProvenanceInfo(categoryProvenance?.source || 'internal'),
    needsReview: categoryProvenance?.source === 'ai',
    model: categoryProvenance?.model,
  });
  
  // 送料
  const shippingProvenance = provenance.shipping_policy_id;
  results.push({
    field: 'shipping_policy_id',
    value: listingData.shipping_policy_id || listingData.usa_shipping_policy_name,
    provenance: getProvenanceInfo(shippingProvenance?.source || 'internal'),
    needsReview: false,
  });
  
  // 価格
  results.push({
    field: 'ddp_price_usd',
    value: listingData.ddp_price_usd || product.ddp_price_usd,
    provenance: PROVENANCE_CONFIG.internal,
    needsReview: false,
  });
  
  // 英語タイトル
  const titleProvenance = provenance.english_title;
  results.push({
    field: 'english_title',
    value: product.english_title || product.title_en,
    provenance: getProvenanceInfo(titleProvenance?.source || 'ai'),
    needsReview: titleProvenance?.source === 'ai',
    model: titleProvenance?.model,
  });
  
  return results;
}

/**
 * プロバンスソースからInfoを取得
 */
function getProvenanceInfo(source?: string): ProvenanceInfo {
  if (!source) return PROVENANCE_CONFIG.internal;
  
  switch (source.toLowerCase()) {
    case 'manual':
    case 'user':
      return PROVENANCE_CONFIG.manual;
    case 'scraped':
    case 'scraping':
    case 'yahoo':
    case 'mercari':
    case 'sm':
    case 'seller_mirror':
      return PROVENANCE_CONFIG.scraped;
    case 'ai':
    case 'gemini':
    case 'claude':
    case 'gpt':
      return PROVENANCE_CONFIG.ai;
    case 'internal':
    case 'calculated':
    case 'master':
    default:
      return PROVENANCE_CONFIG.internal;
  }
}

/**
 * 重量のソースを推測
 */
function detectWeightSource(product: any): ProvenanceSource {
  const listingData = product.listing_data || {};
  
  // SM分析から取得した場合
  if (product.sm_weight_g || listingData.sm_weight_g) {
    return 'scraped';
  }
  
  // AI推定の場合
  if (product.provenance?.weight_g?.model) {
    return 'ai';
  }
  
  // マスタから取得した場合
  return 'internal';
}

/**
 * AI生成データが含まれているか判定
 */
export function hasAIGeneratedData(product: any): boolean {
  const provenances = analyzeProductProvenance(product);
  return provenances.some(p => p.provenance.source === 'ai');
}

/**
 * 要確認項目を抽出
 */
export function getReviewRequiredFields(product: any): FieldProvenance[] {
  return analyzeProductProvenance(product).filter(p => p.needsReview);
}

/**
 * AI生成フィールドを抽出
 */
export function getAIGeneratedFields(product: any): FieldProvenance[] {
  return analyzeProductProvenance(product).filter(p => p.provenance.source === 'ai');
}
