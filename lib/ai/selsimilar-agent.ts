// lib/ai/selsimilar-agent.ts
// ========================================
// 🎯 N3 Empire OS V8.2.1 - Selsimilar自律特定エージェント
// 第3フェーズ：知能パッチ - 真の正解を1件特定
// ========================================

import { SupabaseClient } from '@supabase/supabase-js';
import { AI_MODELS, TOOL_DEFINITIONS, AgentResult, ToolResult } from './agent-core';

// ========================================
// 型定義
// ========================================

/** 商品候補 */
export interface ProductCandidate {
  /** プラットフォーム上のID */
  platformId: string;
  /** 商品タイトル */
  title: string;
  /** 価格 */
  price: number;
  /** 通貨 */
  currency: string;
  /** 画像URL */
  imageUrl: string;
  /** 出品URL */
  listingUrl: string;
  /** セラー情報 */
  seller?: {
    name: string;
    rating?: number;
    feedbackCount?: number;
  };
  /** コンディション */
  condition?: string;
  /** 配送情報 */
  shipping?: {
    cost: number;
    estimatedDays: number;
  };
}

/** 類似度スコア詳細 */
export interface SimilarityScore {
  /** 総合スコア（0-100） */
  overall: number;
  /** タイトル類似度 */
  titleSimilarity: number;
  /** 画像類似度 */
  imageSimilarity: number;
  /** 価格帯適合度 */
  priceMatch: number;
  /** ブランド/型番一致 */
  brandModelMatch: number;
  /** コンディション適合度 */
  conditionMatch: number;
}

/** Selsimilar結果 */
export interface SelsimilarResult extends AgentResult {
  /** 特定された商品（1件） */
  selectedProduct: ProductCandidate | null;
  /** 候補リスト（スコア順） */
  candidates: Array<ProductCandidate & { score: SimilarityScore }>;
  /** 特定理由 */
  selectionReason: string;
  /** 次点との差分 */
  marginToSecond: number;
}

/** Selsimilar設定 */
export interface SelsimilarConfig {
  /** 対象プラットフォーム */
  platform: 'ebay' | 'amazon' | 'yahoo' | 'mercari' | 'rakuten';
  /** 検索対象マーケットプレイス */
  marketplace?: string;
  /** 最大候補数 */
  maxCandidates: number;
  /** 最小スコア閾値 */
  minScoreThreshold: number;
  /** HitLエスカレーション閾値 */
  hitlThreshold: number;
  /** 画像比較を有効化 */
  enableVisionCompare: boolean;
  /** 価格範囲フィルタ（%） */
  priceRangePercent: number;
}

// ========================================
// デフォルト設定
// ========================================

export const DEFAULT_SELSIMILAR_CONFIG: SelsimilarConfig = {
  platform: 'ebay',
  marketplace: 'EBAY_US',
  maxCandidates: 10,
  minScoreThreshold: 50,
  hitlThreshold: 75,
  enableVisionCompare: true,
  priceRangePercent: 30
};

// ========================================
// Selsimilarエージェントクラス
// ========================================

export class SelsimilarAgent {
  private config: SelsimilarConfig;
  private supabase: SupabaseClient;
  
  constructor(config: Partial<SelsimilarConfig>, supabase: SupabaseClient) {
    this.config = { ...DEFAULT_SELSIMILAR_CONFIG, ...config };
    this.supabase = supabase;
  }
  
