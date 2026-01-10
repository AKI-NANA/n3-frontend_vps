#!/bin/bash
# ===========================================
# VPS同期スクリプト v4
# N3 COMMAND CENTER用
# ===========================================
#
# 使い方:
#   ./scripts/vps-sync.sh           # 同期のみ
#   ./scripts/vps-sync.sh --build   # 同期 + ビルド + デプロイ
#   ./scripts/vps-sync.sh --clean   # クリーン後に同期
#   ./scripts/vps-sync.sh --full    # クリーン + 同期 + ビルド + デプロイ

set -e

DEV_DIR=~/n3-frontend_new
VPS_DIR=~/n3-frontend_vps
VPS_HOST="ubuntu@160.16.120.186"
VPS_REMOTE_DIR="~/n3-frontend-vps"

# 色付き出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

echo ""
echo "============================================"
echo "  N3 VPS同期スクリプト v4"
echo "============================================"
echo ""

# ===========================================
# 保護するファイル（削除しない）
# ===========================================
PROTECTED_FILES=(
  ".env.local"
  ".env"
  ".env.production"
  "ecosystem.config.js"
  "package.json"
  "package-lock.json"
  "tsconfig.json"
  "next.config.ts"
  "tailwind.config.ts"
  "postcss.config.mjs"
  "middleware.ts"
  ".eslintrc.json"
  ".eslintignore"
  ".gitignore"
  ".npmrc"
)

# ===========================================
# VPSに含めないファイル/フォルダ
# ===========================================
EXCLUDE_DIRS=(
  # 開発用資料
  "_参考資料"
  "_archives"
  "_src"
  "_backups"
  "docs"
  "__tests__"
  
  # 開発用設定
  ".claude"
  ".vercel"
  ".venv"
  ".vscode"
  ".idea"
  ".tmp.drivedownload"
  ".tmp.driveupload"
  ".git"
  ".github"
  
  # DB/設定
  "scripts"
  "migrations"
  "database"
  "supabase"
  "html"
  "sql"
  "config"
  "executions"
  "logs"
  
  # ビルド/依存関係（クリーン時のみ）
  # ".next" と "node_modules" は別途処理
)

EXCLUDE_FILES=(
  "*.sh"
  "*.md"
  "*.py"
  "*.html"
  "*.log"
  "*.txt"
  ".DS_Store"
  "credentials.json"
  "token.json"
  "google-service-account.json"
  "tsconfig.tsbuildinfo"
  "テスト"
  "vercel.json"
)

# 除外するツール（app/tools/内）
EXCLUDE_TOOLS=(
  "ai-improvement-dashboard"
  "ai-improvement-demo"
  "amazon-arbitrage"
  "amazon-config"
  "amazon-research"
  "amazon-research-n3"
  "buyma-simulator"
  "test-page"
  "html-editor"
  "supabase-connection"
  "vercel-env"
  "git-deploy"
)

# rsync除外オプションを生成
build_exclude_opts() {
  local opts=""
  for dir in "${EXCLUDE_DIRS[@]}"; do
    opts="$opts --exclude=$dir"
  done
  for file in "${EXCLUDE_FILES[@]}"; do
    opts="$opts --exclude=$file"
  done
  for tool in "${EXCLUDE_TOOLS[@]}"; do
    opts="$opts --exclude=app/tools/$tool"
  done
  # 保護ファイルは除外しない（同期対象）
  echo "$opts"
}

