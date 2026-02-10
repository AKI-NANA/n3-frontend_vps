-- ============================================================================
-- N3 Empire OS V8.2.1: 最終統合マイグレーション
-- 
-- 【設計思想】堅牢・軽快・安価
-- - 4スキーマ物理隔離（core, commerce, finance, audit）
-- - 36次元技術防衛完全準拠
-- - Smart Risk-Leveling対応
-- - Night-Shift & Cost-Save対応
-- 
-- 作成日: 2026-01-24
-- バージョン: V8.2.1-FINAL
-- ============================================================================

-- ============================================================================
-- PART 0: スキーマ作成（物理隔離）
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS core;      -- コア機能（認証・権限・設定）
CREATE SCHEMA IF NOT EXISTS commerce;  -- 商取引（古物台帳・在庫・出品）
CREATE SCHEMA IF NOT EXISTS finance;   -- 財務（仕訳・入出金・突合）
CREATE SCHEMA IF NOT EXISTS audit;     -- 監査（ログ・証跡・承認）

-- スキーマ間の参照権限設定
GRANT USAGE ON SCHEMA core TO authenticated;
GRANT USAGE ON SCHEMA commerce TO authenticated;
GRANT USAGE ON SCHEMA finance TO authenticated;
GRANT USAGE ON SCHEMA audit TO authenticated;

-- ============================================================================
-- PART 1: core スキーマ - 認証・権限・設定
-- ============================================================================

-- -----------------------------------------------------------------------------
-- 1.1 テナント設定（マルチテナント対応）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code TEXT NOT NULL UNIQUE,
    tenant_name TEXT NOT NULL,
    
    -- Night-Shift設定
    night_shift_enabled BOOLEAN DEFAULT false,
    night_shift_start TIME DEFAULT '02:00',
    night_shift_end TIME DEFAULT '05:00',
    night_shift_timezone TEXT DEFAULT 'Asia/Tokyo',
    
    -- Cost-Save設定
    cost_save_mode TEXT DEFAULT 'balanced' CHECK (cost_save_mode IN ('performance', 'balanced', 'economy')),
    default_ai_model TEXT DEFAULT 'gpt-4o-mini',
    premium_ai_model TEXT DEFAULT 'gpt-4o',
    
    -- クォータ設定
    daily_api_limit INTEGER DEFAULT 10000,
    monthly_api_limit INTEGER DEFAULT 300000,
    daily_api_used INTEGER DEFAULT 0,
    monthly_api_used INTEGER DEFAULT 0,
    
    -- ステータス
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 1.2 リスクレベル定義マスター
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.risk_level_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    action_pattern TEXT NOT NULL,           -- 'listing.*', 'payment.*', 'read.*'
    risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MID', 'HIGH', 'CRITICAL')),
    
    -- 処理パス設定
    skip_policy_validator BOOLEAN DEFAULT false,
    skip_hitl BOOLEAN DEFAULT false,
    skip_evidence BOOLEAN DEFAULT false,
    require_async_audit BOOLEAN DEFAULT true,
    
    -- AI Model設定
    use_premium_model BOOLEAN DEFAULT false,
    
    -- 条件（JSONB）
    conditions JSONB DEFAULT '{}',
    -- { "amount_threshold": 100000, "batch_threshold": 50 }
    
    description TEXT,
    priority INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- デフォルトリスクレベル定義
