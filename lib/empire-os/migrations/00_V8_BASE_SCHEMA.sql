-- ========================================
-- N3 Empire OS V8 - 帝国統合データベーススキーマ
-- 作成日: 2025-01-23
-- バージョン: 8.0.1 (pgvector除外版)
-- 
-- 4つのスキーマ構成:
-- 1. core: プラン/課金/認証
-- 2. commerce: 物販/在庫/出品
-- 3. media: 動画/コンテンツ生成
-- 4. finance: 市場分析/収益管理
-- ========================================

-- ========================================
-- スキーマ作成
-- ========================================

CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS commerce;
CREATE SCHEMA IF NOT EXISTS media;
CREATE SCHEMA IF NOT EXISTS finance;

-- ========================================
-- [CORE] プラン定義テーブル
-- SUNシリーズ: HAKU〜KUNLUN
-- ========================================

CREATE TABLE IF NOT EXISTS core.plan_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_code VARCHAR(50) UNIQUE NOT NULL,
  plan_name VARCHAR(100) NOT NULL,
  plan_name_ja VARCHAR(100) NOT NULL,
  description TEXT,
  tier_level INTEGER NOT NULL DEFAULT 0,
  
  -- 機能フラグ
  features JSONB NOT NULL DEFAULT '{
    "ai_enabled": false,
    "self_repair_enabled": false,
    "multi_account_enabled": false,
    "api_access_enabled": false,
    "white_label_enabled": false,
    "priority_support_enabled": false
  }'::jsonb,
  
  -- 数量制限
  limits JSONB NOT NULL DEFAULT '{
    "max_inventory_items": 100,
    "max_daily_listings": 5,
    "max_daily_research": 10,
    "max_accounts": 1,
    "max_workflows": 3,
    "api_calls_per_minute": 5,
    "storage_mb": 50
  }'::jsonb,
  
  -- 料金
  price_monthly_jpy INTEGER DEFAULT 0,
  price_yearly_jpy INTEGER DEFAULT 0,
  stripe_price_id VARCHAR(100),
  
  -- メタ
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- プランデータ挿入
INSERT INTO core.plan_master (plan_code, plan_name, plan_name_ja, tier_level, features, limits, price_monthly_jpy, price_yearly_jpy) VALUES
  ('GUEST', 'Guest', 'ゲスト（お試し）', 0, 
   '{"ai_enabled": false, "self_repair_enabled": false, "multi_account_enabled": false, "api_access_enabled": false, "white_label_enabled": false, "priority_support_enabled": false}'::jsonb,
   '{"max_inventory_items": 0, "max_daily_listings": 0, "max_daily_research": 0, "max_accounts": 0, "max_workflows": 0, "api_calls_per_minute": 0, "storage_mb": 0, "trial_executions_per_month": 1}'::jsonb,
   0, 0),
   
  ('HAKU', 'Mt. Haku (白山)', '白山プラン', 1,
   '{"ai_enabled": true, "self_repair_enabled": false, "multi_account_enabled": false, "api_access_enabled": false, "white_label_enabled": false, "priority_support_enabled": false}'::jsonb,
   '{"max_inventory_items": 500, "max_daily_listings": 20, "max_daily_research": 100, "max_accounts": 1, "max_workflows": 10, "api_calls_per_minute": 20, "storage_mb": 500}'::jsonb,
   4980, 49800),
   
  ('FUJI', 'Mt. Fuji (富士山)', '富士山プラン', 2,
   '{"ai_enabled": true, "self_repair_enabled": true, "multi_account_enabled": false, "api_access_enabled": false, "white_label_enabled": false, "priority_support_enabled": false}'::jsonb,
   '{"max_inventory_items": 3000, "max_daily_listings": 100, "max_daily_research": 500, "max_accounts": 3, "max_workflows": 50, "api_calls_per_minute": 60, "storage_mb": 2000}'::jsonb,
   9800, 98000),
   
  ('EVEREST', 'Mt. Everest (エベレスト)', 'エベレストプラン', 3,
   '{"ai_enabled": true, "self_repair_enabled": true, "multi_account_enabled": true, "api_access_enabled": true, "white_label_enabled": false, "priority_support_enabled": true}'::jsonb,
   '{"max_inventory_items": 10000, "max_daily_listings": 500, "max_daily_research": 2000, "max_accounts": 10, "max_workflows": 200, "api_calls_per_minute": 120, "storage_mb": 10000}'::jsonb,
   29800, 298000),
   
  ('KUNLUN-1', 'Mt. Kunlun I (崑崙Ⅰ)', '崑崙Ⅰプラン', 4,
   '{"ai_enabled": true, "self_repair_enabled": true, "multi_account_enabled": true, "api_access_enabled": true, "white_label_enabled": false, "priority_support_enabled": true, "market_expander_enabled": true}'::jsonb,
   '{"max_inventory_items": 30000, "max_daily_listings": 1500, "max_daily_research": 5000, "max_accounts": 30, "max_workflows": 500, "api_calls_per_minute": 300, "storage_mb": 30000}'::jsonb,
   79800, 798000),
   
  ('KUNLUN-2', 'Mt. Kunlun II (崑崙Ⅱ)', '崑崙Ⅱプラン', 5,
   '{"ai_enabled": true, "self_repair_enabled": true, "multi_account_enabled": true, "api_access_enabled": true, "white_label_enabled": true, "priority_support_enabled": true, "market_expander_enabled": true, "media_empire_enabled": true}'::jsonb,
   '{"max_inventory_items": 100000, "max_daily_listings": 5000, "max_daily_research": 20000, "max_accounts": 100, "max_workflows": 2000, "api_calls_per_minute": 600, "storage_mb": 100000}'::jsonb,
   198000, 1980000),
   
  ('KUNLUN-3', 'Mt. Kunlun III (崑崙Ⅲ)', '崑崙Ⅲプラン', 6,
   '{"ai_enabled": true, "self_repair_enabled": true, "multi_account_enabled": true, "api_access_enabled": true, "white_label_enabled": true, "priority_support_enabled": true, "market_expander_enabled": true, "media_empire_enabled": true, "unlimited_enabled": true}'::jsonb,
   '{"max_inventory_items": -1, "max_daily_listings": -1, "max_daily_research": -1, "max_accounts": -1, "max_workflows": -1, "api_calls_per_minute": -1, "storage_mb": -1}'::jsonb,
   498000, 4980000),
   
  ('OWNER', 'Owner (オーナー)', 'オーナー（開発者）', 99,
   '{"ai_enabled": true, "self_repair_enabled": true, "multi_account_enabled": true, "api_access_enabled": true, "white_label_enabled": true, "priority_support_enabled": true, "market_expander_enabled": true, "media_empire_enabled": true, "unlimited_enabled": true, "admin_enabled": true}'::jsonb,
   '{"max_inventory_items": -1, "max_daily_listings": -1, "max_daily_research": -1, "max_accounts": -1, "max_workflows": -1, "api_calls_per_minute": -1, "storage_mb": -1}'::jsonb,
   0, 0)
