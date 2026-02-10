// app/api/system/preflight/route.ts
/**
 * ✈️ Phase G: Pre-flight Check API
 * 
 * @usage GET /api/system/preflight
 */

import { NextRequest, NextResponse } from 'next/server';
import { runPreflightCheck } from '@/lib/startup/preflight-check';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const baseUrl = searchParams.get('baseUrl') || undefined;
    
    const result = await runPreflightCheck(baseUrl);
    
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('[Preflight API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
