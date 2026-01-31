// lib/guards/admin-guard.ts
/**
 * 🔐 Phase D-Core: Admin Guard
 * 
 * Admin専用機能へのアクセス制御
 * 
 * 対象:
 * - Control Center (/tools/control-n3)
 * - Automation Panel
 * - Tools Registry
 * - Workflow Manager
 * - Health Panel
 * - Manual Dispatch
 * - Kill Switch
 */

import { createClient } from '@/lib/supabase';

// ============================================================
// 型定義
// ============================================================

export type UserRole = 'admin' | 'operator' | 'viewer';

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AdminGuardResult {
  allowed: boolean;
  user: CurrentUser | null;
  reason?: string;
}

// ============================================================
// Admin専用リソース定義
// ============================================================

export const ADMIN_ONLY_RESOURCES = [
  // UIパス
  '/tools/control-n3',
  '/tools/automation-hub',
  '/tools/automation-settings',
  '/tools/command-center',
  
  // APIパス
  '/api/dispatch',
  '/api/automation',
  '/api/health',
  '/api/n8n',
  '/api/kill-switch',
  '/api/system-flags',
  '/api/job-locks',
  '/api/execution-logs',
] as const;

// ============================================================
// ユーザー取得
// ============================================================

/**
 * 現在のユーザーを取得（サーバーサイド）
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const supabase = createClient();
    
    // セッションからユーザー取得
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }
    
    // ユーザーロール取得（n3_user_roles テーブルから）
    const { data: roleData } = await supabase
      .from('n3_user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();
    
    // ロールが未設定の場合はデフォルトで 'viewer'
    const role: UserRole = (roleData?.role as UserRole) || 'viewer';
    
    return {
      id: session.user.id,
      email: session.user.email || '',
      role,
    };
  } catch (error) {
    console.error('[AdminGuard] Error getting current user:', error);
    return null;
  }
}

/**
 * 現在のユーザーを取得（API Route用・headers利用）
 */
export async function getCurrentUserFromRequest(): Promise<CurrentUser | null> {
  try {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    // ユーザーロール取得
    const { data: roleData } = await supabase
      .from('n3_user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    const role: UserRole = (roleData?.role as UserRole) || 'viewer';
    
    return {
      id: user.id,
      email: user.email || '',
      role,
    };
  } catch (error) {
    console.error('[AdminGuard] Error getting user from request:', error);
    return null;
  }
}

// ============================================================
// ガード関数
// ============================================================

/**
 * Admin権限を要求
 * API Routeの冒頭で使用
 */
export function requireAdmin(user: CurrentUser | null): void {
  if (!user) {
    throw new AdminGuardError('UNAUTHENTICATED', 'Authentication required');
  }
  
  if (user.role !== 'admin') {
    throw new AdminGuardError(
      'ADMIN_ONLY',
      `Admin access required. Current role: ${user.role}`
    );
  }
}

/**
 * Operator以上の権限を要求
 */
export function requireOperator(user: CurrentUser | null): void {
  if (!user) {
    throw new AdminGuardError('UNAUTHENTICATED', 'Authentication required');
  }
  
  if (user.role !== 'admin' && user.role !== 'operator') {
    throw new AdminGuardError(
      'OPERATOR_REQUIRED',
      `Operator or Admin access required. Current role: ${user.role}`
    );
  }
}

/**
 * 権限チェック（例外を投げない版）
 */
export async function checkAdminAccess(): Promise<AdminGuardResult> {
  const user = await getCurrentUser();
  
  if (!user) {
    return {
      allowed: false,
      user: null,
      reason: 'Not authenticated',
    };
  }
  
  if (user.role !== 'admin') {
    return {
      allowed: false,
      user,
      reason: `Admin access required. Current role: ${user.role}`,
    };
  }
  
  return {
    allowed: true,
    user,
  };
}

/**
 * リソースパスがAdmin専用かチェック
 */
export function isAdminOnlyResource(path: string): boolean {
  return ADMIN_ONLY_RESOURCES.some(
    resource => path.startsWith(resource)
  );
}

// ============================================================
// エラークラス
// ============================================================

export class AdminGuardError extends Error {
  code: string;
  
  constructor(code: string, message: string) {
    super(message);
    this.name = 'AdminGuardError';
    this.code = code;
  }
  
  toResponse() {
    return {
      success: false,
      error: this.message,
      code: this.code,
    };
  }
}

// ============================================================
// APIミドルウェア用ヘルパー
// ============================================================

/**
 * API Route用のAdmin権限チェックラッパー
 */
export async function withAdminGuard<T>(
  handler: (user: CurrentUser) => Promise<T>
): Promise<T | { error: string; code: string }> {
  try {
    const user = await getCurrentUserFromRequest();
    requireAdmin(user);
    return await handler(user!);
  } catch (error) {
    if (error instanceof AdminGuardError) {
      return error.toResponse() as any;
    }
    throw error;
  }
}

/**
 * API Route用のOperator権限チェックラッパー
 */
export async function withOperatorGuard<T>(
  handler: (user: CurrentUser) => Promise<T>
): Promise<T | { error: string; code: string }> {
  try {
    const user = await getCurrentUserFromRequest();
    requireOperator(user);
    return await handler(user!);
  } catch (error) {
    if (error instanceof AdminGuardError) {
      return error.toResponse() as any;
    }
    throw error;
  }
}
