#!/bin/bash
# check-build-errors.sh
# ビルド前に問題を検出するスクリプト

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "============================================"
echo "  N3 ビルド前エラーチェック"
echo "============================================"
echo ""

ERRORS=0

# 1. createClient from server を関数外で使っているファイルを検出
echo -e "${YELLOW}🔍 危険なSupabaseパターンをチェック...${NC}"

# パターン: import { createClient } from '@/lib/supabase/server' の後に
#          const supabase = createClient() がグローバルスコープにある

DANGEROUS_FILES=$(grep -rn "from '@/lib/supabase/server'" app/api/ 2>/dev/null | cut -d: -f1 | sort -u || true)

for file in $DANGEROUS_FILES; do
  # グローバルスコープでcreateClient()を呼んでいるかチェック
  if grep -q "^const supabase = createClient()" "$file" 2>/dev/null; then
    echo -e "${RED}  ❌ $file${NC}"
    echo "     → createClient()を関数内で呼び出してください"
    ERRORS=$((ERRORS + 1))
  fi
done

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}  ✅ 危険なパターンなし${NC}"
fi

# 2. 存在しないモジュールのインポートをチェック
echo ""
echo -e "${YELLOW}🔍 存在しないモジュールをチェック...${NC}"

# よくある問題パターン
MISSING_MODULES=0

# lib/research/ のチェック
if grep -rq "from '@/lib/research/" app/ lib/ 2>/dev/null; then
  if [ ! -d "lib/research" ]; then
    echo -e "${RED}  ❌ lib/research/ が存在しません${NC}"
    MISSING_MODULES=$((MISSING_MODULES + 1))
  fi
fi

# lib/services/offers/ のチェック
if grep -rq "from '@/lib/services/offers/" app/ lib/ 2>/dev/null; then
  if [ ! -d "lib/services/offers" ]; then
    echo -e "${RED}  ❌ lib/services/offers/ が存在しません${NC}"
    MISSING_MODULES=$((MISSING_MODULES + 1))
  fi
fi

if [ $MISSING_MODULES -eq 0 ]; then
  echo -e "${GREEN}  ✅ 不足モジュールなし${NC}"
fi

ERRORS=$((ERRORS + MISSING_MODULES))

# 3. TypeScriptエラーのクイックチェック
echo ""
echo -e "${YELLOW}🔍 TypeScriptエラーをチェック...${NC}"

if command -v npx &> /dev/null; then
  TS_ERRORS=$(npx tsc --noEmit 2>&1 | grep -c "error TS" || true)
  if [ "$TS_ERRORS" -gt 0 ]; then
    echo -e "${RED}  ❌ TypeScriptエラー: ${TS_ERRORS}件${NC}"
    echo "     → npx tsc --noEmit で詳細を確認"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}  ✅ TypeScriptエラーなし${NC}"
  fi
else
  echo -e "${YELLOW}  ⚠️ npxが見つかりません（スキップ）${NC}"
fi

# 結果サマリー
echo ""
echo "============================================"
if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}❌ ${ERRORS}件の問題が見つかりました${NC}"
  echo ""
  echo "修正してから npm run build を実行してください"
  exit 1
else
  echo -e "${GREEN}✅ 問題なし！ビルドOKです${NC}"
  exit 0
fi
