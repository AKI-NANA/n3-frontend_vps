-- ========================================
-- N3 Empire OS V8.2.1 - 統合パッチスキーマ（修正版）
-- 作成日: 2025-01-24
-- バージョン: 8.2.1-Autonomous-Fixed
-- 
-- 修正点: 
-- - media.atomic_data テーブルを先に作成
-- - 外部キー参照の依存関係を解決
-- ========================================

-- ========================================
-- 前提条件: スキーマが存在すること
-- ========================================

CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS commerce;
CREATE SCHEMA IF NOT EXISTS media;
CREATE SCHEMA IF NOT EXISTS finance;

-- ========================================
-- SECTION 0: 依存テーブルの作成（media.atomic_data）
-- 注: schema.sqlに含まれるべきだが欠けているため先に作成
-- ========================================

-- media.atomic_data（原子データ）
CREATE TABLE IF NOT EXISTS media.atomic_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
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
  
  -- AI用（pgvector有効化後にembeddingカラム追加）
  embedding_json JSONB,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_atomic_data_tenant ON media.atomic_data(tenant_id);
CREATE INDEX IF NOT EXISTS idx_atomic_data_category ON media.atomic_data(category);
CREATE INDEX IF NOT EXISTS idx_atomic_data_type ON media.atomic_data(data_type);

-- RLS有効化
ALTER TABLE media.atomic_data ENABLE ROW LEVEL SECURITY;

-- ========================================
-- SECTION 1: AI判断証跡・自動化制御
-- ========================================

-- AI判断証跡テーブル（オーナーUI閲覧用）
CREATE TABLE IF NOT EXISTS core.ai_decision_traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 判断コンテキスト
  decision_type VARCHAR(100) NOT NULL,
  decision_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- 入力データ
  input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  input_summary TEXT,
  
  -- AI出力
  ai_model VARCHAR(50),
  ai_response JSONB,
  ai_confidence_score DECIMAL(5,4),
  
  -- 最終判断
  final_decision VARCHAR(100) NOT NULL,
  decision_reasoning TEXT,
  
  -- 実行結果
  was_executed BOOLEAN DEFAULT false,
  execution_result JSONB,
  execution_error TEXT,
  executed_at TIMESTAMPTZ,
  
  -- 人間介入
  human_override BOOLEAN DEFAULT false,
  human_decision VARCHAR(100),
  human_reason TEXT,
  overridden_by UUID,
  overridden_at TIMESTAMPTZ,
  
  -- n8n連携
  workflow_id VARCHAR(100),
  execution_id VARCHAR(100),
  node_name VARCHAR(200),
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API消費制限・予算管理テーブル（オーナーUI編集用）
CREATE TABLE IF NOT EXISTS core.api_consumption_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- API識別
  api_provider VARCHAR(50) NOT NULL,
  api_endpoint VARCHAR(200),
  
  -- 予算設定
  budget_type VARCHAR(30) NOT NULL DEFAULT 'monthly',
  budget_amount DECIMAL(15,2) NOT NULL,
  budget_currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  
  -- 消費追跡
  current_consumption DECIMAL(15,2) DEFAULT 0,
  last_reset_at TIMESTAMPTZ DEFAULT NOW(),
  next_reset_at TIMESTAMPTZ,
  
  -- アラート設定
  alert_threshold_percent INTEGER DEFAULT 80,
  alert_sent_at TIMESTAMPTZ,
  
  -- 制限超過時アクション
  on_limit_exceeded VARCHAR(50) DEFAULT 'pause',
  degraded_model VARCHAR(50),
  
  -- ステータス
  is_active BOOLEAN DEFAULT true,
  is_paused BOOLEAN DEFAULT false,
  paused_reason TEXT,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, api_provider, api_endpoint, budget_type)
);

-- ========================================
-- SECTION 2: カテゴリ枠オプティマイザー
-- ========================================

