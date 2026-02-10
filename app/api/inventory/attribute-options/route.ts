// app/api/inventory/attribute-options/route.ts
/**
 * 属性オプション取得API
 * 
 * inventory_master テーブルから一意の属性リストを抽出し、
 * 連動プルダウンの選択肢として返す
 * 
 * クエリパラメータ:
 * - l1: 選択されたL1属性（L2オプションをフィルタリング）
 * - l2: 選択されたL2属性（L3オプションをフィルタリング）
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
    const l1 = searchParams.get('l1');
    const l2 = searchParams.get('l2');

    // L1オプション: 全ての一意な attr_l1 値を取得
    const { data: l1Data, error: l1Error } = await supabase
      .from('inventory_master')
      .select('attr_l1')
      .not('attr_l1', 'is', null)
      .neq('attr_l1', '');

    if (l1Error) {
      console.error('[attribute-options] L1 error:', l1Error);
    }

    const l1Options = l1Data
      ? [...new Set(l1Data.map((d) => d.attr_l1).filter(Boolean))]
          .sort((a, b) => a.localeCompare(b, 'ja'))
      : [];

    // L2オプション: L1でフィルタリングされた一意な attr_l2 値を取得
    let l2Options: string[] = [];
    if (l1) {
      const { data: l2Data, error: l2Error } = await supabase
        .from('inventory_master')
        .select('attr_l2')
        .eq('attr_l1', l1)
        .not('attr_l2', 'is', null)
        .neq('attr_l2', '');

      if (l2Error) {
        console.error('[attribute-options] L2 error:', l2Error);
      }

      l2Options = l2Data
        ? [...new Set(l2Data.map((d) => d.attr_l2).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b, 'ja'))
        : [];
    }

    // L3オプション: L1+L2でフィルタリングされた一意な attr_l3 値を取得
    let l3Options: string[] = [];
    if (l1 && l2) {
      const { data: l3Data, error: l3Error } = await supabase
        .from('inventory_master')
        .select('attr_l3')
        .eq('attr_l1', l1)
        .eq('attr_l2', l2)
        .not('attr_l3', 'is', null)
        .neq('attr_l3', '');

      if (l3Error) {
        console.error('[attribute-options] L3 error:', l3Error);
      }

      l3Options = l3Data
        ? [...new Set(l3Data.map((d) => d.attr_l3).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b, 'ja'))
        : [];
    }

    return NextResponse.json({
      success: true,
      l1Options,
      l2Options,
      l3Options,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[attribute-options] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch attribute options',
      },
      { status: 500 }
    );
  }
}
