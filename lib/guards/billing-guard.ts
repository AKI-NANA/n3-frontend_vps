// lib/guards/billing-guard.ts
/**
 * 💰 Billing Guard - プラン・課金制御
 * 
 * Phase 4B: Plan & Billing Guard
 * 
 * 機能:
 * - プラン制限チェック
 * - 使用量制限チェック
 * - 機能アクセス制御
 */

import { createClient } from '@supabase/supabase-js';
import { PlanId, PlanLimits, TenantContext } from '../tenant';

// ============================================================
// 型定義
// ============================================================

export interface BillingCheckResult {
  allowed: boolean;
  reason?: string;
  code?: string;
  upgradeRequired?: boolean;
  currentUsage?: number;
  limit?: number;
}

export interface FeatureAccess {
  featureId: string;
  allowed: boolean;
  requiredPlan?: PlanId;
}

// ============================================================
// Plan Feature Matrix
// ============================================================

const PLAN_FEATURES: Record<PlanId, string[]> = {
  free: [
    'research-basic',
    'listing-manual',
    'job-monitor',
    'usage-view',
  ],
  pro: [
    'research-basic',
    'research-advanced',
    'listing-manual',
    'listing-auto',
    'inventory-sync',
    'job-monitor',
    'job-retry',
    'usage-view',
    'metrics-view',
    'api-access',
  ],
  empire: [
    'research-basic',
    'research-advanced',
    'research-batch',
    'listing-manual',
    'listing-auto',
    'listing-multi-region',
    'inventory-sync',
    'inventory-bulk',
    'media-video',
    'media-audio',
    'job-monitor',
    'job-retry',
    'job-cancel',
    'kill-switch',
    'usage-view',
    'metrics-view',
    'api-access',
    'webhooks',
    'custom-integrations',
  ],
};

// ToolId → 必要なFeature マッピング
const TOOL_FEATURE_MAP: Record<string, string> = {
  'research-agent': 'research-advanced',
  'research-hub-analyze': 'research-advanced',
  'research-batch': 'research-batch',
  'auto-listing': 'listing-auto',
  'listing-multi-region': 'listing-multi-region',
  'inventory-sync': 'inventory-sync',
  'inventory-bulk-adjust': 'inventory-bulk',
  'media-video-gen': 'media-video',
  'media-audio-gen': 'media-audio',
};

// ============================================================
// Supabase Client
// ============================================================

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient(url, key);
}

// ============================================================
// Usage Tracking
// ============================================================

export async function getMonthlyDispatchCount(organizationId: string): Promise<number> {
  const supabase = getSupabaseClient();
  
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const { count, error } = await supabase
    .from('dispatch_jobs')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .gte('created_at', startOfMonth.toISOString());
  
  if (error) {
    console.error('[BillingGuard] Count error:', error);
    return 0;
  }
  
  return count || 0;
}

export async function getConcurrentJobCount(organizationId: string): Promise<number> {
  const supabase = getSupabaseClient();
  
  const { count, error } = await supabase
    .from('dispatch_jobs')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .in('status', ['pending', 'running']);
  
  if (error) {
    console.error('[BillingGuard] Concurrent count error:', error);
    return 0;
  }
  
  return count || 0;
}

export async function getDailyApiCallCount(organizationId: string): Promise<number> {
  const supabase = getSupabaseClient();
  
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('usage_records')
    .select('api_calls')
    .eq('organization_id', organizationId)
    .gte('recorded_at', startOfDay.toISOString());
  
  if (error) {
    console.error('[BillingGuard] API call count error:', error);
    return 0;
  }
  
  return (data || []).reduce((sum, r) => sum + (r.api_calls || 0), 0);
}

// ============================================================
// Billing Checks
// ============================================================

/**
 * 月間Dispatch制限チェック
 */
export async function checkDispatchQuota(
  context: TenantContext
): Promise<BillingCheckResult> {
  const { organizationId, limits } = context;
  
  // 無制限プランはスキップ
  if (limits.dispatchPerMonth === -1) {
    return { allowed: true };
  }
  
  const currentUsage = await getMonthlyDispatchCount(organizationId);
  
  if (currentUsage >= limits.dispatchPerMonth) {
    return {
      allowed: false,
      reason: `Monthly dispatch limit reached (${currentUsage}/${limits.dispatchPerMonth})`,
      code: 'DISPATCH_QUOTA_EXCEEDED',
      upgradeRequired: true,
      currentUsage,
      limit: limits.dispatchPerMonth,
    };
  }
  
  return {
    allowed: true,
    currentUsage,
    limit: limits.dispatchPerMonth,
  };
}

/**
 * 同時実行ジョブ数チェック
 */
export async function checkConcurrentJobs(
  context: TenantContext
): Promise<BillingCheckResult> {
  const { organizationId, limits } = context;
  
  const currentConcurrent = await getConcurrentJobCount(organizationId);
  
  if (currentConcurrent >= limits.concurrentJobs) {
    return {
      allowed: false,
      reason: `Concurrent job limit reached (${currentConcurrent}/${limits.concurrentJobs})`,
      code: 'CONCURRENT_JOB_LIMIT',
      upgradeRequired: true,
      currentUsage: currentConcurrent,
      limit: limits.concurrentJobs,
    };
  }
  
  return {
    allowed: true,
    currentUsage: currentConcurrent,
    limit: limits.concurrentJobs,
  };
}

