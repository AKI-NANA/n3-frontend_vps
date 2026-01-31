// ========================================
// N3 Empire OS V8 - Global Auth Gate
// 全152ツールを統治する共通検問所
// ========================================

import crypto from 'crypto';
import { supabase } from '@/lib/supabase/client';

// ========================================
// 型定義
// ========================================

export interface PlanConfig {
  plan_code: string;
  plan_name: string;
  tier_level: number;
  features: PlanFeatures;
  limits: PlanLimits;
}

export interface PlanFeatures {
  ai_enabled: boolean;
  self_repair_enabled: boolean;
  multi_account_enabled: boolean;
  api_access_enabled: boolean;
  white_label_enabled: boolean;
  priority_support_enabled: boolean;
  market_expander_enabled?: boolean;
  media_empire_enabled?: boolean;
  unlimited_enabled?: boolean;
  admin_enabled?: boolean;
}

export interface PlanLimits {
  max_inventory_items: number;
  max_daily_listings: number;
  max_daily_research: number;
  max_accounts: number;
  max_workflows: number;
  api_calls_per_minute: number;
  storage_mb: number;
  trial_executions_per_month?: number;
}

export interface TenantSession {
  tenant_id: string;
  tenant_code: string;
  is_owner: boolean;
  plan: PlanConfig;
  allowed_accounts: string[];
  allowed_marketplaces: string[];
  secrets: Record<string, string>; // 復号化済みのシークレット
  session_started_at: string;
  session_expires_at: string;
}

export interface AuthGateRequest {
  feature_code: string; // 'listing.publish', 'research.batch', etc.
  tool_id?: string;
  tenant_id?: string;
  required_features?: (keyof PlanFeatures)[];
  required_limit?: keyof PlanLimits;
  limit_increment?: number;
  secrets_needed?: string[]; // 必要なシークレットタイプ
}

export interface AuthGateResult {
  allowed: boolean;
  session?: TenantSession;
  denial_reason?: string;
  denial_code?: AuthDenialCode;
  quota_info?: QuotaInfo;
  feature_flags?: Record<string, boolean>;
}

export interface QuotaInfo {
  limit_type: string;
  current_usage: number;
  max_limit: number;
  remaining: number;
  period_end: string;
}

export type AuthDenialCode = 
  | 'TENANT_NOT_FOUND'
  | 'TENANT_SUSPENDED'
  | 'PLAN_NOT_FOUND'
  | 'FEATURE_NOT_AVAILABLE'
  | 'QUOTA_EXCEEDED'
  | 'TRIAL_EXHAUSTED'
  | 'SECRET_MISSING'
  | 'SECRET_INVALID'
  | 'IP_BLOCKED'
  | 'RATE_LIMITED';

// ========================================
// デフォルト設定
// ========================================