INSERT INTO core.risk_level_definitions (action_pattern, risk_level, skip_policy_validator, skip_hitl, skip_evidence, use_premium_model, description, priority) VALUES
    -- LOW: 情報取得系（爆速パス）
    ('read.*', 'LOW', true, true, true, false, '読み取り操作 - 検閲スキップ', 10),
    ('get.*', 'LOW', true, true, true, false, '取得操作 - 検閲スキップ', 10),
    ('list.*', 'LOW', true, true, true, false, '一覧取得 - 検閲スキップ', 10),
    ('search.*', 'LOW', true, true, true, false, '検索操作 - 検閲スキップ', 10),
    ('status.*', 'LOW', true, true, true, false, 'ステータス確認 - 検閲スキップ', 10),
    
    -- MID: 一般的な更新操作
    ('update.*', 'MID', false, true, false, false, '更新操作 - Policy検閲あり', 50),
    ('create.*', 'MID', false, true, false, false, '作成操作 - Policy検閲あり', 50),
    ('listing.single', 'MID', false, true, false, false, '単品出品 - Policy検閲あり', 50),
    ('inventory.sync', 'MID', false, true, false, false, '在庫同期 - Policy検閲あり', 50),
    
    -- HIGH: 重要な操作
    ('delete.*', 'HIGH', false, false, false, true, '削除操作 - フルガード', 80),
    ('listing.bulk', 'HIGH', false, false, false, true, 'バルク出品 - フルガード', 80),
    ('price.bulk_update', 'HIGH', false, false, false, true, '一括価格変更 - フルガード', 80),
    ('payment.process', 'HIGH', false, false, false, true, '支払い処理 - フルガード', 80),
    
    -- CRITICAL: 最重要操作（40次元フルガード）
    ('payment.large', 'CRITICAL', false, false, false, true, '高額決済 - 40次元フルガード', 100),
    ('account.delete', 'CRITICAL', false, false, false, true, 'アカウント削除 - 40次元フルガード', 100),
    ('export.bulk_data', 'CRITICAL', false, false, false, true, '大量データエクスポート - 40次元フルガード', 100)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 1.3 外注スタッフ管理（HR Management）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.hr_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES core.tenants(id),
    
    staff_code TEXT NOT NULL,
    display_name TEXT NOT NULL,
    email TEXT,
    
    -- 契約情報
    contract_type TEXT NOT NULL CHECK (contract_type IN ('outsource', 'part_time', 'contractor', 'full_time')),
    contract_start DATE NOT NULL,
    contract_end DATE,
    
    -- 報酬設定
    payment_type TEXT NOT NULL CHECK (payment_type IN ('hourly', 'task_based', 'fixed_monthly', 'commission')),
    base_rate NUMERIC(10,2),
    currency TEXT DEFAULT 'JPY',
    
    -- 燃焼上限（次元22）
    daily_task_limit INTEGER DEFAULT 100,
    monthly_hours_limit NUMERIC(6,2) DEFAULT 160,
    monthly_payment_cap NUMERIC(12,2),
    
    -- ステータス
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'terminated')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tenant_id, staff_code)
);

-- -----------------------------------------------------------------------------
-- 1.4 権限ロール（RBAC）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.hr_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES core.tenants(id),
    
    role_code TEXT NOT NULL,
    role_name TEXT NOT NULL,
    
    -- 権限定義（JSONB）
    permissions JSONB NOT NULL DEFAULT '{}',
    -- {
    --   "allowed_actions": ["read.*", "listing.single"],
    --   "blocked_actions": ["delete.*", "payment.*"],
    --   "max_batch_size": 50,
    --   "approval_threshold": 10000,
    --   "allowed_risk_levels": ["LOW", "MID"]
    -- }
    
    -- ノード制限
    allowed_nodes JSONB DEFAULT '[]',
    blocked_nodes JSONB DEFAULT '[]',
    
    hierarchy_level INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tenant_id, role_code)
);

