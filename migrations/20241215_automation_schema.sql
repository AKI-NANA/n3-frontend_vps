-- N3 自動化完全対応マイグレーション
-- 2024-12-15

-- =====================================================
-- 1. products_master: 出品スケジュール用カラム追加
-- =====================================================

ALTER TABLE products_master ADD COLUMN IF NOT EXISTS scheduled_marketplace TEXT;
ALTER TABLE products_master ADD COLUMN IF NOT EXISTS scheduled_account TEXT;
ALTER TABLE products_master ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
ALTER TABLE products_master ADD COLUMN IF NOT EXISTS schedule_status TEXT DEFAULT 'none';

-- schedule_status の値:
-- 'none' - スケジュールなし
-- 'scheduled' - スケジュール済み（待機中）
-- 'running' - 出品実行中
-- 'completed' - 出品完了
-- 'error' - エラー
-- 'cancelled' - キャンセル

COMMENT ON COLUMN products_master.scheduled_marketplace IS '出品予定マーケットプレイス (ebay, amazon, shopee など)';
COMMENT ON COLUMN products_master.scheduled_account IS '出品予定アカウント (MJT, GREEN など)';
COMMENT ON COLUMN products_master.scheduled_at IS '出品予定日時';
COMMENT ON COLUMN products_master.schedule_status IS 'スケジュール状態 (none, scheduled, running, completed, error, cancelled)';

-- インデックス追加（スケジュール検索用）
CREATE INDEX IF NOT EXISTS idx_products_master_schedule 
ON products_master (schedule_status, scheduled_at) 
WHERE schedule_status = 'scheduled';

-- =====================================================
-- 2. cron_settings: Cron実行設定テーブル
-- =====================================================

CREATE TABLE IF NOT EXISTS cron_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cron_type TEXT NOT NULL UNIQUE, -- 'listing' | 'inventory_monitoring' | 'inventory_sync'
  enabled BOOLEAN DEFAULT true,
  interval_minutes INTEGER DEFAULT 10,
  description TEXT,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  run_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  last_error TEXT,
  last_result JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE cron_settings IS 'VPS cronジョブの設定テーブル';
COMMENT ON COLUMN cron_settings.cron_type IS 'ジョブタイプ: listing=スケジュール出品, inventory_monitoring=無在庫監視, inventory_sync=有在庫同期';
COMMENT ON COLUMN cron_settings.interval_minutes IS '実行間隔（分）';

-- デフォルト値挿入
INSERT INTO cron_settings (cron_type, enabled, interval_minutes, description) VALUES
  ('listing', true, 10, 'スケジュール出品実行 - 設定した日時に自動で出品'),
  ('inventory_monitoring', true, 60, '無在庫商品の在庫監視 - 仕入先の在庫変動を検知'),
  ('inventory_sync', true, 15, '有在庫商品の在庫同期 - 各マーケットプレイスに在庫数を同期')
ON CONFLICT (cron_type) DO NOTHING;

-- =====================================================
-- 3. cron_execution_logs: Cron実行ログテーブル
-- =====================================================

CREATE TABLE IF NOT EXISTS cron_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cron_type TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  status TEXT DEFAULT 'running', -- 'running' | 'completed' | 'error'
  processed_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  result JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE cron_execution_logs IS 'Cronジョブの実行ログ';

-- インデックス
CREATE INDEX IF NOT EXISTS idx_cron_logs_type_date 
ON cron_execution_logs (cron_type, started_at DESC);

-- 古いログの自動削除（30日以上前）
-- CREATE OR REPLACE FUNCTION cleanup_old_cron_logs() RETURNS void AS $$
-- BEGIN
--   DELETE FROM cron_execution_logs WHERE created_at < now() - interval '30 days';
-- END;
-- $$ LANGUAGE plpgsql;

-- =====================================================
-- 4. 既存テーブルとの整合性確認
-- =====================================================

-- monitoring_schedules が存在しない場合は作成
CREATE TABLE IF NOT EXISTS monitoring_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled BOOLEAN DEFAULT true,
  name TEXT DEFAULT '在庫監視スケジュール',
  frequency TEXT DEFAULT 'hourly', -- 'hourly' | 'daily' | 'every_3h' | 'every_6h' | 'custom'
  time_window_start TEXT DEFAULT '09:00',
  time_window_end TEXT DEFAULT '21:00',
  max_items_per_batch INTEGER DEFAULT 50,
  delay_min_seconds INTEGER DEFAULT 2,
  delay_max_seconds INTEGER DEFAULT 5,
  random_time_offset_minutes INTEGER DEFAULT 0,
  use_random_user_agent BOOLEAN DEFAULT true,
  email_notification BOOLEAN DEFAULT false,
  notification_emails TEXT[] DEFAULT '{}',
  notify_on_changes_only BOOLEAN DEFAULT true,
  notify_on_errors BOOLEAN DEFAULT true,
  next_execution_at TIMESTAMPTZ,
  last_execution_at TIMESTAMPTZ,
  last_execution_log_id UUID,
  max_consecutive_errors INTEGER DEFAULT 3,
  pause_on_error_threshold BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 完了
-- =====================================================
