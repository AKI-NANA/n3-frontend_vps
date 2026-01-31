/**
 * ====================================================================
 * N3 Sync Status API - 同期状態確認
 * ====================================================================
 * Phase E: UI 表示状態強化（事故可視化）
 * 
 * 最終 Pull/Push 時刻、エラー有無を返す
 * 
 * @version 1.0.0
 * @date 2026-01-28
 * ====================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SPREADSHEET_ID = process.env.STOCKTAKE_SPREADSHEET_ID || '1lD9ESIhv2oTE6sgL172wOOF9fJAcIy0SHrdhkLNw3MM';

interface SyncStatus {
  pull: {
    last_executed_at: string | null;
    last_status: 'success' | 'error' | 'skipped' | null;
    last_error: string | null;
    updated_rows: number | null;
  };
  push: {
    last_executed_at: string | null;
    last_status: 'success' | 'error' | 'skipped' | null;
    last_error: string | null;
    synced_count: number | null;
  };
  is_locked: boolean;
  spreadsheet_url: string;
  enabled: boolean;
}

/**
 * GET /api/sync/status
 * 同期状態を取得
 */
export async function GET(request: NextRequest) {
  try {
    const status: SyncStatus = {
      pull: {
        last_executed_at: null,
        last_status: null,
        last_error: null,
        updated_rows: null,
      },
      push: {
        last_executed_at: null,
        last_status: null,
        last_error: null,
        synced_count: null,
      },
      is_locked: false,
      spreadsheet_url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`,
      enabled: process.env.SPREADSHEET_SYNC_ENABLED !== 'false',
    };

    // 最新のPullログを取得
    try {
      const { data: pullLog } = await supabase
        .from('sync_log')
        .select('*')
        .eq('action', 'pull')
        .order('executed_at', { ascending: false })
        .limit(1)
        .single();

      if (pullLog) {
        status.pull.last_executed_at = pullLog.executed_at;
        status.pull.last_status = pullLog.status;
        status.pull.last_error = pullLog.details?.error || null;
        status.pull.updated_rows = pullLog.details?.stats?.updated || null;
      }
    } catch {
      // テーブルが存在しない場合は無視
    }

    // 最新のPushログを取得
    try {
      const { data: pushLog } = await supabase
        .from('sync_log')
        .select('*')
        .eq('action', 'push')
        .order('executed_at', { ascending: false })
        .limit(1)
        .single();

      if (pushLog) {
        status.push.last_executed_at = pushLog.executed_at;
        status.push.last_status = pushLog.status;
        status.push.last_error = pushLog.details?.error || null;
        status.push.synced_count = pushLog.details?.synced_count || null;
      }
    } catch {
      // テーブルが存在しない場合は無視
    }

    // ロック状態を確認
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data: lock } = await supabase
        .from('sync_lock')
        .select('*')
        .eq('type', 'spreadsheet')
        .gt('locked_at', fiveMinutesAgo)
        .single();

      status.is_locked = !!lock;
    } catch {
      // テーブルが存在しない場合は無視
    }

    // 最新10件のログ履歴も取得
    let recentLogs: any[] = [];
    try {
      const { data } = await supabase
        .from('sync_log')
        .select('*')
        .order('executed_at', { ascending: false })
        .limit(10);
      recentLogs = data || [];
    } catch {
      // テーブルが存在しない場合は無視
    }

    return NextResponse.json({
      success: true,
      status,
      recent_logs: recentLogs,
    });

  } catch (error: any) {
    console.error('[SyncStatus] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
