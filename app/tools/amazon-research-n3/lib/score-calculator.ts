// app/tools/amazon-research-n3/lib/score-calculator.ts
/**
 * N3スコア計算ロジック - 3段階評価システム
 * 
 * 1. N3基本スコア (0-100) - PA-API/SP-APIデータのみ
 * 2. N3 Keepaスコア (0-100) - Keepa履歴データ追加
 * 3. N3 AIスコア (0-100) - AI分析データ追加
 */

import type { AmazonResearchItem, N3ScoreBreakdown, RiskFlag, RiskLevel } from '../types';

// ============================================================
// 定数
// ============================================================

// VeROリスクブランド
export const HIGH_RISK_BRANDS = [
  'Nintendo', 'Sony', 'Apple', 'Disney', 'Marvel', 'Pokemon', 'LEGO',
  'Bandai', 'Takara Tomy', 'Sanrio', 'Gucci', 'Louis Vuitton', 'Chanel',
  'Rolex', 'Nike', 'Adidas', 'Supreme', 'Hermès', 'Prada', 'Burberry',
  'Tiffany', 'Cartier', 'Dior', 'Fendi', 'Balenciaga', 'Versace',
  'ポケモン', '任天堂', 'バンダイ', 'タカラトミー', 'サンリオ',
];

// 人気カテゴリ設定
export const CATEGORY_CONFIG: Record<string, { 
  multiplier: number; 
  popularity: 'high' | 'medium' | 'low';
  avgReturnRate: number;
  seasonality: 'high' | 'medium' | 'low';
}> = {
  'おもちゃ': { multiplier: 1.2, popularity: 'high', avgReturnRate: 0.05, seasonality: 'high' },
  'Toys & Games': { multiplier: 1.2, popularity: 'high', avgReturnRate: 0.05, seasonality: 'high' },
  'ホーム＆キッチン': { multiplier: 1.1, popularity: 'high', avgReturnRate: 0.08, seasonality: 'low' },
  'Home & Kitchen': { multiplier: 1.1, popularity: 'high', avgReturnRate: 0.08, seasonality: 'low' },
  'ビューティー': { multiplier: 1.15, popularity: 'high', avgReturnRate: 0.03, seasonality: 'low' },
  'Beauty': { multiplier: 1.15, popularity: 'high', avgReturnRate: 0.03, seasonality: 'low' },
  'ペット用品': { multiplier: 1.1, popularity: 'high', avgReturnRate: 0.04, seasonality: 'low' },
  'Pet Supplies': { multiplier: 1.1, popularity: 'high', avgReturnRate: 0.04, seasonality: 'low' },
  'DIY・工具': { multiplier: 1.05, popularity: 'medium', avgReturnRate: 0.06, seasonality: 'low' },
  'Tools & Home Improvement': { multiplier: 1.05, popularity: 'medium', avgReturnRate: 0.06, seasonality: 'low' },
  'スポーツ&アウトドア': { multiplier: 1.0, popularity: 'medium', avgReturnRate: 0.07, seasonality: 'high' },
  'Sports & Outdoors': { multiplier: 1.0, popularity: 'medium', avgReturnRate: 0.07, seasonality: 'high' },
  '家電&カメラ': { multiplier: 0.95, popularity: 'medium', avgReturnRate: 0.10, seasonality: 'medium' },
  'Electronics': { multiplier: 0.95, popularity: 'medium', avgReturnRate: 0.10, seasonality: 'medium' },
  'ファッション': { multiplier: 0.9, popularity: 'low', avgReturnRate: 0.15, seasonality: 'high' },
  'Clothing': { multiplier: 0.9, popularity: 'low', avgReturnRate: 0.15, seasonality: 'high' },
  '食品・飲料': { multiplier: 0.8, popularity: 'low', avgReturnRate: 0.02, seasonality: 'low' },
  'Grocery': { multiplier: 0.8, popularity: 'low', avgReturnRate: 0.02, seasonality: 'low' },
};

// ============================================================
// 利益計算
// ============================================================

