#!/bin/bash
#
# VPS初回セットアップスクリプト
# Node.js、npm、PM2などの必要なツールをインストール
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# ログファイル
LOG_FILE="$PROJECT_DIR/logs/vps-setup.log"
mkdir -p "$PROJECT_DIR/logs"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

error_exit() {
    log "❌ エラー: $1"
    exit 1
}

log "🛠️  VPS初回セットアップ開始"

# .env.localから設定を読み込み
if [ ! -f "$PROJECT_DIR/.env.local" ]; then
    error_exit ".env.localファイルが見つかりません"
fi

source "$PROJECT_DIR/.env.local"

# SSH接続テスト
log "🔌 SSH接続をテスト中..."
if ! sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" 'echo "接続OK"' >/dev/null 2>&1; then
    error_exit "VPSへの接続に失敗しました"
fi
log "✅ SSH接続成功"

# VPS上でコマンドを実行
ssh_exec() {
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" "$1"
}

# システムアップデート
log "📦 システムをアップデート中..."
ssh_exec "sudo apt-get update && sudo apt-get upgrade -y" || log "⚠️  アップデートをスキップ"

# Node.jsのインストール（nvm使用）
log "📦 Node.js ${VPS_NODE_VERSION}をインストール中..."
ssh_exec "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash" || log "⚠️  nvmは既にインストール済み"
ssh_exec "source ~/.nvm/nvm.sh && nvm install $VPS_NODE_VERSION && nvm use $VPS_NODE_VERSION && nvm alias default $VPS_NODE_VERSION" || error_exit "Node.jsのインストールに失敗しました"

# PM2のインストール
log "📦 PM2をインストール中..."
ssh_exec "source ~/.nvm/nvm.sh && npm install -g pm2" || error_exit "PM2のインストールに失敗しました"

# Gitのインストール確認
log "📦 Gitを確認中..."
ssh_exec "sudo apt-get install -y git" || log "⚠️  Gitは既にインストール済み"

# ファイアウォール設定（ufw）
log "🔒 ファイアウォールを設定中..."
ssh_exec "sudo ufw allow 22/tcp" || log "⚠️  UFW設定をスキップ"
ssh_exec "sudo ufw allow 3000/tcp" || log "⚠️  UFW設定をスキップ"
ssh_exec "sudo ufw allow 80/tcp" || log "⚠️  UFW設定をスキップ"
ssh_exec "sudo ufw allow 443/tcp" || log "⚠️  UFW設定をスキップ"

log "✅ VPS初回セットアップ完了！"
log ""
log "インストールされたツール:"
ssh_exec "source ~/.nvm/nvm.sh && node --version && npm --version && pm2 --version"
log ""
log "次のステップ:"
log "  ./scripts/deploy-vps.sh を実行してアプリケーションをデプロイしてください"
