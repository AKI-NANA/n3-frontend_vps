// lib/ai/self-healing-loop.ts
// ========================================
// 🔄 N3 Empire OS V8.2.1 - 再帰的セルフヒーリングループ
// 第3フェーズ：知能パッチ - 自律リトライ機能
// ========================================

import { SupabaseClient } from '@supabase/supabase-js';

// ========================================
// 型定義
// ========================================

export type HealingState = 
  | 'initial' | 'executing' | 'data_missing' | 'retrying' 
  | 'healed' | 'escalated' | 'failed';

export type DataGapType = 
  | 'product_not_found' | 'price_unavailable' | 'inventory_unknown'
  | 'api_error' | 'rate_limited' | 'authentication_expired'
  | 'partial_data' | 'external_service_down';

export interface HealingAction {
  type: 'retry_same' | 'retry_alternative' | 'fetch_external' | 'use_cache' | 'degrade' | 'escalate';
  target: string;
  params: Record<string, unknown>;
  delayMs?: number;
}

export interface SelfHealingConfig {
  maxRetries: number;
  retryDelayMs: number;
  retryDelayMultiplier: number;
  maxDelayMs: number;
  timeoutMs: number;
  allowCacheUsage: boolean;
  allowDegradedMode: boolean;
  alternativeApis: AlternativeApi[];
  escalationConditions: EscalationCondition[];
}

export interface AlternativeApi {
  originalApi: string;
  alternativeApi: string;
  priority: number;
  conditions?: { dataGapTypes?: DataGapType[]; maxRetryCount?: number; };
}

export interface EscalationCondition {
  dataGapType: DataGapType;
  retriesBeforeEscalation: number;
  reason: string;
}

export interface HealingResult {
  success: boolean;
  finalState: HealingState;
  actionsExecuted: HealingAction[];
  totalRetries: number;
  totalExecutionTimeMs: number;
  data: unknown;
  error?: string;
  escalatedToHitl: boolean;
  escalationReason?: string;
}

export type TaskExecutor<T> = (params: Record<string, unknown>) => Promise<{
  success: boolean;
  data?: T;
  error?: string;
  dataGapType?: DataGapType;
}>;

// ========================================
// デフォルト設定
// ========================================

export const DEFAULT_SELF_HEALING_CONFIG: SelfHealingConfig = {
  maxRetries: 3,
  retryDelayMs: 1000,
  retryDelayMultiplier: 2,
  maxDelayMs: 10000,
  timeoutMs: 60000,
  allowCacheUsage: true,
  allowDegradedMode: true,
  alternativeApis: [
    { originalApi: 'ebay-browse-api', alternativeApi: 'ebay-finding-api', priority: 1, conditions: { dataGapTypes: ['api_error', 'rate_limited'] } },
    { originalApi: 'ebay-browse-api', alternativeApi: 'web-scraping', priority: 2, conditions: { dataGapTypes: ['external_service_down'] } },
    { originalApi: 'keepa-api', alternativeApi: 'camelcamelcamel-api', priority: 1, conditions: { dataGapTypes: ['price_unavailable', 'rate_limited'] } },
    { originalApi: 'source-api', alternativeApi: 'web-scraping', priority: 1, conditions: { dataGapTypes: ['inventory_unknown'] } }
  ],
  escalationConditions: [
    { dataGapType: 'authentication_expired', retriesBeforeEscalation: 0, reason: 'API認証が切れています' },
    { dataGapType: 'external_service_down', retriesBeforeEscalation: 2, reason: '外部サービスが停止しています' }
  ]
};

// ========================================
// セルフヒーリングエンジンクラス
// ========================================

export class SelfHealingEngine<T = unknown> {
  private config: SelfHealingConfig;
  private state: HealingState = 'initial';
  private retryCount: number = 0;
  private actionsExecuted: HealingAction[] = [];
  private startTime: number = 0;
  
  constructor(config?: Partial<SelfHealingConfig>) {
    this.config = { ...DEFAULT_SELF_HEALING_CONFIG, ...config };
  }
  
  async execute(taskExecutor: TaskExecutor<T>, initialParams: Record<string, unknown>): Promise<HealingResult> {
    this.startTime = Date.now();
    this.state = 'executing';
    this.retryCount = 0;
    this.actionsExecuted = [];
    
    let currentParams = { ...initialParams };
    let lastError: string | undefined;
    let lastDataGapType: DataGapType | undefined;
    let data: T | undefined;
    
    while (this.retryCount <= this.config.maxRetries) {
      if (Date.now() - this.startTime > this.config.timeoutMs) {
        return this.createResult(false, data, 'Timeout exceeded', false);
      }
      
      try {
        const result = await taskExecutor(currentParams);
        
        if (result.success && result.data !== undefined) {
          this.state = this.retryCount > 0 ? 'healed' : 'initial';
          data = result.data;
          break;
        }
        
        this.state = 'data_missing';
        lastError = result.error;
        lastDataGapType = result.dataGapType;
        
        const escalation = this.checkEscalation(lastDataGapType, this.retryCount);
        if (escalation) {
          this.state = 'escalated';
          return this.createResult(false, data, lastError, true, escalation.reason);
        }
        
        const action = this.determineAction(lastDataGapType, this.retryCount, currentParams);
        if (!action) break;
        
        this.actionsExecuted.push(action);
        currentParams = this.applyAction(action, currentParams);
        
        if (action.delayMs) await this.delay(action.delayMs);
        
        this.retryCount++;
        this.state = 'retrying';
        
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        this.retryCount++;
      }
    }
    
    const success = data !== undefined;
    if (!success && this.state !== 'escalated') this.state = 'failed';
    
    return this.createResult(success, data, lastError, false);
  }
  
