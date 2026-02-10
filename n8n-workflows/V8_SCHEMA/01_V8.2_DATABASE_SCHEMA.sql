-- ============================================================================
-- N3 Empire OS V8.2: 不沈艦基盤 データベーススキーマ【経営レジリエンス版】
-- 
-- 【不沈艦・執行命令】遵守項目:
-- - 次元3（Auth-Gate）: 全テーブルにテナント分離・RLS適用
-- - 次元22（燃焼上限）: 外注報酬・API消費に日次/月次キャップ
-- - 次元5（HitL）: 高額仕訳・一括削除に承認キュー連携
-- - 次元13（Decision Trace）: 全自動処理の思考プロセスをJSONBで記録
-- - 次元26（法廷耐性）: タイムゾーン付きタイムスタンプ・ハッシュ署名
-- 
-- 作成日: 2026-01-24
-- バージョン: V8.2.0-UNSINKABLE
-- ============================================================================

-- ============================================================================
-- PART 1: 古物台帳（dealer_ledger）- 古物営業法準拠
-- ============================================================================

-- 古物商許可情報マスター
CREATE TABLE IF NOT EXISTS dealer_license (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'default',
    
    -- 古物商許可情報
    license_number TEXT NOT NULL,                -- 許可番号
    license_authority TEXT NOT NULL,             -- 許可公安委員会
    license_date DATE NOT NULL,                  -- 許可年月日
    license_expiry DATE,                         -- 有効期限（更新制の場合）
    
    -- 営業者情報
    business_name TEXT NOT NULL,                 -- 氏名または名称
    representative_name TEXT,                    -- 代表者氏名（法人の場合）
    business_address TEXT NOT NULL,              -- 営業所所在地
    business_phone TEXT,                         -- 電話番号
    
    -- 取扱品目
    handling_categories JSONB DEFAULT '[]',      -- 取扱古物の区分
    -- ["美術品", "時計・宝飾品", "自動車", "道具類", "機械工具類"]
    
    -- ステータス
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'revoked', 'expired')),
    
    -- メタ情報
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(tenant_id, license_number)
);

