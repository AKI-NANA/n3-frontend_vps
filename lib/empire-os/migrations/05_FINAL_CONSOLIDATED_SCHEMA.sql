-- ========================================
-- N3 Empire OS V8.2.1-Autonomous
-- FINAL CONSOLIDATED SCHEMA
-- 31件の欠落を完全解消する統合スキーマ
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
  
  -- API識別
  api_provider VARCHAR(50) NOT NULL,
  api_endpoint VARCHAR(200),
  
  -- レート制限設定
  requests_per_second DECIMAL(10,2) DEFAULT 1,
  requests_per_minute INTEGER DEFAULT 60,
  requests_per_hour INTEGER DEFAULT 1000,
  requests_per_day INTEGER DEFAULT 10000,
  
  -- バースト設定
  burst_limit INTEGER DEFAULT 10,
  burst_window_seconds INTEGER DEFAULT 60,
  
  -- 現在の状態
  current_bucket_tokens DECIMAL(15,4) DEFAULT 0,
  last_refill_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 統計
  total_requests_today INTEGER DEFAULT 0,
  total_requests_hour INTEGER DEFAULT 0,
  last_request_at TIMESTAMPTZ,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(api_provider, api_endpoint)
);

-- API リクエストキュー（トークンバケット実装用）
CREATE TABLE IF NOT EXISTS security.api_request_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- リクエスト識別
  request_id VARCHAR(100) NOT NULL UNIQUE,
  api_provider VARCHAR(50) NOT NULL,
  api_endpoint VARCHAR(200),
  
  -- リクエスト詳細
  method VARCHAR(10) NOT NULL,
  url TEXT NOT NULL,
  headers JSONB DEFAULT '{}'::jsonb,
  body JSONB,
  
  -- キュー状態
  status VARCHAR(30) NOT NULL DEFAULT 'queued',
  priority INTEGER DEFAULT 50,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  -- タイミング
  queued_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_for TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- 結果
  response_status INTEGER,
  response_body JSONB,
  error_message TEXT,
  
  -- コールバック
  callback_url TEXT,
  callback_headers JSONB,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 2: 認証情報管理（UI-001/API-001/002対応）
-- ========================================

-- OAuth状態管理（CSRFトークン等）
CREATE TABLE IF NOT EXISTS security.oauth_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- OAuth識別
  state_token VARCHAR(200) NOT NULL UNIQUE,
  provider VARCHAR(50) NOT NULL,
  
  -- フロー情報
  redirect_uri TEXT,
  scope TEXT,
  code_verifier VARCHAR(200),
  
  -- 状態
  status VARCHAR(30) DEFAULT 'pending',
  
  -- 有効期限
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- 結果
  authorization_code TEXT,
  error_code VARCHAR(100),
  error_description TEXT,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 暗号化された認証情報（拡張版）
CREATE TABLE IF NOT EXISTS security.encrypted_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 識別
  provider VARCHAR(50) NOT NULL,
  account_code VARCHAR(100) DEFAULT 'default',
  credential_name VARCHAR(200),
  
  -- 暗号化されたデータ
  encrypted_data BYTEA NOT NULL,
  encryption_key_id VARCHAR(100) NOT NULL,
  encryption_algorithm VARCHAR(50) DEFAULT 'AES-256-GCM',
  
  -- トークン情報
  token_type VARCHAR(50),
  token_expires_at TIMESTAMPTZ,
  refresh_token_expires_at TIMESTAMPTZ,
  
  -- 検証
  last_validated_at TIMESTAMPTZ,
  is_valid BOOLEAN DEFAULT true,
  validation_error TEXT,
  
  -- n8n連携
  n8n_credential_id VARCHAR(100),
  n8n_synced_at TIMESTAMPTZ,
  n8n_sync_error TEXT,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, provider, account_code)
);

-- トークン更新履歴
CREATE TABLE IF NOT EXISTS security.token_refresh_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  credential_id UUID NOT NULL REFERENCES security.encrypted_credentials(id),
  
  -- 更新情報
  refresh_type VARCHAR(30) NOT NULL,
  triggered_by VARCHAR(50),
  
  -- 結果
  success BOOLEAN NOT NULL,
  error_message TEXT,
  
  -- 新トークン情報
  new_expires_at TIMESTAMPTZ,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 3: システムヘルスメトリクス（MON-001対応）
-- ========================================

