// lib/listing/kill-switch.ts
/**
 * Kill Switch - 緊急停止機能
 * 
 * 設計書: docs/LISTING_SAFETY_DESIGN_V1.md
 * 
 * 機能:
 * - 全機能停止
 * - 特定機能（出品/在庫/リサーチ）のみ停止
 * - 理由の記録
 * - 発動者の記録
 */

import { createClient } from '@/lib/supabase/client';

// ============================================================
// 型定義
// ============================================================

export type KillSwitchScope = 
  | 'all'        // 全機能停止
  | 'listing'    // 出品機能のみ
  | 'inventory'  // 在庫管理機能のみ
  | 'research'   // リサーチ機能のみ
  | 'scheduler'; // スケジューラ機能のみ

export interface KillSwitchState {
  active: boolean;
  scope: KillSwitchScope;
  reason?: string;
  activatedAt?: string;
  activatedBy?: string;
  expiresAt?: string;  // 自動解除時刻（オプション）
}

export interface KillSwitchResult {
  blocked: boolean;
  reason?: string;
  state?: KillSwitchState;
}

// ============================================================
// Kill Switch チェック
// ============================================================

/**
 * Kill Switch状態を取得
 */
export async function getKillSwitchState(): Promise<KillSwitchState | null> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'kill_switch')
      .single();
    
    if (error || !data?.value) {
      return null;
    }
    
    return data.value as KillSwitchState;
  } catch (err) {
    console.error('[KillSwitch] Failed to get state:', err);
    return null;
  }
}

/**
 * Kill Switchをチェック
 * 
 * @param toolId - チェック対象のツールID（例: 'listing-local', 'inventory-sync'）
 * @returns ブロック状態と理由
 */
export async function checkKillSwitch(
  toolId: string
): Promise<KillSwitchResult> {
  const state = await getKillSwitchState();
  
  // Kill Switch未設定または無効
  if (!state || !state.active) {
    return { blocked: false };
  }
  
  // 期限切れチェック
  if (state.expiresAt && new Date(state.expiresAt) < new Date()) {
    return { blocked: false };
  }
  
  // 全機能停止
  if (state.scope === 'all') {
    return { 
      blocked: true, 
      reason: `🚨 緊急停止中: ${state.reason || '管理者により停止されています'}`,
      state,
    };
  }
  
  // toolIdからカテゴリを抽出
  const toolCategory = extractToolCategory(toolId);
  
  // スコープがtoolのカテゴリに一致
  if (state.scope === toolCategory) {
    return { 
      blocked: true, 
      reason: `🚨 ${getScopeName(state.scope)}機能が停止中: ${state.reason || '管理者により停止されています'}`,
      state,
    };
  }
  
  return { blocked: false };
}

/**
 * クライアント側のKill Switchチェック（同期版）
 * UIのボタン無効化などに使用
 */
export function checkKillSwitchSync(
  state: KillSwitchState | null,
  toolId: string
): boolean {
  if (!state || !state.active) {
    return false;  // blocked = false
  }
  
  if (state.expiresAt && new Date(state.expiresAt) < new Date()) {
    return false;
  }
  
  if (state.scope === 'all') {
    return true;  // blocked
  }
  
  const toolCategory = extractToolCategory(toolId);
  return state.scope === toolCategory;
}

// ============================================================
// Kill Switch 操作
// ============================================================

/**
 * Kill Switchを有効化
 */
export async function activateKillSwitch(
  scope: KillSwitchScope,
  reason: string,
  userId: string,
  expiresInMinutes?: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    const state: KillSwitchState = {
      active: true,
      scope,
      reason,
      activatedAt: new Date().toISOString(),
      activatedBy: userId,
    };
    
    if (expiresInMinutes) {
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
      state.expiresAt = expiresAt.toISOString();
    }
    
    const { error } = await supabase
      .from('system_settings')
      .upsert({
        key: 'kill_switch',
        value: state,
        updated_at: new Date().toISOString(),
      });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    // 監査ログ記録
    await logKillSwitchAction('activate', state, userId);
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Kill Switchを無効化
 */
export async function deactivateKillSwitch(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    const state: KillSwitchState = {
      active: false,
      scope: 'all',
    };
    
    const { error } = await supabase
      .from('system_settings')
      .upsert({
        key: 'kill_switch',
        value: state,
        updated_at: new Date().toISOString(),
      });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    // 監査ログ記録
    await logKillSwitchAction('deactivate', state, userId);
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ============================================================
// ユーティリティ
// ============================================================

/**
 * toolIdからカテゴリを抽出
 */
function extractToolCategory(toolId: string): KillSwitchScope | null {
  // 'listing-local' → 'listing'
  // 'inventory-sync' → 'inventory'
  const parts = toolId.split('-');
  const category = parts[0];
  
  const validScopes: KillSwitchScope[] = ['listing', 'inventory', 'research', 'scheduler'];
  
  if (validScopes.includes(category as KillSwitchScope)) {
    return category as KillSwitchScope;
  }
  
  return null;
}

/**
 * スコープの表示名を取得
 */
function getScopeName(scope: KillSwitchScope): string {
  const names: Record<KillSwitchScope, string> = {
    'all': '全',
    'listing': '出品',
    'inventory': '在庫管理',
    'research': 'リサーチ',
    'scheduler': 'スケジューラ',
  };
  return names[scope] || scope;
}

/**
 * 監査ログ記録
 */
async function logKillSwitchAction(
  action: 'activate' | 'deactivate',
  state: KillSwitchState,
  userId: string
): Promise<void> {
  try {
    const supabase = createClient();
    
    await supabase
      .from('audit_log')
      .insert({
        action: `kill_switch_${action}`,
        entity_type: 'system',
        entity_id: 'kill_switch',
        user_id: userId,
        details: state,
        created_at: new Date().toISOString(),
      });
  } catch (err) {
    console.error('[KillSwitch] Failed to log action:', err);
  }
}
