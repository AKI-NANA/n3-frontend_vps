#!/bin/bash

# VPSデプロイ前チェックスクリプト
# case-sensitive環境での動作を事前確認

echo "🔍 VPSデプロイ前チェック"
echo "========================================"
echo ""

# 1. インポートパスチェック
echo "1️⃣ インポートパスの大文字小文字チェック..."
IMPORT_ISSUES=$(grep -r "from.*['\"].*[A-Z]" app lib components --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)

if [ "$IMPORT_ISSUES" -gt 0 ]; then
  echo "   ⚠️  ${IMPORT_ISSUES}件の大文字を含むインポートを検出"
  echo "   → npm run fix:imports-vps を実行してください"
else
  echo "   ✅ インポートパスはすべてkebab-case"
fi

echo ""

# 2. ファイル名チェック
echo "2️⃣ ファイル名のチェック..."
UPPERCASE_FILES=$(find app lib components -name "*[A-Z]*" -type f 2>/dev/null | wc -l)

if [ "$UPPERCASE_FILES" -gt 0 ]; then
  echo "   ⚠️  ${UPPERCASE_FILES}個の大文字を含むファイル名を検出"
  echo "   以下のファイルをリネームしてください:"
  find app lib components -name "*[A-Z]*" -type f 2>/dev/null | head -5
else
  echo "   ✅ ファイル名はすべてkebab-case"
fi

echo ""

# 3. ビルドテスト
echo "3️⃣ ビルドテスト..."
echo "   実行中..."

# ビルドを実行（エラーをキャプチャ）
BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -eq 0 ]; then
  echo "   ✅ ビルド成功"
else
  echo "   ❌ ビルド失敗"
  echo "   エラーの詳細:"
  echo "$BUILD_OUTPUT" | grep -E "Error|failed|Module not found" | head -10
fi

echo ""

# 4. VPS接続チェック
echo "4️⃣ VPS接続チェック..."
if ssh -o ConnectTimeout=5 ubuntu@160.16.120.186 "echo 'connected'" > /dev/null 2>&1; then
  echo "   ✅ VPS接続OK"
  
  # VPSの状態確認
  echo "   VPS上のPM2状態:"
  ssh ubuntu@160.16.120.186 "pm2 list" 2>/dev/null | grep n3
else
  echo "   ❌ VPS接続失敗"
fi

echo ""
echo "========================================"

# 結果判定
if [ "$IMPORT_ISSUES" -eq 0 ] && [ "$UPPERCASE_FILES" -eq 0 ] && [ $BUILD_EXIT_CODE -eq 0 ]; then
  echo "✅ VPSデプロイの準備が整いました！"
  echo ""
  echo "デプロイコマンド:"
  echo "  ./scripts/sync-to-production-auto.sh vps --build"
else
  echo "⚠️  修正が必要な項目があります"
  echo ""
  echo "推奨手順:"
  echo "  1. npm run fix:imports-vps  # インポート修正"
  echo "  2. npm run build            # ビルド確認"
  echo "  3. このスクリプトを再実行"
fi
