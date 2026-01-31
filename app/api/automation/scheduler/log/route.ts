// app/api/automation/scheduler/log/route.ts
/**
 * 📝 Master Scheduler - Log API
 * 
 * Phase E-1: 自律実行エンジン
 * 
 * スケジュール実行結果のログ記録
 * 
 * @usage POST /api/automation/scheduler/log
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { logExecution } from '@/lib/guards/audit-log';

// ============================================================
// POST /api/automation/scheduler/log
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schedule_id, tool_id, status, job_id, result, error, retry_count } = body;
    
    if (!schedule_id || !tool_id || !status) {
      return NextResponse.json(
        { success: false, error: 'schedule_id, tool_id, and status are required' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    const now = new Date().toISOString();
    
    // automation_settings を更新
    const updateData: Record<string, any> = {
      last_run_at: now,
      last_status: status,
    };
    
    if (status === 'completed') {
      // 成功時：リトライカウントをリセット、次回実行時刻を10分後に設定
      updateData.retry_count = 0;
      updateData.next_run_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    } else if (status === 'failed') {
      // 失敗時：リトライカウントを増加
      updateData.retry_count = (retry_count || 0);
      updateData.last_error = error;
    }
    
    const { error: updateError } = await supabase
      .from('n3_automation_settings')
      .update(updateData)
      .eq('id', schedule_id);
    
    if (updateError) {
      console.error('[Scheduler Log] Update error:', updateError);
    }
    
    // スケジューラー実行ログをテーブルに記録
    await supabase
      .from('n3_scheduler_logs')
      .insert({
        schedule_id,
        tool_id,
        status,
        job_id,
        result: result ? JSON.stringify(result).substring(0, 5000) : null,
        error_message: error,
        created_at: now,
      });
    
    // 監査ログにも記録
    await logExecution({
      type: 'execution',
      tool_id,
      status: status === 'completed' ? 'completed' : 'failed',
      error_message: error,
      metadata: {
        source: 'master-scheduler',
        schedule_id,
        job_id,
      },
    });
    
    return NextResponse.json({
      success: true,
      logged: true,
    });
    
  } catch (error: any) {
    console.error('[Scheduler Log] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
