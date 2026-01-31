// lib/monitoring/workflow-logger.ts
/**
 * N3 Empire OS - ワークフロー監視・ログ共通ライブラリ
 * 
 * 機能:
 * - workflow_logs への保存
 * - GLOBAL_STOP チェック
 * - API呼び出しカウント
 * - Chatwork通知フォーマット生成
 */

import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// ============================================================
// 型定義
// ============================================================

export type WorkflowType = 'research' | 'listing' | 'stock' | 'price' | 'sync' | 'cron';
export type WorkflowStatus = 'success' | 'error' | 'partial';

export interface WorkflowLogEntry {
  workflow_name: string;
  workflow_type: WorkflowType;
  status: WorkflowStatus;
  start_time: string;
  end_time?: string;
  duration_sec?: number;
  input_count?: number;
  output_count?: number;
  error_count?: number;
  error_message?: string;
  error_node?: string;
  meta_json?: Record<string, any>;
}

export interface WorkflowResult {
  success: boolean;
  processed: number;
  pending?: number;
  approved?: number;
  errors: number;
  duration_ms: number;
  meta?: Record<string, any>;
}

// ============================================================
// GLOBAL_STOP チェック
// ============================================================

export async function checkGlobalStop(): Promise<{ stopped: boolean; reason?: string }> {
  // 環境変数チェック
  if (process.env.GLOBAL_STOP === 'true' || process.env.EMERGENCY_STOP === 'true') {
    return { stopped: true, reason: 'env_flag' };
  }

  try {
    const supabase = await createClient();
    
    // DB チェック
    const { data: globalStop } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'global_stop')
      .single();

    if (globalStop?.value === true || globalStop?.value === 'true') {
      return { stopped: true, reason: 'db_global_stop' };
    }

    const { data: emergencyStop } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'emergency_stop')
      .single();

    if (emergencyStop?.value === true || emergencyStop?.value === 'true') {
      return { stopped: true, reason: 'db_emergency_stop' };
    }

    return { stopped: false };
  } catch (error) {
    console.error('checkGlobalStop error:', error);
    return { stopped: false };
  }
}

// ============================================================
// ワークフローログ保存
// ============================================================

export async function saveWorkflowLog(entry: WorkflowLogEntry): Promise<string | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('workflow_logs')
      .insert({
        workflow_name: entry.workflow_name,
        workflow_type: entry.workflow_type,
        status: entry.status,
        start_time: entry.start_time,
        end_time: entry.end_time || new Date().toISOString(),
        duration_sec: entry.duration_sec,
        input_count: entry.input_count || 0,
        output_count: entry.output_count || 0,
        error_count: entry.error_count || 0,
        error_message: entry.error_message,
        error_node: entry.error_node,
        meta_json: entry.meta_json,
      })
      .select('id')
      .single();

    if (error) {
      console.error('saveWorkflowLog error:', error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error('saveWorkflowLog error:', error);
    return null;
  }
}

// ============================================================
// リサーチ再取得防止キャッシュ
// ============================================================

export function generateUrlHash(url: string): string {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 32);
}

export async function checkFetchCache(url: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const hash = generateUrlHash(url);

    const { data } = await supabase
      .from('research_fetch_cache')
      .select('id')
      .eq('url_hash', hash)
      .gt('expires_at', new Date().toISOString())
      .single();

    return !!data;
  } catch {
    return false;
  }
}

export async function addFetchCache(url: string, asin?: string): Promise<void> {
  try {
    const supabase = await createClient();
    const hash = generateUrlHash(url);

    await supabase
      .from('research_fetch_cache')
      .upsert({
        url_hash: hash,
        source_url: url,
        asin: asin,
        fetched_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: 'url_hash' });
  } catch (error) {
    console.error('addFetchCache error:', error);
  }
}

// ============================================================
// MAX_FETCH_PER_RUN 取得
// ============================================================

export async function getMaxFetchPerRun(): Promise<number> {
  try {
    const supabase = await createClient();
    
    const { data } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'max_fetch_per_run')
      .single();

    return parseInt(data?.value || '50', 10);
  } catch {
    return 50;
  }
}

// ============================================================
// API呼び出しカウント更新
// ============================================================

