#!/bin/bash
# VPSデプロイ用の修正版コマンド集

# =====================================
# 環境の違いに注意
# =====================================
# ローカル: ~/n3-frontend_vps (アンダースコア)
# VPSサーバー: ~/n3-frontend-vps (ハイフン)

# 1. 同期（ローカル → VPS準備フォルダ）
echo "📂 同期中..."
cd ~/n3-frontend_new
bash ./scripts/sync-to-production-auto.sh vps

# 2. ローカルビルド
echo "🔨 ビルド中..."
cd ~/n3-frontend_vps
npm install next@15.1.0 --save --force
npm run build

# 3. VPSに転送
echo "📤 VPSに転送中..."
rsync -avz --delete ~/n3-frontend_vps/.next/ ubuntu@160.16.120.186:~/n3-frontend-vps/.next/
rsync -avz ~/n3-frontend_vps/package.json ubuntu@160.16.120.186:~/n3-frontend-vps/
rsync -avz ~/n3-frontend_vps/.env.local ubuntu@160.16.120.186:~/n3-frontend-vps/

# 4. VPSでパッケージ更新
echo "📦 VPSでNext.js 15.1.0インストール..."
ssh ubuntu@160.16.120.186 'cd ~/n3-frontend-vps && npm install next@15.1.0 --save --force'

# 5. PM2再起動
echo "🔄 PM2再起動..."
ssh ubuntu@160.16.120.186 'pm2 restart n3'

# 6. ログ確認
echo "📋 ログ確認..."
sleep 5
ssh ubuntu@160.16.120.186 'pm2 logs n3 --lines 20 --nostream'

echo "✅ デプロイ完了！"
echo "確認URL: https://n3.emverze.com"