-- カテゴリ別出品枠管理
CREATE TABLE IF NOT EXISTS commerce.category_listing_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- プラットフォーム・アカウント
  platform VARCHAR(50) NOT NULL,
  marketplace VARCHAR(50) NOT NULL,
  account_code VARCHAR(50) NOT NULL,
  
  -- カテゴリ
  category_id VARCHAR(100) NOT NULL,
  category_name VARCHAR(300),
  category_path TEXT,
  
  -- 枠設定
  daily_quota INTEGER NOT NULL DEFAULT 100,
  hourly_quota INTEGER DEFAULT 20,
  
  -- 現在の使用状況
  used_today INTEGER DEFAULT 0,
  used_this_hour INTEGER DEFAULT 0,
  last_listing_at TIMESTAMPTZ,
  
  -- 時間帯別設定
  peak_hours JSONB DEFAULT '[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]'::jsonb,
  off_peak_multiplier DECIMAL(3,2) DEFAULT 1.5,
  
  -- 枠回復設定
  quota_reset_hour INTEGER DEFAULT 0,
  quota_reset_timezone VARCHAR(50) DEFAULT 'America/Los_Angeles',
  
  -- ステータス
  is_active BOOLEAN DEFAULT true,
  is_quota_exceeded BOOLEAN DEFAULT false,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, platform, marketplace, account_code, category_id)
);

-- 夜間シフト待ちキュー
CREATE TABLE IF NOT EXISTS commerce.night_shift_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 商品情報
  product_id UUID NOT NULL,
  product_title VARCHAR(500),
  
  -- プラットフォーム情報
  platform VARCHAR(50) NOT NULL,
  marketplace VARCHAR(50) NOT NULL,
  account_code VARCHAR(50) NOT NULL,
  category_id VARCHAR(100) NOT NULL,
  
  -- 待ち状態
  status VARCHAR(30) NOT NULL DEFAULT 'waiting',
  queue_reason VARCHAR(100),
  
  -- スケジュール
  queued_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_for TIMESTAMPTZ,
  scheduled_window_start TIME,
  scheduled_window_end TIME,
  
  -- 優先度
  priority INTEGER DEFAULT 50,
  
  -- 実行結果
  executed_at TIMESTAMPTZ,
  result_status VARCHAR(50),
  result_data JSONB,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  -- n8n連携
  workflow_id VARCHAR(100),
  execution_id VARCHAR(100),
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 3: 在庫監視・同期管理
-- ========================================

-- 在庫監視設定
CREATE TABLE IF NOT EXISTS commerce.inventory_monitoring_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 対象
  product_id UUID,
  sku VARCHAR(100),
  platform VARCHAR(50),
  
  -- 監視設定
  check_interval_minutes INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  
  -- 仕入先設定
  source_url TEXT,
  source_type VARCHAR(50),
  source_selector JSONB,
  
  -- アラート設定
  alert_on_out_of_stock BOOLEAN DEFAULT true,
  alert_on_price_change BOOLEAN DEFAULT true,
  price_change_threshold_percent DECIMAL(5,2) DEFAULT 5.0,
  alert_channels JSONB DEFAULT '["chatwork"]'::jsonb,
  
  -- 自動アクション
  auto_delist_on_oos BOOLEAN DEFAULT false,
  auto_update_price BOOLEAN DEFAULT false,
  
  -- ステータス
  last_check_at TIMESTAMPTZ,
  last_status VARCHAR(50),
  consecutive_failures INTEGER DEFAULT 0,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 在庫同期ログ
CREATE TABLE IF NOT EXISTS commerce.inventory_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 同期対象
  product_id UUID,
  sku VARCHAR(100),
  platform VARCHAR(50) NOT NULL,
  marketplace VARCHAR(50),
  account_code VARCHAR(50),
  
  -- 同期内容
  sync_type VARCHAR(50) NOT NULL,
  
  -- 同期前後
  before_data JSONB,
  after_data JSONB,
  changes JSONB,
  
  -- 結果
  status VARCHAR(30) NOT NULL,
  error_message TEXT,
  
  -- パフォーマンス
  duration_ms INTEGER,
  api_calls_made INTEGER,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 4: 価格最適化・競合分析
-- ========================================

-- 価格履歴追跡
CREATE TABLE IF NOT EXISTS commerce.price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 商品
  product_id UUID NOT NULL,
  sku VARCHAR(100),
  platform VARCHAR(50) NOT NULL,
  marketplace VARCHAR(50),
  
  -- 価格データ
  price DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  price_type VARCHAR(30) DEFAULT 'listing',
  
  -- コンテキスト
  change_reason VARCHAR(100),
  changed_by VARCHAR(50),
  ai_decision_id UUID REFERENCES core.ai_decision_traces(id),
  
  -- 効果測定
  views_before INTEGER,
  views_after INTEGER,
  sales_before INTEGER,
  sales_after INTEGER,
  
  -- メタ
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 競合追跡設定
CREATE TABLE IF NOT EXISTS commerce.competitor_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 自社商品
  product_id UUID,
  sku VARCHAR(100),
  
  -- 競合情報
  competitor_url TEXT NOT NULL,
  competitor_platform VARCHAR(50),
  competitor_seller VARCHAR(200),
  
  -- 追跡設定
  is_active BOOLEAN DEFAULT true,
  check_interval_hours INTEGER DEFAULT 6,
  
  -- 最新データ
  last_price DECIMAL(15,2),
  last_currency VARCHAR(10),
  last_stock_status VARCHAR(50),
  last_check_at TIMESTAMPTZ,
  
  -- 統計
  price_history JSONB DEFAULT '[]'::jsonb,
  avg_price_30d DECIMAL(15,2),
  min_price_30d DECIMAL(15,2),
  max_price_30d DECIMAL(15,2),
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 5: メディア・コンテンツ管理
-- ========================================

