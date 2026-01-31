// app/api/n8n-proxy/route.ts
/**
 * N3 n8n Proxy API
 * 
 * フロントエンドからn8n Webhookへのプロキシ
 * - セキュリティ: 直接Webhook URLを公開しない
 * - ロギング: すべてのワークフロー実行を記録
 * - レート制限: 過剰な実行を防止
 */

import { NextRequest, NextResponse } from 'next/server';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://160.16.120.186:5678';
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://160.16.120.186:5678/webhook';

// レート制限用（簡易実装）
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

interface N8nProxyRequest {
  endpoint: string;  // Webhook Path (例: '/webhook/listing-reserve')
  data: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as N8nProxyRequest;
    const { endpoint, data } = body;

    // バリデーション
    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: 'endpoint is required' },
        { status: 400 }
      );
    }

    // レート制限チェック（簡易版）
    const clientId = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const limit = rateLimitMap.get(clientId);
    
    if (limit) {
      if (now < limit.resetAt) {
        if (limit.count >= 100) {
          return NextResponse.json(
            { success: false, error: 'Rate limit exceeded. Try again later.' },
            { status: 429 }
          );
        }
        limit.count++;
      } else {
        rateLimitMap.set(clientId, { count: 1, resetAt: now + 60000 }); // 1分間
      }
    } else {
      rateLimitMap.set(clientId, { count: 1, resetAt: now + 60000 });
    }

    // n8n Webhook呼び出し
    const webhookUrl = `${N8N_WEBHOOK_URL}${endpoint}`;
    
    console.log('[n8n-proxy] Calling n8n webhook:', {
      url: webhookUrl,
      endpoint,
      dataKeys: Object.keys(data),
    });

    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // n8nからのレスポンスを取得
    const responseText = await n8nResponse.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    if (!n8nResponse.ok) {
      console.error('[n8n-proxy] n8n error:', {
        status: n8nResponse.status,
        statusText: n8nResponse.statusText,
        response: responseData,
      });

      return NextResponse.json(
        { 
          success: false, 
          error: `n8n error: ${n8nResponse.statusText}`,
          details: responseData,
        },
        { status: n8nResponse.status }
      );
    }

    console.log('[n8n-proxy] n8n success:', {
      endpoint,
      status: n8nResponse.status,
    });

    return NextResponse.json({
      success: true,
      data: responseData,
      message: responseData.message || 'Workflow executed successfully',
    });

  } catch (error) {
    console.error('[n8n-proxy] Proxy error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET: ヘルスチェック
export async function GET() {
  try {
    const healthUrl = `${N8N_BASE_URL}/healthz`;
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    const isHealthy = response.ok;

    return NextResponse.json({
      success: true,
      n8nStatus: isHealthy ? 'healthy' : 'unhealthy',
      n8nUrl: N8N_BASE_URL,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      n8nStatus: 'unreachable',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}
