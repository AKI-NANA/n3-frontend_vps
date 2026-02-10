/**
 * MUG重複調査API
 * GET /api/products/investigate-mug
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function fetchAllProducts(supabase: any) {
  const allProducts: any[] = [];
  const pageSize = 1000;
  let offset = 0;
  let hasMore = true;
  
  while (hasMore) {
    const { data, error } = await supabase
      .from('products_master')
      .select(`
        id, 
        inventory_master_id,
        currency,
        is_parent,
        listing_status,
        physical_quantity,
        is_archived,
        workflow_status,
        sku,
        source_system,
        title
      `)
      .range(offset, offset + pageSize - 1);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      allProducts.push(...data);
      offset += pageSize;
      hasMore = data.length === pageSize;
    } else {
      hasMore = false;
    }
  }
  
  return allProducts;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const allProducts = await fetchAllProducts(supabase);
    
    // ============================================================
    // inventory_master_idの分析
    // ============================================================
    
    const withInvId = allProducts.filter(p => p.inventory_master_id);
    const withoutInvId = allProducts.filter(p => !p.inventory_master_id);
    
    // inventory_master_idごとにグループ化
    const invIdGroups: Record<string, any[]> = {};
    withInvId.forEach(p => {
      const id = p.inventory_master_id;
      if (!invIdGroups[id]) invIdGroups[id] = [];
      invIdGroups[id].push(p);
    });
    
    // グループサイズの分布
    const groupSizeDist: Record<string, number> = {};
    Object.values(invIdGroups).forEach(group => {
      const size = group.length;
      groupSizeDist[size] = (groupSizeDist[size] || 0) + 1;
    });
    
    // ============================================================
    // inventory_master_idなしの分析
    // ============================================================
    
    // 通貨別分布
    const noInvIdCurrencyDist: Record<string, number> = {};
    withoutInvId.forEach(p => {
      const currency = p.currency || 'null';
      noInvIdCurrencyDist[currency] = (noInvIdCurrencyDist[currency] || 0) + 1;
    });
    
    // source_system別分布
    const noInvIdSourceDist: Record<string, number> = {};
    withoutInvId.forEach(p => {
      const source = p.source_system || 'null';
      noInvIdSourceDist[source] = (noInvIdSourceDist[source] || 0) + 1;
    });
    
    // is_parent別分布
    const noInvIdParentDist: Record<string, number> = {};
    withoutInvId.forEach(p => {
      const parent = String(p.is_parent);
      noInvIdParentDist[parent] = (noInvIdParentDist[parent] || 0) + 1;
    });
    
    // SKUパターン分析
    const noInvIdSkuPatterns: Record<string, number> = {};
    withoutInvId.forEach(p => {
      const sku = p.sku || '';
      let pattern = 'other';
      if (sku.startsWith('ITEM-')) pattern = 'ITEM-xxx (manual)';
      else if (sku.startsWith('INV-')) pattern = 'INV-xxx (ebay sync)';
      else if (sku.startsWith('STOCK-')) pattern = 'STOCK-xxx';
      else if (sku === '') pattern = 'empty';
      noInvIdSkuPatterns[pattern] = (noInvIdSkuPatterns[pattern] || 0) + 1;
    });
    
    // ============================================================
    // サンプルデータ
    // ============================================================
    
    const sampleNoInvId = withoutInvId.slice(0, 10).map(p => ({
      id: p.id,
      sku: p.sku,
      currency: p.currency,
      is_parent: p.is_parent,
      source_system: p.source_system,
      listing_status: p.listing_status,
    }));
    
    // マルチレコードグループのサンプル
    const multiRecordGroups = Object.entries(invIdGroups)
      .filter(([id, records]) => records.length > 1)
      .slice(0, 3)
      .map(([id, records]) => ({
        inventory_master_id: id,
        count: records.length,
        currencies: records.map(r => r.currency),
        is_parents: records.map(r => r.is_parent),
      }));
    
    // ============================================================
    // 正しいマスター数の計算
    // ============================================================
    
    // 1. inventory_master_idがあるもの: グループ数
    const uniqueInvIdCount = Object.keys(invIdGroups).length;
    
    // 2. inventory_master_idがないもの: 
    //    - 手動データ（ITEM-xxx）: 全件カウント
    //    - その他: is_parent=trueのみ、またはcurrency判定
    const manualData = withoutInvId.filter(p => (p.sku || '').startsWith('ITEM-'));
    const otherNoInvId = withoutInvId.filter(p => !(p.sku || '').startsWith('ITEM-'));
    
    // その他（inventory_master_idなし、非手動）の分析
    const otherNoInvIdParentOnly = otherNoInvId.filter(p => p.is_parent === true);
    
    return NextResponse.json({
      success: true,
      investigation: {
        total_records: allProducts.length,
        
        with_inventory_master_id: {
          count: withInvId.length,
          unique_groups: uniqueInvIdCount,
          group_size_distribution: groupSizeDist,
          sample_multi_record_groups: multiRecordGroups,
        },
        
        without_inventory_master_id: {
          count: withoutInvId.length,
          currency_distribution: noInvIdCurrencyDist,
          source_system_distribution: noInvIdSourceDist,
          is_parent_distribution: noInvIdParentDist,
          sku_pattern_distribution: noInvIdSkuPatterns,
          samples: sampleNoInvId,
        },
        
        correct_master_calculation: {
          from_inv_id_groups: uniqueInvIdCount,
          manual_data: manualData.length,
          other_no_inv_id_total: otherNoInvId.length,
          other_no_inv_id_parent_only: otherNoInvIdParentOnly.length,
          
          // 提案: inv_idグループ + 手動データ + その他(is_parent=trueのみ)
          proposed_master: uniqueInvIdCount + manualData.length + otherNoInvIdParentOnly.length,
        },
      },
    });
  } catch (error: any) {
    console.error('[investigate-mug] エラー:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
