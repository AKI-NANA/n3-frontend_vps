// app/api/sync/stocktake-spreadsheet/route.ts
/**
 * 棚卸しデータ → Googleスプレッドシート同期API
 * 
 * 機能:
 * - inventory_master の棚卸しデータをスプレッドシートに同期
 * - 双方向リンク（シート ↔ ツール）
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// スプレッドシートID（環境変数で設定可能）
const SPREADSHEET_ID = process.env.STOCKTAKE_SPREADSHEET_ID || '';

// シート名
const SHEET_NAME = '棚卸し';

// カラムマッピング
const HEADER_ROW = [
  'SKU',
  '商品名',
  '数量',
  '保管場所',
  '画像URL',
  '最終更新',
  '登録者',
  'ツールリンク',
];

/**
 * POST: 棚卸しデータをスプレッドシートに同期
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, spreadsheetId } = body;
    
    const targetSpreadsheetId = spreadsheetId || SPREADSHEET_ID;
    
    if (!targetSpreadsheetId) {
      return NextResponse.json(
        { success: false, error: 'スプレッドシートIDが設定されていません。環境変数 STOCKTAKE_SPREADSHEET_ID を設定してください。' },
        { status: 400 }
      );
    }
    
    // 棚卸しデータ取得
    const { data: products, error: fetchError } = await supabase
      .from('inventory_master')
      .select('id, sku, product_name, physical_quantity, storage_location, images, source_data, updated_at')
      .eq('inventory_type', 'stock')
      .order('updated_at', { ascending: false })
      .limit(1000);
    
    if (fetchError) {
      throw new Error(fetchError.message);
    }
    
    // Google Sheets API（動的インポート）
    let sheets: any;
    try {
      const { google } = await import('googleapis');
      const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');
      
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      
      sheets = google.sheets({ version: 'v4', auth });
    } catch (importError: any) {
      console.error('[StocktakeSync] googleapis import error:', importError);
      return NextResponse.json(
        { success: false, error: 'Google Sheets API の初期化に失敗しました。GOOGLE_SHEETS_CREDENTIALS を確認してください。' },
        { status: 500 }
      );
    }
    
    // データを行形式に変換
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const rows = products?.map(p => [
      p.sku || '',
      p.product_name || '',
      p.physical_quantity || 0,
      p.storage_location || '',
      p.images?.[0] || '',
      new Date(p.updated_at).toLocaleString('ja-JP'),
      p.source_data?.created_by || '',
      `=HYPERLINK("${appUrl}/stocktake", "開く")`,
    ]) || [];
    
    // ヘッダー + データ
    const allRows = [HEADER_ROW, ...rows];
    
    // シートをクリア＆更新
    await sheets.spreadsheets.values.clear({
      spreadsheetId: targetSpreadsheetId,
      range: `${SHEET_NAME}!A:H`,
    });
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: targetSpreadsheetId,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: allRows,
      },
    });
    
    // ヘッダー行をフォーマット（オプション）
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: targetSpreadsheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0,
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
          ],
        },
      });
    } catch (formatError) {
      console.warn('[StocktakeSync] Header format skipped:', formatError);
    }
    
    console.log(`[StocktakeSync] Synced ${rows.length} items to spreadsheet`);
    
    return NextResponse.json({
      success: true,
      syncedCount: rows.length,
      spreadsheetId: targetSpreadsheetId,
      sheetName: SHEET_NAME,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${targetSpreadsheetId}`,
    });
    
  } catch (error: any) {
    console.error('[StocktakeSync] Error:', error);
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
    // 棚卸しデータ件数
    const { count, error } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .eq('inventory_type', 'stock');
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      totalCount: count || 0,
      spreadsheetConfigured: !!SPREADSHEET_ID,
      spreadsheetId: SPREADSHEET_ID || null,
      spreadsheetUrl: SPREADSHEET_ID ? `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}` : null,
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
