-- Amazon Research テーブル（拡張版）
-- 
-- PA-API / Keepa / SP-APIから取得した実データを保存
-- N3スコアリング・自動追跡対応

-- ============================================================
-- メインテーブル
-- ============================================================

CREATE TABLE IF NOT EXISTS amazon_research (
  id BIGSERIAL PRIMARY KEY,
  asin VARCHAR(20) NOT NULL UNIQUE,
  parent_asin VARCHAR(20),
  
  -- 基本情報
  title TEXT,
  title_ja TEXT,
  brand VARCHAR(255),
  manufacturer VARCHAR(255),
  model VARCHAR(255),
  
  -- カテゴリ
  category VARCHAR(255),
  sub_category VARCHAR(255),
  browse_node_id VARCHAR(50),
  
  -- 画像
  main_image_url TEXT,
  image_urls TEXT[],
  
  -- 価格情報（JPY）
  amazon_price_jpy NUMERIC(12,2),
  buy_box_price_jpy NUMERIC(12,2),
  lowest_new_price_jpy NUMERIC(12,2),
  
  -- 価格情報（USD）
  amazon_price_usd NUMERIC(12,2),
  buy_box_price_usd NUMERIC(12,2),
  
  -- FBA情報
  is_fba BOOLEAN DEFAULT FALSE,
  fba_fees_jpy NUMERIC(10,2),
  referral_fee_percent NUMERIC(5,2),
  
  -- サイズ・重量
  length_cm NUMERIC(8,2),
  width_cm NUMERIC(8,2),
  height_cm NUMERIC(8,2),
  weight_g NUMERIC(10,2),
  
  -- BSR（Keepaデータ）
  bsr_current INTEGER,
  bsr_30d_avg INTEGER,
  bsr_90d_avg INTEGER,
  bsr_drops_30d INTEGER,
  bsr_drops_90d INTEGER,
  bsr_category VARCHAR(255),
  
  -- 販売推定（Keepaデータ）
  monthly_sales_estimate INTEGER,
  monthly_revenue_estimate NUMERIC(12,2),
  
  -- レビュー
  review_count INTEGER,
  star_rating NUMERIC(3,2),
  rating_count_30d INTEGER,
  
  -- 競合データ
  new_offer_count INTEGER,
  fba_offer_count INTEGER,
  used_offer_count INTEGER,
  
  -- ============================================================
  -- N3独自計算フィールド
  -- ============================================================
  
  -- N3スコア（0-100）
  n3_score INTEGER,
  n3_score_breakdown JSONB,
  -- 例: {"profit_score": 25, "sales_score": 20, "competition_score": 15, "risk_score": 18}
  
  -- 利益計算
  estimated_cost_jpy NUMERIC(12,2),
  estimated_profit_jpy NUMERIC(12,2),
  estimated_profit_margin NUMERIC(5,2),
  
  -- eBay出品時予測
  ebay_estimated_price_usd NUMERIC(10,2),
  ebay_estimated_profit_usd NUMERIC(10,2),
  
  -- リスク評価
  risk_flags TEXT[],
  -- 例: ['ip_risk', 'hazmat', 'high_competition']
  risk_level VARCHAR(20),
  risk_notes TEXT,
  
  -- ============================================================
  -- ステータス・メタ情報
  -- ============================================================
  
  status VARCHAR(20) DEFAULT 'pending',
  -- pending, processing, completed, error, exists, archived
  error_message TEXT,
  
  -- 自動化設定
  is_auto_tracked BOOLEAN DEFAULT FALSE,
  auto_track_interval INTEGER,
  last_auto_update TIMESTAMPTZ,
  
  -- ソース情報
  source VARCHAR(50) DEFAULT 'manual',
  -- manual, batch, seller_mirror, competitor, auto
  source_reference VARCHAR(255),
  
  -- DB管理
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(255)
);

