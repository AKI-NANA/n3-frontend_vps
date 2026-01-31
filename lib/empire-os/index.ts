// ========================================
// N3 Empire OS V8.2.1 - Central Entry Point
// 全モジュールの統合エントリーポイント
// ========================================

// ========================================
// Core Modules
// ========================================

export * from './auth-gate';
export * from './self-repair';
export * from './ui-config-master';

// ========================================
// Phase 2: Guardian Modules
// ========================================

export * from './identity-manager';
export * from './policy-validator';
export * from './human-in-the-loop';

// ========================================
// Phase 2.1: UI API Policies【V8.2.1新規】
// ========================================

export * from './ui-api-policies';

// ========================================
// Re-exports
// ========================================

import { GlobalAuthGate, authGate, checkAuth, useAuthGate, DEFAULT_PLANS, N8N_AUTH_GATE_TEMPLATE } from './auth-gate';
import { SelfRepairEngine, selfRepairEngine, withSelfRepair, ERROR_PATTERNS, REPAIR_STRATEGIES, N8N_SELF_REPAIR_TEMPLATE } from './self-repair';
import { 
  UI_CONFIG_MASTER, 
  TOOL_UI_CONFIGS, 
  DEFAULT_GLOBAL_SETTINGS, 
  DEFAULT_THEME,
  getToolConfig,
  filterTabsByPlan,
  filterActionsByPlanAndFeatures,
  groupToolsByCategory,
} from './ui-config-master';

// Phase 2 imports
import IdentityManager, {
  N8N_IDENTITY_MANAGER_TEMPLATE,
  N8N_IDENTITY_HTTP_WRAPPER_TEMPLATE,
  generateFingerprintConfig,
  buildIdentityContext,
  checkProfileHealth,
} from './identity-manager';

import PolicyValidator, {
  N8N_POLICY_VALIDATOR_TEMPLATE,
  N8N_ROBOTS_CHECK_TEMPLATE,
  validateContent,
  parseRobotsTxt,
  checkRobotsTxt,
  SYSTEM_RULES,
} from './policy-validator';

import HumanInTheLoop, {
  N8N_CREATE_APPROVAL_TEMPLATE,
  N8N_WAIT_FOR_APPROVAL_TEMPLATE,
  N8N_PROCESS_APPROVAL_RESULT_TEMPLATE,
  N8N_APPROVAL_BRANCH_TEMPLATE,
  createApprovalRequest,
  processDecision,
  getPendingActions,
} from './human-in-the-loop';

// Phase 2.1 imports【V8.2.1新規】
import UIAPIPolicies, {
  AIDecisionTracesAPI,
  APIConsumptionLimitsAPI,
  CategoryQuotaOptimizerAPI,
  createUIAPIs,
  N8N_CATEGORY_QUOTA_CHECK,
} from './ui-api-policies';

// ========================================
// Type Re-exports
// ========================================

export type {
  PlanConfig,
  PlanFeatures,
  PlanLimits,
  TenantSession,
  AuthGateRequest,
  AuthGateResult,
  QuotaInfo,
  AuthDenialCode,
} from './auth-gate';

export type {
  RepairContext,
  ErrorInfo,
  RepairStrategy,
  RepairResult,
  RepairLog,
  RepairAttempt,
} from './self-repair';

export type {
  UIConfigMaster,
  ToolUIConfig,
  TabConfig,
  ActionConfig,
  FilterConfig,
  ColumnConfig,
  GlobalUISettings,
  ThemeConfig,
  ToolCategory,
} from './ui-config-master';

// Phase 2 types
export type {
  BrowserProfile,
  ProxyConfig,
  FingerprintConfig,
  IdentityContext,
  HealthCheckResult,
} from './identity-manager';

export type {
  PolicyRule,
  ValidationResult,
  ViolationDetail,
  RuleCategory,
  Severity,
  ValidationAction,
  RobotsTxtResult,
} from './policy-validator';

export type {
  PendingAction,
  ApprovalRequest,
  ApprovalResponse,
  DecisionRequest,
  DecisionResponse,
  ActionStatus,
  ActionType,
} from './human-in-the-loop';

