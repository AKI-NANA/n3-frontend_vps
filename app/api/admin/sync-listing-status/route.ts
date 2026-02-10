/**
 * 出品ステータス同期API
 * 
 * ebay_item_id が設定されているが workflow_status が 'listed' でない商品を
 * 一括で修正するAPI
 * 
 * @endpoint POST /api/admin/sync-listing-status
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { dryRun = false } = body;

    console.log(`\n========================================`);
    console.log(`🔄 出品ステータス同期API`);
    console.log(`  dryRun: ${dryRun}`);
    console.log(`========================================`);

    // 1. 不整合な商品を検索
    const { data: inconsistentProducts, error: fetchError } = await supabase
      .from('products_master')
      .select('id, sku, ebay_item_id, listing_status, workflow_status, listed_at')
      .not('ebay_item_id', 'is', null)
      .neq('ebay_item_id', '')
      .or('listing_status.neq.active,workflow_status.neq.listed,listing_status.is.null,workflow_status.is.null');

    if (fetchError) {
      console.error('❌ 検索エラー:', fetchError);
      return NextResponse.json(
        { success: false, error: fetchError.message },
        { status: 500 }
      );
    }

    const count = inconsistentProducts?.length || 0;
    console.log(`📊 不整合な商品数: ${count}件`);

    if (count === 0) {
      return NextResponse.json({
        success: true,
        message: '不整合な商品はありませんでした',
        updated: 0,
        products: [],
      });
    }

    // ドライランの場合は更新せずに結果を返す
    if (dryRun) {
      return NextResponse.json({
        success: true,
        message: `${count}件の商品が不整合です（ドライラン）`,
        dryRun: true,
        updated: 0,
        products: inconsistentProducts.map(p => ({
          id: p.id,
          sku: p.sku,
          ebay_item_id: p.ebay_item_id,
          current_listing_status: p.listing_status,
          current_workflow_status: p.workflow_status,
        })),
      });
    }

    // 2. 一括更新
    const productIds = inconsistentProducts.map(p => p.id);
    
    const { error: updateError } = await supabase
      .from('products_master')
      .update({
        listing_status: 'active',
        workflow_status: 'listed',
        updated_at: new Date().toISOString(),
      })
      .in('id', productIds);

    if (updateError) {
      console.error('❌ 更新エラー:', updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    console.log(`✅ ${count}件の商品ステータスを更新しました`);

    return NextResponse.json({
      success: true,
      message: `${count}件の商品ステータスを更新しました`,
      updated: count,
      products: inconsistentProducts.map(p => ({
        id: p.id,
        sku: p.sku,
        ebay_item_id: p.ebay_item_id,
        previous_listing_status: p.listing_status,
        previous_workflow_status: p.workflow_status,
        new_listing_status: 'active',
        new_workflow_status: 'listed',
      })),
    });

  } catch (error: any) {
    console.error('❌ API エラー:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// GETでステータスを確認
export async function GET() {
  try {
    // 統計情報を取得
    const { data: stats, error } = await supabase
      .rpc('get_listing_status_stats')
      .single();

    if (error) {
      // RPC関数がない場合は直接クエリ
      const { data: totalListed } = await supabase
        .from('products_master')
        .select('id', { count: 'exact', head: true })
        .not('ebay_item_id', 'is', null)
        .neq('ebay_item_id', '');

      const { data: correctStatus } = await supabase
        .from('products_master')
        .select('id', { count: 'exact', head: true })
        .not('ebay_item_id', 'is', null)
        .neq('ebay_item_id', '')
        .eq('listing_status', 'active')
        .eq('workflow_status', 'listed');

      const { data: inconsistent } = await supabase
        .from('products_master')
        .select('id', { count: 'exact', head: true })
        .not('ebay_item_id', 'is', null)
        .neq('ebay_item_id', '')
        .or('listing_status.neq.active,workflow_status.neq.listed,listing_status.is.null,workflow_status.is.null');

      return NextResponse.json({
        success: true,
        stats: {
          total_with_ebay_id: totalListed?.length || 0,
          correct_status: correctStatus?.length || 0,
          inconsistent: inconsistent?.length || 0,
        },
        message: inconsistent?.length === 0 
          ? '全ての出品済み商品のステータスは正常です' 
          : `${inconsistent?.length}件の商品でステータス不整合があります`,
      });
    }

    return NextResponse.json({ success: true, stats });

  } catch (error: any) {
    console.error('❌ GET エラー:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
