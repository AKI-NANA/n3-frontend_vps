/**
 * eBayデータの通貨・ユニーク商品調査API
 * GET /api/products/investigate-ebay
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
        title,
        ebay_item_id
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
    // eBayデータ（inventory_master_idあり）の分析
    // ============================================================
    
    const ebayData = allProducts.filter(p => p.inventory_master_id);
    const manualData = allProducts.filter(p => !p.inventory_master_id);
    
    // 通貨別分布
    const currencyDist: Record<string, number> = {};
    ebayData.forEach(p => {
      const currency = p.currency || 'null';
      currencyDist[currency] = (currencyDist[currency] || 0) + 1;
    });
    
    // is_parent別分布
    const parentDist: Record<string, number> = {};
    ebayData.forEach(p => {
      const parent = String(p.is_parent);
      parentDist[parent] = (parentDist[parent] || 0) + 1;
    });
    
    // is_parent=true の通貨分布
    const parentTrueCurrency: Record<string, number> = {};
    ebayData.filter(p => p.is_parent === true).forEach(p => {
      const currency = p.currency || 'null';
      parentTrueCurrency[currency] = (parentTrueCurrency[currency] || 0) + 1;
    });
    
    // ============================================================
    // SKUベースでユニーク商品を特定
    // ============================================================
    
    // SKUから通貨サフィックスを除去してベースSKUを取得
    function getBaseSku(sku: string): string {
      if (!sku) return '';
      // INV-ebay-mjt-286081936240-EUR → INV-ebay-mjt-286081936240
      const suffixes = ['-USD', '-EUR', '-GBP', '-AUD', '-CAD', '-JPY'];
      for (const suffix of suffixes) {
        if (sku.endsWith(suffix)) {
          return sku.slice(0, -suffix.length);
        }
      }
      return sku;
    }
    
    // ベースSKUでグループ化
    const skuGroups: Record<string, any[]> = {};
    ebayData.forEach(p => {
      const baseSku = getBaseSku(p.sku);
      if (!skuGroups[baseSku]) skuGroups[baseSku] = [];
      skuGroups[baseSku].push(p);
    });
    
    // グループサイズの分布
    const skuGroupSizeDist: Record<string, number> = {};
    Object.values(skuGroups).forEach(group => {
      const size = group.length;
      skuGroupSizeDist[size] = (skuGroupSizeDist[size] || 0) + 1;
    });
    
    // サンプル：5件以上のグループ
    const largeGroups = Object.entries(skuGroups)
      .filter(([sku, records]) => records.length >= 5)
      .slice(0, 3)
      .map(([baseSku, records]) => ({
        base_sku: baseSku,
        count: records.length,
        currencies: records.map(r => r.currency),
        is_parents: records.map(r => r.is_parent),
        inventory_master_ids: records.map(r => r.inventory_master_id),
      }));
    
    // ============================================================
    // ebay_item_idベースでユニーク商品を特定
    // ============================================================
    
    const itemIdGroups: Record<string, any[]> = {};
    ebayData.forEach(p => {
      const itemId = p.ebay_item_id || 'null';
      if (!itemIdGroups[itemId]) itemIdGroups[itemId] = [];
      itemIdGroups[itemId].push(p);
    });
    
    const itemIdGroupSizeDist: Record<string, number> = {};
    Object.values(itemIdGroups).forEach(group => {
      const size = group.length;
      itemIdGroupSizeDist[size] = (itemIdGroupSizeDist[size] || 0) + 1;
    });
    
    // ============================================================
    // 正しいマスター数の計算
    // ============================================================
    
    // 方法1: is_parent=true のみ
    const method1 = ebayData.filter(p => p.is_parent === true).length + manualData.filter(p => p.is_parent === true).length;
    
    // 方法2: SKUベースでユニーク
    const method2 = Object.keys(skuGroups).length + manualData.length;
    
    // 方法3: ebay_item_idベースでユニーク
    const uniqueItemIds = Object.keys(itemIdGroups).filter(id => id !== 'null').length;
    const nullItemIdCount = (itemIdGroups['null'] || []).length;
    const method3 = uniqueItemIds + manualData.length;
    
    return NextResponse.json({
      success: true,
      investigation: {
        total_records: allProducts.length,
        ebay_data_count: ebayData.length,
        manual_data_count: manualData.length,
        
        ebay_analysis: {
          currency_distribution: currencyDist,
          is_parent_distribution: parentDist,
          parent_true_currency_distribution: parentTrueCurrency,
        },
        
        sku_based_grouping: {
          unique_base_skus: Object.keys(skuGroups).length,
          group_size_distribution: skuGroupSizeDist,
          sample_large_groups: largeGroups,
        },
        
        ebay_item_id_grouping: {
          unique_item_ids: uniqueItemIds,
          null_item_id_count: nullItemIdCount,
          group_size_distribution: itemIdGroupSizeDist,
        },
        
        correct_master_calculation: {
          method1_is_parent_true: method1,
          method2_sku_based: method2,
          method3_ebay_item_id: method3,
          
          recommended: method1,
          reason: 'is_parent=true が正しい代表レコード。SKUベースやitem_idベースは不完全。',
        },
      },
    });
  } catch (error: any) {
    console.error('[investigate-ebay] エラー:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