export const DEFAULT_PLANS: Record<string, PlanConfig> = {
  GUEST: {
    plan_code: 'GUEST',
    plan_name: 'ゲスト（お試し）',
    tier_level: 0,
    features: {
      ai_enabled: false,
      self_repair_enabled: false,
      multi_account_enabled: false,
      api_access_enabled: false,
      white_label_enabled: false,
      priority_support_enabled: false,
    },
    limits: {
      max_inventory_items: 0,
      max_daily_listings: 0,
      max_daily_research: 0,
      max_accounts: 0,
      max_workflows: 0,
      api_calls_per_minute: 0,
      storage_mb: 0,
      trial_executions_per_month: 1,
    },
  },
  HAKU: {
    plan_code: 'HAKU',
    plan_name: '白山プラン',
    tier_level: 1,
    features: {
      ai_enabled: true,
      self_repair_enabled: false,
      multi_account_enabled: false,
      api_access_enabled: false,
      white_label_enabled: false,
      priority_support_enabled: false,
    },
    limits: {
      max_inventory_items: 500,
      max_daily_listings: 20,
      max_daily_research: 100,
      max_accounts: 1,
      max_workflows: 10,
      api_calls_per_minute: 20,
      storage_mb: 500,
    },
  },
  FUJI: {
    plan_code: 'FUJI',
    plan_name: '富士山プラン',
    tier_level: 2,
    features: {
      ai_enabled: true,
      self_repair_enabled: true,
      multi_account_enabled: false,
      api_access_enabled: false,
      white_label_enabled: false,
      priority_support_enabled: false,
    },
    limits: {
      max_inventory_items: 3000,
      max_daily_listings: 100,
      max_daily_research: 500,
      max_accounts: 3,
      max_workflows: 50,
      api_calls_per_minute: 60,
      storage_mb: 2000,
    },
  },
  EVEREST: {
    plan_code: 'EVEREST',
    plan_name: 'エベレストプラン',
    tier_level: 3,
    features: {
      ai_enabled: true,
      self_repair_enabled: true,
      multi_account_enabled: true,
      api_access_enabled: true,
      white_label_enabled: false,
      priority_support_enabled: true,
    },
    limits: {
      max_inventory_items: 10000,
      max_daily_listings: 500,
      max_daily_research: 2000,
      max_accounts: 10,
      max_workflows: 200,
      api_calls_per_minute: 120,
      storage_mb: 10000,
    },
  },
  'KUNLUN-1': {
    plan_code: 'KUNLUN-1',
    plan_name: '崑崙Ⅰプラン',
    tier_level: 4,
    features: {
      ai_enabled: true,
      self_repair_enabled: true,
      multi_account_enabled: true,
      api_access_enabled: true,
      white_label_enabled: false,
      priority_support_enabled: true,
      market_expander_enabled: true,
    },
    limits: {
      max_inventory_items: 30000,
      max_daily_listings: 1500,
      max_daily_research: 5000,
      max_accounts: 30,
      max_workflows: 500,
      api_calls_per_minute: 300,
      storage_mb: 30000,
    },
  },
  'KUNLUN-2': {
    plan_code: 'KUNLUN-2',
    plan_name: '崑崙Ⅱプラン',
    tier_level: 5,
    features: {
      ai_enabled: true,
      self_repair_enabled: true,
      multi_account_enabled: true,
      api_access_enabled: true,
      white_label_enabled: true,
      priority_support_enabled: true,
      market_expander_enabled: true,
      media_empire_enabled: true,
    },
    limits: {
      max_inventory_items: 100000,
      max_daily_listings: 5000,
      max_daily_research: 20000,
      max_accounts: 100,
      max_workflows: 2000,
      api_calls_per_minute: 600,
      storage_mb: 100000,
    },
  },
  'KUNLUN-3': {
    plan_code: 'KUNLUN-3',
    plan_name: '崑崙Ⅲプラン',
    tier_level: 6,
    features: {
      ai_enabled: true,
      self_repair_enabled: true,
      multi_account_enabled: true,
      api_access_enabled: true,
      white_label_enabled: true,
      priority_support_enabled: true,
      market_expander_enabled: true,
      media_empire_enabled: true,
      unlimited_enabled: true,
    },
    limits: {
      max_inventory_items: -1,
      max_daily_listings: -1,
      max_daily_research: -1,
      max_accounts: -1,
      max_workflows: -1,
      api_calls_per_minute: -1,
      storage_mb: -1,
    },
  },
  OWNER: {
    plan_code: 'OWNER',
    plan_name: 'オーナー（開発者）',
    tier_level: 99,
    features: {
      ai_enabled: true,
      self_repair_enabled: true,
      multi_account_enabled: true,
      api_access_enabled: true,
      white_label_enabled: true,
      priority_support_enabled: true,
      market_expander_enabled: true,
      media_empire_enabled: true,
      unlimited_enabled: true,
      admin_enabled: true,
    },
    limits: {
      max_inventory_items: -1,
      max_daily_listings: -1,
      max_daily_research: -1,
      max_accounts: -1,
      max_workflows: -1,
      api_calls_per_minute: -1,
      storage_mb: -1,
    },
  },
};