export interface ProfitEstimate {
  margin: number;           // 利益率 (%)
  profitJpy: number;        // 利益 (円)
  profitUsd: number;        // 利益 (USD)
  ebayPriceUsd: number;     // eBay販売価格 (USD)
  ebayFeeUsd: number;       // eBay手数料 (USD)
  paymentFeeUsd: number;    // 決済手数料 (USD)
  shippingCostUsd: number;  // 送料 (USD)
  totalCostUsd: number;     // 総コスト (USD)
}

/**
 * 利益率推定（15%マージン設定時の実質利益率）
 */
export function estimateProfitMargin(
  amazonPriceJpy: number,
  weightG?: number,
  dimensions?: { length?: number; width?: number; height?: number },
  targetMargin: number = 0.15,
  exchangeRate: number = 150
): ProfitEstimate {
  // eBay販売価格想定
  const ebayPriceUsd = (amazonPriceJpy * (1 + targetMargin)) / exchangeRate;
  
  // eBay手数料 12.9%
  const ebayFeeUsd = ebayPriceUsd * 0.129;
  
  // 決済手数料 (Payoneer等) 約3%
  const paymentFeeUsd = ebayPriceUsd * 0.03;
  
  // 送料計算（重量＋容積重量の大きい方）
  const weight = weightG || 500;
  let volumetricWeight = 0;
  if (dimensions?.length && dimensions?.width && dimensions?.height) {
    volumetricWeight = (dimensions.length * dimensions.width * dimensions.height) / 5000 * 1000; // g換算
  }
  const chargeableWeight = Math.max(weight, volumetricWeight);
  
  let shippingCostUsd = 8; // 基本料金
  if (chargeableWeight > 3000) shippingCostUsd = 35;
  else if (chargeableWeight > 2000) shippingCostUsd = 25;
  else if (chargeableWeight > 1000) shippingCostUsd = 15;
  else if (chargeableWeight > 500) shippingCostUsd = 10;
  
  // 原価 (USD)
  const costUsd = amazonPriceJpy / exchangeRate;
  
  // 総コスト
  const totalCostUsd = costUsd + ebayFeeUsd + paymentFeeUsd + shippingCostUsd;
  
  // 利益
  const profitUsd = ebayPriceUsd - totalCostUsd;
  const actualMargin = (profitUsd / ebayPriceUsd) * 100;
  
  return {
    margin: Math.round(actualMargin * 10) / 10,
    profitJpy: Math.round(profitUsd * exchangeRate),
    profitUsd: Math.round(profitUsd * 100) / 100,
    ebayPriceUsd: Math.round(ebayPriceUsd * 100) / 100,
    ebayFeeUsd: Math.round(ebayFeeUsd * 100) / 100,
    paymentFeeUsd: Math.round(paymentFeeUsd * 100) / 100,
    shippingCostUsd: Math.round(shippingCostUsd * 100) / 100,
    totalCostUsd: Math.round(totalCostUsd * 100) / 100,
  };
}

// ============================================================
// N3基本スコア（PA-API/SP-APIのみ）
// ============================================================

/**
 * 利益スコア（最大30点）
 */
export function calculateProfitScore(profitMargin: number | undefined): number {
  if (profitMargin === undefined || profitMargin === null) return 0;
  const margin = profitMargin > 1 ? profitMargin / 100 : profitMargin;
  
  if (margin >= 0.30) return 30;
  if (margin >= 0.25) return 27;
  if (margin >= 0.20) return 24;
  if (margin >= 0.15) return 20;
  if (margin >= 0.10) return 15;
  if (margin >= 0.05) return 10;
  if (margin >= 0) return 5;
  return 0;
}

/**
 * 需要スコア（最大30点）- 基本版（BSRのみ）
 */
