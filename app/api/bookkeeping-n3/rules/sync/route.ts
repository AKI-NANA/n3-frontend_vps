// app/api/bookkeeping-n3/rules/sync/route.ts
/**
 * スプレッドシートからの差分同期API
 * 修正されたデータのみ同期する
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rules, mode = 'upsert', spreadsheet_id } = body;
    
    if (!rules || !Array.isArray(rules)) {
      return NextResponse.json(
        { success: false, error: 'rulesは配列で指定してください' },
        { status: 400 }
      );
    }
    
    console.log(`[Rules Sync] ${rules.length}件のルールを同期 (mode: ${mode})`);
    
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let deleted = 0;
    const errors: string[] = [];
    
    // モード: upsert（挿入または更新）
    if (mode === 'upsert') {
      for (const rule of rules) {
        if (!rule.keyword || rule.keyword.trim() === '') {
          skipped++;
          continue;
        }
        
        try {
          // 既存ルールをチェック（キーワード + match_source で一意）
          const { data: existing } = await supabase
            .from('mf_bookkeeping_rules')
            .select('id, keyword, match_source, updated_at')
            .eq('keyword', rule.keyword)
            .eq('match_source', rule.match_source || '摘要')
            .single();
          
          const ruleData = {
            rule_name: rule.rule_name || `${rule.keyword}の自動仕訳`,
            keyword: rule.keyword,
            match_type: rule.match_type || 'partial',
            match_source: rule.match_source || '摘要',
            priority: rule.priority || 100,
            target_category: rule.debit_account || rule.target_category || '',
            target_sub_category: rule.debit_sub_account || rule.target_sub_category || '',
            tax_code: rule.debit_tax_code || rule.tax_code || '',
            debit_invoice: rule.debit_invoice || '',
            credit_account: rule.credit_account || '',
            credit_sub_account: rule.credit_sub_account || '',
            credit_tax_code: rule.credit_tax_code || '',
            credit_invoice: rule.credit_invoice || '',
            applied_count: rule.applied_count || 0,
            ai_confidence_score: rule.confidence_score || null,
            status: rule.status || 'active',
            source_spreadsheet_id: spreadsheet_id,
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
            
            if (error) throw error;
            updated++;
          } else {
            // 新規挿入
            const { error } = await supabase
              .from('mf_bookkeeping_rules')
              .insert(ruleData);
            
            if (error) throw error;
            inserted++;
          }
        } catch (err) {
          errors.push(`${rule.keyword}: ${err}`);
          skipped++;
        }
      }
    }
    
    // モード: replace（全置換 - スプレッドシートにないルールを削除）
    if (mode === 'replace' && spreadsheet_id) {
      // スプレッドシートから来たキーワードセット
      const newKeywords = new Set(rules.map(r => `${r.keyword}|${r.match_source || '摘要'}`));
      
      // 既存のスプレッドシート由来ルールを取得
      const { data: existingRules } = await supabase
        .from('mf_bookkeeping_rules')
        .select('id, keyword, match_source')
        .eq('source_spreadsheet_id', spreadsheet_id);
      
      if (existingRules) {
        for (const existing of existingRules) {
          const key = `${existing.keyword}|${existing.match_source}`;
          if (!newKeywords.has(key)) {
            // スプレッドシートにないルールを削除（アーカイブ）
            await supabase
              .from('mf_bookkeeping_rules')
              .update({ status: 'archived', updated_at: new Date().toISOString() })
              .eq('id', existing.id);
            deleted++;
          }
        }
      }
      
      // 残りはupsert
      for (const rule of rules) {
        if (!rule.keyword || rule.keyword.trim() === '') {
          skipped++;
          continue;
        }
        
        try {
          const { data: existing } = await supabase
            .from('mf_bookkeeping_rules')
            .select('id')
            .eq('keyword', rule.keyword)
            .eq('match_source', rule.match_source || '摘要')
            .single();
          
          const ruleData = {
            rule_name: rule.rule_name || `${rule.keyword}の自動仕訳`,
            keyword: rule.keyword,
            match_type: rule.match_type || 'partial',
            match_source: rule.match_source || '摘要',
            priority: rule.priority || 100,
            target_category: rule.debit_account || rule.target_category || '',
            target_sub_category: rule.debit_sub_account || rule.target_sub_category || '',
            tax_code: rule.debit_tax_code || rule.tax_code || '',
            debit_invoice: rule.debit_invoice || '',
            credit_account: rule.credit_account || '',
            credit_sub_account: rule.credit_sub_account || '',
            credit_tax_code: rule.credit_tax_code || '',
            credit_invoice: rule.credit_invoice || '',
            applied_count: rule.applied_count || 0,
            ai_confidence_score: rule.confidence_score || null,
            status: 'active',
            source_spreadsheet_id: spreadsheet_id,
          };
          
          if (existing) {
            await supabase
              .from('mf_bookkeeping_rules')
              .update({ ...ruleData, updated_at: new Date().toISOString() })
              .eq('id', existing.id);
            updated++;
          } else {
            await supabase.from('mf_bookkeeping_rules').insert(ruleData);
            inserted++;
          }
        } catch (err) {
          errors.push(`${rule.keyword}: ${err}`);
          skipped++;
        }
      }
    }
    
    console.log(`[Rules Sync] 完了: 挿入=${inserted}, 更新=${updated}, 削除=${deleted}, スキップ=${skipped}`);
    
    return NextResponse.json({
      success: true,
      data: {
        total: rules.length,
        inserted,
        updated,
        deleted,
        skipped,
        errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
      },
    });
    
  } catch (error) {
    console.error('[Rules Sync] エラー:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '不明なエラー' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'ルール同期API',
    usage: {
      method: 'POST',
      body: {
        rules: '同期するルール配列',
        mode: 'upsert | replace',
        spreadsheet_id: 'スプレッドシートID（オプション）',
      },
      modes: {
        upsert: '既存ルールは更新、新規は挿入',
        replace: 'スプレッドシートにないルールは削除',
      },
    },
  });
}
