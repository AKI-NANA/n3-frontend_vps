# N3 Empire OS V8.3 - 中央集権型不沈艦アーキテクチャ

**生成日: 2026-01-25**
**バージョン: V8.3 Single VPS Stable Architecture**

---

## 📋 Executive Summary

### 設計原則
- **Temporal / BullMQ 不使用**: n8n単体＋Supabase(SQL)で「疑似分散制御」を構築
- **140ワークフロー直接Webhook駆動禁止**: すべて中央司令塔（CORE-Dispatcher）経由
- **VPS単体運用**: 1台で安定稼働、費用+0円
- **同時実行制御**: 最大10並列、キューベース制御

### 期待される効果
| 項目 | 効果 |
|------|------|
| VPS1台運用 | 可能 |
| 140本同時事故回避 | ◎ |
| BAN連鎖防止 | ◎ |
| 追加費用 | +0円 |
| 安定性 | 約80% |

---

## 🏗️ システムアーキテクチャ

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         外部リクエスト                                    │
│              (Next.js / 外部システム / Cron)                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    【唯一の入口】                                         │
│              /webhook/core-dispatcher                                    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    CORE-Dispatcher                                │   │
│  │                                                                   │   │
│  │  1. Auth-Gate [同期] → 認証・権限チェック                         │   │
│  │  2. Circuit-Breaker [同期] → API健全性チェック                    │   │
│  │  3. Burn-Limit [同期] → コスト上限チェック                        │   │
│  │  4. Job Queue登録 → n3_job_queue INSERT                          │   │
│  │  5. スロット確認 → 同時実行数 < 10 ?                              │   │
│  │  6. ExecuteWorkflow → 対象ワークフロー実行                        │   │
│  │  7. Decision-Trace [非同期] → ログ記録                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       業務ワークフロー層                                  │
│                                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ 出品     │ │ 在庫     │ │ リサーチ │ │ メディア │                   │
│  │ (17本)   │ │ (15本)   │ │ (12本)   │ │ (36本)   │                   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                   │
│                                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ 受注     │ │ 出荷     │ │ 決済     │ │ その他   │                   │
│  │ (8本)    │ │ (6本)    │ │ (4本)    │ │ (42本)   │                   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Supabase                                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ n3_job_    │ │ n3_api_    │ │ n3_budget_  │ │ n3_audit_   │       │
│  │ queue      │ │ health     │ │ tracker     │ │ logs        │       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 フロー詳細

### CORE-Dispatcher 実行フロー

```
[Webhook受信]
     │
     ▼
┌─────────────────────┐
│ 1. Auth-Gate [同期] │ ← 失敗 → 403 Forbidden
│   - API Key検証     │
│   - Token検証       │
│   - IP制限          │
└─────────────────────┘
     │ 成功
     ▼
┌─────────────────────────────┐
│ 2. Circuit-Breaker [同期]   │ ← BLOCKED → 503 Service Unavailable
│   - n3_api_health参照       │    "API: {name} is blocked until {time}"
│   - blocked_until確認       │
└─────────────────────────────┘
     │ OPEN
     ▼
┌─────────────────────────────┐
│ 3. Burn-Limit [同期]        │ ← 超過 → 429 Too Many Requests
│   - n3_budget_tracker参照   │    "Budget exceeded: ${used}/${limit}"
│   - 日次/月次上限チェック   │
└─────────────────────────────┘
     │ OK
     ▼
┌─────────────────────────────┐
│ 4. Job Queue登録            │
│   - n3_job_queue INSERT     │
│   - status: 'waiting'       │
│   - priority設定            │
└─────────────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│ 5. スロット確認             │ ← 満杯 → 200 OK (Queued)
│   - running count < 10 ?    │    job_id返却、後で実行
└─────────────────────────────┘
     │ スロット空き
     ▼
┌─────────────────────────────┐
│ 6. Job status更新           │
│   - status: 'running'       │
│   - started_at: NOW()       │
└─────────────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│ 7. ExecuteWorkflow          │
│   - 対象ワークフロー実行    │
│   - waitForCompletion: true │
└─────────────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│ 8. 結果処理                 │
│   - Job status: done/failed │
│   - Circuit-Breaker更新     │
│   - 次のJob確認・実行       │
└─────────────────────────────┘
     │
     ▼ [非同期]
┌─────────────────────────────┐
│ 9. Decision-Trace           │
│   - n3_audit_logs INSERT    │
│   - waitForCompletion: false│
└─────────────────────────────┘
```

