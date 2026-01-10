#!/bin/bash
# AI強化カラム追加マイグレーション実行スクリプト

SUPABASE_URL="https://zdzfpucdyxdlavkgrvil.supabase.co"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkemZwdWNkeXhkbGF2a2dydmlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA0NjE2NSwiZXhwIjoyMDc0NjIyMTY1fQ.U91DMzI4MchkC1qPKA3nzrgn-rZtt1lYqvKQ3xeGu7Q"

echo "=== AI強化カラム追加マイグレーション ==="
echo ""

# カラム追加SQLを実行（Supabase REST API経由）
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "ALTER TABLE products_master ADD COLUMN IF NOT EXISTS title_en TEXT; ALTER TABLE products_master ADD COLUMN IF NOT EXISTS english_title TEXT; ALTER TABLE products_master ADD COLUMN IF NOT EXISTS hts_code VARCHAR(20); ALTER TABLE products_master ADD COLUMN IF NOT EXISTS hts_duty_rate NUMERIC(6,4); ALTER TABLE products_master ADD COLUMN IF NOT EXISTS hts_candidates JSONB; ALTER TABLE products_master ADD COLUMN IF NOT EXISTS origin_country VARCHAR(2); ALTER TABLE products_master ADD COLUMN IF NOT EXISTS origin_country_name VARCHAR(100); ALTER TABLE products_master ADD COLUMN IF NOT EXISTS origin_country_duty_rate NUMERIC(6,4); ALTER TABLE products_master ADD COLUMN IF NOT EXISTS ddp_price_usd NUMERIC(10,2); ALTER TABLE products_master ADD COLUMN IF NOT EXISTS profit_amount_usd NUMERIC(10,2); ALTER TABLE products_master ADD COLUMN IF NOT EXISTS profit_margin NUMERIC(5,4); ALTER TABLE products_master ADD COLUMN IF NOT EXISTS shipping_cost_usd NUMERIC(10,2); ALTER TABLE products_master ADD COLUMN IF NOT EXISTS ai_enriched_at TIMESTAMPTZ;"
  }'

echo ""
echo "完了"
