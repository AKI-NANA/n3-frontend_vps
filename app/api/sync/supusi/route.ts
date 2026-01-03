// app/api/sync/supusi/route.ts
/**
 * Supusi（スプレッドシート）同期API v5
 * 
 * マルチシート対応 + ダイレクト同期版
 * - 棚卸しシート: シンプル版（Plus1外注用）
 * - マスターシート: フル版（データ編集・分析用）
 * 
 * v5変更点:
 * - GAS依存を減らし、直接Google Sheets API経由で同期
 * - マスターシート用フルカラム対応
 * - Pullボタンの説明を明確化
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getGoogleSheetsClient } from '@/lib/services/spreadsheet/google-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GAS Web App URL (フォールバック用)
const GAS_WEB_APP_URL = process.env.GAS_SUPUSI_WEB_APP_URL || '';

// スプレッドシート設定
const SPREADSHEET_ID = '1lD9ESIhv2oTE6sgL172wOOF9fJAcIy0SHrdhkLNw3MM';
const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;

// シート設定
const SHEET_CONFIG = {
  stocktake: {
    name: '全商品',  // 旧「棚卸し」→「全商品」に変更
    gid: 0,
    // 全商品シート: inventory_master全件
    columns: [
      { header: 'No.', dbField: null, type: 'row_number' },
      { header: '画像', dbField: 'images', type: 'image' },
      { header: 'ID', dbField: 'id', type: 'string', readOnly: true },
      { header: 'SKU', dbField: 'sku', type: 'string' },
      { header: '商品名(JP)', dbField: 'product_name', type: 'string' },
      { header: '商品名(EN)', dbField: 'title_en', type: 'string' },
      { header: 'カテゴリ', dbField: 'category', type: 'string' },
      { header: '在庫数', dbField: 'physical_quantity', type: 'number' },
      { header: '保管場所', dbField: 'storage_location', type: 'string' },
      { header: '原価', dbField: 'cost_price', type: 'number' },
      { header: '販売価格', dbField: 'selling_price', type: 'number' },
      { header: '状態', dbField: 'condition_name', type: 'string' },
      { header: 'ワークフロー', dbField: 'workflow_status', type: 'string' },
      { header: '出品状態', dbField: 'listing_status', type: 'string' },
      { header: 'Account', dbField: 'account', type: 'string' },
      { header: 'HTS', dbField: 'hts_code', type: 'string' },
      { header: '作成日', dbField: 'created_at', type: 'date', readOnly: true },
      { header: '更新日', dbField: 'updated_at', type: 'date', readOnly: true },
    ],
  },
  master: {
    name: 'マスター',
    gid: 1234567890, // 実際のGIDに要変更
    // マスターシート: 有在庫商品のみ（inventory_type = 'stock'）
    columns: [
      { header: 'No.', dbField: null, type: 'row_number' },
      { header: '画像', dbField: 'images', type: 'image' },
      { header: 'ID', dbField: 'id', type: 'string', readOnly: true },
      { header: 'SKU', dbField: 'sku', type: 'string' },
      { header: '商品名(JP)', dbField: 'product_name', type: 'string' },
      { header: '商品名(EN)', dbField: 'title_en', type: 'string' },
      { header: 'カテゴリ', dbField: 'category', type: 'string' },
      { header: 'L1', dbField: 'attr_l1', type: 'string' },
      { header: 'L2', dbField: 'attr_l2', type: 'string' },
      { header: 'L3', dbField: 'attr_l3', type: 'string' },
      { header: '在庫数', dbField: 'physical_quantity', type: 'number' },
      { header: '保管場所', dbField: 'storage_location', type: 'string' },
      { header: '原価', dbField: 'cost_price', type: 'number' },
      { header: '販売価格', dbField: 'selling_price', type: 'number' },
      { header: '状態', dbField: 'condition_name', type: 'string' },
      { header: 'ワークフロー', dbField: 'workflow_status', type: 'string' },
      { header: '出品状態', dbField: 'listing_status', type: 'string' },
      { header: 'Account', dbField: 'account', type: 'string' },
      { header: 'タイプ', dbField: 'inventory_type', type: 'string' },
      { header: '確定', dbField: 'is_verified', type: 'boolean' },
      { header: 'HTS', dbField: 'hts_code', type: 'string' },
      { header: '重量(g)', dbField: 'weight_g', type: 'number' },
      { header: '作成日', dbField: 'created_at', type: 'date', readOnly: true },
      { header: '更新日', dbField: 'updated_at', type: 'date', readOnly: true },
      { header: '備考', dbField: 'notes', type: 'string' },
    ],
  },
};

type SheetType = keyof typeof SHEET_CONFIG;

// ============================================================
// ヘルパー関数
// ============================================================

/**
 * 値をシート用にフォーマット
 */
