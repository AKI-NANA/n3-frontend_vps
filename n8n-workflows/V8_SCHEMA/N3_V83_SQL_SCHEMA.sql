-- ============================================================================
-- N3 Empire OS V8.3 - 中央集権型不沈艦 追加SQLスキーマ
-- 生成日: 2026-01-25
-- 用途: CORE-Dispatcher用のJob Queue、Circuit-Breaker、Budget Tracking
-- ============================================================================

-- 注意: このスキーマはV5スキーマに追加するものです
-- 既存のV5テーブルには影響しません

-- ============================================================================
-- 1. Job Queue（ジョブキュー）- CORE-Dispatcher用
-- ============================================================================
CREATE TABLE IF NOT EXISTS n3_job_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- ジョブ識別
    workflow_name VARCHAR(255) NOT NULL,
    action VARCHAR(100),
    
    -- 状態管理
    status VARCHAR(50) NOT NULL DEFAULT 'waiting',
    -- waiting: 待機中
    -- running: 実行中
    -- done: 完了
    -- failed: 失敗
    -- cancelled: キャンセル
    
    -- 優先度（1-10、10が最高優先）
    priority INTEGER NOT NULL DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
    
    -- ペイロード
    payload JSONB DEFAULT '{}',
    
    -- 実行結果
    result JSONB,
    error_message TEXT,
    error_code VARCHAR(50),
    
    -- 実行情報
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    timeout_ms INTEGER DEFAULT 300000, -- 5分
    
    -- ユーザー情報
    tenant_id VARCHAR(100),
    created_by VARCHAR(100) NOT NULL,
    
    -- タイムスタンプ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE,
    
    -- 実行統計
    execution_time_ms INTEGER,
    
    -- メタデータ
    metadata JSONB DEFAULT '{}'
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_n3_job_queue_status ON n3_job_queue(status);
CREATE INDEX IF NOT EXISTS idx_n3_job_queue_workflow ON n3_job_queue(workflow_name);
CREATE INDEX IF NOT EXISTS idx_n3_job_queue_priority ON n3_job_queue(priority DESC);
CREATE INDEX IF NOT EXISTS idx_n3_job_queue_created ON n3_job_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_n3_job_queue_waiting ON n3_job_queue(status, priority DESC, created_at ASC) 
    WHERE status = 'waiting';

-- コメント
COMMENT ON TABLE n3_job_queue IS 'CORE-Dispatcher用ジョブキュー - 同時実行制御';
COMMENT ON COLUMN n3_job_queue.priority IS '優先度: 1(最低)-10(最高)';
COMMENT ON COLUMN n3_job_queue.status IS 'waiting/running/done/failed/cancelled';

-- ============================================================================
-- 2. API Health（Circuit-Breaker用）
-- ============================================================================
CREATE TABLE IF NOT EXISTS n3_api_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- API識別
    api_name VARCHAR(100) NOT NULL UNIQUE,
    -- 例: ebay_trading, ebay_browse, amazon_sp, openai, gemini, elevenlabs
    
    -- 状態
    status VARCHAR(50) NOT NULL DEFAULT 'healthy',
    -- healthy: 正常
    -- degraded: 劣化
    -- blocked: ブロック中
    
    -- 失敗カウント
    fail_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    
    -- ブロック情報
    blocked_until TIMESTAMP WITH TIME ZONE,
    block_reason TEXT,
    
    -- 最新記録
    last_success TIMESTAMP WITH TIME ZONE,
    last_fail TIMESTAMP WITH TIME ZONE,
    last_error TEXT,
    last_error_code VARCHAR(50),
    
    -- 設定
    failure_threshold INTEGER DEFAULT 5,
    cooldown_minutes INTEGER DEFAULT 30,
    
    -- 回復情報
    recovered_at TIMESTAMP WITH TIME ZONE,
    auto_recovery_enabled BOOLEAN DEFAULT true,
    
    -- メタデータ
    tenant_id VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    
    -- タイムスタンプ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_n3_api_health_name ON n3_api_health(api_name);
CREATE INDEX IF NOT EXISTS idx_n3_api_health_status ON n3_api_health(status);
CREATE INDEX IF NOT EXISTS idx_n3_api_health_blocked ON n3_api_health(blocked_until) 
    WHERE blocked_until IS NOT NULL;

