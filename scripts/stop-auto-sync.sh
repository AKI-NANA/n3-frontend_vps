#!/bin/bash
#
# 自動同期を停止
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$PROJECT_DIR/.auto-sync.pid"

if [ ! -f "$PID_FILE" ]; then
    echo "⚠️  自動同期は実行されていません"
    exit 0
fi

PID=$(cat "$PID_FILE")

if ps -p $PID > /dev/null 2>&1; then
    kill $PID
    rm "$PID_FILE"
    echo "✅ 自動同期を停止しました (PID: $PID)"
else
    echo "⚠️  プロセスが見つかりません (PID: $PID)"
    rm "$PID_FILE"
fi