  /**
   * 類似商品を特定する
   * @param sourceProduct 元商品情報
   * @param searchKeywords 検索キーワード
   */
  async findBestMatch(
    sourceProduct: {
      title: string;
      imageUrl?: string;
      price?: number;
      brand?: string;
      model?: string;
      condition?: string;
    },
    searchKeywords?: string
  ): Promise<SelsimilarResult> {
    const startTime = Date.now();
    const toolsUsed: string[] = [];
    let totalTokens = 0;
    
    try {
      // 1. 検索キーワード生成
      const keywords = searchKeywords || this.generateSearchKeywords(sourceProduct);
      
      // 2. プラットフォーム検索（Web検索 or API）
      toolsUsed.push('web_search');
      const searchResults = await this.searchPlatform(keywords);
      
      if (searchResults.length === 0) {
        return this.createEmptyResult(startTime, toolsUsed, '検索結果なし');
      }
      
      // 3. 候補をスコアリング
      const scoredCandidates: Array<ProductCandidate & { score: SimilarityScore }> = [];
      
      for (const candidate of searchResults.slice(0, this.config.maxCandidates)) {
        const score = await this.calculateSimilarityScore(sourceProduct, candidate);
        
        if (score.overall >= this.config.minScoreThreshold) {
          scoredCandidates.push({ ...candidate, score });
        }
        
        // 画像比較を追加
        if (this.config.enableVisionCompare && sourceProduct.imageUrl && candidate.imageUrl) {
          toolsUsed.push('vision_compare');
          const imageScore = await this.compareImages(sourceProduct.imageUrl, candidate.imageUrl);
          score.imageSimilarity = imageScore;
          score.overall = this.recalculateOverallScore(score);
        }
      }
      
      // 4. スコア順にソート
      scoredCandidates.sort((a, b) => b.score.overall - a.score.overall);
      
      // 5. 最良候補を選択
      const bestCandidate = scoredCandidates[0] || null;
      const secondBest = scoredCandidates[1] || null;
      
      // 6. 確信度計算
      const confidence = this.calculateConfidence(scoredCandidates, bestCandidate);
      const marginToSecond = bestCandidate && secondBest 
        ? bestCandidate.score.overall - secondBest.score.overall 
        : bestCandidate?.score.overall || 0;
      
      // 7. HitL判定
      const requiresHitl = confidence < this.config.hitlThreshold;
      
      // 8. 結果生成
      const result: SelsimilarResult = {
        success: bestCandidate !== null,
        confidence,
        result: bestCandidate,
        reasoning: this.generateReasoning(sourceProduct, bestCandidate, scoredCandidates, confidence),
        toolsUsed: [...new Set(toolsUsed)],
        tokenUsage: {
          input: totalTokens * 0.7,
          output: totalTokens * 0.3,
          total: totalTokens
        },
        costUsd: (totalTokens / 1000) * AI_MODELS['gpt-4o'].costPer1kTokens,
        executionTimeMs: Date.now() - startTime,
        requiresHitl,
        hitlReason: requiresHitl 
          ? `確信度 ${confidence.toFixed(1)}% < 閾値 ${this.config.hitlThreshold}%`
          : undefined,
        selectedProduct: bestCandidate,
        candidates: scoredCandidates,
        selectionReason: bestCandidate 
          ? `スコア${bestCandidate.score.overall.toFixed(1)}で最も類似。次点との差: ${marginToSecond.toFixed(1)}pt`
          : '適合する商品が見つかりませんでした',
        marginToSecond
      };
      
      // 9. AI判断証跡を記録
      await this.recordDecisionTrace(sourceProduct, result);
      
      return result;
      
    } catch (error) {
      return {
        success: false,
        confidence: 0,
        result: null,
        reasoning: `エラー: ${error instanceof Error ? error.message : 'Unknown'}`,
        toolsUsed,
        tokenUsage: { input: 0, output: 0, total: 0 },
        costUsd: 0,
        executionTimeMs: Date.now() - startTime,
        requiresHitl: true,
        hitlReason: 'エージェント実行エラー',
        selectedProduct: null,
        candidates: [],
        selectionReason: 'エラーにより処理中断',
        marginToSecond: 0
      };
    }
  }
  
  /** 検索キーワード生成 */
  private generateSearchKeywords(product: { title: string; brand?: string; model?: string }): string {
    const parts: string[] = [];
    
    if (product.brand) parts.push(product.brand);
    if (product.model) parts.push(product.model);
    
    // タイトルから重要なキーワードを抽出
    const titleWords = product.title
      .replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2)
      .slice(0, 5);
    
    parts.push(...titleWords);
    
