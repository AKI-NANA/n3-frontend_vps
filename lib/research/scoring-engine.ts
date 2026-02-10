// lib/research/scoring-engine.ts
/**
 * Research Scoring Engine
 * - listing_score 計算（学習メモリ反映）
 * - risk_score 計算  
 * - same_group_id 類似判定（グループ内最高スコア継承）
 * - learning_memory 反映（類似商品ボーナス/ペナルティ）
 * - 自動昇格判定（listing_score >= 85 && risk_score < 30）
 */

// ============================================================
// 型定義
// ============================================================

export interface ResearchItem {
  id?: string;
  asin?: string;
  title?: string;
  brand?: string;
  category?: string;
  price_jpy?: number;
  amazon_price_jpy?: number;
  estimated_profit_jpy?: number;
  estimated_profit_margin?: number;
  monthly_sales_estimate?: number;
  bsr_current?: number;
  fba_offer_count?: number;
  is_amazon?: boolean;
  risk_flags?: string[];
  listing_score?: number;
  risk_score?: number;
  same_group_id?: string;
  status?: string;
}

export interface LearningMemory {
  brand_scores: Record<string, { approved: number; rejected: number }>;
  category_scores: Record<string, { approved: number; rejected: number }>;
  keyword_scores: Record<string, { approved: number; rejected: number }>;
  // 類似商品の過去判定履歴（same_group_id単位）
  similar_history: Record<string, { approved: number; rejected: number; best_score?: number }>;
  updated_at?: string;
}

export interface ScoreResult {
  listing_score: number;
  risk_score: number;
  same_group_id: string | null;
  should_auto_promote: boolean;
  confidence: number;
  breakdown: {
    profit: number;
    demand: number;
    competition: number;
    risk_penalty: number;
    learning_bonus: number;
    similar_bonus: number;
    group_inherited: number;
  };
}

// ============================================================
// VEROブランドリスト
// ============================================================

const VERO_BRANDS = [
  'nintendo', 'sony', 'apple', 'microsoft', 'louis vuitton', 'gucci',
  'chanel', 'hermes', 'rolex', 'cartier', 'tiffany', 'burberry',
  'prada', 'fendi', 'dior', 'balenciaga', 'supreme', 'off-white',
  'bape', 'yeezy', 'jordan', 'nike', 'adidas', 'lego', 'disney',
  'marvel', 'pokemon', 'sanrio', 'hello kitty', 'bandai', 'takara tomy',
];

// ============================================================
// 自動昇格判定
// ============================================================

/**
 * 自動昇格条件: listing_score >= 85 && risk_score < 30
 */
export function shouldAutoPromote(listingScore: number, riskScore: number): boolean {
  return listingScore >= 85 && riskScore < 30;
}

/**
 * 信頼度計算: (listing_score / 100) * (1 - risk_score / 100)
 */
export function calculateConfidence(listingScore: number, riskScore: number): number {
  return (listingScore / 100) * (1 - riskScore / 100);
}

// ============================================================
// 類似商品ボーナス/ペナルティ計算
// ============================================================

/**
 * 過去の類似商品判定からボーナス計算
 * - approved類似 → +10点
 * - rejected類似 → -15点
 */
function calculateSimilarBonus(
  sameGroupId: string | null,
  learningMemory: LearningMemory | null
): number {
  if (!sameGroupId || !learningMemory?.similar_history) return 0;
  
  const history = learningMemory.similar_history[sameGroupId];
  if (!history) return 0;
  
  let bonus = 0;
  
  // approved類似 → +10点
  if (history.approved > 0) {
    bonus += 10;
  }
  
  // rejected類似 → -15点（approved履歴がない場合のみ）
  if (history.rejected > 0 && history.approved === 0) {
    bonus -= 15;
  }
  
  return bonus;
}

/**
 * グループ内最高スコア継承
 */
