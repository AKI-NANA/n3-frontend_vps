/**
 * DBマイグレーション実行スクリプト
 * marketplace_listings JSONB カラムを追加
 * 
 * 実行方法: npx ts-node scripts/run-migration-marketplace-listings.ts
 * または: node -r ts-node/register scripts/run-migration-marketplace-listings.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function runMigration() {
  console.log('🚀 Starting migration: Add marketplace_listings JSONB column...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. カラムが存在するか確認
  const { data: columns, error: checkError } = await supabase
    .from('products_master')
    .select('marketplace_listings')
    .limit(1);

  if (!checkError) {
    console.log('✅ Column marketplace_listings already exists');
    return;
  }

  // 2. カラムを追加（Supabase SQL Editor経由で実行が必要）
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  以下のSQLをSupabase SQL Editorで実行してください:               ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ALTER TABLE products_master                                     ║
║  ADD COLUMN IF NOT EXISTS marketplace_listings JSONB             ║
║  DEFAULT '{}'::jsonb;                                            ║
║                                                                  ║
║  CREATE INDEX IF NOT EXISTS idx_products_marketplace_listings    ║
║  ON products_master USING GIN (marketplace_listings);            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

Supabase Dashboard: https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql
  `);
}

// 直接実行時
if (require.main === module) {
  runMigration()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}

export { runMigration };
