import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// サーバーサイド用Supabaseクライアント（service_roleでRLSバイパス）
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const marketplace = searchParams.get('marketplace') || 'ebay';
    
    const productId = parseInt(id, 10);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    console.log(`[API] Getting HTML for product ${productId}, marketplace: ${marketplace}`);

    // product_html_generatedテーブルからHTML取得
    const { data, error } = await supabaseAdmin
      .from('product_html_generated')
      .select('*')
      .eq('products_master_id', productId)
      .eq('marketplace', marketplace)
      .maybeSingle();

    if (error) {
      console.error('[API] Supabase error:', error);
      
      // テーブルが存在しない場合やカラム名の問題の可能性
      // 別のカラム名でリトライ
      const { data: retryData, error: retryError } = await supabaseAdmin
        .from('product_html_generated')
        .select('*')
        .eq('product_id', productId)
        .eq('marketplace', marketplace)
        .maybeSingle();
      
      if (retryError) {
        console.error('[API] Retry also failed:', retryError);
        return NextResponse.json(
          { error: retryError.message, details: retryError },
          { status: 500 }
        );
      }
      
      if (retryData) {
        console.log('[API] HTML found (via product_id):', !!retryData.generated_html);
        return NextResponse.json({
          html: retryData.generated_html || retryData.html,
          generated_html: retryData.generated_html,
          data: retryData
        });
      }
    }

    if (data) {
      console.log('[API] HTML found:', !!data.generated_html);
      return NextResponse.json({
        html: data.generated_html || data.html,
        generated_html: data.generated_html,
        data: data
      });
    }

    // HTMLが見つからない場合、listing_dataからフォールバック
    console.log('[API] No HTML in product_html_generated, checking listing_data...');
    
    const { data: productData, error: productError } = await supabaseAdmin
      .from('products_master')
      .select('listing_data')
      .eq('id', productId)
      .single();

    if (productError) {
      console.error('[API] Product fetch error:', productError);
      return NextResponse.json(
        { html: null, message: 'No HTML found' },
        { status: 200 }
      );
    }

    const listingData = productData?.listing_data || {};
    const htmlFromListing = listingData.html_description || listingData.description_html;

    if (htmlFromListing) {
      console.log('[API] HTML found in listing_data');
      return NextResponse.json({
        html: htmlFromListing,
        source: 'listing_data'
      });
    }

    console.log('[API] No HTML found anywhere');
    return NextResponse.json(
      { html: null, message: 'No HTML found' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