  private checkEscalation(dataGapType: DataGapType | undefined, retryCount: number): EscalationCondition | null {
    if (!dataGapType) return null;
    return this.config.escalationConditions.find(c => 
      c.dataGapType === dataGapType && retryCount >= c.retriesBeforeEscalation
    ) || null;
  }
  
  private determineAction(dataGapType: DataGapType | undefined, retryCount: number, params: Record<string, unknown>): HealingAction | null {
    const delay = Math.min(this.config.retryDelayMs * Math.pow(this.config.retryDelayMultiplier, retryCount), this.config.maxDelayMs);
    
    if (!dataGapType) {
      return { type: 'retry_same', target: 'original', params: {}, delayMs: delay };
    }
    
    const currentApi = params._currentApi as string || 'original';
    const alternative = this.config.alternativeApis
      .filter(a => (a.originalApi === currentApi || currentApi === 'original') && 
                   (!a.conditions?.dataGapTypes || a.conditions.dataGapTypes.includes(dataGapType)))
      .sort((a, b) => a.priority - b.priority)[0];
    
    if (alternative) {
      return { type: 'retry_alternative', target: alternative.alternativeApi, params: { _currentApi: alternative.alternativeApi }, delayMs: delay };
    }
    
    if (this.config.allowCacheUsage && ['api_error', 'external_service_down', 'rate_limited'].includes(dataGapType)) {
      return { type: 'use_cache', target: 'cache', params: { _useCache: true }, delayMs: 0 };
    }
    
    if (this.config.allowDegradedMode && retryCount >= this.config.maxRetries - 1) {
      return { type: 'degrade', target: 'degraded', params: { _degradedMode: true }, delayMs: 0 };
    }
    
    if (retryCount < this.config.maxRetries) {
      return { type: 'retry_same', target: 'original', params: {}, delayMs: delay };
    }
    
    return null;
  }
  
