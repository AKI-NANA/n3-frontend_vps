-- ============================================================================
-- N3 Empire OS V8.2.1: 既存スキーマ対応パッチ
-- 
-- 既存のcore.tenantsテーブルがある場合の互換性対応
-- このファイルを先に実行してから、01_V8.2.1_FINAL_MIGRATION.sqlを実行
-- 
-- 作成日: 2026-01-24
-- ============================================================================

-- ============================================================================
-- PART 0: スキーマ作成（存在しない場合のみ）
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS commerce;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS audit;

-- ============================================================================
-- PART 1: 既存テーブルへのカラム追加（存在しない場合のみ）
-- ============================================================================

-- core.tenants に不足カラムを追加
DO $$
BEGIN
    -- tenant_name カラム
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'core' AND table_name = 'tenants' AND column_name = 'tenant_name') THEN
        ALTER TABLE core.tenants ADD COLUMN tenant_name TEXT;
        UPDATE core.tenants SET tenant_name = tenant_code WHERE tenant_name IS NULL;
    END IF;
    
    -- night_shift_enabled カラム
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'core' AND table_name = 'tenants' AND column_name = 'night_shift_enabled') THEN
        ALTER TABLE core.tenants ADD COLUMN night_shift_enabled BOOLEAN DEFAULT false;
    END IF;
    
    -- night_shift_start カラム
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'core' AND table_name = 'tenants' AND column_name = 'night_shift_start') THEN
        ALTER TABLE core.tenants ADD COLUMN night_shift_start TIME DEFAULT '02:00';
    END IF;
    
    -- night_shift_end カラム
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'core' AND table_name = 'tenants' AND column_name = 'night_shift_end') THEN
        ALTER TABLE core.tenants ADD COLUMN night_shift_end TIME DEFAULT '05:00';
    END IF;
    
    -- night_shift_timezone カラム
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'core' AND table_name = 'tenants' AND column_name = 'night_shift_timezone') THEN
        ALTER TABLE core.tenants ADD COLUMN night_shift_timezone TEXT DEFAULT 'Asia/Tokyo';
    END IF;
    
    -- cost_save_mode カラム
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'core' AND table_name = 'tenants' AND column_name = 'cost_save_mode') THEN
        ALTER TABLE core.tenants ADD COLUMN cost_save_mode TEXT DEFAULT 'balanced';
    END IF;
    
    -- default_ai_model カラム
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'core' AND table_name = 'tenants' AND column_name = 'default_ai_model') THEN
        ALTER TABLE core.tenants ADD COLUMN default_ai_model TEXT DEFAULT 'gpt-4o-mini';
    END IF;
    
    -- premium_ai_model カラム
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'core' AND table_name = 'tenants' AND column_name = 'premium_ai_model') THEN
        ALTER TABLE core.tenants ADD COLUMN premium_ai_model TEXT DEFAULT 'gpt-4o';
    END IF;
    
    -- daily_api_limit カラム
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'core' AND table_name = 'tenants' AND column_name = 'daily_api_limit') THEN
        ALTER TABLE core.tenants ADD COLUMN daily_api_limit INTEGER DEFAULT 10000;
    END IF;
    
    -- monthly_api_limit カラム
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'core' AND table_name = 'tenants' AND column_name = 'monthly_api_limit') THEN
        ALTER TABLE core.tenants ADD COLUMN monthly_api_limit INTEGER DEFAULT 300000;
    END IF;
    
    -- daily_api_used カラム
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'core' AND table_name = 'tenants' AND column_name = 'daily_api_used') THEN
        ALTER TABLE core.tenants ADD COLUMN daily_api_used INTEGER DEFAULT 0;
    END IF;
    
    -- monthly_api_used カラム
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'core' AND table_name = 'tenants' AND column_name = 'monthly_api_used') THEN
        ALTER TABLE core.tenants ADD COLUMN monthly_api_used INTEGER DEFAULT 0;
    END IF;
    
    RAISE NOTICE 'core.tenants カラム追加完了';
END $$;

-- ============================================================================
-- PART 2: 新規テーブル作成（V8.2.1固有）
-- ============================================================================

