// app/api/sync/stocktake-spreadsheet/route.ts
/**
 * 棚卸しデータ ↔ Googleスプレッドシート同期API v2
 * 
 * 【新設計】在庫管理の厳格化
 * 
 * シート構成:
 * - マスター在庫: 物理的な「真実」の在庫のみ
 *   条件: inventory_type='stock' AND product_type!='set' AND is_variation_parent=false
 * 
 * - 全出品データ: ツール内の全データ（旧・棚卸し）
 *   条件: フィルターなし（全件）
 * 
 * - セット・バリエーション: セット品と親子関係の確認用
 *   条件: product_type='set' OR is_variation_parent=true
 * 
 * @version 2.0.0
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
const CHUNK_SIZE = 1000;
const MAX_ITEMS = 50000;

// ============================================================
// シート設定（新設計）
// ============================================================
const SHEETS = {
  // マスター在庫: 物理的な真実の在庫のみ（セット・バリエーション親を除外）
  physicalStock: {
    name: 'マスター在庫',
    headers: ['ID', 'SKU', '商品名', '数量', '原価', '保管場所', 'L1', 'L2', 'L3', '要確認', '確定', 'メモ', '更新日時'],
    description: '物理的に存在する単体商品のみ（セット品・バリエーション親を除外）',
  },
  
  // 全出品データ: ツール内の全データ（編集可能なフラグ列を含む）
  allData: {
    name: '全出品データ',
    headers: ['ID', 'SKU', '商品名', '在庫タイプ', '商品タイプ', 'セット品', 'PSA/グレード', 'バリ親', 'バリ子', '数量', '原価', '保管場所', '更新日時'],
    description: 'inventory_masterの全データ（セット品・PSA10フラグは1を入力で反映可能）',
  },
  
  // セット・バリエーション: 組み合わせ商品の管理
  setVariation: {
    name: 'セット・バリエーション',
    headers: ['ID', 'SKU', '商品名', 'タイプ', '親ID', '構成商品', '数量', '更新日時'],
    description: 'セット品とバリエーション親の確認用',
  },
  
  // 旧シート（互換性のため残す）
  stocktake: {
    name: '棚卸し',
    headers: ['SKU', '商品名', '数量', '保管場所', '要確認', '確定', 'メモ', '最終更新', 'リンク'],
    deprecated: true,
  },
  master: {
    name: 'マスター',
    headers: ['ID', 'SKU', '商品名', '在庫タイプ', '数量', '原価', '保管場所', 'L1', 'L2', 'L3', '要確認', '確定', '更新日時'],
    deprecated: true,
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
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  return google.sheets({ version: 'v4', auth });
}

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

// ============================================================
// データ取得関数（新設計）
// ============================================================

/**
 * マスター在庫: 物理的な真実の在庫のみ
 * 条件:
 * - inventory_type = 'stock' (有在庫)
 * - product_type != 'set' (セット品を除外)
 * - is_variation_parent = false (バリエーション親を除外)
 */
async function fetchPhysicalStockData() {
  const allProducts: any[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore && offset < MAX_ITEMS) {
    const { data, error } = await supabase
      .from('inventory_master')
      .select(`
        id, sku, product_name, physical_quantity, cost_jpy, 
        storage_location, attr_l1, attr_l2, attr_l3, 
        needs_count_check, stock_confirmed, stock_memo, updated_at,
        product_type, is_variation_parent
      `)
      .eq('inventory_type', 'stock')
      .or('product_type.is.null,product_type.neq.set')
      .or('is_variation_parent.is.null,is_variation_parent.eq.false')
      .order('updated_at', { ascending: false })
      .range(offset, offset + CHUNK_SIZE - 1);

    if (error) throw new Error(`Fetch physical stock error: ${error.message}`);

    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      // 追加フィルタリング（DBフィルタで漏れた場合のセーフティ）
      const filtered = data.filter(item => {
        const isSet = item.product_type === 'set';
        const isVarParent = item.is_variation_parent === true;
        return !isSet && !isVarParent;
      });
      allProducts.push(...filtered);
      offset += CHUNK_SIZE;
      hasMore = data.length === CHUNK_SIZE;
    }
  }

  console.log(`[SpreadsheetSync] Physical stock: ${allProducts.length} items`);
  return allProducts;
}

