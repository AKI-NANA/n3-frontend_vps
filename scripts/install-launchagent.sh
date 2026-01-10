#!/bin/bash
# ============================================================
# N3 LaunchAgent インストーラー
# Mac起動時に自動クリーンアップ監視を開始する設定
#
# 使用方法:
#   ./scripts/install-launchagent.sh      # インストール
#   ./scripts/install-launchagent.sh -u   # アンインストール
# ============================================================

PLIST_NAME="com.n3.auto-cleanup"
PLIST_PATH=~/Library/LaunchAgents/${PLIST_NAME}.plist
SCRIPT_PATH=~/n3-frontend_new/scripts/auto-cleanup.sh
LOG_PATH=~/n3-frontend_new/logs

# アンインストール
if [ "$1" = "-u" ] || [ "$1" = "--uninstall" ]; then
    echo "🗑️  N3 LaunchAgent をアンインストールします..."
    
    launchctl unload "$PLIST_PATH" 2>/dev/null
    rm -f "$PLIST_PATH"
    
    echo "✅ アンインストール完了"
    echo "   自動クリーンアップ監視は停止しました"
    exit 0
fi

# インストール
echo "🚀 N3 LaunchAgent をインストールします..."

# ディレクトリ確認
mkdir -p ~/Library/LaunchAgents
mkdir -p "$LOG_PATH"

# スクリプトに実行権限を付与
chmod +x "$SCRIPT_PATH"

# plistファイル作成
cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${PLIST_NAME}</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>${SCRIPT_PATH}</string>
    </array>
    
    <key>RunAtLoad</key>
    <true/>
    
    <key>KeepAlive</key>
    <true/>
    
    <key>StandardOutPath</key>
    <string>${LOG_PATH}/launchagent-stdout.log</string>
    
    <key>StandardErrorPath</key>
    <string>${LOG_PATH}/launchagent-stderr.log</string>
    
    <key>WorkingDirectory</key>
    <string>$HOME/n3-frontend_new</string>
</dict>
</plist>
EOF

# 既存のエージェントをアンロード
launchctl unload "$PLIST_PATH" 2>/dev/null

# 新しいエージェントをロード
launchctl load "$PLIST_PATH"

echo ""
echo "✅ インストール完了！"
echo ""
echo "📌 状態確認:"
echo "   launchctl list | grep n3"
echo ""
echo "📌 ログ確認:"
echo "   tail -f ~/n3-frontend_new/logs/auto-cleanup.log"
echo ""
echo "📌 停止方法:"
echo "   launchctl unload $PLIST_PATH"
echo ""
echo "📌 アンインストール:"
echo "   ./scripts/install-launchagent.sh -u"
echo ""
