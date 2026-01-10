#!/bin/bash
# =============================================================
# Supabase Management API経由でstock_masterテーブル作成
# =============================================================

SUPABASE_ACCESS_TOKEN="sbp_d495f5f82c337426e9d6c8d2377c3d881fb29c23"
PROJECT_REF="zdzfpucdyxdlavkgrvil"

SQL_QUERY=$(cat << 'EOSQL'
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
EOSQL
)

echo "=== Supabase Management API経由でSQLを実行 ==="
echo ""
echo "実行するSQL:"
echo "$SQL_QUERY"
echo ""
echo "----------------------------------------"

# Management API経由でSQL実行
curl -s -X POST "https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$(echo "$SQL_QUERY" | tr '\n' ' ' | sed 's/"/\\"/g')\"}"

echo ""
echo ""
echo "----------------------------------------"
echo "完了。結果を確認してください。"
