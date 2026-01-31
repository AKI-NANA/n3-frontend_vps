-- ============================================================================
-- N3 Empire OS V8.2.1: 追加スキーマ（装甲パッチ用）
-- ai_decision_traces / api_consumption_limits / jit_tokens
-- ============================================================================

-- AI判断トレーステーブル（次元13: 証跡）
CREATE TABLE IF NOT EXISTS ai_decision_traces (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'default',
    workflow_name TEXT NOT NULL,
    request_id TEXT NOT NULL,
    node_name TEXT NOT NULL,
    ai_provider TEXT NOT NULL,  -- 'openai', 'gemini', 'claude', 'elevenlabs', 'deepseek'
    model_name TEXT,
    input_summary TEXT,  -- 入力の要約（PIIマスク済み）
    output_summary TEXT,  -- 出力の要約
    reasoning TEXT,  -- AI判断理由
    confidence_score DECIMAL(5,4),  -- 0.0000-1.0000
    tokens_used INTEGER,
    cost_usd DECIMAL(10,6),
    latency_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_traces_tenant_workflow ON ai_decision_traces(tenant_id, workflow_name);
CREATE INDEX IF NOT EXISTS idx_ai_traces_request_id ON ai_decision_traces(request_id);
CREATE INDEX IF NOT EXISTS idx_ai_traces_created_at ON ai_decision_traces(created_at);

-- API消費制限テーブル（次元22: 燃焼上限）
CREATE TABLE IF NOT EXISTS api_consumption_limits (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'default',
    api_provider TEXT NOT NULL,  -- 'openai', 'gemini', 'elevenlabs', 'midjourney', 'suno', 'remotion_lambda'
    daily_limit_usd DECIMAL(10,2) NOT NULL DEFAULT 100.00,
    daily_used_usd DECIMAL(10,6) NOT NULL DEFAULT 0.000000,
    monthly_limit_usd DECIMAL(10,2) NOT NULL DEFAULT 1000.00,
    monthly_used_usd DECIMAL(10,6) NOT NULL DEFAULT 0.000000,
    daily_calls_limit INTEGER NOT NULL DEFAULT 10000,
    daily_calls_used INTEGER NOT NULL DEFAULT 0,
    monthly_calls_limit INTEGER NOT NULL DEFAULT 100000,
    monthly_calls_used INTEGER NOT NULL DEFAULT 0,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    alert_threshold_percent INTEGER NOT NULL DEFAULT 80,  -- アラート発動閾値
    last_alert_sent_at TIMESTAMPTZ,
    reset_daily_at TIMESTAMPTZ NOT NULL DEFAULT (DATE_TRUNC('day', NOW()) + INTERVAL '1 day'),
    reset_monthly_at TIMESTAMPTZ NOT NULL DEFAULT (DATE_TRUNC('month', NOW()) + INTERVAL '1 month'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, api_provider)
);

CREATE INDEX IF NOT EXISTS idx_api_limits_tenant_provider ON api_consumption_limits(tenant_id, api_provider);

-- JITトークンテーブル（次元3: Auth-Gate）
CREATE TABLE IF NOT EXISTS jit_tokens (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'default',
    token_hash TEXT NOT NULL UNIQUE,  -- SHA256ハッシュ
    workflow_name TEXT NOT NULL,
    request_id TEXT NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes'),
    used_at TIMESTAMPTZ,
    is_valid BOOLEAN NOT NULL DEFAULT true,
    source_ip TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jit_tokens_hash ON jit_tokens(token_hash) WHERE is_valid = true;
CREATE INDEX IF NOT EXISTS idx_jit_tokens_expires ON jit_tokens(expires_at) WHERE is_valid = true;

-- 不正アクセス試行ログ
CREATE TABLE IF NOT EXISTS unauthorized_access_logs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'default',
    workflow_name TEXT,
    request_id TEXT,
    token_provided TEXT,  -- 提供されたトークン（マスク済み）
    failure_reason TEXT NOT NULL,  -- 'invalid_token', 'expired_token', 'missing_token', 'ip_mismatch'
    source_ip TEXT,
    user_agent TEXT,
    request_headers JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_unauth_logs_tenant ON unauthorized_access_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_unauth_logs_created ON unauthorized_access_logs(created_at);

-- ============================================================================
-- 関数定義
-- ============================================================================

-- JITトークン検証関数
CREATE OR REPLACE FUNCTION validate_jit_token(
    p_token_hash TEXT,
    p_workflow_name TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    token_record jit_tokens%ROWTYPE;
BEGIN
    -- トークン取得
    SELECT * INTO token_record
    FROM jit_tokens
    WHERE token_hash = p_token_hash
      AND is_valid = true
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'invalid_token',
            'message', 'Token not found or already used'
        );
    END IF;
    
    -- 有効期限チェック
    IF token_record.expires_at < NOW() THEN
        UPDATE jit_tokens SET is_valid = false WHERE id = token_record.id;
        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'expired_token',
            'message', 'Token has expired',
            'expired_at', token_record.expires_at
        );
    END IF;
    
    -- ワークフロー名チェック（指定された場合）
    IF p_workflow_name IS NOT NULL AND token_record.workflow_name != p_workflow_name THEN
        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'workflow_mismatch',
            'message', 'Token not valid for this workflow'
        );
    END IF;
    
    -- トークンを使用済みにマーク
    UPDATE jit_tokens 
    SET used_at = NOW(), is_valid = false 
    WHERE id = token_record.id;
    
    RETURN jsonb_build_object(
        'valid', true,
        'tenant_id', token_record.tenant_id,
        'request_id', token_record.request_id,
        'workflow_name', token_record.workflow_name
    );