# VPSフォルダをクリーン（保護ファイルは残す）
clean_vps_dir() {
  log_info "VPSフォルダをクリーン中..."
  log_warning "保護されるファイル: .env.local, ecosystem.config.js, package.json など"
  
  if [ ! -d "$VPS_DIR" ]; then
    log_warning "VPSフォルダが存在しません: $VPS_DIR"
    return
  fi
  
  # 不要フォルダを削除
  for dir in "${EXCLUDE_DIRS[@]}"; do
    if [ -d "$VPS_DIR/$dir" ]; then
      rm -rf "$VPS_DIR/$dir"
      log_success "削除: $dir"
    fi
  done
  
  # 不要ツールを削除
  for tool in "${EXCLUDE_TOOLS[@]}"; do
    if [ -d "$VPS_DIR/app/tools/$tool" ]; then
      rm -rf "$VPS_DIR/app/tools/$tool"
      log_success "削除: app/tools/$tool"
    fi
  done
  
  # 不要ファイルを削除（保護ファイル以外）
  # *.sh を削除（ただしルートのみ）
  find "$VPS_DIR" -maxdepth 1 -name "*.sh" -type f -delete 2>/dev/null || true
  # *.md を削除
  find "$VPS_DIR" -maxdepth 1 -name "*.md" -type f -delete 2>/dev/null || true
  # *.py を削除
  find "$VPS_DIR" -maxdepth 1 -name "*.py" -type f -delete 2>/dev/null || true
  # *.html を削除
  find "$VPS_DIR" -maxdepth 1 -name "*.html" -type f -delete 2>/dev/null || true
  # .DS_Store を全削除
  find "$VPS_DIR" -name ".DS_Store" -type f -delete 2>/dev/null || true
  # credentials系を削除
  rm -f "$VPS_DIR/credentials.json" 2>/dev/null || true
  rm -f "$VPS_DIR/token.json" 2>/dev/null || true
  rm -f "$VPS_DIR/google-service-account.json" 2>/dev/null || true
  rm -f "$VPS_DIR/tsconfig.tsbuildinfo" 2>/dev/null || true
  rm -f "$VPS_DIR/テスト" 2>/dev/null || true
  rm -f "$VPS_DIR/vercel.json" 2>/dev/null || true
  
  log_success "クリーン完了（保護ファイルは保持）"
  
  # 保護ファイルの存在確認
  echo ""
  log_info "保護ファイルの状態:"
  for pf in "${PROTECTED_FILES[@]}"; do
    if [ -f "$VPS_DIR/$pf" ]; then
      echo "  ✅ $pf (保持)"
    fi
  done
}

# 開発環境からVPSフォルダに同期
sync_to_vps_dir() {
  log_info "開発環境からVPSフォルダに同期中..."
  
  if [ ! -d "$VPS_DIR" ]; then
    mkdir -p "$VPS_DIR"
  fi
  
  local exclude_opts=$(build_exclude_opts)
  
  # メインディレクトリを同期
  rsync -av --delete $exclude_opts "$DEV_DIR/app/" "$VPS_DIR/app/"
  rsync -av --delete $exclude_opts "$DEV_DIR/lib/" "$VPS_DIR/lib/"
  rsync -av --delete $exclude_opts "$DEV_DIR/components/" "$VPS_DIR/components/"
  rsync -av --delete $exclude_opts "$DEV_DIR/types/" "$VPS_DIR/types/"
  rsync -av --delete $exclude_opts "$DEV_DIR/services/" "$VPS_DIR/services/" 2>/dev/null || true
  rsync -av --delete $exclude_opts "$DEV_DIR/store/" "$VPS_DIR/store/" 2>/dev/null || true
  rsync -av --delete $exclude_opts "$DEV_DIR/data/" "$VPS_DIR/data/" 2>/dev/null || true
  
  [ -d "$DEV_DIR/contexts" ] && rsync -av --delete $exclude_opts "$DEV_DIR/contexts/" "$VPS_DIR/contexts/"
  [ -d "$DEV_DIR/hooks" ] && rsync -av --delete $exclude_opts "$DEV_DIR/hooks/" "$VPS_DIR/hooks/"
  [ -d "$DEV_DIR/public" ] && rsync -av --delete $exclude_opts "$DEV_DIR/public/" "$VPS_DIR/public/"
  [ -d "$DEV_DIR/vps-workers" ] && rsync -av --delete $exclude_opts "$DEV_DIR/vps-workers/" "$VPS_DIR/vps-workers/"
  
  # 設定ファイルをコピー（既存があっても上書き）
  cp "$DEV_DIR/package.json" "$VPS_DIR/"
  cp "$DEV_DIR/package-lock.json" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/tsconfig.json" "$VPS_DIR/"
  cp "$DEV_DIR/next.config.ts" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/tailwind.config.ts" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/postcss.config.mjs" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/middleware.ts" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/ecosystem.config.js" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/.eslintrc.json" "$VPS_DIR/" 2>/dev/null || true
  cp "$DEV_DIR/.eslintignore" "$VPS_DIR/" 2>/dev/null || true
  
  # .env.local は存在しない場合のみコピー（既存を上書きしない）
  if [ ! -f "$VPS_DIR/.env.local" ] && [ -f "$DEV_DIR/.env.local" ]; then
    cp "$DEV_DIR/.env.local" "$VPS_DIR/.env.local"
    log_success ".env.local を新規コピー"
  else
    log_info ".env.local は既存を保持"
  fi
  
  log_success "同期完了"
}

