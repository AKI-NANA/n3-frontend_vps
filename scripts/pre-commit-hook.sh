#!/bin/bash

# Git pre-commit hook
# このファイルを .git/hooks/pre-commit にコピーして使用

echo "🔍 コミット前チェックを実行中..."

# ケース感度チェックスクリプトを実行
if [ -f "./scripts/check-case-sensitivity.sh" ]; then
    bash ./scripts/check-case-sensitivity.sh
    if [ $? -ne 0 ]; then
        echo "❌ ケース感度チェックに失敗しました。修正してからコミットしてください。"
        exit 1
    fi
fi

# TypeScriptのビルドチェック（軽量版）
echo "📝 TypeScriptチェック中..."
npx tsc --noEmit --skipLibCheck 2>&1 | head -20
if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo "⚠️  TypeScriptエラーがあります。確認してください。"
    # エラーがあっても続行可能（警告のみ）
fi

echo "✅ コミット前チェック完了！"
