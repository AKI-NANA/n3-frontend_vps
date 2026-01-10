#!/bin/bash

echo "============================================"
echo "  Import修正スクリプト"
echo "============================================"

# 1. n3-frontend_newを修正
echo "📝 n3-frontend_newを修正中..."
cd ~/n3-frontend_new

# 2. n3-frontend_vpsに同期
echo "📂 n3-frontend_vpsに同期中..."
bash ./scripts/sync-to-production-auto.sh vps

# 3. servicesフォルダも確実に同期
echo "📁 servicesフォルダを同期..."
rsync -avz ~/n3-frontend_new/services/ ~/n3-frontend_vps/services/
rsync -avz ~/n3-frontend_new/app/api/accounting/ ~/n3-frontend_vps/app/api/accounting/
rsync -avz ~/n3-frontend_new/app/research/ ~/n3-frontend_vps/app/research/

echo "✅ 修正完了！"
