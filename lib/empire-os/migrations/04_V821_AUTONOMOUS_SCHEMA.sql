-- ========================================
-- N3 Empire OS V8.2.1-Autonomous
-- 追加スキーマ: 投資型戦略エンジン用テーブル
-- ========================================

-- ========================================
-- SECTION 1: EOLトラッキング
-- ========================================

CREATE TABLE IF NOT EXISTS commerce.eol_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 商品識別
  product_id UUID,
  product_name VARCHAR(500) NOT NULL,
  brand VARCHAR(200),
  category VARCHAR(200),
  
  -- EOL情報
  eol_date DATE,
  is_confirmed BOOLEAN DEFAULT false,
  eol_source VARCHAR(200),
  eol_announcement_date DATE,
  
  -- 供給分析
  supply_decay_rate DECIMAL(5,2),
  current_supply_level INTEGER,
  predicted_shortage_date DATE,
  
  -- 価格予測
  current_price DECIMAL(15,2),
  predicted_peak_price DECIMAL(15,2),
  predicted_roi DECIMAL(8,2),
  
  -- ステータス
  tracking_status VARCHAR(30) DEFAULT 'active',
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 2: Pop Report（鑑定レポート）
-- ========================================

CREATE TABLE IF NOT EXISTS commerce.pop_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  
  -- カード/商品識別
  card_name VARCHAR(500) NOT NULL,
  set_name VARCHAR(200),
  card_number VARCHAR(50),
  
  -- 鑑定情報
  grading_company VARCHAR(20) NOT NULL,
  grade VARCHAR(20) NOT NULL,
  
  -- 鑑定枚数データ
  population INTEGER NOT NULL,
  higher_population INTEGER DEFAULT 0,
  monthly_change INTEGER DEFAULT 0,
  yearly_growth_rate DECIMAL(8,2),
  
  -- 価格データ
  avg_price DECIMAL(15,2),
  last_sale_price DECIMAL(15,2),
  last_sale_date DATE,
  
  -- 分析
  price_correlation DECIMAL(5,4),
  scarcity_score DECIMAL(5,2),
  
  -- メタ
  data_source VARCHAR(100),
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(card_name, set_name, grading_company, grade)
);

-- ========================================
-- SECTION 3: 再販サイクル
-- ========================================

CREATE TABLE IF NOT EXISTS commerce.reprint_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  
  -- 商品ライン識別
  product_line VARCHAR(200) NOT NULL,
  brand VARCHAR(200) NOT NULL,
  category VARCHAR(200),
  
  -- サイクル情報
  avg_cycle_months INTEGER,
  min_cycle_months INTEGER,
  max_cycle_months INTEGER,
  
  -- 再販履歴
  reprint_history JSONB DEFAULT '[]'::jsonb,
  last_reprint_date DATE,
  next_predicted_date DATE,
  
  -- 価格影響
  avg_price_drop_percent DECIMAL(5,2),
  recovery_months INTEGER,
  
  -- 買い場フラグ
  is_dip_buy_zone BOOLEAN DEFAULT false,
  dip_start_date DATE,
  dip_end_date DATE,
  recommended_buy_price DECIMAL(15,2),
  
  -- メタ
  last_analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(product_line, brand)
);

-- ========================================
-- SECTION 4: ポートフォリオリスク管理
-- ========================================

CREATE TABLE IF NOT EXISTS finance.portfolio_risk_manager (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- スナップショット日時
  snapshot_date DATE NOT NULL,
  
  -- 総資産
  total_inventory_value DECIMAL(15,2) NOT NULL,
  total_items INTEGER NOT NULL,
  
  -- カテゴリ集中度
  category_concentration JSONB NOT NULL DEFAULT '{}'::jsonb,
  max_category_concentration DECIMAL(5,4),
  
  -- ブランド集中度
  brand_concentration JSONB NOT NULL DEFAULT '{}'::jsonb,
  max_brand_concentration DECIMAL(5,4),
  
  -- リスク指標
  liquidity_risk_score DECIMAL(5,2),
  concentration_risk_score DECIMAL(5,2),
  total_risk_score DECIMAL(5,2),
  
  -- 警告
  warnings JSONB DEFAULT '[]'::jsonb,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, snapshot_date)
);

-- ========================================
-- SECTION 5: 資産価値履歴
-- ========================================

CREATE TABLE IF NOT EXISTS finance.asset_valuation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 対象
  product_id UUID NOT NULL,
  sku VARCHAR(100),
  
  -- 評価日
  valuation_date DATE NOT NULL,
  
  -- 価値
  purchase_value DECIMAL(15,2),
  current_value DECIMAL(15,2),
  market_value DECIMAL(15,2),
  
  -- 変動
  value_change DECIMAL(15,2),
  value_change_percent DECIMAL(8,2),
  
  -- アセットスコア
  asset_score DECIMAL(8,2),
  asset_rank VARCHAR(2),
  recommended_action VARCHAR(30),
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, product_id, valuation_date)
);

-- ========================================
-- SECTION 6: 撤退戦略ログ
-- ========================================

