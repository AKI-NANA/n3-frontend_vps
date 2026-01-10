-- n8n_jobs テーブル作成（n8n連携用ジョブ管理）
-- 実行日: 2026-01-10
-- 用途: n8nワークフローとN3 API間のジョブ追跡

-- テーブルが存在しない場合のみ作成
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

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_n8n_jobs_job_id ON n8n_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_n8n_jobs_workflow ON n8n_jobs(workflow);
CREATE INDEX IF NOT EXISTS idx_n8n_jobs_status ON n8n_jobs(status);
CREATE INDEX IF NOT EXISTS idx_n8n_jobs_created_at ON n8n_jobs(created_at);

-- RLSを有効化（サービスロールキーでのみアクセス可能）
ALTER TABLE n8n_jobs ENABLE ROW LEVEL SECURITY;

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_n8n_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_n8n_jobs_updated_at ON n8n_jobs;
CREATE TRIGGER trigger_n8n_jobs_updated_at
  BEFORE UPDATE ON n8n_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_n8n_jobs_updated_at();

-- コメント追加
COMMENT ON TABLE n8n_jobs IS 'n8nワークフロー連携用ジョブ管理テーブル';
COMMENT ON COLUMN n8n_jobs.job_id IS 'ジョブの一意識別子（UUID）';
COMMENT ON COLUMN n8n_jobs.workflow IS 'ワークフロー名（例: listing-by-ids, listing-by-condition）';
COMMENT ON COLUMN n8n_jobs.action IS 'アクション名（例: execute, preview）';
COMMENT ON COLUMN n8n_jobs.status IS 'ステータス（pending, processing, completed, partial, failed）';
COMMENT ON COLUMN n8n_jobs.request_data IS 'リクエストデータ（JSON）';
COMMENT ON COLUMN n8n_jobs.result IS '処理結果（JSON）';
COMMENT ON COLUMN n8n_jobs.error IS 'エラーメッセージ';

-- 統計用ビュー
CREATE OR REPLACE VIEW n8n_jobs_stats AS
SELECT 
  workflow,
  status,
  COUNT(*) as count,
  DATE_TRUNC('hour', created_at) as hour
FROM n8n_jobs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY workflow, status, DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;

COMMENT ON VIEW n8n_jobs_stats IS 'n8nジョブの統計ビュー（過去7日間）';
