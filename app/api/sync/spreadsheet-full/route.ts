// app/api/sync/spreadsheet-full/route.ts
/**
 * スプレッドシート ↔ products_master 双方向同期API
 * 
 * 機能:
 * - POST: products_master → スプレッドシート（全カラム）
 * - PUT: スプレッドシート → products_master（変更分のみ）
 * - GET: 同期状況確認
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// スプレッドシート設定
const SPREADSHEET_ID = process.env.STOCKTAKE_SPREADSHEET_ID || '1lD9ESIhv2oTE6sgL172wOOF9fJAcIy0SHrdhkLNw3MM';
const SHEET_NAME = 'products_master';

// 優先カラム（最初に表示）
const PRIORITY_COLUMNS = [
  'id', 'sku', 'title', 'title_en', 'price_jpy', 'price_usd',
  'profit_margin_percent', 'profit_amount_usd',
  'sm_sales_count', 'sm_lowest_price', 'sm_profit_margin',
  'status', 'workflow_status', 'listing_status',
  'physical_quantity', 'inventory_location',
  'category_name', 'condition',
  'hts_code', 'shipping_cost_usd',
  'filter_passed', 'is_vero_brand',
  'listing_score', 'total_score',
  'ebay_item_id', 'primary_image_url',
  'created_at', 'updated_at'
];

// 編集可能カラム（スプレッドシート→DB同期時）
const EDITABLE_COLUMNS = [
  'title', 'title_en', 'description', 'description_en',
  'price_jpy', 'price_usd', 
  'status', 'workflow_status', 'listing_status',
  'physical_quantity', 'inventory_location',
  'category_name', 'condition', 'hts_code',
  'shipping_cost_usd', 'filter_passed'
];

// Google Sheets認証
async function getGoogleSheets() {
  const { google } = await import('googleapis');
  const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  return google.sheets({ version: 'v4', auth });
}

/**
 * POST: products_master → スプレッドシート
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode = 'full', limit = 1000 } = body;
    
    console.log('[SpreadsheetSync] Starting sync to spreadsheet, mode:', mode);
    
    // 1. products_masterからデータ取得
    const { data: products, error: fetchError } = await supabase
      .from('products_master')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    if (fetchError) {
      throw new Error(`DB取得エラー: ${fetchError.message}`);
    }
    
    if (!products || products.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'データがありません',
        syncedCount: 0,
      });
    }
    
    console.log('[SpreadsheetSync] Fetched products:', products.length);
    
    // 2. カラム順序を決定
    const allColumns = Object.keys(products[0]);
    const orderedColumns: string[] = [];
    
    // 優先カラムを先に追加
    PRIORITY_COLUMNS.forEach(col => {
      if (allColumns.includes(col)) {
        orderedColumns.push(col);
      }
    });
    
    // 残りのカラムを追加
    allColumns.forEach(col => {
      if (!orderedColumns.includes(col)) {
        orderedColumns.push(col);
      }
    });
    
    // 3. データを行形式に変換
    const headerRow = orderedColumns;
    const dataRows = products.map(product => {
      return orderedColumns.map(col => {
        const value = product[col];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') {
          return JSON.stringify(value).substring(0, 500);
        }
        return String(value);
      });
    });
    
    const allRows = [headerRow, ...dataRows];
    
    // 4. Google Sheets APIでスプレッドシートに書き込み
    const sheets = await getGoogleSheets();
    
    // シートが存在するか確認、なければ作成
    try {
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });
      
      const sheetExists = spreadsheet.data.sheets?.some(
        s => s.properties?.title === SHEET_NAME
      );
      
      if (!sheetExists) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [{
              addSheet: {
                properties: { title: SHEET_NAME }
              }
            }]
          }
        });
        console.log('[SpreadsheetSync] Created new sheet:', SHEET_NAME);
      }
    } catch (e) {
      console.log('[SpreadsheetSync] Sheet check error, proceeding:', e);
    }
    
    // シートをクリア
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:ZZ`,
    });
    
    // データを書き込み
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: allRows,
      },
    });
    
    // ヘッダー行のスタイル設定
    try {
      // シートIDを取得
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });
      const sheet = spreadsheet.data.sheets?.find(s => s.properties?.title === SHEET_NAME);
      const sheetId = sheet?.properties?.sheetId || 0;
      
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            // ヘッダー行の背景色
            {
              repeatCell: {
                range: {
                  sheetId: sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.133, green: 0.545, blue: 0.133 },
                    textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                  },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
              },
            },
            // 1行目と1-2列を固定
            {
              updateSheetProperties: {
                properties: {
                  sheetId: sheetId,
                  gridProperties: {
                    frozenRowCount: 1,
                    frozenColumnCount: 2,
                  },
                },
                fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount',
              },
            },
          ],
        },
      });
    } catch (styleError) {
      console.warn('[SpreadsheetSync] Style setting skipped:', styleError);
    }
    
    console.log('[SpreadsheetSync] Sync completed:', dataRows.length, 'rows,', orderedColumns.length, 'columns');
    
    return NextResponse.json({
      success: true,
      syncedCount: dataRows.length,
      columnCount: orderedColumns.length,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`,
      sheetName: SHEET_NAME,
    });
    
  } catch (error: any) {
    console.error('[SpreadsheetSync] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT: スプレッドシート → products_master
 */
