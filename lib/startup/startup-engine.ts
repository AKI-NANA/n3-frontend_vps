// lib/startup/startup-engine.ts
/**
 * 🚀 Phase G: 起動エンジン
 * 
 * 段階的な起動処理を管理
 */

import { createClient } from '@/lib/supabase';
import { runPreflightCheck, PreflightResult } from './preflight-check';
import { getCurrentMode, changeMode, OperationMode } from './operation-mode';
import { logExecution } from '@/lib/guards/audit-log';

// ============================================================
// 型定義
// ============================================================

export type StartupPhase = 'idle' | 'preflight' | 'confirm' | 'warmup' | 'running' | 'stopping' | 'stopped' | 'error';

export interface StartupStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export interface StartupState {
  phase: StartupPhase;
  mode: OperationMode;
  steps: StartupStep[];
  preflightResult?: PreflightResult;
  startedAt?: Date;
  stoppedAt?: Date;
  startedBy?: string;
  stoppedBy?: string;
  error?: string;
}

export interface StartupResult {
  success: boolean;
  state: StartupState;
  error?: string;
}

// ============================================================
// 起動ステップ定義
// ============================================================

const STARTUP_STEPS: { id: string; name: string; delayMs: number }[] = [
  { id: 'init', name: 'Initialize System', delayMs: 1000 },
  { id: 'scheduler', name: 'Start Scheduler', delayMs: 5000 },
  { id: 'pipeline', name: 'Enable Pipeline', delayMs: 5000 },
  { id: 'automation', name: 'Enable Automation', delayMs: 3000 },
  { id: 'monitoring', name: 'Start Monitoring', delayMs: 2000 },
];

// ============================================================
// 状態管理
// ============================================================

let currentState: StartupState = {
  phase: 'idle',
  mode: 'dev',
  steps: [],
};

export function getStartupState(): StartupState {
  return { ...currentState };
}

// ============================================================
// 起動シーケンス
// ============================================================

