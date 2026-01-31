// lib/n8n/workflows/v8-unsinkable-template.ts
// ========================================
// 🏰 N3 Empire OS V8 - 不沈艦ワークフローテンプレート
// Phase 3: 152個のワークフロー標準化基盤
// ========================================

// ========================================
// 【パン（上）】Auth-Gate & Identity-Manager
// ワークフロー開始時に必ず配置
// ========================================

export const V8_HEADER_AUTH_GATE = `
// ========================================
// N3 Empire OS V8 - Auth-Gate ノード
// 【STEP 1】Webhook直後に配置
// ========================================

const body = $input.first().json.body || $input.first().json || {};
const headers = $input.first().json.headers || {};

// テナントID取得
const tenant_id = body.tenant_context?.tenant_id || body.tenant_id || headers['x-tenant-id'] || $env.DEFAULT_TENANT_ID || '0';
const is_owner = tenant_id === '0';

// プラン情報取得（本番はDBから）
const planResponse = await $http.request({
  method: 'GET',
  url: $env.SUPABASE_URL + '/rest/v1/core.tenants',
  qs: { id: 'eq.' + tenant_id, select: 'id,plan_code,plan_config,is_active,quota_usage' },
  headers: {
    'apikey': $env.SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY
  },
  json: true
}).catch(() => []);

const tenant = (planResponse && planResponse[0]) || null;

// テナント検証
if (!is_owner && (!tenant || !tenant.is_active)) {
  return [{
    json: {
      success: false,
      error: { code: 'TENANT_INACTIVE', message: 'テナントが無効です' },
      _terminate: true
    }
  }];
}

// プラン設定
const DEFAULT_PLANS = {
  free: { tier: 0, daily_api_calls: 50, daily_listings: 5, features: [] },
  basic: { tier: 1, daily_api_calls: 500, daily_listings: 50, features: ['research'] },
  pro: { tier: 2, daily_api_calls: 5000, daily_listings: 500, features: ['research', 'ai', 'automation'] },
  empire: { tier: 3, daily_api_calls: 50000, daily_listings: 5000, features: ['*'] },
  owner: { tier: 99, daily_api_calls: -1, daily_listings: -1, features: ['*'] }
};

const plan_code = is_owner ? 'owner' : (tenant?.plan_code || 'free');
const plan_config = tenant?.plan_config || DEFAULT_PLANS[plan_code] || DEFAULT_PLANS.free;

// クォータチェック
const feature_code = body.feature_code || 'api_call';
const quota_key = 'daily_' + feature_code.replace('.', '_');
const quota_limit = plan_config[quota_key] || plan_config.daily_api_calls || 0;
const quota_used = tenant?.quota_usage?.[quota_key] || 0;
const quota_remaining = quota_limit < 0 ? -1 : Math.max(0, quota_limit - quota_used);

if (quota_limit >= 0 && quota_remaining <= 0) {
  return [{
    json: {
      success: false,
      error: {
        code: 'QUOTA_EXCEEDED',
        message: '本日のクォータ上限に達しました',
        quota: { limit: quota_limit, used: quota_used, remaining: 0 }
      },
      _terminate: true
    }
  }];
}

// クォータ使用記録（非同期）
if (!is_owner && quota_limit >= 0) {
  $http.request({
    method: 'PATCH',
    url: $env.SUPABASE_URL + '/rest/v1/core.tenants?id=eq.' + tenant_id,
    headers: {
      'apikey': $env.SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY,
      'Content-Type': 'application/json'
    },
    body: {
      quota_usage: { ...tenant?.quota_usage, [quota_key]: quota_used + 1 }
    }
  }).catch(() => {});
}

// Auth Context構築
const auth_context = {
  tenant_id,
  is_owner,
  plan_code,
  plan_config,
  tier_level: plan_config.tier || 0,
  features: plan_config.features || [],
  quota: { limit: quota_limit, used: quota_used + 1, remaining: quota_remaining - 1 },
  authenticated_at: new Date().toISOString()
};

return [{
  json: {
    ...body,
    auth_context,
    _workflow_id: $workflow.id,
    _execution_id: $execution.id,
    _started_at: new Date().toISOString()
  }
}];
`;

