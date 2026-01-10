#!/bin/bash
# git-clone-fresh.sh
# 既存フォルダをバックアップして、新しくGitからクローン

echo ""
echo "============================================"
echo "  N3 フレッシュクローン"
echo "  （既存をバックアップ→新規クローン）"
echo "============================================"
echo ""

BACKUP_DIR=~/n3-backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# リポジトリ設定
declare -A REPOS
REPOS["n3-frontend_new"]="git@github.com:AKI-NANA/n3-frontend_new.git"
REPOS["n3-frontend_vercel"]="git@github.com:AKI-NANA/n3-frontend-vercel.git"
REPOS["n3-frontend_vps"]="git@github.com:AKI-NANA/n3-frontend-vps.git"

# バックアップフォルダ作成
mkdir -p "$BACKUP_DIR"

# 引数チェック
TARGET="$1"

if [ -z "$TARGET" ]; then
    echo "使い方:"
    echo "  ./scripts/git-clone-fresh.sh all     # 3つ全部"
    echo "  ./scripts/git-clone-fresh.sh dev     # 開発のみ"
    echo "  ./scripts/git-clone-fresh.sh vercel  # Vercelのみ"
    echo "  ./scripts/git-clone-fresh.sh vps     # VPSのみ"
    exit 1
fi

# バックアップ＆クローン関数
backup_and_clone() {
    local name=$1
    local repo=$2
    local dir=~/$name
    
    echo ""
    echo "📂 $name"
    echo "--------------------------------------------"
    
    # 既存フォルダがあればバックアップ
    if [ -d "$dir" ]; then
        echo "  📦 既存フォルダをバックアップ中..."
        cd ~
        zip -rq "$BACKUP_DIR/${name}_${TIMESTAMP}.zip" "$name" \
            -x "*.git*" -x "*node_modules*" -x "*.next*"
        echo "  ✅ バックアップ: $BACKUP_DIR/${name}_${TIMESTAMP}.zip"
        
        echo "  🗑️  既存フォルダを削除..."
        rm -rf "$dir"
    fi
    
    # 新規クローン
    echo "  📥 Gitからクローン中..."
    cd ~
    git clone "$repo" "$name"
    
    if [ $? -eq 0 ]; then
        echo "  ✅ クローン完了"
        
        # npm install
        echo "  📦 npm install 中..."
        cd "$dir"
        npm install > /dev/null 2>&1
        echo "  ✅ npm install 完了"
    else
        echo "  ❌ クローン失敗"
    fi
}

# 実行
case "$TARGET" in
    "all")
        echo "🔄 3つ全てをフレッシュクローンします"
        backup_and_clone "n3-frontend_new" "${REPOS[n3-frontend_new]}"
        backup_and_clone "n3-frontend_vercel" "${REPOS[n3-frontend_vercel]}"
        backup_and_clone "n3-frontend_vps" "${REPOS[n3-frontend_vps]}"
        ;;
    "dev")
        backup_and_clone "n3-frontend_new" "${REPOS[n3-frontend_new]}"
        ;;
    "vercel")
        backup_and_clone "n3-frontend_vercel" "${REPOS[n3-frontend_vercel]}"
        ;;
    "vps")
        backup_and_clone "n3-frontend_vps" "${REPOS[n3-frontend_vps]}"
        ;;
    *)
        echo "❌ 不明なオプション: $TARGET"
        echo "all, dev, vercel, vps のいずれかを指定してください"
        exit 1
        ;;
esac

echo ""
echo "============================================"
echo "✅ 完了！"
echo ""
echo "バックアップ一覧:"
ls -la "$BACKUP_DIR"/*_${TIMESTAMP}.zip 2>/dev/null || echo "  (なし)"
echo "============================================"
