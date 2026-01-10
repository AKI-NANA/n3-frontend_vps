#!/bin/bash
#
# VPSデプロイスクリプト
# mainブランチをVPSにデプロイします
#

set -e  # エラーで停止

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# ログファイル
LOG_FILE="$PROJECT_DIR/logs/vps-deploy.log"
mkdir -p "$PROJECT_DIR/logs"

# タイムスタンプ付きログ出力
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# エラーハンドリング
error_exit() {
    log "❌ エラー: $1"
    exit 1
}

log "🚀 VPSデプロイ開始"

# .env.localから設定を読み込み
if [ ! -f "$PROJECT_DIR/.env.local" ]; then
    error_exit ".env.localファイルが見つかりません"
fi

source "$PROJECT_DIR/.env.local"

# 必須変数のチェック
if [ -z "$VPS_HOST" ] || [ -z "$VPS_USER" ] || [ -z "$VPS_PASSWORD" ]; then
    error_exit "VPS接続情報が設定されていません（.env.localを確認）"
fi

log "📍 デプロイ先: $VPS_USER@$VPS_HOST"
log "📁 プロジェクトパス: $VPS_PROJECT_PATH"

# SSH接続テスト
log "🔌 SSH接続をテスト中..."
if ! sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" 'echo "接続OK"' >/dev/null 2>&1; then
    error_exit "VPSへの接続に失敗しました。ファイアウォール設定を確認してください。"
fi
log "✅ SSH接続成功"

# VPS上でコマンドを実行
ssh_exec() {
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" "$1"
}

# プロジェクトディレクトリが存在するかチェック
log "📂 プロジェクトディレクトリを確認中..."
if ssh_exec "[ -d $VPS_PROJECT_PATH ]"; then
    log "✅ プロジェクトディレクトリが存在します"

    # git pullでデプロイ
    log "⬇️  最新コードを取得中..."
    ssh_exec "cd $VPS_PROJECT_PATH && git pull origin main" || error_exit "git pullに失敗しました"

else
    log "⚠️  プロジェクトディレクトリが存在しません。初回セットアップを実行します..."

    # プロジェクトディレクトリを作成
    log "📁 ディレクトリを作成中..."
    ssh_exec "sudo mkdir -p $VPS_PROJECT_PATH && sudo chown $VPS_USER:$VPS_USER $VPS_PROJECT_PATH" || error_exit "ディレクトリ作成に失敗しました"

    # Gitリポジトリをクローン
    log "📥 Gitリポジトリをクローン中..."
    ssh_exec "git clone https://github.com/AKI-NANA/n3-frontend_new.git $VPS_PROJECT_PATH" || error_exit "git cloneに失敗しました"

    log "✅ 初回セットアップ完了"
fi

# mainブランチに切り替え
log "🔄 mainブランチに切り替え中..."
ssh_exec "cd $VPS_PROJECT_PATH && git checkout main" || error_exit "ブランチ切り替えに失敗しました"

# .vpsignoreに記載されたファイル/ディレクトリを削除
log "🗑️  VPS除外ファイルを削除中..."
ssh_exec "cd $VPS_PROJECT_PATH && \
    rm -rf _参考資料 _backups src __tests__ && \
    rm -rf app/test app/test-fees app/test-modal app/test-policy app/test-shipping-v2 app/system-test app/ebay-api-test && \
    rm -f app/globals-v2.css app/layout.tsx.current_backup README_BACKUP.md && \
    rm -rf app/shipping-policy-manager-original && \
    rm -f *.sh" || log "⚠️  一部の除外ファイル削除をスキップ"
log "✅ VPS除外ファイル削除完了"

# 依存関係をインストール
log "📦 依存関係をインストール中..."
ssh_exec "cd $VPS_PROJECT_PATH && npm install --production" || error_exit "npm installに失敗しました"

# ビルド
log "🔨 ビルド中..."
ssh_exec "cd $VPS_PROJECT_PATH && npm run build" || error_exit "ビルドに失敗しました"

# PM2で再起動（PM2がインストールされている場合）
log "🔄 アプリケーションを再起動中..."
if ssh_exec "which pm2 >/dev/null 2>&1"; then
    ssh_exec "cd $VPS_PROJECT_PATH && pm2 restart $VPS_PM2_APP_NAME || pm2 start npm --name $VPS_PM2_APP_NAME -- start" || log "⚠️  PM2再起動をスキップ"
else
    log "⚠️  PM2がインストールされていません。手動でアプリケーションを起動してください。"
fi

log "🎉 VPSデプロイ完了！"
log ""
log "次のステップ:"
log "  1. VPS上でアプリケーションが起動しているか確認"
log "  2. ブラウザでアクセス: http://$VPS_HOST:3000"
log "  3. PM2でプロセス管理: ssh $VPS_USER@$VPS_HOST 'pm2 list'"
