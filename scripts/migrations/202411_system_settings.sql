-- ======================================================
-- system_settings テーブル作成
-- 自動同期設定などシステム全体の設定を保存
-- ======================================================

-- 既存テーブルがあれば削除（開発環境のみ）
-- DROP TABLE IF EXISTS system_settings;

-- テーブル作成
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(setting_key);

-- 更新時刻自動更新トリガー
CREATE OR REPLACE FUNCTION update_system_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_system_settings_updated_at ON system_settings;
CREATE TRIGGER trigger_system_settings_updated_at
  BEFORE UPDATE ON system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_system_settings_updated_at();

-- デフォルト設定を挿入
INSERT INTO system_settings (setting_key, setting_value, description)
VALUES (
  'auto_sync_config',
  '{"vercelAutoSync": false, "vercelSyncInterval": 30, "vpsAutoSync": false}'::jsonb,
  '自動同期設定（Vercel定期同期、VPS定時同期）'
)
ON CONFLICT (setting_key) DO NOTHING;

-- RLS (Row Level Security) を有効化
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーが読み書きできるポリシー（開発環境用）
DROP POLICY IF EXISTS "Allow all access to system_settings" ON system_settings;
CREATE POLICY "Allow all access to system_settings" ON system_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 確認
SELECT * FROM system_settings;
