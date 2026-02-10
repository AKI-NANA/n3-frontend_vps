// lib/audit/audit-log.ts
/**
 * 監査ログ - 変更履歴の追跡
 * 
 * 機能:
 * - 誰が、いつ、何を、どのように変更したかを記録
 * - フロントエンド側の変更追跡
 * - サーバー側API連携
 */

import { getCurrentUserId } from '../api/client';

// ============================================================
// 型定義
// ============================================================

export type AuditAction = 
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'BULK_UPDATE'
  | 'BULK_DELETE'
  | 'IMPORT'
  | 'EXPORT';

export interface AuditLogEntry {
  id?: string;
  timestamp: string;
  userId: string | null;
  action: AuditAction;
  entityType: string;
  entityId: string | string[];
  changes?: Record<string, { old: unknown; new: unknown }>;
  metadata?: Record<string, unknown>;
}

export interface AuditLogFilter {
  entityType?: string;
  entityId?: string;
  userId?: string;
  action?: AuditAction;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

// ============================================================
// ローカル監査ログ（デバッグ・開発用）
// ============================================================

const LOCAL_AUDIT_LOG: AuditLogEntry[] = [];
const MAX_LOCAL_LOGS = 100;

/**
 * ローカル監査ログに記録
 */
export function logAuditLocal(entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'userId'>): void {
  const fullEntry: AuditLogEntry = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: new Date().toISOString(),
    userId: getCurrentUserId(),
    ...entry,
  };

  LOCAL_AUDIT_LOG.unshift(fullEntry);

  // ログ数制限
  if (LOCAL_AUDIT_LOG.length > MAX_LOCAL_LOGS) {
    LOCAL_AUDIT_LOG.pop();
  }

  // 開発時はコンソールにも出力
  if (process.env.NODE_ENV === 'development') {
  }
}

/**
 * ローカル監査ログを取得
 */
export function getLocalAuditLog(filter?: AuditLogFilter): AuditLogEntry[] {
  let logs = [...LOCAL_AUDIT_LOG];

  if (filter) {
    if (filter.entityType) {
      logs = logs.filter(l => l.entityType === filter.entityType);
    }
    if (filter.entityId) {
      logs = logs.filter(l => 
        Array.isArray(l.entityId) 
          ? l.entityId.includes(filter.entityId!) 
          : l.entityId === filter.entityId
      );
    }
    if (filter.userId) {
      logs = logs.filter(l => l.userId === filter.userId);
    }
    if (filter.action) {
      logs = logs.filter(l => l.action === filter.action);
    }
    if (filter.startDate) {
      logs = logs.filter(l => l.timestamp >= filter.startDate!);
    }
    if (filter.endDate) {
      logs = logs.filter(l => l.timestamp <= filter.endDate!);
    }
    if (filter.offset) {
      logs = logs.slice(filter.offset);
    }
    if (filter.limit) {
      logs = logs.slice(0, filter.limit);
    }
  }

  return logs;
}

// ============================================================
// 変更差分の計算
// ============================================================

/**
 * オブジェクトの変更差分を計算
 */
export function calculateChanges<T extends Record<string, unknown>>(
  original: T,
  updated: Partial<T>
): Record<string, { old: unknown; new: unknown }> {
  const changes: Record<string, { old: unknown; new: unknown }> = {};

  for (const key of Object.keys(updated)) {
    const oldValue = original[key];
    const newValue = updated[key];

    // 値が実際に変更されている場合のみ記録
    if (!isEqual(oldValue, newValue)) {
      changes[key] = { old: oldValue, new: newValue };
    }
  }

  return changes;
}

/**
 * 簡易的な等価比較
 */
function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) return false;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }
  
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => 
      isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
    );
  }
  
  return false;
}

// ============================================================
// サーバー監査ログAPI
// ============================================================

/**
 * サーバーに監査ログを送信
 */
export async function sendAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'userId'>): Promise<void> {
  // ローカルにも記録
  logAuditLocal(entry);

  // TODO: サーバーAPIが実装されたら有効化
  // try {
  //   await apiClient.post('/api/audit-logs', {
  //     ...entry,
  //     timestamp: new Date().toISOString(),
  //     userId: getCurrentUserId(),
  //   });
  // } catch (error) {
  //   console.error('[AuditLog] Failed to send:', error);
  // }
}

/**
 * サーバーから監査ログを取得
 */
export async function fetchAuditLogs(filter: AuditLogFilter): Promise<AuditLogEntry[]> {
  // TODO: サーバーAPIが実装されたら変更
  // const logs = await apiClient.get<AuditLogEntry[]>('/api/audit-logs', { params: filter });
  // return logs;
  
  // 現時点ではローカルログを返す
  return getLocalAuditLog(filter);
}

// ============================================================
// 商品用ヘルパー
// ============================================================

/**
 * 商品更新の監査ログを記録
 */
export function logProductUpdate(
  productId: string,
  original: Record<string, unknown>,
  updates: Record<string, unknown>
): void {
  const changes = calculateChanges(original, updates);
  
  if (Object.keys(changes).length > 0) {
    sendAuditLog({
      action: 'UPDATE',
      entityType: 'Product',
      entityId: productId,
      changes,
    });
  }
}

/**
 * 商品一括更新の監査ログを記録
 */
export function logProductBulkUpdate(
  productIds: string[],
  commonUpdates?: Record<string, unknown>
): void {
  sendAuditLog({
    action: 'BULK_UPDATE',
    entityType: 'Product',
    entityId: productIds,
    metadata: commonUpdates ? { updates: commonUpdates } : undefined,
  });
}

/**
 * 商品削除の監査ログを記録
 */
export function logProductDelete(productIds: string[]): void {
  sendAuditLog({
    action: productIds.length > 1 ? 'BULK_DELETE' : 'DELETE',
    entityType: 'Product',
    entityId: productIds.length > 1 ? productIds : productIds[0],
  });
}
