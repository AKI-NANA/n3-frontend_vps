// app/api/inventory/setup-attributes/route.ts
/**
 * 属性カラムセットアップAPI
 * 
 * 実行内容:
 * 1. inventory_master テーブルに attr_l1, attr_l2, attr_l3, is_verified カラムを追加
 * 2. Supusi（スプレッドシート）に4カラムを追加
 * 
 * 使用方法:
 * POST /api/inventory/setup-attributes
 * { "spreadsheetId": "xxx", "sheetName": "Sheet1" }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 追加するカラム定義
const NEW_COLUMNS = [
  { name: 'attr_l1', type: 'VARCHAR(255)', default: 'NULL', description: 'Lv1属性（大分類）' },
  { name: 'attr_l2', type: 'VARCHAR(255)', default: 'NULL', description: 'Lv2属性（中分類）' },
  { name: 'attr_l3', type: 'VARCHAR(255)', default: 'NULL', description: 'Lv3属性（小分類）' },
  { name: 'is_verified', type: 'BOOLEAN', default: 'FALSE', description: '確定フラグ' },
];

export async function GET(request: NextRequest) {
  try {
    // 現在のカラム状態を確認
    const { data, error } = await supabase
      .from('inventory_master')
      .select('*')
      .limit(1);
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    const existingColumns = data && data.length > 0 ? Object.keys(data[0]) : [];
    const newColumnsStatus = NEW_COLUMNS.map(col => ({
      name: col.name,
      exists: existingColumns.includes(col.name),
      description: col.description
    }));
    
    return NextResponse.json({
      success: true,
      existingColumns,
      existingCount: existingColumns.length,
      newColumnsStatus,
      allNewColumnsExist: newColumnsStatus.every(c => c.exists),
      sqlToRun: newColumnsStatus.some(c => !c.exists) ? `
-- Supabase Dashboard > SQL Editor で実行してください

-- Step 1: カラム追加
ALTER TABLE inventory_master 
  ADD COLUMN IF NOT EXISTS attr_l1 VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS attr_l2 VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS attr_l3 VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Step 2: インデックス作成
CREATE INDEX IF NOT EXISTS idx_inventory_master_attr_l1 ON inventory_master(attr_l1) WHERE attr_l1 IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_inventory_master_attr_l2 ON inventory_master(attr_l2) WHERE attr_l2 IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_inventory_master_attr_l3 ON inventory_master(attr_l3) WHERE attr_l3 IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_inventory_master_is_verified ON inventory_master(is_verified) WHERE is_verified = TRUE;
CREATE INDEX IF NOT EXISTS idx_inventory_master_attr_composite ON inventory_master(attr_l1, attr_l2, attr_l3);
      ` : 'All columns already exist'
    });
  } catch (error: any) {
    console.error('[setup-attributes] GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { addToSheet = false, spreadsheetId, sheetName = 'Sheet1' } = body;
    
    const results: { step: string; success: boolean; message: string }[] = [];
    
    // ============================================================
    // Step 1: DBカラム確認
    // ============================================================
    
    const { data, error } = await supabase
      .from('inventory_master')
      .select('*')
      .limit(1);
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    const existingColumns = data && data.length > 0 ? Object.keys(data[0]) : [];
    const missingColumns = NEW_COLUMNS.filter(col => !existingColumns.includes(col.name));
    
    if (missingColumns.length > 0) {
      results.push({
        step: 'DB Columns',
        success: false,
        message: `Missing columns: ${missingColumns.map(c => c.name).join(', ')}. Run the SQL in Supabase Dashboard first.`
      });
    } else {
      results.push({
        step: 'DB Columns',
        success: true,
        message: 'All required columns exist in inventory_master'
      });
    }
    
    // ============================================================
    // Step 2: Supusiにカラムを追加（オプション）
    // ============================================================
    
    if (addToSheet && spreadsheetId) {
      try {
        const { dynamicSyncManager } = await import('@/lib/services/spreadsheet/dynamic-sync');
        await dynamicSyncManager.initialize();
        
        const config = {
          spreadsheetId,
          sheetName,
          tableName: 'inventory_master'
        };
        
        for (const col of NEW_COLUMNS) {
          const added = await dynamicSyncManager.addColumn(config, col.name, null);
          results.push({
            step: `Sheet: ${col.name}`,
            success: true,
            message: added ? `Column ${col.name} added to sheet` : `Column ${col.name} may already exist`
          });
        }
      } catch (sheetError: any) {
        results.push({
          step: 'Sheet',
          success: false,
          message: `Sheet error: ${sheetError.message}`
        });
      }
    }
    
    // ============================================================
    // Summary
    // ============================================================
    
    const allSuccess = results.every(r => r.success);
    
    return NextResponse.json({
      success: allSuccess,
      results,
      existingColumns,
      existingCount: existingColumns.length,
      nextSteps: missingColumns.length > 0 ? [
        '1. Supabase Dashboard > SQL Editor でSQLを実行',
        '2. このAPIを再度呼び出して確認',
        '3. addToSheet: true で Supusi にカラム追加'
      ] : [
        '1. Supusiシートで attr_l1, attr_l2, attr_l3, is_verified のヘッダーを追加',
        '2. 作業者がSupusiで属性を入力開始',
        '3. N3 UIでフィルターが動作するか確認'
      ]
    });
    
  } catch (error: any) {
    console.error('[setup-attributes] POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
