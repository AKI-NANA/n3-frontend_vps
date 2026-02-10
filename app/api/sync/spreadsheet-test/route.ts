// app/api/sync/spreadsheet-test/route.ts
/**
 * スプレッドシート同期テスト用API
 * 簡易版 - デバッグ用
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SPREADSHEET_ID = process.env.STOCKTAKE_SPREADSHEET_ID || '1lD9ESIhv2oTE6sgL172wOOF9fJAcIy0SHrdhkLNw3MM';

/**
 * GET: 接続テスト
 */
export async function GET() {
  try {
    // DB接続テスト
    const { count, error: dbError } = await supabase
      .from('products_master')
      .select('*', { count: 'exact', head: true });
    
    if (dbError) {
      return NextResponse.json({
        success: false,
        error: `DB接続エラー: ${dbError.message}`,
      });
    }
    
    // Google Sheets API接続テスト
    let sheetsConnected = false;
    let sheetsError = '';
    
    try {
      const { google } = await import('googleapis');
      
      // 認証方法1: ファイルパス（GOOGLE_APPLICATION_CREDENTIALS）
      // 認証方法2: JSON文字列（GOOGLE_SHEETS_CREDENTIALS）
      let auth;
      
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // ファイルパスから認証
        auth = new google.auth.GoogleAuth({
          keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
      } else if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
        // JSON文字列から認証
        const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
        auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
      } else {
        sheetsError = 'Google認証情報が設定されていません';
      }
      
      if (auth) {
        const sheets = google.sheets({ version: 'v4', auth });
        
        // スプレッドシートのメタデータを取得
        const response = await sheets.spreadsheets.get({
          spreadsheetId: SPREADSHEET_ID,
        });
        
        sheetsConnected = true;
      }
    } catch (e: any) {
      sheetsError = e.message;
    }
    
    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        table: 'products_master',
        count: count || 0,
      },
      googleSheets: {
        connected: sheetsConnected,
        spreadsheetId: SPREADSHEET_ID,
        error: sheetsError || null,
      },
      env: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasGoogleCredentials: !!process.env.GOOGLE_SHEETS_CREDENTIALS,
        hasSpreadsheetId: !!process.env.STOCKTAKE_SPREADSHEET_ID,
      },
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * POST: スプレッドシートに同期
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json().catch(() => ({}));
    const limit = body.limit || 500;
    
    console.log('[SpreadsheetTest] Starting sync, limit:', limit);
    
    // 1. DBからデータ取得
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
    
    console.log('[SpreadsheetTest] Fetched products:', products.length);
    
    // 2. カラム順序決定
    const priorityColumns = [
      'id', 'sku', 'title', 'title_en', 'price_jpy', 'price_usd',
      'profit_margin_percent', 'profit_amount_usd',
      'sm_sales_count', 'sm_lowest_price', 'sm_profit_margin',
      'status', 'workflow_status', 'listing_status',
      'physical_quantity', 'inventory_location',
      'category_name', 'condition', 'hts_code',
      'shipping_cost_usd', 'filter_passed', 'is_vero_brand',
      'listing_score', 'ebay_item_id', 'updated_at'
    ];
    
    const allColumns = Object.keys(products[0]);
    const orderedColumns: string[] = [];
    
    priorityColumns.forEach(col => {
      if (allColumns.includes(col)) orderedColumns.push(col);
    });
    allColumns.forEach(col => {
      if (!orderedColumns.includes(col)) orderedColumns.push(col);
    });
    
    // 3. データ整形
    const headerRow = orderedColumns;
    const dataRows = products.map(p => {
      return orderedColumns.map(col => {
        const v = p[col];
        if (v === null || v === undefined) return '';
        if (typeof v === 'object') return JSON.stringify(v).substring(0, 500);
        return String(v);
      });
    });
    
    // 4. Google Sheets API
    const { google } = await import('googleapis');
    
    let auth;
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
    } else {
      const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');
      auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
    }
    
    const sheets = google.sheets({ version: 'v4', auth });
    const sheetName = 'products_master';
    
    // シート存在確認＆作成
    try {
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });
      
      const sheetExists = spreadsheet.data.sheets?.some(
        s => s.properties?.title === sheetName
      );
      
      if (!sheetExists) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [{
              addSheet: { properties: { title: sheetName } }
            }]
          }
        });
      }
    } catch (e) {
      console.log('[SpreadsheetTest] Sheet check skipped');
    }
    
    // クリア＆書き込み
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:ZZ`,
    });
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [headerRow, ...dataRows],
      },
    });
    
    // スタイル設定
    try {
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
      const sheet = spreadsheet.data.sheets?.find(s => s.properties?.title === sheetName);
      const sheetId = sheet?.properties?.sheetId || 0;
      
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.133, green: 0.545, blue: 0.133 },
                    textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                  },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
              },
            },
            {
              updateSheetProperties: {
                properties: {
                  sheetId,
                  gridProperties: { frozenRowCount: 1, frozenColumnCount: 2 },
                },
                fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount',
              },
            },
          ],
        },
      });
    } catch (e) {
      console.log('[SpreadsheetTest] Style skipped');
    }
    
    const elapsed = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      syncedCount: dataRows.length,
      columnCount: orderedColumns.length,
      elapsedMs: elapsed,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`,
    });
    
  } catch (error: any) {
    console.error('[SpreadsheetTest] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
