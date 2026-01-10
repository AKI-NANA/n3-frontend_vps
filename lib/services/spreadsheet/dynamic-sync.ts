// lib/services/spreadsheet/dynamic-sync.ts
/**
 * 動的カラム対応 双方向同期サービス
 * 
 * 機能:
 * 1. DBの全カラムを自動検出・同期
 * 2. スプレッドシートのヘッダーから動的にカラムマッピング
 * 3. 新規カラム追加時の自動対応
 * 4. 画像URL、JSONB、配列など全データ型対応
 * 
 * @version 2.0.0
 * @date 2025-12-21
 */

import { google, sheets_v4 } from 'googleapis';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

// ============================================================
// 型定義
// ============================================================

export interface DynamicSyncConfig {
  spreadsheetId: string;
  sheetName: string;
  tableName: string;
  
  // オプション
  excludeColumns?: string[];      // 同期から除外するカラム
  readOnlyColumns?: string[];     // 読み取り専用カラム（シート→DB同期しない）
  primaryKey?: string;            // 主キーカラム（デフォルト: id）
  autoCreateColumns?: boolean;    // DBに新規カラムがあればシートに自動追加
  syncImages?: boolean;           // 画像URLを=IMAGE()関数に変換
  syncInterval?: number;          // ポーリング間隔（ミリ秒）
}

export interface ColumnInfo {
  name: string;
  sheetIndex: number;      // 0-based
  sheetColumn: string;     // A, B, C...
  dataType: 'text' | 'number' | 'boolean' | 'date' | 'json' | 'array' | 'image';
  isReadOnly: boolean;
}

export interface SyncEvent {
  type: 'insert' | 'update' | 'delete' | 'full_sync';
  table: string;
  recordId?: string | number;
  changes?: Record<string, any>;
  timestamp: Date;
}

// ============================================================
// デフォルト設定
// ============================================================

const DEFAULT_EXCLUDE_COLUMNS = [
  'created_at',  // 作成日時は通常変更しない
];

const DEFAULT_READ_ONLY_COLUMNS = [
  'id',
  'created_at',
  'updated_at',
];

// 画像カラム判定用パターン
const IMAGE_COLUMN_PATTERNS = [
  /image/i,
  /photo/i,
  /picture/i,
  /thumbnail/i,
  /img/i,
  /_url$/i,
];

// ============================================================
// ユーティリティ関数
// ============================================================

/**
 * 列番号を列文字に変換（0 → A, 26 → AA）
 */
function indexToColumn(index: number): string {
  let column = '';
  let temp = index;
  
  while (temp >= 0) {
    column = String.fromCharCode((temp % 26) + 65) + column;
    temp = Math.floor(temp / 26) - 1;
  }
  
  return column;
}

/**
 * 列文字を列番号に変換（A → 0, AA → 26）
 */
function columnToIndex(column: string): number {
  let index = 0;
  for (let i = 0; i < column.length; i++) {
    index = index * 26 + (column.charCodeAt(i) - 64);
  }
  return index - 1;
}

/**
 * 値のデータ型を推定
 */
function detectDataType(value: any, columnName: string): ColumnInfo['dataType'] {
  // カラム名から画像判定
  if (IMAGE_COLUMN_PATTERNS.some(p => p.test(columnName))) {
    return 'image';
  }
  
  if (value === null || value === undefined) return 'text';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (value instanceof Date) return 'date';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'json';
  
  // 文字列の場合、日付かどうか判定
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'date';
    if (value.startsWith('http') && IMAGE_COLUMN_PATTERNS.some(p => p.test(columnName))) {
      return 'image';
    }
  }
  
  return 'text';
}

/**
 * DB値をシート用に変換
 */
function formatValueForSheet(value: any, dataType: ColumnInfo['dataType'], syncImages: boolean): any {
  if (value === null || value === undefined) return '';
  
  switch (dataType) {
    case 'image':
      if (syncImages && typeof value === 'string' && value.startsWith('http')) {
        return `=IMAGE("${value}")`;
      }
      return value;
      
    case 'json':
      return JSON.stringify(value);
      
    case 'array':
      if (Array.isArray(value)) {
        // 画像配列の場合は最初の1枚のみ表示
        if (value.length > 0 && typeof value[0] === 'string' && value[0].startsWith('http')) {
          return syncImages ? `=IMAGE("${value[0]}")` : value.join('\n');
        }
        return value.join(', ');
      }
      return String(value);
      
    case 'date':
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
      
    case 'boolean':
      return value ? 'TRUE' : 'FALSE';
      
    case 'number':
      return Number(value) || 0;
      
    default:
      return String(value);
  }
}

/**
 * シート値をDB用に変換
 */