---

## 🔐 4大サブワークフロー詳細設計

### 1. [SUB] Auth-Gate

**ファイル名**: `N3-SUB-AUTH-GATE.json`
**Webhook**: `/webhook/sub-auth-gate`
**実行モード**: 同期（Wait for Completion = true）

#### 入力パラメータ
```json
{
  "api_key": "string (optional)",
  "token": "string (optional)",
  "client_ip": "string",
  "tenant_id": "string (optional)",
  "user_id": "string",
  "required_role": "string (optional)"
}
```

#### 処理フロー
```javascript
// Auth-Gate Logic
const input = $input.all()[0].json;

// 1. API Key検証
if (input.api_key) {
  const validKeys = await getValidApiKeys(input.tenant_id);
  if (!validKeys.includes(input.api_key)) {
    return { auth_ok: false, error: 'Invalid API Key', code: 401 };
  }
}

// 2. Token検証（JIT検証含む）
if (input.token) {
  const tokenValid = await validateToken(input.token);
  if (!tokenValid) {
    return { auth_ok: false, error: 'Invalid or expired token', code: 401 };
  }
}

// 3. IP制限チェック
const allowedIps = await getAllowedIps(input.tenant_id);
if (allowedIps.length > 0 && !allowedIps.includes(input.client_ip)) {
  return { auth_ok: false, error: 'IP not allowed', code: 403 };
}

// 4. Role検証
if (input.required_role) {
  const userRole = await getUserRole(input.user_id);
  if (!hasPermission(userRole, input.required_role)) {
    return { auth_ok: false, error: 'Insufficient permissions', code: 403 };
  }
}

return {
  auth_ok: true,
  tenant_id: input.tenant_id || 'default',
  user_id: input.user_id,
  risk_level: 'low'
};
```

#### 出力
```json
{
  "auth_ok": true,
  "tenant_id": "string",
  "user_id": "string",
  "risk_level": "low|medium|high"
}
```

---

### 2. [SUB] Circuit-Breaker

**ファイル名**: `N3-SUB-CIRCUIT-BREAKER.json`
**Webhook**: `/webhook/sub-circuit-breaker`
**実行モード**: 同期（Wait for Completion = true）

#### 入力パラメータ
```json
{
  "api_name": "string",
  "action": "check|record_success|record_failure",
  "tenant_id": "string (optional)"
}
```

