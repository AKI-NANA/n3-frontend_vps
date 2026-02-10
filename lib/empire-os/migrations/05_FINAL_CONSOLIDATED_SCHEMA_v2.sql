-- ========================================
-- N3 Empire OS V8.2.1-Autonomous
-- FINAL CONSOLIDATED SCHEMA v2 (修正版)
-- 31件の欠落を完全解消する統合スキーマ
-- 既存テーブルとの互換性を考慮
-- ========================================

-- ========================================
-- 前提: スキーマ作成
-- ========================================
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS commerce;
CREATE SCHEMA IF NOT EXISTS media;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS security;

-- ========================================
-- SECTION 1: レート制限・API管理
-- ========================================

-- API レート制限テーブル（SEC-001対応）
CREATE TABLE IF NOT EXISTS security.api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_provider VARCHAR(50) NOT NULL,
  api_endpoint VARCHAR(200),
  requests_per_second DECIMAL(10,2) DEFAULT 1,
  requests_per_minute INTEGER DEFAULT 60,
  requests_per_hour INTEGER DEFAULT 1000,
  requests_per_day INTEGER DEFAULT 10000,
  burst_limit INTEGER DEFAULT 10,
  burst_window_seconds INTEGER DEFAULT 60,
  current_bucket_tokens DECIMAL(15,4) DEFAULT 0,
  last_refill_at TIMESTAMPTZ DEFAULT NOW(),
  total_requests_today INTEGER DEFAULT 0,
  total_requests_hour INTEGER DEFAULT 0,
  last_request_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(api_provider, api_endpoint)
);

-- API リクエストキュー（トークンバケット実装用）
CREATE TABLE IF NOT EXISTS security.api_request_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  request_id VARCHAR(100) NOT NULL UNIQUE,
  api_provider VARCHAR(50) NOT NULL,
  api_endpoint VARCHAR(200),
  method VARCHAR(10) NOT NULL,
  url TEXT NOT NULL,
  headers JSONB DEFAULT '{}'::jsonb,
  body JSONB,
  status VARCHAR(30) NOT NULL DEFAULT 'queued',
  priority INTEGER DEFAULT 50,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  queued_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_for TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  response_status INTEGER,
  response_body JSONB,
  error_message TEXT,
  callback_url TEXT,
  callback_headers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 2: 認証情報管理（UI-001/API-001/002対応）
-- ========================================

-- OAuth状態管理
CREATE TABLE IF NOT EXISTS security.oauth_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  state_token VARCHAR(200) NOT NULL UNIQUE,
  provider VARCHAR(50) NOT NULL,
  redirect_uri TEXT,
  scope TEXT,
  code_verifier VARCHAR(200),
  status VARCHAR(30) DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL,
  authorization_code TEXT,
  error_code VARCHAR(100),
  error_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 暗号化された認証情報
CREATE TABLE IF NOT EXISTS security.encrypted_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  provider VARCHAR(50) NOT NULL,
  account_code VARCHAR(100) DEFAULT 'default',
  credential_name VARCHAR(200),
  encrypted_data BYTEA NOT NULL,
  encryption_key_id VARCHAR(100) NOT NULL,
  encryption_algorithm VARCHAR(50) DEFAULT 'AES-256-GCM',
  token_type VARCHAR(50),
  token_expires_at TIMESTAMPTZ,
  refresh_token_expires_at TIMESTAMPTZ,
  last_validated_at TIMESTAMPTZ,
  is_valid BOOLEAN DEFAULT true,
  validation_error TEXT,
  n8n_credential_id VARCHAR(100),
  n8n_synced_at TIMESTAMPTZ,
  n8n_sync_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, provider, account_code)
);

-- トークン更新履歴
CREATE TABLE IF NOT EXISTS security.token_refresh_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  credential_id UUID REFERENCES security.encrypted_credentials(id),
  refresh_type VARCHAR(30) NOT NULL,
  triggered_by VARCHAR(50),
  success BOOLEAN NOT NULL,
  error_message TEXT,
  new_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 3: システムヘルスメトリクス（MON-001対応）