-- デフォルトロール
INSERT INTO core.hr_roles (tenant_id, role_code, role_name, permissions, hierarchy_level) VALUES
    (NULL, 'SUPER_ADMIN', 'スーパー管理者', '{"allowed_actions": ["*"], "blocked_actions": [], "max_batch_size": 9999, "approval_threshold": 999999999, "allowed_risk_levels": ["LOW", "MID", "HIGH", "CRITICAL"]}'::jsonb, 0),
    (NULL, 'ADMIN', '管理者', '{"allowed_actions": ["*"], "blocked_actions": ["account.delete"], "max_batch_size": 500, "approval_threshold": 500000, "allowed_risk_levels": ["LOW", "MID", "HIGH"]}'::jsonb, 1),
    (NULL, 'MANAGER', 'マネージャー', '{"allowed_actions": ["read.*", "listing.*", "inventory.*", "update.*"], "blocked_actions": ["delete.*", "payment.large"], "max_batch_size": 200, "approval_threshold": 100000, "allowed_risk_levels": ["LOW", "MID"]}'::jsonb, 2),
    (NULL, 'OPERATOR', 'オペレーター', '{"allowed_actions": ["read.*", "listing.single", "inventory.sync"], "blocked_actions": ["delete.*", "payment.*", "listing.bulk"], "max_batch_size": 50, "approval_threshold": 10000, "allowed_risk_levels": ["LOW"]}'::jsonb, 3),
    (NULL, 'VIEWER', '閲覧者', '{"allowed_actions": ["read.*", "get.*", "list.*"], "blocked_actions": ["*"], "max_batch_size": 0, "approval_threshold": 0, "allowed_risk_levels": ["LOW"]}'::jsonb, 4)
ON CONFLICT DO NOTHING;

-- スタッフ-ロール紐付け
CREATE TABLE IF NOT EXISTS core.hr_staff_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES core.hr_staff(id) ON DELETE CASCADE,
    role_id UUID REFERENCES core.hr_roles(id) ON DELETE CASCADE,
    
    valid_from DATE DEFAULT CURRENT_DATE,
    valid_until DATE,
    
    assigned_by TEXT,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(staff_id, role_id, valid_from)
);

-- -----------------------------------------------------------------------------
-- 1.5 Night-Shift キュー
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.night_shift_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES core.tenants(id),
    
    -- リクエスト情報
    request_id TEXT NOT NULL UNIQUE,
    workflow_name TEXT NOT NULL,
    action TEXT NOT NULL,
    payload JSONB NOT NULL,
    
    -- スケジュール
    queued_at TIMESTAMPTZ DEFAULT NOW(),
    scheduled_for TIMESTAMPTZ NOT NULL,        -- 実行予定時刻
    priority INTEGER DEFAULT 100,              -- 低い方が優先
    is_urgent BOOLEAN DEFAULT false,           -- 緊急フラグ
    
    -- 実行情報
    status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'error', 'cancelled')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    result JSONB,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    
    -- メタ情報
    estimated_cost NUMERIC(10,4),              -- 推定APIコスト
    actual_cost NUMERIC(10,4),                 -- 実際のAPIコスト
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_night_shift_queue_scheduled ON core.night_shift_queue(scheduled_for) WHERE status = 'queued';
CREATE INDEX idx_night_shift_queue_tenant ON core.night_shift_queue(tenant_id, status);

-- ============================================================================
-- PART 2: commerce スキーマ - 商取引
-- ============================================================================

-- -----------------------------------------------------------------------------
-- 2.1 古物商許可マスター
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS commerce.dealer_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES core.tenants(id),
    
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
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tenant_id, license_number)
);

-- -----------------------------------------------------------------------------
-- 2.2 古物台帳（dealer_ledger）- 取引証跡統合
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS commerce.dealer_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES core.tenants(id),
    license_id UUID REFERENCES commerce.dealer_licenses(id),
    
    -- 取引情報
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'exchange', 'consignment', 'sale', 'return')),
    transaction_date DATE NOT NULL,
    transaction_time TIME,
    
    -- 古物情報（法定記載事項）
    item_category TEXT NOT NULL,
    item_name TEXT NOT NULL,
    item_description TEXT,
    item_serial_number TEXT,
    item_quantity INTEGER NOT NULL DEFAULT 1,
    item_unit_price NUMERIC(12,2) NOT NULL,
    item_total_price NUMERIC(12,2) NOT NULL,
    
    -- 相手方情報
    counterparty_required BOOLEAN DEFAULT false,
    counterparty_name TEXT,
    counterparty_address TEXT,
    counterparty_dob DATE,
    counterparty_occupation TEXT,
    counterparty_id_type TEXT,
    counterparty_id_number_hash TEXT,          -- ハッシュ化して保存
    
    -- 本人確認
    verification_method TEXT CHECK (verification_method IN ('face_to_face', 'delivery_confirmation', 'electronic', 'other')),
    verification_details JSONB DEFAULT '{}',
    
    -- システム連携
    product_master_id UUID,
    source_platform TEXT,
    source_transaction_id TEXT,
    
    -- 証跡参照（audit.evidence_registryへのFK）
    evidence_ids UUID[] DEFAULT '{}',
    
    -- 改ざん検知（次元26）
    record_hash TEXT,
    recorded_by TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dealer_ledger_tenant ON commerce.dealer_ledger(tenant_id);
