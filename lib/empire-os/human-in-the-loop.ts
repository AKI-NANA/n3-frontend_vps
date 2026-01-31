// lib/empire-os/human-in-the-loop.ts
// 🛡️ N3 Empire OS V8 Phase 2 - Human-in-the-Loop (HitL)
// n8n Wait連携による承認キューシステム

// ========================================
// 型定義
// ========================================

export type ActionStatus = 
  | 'pending'    // 承認待ち
  | 'approved'   // 承認済み
  | 'rejected'   // 拒否
  | 'expired'    // 期限切れ
  | 'cancelled'; // キャンセル

export type ActionType =
  | 'publish_listing'    // 出品公開
  | 'send_message'       // メッセージ送信
  | 'execute_trade'      // 取引実行
  | 'delete_data'        // データ削除
  | 'api_request'        // 外部API呼び出し
  | 'content_publish'    // コンテンツ公開
  | 'bulk_operation'     // 一括操作
  | 'price_change'       // 価格変更
  | 'inventory_update'   // 在庫更新
  | 'custom';            // カスタム

export interface PendingAction {
  id: string;
  action_code: string;
  tenant_id: string;
  action_type: ActionType;
  
  // 対象情報
  target: {
    type: string;
    id: string;
    title: string;
    preview?: string;
  };
  
  // リクエスト情報
  request: {
    reason: string;
    context: Record<string, any>;
    requested_at: string;
    requested_by: string;
    workflow_id?: string;
    execution_id?: string;
  };
  
  // 期限
  expires_at: string;
  
  // 承認結果（決定後に設定）
  decision?: {
    status: ActionStatus;
    decided_at: string;
    decided_by: string;
    reason?: string;
  };
  
  // コールバック
  callback_url?: string;
  notification_channels: string[];
}

export interface ApprovalRequest {
  tenant_id: string;
  action_type: ActionType;
  target_type: string;
  target_id: string;
  target_title: string;
  target_preview?: string;
  request_reason: string;
  request_context?: Record<string, any>;
  workflow_id?: string;
  execution_id?: string;
  callback_url?: string;
  expires_in_minutes?: number;
  notification_channels?: string[];
}

export interface ApprovalResponse {
  success: boolean;
  action_id: string;
  action_code: string;
  expires_at: string;
  wait_url?: string;
  error?: string;
}

export interface DecisionRequest {
  action_code: string;
  decision: 'approved' | 'rejected';
  decided_by: string;
  reason?: string;
}

export interface DecisionResponse {
  success: boolean;
  action_id?: string;
  decision?: string;
  callback_triggered?: boolean;
  error?: string;
}

// ========================================
// アクションコード生成
// ========================================

/**
 * ユニークなアクションコードを生成
 */
export function generateActionCode(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `ACT_${timestamp}_${random}`.toUpperCase();
}

/**
 * アクションコードの検証
 */
export function isValidActionCode(code: string): boolean {
  return /^ACT_[A-Z0-9]+_[A-Z0-9]+$/i.test(code);
}

// ========================================
// 承認リクエスト作成
// ========================================

/**
 * 承認リクエストをDBに登録（サーバーサイド用）
 */
export async function createApprovalRequest(
  request: ApprovalRequest,
  supabase: any
): Promise<ApprovalResponse> {
  const actionCode = generateActionCode();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + (request.expires_in_minutes || 60));
  
  const insertData = {
    action_code: actionCode,
    tenant_id: request.tenant_id,
    action_type: request.action_type,
    target_type: request.target_type,
    target_id: request.target_id,
    target_title: request.target_title,
    target_preview: request.target_preview,
    status: 'pending',
    request_reason: request.request_reason,
    request_context: request.request_context || {},
    workflow_id: request.workflow_id,
    execution_id: request.execution_id,
    callback_url: request.callback_url,
    expires_at: expiresAt.toISOString(),
    notification_channels: request.notification_channels || ['chatwork', 'email'],
  };
  
  const { data, error } = await supabase
    .from('core.user_actions')
    .insert(insertData)
    .select('id, action_code, expires_at')
    .single();
  
  if (error) {
    console.error('Failed to create approval request:', error);
    return { success: false, action_id: '', action_code: '', expires_at: '', error: error.message };
  }
  
  return {
    success: true,
    action_id: data.id,
    action_code: data.action_code,
    expires_at: data.expires_at,
    wait_url: `/api/hitl/wait/${data.action_code}`,
  };
}