export async function incrementApiCallCount(
  type: 'research' | 'listing',
  count: number = 1,
  costUsd: number = 0
): Promise<void> {
  try {
    const supabase = await createClient();
    
    const { data: current } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'api_call_stats')
      .single();

    const stats = current?.value || {
      research: { daily_count: 0, daily_cost_usd: 0, last_reset: null },
      listing: { daily_count: 0, last_reset: null },
    };

    const today = new Date().toISOString().split('T')[0];
    
    // 日付が変わったらリセット
    if (stats[type]?.last_reset !== today) {
      stats[type] = {
        daily_count: 0,
        daily_cost_usd: 0,
        last_reset: today,
      };
    }

    stats[type].daily_count += count;
    if (type === 'research' && costUsd > 0) {
      stats[type].daily_cost_usd = (stats[type].daily_cost_usd || 0) + costUsd;
    }

    await supabase
      .from('system_config')
      .upsert({
        key: 'api_call_stats',
        value: stats,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' });
  } catch (error) {
    console.error('incrementApiCallCount error:', error);
  }
}

// ============================================================
// Chatwork通知フォーマット生成
// ============================================================

export function formatSuccessNotification(params: {
  workflowName: string;
  result: WorkflowResult;
  appUrl?: string;
}): string {
  const { workflowName, result, appUrl } = params;
  const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  
  let message = `[info][title]【N3 Empire 自動処理 完了】[/title]`;
  message += `日時: ${timestamp}\n`;
  message += `Workflow: ${workflowName}\n\n`;
  message += `■ 実行結果\n`;
  message += `処理件数: ${result.processed}件\n`;
  
  if (result.pending !== undefined) {
    message += `Pending送信: ${result.pending}件\n`;
  }
  if (result.approved !== undefined) {
    message += `承認: ${result.approved}件\n`;
  }
  if (result.errors > 0) {
    message += `エラー: ${result.errors}件\n`;
  }
  
  message += `\n処理時間: ${(result.duration_ms / 1000).toFixed(1)}秒\n`;
  
  if (appUrl) {
    message += `\n管理画面:\n${appUrl}/tools/editing-n3`;
  }
  
  message += `[/info]`;
  return message;
}

export function formatErrorNotification(params: {
  workflowName: string;
  error: string;
  nodeName?: string;
}): string {
  const { workflowName, error, nodeName } = params;
  const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  
  let message = `[info][title]【⚠ 自動処理エラー】[/title]`;
  message += `Workflow: ${workflowName}\n`;
  message += `日時: ${timestamp}\n\n`;
  message += `Error:\n${error}\n`;
  
  if (nodeName) {
    message += `\n停止ポイント:\n${nodeName}\n`;
  }
  
  message += `\n即確認推奨[/info]`;
  return message;
}

// ============================================================
// 運用サマリー取得
// ============================================================

export interface DailySummary {
  date: string;
  research: { count: number; success: number; error: number; output: number };
  listing: { count: number; success: number; error: number; output: number };
  stock: { count: number; success: number; error: number; output: number };
  price: { count: number; success: number; error: number; output: number };
}

export async function getTodaySummary(): Promise<DailySummary> {
  const today = new Date().toISOString().split('T')[0];
  const empty = { count: 0, success: 0, error: 0, output: 0 };
  
  try {
    const supabase = await createClient();
    
    const { data } = await supabase
      .from('workflow_logs')
      .select('workflow_type, status, output_count')
      .gte('created_at', `${today}T00:00:00Z`)
      .lt('created_at', `${today}T23:59:59Z`);

    const summary: DailySummary = {
      date: today,
      research: { ...empty },
      listing: { ...empty },
      stock: { ...empty },
      price: { ...empty },
    };

    for (const log of data || []) {
      const type = log.workflow_type as keyof Omit<DailySummary, 'date'>;
      if (summary[type]) {
        summary[type].count++;
        if (log.status === 'success') summary[type].success++;
        if (log.status === 'error') summary[type].error++;
        summary[type].output += log.output_count || 0;
      }
    }

    return summary;
  } catch {
    return {
      date: today,
      research: { ...empty },
      listing: { ...empty },
      stock: { ...empty },
      price: { ...empty },
    };
  }
}

export async function getRecentErrors(hours: number = 24): Promise<Array<{
  id: string;
  workflow_name: string;
  workflow_type: string;
  error_message: string;
  created_at: string;
}>> {
  try {
    const supabase = await createClient();
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    
    const { data } = await supabase
      .from('workflow_logs')
      .select('id, workflow_name, workflow_type, error_message, created_at')
      .eq('status', 'error')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(20);

    return data || [];
  } catch {
    return [];
  }
}
