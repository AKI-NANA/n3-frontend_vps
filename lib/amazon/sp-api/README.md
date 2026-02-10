# Amazon Selling Partner API (SP-API) 統合

## 概要

Amazon SP-APIとの統合により、Amazon全22マーケットプレイスへの出品、在庫管理、価格設定を自動化します。

**Phase 1-2で実装した機能:**
- LWA (Login With Amazon) OAuth 2.0認証
- Refresh Token管理（暗号化保存）
- Access Token自動リフレッシュ
- SP-APIクライアント（Catalog、Listings、Feeds、Reports API対応）

---

## 主要コンポーネント

### 1. トークン暗号化 (`crypto-utils.ts`)

AES-256-GCMによるトークンの暗号化・復号化

```typescript
import { encryptToken, decryptToken } from '@/lib/amazon/sp-api/crypto-utils'

// Refresh Tokenを暗号化
const encrypted = encryptToken('Atzr|your_refresh_token')

// 復号化
const decrypted = decryptToken(encrypted)
```

**環境変数:**
- `ENCRYPTION_KEY` - 暗号化キー（32バイト以上推奨）

---

### 2. LWA認証 (`lwa-auth.ts`)

Login With Amazon OAuth 2.0フロー

```typescript
import {
  generateAuthorizationUrl,
  exchangeAuthorizationCode,
  getAccessToken,
  TokenManager
} from '@/lib/amazon/sp-api/lwa-auth'

// 1. 認証URLを生成
const authUrl = generateAuthorizationUrl('http://localhost:3000/callback')

// 2. Authorization Codeを交換
const tokenInfo = await exchangeAuthorizationCode(code, redirectUri)

// 3. Access Tokenを取得
const newTokenInfo = await getAccessToken(refreshToken)

// 4. TokenManagerで自動リフレッシュ
const tokenManager = new TokenManager(refreshToken)
const accessToken = await tokenManager.getValidAccessToken()
```

**環境変数:**
- `AMAZON_SP_CLIENT_ID` - LWA Client ID
- `AMAZON_SP_CLIENT_SECRET` - LWA Client Secret
- `AMAZON_SP_REFRESH_TOKEN` - Refresh Token（オプション）

---

### 3. SP-APIクライアント (`sp-api-client.ts`)

Amazon SP-APIへの統一的なアクセス

```typescript
import { SPAPIClient } from '@/lib/amazon/sp-api/sp-api-client'

const client = new SPAPIClient()

// Catalog Items API - ASIN検索
const catalogItem = await client.getCatalogItem('B08N5WRWNW', ['ATVPDKIKX0DER'])

// Listings API - 出品作成/更新
await client.putListingsItem(
  sellerId,
  sku,
  ['ATVPDKIKX0DER'],
  'PRODUCT',
  'LISTING',
  {
    condition_type: [{ value: 'new_new' }],
    merchant_suggested_asin: [{ value: 'B08N5WRWNW' }],
    // ... その他の属性
  }
)

// Reports API - レポート作成
const report = await client.createReport(
  'GET_MERCHANT_LISTINGS_DATA',
  ['ATVPDKIKX0DER']
)

// Feeds API - フィード作成
const feed = await client.createFeed(
  'POST_PRODUCT_DATA',
  ['ATVPDKIKX0DER'],
  'feedDocumentId'
)
```

**環境変数:**
- `AMAZON_SP_CLIENT_ID`
- `AMAZON_SP_CLIENT_SECRET`
- `AMAZON_SP_REFRESH_TOKEN`
- `AMAZON_SP_AWS_ACCESS_KEY`
- `AMAZON_SP_AWS_SECRET_KEY`
- `AMAZON_SP_SELLER_ID`
- `AMAZON_SP_REGION` - デフォルト: `NA`

---

## APIエンドポイント

### 1. 認証開始

```
GET /api/amazon/auth/authorize
```

ユーザーをAmazonのOAuthログインページにリダイレクト

### 2. 認証コールバック

```
GET /api/amazon/auth/callback?code=xxx&state=xxx
```