export function calculateBasicDemandScore(
  bsr: number | undefined,
  category?: string
): number {
  let score = 0;
  
  // BSR評価（20点）
  if (bsr !== undefined && bsr !== null) {
    if (bsr <= 1000) score += 20;
    else if (bsr <= 5000) score += 17;
    else if (bsr <= 10000) score += 14;
    else if (bsr <= 30000) score += 11;
    else if (bsr <= 50000) score += 8;
    else if (bsr <= 100000) score += 5;
    else if (bsr <= 200000) score += 3;
    else score += 1;
  }
  
  // カテゴリ補正（10点）
  if (category) {
    const catInfo = CATEGORY_CONFIG[category];
    if (catInfo?.popularity === 'high') score += 10;
    else if (catInfo?.popularity === 'medium') score += 6;
    else score += 3;
  } else {
    score += 5;
  }
  
  return Math.min(30, score);
}

/**
 * 競合スコア（最大20点）
 */
export function calculateCompetitionScore(
  fbaOfferCount: number | undefined,
  totalOfferCount: number | undefined,
  isAmazon: boolean | undefined
): number {
  let score = 20;
  
  const total = totalOfferCount || 0;
  const fba = fbaOfferCount || 0;
  
  if (total >= 50) score -= 10;
  else if (total >= 30) score -= 7;
  else if (total >= 20) score -= 5;
  else if (total >= 10) score -= 3;
  
  if (fba >= 20) score -= 5;
  else if (fba >= 10) score -= 3;
  else if (fba >= 5) score -= 1;
  
  if (isAmazon) score -= 5;
  
  return Math.max(0, score);
}

/**
 * リスクスコア（最大20点）
 */
export function calculateRiskScore(item: Partial<AmazonResearchItem>): {
  score: number;
  flags: RiskFlag[];
  level: RiskLevel;
} {
  let score = 20;
  const flags: RiskFlag[] = [];
  
  if (item.is_restricted) { score -= 8; flags.push('restricted'); }
  if (item.requires_approval) { score -= 3; flags.push('approval_required'); }
  if (item.hazmat_type) { score -= 5; flags.push('hazmat'); }
  
  if (item.brand && HIGH_RISK_BRANDS.some(b => 
    item.brand!.toLowerCase().includes(b.toLowerCase())
  )) { score -= 7; flags.push('ip_risk'); }
  
  if (item.is_amazon) { score -= 3; flags.push('amazon_sell'); }
  
  if (item.estimated_profit_margin !== undefined && item.estimated_profit_margin < 10) {
    score -= 2; flags.push('low_margin');
  }
  
  if (item.fba_offer_count && item.fba_offer_count >= 20) {
    score -= 2; flags.push('high_competition');
  }
  
  const finalScore = Math.max(0, score);
  let level: RiskLevel = 'low';
  if (finalScore <= 8) level = 'high';
  else if (finalScore <= 14) level = 'medium';
  
  return { score: finalScore, flags, level };
}

/**
 * N3基本スコア計算
 */
export function calculateN3BasicScore(item: Partial<AmazonResearchItem>): {
  score: number;
  breakdown: N3ScoreBreakdown;
  riskFlags: RiskFlag[];
  riskLevel: RiskLevel;
  confidence: 'low' | 'medium' | 'high';
} {
  let profitMargin = item.estimated_profit_margin;
  if (profitMargin === undefined && item.amazon_price_jpy) {
    const estimate = estimateProfitMargin(item.amazon_price_jpy, item.weight_g);
    profitMargin = estimate.margin;
  }
  
  const profitScore = calculateProfitScore(profitMargin);
  const demandScore = calculateBasicDemandScore(item.bsr_current, item.category);
  const competitionScore = calculateCompetitionScore(
    item.fba_offer_count,
    (item.new_offer_count || 0) + (item.fba_offer_count || 0),
    item.is_amazon
  );
  const riskResult = calculateRiskScore(item);
  
  const rawScore = profitScore + demandScore + competitionScore + riskResult.score;
  
  // カテゴリ補正
  let multiplier = 1.0;
  if (item.category && CATEGORY_CONFIG[item.category]) {
    multiplier = CATEGORY_CONFIG[item.category].multiplier;
  }
  
  const finalScore = Math.min(100, Math.max(0, Math.round(rawScore * multiplier)));
  
  // 信頼度（データの充実度）
  let dataPoints = 0;
  if (item.amazon_price_jpy) dataPoints++;
  if (item.bsr_current) dataPoints++;
  if (item.fba_offer_count !== undefined) dataPoints++;
  if (item.review_count !== undefined) dataPoints++;
  if (item.brand) dataPoints++;
  
  const confidence = dataPoints >= 4 ? 'high' : dataPoints >= 2 ? 'medium' : 'low';
  
  return {
    score: finalScore,
    breakdown: {
      profit_score: profitScore,
      demand_score: demandScore,
      competition_score: competitionScore,
      risk_score: riskResult.score,
    },
    riskFlags: riskResult.flags,
    riskLevel: riskResult.level,
    confidence,
  };
}

