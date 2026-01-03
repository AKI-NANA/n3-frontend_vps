# N3 出品・在庫自動化 検証・修正タスク

## 📋 概要

このドキュメントは、N3システムの出品・在庫自動化機能の検証と修正タスクをまとめたものです。

---

## 🎯 タスク一覧

### 1. 外注用在庫ツール（/stocktake）のリンク追加

**現状:**
- `/stocktake` ページは存在（ビルドログで確認）
- どこからもリンクされていない

**対応:**
- editing-n3のツールパネルに「外注用在庫ツール」ボタンを追加
- `target="_blank"` で新しいタブで開く（ログインが必要なため）
- Vercel環境でも動作するよう確認

**関連ファイル:**
```
/app/stocktake/
/app/(stocktake)/stocktake/
/app/tools/stocktake/
```

---

### 2. 承認 → 出品フローの修正

**現状:**
- 「承認待ち」タブで承認後、出品ボタンが透明（グレーアウト）でクリックできない

**調査ポイント:**
1. 出品ボタンの有効化条件を確認
2. `ready_to_list` フラグと連携しているか
3. `workflow_status` の状態遷移が正しいか

**必要な修正:**
- 承認済み商品（`ready_to_list=true`, `workflow_status='approved'`）は出品ボタンを有効化
- 2つのボタンを表示:
  - 「今すぐ出品」ボタン
  - 「スケジュールに追加」ボタン

**関連ファイル:**
```
/app/tools/editing-n3/components/panels/N3ToolsPanelContent.tsx
/app/tools/editing-n3/components/views/N3BasicEditView.tsx
/components/n3/N3ApprovalActionBar.tsx
/app/api/listing/execute/route.ts
/app/api/listing/now/route.ts
```

---

### 3. スケジュール出品の検証・修正

**現状:**
- スケジュールにサンプルデータが入っている可能性
- settings-n3 の設定と連携しているか不明

**調査ポイント:**
1. `products_master` テーブルのスケジュール関連カラム確認:
   - `scheduled_at`
   - `scheduled_marketplace`
   - `scheduled_account`
   - `schedule_status`

2. settings-n3 の出品スケジュール設定が実際に使われているか

**対応:**
1. サンプルデータの削除
2. 設定との連携確認
3. 出品後のUI表示（完了表示）の実装

**関連ファイル:**
```
/app/tools/settings-n3/components/AutomationSettingsPanel.tsx
/app/api/listing/execute-scheduled/route.ts
/app/api/automation/auto-schedule/route.ts
/app/api/approval/create-schedule/route.ts
```

**設定項目（settings-n3）:**
```typescript
// 出品スケジュール設定
interface DefaultScheduleSettings {
  enabled: boolean;
  items_per_day: number;
  // ...
}
```

---

### 4. 在庫監視の検証・修正

**現状:**
- ヤフオク在庫監視機能は存在
- 自動で動作するか不明
- settings-n3 との連携確認必要

**調査ポイント:**
1. 在庫監視APIの動作確認
2. ヤフオク売れた時の在庫減算ロジック
3. settings-n3 の在庫監視設定との連携

**関連ファイル:**
```
/app/api/inventory-monitoring/execute/route.ts
/app/api/inventory-monitoring/schedule/route.ts
/app/api/inventory-monitoring/changes/route.ts
/app/tools/settings-n3/components/AutomationSettingsPanel.tsx
```

**設定項目（settings-n3）:**
```typescript
// 在庫監視設定
interface MonitoringScheduleSettings {
  enabled: boolean;
  frequency: MonitoringFrequency;
  // ...
}
```

---

### 5. 設定ツール連携の検証

**確認事項:**