    return [...new Set(parts)].join(' ');
  }
  
  /** プラットフォーム検索 */
  private async searchPlatform(keywords: string): Promise<ProductCandidate[]> {
    // 実際の実装ではeBay Browse API/Amazon PA-API等を使用
    // ここではスタブ
    
    const { data, error } = await this.supabase
      .from('products_master')
      .select('*')
      .textSearch('title', keywords.split(' ').join(' | '))
      .limit(this.config.maxCandidates);
    
    if (error || !data) return [];
    
    return data.map(item => ({
      platformId: item.id,
      title: item.title,
      price: item.price || 0,
      currency: 'USD',
      imageUrl: item.image_url || '',
      listingUrl: item.listing_url || '',
      condition: item.condition
    }));
  }
  
  /** 類似度スコア計算 */
  private async calculateSimilarityScore(
    source: { title: string; price?: number; brand?: string; model?: string; condition?: string },
    candidate: ProductCandidate
  ): Promise<SimilarityScore> {
    // タイトル類似度（Jaccard係数）
    const sourceWords = new Set(source.title.toLowerCase().split(/\s+/));
    const candidateWords = new Set(candidate.title.toLowerCase().split(/\s+/));
    const intersection = [...sourceWords].filter(w => candidateWords.has(w)).length;
    const union = new Set([...sourceWords, ...candidateWords]).size;
    const titleSimilarity = union > 0 ? (intersection / union) * 100 : 0;
    
    // 価格適合度
    let priceMatch = 50; // デフォルト
    if (source.price && candidate.price) {
      const priceDiff = Math.abs(source.price - candidate.price) / source.price * 100;
      priceMatch = Math.max(0, 100 - priceDiff * 2);
    }
    
    // ブランド/型番一致
    let brandModelMatch = 50;
    if (source.brand) {
      const brandInTitle = candidate.title.toLowerCase().includes(source.brand.toLowerCase());
      brandModelMatch = brandInTitle ? 100 : 30;
    }
    if (source.model) {
      const modelInTitle = candidate.title.toLowerCase().includes(source.model.toLowerCase());
      brandModelMatch = modelInTitle ? Math.min(brandModelMatch + 30, 100) : brandModelMatch;
    }
    
    // コンディション適合度
    let conditionMatch = 70;
    if (source.condition && candidate.condition) {
      conditionMatch = source.condition.toLowerCase() === candidate.condition.toLowerCase() ? 100 : 50;
    }
    
    // 総合スコア計算（重み付け平均）
    const weights = {
      title: 0.35,
      image: 0.25,
      price: 0.15,
      brandModel: 0.15,
      condition: 0.10
    };
    
    const overall = 
      titleSimilarity * weights.title +
      50 * weights.image + // 画像比較前はデフォルト値
      priceMatch * weights.price +
      brandModelMatch * weights.brandModel +
      conditionMatch * weights.condition;
    
    return {
      overall,
      titleSimilarity,
      imageSimilarity: 50, // 後で更新
      priceMatch,
      brandModelMatch,
      conditionMatch
    };
  }
  
  /** 画像比較 */
  private async compareImages(sourceUrl: string, targetUrl: string): Promise<number> {
    // 実際の実装ではOpenAI Vision APIを使用
    // ここではスタブとしてランダム値を返す
    return 60 + Math.random() * 30;
  }
  
  /** 総合スコア再計算 */
  private recalculateOverallScore(score: SimilarityScore): number {
    const weights = {
      title: 0.30,
      image: 0.30,
      price: 0.15,
      brandModel: 0.15,
      condition: 0.10
    };
    
    return (
      score.titleSimilarity * weights.title +
      score.imageSimilarity * weights.image +
      score.priceMatch * weights.price +
      score.brandModelMatch * weights.brandModel +
      score.conditionMatch * weights.condition
    );
  }
  
  /** 確信度計算 */
  private calculateConfidence(
    candidates: Array<ProductCandidate & { score: SimilarityScore }>,
    best: (ProductCandidate & { score: SimilarityScore }) | null
  ): number {
    if (!best || candidates.length === 0) return 0;
    
    // ベーススコア
    let confidence = best.score.overall;
    
    // 次点との差が大きいほどボーナス
    if (candidates.length > 1) {
      const margin = best.score.overall - candidates[1].score.overall;
      confidence += Math.min(margin * 0.5, 10);
    }
    
    // 候補が少なすぎる場合はペナルティ
    if (candidates.length < 3) {
      confidence -= 10;
    }
    
    return Math.max(0, Math.min(100, confidence));
  }
  
  /** 推論説明生成 */
  private generateReasoning(
    source: { title: string },
    best: (ProductCandidate & { score: SimilarityScore }) | null,
    candidates: Array<ProductCandidate & { score: SimilarityScore }>,
    confidence: number
  ): string {
    const lines: string[] = [];
    
    lines.push(`【検索元】${source.title.substring(0, 50)}...`);
    lines.push(`【候補数】${candidates.length}件`);
    
    if (best) {
      lines.push(`【選択】${best.title.substring(0, 50)}...`);
      lines.push(`【スコア詳細】`);
      lines.push(`  - タイトル類似: ${best.score.titleSimilarity.toFixed(1)}%`);
      lines.push(`  - 画像類似: ${best.score.imageSimilarity.toFixed(1)}%`);
      lines.push(`  - 価格適合: ${best.score.priceMatch.toFixed(1)}%`);
      lines.push(`  - ブランド/型番: ${best.score.brandModelMatch.toFixed(1)}%`);
      lines.push(`  - 総合: ${best.score.overall.toFixed(1)}%`);
    } else {
      lines.push(`【選択】該当なし`);
    }
    
    lines.push(`【確信度】${confidence.toFixed(1)}%`);
    
    if (confidence < this.config.hitlThreshold) {
      lines.push(`⚠️ 確信度が閾値（${this.config.hitlThreshold}%）未満のため、人間の確認が必要です`);
    }
    
    return lines.join('\n');
  }
  
  /** 空結果生成 */
  private createEmptyResult(startTime: number, toolsUsed: string[], reason: string): SelsimilarResult {
    return {
      success: false,
      confidence: 0,
      result: null,
      reasoning: reason,
      toolsUsed,
      tokenUsage: { input: 0, output: 0, total: 0 },
      costUsd: 0,
      executionTimeMs: Date.now() - startTime,
      requiresHitl: true,
      hitlReason: reason,
      selectedProduct: null,
      candidates: [],
      selectionReason: reason,
      marginToSecond: 0
    };
  }
  
  /** AI判断証跡を記録 */
  private async recordDecisionTrace(
    source: { title: string },
    result: SelsimilarResult
  ): Promise<void> {
    await this.supabase.from('core.ai_decision_traces').insert({
      decision_type: 'selsimilar',
      decision_context: {
        platform: this.config.platform,
        marketplace: this.config.marketplace,
        config: this.config
      },
      input_data: source,
      input_summary: source.title.substring(0, 200),
      ai_model: 'gpt-4o',
      ai_confidence_score: result.confidence / 100,
      final_decision: result.requiresHitl ? 'escalated_to_hitl' : 'auto_approved',
      decision_reasoning: result.reasoning,
      was_executed: !result.requiresHitl,
      execution_result: result.selectedProduct ? {
        selected_id: result.selectedProduct.platformId,
        selected_title: result.selectedProduct.title,
        score: result.candidates[0]?.score
      } : null
    });
  }
}

