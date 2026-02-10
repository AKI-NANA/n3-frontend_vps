// lib/shared/guard.ts
/**
 * N3 Empire OS - 安全運用ガード
 * レートリミット保護 + 禁止パターン検出
 */

import { imperialErrorLog } from "./imperial-logger";

// ============================================================
// レートリミットガード
// ============================================================

/**
 * API呼び出し間隔の強制スロットリング
 */
export async function imperialSleep(ms = 5000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 処理タイプ別の推奨待機時間
 */
export const RATE_LIMITS = {
  FILE_MODIFY: 5000,    // ファイル修正: 5秒
  GIT_PUSH: 20000,      // git push: 20秒
  API_CALL: 1000,       // 外部API: 1秒
  EBAY_API: 2000,       // eBay API: 2秒
  BATCH_ITEM: 500,      // バッチ内アイテム: 0.5秒
} as const;

// ============================================================
// 禁止パターン検出
// ============================================================

export const FORBIDDEN_PATTERNS = [
  /console\.log\(/,
  /process\.env\.(?!NEXT_PUBLIC_|SUPABASE_SERVICE_ROLE_KEY|MASTER_KEY|N8N_BASE_URL)/,
  /await\s+fetch\s*\(/,
  /axios\.(get|post|put|delete|patch)\s*\(/,
  /160\.\d+\.\d+\.\d+/,
] as const;

/**
 * コード内の禁止パターンを検出
 */
export function detectForbiddenPatterns(code: string): string[] {
  const violations: string[] = [];
  
  for (const pattern of FORBIDDEN_PATTERNS) {
    const match = code.match(pattern);
    if (match) {
      violations.push(`Forbidden pattern detected: ${match[0]}`);
    }
  }
  
  return violations;
}

/**
 * 同期前の安全チェック
 */
export async function preSyncCheck(files: { path: string; content: string }[]): Promise<{
  safe: boolean;
  violations: { path: string; issues: string[] }[];
}> {
  const violations: { path: string; issues: string[] }[] = [];
  
  for (const file of files) {
    const issues = detectForbiddenPatterns(file.content);
    if (issues.length > 0) {
      violations.push({ path: file.path, issues });
    }
  }
  
  if (violations.length > 0) {
    await imperialErrorLog(
      "Pre-Sync Check Failed",
      `${violations.length} files contain forbidden patterns`,
      { files: violations.map(v => v.path) }
    );
  }
  
  return {
    safe: violations.length === 0,
    violations,
  };
}

// ============================================================
// バッチ処理ガード
// ============================================================

/**
 * バッチ処理用の安全ラッパー
 * 各アイテム処理後にスロットリング
 */
export async function safeBatchProcess<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  options: {
    delayMs?: number;
    onError?: (item: T, error: unknown) => void;
  } = {}
): Promise<{ results: R[]; errors: { index: number; error: unknown }[] }> {
  const { delayMs = RATE_LIMITS.BATCH_ITEM, onError } = options;
  const results: R[] = [];
  const errors: { index: number; error: unknown }[] = [];
  
  for (let i = 0; i < items.length; i++) {
    try {
      const result = await processor(items[i], i);
      results.push(result);
    } catch (error) {
      errors.push({ index: i, error });
      if (onError) {
        onError(items[i], error);
      }
    }
    
    // 最後のアイテム以外は待機
    if (i < items.length - 1) {
      await imperialSleep(delayMs);
    }
  }
  
  return { results, errors };
}