function formatForSheet(value: any, type: string): any {
  if (value === null || value === undefined) return '';
  
  switch (type) {
    case 'image':
      // 配列の場合は最初の画像
      if (Array.isArray(value) && value.length > 0) {
        return `=IMAGE("${value[0]}")`;
      }
      if (typeof value === 'string' && value.startsWith('http')) {
        return `=IMAGE("${value}")`;
      }
      return '';
    case 'boolean':
      return value === true ? 'TRUE' : 'FALSE';
    case 'number':
      return typeof value === 'number' ? value : (parseFloat(value) || 0);
    case 'date':
      if (value instanceof Date) {
        return value.toISOString().split('T')[0];
      }
      if (typeof value === 'string' && value.includes('T')) {
        return value.split('T')[0];
      }
      return value || '';
    default:
      return String(value);
  }
}

/**
 * シートの値をDB用にパース
 */
function parseFromSheet(value: any, type: string): any {
  if (value === '' || value === null || value === undefined) return null;
  
  // =IMAGE("url") からURL抽出
  if (typeof value === 'string' && value.startsWith('=IMAGE(')) {
    const match = value.match(/=IMAGE\("([^"]+)"\)/);
    return match ? [match[1]] : null;
  }
  
  switch (type) {
    case 'boolean':
      return value === 'TRUE' || value === true || value === '1';
    case 'number':
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    case 'date':
      return value || null;
    case 'image':
      // 画像URLの場合
      if (typeof value === 'string' && value.startsWith('http')) {
        return [value];
      }
      return null;
    default:
      return value;
  }
}

