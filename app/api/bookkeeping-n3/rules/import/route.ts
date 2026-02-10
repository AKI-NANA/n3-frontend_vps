// app/api/bookkeeping-n3/rules/import/route.ts
/**
 * 記帳ルール一括インポートAPI
 * スプレッドシートからルールをインポート
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rules, spreadsheet_id, spreadsheet_url, imported_at } = body;
    
    if (!rules || !Array.isArray(rules) || rules.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ルールデータが必要です' },
        { status: 400 }
      );
    }
    
    console.log(`[Rules Import] ${rules.length}件のルールをインポート開始`);
    
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];
    
    for (const rule of rules) {
      try {
        // キーワードが空の場合はスキップ
        if (!rule.keyword || rule.keyword.trim() === '') {
          skipped++;
          continue;
        }
        
        // 既存ルールをチェック（キーワード + match_source で一意）
        const { data: existing } = await supabase
          .from('mf_bookkeeping_rules')
          .select('id')
          .eq('keyword', rule.keyword)
          .eq('match_source', rule.match_source || '摘要')
          .single();
        
        const ruleData = {
          rule_name: `${rule.keyword}の自動仕訳`,
          keyword: rule.keyword,
          match_type: rule.match_type || 'partial',
          match_source: rule.match_source || '摘要',
          priority: rule.priority || 100,
          
          // 借方
          target_category: rule.debit_account || '',
          target_sub_category: rule.debit_sub_account || '',
          tax_code: rule.debit_tax_code || '',
          debit_invoice: rule.debit_invoice || '',
          
          // 貸方
          credit_account: rule.credit_account || '',
          credit_sub_account: rule.credit_sub_account || '',
          credit_tax_code: rule.credit_tax_code || '',
          credit_invoice: rule.credit_invoice || '',
          
          // メタデータ
          applied_count: rule.applied_count || 0,
          ai_confidence_score: rule.confidence_score || null,
          status: rule.status || 'active',
          source_spreadsheet_id: spreadsheet_id,
          source_spreadsheet_url: spreadsheet_url,
          imported_at: imported_at,
        };
        
        if (existing) {
          // 更新
          const { error } = await supabase
            .from('mf_bookkeeping_rules')
            .update({
              ...ruleData,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);
          
          if (error) {
            errors.push(`更新エラー (${rule.keyword}): ${error.message}`);
          } else {
            updated++;
          }
        } else {
          // 新規挿入
          const { error } = await supabase
            .from('mf_bookkeeping_rules')
            .insert(ruleData);
          
          if (error) {
            errors.push(`挿入エラー (${rule.keyword}): ${error.message}`);
          } else {
            inserted++;
          }
        }
      } catch (err) {
        errors.push(`処理エラー (${rule.keyword}): ${err}`);
        skipped++;
      }
    }
    
    console.log(`[Rules Import] 完了: 挿入=${inserted}, 更新=${updated}, スキップ=${skipped}`);
    
    return NextResponse.json({
      success: true,
      data: {
        total: rules.length,
        inserted,
        updated,
        skipped,
        errors: errors.length > 0 ? errors.slice(0, 10) : undefined, // 最初の10件のみ
      },
    });
    
  } catch (error) {
    console.error('[Rules Import] エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: '記帳ルールインポートAPI',
    usage: {
      method: 'POST',
      body: {
        rules: [
          {
            keyword: 'キーワード',
            match_source: '摘要 | 借方補助科目 | 貸方補助科目 | メモ',
            debit_account: '借方勘定科目',
            debit_sub_account: '借方補助科目',
            debit_tax_code: '借方税区分',
            credit_account: '貸方勘定科目',
            credit_sub_account: '貸方補助科目',
            credit_tax_code: '貸方税区分',
            priority: 1,
            confidence_score: 0.95,
          }
        ],
        spreadsheet_id: 'optional',
        spreadsheet_url: 'optional',
      },
    },
  });
}