// Phase 2.1 types【V8.2.1新規】
export type {
  AIDecisionTrace,
  APIConsumptionLimit,
  CategoryListingQuota,
  NightShiftQueueItem,
} from './ui-api-policies';

// ========================================
// Default Export: 統合インターフェース
// ========================================

const EmpireOS = {
  // Version【V8.2.1更新】
  version: '8.2.1', // Phase 2.1 update
  
  // Auth Gate
  AuthGate: GlobalAuthGate,
  authGate,
  checkAuth,
  useAuthGate,
  plans: DEFAULT_PLANS,
  
  // Self Repair
  SelfRepair: SelfRepairEngine,
  selfRepairEngine,
  withSelfRepair,
  errorPatterns: ERROR_PATTERNS,
  repairStrategies: REPAIR_STRATEGIES,
  
  // UI Config
  uiConfig: UI_CONFIG_MASTER,
  toolConfigs: TOOL_UI_CONFIGS,
  globalSettings: DEFAULT_GLOBAL_SETTINGS,
  theme: DEFAULT_THEME,
  getToolConfig,
  filterTabsByPlan,
  filterActionsByPlanAndFeatures,
  groupToolsByCategory,
  
  // Phase 2: Identity Manager (ブラウザプロファイル・プロキシ管理)
  Identity: IdentityManager,
  generateFingerprint: generateFingerprintConfig,
  buildIdentity: buildIdentityContext,
  checkIdentityHealth: checkProfileHealth,
  
  // Phase 2: Policy Validator (ポリシー検閲・法的リスク検知)
  Policy: PolicyValidator,
  validatePolicy: validateContent,
  checkRobots: checkRobotsTxt,
  parseRobots: parseRobotsTxt,
  systemRules: SYSTEM_RULES,
  
  // Phase 2: Human-in-the-Loop (承認キュー)
  HitL: HumanInTheLoop,
  createApproval: createApprovalRequest,
  processApproval: processDecision,
  getPendingApprovals: getPendingActions,
  
  // Phase 2.1: UI API Policies【V8.2.1新規】
  UIAPI: UIAPIPolicies,
  createUIAPIs,
  AIDecisionTracesAPI,
  APIConsumptionLimitsAPI,
  CategoryQuotaOptimizerAPI,
  
  // n8n Templates
  templates: {
    // Core
    authGate: N8N_AUTH_GATE_TEMPLATE,
    selfRepair: N8N_SELF_REPAIR_TEMPLATE,
    // Phase 2: Identity
    identityManager: N8N_IDENTITY_MANAGER_TEMPLATE,
    identityHttpWrapper: N8N_IDENTITY_HTTP_WRAPPER_TEMPLATE,
    // Phase 2: Policy
    policyValidator: N8N_POLICY_VALIDATOR_TEMPLATE,
    robotsCheck: N8N_ROBOTS_CHECK_TEMPLATE,
    // Phase 2: HitL
    createApproval: N8N_CREATE_APPROVAL_TEMPLATE,
    waitForApproval: N8N_WAIT_FOR_APPROVAL_TEMPLATE,
    processApprovalResult: N8N_PROCESS_APPROVAL_RESULT_TEMPLATE,
    approvalBranch: N8N_APPROVAL_BRANCH_TEMPLATE,
    // Phase 2.1: Category Quota【V8.2.1新規】
    categoryQuotaCheck: N8N_CATEGORY_QUOTA_CHECK,
  },
};

export default EmpireOS;

// ========================================
// Convenience Functions
// ========================================

/**
 * Empire OS 初期化
 * アプリケーション起動時に呼び出す
 */
export async function initializeEmpireOS(options?: {
  tenant_id?: string;
  plan_code?: string;
}): Promise<{
  session: import('./auth-gate').TenantSession | null;
  ui_config: typeof UI_CONFIG_MASTER;
}> {
  const result = await authGate.check({
    feature_code: 'system.init',
    tenant_id: options?.tenant_id,
  });
  
  return {
    session: result.session || null,
    ui_config: UI_CONFIG_MASTER,
  };
}

/**
 * ツール実行前の統合チェック
 */
