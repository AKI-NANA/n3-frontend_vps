import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * デバッグ用API: ebay_credentialsテーブルの確認
 * GET /api/ebay/debug/credentials?account={account}
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const account = searchParams.get('account');

    const supabase = await createClient();

    if (account) {
      // 特定アカウントの認証情報を取得
      const { data, error } = await supabase
        .from('ebay_credentials')
        .select('*')
        .eq('account', account)
        .single();

      if (error) {
        return NextResponse.json({
          success: false,
          error: error.message,
          account
        }, { status: 404 });
      }

      // Secretは伏せ字で返す
      const masked = {
        account: data.account,
        client_id: data.client_id ? `${data.client_id.substring(0, 10)}...` : null,
        client_secret: data.client_secret ? `${data.client_secret.substring(0, 10)}...` : null,
        redirect_uri: data.redirect_uri,
        has_client_id: !!data.client_id,
        has_client_secret: !!data.client_secret,
        client_id_length: data.client_id?.length || 0,
        client_secret_length: data.client_secret?.length || 0
      };

      return NextResponse.json({
        success: true,
        data: masked
      });
    } else {
      // 全アカウントの一覧を取得
      const { data, error } = await supabase
        .from('ebay_credentials')
        .select('account, redirect_uri, client_id, client_secret')
        .order('account', { ascending: true });

      if (error) {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 500 });
      }

      // 全アカウントのSecretを伏せ字で返す
      const maskedList = data?.map(item => ({
        account: item.account,
        client_id: item.client_id ? `${item.client_id.substring(0, 10)}...` : null,
        client_secret: item.client_secret ? `${item.client_secret.substring(0, 10)}...` : null,
        redirect_uri: item.redirect_uri,
        has_client_id: !!item.client_id,
        has_client_secret: !!item.client_secret,
        client_id_length: item.client_id?.length || 0,
        client_secret_length: item.client_secret?.length || 0
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
