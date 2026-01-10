// app/api/inventory/decrement-set/route.ts
/**
 * セット品販売時の在庫減算API
 * 
 * POST: セット品が売れた時に構成シングルの在庫を一括減算
 * 
 * リクエストボディ:
 * {
 *   productId: string;      // セット品のID
 *   quantity?: number;      // 販売数量（デフォルト: 1）
 *   orderId?: string;       // 注文ID（トラッキング用）
 *   source?: string;        // 減算理由（sale, manual等）
 * }
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
    const { productId, quantity = 1, orderId, source = 'sale' } = body;
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId required' },
        { status: 400 }
      );
    }
    
    if (quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'quantity must be at least 1' },
        { status: 400 }
      );
    }
    
    // 1. セット品であることを確認
    const { data: product, error: productError } = await supabase
      .from('inventory_master')
      .select('id, product_type, product_name, sku')
      .eq('id', productId)
      .single();
    
    if (productError || !product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // 2. セット構成を確認
    const { data: bundleItems, error: bundleError } = await supabase
      .from('bundle_items')
      .select('child_inventory_id, quantity')
      .eq('parent_product_id', productId);
    
    if (bundleError) throw bundleError;
    
    if (!bundleItems || bundleItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No bundle components found for this product' },
        { status: 400 }
      );
    }
    
    // 3. RPC関数を呼び出して一括減算
    const { data: decrementResult, error: decrementError } = await supabase.rpc(
      'decrement_set_inventory',
      {
        p_product_id: productId,
        p_sold_quantity: quantity,
      }
    );
    
    if (decrementError) throw decrementError;
    
    // 4. 在庫変更履歴に記録（オプション）
    if (decrementResult?.success) {
      // inventory_changesテーブルがある場合は記録
      try {
        for (const item of bundleItems) {
          await supabase
            .from('inventory_changes')
            .insert({
              product_id: item.child_inventory_id,
              change_type: 'set_sale',
              quantity_change: -(item.quantity * quantity),
              source: `Set sale: ${product.sku || productId}`,
              notes: orderId ? `Order: ${orderId}` : null,
              metadata: {
                set_product_id: productId,
                set_sku: product.sku,
                sold_quantity: quantity,
                component_quantity: item.quantity,
              },
            });
        }
      } catch (historyError) {
        // 履歴記録失敗は警告のみ（メイン処理には影響させない）
        console.warn('[decrement-set] Failed to record history:', historyError);
      }
    }
    
    // 5. 新しいセット在庫を計算
    const { data: newStockData } = await supabase.rpc('calculate_set_stock', {
      p_product_id: productId,
    });
    
    return NextResponse.json({
      success: true,
      result: decrementResult,
      newSetStock: newStockData,
      product: {
        id: product.id,
        sku: product.sku,
        name: product.product_name,
      },
    });
    
  } catch (error: any) {
    console.error('[inventory/decrement-set] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET: セット品の現在の在庫状況を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId required' },
        { status: 400 }
      );
    }
    
    // セット在庫を計算
    const { data: stockData, error } = await supabase.rpc('calculate_set_stock', {
      p_product_id: productId,
    });
    
    if (error) throw error;
    
    // 構成品の詳細も取得
    const { data: components } = await supabase
      .from('bundle_items')
      .select(`
        quantity,
        child_inventory_id
      `)
      .eq('parent_product_id', productId);
    
    // 構成品の在庫情報を取得
    const childIds = (components || []).map(c => c.child_inventory_id);
    let componentDetails: any[] = [];
    
    if (childIds.length > 0) {
      const { data: inventories } = await supabase
        .from('inventory_master')
        .select('id, sku, product_name, physical_quantity, reserved_quantity')
        .in('id', childIds);
      
      const invMap = new Map((inventories || []).map(inv => [inv.id, inv]));
      
      componentDetails = (components || []).map(c => {
        const inv = invMap.get(c.child_inventory_id);
        const available = (inv?.physical_quantity || 0) - (inv?.reserved_quantity || 0);
        const possibleSets = c.quantity > 0 ? Math.floor(available / c.quantity) : 0;
        
        return {
          inventoryId: c.child_inventory_id,
          sku: inv?.sku,
          productName: inv?.product_name,
          physicalQuantity: inv?.physical_quantity || 0,
          reservedQuantity: inv?.reserved_quantity || 0,
          availableQuantity: available,
          requiredPerSet: c.quantity,
          possibleSets,
        };
      });
    }
    
    return NextResponse.json({
      success: true,
      setStock: stockData,
      components: componentDetails,
    });
    
  } catch (error: any) {
    console.error('[inventory/decrement-set] GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
