// app/api/inventory/filter-options/route.ts
/**
 * マスター（在庫）フィルターオプション取得API
 * 
 * L1〜L4、保管場所、コンディションのユニーク値を
 * DBから動的に取得して、ドロップダウンの選択肢として返す
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // inventory_master から必要なカラムを取得
    // 🔥 存在するカラムを使用（is_archivedは存在しない可能性があるので除外）
    const { data, error } = await supabase
      .from('inventory_master')
      .select('category, subcategory, storage_location, condition_name, physical_quantity, source_data');

    if (error) {
      console.error('[filter-options] DB error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // 全データを使用（is_archivedがないのでフィルターなし）
    const filteredData = data || [];

    // ユニーク値を抽出してカウント
    const extractOptions = (field: string, extractor?: (d: any) => string | null) => {
      const values = filteredData
        .map((d: any) => extractor ? extractor(d) : d[field])
        .filter((v: any) => v !== null && v !== undefined && v !== '');
      
      const counts: Record<string, number> = {};
      values.forEach((v: string) => {
        counts[v] = (counts[v] || 0) + 1;
      });

      // 件数でソート（降順）
      return Object.entries(counts)
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => b.count - a.count);
    };

    // 在庫数の範囲別カウント
    const stockRangeCounts = {
      all: filteredData.length,
      zero: filteredData.filter((d: any) => d.physical_quantity === 0).length,
      one: filteredData.filter((d: any) => d.physical_quantity === 1).length,
      two_to_five: filteredData.filter((d: any) => d.physical_quantity >= 2 && d.physical_quantity <= 5).length,
      six_to_ten: filteredData.filter((d: any) => d.physical_quantity >= 6 && d.physical_quantity <= 10).length,
      eleven_to_fifty: filteredData.filter((d: any) => d.physical_quantity >= 11 && d.physical_quantity <= 50).length,
      over_fifty: filteredData.filter((d: any) => d.physical_quantity > 50).length,
    };

    // 未設定の件数
    const unsetCounts = {
      l1: filteredData.filter((d: any) => !d.category || d.category === '').length,
      l2: filteredData.filter((d: any) => !d.subcategory || d.subcategory === '').length,
      l3: 0, // L3は未使用
      l4_marketplace: filteredData.filter((d: any) => !d.source_data?.marketplace || d.source_data?.marketplace === '').length,
      storage_location: filteredData.filter((d: any) => !d.storage_location || d.storage_location === '').length,
      condition: filteredData.filter((d: any) => !d.condition_name || d.condition_name === '').length,
    };

    const options = {
      // 🔥 実際に存在するカラムからデータを取得
      l1: extractOptions('category'),
      l2: extractOptions('subcategory'),
      l3: [], // L3は現時点で未使用
      l4_marketplace: extractOptions('source_data', (d) => d.source_data?.marketplace || null),
      storage_location: extractOptions('storage_location'),
      condition: extractOptions('condition_name'),
      stock_range: [
        { value: 'all', label: '全て', count: stockRangeCounts.all },
        { value: '0', label: '在庫0', count: stockRangeCounts.zero },
        { value: '1', label: '1個', count: stockRangeCounts.one },
        { value: '2-5', label: '2〜5個', count: stockRangeCounts.two_to_five },
        { value: '6-10', label: '6〜10個', count: stockRangeCounts.six_to_ten },
        { value: '11-50', label: '11〜50個', count: stockRangeCounts.eleven_to_fifty },
        { value: '51+', label: '51個以上', count: stockRangeCounts.over_fifty },
      ],
      unset_counts: unsetCounts,
      total: filteredData.length,
    };

    console.log('[filter-options] 取得結果:', {
      total: filteredData.length,
      l1_count: options.l1.length,
      l2_count: options.l2.length,
      storage_count: options.storage_location.length,
      condition_count: options.condition.length,
      l4_count: options.l4_marketplace.length,
    });

    return NextResponse.json({
      success: true,
      data: options,
    });

  } catch (error: any) {
    console.error('[filter-options] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
