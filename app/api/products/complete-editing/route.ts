/**
 * Complete Editing API
 *
 * POST /api/products/complete-editing
 *
 * 編集完了処理：
 * - 選択された商品を編集完了状態にし、承認待ちステータスに変更
 * - execution_status を 'pending' に設定
 * - approval_status を 'pending' に設定
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: '商品IDが指定されていません' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    console.log(`[CompleteEditing] Processing ${productIds.length} products`);

    // 商品のステータスを更新
    const { data: updatedProducts, error } = await supabase
      .from('products_master')
      .update({
        execution_status: 'pending',
        approval_status: 'pending',
        workflow_status: 'ready_to_approve',
        updated_at: new Date().toISOString()
      })
      .in('id', productIds)
      .select('id, sku, title');

    if (error) {
      console.error('[CompleteEditing] Update error:', error);
      return NextResponse.json(
        {
          error: '商品の更新に失敗しました',
          details: error.message
        },
        { status: 500 }
      );
    }

    console.log(`[CompleteEditing] Successfully updated ${updatedProducts?.length || 0} products`);

    return NextResponse.json({
      success: true,
      message: `${updatedProducts?.length || 0}件の商品を編集完了しました`,
      updated: updatedProducts?.length || 0,
      products: updatedProducts
    });

  } catch (error) {
    console.error('[CompleteEditing] Unexpected error:', error);
    return NextResponse.json(
      {
        error: '編集完了処理でエラーが発生しました',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/products/complete-editing
 *
 * 編集完了可能な商品の統計情報を取得
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // workflow_status が 'editing' または execution_status が null の商品をカウント
    const { data: editingProducts, error: editingError } = await supabase
      .from('products_master')
      .select('id, sku')
      .or('workflow_status.eq.editing,execution_status.is.null');

    if (editingError) {
      console.error('[CompleteEditing] Query error:', editingError);
      return NextResponse.json(
        {
          error: '統計情報の取得に失敗しました',
          details: editingError.message
        },
        { status: 500 }
      );
    }

    // 承認待ち商品をカウント
    const { data: pendingProducts, error: pendingError } = await supabase
      .from('products_master')
      .select('id, sku')
      .eq('approval_status', 'pending');

    if (pendingError) {
      console.error('[CompleteEditing] Pending query error:', pendingError);
    }

    return NextResponse.json({
      editing_count: editingProducts?.length || 0,
      pending_approval_count: pendingProducts?.length || 0,
      stats: {
        ready_to_complete: editingProducts?.length || 0,
        awaiting_approval: pendingProducts?.length || 0
      }
    });

  } catch (error) {
    console.error('[CompleteEditing] Unexpected error:', error);
    return NextResponse.json(
      {
        error: '統計情報の取得でエラーが発生しました',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
