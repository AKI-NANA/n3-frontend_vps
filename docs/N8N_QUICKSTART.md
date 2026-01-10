# N3 n8n連携 クイックスタートガイド

## セットアップ

### 1. データベース準備

Supabaseで以下のSQLを実行：

```sql
-- n8n_jobs テーブル作成
-- sql/create_n8n_jobs_table.sql を参照
```

### 2. 環境変数確認

`.env.local`に以下が設定されていることを確認：

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
EBAY_CLIENT_ID_MJT=xxx
EBAY_CLIENT_SECRET_MJT=xxx
EBAY_CLIENT_ID_GREEN=xxx
EBAY_CLIENT_SECRET_GREEN=xxx
```

---

## テストコマンド

### ID配列による出品テスト

```bash
# プレビュー（実際の出品なし）
curl -X POST http://localhost:3000/api/n8n/listing/by-ids \
  -H "Content-Type: application/json" \
  -d '{
    "ids": [1, 2, 3],
    "account": "green",
    "marketplace": "ebay"
  }'
```

### 条件による出品プレビュー

```bash
# 対象件数の確認（GET）
curl "http://localhost:3000/api/n8n/listing/by-condition?date=2026-01-10&status=reserved&account=green"

# 実際の出品（POST）
curl -X POST http://localhost:3000/api/n8n/listing/by-condition \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-01-10",
    "status": "reserved",
    "account": "green",
    "limit": 10
  }'
```

### ジョブステータス確認

```bash
# 特定のジョブ
curl "http://localhost:3000/api/n8n/jobs?jobId=550e8400-e29b-41d4-a716-446655440000"

# 最近のジョブ一覧
curl "http://localhost:3000/api/n8n/jobs?limit=10"

# 過去7日のジョブを削除
curl -X DELETE "http://localhost:3000/api/n8n/jobs?olderThanDays=7"
```

---

## n8nワークフロー設定

### HTTP Requestノード

**URL**: `https://your-vps.com/api/n8n/listing/by-ids`

**Method**: `POST`

**Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Body (JSON)**:
```json
{
  "ids": "={{ $json.selected_ids }}",
  "account": "green",
  "marketplace": "ebay"
}
```

**Options**:
- Timeout: 300000 (5分)
- Batch Size: 1

---

## エラー対応

### "eBayトークン取得失敗"

1. eBay Developer Portalでアプリ設定を確認
2. `/api/tokens/refresh` でトークン更新
3. `ebay_tokens`テーブルのデータを確認

### "商品が見つかりません"

1. 送信したIDが`products_master`または`inventory_master`に存在するか確認
2. 商品のステータスを確認（draft, reserved, active等）

### "ポリシーIDが不足"

1. `ebay_default_policies`テーブルにレコードが存在するか確認
2. `/api/ebay/list-policies`で現在のポリシーを取得
3. 取得したIDをDBに登録

---

## ファイル構成

```
app/api/n8n/
├── route.ts                    # コールバック受信
├── jobs/route.ts               # ジョブ管理
└── listing/
    ├── by-ids/route.ts         # ID配列出品
    └── by-condition/route.ts   # 条件出品

lib/
├── ebay/
│   ├── token-manager.ts        # トークン管理
│   └── listing-api.ts          # 出品処理
├── services/
│   ├── eu-responsible-person-service.ts
│   └── shipping-policy-service.ts
└── supabase/
    ├── client.ts               # ブラウザ用
    └── server.ts               # サーバー用

sql/
└── create_n8n_jobs_table.sql   # テーブル作成SQL

docs/
└── N8N_API_SPEC.md             # 詳細仕様書
```