ON CONFLICT (plan_code) DO NOTHING;

-- ========================================
-- [CORE] テナントマスター
-- ========================================

CREATE TABLE IF NOT EXISTS core.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_code VARCHAR(50) UNIQUE NOT NULL,
  
  -- 基本情報
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company_name VARCHAR(200),
  
  -- プラン関連
  plan_code VARCHAR(50) NOT NULL DEFAULT 'GUEST' REFERENCES core.plan_master(plan_code),
  plan_started_at TIMESTAMPTZ,
  plan_expires_at TIMESTAMPTZ,
  
  -- Stripe
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  
  -- ステータス
  status VARCHAR(20) DEFAULT 'active',
  is_owner BOOLEAN DEFAULT false,
  
  -- メタ
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- オーナーテナント挿入
INSERT INTO core.tenants (id, tenant_code, name, email, plan_code, is_owner, status) VALUES
  ('00000000-0000-0000-0000-000000000000', 'OWNER', 'System Owner', 'owner@n3-empire.com', 'OWNER', true, 'active')
ON CONFLICT (tenant_code) DO NOTHING;

-- ========================================
-- [CORE] シークレットボルト
-- ========================================

CREATE TABLE IF NOT EXISTS core.tenant_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  
  -- キー識別
  secret_type VARCHAR(50) NOT NULL,
  secret_name VARCHAR(100) NOT NULL,
  
  -- 暗号化データ
  encrypted_data TEXT NOT NULL,
  encryption_iv VARCHAR(100) NOT NULL,
  key_version INTEGER DEFAULT 1,
  
  -- メタデータ
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- 検証
  last_verified_at TIMESTAMPTZ,
  verification_status VARCHAR(20) DEFAULT 'pending',
  
  -- 監査
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  
  UNIQUE(tenant_id, secret_type, secret_name)
);

