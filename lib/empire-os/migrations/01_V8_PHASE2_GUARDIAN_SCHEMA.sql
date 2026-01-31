-- ========================================
-- N3 Empire OS V8 - Phase 2: 守護神ノードスキーマ
-- 作成日: 2025-01-24
-- バージョン: 8.0.2
-- 
-- 追加テーブル:
-- 1. core.browser_profiles - ブラウザ指紋・プロキシ管理
-- 2. core.policy_rules - ポリシー定義
-- 3. core.policy_violations - 違反検知ログ
-- 4. core.user_actions - HitL承認キュー
-- 5. core.robots_cache - robots.txtキャッシュ
-- ========================================

-- ========================================
-- [CORE] ブラウザプロファイル管理
-- Identity-Manager用：テナント別のプロキシ・指紋管理
-- ========================================

CREATE TABLE IF NOT EXISTS core.browser_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  
  -- プロファイル識別
  profile_code VARCHAR(50) NOT NULL,
  profile_name VARCHAR(100) NOT NULL,
  
  -- 対象プラットフォーム
  target_platform VARCHAR(50) NOT NULL, -- youtube, ebay, amazon, etc.
  target_region VARCHAR(10) DEFAULT 'JP', -- JP, US, UK, DE, etc.
  
  -- プロキシ設定
  proxy_config JSONB NOT NULL DEFAULT '{
    "type": "residential",
    "host": null,
    "port": null,
    "username": null,
    "password_vault_id": null,
    "country": "JP",
    "sticky_session": true,
    "rotation_interval_minutes": 0
  }'::jsonb,
  
  -- ブラウザ指紋設定
  fingerprint_config JSONB NOT NULL DEFAULT '{
    "user_agent": null,
    "accept_language": "ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7",
    "platform": "Win32",
    "screen_resolution": "1920x1080",
    "timezone": "Asia/Tokyo",
    "webgl_vendor": "Google Inc.",
    "webgl_renderer": "ANGLE (NVIDIA GeForce GTX 1060)",
    "canvas_noise": 0.0001,
    "audio_noise": 0.0001,
    "ja4_fingerprint": null,
    "tls_fingerprint": null
  }'::jsonb,
  
  -- Cookie/セッション設定
  session_config JSONB DEFAULT '{
    "persist_cookies": true,
    "cookie_vault_id": null,
    "session_lifetime_hours": 24,
    "auto_refresh": true
  }'::jsonb,
  
  -- 使用状況
  usage_stats JSONB DEFAULT '{
    "total_requests": 0,
    "successful_requests": 0,
    "failed_requests": 0,
    "last_success_at": null,
    "last_failure_at": null,
    "ban_count": 0,
    "last_ban_at": null
  }'::jsonb,
  
  -- ステータス
  is_active BOOLEAN DEFAULT true,
  health_status VARCHAR(20) DEFAULT 'healthy', -- healthy, degraded, banned, unknown
  last_health_check_at TIMESTAMPTZ,
  
  -- メタ
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, profile_code, target_platform)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_browser_profiles_tenant ON core.browser_profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_browser_profiles_platform ON core.browser_profiles(target_platform);
CREATE INDEX IF NOT EXISTS idx_browser_profiles_active ON core.browser_profiles(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_browser_profiles_health ON core.browser_profiles(health_status);

-- ========================================
-- [CORE] ポリシールール定義
-- Policy-Validator用：検閲ルール管理
-- ========================================

CREATE TABLE IF NOT EXISTS core.policy_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ルール識別
  rule_code VARCHAR(100) UNIQUE NOT NULL,
  rule_name VARCHAR(200) NOT NULL,
  rule_category VARCHAR(50) NOT NULL, -- robots_txt, tos_violation, legal_risk, content_safety, rate_limit
  
  -- ルール定義
  rule_definition JSONB NOT NULL DEFAULT '{
    "type": "pattern",
    "patterns": [],
    "severity": "warning",
    "action": "flag",
    "ai_check_required": false
  }'::jsonb,
  
  -- 適用範囲
  applies_to JSONB DEFAULT '{
    "platforms": ["*"],
    "regions": ["*"],
    "content_types": ["*"],
    "plan_types": ["*"]
  }'::jsonb,
  
  -- アクション設定
  action_config JSONB DEFAULT '{
    "on_match": "flag",
    "require_approval": false,
    "auto_reject": false,
    "notify_admin": false,
    "log_level": "info"
  }'::jsonb,
  
  -- 優先度（低いほど先に評価）
  priority INTEGER DEFAULT 100,
  
  -- ステータス
  is_active BOOLEAN DEFAULT true,
  is_system_rule BOOLEAN DEFAULT false, -- システム標準ルールか
  
  -- メタ
  description TEXT,
  examples JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- システム標準ルールの挿入
