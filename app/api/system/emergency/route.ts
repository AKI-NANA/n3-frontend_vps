// app/api/system/emergency/route.ts
/**
 * Emergency Stop API
 * 全自動処理を即座に停止
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: 現在の状態確認
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data } = await supabase
      .from('system_config')
      .select('value, updated_at')
      .eq('key', 'emergency_stop')
      .single();

    return NextResponse.json({
      success: true,
      emergency_stop: data?.value === true,
      updated_at: data?.updated_at,
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// POST: 緊急停止ON/OFF
export async function POST(request: NextRequest) {
  try {
    // APIキー検証（既存のCRON_SECRETを使用）
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.CRON_SECRET) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { stop } = body;

    if (typeof stop !== 'boolean') {
      return NextResponse.json({ 
        success: false, 
        error: 'stop parameter (boolean) required' 
      }, { status: 400 });
    }

    const supabase = await createClient();

    await supabase
      .from('system_config')
      .upsert({
        key: 'emergency_stop',
        value: stop,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' });

    // ログ記録
    await supabase
      .from('system_config')
      .upsert({
        key: 'emergency_stop_log',
        value: {
          action: stop ? 'STOP' : 'RESUME',
          triggered_at: new Date().toISOString(),
          source: request.headers.get('user-agent') || 'unknown',
        },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' });

    return NextResponse.json({
      success: true,
      emergency_stop: stop,
      message: stop 
        ? '🚨 EMERGENCY STOP ACTIVATED - All auto operations halted'
        : '✅ EMERGENCY STOP DEACTIVATED - Auto operations resumed',
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