-- ========================================
-- [CORE] 使用量カウンター
-- ========================================

CREATE TABLE IF NOT EXISTS core.usage_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  
  -- カウンター種別
  counter_type VARCHAR(50) NOT NULL,
  
  -- 期間
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- カウント
  current_count INTEGER DEFAULT 0,
  max_count INTEGER NOT NULL,
  
  -- メタ
  last_incremented_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, counter_type, period_start)
);

-- ========================================
-- [CORE] 規約同意ログ
-- ========================================

CREATE TABLE IF NOT EXISTS core.consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  
  -- 同意内容
  consent_type VARCHAR(50) NOT NULL,
  consent_version VARCHAR(20) NOT NULL,
  
  -- 同意情報
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  consent_method VARCHAR(50) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  
  -- 検証用ハッシュ
  content_hash VARCHAR(64) NOT NULL,
  signature_hash VARCHAR(64),
  
  -- メタ
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- [CORE] 機能アクセスログ
-- ========================================

CREATE TABLE IF NOT EXISTS core.feature_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id),
  
  -- アクセス情報
  feature_code VARCHAR(100) NOT NULL,
  tool_id VARCHAR(100),
  
  -- 結果
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  
  -- コンテキスト
  request_data JSONB,
  response_summary JSONB,
  
  -- パフォーマンス
  execution_time_ms INTEGER,
  
  -- メタ
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- [COMMERCE] マーケットプレイスアカウント
-- ========================================

CREATE TABLE IF NOT EXISTS commerce.marketplace_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  
  -- アカウント情報
  account_code VARCHAR(50) NOT NULL,
  account_name VARCHAR(100) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  marketplace VARCHAR(50) NOT NULL,
  
  -- 認証
  vault_secret_id UUID REFERENCES core.tenant_vault(id),
  
  -- 設定
  settings JSONB DEFAULT '{}'::jsonb,
  
  -- ステータス
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, account_code, platform, marketplace)
);

-- ========================================
-- [COMMERCE] 知見ベクトルDB
-- 注意: embeddingカラムはpgvector拡張が必要
-- 後から追加する場合: ALTER TABLE commerce.knowledge_vectors ADD COLUMN embedding VECTOR(1536);
-- ========================================

CREATE TABLE IF NOT EXISTS commerce.knowledge_vectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id),
  
  -- 知見タイプ
  knowledge_type VARCHAR(50) NOT NULL,
  
  -- コンテンツ
  content_summary TEXT NOT NULL,
  -- embedding VECTOR(1536), -- pgvector有効化後に追加
  embedding_json JSONB, -- 代替: JSONBで保存
  
  -- コンテキスト
  context JSONB NOT NULL,
  
  -- 効果測定
  effectiveness_score DECIMAL(5,2),
  sample_count INTEGER DEFAULT 1,
  
  -- メタ
  source_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- [MEDIA] チャンネルマスター
-- ========================================