-- 古物台帳（取引記録）- 古物営業法第16条準拠
CREATE TABLE IF NOT EXISTS dealer_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'default',
    license_id UUID REFERENCES dealer_license(id),
    
    -- 取引種別
    transaction_type TEXT NOT NULL CHECK (transaction_type IN (
        'purchase',      -- 買受け
        'exchange',      -- 交換
        'consignment',   -- 委託販売受託
        'sale',          -- 売却
        'return'         -- 返品
    )),
    
    -- 取引日時
    transaction_date DATE NOT NULL,
    transaction_time TIME,
    
    -- 古物の情報（法定記載事項）
    item_category TEXT NOT NULL,                 -- 品目
    item_name TEXT NOT NULL,                     -- 品名
    item_description TEXT,                       -- 特徴
    item_serial_number TEXT,                     -- 製造番号等
    item_quantity INTEGER NOT NULL DEFAULT 1,    -- 数量
    item_unit_price NUMERIC(12,2) NOT NULL,      -- 単価
    item_total_price NUMERIC(12,2) NOT NULL,     -- 合計金額
    
    -- 相手方情報（1万円以上または法定品目の場合必須）
    counterparty_required BOOLEAN DEFAULT false,
    counterparty_name TEXT,                      -- 氏名または名称
    counterparty_address TEXT,                   -- 住所
    counterparty_dob DATE,                       -- 生年月日
    counterparty_occupation TEXT,                -- 職業
    counterparty_id_type TEXT,                   -- 本人確認書類の種類
    counterparty_id_number TEXT,                 -- 本人確認書類の番号（暗号化推奨）
    
    -- 本人確認方法
    verification_method TEXT CHECK (verification_method IN (
        'face_to_face',          -- 対面
        'delivery_confirmation', -- 配達記録郵便
        'electronic',            -- 電子的確認
        'other'
    )),
    verification_details JSONB DEFAULT '{}',
    
    -- 商品との紐付け
    product_master_id UUID,                      -- products_masterとのFK
    source_platform TEXT,                        -- 仕入元プラットフォーム
    source_transaction_id TEXT,                  -- 仕入元取引ID
    
    -- エビデンス参照
    evidence_ids UUID[] DEFAULT '{}',            -- evidence_registryへの参照
    
    -- 監査情報（次元26: 法廷耐性）
    record_hash TEXT,                            -- レコードハッシュ（改ざん検知）
    recorded_by TEXT,                            -- 記録者
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_verified_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_dealer_ledger_tenant ON dealer_ledger(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dealer_ledger_date ON dealer_ledger(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_dealer_ledger_type ON dealer_ledger(transaction_type);
CREATE INDEX IF NOT EXISTS idx_dealer_ledger_counterparty ON dealer_ledger(counterparty_name) WHERE counterparty_required = true;
CREATE INDEX IF NOT EXISTS idx_dealer_ledger_product ON dealer_ledger(product_master_id);

-- ============================================================================
-- PART 2: 仕訳台帳（ledger）- 発生主義会計準拠
-- ============================================================================

-- 勘定科目マスター
CREATE TABLE IF NOT EXISTS chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'default',
    
    -- 勘定科目情報
    account_code TEXT NOT NULL,                  -- 勘定科目コード
    account_name TEXT NOT NULL,                  -- 勘定科目名
    account_name_en TEXT,                        -- 英語名
    
    -- 科目分類
    account_type TEXT NOT NULL CHECK (account_type IN (
        'asset',         -- 資産
        'liability',     -- 負債
        'equity',        -- 純資産
        'revenue',       -- 収益
        'expense',       -- 費用
        'contra'         -- 評価勘定
    )),
    account_category TEXT,                       -- 大分類
    account_subcategory TEXT,                    -- 中分類
    
    -- 増減方向
    normal_balance TEXT NOT NULL CHECK (normal_balance IN ('debit', 'credit')),
    
    -- 税区分
    tax_category TEXT DEFAULT 'taxable' CHECK (tax_category IN (
        'taxable',       -- 課税
        'non_taxable',   -- 非課税
        'exempt',        -- 免税
        'tax_free'       -- 不課税
    )),
    
    -- MF連携用
    mf_account_code TEXT,                        -- MoneyForward勘定科目コード
    mf_sub_account_code TEXT,                    -- 補助科目コード
    
    -- ステータス
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(tenant_id, account_code)
);

-- 仕訳ヘッダー
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'default',
    
    -- 仕訳番号
    journal_number TEXT NOT NULL,                -- 仕訳番号（年度+連番）
    fiscal_year INTEGER NOT NULL,                -- 会計年度
    fiscal_period INTEGER,                       -- 会計期間（月）
    
    -- 日付
    entry_date DATE NOT NULL,                    -- 仕訳日付（発生日）
    posting_date DATE,                           -- 転記日付
    
    -- 仕訳種別
    entry_type TEXT NOT NULL CHECK (entry_type IN (
        'normal',            -- 通常仕訳
        'adjusting',         -- 決算整理仕訳
        'closing',           -- 締切仕訳
        'opening',           -- 開始仕訳
        'reversal',          -- 逆仕訳
        'correction'         -- 訂正仕訳
    )),
    
    -- 摘要
    description TEXT NOT NULL,                   -- 摘要
    description_detail TEXT,                     -- 詳細摘要
    
    -- 金額サマリー
    total_debit NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_credit NUMERIC(15,2) NOT NULL DEFAULT 0,
    is_balanced BOOLEAN GENERATED ALWAYS AS (total_debit = total_credit) STORED,
    
    -- 取引参照
    source_type TEXT CHECK (source_type IN (
        'sales',             -- 売上
        'purchase',          -- 仕入
        'expense',           -- 経費
        'bank',              -- 銀行取引
        'adjustment',        -- 調整
        'manual',            -- 手動入力
        'import'             -- インポート
    )),
    source_id TEXT,                              -- 元取引のID
    source_platform TEXT,                        -- 取引プラットフォーム
    
    -- 承認フロー（次元5: HitL）
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN (
        'draft',             -- 下書き
        'pending',           -- 承認待ち
        'approved',          -- 承認済み
        'rejected',          -- 却下
        'posted'             -- 転記済み
    )),
    approval_required BOOLEAN DEFAULT false,
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- 自動生成情報（次元13: Decision Trace）
    is_auto_generated BOOLEAN DEFAULT false,
    generation_rule_id UUID,                     -- 適用された自動仕訳ルールID
    ai_reasoning JSONB DEFAULT '{}',             -- AIの判断根拠
    -- {"matched_pattern": "eBay売上", "confidence": 0.95, "alternatives": [...]}
    
    -- MF連携
    mf_journal_id TEXT,                          -- MoneyForward仕訳ID
    mf_sync_status TEXT DEFAULT 'pending' CHECK (mf_sync_status IN (
        'pending', 'synced', 'error', 'skipped'
    )),
    mf_sync_at TIMESTAMPTZ,
    mf_sync_error TEXT,
    
    -- エビデンス参照
    evidence_ids UUID[] DEFAULT '{}',
    
    -- 監査情報
    record_hash TEXT,
    created_by TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(tenant_id, journal_number)
);

-- 仕訳明細
CREATE TABLE IF NOT EXISTS journal_entry_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    
    -- 行番号
    line_number INTEGER NOT NULL,
    
    -- 勘定科目
    account_id UUID NOT NULL REFERENCES chart_of_accounts(id),
    account_code TEXT NOT NULL,                  -- 非正規化（高速検索用）
    account_name TEXT NOT NULL,                  -- 非正規化
    
    -- 補助科目
    sub_account_code TEXT,
    sub_account_name TEXT,
    
    -- 金額
    debit_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    credit_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    
    -- 外貨情報
    currency_code TEXT DEFAULT 'JPY',
    exchange_rate NUMERIC(10,4) DEFAULT 1.0,
    foreign_amount NUMERIC(15,2),
    
    -- 消費税
    tax_category TEXT DEFAULT 'taxable',
    tax_rate NUMERIC(5,2) DEFAULT 10.00,
    tax_amount NUMERIC(15,2) DEFAULT 0,
    tax_included BOOLEAN DEFAULT true,           -- 税込み価格か
    
    -- 部門・プロジェクト
    department_code TEXT,
    project_code TEXT,
    
    -- 摘要
    line_description TEXT,
    
    -- 取引先
    counterparty_code TEXT,
    counterparty_name TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(journal_entry_id, line_number),
    CHECK (debit_amount >= 0 AND credit_amount >= 0),
    CHECK (NOT (debit_amount > 0 AND credit_amount > 0))  -- 同時に借方・貸方は不可
);

