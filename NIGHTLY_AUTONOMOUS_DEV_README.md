# 🏛️ 帝国 OS 夜間自律開発システム - 実装完了レポート

**実装日**: 2026-02-05  
**バージョン**: v1.0  
**ステータス**: ✅ 完成

---

## 📋 システム概要

夜間に無人で「タスク取得・開発・監査・自己修復・昇格」を完遂する自律サイクルシステム。

---

## 🧠 1. 司令官（Brain）

### ファイル
`governance/nightly-autonomous-dev.js`

### 機能
- **Task Fetch**: `lib/data/task_index.json` から `status: "pending"` の最高優先度タスクを取得
- **Staging**: `02_DEV_LAB/nightly-staging/YYYY-MM-DD/` に AI 生成物を一時保存
- **Audit Loop**: 
  - 生成コードに対し監査を実行
  - スコア100点未満または Blocker 存在時、違反内容を AI にフィードバックし再試行（最大3回）
  - 改善が見られない場合はロールバックし、失敗ログを記録
- **Promotion**: 合格時のみ、対象ファイルを本番環境へ差分コピー
- **Recording**: 実行結果を `governance/nightly_result.json` に保存

### 実行方法
```bash
# 通常実行
node governance/nightly-autonomous-dev.js

# ドライラン（テスト）
node governance/nightly-autonomous-dev.js --dry-run

# 特定タスク指定
node governance/nightly-autonomous-dev.js --task=listing_publish
```

### AI プロバイダー
- **主**: Claude (claude-sonnet-4-20250514)
- **副**: GPT-4 (フォールバック)

---

## 🤖 2. 執行官（Muscle）- n8n ワークフロー

### ファイル
`02_DEV_LAB/n8n-workflows/PRODUCTION/帝国/empire-os-nightly-autonomous-dev.json`

### トリガー
- **Schedule Trigger**: 毎日 AM 3:00 (Asia/Tokyo)

### フロー
1. `毎日 AM 3:00` → スケジュールトリガー
2. `🤖 自律開発実行` → Execute Command でスクリプト起動
3. `📄 結果読み込み` → nightly_result.json を読み取り
4. `📝 メッセージ整形` → Chatwork通知用メッセージ生成
5. `💬 Chatwork通知` → 結果を通知

---

## 📊 3. UI（Command Center）

### ファイル
- `app/tools/command-center/page.tsx` - メインページ（タブ統合済み）
- `app/tools/command-center/components/nightly-dev-log-tab.tsx` - 夜間自律開発ログタブ

### 表示項目
- 実行日時
- 実施タスク
- 最終スコア（ゲージ表示）
- リトライ回数
- 昇格ステータス
- AI とのやり取りログ
- 昇格されたファイル一覧
- エラー詳細

### アクセス
```
http://localhost:3000/tools/command-center
→ 「🛡️ 夜間自律開発」タブ
```

---

## 📡 4. API エンドポイント

### ファイル
`app/api/governance/nightly-result/route.ts`

### エンドポイント
```
GET /api/governance/nightly-result
```

### レスポンス
```json
{
  "last_updated": "2026-02-05T03:15:42.000Z",
  "latest": {
    "timestamp": "...",
    "task_key": "...",
    "task_description": "...",
    "status": "success|failed|no_task|dry_run|error",
    "retry_count": 2,
    "final_score": 100,
    "promoted_files": [...],
    "ai_interactions": [...],
    "errors": [...]
  },
  "history": [...]
}
```

---

## ⚖️ 5. 法典遵守

### 参照条文
- **第4.5条**: 環境二重性の禁止 - process.env 直参照禁止
- **第6.3条**: console禁止 - imperialLogger 使用
- **第21条**: 外部依存の監査 - npm audit / pip-audit 必須

### 監査スクリプト
- `governance/run-full-audit.js` - 完全監査
- `governance/total-empire-audit.js` - 27次元監査

---

## 🔧 6. 設定ファイル

### 環境変数 (.env.local)
```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
CHATWORK_ROOM_ID=123456789
```

### タスクインデックス (lib/data/task_index.json)
```json
{
  "tasks": {
    "task_key": {
      "description": "タスク説明",
      "priority": 1,
      "status": "pending|in_progress|active|archived",
      "auto_dev_enabled": true,
      "files": ["app/...", "lib/..."]
    }
  },
  "nightly_queue": ["task_key_1", "task_key_2"]
}
```

---

## 🚀 7. 運用手順

### 新規タスクの追加
1. `lib/data/task_index.json` にタスクを追加
2. `status: "pending"`, `auto_dev_enabled: true` を設定
3. `nightly_queue` に優先順にタスクキーを追加

### 手動実行
```bash
# ドライランでテスト
node governance/nightly-autonomous-dev.js --dry-run

# 本番実行
node governance/nightly-autonomous-dev.js
```

### ログ確認
- UI: http://localhost:3000/tools/command-center → 「🛡️ 夜間自律開発」タブ
- ファイル: `governance/nightly_result.json`

---

## 📁 ファイル一覧

| パス | 説明 |
|------|------|
| `governance/nightly-autonomous-dev.js` | 司令官スクリプト |
| `governance/nightly_result.json` | 実行結果ログ |
| `governance/MASTER_LAW.md` | 帝国法典 |
| `app/api/governance/nightly-result/route.ts` | API エンドポイント |
| `app/tools/command-center/page.tsx` | Command Center |
| `app/tools/command-center/components/nightly-dev-log-tab.tsx` | ログ表示タブ |
| `02_DEV_LAB/n8n-workflows/PRODUCTION/帝国/empire-os-nightly-autonomous-dev.json` | n8n ワークフロー |
| `02_DEV_LAB/nightly-staging/` | ステージング領域 |
| `lib/data/task_index.json` | タスクインデックス |

---

**制定: N3 帝国 工務官**