CREATE TABLE IF NOT EXISTS media.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  
  -- チャンネル情報
  channel_code VARCHAR(50) NOT NULL,
  channel_name VARCHAR(200) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  
  -- ブランド定義
  brand_config JSONB DEFAULT '{
    "primary_color": "#3B82F6",
    "secondary_color": "#1E40AF",
    "font_family": "Noto Sans JP",
    "avatar_id": null,
    "voice_id": null
  }'::jsonb,
  
  -- 認証
  oauth_vault_id UUID REFERENCES core.tenant_vault(id),
  
  -- 防衛設定
  proxy_config JSONB DEFAULT '{}'::jsonb,
  
  -- ステータス
  is_active BOOLEAN DEFAULT true,
  subscriber_count INTEGER DEFAULT 0,
  total_views BIGINT DEFAULT 0,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, channel_code, platform)
);

-- ========================================
-- [MEDIA] 原子データ
-- ========================================

CREATE TABLE IF NOT EXISTS media.atomic_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id),
  
  -- データ識別
  data_type VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  subcategory VARCHAR(100),
  
  -- コンテンツ
  title VARCHAR(500),
  content TEXT NOT NULL,
  
  -- 引用元
  source_document VARCHAR(500),
  source_page INTEGER,
  source_line INTEGER,
  
  -- 法改正追跡
  legal_revision_flag BOOLEAN DEFAULT false,
  legal_revision_date DATE,
  legal_revision_note TEXT,
  
  -- AI用（pgvector有効化後）
  -- embedding VECTOR(1536),
  embedding_json JSONB,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- [MEDIA] コンテンツパイプライン
-- ========================================

CREATE TABLE IF NOT EXISTS media.content_pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id),
  channel_id UUID REFERENCES media.channels(id),
  
  -- コンテンツ情報
  content_type VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  
  -- 生成状態
  status VARCHAR(50) DEFAULT 'draft',
  
  -- 各段階のデータ
  script_json JSONB,
  audio_url TEXT,
  video_url TEXT,
  blog_html TEXT,
  
  -- 監査
  ai_confidence_score DECIMAL(5,2),
  human_approved BOOLEAN DEFAULT false,
  human_approved_by UUID,
  human_approved_at TIMESTAMPTZ,
  
  -- 公開情報
  published_at TIMESTAMPTZ,
  published_url TEXT,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- [FINANCE] 収益記録
-- ========================================

CREATE TABLE IF NOT EXISTS finance.revenue_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id),
  
  -- 収益源
  source_type VARCHAR(50) NOT NULL,
  source_id VARCHAR(100),
  
  -- 金額
  gross_amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  net_amount DECIMAL(15,2),
  fees DECIMAL(15,2),
  
  -- 日時
  transaction_date DATE NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- メタ
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ========================================
-- [FINANCE] 市場分析データ
-- ========================================

CREATE TABLE IF NOT EXISTS finance.market_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 分析対象
  category VARCHAR(200),
  marketplace VARCHAR(50),
  
  -- 分析データ
  analysis_date DATE NOT NULL,
  avg_price DECIMAL(15,2),
  price_trend VARCHAR(20),
  demand_score DECIMAL(5,2),
  competition_level VARCHAR(20),
  
  -- 詳細
  analysis_data JSONB,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- インデックス
-- ========================================

