// app/api/inventory/search/route.ts
/**
 * 在庫商品検索API（セット構成追加用）
 * 
 * GET: SKUまたは商品名で在庫商品を検索
 * 
 * クエリパラメータ:
 * - q: 検索クエリ（SKU or 商品名）
 * - excludeIds: 除外するID（カンマ区切り）
 * - excludeSets: セット品を除外するか（true/false）
 * - limit: 取得件数（デフォルト: 20）
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();
    const excludeIdsParam = searchParams.get('excludeIds');
    const excludeSets = searchParams.get('excludeSets') === 'true';
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    
    if (!q || q.length < 1) {
      return NextResponse.json(
        { success: false, error: 'Search query (q) required' },
        { status: 400 }
      );
    }
    
    // クエリ構築
    let query = supabase
      .from('inventory_master')
      .select('id, sku, product_name, physical_quantity, reserved_quantity, images, product_type, cost_price')
      .or(`sku.ilike.%${q}%,product_name.ilike.%${q}%`)
      .order('product_name', { ascending: true })
      .limit(limit);
    
    // 除外ID
    if (excludeIdsParam) {
      const excludeIds = excludeIdsParam.split(',').filter(Boolean);
      if (excludeIds.length > 0) {
        // NOT IN は直接使えないので、別の方法で除外
        // Supabaseでは.not('id', 'in', excludeIds)は動作しない場合があるため、
        // クライアント側でフィルタリングするか、別の方法を使用
        // ここではRPCを使わず、クライアント側でフィルタリング
      }
    }
    
    // セット品除外
    if (excludeSets) {
      query = query.neq('product_type', 'set');
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // 除外IDのフィルタリング（クライアント側）
    let filteredData = data || [];
    if (excludeIdsParam) {
      const excludeIds = excludeIdsParam.split(',').filter(Boolean);
      filteredData = filteredData.filter(item => !excludeIds.includes(String(item.id)));
    }
    
    // レスポンス形式を整形
    const results = filteredData.map(item => ({
      id: item.id,
      sku: item.sku,
      product_name: item.product_name,
      physical_quantity: item.physical_quantity || 0,
      reserved_quantity: item.reserved_quantity || 0,
      available_quantity: (item.physical_quantity || 0) - (item.reserved_quantity || 0),
      image_url: item.images?.[0] || null,
      product_type: item.product_type,
      cost_price: item.cost_price,
    }));
    
    return NextResponse.json({
      success: true,
      results,
      total: results.length,
    });
    
  } catch (error: any) {
    console.error('[inventory/search] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