// ========================================
// 機能マッピング
// どの機能にどの制限が適用されるか
// ========================================

export const FEATURE_LIMIT_MAPPING: Record<string, keyof PlanLimits> = {
  'listing.publish': 'max_daily_listings',
  'listing.batch': 'max_daily_listings',
  'listing.schedule': 'max_daily_listings',
  'research.single': 'max_daily_research',
  'research.batch': 'max_daily_research',
  'research.competitor': 'max_daily_research',
  'inventory.add': 'max_inventory_items',
  'inventory.import': 'max_inventory_items',
  'workflow.create': 'max_workflows',
  'workflow.execute': 'max_workflows',
  'api.call': 'api_calls_per_minute',
};

export const FEATURE_REQUIREMENT_MAPPING: Record<string, (keyof PlanFeatures)[]> = {
  'listing.ai_optimize': ['ai_enabled'],
  'research.ai_analysis': ['ai_enabled'],
  'workflow.self_repair': ['self_repair_enabled'],
  'account.add': ['multi_account_enabled'],
  'api.external': ['api_access_enabled'],
  'brand.customize': ['white_label_enabled'],
  'media.generate': ['media_empire_enabled'],
  'market.expand': ['market_expander_enabled'],
};

// ========================================
// Global Auth Gate クラス
// ========================================

export class GlobalAuthGate {
  private static instance: GlobalAuthGate;
  private sessionCache: Map<string, TenantSession> = new Map();
  private rateLimitCache: Map<string, { count: number; resetAt: number }> = new Map();
  
  private constructor() {}
  
  static getInstance(): GlobalAuthGate {
    if (!GlobalAuthGate.instance) {
      GlobalAuthGate.instance = new GlobalAuthGate();
    }
    return GlobalAuthGate.instance;
  }
  
  /**
   * メイン検問メソッド
   * すべてのツール実行前に呼び出す
   */
  async check(request: AuthGateRequest): Promise<AuthGateResult> {
    const startTime = Date.now();
    
    try {
      // 1. テナント解決
      const tenantId = request.tenant_id || this.getOwnerTenantId();
      const session = await this.resolveSession(tenantId);
      
      if (!session) {
        return this.deny('TENANT_NOT_FOUND', 'テナントが見つかりません');
      }
      
      // 2. プラン有効性チェック
      if (!session.is_owner && !this.isPlanActive(session)) {
        return this.deny('TENANT_SUSPENDED', 'プランが停止中です');
      }
      
      // 3. 機能フラグチェック
      if (request.required_features && request.required_features.length > 0) {
        const featureCheck = this.checkFeatures(session, request.required_features);
        if (!featureCheck.allowed) {
          return this.deny('FEATURE_NOT_AVAILABLE', featureCheck.reason || '機能が利用できません');
        }
      }
      
      // 4. 自動機能要件チェック
      const autoRequirements = FEATURE_REQUIREMENT_MAPPING[request.feature_code];
      if (autoRequirements) {
        const autoCheck = this.checkFeatures(session, autoRequirements);
        if (!autoCheck.allowed) {
          return this.deny('FEATURE_NOT_AVAILABLE', `${request.feature_code} には ${autoRequirements.join(', ')} が必要です`);
        }
      }
      
      // 5. クォータチェック
      if (request.required_limit || FEATURE_LIMIT_MAPPING[request.feature_code]) {
        const limitType = request.required_limit || FEATURE_LIMIT_MAPPING[request.feature_code];
        const increment = request.limit_increment || 1;
        
        const quotaResult = await this.checkQuota(session, limitType, increment);
        if (!quotaResult.allowed) {
          return {
            allowed: false,
            session,
            denial_reason: quotaResult.reason,
            denial_code: quotaResult.code,
            quota_info: quotaResult.quota_info,
          };
        }
      }
      
      // 6. GUESTの月1回制限チェック
      if (session.plan.plan_code === 'GUEST') {
        const trialCheck = await this.checkTrialLimit(session);
        if (!trialCheck.allowed) {
          return this.deny('TRIAL_EXHAUSTED', '今月のお試し実行回数を超えました。プランをご契約ください。');
        }
      }
      
      // 7. シークレット取得（必要な場合）
      if (request.secrets_needed && request.secrets_needed.length > 0) {
        const secretsResult = await this.loadSecrets(session, request.secrets_needed);
        if (!secretsResult.success) {
          return this.deny('SECRET_MISSING', secretsResult.reason || '必要なAPIキーが設定されていません');
        }
        session.secrets = secretsResult.secrets || {};
      }
      
      // 8. アクセスログ記録
      await this.logAccess(session, request, 'success', Date.now() - startTime);
      
      // 9. 成功
      return {
        allowed: true,
        session,
        feature_flags: this.extractFeatureFlags(session.plan.features),
      };
      
    } catch (error) {
      console.error('[AuthGate] Error:', error);
      return this.deny('TENANT_NOT_FOUND', 'システムエラーが発生しました');
    }
  }
  
