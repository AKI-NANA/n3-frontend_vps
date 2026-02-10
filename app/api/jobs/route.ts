// app/api/jobs/route.ts
/**
 * ジョブキューAPIエンドポイント
 * 
 * POST /api/jobs - 新規ジョブ作成（フルパイプライン開始）
 * GET /api/jobs - ジョブ一覧取得
 * GET /api/jobs/[id] - ジョブ詳細取得
 * DELETE /api/jobs/[id] - ジョブキャンセル
 */

import { NextRequest, NextResponse } from 'next/server';
import { jobQueue, startFullPipeline } from '@/lib/services/scheduler/job-queue-service';

// ジョブ作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      productIds,
      smSource,
      options = {},
    } = body as {
      productIds: string[];
      smSource?: string;
      options?: {
        skipAiCompletion?: boolean;
        skipAudit?: boolean;
        autoApplyFixes?: boolean;
        scheduleListingAt?: string;
        notifyOnComplete?: boolean;
      };
    };
    
    if (!productIds || productIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'productIds is required and must be a non-empty array',
      }, { status: 400 });
    }
    
    // フルパイプラインを開始
    const job = await startFullPipeline(productIds, smSource || '', options);
    
    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        type: job.type,
        status: job.status,
        progress: job.progress,
        createdAt: job.createdAt,
      },
    });
    
  } catch (error) {
    console.error('[API] Job creation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

// ジョブ一覧取得
export async function GET() {
  try {
    const jobs = jobQueue.getAllJobs();
    
    return NextResponse.json({
      success: true,
      pending: jobs.pending.map(j => ({
        id: j.id,
        type: j.type,
        status: j.status,
        progress: j.progress,
        createdAt: j.createdAt,
      })),
      running: jobs.running.map(j => ({
        id: j.id,
        type: j.type,
        status: j.status,
        progress: j.progress,
        progressMessage: j.progressMessage,
        startedAt: j.startedAt,
      })),
      completed: jobs.completed.slice(-20).map(j => ({
        id: j.id,
        type: j.type,
        status: j.status,
        completedAt: j.completedAt,
        error: j.error,
      })),
    });
    
  } catch (error) {
    console.error('[API] Job list error:', error);
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
