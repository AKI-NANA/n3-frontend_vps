#!/bin/bash
echo "🔒 .env.localをバックアップ中..."
cp ~/n3-frontend_new/.env.local ~/n3-frontend_new/.env.local.backup
cp ~/n3-frontend_vps/.env.local ~/n3-frontend_vps/.env.local.backup 2>/dev/null
echo "✅ バックアップ完了"
