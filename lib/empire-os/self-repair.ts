// ========================================
// N3 Empire OS V8 - Self-Repair Engine
// 自律修復エンジン：エラー検知と自動リトライ
// ========================================

import { supabase } from '@/lib/supabase/client';

// ========================================
// 型定義
// ========================================

export interface RepairContext {
  tenant_id: string;
  feature_code: string;
  tool_id?: string;
  original_error: ErrorInfo;
  repair_attempt: number;
  max_attempts: number;
  started_at: string;
}

export interface ErrorInfo {
  code: string;
  message: string;
  stack?: string;
  response_status?: number;
  response_body?: string;
  context?: Record<string, any>;
}

export interface RepairStrategy {
  name: string;
  description: string;
  applicable_errors: string[];
  repair_function: (context: RepairContext, params: any) => Promise<RepairResult>;
  max_attempts: number;
  delay_ms: number;
  exponential_backoff: boolean;
}

export interface RepairResult {
  success: boolean;
  repaired_data?: any;
  new_error?: ErrorInfo;
  strategy_used: string;
  duration_ms: number;
  should_retry: boolean;
  retry_delay_ms?: number;
  notes?: string;
}

export interface RepairLog {
  id: string;
  tenant_id: string;
  feature_code: string;
  original_error: ErrorInfo;
  repair_attempts: RepairAttempt[];
  final_status: 'repaired' | 'failed' | 'escalated';
  total_duration_ms: number;
  created_at: string;
}

export interface RepairAttempt {
  attempt_number: number;
  strategy_name: string;
  started_at: string;
  ended_at: string;
  success: boolean;
  notes?: string;
}

// ========================================
// エラーパターン定義
// ========================================

export const ERROR_PATTERNS = {
  // eBay API エラー
  EBAY_AUTH_EXPIRED: /token.*expired|invalid.*token|auth.*failed/i,
  EBAY_RATE_LIMIT: /rate.*limit|too.*many.*requests|429/i,
  EBAY_ITEM_NOT_FOUND: /item.*not.*found|invalid.*item.*id/i,
  EBAY_POLICY_VIOLATION: /policy.*violation|listing.*violation/i,
  
  // Supabase/DB エラー
  DB_CONNECTION: /connection.*refused|ECONNREFUSED|timeout/i,
  DB_DUPLICATE: /duplicate.*key|unique.*constraint/i,
  DB_NOT_FOUND: /no.*rows.*returned|record.*not.*found/i,
  
  // ネットワークエラー
  NETWORK_TIMEOUT: /timeout|ETIMEDOUT|network.*error/i,
  NETWORK_DNS: /ENOTFOUND|DNS.*failed/i,
  
  // バリデーションエラー
  VALIDATION_REQUIRED: /required.*field|missing.*parameter/i,
  VALIDATION_FORMAT: /invalid.*format|validation.*failed/i,
  
  // 外部API エラー
  EXTERNAL_API_ERROR: /external.*api|third.*party.*error/i,
  EXTERNAL_API_UNAVAILABLE: /service.*unavailable|503/i,
};

// ========================================
// 修復戦略定義
// ========================================

