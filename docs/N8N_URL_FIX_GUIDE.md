# n8nワークフロー修正ガイド

## 🚨 必須修正: LISTING-GATEWAYのURL

### 問題
現在のn8nワークフローでは `http://localhost:3000/api/gateway` を呼び出していますが、
n8nはVPS上のDockerコンテナで動作しているため、`localhost`はn8nコンテナ自身を指します。
そのため、N3 APIには到達できません。

### 修正方法

#### 方法1: n8n UIで手動修正

1. n8n管理画面にアクセス: http://160.16.120.186:5678
2. 「N3-LISTING-GATEWAY-V1」を開く
3. 「List Now」ノードをクリック
4. URLを変更:
   ```
   旧: http://localhost:3000/api/gateway
   新: http://160.16.120.186:3000/api/gateway
   ```
5. 「Schedule Listing」ノードも同様に修正
6. 保存して有効化

#### 方法2: n8n API経由で更新

```bash
# ワークフローID: ypRpQi9J4ro1Inom (LISTING-GATEWAY-V1)

curl -X PATCH "http://160.16.120.186:5678/api/v1/workflows/ypRpQi9J4ro1Inom" \
  -H "X-N8N-API-KEY: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": [
      {
        "id": "3d05b1aa-935d-4c90-9e53-c5f777eabf7d",
        "name": "List Now",
        "parameters": {
          "method": "POST",
          "url": "http://160.16.120.186:3000/api/gateway",
          "sendBody": true,
          "specifyBody": "json",
          "jsonBody": "={{ JSON.stringify({ action: \"listing/now\", method: \"POST\", data: { ids: $json.ids, account: $json.account || \"green\", target: $json.target || \"ebay\", products: $json.products || [] } }) }}",
          "options": { "timeout": 120000 }
        }
      },
      {
        "id": "84c2625d-64d8-4562-a34e-f9fbb4f300ef",
        "name": "Schedule Listing",
        "parameters": {
          "method": "POST",
          "url": "http://160.16.120.186:3000/api/gateway",
          "sendBody": true,
          "specifyBody": "json",
          "jsonBody": "={{ JSON.stringify({ action: \"listing/execute-scheduled\", method: \"POST\", data: { ids: $json.ids, scheduledAt: $json.scheduledAt, account: $json.account || \"green\", target: $json.target || \"ebay\", products: $json.products || [] } }) }}",
          "options": { "timeout": 120000 }
        }
      }
    ]
  }'
```

---

## 📋 全ワークフロー接続確認

| ワークフロー | 接続先 | 状態 | 修正要否 |
|-------------|--------|------|----------|
| N3-LISTING-GATEWAY-V1 | `localhost:3000` | ❌ 接続不可 | **要修正** |
| N3-LISTING-GATEWAY-V2 | `localhost:3000` | ❌ 接続不可 | **要修正** |
| N3-スケジュール実行(v3.1) | Supabase直接 + n8n内部 | ✅ OK | 不要 |
| N3-在庫監視 | Supabase直接 | ✅ OK | 不要 |
| N3-設定更新受信 | n8n内部API | ✅ OK | 不要 |
| N3-エラー監視通知 | ChatWork | ✅ OK | 不要 |

---

## 🔧 代替案: Docker Network経由

もしn8nとN3が同じDockerネットワーク上にある場合、コンテナ名で接続可能:

```
http://n3-frontend:3000/api/gateway
```

ただし、N3がPM2で直接動作している場合はIPアドレス指定が必要です。

---

## ✅ 修正後の動作フロー

```
[n8nスケジュールトリガー (60分毎)]
  ↓
[Supabase: listing_schedule テーブルからpending取得]
  ↓
[n8n内部Webhook: /webhook/listing-reserve]
  ↓
[LISTING-GATEWAY: http://160.16.120.186:3000/api/gateway] ← 修正後
  ↓
[N3 API: /api/listing/now または /api/listing/execute-scheduled]
  ↓
[eBay API呼び出し → 出品完了]
  ↓
[Supabase: ステータス更新]
  ↓
[ChatWork: 通知送信]
```
