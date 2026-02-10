// app/api/sync/inventory-sheets/route.ts
/**
 * 棚卸し同期システム v2.0
 * 
 * 機能:
 * 1. 同期診断 - DB vs シートの差分分析
 * 2. バックアップ - 同期前に自動バックアップ
 * 3. Push（UPSERT方式） - DBからシートへ差分更新
 * 4. Pull - シートからDBへ取り込み
 * 
 * @version 2.0.0
 * @date 2025-01-13
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { google, sheets_v4 } from 'googleapis';

// ============================================================
// 設定
// ============================================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SPREADSHEET_ID = process.env.STOCKTAKE_SPREADSHEET_ID || '1lD9ESIhv2oTE6sgL172wOOF9fJAcIy0SHrdhkLNw3MM';

// シート設定
const SHEET_CONFIG = {
  products: {
    name: '商品マスター',
    keyColumn: 'sku',  // 主キーとして使用
    headers: [
      'id', 'sku', 'product_name', 'english_title', 'ebay_account', 
      'status', 'cost_jpy', 'sale_price_usd', 'quantity',
      'storage_location', 'ebay_item_id', 'ebay_category_name',
      'workflow_status', 'primary_image_url', 'updated_at'
    ],
    editableColumns: ['cost_jpy', 'sale_price_usd', 'quantity', 'storage_location', 'workflow_status'],
  },
  inventory: {
    name: '在庫マスター',
    keyColumn: 'sku',
    headers: [
      'id', 'sku', 'product_name', 'inventory_type', 'physical_quantity',
      'available_quantity', 'cost_jpy', 'storage_location',
      'needs_count_check', 'stock_confirmed', 'stock_memo',
      'last_counted_at', 'updated_at'
    ],
    editableColumns: ['physical_quantity', 'available_quantity', 'cost_jpy', 'storage_location', 'needs_count_check', 'stock_confirmed', 'stock_memo'],
  },
};

// ============================================================
// 型定義
// ============================================================

interface DiagnosisResult {
  dbCount: number;
  sheetCount: number;
  matchedCount: number;
  dbOnlySkus: string[];
  sheetOnlySkus: string[];
  duplicateSkus: string[];
  deletedInDb: number;
}

interface SyncResult {
  success: boolean;
  action: string;
  rowsAffected: number;
  errors: string[];
  backupSheet?: string;
  details?: any;
}

// ============================================================
// Google Sheets API
// ============================================================

async function initGoogleSheets(): Promise<sheets_v4.Sheets> {
  const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

// ============================================================
// ヘルパー関数
// ============================================================

/**
 * シートからデータを読み込み（SKUをキーとした辞書形式）
 */
async function readSheetAsDict(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetName: string,
  keyColumn: string
): Promise<{ headers: string[]; data: Map<string, any[]>; rawData: any[][] }> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      return { headers: [], data: new Map(), rawData: [] };
    }

    const headers = rows[0].map((h: any) => String(h).trim());
    const keyIndex = headers.indexOf(keyColumn);
    
    if (keyIndex === -1) {
      console.warn(`[InventorySync] Key column '${keyColumn}' not found in headers`);
      return { headers, data: new Map(), rawData: rows };
    }

    const dataMap = new Map<string, any[]>();
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const key = String(row[keyIndex] || '').trim();
      if (key) {
        dataMap.set(key, row);
      }
    }

    return { headers, data: dataMap, rawData: rows };
  } catch (error: any) {
    console.error(`[InventorySync] Read sheet error:`, error.message);
    return { headers: [], data: new Map(), rawData: [] };
  }
}

/**
 * DBからデータを取得（SKUをキーとした辞書形式）
 */
async function fetchDbAsDict(
  tableName: string,
  keyColumn: string
): Promise<{ data: Map<string, any>; records: any[] }> {
  const { data: records, error } = await supabase
    .from(tableName)
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw new Error(`DB fetch error: ${error.message}`);

  const dataMap = new Map<string, any>();
  const duplicates: string[] = [];
  
  for (const record of records || []) {
    const key = String(record[keyColumn] || '').trim();
    if (key) {
      if (dataMap.has(key)) {
        duplicates.push(key);
      }
      dataMap.set(key, record);
    }
  }

  if (duplicates.length > 0) {
    console.warn(`[InventorySync] Duplicate SKUs in DB: ${duplicates.slice(0, 10).join(', ')}...`);
  }

  return { data: dataMap, records: records || [] };
}

