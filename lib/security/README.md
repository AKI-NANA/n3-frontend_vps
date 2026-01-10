# 🔐 P0: 認証情報暗号化システム（pgsodium）

**優先度**: P0（Critical - 本番稼働前に必須）

## 概要

このディレクトリには、マーケットプレイスAPI、決済サービス、RPAツールなどの認証情報を**PostgreSQL pgsodiumエクステンション**を使用して暗号化して保存・管理するシステムが含まれています。

### 🚨 セキュリティ上の課題（実装前）

- ❌ すべての認証情報が平文で`.env.local`に保存
- ❌ eBay、Shopee、Amazon、Qoo10のAPIキー・シークレットが露出
- ❌ Googleカレンダー連携の認証情報が平文
- ❌ 決済サービスやRPAツールの認証情報が平文
- ❌ Gitリポジトリへの誤コミットリスク

### ✅ セキュリティ対策（実装後）

- ✅ PostgreSQL pgsodiumによるデータベースレベルの暗号化
- ✅ すべての認証情報がAES-256で暗号化
- ✅ 認証情報へのアクセスはRLS（Row Level Security）で制御
- ✅ 環境変数フォールバック機能（段階的移行が可能）
- ✅ トークン有効期限の自動チェック機能

---

## 🏗️ アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│ API Route (app/api/ebay/get-token/route.ts)                 │
│  ↓ getCredentialWithFallback('ebay_client_id', 'EBAY_CLIENT_ID')
├─────────────────────────────────────────────────────────────┤
│ Credential Helper (lib/security/credentials.ts)             │
│  ↓ 1. Try encrypted DB → 2. Fallback to env var            │
├─────────────────────────────────────────────────────────────┤
│ Supabase PostgreSQL (pgsodium extension)                    │
│  - Table: encrypted_credentials                              │
│  - Encryption: AES-256 (automatic)                           │
│  - RLS: Service role only                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 ファイル構成

### 1. **マイグレーションSQL**
`lib/supabase/migrations/001_pgsodium_credentials.sql`

- pgsodiumエクステンションの有効化
- `encrypted_credentials`テーブルの作成
- RLS（Row Level Security）ポリシーの設定
- 暗号化・復号化ヘルパー関数

### 2. **TypeScript ユーティリティ**
`lib/security/credentials.ts`

- `storeEncryptedCredential()` - 認証情報を暗号化して保存
- `getDecryptedCredential()` - 認証情報を取得して復号化
- `getCredentialWithFallback()` - DB → 環境変数の順で取得
- `storeBatchCredentials()` - 複数の認証情報を一括保存
- `checkExpiredCredentials()` - 期限切れトークンをチェック
- `listCredentials()` - 認証情報の一覧取得（値は含まない）

### 3. **管理API**
`app/api/admin/setup-encryption/route.ts`

- `POST /api/admin/setup-encryption` - 初期セットアップと移行
- `GET /api/admin/setup-encryption` - ステータス確認

---

## 🚀 セットアップ手順

### ステップ1: マイグレーションSQLの実行

Supabase Studioで以下のSQLを実行してください：

```bash
# Supabase Studio > SQL Editor
# 以下のファイルの内容を貼り付けて実行
lib/supabase/migrations/001_pgsodium_credentials.sql
```

または、CLIで実行：

```bash
cd ~/n3-frontend_new
psql $SUPABASE_DATABASE_URL -f lib/supabase/migrations/001_pgsodium_credentials.sql
```

### ステップ2: 既存認証情報の移行

```bash
# 移行APIを実行（環境変数から暗号化DBへ）
curl -X POST http://localhost:3000/api/admin/setup-encryption
```

成功すると以下のような出力が表示されます：

```json
{
  "success": true,
  "message": "Encryption setup and migration completed",
  "migrated": 12,
  "total": 12,
  "credentials": [
    {
      "serviceName": "ebay_client_id",
      "credentialType": "api_key",
      "environment": "production",
      "description": "eBay Client ID for OAuth authentication"
    },
    ...
  ]
}
```

### ステップ3: 移行確認

```bash
# ステータス確認
curl http://localhost:3000/api/admin/setup-encryption
```

### ステップ4: APIルートの更新

既存のAPIルートを更新して、暗号化された認証情報を使用するようにします：

