# N3 棚卸マスター同期 実装完了レポート

## 実装日: 2026-01-28

---

## ✅ Phase A: 自動 Pull 同期基盤（完了）

### 1️⃣ Cron API
- **ファイル**: `/app/api/cron/spreadsheet-pull/route.ts`
- **機能**:
  - `POST /api/cron/spreadsheet-pull` → Sheet→DB 同期実行
  - `GET /api/cron/spreadsheet-pull` → ステータス確認
  - 環境変数 `SPREADSHEET_SYNC_ENABLED=true` で有効/無効
  - ロック機構（sync_lockテーブル使用）
  - 実行ログ記録（sync_logテーブル使用）

### 2️⃣ VPS Cron 設定用スクリプト
- **ファイル**: `/scripts/setup-spreadsheet-cron.sh`
- **設定内容**:
  ```bash
  # 30分毎 Pull
  */30 * * * * curl -X POST "https://your-domain/api/cron/spreadsheet-pull" -H "Authorization: Bearer YOUR_CRON_SECRET"
  ```

---

## ✅ Phase B: n8n 自動監視フロー（完了）

### 3️⃣ n8n ワークフロー
- **ファイル**: `/n8n-workflows-empire/N3-SPREADSHEET-PULL-MONITOR.json`（VPSリポジトリ）
- **構成**:
  1. Cron Trigger (30分)
  2. HTTP Request → Pull API 呼び出し
  3. IF Node → 成功/失敗判定
  4. ChatWork 通知

### 通知内容
- 成功時: `✅ Spreadsheet Pull 完了 - 更新: xx件`
- 失敗時: `❌ Spreadsheet Sync Failed - エラー: xxx`

---

## ✅ Phase C: 夜間 Push（完了）

### 4️⃣ Push Cron API
- **ファイル**: `/app/api/cron/spreadsheet-push/route.ts`
- **機能**:
  - `POST /api/cron/spreadsheet-push` → DB→Sheet 同期実行
  - 推奨実行時刻: 深夜2時
  ```bash
  0 2 * * * curl -X POST "https://your-domain/api/cron/spreadsheet-push" -H "Authorization: Bearer YOUR_CRON_SECRET"
  ```

---

## ✅ Phase D: 競合事故防止ロック（完了）

### 5️⃣ Supabase テーブル
- **ファイル**: `/migrations/20260128_spreadsheet_sync_tables.sql`
- **テーブル**:
  1. `sync_lock` - 同期ロック管理
  2. `sync_log` - 同期実行ログ

### 実行方法
```sql
-- Supabase Dashboard → SQL Editor で実行
-- migrations/20260128_spreadsheet_sync_tables.sql の内容をコピー&ペースト
```

---

## ✅ Phase E: UI 表示状態強化（完了）

### 6️⃣ 同期状態インジケーター
- **ファイル**: `/app/tools/editing-n3/components/sync/sync-status-indicator.tsx`
- **機能**:
  - 最終 Pull/Push 時刻表示
  - エラー状態表示
  - ロック状態表示
  - 30秒ごと自動更新

### 7️⃣ 同期状態取得 API
- **ファイル**: `/app/api/sync/status/route.ts`
- **機能**:
  - `GET /api/sync/status` → 最新の同期状態を返却

---

## ✅ Phase F: 出品連動安全チェック（完了）

### 8️⃣ 出品前ガード強化
- **ファイル**: `/lib/listing/guards.ts`
- **変更内容**:
  - `checkOutOfStock` を Warning → **Blocker** に格上げ
  - `physical_quantity <= 0` で **絶対ブロック**
  - メッセージ: `❌ 在庫切れ: xx件の在庫が0です。棚卸マスターを確認してください。`

---

## 📝 環境変数（追加済み）

```env
# .env.local に追加
SPREADSHEET_SYNC_ENABLED="true"
SPREADSHEET_SYNC_INTERVAL="30"
```

---

## 🚀 デプロイ手順

### 1. Supabase テーブル作成
```bash
# Supabase Dashboard → SQL Editor
# migrations/20260128_spreadsheet_sync_tables.sql を実行
```

### 2. VPS Cron 設定
```bash
ssh ubuntu@160.16.120.186
cd ~/n3-frontend_new
chmod +x scripts/setup-spreadsheet-cron.sh
APP_URL="http://localhost:3000" CRON_SECRET="n3-cron-secret-2025-secure" ./scripts/setup-spreadsheet-cron.sh
```

### 3. n8n ワークフローインポート
```bash
# n8n Dashboard (http://160.16.120.186:5678)
# Workflows → Import from File
# n8n-workflows-empire/N3-SPREADSHEET-PULL-MONITOR.json
# Active に切り替え
```

### 4. アプリケーション再起動
```bash
pm2 restart n3-frontend
```

---

## 🔄 動作フロー（完成後）

```
┌─────────────────────────────────────────────────────────────────┐
│                 Google Spreadsheet                              │
│                 「マスター在庫」シート                          │
│                                                                 │
│  Plus1外注さんが手入力                                          │
│  - 在庫数量                                                     │
│  - 保管場所                                                     │
│  - 要確認フラグ                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ▲  ▼
                    ┌─────────┴──────────┐
                    │ 30分毎 自動 Pull   │
                    │ (Cron/n8n)         │
                    └────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase (inventory_master)                  │
│                                                                 │
│  physical_quantity = 最新の真実の在庫                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │ 出品前ガード       │
                    │ physical_qty > 0   │
                    └────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │ 出品実行           │
                    │ (安全に実行)       │
                    └────────────────────┘
```

---

## ✅ 完成状態チェックリスト

| 機能 | 状態 | 備考 |
|------|------|------|
| 30分棚卸反映 | ✅ 実装済 | Cron API + VPS crontab |
| 夜間正規反映 | ✅ 実装済 | Push Cron API |
| 競合事故防止 | ✅ 実装済 | sync_lock テーブル |
| 通知監視 | ✅ 実装済 | n8n → ChatWork |
| UI状態可視化 | ✅ 実装済 | SyncStatusIndicator |
| 自動出品連動 | ✅ 実装済 | guards.ts 強化 |

---

## 📌 注意事項

1. **Supabase テーブル作成が必須**
   - `sync_lock` / `sync_log` がないとログが記録されない（動作はする）

2. **VPS crontab 設定が必須**
   - 設定しないと自動同期が動かない

3. **n8n ワークフローは任意**
   - ChatWork 通知が不要なら設定しなくてもOK

4. **在庫0の商品は絶対に出品されない**
   - `guards.ts` で critical blocker として実装済み
