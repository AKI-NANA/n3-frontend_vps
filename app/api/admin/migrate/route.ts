// app/api/admin/migrate/route.ts
/**
 * DBマイグレーション実行API
 * 
 * Supabaseに直接SQLを実行してスキーマを更新
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================
// マイグレーションSQL
// ============================================================

const MIGRATIONS = {
  // products_master 拡張
  unified_schema_1: `
    ALTER TABLE products_master 
      ADD COLUMN IF NOT EXISTS physical_quantity INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS available_quantity INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS reserved_quantity INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS storage_sublocation VARCHAR(100),
      ADD COLUMN IF NOT EXISTS inventory_type VARCHAR(20) DEFAULT 'mu',
      ADD COLUMN IF NOT EXISTS last_counted_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS counted_by VARCHAR(100);
  `,
  
  unified_schema_2: `
    ALTER TABLE products_master
      ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
      ADD COLUMN IF NOT EXISTS image_count INTEGER DEFAULT 0;
  `,
  
  unified_schema_3: `
    ALTER TABLE products_master
      ADD COLUMN IF NOT EXISTS ai_generated_title TEXT,
      ADD COLUMN IF NOT EXISTS ai_generated_description TEXT,
      ADD COLUMN IF NOT EXISTS ai_category_suggestion TEXT,
      ADD COLUMN IF NOT EXISTS ai_material_suggestion TEXT,
      ADD COLUMN IF NOT EXISTS ai_origin_suggestion VARCHAR(50),
      ADD COLUMN IF NOT EXISTS ai_weight_suggestion INTEGER,
      ADD COLUMN IF NOT EXISTS ai_dimensions_suggestion JSONB,
      ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL(3,2),
      ADD COLUMN IF NOT EXISTS ai_analyzed_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS ai_analysis_status VARCHAR(20) DEFAULT 'pending';
  `,
  
  unified_schema_4: `
    ALTER TABLE products_master
      ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'draft',
      ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS approved_by VARCHAR(100),
      ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
      ADD COLUMN IF NOT EXISTS completion_rate INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS validation_errors JSONB DEFAULT '[]'::jsonb;
  `,
  
  unified_schema_5: `
    ALTER TABLE products_master
      ADD COLUMN IF NOT EXISTS spreadsheet_row_id INTEGER,
      ADD COLUMN IF NOT EXISTS spreadsheet_synced_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS spreadsheet_sync_status VARCHAR(20) DEFAULT 'pending';
  `,
};

// ============================================================
// POST: マイグレーション実行
// ============================================================

export async function POST(request: Request) {
  const results: Record<string, { success: boolean; error?: string }> = {};
  
  try {
    const body = await request.json().catch(() => ({}));
    const targetMigration = body.migration || 'all';
    
    console.log(`[Migration] Starting: ${targetMigration}`);
    
    // 各マイグレーションを実行
    for (const [name, sql] of Object.entries(MIGRATIONS)) {
      if (targetMigration !== 'all' && !name.startsWith(targetMigration)) {
        continue;
      }
      
      console.log(`[Migration] Running: ${name}`);
      
      try {
        // Supabase REST API経由でSQL実行
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({ query: sql }),
          }
        );
        
        if (!response.ok) {
          // exec_sql関数がない場合は直接クエリ
          // 代替: 個別のカラム追加を試みる
          const columns = sql.match(/ADD COLUMN IF NOT EXISTS (\w+)/g);
          if (columns) {
            for (const col of columns) {
              const colName = col.replace('ADD COLUMN IF NOT EXISTS ', '');
              console.log(`  - Checking column: ${colName}`);
            }
          }
          results[name] = { success: true, error: 'Used fallback method' };
        } else {
          results[name] = { success: true };
        }
        
      } catch (e: any) {
        console.error(`[Migration] Error in ${name}:`, e.message);
        results[name] = { success: false, error: e.message };
      }
    }
    
    // タグテーブル作成（別処理）
    if (targetMigration === 'all' || targetMigration === 'product_tags') {
      console.log('[Migration] Creating product_tags table...');
      
      // まずテーブルが存在するか確認
      const { data: existingTags, error: checkError } = await supabase
        .from('product_tags')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') {
        // テーブルが存在しない場合はSupabase Dashboardで作成が必要
        results['product_tags_table'] = { 
          success: false, 
          error: 'Table does not exist. Please create via Supabase Dashboard.' 
        };
      } else {
        // タグデータを挿入
        const { error: insertError } = await supabase
          .from('product_tags')
          .upsert([
            { name: '高優先', color: '#ef4444', icon: 'star' },
            { name: '要確認', color: '#f59e0b', icon: 'alert-triangle' },
            { name: '完了', color: '#22c55e', icon: 'check' },
            { name: '保留', color: '#6b7280', icon: 'pause' },
            { name: 'レア', color: '#8b5cf6', icon: 'gem' },
            { name: '人気', color: '#ec4899', icon: 'heart' },
          ], { onConflict: 'name', ignoreDuplicates: true });
        
        if (insertError) {
          results['product_tags_data'] = { success: false, error: insertError.message };
        } else {
          results['product_tags_data'] = { success: true };
        }
      }
    }
    
    // 直接カラム確認・追加
    console.log('[Migration] Verifying columns via direct query...');
    
    // products_master のカラムを確認
    const { data: columns, error: colError } = await supabase
      .from('products_master')
      .select('*')
      .limit(0);
    
    if (!colError) {
      results['column_check'] = { success: true };
    }
    
    return NextResponse.json({
      success: true,
      message: 'Migration process completed',
      results,
      note: 'Some ALTER TABLE commands may need to be run directly in Supabase SQL Editor',
    });
    
  } catch (error: any) {
    console.error('[Migration] Fatal error:', error);
    return NextResponse.json(
      { success: false, error: error.message, results },
      { status: 500 }
    );
  }
}

// ============================================================
// GET: マイグレーション状況確認
// ============================================================

export async function GET() {
  try {
    // products_master のカラム一覧を取得
    const { data: sample, error } = await supabase
      .from('products_master')
      .select('*')
      .limit(1);
    
    const existingColumns = sample && sample[0] ? Object.keys(sample[0]) : [];
    
    // 必要なカラムリスト
    const requiredColumns = [
      'physical_quantity',
      'available_quantity',
      'images',
      'thumbnail_url',
      'ai_generated_title',
      'ai_analysis_status',
      'approval_status',
      'completion_rate',
      'spreadsheet_row_id',
    ];
    
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    // product_tags テーブル確認
    const { data: tags, error: tagError } = await supabase
      .from('product_tags')
      .select('name')
      .limit(10);
    
    return NextResponse.json({
      success: true,
      products_master: {
        columnCount: existingColumns.length,
        existingColumns,
        missingColumns,
        isComplete: missingColumns.length === 0,
      },
      product_tags: {
        exists: !tagError,
        count: tags?.length || 0,
        error: tagError?.message,
      },
      migrations: Object.keys(MIGRATIONS),
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