#### 処理フロー
```javascript
// Circuit-Breaker Logic
const input = $input.all()[0].json;
const FAILURE_THRESHOLD = 5;
const COOLDOWN_MINUTES = 30;

// Supabase接続
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

if (input.action === 'check') {
  // 健全性チェック
  const { data, error } = await supabase
    .from('n3_api_health')
    .select('*')
    .eq('api_name', input.api_name)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    throw new Error(`DB Error: ${error.message}`);
  }
  
  if (!data) {
    // 新規API登録
    await supabase.from('n3_api_health').insert({
      api_name: input.api_name,
      fail_count: 0,
      status: 'healthy',
      blocked_until: null
    });
    return { status: 'healthy', blocked: false };
  }
  
  // ブロック状態チェック
  if (data.blocked_until && new Date(data.blocked_until) > new Date()) {
    return { 
      status: 'blocked', 
      blocked: true, 
      blocked_until: data.blocked_until,
      message: `API blocked until ${data.blocked_until}`
    };
  }
  
  // ブロック解除
  if (data.blocked_until && new Date(data.blocked_until) <= new Date()) {
    await supabase
      .from('n3_api_health')
      .update({ 
        fail_count: 0, 
        blocked_until: null,
        status: 'healthy',
        recovered_at: new Date().toISOString()
      })
      .eq('api_name', input.api_name);
    return { status: 'healthy', blocked: false, recovered: true };
  }
  
  return { status: data.status, blocked: false, fail_count: data.fail_count };
}

if (input.action === 'record_success') {
  // 成功記録 - fail_countリセット
  await supabase
    .from('n3_api_health')
    .update({ 
      fail_count: 0,
      last_success: new Date().toISOString(),
      status: 'healthy'
    })
    .eq('api_name', input.api_name);
  return { recorded: true, action: 'success' };
}

if (input.action === 'record_failure') {
  // 失敗記録
  const { data } = await supabase
    .from('n3_api_health')
    .select('fail_count')
    .eq('api_name', input.api_name)
    .single();
  
  const newFailCount = (data?.fail_count || 0) + 1;
  
  const updateData = {
    fail_count: newFailCount,
    last_fail: new Date().toISOString(),
    last_error: input.error_message || null
  };
  
  // 閾値超過でブロック
  if (newFailCount >= FAILURE_THRESHOLD) {
    const blockedUntil = new Date();
    blockedUntil.setMinutes(blockedUntil.getMinutes() + COOLDOWN_MINUTES);
    updateData.blocked_until = blockedUntil.toISOString();
    updateData.status = 'blocked';
    
    // 緊急通知
    await triggerNotification({
      type: 'circuit_breaker',
      api_name: input.api_name,
      blocked_until: blockedUntil.toISOString(),
      fail_count: newFailCount
    });
  }
  
  await supabase
    .from('n3_api_health')
    .update(updateData)
    .eq('api_name', input.api_name);
  
  return { 
    recorded: true, 
    action: 'failure',
    fail_count: newFailCount,
    blocked: newFailCount >= FAILURE_THRESHOLD
  };
}
```

#### 出力
```json
{
  "status": "healthy|degraded|blocked",
  "blocked": false,
  "blocked_until": "ISO timestamp or null",
  "fail_count": 0
}
```

---

### 3. [SUB] Burn-Limit

**ファイル名**: `N3-SUB-BURN-LIMIT.json`
**Webhook**: `/webhook/sub-burn-limit`
**実行モード**: 同期（Wait for Completion = true）

#### 入力パラメータ
```json
{
  "user_id": "string",
  "tenant_id": "string (optional)",
  "service": "string (ebay|openai|gemini|elevenlabs)",
  "estimated_cost": 0.05,
  "action": "check|record"
}
```

#### 処理フロー
```javascript
// Burn-Limit Logic
const input = $input.all()[0].json;
const today = new Date().toISOString().split('T')[0];
const month = today.substring(0, 7);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ユーザーの上限設定取得
const { data: limits } = await supabase
  .from('n3_burn_limits')
  .select('*')
  .eq('user_id', input.user_id)
  .single();

const dailyLimit = limits?.daily_limit || 1000;
const monthlyLimit = limits?.monthly_limit || 10000;
const alertThreshold = limits?.alert_threshold_percent || 80;

// 現在の使用量取得
const { data: usage } = await supabase
  .from('n3_budget_tracker')
  .select('*')
  .eq('user_id', input.user_id)
  .eq('service', input.service)
  .gte('created_at', `${today}T00:00:00Z`)
  .order('created_at', { ascending: false })
  .limit(1);

const currentDaily = usage?.[0]?.daily_total || 0;
const currentMonthly = usage?.[0]?.monthly_total || 0;

if (input.action === 'check') {
  const estimatedDaily = currentDaily + (input.estimated_cost || 0);
  const estimatedMonthly = currentMonthly + (input.estimated_cost || 0);
  
  // 上限チェック
  if (estimatedDaily > dailyLimit) {
    return {
      burn_ok: false,
      reason: 'daily_limit_exceeded',
      daily_used: currentDaily,
      daily_limit: dailyLimit,
      message: `Daily limit exceeded: $${currentDaily.toFixed(2)}/$${dailyLimit}`
    };
  }
  
  if (estimatedMonthly > monthlyLimit) {
    return {
      burn_ok: false,
      reason: 'monthly_limit_exceeded',
      monthly_used: currentMonthly,
      monthly_limit: monthlyLimit,
      message: `Monthly limit exceeded: $${currentMonthly.toFixed(2)}/$${monthlyLimit}`
    };
  }
  
  // 警告チェック
  const dailyPercent = (estimatedDaily / dailyLimit) * 100;
  const monthlyPercent = (estimatedMonthly / monthlyLimit) * 100;
  
  if (dailyPercent >= alertThreshold || monthlyPercent >= alertThreshold) {
    await triggerNotification({
      type: 'burn_limit_warning',
      user_id: input.user_id,
      daily_percent: dailyPercent.toFixed(1),
      monthly_percent: monthlyPercent.toFixed(1)
    });
  }
  
  return {
    burn_ok: true,
    daily_used_usd: currentDaily,
    daily_limit_usd: dailyLimit,
    monthly_used_usd: currentMonthly,
    monthly_limit_usd: monthlyLimit,
    daily_remaining: dailyLimit - currentDaily,
    monthly_remaining: monthlyLimit - currentMonthly
  };
}

if (input.action === 'record') {
  // コスト記録
  await supabase.from('n3_budget_tracker').insert({
    user_id: input.user_id,
    tenant_id: input.tenant_id,
    service: input.service,
    operation: input.operation || 'api_call',
    workflow_name: input.workflow_name,
    cost: input.estimated_cost,
    daily_total: currentDaily + input.estimated_cost,
    monthly_total: currentMonthly + input.estimated_cost,
    date: today
  });
  
  return {
    recorded: true,
    new_daily_total: currentDaily + input.estimated_cost,
    new_monthly_total: currentMonthly + input.estimated_cost
  };
}
```

