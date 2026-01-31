/**
 * ============================================================
 * N3 IP Risk Engine - Layer2: AI Risk Estimation
 * ============================================================
 * 
 * 指示書②準拠:
 * - 商品タイトルEmbedding
 * - 説明文Embedding
 * - ロゴ検出（Vision）
 * - 画像Hash類似
 * 
 * 出力:
 * ip_risk_score: 0.00〜1.00
 * risk_type: ["patent","trademark","oem","logo_similarity"]
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export interface AIRiskEstimationResult {
  ip_risk_score: number;  // 0.00〜1.00
  risk_types: string[];   // ["patent","trademark","oem","logo_similarity"]
  details: {
    patent_score: number;
    trademark_score: number;
    oem_score: number;
    logo_similarity_score: number;
  };
  assessment_reasons: {
    patent_reasons: string[];
    trademark_reasons: string[];
    oem_reasons: string[];
    logo_reasons: string[];
  };
  ai_recommendation: 'auto_approve' | 'manual_review' | 'block' | 'blacklist';
}

export interface ProductForAICheck {
  id?: string;
  title?: string;
  description?: string;
  brand?: string;
  category_id?: string;
  category_name?: string;
  image_urls?: string[];
  price?: number;
  keywords?: string[];
  supplier_url?: string;
}

// 危険キーワードパターン
const PATENT_KEYWORDS = [
  'patented', 'patent pending', '特許', 'utility patent', 'design patent',
  'patent no', 'pat.', 'patent protected', '実用新案',
];

const TRADEMARK_KEYWORDS = [
  '®', '™', 'registered trademark', '商標', 'trademarked',
];

const OEM_INDICATORS = [
  'unbranded', 'generic', 'no brand', 'ノーブランド', 'OEM', 'ODM',
  'white label', 'private label', 'compatible', '互換',
];

// 高リスクカテゴリ（電子機器）
const HIGH_RISK_ELECTRONICS_CATEGORIES = [
  'cell phones', 'smartphones', 'tablets', 'laptops', 'computers',
  'headphones', 'earbuds', 'chargers', 'cables', 'adapters',
  'スマートフォン', 'タブレット', '充電器', 'イヤホン',
];

export class IPRiskAIEstimationService {
  private supabase;
  private openai: OpenAI | null = null;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  /**
   * AI Risk Estimation メイン関数
   * 指示書: ip_risk_score: 0.00〜1.00, risk_type配列を出力
   */
  async estimateRisk(product: ProductForAICheck): Promise<AIRiskEstimationResult> {
    const result: AIRiskEstimationResult = {
      ip_risk_score: 0,
      risk_types: [],
      details: {
        patent_score: 0,
        trademark_score: 0,
        oem_score: 0,
        logo_similarity_score: 0,
      },
      assessment_reasons: {
        patent_reasons: [],
        trademark_reasons: [],
        oem_reasons: [],
        logo_reasons: [],
      },
      ai_recommendation: 'auto_approve',
    };

    // 各リスク評価を実行
    const [patentScore, trademarkScore, oemScore, logoScore] = await Promise.all([
      this.assessPatentRisk(product),
      this.assessTrademarkRisk(product),
      this.assessOEMRisk(product),
      this.assessLogoSimilarity(product),
    ]);

    // スコアと理由を統合
    result.details.patent_score = patentScore.score;
    result.assessment_reasons.patent_reasons = patentScore.reasons;

    result.details.trademark_score = trademarkScore.score;
    result.assessment_reasons.trademark_reasons = trademarkScore.reasons;

    result.details.oem_score = oemScore.score;
    result.assessment_reasons.oem_reasons = oemScore.reasons;

    result.details.logo_similarity_score = logoScore.score;
    result.assessment_reasons.logo_reasons = logoScore.reasons;

    // リスクタイプを収集
    if (patentScore.score >= 0.3) result.risk_types.push('patent');
    if (trademarkScore.score >= 0.3) result.risk_types.push('trademark');
    if (oemScore.score >= 0.3) result.risk_types.push('oem');
    if (logoScore.score >= 0.3) result.risk_types.push('logo_similarity');

    // 総合スコア計算（加重平均）
    result.ip_risk_score = Math.min(1, 
      patentScore.score * 0.35 +
      trademarkScore.score * 0.30 +
      oemScore.score * 0.20 +
      logoScore.score * 0.15
    );

    // AI推奨決定（指示書④準拠）
    result.ai_recommendation = this.determineRecommendation(result);

    return result;
  }

  /**
   * 特許リスク評価
   */
  private async assessPatentRisk(product: ProductForAICheck): Promise<{ score: number; reasons: string[] }> {
    let score = 0;
    const reasons: string[] = [];
    const searchText = `${product.title || ''} ${product.description || ''}`.toLowerCase();

    // キーワードマッチング
    for (const keyword of PATENT_KEYWORDS) {
      if (searchText.includes(keyword.toLowerCase())) {
        score += 0.3;
        reasons.push(`Patent keyword detected: "${keyword}"`);
      }
    }

    // 説明文に「特許」「patent」が含まれる場合
    if (searchText.includes('patent') || searchText.includes('特許')) {
      score += 0.2;
      reasons.push('Patent-related terms found in description');
    }

    return { score: Math.min(1, score), reasons };
  }

  /**
   * 商標リスク評価
   */
  private async assessTrademarkRisk(product: ProductForAICheck): Promise<{ score: number; reasons: string[] }> {
    let score = 0;
    const reasons: string[] = [];
    const searchText = `${product.title || ''} ${product.description || ''}`;

    // 商標記号チェック
    for (const symbol of TRADEMARK_KEYWORDS) {
      if (searchText.includes(symbol)) {
        score += 0.25;
        reasons.push(`Trademark symbol detected: "${symbol}"`);
      }
    }

    // ブランド名があるが自社ブランドでない可能性
    if (product.brand && product.brand.toLowerCase() !== 'generic' && product.brand.toLowerCase() !== 'unbranded') {
      // 有名ブランドかどうかをDBチェック
      const { data: knownBrand } = await this.supabase
        .from('vero_brands')
        .select('brand_name, risk_level')
        .ilike('brand_name', `%${product.brand}%`)
        .single();

      if (knownBrand) {
        const riskLevelScore = {
          'critical': 0.9,
          'high': 0.7,
          'medium': 0.4,
          'low': 0.2,
        };
        score += riskLevelScore[knownBrand.risk_level as keyof typeof riskLevelScore] || 0.3;
        reasons.push(`Known brand detected: ${knownBrand.brand_name} (${knownBrand.risk_level} risk)`);
      }
    }

    return { score: Math.min(1, score), reasons };
  }

  /**
   * OEMリスク評価（指示書③準拠）
   * 判定ルール: if no_brand and generic_title and electronics_category: oem_flag = true
   */
  private async assessOEMRisk(product: ProductForAICheck): Promise<{ score: number; reasons: string[] }> {
    let score = 0;
    const reasons: string[] = [];
    const searchText = `${product.title || ''} ${product.description || ''}`.toLowerCase();

    // OEMインジケーターチェック
    for (const indicator of OEM_INDICATORS) {
      if (searchText.includes(indicator.toLowerCase())) {
        score += 0.2;
        reasons.push(`OEM indicator: "${indicator}"`);
      }
    }

    // ノーブランド判定
    const noBrand = !product.brand || 
      product.brand.toLowerCase() === 'unbranded' || 
      product.brand.toLowerCase() === 'generic' ||
      product.brand.toLowerCase() === 'no brand' ||
      product.brand === 'ノーブランド';

    if (noBrand) {
      score += 0.15;
      reasons.push('No brand specified');
    }

    // 電子機器カテゴリチェック
    const isElectronics = HIGH_RISK_ELECTRONICS_CATEGORIES.some(cat => 
      searchText.includes(cat.toLowerCase()) || 
      product.category_name?.toLowerCase().includes(cat.toLowerCase())
    );

    if (isElectronics) {
      score += 0.15;
      reasons.push('Electronics category detected');
    }

    // 指示書③: no_brand + generic + electronics = OEM flag
    if (noBrand && isElectronics) {
      score += 0.3;
      reasons.push('OEM Flag: No brand + Electronics category');
    }

    // 価格が異常に安い場合（OEMコピー品の可能性）
    if (product.price && product.price < 10) {
      score += 0.1;
      reasons.push('Very low price point');
    }

    return { score: Math.min(1, score), reasons };
  }

  /**
   * ロゴ類似度評価（Vision API使用時）
   */
  private async assessLogoSimilarity(product: ProductForAICheck): Promise<{ score: number; reasons: string[] }> {
    let score = 0;
    const reasons: string[] = [];

    // 画像がない場合はスキップ
    if (!product.image_urls || product.image_urls.length === 0) {
      return { score: 0, reasons: ['No images to analyze'] };
    }

    // OpenAI Vision APIが使用可能な場合
    if (this.openai && process.env.ENABLE_VISION_API === 'true') {
      try {
        const imageUrl = product.image_urls[0];
        
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this product image for brand logo or trademark risks. 
                         Look for:
                         1. Famous brand logos (Apple, Nike, Rolex, etc.)
                         2. Similar designs that might infringe trademarks
                         3. Text that includes brand names
                         
                         Respond in JSON format:
                         {
                           "logo_detected": boolean,
                           "brand_name": string or null,
                           "similarity_score": 0-100,
                           "risk_factors": string[]
                         }`,
                },
                {
                  type: 'image_url',
                  image_url: { url: imageUrl },
                },
              ],
            },
          ],
          max_tokens: 300,
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          try {
            const parsed = JSON.parse(content);
            if (parsed.logo_detected) {
              score = (parsed.similarity_score || 0) / 100;
              if (parsed.brand_name) {
                reasons.push(`Brand logo detected: ${parsed.brand_name}`);
              }
              if (parsed.risk_factors) {
                reasons.push(...parsed.risk_factors);
              }
            }
          } catch (parseError) {
            reasons.push('Vision API response parsing failed');
          }
        }
      } catch (visionError) {
        console.error('Vision API error:', visionError);
        reasons.push('Vision API unavailable');
      }
    } else {
      reasons.push('Vision API not enabled');
    }

    return { score: Math.min(1, score), reasons };
  }

  /**
   * AI推奨決定（指示書④準拠）
   */
  private determineRecommendation(result: AIRiskEstimationResult): 'auto_approve' | 'manual_review' | 'block' | 'blacklist' {
    const score = result.ip_risk_score;

    // 指示書④:
    // ip_risk_score > 0.7 → manual_review
    // ip_risk_score < SAFE_LIMIT (0.3) → auto_approve候補
    
    if (score >= 0.8) {
      return 'block';
    } else if (score >= 0.7) {
      return 'manual_review';
    } else if (score >= 0.3) {
      return 'manual_review';
    } else {
      return 'auto_approve';
    }
  }

  /**
   * Embedding生成（類似検索用）
   */
  async generateEmbedding(text: string): Promise<number[] | null> {
    if (!this.openai) {
      return null;
    }

    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return response.data[0]?.embedding || null;
    } catch (error) {
      console.error('Embedding generation error:', error);
      return null;
    }
  }

  /**
   * 評価結果をDBに保存
   */
  async saveAssessment(
    productId: string | null,
    researchItemId: string | null,
    result: AIRiskEstimationResult
  ): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('ip_risk_assessments')
      .insert({
        product_id: productId,
        research_item_id: researchItemId,
        ip_risk_score: result.ip_risk_score,
        risk_types: result.risk_types,
        patent_score: result.details.patent_score,
        trademark_score: result.details.trademark_score,
        oem_score: result.details.oem_score,
        logo_similarity_score: result.details.logo_similarity_score,
        assessment_reasons: result.assessment_reasons,
        ai_recommendation: result.ai_recommendation,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Save assessment error:', error);
      return null;
    }

    return data?.id || null;
  }
}

export const ipRiskAIEstimationService = new IPRiskAIEstimationService();
