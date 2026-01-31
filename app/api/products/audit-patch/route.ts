// app/api/products/audit-patch/route.ts
/**
 * 監査パッチ適用APIエンドポイント
 * 
 * PUT /api/products/audit-patch
 * 単一商品の監査パッチを適用
 * Body: { productId, updates }
 * 
 * POST /api/products/audit-patch
 * 複数商品の監査パッチを一括適用
 * Body: { items: [{ id, patches: [{ field, suggestedValue }] }], source, model }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ============================================================
// PUT: 単一商品の更新
// ============================================================

export async function PUT(request: NextRequest) {
  try {
    const { productId, updates } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId is required' },
        { status: 400 }
      );
    }
    
    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { success: false, error: 'updates object is required' },
        { status: 400 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 更新データを準備
    const updateData: Record<string, any> = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    // Provenance情報を追加（どこからの更新か記録）
    if (!updateData.provenance) {
      updateData.provenance = {};
    }
    
    const timestamp = new Date().toISOString();
    for (const field of Object.keys(updates)) {
      if (field === 'provenance' || field === 'updated_at') continue;
      updateData.provenance[field] = {
        source: 'audit_fix',
        updatedAt: timestamp,
        updatedBy: 'system',
      };
    }
    
    // 商品を更新
    const { data, error } = await supabase
      .from('products_master')
      .update(updateData)
      .eq('id', productId)
      .select()
      .single();
    
    if (error) {
      console.error('[API] Update error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      product: data,
      updatedFields: Object.keys(updates),
    });
    
  } catch (error) {
    console.error('[API] Audit patch error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================
// POST: 複数商品の一括更新
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      items, 
      source = 'rule_auto', 
      model = 'audit-service' 
    } = body as {
      items: Array<{
        id: string | number;
        patches: Array<{
          field: string;
          suggestedValue: any;
          confidence?: number;
          reason?: string;
        }>;
      }>;
      source?: string;
      model?: string;
    };
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'items array is required and must not be empty' },
        { status: 400 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const timestamp = new Date().toISOString();
    
    const results: Array<{ id: string | number; success: boolean; error?: string }> = [];
    let successCount = 0;
    
    // 各商品を更新
    for (const item of items) {
      try {
        const updateData: Record<string, any> = {
          updated_at: timestamp,
        };
        
        const provenance: Record<string, any> = {};
        
        // パッチを適用
        for (const patch of item.patches) {
          updateData[patch.field] = patch.suggestedValue;
          provenance[patch.field] = {
            source,
            model,
            confidence: patch.confidence,
            reason: patch.reason,
            updatedAt: timestamp,
          };
        }
        
        // 既存のprovenanceとマージ
        const { data: existing } = await supabase
          .from('products_master')
          .select('provenance')
          .eq('id', item.id)
          .single();
        
        updateData.provenance = {
          ...(existing?.provenance || {}),
          ...provenance,
        };
        
        // 更新実行
        const { error } = await supabase
          .from('products_master')
          .update(updateData)
          .eq('id', item.id);
        
        if (error) {
          results.push({ id: item.id, success: false, error: error.message });
        } else {
          results.push({ id: item.id, success: true });
          successCount++;
        }
        
      } catch (err) {
        results.push({ 
          id: item.id, 
          success: false, 
          error: err instanceof Error ? err.message : 'Unknown error' 
        });
      }
    }
    
    // 監査ログを記録
    try {
      await supabase.from('audit_logs').insert({
        action: 'bulk_patch_apply',
        source,
        model,
        items_count: items.length,
        success_count: successCount,
        timestamp,
        details: { results },
      });
    } catch (logError) {
      console.warn('Failed to log audit action:', logError);
    }
    
    return NextResponse.json({
      success: true,
      total: items.length,
      successCount,
      failedCount: items.length - successCount,
      results,
    });
    
  } catch (error) {
    console.error('[API] Bulk audit patch error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