#### 更新前:
```typescript
const clientId = process.env.EBAY_CLIENT_ID;
const clientSecret = process.env.EBAY_CLIENT_SECRET;
```

#### 更新後:
```typescript
import { getCredentialWithFallback } from '@/lib/security/credentials';

const clientId = await getCredentialWithFallback('ebay_client_id', 'EBAY_CLIENT_ID');
const clientSecret = await getCredentialWithFallback('ebay_client_secret', 'EBAY_CLIENT_SECRET');
```

### ステップ5: 環境変数のクリーンアップ

暗号化DBへの移行が確認できたら、`.env.local`から機密情報を削除：

```bash
# 削除する環境変数（例）
# EBAY_CLIENT_ID=xxxxx         → 削除
# EBAY_CLIENT_SECRET=xxxxx     → 削除
# EBAY_REFRESH_TOKEN=xxxxx     → 削除
# GOOGLE_CLIENT_SECRET=xxxxx   → 削除

# 残す環境変数
NEXT_PUBLIC_SUPABASE_URL=...   # 公開情報なので残す
SUPABASE_SERVICE_ROLE_KEY=...  # 必要（ただし本番環境ではOS環境変数で管理推奨）
```

---

## 💻 使用例

### 例1: 認証情報の保存

```typescript
import { storeEncryptedCredential } from '@/lib/security/credentials';

// eBay認証情報を暗号化して保存
await storeEncryptedCredential(
  'ebay_client_id',
  'YOUR_CLIENT_ID',
  'api_key',
  'production',
  'eBay Client ID for OAuth authentication'
);

// 有効期限付きトークンの保存（18ヶ月後に期限切れ）
await storeEncryptedCredential(
  'ebay_refresh_token',
  'v^1.1#i^1#...',
  'refresh_token',
  'production',
  'eBay Refresh Token',
  new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000)
);
```

### 例2: 認証情報の取得（復号化）

```typescript
import { getDecryptedCredential } from '@/lib/security/credentials';

const credential = await getDecryptedCredential('ebay_client_id');
if (credential) {
  console.log('Service:', credential.serviceName);
  console.log('Value:', credential.credentialValue); // 復号化された値
  console.log('Type:', credential.credentialType);
  console.log('Expires:', credential.expiresAt);
}
```

### 例3: フォールバック付き取得（推奨）

```typescript
import { getCredentialWithFallback } from '@/lib/security/credentials';

// 1. DBから取得を試みる → 2. 環境変数にフォールバック
const clientId = await getCredentialWithFallback(
  'ebay_client_id',
  'EBAY_CLIENT_ID'
);
```

### 例4: 複数の認証情報を一括保存

```typescript
import { storeBatchCredentials } from '@/lib/security/credentials';

const credentials = [
  {
    serviceName: 'shopee_partner_id',
    credentialValue: '123456',
    credentialType: 'api_key' as const,
    environment: 'production' as const,
    description: 'Shopee Partner ID',
  },
  {
    serviceName: 'shopee_partner_key',
    credentialValue: 'secret_key_here',
    credentialType: 'secret' as const,
    environment: 'production' as const,
    description: 'Shopee Partner Key',
  },
];

const successCount = await storeBatchCredentials(credentials);
console.log(`${successCount} credentials stored successfully`);
```

### 例5: 期限切れトークンのチェック

```typescript
import { checkExpiredCredentials } from '@/lib/security/credentials';

const expiredServices = await checkExpiredCredentials();
if (expiredServices.length > 0) {
  console.warn('以下のトークンが期限切れです:', expiredServices);
  // アラート送信やトークン再取得処理を実行
}
```

---

## 🔍 データベーススキーマ

### テーブル: `encrypted_credentials`

| カラム名          | 型             | 説明                                      |
| ----------------- | -------------- | ----------------------------------------- |
| id                | UUID           | 主キー                                    |
| service_name      | TEXT (UNIQUE)  | サービス識別子（例: ebay_client_id）      |
| credential_value  | TEXT           | 暗号化された認証情報（AES-256）           |
| credential_type   | TEXT           | 種類（api_key, secret, token, etc.）      |
| environment       | TEXT           | 環境（production, sandbox）               |
| description       | TEXT           | 説明（任意）                              |
| created_at        | TIMESTAMPTZ    | 作成日時                                  |
| updated_at        | TIMESTAMPTZ    | 更新日時（自動更新）                      |
| created_by        | TEXT           | 作成者（任意）                            |
| expires_at        | TIMESTAMPTZ    | 有効期限（任意）                          |

