# 🔍 野良ファイル監査レポート v2.1

生成日時: 2026-02-05T12:11:53.095Z
スキャン対象: /Users/aritahiroaki/n3-frontend_new

## 📋 検出ルール (v2.1)

**帝国公認ディレクトリ（ホワイトリスト）:**
- `app/**` - task_index未登録でも許可
- `lib/**` - task_index未登録でも許可
- `components/**` - task_index未登録でも許可
- `hooks/**` - task_index未登録でも許可

**検出対象:**
- 拡張子: `.bak`, `.backup`, `.old`, `.tmp`, `.orig`, `.swp`, `.swo`
- 一時ディレクトリ: `temp_*`, `tmp_*`, `*_backup_*`, `*_bak`
- ルート直下の想定外パターン: `test_*`, `debug_*`, `*.current_backup`

## 📊 サマリー

| カテゴリ | 件数 |
|---------|------|
| バックアップファイル | 31 |
| 一時ディレクトリ | 0 |
| 疑わしいファイル | 0 |
| **合計** | **31** |

## 📦 バックアップファイル

- `app/api/automation/logs/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/dispatch/logs/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/docs/content/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/docs/counts/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/docs/create/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/docs/list/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/ebay/sell/test/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/inventory-monitoring/logs/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/listing/logs/[sku]/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/listing/logs/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/media/remotion/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/notification/test/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/products/test/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/supabase/list-tables/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/supabase/table-detail/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/supabase/test-connection/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/test/create-test-schedule/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/api/test/ebay-browse/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `app/docs/page.tsx.bak`
  理由: バックアップ拡張子: .bak

- `app/tools/media-hub/docs/page.tsx.bak`
  理由: バックアップ拡張子: .bak

- `app/tools/n8n-workflows/components/workflow-list.tsx.bak`
  理由: バックアップ拡張子: .bak

- `lib/empire-os/migrations/webhook-normalizer.ts.bak`
  理由: バックアップ拡張子: .bak

- `lib/mappers/asia/__tests__/asia-publisher.test.js.bak`
  理由: バックアップ拡張子: .bak

- `lib/supabase/api.ts.bak`
  理由: バックアップ拡張子: .bak

- `lib/supabase/b2b-partnership.ts.bak`
  理由: バックアップ拡張子: .bak

- `lib/supabase/client.ts.bak`
  理由: バックアップ拡張子: .bak

- `lib/supabase/hts-classification.ts.bak`
  理由: バックアップ拡張子: .bak

- `lib/supabase/hts.ts.bak`
  理由: バックアップ拡張子: .bak

- `lib/supabase/products.ts.bak`
  理由: バックアップ拡張子: .bak

- `lib/supabase/route.ts.bak`
  理由: バックアップ拡張子: .bak

- `lib/supabase/server.ts.bak`
  理由: バックアップ拡張子: .bak

**推奨**: `--move` または `--nightly` で 03_ARCHIVE_STORAGE/ へ移動


## 🗂️ 一時ディレクトリ

なし ✅


## ⚠️ 疑わしいファイル

なし ✅


## 🛠️ コマンド

```bash
# スキャンのみ
node governance/stray-scanner-v2.js

# ドライラン
node governance/stray-scanner-v2.js --dry-run

# 移動実行
node governance/stray-scanner-v2.js --move

# 夜間自動修正
node governance/stray-scanner-v2.js --nightly
```

---
*N3 Empire OS - Stray Scanner v2.1 (ホワイトリスト方式)*
