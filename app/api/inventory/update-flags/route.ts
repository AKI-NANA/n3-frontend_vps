// app/api/inventory/update-flags/route.ts
/**
 * 在庫フラグ更新API
 * 
 * 機能:
 * - needs_count_check（要確認フラグ）の更新
 * - stock_confirmed（確定フラグ）の更新
 * - stock_memo（メモ）の更新
 * - 単一更新・一括更新対応
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * PATCH: フラグ更新（単一）
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, field, value } = body;

    console.log('[UpdateFlags] PATCH request:', { id, field, value });

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'IDが必要です' },
        { status: 400 }
      );
    }

    // 許可されたフィールドのみ
    const allowedFields = ['needs_count_check', 'stock_confirmed', 'stock_memo'];
    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        { success: false, error: `無効なフィールド: ${field}` },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {
      [field]: value,
      updated_at: new Date().toISOString(),
    };

    console.log('[UpdateFlags] Updating inventory_master:', { id, updateData });

    const { data, error } = await supabase
      .from('inventory_master')
      .update(updateData)
      .eq('id', id)
      .select('id, sku, needs_count_check, stock_confirmed, stock_memo')
      .single();

    if (error) {
      console.error('[UpdateFlags] Supabase error:', error);
      throw error;
    }

    console.log('[UpdateFlags] Success:', data);

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error: any) {
    console.error('[UpdateFlags] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST: 一括フラグ更新
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, updates } = body;

    console.log('[UpdateFlags] POST request:', { ids: ids?.length, updates });

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'IDリストが必要です' },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { success: false, error: '更新内容が必要です' },
        { status: 400 }
      );
    }

    // 許可されたフィールドのみ抽出
    const allowedFields = ['needs_count_check', 'stock_confirmed', 'stock_memo'];
    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    }

    if (Object.keys(updateData).length === 1) { // updated_at のみ
      return NextResponse.json(
        { success: false, error: '有効な更新内容がありません' },
        { status: 400 }
      );
    }

    const { error, count } = await supabase
      .from('inventory_master')
      .update(updateData)
      .in('id', ids);

    if (error) throw error;

    console.log(`[UpdateFlags] Bulk updated ${ids.length} items:`, updateData);

    return NextResponse.json({
      success: true,
      updatedCount: ids.length,
      updates: updateData,
    });

  } catch (error: any) {
    console.error('[UpdateFlags] Bulk error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET: フラグ統計取得
 */
export async function GET() {
  try {
    // 要確認件数
    const { count: needsCheckCount, error: e1 } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .eq('inventory_type', 'stock')
      .eq('needs_count_check', true);

    if (e1) console.error('[UpdateFlags] needsCheckCount error:', e1);

    // 確定件数
    const { count: confirmedCount, error: e2 } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .eq('inventory_type', 'stock')
      .eq('stock_confirmed', true);

    if (e2) console.error('[UpdateFlags] confirmedCount error:', e2);

    // メモあり件数
    const { count: withMemoCount, error: e3 } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .eq('inventory_type', 'stock')
      .not('stock_memo', 'is', null)
      .neq('stock_memo', '');

    if (e3) console.error('[UpdateFlags] withMemoCount error:', e3);

    // 総件数
    const { count: totalCount, error: e4 } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .eq('inventory_type', 'stock');

    if (e4) console.error('[UpdateFlags] totalCount error:', e4);

    const stats = {
      totalCount: totalCount || 0,
      needsCheckCount: needsCheckCount || 0,
      confirmedCount: confirmedCount || 0,
      withMemoCount: withMemoCount || 0,
      unconfirmedCount: (totalCount || 0) - (confirmedCount || 0),
    };

    console.log('[UpdateFlags] GET stats:', stats);

    return NextResponse.json({
      success: true,
      stats,
    });

  } catch (error: any) {
    console.error('[UpdateFlags] Stats error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
