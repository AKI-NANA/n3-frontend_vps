import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * デバッグ用API: ebay_tokensテーブルの確認
 * GET /api/ebay/debug/tokens?account={account}
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const account = searchParams.get('account');

    const supabase = await createClient();

    if (account) {
      // 特定アカウントのトークン情報を取得
      const { data, error } = await supabase
        .from('ebay_tokens')
        .select('*')
        .eq('account', account)
        .single();

      if (error) {
        return NextResponse.json({
          success: false,
          error: error.message,
          account,
          message: `アカウント '${account}' のトークンが見つかりません`
        }, { status: 404 });
      }

      // トークンは伏せ字で返す
      const masked = {
        account: data.account,
        access_token: data.access_token ? `${data.access_token.substring(0, 20)}...` : null,
        refresh_token: data.refresh_token ? `${data.refresh_token.substring(0, 20)}...` : null,
        expires_at: data.expires_at,
        updated_at: data.updated_at,
        token_type: data.token_type,
        has_access_token: !!data.access_token,
        has_refresh_token: !!data.refresh_token,
        access_token_length: data.access_token?.length || 0,
        refresh_token_length: data.refresh_token?.length || 0,
        is_expired: new Date(data.expires_at) < new Date(),
        time_until_expiry: new Date(data.expires_at).getTime() - new Date().getTime()
      };

      return NextResponse.json({
        success: true,
        data: masked
      });
    } else {
      // 全アカウントの一覧を取得
      const { data, error } = await supabase
        .from('ebay_tokens')
        .select('*')
        .order('account', { ascending: true });

      if (error) {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 500 });
      }

      // 全アカウントのトークンを伏せ字で返す
      const maskedList = data?.map(item => ({
        account: item.account,
        access_token: item.access_token ? `${item.access_token.substring(0, 20)}...` : null,
        refresh_token: item.refresh_token ? `${item.refresh_token.substring(0, 20)}...` : null,
        expires_at: item.expires_at,
        updated_at: item.updated_at,
        token_type: item.token_type,
        has_access_token: !!item.access_token,
        has_refresh_token: !!item.refresh_token,
        access_token_length: item.access_token?.length || 0,
        refresh_token_length: item.refresh_token?.length || 0,
        is_expired: new Date(item.expires_at) < new Date()
      })) || [];

      return NextResponse.json({
        success: true,
        count: maskedList.length,
        data: maskedList
      });
    }
  } catch (error: any) {
    console.error('❌ デバッグAPI エラー:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
