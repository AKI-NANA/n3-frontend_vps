// app/api/dispatch/health/route.ts
/**
 * 📊 System Health API
 * 
 * Phase D-Core: システム健全性確認
 * 
 * @usage GET /api/dispatch/health
 */

import { NextRequest, NextResponse } from 'next/server';
import { getKillSwitchStatus } from '@/lib/guards/kill-switch';
import { getJobLockStatus } from '@/lib/guards/concurrency-guard';
import { getTodayJobCount } from '@/lib/guards/audit-log';
import { getExecutionMode, getExecutionModeInfo } from '@/lib/guards/execution-mode';

export async function GET(request: NextRequest) {
  try {
    // Kill Switch 状態
    const killSwitchStatus = await getKillSwitchStatus();
    
    // 同時実行状況
    const jobLocks = await getJobLockStatus();
    const concurrencyLimits: Record<string, { current: number; max: number }> = {};
    let activeJobs = 0;
    
    for (const lock of jobLocks) {
      concurrencyLimits[lock.job_type] = {
        current: lock.active_count,
        max: lock.max_limit,
      };
      activeJobs += lock.active_count;
    }
    
    // 今日のジョブ数
    const todayJobs = await getTodayJobCount();
    
    // 実行モード
    const executionMode = getExecutionMode();
    
    return NextResponse.json({
      success: true,
      health: {
        killSwitch: {
          active: killSwitchStatus.active,
          reason: killSwitchStatus.reason,
          activatedAt: killSwitchStatus.activatedAt?.toISOString(),
          activatedBy: killSwitchStatus.activatedBy,
          autoResumeAt: killSwitchStatus.autoResumeAt?.toISOString(),
          pausedTools: killSwitchStatus.pausedTools,
        },
        concurrency: {
          activeJobs,
          limits: concurrencyLimits,
        },
        executionMode: executionMode.mode,
        executionModeInfo: getExecutionModeInfo(),
        jobs24h: {
          total: todayJobs.total,
          completed: todayJobs.completed,
          failed: todayJobs.failed,
          blocked: todayJobs.blocked,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[Health API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
