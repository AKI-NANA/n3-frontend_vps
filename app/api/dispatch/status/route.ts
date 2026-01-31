// app/api/dispatch/status/route.ts
/**
 * 📊 Global Status API
 * 
 * Phase 2C: Empire Command Center用
 * システム全体の状態サマリー取得
 * 
 * @usage GET /api/dispatch/status
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// 型定義
// ============================================================

interface GlobalStatus {
  // Job統計
  jobs: {
    running: number;
    pending: number;
    failed: number;
    completed: number;
    timeout: number;
    total24h: number;
  };
  
  // Hub別状態
  hubs: {
    research: { active: number; errors: number };
    listing: { active: number; errors: number; queue: number };
    inventory: { active: number; errors: number; alerts: number };
    media: { active: number; errors: number };
    finance: { active: number; errors: number };
  };
  
  // アラート
  alerts: {
    total: number;
    critical: number;
    warning: number;
    info: number;
  };
  
  // システム健全性
  health: {
    n8n: 'online' | 'offline' | 'degraded';
    database: 'online' | 'offline' | 'degraded';
    api: 'online' | 'offline' | 'degraded';
  };
  
  // 最終更新
  updatedAt: string;
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
// Hub判定ユーティリティ
// ============================================================

function getHubFromToolId(toolId: string): keyof GlobalStatus['hubs'] | null {
  if (toolId.startsWith('research-') || toolId.includes('sm-') || toolId.includes('trend')) {
    return 'research';
  }
  if (toolId.startsWith('listing-') || toolId.includes('ebay-') || toolId.includes('amazon-') || toolId.includes('qoo10')) {
    return 'listing';
  }
  if (toolId.startsWith('inventory-') || toolId.includes('stock') || toolId.includes('supplier')) {
    return 'inventory';
  }
  if (toolId.startsWith('media-')) {
    return 'media';
  }
  if (toolId.startsWith('finance-') || toolId.includes('ddp') || toolId.includes('profit') || toolId.includes('accounting')) {
    return 'finance';
  }
  return null;
}

// ============================================================
// GET /api/dispatch/status
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    // 24時間前の日時
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    // ─────────────────────────────────────────────
    // Job統計取得
    // ─────────────────────────────────────────────
    
    // ステータス別カウント（現在）
    const { data: statusCounts, error: statusError } = await supabase
      .from('dispatch_jobs')
      .select('status')
      .in('status', ['pending', 'running', 'failed', 'timeout'])
      .gte('created_at', since24h);
    
    if (statusError) {
      console.error('[Dispatch/Status] Status count error:', statusError);
    }
    
    const jobStats = {
      running: 0,
      pending: 0,
      failed: 0,
      completed: 0,
      timeout: 0,
      total24h: 0,
    };
    
    if (statusCounts) {
      statusCounts.forEach(job => {
        if (job.status === 'running') jobStats.running++;
        else if (job.status === 'pending') jobStats.pending++;
        else if (job.status === 'failed') jobStats.failed++;
        else if (job.status === 'timeout') jobStats.timeout++;
      });
    }
    
    // 24時間の総ジョブ数
    const { count: total24h } = await supabase
      .from('dispatch_jobs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since24h);
    
    jobStats.total24h = total24h || 0;
    jobStats.completed = jobStats.total24h - jobStats.running - jobStats.pending - jobStats.failed - jobStats.timeout;
    
    // ─────────────────────────────────────────────
    // Hub別状態取得
    // ─────────────────────────────────────────────
    
    const hubs: GlobalStatus['hubs'] = {
      research: { active: 0, errors: 0 },
      listing: { active: 0, errors: 0, queue: 0 },
      inventory: { active: 0, errors: 0, alerts: 0 },
      media: { active: 0, errors: 0 },
      finance: { active: 0, errors: 0 },
    };
    
    // アクティブジョブをHub別に集計
    const { data: activeJobs } = await supabase
      .from('dispatch_jobs')
      .select('tool_id, status')
      .in('status', ['running', 'pending', 'failed'])
      .gte('created_at', since24h);
    
    if (activeJobs) {
      activeJobs.forEach(job => {
        const hub = getHubFromToolId(job.tool_id);
        if (hub && hubs[hub]) {
          if (job.status === 'running' || job.status === 'pending') {
            hubs[hub].active++;
          }
          if (job.status === 'failed') {
            hubs[hub].errors++;
          }
        }
      });
    }
    
    // Listing キュー数（別テーブルから取得試行）
    try {
      const { count: queueCount } = await supabase
        .from('listing_queue')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      hubs.listing.queue = queueCount || 0;
    } catch (e) {
      // テーブルが存在しない場合はスキップ
    }
    
    // Inventory アラート数（別テーブルから取得試行）
    try {
      const { count: alertCount } = await supabase
        .from('inventory_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('acknowledged', false);
      
      hubs.inventory.alerts = alertCount || 0;
    } catch (e) {
      // テーブルが存在しない場合はスキップ
    }
    
    // ─────────────────────────────────────────────
    // アラート統計
    // ─────────────────────────────────────────────
    
    const alerts: GlobalStatus['alerts'] = {
      total: 0,
      critical: 0,
      warning: 0,
      info: 0,
    };
    
    try {
      const { data: alertData } = await supabase
        .from('system_alerts')
        .select('severity')
        .eq('acknowledged', false);
      
      if (alertData) {
        alertData.forEach(alert => {
          alerts.total++;
          if (alert.severity === 'critical') alerts.critical++;
          else if (alert.severity === 'warning') alerts.warning++;
          else alerts.info++;
        });
      }
    } catch (e) {
      // テーブルが存在しない場合はスキップ
    }
    
    // ─────────────────────────────────────────────
    // システム健全性チェック
    // ─────────────────────────────────────────────
    
    const health: GlobalStatus['health'] = {
      n8n: 'online',
      database: 'online',
      api: 'online',
    };
    
    // n8nヘルスチェック
    try {
      const n8nUrl = process.env.N8N_BASE_URL || 'http://160.16.120.186:5678';
      const n8nResponse = await fetch(`${n8nUrl}/healthz`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      health.n8n = n8nResponse.ok ? 'online' : 'degraded';
    } catch (e) {
      health.n8n = 'offline';
    }
    
    // データベース健全性（すでにクエリ成功していればOK）
    health.database = statusError ? 'degraded' : 'online';
    
    // ─────────────────────────────────────────────
    // レスポンス構築
    // ─────────────────────────────────────────────
    
    const status: GlobalStatus = {
      jobs: jobStats,
      hubs,
      alerts,
      health,
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json({
      success: true,
      ...status,
    });
    
  } catch (error: any) {
    console.error('[Dispatch/Status] Error:', error);
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