-- Core
CREATE INDEX IF NOT EXISTS idx_tenants_plan ON core.tenants(plan_code);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON core.tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenant_vault_tenant ON core.tenant_vault(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_vault_type ON core.tenant_vault(secret_type);
CREATE INDEX IF NOT EXISTS idx_usage_counters_tenant ON core.usage_counters(tenant_id);
CREATE INDEX IF NOT EXISTS idx_usage_counters_period ON core.usage_counters(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_consent_logs_tenant ON core.consent_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_feature_access_logs_tenant ON core.feature_access_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_feature_access_logs_feature ON core.feature_access_logs(feature_code);
CREATE INDEX IF NOT EXISTS idx_feature_access_logs_created ON core.feature_access_logs(created_at);

-- Commerce
CREATE INDEX IF NOT EXISTS idx_marketplace_accounts_tenant ON commerce.marketplace_accounts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_vectors_tenant ON commerce.knowledge_vectors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_vectors_type ON commerce.knowledge_vectors(knowledge_type);

-- Media
CREATE INDEX IF NOT EXISTS idx_channels_tenant ON media.channels(tenant_id);
CREATE INDEX IF NOT EXISTS idx_atomic_data_tenant ON media.atomic_data(tenant_id);
CREATE INDEX IF NOT EXISTS idx_atomic_data_category ON media.atomic_data(category);
CREATE INDEX IF NOT EXISTS idx_content_pipeline_tenant ON media.content_pipeline(tenant_id);
CREATE INDEX IF NOT EXISTS idx_content_pipeline_status ON media.content_pipeline(status);

-- Finance
CREATE INDEX IF NOT EXISTS idx_revenue_records_tenant ON finance.revenue_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_revenue_records_date ON finance.revenue_records(transaction_date);
CREATE INDEX IF NOT EXISTS idx_market_analysis_date ON finance.market_analysis(analysis_date);

-- ========================================
-- RLS（行レベルセキュリティ）有効化
-- ========================================

ALTER TABLE core.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.tenant_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.usage_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.feature_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.marketplace_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.knowledge_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE media.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE media.atomic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE media.content_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.revenue_records ENABLE ROW LEVEL SECURITY;

-- ========================================
-- トリガー: updated_at自動更新
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガー適用
DO $$
BEGIN
  -- core.plan_master
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_plan_master_updated_at') THEN
    CREATE TRIGGER update_plan_master_updated_at BEFORE UPDATE ON core.plan_master
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- core.tenants
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tenants_updated_at') THEN
    CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON core.tenants
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- core.tenant_vault
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tenant_vault_updated_at') THEN
    CREATE TRIGGER update_tenant_vault_updated_at BEFORE UPDATE ON core.tenant_vault
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- core.usage_counters
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_usage_counters_updated_at') THEN
    CREATE TRIGGER update_usage_counters_updated_at BEFORE UPDATE ON core.usage_counters
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- commerce.marketplace_accounts
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_marketplace_accounts_updated_at') THEN
    CREATE TRIGGER update_marketplace_accounts_updated_at BEFORE UPDATE ON commerce.marketplace_accounts
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- commerce.knowledge_vectors
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_knowledge_vectors_updated_at') THEN
    CREATE TRIGGER update_knowledge_vectors_updated_at BEFORE UPDATE ON commerce.knowledge_vectors
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- media.channels
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_channels_updated_at') THEN
    CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON media.channels
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- media.atomic_data
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_atomic_data_updated_at') THEN
    CREATE TRIGGER update_atomic_data_updated_at BEFORE UPDATE ON media.atomic_data
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- media.content_pipeline
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_content_pipeline_updated_at') THEN
    CREATE TRIGGER update_content_pipeline_updated_at BEFORE UPDATE ON media.content_pipeline
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ========================================
-- 使用量カウンター増加関数
-- ========================================

CREATE OR REPLACE FUNCTION increment_usage_counter(
  p_tenant_id UUID,
  p_counter_type VARCHAR(50),
  p_period_start DATE,
  p_increment INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO core.usage_counters (tenant_id, counter_type, period_start, period_end, current_count, max_count, last_incremented_at)
  VALUES (p_tenant_id, p_counter_type, p_period_start, p_period_start + INTERVAL '1 day', p_increment, -1, NOW())
  ON CONFLICT (tenant_id, counter_type, period_start)
  DO UPDATE SET 
    current_count = core.usage_counters.current_count + p_increment,
    last_incremented_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 完了
-- ========================================

COMMENT ON SCHEMA core IS 'N3 Empire OS V8 - プラン/課金/認証の中枢';
COMMENT ON SCHEMA commerce IS 'N3 Empire OS V8 - 物販/在庫/出品管理';
COMMENT ON SCHEMA media IS 'N3 Empire OS V8 - 動画/コンテンツ生成';
COMMENT ON SCHEMA finance IS 'N3 Empire OS V8 - 市場分析/収益管理';
