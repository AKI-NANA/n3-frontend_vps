#!/bin/bash
# pre-deploy-check.sh
# デプロイ前の自動チェックスクリプト

echo ""
echo "============================================"
echo "  N3 デプロイ前チェック"
echo "============================================"
echo ""

ERRORS=0

# 1. BUILD_IDの確認
echo "🔍 BUILD_ID チェック..."
if [ -f ".next/BUILD_ID" ]; then
  echo "  ✅ BUILD_ID: $(cat .next/BUILD_ID)"
else
  echo "  ❌ BUILD_ID が存在しません！"
  echo "     → npm run build を実行してください"
  ERRORS=$((ERRORS + 1))
fi

# 2. 必須ディレクトリの確認
echo ""
echo "🔍 必須ディレクトリ チェック..."
REQUIRED_DIRS=(".next/server" ".next/static" ".next/build")
for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo "  ✅ $dir"
  else
    echo "  ❌ $dir が存在しません"
    ERRORS=$((ERRORS + 1))
  fi
done

# 3. 存在しないimportのチェック（簡易）
echo ""
echo "🔍 不正なimport チェック..."
BAD_IMPORTS=$(grep -r "from '@/lib/services/image'" --include="*.ts" --include="*.tsx" app/ 2>/dev/null | grep -v "// import" | head -5)
if [ -n "$BAD_IMPORTS" ]; then
  echo "  ⚠️ 要確認: image serviceのimportが見つかりました"
  echo "$BAD_IMPORTS"
fi

# 4. storeディレクトリの同期確認（VPS/Vercel用）
echo ""
echo "🔍 同期対象ディレクトリ チェック..."
SYNC_DIRS=("app" "lib" "components" "types" "store" "contexts" "hooks" "public")
for dir in "${SYNC_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    FILE_COUNT=$(find "$dir" -type f -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l | tr -d ' ')
    echo "  ✅ $dir ($FILE_COUNT ファイル)"
  else
    echo "  ⚠️ $dir が存在しません（オプショナル）"
  fi
done

# 結果
echo ""
echo "============================================"
if [ $ERRORS -eq 0 ]; then
  echo "✅ すべてのチェックに合格しました！"
  echo "   デプロイ準備完了です。"
else
  echo "❌ $ERRORS 件のエラーがあります"
  echo "   修正してから再度チェックしてください。"
fi
echo "============================================"

exit $ERRORS
