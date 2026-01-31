// app/api/dispatch/[jobId]/route.ts
/**
 * 🔍 Job Status API - 非同期Job状態取得
 * 
 * @usage GET /api/dispatch/[jobId]
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// 型定義
// ============================================================

interface JobStatus {
  jobId: string;
  toolId: string;
  action: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'timeout';
  progress: number;
  result?: any;
  error?: string;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
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
// GET /api/dispatch/[jobId]
// ============================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;
    
    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'jobId is required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseClient();
    
    const { data: job, error } = await supabase
      .from('dispatch_jobs')
      .select('*')
      .eq('id', jobId)
      .single();
    
    if (error || !job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // タイムアウトチェック
    if (job.status === 'pending' || job.status === 'running') {
      const timeoutAt = new Date(job.timeout_at).getTime();
      if (Date.now() > timeoutAt) {
        // タイムアウトに更新
        await supabase
          .from('dispatch_jobs')
          .update({
            status: 'timeout',
            error: 'Job execution timed out',
            finished_at: new Date().toISOString(),
          })
          .eq('id', jobId);
        
        job.status = 'timeout';
        job.error = 'Job execution timed out';
      }
    }
    
    const response: JobStatus = {
      jobId: job.id,
      toolId: job.tool_id,
      action: job.action,
      status: job.status,
      progress: job.progress || 0,
      result: job.result,
      error: job.error,
      createdAt: job.created_at,
      startedAt: job.started_at,
      finishedAt: job.finished_at,
    };
    
    return NextResponse.json({
      success: true,
      ...response,
    });
    
  } catch (error: any) {
    console.error('[Dispatch/Job] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/dispatch/[jobId] - Jobキャンセル
// ============================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;
    
    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'jobId is required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseClient();
    
    const { error } = await supabase
      .from('dispatch_jobs')
      .update({
        status: 'failed',
        error: 'Cancelled by user',
        finished_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .in('status', ['pending', 'running']);
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Job cancelled',
    });
    
  } catch (error: any) {
    console.error('[Dispatch/Cancel] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
