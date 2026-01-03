/**
 * 棚卸しタブカウント取得API
 * GET /api/inventory/counts
 * 
 * inventory_master テーブルの各フィルター条件に基づくカウントを取得
 * MUG派生リスティング（USD以外の通貨）を除外
 * 
 * パラメータ:
 * - site: サイト（USA等）
 * - ebay_account: eBayアカウント（MJT, GREEN等）
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
    
    // カウント計算
    const counts = {
      total: items.length,
      in_stock: items.filter(i => isStockItem(i)).length,
      out_of_stock: items.filter(i => !isStockItem(i)).length,
      variation_parent: items.filter(i => i.is_variation_parent).length,
      variation_member: items.filter(i => i.is_variation_member || i.is_variation_child).length,
      set_products: items.filter(i => i.product_type === 'set').length,
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
      variation_total: counts.variation_parent + counts.variation_member,
      standalone: counts.total - counts.variation_parent - counts.variation_member - counts.set_products,
    };
    
    console.log(`[inventory/counts] MUGフィルタ適用: ${allItems?.length || 0}件 → ${items.length}件`);
    console.log('[inventory/counts] カウント取得完了:', { ...counts, ...derivedCounts });
    
    return NextResponse.json({
      success: true,
      counts: { ...counts, ...derivedCounts },
      filters: { site, ebay_account: ebayAccount },
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
