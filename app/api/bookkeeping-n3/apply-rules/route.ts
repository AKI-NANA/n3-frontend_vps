// app/api/bookkeeping-n3/apply-rules/route.ts
/**
 * N3 記帳オートメーション - ルール適用 API
 * 
 * POST: 取引に対してルールを一括適用
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BookkeepingRule {
  id: string;
  keyword: string;
  match_type: 'partial' | 'exact' | 'regex';
  target_category: string;
  target_sub_category?: string;
  tax_code: string;
  priority: number;
  ai_confidence_score?: number;
}

interface RawTransaction {
  id: string;
  raw_memo: string;
  status: string;
}

// ============================================================
// ルールマッチング関数
// ============================================================

function matchRule(
  transaction: RawTransaction,
  rule: BookkeepingRule
): { matched: boolean; confidence: number } {
  const memo = transaction.raw_memo.toLowerCase();
  const keyword = rule.keyword.toLowerCase();
  
  switch (rule.match_type) {
    case 'exact':
      return { 
        matched: memo === keyword, 
        confidence: 1.0 
      };
    
    case 'regex':
      try {
        const regex = new RegExp(keyword, 'i');
        const matched = regex.test(transaction.raw_memo);
        return { matched, confidence: matched ? 0.9 : 0 };
      } catch {
        return { matched: false, confidence: 0 };
      }
    
    case 'partial':
    default:
      // 部分一致（デフォルト）
      const matched = memo.includes(keyword);
      // マッチした場合、キーワードの長さに基づいて確信度を計算
      const confidence = matched 
        ? Math.min(0.95, 0.5 + (keyword.length / memo.length) * 0.5)
        : 0;
      return { matched, confidence };
  }
}

// ============================================================
// POST: ルールを適用
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transaction_ids } = body;
    
    console.log('[API] ルール適用開始:', { transaction_ids: transaction_ids?.length || 'all' });
    
    // 1. アクティブなルールを取得（優先度順）
    const { data: rules, error: rulesError } = await supabase
      .from('mf_bookkeeping_rules')
      .select('*')
      .eq('status', 'active')
      .order('priority', { ascending: true });
    
    if (rulesError) throw rulesError;
    
    if (!rules || rules.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          applied_count: 0,
          transactions: [],
          message: '適用可能なルールがありません',
        },
      });
    }
    
    // 2. 対象取引を取得
    let transactionsQuery = supabase
      .from('mf_raw_transactions')
      .select('*')
      .eq('status', 'pending');
    
    if (transaction_ids && Array.isArray(transaction_ids) && transaction_ids.length > 0) {
      transactionsQuery = transactionsQuery.in('id', transaction_ids);
    }
    
    const { data: transactions, error: txError } = await transactionsQuery;
    
    if (txError) throw txError;
    
    if (!transactions || transactions.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          applied_count: 0,
          transactions: [],
          message: '適用対象の取引がありません',
        },
      });
    }
    
    console.log(`[API] ${transactions.length}件の取引に${rules.length}個のルールを適用...`);
    
    // 3. 各取引にルールを適用
    const updates: {
      id: string;
      matched_rule_id: string;
      simulated_debit_account: string;
      simulated_credit_account: string;
      simulated_tax_code: string;
      confidence_score: number;
      status: string;
    }[] = [];
    
    for (const tx of transactions) {
      // 優先度順にルールをチェック
      for (const rule of rules as BookkeepingRule[]) {
        const { matched, confidence } = matchRule(tx, rule);
        
        if (matched) {
          updates.push({
            id: tx.id,
            matched_rule_id: rule.id,
            simulated_debit_account: rule.target_category,
            simulated_credit_account: 'クレジットカード', // デフォルト: カード払い
            simulated_tax_code: rule.tax_code,
            confidence_score: rule.ai_confidence_score || confidence,
            status: 'simulated',
          });
          
          // ルール使用回数を更新
          await supabase
            .from('mf_bookkeeping_rules')
            .update({
              applied_count: (rule as any).applied_count + 1,
              last_applied_at: new Date().toISOString(),
            })
            .eq('id', rule.id);
          
          break; // 最初にマッチしたルールのみ適用
        }
      }
    }
    
    // 4. 更新をバッチで実行
    const updatedTransactions: any[] = [];
    
    for (const update of updates) {
      const { data, error } = await supabase
        .from('mf_raw_transactions')
        .update({
          matched_rule_id: update.matched_rule_id,
          simulated_debit_account: update.simulated_debit_account,
          simulated_credit_account: update.simulated_credit_account,
          simulated_tax_code: update.simulated_tax_code,
          confidence_score: update.confidence_score,
          status: update.status,
        })
        .eq('id', update.id)
        .select()
        .single();
      
      if (!error && data) {
        updatedTransactions.push(data);
      }
    }
    
    console.log(`[API] ${updatedTransactions.length}件の取引にルールを適用完了`);
    
    return NextResponse.json({
      success: true,
      data: {
        applied_count: updatedTransactions.length,
        total_transactions: transactions.length,
        transactions: updatedTransactions,
      },
      message: `${updatedTransactions.length}件の取引にルールを適用しました`,
    });
    
  } catch (error) {
    console.error('[API] ルール適用エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}