-- リスクレベル定義
CREATE TABLE IF NOT EXISTS core.risk_level_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_pattern TEXT NOT NULL,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MID', 'HIGH', 'CRITICAL')),
    skip_policy_validator BOOLEAN DEFAULT false,
    skip_hitl BOOLEAN DEFAULT false,
    skip_evidence BOOLEAN DEFAULT false,
    require_async_audit BOOLEAN DEFAULT true,
    use_premium_model BOOLEAN DEFAULT false,
    conditions JSONB DEFAULT '{}',
    description TEXT,
    priority INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Night-Shift キュー
CREATE TABLE IF NOT EXISTS core.night_shift_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    request_id TEXT NOT NULL UNIQUE,
    workflow_name TEXT NOT NULL,
    action TEXT NOT NULL,
    payload JSONB NOT NULL,
    queued_at TIMESTAMPTZ DEFAULT NOW(),
    scheduled_for TIMESTAMPTZ NOT NULL,
    priority INTEGER DEFAULT 100,
    is_urgent BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'error', 'cancelled')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    result JSONB,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    estimated_cost NUMERIC(10,4),
    actual_cost NUMERIC(10,4),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_night_shift_queue_scheduled ON core.night_shift_queue(scheduled_for) WHERE status = 'queued';

-- HR Staff（外注スタッフ）
CREATE TABLE IF NOT EXISTS core.hr_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    staff_code TEXT NOT NULL,
    display_name TEXT NOT NULL,
    email TEXT,
    contract_type TEXT NOT NULL CHECK (contract_type IN ('outsource', 'part_time', 'contractor', 'full_time')),
    contract_start DATE NOT NULL DEFAULT CURRENT_DATE,
    contract_end DATE,
    payment_type TEXT NOT NULL DEFAULT 'task_based' CHECK (payment_type IN ('hourly', 'task_based', 'fixed_monthly', 'commission')),
    base_rate NUMERIC(10,2),
    currency TEXT DEFAULT 'JPY',
    daily_task_limit INTEGER DEFAULT 100,
    monthly_hours_limit NUMERIC(6,2) DEFAULT 160,
    monthly_payment_cap NUMERIC(12,2),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'terminated')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- HR Roles（権限ロール）
CREATE TABLE IF NOT EXISTS core.hr_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    role_code TEXT NOT NULL,
    role_name TEXT NOT NULL,
    permissions JSONB NOT NULL DEFAULT '{}',
    allowed_nodes JSONB DEFAULT '[]',
    blocked_nodes JSONB DEFAULT '[]',
    hierarchy_level INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- HR Staff Roles（紐付け）
CREATE TABLE IF NOT EXISTS core.hr_staff_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES core.hr_staff(id) ON DELETE CASCADE,
    role_id UUID REFERENCES core.hr_roles(id) ON DELETE CASCADE,
    valid_from DATE DEFAULT CURRENT_DATE,
    valid_until DATE,
    assigned_by TEXT,
    assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PART 3: commerce スキーマ
-- ============================================================================

-- 古物商許可
CREATE TABLE IF NOT EXISTS commerce.dealer_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    license_number TEXT NOT NULL,
    license_authority TEXT NOT NULL,
    license_date DATE NOT NULL,
    license_expiry DATE,
    business_name TEXT NOT NULL,
    representative_name TEXT,
    business_address TEXT NOT NULL,
    business_phone TEXT,
    handling_categories JSONB DEFAULT '[]',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'revoked', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 古物台帳
CREATE TABLE IF NOT EXISTS commerce.dealer_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    license_id UUID REFERENCES commerce.dealer_licenses(id),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'exchange', 'consignment', 'sale', 'return')),
    transaction_date DATE NOT NULL,
    transaction_time TIME,
    item_category TEXT NOT NULL,
    item_name TEXT NOT NULL,
    item_description TEXT,
    item_serial_number TEXT,
    item_quantity INTEGER NOT NULL DEFAULT 1,
    item_unit_price NUMERIC(12,2) NOT NULL,
    item_total_price NUMERIC(12,2) NOT NULL,
    counterparty_required BOOLEAN DEFAULT false,
    counterparty_name TEXT,
    counterparty_address TEXT,
    counterparty_dob DATE,
    counterparty_occupation TEXT,
    counterparty_id_type TEXT,
    counterparty_id_number_hash TEXT,
    verification_method TEXT CHECK (verification_method IN ('face_to_face', 'delivery_confirmation', 'electronic', 'other')),
    verification_details JSONB DEFAULT '{}',
    product_master_id UUID,
    source_platform TEXT,
    source_transaction_id TEXT,
    evidence_ids UUID[] DEFAULT '{}',
    record_hash TEXT,
    recorded_by TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dealer_ledger_date ON commerce.dealer_ledger(transaction_date DESC);