export async function beforeToolExecution(
  toolId: string,
  featureCode: string,
  options?: {
    tenant_id?: string;
    secrets_needed?: string[];
  }
): Promise<{
  allowed: boolean;
  session: import('./auth-gate').TenantSession | null;
  tool_config: import('./ui-config-master').ToolUIConfig | null;
  denial_reason?: string;
}> {
  const toolConfig = getToolConfig(toolId);
  
  if (!toolConfig) {
    return {
      allowed: false,
      session: null,
      tool_config: null,
      denial_reason: `ツール ${toolId} が見つかりません`,
    };
  }
  
  const authResult = await authGate.check({
    feature_code: featureCode,
    tool_id: toolId,
    tenant_id: options?.tenant_id,
    secrets_needed: options?.secrets_needed,
  });
  
  if (!authResult.allowed) {
    return {
      allowed: false,
      session: authResult.session || null,
      tool_config: toolConfig,
      denial_reason: authResult.denial_reason,
    };
  }
  
  // プラン階層チェック
  const planTier = authResult.session?.plan.tier_level || 0;
  if (toolConfig.required_plan_tier > planTier) {
    return {
      allowed: false,
      session: authResult.session || null,
      tool_config: toolConfig,
      denial_reason: `このツールには ${toolConfig.required_plan_tier} 以上のプラン階層が必要です`,
    };
  }
  
  return {
    allowed: true,
    session: authResult.session || null,
    tool_config: toolConfig,
  };
}

/**
 * エラーハンドリング付き関数実行
 */
export async function executeWithProtection<T>(
  fn: () => Promise<T>,
  options: {
    tenant_id: string;
    feature_code: string;
    tool_id?: string;
    enable_self_repair?: boolean;
  }
): Promise<{
  success: boolean;
  data?: T;
  error?: import('./self-repair').ErrorInfo;
  repair_log?: import('./self-repair').RepairLog;
}> {
  try {
    // 認証チェック
    const authResult = await authGate.check({
      feature_code: options.feature_code,
      tool_id: options.tool_id,
      tenant_id: options.tenant_id,
    });
    
    if (!authResult.allowed) {
      return {
        success: false,
        error: {
          code: authResult.denial_code || 'AUTH_DENIED',
          message: authResult.denial_reason || '認証エラー',
        },
      };
    }
    
    // 実行（自己修復付き）
    if (options.enable_self_repair !== false) {
      return await withSelfRepair(fn, {
        tenant_id: options.tenant_id,
        feature_code: options.feature_code,
        tool_id: options.tool_id,
      });
    }
    
    // 実行（自己修復なし）
    const result = await fn();
    return { success: true, data: result };
    
  } catch (error) {
    return {
      success: false,
      error: {
        code: (error as any)?.code || 'UNKNOWN',
        message: String(error),
        stack: (error as Error)?.stack,
      },
    };
  }
}

// ========================================
// Phase 2: Guardian Pipeline (統合パイプライン)
// ========================================

/**
 * 守護神パイプライン: Identity + Policy + HitL の統合実行
 * n8nワークフローの共通パターンをTypeScriptで実装
 */
