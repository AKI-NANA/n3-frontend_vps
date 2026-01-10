#!/bin/bash
# メモリ監視（自動アラート付き）

echo "👀 メモリ監視開始"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Node.jsが3GB超えたら自動で警告します"
echo ""

THRESHOLD=3000 # 3GB

while true; do
  # Node.jsのメモリ使用量を取得（MB）
  NODE_MEM=$(ps aux | grep "next dev" | grep -v grep | awk '{sum+=$6} END {print int(sum/1024)}')
  
  if [ -n "$NODE_MEM" ] && [ "$NODE_MEM" -gt 0 ]; then
    clear
    echo "$(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    if [ "$NODE_MEM" -gt "$THRESHOLD" ]; then
      echo "🚨 警告: Node.jsのメモリ使用量が ${NODE_MEM}MB"
      echo ""
      echo "推奨アクション:"
      echo "  1. Ctrl+C でこの監視を止める"
      echo "  2. 開発サーバーを再起動"
      echo ""
      
      # ビープ音
      printf '\a'
      
    else
      echo "✅ Node.js メモリ使用量: ${NODE_MEM}MB / ${THRESHOLD}MB"
    fi
    
    # システム全体のメモリ
    echo ""
    echo "=== システム全体 ==="
    vm_stat | awk '
      /Pages free/ {free=$3}
      /Pages active/ {active=$3}
      /Pages wired/ {wired=$3}
      END {
        printf "空き: %.1f GB\n", free*4096/1024/1024/1024
        printf "使用: %.1f GB\n", (active+wired)*4096/1024/1024/1024
      }
    '
  else
    echo "Node.jsプロセスが見つかりません"
  fi
  
  echo ""
  echo "Ctrl+C で終了"
  sleep 5
done
