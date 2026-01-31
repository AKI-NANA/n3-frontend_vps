// lib/guards/kill-switch.ts
/**
 * 🛑 Phase D-Core: Kill Switch
 * 
 * システム全体の緊急停止機能
 * 
 * 機能:
 * - グローバルKill Switch: すべての自動実行を即座に停止
 * - ツール別停止: 特定ツールの実行のみ停止
 * - 一時停止モード: 指定時間後に自動復旧
 */

import { createClient } from '@/lib/supabase';

// ============================================================
// 型定義
// ============================================================

export interface SystemFlags {
  id: string;
  kill_switch: boolean;
  kill_switch_reason?: string;
  kill_switch_activated_at?: string;
  kill_switch_activated_by?: string;
  auto_resume_at?: string;
  paused_tools: string[];
  updated_at: string;
}

export interface KillSwitchStatus {
  active: boolean;
  reason?: string;
  activatedAt?: Date;
  activatedBy?: string;
  autoResumeAt?: Date;
  pausedTools: string[];
}

export interface KillSwitchActivateParams {
  reason: string;
  activatedBy: string;
  autoResumeMinutes?: number; // 指定時間後に自動復旧
  pausedTools?: string[]; // 特定ツールのみ停止
}

// ============================================================
// Kill Switch エラー
// ============================================================

export class KillSwitchActiveError extends Error {
  code = 'SYSTEM_HALTED';
  status: KillSwitchStatus;
  
  constructor(status: KillSwitchStatus) {
    super(status.reason || 'System halted by administrator');
    this.name = 'KillSwitchActiveError';
    this.status = status;
  }
  
  toResponse() {
    return {
      success: false,
      error: this.message,
      code: this.code,
      killSwitch: {
        active: this.status.active,
        reason: this.status.reason,
        activatedAt: this.status.activatedAt?.toISOString(),
        autoResumeAt: this.status.autoResumeAt?.toISOString(),
      },
    };
  }
}

// ============================================================
// Kill Switch 操作
// ============================================================

/**
 * Kill Switch の状態を取得
 */
export async function getKillSwitchStatus(): Promise<KillSwitchStatus> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('n3_system_flags')
      .select('*')
      .single();
    
    if (error || !data) {
      // テーブルが存在しない or データがない場合はデフォルト
      return {
        active: false,
        pausedTools: [],
      };
    }
    
    const flags = data as SystemFlags;
    
    // 自動復旧時間をチェック
    if (flags.kill_switch && flags.auto_resume_at) {
      const resumeAt = new Date(flags.auto_resume_at);
      if (new Date() >= resumeAt) {
        // 自動復旧実行
        await deactivateKillSwitch('system', 'Auto-resume time reached');
        return {
          active: false,
          pausedTools: [],
        };
      }
    }
    
    return {
      active: flags.kill_switch,
      reason: flags.kill_switch_reason,
      activatedAt: flags.kill_switch_activated_at 
        ? new Date(flags.kill_switch_activated_at) 
        : undefined,
      activatedBy: flags.kill_switch_activated_by,
      autoResumeAt: flags.auto_resume_at 
        ? new Date(flags.auto_resume_at) 
        : undefined,
      pausedTools: flags.paused_tools || [],
    };
  } catch (error) {
    console.error('[KillSwitch] Error getting status:', error);
    // エラー時はセーフモード（実行許可）
    return {
      active: false,
      pausedTools: [],
    };
  }
}

/**
 * Kill Switch を有効化
 */