export async function startSystem(
  targetMode: OperationMode,
  userId?: string,
  userEmail?: string,
  skipPreflight?: boolean
): Promise<StartupResult> {
  try {
    // 既に起動中
    if (currentState.phase === 'running') {
      return {
        success: false,
        state: currentState,
        error: 'System is already running',
      };
    }
    
    // ステップ初期化
    currentState = {
      phase: 'preflight',
      mode: targetMode,
      steps: STARTUP_STEPS.map(s => ({
        id: s.id,
        name: s.name,
        status: 'pending',
      })),
      startedBy: userEmail || userId,
      startedAt: new Date(),
    };
    
    // Pre-flight Check
    if (!skipPreflight && targetMode === 'prod') {
      const preflightResult = await runPreflightCheck();
      currentState.preflightResult = preflightResult;
      
      if (!preflightResult.passed) {
        currentState.phase = 'error';
        currentState.error = 'Pre-flight check failed';
        
        return {
          success: false,
          state: currentState,
          error: `Pre-flight check failed: ${preflightResult.blockers.join(', ')}`,
        };
      }
    }
    
    // モード変更
    const modeResult = await changeMode(targetMode, userId, userEmail);
    if (!modeResult.success) {
      currentState.phase = 'error';
      currentState.error = modeResult.error;
      
      return {
        success: false,
        state: currentState,
        error: modeResult.error,
      };
    }
    
    // Warmup フェーズ
    currentState.phase = 'warmup';
    
    const supabase = createClient();
    
    // ステップ実行
    for (let i = 0; i < STARTUP_STEPS.length; i++) {
      const step = STARTUP_STEPS[i];
      currentState.steps[i].status = 'running';
      currentState.steps[i].startedAt = new Date();
      
      try {
        // ステップ固有の処理
        switch (step.id) {
          case 'init':
            // システム初期化
            await supabase
              .from('n3_system_flags')
              .update({
                startup_phase: 'warmup',
                startup_started_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', 'global');
            break;
            
          case 'scheduler':
            // スケジューラー有効化（PRODのみ）
            if (targetMode === 'prod') {
              await supabase
                .from('n3_system_flags')
                .update({
                  scheduler_enabled: true,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', 'global');
            }
            break;
            
          case 'pipeline':
            // パイプライン有効化（PRODのみ）
            if (targetMode === 'prod') {
              await supabase
                .from('n3_system_flags')
                .update({
                  pipeline_enabled: true,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', 'global');
            }
            break;
            
          case 'automation':
            // 自動化有効化
            await supabase
              .from('n3_system_flags')
              .update({
                automation_enabled: targetMode === 'prod',
                updated_at: new Date().toISOString(),
              })
              .eq('id', 'global');
            break;
            
          case 'monitoring':
            // モニタリング開始
            await supabase
              .from('n3_system_flags')
              .update({
                monitoring_enabled: true,
                updated_at: new Date().toISOString(),
              })
              .eq('id', 'global');
            break;
        }
        
        // 遅延（段階的起動）
        await new Promise(resolve => setTimeout(resolve, step.delayMs));
        
        currentState.steps[i].status = 'completed';
        currentState.steps[i].completedAt = new Date();
        
      } catch (error: any) {
        currentState.steps[i].status = 'failed';
        currentState.steps[i].error = error.message;
        
        // 致命的エラーの場合は停止
        if (['init', 'scheduler'].includes(step.id)) {
          currentState.phase = 'error';
          currentState.error = `Step ${step.name} failed: ${error.message}`;
          
          return {
            success: false,
            state: currentState,
            error: currentState.error,
          };
        }
      }
    }
    
    // 起動完了
    currentState.phase = 'running';
    
    await supabase
      .from('n3_system_flags')
      .update({
        startup_phase: 'running',
        startup_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', 'global');
    
    // 監査ログ
    await logExecution({
      type: 'system',
      tool_id: 'startup-engine',
      status: 'completed',
      metadata: {
        action: 'start',
        mode: targetMode,
        startedBy: userEmail || userId,
      },
    });
    
    return {
      success: true,
      state: currentState,
    };
    
  } catch (error: any) {
    currentState.phase = 'error';
    currentState.error = error.message;
    
    return {
      success: false,
      state: currentState,
      error: error.message,
    };
  }
}

// ============================================================
// 停止シーケンス
// ============================================================

export async function stopSystem(
  userId?: string,
  userEmail?: string,
  emergency?: boolean
): Promise<StartupResult> {
  try {
    currentState.phase = 'stopping';
    currentState.stoppedBy = userEmail || userId;
    
    const supabase = createClient();
    
    // 緊急停止の場合は即座に全停止
    if (emergency) {
      await supabase
        .from('n3_system_flags')
        .update({
          kill_switch: true,
          kill_switch_reason: 'Emergency stop',
          kill_switch_activated_at: new Date().toISOString(),
          kill_switch_activated_by: userEmail || userId || 'system',
          automation_enabled: false,
          scheduler_enabled: false,
          pipeline_enabled: false,
          startup_phase: 'stopped',
          updated_at: new Date().toISOString(),
        })
        .eq('id', 'global');
    } else {
      // 通常停止
      await supabase
        .from('n3_system_flags')
        .update({
          automation_enabled: false,
          scheduler_enabled: false,
          pipeline_enabled: false,
          startup_phase: 'stopped',
          updated_at: new Date().toISOString(),
        })
        .eq('id', 'global');
    }
    
    currentState.phase = 'stopped';
    currentState.stoppedAt = new Date();
    
    // モードを DEV に戻す
    await changeMode('dev', userId, userEmail);
    currentState.mode = 'dev';
    
    // 監査ログ
    await logExecution({
      type: 'system',
      tool_id: 'startup-engine',
      status: 'completed',
      metadata: {
        action: emergency ? 'emergency_stop' : 'stop',
        stoppedBy: userEmail || userId,
      },
    });
    
    return {
      success: true,
      state: currentState,
    };
    
  } catch (error: any) {
    return {
      success: false,
      state: currentState,
      error: error.message,
    };
  }
}

// ============================================================
// 状態リセット
// ============================================================

export function resetStartupState(): void {
  currentState = {
    phase: 'idle',
    mode: 'dev',
    steps: [],
  };
}
