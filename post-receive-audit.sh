#!/bin/bash
# ============================================================
# 🏛️ Git Post-Receive Hook — 自動浄化 + 自動監査
# ============================================================
#
# Mac から git push された瞬間に VPS 上で実行:
#   1. imperial-cleanser.js（パス浄化）
#   2. Law-to-Code（法典 → ルール同期）
#   3. total-empire-audit.js（監査）
#   4. audit-registry-sync.js（レジストリ同期）
#   5. guard.js（ブロック判定）
#
# 設置:
#   cp scripts/post-receive-audit.sh .git/hooks/post-receive
#   chmod +x .git/hooks/post-receive
#   (setup-empire-os.sh が自動で行う)
#
# ============================================================

set -e

PROJECT_DIR="/root/n3-frontend_new"
GOVERNANCE_DIR="$PROJECT_DIR/governance"
LOG_FILE="$PROJECT_DIR/logs/git-hook-audit.log"

mkdir -p "$(dirname "$LOG_FILE")"

echo "" >> "$LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$LOG_FILE"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 📦 Git push 受信 — 自動浄化+監査開始" >> "$LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$LOG_FILE"

cd "$PROJECT_DIR"

# 最新コードをチェックアウト
if [ -d "$PROJECT_DIR/.git" ]; then
  git reset --hard HEAD 2>/dev/null || true
fi

# ============================================================
# Step 0: ロックチェック（夜間開発中は浄化しない）
# ============================================================

if [ -f "$GOVERNANCE_DIR/NIGHTLY_ACTIVE.lock" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔒 NIGHTLY_ACTIVE.lock 検出 — 浄化をスキップ" >> "$LOG_FILE"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔒 夜間開発ロック中 — 自動浄化をスキップしました"
  echo "   ロック解除: npm run unlock-force"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  exit 0
fi

# ============================================================
# Step 1: 自動浄化（imperial-cleanser.js）
# ============================================================

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🧹 Step 1: 自動浄化（パス変換）実行中..." >> "$LOG_FILE"

if [ -f "$GOVERNANCE_DIR/imperial-cleanser.js" ]; then
  node "$GOVERNANCE_DIR/imperial-cleanser.js" >> "$LOG_FILE" 2>&1 || {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️ 浄化でエラー発生（続行）" >> "$LOG_FILE"
  }
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ 自動浄化完了" >> "$LOG_FILE"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️ imperial-cleanser.js が見つかりません" >> "$LOG_FILE"
fi

# ============================================================
# Step 2: Law-to-Code（法典 → ルール同期）
# ============================================================

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 📜 Step 2: Law-to-Code 同期中..." >> "$LOG_FILE"

if [ -f "$GOVERNANCE_DIR/law-to-code.js" ]; then
  node "$GOVERNANCE_DIR/law-to-code.js" >> "$LOG_FILE" 2>&1 || {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️ Law-to-Code でエラー発生（続行）" >> "$LOG_FILE"
  }
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️ law-to-code.js が見つかりません" >> "$LOG_FILE"
fi

# ============================================================
# Step 3: 帝国監査
# ============================================================

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔍 Step 3: 帝国監査実行中..." >> "$LOG_FILE"

node "$GOVERNANCE_DIR/total-empire-audit.js" >> "$LOG_FILE" 2>&1 || {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️ 監査でエラー発生" >> "$LOG_FILE"
}

# ============================================================
# Step 4: Registry 同期
# ============================================================

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 📋 Step 4: Registry同期中..." >> "$LOG_FILE"

if [ -f "$GOVERNANCE_DIR/audit-registry-sync.js" ]; then
  node "$GOVERNANCE_DIR/audit-registry-sync.js" >> "$LOG_FILE" 2>&1 || {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️ Registry同期でエラー発生" >> "$LOG_FILE"
  }
fi

# ============================================================
# Step 5: Guard チェック
# ============================================================

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🛡️ Step 5: Guardチェック中..." >> "$LOG_FILE"

if [ -f "$GOVERNANCE_DIR/guard.js" ]; then
  node "$GOVERNANCE_DIR/guard.js" --check-registry >> "$LOG_FILE" 2>&1 || {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️ Guardチェックでエラー発生" >> "$LOG_FILE"
  }
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ 全ステップ完了" >> "$LOG_FILE"

# ============================================================
# 結果サマリー（push した人に表示）
# ============================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏛️ 帝国自動浄化+監査 完了"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# registry.json からサマリーを抽出
if [ -f "$GOVERNANCE_DIR/registry.json" ]; then
  node -e "
    try {
      const r = require('$GOVERNANCE_DIR/registry.json');
      const a = r.audit_results;
      if (a && a.summary) {
        console.log('  合格率:   ' + (a.summary.passRate || 'N/A') + '%');
        console.log('  平均スコア: ' + (a.summary.avgScore || 'N/A') + '点');
        console.log('  CRITICAL: ' + (a.summary.totalCritical || 0) + '件');
        console.log('  ERROR:    ' + (a.summary.totalErrors || 0) + '件');
        console.log('  WARNING:  ' + (a.summary.totalWarnings || 0) + '件');
      } else {
        console.log('  (監査データなし)');
      }
    } catch(e) {
      console.log('  (サマリー取得失敗)');
    }
  " 2>/dev/null || echo "  (サマリー取得失敗)"
fi

# CLEANSER_REPORT.md があれば浄化結果も表示
if [ -f "$GOVERNANCE_DIR/CLEANSER_REPORT.md" ]; then
  FIXES=$(grep -c "修正" "$GOVERNANCE_DIR/CLEANSER_REPORT.md" 2>/dev/null || echo "0")
  echo "  浄化修正: ${FIXES}件"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
