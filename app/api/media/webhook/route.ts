// app/api/media/webhook/route.ts
/**
 * メディアWebhook API
 * UIからn8nへのHMAC署名付きプロキシ
 * 27次元セキュリティ準拠
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const N8N_BASE_URL = process.env.N8N_BASE_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://160.16.120.186:5678';
const N8N_WEBHOOK_BASE = `${N8N_BASE_URL}/webhook`;
const HMAC_SECRET = process.env.N8N_HMAC_SECRET || process.env.N3_HMAC_SECRET || '';

function generateHmacSignature(body: string, timestamp: string): string {
  if (!HMAC_SECRET) return '';
  const message = `${timestamp}.${body}`;
  return crypto.createHmac('sha256', HMAC_SECRET).update(message).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { endpoint, data, jobId, timestamp } = await request.json();

    if (!endpoint) {
      return NextResponse.json({ success: false, error: 'endpoint is required' }, { status: 400 });
    }

    const url = `${N8N_WEBHOOK_BASE}/${endpoint}`;
    const payload = {
      job_id: jobId || `MEDIA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...data,
    };

    const bodyString = JSON.stringify(payload);
    const ts = timestamp || Date.now().toString();
    const signature = generateHmacSignature(bodyString, ts);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Job-Id': payload.job_id,
      'X-N3-Timestamp': ts,
    };

    if (signature) {
      headers['X-N3-Signature'] = signature;
    }

    console.log(`[MediaWebhook] POST ${url}`, { jobId: payload.job_id });

    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: bodyString,
      signal: AbortSignal.timeout(120000), // 2分タイムアウト
    });

    const executionTime = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MediaWebhook] Error: ${response.status}`, errorText);
      return NextResponse.json({
        success: false,
        jobId: payload.job_id,
        error: `n8n error: ${response.status} - ${errorText}`,
        executionTime,
      });
    }

    const result = await response.json();
    console.log(`[MediaWebhook] Success:`, { jobId: payload.job_id, executionTime });

    return NextResponse.json({
      success: result.success !== false,
      jobId: result.job_id || payload.job_id,
      data: result,
      message: result.message || 'Request completed',
      executionTime,
    });
  } catch (error) {
    console.error('[MediaWebhook] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

// ヘルスチェック
export async function GET() {
  try {
    const response = await fetch(`${N8N_BASE_URL}/healthz`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    
    return NextResponse.json({
      success: response.ok,
      n8nUrl: N8N_BASE_URL,
      hmacEnabled: !!HMAC_SECRET,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      n8nUrl: N8N_BASE_URL,
      hmacEnabled: !!HMAC_SECRET,
      error: error instanceof Error ? error.message : 'Connection failed',
    });
  }
}
