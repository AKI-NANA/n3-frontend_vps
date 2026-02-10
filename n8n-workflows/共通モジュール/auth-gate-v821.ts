// ============================================================================
// N3 Empire OS V8.2.1: 最適化済 Auth-Gate
// 
// 【設計思想】堅牢・軽快・安価
// - Smart Risk-Leveling: Low/Mid/High/Criticalでパスを動的切替
// - Night-Shift: 非緊急リクエストを深夜帯へ遅延
// - Cost-Save: リスクに応じてAIモデルを動的切替
// - Async Audit: ログ記録を非同期Fire & Forgetで実行
// 
// バージョン: V8.2.1-FINAL
// ============================================================================

// ============================================================================
// 型定義
// ============================================================================

interface AuthGateInput {
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

interface RiskLevelResult {
  risk_level: 'LOW' | 'MID' | 'HIGH' | 'CRITICAL';
  skip_policy_validator: boolean;
  skip_hitl: boolean;
  skip_evidence: boolean;
  use_premium_model: boolean;
  execution_path: 'FAST' | 'STANDARD' | 'FULL_GUARD' | 'MAX_GUARD';
}

interface NightShiftDecision {
  should_queue: boolean;
  scheduled_for: string | null;
  reason: string;
}

interface CostSaveDecision {
  ai_model: string;
  estimated_cost: number;
  reason: string;
}

interface AuthGateOutput {
  _auth_passed: boolean;
  _auth_error?: boolean;
  _error_code?: string;
  _error_message?: string;
  
  _tenant_id: string;
  _staff_id?: string;
  _request_id: string;
  _timestamp: string;
  
  _risk: RiskLevelResult;
  _night_shift: NightShiftDecision;
  _cost_save: CostSaveDecision;
  
  _execution_path: {
    skip_policy: boolean;
    skip_hitl: boolean;
    skip_evidence: boolean;
    async_audit: boolean;
  };
  
