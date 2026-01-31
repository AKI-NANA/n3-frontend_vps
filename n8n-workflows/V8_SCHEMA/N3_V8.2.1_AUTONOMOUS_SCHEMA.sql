-- ============================================================================
-- N3 Empire OS V8.2.1-AUTONOMOUS: 完全自律コマース基盤スキーマ
-- ============================================================================
-- 27次元防衛指示書 完全準拠
-- - 次元3: Auth-Gate バイパス排除（JITトークン）
-- - 次元13: Decision Trace（AI判断証跡）
-- - 次元22: 燃焼上限（API消費コストキャップ）
-- ============================================================================

-- ============================================================================
-- PART 1: 27次元防衛基盤
-- ============================================================================

-- 1-1. JITトークン管理（次元3: Auth-Gateバイパス排除）
CREATE TABLE IF NOT EXISTS jit_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL,
    token_hash TEXT NOT NULL,  -- SHA256ハッシュ（生トークンは保存しない）
    purpose TEXT NOT NULL,     -- 'listing', 'payment', 'api_call', 'admin'
    scope TEXT[] NOT NULL DEFAULT '{}',  -- ['read', 'write', 'delete']
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,  -- 最大15分
    used_at TIMESTAMPTZ,
    used_ip TEXT,
    is_revoked BOOLEAN NOT NULL DEFAULT false,
    revoked_reason TEXT,
    CONSTRAINT jit_token_expiry CHECK (expires_at <= issued_at + INTERVAL '15 minutes')
);

CREATE INDEX IF NOT EXISTS idx_jit_tokens_hash ON jit_tokens(token_hash) WHERE NOT is_revoked;
CREATE INDEX IF NOT EXISTS idx_jit_tokens_cleanup ON jit_tokens(expires_at) WHERE used_at IS NULL;

-- JITトークン発行関数
CREATE OR REPLACE FUNCTION issue_jit_token(
    p_tenant_id TEXT,
    p_purpose TEXT,
    p_scope TEXT[],
    p_ttl_seconds INTEGER DEFAULT 300  -- デフォルト5分
)
RETURNS JSONB AS $$
DECLARE
    v_token_raw TEXT;
    v_token_hash TEXT;
    v_expires_at TIMESTAMPTZ;
    v_id UUID;