-- MJアセットライブラリ
CREATE TABLE IF NOT EXISTS media.mj_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- キャラクター/素材識別
  character_id VARCHAR(100),
  character_name VARCHAR(200),
  
  -- 分類
  asset_type VARCHAR(50) NOT NULL,
  emotion_tag VARCHAR(50),
  posture_id VARCHAR(50),
  
  -- ファイル情報
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  original_prompt TEXT,
  mj_job_id VARCHAR(100),
  
  -- メタデータ
  width INTEGER,
  height INTEGER,
  format VARCHAR(20),
  file_size_bytes BIGINT,
  
  -- 使用状況
  use_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- タグ
  tags JSONB DEFAULT '[]'::jsonb,
  
  -- ステータス
  is_active BOOLEAN DEFAULT true,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- コンテンツテンプレート
CREATE TABLE IF NOT EXISTS media.content_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- テンプレート識別
  template_code VARCHAR(100) NOT NULL,
  template_name VARCHAR(200) NOT NULL,
  template_type VARCHAR(50) NOT NULL,
  
  -- 対象設定
  target_platform VARCHAR(50),
  target_language VARCHAR(10) DEFAULT 'ja',
  
  -- テンプレート定義
  structure JSONB NOT NULL,
  style_config JSONB DEFAULT '{}'::jsonb,
  
  -- Remotion設定（動画用）
  remotion_composition VARCHAR(100),
  remotion_props_schema JSONB,
  
  -- 変数定義
  variables JSONB DEFAULT '[]'::jsonb,
  
  -- ステータス
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, template_code, template_type)
);

-- LMS: ユーザー進捗（外部キー参照を削除）
CREATE TABLE IF NOT EXISTS media.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ユーザー識別
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  
  -- コース/問題
  course_id VARCHAR(100),
  question_id UUID,  -- 外部キー参照を削除（atomic_dataへの参照は任意）
  
  -- 回答データ
  answer_given TEXT,
  is_correct BOOLEAN,
  answer_time_seconds INTEGER,
  
  -- 理解度
  confidence_level INTEGER,
  mastery_score DECIMAL(5,2),
  
  -- 復習設定
  next_review_at TIMESTAMPTZ,
  review_interval_days INTEGER DEFAULT 1,
  
  -- メタ
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- LMS: 弱点分析
CREATE TABLE IF NOT EXISTS media.weak_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ユーザー識別
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  
  -- 弱点カテゴリ
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  
  -- 分析データ
  error_count INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  error_rate DECIMAL(5,2),
  
  -- 詳細
  common_mistakes JSONB DEFAULT '[]'::jsonb,
  recommended_resources JSONB DEFAULT '[]'::jsonb,
  
  -- AI分析
  ai_analysis TEXT,
  last_analyzed_at TIMESTAMPTZ,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, tenant_id, category, subcategory)
);

-- ========================================
-- SECTION 6: ワークフロー管理・実行追跡
-- ========================================

-- n8nワークフローレジストリ
CREATE TABLE IF NOT EXISTS core.workflow_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  
  -- ワークフロー識別
  workflow_id VARCHAR(100) NOT NULL,
  workflow_name VARCHAR(200) NOT NULL,
  workflow_version VARCHAR(20) DEFAULT '8.2.1',
  
  -- 分類
  category VARCHAR(50),
  subcategory VARCHAR(50),
  
  -- Webhook情報
  webhook_path VARCHAR(200),
  webhook_method VARCHAR(10) DEFAULT 'POST',
  webhook_full_url TEXT,
  
  -- 設定
  is_active BOOLEAN DEFAULT true,
  is_v8_compliant BOOLEAN DEFAULT false,
  requires_auth BOOLEAN DEFAULT true,
  requires_hitl BOOLEAN DEFAULT false,
  
  -- スケジュール（cron系）
  cron_expression VARCHAR(100),
  cron_timezone VARCHAR(50) DEFAULT 'Asia/Tokyo',
  
  -- 最終実行
  last_executed_at TIMESTAMPTZ,
  last_execution_status VARCHAR(30),
  
  -- メタ
  description TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(workflow_id)
);

