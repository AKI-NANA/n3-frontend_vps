#!/bin/bash
#
# 自動同期をバックグラウンドで開始
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_DIR/logs/auto-sync-daemon.log"

mkdir -p "$PROJECT_DIR/logs"

echo "🚀 自動同期サービスを開始します..."

# 既存のプロセスをチェック
if [ -f "$PROJECT_DIR/.auto-sync.pid" ]; then
    OLD_PID=$(cat "$PROJECT_DIR/.auto-sync.pid")
    if ps -p $OLD_PID > /dev/null 2>&1; then
        echo "⚠️  自動同期は既に実行中です (PID: $OLD_PID)"
        exit 0
    fi
fi

# バックグラウンドで1分ごとに実行
(
    while true; do
        "$SCRIPT_DIR/auto-sync.sh" >> "$LOG_FILE" 2>&1
        sleep 60
    done
) &

PID=$!
echo $PID > "$PROJECT_DIR/.auto-sync.pid"

echo "✅ 自動同期サービスを開始しました (PID: $PID)"
echo "📝 ログ: $LOG_FILE"
echo ""
echo "停止するには: $SCRIPT_DIR/stop-auto-sync.sh"