BEGIN
    -- 生トークン生成（32バイトランダム + タイムスタンプ）
    v_token_raw := encode(gen_random_bytes(32), 'hex') || '-' || 
                   extract(epoch from NOW())::bigint::text;
    
    -- ハッシュ化
    v_token_hash := encode(sha256(v_token_raw::bytea), 'hex');
    
    -- 有効期限（最大15分）
    v_expires_at := NOW() + LEAST(p_ttl_seconds, 900) * INTERVAL '1 second';
    
    INSERT INTO jit_tokens (tenant_id, token_hash, purpose, scope, expires_at)
    VALUES (p_tenant_id, v_token_hash, p_purpose, p_scope, v_expires_at)
    RETURNING id INTO v_id;
    
    RETURN jsonb_build_object(
        'token', v_token_raw,  -- これだけをクライアントに返す
        'expires_at', v_expires_at,
        'purpose', p_purpose
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- JITトークン検証関数
CREATE OR REPLACE FUNCTION validate_jit_token(
    p_token TEXT,
    p_purpose TEXT,
    p_required_scope TEXT DEFAULT 'read'
)
RETURNS JSONB AS $$
DECLARE
    v_token_hash TEXT;
    v_record jit_tokens%ROWTYPE;
BEGIN
    v_token_hash := encode(sha256(p_token::bytea), 'hex');
    
    SELECT * INTO v_record
    FROM jit_tokens
    WHERE token_hash = v_token_hash
      AND NOT is_revoked
      AND used_at IS NULL
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'reason', 'token_not_found');
    END IF;
    
    IF v_record.expires_at < NOW() THEN
        UPDATE jit_tokens SET is_revoked = true, revoked_reason = 'expired' WHERE id = v_record.id;
        RETURN jsonb_build_object('valid', false, 'reason', 'token_expired');
    END IF;
    
    IF v_record.purpose != p_purpose THEN
        RETURN jsonb_build_object('valid', false, 'reason', 'purpose_mismatch');
    END IF;
    
    IF NOT (v_record.scope @> ARRAY[p_required_scope]) THEN
        RETURN jsonb_build_object('valid', false, 'reason', 'insufficient_scope');
    END IF;
    
    -- 使用済みマーク
    UPDATE jit_tokens 
    SET used_at = NOW(), used_ip = inet_client_addr()::text
    WHERE id = v_record.id;
    
    RETURN jsonb_build_object(
        'valid', true,
        'tenant_id', v_record.tenant_id,
        'scope', v_record.scope
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1-2. AI判断証跡（次元13: Decision Trace）
CREATE TABLE IF NOT EXISTS ai_decision_traces (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    trace_id UUID NOT NULL DEFAULT gen_random_uuid(),
    workflow_id TEXT NOT NULL,
    workflow_name TEXT NOT NULL,
    decision_point TEXT NOT NULL,  -- 'sm_selection', 'pricing', 'listing_approval', 'risk_assessment'
    input_data JSONB NOT NULL,
    ai_model TEXT NOT NULL,        -- 'gemini-1.5-flash', 'gpt-4o', 'claude-3.5-sonnet'
    ai_prompt_hash TEXT NOT NULL,  -- プロンプトのハッシュ（再現性確保）
    ai_response JSONB NOT NULL,
    reasoning TEXT NOT NULL,       -- AIの判断理由（必須）
    confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
    decision_outcome TEXT NOT NULL,  -- 'approved', 'rejected', 'escalated', 'deferred'
    escalation_reason TEXT,
    human_override BOOLEAN NOT NULL DEFAULT false,
    human_override_by TEXT,
    human_override_reason TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- 法廷耐性用：タイムゾーン・ハッシュ署名（次元26）
    timezone TEXT NOT NULL DEFAULT 'Asia/Tokyo',
    record_hash TEXT GENERATED ALWAYS AS (
        encode(sha256((trace_id::text || workflow_id || decision_point || created_at::text)::bytea), 'hex')
    ) STORED
);

CREATE INDEX IF NOT EXISTS idx_ai_decision_traces_trace ON ai_decision_traces(trace_id);
CREATE INDEX IF NOT EXISTS idx_ai_decision_traces_tenant ON ai_decision_traces(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_decision_traces_workflow ON ai_decision_traces(workflow_id, decision_point);
CREATE INDEX IF NOT EXISTS idx_ai_decision_traces_escalated ON ai_decision_traces(tenant_id) 
    WHERE decision_outcome = 'escalated';

-- 1-3. API燃焼上限（次元22）
CREATE TABLE IF NOT EXISTS api_consumption_limits (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    api_provider TEXT NOT NULL,  -- 'openai', 'anthropic', 'google', 'ebay', 'amazon'
    daily_limit_usd NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    monthly_limit_usd NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
    daily_used_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    monthly_used_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    last_reset_daily TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_reset_monthly TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    blocked_reason TEXT,
    blocked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, api_provider)
);

-- API消費記録関数
CREATE OR REPLACE FUNCTION record_api_consumption(
    p_tenant_id TEXT,
    p_api_provider TEXT,
    p_cost_usd NUMERIC
)
RETURNS JSONB AS $$
DECLARE
    v_record api_consumption_limits%ROWTYPE;
    v_blocked BOOLEAN := false;
    v_reason TEXT := '';
BEGIN
    -- 日次/月次リセットチェック
    UPDATE api_consumption_limits
    SET 
        daily_used_usd = CASE WHEN last_reset_daily < CURRENT_DATE THEN 0 ELSE daily_used_usd END,
        last_reset_daily = CASE WHEN last_reset_daily < CURRENT_DATE THEN NOW() ELSE last_reset_daily END,
        monthly_used_usd = CASE WHEN last_reset_monthly < DATE_TRUNC('month', NOW()) THEN 0 ELSE monthly_used_usd END,
        last_reset_monthly = CASE WHEN last_reset_monthly < DATE_TRUNC('month', NOW()) THEN NOW() ELSE last_reset_monthly END
    WHERE tenant_id = p_tenant_id AND api_provider = p_api_provider;
    
    -- レコード取得
    SELECT * INTO v_record
    FROM api_consumption_limits
    WHERE tenant_id = p_tenant_id AND api_provider = p_api_provider
    FOR UPDATE;
    
    IF NOT FOUND THEN
        -- 新規作成
        INSERT INTO api_consumption_limits (tenant_id, api_provider, daily_used_usd, monthly_used_usd)
        VALUES (p_tenant_id, p_api_provider, p_cost_usd, p_cost_usd)
        RETURNING * INTO v_record;
    ELSE
        -- 更新
        UPDATE api_consumption_limits
        SET 
            daily_used_usd = daily_used_usd + p_cost_usd,
            monthly_used_usd = monthly_used_usd + p_cost_usd,
            updated_at = NOW()
        WHERE tenant_id = p_tenant_id AND api_provider = p_api_provider
        RETURNING * INTO v_record;
    END IF;
    
    -- リミットチェック
    IF v_record.daily_used_usd >= v_record.daily_limit_usd THEN
        v_blocked := true;
        v_reason := 'daily_limit_exceeded';
    ELSIF v_record.monthly_used_usd >= v_record.monthly_limit_usd THEN
        v_blocked := true;
        v_reason := 'monthly_limit_exceeded';
    END IF;
    
    IF v_blocked AND NOT v_record.is_blocked THEN
        UPDATE api_consumption_limits
        SET is_blocked = true, blocked_reason = v_reason, blocked_at = NOW()
        WHERE tenant_id = p_tenant_id AND api_provider = p_api_provider;
    END IF;
    
    RETURN jsonb_build_object(
        'recorded', true,
        'daily_used', v_record.daily_used_usd + p_cost_usd,
        'daily_limit', v_record.daily_limit_usd,
        'monthly_used', v_record.monthly_used_usd + p_cost_usd,
        'monthly_limit', v_record.monthly_limit_usd,
        'is_blocked', v_blocked,
        'blocked_reason', v_reason
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PART 2: SM(Selsimileer) AIエージェント基盤
-- ============================================================================

-- 2-1. SMリファレンス判定結果テーブル
CREATE TABLE IF NOT EXISTS sm_reference_judgments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    product_id UUID NOT NULL,
    search_query TEXT NOT NULL,
    candidate_items JSONB NOT NULL,  -- eBay検索結果の候補リスト
    
    -- AI判定結果
    selected_reference_id TEXT,
    selected_reference_title TEXT,
    selected_reference_price NUMERIC(10, 2),
    
    -- 照合スコア
    title_match_score INTEGER CHECK (title_match_score BETWEEN 0 AND 100),
    image_match_score INTEGER CHECK (image_match_score BETWEEN 0 AND 100),  -- Vision API使用時
    specs_match_score INTEGER CHECK (specs_match_score BETWEEN 0 AND 100),
    overall_confidence INTEGER CHECK (overall_confidence BETWEEN 0 AND 100),
    
    -- 判定詳細
    matching_points JSONB NOT NULL DEFAULT '[]',    -- 一致したItem Specifics
    diverging_points JSONB NOT NULL DEFAULT '[]',  -- 不一致点
    ai_reasoning TEXT NOT NULL,
    
    -- HitL（人間承認）
    requires_human_review BOOLEAN NOT NULL DEFAULT false,
    human_approved BOOLEAN,
    human_reviewer TEXT,
    human_review_reason TEXT,
    human_reviewed_at TIMESTAMPTZ,
    
    -- Decision Trace参照
    ai_trace_id UUID,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sm_reference_judgments_product ON sm_reference_judgments(product_id);
CREATE INDEX IF NOT EXISTS idx_sm_reference_judgments_pending ON sm_reference_judgments(tenant_id) 
    WHERE requires_human_review AND human_approved IS NULL;

-- ============================================================================
-- PART 3: カテゴリ枠管理（拡張版）
-- ============================================================================

-- 3-1. カテゴリ別出品枠マスター
CREATE TABLE IF NOT EXISTS category_listing_quotas (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    platform TEXT NOT NULL DEFAULT 'ebay',
    category_id TEXT NOT NULL,
    category_name TEXT,
    
    -- 枠設定
    monthly_quota INTEGER NOT NULL DEFAULT 100,
    monthly_used INTEGER NOT NULL DEFAULT 0,
    daily_quota INTEGER,  -- NULLなら月間のみ
    daily_used INTEGER NOT NULL DEFAULT 0,
    
    -- 優先度設定
    priority_weight NUMERIC(4, 2) NOT NULL DEFAULT 1.0,  -- 利益期待値への重み付け
    min_profit_margin NUMERIC(4, 2) DEFAULT 0.10,        -- この枠に出品する最低利益率
    
    -- リセット管理
    last_daily_reset TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_monthly_reset TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, account_id, platform, category_id)
);

CREATE INDEX IF NOT EXISTS idx_category_quotas_account ON category_listing_quotas(tenant_id, account_id, platform);
CREATE INDEX IF NOT EXISTS idx_category_quotas_available ON category_listing_quotas(tenant_id) 
    WHERE monthly_used < monthly_quota;

-- 3-2. 枠割り当て最適化関数（ナップサック問題近似解）
CREATE OR REPLACE FUNCTION optimize_slot_allocation(
    p_tenant_id TEXT,
    p_products JSONB,  -- [{"id": "uuid", "category_id": "123", "profit_margin": 0.25, "sell_probability": 0.6, "price_usd": 100}]
    p_max_allocations INTEGER DEFAULT 100
)
RETURNS JSONB AS $$
DECLARE
    v_product JSONB;
    v_quota RECORD;
    v_assignments JSONB := '[]'::jsonb;
    v_unassigned JSONB := '[]'::jsonb;
    v_expected_value NUMERIC;
    v_total_ev NUMERIC := 0;
BEGIN
    -- 日次・月次リセット処理
    UPDATE category_listing_quotas
    SET 
        daily_used = CASE WHEN last_daily_reset < CURRENT_DATE THEN 0 ELSE daily_used END,
        last_daily_reset = CASE WHEN last_daily_reset < CURRENT_DATE THEN NOW() ELSE last_daily_reset END,
        monthly_used = CASE WHEN last_monthly_reset < DATE_TRUNC('month', NOW()) THEN 0 ELSE monthly_used END,
        last_monthly_reset = CASE WHEN last_monthly_reset < DATE_TRUNC('month', NOW()) THEN NOW() ELSE last_monthly_reset END
    WHERE tenant_id = p_tenant_id;
    
    -- 商品を利益期待値でソート（JSONBを配列として処理）
    FOR v_product IN 
        SELECT jsonb_array_elements(p_products) AS product
        ORDER BY (
            COALESCE((jsonb_array_elements(p_products)->>'profit_margin')::numeric, 0.15) *
            COALESCE((jsonb_array_elements(p_products)->>'sell_probability')::numeric, 0.5) *
            COALESCE((jsonb_array_elements(p_products)->>'price_usd')::numeric, 50)
        ) DESC
        LIMIT p_max_allocations
    LOOP
        v_expected_value := 
            COALESCE((v_product->>'profit_margin')::numeric, 0.15) *
            COALESCE((v_product->>'sell_probability')::numeric, 0.5) *
            COALESCE((v_product->>'price_usd')::numeric, 50);
        
        -- 利用可能な枠を探す
        SELECT * INTO v_quota
        FROM category_listing_quotas
        WHERE tenant_id = p_tenant_id
          AND category_id = COALESCE(v_product->>'category_id', 'default')
          AND monthly_used < monthly_quota
          AND (daily_quota IS NULL OR daily_used < daily_quota)
          AND (min_profit_margin IS NULL OR (v_product->>'profit_margin')::numeric >= min_profit_margin)
        ORDER BY priority_weight DESC, (monthly_quota - monthly_used) DESC
        LIMIT 1
        FOR UPDATE;
        
        IF FOUND THEN
            -- 枠消費
            UPDATE category_listing_quotas
            SET monthly_used = monthly_used + 1,
                daily_used = COALESCE(daily_used, 0) + 1,
                updated_at = NOW()
            WHERE id = v_quota.id;
            
            -- 割り当て記録
            v_assignments := v_assignments || jsonb_build_object(
                'product_id', v_product->>'id',
                'account_id', v_quota.account_id,
                'category_id', v_quota.category_id,
                'expected_value', ROUND(v_expected_value::numeric, 2),
                'priority', jsonb_array_length(v_assignments) + 1
            );
            
            v_total_ev := v_total_ev + v_expected_value;
        ELSE
            v_unassigned := v_unassigned || jsonb_build_object(
                'product_id', v_product->>'id',
                'reason', 'no_available_quota'
            );
        END IF;
    END LOOP;
    
    RETURN jsonb_build_object(
        'success', true,
        'total_expected_value', ROUND(v_total_ev, 2),
        'assigned_count', jsonb_array_length(v_assignments),
        'unassigned_count', jsonb_array_length(v_unassigned),
        'assignments', v_assignments,
        'unassigned', v_unassigned
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PART 4: 多販路価格計算統合
-- ============================================================================

-- 4-1. 出品前価格検証関数（強制統合用）
CREATE OR REPLACE FUNCTION validate_marketplace_price(
    p_product_id UUID,
    p_marketplace TEXT,
    p_tenant_id TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_calc RECORD;
    v_result JSONB;
BEGIN
    -- 最新の計算結果を取得
    SELECT * INTO v_calc
    FROM marketplace_calc_history
    WHERE product_master_id = p_product_id
      AND user_id = p_tenant_id
      AND created_at > NOW() - INTERVAL '1 hour'  -- 1時間以内の計算のみ有効
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'no_recent_calculation',
            'action', 'call_multi_marketplace_calculate',
            'message', '価格計算が必要です。/multi-marketplace-calculate を呼び出してください。'
        );
    END IF;
    
    -- 該当販路の計算結果を抽出
    SELECT elem INTO v_result
    FROM jsonb_array_elements(v_calc.calculation_data) AS elem
    WHERE elem->>'m' = p_marketplace;
    
    IF v_result IS NULL THEN
        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'marketplace_not_calculated',
            'action', 'recalculate_with_marketplace',
            'message', format('販路 %s の計算結果がありません', p_marketplace)
        );
    END IF;
    
    -- 利益チェック
    IF (v_result->>'ok')::int != 1 THEN
        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'not_profitable',
            'profit_jpy', v_result->>'pr',
            'profit_rate', v_result->>'prc',
            'action', 'skip_listing',
            'message', format('販路 %s は利益率 %s%% で基準未達', p_marketplace, v_result->>'prc')
        );
    END IF;
    
    RETURN jsonb_build_object(
        'valid', true,
        'marketplace', p_marketplace,
        'selling_price', v_result->>'p',
        'selling_price_jpy', v_result->>'pj',
        'currency', v_result->>'c',
        'profit_jpy', v_result->>'pr',
        'profit_rate', v_result->>'prc',
        'exchange_rate', v_result->>'fx',
        'calculated_at', v_calc.created_at
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PART 5: HitL（人間承認）キュー
-- ============================================================================

CREATE TABLE IF NOT EXISTS hitl_approval_queue (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    queue_id UUID NOT NULL DEFAULT gen_random_uuid(),
    
    -- 承認対象
    entity_type TEXT NOT NULL,  -- 'listing', 'pricing', 'sm_reference', 'payment', 'bulk_action'
    entity_id TEXT NOT NULL,
    entity_data JSONB NOT NULL,
    
    -- リスク評価
    risk_level TEXT NOT NULL DEFAULT 'medium',  -- 'low', 'medium', 'high', 'critical'
    risk_factors JSONB NOT NULL DEFAULT '[]',
    
    -- AI判断
    ai_recommendation TEXT NOT NULL,  -- 'approve', 'reject', 'modify'
    ai_confidence INTEGER CHECK (ai_confidence BETWEEN 0 AND 100),
    ai_reasoning TEXT NOT NULL,
    ai_trace_id UUID,
    
    -- 承認状態
    status TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'approved', 'rejected', 'expired', 'auto_approved'
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- 自動承認設定
    auto_approve_at TIMESTAMPTZ,  -- この時刻を過ぎたら自動承認
    auto_approve_if_confidence_above INTEGER DEFAULT 95,  -- 信頼度がこれ以上なら自動承認
    
    -- 有効期限
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hitl_queue_pending ON hitl_approval_queue(tenant_id, status, risk_level)
    WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_hitl_queue_auto ON hitl_approval_queue(auto_approve_at)
    WHERE status = 'pending' AND auto_approve_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_hitl_queue_expires ON hitl_approval_queue(expires_at)
    WHERE status = 'pending';

-- 自動承認処理関数
CREATE OR REPLACE FUNCTION process_auto_approvals(p_tenant_id TEXT DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
    v_count INTEGER := 0;
BEGIN
    -- 時刻ベースの自動承認
    UPDATE hitl_approval_queue
    SET status = 'auto_approved',
        approved_at = NOW(),
        approved_by = 'system:auto_time',
        updated_at = NOW()
    WHERE status = 'pending'
      AND auto_approve_at IS NOT NULL
      AND auto_approve_at <= NOW()
      AND (p_tenant_id IS NULL OR tenant_id = p_tenant_id);
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    
    -- 高信頼度ベースの自動承認
    UPDATE hitl_approval_queue
    SET status = 'auto_approved',
        approved_at = NOW(),
        approved_by = 'system:auto_confidence',
        updated_at = NOW()
    WHERE status = 'pending'
      AND ai_confidence >= auto_approve_if_confidence_above
      AND risk_level IN ('low', 'medium')  -- high/criticalは自動承認しない
      AND (p_tenant_id IS NULL OR tenant_id = p_tenant_id);
    
    GET DIAGNOSTICS v_count = v_count + ROW_COUNT;
    
    -- 期限切れ処理
    UPDATE hitl_approval_queue
    SET status = 'expired',
        updated_at = NOW()
    WHERE status = 'pending'
      AND expires_at < NOW()
      AND (p_tenant_id IS NULL OR tenant_id = p_tenant_id);
    
    RETURN jsonb_build_object(
        'auto_approved', v_count,
        'processed_at', NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PART 6: 夜間シフト・非同期処理キュー（V8.2.1軽快基準）
-- ============================================================================

CREATE TABLE IF NOT EXISTS async_task_queue (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    task_id UUID NOT NULL DEFAULT gen_random_uuid(),
    
    -- タスク定義
    task_type TEXT NOT NULL,  -- 'listing', 'price_update', 'inventory_sync', 'enrichment'
    priority INTEGER NOT NULL DEFAULT 5,  -- 1-10、1が最高
    payload JSONB NOT NULL,
    
    -- スケジュール
    scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    night_shift_only BOOLEAN NOT NULL DEFAULT false,  -- 夜間のみ実行
    
    -- 実行状態
    status TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'running', 'completed', 'failed', 'cancelled'
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    last_error TEXT,
    
    -- 結果
    result JSONB,
    execution_time_ms INTEGER,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_async_tasks_pending ON async_task_queue(tenant_id, priority, scheduled_at)
    WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_async_tasks_night ON async_task_queue(scheduled_at)
    WHERE status = 'pending' AND night_shift_only = true;

-- 夜間時間帯判定関数（JST 22:00-06:00）
CREATE OR REPLACE FUNCTION is_night_shift()
RETURNS BOOLEAN AS $$
DECLARE
    v_hour INTEGER;
BEGIN
    v_hour := EXTRACT(HOUR FROM NOW() AT TIME ZONE 'Asia/Tokyo');
    RETURN v_hour >= 22 OR v_hour < 6;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PART 7: スキーマ完了マーカー
-- ============================================================================

INSERT INTO execution_stats (tenant_id, workflow_name, date, total_executions, successful_executions)
VALUES ('system', 'V8.2.1_AUTONOMOUS_SCHEMA', CURRENT_DATE, 1, 1)
ON CONFLICT (tenant_id, workflow_name, date) DO UPDATE SET total_executions = execution_stats.total_executions + 1;

-- テーブルコメント
COMMENT ON TABLE jit_tokens IS 'V8.2.1-Autonomous: JITトークン管理（27次元-3）';
COMMENT ON TABLE ai_decision_traces IS 'V8.2.1-Autonomous: AI判断証跡（27次元-13）';
COMMENT ON TABLE api_consumption_limits IS 'V8.2.1-Autonomous: API燃焼上限（27次元-22）';
COMMENT ON TABLE sm_reference_judgments IS 'V8.2.1-Autonomous: SM AIエージェント判定結果';
COMMENT ON TABLE category_listing_quotas IS 'V8.2.1-Autonomous: カテゴリ別出品枠管理';
COMMENT ON TABLE hitl_approval_queue IS 'V8.2.1-Autonomous: 人間承認キュー（27次元-5）';
COMMENT ON TABLE async_task_queue IS 'V8.2.1-Autonomous: 非同期タスクキュー（夜間シフト対応）';
