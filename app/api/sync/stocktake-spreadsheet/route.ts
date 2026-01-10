// app/api/sync/stocktake-spreadsheet/route.ts
/**
 * 棚卸しデータ ↔ Googleスプレッドシート同期API
 * 
 * 対象シート:
 * - 棚卸し: 有在庫のみ（inventory_type = 'stock'）
 * - マスター: inventory_master全件
 * - 全商品: products_master全件
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SPREADSHEET_ID = process.env.STOCKTAKE_SPREADSHEET_ID || '1lD9ESIhv2oTE6sgL172wOOF9fJAcIy0SHrdhkLNw3MM';
const CHUNK_SIZE = 1000;
const MAX_ITEMS = 50000;

// シート設定
const SHEETS = {
  stocktake: {
    name: '棚卸し',
    headers: ['SKU', '商品名', '数量', '保管場所', '要確認', '確定', 'メモ', '最終更新', 'リンク'],
  },
  master: {
    name: 'マスター',
    headers: ['ID', 'SKU', '商品名', '在庫タイプ', '数量', '原価', '保管場所', 'L1', 'L2', 'L3', '要確認', '確定', '更新日時'],
  },
  products: {
    name: '全商品',
    headers: ['ID', 'SKU', '商品名', 'eBayアカウント', 'ステータス', '販売価格', 'eBay ItemID', 'カテゴリー', '更新日時'],
  },
};

/**
 * Google Sheets API初期化
 */
async function initGoogleSheets() {
  const { google } = await import('googleapis');
  const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  return google.sheets({ version: 'v4', auth });
}

/**
 * シート存在確認・作成
 */
async function ensureSheetExists(sheets: any, spreadsheetId: string, sheetName: string) {
  try {
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheet = spreadsheet.data.sheets?.find(
      (s: any) => s.properties?.title === sheetName
    );
    
    if (!existingSheet) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: { properties: { title: sheetName } }
          }]
        }
      });
      console.log(`[SpreadsheetSync] Created sheet: ${sheetName}`);
    }
    
    return true;
  } catch (err: any) {
    console.error(`[SpreadsheetSync] Sheet check error for ${sheetName}:`, err.message);
    return false;
  }
}

/**
 * シート更新
 */
async function updateSheet(sheets: any, spreadsheetId: string, sheetName: string, headers: string[], rows: any[][]) {
  try {
    await ensureSheetExists(sheets, spreadsheetId, sheetName);
    
    // クリア
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    });
    
    // 書き込み
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [headers, ...rows],
      },
    });
    
    console.log(`[SpreadsheetSync] Updated ${sheetName}: ${rows.length} rows`);
    return rows.length;
  } catch (err: any) {
    console.error(`[SpreadsheetSync] Update error for ${sheetName}:`, err.message);
    throw err;
  }
}

/**
 * 棚卸しシート用データ取得
 */
async function fetchStocktakeData() {
  const allProducts: any[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore && offset < MAX_ITEMS) {
    const { data, error } = await supabase
      .from('inventory_master')
      .select('id, sku, product_name, physical_quantity, storage_location, needs_count_check, stock_confirmed, stock_memo, updated_at')
      .eq('inventory_type', 'stock')
      .order('updated_at', { ascending: false })
      .range(offset, offset + CHUNK_SIZE - 1);

    if (error) throw new Error(`Fetch error: ${error.message}`);

    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      allProducts.push(...data);
      offset += CHUNK_SIZE;
      hasMore = data.length === CHUNK_SIZE;
    }
  }

  return allProducts;
}

/**
 * マスターシート用データ取得
 */
async function fetchMasterData() {
  const allProducts: any[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore && offset < MAX_ITEMS) {
    const { data, error } = await supabase
      .from('inventory_master')
      .select('id, sku, product_name, inventory_type, physical_quantity, cost_jpy, storage_location, attr_l1, attr_l2, attr_l3, needs_count_check, stock_confirmed, updated_at')
      .order('updated_at', { ascending: false })
      .range(offset, offset + CHUNK_SIZE - 1);

    if (error) throw new Error(`Fetch error: ${error.message}`);

    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      allProducts.push(...data);
      offset += CHUNK_SIZE;
      hasMore = data.length === CHUNK_SIZE;
    }
  }

  return allProducts;
}

/**
 * 全商品シート用データ取得
 */
async function fetchProductsData() {
  const allProducts: any[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore && offset < MAX_ITEMS) {
    const { data, error } = await supabase
      .from('products_master')
      .select('id, sku, product_name, ebay_account, status, sale_price_usd, ebay_item_id, ebay_category_name, updated_at')
      .order('updated_at', { ascending: false })
      .range(offset, offset + CHUNK_SIZE - 1);

    if (error) throw new Error(`Fetch error: ${error.message}`);

    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      allProducts.push(...data);
      offset += CHUNK_SIZE;
      hasMore = data.length === CHUNK_SIZE;
    }
  }

  return allProducts;
}

