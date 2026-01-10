-- eBay配送ポリシー一括登録のためのマイグレーション
-- 実行日: 2025年11月27日
-- 目的: 1,000件制限解除と既存ポリシースキップ機能のサポート

-- 1. shipping_policiesテーブルにebay_policy_idカラムを追加（なければ）
ALTER TABLE shipping_policies 
ADD COLUMN IF NOT EXISTS ebay_policy_id TEXT;

-- 2. statusカラムを追加（なければ）
ALTER TABLE shipping_policies 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- 3. error_messageカラムを追加（なければ）
ALTER TABLE shipping_policies 
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- 4. インデックスを作成
CREATE INDEX IF NOT EXISTS idx_shipping_policies_ebay_policy_id 
ON shipping_policies(ebay_policy_id);

CREATE INDEX IF NOT EXISTS idx_shipping_policies_status 
ON shipping_policies(status);

CREATE INDEX IF NOT EXISTS idx_shipping_policies_policy_name 
ON shipping_policies(policy_name);

CREATE INDEX IF NOT EXISTS idx_shipping_policies_account 
ON shipping_policies(account);

-- 5. 複合インデックス（アカウント＋ポリシー名での一意性確認用）
CREATE UNIQUE INDEX IF NOT EXISTS idx_shipping_policies_account_policy_name 
ON shipping_policies(account, policy_name);

-- 6. statusのコメント
COMMENT ON COLUMN shipping_policies.status IS 'pending: 未登録, uploaded: eBay登録済, skipped: スキップ（既存）, failed: 登録失敗';
COMMENT ON COLUMN shipping_policies.ebay_policy_id IS 'eBay fulfillmentPolicyId（eBay API登録後に取得）';
COMMENT ON COLUMN shipping_policies.error_message IS '登録失敗時のエラーメッセージ';

-- 7. 既存のaccount値を正規化（必要な場合）
-- account1 → mjt, account2 → green の変換が必要な場合
-- UPDATE shipping_policies SET account = 'mjt' WHERE account = 'account1';
-- UPDATE shipping_policies SET account = 'green' WHERE account = 'account2';

-- 8. 統計ビュー作成
CREATE OR REPLACE VIEW shipping_policy_stats AS
SELECT 
  account,
  status,
  COUNT(*) as count
FROM shipping_policies
GROUP BY account, status
ORDER BY account, status;

-- 確認用クエリ
-- SELECT * FROM shipping_policy_stats;
-- SELECT COUNT(*) FROM shipping_policies WHERE ebay_policy_id IS NOT NULL;
