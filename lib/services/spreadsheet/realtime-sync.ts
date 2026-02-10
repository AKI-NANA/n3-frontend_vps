// lib/services/spreadsheet/realtime-sync.ts
/**
 * Supabase Realtime ↔ Google Sheets 双方向同期サービス
 * 
 * 機能:
 * 1. Supabase変更 → Google Sheets自動更新
 * 2. Google Sheets変更 → Supabase自動更新（Webhook経由）
 * 3. 初期同期（フルシンク）
 * 4. 差分同期（インクリメンタル）
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { 
  googleSheetsService, 
  PRODUCTS_MASTER_COLUMNS, 
  INVENTORY_MASTER_COLUMNS,
  SheetConfig,
  ColumnMapping 
} from './google-sheets-service';

// ============================================================
// 型定義
// ============================================================

export interface SyncConfig {
  spreadsheetId: string;
  tableName: 'products_master' | 'inventory_master';
  sheetName: string;
  columns: ColumnMapping[];
  syncInterval?: number; // ミリ秒（ポーリング間隔）
  enableRealtime?: boolean;
}

export interface SyncStatus {
  isConnected: boolean;
  lastSyncAt: Date | null;
  pendingChanges: number;
  errors: string[];
}

type ChangeType = 'INSERT' | 'UPDATE' | 'DELETE';

interface DatabaseChange {
  type: ChangeType;
  table: string;
  record: any;
  oldRecord?: any;
}

// ============================================================
// 同期マネージャー
// ============================================================

class RealtimeSyncManager {
  private supabase: SupabaseClient | null = null;
  private channels: Map<string, RealtimeChannel> = new Map();
  private syncConfigs: Map<string, SyncConfig> = new Map();
  private status: SyncStatus = {
    isConnected: false,
    lastSyncAt: null,
    pendingChanges: 0,
    errors: []
  };
  private changeQueue: DatabaseChange[] = [];
  private processingQueue = false;
  
  /**
   * 初期化
   */
  async initialize(): Promise<boolean> {
    try {
      // Supabase クライアント初期化
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials not configured');
      }
      
      this.supabase = createClient(supabaseUrl, supabaseKey);
      
      // Google Sheets 初期化
      const sheetsInitialized = await googleSheetsService.initialize();
      if (!sheetsInitialized) {
        console.warn('[RealtimeSync] Google Sheets not initialized - sync will be one-way only');
      }
      
      this.status.isConnected = true;
      console.log('[RealtimeSync] Initialized successfully');
      return true;
    } catch (error: any) {
      console.error('[RealtimeSync] Initialization error:', error.message);
      this.status.errors.push(error.message);
      return false;
    }
  }
  
  /**
   * テーブルの同期を開始
   */
  async startSync(config: SyncConfig): Promise<boolean> {
    if (!this.supabase) {
      console.error('[RealtimeSync] Not initialized');
      return false;
    }
    
    const configKey = `${config.tableName}:${config.sheetName}`;
    this.syncConfigs.set(configKey, config);
    
    // Realtimeチャンネルを購読
    if (config.enableRealtime !== false) {
      const channel = this.supabase
        .channel(`sync-${config.tableName}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: config.tableName
          },
          (payload) => this.handleDatabaseChange(config, payload)
        )
        .subscribe((status) => {
          console.log(`[RealtimeSync] Channel ${config.tableName}: ${status}`);
        });
      
      this.channels.set(configKey, channel);
    }
    
    // 初期同期実行
    await this.fullSync(config);
    
    console.log(`[RealtimeSync] Started sync for ${config.tableName} → ${config.sheetName}`);
    return true;
  }
  
  /**
   * 同期を停止
   */
  async stopSync(tableName: string, sheetName: string): Promise<void> {
    const configKey = `${tableName}:${sheetName}`;
    
    const channel = this.channels.get(configKey);
    if (channel) {
      await channel.unsubscribe();
      this.channels.delete(configKey);
    }
    
    this.syncConfigs.delete(configKey);
    console.log(`[RealtimeSync] Stopped sync for ${tableName}`);
  }
  
  /**
   * フル同期（DB → Sheet）
   */
  async fullSync(config: SyncConfig): Promise<boolean> {
    if (!this.supabase) return false;
    
    try {
      console.log(`[RealtimeSync] Starting full sync for ${config.tableName}...`);
      
      // DBからデータ取得
      const { data, error } = await this.supabase
        .from(config.tableName)
        .select('*')
        .order('id', { ascending: true })
        .limit(10000); // 安全のため制限
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        console.log('[RealtimeSync] No data to sync');
        return true;
      }
      
      // シート用データに変換
      const sheetData = googleSheetsService.convertToSheetData(
        data,
        config.columns,
        true
      );
      
      // シートに書き込み
      const result = await googleSheetsService.writeSheet(
        {
          spreadsheetId: config.spreadsheetId,
          sheetName: config.sheetName
        },
        sheetData
      );
      
      if (result.success) {
        this.status.lastSyncAt = new Date();
        console.log(`[RealtimeSync] Full sync complete: ${result.rowsAffected} rows`);
      }
      
      return result.success;
    } catch (error: any) {
      console.error('[RealtimeSync] Full sync error:', error.message);
      this.status.errors.push(error.message);
      return false;
    }
  }
  
  /**
   * DB変更をシートに反映
   */
  private async handleDatabaseChange(config: SyncConfig, payload: any): Promise<void> {
    const change: DatabaseChange = {
      type: payload.eventType as ChangeType,
      table: payload.table,
      record: payload.new,
      oldRecord: payload.old
    };
    
    console.log(`[RealtimeSync] DB Change: ${change.type} on ${change.table}`);
    
    // キューに追加
    this.changeQueue.push(change);
    this.status.pendingChanges = this.changeQueue.length;
    
    // キュー処理開始
    this.processQueue(config);
  }
  
  /**
   * 変更キューを処理
   */
  private async processQueue(config: SyncConfig): Promise<void> {
    if (this.processingQueue) return;
    this.processingQueue = true;
    
    try {
      while (this.changeQueue.length > 0) {
        const change = this.changeQueue.shift()!;
        await this.applyChangeToSheet(config, change);
        this.status.pendingChanges = this.changeQueue.length;
      }
    } finally {
      this.processingQueue = false;
    }
  }
  
  /**
   * 単一変更をシートに適用
   */
  private async applyChangeToSheet(config: SyncConfig, change: DatabaseChange): Promise<void> {
    const sheetConfig: SheetConfig = {
      spreadsheetId: config.spreadsheetId,
      sheetName: config.sheetName
    };
    
    try {
      switch (change.type) {
        case 'INSERT':
        case 'UPDATE':
          // IDで行を検索
          const rowIndex = await googleSheetsService.findRowById(
            sheetConfig,
            change.record.id
          );
          
          // 行データを生成
          const rowData: any[] = [];
          for (const col of config.columns) {
            let value = change.record[col.dbField];
            if (col.formatter) value = col.formatter(value);
            rowData.push(value ?? '');
          }
          
          if (rowIndex) {
            // 既存行を更新
            await googleSheetsService.updateRow(sheetConfig, rowIndex, rowData);
            console.log(`[RealtimeSync] Updated row ${rowIndex}`);
          } else {
            // 新規行を追加（末尾に追加）
            const data = await googleSheetsService.readSheet(sheetConfig);
            const newRowIndex = data.length + 1;
            await googleSheetsService.updateRow(sheetConfig, newRowIndex, rowData);
            console.log(`[RealtimeSync] Inserted row ${newRowIndex}`);
          }
          break;
          
        case 'DELETE':
          // 削除は行を空にする（行番号がずれるのを防ぐため）
          // 本番では行削除APIを使うか、定期的にフルシンクで整理
          const deleteRowIndex = await googleSheetsService.findRowById(
            sheetConfig,
            change.oldRecord?.id || change.record?.id
          );
          if (deleteRowIndex) {
            const emptyRow = config.columns.map(() => '');
            emptyRow[0] = '[DELETED]';
            await googleSheetsService.updateRow(sheetConfig, deleteRowIndex, emptyRow);
            console.log(`[RealtimeSync] Marked row ${deleteRowIndex} as deleted`);
          }
          break;
      }
      
      this.status.lastSyncAt = new Date();
    } catch (error: any) {
      console.error(`[RealtimeSync] Apply change error:`, error.message);
      this.status.errors.push(error.message);
    }
  }
  
  /**
   * シート変更をDBに反映（Webhook経由で呼び出し）
   */
  async applySheetChangeToDb(
    tableName: string,
    recordId: string | number,
    fieldName: string,
    newValue: any
  ): Promise<boolean> {
    if (!this.supabase) return false;
    
    try {
      const { error } = await this.supabase
        .from(tableName)
        .update({ 
          [fieldName]: newValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId);
      
      if (error) throw error;
      
      console.log(`[RealtimeSync] Updated DB: ${tableName}.${fieldName} = ${newValue}`);
      return true;
    } catch (error: any) {
      console.error('[RealtimeSync] DB update error:', error.message);
      return false;
    }
  }
  
  /**
   * ステータス取得
   */
  getStatus(): SyncStatus {
    return { ...this.status };
  }
  
  /**
   * 全同期を停止
   */
  async stopAll(): Promise<void> {
    for (const [key, channel] of this.channels) {
      await channel.unsubscribe();
    }
    this.channels.clear();
    this.syncConfigs.clear();
    this.status.isConnected = false;
    console.log('[RealtimeSync] All syncs stopped');
  }
}

// シングルトンインスタンス
export const realtimeSyncManager = new RealtimeSyncManager();
export default realtimeSyncManager;

// ============================================================
// 便利関数
// ============================================================

/**
 * products_master の同期を開始
 */
export async function startProductsSync(spreadsheetId: string, sheetName = 'Products'): Promise<boolean> {
  await realtimeSyncManager.initialize();
  return realtimeSyncManager.startSync({
    spreadsheetId,
    tableName: 'products_master',
    sheetName,
    columns: PRODUCTS_MASTER_COLUMNS,
    enableRealtime: true
  });
}

/**
 * inventory_master の同期を開始
 */
export async function startInventorySync(spreadsheetId: string, sheetName = 'Inventory'): Promise<boolean> {
  await realtimeSyncManager.initialize();
  return realtimeSyncManager.startSync({
    spreadsheetId,
    tableName: 'inventory_master',
    sheetName,
    columns: INVENTORY_MASTER_COLUMNS,
    enableRealtime: true
  });
}
