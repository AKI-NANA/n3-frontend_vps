#!/bin/bash
# =============================================================
# PostgreSQL直接接続でstock_masterテーブル作成
# =============================================================

# Supabase PostgreSQL接続情報
export PGPASSWORD="Emverze0423"
PGHOST="db.zdzfpucdyxdlavkgrvil.supabase.co"
PGPORT="5432"
PGDATABASE="postgres"
PGUSER="postgres"

echo "=== PostgreSQL直接接続でSQLを実行 ==="
echo ""

# psqlがインストールされているか確認
if ! command -v psql &> /dev/null; then
    echo "❌ psqlコマンドが見つかりません"
    echo ""
    echo "Homebrewでインストール:"
    echo "  brew install postgresql"
    echo ""
    echo "または、Node.jsのpgパッケージを使用します..."
    
    # Node.jsで実行
    cd /Users/aritahiroaki/n3-frontend_new
    
    # pgパッケージがなければインストール
    npm list pg > /dev/null 2>&1 || npm install pg --save-dev
    
    node -e "
const { Client } = require('pg');

const client = new Client({
  host: 'db.zdzfpucdyxdlavkgrvil.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Emverze0423',
  ssl: { rejectUnauthorized: false }
});

const sql = \`
-- stock_master テーブル作成
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

-- inventory_master に stock_master_id カラム追加
ALTER TABLE inventory_master 
ADD COLUMN IF NOT EXISTS stock_master_id UUID REFERENCES stock_master(id);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_stock_master_stock_code ON stock_master(stock_code);
CREATE INDEX IF NOT EXISTS idx_inventory_master_stock_master ON inventory_master(stock_master_id);
\`;

async function main() {
  try {
    console.log('🔌 PostgreSQLに接続中...');
    await client.connect();
    console.log('✅ 接続成功');
    
    console.log('\\n📝 SQLを実行中...');
    await client.query(sql);
    console.log('✅ SQL実行完了');
    
    // 確認
    const result = await client.query(\"SELECT table_name FROM information_schema.tables WHERE table_name = 'stock_master'\");
    if (result.rows.length > 0) {
      console.log('\\n✅ stock_master テーブルが作成されました！');
    } else {
      console.log('\\n❌ テーブル作成に失敗した可能性があります');
    }
    
    // inventory_masterのカラム確認
    const colResult = await client.query(\"SELECT column_name FROM information_schema.columns WHERE table_name = 'inventory_master' AND column_name = 'stock_master_id'\");
    if (colResult.rows.length > 0) {
      console.log('✅ inventory_master.stock_master_id カラムが追加されました！');
    }
    
  } catch (err) {
    console.error('❌ エラー:', err.message);
  } finally {
    await client.end();
  }
}

main();
"
    exit 0
fi

# psqlが使える場合
echo "📝 SQLを実行中..."

psql -h "$PGHOST" -p "$PGPORT" -d "$PGDATABASE" -U "$PGUSER" << 'EOSQL'
-- stock_master テーブル作成
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

-- inventory_master に stock_master_id カラム追加
ALTER TABLE inventory_master 
ADD COLUMN IF NOT EXISTS stock_master_id UUID REFERENCES stock_master(id);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_stock_master_stock_code ON stock_master(stock_code);
CREATE INDEX IF NOT EXISTS idx_inventory_master_stock_master ON inventory_master(stock_master_id);

-- 確認
SELECT 'stock_master テーブル作成完了' AS result;
\dt stock_master
EOSQL

echo ""
echo "✅ 完了"
