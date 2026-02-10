// app/api/tags/assign/route.ts
/**
 * タグ割り当てAPI
 * 
 * POST: 商品にタグを割り当て/解除
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface AssignRequest {
  // 対象
  productIds?: (string | number)[];
  inventoryIds?: string[];
  
  // タグ
  tagId: string;
  
  // 操作
  action: 'add' | 'remove';
}

export async function POST(request: Request) {
  try {
    const body: AssignRequest = await request.json();
    const { productIds, inventoryIds, tagId, action } = body;
    
    if (!tagId) {
      return NextResponse.json(
        { success: false, error: 'tagIdが必要です' },
        { status: 400 }
      );
    }
    
    if ((!productIds || productIds.length === 0) && (!inventoryIds || inventoryIds.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'productIdsまたはinventoryIdsが必要です' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    let affectedCount = 0;
    
    // products_masterへの割り当て
    if (productIds && productIds.length > 0) {
      if (action === 'add') {
        const inserts = productIds.map(pid => ({
          product_id: typeof pid === 'string' ? parseInt(pid) : pid,
          tag_id: tagId
        }));
        
        const { error } = await supabase
          .from('product_tag_assignments')
          .upsert(inserts, { onConflict: 'product_id,tag_id' });
        
        if (error) {
          console.error('Tag assign error:', error);
        } else {
          affectedCount += productIds.length;
        }
      } else {
        const { error, count } = await supabase
          .from('product_tag_assignments')
          .delete()
          .in('product_id', productIds.map(pid => typeof pid === 'string' ? parseInt(pid) : pid))
          .eq('tag_id', tagId);
        
        if (!error && count) {
          affectedCount += count;
        }
      }
    }
    
    // inventory_masterへの割り当て
    if (inventoryIds && inventoryIds.length > 0) {
      if (action === 'add') {
        const inserts = inventoryIds.map(iid => ({
          inventory_id: iid,
          tag_id: tagId
        }));
        
        const { error } = await supabase
          .from('inventory_tag_assignments')
          .upsert(inserts, { onConflict: 'inventory_id,tag_id' });
        
        if (error) {
          console.error('Inventory tag assign error:', error);
        } else {
          affectedCount += inventoryIds.length;
        }
      } else {
        const { error, count } = await supabase
          .from('inventory_tag_assignments')
          .delete()
          .in('inventory_id', inventoryIds)
          .eq('tag_id', tagId);
        
        if (!error && count) {
          affectedCount += count;
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      action,
      tagId,
      affectedCount
    });
    
  } catch (error: any) {
    console.error('[Tags Assign API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