-- ============================================================================
-- PART 4: finance スキーマ
-- ============================================================================

-- 勘定科目
CREATE TABLE IF NOT EXISTS finance.chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    account_code TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_name_en TEXT,
    account_type TEXT NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense', 'contra')),
    account_category TEXT,
    account_subcategory TEXT,
    normal_balance TEXT NOT NULL CHECK (normal_balance IN ('debit', 'credit')),
    tax_category TEXT DEFAULT 'taxable' CHECK (tax_category IN ('taxable', 'non_taxable', 'exempt', 'tax_free')),
    mf_account_code TEXT,
    mf_sub_account_code TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 仕訳
CREATE TABLE IF NOT EXISTS finance.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    journal_number TEXT NOT NULL,
    fiscal_year INTEGER NOT NULL,
    fiscal_period INTEGER,
    entry_date DATE NOT NULL,
    posting_date DATE,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('normal', 'adjusting', 'closing', 'opening', 'reversal', 'correction')),
    description TEXT NOT NULL,
    description_detail TEXT,
    total_debit NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_credit NUMERIC(15,2) NOT NULL DEFAULT 0,
    source_type TEXT CHECK (source_type IN ('sales', 'purchase', 'expense', 'bank', 'adjustment', 'manual', 'import')),
    source_id TEXT,
    source_platform TEXT,
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('draft', 'pending', 'approved', 'rejected', 'posted', 'auto_approved')),
    approval_required BOOLEAN DEFAULT false,
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    is_auto_generated BOOLEAN DEFAULT false,
    generation_rule_id UUID,
    ai_reasoning JSONB DEFAULT '{}',
    ai_model_used TEXT,
    mf_journal_id TEXT,
    mf_sync_status TEXT DEFAULT 'pending' CHECK (mf_sync_status IN ('pending', 'synced', 'error', 'skipped')),
    mf_sync_at TIMESTAMPTZ,
    mf_sync_error TEXT,
    evidence_ids UUID[] DEFAULT '{}',
    record_hash TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 仕訳明細