/**
 * 承認/拒否処理（サーバーサイド用）
 */
export async function processDecision(
  request: DecisionRequest,
  supabase: any
): Promise<DecisionResponse> {
  // アクション取得
  const { data: action, error: fetchError } = await supabase
    .from('core.user_actions')
    .select('*')
    .eq('action_code', request.action_code)
    .single();
  
  if (fetchError || !action) {
    return { success: false, error: 'Action not found' };
  }
  
  if (action.status !== 'pending') {
    return { success: false, error: `Action is not pending (current: ${action.status})` };
  }
  
  if (new Date(action.expires_at) < new Date()) {
    // 期限切れの場合は自動で期限切れに更新
    await supabase
      .from('core.user_actions')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('id', action.id);
    return { success: false, error: 'Action has expired' };
  }
  
  // ステータス更新
  const { error: updateError } = await supabase
    .from('core.user_actions')
    .update({
      status: request.decision === 'approved' ? 'approved' : 'rejected',
      decided_at: new Date().toISOString(),
      decided_by: request.decided_by,
      decision: request.decision,
      decision_reason: request.reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', action.id);
  
  if (updateError) {
    return { success: false, error: updateError.message };
  }
  
  // コールバック実行（承認の場合のみ）
  let callbackTriggered = false;
  if (request.decision === 'approved' && action.callback_url) {
    try {
      await fetch(action.callback_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_code: action.action_code,
          action_id: action.id,
          status: 'approved',
          decided_by: request.decided_by,
          workflow_id: action.workflow_id,
          execution_id: action.execution_id,
        }),
      });
      callbackTriggered = true;
    } catch (callbackError) {
      console.error('Callback failed:', callbackError);
    }
  }
  
  return {
    success: true,
    action_id: action.id,
    decision: request.decision,
    callback_triggered: callbackTriggered,
  };
}

/**
 * 承認待ちアクションを取得
 */
export async function getPendingActions(
  tenantId: string,
  supabase: any,
  options?: { action_type?: ActionType; limit?: number }
): Promise<PendingAction[]> {
  let query = supabase
    .from('core.user_actions')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .order('requested_at', { ascending: false });
  
  if (options?.action_type) {
    query = query.eq('action_type', options.action_type);
  }
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Failed to get pending actions:', error);
    return [];
  }
  
  return data.map((row: any) => ({
    id: row.id,
    action_code: row.action_code,
    tenant_id: row.tenant_id,
    action_type: row.action_type,
    target: {
      type: row.target_type,
      id: row.target_id,
      title: row.target_title,
      preview: row.target_preview,
    },
    request: {
      reason: row.request_reason,
      context: row.request_context,
      requested_at: row.requested_at,
      requested_by: row.requested_by,
      workflow_id: row.workflow_id,
      execution_id: row.execution_id,
    },
    expires_at: row.expires_at,
    callback_url: row.callback_url,
    notification_channels: row.notification_channels,
  }));
}

/**
 * 期限切れアクションを処理
 */
export async function expirePendingActions(supabase: any): Promise<number> {
  const { data, error } = await supabase.rpc('expire_pending_actions');
  
  if (error) {
    console.error('Failed to expire pending actions:', error);
    return 0;
  }
  
  return data || 0;
}

// ========================================
// 通知送信
// ========================================

export interface NotificationPayload {
  action: PendingAction;
  approval_url: string;
  rejection_url: string;
}

/**
 * ChatWork通知を送信
 */
