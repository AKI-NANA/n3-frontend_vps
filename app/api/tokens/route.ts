/**
 * ==============================================================================
 * API Tokens Management Endpoint
 * ==============================================================================
 * トークン暗号化管理APIエンドポイント
 * ==============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTokenService, ExpiredTokenInfo } from '@/lib/services/token-encryption-service';

/**
 * GET /api/tokens
 * トークンのリストまたは期限切れチェック
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const mall = searchParams.get('mall');

    const tokenService = getTokenService();

    // 期限切れトークンチェック
    if (action === 'check-expired') {
      const expiredTokens = await tokenService.checkExpiredTokens();
      const critical = expiredTokens.filter((t: ExpiredTokenInfo) => t.days_until_expiry <= 1);
      const warning = expiredTokens.filter((t: ExpiredTokenInfo) => t.days_until_expiry > 1 && t.days_until_expiry <= 7);

      return NextResponse.json({
        success: true,
        data: {
          critical,
          warning,
          total: expiredTokens.length
        }
      });
    }

    // トークンリスト取得
    const tokens = await tokenService.listTokens(mall as any);

    return NextResponse.json({
      success: true,
      data: tokens
    });

  } catch (error: any) {
    console.error('[API] Token GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tokens
 * トークンを保存
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mall, account_name, token_type, token, expires_at, created_by } = body;

    // バリデーション
    if (!mall || !account_name || !token_type || !token) {
      return NextResponse.json(
        { success: false, error: 'mall, account_name, token_type, tokenは必須です' },
        { status: 400 }
      );
    }

    const tokenService = getTokenService();

    const expiresAtDate = expires_at ? new Date(expires_at) : null;

    const tokenId = await tokenService.saveToken(
      mall,
      account_name,
      token_type,
      token,
      expiresAtDate,
      created_by
    );

    return NextResponse.json({
      success: true,
      data: { token_id: tokenId }
    });

  } catch (error: any) {
    console.error('[API] Token POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tokens
 * トークンを無効化
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mall = searchParams.get('mall');
    const account_name = searchParams.get('account_name');
    const token_type = searchParams.get('token_type');

    // バリデーション
    if (!mall || !account_name || !token_type) {
      return NextResponse.json(
        { success: false, error: 'mall, account_name, token_typeは必須です' },
        { status: 400 }
      );
    }

    const tokenService = getTokenService();

    await tokenService.deactivateToken(mall as any, account_name, token_type as any);

    return NextResponse.json({
      success: true,
      message: 'トークンを無効化しました'
    });

  } catch (error: any) {
    console.error('[API] Token DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
