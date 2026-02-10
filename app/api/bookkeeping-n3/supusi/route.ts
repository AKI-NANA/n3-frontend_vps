// app/api/bookkeeping-n3/supusi/route.ts
/**
 * Supusi連携API
 * Google Apps ScriptからN3記帳ルールを呼び出す
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================================
// GET: ルール一覧を取得（Supusi/GASから呼び出し用）
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // アクション: ルール一覧取得
    if (action === 'get_rules' || !action) {
      const { data: rules, error } = await supabase
        .from('mf_bookkeeping_rules')
        .select('*')
        .eq('status', 'active')
        .order('priority', { ascending: true });
      
      if (error) throw error;
      
      return NextResponse.json({
        success: true,
        data: {
          rules: rules || [],
          total: rules?.length || 0,
        },
      });
    }
    
    // アクション: 統計取得
    if (action === 'get_stats') {
      const { data: rules } = await supabase
        .from('mf_bookkeeping_rules')
        .select('match_source, status, ai_confidence_score')
        .eq('status', 'active');
      
      const stats = {
        total: rules?.length || 0,
        bySource: {
          '借方補助科目': rules?.filter(r => r.match_source === '借方補助科目').length || 0,
          '貸方補助科目': rules?.filter(r => r.match_source === '貸方補助科目').length || 0,
          '摘要': rules?.filter(r => r.match_source === '摘要').length || 0,
          'メモ': rules?.filter(r => r.match_source === 'メモ').length || 0,
        },
        highConfidence: rules?.filter(r => (r.ai_confidence_score || 0) >= 0.9).length || 0,
      };
      
      return NextResponse.json({ success: true, data: stats });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supusi連携API',
      actions: ['get_rules', 'get_stats'],
    });
    
  } catch (error) {
    console.error('[Supusi API] エラー:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '不明なエラー' },
      { status: 500 }
    );
  }
}

// ============================================================
// POST: ルール適用（生データを記帳データに変換）
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, transactions } = body;
    
    // アクション: ルール適用
    if (action === 'apply_rules') {
      if (!transactions || !Array.isArray(transactions)) {
        return NextResponse.json(
          { success: false, error: 'transactionsは配列で指定してください' },
          { status: 400 }
        );
      }
      
      // ルールを取得
      const { data: rules } = await supabase
        .from('mf_bookkeeping_rules')
        .select('*')
        .eq('status', 'active')
        .order('priority', { ascending: true });
      
      if (!rules || rules.length === 0) {
        return NextResponse.json({
          success: true,
          data: {
            results: transactions.map(t => ({ ...t, matched: false, rule: null })),
            matched: 0,
            unmatched: transactions.length,
          },
        });
      }
      
      // 各取引にルールを適用
      const results = transactions.map(transaction => {
        const { description, memo, debit_sub, credit_sub } = transaction;
        
        // マッチするルールを探す（優先度順）
        for (const rule of rules) {
          let matched = false;
          
          switch (rule.match_source) {
            case '借方補助科目':
              if (debit_sub && debit_sub.includes(rule.keyword)) matched = true;
              break;
            case '貸方補助科目':
              if (credit_sub && credit_sub.includes(rule.keyword)) matched = true;
              break;
            case '摘要':
              if (description && description.includes(rule.keyword)) matched = true;
              break;
            case 'メモ':
              if (memo && memo.includes(rule.keyword)) matched = true;
              break;
            default:
              // 全フィールドで部分一致
              if (
                (description && description.includes(rule.keyword)) ||
                (memo && memo.includes(rule.keyword)) ||
                (debit_sub && debit_sub.includes(rule.keyword)) ||
                (credit_sub && credit_sub.includes(rule.keyword))
              ) {
                matched = true;
              }
          }
          
          if (matched) {
            return {
              ...transaction,
              matched: true,
              rule_id: rule.id,
              rule_keyword: rule.keyword,
              // 記帳データ
              debit_account: rule.target_category,
              debit_sub_account: rule.target_sub_category,
              debit_tax_code: rule.tax_code,
              debit_invoice: rule.debit_invoice,
              credit_account: rule.credit_account,
              credit_sub_account: rule.credit_sub_account,
              credit_tax_code: rule.credit_tax_code,
              credit_invoice: rule.credit_invoice,
              confidence: rule.ai_confidence_score,
            };
          }
        }
        
        // マッチしなかった
        return { ...transaction, matched: false, rule: null };
      });
      
      const matched = results.filter(r => r.matched).length;
      const unmatched = results.filter(r => !r.matched).length;
      
      return NextResponse.json({
        success: true,
        data: {
          results,
          matched,
          unmatched,
          rules_used: rules.length,
        },
      });
    }
    
    // アクション: ルール同期（スプレッドシートから）
    if (action === 'sync_rules') {
      const { rules: newRules, spreadsheet_id } = body;
      
      if (!newRules || !Array.isArray(newRules)) {
        return NextResponse.json(
          { success: false, error: 'rulesは配列で指定してください' },
          { status: 400 }
        );
      }
      
      // 同期APIに委譲
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/bookkeeping-n3/rules/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules: newRules, mode: 'upsert', spreadsheet_id }),
      });
      
      const result = await response.json();
      return NextResponse.json(result);
    }
    
    return NextResponse.json({
      success: false,
      error: '不明なアクション',
      available_actions: ['apply_rules', 'sync_rules'],
    });
    
  } catch (error) {
    console.error('[Supusi API] エラー:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '不明なエラー' },
      { status: 500 }
    );
  }
}
