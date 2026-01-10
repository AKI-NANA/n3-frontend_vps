-- eBay Rate Tableマッピングテーブルのマイグレーション
-- Rate Table名（例: RT_Express_1）とeBay IDのマッピングを保存

-- 1. マッピングテーブル作成
CREATE TABLE IF NOT EXISTS ebay_rate_table_mapping (
  id SERIAL PRIMARY KEY,
  account VARCHAR(50) NOT NULL,
  rate_table_name TEXT NOT NULL,
  ebay_rate_table_id TEXT NOT NULL,
  locality TEXT, -- DOMESTIC or INTERNATIONAL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(account, rate_table_name)
);

-- 2. インデックス作成
CREATE INDEX IF NOT EXISTS idx_rate_table_mapping_account 
ON ebay_rate_table_mapping(account);

CREATE INDEX IF NOT EXISTS idx_rate_table_mapping_name 
ON ebay_rate_table_mapping(rate_table_name);

-- 3. コメント追加
COMMENT ON TABLE ebay_rate_table_mapping IS 'DBのRate Table名とeBay APIのrateTableIdのマッピング';
COMMENT ON COLUMN ebay_rate_table_mapping.rate_table_name IS 'DBで使用するRate Table名（例: RT_Express_1）';
COMMENT ON COLUMN ebay_rate_table_mapping.ebay_rate_table_id IS 'eBay APIで取得したrateTableId';

-- 確認用クエリ
-- SELECT * FROM ebay_rate_table_mapping ORDER BY account, rate_table_name;
