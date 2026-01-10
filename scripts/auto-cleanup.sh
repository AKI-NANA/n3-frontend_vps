#!/bin/bash
# ============================================================
# N3 自動クリーンアップスクリプト
# CPU使用率を監視し、閾値を超えたら自動でNode.jsを終了
# 
# 使用方法:
#   ./scripts/auto-cleanup.sh        # フォアグラウンド実行
#   ./scripts/auto-cleanup.sh &      # バックグラウンド実行
#   nohup ./scripts/auto-cleanup.sh > /dev/null 2>&1 &  # 永続実行
#
# 停止方法:
#   pkill -f auto-cleanup
# ============================================================

# 設定
CPU_THRESHOLD=80        # CPU使用率の閾値（%）
CHECK_INTERVAL=300      # 監視間隔（秒）= 5分
LOG_FILE=~/n3-frontend_new/logs/auto-cleanup.log
MAX_LOG_SIZE=1048576    # ログファイルの最大サイズ（1MB）

# ログディレクトリ作成
mkdir -p "$(dirname "$LOG_FILE")"

# ログ出力関数
log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $1" | tee -a "$LOG_FILE"
}

# ログローテーション
rotate_log() {
    if [ -f "$LOG_FILE" ] && [ $(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null) -gt $MAX_LOG_SIZE ]; then
        mv "$LOG_FILE" "${LOG_FILE}.old"
        log "ログファイルをローテーションしました"
    fi
}

# CPU使用率を取得（macOS対応）
get_cpu_usage() {
    # top コマンドからCPU idle を取得し、100から引く
    local idle=$(top -l 1 -n 0 2>/dev/null | grep "CPU usage" | awk '{print $7}' | tr -d '%')
    if [ -z "$idle" ]; then
        echo "0"
    else
        echo $((100 - ${idle%.*}))
    fi
}

# Node.jsプロセスのCPU使用率を取得
get_node_cpu() {
    ps aux | grep -E '[n]ode|[n]ext' | awk '{sum += $3} END {print int(sum)}'
}

# クリーンアップ実行
do_cleanup() {
    log "⚠️  高負荷検出！クリーンアップを開始します..."
    
    # Node.jsプロセスを終了
    local killed=0
    
    # next-server を優先的に終了
    if pgrep -f "next-server" > /dev/null; then
        pkill -9 -f "next-server"
        killed=$((killed + 1))
        log "  ✓ next-server を終了"
    fi
    
    # node プロセスを終了
    if pgrep -f "node.*next" > /dev/null; then
        pkill -9 -f "node.*next"
        killed=$((killed + 1))
        log "  ✓ node (next) を終了"
    fi
    
    # ポート3000を解放
    local port_pids=$(lsof -ti :3000 2>/dev/null)
    if [ -n "$port_pids" ]; then
        echo "$port_pids" | xargs kill -9 2>/dev/null
        log "  ✓ ポート3000を解放"
    fi
    
    # メモリ解放（macOSのみ）
    if command -v purge &> /dev/null; then
        sudo purge 2>/dev/null && log "  ✓ メモリを解放"
    fi
    
    log "✅ クリーンアップ完了（${killed}個のプロセスを終了）"
    
    # 通知（macOS）
    if command -v osascript &> /dev/null; then
        osascript -e 'display notification "Node.jsプロセスを自動終了しました" with title "N3 Auto Cleanup" sound name "Glass"' 2>/dev/null
    fi
}

# メイン処理
main() {
    log "🚀 N3 自動クリーンアップを開始（閾値: ${CPU_THRESHOLD}%, 間隔: ${CHECK_INTERVAL}秒）"
    log "   停止するには: pkill -f auto-cleanup"
    
    while true; do
        rotate_log
        
        # CPU使用率を取得
        local cpu_usage=$(get_cpu_usage)
        local node_cpu=$(get_node_cpu)
        
        # 現在の状態をログ
        log "📊 CPU: ${cpu_usage}% (Node: ${node_cpu}%)"
        
        # 閾値チェック
        if [ "$cpu_usage" -gt "$CPU_THRESHOLD" ] || [ "$node_cpu" -gt "$CPU_THRESHOLD" ]; then
            do_cleanup
            # クリーンアップ後は少し長めに待機
            sleep 60
        fi
        
        sleep "$CHECK_INTERVAL"
    done
}

# シグナルハンドラ
cleanup_on_exit() {
    log "🛑 自動クリーンアップを終了します"
    exit 0
}

trap cleanup_on_exit SIGTERM SIGINT

# 実行
main
