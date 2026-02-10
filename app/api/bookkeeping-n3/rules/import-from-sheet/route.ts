// app/api/bookkeeping-n3/rules/import-from-sheet/route.ts
/**
 * スプレッドシートから直接ルールをインポート
 * 公開シートからCSVを取得
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// スプレッドシートIDを抽出
function extractSpreadsheetId(urlOrId: string): string {
  const match = urlOrId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9-_]+$/.test(urlOrId)) return urlOrId;
  throw new Error('無効なスプレッドシートURL/IDです');
}

// 公開スプレッドシートからCSVを取得
async function fetchPublicSheetAsCSV(spreadsheetId: string, sheetName: string): Promise<string> {
  const encodedSheetName = encodeURIComponent(sheetName);
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodedSheetName}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`スプレッドシートの取得に失敗: ${response.status}. シートを公開設定にしてください。`);
  }
  return response.text();
}

// CSVをパース
function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
  const rows: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    // 統計行をスキップ（より厳密にチェック）
    const firstVal = values[0] || '';
    if (
      !firstVal ||
      firstVal.includes('統計') ||
      firstVal.startsWith('---') ||
      firstVal.includes('元ルール数') ||
      firstVal.includes('統合後ルール数') ||
      firstVal.includes('削減率') ||
      firstVal.includes('高信頼ルール') ||
      firstVal.startsWith('(元)') ||
      /^\d+$/.test(firstVal) || // 数字のみの行
      firstVal.includes('%')
    ) {
      continue;
    }
    
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }
  
  return rows;
}

// ルールデータに変換（個別ルール・統合ルール両対応）
function convertToRules(rows: Record<string, string>[]): any[] {
  return rows.map(row => {
    // 統合ルールシートの場合
    if (row['主キーワード']) {
      return {
        keyword: row['主キーワード'] || '',
        match_source: row['抽出元'] || '摘要',
        priority: parseInt(row['優先度']) || 100,
        debit_account: row['借方勘定科目'] || '',
        debit_sub_account: row['借方補助科目'] || '',
        debit_tax_code: row['借方税区分'] || '',
        debit_invoice: row['借方インボイス'] || '',
        credit_account: row['貸方勘定科目'] || '',
        credit_sub_account: row['貸方補助科目'] || '',
        credit_tax_code: row['貸方税区分'] || '',
        credit_invoice: row['貸方インボイス'] || '',
        applied_count: parseInt(row['総出現回数']) || 0,
        confidence_score: (parseInt(row['最高信頼度(%)'] || row['最高信頼度']) || 0) / 100,
        related_keywords: row['関連キーワード'] || '',
      };
    }
    // 個別ルールシートの場合
    return {
      keyword: row['キーワード'] || '',
      match_source: row['抽出元'] || '摘要',
      priority: parseInt(row['優先度']) || 100,
      debit_account: row['借方勘定科目'] || '',
      debit_sub_account: row['借方補助科目'] || '',
      debit_tax_code: row['借方税区分'] || '',
      debit_invoice: row['借方インボイス'] || '',
      credit_account: row['貸方勘定科目'] || '',
      credit_sub_account: row['貸方補助科目'] || '',
      credit_tax_code: row['貸方税区分'] || '',
      credit_invoice: row['貸方インボイス'] || '',
      applied_count: parseInt(row['出現回数']) || 0,
      confidence_score: (parseInt(row['信頼度(%)'] || row['信頼度']) || 0) / 100,
    };
  }).filter(r => r.keyword);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spreadsheet_url, sheet_name = '個別ルール', mode = 'upsert' } = body;
    
    if (!spreadsheet_url) {
      return NextResponse.json({ success: false, error: 'spreadsheet_url は必須です' }, { status: 400 });
    }
    
    console.log('[Sheet Import] 開始:', spreadsheet_url, sheet_name);
    
    const spreadsheetId = extractSpreadsheetId(spreadsheet_url);
    const csv = await fetchPublicSheetAsCSV(spreadsheetId, sheet_name);
    const rows = parseCSV(csv);
    
    console.log('[Sheet Import] パース完了:', rows.length, '行');
    
    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'データが見つかりません。シートを「リンクを知っている全員が閲覧可」に設定してください。',
      });
    }
    
    const rules = convertToRules(rows);
    console.log('[Sheet Import] ルール:', rules.length, '件');
    
    let inserted = 0, updated = 0, skipped = 0;
    
    for (const rule of rules) {
      try {
        const { data: existing } = await supabase
          .from('mf_bookkeeping_rules')
          .select('id')
          .eq('keyword', rule.keyword)
          .eq('match_source', rule.match_source)
          .single();
        
        const ruleData = {
          rule_name: `${rule.keyword}の自動仕訳`,
          keyword: rule.keyword,
          match_type: 'partial',
          match_source: rule.match_source,
          priority: rule.priority,
          target_category: rule.debit_account,
          target_sub_category: rule.debit_sub_account,
          tax_code: rule.debit_tax_code,
          debit_invoice: rule.debit_invoice,
          credit_account: rule.credit_account,
          credit_sub_account: rule.credit_sub_account,
          credit_tax_code: rule.credit_tax_code,
          credit_invoice: rule.credit_invoice,
          applied_count: rule.applied_count,
          ai_confidence_score: rule.confidence_score,
          status: 'active',
          source_spreadsheet_id: spreadsheetId,
        };
        
        if (existing) {
          await supabase.from('mf_bookkeeping_rules').update({ ...ruleData, updated_at: new Date().toISOString() }).eq('id', existing.id);
          updated++;
        } else {
          await supabase.from('mf_bookkeeping_rules').insert(ruleData);
          inserted++;
        }
      } catch (err) {
        skipped++;
      }
    }
    
    console.log('[Sheet Import] 完了:', { inserted, updated, skipped });
    
    return NextResponse.json({
      success: true,
      data: { total: rules.length, inserted, updated, skipped, spreadsheet_id: spreadsheetId },
    });
    
  } catch (error) {
    console.error('[Sheet Import] エラー:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '不明なエラー' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'スプレッドシートインポートAPI',
    usage: {
      method: 'POST',
      body: {
        spreadsheet_url: 'スプレッドシートのURL',
        sheet_name: 'シート名（デフォルト: 個別ルール）',
      },
      note: 'シートを「リンクを知っている全員が閲覧可」に設定してください',
    },
  });
}
