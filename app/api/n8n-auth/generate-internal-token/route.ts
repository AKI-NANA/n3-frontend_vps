import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * n8n内部トークン生成API
 * 
 * n8nワークフロー間通信用の内部トークンを生成
 * サーバー間認証が必要
 * 
 * @endpoint POST /api/n8n-auth/generate-internal-token
 */
export async function POST(req: NextRequest) {
  try {
    // サーバー間認証（n8nからの直接呼び出しのみ許可）
    const n8nSecret = req.headers.get('x-n8n-secret');
    const expectedSecret = process.env.N8N_INTERNAL_SECRET;

    if (!expectedSecret) {
      console.error('[n8n-auth/generate] N8N_INTERNAL_SECRET is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!n8nSecret || n8nSecret !== expectedSecret) {
      console.warn('[n8n-auth/generate] Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userId, timestamp } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }

    const ts = timestamp || Date.now();
    
    // トークン生成
    const token = crypto
      .createHmac('sha256', expectedSecret)
      .update(`${userId}-${ts}`)
      .digest('hex');

    console.log(`[n8n-auth/generate] Generated token for userId: ${userId}`);
    
    return NextResponse.json({ 
      token,
      timestamp: ts,
      userId,
      expiresAt: ts + 300000 // 5分後
    });
  } catch (error) {
    console.error('[n8n-auth/generate] Token generation error:', error);
    return NextResponse.json(
      { error: 'Token generation failed' },
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
    service: 'n8n-internal-token-generation',
    timestamp: new Date().toISOString()
  });
}
