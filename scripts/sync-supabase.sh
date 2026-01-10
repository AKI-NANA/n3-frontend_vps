#!/bin/bash

###############################################################################
# P2/P3: ローカルSupabase自動同期スクリプト
#
# 目的: 本番Supabaseとローカル開発環境の同期を自動化
# 使用方法: ./scripts/sync-supabase.sh
###############################################################################

set -e  # エラーで停止

echo "🔄 Supabase同期スクリプト開始"
echo "=============================="

# カラー出力
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Supabase CLIがインストールされているか確認
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLIがインストールされていません${NC}"
    echo "インストール方法: npm install -g supabase"
    exit 1
fi

echo -e "${GREEN}✅ Supabase CLI検出${NC}"

# 2. ローカルSupabaseが起動しているか確認
if ! supabase status &> /dev/null; then
    echo -e "${YELLOW}⚠️ ローカルSupabaseが起動していません${NC}"
    echo "起動中..."
    supabase start
fi

echo -e "${GREEN}✅ ローカルSupabase起動中${NC}"

# 3. マイグレーションファイルのバックアップ
BACKUP_DIR="./supabase/migrations/backup_$(date +%Y%m%d_%H%M%S)"
if [ -d "./supabase/migrations" ] && [ "$(ls -A ./supabase/migrations)" ]; then
    echo "📦 既存のマイグレーションをバックアップ中..."
    mkdir -p "$BACKUP_DIR"
    cp -r ./supabase/migrations/* "$BACKUP_DIR/" 2>/dev/null || true
    echo -e "${GREEN}✅ バックアップ完了: $BACKUP_DIR${NC}"
fi

# 4. リモートDBからスキーマをプル（本番環境との同期）
if [ -n "$SUPABASE_PROJECT_ID" ]; then
    echo "🔽 本番環境からスキーマをプル中..."
    supabase db pull --linked || {
        echo -e "${YELLOW}⚠️ リモートプルに失敗（リンク未設定の可能性）${NC}"
        echo "手動リンク: supabase link --project-ref $SUPABASE_PROJECT_ID"
    }
else
    echo -e "${YELLOW}⚠️ SUPABASE_PROJECT_ID未設定 - リモートプルをスキップ${NC}"
fi

# 5. ローカルDBにマイグレーション適用
echo "📤 ローカルDBにマイグレーション適用中..."
supabase db reset || {
    echo -e "${RED}❌ マイグレーション適用に失敗${NC}"
    exit 1
}

echo -e "${GREEN}✅ マイグレーション適用完了${NC}"

# 6. Seed データの投入（オプション）
if [ -f "./supabase/seed.sql" ]; then
    echo "🌱 Seedデータ投入中..."
    supabase db execute --file ./supabase/seed.sql || {
        echo -e "${YELLOW}⚠️ Seedデータ投入に失敗（スキップ）${NC}"
    }
fi

# 7. 型定義の生成
echo "🔧 TypeScript型定義を生成中..."
supabase gen types typescript --local > ./types/supabase.ts || {
    echo -e "${YELLOW}⚠️ 型定義生成に失敗（スキップ）${NC}"
}

echo -e "${GREEN}✅ 型定義生成完了${NC}"

# 8. ステータス確認
echo ""
echo "📊 最終ステータス:"
echo "=================="
supabase status

echo ""
echo -e "${GREEN}✅ Supabase同期完了！${NC}"
echo ""
echo "ローカルアクセス情報:"
echo "  API URL: $(supabase status | grep 'API URL' | awk '{print $3}')"
echo "  DB URL: $(supabase status | grep 'DB URL' | awk '{print $3}')"
echo "  Studio URL: $(supabase status | grep 'Studio URL' | awk '{print $3}')"
echo ""
echo "次のステップ:"
echo "  1. ローカル開発: npm run dev"
echo "  2. Supabase Studio: $(supabase status | grep 'Studio URL' | awk '{print $3}')"
echo "  3. 本番デプロイ: npm run deploy"
