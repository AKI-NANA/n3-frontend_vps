/**
 * 多販路計算結果保存API
 * /api/v2/marketplace-listings/save/route.ts
 * 
 * marketplace_listings JSONBカラムへの保存・更新
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase クライアント
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseKey);
}

// ステータス型
type MarketplaceStatus = 'none' | 'calculated' | 'ready' | 'listed' | 'error';

// 販路別データ構造
interface MarketplaceListingData {
  price_jpy?: number;
  price_local?: number;
  currency?: string;
  profit_jpy?: number;
  profit_margin?: number;
  shipping_cost?: number;
  platform_fee?: number;
  payment_fee?: number;
  duty_amount?: number;
  status: MarketplaceStatus;
  last_calculated_at?: string;
  listed_at?: string | null;
  listing_id?: string | null;
  // Amazon専用
  asin?: string;
  fba_fee?: number;
  // ヤフオク専用
  start_price?: number;
  buy_now_price?: number;
  // エラー情報
  error_message?: string;
}

interface SaveRequest {
  productId: number;
  marketplace: string;
  data: MarketplaceListingData;
}

interface BulkSaveRequest {
  updates: SaveRequest[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabaseClient();

    // 単一更新 or 一括更新を判定
    if (body.updates && Array.isArray(body.updates)) {
      // 一括更新
      return handleBulkSave(supabase, body as BulkSaveRequest);
    } else {
      // 単一更新
      return handleSingleSave(supabase, body as SaveRequest);
    }
  } catch (error: any) {
    console.error('[MarketplaceListings] Save error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 単一商品の販路データ保存
async function handleSingleSave(supabase: any, req: SaveRequest) {
  const { productId, marketplace, data } = req;

  if (!productId || !marketplace || !data) {
    return NextResponse.json(
      { success: false, error: 'productId, marketplace, data are required' },
      { status: 400 }
    );
  }

  // タイムスタンプを追加
  const dataWithTimestamp = {
    ...data,
    last_calculated_at: data.last_calculated_at || new Date().toISOString(),
  };

  // 直接更新
  return handleDirectUpdate(supabase, productId, marketplace, dataWithTimestamp);
}

// 直接更新
async function handleDirectUpdate(
  supabase: any,
  productId: number,
  marketplace: string,
  data: MarketplaceListingData
) {
  // 現在のデータを取得
  const { data: current, error: fetchError } = await supabase
    .from('products_master')
    .select('marketplace_listings')
    .eq('id', productId)
    .single();

  if (fetchError) {
    return NextResponse.json(
      { success: false, error: `Product not found: ${fetchError.message}` },
      { status: 404 }
    );
  }

  // マージして更新
  const existingListings = current?.marketplace_listings || {};
  const updatedListings = {
    ...existingListings,
    [marketplace]: data,
  };

  const { error: updateError } = await supabase
    .from('products_master')
    .update({ 
      marketplace_listings: updatedListings,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId);

  if (updateError) {
    return NextResponse.json(
      { success: false, error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    productId,
    marketplace,
    data,
  });
}

// 一括保存
async function handleBulkSave(supabase: any, req: BulkSaveRequest) {
  const { updates } = req;
  const results: { productId: number; marketplace: string; success: boolean; error?: string }[] = [];

  for (const update of updates) {
    try {
      const { productId, marketplace, data } = update;
      
      const dataWithTimestamp = {
        ...data,
        last_calculated_at: data.last_calculated_at || new Date().toISOString(),
      };

      // 現在のデータを取得
      const { data: current } = await supabase
        .from('products_master')
        .select('marketplace_listings')
        .eq('id', productId)
        .single();

      const existingListings = current?.marketplace_listings || {};
      const updatedListings = {
        ...existingListings,
        [marketplace]: dataWithTimestamp,
      };

      const { error } = await supabase
        .from('products_master')
        .update({ 
          marketplace_listings: updatedListings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId);

      results.push({
        productId,
        marketplace,
        success: !error,
        error: error?.message,
      });
    } catch (e: any) {
      results.push({
        productId: update.productId,
        marketplace: update.marketplace,
        success: false,
        error: e.message,
      });
    }
  }

  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => !r.success).length;

  return NextResponse.json({
    success: errorCount === 0,
    summary: {
      total: updates.length,
      success: successCount,
      error: errorCount,
    },
    results,
  });
}

// GET: 商品の販路データを取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const marketplace = searchParams.get('marketplace');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('products_master')
      .select('id, sku, title_ja, marketplace_listings')
      .eq('id', productId)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    // 特定の販路のみ返す
    if (marketplace && data.marketplace_listings) {
      return NextResponse.json({
        success: true,
        productId: data.id,
        marketplace,
        data: data.marketplace_listings[marketplace] || null,
      });
    }

    // 全販路を返す
    return NextResponse.json({
      success: true,
      productId: data.id,
      sku: data.sku,
      title: data.title_ja,
      marketplaceListings: data.marketplace_listings || {},
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
