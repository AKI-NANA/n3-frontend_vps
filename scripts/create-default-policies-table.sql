-- デフォルトポリシーID管理テーブル
-- Supabase SQL Editorで実行

CREATE TABLE IF NOT EXISTS ebay_default_policies (
  id SERIAL PRIMARY KEY,
  policy_type VARCHAR(50) NOT NULL, -- 'payment', 'return', 'fulfillment'
  policy_id VARCHAR(100) NOT NULL,
  policy_name VARCHAR(200),
  account_id VARCHAR(100) DEFAULT 'main_account',
  marketplace VARCHAR(50) DEFAULT 'EBAY_US',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(policy_type, account_id, marketplace)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_default_policies_type 
ON ebay_default_policies(policy_type);

CREATE INDEX IF NOT EXISTS idx_default_policies_active 
ON ebay_default_policies(is_active);

-- コメント追加
COMMENT ON TABLE ebay_default_policies IS 'eBayのデフォルトポリシーID管理';
COMMENT ON COLUMN ebay_default_policies.policy_type IS 'ポリシータイプ: payment, return, fulfillment';
COMMENT ON COLUMN ebay_default_policies.policy_id IS 'eBay API Policy ID';
COMMENT ON COLUMN ebay_default_policies.account_id IS 'eBayアカウントID';
COMMENT ON COLUMN ebay_default_policies.marketplace IS 'マーケットプレイスID';

-- .env.localから値を挿入（実際の値に置き換えてください）
-- 例：
-- INSERT INTO ebay_default_policies (policy_type, policy_id, policy_name, account_id) VALUES
-- ('payment', 'your_payment_policy_id', 'Standard Payment', 'main_account'),
-- ('return', 'your_return_policy_id', '30-Day Return', 'main_account'),
-- ('fulfillment', 'your_fulfillment_policy_id', 'USA DDP Standard', 'main_account');