INSERT INTO core.policy_rules (rule_code, rule_name, rule_category, rule_definition, is_system_rule, priority) VALUES
-- robots.txt違反チェック
('ROBOTS_DISALLOW', 'robots.txt Disallow検知', 'robots_txt', '{
  "type": "robots_check",
  "severity": "error",
  "action": "stop"
}'::jsonb, true, 10),

-- レート制限
('RATE_LIMIT_EXCEEDED', 'レート制限超過検知', 'rate_limit', '{
  "type": "rate_check",
  "severity": "warning",
  "action": "delay"
}'::jsonb, true, 20),

-- ToS違反ワード
('TOS_VIOLATION_WORDS', 'ToS違反ワード検知', 'tos_violation', '{
  "type": "pattern",
  "patterns": ["guaranteed profit", "100% returns", "no risk", "確実に稼げる", "絶対儲かる", "リスクゼロ"],
  "severity": "error",
  "action": "stop",
  "ai_check_required": false
}'::jsonb, true, 30),

-- 法的リスク（断定的助言）
('LEGAL_ADVICE_WARNING', '法的助言リスク検知', 'legal_risk', '{
  "type": "pattern",
  "patterns": ["必ず〜してください", "絶対に〜すべき", "〜しなければ違法", "法律で禁止されて", "This is legal advice"],
  "severity": "warning",
  "action": "flag",
  "ai_check_required": true
}'::jsonb, true, 40),

-- 医療アドバイス警告
('MEDICAL_ADVICE_WARNING', '医療助言リスク検知', 'legal_risk', '{
  "type": "pattern",
  "patterns": ["治療効果", "病気が治る", "医師の処方なしで", "cure", "medical treatment"],
  "severity": "error",
  "action": "stop",
  "ai_check_required": true
}'::jsonb, true, 41),

-- 金融アドバイス警告
('FINANCIAL_ADVICE_WARNING', '金融助言リスク検知', 'legal_risk', '{
  "type": "pattern",
  "patterns": ["投資助言", "financial advice", "buy this stock", "guaranteed returns", "元本保証"],
  "severity": "warning",
  "action": "flag",
  "ai_check_required": true
}'::jsonb, true, 42),

-- 著作権侵害リスク
('COPYRIGHT_RISK', '著作権侵害リスク検知', 'content_safety', '{
  "type": "ai_check",
  "severity": "error",
  "action": "stop",
  "ai_prompt": "Check if this content potentially infringes copyright"
}'::jsonb, true, 50),

-- 個人情報漏洩リスク
('PII_LEAK_RISK', '個人情報漏洩リスク検知', 'content_safety', '{
  "type": "pattern",
  "patterns": ["[0-9]{3}-[0-9]{4}-[0-9]{4}", "[0-9]{4}[- ]?[0-9]{4}[- ]?[0-9]{4}[- ]?[0-9]{4}", "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"],
  "regex": true,
  "severity": "warning",
  "action": "flag"
}'::jsonb, true, 60)
ON CONFLICT (rule_code) DO NOTHING;