-- ========================================

CREATE TABLE IF NOT EXISTS core.system_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  period_type VARCHAR(20) NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  tool_id VARCHAR(100) NOT NULL,
  tool_name VARCHAR(200),
  tool_category VARCHAR(50),
  execution_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  timeout_count INTEGER DEFAULT 0,
  avg_execution_time_ms INTEGER,
  max_execution_time_ms INTEGER,
  min_execution_time_ms INTEGER,
  p50_execution_time_ms INTEGER,
  p95_execution_time_ms INTEGER,
  p99_execution_time_ms INTEGER,
  total_api_cost_usd DECIMAL(15,6) DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  total_api_calls INTEGER DEFAULT 0,
  error_breakdown JSONB DEFAULT '{}'::jsonb,
  top_errors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, tool_id, period_type, period_start)
);

-- n8n実行ログ集約
CREATE TABLE IF NOT EXISTS core.n8n_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  n8n_execution_id VARCHAR(100) NOT NULL,
  workflow_id VARCHAR(100) NOT NULL,
  workflow_name VARCHAR(200),
  tool_id VARCHAR(100),
  tool_category VARCHAR(50),
  status VARCHAR(30) NOT NULL,
  mode VARCHAR(30),
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  execution_time_ms INTEGER,
  input_summary TEXT,
  output_summary TEXT,
  items_processed INTEGER,
  error_message TEXT,
  error_node VARCHAR(200),
  error_stack TEXT,
  estimated_cost_usd DECIMAL(15,6),
  tokens_used INTEGER,
  api_calls_made INTEGER,
  ai_decisions_made INTEGER DEFAULT 0,
  ai_escalations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(n8n_execution_id)
);

-- アラート設定
CREATE TABLE IF NOT EXISTS core.alert_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  alert_name VARCHAR(200) NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  threshold_value DECIMAL(15,4) NOT NULL,
  threshold_operator VARCHAR(10) NOT NULL,
  evaluation_window_minutes INTEGER DEFAULT 5,
  consecutive_breaches INTEGER DEFAULT 1,
  tool_ids JSONB DEFAULT '[]'::jsonb,
  categories JSONB DEFAULT '[]'::jsonb,
  notification_channels JSONB DEFAULT '["chatwork"]'::jsonb,
  notification_template TEXT,
  cooldown_minutes INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  last_resolved_at TIMESTAMPTZ,
  current_state VARCHAR(30) DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- アラート履歴
CREATE TABLE IF NOT EXISTS core.alert_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  alert_config_id UUID REFERENCES core.alert_configurations(id),
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  triggered_at TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  metric_value DECIMAL(15,4),
  threshold_value DECIMAL(15,4),
  context JSONB DEFAULT '{}'::jsonb,
  notifications_sent JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 4: AI判断証跡（UI-002対応）
-- 既存テーブルがある場合はカラム追加
-- ========================================