export async function sendChatWorkNotification(
  payload: NotificationPayload,
  chatworkConfig: { api_key: string; room_id: string }
): Promise<boolean> {
  const message = `[info][title]🔔 承認リクエスト[/title]
種別: ${payload.action.action_type}
対象: ${payload.action.target.title}
理由: ${payload.action.request.reason}
期限: ${new Date(payload.action.expires_at).toLocaleString('ja-JP')}

[承認] ${payload.approval_url}
[拒否] ${payload.rejection_url}
[/info]`;
  
  try {
    const response = await fetch(`https://api.chatwork.com/v2/rooms/${chatworkConfig.room_id}/messages`, {
      method: 'POST',
      headers: {
        'X-ChatWorkToken': chatworkConfig.api_key,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ body: message }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('ChatWork notification failed:', error);
    return false;
  }
}

// ========================================
// n8n用テンプレート: 承認リクエスト作成
// ========================================

export const N8N_CREATE_APPROVAL_TEMPLATE = `
// ========================================
// N3 Empire OS V8 - 承認リクエスト作成ノード
// Policy Violationまたは高リスク操作の前に配置
// ========================================

const tenantId = $json.tenant_context?.tenant_id || $env.DEFAULT_TENANT_ID || '0';
const actionType = $json.action_type || 'custom';
const targetType = $json.target_type || 'unknown';
const targetId = $json.target_id || $json.id || 'unknown';
const targetTitle = $json.target_title || $json.title || 'Unknown';
const requestReason = $json.request_reason || 'Manual approval required';
const expiresInMinutes = $json.expires_in_minutes || 60;

// コールバックURL（n8n Webhook Resume URL）
// n8n Waitノードを使用する場合は、Wait URLを設定
const callbackUrl = $json.callback_url || ($env.N8N_BASE_URL + '/webhook-waiting/' + $workflow.id);

// アクションコード生成
const timestamp = Date.now().toString(36).toUpperCase();
const random = Math.random().toString(36).substring(2, 10).toUpperCase();
const actionCode = 'ACT_' + timestamp + '_' + random;

// 期限計算
const expiresAt = new Date();
expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

// DBに登録
const insertResponse = await $http.request({
  method: 'POST',
  url: $env.SUPABASE_URL + '/rest/v1/core.user_actions',
  headers: {
    'apikey': $env.SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: {
    action_code: actionCode,
    tenant_id: tenantId,
    action_type: actionType,
    target_type: targetType,
    target_id: targetId,
    target_title: targetTitle,
    target_preview: ($json.description || $json.content || '').substring(0, 500),
    status: 'pending',
    request_reason: requestReason,
    request_context: $json.request_context || {},
    workflow_id: $workflow.id,
    execution_id: $execution.id,
    callback_url: callbackUrl,
    expires_at: expiresAt.toISOString(),
    notification_channels: ['chatwork', 'email']
  },
  json: true
});

if (!insertResponse || insertResponse.length === 0) {
  throw new Error('承認リクエストの作成に失敗しました');
}

const createdAction = insertResponse[0];

// 承認URL構築
const baseUrl = $env.N3_APP_URL || 'https://n3-app.example.com';
const approvalUrl = baseUrl + '/api/hitl/approve/' + actionCode;
const rejectionUrl = baseUrl + '/api/hitl/reject/' + actionCode;

// ChatWork通知
if ($env.CHATWORK_API_KEY && $env.CHATWORK_ROOM_ID) {
  const message = '[info][title]🔔 承認リクエスト[/title]' +
    '種別: ' + actionType + '\\n' +
    '対象: ' + targetTitle + '\\n' +
    '理由: ' + requestReason + '\\n' +
    '期限: ' + expiresAt.toLocaleString('ja-JP') + '\\n\\n' +
    '[承認] ' + approvalUrl + '\\n' +
    '[拒否] ' + rejectionUrl + '[/info]';
  
  await $http.request({
    method: 'POST',
    url: 'https://api.chatwork.com/v2/rooms/' + $env.CHATWORK_ROOM_ID + '/messages',
    headers: {
      'X-ChatWorkToken': $env.CHATWORK_API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'body=' + encodeURIComponent(message)
  }).catch(() => {});
}

return [{
  json: {
    ...($input.first().json),
    hitl_request: {
      action_id: createdAction.id,
      action_code: actionCode,
      status: 'pending',
      expires_at: expiresAt.toISOString(),
      approval_url: approvalUrl,
      rejection_url: rejectionUrl,
      callback_url: callbackUrl
    }
  }
}];
`;

// ========================================
// n8n用テンプレート: 承認待ち（Wait）
// ========================================

export const N8N_WAIT_FOR_APPROVAL_TEMPLATE = `
// ========================================
// N3 Empire OS V8 - 承認待ちノード
// 承認リクエスト作成後に配置
// Waitノードとセットで使用
// ========================================

// このノードの後にn8nの「Wait」ノードを配置
// Wait設定:
//   - Resume: On webhook call
//   - Webhook URL: 自動生成されるURLを使用
//   - Timeout: $json.hitl_request.expires_at までの秒数

const hitlRequest = $json.hitl_request;

if (!hitlRequest || !hitlRequest.action_code) {
  throw new Error('承認リクエスト情報がありません');
}

// 期限までの秒数を計算
const expiresAt = new Date(hitlRequest.expires_at);
const now = new Date();
const timeoutSeconds = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));

// Wait用データを準備
return [{
  json: {
    ...($input.first().json),
    _wait_config: {
      timeout_seconds: timeoutSeconds,
      webhook_id: hitlRequest.action_code,
      on_timeout: 'reject' // タイムアウト時は自動拒否
    }
  }
}];
`;

// ========================================
// n8n用テンプレート: 承認結果処理
// ========================================

export const N8N_PROCESS_APPROVAL_RESULT_TEMPLATE = `
// ========================================
// N3 Empire OS V8 - 承認結果処理ノード
// Waitノードの後に配置
// ========================================

// Waitノードからの再開データを取得
const resumeData = $input.first().json;

// タイムアウトかどうかチェック
const isTimeout = resumeData._timeout || false;
const hitlRequest = resumeData.hitl_request || {};
const actionCode = hitlRequest.action_code;

if (isTimeout) {
  // タイムアウト → 自動で期限切れに更新
  if (actionCode) {
    await $http.request({
      method: 'PATCH',
      url: $env.SUPABASE_URL + '/rest/v1/core.user_actions?action_code=eq.' + actionCode,
      headers: {
        'apikey': $env.SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json'
      },
      body: { status: 'expired', updated_at: new Date().toISOString() },
      json: true
    }).catch(() => {});
  }
  
  return [{
    json: {
      ...resumeData,
      hitl_result: {
        status: 'expired',
        approved: false,
        reason: 'Approval request timed out'
      }
    }
  }];
}

// Webhook経由の再開の場合
const webhookData = resumeData._webhook_data || {};
const status = webhookData.status || 'unknown';
const approved = status === 'approved';

// 結果を出力
return [{
  json: {
    ...resumeData,
    hitl_result: {
      status: status,
      approved: approved,
      decided_by: webhookData.decided_by,
      reason: webhookData.reason
    }
  }
}];
`;

// ========================================
// n8n用テンプレート: 承認結果による分岐
// ========================================

export const N8N_APPROVAL_BRANCH_TEMPLATE = `
// ========================================
// N3 Empire OS V8 - 承認分岐ノード
// 承認結果処理後に配置
// Switch/IF ノードの代わりに使用
// ========================================

const hitlResult = $json.hitl_result || {};
const approved = hitlResult.approved === true;
const status = hitlResult.status || 'unknown';

// 出力を2つのブランチに分岐
// 出力0: 承認時の処理へ
// 出力1: 拒否/期限切れ時の処理へ

if (approved) {
  // 承認 → 出力0へ
  $node.setOutput(0);
  return [{
    json: {
      ...($input.first().json),
      _branch: 'approved',
      _continue_execution: true
    }
  }];
} else {
  // 拒否/期限切れ → 出力1へ
  $node.setOutput(1);
  return [{
    json: {
      ...($input.first().json),
      _branch: 'rejected',
      _continue_execution: false,
      _rejection_reason: hitlResult.reason || 'Approval was denied or expired'
    }
  }];
}
`;

// ========================================
// エクスポート
// ========================================

export default {
  // アクションコード
  generateActionCode,
  isValidActionCode,
  
  // 承認処理
  createApprovalRequest,
  processDecision,
  getPendingActions,
  expirePendingActions,
  
  // 通知
  sendChatWorkNotification,
  
  // n8nテンプレート
  N8N_CREATE_APPROVAL_TEMPLATE,
  N8N_WAIT_FOR_APPROVAL_TEMPLATE,
  N8N_PROCESS_APPROVAL_RESULT_TEMPLATE,
  N8N_APPROVAL_BRANCH_TEMPLATE,
};