#### 出力
```json
{
  "burn_ok": true,
  "daily_used_usd": 45.23,
  "daily_limit_usd": 1000,
  "monthly_used_usd": 1234.56,
  "monthly_limit_usd": 10000,
  "daily_remaining": 954.77,
  "monthly_remaining": 8765.44
}
```

---

### 4. [SUB] Decision-Trace (AUDIT-LOG)

**ファイル名**: `N3-SUB-DECISION-TRACE.json`
**Webhook**: `/webhook/sub-decision-trace`
**実行モード**: 非同期（Wait for Completion = false）

#### 入力パラメータ
```json
{
  "tenant_id": "string",
  "user_id": "string",
  "workflow_name": "string",
  "job_id": "uuid",
  "action": "string",
  "request_data": {},
  "response_data": {},
  "execution_time_ms": 1234,
  "success": true,
  "error_message": "string (optional)",
  "ai_context": {
    "model_used": "gpt-4",
    "reasoning": "string",
    "confidence_score": 0.95,
    "tokens_used": 1500,
    "cost_usd": 0.03
  }
}
```

#### 処理フロー
```javascript
// Decision-Trace Logic (非同期実行)
const input = $input.all()[0].json;
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ログハッシュ生成（改ざん防止）
const hashContent = JSON.stringify({
  timestamp: new Date().toISOString(),
  workflow_name: input.workflow_name,
  job_id: input.job_id,
  request_data: input.request_data,
  response_data: input.response_data,
  success: input.success
});
const log_hash = crypto.createHash('sha256').update(hashContent).digest('hex');

// 監査ログ記録
await supabase.from('n3_audit_logs').insert({
  tenant_id: input.tenant_id,
  user_id: input.user_id,
  workflow_name: input.workflow_name,
  job_id: input.job_id,
  action: input.action,
  request_data: input.request_data,
  response_data: input.response_data,
  execution_time_ms: input.execution_time_ms,
  success: input.success,
  error_message: input.error_message,
  log_hash: log_hash,
  timezone: 'Asia/Tokyo'
});

// AI判断記録（存在する場合）
if (input.ai_context) {
  await supabase.from('n3_ai_decision_traces').insert({
    tenant_id: input.tenant_id,
    user_id: input.user_id,
    workflow_name: input.workflow_name,
    node_name: input.action,
    request_id: input.job_id,
    input_data: input.request_data,
    output_data: input.response_data,
    model_used: input.ai_context.model_used,
    reasoning: input.ai_context.reasoning,
    confidence_score: input.ai_context.confidence_score,
    tokens_used: input.ai_context.tokens_used,
    cost_usd: input.ai_context.cost_usd,
    execution_time_ms: input.execution_time_ms
  });
}

return { logged: true, log_hash: log_hash };
```