  /**
   * セッション解決
   */
  private async resolveSession(tenantId: string): Promise<TenantSession | null> {
    // キャッシュチェック
    const cached = this.sessionCache.get(tenantId);
    if (cached && new Date(cached.session_expires_at) > new Date()) {
      return cached;
    }
    
    // DB取得またはデフォルト
    try {
      const { data: tenant, error } = await supabase
        .from('core.tenants')
        .select('*, plan:core.plan_master(*)')
        .eq('id', tenantId)
        .single();
      
      if (error || !tenant) {
        // オーナーテナントとしてデフォルトを返す
        return this.createOwnerSession();
      }
      
      const session: TenantSession = {
        tenant_id: tenant.id,
        tenant_code: tenant.tenant_code,
        is_owner: tenant.is_owner,
        plan: tenant.plan || DEFAULT_PLANS.OWNER,
        allowed_accounts: ['*'],
        allowed_marketplaces: ['*'],
        secrets: {},
        session_started_at: new Date().toISOString(),
        session_expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30分
      };
      
      this.sessionCache.set(tenantId, session);
      return session;
      
    } catch (error) {
      console.error('[AuthGate] Session resolve error:', error);
      return this.createOwnerSession();
    }
  }
  
  /**
   * オーナーセッション作成（開発環境用）
   */
  private createOwnerSession(): TenantSession {
    return {
      tenant_id: '00000000-0000-0000-0000-000000000000',
      tenant_code: 'OWNER',
      is_owner: true,
      plan: DEFAULT_PLANS.OWNER,
      allowed_accounts: ['*'],
      allowed_marketplaces: ['*'],
      secrets: {},
      session_started_at: new Date().toISOString(),
      session_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24時間
    };
  }
  
  /**
   * プラン有効性チェック
   */
  private isPlanActive(session: TenantSession): boolean {
    if (session.is_owner) return true;
    // TODO: plan_expires_at チェック
    return true;
  }
  
  /**
   * 機能フラグチェック
   */
  private checkFeatures(
    session: TenantSession, 
    required: (keyof PlanFeatures)[]
  ): { allowed: boolean; reason?: string } {
    if (session.is_owner) return { allowed: true };
    
    for (const feature of required) {
      if (!session.plan.features[feature]) {
        return { 
          allowed: false, 
          reason: `${feature} は ${session.plan.plan_name} プランでは利用できません` 
        };
      }
    }
    
    return { allowed: true };
  }
  
