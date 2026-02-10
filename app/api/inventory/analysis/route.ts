/**
 * 在庫データ分析API
 * GET /api/inventory/analysis
 * 
 * inventory_master と products_master の関係性を分析
 * 重複検出、データ完全性チェックなど
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. inventory_master のカラム情報
    const { data: inventoryMasterSample } = await supabase
      .from('inventory_master')
      .select('*')
      .limit(1);
    
    const inventoryMasterColumns = inventoryMasterSample && inventoryMasterSample[0] 
      ? Object.keys(inventoryMasterSample[0]) 
      : [];
    
    // 2. inventory_master の総数
    const { count: inventoryMasterCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true });
    
    // 3. products_master から inventory_master_id が設定されているものの数
    const { count: linkedProductsCount } = await supabase
      .from('products_master')
      .select('*', { count: 'exact', head: true })
      .not('inventory_master_id', 'is', null);
    
    // 4. inventory_type の分布（inventory_master）
    const { data: inventoryTypeDistribution } = await supabase
      .from('inventory_master')
      .select('inventory_type')
      .limit(1000);
    
    const typeDistribution = {
      stock: 0,
      mu: 0,
      null_or_empty: 0,
      other: 0,
    };
    
    inventoryTypeDistribution?.forEach(item => {
      if (item.inventory_type === 'stock') typeDistribution.stock++;
      else if (item.inventory_type === 'mu') typeDistribution.mu++;
      else if (!item.inventory_type) typeDistribution.null_or_empty++;
      else typeDistribution.other++;
    });
    
    // 5. 同じinventory_master_idを持つproducts_masterの重複確認
    const { data: duplicateLinks } = await supabase
      .from('products_master')
      .select('inventory_master_id, ebay_account')
      .not('inventory_master_id', 'is', null)
      .limit(2000);
    
    // 重複カウント
    const inventoryIdMap: Record<string, string[]> = {};
    duplicateLinks?.forEach(item => {
      const id = String(item.inventory_master_id);
      const account = item.ebay_account || 'unknown';
      if (!inventoryIdMap[id]) inventoryIdMap[id] = [];
      inventoryIdMap[id].push(account);
    });
    
    const duplicateInventoryIds = Object.entries(inventoryIdMap)
      .filter(([_, accounts]) => accounts.length > 1)
      .map(([id, accounts]) => ({
        inventory_master_id: id,
        linked_accounts: accounts,
        count: accounts.length,
      }));
    
    // 6. サンプルデータ取得（最新5件）
    const { data: inventorySamples } = await supabase
      .from('inventory_master')
      .select('id, unique_id, product_name, sku, inventory_type, physical_quantity, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5);
    
    return NextResponse.json({
      success: true,
      analysis: {
        inventory_master: {
          total_count: inventoryMasterCount,
          columns: inventoryMasterColumns,
          has_inventory_type_column: inventoryMasterColumns.includes('inventory_type'),
          inventory_type_distribution: typeDistribution,
          samples: inventorySamples,
        },
        products_master: {
          linked_to_inventory: linkedProductsCount,
        },
        duplicates: {
          total_duplicate_inventory_ids: duplicateInventoryIds.length,
          examples: duplicateInventoryIds.slice(0, 10),
        },
        recommendations: [
          typeDistribution.null_or_empty > 0 
            ? `⚠️ ${typeDistribution.null_or_empty}件のinventory_typeが未設定です。デフォルト値を設定してください。`
            : '✅ すべてのレコードにinventory_typeが設定されています',
          duplicateInventoryIds.length > 0
            ? `⚠️ ${duplicateInventoryIds.length}件のinventory_master_idが複数のproducts_masterで使用されています。マスタータブでは重複排除して表示することを推奨します。`
            : '✅ inventory_master_idの重複はありません',
        ],
      },
    });
    
  } catch (error: any) {
    console.error('Inventory analysis error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Analysis failed',
    }, { status: 500 });
  }
}