export const REPAIR_STRATEGIES: Record<string, RepairStrategy> = {
  // eBay認証リフレッシュ
  ebay_auth_refresh: {
    name: 'eBay認証リフレッシュ',
    description: 'eBayトークンを再取得してリトライ',
    applicable_errors: ['EBAY_AUTH_EXPIRED'],
    max_attempts: 2,
    delay_ms: 1000,
    exponential_backoff: false,
    repair_function: async (context, params) => {
      const startTime = Date.now();
      
      try {
        // トークンリフレッシュAPI呼び出し
        const response = await fetch('/api/ebay/refresh-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            account: params.account || 'default',
            tenant_id: context.tenant_id,
          }),
        });
        
        if (response.ok) {
          return {
            success: true,
            strategy_used: 'ebay_auth_refresh',
            duration_ms: Date.now() - startTime,
            should_retry: true,
            notes: 'トークンをリフレッシュしました',
          };
        }
        
        return {
          success: false,
          strategy_used: 'ebay_auth_refresh',
          duration_ms: Date.now() - startTime,
          should_retry: false,
          notes: 'トークンリフレッシュに失敗しました',
        };
        
      } catch (error) {
        return {
          success: false,
          strategy_used: 'ebay_auth_refresh',
          duration_ms: Date.now() - startTime,
          should_retry: false,
          new_error: {
            code: 'REPAIR_FAILED',
            message: String(error),
          },
        };
      }
    },
  },
  
  // レートリミット待機
  rate_limit_wait: {
    name: 'レートリミット待機',
    description: '指定時間待機後にリトライ',
    applicable_errors: ['EBAY_RATE_LIMIT'],
    max_attempts: 3,
    delay_ms: 5000,
    exponential_backoff: true,
    repair_function: async (context, params) => {
      const startTime = Date.now();
      const baseDelay = params.base_delay || 5000;
      const delay = baseDelay * Math.pow(2, context.repair_attempt - 1);
      
      // 待機
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return {
        success: true,
        strategy_used: 'rate_limit_wait',
        duration_ms: Date.now() - startTime,
        should_retry: true,
        retry_delay_ms: 0, // 既に待機済み
        notes: `${delay}ms待機しました`,
      };
    },
  },
  
  // DB接続リトライ
  db_reconnect: {
    name: 'DB再接続',
    description: 'データベース接続を再確立してリトライ',
    applicable_errors: ['DB_CONNECTION'],
    max_attempts: 3,
    delay_ms: 2000,
    exponential_backoff: true,
    repair_function: async (context, params) => {
      const startTime = Date.now();
      
      try {
        // Supabase接続テスト
        const { data, error } = await supabase.from('core.tenants').select('count').limit(1);
        
        if (!error) {
          return {
            success: true,
            strategy_used: 'db_reconnect',
            duration_ms: Date.now() - startTime,
            should_retry: true,
            notes: 'DB接続を確認しました',
          };
        }
        
        return {
          success: false,
          strategy_used: 'db_reconnect',
          duration_ms: Date.now() - startTime,
          should_retry: context.repair_attempt < context.max_attempts,
          retry_delay_ms: 2000 * Math.pow(2, context.repair_attempt),
          notes: 'DB接続に失敗しました',
        };
        
      } catch (error) {
        return {
          success: false,
          strategy_used: 'db_reconnect',
          duration_ms: Date.now() - startTime,
          should_retry: context.repair_attempt < context.max_attempts,
          new_error: {
            code: 'DB_RECONNECT_FAILED',
            message: String(error),
          },
        };
      }
    },
  },
  
  // 重複エラースキップ
  duplicate_skip: {
    name: '重複スキップ',
    description: '既存レコードを使用して続行',
    applicable_errors: ['DB_DUPLICATE'],
    max_attempts: 1,
    delay_ms: 0,
    exponential_backoff: false,
    repair_function: async (context, params) => {
      const startTime = Date.now();
      
      // 既存レコードを取得して返す
      if (params.table && params.unique_key && params.unique_value) {
        try {
          const { data, error } = await supabase
            .from(params.table)
            .select('*')
            .eq(params.unique_key, params.unique_value)
            .single();
          
          if (data && !error) {
            return {
              success: true,
              repaired_data: data,
              strategy_used: 'duplicate_skip',
              duration_ms: Date.now() - startTime,
              should_retry: false,
              notes: '既存レコードを使用します',
            };
          }
        } catch (e) {
          // 無視
        }
      }
      
      return {
        success: true,
        strategy_used: 'duplicate_skip',
        duration_ms: Date.now() - startTime,
        should_retry: false,
        notes: '重複をスキップしました',
      };
    },
  },
  
  // デフォルト値適用
  apply_defaults: {
    name: 'デフォルト値適用',
    description: '欠損フィールドにデフォルト値を適用',
    applicable_errors: ['VALIDATION_REQUIRED'],
    max_attempts: 1,
    delay_ms: 0,
    exponential_backoff: false,
    repair_function: async (context, params) => {
      const startTime = Date.now();
      
      if (params.original_data && params.defaults) {
        const repairedData = {
          ...params.defaults,
          ...params.original_data,
        };
        
        return {
          success: true,
          repaired_data: repairedData,
          strategy_used: 'apply_defaults',
          duration_ms: Date.now() - startTime,
          should_retry: true,
          notes: 'デフォルト値を適用しました',
        };
      }
      
      return {
        success: false,
        strategy_used: 'apply_defaults',
        duration_ms: Date.now() - startTime,
        should_retry: false,
        notes: 'デフォルト値の適用に失敗しました',
      };
    },
  },
  
  // ネットワークリトライ
  network_retry: {
    name: 'ネットワークリトライ',
    description: 'ネットワークエラー時の自動リトライ',
    applicable_errors: ['NETWORK_TIMEOUT', 'NETWORK_DNS', 'EXTERNAL_API_UNAVAILABLE'],
    max_attempts: 3,
    delay_ms: 3000,
    exponential_backoff: true,
    repair_function: async (context, params) => {
      const startTime = Date.now();
      const delay = 3000 * Math.pow(2, context.repair_attempt - 1);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return {
        success: true,
        strategy_used: 'network_retry',
        duration_ms: Date.now() - startTime,
        should_retry: true,
        notes: `${delay}ms後にリトライします`,
      };
    },
  },
};

