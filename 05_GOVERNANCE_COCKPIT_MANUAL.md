# 05. 統治コックピット マニュアル

## 📍 概要

**統治コックピット**は、N3帝国のAI統治・セキュリティ・コード品質を一元管理するダッシュボードです。

Claude Desktop / Claude Web版に渡す「帝国法典」をワンクリックで生成・コピーできます。

---

## 🚀 アクセス方法

```
http://localhost:3000/tools/command-center
```

左サイドバーの **「👑 統治コックピット」** ボタンをクリック

---

## 🗂️ 4つのタブ

### 1. ⚖️ 統治規約

N3帝国のコードルール一覧を表示します。

| 項目 | 説明 |
|------|------|
| 表示内容 | rule_key、rule_name、ai_instruction、禁止パターン |
| データソース | Supabase `system_governance` テーブル（空ならデフォルト6件表示） |
| 用途 | AIに守らせるルールを確認 |

**デフォルト規約（6件）**:
- 🚫 生fetch禁止 → `imperialDispatch()` を使用
- 🚫 聖域Import禁止 → `01_PRODUCT` 等からimport禁止
- 🚫 IP直書き禁止 → 環境変数を使用
- ✅ Server Actions使用 → クライアントからはServer Actions経由
- ✅ Zod検証必須 → 全API入出力はZodスキーマで検証
- 🚫 console.log禁止 → `console.error` のみ許可

---

### 2. 🛡️ セキュリティ

APIトークンのメタデータを管理します（値は表示されません）。

| 項目 | 説明 |
|------|------|
| 表示内容 | key_name、service、expires_at |
| データソース | Supabase `system_secrets` テーブル |
| 用途 | シークレットの有効期限確認 |

**二重鍵暗号化**:
```
MASTER_KEY (.env) → DATA_KEY (DB) → 実トークン
```

---

### 3. 🧹 衛生

コード品質スキャンを実行します。

| 指標 | 説明 |
|------|------|
| 聖域侵入 | `01_PRODUCT` 等への不正ファイル作成 |
| Import違反 | 禁止ディレクトリからのimport |
| 生fetch | `fetch('/api...')` の直接使用 |
| 野良ファイル | task_index.json に未登録のファイル |

**使い方**:
1. 「スキャン実行」ボタンをクリック
2. 全項目が緑（0件）なら合格

---

### 4. 🧠 AI Sync（最重要）

Claude Web版に渡す「帝国法典」を生成します。

#### 仕組み

```
governance/registry.json
    ↓ 読み込み
MASTER_LAW.md + TASK.md + PROTOCOL.md + ...
    ↓ 統合
「帝国法典」プロンプト生成
    ↓ コピー
Claude Web版に貼り付け
```

#### 使い方

1. **「🔄 最新法典を取得」** ボタンをクリック
2. 統計情報を確認:
   - 総ソース数 / 読込成功 / 失敗 / 文字数
3. **「📋 法典をコピー」** ボタンでクリップボードにコピー
4. **Claude Web版**の新規チャットに貼り付け

#### いつ使う？

- 新しいClaudeチャットを始めるとき
- 法典（MASTER_LAW.md等）を更新したとき
- Claudeが帝国ルールを忘れたとき

---

## 📋 最強指示書コピー

右上の **「📋 最強指示書コピー」** ボタンは、簡易版の指示書を生成します。

**含まれる内容**:
- ディレクトリ構造
- StandardPayload型定義
- 統治規約一覧（DBから）
- 絶対禁止事項
- 作業完了チェックリスト

**AI Sync との違い**:
| 項目 | 最強指示書コピー | AI Sync |
|------|------------------|---------|
| ソース | DB + ハードコード | registry.json |
| 更新方法 | コード修正 | MDファイル編集 |
| 用途 | 軽量な指示 | 完全な法典 |

---

## 🔧 registry.json の編集

AI Syncのソースを追加・変更する場合:

```json
// governance/registry.json
{
  "sources": [
    {
      "id": "master_law",
      "label": "📜 MASTER_LAW",
      "path": "governance/MASTER_LAW.md",
      "type": "law"
    },
    {
      "id": "task",
      "label": "📋 TASK",
      "path": "governance/TASK.md",
      "type": "task"
    }
    // ここに追加
  ]
}
```

---

## ❓ トラブルシューティング

### 「規約が登録されていません」と表示される

- **原因**: `system_governance` テーブルが空またはテーブルが存在しない
- **対処**: デフォルト規約（6件）が自動表示されるはずです。表示されない場合はページをリロード

### AI Syncでエラーが出る

- **原因**: registry.json のパスが間違っている
- **対処**: `governance/registry.json` を確認し、pathが正しいか確認

### 法典が古い

- **対処**: 「🔄 最新法典を取得」を再クリック

---

## 📁 関連ファイル

```
governance/
├── registry.json          # AI Syncのソース定義
├── MASTER_LAW.md          # 帝国法典（不変）
├── TASK.md                # 現在のタスク
├── PROJECT_STATE.md       # プロジェクト状態
└── 05_GOVERNANCE_COCKPIT_MANUAL.md  # このファイル

app/tools/command-center/
└── page.tsx               # 統治コックピットUI

lib/actions/
└── governance-actions.ts  # generateAIPrompt Server Action
```

---

## 🎯 推奨ワークフロー

### 毎日の開発開始時

1. コマンドセンターを開く
2. 👑 統治コックピット → 🧠 AI Sync
3. 「🔄 最新法典を取得」→「📋 法典をコピー」
4. Claude Web版の新規チャットに貼り付け
5. 開発開始！

### 法典更新時

1. `governance/MASTER_LAW.md` 等を編集
2. 統治コックピット → 🧠 AI Sync
3. 「🔄 最新法典を取得」で反映確認
4. 新しいClaudeチャットに貼り付け

---

*最終更新: 2026-02-03*
