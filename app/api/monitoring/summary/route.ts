// app/api/monitoring/summary/route.ts
/**
 * Operations Monitor API
 * - 今日の実行状況
 * - ワークフロー履歴
 * - 異常アラート
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  getTodaySummary, 
  getRecentErrors,
  checkGlobalStop,
} from '@/lib/monitoring/workflow-logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = await createClient();

    // 1. 今日のサマリー
    const todaySummary = await getTodaySummary();

    // 2. 直近のエラー（24時間）
    const recentErrors = await getRecentErrors(24);

    // 3. ワークフロー履歴
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data: history } = await supabase
      .from('workflow_logs')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(limit);

    // 4. システム状態
    const globalStop = await checkGlobalStop();
    
    const { data: apiStats } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'api_call_stats')
      .single();

    // 5. 日別集計
    const { data: dailyStats } = await supabase
      .from('workflow_logs')
      .select('created_at, workflow_type, status, output_count')
      .gte('created_at', since);

    const dailyAggregation: Record<string, {
      date: string;
      total: number;
      success: number;
      error: number;
      output: number;
    }> = {};

    for (const log of dailyStats || []) {
      const date = log.created_at.split('T')[0];
      if (!dailyAggregation[date]) {
        dailyAggregation[date] = { date, total: 0, success: 0, error: 0, output: 0 };
      }
      dailyAggregation[date].total++;
      if (log.status === 'success') dailyAggregation[date].success++;
      if (log.status === 'error') dailyAggregation[date].error++;
      dailyAggregation[date].output += log.output_count || 0;
    }

    return NextResponse.json({
      success: true,
      data: {
        today: todaySummary,
        recent_errors: recentErrors,
        history: history || [],
        daily_stats: Object.values(dailyAggregation).sort((a, b) => 
          b.date.localeCompare(a.date)
        ),
        system_status: {
          global_stop: globalStop,
          api_stats: apiStats?.value,
          dry_run: process.env.DRY_RUN === 'true',
          auto_approve: process.env.RESEARCH_AUTO_APPROVE === 'true',
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