Amazonからリダイレクトされ、Authorization Codeを受け取る
Refresh Tokenを取得し、DBに暗号化保存

### 3. トークン取得

```
GET /api/amazon/auth/token?marketplace=AMAZON_US
```

**レスポンス例:**
```json
{
  "success": true,
  "data": {
    "marketplace": "AMAZON_US",
    "has_token": true,
    "expires_at": "2024-01-01T12:00:00.000Z",
    "created_at": "2024-01-01T10:00:00.000Z"
  }
}
```

### 4. トークン更新（手動）

```
POST /api/amazon/auth/token
Content-Type: application/json

{
  "marketplace": "AMAZON_US",
  "refresh_token": "Atzr|your_refresh_token"
}
```

### 5. トークン削除

```
DELETE /api/amazon/auth/token?marketplace=AMAZON_US
```

---

## データベース設定

### marketplace_settings テーブル拡張

`api_credentials` フィールド（JSONB型）にトークン情報を保存

**スキーマ:**
```typescript
interface MarketplaceSettings {
  marketplace: string
  api_credentials: {
    refresh_token: string // 暗号化されたRefresh Token
    access_token_expires_at: string // Access Token有効期限
    created_at: string // トークン作成日時
  } | null
}
```

**マイグレーション（Supabase SQLエディタで実行）:**
```sql
-- api_credentialsカラムを追加（存在しない場合）
ALTER TABLE marketplace_settings
ADD COLUMN IF NOT EXISTS api_credentials JSONB;

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_marketplace_settings_marketplace
ON marketplace_settings(marketplace);
```

---

## 使用フロー

### 初回セットアップ

1. **環境変数設定**
   ```env
   ENCRYPTION_KEY=your-32-byte-or-longer-encryption-key
   AMAZON_SP_CLIENT_ID=amzn1.application-oa2-client.xxxxx
   AMAZON_SP_CLIENT_SECRET=xxxxx
   AMAZON_SP_AWS_ACCESS_KEY=AKIAxxxxx
   AMAZON_SP_AWS_SECRET_KEY=xxxxx
   AMAZON_SP_SELLER_ID=A1B2C3D4E5F6G7
   AMAZON_SP_REGION=NA
   ```

2. **OAuth認証フロー**
   ```typescript
   // ユーザーを /api/amazon/auth/authorize にリダイレクト
   // → Amazonログインページ
   // → /api/amazon/auth/callback にリダイレクト
   // → Refresh TokenがDBに保存される
   ```

3. **または手動でRefresh Token設定**
   ```bash
   curl -X POST http://localhost:3000/api/amazon/auth/token \
     -H "Content-Type: application/json" \
     -d '{"marketplace":"AMAZON_US","refresh_token":"Atzr|xxxxx"}'
   ```

### SP-API使用例

```typescript
import { SPAPIClient } from '@/lib/amazon/sp-api/sp-api-client'
import { createClient } from '@/lib/supabase/server'
import { decryptToken } from '@/lib/amazon/sp-api/crypto-utils'

async function listAmazonProduct() {
  // 1. DBからRefresh Tokenを取得
  const supabase = await createClient()
  const { data } = await supabase
    .from('marketplace_settings')
    .select('api_credentials')
    .eq('marketplace', 'AMAZON_US')
    .single()

  const encryptedToken = data?.api_credentials?.refresh_token
  if (!encryptedToken) {
    throw new Error('No refresh token found')
  }

  // 2. 復号化
  const refreshToken = decryptToken(encryptedToken)

  // 3. SP-APIクライアント作成
  const client = new SPAPIClient({
    client_id: process.env.AMAZON_SP_CLIENT_ID!,
    client_secret: process.env.AMAZON_SP_CLIENT_SECRET!,
    refresh_token: refreshToken,
    aws_access_key_id: process.env.AMAZON_SP_AWS_ACCESS_KEY!,
    aws_secret_access_key: process.env.AMAZON_SP_AWS_SECRET_KEY!,
    seller_id: process.env.AMAZON_SP_SELLER_ID!,
    region: 'NA',
  })

  // 4. 出品作成
  const result = await client.putListingsItem(
    process.env.AMAZON_SP_SELLER_ID!,
    'MY-SKU-001',
    ['ATVPDKIKX0DER'], // US marketplace
    'PRODUCT',
    'LISTING',
    {
      condition_type: [{ value: 'new_new' }],
      merchant_suggested_asin: [{ value: 'B08N5WRWNW' }],
      purchasable_offer: [{
        marketplace_id: 'ATVPDKIKX0DER',
        currency: 'USD',
        our_price: [{ schedule: [{ value_with_tax: 19.99 }] }],
      }],
    }
  )

  return result
}
```