-- 自動仕訳ルール
CREATE TABLE IF NOT EXISTS auto_journal_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'default',
    
    -- ルール基本情報
    rule_name TEXT NOT NULL,
    rule_description TEXT,
    priority INTEGER DEFAULT 100,                -- 優先順位（低い方が先）
    is_active BOOLEAN DEFAULT true,
    
    -- マッチング条件
    match_conditions JSONB NOT NULL,
    -- {
    --   "platform": ["ebay", "amazon"],
    --   "transaction_type": ["sale"],
    --   "amount_range": {"min": 0, "max": null},
    --   "description_pattern": ".*送料.*",
    --   "category": ["Electronics"]
    -- }
    
    -- 仕訳テンプレート
    journal_template JSONB NOT NULL,
    -- {
    --   "description_template": "{platform}売上 - {item_name}",
    --   "lines": [
    --     {"account_code": "1310", "debit": "{total_amount}", "credit": 0},
    --     {"account_code": "4100", "debit": 0, "credit": "{net_amount}"},
    --     {"account_code": "4900", "debit": 0, "credit": "{fee_amount}"}
    --   ]
    -- }
    
    -- 承認設定（次元5: HitL）
    auto_approve_threshold NUMERIC(15,2) DEFAULT 10000,  -- この金額以下は自動承認
    always_require_approval BOOLEAN DEFAULT false,
    
    -- 実行統計
    execution_count INTEGER DEFAULT 0,
    last_executed_at TIMESTAMPTZ,
    error_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_journal_entries_tenant ON journal_entries(tenant_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_approval ON journal_entries(approval_status) WHERE approval_status IN ('pending', 'draft');
CREATE INDEX IF NOT EXISTS idx_journal_entries_mf_sync ON journal_entries(mf_sync_status) WHERE mf_sync_status = 'pending';
CREATE INDEX IF NOT EXISTS idx_journal_entry_lines_account ON journal_entry_lines(account_id);

-- ============================================================================
-- PART 3: 外注管理（hr_management）- RBAC・報酬自動計算
-- ============================================================================

-- 外注スタッフマスター
CREATE TABLE IF NOT EXISTS hr_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'default',
    
    -- 基本情報
    staff_code TEXT NOT NULL,                    -- スタッフコード
    display_name TEXT NOT NULL,                  -- 表示名
    email TEXT,                                  -- メールアドレス
    
    -- 契約形態
    contract_type TEXT NOT NULL CHECK (contract_type IN (
        'outsource',         -- 外注
        'part_time',         -- パートタイム
        'contractor',        -- 業務委託
        'full_time'          -- 正社員
    )),
    contract_start_date DATE NOT NULL,
    contract_end_date DATE,
    
    -- 報酬設定
    payment_type TEXT NOT NULL CHECK (payment_type IN (
        'hourly',            -- 時給制
        'task_based',        -- タスク単価制
        'fixed_monthly',     -- 月額固定
        'commission'         -- 成果報酬
    )),
    base_rate NUMERIC(10,2),                     -- 基本単価
    currency TEXT DEFAULT 'JPY',
    
    -- 上限設定（次元22: 燃焼上限）
    daily_task_limit INTEGER DEFAULT 100,        -- 日次タスク上限
    monthly_hours_limit NUMERIC(6,2) DEFAULT 160, -- 月次時間上限
    monthly_payment_cap NUMERIC(12,2),           -- 月次報酬上限
    
    -- 振込情報（暗号化推奨）
    bank_info_encrypted TEXT,                    -- 暗号化された銀行情報
    payment_cycle TEXT DEFAULT 'monthly',        -- 支払いサイクル
    
    -- ステータス
    status TEXT DEFAULT 'active' CHECK (status IN (
        'active', 'inactive', 'suspended', 'terminated'
    )),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(tenant_id, staff_code)
);

-- 権限ロールマスター
CREATE TABLE IF NOT EXISTS hr_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'default',
    
    role_code TEXT NOT NULL,
    role_name TEXT NOT NULL,
    role_description TEXT,
    
    -- 権限定義（RBAC）
    permissions JSONB NOT NULL DEFAULT '{}',
    -- {
    --   "workflows": ["inventory_sync", "listing_reserve"],
    --   "read_tables": ["products_master", "listing_queue"],
    --   "write_tables": [],
    --   "max_batch_size": 50,
    --   "require_approval_above": 10000,
    --   "prohibited_actions": ["delete_product", "change_price_above_20pct"]
    -- }
    
    -- ノード制限
    allowed_workflow_nodes JSONB DEFAULT '[]',   -- 使用可能なn8nノード
    blocked_workflow_nodes JSONB DEFAULT '[]',   -- ブロックされたノード
    
    -- 階層
    parent_role_id UUID REFERENCES hr_roles(id),
    hierarchy_level INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(tenant_id, role_code)
);

-- スタッフ-ロール紐付け
CREATE TABLE IF NOT EXISTS hr_staff_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES hr_staff(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES hr_roles(id) ON DELETE CASCADE,
    
    -- 有効期間
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE,
    
    -- 追加制限
    additional_restrictions JSONB DEFAULT '{}',
    
    assigned_by TEXT,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(staff_id, role_id, valid_from)
);

-- タスク定義マスター
CREATE TABLE IF NOT EXISTS hr_task_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'default',
    
    task_code TEXT NOT NULL,
    task_name TEXT NOT NULL,
    task_description TEXT,
    task_category TEXT,
    
    -- 報酬設定
    unit_type TEXT NOT NULL CHECK (unit_type IN (
        'per_item',          -- 1件あたり
        'per_hour',          -- 1時間あたり
        'per_batch',         -- 1バッチあたり
        'per_completion'     -- 完了1回あたり
    )),
    base_unit_price NUMERIC(10,2) NOT NULL,
    
    -- 品質ボーナス
    quality_bonus_enabled BOOLEAN DEFAULT false,
    quality_bonus_rate NUMERIC(5,2) DEFAULT 0,   -- 追加率（%）
    quality_threshold NUMERIC(5,2) DEFAULT 95,   -- 閾値（%）
    
    -- 見積もり時間
    estimated_minutes_per_unit INTEGER,
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(tenant_id, task_code)
);

