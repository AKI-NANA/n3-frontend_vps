# 認証情報暗号化マイグレーション

## 概要
Supabase Vault と pgsodium を使用して、`platform_credentials` テーブルの認証情報を暗号化保存します。

## セキュリティリスク（対策前）

**Critical**: 現在、アクセストークン・リフレッシュトークン・APIキーが**平文保存**されています。
- SQLインジェクション成功時、全プラットフォームアカウントが乗っ取られる
- データベースバックアップ流出時、全認証情報が漏洩

---

## 1. pgsodium 拡張のインストール

```sql
-- Supabaseではデフォルトで有効化されています（確認）
CREATE EXTENSION IF NOT EXISTS pgsodium;

-- バージョン確認
SELECT extversion FROM pg_extension WHERE extname = 'pgsodium';
```

---

## 2. Supabase Vault のセットアップ

### 2.1 暗号化マスターキーの作成

```sql
-- Supabase Vaultにマスターキーを保存
-- このキーは暗号化されて保存され、直接アクセス不可
INSERT INTO vault.secrets (name, secret)
VALUES (
  'credentials_encryption_key',
  encode(pgsodium.randombytes_buf(32), 'hex')
);

-- キーの確認（ハッシュのみ表示、実際のキーは見えない）
SELECT id, name, created_at
FROM vault.secrets
WHERE name = 'credentials_encryption_key';
```

---

## 3. platform_credentials テーブルのスキーマ変更

### 3.1 新しい暗号化カラムの追加

```sql
-- 暗号化されたトークンを保存するカラム
ALTER TABLE platform_credentials
  ADD COLUMN access_token_encrypted BYTEA,
  ADD COLUMN refresh_token_encrypted BYTEA,
  ADD COLUMN ebay_auth_token_encrypted BYTEA,
  ADD COLUMN api_key_encrypted BYTEA,
  ADD COLUMN api_secret_encrypted BYTEA,
  ADD COLUMN nonce BYTEA DEFAULT pgsodium.randombytes_buf(24);

-- コメント追加
COMMENT ON COLUMN platform_credentials.access_token_encrypted IS '暗号化されたアクセストークン';
COMMENT ON COLUMN platform_credentials.refresh_token_encrypted IS '暗号化されたリフレッシュトークン';
COMMENT ON COLUMN platform_credentials.ebay_auth_token_encrypted IS '暗号化されたeBay Auth Token';
COMMENT ON COLUMN platform_credentials.api_key_encrypted IS '暗号化されたAPIキー';
COMMENT ON COLUMN platform_credentials.api_secret_encrypted IS '暗号化されたAPIシークレット';
COMMENT ON COLUMN platform_credentials.nonce IS '暗号化用ノンス（初期化ベクトル）';
```

---

## 4. 既存データの暗号化マイグレーション

### 4.1 既存の平文トークンを暗号化

```sql
-- 既存データを暗号化して新カラムに移行
UPDATE platform_credentials
SET
  access_token_encrypted = CASE
    WHEN access_token IS NOT NULL THEN
      pgsodium.crypto_secretbox_encrypt(
        access_token::bytea,
        nonce,
        (SELECT decrypted_secret FROM vault.decrypted_secrets
         WHERE name = 'credentials_encryption_key')
      )
    ELSE NULL
  END,
  refresh_token_encrypted = CASE
    WHEN refresh_token IS NOT NULL THEN
      pgsodium.crypto_secretbox_encrypt(
        refresh_token::bytea,
        nonce,
        (SELECT decrypted_secret FROM vault.decrypted_secrets
         WHERE name = 'credentials_encryption_key')
      )
    ELSE NULL
  END,
  ebay_auth_token_encrypted = CASE
    WHEN ebay_auth_token IS NOT NULL THEN
      pgsodium.crypto_secretbox_encrypt(
        ebay_auth_token::bytea,
        nonce,
        (SELECT decrypted_secret FROM vault.decrypted_secrets
         WHERE name = 'credentials_encryption_key')
      )
    ELSE NULL
  END,
  api_key_encrypted = CASE
    WHEN api_key IS NOT NULL THEN
      pgsodium.crypto_secretbox_encrypt(
        api_key::bytea,
        nonce,
        (SELECT decrypted_secret FROM vault.decrypted_secrets
         WHERE name = 'credentials_encryption_key')
      )
    ELSE NULL
  END,
  api_secret_encrypted = CASE
    WHEN api_secret IS NOT NULL THEN
      pgsodium.crypto_secretbox_encrypt(
        api_secret::bytea,
        nonce,
        (SELECT decrypted_secret FROM vault.decrypted_secrets
         WHERE name = 'credentials_encryption_key')
      )
    ELSE NULL
  END
WHERE
  access_token IS NOT NULL
  OR refresh_token IS NOT NULL
  OR ebay_auth_token IS NOT NULL
  OR api_key IS NOT NULL
  OR api_secret IS NOT NULL;
```

### 4.2 マイグレーション確認