-- ワークフロー実行履歴
CREATE TABLE IF NOT EXISTS core.workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  
  -- ワークフロー情報
  workflow_id VARCHAR(100) NOT NULL,
  execution_id VARCHAR(100) NOT NULL,
  
  -- 実行コンテキスト
  trigger_type VARCHAR(50),
  trigger_data JSONB,
  
  -- タイミング
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  
  -- 結果
  status VARCHAR(30) NOT NULL,
  output_data JSONB,
  error_message TEXT,
  error_stack TEXT,
  
  -- ノード別詳細
  node_executions JSONB DEFAULT '[]'::jsonb,
  
  -- コスト追跡
  api_costs JSONB DEFAULT '{}'::jsonb,
  total_cost_usd DECIMAL(10,6),
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(execution_id)
);

-- ========================================
-- SECTION 7: 通知・アラート管理
-- ========================================

-- 通知テンプレート
CREATE TABLE IF NOT EXISTS core.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  
  -- テンプレート識別
  template_code VARCHAR(100) NOT NULL,
  template_name VARCHAR(200) NOT NULL,
  
  -- 対象チャンネル
  channel VARCHAR(50) NOT NULL,
  
  -- テンプレート内容
  subject_template TEXT,
  body_template TEXT NOT NULL,
  
  -- 変数定義
  variables JSONB DEFAULT '[]'::jsonb,
  
  -- ステータス
  is_active BOOLEAN DEFAULT true,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, template_code, channel)
);

-- 通知履歴
CREATE TABLE IF NOT EXISTS core.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  
  -- 通知内容
  channel VARCHAR(50) NOT NULL,
  template_code VARCHAR(100),
  recipient VARCHAR(200),
  subject TEXT,
  body TEXT NOT NULL,
  
  -- 送信結果
  status VARCHAR(30) NOT NULL,
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  
  -- 元トリガー
  trigger_type VARCHAR(50),
  trigger_id VARCHAR(100),
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 8: セキュリティ・監査
-- ========================================

-- APIキーローテーション追跡
CREATE TABLE IF NOT EXISTS core.api_key_rotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- キー情報
  key_type VARCHAR(50) NOT NULL,
  key_name VARCHAR(100),
  
  -- ローテーション情報
  rotated_at TIMESTAMPTZ DEFAULT NOW(),
  previous_key_hash VARCHAR(64),
  new_key_hash VARCHAR(64),
  
  -- 理由
  rotation_reason VARCHAR(100),
  
  -- 検証
  verified_at TIMESTAMPTZ,
  verification_status VARCHAR(30),
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 監査ログ（高レベル）
CREATE TABLE IF NOT EXISTS core.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  
  -- アクション情報
  action_type VARCHAR(100) NOT NULL,
  action_category VARCHAR(50),
  
  -- 対象
  target_type VARCHAR(50),
  target_id VARCHAR(100),
  
  -- 実行者
  actor_type VARCHAR(30),
  actor_id VARCHAR(100),
  
  -- 詳細
  details JSONB DEFAULT '{}'::jsonb,
  
  -- コンテキスト
  ip_address INET,
  user_agent TEXT,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 9: パフォーマンス・分析
-- ========================================

-- 日次メトリクス集計
CREATE TABLE IF NOT EXISTS finance.daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 日付
  metric_date DATE NOT NULL,
  
  -- 出品メトリクス
  listings_created INTEGER DEFAULT 0,
  listings_sold INTEGER DEFAULT 0,
  listings_ended INTEGER DEFAULT 0,
  listings_active INTEGER DEFAULT 0,
  
  -- 収益メトリクス
  gross_sales DECIMAL(15,2) DEFAULT 0,
  net_profit DECIMAL(15,2) DEFAULT 0,
  fees_paid DECIMAL(15,2) DEFAULT 0,
  
  -- コストメトリクス
  api_costs DECIMAL(10,2) DEFAULT 0,
  shipping_costs DECIMAL(10,2) DEFAULT 0,
  
  -- パフォーマンスメトリクス
  avg_response_time_ms INTEGER,
  error_rate DECIMAL(5,4),
  
  -- メタ
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, metric_date)
);