-- 作業記録
CREATE TABLE IF NOT EXISTS hr_work_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'default',
    staff_id UUID NOT NULL REFERENCES hr_staff(id),
    task_definition_id UUID REFERENCES hr_task_definitions(id),
    
    -- 作業日時
    work_date DATE NOT NULL,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    
    -- 作業内容
    task_description TEXT,
    items_processed INTEGER DEFAULT 0,
    batches_completed INTEGER DEFAULT 0,
    
    -- 品質スコア
    quality_score NUMERIC(5,2),                  -- 0-100
    error_count INTEGER DEFAULT 0,
    
    -- 報酬計算
    calculated_amount NUMERIC(12,2),
    bonus_amount NUMERIC(12,2) DEFAULT 0,
    total_amount NUMERIC(12,2),
    
    -- ワークフロー連携
    workflow_execution_ids TEXT[],               -- 関連するn8n実行ID
    
    -- 承認（次元5: HitL）
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN (
        'pending', 'approved', 'rejected', 'paid'
    )),
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    
    -- 支払い
    payment_batch_id UUID,
    paid_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 報酬支払いバッチ
CREATE TABLE IF NOT EXISTS hr_payment_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'default',
    
    -- バッチ情報
    batch_number TEXT NOT NULL,
    payment_period_start DATE NOT NULL,
    payment_period_end DATE NOT NULL,
    
    -- 金額
    total_amount NUMERIC(15,2) NOT NULL,
    staff_count INTEGER NOT NULL,
    
    -- ステータス
    status TEXT DEFAULT 'draft' CHECK (status IN (
        'draft', 'pending_approval', 'approved', 'processing', 'completed', 'error'
    )),
    
    -- 承認
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    
    -- 実行
    executed_at TIMESTAMPTZ,
    execution_result JSONB,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(tenant_id, batch_number)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_hr_staff_tenant ON hr_staff(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hr_work_logs_staff ON hr_work_logs(staff_id);
CREATE INDEX IF NOT EXISTS idx_hr_work_logs_date ON hr_work_logs(work_date DESC);
CREATE INDEX IF NOT EXISTS idx_hr_work_logs_approval ON hr_work_logs(approval_status) WHERE approval_status = 'pending';

-- ============================================================================
-- PART 4: 証跡管理（evidence_registry）- 法廷耐性
-- ============================================================================

-- エビデンス登録簿
CREATE TABLE IF NOT EXISTS evidence_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'default',
    
    -- エビデンス種別
    evidence_type TEXT NOT NULL CHECK (evidence_type IN (
        'screenshot',        -- スクリーンショット
        'pdf',               -- PDF書類
        'email',             -- メール
        'receipt',           -- 領収書
        'invoice',           -- 請求書
        'contract',          -- 契約書
        'bank_statement',    -- 銀行明細
        'shipping_label',    -- 送り状
        'customs_form',      -- 税関書類
        'id_verification',   -- 本人確認書類
        'api_response',      -- API応答
        'chat_log',          -- チャットログ
        'other'              -- その他
    )),
    
    -- 基本情報
    title TEXT NOT NULL,
    description TEXT,
    
    -- ファイル情報
    file_name TEXT,
    file_path TEXT,                              -- S3パス
    file_size_bytes BIGINT,
    mime_type TEXT,
    
    -- ハッシュ（改ざん検知）（次元26: 法廷耐性）
    file_hash_sha256 TEXT NOT NULL,              -- SHA-256ハッシュ
    metadata_hash TEXT,                          -- メタデータハッシュ
    
    -- タイムスタンプ（法廷耐性）
    evidence_timestamp TIMESTAMPTZ NOT NULL,     -- エビデンス発生日時
    timestamp_authority TEXT,                    -- タイムスタンプ局
    timestamp_token TEXT,                        -- タイムスタンプトークン
    
    -- 関連エンティティ
    related_entity_type TEXT,                    -- 関連エンティティ種別
    related_entity_id UUID,                      -- 関連エンティティID
    
    -- タグ
    tags TEXT[] DEFAULT '{}',
    
    -- 提出用様式
    official_format TEXT CHECK (official_format IN (
        'police_kobutsu',    -- 警察向け古物台帳様式
        'tax_blue',          -- 青色申告様式
        'tax_expense',       -- 経費精算様式
        'customs_import',    -- 輸入通関様式
        'customs_export',    -- 輸出通関様式
        'mf_journal',        -- MoneyForward仕訳
        'generic'            -- 汎用
    )),
    
    -- 有効期限・保管義務
    retention_required_until DATE,               -- 法定保存期限
    retention_reason TEXT,
    
    -- ステータス
    status TEXT DEFAULT 'active' CHECK (status IN (
        'active', 'archived', 'deleted', 'submitted'
    )),
    
    -- AI分析結果（次元13: Decision Trace）
    ai_extraction JSONB DEFAULT '{}',            -- AI OCR結果
    ai_classification JSONB DEFAULT '{}',        -- AI分類結果
    ai_confidence NUMERIC(5,2),                  -- 信頼度
    
    -- アクセスログ
    access_log JSONB DEFAULT '[]',
    -- [{"accessed_by": "user1", "at": "...", "action": "view"}]
    
    created_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- エビデンス関連付け（多対多）
CREATE TABLE IF NOT EXISTS evidence_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_id UUID NOT NULL REFERENCES evidence_registry(id) ON DELETE CASCADE,
    
    -- 関連先
    related_table TEXT NOT NULL,                 -- テーブル名
    related_id UUID NOT NULL,                    -- レコードID
    
    -- 関連種別
    relation_type TEXT DEFAULT 'attachment' CHECK (relation_type IN (
        'attachment',        -- 添付
        'proof',             -- 証拠
        'reference',         -- 参照
        'source'             -- 元資料
    )),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(evidence_id, related_table, related_id)
);

