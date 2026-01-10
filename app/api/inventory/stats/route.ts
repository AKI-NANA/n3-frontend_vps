// app/api/inventory/stats/route.ts
/**
 * 棚卸し統計API
 * 
 * Phase 5: 統計機能の拡張
 * - L1属性別・カテゴリ別・保管場所別の集計
 * - 画像登録状況
 * - Supabase RPC関数を使用した高速集計
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
    const type = searchParams.get('type') || 'all';
    
    switch (type) {
      case 'l1': {
        // L1属性別統計
        const { data, error } = await supabase.rpc('get_inventory_stats_by_l1');
        if (error) throw error;
        return NextResponse.json({ success: true, data });
      }
      
      case 'category': {
        // カテゴリ別統計
        const { data, error } = await supabase.rpc('get_inventory_stats_by_category');
        if (error) throw error;
        return NextResponse.json({ success: true, data });
      }
      
      case 'location': {
        // 保管場所別統計
        const { data, error } = await supabase.rpc('get_inventory_stats_by_location');
        if (error) throw error;
        return NextResponse.json({ success: true, data });
      }
      
      case 'all':
      default: {
        // 総合統計（RPC関数使用）
        // RPC関数が存在しない場合のフォールバック
        try {
          const { data, error } = await supabase.rpc('get_inventory_stats');
          if (error) throw error;
          return NextResponse.json({ success: true, data });
        } catch (rpcError) {
          // RPC関数が未作成の場合、直接クエリで集計
          console.warn('[inventory/stats] RPC not available, using direct query');
          
          // 直接クエリで集計
          const [
            l1Stats,
            categoryStats,
            locationStats,
            imageStats,
            totalStats,
          ] = await Promise.all([
            // L1属性別
            supabase
              .from('inventory_master')
              .select('attr_l1')
              .then(({ data }) => {
                const counts = new Map<string, { count: number; totalCost: number }>();
                (data || []).forEach((item: any) => {
                  const key = item.attr_l1 || '未分類';
                  const existing = counts.get(key) || { count: 0, totalCost: 0 };
                  existing.count++;
                  counts.set(key, existing);
                });
                return Array.from(counts.entries())
                  .map(([name, data]) => ({ name, ...data }))
                  .sort((a, b) => b.count - a.count);
              }),
            
            // カテゴリ別
            supabase
              .from('inventory_master')
              .select('category')
              .then(({ data }) => {
                const counts = new Map<string, { count: number; totalCost: number }>();
                (data || []).forEach((item: any) => {
                  const key = item.category || '未分類';
                  const existing = counts.get(key) || { count: 0, totalCost: 0 };
                  existing.count++;
                  counts.set(key, existing);
                });
                return Array.from(counts.entries())
                  .map(([name, data]) => ({ name, ...data }))
                  .sort((a, b) => b.count - a.count);
              }),
            
            // 保管場所別
            supabase
              .from('inventory_master')
              .select('storage_location')
              .then(({ data }) => {
                const counts = new Map<string, number>();
                (data || []).forEach((item: any) => {
                  const key = item.storage_location || '未設定';
                  counts.set(key, (counts.get(key) || 0) + 1);
                });
                return Array.from(counts.entries())
                  .map(([name, count]) => ({ name, count }))
                  .sort((a, b) => b.count - a.count);
              }),
            
            // 画像統計
            supabase
              .from('inventory_master')
              .select('images')
              .then(({ data }) => {
                let withImage = 0;
                let withoutImage = 0;
                (data || []).forEach((item: any) => {
                  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
                    withImage++;
                  } else {
                    withoutImage++;
                  }
                });
                return { withImage, withoutImage };
              }),
            
            // 総合統計
            supabase
              .from('inventory_master')
              .select('cost_price, physical_quantity')
              .then(({ data }) => {
                let totalCount = 0;
                let totalCost = 0;
                let inStockCount = 0;
                let outOfStockCount = 0;
                
                (data || []).forEach((item: any) => {
                  totalCount++;
                  const cost = (item.cost_price || 0) * (item.physical_quantity || 0);
                  totalCost += cost;
                  if ((item.physical_quantity || 0) > 0) {
                    inStockCount++;
                  } else {
                    outOfStockCount++;
                  }
                });
                
                return {
                  totalCount,
                  totalCost,
                  avgCost: totalCount > 0 ? totalCost / totalCount : 0,
                  inStockCount,
                  outOfStockCount,
                };
              }),
          ]);
          
          return NextResponse.json({
            success: true,
            data: {
              byL1: l1Stats,
              byCategory: categoryStats,
              byLocation: locationStats,
              imageStats,
              totalStats,
            },
          });
        }
      }
    }
    
  } catch (error: any) {
    console.error('[inventory/stats] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
