// lib/services/ebay/analysis-logic.ts
/**
 * SM分析ロジック
 * 
 * 🔥 Gemini指針に基づく実装:
 * - Finding API（過去90日販売）+ Browse API（現在出品）の二刀流
 * - 推奨価格の計算
 * - 売れ筋スコアの算出
 */

// =============================================================================
// 型定義
// =============================================================================

export interface FindingApiResult {
  success: boolean;
  items: FindingItem[];
  totalSold: number;
  soldLast30Days: number;
  soldLast90Days: number;
  averageSoldPrice: number;
  medianSoldPrice: number;
  error?: string;
}

export interface FindingItem {
  itemId: string;
  title: string;
  soldPrice: number;
  soldDate: string;
  quantitySold: number;
  condition: string;
  seller: {
    username: string;
    feedbackScore: number;
  };
  imageUrl?: string;
  viewItemUrl?: string;
}

export interface BrowseApiResult {
  success: boolean;
  items: BrowseItem[];
  lowestPrice: number;
  averagePrice: number;
  medianPrice: number;
  competitorCount: number;
  jpSellerCount: number;
  searchLevel: number;
  error?: string;
}

export interface BrowseItem {
  itemId: string;
  title: string;
  price: number;
  currency: string;
  condition: string;
  seller?: {
    username: string;
    feedbackScore: number;
  };
  location?: {
    country: string;
  };
  imageUrl?: string;
  viewItemUrl?: string;
  matchLevel?: number;
  matchScore?: number;
  isRecommended?: boolean;
}

export interface SmAnalysisResult {
  // --- 需要データ (Finding API) ---
  sold_last_90d: number;
  sold_last_30d: number;
  avg_sold_price: number;
  median_sold_price: number;
  
  // --- 競合データ (Browse API) ---
  current_lowest_price: number;
  current_average_price: number;
  competitor_count: number;
  jp_seller_count: number;
  
  // --- 判定データ (Logic) ---
  recommended_price: number;
  demand_score: number;  // 0-100
  confidence_level: 'high' | 'mid' | 'low';
  
  // --- メタデータ ---
  finding_success: boolean;
  browse_success: boolean;
  search_level: number;
  analyzed_at: string;
  
  // --- 候補商品 ---
  browse_items: BrowseItem[];
  finding_items: FindingItem[];
}

// =============================================================================
// 推奨価格の計算
// =============================================================================

/**
 * 🔥 推奨価格計算（Gemini指針）
 * 
 * P_rec = clamp(AvgSold × 0.98, LowestPrice × 0.99, AvgSold × 1.1)
 * 
 * ロジック:
 * 1. 基本は「平均販売価格の98%」を狙う（売れる確率が高い）
 * 2. ただし、現在の最安値がそれを下回る場合は、最安値のマイナス1%を検討
 * 3. あまりに安すぎる場合は、平均価格を優先して「待ち」の戦略
 */
export function calculateRecommendedPrice(
  avgSoldPrice: number,
  currentLowestPrice: number
): number {
  // データ不足の場合
  if (avgSoldPrice <= 0 && currentLowestPrice <= 0) {
    return 0;
  }
  
  // Finding APIのみ成功
  if (currentLowestPrice <= 0) {
    return parseFloat((avgSoldPrice * 0.98).toFixed(2));
  }
  
  // Browse APIのみ成功
  if (avgSoldPrice <= 0) {
    return parseFloat((currentLowestPrice * 0.95).toFixed(2));
  }
  
  // 両方成功 → Geminiの計算式
  const base = avgSoldPrice * 0.98;
  const floor = currentLowestPrice * 0.99;
  const ceiling = avgSoldPrice * 1.1;
  
  // clamp関数
  const clamp = (value: number, min: number, max: number) => 
    Math.max(min, Math.min(max, value));
  
  const recommended = clamp(base, floor, ceiling);
  
  return parseFloat(recommended.toFixed(2));
}

// =============================================================================
// 売れ筋スコアの計算
// =============================================================================

/**
 * 🔥 売れ筋スコア計算（Gemini指針）
 * 
 * Demand Score = (Sold_90d / (Competitors + 1)) × 10
 * 
 * スコアの意味:
 * - 80-100: 超お宝。即出品。競合より高くても売れる。
 * - 50-79: 良好。価格競争に勝てばすぐに売れる。
 * - 20-49: 普通。在庫回転は遅め。
 * - 0-19: 飽和または需要なし。出品を見送るべき。
 */
export function calculateDemandScore(
  soldLast90Days: number,
  competitorCount: number
): number {
  if (soldLast90Days <= 0) {
    return 0;
  }
  
  const rawScore = (soldLast90Days / (competitorCount + 1)) * 10;
  
  // 0-100でキャップ
  const score = Math.min(100, Math.max(0, rawScore));
  
  return Math.round(score);
}

/**
 * 売れ筋スコアの解釈
 */
