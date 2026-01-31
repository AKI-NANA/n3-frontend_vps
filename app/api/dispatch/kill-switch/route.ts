// app/api/dispatch/kill-switch/route.ts
/**
 * 🛑 Kill Switch API
 * 
 * Phase D-Core: 運用耐性レイヤー
 * 
 * グローバル停止スイッチの状態確認・操作
 * 
 * @usage GET /api/dispatch/kill-switch - 状態確認
 * @usage POST /api/dispatch/kill-switch - 状態変更（要Admin権限）
 * @body { action: 'activate' | 'deactivate', reason?: string, autoResumeMinutes?: number }
 * @permission admin only
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getCurrentUserFromRequest,
  requireAdmin,
  AdminGuardError,
} from '@/lib/guards/admin-guard';
import {
  getKillSwitchStatus,
  activateKillSwitch,
  deactivateKillSwitch,
} from '@/lib/guards/kill-switch';
import { logKillSwitchOperation } from '@/lib/guards/audit-log';

// ============================================================
// GET /api/dispatch/kill-switch（状態確認）
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const status = await getKillSwitchStatus();
    
    return NextResponse.json({
      success: true,
      enabled: !status.active, // enabled = Kill Switchが非アクティブ
      killSwitchActive: status.active,
      reason: status.reason,
      activatedAt: status.activatedAt?.toISOString(),
      activatedBy: status.activatedBy,
      autoResumeAt: status.autoResumeAt?.toISOString(),
      pausedTools: status.pausedTools,
    });
  } catch (error: any) {
    console.error('[KillSwitch API] GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/dispatch/kill-switch（状態変更）
// ============================================================

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
    
    const body = await request.json();
    const { action, reason, autoResumeMinutes } = body;
    
    if (!action || !['activate', 'deactivate'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'action must be "activate" or "deactivate"' },
        { status: 400 }
      );
    }
    
    if (action === 'activate') {
      if (!reason) {
        return NextResponse.json(
          { success: false, error: 'reason is required for activation' },
          { status: 400 }
        );
      }
      
      const result = await activateKillSwitch({
        reason,
        activatedBy: user?.email || 'admin',
        autoResumeMinutes,
      });
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }
      
      // 監査ログ
      await logKillSwitchOperation({
        action: 'activate',
        userId: user?.id,
        userEmail: user?.email,
        reason,
      });
      
      const status = await getKillSwitchStatus();
      
      return NextResponse.json({
        success: true,
        message: 'Kill Switch activated. All executions halted.',
        state: {
          enabled: false,
          killSwitchActive: true,
          reason: status.reason,
          activatedAt: status.activatedAt?.toISOString(),
          activatedBy: status.activatedBy,
          autoResumeAt: status.autoResumeAt?.toISOString(),
        },
      });
    } else {
      // deactivate
      const result = await deactivateKillSwitch(
        user?.email || 'admin',
        reason
      );
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }
      
      // 監査ログ
      await logKillSwitchOperation({
        action: 'deactivate',
        userId: user?.id,
        userEmail: user?.email,
        reason,
      });
      
      return NextResponse.json({
        success: true,
        message: 'Kill Switch deactivated. Dispatch enabled.',
        state: {
          enabled: true,
          killSwitchActive: false,
        },
      });
    }
  } catch (error: any) {
    console.error('[KillSwitch API] POST error:', error);
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Role, X-User-Id',
    },
  });
}
