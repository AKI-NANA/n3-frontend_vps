// app/api/hitl/reject/[actionCode]/route.ts
// N3 Empire OS V8 Phase 2 - HitL 拒否エンドポイント

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ actionCode: string }> }
) {
  const { actionCode } = await params;
  const result = await processDecision(actionCode, 'rejected', 'web_link');
  
  if (!result.success) {
    return new NextResponse(
      `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>エラー</title>
      <style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#fef2f2}
      .c{text-align:center;padding:40px;background:white;border-radius:16px;box-shadow:0 4px 6px rgba(0,0,0,0.1)}
      h1{color:#dc2626}</style></head><body><div class="c"><h1>❌ エラー</h1><p>${result.error}</p></div></body></html>`,
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
  
  return new NextResponse(
    `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>拒否完了</title>
    <style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#fef2f2}
    .c{text-align:center;padding:40px;background:white;border-radius:16px;box-shadow:0 4px 6px rgba(0,0,0,0.1)}
    h1{color:#dc2626}.code{font-family:monospace;background:#f3f4f6;padding:4px 8px;border-radius:4px}</style></head>
    <body><div class="c"><h1>🚫 拒否完了</h1><p>アクション <span class="code">${actionCode}</span> を拒否しました。</p>
    <p style="margin-top:16px;font-size:14px;color:#6b7280">このウィンドウは閉じて構いません。</p></div></body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ actionCode: string }> }
) {
  const { actionCode } = await params;
  try {
    const body = await request.json();
    const result = await processDecision(actionCode, 'rejected', body.decided_by || 'api', body.reason);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}

async function processDecision(
  actionCode: string,
  decision: 'approved' | 'rejected',
  decidedBy: string,
  reason?: string
): Promise<{ success: boolean; action_id?: string; error?: string }> {
  // publicスキーマで検索
  let { data: action, error } = await supabase
    .from('user_actions')
    .select('*')
    .eq('action_code', actionCode)
    .single();
  
  // なければRPC経由でcoreスキーマを試行
  if (error || !action) {
    const rpcResult = await supabase.rpc('process_action_decision', {
      p_action_code: actionCode,
      p_decision: decision,
      p_decided_by: decidedBy,
      p_reason: reason || null,
    });
    if (rpcResult.data) return rpcResult.data as any;
    return { success: false, error: 'Action not found' };
  }
  
  if (action.status !== 'pending') {
    return { success: false, error: `Action is not pending (current: ${action.status})` };
  }
  
  if (new Date(action.expires_at) < new Date()) {
    await supabase.from('user_actions').update({ status: 'expired' }).eq('id', action.id);
    return { success: false, error: 'Action has expired' };
  }
  
  const { error: updateError } = await supabase
    .from('user_actions')
    .update({
      status: decision,
      decided_at: new Date().toISOString(),
      decided_by: decidedBy,
      decision,
      decision_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', action.id);
  
  if (updateError) return { success: false, error: updateError.message };
  
  return { success: true, action_id: action.id };
}