export async function activateKillSwitch(
  params: KillSwitchActivateParams
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    const updateData: Partial<SystemFlags> = {
      kill_switch: true,
      kill_switch_reason: params.reason,
      kill_switch_activated_at: new Date().toISOString(),
      kill_switch_activated_by: params.activatedBy,
      updated_at: new Date().toISOString(),
    };
    
    // 自動復旧時間を設定
    if (params.autoResumeMinutes) {
      const resumeAt = new Date();
      resumeAt.setMinutes(resumeAt.getMinutes() + params.autoResumeMinutes);
      updateData.auto_resume_at = resumeAt.toISOString();
    }
    
    // 特定ツールのみ停止
    if (params.pausedTools && params.pausedTools.length > 0) {
      updateData.paused_tools = params.pausedTools;
    }
    
    const { error } = await supabase
      .from('n3_system_flags')
      .upsert({
        id: 'global',
        ...updateData,
      });
    
    if (error) {
      console.error('[KillSwitch] Activation error:', error);
      return { success: false, error: error.message };
    }
    
    console.log(`[KillSwitch] ⛔ ACTIVATED by ${params.activatedBy}: ${params.reason}`);
    
    return { success: true };
  } catch (error) {
    console.error('[KillSwitch] Activation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Kill Switch を無効化
 */
export async function deactivateKillSwitch(
  deactivatedBy: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('n3_system_flags')
      .upsert({
        id: 'global',
        kill_switch: false,
        kill_switch_reason: null,
        kill_switch_activated_at: null,
        kill_switch_activated_by: null,
        auto_resume_at: null,
        paused_tools: [],
        updated_at: new Date().toISOString(),
      });
    
    if (error) {
      console.error('[KillSwitch] Deactivation error:', error);
      return { success: false, error: error.message };
    }
    
    console.log(`[KillSwitch] ✅ DEACTIVATED by ${deactivatedBy}: ${reason || 'Manual deactivation'}`);
    
    return { success: true };
  } catch (error) {
    console.error('[KillSwitch] Deactivation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// ============================================================
// ガード関数
// ============================================================

/**
 * Kill Switch チェック（Dispatch前に呼び出す）
 * 有効な場合は KillSwitchActiveError をスロー
 */
export async function checkKillSwitch(toolId?: string): Promise<void> {
  const status = await getKillSwitchStatus();
  
  // グローバルKill Switchがアクティブ
  if (status.active) {
    throw new KillSwitchActiveError(status);
  }
  
  // 特定ツールが停止中
  if (toolId && status.pausedTools.includes(toolId)) {
    throw new KillSwitchActiveError({
      ...status,
      active: true,
      reason: `Tool "${toolId}" is paused`,
    });
  }
}

/**
 * Kill Switch チェック（例外を投げない版）
 */
export async function isSystemHalted(toolId?: string): Promise<boolean> {
  try {
    await checkKillSwitch(toolId);
    return false;
  } catch (error) {
    if (error instanceof KillSwitchActiveError) {
      return true;
    }
    // その他のエラーはセーフモード（実行許可）
    return false;
  }
}

/**
 * 特定ツールを一時停止
 */
export async function pauseTool(
  toolId: string,
  pausedBy: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    // 現在の停止ツールリストを取得
    const { data } = await supabase
      .from('n3_system_flags')
      .select('paused_tools')
      .single();
    
    const currentPaused = (data?.paused_tools as string[]) || [];
    
    if (currentPaused.includes(toolId)) {
      return { success: true }; // 既に停止中
    }
    
    const { error } = await supabase
      .from('n3_system_flags')
      .upsert({
        id: 'global',
        paused_tools: [...currentPaused, toolId],
        updated_at: new Date().toISOString(),
      });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    console.log(`[KillSwitch] Tool "${toolId}" paused by ${pausedBy}: ${reason || 'No reason'}`);
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * 特定ツールの一時停止を解除
 */
export async function resumeTool(
  toolId: string,
  resumedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    // 現在の停止ツールリストを取得
    const { data } = await supabase
      .from('n3_system_flags')
      .select('paused_tools')
      .single();
    
    const currentPaused = (data?.paused_tools as string[]) || [];
    
    if (!currentPaused.includes(toolId)) {
      return { success: true }; // 既に停止中でない
    }
    
    const { error } = await supabase
      .from('n3_system_flags')
      .upsert({
        id: 'global',
        paused_tools: currentPaused.filter(t => t !== toolId),
        updated_at: new Date().toISOString(),
      });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    console.log(`[KillSwitch] Tool "${toolId}" resumed by ${resumedBy}`);
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
