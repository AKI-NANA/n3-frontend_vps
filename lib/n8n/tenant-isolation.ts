// lib/n8n/tenant-isolation.ts
// 🔐 N3 Empire OS - テナント隔離レイヤー
// マルチテナント対応のためのセキュリティ境界

import crypto from 'crypto';

// ========================================
// 型定義
// ========================================

export interface TenantContext {
  tenant_id: string;
  is_owner: boolean;
  plan_type: 'basic' | 'pro' | 'empire' | 'owner';
  allowed_accounts: string[];
  allowed_marketplaces: string[];
  feature_limits: FeatureLimits;
  created_at: string;
}

export interface FeatureLimits {
  daily_research_limit: number;
  daily_listing_limit: number;
  inventory_item_limit: number;
  workflow_limit: number;
  api_calls_per_minute: number;
  storage_mb: number;
}

export interface TenantIsolationConfig {
  enforce_tenant_filter: boolean;
  allow_cross_tenant_read: boolean;
  audit_all_queries: boolean;
  owner_tenant_id: string;
}

// ========================================
// デフォルト設定
// ========================================

export const DEFAULT_FEATURE_LIMITS: Record<string, FeatureLimits> = {
  basic: {
    daily_research_limit: 50,
    daily_listing_limit: 10,
    inventory_item_limit: 500,
    workflow_limit: 5,
    api_calls_per_minute: 10,
    storage_mb: 100,
  },
  pro: {
    daily_research_limit: 500,
    daily_listing_limit: 100,
    inventory_item_limit: 5000,
    workflow_limit: 50,
    api_calls_per_minute: 60,
    storage_mb: 1000,
  },
  empire: {
    daily_research_limit: 5000,
    daily_listing_limit: 1000,
    inventory_item_limit: 50000,
    workflow_limit: 500,
    api_calls_per_minute: 300,
    storage_mb: 10000,
  },
  owner: {
    daily_research_limit: -1, // 無制限
    daily_listing_limit: -1,
    inventory_item_limit: -1,
    workflow_limit: -1,
    api_calls_per_minute: -1,
    storage_mb: -1,
  },
};

export const DEFAULT_ISOLATION_CONFIG: TenantIsolationConfig = {
  enforce_tenant_filter: true,
  allow_cross_tenant_read: false,
  audit_all_queries: true,
  owner_tenant_id: '0',
};

// ========================================
// テナントコンテキスト生成
// ========================================

/**
 * リクエストからテナントコンテキストを生成
 */
export function createTenantContext(
  tenantId: string | null | undefined,
  planType?: string,
  options?: Partial<TenantContext>
): TenantContext {
  const resolvedTenantId = tenantId || DEFAULT_ISOLATION_CONFIG.owner_tenant_id;
  const isOwner = resolvedTenantId === DEFAULT_ISOLATION_CONFIG.owner_tenant_id;
  const resolvedPlanType = isOwner ? 'owner' : (planType as TenantContext['plan_type'] || 'basic');
  
  return {
    tenant_id: resolvedTenantId,
    is_owner: isOwner,
    plan_type: resolvedPlanType,
    allowed_accounts: options?.allowed_accounts || ['*'],
    allowed_marketplaces: options?.allowed_marketplaces || ['*'],
    feature_limits: DEFAULT_FEATURE_LIMITS[resolvedPlanType] || DEFAULT_FEATURE_LIMITS.basic,
    created_at: new Date().toISOString(),
    ...options,
  };
}

// ========================================
// SQLフィルタ生成
// ========================================

/**
 * テナントIDフィルタ付きSQLを生成
 */
export function withTenantFilter(
  baseSql: string,
  tenantContext: TenantContext,
  tableAlias?: string
): string {
  // オーナーの場合はフィルタなし
  if (tenantContext.is_owner) {
    return baseSql;
  }
  
  const prefix = tableAlias ? `${tableAlias}.` : '';
  const tenantFilter = `${prefix}tenant_id = '${tenantContext.tenant_id}'`;
  
  // WHEREが既にあるかチェック
  const hasWhere = /\bWHERE\b/i.test(baseSql);
  
  if (hasWhere) {
    // 既存のWHEREにANDで追加
    return baseSql.replace(
      /\bWHERE\b/i,
      `WHERE ${tenantFilter} AND`
    );
  } else {
    // ORDER BY, LIMIT, GROUP BY の前にWHEREを挿入
    const insertPoint = baseSql.search(/\b(ORDER BY|LIMIT|GROUP BY)\b/i);
    if (insertPoint > 0) {
      return baseSql.slice(0, insertPoint) + ` WHERE ${tenantFilter} ` + baseSql.slice(insertPoint);
    } else {
      return baseSql + ` WHERE ${tenantFilter}`;
    }
  }
}

