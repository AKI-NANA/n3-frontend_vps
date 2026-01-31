// app/api/research/catalog-decision/route.ts
/**
 * Catalog Decision API
 * GET: status='pending' のアイテム取得
 * POST: Approve/Reject 処理 + Auto Approve モード (confidence >= 0.9)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  updateLearningMemory, 
  calculateConfidence,
  createDefaultLearningMemory,
  type ResearchItem, 
  type LearningMemory 
} from '@/lib/research/scoring-engine';

// GET: Pending items 取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '100');

    const supabase = await createClient();

    const { data, error, count } = await supabase
      .from('research_table')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('listing_score', { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [], total: count || 0 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// POST: Approve/Reject 処理 + Auto Approve モード
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, decision, reject_reason, auto_mode } = body;

    const supabase = await createClient();

    // ============================================================
    // AUTO APPROVE MODE: confidence >= 0.9 のアイテムを自動承認
    // ============================================================
    if (auto_mode === true) {
      // pending状態の高スコア・低リスクアイテム取得
      const { data: pendingItems, error: fetchError } = await supabase
        .from('research_table')
        .select('*')
        .eq('status', 'pending')
        .gte('listing_score', 85)
        .lt('risk_score', 30);

      if (fetchError) {
        return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
      }

      // 学習メモリ読み込み
      let learningMemory = await loadLearningMemory(supabase);

      let approvedCount = 0;
      let skippedCount = 0;
      const results: Array<{ id: string; asin: string; confidence: number; approved: boolean }> = [];

      for (const item of pendingItems || []) {
        // confidence計算: (listing_score / 100) * (1 - risk_score / 100)
        const confidence = calculateConfidence(item.listing_score ?? 0, item.risk_score ?? 0);

        if (confidence >= 0.9) {
          // 自動承認実行
          const researchItem: ResearchItem = {
            id: item.id,
            asin: item.asin,
            title: item.title,
            brand: item.brand,
            category: item.category,
            same_group_id: item.same_group_id,
          };
          
          learningMemory = updateLearningMemory(learningMemory, researchItem, 'approved', item.listing_score);

          // products_masterにINSERT
          const { data: newProduct, error: insertError } = await supabase
            .from('products_master')
            .insert({
              asin: item.asin,
              title: item.title,
              brand: item.brand,
              category: item.category,
              primary_image_url: item.main_image_url || item.image_url,
              cost_price: item.amazon_price_jpy,
              listing_score: item.listing_score,
              risk_score: item.risk_score,
              source_platform: 'amazon_jp',
              source_url: item.asin ? `https://www.amazon.co.jp/dp/${item.asin}` : null,
              research_table_id: item.id,
              status: 'draft',
              auto_approved: true,
              auto_approved_at: new Date().toISOString(),
              confidence_score: confidence,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select('id')
            .single();

          let productId = newProduct?.id || null;
          if (insertError?.code === '23505') {
            // 重複時は既存を取得
            const { data: existing } = await supabase
              .from('products_master')
              .select('id')
              .eq('asin', item.asin)
              .single();
            productId = existing?.id || null;
          }

          // research_table更新
          await supabase
            .from('research_table')
            .update({
              status: 'approved',
              updated_at: new Date().toISOString(),
              learning_data: {
                ...(item.learning_data || {}),
                auto_approved: true,
                confidence,
                decision: 'approved',
                decision_at: new Date().toISOString(),
                product_id: productId,
              },
            })
            .eq('id', item.id);

          approvedCount++;
          results.push({ id: item.id, asin: item.asin, confidence, approved: true });
        } else {
          skippedCount++;
          results.push({ id: item.id, asin: item.asin, confidence, approved: false });
        }
      }

      // 学習メモリ保存
      await saveLearningMemory(supabase, learningMemory);

      return NextResponse.json({
        success: true,
        mode: 'auto',
        processed: pendingItems?.length || 0,
        approved: approvedCount,
        skipped: skippedCount,
        results,
      });
    }

    // ============================================================
    // 通常モード: 手動 Approve/Reject
    // ============================================================
    if (!id || !['approved', 'rejected'].includes(decision)) {
      return NextResponse.json({ 
        success: false, 
        error: 'id and decision (approved/rejected) required' 
      }, { status: 400 });
    }

    // 1. 対象レコード取得
    const { data: item, error: fetchError } = await supabase
      .from('research_table')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    // 2. 学習メモリ読み込み & 更新
    let learningMemory = await loadLearningMemory(supabase);

    const researchItem: ResearchItem = {
      id: item.id,
      asin: item.asin,
      title: item.title,
      brand: item.brand,
      category: item.category,
      same_group_id: item.same_group_id,
    };

    learningMemory = updateLearningMemory(learningMemory, researchItem, decision, item.listing_score);

    // 学習メモリ保存
    await saveLearningMemory(supabase, learningMemory);

    // 3. Approve: products_master へコピー
    let productId: string | null = null;
    if (decision === 'approved') {
      const { data: newProduct, error: insertError } = await supabase
        .from('products_master')
        .insert({
          asin: item.asin,
          title: item.title,
          brand: item.brand,
          category: item.category,
          primary_image_url: item.main_image_url || item.image_url,
          cost_price: item.amazon_price_jpy,
          estimated_profit_jpy: item.estimated_profit_jpy,
          estimated_profit_margin: item.estimated_profit_margin,
          source_platform: 'amazon_jp',
          source_url: item.asin ? `https://www.amazon.co.jp/dp/${item.asin}` : null,
          research_table_id: item.id,
          listing_score: item.listing_score,
          risk_score: item.risk_score,
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (!insertError && newProduct) {
        productId = newProduct.id;
      } else if (insertError?.code === '23505') {
        const { data: existing } = await supabase
          .from('products_master')
          .select('id')
          .eq('asin', item.asin)
          .single();
        productId = existing?.id || null;
      }
    }

    // 4. research_table ステータス更新
    await supabase
      .from('research_table')
      .update({
        status: decision,
        updated_at: new Date().toISOString(),
        learning_data: {
          ...(item.learning_data || {}),
          decision,
          decision_at: new Date().toISOString(),
          ...(reject_reason ? { reject_reason } : {}),
          ...(productId ? { product_id: productId } : {}),
        },
      })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      decision,
      product_id: productId,
    });

  } catch (error) {
    console.error('Catalog decision error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// ============================================================
// Helper: 学習メモリ読み込み
// ============================================================
async function loadLearningMemory(supabase: any): Promise<LearningMemory> {
  const { data } = await supabase
    .from('system_config')
    .select('value')
    .eq('key', 'research_learning_memory')
    .single();

  if (data?.value) {
    return {
      brand_scores: data.value.brand_scores || {},
      category_scores: data.value.category_scores || {},
      keyword_scores: data.value.keyword_scores || {},
      similar_history: data.value.similar_history || {},
      updated_at: data.value.updated_at,
    };
  }

  return createDefaultLearningMemory();
}

// ============================================================
// Helper: 学習メモリ保存
// ============================================================
async function saveLearningMemory(supabase: any, memory: LearningMemory): Promise<void> {
  await supabase
    .from('system_config')
    .upsert({
      key: 'research_learning_memory',
      value: memory,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });
}