/**
 * POST: 同期実行
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spreadsheetId, targets = ['stocktake', 'master', 'products'] } = body;
    
    const targetSpreadsheetId = spreadsheetId || SPREADSHEET_ID;
    
    if (!targetSpreadsheetId) {
      return NextResponse.json(
        { success: false, error: 'スプレッドシートIDが未設定です' },
        { status: 400 }
      );
    }
    
    // Google Sheets API初期化
    let sheets: any;
    try {
      sheets = await initGoogleSheets();
    } catch (err: any) {
      console.error('[SpreadsheetSync] Google Sheets init error:', err);
      return NextResponse.json(
        { success: false, error: 'Google Sheets API初期化エラー' },
        { status: 500 }
      );
    }
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const results: Record<string, number> = {};
    
    // 棚卸しシート
    if (targets.includes('stocktake')) {
      console.log('[SpreadsheetSync] Syncing 棚卸し...');
      const stocktakeData = await fetchStocktakeData();
      const stocktakeRows = stocktakeData.map(p => [
        p.sku || '',
        p.product_name || '',
        p.physical_quantity || 0,
        p.storage_location || 'env',
        p.needs_count_check ? '✓' : '',
        p.stock_confirmed ? '✓' : '',
        p.stock_memo || '',
        p.updated_at ? new Date(p.updated_at).toLocaleString('ja-JP') : '',
        `=HYPERLINK("${appUrl}/stocktake", "開く")`,
      ]);
      results.stocktake = await updateSheet(sheets, targetSpreadsheetId, SHEETS.stocktake.name, SHEETS.stocktake.headers, stocktakeRows);
    }
    
    // マスターシート
    if (targets.includes('master')) {
      console.log('[SpreadsheetSync] Syncing マスター...');
      const masterData = await fetchMasterData();
      const masterRows = masterData.map(p => [
        p.id || '',
        p.sku || '',
        p.product_name || '',
        p.inventory_type || '',
        p.physical_quantity || 0,
        p.cost_jpy || 0,
        p.storage_location || '',
        p.attr_l1 || '',
        p.attr_l2 || '',
        p.attr_l3 || '',
        p.needs_count_check ? '✓' : '',
        p.stock_confirmed ? '✓' : '',
        p.updated_at ? new Date(p.updated_at).toLocaleString('ja-JP') : '',
      ]);
      results.master = await updateSheet(sheets, targetSpreadsheetId, SHEETS.master.name, SHEETS.master.headers, masterRows);
    }
    
    // 全商品シート
    if (targets.includes('products')) {
      console.log('[SpreadsheetSync] Syncing 全商品...');
      const productsData = await fetchProductsData();
      const productsRows = productsData.map(p => [
        p.id || '',
        p.sku || '',
        p.product_name || '',
        p.ebay_account || '',
        p.status || '',
        p.sale_price_usd || 0,
        p.ebay_item_id || '',
        p.ebay_category_name || '',
        p.updated_at ? new Date(p.updated_at).toLocaleString('ja-JP') : '',
      ]);
      results.products = await updateSheet(sheets, targetSpreadsheetId, SHEETS.products.name, SHEETS.products.headers, productsRows);
    }
    
    // フォーマット適用（棚卸しシート）
    if (targets.includes('stocktake')) {
      try {
        const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: targetSpreadsheetId });
        const stocktakeSheet = spreadsheet.data.sheets?.find(
          (s: any) => s.properties?.title === SHEETS.stocktake.name
        );
        
        if (stocktakeSheet?.properties?.sheetId !== undefined) {
          const sheetId = stocktakeSheet.properties.sheetId;
          
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId: targetSpreadsheetId,
            requestBody: {
              requests: [
                // ヘッダー行
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
              ],
            },
          });
        }
      } catch (formatErr) {
        console.warn('[SpreadsheetSync] Format error (ignored):', formatErr);
      }
    }
    
    console.log('[SpreadsheetSync] Complete:', results);
    
    return NextResponse.json({
      success: true,
      syncedCount: Object.values(results).reduce((a, b) => a + b, 0),
      results,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${targetSpreadsheetId}`,
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
    const { count: stocktakeCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .eq('inventory_type', 'stock');
    
    const { count: masterCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true });
    
    const { count: productsCount } = await supabase
      .from('products_master')
      .select('*', { count: 'exact', head: true });
    
    return NextResponse.json({
      success: true,
      counts: {
        stocktake: stocktakeCount || 0,
        master: masterCount || 0,
        products: productsCount || 0,
      },
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