CREATE INDEX idx_dealer_ledger_date ON commerce.dealer_ledger(transaction_date DESC);
CREATE INDEX idx_dealer_ledger_type ON commerce.dealer_ledger(transaction_type);

-- ============================================================================
-- PART 3: finance スキーマ - 財務
-- ============================================================================

-- -----------------------------------------------------------------------------
-- 3.1 勘定科目マスター
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS finance.chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES core.tenants(id),
    
    account_code TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_name_en TEXT,
    
    account_type TEXT NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense', 'contra')),
    account_category TEXT,
    account_subcategory TEXT,
    
    normal_balance TEXT NOT NULL CHECK (normal_balance IN ('debit', 'credit')),
    
    tax_category TEXT DEFAULT 'taxable' CHECK (tax_category IN ('taxable', 'non_taxable', 'exempt', 'tax_free')),
    
    -- MF連携
    mf_account_code TEXT,
    mf_sub_account_code TEXT,
    
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tenant_id, account_code)
);

-- -----------------------------------------------------------------------------
-- 3.2 仕訳台帳（ledger）- 発生主義自動仕訳
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS finance.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES core.tenants(id),
    
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
    is_balanced BOOLEAN GENERATED ALWAYS AS (total_debit = total_credit) STORED,
    
    -- 取引参照
    source_type TEXT CHECK (source_type IN ('sales', 'purchase', 'expense', 'bank', 'adjustment', 'manual', 'import')),
    source_id TEXT,
    source_platform TEXT,
    
    -- 承認フロー（次元5: HitL）
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('draft', 'pending', 'approved', 'rejected', 'posted', 'auto_approved')),
    approval_required BOOLEAN DEFAULT false,
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- 自動生成情報（次元13: Decision Trace）
    is_auto_generated BOOLEAN DEFAULT false,
    generation_rule_id UUID,
    ai_reasoning JSONB DEFAULT '{}',
    ai_model_used TEXT,                        -- Cost-Save: 使用したAIモデル
    
    -- MF連携
    mf_journal_id TEXT,
    mf_sync_status TEXT DEFAULT 'pending' CHECK (mf_sync_status IN ('pending', 'synced', 'error', 'skipped')),
    mf_sync_at TIMESTAMPTZ,
    mf_sync_error TEXT,
    
    -- 証跡
    evidence_ids UUID[] DEFAULT '{}',
    
    -- 改ざん検知
    record_hash TEXT,
    created_by TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tenant_id, journal_number)
);

-- 仕訳明細
CREATE TABLE IF NOT EXISTS finance.journal_entry_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_entry_id UUID NOT NULL REFERENCES finance.journal_entries(id) ON DELETE CASCADE,
    
    line_number INTEGER NOT NULL,
    
    account_id UUID REFERENCES finance.chart_of_accounts(id),
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
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(journal_entry_id, line_number),
    CHECK (debit_amount >= 0 AND credit_amount >= 0),
    CHECK (NOT (debit_amount > 0 AND credit_amount > 0))
);