-- インデックス
CREATE INDEX IF NOT EXISTS idx_policy_rules_category ON core.policy_rules(rule_category);
CREATE INDEX IF NOT EXISTS idx_policy_rules_active ON core.policy_rules(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_policy_rules_priority ON core.policy_rules(priority);

-- ========================================
-- [CORE] ポリシー違反ログ
-- 検知された違反の記録
-- ========================================

CREATE TABLE IF NOT EXISTS core.policy_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id),
  
  -- 違反内容
  rule_id UUID REFERENCES core.policy_rules(id),
  rule_code VARCHAR(100),
  
  -- 対象コンテンツ
  content_type VARCHAR(50), -- listing, video_script, blog_post, api_request, etc.
  content_id VARCHAR(100),
  content_preview TEXT, -- 違反箇所の抜粋（最大500文字）
  
  -- 検知結果
  severity VARCHAR(20) NOT NULL, -- info, warning, error, critical
  matched_pattern TEXT,
  confidence_score DECIMAL(5,2), -- AI判定の場合の確信度
  
  -- アクション
  action_taken VARCHAR(50) NOT NULL, -- flagged, stopped, approved, rejected, pending
  requires_human_review BOOLEAN DEFAULT false,
  human_reviewed_at TIMESTAMPTZ,
  human_reviewed_by UUID,
  human_decision VARCHAR(50), -- approved, rejected, escalated
  human_notes TEXT,
  
  -- コンテキスト
  context JSONB DEFAULT '{}'::jsonb,
  
  -- メタ
  workflow_id VARCHAR(100),
  execution_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_policy_violations_tenant ON core.policy_violations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_policy_violations_rule ON core.policy_violations(rule_code);
CREATE INDEX IF NOT EXISTS idx_policy_violations_severity ON core.policy_violations(severity);
CREATE INDEX IF NOT EXISTS idx_policy_violations_action ON core.policy_violations(action_taken);
CREATE INDEX IF NOT EXISTS idx_policy_violations_pending ON core.policy_violations(requires_human_review, human_reviewed_at) 
  WHERE requires_human_review = true AND human_reviewed_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_policy_violations_created ON core.policy_violations(created_at);

-- ========================================
-- [CORE] Human-in-the-Loop 承認キュー
-- ========================================

CREATE TABLE IF NOT EXISTS core.user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id),
  
  -- アクション識別
  action_type VARCHAR(100) NOT NULL, -- publish_listing, send_message, execute_trade, etc.
  action_code VARCHAR(200) UNIQUE NOT NULL, -- 一意のアクションコード（n8n Wait用）
  
  -- 対象
  target_type VARCHAR(50), -- product, order, message, video, etc.
  target_id VARCHAR(100),
  target_title VARCHAR(500),
  target_preview TEXT,
  
  -- 承認状態
  status VARCHAR(30) NOT NULL DEFAULT 'pending', -- pending, approved, rejected, expired, cancelled
  
  -- 承認要求
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  requested_by VARCHAR(100), -- workflow_id or user_id
  request_reason TEXT,
  request_context JSONB DEFAULT '{}'::jsonb,
  
  -- 期限
  expires_at TIMESTAMPTZ,
  
  -- 承認結果
  decided_at TIMESTAMPTZ,
  decided_by UUID,
  decision VARCHAR(30), -- approved, rejected
  decision_reason TEXT,
  
  -- n8n連携
  workflow_id VARCHAR(100),
  execution_id VARCHAR(100),
  callback_url TEXT, -- n8n Webhook URL for callback
  
  -- 通知
  notification_sent BOOLEAN DEFAULT false,
  notification_channels JSONB DEFAULT '["chatwork", "email"]'::jsonb,
  
  -- メタ
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_user_actions_tenant ON core.user_actions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_status ON core.user_actions(status);
CREATE INDEX IF NOT EXISTS idx_user_actions_pending ON core.user_actions(status, expires_at) 
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_user_actions_action_code ON core.user_actions(action_code);
CREATE INDEX IF NOT EXISTS idx_user_actions_workflow ON core.user_actions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_created ON core.user_actions(created_at);

-- ========================================
-- [CORE] robots.txt キャッシュ
-- ========================================

CREATE TABLE IF NOT EXISTS core.robots_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ドメイン
  domain VARCHAR(255) NOT NULL,
  
  -- robots.txt内容
  robots_content TEXT,
  parsed_rules JSONB DEFAULT '{
    "disallow": [],
    "allow": [],
    "crawl_delay": null,
    "sitemap": []
  }'::jsonb,
  
  -- 取得状態
  fetch_status VARCHAR(20) DEFAULT 'pending', -- pending, success, not_found, error
  fetch_error TEXT,
  
  -- キャッシュ管理
  fetched_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(domain)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_robots_cache_domain ON core.robots_cache(domain);