// ============================================================
// N3 Keepaスコア（履歴データ追加）
// ============================================================

/**
 * 需要スコア - Keepa版（最大30点）
 */
export function calculateKeepaEnhancedDemandScore(
  bsr: number | undefined,
  bsrDrops30d: number | undefined,
  bsr30dAvg: number | undefined,
  outOfStockPct: number | undefined,
  category?: string
): number {
  let score = 0;
  
  // BSR評価（12点）
  if (bsr !== undefined && bsr !== null) {
    if (bsr <= 1000) score += 12;
    else if (bsr <= 5000) score += 10;
    else if (bsr <= 10000) score += 8;
    else if (bsr <= 30000) score += 6;
    else if (bsr <= 50000) score += 5;
    else if (bsr <= 100000) score += 3;
    else score += 1;
  }
  
  // BSRドロップ（販売頻度）（10点）
  if (bsrDrops30d !== undefined && bsrDrops30d !== null) {
    if (bsrDrops30d >= 100) score += 10;
    else if (bsrDrops30d >= 50) score += 8;
    else if (bsrDrops30d >= 30) score += 6;
    else if (bsrDrops30d >= 15) score += 4;
    else if (bsrDrops30d >= 5) score += 2;
  }
  
  // BSR安定性（3点）
  if (bsr && bsr30dAvg) {
    const stability = Math.abs(bsr - bsr30dAvg) / bsr30dAvg;
    if (stability < 0.1) score += 3;
    else if (stability < 0.3) score += 2;
    else if (stability < 0.5) score += 1;
  }
  
  // 品切れ率ボーナス（高需要の証拠）（2点）
  if (outOfStockPct !== undefined) {
    if (outOfStockPct > 0.1 && outOfStockPct < 0.3) score += 2; // 適度な品切れは需要の証
    else if (outOfStockPct >= 0.3) score += 0; // 頻繁な品切れは問題
    else score += 1;
  }
  
  // カテゴリ（3点）
  if (category && CATEGORY_CONFIG[category]?.popularity === 'high') score += 3;
  else if (category && CATEGORY_CONFIG[category]?.popularity === 'medium') score += 2;
  else score += 1;
  
  return Math.min(30, score);
}

/**
 * Keepa追加リスク評価
 */
export function calculateKeepaRiskAdjustment(item: Partial<AmazonResearchItem>): {
  adjustment: number;
  additionalFlags: RiskFlag[];
} {
  let adjustment = 0;
  const additionalFlags: RiskFlag[] = [];
  
  // 価格変動リスク
  if (item.price_amazon_min && item.price_amazon_max && item.amazon_price_jpy) {
    const volatility = (item.price_amazon_max - item.price_amazon_min) / item.amazon_price_jpy;
    if (volatility > 0.5) { adjustment -= 4; additionalFlags.push('price_volatile'); }
    else if (volatility > 0.3) adjustment -= 2;
  }
  
  // 季節性リスク
  if (item.category && CATEGORY_CONFIG[item.category]?.seasonality === 'high') {
    adjustment -= 2;
    additionalFlags.push('seasonal');
  }
  
  // 在庫不安定（頻繁な品切れ）
  if (item.out_of_stock_percentage_30d && item.out_of_stock_percentage_30d > 0.4) {
    adjustment -= 2;
  }
  
  return { adjustment, additionalFlags };
}