// ========================================
// Self-Repair Engine クラス
// ========================================

export class SelfRepairEngine {
  private static instance: SelfRepairEngine;
  private repairHistory: Map<string, RepairLog[]> = new Map();
  
  private constructor() {}
  
  static getInstance(): SelfRepairEngine {
    if (!SelfRepairEngine.instance) {
      SelfRepairEngine.instance = new SelfRepairEngine();
    }
    return SelfRepairEngine.instance;
  }
  
  /**
   * エラーを分析して修復戦略を選択
   */
  analyzeError(error: ErrorInfo): string[] {
    const matchedPatterns: string[] = [];
    const errorText = `${error.code} ${error.message} ${error.response_body || ''}`;
    
    for (const [patternName, pattern] of Object.entries(ERROR_PATTERNS)) {
      if (pattern.test(errorText)) {
        matchedPatterns.push(patternName);
      }
    }
    
    return matchedPatterns;
  }
  
  /**
   * 適切な修復戦略を取得
   */
  getRepairStrategies(errorPatterns: string[]): RepairStrategy[] {
    const strategies: RepairStrategy[] = [];
    
    for (const strategy of Object.values(REPAIR_STRATEGIES)) {
      const hasMatch = strategy.applicable_errors.some(e => errorPatterns.includes(e));
      if (hasMatch) {
        strategies.push(strategy);
      }
    }
    
    // 優先度順にソート（max_attemptsが少ない = 軽い修復から試行）
    return strategies.sort((a, b) => a.max_attempts - b.max_attempts);
  }
  
