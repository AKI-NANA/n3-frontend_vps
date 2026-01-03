// app/api/inventory/update-attribute/route.ts
/**
 * 在庫マスターの属性更新API
 * 
 * 更新可能フィールド:
 * - attr_l1, attr_l2, attr_l3: 3階層属性
 * - is_verified: 確定フラグ
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface UpdateRequest {
  id: string;
  field: 'attr_l1' | 'attr_l2' | 'attr_l3' | 'is_verified';
  value: string | boolean;
}

interface BulkUpdateRequest {
  updates: UpdateRequest[];
}

// ============================================================
// PATCH: 単一フィールド更新
// ============================================================

export async function PATCH(request: NextRequest) {
  try {
    const body: UpdateRequest = await request.json();
    const { id, field, value } = body;
    
    if (!id || !field) {
      return NextResponse.json(
        { success: false, error: 'id and field are required' },
        { status: 400 }
      );
    }
    
    // 許可されたフィールドのみ
    const allowedFields = ['attr_l1', 'attr_l2', 'attr_l3', 'is_verified'];
    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        { success: false, error: `Field ${field} is not allowed` },
        { status: 400 }
      );
    }
    
    // 更新データ作成
    const updateData: Record<string, any> = {
      [field]: value,
      updated_at: new Date().toISOString(),
    };
    
    // is_verified が true に設定された場合、verified_at も更新
    if (field === 'is_verified' && value === true) {
      updateData.verified_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('inventory_master')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('[update-attribute] Error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      updated: {
        id,
        field,
        value,
      },
      data,
    });
    
  } catch (error: any) {
    console.error('[update-attribute] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// POST: 一括更新
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: BulkUpdateRequest = await request.json();
    const { updates } = body;
    
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'updates array is required' },
        { status: 400 }
      );
    }
    
    const allowedFields = ['attr_l1', 'attr_l2', 'attr_l3', 'is_verified'];
    const results: { id: string; success: boolean; error?: string }[] = [];
    
    for (const update of updates) {
      const { id, field, value } = update;
      
      if (!allowedFields.includes(field)) {
        results.push({ id, success: false, error: `Field ${field} not allowed` });
        continue;
      }
      
      const updateData: Record<string, any> = {
        [field]: value,
        updated_at: new Date().toISOString(),
      };
      
      if (field === 'is_verified' && value === true) {
        updateData.verified_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('inventory_master')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        results.push({ id, success: false, error: error.message });
      } else {
        results.push({ id, success: true });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    return NextResponse.json({
      success: failCount === 0,
      summary: {
        total: results.length,
        success: successCount,
        failed: failCount,
      },
      results,
    });
    
  } catch (error: any) {
    console.error('[update-attribute] Bulk error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
