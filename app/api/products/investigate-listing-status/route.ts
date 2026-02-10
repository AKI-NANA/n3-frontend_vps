/**
 * listing_status調査API
 * GET /api/products/investigate-listing-status
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 全件取得
    const { data: allProducts, error } = await supabase
      .from('products_master')
      .select('id, sku, listing_status, is_parent, is_archived, physical_quantity, currency');
    
    if (error) throw error;
    
    // is_parent=true のみ
    const parentProducts = allProducts?.filter(p => p.is_parent === true) || [];
    
    // listing_status分布（全体）
    const listingStatusAll: Record<string, number> = {};
    allProducts?.forEach(p => {
      const status = p.listing_status || 'null';
      listingStatusAll[status] = (listingStatusAll[status] || 0) + 1;
    });
    
    // listing_status分布（is_parent=true）
    const listingStatusParent: Record<string, number> = {};
    parentProducts.forEach(p => {
      const status = p.listing_status || 'null';
      listingStatusParent[status] = (listingStatusParent[status] || 0) + 1;
    });
    
    // listing_status='active' のサンプル（is_parent=true）
    const activeSamples = parentProducts
      .filter(p => p.listing_status === 'active')
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        sku: p.sku,
        listing_status: p.listing_status,
        is_archived: p.is_archived,
        physical_quantity: p.physical_quantity,
        currency: p.currency,
      }));
    
    // データ編集（is_parent=true AND archived=false）
    const dataEditingProducts = parentProducts.filter(p => 
      p.is_archived !== true && p.listing_status !== 'archived'
    );
    
    // データ編集内のlisting_status分布
    const listingStatusDataEditing: Record<string, number> = {};
    dataEditingProducts.forEach(p => {
      const status = p.listing_status || 'null';
      listingStatusDataEditing[status] = (listingStatusDataEditing[status] || 0) + 1;
    });
    
    return NextResponse.json({
      success: true,
      investigation: {
        total_all: allProducts?.length || 0,
        total_parent: parentProducts.length,
        total_data_editing: dataEditingProducts.length,
        
        listing_status_distribution: {
          all: listingStatusAll,
          parent_only: listingStatusParent,
          data_editing: listingStatusDataEditing,
        },
        
        active_samples: activeSamples,
        active_count_parent: parentProducts.filter(p => p.listing_status === 'active').length,
        active_count_data_editing: dataEditingProducts.filter(p => p.listing_status === 'active').length,
      },
    });
  } catch (error: any) {
    console.error('[investigate-listing-status] エラー:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
