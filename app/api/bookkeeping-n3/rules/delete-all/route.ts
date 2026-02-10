// app/api/bookkeeping-n3/rules/delete-all/route.ts
/**
 * 全ルール削除API
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const confirm = searchParams.get('confirm');
    
    if (confirm !== 'yes') {
      return NextResponse.json(
        { success: false, error: 'confirm=yes パラメータが必要です' },
        { status: 400 }
      );
    }
    
    console.log('[Rules Delete All] 全ルール削除開始');
    
    // 全件数を取得
    const { count } = await supabase
      .from('mf_bookkeeping_rules')
      .select('*', { count: 'exact', head: true });
    
    // 全削除
    const { error } = await supabase
      .from('mf_bookkeeping_rules')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // 全件削除のトリック
    
    if (error) {
      console.error('[Rules Delete All] エラー:', error);
      throw error;
    }
    
    console.log('[Rules Delete All] 完了:', count, '件削除');
    
    return NextResponse.json({
      success: true,
      data: { deleted: count || 0 },
      message: `${count || 0}件のルールを削除しました`,
    });
    
  } catch (error) {
    console.error('[Rules Delete All] エラー:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '不明なエラー' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: '全ルール削除API',
    usage: 'DELETE /api/bookkeeping-n3/rules/delete-all?confirm=yes',
    warning: 'この操作は取り消せません',
  });
}