function getGroupBestScore(
  sameGroupId: string | null,
  existingItems: Array<{ same_group_id?: string; listing_score?: number }>,
  learningMemory: LearningMemory | null
): number {
  if (!sameGroupId) return 0;
  
  // 学習メモリから最高スコア取得
  const memoryBest = learningMemory?.similar_history?.[sameGroupId]?.best_score ?? 0;
  
  // 既存アイテムから最高スコア取得
  let existingBest = 0;
  for (const item of existingItems) {
    if (item.same_group_id === sameGroupId && item.listing_score) {
      existingBest = Math.max(existingBest, item.listing_score);
    }
  }
  
  return Math.max(memoryBest, existingBest);
}

// ============================================================
// listing_score 計算
// ============================================================

export function calculateListingScore(
  item: ResearchItem,
  learningMemory: LearningMemory | null,
  sameGroupId: string | null,
  existingItems: Array<{ same_group_id?: string; listing_score?: number }> = []
): { score: number; breakdown: ScoreResult['breakdown'] } {
  
  // 1. 利益スコア (0-35)
  const margin = item.estimated_profit_margin ?? 0;
  let profit = 0;
  if (margin >= 40) profit = 35;
  else if (margin >= 30) profit = 30;
  else if (margin >= 20) profit = 25;
  else if (margin >= 15) profit = 20;
  else if (margin >= 10) profit = 15;
  else if (margin >= 5) profit = 10;
  else profit = 5;

  // 2. 需要スコア (0-25)
  const sales = item.monthly_sales_estimate ?? 0;
  let demand = 0;
  if (sales >= 500) demand = 25;
  else if (sales >= 200) demand = 22;
  else if (sales >= 100) demand = 18;
  else if (sales >= 50) demand = 15;
  else if (sales >= 20) demand = 10;
  else if (sales >= 10) demand = 5;
  else demand = 2;

  // 3. 競合スコア (0-20)
  const fba = item.fba_offer_count ?? 0;
  let competition = 0;
  if (fba <= 2) competition = 20;
  else if (fba <= 5) competition = 15;
  else if (fba <= 10) competition = 10;
  else if (fba <= 15) competition = 5;
  else competition = 2;
  
  // Amazon本体ペナルティ
  if (item.is_amazon) competition = Math.max(0, competition - 10);

  // 4. リスクペナルティ (0 to -20)
  let risk_penalty = 0;
  const flags = item.risk_flags ?? [];
  if (flags.includes('ip_risk')) risk_penalty -= 10;
  if (flags.includes('hazmat')) risk_penalty -= 8;
  if (flags.includes('restricted')) risk_penalty -= 8;
  if (flags.includes('approval_required')) risk_penalty -= 5;
  if (flags.includes('high_competition')) risk_penalty -= 3;
  risk_penalty = Math.max(-20, risk_penalty);

  // 5. 学習ボーナス (-10 to +10)
  let learning_bonus = 0;
  if (learningMemory) {
    const brandLower = (item.brand ?? '').toLowerCase();
    const catLower = (item.category ?? '').toLowerCase();
    
    // ブランド学習
    if (brandLower && learningMemory.brand_scores?.[brandLower]) {
      const bs = learningMemory.brand_scores[brandLower];
      const total = bs.approved + bs.rejected;
      if (total > 0) {
        const ratio = bs.approved / total;
        learning_bonus += (ratio - 0.5) * 10; // -5 to +5
      }
    }
    
    // カテゴリ学習
    if (catLower && learningMemory.category_scores?.[catLower]) {
      const cs = learningMemory.category_scores[catLower];
      const total = cs.approved + cs.rejected;
      if (total > 0) {
        const ratio = cs.approved / total;
        learning_bonus += (ratio - 0.5) * 6; // -3 to +3
      }
    }
    
    // キーワード学習
    const titleLower = (item.title ?? '').toLowerCase();
    for (const [kw, ks] of Object.entries(learningMemory.keyword_scores ?? {})) {
      if (titleLower.includes(kw)) {
        const total = ks.approved + ks.rejected;
        if (total > 0) {
          const ratio = ks.approved / total;
          learning_bonus += (ratio - 0.5) * 4; // -2 to +2 per keyword
        }
      }
    }
    
    learning_bonus = Math.max(-10, Math.min(10, learning_bonus));
  }

  // 6. 類似商品ボーナス (-15 to +10) ★新規追加
  const similar_bonus = calculateSimilarBonus(sameGroupId, learningMemory);

  // 7. グループ内最高スコア継承 ★新規追加
  const groupBest = getGroupBestScore(sameGroupId, existingItems, learningMemory);
  let group_inherited = 0;
  
  // 基本スコア計算
  const baseScore = profit + demand + competition + risk_penalty + learning_bonus + similar_bonus;
  
  // グループ内最高スコアの80%を下限として継承
  if (groupBest > 0 && baseScore < groupBest * 0.8) {
    group_inherited = Math.round(groupBest * 0.8 - baseScore);
  }

  const total = Math.max(0, Math.min(100, baseScore + group_inherited));

  return {
    score: Math.round(total),
    breakdown: {
      profit,
      demand,
      competition,
      risk_penalty,
      learning_bonus: Math.round(learning_bonus * 10) / 10,
      similar_bonus,
      group_inherited,
    },
  };
}

