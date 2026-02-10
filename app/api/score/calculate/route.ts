// app/api/score/calculate/route.ts
/**
 * スコア計算API
 * 
 * POST /api/score/calculate
 * 
 * 商品の完全性スコア（listing_score）を計算し、データベースに保存します。
 * 
 * スコア計算基準:
 * - 英語タイトル: 15点
 * - カテゴリID: 15点
 * - HTSコード: 10点
 * - 原産国: 10点
 * - 画像: 15点
 * - 価格: 10点
 * - HTML Description: 10点
 * - 配送設定: 10点
 * - 利益率 > 0: 5点
 * - フィルター通過: ボーナス +5点
 * 
 * 合計: 100点（フィルター通過で105点）
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// スコア計算の重み付け
const SCORE_WEIGHTS = {
  englishTitle: 15,
  categoryId: 15,
  htsCode: 10,
  originCountry: 10,
  hasImage: 15,
  hasPrice: 10,
  hasHtmlDescription: 10,
  hasShipping: 10,
  profitPositive: 5,
  filterPassed: 5, // ボーナス
};

interface ScoreResult {
  id: string;
  sku: string;
  score: number;
  checks: Record<string, boolean>;
  missingItems: string[];
}

/**
 * 商品の完全性スコアを計算
 */
function calculateProductScore(product: any): ScoreResult {
  const listingData = product.listing_data || {};
  
  // 各項目のチェック
  const checks = {
    englishTitle: !!(
      product.english_title || 
      product.title_en || 
      listingData.english_title
    ),
    categoryId: !!(
      product.category_id || 
      product.ebay_category_id || 
      listingData.category_id || 
      listingData.ebay_category_id
    ),
    htsCode: !!product.hts_code,
    originCountry: !!product.origin_country,
    hasImage: !!(
      product.primary_image_url || 
      product.image_url || 
      (product.images && product.images.length > 0) ||
      listingData.image_urls?.length > 0
    ),
    hasPrice: !!(
      product.ddp_price_usd || 
      product.price_usd || 
      listingData.ddp_price_usd || 
      listingData.price_usd
    ),
    hasHtmlDescription: !!(
      product.html_content || 
      product.html_description ||
      listingData.html_description ||
      listingData.html_description_en ||
      listingData.description_html
    ),
    hasShipping: !!(
      product.shipping_policy ||
      listingData.shipping_service ||
      listingData.usa_shipping_policy_name ||
      listingData.carrier_service
    ),
    profitPositive: (product.profit_margin ?? 0) > 0 || (listingData.profit_margin ?? 0) > 0,
    filterPassed: product.filter_passed === true,
  };

  // スコア計算
  let score = 0;
  const missingItems: string[] = [];

  if (checks.englishTitle) {
    score += SCORE_WEIGHTS.englishTitle;
  } else {
    missingItems.push('英語タイトル');
  }

  if (checks.categoryId) {
    score += SCORE_WEIGHTS.categoryId;
  } else {
    missingItems.push('カテゴリID');
  }

  if (checks.htsCode) {
    score += SCORE_WEIGHTS.htsCode;
  } else {
    missingItems.push('HTSコード');
  }

  if (checks.originCountry) {
    score += SCORE_WEIGHTS.originCountry;
  } else {
    missingItems.push('原産国');
  }

  if (checks.hasImage) {
    score += SCORE_WEIGHTS.hasImage;
  } else {
    missingItems.push('画像');
  }

  if (checks.hasPrice) {
    score += SCORE_WEIGHTS.hasPrice;
  } else {
    missingItems.push('価格');
  }

  if (checks.hasHtmlDescription) {
    score += SCORE_WEIGHTS.hasHtmlDescription;
  } else {
    missingItems.push('HTML Description');
  }

  if (checks.hasShipping) {
    score += SCORE_WEIGHTS.hasShipping;
  } else {
    missingItems.push('配送設定');
  }

  if (checks.profitPositive) {
    score += SCORE_WEIGHTS.profitPositive;
  } else {
    missingItems.push('利益率');
  }

  // フィルター通過はボーナス（必須ではない）
  if (checks.filterPassed) {
    score += SCORE_WEIGHTS.filterPassed;
  }

  return {
    id: product.id,
    sku: product.sku || '',
    score,
    checks,
    missingItems,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '商品IDが指定されていません' },
        { status: 400 }
      );
    }

    console.log(`📊 スコア計算開始: ${productIds.length}件`);

    const supabase = await createClient();

    // 商品データを取得
    const { data: products, error: fetchError } = await supabase
      .from('products_master')
      .select('*')
      .in('id', productIds);

    if (fetchError) {
      console.error('商品取得エラー:', fetchError);
      return NextResponse.json(
        { success: false, error: `商品取得エラー: ${fetchError.message}` },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, error: '対象商品が見つかりません' },
        { status: 404 }
      );
    }

    const results: ScoreResult[] = [];
    const errors: { id: string; error: string }[] = [];
    let updatedCount = 0;

    // 各商品のスコアを計算して保存
    for (const product of products) {
      try {
        const scoreResult = calculateProductScore(product);
        results.push(scoreResult);

        // ready_to_list フラグを判定（100点満点中80点以上）
        const isReadyToList = scoreResult.score >= 80 && scoreResult.missingItems.length <= 2;

        // データベースに保存
        const { error: updateError } = await supabase
          .from('products_master')
          .update({
            listing_score: scoreResult.score,
            ready_to_list: isReadyToList,
            score_calculated_at: new Date().toISOString(),
            score_details: {
              checks: scoreResult.checks,
              missingItems: scoreResult.missingItems,
              calculatedAt: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          })
          .eq('id', product.id);

        if (updateError) {
          console.error(`スコア保存エラー [${product.sku}]:`, updateError);
          errors.push({ id: product.id, error: updateError.message });
        } else {
          updatedCount++;
          console.log(`  ✅ [${product.sku}] スコア: ${scoreResult.score}点 ${isReadyToList ? '(出品準備完了)' : ''}`);
        }
      } catch (err: any) {
        console.error(`スコア計算エラー [${product.id}]:`, err);
        errors.push({ id: product.id, error: err.message });
      }
    }

    // 統計情報
    const stats = {
      total: products.length,
      updated: updatedCount,
      failed: errors.length,
      avgScore: results.length > 0 
        ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
        : 0,
      readyCount: results.filter(r => r.score >= 80).length,
      perfectCount: results.filter(r => r.score >= 100).length,
    };

    console.log(`📊 スコア計算完了: ${updatedCount}/${products.length}件更新, 平均${stats.avgScore}点`);

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      results,
      stats,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error: any) {
    console.error('スコア計算APIエラー:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'スコア計算に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/score/calculate?id=xxx
 * 
 * 単一商品のスコアを取得（計算のみ、保存なし）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: '商品IDが指定されていません' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: product, error } = await supabase
      .from('products_master')
      .select('*')
      .eq('id', productId)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { success: false, error: '商品が見つかりません' },
        { status: 404 }
      );
    }

    const scoreResult = calculateProductScore(product);

    return NextResponse.json({
      success: true,
      ...scoreResult,
    });

  } catch (error: any) {
    console.error('スコア取得エラー:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