-- 自動仕訳ルール
CREATE TABLE IF NOT EXISTS finance.auto_journal_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES core.tenants(id),
    
    rule_name TEXT NOT NULL,
    rule_description TEXT,
    priority INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    
    -- マッチング条件
    match_conditions JSONB NOT NULL,
    
    -- 仕訳テンプレート
    journal_template JSONB NOT NULL,
    
    -- 承認設定
    auto_approve_threshold NUMERIC(15,2) DEFAULT 10000,
    always_require_approval BOOLEAN DEFAULT false,
    
    -- AI Model設定（Cost-Save）
    use_premium_model BOOLEAN DEFAULT false,
    
    -- 統計
    execution_count INTEGER DEFAULT 0,
    last_executed_at TIMESTAMPTZ,
    error_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3.3 銀行明細（MF突合用）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS finance.bank_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES core.tenants(id),
    
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
    
    -- MFインポート
    mf_transaction_id TEXT,
    mf_category TEXT,
    mf_memo TEXT,
    
    -- マッチング
    matching_status TEXT DEFAULT 'unmatched' CHECK (matching_status IN ('unmatched', 'auto_matched', 'manual_matched', 'excluded', 'suspicious')),
    matched_journal_id UUID REFERENCES finance.journal_entries(id),
    matched_at TIMESTAMPTZ,
    matched_by TEXT,
    
    -- AI分析
    ai_suggestions JSONB DEFAULT '[]',
    ai_category_guess TEXT,
    ai_confidence NUMERIC(5,2),
    ai_model_used TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bank_statements_tenant ON finance.bank_statements(tenant_id);
CREATE INDEX idx_bank_statements_matching ON finance.bank_statements(matching_status) WHERE matching_status = 'unmatched';

-- ============================================================================
-- PART 4: audit スキーマ - 監査・証跡
-- ============================================================================

-- -----------------------------------------------------------------------------
-- 4.1 証跡登録簿（evidence_registry）- ハッシュ署名付き
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit.evidence_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES core.tenants(id),
    
    evidence_type TEXT NOT NULL CHECK (evidence_type IN (
        'screenshot', 'pdf', 'email', 'receipt', 'invoice', 'contract',
        'bank_statement', 'shipping_label', 'customs_form', 'id_verification',
        'api_response', 'chat_log', 'other'
    )),
    
    title TEXT NOT NULL,
    description TEXT,
    
    -- ファイル情報
    file_name TEXT,
    file_path TEXT,
    file_size_bytes BIGINT,
    mime_type TEXT,
    
    -- ハッシュ（改ざん検知 - 次元26）
    file_hash_sha256 TEXT NOT NULL,
    metadata_hash TEXT,
    
    -- タイムスタンプ（法廷耐性）
    evidence_timestamp TIMESTAMPTZ NOT NULL,
    timestamp_authority TEXT,
    timestamp_token TEXT,
    
    -- 関連エンティティ
    related_entity_type TEXT,
    related_entity_id UUID,
    
    tags TEXT[] DEFAULT '{}',
    
    -- 提出用様式
    official_format TEXT CHECK (official_format IN (
        'police_kobutsu', 'tax_blue', 'tax_expense', 'customs_import', 'customs_export', 'mf_journal', 'generic'
    )),
    
    -- 保管義務
    retention_required_until DATE,
    retention_reason TEXT,
    
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted', 'submitted')),
    
    -- AI分析
    ai_extraction JSONB DEFAULT '{}',
    ai_classification JSONB DEFAULT '{}',
    ai_confidence NUMERIC(5,2),
    
    -- アクセスログ
    access_log JSONB DEFAULT '[]',
    
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evidence_registry_tenant ON audit.evidence_registry(tenant_id);
CREATE INDEX idx_evidence_registry_type ON audit.evidence_registry(evidence_type);
CREATE INDEX idx_evidence_registry_hash ON audit.evidence_registry(file_hash_sha256);

