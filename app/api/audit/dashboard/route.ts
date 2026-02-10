import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// ワークフロー定義（n8nワークフローのマスターデータ）
// ============================================================================
const WORKFLOW_DEFINITIONS = [
  // 出品系
  { id: 'ebay-listing-create', name: 'eBay出品作成', category: 'listing' },
  { id: 'ebay-listing-update', name: 'eBay出品更新', category: 'listing' },
  { id: 'ebay-listing-end', name: 'eBay出品終了', category: 'listing' },
  { id: 'amazon-listing-create', name: 'Amazon出品作成', category: 'listing' },
  
  // 価格改定系
  { id: 'ebay-repricing', name: 'eBay価格改定', category: 'pricing' },
  { id: 'amazon-repricing', name: 'Amazon価格改定', category: 'pricing' },
  { id: 'competitive-pricing', name: '競合価格調整', category: 'pricing' },
  
  // 在庫系
  { id: 'inventory-sync', name: '在庫同期', category: 'inventory' },
  { id: 'inventory-check', name: '在庫チェック', category: 'inventory' },
  { id: 'stock-alert', name: '在庫アラート', category: 'inventory' },
  
  // 配送系
  { id: 'shipping-update', name: '配送情報更新', category: 'shipping' },
  { id: 'tracking-sync', name: '追跡番号同期', category: 'shipping' },
  
  // API系
  { id: 'ebay-api-sync', name: 'eBay API同期', category: 'api' },
  { id: 'amazon-api-sync', name: 'Amazon API同期', category: 'api' },
];

// ============================================================================
// GET: ダッシュボードデータ取得
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // 1. 本日の統計を取得
    const { data: todayStats, error: statsError } = await supabase
      .from('n3_audit_statistics')
      .select('*')
      .gte('stat_date', todayISO.split('T')[0]);

    if (statsError) {
      console.error('Stats query error:', statsError);
    }

    // 統計を集計
    let totalAuditsToday = 0;
    let passCountToday = 0;
    let llmCalls = 0;
    let llmCacheHits = 0;

    if (todayStats) {
      todayStats.forEach(stat => {
        totalAuditsToday += stat.total_count || 0;
        passCountToday += stat.pass_count || 0;
        llmCalls += stat.llm_calls || 0;
        llmCacheHits += stat.llm_cache_hits || 0;
      });
    }

    // 2. ワークフローごとのステータスを取得
    const workflowStatuses = await Promise.all(
      WORKFLOW_DEFINITIONS.map(async (wfDef) => {
        // 過去24時間の監査ログを取得
        const { data: logs, error: logsError } = await supabase
          .from('n3_audit_logs')
          .select('status, created_at, overall_score')
          .eq('workflow_id', wfDef.id)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
          .limit(100);

        if (logsError) {
          console.error(`Logs query error for ${wfDef.id}:`, logsError);
        }

        const executions = logs || [];
        const totalExecutions = executions.length;
        const passCount = executions.filter(l => l.status === 'PASS').length;
        const warnCount = executions.filter(l => l.status === 'WARN').length;
        const failCount = executions.filter(l => l.status === 'FAIL' || l.status === 'ERROR').length;
        
        const successRate = totalExecutions > 0 
          ? (passCount / totalExecutions) * 100 
          : 100;

        // ステータス判定
        let status: 'healthy' | 'warning' | 'error' | 'inactive' = 'inactive';
        if (totalExecutions === 0) {
          status = 'inactive';
        } else if (failCount > 0) {
          status = 'error';
        } else if (warnCount > 0) {
          status = 'warning';
        } else {
          status = 'healthy';
        }

        // トレンド計算（前半と後半を比較）
        const halfPoint = Math.floor(executions.length / 2);
        const recentHalf = executions.slice(0, halfPoint);
        const olderHalf = executions.slice(halfPoint);
        
        const recentPassRate = recentHalf.length > 0 
          ? recentHalf.filter(l => l.status === 'PASS').length / recentHalf.length 
          : 0;
        const olderPassRate = olderHalf.length > 0 
          ? olderHalf.filter(l => l.status === 'PASS').length / olderHalf.length 
          : 0;

        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (recentPassRate > olderPassRate + 0.05) trend = 'up';
        else if (recentPassRate < olderPassRate - 0.05) trend = 'down';

        return {
          workflow_id: wfDef.id,
          workflow_name: wfDef.name,
          category: wfDef.category,
          status,
          success_rate: successRate,
          total_executions: totalExecutions,
          last_execution: executions[0]?.created_at || null,
          last_status: executions[0]?.status || null,
          active_issues: failCount + warnCount,
          trend
        };
      })
    );

    // 3. 最近の問題を取得
    const { data: recentIssues, error: issuesError } = await supabase
      .from('n3_audit_logs')
      .select('*')
      .in('status', ['WARN', 'FAIL', 'ERROR'])
      .order('created_at', { ascending: false })
      .limit(50);

    if (issuesError) {
      console.error('Issues query error:', issuesError);
    }

    // ワークフロー名をマッピング
    const issuesWithNames = (recentIssues || []).map(issue => {
      const wfDef = WORKFLOW_DEFINITIONS.find(w => w.id === issue.workflow_id);
      return {
        audit_id: issue.audit_id,
        workflow_id: issue.workflow_id,
        workflow_name: wfDef?.name || issue.workflow_name || issue.workflow_id,
        status: issue.status,
        reason: issue.reason,
        failed_rules: issue.failed_rules || [],
        input_data: issue.input_data || {},
        output_data: issue.output_data || {},
        llm_analysis: issue.llm_audit_result ? {
          issues_found: issue.llm_audit_result.issues_found || [],
          recommendations: issue.llm_audit_result.recommendations || [],
          reasoning: issue.llm_audit_result.reasoning || ''
        } : null,
        created_at: issue.created_at
      };
    });

    // 4. 統計サマリー
    const healthyCount = workflowStatuses.filter(w => w.status === 'healthy').length;
    const warningCount = workflowStatuses.filter(w => w.status === 'warning').length;
    const errorCount = workflowStatuses.filter(w => w.status === 'error').length;

    const stats = {
      total_workflows: WORKFLOW_DEFINITIONS.length,
      healthy_count: healthyCount,
      warning_count: warningCount,
      error_count: errorCount,
      total_audits_today: totalAuditsToday,
      pass_rate_today: totalAuditsToday > 0 ? (passCountToday / totalAuditsToday) * 100 : 100,
      llm_cache_hit_rate: llmCalls > 0 ? (llmCacheHits / llmCalls) * 100 : 0
    };

    return NextResponse.json({
      stats,
      workflows: workflowStatuses,
      recent_issues: issuesWithNames
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
