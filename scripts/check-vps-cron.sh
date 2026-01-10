#!/bin/bash

# N3 VPS Cronジョブ状態確認スクリプト

echo "🕐 N3 VPS Cronジョブ状態確認"
echo "=" | tr '=' '='$(seq 1 60)
echo ""

# VPS接続情報
VPS_HOST="ubuntu@160.16.120.186"
VPS_DIR="~/n3-frontend-vps"

echo "📡 VPSに接続中..."

# Cronジョブ一覧を取得
echo ""
echo "📋 登録されているCronジョブ:"
echo "----------------------------"
ssh $VPS_HOST "crontab -l 2>/dev/null" || echo "Cronジョブが設定されていません"

echo ""
echo "🔍 N3関連のプロセス:"
echo "----------------------------"
ssh $VPS_HOST "ps aux | grep -E 'node|pm2|n3' | grep -v grep"

echo ""
echo "📊 PM2プロセス状態:"
echo "----------------------------"
ssh $VPS_HOST "pm2 list"

echo ""
echo "📝 最近のPM2ログ (最後の20行):"
echo "----------------------------"
ssh $VPS_HOST "pm2 logs n3 --lines 20 --nostream 2>/dev/null" || echo "ログが取得できません"

echo ""
echo "🔧 推奨Cronジョブ設定:"
echo "----------------------------"
cat << 'CRON'
# N3 自動処理スケジュール（VPS用）

# 1. 在庫同期（30分ごと）
*/30 * * * * cd ~/n3-frontend-vps && npm run sync:inventory >> ~/logs/inventory-sync.log 2>&1

# 2. eBay出品処理（毎日午前3時）
0 3 * * * cd ~/n3-frontend-vps && npm run listing:ebay >> ~/logs/ebay-listing.log 2>&1

# 3. 価格更新（6時間ごと）
0 */6 * * * cd ~/n3-frontend-vps && npm run update:prices >> ~/logs/price-update.log 2>&1

# 4. データバックアップ（毎日午前2時）
0 2 * * * cd ~/n3-frontend-vps && npm run backup:data >> ~/logs/backup.log 2>&1

# 5. システムヘルスチェック（10分ごと）
*/10 * * * * cd ~/n3-frontend-vps && npm run health:check >> ~/logs/health.log 2>&1
CRON

echo ""
echo "💡 Cronジョブを設定するには:"
echo "  ssh $VPS_HOST"
echo "  crontab -e"
echo "  # 上記の設定を追加"
echo ""
echo "📂 ログディレクトリを作成:"
echo "  ssh $VPS_HOST 'mkdir -p ~/logs'"
echo ""
