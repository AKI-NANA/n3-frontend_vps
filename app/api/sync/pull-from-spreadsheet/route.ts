// app/api/sync/pull-from-spreadsheet/route.ts
/**
 * スプレッドシート → DB 同期API（Pull機能）
 * 
 * 【安全な上書きロジック】
 * 1. シートのupdated_atとDBのupdated_atを比較
 * 2. シート側が新しい場合のみDBを更新
 * 3. 競合がある場合は警告を返す
 * 
 * @version 1.0.0
 * @date 2026-01-14
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SPREADSHEET_ID = process.env.STOCKTAKE_SPREADSHEET_ID || '1lD9ESIhv2oTE6sgL172wOOF9fJAcIy0SHrdhkLNw3MM';

// ============================================================
// シート設定
// ============================================================
const SHEETS = {
  // マスター在庫（Pull対象）
  physicalStock: {
    name: 'マスター在庫',
    // ヘッダー: ID, SKU, 商品名, 数量, 原価, 保管場所, L1, L2, L3, 要確認, 確定, メモ, 更新日時
    columns: {
      id: 0,
      sku: 1,
      product_name: 2,
      physical_quantity: 3,
      cost_jpy: 4,
      storage_location: 5,
      attr_l1: 6,
      attr_l2: 7,
      attr_l3: 8,
      needs_count_check: 9,
      stock_confirmed: 10,
      stock_memo: 11,
      updated_at: 12,
    },
  },
  // 全出品データ（Pull対象）
  allData: {
    name: '全出品データ',
    // ヘッダー: ID, SKU, 商品名, 在庫タイプ, 商品タイプ, セット品, PSA/グレード, バリ親, バリ子, 数量, 原価, 保管場所, 更新日時
    columns: {
      id: 0,
      sku: 1,
      product_name: 2,
      inventory_type: 3,
      product_type: 4,
      is_set_product: 5,     // セット品フラグ（編集可能）
      grade: 6,               // PSA/グレード（編集可能）
      is_variation_parent: 7,
      is_variation_member: 8,
      physical_quantity: 9,
      cost_jpy: 10,
      storage_location: 11,
      updated_at: 12,
    },
  },
};

// ============================================================
// Google Sheets API
// ============================================================

async function initGoogleSheets() {
  const { google } = await import('googleapis');
  
  let credentials: any;
  
  // 方法1: GOOGLE_SHEETS_CREDENTIALS（JSON文字列）
  if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
    try {
      credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
      console.log('[GoogleSheets] Using GOOGLE_SHEETS_CREDENTIALS from env');
    } catch (e) {
      console.error('[GoogleSheets] Failed to parse GOOGLE_SHEETS_CREDENTIALS:', e);
      throw new Error('Invalid GOOGLE_SHEETS_CREDENTIALS format');
    }
  }
  // 方法2: GOOGLE_APPLICATION_CREDENTIALS（ファイルパス）
  else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const absolutePath = path.isAbsolute(credentialsPath)
      ? credentialsPath
      : path.resolve(process.cwd(), credentialsPath);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Credentials file not found: ${absolutePath}`);
    }
    
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    credentials = JSON.parse(fileContent);
    console.log('[GoogleSheets] Using GOOGLE_APPLICATION_CREDENTIALS from file');
  } else {
    throw new Error('Neither GOOGLE_SHEETS_CREDENTIALS nor GOOGLE_APPLICATION_CREDENTIALS is set');
  }
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  
  return google.sheets({ version: 'v4', auth });
}

/**
 * シートからデータを読み取る
 */
async function readSheetData(sheets: any, spreadsheetId: string, sheetName: string) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    });
    
    const rows = response.data.values || [];
    if (rows.length <= 1) {
      return []; // ヘッダーのみ
    }
    
    // ヘッダー行をスキップ
    return rows.slice(1);
  } catch (err: any) {
    console.error(`[PullSync] Failed to read sheet ${sheetName}:`, err.message);
    throw err;
  }
}

/**
 * 日本語日時文字列をISO形式に変換
 */
function parseJapaneseDateTime(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  try {
    // "2026/01/14 11:30:00" 形式
    const match = dateStr.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2}):(\d{2})/);
    if (match) {
      const [, year, month, day, hour, minute, second] = match;
      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
      );
    }
    
    // ISO形式を試行
    const isoDate = new Date(dateStr);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * チェックマーク文字をbooleanに変換
 */
function parseCheckMark(value: string): boolean {
  return value === '✓' || value === '✔' || value === '1' || value?.toLowerCase() === 'true';
}