-- カテゴリ別パフォーマンス
CREATE TABLE IF NOT EXISTS finance.category_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- カテゴリ
  platform VARCHAR(50) NOT NULL,
  category_id VARCHAR(100) NOT NULL,
  category_name VARCHAR(300),
  
  -- 期間
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- メトリクス
  total_listings INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  avg_sale_price DECIMAL(15,2),
  avg_days_to_sell DECIMAL(8,2),
  sell_through_rate DECIMAL(5,4),
  
  -- メタ
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, platform, category_id, period_start)
);

-- ========================================
-- SECTION 10: プロキシ・BAN管理
-- ========================================

-- プロキシプール
CREATE TABLE IF NOT EXISTS core.proxy_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  
  -- プロキシ情報
  proxy_type VARCHAR(30) NOT NULL,
  host VARCHAR(200) NOT NULL,
  port INTEGER NOT NULL,
  
  -- 認証（vault参照）
  auth_vault_id UUID,
  
  -- 地域
  country_code VARCHAR(10) NOT NULL,
  region VARCHAR(100),
  city VARCHAR(100),
  
  -- 設定
  sticky_session_supported BOOLEAN DEFAULT false,
  rotation_interval_minutes INTEGER,
  
  -- ステータス
  is_active BOOLEAN DEFAULT true,
  health_status VARCHAR(30) DEFAULT 'unknown',
  last_health_check_at TIMESTAMPTZ,
  
  -- 使用統計
  total_requests BIGINT DEFAULT 0,
  successful_requests BIGINT DEFAULT 0,
  failed_requests BIGINT DEFAULT 0,
  ban_count INTEGER DEFAULT 0,
  last_ban_at TIMESTAMPTZ,
  
  -- コスト
  cost_per_gb_usd DECIMAL(10,4),
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BAN検知ログ
CREATE TABLE IF NOT EXISTS core.ban_detection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  
  -- 検知情報
  platform VARCHAR(50) NOT NULL,
  account_code VARCHAR(50),
  proxy_id UUID REFERENCES core.proxy_pool(id),
  browser_profile_id UUID,
  
  -- 検知内容
  ban_type VARCHAR(50) NOT NULL,
  detection_method VARCHAR(100),
  detection_evidence JSONB,
  
  -- 対応
  action_taken VARCHAR(100),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  
  -- メタ
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- インデックス作成
-- ========================================