export async function guardianPipeline<T>(
  operation: () => Promise<T>,
  config: {
    tenant_id: string;
    target_platform?: string;
    target_url?: string;
    content?: string;
    action_type?: import('./human-in-the-loop').ActionType;
    target_title?: string;
    require_approval?: boolean;
    supabase?: any;
  }
): Promise<{
  success: boolean;
  data?: T;
  identity?: import('./identity-manager').IdentityContext;
  policy_result?: import('./policy-validator').ValidationResult;
  hitl_result?: {
    required: boolean;
    action_code?: string;
    status?: string;
  };
  error?: string;
}> {
  // 1. Identity Manager (プロキシ・指紋取得)
  let identity: import('./identity-manager').IdentityContext | undefined;
  
  // 2. Policy Validator (コンテンツチェック)
  let policyResult: import('./policy-validator').ValidationResult | undefined;
  if (config.content) {
    const rulesWithId = SYSTEM_RULES.map((r, i) => ({ ...r, id: `sys_${i}` }));
    policyResult = validateContent(config.content, rulesWithId as any, {
      platform: config.target_platform,
      region: 'JP',
    });
    
    if (!policyResult.passed && policyResult.action === 'reject') {
      return {
        success: false,
        policy_result: policyResult,
        error: 'Policy validation failed: ' + policyResult.violations.map(v => v.rule_name).join(', '),
      };
    }
  }
  
  // 3. robots.txt チェック (URLがある場合)
  if (config.target_url) {
    try {
      const robotsResult = await checkRobotsTxt(config.target_url);
      if (!robotsResult.allowed) {
        return {
          success: false,
          error: `Access disallowed by robots.txt for ${robotsResult.path}`,
        };
      }
    } catch (e) {
      console.warn('robots.txt check failed:', e);
    }
  }
  
  // 4. Human-in-the-Loop (承認が必要な場合)
  let hitlResult: { required: boolean; action_code?: string; status?: string } = { required: false };
  
  if (config.require_approval || (policyResult?.summary.requires_human_approval)) {
    hitlResult.required = true;
    
    if (config.supabase) {
      const approvalResponse = await createApprovalRequest({
        tenant_id: config.tenant_id,
        action_type: config.action_type || 'custom',
        target_type: 'operation',
        target_id: Date.now().toString(),
        target_title: config.target_title || 'Operation requiring approval',
        request_reason: policyResult?.violations?.[0]?.rule_name || 'Manual approval required',
        request_context: { policy_result: policyResult },
      }, config.supabase);
      
      if (approvalResponse.success) {
        hitlResult.action_code = approvalResponse.action_code;
        hitlResult.status = 'pending';
        
        return {
          success: false,
          policy_result: policyResult,
          hitl_result: hitlResult,
          error: 'Approval required. Action code: ' + approvalResponse.action_code,
        };
      }
    }
  }
  
  // 5. 実行
  try {
    const data = await operation();
    return {
      success: true,
      data,
      identity,
      policy_result: policyResult,
      hitl_result: hitlResult,
    };
  } catch (error) {
    return {
      success: false,
      identity,
      policy_result: policyResult,
      hitl_result: hitlResult,
      error: String(error),
    };
  }
}

// ========================================
// Phase 2.1: Category Quota Pipeline【V8.2.1新規】
// ========================================

/**
 * カテゴリ枠チェック付き出品パイプライン
 * 枠不足時は自動的に夜間シフトキューに追加
 */
export async function listingWithQuotaCheck<T>(
  listingOperation: () => Promise<T>,
  config: {
    tenant_id: string;
    product_id: string;
    product_title: string;
    platform: string;
    marketplace: string;
    account_code: string;
    category_id: string;
    supabase: any;
    workflow_id?: string;
    execution_id?: string;
  }
): Promise<{
  success: boolean;
  data?: T;
  queued?: boolean;
  queue_id?: string;
  quota_status?: {
    can_list: boolean;
    daily_used: number;
    daily_limit: number;
    hourly_used: number;
    hourly_limit: number;
  };
  error?: string;
}> {
  const quotaAPI = new CategoryQuotaOptimizerAPI(config.supabase);
  
  try {
    // 枠チェック
    const quotaResult = await quotaAPI.checkAndQueue({
      tenant_id: config.tenant_id,
      product_id: config.product_id,
      product_title: config.product_title,
      platform: config.platform,
      marketplace: config.marketplace,
      account_code: config.account_code,
      category_id: config.category_id,
      workflow_id: config.workflow_id,
      execution_id: config.execution_id,
    });
    
    if (!quotaResult.can_list) {
      // 夜間シフト待ちにキューイング済み
      return {
        success: false,
        queued: true,
        queue_id: quotaResult.queue_id,
        quota_status: {
          can_list: false,
          daily_used: quotaResult.quota.daily_used,
          daily_limit: quotaResult.quota.daily_limit,
          hourly_used: quotaResult.quota.hourly_used,
          hourly_limit: quotaResult.quota.hourly_limit,
        },
        error: quotaResult.reason,
      };
    }
    
    // 枠内なので出品実行
    const data = await listingOperation();
    
    return {
      success: true,
      data,
      queued: false,
      quota_status: {
        can_list: true,
        daily_used: quotaResult.quota.daily_used,
        daily_limit: quotaResult.quota.daily_limit,
        hourly_used: quotaResult.quota.hourly_used,
        hourly_limit: quotaResult.quota.hourly_limit,
      },
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