-- PDF出力テンプレート
CREATE TABLE IF NOT EXISTS evidence_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'default',
    
    template_code TEXT NOT NULL,
    template_name TEXT NOT NULL,
    template_type TEXT NOT NULL CHECK (template_type IN (
        'police_kobutsu',
        'tax_expense',
        'tax_journal',
        'customs',
        'generic_report'
    )),
    
    -- テンプレート内容
    html_template TEXT NOT NULL,                 -- HTMLテンプレート
    css_styles TEXT,                             -- CSSスタイル
    
    -- フィールドマッピング
    field_mapping JSONB NOT NULL,
    -- {"transaction_date": "{{ledger.transaction_date}}", ...}
    
    -- 出力設定
    page_size TEXT DEFAULT 'A4',
    orientation TEXT DEFAULT 'portrait',
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(tenant_id, template_code)
);

-- エビデンス出力履歴
CREATE TABLE IF NOT EXISTS evidence_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'default',
    
    -- エクスポート情報
    export_type TEXT NOT NULL,
    template_id UUID REFERENCES evidence_templates(id),
    
    -- 対象期間
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- 含まれるエビデンス
    evidence_ids UUID[] NOT NULL,
    record_count INTEGER NOT NULL,
    
    -- 出力ファイル
    output_file_path TEXT,
    output_file_hash TEXT,
    
    -- ステータス
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'processing', 'completed', 'error'
    )),
    error_message TEXT,
    
    -- 提出情報
    submitted_to TEXT,
    submitted_at TIMESTAMPTZ,
    submission_reference TEXT,
    
    created_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_evidence_registry_tenant ON evidence_registry(tenant_id);