-- 新規作成の場合
CREATE TABLE IF NOT EXISTS core.ai_decision_traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  decision_type VARCHAR(100) NOT NULL,
  decision_category VARCHAR(50),
  decision_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  input_summary TEXT,
  input_hash VARCHAR(64),
  ai_model VARCHAR(50),
  ai_model_version VARCHAR(50),
  ai_response JSONB,
  ai_confidence_score DECIMAL(5,4),
  ai_reasoning TEXT,
  score_breakdown JSONB DEFAULT '{}'::jsonb,
  final_decision VARCHAR(100) NOT NULL,
  decision_reasoning TEXT,
  alternatives JSONB DEFAULT '[]'::jsonb,
  selected_index INTEGER,
  selection_margin DECIMAL(5,4),
  was_executed BOOLEAN DEFAULT false,
  execution_result JSONB,
  execution_error TEXT,
  executed_at TIMESTAMPTZ,
  requires_hitl BOOLEAN DEFAULT false,
  hitl_reason TEXT,
  human_override BOOLEAN DEFAULT false,
  human_decision VARCHAR(100),
  human_reason TEXT,
  overridden_by UUID,
  overridden_at TIMESTAMPTZ,
  workflow_id VARCHAR(100),
  execution_id VARCHAR(100),
  node_name VARCHAR(200),
  api_cost_usd DECIMAL(15,6),
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 既存テーブルにカラムがない場合は追加
DO $$
BEGIN
  -- requires_hitl カラム追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'core' 
    AND table_name = 'ai_decision_traces' 
    AND column_name = 'requires_hitl'
  ) THEN
    ALTER TABLE core.ai_decision_traces ADD COLUMN requires_hitl BOOLEAN DEFAULT false;
  END IF;
  
  -- hitl_reason カラム追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'core' 
    AND table_name = 'ai_decision_traces' 
    AND column_name = 'hitl_reason'
  ) THEN
    ALTER TABLE core.ai_decision_traces ADD COLUMN hitl_reason TEXT;
  END IF;

  -- human_override カラム追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'core' 
    AND table_name = 'ai_decision_traces' 
    AND column_name = 'human_override'
  ) THEN
    ALTER TABLE core.ai_decision_traces ADD COLUMN human_override BOOLEAN DEFAULT false;
  END IF;

  -- human_decision カラム追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'core' 
    AND table_name = 'ai_decision_traces' 
    AND column_name = 'human_decision'
  ) THEN
    ALTER TABLE core.ai_decision_traces ADD COLUMN human_decision VARCHAR(100);
  END IF;

  -- human_reason カラム追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'core' 
    AND table_name = 'ai_decision_traces' 
    AND column_name = 'human_reason'
  ) THEN
    ALTER TABLE core.ai_decision_traces ADD COLUMN human_reason TEXT;
  END IF;

  -- overridden_by カラム追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'core' 
    AND table_name = 'ai_decision_traces' 
    AND column_name = 'overridden_by'
  ) THEN
    ALTER TABLE core.ai_decision_traces ADD COLUMN overridden_by UUID;
  END IF;

  -- overridden_at カラム追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'core' 
    AND table_name = 'ai_decision_traces' 
    AND column_name = 'overridden_at'
  ) THEN
    ALTER TABLE core.ai_decision_traces ADD COLUMN overridden_at TIMESTAMPTZ;
  END IF;
END $$;

-- ========================================
-- SECTION 5: HitL承認キュー（UI-004対応）
-- ========================================

CREATE TABLE IF NOT EXISTS core.hitl_approval_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  approval_type VARCHAR(50) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id UUID,
  target_reference VARCHAR(200),
  decision_trace_id UUID REFERENCES core.ai_decision_traces(id),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  urgency VARCHAR(20) DEFAULT 'normal',
  ai_recommendation VARCHAR(100),
  ai_confidence DECIMAL(5,4),
  ai_reasoning TEXT,
  estimated_impact JSONB DEFAULT '{}'::jsonb,
  risk_level VARCHAR(20),
  available_actions JSONB DEFAULT '[]'::jsonb,
  default_action VARCHAR(100),
  status VARCHAR(30) DEFAULT 'pending',
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  selected_action VARCHAR(100),
  approval_note TEXT,
  auto_approve_after TIMESTAMPTZ,
  auto_approve_action VARCHAR(100),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 6: セットアップチェックリスト（UI-012対応）
-- ========================================

CREATE TABLE IF NOT EXISTS core.setup_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  item_key VARCHAR(100) NOT NULL,
  item_name VARCHAR(200) NOT NULL,
  item_category VARCHAR(50) NOT NULL,
  item_order INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by UUID,
  validation_type VARCHAR(50),
  validation_query TEXT,
  last_validated_at TIMESTAMPTZ,
  validation_result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, item_key)
);

-- ========================================
-- SECTION 7: Webhookパスマスター（INC-002対応）
-- ========================================

CREATE TABLE IF NOT EXISTS core.webhook_path_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_path VARCHAR(200),
  normalized_path VARCHAR(200) NOT NULL UNIQUE,
  tool_id VARCHAR(100) NOT NULL,
  tool_category VARCHAR(50),
  description TEXT,
  requires_auth BOOLEAN DEFAULT true,
  auth_type VARCHAR(30) DEFAULT 'hmac',
  is_active BOOLEAN DEFAULT true,
  deprecated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 8: API予算設定（UI-003対応）