END;
$$ LANGUAGE plpgsql;

-- API消費チェック・記録関数
CREATE OR REPLACE FUNCTION check_and_consume_api(
    p_tenant_id TEXT,
    p_api_provider TEXT,
    p_cost_usd DECIMAL DEFAULT 0.001,
    p_calls INTEGER DEFAULT 1
)
RETURNS JSONB AS $$
DECLARE
    limit_record api_consumption_limits%ROWTYPE;
    daily_percent INTEGER;
    monthly_percent INTEGER;
BEGIN
    -- リセット処理
    UPDATE api_consumption_limits
    SET daily_used_usd = 0, daily_calls_used = 0,
        reset_daily_at = DATE_TRUNC('day', NOW()) + INTERVAL '1 day'
    WHERE tenant_id = p_tenant_id 
      AND api_provider = p_api_provider
      AND reset_daily_at <= NOW();
    
    UPDATE api_consumption_limits
    SET monthly_used_usd = 0, monthly_calls_used = 0,
        reset_monthly_at = DATE_TRUNC('month', NOW()) + INTERVAL '1 month'
    WHERE tenant_id = p_tenant_id 
      AND api_provider = p_api_provider
      AND reset_monthly_at <= NOW();
    
    -- レコード取得
    SELECT * INTO limit_record
    FROM api_consumption_limits
    WHERE tenant_id = p_tenant_id AND api_provider = p_api_provider
    FOR UPDATE;
    
    IF NOT FOUND THEN
        -- デフォルト設定で作成
        INSERT INTO api_consumption_limits (tenant_id, api_provider)
        VALUES (p_tenant_id, p_api_provider)
        RETURNING * INTO limit_record;
    END IF;
    
    -- 有効性チェック
    IF NOT limit_record.is_enabled THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'api_disabled',
            'message', 'API provider is disabled for this tenant'
        );
    END IF;
    
    -- 日次制限チェック
    IF limit_record.daily_used_usd + p_cost_usd > limit_record.daily_limit_usd THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'daily_limit_exceeded',
            'daily_used', limit_record.daily_used_usd,
            'daily_limit', limit_record.daily_limit_usd,
            'requested', p_cost_usd
        );
    END IF;
    
    -- 月次制限チェック
    IF limit_record.monthly_used_usd + p_cost_usd > limit_record.monthly_limit_usd THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'monthly_limit_exceeded',
            'monthly_used', limit_record.monthly_used_usd,
            'monthly_limit', limit_record.monthly_limit_usd,
            'requested', p_cost_usd
        );
    END IF;
    
    -- 消費記録
    UPDATE api_consumption_limits
    SET daily_used_usd = daily_used_usd + p_cost_usd,
        monthly_used_usd = monthly_used_usd + p_cost_usd,
        daily_calls_used = daily_calls_used + p_calls,
        monthly_calls_used = monthly_calls_used + p_calls,
        updated_at = NOW()
    WHERE tenant_id = p_tenant_id AND api_provider = p_api_provider;
    
    -- アラート閾値チェック
    daily_percent := ((limit_record.daily_used_usd + p_cost_usd) / limit_record.daily_limit_usd * 100)::INTEGER;
    monthly_percent := ((limit_record.monthly_used_usd + p_cost_usd) / limit_record.monthly_limit_usd * 100)::INTEGER;
    
    RETURN jsonb_build_object(
        'allowed', true,
        'daily_used', limit_record.daily_used_usd + p_cost_usd,
        'daily_limit', limit_record.daily_limit_usd,
        'daily_percent', daily_percent,
        'monthly_used', limit_record.monthly_used_usd + p_cost_usd,
        'monthly_limit', limit_record.monthly_limit_usd,
        'monthly_percent', monthly_percent,
        'alert_triggered', daily_percent >= limit_record.alert_threshold_percent OR monthly_percent >= limit_record.alert_threshold_percent
    );
