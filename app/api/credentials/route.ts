/**
 * P0: 暗号化された認証情報管理API
 * GET /api/credentials - 全認証情報の取得
 * POST /api/credentials - 認証情報の追加/更新
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllMarketplaceCredentials,
  upsertMarketplaceCredential,
  checkCredentialsHealth,
  type MarketplaceId,
  type UpsertCredentialParams
} from '@/lib/security/encrypted-credentials';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    if (action === 'health') {
      // ヘルスチェック
      const health = await checkCredentialsHealth();

      return NextResponse.json({
        success: true,
        health
      });
    }

    // 全認証情報を取得（復号化済み、ただし一部フィールドはマスク）
    const credentials = await getAllMarketplaceCredentials();

    // セキュリティのため、一部の情報をマスクして返す
    const maskedCredentials = credentials.map(cred => ({
      id: cred.id,
      marketplace_id: cred.marketplace_id,
      marketplace_name: cred.marketplace_name,
      client_id: cred.client_id ? maskString(cred.client_id) : null,
      has_client_secret: !!cred.client_secret,
      has_access_token: !!cred.access_token,
      has_refresh_token: !!cred.refresh_token,
      has_api_key: !!cred.api_key,
      seller_id: cred.seller_id ? maskString(cred.seller_id) : null,
      token_expires_at: cred.token_expires_at,
      refresh_token_expires_at: cred.refresh_token_expires_at,
      is_active: cred.is_active,
      is_token_valid: cred.is_token_valid,
      last_token_refresh_at: cred.last_token_refresh_at,
      last_token_validation_at: cred.last_token_validation_at,
      created_at: cred.created_at,
      updated_at: cred.updated_at
    }));

    return NextResponse.json({
      success: true,
      credentials: maskedCredentials,
      total: maskedCredentials.length
    });

  } catch (error: any) {
    console.error('認証情報取得API エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラー', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    if (!body.marketplace_id || !body.marketplace_name) {
      return NextResponse.json(
        { error: 'marketplace_id と marketplace_name は必須です' },
        { status: 400 }
      );
    }

    const params: UpsertCredentialParams = {
      marketplace_id: body.marketplace_id as MarketplaceId,
      marketplace_name: body.marketplace_name,
      client_id: body.client_id,
      client_secret: body.client_secret,
      access_token: body.access_token,
      refresh_token: body.refresh_token,
      api_key: body.api_key,
      seller_id: body.seller_id,
      metadata: body.metadata,
      token_expires_at: body.token_expires_at ? new Date(body.token_expires_at) : undefined,
      refresh_token_expires_at: body.refresh_token_expires_at
        ? new Date(body.refresh_token_expires_at)
        : undefined
    };

    const credentialId = await upsertMarketplaceCredential(params);

    if (!credentialId) {
      return NextResponse.json(
        { error: '認証情報の保存に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '認証情報を保存しました',
      credential_id: credentialId
    });

  } catch (error: any) {
    console.error('認証情報保存API エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラー', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * 文字列の一部をマスクする
 */
function maskString(str: string): string {
  if (str.length <= 8) {
    return '****';
  }
  const visibleStart = Math.min(4, Math.floor(str.length * 0.2));
  const visibleEnd = Math.min(4, Math.floor(str.length * 0.2));
  const start = str.substring(0, visibleStart);
  const end = str.substring(str.length - visibleEnd);
  return `${start}${'*'.repeat(Math.min(10, str.length - visibleStart - visibleEnd))}${end}`;
}
