# AI Message Hub API

統一AIメッセージハブのためのAPI仕様書

## 概要

AIが生成した提案やメッセージを管理し、ユーザーが承認/却下できるシステムのためのAPIエンドポイント群。

---

## エンドポイント一覧

### 1. メッセージ一覧取得

**GET** `/api/tools/messages`

AIメッセージの一覧を取得します（フィルタリング・ページネーション対応）。

#### クエリパラメータ

| パラメータ | 型 | デフォルト | 説明 |
|----------|---|----------|------|
| `status` | string | `all` | フィルタするステータス: `pending`, `approved`, `rejected`, `expired`, `all` |
| `message_type` | string | - | メッセージタイプでフィルタ: `listing_suggestion`, `auto_reply`, `image_generation`, etc. |
| `limit` | number | `50` | 取得件数（最大100） |
| `offset` | number | `0` | オフセット |
| `sort_by` | string | `created_at` | ソート項目: `created_at`, `updated_at`, `priority` |
| `sort_order` | string | `desc` | ソート順: `asc`, `desc` |

#### レスポンス例

```json
{
  "success": true,
  "messages": [
    {
      "message_id": "123e4567-e89b-12d3-a456-426614174000",
      "user_id": "user_123",
      "message_type": "listing_suggestion",
      "status": "pending",
      "source_function": "ai_listing_generator",
      "content": {
        "title": "Vintage Toy Car 1960s",
        "description": "Rare collectible toy car from the 1960s...",
        "price": 29.99
      },
      "metadata": {
        "confidence_score": 0.95
      },
      "priority": 8,
      "expires_at": "2025-12-01T00:00:00Z",
      "created_at": "2025-11-27T10:30:00Z",
      "updated_at": "2025-11-27T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 50,
    "offset": 0,
    "has_more": false
  },
  "statistics": {
    "total": 42,
    "pending": 15,
    "approved": 20,
    "rejected": 5,
    "expired": 2
  }
}
```

---

### 2. メッセージ作成

**POST** `/api/tools/messages`

新しいAIメッセージを作成します。

#### リクエストボディ

```json
{
  "message_type": "listing_suggestion",
  "source_function": "ai_listing_generator",
  "content": {
    "title": "Vintage Toy Car 1960s",
    "description": "Rare collectible toy car from the 1960s...",
    "price": 29.99
  },
  "metadata": {
    "confidence_score": 0.95
  },
  "priority": 8,
  "expires_at": "2025-12-01T00:00:00Z",
  "related_entity_type": "product",
  "related_entity_id": "prod_12345"
}
```

#### 必須フィールド

- `message_type`: メッセージタイプ（以下のいずれか）
  - `listing_suggestion`
  - `auto_reply`
  - `image_generation`
  - `price_optimization`
  - `inventory_alert`
  - `market_insight`
  - `other`
- `source_function`: メッセージを生成したAI機能の名前
- `content`: AI生成コンテンツ（JSONB形式、構造は自由）

#### オプションフィールド

- `metadata`: 追加のメタデータ（JSONB形式）
- `priority`: 優先度（0-10、デフォルト: 0）
- `expires_at`: 有効期限（ISO 8601形式）
- `related_entity_type`: 関連エンティティのタイプ（例: `product`, `order`, `customer`）
- `related_entity_id`: 関連エンティティのID

#### レスポンス例

```json
{
  "success": true,
  "message": {
    "message_id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "user_123",
    "message_type": "listing_suggestion",
    "status": "pending",
    "source_function": "ai_listing_generator",
    "content": { ... },
    "metadata": { ... },
    "priority": 8,
    "created_at": "2025-11-27T10:30:00Z",
    "updated_at": "2025-11-27T10:30:00Z"
  }
}
```

---

### 3. メッセージ承認

**POST** `/api/tools/messages/approve`

AIメッセージを承認します（ステータスを `pending` → `approved` に変更）。

#### リクエストボディ

