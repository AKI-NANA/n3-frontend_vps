#!/bin/bash
# ============================================================
# 🏛️ Imperial Empire OS - VPS一括セットアップスクリプト
# ============================================================
#
# 用途: VPS上で帝国OSの全サービスを一括でセットアップする
#
# セットアップ内容:
#   1. PM2 プロセス: 本番(n3-prod), プレビュー(imperial-preview)
#   2. Governance デーモン: auto-clean, self-healing, mission-runner
#   3. Cron ジョブ: 夜間自律開発, 定期清掃, 定期修復
#   4. ディレクトリ構造の初期化
#
# 使い方（VPS上で）:
#   cd /root/n3-frontend_new
#   bash scripts/setup-empire-os.sh
#
# ⚠️ 本番VPSでのみ実行してください
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
GOVERNANCE_DIR="$PROJECT_DIR/governance"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏛️  Imperial Empire OS - VPS一括セットアップ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 プロジェクト: $PROJECT_DIR"
echo "⏰ 実行時刻: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# ============================================================
# Step 0: 前提条件チェック
# ============================================================

echo "🔍 Step 0: 前提条件チェック"
echo "────────────────────────────────────────"

# Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js が見つかりません"
  exit 1
fi
echo "  ✅ Node.js $(node -v)"

# PM2
if ! command -v pm2 &> /dev/null; then
  echo "  ⚠️ PM2 がインストールされていません。インストール中..."
  npm install -g pm2
fi
echo "  ✅ PM2 $(pm2 -v)"

# npm dependencies
if [ ! -d "$PROJECT_DIR/node_modules" ]; then
  echo "  ⚠️ node_modules がありません。npm install 実行中..."
  cd "$PROJECT_DIR" && npm install
fi
echo "  ✅ node_modules 存在"

echo ""

# ============================================================
# Step 1: ディレクトリ構造の初期化
# ============================================================

echo "📁 Step 1: ディレクトリ構造の初期化"
echo "────────────────────────────────────────"

DIRS=(
  "$GOVERNANCE_DIR/missions/00_queue"
  "$GOVERNANCE_DIR/missions/01_running"
  "$GOVERNANCE_DIR/missions/02_done"
  "$GOVERNANCE_DIR/missions/03_failed"
  "$GOVERNANCE_DIR/logs/auto-clean"
  "$GOVERNANCE_DIR/logs/self-healing"
  "$GOVERNANCE_DIR/logs/mission-runner"
  "$GOVERNANCE_DIR/logs/inspect"
  "$GOVERNANCE_DIR/backups/self-healing"
  "$PROJECT_DIR/02_DEV_LAB/nightly-staging"
  "$PROJECT_DIR/02_DEV_LAB/01_N8N_HUB/json"
  "$PROJECT_DIR/02_DEV_LAB/02_SCRAPYARD"
  "$PROJECT_DIR/02_DEV_LAB/03_BACKENDS"
  "$PROJECT_DIR/02_DEV_LAB/04_INFRA_CONFIG/secrets"
  "$PROJECT_DIR/02_DEV_LAB/05_SKELETONS"
  "$PROJECT_DIR/02_DEV_LAB/06_ARCHIVES/bak"
)

for dir in "${DIRS[@]}"; do
  mkdir -p "$dir"
  echo "  ✅ $dir"
done

echo ""

# ============================================================
# Step 2: PM2 プロセス設定
# ============================================================

echo "⚙️  Step 2: PM2 プロセス設定"
echo "────────────────────────────────────────"

cd "$PROJECT_DIR"

# 既存プロセスを停止（エラー無視）
pm2 delete n3-prod 2>/dev/null || true
pm2 delete imperial-preview 2>/dev/null || true
pm2 delete imperial-mission-runner 2>/dev/null || true

# PM2 ecosystem ファイルを生成
cat > "$PROJECT_DIR/ecosystem.config.js" << 'ECOSYSTEM_EOF'
module.exports = {
  apps: [
    // ============================================================
    // 🏭 本番環境 (port 3000)
    // ============================================================
    {
      name: 'n3-prod',
      script: 'npm',
      args: 'start',
      cwd: process.env.HOME + '/n3-frontend_new',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      max_memory_restart: '512M',
      error_file: './logs/pm2-prod-error.log',
      out_file: './logs/pm2-prod-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },

    // ============================================================
    // 🎭 プレビュー環境 (port 3001) - AI成果の検証用
    // ============================================================
    {
      name: 'imperial-preview',
      script: 'npm',
      args: 'run dev -- -p 3001',
      cwd: process.env.HOME + '/n3-frontend_new',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        NEXT_TELEMETRY_DISABLED: 1,
      },
      max_memory_restart: '768M',
      error_file: './logs/pm2-preview-error.log',
      out_file: './logs/pm2-preview-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      // プレビューは夜間開発後に手動で起動することもある
      autorestart: false,
    },

    // ============================================================
    // 🤖 ミッションランナー（ファイル監視デーモン）
    // ============================================================
    {
      name: 'imperial-nightly-engine',
      script: 'governance/imperial-nightly-engine.js',
      args: '--watch',
      cwd: process.env.HOME + '/n3-frontend_new',
      env: {
        OLLAMA_HOST: 'localhost',
        OLLAMA_PORT: '11434',
        OLLAMA_MODEL: 'deepseek-r1:1.5b',
      },
      max_memory_restart: '256M',
      error_file: './logs/pm2-mission-error.log',
      out_file: './logs/pm2-mission-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 5000,
    },
  ],
};
ECOSYSTEM_EOF