export const V8_HEADER_IDENTITY_MANAGER = `
// ========================================
// N3 Empire OS V8 - Identity-Manager ノード
// 【STEP 2】Auth-Gate直後に配置
// 外部API呼び出し時のプロキシ・指紋を設定
// ========================================

const auth_context = $json.auth_context;
const tenant_id = auth_context?.tenant_id || '0';
const target_platform = $json.platform || $json.target_platform || 'default';

// プロファイル取得
const profileResponse = await $http.request({
  method: 'GET',
  url: $env.SUPABASE_URL + '/rest/v1/core.browser_profiles',
  qs: {
    tenant_id: 'eq.' + tenant_id,
    target_platform: 'eq.' + target_platform,
    is_active: 'eq.true',
    health_status: 'in.(healthy,degraded)',
    select: '*',
    order: 'usage_stats->>total_requests.asc',
    limit: 1
  },
  headers: {
    'apikey': $env.SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY
  },
  json: true
}).catch(() => []);

const profile = (profileResponse && profileResponse[0]) || null;

// Identity Context構築
let identity_context = {
  profile_id: null,
  proxy: null,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7'
  },
  fingerprint: null
};

if (profile) {
  const proxyConfig = profile.proxy_config || {};
  const fpConfig = profile.fingerprint_config || {};
  
  // プロキシ設定
  if (proxyConfig.host && proxyConfig.port) {
    // パスワードはSecret Vault経由で復号（別ノードで処理）
    identity_context.proxy = {
      host: proxyConfig.host,
      port: proxyConfig.port,
      username: proxyConfig.username,
      protocol: proxyConfig.type === 'residential' ? 'http' : 'socks5'
    };
  }
  
  // ヘッダー設定
  identity_context.headers = {
    'User-Agent': fpConfig.user_agent || identity_context.headers['User-Agent'],
    'Accept-Language': fpConfig.accept_language || identity_context.headers['Accept-Language'],
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br'
  };
  
  identity_context.profile_id = profile.id;
  identity_context.fingerprint = {
    canvas_noise: fpConfig.canvas_noise || 0.0001,
    audio_noise: fpConfig.audio_noise || 0.0001,
    timezone: fpConfig.timezone || 'Asia/Tokyo',
    screen_resolution: fpConfig.screen_resolution || '1920x1080'
  };
  
  // 使用回数更新（非同期）
  const stats = profile.usage_stats || {};
  $http.request({
    method: 'PATCH',
    url: $env.SUPABASE_URL + '/rest/v1/core.browser_profiles?id=eq.' + profile.id,
    headers: {
      'apikey': $env.SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY,
      'Content-Type': 'application/json'
    },
    body: {
      usage_stats: { ...stats, total_requests: (stats.total_requests || 0) + 1 }
    }
  }).catch(() => {});
}

return [{
  json: {
    ...($input.first().json),
    identity_context
  }
}];
`;

// ========================================
// 【パン（下）】Policy-Validator & HitL & Audit-Log
// 外部API送信直前・ワークフロー終了時に配置
// ========================================

