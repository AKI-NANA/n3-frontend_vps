// app/api/dispatch/logs/route.ts
/**
 * 📋 Execution Logs API
 * 
 * Phase D-Core: 実行ログ取得
 * 
 * @usage GET /api/dispatch/logs?type=dispatch&status=failed&limit=50
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getCurrentUserFromRequest,
  requireAdmin,
  AdminGuardError,
} from '@/lib/guards/admin-guard';
import { getExecutionLogs, getToolStats, type AuditLogFilter } from '@/lib/guards/audit-log';

export async function GET(request: NextRequest) {
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
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // ツール統計取得
    if (action === 'stats') {
      const days = parseInt(searchParams.get('days') || '7', 10);
      const stats = await getToolStats(days);
      
      return NextResponse.json({
        success: true,
        stats,
        period: `${days} days`,
      });
    }
    
    // ログ取得
    const filter: AuditLogFilter = {};
    
    const type = searchParams.get('type');
    if (type) {
      filter.type = type as any;
    }
    
    const toolId = searchParams.get('toolId');
    if (toolId) {
      filter.tool_id = toolId;
    }
    
    const status = searchParams.get('status');
    if (status) {
      filter.status = status as any;
    }
    
    const limit = searchParams.get('limit');
    if (limit) {
      filter.limit = parseInt(limit, 10);
    }
    
    const logs = await getExecutionLogs(filter);
    
    return NextResponse.json({
      success: true,
      logs,
      count: logs.length,
    });
  } catch (error: any) {
    console.error('[Logs API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
