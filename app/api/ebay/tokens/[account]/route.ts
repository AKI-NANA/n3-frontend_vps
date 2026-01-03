import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { account: string } }
) {
  try {
    const { account } = params;

    const supabase = await createClient();

    // 特定アカウントのトークン情報を取得
    const { data: token, error } = await supabase
      .from('ebay_tokens')
      .select('*')
      .eq('account', account)
      .single();

    if (error) {
      console.error(`❌ ${account} のトークン取得エラー:`, error);
      return NextResponse.json(
        { error: 'トークン情報が見つかりません' },
        { status: 404 }
      );
    }

    // トークンの有効期限をチェック
    const expiresAt = new Date(token.expires_at);
    const now = new Date();
    const isExpired = expiresAt < now;
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    const hoursUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60 * 60));
    const minutesUntilExpiry = Math.floor((timeUntilExpiry % (1000 * 60 * 60)) / (1000 * 60));

    return NextResponse.json({
      account: token.account,
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: token.expires_at,
      updatedAt: token.updated_at,
      tokenType: token.token_type,
      isExpired,
      status: isExpired ? 'expired' : 'active',
      timeUntilExpiry: isExpired ? null : `${hoursUntilExpiry}時間${minutesUntilExpiry}分`
    });
  } catch (error: any) {
    console.error('❌ API エラー:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
