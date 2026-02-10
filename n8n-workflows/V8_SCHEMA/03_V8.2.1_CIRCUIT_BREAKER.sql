-- ============================================================================
-- N3 Empire OS V8.2.1 FINAL: 追加マイグレーション
-- Circuit Breaker (全軍停止機能) + Night-Shift Worker 用テーブル
-- 
-- 作成日: 2026-01-24
-- ============================================================================

-- ============================================================================
-- Circuit Breaker テーブル（プラットフォーム別停止制御）
-- ============================================================================

CREATE TABLE IF NOT EXISTS core.platform_circuit_breaker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- プラットフォーム識別
    platform TEXT NOT NULL UNIQUE,
    
    -- 状態
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'stopped', 'degraded', 'maintenance')),
    
    -- トリガー情報
    triggered_at TIMESTAMPTZ,
    triggered_by TEXT,
    reason TEXT,
    
    -- 自動復旧設定
    auto_recovery_enabled BOOLEAN DEFAULT true,
    auto_recovery_at TIMESTAMPTZ,
    recovery_attempts INTEGER DEFAULT 0,
    max_recovery_attempts INTEGER DEFAULT 3,
    
    -- 統計
    total_stops INTEGER DEFAULT 0,
    last_stop_duration_minutes INTEGER,
    
    -- 手動オーバーライド
    manual_override BOOLEAN DEFAULT false,
    override_by TEXT,
    override_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_circuit_breaker_status ON core.platform_circuit_breaker(status) WHERE status = 'stopped';
CREATE INDEX IF NOT EXISTS idx_circuit_breaker_recovery ON core.platform_circuit_breaker(auto_recovery_at) WHERE status = 'stopped' AND auto_recovery_enabled = true;

-- デフォルトプラットフォーム登録
INSERT INTO core.platform_circuit_breaker (platform, status)
VALUES 
    ('ebay', 'active'),
    ('amazon', 'active'),
    ('yahoo', 'active'),
    ('qoo10', 'active'),
    ('paypal', 'active'),
    ('stripe', 'active'),
    ('chatwork', 'active'),
    ('openai', 'active'),
    ('elevenlabs', 'active'),
    ('supabase', 'active')
ON CONFLICT (platform) DO NOTHING;

-- ============================================================================
-- Night-Shift Worker 状態管理
-- ============================================================================

CREATE TABLE IF NOT EXISTS core.night_shift_worker_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    worker_id TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'error', 'stopped')),
    
    -- 現在の処理
    current_request_id TEXT,
    current_workflow TEXT,
    started_at TIMESTAMPTZ,
    
    -- 統計
    processed_today INTEGER DEFAULT 0,
    errors_today INTEGER DEFAULT 0,
    last_processed_at TIMESTAMPTZ,
    
    -- ヘルスチェック
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- API エラー統計ビュー（Watcher用）
-- ============================================================================

CREATE OR REPLACE VIEW core.v_api_error_stats AS
WITH recent_logs AS (
    SELECT 
        COALESCE(metadata->>'platform', 'unknown') as platform,
        status,
        error_message,
        executed_at
    FROM audit.logs
    WHERE executed_at >= NOW() - INTERVAL '15 minutes'
      AND metadata->>'platform' IS NOT NULL
)
SELECT 
    platform,
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE status = 'error') as error_count,
    COUNT(*) FILTER (WHERE status = 'success') as success_count,
    ROUND(COUNT(*) FILTER (WHERE status = 'error') * 100.0 / NULLIF(COUNT(*), 0), 2) as error_rate,
    MAX(executed_at) as last_request_at,
    MAX(executed_at) FILTER (WHERE status = 'error') as last_error_at,
    array_agg(DISTINCT error_message) FILTER (WHERE error_message IS NOT NULL) as error_types
FROM recent_logs
GROUP BY platform;

-- ============================================================================
-- Circuit Breaker 操作関数
-- ============================================================================

