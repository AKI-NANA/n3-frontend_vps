# N3 ↔ n8n 連携API仕様書

## 概要

n8nからN3 VPS APIを呼び出す際の「ペイロードサイズ制限」と「タイムアウト」問題を解決するため、
**軽量なリクエストでAPIを呼び出し、詳細データはAPI側でDBから取得する**設計を採用。

### 設計原則

1. **ID送信型**: 商品の全データではなく、ID配列のみをn8nから送信
2. **条件送信型**: 条件（日付、ステータス等）だけを送信し、対象商品はAPI側で抽出
3. **非同期対応**: 大量処理は即座にレスポンスを返し、バックグラウンドで処理
4. **ジョブ追跡**: すべての処理はジョブIDで追跡可能

---

## エンドポイント一覧

### 1. ID配列による出品

**POST** `/api/n8n/listing/by-ids`

n8nで選択した商品のIDのみを送信し、詳細データはサーバーで取得して出品。

#### リクエスト

```json
{
  "ids": [101, 102, 103],
  "account": "green",
  "marketplace": "ebay",
  "interval": 3000,
  "async": false
}
```

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| ids | number[] | ✓ | 商品IDの配列（最大100件） |
| account | string | - | eBayアカウント（mjt/green）デフォルト: mjt |
| marketplace | string | - | 出品先（ebay）デフォルト: ebay |
| interval | number | - | 商品間インターバル（ms）デフォルト: 3000 |
| async | boolean | - | 非同期処理モード デフォルト: false |

#### レスポンス（同期モード）

```json
{
  "success": true,
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "summary": {
    "total": 3,
    "success": 2,
    "failed": 1
  },
  "results": [
    { "id": 101, "sku": "SKU001", "itemId": "123456789012", "status": "success" },
    { "id": 102, "sku": "SKU002", "itemId": "123456789013", "status": "success" },
    { "id": 103, "sku": "SKU003", "status": "failed" }
  ],
  "errors": [
    { "id": 103, "sku": "SKU003", "error": "画像が不正です" }
  ],
  "duration": 15234
}
```

#### レスポンス（非同期モード）

```json
{
  "success": true,
  "status": "processing",
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "3件の出品処理を開始しました",
  "checkStatusUrl": "/api/n8n/jobs?jobId=550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 2. 条件による出品

**POST** `/api/n8n/listing/by-condition`

条件（日付、ステータス等）のみを送信し、対象商品の抽出から出品までをすべてサーバーで処理。

#### リクエスト

```json
{
  "date": "2026-01-10",
  "status": "reserved",
  "account": "green",
  "marketplace": "ebay",
  "limit": 50,
  "interval": 3000
}
```

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| date | string | - | 出品予定日（YYYY-MM-DD形式） |
| status | string | - | ステータス（reserved/ready_to_list/pending） |
| account | string | - | eBayアカウント（mjt/green） |
| marketplace | string | - | 出品先（ebay） |
| limit | number | - | 最大処理件数 デフォルト: 50 |
| interval | number | - | 商品間インターバル（ms） |
| scheduleId | number | - | 特定のスケジュールID指定 |

#### プレビュー（GET）

条件に該当する商品数を事前確認：

**GET** `/api/n8n/listing/by-condition?date=2026-01-10&status=reserved&account=green`

```json
{
  "conditions": {
    "date": "2026-01-10",
    "status": "reserved",
    "account": "green",
    "marketplace": "ebay"
  },
  "schedules": [
    { "id": 1, "date": "2026-01-10", "account": "green", "planned_count": 25 }
  ],
  "schedulesCount": 1,
  "productsCount": 23,
  "message": "23件の商品が出品対象です"
}
```

---

### 3. ジョブ管理

**GET** `/api/n8n/jobs`

ジョブの状態確認と履歴取得。

#### 特定のジョブを確認

```
GET /api/n8n/jobs?jobId=550e8400-e29b-41d4-a716-446655440000
```

```json
{
  "success": true,
  "job": {
    "id": 1,
    "job_id": "550e8400-e29b-41d4-a716-446655440000",
    "workflow": "listing-by-ids",
    "action": "execute",
    "status": "completed",
    "request_data": { "ids": [101, 102, 103], "account": "green" },
    "result": { "success": 3, "failed": 0 },
    "created_at": "2026-01-10T10:00:00Z",
    "completed_at": "2026-01-10T10:01:30Z"
  }
}
```

#### ジョブ一覧

```
GET /api/n8n/jobs?workflow=listing-by-ids&status=completed&limit=20
```

---

## n8nワークフロー設定例

### HTTP Requestノード設定

```javascript
// n8n HTTP Requestノードの設定

