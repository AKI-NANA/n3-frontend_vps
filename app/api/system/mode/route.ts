// app/api/system/mode/route.ts
/**
 * 🎛️ Phase G: Operation Mode API
 * 
 * @usage GET /api/system/mode - 現在のモード取得
 * @usage POST /api/system/mode - モード変更
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getCurrentMode,
  changeMode,
  OperationMode,
  MODE_CONFIGS,
} from '@/lib/startup/operation-mode';
import {
  getCurrentUserFromRequest,
  requireAdmin,
  AdminGuardError,
} from '@/lib/guards/admin-guard';

// ============================================================
// GET /api/system/mode
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const modeStatus = await getCurrentMode();
    
    return NextResponse.json({
      success: true,
      ...modeStatus,
      availableModes: Object.keys(MODE_CONFIGS),
    });
  } catch (error: any) {
    console.error('[Mode API] GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/system/mode
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
    const { mode } = body;
    
    // モード検証
    if (!mode || !['dev', 'staging', 'prod'].includes(mode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid mode. Must be dev, staging, or prod.' },
        { status: 400 }
      );
    }
    
    // モード変更
    const result = await changeMode(
      mode as OperationMode,
      user?.id,
      user?.email
    );
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    // 新しい状態を取得
    const newStatus = await getCurrentMode();
    
    return NextResponse.json({
      success: true,
      message: `Mode changed from ${result.previousMode} to ${result.newMode}`,
      previousMode: result.previousMode,
      newMode: result.newMode,
      ...newStatus,
    });
    
  } catch (error: any) {
    console.error('[Mode API] POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
