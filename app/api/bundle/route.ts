// app/api/bundle/route.ts
/**
 * セット品構成（bundle_items）管理API
 * 
 * GET: セット品の構成を取得
 * POST: 構成を追加（後付け紐付け）
 * DELETE: 構成を削除
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: セット品の構成を取得
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
    
    // 構成アイテムを取得（シングル情報付き）
    const { data: bundleItems, error } = await supabase
      .from('bundle_items')
      .select(`
        id,
        quantity,
        created_at,
        child_inventory_id,
        inventory_master!bundle_items_child_inventory_id_fkey (
          id,
          sku,
          product_name,
          physical_quantity,
          reserved_quantity,
          cost_price,
          images
        )
      `)
      .eq('parent_product_id', productId);
    
    if (error) {
      // 外部キー制約がない場合は別クエリで取得
      console.warn('Foreign key query failed, trying manual join:', error.message);
      
      const { data: items, error: itemsError } = await supabase
        .from('bundle_items')
        .select('*')
        .eq('parent_product_id', productId);
      
      if (itemsError) throw itemsError;
      
      // 手動でinventory_masterを取得
      const childIds = (items || []).map(item => item.child_inventory_id);
      
      if (childIds.length === 0) {
        return NextResponse.json({
          success: true,
          components: [],
          setStock: { availableSetCount: 0, bottleneck: null, hasComponents: false },
        });
      }
      
      const { data: inventories, error: invError } = await supabase
        .from('inventory_master')
        .select('id, sku, product_name, physical_quantity, reserved_quantity, cost_price, images')
        .in('id', childIds);
      
      if (invError) throw invError;
      
      // 結合
      const inventoryMap = new Map((inventories || []).map(inv => [inv.id, inv]));
      const components = (items || []).map(item => ({
        id: item.id,
        quantity: item.quantity,
        created_at: item.created_at,
        inventory: inventoryMap.get(item.child_inventory_id) || null,
      }));
      
      // セット在庫を計算
      const { data: stockData } = await supabase.rpc('calculate_set_stock', {
        p_product_id: productId
      });
      
      return NextResponse.json({
        success: true,
        components,
        setStock: stockData || { availableSetCount: 0, bottleneck: null, hasComponents: false },
      });
    }
    
    // 正常にJOINできた場合
    const components = (bundleItems || []).map(item => ({
      id: item.id,
      quantity: item.quantity,
      created_at: item.created_at,
      inventory: item.inventory_master,
    }));
    
    // セット在庫を計算
    const { data: stockData } = await supabase.rpc('calculate_set_stock', {
      p_product_id: productId
    });
    
    return NextResponse.json({
      success: true,
      components,
      setStock: stockData || { availableSetCount: 0, bottleneck: null, hasComponents: false },
    });
    
  } catch (error: any) {
    console.error('[bundle] GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: 構成を追加
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parentProductId, childInventoryId, quantity = 1 } = body;
    
    if (!parentProductId || !childInventoryId) {
      return NextResponse.json(
        { success: false, error: 'parentProductId and childInventoryId required' },
        { status: 400 }
      );
    }
    
    // 重複チェック
    const { data: existing } = await supabase
      .from('bundle_items')
      .select('id')
      .eq('parent_product_id', parentProductId)
      .eq('child_inventory_id', childInventoryId)
      .single();
    
    if (existing) {
      // 既存の場合は数量を更新
      const { data, error } = await supabase
        .from('bundle_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({
        success: true,
        action: 'updated',
        bundleItem: data,
      });
    }
    
    // 新規追加
    const { data, error } = await supabase
      .from('bundle_items')
      .insert({
        parent_product_id: parentProductId,
        child_inventory_id: childInventoryId,
        quantity,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      action: 'created',
      bundleItem: data,
    });
    
  } catch (error: any) {
    console.error('[bundle] POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: 構成を削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bundleItemId = searchParams.get('id');
    const parentProductId = searchParams.get('parentProductId');
    const childInventoryId = searchParams.get('childInventoryId');
    
    if (bundleItemId) {
      // IDで削除
      const { error } = await supabase
        .from('bundle_items')
        .delete()
        .eq('id', bundleItemId);
      
      if (error) throw error;
      
      return NextResponse.json({ success: true, deleted: bundleItemId });
    }
    
    if (parentProductId && childInventoryId) {
      // 親子IDで削除
      const { error } = await supabase
        .from('bundle_items')
        .delete()
        .eq('parent_product_id', parentProductId)
        .eq('child_inventory_id', childInventoryId);
      
      if (error) throw error;
      
      return NextResponse.json({ success: true, deleted: { parentProductId, childInventoryId } });
    }
    
    return NextResponse.json(
      { success: false, error: 'id or (parentProductId and childInventoryId) required' },
      { status: 400 }
    );
    
  } catch (error: any) {
    console.error('[bundle] DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
