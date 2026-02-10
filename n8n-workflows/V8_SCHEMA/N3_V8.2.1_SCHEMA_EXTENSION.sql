-- ============================================================================
-- N3 Empire OS V8.2.1: 自律コマース拡張スキーマ
-- SM戦略・枠最適化・再帰補完・多販路同期用テーブル追加
-- ============================================================================

-- ============================================================================
-- 1. SM戦略選択ログテーブル
-- ============================================================================
CREATE TABLE IF NOT EXISTS sm_strategy_logs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'default',
    product_id UUID NOT NULL,
    strategy_name TEXT NOT NULL,  -- 'aggressive_margin', 'balanced', 'volume_rotation', 'defensive'
    reason TEXT,
    inputs JSONB NOT NULL DEFAULT '{}',  -- { competitionRatio, trendScore, inventoryPressure, seasonalMultiplier }
    target_margin NUMERIC(5, 2),
    selected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sm_strategy_logs_product ON sm_strategy_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_sm_strategy_logs_tenant_date ON sm_strategy_logs(tenant_id, selected_at);

-- ============================================================================
-- 2. アカウント出品枠管理テーブル
-- ============================================================================
CREATE TABLE IF NOT EXISTS account_listing_slots (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'default',
    account_id TEXT NOT NULL,
    platform TEXT NOT NULL DEFAULT 'ebay',  -- 'ebay', 'amazon', 'qoo10'
    monthly_limit INTEGER NOT NULL DEFAULT 5000,
    monthly_used INTEGER NOT NULL DEFAULT 0,
    category_limits JSONB NOT NULL DEFAULT '{}',  -- { "11450": { "limit": 500, "used": 120 } }
    reset_at TIMESTAMPTZ NOT NULL DEFAULT (DATE_TRUNC('month', NOW()) + INTERVAL '1 month'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, account_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_account_slots_tenant ON account_listing_slots(tenant_id);
CREATE INDEX IF NOT EXISTS idx_account_slots_reset ON account_listing_slots(reset_at);

-- 枠消費関数
CREATE OR REPLACE FUNCTION consume_listing_slot(
    p_tenant_id TEXT,
    p_account_id TEXT,
    p_platform TEXT DEFAULT 'ebay',
    p_category_id TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    slot_record account_listing_slots%ROWTYPE;
    cat_limit JSONB;
    result JSONB;
BEGIN
    -- 枠レコード取得・ロック
    SELECT * INTO slot_record
    FROM account_listing_slots
    WHERE tenant_id = p_tenant_id 
      AND account_id = p_account_id 
      AND platform = p_platform
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'reason', 'slot_not_found',
            'message', 'アカウント枠設定が見つかりません'
        );
    END IF;
    
    -- 月間枠チェック
    IF slot_record.monthly_used >= slot_record.monthly_limit THEN
        RETURN jsonb_build_object(
            'success', false,
            'reason', 'monthly_limit_exceeded',
            'remaining', 0
        );
    END IF;
    
    -- カテゴリ枠チェック
    IF p_category_id IS NOT NULL AND slot_record.category_limits ? p_category_id THEN
        cat_limit := slot_record.category_limits -> p_category_id;
        IF (cat_limit ->> 'used')::int >= (cat_limit ->> 'limit')::int THEN
            RETURN jsonb_build_object(
                'success', false,
                'reason', 'category_limit_exceeded',
                'category_id', p_category_id,
                'remaining', 0
            );
        END IF;
    END IF;
    
    -- 枠消費
    UPDATE account_listing_slots
    SET 
        monthly_used = monthly_used + 1,
        category_limits = CASE 
            WHEN p_category_id IS NOT NULL AND category_limits ? p_category_id 
            THEN jsonb_set(
                category_limits, 
                ARRAY[p_category_id, 'used'], 
                to_jsonb(((category_limits -> p_category_id ->> 'used')::int + 1))
            )
            ELSE category_limits
        END,
        updated_at = NOW()
    WHERE tenant_id = p_tenant_id 
      AND account_id = p_account_id 
      AND platform = p_platform;
    
    RETURN jsonb_build_object(
        'success', true,
        'monthly_remaining', slot_record.monthly_limit - slot_record.monthly_used - 1
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. データ補完トラッキングテーブル
-- ============================================================================
CREATE TABLE IF NOT EXISTS enrichment_tracking (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'default',
    product_id UUID NOT NULL,
    enrichment_depth INTEGER NOT NULL DEFAULT 0,
    sources_tried TEXT[] NOT NULL DEFAULT '{}',
    final_source TEXT,
    initial_confidence INTEGER NOT NULL DEFAULT 50,
    final_confidence INTEGER NOT NULL DEFAULT 50,
    missing_fields_before TEXT[] NOT NULL DEFAULT '{}',
    missing_fields_after TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'complete', 'max_depth', 'exhausted'
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    execution_time_ms INTEGER
);

CREATE INDEX IF NOT EXISTS idx_enrichment_tracking_product ON enrichment_tracking(product_id);
CREATE INDEX IF NOT EXISTS idx_enrichment_tracking_status ON enrichment_tracking(status) WHERE status != 'complete';

-- ============================================================================
-- 4. 多販路価格整合性テーブル
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketplace_price_sync (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'default',
    product_master_id UUID NOT NULL,
    marketplace TEXT NOT NULL,  -- 'ebay_us', 'amazon_us', 'qoo10_jp', etc.
    currency TEXT NOT NULL,
    base_cost_local NUMERIC(12, 2),
    min_price NUMERIC(12, 2) NOT NULL,
    recommended_price NUMERIC(12, 2) NOT NULL,
    current_price NUMERIC(12, 2),
    competitor_price NUMERIC(12, 2),
    expected_margin NUMERIC(5, 2),
    is_profitable BOOLEAN NOT NULL DEFAULT true,
    sync_status TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'synced', 'error', 'needs_review'
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, product_master_id, marketplace)
);

CREATE INDEX IF NOT EXISTS idx_marketplace_price_sync_product ON marketplace_price_sync(product_master_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_price_sync_status ON marketplace_price_sync(sync_status) WHERE sync_status != 'synced';

-- ============================================================================
-- 5. 赤字監視アラートテーブル
-- ============================================================================
CREATE TABLE IF NOT EXISTS red_flag_alerts (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'default',
    product_id UUID NOT NULL,
    listing_id TEXT,
    alert_type TEXT NOT NULL,  -- 'loss', 'low_margin', 'rate_alert', 'emergency_stop'
    severity TEXT NOT NULL DEFAULT 'warning',  -- 'warning', 'critical', 'emergency'
    current_profit_usd NUMERIC(10, 2),
    current_margin NUMERIC(5, 2),
    exchange_rate_listing NUMERIC(8, 2),
    exchange_rate_current NUMERIC(8, 2),
    rate_change_pct NUMERIC(5, 2),
    recommended_action TEXT,
    recommended_price NUMERIC(10, 2),
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    resolved_at TIMESTAMPTZ,
    resolved_by TEXT,
    resolution_action TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_red_flag_alerts_product ON red_flag_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_red_flag_alerts_unresolved ON red_flag_alerts(tenant_id) WHERE is_resolved = false;
CREATE INDEX IF NOT EXISTS idx_red_flag_alerts_severity ON red_flag_alerts(severity, created_at) WHERE is_resolved = false;

-- ============================================================================
-- 6. 市場分析キャッシュテーブル（SM戦略選択用）
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketplace_analytics_cache (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'default',
    category_id TEXT NOT NULL,
    marketplace TEXT NOT NULL DEFAULT 'ebay_us',
    avg_sold_30d NUMERIC(10, 2),
    active_listings INTEGER,
    avg_price NUMERIC(10, 2),
    median_price NUMERIC(10, 2),
    competition_ratio NUMERIC(8, 4),  -- listings / sold
    trend_score INTEGER,
    seasonal_multiplier NUMERIC(4, 2) DEFAULT 1.0,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 day'),
    UNIQUE(tenant_id, category_id, marketplace)
);

CREATE INDEX IF NOT EXISTS idx_analytics_cache_category ON marketplace_analytics_cache(category_id, marketplace);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_expires ON marketplace_analytics_cache(expires_at);

-- キャッシュ取得関数（期限切れチェック付き）
CREATE OR REPLACE FUNCTION get_market_analytics(
    p_tenant_id TEXT,
    p_category_id TEXT,
    p_marketplace TEXT DEFAULT 'ebay_us'
)
RETURNS JSONB AS $$
DECLARE
    cache_record marketplace_analytics_cache%ROWTYPE;
BEGIN
    SELECT * INTO cache_record
    FROM marketplace_analytics_cache
    WHERE tenant_id = p_tenant_id 
      AND category_id = p_category_id 
      AND marketplace = p_marketplace
      AND expires_at > NOW();
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'found', false,
            'message', 'キャッシュなしまたは期限切れ'
        );
    END IF;
    
    RETURN jsonb_build_object(
        'found', true,
        'avg_sold_30d', cache_record.avg_sold_30d,
        'active_listings', cache_record.active_listings,
        'avg_price', cache_record.avg_price,
        'competition_ratio', cache_record.competition_ratio,
        'trend_score', cache_record.trend_score,
        'seasonal_multiplier', cache_record.seasonal_multiplier,
        'captured_at', cache_record.captured_at
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 7. V8.2.1マイグレーション完了フラグ
-- ============================================================================
INSERT INTO execution_stats (tenant_id, workflow_name, date, total_executions, successful_executions)
VALUES ('system', 'V8.2.1_SCHEMA_MIGRATION', CURRENT_DATE, 1, 1)
ON CONFLICT (tenant_id, workflow_name, date) DO NOTHING;

-- ============================================================================
-- 8. 既存products_masterへの拡張カラム追加
-- ============================================================================
DO $$
BEGIN
    -- SM戦略関連
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products_master' AND column_name = 'sm_strategy') THEN
        ALTER TABLE products_master ADD COLUMN sm_strategy TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products_master' AND column_name = 'sm_strategy_reason') THEN
        ALTER TABLE products_master ADD COLUMN sm_strategy_reason TEXT;
    END IF;
    
    -- 為替スナップショット
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products_master' AND column_name = 'listing_exchange_rate') THEN
        ALTER TABLE products_master ADD COLUMN listing_exchange_rate NUMERIC(8, 2);
    END IF;
    
    -- 枠割り当て
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products_master' AND column_name = 'assigned_account_id') THEN
        ALTER TABLE products_master ADD COLUMN assigned_account_id TEXT;
    END IF;
    
    -- 補完トラッキング
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products_master' AND column_name = 'enrichment_depth') THEN
        ALTER TABLE products_master ADD COLUMN enrichment_depth INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products_master' AND column_name = 'enrichment_source') THEN
        ALTER TABLE products_master ADD COLUMN enrichment_source TEXT;
    END IF;
END $$;

-- ============================================================================
-- 完了
-- ============================================================================
COMMENT ON TABLE sm_strategy_logs IS 'V8.2.1: SM戦略選択履歴';
COMMENT ON TABLE account_listing_slots IS 'V8.2.1: アカウント別出品枠管理';
COMMENT ON TABLE enrichment_tracking IS 'V8.2.1: データ補完トラッキング';
COMMENT ON TABLE marketplace_price_sync IS 'V8.2.1: 多販路価格整合性管理';
COMMENT ON TABLE red_flag_alerts IS 'V8.2.1: 赤字監視アラート';
COMMENT ON TABLE marketplace_analytics_cache IS 'V8.2.1: 市場分析キャッシュ';