-- システムヘルスメトリクス（集計用）
CREATE TABLE IF NOT EXISTS core.system_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 期間
  period_type VARCHAR(20) NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  -- ツール識別
  tool_id VARCHAR(100) NOT NULL,
  tool_name VARCHAR(200),
  tool_category VARCHAR(50),
  
  -- 実行メトリクス
  execution_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  timeout_count INTEGER DEFAULT 0,
  
  -- パフォーマンス
  avg_execution_time_ms INTEGER,
  max_execution_time_ms INTEGER,
  min_execution_time_ms INTEGER,
  p50_execution_time_ms INTEGER,
  p95_execution_time_ms INTEGER,
  p99_execution_time_ms INTEGER,
  
  -- コスト
  total_api_cost_usd DECIMAL(15,6) DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  total_api_calls INTEGER DEFAULT 0,
  
  -- エラー詳細
  error_breakdown JSONB DEFAULT '{}'::jsonb,
  top_errors JSONB DEFAULT '[]'::jsonb,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, tool_id, period_type, period_start)
);

-- n8n実行ログ集約
CREATE TABLE IF NOT EXISTS core.n8n_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  
  -- n8n識別
  n8n_execution_id VARCHAR(100) NOT NULL,
  workflow_id VARCHAR(100) NOT NULL,
  workflow_name VARCHAR(200),
  
  -- ツールマッピング
  tool_id VARCHAR(100),
  tool_category VARCHAR(50),
  
  -- 実行情報
  status VARCHAR(30) NOT NULL,
  mode VARCHAR(30),
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  execution_time_ms INTEGER,
  
  -- 入出力サマリー
  input_summary TEXT,
  output_summary TEXT,
  items_processed INTEGER,
  
  -- エラー
  error_message TEXT,
  error_node VARCHAR(200),
  error_stack TEXT,
  
  -- コスト追跡
  estimated_cost_usd DECIMAL(15,6),
  tokens_used INTEGER,
  api_calls_made INTEGER,
  
  -- AI関連
  ai_decisions_made INTEGER DEFAULT 0,
  ai_escalations INTEGER DEFAULT 0,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(n8n_execution_id)
);

-- リアルタイムアラート設定
CREATE TABLE IF NOT EXISTS core.alert_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- アラート識別
  alert_name VARCHAR(200) NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  
  -- 条件
  metric_type VARCHAR(50) NOT NULL,
  threshold_value DECIMAL(15,4) NOT NULL,
  threshold_operator VARCHAR(10) NOT NULL,
  evaluation_window_minutes INTEGER DEFAULT 5,
  consecutive_breaches INTEGER DEFAULT 1,
  
  -- 対象
  tool_ids JSONB DEFAULT '[]'::jsonb,
  categories JSONB DEFAULT '[]'::jsonb,
  
  -- 通知
  notification_channels JSONB DEFAULT '["chatwork"]'::jsonb,
  notification_template TEXT,
  cooldown_minutes INTEGER DEFAULT 30,
  
  -- 状態
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  last_resolved_at TIMESTAMPTZ,
  current_state VARCHAR(30) DEFAULT 'normal',
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- アラート履歴
CREATE TABLE IF NOT EXISTS core.alert_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  alert_config_id UUID REFERENCES core.alert_configurations(id),
  
  -- アラート情報
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  
  -- トリガー情報
  triggered_at TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  
  -- 詳細
  metric_value DECIMAL(15,4),
  threshold_value DECIMAL(15,4),
  context JSONB DEFAULT '{}'::jsonb,
  
  -- 通知
  notifications_sent JSONB DEFAULT '[]'::jsonb,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 4: AI判断証跡（UI-002対応）- 拡張版
-- ========================================

-- AI判断証跡（拡張版）
CREATE TABLE IF NOT EXISTS core.ai_decision_traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 判断コンテキスト
  decision_type VARCHAR(100) NOT NULL,
  decision_category VARCHAR(50),
  decision_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- 入力データ
  input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  input_summary TEXT,
  input_hash VARCHAR(64),
  
  -- AI出力
  ai_model VARCHAR(50),
  ai_model_version VARCHAR(50),
  ai_response JSONB,
  ai_confidence_score DECIMAL(5,4),
  ai_reasoning TEXT,
  
  -- スコア内訳
  score_breakdown JSONB DEFAULT '{}'::jsonb,
  
  -- 最終判断
  final_decision VARCHAR(100) NOT NULL,
  decision_reasoning TEXT,
  
  -- 比較データ（Selsimilar等）
  alternatives JSONB DEFAULT '[]'::jsonb,
  selected_index INTEGER,
  selection_margin DECIMAL(5,4),
  
  -- 実行結果
  was_executed BOOLEAN DEFAULT false,
  execution_result JSONB,
  execution_error TEXT,
  executed_at TIMESTAMPTZ,
  
  -- 人間介入
  requires_hitl BOOLEAN DEFAULT false,
  hitl_reason TEXT,
  human_override BOOLEAN DEFAULT false,
  human_decision VARCHAR(100),
  human_reason TEXT,
  overridden_by UUID,
  overridden_at TIMESTAMPTZ,
  
  -- n8n連携
  workflow_id VARCHAR(100),
  execution_id VARCHAR(100),
  node_name VARCHAR(200),
  
  -- コスト
  api_cost_usd DECIMAL(15,6),
  tokens_used INTEGER,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 5: HitL承認キュー（UI-004対応）