---

## サポートされるAmazonマーケットプレイス

| リージョン | マーケットプレイス | Marketplace ID | エンドポイント |
|-----------|-------------------|----------------|---------------|
| **北米 (NA)** | 米国 | ATVPDKIKX0DER | sellingpartnerapi-na.amazon.com |
| | カナダ | A2EUQ1WTGCTBG2 | 同上 |
| | メキシコ | A1AM78C64UM0Y8 | 同上 |
| **ヨーロッパ (EU)** | 英国 | A1F83G8C2ARO7P | sellingpartnerapi-eu.amazon.com |
| | ドイツ | A1PA6795UKMFR9 | 同上 |
| | フランス | A13V1IB3VIYZZH | 同上 |
| | イタリア | APJ6JRA9NG5V4 | 同上 |
| | スペイン | A1RKKUPIHCS9HS | 同上 |
| **極東 (FE)** | 日本 | A1VC38T7YXB528 | sellingpartnerapi-fe.amazon.com |
| | オーストラリア | A39IBJ37TRP1C6 | 同上 |
| | シンガポール | A19VAU5U5O7RUS | 同上 |

---

## セキュリティ

1. **トークン暗号化**
   - AES-256-GCM暗号化
   - 環境変数による暗号化キー管理
   - DBには暗号化されたトークンのみ保存

2. **環境変数管理**
   - `.env.local`に機密情報を保存
   - Gitには絶対にコミットしない
   - Vercel等のデプロイ環境では環境変数設定画面で設定

3. **CSRF対策**
   - OAuth認証時に`state`パラメータを使用
   - セッションストアまたはHTTP-onlyクッキーで検証

---

## トラブルシューティング

### "ENCRYPTION_KEY environment variable is required"

→ `.env.local`に`ENCRYPTION_KEY`を設定してください

### "Missing required Amazon SP-API credentials"

→ 以下の環境変数がすべて設定されているか確認してください：
- `AMAZON_SP_CLIENT_ID`
- `AMAZON_SP_CLIENT_SECRET`
- `AMAZON_SP_AWS_ACCESS_KEY`
- `AMAZON_SP_AWS_SECRET_KEY`
- `AMAZON_SP_SELLER_ID`

### "Failed to decrypt token"

→ `ENCRYPTION_KEY`が変更された可能性があります。トークンを再取得してください

### "LWA authentication failed"

→ Client IDとClient Secretが正しいか確認してください

---

## 次のステップ（Phase 1-3以降）

- [ ] データ変換モジュール（Amazon出品要件対応）
- [ ] 相乗り出品ロジック
- [ ] 在庫連動システム（Bull Queue統合）
- [ ] UI統合（/tools/editingへのAmazonタブ追加）
- [ ] 価格自動調整（IntegratedPricingServiceとの統合）

---

## 参考リンク

- [Amazon SP-API ドキュメント](https://developer-docs.amazon.com/sp-api/)
- [LWA認証ガイド](https://developer-docs.amazon.com/sp-api/docs/authorization)
- [Listings Items API](https://developer-docs.amazon.com/sp-api/docs/listings-items-api-v2021-08-01-reference)
- [Catalog Items API](https://developer-docs.amazon.com/sp-api/docs/catalog-items-api-v2022-04-01-reference)
