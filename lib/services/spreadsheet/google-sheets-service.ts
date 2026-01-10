// lib/services/spreadsheet/google-sheets-service.ts
/**
 * Google Sheets API サービス
 * 
 * 機能:
 * 1. スプレッドシートへのデータ書き込み
 * 2. スプレッドシートからのデータ読み込み
 * 3. 一括更新（バッチ処理）
 * 4. シート作成・管理
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

import { google, sheets_v4 } from 'googleapis';

// ============================================================
// 型定義
// ============================================================

export interface SheetConfig {
  spreadsheetId: string;
  sheetName: string;
  range?: string;
}

export interface ColumnMapping {
  dbField: string;
  sheetColumn: string;
  columnIndex: number;
  formatter?: (value: any) => any;
  parser?: (value: any) => any;
}

export interface SyncResult {
  success: boolean;
  rowsAffected: number;
  errors?: string[];
}

// ============================================================
// デフォルト設定
// ============================================================

// 商品マスター用のカラムマッピング
export const PRODUCTS_MASTER_COLUMNS: ColumnMapping[] = [
  { dbField: 'id', sheetColumn: 'A', columnIndex: 0 },
  { dbField: 'product_name', sheetColumn: 'B', columnIndex: 1 },
  { dbField: 'english_title', sheetColumn: 'C', columnIndex: 2 },
  { dbField: 'sku', sheetColumn: 'D', columnIndex: 3 },
  { dbField: 'cost_price', sheetColumn: 'E', columnIndex: 4, formatter: (v) => v || 0 },
  { dbField: 'selling_price', sheetColumn: 'F', columnIndex: 5, formatter: (v) => v || 0 },
  { dbField: 'quantity', sheetColumn: 'G', columnIndex: 6, formatter: (v) => v || 0 },
  { dbField: 'category', sheetColumn: 'H', columnIndex: 7 },
  { dbField: 'condition_name', sheetColumn: 'I', columnIndex: 8 },
  { dbField: 'storage_location', sheetColumn: 'J', columnIndex: 9 },
  { dbField: 'workflow_status', sheetColumn: 'K', columnIndex: 10 },
  { dbField: 'origin_country', sheetColumn: 'L', columnIndex: 11 },
  { dbField: 'weight_g', sheetColumn: 'M', columnIndex: 12 },
  { dbField: 'primary_image_url', sheetColumn: 'N', columnIndex: 13 },
  { dbField: 'updated_at', sheetColumn: 'O', columnIndex: 14, formatter: (v) => v ? new Date(v).toLocaleString('ja-JP') : '' },
];

// 在庫マスター用のカラムマッピング
export const INVENTORY_MASTER_COLUMNS: ColumnMapping[] = [
  { dbField: 'id', sheetColumn: 'A', columnIndex: 0 },
  { dbField: 'sku', sheetColumn: 'B', columnIndex: 1 },
  { dbField: 'product_name', sheetColumn: 'C', columnIndex: 2 },
  { dbField: 'physical_quantity', sheetColumn: 'D', columnIndex: 3, formatter: (v) => v || 0 },
  { dbField: 'available_quantity', sheetColumn: 'E', columnIndex: 4, formatter: (v) => v || 0 },
  { dbField: 'cost_price', sheetColumn: 'F', columnIndex: 5, formatter: (v) => v || 0 },
  { dbField: 'storage_location', sheetColumn: 'G', columnIndex: 6 },
  { dbField: 'inventory_type', sheetColumn: 'H', columnIndex: 7 },
  { dbField: 'condition', sheetColumn: 'I', columnIndex: 8 },
  { dbField: 'last_counted_at', sheetColumn: 'J', columnIndex: 9, formatter: (v) => v ? new Date(v).toLocaleString('ja-JP') : '' },
  { dbField: 'updated_at', sheetColumn: 'K', columnIndex: 10, formatter: (v) => v ? new Date(v).toLocaleString('ja-JP') : '' },
];

// ============================================================
// Google Sheets クライアント
// ============================================================

class GoogleSheetsService {
  private sheets: sheets_v4.Sheets | null = null;
  private initialized = false;
  
  /**
   * 認証情報で初期化
   */
  async initialize(): Promise<boolean> {
    try {
      // 環境変数から認証情報を取得
      const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
      
      if (!credentials) {
        console.error('[GoogleSheets] GOOGLE_SHEETS_CREDENTIALS not set');
        return false;
      }
      
      const credentialsJson = JSON.parse(credentials);
      
      const auth = new google.auth.GoogleAuth({
        credentials: credentialsJson,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });
      
      this.sheets = google.sheets({ version: 'v4', auth });
      this.initialized = true;
      
      console.log('[GoogleSheets] Initialized successfully');
      return true;
    } catch (error: any) {
      console.error('[GoogleSheets] Initialization error:', error.message);
      return false;
    }
  }
  
  /**
   * 初期化確認
   */
  private ensureInitialized(): void {
    if (!this.initialized || !this.sheets) {
      throw new Error('GoogleSheetsService not initialized. Call initialize() first.');
    }
  }
  
  /**
   * シートからデータを読み込み
   */
  async readSheet(config: SheetConfig): Promise<any[][]> {
    this.ensureInitialized();
    
    const range = config.range || `${config.sheetName}!A:Z`;
    
    try {
      const response = await this.sheets!.spreadsheets.values.get({
        spreadsheetId: config.spreadsheetId,
        range
      });
      
      return response.data.values || [];
    } catch (error: any) {
      console.error('[GoogleSheets] Read error:', error.message);
      throw error;
    }
  }
  
  /**
   * シートにデータを書き込み（上書き）
   */
  async writeSheet(
    config: SheetConfig,
    data: any[][],
    includeHeader = true
  ): Promise<SyncResult> {
    this.ensureInitialized();
    
    const range = config.range || `${config.sheetName}!A1`;
    
    try {
      // まずシートをクリア
      await this.sheets!.spreadsheets.values.clear({
        spreadsheetId: config.spreadsheetId,
        range: `${config.sheetName}!A:Z`
      });
      
      // データを書き込み
      const response = await this.sheets!.spreadsheets.values.update({
        spreadsheetId: config.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: data }
      });
      
      return {
        success: true,
        rowsAffected: response.data.updatedRows || 0
      };
    } catch (error: any) {
      console.error('[GoogleSheets] Write error:', error.message);
      return {
        success: false,
        rowsAffected: 0,
        errors: [error.message]
      };
    }
  }
  
  /**
   * 特定の行を更新
   */
  async updateRow(
    config: SheetConfig,
    rowIndex: number,
    data: any[]
  ): Promise<SyncResult> {
    this.ensureInitialized();
    
    const range = `${config.sheetName}!A${rowIndex}:Z${rowIndex}`;
    
    try {
      const response = await this.sheets!.spreadsheets.values.update({
        spreadsheetId: config.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [data] }
      });
      
      return {
        success: true,
        rowsAffected: 1
      };
    } catch (error: any) {
      console.error('[GoogleSheets] Update row error:', error.message);
      return {
        success: false,
        rowsAffected: 0,
        errors: [error.message]
      };
    }
  }
  
  /**
   * 特定のセルを更新
   */
  async updateCell(
    config: SheetConfig,
    row: number,
    column: string,
    value: any
  ): Promise<SyncResult> {
    this.ensureInitialized();
    
    const range = `${config.sheetName}!${column}${row}`;
    
    try {
      await this.sheets!.spreadsheets.values.update({
        spreadsheetId: config.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[value]] }
      });
      
      return { success: true, rowsAffected: 1 };
    } catch (error: any) {
      return { success: false, rowsAffected: 0, errors: [error.message] };
    }
  }
  
  /**
   * バッチ更新（複数セルを一度に更新）
   */
  async batchUpdate(
    spreadsheetId: string,
    updates: Array<{ range: string; values: any[][] }>
  ): Promise<SyncResult> {
    this.ensureInitialized();
    
    try {
      const response = await this.sheets!.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: updates
        }
      });
      
      return {
        success: true,
        rowsAffected: response.data.totalUpdatedRows || 0
      };
    } catch (error: any) {
      return { success: false, rowsAffected: 0, errors: [error.message] };
    }
  }
  
  /**
   * DBデータをシート用の2D配列に変換
   */
  convertToSheetData(
    dbRecords: any[],
    columns: ColumnMapping[],
    includeHeader = true
  ): any[][] {
    const data: any[][] = [];
    
    // ヘッダー行
    if (includeHeader) {
      data.push(columns.map(col => col.dbField));
    }
    
    // データ行
    for (const record of dbRecords) {
      const row: any[] = [];
      for (const col of columns) {
        let value = record[col.dbField];
        if (col.formatter) {
          value = col.formatter(value);
        }
        row.push(value ?? '');
      }
      data.push(row);
    }
    
    return data;
  }
  
  /**
   * シートデータをDBレコード形式に変換
   */
  convertToDbRecords(
    sheetData: any[][],
    columns: ColumnMapping[],
    skipHeader = true
  ): any[] {
    const records: any[] = [];
    const startIndex = skipHeader ? 1 : 0;
    
    for (let i = startIndex; i < sheetData.length; i++) {
      const row = sheetData[i];
      if (!row || row.length === 0) continue;
      
      const record: any = {};
      for (const col of columns) {
        let value = row[col.columnIndex];
        if (col.parser) {
          value = col.parser(value);
        }
        record[col.dbField] = value;
      }
      records.push(record);
    }
    
    return records;
  }
  
  /**
   * シート内でIDから行番号を検索
   */
  async findRowById(
    config: SheetConfig,
    id: string | number,
    idColumn: string = 'A'
  ): Promise<number | null> {
    const data = await this.readSheet(config);
    
    for (let i = 1; i < data.length; i++) { // ヘッダースキップ
      if (String(data[i][0]) === String(id)) {
        return i + 1; // 1-indexed
      }
    }
    
    return null;
  }
}

// シングルトンインスタンス
export const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;
