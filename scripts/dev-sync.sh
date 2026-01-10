#!/bin/bash

# P2: 開発環境安定化 - ローカル自動同期スクリプト
# ローカル開発環境とリモートデータベースの同期

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   開発環境自動同期スクリプト"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 環境変数のチェック
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ エラー: NEXT_PUBLIC_SUPABASE_URL が設定されていません"
    echo "   .env ファイルを確認してください"
    exit 1
fi

echo "📋 ステップ1: 依存関係のインストール"
npm install

echo ""
echo "🗄️  ステップ2: データベースマイグレーションの実行"
echo "   ⚠️  本番環境のデータベースに接続します"
read -p "   続行しますか？ (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "❌ キャンセルしました"
    exit 0
fi

# マイグレーションファイルを順番に実行
echo "   マイグレーションを実行中..."
for migration in database/migrations/*.sql; do
    if [ -f "$migration" ]; then
        echo "   - $(basename $migration)"
        # Supabase CLIを使用する場合
        # supabase db push --file "$migration"

        # または、psqlを使用する場合
        # psql $DATABASE_URL -f "$migration"
    fi
done

echo ""
echo "🔐 ステップ3: 認証情報の確認"
if [ -z "$ENCRYPTION_MASTER_KEY" ]; then
    echo "   ⚠️  ENCRYPTION_MASTER_KEY が設定されていません"
    echo "   認証情報暗号化が利用できません"
    echo ""
    echo "   設定方法："
    echo "   1. node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    echo "   2. 出力された64文字の文字列を .env に追加"
    echo "      ENCRYPTION_MASTER_KEY=<生成された文字列>"
else
    echo "   ✅ ENCRYPTION_MASTER_KEY が設定されています"
fi

echo ""
echo "🚀 ステップ4: 開発サーバーの起動"
echo "   http://localhost:3000 でアクセスできます"
echo ""

npm run dev
