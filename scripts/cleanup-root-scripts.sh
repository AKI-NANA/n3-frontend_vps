#!/bin/bash
# cleanup-root-scripts.sh
# ルートの.shファイルを整理

echo ""
echo "============================================"
echo "  ルートスクリプト整理"
echo "============================================"
echo ""

cd ~/n3-frontend_new

# 残すべきファイル（scriptsに移動）
KEEP_SCRIPTS=(
    "safe-start.sh"
    "emergency-reset.sh"
    "watch-memory.sh"
)

# 削除候補（古い/不要なもの）
DELETE_SCRIPTS=(
    "add_missing_data.sh"
    "analyze-conflicts.sh"
    "analyze_disk_space.sh"
    "check-deploy-status.sh"
    "check_backups.sh"
    "cleanup-git-repository.sh"
    "complete_backup.sh"
    "compress_ssd_data.sh"
    "deploy.sh"
    "efficient_zip.sh"
    "open-command-center.sh"
    "optimize-vercelignore.sh"
    "organize_backups.sh"
    "organize_backups_simple.sh"
    "quick-deploy.sh"
    "rename_backups.sh"
    "safe_backup_and_organize.sh"
    "safe_backup_and_organize_v2.sh"
    "start-safe.sh"
)

echo "📁 重要なスクリプトをscripts/に移動:"
for script in "${KEEP_SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        echo "  → $script"
        mv "$script" scripts/
    fi
done
echo ""

echo "🗑️  不要なスクリプトを削除:"
for script in "${DELETE_SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        echo "  × $script"
        rm "$script"
    fi
done
echo ""

# .mdファイルも整理（docs/に移動）
echo "📄 ドキュメントをdocs/に移動:"
mkdir -p docs
for md in *.md; do
    if [ "$md" != "README.md" ] && [ -f "$md" ]; then
        echo "  → $md"
        mv "$md" docs/
    fi
done
echo ""

# その他の不要ファイル
echo "🗑️  その他の不要ファイル削除:"
[ -f "test_mcp_write.txt" ] && rm "test_mcp_write.txt" && echo "  × test_mcp_write.txt"
[ -f "TABFINAL_PATCH.txt" ] && rm "TABFINAL_PATCH.txt" && echo "  × TABFINAL_PATCH.txt"
[ -f "check_item_specifics.js" ] && rm "check_item_specifics.js" && echo "  × check_item_specifics.js"
echo ""

echo "============================================"
echo "✅ 整理完了！"
echo ""
echo "残ったルートファイル:"
ls -la *.sh 2>/dev/null || echo "  (なし)"
echo ""
echo "scripts/ の内容:"
ls scripts/*.sh 2>/dev/null | head -10
echo "============================================"