### RLSポリシー

- **Service Role**: すべての操作が可能
- **Authenticated**: 読み取り専用（管理画面用）
- **Anonymous**: アクセス不可

---

## 🛠️ 移行対象の認証情報

| サービス           | 認証情報                                | 種類            | 優先度 |
| ------------------ | --------------------------------------- | --------------- | ------ |
| **eBay**           | EBAY_CLIENT_ID                          | api_key         | P0     |
|                    | EBAY_CLIENT_SECRET                      | secret          | P0     |
|                    | EBAY_USER_ACCESS_TOKEN                  | token           | P0     |
|                    | EBAY_REFRESH_TOKEN                      | refresh_token   | P0     |
| **Google**         | GOOGLE_CLIENT_ID                        | api_key         | P0     |
|                    | GOOGLE_CLIENT_SECRET                    | secret          | P0     |
| **Shopee**         | SHOPEE_PARTNER_ID                       | api_key         | P1     |
|                    | SHOPEE_PARTNER_KEY                      | secret          | P1     |
| **Amazon**         | AMAZON_CLIENT_ID                        | api_key         | P1     |
|                    | AMAZON_CLIENT_SECRET                    | secret          | P1     |
|                    | AMAZON_REFRESH_TOKEN                    | refresh_token   | P1     |
| **Qoo10**          | QOO10_API_KEY                           | api_key         | P1     |
|                    | QOO10_SECRET_KEY                        | secret          | P1     |
| **Supabase**       | SUPABASE_SERVICE_ROLE_KEY               | api_key         | P0     |

---

## ⚠️ セキュリティのベストプラクティス

### 1. **本番環境での環境変数管理**

```bash
# VPS上では、OSレベルの環境変数として設定（.env.localには書かない）
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# PM2での設定例
pm2 start npm --name "n3-frontend" -- start \
  --env SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

### 2. **定期的なトークン有効期限チェック**

```typescript
// cronジョブで毎日実行
import { checkExpiredCredentials } from '@/lib/security/credentials';

async function dailySecurityCheck() {
  const expired = await checkExpiredCredentials();
  if (expired.length > 0) {
    // Slackやメールでアラート送信
    await sendAlert(`以下のトークンが期限切れです: ${expired.join(', ')}`);
  }
}
```

### 3. **権限の最小化**

```sql
-- 読み取り専用ユーザーの作成（管理画面用）
CREATE ROLE credential_viewer;
GRANT SELECT ON encrypted_credentials TO credential_viewer;
```

---

## 🧪 テスト

### 動作確認コマンド

```bash
# 1. マイグレーション確認
psql $SUPABASE_DATABASE_URL -c "SELECT * FROM encrypted_credentials LIMIT 5;"

# 2. 暗号化/復号化テスト
curl -X POST http://localhost:3000/api/admin/setup-encryption

# 3. 認証情報取得テスト
curl http://localhost:3000/api/ebay/get-token -X POST

# 4. ステータス確認
curl http://localhost:3000/api/admin/setup-encryption
```

---

## 📚 参考資料

- [pgsodium公式ドキュメント](https://github.com/michelp/pgsodium)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL暗号化のベストプラクティス](https://www.postgresql.org/docs/current/encryption-options.html)

---

## ✅ P0完了チェックリスト

- [x] pgsodiumマイグレーションSQLの作成
- [x] TypeScript認証情報ヘルパーの実装
- [x] 管理APIエンドポイントの作成
- [x] eBay API routeの更新（例示）
- [x] Google Calendar Clientの更新（例示）
- [ ] **残りのAPI routeをすべて更新**（次のステップ）
- [ ] 暗号化システムのテスト
- [ ] 環境変数のクリーンアップ
- [ ] 本番環境へのデプロイ

---

## 🎯 次のステップ

1. **全APIルートの更新**: `app/api/ebay/**/*.ts`, `app/api/shopee/**/*.ts` などを順次更新
2. **P1: バッチ処理の並列化**（p-limit）の実装
3. **UI-3: 統合AIメッセージハブ**の作成
4. **UI-4: スケジューラー監視UI**の作成

---

**作成日**: 2025-11-25
**優先度**: P0（Critical）
**ステータス**: 基盤実装完了 → 全APIルート更新待ち
