// app/api/research/send-to-catalog/route.ts
/**
 * Send to Catalog API
 * - scoring計算
 * - 自動昇格判定: listing_score >= 85 && risk_score < 30 → status='pending'
 * - same_group_id 内で最高 listing_score を代表値として継承
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  calculateAllScores,
  createDefaultLearningMemory,
  type ResearchItem,
  type LearningMemory,
} from '@/lib/research/scoring-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'ids required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. 対象レコード取得
    const { data: items, error: fetchError } = await supabase
      .from('research_table')
      .select('*')
      .in('id', ids);

    if (fetchError || !items?.length) {
      return NextResponse.json({ success: false, error: fetchError?.message || 'No items' }, { status: 404 });
    }

    // 2. 学習メモリ読み込み
    let learningMemory: LearningMemory = createDefaultLearningMemory();
    const { data: configData } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'research_learning_memory')
      .single();
    
    if (configData?.value) {
      learningMemory = {
        brand_scores: configData.value.brand_scores || {},
        category_scores: configData.value.category_scores || {},
        keyword_scores: configData.value.keyword_scores || {},
        similar_history: configData.value.similar_history || {},
        updated_at: configData.value.updated_at,
      };
    }

    // 3. 既存アイテム取得（same_group_id, listing_score含む）
    const { data: existingItems } = await supabase
      .from('research_table')
      .select('id, title, brand, same_group_id, listing_score')
      .not('same_group_id', 'is', null);

    // 4. 各アイテムのスコア計算 & 更新
    let updated = 0;
    let autoPromoted = 0;
    
    for (const item of items) {
      const researchItem: ResearchItem = {
        id: item.id,
        asin: item.asin,
        title: item.title,
        brand: item.brand,
        category: item.category,
        price_jpy: item.price_jpy || item.amazon_price_jpy,
        amazon_price_jpy: item.amazon_price_jpy,
        estimated_profit_jpy: item.estimated_profit_jpy,
        estimated_profit_margin: item.estimated_profit_margin,
        monthly_sales_estimate: item.monthly_sales_estimate,
        bsr_current: item.bsr_current,
        fba_offer_count: item.fba_offer_count,
        is_amazon: item.is_amazon,
        risk_flags: item.risk_flags || [],
      };

      // 統合スコア計算（学習メモリ、類似ボーナス、グループ継承を反映）
      const scoreResult = calculateAllScores(
        researchItem, 
        existingItems || [], 
        learningMemory
      );

      // 自動昇格判定: listing_score >= 85 && risk_score < 30 → status='pending'
      const newStatus = scoreResult.should_auto_promote ? 'pending' : item.status;
      if (scoreResult.should_auto_promote) {
        autoPromoted++;
      }

      const { error: updateError } = await supabase
        .from('research_table')
        .update({
          listing_score: scoreResult.listing_score,
          risk_score: scoreResult.risk_score,
          same_group_id: scoreResult.same_group_id,
          status: newStatus,
          learning_data: { 
            score_breakdown: scoreResult.breakdown,
            confidence: scoreResult.confidence,
            should_auto_promote: scoreResult.should_auto_promote,
            sent_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id);

      if (!updateError) updated++;
    }

    return NextResponse.json({ 
      success: true, 
      updated, 
      auto_promoted: autoPromoted,
      total: ids.length,
    });

  } catch (error) {
    console.error('Send to catalog error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
