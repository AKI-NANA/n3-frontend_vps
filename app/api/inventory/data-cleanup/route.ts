// app/api/inventory/data-cleanup/route.ts
/**
 * データクレンジングAPI
 * 
 * 機能:
 * - 重複SKUの検出・整理
 * - 無効なSKUの修正
 * - storage_locationの正規化
 * - location_detailsの整合性チェック
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET: データ品質レポート取得
 */
export async function GET(request: NextRequest) {
  try {
    // 無効なSKUを検出（短すぎる、汎用的すぎるもの）
    const { data: invalidSkus, error: invError } = await supabase
      .from('inventory_master')
      .select('id, sku, product_name')
      .or('sku.eq.stock,sku.like.SKU %,sku.is.null')
      .limit(100);
    
    // storage_locationの分布
    const { data: locationDistRaw, error: locError } = await supabase
      .from('inventory_master')
      .select('storage_location')
      .eq('inventory_type', 'stock');
    
    // 分布を集計
    const locationDist: Record<string, number> = {};
    locationDistRaw?.forEach(r => {
      const loc = r.storage_location || 'unknown';
      locationDist[loc] = (locationDist[loc] || 0) + 1;
    });
    
    // location_detailsが空のレコード
    const { count: emptyLocationDetails } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .eq('inventory_type', 'stock')
      .or('location_details.is.null,location_details.eq.[]');
    
    // needs_count_check, stock_confirmedの統計
    const { data: flagStats } = await supabase
      .from('inventory_master')
      .select('needs_count_check, stock_confirmed')
      .eq('inventory_type', 'stock');
    
    const needsCheckCount = flagStats?.filter(r => r.needs_count_check).length || 0;
    const confirmedCount = flagStats?.filter(r => r.stock_confirmed).length || 0;
    
    // 重複SKUを検出（SQLで直接集計）
    const { data: skuCounts } = await supabase
      .from('inventory_master')
      .select('sku')
      .eq('inventory_type', 'stock');
    
    const skuCountMap: Record<string, number> = {};
    skuCounts?.forEach(r => {
      if (r.sku) {
        skuCountMap[r.sku] = (skuCountMap[r.sku] || 0) + 1;
      }
    });
    
    const duplicateSkus = Object.entries(skuCountMap)
      .filter(([_, count]) => count > 1)
      .map(([sku, count]) => ({ sku, count }));
    
    return NextResponse.json({
      success: true,
      report: {
        duplicateSkus,
        invalidSkus: invalidSkus || [],
        locationDistribution: locationDist,
        emptyLocationDetails: emptyLocationDetails || 0,
        flagStats: {
          total: flagStats?.length || 0,
          needsCheckCount,
          confirmedCount,
        },
      },
    });
    
  } catch (error: any) {
    console.error('[DataCleanup] Report error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST: データクレンジング実行
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { actions = [] } = body;
    
    const results: Record<string, any> = {};
    
    // storage_location正規化
    if (actions.includes('normalize_storage_location')) {
      const { count: emvFixed } = await supabase
        .from('inventory_master')
        .update({ storage_location: 'env', updated_at: new Date().toISOString() })
        .eq('storage_location', 'emv');
      
      results.storageLocationNormalized = emvFixed || 0;
    }
    
    // location_detailsの補完
    if (actions.includes('fix_location_details')) {
      const { data: emptyRecords, error } = await supabase
        .from('inventory_master')
        .select('id, storage_location, physical_quantity')
        .eq('inventory_type', 'stock')
        .or('location_details.is.null,location_details.eq.[]');
      
      if (!error && emptyRecords) {
        let fixed = 0;
        for (const record of emptyRecords) {
          const { error: updateError } = await supabase
            .from('inventory_master')
            .update({
              location_details: [{
                location: record.storage_location || 'env',
                qty: record.physical_quantity || 0,
              }],
              updated_at: new Date().toISOString(),
            })
            .eq('id', record.id);
          
          if (!updateError) fixed++;
        }
        results.locationDetailsFixed = fixed;
      }
    }
    
    // 重複SKUにサフィックスを追加
    if (actions.includes('fix_duplicate_skus')) {
      const { data: duplicates } = await supabase
        .from('inventory_master')
        .select('id, sku')
        .in('sku', ['stock', 'Stock', 'STOCK']);
      
      if (duplicates) {
        let fixed = 0;
        for (const record of duplicates) {
          const newSku = `${record.sku}_${record.id.slice(0, 8)}`;
          const { error } = await supabase
            .from('inventory_master')
            .update({ sku: newSku, updated_at: new Date().toISOString() })
            .eq('id', record.id);
          
          if (!error) fixed++;
        }
        results.duplicateSkusFixed = fixed;
      }
    }
    
    // 無効なSKUを修正（空、NULL、汎用的すぎる）
    if (actions.includes('fix_invalid_skus')) {
      const { data: invalidRecords } = await supabase
        .from('inventory_master')
        .select('id, product_name, created_at')
        .or('sku.is.null,sku.eq.,sku.like.SKU %');
      
      if (invalidRecords) {
        let fixed = 0;
        for (const record of invalidRecords) {
          const dateStr = new Date(record.created_at).toISOString().slice(0, 10).replace(/-/g, '');
          const newSku = `AUTO-${dateStr}-${record.id.slice(0, 6)}`;
          const { error } = await supabase
            .from('inventory_master')
            .update({ sku: newSku, updated_at: new Date().toISOString() })
            .eq('id', record.id);
          
          if (!error) fixed++;
        }
        results.invalidSkusFixed = fixed;
      }
    }
    
    console.log('[DataCleanup] Results:', results);
    
    return NextResponse.json({
      success: true,
      results,
    });
    
  } catch (error: any) {
    console.error('[DataCleanup] Execution error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
