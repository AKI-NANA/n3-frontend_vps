# 🏛️ N3 Empire 監査フィードバックループ

## 📋 概要

監査結果を「生きた法」に変換するフィードバックループシステムです。

```
total-empire-audit.js
       ↓ 
violations_by_language.json + TOTAL_EMPIRE_REPORT.md
       ↓
audit-registry-sync.js
       ↓
registry.json (audit_results セクション追加)
       ↓
    ┌──┴──┐
    ↓     ↓
guard.js  Empire Cockpit UI
(昇格ブロック)  (可視化 + コピー)
    ↓
ai-sync-generator.js
    ↓
CLAUDE_INPUT.md (AI用プロンプト)
```

---

## 🔧 スクリプト一覧

### 1. total-empire-audit.js
全ファイル（TypeScript, Python, n8n JSON）を27次元帝国法典に基づいて監査

```bash
node governance/total-empire-audit.js
```

出力:
- `TOTAL_EMPIRE_REPORT.md` - 人間向けレポート
- `total_audit.csv` - CSVエクスポート
- `violations_by_language.json` - 詳細JSON

### 2. audit-registry-sync.js
監査結果を registry.json に統合

```bash
node governance/audit-registry-sync.js
```

追加される情報:
- `audit_results.summary` - 全体統計
- `audit_results.top_violations` - 頻出違反TOP10
- `audit_results.blocked_from_production` - 昇格ブロック対象

### 3. guard.js (v3.0)
昇格前の強制チェック

```bash
node governance/guard.js --check-registry
```

機能:
- 秘密情報チェック
- 依存関係脆弱性スキャン
- **registry.json参照による昇格ブロック**

### 4. ai-sync-generator.js
AI向けプロンプト生成

```bash
node governance/ai-sync-generator.js
```

出力:
- `CLAUDE_INPUT.md` - 帝国法典 + 現在の違反状況

### 5. run-full-audit.js
全スクリプト一括実行

```bash
node governance/run-full-audit.js --guard --ai
```

---

## 🖥️ UI: Empire Cockpit

`http://localhost:3000/empire-cockpit`

### 帝国検閲タブ

1. **全体サマリー** - 合格率、CRITICAL/ERROR/WARNING件数
2. **頻出違反TOP10** - ヒートマップ表示
3. **昇格ブロック対象** - スコア80未満のファイル一覧
4. **AI用テキストコピー** - ワンクリックでクリップボードへ

---

## 📊 API

### GET /api/governance/audit-data

registry.jsonの監査結果を返す

レスポンス例:
```json
{
  "success": true,
  "audit_results": {
    "last_updated": "2026-02-05T06:19:11.199Z",
    "summary": { ... },
    "top_violations": [ ... ],
    "blocked_from_production": [ ... ]
  }
}
```

---

## 🔄 推奨ワークフロー

### 開発中
```bash
# コード修正後
node governance/run-full-audit.js

# Empire Cockpit で確認
open http://localhost:3000/empire-cockpit
# → 「帝国検閲」タブ
```

### デプロイ前
```bash
# 全チェック + 昇格ブロック
node governance/run-full-audit.js --guard

# BLOCKEDが出たら修正必須
```

### AI作業時
```bash
# プロンプト生成
node governance/run-full-audit.js --ai

# CLAUDE_INPUT.md をコピーしてClaudeに貼り付け
# または Empire Cockpit の「AI用テキストをコピー」ボタン
```

---

## ⚙️ 設定

### 昇格ブロック閾値
`guard.js` 内の `PROMOTION_SCORE_THRESHOLD = 80`

スコア80未満のファイルは01_PRODUCTへの昇格がブロックされます。

### スキャン対象ディレクトリ
`total-empire-audit.js` 内の `SCAN_TARGETS`

---

## 📝 注意事項

1. **監査は非破壊** - ファイルを変更しません（`--fix` オプション除く）
2. **registry.jsonは上書き** - audit_resultsセクションが毎回更新されます
3. **UIはリアルタイムではない** - 再読み込みで最新データを取得

---

*N3 Empire Governance System v3.0*
