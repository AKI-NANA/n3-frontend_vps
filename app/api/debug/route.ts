// デバッグ用API - 環境変数とSupabase接続をテスト
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const debug: any = {
    timestamp: new Date().toISOString(),
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ 設定済み' : '✗ 未設定',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ 設定済み' : '✗ 未設定',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ 設定済み' : '✗ 未設定',
    },
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    supabase: {
      connected: false,
      error: null,
      testQuery: null,
    }
  };

  try {
    console.log('[debug] Supabaseクライアント作成開始...');
    const supabase = await createClient();
    console.log('[debug] Supabaseクライアント作成完了');
    debug.supabase.connected = true;

    // シンプルなテストクエリ
    console.log('[debug] テストクエリ実行...');
    const { data, error, count } = await supabase
      .from('products_master')
      .select('id', { count: 'exact', head: true })
      .limit(1);
    
    if (error) {
      debug.supabase.error = {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      };
    } else {
      debug.supabase.testQuery = {
        success: true,
        totalRecords: count,
      };
    }
  } catch (error: any) {
    console.error('[debug] エラー:', error);
    debug.supabase.error = {
      type: 'Exception',
      message: error?.message || 'Unknown error',
      stack: error?.stack?.split('\n').slice(0, 5),
    };
  }

  return NextResponse.json(debug, { status: 200 });
}
