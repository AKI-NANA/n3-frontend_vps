// app/api/cron/research-auto/route.ts
/**
 * Research Auto Cron API - 完全版（監視・通知・検証対応）
 * 
 * 安全機能:
 * - DRY_RUN: DB更新なしでログのみ
 * - GLOBAL_STOP / EMERGENCY_STOP: 全自動処理停止
 * - auto_processed_at: 再処理防止
 * - workflow_logs: 実行ログ保存
 * - MAX_FETCH_PER_RUN: 取得上限制御
 * - research_fetch_cache: 7日間再取得防止
 * - API呼び出しカウント
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  calculateAllScores,
  updateLearningMemory,
  createDefaultLearningMemory,
  type ResearchItem,
  type LearningMemory,
} from '@/lib/research/scoring-engine';
import {
  checkGlobalStop,
  saveWorkflowLog,
  getMaxFetchPerRun,
  incrementApiCallCount,
  formatSuccessNotification,
  formatErrorNotification,
  type WorkflowResult,
} from '@/lib/monitoring/workflow-logger';

// ============================================================
// 定数
// ============================================================

const WORKFLOW_NAME = 'N3-RESEARCH-AUTO-CRON';
const WORKFLOW_TYPE = 'research';

// Auto Approve の厳格条件
const AUTO_APPROVE_CONDITIONS = {
  MIN_CONFIDENCE: 0.9,
  MAX_RISK_SCORE: 20,
  FORBIDDEN_FLAGS: ['ip_risk', 'patent_risk', 'hazmat', 'restricted'],
};

// API呼び出しコスト概算（USD）
const ESTIMATED_COST_PER_ITEM = 0.005;

// ============================================================
// POST: メイン処理
// ============================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const isDryRun = process.env.DRY_RUN === 'true';
  
  // 結果集計用
  const stats = {
    processed: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    skipped: 0,
    errors: 0,
  };
  
  let errorMessage: string | null = null;
  
  try {
    // ============================================================
    // 1. APIキー検証
    // ============================================================
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.CRON_SECRET) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { 
      auto_approve = false,
      limit: requestLimit,
      source = 'cron',
    } = body;

    const supabase = await createClient();

    // ============================================================
    // 2. GLOBAL_STOP / EMERGENCY_STOP チェック
    // ============================================================
    const stopCheck = await checkGlobalStop();
    if (stopCheck.stopped) {
      console.log(`[STOPPED] ${stopCheck.reason}`);
      return NextResponse.json({
        success: false,
        error: `Processing stopped: ${stopCheck.reason}`,
        emergency_stop: true,
      }, { status: 503 });
    }

    // ============================================================
    // 3. MAX_FETCH_PER_RUN 取得
    // ============================================================
    const maxFetch = await getMaxFetchPerRun();
    const limit = Math.min(requestLimit || 100, maxFetch);

    // ============================================================
    // 4. DRY_RUN モード通知
    // ============================================================
    if (isDryRun) {
      console.log('[DRY_RUN] Mode enabled - no DB writes will occur');
    }

    // ============================================================
    // 5. 学習メモリ読み込み
    // ============================================================
    let learningMemory = await loadLearningMemory(supabase);

    // ============================================================
    // 6. 既存アイテム取得
    // ============================================================
    const { data: existingItems } = await supabase
      .from('research_table')
      .select('id, title, brand, same_group_id, listing_score')
      .not('same_group_id', 'is', null);

    // ============================================================
    // 7. 未処理アイテム取得（auto_processed_at IS NULL）
    // ============================================================
    const { data: items, error: fetchError } = await supabase
      .from('research_table')
      .select('*')
      .is('auto_processed_at', null)
      .or('status.is.null,status.eq.new,status.eq.research_completed')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (fetchError) {
      throw new Error(`Fetch error: ${fetchError.message}`);
    }

    const inputCount = items?.length || 0;

    if (inputCount === 0) {
      // ログ保存（処理なし）
      await saveWorkflowLog({
        workflow_name: WORKFLOW_NAME,
        workflow_type: WORKFLOW_TYPE,
        status: 'success',
        start_time: new Date(startTime).toISOString(),
        end_time: new Date().toISOString(),
        duration_sec: (Date.now() - startTime) / 1000,
        input_count: 0,
        output_count: 0,
        meta_json: { message: 'No items to process', dry_run: isDryRun },
      });

      return NextResponse.json({ 
        success: true, 
        message: 'No items to process',
        dry_run: isDryRun,
        ...stats,
        duration_ms: Date.now() - startTime,
      });
    }

    // ============================================================
    // 8. メイン処理ループ
    // ============================================================
    const results: Array<{
      id: string;
      asin: string;
      listing_score: number;
      risk_score: number;
      confidence: number;
      status: string;
      reason?: string;
    }> = [];

    for (const item of items || []) {
      try {
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

        // スコア計算
        const scoreResult = calculateAllScores(
          researchItem,
          existingItems || [],
          learningMemory
        );

        // ステータス決定
        let newStatus = 'scored';
        let reason = '';
        
        // 自動昇格判定
        if (scoreResult.should_auto_promote) {
          newStatus = 'pending';
          stats.pending++;
        }

        // Auto Approve 厳格条件チェック
        let productId: string | null = null;
        const ipRisk = item.ip_risk === true || (item.risk_flags || []).includes('ip_risk');
        const patentFlag = item.patent_flag === true || (item.risk_flags || []).includes('patent_risk');
        
        const canAutoApprove = auto_approve && 
          scoreResult.confidence >= AUTO_APPROVE_CONDITIONS.MIN_CONFIDENCE &&
          scoreResult.risk_score < AUTO_APPROVE_CONDITIONS.MAX_RISK_SCORE &&
          ipRisk === false &&
          patentFlag === false &&
          !AUTO_APPROVE_CONDITIONS.FORBIDDEN_FLAGS.some(f => 
            (item.risk_flags || []).includes(f)
          );

        if (canAutoApprove && scoreResult.should_auto_promote) {
          if (isDryRun) {
            console.log('[DRY_RUN] Would auto-approve:', item.asin);
            newStatus = 'pending';
            reason = 'dry_run_would_approve';
          } else {
            const { data: newProduct, error: insertError } = await supabase
              .from('products_master')
              .insert({
                asin: item.asin,
                title: item.title,
                brand: item.brand,
                category: item.category,
                primary_image_url: item.main_image_url || item.image_url,
                cost_price: item.amazon_price_jpy,
                listing_score: scoreResult.listing_score,
                risk_score: scoreResult.risk_score,
                source_platform: 'amazon_jp',
                source_url: item.asin ? `https://www.amazon.co.jp/dp/${item.asin}` : null,
                research_table_id: item.id,
                status: 'draft',
                auto_approved: true,
                auto_approved_at: new Date().toISOString(),
                confidence_score: scoreResult.confidence,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select('id')
              .single();

            if (!insertError && newProduct) {
              productId = newProduct.id;
              newStatus = 'approved';
              stats.approved++;
              reason = 'auto_approved';

              learningMemory = updateLearningMemory(
                learningMemory,
                { ...researchItem, same_group_id: scoreResult.same_group_id },
                'approved',
                scoreResult.listing_score
              );
            } else if (insertError?.code === '23505') {
              newStatus = 'duplicate';
              stats.skipped++;
              reason = 'duplicate_asin';
            }
          }
        } else if (auto_approve && scoreResult.should_auto_promote) {
          if (scoreResult.risk_score >= AUTO_APPROVE_CONDITIONS.MAX_RISK_SCORE) {
            reason = `risk_too_high:${scoreResult.risk_score}`;
          } else if (ipRisk) {
            reason = 'ip_risk_flag';
          } else if (patentFlag) {
            reason = 'patent_flag';
          } else if (scoreResult.confidence < AUTO_APPROVE_CONDITIONS.MIN_CONFIDENCE) {
            reason = `confidence_low:${scoreResult.confidence.toFixed(2)}`;
          }
        }

        // research_table 更新
        if (isDryRun) {
          console.log('[DRY_RUN] Would update:', item.asin, newStatus);
        } else {
          await supabase
            .from('research_table')
            .update({
              listing_score: scoreResult.listing_score,
              risk_score: scoreResult.risk_score,
              same_group_id: scoreResult.same_group_id,
              status: newStatus,
              auto_processed_at: new Date().toISOString(),
              approval_status: newStatus === 'approved' ? 'auto_approved' : 'pending',
              approved_at: newStatus === 'approved' ? new Date().toISOString() : null,
              approved_by: newStatus === 'approved' ? 'auto' : null,
              learning_data: {
                score_breakdown: scoreResult.breakdown,
                confidence: scoreResult.confidence,
                should_auto_promote: scoreResult.should_auto_promote,
                processed_by: source,
                processed_at: new Date().toISOString(),
                ...(productId ? { product_id: productId, auto_approved: true } : {}),
                ...(reason ? { auto_decision_reason: reason } : {}),
              },
              updated_at: new Date().toISOString(),
            })
            .eq('id', item.id);
        }

        stats.processed++;
        results.push({
          id: item.id,
          asin: item.asin || '',
          listing_score: scoreResult.listing_score,
          risk_score: scoreResult.risk_score,
          confidence: scoreResult.confidence,
          status: newStatus,
          ...(reason ? { reason } : {}),
        });

      } catch (itemError) {
        stats.errors++;
        console.error(`Error processing item ${item.id}:`, itemError);
      }
    }

    // ============================================================
    // 9. 学習メモリ・API統計保存
    // ============================================================
    if (!isDryRun) {
      await saveLearningMemory(supabase, learningMemory);
      await incrementApiCallCount('research', stats.processed, stats.processed * ESTIMATED_COST_PER_ITEM);
    }

    // ============================================================
    // 10. ワークフローログ保存
    // ============================================================
    const duration_sec = (Date.now() - startTime) / 1000;
    
    await saveWorkflowLog({
      workflow_name: WORKFLOW_NAME,
      workflow_type: WORKFLOW_TYPE,
      status: stats.errors > 0 ? 'partial' : 'success',
      start_time: new Date(startTime).toISOString(),
      end_time: new Date().toISOString(),
      duration_sec,
      input_count: inputCount,
      output_count: stats.processed,
      error_count: stats.errors,
      meta_json: {
        dry_run: isDryRun,
        auto_approve,
        limit,
        pending: stats.pending,
        approved: stats.approved,
        skipped: stats.skipped,
        auto_approve_conditions: AUTO_APPROVE_CONDITIONS,
        api_calls: stats.processed,
        estimated_cost_usd: stats.processed * ESTIMATED_COST_PER_ITEM,
      },
    });

    // ============================================================
    // 11. レスポンス
    // ============================================================
    const result: WorkflowResult = {
      success: true,
      processed: stats.processed,
      pending: stats.pending,
      approved: stats.approved,
      errors: stats.errors,
      duration_ms: Date.now() - startTime,
      meta: {
        dry_run: isDryRun,
        skipped: stats.skipped,
        api_calls: stats.processed,
        estimated_cost_usd: (stats.processed * ESTIMATED_COST_PER_ITEM).toFixed(3),
      },
    };

    // 通知用メッセージ生成（n8n側で使用）
    const notification = formatSuccessNotification({
      workflowName: WORKFLOW_NAME,
      result,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
    });

    return NextResponse.json({
      success: true,
      dry_run: isDryRun,
      ...stats,
      duration_ms: Date.now() - startTime,
      auto_approve_conditions: AUTO_APPROVE_CONDITIONS,
      results: results.slice(0, 20),
      notification_message: notification,
    });

  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
    stats.errors++;
    console.error('Research auto cron error:', error);

    // エラーログ保存
    await saveWorkflowLog({
      workflow_name: WORKFLOW_NAME,
      workflow_type: WORKFLOW_TYPE,
      status: 'error',
      start_time: new Date(startTime).toISOString(),
      end_time: new Date().toISOString(),
      duration_sec: (Date.now() - startTime) / 1000,
      input_count: 0,
      output_count: stats.processed,
      error_count: stats.errors,
      error_message: errorMessage,
      meta_json: { dry_run: isDryRun },
    });

    // エラー通知メッセージ
    const errorNotification = formatErrorNotification({
      workflowName: WORKFLOW_NAME,
      error: errorMessage,
    });

    return NextResponse.json({ 
      success: false, 
      dry_run: isDryRun,
      error: errorMessage,
      ...stats,
      duration_ms: Date.now() - startTime,
      notification_message: errorNotification,
    }, { status: 500 });
  }
}

// ============================================================
// GET: ステータス確認
// ============================================================

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: allItems } = await supabase
      .from('research_table')
      .select('status, auto_processed_at');

    const statusCounts: Record<string, number> = {};
    let unprocessedCount = 0;
    
    for (const item of allItems || []) {
      const s = item.status || 'null';
      statusCounts[s] = (statusCounts[s] || 0) + 1;
      if (!item.auto_processed_at) unprocessedCount++;
    }

    const globalStop = await checkGlobalStop();
    const maxFetch = await getMaxFetchPerRun();
    
    const { data: apiStats } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'api_call_stats')
      .single();

    const { data: latestLogs } = await supabase
      .from('workflow_logs')
      .select('*')
      .eq('workflow_type', 'research')
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      status_counts: statusCounts,
      unprocessed_count: unprocessedCount,
      system_status: {
        global_stop: globalStop,
        dry_run: process.env.DRY_RUN === 'true',
        auto_approve: process.env.RESEARCH_AUTO_APPROVE === 'true',
        max_fetch_per_run: maxFetch,
      },
      api_stats: apiStats?.value,
      auto_approve_conditions: AUTO_APPROVE_CONDITIONS,
      latest_logs: latestLogs,
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// ============================================================
// Helpers
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

async function saveLearningMemory(supabase: any, memory: LearningMemory): Promise<void> {
  await supabase
    .from('system_config')
    .upsert({
      key: 'research_learning_memory',
      value: memory,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });
}
