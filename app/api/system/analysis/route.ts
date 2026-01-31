// app/api/system/analysis/route.ts
/**
 * 📊 Phase F-2: 分析レポート生成 API
 * 
 * システム全体の健全性をJSON形式で返す
 * 
 * @usage GET /api/system/analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { getKillSwitchStatus } from '@/lib/guards/kill-switch';
import { getJobLockStatus } from '@/lib/guards/concurrency-guard';
import { getTodayJobCount, getToolStats } from '@/lib/guards/audit-log';
import { getRateLimitStatus } from '@/lib/guards/rate-limit-protection';
import { TOOL_DEFINITIONS } from '@/components/n3/empire/tool-definitions';

// ============================================================
// 型定義
// ============================================================

interface AnalysisReport {
  timestamp: string;
  
  uiCoverage: {
    total: number;
    connected: number;
    rate: number;
  };
  
  automationHealth: {
    masterEnabled: boolean;
    killSwitchActive: boolean;
    enabledTools: number;
    totalTools: number;
    quarantinedTools: number;
    successRate24h: number;
    concurrencyUtilization: number;
  };
  
  apiHealth: {
    dispatchSuccessRate: number;
    errorCount24h: number;
    rateLimitHits: number;
    circuitBreakerOpen: boolean;
  };
  
  pipelineHealth: {
    researchQueue: number;
    editingQueue: number;
    listingQueue: number;
    throughput24h: number;
  };
  
  commercialScore: number;
  verdict: 'READY_FOR_PRODUCTION' | 'BLOCKED' | 'WARNING';
  blockers: string[];
  warnings: string[];
}

// ============================================================
// GET /api/system/analysis
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // 並列でデータ取得
    const [
      killSwitchStatus,
      jobLocks,
      todayJobs,
      toolStats,
      rateLimitStatus,
      automationSettings,
    ] = await Promise.all([
      getKillSwitchStatus(),
      getJobLockStatus(),
      getTodayJobCount(),
      getToolStats(1),
      getRateLimitStatus(),
      supabase.from('n3_automation_settings').select('enabled, last_status'),
    ]);
    
    // ツール情報
    const totalTools = Object.keys(TOOL_DEFINITIONS).length;
    const toolsWithUI = Object.values(TOOL_DEFINITIONS).filter((t: any) => t.uiPath).length;
    
    // 自動化設定
    const settings = automationSettings.data || [];
    const enabledTools = settings.filter((s: any) => s.enabled).length;
    const quarantinedTools = settings.filter((s: any) => s.last_status === 'quarantined').length;
    
    // 同時実行利用率
    let totalConcurrency = 0;
    let maxConcurrency = 0;
    for (const lock of jobLocks) {
      totalConcurrency += lock.active_count;
      maxConcurrency += lock.max_limit;
    }
    const concurrencyUtilization = maxConcurrency > 0 
      ? Math.round((totalConcurrency / maxConcurrency) * 100) 
      : 0;
    
    // Dispatch 成功率
    const dispatchTotal = todayJobs.total;
    const dispatchSuccess = todayJobs.completed;
    const dispatchSuccessRate = dispatchTotal > 0 
      ? Math.round((dispatchSuccess / dispatchTotal) * 100) 
      : 100;
    
    // 自動化成功率
    let automationTotal = 0;
    let automationSuccess = 0;
    for (const stat of Object.values(toolStats)) {
      automationTotal += stat.total;
      automationSuccess += stat.completed;
    }
    const automationSuccessRate = automationTotal > 0 
      ? Math.round((automationSuccess / automationTotal) * 100) 
      : 100;
    
    // パイプラインキュー
    const { count: listingQueueCount } = await supabase
      .from('n3_listing_queue')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    // 商用スコア計算
    const blockers: string[] = [];
    const warnings: string[] = [];
    let score = 100;
    
    // ブロッカーチェック
    if (dispatchSuccessRate < 99) {
      blockers.push(`Dispatch成功率が99%未満: ${dispatchSuccessRate}%`);
      score -= 30;
    }
    
    if (automationSuccessRate < 95) {
      blockers.push(`自動化成功率が95%未満: ${automationSuccessRate}%`);
      score -= 25;
    }
    
    if (killSwitchStatus.active) {
      blockers.push('Kill Switchがアクティブ');
      score -= 20;
    }
    
    if (rateLimitStatus.global.isOpen) {
      blockers.push('グローバルサーキットブレーカーがオープン');
      score -= 20;
    }
    
    // 警告チェック
    if (quarantinedTools > 0) {
      warnings.push(`${quarantinedTools}個のツールが隔離中`);
      score -= 5 * quarantinedTools;
    }
    
    if (concurrencyUtilization > 80) {
      warnings.push(`同時実行利用率が高い: ${concurrencyUtilization}%`);
      score -= 10;
    }
    
    if (todayJobs.blocked > 10) {
      warnings.push(`ブロックされたジョブが多い: ${todayJobs.blocked}件`);
      score -= 5;
    }
    
    const commercialScore = Math.max(0, score);
    
    // 判定
    let verdict: 'READY_FOR_PRODUCTION' | 'BLOCKED' | 'WARNING';
    if (blockers.length > 0) {
      verdict = 'BLOCKED';
    } else if (warnings.length > 0) {
      verdict = 'WARNING';
    } else {
      verdict = 'READY_FOR_PRODUCTION';
    }
    
    const report: AnalysisReport = {
      timestamp: new Date().toISOString(),
      
      uiCoverage: {
        total: totalTools,
        connected: toolsWithUI,
        rate: totalTools > 0 ? Math.round((toolsWithUI / totalTools) * 100) : 0,
      },
      
      automationHealth: {
        masterEnabled: !killSwitchStatus.active,
        killSwitchActive: killSwitchStatus.active,
        enabledTools,
        totalTools: settings.length,
        quarantinedTools,
        successRate24h: automationSuccessRate,
        concurrencyUtilization,
      },
      
      apiHealth: {
        dispatchSuccessRate,
        errorCount24h: todayJobs.failed,
        rateLimitHits: rateLimitStatus.global.failureCount,
        circuitBreakerOpen: rateLimitStatus.global.isOpen,
      },
      
      pipelineHealth: {
        researchQueue: 0,
        editingQueue: 0,
        listingQueue: listingQueueCount || 0,
        throughput24h: dispatchSuccess,
      },
      
      commercialScore,
      verdict,
      blockers,
      warnings,
    };
    
    return NextResponse.json({
      success: true,
      ...report,
    });
    
  } catch (error: any) {
    console.error('[System Analysis] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