// ========================================
// n8n用Selsimilarノードテンプレート
// ========================================

export const N8N_SELSIMILAR_NODE = `
// ========================================
// N3 Empire OS V8.2.1 - Selsimilar Agent ノード
// 類似商品を自律的に特定し、確信度75%未満はHitLへエスカレーション
// ========================================

const input = $input.first().json;
const auth_context = input.auth_context || {};
const tenant_id = auth_context.tenant_id || '0';

// 設定
const CONFIG = {
  platform: input.platform || 'ebay',
  marketplace: input.marketplace || 'EBAY_US',
  maxCandidates: 10,
  minScoreThreshold: 50,
  hitlThreshold: 75,
  enableVisionCompare: true,
  priceRangePercent: 30
};

// 入力商品情報
const sourceProduct = {
  title: input.title || input.product_title || '',
  imageUrl: input.image_url || input.imageUrl || '',
  price: input.price || input.source_price || null,
  brand: input.brand || '',
  model: input.model || '',
  condition: input.condition || 'used'
};

// 検索キーワード生成
function generateKeywords(product) {
  const parts = [];
  if (product.brand) parts.push(product.brand);
  if (product.model) parts.push(product.model);
  
  const titleWords = product.title
    .replace(/[^\\w\\s]/g, ' ')
    .split(/\\s+/)
    .filter(w => w.length > 2)
    .slice(0, 5);
  
  parts.push(...titleWords);
  return [...new Set(parts)].join(' ');
}

// プラットフォーム検索
async function searchPlatform(keywords) {
  if (CONFIG.platform === 'ebay') {
    // eBay Browse API
    const response = await $http.request({
      method: 'GET',
      url: 'https://api.ebay.com/buy/browse/v1/item_summary/search',
      qs: {
        q: keywords,
        limit: CONFIG.maxCandidates,
        filter: 'deliveryCountry:US'
      },
      headers: {
        'Authorization': 'Bearer ' + $env.EBAY_ACCESS_TOKEN,
        'X-EBAY-C-MARKETPLACE-ID': CONFIG.marketplace
      },
      json: true
    }).catch(() => ({ itemSummaries: [] }));
    
    return (response.itemSummaries || []).map(item => ({
      platformId: item.itemId,
      title: item.title,
      price: parseFloat(item.price?.value || 0),
      currency: item.price?.currency || 'USD',
      imageUrl: item.image?.imageUrl || '',
      listingUrl: item.itemWebUrl || '',
      condition: item.condition,
      seller: {
        name: item.seller?.username || '',
        rating: item.seller?.feedbackPercentage || 0,
        feedbackCount: item.seller?.feedbackScore || 0
      }
    }));
  }
  
  return [];
}

// 類似度スコア計算
function calculateScore(source, candidate) {
  // タイトル類似度
  const sourceWords = new Set(source.title.toLowerCase().split(/\\s+/));
  const candidateWords = new Set(candidate.title.toLowerCase().split(/\\s+/));
  const intersection = [...sourceWords].filter(w => candidateWords.has(w)).length;
  const union = new Set([...sourceWords, ...candidateWords]).size;
  const titleSimilarity = union > 0 ? (intersection / union) * 100 : 0;
  
  // 価格適合度
  let priceMatch = 50;
  if (source.price && candidate.price) {
    const priceDiff = Math.abs(source.price - candidate.price) / source.price * 100;
    priceMatch = Math.max(0, 100 - priceDiff * 2);
  }
  
  // ブランド一致
  let brandMatch = 50;
  if (source.brand && candidate.title.toLowerCase().includes(source.brand.toLowerCase())) {
    brandMatch = 100;
  }
  
  // 総合スコア
  const overall = titleSimilarity * 0.4 + priceMatch * 0.3 + brandMatch * 0.3;
  
  return { overall, titleSimilarity, priceMatch, brandMatch };
}

// 画像比較（Vision API）
async function compareImages(sourceUrl, targetUrl) {
  if (!CONFIG.enableVisionCompare || !sourceUrl || !targetUrl) {
    return 50; // デフォルト値
  }
  
  try {
    const response = await $http.request({
      method: 'POST',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': 'Bearer ' + $env.OPENAI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'あなたは商品画像比較の専門家です。2つの商品画像を比較し、同一商品である可能性を0-100のスコアで評価してください。JSONで { "similarity_score": <number>, "reason": "<string>" } を返してください。'
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: '以下の2つの商品画像を比較してください。' },
              { type: 'image_url', image_url: { url: sourceUrl } },
              { type: 'image_url', image_url: { url: targetUrl } }
            ]
          }
        ],
        max_tokens: 200,
        response_format: { type: 'json_object' }
      },
      json: true
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    return result.similarity_score || 50;
  } catch (e) {
    return 50;
  }
}

// メイン処理
const keywords = input.search_keywords || generateKeywords(sourceProduct);
const candidates = await searchPlatform(keywords);

if (candidates.length === 0) {
  return [{
    json: {
      ...input,
      selsimilar_result: {
        success: false,
        selected_product: null,
        candidates: [],
        confidence: 0,
        reason: '検索結果なし'
      },
      _requires_hitl: true,
      _hitl_reason: '類似商品が見つかりませんでした'
    }
  }];
}

// スコアリング
const scoredCandidates = [];
for (const candidate of candidates) {
  const score = calculateScore(sourceProduct, candidate);
  
  // 画像比較
  if (CONFIG.enableVisionCompare && sourceProduct.imageUrl && candidate.imageUrl) {
    score.imageSimilarity = await compareImages(sourceProduct.imageUrl, candidate.imageUrl);
    score.overall = score.titleSimilarity * 0.3 + score.imageSimilarity * 0.3 + score.priceMatch * 0.2 + score.brandMatch * 0.2;
  }
  
  if (score.overall >= CONFIG.minScoreThreshold) {
    scoredCandidates.push({ ...candidate, score });
  }
}

// ソート
scoredCandidates.sort((a, b) => b.score.overall - a.score.overall);

// 最良候補
const best = scoredCandidates[0] || null;
const second = scoredCandidates[1] || null;

// 確信度計算
let confidence = best ? best.score.overall : 0;
if (best && second) {
  const margin = best.score.overall - second.score.overall;
  confidence += Math.min(margin * 0.5, 10);
}
confidence = Math.min(100, confidence);

// HitL判定
const requiresHitL = confidence < CONFIG.hitlThreshold;

// AI判断証跡を記録
await $http.request({
  method: 'POST',
  url: $env.SUPABASE_URL + '/rest/v1/core.ai_decision_traces',
  headers: {
    'apikey': $env.SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY,
    'Content-Type': 'application/json'
  },
  body: {
    tenant_id,
    decision_type: 'selsimilar',
    decision_context: { platform: CONFIG.platform, marketplace: CONFIG.marketplace },
    input_data: sourceProduct,
    input_summary: sourceProduct.title.substring(0, 200),
    ai_model: 'gpt-4o',
    ai_confidence_score: confidence / 100,
    final_decision: requiresHitL ? 'escalated_to_hitl' : 'auto_approved',
    decision_reasoning: best 
      ? '選択: ' + best.title.substring(0, 100) + ' (スコア: ' + best.score.overall.toFixed(1) + ')'
      : '該当なし',
    was_executed: !requiresHitL,
    execution_result: best ? { selected_id: best.platformId, score: best.score } : null,
    workflow_id: $workflow.id,
    execution_id: $execution.id
  }
}).catch(() => {});

return [{
  json: {
    ...input,
    selsimilar_result: {
      success: best !== null,
      selected_product: best,
      candidates: scoredCandidates,
      confidence,
      margin_to_second: best && second ? best.score.overall - second.score.overall : 0,
      reason: best 
        ? 'スコア' + best.score.overall.toFixed(1) + 'で最も類似'
        : '適合商品なし'
    },
    _requires_hitl: requiresHitL,
    _hitl_reason: requiresHitL 
      ? 'Selsimilar確信度 ' + confidence.toFixed(1) + '% < 閾値 ' + CONFIG.hitlThreshold + '%'
      : null
  }
}];
`;

