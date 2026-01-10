#!/bin/bash
# sync-to-production-auto.sh
#
# 開発環境 → Vercel/VPS への自動同期
# 
# 使い方:
#   ./scripts/sync-to-production-auto.sh          # 両方に同期
#   ./scripts/sync-to-production-auto.sh vercel   # Vercelのみ
#   ./scripts/sync-to-production-auto.sh vps      # VPSのみ
#   ./scripts/sync-to-production-auto.sh vps --build  # VPS同期 + ビルド + デプロイ

DEV_DIR=~/n3-frontend_new
VERCEL_DIR=~/n3-frontend_vercel
VPS_DIR=~/n3-frontend_vps
VPS_HOST="ubuntu@160.16.120.186"
VPS_REMOTE_DIR="~/n3-frontend-vps"

echo ""
echo "============================================"
echo "  N3 自動同期スクリプト v3 (改善版)"
echo "============================================"
echo ""

# ディレクトリ確認
if [ ! -d "$DEV_DIR" ]; then
  echo "❌ 開発ディレクトリが見つかりません: $DEV_DIR"
  exit 1
fi

# ===========================
# VPSに必要ないファイルのみ除外
# ===========================
# 真に不要なもののみ除外:
# - .git: Gitリポジトリ（不要）
# - .next: ビルド結果（VPSで再ビルドする）
# - node_modules: 依存関係（VPSでインストール）
# - 開発用ツール設定: .vscode, .idea等
# - バックアップ: _backups, backups
# - ドキュメント: docs, *.md（READMEなど）
# - テスト: __tests__（本番不要）
# - .DS_Store: MacOSの不要ファイル
EXCLUDES_ESSENTIAL="--exclude=.git --exclude=.next --exclude=node_modules --exclude=.vscode --exclude=.claude --exclude=.vercel --exclude=.idea --exclude=_backups --exclude=_src --exclude=backups --exclude=docs --exclude=__tests__ --exclude=.DS_Store --exclude=*.log"

# Vercel用（環境変数を除外）
EXCLUDES_VERCEL="$EXCLUDES_ESSENTIAL --exclude=.env --exclude=.env.local --exclude=.env.production"

# VPS用（最小限の除外）
EXCLUDES_VPS="$EXCLUDES_ESSENTIAL"

# Vercelに同期
sync_vercel() {
  if [ ! -d "$VERCEL_DIR" ]; then
    echo "❌ Vercelディレクトリが見つかりません: $VERCEL_DIR"
    return 1
  fi
  
  echo "📂 Vercel に同期中..."
  
  rsync -av --delete $EXCLUDES_VERCEL "$DEV_DIR/app/" "$VERCEL_DIR/app/"
  rsync -av --delete $EXCLUDES_VERCEL "$DEV_DIR/lib/" "$VERCEL_DIR/lib/"
  rsync -av --delete $EXCLUDES_VERCEL "$DEV_DIR/components/" "$VERCEL_DIR/components/"
  rsync -av --delete $EXCLUDES_VERCEL "$DEV_DIR/types/" "$VERCEL_DIR/types/"
  
  [ -d "$DEV_DIR/contexts" ] && rsync -av --delete $EXCLUDES_VERCEL "$DEV_DIR/contexts/" "$VERCEL_DIR/contexts/"
  [ -d "$DEV_DIR/hooks" ] && rsync -av --delete $EXCLUDES_VERCEL "$DEV_DIR/hooks/" "$VERCEL_DIR/hooks/"
  [ -d "$DEV_DIR/public" ] && rsync -av --delete $EXCLUDES_VERCEL "$DEV_DIR/public/" "$VERCEL_DIR/public/"
  [ -d "$DEV_DIR/store" ] && rsync -av --delete $EXCLUDES_VERCEL "$DEV_DIR/store/" "$VERCEL_DIR/store/"
  
  # 設定ファイル（すべて必要）
  cp "$DEV_DIR/package.json" "$VERCEL_DIR/"
  cp "$DEV_DIR/package-lock.json" "$VERCEL_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/tsconfig.json" "$VERCEL_DIR/"
  cp "$DEV_DIR/next.config.ts" "$VERCEL_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/next.config.js" "$VERCEL_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/tailwind.config.ts" "$VERCEL_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/tailwind.config.js" "$VERCEL_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/postcss.config.mjs" "$VERCEL_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/postcss.config.js" "$VERCEL_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/middleware.ts" "$VERCEL_DIR/" 2>/dev/null || true
  
  echo "✅ Vercel 同期完了！"
}

