// app/api/products/move-phase/route.ts
/**
 * 商品フェーズ手動移動API
 * 
 * 商品を「その他」「出品済」などのフェーズに手動で移動
 * workflow_statusを更新するだけのシンプルなAPI
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds, targetPhase } = body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '商品IDを指定してください' 
      }, { status: 400 });
    }
    
    if (!targetPhase || !['OTHER', 'LISTED', 'READY', 'DRAFT'].includes(targetPhase)) {
      return NextResponse.json({ 
        success: false, 
        error: 'targetPhaseは OTHER, LISTED, READY, DRAFT のいずれかを指定してください' 
      }, { status: 400 });
    }
    
    const supabase = await createClient();
    
    // フェーズに応じた更新内容を決定
    let updates: Record<string, any> = {
      updated_at: new Date().toISOString()
    };
    
    switch (targetPhase) {
      case 'OTHER':
        // 「その他」に移動 = workflow_status を 'other' に
        updates = {
          ...updates,
          workflow_status: 'other',
          listing_status: null, // 出品ステータスをクリア
          ready_to_list: false,
        };
        break;
        
      case 'LISTED':
        // 「出品済」に移動 = listing_status を 'active' に
        updates = {
          ...updates,
          workflow_status: 'listed',
          listing_status: 'active',
          ready_to_list: true,
        };
        break;
        
      case 'READY':
        // 「承認待ち」に移動
        updates = {
          ...updates,
          workflow_status: 'approved',
          ready_to_list: true,
        };
        break;
        
      case 'DRAFT':
        // 「下書き」に移動
        updates = {
          ...updates,
          workflow_status: 'draft',
          ready_to_list: false,
        };
        break;
    }
    
    // products_master テーブルを更新
    const { data, error } = await supabase
      .from('products_master')
      .update(updates)
      .in('id', productIds)
      .select('id');
    
    if (error) {
      console.error('[Move Phase API] Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }
    
    const updatedCount = data?.length || 0;
    
    console.log(`[Move Phase API] ${targetPhase}: ${updatedCount}件更新`);
    
    return NextResponse.json({
      success: true,
      targetPhase,
      updated: updatedCount,
      productIds: data?.map(d => d.id) || []
    });
    
  } catch (error: any) {
    console.error('[Move Phase API] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