/**
 * バックアップシートを作成
 */
async function createBackupSheet(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  sourceSheetName: string
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupName = `backup_${sourceSheetName}_${timestamp}`;

  try {
    // 元シートのデータを取得
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sourceSheetName}!A:Z`,
    });

    const data = response.data.values || [];

    // バックアップシートを作成
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          addSheet: { properties: { title: backupName } }
        }]
      }
    });

    // データをコピー
    if (data.length > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${backupName}!A1`,
        valueInputOption: 'RAW',
        requestBody: { values: data }
      });
    }

    console.log(`[InventorySync] Backup created: ${backupName}`);
    return backupName;
  } catch (error: any) {
    console.error(`[InventorySync] Backup error:`, error.message);
    throw error;
  }
}

/**
 * シートの存在確認・作成
 */
async function ensureSheetExists(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetName: string,
  headers: string[]
): Promise<void> {
  try {
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheet = spreadsheet.data.sheets?.find(
      (s: any) => s.properties?.title === sheetName
    );

    if (!existingSheet) {
      // シート作成
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{ addSheet: { properties: { title: sheetName } } }]
        }
      });

      // ヘッダー書き込み
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        requestBody: { values: [headers] }
      });

      console.log(`[InventorySync] Created sheet: ${sheetName}`);
    }
  } catch (error: any) {
    console.error(`[InventorySync] Ensure sheet error:`, error.message);
  }
}

// ============================================================
// 診断機能
// ============================================================