function parseValueFromSheet(value: any, dataType: ColumnInfo['dataType']): any {
  if (value === '' || value === null || value === undefined) return null;
  
  // =IMAGE("url") から URL を抽出
  if (typeof value === 'string' && value.startsWith('=IMAGE(')) {
    const match = value.match(/=IMAGE\("([^"]+)"\)/);
    return match ? match[1] : value;
  }
  
  switch (dataType) {
    case 'json':
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
      
    case 'array':
      if (typeof value === 'string') {
        // カンマまたは改行で分割
        return value.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
      }
      return [value];
      
    case 'boolean':
      return value === true || value === 'TRUE' || value === 'true' || value === '1';
      
    case 'number':
      const num = Number(value);
      return isNaN(num) ? null : num;
      
    case 'date':
      return value;
      
    default:
      return value;
  }
}

// ============================================================
// DynamicSyncManager クラス
// ============================================================

export class DynamicSyncManager {
  private sheets: sheets_v4.Sheets | null = null;
  private supabase: SupabaseClient | null = null;
  private channels: Map<string, RealtimeChannel> = new Map();
  private columnMappings: Map<string, ColumnInfo[]> = new Map();
  private configs: Map<string, DynamicSyncConfig> = new Map();
  private initialized = false;
  
  // イベントリスナー
  private eventListeners: ((event: SyncEvent) => void)[] = [];
  