---

## 📋 CORE-Dispatcher 完全設計

### ファイル名: `N3-CORE-DISPATCHER.json`
### Webhook: `/webhook/core-dispatcher`

#### 入力パラメータ
```json
{
  "workflow_name": "N3-LISTING-YAHOO-AUCTIONS",
  "action": "execute",
  "priority": 5,
  "payload": {
    "product_ids": [123, 456],
    "marketplace": "ebay_us",
    "account": "mjt"
  },
  "auth": {
    "api_key": "xxx",
    "user_id": "user_001"
  },
  "options": {
    "timeout_ms": 300000,
    "retry_count": 3
  }
}
```

#### 完全なワークフロー構造
```json
{
  "name": "N3-CORE-DISPATCHER",
  "nodes": [
    {
      "id": "n3_core_webhook",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "parameters": {
        "path": "core-dispatcher",
        "responseMode": "responseNode",
        "options": {}
      }
    },
    {
      "id": "n3_core_auth_gate",
      "name": "Auth-Gate",
      "type": "n8n-nodes-base.executeWorkflow",
      "position": [450, 300],
      "parameters": {
        "source": "database",
        "workflowId": "={{ $vars.SUB_AUTH_GATE_ID }}",
        "mode": "once",
        "options": {
          "waitForSubWorkflow": true
        }
      }
    },
    {
      "id": "n3_core_auth_check",
      "name": "Auth Check",
      "type": "n8n-nodes-base.if",
      "position": [650, 300],
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{ $json.auth_ok }}",
              "value2": true
            }
          ]
        }
      }
    },
    {
      "id": "n3_core_circuit_breaker",
      "name": "Circuit-Breaker",
      "type": "n8n-nodes-base.executeWorkflow",
      "position": [850, 300],
      "parameters": {
        "source": "database",
        "workflowId": "={{ $vars.SUB_CIRCUIT_BREAKER_ID }}",
        "mode": "once",
        "options": {
          "waitForSubWorkflow": true
        }
      }
    },
    {
      "id": "n3_core_cb_check",
      "name": "CB Check",
      "type": "n8n-nodes-base.if",
      "position": [1050, 300],
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{ $json.blocked }}",
              "value2": false
            }
          ]
        }
      }
    },
    {
      "id": "n3_core_burn_limit",
      "name": "Burn-Limit",
      "type": "n8n-nodes-base.executeWorkflow",
      "position": [1250, 300],
      "parameters": {
        "source": "database",
        "workflowId": "={{ $vars.SUB_BURN_LIMIT_ID }}",
        "mode": "once",
        "options": {
          "waitForSubWorkflow": true
        }
      }
    },
    {
      "id": "n3_core_burn_check",
      "name": "Burn Check",
      "type": "n8n-nodes-base.if",
      "position": [1450, 300],
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{ $json.burn_ok }}",
              "value2": true
            }
          ]
        }
      }
    },
    {
      "id": "n3_core_queue_job",
      "name": "Queue Job",
      "type": "n8n-nodes-base.postgres",
      "position": [1650, 300],
      "parameters": {
        "operation": "executeQuery",
        "query": "INSERT INTO n3_job_queue (workflow_name, status, priority, payload, created_by, created_at) VALUES ('{{ $('Webhook').item.json.workflow_name }}', 'waiting', {{ $('Webhook').item.json.priority || 5 }}, '{{ JSON.stringify($('Webhook').item.json.payload) }}'::jsonb, '{{ $('Auth-Gate').item.json.user_id }}', NOW()) RETURNING id, workflow_name, status;",
        "options": {}
      }
    },
    {
      "id": "n3_core_check_slots",
      "name": "Check Slots",
      "type": "n8n-nodes-base.postgres",
      "position": [1850, 300],
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT COUNT(*) as running_count FROM n3_job_queue WHERE status = 'running';",
        "options": {}
      }
    },
    {
      "id": "n3_core_slot_available",
      "name": "Slot Available?",
      "type": "n8n-nodes-base.if",
      "position": [2050, 300],
      "parameters": {
        "conditions": {
          "number": [
            {
              "value1": "={{ $json.running_count }}",
              "operation": "smaller",
              "value2": 10
            }
          ]
        }
      }
    },
    {
      "id": "n3_core_update_running",
      "name": "Update Running",
      "type": "n8n-nodes-base.postgres",
      "position": [2250, 300],
      "parameters": {
        "operation": "executeQuery",
        "query": "UPDATE n3_job_queue SET status = 'running', started_at = NOW() WHERE id = '{{ $('Queue Job').item.json.id }}' RETURNING *;",
        "options": {}
      }
    },
    {
      "id": "n3_core_execute_workflow",
      "name": "Execute Workflow",
      "type": "n8n-nodes-base.executeWorkflow",
      "position": [2450, 300],
      "parameters": {
        "source": "database",
        "workflowId": "={{ $vars[$('Webhook').item.json.workflow_name] || $('Webhook').item.json.workflow_name }}",
        "mode": "once",
        "options": {
          "waitForSubWorkflow": true
        }
      }
    },
    {
      "id": "n3_core_update_done",
      "name": "Update Done",
      "type": "n8n-nodes-base.postgres",
      "position": [2650, 300],
      "parameters": {
        "operation": "executeQuery",
        "query": "UPDATE n3_job_queue SET status = 'done', finished_at = NOW(), result = '{{ JSON.stringify($json) }}'::jsonb WHERE id = '{{ $('Queue Job').item.json.id }}';",
        "options": {}
      }
    },
    {
      "id": "n3_core_decision_trace",
      "name": "Decision-Trace",
      "type": "n8n-nodes-base.executeWorkflow",
      "position": [2850, 300],
      "parameters": {
        "source": "database",
        "workflowId": "={{ $vars.SUB_DECISION_TRACE_ID }}",
        "mode": "once",
        "options": {
          "waitForSubWorkflow": false
        }
      }
    },
    {
      "id": "n3_core_response_success",
      "name": "Response Success",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [3050, 300],
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify({ success: true, job_id: $('Queue Job').item.json.id, result: $('Execute Workflow').item.json }) }}"
      }
    },
    {
      "id": "n3_core_response_queued",
      "name": "Response Queued",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [2250, 500],
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify({ success: true, status: 'queued', job_id: $('Queue Job').item.json.id, message: 'Job queued, will be processed when slot available' }) }}"
      }
    },
    {
      "id": "n3_core_response_auth_error",
      "name": "Response Auth Error",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [650, 500],
      "parameters": {
        "respondWith": "json",
        "responseCode": 403,
        "responseBody": "={{ JSON.stringify({ success: false, error: 'Authentication failed', details: $('Auth-Gate').item.json }) }}"
      }
    },
    {
      "id": "n3_core_response_blocked",
      "name": "Response Blocked",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [1050, 500],
      "parameters": {
        "respondWith": "json",
        "responseCode": 503,
        "responseBody": "={{ JSON.stringify({ success: false, error: 'Service temporarily unavailable', details: $('Circuit-Breaker').item.json }) }}"
      }
    },
    {
      "id": "n3_core_response_budget",
      "name": "Response Budget Error",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [1450, 500],
      "parameters": {
        "respondWith": "json",
        "responseCode": 429,
        "responseBody": "={{ JSON.stringify({ success: false, error: 'Budget limit exceeded', details: $('Burn-Limit').item.json }) }}"
      }
    }
  ],
  "connections": {
    "Webhook": { "main": [[{ "node": "Auth-Gate", "type": "main", "index": 0 }]] },
    "Auth-Gate": { "main": [[{ "node": "Auth Check", "type": "main", "index": 0 }]] },
    "Auth Check": {
      "main": [
        [{ "node": "Circuit-Breaker", "type": "main", "index": 0 }],
        [{ "node": "Response Auth Error", "type": "main", "index": 0 }]
      ]
    },
    "Circuit-Breaker": { "main": [[{ "node": "CB Check", "type": "main", "index": 0 }]] },
    "CB Check": {
      "main": [
        [{ "node": "Burn-Limit", "type": "main", "index": 0 }],
        [{ "node": "Response Blocked", "type": "main", "index": 0 }]
      ]
    },
    "Burn-Limit": { "main": [[{ "node": "Burn Check", "type": "main", "index": 0 }]] },
    "Burn Check": {
      "main": [
        [{ "node": "Queue Job", "type": "main", "index": 0 }],
        [{ "node": "Response Budget Error", "type": "main", "index": 0 }]
      ]
    },
    "Queue Job": { "main": [[{ "node": "Check Slots", "type": "main", "index": 0 }]] },
    "Check Slots": { "main": [[{ "node": "Slot Available?", "type": "main", "index": 0 }]] },
    "Slot Available?": {
      "main": [
        [{ "node": "Update Running", "type": "main", "index": 0 }],
        [{ "node": "Response Queued", "type": "main", "index": 0 }]
      ]
    },
    "Update Running": { "main": [[{ "node": "Execute Workflow", "type": "main", "index": 0 }]] },
    "Execute Workflow": { "main": [[{ "node": "Update Done", "type": "main", "index": 0 }]] },
    "Update Done": { "main": [[{ "node": "Decision-Trace", "type": "main", "index": 0 }]] },
    "Decision-Trace": { "main": [[{ "node": "Response Success", "type": "main", "index": 0 }]] }
  }
}
```

