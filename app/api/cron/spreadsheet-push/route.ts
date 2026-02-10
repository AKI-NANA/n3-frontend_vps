/**
 * ====================================================================
 * N3 Cron API - Spreadsheet Push 自動同期（夜間監査用）
 * ====================================================================
 * 毎日深夜2時に DB → Google Spreadsheet の同期を実行
 * 
 * Phase C: 夜間 Push（監査用）
 * 
 * 使用例 (crontab -e):
 * 0 2 * * * curl -X POST "http://localhost:3000/api/cron/spreadsheet-push" -H "Authorization: Bearer YOUR_CRON_SECRET"
 * 
 * @version 1.0.0
 * @date 2026-01-28
 * ====================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase クライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 認証シークレット
const CRON_SECRET = process.env.CRON_SECRET || process.env.N3_INTERNAL_TOKEN;

// 同期有効フラグ
const SPREADSHEET_SYNC_ENABLED = process.env.SPREADSHEET_SYNC_ENABLED !== 'false';

/**
 * 認証チェック
 */
function verifyCronAuth(request: NextRequest): boolean {
  if (process.env.NODE_ENV === 'development') {
    console.log('[CRON] 開発環境: 認証スキップ');
    return true;
  }

  if (!CRON_SECRET) {
    console.error('[CRON] ❌ CRON_SECRET が設定されていません');
    return false;
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return false;
  }

  const token = authHeader.replace('Bearer ', '');
  return token === CRON_SECRET;
}

/**
 * ロック取得
 */
async function acquireLock(): Promise<boolean> {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: existingLock } = await supabase
      .from('sync_lock')
      .select('*')
      .eq('type', 'spreadsheet')
      .gt('locked_at', fiveMinutesAgo)
      .single();

    if (existingLock) {
      console.log('[CRON] ⚠️ 別プロセスが同期中です');
      return false;
    }

    await supabase
      .from('sync_lock')
      .delete()
      .eq('type', 'spreadsheet');

    const { error } = await supabase
      .from('sync_lock')
      .insert({
        type: 'spreadsheet',
        locked_at: new Date().toISOString(),
      });

    if (error && error.code !== '42P01') {
      console.error('[CRON] ロック取得エラー:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.log('[CRON] ロックチェックスキップ');
    return true;
  }
}

/**
 * ロック解放
 */
async function releaseLock(): Promise<void> {
  try {
    await supabase
      .from('sync_lock')
      .delete()
      .eq('type', 'spreadsheet');
  } catch (error) {
    // エラーは無視
  }
}

/**
 * 同期ログを記録
 */
async function logSyncExecution(
  action: 'pull' | 'push',
  status: 'success' | 'error' | 'skipped',
  details: Record<string, any>
): Promise<void> {
  try {
    await supabase
      .from('sync_log')
      .insert({
        action,
        status,
        details,
        executed_at: new Date().toISOString(),
      });
  } catch (error) {
    console.log(`[CRON] sync_log テーブル未作成（詳細: ${JSON.stringify(details)}）`);
  }
}

/**
 * POST /api/cron/spreadsheet-push
 * DB → Spreadsheet の自動同期（夜間監査用）
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  console.log('[CRON] ========================================');
  console.log('[CRON] Spreadsheet Push Start (夜間監査)');
  console.log('[CRON] Time:', new Date().toISOString());
  console.log('[CRON] ========================================');

  // 同期無効チェック
  if (!SPREADSHEET_SYNC_ENABLED) {
    console.log('[CRON] ⏸️ Spreadsheet同期が無効です（SPREADSHEET_SYNC_ENABLED=false）');
    return NextResponse.json({
      success: true,
      skipped: true,
      message: 'Spreadsheet sync is disabled',
    });
  }

  // 認証チェック
  if (!verifyCronAuth(request)) {
    console.error('[CRON] ❌ 認証エラー');
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // ロック取得
  const lockAcquired = await acquireLock();
  if (!lockAcquired) {
    console.log('[CRON] ⏸️ 同期スキップ（ロック取得失敗）');
    await logSyncExecution('push', 'skipped', { reason: 'lock_failed' });
    return NextResponse.json({
      success: true,
      skipped: true,
      message: 'Another sync process is running',
    }, { status: 409 });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    console.log('[CRON] 📤 Push API 呼び出し中...');
    
    const response = await fetch(`${baseUrl}/api/sync/stocktake-spreadsheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targets: ['physicalStock', 'allData', 'setVariation'],
      }),
    });

    const result = await response.json();
    const durationMs = Date.now() - startTime;

    if (!response.ok || !result.success) {
      console.error('[CRON] ❌ Push API エラー:', result.error || response.statusText);
      await logSyncExecution('push', 'error', {
        error: result.error || response.statusText,
        duration_ms: durationMs,
      });
      
      return NextResponse.json({
        success: false,
        error: result.error || 'Push API failed',
        duration_ms: durationMs,
      }, { status: 500 });
    }

    // 成功ログ
    console.log('[CRON] ========================================');
    console.log('[CRON] ✅ Spreadsheet Push Complete');
    console.log(`[CRON] Synced: ${result.syncedCount || 0} rows`);
    console.log(`[CRON] Duration: ${durationMs}ms`);
    console.log('[CRON] ========================================');

    await logSyncExecution('push', 'success', {
      synced_count: result.syncedCount,
      results: result.results,
      duration_ms: durationMs,
    });

    return NextResponse.json({
      success: true,
      synced_count: result.syncedCount,
      results: result.results,
      spreadsheet_url: result.spreadsheetUrl,
      duration_ms: durationMs,
      message: `Pushed ${result.syncedCount || 0} rows to spreadsheet`,
    });

  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    
    console.error('[CRON] ❌ 予期せぬエラー:', error);
    await logSyncExecution('push', 'error', {
      error: error.message,
      duration_ms: durationMs,
    });

    return NextResponse.json({
      success: false,
      error: error.message,
      duration_ms: durationMs,
    }, { status: 500 });

  } finally {
    await releaseLock();
  }
}

/**
 * GET /api/cron/spreadsheet-push
 * ステータス確認用
 */
export async function GET(request: NextRequest) {
  let lastSync = null;
  try {
    const { data } = await supabase
      .from('sync_log')
      .select('*')
      .eq('action', 'push')
      .order('executed_at', { ascending: false })
      .limit(1)
      .single();
    lastSync = data;
  } catch {
    // テーブルが存在しない場合は無視
  }

  return NextResponse.json({
    enabled: SPREADSHEET_SYNC_ENABLED,
    endpoint: '/api/cron/spreadsheet-push',
    method: 'POST',
    recommended_time: '02:00 JST (夜間)',
    last_sync: lastSync,
    crontab_example: '0 2 * * * curl -X POST "https://your-domain/api/cron/spreadsheet-push" -H "Authorization: Bearer YOUR_CRON_SECRET"',
  });
}