  /**
   * 自動修復を試行
   */
  async attemptRepair(
    error: ErrorInfo,
    options: {
      tenant_id: string;
      feature_code: string;
      tool_id?: string;
      params?: Record<string, any>;
      max_total_attempts?: number;
    }
  ): Promise<RepairResult & { repair_log?: RepairLog }> {
    const startTime = Date.now();
    const errorPatterns = this.analyzeError(error);
    const strategies = this.getRepairStrategies(errorPatterns);
    
    if (strategies.length === 0) {
      return {
        success: false,
        strategy_used: 'none',
        duration_ms: Date.now() - startTime,
        should_retry: false,
        notes: '適用可能な修復戦略がありません',
      };
    }
    
    const repairLog: RepairLog = {
      id: crypto.randomUUID(),
      tenant_id: options.tenant_id,
      feature_code: options.feature_code,
      original_error: error,
      repair_attempts: [],
      final_status: 'failed',
      total_duration_ms: 0,
      created_at: new Date().toISOString(),
    };
    
    const maxTotalAttempts = options.max_total_attempts || 5;
    let totalAttempts = 0;
    
    for (const strategy of strategies) {
      if (totalAttempts >= maxTotalAttempts) break;
      
      for (let attempt = 1; attempt <= strategy.max_attempts; attempt++) {
        if (totalAttempts >= maxTotalAttempts) break;
        
        totalAttempts++;
        
        const context: RepairContext = {
          tenant_id: options.tenant_id,
          feature_code: options.feature_code,
          tool_id: options.tool_id,
          original_error: error,
          repair_attempt: attempt,
          max_attempts: strategy.max_attempts,
          started_at: new Date().toISOString(),
        };
        
        const attemptStart = new Date().toISOString();
        
        try {
          const result = await strategy.repair_function(context, options.params || {});
          
          repairLog.repair_attempts.push({
            attempt_number: totalAttempts,
            strategy_name: strategy.name,
            started_at: attemptStart,
            ended_at: new Date().toISOString(),
            success: result.success,
            notes: result.notes,
          });
          
          if (result.success) {
            repairLog.final_status = 'repaired';
            repairLog.total_duration_ms = Date.now() - startTime;
            
            // 修復ログ保存
            await this.saveRepairLog(repairLog);
            
            return {
              ...result,
              repair_log: repairLog,
            };
          }
          
          // 遅延
          if (result.should_retry && strategy.exponential_backoff) {
            const delay = strategy.delay_ms * Math.pow(2, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
        } catch (e) {
          repairLog.repair_attempts.push({
            attempt_number: totalAttempts,
            strategy_name: strategy.name,
            started_at: attemptStart,
            ended_at: new Date().toISOString(),
            success: false,
            notes: `例外発生: ${String(e)}`,
          });
        }
      }
    }
    
    repairLog.final_status = 'escalated';
    repairLog.total_duration_ms = Date.now() - startTime;
    
    // 修復ログ保存
    await this.saveRepairLog(repairLog);
    
    return {
      success: false,
      strategy_used: 'multiple',
      duration_ms: repairLog.total_duration_ms,
      should_retry: false,
      notes: `全${totalAttempts}回の修復試行が失敗しました`,
      repair_log: repairLog,
    };
  }
  
  /**
   * 修復ログ保存
   */
  private async saveRepairLog(log: RepairLog): Promise<void> {
    try {
      // メモリキャッシュ
      const tenantLogs = this.repairHistory.get(log.tenant_id) || [];
      tenantLogs.push(log);
      if (tenantLogs.length > 100) tenantLogs.shift();
      this.repairHistory.set(log.tenant_id, tenantLogs);
      
      // DB保存（オプション）
      // await supabase.from('core.repair_logs').insert(log);
      
    } catch (error) {
      console.error('[SelfRepair] Log save error:', error);
    }
  }
  
  /**
   * 修復履歴取得
   */
  getRepairHistory(tenantId: string): RepairLog[] {
    return this.repairHistory.get(tenantId) || [];
  }
}

// ========================================
// シングルトンエクスポート
// ========================================

export const selfRepairEngine = SelfRepairEngine.getInstance();

// ========================================
// ユーティリティ関数
// ========================================

/**
 * 自動修復付き関数ラッパー
 */
export async function withSelfRepair<T>(
  fn: () => Promise<T>,
  options: {
    tenant_id: string;
    feature_code: string;
    tool_id?: string;
    params?: Record<string, any>;
    max_retries?: number;
  }
): Promise<{ success: boolean; data?: T; error?: ErrorInfo; repair_log?: RepairLog }> {
  const maxRetries = options.max_retries || 3;
  let lastError: ErrorInfo | undefined;
  
  for (let retry = 0; retry <= maxRetries; retry++) {
    try {
      const result = await fn();
      return { success: true, data: result };
      
    } catch (error) {
      lastError = {
        code: (error as any)?.code || 'UNKNOWN',
        message: String(error),
        stack: (error as Error)?.stack,
      };
      
      if (retry < maxRetries) {
        const repairResult = await selfRepairEngine.attemptRepair(lastError, options);
        
        if (repairResult.success && repairResult.should_retry) {
          // リトライ遅延
          if (repairResult.retry_delay_ms) {
            await new Promise(resolve => setTimeout(resolve, repairResult.retry_delay_ms));
          }
          continue;
        }
        
        if (!repairResult.should_retry) {
          return {
            success: false,
            error: lastError,
            repair_log: repairResult.repair_log,
          };
        }
      }
    }
  }
  
  return { success: false, error: lastError };
}

// ========================================
// n8n用テンプレート
// ========================================

export const N8N_SELF_REPAIR_TEMPLATE = `
// ========================================
// N3 Empire OS V8 - Self-Repair ノード
// エラーハンドリングブランチに配置
// ========================================

const error = $input.first().json.error || $input.first().json;
const context = $input.first().json.auth_context || {};

// エラーパターン分析
const patterns = {
  EBAY_AUTH: /token.*expired|invalid.*token/i,
  RATE_LIMIT: /rate.*limit|429/i,
  DB_ERROR: /connection.*refused|timeout/i,
  NETWORK: /ETIMEDOUT|network.*error/i,
};

let errorType = 'UNKNOWN';
const errorMessage = error.message || String(error);

for (const [type, pattern] of Object.entries(patterns)) {
  if (pattern.test(errorMessage)) {
    errorType = type;
    break;
  }
}

// 修復戦略選択
const strategies = {
  EBAY_AUTH: { action: 'refresh_token', delay: 1000, max_retry: 2 },
  RATE_LIMIT: { action: 'wait_and_retry', delay: 5000, max_retry: 3 },
  DB_ERROR: { action: 'reconnect', delay: 2000, max_retry: 3 },
  NETWORK: { action: 'retry', delay: 3000, max_retry: 3 },
  UNKNOWN: { action: 'escalate', delay: 0, max_retry: 0 },
};

const strategy = strategies[errorType] || strategies.UNKNOWN;
const currentAttempt = ($json.repair_attempt || 0) + 1;

if (currentAttempt > strategy.max_retry) {
  // エスカレーション
  return [{
    json: {
      error: true,
      escalated: true,
      original_error: error,
      repair_attempts: currentAttempt - 1,
      message: '自動修復の上限に達しました。手動確認が必要です。',
    }
  }];
}

// 修復アクション出力
return [{
  json: {
    repair_action: strategy.action,
    error_type: errorType,
    repair_attempt: currentAttempt,
    delay_ms: strategy.delay * Math.pow(2, currentAttempt - 1),
    original_error: error,
    context,
  }
}];
`;

export default SelfRepairEngine;
