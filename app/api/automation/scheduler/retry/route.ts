// app/api/automation/scheduler/retry/route.ts
/**
 * 🔄 Master Scheduler - Retry API
 * 
 * Phase E-1: 自律実行エンジン
 * 
 * 失敗タスクのリトライスケジュール
 * Exponential Backoff 実装
 * 
 * @usage POST /api/automation/scheduler/retry
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// ============================================================
// POST /api/automation/scheduler/retry
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schedule_id, delay_minutes } = body;
    
    if (!schedule_id) {
      return NextResponse.json(
        { success: false, error: 'schedule_id is required' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    // 次回実行時刻を設定（Exponential Backoff）
    const delayMs = (delay_minutes || 2) * 60 * 1000;
    const nextRunAt = new Date(Date.now() + delayMs).toISOString();
    
    const { error } = await supabase
      .from('n3_automation_settings')
      .update({
        next_run_at: nextRunAt,
        last_status: 'retry_scheduled',
      })
      .eq('id', schedule_id);
    
    if (error) {
      console.error('[Scheduler Retry] Update error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      next_run_at: nextRunAt,
      delay_minutes: delay_minutes || 2,
    });
    
  } catch (error: any) {
    console.error('[Scheduler Retry] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
