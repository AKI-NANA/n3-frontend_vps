#!/bin/bash
# deploy-vps-safe.sh
# VPSへの安全なデプロイスクリプト（エラーチェック付き）

set -e  # エラーで即座に停止

VPS_HOST="ubuntu@160.16.120.186"
VPS_DIR="~/n3-frontend-vps"

echo ""
echo "============================================"
echo "  N3 VPS 安全デプロイ"
echo "============================================"
echo ""

# Step 1: 同期
echo "📂 Step 1: 開発環境から同期..."
cd ~/n3-frontend_new
./scripts/sync-to-production-auto.sh vps

# Step 2: ビルド
echo ""
echo "🔨 Step 2: ビルド中..."
cd ~/n3-frontend_vps
npm run build

# Step 3: BUILD_ID確認
echo ""
echo "🔍 Step 3: BUILD_ID 確認..."
if [ ! -f ".next/BUILD_ID" ]; then
  echo "❌ BUILD_ID が生成されませんでした！"
  echo "   → 手動で確認してください: npm run build -- --webpack"
  exit 1
fi
BUILD_ID=$(cat .next/BUILD_ID)
echo "✅ BUILD_ID: $BUILD_ID"

# Step 4: VPSに転送
echo ""
echo "📤 Step 4: VPSに転送中..."
rsync -avz --delete .next/ $VPS_HOST:$VPS_DIR/.next/

# Step 5: PM2再起動
echo ""
echo "🔄 Step 5: PM2 再起動..."
ssh $VPS_HOST "pm2 restart n3"

# Step 6: 動作確認
echo ""
echo "⏳ Step 6: 起動待機（5秒）..."
sleep 5

echo ""
echo "🔍 ログ確認..."
ssh $VPS_HOST "pm2 logs n3 --lines 10 --nostream"

echo ""
echo "============================================"
echo "✅ VPSデプロイ完了！"
echo ""
echo "確認URL: https://n3.emverze.com"
echo "============================================"