async function diagnose(
  target: 'products' | 'inventory'
): Promise<DiagnosisResult> {
  const config = SHEET_CONFIG[target];
  const tableName = target === 'products' ? 'products_master' : 'inventory_master';

  const sheets = await initGoogleSheets();

  // DBとシートのデータを取得
  const { data: dbData, records: dbRecords } = await fetchDbAsDict(tableName, config.keyColumn);
  const { data: sheetData } = await readSheetAsDict(sheets, SPREADSHEET_ID, config.name, config.keyColumn);

  // 集計
  const dbSkus = new Set(dbData.keys());
  const sheetSkus = new Set(sheetData.keys());

  const dbOnlySkus: string[] = [];
  const sheetOnlySkus: string[] = [];
  let matchedCount = 0;

  // DB にしかないSKU
  for (const sku of dbSkus) {
    if (sheetSkus.has(sku)) {
      matchedCount++;
    } else {
      dbOnlySkus.push(sku);
    }
  }

  // シートにしかないSKU
  for (const sku of sheetSkus) {
    if (!dbSkus.has(sku)) {
      sheetOnlySkus.push(sku);
    }
  }

  // 重複SKUを検出
  const skuCounts = new Map<string, number>();
  for (const record of dbRecords) {
    const sku = String(record[config.keyColumn] || '').trim();
    if (sku) {
      skuCounts.set(sku, (skuCounts.get(sku) || 0) + 1);
    }
  }
  const duplicateSkus = Array.from(skuCounts.entries())
    .filter(([_, count]) => count > 1)
    .map(([sku]) => sku);

  // 削除済み（is_deleted）のカウント
  let deletedInDb = 0;
  if (target === 'products') {
    const { count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', true);
    deletedInDb = count || 0;
  }

  return {
    dbCount: dbData.size,
    sheetCount: sheetData.size,
    matchedCount,
    dbOnlySkus,
    sheetOnlySkus,
    duplicateSkus,
    deletedInDb,
  };
}

// ============================================================
// Push（DB → Sheet）UPSERT方式
// ============================================================

async function pushToSheet(
  target: 'products' | 'inventory',
  createBackup: boolean = true
): Promise<SyncResult> {
  const config = SHEET_CONFIG[target];
  const tableName = target === 'products' ? 'products_master' : 'inventory_master';
  const errors: string[] = [];
  let backupSheet: string | undefined;

  try {
    const sheets = await initGoogleSheets();

    // シート存在確認
    await ensureSheetExists(sheets, SPREADSHEET_ID, config.name, config.headers);

    // バックアップ作成
    if (createBackup) {
      try {
        backupSheet = await createBackupSheet(sheets, SPREADSHEET_ID, config.name);
      } catch (e: any) {
        errors.push(`Backup warning: ${e.message}`);
      }
    }

    // DBとシートのデータを取得
    const { data: dbData, records: dbRecords } = await fetchDbAsDict(tableName, config.keyColumn);
    const { data: sheetData, headers: sheetHeaders } = await readSheetAsDict(
      sheets, SPREADSHEET_ID, config.name, config.keyColumn
    );

    // ヘッダーがなければ作成
    const headers = sheetHeaders.length > 0 ? sheetHeaders : config.headers;
    const keyIndex = headers.indexOf(config.keyColumn);

    // 更新対象行を特定
    const updates: Array<{ range: string; values: any[][] }> = [];
    const newRows: any[][] = [];
    let rowIndex = 2; // ヘッダーの次から

    // シート既存行の行番号を記録
    const sheetRowMap = new Map<string, number>();
    const existingResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!A:A`,
    });
    const existingSkus = existingResponse.data.values || [];
    for (let i = 1; i < existingSkus.length; i++) {
      const sku = String(existingSkus[i]?.[0] || '').trim();
      if (sku) {
        sheetRowMap.set(sku, i + 1); // 1-indexed
      }
    }

    // DBレコードをシートに反映
    for (const record of dbRecords) {
      const sku = String(record[config.keyColumn] || '').trim();
      if (!sku) continue;

      // 行データを作成
      const rowData = headers.map(h => {
        const value = record[h];
        if (value === null || value === undefined) return '';
        if (h === 'updated_at' || h === 'last_counted_at') {
          return value ? new Date(value).toLocaleString('ja-JP') : '';
        }
        if (typeof value === 'boolean') return value ? '✓' : '';
        return value;
      });

      const existingRow = sheetRowMap.get(sku);
      if (existingRow) {
        // 既存行を更新
        updates.push({
          range: `${config.name}!A${existingRow}`,
          values: [rowData]
        });
      } else {
        // 新規行として追加
        newRows.push(rowData);
      }
    }

    // バッチ更新
    if (updates.length > 0) {
      // 100件ずつバッチ処理
      for (let i = 0; i < updates.length; i += 100) {
        const batch = updates.slice(i, i + 100);
        await sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            valueInputOption: 'USER_ENTERED',
            data: batch,
          }
        });
      }
    }

    // 新規行を追加
    if (newRows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${config.name}!A:A`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: newRows }
      });
    }

    console.log(`[InventorySync] Push complete: ${updates.length} updated, ${newRows.length} added`);

    return {
      success: true,
      action: 'push',
      rowsAffected: updates.length + newRows.length,
      errors,
      backupSheet,
      details: {
        updated: updates.length,
        added: newRows.length,
      }
    };

  } catch (error: any) {
    console.error(`[InventorySync] Push error:`, error);
    return {
      success: false,
      action: 'push',
      rowsAffected: 0,
      errors: [...errors, error.message],
      backupSheet,
    };
  }
}

// ============================================================
// Pull（Sheet → DB）
// ============================================================