// ========================================
// Selsimilarプロンプト（GPT-4o用）
// ========================================

export const SELSIMILAR_SYSTEM_PROMPT = `あなたはN3 Empire OSのSelsimilar（類似商品特定）エージェントです。

【役割】
元商品の情報と複数の候補商品から、最も類似度の高い「真の正解」を1件特定します。

【判断基準（重要度順）】
1. 商品名/型番の完全一致（最重要）
2. ブランド/メーカーの一致
3. 画像の視覚的類似性
4. 価格帯の妥当性
5. コンディションの適合

【出力形式】
必ず以下のJSON形式で回答してください：
{
  "selected_index": <最も類似する候補のインデックス（0始まり）またはnull>,
  "confidence": <確信度 0-100>,
  "reasoning": "<選択理由（日本語で簡潔に）>",
  "score_breakdown": {
    "title_match": <0-100>,
    "brand_match": <0-100>,
    "image_similarity": <0-100>,
    "price_match": <0-100>,
    "condition_match": <0-100>
  },
  "warnings": ["<注意点があれば記載>"],
  "alternative_suggestion": "<次点の候補があれば理由とともに記載>"
}

【重要ルール】
- 確信度75%未満の場合は、人間による確認が必要と判断されます
- 完全に一致する商品がない場合は、selected_index: null を返してください
- 曖昧な場合は確信度を低く設定してください（過信禁止）
- 画像がある場合は、画像の類似性を重視してください`;

// ========================================
// エクスポート
// ========================================

export function createSelsimilarAgent(
  config: Partial<SelsimilarConfig>,
  supabase: SupabaseClient
): SelsimilarAgent {
  return new SelsimilarAgent(config, supabase);
}

export default {
  SelsimilarAgent,
  createSelsimilarAgent,
  DEFAULT_SELSIMILAR_CONFIG,
  SELSIMILAR_SYSTEM_PROMPT,
  N8N_SELSIMILAR_NODE
};