-- -----------------------------------------------------------------------------
-- 4.2 監査ログ（非同期Audit対応）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit.logs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID REFERENCES core.tenants(id),
    
    -- リクエスト情報
    workflow_name TEXT NOT NULL,
    request_id TEXT NOT NULL,
    action TEXT NOT NULL,
    
    -- リスクレベル
    risk_level TEXT DEFAULT 'LOW' CHECK (risk_level IN ('LOW', 'MID', 'HIGH', 'CRITICAL')),
    
    -- ペイロード（PIIマスク済み）
    payload_masked JSONB DEFAULT '{}',
    
    -- ポリシー
    policies_triggered JSONB DEFAULT '[]',
    
    -- 実行結果
    status TEXT NOT NULL CHECK (status IN ('success', 'error', 'pending', 'cancelled', 'async_pending')),
    error_message TEXT,
    error_details JSONB,
    
    -- パフォーマンス
    execution_time_ms INTEGER,
    
    -- AI/コスト情報（Cost-Save）
    ai_model_used TEXT,
    api_cost NUMERIC(10,4),
    
    -- 非同期監査フラグ
    is_async BOOLEAN DEFAULT false,
    async_completed_at TIMESTAMPTZ,
    
    -- メタ情報
    metadata JSONB DEFAULT '{}',
    
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- パーティショニング用インデックス
CREATE INDEX idx_audit_logs_tenant_date ON audit.logs(tenant_id, executed_at DESC);
CREATE INDEX idx_audit_logs_request_id ON audit.logs(request_id);
CREATE INDEX idx_audit_logs_status ON audit.logs(status) WHERE status IN ('error', 'async_pending');

