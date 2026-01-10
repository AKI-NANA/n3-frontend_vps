// scripts/run_ai_enrichment_migration.js
// AI強化カラム追加マイグレーション実行スクリプト

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zdzfpucdyxdlavkgrvil.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkemZwdWNkeXhkbGF2a2dydmlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA0NjE2NSwiZXhwIjoyMDc0NjIyMTY1fQ.U91DMzI4MchkC1qPKA3nzrgn-rZtt1lYqvKQ3xeGu7Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigration() {
  console.log('=== AI強化カラム追加マイグレーション ===\n');

  // 各カラムを個別に追加（エラーが出ても続行）
  const columns = [
    { name: 'title_en', type: 'TEXT' },
    { name: 'english_title', type: 'TEXT' },
    { name: 'hts_code', type: 'VARCHAR(20)' },
    { name: 'hts_duty_rate', type: 'NUMERIC(6,4)' },
    { name: 'hts_candidates', type: 'JSONB' },
    { name: 'origin_country', type: 'VARCHAR(2)' },
    { name: 'origin_country_name', type: 'VARCHAR(100)' },
    { name: 'origin_country_duty_rate', type: 'NUMERIC(6,4)' },
    { name: 'ddp_price_usd', type: 'NUMERIC(10,2)' },
    { name: 'profit_amount_usd', type: 'NUMERIC(10,2)' },
    { name: 'profit_margin', type: 'NUMERIC(5,4)' },
    { name: 'shipping_cost_usd', type: 'NUMERIC(10,2)' },
    { name: 'ai_enriched_at', type: 'TIMESTAMPTZ' },
  ];

  // まず現在のカラムを確認
  console.log('現在のproducts_masterカラムを確認中...\n');
  
  const { data: existingData, error: selectError } = await supabase
    .from('products_master')
    .select('*')
    .limit(1);

  if (selectError) {
    console.error('テーブル確認エラー:', selectError.message);
    return;
  }

  const existingColumns = existingData && existingData[0] ? Object.keys(existingData[0]) : [];
  console.log(`既存カラム数: ${existingColumns.length}`);
  
  // 必要なカラムが存在するか確認
  const missingColumns = columns.filter(col => !existingColumns.includes(col.name));
  
  if (missingColumns.length === 0) {
    console.log('\n✅ 全ての必要なカラムが既に存在しています！');
    
    // 確認のため各カラムの存在をチェック
    console.log('\n=== カラム存在確認 ===');
    for (const col of columns) {
      const exists = existingColumns.includes(col.name);
      console.log(`  ${exists ? '✅' : '❌'} ${col.name}`);
    }
    return;
  }

  console.log(`\n追加が必要なカラム: ${missingColumns.length}件`);
  missingColumns.forEach(col => console.log(`  - ${col.name} (${col.type})`));

  console.log('\n⚠️ Supabase JS Clientではカラム追加のDDLを直接実行できません。');
  console.log('以下のSQLをSupabase SQL Editorで実行してください:\n');
  
  console.log('----------------------------------------');
  for (const col of missingColumns) {
    console.log(`ALTER TABLE products_master ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};`);
  }
  console.log('----------------------------------------');
  
  // 代替案：テスト用にデータを更新してみる
  console.log('\n代替案: 既存カラムへの書き込みテストを実行...');
  
  // 1件取得してテスト更新
  const { data: testRow } = await supabase
    .from('products_master')
    .select('id, title, english_title, hts_code, ddp_price_usd')
    .limit(1)
    .single();

  if (testRow) {
    console.log('\nテストデータ:');
    console.log(`  ID: ${testRow.id}`);
    console.log(`  Title: ${testRow.title?.slice(0, 50)}...`);
    console.log(`  English Title: ${testRow.english_title || '(未設定)'}`);
    console.log(`  HTS Code: ${testRow.hts_code || '(未設定)'}`);
    console.log(`  DDP Price: ${testRow.ddp_price_usd || '(未設定)'}`);
  }
}

runMigration().catch(console.error);
