#!/bin/bash
# 緊急リセットスクリプト

echo "🆘 緊急リセット"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. 全Node.jsプロセス強制終了
echo "1. プロセス終了中..."
pkill -9 node
sleep 2
echo "   ✓ 完了"

# 2. キャッシュ完全削除
echo "2. キャッシュ削除中..."
rm -rf .next .swc node_modules/.cache
find . -name ".DS_Store" -delete
echo "   ✓ 完了"

# 3. メモリ解放
echo "3. メモリ解放中..."
sudo purge
echo "   ✓ 完了"

# 4. 状態確認
echo "4. 状態確認:"
echo "   空きメモリ:"
vm_stat | awk '/Pages free/ {printf "   %.1f GB\n", $3*4096/1024/1024/1024}'

echo ""
echo "✅ リセット完了"
echo ""
echo "次のコマンドで起動してください:"
echo "  ./safe-start.sh"
