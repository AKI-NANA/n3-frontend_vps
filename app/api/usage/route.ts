// app/api/usage/route.ts
/**
 * 📊 Usage API - 使用量メータリング
 * 
 * Phase 4C: Usage Metering
 * 
 * @usage GET /api/usage?period=month
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// 型定義
// ============================================================

interface UsageSummary {
  period: string;
  organizationId: string;
  plan: string;
  limits: {
    dispatchPerMonth: number;
    concurrentJobs: number;
    apiCallsPerDay: number;
  };
  usage: {
    totalDispatches: number;
    totalApiCalls: number;
    totalCost: number;
    totalTokens: number;
  };
  quotaUsage: {
    dispatchPercent: number;
    apiCallsPercent: number;
  };
  byTool: {
    toolId: string;
    count: number;
    cost: number;
  }[];
  daily: {
    date: string;
    dispatches: number;
    apiCalls: number;
    cost: number;
  }[];
}

// ============================================================
// Supabase Client
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
// GET /api/usage
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';
    const organizationId = searchParams.get('organizationId');
    
    // 仮実装: ヘッダーからorganizationIdを取得
    const orgId = organizationId || request.headers.get('x-organization-id');
    
    if (!orgId) {
      return NextResponse.json(
        { success: false, error: 'organizationId is required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseClient();
    
    // 期間計算
    const now = new Date();
    let startDate: Date;
    
    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    
    // Organization + Plan 取得
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('*, plans(*)')
      .eq('id', orgId)
      .single();
    
    if (orgError || !org) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }
    
    const planLimits = org.plans?.limits || {
      dispatch_per_month: 500,
      concurrent_jobs: 1,
      api_calls_per_day: 100,
    };
    
    // Usage Records 取得
    const { data: usageRecords, error: usageError } = await supabase
      .from('usage_records')
      .select('*')
      .eq('organization_id', orgId)
      .gte('recorded_at', startDate.toISOString())
      .order('recorded_at', { ascending: true });
    
    if (usageError) {
      console.error('[Usage] Query error:', usageError);
    }
    
    // Dispatch Jobs 取得
    const { data: dispatchJobs, error: jobError } = await supabase
      .from('dispatch_jobs')
      .select('tool_id, created_at')
      .eq('organization_id', orgId)
      .gte('created_at', startDate.toISOString());
    
    if (jobError) {
      console.error('[Usage] Jobs query error:', jobError);
    }
    
    // 集計
    const records = usageRecords || [];
    const jobs = dispatchJobs || [];
    
    const totalDispatches = jobs.length;
    const totalApiCalls = records.reduce((sum, r) => sum + (r.api_calls || 0), 0);
    const totalCost = records.reduce((sum, r) => sum + (parseFloat(r.cost_estimate) || 0), 0);
    const totalTokens = records.reduce((sum, r) => sum + (r.tokens_used || 0), 0);
    
    // Tool別集計
    const toolCounts = new Map<string, { count: number; cost: number }>();
    jobs.forEach(j => {
      const existing = toolCounts.get(j.tool_id) || { count: 0, cost: 0 };
      existing.count++;
      toolCounts.set(j.tool_id, existing);
    });
    records.forEach(r => {
      const existing = toolCounts.get(r.tool_id) || { count: 0, cost: 0 };
      existing.cost += parseFloat(r.cost_estimate) || 0;
      toolCounts.set(r.tool_id, existing);
    });
    
    const byTool = Array.from(toolCounts.entries())
      .map(([toolId, data]) => ({ toolId, ...data }))
      .sort((a, b) => b.count - a.count);
    
    // 日別集計
    const dailyMap = new Map<string, { dispatches: number; apiCalls: number; cost: number }>();
    
    jobs.forEach(j => {
      const date = j.created_at.split('T')[0];
      const existing = dailyMap.get(date) || { dispatches: 0, apiCalls: 0, cost: 0 };
      existing.dispatches++;
      dailyMap.set(date, existing);
    });
    
    records.forEach(r => {
      const date = r.recorded_at.split('T')[0];
      const existing = dailyMap.get(date) || { dispatches: 0, apiCalls: 0, cost: 0 };
      existing.apiCalls += r.api_calls || 0;
      existing.cost += parseFloat(r.cost_estimate) || 0;
      dailyMap.set(date, existing);
    });
    
    const daily = Array.from(dailyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Quota計算
    const dispatchLimit = planLimits.dispatch_per_month;
    const apiCallLimit = planLimits.api_calls_per_day;
    
    const dispatchPercent = dispatchLimit === -1 ? 0 : Math.round((totalDispatches / dispatchLimit) * 100);
    
    // 今日のAPI呼び出し数
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayApiCalls = records
      .filter(r => new Date(r.recorded_at) >= todayStart)
      .reduce((sum, r) => sum + (r.api_calls || 0), 0);
    const apiCallsPercent = apiCallLimit === -1 ? 0 : Math.round((todayApiCalls / apiCallLimit) * 100);
    
    const summary: UsageSummary = {
      period,
      organizationId: orgId,
      plan: org.plan,
      limits: {
        dispatchPerMonth: dispatchLimit,
        concurrentJobs: planLimits.concurrent_jobs,
        apiCallsPerDay: apiCallLimit,
      },
      usage: {
        totalDispatches,
        totalApiCalls,
        totalCost: Math.round(totalCost * 100) / 100,
        totalTokens,
      },
      quotaUsage: {
        dispatchPercent: Math.min(dispatchPercent, 100),
        apiCallsPercent: Math.min(apiCallsPercent, 100),
      },
      byTool,
      daily,
    };
    
    return NextResponse.json({
      success: true,
      ...summary,
    });
    
  } catch (error: any) {
    console.error('[Usage] Error:', error);
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Organization-Id',
    },
  });
}
