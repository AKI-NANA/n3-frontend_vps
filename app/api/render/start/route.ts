// app/api/render/start/route.ts
// N3 Empire OS - Render Start API
// Phase 2-3: UI → API → n8n → DB保存

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://160.16.120.186:5678/webhook';

export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    const body = await req.json();
    const { channel_id, content_id, options } = body;

    // バリデーション
    if (!channel_id) {
      return NextResponse.json(
        { success: false, error: 'channel_id is required' },
        { status: 400 }
      );
    }

    console.log('[RENDER_START]', {
      channel_id,
      content_id,
      options,
      timestamp: new Date().toISOString()
    });

    // render_id 生成
    const render_id = `RND-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    // ① render_queue に保存（pending状態）
    const { data: queueData, error: dbError } = await supabase
      .from('render_queue')
      .insert([{
        render_id,
        content_id: content_id || null,
        composition_id: options?.composition || 'ShortVideo',
        quality: options?.quality || 'preview',
        priority: options?.priority || 50,
        status: 'queued',
        queued_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (dbError) {
      console.error('[RENDER_START] DB Error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to save to render_queue', details: dbError.message },
        { status: 500 }
      );
    }

    console.log('[RENDER_START] Saved to DB:', queueData);

    // ② n8n Webhook に送信
    let n8nResponse = null;
    let n8nError = null;

    try {
      const webhookPayload = {
        render_id,
        channel_id,
        content_id,
        composition: options?.composition || 'ShortVideo',
        quality: options?.quality || 'preview',
        timestamp: new Date().toISOString(),
        source: 'empire_ui'
      };

      console.log('[RENDER_START] Sending to n8n:', webhookPayload);

      const n8nRes = await fetch(`${N8N_WEBHOOK_URL}/empire/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload),
        signal: AbortSignal.timeout(10000) // 10秒タイムアウト
      });

      if (n8nRes.ok) {
        n8nResponse = await n8nRes.json().catch(() => ({ status: 'received' }));
        console.log('[RENDER_START] n8n Response:', n8nResponse);
      } else {
        n8nError = `n8n returned ${n8nRes.status}`;
        console.warn('[RENDER_START] n8n Warning:', n8nError);
      }
    } catch (err: any) {
      n8nError = err.message || 'n8n connection failed';
      console.warn('[RENDER_START] n8n Error:', n8nError);
      // n8n接続失敗でもDB保存は成功しているので続行
    }

    const executionTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      render_id,
      queue_id: queueData?.id,
      status: 'queued',
      n8n_sent: !n8nError,
      n8n_error: n8nError,
      execution_time_ms: executionTime,
      message: n8nError 
        ? `Queued (n8n offline: ${n8nError})` 
        : 'Queued and sent to n8n'
    });

  } catch (error: any) {
    console.error('[RENDER_START] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: render_queue の状態確認
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const render_id = searchParams.get('render_id');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (render_id) {
      // 特定のrender_idを取得
      const { data, error } = await supabase
        .from('render_queue')
        .select('*')
        .eq('render_id', render_id)
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 404 });
      }
      return NextResponse.json({ success: true, render: data });
    }

    // 最新のキュー一覧
    const { data, error } = await supabase
      .from('render_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      queue: data
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
