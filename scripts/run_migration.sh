#!/bin/bash
# run_migration.sh
# N3 v2.0 DBマイグレーション実行スクリプト
#
# 使用方法:
#   chmod +x run_migration.sh
#   ./run_migration.sh

echo "🚀 N3 v2.0 DBマイグレーション開始..."
echo ""

# 環境変数読み込み
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | grep -v '^$' | xargs)
fi

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://zdzfpucdyxdlavkgrvil.supabase.co}"
SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SERVICE_KEY" ]; then
  echo "❌ SUPABASE_SERVICE_ROLE_KEY が設定されていません"
  exit 1
fi

echo "📡 Supabase URL: $SUPABASE_URL"
echo ""

# APIエンドポイント
API_URL="$SUPABASE_URL/rest/v1"

# 認証ヘッダー
AUTH_HEADERS="-H 'apikey: $SERVICE_KEY' -H 'Authorization: Bearer $SERVICE_KEY' -H 'Content-Type: application/json'"

echo "📋 Step 1: 既存カラム確認..."
EXISTING=$(curl -s "$API_URL/products_master?select=*&limit=1" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY")

if [ -z "$EXISTING" ] || [[ "$EXISTING" == *"error"* ]]; then
  echo "⚠️  products_master テーブルにアクセスできません"
  echo "$EXISTING"
else
  echo "✅ products_master テーブル確認OK"
fi

echo ""
echo "📋 Step 2: マイグレーションSQL実行..."
echo ""
echo "⚠️  このスクリプトはREST APIからはALTER TABLEを実行できません。"
echo ""
echo "以下のいずれかの方法で実行してください："
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "方法1: Supabase Dashboard (推奨)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. https://supabase.com/dashboard/project/zdzfpucdyxdlavkgrvil にアクセス"
echo "2. SQL Editor を開く"
echo "3. 以下のファイルの内容をコピペして実行:"
echo "   supabase/migrations/COPY_PASTE_MIGRATION.sql"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "方法2: psql コマンド"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "psql 'postgresql://postgres.zdzfpucdyxdlavkgrvil:YOUR_PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres' -f supabase/migrations/COPY_PASTE_MIGRATION.sql"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "方法3: Node.js スクリプト"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "node scripts/run_migration.js"
echo ""

# product_tags テーブルにデータ挿入を試行
echo "📋 Step 3: product_tags 初期データ挿入を試行..."

TAGS_DATA='[
  {"name":"高優先","color":"#ef4444","icon":"star"},
  {"name":"要確認","color":"#f59e0b","icon":"alert-triangle"},
  {"name":"完了","color":"#22c55e","icon":"check"},
  {"name":"保留","color":"#6b7280","icon":"pause"},
  {"name":"レア","color":"#8b5cf6","icon":"gem"},
  {"name":"人気","color":"#ec4899","icon":"heart"}
]'

RESULT=$(curl -s "$API_URL/product_tags" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -X POST \
  -d "$TAGS_DATA")

if [[ "$RESULT" == *"error"* ]] || [[ "$RESULT" == *"42P01"* ]]; then
  echo "⚠️  product_tags テーブルが存在しません（SQLで作成が必要）"
else
  echo "✅ product_tags データ挿入完了"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 完了"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