export const V8_FOOTER_POLICY_VALIDATOR = `
// ========================================
// N3 Empire OS V8 - Policy-Validator ノード
// 【STEP N-2】外部API送信直前に配置
// ========================================

const auth_context = $json.auth_context || {};
const tenant_id = auth_context.tenant_id || '0';

// チェック対象コンテンツ
const content = $json.content || $json.description || $json.text || $json.title || '';
const target_platform = $json.platform || $json.target_platform || 'default';
const region = $json.region || 'JP';

if (!content || content.length < 10) {
  // コンテンツがない場合はスキップ
  return [{ json: { ...($input.first().json), policy_validation: { passed: true, skipped: true } } }];
}

// アクティブルール取得
const rulesResponse = await $http.request({
  method: 'GET',
  url: $env.SUPABASE_URL + '/rest/v1/core.policy_rules',
  qs: {
    is_active: 'eq.true',
    select: '*',
    order: 'priority.asc'
  },
  headers: {
    'apikey': $env.SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY
  },
  json: true
}).catch(() => []);

const rules = rulesResponse || [];

// バリデーション実行
const violations = [];
const warnings = [];
let highest_severity = 'info';
let final_action = 'pass';
let requires_approval = false;
const severity_order = ['info', 'warning', 'error', 'critical'];

for (const rule of rules) {
  const applies_to = rule.applies_to || {};
  
  // 適用範囲チェック
  if (!applies_to.platforms?.includes('*') && !applies_to.platforms?.includes(target_platform)) continue;
  if (!applies_to.regions?.includes('*') && !applies_to.regions?.includes(region)) continue;
  
  const rule_def = rule.rule_definition || {};
  if (rule_def.type !== 'pattern' && rule_def.type !== 'regex') continue;
  
  const patterns = rule_def.patterns || [];
  const is_regex = rule_def.regex || rule_def.type === 'regex';
  
  for (const pattern of patterns) {
    let matched = false;
    let matched_text = '';
    
    if (is_regex) {
      try {
        const regex = new RegExp(pattern, 'gi');
        const match = regex.exec(content);
        if (match) { matched = true; matched_text = match[0]; }
      } catch (e) {}
    } else {
      const idx = content.toLowerCase().indexOf(pattern.toLowerCase());
      if (idx !== -1) { matched = true; matched_text = content.substring(idx, idx + pattern.length); }
    }
    
    if (matched) {
      const violation = {
        rule_code: rule.rule_code,
        rule_name: rule.rule_name,
        severity: rule_def.severity || 'warning',
        action: rule_def.action || 'flag',
        matched_text
      };
      
      if (violation.severity === 'warning' || violation.severity === 'info') {
        warnings.push(violation);
      } else {
        violations.push(violation);
      }
      
      if (severity_order.indexOf(violation.severity) > severity_order.indexOf(highest_severity)) {
        highest_severity = violation.severity;
      }
      
      if (violation.action === 'stop' || violation.action === 'reject') {
        final_action = violation.action;
      }
      
      if (rule.action_config?.require_approval) {
        requires_approval = true;
      }
      
      break; // 同じルールで複数マッチしない
    }
  }
}

// 違反ログ保存
if (violations.length > 0) {
  for (const v of violations) {
    await $http.request({
      method: 'POST',
      url: $env.SUPABASE_URL + '/rest/v1/core.policy_violations',
      headers: {
        'apikey': $env.SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: {
        tenant_id,
        rule_code: v.rule_code,
        severity: v.severity,
        matched_pattern: v.matched_text,
        action_taken: v.action,
        requires_human_review: requires_approval,
        workflow_id: $workflow.id,
        execution_id: $execution.id
      }
    }).catch(() => {});
  }
}

const policy_validation = {
  passed: final_action === 'pass' || final_action === 'flag',
  action: final_action,
  violations,
  warnings,
  highest_severity,
  requires_approval
};

// stop/reject の場合はエラー返却
if (final_action === 'stop' || final_action === 'reject') {
  return [{
    json: {
      ...($input.first().json),
      policy_validation,
      _error: true,
      _error_code: 'POLICY_VIOLATION',
      _error_message: 'ポリシー違反: ' + violations.map(v => v.rule_name).join(', '),
      _terminate: requires_approval ? false : true, // 承認要求の場合は終了しない
      _requires_approval: requires_approval
    }
  }];
}

return [{ json: { ...($input.first().json), policy_validation } }];
`;