-- ========================================

CREATE TABLE IF NOT EXISTS core.api_budget_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  budget_scope VARCHAR(50) NOT NULL,
  api_provider VARCHAR(50),
  tool_id VARCHAR(100),
  budget_period VARCHAR(20) NOT NULL,
  budget_amount DECIMAL(15,2) NOT NULL,
  budget_currency VARCHAR(10) DEFAULT 'USD',
  current_consumption DECIMAL(15,2) DEFAULT 0,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  alert_threshold_percent INTEGER DEFAULT 80,
  critical_threshold_percent INTEGER DEFAULT 95,
  last_alert_sent_at TIMESTAMPTZ,
  on_threshold_action VARCHAR(50) DEFAULT 'alert',
  on_limit_action VARCHAR(50) DEFAULT 'pause',
  fallback_model VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  is_paused BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, budget_scope, api_provider, tool_id, budget_period)
);

-- ========================================
-- SECTION 9: カテゴリ出品枠（UI-005対応）
-- ========================================

CREATE TABLE IF NOT EXISTS commerce.category_listing_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  platform VARCHAR(50) NOT NULL,
  marketplace VARCHAR(50) NOT NULL,
  category_id VARCHAR(100) NOT NULL,
  category_name VARCHAR(200),
  daily_quota INTEGER DEFAULT 100,
  hourly_quota INTEGER DEFAULT 20,
  peak_hours JSONB DEFAULT '{"start": 9, "end": 21}'::jsonb,
  peak_quota_multiplier DECIMAL(3,2) DEFAULT 1.0,
  off_peak_quota_multiplier DECIMAL(3,2) DEFAULT 1.5,
  night_shift_enabled BOOLEAN DEFAULT true,
  night_shift_start INTEGER DEFAULT 22,
  night_shift_end INTEGER DEFAULT 6,
  current_daily_used INTEGER DEFAULT 0,
  current_hourly_used INTEGER DEFAULT 0,
  last_reset_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, platform, marketplace, category_id)
);

-- ========================================
-- インデックス（安全に作成）
-- ========================================