-- プラットフォーム停止
CREATE OR REPLACE FUNCTION core.stop_platform(
    p_platform TEXT,
    p_reason TEXT,
    p_triggered_by TEXT DEFAULT 'api_watcher',
    p_recovery_minutes INTEGER DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    UPDATE core.platform_circuit_breaker
    SET 
        status = 'stopped',
        triggered_at = NOW(),
        triggered_by = p_triggered_by,
        reason = p_reason,
        auto_recovery_at = NOW() + (p_recovery_minutes || ' minutes')::interval,
        total_stops = total_stops + 1,
        updated_at = NOW()
    WHERE platform = p_platform
    RETURNING jsonb_build_object(
        'platform', platform,
        'status', status,
        'triggered_at', triggered_at,
        'auto_recovery_at', auto_recovery_at
    ) INTO v_result;
    
    RETURN COALESCE(v_result, '{"error": "platform not found"}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- プラットフォーム復旧
CREATE OR REPLACE FUNCTION core.recover_platform(
    p_platform TEXT,
    p_recovered_by TEXT DEFAULT 'auto'
)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
    v_stop_duration INTEGER;
BEGIN
    SELECT EXTRACT(EPOCH FROM (NOW() - triggered_at)) / 60
    INTO v_stop_duration
    FROM core.platform_circuit_breaker
    WHERE platform = p_platform;
    
    UPDATE core.platform_circuit_breaker
    SET 
        status = 'active',
        triggered_at = NULL,
        triggered_by = NULL,
        reason = NULL,
        auto_recovery_at = NULL,
        recovery_attempts = 0,
        last_stop_duration_minutes = v_stop_duration,
        updated_at = NOW()
    WHERE platform = p_platform
    RETURNING jsonb_build_object(
        'platform', platform,
        'status', status,
        'recovered_by', p_recovered_by,
        'stop_duration_minutes', v_stop_duration
    ) INTO v_result;
    
    RETURN COALESCE(v_result, '{"error": "platform not found"}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- プラットフォーム状態チェック
CREATE OR REPLACE FUNCTION core.check_platform_status(p_platform TEXT)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'platform', platform,
        'status', status,
        'is_available', status = 'active',
        'reason', reason,
        'auto_recovery_at', auto_recovery_at
    )
    INTO v_result
    FROM core.platform_circuit_breaker
    WHERE platform = p_platform;
    
    RETURN COALESCE(v_result, jsonb_build_object('platform', p_platform, 'status', 'unknown', 'is_available', true));
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Night-Shift キュー処理関数
-- ============================================================================

-- 次の実行対象を取得
CREATE OR REPLACE FUNCTION core.get_next_night_shift_job()
RETURNS JSONB AS $$
DECLARE
    v_job JSONB;
BEGIN
    WITH next_job AS (
        SELECT id, tenant_id, request_id, workflow_name, action, payload
        FROM core.night_shift_queue
        WHERE status = 'queued'
          AND scheduled_for <= NOW()
        ORDER BY priority ASC, scheduled_for ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
    )
    UPDATE core.night_shift_queue q
    SET status = 'processing', started_at = NOW()
    FROM next_job n
    WHERE q.id = n.id
    RETURNING jsonb_build_object(
        'id', q.id,
        'request_id', q.request_id,
        'workflow_name', q.workflow_name,
        'action', q.action,
        'payload', q.payload
    ) INTO v_job;
    
    RETURN v_job;
END;
$$ LANGUAGE plpgsql;

-- ジョブ完了
CREATE OR REPLACE FUNCTION core.complete_night_shift_job(
    p_request_id TEXT,
    p_result JSONB,
    p_actual_cost NUMERIC DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    UPDATE core.night_shift_queue
    SET 
        status = 'completed',
        completed_at = NOW(),
        result = p_result,
        actual_cost = p_actual_cost
    WHERE request_id = p_request_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 自動復旧ジョブ（Cron用）
-- ============================================================================

CREATE OR REPLACE FUNCTION core.auto_recover_platforms()
RETURNS TABLE (platform TEXT, recovered BOOLEAN, message TEXT) AS $$
BEGIN
    RETURN QUERY
    WITH to_recover AS (
        SELECT cb.platform
        FROM core.platform_circuit_breaker cb
        WHERE cb.status = 'stopped'
          AND cb.auto_recovery_enabled = true
          AND cb.auto_recovery_at IS NOT NULL
          AND cb.auto_recovery_at <= NOW()
          AND cb.manual_override = false
    )
    UPDATE core.platform_circuit_breaker cb
    SET 
        status = 'active',
        triggered_at = NULL,
        reason = NULL,
        auto_recovery_at = NULL,
        updated_at = NOW()
    FROM to_recover tr
    WHERE cb.platform = tr.platform
    RETURNING cb.platform, true, '自動復旧完了';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RLS
-- ============================================================================

ALTER TABLE core.platform_circuit_breaker ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.night_shift_worker_status ENABLE ROW LEVEL SECURITY;

-- サービスロール用ポリシー
CREATE POLICY service_circuit_breaker ON core.platform_circuit_breaker
    USING (current_setting('app.is_service_role', true) = 'true');

CREATE POLICY service_night_shift_worker ON core.night_shift_worker_status
    USING (current_setting('app.is_service_role', true) = 'true');

-- ============================================================================
-- 完了通知
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'V8.2.1 FINAL 追加マイグレーション完了';
    RAISE NOTICE '- Circuit Breaker テーブル作成';
    RAISE NOTICE '- Night-Shift Worker 状態管理';
    RAISE NOTICE '- API エラー統計ビュー';
    RAISE NOTICE '- 操作関数群';
    RAISE NOTICE '============================================';
END $$;
