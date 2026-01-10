#!/bin/bash
# =============================================================
# Supabase SQL実行スクリプト
# inventory_type のデフォルト値設定
# =============================================================

SUPABASE_URL="https://zdzfpucdyxdlavkgrvil.supabase.co"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkemZwdWNkeXhkbGF2a2dydmlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA0NjE2NSwiZXhwIjoyMDc0NjIyMTY1fQ.U91DMzI4MchkC1qPKA3nzrgn-rZtt1lYqvKQ3xeGu7Q"

echo "=== Supabase SQL実行 ==="
echo ""

# Step 1: 現在の状態を確認
echo "📊 Step 1: 現在のinventory_type分布を確認..."
curl -s "${SUPABASE_URL}/rest/v1/rpc/execute_sql" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT inventory_type, COUNT(*) as count FROM inventory_master GROUP BY inventory_type"}' \
  2>/dev/null || echo "RPC not available, using direct REST API..."

echo ""
echo "📊 inventory_masterの総数を確認..."
TOTAL=$(curl -s "${SUPABASE_URL}/rest/v1/inventory_master?select=id" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Prefer: count=exact" \
  -H "Range: 0-0" \
  -I 2>/dev/null | grep -i "content-range" | sed 's/.*\///')
echo "総数: ${TOTAL:-不明}"

echo ""
echo "📊 inventory_type=nullの件数を確認..."
NULL_COUNT=$(curl -s "${SUPABASE_URL}/rest/v1/inventory_master?select=id&inventory_type=is.null" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Prefer: count=exact" \
  -H "Range: 0-0" \
  -I 2>/dev/null | grep -i "content-range" | sed 's/.*\///')
echo "NULL件数: ${NULL_COUNT:-不明}"

echo ""
echo "==================================================="
echo "📝 Step 2: inventory_type を 'mu' にデフォルト設定"
echo "==================================================="
echo ""
echo "これにより、全ての未設定レコードが「無在庫」に分類されます。"
echo "その後、マスタータブで確認して「有在庫」に切り替えてください。"
echo ""
read -p "実行しますか？ (y/N): " confirm

if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
  echo ""
  echo "🔄 更新実行中..."
  
  # PATCH リクエストで更新
  RESULT=$(curl -s -X PATCH "${SUPABASE_URL}/rest/v1/inventory_master?inventory_type=is.null" \
    -H "apikey: ${SUPABASE_SERVICE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    -d '{"inventory_type": "mu"}')
  
  echo ""
  echo "✅ 更新完了"
  echo ""
  
  # 更新後の確認
  echo "📊 更新後のinventory_type分布..."
  echo ""
  
  STOCK_COUNT=$(curl -s "${SUPABASE_URL}/rest/v1/inventory_master?select=id&inventory_type=eq.stock" \
    -H "apikey: ${SUPABASE_SERVICE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
    -H "Prefer: count=exact" \
    -H "Range: 0-0" \
    -I 2>/dev/null | grep -i "content-range" | sed 's/.*\///')
  
  MU_COUNT=$(curl -s "${SUPABASE_URL}/rest/v1/inventory_master?select=id&inventory_type=eq.mu" \
    -H "apikey: ${SUPABASE_SERVICE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
    -H "Prefer: count=exact" \
    -H "Range: 0-0" \
    -I 2>/dev/null | grep -i "content-range" | sed 's/.*\///')
  
  NULL_AFTER=$(curl -s "${SUPABASE_URL}/rest/v1/inventory_master?select=id&inventory_type=is.null" \
    -H "apikey: ${SUPABASE_SERVICE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
    -H "Prefer: count=exact" \
    -H "Range: 0-0" \
    -I 2>/dev/null | grep -i "content-range" | sed 's/.*\///')
  
  echo "有在庫 (stock): ${STOCK_COUNT:-0}"
  echo "無在庫 (mu): ${MU_COUNT:-0}"
  echo "未設定 (null): ${NULL_AFTER:-0}"
  echo ""
  echo "✅ 完了！ブラウザでマスタータブを確認してください。"
  
else
  echo "キャンセルしました。"
fi

echo ""