-- 初期データ挿入
INSERT INTO n3_api_health (api_name, status, failure_threshold, cooldown_minutes) VALUES
    ('ebay_trading', 'healthy', 5, 30),
    ('ebay_browse', 'healthy', 5, 30),
    ('ebay_inventory', 'healthy', 5, 30),
    ('amazon_sp', 'healthy', 5, 30),
    ('amazon_pa', 'healthy', 5, 30),
    ('yahoo_auction', 'healthy', 5, 30),
    ('mercari', 'healthy', 5, 30),
    ('openai', 'healthy', 3, 15),
    ('gemini', 'healthy', 3, 15),
    ('claude', 'healthy', 3, 15),
    ('elevenlabs', 'healthy', 3, 15),
    ('midjourney', 'healthy', 3, 15),
    ('supabase', 'healthy', 10, 5),
    ('chatwork', 'healthy', 5, 10)
ON CONFLICT (api_name) DO NOTHING;

-- コメント
COMMENT ON TABLE n3_api_health IS 'Circuit-Breaker: 外部API健全性管理';
COMMENT ON COLUMN n3_api_health.failure_threshold IS '連続失敗閾値（これを超えるとブロック）';
COMMENT ON COLUMN n3_api_health.cooldown_minutes IS 'ブロック解除までの待機時間（分）';

-- ============================================================================
-- 3. Budget Tracker（コスト追跡）
-- ============================================================================
CREATE TABLE IF NOT EXISTS n3_budget_tracker (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- ユーザー情報
    tenant_id VARCHAR(100),
    user_id VARCHAR(100) NOT NULL,
    
    -- サービス・操作
    service VARCHAR(100) NOT NULL,
    -- ebay, amazon, openai, gemini, elevenlabs, etc.
    operation VARCHAR(100),
    workflow_name VARCHAR(255),
    
    -- コスト
    cost DECIMAL(10, 4) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    
    -- 累計（自動計算用）
    daily_total DECIMAL(10, 4) DEFAULT 0,
    monthly_total DECIMAL(10, 4) DEFAULT 0,
    
    -- 日付
    date DATE DEFAULT CURRENT_DATE,
    
    -- メタデータ
    metadata JSONB DEFAULT '{}',
    
    -- タイムスタンプ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_n3_budget_tracker_user ON n3_budget_tracker(user_id);
CREATE INDEX IF NOT EXISTS idx_n3_budget_tracker_date ON n3_budget_tracker(date);
CREATE INDEX IF NOT EXISTS idx_n3_budget_tracker_service ON n3_budget_tracker(service);
CREATE INDEX IF NOT EXISTS idx_n3_budget_tracker_user_date ON n3_budget_tracker(user_id, date DESC);

-- コメント
COMMENT ON TABLE n3_budget_tracker IS 'Burn-Limit: APIコスト追跡';

-- ============================================================================
-- 4. Burn Limits（上限設定）- 既存テーブルがない場合のみ作成
-- ============================================================================
CREATE TABLE IF NOT EXISTS n3_burn_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- ユーザー情報
    tenant_id VARCHAR(100),
    user_id VARCHAR(100) NOT NULL UNIQUE,
    
    -- 上限設定
    daily_limit DECIMAL(10, 2) DEFAULT 100.00,
    monthly_limit DECIMAL(10, 2) DEFAULT 1000.00,
    
    -- アラート閾値（%）
    alert_threshold_percent INTEGER DEFAULT 80 CHECK (alert_threshold_percent >= 0 AND alert_threshold_percent <= 100),
    
    -- 状態
    is_active BOOLEAN DEFAULT true,
    
    -- タイムスタンプ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- コメント
COMMENT ON TABLE n3_burn_limits IS 'ユーザー別コスト上限設定';

-- ============================================================================
-- 5. Audit Logs（監査ログ）- Decision-Trace用拡張
-- ============================================================================
CREATE TABLE IF NOT EXISTS n3_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- コンテキスト
    tenant_id VARCHAR(100),
    user_id VARCHAR(100),
    workflow_name VARCHAR(255) NOT NULL,
    job_id UUID,
    
    -- アクション
    action VARCHAR(100) NOT NULL,
    
    -- データ
    request_data JSONB,
    response_data JSONB,
    
    -- 実行情報
    execution_time_ms INTEGER,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    error_code VARCHAR(50),
    
    -- 改ざん防止ハッシュ
    log_hash VARCHAR(64) NOT NULL,
    previous_hash VARCHAR(64), -- チェーン用（オプション）
    
    -- メタデータ
    timezone VARCHAR(50) DEFAULT 'Asia/Tokyo',
    client_ip VARCHAR(50),
    user_agent TEXT,
    
    -- タイムスタンプ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_n3_audit_logs_workflow ON n3_audit_logs(workflow_name);
CREATE INDEX IF NOT EXISTS idx_n3_audit_logs_job ON n3_audit_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_n3_audit_logs_user ON n3_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_n3_audit_logs_created ON n3_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_n3_audit_logs_hash ON n3_audit_logs(log_hash);

-- コメント
COMMENT ON TABLE n3_audit_logs IS 'Decision-Trace: 法廷耐性監査ログ';
COMMENT ON COLUMN n3_audit_logs.log_hash IS 'SHA256ハッシュ - 改ざん検知用';

-- ============================================================================
-- 6. 統計ビュー（ダッシュボード用）
-- ============================================================================

-- 日次実行統計ビュー
CREATE OR REPLACE VIEW v_n3_daily_execution_stats AS
SELECT 
    DATE(created_at) as date,
    workflow_name,
    COUNT(*) as total_executions,
    COUNT(*) FILTER (WHERE status = 'done') as successful,
    COUNT(*) FILTER (WHERE status = 'failed') as failed,
    AVG(execution_time_ms) as avg_duration_ms,
    MAX(execution_time_ms) as max_duration_ms,
    MIN(execution_time_ms) as min_duration_ms
FROM n3_job_queue
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at), workflow_name
ORDER BY date DESC, total_executions DESC;