  /**
   * クォータチェック
   */
  private async checkQuota(
    session: TenantSession,
    limitType: keyof PlanLimits,
    increment: number
  ): Promise<{ allowed: boolean; code?: AuthDenialCode; reason?: string; quota_info?: QuotaInfo }> {
    if (session.is_owner) return { allowed: true };
    
    const maxLimit = session.plan.limits[limitType];
    
    // 無制限の場合
    if (maxLimit === -1) return { allowed: true };
    
    // 今日の使用量取得
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data: counter, error } = await supabase
        .from('core.usage_counters')
        .select('*')
        .eq('tenant_id', session.tenant_id)
        .eq('counter_type', limitType)
        .eq('period_start', today)
        .single();
      
      const currentUsage = counter?.current_count || 0;
      const remaining = maxLimit - currentUsage;
      
      if (remaining < increment) {
        return {
          allowed: false,
          code: 'QUOTA_EXCEEDED',
          reason: `${limitType} の上限（${maxLimit}）に達しました`,
          quota_info: {
            limit_type: limitType,
            current_usage: currentUsage,
            max_limit: maxLimit,
            remaining,
            period_end: today + 'T23:59:59Z',
          },
        };
      }
      
      // カウンター更新
      await this.incrementCounter(session.tenant_id, limitType, today, increment);
      
