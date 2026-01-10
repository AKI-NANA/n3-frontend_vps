#!/bin/bash
# git-pull-all.sh
# 3つのリポジトリを一括でPull（バックアップ付き）

echo ""
echo "============================================"
echo "  N3 Git Pull（3環境一括）"
echo "============================================"
echo ""

DEV_DIR=~/n3-frontend_new
VERCEL_DIR=~/n3-frontend_vercel
VPS_DIR=~/n3-frontend_vps
BACKUP_DIR=~/n3-backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# バックアップフォルダ作成
mkdir -p "$BACKUP_DIR"

# 引数チェック
BACKUP_FIRST=false
if [ "$1" = "--backup" ] || [ "$1" = "-b" ]; then
    BACKUP_FIRST=true
fi

# バックアップ関数
backup_folder() {
    local src=$1
    local name=$2
    
    if [ -d "$src" ]; then
        echo "  📦 $name をバックアップ中..."
        cd "$(dirname $src)"
        zip -rq "$BACKUP_DIR/${name}_${TIMESTAMP}.zip" "$(basename $src)" \
            -x "*.git*" -x "*node_modules*" -x "*.next*"
        echo "  ✅ $BACKUP_DIR/${name}_${TIMESTAMP}.zip"
    fi
}

# バックアップ実行
if [ "$BACKUP_FIRST" = true ]; then
    echo "📦 Step 1: 既存フォルダをバックアップ"
    echo "--------------------------------------------"
    backup_folder "$DEV_DIR" "n3-frontend_new"
    backup_folder "$VERCEL_DIR" "n3-frontend_vercel"
    backup_folder "$VPS_DIR" "n3-frontend_vps"
    echo ""
fi

# Git Pull実行
echo "📥 Git Pull を実行"
echo "--------------------------------------------"

# 開発環境
echo ""
echo "🔵 [1/3] 開発環境 (n3-frontend_new)"
if [ -d "$DEV_DIR" ]; then
    cd "$DEV_DIR"
    git fetch origin
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ "$LOCAL" = "$REMOTE" ]; then
        echo "  ✅ 既に最新です"
    else
        git pull origin main
        if [ $? -eq 0 ]; then
            echo "  ✅ Pull完了"
        else
            echo "  ❌ Pull失敗（コンフリクトの可能性）"
        fi
    fi
else
    echo "  ⚠️  ディレクトリが存在しません"
fi

# Vercel環境
echo ""
echo "☁️  [2/3] Vercel環境 (n3-frontend_vercel)"
if [ -d "$VERCEL_DIR" ]; then
    cd "$VERCEL_DIR"
    git fetch origin
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ "$LOCAL" = "$REMOTE" ]; then
        echo "  ✅ 既に最新です"
    else
        git pull origin main
        if [ $? -eq 0 ]; then
            echo "  ✅ Pull完了"
        else
            echo "  ❌ Pull失敗（コンフリクトの可能性）"
        fi
    fi
else
    echo "  ⚠️  ディレクトリが存在しません"
fi

# VPS環境
echo ""
echo "🖥️  [3/3] VPS環境 (n3-frontend_vps)"
if [ -d "$VPS_DIR" ]; then
    cd "$VPS_DIR"
    git fetch origin
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ "$LOCAL" = "$REMOTE" ]; then
        echo "  ✅ 既に最新です"
    else
        git pull origin main
        if [ $? -eq 0 ]; then
            echo "  ✅ Pull完了"
        else
            echo "  ❌ Pull失敗（コンフリクトの可能性）"
        fi
    fi
else
    echo "  ⚠️  ディレクトリが存在しません"
fi

echo ""
echo "============================================"
echo "✅ 完了！"
if [ "$BACKUP_FIRST" = true ]; then
    echo ""
    echo "バックアップ場所: $BACKUP_DIR"
    ls -la "$BACKUP_DIR"/*_${TIMESTAMP}.zip 2>/dev/null
fi
echo "============================================"