# ローカルでビルド
build_local() {
  log_info "ローカルでビルド中..."
  
  cd "$VPS_DIR"
  
  # node_modulesがなければインストール
  if [ ! -d "node_modules" ]; then
    log_info "npm install 実行中..."
    npm install
  fi
  
  # 古いビルドを削除
  rm -rf .next
  
  # ビルド実行
  npm run build
  
  # BUILD_ID確認
  if [ ! -f ".next/BUILD_ID" ]; then
    log_error "BUILD_ID が生成されませんでした"
    exit 1
  fi
  
  BUILD_ID=$(cat .next/BUILD_ID)
  log_success "ビルド成功！ BUILD_ID: $BUILD_ID"
}

# VPSサーバーにデプロイ
deploy_to_vps() {
  log_info "VPSサーバーにデプロイ中..."
  
  cd "$VPS_DIR"
  
  # .nextをVPSに転送
  rsync -avz --delete .next/ $VPS_HOST:$VPS_REMOTE_DIR/.next/
  
  # 必要なファイルも転送（.env.localは転送しない = VPS側の設定を保持）
  rsync -avz package.json $VPS_HOST:$VPS_REMOTE_DIR/
  
  # PM2再起動
  log_info "PM2 再起動中..."
  ssh $VPS_HOST "cd $VPS_REMOTE_DIR && pm2 restart n3"
  
  # 待機
  sleep 5
  
  # ステータス確認
  ssh $VPS_HOST "pm2 status n3"
  
  log_success "デプロイ完了！"
  echo ""
  echo "確認URL: https://n3.emverze.com"
}

# サイズ確認
show_size() {
  echo ""
  log_info "VPSフォルダのサイズ:"
  du -sh "$VPS_DIR" 2>/dev/null || echo "フォルダが存在しません"
  echo ""
  
  # 主要フォルダのサイズ
  log_info "内訳:"
  du -sh "$VPS_DIR/app" 2>/dev/null || true
  du -sh "$VPS_DIR/components" 2>/dev/null || true
  du -sh "$VPS_DIR/lib" 2>/dev/null || true
  du -sh "$VPS_DIR/node_modules" 2>/dev/null || true
  echo ""
}

# メイン処理
main() {
  case "$1" in
    --clean)
      clean_vps_dir
      sync_to_vps_dir
      show_size
      ;;
    --build)
      sync_to_vps_dir
      build_local
      deploy_to_vps
      ;;
    --full)
      clean_vps_dir
      sync_to_vps_dir
      build_local
      deploy_to_vps
      ;;
    *)
      sync_to_vps_dir
      show_size
      echo ""
      echo "============================================"
      echo "次のステップ:"
      echo "  1. cd ~/n3-frontend_vps && npm install"
      echo "  2. npm run build"
      echo "  3. ./scripts/vps-sync.sh --build でデプロイ"
      echo ""
      echo "または一括実行:"
      echo "  ./scripts/vps-sync.sh --full"
      echo "============================================"
      ;;
  esac
}

main "$@"
