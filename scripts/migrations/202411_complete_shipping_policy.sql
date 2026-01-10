-- =====================================================
-- 配送ポリシー完全版登録用マイグレーション
-- =====================================================

-- 1. Rate Tableマッピングテーブル
-- eBay Rate Table名（RT_Express_1）とシステムID（数値）のマッピング
CREATE TABLE IF NOT EXISTS ebay_rate_table_mapping (
  id SERIAL PRIMARY KEY,
  account VARCHAR(50) NOT NULL,
  rate_table_name TEXT NOT NULL,
  ebay_rate_table_id TEXT NOT NULL,
  locality TEXT DEFAULT 'INTERNATIONAL',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(account, rate_table_name)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_rate_table_mapping_account 
ON ebay_rate_table_mapping(account);

CREATE INDEX IF NOT EXISTS idx_rate_table_mapping_name 
ON ebay_rate_table_mapping(rate_table_name);

-- 2. shipping_policiesテーブルにカラム追加（既存の場合はスキップ）
DO $$ 
BEGIN
  -- ebay_policy_id カラム追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shipping_policies' AND column_name = 'ebay_policy_id'
  ) THEN
    ALTER TABLE shipping_policies ADD COLUMN ebay_policy_id TEXT;
  END IF;

  -- status カラム追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shipping_policies' AND column_name = 'status'
  ) THEN
    ALTER TABLE shipping_policies ADD COLUMN status TEXT DEFAULT 'pending';
  END IF;

  -- error_message カラム追加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shipping_policies' AND column_name = 'error_message'
  ) THEN
    ALTER TABLE shipping_policies ADD COLUMN error_message TEXT;
  END IF;
END $$;

-- インデックス
CREATE INDEX IF NOT EXISTS idx_shipping_policies_status 
ON shipping_policies(status);

CREATE INDEX IF NOT EXISTS idx_shipping_policies_ebay_policy_id 
ON shipping_policies(ebay_policy_id);

-- 3. コメント
COMMENT ON TABLE ebay_rate_table_mapping IS 'eBay Rate Table名とシステムIDのマッピング';
COMMENT ON COLUMN ebay_rate_table_mapping.rate_table_name IS 'Rate Table名（例: RT_Express_1）';
COMMENT ON COLUMN ebay_rate_table_mapping.ebay_rate_table_id IS 'eBAYシステム生成ID（数値文字列）';

-- 4. 確認クエリ
-- SELECT * FROM ebay_rate_table_mapping ORDER BY account, rate_table_name;
-- SELECT policy_name, rate_table_name, ebay_policy_id, status FROM shipping_policies LIMIT 10;
