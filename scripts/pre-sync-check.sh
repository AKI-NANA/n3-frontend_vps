#!/bin/bash
# pre-sync-check.sh
# 同期前にエラーが出そうな問題をチェック

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "============================================"
echo "  N3 同期前チェック"
echo "============================================"
echo ""

# 1. ビルドチェック
echo -e "${YELLOW}🔨 ビルドチェック中...${NC}"
if npm run build > /dev/null 2>&1; then
  echo -e "${GREEN}✅ ビルド成功${NC}"
else
  echo -e "${RED}❌ ビルドエラー！同期前に修正してください${NC}"
  echo "   npm run build でエラー詳細を確認"
  exit 1
fi

# 2. 環境変数チェック（Vercel用）
echo ""
echo -e "${YELLOW}🔐 Vercel環境変数チェック...${NC}"

REQUIRED_VARS=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ] && ! grep -q "^$var=" .env.local 2>/dev/null; then
    MISSING_VARS+=("$var")
  fi
done

if [ ${#MISSING_VARS[@]} -eq 0 ]; then
  echo -e "${GREEN}✅ 必須環境変数OK${NC}"
else
  echo -e "${YELLOW}⚠️  以下の変数がVercel管理画面に必要:${NC}"
  for var in "${MISSING_VARS[@]}"; do
    echo "   - $var"
  done
fi

# 3. HTMLテンプレートチェック
echo ""
echo -e "${YELLOW}📄 HTMLテンプレートチェック...${NC}"
if [ -d "html" ] && [ "$(ls -A html/*.html 2>/dev/null)" ]; then
  echo -e "${YELLOW}⚠️  html/ にテンプレートがあります:${NC}"
  ls html/*.html | while read f; do
    echo "   - $(basename $f)"
  done
  echo "   → DBに保存済みなら不要、出品で使うなら public/ に移動"
else
  echo -e "${GREEN}✅ HTMLテンプレートなし${NC}"
fi

# 4. 本番ディレクトリ存在チェック
echo ""
echo -e "${YELLOW}📁 本番ディレクトリチェック...${NC}"
if [ -d ~/n3-frontend_vercel ]; then
  echo -e "${GREEN}✅ n3-frontend_vercel 存在${NC}"
else
  echo -e "${RED}❌ n3-frontend_vercel が見つかりません${NC}"
fi

if [ -d ~/n3-frontend_vps ]; then
  echo -e "${GREEN}✅ n3-frontend_vps 存在${NC}"
else
  echo -e "${RED}❌ n3-frontend_vps が見つかりません${NC}"
fi

echo ""
echo "============================================"
echo -e "${GREEN}チェック完了！${NC}"
echo ""
echo "次のステップ:"
echo "  ./scripts/sync-to-production-auto.sh"
echo "============================================"
