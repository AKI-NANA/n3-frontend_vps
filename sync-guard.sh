#!/bin/bash
# ============================================================
# 🏛️ Imperial Sync Guard - Mac同期前ロックチェック
# ============================================================
#
# 用途: Mac → VPS の同期前に NIGHTLY_ACTIVE.lock を確認し、
#       存在すればアップロードを強制停止する。
#
# 既存の同期スクリプト (auto-sync.sh, sync-to-production.sh 等) の
# 先頭に以下を追加して使う:
#
#   source scripts/sync-guard.sh
#   check_nightly_lock || exit 1
#
# または単体実行:
#   bash scripts/sync-guard.sh
#
# ============================================================

VPS_USER="${VPS_USER:-root}"
VPS_HOST="${VPS_HOST:-your-vps-ip}"
VPS_PROJECT_DIR="${VPS_PROJECT_DIR:-/root/n3-frontend_new}"
VPS_LOCK_PATH="${VPS_PROJECT_DIR}/governance/NIGHTLY_ACTIVE.lock"
LOCAL_LOCK_PATH="$(dirname "$(dirname "$0")")/governance/NIGHTLY_ACTIVE.lock"

check_nightly_lock() {
  # ローカルのロックチェック
  if [ -f "$LOCAL_LOCK_PATH" ]; then
    echo ""
    echo "🚨🚨🚨 同期ブロック 🚨🚨🚨"
    echo ""
    echo "❌ NIGHTLY_ACTIVE.lock が検出されました！"
    echo "   AIミッションが進行中、または承認待ちです。"
    echo ""
    echo "ロック内容:"
    cat "$LOCAL_LOCK_PATH" 2>/dev/null
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⛔ 同期は強制停止されました。"
    echo ""
    echo "対処方法:"
    echo "  1. npm run pull-nightly で成果を回収"
    echo "  2. npm run unlock-force でロックを解除"
    echo "  3. その後、同期を再実行"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    return 1
  fi

  # VPSのロックチェック（SSH接続可能な場合）
  VPS_CHECK=$(ssh "$VPS_USER@$VPS_HOST" "test -f '$VPS_LOCK_PATH' && echo 'LOCKED' || echo 'FREE'" 2>/dev/null || echo "SSH_FAIL")

  if [ "$VPS_CHECK" = "LOCKED" ]; then
    echo ""
    echo "🚨🚨🚨 VPS同期ブロック 🚨🚨🚨"
    echo ""
    echo "❌ VPS上に NIGHTLY_ACTIVE.lock が検出されました！"
    echo "   AIミッションが進行中です。同期するとAIの成果を破壊します。"
    echo ""
    echo "VPSロック内容:"
    ssh "$VPS_USER@$VPS_HOST" "cat '$VPS_LOCK_PATH'" 2>/dev/null
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⛔ 同期は強制停止されました。"
    echo ""
    echo "対処方法:"
    echo "  1. VPSでの成果を確認: http://$VPS_HOST:3001"
    echo "  2. npm run pull-nightly で成果を回収"
    echo "  3. npm run unlock-force でロックを解除"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    return 1
  fi

  if [ "$VPS_CHECK" = "SSH_FAIL" ]; then
    echo "⚠️  VPS接続確認失敗（SSH不通）- ロックチェックをスキップ"
    echo "   ⚠️ VPSが稼働中の場合、AIの成果を上書きするリスクがあります"
    read -p "   それでも同期を続行しますか？ [y/N]: " force_continue
    if [[ ! "$force_continue" =~ ^[Yy]$ ]]; then
      echo "❌ 同期をキャンセルしました。"
      return 1
    fi
  fi

  echo "✅ ロックチェック: クリア（同期可能）"
  return 0
}

# 単体実行時
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  echo "🏛️ Sync Guard - ロックチェック実行"
  check_nightly_lock
  exit $?
fi
