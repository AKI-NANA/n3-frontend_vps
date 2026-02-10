import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state') || 'green';

    // リクエストホストから動的にベースURLを構築
    const host = request.headers.get('host') || '';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    if (error) {
      console.error('❌ eBay認証エラー:', error);
      return NextResponse.redirect(
        `${baseUrl}/ebay-auth?error=${error}`
      );
    }

    if (!code) {
      console.error('❌ 認証コードが見つかりません');
      return NextResponse.redirect(
        `${baseUrl}/ebay-auth?error=no_code`
      );
    }

    console.log('✅ 認証コード取得成功');
    console.log('🔑 Account:', state);

    // アカウント別に環境変数から認証情報を取得
    const accountUpper = state.toUpperCase();
    const clientId = process.env[`EBAY_CLIENT_ID_${accountUpper}`] || process.env.EBAY_CLIENT_ID;
    const clientSecret = process.env[`EBAY_CLIENT_SECRET_${accountUpper}`] || process.env.EBAY_CLIENT_SECRET;
    
    console.log('🔑 Account for credentials:', state, '->', accountUpper);

    if (!clientId || !clientSecret) {
      console.error('❌ eBay認証情報が設定されていません');
      return NextResponse.redirect(
        `${baseUrl}/ebay-auth?error=config_error`
      );
    }

    // 🔧 OAuth EnabledなRuNameに統一（vxqgttz）
    // MJT/GREEN両方とも同じRuNameを使用し、stateパラメータでアカウントを区別
    const ruName = 'HIROAKI_ARITA-HIROAKIA-HIROAK-vxqgttz';

    console.log('🔧 使用する設定:');
    console.log('  - Host:', host);
    console.log('  - Client ID:', clientId?.substring(0, 20) + '...');
    console.log('  - RuName:', ruName);

    const supabase = await createClient();

    const authCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    console.log('🔄 トークン交換リクエスト送信中...');

    const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authCredentials}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: ruName,
        // スコープを追加（Refresh Tokenの完全な取得に必要かもしれない）
        scope: 'https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.analytics.readonly'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ トークン交換失敗:', errorText);
      return NextResponse.redirect(
        `${baseUrl}/ebay-auth?error=token_exchange_failed`
      );
    }

    const tokenData = await response.json();
    
    // 🔍 デバッグ: トークンの長さを確認
    console.log('✅ トークン取得成功');
    console.log('📏 Access Token Length:', tokenData.access_token?.length || 0);
    console.log('📏 Refresh Token Length:', tokenData.refresh_token?.length || 0);
    console.log('🔑 Refresh Token Preview:', tokenData.refresh_token?.substring(0, 50));

    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

    // 🔍 デバッグ: 保存前のデータ確認
    const dataToSave = {
      account: state,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: expiresAt,
      token_type: tokenData.token_type || 'Bearer',
      updated_at: new Date().toISOString()
    };
    
    console.log('💾 保存するデータ:');
    console.log('  - Account:', dataToSave.account);
    console.log('  - Refresh Token Length:', dataToSave.refresh_token?.length);
    console.log('  - Access Token Length:', dataToSave.access_token?.length);

    const { error: dbError, data: savedData } = await supabase
      .from('ebay_tokens')
      .upsert(dataToSave, { onConflict: 'account' })
      .select();

    if (dbError) {
      console.error('❌ トークン保存失敗:', dbError);
      return NextResponse.redirect(
        `${baseUrl}/ebay-auth?error=db_error`
      );
    }

    // 🔍 デバッグ: 保存後のデータ確認
    console.log('✅ トークン保存成功');
    if (savedData && savedData[0]) {
      console.log('📊 保存後の確認:');
      console.log('  - Refresh Token Length:', savedData[0].refresh_token?.length);
    }

    return NextResponse.redirect(
      `${baseUrl}/ebay-auth?success=true`
    );

  } catch (error: any) {
    console.error('❌ コールバック処理エラー:', error);
    return NextResponse.redirect(
      `${baseUrl}/ebay-auth?error=unknown`
    );
  }
}
