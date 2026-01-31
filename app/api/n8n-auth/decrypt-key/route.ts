import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * n8n用APIキー復号API
 * 
 * 暗号化されたAPIキーを復号するための内部API
 * crypto依存をVercel側に集約し、n8nからはHTTPリクエストで復号を委譲
 * 
 * @endpoint POST /api/n8n-auth/decrypt-key
 */
export async function POST(req: NextRequest) {
  try {
    // サーバー間認証（n8nからの直接呼び出しのみ許可）
    const n8nSecret = req.headers.get('x-n8n-secret');
    const expectedSecret = process.env.N8N_INTERNAL_SECRET;

    if (!expectedSecret) {
      console.error('[n8n-auth/decrypt] N8N_INTERNAL_SECRET is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!n8nSecret || n8nSecret !== expectedSecret) {
      console.warn('[n8n-auth/decrypt] Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { encryptedValue, userId } = body;

    if (!encryptedValue) {
      return NextResponse.json(
        { error: 'Missing required parameter: encryptedValue' },
        { status: 400 }
      );
    }

    // 暗号化キー取得
    const encryptionKey = process.env.N3_ENCRYPTION_KEY;
    if (!encryptionKey) {
      console.error('[n8n-auth/decrypt] N3_ENCRYPTION_KEY is not configured');
      return NextResponse.json(
        { error: 'Server configuration error: N3_ENCRYPTION_KEY not set' },
        { status: 500 }
      );
    }

    // 暗号化されていない場合（':'を含まない）はそのまま返す
    if (!encryptedValue.includes(':')) {
      return NextResponse.json({ decrypted: encryptedValue });
    }

    // AES-256-CBC 復号
    try {
      const [ivHex, encrypted] = encryptedValue.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const key = Buffer.from(encryptionKey.padEnd(32, '0').slice(0, 32));
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      console.log(`[n8n-auth/decrypt] Successfully decrypted key for userId: ${userId || 'unknown'}`);
      return NextResponse.json({ decrypted });
    } catch (decryptError) {
      console.error('[n8n-auth/decrypt] Decryption failed:', decryptError);
      return NextResponse.json(
        { error: 'Decryption failed - invalid encrypted value format' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('[n8n-auth/decrypt] Request processing error:', error);
    return NextResponse.json(
      { error: 'Decryption request failed' },
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
    service: 'n8n-key-decryption',
    timestamp: new Date().toISOString()
  });
}