CREATE TABLE IF NOT EXISTS finance.journal_entry_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_entry_id UUID NOT NULL REFERENCES finance.journal_entries(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    account_id UUID,
    account_code TEXT NOT NULL,
    account_name TEXT NOT NULL,
    sub_account_code TEXT,
    sub_account_name TEXT,
    debit_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    credit_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    currency_code TEXT DEFAULT 'JPY',
    exchange_rate NUMERIC(10,4) DEFAULT 1.0,
    foreign_amount NUMERIC(15,2),
    tax_category TEXT DEFAULT 'taxable',
    tax_rate NUMERIC(5,2) DEFAULT 10.00,
    tax_amount NUMERIC(15,2) DEFAULT 0,
    tax_included BOOLEAN DEFAULT true,
    department_code TEXT,
    project_code TEXT,
    line_description TEXT,
    counterparty_code TEXT,
    counterparty_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 自動仕訳ルール
CREATE TABLE IF NOT EXISTS finance.auto_journal_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    rule_name TEXT NOT NULL,
    rule_description TEXT,
    priority INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    match_conditions JSONB NOT NULL,
    journal_template JSONB NOT NULL,
    auto_approve_threshold NUMERIC(15,2) DEFAULT 10000,
    always_require_approval BOOLEAN DEFAULT false,
    use_premium_model BOOLEAN DEFAULT false,
    execution_count INTEGER DEFAULT 0,
    last_executed_at TIMESTAMPTZ,
    error_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 銀行明細
CREATE TABLE IF NOT EXISTS finance.bank_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    bank_code TEXT,
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    account_name TEXT,
    transaction_date DATE NOT NULL,
    value_date DATE,
    transaction_type TEXT CHECK (transaction_type IN ('deposit', 'withdrawal')),
    amount NUMERIC(15,2) NOT NULL,
    balance_after NUMERIC(15,2),
    description TEXT,
    counterparty TEXT,
    reference_number TEXT,
    mf_transaction_id TEXT,
    mf_category TEXT,
    mf_memo TEXT,
    matching_status TEXT DEFAULT 'unmatched' CHECK (matching_status IN ('unmatched', 'auto_matched', 'manual_matched', 'excluded', 'suspicious')),
    matched_journal_id UUID,
    matched_at TIMESTAMPTZ,
    matched_by TEXT,
    ai_suggestions JSONB DEFAULT '[]',
    ai_category_guess TEXT,
    ai_confidence NUMERIC(5,2),
    ai_model_used TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PART 5: audit スキーマ
-- ============================================================================

-- 証跡登録簿
CREATE TABLE IF NOT EXISTS audit.evidence_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    evidence_type TEXT NOT NULL CHECK (evidence_type IN (
        'screenshot', 'pdf', 'email', 'receipt', 'invoice', 'contract',
        'bank_statement', 'shipping_label', 'customs_form', 'id_verification',
        'api_response', 'chat_log', 'other'
    )),
    title TEXT NOT NULL,
    description TEXT,
    file_name TEXT,
    file_path TEXT,
    file_size_bytes BIGINT,
    mime_type TEXT,
    file_hash_sha256 TEXT NOT NULL,
    metadata_hash TEXT,
    evidence_timestamp TIMESTAMPTZ NOT NULL,
    timestamp_authority TEXT,
    timestamp_token TEXT,
    related_entity_type TEXT,
    related_entity_id UUID,
    tags TEXT[] DEFAULT '{}',
    official_format TEXT CHECK (official_format IN (
        'police_kobutsu', 'tax_blue', 'tax_expense', 'customs_import', 'customs_export', 'mf_journal', 'generic'
    )),
    retention_required_until DATE,
    retention_reason TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted', 'submitted')),
    ai_extraction JSONB DEFAULT '{}',
    ai_classification JSONB DEFAULT '{}',
    ai_confidence NUMERIC(5,2),
    access_log JSONB DEFAULT '[]',
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 監査ログ
CREATE TABLE IF NOT EXISTS audit.logs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID,
    workflow_name TEXT NOT NULL,
    request_id TEXT NOT NULL,
    action TEXT NOT NULL,
    risk_level TEXT DEFAULT 'LOW' CHECK (risk_level IN ('LOW', 'MID', 'HIGH', 'CRITICAL')),
    payload_masked JSONB DEFAULT '{}',
    policies_triggered JSONB DEFAULT '[]',
    status TEXT NOT NULL CHECK (status IN ('success', 'error', 'pending', 'cancelled', 'async_pending')),
    error_message TEXT,
    error_details JSONB,
    execution_time_ms INTEGER,
    ai_model_used TEXT,
    api_cost NUMERIC(10,4),
    is_async BOOLEAN DEFAULT false,
    async_completed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_date ON audit.logs(tenant_id, executed_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_request_id ON audit.logs(request_id);

-- 承認キュー
CREATE TABLE IF NOT EXISTS audit.approval_queue (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID,
    workflow_name TEXT NOT NULL,
    request_id TEXT NOT NULL UNIQUE,
    payload JSONB NOT NULL DEFAULT '{}',
    risk_level TEXT NOT NULL DEFAULT 'MID' CHECK (risk_level IN ('LOW', 'MID', 'HIGH', 'CRITICAL')),
    policies JSONB NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'auto_approved')),
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
    notification_sent BOOLEAN DEFAULT false,
    notification_channel TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- エラー復旧ログ
CREATE TABLE IF NOT EXISTS audit.error_recovery_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    original_request_id TEXT NOT NULL,
    workflow_name TEXT NOT NULL,
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    recovery_strategy TEXT NOT NULL CHECK (recovery_strategy IN ('retry', 'fallback', 'notify', 'manual')),
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    recovery_status TEXT DEFAULT 'pending' CHECK (recovery_status IN ('pending', 'success', 'failed', 'escalated')),
    recovery_result JSONB,
    sentinel_ticket_id TEXT,
    sentinel_analysis JSONB,
    notification_sent BOOLEAN DEFAULT false,
    notification_channel TEXT,
    notification_recipient TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- ============================================================================
-- PART 6: 初期データ挿入（重複スキップ）
-- ============================================================================

-- デフォルトリスクレベル定義
INSERT INTO core.risk_level_definitions (action_pattern, risk_level, skip_policy_validator, skip_hitl, skip_evidence, use_premium_model, description, priority)
SELECT * FROM (VALUES
    ('read.*', 'LOW', true, true, true, false, '読み取り操作', 10),
    ('get.*', 'LOW', true, true, true, false, '取得操作', 10),
    ('list.*', 'LOW', true, true, true, false, '一覧取得', 10),
    ('search.*', 'LOW', true, true, true, false, '検索操作', 10),
    ('status.*', 'LOW', true, true, true, false, 'ステータス確認', 10),
    ('update.*', 'MID', false, true, false, false, '更新操作', 50),
    ('create.*', 'MID', false, true, false, false, '作成操作', 50),
    ('listing.single', 'MID', false, true, false, false, '単品出品', 50),
    ('inventory.sync', 'MID', false, true, false, false, '在庫同期', 50),
    ('delete.*', 'HIGH', false, false, false, true, '削除操作', 80),
    ('listing.bulk', 'HIGH', false, false, false, true, 'バルク出品', 80),
    ('price.bulk_update', 'HIGH', false, false, false, true, '一括価格変更', 80),
    ('payment.process', 'HIGH', false, false, false, true, '支払い処理', 80),
    ('payment.large', 'CRITICAL', false, false, false, true, '高額決済', 100),
    ('account.delete', 'CRITICAL', false, false, false, true, 'アカウント削除', 100),
    ('export.bulk_data', 'CRITICAL', false, false, false, true, '大量データエクスポート', 100)
) AS v(action_pattern, risk_level, skip_policy_validator, skip_hitl, skip_evidence, use_premium_model, description, priority)
WHERE NOT EXISTS (SELECT 1 FROM core.risk_level_definitions WHERE action_pattern = v.action_pattern);

-- デフォルトロール
INSERT INTO core.hr_roles (tenant_id, role_code, role_name, permissions, hierarchy_level)
SELECT NULL, v.role_code, v.role_name, v.permissions::jsonb, v.hierarchy_level
FROM (VALUES
    ('SUPER_ADMIN', 'スーパー管理者', '{"allowed_actions": ["*"], "blocked_actions": [], "max_batch_size": 9999}', 0),
    ('ADMIN', '管理者', '{"allowed_actions": ["*"], "blocked_actions": ["account.delete"], "max_batch_size": 500}', 1),
    ('MANAGER', 'マネージャー', '{"allowed_actions": ["read.*", "listing.*", "inventory.*"], "blocked_actions": ["delete.*"], "max_batch_size": 200}', 2),
    ('OPERATOR', 'オペレーター', '{"allowed_actions": ["read.*", "listing.single"], "blocked_actions": ["delete.*", "payment.*"], "max_batch_size": 50}', 3),
    ('VIEWER', '閲覧者', '{"allowed_actions": ["read.*"], "blocked_actions": ["*"], "max_batch_size": 0}', 4)
) AS v(role_code, role_name, permissions, hierarchy_level)
WHERE NOT EXISTS (SELECT 1 FROM core.hr_roles WHERE role_code = v.role_code);

-- 非同期監査ログ関数
CREATE OR REPLACE FUNCTION audit.log_async(
    p_tenant_id UUID,
    p_workflow_name TEXT,
    p_request_id TEXT,
    p_action TEXT,
    p_risk_level TEXT,
    p_payload JSONB,
    p_status TEXT,
    p_ai_model TEXT DEFAULT NULL,
    p_api_cost NUMERIC DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
    v_log_id BIGINT;
BEGIN
    INSERT INTO audit.logs (
        tenant_id, workflow_name, request_id, action, risk_level,
        payload_masked, status, ai_model_used, api_cost, is_async
    ) VALUES (
        p_tenant_id, p_workflow_name, p_request_id, p_action, p_risk_level,
        p_payload, p_status, p_ai_model, p_api_cost, true
    )
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- V8.2.1 パッチ完了
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'N3 Empire OS V8.2.1 パッチ適用完了';
    RAISE NOTICE '============================================';
END $$;