  private applyAction(action: HealingAction, params: Record<string, unknown>): Record<string, unknown> {
    return { ...params, ...action.params };
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  private createResult(success: boolean, data: unknown, error: string | undefined, escalated: boolean, escalationReason?: string): HealingResult {
    return {
      success, finalState: this.state, actionsExecuted: this.actionsExecuted,
      totalRetries: this.retryCount, totalExecutionTimeMs: Date.now() - this.startTime,
      data, error, escalatedToHitl: escalated, escalationReason
    };
  }
}

// ========================================
// n8n用テンプレート
// ========================================

export const N8N_SELF_HEALING_WRAPPER = `
// ========================================
// N3 Empire OS V8.2.1 - Self-Healing Wrapper
// MAIN-LOGICを包むセルフヒーリングラッパー
// ========================================

const input = $input.first().json;
const auth_context = input.auth_context || {};

// 設定
const CONFIG = {
  maxRetries: 3,
  retryDelayMs: 1000,
  retryDelayMultiplier: 2,
  maxDelayMs: 10000,
  timeoutMs: 60000
};

// データ不足タイプ判定
function detectDataGap(error, response) {
  const msg = (error?.message || error || '').toLowerCase();
  if (msg.includes('not found') || msg.includes('404')) return 'product_not_found';
  if (msg.includes('rate limit') || msg.includes('429')) return 'rate_limited';
  if (msg.includes('auth') || msg.includes('401') || msg.includes('403')) return 'authentication_expired';
  if (msg.includes('timeout') || msg.includes('503')) return 'external_service_down';
  if (!response || (Array.isArray(response) && response.length === 0)) return 'partial_data';
  return 'api_error';
}

// 代替API選択
function selectAlternative(currentApi, gapType) {
  const ALTERNATIVES = {
    'ebay-browse': { 'api_error': 'ebay-finding', 'rate_limited': 'ebay-finding' },
    'keepa': { 'price_unavailable': 'camelcamel', 'rate_limited': 'web-scraping' },
    'source-api': { 'inventory_unknown': 'web-scraping' }
  };
  return ALTERNATIVES[currentApi]?.[gapType] || null;
}

// 遅延計算（指数バックオフ）
function calculateDelay(retryCount) {
  return Math.min(CONFIG.retryDelayMs * Math.pow(CONFIG.retryDelayMultiplier, retryCount), CONFIG.maxDelayMs);
}

// 待機
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// メイン処理（セルフヒーリングラップ）
let retryCount = 0;
let lastError = null;
let lastGapType = null;
let result = null;
let healed = false;
let escalated = false;
let escalationReason = null;
const actionsExecuted = [];
const startTime = Date.now();

// {{MAIN_LOGIC_FUNCTION}} は実際のメインロジック関数に置換
async function executeMainLogic(params) {
  // ここにメインロジックを配置
  {{MAIN_LOGIC_PLACEHOLDER}}
}

let currentParams = { ...input };

while (retryCount <= CONFIG.maxRetries) {
  // タイムアウトチェック
  if (Date.now() - startTime > CONFIG.timeoutMs) {
    lastError = 'Self-healing timeout exceeded';
    break;
  }
  
  try {
    result = await executeMainLogic(currentParams);
    
    if (result && result.success !== false) {
      healed = retryCount > 0;
      break;
    }
    
    lastError = result?.error || 'Unknown error';
    lastGapType = detectDataGap(lastError, result?.data);
    
    // 認証切れは即時エスカレーション
    if (lastGapType === 'authentication_expired') {
      escalated = true;
      escalationReason = 'API認証が切れています。トークンの更新が必要です。';
      break;
    }
    
    // 外部サービス停止は2回リトライ後にエスカレーション
    if (lastGapType === 'external_service_down' && retryCount >= 2) {
      escalated = true;
      escalationReason = '外部サービスが停止しています。';
      break;
    }
    
    // 代替APIを試す
    const currentApi = currentParams._currentApi || 'original';
    const alternative = selectAlternative(currentApi, lastGapType);
    
    if (alternative) {
      actionsExecuted.push({ type: 'retry_alternative', target: alternative });
      currentParams = { ...currentParams, _currentApi: alternative };
    } else if (retryCount < CONFIG.maxRetries) {
      actionsExecuted.push({ type: 'retry_same', target: 'original' });
    } else {
      break;
    }
    
    await delay(calculateDelay(retryCount));
    retryCount++;
    
  } catch (error) {
    lastError = error.message || 'Unknown error';
    lastGapType = detectDataGap(lastError, null);
    retryCount++;
  }
}

const executionTimeMs = Date.now() - startTime;

// ヒーリング結果をログ
if (retryCount > 0) {
  await $http.request({
    method: 'POST',
    url: $env.SUPABASE_URL + '/rest/v1/core.audit_logs',
    headers: {
      'apikey': $env.SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY,
      'Content-Type': 'application/json'
    },
    body: {
      tenant_id: auth_context.tenant_id || '0',
      event_type: 'self_healing',
      event_category: 'system',
      event_source: 'n8n',
      details: {
        retries: retryCount,
        healed,
        escalated,
        gap_type: lastGapType,
        actions: actionsExecuted
      },
      status: (result && result.success !== false) ? 'success' : 'error',
      error_message: lastError,
      duration_ms: executionTimeMs,
      source_workflow_id: $workflow.id,
      source_execution_id: $execution.id
    }
  }).catch(() => {});
}

return [{
  json: {
    ...input,
    _healing_result: {
      success: result && result.success !== false,
      healed,
      escalated,
      escalation_reason: escalationReason,
      retries: retryCount,
      gap_type: lastGapType,
      actions: actionsExecuted,
      execution_time_ms: executionTimeMs
    },
    _requires_hitl: escalated,
    _hitl_reason: escalationReason,
    result: result?.data || result
  }
}];
`;

// ========================================
// V8.2.1金型への統合コード
// ========================================

export const V821_SELF_HEALING_INTEGRATION = `
// ========================================
// V8.2.1 Self-Healing統合 - MAIN-LOGIC包囲
// ========================================

// 元のMAIN-LOGICコードを関数化
async function originalMainLogic(input) {
  {{ORIGINAL_MAIN_LOGIC}}
}

// セルフヒーリングラッパーで包む
const healingConfig = {
  maxRetries: 3,
  retryDelayMs: 1000,
  retryDelayMultiplier: 2
};

async function executeWithHealing(input) {
  let retryCount = 0;
  let result = null;
  let healed = false;
  
  while (retryCount <= healingConfig.maxRetries) {
    try {
      result = await originalMainLogic(input);
      
      // 成功判定
      if (result && !result._needs_retry) {
        healed = retryCount > 0;
        return { ...result, _healed: healed, _retries: retryCount };
      }
      
      // リトライ必要
      const delayMs = healingConfig.retryDelayMs * Math.pow(healingConfig.retryDelayMultiplier, retryCount);
      await new Promise(r => setTimeout(r, delayMs));
      retryCount++;
      
    } catch (error) {
      if (retryCount >= healingConfig.maxRetries) {
        return { success: false, error: error.message, _retries: retryCount };
      }
      retryCount++;
    }
  }
  
  return result || { success: false, error: 'Max retries exceeded' };
}

// 実行
return [{ json: await executeWithHealing($input.first().json) }];
`;

// ========================================
// エクスポート
// ========================================

export function createSelfHealingEngine<T>(config?: Partial<SelfHealingConfig>): SelfHealingEngine<T> {
  return new SelfHealingEngine<T>(config);
}

export default {
  SelfHealingEngine,
  createSelfHealingEngine,
  DEFAULT_SELF_HEALING_CONFIG,
  N8N_SELF_HEALING_WRAPPER,
  V821_SELF_HEALING_INTEGRATION
};
