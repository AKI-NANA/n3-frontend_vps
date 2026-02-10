import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * n8n内部トークン検証API
 * 
 * n8nワークフローからのリクエストを認証するための内部API
 * crypto依存をVercel側に集約し、n8nからはHTTPリクエストで検証を委譲
 * 
 * @endpoint POST /api/n8n-auth/verify-internal-token
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, timestamp, token } = body;

    // 必須パラメータチェック
    if (!userId || !timestamp || !token) {
      return NextResponse.json(
        { valid: false, error: 'Missing required parameters: userId, timestamp, token' },
        { status: 400 }
      );
    }

    // 環境変数チェック
    const secret = process.env.N8N_INTERNAL_SECRET;
    if (!secret) {
      console.error('[n8n-auth] N8N_INTERNAL_SECRET is not configured');
      return NextResponse.json(
        { valid: false, error: 'Server configuration error: N8N_INTERNAL_SECRET not set' },
        { status: 500 }
      );
    }

    // トークン再計算
    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${userId}-${timestamp}`)
      .digest('hex');

    // 有効期限チェック（5分 = 300000ms）
    const tokenAge = Date.now() - parseInt(timestamp, 10);
    const isExpired = tokenAge >= 300000;

    // トークン比較（タイミング攻撃対策）
    const isValidToken = crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from(expected)
    );

    const valid = isValidToken && !isExpired;

    if (!valid) {
      console.warn(`[n8n-auth] Token validation failed - userId: ${userId}, expired: ${isExpired}, age: ${tokenAge}ms`);
    }

    return NextResponse.json({ 
      valid,
      expired: isExpired,
      tokenAge: tokenAge
    });
  } catch (error) {
    console.error('[n8n-auth] Verification error:', error);
    return NextResponse.json(
      { valid: false, error: 'Token verification failed' },
      { status: 400 }
    );
  }
}

/**
 * ヘルスチェック用GET
 */
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    service: 'n8n-internal-token-verification',
    timestamp: new Date().toISOString()
  });
}
