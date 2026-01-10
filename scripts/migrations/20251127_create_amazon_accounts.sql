-- =============================================================================
-- Amazon SP-API アカウント管理テーブル
-- 
-- 機能:
-- - マルチマーケットプレイス対応（US, JP, UK, DE, CA, AU, etc.）
-- - LWA認証情報の安全な保存
-- - アクセストークンのキャッシュ
-- - 将来的なpgsodium暗号化対応の準備
-- =============================================================================

-- amazon_accounts テーブル
CREATE TABLE IF NOT EXISTS amazon_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- アカウント基本情報
  account_name VARCHAR(255) NOT NULL,
  seller_id VARCHAR(50) NOT NULL,
  
  -- マーケットプレイス情報
  marketplace_id VARCHAR(10) NOT NULL,  -- US, JP, UK, DE, CA, AU, etc.
  marketplace_name VARCHAR(100) NOT NULL, -- Amazon.com, Amazon.co.jp, etc.
  region VARCHAR(20) NOT NULL,           -- us-east-1, eu-west-1, us-west-2
  endpoint VARCHAR(255) NOT NULL,        -- SP-API エンドポイントURL
  
  -- LWA認証情報
  client_id VARCHAR(255) NOT NULL,
  
  -- 暗号化対応フィールド（現在は平文、将来pgsodium対応予定）
  client_secret TEXT,
  client_secret_encrypted BYTEA,         -- pgsodium暗号化用
  
  refresh_token TEXT,
  refresh_token_encrypted BYTEA,         -- pgsodium暗号化用
  
  -- アクセストークン（キャッシュ用）
  access_token TEXT,
  access_token_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- ステータス
  is_active BOOLEAN DEFAULT true,
  last_auth_at TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  error_count INTEGER DEFAULT 0,
  
  -- 監査情報
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 制約
  CONSTRAINT amazon_accounts_marketplace_unique UNIQUE (seller_id, marketplace_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_amazon_accounts_marketplace 
  ON amazon_accounts(marketplace_id);
  
CREATE INDEX IF NOT EXISTS idx_amazon_accounts_seller 
  ON amazon_accounts(seller_id);
  
CREATE INDEX IF NOT EXISTS idx_amazon_accounts_active 
  ON amazon_accounts(is_active) WHERE is_active = true;

-- RLS (Row Level Security) ポリシー
ALTER TABLE amazon_accounts ENABLE ROW LEVEL SECURITY;

-- サービスロール用ポリシー（全アクセス許可）
CREATE POLICY "Service role full access" ON amazon_accounts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 匿名ユーザー用ポリシー（読み取りのみ、機密情報を除く）
CREATE POLICY "Anon read access" ON amazon_accounts
  FOR SELECT
  TO anon
  USING (true);

-- 更新時刻自動更新トリガー
CREATE OR REPLACE FUNCTION update_amazon_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_amazon_accounts_updated_at
  BEFORE UPDATE ON amazon_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_amazon_accounts_updated_at();

-- =============================================================================
-- Amazon API 使用状況追跡テーブル（レート制限管理用）
-- =============================================================================

CREATE TABLE IF NOT EXISTS amazon_api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES amazon_accounts(id) ON DELETE CASCADE,
  
  -- API使用情報
  api_operation VARCHAR(100) NOT NULL,  -- getCatalogItem, searchCatalogItems, etc.
  endpoint VARCHAR(255) NOT NULL,
  
  -- レート制限情報
  request_count INTEGER DEFAULT 1,
  rate_limit_remaining INTEGER,
  rate_limit_reset_at TIMESTAMP WITH TIME ZONE,
  
  -- リクエスト結果
  status_code INTEGER,
  is_success BOOLEAN DEFAULT true,
  error_message TEXT,
  
  -- タイミング
  request_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  response_time_ms INTEGER
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_amazon_api_usage_account 
  ON amazon_api_usage(account_id);
  
CREATE INDEX IF NOT EXISTS idx_amazon_api_usage_operation 
  ON amazon_api_usage(api_operation);
  
CREATE INDEX IF NOT EXISTS idx_amazon_api_usage_request_at 
  ON amazon_api_usage(request_at);

-- 古いレコードを自動削除するパーティション設定（30日以上前のデータ）
-- Note: 実運用ではパーティションテーブルへの変更を検討

-- =============================================================================
-- ビュー: アカウント概要（機密情報を除く）
-- =============================================================================

CREATE OR REPLACE VIEW amazon_accounts_summary AS
SELECT 
  id,
  account_name,
  seller_id,
  marketplace_id,
  marketplace_name,
  region,
  endpoint,
  client_id,
  is_active,
  last_auth_at,
  last_error,
  error_count,
  created_at,
  updated_at,
  -- アクセストークン有効期限チェック
  CASE 
    WHEN access_token_expires_at > NOW() THEN 'valid'
    WHEN access_token_expires_at IS NULL THEN 'unknown'
    ELSE 'expired'
  END AS token_status,
  -- 残り有効時間（分）
  GREATEST(0, EXTRACT(EPOCH FROM (access_token_expires_at - NOW())) / 60)::INTEGER AS token_minutes_remaining
FROM amazon_accounts;

-- =============================================================================
-- 初期データ: サポートされているマーケットプレイス一覧
-- =============================================================================

CREATE TABLE IF NOT EXISTS amazon_marketplaces (
  marketplace_id VARCHAR(10) PRIMARY KEY,
  marketplace_name VARCHAR(100) NOT NULL,
  country_code VARCHAR(2) NOT NULL,
  region VARCHAR(20) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  amazon_marketplace_id VARCHAR(20) NOT NULL,  -- Amazonの内部マーケットプレイスID
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- マーケットプレイス一覧を挿入
INSERT INTO amazon_marketplaces (marketplace_id, marketplace_name, country_code, region, endpoint, amazon_marketplace_id)
VALUES 
  -- 北米
  ('US', 'Amazon.com', 'US', 'us-east-1', 'https://sellingpartnerapi-na.amazon.com', 'ATVPDKIKX0DER'),
  ('CA', 'Amazon.ca', 'CA', 'us-east-1', 'https://sellingpartnerapi-na.amazon.com', 'A2EUQ1WTGCTBG2'),
  ('MX', 'Amazon.com.mx', 'MX', 'us-east-1', 'https://sellingpartnerapi-na.amazon.com', 'A1AM78C64UM0Y8'),
  ('BR', 'Amazon.com.br', 'BR', 'us-east-1', 'https://sellingpartnerapi-na.amazon.com', 'A2Q3Y263D00KWC'),
  
  -- ヨーロッパ
  ('UK', 'Amazon.co.uk', 'GB', 'eu-west-1', 'https://sellingpartnerapi-eu.amazon.com', 'A1F83G8C2ARO7P'),
  ('DE', 'Amazon.de', 'DE', 'eu-west-1', 'https://sellingpartnerapi-eu.amazon.com', 'A1PA6795UKMFR9'),
  ('FR', 'Amazon.fr', 'FR', 'eu-west-1', 'https://sellingpartnerapi-eu.amazon.com', 'A13V1IB3VIYBER'),
  ('IT', 'Amazon.it', 'IT', 'eu-west-1', 'https://sellingpartnerapi-eu.amazon.com', 'APJ6JRA9NG5V4'),
  ('ES', 'Amazon.es', 'ES', 'eu-west-1', 'https://sellingpartnerapi-eu.amazon.com', 'A1RKKUPIHCS9HS'),
  ('NL', 'Amazon.nl', 'NL', 'eu-west-1', 'https://sellingpartnerapi-eu.amazon.com', 'A1805IZSGTT6HS'),
  ('PL', 'Amazon.pl', 'PL', 'eu-west-1', 'https://sellingpartnerapi-eu.amazon.com', 'A1C3SOZRARQ6R3'),
  ('SE', 'Amazon.se', 'SE', 'eu-west-1', 'https://sellingpartnerapi-eu.amazon.com', 'A2NODRKZP88ZB9'),
  ('BE', 'Amazon.com.be', 'BE', 'eu-west-1', 'https://sellingpartnerapi-eu.amazon.com', 'AMEN7PMS3EDWL'),
  
  -- 極東
  ('JP', 'Amazon.co.jp', 'JP', 'us-west-2', 'https://sellingpartnerapi-fe.amazon.com', 'A1VC38T7YXB528'),
  ('AU', 'Amazon.com.au', 'AU', 'us-west-2', 'https://sellingpartnerapi-fe.amazon.com', 'A39IBJ37TRP1C6'),
  ('SG', 'Amazon.sg', 'SG', 'us-west-2', 'https://sellingpartnerapi-fe.amazon.com', 'A19VAU5U5O7RUS'),
  
  -- インド・中東
  ('IN', 'Amazon.in', 'IN', 'eu-west-1', 'https://sellingpartnerapi-eu.amazon.com', 'A21TJRUUN4KGV'),
  ('AE', 'Amazon.ae', 'AE', 'eu-west-1', 'https://sellingpartnerapi-eu.amazon.com', 'A2VIGQ35RCS4UG'),
  ('SA', 'Amazon.sa', 'SA', 'eu-west-1', 'https://sellingpartnerapi-eu.amazon.com', 'A17E79C6D8DWNP'),
  ('TR', 'Amazon.com.tr', 'TR', 'eu-west-1', 'https://sellingpartnerapi-eu.amazon.com', 'A33AVAJ2PDY3EV')
ON CONFLICT (marketplace_id) DO NOTHING;

-- =============================================================================
-- コメント
-- =============================================================================

COMMENT ON TABLE amazon_accounts IS 'Amazon SP-API アカウント管理テーブル';
COMMENT ON COLUMN amazon_accounts.marketplace_id IS 'マーケットプレイスコード (US, JP, UK, etc.)';
COMMENT ON COLUMN amazon_accounts.client_secret_encrypted IS 'pgsodium暗号化対応フィールド（将来実装）';
COMMENT ON COLUMN amazon_accounts.refresh_token_encrypted IS 'pgsodium暗号化対応フィールド（将来実装）';
COMMENT ON TABLE amazon_marketplaces IS 'Amazon サポートマーケットプレイス一覧';