export async function PUT(request: NextRequest) {
  try {
    console.log('[SpreadsheetSync] Starting sync from spreadsheet to DB');
    
    // 1. スプレッドシートからデータ取得
    const sheets = await getGoogleSheets();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:ZZ`,
    });
    
    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return NextResponse.json({
        success: true,
        message: 'スプレッドシートにデータがありません',
        updatedCount: 0,
      });
    }
    
    const headers = rows[0] as string[];
    const dataRows = rows.slice(1);
    
    console.log('[SpreadsheetSync] Read from spreadsheet:', dataRows.length, 'rows');
    
    // 2. IDカラムのインデックスを取得
    const idIndex = headers.indexOf('id');
    if (idIndex === -1) {
      throw new Error('ID列が見つかりません');
    }
    
    // 3. 各行をDBに更新
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    
    for (const row of dataRows) {
      const id = row[idIndex];
      if (!id) continue;
      
      // 更新データを構築
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      
      headers.forEach((header, index) => {
        if (EDITABLE_COLUMNS.includes(header) && row[index] !== undefined && row[index] !== '') {
          let value: any = row[index];
          
          // 型変換
          if (['price_jpy', 'price_usd', 'physical_quantity', 'shipping_cost_usd', 'profit_margin_percent'].includes(header)) {
            value = parseFloat(value) || 0;
          }
          if (header === 'filter_passed') {
            value = value === 'true' || value === 'TRUE' || value === true;
          }
          
          updateData[header] = value;
        }
      });
      
      // 更新するデータがあれば実行
      if (Object.keys(updateData).length > 1) {
        const { error } = await supabase
          .from('products_master')
          .update(updateData)
          .eq('id', id);
        
        if (error) {
          errorCount++;
          errors.push(`ID ${id}: ${error.message}`);
        } else {
          successCount++;
        }
      }
    }
    
    console.log('[SpreadsheetSync] DB update completed:', successCount, 'success,', errorCount, 'errors');
    
    return NextResponse.json({
      success: true,
      updatedCount: successCount,
      errorCount,
      errors: errors.slice(0, 10), // 最初の10件のエラーのみ
    });
    
  } catch (error: any) {
    console.error('[SpreadsheetSync] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET: 同期状況確認
 */
export async function GET() {
  try {
    // products_masterの件数
    const { count: dbCount, error: countError } = await supabase
      .from('products_master')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    // スプレッドシートの件数
    let sheetCount = 0;
    try {
      const sheets = await getGoogleSheets();
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:A`,
      });
      sheetCount = (response.data.values?.length || 1) - 1; // ヘッダー行を除く
    } catch (e) {
      console.log('[SpreadsheetSync] Sheet count error:', e);
    }
    
    return NextResponse.json({
      success: true,
      database: {
        table: 'products_master',
        count: dbCount || 0,
      },
      spreadsheet: {
        id: SPREADSHEET_ID,
        sheetName: SHEET_NAME,
        count: sheetCount,
        url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`,
      },
      editableColumns: EDITABLE_COLUMNS,
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
