// lib/services/sm/candidate-scoring.ts
/**
 * SM（SellerMirror）分析候補スコアリングシステム
 * 
 * 機能:
 * 1. SM分析結果から最適な候補を自動選択
 * 2. タイトル類似度、価格妥当性、情報量でスコアリング
 * 3. 人間確認用のランキング表示
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

// ============================================================
// 型定義
// ============================================================

export interface SMCandidate {
  id: string;
  itemId?: string;
  title: string;
  price: number;
  currency?: string;
  seller?: string;
  sellerRating?: number;
  condition?: string;
  conditionId?: number;
  imageCount?: number;
  images?: string[];
  shippingCost?: number;
  location?: string;
  itemSpecifics?: Record<string, string>;
  listingUrl?: string;
  soldCount?: number;
  watchCount?: number;
}

export interface ProductContext {
  title: string;
  englishTitle?: string;
  expectedPrice?: number;
  category?: string;
  condition?: string;
  costPrice?: number;
}

export interface ScoredCandidate extends SMCandidate {
  score: number;
  scoreBreakdown: {
    titleSimilarity: number;
    priceScore: number;
    infoQuality: number;
    sellerTrust: number;
    bonus: number;
  };
  rank: number;
  recommendation: 'best' | 'good' | 'acceptable' | 'low';
  warnings: string[];
}

export interface ScoringConfig {
  weights: {
    titleSimilarity: number;  // デフォルト: 35
    priceScore: number;       // デフォルト: 30
    infoQuality: number;      // デフォルト: 20
    sellerTrust: number;      // デフォルト: 15
  };
  priceRange: {
    minRatio: number;  // 最低価格比率（デフォルト: 0.5）
    maxRatio: number;  // 最高価格比率（デフォルト: 2.0）
  };
  minScore: number;  // 最低採用スコア（デフォルト: 40）
}

// ============================================================
// デフォルト設定
// ============================================================

const DEFAULT_CONFIG: ScoringConfig = {
  weights: {
    titleSimilarity: 35,
    priceScore: 30,
    infoQuality: 20,
    sellerTrust: 15
  },
  priceRange: {
    minRatio: 0.5,
    maxRatio: 2.0
  },
  minScore: 40
};

// ============================================================
// ユーティリティ関数
// ============================================================

/**
 * 文字列のトークン化（正規化）
 */
function tokenize(text: string): Set<string> {
  if (!text) return new Set();
  
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s\u3000-\u9fff]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length >= 2)
  );
}

/**
 * Jaccard類似度計算
 */
function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  if (set1.size === 0 && set2.size === 0) return 0;
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * タイトル類似度計算（0-100）
 */
function calculateTitleSimilarity(candidateTitle: string, productContext: ProductContext): number {
  const candidateTokens = tokenize(candidateTitle);
  
  // 日本語タイトルとの比較
  const jpTokens = tokenize(productContext.title);
  const jpSimilarity = jaccardSimilarity(candidateTokens, jpTokens);
  
  // 英語タイトルとの比較（あれば）
  let enSimilarity = 0;
  if (productContext.englishTitle) {
    const enTokens = tokenize(productContext.englishTitle);
    enSimilarity = jaccardSimilarity(candidateTokens, enTokens);
  }
  
  // 高い方を採用
  const similarity = Math.max(jpSimilarity, enSimilarity);
  
  return Math.round(similarity * 100);
}

/**
 * 価格スコア計算（0-100）
 */
function calculatePriceScore(
  candidatePrice: number,
  productContext: ProductContext,
  config: ScoringConfig
): { score: number; warnings: string[] } {
  const warnings: string[] = [];
  
  // 基準価格（期待価格 or 原価の1.5倍）
  const basePrice = productContext.expectedPrice || (productContext.costPrice || 0) * 1.5;
  
  if (!basePrice || basePrice <= 0) {
    // 基準価格がない場合は中間スコア
    return { score: 50, warnings: ['基準価格が設定されていません'] };
  }
  
  const priceRatio = candidatePrice / basePrice;
  
  // 範囲外チェック
  if (priceRatio < config.priceRange.minRatio) {
    warnings.push(`価格が低すぎる可能性（基準の${Math.round(priceRatio * 100)}%）`);
    return { score: 20, warnings };
  }
  
  if (priceRatio > config.priceRange.maxRatio) {
    warnings.push(`価格が高すぎる可能性（基準の${Math.round(priceRatio * 100)}%）`);
    return { score: 30, warnings };
  }
  
  // 理想範囲（0.8-1.2）なら高スコア
  if (priceRatio >= 0.8 && priceRatio <= 1.2) {
    return { score: 100, warnings };
  }
  
  // 許容範囲（0.6-0.8, 1.2-1.5）
  if (priceRatio >= 0.6 && priceRatio <= 1.5) {
    return { score: 70, warnings };
  }
  
  // それ以外
  return { score: 50, warnings };
}

/**
 * 情報品質スコア計算（0-100）
 */