echo "  ✅ ecosystem.config.js 生成完了"

# 本番を起動（ビルド済みの場合）
if [ -d "$PROJECT_DIR/.next" ]; then
  pm2 start ecosystem.config.js --only n3-prod
  echo "  ✅ n3-prod (port:3000) 起動"
else
  echo "  ⚠️ .next がありません。npm run build を先に実行してください"
  echo "     ビルド後: pm2 start ecosystem.config.js --only n3-prod"
fi

# プレビュー環境は停止状態で登録
pm2 start ecosystem.config.js --only imperial-preview
pm2 stop imperial-preview
echo "  ✅ imperial-preview (port:3001) 登録（停止状態）"

# ミッションランナーを起動
pm2 start ecosystem.config.js --only imperial-mission-runner
echo "  ✅ imperial-mission-runner 起動"

# PM2 保存
pm2 save
echo "  ✅ PM2 状態を保存"

echo ""

# ============================================================
# Step 3: Cron ジョブ設定
# ============================================================

echo "⏰ Step 3: Cron ジョブ設定"
echo "────────────────────────────────────────"

# 既存の帝国Cronを除去してから追加
CRON_MARKER="# === N3 EMPIRE OS ==="
CRON_TMP=$(mktemp)
crontab -l 2>/dev/null | grep -v "$CRON_MARKER" | grep -v "auto-clean.js" | grep -v "self-healing.js" | grep -v "nightly-autonomous-dev.js" | grep -v "ollama-inspector.js" > "$CRON_TMP" || true

cat >> "$CRON_TMP" << CRON_EOF

$CRON_MARKER
# 毎時: 自動清掃（野良ファイル排除 + パス洗浄）
0 * * * * cd $PROJECT_DIR && /usr/bin/node governance/auto-clean.js >> logs/cron-auto-clean.log 2>&1 $CRON_MARKER

# 毎日 06:00: 自己修復（tsconfig, tailwind等の設定ファイル検証）
0 6 * * * cd $PROJECT_DIR && /usr/bin/node governance/self-healing.js >> logs/cron-self-healing.log 2>&1 $CRON_MARKER

# 毎日 02:00: 夜間自律開発（統合版エンジン）
0 2 * * * cd $PROJECT_DIR && /usr/bin/node governance/imperial-nightly-engine.js >> logs/cron-nightly-dev.log 2>&1 $CRON_MARKER

# 毎日 01:00: Ollama ヘルスチェック
0 1 * * * cd $PROJECT_DIR && /usr/bin/node governance/ollama-inspector.js --health >> logs/cron-ollama-health.log 2>&1 $CRON_MARKER
CRON_EOF

crontab "$CRON_TMP"
rm -f "$CRON_TMP"

echo "  ✅ 毎時:   auto-clean.js"
echo "  ✅ 06:00:  self-healing.js"
echo "  ✅ 02:00:  nightly-autonomous-dev.js"
echo "  ✅ 01:00:  ollama-inspector.js --health"
echo ""

# ============================================================
# Step 3b: Git post-receive hook
# ============================================================

echo "🔗 Step 3b: Git post-receive hook 設定"
echo "────────────────────────────────────────"

HOOKS_DIR="$PROJECT_DIR/.git/hooks"
if [ -d "$HOOKS_DIR" ]; then
  cp "$PROJECT_DIR/scripts/post-receive-audit.sh" "$HOOKS_DIR/post-receive"
  chmod +x "$HOOKS_DIR/post-receive"
  echo "  ✅ post-receive hook 設置完了（git push時に自動監査）"
else
  echo "  ⚠️ .git/hooks ディレクトリが見つかりません"
fi
echo ""

# ============================================================
# Step 4: スクリプト権限設定
# ============================================================

echo "🔑 Step 4: スクリプト権限設定"
echo "────────────────────────────────────────"

chmod +x "$PROJECT_DIR/scripts/"*.sh 2>/dev/null || true
chmod +x "$GOVERNANCE_DIR/"*.js 2>/dev/null || true

echo "  ✅ scripts/*.sh に実行権限付与"
echo "  ✅ governance/*.js に実行権限付与"
echo ""

# ============================================================
# Step 5: ログディレクトリ初期化
# ============================================================

echo "📝 Step 5: ログディレクトリ初期化"
echo "────────────────────────────────────────"

mkdir -p "$PROJECT_DIR/logs"
echo "  ✅ logs/ ディレクトリ作成"
echo ""

# ============================================================
# 最終レポート
# ============================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 セットアップ完了レポート"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🏭 PM2 プロセス:"
pm2 list
echo ""
echo "⏰ Cron ジョブ:"
crontab -l 2>/dev/null | grep "$CRON_MARKER" -A1 | grep -v "$CRON_MARKER"
echo ""
echo "🔗 アクセスURL:"
echo "   本番:     http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo 'VPS_IP'):3000"
echo "   プレビュー: http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo 'VPS_IP'):3001"
echo ""
echo "📋 運用コマンド:"
echo "   pm2 logs n3-prod              # 本番ログ"
echo "   pm2 logs imperial-preview     # プレビューログ"
echo "   pm2 logs imperial-mission-runner  # ミッションログ"
echo "   pm2 restart imperial-preview  # プレビュー再起動"
echo "   npm run unlock-force          # ロック解除（陛下専用）"
echo ""
echo "🏛️ 帝国OSセットアップ完了。全システム稼働中。"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
