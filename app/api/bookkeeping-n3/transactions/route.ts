// app/api/bookkeeping-n3/transactions/route.ts
/**
 * N3 記帳オートメーション - 取引データ API
 * 
 * GET: 取引一覧を取得
 * POST: 新規取引を登録（手動/MF同期）
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================================
// GET: 取引一覧を取得
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sourceName = searchParams.get('source_name');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('page_size') || '50');
    
    console.log('[API] 取引一覧を取得:', { status, sourceName, page, pageSize });
    
    // クエリ構築
    let query = supabase
      .from('mf_raw_transactions')
      .select('*', { count: 'exact' })
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false });
    
    // フィルター適用
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (sourceName) {
      query = query.eq('source_name', sourceName);
    }
    
    // ページネーション
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    
    const { data: transactions, count, error } = await query;
    
    if (error) {
      console.error('[API] 取引取得エラー:', error);
      throw error;
    }
    
    // ステータス別カウントを取得
    const { data: statsData } = await supabase
      .from('mf_raw_transactions')
      .select('status')
      .then((result) => {
        const counts = { pending: 0, simulated: 0, submitted: 0, ignored: 0 };
        result.data?.forEach((row) => {
          const s = row.status as keyof typeof counts;
          if (counts[s] !== undefined) counts[s]++;
        });
        return { data: counts };
      });
    
    return NextResponse.json({
      success: true,
      data: {
        transactions: transactions || [],
        total: count || 0,
        page,
        pageSize,
        stats: statsData || { pending: 0, simulated: 0, submitted: 0, ignored: 0 },
      },
    });
    
  } catch (error) {
    console.error('[API] 取引API エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}

// ============================================================
// POST: 新規取引を登録
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactions } = body;
    
    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json(
        { success: false, error: 'transactions は配列である必要があります' },
        { status: 400 }
      );
    }
    
    console.log(`[API] ${transactions.length}件の取引を登録...`);
    
    // UPSERT（mf_transaction_id で重複排除）
    const { data, error } = await supabase
      .from('mf_raw_transactions')
      .upsert(
        transactions.map((tx: any) => ({
          mf_transaction_id: tx.mf_transaction_id || tx.id,
          account_id: tx.account_id,
          source_name: tx.source_name,
          source_type: tx.source_type || 'CREDIT_CARD',
          transaction_date: tx.transaction_date || tx.date,
          raw_memo: tx.raw_memo || tx.description,
          amount: tx.amount,
          status: 'pending',
        })),
        { onConflict: 'mf_transaction_id' }
      )
      .select();
    
    if (error) {
      console.error('[API] 取引登録エラー:', error);
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      data: {
        inserted_count: data?.length || 0,
        transactions: data,
      },
    });
    
  } catch (error) {
    console.error('[API] 取引登録エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}