-- レート制限
CREATE INDEX IF NOT EXISTS idx_rate_limits_provider ON security.api_rate_limits(api_provider);
CREATE INDEX IF NOT EXISTS idx_request_queue_status ON security.api_request_queue(status, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_request_queue_provider ON security.api_request_queue(api_provider, status);

-- 認証情報
CREATE INDEX IF NOT EXISTS idx_oauth_states_token ON security.oauth_states(state_token);
CREATE INDEX IF NOT EXISTS idx_encrypted_creds_tenant ON security.encrypted_credentials(tenant_id);
CREATE INDEX IF NOT EXISTS idx_encrypted_creds_provider ON security.encrypted_credentials(provider);
CREATE INDEX IF NOT EXISTS idx_token_refresh_cred ON security.token_refresh_history(credential_id);

-- ヘルスメトリクス
CREATE INDEX IF NOT EXISTS idx_health_metrics_tenant ON core.system_health_metrics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_tool ON core.system_health_metrics(tool_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_period ON core.system_health_metrics(period_start DESC);
CREATE INDEX IF NOT EXISTS idx_n8n_logs_workflow ON core.n8n_execution_logs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_n8n_logs_status ON core.n8n_execution_logs(status);
CREATE INDEX IF NOT EXISTS idx_n8n_logs_started ON core.n8n_execution_logs(started_at DESC);

-- AI判断証跡（requires_hitlカラムが存在する場合のみ作成）
CREATE INDEX IF NOT EXISTS idx_decision_traces_tenant ON core.ai_decision_traces(tenant_id);
CREATE INDEX IF NOT EXISTS idx_decision_traces_type ON core.ai_decision_traces(decision_type);
CREATE INDEX IF NOT EXISTS idx_decision_traces_created ON core.ai_decision_traces(created_at DESC);

-- requires_hitlインデックスは条件付きで作成
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'core' 
    AND table_name = 'ai_decision_traces' 
    AND column_name = 'requires_hitl'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_decision_traces_hitl 
    ON core.ai_decision_traces(requires_hitl) 
    WHERE requires_hitl = true;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Index idx_decision_traces_hitl already exists or cannot be created';
END $$;

-- HitL承認
CREATE INDEX IF NOT EXISTS idx_hitl_queue_tenant ON core.hitl_approval_queue(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hitl_queue_status ON core.hitl_approval_queue(status);
CREATE INDEX IF NOT EXISTS idx_hitl_queue_urgency ON core.hitl_approval_queue(urgency, created_at);

-- アラート
CREATE INDEX IF NOT EXISTS idx_alert_config_tenant ON core.alert_configurations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_alert_history_tenant ON core.alert_history(tenant_id);
CREATE INDEX IF NOT EXISTS idx_alert_history_triggered ON core.alert_history(triggered_at DESC);

-- セットアップ
CREATE INDEX IF NOT EXISTS idx_setup_checklist_tenant ON core.setup_checklist(tenant_id);

-- Webhook
CREATE INDEX IF NOT EXISTS idx_webhook_path_tool ON core.webhook_path_master(tool_id);
CREATE INDEX IF NOT EXISTS idx_webhook_path_legacy ON core.webhook_path_master(legacy_path);

-- 予算
CREATE INDEX IF NOT EXISTS idx_api_budget_tenant ON core.api_budget_settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_budget_provider ON core.api_budget_settings(api_provider);

-- 出品枠
CREATE INDEX IF NOT EXISTS idx_category_quotas_tenant ON commerce.category_listing_quotas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_category_quotas_platform ON commerce.category_listing_quotas(platform, marketplace);

-- ========================================
-- RLS有効化（エラーを無視）
-- ========================================

DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'security.api_rate_limits',
    'security.api_request_queue',
    'security.oauth_states',
    'security.encrypted_credentials',
    'security.token_refresh_history',
    'core.system_health_metrics',
    'core.n8n_execution_logs',
    'core.alert_configurations',
    'core.alert_history',
    'core.ai_decision_traces',
    'core.hitl_approval_queue',
    'core.setup_checklist',
    'core.webhook_path_master',
    'core.api_budget_settings',
    'commerce.category_listing_quotas'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables
  LOOP
    BEGIN
      EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', tbl);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not enable RLS on %: %', tbl, SQLERRM;
    END;
  END LOOP;
END $$;

-- ========================================
-- RLSポリシー（テナント分離）
-- ========================================

-- security.api_request_queue
DROP POLICY IF EXISTS tenant_isolation ON security.api_request_queue;
CREATE POLICY tenant_isolation ON security.api_request_queue
  FOR ALL USING (tenant_id = COALESCE(current_setting('app.tenant_id', true)::uuid, tenant_id));

-- security.oauth_states
DROP POLICY IF EXISTS tenant_isolation ON security.oauth_states;
CREATE POLICY tenant_isolation ON security.oauth_states
  FOR ALL USING (tenant_id = COALESCE(current_setting('app.tenant_id', true)::uuid, tenant_id));

-- security.encrypted_credentials
DROP POLICY IF EXISTS tenant_isolation ON security.encrypted_credentials;
CREATE POLICY tenant_isolation ON security.encrypted_credentials
  FOR ALL USING (tenant_id = COALESCE(current_setting('app.tenant_id', true)::uuid, tenant_id));

-- security.token_refresh_history
DROP POLICY IF EXISTS tenant_isolation ON security.token_refresh_history;
CREATE POLICY tenant_isolation ON security.token_refresh_history
  FOR ALL USING (tenant_id = COALESCE(current_setting('app.tenant_id', true)::uuid, tenant_id));

-- core.system_health_metrics
DROP POLICY IF EXISTS tenant_isolation ON core.system_health_metrics;
CREATE POLICY tenant_isolation ON core.system_health_metrics
  FOR ALL USING (tenant_id = COALESCE(current_setting('app.tenant_id', true)::uuid, tenant_id));

-- core.alert_configurations
DROP POLICY IF EXISTS tenant_isolation ON core.alert_configurations;
CREATE POLICY tenant_isolation ON core.alert_configurations
  FOR ALL USING (tenant_id = COALESCE(current_setting('app.tenant_id', true)::uuid, tenant_id));

-- core.alert_history
DROP POLICY IF EXISTS tenant_isolation ON core.alert_history;
CREATE POLICY tenant_isolation ON core.alert_history
  FOR ALL USING (tenant_id = COALESCE(current_setting('app.tenant_id', true)::uuid, tenant_id));

-- core.ai_decision_traces
DROP POLICY IF EXISTS tenant_isolation ON core.ai_decision_traces;
CREATE POLICY tenant_isolation ON core.ai_decision_traces
  FOR ALL USING (tenant_id = COALESCE(current_setting('app.tenant_id', true)::uuid, tenant_id));

-- core.hitl_approval_queue
DROP POLICY IF EXISTS tenant_isolation ON core.hitl_approval_queue;
CREATE POLICY tenant_isolation ON core.hitl_approval_queue
  FOR ALL USING (tenant_id = COALESCE(current_setting('app.tenant_id', true)::uuid, tenant_id));

-- core.setup_checklist
DROP POLICY IF EXISTS tenant_isolation ON core.setup_checklist;
CREATE POLICY tenant_isolation ON core.setup_checklist
  FOR ALL USING (tenant_id = COALESCE(current_setting('app.tenant_id', true)::uuid, tenant_id));

-- core.api_budget_settings
DROP POLICY IF EXISTS tenant_isolation ON core.api_budget_settings;
CREATE POLICY tenant_isolation ON core.api_budget_settings
  FOR ALL USING (tenant_id = COALESCE(current_setting('app.tenant_id', true)::uuid, tenant_id));

-- commerce.category_listing_quotas
DROP POLICY IF EXISTS tenant_isolation ON commerce.category_listing_quotas;
CREATE POLICY tenant_isolation ON commerce.category_listing_quotas
  FOR ALL USING (tenant_id = COALESCE(current_setting('app.tenant_id', true)::uuid, tenant_id));

-- ========================================
-- 初期データ: APIレート制限設定
-- ========================================

INSERT INTO security.api_rate_limits (api_provider, api_endpoint, requests_per_second, requests_per_minute, requests_per_hour, requests_per_day, burst_limit)
VALUES
  ('ebay', 'trading', 1.5, 90, 5000, 50000, 10),
  ('ebay', 'browse', 5, 300, 15000, 150000, 20),
  ('ebay', 'finding', 5, 300, 15000, 150000, 20),
  ('amazon', 'sp-api', 0.5, 30, 1800, 18000, 5),
  ('keepa', 'product', 1, 60, 3600, 36000, 10),
  ('openai', 'chat', 3, 180, 10000, 100000, 15),
  ('openai', 'vision', 1, 60, 3000, 30000, 5),
  ('anthropic', 'messages', 2, 120, 6000, 60000, 10),
  ('google', 'gemini', 5, 300, 15000, 150000, 20)
ON CONFLICT (api_provider, api_endpoint) DO NOTHING;

-- ========================================
-- 初期データ: Webhookパスマスター
-- ========================================

INSERT INTO core.webhook_path_master (legacy_path, normalized_path, tool_id, tool_category, description)
VALUES
  ('/webhook/listing-reserve', '/v821/listing/reserve', 'listing-reserve', 'listing', '出品予約'),
  ('/webhook/listing', '/v821/listing/execute', 'listing-execute', 'listing', '出品実行'),
  ('/webhook/inventory-sync', '/v821/inventory/sync', 'inventory-sync', 'inventory', '在庫同期'),
  ('/webhook/inventory-monitoring', '/v821/inventory/monitoring', 'inventory-monitoring', 'inventory', '在庫監視'),
  ('/webhook/schedule-cron', '/v821/schedule/cron', 'schedule-cron', 'automation', 'スケジュール実行'),
  ('/webhook/price-update', '/v821/price/update', 'price-update', 'pricing', '価格更新'),
  ('/webhook/order-sync', '/v821/order/sync', 'order-sync', 'order', '受注同期'),
  ('/webhook/research', '/v821/research/execute', 'research-execute', 'research', 'リサーチ実行'),
  ('/webhook/selsimilar', '/v821/research/selsimilar', 'selsimilar', 'research', 'Selsimilar'),
  ('/webhook/hitl-decision', '/v821/hitl/decision', 'hitl-decision', 'hitl', 'HitL判断'),
  ('/webhook/notification', '/v821/notification/send', 'notification-send', 'notification', '通知送信')
ON CONFLICT (normalized_path) DO NOTHING;

-- ========================================
-- 初期データ: セットアップチェックリスト（デフォルトテナント用）
-- ========================================

INSERT INTO core.setup_checklist (tenant_id, item_key, item_name, item_category, item_order, validation_type)
VALUES
  ('00000000-0000-0000-0000-000000000000', 'ebay_oauth', 'eBay OAuth認証', 'api_connection', 1, 'credential_check'),
  ('00000000-0000-0000-0000-000000000000', 'amazon_oauth', 'Amazon SP-API認証', 'api_connection', 2, 'credential_check'),
  ('00000000-0000-0000-0000-000000000000', 'keepa_api', 'Keepa APIキー設定', 'api_connection', 3, 'credential_check'),
  ('00000000-0000-0000-0000-000000000000', 'supabase_connection', 'Supabase接続確認', 'infrastructure', 4, 'health_check'),
  ('00000000-0000-0000-0000-000000000000', 'n8n_connection', 'n8n接続確認', 'infrastructure', 5, 'health_check'),
  ('00000000-0000-0000-0000-000000000000', 'api_budget', 'API予算設定', 'settings', 6, 'config_check'),
  ('00000000-0000-0000-0000-000000000000', 'shipping_policy', '配送ポリシー設定', 'settings', 7, 'config_check'),
  ('00000000-0000-0000-0000-000000000000', 'return_policy', '返品ポリシー設定', 'settings', 8, 'config_check'),
  ('00000000-0000-0000-0000-000000000000', 'category_quota', 'カテゴリ出品枠設定', 'settings', 9, 'config_check'),
  ('00000000-0000-0000-0000-000000000000', 'alert_config', 'アラート設定', 'settings', 10, 'config_check')
ON CONFLICT (tenant_id, item_key) DO NOTHING;

-- ========================================
-- 完了メッセージ
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'N3 Empire OS V8.2.1 - FINAL CONSOLIDATED SCHEMA v2';
  RAISE NOTICE '31件の欠落を完全解消（修正版）';
  RAISE NOTICE '========================================';
  RAISE NOTICE '作成/更新されたテーブル:';
  RAISE NOTICE '  - security.api_rate_limits (SEC-001)';
  RAISE NOTICE '  - security.api_request_queue (SEC-001)';
  RAISE NOTICE '  - security.oauth_states (UI-001/011)';
  RAISE NOTICE '  - security.encrypted_credentials (API-001/002)';
  RAISE NOTICE '  - security.token_refresh_history (API-005)';
  RAISE NOTICE '  - core.system_health_metrics (MON-001)';
  RAISE NOTICE '  - core.n8n_execution_logs (MON-005)';
  RAISE NOTICE '  - core.alert_configurations (MON-004)';
  RAISE NOTICE '  - core.alert_history (MON-004)';
  RAISE NOTICE '  - core.ai_decision_traces (UI-002) - 拡張';
  RAISE NOTICE '  - core.hitl_approval_queue (UI-004)';
  RAISE NOTICE '  - core.setup_checklist (UI-012)';
  RAISE NOTICE '  - core.webhook_path_master (INC-002)';
  RAISE NOTICE '  - core.api_budget_settings (UI-003)';
  RAISE NOTICE '  - commerce.category_listing_quotas (UI-005)';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'マイグレーション完了！';
END $$;