/**
 * 全出品データ: フィルターなし（全件）
 */
async function fetchAllData() {
  const allProducts: any[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore && offset < MAX_ITEMS) {
    const { data, error } = await supabase
      .from('inventory_master')
      .select(`
        id, sku, product_name, inventory_type, product_type, grade,
        is_variation_parent, is_variation_member, is_variation_child,
        physical_quantity, cost_jpy, storage_location, updated_at
      `)
      .order('updated_at', { ascending: false })
      .range(offset, offset + CHUNK_SIZE - 1);

    if (error) throw new Error(`Fetch all data error: ${error.message}`);

    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      allProducts.push(...data);
      offset += CHUNK_SIZE;
      hasMore = data.length === CHUNK_SIZE;
    }
  }

  console.log(`[SpreadsheetSync] All data: ${allProducts.length} items`);
  return allProducts;
}

/**
 * セット・バリエーション: 組み合わせ商品のみ
 * 条件: product_type='set' OR is_variation_parent=true
 */
async function fetchSetVariationData() {
  const allProducts: any[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore && offset < MAX_ITEMS) {
    const { data, error } = await supabase
      .from('inventory_master')
      .select(`
        id, sku, product_name, product_type, 
        is_variation_parent, variation_parent_id, set_components,
        physical_quantity, updated_at
      `)
      .or('product_type.eq.set,is_variation_parent.eq.true')
      .order('updated_at', { ascending: false })
      .range(offset, offset + CHUNK_SIZE - 1);

    if (error) throw new Error(`Fetch set/variation error: ${error.message}`);

    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      allProducts.push(...data);
      offset += CHUNK_SIZE;
      hasMore = data.length === CHUNK_SIZE;
    }
  }

  console.log(`[SpreadsheetSync] Set/Variation: ${allProducts.length} items`);
  return allProducts;
}

// 旧互換: 棚卸し（有在庫のみ）
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

// 旧互換: マスター（全件）
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