/**
 * N3 Keepaスコア計算
 */
export function calculateN3KeepaScore(item: Partial<AmazonResearchItem>): {
  score: number;
  breakdown: N3ScoreBreakdown;
  riskFlags: RiskFlag[];
  riskLevel: RiskLevel;
  confidence: 'low' | 'medium' | 'high';
  hasKeepaData: boolean;
} {
  // Keepaデータがあるか確認
  const hasKeepaData = !!(item.bsr_drops_30d || item.bsr_30d_avg || item.monthly_sales_estimate);
  
  if (!hasKeepaData) {
    // Keepaデータなし → 基本スコアを返す
    const basic = calculateN3BasicScore(item);
    return { ...basic, hasKeepaData: false };
  }
  
  let profitMargin = item.estimated_profit_margin;
  if (profitMargin === undefined && item.amazon_price_jpy) {
    const estimate = estimateProfitMargin(item.amazon_price_jpy, item.weight_g);
    profitMargin = estimate.margin;
  }
  
  const profitScore = calculateProfitScore(profitMargin);
  const demandScore = calculateKeepaEnhancedDemandScore(
    item.bsr_current,
    item.bsr_drops_30d,
    item.bsr_30d_avg,
    item.out_of_stock_percentage_30d,
    item.category
  );
  const competitionScore = calculateCompetitionScore(
    item.fba_offer_count,
    (item.new_offer_count || 0) + (item.fba_offer_count || 0),
    item.is_amazon
  );
  const baseRisk = calculateRiskScore(item);
  const keepaRisk = calculateKeepaRiskAdjustment(item);
  
  const riskScore = Math.max(0, baseRisk.score + keepaRisk.adjustment);
  const allFlags = [...baseRisk.flags, ...keepaRisk.additionalFlags];
  
  const rawScore = profitScore + demandScore + competitionScore + riskScore;
  
  let multiplier = 1.0;
  if (item.category && CATEGORY_CONFIG[item.category]) {
    multiplier = CATEGORY_CONFIG[item.category].multiplier;
  }
  
  const finalScore = Math.min(100, Math.max(0, Math.round(rawScore * multiplier)));
  
  let level: RiskLevel = 'low';
  if (riskScore <= 8) level = 'high';
  else if (riskScore <= 14) level = 'medium';
  
  return {
    score: finalScore,
    breakdown: {
      profit_score: profitScore,
      demand_score: demandScore,
      competition_score: competitionScore,
      risk_score: riskScore,
    },
    riskFlags: allFlags,
    riskLevel: level,
    confidence: 'high',
    hasKeepaData: true,
  };
}

// ============================================================
// N3 AIスコア（将来実装）
// ============================================================

export interface AIAnalysisResult {
  trendScore: number;        // トレンド予測 (0-10)
  competitivenessScore: number; // 競争力評価 (0-10)
  sustainabilityScore: number;  // 持続性評価 (0-10)
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'avoid';
  reasons: string[];
  confidence: number;        // AI信頼度 (0-1)
}

/**
 * N3 AIスコア計算（将来実装用スタブ）
 */
export function calculateN3AIScore(
  item: Partial<AmazonResearchItem>,
  aiAnalysis?: AIAnalysisResult
): {
  score: number;
  breakdown: N3ScoreBreakdown & { ai_bonus: number };
  riskFlags: RiskFlag[];
  riskLevel: RiskLevel;
  confidence: 'low' | 'medium' | 'high';
  hasAIData: boolean;
  aiRecommendation?: string;
} {
  const keepaResult = calculateN3KeepaScore(item);
  
  if (!aiAnalysis) {
    return {
      ...keepaResult,
      breakdown: { ...keepaResult.breakdown, ai_bonus: 0 },
      hasAIData: false,
    };
  }
  
  // AIボーナス計算（最大+10点）
  const aiBonus = Math.round(
    (aiAnalysis.trendScore + aiAnalysis.competitivenessScore + aiAnalysis.sustainabilityScore) / 3
  );
  
  const finalScore = Math.min(100, keepaResult.score + aiBonus);
  
  return {
    score: finalScore,
    breakdown: { ...keepaResult.breakdown, ai_bonus: aiBonus },
    riskFlags: keepaResult.riskFlags,
    riskLevel: keepaResult.riskLevel,
    confidence: aiAnalysis.confidence > 0.8 ? 'high' : aiAnalysis.confidence > 0.5 ? 'medium' : 'low',
    hasAIData: true,
    aiRecommendation: aiAnalysis.recommendation,
  };
}

