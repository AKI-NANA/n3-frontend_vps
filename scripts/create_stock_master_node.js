// scripts/create_stock_master_node.js
// Node.jsでSupabase REST API経由でテーブル作成

const https = require('https');

const SUPABASE_URL = 'zdzfpucdyxdlavkgrvil.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkemZwdWNkeXhkbGF2a2dydmlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA0NjE2NSwiZXhwIjoyMDc0NjIyMTY1fQ.U91DMzI4MchkC1qPKA3nzrgn-rZtt1lYqvKQ3xeGu7Q';

// ダミーデータを挿入してテーブルを自動作成させる方法は使えないので、
// 代わりにSupabase CLIを使うか、直接ダッシュボードでSQL実行が必要

// inventory_masterのstock_master_idカラムが追加されているか確認
async function checkInventoryMasterColumns() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SUPABASE_URL,
      path: '/rest/v1/inventory_master?select=stock_master_id&limit=1',
      method: 'GET',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY,
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ exists: true, data: JSON.parse(data) });
        } else {
          resolve({ exists: false, error: data });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('=== Supabase テーブル状態確認 ===\n');
  
  // inventory_masterにstock_master_idカラムがあるか確認
  console.log('📊 inventory_master.stock_master_id カラム確認...');
  const result = await checkInventoryMasterColumns();
  
  if (result.exists) {
    console.log('✅ stock_master_id カラムは既に存在します（またはアクセス可能）');
  } else {
    console.log('❌ stock_master_id カラムが存在しないか、エラー:', result.error);
  }
  
  console.log('\n=================================================');
  console.log('📋 手動でSQLを実行する必要があります');
  console.log('=================================================\n');
  console.log('以下の方法のいずれかを使用してください:\n');
  
  console.log('【方法1】Supabase CLI');
  console.log('  brew install supabase/tap/supabase');
  console.log('  supabase login');
  console.log('  supabase db push --db-url "postgresql://postgres:[PASSWORD]@db.zdzfpucdyxdlavkgrvil.supabase.co:5432/postgres"\n');
  
  console.log('【方法2】Supabase Dashboard SQL Editor');
  console.log('  https://supabase.com/dashboard/project/zdzfpucdyxdlavkgrvil/sql/new\n');
  
  console.log('【方法3】pgAdmin または DBeaver などのGUIツール\n');
  
  console.log('実行するSQL:');
  console.log('─'.repeat(50));
  console.log(`
CREATE TABLE IF NOT EXISTS stock_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_code VARCHAR(50) UNIQUE NOT NULL,
    product_name TEXT NOT NULL,
    product_name_en TEXT,
    sku VARCHAR(100),
    physical_quantity INTEGER DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    cost_price_jpy NUMERIC(12, 2),
    supplier_name VARCHAR(255),
    supplier_url TEXT,
    condition_name VARCHAR(50),
    category VARCHAR(100),
    images JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE inventory_master 
ADD COLUMN IF NOT EXISTS stock_master_id UUID REFERENCES stock_master(id);

CREATE INDEX IF NOT EXISTS idx_stock_master_stock_code ON stock_master(stock_code);
CREATE INDEX IF NOT EXISTS idx_inventory_master_stock_master ON inventory_master(stock_master_id);
`);
  console.log('─'.repeat(50));
}

main().catch(console.error);
