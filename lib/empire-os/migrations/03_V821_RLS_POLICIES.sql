-- ========================================
-- N3 Empire OS V8.2.1 - RLSポリシー追加
-- オーナーUI連携用
-- ========================================

-- ========================================
-- ai_decision_traces ポリシー
-- ========================================

-- オーナーは全テナントのAI判断証跡を閲覧可能
DROP POLICY IF EXISTS "owner_select_ai_decision_traces" ON core.ai_decision_traces;
CREATE POLICY "owner_select_ai_decision_traces" ON core.ai_decision_traces
  FOR SELECT
  USING (
    -- オーナーテナント（is_owner=true）は全て閲覧可能
    EXISTS (
      SELECT 1 FROM core.tenants t 
      WHERE t.is_owner = true 
      AND t.tenant_code = 'OWNER'
    )
    OR
    -- 自テナントのデータは閲覧可能
    tenant_id = (SELECT id FROM core.tenants WHERE tenant_code = current_setting('app.current_tenant', true))
  );

-- テナントは自分のAI判断証跡のみ閲覧可能
DROP POLICY IF EXISTS "tenant_select_ai_decision_traces" ON core.ai_decision_traces;
CREATE POLICY "tenant_select_ai_decision_traces" ON core.ai_decision_traces
  FOR SELECT
  USING (
    tenant_id = (SELECT id FROM core.tenants WHERE tenant_code = current_setting('app.current_tenant', true))
  );

-- システム（service_role）は全て操作可能
DROP POLICY IF EXISTS "service_all_ai_decision_traces" ON core.ai_decision_traces;
CREATE POLICY "service_all_ai_decision_traces" ON core.ai_decision_traces
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- ========================================
-- api_consumption_limits ポリシー
-- ========================================

-- オーナーは全テナントのAPI消費制限を閲覧・更新可能
DROP POLICY IF EXISTS "owner_all_api_consumption_limits" ON core.api_consumption_limits;
CREATE POLICY "owner_all_api_consumption_limits" ON core.api_consumption_limits
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM core.tenants t 
      WHERE t.is_owner = true 
      AND t.tenant_code = 'OWNER'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM core.tenants t 
      WHERE t.is_owner = true 
      AND t.tenant_code = 'OWNER'
    )
  );

-- テナントは自分のAPI消費制限を閲覧可能（更新は不可）
DROP POLICY IF EXISTS "tenant_select_api_consumption_limits" ON core.api_consumption_limits;
CREATE POLICY "tenant_select_api_consumption_limits" ON core.api_consumption_limits
  FOR SELECT
  USING (
    tenant_id = (SELECT id FROM core.tenants WHERE tenant_code = current_setting('app.current_tenant', true))
  );

-- システム（service_role）は全て操作可能
DROP POLICY IF EXISTS "service_all_api_consumption_limits" ON core.api_consumption_limits;
CREATE POLICY "service_all_api_consumption_limits" ON core.api_consumption_limits
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- ========================================
-- category_listing_quotas ポリシー
-- ========================================

-- オーナーは全テナントのカテゴリ枠を閲覧・更新可能
DROP POLICY IF EXISTS "owner_all_category_listing_quotas" ON commerce.category_listing_quotas;
CREATE POLICY "owner_all_category_listing_quotas" ON commerce.category_listing_quotas
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM core.tenants t 
      WHERE t.is_owner = true 
      AND t.tenant_code = 'OWNER'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM core.tenants t 
      WHERE t.is_owner = true 
      AND t.tenant_code = 'OWNER'
    )
  );

-- テナントは自分のカテゴリ枠を閲覧可能
DROP POLICY IF EXISTS "tenant_select_category_listing_quotas" ON commerce.category_listing_quotas;
CREATE POLICY "tenant_select_category_listing_quotas" ON commerce.category_listing_quotas
  FOR SELECT
  USING (
    tenant_id = (SELECT id FROM core.tenants WHERE tenant_code = current_setting('app.current_tenant', true))
  );

-- システム（service_role）は全て操作可能
DROP POLICY IF EXISTS "service_all_category_listing_quotas" ON commerce.category_listing_quotas;
CREATE POLICY "service_all_category_listing_quotas" ON commerce.category_listing_quotas
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- ========================================
-- night_shift_queue ポリシー
-- ========================================

-- オーナーは全テナントの夜間シフトキューを操作可能
DROP POLICY IF EXISTS "owner_all_night_shift_queue" ON commerce.night_shift_queue;
CREATE POLICY "owner_all_night_shift_queue" ON commerce.night_shift_queue
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM core.tenants t 
      WHERE t.is_owner = true 
      AND t.tenant_code = 'OWNER'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM core.tenants t 
      WHERE t.is_owner = true 
      AND t.tenant_code = 'OWNER'
    )
  );

