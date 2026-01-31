// app/api/dispatch/metrics/route.ts
/**
 * 📊 Dispatch Metrics API
 * 
 * Phase 3C: Observability Layer
 * 
 * Tool別実行統計を取得
 * - 実行回数
 * - 成功率
 * - 平均処理時間
 * - エラー率
 * 
 * @usage GET /api/dispatch/metrics?period=24h
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// 型定義
// ============================================================

interface ToolMetrics {
  toolId: string;
  totalCount: number;
  successCount: number;
  failedCount: number;
  timeoutCount: number;
  cancelledCount: number;
  successRate: number;    // 0-100
  errorRate: number;      // 0-100
  avgDurationMs: number;
  minDurationMs: number;
  maxDurationMs: number;
  lastExecutedAt: string | null;
}

interface GlobalMetrics {
  period: string;
  totalJobs: number;
  activeJobs: number;
  pendingJobs: number;
  successRate: number;
  errorRate: number;
  avgDurationMs: number;
  toolMetrics: ToolMetrics[];
  topErrors: { toolId: string; error: string; count: number }[];
  hourlyDistribution: { hour: number; count: number }[];
}

// ============================================================
// Supabaseクライアント
// ============================================================

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient(url, key);
}

// ============================================================
// 期間パース
// ============================================================

function parsePeriod(period: string): number {
  const match = period.match(/^(\d+)(h|d|w)$/);
  if (!match) return 24 * 60 * 60 * 1000; // デフォルト: 24時間
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    case 'w': return value * 7 * 24 * 60 * 60 * 1000;
    default: return 24 * 60 * 60 * 1000;
  }
}

// ============================================================
// GET /api/dispatch/metrics
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '24h';
    const toolIdFilter = searchParams.get('toolId');
    
    const periodMs = parsePeriod(period);
    const since = new Date(Date.now() - periodMs).toISOString();
    
    const supabase = getSupabaseClient();
    
    // ─────────────────────────────────────────────
    // ジョブデータ取得
    // ─────────────────────────────────────────────
    
    let query = supabase
      .from('dispatch_jobs')
      .select('*')
      .gte('created_at', since);
    
    if (toolIdFilter) {
      query = query.eq('tool_id', toolIdFilter);
    }
    
    const { data: jobs, error } = await query;
    
    if (error) {
      console.error('[Dispatch/Metrics] Query error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    // ─────────────────────────────────────────────
    // Tool別集計
    // ─────────────────────────────────────────────
    
    const toolStatsMap = new Map<string, {
      total: number;
      success: number;
      failed: number;
      timeout: number;
      cancelled: number;
      durations: number[];
      lastExecutedAt: string | null;
    }>();
    
    const errorCounts = new Map<string, number>();
    const hourlyCount = new Map<number, number>();
    
    let activeJobs = 0;
    let pendingJobs = 0;
    
    for (const job of jobs || []) {
      const toolId = job.tool_id;
      
      // ツール別統計初期化
      if (!toolStatsMap.has(toolId)) {
        toolStatsMap.set(toolId, {
          total: 0,
          success: 0,
          failed: 0,
          timeout: 0,
          cancelled: 0,
          durations: [],
          lastExecutedAt: null,
        });
      }
      
      const stats = toolStatsMap.get(toolId)!;
      stats.total++;
      
      // ステータス別カウント
      switch (job.status) {
        case 'completed':
          stats.success++;
          break;
        case 'failed':
          stats.failed++;
          // エラー集計
          if (job.error) {
            const errorKey = `${toolId}:${job.error.slice(0, 100)}`;
            errorCounts.set(errorKey, (errorCounts.get(errorKey) || 0) + 1);
          }
          break;
        case 'timeout':
          stats.timeout++;
          break;
        case 'cancelled':
          stats.cancelled++;
          break;
        case 'running':
          activeJobs++;
          break;
        case 'pending':
          pendingJobs++;
          break;
      }
      
      // 処理時間記録
      if (job.started_at && job.finished_at) {
        const duration = new Date(job.finished_at).getTime() - new Date(job.started_at).getTime();
        stats.durations.push(duration);
      }
      
      // 最終実行日時更新
      if (!stats.lastExecutedAt || job.created_at > stats.lastExecutedAt) {
        stats.lastExecutedAt = job.created_at;
      }
      
      // 時間帯別集計
      const hour = new Date(job.created_at).getHours();
      hourlyCount.set(hour, (hourlyCount.get(hour) || 0) + 1);
    }
    
    // ─────────────────────────────────────────────
    // メトリクス変換
    // ─────────────────────────────────────────────
    
    const toolMetrics: ToolMetrics[] = [];
    let totalSuccess = 0;
    let totalFailed = 0;
    let allDurations: number[] = [];
    
    for (const [toolId, stats] of toolStatsMap.entries()) {
      totalSuccess += stats.success;
      totalFailed += stats.failed + stats.timeout;
      allDurations.push(...stats.durations);
      
      const completedCount = stats.success + stats.failed + stats.timeout + stats.cancelled;
      const successRate = completedCount > 0 ? (stats.success / completedCount) * 100 : 0;
      const errorRate = completedCount > 0 ? ((stats.failed + stats.timeout) / completedCount) * 100 : 0;
      const avgDuration = stats.durations.length > 0
        ? stats.durations.reduce((a, b) => a + b, 0) / stats.durations.length
        : 0;
      
      toolMetrics.push({
        toolId,
        totalCount: stats.total,
        successCount: stats.success,
        failedCount: stats.failed,
        timeoutCount: stats.timeout,
        cancelledCount: stats.cancelled,
        successRate: Math.round(successRate * 10) / 10,
        errorRate: Math.round(errorRate * 10) / 10,
        avgDurationMs: Math.round(avgDuration),
        minDurationMs: stats.durations.length > 0 ? Math.min(...stats.durations) : 0,
        maxDurationMs: stats.durations.length > 0 ? Math.max(...stats.durations) : 0,
        lastExecutedAt: stats.lastExecutedAt,
      });
    }
    
    // エラー率でソート
    toolMetrics.sort((a, b) => b.errorRate - a.errorRate);
    
    // Top Errors
    const topErrors = Array.from(errorCounts.entries())
      .map(([key, count]) => {
        const [toolId, ...errorParts] = key.split(':');
        return { toolId, error: errorParts.join(':'), count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // 時間帯分布
    const hourlyDistribution = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: hourlyCount.get(i) || 0,
    }));
    
    // グローバルメトリクス
    const totalCompleted = totalSuccess + totalFailed;
    const globalAvgDuration = allDurations.length > 0
      ? allDurations.reduce((a, b) => a + b, 0) / allDurations.length
      : 0;
    
    const metrics: GlobalMetrics = {
      period,
      totalJobs: jobs?.length || 0,
      activeJobs,
      pendingJobs,
      successRate: totalCompleted > 0 
        ? Math.round((totalSuccess / totalCompleted) * 1000) / 10 
        : 0,
      errorRate: totalCompleted > 0 
        ? Math.round((totalFailed / totalCompleted) * 1000) / 10 
        : 0,
      avgDurationMs: Math.round(globalAvgDuration),
      toolMetrics,
      topErrors,
      hourlyDistribution,
    };
    
    return NextResponse.json({
      success: true,
      ...metrics,
    });
    
  } catch (error: any) {
    console.error('[Dispatch/Metrics] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// OPTIONS（CORS対応）
// ============================================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