export const V8_FOOTER_HITL_CHECK = `
// ========================================
// N3 Empire OS V8 - HitL チェックノード
// 【STEP N-1】Policy-Validator直後に配置
// 承認が必要な場合に承認リクエストを作成
// ========================================

const requires_approval = $json._requires_approval || $json.policy_validation?.requires_approval;
const auth_context = $json.auth_context || {};
const tenant_id = auth_context.tenant_id || '0';

if (!requires_approval) {
  // 承認不要 → そのまま続行
  return [{ json: { ...($input.first().json), hitl_check: { required: false } } }];
}

// 承認リクエスト作成
const action_type = $json.action_type || 'api_request';
const target_title = $json.title || $json.product_title || $json.target_id || 'Unknown';

// アクションコード生成
const timestamp = Date.now().toString(36).toUpperCase();
const random = Math.random().toString(36).substring(2, 10).toUpperCase();
const action_code = 'ACT_' + timestamp + '_' + random;

// 期限計算（60分）
const expires_at = new Date();
expires_at.setMinutes(expires_at.getMinutes() + 60);

// コールバックURL
const callback_url = $env.N8N_WEBHOOK_URL + '/hitl-callback/' + $workflow.id;

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
    action_code,
    tenant_id,
    action_type,
    target_type: $json.target_type || 'unknown',
    target_id: $json.target_id || $json.product_id || null,
    target_title,
    target_preview: ($json.content || $json.description || '').substring(0, 500),
    status: 'pending',
    request_reason: '自動検閲による承認要求: ' + ($json.policy_validation?.violations?.[0]?.rule_name || 'ポリシー違反'),
    request_context: {
      policy_validation: $json.policy_validation,
      original_request: $json
    },
    workflow_id: $workflow.id,
    execution_id: $execution.id,
    callback_url,
    expires_at: expires_at.toISOString(),
    notification_channels: ['chatwork']
  },
  json: true
}).catch(() => null);

if (!insertResponse || insertResponse.length === 0) {
  return [{
    json: {
      ...($input.first().json),
      hitl_check: { required: true, error: '承認リクエスト作成失敗' },
      _error: true,
      _error_code: 'HITL_CREATE_FAILED',
      _terminate: true
    }
  }];
}

const created_action = insertResponse[0];

// ChatWork通知
const base_url = $env.N3_APP_URL || 'https://n3-app.vercel.app';
const approval_url = base_url + '/api/hitl/approve/' + action_code;
const rejection_url = base_url + '/api/hitl/reject/' + action_code;

if ($env.CHATWORK_API_KEY && $env.CHATWORK_ROOM_ID) {
  const message = '[info][title]🔔 承認リクエスト[/title]' +
    '種別: ' + action_type + '\\n' +
    '対象: ' + target_title + '\\n' +
    '理由: 自動検閲による承認要求\\n' +
    '期限: ' + expires_at.toLocaleString('ja-JP') + '\\n\\n' +
    '[承認] ' + approval_url + '\\n' +
    '[拒否] ' + rejection_url + '[/info]';
  
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

// 承認待ち状態を返却（ワークフローはここで一時停止）
return [{
  json: {
    ...($input.first().json),
    hitl_check: {
      required: true,
      action_id: created_action.id,
      action_code,
      expires_at: expires_at.toISOString(),
      approval_url,
      rejection_url,
      status: 'pending'
    },
    _waiting_approval: true
  }
}];
`;

export const V8_FOOTER_AUDIT_LOG = `
// ========================================
// N3 Empire OS V8 - Audit-Log ノード
// 【STEP N】ワークフロー最後に必ず配置
// ========================================

const auth_context = $json.auth_context || {};
const tenant_id = auth_context.tenant_id || '0';
const started_at = $json._started_at || new Date().toISOString();
const execution_time_ms = Date.now() - new Date(started_at).getTime();

// 成功/失敗判定
const is_error = $json._error || $json.success === false || false;
const error_code = $json._error_code || $json.error?.code || null;
const error_message = $json._error_message || $json.error?.message || null;

// 監査ログ保存
await $http.request({
  method: 'POST',
  url: $env.SUPABASE_URL + '/rest/v1/core.audit_logs',
  headers: {
    'apikey': $env.SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
  },
  body: {
    tenant_id,
    event_type: $json.action || 'workflow_execution',
    event_category: 'workflow',
    event_source: 'n8n',
    source_workflow_id: $workflow.id,
    source_execution_id: $execution.id,
    target_type: $json.target_type || 'unknown',
    target_id: $json.target_id || $json.product_id || null,
    details: {
      action: $json.action,
      platform: $json.platform,
      auth_context: { tenant_id, plan_code: auth_context.plan_code },
      policy_validation: $json.policy_validation,
      hitl_check: $json.hitl_check,
      result_summary: is_error ? 'error' : 'success'
    },
    status: is_error ? 'error' : 'success',
    error_code,
    error_message,
    ip_address: $json.ip_address || null,
    user_agent: $json.identity_context?.headers?.['User-Agent'] || null,
    duration_ms: execution_time_ms
  }
}).catch(err => {
  console.error('Audit log failed:', err);
});

// 最終レスポンス構築
const response = {
  success: !is_error && !$json._waiting_approval,
  data: $json.data || $json.result || null,
  meta: {
    tenant_id,
    workflow_id: $workflow.id,
    execution_id: $execution.id,
    execution_time_ms,
    quota: auth_context.quota || null
  }
};

// エラーの場合
if (is_error) {
  response.error = {
    code: error_code || 'UNKNOWN_ERROR',
    message: error_message || '不明なエラー'
  };
}

// 承認待ちの場合
if ($json._waiting_approval) {
  response.waiting_approval = true;
  response.hitl = $json.hitl_check;
}

// Policy警告がある場合
if ($json.policy_validation?.warnings?.length > 0) {
  response.warnings = $json.policy_validation.warnings;
}

return [{ json: response }];
`;