-- テナントは自分のキューを閲覧・更新可能
DROP POLICY IF EXISTS "tenant_all_night_shift_queue" ON commerce.night_shift_queue;
CREATE POLICY "tenant_all_night_shift_queue" ON commerce.night_shift_queue
  FOR ALL
  USING (
    tenant_id = (SELECT id FROM core.tenants WHERE tenant_code = current_setting('app.current_tenant', true))
  )
  WITH CHECK (
    tenant_id = (SELECT id FROM core.tenants WHERE tenant_code = current_setting('app.current_tenant', true))
  );

-- システム（service_role）は全て操作可能
DROP POLICY IF EXISTS "service_all_night_shift_queue" ON commerce.night_shift_queue;
CREATE POLICY "service_all_night_shift_queue" ON commerce.night_shift_queue
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- ========================================
-- workflow_registry ポリシー
-- ========================================

-- オーナーは全ワークフローレジストリを操作可能
DROP POLICY IF EXISTS "owner_all_workflow_registry" ON core.workflow_registry;
CREATE POLICY "owner_all_workflow_registry" ON core.workflow_registry
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM core.tenants t 
      WHERE t.is_owner = true 
      AND t.tenant_code = 'OWNER'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM core.tenants t 
      WHERE t.is_owner = true 
      AND t.tenant_code = 'OWNER'
    )
  );

-- テナントは自分のワークフローを閲覧可能
DROP POLICY IF EXISTS "tenant_select_workflow_registry" ON core.workflow_registry;
CREATE POLICY "tenant_select_workflow_registry" ON core.workflow_registry
  FOR SELECT
  USING (
    tenant_id IS NULL -- グローバルワークフロー
    OR tenant_id = (SELECT id FROM core.tenants WHERE tenant_code = current_setting('app.current_tenant', true))
  );

-- システム（service_role）は全て操作可能
DROP POLICY IF EXISTS "service_all_workflow_registry" ON core.workflow_registry;
CREATE POLICY "service_all_workflow_registry" ON core.workflow_registry
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- ========================================
-- 汎用RLSポリシー（その他の新規テーブル用）
-- ========================================

-- inventory_monitoring_config
DROP POLICY IF EXISTS "owner_all_inventory_monitoring_config" ON commerce.inventory_monitoring_config;
CREATE POLICY "owner_all_inventory_monitoring_config" ON commerce.inventory_monitoring_config
  FOR ALL USING (true) WITH CHECK (true); -- 暫定: 全許可（後で制限追加）

DROP POLICY IF EXISTS "service_all_inventory_monitoring_config" ON commerce.inventory_monitoring_config;
CREATE POLICY "service_all_inventory_monitoring_config" ON commerce.inventory_monitoring_config
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- inventory_sync_logs
DROP POLICY IF EXISTS "service_all_inventory_sync_logs" ON commerce.inventory_sync_logs;
CREATE POLICY "service_all_inventory_sync_logs" ON commerce.inventory_sync_logs
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- price_history
DROP POLICY IF EXISTS "service_all_price_history" ON commerce.price_history;
CREATE POLICY "service_all_price_history" ON commerce.price_history
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- competitor_tracking
DROP POLICY IF EXISTS "service_all_competitor_tracking" ON commerce.competitor_tracking;
CREATE POLICY "service_all_competitor_tracking" ON commerce.competitor_tracking
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- mj_assets
DROP POLICY IF EXISTS "service_all_mj_assets" ON media.mj_assets;
CREATE POLICY "service_all_mj_assets" ON media.mj_assets
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- content_templates
DROP POLICY IF EXISTS "service_all_content_templates" ON media.content_templates;
CREATE POLICY "service_all_content_templates" ON media.content_templates
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- user_progress
DROP POLICY IF EXISTS "service_all_user_progress" ON media.user_progress;
CREATE POLICY "service_all_user_progress" ON media.user_progress
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- weak_points
DROP POLICY IF EXISTS "service_all_weak_points" ON media.weak_points;
CREATE POLICY "service_all_weak_points" ON media.weak_points
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- workflow_executions
DROP POLICY IF EXISTS "service_all_workflow_executions" ON core.workflow_executions;
CREATE POLICY "service_all_workflow_executions" ON core.workflow_executions
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- notification_templates
DROP POLICY IF EXISTS "service_all_notification_templates" ON core.notification_templates;
CREATE POLICY "service_all_notification_templates" ON core.notification_templates
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- notification_logs
DROP POLICY IF EXISTS "service_all_notification_logs" ON core.notification_logs;
CREATE POLICY "service_all_notification_logs" ON core.notification_logs
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- api_key_rotations
DROP POLICY IF EXISTS "service_all_api_key_rotations" ON core.api_key_rotations;
CREATE POLICY "service_all_api_key_rotations" ON core.api_key_rotations
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- audit_logs
DROP POLICY IF EXISTS "service_all_audit_logs" ON core.audit_logs;
CREATE POLICY "service_all_audit_logs" ON core.audit_logs
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- daily_metrics
DROP POLICY IF EXISTS "service_all_daily_metrics" ON finance.daily_metrics;
CREATE POLICY "service_all_daily_metrics" ON finance.daily_metrics
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- category_performance
DROP POLICY IF EXISTS "service_all_category_performance" ON finance.category_performance;
CREATE POLICY "service_all_category_performance" ON finance.category_performance
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- proxy_pool
DROP POLICY IF EXISTS "service_all_proxy_pool" ON core.proxy_pool;
CREATE POLICY "service_all_proxy_pool" ON core.proxy_pool
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- ban_detection_logs
DROP POLICY IF EXISTS "service_all_ban_detection_logs" ON core.ban_detection_logs;
CREATE POLICY "service_all_ban_detection_logs" ON core.ban_detection_logs
  FOR ALL
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');

