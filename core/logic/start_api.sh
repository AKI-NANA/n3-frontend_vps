#!/bin/bash
# N3 Pricing Engine 起動スクリプト
# ==================================

cd "$(dirname "$0")"

# 仮想環境がなければ作成
if [ ! -d ".venv" ]; then
    echo "📦 仮想環境を作成中..."
    python3 -m venv .venv
fi

# 仮想環境を有効化
source .venv/bin/activate

# 依存関係インストール
echo "📦 依存関係をインストール中..."
pip install -q -r requirements.txt

# 環境変数読み込み（.envがあれば）
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# ポート設定
PORT=${PRICING_ENGINE_PORT:-8000}

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 N3 Pricing Engine 起動"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "ポート: $PORT"
echo "ヘルスチェック: http://localhost:$PORT/health"
echo "API ドキュメント: http://localhost:$PORT/docs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 起動
uvicorn pricing_api:app --host 0.0.0.0 --port $PORT --reload
