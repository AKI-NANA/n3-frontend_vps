// app/api/automation/scheduler/quarantine/route.ts
/**
 * 🔒 Master Scheduler - Quarantine API
 * 
 * Phase E-1 / E-3: 失敗自動復旧
 * 
 * 3回失敗したタスクを隔離（無効化）
 * 
 * @usage POST /api/automation/scheduler/quarantine
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { logExecution } from '@/lib/guards/audit-log';

// ============================================================
// POST /api/automation/scheduler/quarantine
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schedule_id, tool_id, reason, last_error } = body;
    
    if (!schedule_id || !tool_id) {
      return NextResponse.json(
        { success: false, error: 'schedule_id and tool_id are required' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    const now = new Date().toISOString();
    
    // 自動化設定を無効化
    const { error: updateError } = await supabase
      .from('n3_automation_settings')
      .update({
        enabled: false,
        last_status: 'quarantined',
        quarantined_at: now,
        quarantine_reason: reason || '3回連続失敗',
        last_error: last_error,
      })
      .eq('id', schedule_id);
    
    if (updateError) {
      console.error('[Scheduler Quarantine] Update error:', updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }
    
    // 隔離ログを記録
    await supabase
      .from('n3_quarantine_logs')
      .insert({
        schedule_id,
        tool_id,
        reason: reason || '3回連続失敗',
        last_error,
        quarantined_at: now,
      });
    
    // 監査ログにも記録
    await logExecution({
      type: 'system',
      tool_id,
      status: 'blocked',
      error_message: `Tool quarantined: ${reason || '3回連続失敗'}`,
      metadata: {
        source: 'master-scheduler',
        schedule_id,
        action: 'quarantine',
        last_error,
      },
    });
    
    // 通知送信（ChatWork/Slack等）
    try {
      const notifyUrl = process.env.N8N_BASE_URL 
        ? `${process.env.N8N_BASE_URL}/webhook/notification`
        : null;
      
      if (notifyUrl) {
        await fetch(notifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'quarantine',
            tool_id,
            reason: reason || '3回連続失敗',
            last_error,
            timestamp: now,
          }),
        }).catch(() => {}); // 通知失敗は無視
      }
    } catch (e) {
      // 通知エラーは無視
    }
    
    return NextResponse.json({
      success: true,
      quarantined: true,
      tool_id,
      reason: reason || '3回連続失敗',
    });
    
  } catch (error: any) {
    console.error('[Scheduler Quarantine] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
