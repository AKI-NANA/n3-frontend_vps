import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * デバッグ用API: ebay_tokensテーブルのスキーマと実データ確認
 * GET /api/ebay/debug/schema
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // PostgreSQLのinformation_schemaから列定義を取得
    const { data: schemaData, error: schemaError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, character_maximum_length')
      .eq('table_name', 'ebay_tokens')
      .order('ordinal_position', { ascending: true });

    // 実際のデータも取得して比較
    const { data: actualData, error: dataError } = await supabase
      .from('ebay_tokens')
      .select('account, access_token, refresh_token');

    const result: any = {
      success: true,
      table_name: 'ebay_tokens',
      timestamp: new Date().toISOString()
    };

    // スキーマ情報
    if (schemaError) {
      result.schema_error = schemaError.message;
      result.schema_note = 'information_schema.columnsへのアクセスに失敗';
    } else {
      result.schema = schemaData;

      // 重要な列の型を抽出
      const accessTokenCol = schemaData?.find(col => col.column_name === 'access_token');
      const refreshTokenCol = schemaData?.find(col => col.column_name === 'refresh_token');

      result.critical_columns = {
        access_token: {
          data_type: accessTokenCol?.data_type,
          max_length: accessTokenCol?.character_maximum_length,
          warning: accessTokenCol?.character_maximum_length
            ? `⚠️ 最大${accessTokenCol.character_maximum_length}文字に制限されています`
            : null
        },
        refresh_token: {
          data_type: refreshTokenCol?.data_type,
          max_length: refreshTokenCol?.character_maximum_length,
          warning: refreshTokenCol?.character_maximum_length
            ? `⚠️ 最大${refreshTokenCol.character_maximum_length}文字に制限されています`
            : null
        }
      };
    }

    // 実データの分析
    if (dataError) {
      result.data_error = dataError.message;
    } else {
      result.actual_data_analysis = actualData?.map(item => ({
        account: item.account,
        access_token_length: item.access_token?.length || 0,
        refresh_token_length: item.refresh_token?.length || 0,
        access_token_preview: item.access_token?.substring(0, 30) + '...' || null,
        refresh_token_preview: item.refresh_token?.substring(0, 30) + '...' || null,
        has_access_token: !!item.access_token,
        has_refresh_token: !!item.refresh_token,
        is_token_too_short: (item.refresh_token?.length || 0) < 100,
        is_token_truncated: (item.refresh_token?.length || 0) === 96
      }));

      // 問題診断
      result.diagnostics = {
        total_accounts: actualData?.length || 0,
        accounts_with_short_tokens: actualData?.filter(item =>
          (item.refresh_token?.length || 0) < 100
        ).length || 0,
        accounts_with_96_char_tokens: actualData?.filter(item =>
          (item.refresh_token?.length || 0) === 96
        ).length || 0,
        accounts_without_tokens: actualData?.filter(item =>
          !item.refresh_token
        ).length || 0
      };
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ スキーマ確認エラー:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
