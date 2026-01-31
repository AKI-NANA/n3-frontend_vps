/**
 * N3 Empire OS - HTML生成API
 * POST /api/media/generate-html
 * 
 * 商品データからユニバーサルHTML（動画スライド/ブログ/電子書籍）を生成
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  generateUniversalHTML, 
  generateBatchHTML,
  ProductData, 
  ContentConfig 
} from '@/lib/templates/universal-html';

// ============================================================================
// Supabase クライアント
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================================================
// リクエスト型
// ============================================================================

interface GenerateHTMLRequest {
  product_id?: number;
  product_ids?: number[];
  mode: 'video-slide' | 'blog-post' | 'ebook-page';
  language?: 'ja' | 'en';
  include_price?: boolean;
  include_cta?: boolean;
  cta_url?: string;
  theme?: {
    primaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
  };
  save_to_db?: boolean;
}

// ============================================================================
// POST /api/media/generate-html
// ============================================================================

export async function POST(request: Request) {
  try {
    const body: GenerateHTMLRequest = await request.json();
    
    // バリデーション
    if (!body.product_id && (!body.product_ids || body.product_ids.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'product_id または product_ids が必要です' },
        { status: 400 }
      );
    }
    
    if (!body.mode) {
      return NextResponse.json(
        { success: false, error: 'mode が必要です (video-slide, blog-post, ebook-page)' },
        { status: 400 }
      );
    }
    
    // 商品IDリスト
    const productIds = body.product_ids || (body.product_id ? [body.product_id] : []);
    
    // 商品データ取得
    const { data: products, error: fetchError } = await supabase
      .from('products_master')
      .select(`
        id,
        sku,
        product_name,
        title_en,
        description,
        description_en,
        listing_price,
        currency,
        image_url,
        image_urls,
        category,
        brand
      `)
      .in('id', productIds);
    
    if (fetchError) {
      console.error('商品取得エラー:', fetchError);
      return NextResponse.json(
        { success: false, error: '商品データの取得に失敗しました', details: fetchError.message },
        { status: 500 }
      );
    }
    
    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, error: '指定された商品が見つかりません' },
        { status: 404 }
      );
    }
    
    // ProductData形式に変換
    const productDataList: ProductData[] = products.map(p => ({
      id: p.id,
      sku: p.sku,
      title: p.product_name || p.title_en || 'No Title',
      title_en: p.title_en,
      description: p.description || '',
      description_en: p.description_en,
      price: p.listing_price || 0,
      currency: p.currency || 'USD',
      image_url: p.image_url,
      image_urls: p.image_urls,
      category: p.category,
      brand: p.brand
    }));
    
    // 設定
    const config: ContentConfig = {
      mode: body.mode,
      language: body.language || 'ja',
      includePrice: body.include_price !== false,
      includeCTA: body.include_cta !== false,
      ctaUrl: body.cta_url,
      theme: body.theme
    };
    
    // HTML生成
    const results = generateBatchHTML(productDataList, config);
    
    // DB保存（オプション）
    if (body.save_to_db) {
      const insertData = results.map(result => ({
        product_id: result.productId,
        template_type: result.mode,
        html_content: result.html,
        generated_by: 'api',
        metadata: {
          language: config.language,
          include_price: config.includePrice,
          include_cta: config.includeCTA,
          theme: config.theme
        }
      }));
      
      const { data: savedData, error: saveError } = await supabase
        .from('html_templates')
        .upsert(insertData, { 
          onConflict: 'product_id,template_type',
          ignoreDuplicates: false 
        })
        .select('id, product_id, template_type');
      
      if (saveError) {
        console.error('DB保存エラー:', saveError);
        // 保存失敗してもHTML自体は返す
      } else {
        console.log(`${savedData?.length || 0}件のHTMLテンプレートを保存しました`);
      }
    }
    
    // レスポンス
    return NextResponse.json({
      success: true,
      count: results.length,
      mode: body.mode,
      language: config.language,
      results: results.map(r => ({
        product_id: r.productId,
        mode: r.mode,
        html: r.html,
        timestamp: r.timestamp
      }))
    });
    
  } catch (error) {
    console.error('HTML生成エラー:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'HTML生成に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/media/generate-html?product_id=123&mode=blog-post
// ============================================================================

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const productId = searchParams.get('product_id');
  const mode = searchParams.get('mode') as ContentConfig['mode'] || 'blog-post';
  const language = searchParams.get('language') as 'ja' | 'en' || 'ja';
  
  if (!productId) {
    return NextResponse.json(
      { success: false, error: 'product_id が必要です' },
      { status: 400 }
    );
  }
  
  // 商品データ取得
  const { data: product, error: fetchError } = await supabase
    .from('products_master')
    .select(`
      id,
      sku,
      product_name,
      title_en,
      description,
      description_en,
      listing_price,
      currency,
      image_url,
      image_urls,
      category,
      brand
    `)
    .eq('id', parseInt(productId))
    .single();
  
  if (fetchError || !product) {
    return NextResponse.json(
      { success: false, error: '商品が見つかりません' },
      { status: 404 }
    );
  }
  
  const productData: ProductData = {
    id: product.id,
    sku: product.sku,
    title: product.product_name || product.title_en || 'No Title',
    title_en: product.title_en,
    description: product.description || '',
    description_en: product.description_en,
    price: product.listing_price || 0,
    currency: product.currency || 'USD',
    image_url: product.image_url,
    image_urls: product.image_urls,
    category: product.category,
    brand: product.brand
  };
  
  const config: ContentConfig = {
    mode,
    language
  };
  
  const result = generateUniversalHTML(productData, config);
  
  // HTMLを直接返す（プレビュー用）
  if (searchParams.get('raw') === 'true') {
    return new Response(result.html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
  
  return NextResponse.json({
    success: true,
    product_id: result.productId,
    mode: result.mode,
    html: result.html,
    timestamp: result.timestamp
  });
}