-- AI Decision Traces
CREATE INDEX IF NOT EXISTS idx_ai_decision_traces_tenant ON core.ai_decision_traces(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_decision_traces_type ON core.ai_decision_traces(decision_type);
CREATE INDEX IF NOT EXISTS idx_ai_decision_traces_created ON core.ai_decision_traces(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_decision_traces_workflow ON core.ai_decision_traces(workflow_id);

-- API Consumption Limits
CREATE INDEX IF NOT EXISTS idx_api_consumption_limits_tenant ON core.api_consumption_limits(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_consumption_limits_provider ON core.api_consumption_limits(api_provider);
CREATE INDEX IF NOT EXISTS idx_api_consumption_limits_active ON core.api_consumption_limits(is_active) WHERE is_active = true;

-- Category Listing Quotas
CREATE INDEX IF NOT EXISTS idx_category_listing_quotas_tenant ON commerce.category_listing_quotas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_category_listing_quotas_platform ON commerce.category_listing_quotas(platform, marketplace, account_code);
CREATE INDEX IF NOT EXISTS idx_category_listing_quotas_category ON commerce.category_listing_quotas(category_id);
CREATE INDEX IF NOT EXISTS idx_category_listing_quotas_exceeded ON commerce.category_listing_quotas(is_quota_exceeded) WHERE is_quota_exceeded = true;

-- Night Shift Queue
CREATE INDEX IF NOT EXISTS idx_night_shift_queue_tenant ON commerce.night_shift_queue(tenant_id);
CREATE INDEX IF NOT EXISTS idx_night_shift_queue_status ON commerce.night_shift_queue(status);
CREATE INDEX IF NOT EXISTS idx_night_shift_queue_scheduled ON commerce.night_shift_queue(scheduled_for) WHERE status = 'waiting';
CREATE INDEX IF NOT EXISTS idx_night_shift_queue_priority ON commerce.night_shift_queue(priority DESC) WHERE status = 'waiting';

-- Inventory Monitoring Config
CREATE INDEX IF NOT EXISTS idx_inventory_monitoring_config_tenant ON commerce.inventory_monitoring_config(tenant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_monitoring_config_active ON commerce.inventory_monitoring_config(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_inventory_monitoring_config_product ON commerce.inventory_monitoring_config(product_id);

-- Inventory Sync Logs
CREATE INDEX IF NOT EXISTS idx_inventory_sync_logs_tenant ON commerce.inventory_sync_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_sync_logs_product ON commerce.inventory_sync_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_sync_logs_created ON commerce.inventory_sync_logs(created_at DESC);

-- Price History
CREATE INDEX IF NOT EXISTS idx_price_history_tenant ON commerce.price_history(tenant_id);
CREATE INDEX IF NOT EXISTS idx_price_history_product ON commerce.price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded ON commerce.price_history(recorded_at DESC);

-- Competitor Tracking
CREATE INDEX IF NOT EXISTS idx_competitor_tracking_tenant ON commerce.competitor_tracking(tenant_id);
CREATE INDEX IF NOT EXISTS idx_competitor_tracking_product ON commerce.competitor_tracking(product_id);
CREATE INDEX IF NOT EXISTS idx_competitor_tracking_active ON commerce.competitor_tracking(is_active) WHERE is_active = true;

-- MJ Assets
CREATE INDEX IF NOT EXISTS idx_mj_assets_tenant ON media.mj_assets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mj_assets_character ON media.mj_assets(character_id);
CREATE INDEX IF NOT EXISTS idx_mj_assets_type ON media.mj_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_mj_assets_emotion ON media.mj_assets(emotion_tag, posture_id);

-- Content Templates
CREATE INDEX IF NOT EXISTS idx_content_templates_tenant ON media.content_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_content_templates_type ON media.content_templates(template_type);

-- User Progress
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON media.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_tenant ON media.user_progress(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_question ON media.user_progress(question_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_review ON media.user_progress(next_review_at) WHERE next_review_at IS NOT NULL;

-- Weak Points
CREATE INDEX IF NOT EXISTS idx_weak_points_user ON media.weak_points(user_id);
CREATE INDEX IF NOT EXISTS idx_weak_points_tenant ON media.weak_points(tenant_id);
CREATE INDEX IF NOT EXISTS idx_weak_points_category ON media.weak_points(category);

-- Workflow Registry
CREATE INDEX IF NOT EXISTS idx_workflow_registry_tenant ON core.workflow_registry(tenant_id);
CREATE INDEX IF NOT EXISTS idx_workflow_registry_category ON core.workflow_registry(category);
CREATE INDEX IF NOT EXISTS idx_workflow_registry_active ON core.workflow_registry(is_active) WHERE is_active = true;

-- Workflow Executions
CREATE INDEX IF NOT EXISTS idx_workflow_executions_tenant ON core.workflow_executions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow ON core.workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON core.workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_started ON core.workflow_executions(started_at DESC);

-- Notification Templates
CREATE INDEX IF NOT EXISTS idx_notification_templates_tenant ON core.notification_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notification_templates_channel ON core.notification_templates(channel);

-- Notification Logs
CREATE INDEX IF NOT EXISTS idx_notification_logs_tenant ON core.notification_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_channel ON core.notification_logs(channel);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created ON core.notification_logs(created_at DESC);

-- API Key Rotations
CREATE INDEX IF NOT EXISTS idx_api_key_rotations_tenant ON core.api_key_rotations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_key_rotations_type ON core.api_key_rotations(key_type);

-- Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON core.audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON core.audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON core.audit_logs(created_at DESC);

-- Daily Metrics
CREATE INDEX IF NOT EXISTS idx_daily_metrics_tenant ON finance.daily_metrics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_date ON finance.daily_metrics(metric_date DESC);

-- Category Performance
CREATE INDEX IF NOT EXISTS idx_category_performance_tenant ON finance.category_performance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_category_performance_category ON finance.category_performance(platform, category_id);
CREATE INDEX IF NOT EXISTS idx_category_performance_period ON finance.category_performance(period_start);

-- Proxy Pool
CREATE INDEX IF NOT EXISTS idx_proxy_pool_tenant ON core.proxy_pool(tenant_id);
CREATE INDEX IF NOT EXISTS idx_proxy_pool_country ON core.proxy_pool(country_code);
CREATE INDEX IF NOT EXISTS idx_proxy_pool_health ON core.proxy_pool(health_status);
CREATE INDEX IF NOT EXISTS idx_proxy_pool_active ON core.proxy_pool(is_active) WHERE is_active = true;

-- BAN Detection Logs
CREATE INDEX IF NOT EXISTS idx_ban_detection_logs_tenant ON core.ban_detection_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ban_detection_logs_platform ON core.ban_detection_logs(platform);
CREATE INDEX IF NOT EXISTS idx_ban_detection_logs_detected ON core.ban_detection_logs(detected_at DESC);

-- ========================================
-- RLS有効化
-- ========================================

ALTER TABLE core.ai_decision_traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.api_consumption_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.category_listing_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.night_shift_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.inventory_monitoring_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.inventory_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.competitor_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE media.mj_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE media.content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE media.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE media.weak_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.workflow_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.api_key_rotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.category_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.proxy_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.ban_detection_logs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- updated_at トリガー関数（存在しない場合のみ作成）
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 関数: カテゴリ枠チェック＆夜間シフト登録
-- ========================================

CREATE OR REPLACE FUNCTION check_and_queue_listing(
  p_tenant_id UUID,
  p_product_id UUID,
  p_product_title VARCHAR(500),
  p_platform VARCHAR(50),
  p_marketplace VARCHAR(50),
  p_account_code VARCHAR(50),
  p_category_id VARCHAR(100),
  p_workflow_id VARCHAR(100) DEFAULT NULL,
  p_execution_id VARCHAR(100) DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_quota RECORD;
  v_current_hour INTEGER;
  v_is_peak BOOLEAN;
  v_effective_hourly_quota INTEGER;
  v_queue_id UUID;
  v_result JSONB;
BEGIN
  v_current_hour := EXTRACT(HOUR FROM NOW() AT TIME ZONE 'America/Los_Angeles')::INTEGER;
  
  -- 枠設定取得
  SELECT * INTO v_quota FROM commerce.category_listing_quotas
  WHERE tenant_id = p_tenant_id
    AND platform = p_platform
    AND marketplace = p_marketplace
    AND account_code = p_account_code
    AND category_id = p_category_id
    AND is_active = true
  FOR UPDATE;
  
  -- 枠設定がない場合はデフォルト作成
  IF NOT FOUND THEN
    INSERT INTO commerce.category_listing_quotas (
      tenant_id, platform, marketplace, account_code, category_id,
      daily_quota, hourly_quota
    ) VALUES (
      p_tenant_id, p_platform, p_marketplace, p_account_code, p_category_id,
      100, 20
    ) RETURNING * INTO v_quota;
  END IF;
  
  -- ピーク時間判定
  v_is_peak := v_current_hour = ANY(
    (SELECT array_agg(value::int) FROM jsonb_array_elements_text(v_quota.peak_hours))
  );
  
  -- 実効時間枠計算
  v_effective_hourly_quota := CASE 
    WHEN v_is_peak THEN v_quota.hourly_quota
    ELSE CEIL(v_quota.hourly_quota * v_quota.off_peak_multiplier)
  END;
  
  -- 枠チェック
  IF v_quota.used_today >= v_quota.daily_quota 
     OR v_quota.used_this_hour >= v_effective_hourly_quota THEN
    
    -- 夜間シフトキューに追加
    INSERT INTO commerce.night_shift_queue (
      tenant_id, product_id, product_title,
      platform, marketplace, account_code, category_id,
      status, queue_reason,
      scheduled_window_start, scheduled_window_end,
      priority, workflow_id, execution_id
    ) VALUES (
      p_tenant_id, p_product_id, p_product_title,
      p_platform, p_marketplace, p_account_code, p_category_id,
      'waiting', 
      CASE 
        WHEN v_quota.used_today >= v_quota.daily_quota THEN 'quota_exceeded'
        ELSE 'peak_hours'
      END,
      '00:00:00'::TIME,
      '06:00:00'::TIME,
      50, p_workflow_id, p_execution_id
    ) RETURNING id INTO v_queue_id;
    
    -- 枠超過フラグ更新
    UPDATE commerce.category_listing_quotas
    SET is_quota_exceeded = true, updated_at = NOW()
    WHERE id = v_quota.id;
    
    v_result := jsonb_build_object(
      'can_list', false,
      'queued', true,
      'queue_id', v_queue_id,
      'reason', CASE 
        WHEN v_quota.used_today >= v_quota.daily_quota THEN 'daily_quota_exceeded'
        ELSE 'hourly_quota_exceeded'
      END,
      'quota', jsonb_build_object(
        'daily_used', v_quota.used_today,
        'daily_limit', v_quota.daily_quota,
        'hourly_used', v_quota.used_this_hour,
        'hourly_limit', v_effective_hourly_quota
      )
    );
  ELSE
    -- 枠内: カウンター更新
    UPDATE commerce.category_listing_quotas
    SET 
      used_today = used_today + 1,
      used_this_hour = used_this_hour + 1,
      last_listing_at = NOW(),
      is_quota_exceeded = false,
      updated_at = NOW()
    WHERE id = v_quota.id;
    
    v_result := jsonb_build_object(
      'can_list', true,
      'queued', false,
      'quota', jsonb_build_object(
        'daily_used', v_quota.used_today + 1,
        'daily_limit', v_quota.daily_quota,
        'hourly_used', v_quota.used_this_hour + 1,
        'hourly_limit', v_effective_hourly_quota
      )
    );
  END IF;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 関数: 時間枠リセット（cronで毎時実行）
-- ========================================

CREATE OR REPLACE FUNCTION reset_hourly_quotas()
RETURNS INTEGER AS $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE commerce.category_listing_quotas
  SET used_this_hour = 0, updated_at = NOW();
  
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 関数: 日次枠リセット（cronで毎日0時実行）
-- ========================================

CREATE OR REPLACE FUNCTION reset_daily_quotas()
RETURNS INTEGER AS $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE commerce.category_listing_quotas
  SET 
    used_today = 0,
    used_this_hour = 0,
    is_quota_exceeded = false,
    updated_at = NOW();
  
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 関数: API消費記録
-- ========================================

CREATE OR REPLACE FUNCTION record_api_consumption(
  p_tenant_id UUID,
  p_api_provider VARCHAR(50),
  p_amount DECIMAL(15,2),
  p_api_endpoint VARCHAR(200) DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_limit RECORD;
  v_exceeded BOOLEAN;
  v_action VARCHAR(50);
BEGIN
  SELECT * INTO v_limit
  FROM core.api_consumption_limits
  WHERE tenant_id = p_tenant_id
    AND api_provider = p_api_provider
    AND is_active = true
    AND (api_endpoint = p_api_endpoint OR api_endpoint IS NULL)
  ORDER BY api_endpoint NULLS LAST
  LIMIT 1
  FOR UPDATE;
  
  IF NOT FOUND THEN
    INSERT INTO core.api_consumption_limits (
      tenant_id, api_provider, api_endpoint, 
      budget_type, budget_amount, budget_currency,
      current_consumption, last_reset_at
    ) VALUES (
      p_tenant_id, p_api_provider, p_api_endpoint,
      'monthly', 1000, 'USD',
      p_amount, NOW()
    )
    RETURNING * INTO v_limit;
    
    RETURN jsonb_build_object(
      'success', true,
      'limit_id', v_limit.id,
      'consumed', p_amount,
      'budget', v_limit.budget_amount,
      'exceeded', false,
      'action', 'continue'
    );
  END IF;
  
  UPDATE core.api_consumption_limits
  SET 
    current_consumption = current_consumption + p_amount,
    updated_at = NOW()
  WHERE id = v_limit.id;
  
  v_exceeded := (v_limit.current_consumption + p_amount) >= v_limit.budget_amount;
  v_action := CASE
    WHEN v_exceeded AND v_limit.on_limit_exceeded = 'pause' THEN 'pause'
    WHEN v_exceeded AND v_limit.on_limit_exceeded = 'degrade' THEN 'degrade'
    ELSE 'continue'
  END;
  
  IF v_exceeded AND v_limit.alert_sent_at IS NULL THEN
    UPDATE core.api_consumption_limits
    SET alert_sent_at = NOW()
    WHERE id = v_limit.id;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'limit_id', v_limit.id,
    'consumed', v_limit.current_consumption + p_amount,
    'budget', v_limit.budget_amount,
    'exceeded', v_exceeded,
    'action', v_action,
    'degraded_model', CASE WHEN v_action = 'degrade' THEN v_limit.degraded_model ELSE NULL END
  );
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 完了メッセージ
-- ========================================

DO $$
BEGIN
  RAISE NOTICE 'N3 Empire OS V8.2.1 統合パッチスキーマ（修正版）: 作成完了';
  RAISE NOTICE '- media.atomic_data を先に作成';
  RAISE NOTICE '- 外部キー参照の依存関係を解決';
  RAISE NOTICE '- 28テーブル + 3関数作成完了';
END $$;