-- ========================================

-- HitL承認キュー
CREATE TABLE IF NOT EXISTS core.hitl_approval_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 承認対象
  approval_type VARCHAR(50) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id UUID,
  target_reference VARCHAR(200),
  
  -- AI判断との関連
  decision_trace_id UUID REFERENCES core.ai_decision_traces(id),
  
  -- 承認詳細
  title VARCHAR(500) NOT NULL,
  description TEXT,
  urgency VARCHAR(20) DEFAULT 'normal',
  
  -- AI推奨
  ai_recommendation VARCHAR(100),
  ai_confidence DECIMAL(5,4),
  ai_reasoning TEXT,
  
  -- 影響範囲
  estimated_impact JSONB DEFAULT '{}'::jsonb,
  risk_level VARCHAR(20),
  
  -- 選択肢
  available_actions JSONB DEFAULT '[]'::jsonb,
  default_action VARCHAR(100),
  
  -- 状態
  status VARCHAR(30) DEFAULT 'pending',
  
  -- 承認情報
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  selected_action VARCHAR(100),
  approval_note TEXT,
  
  -- 自動承認設定
  auto_approve_after TIMESTAMPTZ,
  auto_approve_action VARCHAR(100),
  
  -- 期限
  expires_at TIMESTAMPTZ,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 6: セットアップ進捗（UI-012対応）
-- ========================================

-- セットアップチェックリスト
CREATE TABLE IF NOT EXISTS core.setup_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- チェック項目
  item_key VARCHAR(100) NOT NULL,
  item_name VARCHAR(200) NOT NULL,
  item_category VARCHAR(50) NOT NULL,
  item_order INTEGER DEFAULT 0,
  
  -- 状態
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by UUID,
  
  -- 検証
  validation_type VARCHAR(50),
  validation_query TEXT,
  last_validated_at TIMESTAMPTZ,
  validation_result JSONB,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, item_key)
);

-- ========================================
-- SECTION 7: Webhook正規化（INC-002対応）
-- ========================================

-- Webhookパスマスター
CREATE TABLE IF NOT EXISTS core.webhook_path_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- パス情報
  legacy_path VARCHAR(200),
  normalized_path VARCHAR(200) NOT NULL UNIQUE,
  
  -- ツールマッピング
  tool_id VARCHAR(100) NOT NULL,
  tool_category VARCHAR(50),
  
  -- 説明
  description TEXT,
  
  -- 認証
  requires_auth BOOLEAN DEFAULT true,
  auth_type VARCHAR(30) DEFAULT 'hmac',
  
  -- 状態
  is_active BOOLEAN DEFAULT true,
  deprecated_at TIMESTAMPTZ,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 8: API予算管理（UI-003対応）
-- ========================================

-- API予算設定
CREATE TABLE IF NOT EXISTS core.api_budget_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 対象
  budget_scope VARCHAR(50) NOT NULL,
  api_provider VARCHAR(50),
  tool_id VARCHAR(100),
  
  -- 予算
  budget_period VARCHAR(20) NOT NULL,
  budget_amount DECIMAL(15,2) NOT NULL,
  budget_currency VARCHAR(10) DEFAULT 'USD',
  
  -- 現在の消費
  current_consumption DECIMAL(15,2) DEFAULT 0,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  -- アラート
  alert_threshold_percent INTEGER DEFAULT 80,
  critical_threshold_percent INTEGER DEFAULT 95,
  last_alert_sent_at TIMESTAMPTZ,
  
  -- 超過時アクション
  on_threshold_action VARCHAR(50) DEFAULT 'alert',
  on_limit_action VARCHAR(50) DEFAULT 'pause',
  fallback_model VARCHAR(100),
  
  -- 状態
  is_active BOOLEAN DEFAULT true,
  is_paused BOOLEAN DEFAULT false,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, budget_scope, api_provider, tool_id, budget_period)
);

-- ========================================
-- SECTION 9: カテゴリ出品枠（UI-005対応）
-- ========================================

