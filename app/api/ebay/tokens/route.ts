import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // ebay_tokensテーブルから全アカウントのトークン情報を取得
    const { data: tokens, error } = await supabase
      .from('ebay_tokens')
      .select('account, expires_at, updated_at, token_type')
      .order('account', { ascending: true });

    if (error) {
      console.error('❌ トークン取得エラー:', error);
      return NextResponse.json(
        { error: 'トークン情報の取得に失敗しました' },
        { status: 500 }
      );
    }

    // トークンの有効期限をチェック
    const tokensWithStatus = tokens?.map(token => {
      const expiresAt = new Date(token.expires_at);
      const now = new Date();
      const isExpired = expiresAt < now;
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      const hoursUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60 * 60));
      const minutesUntilExpiry = Math.floor((timeUntilExpiry % (1000 * 60 * 60)) / (1000 * 60));

      return {
        account: token.account,
        isAuthenticated: !isExpired,
        expiresAt: token.expires_at,
        updatedAt: token.updated_at,
        tokenType: token.token_type,
        status: isExpired ? 'expired' : 'active',
        timeUntilExpiry: isExpired ? null : `${hoursUntilExpiry}時間${minutesUntilExpiry}分`
      };
    }) || [];

    return NextResponse.json({ tokens: tokensWithStatus });
  } catch (error: any) {
    console.error('❌ API エラー:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