// ============================================================
// POST: 同期実行
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      spreadsheetId, 
      targets = ['physicalStock', 'allData', 'setVariation'],
      includeLegacy = false  // 旧シートも更新するか
    } = body;
    
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
    
    const results: Record<string, number> = {};
    const stats: Record<string, any> = {};
    
    // ============================================================
    // 新シート: マスター在庫（物理在庫のみ）
    // ============================================================
    if (targets.includes('physicalStock')) {
      console.log('[SpreadsheetSync] Syncing マスター在庫...');
      const data = await fetchPhysicalStockData();
      const rows = data.map(p => [
        p.id || '',
        p.sku || '',
        p.product_name || '',
        p.physical_quantity || 0,
        p.cost_jpy || 0,
        p.storage_location || '',
        p.attr_l1 || '',
        p.attr_l2 || '',
        p.attr_l3 || '',
        p.needs_count_check ? '✓' : '',
        p.stock_confirmed ? '✓' : '',
        p.stock_memo || '',
        p.updated_at ? new Date(p.updated_at).toLocaleString('ja-JP') : '',
      ]);
      results.physicalStock = await updateSheet(
        sheets, targetSpreadsheetId, 
        SHEETS.physicalStock.name, SHEETS.physicalStock.headers, rows
      );
      stats.physicalStock = {
        count: data.length,
        description: SHEETS.physicalStock.description,
      };
    }
    
    // ============================================================
    // 新シート: 全出品データ
    // セット品フラグとPSA/グレード列を含む（シートで編集可能）
    // ============================================================
    if (targets.includes('allData')) {
      console.log('[SpreadsheetSync] Syncing 全出品データ...');
      const data = await fetchAllData();
      // ヘッダー: ID, SKU, 商品名, 在庫タイプ, 商品タイプ, セット品, PSA/グレード, バリ親, バリ子, 数量, 原価, 保管場所, 更新日時
      const rows = data.map(p => [
        p.id || '',
        p.sku || '',
        p.product_name || '',
        p.inventory_type || '',
        p.product_type || 'unit',
        p.product_type === 'set' ? '1' : '',  // セット品フラグ（編集可能）
        p.grade || '',                        // PSA/グレード（編集可能）
        p.is_variation_parent ? '✓' : '',
        (p.is_variation_member || p.is_variation_child) ? '✓' : '',
        p.physical_quantity || 0,
        p.cost_jpy || 0,
        p.storage_location || '',
        p.updated_at ? new Date(p.updated_at).toLocaleString('ja-JP') : '',
      ]);
      results.allData = await updateSheet(
        sheets, targetSpreadsheetId, 
        SHEETS.allData.name, SHEETS.allData.headers, rows
      );
      stats.allData = {
        count: data.length,
        description: SHEETS.allData.description,
        breakdown: {
          stock: data.filter(d => d.inventory_type === 'stock').length,
          mu: data.filter(d => d.inventory_type === 'mu').length,
          sets: data.filter(d => d.product_type === 'set').length,
          variationParents: data.filter(d => d.is_variation_parent).length,
          variationChildren: data.filter(d => d.is_variation_member || d.is_variation_child).length,
        },
      };
    }
    
    // ============================================================
    // 新シート: セット・バリエーション
    // ============================================================
    if (targets.includes('setVariation')) {
      console.log('[SpreadsheetSync] Syncing セット・バリエーション...');
      const data = await fetchSetVariationData();
      const rows = data.map(p => {
        let type = '';
        if (p.product_type === 'set') type = 'セット';
        else if (p.is_variation_parent) type = 'バリエーション親';
        
        let components = '';
        if (p.set_components) {
          try {
            const comps = typeof p.set_components === 'string' 
              ? JSON.parse(p.set_components) 
              : p.set_components;
            if (Array.isArray(comps)) {
              components = comps.map((c: any) => c.sku || c).join(', ');
            }
          } catch { /* ignore */ }
        }
        
        return [
          p.id || '',
          p.sku || '',
          p.product_name || '',
          type,
          p.variation_parent_id || '',
          components,
          p.physical_quantity || 0,
          p.updated_at ? new Date(p.updated_at).toLocaleString('ja-JP') : '',
        ];
      });
      results.setVariation = await updateSheet(
        sheets, targetSpreadsheetId, 
        SHEETS.setVariation.name, SHEETS.setVariation.headers, rows
      );
      stats.setVariation = {
        count: data.length,
        description: SHEETS.setVariation.description,
      };
    }
    
    // ============================================================
    // 旧シート（互換性）
    // ============================================================
    if (includeLegacy) {
      // 旧・棚卸し
      if (targets.includes('stocktake')) {
        console.log('[SpreadsheetSync] Syncing 棚卸し (legacy)...');
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
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
        results.stocktake = await updateSheet(
          sheets, targetSpreadsheetId, 
          SHEETS.stocktake.name, SHEETS.stocktake.headers, stocktakeRows
        );
      }
      
      // 旧・マスター
      if (targets.includes('master')) {
        console.log('[SpreadsheetSync] Syncing マスター (legacy)...');
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
        results.master = await updateSheet(
          sheets, targetSpreadsheetId, 
          SHEETS.master.name, SHEETS.master.headers, masterRows
        );
      }
    }
    
    // ============================================================
    // フォーマット適用
    // ============================================================
    try {
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: targetSpreadsheetId });
      const requests: any[] = [];
      
      // マスター在庫シートのフォーマット
      const physicalStockSheet = spreadsheet.data.sheets?.find(
        (s: any) => s.properties?.title === SHEETS.physicalStock.name
      );
      if (physicalStockSheet?.properties?.sheetId !== undefined) {
        requests.push({
          repeatCell: {
            range: { sheetId: physicalStockSheet.properties.sheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.133, green: 0.545, blue: 0.133 }, // 緑
                textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)',
          },
        });
      }
      
      // 全出品データシートのフォーマット
      const allDataSheet = spreadsheet.data.sheets?.find(
        (s: any) => s.properties?.title === SHEETS.allData.name
      );
      if (allDataSheet?.properties?.sheetId !== undefined) {
        requests.push({
          repeatCell: {
            range: { sheetId: allDataSheet.properties.sheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.2, green: 0.4, blue: 0.8 }, // 青
                textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)',
          },
        });
      }
      
      // セット・バリエーションシートのフォーマット
      const setVarSheet = spreadsheet.data.sheets?.find(
        (s: any) => s.properties?.title === SHEETS.setVariation.name
      );
      if (setVarSheet?.properties?.sheetId !== undefined) {
        requests.push({
          repeatCell: {
            range: { sheetId: setVarSheet.properties.sheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.8, green: 0.5, blue: 0.2 }, // オレンジ
                textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)',
          },
        });
      }
      
      if (requests.length > 0) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: targetSpreadsheetId,
          requestBody: { requests },
        });
      }
    } catch (formatErr) {
      console.warn('[SpreadsheetSync] Format error (ignored):', formatErr);
    }
    
    console.log('[SpreadsheetSync] Complete:', results);
    
    return NextResponse.json({
      success: true,
      syncedCount: Object.values(results).reduce((a, b) => a + b, 0),
      results,
      stats,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${targetSpreadsheetId}`,
      sheets: {
        physicalStock: SHEETS.physicalStock.name,
        allData: SHEETS.allData.name,
        setVariation: SHEETS.setVariation.name,
      },
    });
    
  } catch (error: any) {
    console.error('[SpreadsheetSync] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// GET: 同期状況確認（拡張版）
// ============================================================
export async function GET() {
  try {
    // 物理在庫カウント（セット・バリエーション親を除外）
    const { data: physicalData, error: physicalError } = await supabase
      .from('inventory_master')
      .select('id, product_type, is_variation_parent')
      .eq('inventory_type', 'stock');
    
    if (physicalError) throw physicalError;
    
    const physicalStock = (physicalData || []).filter(item => {
      const isSet = item.product_type === 'set';
      const isVarParent = item.is_variation_parent === true;
      return !isSet && !isVarParent;
    });
    
    // 全件カウント
    const { count: allDataCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true });
    
    // セット品カウント
    const { count: setCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .eq('product_type', 'set');
    
    // バリエーション親カウント
    const { count: varParentCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .eq('is_variation_parent', true);
    
    // 有在庫（stock）カウント
    const { count: stockCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .eq('inventory_type', 'stock');
    
    // 無在庫（mu）カウント
    const { count: muCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .eq('inventory_type', 'mu');
    
    return NextResponse.json({
      success: true,
      counts: {
        // 新設計
        physicalStock: physicalStock.length,  // 真実の物理在庫
        allData: allDataCount || 0,           // 全件
        setVariation: (setCount || 0) + (varParentCount || 0), // セット+バリ親
        
        // 内訳
        breakdown: {
          stock: stockCount || 0,             // 有在庫
          mu: muCount || 0,                   // 無在庫
          sets: setCount || 0,                // セット品
          variationParents: varParentCount || 0, // バリエーション親
        },
        
        // 旧互換
        stocktake: stockCount || 0,
        master: allDataCount || 0,
      },
      spreadsheetConfigured: !!SPREADSHEET_ID,
      spreadsheetId: SPREADSHEET_ID || null,
      spreadsheetUrl: SPREADSHEET_ID ? `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}` : null,
      sheets: {
        physicalStock: SHEETS.physicalStock.name,
        allData: SHEETS.allData.name,
        setVariation: SHEETS.setVariation.name,
      },
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