  payload: Record<string, unknown>;
}

// ============================================================================
// 定数定義
// ============================================================================

const RISK_LEVEL_CONFIG = {
  LOW: {
    skip_policy: true,
    skip_hitl: true,
    skip_evidence: true,
    async_audit: true,
    execution_path: 'FAST' as const,
    use_premium_model: false,
  },
  MID: {
    skip_policy: false,
    skip_hitl: true,
    skip_evidence: false,
    async_audit: true,
    execution_path: 'STANDARD' as const,
    use_premium_model: false,
  },
  HIGH: {
    skip_policy: false,
    skip_hitl: false,
    skip_evidence: false,
    async_audit: true,
    execution_path: 'FULL_GUARD' as const,
    use_premium_model: true,
  },
  CRITICAL: {
    skip_policy: false,
    skip_hitl: false,
    skip_evidence: false,
    async_audit: false,  // 同期監査（完了を待つ）
    execution_path: 'MAX_GUARD' as const,
    use_premium_model: true,
  },
};

const ACTION_RISK_PATTERNS: Array<{
  pattern: RegExp;
  risk_level: keyof typeof RISK_LEVEL_CONFIG;
  amount_threshold?: number;
  batch_threshold?: number;
}> = [
  // LOW: 情報取得系（爆速パス）
  { pattern: /^(read|get|list|search|status|check|fetch)\./i, risk_level: 'LOW' },
  { pattern: /^(view|show|display)\./i, risk_level: 'LOW' },
  
  // MID: 一般的な更新操作
  { pattern: /^(update|edit|modify)\./i, risk_level: 'MID' },
  { pattern: /^(create|add|insert)\./i, risk_level: 'MID' },
  { pattern: /^listing\.single/i, risk_level: 'MID' },
  { pattern: /^inventory\.(sync|update)/i, risk_level: 'MID' },
  
  // HIGH: 重要な操作
  { pattern: /^(delete|remove|destroy)\./i, risk_level: 'HIGH' },
  { pattern: /^listing\.bulk/i, risk_level: 'HIGH', batch_threshold: 10 },
  { pattern: /^price\.(bulk|mass)/i, risk_level: 'HIGH' },
  { pattern: /^payment\./i, risk_level: 'HIGH', amount_threshold: 10000 },
  
  // CRITICAL: 最重要操作
  { pattern: /^payment\.large/i, risk_level: 'CRITICAL', amount_threshold: 100000 },
  { pattern: /^account\.(delete|terminate)/i, risk_level: 'CRITICAL' },
  { pattern: /^export\.bulk/i, risk_level: 'CRITICAL' },
  { pattern: /^admin\./i, risk_level: 'CRITICAL' },
];

const AI_MODELS = {
  premium: 'gpt-4o',
  standard: 'gpt-4o-mini',
  economy: 'gpt-3.5-turbo',
};

const MODEL_COSTS = {
  'gpt-4o': 0.03,
  'gpt-4o-mini': 0.0015,
  'gpt-3.5-turbo': 0.0005,
};

// ============================================================================
// Auth-Gate メインロジック（n8n Code Node用）
// ============================================================================

/**
 * V8.2.1 最適化済 Auth-Gate
 * Smart Risk-Leveling / Night-Shift / Cost-Save 完全実装
 */
function authGateV821(input: AuthGateInput): AuthGateOutput[] {
  const crypto = require('crypto');
  
  const body = input.body || {};
  const headers = input.headers || {};
  
  // =========================================================================
  // 1. 基本認証
  // =========================================================================
  
  const tenantId = (body.tenant_id as string) || headers['x-tenant-id'] || headers['X-Tenant-Id'] || process.env.DEFAULT_TENANT_ID || 'default';
  const staffId = (body.staff_id as string) || headers['x-staff-id'] || headers['X-Staff-Id'];
  const signature = headers['x-n3-signature'] || headers['X-N3-Signature'];
  const timestamp = headers['x-n3-timestamp'] || headers['X-N3-Timestamp'];
  const hmacSecret = process.env.N8N_HMAC_SECRET;
  
  // HMAC署名検証
  if (hmacSecret && signature && timestamp) {
    const tsAge = Date.now() - parseInt(timestamp);
    
    // タイムスタンプ検証（5分以内）
    if (tsAge > 300000 || tsAge < -30000) {
      return [{
        _auth_passed: false,
        _auth_error: true,
        _error_code: 'TIMESTAMP_EXPIRED',
        _error_message: 'タイムスタンプ期限切れ（5分以内である必要があります）',
        _tenant_id: tenantId,
        _request_id: `err-${Date.now()}`,
        _timestamp: new Date().toISOString(),
        _risk: { risk_level: 'LOW', skip_policy_validator: true, skip_hitl: true, skip_evidence: true, use_premium_model: false, execution_path: 'FAST' },
        _night_shift: { should_queue: false, scheduled_for: null, reason: 'auth_error' },
        _cost_save: { ai_model: AI_MODELS.economy, estimated_cost: 0, reason: 'auth_error' },
        _execution_path: { skip_policy: true, skip_hitl: true, skip_evidence: true, async_audit: true },
        payload: body,
      }];
    }
    
    // HMAC検証
    const bodyString = JSON.stringify(body);
    const expectedHmac = crypto
      .createHmac('sha256', hmacSecret)
      .update(timestamp + '.' + bodyString)
      .digest('hex');
    
    if (signature !== expectedHmac) {
      return [{
        _auth_passed: false,
        _auth_error: true,
        _error_code: 'HMAC_INVALID',
        _error_message: 'HMAC署名検証失敗',
        _tenant_id: tenantId,
        _request_id: `err-${Date.now()}`,
        _timestamp: new Date().toISOString(),
        _risk: { risk_level: 'LOW', skip_policy_validator: true, skip_hitl: true, skip_evidence: true, use_premium_model: false, execution_path: 'FAST' },
        _night_shift: { should_queue: false, scheduled_for: null, reason: 'auth_error' },
        _cost_save: { ai_model: AI_MODELS.economy, estimated_cost: 0, reason: 'auth_error' },
        _execution_path: { skip_policy: true, skip_hitl: true, skip_evidence: true, async_audit: true },
        payload: body,
      }];
    }
  }
  
  // =========================================================================
  // 2. Smart Risk-Leveling
  // =========================================================================
  
  const action = (body.action as string) || (body._action as string) || 'unknown';
  const amount = Number(body.amount || body.price || body.total_amount || 0);
  const batchSize = Number(body.batch_size || (body.items as unknown[])?.length || (body.product_ids as unknown[])?.length || 1);
  const isUrgent = Boolean(body.urgent || body.is_urgent || headers['x-urgent'] === 'true');
  
  const riskResult = determineRiskLevel(action, amount, batchSize);
  
  // =========================================================================
  // 3. Night-Shift 判定
  // =========================================================================
  
  const nightShiftDecision = determineNightShift(tenantId, isUrgent, riskResult.risk_level);
  
  // =========================================================================
  // 4. Cost-Save: AIモデル選択
  // =========================================================================
  
  const costSaveDecision = determineCostSave(riskResult.risk_level, riskResult.use_premium_model, amount);
  
  // =========================================================================
  // 5. 実行パス決定
  // =========================================================================
  
  const executionPath = {
    skip_policy: riskResult.skip_policy_validator,
    skip_hitl: riskResult.skip_hitl,
    skip_evidence: riskResult.skip_evidence,
    async_audit: RISK_LEVEL_CONFIG[riskResult.risk_level].async_audit,
  };
  
  // =========================================================================
  // 6. リクエストID生成
  // =========================================================================
  
  const requestId = `v821-${riskResult.risk_level.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // =========================================================================
  // 7. 認証成功レスポンス
  // =========================================================================
  
  return [{
    _auth_passed: true,
    _tenant_id: tenantId,
    _staff_id: staffId,
    _request_id: requestId,
    _timestamp: new Date().toISOString(),
    _risk: riskResult,
    _night_shift: nightShiftDecision,
    _cost_save: costSaveDecision,
    _execution_path: executionPath,
    payload: body,
  }];
}

// ============================================================================
// Smart Risk-Leveling
// ============================================================================

function determineRiskLevel(action: string, amount: number, batchSize: number): RiskLevelResult {
  let matchedRisk: keyof typeof RISK_LEVEL_CONFIG = 'MID';  // デフォルト
  
  for (const rule of ACTION_RISK_PATTERNS) {
    if (rule.pattern.test(action)) {
      // 金額閾値チェック
      if (rule.amount_threshold && amount > rule.amount_threshold) {
        // 閾値超過の場合、リスクを1段階上げる
        const riskOrder: Array<keyof typeof RISK_LEVEL_CONFIG> = ['LOW', 'MID', 'HIGH', 'CRITICAL'];
        const currentIndex = riskOrder.indexOf(rule.risk_level);
        matchedRisk = riskOrder[Math.min(currentIndex + 1, riskOrder.length - 1)];
        continue;
      }
      
      // バッチ閾値チェック
      if (rule.batch_threshold && batchSize > rule.batch_threshold) {
        const riskOrder: Array<keyof typeof RISK_LEVEL_CONFIG> = ['LOW', 'MID', 'HIGH', 'CRITICAL'];
        const currentIndex = riskOrder.indexOf(rule.risk_level);
        matchedRisk = riskOrder[Math.min(currentIndex + 1, riskOrder.length - 1)];
        continue;
      }
      
      matchedRisk = rule.risk_level;
      break;
    }
  }
  
  const config = RISK_LEVEL_CONFIG[matchedRisk];
  
  return {
    risk_level: matchedRisk,
    skip_policy_validator: config.skip_policy,
    skip_hitl: config.skip_hitl,
    skip_evidence: config.skip_evidence,
    use_premium_model: config.use_premium_model,
    execution_path: config.execution_path,
  };
}

// ============================================================================
// Night-Shift 判定
// ============================================================================

function determineNightShift(tenantId: string, isUrgent: boolean, riskLevel: string): NightShiftDecision {
  // 緊急フラグがある場合は即時実行
  if (isUrgent) {
    return {
      should_queue: false,
      scheduled_for: null,
      reason: 'urgent_flag',
    };
  }
  
  // CRITICALリスクは即時実行（遅延不可）
  if (riskLevel === 'CRITICAL') {
    return {
      should_queue: false,
      scheduled_for: null,
      reason: 'critical_risk_no_delay',
    };
  }
  
  // LOWリスクは常に即時実行（コスト影響小）
  if (riskLevel === 'LOW') {
    return {
      should_queue: false,
      scheduled_for: null,
      reason: 'low_risk_immediate',
    };
  }
  
  // Night-Shift設定を確認（実際はDBから取得）
  const nightShiftEnabled = process.env.NIGHT_SHIFT_ENABLED === 'true';
  const nightShiftStart = process.env.NIGHT_SHIFT_START || '02:00';
  const nightShiftEnd = process.env.NIGHT_SHIFT_END || '05:00';
  
  if (!nightShiftEnabled) {
    return {
      should_queue: false,
      scheduled_for: null,
      reason: 'night_shift_disabled',
    };
  }
  
  // 現在時刻がNight-Shift時間帯内かチェック
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;
  
  const [startHour, startMinute] = nightShiftStart.split(':').map(Number);
  const [endHour, endMinute] = nightShiftEnd.split(':').map(Number);
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  
  // Night-Shift時間帯内なら即時実行
  if (currentTime >= startTime && currentTime < endTime) {
    return {
      should_queue: false,
      scheduled_for: null,
      reason: 'within_night_shift',
    };
  }
  
  // Night-Shift時間帯外の場合、次の開始時刻にスケジュール
  const scheduledDate = new Date(now);
  if (currentTime >= endTime) {
    // 今日のNight-Shiftは終了済み、明日へ
    scheduledDate.setDate(scheduledDate.getDate() + 1);
  }
  scheduledDate.setHours(startHour, startMinute, 0, 0);
  
  // ランダムな分散（1-15分）を追加して負荷分散
  const randomOffset = Math.floor(Math.random() * 15) * 60 * 1000;
  const finalScheduled = new Date(scheduledDate.getTime() + randomOffset);
  
  return {
    should_queue: true,
    scheduled_for: finalScheduled.toISOString(),
    reason: 'scheduled_for_night_shift',
  };
}

// ============================================================================
// Cost-Save: AIモデル選択
// ============================================================================

function determineCostSave(riskLevel: string, usePremium: boolean, amount: number): CostSaveDecision {
  const costMode = process.env.COST_SAVE_MODE || 'balanced';
  
  let selectedModel: string;
  let reason: string;
  
  if (riskLevel === 'CRITICAL' || usePremium) {
    // CRITICAL or 明示的にPremium指定
    selectedModel = AI_MODELS.premium;
    reason = 'critical_or_premium_required';
  } else if (riskLevel === 'HIGH') {
    // HIGH: コストモードに応じて判断
    if (costMode === 'economy') {
      selectedModel = AI_MODELS.standard;
      reason = 'high_risk_economy_mode';
    } else {
      selectedModel = AI_MODELS.premium;
      reason = 'high_risk_premium';
    }
  } else if (riskLevel === 'MID') {
    // MID: 金額に応じて判断
    if (amount > 50000 && costMode !== 'economy') {
      selectedModel = AI_MODELS.premium;
      reason = 'mid_risk_high_amount';
    } else {
      selectedModel = AI_MODELS.standard;
      reason = 'mid_risk_standard';
    }
  } else {
    // LOW: 常にEconomyモデル
    selectedModel = costMode === 'performance' ? AI_MODELS.standard : AI_MODELS.economy;
    reason = 'low_risk_economy';
  }
  
  const estimatedCost = MODEL_COSTS[selectedModel as keyof typeof MODEL_COSTS] || 0.01;
  
  return {
    ai_model: selectedModel,
    estimated_cost: estimatedCost,
    reason,
  };
}

// ============================================================================
// n8n Code Node 用エクスポート
// ============================================================================

// n8n Code Node で使用する場合:
// const result = authGateV821($input.first().json);
// return result;

/**
 * n8n Code Node 用のラッパー関数
 * このコードをn8nのCode Nodeに貼り付けて使用
 */
const n8nAuthGateCode = `
// ============================================================================
// N3 Empire OS V8.2.1: 最適化済 Auth-Gate (n8n Code Node版)
// ============================================================================

const crypto = require('crypto');

const RISK_LEVEL_CONFIG = {
  LOW: { skip_policy: true, skip_hitl: true, skip_evidence: true, async_audit: true, execution_path: 'FAST', use_premium_model: false },
  MID: { skip_policy: false, skip_hitl: true, skip_evidence: false, async_audit: true, execution_path: 'STANDARD', use_premium_model: false },
  HIGH: { skip_policy: false, skip_hitl: false, skip_evidence: false, async_audit: true, execution_path: 'FULL_GUARD', use_premium_model: true },
  CRITICAL: { skip_policy: false, skip_hitl: false, skip_evidence: false, async_audit: false, execution_path: 'MAX_GUARD', use_premium_model: true },
};

const ACTION_RISK_PATTERNS = [
  { pattern: /^(read|get|list|search|status|check|fetch)\\./i, risk_level: 'LOW' },
  { pattern: /^(update|edit|create|add)\\./i, risk_level: 'MID' },
  { pattern: /^listing\\.single/i, risk_level: 'MID' },
  { pattern: /^(delete|remove)\\./i, risk_level: 'HIGH' },
  { pattern: /^listing\\.bulk/i, risk_level: 'HIGH' },
  { pattern: /^payment\\./i, risk_level: 'HIGH' },
  { pattern: /^payment\\.large/i, risk_level: 'CRITICAL' },
  { pattern: /^account\\.(delete|terminate)/i, risk_level: 'CRITICAL' },
];

const AI_MODELS = { premium: 'gpt-4o', standard: 'gpt-4o-mini', economy: 'gpt-3.5-turbo' };
const MODEL_COSTS = { 'gpt-4o': 0.03, 'gpt-4o-mini': 0.0015, 'gpt-3.5-turbo': 0.0005 };

// --- Main Logic ---
const body = $input.first().json.body || $input.first().json || {};
const headers = $input.first().json.headers || $request?.headers || {};

const tenantId = body.tenant_id || headers['x-tenant-id'] || $env.DEFAULT_TENANT_ID || 'default';
const staffId = body.staff_id || headers['x-staff-id'];
const signature = headers['x-n3-signature'];
const timestamp = headers['x-n3-timestamp'];
const hmacSecret = $env.N8N_HMAC_SECRET;

// HMAC検証
if (hmacSecret && signature && timestamp) {
  const tsAge = Date.now() - parseInt(timestamp);
  if (tsAge > 300000) return [{ json: { _auth_error: true, code: 'TIMESTAMP_EXPIRED', tenant_id: tenantId } }];
  const expected = crypto.createHmac('sha256', hmacSecret).update(timestamp + '.' + JSON.stringify(body)).digest('hex');
  if (signature !== expected) return [{ json: { _auth_error: true, code: 'HMAC_INVALID', tenant_id: tenantId } }];
}

// Risk-Leveling
const action = body.action || body._action || 'unknown';
const amount = Number(body.amount || body.price || 0);
const batchSize = Number(body.batch_size || body.items?.length || 1);
const isUrgent = Boolean(body.urgent || body.is_urgent);

let riskLevel = 'MID';
for (const rule of ACTION_RISK_PATTERNS) {
  if (rule.pattern.test(action)) {
    riskLevel = rule.risk_level;
    if (rule.amount_threshold && amount > rule.amount_threshold) {
      const order = ['LOW', 'MID', 'HIGH', 'CRITICAL'];
      riskLevel = order[Math.min(order.indexOf(riskLevel) + 1, 3)];
    }
    break;
  }
}

const config = RISK_LEVEL_CONFIG[riskLevel];

// Night-Shift
let nightShift = { should_queue: false, scheduled_for: null, reason: 'immediate' };
if (!isUrgent && riskLevel !== 'CRITICAL' && riskLevel !== 'LOW' && $env.NIGHT_SHIFT_ENABLED === 'true') {
  const now = new Date();
  const hour = now.getHours();
  const start = parseInt($env.NIGHT_SHIFT_START || '2');
  const end = parseInt($env.NIGHT_SHIFT_END || '5');
  if (hour < start || hour >= end) {
    const scheduled = new Date(now);
    if (hour >= end) scheduled.setDate(scheduled.getDate() + 1);
    scheduled.setHours(start, Math.floor(Math.random() * 15), 0, 0);
    nightShift = { should_queue: true, scheduled_for: scheduled.toISOString(), reason: 'night_shift' };
  }
}

// Cost-Save
const costMode = $env.COST_SAVE_MODE || 'balanced';
let aiModel = AI_MODELS.standard;
if (riskLevel === 'CRITICAL' || config.use_premium_model) aiModel = AI_MODELS.premium;
else if (riskLevel === 'LOW') aiModel = costMode === 'performance' ? AI_MODELS.standard : AI_MODELS.economy;

const requestId = \`v821-\${riskLevel.toLowerCase()}-\${Date.now()}-\${Math.random().toString(36).substr(2,9)}\`;

return [{ json: {
  _auth_passed: true,
  _tenant_id: tenantId,
  _staff_id: staffId,
  _request_id: requestId,
  _timestamp: new Date().toISOString(),
  _risk: {
    risk_level: riskLevel,
    skip_policy_validator: config.skip_policy,
    skip_hitl: config.skip_hitl,
    skip_evidence: config.skip_evidence,
    use_premium_model: config.use_premium_model,
    execution_path: config.execution_path
  },
  _night_shift: nightShift,
  _cost_save: { ai_model: aiModel, estimated_cost: MODEL_COSTS[aiModel], reason: costMode },
  _execution_path: {
    skip_policy: config.skip_policy,
    skip_hitl: config.skip_hitl,
    skip_evidence: config.skip_evidence,
    async_audit: config.async_audit
  },
  payload: body
} }];
`;

// ============================================================================
// エクスポート
// ============================================================================

module.exports = {
  authGateV821,
  determineRiskLevel,
  determineNightShift,
  determineCostSave,
  n8nAuthGateCode,
  RISK_LEVEL_CONFIG,
  ACTION_RISK_PATTERNS,
  AI_MODELS,
  MODEL_COSTS,
};
