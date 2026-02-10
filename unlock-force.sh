#!/bin/bash
# ============================================================
# 🏛️ Imperial Unlock Force - 陛下専用ロック解除
# ============================================================
# 
# 用途: 夜間AIミッション完了後、陛下が手動でロックを解除する
# 
# 使い方:
#   npm run unlock-force
#   または
#   bash scripts/unlock-force.sh
#
# ⚠️ AIがこのスクリプトを自動実行することは禁止
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOCK_FILE="$PROJECT_DIR/governance/NIGHTLY_ACTIVE.lock"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏛️  Imperial Unlock Force"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ロックファイルの存在確認
if [ ! -f "$LOCK_FILE" ]; then
  echo "✅ ロックファイルは存在しません。システムはフリー状態です。"
  exit 0
fi

# ロック内容を表示
echo "🔒 現在のロック状態:"
echo "────────────────────────────────────────"
cat "$LOCK_FILE"
echo ""
echo "────────────────────────────────────────"
echo ""

# 確認プロンプト
echo "⚠️  このロックを解除しますか？"
echo "   これにより Mac からの同期が再び許可されます。"
echo ""
read -p "   ロック解除を承認 [y/N]: " confirm

if [[ "$confirm" =~ ^[Yy]$ ]]; then
  rm -f "$LOCK_FILE"
  echo ""
  echo "🔓 ロックを解除しました。"
  echo "   Mac からの同期が許可されます。"
  echo "   次のステップ: npm run pull-nightly でVPSの成果を回収"
else
  echo ""
  echo "❌ キャンセルしました。ロックは維持されます。"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
