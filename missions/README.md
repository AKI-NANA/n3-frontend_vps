# 🗂️ ミッション管理ガイド（Imperial Nightly Engine v3.0）

## 📍 ディレクトリ構造（連番管理）

```
governance/missions/
├── 00_queue/      ← ここに .md を配置すれば自動処理
├── 01_running/    ← 実行中（常に1ファイルのみ・排他制御）
├── 02_done/       ← 成功ミッション（自動移動）
├── 03_failed/     ← 失敗ミッション（自動移動）
└── README.md      ← 本ファイル
```

## 🚀 ミッションの投入方法

1. `.md` ファイルを `governance/missions/00_queue/` に配置
2. 夜間自動: AM 2:00 に Cron が実行
3. 手動: `npm run nightly:run`
4. ドライラン: `npm run nightly:dry`
5. 監視モード: `npm run nightly:watch`

## 📋 task_index.json リレー方式

指示書の冒頭に `task_key: xxx` を記述すると、task_index.json から対象ファイルを自動参照します。

```markdown
task_key: listing_publish

## タスク: 出品機能のエラーハンドリング強化

**指示内容:**
1. try-catchを追加
2. console.logをimperialLoggerに置換
```

→ task_index.json の `listing_publish.files` に定義されたファイルのみが操作対象になります。

## 🔄 ライフサイクル

```
00_queue/ → 01_running/ → [Claude API → Ollama検品 → 帝国監査]
  → 成功: 02_done/ + プレビュー (port:3001)
  → 失敗: 03_failed/
  → ドライラン: 00_queue/ に戻す

陛下の承認フロー:
  プレビュー確認 → npm run unlock-force → npm run pull-nightly
  
ロールバック:
  UI「ロールバック」ボタン or POST /api/governance/rollback
  → git checkout . + 01_running → 03_failed
```

## 🔧 再試行

```bash
mv governance/missions/03_failed/my-mission.md governance/missions/00_queue/
npm run nightly:run
```

---
*最終更新: 2026-02-06 — v3.0 連番フォルダ管理*
