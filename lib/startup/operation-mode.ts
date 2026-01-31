// lib/startup/operation-mode.ts
/**
 * 🎛️ Phase G: 運用モード管理
 * 
 * DEV / STAGING / PROD モードの管理
 */

import { createClient } from '@/lib/supabase';

// ============================================================
// 型定義
// ============================================================

export type OperationMode = 'dev' | 'staging' | 'prod';

export interface OperationModeConfig {
  mode: OperationMode;
  label: string;
  description: string;
  automation: {
    schedulerEnabled: boolean;
    pipelineEnabled: boolean;
    autoListingEnabled: boolean;
  };
  dispatch: {
    enabled: boolean;
    target: 'local' | 'n8n' | 'mock';
  };
  rateLimit: {
    multiplier: number; // 1.0 = 通常, 0.5 = 緩和, 2.0 = 厳格
  };
  safety: {
    requireApproval: boolean;
    maxConcurrentJobs: number;
    maxListingsPerHour: number;
  };
}

export interface ModeStatus {
  currentMode: OperationMode;
  config: OperationModeConfig;
  changedAt: Date | null;
  changedBy: string | null;
  canTransitionTo: OperationMode[];
}

// ============================================================
// モード設定
// ============================================================

export const MODE_CONFIGS: Record<OperationMode, OperationModeConfig> = {
  dev: {
    mode: 'dev',
    label: 'Development',
    description: '開発・デバッグ用。自動化は手動のみ。',
    automation: {
      schedulerEnabled: false,
      pipelineEnabled: false,
      autoListingEnabled: false,
    },
    dispatch: {
      enabled: true,
      target: 'local',
    },
    rateLimit: {
      multiplier: 0.5,
    },
    safety: {
      requireApproval: false,
      maxConcurrentJobs: 5,
      maxListingsPerHour: 100,
    },
  },
  staging: {
    mode: 'staging',
    label: 'Staging',
    description: 'テスト・検証用。制限付き自動化。',
    automation: {
      schedulerEnabled: false, // 手動起動のみ
      pipelineEnabled: false,
      autoListingEnabled: false,
    },
    dispatch: {
      enabled: true,
      target: 'n8n',
    },
    rateLimit: {
      multiplier: 1.0,
    },
    safety: {
      requireApproval: true,
      maxConcurrentJobs: 5,
      maxListingsPerHour: 50,
    },
  },
  prod: {
    mode: 'prod',
    label: 'Production',
    description: '本番運用。全自動化有効。',
    automation: {
      schedulerEnabled: true,
      pipelineEnabled: true,
      autoListingEnabled: true,
    },
    dispatch: {
      enabled: true,
      target: 'n8n',
    },
    rateLimit: {
      multiplier: 1.0,
    },
    safety: {
      requireApproval: true,
      maxConcurrentJobs: 10,
      maxListingsPerHour: 200,
    },
  },
};

// ============================================================
// モード遷移ルール
// ============================================================

const MODE_TRANSITIONS: Record<OperationMode, OperationMode[]> = {
  dev: ['staging'],
  staging: ['dev', 'prod'],
  prod: ['staging', 'dev'],
};

// ============================================================
// モード取得
// ============================================================

export async function getCurrentMode(): Promise<ModeStatus> {
  try {
    const supabase = createClient();
    
    const { data } = await supabase
      .from('n3_system_flags')
      .select('operation_mode, operation_mode_changed_at, operation_mode_changed_by')
      .eq('id', 'global')
      .single();
    
    const currentMode = (data?.operation_mode || 'dev') as OperationMode;
    
    return {
      currentMode,
      config: MODE_CONFIGS[currentMode],
      changedAt: data?.operation_mode_changed_at ? new Date(data.operation_mode_changed_at) : null,
      changedBy: data?.operation_mode_changed_by || null,
      canTransitionTo: MODE_TRANSITIONS[currentMode],
    };
  } catch (error) {
    console.error('[OperationMode] Failed to get current mode:', error);
    return {
      currentMode: 'dev',
      config: MODE_CONFIGS.dev,
      changedAt: null,
      changedBy: null,
      canTransitionTo: ['staging'],
    };
  }
}

// ============================================================
// モード変更
// ============================================================

export interface ModeChangeResult {
  success: boolean;
  previousMode?: OperationMode;
  newMode?: OperationMode;
  error?: string;
}

export async function changeMode(
  targetMode: OperationMode,
  userId?: string,
  userEmail?: string
): Promise<ModeChangeResult> {
  try {
    const current = await getCurrentMode();
    
    // 遷移可能性チェック
    if (!current.canTransitionTo.includes(targetMode)) {
      return {
        success: false,
        error: `Cannot transition from ${current.currentMode} to ${targetMode}`,
      };
    }
    
    const supabase = createClient();
    
    const { error } = await supabase
      .from('n3_system_flags')
      .update({
        operation_mode: targetMode,
        operation_mode_changed_at: new Date().toISOString(),
        operation_mode_changed_by: userEmail || userId || 'system',
        updated_at: new Date().toISOString(),
      })
      .eq('id', 'global');
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    // PROD → その他への変更時は自動化を停止
    if (current.currentMode === 'prod' && targetMode !== 'prod') {
      await supabase
        .from('n3_system_flags')
        .update({
          automation_enabled: false,
        })
        .eq('id', 'global');
    }
    
    return {
      success: true,
      previousMode: current.currentMode,
      newMode: targetMode,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================
// モード固有の設定取得
// ============================================================

export function getModeConfig(mode: OperationMode): OperationModeConfig {
  return MODE_CONFIGS[mode];
}

export function isAutomationAllowed(mode: OperationMode): boolean {
  const config = MODE_CONFIGS[mode];
  return config.automation.schedulerEnabled;
}

export function isPipelineAllowed(mode: OperationMode): boolean {
  const config = MODE_CONFIGS[mode];
  return config.automation.pipelineEnabled;
}

export function getDispatchTarget(mode: OperationMode): 'local' | 'n8n' | 'mock' {
  const config = MODE_CONFIGS[mode];
  return config.dispatch.target;
}
