// app/api/system/startup/route.ts
/**
 * 🚀 Phase G: System Startup API
 * 
 * @usage GET /api/system/startup - 状態取得
 * @usage POST /api/system/startup - 起動
 * @usage DELETE /api/system/startup - 停止
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getStartupState,
  startSystem,
  stopSystem,
} from '@/lib/startup/startup-engine';
import { getCurrentMode, OperationMode } from '@/lib/startup/operation-mode';
import {
  getCurrentUserFromRequest,
  requireAdmin,
  AdminGuardError,
} from '@/lib/guards/admin-guard';

// ============================================================
// GET /api/system/startup - 状態取得
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const state = getStartupState();
    const modeStatus = await getCurrentMode();
    
    return NextResponse.json({
      success: true,
      state,
      mode: modeStatus,
    });
  } catch (error: any) {
    console.error('[Startup API] GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/system/startup - 起動
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
    const { mode, skipPreflight } = body;
    
    // モード検証
    if (!mode || !['dev', 'staging', 'prod'].includes(mode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid mode. Must be dev, staging, or prod.' },
        { status: 400 }
      );
    }
    
    // 起動実行
    const result = await startSystem(
      mode as OperationMode,
      user?.id,
      user?.email,
      skipPreflight
    );
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error, state: result.state },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `System started in ${mode} mode`,
      state: result.state,
    });
    
  } catch (error: any) {
    console.error('[Startup API] POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/system/startup - 停止
// ============================================================

export async function DELETE(request: NextRequest) {
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
    const emergency = searchParams.get('emergency') === 'true';
    
    // 停止実行
    const result = await stopSystem(user?.id, user?.email, emergency);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error, state: result.state },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: emergency ? 'System emergency stopped' : 'System stopped',
      state: result.state,
    });
    
  } catch (error: any) {
    console.error('[Startup API] DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
