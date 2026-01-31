// app/api/jobs/[id]/route.ts
/**
 * 個別ジョブAPIエンドポイント
 * 
 * GET /api/jobs/[id] - ジョブ詳細取得
 * DELETE /api/jobs/[id] - ジョブキャンセル
 */

import { NextRequest, NextResponse } from 'next/server';
import { jobQueue } from '@/lib/services/scheduler/job-queue-service';

// ジョブ詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = jobQueue.getJob(id);
    
    if (!job) {
      return NextResponse.json({
        success: false,
        error: 'Job not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      job,
    });
    
  } catch (error) {
    console.error('[API] Job detail error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

// ジョブキャンセル
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cancelled = await jobQueue.cancel(id);
    
    if (!cancelled) {
      return NextResponse.json({
        success: false,
        error: 'Job not found or cannot be cancelled',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Job cancelled',
    });
    
  } catch (error) {
    console.error('[API] Job cancel error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