// ========================================
// 統合テンプレート: V8不沈艦ワークフロー構造
// ========================================

export const V8_WORKFLOW_STRUCTURE = {
  // 【パン（上）】認証・身分確認
  header: {
    '1_auth_gate': V8_HEADER_AUTH_GATE,
    '2_identity_manager': V8_HEADER_IDENTITY_MANAGER,
  },
  
  // 【具（中身）】メインロジック（既存コードをここに配置）
  // main: { ... } ← 各ワークフロー固有のコード
  
  // 【パン（下）】検閲・承認・監査
  footer: {
    'n2_policy_validator': V8_FOOTER_POLICY_VALIDATOR,
    'n1_hitl_check': V8_FOOTER_HITL_CHECK,
    'n_audit_log': V8_FOOTER_AUDIT_LOG,
  }
};

// ========================================
// ワークフロー生成ヘルパー
// ========================================

export function generateV8Workflow(
  workflowName: string,
  mainLogicCode: string,
  options?: {
    skipIdentityManager?: boolean;
    skipPolicyValidator?: boolean;
    skipHitL?: boolean;
    customHeaders?: string;
    customFooters?: string;
  }
): string {
  const sections: string[] = [];
  
  // ヘッダー
  sections.push(`// ========================================`);
  sections.push(`// ${workflowName} - V8 不沈艦仕様`);
  sections.push(`// 自動生成: ${new Date().toISOString()}`);
  sections.push(`// ========================================`);
  sections.push('');
  
  // Auth-Gate（必須）
  sections.push('// === 【STEP 1】Auth-Gate ===');
  sections.push(V8_HEADER_AUTH_GATE);
  sections.push('');
  
  // Identity-Manager（オプション）
  if (!options?.skipIdentityManager) {
    sections.push('// === 【STEP 2】Identity-Manager ===');
    sections.push(V8_HEADER_IDENTITY_MANAGER);
    sections.push('');
  }
  
  // カスタムヘッダー
  if (options?.customHeaders) {
    sections.push('// === 【STEP 3】Custom Headers ===');
    sections.push(options.customHeaders);
    sections.push('');
  }
  
  // メインロジック
  sections.push('// === 【STEP MAIN】Business Logic ===');
  sections.push(mainLogicCode);
  sections.push('');
  
  // カスタムフッター
  if (options?.customFooters) {
    sections.push('// === 【STEP N-3】Custom Footers ===');
    sections.push(options.customFooters);
    sections.push('');
  }
  
  // Policy-Validator（オプション）
  if (!options?.skipPolicyValidator) {
    sections.push('// === 【STEP N-2】Policy-Validator ===');
    sections.push(V8_FOOTER_POLICY_VALIDATOR);
    sections.push('');
  }
  
  // HitL Check（オプション）
  if (!options?.skipHitL) {
    sections.push('// === 【STEP N-1】HitL Check ===');
    sections.push(V8_FOOTER_HITL_CHECK);
    sections.push('');
  }
  
  // Audit-Log（必須）
  sections.push('// === 【STEP N】Audit-Log ===');
  sections.push(V8_FOOTER_AUDIT_LOG);
  
  return sections.join('\n');
}

// ========================================
// エクスポート
// ========================================

export default {
  // 個別テンプレート
  headerAuthGate: V8_HEADER_AUTH_GATE,
  headerIdentityManager: V8_HEADER_IDENTITY_MANAGER,
  footerPolicyValidator: V8_FOOTER_POLICY_VALIDATOR,
  footerHitLCheck: V8_FOOTER_HITL_CHECK,
  footerAuditLog: V8_FOOTER_AUDIT_LOG,
  
  // 構造定義
  structure: V8_WORKFLOW_STRUCTURE,
  
  // ヘルパー
  generateWorkflow: generateV8Workflow,
};