CREATE INDEX IF NOT EXISTS idx_robots_cache_expires ON core.robots_cache(expires_at);

-- ========================================
-- 関数: 承認待ちアクション作成
-- ========================================

CREATE OR REPLACE FUNCTION create_pending_action(
  p_tenant_id UUID,
  p_action_type VARCHAR(100),
  p_target_type VARCHAR(50),
  p_target_id VARCHAR(100),
  p_target_title VARCHAR(500),
  p_request_reason TEXT,
  p_request_context JSONB,
  p_workflow_id VARCHAR(100),
  p_execution_id VARCHAR(100),
  p_callback_url TEXT,
  p_expires_in_minutes INTEGER DEFAULT 60
)
RETURNS TABLE(action_id UUID, action_code VARCHAR(200)) AS $$
DECLARE
  v_action_id UUID;
  v_action_code VARCHAR(200);
BEGIN
  v_action_id := gen_random_uuid();
  v_action_code := 'ACT_' || REPLACE(v_action_id::TEXT, '-', '') || '_' || EXTRACT(EPOCH FROM NOW())::BIGINT;
  
  INSERT INTO core.user_actions (
    id, tenant_id, action_type, action_code, target_type, target_id, target_title,
    status, request_reason, request_context, workflow_id, execution_id, callback_url,
    expires_at
  ) VALUES (
    v_action_id, p_tenant_id, p_action_type, v_action_code, p_target_type, p_target_id, p_target_title,
    'pending', p_request_reason, p_request_context, p_workflow_id, p_execution_id, p_callback_url,
    NOW() + (p_expires_in_minutes || ' minutes')::INTERVAL
  );
  
  RETURN QUERY SELECT v_action_id, v_action_code;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 関数: 承認/拒否処理
-- ========================================

