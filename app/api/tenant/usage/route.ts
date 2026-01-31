// app/api/tenant/usage/route.ts
/**
 * 📊 Tenant Usage API
 * 
 * Phase 4C: Usage Metering
 * 
 * GET - 組織の使用量統計取得
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Client
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient(url, key);
}

// プラン制限
const PLAN_LIMITS: Record<string, any> = {
  free: {
    dispatchPerMonth: 500,
    concurrentJobs: 1,
    storageGb: 1,
    apiCallsPerDay: 100,
  },
  pro: {
    dispatchPerMonth: 5000,
    concurrentJobs: 5,
    storageGb: 10,
    apiCallsPerDay: 1000,
  },
  empire: {
    dispatchPerMonth: -1,  // Unlimited
    concurrentJobs: 20,
    storageGb: 100,
    apiCallsPerDay: -1,    // Unlimited
  },
};

// ============================================================
// GET - 使用量統計取得
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    
    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: 'organizationId is required' },
        { status: 400 }
      );
    }
    
    // デモモード
    if (organizationId === 'demo-org-001') {
      return NextResponse.json({
        success: true,
        usage: {
          dispatchThisMonth: 42,
          dispatchLimit: 500,
          concurrentJobs: 0,
          concurrentLimit: 1,
          apiCallsToday: 15,
          apiCallsLimit: 100,
          storageUsedGb: 0.12,
          storageLimit: 1,
        },
        breakdown: {
          byTool: [
            { toolId: 'research-agent', count: 15, cost: 0 },
            { toolId: 'inventory-sync', count: 20, cost: 0 },
            { toolId: 'listing-auto', count: 7, cost: 0 },
          ],
          byDay: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 10) + 1,
          })).reverse(),
        },
      });
    }
    
    const supabase = getSupabaseClient();
    
    // 組織情報取得
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, plan')
      .eq('id', organizationId)
      .single();
    
    if (orgError || !org) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }
    
    const limits = PLAN_LIMITS[org.plan] || PLAN_LIMITS.free;
    
    // 今月のDispatch数
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const { count: dispatchThisMonth } = await supabase
      .from('dispatch_jobs')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .gte('created_at', startOfMonth.toISOString());
    
    // 現在の同時実行ジョブ
    const { count: concurrentJobs } = await supabase
      .from('dispatch_jobs')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .in('status', ['pending', 'running']);
    
    // 今日のAPI呼び出し数
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const { data: usageRecords } = await supabase
      .from('usage_records')
      .select('api_calls')
      .eq('organization_id', organizationId)
      .gte('recorded_at', startOfDay.toISOString());
    
    const apiCallsToday = (usageRecords || []).reduce(
      (sum, r) => sum + (r.api_calls || 0), 
      0
    );
    
    // ツール別内訳
    const { data: toolBreakdown } = await supabase
      .from('usage_records')
      .select('tool_id, quantity, cost_estimate')
      .eq('organization_id', organizationId)
      .gte('recorded_at', startOfMonth.toISOString());
    
    const byTool = Object.values(
      (toolBreakdown || []).reduce((acc: any, r) => {
        if (!acc[r.tool_id]) {
          acc[r.tool_id] = { toolId: r.tool_id, count: 0, cost: 0 };
        }
        acc[r.tool_id].count += r.quantity || 1;
        acc[r.tool_id].cost += r.cost_estimate || 0;
        return acc;
      }, {})
    );
    
    // 日別内訳（過去7日）
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: dailyRecords } = await supabase
      .from('dispatch_jobs')
      .select('created_at')
      .eq('organization_id', organizationId)
      .gte('created_at', sevenDaysAgo.toISOString());
    
    const byDay: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = (dailyRecords || []).filter(
        r => r.created_at.startsWith(dateStr)
      ).length;
      byDay.push({ date: dateStr, count });
    }
    
    return NextResponse.json({
      success: true,
      usage: {
        dispatchThisMonth: dispatchThisMonth || 0,
        dispatchLimit: limits.dispatchPerMonth,
        concurrentJobs: concurrentJobs || 0,
        concurrentLimit: limits.concurrentJobs,
        apiCallsToday,
        apiCallsLimit: limits.apiCallsPerDay,
        storageUsedGb: 0,  // TODO: 実装
        storageLimit: limits.storageGb,
      },
      breakdown: {
        byTool,
        byDay,
      },
    });
    
  } catch (error) {
    console.error('[Usage API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