-- ========================================
-- API消費記録用RPC関数
-- ========================================

CREATE OR REPLACE FUNCTION record_api_consumption(
  p_tenant_id UUID,
  p_api_provider VARCHAR(50),
  p_amount DECIMAL(15,2),
  p_api_endpoint VARCHAR(200) DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_limit RECORD;
  v_exceeded BOOLEAN;
  v_action VARCHAR(50);
BEGIN
  -- 該当の制限設定を取得（最も具体的なもの）
  SELECT * INTO v_limit
  FROM core.api_consumption_limits
  WHERE tenant_id = p_tenant_id
    AND api_provider = p_api_provider
    AND is_active = true
    AND (api_endpoint = p_api_endpoint OR api_endpoint IS NULL)
  ORDER BY api_endpoint NULLS LAST
  LIMIT 1
  FOR UPDATE;
  
  -- 制限設定がない場合は新規作成
  IF NOT FOUND THEN
    INSERT INTO core.api_consumption_limits (
      tenant_id, api_provider, api_endpoint, 
      budget_type, budget_amount, budget_currency,
      current_consumption, last_reset_at
    ) VALUES (
      p_tenant_id, p_api_provider, p_api_endpoint,
      'monthly', 1000, 'USD',
      p_amount, NOW()
    )
    RETURNING * INTO v_limit;
    
    RETURN jsonb_build_object(
      'success', true,
      'limit_id', v_limit.id,
      'consumed', p_amount,
      'budget', v_limit.budget_amount,
      'exceeded', false,
      'action', 'continue'
    );
  END IF;
  
  -- 消費量更新
  UPDATE core.api_consumption_limits
  SET 
    current_consumption = current_consumption + p_amount,
    updated_at = NOW()
  WHERE id = v_limit.id;
  
  -- 超過判定
  v_exceeded := (v_limit.current_consumption + p_amount) >= v_limit.budget_amount;
  v_action := CASE
    WHEN v_exceeded AND v_limit.on_limit_exceeded = 'pause' THEN 'pause'
    WHEN v_exceeded AND v_limit.on_limit_exceeded = 'degrade' THEN 'degrade'
    ELSE 'continue'
  END;
  
  -- 超過時にアラート送信フラグ更新
  IF v_exceeded AND v_limit.alert_sent_at IS NULL THEN
    UPDATE core.api_consumption_limits
    SET alert_sent_at = NOW()
    WHERE id = v_limit.id;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'limit_id', v_limit.id,
    'consumed', v_limit.current_consumption + p_amount,
    'budget', v_limit.budget_amount,
    'exceeded', v_exceeded,
    'action', v_action,
    'degraded_model', CASE WHEN v_action = 'degrade' THEN v_limit.degraded_model ELSE NULL END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 完了
-- ========================================

DO $$
BEGIN
  RAISE NOTICE 'N3 Empire OS V8.2.1 RLSポリシー追加完了';
  RAISE NOTICE '- ai_decision_traces: オーナー閲覧ポリシー';
  RAISE NOTICE '- api_consumption_limits: オーナー更新ポリシー';
  RAISE NOTICE '- category_listing_quotas: テナント制限ポリシー';
  RAISE NOTICE '- night_shift_queue: テナント操作ポリシー';
  RAISE NOTICE '- その他新規テーブル: service_roleポリシー';
END $$;