-- カテゴリ別出品枠設定
CREATE TABLE IF NOT EXISTS commerce.category_listing_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- カテゴリ識別
  platform VARCHAR(50) NOT NULL,
  marketplace VARCHAR(50) NOT NULL,
  category_id VARCHAR(100) NOT NULL,
  category_name VARCHAR(200),
  
  -- 枠設定
  daily_quota INTEGER DEFAULT 100,
  hourly_quota INTEGER DEFAULT 20,
  
  -- 時間帯別設定
  peak_hours JSONB DEFAULT '{"start": 9, "end": 21}'::jsonb,
  peak_quota_multiplier DECIMAL(3,2) DEFAULT 1.0,
  off_peak_quota_multiplier DECIMAL(3,2) DEFAULT 1.5,
  
  -- 夜間シフト
  night_shift_enabled BOOLEAN DEFAULT true,
  night_shift_start INTEGER DEFAULT 22,
  night_shift_end INTEGER DEFAULT 6,
  
  -- 現在の使用状況
  current_daily_used INTEGER DEFAULT 0,
  current_hourly_used INTEGER DEFAULT 0,
  last_reset_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, platform, marketplace, category_id)
);

-- ========================================
-- インデックス
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

-- AI判断証跡
CREATE INDEX IF NOT EXISTS idx_decision_traces_tenant ON core.ai_decision_traces(tenant_id);
CREATE INDEX IF NOT EXISTS idx_decision_traces_type ON core.ai_decision_traces(decision_type);
CREATE INDEX IF NOT EXISTS idx_decision_traces_created ON core.ai_decision_traces(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_decision_traces_hitl ON core.ai_decision_traces(requires_hitl) WHERE requires_hitl = true;

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
-- RLS有効化
-- ========================================

ALTER TABLE security.api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE security.api_request_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE security.oauth_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE security.encrypted_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE security.token_refresh_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.system_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.n8n_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.alert_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.alert_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.ai_decision_traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.hitl_approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.setup_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.webhook_path_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.api_budget_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.category_listing_quotas ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLSポリシー
-- ========================================

-- テナント分離ポリシー（全テーブル共通パターン）
DO $$
DECLARE
  tbl RECORD;
BEGIN
  FOR tbl IN 
    SELECT schemaname, tablename 
    FROM pg_tables 
    WHERE schemaname IN ('core', 'security', 'commerce', 'finance', 'media')
    AND tablename NOT IN ('api_rate_limits', 'webhook_path_master')
  LOOP
    -- 既存ポリシーを削除
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation ON %I.%I', tbl.schemaname, tbl.tablename);
    
    -- tenant_idカラムが存在するか確認
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = tbl.schemaname 
      AND table_name = tbl.tablename 
      AND column_name = 'tenant_id'
    ) THEN
      -- テナント分離ポリシーを作成
      EXECUTE format(
        'CREATE POLICY tenant_isolation ON %I.%I FOR ALL USING (tenant_id = current_setting(''app.tenant_id'', true)::uuid)',
        tbl.schemaname, tbl.tablename
      );
    END IF;
  END LOOP;
END $$;

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
-- 初期データ: セットアップチェックリスト
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
-- 完了メッセージ
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'N3 Empire OS V8.2.1 - FINAL CONSOLIDATED SCHEMA';
  RAISE NOTICE '31件の欠落を完全解消';
  RAISE NOTICE '========================================';
  RAISE NOTICE '作成されたテーブル:';
  RAISE NOTICE '  - security.api_rate_limits (SEC-001)';
  RAISE NOTICE '  - security.api_request_queue (SEC-001)';
  RAISE NOTICE '  - security.oauth_states (UI-001/011)';
  RAISE NOTICE '  - security.encrypted_credentials (API-001/002)';
  RAISE NOTICE '  - security.token_refresh_history (API-005)';
  RAISE NOTICE '  - core.system_health_metrics (MON-001)';
  RAISE NOTICE '  - core.n8n_execution_logs (MON-005)';
  RAISE NOTICE '  - core.alert_configurations (MON-004)';
  RAISE NOTICE '  - core.alert_history (MON-004)';
  RAISE NOTICE '  - core.ai_decision_traces (UI-002)';
  RAISE NOTICE '  - core.hitl_approval_queue (UI-004)';
  RAISE NOTICE '  - core.setup_checklist (UI-012)';
  RAISE NOTICE '  - core.webhook_path_master (INC-002)';
  RAISE NOTICE '  - core.api_budget_settings (UI-003)';
  RAISE NOTICE '  - commerce.category_listing_quotas (UI-005)';
  RAISE NOTICE '========================================';
END $$;