// URL
"https://your-n3-vps.com/api/n8n/listing/by-ids"

// Method
"POST"

// Headers
{
  "Content-Type": "application/json"
}

// Body (JSON)
{
  "ids": "={{ $json.selected_product_ids }}",  // 前のノードから取得
  "account": "green",
  "marketplace": "ebay"
}

// Options
{
  "timeout": 300000  // 5分
}
```

### 条件指定の場合

```javascript
// Body (JSON)
{
  "date": "={{ $now.format('YYYY-MM-DD') }}",
  "status": "reserved",
  "account": "green"
}
```

---

## エラーハンドリング

### HTTPステータスコード

| コード | 説明 |
|--------|------|
| 200 | 成功 |
| 400 | リクエストパラメータエラー |
| 404 | 対象データが見つからない |
| 500 | サーバーエラー |

### エラーレスポンス例

```json
{
  "success": false,
  "error": "ids は必須です（商品IDの配列）",
  "example": { "ids": [101, 102, 103], "account": "green" }
}
```

---

## n8n タイムアウト対策

### 方法1: 非同期モード使用

```json
{
  "ids": [101, 102, 103, ...],
  "account": "green",
  "async": true
}
```

即座に `{ "status": "processing", "jobId": "..." }` が返り、
n8nは別のHTTP Requestノードでジョブ完了を確認。

### 方法2: n8n側でループ

1件ずつ出品し、n8n側でエラーハンドリング：

```
Loop Over Items → HTTP Request → Wait (3秒) → 次の商品
```

### 方法3: 条件送信型の使用

n8nは「実行ボタン」役に徹し、商品抽出はすべてAPI側で処理：

```json
{
  "date": "2026-01-10",
  "status": "reserved",
  "account": "green"
}
```

---

## データベーステーブル

### n8n_jobs

ジョブ追跡用テーブル（`sql/create_n8n_jobs_table.sql` で作成）

| カラム | 型 | 説明 |
|--------|-----|------|
| job_id | UUID | ジョブの一意識別子 |
| workflow | VARCHAR | ワークフロー名 |
| action | VARCHAR | アクション名 |
| status | VARCHAR | pending/processing/completed/partial/failed |
| request_data | JSONB | リクエストデータ |
| result | JSONB | 処理結果 |
| error | TEXT | エラーメッセージ |
| created_at | TIMESTAMPTZ | 作成日時 |
| completed_at | TIMESTAMPTZ | 完了日時 |

---

## トラブルシューティング

### 問題: ペイロードサイズ制限

**症状**: n8nから大量のデータを送ると「Request Entity Too Large」エラー

**解決策**: 
- ID配列のみを送信（`/api/n8n/listing/by-ids`）
- または条件のみを送信（`/api/n8n/listing/by-condition`）

### 問題: タイムアウト

**症状**: 処理中にn8nがタイムアウト

**解決策**:
1. n8nのHTTP Requestノードで `timeout: 300000`（5分）を設定
2. 非同期モード（`async: true`）を使用
3. 1件ずつ処理するループワークフローを使用

### 問題: eBayトークンエラー

**症状**: `eBayトークン取得失敗` エラー

**解決策**:
1. `/api/tokens/refresh` でトークンを更新
2. eBay Developer Portalでアプリ設定を確認

---

## 関連ファイル

```
/app/api/n8n/
├── route.ts              # n8nコールバック受信
├── listing/
│   ├── by-ids/route.ts   # ID配列による出品
│   └── by-condition/route.ts  # 条件による出品
└── jobs/route.ts         # ジョブ管理

/sql/
└── create_n8n_jobs_table.sql  # テーブル作成SQL
```

---

## 更新履歴

- 2026-01-10: 初版作成
  - ID配列による出品API追加
  - 条件による出品API追加
  - ジョブ管理API追加