CREATE INDEX IF NOT EXISTS idx_evidence_registry_type ON evidence_registry(evidence_type);
CREATE INDEX IF NOT EXISTS idx_evidence_registry_timestamp ON evidence_registry(evidence_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_evidence_registry_hash ON evidence_registry(file_hash_sha256);
CREATE INDEX IF NOT EXISTS idx_evidence_relations_related ON evidence_relations(related_table, related_id);

-- ============================================================================
-- PART 5: MoneyForward突合用テーブル
-- ============================================================================

-- 銀行明細インポート
CREATE TABLE IF NOT EXISTS bank_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'default',
    
    -- 銀行情報
    bank_code TEXT,
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    account_name TEXT,
    
    -- 取引情報
    transaction_date DATE NOT NULL,
    value_date DATE,                             -- 起算日
    
    -- 金額
    transaction_type TEXT CHECK (transaction_type IN ('deposit', 'withdrawal')),
    amount NUMERIC(15,2) NOT NULL,
    balance_after NUMERIC(15,2),
    
    -- 摘要
    description TEXT,
    counterparty TEXT,
    reference_number TEXT,
    
    -- MFからのインポート
    mf_transaction_id TEXT,
    mf_category TEXT,
    mf_memo TEXT,
    
    -- マッチング
    matching_status TEXT DEFAULT 'unmatched' CHECK (matching_status IN (
        'unmatched',         -- 未照合
        'auto_matched',      -- 自動照合済み
        'manual_matched',    -- 手動照合済み
        'excluded',          -- 除外
        'suspicious'         -- 要確認
    )),
    matched_journal_id UUID REFERENCES journal_entries(id),
    matched_at TIMESTAMPTZ,
    matched_by TEXT,
    
    -- AI分析（次元13: Decision Trace）
    ai_suggestions JSONB DEFAULT '[]',
    -- [{"journal_id": "...", "confidence": 0.95, "reason": "金額一致、摘要類似"}]
    ai_category_guess TEXT,
    ai_confidence NUMERIC(5,2),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- プラットフォーム収益サマリー
CREATE TABLE IF NOT EXISTS platform_revenue_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL DEFAULT 'default',
    
    -- 集計期間
    summary_date DATE NOT NULL,
    period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
    
    -- プラットフォーム
    platform TEXT NOT NULL,                      -- ebay, amazon, qoo10, etc.
    account_id TEXT,
    
    -- 売上
    gross_sales NUMERIC(15,2) NOT NULL DEFAULT 0,
    refunds NUMERIC(15,2) NOT NULL DEFAULT 0,
    net_sales NUMERIC(15,2) GENERATED ALWAYS AS (gross_sales - refunds) STORED,
    
    -- 手数料
    platform_fees NUMERIC(15,2) NOT NULL DEFAULT 0,
    payment_fees NUMERIC(15,2) NOT NULL DEFAULT 0,
    shipping_fees NUMERIC(15,2) NOT NULL DEFAULT 0,
    promotion_fees NUMERIC(15,2) NOT NULL DEFAULT 0,
    other_fees NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_fees NUMERIC(15,2) GENERATED ALWAYS AS (
        platform_fees + payment_fees + shipping_fees + promotion_fees + other_fees
    ) STORED,
    
    -- 入金
    expected_payout NUMERIC(15,2),
    actual_payout NUMERIC(15,2),
    payout_date DATE,
    payout_reference TEXT,
    
    -- 突合状態
    reconciliation_status TEXT DEFAULT 'pending' CHECK (reconciliation_status IN (
        'pending', 'matched', 'discrepancy', 'resolved'
    )),
    discrepancy_amount NUMERIC(15,2),
    discrepancy_reason TEXT,
    
    -- 取引件数
    transaction_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(tenant_id, summary_date, period_type, platform, account_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_bank_statements_tenant ON bank_statements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bank_statements_date ON bank_statements(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_bank_statements_matching ON bank_statements(matching_status) WHERE matching_status = 'unmatched';
CREATE INDEX IF NOT EXISTS idx_platform_revenue_tenant ON platform_revenue_summary(tenant_id);
CREATE INDEX IF NOT EXISTS idx_platform_revenue_date ON platform_revenue_summary(summary_date DESC);

-- ============================================================================
-- PART 6: 初期データ・デフォルト設定
-- ============================================================================

-- デフォルト勘定科目
INSERT INTO chart_of_accounts (tenant_id, account_code, account_name, account_type, account_category, normal_balance, mf_account_code) VALUES
    -- 資産
    ('default', '1100', '現金', 'asset', '流動資産', 'debit', '1000'),
    ('default', '1110', '普通預金', 'asset', '流動資産', 'debit', '1010'),
    ('default', '1120', '当座預金', 'asset', '流動資産', 'debit', '1020'),
    ('default', '1200', '売掛金', 'asset', '流動資産', 'debit', '1100'),
    ('default', '1210', 'PayPal残高', 'asset', '流動資産', 'debit', NULL),
    ('default', '1220', 'eBay Managed Payment', 'asset', '流動資産', 'debit', NULL),
    ('default', '1300', '商品', 'asset', '流動資産', 'debit', '1400'),
    ('default', '1310', '仕入', 'asset', '流動資産', 'debit', '1410'),
    -- 負債
    ('default', '2100', '買掛金', 'liability', '流動負債', 'credit', '2100'),
    ('default', '2200', '未払金', 'liability', '流動負債', 'credit', '2200'),
    ('default', '2300', '預り金', 'liability', '流動負債', 'credit', '2300'),
    ('default', '2310', '仮受消費税', 'liability', '流動負債', 'credit', '2310'),
    -- 収益
    ('default', '4100', '売上高', 'revenue', '売上', 'credit', '4000'),
    ('default', '4110', 'eBay売上', 'revenue', '売上', 'credit', NULL),
    ('default', '4120', 'Amazon売上', 'revenue', '売上', 'credit', NULL),
    ('default', '4130', 'Qoo10売上', 'revenue', '売上', 'credit', NULL),
    ('default', '4200', '受取利息', 'revenue', '営業外収益', 'credit', '4500'),
    ('default', '4900', '売上値引', 'contra', '売上控除', 'debit', '4010'),
    -- 費用
    ('default', '5100', '仕入高', 'expense', '売上原価', 'debit', '5000'),
    ('default', '5200', '送料', 'expense', '販売費', 'debit', '5200'),
    ('default', '5300', '販売手数料', 'expense', '販売費', 'debit', '5300'),
    ('default', '5310', 'eBay手数料', 'expense', '販売費', 'debit', NULL),
    ('default', '5320', 'PayPal手数料', 'expense', '販売費', 'debit', NULL),
    ('default', '5400', '広告宣伝費', 'expense', '販売費', 'debit', '5400'),
    ('default', '5500', '通信費', 'expense', '一般管理費', 'debit', '5500'),
    ('default', '5600', '消耗品費', 'expense', '一般管理費', 'debit', '5600'),
    ('default', '5700', '支払手数料', 'expense', '一般管理費', 'debit', '5700'),
    ('default', '5800', '外注費', 'expense', '一般管理費', 'debit', '5800'),
    ('default', '5900', '雑費', 'expense', '一般管理費', 'debit', '5900')
ON CONFLICT (tenant_id, account_code) DO NOTHING;

-- デフォルト外注ロール
INSERT INTO hr_roles (tenant_id, role_code, role_name, permissions, hierarchy_level) VALUES
    ('default', 'ADMIN', '管理者', '{
        "workflows": ["*"],
        "read_tables": ["*"],
        "write_tables": ["*"],
        "max_batch_size": 1000,
        "require_approval_above": 500000,
        "prohibited_actions": []
    }'::jsonb, 0),
    ('default', 'MANAGER', 'マネージャー', '{
        "workflows": ["inventory_sync", "listing_reserve", "price_update", "order_process"],
        "read_tables": ["products_master", "listing_queue", "orders"],
        "write_tables": ["products_master", "listing_queue"],
        "max_batch_size": 200,
        "require_approval_above": 100000,
        "prohibited_actions": ["delete_product"]
    }'::jsonb, 1),
    ('default', 'OPERATOR', 'オペレーター', '{
        "workflows": ["inventory_sync", "listing_reserve"],
        "read_tables": ["products_master", "listing_queue"],
        "write_tables": ["listing_queue"],
        "max_batch_size": 50,
        "require_approval_above": 10000,
        "prohibited_actions": ["delete_product", "change_price_above_20pct"]
    }'::jsonb, 2),
    ('default', 'VIEWER', '閲覧者', '{
        "workflows": [],
        "read_tables": ["products_master"],
        "write_tables": [],
        "max_batch_size": 0,
        "require_approval_above": 0,
        "prohibited_actions": ["*"]
    }'::jsonb, 3)
ON CONFLICT (tenant_id, role_code) DO NOTHING;

-- デフォルトタスク定義
INSERT INTO hr_task_definitions (tenant_id, task_code, task_name, task_category, unit_type, base_unit_price, estimated_minutes_per_unit) VALUES
    ('default', 'LISTING_CREATE', '出品作成', 'listing', 'per_item', 50, 5),
    ('default', 'LISTING_EDIT', '出品編集', 'listing', 'per_item', 30, 3),
    ('default', 'INVENTORY_CHECK', '在庫確認', 'inventory', 'per_item', 10, 1),
    ('default', 'PHOTO_EDIT', '画像編集', 'media', 'per_item', 100, 10),
    ('default', 'DESCRIPTION_WRITE', '商品説明作成', 'content', 'per_item', 80, 8),
    ('default', 'ORDER_PROCESS', '注文処理', 'fulfillment', 'per_item', 50, 5),
    ('default', 'CUSTOMER_SUPPORT', 'カスタマー対応', 'support', 'per_hour', 1500, 60),
    ('default', 'DATA_ENTRY', 'データ入力', 'admin', 'per_batch', 500, 30)
ON CONFLICT (tenant_id, task_code) DO NOTHING;

-- デフォルト自動仕訳ルール
INSERT INTO auto_journal_rules (tenant_id, rule_name, priority, match_conditions, journal_template, auto_approve_threshold) VALUES
    ('default', 'eBay売上仕訳', 10, 
     '{"platform": ["ebay"], "transaction_type": ["sale"], "status": ["completed"]}'::jsonb,
     '{
       "description_template": "eBay売上 - {item_title}",
       "lines": [
         {"account_code": "1220", "debit": "{net_to_seller}", "credit": 0},
         {"account_code": "5310", "debit": "{final_value_fee}", "credit": 0},
         {"account_code": "5320", "debit": "{payment_processing_fee}", "credit": 0},
         {"account_code": "4110", "debit": 0, "credit": "{item_price}"},
         {"account_code": "5200", "debit": 0, "credit": "{shipping_collected}"}
       ]
     }'::jsonb, 50000),
    ('default', 'Amazon売上仕訳', 10,
     '{"platform": ["amazon"], "transaction_type": ["sale"], "status": ["completed"]}'::jsonb,
     '{
       "description_template": "Amazon売上 - {item_title}",
       "lines": [
         {"account_code": "1200", "debit": "{total_amount}", "credit": 0},
         {"account_code": "4120", "debit": 0, "credit": "{item_price}"}
       ]
     }'::jsonb, 50000),
    ('default', 'Yahoo仕入仕訳', 20,
     '{"platform": ["yahoo_auction"], "transaction_type": ["purchase"]}'::jsonb,
     '{
       "description_template": "仕入 - {item_title}",
       "lines": [
         {"account_code": "5100", "debit": "{purchase_price}", "credit": 0},
         {"account_code": "2100", "debit": 0, "credit": "{purchase_price}"}
       ]
     }'::jsonb, 30000)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PART 7: 更新トリガー
-- ============================================================================

-- 汎用updated_at更新トリガー関数（既存の場合はスキップ）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルにトリガー設定
DO $$
DECLARE
    tables TEXT[] := ARRAY[
        'dealer_license', 'dealer_ledger',
        'chart_of_accounts', 'journal_entries', 'auto_journal_rules',
        'hr_staff', 'hr_roles', 'hr_task_definitions', 'hr_work_logs', 'hr_payment_batches',
        'evidence_registry', 'evidence_templates',
        'bank_statements', 'platform_revenue_summary'
    ];
    t TEXT;
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS update_%s_updated_at ON %s',
            t, t
        );
        EXECUTE format(
            'CREATE TRIGGER update_%s_updated_at
             BEFORE UPDATE ON %s
             FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
            t, t
        );
    END LOOP;
END $$;

-- ============================================================================
-- PART 8: RLS（Row Level Security）- 次元3: Auth-Gate
-- ============================================================================

-- RLSを有効化
ALTER TABLE dealer_license ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entry_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_journal_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_task_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_work_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_payment_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_revenue_summary ENABLE ROW LEVEL SECURITY;

-- テナント分離ポリシー（サービスロールは全アクセス可）
CREATE POLICY tenant_isolation_dealer_license ON dealer_license
    USING (tenant_id = current_setting('app.current_tenant', true) OR current_setting('app.is_service_role', true) = 'true');

CREATE POLICY tenant_isolation_dealer_ledger ON dealer_ledger
    USING (tenant_id = current_setting('app.current_tenant', true) OR current_setting('app.is_service_role', true) = 'true');

CREATE POLICY tenant_isolation_chart_of_accounts ON chart_of_accounts
    USING (tenant_id = current_setting('app.current_tenant', true) OR current_setting('app.is_service_role', true) = 'true');

CREATE POLICY tenant_isolation_journal_entries ON journal_entries
    USING (tenant_id = current_setting('app.current_tenant', true) OR current_setting('app.is_service_role', true) = 'true');

CREATE POLICY tenant_isolation_hr_staff ON hr_staff
    USING (tenant_id = current_setting('app.current_tenant', true) OR current_setting('app.is_service_role', true) = 'true');

CREATE POLICY tenant_isolation_hr_roles ON hr_roles
    USING (tenant_id = current_setting('app.current_tenant', true) OR current_setting('app.is_service_role', true) = 'true');

CREATE POLICY tenant_isolation_evidence_registry ON evidence_registry
    USING (tenant_id = current_setting('app.current_tenant', true) OR current_setting('app.is_service_role', true) = 'true');

CREATE POLICY tenant_isolation_bank_statements ON bank_statements
    USING (tenant_id = current_setting('app.current_tenant', true) OR current_setting('app.is_service_role', true) = 'true');

-- ============================================================================
-- PART 9: 便利関数
-- ============================================================================

-- 次の仕訳番号を取得
CREATE OR REPLACE FUNCTION get_next_journal_number(p_tenant_id TEXT, p_fiscal_year INTEGER)
RETURNS TEXT AS $$
DECLARE
    v_max_number INTEGER;
    v_next_number TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(journal_number FROM 6) AS INTEGER)), 0)
    INTO v_max_number
    FROM journal_entries
    WHERE tenant_id = p_tenant_id
      AND fiscal_year = p_fiscal_year;
    
    v_next_number := p_fiscal_year::TEXT || '-' || LPAD((v_max_number + 1)::TEXT, 6, '0');
    RETURN v_next_number;