// ============================================================
// risk_score 計算
// ============================================================

export function calculateRiskScore(item: ResearchItem): number {
  let risk = 0;
  
  const brandLower = (item.brand ?? '').toLowerCase();
  const titleLower = (item.title ?? '').toLowerCase();
  const catLower = (item.category ?? '').toLowerCase();

  // 1. VEROブランドチェック (+50)
  for (const vero of VERO_BRANDS) {
    if (brandLower.includes(vero) || titleLower.includes(vero)) {
      risk += 50;
      break;
    }
  }

  // 2. 高リスクカテゴリ (+20)
  const riskCats = ['electronics', 'medical', 'food', 'cosmetics', 'supplements'];
  for (const rc of riskCats) {
    if (catLower.includes(rc)) {
      risk += 20;
      break;
    }
  }

  // 3. リスクフラグ
  const flags = item.risk_flags ?? [];
  if (flags.includes('ip_risk')) risk += 30;
  if (flags.includes('hazmat')) risk += 25;
  if (flags.includes('restricted')) risk += 20;
  if (flags.includes('approval_required')) risk += 10;

  // 4. OEM判定（ノーブランド + 電子機器）
  const isNoName = !item.brand || brandLower === 'generic' || brandLower === 'unbranded';
  const isGenericTitle = /compatible|replacement|generic|universal/i.test(titleLower);
  if (isNoName && isGenericTitle) risk += 15;

  return Math.min(100, risk);
}

// ============================================================
// same_group_id 類似判定（簡易版）
// ============================================================