CREATE OR REPLACE FUNCTION process_action_decision(
  p_action_code VARCHAR(200),
  p_decision VARCHAR(30),
  p_decided_by UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_action RECORD;
  v_result JSONB;
BEGIN
  -- アクション取得
  SELECT * INTO v_action FROM core.user_actions WHERE action_code = p_action_code FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Action not found');
  END IF;
  
  IF v_action.status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Action is not pending', 'current_status', v_action.status);
  END IF;
  
  IF v_action.expires_at < NOW() THEN
    UPDATE core.user_actions SET status = 'expired', updated_at = NOW() WHERE id = v_action.id;
    RETURN jsonb_build_object('success', false, 'error', 'Action has expired');
  END IF;
  
  -- 更新
  UPDATE core.user_actions SET
    status = CASE WHEN p_decision = 'approved' THEN 'approved' ELSE 'rejected' END,
    decided_at = NOW(),
    decided_by = p_decided_by,
    decision = p_decision,
    decision_reason = p_reason,
    updated_at = NOW()
  WHERE id = v_action.id;
  
  v_result := jsonb_build_object(
    'success', true,
    'action_id', v_action.id,
    'action_code', v_action.action_code,
    'decision', p_decision,
    'callback_url', v_action.callback_url,
    'workflow_id', v_action.workflow_id,
    'execution_id', v_action.execution_id
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 関数: 期限切れアクションの自動処理
-- ========================================

CREATE OR REPLACE FUNCTION expire_pending_actions()
RETURNS INTEGER AS $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE core.user_actions 
  SET status = 'expired', updated_at = NOW()
  WHERE status = 'pending' AND expires_at < NOW();
  
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 関数: robots.txt チェック
-- ========================================

CREATE OR REPLACE FUNCTION check_robots_txt(
  p_domain VARCHAR(255),
  p_path VARCHAR(1000),
  p_user_agent VARCHAR(100) DEFAULT '*'
)
RETURNS JSONB AS $$
DECLARE
  v_cache RECORD;
  v_rules JSONB;
  v_allowed BOOLEAN := true;
  v_rule TEXT;
BEGIN
  -- キャッシュ取得
  SELECT * INTO v_cache FROM core.robots_cache 
  WHERE domain = p_domain AND expires_at > NOW();
  
  IF NOT FOUND THEN
    -- キャッシュなし or 期限切れ
    RETURN jsonb_build_object(
      'allowed', true,
      'cached', false,
      'reason', 'No cache available, fetch required'
    );
  END IF;
  
  IF v_cache.fetch_status != 'success' THEN
    -- robots.txt取得失敗 → 許可
    RETURN jsonb_build_object(
      'allowed', true,
      'cached', true,
      'reason', 'robots.txt not found or error'
    );
  END IF;
  
  v_rules := v_cache.parsed_rules;
  
  -- Disallowチェック
  FOR v_rule IN SELECT jsonb_array_elements_text(v_rules->'disallow')
  LOOP
    IF p_path LIKE v_rule || '%' THEN
      v_allowed := false;
      EXIT;
    END IF;
  END LOOP;
  
  -- Allowチェック（Disallowより優先）
  IF NOT v_allowed THEN
    FOR v_rule IN SELECT jsonb_array_elements_text(v_rules->'allow')
    LOOP
      IF p_path LIKE v_rule || '%' THEN
        v_allowed := true;
        EXIT;
      END IF;
    END LOOP;
  END IF;
  
  RETURN jsonb_build_object(
    'allowed', v_allowed,
    'cached', true,
    'domain', p_domain,
    'path', p_path,
    'crawl_delay', v_rules->>'crawl_delay'
  );
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- ビュー: 承認待ちダッシュボード用
-- ========================================

CREATE OR REPLACE VIEW core.pending_actions_summary AS
SELECT 
  tenant_id,
  action_type,
  COUNT(*) as pending_count,
  MIN(requested_at) as oldest_request,
  MAX(expires_at) as nearest_expiry
FROM core.user_actions
WHERE status = 'pending'
GROUP BY tenant_id, action_type;

-- ========================================
-- ビュー: ポリシー違反サマリー
-- ========================================

CREATE OR REPLACE VIEW core.violation_summary_daily AS
SELECT 
  pv.tenant_id,
  DATE(pv.created_at) as violation_date,
  pr.rule_category,
  pv.severity,
  COUNT(*) as violation_count
FROM core.policy_violations pv
JOIN core.policy_rules pr ON pv.rule_id = pr.id
WHERE pv.created_at > NOW() - INTERVAL '30 days'
GROUP BY pv.tenant_id, DATE(pv.created_at), pr.rule_category, pv.severity;

-- ========================================
-- トリガー: updated_at自動更新
-- ========================================

DO $$
BEGIN
  -- browser_profiles
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_browser_profiles_updated_at') THEN
    CREATE TRIGGER update_browser_profiles_updated_at BEFORE UPDATE ON core.browser_profiles
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- policy_rules
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_policy_rules_updated_at') THEN
    CREATE TRIGGER update_policy_rules_updated_at BEFORE UPDATE ON core.policy_rules
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- user_actions
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_actions_updated_at') THEN
    CREATE TRIGGER update_user_actions_updated_at BEFORE UPDATE ON core.user_actions
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- robots_cache
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_robots_cache_updated_at') THEN
    CREATE TRIGGER update_robots_cache_updated_at BEFORE UPDATE ON core.robots_cache
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ========================================
-- RLS有効化
-- ========================================

ALTER TABLE core.browser_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.policy_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.policy_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.robots_cache ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 完了
-- ========================================

COMMENT ON TABLE core.browser_profiles IS 'N3 Empire OS V8 Phase 2 - ブラウザプロファイル管理（Identity-Manager用）';
COMMENT ON TABLE core.policy_rules IS 'N3 Empire OS V8 Phase 2 - ポリシールール定義（Policy-Validator用）';
COMMENT ON TABLE core.policy_violations IS 'N3 Empire OS V8 Phase 2 - ポリシー違反ログ';
COMMENT ON TABLE core.user_actions IS 'N3 Empire OS V8 Phase 2 - Human-in-the-Loop承認キュー';
COMMENT ON TABLE core.robots_cache IS 'N3 Empire OS V8 Phase 2 - robots.txtキャッシュ';