      return { allowed: true };
      
    } catch (error) {
      console.error('[AuthGate] Quota check error:', error);
      // エラー時は許可（オーナー優先）
      return { allowed: true };
    }
  }
  
  /**
   * カウンターインクリメント
   */
  private async incrementCounter(
    tenantId: string,
    counterType: string,
    periodStart: string,
    increment: number
  ): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_usage_counter', {
        p_tenant_id: tenantId,
        p_counter_type: counterType,
        p_period_start: periodStart,
        p_increment: increment,
      });
      
      if (error) {
        console.error('[AuthGate] Counter increment error:', error);
      }
    } catch (error) {
      console.error('[AuthGate] Counter increment error:', error);
    }
  }
  
  /**
   * GUESTのお試し実行チェック
   */
  private async checkTrialLimit(session: TenantSession): Promise<{ allowed: boolean }> {
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    const periodStart = firstDayOfMonth.toISOString().split('T')[0];
    
    try {
      const { data: counter } = await supabase
        .from('core.usage_counters')
        .select('current_count')
        .eq('tenant_id', session.tenant_id)
        .eq('counter_type', 'monthly_trial')
        .eq('period_start', periodStart)
        .single();
      
      const currentUsage = counter?.current_count || 0;
      const maxTrial = session.plan.limits.trial_executions_per_month || 1;
      
      return { allowed: currentUsage < maxTrial };
      
    } catch (error) {
      // カウンターが存在しない場合は許可
      return { allowed: true };
    }
  }
  
  /**
   * シークレット読み込み
   */
  private async loadSecrets(
    session: TenantSession,
    secretTypes: string[]
  ): Promise<{ success: boolean; secrets?: Record<string, string>; reason?: string }> {
    // TODO: 実装 - tenant_vault からの復号化
    // 現在は環境変数からのフォールバック
    
    const secrets: Record<string, string> = {};
    
    for (const secretType of secretTypes) {
      const envKey = secretType.toUpperCase().replace(/_/g, '_');
      const value = process.env[envKey];
      
      if (value) {
        secrets[secretType] = value;
      }
    }
    
    return { success: true, secrets };
  }
  
  /**
   * アクセスログ記録
   */
  private async logAccess(
    session: TenantSession,
    request: AuthGateRequest,
    status: string,
    executionTimeMs: number
  ): Promise<void> {
    try {
      await supabase.from('core.feature_access_logs').insert({
        tenant_id: session.tenant_id,
        feature_code: request.feature_code,
        tool_id: request.tool_id,
        status,
        execution_time_ms: executionTimeMs,
        request_data: { feature_code: request.feature_code }, // 機密データは除外
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      // ログエラーは無視
      console.error('[AuthGate] Log error:', error);
    }
  }
  
  /**
   * 機能フラグ抽出
   */
  private extractFeatureFlags(features: PlanFeatures): Record<string, boolean> {
    return {
      ai_enabled: features.ai_enabled,
      self_repair_enabled: features.self_repair_enabled,
      multi_account_enabled: features.multi_account_enabled,
      api_access_enabled: features.api_access_enabled,
      white_label_enabled: features.white_label_enabled,
      market_expander_enabled: features.market_expander_enabled || false,
      media_empire_enabled: features.media_empire_enabled || false,
    };
  }
  
  /**
   * 拒否レスポンス生成
   */
  private deny(code: AuthDenialCode, reason: string): AuthGateResult {
    return {
      allowed: false,
      denial_code: code,
      denial_reason: reason,
    };
  }
  
  /**
   * オーナーテナントID取得
   */
  private getOwnerTenantId(): string {
    return process.env.OWNER_TENANT_ID || '00000000-0000-0000-0000-000000000000';
  }
  
  /**
   * キャッシュクリア
   */
  clearCache(): void {
    this.sessionCache.clear();
    this.rateLimitCache.clear();
  }
}

// ========================================
// シングルトンエクスポート
// ========================================

export const authGate = GlobalAuthGate.getInstance();

// ========================================
// ユーティリティ関数
// ========================================

/**
 * 簡易チェック関数
 */
export async function checkAuth(
  featureCode: string,
  options?: Partial<AuthGateRequest>
): Promise<AuthGateResult> {
  return authGate.check({
    feature_code: featureCode,
    ...options,
  });
}

/**
 * React Hook用ラッパー（クライアント用）
 */
export function useAuthGate() {
  return {
    check: checkAuth,
    plans: DEFAULT_PLANS,
  };
}

// ========================================
// n8n用テンプレート
// ========================================

export const N8N_AUTH_GATE_TEMPLATE = `
// ========================================
// N3 Empire OS V8 - Auth Gate ノード
// 全ワークフローの冒頭に配置
// ========================================

const body = $input.first().json.body || $input.first().json || {};

// 検問リクエスト構築
const authRequest = {
  feature_code: body.feature_code || 'unknown',
  tool_id: body.tool_id,
  tenant_id: body.tenant_id || $env.OWNER_TENANT_ID || '0',
};

// プラン情報取得（本番ではDBから）
const plans = {
  GUEST: { tier: 0, limits: { daily_listing: 0, daily_research: 0, trial_per_month: 1 } },
  HAKU: { tier: 1, limits: { daily_listing: 20, daily_research: 100 } },
  FUJI: { tier: 2, limits: { daily_listing: 100, daily_research: 500 } },
  EVEREST: { tier: 3, limits: { daily_listing: 500, daily_research: 2000 } },
  KUNLUN: { tier: 4, limits: { daily_listing: -1, daily_research: -1 } },
  OWNER: { tier: 99, limits: { daily_listing: -1, daily_research: -1 } },
};

const tenant_id = authRequest.tenant_id;
const is_owner = tenant_id === '0' || tenant_id === $env.OWNER_TENANT_ID;
const plan_code = is_owner ? 'OWNER' : (body.plan_code || 'GUEST');
const plan = plans[plan_code] || plans.GUEST;

// GUESTの月1回チェック
if (plan_code === 'GUEST') {
  const trial_used = body.trial_used_this_month || 0;
  if (trial_used >= 1) {
    return [{
      json: {
        error: true,
        code: 'TRIAL_EXHAUSTED',
        message: '今月のお試し実行回数を超えました。プランをご契約ください。',
        upgrade_url: 'https://n3-empire.com/pricing'
      }
    }];
  }
}

// 成功：コンテキスト注入
return [{
  json: {
    ...body,
    auth_context: {
      tenant_id,
      is_owner,
      plan_code,
      plan_tier: plan.tier,
      limits: plan.limits,
      passed_at: new Date().toISOString(),
    },
    sql_tenant_filter: is_owner ? 'TRUE' : \`tenant_id = '\${tenant_id}'\`,
  }
}];
`;

export default GlobalAuthGate;