/**
 * 複数テーブルのJOINにテナントフィルタを適用
 */
export function withMultiTableTenantFilter(
  baseSql: string,
  tenantContext: TenantContext,
  tables: { name: string; alias: string }[]
): string {
  if (tenantContext.is_owner) {
    return baseSql;
  }
  
  const filters = tables.map(t => `${t.alias}.tenant_id = '${tenantContext.tenant_id}'`);
  const combinedFilter = filters.join(' AND ');
  
  const hasWhere = /\bWHERE\b/i.test(baseSql);
  
  if (hasWhere) {
    return baseSql.replace(/\bWHERE\b/i, `WHERE ${combinedFilter} AND`);
  } else {
    const insertPoint = baseSql.search(/\b(ORDER BY|LIMIT|GROUP BY)\b/i);
    if (insertPoint > 0) {
      return baseSql.slice(0, insertPoint) + ` WHERE ${combinedFilter} ` + baseSql.slice(insertPoint);
    } else {
      return baseSql + ` WHERE ${combinedFilter}`;
    }
  }
}

// ========================================
// クォータチェック
// ========================================

/**
 * 機能使用クォータをチェック
 */
export async function checkFeatureQuota(
  tenantContext: TenantContext,
  featureKey: keyof FeatureLimits,
  currentUsage: number
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const limit = tenantContext.feature_limits[featureKey];
  
  // 無制限の場合
  if (limit === -1) {
    return { allowed: true, remaining: -1, limit: -1 };
  }
  
  const remaining = limit - currentUsage;
  const allowed = remaining > 0;
  
  return { allowed, remaining, limit };
}

/**
 * 機能使用をログに記録
 */
export function logFeatureUsage(
  tenantContext: TenantContext,
  featureKey: string,
  count: number = 1
): { tenant_id: string; feature_key: string; count: number; used_at: string } {
  return {
    tenant_id: tenantContext.tenant_id,
    feature_key: featureKey,
    count,
    used_at: new Date().toISOString(),
  };
}

// ========================================
// アクセス制御
// ========================================

/**
 * アカウントアクセス権限チェック
 */
export function canAccessAccount(
  tenantContext: TenantContext,
  accountId: string
): boolean {
  if (tenantContext.is_owner) return true;
  if (tenantContext.allowed_accounts.includes('*')) return true;
  return tenantContext.allowed_accounts.includes(accountId);
}

/**
 * マーケットプレイスアクセス権限チェック
 */
export function canAccessMarketplace(
  tenantContext: TenantContext,
  marketplace: string
): boolean {
  if (tenantContext.is_owner) return true;
  if (tenantContext.allowed_marketplaces.includes('*')) return true;
  return tenantContext.allowed_marketplaces.includes(marketplace);
}

/**
 * データ所有権チェック
 */
export function isDataOwner(
  tenantContext: TenantContext,
  dataTenantId: string | null | undefined
): boolean {
  if (tenantContext.is_owner) return true;
  if (!dataTenantId) return false;
  return tenantContext.tenant_id === dataTenantId;
}

// ========================================
// n8n用テンプレート
// ========================================

/**
 * n8n Code ノード用テナント注入テンプレート
 */