```sql
-- 暗号化されたレコード数を確認
SELECT
  COUNT(*) as total_records,
  COUNT(access_token_encrypted) as encrypted_access_tokens,
  COUNT(refresh_token_encrypted) as encrypted_refresh_tokens,
  COUNT(ebay_auth_token_encrypted) as encrypted_ebay_tokens
FROM platform_credentials;

-- 平文カラムと暗号化カラムの対応を確認
SELECT
  credential_id,
  platform,
  access_token IS NOT NULL as has_plaintext,
  access_token_encrypted IS NOT NULL as has_encrypted
FROM platform_credentials
LIMIT 5;
```

---

## 5. ヘルパー関数の作成

### 5.1 暗号化関数

```sql
-- トークンを暗号化する関数
CREATE OR REPLACE FUNCTION encrypt_credential_token(
  p_plaintext TEXT
)
RETURNS TABLE(encrypted BYTEA, nonce BYTEA) AS $$
DECLARE
  v_nonce BYTEA := pgsodium.randombytes_buf(24);
  v_encrypted BYTEA;
BEGIN
  IF p_plaintext IS NULL THEN
    RETURN QUERY SELECT NULL::BYTEA, NULL::BYTEA;
    RETURN;
  END IF;

  v_encrypted := pgsodium.crypto_secretbox_encrypt(
    p_plaintext::bytea,
    v_nonce,
    (SELECT decrypted_secret FROM vault.decrypted_secrets
     WHERE name = 'credentials_encryption_key')
  );

  RETURN QUERY SELECT v_encrypted, v_nonce;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 使用例
-- SELECT * FROM encrypt_credential_token('my_access_token_123');
```

### 5.2 復号化ビュー（アプリケーション用）

```sql
-- 復号化されたトークンを返すビュー
CREATE OR REPLACE VIEW platform_credentials_decrypted AS
SELECT
  credential_id,
  platform,
  account_id,
  auth_type,
  -- 復号化されたトークン
  convert_from(
    pgsodium.crypto_secretbox_decrypt(
      access_token_encrypted,
      nonce,
      (SELECT decrypted_secret FROM vault.decrypted_secrets
       WHERE name = 'credentials_encryption_key')
    ),
    'UTF8'
  ) AS access_token,
  convert_from(
    pgsodium.crypto_secretbox_decrypt(
      refresh_token_encrypted,
      nonce,
      (SELECT decrypted_secret FROM vault.decrypted_secrets
       WHERE name = 'credentials_encryption_key')
    ),
    'UTF8'
  ) AS refresh_token,
  convert_from(
    pgsodium.crypto_secretbox_decrypt(
      ebay_auth_token_encrypted,
      nonce,
      (SELECT decrypted_secret FROM vault.decrypted_secrets
       WHERE name = 'credentials_encryption_key')
    ),
    'UTF8'
  ) AS ebay_auth_token,
  convert_from(
    pgsodium.crypto_secretbox_decrypt(
      api_key_encrypted,
      nonce,
      (SELECT decrypted_secret FROM vault.decrypted_secrets
       WHERE name = 'credentials_encryption_key')
    ),
    'UTF8'
  ) AS api_key,
  convert_from(
    pgsodium.crypto_secretbox_decrypt(
      api_secret_encrypted,
      nonce,
      (SELECT decrypted_secret FROM vault.decrypted_secrets
       WHERE name = 'credentials_encryption_key')
    ),
    'UTF8'
  ) AS api_secret,
  token_expires_at,
  is_sandbox,
  is_active,
  created_at,
  updated_at
FROM platform_credentials;

-- RLSポリシー（必要に応じて）
ALTER VIEW platform_credentials_decrypted OWNER TO authenticated;
```

---

## 6. 平文カラムの削除（最終段階）

**⚠️ 警告**: アプリケーションコードが完全に暗号化対応してから実行してください。

```sql
-- バックアップ作成（念のため）
CREATE TABLE platform_credentials_backup_20250101 AS
SELECT * FROM platform_credentials;

-- 平文カラムを削除
ALTER TABLE platform_credentials
  DROP COLUMN access_token,
  DROP COLUMN refresh_token,
  DROP COLUMN ebay_auth_token,
  DROP COLUMN api_key,
  DROP COLUMN api_secret;

-- 確認
\d platform_credentials
```

---

## 7. RLS (Row Level Security) ポリシー更新

```sql
-- 既存のRLSポリシーを確認
SELECT * FROM pg_policies WHERE tablename = 'platform_credentials';

-- platform_credentials_decrypted ビューに対するRLS
-- （必要に応じて設定）
CREATE POLICY "Allow authenticated users to read their own credentials"
ON platform_credentials
FOR SELECT
USING (auth.uid() = user_id);  -- user_idカラムがある場合
```

---

## 8. アプリケーションコードの修正ガイド

### Before（平文）

```typescript
// ❌ 非推奨
const { data } = await supabase
  .from('platform_credentials')
  .select('access_token')
  .eq('credential_id', credentialId)
  .single();

const token = data.access_token;  // 平文
```