---

## 📈 ワークフロー名マッピング

CORE-Dispatcherが業務ワークフローを呼び出す際のID解決:

```javascript
// n8n Variables設定
const WORKFLOW_MAPPING = {
  // 出品系
  "N3-LISTING-EBAY": "workflow_id_001",
  "N3-LISTING-AMAZON": "workflow_id_002",
  "N3-LISTING-YAHOO": "workflow_id_003",
  
  // 在庫系
  "N3-INVENTORY-SYNC": "workflow_id_010",
  "N3-INVENTORY-CHECK": "workflow_id_011",
  
  // リサーチ系
  "N3-RESEARCH-PRODUCT": "workflow_id_020",
  "N3-RESEARCH-PRICE": "workflow_id_021",
  
  // メディア系
  "N3-MEDIA-YOUTUBE": "workflow_id_030",
  "N3-MEDIA-BLOG": "workflow_id_031",
  
  // サブワークフロー
  "SUB_AUTH_GATE_ID": "sub_workflow_001",
  "SUB_CIRCUIT_BREAKER_ID": "sub_workflow_002",
  "SUB_BURN_LIMIT_ID": "sub_workflow_003",
  "SUB_DECISION_TRACE_ID": "sub_workflow_004"
};
```

---

## 🔄 Queue Worker（オプション）

