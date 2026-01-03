// ========================================
// マネーフォワードクラウド同期API
// 作成日: 2025-11-30
// エンドポイント: POST /api/accounting/sync-mf
// 目的: MFクラウドから取引データを取得し、経費分類を実行
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { moneyCloudConnector } from '@/services/accounting/MoneyCloudConnector';
import { expenseClassifier } from '@/services/accounting/ExpenseClassifier';

/**
 * POST: MFクラウド同期実行
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromDate, toDate } = body;

    // デフォルト: 過去7日間
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const syncFromDate = fromDate || weekAgo.toISOString().split('T')[0];
    const syncToDate = toDate || today.toISOString().split('T')[0];

    console.log(`[SyncMF] 同期開始: ${syncFromDate} ~ ${syncToDate}`);

    const supabase = await createClient();

    // 同期ログを作成
    const { data: logData, error: logError } = await supabase
      .from('money_cloud_sync_logs')
      .insert({
        sync_type: 'TRANSACTIONS',
        sync_status: 'IN_PROGRESS',
        from_date: syncFromDate,
        to_date: syncToDate,
        sync_started_at: new Date().toISOString()
      })
      .select('id')
      .single();

    const logId = logData?.id;

    try {
      // 1. MFクラウドから取引データを取得
      const syncResult = await moneyCloudConnector.syncTransactions(syncFromDate, syncToDate);

      if (!syncResult.success) {
        // 同期失敗
        if (logId) {
          await supabase
            .from('money_cloud_sync_logs')
            .update({
              sync_status: 'FAILED',
              error_message: syncResult.errorMessage,
              sync_completed_at: new Date().toISOString()
            })
            .eq('id', logId);
        }

        return NextResponse.json(
          { success: false, message: syncResult.errorMessage || 'MFクラウド同期に失敗しました' },
          { status: 500 }
        );
      }

      console.log(`[SyncMF] ${syncResult.syncedCount}件の取引を取得しました`);

      // 2. 経費分類を実行
      const classifications = await expenseClassifier.classifyTransactions(
        syncResult.syncedTransactions
      );

      console.log(`[SyncMF] ${classifications.length}件の経費分類を完了しました`);

      // 3. 分類結果を会計台帳に保存
      let savedCount = 0;
      let requiresApprovalCount = 0;

      for (const classification of classifications) {
        const transaction = syncResult.syncedTransactions.find(
          t => t.id === classification.transaction_id
        );

        if (transaction) {
          const ledgerId = await expenseClassifier.saveToLedger(transaction, classification);
          if (ledgerId) {
            savedCount++;
            if (classification.requires_approval) {
              requiresApprovalCount++;
            }
          }
        }
      }

      // 同期ログを更新
      if (logId) {
        await supabase
          .from('money_cloud_sync_logs')
          .update({
            sync_status: 'SUCCESS',
            synced_records_count: syncResult.syncedCount,
            processed_count: savedCount,
            classified_count: classifications.length,
            requires_approval_count: requiresApprovalCount,
            sync_completed_at: new Date().toISOString()
          })
          .eq('id', logId);
      }

      console.log(`[SyncMF] 同期完了: 同期${syncResult.syncedCount}件、分類${savedCount}件、承認待ち${requiresApprovalCount}件`);

      return NextResponse.json({
        success: true,
        message: 'MFクラウド同期が完了しました',
        synced: syncResult.syncedCount,
        classified: savedCount,
        requiresApproval: requiresApprovalCount
      });

    } catch (error) {
      console.error('[SyncMF] 同期エラー:', error);

      // エラーログを更新
      if (logId) {
        await supabase
          .from('money_cloud_sync_logs')
          .update({
            sync_status: 'FAILED',
            error_message: error instanceof Error ? error.message : '不明なエラー',
            sync_completed_at: new Date().toISOString()
          })
          .eq('id', logId);
      }

      throw error;
    }

  } catch (error) {
    console.error('[SyncMF] エラー:', error);
    return NextResponse.json(
      { success: false, message: '同期中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * GET: 同期履歴取得
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('money_cloud_sync_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[SyncMF] 履歴取得エラー:', error);
      return NextResponse.json(
        { success: false, message: '履歴の取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('[SyncMF] エラー:', error);
    return NextResponse.json(
      { success: false, message: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}
