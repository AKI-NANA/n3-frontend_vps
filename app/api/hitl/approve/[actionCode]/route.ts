// app/api/hitl/approve/[actionCode]/route.ts
// N3 Empire OS V8 Phase 2 - HitL 承認エンドポイント

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
  
  // 承認処理
  const result = await processDecision(actionCode, 'approved', 'web_link');
  
  if (!result.success) {
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>エラー - N3 Empire OS</title>
  <style>
    body { font-family: -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #fef2f2; }
    .container { text-align: center; padding: 40px; background: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .icon { font-size: 64px; margin-bottom: 20px; }
    h1 { color: #dc2626; margin: 0 0 10px; }
    p { color: #6b7280; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">❌</div>
    <h1>エラー</h1>
    <p>${result.error || '処理に失敗しました'}</p>
  </div>
</body>
</html>`,
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
  
  // HTMLレスポンス（ブラウザで開いた場合）
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>承認完了 - N3 Empire OS</title>
  <style>
    body { font-family: -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f0fdf4; }
    .container { text-align: center; padding: 40px; background: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .icon { font-size: 64px; margin-bottom: 20px; }
    h1 { color: #059669; margin: 0 0 10px; }
    p { color: #6b7280; margin: 0; }
    .code { font-family: monospace; background: #f3f4f6; padding: 4px 8px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">✅</div>
    <h1>承認完了</h1>
    <p>アクション <span class="code">${actionCode}</span> を承認しました。</p>
    <p style="margin-top: 16px; font-size: 14px;">このウィンドウは閉じて構いません。</p>
  </div>
</body>
</html>`,
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
    const decidedBy = body.decided_by || 'api';
    const reason = body.reason;
    
    const result = await processDecision(actionCode, 'approved', decidedBy, reason);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}

async function processDecision(
  actionCode: string,
  decision: 'approved' | 'rejected',
  decidedBy: string,
  reason?: string
): Promise<{ success: boolean; action_id?: string; error?: string; callback_triggered?: boolean }> {
  // まずpublicスキーマで検索
  let { data: action, error } = await supabase
    .from('user_actions')
    .select('*')
    .eq('action_code', actionCode)
    .single();
  
  // publicになければcoreスキーマを試行
  if (error || !action) {
    const coreResult = await supabase.rpc('process_action_decision', {
      p_action_code: actionCode,
      p_decision: decision,
      p_decided_by: decidedBy,
      p_reason: reason || null,
    });
    
    if (coreResult.data) {
      return coreResult.data as any;
    }
    
    return { success: false, error: 'Action not found' };
  }
  
  // ステータスチェック
  if (action.status !== 'pending') {
    return { success: false, error: `Action is not pending (current: ${action.status})` };
  }
  
  if (new Date(action.expires_at) < new Date()) {
    await supabase.from('user_actions').update({ status: 'expired' }).eq('id', action.id);
    return { success: false, error: 'Action has expired' };
  }
  
  // 更新
  const { error: updateError } = await supabase
    .from('user_actions')
    .update({
      status: decision,
      decided_at: new Date().toISOString(),
      decided_by: decidedBy,
      decision: decision,
      decision_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', action.id);
  
  if (updateError) {
    return { success: false, error: updateError.message };
  }
  
  // コールバック実行
  let callbackTriggered = false;
  if (decision === 'approved' && action.callback_url) {
    try {
      await fetch(action.callback_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_code: action.action_code,
          action_id: action.id,
          status: 'approved',
          decided_by: decidedBy,
          workflow_id: action.workflow_id,
          execution_id: action.execution_id,
        }),
      });
      callbackTriggered = true;
    } catch (e) {
      console.error('Callback failed:', e);
    }
  }
  
  return { success: true, action_id: action.id, callback_triggered: callbackTriggered };
}