キューに溜まったジョブを定期的に処理するワークフロー:

**ファイル名**: `N3-QUEUE-WORKER.json`
**トリガー**: Schedule (毎分実行)

```javascript
// Queue Worker Logic
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// 現在の実行数確認
const { data: running } = await supabase
  .from('n3_job_queue')
  .select('id')
  .eq('status', 'running');

const runningCount = running?.length || 0;
const availableSlots = 10 - runningCount;

if (availableSlots <= 0) {
  return { message: 'No available slots', running: runningCount };
}

// 待機中ジョブを優先度順に取得
const { data: waitingJobs } = await supabase
  .from('n3_job_queue')
  .select('*')
  .eq('status', 'waiting')
  .order('priority', { ascending: false })
  .order('created_at', { ascending: true })
  .limit(availableSlots);

if (!waitingJobs || waitingJobs.length === 0) {
  return { message: 'No waiting jobs' };
}

// 各ジョブを実行
const results = [];
for (const job of waitingJobs) {
  // CORE-Dispatcher経由で実行
  const result = await executeDispatcher(job);
  results.push(result);
}

return { processed: results.length, results };
```

---

## 次のドキュメント

1. **SQLスキーマ**: `N3_V83_SQL_SCHEMA.sql`
2. **変換スクリプト**: `n3_v83_transformer.py`
3. **実装ガイド**: `N3_V83_IMPLEMENTATION_GUIDE.md`
