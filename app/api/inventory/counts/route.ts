/**
 * 棚卸しタブカウント取得API v2
 * GET /api/inventory/counts
 * 
 * 【新設計】在庫管理の厳格化
 * 
 * 物理在庫（physical_stock_total）:
 * - inventory_type = 'stock'
 * - product_type != 'set' (セット品を除外)
 * - is_variation_parent = false (バリエーション親を除外)
 * 
 * @version 2.0.0
 * @date 2026-01-14
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 有在庫判定（優先順位）
 */
function isStockItem(item: any): boolean {
  if (item.inventory_type === 'stock') return true;
  if (item.inventory_type === 'mu') return false;
  const sku = (item.sku || '').toLowerCase();
  return sku.includes('stock');
}

/**
 * 物理在庫判定（真実の在庫）
 * セット品とバリエーション親を除外
 */
function isPhysicalStock(item: any): boolean {
  // 有在庫でなければNG
  if (!isStockItem(item)) return false;
  
  // セット品を除外
  if (item.product_type === 'set') return false;
  
  // バリエーション親を除外
  if (item.is_variation_parent === true) return false;
  
  return true;
}

// MUG非英語パターン（バックアップ用）
const MUG_NON_ENGLISH_PATTERNS = [
  /\bKarten\b/i, /\bActionfigur\b/i, /\bCarta\b/i, /\bCarte\b/i,
  /\bFigurine\b/i, /\bcartas\b/i, /\bFigurka\b/i,
];

/**
 * MUG派生リスティングかどうか判定
 * USD以外の通貨は除外
 */
function isMugDerivedListing(item: any): boolean {
  const currency = item.ebay_data?.currency;
  if (currency && currency !== 'USD') {
    return true;
  }
  // タイトルベースの非英語検出（バックアップ）
  const title = item.product_name || '';
  if (MUG_NON_ENGLISH_PATTERNS.some(pattern => pattern.test(title))) {
    return true;
  }
  return false;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const site = searchParams.get('site') || null;
    const ebayAccount = searchParams.get('ebay_account') || null;
    
    const supabase = await createClient();
    
    // 全データを取得
    const { data: allItems, error } = await supabase
      .from('inventory_master')
      .select('id, product_name, physical_quantity, product_type, is_variation_parent, is_variation_member, is_variation_child, is_manual_entry, source_data, ebay_data, inventory_type, sku');
    
    if (error) {
      console.error('Inventory counts query error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        counts: {},
      }, { status: 500 });
    }
    
    // MUGフィルタ適用
    let items = (allItems || []).filter(item => !isMugDerivedListing(item));
    
    // サイトフィルター
    if (site) {
      items = items.filter(item => item.source_data?.site === site);
    }
    
    // アカウントフィルター
    if (ebayAccount) {
      items = items.filter(item => 
        item.source_data?.ebay_account?.toLowerCase() === ebayAccount.toLowerCase()
      );
    }
    
    // ============================================================
    // 新カウント計算（厳格な在庫管理）
    // ============================================================
    
    // 物理在庫（真実の在庫）: セット品・バリエーション親を除外
    const physicalStockItems = items.filter(i => isPhysicalStock(i));
    const physicalStockTotal = physicalStockItems.length;
    
    // セット品カウント
    const setProducts = items.filter(i => i.product_type === 'set');
    const setProductsCount = setProducts.length;
    
    // バリエーション親カウント
    const variationParents = items.filter(i => i.is_variation_parent === true);
    const variationParentCount = variationParents.length;
    
    // バリエーション子カウント
    const variationChildren = items.filter(i => i.is_variation_member || i.is_variation_child);
    const variationChildCount = variationChildren.length;
    
    // 従来のカウント（互換性）
    const counts = {
      // === 新カウント（厳格） ===
      physical_stock_total: physicalStockTotal,  // 真実の物理在庫
      set_products_count: setProductsCount,       // セット品
      variation_parent_count: variationParentCount, // バリエーション親
      variation_child_count: variationChildCount,   // バリエーション子
      
      // === 従来のカウント（互換性） ===
      total: items.length,
      in_stock: items.filter(i => isStockItem(i)).length,
      out_of_stock: items.filter(i => !isStockItem(i)).length,
      variation_parent: variationParentCount,
      variation_member: variationChildCount,
      set_products: setProductsCount,
      manual_entry: items.filter(i => i.is_manual_entry).length,
      mjt_account: items.filter(i => 
        i.source_data?.ebay_account?.toLowerCase() === 'mjt'
      ).length,
      green_account: items.filter(i => 
        i.source_data?.ebay_account?.toLowerCase() === 'green'
      ).length,
    };
    
    // 派生カウント
    const derivedCounts = {
      variation_total: variationParentCount + variationChildCount,
      standalone: items.length - variationParentCount - variationChildCount - setProductsCount,
      
      // 除外された数（マスター在庫から除外）
      excluded_from_physical: setProductsCount + variationParentCount,
    };
    
    console.log(`[inventory/counts] 物理在庫: ${physicalStockTotal}件`);
    console.log(`[inventory/counts] セット品: ${setProductsCount}件, バリ親: ${variationParentCount}件`);
    console.log(`[inventory/counts] 全件: ${items.length}件`);
    
    return NextResponse.json({
      success: true,
      counts: { ...counts, ...derivedCounts },
      filters: { site, ebay_account: ebayAccount },
      
      // 新設計の説明
      summary: {
        physicalStock: {
          count: physicalStockTotal,
          description: '物理的に存在する単体商品（セット品・バリエーション親を除外）',
        },
        allData: {
          count: items.length,
          description: 'inventory_masterの全データ',
        },
        excluded: {
          sets: setProductsCount,
          variationParents: variationParentCount,
          total: setProductsCount + variationParentCount,
          description: 'マスター在庫から除外されたアイテム',
        },
      },
    });
    
  } catch (error) {
    console.error('Inventory counts API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'カウント取得エラー',
        counts: {},
      },
      { status: 500 }
    );
  }
}