async function pullFromSheet(
  target: 'products' | 'inventory'
): Promise<SyncResult> {
  const config = SHEET_CONFIG[target];
  const tableName = target === 'products' ? 'products_master' : 'inventory_master';
  const errors: string[] = [];

  try {
    const sheets = await initGoogleSheets();

    // シートデータを取得
    const { headers, data: sheetData, rawData } = await readSheetAsDict(
      sheets, SPREADSHEET_ID, config.name, config.keyColumn
    );

    if (sheetData.size === 0) {
      return {
        success: true,
        action: 'pull',
        rowsAffected: 0,
        errors: ['Sheet is empty'],
      };
    }

    // DBのデータを取得
    const { data: dbData } = await fetchDbAsDict(tableName, config.keyColumn);

    let updatedCount = 0;

    // 編集可能カラムのみ更新
    const editableHeaders = headers.filter(h => config.editableColumns.includes(h));

    for (const [sku, sheetRow] of sheetData.entries()) {
      const dbRecord = dbData.get(sku);
      if (!dbRecord) {
        // DBに存在しないSKUは警告のみ
        errors.push(`SKU not found in DB: ${sku}`);
        continue;
      }

      // 変更を検出
      const updates: Record<string, any> = {};
      let hasChanges = false;

      for (const col of editableHeaders) {
        const colIndex = headers.indexOf(col);
        if (colIndex === -1) continue;

        let sheetValue = sheetRow[colIndex];
        const dbValue = dbRecord[col];

        // 値の変換
        if (sheetValue === '✓') sheetValue = true;
        else if (sheetValue === '' && typeof dbValue === 'boolean') sheetValue = false;
        else if (sheetValue === '') sheetValue = null;
        else if (!isNaN(Number(sheetValue)) && col.includes('quantity') || col.includes('price') || col.includes('cost')) {
          sheetValue = Number(sheetValue);
        }

        // 比較（数値の場合は誤差を考慮）
        const dbVal = dbValue ?? null;
        const sheetVal = sheetValue ?? null;

        if (typeof dbVal === 'number' && typeof sheetVal === 'number') {
          if (Math.abs(dbVal - sheetVal) > 0.01) {
            updates[col] = sheetVal;
            hasChanges = true;
          }
        } else if (String(dbVal) !== String(sheetVal)) {
          updates[col] = sheetVal;
          hasChanges = true;
        }
      }

      // 変更があればDBを更新
      if (hasChanges) {
        updates.updated_at = new Date().toISOString();
        
        const { error } = await supabase
          .from(tableName)
          .update(updates)
          .eq('id', dbRecord.id);

        if (error) {
          errors.push(`Update error for SKU ${sku}: ${error.message}`);
        } else {
          updatedCount++;
        }
      }
    }

    console.log(`[InventorySync] Pull complete: ${updatedCount} records updated`);

    return {
      success: true,
      action: 'pull',
      rowsAffected: updatedCount,
      errors,
      details: {
        totalInSheet: sheetData.size,
        updated: updatedCount,
        editableColumns: editableHeaders,
      }
    };

  } catch (error: any) {
    console.error(`[InventorySync] Pull error:`, error);
    return {
      success: false,
      action: 'pull',
      rowsAffected: 0,
      errors: [...errors, error.message],
    };
  }
}

// ============================================================
// API エンドポイント
// ============================================================

/**
 * GET: 同期状況・診断
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';
    const target = (searchParams.get('target') || 'products') as 'products' | 'inventory';

    if (action === 'diagnose') {
      const diagnosis = await diagnose(target);
      return NextResponse.json({
        success: true,
        action: 'diagnose',
        target,
        diagnosis,
        summary: {
          dbCount: diagnosis.dbCount,
          sheetCount: diagnosis.sheetCount,
          diff: diagnosis.dbCount - diagnosis.sheetCount,
          matched: diagnosis.matchedCount,
          dbOnly: diagnosis.dbOnlySkus.length,
          sheetOnly: diagnosis.sheetOnlySkus.length,
          duplicates: diagnosis.duplicateSkus.length,
          deleted: diagnosis.deletedInDb,
        }
      });
    }

    // デフォルト: ステータス
    const { count: productsCount } = await supabase
      .from('products_master')
      .select('*', { count: 'exact', head: true });

    const { count: inventoryCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      action: 'status',
      counts: {
        products: productsCount || 0,
        inventory: inventoryCount || 0,
      },
      spreadsheetId: SPREADSHEET_ID,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`,
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST: 同期実行（Push/Pull）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      action, 
      target = 'products',
      createBackup = true 
    } = body;

    if (!['push', 'pull', 'full_sync'].includes(action)) {
      return NextResponse.json(
        { success: false, error: `Invalid action: ${action}` },
        { status: 400 }
      );
    }

    let result: SyncResult;

    if (action === 'push' || action === 'full_sync') {
      result = await pushToSheet(target as 'products' | 'inventory', createBackup);
    } else {
      result = await pullFromSheet(target as 'products' | 'inventory');
    }

    return NextResponse.json({
      ...result,
      target,
      timestamp: new Date().toISOString(),
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`,
    });

  } catch (error: any) {
    console.error(`[InventorySync] API error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
