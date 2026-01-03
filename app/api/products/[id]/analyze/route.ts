/**
 * 商品AI分析API
 *
 * POST /api/products/[id]/analyze
 * - Gemini Visionを使用して商品を分析
 * - Health scoreを計算
 * - DBに結果を保存
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateHealthScore } from '@/lib/services/ai/health-score-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const supabase = createClient();

    // 商品データを取得
    const { data: product, error: fetchError } = await supabase
      .from('products_master')
      .select('id, sku, title, title_en, description, description_en, current_price, listing_price, category_name, primary_image_url, gallery_images')
      .eq('id', productId)
      .single();

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // 画像URLを抽出
    const images: string[] = [];
    if (product.primary_image_url) {
      images.push(product.primary_image_url);
    }
    if (product.gallery_images && Array.isArray(product.gallery_images)) {
      images.push(...product.gallery_images.map((img: any) => img.url || img).filter(Boolean));
    }

    // AI分析実行
    console.log(`Analyzing product ${productId}...`);
    const healthScore = await calculateHealthScore({
      id: product.id,
      sku: product.sku,
      title: product.title,
      title_en: product.title_en,
      description: product.description,
      description_en: product.description_en,
      price: product.listing_price || product.current_price,
      category: product.category_name,
      primary_image_url: product.primary_image_url,
      images,
    });

    console.log(`Analysis complete. Score: ${healthScore.overallScore}`);

    // 結果をDBに保存
    const { error: updateError } = await supabase
      .from('products_master')
      .update({
        ai_health_score: {
          overallScore: healthScore.overallScore,
          breakdown: healthScore.breakdown,
        },
        ai_improvements: healthScore.improvements,
        ai_vision_analysis: healthScore.visionAnalysis || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);

    if (updateError) {
      console.error('Failed to save health score:', updateError);
      // エラーでも分析結果は返す
    }

    return NextResponse.json(healthScore);

  } catch (error: any) {
    console.error('Product analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze product' },
      { status: 500 }
    );
  }
}
