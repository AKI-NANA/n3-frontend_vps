-- ========================================
-- N3 Empire OS - 商用版データベーススキーマ V2
-- Secret Vault + テナント隔離 + OAuth Hub
-- ========================================

-- 1. テナントテーブル
CREATE TABLE IF NOT EXISTS tenants (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  plan_type VARCHAR(20) NOT NULL DEFAULT 'basic',
  is_active BOOLEAN DEFAULT true,
  daily_research_limit INTEGER DEFAULT 50,
  daily_listing_limit INTEGER DEFAULT 10,
  inventory_item_limit INTEGER DEFAULT 500,
  workflow_limit INTEGER DEFAULT 5,
  api_calls_per_minute INTEGER DEFAULT 10,
  storage_mb INTEGER DEFAULT 100,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

INSERT INTO tenants (id, name, plan_type, daily_research_limit, daily_listing_limit, inventory_item_limit, workflow_limit, api_calls_per_minute, storage_mb)
VALUES ('0', 'Owner', 'owner', -1, -1, -1, -1, -1, -1)
ON CONFLICT (id) DO NOTHING;

-- 2. Secret Vault
CREATE TABLE IF NOT EXISTS secret_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_id VARCHAR(100) UNIQUE NOT NULL,
  tenant_id VARCHAR(50) NOT NULL,
  secret_type VARCHAR(50) NOT NULL,
  encrypted_value TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_secret_vault_ref_id ON secret_vault(ref_id);
CREATE INDEX IF NOT EXISTS idx_secret_vault_tenant ON secret_vault(tenant_id);
CREATE INDEX IF NOT EXISTS idx_secret_vault_type ON secret_vault(secret_type);

-- 3. OAuth Connections
CREATE TABLE IF NOT EXISTS oauth_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  account_name VARCHAR(100) NOT NULL DEFAULT 'default',
  secret_vault_ref_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  scopes TEXT[],
  marketplace VARCHAR(50),
  seller_id VARCHAR(100),
  store_name VARCHAR(255),
  connected_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, provider, account_name)
);

CREATE INDEX IF NOT EXISTS idx_oauth_connections_tenant ON oauth_connections(tenant_id);
CREATE INDEX IF NOT EXISTS idx_oauth_connections_provider ON oauth_connections(provider);

-- 4. Feature Usage Logs
CREATE TABLE IF NOT EXISTS feature_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR(50) NOT NULL,
  feature_key VARCHAR(100) NOT NULL,
  count INTEGER DEFAULT 1,
  used_at DATE DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_feature_usage_tenant_date ON feature_usage_logs(tenant_id, used_at);

-- 5. API Access Logs
CREATE TABLE IF NOT EXISTS api_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR(50) NOT NULL,
  request_id VARCHAR(50),
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  ip_address INET,
  user_agent TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_logs_tenant_date ON api_access_logs(tenant_id, created_at);

-- 6. Helper Functions
CREATE OR REPLACE FUNCTION get_daily_feature_usage(p_tenant_id VARCHAR(50), p_feature_key VARCHAR(100), p_date DATE DEFAULT CURRENT_DATE)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE((SELECT SUM(count) FROM feature_usage_logs WHERE tenant_id = p_tenant_id AND feature_key = p_feature_key AND used_at = p_date), 0);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_feature_usage(p_tenant_id VARCHAR(50), p_feature_key VARCHAR(100), p_count INTEGER DEFAULT 1)
RETURNS VOID AS $$
BEGIN
  INSERT INTO feature_usage_logs (tenant_id, feature_key, count, used_at) VALUES (p_tenant_id, p_feature_key, p_count, CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION rotate_secret(p_ref_id VARCHAR(100), p_new_encrypted_value TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE secret_vault SET encrypted_value = p_new_encrypted_value, updated_at = NOW() WHERE ref_id = p_ref_id AND is_active = true;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION deactivate_expired_secrets()
RETURNS INTEGER AS $$
DECLARE affected INTEGER;
BEGIN
  UPDATE secret_vault SET is_active = false WHERE expires_at < NOW() AND is_active = true;
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$ LANGUAGE plpgsql;

-- 7. Views
CREATE OR REPLACE VIEW secret_vault_refs AS
SELECT ref_id, tenant_id, secret_type, metadata, expires_at, last_used_at, is_active,
  CASE WHEN expires_at IS NULL THEN 'active' WHEN expires_at < NOW() THEN 'expired' ELSE 'active' END as status
FROM secret_vault WHERE is_active = true;

CREATE OR REPLACE VIEW oauth_connection_status AS
SELECT oc.id, oc.tenant_id, oc.provider, oc.account_name, oc.status, oc.marketplace, oc.seller_id, oc.store_name,
  oc.connected_at, oc.last_used_at, oc.expires_at, sv.is_active as secret_active,
  CASE 
    WHEN oc.status = 'revoked' THEN 'revoked'
    WHEN sv.is_active = false THEN 'inactive'
    WHEN oc.expires_at IS NOT NULL AND oc.expires_at < NOW() THEN 'expired'
    WHEN sv.expires_at IS NOT NULL AND sv.expires_at < NOW() THEN 'token_expired'
    ELSE 'active'
  END as connection_health
FROM oauth_connections oc LEFT JOIN secret_vault sv ON oc.secret_vault_ref_id = sv.ref_id;
