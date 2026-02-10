// app/api/dispatch/control/route.ts
/**
 * 🎛️ Job Control API
 * 
 * Phase 2C: Empire Command Center用
 * ジョブの再実行/キャンセル/一時停止
 * 
 * @usage POST /api/dispatch/control
 * @body { action: 'retry' | 'cancel' | 'pause' | 'resume', jobId?: string, filter?: object }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// ============================================================
// 型定義
// ============================================================

type ControlAction = 'retry' | 'cancel' | 'pause' | 'resume' | 'retry-all-failed' | 'cancel-all-pending';

interface ControlRequest {
  action: ControlAction;
  jobId?: string;           // 単一ジョブ操作時
  jobIds?: string[];        // 複数ジョブ操作時
  filter?: {                // フィルター条件でのバッチ操作
    toolId?: string;
    status?: string;
    since?: string;
  };
}

interface ControlResponse {
  success: boolean;
  affected: number;
  message: string;
  details?: any;
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
// HMAC署名生成
// ============================================================

function generateHmacSignature(payload: string): string {
  const secret = process.env.N8N_WEBHOOK_SECRET || 'n3-empire-secret';
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

// ============================================================
// n8n Webhook呼び出し
// ============================================================

async function callN8nWebhook(
  webhookPath: string,
  params: Record<string, any>,
  jobId?: string
): Promise<any> {
  const baseUrl = process.env.N8N_BASE_URL || 'http://160.16.120.186:5678';
  const url = `${baseUrl}/webhook/${webhookPath}`;
  
  const payload = JSON.stringify({
    ...params,
    _dispatch: {
      jobId,
      timestamp: new Date().toISOString(),
    },
  });
  
  const signature = generateHmacSignature(payload);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-N3-Signature': signature,
      'X-N3-Job-Id': jobId || '',
    },
    body: payload,
    signal: AbortSignal.timeout(30000),
  });
  
  if (!response.ok) {
    throw new Error(`n8n webhook failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// ============================================================
// Job Retry（再実行）
// ============================================================

async function retryJob(supabase: any, jobId: string): Promise<{ success: boolean; newJobId?: string; error?: string }> {
  // 元のジョブ情報取得
  const { data: originalJob, error: fetchError } = await supabase
    .from('dispatch_jobs')
    .select('*')
    .eq('id', jobId)
    .single();
  
  if (fetchError || !originalJob) {
    return { success: false, error: 'Job not found' };
  }
  
  // 新しいジョブを作成（リトライ）
  const timeout = originalJob.metadata?.options?.timeout || 300;
  const timeoutAt = new Date(Date.now() + timeout * 1000).toISOString();
  
  const { data: newJob, error: insertError } = await supabase
    .from('dispatch_jobs')
    .insert({
      tool_id: originalJob.tool_id,
      action: originalJob.action,
      params: originalJob.params,
      status: 'pending',
      retry_count: (originalJob.retry_count || 0) + 1,
      parent_job_id: originalJob.id,
      timeout_at: timeoutAt,
      user_id: originalJob.user_id,
      metadata: {
        ...originalJob.metadata,
        retryOf: originalJob.id,
      },
    })
    .select('id')
    .single();
  
  if (insertError) {
    return { success: false, error: insertError.message };
  }
  
  // 元のジョブを retried 状態に更新
  await supabase
    .from('dispatch_jobs')
    .update({
      metadata: {
        ...originalJob.metadata,
        retriedAs: newJob.id,
      },
    })
    .eq('id', jobId);
  
  return { success: true, newJobId: newJob.id };
}

// ============================================================
// Job Cancel（キャンセル）
// ============================================================

async function cancelJob(supabase: any, jobId: string): Promise<{ success: boolean; error?: string }> {
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
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// ============================================================
// POST /api/dispatch/control
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: ControlRequest = await request.json();
    const { action, jobId, jobIds, filter } = body;
    
    // バリデーション
    if (!action) {
      return NextResponse.json(
        { success: false, error: 'action is required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseClient();
    let affected = 0;
    let message = '';
    const details: any[] = [];
    
    // ─────────────────────────────────────────────
    // 単一ジョブ操作
    // ─────────────────────────────────────────────
    
    if (jobId) {
      switch (action) {
        case 'retry': {
          const result = await retryJob(supabase, jobId);
          if (result.success) {
            affected = 1;
            message = `Job ${jobId} queued for retry as ${result.newJobId}`;
            details.push({ jobId, newJobId: result.newJobId });
          } else {
            return NextResponse.json(
              { success: false, error: result.error },
              { status: 400 }
            );
          }
          break;
        }
        
        case 'cancel': {
          const result = await cancelJob(supabase, jobId);
          if (result.success) {
            affected = 1;
            message = `Job ${jobId} cancelled`;
          } else {
            return NextResponse.json(
              { success: false, error: result.error },
              { status: 400 }
            );
          }
          break;
        }
        
        case 'pause': {
          const { error } = await supabase
            .from('dispatch_jobs')
            .update({ status: 'paused' })
            .eq('id', jobId)
            .eq('status', 'pending');
          
          if (!error) {
            affected = 1;
            message = `Job ${jobId} paused`;
          }
          break;
        }
        
        case 'resume': {
          const { error } = await supabase
            .from('dispatch_jobs')
            .update({ status: 'pending' })
            .eq('id', jobId)
            .eq('status', 'paused');
          
          if (!error) {
            affected = 1;
            message = `Job ${jobId} resumed`;
          }
          break;
        }
        
        default:
          return NextResponse.json(
            { success: false, error: `Unknown action: ${action}` },
            { status: 400 }
          );
      }
    }
    
    // ─────────────────────────────────────────────
    // 複数ジョブ操作
    // ─────────────────────────────────────────────
    
    else if (jobIds && jobIds.length > 0) {
      for (const id of jobIds) {
        let result;
        switch (action) {
          case 'retry':
            result = await retryJob(supabase, id);
            if (result.success) {
              affected++;
              details.push({ jobId: id, newJobId: result.newJobId });
            }
            break;
          case 'cancel':
            result = await cancelJob(supabase, id);
            if (result.success) affected++;
            break;
        }
      }
      message = `${affected} jobs ${action === 'retry' ? 'queued for retry' : 'cancelled'}`;
    }
    
    // ─────────────────────────────────────────────
    // バッチ操作（フィルター条件）
    // ─────────────────────────────────────────────
    
    else if (action === 'retry-all-failed') {
      // 失敗したジョブを全て再実行
      const { data: failedJobs } = await supabase
        .from('dispatch_jobs')
        .select('id')
        .eq('status', 'failed')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(100);
      
      if (failedJobs) {
        for (const job of failedJobs) {
          const result = await retryJob(supabase, job.id);
          if (result.success) {
            affected++;
            details.push({ jobId: job.id, newJobId: result.newJobId });
          }
        }
      }
      message = `${affected} failed jobs queued for retry`;
    }
    
    else if (action === 'cancel-all-pending') {
      // 保留中のジョブを全てキャンセル
      const { data: pendingJobs } = await supabase
        .from('dispatch_jobs')
        .update({
          status: 'failed',
          error: 'Batch cancelled by user',
          finished_at: new Date().toISOString(),
        })
        .in('status', ['pending'])
        .select('id');
      
      affected = pendingJobs?.length || 0;
      message = `${affected} pending jobs cancelled`;
    }
    
    else if (filter) {
      // カスタムフィルターでのバッチ操作
      let query = supabase.from('dispatch_jobs').select('id');
      
      if (filter.toolId) {
        query = query.eq('tool_id', filter.toolId);
      }
      if (filter.status) {
        query = query.eq('status', filter.status);
      }
      if (filter.since) {
        query = query.gte('created_at', filter.since);
      }
      
      const { data: filteredJobs } = await query.limit(100);
      
      if (filteredJobs) {
        for (const job of filteredJobs) {
          let result;
          switch (action) {
            case 'retry':
              result = await retryJob(supabase, job.id);
              if (result.success) affected++;
              break;
            case 'cancel':
              result = await cancelJob(supabase, job.id);
              if (result.success) affected++;
              break;
          }
        }
      }
      message = `${affected} jobs ${action === 'retry' ? 'queued for retry' : 'cancelled'}`;
    }
    
    else {
      return NextResponse.json(
        { success: false, error: 'jobId, jobIds, or filter is required' },
        { status: 400 }
      );
    }
    
    // ─────────────────────────────────────────────
    // レスポンス
    // ─────────────────────────────────────────────
    
    const response: ControlResponse = {
      success: true,
      affected,
      message,
      details: details.length > 0 ? details : undefined,
    };
    
    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error('[Dispatch/Control] Error:', error);
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