// ============================================================
// 特殊判定
// ============================================================

export function isNewProduct(releaseDate?: string, firstAvailable?: string): boolean {
  const date = releaseDate || firstAvailable;
  if (!date) return false;
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  return new Date(date) > threeMonthsAgo;
}

export function isVariationCandidate(item: Partial<AmazonResearchItem>): boolean {
  if (item.parent_asin && item.parent_asin !== item.asin) return true;
  if (item.color || item.size) return true;
  return false;
}

export function isSetCandidate(
  item: Partial<AmazonResearchItem>,
  allItems: Partial<AmazonResearchItem>[]
): boolean {
  if (!item.brand || !item.category) return false;
  const sameBrandCategory = allItems.filter(i =>
    i.brand === item.brand &&
    i.category === item.category &&
    i.asin !== item.asin
  );
  return sameBrandCategory.length >= 2;
}

// ============================================================
// 一括処理
// ============================================================

export function enrichItemsWithAllScores(
  items: Partial<AmazonResearchItem>[]
): AmazonResearchItem[] {
  return items.map(item => {
    // 利益推定
    let profitData: ProfitEstimate | null = null;
    if (item.amazon_price_jpy) {
      profitData = estimateProfitMargin(
        item.amazon_price_jpy,
        item.weight_g,
        { length: item.length_cm, width: item.width_cm, height: item.height_cm }
      );
    }
    
    const enrichedItem = {
      ...item,
      estimated_profit_margin: profitData?.margin ?? item.estimated_profit_margin,
      estimated_profit_jpy: profitData?.profitJpy ?? item.estimated_profit_jpy,
      estimated_profit_usd: profitData?.profitUsd ?? item.estimated_profit_usd,
      ebay_estimated_price_usd: profitData?.ebayPriceUsd ?? item.ebay_estimated_price_usd,
    };
    
    // 3つのスコアを計算
    const basicResult = calculateN3BasicScore(enrichedItem);
    const keepaResult = calculateN3KeepaScore(enrichedItem);
    const aiResult = calculateN3AIScore(enrichedItem); // AIデータなしの場合はKeepaスコアと同じ
    
    // 特殊判定
    const newProduct = isNewProduct(item.release_date, item.first_available);
    const variationCandidate = isVariationCandidate(item);
    
    return {
      ...enrichedItem,
      id: item.id || `${item.asin}-${Date.now()}`,
      
      // 3段階スコア
      n3_score: basicResult.score,
      n3_score_breakdown: basicResult.breakdown,
      n3_keepa_score: keepaResult.score,
      n3_keepa_breakdown: keepaResult.breakdown,
      n3_ai_score: aiResult.score,
      n3_ai_breakdown: aiResult.breakdown,
      
      // メインスコアはKeepaデータがあればKeepa版、なければ基本版
      display_score: keepaResult.hasKeepaData ? keepaResult.score : basicResult.score,
      score_confidence: keepaResult.confidence,
      
      // リスク
      risk_flags: keepaResult.riskFlags,
      risk_level: keepaResult.riskLevel,
      
      // 特殊判定
      is_new_product: newProduct,
      is_variation: item.parent_asin !== undefined && item.parent_asin !== item.asin,
      is_variation_candidate: variationCandidate,
      
      // ステータス
      status: item.status || 'completed',
      created_at: item.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as AmazonResearchItem;
  });
}
