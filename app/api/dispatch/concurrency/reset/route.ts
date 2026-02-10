// app/api/dispatch/concurrency/reset/route.ts
/**
 * 🔓 Concurrency Reset API
 * 
 * Phase D-Core: 同時実行ロックリセット（Admin専用・緊急用）
 * 
 * @usage POST /api/dispatch/concurrency/reset
 * @body { jobType?: string } // 省略時は全リセット
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getCurrentUserFromRequest,
  requireAdmin,
  AdminGuardError,
} from '@/lib/guards/admin-guard';
import { resetJobLocks } from '@/lib/guards/concurrency-guard';
import { logExecution } from '@/lib/guards/audit-log';

export async function POST(request: NextRequest) {
  try {
    // Admin権限チェック
    const user = await getCurrentUserFromRequest();
    
    try {
      requireAdmin(user);
    } catch (error) {
      if (error instanceof AdminGuardError) {
        return NextResponse.json(error.toResponse(), { status: 403 });
      }
      throw error;
    }
    
    const body = await request.json().catch(() => ({}));
    const { jobType } = body;
    
    // リセット実行
    await resetJobLocks(jobType);
    
    // 監査ログ
    await logExecution({
      type: 'system',
      tool_id: 'concurrency-reset',
      user_id: user?.id,
      user_email: user?.email,
      status: 'completed',
      metadata: {
        jobType: jobType || 'all',
        action: 'reset',
      },
    });
    
    return NextResponse.json({
      success: true,
      message: jobType 
        ? `Job locks reset for: ${jobType}` 
        : 'All job locks reset',
    });
  } catch (error: any) {
    console.error('[Concurrency Reset API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
