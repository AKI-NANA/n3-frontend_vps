#!/bin/bash
# ============================================================
# 🏛️ MCP 統治サーバー セットアップスクリプト
# ============================================================
# 実行: bash governance/setup-mcp.sh
# 効果: claude_desktop_config.json に帝国統治サーバーを登録

CONFIG_DIR="$HOME/Library/Application Support/Claude"
CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
BACKUP_FILE="$CONFIG_DIR/claude_desktop_config.backup.json"
SERVER_PATH="$(cd "$(dirname "$0")" && pwd)/mcp-governance-server.js"
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo ""
echo "🏛️ N3 Empire — MCP 統治サーバー セットアップ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  サーバー: $SERVER_PATH"
echo "  設定先:   $CONFIG_FILE"
echo ""

# 設定ディレクトリ確認
if [ ! -d "$CONFIG_DIR" ]; then
  echo "❌ Claude Desktop の設定ディレクトリが見つかりません: $CONFIG_DIR"
  echo "   Claude Desktop がインストールされているか確認してください。"
  exit 1
fi

# サーバーファイル確認
if [ ! -f "$SERVER_PATH" ]; then
  echo "❌ MCPサーバーが見つかりません: $SERVER_PATH"
  exit 1
fi

# 既存設定のバックアップ
if [ -f "$CONFIG_FILE" ]; then
  cp "$CONFIG_FILE" "$BACKUP_FILE"
  echo "📋 既存設定をバックアップ: $BACKUP_FILE"
  
  # 既存設定にマージ
  # jq がある場合はマージ、なければ上書き
  if command -v jq &> /dev/null; then
    echo "  jq 検出 → 既存設定にマージします"
    
    MERGED=$(jq --arg server_path "$SERVER_PATH" --arg project_root "$PROJECT_ROOT" '
      .mcpServers["n3-empire-governance"] = {
        "command": "node",
        "args": [$server_path]
      } |
      .mcpServers["n3-empire-filesystem"] = {
        "command": "npx",
        "args": ["-y", "@anthropic-ai/mcp-filesystem-server", $project_root]
      }
    ' "$CONFIG_FILE")
    
    echo "$MERGED" > "$CONFIG_FILE"
  else
    echo "  ⚠️ jq 未検出 → 既存設定を維持しつつ手動マージが必要です"
    echo ""
    echo "  以下の内容を $CONFIG_FILE の mcpServers に追加してください:"
    echo ""
    echo "    \"n3-empire-governance\": {"
    echo "      \"command\": \"node\","
    echo "      \"args\": [\"$SERVER_PATH\"]"
    echo "    },"
    echo "    \"n3-empire-filesystem\": {"
    echo "      \"command\": \"npx\","
    echo "      \"args\": [\"-y\", \"@anthropic-ai/mcp-filesystem-server\", \"$PROJECT_ROOT\"]"
    echo "    }"
    echo ""
    exit 0
  fi
else
  # 新規作成
  echo "📝 新規設定ファイルを作成します"
  cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "n3-empire-governance": {
      "command": "node",
      "args": ["$SERVER_PATH"]
    },
    "n3-empire-filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-filesystem-server", "$PROJECT_ROOT"]
    }
  }
}
EOF
fi

echo ""
echo "✅ 設定完了！"
echo ""
echo "📋 登録されたMCPサーバー:"
echo "  1. n3-empire-governance  → 8ツール + 3リソース + 2プロンプト"
echo "  2. n3-empire-filesystem  → ファイルシステムアクセス"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️ Claude Desktop を再起動してください（Cmd+Q → 再起動）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "接続テスト:"
echo "  echo '{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\",\"params\":{}}' | node $SERVER_PATH"
echo ""