### After（暗号化）

```typescript
// ✅ 推奨
const { data } = await supabase
  .from('platform_credentials_decrypted')  // ビューを使用
  .select('access_token')
  .eq('credential_id', credentialId)
  .single();

const token = data.access_token;  // 自動復号化
```

### トークン保存時

```typescript
// 新しいトークンを保存
const { data: encryptResult } = await supabase
  .rpc('encrypt_credential_token', { p_plaintext: newAccessToken });

await supabase
  .from('platform_credentials')
  .update({
    access_token_encrypted: encryptResult.encrypted,
    nonce: encryptResult.nonce,
    updated_at: new Date().toISOString(),
  })
  .eq('credential_id', credentialId);
```

---

## 9. テストクエリ

### 暗号化・復号化のテスト

```sql
-- テストデータ挿入
DO $$
DECLARE
  v_nonce BYTEA := pgsodium.randombytes_buf(24);
  v_encrypted BYTEA;
BEGIN
  v_encrypted := pgsodium.crypto_secretbox_encrypt(
    'test_token_12345'::bytea,
    v_nonce,
    (SELECT decrypted_secret FROM vault.decrypted_secrets
     WHERE name = 'credentials_encryption_key')
  );

  INSERT INTO platform_credentials (
    platform, account_id, auth_type,
    access_token_encrypted, nonce, is_active
  )
  VALUES (
    'ebay', 999, 'oauth2',
    v_encrypted, v_nonce, true
  );
END $$;

-- 復号化テスト
SELECT
  credential_id,
  platform,
  access_token  -- ビュー経由で復号化
FROM platform_credentials_decrypted
WHERE credential_id = (SELECT MAX(credential_id) FROM platform_credentials);

-- 期待結果: 'test_token_12345'

-- テストデータ削除
DELETE FROM platform_credentials WHERE account_id = 999;
```

---

## 10. パフォーマンス考慮事項

### 復号化のオーバーヘッド

- 暗号化/復号化: 約 **0.1-0.5ms** per token
- バッチ処理（100件）: 約 **10-50ms**
- 影響は**ほぼ無視できる**レベル

### キャッシング戦略（オプション）

```typescript
// メモリキャッシュ（アプリ側）
const tokenCache = new Map<number, { token: string; expiry: number }>();

async function getAccessToken(credentialId: number): Promise<string> {
  const cached = tokenCache.get(credentialId);
  if (cached && Date.now() < cached.expiry) {
    return cached.token;
  }

  // DB取得（復号化）
  const { data } = await supabase
    .from('platform_credentials_decrypted')
    .select('access_token')
    .eq('credential_id', credentialId)
    .single();

  // 5分間キャッシュ
  tokenCache.set(credentialId, {
    token: data.access_token,
    expiry: Date.now() + 5 * 60 * 1000,
  });

  return data.access_token;
}
```

---

## 11. 監査ログ（オプション）

```sql
-- 認証情報アクセスログ
CREATE TABLE credential_access_logs (
  log_id SERIAL PRIMARY KEY,
  credential_id INTEGER REFERENCES platform_credentials(credential_id),
  accessed_by TEXT,  -- user_id or service name
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  operation TEXT  -- 'read', 'update', 'rotate'
);

-- トリガー（復号化ビューアクセス時に記録）
CREATE OR REPLACE FUNCTION log_credential_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO credential_access_logs (credential_id, accessed_by, operation)
  VALUES (NEW.credential_id, current_user, TG_OP);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- （実装は要件に応じて調整）
```

---

## 12. ロールバック手順（緊急時）

```sql
-- 暗号化前のバックアップからリストア
INSERT INTO platform_credentials (
  credential_id, platform, account_id, auth_type,
  access_token, refresh_token, ebay_auth_token
)
SELECT
  credential_id, platform, account_id, auth_type,
  access_token, refresh_token, ebay_auth_token
FROM platform_credentials_backup_20250101
ON CONFLICT (credential_id) DO UPDATE
SET access_token = EXCLUDED.access_token;
```

---

## 実行手順サマリー

1. ✅ `pgsodium` 拡張の確認
2. ✅ Supabase Vault にマスターキー作成
3. ✅ 暗号化カラム追加
4. ✅ 既存データ暗号化
5. ✅ ヘルパー関数・ビュー作成
6. ✅ アプリケーションコード修正（次セクション）
7. ⚠️ テスト環境で動作確認
8. ⚠️ 平文カラム削除（最終段階）

---

## セキュリティチェックリスト

- [x] Supabase Vault にマスターキー保存
- [x] 暗号化カラムに移行
- [x] 復号化ビュー作成
- [ ] アプリケーションコード全面修正
- [ ] 平文カラム削除
- [ ] RLSポリシー確認
- [ ] 監査ログ実装（オプション）
- [ ] キーローテーション手順確立（オプション）

---

**作成日**: 2025-11-21
**セキュリティレベル**: Critical → High（実装後）
**実装見積もり**: 2-3日
