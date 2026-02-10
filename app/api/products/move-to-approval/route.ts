/**
 * 承認待ちステータス移行API
 * 
 * 100%完了した商品を自動で「承認待ち」ステータスに移行
 * 
 * @endpoint POST /api/products/move-to-approval
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
    const { productIds, autoDetect = false } = body;

    console.log(`\n========================================`);
    console.log(`🔄 承認待ちステータス移行API`);
    console.log(`  productIds: ${productIds?.length || 0}件`);
    console.log(`  autoDetect: ${autoDetect}`);
    console.log(`========================================`);

    let targetIds: number[] = [];

    if (autoDetect) {
      // 🔥 自動検出: 100%完了かつ未出品の商品を検索
      const { data: readyProducts, error: fetchError } = await supabase
        .from('products_master')
        .select('id')
        .is('ebay_item_id', null)
        .or('workflow_status.is.null,workflow_status.neq.listed,workflow_status.neq.approval_pending')
        // 必須データが揃っている条件
        .not('english_title', 'is', null)
        .not('listing_data->ddp_price_usd', 'is', null)
        .not('listing_data->weight_g', 'is', null)
        .not('listing_data->shipping_policy_id', 'is', null)
        .limit(100);

      if (fetchError) {
        console.error('❌ 自動検出エラー:', fetchError);
        return NextResponse.json(
          { success: false, error: fetchError.message },
          { status: 500 }
        );
      }

      targetIds = readyProducts?.map(p => p.id) || [];
      console.log(`📊 自動検出: ${targetIds.length}件の候補`);
    } else if (productIds && Array.isArray(productIds)) {
      targetIds = productIds;
    } else {
      return NextResponse.json(
        { success: false, error: 'productIds または autoDetect が必要です' },
        { status: 400 }
      );
    }

    if (targetIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: '承認待ちに移行する商品がありません',
        updated: 0,
      });
    }

    // 一括更新
    const { error: updateError } = await supabase
      .from('products_master')
      .update({
        workflow_status: 'approval_pending',
        updated_at: new Date().toISOString(),
      })
      .in('id', targetIds)
      // 既に出品済みは除外
      .is('ebay_item_id', null);

    if (updateError) {
      console.error('❌ 更新エラー:', updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    console.log(`✅ ${targetIds.length}件を承認待ちに移行`);

    return NextResponse.json({
      success: true,
      message: `${targetIds.length}件を承認待ちに移行しました`,
      updated: targetIds.length,
      productIds: targetIds,
    });

  } catch (error: any) {
    console.error('❌ API エラー:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// GETで承認待ち商品の件数を取得
export async function GET() {
  try {
    const { count, error } = await supabase
      .from('products_master')
      .select('id', { count: 'exact', head: true })
      .eq('workflow_status', 'approval_pending');

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: count || 0,
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
