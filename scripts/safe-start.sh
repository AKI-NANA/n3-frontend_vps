#!/bin/bash
# 安全起動スクリプト（メモリリーク防止）

echo "🛡️  N3 Frontend 安全起動"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. 既存プロセスチェック
echo "1. 既存プロセスをチェック中..."
EXISTING=$(ps aux | grep "next dev" | grep -v grep)
if [ -n "$EXISTING" ]; then
  echo "   ⚠️  既存の開発サーバーを検出しました"
  echo "   終了しますか? (y/n)"
  read -r response
  if [[ "$response" =~ ^[Yy]$ ]]; then
    pkill -f "next dev"
    echo "   ✓ 終了しました"
    sleep 2
  else
    echo "   ✗ 起動を中止します"
    exit 1
  fi
else
  echo "   ✓ 問題なし"
fi

# 2. メモリチェック
echo "2. メモリ状況をチェック中..."
FREE_MEM=$(vm_stat | awk '/Pages free/ {print $3}' | sed 's/\.//')
FREE_MB=$((FREE_MEM * 4096 / 1024 / 1024))

if [ $FREE_MB -lt 1024 ]; then
  echo "   ⚠️  空きメモリが少ない (${FREE_MB}MB)"
  echo "   メモリを解放しますか? (要sudo) (y/n)"
  read -r response
  if [[ "$response" =~ ^[Yy]$ ]]; then
    sudo purge
    echo "   ✓ 解放しました"
    sleep 2
  fi
else
  echo "   ✓ 空きメモリ: ${FREE_MB}MB"
fi

# 3. キャッシュクリア
echo "3. キャッシュをクリア中..."
rm -rf .next .swc node_modules/.cache
echo "   ✓ 完了"

# 4. ディスク容量チェック
echo "4. ディスク容量をチェック中..."
FREE_DISK=$(df -h / | tail -1 | awk '{print $4}')
echo "   空き容量: $FREE_DISK"

# 5. 起動
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 事前チェック完了"
echo ""
echo "起動オプションを選択してください:"
echo "  1) 通常モード (1GB メモリ制限)"
echo "  2) 安全モード (512MB メモリ制限) ← 推奨"
echo "  3) 超軽量モード (512MB メモリ制限 / ポート3002)"
echo "  4) キャンセル"
echo ""
read -p "選択 (1-4): " choice

case $choice in
  1)
    echo ""
    echo "🚀 通常モードで起動中..."
    npm run dev
    ;;
  2)
    echo ""
    echo "🛡️  安全モードで起動中..."
    npm run dev:safe
    ;;
  3)
    echo ""
    echo "🪶 超軽量モードで起動中..."
    npm run dev:ultra-light
    ;;
  4)
    echo "キャンセルしました"
    exit 0
    ;;
  *)
    echo "無効な選択です"
    exit 1
    ;;
esac
