// app/api/inventory/list/route.ts
/**
 * 棚卸し商品一覧API - サーバーサイドフィルタリング対応
 * 
 * Phase 4: パフォーマンス最適化
 * - サーバーサイドでのフィルタリング・ソート・ページネーション
 * - 大量データ（10,000件以上）でも高速レスポンス
 * 
 * クエリパラメータ:
 * - page: ページ番号（デフォルト: 1）
 * - limit: 1ページあたりの件数（デフォルト: 50、最大: 500）
 * - attrL1, attrL2, attrL3: L1-L3属性フィルター
 * - search: 商品名・SKU検索
 * - inventoryType: 在庫タイプ（stock/backorder）
 * - ebayAccount: eBayアカウント（mjt/green/manual）
 * - noImages: 画像なしのみ（true/false）
 * - sortField: ソートフィールド
 * - sortOrder: ソート順序（asc/desc）
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// MUG（Multi-country Listing）非英語パターン
const MUG_NON_ENGLISH_PATTERNS = [
  'Karten', 'Sumpf', 'Komplett', 'Actionfigur',
  'Carta', 'Carte', 'giapponese', 'Figurine',
  'cartas', 'Figura de acción', 'Actiefiguur', 'Figurka',
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // パラメータ取得
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') || '50')));
    const attrL1 = searchParams.get('attrL1');
    const attrL2 = searchParams.get('attrL2');
    const attrL3 = searchParams.get('attrL3');
    const search = searchParams.get('search');
    const inventoryType = searchParams.get('inventoryType');
    const ebayAccount = searchParams.get('ebayAccount');
    const noImages = searchParams.get('noImages') === 'true';
    const masterOnly = searchParams.get('masterOnly') === 'true';
    const variationStatus = searchParams.get('variationStatus');
    const productType = searchParams.get('productType');
    const sortField = searchParams.get('sortField') || 'created_at';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    
    // クエリ構築
    let query = supabase
      .from('inventory_master')
      .select('*', { count: 'exact' });
    
    // L1-L3属性フィルター
    if (attrL1) {
      query = query.eq('attr_l1', attrL1);
    }
    if (attrL2) {
      query = query.eq('attr_l2', attrL2);
    }
    if (attrL3) {
      query = query.eq('attr_l3', attrL3);
    }
    
    // 検索フィルター（商品名・SKU・unique_id）
    if (search) {
      const searchLower = search.toLowerCase();
      query = query.or(`product_name.ilike.%${searchLower}%,sku.ilike.%${searchLower}%,unique_id.ilike.%${searchLower}%`);
    }
    
    // 在庫タイプフィルター
    if (inventoryType) {
      query = query.eq('inventory_type', inventoryType);
    }
    
    // eBayアカウントフィルター
    if (ebayAccount) {
      if (ebayAccount === 'manual') {
        // 手動登録商品
        query = query.eq('is_manual_entry', true);
      } else {
        // source_data->ebay_accountでフィルター
        query = query.eq('source_data->>ebay_account', ebayAccount);
      }
    }
    
    // 画像なしフィルター
    if (noImages) {
      query = query.or('images.is.null,images.eq.[]');
    }
    
    // マスターアイテムフィルター
    if (masterOnly) {
      // 画像あり または 手動登録
      query = query.or('images.neq.[],is_manual_entry.eq.true');
    }
    
    // バリエーションステータスフィルター
    if (variationStatus) {
      switch (variationStatus) {
        case 'parent':
          query = query.eq('is_variation_parent', true);
          break;
        case 'member':
          query = query.or('is_variation_member.eq.true,is_variation_child.eq.true');
          break;
        case 'standalone':
          query = query
            .eq('is_variation_parent', false)
            .eq('is_variation_member', false)
            .eq('is_variation_child', false);
          break;
      }
    }
    
    // 商品タイプフィルター
    if (productType) {
      query = query.eq('product_type', productType);
    }
    
    // MUG派生リスティング除外（USD以外の通貨）
    // 注: JSONBフィールドのフィルタリングはSupabase側で制限あり
    // クライアント側で追加フィルタリングが必要な場合あり
    
    // ソート適用
    const validSortFields = ['created_at', 'updated_at', 'product_name', 'sku', 'cost_price', 'selling_price', 'physical_quantity'];
    const actualSortField = validSortFields.includes(sortField) ? sortField : 'created_at';
    query = query.order(actualSortField, { ascending: sortOrder === 'asc' });
    
    // ページネーション
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, count, error } = await query.range(from, to);
    
    if (error) {
      console.error('[inventory/list] Query error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    // MUG派生リスティング除外（クライアント側フィルタリング）
    const filteredData = (data || []).filter(item => {
      // USD以外の通貨は除外
      const currency = item.ebay_data?.currency;
      if (currency && currency !== 'USD') {
        return false;
      }
      // 非英語タイトルパターン検出
      const title = item.product_name || '';
      if (MUG_NON_ENGLISH_PATTERNS.some(pattern => 
        title.toLowerCase().includes(pattern.toLowerCase())
      )) {
        return false;
      }
      return true;
    });
    
    // 統計情報を追加（フィルター適用後）
    const stats = {
      totalInPage: filteredData.length,
      totalFiltered: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
    
    return NextResponse.json({
      success: true,
      data: filteredData,
      stats,
    });
    
  } catch (error: any) {
    console.error('[inventory/list] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST: バルク操作用（将来拡張）
 * - 一括属性更新
 * - 一括在庫更新
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ids, updates } = body;
    
    if (!action || !ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request: action and ids required' },
        { status: 400 }
      );
    }
    
    switch (action) {
      case 'bulk_update_attributes': {
        // L1-L3属性の一括更新
        const { attr_l1, attr_l2, attr_l3 } = updates || {};
        const updateData: Record<string, any> = {};
        if (attr_l1 !== undefined) updateData.attr_l1 = attr_l1;
        if (attr_l2 !== undefined) updateData.attr_l2 = attr_l2;
        if (attr_l3 !== undefined) updateData.attr_l3 = attr_l3;
        updateData.updated_at = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('inventory_master')
          .update(updateData)
          .in('id', ids)
          .select('id');
        
        if (error) throw error;
        
        return NextResponse.json({
          success: true,
          updated: data?.length || 0,
        });
      }
      
      case 'bulk_update_inventory_type': {
        // 在庫タイプの一括更新
        const { inventory_type } = updates || {};
        if (!inventory_type) {
          return NextResponse.json(
            { success: false, error: 'inventory_type required' },
            { status: 400 }
          );
        }
        
        const { data, error } = await supabase
          .from('inventory_master')
          .update({ 
            inventory_type, 
            updated_at: new Date().toISOString() 
          })
          .in('id', ids)
          .select('id');
        
        if (error) throw error;
        
        return NextResponse.json({
          success: true,
          updated: data?.length || 0,
        });
      }
      
      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error: any) {
    console.error('[inventory/list] POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