# VPSに同期（改善版）
sync_vps() {
  if [ ! -d "$VPS_DIR" ]; then
    echo "❌ VPSディレクトリが見つかりません: $VPS_DIR"
    return 1
  fi
  
  echo "📂 VPS に同期中（改善版）..."
  echo "除外: .git, .next, node_modules, 開発ツール設定のみ"
  
  # すべての必要なディレクトリを同期
  rsync -av --delete $EXCLUDES_VPS "$DEV_DIR/app/" "$VPS_DIR/app/"
  rsync -av --delete $EXCLUDES_VPS "$DEV_DIR/lib/" "$VPS_DIR/lib/"
  rsync -av --delete $EXCLUDES_VPS "$DEV_DIR/components/" "$VPS_DIR/components/"
  rsync -av --delete $EXCLUDES_VPS "$DEV_DIR/types/" "$VPS_DIR/types/"
  
  # オプションディレクトリ
  [ -d "$DEV_DIR/contexts" ] && rsync -av --delete $EXCLUDES_VPS "$DEV_DIR/contexts/" "$VPS_DIR/contexts/"
  [ -d "$DEV_DIR/hooks" ] && rsync -av --delete $EXCLUDES_VPS "$DEV_DIR/hooks/" "$VPS_DIR/hooks/"
  [ -d "$DEV_DIR/public" ] && rsync -av --delete $EXCLUDES_VPS "$DEV_DIR/public/" "$VPS_DIR/public/"
  [ -d "$DEV_DIR/store" ] && rsync -av --delete $EXCLUDES_VPS "$DEV_DIR/store/" "$VPS_DIR/store/"
  [ -d "$DEV_DIR/scripts" ] && rsync -av --delete $EXCLUDES_VPS "$DEV_DIR/scripts/" "$VPS_DIR/scripts/"
  [ -d "$DEV_DIR/migrations" ] && rsync -av --delete $EXCLUDES_VPS "$DEV_DIR/migrations/" "$VPS_DIR/migrations/"
  [ -d "$DEV_DIR/data" ] && rsync -av --delete $EXCLUDES_VPS "$DEV_DIR/data/" "$VPS_DIR/data/"
  [ -d "$DEV_DIR/config" ] && rsync -av --delete $EXCLUDES_VPS "$DEV_DIR/config/" "$VPS_DIR/config/"
  
  # すべての設定ファイル（.mdや.htmlも含む）
  cp "$DEV_DIR/package.json" "$VPS_DIR/"
  cp "$DEV_DIR/package-lock.json" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/tsconfig.json" "$VPS_DIR/"
  cp "$DEV_DIR/next.config.ts" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/next.config.js" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/tailwind.config.ts" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/tailwind.config.js" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/postcss.config.mjs" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/postcss.config.js" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/middleware.ts" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/.eslintrc.json" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/README.md" "$VPS_DIR/" 2>/dev/null || true
  
  # .env.localをVPSにコピー
  if [ -f "$DEV_DIR/.env.local" ]; then
    cp "$DEV_DIR/.env.local" "$VPS_DIR/.env.local"
    echo "🔐 .env.local を同期しました"
  fi
  
  # 同期結果を確認
  echo ""
  echo "📊 同期結果:"
  echo "  - app: $(find $VPS_DIR/app -type f | wc -l) files"
  echo "  - lib: $(find $VPS_DIR/lib -type f | wc -l) files"
  echo "  - components: $(find $VPS_DIR/components -type f | wc -l) files"
  
  echo "✅ VPS 同期完了！"
}

# VPSビルド＆デプロイ
build_and_deploy_vps() {
  echo ""
  echo "============================================"
  echo "  🔨 VPS ビルド開始（Webpack モード）"
  echo "============================================"
  echo ""
  
  cd "$VPS_DIR"
  
  # 古いビルドを削除
  rm -rf .next
  
  # ビルド実行
  npm run build
  
  # BUILD_ID確認
  if [ ! -f ".next/BUILD_ID" ]; then
    echo ""
    echo "❌ エラー: BUILD_ID が生成されませんでした"
    echo "   → 手動で npm run build を試してください"
    exit 1
  fi
  
  BUILD_ID=$(cat .next/BUILD_ID)
  echo ""
  echo "✅ ビルド成功！ BUILD_ID: $BUILD_ID"
  echo ""
  
  # VPSに転送
  echo "📤 VPSサーバーに転送中..."
  rsync -avz --delete .next/ $VPS_HOST:$VPS_REMOTE_DIR/.next/
  
  # PM2再起動
  echo ""
  echo "🔄 PM2 再起動中..."
  ssh $VPS_HOST "pm2 restart n3"
  
  # 待機
  echo ""
  echo "⏳ 起動待機（5秒）..."
  sleep 5
  
  # ログ確認
  echo ""
  echo "📋 ログ確認:"
  ssh $VPS_HOST "pm2 logs n3 --lines 10 --nostream"
  
  echo ""
  echo "============================================"
  echo "✅ VPSデプロイ完了！"
  echo ""
  echo "確認URL: https://n3.emverze.com"
  echo "============================================"
}

# メイン処理
case "$1" in
  vercel)
    sync_vercel
    ;;
  vps)
    sync_vps
    if [ "$2" = "--build" ]; then
      build_and_deploy_vps
    else
      echo ""
      echo "============================================"
      echo "⚠️ 重要: デプロイ前に必ずビルドテスト！"
      echo ""
      echo "次のステップ:"
      echo "  1. cd ~/n3-frontend_vps && npm run build"
      echo "  2. BUILD_IDを確認: cat .next/BUILD_ID"
      echo "  3. rsync -avz --delete .next/ ubuntu@160.16.120.186:~/n3-frontend-vps/.next/"
      echo "  4. ssh ubuntu@160.16.120.186 'pm2 restart n3'"
      echo ""
      echo "または一括実行:"
      echo "  ./scripts/sync-to-production-auto.sh vps --build"
      echo "============================================"
    fi
    ;;
  *)
    sync_vercel
    echo ""
    sync_vps
    echo ""
    echo "============================================"
    echo "✅ 同期完了！"
    echo ""
    echo "⚠️ 重要: VPSデプロイは別途実行が必要"
    echo ""
    echo "VPSデプロイ:"
    echo "  ./scripts/sync-to-production-auto.sh vps --build"
    echo "============================================"
    ;;
esac
