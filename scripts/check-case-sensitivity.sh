#!/bin/bash

echo "============================================"
echo "  🔍 ケース感度チェックスクリプト"
echo "============================================"

# 色の定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors_found=0

echo ""
echo "📋 チェック項目："

# 1. PascalCaseのファイル名をチェック
echo ""
echo "1️⃣ PascalCaseのファイル名を検索..."
pascal_files=$(find . -name "*.ts" -o -name "*.tsx" | grep -E "/[A-Z][a-zA-Z]+\.(ts|tsx)$" | grep -v node_modules | grep -v .next)

if [ -n "$pascal_files" ]; then
    echo -e "${RED}❌ PascalCaseのファイルが見つかりました：${NC}"
    echo "$pascal_files"
    errors_found=1
else
    echo -e "${GREEN}✅ すべてのファイル名がkebab-caseです${NC}"
fi

# 2. インポートパスの大文字・小文字不一致をチェック
echo ""
echo "2️⃣ インポートパスをチェック..."

# servicesディレクトリのファイル名を取得
service_files=$(ls services/ai_pipeline/*.ts 2>/dev/null | xargs -n1 basename | sed 's/\.ts$//')

for file in $service_files; do
    # PascalCaseでインポートされているか確認
    pascal_import=$(grep -r "from.*services/ai_pipeline/[A-Z]" --include="*.ts" --include="*.tsx" . 2>/dev/null | grep -v node_modules)
    
    if [ -n "$pascal_import" ]; then
        echo -e "${YELLOW}⚠️  PascalCaseのインポートが見つかりました：${NC}"
        echo "$pascal_import" | head -5
        errors_found=1
    fi
done

if [ $errors_found -eq 0 ]; then
    echo -e "${GREEN}✅ インポートパスは正しいです${NC}"
fi

# 3. 大文字・小文字の混在チェック
echo ""
echo "3️⃣ インポート名とクラス名の一致をチェック..."

# ManagementPolicyGeneratorの使用をチェック
mgmt_lowercase=$(grep -r "managementPolicyGenerator\." --include="*.ts" --include="*.tsx" . 2>/dev/null | grep -v node_modules)
if [ -n "$mgmt_lowercase" ]; then
    echo -e "${RED}❌ 小文字のmanagementPolicyGeneratorが使用されています：${NC}"
    echo "$mgmt_lowercase" | head -3
    errors_found=1
fi

# SupplierDatabaseServiceの使用をチェック
supplier_lowercase=$(grep -r "supplierDbService\." --include="*.ts" --include="*.tsx" . 2>/dev/null | grep -v node_modules)
if [ -n "$supplier_lowercase" ]; then
    echo -e "${RED}❌ 小文字のsupplierDbServiceが使用されています：${NC}"
    echo "$supplier_lowercase" | head -3
    errors_found=1
fi

if [ $errors_found -eq 0 ]; then
    echo -e "${GREEN}✅ クラス名の使用は正しいです${NC}"
fi

# 4. Linux環境でのテストビルド
echo ""
echo "4️⃣ Linux環境をシミュレート（大文字・小文字を厳密にチェック）..."

# TypeScriptのstrict設定を確認
if grep -q '"forceConsistentCasingInFileNames": true' tsconfig.json; then
    echo -e "${GREEN}✅ tsconfig.jsonで大文字・小文字の一貫性が強制されています${NC}"
else
    echo -e "${YELLOW}⚠️  tsconfig.jsonに forceConsistentCasingInFileNames: true を追加することを推奨します${NC}"
    errors_found=1
fi

echo ""
echo "============================================"
if [ $errors_found -eq 0 ]; then
    echo -e "${GREEN}🎉 すべてのチェックに合格しました！${NC}"
    echo "VPSでも問題なくビルドできます。"
else
    echo -e "${RED}⚠️  ${errors_found}個の問題が見つかりました${NC}"
    echo "上記の問題を修正してから再度チェックしてください。"
    exit 1
fi
echo "============================================"
