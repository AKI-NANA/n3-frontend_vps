#!/bin/bash
# deploy-all.sh
#
# 開発環境 → Vercel/VPS への完全自動デプロイ
# 
# 1. 開発環境をコミット&プッシュ
# 2. Vercel/VPSに同期
# 3. 各環境でコミット&プッシュ
#
# 使い方:
#   ./scripts/deploy-all.sh "コミットメッセージ"
#   ./scripts/deploy-all.sh                        # デフォルトメッセージ

DEV_DIR=~/n3-frontend_new
VERCEL_DIR=~/n3-frontend_vercel
VPS_DIR=~/n3-frontend_vps
SCRIPT_DIR="$DEV_DIR/scripts"

# コミットメッセージ
COMMIT_MSG="${1:-sync $(date '+%Y-%m-%d %H:%M')}"

echo ""
echo "============================================"
echo "  N3 フルデプロイスクリプト"
echo "============================================"
echo ""
echo "ℹ️  コミットメッセージ: $COMMIT_MSG"
echo ""

# Step 1: 開発環境をコミット&プッシュ
echo "📤 Step 1: 開発環境 (n3-frontend_new) をコミット..."
cd "$DEV_DIR"
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "$COMMIT_MSG"
  git push origin main
  echo "✅ 開発環境をプッシュしました"
else
  echo "ℹ️  開発環境に変更なし"
fi
echo ""

# Step 2: 本番環境に同期
echo "📂 Step 2: 本番環境に同期..."
chmod +x "$SCRIPT_DIR/sync-to-production-auto.sh"
"$SCRIPT_DIR/sync-to-production-auto.sh"
echo ""

# Step 3: Vercelにデプロイ
if [ -d "$VERCEL_DIR" ]; then
  echo "📤 Step 3: Vercel (n3-frontend-vercel) にデプロイ..."
  cd "$VERCEL_DIR"
  if [ -n "$(git status --porcelain)" ]; then
    git add -A
    git commit -m "$COMMIT_MSG"
    git push origin main
    echo "✅ Vercelにプッシュしました"
    echo "ℹ️  Vercelが自動デプロイを開始します（2-3分）"
  else
    echo "ℹ️  Vercelに変更なし"
  fi
  echo ""
fi

# Step 4: VPSにデプロイ
if [ -d "$VPS_DIR" ]; then
  echo "📤 Step 4: VPS (n3-frontend-vps) にデプロイ..."
  cd "$VPS_DIR"
  if [ -n "$(git status --porcelain)" ]; then
    git add -A
    git commit -m "$COMMIT_MSG"
    git push origin main
    echo "✅ VPSにプッシュしました"
    echo "ℹ️  VPSでは手動で git pull & pm2 restart が必要です"
  else
    echo "ℹ️  VPSに変更なし"
  fi
  echo ""
fi

echo "============================================"
echo "✅ 全環境へのデプロイが完了しました！"
echo ""
echo "確認URL:"
echo "  Vercel: https://n3-frontend-vercel.vercel.app"
echo ""
echo "VPSで実行:"
echo "  ssh ubuntu@160.16.120.186"
echo "  cd ~/n3-frontend-vps && git pull && npm install && pm2 restart all"
echo "============================================"
