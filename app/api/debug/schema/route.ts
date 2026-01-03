/**
 * デバッグ用：products_masterテーブルのスキーマを確認
 * GET /api/debug/schema
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // products_masterから1件だけ取得して利用可能なカラムを確認
    const { data, error } = await supabase
      .from('products_master')
      .select('*')
      .limit(1);
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }, { status: 500 });
    }
    
    // 取得できたデータのキー（カラム名）を返す
    const columns = data && data.length > 0 ? Object.keys(data[0]).sort() : [];
    
    return NextResponse.json({
      success: true,
      table: 'products_master',
      columns: columns,
      column_count: columns.length,
      sample_data: data?.[0] || null,
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