export function interpretDemandScore(score: number): {
  label: string;
  color: string;
  recommendation: string;
} {
  if (score >= 80) {
    return {
      label: '超お宝',
      color: 'green',
      recommendation: '即出品推奨。競合より高くても売れる可能性大。'
    };
  }
  if (score >= 50) {
    return {
      label: '良好',
      color: 'blue',
      recommendation: '価格競争に勝てばすぐに売れる。'
    };
  }
  if (score >= 20) {
    return {
      label: '普通',
      color: 'yellow',
      recommendation: '在庫回転は遅め。利益率重視で。'
    };
  }
  return {
    label: '低需要',
    color: 'red',
    recommendation: '飽和または需要なし。出品を見送るか、差別化が必要。'
  };
}

// =============================================================================
// 信頼度レベルの判定
// =============================================================================

/**
 * 信頼度レベルの判定
 * 
 * - high: 両方のAPIが成功し、十分なデータがある
 * - mid: 片方のAPIが成功、または少ないデータ
 * - low: どちらかのAPIが失敗、または非常に少ないデータ
 */
export function determineConfidenceLevel(
  findingSuccess: boolean,
  browseSuccess: boolean,
  soldLast90Days: number,
  competitorCount: number
): 'high' | 'mid' | 'low' {
  // 両方失敗
  if (!findingSuccess && !browseSuccess) {
    return 'low';
  }
  
  // 両方成功
  if (findingSuccess && browseSuccess) {
    // データが十分か
    if (soldLast90Days >= 10 && competitorCount >= 3) {
      return 'high';
    }
    if (soldLast90Days >= 3 || competitorCount >= 1) {
      return 'mid';
    }
    return 'low';
  }
  
  // 片方のみ成功
  if (findingSuccess && soldLast90Days >= 10) {
    return 'mid';
  }
  if (browseSuccess && competitorCount >= 5) {
    return 'mid';
  }
  
  return 'low';
}

// =============================================================================
// 結果のマージ
// =============================================================================

/**
 * Finding APIとBrowse APIの結果をマージ
 */
export function mergeAnalysisResults(
  findingResult: FindingApiResult | null,
  browseResult: BrowseApiResult | null
): SmAnalysisResult {
  const finding = findingResult || {
    success: false,
    items: [],
    totalSold: 0,
    soldLast30Days: 0,
    soldLast90Days: 0,
    averageSoldPrice: 0,
    medianSoldPrice: 0
  };
  
  const browse = browseResult || {
    success: false,
    items: [],
    lowestPrice: 0,
    averagePrice: 0,
    medianPrice: 0,
    competitorCount: 0,
    jpSellerCount: 0,
    searchLevel: 0
  };
  
  // 推奨価格を計算
  const recommendedPrice = calculateRecommendedPrice(
    finding.averageSoldPrice,
    browse.lowestPrice
  );
  
  // 売れ筋スコアを計算
  const demandScore = calculateDemandScore(
    finding.soldLast90Days,
    browse.competitorCount
  );
  
  // 信頼度レベルを判定
  const confidenceLevel = determineConfidenceLevel(
    finding.success,
    browse.success,
    finding.soldLast90Days,
    browse.competitorCount
  );
  
  return {
    // 需要データ
    sold_last_90d: finding.soldLast90Days,
    sold_last_30d: finding.soldLast30Days,
    avg_sold_price: finding.averageSoldPrice,
    median_sold_price: finding.medianSoldPrice,
    
    // 競合データ
    current_lowest_price: browse.lowestPrice,
    current_average_price: browse.averagePrice,
    competitor_count: browse.competitorCount,
    jp_seller_count: browse.jpSellerCount,
    
    // 判定データ
    recommended_price: recommendedPrice,
    demand_score: demandScore,
    confidence_level: confidenceLevel,
    
    // メタデータ
    finding_success: finding.success,
    browse_success: browse.success,
    search_level: browse.searchLevel,
    analyzed_at: new Date().toISOString(),
    
    // 候補商品（上位20件）
    browse_items: browse.items.slice(0, 20),
    finding_items: finding.items.slice(0, 20)
  };
}

// =============================================================================
// 中央値計算ヘルパー
// =============================================================================

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

// =============================================================================
// 過去30日/90日の販売数を計算
// =============================================================================

export function calculateSoldCounts(items: FindingItem[]): {
  soldLast30Days: number;
  soldLast90Days: number;
} {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  
  let soldLast30Days = 0;
  let soldLast90Days = 0;
  
  for (const item of items) {
    const soldDate = new Date(item.soldDate);
    const qty = item.quantitySold || 1;
    
    if (soldDate >= ninetyDaysAgo) {
      soldLast90Days += qty;
      
      if (soldDate >= thirtyDaysAgo) {
        soldLast30Days += qty;
      }
    }
  }
  
  return { soldLast30Days, soldLast90Days };
}