-- API健全性サマリービュー
CREATE OR REPLACE VIEW v_n3_api_health_summary AS
SELECT 
    api_name,
    status,
    fail_count,
    success_count,
    CASE 
        WHEN success_count + fail_count = 0 THEN 100
        ELSE ROUND((success_count::decimal / (success_count + fail_count)) * 100, 2)
    END as success_rate,
    blocked_until,
    CASE 
        WHEN blocked_until IS NOT NULL AND blocked_until > NOW() 
        THEN EXTRACT(EPOCH FROM (blocked_until - NOW())) / 60
        ELSE 0
    END as minutes_until_recovery,
    last_success,
    last_fail,
    last_error
FROM n3_api_health
ORDER BY 
    CASE status WHEN 'blocked' THEN 1 WHEN 'degraded' THEN 2 ELSE 3 END,
    api_name;

-- 日次コストサマリービュー
CREATE OR REPLACE VIEW v_n3_daily_cost_summary AS
SELECT 
    user_id,
    service,
    date,
    SUM(cost) as total_cost,
    COUNT(*) as operation_count
FROM n3_budget_tracker
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY user_id, service, date
ORDER BY date DESC, total_cost DESC;

-- キュー状態サマリービュー
CREATE OR REPLACE VIEW v_n3_queue_status AS
SELECT 
    status,
    COUNT(*) as count,
    MIN(created_at) as oldest,
    MAX(created_at) as newest,
    AVG(EXTRACT(EPOCH FROM (NOW() - created_at))) as avg_age_seconds
FROM n3_job_queue
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY status;

-- ============================================================================
-- 7. RPC Functions（Supabase RPC）
-- ============================================================================

