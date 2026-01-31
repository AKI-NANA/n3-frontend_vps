// app/api/products/archive/route.ts
/**
 * 商品アーカイブAPI
 * 
 * 商品を「アーカイブ」状態に変更/解除
 * - アーカイブ: listing_status = 'archived'
 * - アーカイブ解除: listing_status = null（元のステータスに戻す）
 * 
 * ⚠️ 注意: DBにis_archivedカラムがないため、listing_statusで管理
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds, action } = body;
    
    console.log('[Archive API] Request:', { productIds, action });
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '商品IDを指定してください' 
      }, { status: 400 });
    }
    
    if (!action || !['archive', 'unarchive'].includes(action)) {
      return NextResponse.json({ 
        success: false, 
        error: 'actionは "archive" または "unarchive" を指定してください' 
      }, { status: 400 });
    }
    
    const supabase = await createClient();
    
    // アーカイブ: listing_status を 'archived' に設定
    // アーカイブ解除: listing_status を null に戻す
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };
    
    if (action === 'archive') {
      updateData.listing_status = 'archived';
    } else {
      // アーカイブ解除時は listing_status を null に戻す
      // これにより「全商品」「データ編集」タブなどに表示される
      updateData.listing_status = null;
      // ✨ workflow_statusもリセットして「データ編集」タブに表示されるように
      updateData.workflow_status = null;
    }
    
    console.log('[Archive API] Update data:', updateData);
    
    // products_master テーブルを更新
    const { data, error } = await supabase
      .from('products_master')
      .update(updateData)
      .in('id', productIds)
      .select('id, listing_status');
    
    if (error) {
      console.error('[Archive API] Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }
    
    const updatedCount = data?.length || 0;
    
    console.log(`[Archive API] ${action}: ${updatedCount}件更新`, data);
    
    return NextResponse.json({
      success: true,
      action,
      updated: updatedCount,
      productIds: data?.map(d => d.id) || []
    });
    
  } catch (error: any) {
    console.error('[Archive API] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