CREATE TABLE IF NOT EXISTS commerce.exit_strategy_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 対象商品
  product_id UUID NOT NULL,
  sku VARCHAR(100),
  
  -- 撤退情報
  stage VARCHAR(30) NOT NULL,
  trigger VARCHAR(50) NOT NULL,
  
  -- 計画
  planned_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  executed_actions JSONB DEFAULT '[]'::jsonb,
  
  -- 金額
  estimated_loss DECIMAL(15,2),
  estimated_recovery DECIMAL(15,2),
  actual_loss DECIMAL(15,2),
  actual_recovery DECIMAL(15,2),
  recovery_rate DECIMAL(5,4),
  
  -- ステータス
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  errors JSONB,
  
  -- 承認
  requires_approval BOOLEAN DEFAULT false,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  
  -- 実行
  executed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SECTION 7: 歪みシグナルログ
-- ========================================

CREATE TABLE IF NOT EXISTS commerce.distortion_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  
  -- シグナル情報
  signal_type VARCHAR(50) NOT NULL,
  source VARCHAR(50) NOT NULL,
  
  -- 対象
  product_id UUID,
  sku VARCHAR(100),
  category VARCHAR(200),
  brand VARCHAR(200),
  
  -- 強度・信頼度
  intensity DECIMAL(5,2) NOT NULL,
  confidence DECIMAL(5,4),
  
  -- データ
  signal_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- 集計
  accumulated_hours INTEGER DEFAULT 0,
  signal_count INTEGER DEFAULT 1,
  
  -- ステータス
  status VARCHAR(30) DEFAULT 'active',
  actioned_at TIMESTAMPTZ,
  action_taken VARCHAR(100),
  
  -- メタ
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- インデックス
-- ========================================

-- EOL Tracking
CREATE INDEX IF NOT EXISTS idx_eol_tracking_tenant ON commerce.eol_tracking(tenant_id);
CREATE INDEX IF NOT EXISTS idx_eol_tracking_brand ON commerce.eol_tracking(brand);
CREATE INDEX IF NOT EXISTS idx_eol_tracking_eol_date ON commerce.eol_tracking(eol_date);
CREATE INDEX IF NOT EXISTS idx_eol_tracking_confirmed ON commerce.eol_tracking(is_confirmed) WHERE is_confirmed = true;

-- Pop Reports
CREATE INDEX IF NOT EXISTS idx_pop_reports_card ON commerce.pop_reports(card_name, set_name);
CREATE INDEX IF NOT EXISTS idx_pop_reports_grading ON commerce.pop_reports(grading_company, grade);
CREATE INDEX IF NOT EXISTS idx_pop_reports_scarcity ON commerce.pop_reports(scarcity_score DESC);

-- Reprint Cycles
CREATE INDEX IF NOT EXISTS idx_reprint_cycles_brand ON commerce.reprint_cycles(brand);
CREATE INDEX IF NOT EXISTS idx_reprint_cycles_dip ON commerce.reprint_cycles(is_dip_buy_zone) WHERE is_dip_buy_zone = true;
CREATE INDEX IF NOT EXISTS idx_reprint_cycles_next ON commerce.reprint_cycles(next_predicted_date);

-- Portfolio Risk Manager
CREATE INDEX IF NOT EXISTS idx_portfolio_risk_tenant ON finance.portfolio_risk_manager(tenant_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_risk_date ON finance.portfolio_risk_manager(snapshot_date DESC);

-- Asset Valuation History
CREATE INDEX IF NOT EXISTS idx_asset_valuation_tenant ON finance.asset_valuation_history(tenant_id);
CREATE INDEX IF NOT EXISTS idx_asset_valuation_product ON finance.asset_valuation_history(product_id);
CREATE INDEX IF NOT EXISTS idx_asset_valuation_date ON finance.asset_valuation_history(valuation_date DESC);

-- Exit Strategy Log
CREATE INDEX IF NOT EXISTS idx_exit_strategy_tenant ON commerce.exit_strategy_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_exit_strategy_product ON commerce.exit_strategy_log(product_id);
CREATE INDEX IF NOT EXISTS idx_exit_strategy_status ON commerce.exit_strategy_log(status);
CREATE INDEX IF NOT EXISTS idx_exit_strategy_stage ON commerce.exit_strategy_log(stage);

-- Distortion Signals
CREATE INDEX IF NOT EXISTS idx_distortion_signals_tenant ON commerce.distortion_signals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_distortion_signals_type ON commerce.distortion_signals(signal_type);
CREATE INDEX IF NOT EXISTS idx_distortion_signals_intensity ON commerce.distortion_signals(intensity DESC);
CREATE INDEX IF NOT EXISTS idx_distortion_signals_detected ON commerce.distortion_signals(detected_at DESC);

-- ========================================
-- RLS有効化
-- ========================================

ALTER TABLE commerce.eol_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.pop_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.reprint_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.portfolio_risk_manager ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.asset_valuation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.exit_strategy_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.distortion_signals ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 完了メッセージ
-- ========================================

DO $$
BEGIN
  RAISE NOTICE 'N3 Empire OS V8.2.1-Autonomous 追加スキーマ: 作成完了';
  RAISE NOTICE '- eol_tracking, pop_reports, reprint_cycles';
  RAISE NOTICE '- portfolio_risk_manager, asset_valuation_history';
  RAISE NOTICE '- exit_strategy_log, distortion_signals';
END $$;
