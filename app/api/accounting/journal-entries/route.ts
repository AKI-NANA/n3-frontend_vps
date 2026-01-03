// ========================================
// 仕訳エントリAPI
// 作成日: 2025-11-30
// エンドポイント: /api/accounting/journal-entries
// 目的: 会計台帳（仕訳エントリ）のCRUD
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET: 仕訳エントリ一覧取得
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending, verified, submitted
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const limit = parseInt(searchParams.get('limit') || '100');

    const supabase = await createClient();

    let query = supabase
      .from('accounting_final_ledger')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);

    // ステータスフィルター
    if (status === 'pending') {
      query = query.eq('is_verified', false);
    } else if (status === 'verified') {
      query = query.eq('is_verified', true).is('mf_journal_id', null);
    } else if (status === 'submitted') {
      query = query.not('mf_journal_id', 'is', null);
    }

    // 日付フィルター
    if (dateFrom) {
      query = query.gte('date', dateFrom);
    }
    if (dateTo) {
      query = query.lte('date', dateTo);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[JournalEntriesAPI] 取得エラー:', error);
      return NextResponse.json(
        { success: false, message: 'データの取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('[JournalEntriesAPI] エラー:', error);
    return NextResponse.json(
      { success: false, message: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * PUT: 仕訳エントリ更新（承認など）
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, action, updates } = body;

    const supabase = await createClient();

    // 一括承認
    if (action === 'approve' && ids && ids.length > 0) {
      const { error } = await supabase
        .from('accounting_final_ledger')
        .update({
          is_verified: true,
          verified_at: new Date().toISOString(),
          verified_by: 'admin' // TODO: 実際のユーザー名
        })
        .in('id', ids);

      if (error) {
        console.error('[JournalEntriesAPI] 承認エラー:', error);
        return NextResponse.json(
          { success: false, message: '承認に失敗しました' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `${ids.length}件を承認しました`
      });
    }

    // 一括承認取消
    if (action === 'unapprove' && ids && ids.length > 0) {
      const { error } = await supabase
        .from('accounting_final_ledger')
        .update({
          is_verified: false,
          verified_at: null,
          verified_by: null
        })
        .in('id', ids)
        .is('mf_journal_id', null); // 未送信のみ

      if (error) {
        console.error('[JournalEntriesAPI] 承認取消エラー:', error);
        return NextResponse.json(
          { success: false, message: '承認取消に失敗しました' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `${ids.length}件の承認を取消しました`
      });
    }

    // 個別更新
    if (updates && ids && ids.length === 1) {
      const { error } = await supabase
        .from('accounting_final_ledger')
        .update(updates)
        .eq('id', ids[0]);

      if (error) {
        console.error('[JournalEntriesAPI] 更新エラー:', error);
        return NextResponse.json(
          { success: false, message: '更新に失敗しました' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '更新しました'
      });
    }

    return NextResponse.json(
      { success: false, message: '不正なリクエストです' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[JournalEntriesAPI] エラー:', error);
    return NextResponse.json(
      { success: false, message: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: 仕訳エントリ削除
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'IDが必要です' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 送信済みは削除不可
    const { data: entry } = await supabase
      .from('accounting_final_ledger')
      .select('mf_journal_id')
      .eq('id', id)
      .single();

    if (entry?.mf_journal_id) {
      return NextResponse.json(
        { success: false, message: '送信済みの仕訳は削除できません' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('accounting_final_ledger')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[JournalEntriesAPI] 削除エラー:', error);
      return NextResponse.json(
        { success: false, message: '削除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '削除しました'
    });
  } catch (error) {
    console.error('[JournalEntriesAPI] エラー:', error);
    return NextResponse.json(
      { success: false, message: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}