function calculateInfoQuality(candidate: SMCandidate): number {
  let score = 0;
  
  // 画像数（最大30点）
  const imageCount = candidate.imageCount || candidate.images?.length || 0;
  score += Math.min(imageCount, 12) * 2.5;
  
  // Item Specifics（最大30点）
  const specificsCount = Object.keys(candidate.itemSpecifics || {}).length;
  score += Math.min(specificsCount, 10) * 3;
  
  // コンディション情報（10点）
  if (candidate.condition || candidate.conditionId) score += 10;
  
  // 送料情報（10点）
  if (candidate.shippingCost !== undefined) score += 10;
  
  // 販売実績（20点）
  if (candidate.soldCount && candidate.soldCount > 0) {
    score += Math.min(candidate.soldCount, 10) * 2;
  }
  
  return Math.min(score, 100);
}

/**
 * 出品者信頼度スコア計算（0-100）
 */
function calculateSellerTrust(candidate: SMCandidate): number {
  let score = 50; // ベーススコア
  
  // 評価がある場合
  if (candidate.sellerRating !== undefined) {
    if (candidate.sellerRating >= 99) score = 100;
    else if (candidate.sellerRating >= 98) score = 90;
    else if (candidate.sellerRating >= 95) score = 70;
    else if (candidate.sellerRating >= 90) score = 50;
    else score = 30;
  }
  
  return score;
}

// ============================================================
// メイン関数
// ============================================================

/**
 * SM候補をスコアリング
 */
export function scoreCandidates(
  candidates: SMCandidate[],
  productContext: ProductContext,
  config: Partial<ScoringConfig> = {}
): ScoredCandidate[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  cfg.weights = { ...DEFAULT_CONFIG.weights, ...config.weights };
  cfg.priceRange = { ...DEFAULT_CONFIG.priceRange, ...config.priceRange };
  
  const scoredCandidates: ScoredCandidate[] = candidates.map(candidate => {
    const warnings: string[] = [];
    
    // 各スコア計算
    const titleSimilarity = calculateTitleSimilarity(candidate.title, productContext);
    const { score: priceScore, warnings: priceWarnings } = calculatePriceScore(
      candidate.price,
      productContext,
      cfg
    );
    warnings.push(...priceWarnings);
    
    const infoQuality = calculateInfoQuality(candidate);
    const sellerTrust = calculateSellerTrust(candidate);
    
    // ボーナス計算
    let bonus = 0;
    
    // コンディション一致ボーナス
    if (productContext.condition && candidate.condition) {
      const conditionMatch = productContext.condition.toLowerCase().includes(
        candidate.condition.toLowerCase().split(' ')[0]
      );
      if (conditionMatch) bonus += 5;
    }
    
    // 重み付き合計スコア
    const totalScore = Math.round(
      (titleSimilarity * cfg.weights.titleSimilarity +
       priceScore * cfg.weights.priceScore +
       infoQuality * cfg.weights.infoQuality +
       sellerTrust * cfg.weights.sellerTrust) / 100 +
      bonus
    );
    
    // 推奨度判定
    let recommendation: 'best' | 'good' | 'acceptable' | 'low';
    if (totalScore >= 70) recommendation = 'best';
    else if (totalScore >= 55) recommendation = 'good';
    else if (totalScore >= cfg.minScore) recommendation = 'acceptable';
    else recommendation = 'low';
    
    return {
      ...candidate,
      score: totalScore,
      scoreBreakdown: {
        titleSimilarity,
        priceScore,
        infoQuality,
        sellerTrust,
        bonus
      },
      rank: 0, // 後で設定
      recommendation,
      warnings
    };
  });
  
  // スコア順にソート & ランク付け
  scoredCandidates.sort((a, b) => b.score - a.score);
  scoredCandidates.forEach((candidate, index) => {
    candidate.rank = index + 1;
  });
  
  return scoredCandidates;
}

/**
 * 最適な候補を1件取得
 */
export function getBestCandidate(
  candidates: SMCandidate[],
  productContext: ProductContext,
  config: Partial<ScoringConfig> = {}
): ScoredCandidate | null {
  const scored = scoreCandidates(candidates, productContext, config);
  
  if (scored.length === 0) return null;
  
  const best = scored[0];
  
  // 最低スコアを満たしているか
  const cfg = { ...DEFAULT_CONFIG, ...config };
  if (best.score < cfg.minScore) {
    console.warn(`[SM Scoring] Best candidate score (${best.score}) below minimum (${cfg.minScore})`);
  }
  
  return best;
}

/**
 * トップN件の候補を取得
 */
export function getTopCandidates(
  candidates: SMCandidate[],
  productContext: ProductContext,
  topN: number = 5,
  config: Partial<ScoringConfig> = {}
): ScoredCandidate[] {
  const scored = scoreCandidates(candidates, productContext, config);
  return scored.slice(0, topN);
}

/**
 * 候補の自動採用判定
 * @returns true = 自動採用OK、false = 人間確認必要
 */
export function shouldAutoSelect(
  bestCandidate: ScoredCandidate | null,
  minAutoSelectScore: number = 75
): boolean {
  if (!bestCandidate) return false;
  
  return (
    bestCandidate.score >= minAutoSelectScore &&
    bestCandidate.warnings.length === 0 &&
    bestCandidate.recommendation === 'best'
  );
}

// ============================================================
// エクスポート
// ============================================================

export default {
  scoreCandidates,
  getBestCandidate,
  getTopCandidates,
  shouldAutoSelect
};
