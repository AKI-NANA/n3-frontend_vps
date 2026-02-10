/**
 * 商品健全性スコア取得API
 *
 * GET /api/products/[id]/health-score
 * - キャッシュされたhealth scoreを取得
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const supabase = createClient();

    // products_masterテーブルからhealth_score関連データを取得
    const { data: product, error } = await supabase
      .from('products_master')
      .select('id, sku, title, title_en, description, description_en, current_price, listing_price, category_name, primary_image_url, ai_health_score, ai_improvements, ai_vision_analysis')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // キャッシュされたスコアがある場合は返す
    if (product.ai_health_score) {
      return NextResponse.json({
        overallScore: product.ai_health_score.overallScore || 0,
        breakdown: product.ai_health_score.breakdown || {},
        improvements: product.ai_improvements || [],
        visionAnalysis: product.ai_vision_analysis || null,
      });
    }

    // キャッシュがない場合は空のレスポンス
    return NextResponse.json({
      overallScore: 0,
      breakdown: {
        imageQuality: 0,
        titleQuality: 0,
        descriptionQuality: 0,
        pricingStrategy: 0,
        seoOptimization: 0,
      },
      improvements: [],
      visionAnalysis: null,
    });

  } catch (error: any) {
    console.error('Health score fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch health score' },
      { status: 500 }
    );
  }
}
