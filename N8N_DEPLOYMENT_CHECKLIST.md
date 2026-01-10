# N3 VPS + n8n 連携チェックリスト

## 📋 VPSデプロイ前の確認事項

### 1. データベース準備

```bash
# Supabaseで以下のSQLを実行
# sql/n8n_integration_tables.sql
```

### 2. 環境変数確認（VPS .env）

```env
# 必須
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
NEXT_PUBLIC_BASE_URL=http://160.16.120.186:3000

# eBay認証
EBAY_CLIENT_ID_MJT=xxx
EBAY_CLIENT_SECRET_MJT=xxx
EBAY_CLIENT_ID_GREEN=xxx
EBAY_CLIENT_SECRET_GREEN=xxx
```

### 3. ビルドテスト

```bash
cd ~/n3-frontend_vps
npm run build
```

---

## ✅ n8nワークフロー動作確認

| ワークフロー | 状態 | 備考 |
|-------------|------|------|
| N3-LISTING-GATEWAY-V1 | ✅ Ready | `/api/gateway` 経由 |
| N3-LISTING-GATEWAY-V2 | ✅ Ready | `/api/gateway` 経由 |
| N3-スケジュール実行（v3.1） | ✅ Ready | `listing_schedule`テーブル使用 |
| N3-在庫監視 | ✅ Ready | Supabase直接アクセス |
| N3-設定更新受信 | ✅ Ready | n8n API + Supabase |
| N3-出品処理（完全版v3.1） | ✅ Ready | `/api/gateway` 経由 |
| N3-エラー監視通知 | ✅ Ready | ChatWork通知 |

---

## 🔧 作成・修正したファイル

### 新規API（n8n連携用）
- `/api/n8n/listing/by-ids/route.ts` - ID配列による出品
- `/api/n8n/listing/by-condition/route.ts` - 条件指定出品
- `/api/n8n/jobs/route.ts` - ジョブ管理

### 修正API
- `/api/listing/now/route.ts` - モック→実装
- `/api/listing/execute-scheduled/route.ts` - モック→実装

### 共通ライブラリ
- `/lib/ebay/token-manager.ts` - トークン管理
- `/lib/ebay/listing-api.ts` - 出品処理
- `/lib/supabase/client.ts` - ブラウザ用
- `/lib/supabase/server.ts` - サーバー用
- `/lib/services/eu-responsible-person-service.ts`
- `/lib/services/shipping-policy-service.ts`

### SQL
- `/sql/n8n_integration_tables.sql` - テーブル作成

### ドキュメント
- `/docs/N8N_API_SPEC.md` - API仕様
- `/docs/N8N_QUICKSTART.md` - クイックスタート

---

## 📡 n8n設定変更が必要な箇所

### LISTING-GATEWAY-V1/V2

現在の設定:
```
URL: http://localhost:3000/api/gateway
```

VPS用に変更:
```
URL: http://160.16.120.186:3000/api/gateway
# または
URL: https://n3.emverze.com/api/gateway
```

### スケジュール実行（v3.1）

内部Webhook呼び出し（変更不要）:
```
URL: http://160.16.120.186:5678/webhook/listing-reserve
```

---

## 🚀 デプロイ手順

### 1. VPSにファイルをアップロード

```bash
# ローカルで
cd ~/n3-frontend_vps
git add -A
git commit -m "n8n連携API追加"
git push origin main

# VPSで
ssh vps
cd /var/www/n3-frontend
git pull origin main
npm install
npm run build
pm2 restart n3-frontend
```

### 2. データベースマイグレーション

Supabaseダッシュボードで `sql/n8n_integration_tables.sql` を実行

### 3. n8nワークフロー更新

LISTING-GATEWAYのURLを`localhost`から`160.16.120.186:3000`に変更

### 4. 動作確認

```bash
# VPSから
curl -X POST http://localhost:3000/api/n8n/listing/by-ids \
  -H "Content-Type: application/json" \
  -d '{"ids": [1], "account": "green"}'
```

---

## ⚠️ 注意事項

1. **eBayトークン**: 事前に両アカウント（MJT, GREEN）のトークンが`ebay_tokens`テーブルに存在すること

2. **ポリシーID**: `ebay_default_policies`テーブルに各アカウントのPayment/Return/Fulfillmentポリシーが登録されていること

3. **Location**: eBay Seller Hubで住所が登録され、`ebay_locations`テーブルに同期されていること

4. **n8nタイムアウト**: HTTP Requestノードのtimeoutを`300000`（5分）以上に設定
