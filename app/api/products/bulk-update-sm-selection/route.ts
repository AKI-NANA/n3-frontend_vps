import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * SM連続選択結果の一括更新API
 * POST /api/products/bulk-update-sm-selection
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body;

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: 'updates配列が必要です' },
        { status: 400 }
      );
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: true, message: '更新対象がありません', updated: 0 },
        { status: 200 }
      );
    }

    const supabase = await createClient();

    // 各商品のSM選択結果を更新
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const item of updates) {
      const { id, updates: productUpdates } = item;

      if (!id || !productUpdates) {
        errorCount++;
        results.push({
          id,
          success: false,
          error: 'IDまたはupdatesが不正です'
        });
        continue;
      }

      try {
        // ebay_api_dataのlisting_referenceを更新
        const { data: currentProduct, error: fetchError } = await supabase
          .from('products_master')
          .select('ebay_api_data')
          .eq('id', id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        const ebayApiData = currentProduct?.ebay_api_data || {};
        const listingReference = ebayApiData.listing_reference || {};

        // SM選択結果を保存
        const updatedEbayApiData = {
          ...ebayApiData,
          listing_reference: {
            ...listingReference,
            selectedCompetitor: productUpdates.sm_selected_item || null,
            selectionCompleted: productUpdates.sm_selection_completed || false,
            selectedAt: new Date().toISOString()
          }
        };

        // DBに保存
        const { error: updateError } = await supabase
          .from('products_master')
          .update({
            ebay_api_data: updatedEbayApiData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (updateError) {
          throw updateError;
        }

        successCount++;
        results.push({
          id,
          success: true
        });

      } catch (error: any) {
        errorCount++;
        results.push({
          id,
          success: false,
          error: error.message
        });
        console.error(`[SM一括更新] 商品ID ${id} の更新失敗:`, error);
      }
    }

    console.log(`[SM一括更新] 成功: ${successCount}件, 失敗: ${errorCount}件`);

    return NextResponse.json({
      success: true,
      message: `${successCount}件の商品を更新しました`,
      updated: successCount,
      failed: errorCount,
      details: results
    });

  } catch (error: any) {
    console.error('[SM一括更新API] エラー:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'SM選択結果の一括更新に失敗しました',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
