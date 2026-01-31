// app/api/dispatch/concurrency/route.ts
/**
 * 🔒 Concurrency Status API
 * 
 * Phase D-Core: 同時実行制限状態確認
 * 
 * @usage GET /api/dispatch/concurrency - 状態確認
 */

import { NextRequest, NextResponse } from 'next/server';
import { getJobLockStatus, CONCURRENCY_LIMITS } from '@/lib/guards/concurrency-guard';

export async function GET(request: NextRequest) {
  try {
    const locks = await getJobLockStatus();
    
    const lockMap: Record<string, { current: number; max: number; utilization: number }> = {};
    
    for (const lock of locks) {
      lockMap[lock.job_type] = {
        current: lock.active_count,
        max: lock.max_limit,
        utilization: lock.max_limit > 0 
          ? Math.round((lock.active_count / lock.max_limit) * 100) 
          : 0,
      };
    }
    
    // 定義済みの制限値も含める
    for (const [jobType, limit] of Object.entries(CONCURRENCY_LIMITS)) {
      if (!lockMap[jobType]) {
        lockMap[jobType] = {
          current: 0,
          max: limit,
          utilization: 0,
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      locks: lockMap,
      totalActive: locks.reduce((sum, l) => sum + l.active_count, 0),
    });
  } catch (error: any) {
    console.error('[Concurrency API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
