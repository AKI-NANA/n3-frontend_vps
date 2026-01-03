// app/api/sync/spreadsheet/route.ts
/**
 * スプレッドシート動的同期API v2
 * 
 * 機能:
 * - 全カラム自動検出・同期
 * - 画像URL対応
 * - カラム追加対応
 * 
 * @version 2.0.0
 * @date 2025-12-21
 */

import { NextResponse } from 'next/server';
import { dynamicSyncManager, DynamicSyncConfig } from '@/lib/services/spreadsheet/dynamic-sync';

// ============================================================
// GET: ステータス・カラム情報取得
// ============================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableName = searchParams.get('table');
    const sheetName = searchParams.get('sheet');
    
    // カラム情報取得
    if (tableName && sheetName) {
      const columns = dynamicSyncManager.getColumns(tableName, sheetName);
      return NextResponse.json({
        success: true,
        tableName,
        sheetName,
        columns,
        columnCount: columns.length
      });
    }
    
    return NextResponse.json({
      success: true,
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// POST: 同期開始/フルシンク/カラム追加
// ============================================================

interface SyncRequest {
  action: 'start' | 'full_sync' | 'stop' | 'add_column';
  spreadsheetId: string;
  sheetName?: string;
  tableName?: string;
  
  // オプション設定
  excludeColumns?: string[];
  readOnlyColumns?: string[];
  syncImages?: boolean;
  
  // カラム追加用
  columnName?: string;
  defaultValue?: any;
}

export async function POST(request: Request) {
  try {
    const body: SyncRequest = await request.json();
    const { 
      action, 
      spreadsheetId, 
      sheetName = 'Sheet1',
      tableName = 'products_master',
      excludeColumns,
      readOnlyColumns,
      syncImages = true,
      columnName,
      defaultValue
    } = body;
    
    if (!spreadsheetId) {
      return NextResponse.json(
        { success: false, error: 'spreadsheetId is required' },
        { status: 400 }
      );
    }
    
    const config: DynamicSyncConfig = {
      spreadsheetId,
      sheetName,
      tableName,
      excludeColumns,
      readOnlyColumns,
      syncImages,
      autoCreateColumns: true
    };
    
    let result: any = { success: false };
    
    switch (action) {
      case 'start':
        await dynamicSyncManager.initialize();
        const started = await dynamicSyncManager.startSync(config);
        result = {
          success: started,
          message: started ? '同期を開始しました' : '同期開始に失敗しました',
          columns: dynamicSyncManager.getColumns(tableName, sheetName)
        };
        break;
        
      case 'full_sync':
        await dynamicSyncManager.initialize();
        const syncResult = await dynamicSyncManager.fullSync(config);
        result = {
          success: syncResult.success,
          rowCount: syncResult.rowCount,
          columns: dynamicSyncManager.getColumns(tableName, sheetName)
        };
        break;
        
      case 'stop':
        await dynamicSyncManager.stopSync(tableName, sheetName);
        result = { success: true, message: '同期を停止しました' };
        break;
        
      case 'add_column':
        if (!columnName) {
          return NextResponse.json(
            { success: false, error: 'columnName is required' },
            { status: 400 }
          );
        }
        const added = await dynamicSyncManager.addColumn(config, columnName, defaultValue);
        result = {
          success: added,
          columnName,
          columns: dynamicSyncManager.getColumns(tableName, sheetName)
        };
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('[Sync API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT: シートからの変更を受信（Webhook）
// ============================================================

interface WebhookPayload {
  spreadsheetId: string;
  sheetName: string;
  tableName?: string;
  row: number;
  column: number;
  columnLetter: string;
  columnName: string;  // フィールド名
  recordId: string | number;
  newValue: any;
  oldValue?: any;
  timestamp?: string;
}

export async function PUT(request: Request) {
  try {
    const payload: WebhookPayload = await request.json();
    
    console.log('[Sync Webhook] Received:', {
      table: payload.tableName,
      sheet: payload.sheetName,
      id: payload.recordId,
      column: payload.columnName,
      value: payload.newValue
    });
    
    const { 
      sheetName, 
      tableName = 'products_master',
      recordId, 
      columnName,
      newValue 
    } = payload;
    
    if (!recordId || !columnName) {
      return NextResponse.json(
        { success: false, error: 'recordId and columnName are required' },
        { status: 400 }
      );
    }
    
    await dynamicSyncManager.initialize();
    
    const result = await dynamicSyncManager.applySheetChange(
      tableName,
      sheetName,
      recordId,
      columnName,
      newValue
    );
    
    return NextResponse.json({
      success: result,
      updated: {
        table: tableName,
        id: recordId,
        field: columnName,
        value: newValue
      }
    });
    
  } catch (error: any) {
    console.error('[Sync Webhook] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE: 全同期停止
// ============================================================

export async function DELETE() {
  try {
    await dynamicSyncManager.stopAll();
    return NextResponse.json({
      success: true,
      message: 'All syncs stopped'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