-- ============================================================
-- インデックス
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_amazon_research_asin ON amazon_research(asin);
CREATE INDEX IF NOT EXISTS idx_amazon_research_status ON amazon_research(status);
CREATE INDEX IF NOT EXISTS idx_amazon_research_n3_score ON amazon_research(n3_score DESC);
CREATE INDEX IF NOT EXISTS idx_amazon_research_profit_margin ON amazon_research(estimated_profit_margin DESC);
CREATE INDEX IF NOT EXISTS idx_amazon_research_bsr ON amazon_research(bsr_current ASC);
CREATE INDEX IF NOT EXISTS idx_amazon_research_sales ON amazon_research(monthly_sales_estimate DESC);
CREATE INDEX IF NOT EXISTS idx_amazon_research_category ON amazon_research(category);
CREATE INDEX IF NOT EXISTS idx_amazon_research_brand ON amazon_research(brand);
CREATE INDEX IF NOT EXISTS idx_amazon_research_updated_at ON amazon_research(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_amazon_research_auto_tracked ON amazon_research(is_auto_tracked) WHERE is_auto_tracked = TRUE;

-- ============================================================
-- 自動化設定テーブル
-- ============================================================

CREATE TABLE IF NOT EXISTS amazon_research_auto_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  
  -- スケジュール
  schedule_type VARCHAR(20) NOT NULL,
  -- daily, weekly, hourly
  schedule_time TIME,
  schedule_days INTEGER[],
  -- 0-6 (Sun-Sat)
  
  -- ソース設定
  source_type VARCHAR(50) NOT NULL,
  -- seller_ids, keywords, category, asin_list
  source_config JSONB NOT NULL,
  -- 例: {"seller_ids": ["A1234", "B5678"]}
  
  -- フィルター
  filter_config JSONB,
  -- 例: {"min_score": 70, "min_profit_margin": 15, "max_bsr": 50000}
  
  -- 通知
  notify_on_new_high_score BOOLEAN DEFAULT FALSE,
  notify_email VARCHAR(255),
  
  -- 統計
  last_run TIMESTAMPTZ,
  last_run_count INTEGER DEFAULT 0,
  total_items_added INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 履歴テーブル（価格・BSR変動追跡）
-- ============================================================

CREATE TABLE IF NOT EXISTS amazon_research_history (
  id BIGSERIAL PRIMARY KEY,
  asin VARCHAR(20) NOT NULL,
  
  -- スナップショット
  amazon_price_jpy NUMERIC(12,2),
  bsr_current INTEGER,
  monthly_sales_estimate INTEGER,
  fba_offer_count INTEGER,
  n3_score INTEGER,
  
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_amazon_research_history_asin ON amazon_research_history(asin);
CREATE INDEX IF NOT EXISTS idx_amazon_research_history_recorded_at ON amazon_research_history(recorded_at DESC);

-- ============================================================
-- トリガー
-- ============================================================

CREATE OR REPLACE FUNCTION update_amazon_research_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_amazon_research_updated ON amazon_research;
CREATE TRIGGER trigger_amazon_research_updated
  BEFORE UPDATE ON amazon_research
  FOR EACH ROW
  EXECUTE FUNCTION update_amazon_research_timestamp();

DROP TRIGGER IF EXISTS trigger_amazon_research_auto_config_updated ON amazon_research_auto_config;
CREATE TRIGGER trigger_amazon_research_auto_config_updated
  BEFORE UPDATE ON amazon_research_auto_config
  FOR EACH ROW
  EXECUTE FUNCTION update_amazon_research_timestamp();

-- ============================================================
-- コメント
-- ============================================================

COMMENT ON TABLE amazon_research IS 'Amazonリサーチ結果 - PA-API/Keepa統合データ';
COMMENT ON TABLE amazon_research_auto_config IS '自動リサーチ設定';
COMMENT ON TABLE amazon_research_history IS '価格・BSR履歴';

COMMENT ON COLUMN amazon_research.n3_score IS 'N3独自スコア（0-100）: 利益/販売/競合/リスク考慮';
COMMENT ON COLUMN amazon_research.n3_score_breakdown IS 'スコア内訳JSON: profit_score, sales_score, competition_score, risk_score';
COMMENT ON COLUMN amazon_research.risk_flags IS 'リスクフラグ配列: ip_risk, hazmat, restricted, high_return等';
COMMENT ON COLUMN amazon_research.bsr_drops_30d IS '30日間BSR上昇回数（≒販売回数）';
