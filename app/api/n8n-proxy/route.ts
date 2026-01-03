// app/api/n8n-proxy/route.ts
// n8n Webhookへのプロキシ（CORS回避用）

import { NextRequest, NextResponse } from 'next/server';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://160.16.120.186:5678';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, data } = body;

    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: 'endpoint is required' },
        { status: 400 }
      );
    }

    const webhookUrl = `${N8N_BASE_URL}/webhook/${endpoint}`;
    console.log(`[n8n-proxy] Forwarding to: ${webhookUrl}`);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data || {}),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[n8n-proxy] Error: ${response.status}`, errorText);
      return NextResponse.json(
        { success: false, error: `n8n error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log(`[n8n-proxy] Success:`, result);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[n8n-proxy] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // n8nのヘルスチェック
  try {
    const response = await fetch(`${N8N_BASE_URL}/healthz`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      n8nUrl: N8N_BASE_URL,
      message: response.ok ? 'n8n is healthy' : 'n8n is not responding',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Connection failed',
      n8nUrl: N8N_BASE_URL,
    });
  }
}
