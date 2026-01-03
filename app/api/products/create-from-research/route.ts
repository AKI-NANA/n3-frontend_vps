/**
 * リサーチ結果から商品を作成
 * 
 * POST /api/products/create-from-research
 * 
 * Amazon Researchの結果をproducts_masterに登録
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CreateFromResearchRequest {
  asin: string;
  title?: string;
  image_url?: string;
  price_jpy?: number;
  brand?: string;
  category?: string;
  source?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateFromResearchRequest = await request.json();
    
    if (!body.asin) {
      return NextResponse.json(
        { success: false, error: 'ASIN is required' },
        { status: 400 }
      );
    }
    
    // 既存チェック
    const { data: existing } = await supabase
      .from('products_master')
      .select('id')
      .eq('asin', body.asin)
      .single();
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'ASIN already exists', product_id: existing.id },
        { status: 409 }
      );
    }
    
    // SKU生成（ASINベース）
    const timestamp = Date.now().toString(36).toUpperCase();
    const sku = `AMZ-${body.asin}-${timestamp}`;
    
    // 商品作成
    const { data, error } = await supabase
      .from('products_master')
      .insert({
        sku,
        asin: body.asin,
        title_ja: body.title,
        main_image_url: body.image_url,
        price_jpy: body.price_jpy,
        brand: body.brand,
        category: body.category,
        source: body.source || 'amazon_research',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Create product error:', error);
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      product: data,
    });
  } catch (error) {
    console.error('Create from research error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