export function calculateSameGroupId(
  item: ResearchItem,
  existingItems: Array<{ id?: string; title?: string; brand?: string; same_group_id?: string }>
): string | null {
  
  const normalize = (text: string): string => {
    return text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
  };
  
  const getWords = (text: string): Set<string> => {
    return new Set(text.split(' ').filter(w => w.length > 2));
  };
  
  const itemKey = normalize(`${item.title ?? ''} ${item.brand ?? ''}`);
  const itemWords = getWords(itemKey);
  
  if (itemWords.size === 0) return null;

  // 既存アイテムと比較
  for (const existing of existingItems) {
    if (existing.id === item.id) continue;
    if (!existing.same_group_id) continue;
    
    const existingKey = normalize(`${existing.title ?? ''} ${existing.brand ?? ''}`);
    const existingWords = getWords(existingKey);
    
    if (existingWords.size === 0) continue;
    
    // Jaccard係数
    const intersection = new Set([...itemWords].filter(w => existingWords.has(w)));
    const union = new Set([...itemWords, ...existingWords]);
    const similarity = intersection.size / union.size;
    
    if (similarity >= 0.92) {
      return existing.same_group_id;
    }
  }

  // 新規グループID
  return `grp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ============================================================
// 学習メモリ更新
// ============================================================

export function updateLearningMemory(
  memory: LearningMemory,
  item: ResearchItem,
  decision: 'approved' | 'rejected',
  listingScore?: number
): LearningMemory {
  const newMemory: LearningMemory = {
    brand_scores: { ...memory.brand_scores },
    category_scores: { ...memory.category_scores },
    keyword_scores: { ...memory.keyword_scores },
    similar_history: { ...memory.similar_history },
    updated_at: new Date().toISOString(),
  };
  
  // ブランド学習
  const brandLower = (item.brand ?? '').toLowerCase();
  if (brandLower && brandLower !== 'generic' && brandLower !== 'unbranded') {
    if (!newMemory.brand_scores[brandLower]) {
      newMemory.brand_scores[brandLower] = { approved: 0, rejected: 0 };
    }
    newMemory.brand_scores[brandLower][decision]++;
  }

  // カテゴリ学習
  const catLower = (item.category ?? '').toLowerCase();
  if (catLower) {
    if (!newMemory.category_scores[catLower]) {
      newMemory.category_scores[catLower] = { approved: 0, rejected: 0 };
    }
    newMemory.category_scores[catLower][decision]++;
  }

  // キーワード学習（タイトルから重要語抽出）
  const keywords = (item.title ?? '')
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length >= 4 && !/^\d+$/.test(w))
    .slice(0, 5);

  for (const kw of keywords) {
    if (!newMemory.keyword_scores[kw]) {
      newMemory.keyword_scores[kw] = { approved: 0, rejected: 0 };
    }
    newMemory.keyword_scores[kw][decision]++;
  }

  // 類似商品履歴更新 ★新規追加
  const groupId = item.same_group_id;
  if (groupId) {
    if (!newMemory.similar_history[groupId]) {
      newMemory.similar_history[groupId] = { approved: 0, rejected: 0 };
    }
    newMemory.similar_history[groupId][decision]++;
    
    // グループ内最高スコア更新
    if (listingScore && decision === 'approved') {
      const current = newMemory.similar_history[groupId].best_score ?? 0;
      newMemory.similar_history[groupId].best_score = Math.max(current, listingScore);
    }
  }

  return newMemory;
}

// ============================================================
// 統合スコア計算
// ============================================================

export function calculateAllScores(
  item: ResearchItem,
  existingItems: Array<{ id?: string; title?: string; brand?: string; same_group_id?: string; listing_score?: number }> = [],
  learningMemory?: LearningMemory | null
): ScoreResult {
  // 1. same_group_id を先に計算
  const same_group_id = calculateSameGroupId(item, existingItems);
  
  // 2. risk_score計算
  const risk_score = calculateRiskScore(item);
  
  // 3. listing_score計算（学習メモリ、類似商品ボーナス、グループ継承を反映）
  const { score: listing_score, breakdown } = calculateListingScore(
    item, 
    learningMemory ?? null, 
    same_group_id, 
    existingItems
  );
  
  // 4. 自動昇格判定
  const should_auto_promote = shouldAutoPromote(listing_score, risk_score);
  
  // 5. 信頼度計算
  const confidence = calculateConfidence(listing_score, risk_score);

  return {
    listing_score,
    risk_score,
    same_group_id,
    should_auto_promote,
    confidence,
    breakdown,
  };
}

// ============================================================
// デフォルト学習メモリ
// ============================================================

export function createDefaultLearningMemory(): LearningMemory {
  return {
    brand_scores: {},
    category_scores: {},
    keyword_scores: {},
    similar_history: {},
    updated_at: new Date().toISOString(),
  };
}
