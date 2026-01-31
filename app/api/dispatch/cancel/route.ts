// app/api/dispatch/cancel/route.ts
/**
 * ⏹️ Job Cancel API
 * 
 * Phase 2C: Empire Command Center用
 * Phase 3B: RBAC対応
 * 
 * ペンディング・実行中のジョブをキャンセル
 * 
 * @usage POST /api/dispatch/cancel
 * @body { jobId: string }
 * @permission control:cancel (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkPermission, createPermissionError, type UserRole } from '@/lib/guards';

// ============================================================
// 型定義
// ============================================================

interface CancelRequest {
  jobId: string;
  reason?: string;
}

interface CancelResponse {
  success: boolean;
  message?: string;
  previousStatus?: string;
  error?: string;
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
// ロール取得（仮実装 - 実際はセッションから取得）
// ============================================================

function getUserRole(request: NextRequest): UserRole {
  // TODO: 実際の実装ではセッション/JWTから取得
  const roleHeader = request.headers.get('x-user-role');
  if (roleHeader && ['admin', 'operator', 'viewer'].includes(roleHeader)) {
    return roleHeader as UserRole;
  }
  // デフォルト: admin（開発中）
  return 'admin';
}

// ============================================================
// POST /api/dispatch/cancel
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // Phase 3B: RBAC Check
    const userRole = getUserRole(request);
    const permissionResult = checkPermission(userRole, 'control:cancel');
    
    if (!permissionResult.allowed) {
      return NextResponse.json(
        createPermissionError(permissionResult),
        { status: 403 }
      );
    }
    
    const body: CancelRequest = await request.json();
    const { jobId, reason } = body;
    
    // バリデーション
    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'jobId is required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseClient();
    
    // ジョブを取得
    const { data: job, error: fetchError } = await supabase
      .from('dispatch_jobs')
      .select('*')
      .eq('id', jobId)
      .single();
    
    if (fetchError || !job) {
      return NextResponse.json(
        { success: false, error: `Job not found: ${jobId}` },
        { status: 404 }
      );
    }
    
    // キャンセル可能な状態かチェック
    const cancellableStatuses = ['pending', 'running'];
    if (!cancellableStatuses.includes(job.status)) {
      return NextResponse.json(
        { success: false, error: `Job status is ${job.status}, cannot cancel` },
        { status: 400 }
      );
    }
    
    const previousStatus = job.status;
    
    // ステータスを「cancelled」に更新
    const { error: updateError } = await supabase
      .from('dispatch_jobs')
      .update({
        status: 'cancelled',
        finished_at: new Date().toISOString(),
        error: reason || 'Cancelled by user',
        metadata: {
          ...job.metadata,
          cancelledAt: new Date().toISOString(),
          cancelReason: reason || 'User requested cancellation',
          previousStatus,
        },
      })
      .eq('id', jobId);
    
    if (updateError) {
      console.error('[Dispatch/Cancel] Update error:', updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }
    
    // キャンセルログ記録
    await supabase.from('workflow_executions').insert({
      job_id: jobId,
      tool_id: job.tool_id,
      action: 'cancel',
      params: { reason },
      result: { previousStatus },
      status: 'success',
      duration_ms: 0,
    });
    
    const response: CancelResponse = {
      success: true,
      message: `Job ${jobId} has been cancelled`,
      previousStatus,
    };
    
    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error('[Dispatch/Cancel] Error:', error);
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
