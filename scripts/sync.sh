#!/bin/bash

##############################################################################
# P2: ローカル自動同期スクリプト (Git Pull Automation)
##############################################################################
# このスクリプトは1分ごとに実行され、リモートリポジトリから最新の変更を取得します。
# Vercelデプロイ制限回避のための開発環境安定化を目的としています。
##############################################################################

# 設定
PROJECT_DIR="/home/user/n3-frontend_new"
LOG_FILE="$PROJECT_DIR/logs/sync.log"
LOCK_FILE="$PROJECT_DIR/tmp/sync.lock"

# ログディレクトリ作成
mkdir -p "$PROJECT_DIR/logs"
mkdir -p "$PROJECT_DIR/tmp"

# 日時関数
timestamp() {
  date "+%Y-%m-%d %H:%M:%S"
}

# ログ出力
log() {
  echo "[$(timestamp)] $1" | tee -a "$LOG_FILE"
}

# ロックファイルチェック（多重実行防止）
if [ -f "$LOCK_FILE" ]; then
  log "INFO: 同期処理が既に実行中です。スキップします。"
  exit 0
fi

# ロックファイル作成
touch "$LOCK_FILE"

# 終了時にロックファイルを削除
trap "rm -f $LOCK_FILE" EXIT

# プロジェクトディレクトリに移動
cd "$PROJECT_DIR" || {
  log "ERROR: プロジェクトディレクトリが見つかりません: $PROJECT_DIR"
  exit 1
}

# Gitリポジトリかチェック
if [ ! -d ".git" ]; then
  log "ERROR: Gitリポジトリではありません: $PROJECT_DIR"
  exit 1
fi

# 現在のブランチを取得
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
log "INFO: 現在のブランチ: $CURRENT_BRANCH"

# リモートの変更を取得（Fetch）
log "INFO: リモートの変更を取得中..."
git fetch origin 2>&1 | tee -a "$LOG_FILE"

if [ $? -ne 0 ]; then
  log "ERROR: git fetchに失敗しました"
  exit 1
fi

# ローカルとリモートのコミットハッシュを比較
LOCAL_HASH=$(git rev-parse HEAD)
REMOTE_HASH=$(git rev-parse "origin/$CURRENT_BRANCH")

if [ "$LOCAL_HASH" = "$REMOTE_HASH" ]; then
  log "INFO: 最新の状態です。変更はありません。"
  exit 0
fi

log "INFO: リモートに新しい変更があります"
log "INFO: ローカル: $LOCAL_HASH"
log "INFO: リモート: $REMOTE_HASH"

# 未コミットの変更があるかチェック
if ! git diff-index --quiet HEAD --; then
  log "WARN: 未コミットの変更があります。Stashに保存してから pull します。"
  git stash push -m "Auto-stash by sync.sh at $(timestamp)" 2>&1 | tee -a "$LOG_FILE"
  STASHED=true
else
  STASHED=false
fi

# Pull実行
log "INFO: git pull を実行中..."
git pull origin "$CURRENT_BRANCH" 2>&1 | tee -a "$LOG_FILE"

if [ $? -ne 0 ]; then
  log "ERROR: git pull に失敗しました"
  if [ "$STASHED" = true ]; then
    log "INFO: Stashを復元します..."
    git stash pop
  fi
  exit 1
fi

log "SUCCESS: 同期完了"

# Stashを復元
if [ "$STASHED" = true ]; then
  log "INFO: Stashを復元します..."
  git stash pop 2>&1 | tee -a "$LOG_FILE"
fi

# npm installが必要かチェック（package.jsonが更新された場合）
if git diff "$LOCAL_HASH" "$REMOTE_HASH" --name-only | grep -q "package.json"; then
  log "INFO: package.jsonが更新されました。npm install を実行します..."
  npm install 2>&1 | tee -a "$LOG_FILE"

  if [ $? -eq 0 ]; then
    log "SUCCESS: npm install 完了"
  else
    log "ERROR: npm install に失敗しました"
  fi
fi

log "INFO: 同期サイクル完了"
exit 0
