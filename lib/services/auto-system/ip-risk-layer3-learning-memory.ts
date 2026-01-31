/**
 * ============================================================
 * N3 IP Risk Engine - Layer3: Learning Memory (自己学習)
 * ============================================================
 * 
 * 指示書②⑤準拠:
 * 
 * テーブル: ip_risk_memory
 * - keywords
 * - image_hash
 * - brand
 * - supplier_url
 * - decision
 * - timestamp
 * 
 * 適用:
 * if similarity_match(ip_risk_memory):
 *     inherit_decision
 * 
 * 学習イベント（⑤）:
 * - eBay削除通知
 * - VEROクレーム
 * - 出品失敗理由
 * - 人間判断時のReject Reason
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export type LearningDecision = 'approved' | 'rejected' | 'blocked' | 'blacklisted';
export type RejectReason = 'patent' | 'trademark' | 'oem_similarity' | 'export_risk' | 'fake_suspicion' | 'vero_claim' | 'ebay_removed' | 'listing_failed' | 'other';
export type SourceType = 'human_feedback' | 'ebay_notification' | 'vero_claim' | 'listing_failure' | 'auto_learning';

export interface LearningMemoryEntry {
  id?: string;
  keywords?: string[];
  image_hash?: string;
  brand?: string;
  supplier_url?: string;
  title_embedding?: number[];
  decision: LearningDecision;
  reject_reason?: RejectReason;
  source_type: SourceType;
  source_product_id?: string;
  source_research_id?: string;
  confidence?: number;
  hit_count?: number;
  created_by?: string;
}

export interface LearningMatchResult {
  matched: boolean;
  inherited_decision?: LearningDecision;
  match_entries: LearningMemoryEntry[];
  confidence: number;
  match_reasons: string[];
}

export class IPRiskLearningMemoryService {
  private supabase;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  /**
   * 学習メモリとのマッチング
   * 指示書: if similarity_match(ip_risk_memory): inherit_decision
   */
  async checkLearningMatch(product: {
    title?: string;
    keywords?: string[];
    brand?: string;
    supplier_url?: string;
    image_hash?: string;
  }): Promise<LearningMatchResult> {
    const result: LearningMatchResult = {
      matched: false,
      match_entries: [],
      confidence: 0,
      match_reasons: [],
    };

    const queries = [];

    // 1. ブランドマッチ
    if (product.brand) {
      queries.push(
        this.supabase
          .from('ip_risk_memory')
          .select('*')
          .ilike('brand', `%${product.brand}%`)
          .in('decision', ['rejected', 'blocked', 'blacklisted'])
      );
    }

    // 2. サプライヤーURLマッチ
    if (product.supplier_url) {
      queries.push(
        this.supabase
          .from('ip_risk_memory')
          .select('*')
          .eq('supplier_url', product.supplier_url)
          .in('decision', ['rejected', 'blocked', 'blacklisted'])
      );
    }

    // 3. 画像ハッシュマッチ
    if (product.image_hash) {
      queries.push(
        this.supabase
          .from('ip_risk_memory')
          .select('*')
          .eq('image_hash', product.image_hash)
          .in('decision', ['rejected', 'blocked', 'blacklisted'])
      );
    }

    // 4. キーワードマッチ（部分一致）
    if (product.keywords && product.keywords.length > 0) {
      queries.push(
        this.supabase
          .from('ip_risk_memory')
          .select('*')
          .overlaps('keywords', product.keywords)
          .in('decision', ['rejected', 'blocked', 'blacklisted'])
      );
    }

    // 全クエリを並列実行
    const results = await Promise.all(queries);

    // マッチング結果を統合
    const allMatches: LearningMemoryEntry[] = [];
    
    results.forEach((res, index) => {
      if (res.data && res.data.length > 0) {
        allMatches.push(...res.data);
        
        // マッチ理由を記録
        const matchTypes = ['Brand', 'Supplier URL', 'Image Hash', 'Keywords'];
        result.match_reasons.push(`${matchTypes[index]} match found (${res.data.length} entries)`);
      }
    });

    if (allMatches.length > 0) {
      result.matched = true;
      result.match_entries = allMatches;

      // 最も厳しい判定を継承
      const decisions = allMatches.map(m => m.decision);
      if (decisions.includes('blacklisted')) {
        result.inherited_decision = 'blacklisted';
      } else if (decisions.includes('blocked')) {
        result.inherited_decision = 'blocked';
      } else if (decisions.includes('rejected')) {
        result.inherited_decision = 'rejected';
      }

      // 信頼度計算（マッチ数と各エントリの信頼度から）
      const avgConfidence = allMatches.reduce((sum, m) => sum + (m.confidence || 1), 0) / allMatches.length;
      result.confidence = Math.min(1, avgConfidence * (1 + allMatches.length * 0.1));

      // ヒットカウントを更新
      await this.incrementHitCounts(allMatches.map(m => m.id!).filter(Boolean));
    }

    return result;
  }

  /**
   * 学習メモリに新規エントリを追加
   * 指示書⑤: 学習イベントをDBに保存
   */
  async addLearning(entry: LearningMemoryEntry): Promise<string | null> {
    // 重複チェック（同じパターンがあれば更新）
    const existingQuery = this.supabase
      .from('ip_risk_memory')
      .select('id, hit_count, confidence');

    if (entry.brand) {
      existingQuery.eq('brand', entry.brand);
    }
    if (entry.supplier_url) {
      existingQuery.eq('supplier_url', entry.supplier_url);
    }
    if (entry.image_hash) {
      existingQuery.eq('image_hash', entry.image_hash);
    }

    const { data: existing } = await existingQuery.maybeSingle();

    if (existing) {
      // 既存エントリを更新
      const { error } = await this.supabase
        .from('ip_risk_memory')
        .update({
          hit_count: (existing.hit_count || 1) + 1,
          confidence: Math.min(1, (existing.confidence || 0.5) + 0.1),
          decision: entry.decision,
          reject_reason: entry.reject_reason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Update learning memory error:', error);
        return null;
      }
      return existing.id;
    }

    // 新規エントリ追加
    const { data, error } = await this.supabase
      .from('ip_risk_memory')
      .insert({
        keywords: entry.keywords,
        image_hash: entry.image_hash,
        brand: entry.brand,
        supplier_url: entry.supplier_url,
        decision: entry.decision,
        reject_reason: entry.reject_reason,
        source_type: entry.source_type,
        source_product_id: entry.source_product_id,
        source_research_id: entry.source_research_id,
        confidence: entry.confidence || 1.0,
        hit_count: 1,
        created_by: entry.created_by,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Add learning memory error:', error);
      return null;
    }

    return data?.id || null;
  }

  /**
   * eBay削除通知からの自動学習
   * 指示書⑤: eBay削除通知
   */
  async learnFromEbayRemoval(productId: string, removalReason: string): Promise<void> {
    // 商品情報を取得
    const { data: product } = await this.supabase
      .from('products_master')
      .select('title, brand, source_url, images')
      .eq('id', productId)
      .single();

    if (!product) return;

    // キーワード抽出（タイトルから）
    const keywords = this.extractKeywords(product.title || '');

    // リジェクト理由を判定
    let rejectReason: RejectReason = 'ebay_removed';
    if (removalReason.toLowerCase().includes('vero')) {
      rejectReason = 'vero_claim';
    } else if (removalReason.toLowerCase().includes('counterfeit') || removalReason.toLowerCase().includes('fake')) {
      rejectReason = 'fake_suspicion';
    } else if (removalReason.toLowerCase().includes('patent')) {
      rejectReason = 'patent';
    } else if (removalReason.toLowerCase().includes('trademark')) {
      rejectReason = 'trademark';
    }

    await this.addLearning({
      keywords,
      brand: product.brand,
      supplier_url: product.source_url,
      decision: 'blocked',
      reject_reason: rejectReason,
      source_type: 'ebay_notification',
      source_product_id: productId,
    });
  }

  /**
   * VEROクレームからの自動学習
   * 指示書⑤: VEROクレーム
   */
  async learnFromVEROClaim(productId: string, brandName: string): Promise<void> {
    const { data: product } = await this.supabase
      .from('products_master')
      .select('title, source_url, images')
      .eq('id', productId)
      .single();

    if (!product) return;

    const keywords = this.extractKeywords(product.title || '');

    await this.addLearning({
      keywords,
      brand: brandName,
      supplier_url: product.source_url,
      decision: 'blacklisted',
      reject_reason: 'vero_claim',
      source_type: 'vero_claim',
      source_product_id: productId,
      confidence: 1.0, // VEROクレームは最高信頼度
    });

    // VEROブランドテーブルにも追加
    await this.supabase
      .from('vero_brands')
      .upsert({
        brand_name: brandName,
        risk_level: 'critical',
        source: 'vero_claim_auto_learning',
        notes: `Auto-learned from VERO claim on product ${productId}`,
      }, {
        onConflict: 'brand_name',
      });
  }

  /**
   * 出品失敗からの自動学習
   * 指示書⑤: 出品失敗理由
   */
  async learnFromListingFailure(productId: string, failureReason: string): Promise<void> {
    const { data: product } = await this.supabase
      .from('products_master')
      .select('title, brand, source_url')
      .eq('id', productId)
      .single();

    if (!product) return;

    const keywords = this.extractKeywords(product.title || '');
    
    // 失敗理由からRejectReasonを判定
    let rejectReason: RejectReason = 'listing_failed';
    if (failureReason.toLowerCase().includes('restricted')) {
      rejectReason = 'export_risk';
    }

    await this.addLearning({
      keywords,
      brand: product.brand,
      supplier_url: product.source_url,
      decision: 'rejected',
      reject_reason: rejectReason,
      source_type: 'listing_failure',
      source_product_id: productId,
      confidence: 0.7, // 出品失敗は中程度の信頼度
    });
  }

  /**
   * 人間フィードバックからの学習
   * 指示書⑤: 人間判断時の Reject Reason UI入力
   */
  async learnFromHumanFeedback(
    productId: string,
    decision: LearningDecision,
    rejectReason: RejectReason,
    userId: string
  ): Promise<void> {
    const { data: product } = await this.supabase
      .from('products_master')
      .select('title, brand, source_url, images')
      .eq('id', productId)
      .single();

    if (!product) return;

    const keywords = this.extractKeywords(product.title || '');

    await this.addLearning({
      keywords,
      brand: product.brand,
      supplier_url: product.source_url,
      decision,
      reject_reason: rejectReason,
      source_type: 'human_feedback',
      source_product_id: productId,
      confidence: 0.9, // 人間判断は高信頼度
      created_by: userId,
    });
  }

  /**
   * ヒットカウントを増加
   */
  private async incrementHitCounts(ids: string[]): Promise<void> {
    if (ids.length === 0) return;

    for (const id of ids) {
      await this.supabase.rpc('increment_ip_risk_memory_hit_count', { memory_id: id });
    }
  }

  /**
   * タイトルからキーワードを抽出
   */
  private extractKeywords(title: string): string[] {
    // 基本的な単語分割
    const words = title
      .toLowerCase()
      .replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= 2);

    // ストップワードを除去
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'for', 'with', 'new', 'free', 'shipping'];
    return words.filter(w => !stopWords.includes(w)).slice(0, 10);
  }

  /**
   * 学習メモリの統計取得
   */
  async getStats(): Promise<{
    total: number;
    by_decision: Record<string, number>;
    by_source: Record<string, number>;
    by_reason: Record<string, number>;
  }> {
    const { data, error } = await this.supabase
      .from('ip_risk_memory')
      .select('decision, source_type, reject_reason');

    if (error || !data) {
      return { total: 0, by_decision: {}, by_source: {}, by_reason: {} };
    }

    const stats = {
      total: data.length,
      by_decision: {} as Record<string, number>,
      by_source: {} as Record<string, number>,
      by_reason: {} as Record<string, number>,
    };

    data.forEach(entry => {
      stats.by_decision[entry.decision] = (stats.by_decision[entry.decision] || 0) + 1;
      stats.by_source[entry.source_type] = (stats.by_source[entry.source_type] || 0) + 1;
      if (entry.reject_reason) {
        stats.by_reason[entry.reject_reason] = (stats.by_reason[entry.reject_reason] || 0) + 1;
      }
    });

    return stats;
  }
}

export const ipRiskLearningMemoryService = new IPRiskLearningMemoryService();
