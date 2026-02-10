// lib/startup/safety-guards.ts
/**
 * 🛡️ Phase G: 安全ガード
 * 
 * - 初回起動制限
 * - Rate Limit 衝突防止
 * - データ汚染防止
 */

import { createClient } from '@/lib/supabase';

// ============================================================
// 型定義
// ============================================================

export interface SafetyGuardConfig {
  firstRun: {
    maxConcurrentJobs: number;
    maxListingsPerHour: number;
    allowedTools: string[];
    stableThreshold: {
      successRate: number;
      minExecutions: number;
      durationMinutes: number;
    };
  };
  rateLimit: {
    ebay: { requestsPerMinute: number; burst: number };
    amazon: { requestsPerMinute: number; burst: number };
    global: {
      maxConcurrent: number;
      cooldownOnErrorMs: number;
    };
    collision: {
      sameToolIntervalMs: number;
      sameCategoryIntervalMs: number;
    };
  };
  dataProtection: {
    validation: Record<string, string[]>;
    rollback: {
      enabled: boolean;
      maxAffectedRows: number;
      requireApproval: boolean;
    };
    audit: {
      logAllWrites: boolean;
      retentionDays: number;
    };
  };
}

export interface SafetyStatus {
  firstRunMode: boolean;
  firstRunExpiresAt: Date | null;
  rateLimitStatus: Record<string, { current: number; limit: number }>;
  lastCollision: Date | null;
  protectedTables: string[];
}

// ============================================================
// デフォルト設定
// ============================================================

export const DEFAULT_SAFETY_CONFIG: SafetyGuardConfig = {
  firstRun: {
    maxConcurrentJobs: 2,
    maxListingsPerHour: 10,
    allowedTools: ['inventory-sync', 'research-agent', 'stock-killer'],
    stableThreshold: {
      successRate: 95,
      minExecutions: 50,
      durationMinutes: 60,
    },
  },
  rateLimit: {
    ebay: { requestsPerMinute: 30, burst: 50 },
    amazon: { requestsPerMinute: 20, burst: 30 },
    global: {
      maxConcurrent: 10,
      cooldownOnErrorMs: 30000,
    },
    collision: {
      sameToolIntervalMs: 5000,
      sameCategoryIntervalMs: 2000,
    },
  },
  dataProtection: {
    validation: {
      products_master: ['sku', 'title'],
      inventory_master: ['product_id', 'quantity'],
      n3_listing_queue: ['product_id', 'status'],
    },
    rollback: {
      enabled: true,
      maxAffectedRows: 100,
      requireApproval: true,
    },
    audit: {
      logAllWrites: true,
      retentionDays: 30,
    },
  },
};

// ============================================================
// 初回起動制限
// ============================================================

let firstRunStartedAt: Date | null = null;
let executionCount = 0;
let successCount = 0;

export function startFirstRunMode(): void {
  firstRunStartedAt = new Date();
  executionCount = 0;
  successCount = 0;
}

export function isInFirstRunMode(config: SafetyGuardConfig = DEFAULT_SAFETY_CONFIG): boolean {
  if (!firstRunStartedAt) return false;
  
  const elapsed = Date.now() - firstRunStartedAt.getTime();
  const threshold = config.firstRun.stableThreshold;
  
  // 時間経過チェック
  if (elapsed > threshold.durationMinutes * 60 * 1000) {
    // 成功率チェック
    if (executionCount >= threshold.minExecutions) {
      const rate = (successCount / executionCount) * 100;
      if (rate >= threshold.successRate) {
        firstRunStartedAt = null; // 初回モード終了
        return false;
      }
    }
  }
  
  return true;
}

export function recordFirstRunExecution(success: boolean): void {
  executionCount++;
  if (success) successCount++;
}

export function getFirstRunLimits(config: SafetyGuardConfig = DEFAULT_SAFETY_CONFIG): {
  maxConcurrent: number;
  maxListingsPerHour: number;
  allowedTools: string[];
} {
  if (!isInFirstRunMode(config)) {
    return {
      maxConcurrent: 999,
      maxListingsPerHour: 999,
      allowedTools: [],
    };
  }
  
  return {
    maxConcurrent: config.firstRun.maxConcurrentJobs,
    maxListingsPerHour: config.firstRun.maxListingsPerHour,
    allowedTools: config.firstRun.allowedTools,
  };
}