-- -----------------------------------------------------------------------------
-- 4.3 承認キュー（HitL）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit.approval_queue (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID REFERENCES core.tenants(id),
    
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
    
    -- 通知
    notification_sent BOOLEAN DEFAULT false,
    notification_channel TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_approval_queue_tenant_status ON audit.approval_queue(tenant_id, status);
CREATE INDEX idx_approval_queue_expires ON audit.approval_queue(expires_at) WHERE status = 'pending';

-- -----------------------------------------------------------------------------
-- 4.4 エラー自己修復ログ（OpenHands Sentinel連携）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit.error_recovery_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES core.tenants(id),
    
    -- エラー情報
    original_request_id TEXT NOT NULL,
    workflow_name TEXT NOT NULL,
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    
    -- 修復試行
    recovery_strategy TEXT NOT NULL CHECK (recovery_strategy IN ('retry', 'fallback', 'notify', 'manual')),
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    
    -- 結果
    recovery_status TEXT DEFAULT 'pending' CHECK (recovery_status IN ('pending', 'success', 'failed', 'escalated')),
    recovery_result JSONB,
    
    -- OpenHands Sentinel連携
    sentinel_ticket_id TEXT,
    sentinel_analysis JSONB,
    
    -- 通知
    notification_sent BOOLEAN DEFAULT false,
    notification_channel TEXT,
    notification_recipient TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_error_recovery_status ON audit.error_recovery_log(recovery_status) WHERE recovery_status IN ('pending', 'failed');

-- ============================================================================
-- PART 5: RLS（Row Level Security）- 物理隔離
-- ============================================================================

-- core スキーマ
ALTER TABLE core.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.hr_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.hr_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.hr_staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.night_shift_queue ENABLE ROW LEVEL SECURITY;

-- commerce スキーマ
ALTER TABLE commerce.dealer_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.dealer_ledger ENABLE ROW LEVEL SECURITY;

-- finance スキーマ
ALTER TABLE finance.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.journal_entry_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.auto_journal_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.bank_statements ENABLE ROW LEVEL SECURITY;

-- audit スキーマ
ALTER TABLE audit.evidence_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.error_recovery_log ENABLE ROW LEVEL SECURITY;

-- テナント分離ポリシー作成関数
CREATE OR REPLACE FUNCTION create_tenant_policy(schema_name TEXT, table_name TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE format(
        'CREATE POLICY tenant_isolation_%s_%s ON %I.%I
         USING (tenant_id::text = current_setting(''app.current_tenant'', true) 
                OR current_setting(''app.is_service_role'', true) = ''true'')',
        schema_name, table_name, schema_name, table_name
    );
EXCEPTION WHEN duplicate_object THEN
    NULL;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルにポリシー適用
SELECT create_tenant_policy('core', 'hr_staff');
SELECT create_tenant_policy('core', 'hr_roles');
SELECT create_tenant_policy('core', 'night_shift_queue');
SELECT create_tenant_policy('commerce', 'dealer_licenses');
SELECT create_tenant_policy('commerce', 'dealer_ledger');
SELECT create_tenant_policy('finance', 'chart_of_accounts');
SELECT create_tenant_policy('finance', 'journal_entries');
SELECT create_tenant_policy('finance', 'auto_journal_rules');
SELECT create_tenant_policy('finance', 'bank_statements');
SELECT create_tenant_policy('audit', 'evidence_registry');
SELECT create_tenant_policy('audit', 'logs');
SELECT create_tenant_policy('audit', 'approval_queue');
SELECT create_tenant_policy('audit', 'error_recovery_log');

-- ============================================================================
-- PART 6: 便利関数
-- ============================================================================

-- リスクレベル判定関数
CREATE OR REPLACE FUNCTION core.get_risk_level(p_action TEXT, p_amount NUMERIC DEFAULT 0, p_batch_size INTEGER DEFAULT 1)
RETURNS TABLE (
    risk_level TEXT,
    skip_policy_validator BOOLEAN,
    skip_hitl BOOLEAN,
    skip_evidence BOOLEAN,
    use_premium_model BOOLEAN
) AS $$
DECLARE
    v_definition core.risk_level_definitions%ROWTYPE;
    v_matched BOOLEAN := false;
BEGIN
    -- 優先順位順にマッチング
    FOR v_definition IN
        SELECT * FROM core.risk_level_definitions
        WHERE is_active = true
        ORDER BY priority ASC
    LOOP
        -- パターンマッチング（シンプルなワイルドカード対応）
        IF p_action LIKE REPLACE(v_definition.action_pattern, '*', '%') THEN
            -- 条件チェック
            IF v_definition.conditions IS NOT NULL AND v_definition.conditions != '{}'::jsonb THEN
                IF (v_definition.conditions->>'amount_threshold')::numeric IS NOT NULL 
                   AND p_amount > (v_definition.conditions->>'amount_threshold')::numeric THEN
                    -- 金額閾値超過の場合、リスクレベルを上げる
                    CONTINUE;
                END IF;
                IF (v_definition.conditions->>'batch_threshold')::integer IS NOT NULL 
                   AND p_batch_size > (v_definition.conditions->>'batch_threshold')::integer THEN
                    -- バッチ閾値超過の場合、リスクレベルを上げる
                    CONTINUE;
                END IF;
            END IF;
            
            risk_level := v_definition.risk_level;
            skip_policy_validator := v_definition.skip_policy_validator;
            skip_hitl := v_definition.skip_hitl;
            skip_evidence := v_definition.skip_evidence;
            use_premium_model := v_definition.use_premium_model;
            RETURN NEXT;
            RETURN;
        END IF;
    END LOOP;
    
    -- デフォルト（マッチしない場合はMID）
    risk_level := 'MID';
    skip_policy_validator := false;
    skip_hitl := true;
    skip_evidence := false;
    use_premium_model := false;
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Night-Shift スケジュール計算関数
CREATE OR REPLACE FUNCTION core.calculate_night_shift_time(p_tenant_id UUID, p_is_urgent BOOLEAN DEFAULT false)
RETURNS TIMESTAMPTZ AS $$
DECLARE
    v_tenant core.tenants%ROWTYPE;
    v_now TIMESTAMPTZ;
    v_scheduled TIMESTAMPTZ;
BEGIN
    -- 緊急の場合は即時実行
    IF p_is_urgent THEN
        RETURN NOW();
    END IF;
    
    SELECT * INTO v_tenant FROM core.tenants WHERE id = p_tenant_id;
    
    -- Night-Shiftが無効の場合は即時実行
    IF v_tenant IS NULL OR NOT v_tenant.night_shift_enabled THEN
        RETURN NOW();
    END IF;
    
    v_now := NOW() AT TIME ZONE v_tenant.night_shift_timezone;
    
    -- 現在時刻がNight-Shift時間帯内かチェック
    IF v_now::time >= v_tenant.night_shift_start AND v_now::time < v_tenant.night_shift_end THEN
        -- 既にNight-Shift時間帯内なら即時実行
        RETURN NOW();
    ELSE
        -- 次のNight-Shift開始時刻を計算
        IF v_now::time < v_tenant.night_shift_start THEN
            -- 今日のNight-Shift開始時刻
            v_scheduled := (v_now::date + v_tenant.night_shift_start)::timestamptz;
        ELSE
            -- 明日のNight-Shift開始時刻
            v_scheduled := ((v_now::date + INTERVAL '1 day') + v_tenant.night_shift_start)::timestamptz;
        END IF;
        
        RETURN v_scheduled AT TIME ZONE v_tenant.night_shift_timezone;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 非同期監査ログ挿入関数
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
-- PART 7: 初期データ
-- ============================================================================

-- デフォルトテナント
INSERT INTO core.tenants (tenant_code, tenant_name, status)
VALUES ('default', 'デフォルトテナント', 'active')
ON CONFLICT (tenant_code) DO NOTHING;

-- デフォルト勘定科目（finance.chart_of_accounts）
INSERT INTO finance.chart_of_accounts (tenant_id, account_code, account_name, account_type, account_category, normal_balance, mf_account_code)
SELECT t.id, ac.account_code, ac.account_name, ac.account_type, ac.account_category, ac.normal_balance, ac.mf_account_code
FROM core.tenants t
CROSS JOIN (VALUES
    ('1100', '現金', 'asset', '流動資産', 'debit', '1000'),
    ('1110', '普通預金', 'asset', '流動資産', 'debit', '1010'),
    ('1200', '売掛金', 'asset', '流動資産', 'debit', '1100'),
    ('1220', 'eBay Managed Payment', 'asset', '流動資産', 'debit', NULL),
    ('1300', '商品', 'asset', '流動資産', 'debit', '1400'),
    ('2100', '買掛金', 'liability', '流動負債', 'credit', '2100'),
    ('2200', '未払金', 'liability', '流動負債', 'credit', '2200'),
    ('4100', '売上高', 'revenue', '売上', 'credit', '4000'),
    ('4110', 'eBay売上', 'revenue', '売上', 'credit', NULL),
    ('5100', '仕入高', 'expense', '売上原価', 'debit', '5000'),
    ('5200', '送料', 'expense', '販売費', 'debit', '5200'),
    ('5310', 'eBay手数料', 'expense', '販売費', 'debit', NULL),
    ('5320', 'PayPal手数料', 'expense', '販売費', 'debit', NULL),
    ('5800', '外注費', 'expense', '一般管理費', 'debit', '5800')
) AS ac(account_code, account_name, account_type, account_category, normal_balance, mf_account_code)
WHERE t.tenant_code = 'default'
ON CONFLICT (tenant_id, account_code) DO NOTHING;

-- ============================================================================
-- V8.2.1 最終統合マイグレーション完了
-- ============================================================================

COMMENT ON SCHEMA core IS 'N3 Empire OS V8.2.1: コア機能（認証・権限・設定）';
COMMENT ON SCHEMA commerce IS 'N3 Empire OS V8.2.1: 商取引（古物台帳・在庫・出品）';
COMMENT ON SCHEMA finance IS 'N3 Empire OS V8.2.1: 財務（仕訳・入出金・突合）';
COMMENT ON SCHEMA audit IS 'N3 Empire OS V8.2.1: 監査（ログ・証跡・承認）';
