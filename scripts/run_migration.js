// scripts/run_migration.js
/**
 * N3 v2.0 DBマイグレーション実行スクリプト
 * 
 * 使用方法:
 *   node scripts/run_migration.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ 環境変数が設定されていません');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', SERVICE_KEY ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// カラム追加SQL（1つずつ実行）
const COLUMN_ADDITIONS = [
  // 在庫管理
  { name: 'physical_quantity', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS physical_quantity INTEGER DEFAULT 0" },
  { name: 'available_quantity', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS available_quantity INTEGER DEFAULT 0" },
  { name: 'reserved_quantity', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS reserved_quantity INTEGER DEFAULT 0" },
  { name: 'storage_sublocation', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS storage_sublocation VARCHAR(100)" },
  { name: 'inventory_type', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS inventory_type VARCHAR(20) DEFAULT 'mu'" },
  { name: 'last_counted_at', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS last_counted_at TIMESTAMPTZ" },
  { name: 'counted_by', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS counted_by VARCHAR(100)" },
  
  // 画像
  { name: 'images', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb" },
  { name: 'thumbnail_url', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS thumbnail_url TEXT" },
  { name: 'image_count', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS image_count INTEGER DEFAULT 0" },
  
  // AI解析
  { name: 'ai_generated_title', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS ai_generated_title TEXT" },
  { name: 'ai_generated_description', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS ai_generated_description TEXT" },
  { name: 'ai_category_suggestion', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS ai_category_suggestion TEXT" },
  { name: 'ai_material_suggestion', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS ai_material_suggestion TEXT" },
  { name: 'ai_origin_suggestion', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS ai_origin_suggestion VARCHAR(50)" },
  { name: 'ai_weight_suggestion', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS ai_weight_suggestion INTEGER" },
  { name: 'ai_dimensions_suggestion', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS ai_dimensions_suggestion JSONB" },
  { name: 'ai_confidence', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL(3,2)" },
  { name: 'ai_analyzed_at', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS ai_analyzed_at TIMESTAMPTZ" },
  { name: 'ai_analysis_status', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS ai_analysis_status VARCHAR(20) DEFAULT 'pending'" },
  
  // 承認フロー
  { name: 'approval_status', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'draft'" },
  { name: 'approved_at', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ" },
  { name: 'approved_by', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS approved_by VARCHAR(100)" },
  { name: 'rejection_reason', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS rejection_reason TEXT" },
  { name: 'completion_rate', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS completion_rate INTEGER DEFAULT 0" },
  { name: 'validation_errors', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS validation_errors JSONB DEFAULT '[]'::jsonb" },
  
  // スプレッドシート
  { name: 'spreadsheet_row_id', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS spreadsheet_row_id INTEGER" },
  { name: 'spreadsheet_synced_at', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS spreadsheet_synced_at TIMESTAMPTZ" },
  { name: 'spreadsheet_sync_status', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS spreadsheet_sync_status VARCHAR(20) DEFAULT 'pending'" },
  
  // SM参照
  { name: 'sm_reference_id', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS sm_reference_id TEXT" },
  { name: 'sm_reference_price', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS sm_reference_price DECIMAL(10,2)" },
  { name: 'sm_confidence', sql: "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS sm_confidence DECIMAL(3,2)" },
];

async function runMigration() {
  console.log('🚀 N3 v2.0 DBマイグレーション開始...\n');
  console.log(`📡 Supabase URL: ${SUPABASE_URL}\n`);
  
  // Step 1: 既存カラム確認
  console.log('📋 Step 1: 既存カラム確認...');
  const { data: sample, error: sampleError } = await supabase
    .from('products_master')
    .select('*')
    .limit(1);
  
  if (sampleError) {
    console.error('❌ products_master アクセスエラー:', sampleError.message);
    return;
  }
  
  const existingColumns = sample && sample[0] ? Object.keys(sample[0]) : [];
  console.log(`   既存カラム数: ${existingColumns.length}`);
  
  // 不足カラムを確認
  const missingColumns = COLUMN_ADDITIONS.filter(
    col => !existingColumns.includes(col.name)
  );
  
  console.log(`   追加が必要なカラム: ${missingColumns.length}\n`);
  
  if (missingColumns.length === 0) {
    console.log('✅ すべてのカラムは既に存在します\n');
  } else {
    console.log('📋 Step 2: カラム追加...');
    console.log('');
    console.log('⚠️  Supabase REST APIではALTER TABLEは実行できません。');
    console.log('   以下のSQLをSupabase SQL Editorで実行してください:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    for (const col of missingColumns) {
      console.log(col.sql + ';');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
  
  // Step 3: product_tags テーブル確認
  console.log('📋 Step 3: product_tags テーブル確認...');
  const { data: tags, error: tagError } = await supabase
    .from('product_tags')
    .select('name')
    .limit(10);
  
  if (tagError) {
    console.log('⚠️  product_tags テーブルが存在しません');
    console.log('   以下のSQLをSupabase SQL Editorで実行してください:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`
CREATE TABLE IF NOT EXISTS product_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(20) DEFAULT '#6366f1',
  icon VARCHAR(50),
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products_master_tags (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL REFERENCES product_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, tag_id)
);

INSERT INTO product_tags (name, color, icon) VALUES
  ('高優先', '#ef4444', 'star'),
  ('要確認', '#f59e0b', 'alert-triangle'),
  ('完了', '#22c55e', 'check'),
  ('保留', '#6b7280', 'pause'),
  ('レア', '#8b5cf6', 'gem'),
  ('人気', '#ec4899', 'heart')
ON CONFLICT (name) DO NOTHING;
`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } else {
    console.log(`✅ product_tags テーブル確認OK (${tags?.length || 0} タグ)\n`);
    
    // タグが空なら初期データ挿入
    if (!tags || tags.length === 0) {
      console.log('   初期タグデータを挿入中...');
      const { error: insertError } = await supabase
        .from('product_tags')
        .upsert([
          { name: '高優先', color: '#ef4444', icon: 'star' },
          { name: '要確認', color: '#f59e0b', icon: 'alert-triangle' },
          { name: '完了', color: '#22c55e', icon: 'check' },
          { name: '保留', color: '#6b7280', icon: 'pause' },
          { name: 'レア', color: '#8b5cf6', icon: 'gem' },
          { name: '人気', color: '#ec4899', icon: 'heart' },
        ], { onConflict: 'name' });
      
      if (insertError) {
        console.log('   ⚠️  タグ挿入エラー:', insertError.message);
      } else {
        console.log('   ✅ 初期タグデータ挿入完了');
      }
    }
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 マイグレーション確認完了');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

runMigration().catch(console.error);
