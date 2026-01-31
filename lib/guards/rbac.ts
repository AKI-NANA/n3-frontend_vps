// lib/guards/rbac.ts
/**
 * 🔐 RBAC - Role-Based Access Control
 * 
 * Phase 3B: Permission Layer
 * 
 * 権限レベル:
 * - ADMIN: 全機能アクセス可
 * - OPERATOR: 運用機能アクセス可
 * - VIEWER: 閲覧のみ
 */

// ============================================================
// 型定義
// ============================================================

export type UserRole = 'admin' | 'operator' | 'viewer';

export interface Permission {
  id: string;
  name: string;
  description: string;
  roles: UserRole[];
}

export interface RBACCheckResult {
  allowed: boolean;
  reason?: string;
  requiredRoles?: UserRole[];
}

// ============================================================
// 権限定義
// ============================================================

export const PERMISSIONS: Record<string, Permission> = {
  // Command Center
  'control:access': {
    id: 'control:access',
    name: 'Command Center Access',
    description: 'Command Center へのアクセス',
    roles: ['admin'],
  },
  'control:retry': {
    id: 'control:retry',
    name: 'Job Retry',
    description: 'ジョブの再実行',
    roles: ['admin'],
  },
  'control:cancel': {
    id: 'control:cancel',
    name: 'Job Cancel',
    description: 'ジョブのキャンセル',
    roles: ['admin'],
  },
  'control:manual-dispatch': {
    id: 'control:manual-dispatch',
    name: 'Manual Dispatch',
    description: '手動Dispatch実行',
    roles: ['admin', 'operator'],
  },
  'control:kill-switch': {
    id: 'control:kill-switch',
    name: 'Kill Switch',
    description: 'グローバル停止スイッチ操作',
    roles: ['admin'],
  },
  
  // Inventory
  'inventory:view': {
    id: 'inventory:view',
    name: 'Inventory View',
    description: '在庫閲覧',
    roles: ['admin', 'operator', 'viewer'],
  },
  'inventory:edit': {
    id: 'inventory:edit',
    name: 'Inventory Edit',
    description: '在庫編集',
    roles: ['admin', 'operator'],
  },
  'inventory:bulk-adjust': {
    id: 'inventory:bulk-adjust',
    name: 'Inventory Bulk Adjust',
    description: '在庫一括補正',
    roles: ['admin', 'operator'],
  },
  'inventory:sync': {
    id: 'inventory:sync',
    name: 'Inventory Sync',
    description: '在庫同期実行',
    roles: ['admin', 'operator'],
  },
  
  // Listing
  'listing:view': {
    id: 'listing:view',
    name: 'Listing View',
    description: '出品閲覧',
    roles: ['admin', 'operator', 'viewer'],
  },
  'listing:create': {
    id: 'listing:create',
    name: 'Listing Create',
    description: '出品作成',
    roles: ['admin', 'operator'],
  },
  'listing:auto': {
    id: 'listing:auto',
    name: 'Auto Listing',
    description: '自動出品',
    roles: ['admin', 'operator'],
  },
  'listing:batch': {
    id: 'listing:batch',
    name: 'Batch Listing',
    description: '一括出品',
    roles: ['admin', 'operator'],
  },
  
  // Research
  'research:view': {
    id: 'research:view',
    name: 'Research View',
    description: 'リサーチ閲覧',
    roles: ['admin', 'operator', 'viewer'],
  },
  'research:execute': {
    id: 'research:execute',
    name: 'Research Execute',
    description: 'リサーチ実行',
    roles: ['admin', 'operator'],
  },
  
  // Settings
  'settings:view': {
    id: 'settings:view',
    name: 'Settings View',
    description: '設定閲覧',
    roles: ['admin', 'operator', 'viewer'],
  },
  'settings:edit': {
    id: 'settings:edit',
    name: 'Settings Edit',
    description: '設定編集',
    roles: ['admin'],
  },
};

// ============================================================
// ToolId → 必要権限マッピング
// ============================================================

const TOOL_PERMISSION_MAP: Record<string, string> = {
  // Control
  'retry': 'control:retry',
  'cancel': 'control:cancel',
  
  // Inventory
  'inventory-sync': 'inventory:sync',
  'inventory-health': 'inventory:view',
  'inventory-bulk-adjust': 'inventory:bulk-adjust',
  'inventory-alert': 'inventory:view',
  
  // Listing
  'auto-listing': 'listing:auto',
  'batch-execute': 'listing:batch',
  'listing-execute': 'listing:create',
  
  // Research
  'research-hub-analyze': 'research:execute',
  'market-score-calc': 'research:execute',
  'competitor-scan': 'research:execute',
};

// ============================================================
// RBAC チェック関数
// ============================================================

/**
 * 権限チェック
 */
export function checkPermission(
  userRole: UserRole,
  permissionId: string
): RBACCheckResult {
  const permission = PERMISSIONS[permissionId];
  
  if (!permission) {
    // 未定義の権限は Admin のみ許可
    return {
      allowed: userRole === 'admin',
      reason: userRole === 'admin' ? undefined : 'Unknown permission, admin required',
      requiredRoles: ['admin'],
    };
  }
  
  const allowed = permission.roles.includes(userRole);
  
  return {
    allowed,
    reason: allowed ? undefined : `Permission "${permissionId}" requires: ${permission.roles.join(', ')}`,
    requiredRoles: permission.roles,
  };
}

/**
 * ToolId に対する権限チェック
 */
export function checkToolPermission(
  userRole: UserRole,
  toolId: string
): RBACCheckResult {
  const permissionId = TOOL_PERMISSION_MAP[toolId];
  
  if (!permissionId) {
    // マッピングがない場合は OPERATOR 以上を要求
    if (userRole === 'viewer') {
      return {
        allowed: false,
        reason: 'Viewer role cannot execute tools',
        requiredRoles: ['admin', 'operator'],
      };
    }
    return { allowed: true };
  }
  
  return checkPermission(userRole, permissionId);
}

/**
 * 複数権限の AND チェック
 */
export function checkPermissions(
  userRole: UserRole,
  permissionIds: string[]
): RBACCheckResult {
  for (const permissionId of permissionIds) {
    const result = checkPermission(userRole, permissionId);
    if (!result.allowed) {
      return result;
    }
  }
  
  return { allowed: true };
}

/**
 * 複数権限の OR チェック
 */
export function checkAnyPermission(
  userRole: UserRole,
  permissionIds: string[]
): RBACCheckResult {
  const results: RBACCheckResult[] = [];
  
  for (const permissionId of permissionIds) {
    const result = checkPermission(userRole, permissionId);
    if (result.allowed) {
      return result;
    }
    results.push(result);
  }
  
  // 全て失敗した場合
  const allRequiredRoles = new Set<UserRole>();
  results.forEach(r => r.requiredRoles?.forEach(role => allRequiredRoles.add(role)));
  
  return {
    allowed: false,
    reason: `None of the required permissions met`,
    requiredRoles: Array.from(allRequiredRoles),
  };
}

// ============================================================
// ユーティリティ
// ============================================================

/**
 * ロール階層チェック（上位ロールは下位の権限を含む）
 */
export function isRoleAtLeast(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    admin: 3,
    operator: 2,
    viewer: 1,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * API レスポンス用エラーオブジェクト
 */
export function createPermissionError(result: RBACCheckResult) {
  return {
    success: false,
    error: result.reason || 'Permission denied',
    code: 'PERMISSION_DENIED',
    requiredRoles: result.requiredRoles,
  };
}