END;
$$ LANGUAGE plpgsql;

-- AI判断トレース記録関数
CREATE OR REPLACE FUNCTION record_ai_decision(
    p_tenant_id TEXT,
    p_workflow_name TEXT,
    p_request_id TEXT,
    p_node_name TEXT,
    p_ai_provider TEXT,
    p_model_name TEXT,
    p_input_summary TEXT,
    p_output_summary TEXT,
    p_reasoning TEXT,
    p_confidence_score DECIMAL DEFAULT NULL,
    p_tokens_used INTEGER DEFAULT NULL,
    p_cost_usd DECIMAL DEFAULT NULL,
    p_latency_ms INTEGER DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
    trace_id BIGINT;
BEGIN
    INSERT INTO ai_decision_traces (
        tenant_id, workflow_name, request_id, node_name,
        ai_provider, model_name, input_summary, output_summary,
        reasoning, confidence_score, tokens_used, cost_usd, latency_ms
    ) VALUES (
        p_tenant_id, p_workflow_name, p_request_id, p_node_name,
        p_ai_provider, p_model_name, p_input_summary, p_output_summary,
        p_reasoning, p_confidence_score, p_tokens_used, p_cost_usd, p_latency_ms
    )
    RETURNING id INTO trace_id;
    
    RETURN trace_id;
END;
$$ LANGUAGE plpgsql;

-- 不正アクセス記録関数
CREATE OR REPLACE FUNCTION log_unauthorized_access(
    p_tenant_id TEXT,
    p_workflow_name TEXT,
    p_request_id TEXT,
    p_token_provided TEXT,
    p_failure_reason TEXT,
    p_source_ip TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_request_headers JSONB DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
    log_id BIGINT;
BEGIN
    INSERT INTO unauthorized_access_logs (
        tenant_id, workflow_name, request_id, token_provided,
        failure_reason, source_ip, user_agent, request_headers
    ) VALUES (
        p_tenant_id, p_workflow_name, p_request_id,
        LEFT(p_token_provided, 8) || '***MASKED***',  -- トークンマスク
        p_failure_reason, p_source_ip, p_user_agent, p_request_headers
    )
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- デフォルトデータ挿入
-- ============================================================================

-- API消費制限のデフォルト設定
INSERT INTO api_consumption_limits (tenant_id, api_provider, daily_limit_usd, monthly_limit_usd) VALUES
    ('default', 'openai', 50.00, 500.00),
    ('default', 'gemini', 30.00, 300.00),
    ('default', 'claude', 50.00, 500.00),
    ('default', 'elevenlabs', 20.00, 200.00),
    ('default', 'midjourney', 30.00, 300.00),
    ('default', 'suno', 10.00, 100.00),
    ('default', 'remotion_lambda', 100.00, 1000.00),
    ('default', 'deepseek', 10.00, 100.00),
    ('default', 'zenrows', 20.00, 200.00)
ON CONFLICT (tenant_id, api_provider) DO NOTHING;

-- RLS有効化
ALTER TABLE ai_decision_traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_consumption_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE jit_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE unauthorized_access_logs ENABLE ROW LEVEL SECURITY;

-- RLSポリシー（サービスロールは全アクセス可）
CREATE POLICY "Service role full access on ai_decision_traces" ON ai_decision_traces
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on api_consumption_limits" ON api_consumption_limits
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on jit_tokens" ON jit_tokens
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on unauthorized_access_logs" ON unauthorized_access_logs
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- V8.2.1 追加スキーマ完了
-- ============================================================================
