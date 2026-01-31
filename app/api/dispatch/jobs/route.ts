// app/api/dispatch/jobs/route.ts
/**
 * 📋 Job一覧取得API
 * 
 * Phase 2C: Empire Command Center用
 * 全Hubのジョブ状態を一覧取得
 * 
 * @usage GET /api/dispatch/jobs?status=running&limit=50
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// 型定義
// ============================================================

interface JobListItem {
  jobId: string;
  toolId: string;
  action: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'timeout';
  progress: number;
  retryCount: number;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  error?: string;
  metadata?: Record<string, any>;
}

interface JobListResponse {
  success: boolean;
  jobs: JobListItem[];
  total: number;
  hasMore: boolean;
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
// GET /api/dispatch/jobs
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // クエリパラメータ
    const status = searchParams.get('status'); // pending, running, completed, failed, timeout
    const toolId = searchParams.get('toolId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const since = searchParams.get('since'); // ISO date string
    
    const supabase = getSupabaseClient();
    
    // クエリ構築
    let query = supabase
      .from('dispatch_jobs')
      .select('*', { count: 'exact' });
    
    // フィルター適用
    if (status) {
      const statuses = status.split(',');
      query = query.in('status', statuses);
    }
    
    if (toolId) {
      query = query.eq('tool_id', toolId);
    }
    
    if (since) {
      query = query.gte('created_at', since);
    }
    
    // ソート・ページネーション
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);
    
    const { data: jobs, error, count } = await query;
    
    if (error) {
      console.error('[Dispatch/Jobs] Query error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    // レスポンス整形
    const formattedJobs: JobListItem[] = (jobs || []).map(job => ({
      jobId: job.id,
      toolId: job.tool_id,
      action: job.action,
      status: job.status,
      progress: job.progress || 0,
      retryCount: job.retry_count || 0,
      startedAt: job.started_at,
      finishedAt: job.finished_at,
      createdAt: job.created_at,
      error: job.error,
      metadata: job.metadata,
    }));
    
    const response: JobListResponse = {
      success: true,
      jobs: formattedJobs,
      total: count || 0,
      hasMore: (count || 0) > offset + limit,
    };
    
    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error('[Dispatch/Jobs] Error:', error);
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