```json
{
  "message_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

#### レスポンス例

```json
{
  "success": true,
  "message": {
    "message_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "approved",
    "approved_at": "2025-11-27T11:00:00Z",
    "updated_at": "2025-11-27T11:00:00Z",
    ...
  }
}
```

#### エラー例

```json
{
  "success": false,
  "error": "メッセージはすでに approved 状態です"
}
```

---

### 4. メッセージ却下

**POST** `/api/tools/messages/reject`

AIメッセージを却下します（ステータスを `pending` → `rejected` に変更）。

#### リクエストボディ

```json
{
  "message_id": "123e4567-e89b-12d3-a456-426614174000",
  "rejection_reason": "タイトルが不適切"
}
```

- `message_id`: 必須
- `rejection_reason`: オプション（却下理由）

#### レスポンス例

```json
{
  "success": true,
  "message": {
    "message_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "rejected",
    "rejected_at": "2025-11-27T11:05:00Z",
    "rejection_reason": "タイトルが不適切",
    "updated_at": "2025-11-27T11:05:00Z",
    ...
  }
}
```

---

## メッセージタイプ

| タイプ | 説明 | content 構造例 |
|-------|------|--------------|
| `listing_suggestion` | 出品提案 | `{ title, description, price, category }` |
| `auto_reply` | 自動返信 | `{ message, customer_id, order_id }` |
| `image_generation` | 画像生成ログ | `{ image_url, prompt, model }` |
| `price_optimization` | 価格最適化提案 | `{ product_id, current_price, suggested_price }` |
| `inventory_alert` | 在庫アラート | `{ product_id, current_stock, threshold }` |
| `market_insight` | 市場分析 | `{ category, trend, recommendation }` |
| `other` | その他 | 自由形式 |

---

## ステータス遷移

```
pending → approved (承認)
pending → rejected (却下)
pending → expired (期限切れ、自動)
```

- `pending`: 承認待ち
- `approved`: 承認済み
- `rejected`: 却下済み
- `expired`: 期限切れ（`expires_at` が過去になった場合に自動設定）

---

## エラーレスポンス

全てのエンドポイントで共通のエラー形式:

```json
{
  "success": false,
  "error": "エラーメッセージ"
}
```

### HTTPステータスコード

- `200`: 成功
- `400`: バリデーションエラー
- `401`: 認証エラー
- `404`: リソースが見つからない
- `500`: サーバーエラー

---

## 使用例

### 出品提案をリスト表示

```bash
curl -X GET "https://your-domain.com/api/tools/messages?status=pending&message_type=listing_suggestion&limit=10"
```

### メッセージを承認

```bash
curl -X POST "https://your-domain.com/api/tools/messages/approve" \
  -H "Content-Type: application/json" \
  -d '{"message_id": "123e4567-e89b-12d3-a456-426614174000"}'
```

### メッセージを却下

```bash
curl -X POST "https://your-domain.com/api/tools/messages/reject" \
  -H "Content-Type: application/json" \
  -d '{
    "message_id": "123e4567-e89b-12d3-a456-426614174000",
    "rejection_reason": "内容が不適切"
  }'
```

---

## データベーススキーマ

詳細は `supabase/migrations/20251127_create_ai_messages_table.sql` を参照。

### RPC関数

- `approve_ai_message(p_message_id UUID)`: メッセージを承認
- `reject_ai_message(p_message_id UUID, p_rejection_reason TEXT)`: メッセージを却下
- `mark_expired_ai_messages()`: 期限切れメッセージを自動的にマーク

---

## セキュリティ

- 全てのエンドポイントで認証が必須
- Row Level Security (RLS) により、ユーザーは自分のメッセージのみアクセス可能
- RPC関数は `SECURITY DEFINER` で実行され、ユーザー権限を確認

---

## 今後の拡張

- バッチ承認/却下（複数メッセージを一括処理）
- メッセージのアーカイブ機能
- Webhook統合（承認時に外部システムに通知）
- メッセージテンプレート機能