/**
 * 日次API呼び出し制限チェック
 */
export async function checkApiCallQuota(
  context: TenantContext
): Promise<BillingCheckResult> {
  const { organizationId, limits } = context;
  
  // 無制限プランはスキップ
  if (limits.apiCallsPerDay === -1) {
    return { allowed: true };
  }
  
  const currentCalls = await getDailyApiCallCount(organizationId);
  
  if (currentCalls >= limits.apiCallsPerDay) {
    return {
      allowed: false,
      reason: `Daily API call limit reached (${currentCalls}/${limits.apiCallsPerDay})`,
      code: 'API_CALL_QUOTA_EXCEEDED',
      upgradeRequired: true,
      currentUsage: currentCalls,
      limit: limits.apiCallsPerDay,
    };
  }
  
  return {
    allowed: true,
    currentUsage: currentCalls,
    limit: limits.apiCallsPerDay,
  };
}

// ============================================================
// Feature Access Check
// ============================================================

/**
 * 機能アクセスチェック
 */
export function checkFeatureAccess(
  plan: PlanId,
  featureId: string
): FeatureAccess {
  const allowedFeatures = PLAN_FEATURES[plan] || [];
  
  if (allowedFeatures.includes(featureId)) {
    return { featureId, allowed: true };
  }
  
  // 必要なプランを探す
  let requiredPlan: PlanId | undefined;
  for (const [p, features] of Object.entries(PLAN_FEATURES)) {
    if (features.includes(featureId)) {
      requiredPlan = p as PlanId;
      break;
    }
  }
  
  return {
    featureId,
    allowed: false,
    requiredPlan,
  };
}

/**
 * ToolIdに対する機能アクセスチェック
 */
export function checkToolAccess(
  plan: PlanId,
  toolId: string
): FeatureAccess {
  const featureId = TOOL_FEATURE_MAP[toolId];
  
  // マッピングがないツールは基本機能として許可
  if (!featureId) {
    return { featureId: toolId, allowed: true };
  }
  
  return checkFeatureAccess(plan, featureId);
}

// ============================================================
// 統合チェック関数
// ============================================================

export interface DispatchBillingContext {
  context: TenantContext;
  toolId: string;
}

export interface DispatchBillingResult {
  allowed: boolean;
  reason?: string;
  code?: string;
  upgradeRequired?: boolean;
  checks: {
    quota: BillingCheckResult;
    concurrent: BillingCheckResult;
    feature: FeatureAccess;
  };
}

/**
 * Dispatch実行前の統合課金チェック
 */
export async function checkDispatchBilling(
  context: DispatchBillingContext
): Promise<DispatchBillingResult> {
  const { context: tenantContext, toolId } = context;
  
  // 機能アクセスチェック
  const featureCheck = checkToolAccess(tenantContext.plan, toolId);
  if (!featureCheck.allowed) {
    return {
      allowed: false,
      reason: `Tool "${toolId}" requires ${featureCheck.requiredPlan} plan`,
      code: 'FEATURE_NOT_AVAILABLE',
      upgradeRequired: true,
      checks: {
        quota: { allowed: true },
        concurrent: { allowed: true },
        feature: featureCheck,
      },
    };
  }
  
  // Dispatch quota チェック
  const quotaCheck = await checkDispatchQuota(tenantContext);
  if (!quotaCheck.allowed) {
    return {
      allowed: false,
      reason: quotaCheck.reason,
      code: quotaCheck.code,
      upgradeRequired: quotaCheck.upgradeRequired,
      checks: {
        quota: quotaCheck,
        concurrent: { allowed: true },
        feature: featureCheck,
      },
    };
  }
  
  // 同時実行チェック
  const concurrentCheck = await checkConcurrentJobs(tenantContext);
  if (!concurrentCheck.allowed) {
    return {
      allowed: false,
      reason: concurrentCheck.reason,
      code: concurrentCheck.code,
      upgradeRequired: concurrentCheck.upgradeRequired,
      checks: {
        quota: quotaCheck,
        concurrent: concurrentCheck,
        feature: featureCheck,
      },
    };
  }
  
  return {
    allowed: true,
    checks: {
      quota: quotaCheck,
      concurrent: concurrentCheck,
      feature: featureCheck,
    },
  };
}

// ============================================================
// Usage Recording
// ============================================================

/**
 * 使用量を記録
 */
export async function recordUsage(
  organizationId: string,
  userId: string | undefined,
  toolId: string,
  action: string,
  metadata?: {
    quantity?: number;
    costEstimate?: number;
    tokensUsed?: number;
    apiCalls?: number;
  }
): Promise<void> {
  const supabase = getSupabaseClient();
  
  await supabase.from('usage_records').insert({
    organization_id: organizationId,
    user_id: userId,
    tool_id: toolId,
    action,
    quantity: metadata?.quantity || 1,
    cost_estimate: metadata?.costEstimate || 0,
    tokens_used: metadata?.tokensUsed || 0,
    api_calls: metadata?.apiCalls || 1,
    metadata: metadata || {},
  });
}
