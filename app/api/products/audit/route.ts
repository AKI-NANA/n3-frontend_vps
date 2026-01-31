// app/api/products/audit/route.ts
/**
 * N3出品監査API
 * 
 * 機能:
 * - 商品の監査実行（第1層：ルールエンジン）
 * - 監査結果のDB保存
 * - 一括監査
 * - AI監査ステータス管理（ハイブリッドAI監査パイプライン対応）
 * 
 * @updated 2025-01-16 ハイブリッドAI監査パイプライン対応
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { AiAuditStatus } from '@/types/hybrid-ai-pipeline';
import { 
  auditProduct, 
  auditProducts, 
  generateAuditSummary,
  detectOriginFromTitle,
  detectMaterialFromText,
  detectBatteryRisk,
  type ProductAuditReport 
} from '@/lib/services/audit';

/**
 * POST: 商品の監査を実行
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds, saveToDb = true } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'productIds は必須です（配列）'
      }, { status: 400 });
    }

    console.log(`🔍 監査開始: ${productIds.length}件`);

    const supabase = await createClient();

    // 商品データを取得
    const { data: products, error: fetchError } = await supabase
      .from('products_master')
      .select('*')
      .in('id', productIds);

    if (fetchError) {
      console.error('❌ 商品取得エラー:', fetchError);
      return NextResponse.json({
        success: false,
        error: `商品取得に失敗: ${fetchError.message}`
      }, { status: 500 });
    }

    if (!products || products.length === 0) {
      return NextResponse.json({
        success: false,
        error: '該当する商品が見つかりません'
      }, { status: 404 });
    }

    // 監査実行
    const auditReports = auditProducts(products);
    const summary = generateAuditSummary(auditReports);

    console.log(`✅ 監査完了: ${summary.total}件 (Error: ${summary.errorCount}, Warning: ${summary.warningCount}, OK: ${summary.okCount})`);

    // DBに保存
    if (saveToDb) {
      const updatePromises = auditReports.map(async (report) => {
        const product = products.find(p => p.id === report.productId);
        if (!product) return;

        // 原産国・素材の検出結果
        const originDetection = detectOriginFromTitle(product.title || '');
        const materialDetection = detectMaterialFromText(product.title || '');
        const hasBatteryRisk = detectBatteryRisk(product.title || '', product.category_name || product.category);

        // 原産国矛盾チェック
        const currentOrigin = product.origin_country?.toUpperCase();
        const hasOriginMismatch = originDetection.country && currentOrigin && originDetection.country !== currentOrigin;

        // 高関税チェック
        const dutyRate = product.hts_duty_rate || product.duty_rate || 0;
        const hasHighDutyRisk = dutyRate > 0.05;

        // 素材リスクチェック
        const hasMaterialRisk = materialDetection.dutyRisk > 0.05;

        // 監査ログの作成
        const auditLogs = report.results.map(r => ({
          timestamp: report.timestamp,
          ruleId: r.ruleId,
          severity: r.severity,
          field: r.field,
          currentValue: r.currentValue,
          expectedValue: r.expectedValue,
          message: r.messageJa,
        }));

        // DB更新
        const { error: updateError } = await supabase
          .from('products_master')
          .update({
            audit_score: report.score,
            audit_severity: report.overallSeverity,
            audit_logs: auditLogs,
            last_audit_at: report.timestamp,
            has_high_duty_risk: hasHighDutyRisk,
            has_material_risk: hasMaterialRisk,
            has_battery_risk: hasBatteryRisk,
            has_origin_mismatch: hasOriginMismatch,
            origin_detected: originDetection.country,
            origin_detection_confidence: originDetection.confidence,
            material_detected: materialDetection.material,
            updated_at: new Date().toISOString(),
          })
          .eq('id', report.productId);

        if (updateError) {
          console.error(`❌ 商品 ${report.productId} の更新エラー:`, updateError);
        }
      });

      await Promise.all(updatePromises);
      console.log('💾 監査結果をDBに保存しました');
    }

    return NextResponse.json({
      success: true,
      data: {
        reports: auditReports,
        summary,
      }
    });

  } catch (error) {
    console.error('❌ 監査APIエラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'サーバーエラー'
    }, { status: 500 });
  }
}

/**
 * GET: 監査サマリーを取得
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity');
    const limit = parseInt(searchParams.get('limit') || '100');

    const supabase = await createClient();

    let query = supabase
      .from('products_master')
      .select('id, title, audit_score, audit_severity, audit_logs, last_audit_at, has_high_duty_risk, has_material_risk, has_battery_risk, has_origin_mismatch')
      .order('audit_score', { ascending: true })
      .limit(limit);

    if (severity) {
      query = query.eq('audit_severity', severity);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ 監査データ取得エラー:', error);
      return NextResponse.json({
        success: false,
        error: `データ取得に失敗: ${error.message}`
      }, { status: 500 });
    }

    // サマリー計算
    const total = data?.length || 0;
    const errorCount = data?.filter(p => p.audit_severity === 'error').length || 0;
    const warningCount = data?.filter(p => p.audit_severity === 'warning').length || 0;
    const okCount = data?.filter(p => p.audit_severity === 'ok').length || 0;
    const averageScore = total > 0 
      ? Math.round(data!.reduce((sum, p) => sum + (p.audit_score || 0), 0) / total)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        products: data,
        summary: {
          total,
          errorCount,
          warningCount,
          okCount,
          averageScore,
        }
      }
    });

  } catch (error) {
    console.error('❌ 監査サマリー取得エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'サーバーエラー'
    }, { status: 500 });
  }
}

/**
 * PATCH: AI監査ステータスを更新（ハイブリッドAI監査パイプライン）
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, status, report, score } = body;

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'productId は必須です'
      }, { status: 400 });
    }

    // 有効なステータス値のチェック
    const validStatuses: AiAuditStatus[] = ['pending', 'processing_batch', 'warning', 'manual_check', 'clear'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        error: `無効なステータス値: ${status}`
      }, { status: 400 });
    }

    const supabase = await createClient();

    // 更新データを構築
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updates.ai_audit_status = status;
      updates.ai_audit_needs_review = (status === 'warning' || status === 'manual_check');
    }

    if (report) {
      updates.ai_audit_report = report;
    }

    if (score !== undefined) {
      updates.ai_confidence_score = score;
    }

    // DB更新
    const { data, error } = await supabase
      .from('products_master')
      .update(updates)
      .eq('id', productId)
      .select('id, ai_audit_status, ai_confidence_score, ai_audit_needs_review')
      .single();

    if (error) {
      console.error('❌ AI監査ステータス更新エラー:', error);
      return NextResponse.json({
        success: false,
        error: `更新に失敗: ${error.message}`
      }, { status: 500 });
    }

    console.log(`✅ AI監査ステータス更新: productId=${productId}, status=${status || '(変更なし)'}`);

    return NextResponse.json({
      success: true,
      data: {
        productId: data.id,
        auditStatus: data.ai_audit_status,
        confidenceScore: data.ai_confidence_score,
        needsReview: data.ai_audit_needs_review,
      }
    });

  } catch (error) {
    console.error('❌ AI監査ステータス更新エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'サーバーエラー'
    }, { status: 500 });
  }
}
