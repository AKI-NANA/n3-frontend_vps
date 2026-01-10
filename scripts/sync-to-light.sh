#!/bin/bash
# sync-to-light.sh
# n3-frontend_new → n3-frontend_light への同期スクリプト

SOURCE=~/n3-frontend_new
TARGET=~/n3-frontend_light

echo "============================================"
echo "  n3-frontend_light 同期スクリプト"
echo "============================================"
echo ""

# 基本ディレクトリをコピー
echo "📂 基本ディレクトリをコピー中..."
cp -r $SOURCE/lib $TARGET/
cp -r $SOURCE/components $TARGET/
cp -r $SOURCE/types $TARGET/
cp -r $SOURCE/store $TARGET/
cp -r $SOURCE/contexts $TARGET/
cp -r $SOURCE/hooks $TARGET/

# appの基本ファイル
echo "📂 app基本ファイルをコピー中..."
cp $SOURCE/app/layout.tsx $TARGET/app/
cp $SOURCE/app/globals.css $TARGET/app/
cp $SOURCE/app/page.tsx $TARGET/app/
cp $SOURCE/app/providers.tsx $TARGET/app/
cp -r $SOURCE/app/styles $TARGET/app/
cp -r $SOURCE/app/api $TARGET/app/
cp -r $SOURCE/app/login $TARGET/app/

# toolsのlayout
cp $SOURCE/app/tools/layout.tsx $TARGET/app/tools/ 2>/dev/null || true

# 必要なツールをコピー
echo "📂 ツールをコピー中..."

# editing（editing-n3の依存）
rm -rf $TARGET/app/tools/editing
cp -r $SOURCE/app/tools/editing $TARGET/app/tools/

# editing-n3
rm -rf $TARGET/app/tools/editing-n3
cp -r $SOURCE/app/tools/editing-n3 $TARGET/app/tools/

# bookkeeping-n3（記帳）
rm -rf $TARGET/app/tools/bookkeeping-n3
cp -r $SOURCE/app/tools/bookkeeping-n3 $TARGET/app/tools/

# finance-n3
rm -rf $TARGET/app/tools/finance-n3
cp -r $SOURCE/app/tools/finance-n3 $TARGET/app/tools/

# listing-n3
rm -rf $TARGET/app/tools/listing-n3
cp -r $SOURCE/app/tools/listing-n3 $TARGET/app/tools/

# operations-n3
rm -rf $TARGET/app/tools/operations-n3
cp -r $SOURCE/app/tools/operations-n3 $TARGET/app/tools/

# research-n3
rm -rf $TARGET/app/tools/research-n3
cp -r $SOURCE/app/tools/research-n3 $TARGET/app/tools/

# settings-n3
rm -rf $TARGET/app/tools/settings-n3
cp -r $SOURCE/app/tools/settings-n3 $TARGET/app/tools/

# analytics-n3
rm -rf $TARGET/app/tools/analytics-n3
cp -r $SOURCE/app/tools/analytics-n3 $TARGET/app/tools/

# zaiko（棚卸し）
rm -rf $TARGET/app/zaiko
cp -r $SOURCE/app/zaiko $TARGET/app/

# 設定ファイル
echo "📂 設定ファイルをコピー中..."
cp $SOURCE/package.json $TARGET/
cp $SOURCE/tsconfig.json $TARGET/
cp $SOURCE/next.config.ts $TARGET/
cp $SOURCE/tailwind.config.ts $TARGET/
cp $SOURCE/postcss.config.mjs $TARGET/
cp $SOURCE/.env.local $TARGET/

echo ""
echo "============================================"
echo "✅ 同期完了！"
echo ""
echo "次のステップ:"
echo "  cd ~/n3-frontend_light"
echo "  npm run dev -- -p 3002"
echo "============================================"
