import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { account, refreshToken } = await request.json();

    if (!account || !refreshToken) {
      return NextResponse.json(
        { error: 'アカウント名とRefresh Tokenが必要です' },
        { status: 400 }
      );
    }

    // Refresh Tokenの簡易検証
    if (refreshToken.length < 100) {
      return NextResponse.json(
        { error: 'Refresh Tokenが短すぎます。正しいトークンを入力してください' },
        { status: 400 }
      );
    }

    console.log('💾 手動トークン保存開始');
    console.log('  - Account:', account);
    console.log('  - Refresh Token Length:', refreshToken.length);

    // 環境変数から認証情報を取得
    const clientId = process.env.EBAY_CLIENT_ID_MJT || process.env.EBAY_CLIENT_ID;
    const clientSecret = process.env.EBAY_CLIENT_SECRET_MJT || process.env.EBAY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'eBay認証情報が設定されていません' },
        { status: 500 }
      );
    }

    // Refresh Tokenを使ってAccess Tokenを取得
    const authCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    console.log('🔄 Access Token取得中...');

    const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authCredentials}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Access Token取得失敗:', errorText);

      return NextResponse.json(
        { error: 'Refresh Tokenが無効です。eBay Developer Portalで再取得してください' },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();

    console.log('✅ Access Token取得成功');
    console.log('  - Access Token Length:', tokenData.access_token?.length || 0);
    console.log('  - 🔍 新しいRefresh Token:', tokenData.refresh_token ? 'あり（Rotation対応！）' : 'なし');

    if (tokenData.refresh_token) {
      console.log('  - 新しいRefresh Token Length:', tokenData.refresh_token?.length || 0);
    }

    // トークンをデータベースに保存
    const supabase = await createClient();

    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

    const dataToSave = {
      account,
      access_token: tokenData.access_token,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      token_type: tokenData.token_type || 'Bearer',
      updated_at: new Date().toISOString()
    };

    const { error: dbError, data: savedData } = await supabase
      .from('ebay_tokens')
      .upsert(dataToSave, { onConflict: 'account' })
      .select();

    if (dbError) {
      console.error('❌ データベース保存失敗:', dbError);
      return NextResponse.json(
        { error: 'データベースへの保存に失敗しました' },
        { status: 500 }
      );
    }

    console.log('✅ トークンをデータベースに保存しました');
    console.log('  - Saved Refresh Token Length:', savedData?.[0]?.refresh_token?.length);

    return NextResponse.json({
      success: true,
      message: 'トークンを正常に保存しました',
      account,
      expiresAt,
      tokenLength: {
        access: tokenData.access_token?.length,
        refresh: refreshToken.length
      }
    });

  } catch (error: any) {
    console.error('❌ トークン保存エラー:', error);
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}
