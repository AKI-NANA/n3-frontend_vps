// app/api/bundle/bulk/route.ts
/**
 * セット品構成の一括操作API
 * 
 * POST: 一括追加・更新
 * DELETE: 一括削除
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface BulkBundleItem {
  parentProductId: string;
  childInventoryId: string;
  quantity?: number;
}

// POST: 一括追加・更新（upsert）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body as { items: BulkBundleItem[] };
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'items array required' },
        { status: 400 }
      );
    }
    
    // バリデーション
    const validItems = items.filter(item => 
      item.parentProductId && item.childInventoryId
    );
    
    if (validItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid items provided' },
        { status: 400 }
      );
    }
    
    // upsert用のデータを構築
    const upsertData = validItems.map(item => ({
      parent_product_id: item.parentProductId,
      child_inventory_id: item.childInventoryId,
      quantity: item.quantity || 1,
      updated_at: new Date().toISOString(),
    }));
    
    // upsert実行（重複時は更新）
    const { data, error } = await supabase
      .from('bundle_items')
      .upsert(upsertData, {
        onConflict: 'parent_product_id,child_inventory_id',
        ignoreDuplicates: false,
      })
      .select();
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      processed: data?.length || 0,
      items: data,
    });
    
  } catch (error: any) {
    console.error('[bundle/bulk] POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: 一括削除
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { parentProductId, childInventoryIds, bundleItemIds } = body;
    
    if (bundleItemIds && Array.isArray(bundleItemIds) && bundleItemIds.length > 0) {
      // bundle_item IDで削除
      const { error } = await supabase
        .from('bundle_items')
        .delete()
        .in('id', bundleItemIds);
      
      if (error) throw error;
      
      return NextResponse.json({
        success: true,
        deleted: bundleItemIds.length,
      });
    }
    
    if (parentProductId && childInventoryIds && Array.isArray(childInventoryIds)) {
      // 親ID + 子ID配列で削除
      const { error } = await supabase
        .from('bundle_items')
        .delete()
        .eq('parent_product_id', parentProductId)
        .in('child_inventory_id', childInventoryIds);
      
      if (error) throw error;
      
      return NextResponse.json({
        success: true,
        deleted: childInventoryIds.length,
      });
    }
    
    if (parentProductId) {
      // 親IDの全構成を削除
      const { data, error } = await supabase
        .from('bundle_items')
        .delete()
        .eq('parent_product_id', parentProductId)
        .select('id');
      
      if (error) throw error;
      
      return NextResponse.json({
        success: true,
        deleted: data?.length || 0,
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'bundleItemIds or parentProductId required' },
      { status: 400 }
    );
    
  } catch (error: any) {
    console.error('[bundle/bulk] DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