// ============================================================
// GET: 状態確認
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'test') {
      const { count, error } = await supabase
        .from('inventory_master')
        .select('id', { count: 'exact', head: true });
      
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        message: `✅ DB接続成功\n\ninventory_master: ${count}件`,
        count,
        spreadsheetUrl: SPREADSHEET_URL,
        sheets: Object.fromEntries(
          Object.entries(SHEET_CONFIG).map(([k, v]) => [k, v.name])
        ),
        gasConfigured: !!GAS_WEB_APP_URL,
      });
    }
    
    if (action === 'stats') {
      const { count: totalCount } = await supabase
        .from('inventory_master')
        .select('id', { count: 'exact', head: true });
      
      const { count: verifiedCount } = await supabase
        .from('inventory_master')
        .select('id', { count: 'exact', head: true })
        .eq('is_verified', true);
      
      const { count: inStockCount } = await supabase
        .from('inventory_master')
        .select('id', { count: 'exact', head: true })
        .gt('physical_quantity', 0);
        
      const { count: masterCount } = await supabase
        .from('inventory_master')
        .select('id', { count: 'exact', head: true })
        .eq('is_master_item', true);
      
      return NextResponse.json({
        success: true,
        stats: {
          total: totalCount || 0,
          verified: verifiedCount || 0,
          inStock: inStockCount || 0,
          master: masterCount || 0,
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      status: 'ready',
      spreadsheetUrl: SPREADSHEET_URL,
      sheets: Object.fromEntries(
        Object.entries(SHEET_CONFIG).map(([k, v]) => [k, v.name])
      ),
      gasConfigured: !!GAS_WEB_APP_URL,
    });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ============================================================
// POST: 同期アクション
// ============================================================
interface SyncRequest {
  action: 'test' | 'push' | 'pull' | 'refresh';
  sheet?: SheetType;
}

export async function POST(request: NextRequest) {
  try {
    const body: SyncRequest = await request.json();
    const { action, sheet = 'stocktake' } = body;
    
    console.log('[Supusi Sync] POST:', { action, sheet });
    
    const sheetConfig = SHEET_CONFIG[sheet];
    if (!sheetConfig) {
      return NextResponse.json(
        { success: false, error: `Unknown sheet: ${sheet}` },
        { status: 400 }
      );
    }
    
    // テスト
    if (action === 'test') {
      const { count, error } = await supabase
        .from('inventory_master')
        .select('id', { count: 'exact', head: true });
      
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      
      // Google Sheets接続テスト
      let sheetsStatus = '未確認';
      try {
        const sheets = await getGoogleSheetsClient();
        const response = await sheets.spreadsheets.get({
          spreadsheetId: SPREADSHEET_ID,
          fields: 'properties.title,sheets.properties',
        });
        const sheetNames = response.data.sheets?.map(s => s.properties?.title).join(', ');
        sheetsStatus = `✅ 接続OK (シート: ${sheetNames})`;
      } catch (e: any) {
        sheetsStatus = `❌ ${e.message}`;
      }
      
      return NextResponse.json({
        success: true,
        message: `✅ DB接続成功！\n\ninventory_master: ${count}件\n\n📊 Google Sheets: ${sheetsStatus}\n\n対象シート: ${sheetConfig.name}`,
        count,
        spreadsheetUrl: SPREADSHEET_URL,
      });
    }
    
    // プッシュ（DB → シート）：Google Sheets APIを直接使用
    if (action === 'push') {
      try {
        console.log('[Supusi] Starting direct push to sheet:', sheetConfig.name);
        
        // MUG通貨（除外対象）
        const MUG_CURRENCIES = ['GBP', 'EUR', 'CAD', 'AUD'];
        
        // DBからデータ取得
        let query = supabase
          .from('inventory_master')
          .select('*')
          .order('created_at', { ascending: false });
        
        // マスターシートの場合、有在庫商品のみ（inventory_type = 'stock'）
        if (sheet === 'master') {
          query = query.eq('inventory_type', 'stock');
        }
        
        const { data: rawRecords, error: dbError } = await query.limit(5000);
        
        if (dbError) {
          return NextResponse.json({ success: false, error: `DB Error: ${dbError.message}` }, { status: 500 });
        }
        
        // MUG派生リスティングを除外
        const records = (rawRecords || []).filter(record => {
          const currency = record.ebay_data?.currency;
          if (!currency) return true;
          return !MUG_CURRENCIES.includes(currency.toUpperCase());
        });
        
        if (records.length === 0) {
          return NextResponse.json({
            success: true,
            message: `${sheetConfig.name}シートに書き込むデータがありません（0件）`,
            count: 0,
          });
        }
        
        console.log(`[Supusi] Fetched ${records.length} records from DB (after MUG filter)`);
        
        // シート用データ作成
        const headers = sheetConfig.columns.map(c => c.header);
        const rows = records.map((record, index) => {
          return sheetConfig.columns.map(col => {
            if (col.type === 'row_number') return index + 1;
            if (!col.dbField) return '';
            
            const value = record[col.dbField];
            return formatForSheet(value, col.type);
          });
        });
        
        // Google Sheets APIで書き込み
        const sheets = await getGoogleSheetsClient();
        
        // シートをクリア
        await sheets.spreadsheets.values.clear({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetConfig.name}!A:Z`,
        });
        
        // ヘッダー + データを書き込み
        const allData = [headers, ...rows];
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetConfig.name}!A1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: allData },
        });
        
        console.log(`[Supusi] Successfully pushed ${records.length} rows to ${sheetConfig.name}`);
        
        return NextResponse.json({
          success: true,
          message: `✅ ${sheetConfig.name}シートにプッシュしました\n\n${records.length}件のデータを書き込みました\n\nカラム: ${headers.join(', ')}`,
          count: records.length,
        });
        
      } catch (pushError: any) {
        console.error('[Supusi] Push error:', pushError);
        return NextResponse.json({
          success: false,
          error: `Push失敗: ${pushError.message}`,
          hint: 'Google Sheets APIの認証を確認してください',
        }, { status: 500 });
      }
    }
    
    // プル（シート → DB）：Google Sheets APIを直接使用
    if (action === 'pull') {
      try {
        console.log('[Supusi] Starting direct pull from sheet:', sheetConfig.name);
        
        const sheets = await getGoogleSheetsClient();
        
        // シートからデータ取得
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetConfig.name}!A:Z`,
        });
        
        const sheetData = response.data.values;
        if (!sheetData || sheetData.length < 2) {
          return NextResponse.json({
            success: false,
            error: 'シートにデータがありません（ヘッダー行のみ、または空）',
          }, { status: 400 });
        }
        
        const headerRow = sheetData[0];
        const dataRows = sheetData.slice(1);
        
        console.log(`[Supusi] Found ${dataRows.length} data rows`);
        console.log(`[Supusi] Headers: ${headerRow.join(', ')}`);
        
        // ヘッダーからカラムインデックスを作成
        const headerToIndex: Record<string, number> = {};
        headerRow.forEach((h, i) => {
          headerToIndex[String(h).trim()] = i;
        });
        
        // IDカラムのインデックスを取得
        const idIndex = headerToIndex['ID'];
        if (idIndex === undefined) {
          return NextResponse.json({
            success: false,
            error: 'シートにID列がありません。ID列は必須です。',
          }, { status: 400 });
        }
        
        let successCount = 0;
        let errorCount = 0;
        const errors: string[] = [];
        
        // 各行を処理
        for (const row of dataRows) {
          const recordId = row[idIndex];
          if (!recordId) {
            console.log('[Supusi] Skipping row without ID');
            continue;
          }
          
          // 更新データを構築
          const updateData: Record<string, any> = {};
          
          for (const col of sheetConfig.columns) {
            if (!col.dbField || col.readOnly || col.type === 'row_number') continue;
            
            const colIndex = headerToIndex[col.header];
            if (colIndex === undefined) continue;
            
            const cellValue = row[colIndex];
            const parsedValue = parseFromSheet(cellValue, col.type);
            
            // 値が存在する場合のみ更新（空文字はnullとして扱う）
            if (parsedValue !== null || cellValue === '') {
              updateData[col.dbField] = parsedValue;
            }
          }
          
          // 更新実行
          if (Object.keys(updateData).length > 0) {
            updateData.updated_at = new Date().toISOString();
            
            const { error: updateError } = await supabase
              .from('inventory_master')
              .update(updateData)
              .eq('id', recordId);
            
            if (updateError) {
              errorCount++;
              errors.push(`ID ${recordId}: ${updateError.message}`);
              console.error(`[Supusi] Update error for ID ${recordId}:`, updateError);
            } else {
              successCount++;
            }
          }
        }
        
        console.log(`[Supusi] Pull complete: ${successCount} success, ${errorCount} errors`);
        
        return NextResponse.json({
          success: errorCount === 0,
          message: `✅ ${sheetConfig.name}シートからDBにプルしました\n\n成功: ${successCount}件\n失敗: ${errorCount}件${errors.length > 0 ? '\n\nエラー:\n' + errors.slice(0, 5).join('\n') : ''}`,
          successCount,
          errorCount,
          errors: errors.slice(0, 10),
        });
        
      } catch (pullError: any) {
        console.error('[Supusi] Pull error:', pullError);
        return NextResponse.json({
          success: false,
          error: `Pull失敗: ${pullError.message}`,
          hint: 'Google Sheets APIの認証を確認してください',
        }, { status: 500 });
      }
    }
    
    // データ更新
    if (action === 'refresh') {
      const { count } = await supabase
        .from('inventory_master')
        .select('id', { count: 'exact', head: true });
      
      return NextResponse.json({
        success: true,
        message: `✅ ${count}件のデータがあります`,
        count,
      });
    }
    
    return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ============================================================
// PUT: GASからのWebhook（リアルタイム同期）
// ============================================================
interface WebhookPayload {
  recordId: string | number;
  columnName: string;
  newValue: any;
  sheetName?: string;
}

export async function PUT(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json();
    const { recordId, columnName, newValue, sheetName } = payload;
    
    console.log('[Supusi Webhook] Received:', payload);
    
    // シート設定からカラムマッピングを取得
    let dbColumn: string | null = null;
    let columnType = 'string';
    
    // 全シートのカラム設定を検索
    for (const config of Object.values(SHEET_CONFIG)) {
      const col = config.columns.find(c => c.header === columnName);
      if (col && col.dbField) {
        dbColumn = col.dbField;
        columnType = col.type;
        break;
      }
    }
    
    // 見つからない場合はレガシーマッピング
    if (!dbColumn) {
      const LEGACY_MAPPING: Record<string, string> = {
        '商品名': 'product_name',
        '商品名(JP)': 'product_name',
        '商品名(EN)': 'title_en',
        'カテゴリ': 'category',
        'L1': 'attr_l1',
        'L2': 'attr_l2',
        'L3': 'attr_l3',
        '確定': 'is_verified',
        '在庫数': 'physical_quantity',
        '保管場所': 'storage_location',
        '原価': 'cost_price',
        '販売価格': 'selling_price',
        'タイプ': 'inventory_type',
        '状態': 'condition_name',
        'ワークフロー': 'workflow_status',
        '重量(g)': 'weight_g',
        'HTS': 'hts_code',
        '備考': 'notes',
        'Account': 'account',
        '保有': 'is_in_possession',
        '出品状態': 'listing_status',
      };
      dbColumn = LEGACY_MAPPING[columnName] || columnName;
    }
    
    // 読み取り専用チェック
    const READ_ONLY = ['id', 'created_at', 'updated_at', 'source_data'];
    if (READ_ONLY.includes(dbColumn)) {
      return NextResponse.json({ success: false, error: `Column ${dbColumn} is read-only` }, { status: 400 });
    }
    
    // 型変換
    let parsedValue = parseFromSheet(newValue, columnType);
    
    // DB更新
    const { error } = await supabase
      .from('inventory_master')
      .update({
        [dbColumn]: parsedValue,
        updated_at: new Date().toISOString(),
      })
      .eq('id', recordId);
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    console.log('[Supusi Webhook] ✅ Updated:', { id: recordId, column: dbColumn, value: parsedValue });
    
    return NextResponse.json({
      success: true,
      updated: { id: recordId, column: dbColumn, value: parsedValue },
    });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
