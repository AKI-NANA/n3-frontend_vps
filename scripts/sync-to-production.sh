#!/bin/bash
# sync-to-production.sh
# 
# 開発環境から本番環境（Vercel/VPS）への自動同期スクリプト
# 
# 使い方:
#   ./sync-to-production.sh          # 全ての完成ツールを同期
#   ./sync-to-production.sh vercel   # Vercelのみ
#   ./sync-to-production.sh vps      # VPSのみ
#   ./sync-to-production.sh stocktake # 特定ツールのみ

set -e

# ディレクトリ設定
DEV_DIR=~/n3-frontend_new
VERCEL_DIR=~/n3-frontend_vercel
VPS_DIR=~/n3-frontend_vps

# 同期対象の完成ツール（ここに追加していく）
COMPLETED_TOOLS=(
  # N3ツール群
  "app/tools/editing-n3"
  "app/tools/listing-n3"
  "app/tools/operations-n3"
  "app/tools/research-n3"
  "app/tools/analytics-n3"
  "app/tools/finance-n3"
  "app/tools/settings-n3"
  # 外部ツール
  "app/(external)/stocktake"
)

# 同期対象のAPI
COMPLETED_APIS=(
  "app/api/inventory/bulk-upload-folder"
  "app/api/inventory/bulk-upload"
  "app/api/inventory/upload-image"
  "app/api/inventory/update-location"
)

# 同期対象の共通ファイル
COMMON_FILES=(
  "lib/supabase"
  "components/n3"
  "components/ui"
  "contexts"
  "types/inventory.ts"
)

# 色付き出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# ディレクトリ存在確認
check_directories() {
  if [ ! -d "$DEV_DIR" ]; then
    log_error "開発ディレクトリが見つかりません: $DEV_DIR"
    exit 1
  fi
  
  if [ ! -d "$VERCEL_DIR" ] && [ "$1" != "vps" ]; then
    log_warning "Vercelディレクトリが見つかりません: $VERCEL_DIR"
  fi
  
  if [ ! -d "$VPS_DIR" ] && [ "$1" != "vercel" ]; then
    log_warning "VPSディレクトリが見つかりません: $VPS_DIR"
  fi
}

# ファイル/ディレクトリを同期
sync_path() {
  local src="$DEV_DIR/$1"
  local target_dir="$2"
  local dest="$target_dir/$1"
  
  if [ ! -e "$src" ]; then
    log_warning "ソースが見つかりません: $1"
    return
  fi
  
  # 親ディレクトリを作成
  mkdir -p "$(dirname "$dest")"
  
  # ディレクトリの場合
  if [ -d "$src" ]; then
    rm -rf "$dest"
    cp -r "$src" "$dest"
  else
    cp "$src" "$dest"
  fi
  
  log_success "同期完了: $1"
}

# 特定ターゲットに同期
sync_to_target() {
  local target_name="$1"
  local target_dir="$2"
  
  if [ ! -d "$target_dir" ]; then
    log_error "$target_name ディレクトリが存在しません: $target_dir"
    return 1
  fi
  
  echo ""
  log_info "========================================="
  log_info "同期先: $target_name ($target_dir)"
  log_info "========================================="
  
  echo ""
  log_info "📁 ツールを同期中..."
  for tool in "${COMPLETED_TOOLS[@]}"; do
    sync_path "$tool" "$target_dir"
  done
  
  echo ""
  log_info "🔌 APIを同期中..."
  for api in "${COMPLETED_APIS[@]}"; do
    sync_path "$api" "$target_dir"
  done
  
  echo ""
  log_info "📦 共通ファイルを同期中..."
  for common in "${COMMON_FILES[@]}"; do
    sync_path "$common" "$target_dir"
  done
  
  echo ""
  log_success "$target_name への同期が完了しました！"
}

# メイン処理
main() {
  echo ""
  echo "============================================"
  echo "  N3 本番環境同期スクリプト"
  echo "============================================"
  echo ""
  
  local target="$1"
  
  check_directories "$target"
  
  case "$target" in
    vercel)
      sync_to_target "Vercel" "$VERCEL_DIR"
      ;;
    vps)
      sync_to_target "VPS" "$VPS_DIR"
      ;;
    "")
      # 両方に同期
      if [ -d "$VERCEL_DIR" ]; then
        sync_to_target "Vercel" "$VERCEL_DIR"
      fi
      if [ -d "$VPS_DIR" ]; then
        sync_to_target "VPS" "$VPS_DIR"
      fi
      ;;
    *)
      # 特定ツールのみ同期
      log_info "特定ツール '$target' を同期中..."
      if [ -d "$VERCEL_DIR" ]; then
        sync_path "app/tools/$target" "$VERCEL_DIR"
        sync_path "app/(external)/$target" "$VERCEL_DIR" 2>/dev/null || true
      fi
      if [ -d "$VPS_DIR" ]; then
        sync_path "app/tools/$target" "$VPS_DIR"
        sync_path "app/(external)/$target" "$VPS_DIR" 2>/dev/null || true
      fi
      ;;
  esac
  
  echo ""
  echo "============================================"
  log_success "同期完了！"
  echo ""
  echo "次のステップ:"
  echo "  Vercel: cd $VERCEL_DIR && git add -A && git commit -m 'sync' && git push"
  echo "  VPS:    cd $VPS_DIR && git add -A && git commit -m 'sync' && git push"
  echo "============================================"
}

main "$@"