  /**
   * 初期化
   */
  async initialize(): Promise<boolean> {
    try {
      // Supabase初期化
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials not configured');
      }
      
      this.supabase = createClient(supabaseUrl, supabaseKey);
      
      // Google Sheets初期化
      const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
      if (credentials) {
        const credentialsJson = JSON.parse(credentials);
        const auth = new google.auth.GoogleAuth({
          credentials: credentialsJson,
          scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
        this.sheets = google.sheets({ version: 'v4', auth });
      }
      
      this.initialized = true;
      console.log('[DynamicSync] Initialized');
      return true;
    } catch (error: any) {
      console.error('[DynamicSync] Init error:', error.message);
      return false;
    }
  }
  
  /**
   * イベントリスナー登録
   */
  onSync(listener: (event: SyncEvent) => void): () => void {
    this.eventListeners.push(listener);
    return () => {
      this.eventListeners = this.eventListeners.filter(l => l !== listener);
    };
  }
  
  /**
   * イベント発火
   */
  private emitEvent(event: SyncEvent): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (e) {
        console.error('[DynamicSync] Event listener error:', e);
      }
    });
  }
  
  /**
   * DBからカラム情報を取得
   */
  async getDbColumns(tableName: string): Promise<string[]> {
    if (!this.supabase) throw new Error('Not initialized');
    
    // 1行取得してカラムを検出
    const { data, error } = await this.supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return Object.keys(data[0]);
    }
    
    // データがない場合はスキーマから取得（Supabaseの場合）
    // 代替として空配列を返す
    return [];
  }
  
  /**
   * シートからヘッダーを取得
   */
  async getSheetHeaders(config: DynamicSyncConfig): Promise<string[]> {
    if (!this.sheets) return [];
    
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: config.spreadsheetId,
        range: `${config.sheetName}!1:1`
      });
      
      return (response.data.values?.[0] || []).map(h => String(h).trim());
    } catch (error) {
      console.error('[DynamicSync] Get headers error:', error);
      return [];
    }
  }
  
  /**
   * カラムマッピングを構築
   */
  async buildColumnMapping(config: DynamicSyncConfig): Promise<ColumnInfo[]> {
    const dbColumns = await this.getDbColumns(config.tableName);
    const sheetHeaders = await this.getSheetHeaders(config);
    
    const excludeColumns = config.excludeColumns || DEFAULT_EXCLUDE_COLUMNS;
    const readOnlyColumns = config.readOnlyColumns || DEFAULT_READ_ONLY_COLUMNS;
    
    const columns: ColumnInfo[] = [];
    
    // シートにヘッダーがある場合はそれに従う
    if (sheetHeaders.length > 0) {
      sheetHeaders.forEach((header, index) => {
        if (header && !excludeColumns.includes(header)) {
          columns.push({
            name: header,
            sheetIndex: index,
            sheetColumn: indexToColumn(index),
            dataType: 'text', // 後でデータから推定
            isReadOnly: readOnlyColumns.includes(header)
          });
        }
      });
    } else {
      // シートが空の場合はDBカラムからヘッダーを作成
      dbColumns.forEach((col, index) => {
        if (!excludeColumns.includes(col)) {
          columns.push({
            name: col,
            sheetIndex: index,
            sheetColumn: indexToColumn(index),
            dataType: 'text',
            isReadOnly: readOnlyColumns.includes(col)
          });
        }
      });
    }
    
    return columns;
  }
  
  /**
   * 同期開始
   */
  async startSync(config: DynamicSyncConfig): Promise<boolean> {
    if (!this.initialized) await this.initialize();
    if (!this.supabase) return false;
    
    const configKey = `${config.tableName}:${config.sheetName}`;
    this.configs.set(configKey, config);
    
    // カラムマッピング構築
    const columns = await this.buildColumnMapping(config);
    this.columnMappings.set(configKey, columns);
    
    console.log(`[DynamicSync] Column mapping for ${configKey}:`, columns.map(c => c.name));
    
    // Realtime購読
    const channel = this.supabase
      .channel(`dynamic-sync-${config.tableName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: config.tableName
        },
        (payload) => this.handleDbChange(config, payload)
      )
      .subscribe();
    
    this.channels.set(configKey, channel);
    
    // 初期フルシンク
    await this.fullSync(config);
    
    return true;
  }
  
  /**
   * フルシンク（DB → Sheet）
   */
  async fullSync(config: DynamicSyncConfig): Promise<{ success: boolean; rowCount: number }> {
    if (!this.supabase || !this.sheets) {
      return { success: false, rowCount: 0 };
    }
    
    try {
      const configKey = `${config.tableName}:${config.sheetName}`;
      let columns = this.columnMappings.get(configKey);
      
      // カラム情報がなければ構築
      if (!columns || columns.length === 0) {
        columns = await this.buildColumnMapping(config);
        this.columnMappings.set(configKey, columns);
      }
      
      // DBからデータ取得
      const { data: records, error } = await this.supabase
        .from(config.tableName)
        .select('*')
        .order(config.primaryKey || 'id', { ascending: true });
      
      if (error) throw error;
      
      if (!records || records.length === 0) {
        console.log('[DynamicSync] No data to sync');
        return { success: true, rowCount: 0 };
      }
      
      // 最初のレコードからデータ型を推定して更新
      const firstRecord = records[0];
      columns = columns.map(col => ({
        ...col,
        dataType: detectDataType(firstRecord[col.name], col.name)
      }));
      this.columnMappings.set(configKey, columns);
      
      // シート用データ作成
      const sheetData: any[][] = [];
      
      // ヘッダー行
      sheetData.push(columns.map(col => col.name));
      
      // データ行
      for (const record of records) {
        const row: any[] = [];
        for (const col of columns) {
          const value = record[col.name];
          row.push(formatValueForSheet(value, col.dataType, config.syncImages !== false));
        }
        sheetData.push(row);
      }
      
      // シートをクリアして書き込み
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: config.spreadsheetId,
        range: `${config.sheetName}!A:ZZ`
      });
      
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: config.spreadsheetId,
        range: `${config.sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: sheetData }
      });
      
      console.log(`[DynamicSync] Full sync complete: ${records.length} rows, ${columns.length} columns`);
      
      this.emitEvent({
        type: 'full_sync',
        table: config.tableName,
        timestamp: new Date()
      });
      
      return { success: true, rowCount: records.length };
      
    } catch (error: any) {
      console.error('[DynamicSync] Full sync error:', error);
      return { success: false, rowCount: 0 };
    }
  }
  
  /**
   * DB変更をシートに反映
   */
  private async handleDbChange(config: DynamicSyncConfig, payload: any): Promise<void> {
    if (!this.sheets) return;
    
    const configKey = `${config.tableName}:${config.sheetName}`;
    const columns = this.columnMappings.get(configKey);
    if (!columns) return;
    
    const eventType = payload.eventType;
    const record = payload.new || payload.old;
    const recordId = record?.[config.primaryKey || 'id'];
    
    console.log(`[DynamicSync] DB change: ${eventType} on ${config.tableName}, id=${recordId}`);
    
    try {
      // シートから現在のデータを取得してID列を検索
      const sheetData = await this.sheets.spreadsheets.values.get({
        spreadsheetId: config.spreadsheetId,
        range: `${config.sheetName}!A:A`
      });
      
      const idColumnValues = sheetData.data.values || [];
      let rowIndex = -1;
      
      // IDで行を検索（ヘッダーをスキップ）
      for (let i = 1; i < idColumnValues.length; i++) {
        if (String(idColumnValues[i]?.[0]) === String(recordId)) {
          rowIndex = i + 1; // 1-indexed
          break;
        }
      }
      
      if (eventType === 'DELETE') {
        // 削除: 行をクリア
        if (rowIndex > 0) {
          const emptyRow = columns.map(() => '');
          await this.sheets.spreadsheets.values.update({
            spreadsheetId: config.spreadsheetId,
            range: `${config.sheetName}!A${rowIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [emptyRow] }
          });
        }
      } else {
        // INSERT/UPDATE: 行を更新
        const rowData = columns.map(col => {
          const value = record[col.name];
          return formatValueForSheet(value, col.dataType, config.syncImages !== false);
        });
        
        if (rowIndex > 0) {
          // 既存行を更新
          await this.sheets.spreadsheets.values.update({
            spreadsheetId: config.spreadsheetId,
            range: `${config.sheetName}!A${rowIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [rowData] }
          });
        } else {
          // 新規行を末尾に追加
          await this.sheets.spreadsheets.values.append({
            spreadsheetId: config.spreadsheetId,
            range: `${config.sheetName}!A:A`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [rowData] }
          });
        }
      }
      
      this.emitEvent({
        type: eventType.toLowerCase() as SyncEvent['type'],
        table: config.tableName,
        recordId,
        changes: record,
        timestamp: new Date()
      });
      
    } catch (error: any) {
      console.error('[DynamicSync] Handle change error:', error);
    }
  }
  
  /**
   * シート変更をDBに反映（Webhook経由）
   */
  async applySheetChange(
    tableName: string,
    sheetName: string,
    recordId: string | number,
    columnName: string,
    newValue: any
  ): Promise<boolean> {
    if (!this.supabase) return false;
    
    const configKey = `${tableName}:${sheetName}`;
    const columns = this.columnMappings.get(configKey);
    const column = columns?.find(c => c.name === columnName);
    
    // 読み取り専用カラムは無視
    if (column?.isReadOnly) {
      console.log(`[DynamicSync] Ignoring read-only column: ${columnName}`);
      return false;
    }
    
    try {
      // 値を適切な型に変換
      const parsedValue = column 
        ? parseValueFromSheet(newValue, column.dataType)
        : newValue;
      
      const { error } = await this.supabase
        .from(tableName)
        .update({
          [columnName]: parsedValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId);
      
      if (error) throw error;
      
      console.log(`[DynamicSync] Updated ${tableName}.${columnName} = ${parsedValue} (id=${recordId})`);
      
      this.emitEvent({
        type: 'update',
        table: tableName,
        recordId,
        changes: { [columnName]: parsedValue },
        timestamp: new Date()
      });
      
      return true;
    } catch (error: any) {
      console.error('[DynamicSync] Apply change error:', error);
      return false;
    }
  }
  
  /**
   * シートにカラムを追加
   */
  async addColumn(
    config: DynamicSyncConfig,
    columnName: string,
    defaultValue?: any
  ): Promise<boolean> {
    if (!this.sheets) return false;
    
    const configKey = `${config.tableName}:${config.sheetName}`;
    const columns = this.columnMappings.get(configKey) || [];
    
    // 既存カラムチェック
    if (columns.some(c => c.name === columnName)) {
      console.log(`[DynamicSync] Column already exists: ${columnName}`);
      return false;
    }
    
    try {
      // 新しいカラム位置
      const newIndex = columns.length;
      const newColumn = indexToColumn(newIndex);
      
      // ヘッダーを追加
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: config.spreadsheetId,
        range: `${config.sheetName}!${newColumn}1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[columnName]] }
      });
      
      // カラムマッピングを更新
      columns.push({
        name: columnName,
        sheetIndex: newIndex,
        sheetColumn: newColumn,
        dataType: 'text',
        isReadOnly: false
      });
      this.columnMappings.set(configKey, columns);
      
      console.log(`[DynamicSync] Added column: ${columnName} at ${newColumn}`);
      return true;
    } catch (error: any) {
      console.error('[DynamicSync] Add column error:', error);
      return false;
    }
  }
  
  /**
   * 現在のカラム情報を取得
   */
  getColumns(tableName: string, sheetName: string): ColumnInfo[] {
    const configKey = `${tableName}:${sheetName}`;
    return this.columnMappings.get(configKey) || [];
  }
  
  /**
   * 同期停止
   */
  async stopSync(tableName: string, sheetName: string): Promise<void> {
    const configKey = `${tableName}:${sheetName}`;
    
    const channel = this.channels.get(configKey);
    if (channel && this.supabase) {
      await this.supabase.removeChannel(channel);
      this.channels.delete(configKey);
    }
    
    this.configs.delete(configKey);
    this.columnMappings.delete(configKey);
  }
  
  /**
   * 全停止
   */
  async stopAll(): Promise<void> {
    if (this.supabase) {
      for (const channel of this.channels.values()) {
        await this.supabase.removeChannel(channel);
      }
    }
    this.channels.clear();
    this.configs.clear();
    this.columnMappings.clear();
  }
}

// シングルトン
export const dynamicSyncManager = new DynamicSyncManager();
export default dynamicSyncManager;