| 設定項目 | 設定場所 | 使用API | 確認状態 |
|---------|---------|---------|---------|
| 出品スケジュール | settings-n3 > 自動化 | /api/listing/execute-scheduled | 未確認 |
| 在庫監視 | settings-n3 > 自動化 | /api/inventory-monitoring/* | 未確認 |
| 自動承認 | settings-n3 > 自動化 | /api/automation/auto-approve | 未確認 |
| eBayアカウント | settings-n3 > プラットフォーム | /api/ebay/* | 未確認 |

---

### 6. VPSでの動作テスト

**VPS URL:** `https://n3.emverze.com`

**テスト対象API:**

```bash
# 1. 出品スケジュール確認
curl -X GET "https://n3.emverze.com/api/listing/execute-scheduled?limit=10"

# 2. 在庫監視実行
curl -X GET "https://n3.emverze.com/api/inventory-monitoring/execute"

# 3. 在庫監視統計
curl -X GET "https://n3.emverze.com/api/inventory-monitoring/stats"

# 4. 自動承認設定
curl -X GET "https://n3.emverze.com/api/automation/auto-approve"

# 5. 自動スケジュール
curl -X GET "https://n3.emverze.com/api/automation/auto-schedule"

# 6. 設定取得
curl -X GET "https://n3.emverze.com/api/automation/settings"
```

---

### 7. ARCHITECTURE.md の自動読み込み

**目的:** Claude開発時にARCHITECTURE.mdを自動で参照させる

**対応:**
- プロジェクトナレッジに追加
- または、セッション開始時の指示に含める

---

## 📁 ファイル構造（参考）

```
app/
├── tools/
│   ├── editing-n3/
│   │   ├── ARCHITECTURE.md          # 肥大化防止ルール
│   │   ├── components/
│   │   │   ├── layouts/
│   │   │   ├── header/
│   │   │   ├── views/
│   │   │   ├── panels/
│   │   │   └── ...
│   │   └── hooks/
│   │
│   └── settings-n3/
│       ├── components/
│       │   └── AutomationSettingsPanel.tsx  # 自動化設定
│       ├── hooks/
│       └── layouts/
│
├── api/
│   ├── listing/
│   │   ├── execute/                 # 即時出品
│   │   ├── execute-scheduled/       # スケジュール出品実行
│   │   └── now/                     # 今すぐ出品
│   │
│   ├── inventory-monitoring/
│   │   ├── execute/                 # 在庫監視実行
│   │   ├── schedule/                # 監視スケジュール
│   │   ├── changes/                 # 変更検出
│   │   └── stats/                   # 統計
│   │
│   └── automation/
│       ├── auto-approve/            # 自動承認
│       ├── auto-schedule/           # 自動スケジュール
│       └── settings/                # 設定取得・保存
│
└── stocktake/                       # 外注用在庫ツール
```

---

## 🔄 実行順序

1. **現状分析**
   - DBのスケジュールデータ確認
   - 設定テーブルの確認
   - サンプルデータの特定

2. **サンプルデータ削除**
   - スケジュール済みサンプルの削除

3. **出品ボタンの修正**
   - 有効化条件の修正
   - 2ボタン（即時/スケジュール）の実装

4. **設定連携の修正**
   - settings-n3 → API の連携確認・修正

5. **VPSテスト**
   - 全APIの動作確認
   - エラーログの確認

6. **外注ツールリンク追加**
   - editing-n3にボタン追加

7. **動作確認**
   - 全フローのE2Eテスト

---

## 📝 補足情報

### DB関連テーブル

```sql
-- スケジュール関連カラム（products_master）
scheduled_at TIMESTAMPTZ,
scheduled_marketplace TEXT,
scheduled_account TEXT,
schedule_status TEXT,  -- 'pending', 'scheduled', 'completed', 'failed'

-- 自動化設定テーブル
automation_settings (
  id, setting_type, settings_json, enabled, updated_at
)
```

### 今回のセッションで完了したこと

1. ✅ editing-n3のリファクタリング（101KB → 35KB）
2. ✅ ARCHITECTURE.md作成（肥大化防止ルール）
3. ✅ コンポーネント細分化
   - header/N3PageHeader.tsx
   - header/N3SubToolbar.tsx
   - views/N3BasicEditView.tsx
   - views/N3InventoryView.tsx
   - panels/N3ToolsPanelContent.tsx
   - panels/N3StatsPanelContent.tsx

---

## ⚠️ 注意事項

- VPSテスト時は本番データに影響しないよう注意
- スケジュール削除前にバックアップを取る
- 設定変更は1つずつ確認しながら行う
