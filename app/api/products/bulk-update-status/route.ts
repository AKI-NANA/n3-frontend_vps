// app/api/products/bulk-update-status/route.ts
/**
 * 一括ステータス更新API
 * POST /api/products/bulk-update-status
 * 
 * パイプライン処理用：
 * - workflow_status の一括更新
 * - SM選択待ち、承認待ちなどのステータス設定
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアント（サービスロールキー使用）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 許可されるステータス値
const ALLOWED_STATUSES = [
  'scraped',              // スクレイピング済み
  'data_editing',         // データ編集中
  'sm_selection_required', // SM選択待ち
  'approval_pending',     // 承認待ち（AI推定データあり）
  'ready_for_approval',   // 承認待ち
  'approved',             // 承認済み
  'scheduled',            // 出品予約
  'listed',               // 出品済み
  'archived',             // アーカイブ
];

interface BulkUpdateRequest {
  productIds: (number | string)[];
  status: string;
  additionalFields?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const body: BulkUpdateRequest = await request.json();
    const { productIds, status, additionalFields = {} } = body;
    
    // バリデーション
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'productIds is required and must be a non-empty array' },
        { status: 400 }
      );
    }
    
    if (!status || typeof status !== 'string') {
      return NextResponse.json(
        { error: 'status is required and must be a string' },
        { status: 400 }
      );
    }
    
    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status: ${status}. Allowed: ${ALLOWED_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }
    
    // 数値に変換
    const numericIds = productIds.map(id => 
      typeof id === 'string' ? parseInt(id, 10) : id
    ).filter(id => !isNaN(id));
    
    if (numericIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid product IDs provided' },
        { status: 400 }
      );
    }
    
    console.log(`📦 [Bulk Update Status] ${numericIds.length}件 → ${status}`);
    
    // 更新データを構築
    const updateData: Record<string, any> = {
      workflow_status: status,
      updated_at: new Date().toISOString(),
      ...additionalFields,
    };
    
    // 特定のステータスに応じた追加フィールド
    switch (status) {
      case 'sm_selection_required':
        updateData.pipeline_stop_reason = 'SM competitor not selected';
        break;
      case 'approval_pending':
      case 'ready_for_approval':
        updateData.pipeline_stop_reason = 'AI estimated data requires approval';
        break;
      case 'approved':
        updateData.ready_to_list = true;
        updateData.pipeline_stop_reason = null;
        break;
      case 'listed':
        updateData.ready_to_list = false;
        break;
    }
    
    // 一括更新
    const { data, error } = await supabase
      .from('products_master')
      .update(updateData)
      .in('id', numericIds)
      .select('id, sku, workflow_status');
    
    if (error) {
      console.error('❌ [Bulk Update Status] Error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    console.log(`✅ [Bulk Update Status] ${data?.length || 0}件更新完了`);
    
    return NextResponse.json({
      success: true,
      updated: data?.length || 0,
      status,
      productIds: numericIds,
    });
    
  } catch (error) {
    console.error('❌ [Bulk Update Status] Unexpected error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: 指定した商品のステータスを取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    
    if (!ids) {
      return NextResponse.json(
        { error: 'ids query parameter is required' },
        { status: 400 }
      );
    }
    
    const productIds = ids.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    
    const { data, error } = await supabase
      .from('products_master')
      .select('id, sku, workflow_status, ready_to_list, pipeline_stop_reason')
      .in('id', productIds);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      products: data,
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
