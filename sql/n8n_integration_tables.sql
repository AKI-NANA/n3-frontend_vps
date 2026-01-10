-- N3 n8n連携用テーブル作成SQL
-- 実行日: 2026-01-10

-- ========================================
-- 1. n8n_jobs テーブル（ジョブ追跡）
-- ========================================
CREATE TABLE IF NOT EXISTS n8n_jobs (
  id BIGSERIAL PRIMARY KEY,
  job_id UUID UNIQUE NOT NULL,
  workflow VARCHAR(100) NOT NULL,
  action VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  request_data JSONB,
  result JSONB,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_n8n_jobs_job_id ON n8n_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_n8n_jobs_workflow ON n8n_jobs(workflow);
CREATE INDEX IF NOT EXISTS idx_n8n_jobs_status ON n8n_jobs(status);
CREATE INDEX IF NOT EXISTS idx_n8n_jobs_created_at ON n8n_jobs(created_at);

-- ========================================
-- 2. listing_schedule テーブル（n8nスケジュール管理）
-- ========================================
CREATE TABLE IF NOT EXISTS listing_schedule (
  id BIGSERIAL PRIMARY KEY,
  product_ids JSONB NOT NULL DEFAULT '[]',
  marketplace VARCHAR(50) NOT NULL DEFAULT 'ebay',
  account VARCHAR(50) NOT NULL DEFAULT 'green',
  scheduled_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  executed_at TIMESTAMPTZ,
  result VARCHAR(50),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listing_schedule_status ON listing_schedule(status);
CREATE INDEX IF NOT EXISTS idx_listing_schedule_scheduled_at ON listing_schedule(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_listing_schedule_account ON listing_schedule(account);

-- ========================================
-- 3. automation_settings テーブル（自動化設定）
-- ========================================
CREATE TABLE IF NOT EXISTS automation_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_type VARCHAR(100) NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT true,
  settings_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- デフォルト設定を挿入
INSERT INTO automation_settings (setting_type, enabled, settings_json)
VALUES 
  ('update_inventory_monitoring', true, '{"interval_minutes": 30}'),
  ('update_automation', true, '{"enabled": true}'),
  ('update_schedule', true, '{"interval_minutes": 60}')
ON CONFLICT (setting_type) DO NOTHING;

-- ========================================
-- 4. products_master にスケジュール関連カラム追加
-- ========================================
ALTER TABLE products_master 
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS scheduled_marketplace VARCHAR(50),
ADD COLUMN IF NOT EXISTS scheduled_account VARCHAR(50),
ADD COLUMN IF NOT EXISTS schedule_status VARCHAR(50) DEFAULT 'none';

CREATE INDEX IF NOT EXISTS idx_products_master_schedule_status ON products_master(schedule_status);
CREATE INDEX IF NOT EXISTS idx_products_master_scheduled_at ON products_master(scheduled_at);

-- ========================================
-- 5. 更新日時自動更新トリガー
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- n8n_jobs
DROP TRIGGER IF EXISTS trigger_n8n_jobs_updated_at ON n8n_jobs;
CREATE TRIGGER trigger_n8n_jobs_updated_at
  BEFORE UPDATE ON n8n_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- listing_schedule
DROP TRIGGER IF EXISTS trigger_listing_schedule_updated_at ON listing_schedule;
CREATE TRIGGER trigger_listing_schedule_updated_at
  BEFORE UPDATE ON listing_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- automation_settings
DROP TRIGGER IF EXISTS trigger_automation_settings_updated_at ON automation_settings;
CREATE TRIGGER trigger_automation_settings_updated_at
  BEFORE UPDATE ON automation_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 6. RLS有効化
-- ========================================
ALTER TABLE n8n_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_settings ENABLE ROW LEVEL SECURITY;

-- ========================================
-- コメント追加
-- ========================================
COMMENT ON TABLE n8n_jobs IS 'n8nワークフロー連携用ジョブ管理テーブル';
COMMENT ON TABLE listing_schedule IS 'n8nスケジュール出品管理テーブル';
COMMENT ON TABLE automation_settings IS 'n8n自動化設定テーブル';
