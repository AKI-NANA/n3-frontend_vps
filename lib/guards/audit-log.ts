// lib/guards/audit-log.ts
/**
 * 📋 Phase D-Core: Audit Log
 * 
 * 実行証跡の保存
 * 
 * 記録対象:
 * - ツール実行履歴
 * - Dispatch結果
 * - Kill Switch操作
 * - 権限エラー
 */

import { createClient } from '@/lib/supabase';

// ============================================================
// 型定義
// ============================================================

export type AuditLogType = 
  | 'dispatch'      // Dispatch実行
  | 'kill_switch'   // Kill Switch操作
  | 'permission'    // 権限関連
  | 'execution'     // ツール実行
  | 'error'         // エラー
  | 'system';       // システム操作

export type AuditLogStatus = 
  | 'started'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'blocked';

export interface AuditLogEntry {
  id?: string;
  type: AuditLogType;
  tool_id: string;
  user_id?: string;
  user_email?: string;
  status: AuditLogStatus;
  duration_ms?: number;
  input_summary?: string;
  output_summary?: string;
  error_message?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface AuditLogFilter {
  type?: AuditLogType;
  tool_id?: string;
  user_id?: string;
  status?: AuditLogStatus;
  from_date?: Date;
  to_date?: Date;
  limit?: number;
}

// ============================================================
// ログ記録
// ============================================================

/**
 * 実行ログを記録
 */
export async function logExecution(
  entry: Omit<AuditLogEntry, 'id' | 'created_at'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('n3_execution_logs')
      .insert({
        type: entry.type,
        tool_id: entry.tool_id,
        user_id: entry.user_id,
        user_email: entry.user_email,
        status: entry.status,
        duration_ms: entry.duration_ms,
        input_summary: entry.input_summary,
        output_summary: entry.output_summary,
        error_message: entry.error_message,
        metadata: entry.metadata,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('[AuditLog] Error logging execution:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('[AuditLog] Error logging execution:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Dispatch開始ログを記録
 */
export async function logDispatchStart(params: {
  toolId: string;
  userId?: string;
  userEmail?: string;
  input?: unknown;
}): Promise<string | null> {
  const result = await logExecution({
    type: 'dispatch',
    tool_id: params.toolId,
    user_id: params.userId,
    user_email: params.userEmail,
    status: 'started',
    input_summary: params.input 
      ? JSON.stringify(params.input).substring(0, 500) 
      : undefined,
  });
  
  return result.id || null;
}

/**
 * Dispatch完了ログを記録
 */
export async function logDispatchComplete(params: {
  logId?: string;
  toolId: string;
  userId?: string;
  userEmail?: string;
  durationMs: number;
  output?: unknown;
  success: boolean;
  error?: string;
}): Promise<void> {
  if (params.logId) {
    // 既存ログを更新
    try {
      const supabase = createClient();
      
      await supabase
        .from('n3_execution_logs')
        .update({
          status: params.success ? 'completed' : 'failed',
          duration_ms: params.durationMs,
          output_summary: params.output 
            ? JSON.stringify(params.output).substring(0, 500) 
            : undefined,
          error_message: params.error,
        })
        .eq('id', params.logId);
    } catch (error) {
      console.error('[AuditLog] Error updating log:', error);
    }
  } else {
    // 新規ログを作成
    await logExecution({
      type: 'dispatch',
      tool_id: params.toolId,
      user_id: params.userId,
      user_email: params.userEmail,
      status: params.success ? 'completed' : 'failed',
      duration_ms: params.durationMs,
      output_summary: params.output 
        ? JSON.stringify(params.output).substring(0, 500) 
        : undefined,
      error_message: params.error,
    });
  }
}

/**
 * Kill Switch操作ログを記録
 */
export async function logKillSwitchOperation(params: {
  action: 'activate' | 'deactivate';
  userId?: string;
  userEmail?: string;
  reason?: string;
}): Promise<void> {
  await logExecution({
    type: 'kill_switch',
    tool_id: 'kill-switch',
    user_id: params.userId,
    user_email: params.userEmail,
    status: 'completed',
    metadata: {
      action: params.action,
      reason: params.reason,
    },
  });
}

/**
 * 権限エラーログを記録
 */
export async function logPermissionDenied(params: {
  toolId: string;
  userId?: string;
  userEmail?: string;
  requiredRole?: string;
  currentRole?: string;
}): Promise<void> {
  await logExecution({
    type: 'permission',
    tool_id: params.toolId,
    user_id: params.userId,
    user_email: params.userEmail,
    status: 'blocked',
    error_message: `Permission denied. Required: ${params.requiredRole}, Current: ${params.currentRole}`,
    metadata: {
      requiredRole: params.requiredRole,
      currentRole: params.currentRole,
    },
  });
}

// ============================================================
// ログ取得
// ============================================================

/**
 * 実行ログを取得
 */
export async function getExecutionLogs(
  filter: AuditLogFilter = {}
): Promise<AuditLogEntry[]> {
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('n3_execution_logs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filter.type) {
      query = query.eq('type', filter.type);
    }
    
    if (filter.tool_id) {
      query = query.eq('tool_id', filter.tool_id);
    }
    
    if (filter.user_id) {
      query = query.eq('user_id', filter.user_id);
    }
    
    if (filter.status) {
      query = query.eq('status', filter.status);
    }
    
    if (filter.from_date) {
      query = query.gte('created_at', filter.from_date.toISOString());
    }
    
    if (filter.to_date) {
      query = query.lte('created_at', filter.to_date.toISOString());
    }
    
    if (filter.limit) {
      query = query.limit(filter.limit);
    } else {
      query = query.limit(100);
    }
    
    const { data, error } = await query;
    
    if (error || !data) {
      console.error('[AuditLog] Error getting logs:', error);
      return [];
    }
    
    return data as AuditLogEntry[];
  } catch (error) {
    console.error('[AuditLog] Error getting logs:', error);
    return [];
  }
}

/**
 * 今日のジョブ数を取得
 */
export async function getTodayJobCount(): Promise<{
  total: number;
  completed: number;
  failed: number;
  blocked: number;
}> {
  try {
    const supabase = createClient();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('n3_execution_logs')
      .select('status')
      .gte('created_at', today.toISOString());
    
    if (error || !data) {
      return { total: 0, completed: 0, failed: 0, blocked: 0 };
    }
    
    return {
      total: data.length,
      completed: data.filter(d => d.status === 'completed').length,
      failed: data.filter(d => d.status === 'failed').length,
      blocked: data.filter(d => d.status === 'blocked').length,
    };
  } catch (error) {
    console.error('[AuditLog] Error getting today count:', error);
    return { total: 0, completed: 0, failed: 0, blocked: 0 };
  }
}

/**
 * ツール別の統計を取得
 */
export async function getToolStats(
  days: number = 7
): Promise<Record<string, {
  total: number;
  completed: number;
  failed: number;
  avgDurationMs: number;
}>> {
  try {
    const supabase = createClient();
    
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('n3_execution_logs')
      .select('tool_id, status, duration_ms')
      .gte('created_at', fromDate.toISOString());
    
    if (error || !data) {
      return {};
    }
    
    const stats: Record<string, {
      total: number;
      completed: number;
      failed: number;
      totalDuration: number;
      completedCount: number;
    }> = {};
    
    for (const entry of data) {
      if (!stats[entry.tool_id]) {
        stats[entry.tool_id] = {
          total: 0,
          completed: 0,
          failed: 0,
          totalDuration: 0,
          completedCount: 0,
        };
      }
      
      stats[entry.tool_id].total++;
      
      if (entry.status === 'completed') {
        stats[entry.tool_id].completed++;
        if (entry.duration_ms) {
          stats[entry.tool_id].totalDuration += entry.duration_ms;
          stats[entry.tool_id].completedCount++;
        }
      } else if (entry.status === 'failed') {
        stats[entry.tool_id].failed++;
      }
    }
    
    // 平均時間を計算
    const result: Record<string, {
      total: number;
      completed: number;
      failed: number;
      avgDurationMs: number;
    }> = {};
    
    for (const [toolId, stat] of Object.entries(stats)) {
      result[toolId] = {
        total: stat.total,
        completed: stat.completed,
        failed: stat.failed,
        avgDurationMs: stat.completedCount > 0 
          ? Math.round(stat.totalDuration / stat.completedCount) 
          : 0,
      };
    }
    
    return result;
  } catch (error) {
    console.error('[AuditLog] Error getting tool stats:', error);
    return {};
  }
}