// ============================================================
// POST: Pull実行
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      spreadsheetId,
      sheetName = 'マスター在庫',  // デフォルトはマスター在庫
      dryRun = false,              // trueの場合は変更を適用せず差分のみ返す
      forceOverwrite = false,      // trueの場合はタイムスタンプ比較をスキップ
    } = body;
    
    const targetSpreadsheetId = spreadsheetId || SPREADSHEET_ID;
    
    if (!targetSpreadsheetId) {
      return NextResponse.json(
        { success: false, error: 'スプレッドシートIDが未設定です' },
        { status: 400 }
      );
    }
    
    // シート設定を取得
    const sheetConfig = Object.values(SHEETS).find(s => s.name === sheetName);
    if (!sheetConfig) {
      return NextResponse.json(
        { success: false, error: `シート "${sheetName}" は対応していません` },
        { status: 400 }
      );
    }
    
    // Google Sheets API初期化
    let sheets: any;
    try {
      sheets = await initGoogleSheets();
    } catch (err: any) {
      console.error('[PullSync] Google Sheets init error:', err);
      return NextResponse.json(
        { success: false, error: 'Google Sheets API初期化エラー' },
        { status: 500 }
      );
    }
    
    // シートからデータを読み取る
    console.log(`[PullSync] Reading sheet: ${sheetName}`);
    const sheetRows = await readSheetData(sheets, targetSpreadsheetId, sheetName);
    console.log(`[PullSync] Read ${sheetRows.length} rows from sheet`);
    
    if (sheetRows.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'シートにデータがありません',
        stats: { total: 0, updated: 0, skipped: 0, conflicts: 0 },
      });
    }
    
    // 結果統計
    const stats = {
      total: sheetRows.length,
      updated: 0,
      skipped: 0,
      conflicts: 0,
      errors: 0,
      notFound: 0,
    };
    
    const updates: any[] = [];
    const conflicts: any[] = [];
    const errors: any[] = [];
    
    // 各行を処理
    for (const row of sheetRows) {
      const cols = sheetConfig.columns;
      const id = row[cols.id];
      
      if (!id) {
        stats.skipped++;
        continue;
      }
      
      // DBから現在のレコードを取得
      const { data: dbRecord, error: fetchError } = await supabase
        .from('inventory_master')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError || !dbRecord) {
        stats.notFound++;
        errors.push({ id, error: 'DBにレコードが見つかりません' });
        continue;
      }
      
      // シートの更新日時を解析
      const sheetUpdatedAt = parseJapaneseDateTime(row[cols.updated_at]);
      const dbUpdatedAt = dbRecord.updated_at ? new Date(dbRecord.updated_at) : null;
      
      // タイムスタンプ比較（forceOverwriteでスキップ可能）
      if (!forceOverwrite && sheetUpdatedAt && dbUpdatedAt) {
        if (sheetUpdatedAt <= dbUpdatedAt) {
          // シートの方が古い → 競合
          stats.conflicts++;
          conflicts.push({
            id,
            sku: dbRecord.sku,
            product_name: dbRecord.product_name,
            sheetUpdatedAt: sheetUpdatedAt.toISOString(),
            dbUpdatedAt: dbUpdatedAt.toISOString(),
            message: 'シートのデータはDBより古いです',
          });
          continue;
        }
      }
      
      // 更新データを構築
      const updateData: any = {
        updated_at: new Date().toISOString(),
        sync_source: 'spreadsheet_pull',
      };
      
      // マスター在庫シートの場合
      if (sheetName === 'マスター在庫') {
        if (row[cols.physical_quantity] !== undefined && row[cols.physical_quantity] !== '') {
          updateData.physical_quantity = parseInt(row[cols.physical_quantity]) || 0;
        }
        if (row[cols.cost_jpy] !== undefined && row[cols.cost_jpy] !== '') {
          updateData.cost_jpy = parseFloat(row[cols.cost_jpy]) || 0;
        }
        if (row[cols.storage_location]) {
          updateData.storage_location = row[cols.storage_location];
        }
        if (row[cols.attr_l1]) {
          updateData.attr_l1 = row[cols.attr_l1];
        }
        if (row[cols.attr_l2]) {
          updateData.attr_l2 = row[cols.attr_l2];
        }
        if (row[cols.attr_l3]) {
          updateData.attr_l3 = row[cols.attr_l3];
        }
        if (row[cols.needs_count_check] !== undefined) {
          updateData.needs_count_check = parseCheckMark(row[cols.needs_count_check]);
        }
        if (row[cols.stock_confirmed] !== undefined) {
          updateData.stock_confirmed = parseCheckMark(row[cols.stock_confirmed]);
        }
        if (row[cols.stock_memo]) {
          updateData.stock_memo = row[cols.stock_memo];
        }
      }
      
      // 全出品データシートの場合
      if (sheetName === '全出品データ') {
        if (row[cols.inventory_type]) {
          updateData.inventory_type = row[cols.inventory_type];
        }
        if (row[cols.product_type]) {
          updateData.product_type = row[cols.product_type];
        }
        
        // セット品フラグ（シートで"1"を入力したらセット品に設定）
        if (row[cols.is_set_product] !== undefined) {
          const isSet = row[cols.is_set_product] === '1' || 
                        row[cols.is_set_product] === '✓' ||
                        row[cols.is_set_product]?.toLowerCase() === 'true';
          if (isSet) {
            updateData.product_type = 'set';
            // SKUにSET-プレフィックスを自動付与（まだない場合）
            const currentSku = dbRecord.sku || '';
            if (currentSku && !currentSku.toUpperCase().startsWith('SET-')) {
              updateData.sku = `SET-${currentSku}`;
            }
          }
        }
        
        // PSA/グレード（シートで入力したグレードを反映）
        if (row[cols.grade] && row[cols.grade].trim()) {
          updateData.grade = row[cols.grade].trim().toUpperCase();
          updateData.is_graded = true;
        }
        
        if (row[cols.is_variation_parent] !== undefined) {
          updateData.is_variation_parent = parseCheckMark(row[cols.is_variation_parent]);
        }
        if (row[cols.is_variation_member] !== undefined) {
          updateData.is_variation_member = parseCheckMark(row[cols.is_variation_member]);
        }
        if (row[cols.physical_quantity] !== undefined && row[cols.physical_quantity] !== '') {
          updateData.physical_quantity = parseInt(row[cols.physical_quantity]) || 0;
        }
        if (row[cols.cost_jpy] !== undefined && row[cols.cost_jpy] !== '') {
          updateData.cost_jpy = parseFloat(row[cols.cost_jpy]) || 0;
        }
        if (row[cols.storage_location]) {
          updateData.storage_location = row[cols.storage_location];
        }
      }
      
      // 変更があるか確認
      const hasChanges = Object.keys(updateData).some(key => {
        if (key === 'updated_at' || key === 'sync_source') return false;
        return updateData[key] !== dbRecord[key];
      });
      
      if (!hasChanges) {
        stats.skipped++;
        continue;
      }
      
      updates.push({
        id,
        sku: dbRecord.sku,
        product_name: dbRecord.product_name,
        changes: updateData,
        before: {
          physical_quantity: dbRecord.physical_quantity,
          cost_jpy: dbRecord.cost_jpy,
          storage_location: dbRecord.storage_location,
        },
      });
      
      // dryRunでなければ実際に更新
      if (!dryRun) {
        const { error: updateError } = await supabase
          .from('inventory_master')
          .update(updateData)
          .eq('id', id);
        
        if (updateError) {
          stats.errors++;
          errors.push({ id, error: updateError.message });
        } else {
          stats.updated++;
        }
      } else {
        stats.updated++; // dryRunでもカウント（予定数として）
      }
    }
    
    console.log(`[PullSync] Complete:`, stats);
    
    return NextResponse.json({
      success: true,
      dryRun,
      message: dryRun 
        ? `${stats.updated}件の更新が予定されています（プレビューモード）`
        : `${stats.updated}件を更新しました`,
      stats,
      updates: updates.slice(0, 100), // 最大100件まで
      conflicts,
      errors: errors.slice(0, 50),
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${targetSpreadsheetId}`,
    });
    
  } catch (error: any) {
    console.error('[PullSync] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// GET: Pull状況確認
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sheetName = searchParams.get('sheet') || 'マスター在庫';
    
    // Google Sheets API初期化
    let sheets: any;
    try {
      sheets = await initGoogleSheets();
    } catch (err: any) {
      return NextResponse.json({
        success: false,
        error: `Google Sheets API初期化エラー: ${err.message}`,
        configured: false,
        hint: 'GOOGLE_APPLICATION_CREDENTIALS または GOOGLE_SHEETS_CREDENTIALS が正しく設定されているか確認してください'
      });
    }
    
    // シートからデータを読み取る
    const sheetRows = await readSheetData(sheets, SPREADSHEET_ID, sheetName);
    
    // DBのカウント
    const { count: dbCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true });
    
    return NextResponse.json({
      success: true,
      sheetName,
      sheetRowCount: sheetRows.length,
      dbRowCount: dbCount || 0,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`,
      message: sheetRows.length > 0 
        ? `シート "${sheetName}" に ${sheetRows.length} 件のデータがあります`
        : `シート "${sheetName}" にデータがありません`,
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