-- ジョブキューに追加（同時実行数チェック付き）
CREATE OR REPLACE FUNCTION n3_enqueue_job(
    p_workflow_name VARCHAR,
    p_payload JSONB,
    p_user_id VARCHAR,
    p_priority INTEGER DEFAULT 5,
    p_tenant_id VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    job_id UUID,
    status VARCHAR,
    can_execute_now BOOLEAN,
    queue_position INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_job_id UUID;
    v_running_count INTEGER;
    v_queue_position INTEGER;
BEGIN
    -- ジョブ挿入
    INSERT INTO n3_job_queue (
        workflow_name, payload, created_by, priority, tenant_id, status
    ) VALUES (
        p_workflow_name, p_payload, p_user_id, p_priority, p_tenant_id, 'waiting'
    )
    RETURNING id INTO v_job_id;
    
    -- 実行中ジョブ数カウント
    SELECT COUNT(*) INTO v_running_count
    FROM n3_job_queue
    WHERE status = 'running';
    
    -- キュー位置計算
    SELECT COUNT(*) INTO v_queue_position
    FROM n3_job_queue
    WHERE status = 'waiting'
    AND (priority > p_priority OR (priority = p_priority AND created_at < NOW()));
    
    RETURN QUERY SELECT 
        v_job_id,
        'waiting'::VARCHAR,
        (v_running_count < 10),
        v_queue_position + 1;
END;
$$;

-- Circuit-Breaker: 失敗記録
CREATE OR REPLACE FUNCTION n3_record_api_failure(
    p_api_name VARCHAR,
    p_error_message TEXT DEFAULT NULL,
    p_error_code VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    status VARCHAR,
    fail_count INTEGER,
    blocked BOOLEAN,
    blocked_until TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_current n3_api_health%ROWTYPE;
    v_new_fail_count INTEGER;
    v_blocked_until TIMESTAMP WITH TIME ZONE;
BEGIN
    -- 現在の状態取得（ロック）
    SELECT * INTO v_current
    FROM n3_api_health
    WHERE api_name = p_api_name
    FOR UPDATE;
    
    -- 存在しない場合は作成
    IF NOT FOUND THEN
        INSERT INTO n3_api_health (api_name, fail_count, last_fail, last_error, last_error_code)
        VALUES (p_api_name, 1, NOW(), p_error_message, p_error_code);
        
        RETURN QUERY SELECT 'healthy'::VARCHAR, 1, false, NULL::TIMESTAMP WITH TIME ZONE;
        RETURN;
    END IF;
    
    -- 失敗カウント増加
    v_new_fail_count := v_current.fail_count + 1;
    
    -- 閾値チェック
    IF v_new_fail_count >= v_current.failure_threshold THEN
        v_blocked_until := NOW() + (v_current.cooldown_minutes || ' minutes')::INTERVAL;
        
        UPDATE n3_api_health SET
            fail_count = v_new_fail_count,
            status = 'blocked',
            blocked_until = v_blocked_until,
            block_reason = 'Failure threshold exceeded',
            last_fail = NOW(),
            last_error = p_error_message,
            last_error_code = p_error_code,
            updated_at = NOW()
        WHERE api_name = p_api_name;
        
        RETURN QUERY SELECT 'blocked'::VARCHAR, v_new_fail_count, true, v_blocked_until;
    ELSE
        UPDATE n3_api_health SET
            fail_count = v_new_fail_count,
            status = CASE WHEN v_new_fail_count >= v_current.failure_threshold / 2 THEN 'degraded' ELSE 'healthy' END,
            last_fail = NOW(),
            last_error = p_error_message,
            last_error_code = p_error_code,
            updated_at = NOW()
        WHERE api_name = p_api_name;
        
        RETURN QUERY SELECT 
            CASE WHEN v_new_fail_count >= v_current.failure_threshold / 2 THEN 'degraded' ELSE 'healthy' END::VARCHAR,
            v_new_fail_count,
            false,
            NULL::TIMESTAMP WITH TIME ZONE;
    END IF;
END;
$$;

-- Circuit-Breaker: 成功記録
CREATE OR REPLACE FUNCTION n3_record_api_success(p_api_name VARCHAR)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE n3_api_health SET
        fail_count = 0,
        status = 'healthy',
        success_count = success_count + 1,
        last_success = NOW(),
        blocked_until = NULL,
        block_reason = NULL,
        updated_at = NOW()
    WHERE api_name = p_api_name;
    
    IF NOT FOUND THEN
        INSERT INTO n3_api_health (api_name, status, success_count, last_success)
        VALUES (p_api_name, 'healthy', 1, NOW());
    END IF;
END;
$$;

-- Circuit-Breaker: 状態チェック
CREATE OR REPLACE FUNCTION n3_check_api_health(p_api_name VARCHAR)
RETURNS TABLE (
    status VARCHAR,
    blocked BOOLEAN,
    blocked_until TIMESTAMP WITH TIME ZONE,
    minutes_remaining INTEGER,
    fail_count INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_health n3_api_health%ROWTYPE;
BEGIN
    SELECT * INTO v_health
    FROM n3_api_health
    WHERE api_name = p_api_name;
    
    IF NOT FOUND THEN
        -- 未登録APIは正常とみなす
        RETURN QUERY SELECT 'healthy'::VARCHAR, false, NULL::TIMESTAMP WITH TIME ZONE, 0, 0;
        RETURN;
    END IF;
    
    -- ブロック期限切れチェック
    IF v_health.blocked_until IS NOT NULL AND v_health.blocked_until <= NOW() THEN
        -- 自動回復
        IF v_health.auto_recovery_enabled THEN
            UPDATE n3_api_health SET
                status = 'healthy',
                fail_count = 0,
                blocked_until = NULL,
                block_reason = NULL,
                recovered_at = NOW(),
                updated_at = NOW()
            WHERE api_name = p_api_name;
            
            RETURN QUERY SELECT 'healthy'::VARCHAR, false, NULL::TIMESTAMP WITH TIME ZONE, 0, 0;
            RETURN;
        END IF;
    END IF;
    
    RETURN QUERY SELECT 
        v_health.status,
        (v_health.blocked_until IS NOT NULL AND v_health.blocked_until > NOW()),
        v_health.blocked_until,
        CASE 
            WHEN v_health.blocked_until IS NOT NULL AND v_health.blocked_until > NOW()
            THEN CEIL(EXTRACT(EPOCH FROM (v_health.blocked_until - NOW())) / 60)::INTEGER
            ELSE 0
        END,
        v_health.fail_count;
END;
$$;

-- Burn-Limit: 使用量チェック
CREATE OR REPLACE FUNCTION n3_check_burn_limit(
    p_user_id VARCHAR,
    p_service VARCHAR DEFAULT NULL,
    p_estimated_cost DECIMAL DEFAULT 0
)
RETURNS TABLE (
    burn_ok BOOLEAN,
    daily_used DECIMAL,
    daily_limit DECIMAL,
    daily_remaining DECIMAL,
    monthly_used DECIMAL,
    monthly_limit DECIMAL,
    monthly_remaining DECIMAL,
    warning_level VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_limits n3_burn_limits%ROWTYPE;
    v_daily_used DECIMAL;
    v_monthly_used DECIMAL;
    v_daily_percent DECIMAL;
    v_monthly_percent DECIMAL;
BEGIN
    -- 上限設定取得
    SELECT * INTO v_limits
    FROM n3_burn_limits
    WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
        -- デフォルト設定
        v_limits.daily_limit := 100.00;
        v_limits.monthly_limit := 1000.00;
        v_limits.alert_threshold_percent := 80;
    END IF;
    
    -- 日次使用量
    SELECT COALESCE(SUM(cost), 0) INTO v_daily_used
    FROM n3_budget_tracker
    WHERE user_id = p_user_id
    AND date = CURRENT_DATE
    AND (p_service IS NULL OR service = p_service);
    
    -- 月次使用量
    SELECT COALESCE(SUM(cost), 0) INTO v_monthly_used
    FROM n3_budget_tracker
    WHERE user_id = p_user_id
    AND date >= DATE_TRUNC('month', CURRENT_DATE)
    AND (p_service IS NULL OR service = p_service);
    
    -- パーセント計算
    v_daily_percent := ((v_daily_used + p_estimated_cost) / v_limits.daily_limit) * 100;
    v_monthly_percent := ((v_monthly_used + p_estimated_cost) / v_limits.monthly_limit) * 100;
    
    RETURN QUERY SELECT 
        (v_daily_used + p_estimated_cost <= v_limits.daily_limit 
         AND v_monthly_used + p_estimated_cost <= v_limits.monthly_limit),
        v_daily_used,
        v_limits.daily_limit,
        v_limits.daily_limit - v_daily_used,
        v_monthly_used,
        v_limits.monthly_limit,
        v_limits.monthly_limit - v_monthly_used,
        CASE 
            WHEN v_daily_percent >= 100 OR v_monthly_percent >= 100 THEN 'exceeded'
            WHEN v_daily_percent >= v_limits.alert_threshold_percent 
                 OR v_monthly_percent >= v_limits.alert_threshold_percent THEN 'warning'
            ELSE 'ok'
        END::VARCHAR;
END;
$$;

-- Burn-Limit: コスト記録
CREATE OR REPLACE FUNCTION n3_record_cost(
    p_user_id VARCHAR,
    p_service VARCHAR,
    p_cost DECIMAL,
    p_operation VARCHAR DEFAULT NULL,
    p_workflow_name VARCHAR DEFAULT NULL,
    p_tenant_id VARCHAR DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO n3_budget_tracker (
        user_id, tenant_id, service, operation, workflow_name, cost, date
    ) VALUES (
        p_user_id, p_tenant_id, p_service, p_operation, p_workflow_name, p_cost, CURRENT_DATE
    );
END;
$$;

-- 次の待機ジョブ取得（Worker用）
CREATE OR REPLACE FUNCTION n3_get_next_jobs(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    job_id UUID,
    workflow_name VARCHAR,
    payload JSONB,
    priority INTEGER,
    created_by VARCHAR,
    tenant_id VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_running_count INTEGER;
    v_available_slots INTEGER;
BEGIN
    -- 実行中ジョブ数
    SELECT COUNT(*) INTO v_running_count
    FROM n3_job_queue
    WHERE status = 'running';
    
    v_available_slots := GREATEST(0, 10 - v_running_count);
    
    IF v_available_slots = 0 THEN
        RETURN;
    END IF;
    
    -- 待機ジョブを取得してrunningに更新
    RETURN QUERY
    WITH next_jobs AS (
        SELECT q.id, q.workflow_name, q.payload, q.priority, q.created_by, q.tenant_id
        FROM n3_job_queue q
        WHERE q.status = 'waiting'
        ORDER BY q.priority DESC, q.created_at ASC
        LIMIT LEAST(v_available_slots, p_limit)
        FOR UPDATE SKIP LOCKED
    )
    UPDATE n3_job_queue SET
        status = 'running',
        started_at = NOW()
    FROM next_jobs
    WHERE n3_job_queue.id = next_jobs.id
    RETURNING next_jobs.id, next_jobs.workflow_name, next_jobs.payload, 
              next_jobs.priority, next_jobs.created_by, next_jobs.tenant_id;
END;
$$;

-- ジョブ完了更新
CREATE OR REPLACE FUNCTION n3_complete_job(
    p_job_id UUID,
    p_success BOOLEAN,
    p_result JSONB DEFAULT NULL,
    p_error_message TEXT DEFAULT NULL,
    p_error_code VARCHAR DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_started_at TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT started_at INTO v_started_at
    FROM n3_job_queue
    WHERE id = p_job_id;
    
    UPDATE n3_job_queue SET
        status = CASE WHEN p_success THEN 'done' ELSE 'failed' END,
        finished_at = NOW(),
        result = p_result,
        error_message = p_error_message,
        error_code = p_error_code,
        execution_time_ms = EXTRACT(EPOCH FROM (NOW() - v_started_at)) * 1000
    WHERE id = p_job_id;
END;
$$;

-- ============================================================================
-- 8. トリガー（自動更新）
-- ============================================================================

-- updated_at自動更新トリガー関数
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
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_n3_api_health_updated_at') THEN
        CREATE TRIGGER update_n3_api_health_updated_at
            BEFORE UPDATE ON n3_api_health
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_n3_burn_limits_updated_at') THEN
        CREATE TRIGGER update_n3_burn_limits_updated_at
            BEFORE UPDATE ON n3_burn_limits
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END;
$$;

-- ============================================================================
-- 9. 古いデータのクリーンアップ（定期実行用）
-- ============================================================================

-- 古いジョブキューデータを削除
CREATE OR REPLACE FUNCTION n3_cleanup_old_jobs(p_days INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    WITH deleted AS (
        DELETE FROM n3_job_queue
        WHERE status IN ('done', 'failed', 'cancelled')
        AND finished_at < NOW() - (p_days || ' days')::INTERVAL
        RETURNING id
    )
    SELECT COUNT(*) INTO v_deleted FROM deleted;
    
    RETURN v_deleted;
END;
$$;

-- 古い監査ログを削除
CREATE OR REPLACE FUNCTION n3_cleanup_old_audit_logs(p_days INTEGER DEFAULT 90)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    WITH deleted AS (
        DELETE FROM n3_audit_logs
        WHERE created_at < NOW() - (p_days || ' days')::INTERVAL
        RETURNING id
    )
    SELECT COUNT(*) INTO v_deleted FROM deleted;
    
    RETURN v_deleted;
END;
$$;

-- 古いコスト追跡データを削除
CREATE OR REPLACE FUNCTION n3_cleanup_old_budget_data(p_days INTEGER DEFAULT 365)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    WITH deleted AS (
        DELETE FROM n3_budget_tracker
        WHERE created_at < NOW() - (p_days || ' days')::INTERVAL
        RETURNING id
    )
    SELECT COUNT(*) INTO v_deleted FROM deleted;
    
    RETURN v_deleted;
END;
$$;

-- ============================================================================
-- 完了
-- ============================================================================
SELECT 'N3 Empire OS V8.3 SQL Schema created successfully' as message;
