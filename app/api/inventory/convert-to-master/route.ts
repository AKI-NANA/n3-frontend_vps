// app/api/inventory/convert-to-master/route.ts
/**
 * 単品変換API
 * セット品・バリエーションから単品（マスター）に戻す
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    // inventory_masterテーブルで product_type と variation_status をリセット
    const { data: inventoryResult, error: inventoryError } = await supabase
      .from('inventory_master')
      .update({
        product_type: 'master',
        variation_status: null,
        parent_id: null,
        updated_at: new Date().toISOString()
      })
      .in('id', productIds)
      .select('id');

    if (inventoryError) {
      console.error('[convert-to-master] inventory_master更新エラー:', inventoryError);
    }

    // products_masterテーブルでも同様にリセット
    const { data: productsResult, error: productsError } = await supabase
      .from('products_master')
      .update({
        product_type: 'master',
        variation_status: null,
        parent_product_id: null,
        updated_at: new Date().toISOString()
      })
      .in('id', productIds)
      .select('id');

    if (productsError) {
      console.error('[convert-to-master] products_master更新エラー:', productsError);
    }

    const updatedCount = Math.max(
      inventoryResult?.length || 0,
      productsResult?.length || 0
    );

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      message: `${updatedCount}件を単品に変換しました`
    });

  } catch (error: any) {
    console.error('[convert-to-master] エラー:', error);
    return NextResponse.json(
      { success: false, error: error.message || '変換に失敗しました' },
      { status: 500 }
    );
  }
}
