// app/api/automation/scheduler/tasks/route.ts
/**
 * 🕐 Master Scheduler - Tasks API
 * 
 * Phase E-1: 自律実行エンジン
 * 
 * n8n Master Scheduler から呼び出され、
 * 現在実行すべきタスクを返す
 * 
 * @usage GET /api/automation/scheduler/tasks
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { getKillSwitchStatus } from '@/lib/guards/kill-switch';
import { canExecute } from '@/lib/guards/concurrency-guard';

// ============================================================
// 型定義
// ============================================================

interface ScheduledTask {
  id: string;
  tool_id: string;
  tool_name: string;
  category: string;
  action: string;
  params: Record<string, any>;
  priority: number;
  retry_count: number;
}

interface AutomationSetting {
  id: string;
  tool_id: string;
  tool_name: string;
  category: string;
  enabled: boolean;
  cron_expression: string | null;
  run_window_start: string | null;
  run_window_end: string | null;
  priority: number;
  last_run_at: string | null;
  next_run_at: string | null;
  params: Record<string, any>;
  retry_count: number;
}

// ============================================================
// 時間帯チェック
// ============================================================

function isWithinTimeWindow(
  start: string | null,
  end: string | null
): boolean {
  if (!start || !end) return true; // 時間帯指定なし = 常時実行可
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  // 日をまたぐ場合（例: 22:00 - 06:00）
  if (startMinutes > endMinutes) {
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
  
  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

// ============================================================
// 次回実行時刻チェック
// ============================================================

function shouldRunNow(setting: AutomationSetting): boolean {
  // next_run_at が設定されている場合
  if (setting.next_run_at) {
    const nextRun = new Date(setting.next_run_at);
    return new Date() >= nextRun;
  }
  
  // last_run_at から10分以上経過しているか
  if (setting.last_run_at) {
    const lastRun = new Date(setting.last_run_at);
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    return lastRun < tenMinutesAgo;
  }
  
  // 初回実行
  return true;
}

// ============================================================
// GET /api/automation/scheduler/tasks
// ============================================================

export async function GET(request: NextRequest) {
  try {
    // Kill Switch チェック
    const killSwitchStatus = await getKillSwitchStatus();
    if (killSwitchStatus.active) {
      return NextResponse.json({
        success: true,
        tasks: [],
        message: 'Kill Switch is active. No tasks scheduled.',
        killSwitch: true,
      });
    }
    
    const supabase = createClient();
    
    // マスター自動化スイッチ確認
    const { data: masterSwitch } = await supabase
      .from('n3_system_flags')
      .select('automation_enabled')
      .eq('id', 'global')
      .single();
    
    if (masterSwitch && masterSwitch.automation_enabled === false) {
      return NextResponse.json({
        success: true,
        tasks: [],
        message: 'Master automation is disabled.',
        automationDisabled: true,
      });
    }
    
    // 有効な自動化設定を取得
    const { data: settings, error } = await supabase
      .from('n3_automation_settings')
      .select('*')
      .eq('enabled', true)
      .order('priority', { ascending: false });
    
    if (error) {
      console.error('[Scheduler] Failed to fetch settings:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    if (!settings || settings.length === 0) {
      return NextResponse.json({
        success: true,
        tasks: [],
        message: 'No enabled automation settings found.',
      });
    }
    
    // 実行可能なタスクをフィルタリング
    const tasks: ScheduledTask[] = [];
    
    for (const setting of settings as AutomationSetting[]) {
      // 時間帯チェック
      if (!isWithinTimeWindow(setting.run_window_start, setting.run_window_end)) {
        continue;
      }
      
      // 実行タイミングチェック
      if (!shouldRunNow(setting)) {
        continue;
      }
      
      // Kill Switch で特定ツールが停止されていないか
      if (killSwitchStatus.pausedTools.includes(setting.tool_id)) {
        continue;
      }
      
      // 同時実行制限チェック
      const jobType = setting.category || setting.tool_id.split('-')[0];
      if (!(await canExecute(jobType))) {
        continue;
      }
      
      tasks.push({
        id: setting.id,
        tool_id: setting.tool_id,
        tool_name: setting.tool_name,
        category: setting.category,
        action: 'execute',
        params: setting.params || {},
        priority: setting.priority,
        retry_count: setting.retry_count || 0,
      });
    }
    
    // 優先度でソート
    tasks.sort((a, b) => b.priority - a.priority);
    
    return NextResponse.json({
      success: true,
      tasks,
      total: tasks.length,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('[Scheduler] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