// ============================================================
// Rate Limit 衝突防止
// ============================================================

const lastExecutionTime: Map<string, number> = new Map();
const categoryLastExecution: Map<string, number> = new Map();

export function checkCollision(
  toolId: string,
  category: string,
  config: SafetyGuardConfig = DEFAULT_SAFETY_CONFIG
): { allowed: boolean; waitMs: number; reason?: string } {
  const now = Date.now();
  
  // 同じツールの実行間隔チェック
  const lastToolRun = lastExecutionTime.get(toolId);
  if (lastToolRun) {
    const elapsed = now - lastToolRun;
    if (elapsed < config.rateLimit.collision.sameToolIntervalMs) {
      return {
        allowed: false,
        waitMs: config.rateLimit.collision.sameToolIntervalMs - elapsed,
        reason: `同じツールの実行間隔が短すぎます（${Math.ceil((config.rateLimit.collision.sameToolIntervalMs - elapsed) / 1000)}秒待機）`,
      };
    }
  }
  
  // 同じカテゴリの実行間隔チェック
  const lastCategoryRun = categoryLastExecution.get(category);
  if (lastCategoryRun) {
    const elapsed = now - lastCategoryRun;
    if (elapsed < config.rateLimit.collision.sameCategoryIntervalMs) {
      return {
        allowed: false,
        waitMs: config.rateLimit.collision.sameCategoryIntervalMs - elapsed,
        reason: `同じカテゴリの実行間隔が短すぎます`,
      };
    }
  }
  
  return { allowed: true, waitMs: 0 };
}

export function recordExecution(toolId: string, category: string): void {
  const now = Date.now();
  lastExecutionTime.set(toolId, now);
  categoryLastExecution.set(category, now);
}

// ============================================================
// データ汚染防止
// ============================================================

export function validateWriteData(
  table: string,
  data: Record<string, any>,
  config: SafetyGuardConfig = DEFAULT_SAFETY_CONFIG
): { valid: boolean; missingFields: string[] } {
  const requiredFields = config.dataProtection.validation[table];
  
  if (!requiredFields) {
    return { valid: true, missingFields: [] };
  }
  
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missingFields.push(field);
    }
  }
  
  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}

export async function checkBulkOperationLimit(
  table: string,
  affectedRows: number,
  config: SafetyGuardConfig = DEFAULT_SAFETY_CONFIG
): Promise<{ allowed: boolean; requiresApproval: boolean; reason?: string }> {
  if (!config.dataProtection.rollback.enabled) {
    return { allowed: true, requiresApproval: false };
  }
  
  if (affectedRows > config.dataProtection.rollback.maxAffectedRows) {
    if (config.dataProtection.rollback.requireApproval) {
      return {
        allowed: false,
        requiresApproval: true,
        reason: `一括操作が制限を超えています（${affectedRows} > ${config.dataProtection.rollback.maxAffectedRows}行）。Admin承認が必要です。`,
      };
    }
  }
  
  return { allowed: true, requiresApproval: false };
}

// ============================================================
// 安全ガード状態取得
// ============================================================

export function getSafetyStatus(config: SafetyGuardConfig = DEFAULT_SAFETY_CONFIG): SafetyStatus {
  const firstRunMode = isInFirstRunMode(config);
  
  return {
    firstRunMode,
    firstRunExpiresAt: firstRunMode && firstRunStartedAt
      ? new Date(firstRunStartedAt.getTime() + config.firstRun.stableThreshold.durationMinutes * 60 * 1000)
      : null,
    rateLimitStatus: {
      ebay: { current: 0, limit: config.rateLimit.ebay.requestsPerMinute },
      amazon: { current: 0, limit: config.rateLimit.amazon.requestsPerMinute },
    },
    lastCollision: null,
    protectedTables: Object.keys(config.dataProtection.validation),
  };
}

// ============================================================
// エクスポート
// ============================================================

export { DEFAULT_SAFETY_CONFIG as SAFETY_CONFIG };
