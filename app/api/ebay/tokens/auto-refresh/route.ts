import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * eBay Refresh Token自動更新API
 *
 * 用途：
 * - 定期的に全アカウントのRefresh Tokenを使ってAccess Tokenを更新
 * - 新しいRefresh Token（Rotation）があればDBに保存
 * - Vercel Cron Jobsまたは手動実行で使用
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 eBay Token自動更新開始');

    // 環境変数から認証情報を取得
    const clientId = process.env.EBAY_CLIENT_ID_MJT || process.env.EBAY_CLIENT_ID;
    const clientSecret = process.env.EBAY_CLIENT_SECRET_MJT || process.env.EBAY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'eBay認証情報が設定されていません' },
        { status: 500 }
      );
    }

    const supabase = await createClient();

    // 全アカウントのトークンを取得
    const { data: tokens, error: fetchError } = await supabase
      .from('ebay_tokens')
      .select('*');

    if (fetchError) {
      console.error('❌ トークン取得エラー:', fetchError);
      return NextResponse.json(
        { error: 'トークンの取得に失敗しました' },
        { status: 500 }
      );
    }

    if (!tokens || tokens.length === 0) {
      return NextResponse.json({
        message: '更新するトークンがありません',
        updated: 0
      });
    }

    console.log(`📊 更新対象: ${tokens.length}アカウント`);

    const results = [];
    const authCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // 各アカウントのトークンを更新
    for (const token of tokens) {
      try {
        console.log(`\n🔄 ${token.account}アカウントを更新中...`);

        // Refresh Tokenを使ってAccess Tokenを取得
        const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authCredentials}`
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: token.refresh_token
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ ${token.account}: トークン更新失敗`, errorText);
          results.push({
            account: token.account,
            success: false,
            error: 'トークン更新失敗'
          });
          continue;
        }

        const tokenData = await response.json();

        // 🔍 重要: 新しいRefresh Tokenが含まれているか確認
        const hasNewRefreshToken = !!tokenData.refresh_token;
        const newRefreshToken = tokenData.refresh_token || token.refresh_token;

        console.log(`✅ ${token.account}: Access Token更新成功`);
        console.log(`   - 新しいRefresh Token: ${hasNewRefreshToken ? '✅ あり（Rotation対応）' : '❌ なし'}`);

        if (hasNewRefreshToken) {
          console.log(`   - 新しいRefresh Token Length: ${newRefreshToken.length}`);
        }

        // トークンをDBに保存（新しいRefresh Tokenがあれば更新）
        const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

        const { error: updateError } = await supabase
          .from('ebay_tokens')
          .update({
            access_token: tokenData.access_token,
            refresh_token: newRefreshToken,
            expires_at: expiresAt,
            token_type: tokenData.token_type || 'Bearer',
            updated_at: new Date().toISOString()
          })
          .eq('account', token.account);

        if (updateError) {
          console.error(`❌ ${token.account}: DB更新失敗`, updateError);
          results.push({
            account: token.account,
            success: false,
            error: 'DB更新失敗'
          });
          continue;
        }

        console.log(`💾 ${token.account}: DB保存完了`);

        results.push({
          account: token.account,
          success: true,
          hasNewRefreshToken,
          expiresAt
        });

      } catch (error: any) {
        console.error(`❌ ${token.account}: エラー`, error);
        results.push({
          account: token.account,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const rotationCount = results.filter(r => r.success && r.hasNewRefreshToken).length;

    console.log(`\n✅ 更新完了: ${successCount}/${tokens.length}アカウント`);
    console.log(`🔄 Refresh Token Rotation: ${rotationCount}/${successCount}アカウント`);

    return NextResponse.json({
      success: true,
      total: tokens.length,
      updated: successCount,
      failed: tokens.length - successCount,
      rotationSupported: rotationCount > 0,
      results
    });

  } catch (error: any) {
    console.error('❌ 自動更新エラー:', error);
    return NextResponse.json(
      { error: '予期しないエラーが発生しました', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET: 手動実行用（テスト用）
 */
export async function GET(request: NextRequest) {
  // POST処理を実行
  return POST(request);
}