export const N8N_TENANT_INJECTION_TEMPLATE = `
// ========================================
// N3 Empire OS - テナント注入ノード
// Webhookの直後（HMAC検証の後）に配置
// ========================================

const body = $input.first().json.body || $input.first().json || {};

// テナントID取得（認証トークンから or リクエストから）
const tenant_id = body.tenant_id || $env.DEFAULT_TENANT_ID || '0';
const is_owner = tenant_id === '0';

// プラン情報（本番ではDBから取得）
const plan_type = body.plan_type || (is_owner ? 'owner' : 'basic');

// 機能制限
const feature_limits = {
  basic: {
    daily_research_limit: 50,
    daily_listing_limit: 10,
    inventory_item_limit: 500,
    workflow_limit: 5,
  },
  pro: {
    daily_research_limit: 500,
    daily_listing_limit: 100,
    inventory_item_limit: 5000,
    workflow_limit: 50,
  },
  empire: {
    daily_research_limit: 5000,
    daily_listing_limit: 1000,
    inventory_item_limit: 50000,
    workflow_limit: 500,
  },
  owner: {
    daily_research_limit: -1,
    daily_listing_limit: -1,
    inventory_item_limit: -1,
    workflow_limit: -1,
  },
};

// テナントコンテキスト構築
const tenant_context = {
  tenant_id,
  is_owner,
  plan_type,
  allowed_accounts: body.allowed_accounts || ['*'],
  allowed_marketplaces: body.allowed_marketplaces || ['*'],
  feature_limits: feature_limits[plan_type] || feature_limits.basic,
  created_at: new Date().toISOString(),
};

// 元のリクエストデータとマージ
return [{
  json: {
    ...body,
    tenant_context,
    // 以下はSQLノードで使用
    sql_tenant_filter: is_owner ? 'TRUE' : \`tenant_id = '\${tenant_id}'\`,
  }
}];
`;

/**
 * n8n SQLノード用テナントフィルタテンプレート
 */
export const N8N_SQL_TENANT_FILTER_TEMPLATE = `
-- ========================================
-- N3 Empire OS - テナントフィルタ付きSQL
-- SQLノードで以下の形式で使用
-- ========================================

-- 基本形式
SELECT * FROM products_master
WHERE {{ $json.sql_tenant_filter }}
  AND deleted_at IS NULL
ORDER BY updated_at DESC
LIMIT {{ $json.pagination.page_size || 50 }}
OFFSET {{ (($json.pagination.page || 1) - 1) * ($json.pagination.page_size || 50) }};

-- JOINの場合
SELECT 
  p.*,
  i.stock_quantity
FROM products_master p
LEFT JOIN inventory_master i ON p.id = i.product_id
WHERE {{ $json.sql_tenant_filter.replace('tenant_id', 'p.tenant_id') }}
  AND p.deleted_at IS NULL;
`;

/**
 * n8n クォータチェックテンプレート
 */
export const N8N_QUOTA_CHECK_TEMPLATE = `
// ========================================
// N3 Empire OS - クォータチェックノード
// 機能使用前に配置（リサーチ、出品など）
// ========================================

const tenant_context = $json.tenant_context;
const feature_key = 'daily_research_limit'; // 変更: 使用する機能

// オーナーまたは無制限プランはスキップ
if (tenant_context.is_owner || tenant_context.feature_limits[feature_key] === -1) {
  return [{ json: { ...($input.first().json), quota_check: { allowed: true, remaining: -1 } } }];
}

// 今日の使用回数を取得（本番ではDBから）
const today_usage = $json.today_usage || 0;
const limit = tenant_context.feature_limits[feature_key];
const remaining = limit - today_usage;
const allowed = remaining > 0;

if (!allowed) {
  // クォータ超過エラー
  return [{
    json: {
      error: true,
      code: 'QUOTA_EXCEEDED',
      message: \`本日の\${feature_key}の上限（\${limit}回）に達しました。プランをアップグレードしてください。\`,
      quota: { limit, used: today_usage, remaining: 0 },
    }
  }];
}

return [{
  json: {
    ...($input.first().json),
    quota_check: { allowed, remaining, limit },
  }
}];
`;

// ========================================
// エクスポート
// ========================================

export default {
  // コンテキスト
  createTenantContext,
  DEFAULT_FEATURE_LIMITS,
  DEFAULT_ISOLATION_CONFIG,
  
  // SQLフィルタ
  withTenantFilter,
  withMultiTableTenantFilter,
  
  // クォータ
  checkFeatureQuota,
  logFeatureUsage,
  
  // アクセス制御
  canAccessAccount,
  canAccessMarketplace,
  isDataOwner,
  
  // n8nテンプレート
  N8N_TENANT_INJECTION_TEMPLATE,
  N8N_SQL_TENANT_FILTER_TEMPLATE,
  N8N_QUOTA_CHECK_TEMPLATE,
};