END;
$$ LANGUAGE plpgsql;

-- 仕訳の借方貸方合計を更新
CREATE OR REPLACE FUNCTION update_journal_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE journal_entries
    SET total_debit = (
            SELECT COALESCE(SUM(debit_amount), 0)
            FROM journal_entry_lines
            WHERE journal_entry_id = COALESCE(NEW.journal_entry_id, OLD.journal_entry_id)
        ),
        total_credit = (
            SELECT COALESCE(SUM(credit_amount), 0)
            FROM journal_entry_lines
            WHERE journal_entry_id = COALESCE(NEW.journal_entry_id, OLD.journal_entry_id)
        )
    WHERE id = COALESCE(NEW.journal_entry_id, OLD.journal_entry_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_journal_totals_trigger
    AFTER INSERT OR UPDATE OR DELETE ON journal_entry_lines
    FOR EACH ROW EXECUTE FUNCTION update_journal_totals();

-- 外注報酬を計算
CREATE OR REPLACE FUNCTION calculate_work_payment(p_work_log_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    v_log hr_work_logs%ROWTYPE;
    v_task hr_task_definitions%ROWTYPE;
    v_staff hr_staff%ROWTYPE;
    v_base_amount NUMERIC;
    v_bonus_amount NUMERIC := 0;
    v_total NUMERIC;
BEGIN
    SELECT * INTO v_log FROM hr_work_logs WHERE id = p_work_log_id;
    SELECT * INTO v_task FROM hr_task_definitions WHERE id = v_log.task_definition_id;
    SELECT * INTO v_staff FROM hr_staff WHERE id = v_log.staff_id;
    
    -- 基本報酬計算
    CASE v_task.unit_type
        WHEN 'per_item' THEN
            v_base_amount := v_task.base_unit_price * v_log.items_processed;
        WHEN 'per_hour' THEN
            v_base_amount := v_task.base_unit_price * (v_log.duration_minutes / 60.0);
        WHEN 'per_batch' THEN
            v_base_amount := v_task.base_unit_price * v_log.batches_completed;
        WHEN 'per_completion' THEN
            v_base_amount := v_task.base_unit_price;
        ELSE
            v_base_amount := 0;
    END CASE;
    
    -- 品質ボーナス
    IF v_task.quality_bonus_enabled AND v_log.quality_score >= v_task.quality_threshold THEN
        v_bonus_amount := v_base_amount * (v_task.quality_bonus_rate / 100.0);
    END IF;
    
    v_total := v_base_amount + v_bonus_amount;
    
    -- 月次上限チェック（次元22: 燃焼上限）
    IF v_staff.monthly_payment_cap IS NOT NULL THEN
        DECLARE
            v_current_month_total NUMERIC;
        BEGIN
            SELECT COALESCE(SUM(total_amount), 0)
            INTO v_current_month_total
            FROM hr_work_logs
            WHERE staff_id = v_log.staff_id
              AND work_date >= DATE_TRUNC('month', v_log.work_date)
              AND work_date < DATE_TRUNC('month', v_log.work_date) + INTERVAL '1 month'
              AND id != p_work_log_id;
            
            IF v_current_month_total + v_total > v_staff.monthly_payment_cap THEN
                v_total := GREATEST(0, v_staff.monthly_payment_cap - v_current_month_total);
            END IF;
        END;
    END IF;
    
    -- 更新
    UPDATE hr_work_logs
    SET calculated_amount = v_base_amount,
        bonus_amount = v_bonus_amount,
        total_amount = v_total
    WHERE id = p_work_log_id;
    
    RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- レコードハッシュを生成（改ざん検知用）
CREATE OR REPLACE FUNCTION generate_record_hash(p_table TEXT, p_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_record_json TEXT;
    v_hash TEXT;
BEGIN
    EXECUTE format(
        'SELECT row_to_json(t)::text FROM %I t WHERE id = $1',
        p_table
    ) INTO v_record_json USING p_id;
    
    v_hash := encode(sha256(v_record_json::bytea), 'hex');
    RETURN v_hash;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- V8.2 基盤完了
-- ============================================================================

COMMENT ON TABLE dealer_ledger IS 'N3 Empire OS V8.2: 古物台帳（古物営業法第16条準拠）';
COMMENT ON TABLE journal_entries IS 'N3 Empire OS V8.2: 仕訳台帳（発生主義会計準拠）';
COMMENT ON TABLE hr_staff IS 'N3 Empire OS V8.2: 外注スタッフマスター（RBAC対応）';
COMMENT ON TABLE evidence_registry IS 'N3 Empire OS V8.2: 証跡登録簿（法廷耐性対応）';
COMMENT ON TABLE bank_statements IS 'N3 Empire OS V8.2: 銀行明細（MF突合用）';
