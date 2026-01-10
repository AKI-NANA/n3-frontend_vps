#!/bin/bash
# sync-vercel-to-vps.sh
# Vercelリポジトリの内容をVPSリポジトリにコピーしてプッシュ

VERCEL_DIR=~/n3-frontend_vercel
VPS_DIR=~/n3-frontend_vps

echo ""
echo "============================================"
echo "  Vercel → VPS 同期スクリプト"
echo "============================================"
echo ""

# ディレクトリ確認
if [ ! -d "$VERCEL_DIR" ]; then
  echo "❌ Vercelディレクトリが見つかりません: $VERCEL_DIR"
  exit 1
fi

if [ ! -d "$VPS_DIR" ]; then
  echo "❌ VPSディレクトリが見つかりません: $VPS_DIR"
  exit 1
fi

echo "📂 同期中: $VERCEL_DIR → $VPS_DIR"
echo ""

# rsync実行
rsync -av --delete \
  --exclude='.git' \
  --exclude='.next' \
  --exclude='node_modules' \
  --exclude='.env*' \
  --exclude='.vercel' \
  "$VERCEL_DIR/" "$VPS_DIR/"

echo ""
echo "✅ 同期完了！"
echo ""

# Gitプッシュ確認
read -p "VPSリポジトリにプッシュしますか？ (y/N): " answer
if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
  cd "$VPS_DIR"
  git add -A
  git commit -m "sync from vercel $(date +%Y-%m-%d_%H:%M)" || echo "変更なし"
  git push origin main
  echo ""
  echo "✅ プッシュ完了！"
  echo ""
  echo "次のステップ（VPSで実行）:"
  echo "  ssh ubuntu@160.16.120.186"
  echo "  cd ~/n3-frontend-vps && git pull && pm2 restart all"
else
  echo ""
  echo "プッシュをスキップしました"
  echo "手動でプッシュ: cd $VPS_DIR && git add -A && git commit -m 'sync' && git push"
fi

echo ""
echo "============================================"
